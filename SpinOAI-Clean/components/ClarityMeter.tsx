"use client";
import { useMemo } from "react";

export default function ClarityMeter({
  label = "How clear is this for you now?",
  value,
  onChange,
  min = 0,
  max = 10,
  step = 1,
}: {
  label?: string;
  value: number | null;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  const v = useMemo(() => (value ?? Math.floor((min + max) / 2)), [value, min, max]);
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm font-medium mb-1">{label}</div>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={v}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1"
        />
        <div className="w-10 text-sm font-semibold text-center">{v}</div>
      </div>
      <div className="mt-1 text-xs opacity-60">{min} = foggy · {max} = crystal</div>
    </div>
  );
}
