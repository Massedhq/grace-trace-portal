// app/api/property-inspection/route.ts
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS property_inspections (
      id SERIAL PRIMARY KEY,
      property_name TEXT NOT NULL DEFAULT 'Athens TX â€” State Hwy 31 West',
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

const CHECKLIST_TOTAL = 84;

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

    if (inspector_id) {
      const reports = await sql`
        SELECT * FROM property_inspections
        WHERE inspector_id = ${inspector_id}
        ORDER BY updated_at DESC
      `;
      return Response.json({ reports });
    }

    const reports = await sql`SELECT * FROM property_inspections ORDER BY updated_at DESC`;

    if (full === "true") {
      // Load items
      const allItems = await sql`
        SELECT * FROM property_inspection_items ORDER BY inspection_id, id ASC
      `;

      // Load photos â€” only metadata + data, no joins
      const allPhotos = await sql`
        SELECT id, inspection_id, item_key, inspector_id, photo_data, file_name, uploaded_at
        FROM property_inspection_photos
        ORDER BY inspection_id, uploaded_at ASC
      `;

      const enriched = (reports || []).map(report => {
        const items = (allItems || []).filter(i => Number(i.inspection_id) === Number(report.id));
        const photos = (allPhotos || []).filter(p => Number(p.inspection_id) === Number(report.id));
        const itemMap: Record<string, any> = {};
        items.forEach(i => { itemMap[i.item_key] = i; });
        const photoMap: Record<string, any[]> = {};
        photos.forEach(p => {
          if (!photoMap[p.item_key]) photoMap[p.item_key] = [];
          photoMap[p.item_key].push(p);
        });
        const done = items.filter(i => i.checked).length;
        return {
          report,
          items: itemMap,
          photos: photoMap,
          progress: CHECKLIST_TOTAL ? Math.round((done / CHECKLIST_TOTAL) * 100) : 0,
        };
      });

      return Response.json({ reports, enriched });
    }

    return Response.json({ reports });
  } catch (err: any) {
    console.error("GET /api/property-inspection failed:", err);
    return Response.json({
      error: err?.message || String(err),
      reports: [],
      enriched: [],
    }, { status: 500 });
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
        ${property_name || "Athens TX â€” State Hwy 31 West"},
        ${inspector_id}, ${inspector_name},
        ${wing || null}, ${room_area || null},
        ${inspection_date || new Date().toLocaleDateString("en-US")},
        ${overall_rating || null}, ${general_notes || null}
      )
      RETURNING *
    `;
    return Response.json({ report }, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/property-inspection failed:", err);
    return Response.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureTables();
    const body = await req.json();
    const { id, wing, room_area, overall_rating, general_notes, completed, item } = body;

    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

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
  } catch (err: any) {
    console.error("PATCH /api/property-inspection failed:", err);
    return Response.json({ error: err?.message || String(err) }, { status: 500 });
  }
}

