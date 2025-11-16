import { NextRequest, NextResponse } from "next/server";
import { analyzeTeleology } from "@shared/lib/teleologyEngine";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();
    
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "Missing or invalid 'text' field" }, { status: 400 });
    }

    const analysis = await analyzeTeleology(text);
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("Teleology analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

