import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_signatures (
      user_id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await initDB();
    const rows = await sql`SELECT user_id, data FROM gtm_signatures`;
    const result: Record<string, any> = {};
    
    const STAFF_IDS = ["avy","travis","deann","erica","ialana","aubreyon","dennis"];
    
    rows.forEach((r: any) => {
      result[r.user_id] = r.data;
    });

    // Migrate old keys to new format automatically
    // If someone signed as "deann" (old key), copy it to "binder_deann" and "orientation_deann"
    STAFF_IDS.forEach(uid => {
      // Old format: just uid
      if (result[uid] && result[uid].signed) {
        if (!result["binder_" + uid]) result["binder_" + uid] = result[uid];
        if (!result["orientation_" + uid]) result["orientation_" + uid] = result[uid];
      }
      // Old format: gtm_orientation_uid
      const oldKey = "gtm_orientation_" + uid;
      if (result[oldKey] && result[oldKey].signed) {
        if (!result["binder_" + uid]) result["binder_" + uid] = result[oldKey];
        if (!result["orientation_" + uid]) result["orientation_" + uid] = result[oldKey];
      }
    });

    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({}, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const { userId, data } = await req.json();
    await sql`
      INSERT INTO gtm_signatures (user_id, data)
      VALUES (${userId}, ${JSON.stringify(data)})
      ON CONFLICT (user_id) DO UPDATE SET data = ${JSON.stringify(data)}, updated_at = NOW()
    `;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}