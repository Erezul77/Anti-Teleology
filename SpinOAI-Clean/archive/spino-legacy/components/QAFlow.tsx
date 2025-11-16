"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { VERBAL_PROMPTS } from "../lib/verbalPrompts";
import { extractEssence } from "../lib/feelingEssence";
import HelpBox from "./HelpBox";

type Seed = { line: string; because: string; therefore: string; rules: string[] };

export default function QAFlow({
  he = false,
  rigor = "very_rigorous",
  onSeedUpdate,
  onCommit,
}: {
  he?: boolean;
  rigor?: "rigorous" | "very_rigorous";
  onSeedUpdate: (s: Seed) => void;
  onCommit: (s: Seed) => void;
}) {
  const ordered = useMemo(
    () => [...VERBAL_PROMPTS].sort((a, b) => a.gate - b.gate),
    []
  );
  const [i, setI] = useState(0);
  const [val, setVal] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [seed, setSeed] = useState<Seed | null>(null);
  const minLong = rigor === "very_rigorous" ? 90 : 60;
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    taRef.current?.focus();
  }, [i]);

  const p = ordered[i];
  if (!p) {
    return <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 text-sm">{he ? "טעינה..." : "Loading..."}</div>;
  }
  const mode = p.mode ?? "long";
  const min = mode === "range" ? (p.minWords || 1) : mode === "yesno" ? 0 : (p.minWords || minLong);
  const max = mode === "range" ? p.maxWords : p.maxWords;
  const count = (t: string) => t.trim().split(/\s+/).filter(Boolean).length;
  const inRange = (t: string) => {
    const c = count(t);
    if (mode === "yesno") return true;
    if (max) return c >= (min || 0) && c <= max;
    return c >= (min || 0);
  };

  function accept(answer: string) {
    const trimmed = answer.trim();
    const nextA = [...answers];
    nextA[i] = trimmed;
    setAnswers(nextA);
    // update seed quietly
    const ess = extractEssence(nextA.join("\n"));
    const s: Seed = {
      line: (nextA[0] || "").split("\n")[0] || ess.focusWord || "Line",
      because: ess.becauseSuggestion,
      therefore: ess.thereforeSuggestion,
      rules: ess.rules || [],
    };
    setSeed(s);
    onSeedUpdate(s);
    // progress - use functional update to ensure we have latest i
    setI((prevI) => {
      const nextI = prevI + 1;
      if (nextI < ordered.length) {
        setVal("");
        return nextI;
      } else {
        onCommit(s);
        return prevI;
      }
    });
  }

  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-semibold">{he ? "מצב מיקוד: שאלה–תשובה" : "Focus mode: Question → Answer"}</div>
        <div className="text-xs opacity-70">
          {he ? "שלב" : "Step"} {i + 1} / {ordered.length}
        </div>
      </div>
      <div className="text-sm mb-3">{he ? p.he : p.en}</div>
      <div className="mb-3">
        <HelpBox promptId={p.id} he={he} />
      </div>
      {mode === "yesno" ? (
        <div className="flex items-center gap-2">
          <button
            onClick={() => accept(he ? "אני מסכים/ה לקפדנות." : "I consent to rigor.")}
            className="rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
          >
            {he ? "מסכים/ה" : "I agree"}
          </button>
          <button
            onClick={() => accept(he ? "לא כעת." : "Not now.")}
            className="rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
          >
            {he ? "לא" : "No"}
          </button>
        </div>
      ) : (
        <>
          <textarea
            ref={taRef}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            placeholder={
              mode === "range"
                ? he
                  ? `ענה/עני ${min}-${max} מילים…`
                  : `Answer ${min}-${max} words…`
                : he
                ? `כתוב/כתבי תשובה מפורטת (מינימום ${min} מילים)…`
                : `Write a detailed answer (min ${min} words)…`
            }
            className="w-full min-h-[120px] rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2"
          />
          {/* word counter */}
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <div
              className={
                "font-medium " +
                (inRange(val) && val.trim()
                  ? "text-green-600"
                  : "opacity-70")
              }
            >
              {count(val)} {he ? "מילים" : "words"}
            </div>
            <div className="opacity-60">
              {max ? `${he ? "טווח" : "Target"}: ${min}-${max}` : `${he ? "מינימום" : "Min"}: ${min}`}
            </div>
          </div>
          <div className="mt-1 h-1.5 w-full rounded bg-black/10 dark:bg-white/10 overflow-hidden">
            {(() => {
              const denom = max ?? (min || 1);
              const pct = Math.max(0, Math.min(100, Math.round((count(val) / denom) * 100)));
              return (
                <div
                  className="h-full rounded bg-black dark:bg-white"
                  style={{ width: `${pct}%` }}
                />
              );
            })()}
          </div>
          <div className="mt-3 flex items-center justify-end">
            <button
              onClick={() => {
                if (!inRange(val)) return;
                accept(val);
              }}
              className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm disabled:opacity-40"
              disabled={!inRange(val)}
            >
              {i < ordered.length - 1 ? (he ? "המשך" : "Next") : (he ? "סיום" : "Finish")}
            </button>
          </div>
        </>
      )}
      {seed && (
        <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 p-3 text-xs">
          <div className="opacity-70 mb-1">{he ? "נאסף ברקע" : "Collected in background"}</div>
          <div><b>{he ? "שורה" : "Line"}:</b> {seed.line}</div>
          <div><b>{he ? "בגלל" : "Because"}:</b> {seed.because}</div>
          <div><b>{he ? "לכן" : "Therefore"}:</b> {seed.therefore}</div>
        </div>
      )}
    </div>
  );
}
