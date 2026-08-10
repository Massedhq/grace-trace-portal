// app/api/property-inspection/route.ts
// Stores property inspection reports for Grace Trace Ministries.
// Each inspector (Avy or Dennis) submits their own report per area.
// Self-healing tables — CREATE TABLE IF NOT EXISTS on every request.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const TOTAL_CHECKLIST_ITEMS = 84;

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS property_inspections (
      id SERIAL PRIMARY KEY,
      property_name TEXT NOT NULL DEFAULT 'Athens TX — State Hwy 31 West',
      inspector_id TEXT NOT NULL,
      inspector_name TEXT NOT NULL,
      wing TEXT,
      room_area TEXT,
      inspection_date TEXT NOT NULL,
      overall_rating TEXT,
      general_notes TEXT,
      completed BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS property_inspection_items (
      id SERIAL PRIMARY KEY,
      inspection_id INTEGER NOT NULL,
      section TEXT NOT NULL,
      item_key TEXT NOT NULL,
      item_label TEXT NOT NULL,
      checked BOOLEAN NOT NULL DEFAULT FALSE,
      flag TEXT,
      note TEXT,
      photo_count INTEGER NOT NULL DEFAULT 0,
      checked_at TIMESTAMPTZ,
      UNIQUE (inspection_id, item_key)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS property_inspection_photos (
      id SERIAL PRIMARY KEY,
      inspection_id INTEGER NOT NULL,
      item_key TEXT,
      inspector_id TEXT NOT NULL,
      photo_data TEXT NOT NULL,
      file_name TEXT,
      caption TEXT,
      uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function GET(req: Request) {
  try {
    await ensureTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const inspector_id = searchParams.get("inspector_id");
    const full = searchParams.get("full");

    if (id) {
      const [report] = await sql`SELECT * FROM property_inspections WHERE id = ${id}`;
      const items = await sql`SELECT * FROM property_inspection_items WHERE inspection_id = ${id} ORDER BY id ASC`;
      return Response.json({ report: report || null, items });
    }

    if (full === "true") {
      const reports = await sql`
        SELECT * FROM property_inspections ORDER BY updated_at DESC
      `;

      if (reports.length === 0) {
        return Response.json({ reports: [], enriched: [] });
      }

      const ids = reports.map((r: any) => r.id);

      const allItems = await sql`
        SELECT * FROM property_inspection_items
        WHERE inspection_id = ANY(${ids})
      `;

      // NOTE: photo_data is deliberately excluded here — bundling full base64
      // image data for every report in one response blows past Vercel's
      // response size limit. Real photo bytes are fetched separately, per
      // report, via /api/property-inspection-photos?inspection_id=...
      const allPhotoMeta = await sql`
        SELECT id, inspection_id, item_key, inspector_id, file_name, caption, uploaded_at
        FROM property_inspection_photos
        WHERE inspection_id = ANY(${ids})
        ORDER BY uploaded_at ASC
      `;

      const enriched = reports.map((report: any) => {
        const itemsForReport = allItems.filter((i: any) => i.inspection_id === report.id);
        const photosForReport = allPhotoMeta.filter((p: any) => p.inspection_id === report.id);

        const itemsMap: Record<string, any> = {};
        itemsForReport.forEach((i: any) => { itemsMap[i.item_key] = i; });

        const photosMap: Record<string, any[]> = {};
        photosForReport.forEach((p: any) => {
          const key = p.item_key || "general";
          if (!photosMap[key]) photosMap[key] = [];
          photosMap[key].push(p);
        });

        const checkedCount = itemsForReport.filter((i: any) => i.checked).length;
        const progress = TOTAL_CHECKLIST_ITEMS
          ? Math.round((checkedCount / TOTAL_CHECKLIST_ITEMS) * 100)
          : 0;

        return { report, items: itemsMap, photos: photosMap, progress };
      });

      return Response.json({ reports, enriched });
    }

    if (inspector_id) {
      const reports = await sql`
        SELECT * FROM property_inspections
        WHERE inspector_id = ${inspector_id}
        ORDER BY updated_at DESC
      `;
      return Response.json({ reports });
    }

    // All reports for shared view
    const reports = await sql`
      SELECT * FROM property_inspections ORDER BY updated_at DESC
    `;
    return Response.json({ reports });
  } catch (err) {
    console.error("GET /api/property-inspection failed:", err);
    return Response.json({ error: "Failed to load inspections" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTables();
    const body = await req.json();
    const { property_name, inspector_id, inspector_name, wing, room_area, inspection_date, overall_rating, general_notes } = body;

    if (!inspector_id || !inspector_name) {
      return Response.json({ error: "inspector_id and inspector_name are required" }, { status: 400 });
    }

    const [report] = await sql`
      INSERT INTO property_inspections (property_name, inspector_id, inspector_name, wing, room_area, inspection_date, overall_rating, general_notes)
      VALUES (
        ${property_name || "Athens TX — State Hwy 31 West"},
        ${inspector_id}, ${inspector_name},
        ${wing || null}, ${room_area || null},
        ${inspection_date || new Date().toLocaleDateString("en-US")},
        ${overall_rating || null}, ${general_notes || null}
      )
      RETURNING *
    `;
    return Response.json({ report }, { status: 201 });
  } catch (err) {
    console.error("POST /api/property-inspection failed:", err);
    return Response.json({ error: "Failed to create inspection" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureTables();
    const body = await req.json();
    const { id, wing, room_area, overall_rating, general_notes, completed, item } = body;

    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    // Update an individual checklist item
    if (item) {
      const { section, item_key, item_label, checked, flag, note } = item;
      const [row] = await sql`
        INSERT INTO property_inspection_items (inspection_id, section, item_key, item_label, checked, flag, note, checked_at)
        VALUES (${id}, ${section}, ${item_key}, ${item_label}, ${checked}, ${flag || null}, ${note || null}, ${checked ? sql`NOW()` : null})
        ON CONFLICT (inspection_id, item_key) DO UPDATE
          SET checked = ${checked},
              flag = ${flag || null},
              note = ${note || null},
              checked_at = ${checked ? sql`NOW()` : null}
        RETURNING *
      `;
      await sql`UPDATE property_inspections SET updated_at = NOW() WHERE id = ${id}`;
      return Response.json({ item: row });
    }

    // Update the report header
    const [report] = await sql`
      UPDATE property_inspections
      SET wing = COALESCE(${wing || null}, wing),
          room_area = COALESCE(${room_area || null}, room_area),
          overall_rating = COALESCE(${overall_rating || null}, overall_rating),
          general_notes = COALESCE(${general_notes || null}, general_notes),
          completed = COALESCE(${completed ?? null}, completed),
          updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    return Response.json({ report });
  } catch (err) {
    console.error("PATCH /api/property-inspection failed:", err);
    return Response.json({ error: "Failed to update inspection" }, { status: 500 });
  }
}