import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

async function initDB() {
  await sql`
    CREATE TABLE IF NOT EXISTS gtm_push_subscriptions (
      user_id TEXT PRIMARY KEY,
      subscription JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await initDB();
    const rows = await sql`SELECT user_id, subscription FROM gtm_push_subscriptions`;
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    await initDB();
    const { userId, subscription } = await req.json();
    await sql`
      INSERT INTO gtm_push_subscriptions (user_id, subscription)
      VALUES (${userId}, ${JSON.stringify(subscription)})
      ON CONFLICT (user_id) DO UPDATE SET subscription = ${JSON.stringify(subscription)}, updated_at = NOW()
    `;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}