import { NextResponse } from "next/server";
import { analyzeTeleology } from "../../../../src/lib/teleologyEngine";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const text = body?.text;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Missing 'text' field in request body" },
        { status: 400 }
      );
    }

    const analysis = await analyzeTeleology(text);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[Honestra][teleology-api] error", err);
    return NextResponse.json(
      { error: "Internal error while analyzing teleology" },
      { status: 500 }
    );
  }
}
