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

    // We treat analyzeTeleology as a black box; whatever it returns
    // we send back as JSON.
    const analysis: any = await (analyzeTeleology as any)(text);

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("[Honestra][teleology-api] error", err);
    return NextResponse.json(
      { error: "Internal error while analyzing teleology" },
      { status: 500 }
    );
  }
}
