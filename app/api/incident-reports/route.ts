import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const openOnly = searchParams.get("open") === "true";

    const rows = openOnly
      ? await sql`SELECT * FROM incident_reports WHERE resolved = FALSE ORDER BY date_occurred DESC, created_at DESC`
      : await sql`SELECT * FROM incident_reports ORDER BY date_occurred DESC, created_at DESC`;

    return Response.json({ incidents: rows });
  } catch (err) {
    console.error("GET /api/incident-reports failed:", err);
    return Response.json({ error: "Failed to load incident reports" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      dateOccurred, timeOccurred, location, level,
      residentsInvolved, staffInvolved, witnesses, description,
      actionTaken, emsCalled, lawEnforcementCalled, reportedTo,
      followUpRequired, followUpOwner, createdBy,
    } = body;

    if (!dateOccurred || !level || !description) {
      return Response.json(
        { error: "dateOccurred, level, and description are required" },
        { status: 400 }
      );
    }

    const [row] = await sql`
      INSERT INTO incident_reports (
        date_occurred, time_occurred, location, level,
        residents_involved, staff_involved, witnesses, description,
        action_taken, ems_called, law_enforcement_called, reported_to,
        follow_up_required, follow_up_owner, created_by
      ) VALUES (
        ${dateOccurred}, ${timeOccurred || null}, ${location || null}, ${level},
        ${residentsInvolved || null}, ${staffInvolved || null}, ${witnesses || null}, ${description},
        ${actionTaken || null}, ${!!emsCalled}, ${!!lawEnforcementCalled}, ${reportedTo || null},
        ${followUpRequired || null}, ${followUpOwner || null}, ${createdBy || null}
      )
      RETURNING *
    `;

    return Response.json({ incident: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/incident-reports failed:", err);
    return Response.json({ error: "Failed to save incident report" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, resolved } = await req.json();
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    const [row] = await sql`
      UPDATE incident_reports SET resolved = ${!!resolved} WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ incident: row });
  } catch (err) {
    console.error("PATCH /api/incident-reports failed:", err);
    return Response.json({ error: "Failed to update incident report" }, { status: 500 });
  }
}