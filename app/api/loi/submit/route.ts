import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

// NOTE: if you already have a shared db helper (e.g. lib/db.ts) used
// elsewhere in the portal, swap this line to import that instead so
// there's only one place the connection string lives.
const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgName, contactName, contactInfo, city, perMonth, perYear, population, signature } = body;

    if (!orgName || !contactName || !contactInfo || !city || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await sql`
      INSERT INTO loi_submissions
        (org_name, contact_name, contact_info, city, per_month, per_year, population, signature)
      VALUES
        (${orgName}, ${contactName}, ${contactInfo}, ${city}, ${perMonth || null}, ${perYear || null}, ${population || null}, ${signature})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("LOI submit error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

