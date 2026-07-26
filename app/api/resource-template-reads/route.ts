// app/api/resource-template-reads/route.ts
//
// Tracks the last time each staff member viewed each template.
// A template shows as "Updated" for a staff member when
// template.updated_at is newer than their viewed_at record.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS resource_template_reads (
      id SERIAL PRIMARY KEY,
      template_id INTEGER NOT NULL,
      staff_id TEXT NOT NULL,
      viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (template_id, staff_id)
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`SELECT template_id, staff_id, viewed_at FROM resource_template_reads`;
    return Response.json({ reads: rows });
  } catch (err) {
    console.error("GET /api/resource-template-reads failed:", err);
    return Response.json({ error: "Failed to load read status" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { templateId, staffId } = await req.json();
    if (!templateId || !staffId) {
      return Response.json({ error: "templateId and staffId are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO resource_template_reads (template_id, staff_id, viewed_at)
      VALUES (${templateId}, ${staffId}, NOW())
      ON CONFLICT (template_id, staff_id) DO UPDATE SET viewed_at = NOW()
      RETURNING template_id, staff_id, viewed_at
    `;

    return Response.json({ read: row });
  } catch (err) {
    console.error("POST /api/resource-template-reads failed:", err);
    return Response.json({ error: "Failed to save read status" }, { status: 500 });
  }
}