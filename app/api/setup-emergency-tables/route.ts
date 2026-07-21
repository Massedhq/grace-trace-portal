// app/api/setup-emergency-tables/route.ts
//
// ONE-TIME USE ONLY. Visit this URL once in your browser after deploying:
//   https://staff.gracetraceministries.org/api/setup-emergency-tables
//
// It creates the two tables using the exact same DATABASE_URL connection
// your live app already uses — no branch/database mismatch possible.
//
// After it works once, delete this file and the app/api/setup-emergency-tables
// folder entirely, then redeploy. This endpoint should not stay live long-term.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS emergency_procedures_ack (
        id SERIAL PRIMARY KEY,
        staff_id TEXT NOT NULL,
        staff_name TEXT NOT NULL,
        position TEXT,
        acknowledged_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS incident_reports (
        id SERIAL PRIMARY KEY,
        date_occurred DATE NOT NULL,
        time_occurred TEXT,
        location TEXT,
        level TEXT NOT NULL,
        residents_involved TEXT,
        staff_involved TEXT,
        witnesses TEXT,
        description TEXT NOT NULL,
        action_taken TEXT,
        ems_called BOOLEAN DEFAULT FALSE,
        law_enforcement_called BOOLEAN DEFAULT FALSE,
        reported_to TEXT,
        follow_up_required TEXT,
        follow_up_owner TEXT,
        resolved BOOLEAN DEFAULT FALSE,
        created_by TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `;

    // Confirm both tables are now reachable on THIS connection
    const check = await sql`
      SELECT table_name FROM information_schema.tables
      WHERE table_name IN ('emergency_procedures_ack', 'incident_reports')
    `;

    return Response.json({
      success: true,
      message: "Tables created successfully on the live database connection.",
      tablesFound: check.map((r) => r.table_name),
      reminder: "Delete this /api/setup-emergency-tables route now and redeploy.",
    });
  } catch (err) {
    return Response.json(
      { success: false, error: String((err as Error)?.message || err) },
      { status: 500 }
    );
  }
}