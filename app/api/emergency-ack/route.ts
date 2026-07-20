import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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

export async function POST(req: Request) {
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
    return Response.json({ error: "Failed to save acknowledgment" }, { status: 500 });
  }
}