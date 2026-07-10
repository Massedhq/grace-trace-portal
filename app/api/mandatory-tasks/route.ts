import { neon } from '@neondatabase/serverless';
export const runtime = 'edge';
import { NextResponse } from 'next/server';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_mandatory_tasks (
      id TEXT PRIMARY KEY,
      data JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await initDB();
    const rows = await sql`SELECT data FROM gtm_mandatory_tasks ORDER BY (data->>'createdOn') DESC`;
    const tasks = rows.map((r: any) => r.data);
    return NextResponse.json(tasks);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const tasks = await req.json();
    // Delete all and reinsert
    await sql`DELETE FROM gtm_mandatory_tasks`;
    for (const task of tasks) {
      await sql`
        INSERT INTO gtm_mandatory_tasks (id, data)
        VALUES (${task.id}, ${JSON.stringify(task)})
        ON CONFLICT (id) DO UPDATE SET data = ${JSON.stringify(task)}, updated_at = NOW()
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}