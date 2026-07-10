import { neon } from '@neondatabase/serverless';
export const runtime = 'edge';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_meetings (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await initDB();
    const rows = await sql`SELECT data FROM gtm_meetings ORDER BY updated_at DESC`;
    const meetings = rows.map((r: any) => r.data);
    return NextResponse.json(meetings);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const meetings = await req.json();
    await sql`DELETE FROM gtm_meetings`;
    for (const meeting of meetings) {
      await sql`
        INSERT INTO gtm_meetings (id, data)
        VALUES (${meeting.id}, ${JSON.stringify(meeting)})
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(meeting)}, updated_at = NOW()
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}