import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    await sql`DELETE FROM loi_submissions WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("LOI delete error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
