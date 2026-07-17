import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_compensation (
      user_id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET(req: Request) {
  try {
    await initDB();
    const rows = await sql`SELECT user_id, data FROM gtm_compensation`;
    const result: Record<string, any> = {};
    rows.forEach((r: any) => { result[r.user_id] = r.data; });
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
      INSERT INTO gtm_compensation (user_id, data)
      VALUES (${userId}, ${JSON.stringify(data)})
      ON CONFLICT (user_id) DO UPDATE SET data = ${JSON.stringify(data)}, updated_at = NOW()
    `;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}