// Simple, robust TTS with soft/neutral/brisk profiles and graceful fallbacks.
export type TTSProfile = "gentle" | "neutral" | "brisk";
export type TTSOpts = {
  lang?: "he-IL" | "en-US";
  voiceName?: string;
  profile?: TTSProfile;
  rate?: number;
  pitch?: number;
  volume?: number;
  mute?: boolean;
};

const PROFILES: Record<TTSProfile, { rate: number; pitch: number; volume: number }> = {
  gentle:  { rate: 0.9,  pitch: 1.05, volume: 0.95 },
  neutral: { rate: 1.0,  pitch: 1.0,  volume: 1.0  },
  brisk:   { rate: 1.15, pitch: 1.0,  volume: 1.0  },
};

export function getVoices(lang?: string) {
  const synth = globalThis.speechSynthesis;
  if (!synth) return [];
  return synth.getVoices().filter(v => (lang ? v.lang?.toLowerCase().startsWith(lang.toLowerCase().slice(0,2)) : true));
}

export function chooseVoice(lang: "he-IL" | "en-US", preferredName?: string) {
  const list = getVoices(lang);
  if (!list.length) return undefined;
  if (preferredName) {
    const hit = list.find(v => v.name === preferredName);
    if (hit) return hit;
  }
  // Heuristics: pick natural-sounding voices first
  const preferred = ["Google", "Microsoft", "Natural", "Female", "Neural"];
  const scored = list
    .map(v => ({
      v,
      score: preferred.reduce((s, w) => (v.name.toLowerCase().includes(w.toLowerCase()) ? s + 1 : s), 0),
    }))
    .sort((a, b) => b.score - a.score);
  return scored[0]?.v || list[0];
}

export function speak(text: string, opts: TTSOpts = {}) {
  if (!text || opts.mute) return;
  const synth = globalThis.speechSynthesis;
  if (!synth) return;
  synth.cancel(); // stop any current speech
  const lang = opts.lang || "en-US";
  const prof = PROFILES[opts.profile || "gentle"];
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const voice = chooseVoice(lang, opts.voiceName);
  if (voice) u.voice = voice;
  u.rate = (opts.rate ?? prof.rate);
  u.pitch = (opts.pitch ?? prof.pitch);
  u.volume = (opts.volume ?? prof.volume);
  // Chunk long text so it sounds more natural and doesn't get cut off
  const chunks = chunkText(text);
  let i = 0;
  const play = () => {
    if (i >= chunks.length) return;
    const seg = new SpeechSynthesisUtterance(chunks[i++]);
    seg.lang = u.lang; seg.voice = u.voice; seg.rate = u.rate; seg.pitch = u.pitch; seg.volume = u.volume;
    seg.onend = () => setTimeout(play, 80);
    synth.speak(seg);
  };
  play();
}

export function stop() {
  const synth = globalThis.speechSynthesis;
  if (synth) synth.cancel();
}

function chunkText(t: string) {
  // Soft pacing: split by sentence-ish boundaries
  const parts = t.replace(/\s+/g, " ")
    .split(/([.!?…]|—|\n)/)
    .reduce<string[]>((acc, cur, idx, arr) => {
      if (!cur.trim()) return acc;
      if (/[.!?…—\n]/.test(cur) && acc.length) acc[acc.length-1] += cur + " ";
      else acc.push(cur.trim());
      return acc;
    }, []);
  // Merge tiny fragments
  const merged: string[] = [];
  for (const p of parts) {
    if (!merged.length) { merged.push(p); continue; }
    if (merged[merged.length-1].length < 80) merged[merged.length-1] += " " + p;
    else merged.push(p);
  }
  return merged;
}
