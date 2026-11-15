import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyAuth } from '@/lib/auth';


export async function GET(request: Request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const res = await query(
      `SELECT
        id, name, email, phone, role, place, first_feature as "firstFeature",
        note, consent, consent_timestamp as "consentTimestamp", status,
        internal_notes as "internalNotes", source, status_history as "statusHistory",
        created_at as "createdAt", updated_at as "updatedAt"
       FROM waitlist
       ORDER BY created_at DESC`
    );

    const formatted = res.rows.map((row) => ({
      ...row,
      statusHistory: typeof row.statusHistory === 'string' ? JSON.parse(row.statusHistory) : row.statusHistory || [],
    }));

    return NextResponse.json({ success: true, waitlist: formatted });
  } catch (err: any) {
    if (err?.digest === 'NEXT_PRERENDER_INTERRUPTED') throw err;
    console.error('API /api/admin/waitlist GET error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Bulk delete
export async function DELETE(request: Request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { ids } = body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'Ids array required' }, { status: 400 });
    }

    await query('DELETE FROM waitlist WHERE id = ANY($1)', [ids]);

    // Audit log
    const now = new Date().toISOString();
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'BULK_DELETE', 'waitlist', $3, $4, $5)`,
      [`log_${Date.now()}`, auth.user.email, ids.join(','), `Deleted ${ids.length} waitlist records`, now]
    );

    return NextResponse.json({ success: true, count: ids.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// Bulk status update
export async function PATCH(request: Request) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Admin authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { ids, status } = body;
    if (!ids || !Array.isArray(ids) || !status) {
      return NextResponse.json({ success: false, error: 'Ids and status required' }, { status: 400 });
    }

    const now = new Date().toISOString();
    await query(
      `UPDATE waitlist
       SET status = $1, updated_at = $2
       WHERE id = ANY($3)`,
      [status, now, ids]
    );

    // Audit log
    await query(
      `INSERT INTO audit_logs (id, actor_email, action, target_entity, target_id, details, timestamp)
       VALUES ($1, $2, 'BULK_STATUS_CHANGE', 'waitlist', $3, $4, $5)`,
      [`log_${Date.now()}`, auth.user.email, ids.join(','), `Bulk updated ${ids.length} records to status: ${status}`, now]
    );

    return NextResponse.json({ success: true, count: ids.length });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
