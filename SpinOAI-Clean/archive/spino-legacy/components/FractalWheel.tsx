"use client";
type Level = { label?: string; adequacy: number; coherence?: number };

export default function FractalWheel({ levels = [] as Level[] }: { levels: Level[] }) {
  if (!levels.length) return null;
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const baseR = 28;
  const gap = 14;
  const rings = [...levels].reverse();
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        {rings.map((lvl, i) => {
          const r = baseR + i * gap;
          const C = 2 * Math.PI * r;
          const pct = Math.max(0, Math.min(100, lvl.adequacy));
          const dash = (pct / 100) * C;
          return (
            <g key={i}>
              <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity="0.12" strokeWidth="6" />
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeDasharray={`${dash} ${C - dash}`}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            </g>
          );
        })}
      </svg>
      <div className="text-xs">
        <div className="font-medium mb-1">Fractal Wheel</div>
        <div className="opacity-70">
          {levels
            .map((l, idx) => `L${idx + 1}${l.label ? ` (${l.label})` : ""}: ${Math.round(l.adequacy)}`)
            .join(" • ")}
        </div>
      </div>
    </div>
  );
}
