// app/api/outreach-partnership-tracker-reads/route.ts
//
// Tracks which staff member has seen which partnership tracker contact, and
// when. Compared against the contact's updated_at, this tells the dashboard
// and the tracker page whether Avy and/or Deann have seen the latest state
// of a given contact.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS outreach_partnership_contact_reads (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL,
      staff_id TEXT NOT NULL,
      viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(contact_id, staff_id)
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`SELECT * FROM outreach_partnership_contact_reads`;
    return Response.json({ reads: rows });
  } catch (err) {
    console.error("GET /api/outreach-partnership-tracker-reads failed:", err);
    return Response.json({ error: "Failed to load reads" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { contactId, staffId } = await req.json();
    if (!contactId || !staffId) {
      return Response.json({ error: "contactId and staffId are required" }, { status: 400 });
    }
    const [row] = await sql`
      INSERT INTO outreach_partnership_contact_reads (contact_id, staff_id, viewed_at)
      VALUES (${contactId}, ${staffId}, NOW())
      ON CONFLICT (contact_id, staff_id) DO UPDATE SET viewed_at = NOW()
      RETURNING *
    `;
    return Response.json({ read: row });
  } catch (err) {
    console.error("POST /api/outreach-partnership-tracker-reads failed:", err);
    return Response.json({ error: "Failed to save read" }, { status: 500 });
  }
}