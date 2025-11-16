"use client";
import { useEffect, useRef, useState } from "react";

export default function PauseTimer({
  seconds = 45,
  label = "Digest time",
}: {
  seconds?: number;
  label?: string;
}) {
  const [left, setLeft] = useState(seconds);
  const started = useRef(false);
  useEffect(() => {
    if (seconds <= 0) return;
    if (started.current) return;
    started.current = true;
    const iv = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          clearInterval(iv);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [seconds]);
  if (seconds <= 0) return null;
  const pct = Math.round(((seconds - left) / seconds) * 100);
  const disabled = left > 0;
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-black/10 dark:border-white/10 p-3">
      <div className="relative h-8 w-8">
        <svg viewBox="0 0 36 36" className="h-8 w-8 -rotate-90">
          <path
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeDasharray={`${pct}, 100`}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{left}s</div>
      </div>
      <div className="text-sm">
        <div className="font-medium">{label}</div>
        <div className="opacity-70">
          {disabled ? "Let it sit. Breathe. Jot fragments below." : "Ready — proceed when done."}
        </div>
      </div>
    </div>
  );
}
