import { NextResponse } from 'next/server';
import { query } from '@/lib/db';


export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, email, phone, role, place, firstFeature, note, consent, source } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Full name is required' }, { status: 400 });
    }

    if (!email || !email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ success: false, error: 'Valid email address is required' }, { status: 400 });
    }

    if (!role) {
      return NextResponse.json({ success: false, error: 'Role in chambers is required' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check duplicate
    const existing = await query('SELECT id FROM waitlist WHERE LOWER(email) = $1', [cleanEmail]);
    if (existing.rows.length > 0) {
      return NextResponse.json(
        { success: false, error: 'This email is already on the waitlist.', errorType: 'duplicate' },
        { status: 409 }
      );
    }

    const id = `wl_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const history = JSON.stringify([{ status: 'New', changedAt: now, changedBy: 'Public Form' }]);

    await query(
      `INSERT INTO waitlist (
        id, name, email, phone, role, place, first_feature, note,
        consent, consent_timestamp, status, internal_notes, source,
        status_history, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
      [
        id,
        name.trim(),
        cleanEmail,
        phone?.trim() || null,
        role,
        place?.trim() || null,
        firstFeature || null,
        note?.trim() || null,
        consent ?? true,
        now,
        'New',
        '',
        source || 'Waitlist form',
        history,
        now,
        now,
      ]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'WAITLIST_SUBMISSION', 'waitlist', $3, $4, $5)`,
      [`log_${Date.now()}`, cleanEmail, id, `Public signup from ${source || 'waitlist form'} (${role})`, now]
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err: any) {
    console.error('API /api/waitlist error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Database error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const res = await query('SELECT COUNT(*) as count FROM waitlist');
    return NextResponse.json({ success: true, total: parseInt(res.rows[0].count, 10) });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
