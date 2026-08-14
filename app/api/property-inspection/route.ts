// app/api/property-inspection/route.ts
// Stores property inspection reports for Grace Trace Ministries.
// One report per inspector per property. Exterior is checked once for the
// whole property. Interior-type sections (Interior, Electrical, Plumbing,
// etc.) are tracked per Wing -> Room "area" within that same report, using
// an item_key prefix of "AREA_<areaId>__<key>" so no schema change was
// needed on the existing items/photos tables.
// Self-healing tables — CREATE TABLE IF NOT EXISTS on every request.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const EXTERIOR_ITEM_COUNT = 12;
const INTERIOR_ITEMS_PER_AREA = 72;

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
    await ensureTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const inspector_id = searchParams.get("inspector_id");
    const full = searchParams.get("full");

    if (id) {
      const [report] = await sql`SELECT * FROM property_inspections WHERE id = ${id}`;
      const items = await sql`SELECT * FROM property_inspection_items WHERE inspection_id = ${id} ORDER BY id ASC`;
      const areas = await sql`SELECT * FROM property_inspection_areas WHERE inspection_id = ${id} ORDER BY id ASC`;
      return Response.json({ report: report || null, items, areas });
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

      const allAreas = await sql`
        SELECT * FROM property_inspection_areas
        WHERE inspection_id = ANY(${ids})
        ORDER BY id ASC
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
        const areasForReport = allAreas.filter((a: any) => a.inspection_id === report.id);
        const photosForReport = allPhotoMeta.filter((p: any) => p.inspection_id === report.id);

        const itemsMap: Record<string, any> = {};
        itemsForReport.forEach((i: any) => { itemsMap[i.item_key] = i; });

        const photosMap: Record<string, any[]> = {};
        photosForReport.forEach((p: any) => {
          const key = p.item_key || "general";
          if (!photosMap[key]) photosMap[key] = [];
          photosMap[key].push(p);
        });

        const exteriorChecked = itemsForReport.filter((i: any) => !i.item_key.startsWith("AREA_") && i.checked).length;
        const interiorChecked = itemsForReport.filter((i: any) => i.item_key.startsWith("AREA_") && i.checked).length;
        const totalPossible = EXTERIOR_ITEM_COUNT + INTERIOR_ITEMS_PER_AREA * areasForReport.length;
        const checkedCount = exteriorChecked + interiorChecked;
        const progress = totalPossible ? Math.round((checkedCount / totalPossible) * 100) : 0;

        return { report, items: itemsMap, photos: photosMap, areas: areasForReport, progress };
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

    const finalPropertyName = (property_name || "Athens TX — State Hwy 31 West").trim();

    // One report per inspector per property. If this inspector already has a
    // report for this property, reuse it instead of creating a duplicate.
    // Match forgivingly (case/whitespace/dash-style insensitive) so small
    // typing differences between two people ("Athens TX — State Hwy 31 West"
    // vs "athens tx - state hwy 31 west") don't silently split into two
    // separate reports.
    const canon = (s: string) => (s || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/[–—−]/g, "-");
    const candidates = await sql`
      SELECT * FROM property_inspections WHERE inspector_id = ${inspector_id} ORDER BY created_at ASC
    `;
    const existing = candidates.find((r: any) => canon(r.property_name) === canon(finalPropertyName));

    if (existing) {
      return Response.json({ report: existing }, { status: 200 });
    }

    const [report] = await sql`
      INSERT INTO property_inspections (property_name, inspector_id, inspector_name, wing, room_area, inspection_date, overall_rating, general_notes)
      VALUES (
        ${finalPropertyName},
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

export async function DELETE(req: Request) {
  try {
    await ensureTables();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    await sql`DELETE FROM property_inspection_items WHERE inspection_id = ${id}`;
    await sql`DELETE FROM property_inspection_photos WHERE inspection_id = ${id}`;
    await sql`DELETE FROM property_inspection_areas WHERE inspection_id = ${id}`;
    const [deleted] = await sql`DELETE FROM property_inspections WHERE id = ${id} RETURNING id`;

    return Response.json({ deleted: !!deleted });
  } catch (err) {
    console.error("DELETE /api/property-inspection failed:", err);
    return Response.json({ error: "Failed to delete inspection" }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    await ensureTables();
    const body = await req.json();
    const { id, overall_rating, general_notes, completed, item } = body;

    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    // Update an individual checklist item (item_key may be a plain exterior
    // key like "ext_roof", or an area-scoped key like "AREA_5__int_walls")
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
      SET overall_rating = COALESCE(${overall_rating || null}, overall_rating),
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