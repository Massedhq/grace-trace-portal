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

    rows.forEach((r: any) => {
      result[r.user_id] = r.data;
    });

    const STAFF_IDS = ["avy","travis","deann","erica","ialana","aubreyon","dennis"];

    // All possible old key formats that may have been used
    STAFF_IDS.forEach(uid => {
      const possibleKeys = [
        uid,                          // "deann"
        "gtm_orientation_" + uid,     // "gtm_orientation_deann"
        "orientation_" + uid,         // "orientation_deann"
        "binder_" + uid,              // "binder_deann" (current correct key)
      ];

      // Find any signed entry under any old key
      let signedData: any = null;
      possibleKeys.forEach(key => {
        if (result[key] && result[key].signed && !signedData) {
          signedData = result[key];
        }
      });

      // If found, make sure BOTH current keys exist
      if (signedData) {
        result["binder_" + uid] = signedData;
        result["orientation_" + uid] = signedData;
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