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
        id,
        actor_email as "actorEmail",
        action,
        target_entity as "targetEntity",
        target_id as "targetId",
        details,
        timestamp
       FROM audit_logs
       ORDER BY timestamp DESC
       LIMIT 100`
    );

    return NextResponse.json({ success: true, auditLogs: res.rows });
  } catch (err: any) {
    if (err?.digest === 'NEXT_PRERENDER_INTERRUPTED') throw err;
    console.error('API /api/admin/audit error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
