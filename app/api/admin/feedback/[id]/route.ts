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
    const { status, tags } = body;
    const now = new Date().toISOString();

    const updates: string[] = ['updated_at = $1'];
    const values: any[] = [now];
    let counter = 2;

    if (status !== undefined) {
      updates.push(`status = $${counter}`);
      values.push(status);
      counter++;
    }

    if (tags !== undefined) {
      updates.push(`tags = $${counter}::jsonb`);
      values.push(JSON.stringify(tags));
      counter++;
    }

    values.push(id);
    const sql = `UPDATE feedback SET ${updates.join(', ')} WHERE id = $${counter}`;
    await query(sql, values);

    // Audit log
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'UPDATE_FEEDBACK', 'feedback', $3, 'Updated feedback item status/tags', $4)`,
      [`log_${Date.now()}`, auth.user.email, id, now]
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
    await query('DELETE FROM feedback WHERE id = $1', [id]);

    const now = new Date().toISOString();
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'DELETE_FEEDBACK', 'feedback', $3, 'Deleted feedback item', $4)`,
      [`log_${Date.now()}`, auth.user.email, id, now]
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
