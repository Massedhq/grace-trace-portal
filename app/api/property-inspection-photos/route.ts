// app/api/property-inspection-photos/route.ts
// Stores base64 photo uploads for property inspection items.
// Photos are stored as base64 strings linked to inspection_id and item_key.

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

async function ensureTable() {
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
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const inspection_id = searchParams.get("inspection_id");
    const item_key = searchParams.get("item_key");

    if (!inspection_id) return Response.json({ error: "inspection_id is required" }, { status: 400 });

    let photos;
    if (item_key) {
      photos = await sql`
        SELECT id, inspection_id, item_key, inspector_id, photo_data, file_name, caption, uploaded_at
        FROM property_inspection_photos
        WHERE inspection_id = ${inspection_id} AND item_key = ${item_key}
        ORDER BY uploaded_at ASC
      `;
    } else {
      photos = await sql`
        SELECT id, inspection_id, item_key, inspector_id, photo_data, file_name, caption, uploaded_at
        FROM property_inspection_photos
        WHERE inspection_id = ${inspection_id}
        ORDER BY uploaded_at ASC
      `;
    }
    return Response.json({ photos });
  } catch (err) {
    console.error("GET /api/property-inspection-photos failed:", err);
    return Response.json({ error: "Failed to load photos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureTable();
    const { inspection_id, item_key, inspector_id, photo_data, file_name, caption } = await req.json();

    if (!inspection_id || !inspector_id || !photo_data) {
      return Response.json({ error: "inspection_id, inspector_id, and photo_data are required" }, { status: 400 });
    }

    const [photo] = await sql`
      INSERT INTO property_inspection_photos (inspection_id, item_key, inspector_id, photo_data, file_name, caption)
      VALUES (${inspection_id}, ${item_key || null}, ${inspector_id}, ${photo_data}, ${file_name || null}, ${caption || null})
      RETURNING id, inspection_id, item_key, inspector_id, file_name, caption, uploaded_at
    `;

    // Update photo count on the item
    if (item_key) {
      await sql`
        UPDATE property_inspection_items
        SET photo_count = photo_count + 1
        WHERE inspection_id = ${inspection_id} AND item_key = ${item_key}
      `;
    }

    await sql`UPDATE property_inspections SET updated_at = NOW() WHERE id = ${inspection_id}`;

    return Response.json({ photo }, { status: 201 });
  } catch (err) {
    console.error("POST /api/property-inspection-photos failed:", err);
    return Response.json({ error: "Failed to upload photo" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureTable();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id is required" }, { status: 400 });

    const [deleted] = await sql`
      DELETE FROM property_inspection_photos WHERE id = ${id} RETURNING inspection_id, item_key
    `;

    if (deleted?.item_key) {
      await sql`
        UPDATE property_inspection_items
        SET photo_count = GREATEST(photo_count - 1, 0)
        WHERE inspection_id = ${deleted.inspection_id} AND item_key = ${deleted.item_key}
      `;
    }

    return Response.json({ deleted: true });
  } catch (err) {
    console.error("DELETE /api/property-inspection-photos failed:", err);
    return Response.json({ error: "Failed to delete photo" }, { status: 500 });
  }
}