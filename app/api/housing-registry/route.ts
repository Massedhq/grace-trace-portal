// app/api/housing-registry/route.ts
// Stores and manages Grace Trace Housing Registry submissions.
// Self-healing table — CREATE TABLE IF NOT EXISTS on every request.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS housing_registry (
      id SERIAL PRIMARY KEY,
      -- Step 1 fields
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT,
      date_of_birth TEXT,
      county TEXT,
      emergency_contact TEXT,
      system_type TEXT,
      facility TEXT,
      expected_release TEXT,
      tdcj_number TEXT,
      population TEXT,
      housing_timeline TEXT,
      other_housing TEXT,
      referral_source TEXT,
      -- Step 2 fields
      emp_timeline TEXT,
      work_interests TEXT,
      certifications TEXT,
      worked_inside TEXT,
      resume_help TEXT,
      edu_interests TEXT,
      edu_field TEXT,
      services_needed TEXT,
      career_ready_ack BOOLEAN DEFAULT FALSE,
      -- Pipeline and status
      pipeline_stage TEXT NOT NULL DEFAULT 'Interest Received',
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      completed_at TIMESTAMPTZ,
      completion_note TEXT,
      -- Metadata
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const [row] = await sql`
        SELECT * FROM housing_registry WHERE id = ${id}
      `;
      return Response.json({ registrant: row || null });
    }

    const completed = searchParams.get("completed");
    let rows;
    if (completed === "true") {
      rows = await sql`
        SELECT * FROM housing_registry
        WHERE completed = TRUE
        ORDER BY completed_at DESC
      `;
    } else if (completed === "false") {
      rows = await sql`
        SELECT * FROM housing_registry
        WHERE completed = FALSE
        ORDER BY expected_release ASC NULLS LAST
      `;
    } else {
      rows = await sql`
        SELECT * FROM housing_registry
        ORDER BY completed ASC, expected_release ASC NULLS LAST
      `;
    }
    return Response.json({ registrants: rows });
  } catch (err) {
    console.error("GET /api/housing-registry failed:", err);
    return Response.json({ error: "Failed to load registry" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const body = await req.json();
    const {
      first_name, last_name, phone, email, date_of_birth, county,
      emergency_contact, system_type, facility, expected_release,
      tdcj_number, population, housing_timeline, other_housing, referral_source,
      emp_timeline, work_interests, certifications, worked_inside, resume_help,
      edu_interests, edu_field, services_needed, career_ready_ack,
    } = body;

    if (!first_name || !last_name || !phone) {
      return Response.json({ error: "first_name, last_name, and phone are required" }, { status: 400 });
    }

    const [row] = await sql`
      INSERT INTO housing_registry (
        first_name, last_name, phone, email, date_of_birth, county,
        emergency_contact, system_type, facility, expected_release,
        tdcj_number, population, housing_timeline, other_housing, referral_source,
        emp_timeline, work_interests, certifications, worked_inside, resume_help,
        edu_interests, edu_field, services_needed, career_ready_ack
      ) VALUES (
        ${first_name}, ${last_name}, ${phone}, ${email || null}, ${date_of_birth || null}, ${county || null},
        ${emergency_contact || null}, ${system_type || null}, ${facility || null}, ${expected_release || null},
        ${tdcj_number || null}, ${population || null}, ${housing_timeline || null}, ${other_housing || null}, ${referral_source || null},
        ${emp_timeline || null}, ${work_interests || null}, ${certifications || null}, ${worked_inside || null}, ${resume_help || null},
        ${edu_interests || null}, ${edu_field || null}, ${services_needed || null}, ${career_ready_ack || false}
      )
      RETURNING *
    `;
    return Response.json({ registrant: row }, { status: 201 });
  } catch (err) {
    console.error("POST /api/housing-registry failed:", err);
    return Response.json({ error: "Failed to save registration" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureTable();
    const body = await req.json();
    const { id, pipeline_stage, completed, completion_note } = body;

    if (!id) {
      return Response.json({ error: "id is required" }, { status: 400 });
    }

    let row;
    if (completed === true) {
      [row] = await sql`
        UPDATE housing_registry
        SET pipeline_stage = COALESCE(${pipeline_stage || null}, pipeline_stage),
            completed = TRUE,
            completed_at = NOW(),
            completion_note = ${completion_note || null},
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else if (completed === false) {
      [row] = await sql`
        UPDATE housing_registry
        SET completed = FALSE,
            completed_at = NULL,
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    } else {
      [row] = await sql`
        UPDATE housing_registry
        SET pipeline_stage = COALESCE(${pipeline_stage || null}, pipeline_stage),
            updated_at = NOW()
        WHERE id = ${id}
        RETURNING *
      `;
    }
    return Response.json({ registrant: row });
  } catch (err) {
    console.error("PATCH /api/housing-registry failed:", err);
    return Response.json({ error: "Failed to update registrant" }, { status: 500 });
  }
}