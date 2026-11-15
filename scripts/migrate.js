const net = require('net');
const crypto = require('crypto');
const { Pool } = require('pg');
const fs = require('fs');

// Read .env if not loaded
if (!process.env.DATABASE_URL && fs.existsSync('.env')) {
  const content = fs.readFileSync('.env', 'utf8');
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        process.env[key] = val;
      }
    }
  });
}

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

async function run() {
  console.log('[Schema Runner] Connecting to database...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    stream: () => {
      const s = new net.Socket();
      const origConnect = s.connect;
      s.connect = function (...args) {
        if (typeof args[0] === 'number') {
          return origConnect.call(
            this,
            { port: args[0], host: args[1], family: 4, autoSelectFamily: false },
            args[2]
          );
        }
        return origConnect.apply(this, args);
      };
      return s;
    },
  });

  const client = await pool.connect();
  console.log('[Schema Runner] Connected successfully!');

  try {
    console.log('[Schema Runner] Creating tables and indexes...');
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
    console.log('[Schema Runner] Tables and indexes created successfully!');

    // Seed default admin
    const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || 'admin@juricious.com').trim().toLowerCase();
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@1234';
    const hashedPassword = hashPassword(defaultPassword);

    const adminCheck = await client.query('SELECT id, password FROM admin_users WHERE LOWER(email) = $1', [defaultEmail]);
    if (adminCheck.rows.length === 0) {
      await client.query(
        `INSERT INTO admin_users (id, email, password, role, created_at, updated_at)
         VALUES ($1, $2, $3, 'admin', NOW(), NOW())
         ON CONFLICT (email) DO NOTHING`,
        ['admin_root', defaultEmail, hashedPassword]
      );
      console.log(`[Schema Runner] Seeded default admin: ${defaultEmail}`);
    } else {
      console.log(`[Schema Runner] Admin already exists: ${defaultEmail}`);
    }

    // Verify existing tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    console.log('[Schema Runner] Verified public tables:', tablesRes.rows.map(r => r.table_name));

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch((err) => {
  console.error('[Schema Runner] Fatal error:', err);
  process.exit(1);
});
