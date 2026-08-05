// app/api/outreach-contacts/route.ts
//
// Self-healing table. Leadership assigns specific contacts (organization +
// person + phone) to a staff member. That staff member acknowledges the
// task first, then marks it complete once the outreach is done. Both steps
// are timestamped and attributed for accountability.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS outreach_contacts (
      id SERIAL PRIMARY KEY,
      organization_name TEXT NOT NULL,
      contact_name TEXT,
      phone TEXT,
      notes TEXT,
      assigned_to TEXT NOT NULL,
      assigned_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      completed_by TEXT
    )
  `;
  // Self-healing additions for the acknowledge step — safe to run every time.
  await sql`ALTER TABLE outreach_contacts ADD COLUMN IF NOT EXISTS acknowledged BOOLEAN NOT NULL DEFAULT FALSE`;
  await sql`ALTER TABLE outreach_contacts ADD COLUMN IF NOT EXISTS acknowledged_at TIMESTAMPTZ`;
  await sql`ALTER TABLE outreach_contacts ADD COLUMN IF NOT EXISTS acknowledged_by TEXT`;
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const assignedTo = searchParams.get("assignedTo");

    const rows = assignedTo
      ? await sql`SELECT * FROM outreach_contacts WHERE assigned_to = ${assignedTo} ORDER BY completed ASC, created_at DESC`
      : await sql`SELECT * FROM outreach_contacts ORDER BY assigned_to ASC, completed ASC, created_at DESC`;

    return Response.json({ contacts: rows });
  } catch (err) {
    console.error("GET /api/outreach-contacts failed:", err);
    return Response.json({ error: "Failed to load outreach contacts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { organizationName, contactName, phone, notes, assignedTo, assignedBy } = await req.json();

    if (!organizationName || !assignedTo) {
      return Response.json({ error: "organizationName and assignedTo are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO outreach_contacts (organization_name, contact_name, phone, notes, assigned_to, assigned_by)
      VALUES (${organizationName}, ${contactName || null}, ${phone || null}, ${notes || null}, ${assignedTo}, ${assignedBy || null})
      RETURNING *
    `;

    return Response.json({ contact: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/outreach-contacts failed:", err);
    return Response.json({ error: "Failed to save outreach contact" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureTable();
    const body = await req.json();
    const { id } = body;
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    if (typeof body.acknowledged === "boolean") {
      const [row] = await sql`
        UPDATE outreach_contacts
        SET acknowledged = ${body.acknowledged},
            acknowledged_at = ${body.acknowledged ? new Date().toISOString() : null},
            acknowledged_by = ${body.acknowledged ? (body.acknowledgedBy || null) : null}
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json({ contact: row });
    }

    if (typeof body.completed === "boolean") {
      const [row] = await sql`
        UPDATE outreach_contacts
        SET completed = ${body.completed},
            completed_at = ${body.completed ? new Date().toISOString() : null},
            completed_by = ${body.completed ? (body.completedBy || null) : null}
        WHERE id = ${id}
        RETURNING *
      `;
      return Response.json({ contact: row });
    }

    const [row] = await sql`
      UPDATE outreach_contacts
      SET organization_name = ${body.organizationName}, contact_name = ${body.contactName || null},
          phone = ${body.phone || null}, notes = ${body.notes || null}, assigned_to = ${body.assignedTo}
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json({ contact: row });
  } catch (err) {
    console.error("PATCH /api/outreach-contacts failed:", err);
    return Response.json({ error: "Failed to update outreach contact" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTable();
    const { id } = await req.json();
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await sql`DELETE FROM outreach_contacts WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/outreach-contacts failed:", err);
    return Response.json({ error: "Failed to delete outreach contact" }, { status: 500 });
  }
}
