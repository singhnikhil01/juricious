import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, createSession, deleteSession, verifyAuth, getSessionTokenFromRequest } from '@/lib/auth';


// 7 days in seconds
const MAX_AGE = 7 * 24 * 60 * 60;

function createCookieHeader(token: string): string {
  const isProd = process.env.NODE_ENV === 'production';
  return `juricious_admin_session=${encodeURIComponent(token)}; Path=/; Max-Age=${MAX_AGE}; HttpOnly; SameSite=Lax${
    isProd ? '; Secure' : ''
  }`;
}

function clearCookieHeader(): string {
  return `juricious_admin_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`;
}

// Check session / get current admin
export async function GET(request: Request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Session is invalid or expired' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: auth.user,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Login
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const result = await query(
      'SELECT id, email, password, role FROM admin_users WHERE LOWER(email) = $1',
      [cleanEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No admin account found with that email address.' },
        { status: 401 }
      );
    }

    const user = result.rows[0];
    const isPwValid = verifyPassword(password, user.password);

    if (!isPwValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect password. Please try again.' },
        { status: 401 }
      );
    }

    // Create session in database
    const sessionToken = await createSession(user.id);

    // Audit log
    const now = new Date().toISOString();
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'LOGIN_SUCCESS', 'auth', 'session_active', 'Admin authenticated via PostgreSQL session', $3)`,
      [`log_${Date.now()}`, cleanEmail, now]
    );

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
      token: sessionToken,
    });

    // Set secure HTTP-only cookie
    response.headers.append('Set-Cookie', createCookieHeader(sessionToken));

    return response;
  } catch (err: any) {
    console.error('API /api/admin/auth error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Database connection error' },
      { status: 500 }
    );
  }
}

// Logout
export async function DELETE(request: Request) {
  try {
    const token = getSessionTokenFromRequest(request);
    if (token) {
      await deleteSession(token);
    }

    const response = NextResponse.json({ success: true, message: 'Logged out successfully' });
    response.headers.append('Set-Cookie', clearCookieHeader());
    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
