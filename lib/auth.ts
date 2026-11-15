import crypto from 'crypto';
import { query } from './db';

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Hashes a password using PBKDF2/scrypt with a random salt.
 * Stored format: "salt:hash"
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against the stored string.
 * Handles both "salt:hash" format and legacy plain-text fallback.
 */
export function verifyPassword(password: string, stored: string): boolean {
  if (!stored) return false;

  // Plaintext match fallback (e.g. initial seed before first migration)
  if (!stored.includes(':')) {
    return password === stored;
  }

  const [salt, expectedHash] = stored.split(':');
  if (!salt || !expectedHash) return false;

  const actualHash = crypto.scryptSync(password, salt, 64).toString('hex');
  const actualBuffer = Buffer.from(actualHash, 'hex');
  const expectedBuffer = Buffer.from(expectedHash, 'hex');

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

/**
 * Creates a session for an admin user and stores it in the database.
 */
export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = `sess_${Date.now().toString(36)}_${crypto.randomBytes(4).toString('hex')}`;
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS).toISOString();

  await query(
    `INSERT INTO admin_sessions (id, user_id, token, expires_at, created_at)
     VALUES ($1, $2, $3, $4, NOW())`,
    [sessionId, userId, token, expiresAt]
  );

  return token;
}

/**
 * Deletes a session by token.
 */
export async function deleteSession(token: string): Promise<void> {
  if (!token) return;
  await query('DELETE FROM admin_sessions WHERE token = $1', [token]);
}

/**
 * Extracts session token from Request (via Authorization header or Cookie).
 */
export function getSessionTokenFromRequest(request: Request): string | null {
  // 1. Check Authorization: Bearer <token>
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 2. Check Cookie
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/(?:^|;\s*)juricious_admin_session=([^;]+)/);
  if (match && match[1]) {
    return decodeURIComponent(match[1].trim());
  }

  return null;
}

/**
 * Verifies whether the incoming request is authenticated as an admin.
 */
export async function verifyAuth(request: Request): Promise<{
  authenticated: boolean;
  user?: { id: string; email: string; role: string };
  token?: string;
}> {
  try {
    const token = getSessionTokenFromRequest(request);
    if (!token) {
      return { authenticated: false };
    }

    const res = await query(
      `SELECT u.id, u.email, u.role, s.expires_at
       FROM admin_sessions s
       JOIN admin_users u ON s.user_id = u.id
       WHERE s.token = $1 AND s.expires_at > NOW()`,
      [token]
    );

    if (res.rows.length === 0) {
      return { authenticated: false };
    }

    const row = res.rows[0];
    return {
      authenticated: true,
      token,
      user: {
        id: row.id,
        email: row.email,
        role: row.role,
      },
    };
  } catch (err) {
    if ((err as any)?.digest === 'NEXT_PRERENDER_INTERRUPTED') {
      throw err;
    }
    console.error('[verifyAuth error]:', err);
    return { authenticated: false };
  }
}
