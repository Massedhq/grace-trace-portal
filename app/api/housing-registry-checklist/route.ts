// app/api/housing-registry-checklist/route.ts
// Tracks pre-arrival checklist completion per registrant.
// Each checklist item stores which staff completed it and when.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS housing_registry_checklist (
      id SERIAL PRIMARY KEY,
      registrant_id INTEGER NOT NULL,
      item_key TEXT NOT NULL,
      item_label TEXT NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      completed_by_id TEXT,
      completed_by_name TEXT,
      completion_note TEXT,
      completed_at TIMESTAMPTZ,
      UNIQUE (registrant_id, item_key)
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
      SELECT * FROM housing_registry_checklist
      WHERE registrant_id = ${registrant_id}
      ORDER BY id ASC
    `;
    return Response.json({ checklist: rows });
  } catch (err) {
    console.error("GET /api/housing-registry-checklist failed:", err);
    return Response.json({ error: "Failed to load checklist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { registrant_id, item_key, item_label, completed, completed_by_id, completed_by_name, completion_note } = await req.json();
    if (!registrant_id || !item_key || !item_label) {
      return Response.json({ error: "registrant_id, item_key, and item_label are required" }, { status: 400 });
    }
    const [row] = await sql`
      INSERT INTO housing_registry_checklist (registrant_id, item_key, item_label, completed, completed_by_id, completed_by_name, completion_note, completed_at)
      VALUES (${registrant_id}, ${item_key}, ${item_label}, ${completed || false}, ${completed_by_id || null}, ${completed_by_name || null}, ${completion_note || null}, ${completed ? "NOW()" : null})
      ON CONFLICT (registrant_id, item_key) DO UPDATE
        SET completed = ${completed || false},
            completed_by_id = ${completed_by_id || null},
            completed_by_name = ${completed_by_name || null},
            completion_note = ${completion_note || null},
            completed_at = ${completed ? sql`NOW()` : null}
      RETURNING *
    `;

    await sql`UPDATE housing_registry SET updated_at = NOW() WHERE id = ${registrant_id}`;

    return Response.json({ item: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/housing-registry-checklist failed:", err);
    return Response.json({ error: "Failed to save checklist item" }, { status: 500 });
  }
}