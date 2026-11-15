import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { status, internalNotes, statusHistory } = body;
    const now = new Date().toISOString();

    const updates: string[] = ['updated_at = $1'];
    const values: any[] = [now];
    let counter = 2;

    if (status !== undefined) {
      updates.push(`status = $${counter}`);
      values.push(status);
      counter++;
    }

    if (internalNotes !== undefined) {
      updates.push(`internal_notes = $${counter}`);
      values.push(internalNotes);
      counter++;
    }

    if (statusHistory !== undefined) {
      updates.push(`status_history = $${counter}::jsonb`);
      values.push(JSON.stringify(statusHistory));
      counter++;
    }

    values.push(id);
    const sql = `UPDATE waitlist SET ${updates.join(', ')} WHERE id = $${counter}`;
    await query(sql, values);

    // Audit log
    const changes: string[] = [];
    if (status) changes.push(`status to '${status}'`);
    if (internalNotes !== undefined) changes.push('internal notes');
    const changeDesc = changes.length > 0 ? changes.join(', ') : 'details';

    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'UPDATE_WAITLIST', 'waitlist', $3, $4, $5)`,
      [`log_${Date.now()}`, auth.user.email, id, `Updated waitlist entry ${changeDesc}`, now]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const { id } = await params;
    await query('DELETE FROM waitlist WHERE id = $1', [id]);

    const now = new Date().toISOString();
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'DELETE_WAITLIST', 'waitlist', $3, 'Deleted waitlist entry', $4)`,
      [`log_${Date.now()}`, auth.user.email, id, now]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
