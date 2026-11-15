import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { kind, message, name, email, honeypot } = body;

    // Honeypot spam check
    if (honeypot && honeypot.trim().length > 0) {
      return NextResponse.json({ success: true });
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
    }

    const id = `fb_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    await query(
      `INSERT INTO feedback (id, kind, message, name, email, status, tags, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, 'New', '[]'::jsonb, $6, $7)`,
      [
        id,
        kind || 'Idea',
        message.trim(),
        name?.trim() || null,
        cleanEmail,
        now,
        now,
      ]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'FEEDBACK_SUBMISSION', 'feedback', $3, $4, $5)`,
      [`log_${Date.now()}`, cleanEmail || 'anonymous', id, `Feedback submitted (${kind || 'Idea'})`, now]
    );

    return NextResponse.json({ success: true, id }, { status: 201 });
  } catch (err: any) {
    console.error('API /api/feedback error:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Database error occurred' },
      { status: 500 }
    );
  }
}
