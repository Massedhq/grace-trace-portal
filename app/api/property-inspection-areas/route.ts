// app/api/property-inspection-areas/route.ts
// Tracks the Wings/Rooms ("areas") added within a single property inspection
// report. Each area gets its own copy of the interior-type checklist,
// referenced from property_inspection_items via an "AREA_<id>__<key>"
// item_key prefix. Rooms are free text — not limited to any preset list.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS property_inspection_areas (
      id SERIAL PRIMARY KEY,
      inspection_id INTEGER NOT NULL,
      wing TEXT NOT NULL,
      room TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE (inspection_id, wing, room)
    )
  `;
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const inspection_id = searchParams.get("inspection_id");
    if (!inspection_id) return Response.json({ error: "inspection_id is required" }, { status: 400 });

    const areas = await sql`
      SELECT * FROM property_inspection_areas
      WHERE inspection_id = ${inspection_id}
      ORDER BY id ASC
    `;
    return Response.json({ areas });
  } catch (err) {
    console.error("GET /api/property-inspection-areas failed:", err);
    return Response.json({ error: "Failed to load areas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { inspection_id, wing, room } = await req.json();

    if (!inspection_id || !wing || !room) {
      return Response.json({ error: "inspection_id, wing, and room are required" }, { status: 400 });
    }

    // Reuse the existing area if this exact wing+room already exists for
    // this report, instead of creating a duplicate.
    const [existing] = await sql`
      SELECT * FROM property_inspection_areas
      WHERE inspection_id = ${inspection_id} AND wing = ${wing} AND room = ${room}
    `;
    if (existing) {
      return Response.json({ area: existing }, { status: 200 });
    }

    const [area] = await sql`
      INSERT INTO property_inspection_areas (inspection_id, wing, room)
      VALUES (${inspection_id}, ${wing}, ${room})
      RETURNING *
    `;
    return Response.json({ area }, { status: 201 });
  } catch (err) {
    console.error("POST /api/property-inspection-areas failed:", err);
    return Response.json({ error: "Failed to create area" }, { status: 500 });
  }
}
