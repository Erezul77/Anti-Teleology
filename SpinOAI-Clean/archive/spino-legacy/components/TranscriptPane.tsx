"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import useAutoScroll from "../hooks/useAutoScroll";

export type Msg = { role: "guide" | "you"; text: string; ts: number };
export default function TranscriptPane({
  items,
  onSend,
  minWords = 40,
  maxWords,
  buttons,
  disabled = false,
  placeholder = "Write…",
  he = false,
}: {
  items: Msg[];
  onSend: (t: string) => void;
  minWords?: number;
  maxWords?: number;
  buttons?: { label: string; value: string }[];
  disabled?: boolean;
  placeholder?: string;
  he?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement|null>(null);
  const listRef = useRef<HTMLDivElement|null>(null);
  useEffect(()=>{ ref.current?.focus(); }, [items.length]);
  useAutoScroll(listRef, [items.length, disabled, minWords, maxWords]);
  const [value, setValue] = useState("");
  const count = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const words = useMemo(()=>count(value), [value]);
  const wcOk = (t: string) => {
    const c = count(t);
    if (minWords && c < minWords) return false;
    if (maxWords && c > maxWords) return false;
    return true;
  };
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm font-medium mb-2">{he ? "שיחה" : "Conversation"}</div>
      <div ref={listRef} className="max-h-[38vh] overflow-y-auto space-y-3 pr-1">
        {items.map((m,i)=>(
          <div key={i} className={"text-sm " + (m.role==="guide" ? "opacity-80" : "")}>
            <span className={"text-[10px] uppercase tracking-wide mr-2 " + (m.role==="guide" ? "opacity-60" : "opacity-50")}>
              {m.role==="guide" ? (he? "מדריך" : "Guide") : (he? "את/ה" : "You")}
            </span>
            {m.text}
          </div>
        ))}
      </div>
      <div className="mt-3">
        <textarea
          ref={ref}
          placeholder={`${placeholder} (${he? "מינימום" : "min"} ${minWords} ${he? "מילים" : "words"})`}
          onChange={(e)=>{ setValue(e.target.value); }}
          className="w-full min-h-[110px] rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
              e.preventDefault();
              const t = value;
              if (!wcOk(t)) return;
              onSend(t.trim());
              setValue("");
              ref.current?.focus();
            }
          }}
        />
        {/* Word counter + progress */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-[11px]">
            <div className={
              "font-medium " +
              ((maxWords ? (words >= (minWords||0) && words <= maxWords) : (words >= (minWords||0)))
                ? "text-green-600"
                : "opacity-70")
            }>
              {words} {he ? "מילים" : "words"}
            </div>
            <div className="opacity-60">
              {buttons?.length
                ? (he ? "בחר/י תשובה." : "Choose an answer.")
                : maxWords
                ? `${he ? "טווח" : "Target"}: ${minWords}-${maxWords}`
                : `${he ? "מינימום" : "Min"}: ${minWords}`}
            </div>
          </div>
          {(!buttons || !buttons.length) && (
            <div className="mt-1 h-1.5 w-full rounded bg-black/10 dark:bg-white/10 overflow-hidden">
              {(() => {
                const denom = maxWords ? maxWords : (minWords || 1);
                const pct = Math.max(0, Math.min(100, Math.round((words / denom) * 100)));
                return <div className="h-full rounded bg-black dark:bg-white" style={{ width: `${pct}%` }} />;
              })()}
            </div>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="text-[11px] opacity-60">
            {buttons?.length
              ? (he ? "בחר/י תשובה." : "Choose an answer.")
              : maxWords
              ? `${he ? "טווח מילים" : "Word range"}: ${minWords}-${maxWords}`
              : `${he ? "מינימום מילים" : "Minimum words"}: ${minWords}`}
          </div>
          {buttons?.length ? (
            <div className="flex items-center gap-2">
              {buttons.map((b, i) => (
                <button
                  key={i}
                  onClick={() => onSend(b.value)}
                  disabled={disabled}
                  className="rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
                >
                  {b.label}
                </button>
              ))}
            </div>
          ) : null}
          <button
            onClick={()=>{
              const t = value;
              if (!wcOk(t)) return;
              onSend(t.trim());
              if (ref.current) ref.current.value = "";
              setValue("");
            }}
            disabled={disabled}
            className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-40"
          >
            {he ? "שלח/י" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
