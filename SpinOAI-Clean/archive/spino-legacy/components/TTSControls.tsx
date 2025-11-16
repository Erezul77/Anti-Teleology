"use client";
import { useEffect, useState } from "react";
import { getVoices, speak, stop, TTSProfile } from "../lib/tts";

export default function TTSControls({
  he = false,
  lang = "en-US",
  onChange,
}: {
  he?: boolean;
  lang?: "he-IL" | "en-US";
  onChange?: (cfg: { profile: TTSProfile; voiceName?: string; rate: number; pitch: number; volume: number; mute: boolean }) => void;
}) {
  const [profile, setProfile] = useState<TTSProfile>("gentle");
  const [voiceName, setVoiceName] = useState<string | undefined>(undefined);
  const [rate, setRate] = useState(0.9);
  const [pitch, setPitch] = useState(1.05);
  const [volume, setVolume] = useState(0.95);
  const [mute, setMute] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const load = () => setVoices(getVoices(lang));
    load();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = load;
    }
  }, [lang]);

  useEffect(() => {
    onChange?.({ profile, voiceName, rate, pitch, volume, mute });
  }, [profile, voiceName, rate, pitch, volume, mute, onChange]);

  const label = (en: string, heTxt: string) => (he ? heTxt : en);

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="opacity-70">{label("Voice:", "קול:")}</span>
      <select
        className="border rounded-xl px-2 py-1"
        value={voiceName || ""}
        onChange={(e) => setVoiceName(e.target.value || undefined)}
      >
        <option value="">{label("Auto", "אוטו")}</option>
        {voices.map((v) => (
          <option key={v.name} value={v.name}>{v.name}</option>
        ))}
      </select>
      <span className="opacity-70">{label("Style:", "סגנון:")}</span>
      <select
        className="border rounded-xl px-2 py-1"
        value={profile}
        onChange={(e) => {
          const p = e.target.value as TTSProfile;
          setProfile(p);
          // set defaults per profile
          if (p === "gentle") { setRate(0.9); setPitch(1.05); setVolume(0.95); }
          if (p === "neutral") { setRate(1.0); setPitch(1.0); setVolume(1.0); }
          if (p === "brisk") { setRate(1.15); setPitch(1.0); setVolume(1.0); }
        }}
      >
        <option value="gentle">{label("Gentle", "רך")}</option>
        <option value="neutral">{label("Neutral", "נייטרלי")}</option>
        <option value="brisk">{label("Brisk", "מהיר")}</option>
      </select>
      <label className="flex items-center gap-1">
        {label("Rate", "מהירות")}
        <input type="range" min={0.7} max={1.4} step={0.01} value={rate} onChange={(e)=>setRate(parseFloat(e.target.value))} />
      </label>
      <label className="flex items-center gap-1">
        {label("Pitch", "גובה")}
        <input type="range" min={0.8} max={1.3} step={0.01} value={pitch} onChange={(e)=>setPitch(parseFloat(e.target.value))} />
      </label>
      <label className="flex items-center gap-1">
        {label("Volume", "עוצמה")}
        <input type="range" min={0.5} max={1.0} step={0.01} value={volume} onChange={(e)=>setVolume(parseFloat(e.target.value))} />
      </label>
      <label className="flex items-center gap-1">
        <input type="checkbox" checked={mute} onChange={(e)=>setMute(e.target.checked)} />
        {label("Mute", "השתקה")}
      </label>
      <button
        className="rounded-xl border px-2 py-1"
        onClick={() => speak(label("This is a soft preview.", "זהו תצוגה מקדימה רכה."), { lang, voiceName, rate, pitch, volume, profile, mute })}
      >
        {label("Preview", "תצוגה")}
      </button>
      <button className="rounded-xl border px-2 py-1" onClick={() => stop()}>
        {label("Stop", "עצור")}
      </button>
    </div>
  );
}
