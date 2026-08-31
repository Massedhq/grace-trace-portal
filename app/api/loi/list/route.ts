import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, org_name, contact_name, contact_info, city, per_month, per_year, population, signature, submitted_at
      FROM loi_submissions
      ORDER BY submitted_at DESC
    `;
    return NextResponse.json({ rows });
  } catch (err) {
    console.error("LOI list error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

