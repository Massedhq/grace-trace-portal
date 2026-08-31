import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orgName, contactFirstName, contactLastName, contactTitle, contactInfo, city, perMonth, perYear, population, signature } = body;

    if (!orgName || !contactFirstName || !contactLastName || !contactInfo || !city || !signature) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const contactName = `${contactFirstName} ${contactLastName}`.trim();

    await sql`
      INSERT INTO loi_submissions
        (org_name, contact_name, contact_first_name, contact_last_name, contact_title, contact_info, city, per_month, per_year, population, signature)
      VALUES
        (${orgName}, ${contactName}, ${contactFirstName}, ${contactLastName}, ${contactTitle || null}, ${contactInfo}, ${city}, ${perMonth || null}, ${perYear || null}, ${population || null}, ${signature})
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("LOI submit error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
