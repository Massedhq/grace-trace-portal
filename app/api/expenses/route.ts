import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_expenses (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await initDB();
    const rows = await sql`SELECT data FROM gtm_expenses ORDER BY updated_at DESC`;
    const expenses = rows.map((r: any) => r.data);
    return NextResponse.json(expenses);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const expenses = await req.json();
    await sql`DELETE FROM gtm_expenses`;
    for (const expense of expenses) {
      await sql`
        INSERT INTO gtm_expenses (id, data)
        VALUES (${expense.id}, ${JSON.stringify(expense)})
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(expense)}, updated_at = NOW()
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}