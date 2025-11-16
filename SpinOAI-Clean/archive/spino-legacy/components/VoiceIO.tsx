"use client";
import { useEffect, useRef, useState } from "react";

// Simple TTS + optional Web Speech Recognition (Chrome).
export default function VoiceIO({
  text,
  autoSpeak = true,
  onTranscript,
}: {
  text: string;
  autoSpeak?: boolean;
  onTranscript?: (t: string) => void;
}) {
  const [listening, setListening] = useState(false);
  const recRef = useRef<any>(null);
  useEffect(() => {
    if (!autoSpeak || !text) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 1.0;
      utter.pitch = 1.0;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch {}
  }, [text, autoSpeak]);

  function start() {
    try {
      const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SR) { setListening(false); return; }
      const rec = new SR();
      rec.lang = "en-US"; // change at runtime if needed
      rec.interimResults = true;
      rec.continuous = true;
      rec.onresult = (e: any) => {
        const t = Array.from(e.results).map((r:any)=>r[0].transcript).join(" ");
        onTranscript?.(t);
      };
      rec.onend = () => setListening(false);
      rec.start();
      recRef.current = rec;
      setListening(true);
    } catch { setListening(false); }
  }
  function stop() {
    try { recRef.current?.stop(); } catch {}
    setListening(false);
  }
  return (
    <div className="flex items-center gap-2">
      <button onClick={listening? stop : start} className={"rounded-full border px-3 py-1 text-xs " + (listening? "border-black dark:border-white" : "border-black/10 dark:border-white/10")}>
        {listening ? "Stop" : "Speak"}
      </button>
      <div className="text-[10px] opacity-60">TTS on. STT {listening? "listening…" : "off"}</div>
    </div>
  );
}
