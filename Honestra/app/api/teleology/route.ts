import { NextResponse } from "next/server";

// Log at module level to verify file is loaded
console.log("[Honestra][teleology-api] Route file loaded");

// Use direct relative import
import { analyzeTeleology } from "../../../lib/teleologyEngine";

console.log("[Honestra][teleology-api] analyzeTeleology imported:", typeof analyzeTeleology);

export async function POST(req: Request) {
  console.log("[Honestra][teleology-api] POST handler called");
  
  try {
    const body = await req.json().catch(() => null);
    const text = body?.text;

    console.log("[Honestra][teleology-api] Received request with text:", text?.substring(0, 100));

    if (!text || typeof text !== "string") {
      console.log("[Honestra][teleology-api] Invalid text field");
      return NextResponse.json(
        { error: "Missing 'text' field in request body" },
        { status: 400 }
      );
    }

    console.log("[Honestra][teleology-api] Calling analyzeTeleology with text:", text);
    const analysis = await analyzeTeleology(text);
    console.log("[Honestra][teleology-api] Analysis result:", JSON.stringify(analysis, null, 2));

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[Honestra][teleology-api] error", err);
    console.error("[Honestra][teleology-api] error stack:", err instanceof Error ? err.stack : String(err));
    return NextResponse.json(
      { error: "Internal error while analyzing teleology" },
      { status: 500 }
    );
  }
}
