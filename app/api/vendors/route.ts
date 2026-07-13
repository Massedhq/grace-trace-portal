import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_vendors (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await initDB();
    const rows = await sql`SELECT data FROM gtm_vendors ORDER BY updated_at DESC`;
    return NextResponse.json(rows.map((r: any) => r.data));
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const vendors = await req.json();
    await sql`DELETE FROM gtm_vendors`;
    for (const vendor of vendors) {
      await sql`
        INSERT INTO gtm_vendors (id, data)
        VALUES (${vendor.id}, ${JSON.stringify(vendor)})
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(vendor)}, updated_at = NOW()
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}