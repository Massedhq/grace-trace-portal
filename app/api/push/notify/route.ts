import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  try {
    const { title, body, url } = await req.json();

    // Get all subscriptions
    const rows = await sql`SELECT subscription FROM gtm_push_subscriptions`;

    const payload = JSON.stringify({ title, body, url });

    // Send to all subscribers using Web Push
    const results = await Promise.allSettled(
      rows.map(async (row: any) => {
        const sub = row.subscription;
        try {
          await fetch(sub.endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'TTL': '86400',
            },
            body: payload,
          });
        } catch(e) {}
      })
    );

    return NextResponse.json({ ok: true, sent: rows.length });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}