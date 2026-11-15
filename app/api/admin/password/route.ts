import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth, verifyPassword, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { email, currentPassword, newPassword } = body;

    const targetEmail = (email || auth.user.email).trim().toLowerCase();

    // Verify non-root admins can't change others' passwords unless role is admin
    if (auth.user.email.toLowerCase() !== targetEmail && auth.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Cannot change password for other accounts' },
        { status: 403 }
      );
    }

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: 'Current password and new password are required' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT id, password FROM admin_users WHERE LOWER(email) = $1',
      [targetEmail]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Account not found' }, { status: 404 });
    }

    const isCurrentValid = verifyPassword(currentPassword, result.rows[0].password);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: 'Current password is incorrect' },
        { status: 401 }
      );
    }

    const newHashed = hashPassword(newPassword);
    const now = new Date().toISOString();

    await query(
      'UPDATE admin_users SET password = $1, updated_at = $2 WHERE LOWER(email) = $3',
      [newHashed, now, targetEmail]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'PASSWORD_CHANGED', 'auth', 'credentials', 'Admin password securely updated in PostgreSQL', $3)`,
      [`log_${Date.now()}`, auth.user.email, now]
    );

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (err: any) {
    console.error('API /api/admin/password error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
