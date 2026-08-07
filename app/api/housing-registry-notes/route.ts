// app/api/housing-registry-notes/route.ts
// Staff notes for individual housing registry records.
// Each note is timestamped and attributed to the staff member who wrote it.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS housing_registry_notes (
      id SERIAL PRIMARY KEY,
      registrant_id INTEGER NOT NULL,
      staff_id TEXT NOT NULL,
      staff_name TEXT NOT NULL,
      note_text TEXT NOT NULL,
      note_type TEXT NOT NULL DEFAULT 'manual',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const registrant_id = searchParams.get("registrant_id");
    if (!registrant_id) {
      return Response.json({ error: "registrant_id is required" }, { status: 400 });
    }
    const rows = await sql`
      SELECT * FROM housing_registry_notes
      WHERE registrant_id = ${registrant_id}
      ORDER BY created_at ASC
    `;
    return Response.json({ notes: rows });
  } catch (err) {
    console.error("GET /api/housing-registry-notes failed:", err);
    return Response.json({ error: "Failed to load notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { registrant_id, staff_id, staff_name, note_text, note_type } = await req.json();
    if (!registrant_id || !staff_id || !staff_name || !note_text) {
      return Response.json({ error: "registrant_id, staff_id, staff_name, and note_text are required" }, { status: 400 });
    }
    const [row] = await sql`
      INSERT INTO housing_registry_notes (registrant_id, staff_id, staff_name, note_text, note_type)
      VALUES (${registrant_id}, ${staff_id}, ${staff_name}, ${note_text}, ${note_type || "manual"})
      RETURNING *
    `;

    // Also update the registrant's updated_at so seen-by alerts fire
    await sql`
      UPDATE housing_registry SET updated_at = NOW() WHERE id = ${registrant_id}
    `;

    return Response.json({ note: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/housing-registry-notes failed:", err);
    return Response.json({ error: "Failed to save note" }, { status: 500 });
  }
}