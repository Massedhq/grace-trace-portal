// app/api/announcements/route.ts
//
// Self-healing table: every request first runs CREATE TABLE IF NOT EXISTS
// on the connection this route actually uses (process.env.DATABASE_URL).
// This avoids the earlier problem where a table was created in a different
// Neon branch than what the live app connects to — that can't happen here
// because the table is always created by this same code, on this same
// connection, right before it's needed.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS announcements (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      body TEXT NOT NULL,
      pinned BOOLEAN DEFAULT FALSE,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT id, title, category, body, pinned, created_by, created_at
      FROM announcements
      ORDER BY pinned DESC, created_at DESC
    `;
    return Response.json({ announcements: rows });
  } catch (err) {
    console.error("GET /api/announcements failed:", err);
    return Response.json({ error: "Failed to load announcements" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { title, category, body, createdBy, pinned } = await req.json();

    if (!title || !category || !body) {
      return Response.json({ error: "title, category, and body are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO announcements (title, category, body, pinned, created_by)
      VALUES (${title}, ${category}, ${body}, ${!!pinned}, ${createdBy || null})
      RETURNING id, title, category, body, pinned, created_by, created_at
    `;

    return Response.json({ announcement: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/announcements failed:", err);
    return Response.json({ error: "Failed to save announcement" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTable();
    const { id } = await req.json();
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await sql`DELETE FROM announcements WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/announcements failed:", err);
    return Response.json({ error: "Failed to delete announcement" }, { status: 500 });
  }
}