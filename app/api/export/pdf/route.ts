export const runtime = "nodejs"; // ensure Node runtime

import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { createServerClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const itineraryId = searchParams.get("itineraryId");
    if (!itineraryId) return NextResponse.json({ error: "Missing itineraryId" }, { status: 400 });

    const supabase = createServerClient(cookies());
    const { data: itinerary, error } = await supabase
      .from("itineraries")
      .select("*")
      .eq("id", itineraryId)
      .single();
    if (error || !itinerary) return NextResponse.json({ error: "Itinerary not found" }, { status: 404 });

    const doc = new PDFDocument({ size: "A4" });
    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk) => chunks.push(chunk));

    // Use your TTF font explicitly
    const fontPath = path.join(process.cwd(), "fonts", "LiberationSerif-Regular.ttf");
    if (!fs.existsSync(fontPath)) throw new Error("Font not found: " + fontPath);
    doc.font(fontPath);

    doc.fontSize(26).text("Travel Itinerary", { underline: true });
    doc.moveDown();
    doc.fontSize(18).text(`Destination: ${itinerary.destination}`);
    doc.text(`Dates: ${itinerary.start_date} → ${itinerary.end_date}`);
    doc.text(`Budget: $${itinerary.budget}`);
    doc.text(`Group Size: ${itinerary.group_size}`);
    doc.moveDown();
    doc.fontSize(20).text("Plan:");
    doc.fontSize(14).text(itinerary.content || "No content available");

    doc.end();

    return new NextResponse(Buffer.concat(chunks), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=itinerary.pdf",
      },
    });
  } catch (err: any) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
