import net from 'net';
import crypto from 'crypto';
import { Pool, PoolConfig } from 'pg';

let poolInstance: Pool | null = null;
let initPromise: Promise<void> | null = null;

function hashDefaultPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function getPool(): Pool {
  if (poolInstance) {
    return poolInstance;
  }

  const databaseUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/juricious';

  const config: PoolConfig = {
    connectionString: databaseUrl,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    // Ensure IPv4 socket connection to prevent Node.js IPv6 ETIMEDOUT on systems with unreachable IPv6
    stream: () => {
      const s = new net.Socket();
      const origConnect = s.connect;
      s.connect = function (...args: any[]) {
        if (typeof args[0] === 'number') {
          return (origConnect as any).call(
            this,
            { port: args[0], host: args[1], family: 4, autoSelectFamily: false },
            args[2]
          );
        }
        return (origConnect as any).apply(this, args);
      };
      return s;
    },
  };

  // Enable SSL if connecting to remote services (e.g., Supabase, Neon, AWS) or if sslmode is in URL
  if (
    process.env.NODE_ENV === 'production' ||
    databaseUrl.includes('sslmode=require') ||
    databaseUrl.includes('supabase.co') ||
    databaseUrl.includes('neon.tech')
  ) {
    config.ssl = { rejectUnauthorized: false };
  }

  poolInstance = new Pool(config);

  poolInstance.on('error', (err) => {
    console.error('[PostgreSQL] Unexpected pool client error:', err.message);
  });

  return poolInstance;
}

export async function query(text: string, params?: any[]) {
  await ensureDbInitialized();
  const pool = getPool();
  return pool.query(text, params);
}

export async function ensureDbInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = initPostgresSchema().catch((err) => {
      console.error('[PostgreSQL] Database schema initialization error:', err);
      initPromise = null; // allow retry on next request
      throw err;
    });
  }
  return initPromise;
}

export async function initPostgresSchema() {
  const pool = getPool();
  const client = await pool.connect();

  try {
    // 1. Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(32) NOT NULL DEFAULT 'admin',
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS admin_sessions (
        id VARCHAR(128) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS waitlist (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(64),
        role VARCHAR(64) NOT NULL,
        place VARCHAR(255),
        first_feature VARCHAR(255),
        note TEXT,
        consent BOOLEAN NOT NULL DEFAULT TRUE,
        consent_timestamp TIMESTAMPTZ DEFAULT NOW(),
        status VARCHAR(32) NOT NULL DEFAULT 'New',
        internal_notes TEXT DEFAULT '',
        source VARCHAR(128) DEFAULT 'Public site',
        status_history JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS feedback (
        id VARCHAR(64) PRIMARY KEY,
        kind VARCHAR(64) NOT NULL,
        message TEXT NOT NULL,
        name VARCHAR(255),
        email VARCHAR(255),
        status VARCHAR(32) NOT NULL DEFAULT 'New',
        tags JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS audit_logs (
        id VARCHAR(64) PRIMARY KEY,
        actor_email VARCHAR(255) NOT NULL,
        action VARCHAR(64) NOT NULL,
        target_entity VARCHAR(64) NOT NULL,
        target_id VARCHAR(64) NOT NULL,
        details TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
      CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
      CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
      CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
      CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp DESC);
    `);

    // 2. Seed Default Admin if not exists
    const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@juricious.com').trim().toLowerCase();
    const rawDefaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@1234';
    const hashedPassword = hashDefaultPassword(rawDefaultPassword);

    const adminCheck = await client.query('SELECT id, password FROM admin_users WHERE LOWER(email) = $1', [defaultEmail]);
    if (adminCheck.rows.length === 0) {
      await client.query(
        `INSERT INTO admin_users (id, email, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, 'admin', NOW(), NOW())
         ON CONFLICT (email) DO NOTHING`,
        ['admin_root', defaultEmail, hashedPassword]
      );
    } else {
      // If existing user has plaintext password, upgrade to hash
      const currentPw = adminCheck.rows[0].password;
      if (currentPw && !currentPw.includes(':')) {
        await client.query(
          `UPDATE admin_users SET password = $1, updated_at = NOW() WHERE id = $2`,
          [hashDefaultPassword(currentPw), adminCheck.rows[0].id]
        );
      }
    }
  } finally {
    client.release();
  }
}
