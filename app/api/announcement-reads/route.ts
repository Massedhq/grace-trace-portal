// app/api/announcement-reads/route.ts
//
// Tracks which staff have acknowledged reading each announcement.
// Self-healing table, same pattern as /api/announcements.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS announcement_reads (
      id SERIAL PRIMARY KEY,
      announcement_id INTEGER NOT NULL,
      staff_id TEXT NOT NULL,
      staff_name TEXT NOT NULL,
      read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (announcement_id, staff_id)
    )
  `;
}

// Returns ALL reads across all announcements — the frontend groups them by announcement_id
// client-side so we only need one request instead of one per announcement.
export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT announcement_id, staff_id, staff_name, read_at
      FROM announcement_reads
      ORDER BY read_at DESC
    `;
    return Response.json({ reads: rows });
  } catch (err) {
    console.error("GET /api/announcement-reads failed:", err);
    return Response.json({ error: "Failed to load read status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { announcementId, staffId, staffName } = await req.json();

    if (!announcementId || !staffId || !staffName) {
      return Response.json({ error: "announcementId, staffId, and staffName are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO announcement_reads (announcement_id, staff_id, staff_name)
      VALUES (${announcementId}, ${staffId}, ${staffName})
      ON CONFLICT (announcement_id, staff_id) DO NOTHING
      RETURNING announcement_id, staff_id, staff_name, read_at
    `;

    // If it already existed, ON CONFLICT DO NOTHING returns no row — fetch it instead
    if (row) {
      return Response.json({ read: row }, { status: 201 });
    }
    const [existing] = await sql`
      SELECT announcement_id, staff_id, staff_name, read_at
      FROM announcement_reads
      WHERE announcement_id = ${announcementId} AND staff_id = ${staffId}
    `;
    return Response.json({ read: existing }, { status: 200 });
  } catch (err) {
    console.error("POST /api/announcement-reads failed:", err);
    return Response.json({ error: "Failed to save read status" }, { status: 500 });
  }
}