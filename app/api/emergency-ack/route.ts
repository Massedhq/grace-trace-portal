// app/api/emergency-ack/route.js
//
// ASSUMPTIONS — adjust to match your actual lib/db setup if different:
//   - You're using @neondatabase/serverless with DATABASE_URL (confirmed from your build errors)
//   - No separate lib/db.js wrapper was visible to me, so this connects directly.
//     If you already have a shared `sql` helper (e.g. lib/db.js), swap the import below
//     for consistency with your other /api routes (meetings, signatures, etc.)
//
// Run once against Neon before using this route:
//
// CREATE TABLE IF NOT EXISTS emergency_procedures_ack (
//   id SERIAL PRIMARY KEY,
//   staff_id TEXT NOT NULL,
//   staff_name TEXT NOT NULL,
//   position TEXT,
//   acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
// );

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, staff_id, staff_name, position, acknowledged_at
      FROM emergency_procedures_ack
      ORDER BY acknowledged_at DESC
    `;
    return Response.json({ acknowledgments: rows });
  } catch (err) {
    console.error("GET /api/emergency-ack failed:", err);
    return Response.json({ error: "Failed to load acknowledgments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { staffId, staffName, position } = await req.json();

    if (!staffId || !staffName) {
      return Response.json({ error: "staffId and staffName are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO emergency_procedures_ack (staff_id, staff_name, position)
      VALUES (${staffId}, ${staffName}, ${position || null})
      RETURNING id, staff_id, staff_name, position, acknowledged_at
    `;

    return Response.json({ acknowledgment: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/emergency-ack failed:", err);
    // TEMPORARY: exposing err.message directly to the frontend for debugging.
    // Remove the "detail" field once the root cause is fixed.
    return Response.json({ error: "Failed to save acknowledgment", detail: String(err?.message || err) }, { status: 500 });
  }
}