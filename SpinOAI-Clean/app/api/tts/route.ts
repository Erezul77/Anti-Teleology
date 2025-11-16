// OPTIONAL: external TTS proxy (Azure/ElevenLabs) if you want higher-quality soft voices.
// Set env vars to enable. If none set, this route returns 501.
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, lang = "en-US" } = await req.json();
    if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });
    if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) {
      // Example ElevenLabs
      const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`, {
        method: "POST",
        headers: {
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: { stability: 0.4, similarity_boost: 0.8, style: 0.3, use_speaker_boost: true },
        }),
      });
      if (!r.ok) return NextResponse.json({ error: await r.text() }, { status: r.status });
      const buf = Buffer.from(await r.arrayBuffer());
      return new NextResponse(buf, {
        status: 200,
        headers: { "Content-Type": "audio/mpeg" },
      });
    }
    // TODO: Add Azure Cognitive Speech or Polly branch if desired.
    return NextResponse.json({ error: "No external TTS configured" }, { status: 501 });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || "TTS error" }, { status: 500 });
  }
}
