// app/api/outreach-partnership-tracker/route.ts
//
// Shared Outreach Partnership Contact Tracker — Avy and Deann work every
// contact collaboratively (no per-user assignment, unlike outreach_contacts).
// Self-healing table. Contacts live in the Active Tracker until marked
// complete, then move permanently into the Completed Partnership File.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS outreach_partnership_contacts (
      id SERIAL PRIMARY KEY,
      organization_name TEXT NOT NULL,
      region TEXT,
      org_type TEXT,
      contact_name TEXT,
      contact_title TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      who_to_speak_to TEXT,
      how_to_apply TEXT,
      application_paperwork TEXT,
      hiring_process TEXT,
      processing_requirements TEXT,
      partnership_agreement_details TEXT,
      notes_log JSONB NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'Not Started',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      completed_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_by TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_by TEXT
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`
      SELECT * FROM outreach_partnership_contacts
      ORDER BY completed ASC, updated_at DESC
    `;
    return Response.json({ contacts: rows });
  } catch (err) {
    console.error("GET /api/outreach-partnership-tracker failed:", err);
    return Response.json({ error: "Failed to load partnership contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const body = await req.json();
    const { organizationName, region, orgType, createdBy } = body;

    if (!organizationName || !organizationName.trim()) {
      return Response.json({ error: "organizationName is required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO outreach_partnership_contacts (
        organization_name, region, org_type,
        contact_name, contact_title, contact_phone, contact_email,
        who_to_speak_to, how_to_apply, application_paperwork,
        hiring_process, processing_requirements, partnership_agreement_details,
        notes_log, status, created_by, updated_by
      )
      VALUES (
        ${organizationName.trim()}, ${region || null}, ${orgType || null},
        ${body.contactName || null}, ${body.contactTitle || null}, ${body.contactPhone || null}, ${body.contactEmail || null},
        ${body.whoToSpeakTo || null}, ${body.howToApply || null}, ${body.applicationPaperwork || null},
        ${body.hiringProcess || null}, ${body.processingRequirements || null}, ${body.partnershipAgreementDetails || null},
        '[]', ${body.status || "Not Started"}, ${createdBy || null}, ${createdBy || null}
      )
      RETURNING *
    `;

    return Response.json({ contact: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/outreach-partnership-tracker failed:", err);
    return Response.json({ error: "Failed to create partnership contact" }, { status: 500 });
  }
}

// PATCH supports several actions via body.action:
//   "update"        — update the editable field set + status
//   "addNote"       — append a timestamped note to notes_log
//   "markComplete"  — move the contact into the Completed Partnership File
//   "reopen"        — move a completed contact back into the Active Tracker
export async function PATCH(req: Request) {
  try {
    await ensureTable();
    const body = await req.json();
    const { id, action, actorName } = body;

    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    if (action === "addNote") {
      if (!body.text || !body.text.trim()) {
        return Response.json({ error: "note text is required" }, { status: 400 });
      }
      const note = { text: body.text.trim(), author: actorName || "Unknown", timestamp: new Date().toISOString() };
      const [row] = await sql`
        UPDATE outreach_partnership_contacts
        SET notes_log = notes_log || ${JSON.stringify([note])}::jsonb,
            updated_at = NOW(), updated_by = ${actorName || null}
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json({ contact: row });
    }

    if (action === "markComplete") {
      const [row] = await sql`
        UPDATE outreach_partnership_contacts
        SET completed = TRUE, completed_at = NOW(), completed_by = ${actorName || null},
            updated_at = NOW(), updated_by = ${actorName || null}
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json({ contact: row });
    }

    if (action === "reopen") {
      const [row] = await sql`
        UPDATE outreach_partnership_contacts
        SET completed = FALSE, completed_at = NULL, completed_by = NULL,
            updated_at = NOW(), updated_by = ${actorName || null}
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json({ contact: row });
    }

    // default: "update" — full editable field set
    const [row] = await sql`
      UPDATE outreach_partnership_contacts
      SET organization_name = ${body.organizationName},
          region = ${body.region || null},
          org_type = ${body.orgType || null},
          contact_name = ${body.contactName || null},
          contact_title = ${body.contactTitle || null},
          contact_phone = ${body.contactPhone || null},
          contact_email = ${body.contactEmail || null},
          who_to_speak_to = ${body.whoToSpeakTo || null},
          how_to_apply = ${body.howToApply || null},
          application_paperwork = ${body.applicationPaperwork || null},
          hiring_process = ${body.hiringProcess || null},
          processing_requirements = ${body.processingRequirements || null},
          partnership_agreement_details = ${body.partnershipAgreementDetails || null},
          status = ${body.status || "Not Started"},
          updated_at = NOW(), updated_by = ${actorName || null}
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json({ contact: row });
  } catch (err) {
    console.error("PATCH /api/outreach-partnership-tracker failed:", err);
    return Response.json({ error: "Failed to update partnership contact" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTable();
    const { id } = await req.json();
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await sql`DELETE FROM outreach_partnership_contacts WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/outreach-partnership-tracker failed:", err);
    return Response.json({ error: "Failed to delete partnership contact" }, { status: 500 });
  }
}