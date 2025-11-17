import { NextResponse } from "next/server";
import { analyzeTeleology } from "@/lib/teleologyEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const text = body?.text;

    console.log("[Honestra][teleology-api] Received request with text:", text?.substring(0, 100));

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing 'text' field in request body" },
        { status: 400 }
      );
    }

    console.log("[Honestra][teleology-api] Calling analyzeTeleology...");
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
