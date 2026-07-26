// app/api/resource-templates/route.ts
//
// Self-healing table, same pattern as /api/announcements.
// director_id is a staff id (e.g. "deann") or "all" for everyone.
// section is one of: "Learning Center" | "Templates" | "Forms" | "Documents" | "Completed Examples"

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS resource_templates (
      id SERIAL PRIMARY KEY,
      director_id TEXT NOT NULL,
      category TEXT NOT NULL,
      section TEXT NOT NULL,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_by TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const directorId = searchParams.get("director");

    const rows = directorId
      ? await sql`
          SELECT * FROM resource_templates
          WHERE director_id = ${directorId} OR director_id = 'all'
          ORDER BY category ASC, section ASC, updated_at DESC
        `
      : await sql`SELECT * FROM resource_templates ORDER BY director_id ASC, category ASC, section ASC, updated_at DESC`;

    return Response.json({ templates: rows });
  } catch (err) {
    console.error("GET /api/resource-templates failed:", err);
    return Response.json({ error: "Failed to load templates" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { directorId, category, section, title, body, createdBy } = await req.json();

    if (!directorId || !category || !section || !title || !body) {
      return Response.json({ error: "directorId, category, section, title, and body are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO resource_templates (director_id, category, section, title, body, created_by, updated_by)
      VALUES (${directorId}, ${category}, ${section}, ${title}, ${body}, ${createdBy || null}, ${createdBy || null})
      RETURNING *
    `;

    return Response.json({ template: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/resource-templates failed:", err);
    return Response.json({ error: "Failed to save template" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureTable();
    const { id, directorId, category, section, title, body, updatedBy } = await req.json();
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    const [row] = await sql`
      UPDATE resource_templates
      SET director_id = ${directorId}, category = ${category}, section = ${section},
          title = ${title}, body = ${body}, updated_by = ${updatedBy || null}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ template: row });
  } catch (err) {
    console.error("PATCH /api/resource-templates failed:", err);
    return Response.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTable();
    const { id } = await req.json();
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await sql`DELETE FROM resource_templates WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/resource-templates failed:", err);
    return Response.json({ error: "Failed to delete template" }, { status: 500 });
  }
}