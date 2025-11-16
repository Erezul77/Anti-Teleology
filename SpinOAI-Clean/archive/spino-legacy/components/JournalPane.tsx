"use client";
import { useMemo, useState } from "react";

const PROMPTS_EN = [
  "Name the smallest change in the cause that would flip the effect.",
  "What would convince your smartest critic?",
  "Replace one loaded word with a neutral one and restate.",
  "Give the cleanest counterexample; don't sandbag it.",
  "What prior desire of yours made this result sting?",
];
const PROMPTS_HE = [
  "תן/תני את השינוי הקטן ביותר בסיבה שיהפוך את התוצאה.",
  "מה ישכנע את המבקר/ה החכם/ה ביותר שלך?",
  "החלף/י מילה טעונה במילה ניטרלית ונסח/י מחדש.",
  "תן/תני דוגמה נגדית נקייה — בלי להקל.",
  "איזה רצון מוקדם שלך גרם לעוקץ כאן?",
];

export default function JournalPane({
  he,
  value,
  onChange,
  placeholder,
}: {
  he: boolean;
  value: string;
  onChange: (t: string) => void;
  placeholder?: string;
}) {
  const prompts = he ? PROMPTS_HE : PROMPTS_EN;
  const [i, setI] = useState(0);
  const hint = useMemo(() => prompts[i % prompts.length], [i, prompts]);
  const wc = useMemo(() => (value.trim() ? value.trim().split(/\s+/).length : 0), [value]);
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium">{he ? "יומן" : "Journal"}</div>
        <div className="text-[10px] opacity-60">{wc} words</div>
      </div>
      <div className="text-xs mb-2 opacity-70">{hint}</div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full min-h-[120px] rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2"
      />
      <div className="mt-2 flex items-center justify-end">
        <button
          onClick={() => setI((n) => n + 1)}
          className="rounded-xl border border-black/10 dark:border-white/10 px-3 py-1 text-xs"
        >
          {he ? "עוד רמז" : "Another hint"}
        </button>
      </div>
    </div>
  );
}
