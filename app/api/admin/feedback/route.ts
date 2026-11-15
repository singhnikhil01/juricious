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
        id, kind, message, name, email, status, tags,
        created_at as "createdAt", updated_at as "updatedAt"
       FROM feedback
       ORDER BY created_at DESC`
    );

    const formatted = res.rows.map((row) => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags || [],
    }));

    return NextResponse.json({ success: true, feedback: formatted });
  } catch (err: any) {
    if (err?.digest === 'NEXT_PRERENDER_INTERRUPTED') throw err;
    console.error('API /api/admin/feedback error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
