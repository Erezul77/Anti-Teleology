"use client";
import { useEffect, useMemo, useState } from "react";
import {
  IdeaGraph,
  addCommonNotion,
  addContradiction,
  addDefinition,
  addDerivation,
  initGraph,
  scoreAdequacy,
  aggregateScores,
} from "../lib/adequacy";
import ProofTree from "./ProofTree";
import PauseTimer from "./PauseTimer";
import JournalPane from "./JournalPane";
import FractalWheel from "./FractalWheel";
import ClarityMeter from "./ClarityMeter";
import GuidedConversation from "./GuidedConversation";
import WalkHelpBox from "./WalkHelpBox";
import FinalSummary from "./FinalSummary";
import {
  COMMON_NOTIONS_EN,
  COMMON_NOTIONS_HE,
  MOMENT_CARDS_EN,
  MOMENT_CARDS_HE,
  RULE_CHIPS,
} from "../lib/commonNotions";

function useHebrew() {
  const [he, setHe] = useState(false);
  useEffect(() => {
    try {
      const lang = navigator?.language?.toLowerCase() ?? "";
      setHe(lang.startsWith("he") || lang.includes("iw"));
    } catch {}
  }, []);
  return he;
}

export default function IdeaWalkthrough() {
  const he = useHebrew();
  // Steps: 1 Hook → 2 Mirror → 3 Pin → 4 Deepen → 5 Commons → 6 Consequences → 7 Mark
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7>(1);
  const [depthMode, setDepthMode] = useState<"quick" | "guided" | "deep">("guided");
  const digestSeconds = depthMode === "deep" ? 90 : depthMode === "guided" ? 45 : 0;
  const maxLoops = depthMode === "deep" ? 3 : depthMode === "guided" ? 1 : 0;
  const [loopsDone, setLoopsDone] = useState(0);

  const [line, setLine] = useState("");
  const [chosenCard, setChosenCard] = useState<string | null>(null);
  const [focusWord, setFocusWord] = useState<string>("");
  const [because, setBecause] = useState("");
  const [therefore, setTherefore] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [commons, setCommons] = useState<string[]>([]);
  const [conseq, setConseq] = useState<string[]>(["", ""]);
  const [rejects, setRejects] = useState<boolean[]>([false, false]);
  const [refinedDef, setRefinedDef] = useState("");
  const [priorCause, setPriorCause] = useState("");
  const [exampleText, setExampleText] = useState("");
  const [counterExample, setCounterExample] = useState("");
  const [counterHolds, setCounterHolds] = useState<"yes" | "no" | "unclear">("unclear");
  const [journal, setJournal] = useState("");
  // Felt-clarity & insight capture
  const [clarityStart, setClarityStart] = useState<number | null>(null);
  const [clarityNow, setClarityNow] = useState<number | null>(null);
  const clarityDelta =
    clarityStart !== null && clarityNow !== null ? clarityNow - clarityStart : null;
  const [aha, setAha] = useState("");
  const [nextTinyAction, setNextTinyAction] = useState("");

  // Guided Conversation modal
  const [guideOpen, setGuideOpen] = useState(false);
  function handleGuideCommit(r: {stingLine:string; essenceWords:string[]; bodyNotes:string[]; rules:string[]; because:string; therefore:string}) {
    // Inject into the flow
    setLine(r.stingLine);
    if (r.rules?.length) setRules(r.rules);
    setBecause(r.because);
    setTherefore(r.therefore);
    setJournal(j => (j ? j + "\n\n" : "") + `Essence: ${r.essenceWords.join(", ")}${r.bodyNotes.length? " · body: "+r.bodyNotes.join(", "):""}`);
    // Initialize graph with sting line if empty
    if (!g.nodes.length || !g.nodes[0]?.text) setG(initGraph(r.stingLine));
    // Jump the user to Pin step for quick continuation
    setStep(3);
  }

  // FRACTAL ZOOM
  const [trail, setTrail] = useState<IdeaGraph[]>([]); // completed outer levels
  const [g, setG] = useState<IdeaGraph>(() => initGraph(""));
  const levels = useMemo(() => [...trail, g], [trail, g]);
  const scores = useMemo(() => scoreAdequacy(g), [g]);
  const agg = useMemo(() => aggregateScores(levels), [levels]);

  // progress
  const pct =
    step === 1 ? 10 : step === 2 ? 20 : step === 3 ? 35 : step === 4 ? 60 : step === 5 ? 75 : step === 6 ? 90 : 100;

  function tokenizedWords(s: string) {
    return s
      .split(/[\s,.;!?]+/)
      .filter(Boolean)
      .slice(0, 12);
  }

  // SAVE/RESUME (localStorage)
  useEffect(() => {
    const saved = localStorage.getItem("spino_session_v2");
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        setLine(obj.line ?? "");
        setChosenCard(obj.chosenCard ?? null);
        setFocusWord(obj.focusWord ?? "");
        setBecause(obj.because ?? "");
        setTherefore(obj.therefore ?? "");
        setRules(obj.rules ?? []);
        setCommons(obj.commons ?? []);
        setConseq(obj.conseq ?? ["", ""]);
        setRejects(obj.rejects ?? [false, false]);
        setRefinedDef(obj.refinedDef ?? "");
        setPriorCause(obj.priorCause ?? "");
        setExampleText(obj.exampleText ?? "");
        setCounterExample(obj.counterExample ?? "");
        setCounterHolds(obj.counterHolds ?? "unclear");
        setJournal(obj.journal ?? "");
        if (obj.g) setG(obj.g);
        if (obj.trail) setTrail(obj.trail);
        if (typeof obj.clarityStart === "number") setClarityStart(obj.clarityStart);
        if (typeof obj.clarityNow === "number") setClarityNow(obj.clarityNow);
        setAha(obj.aha ?? "");
        setNextTinyAction(obj.nextTinyAction ?? "");
      } catch {}
    }
  }, []);
  // Listen for external seeds from SpinO Studio (custom event bus)
  useEffect(()=>{
    function onSeed(e:any){
      try{
        const d = e.detail || {};
        const lineIn = d.line || "";
        setLine(lineIn);
        if (Array.isArray(d.rules)) setRules(d.rules);
        if (d.because) setBecause(d.because);
        if (d.therefore) setTherefore(d.therefore);
        setG(initGraph(lineIn));
        setStep(3); // jump to Pin
      } catch {}
    }
    window.addEventListener("spino_seed", onSeed as any);
    return ()=> window.removeEventListener("spino_seed", onSeed as any);
  }, []);
  // Accept incoming seed from SpinO Studio (cross-route handoff)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("spino_incoming_seed");
      if (raw) {
        const d = JSON.parse(raw) || {};
        const lineIn = d.line || "";
        setLine(lineIn);
        if (Array.isArray(d.rules)) setRules(d.rules);
        if (d.because) setBecause(d.because);
        if (d.therefore) setTherefore(d.therefore);
        setG(initGraph(lineIn));
        setStep(3); // land on "Because → Therefore"
        localStorage.removeItem("spino_incoming_seed");
      }
    } catch {}
  }, []);
  useEffect(() => {
    const payload = {
      line,
      chosenCard,
      focusWord,
      because,
      therefore,
      rules,
      commons,
      conseq,
      rejects,
      refinedDef,
      priorCause,
      exampleText,
      counterExample,
      counterHolds,
      journal,
      g,
      trail,
      clarityStart,
      clarityNow,
      aha,
      nextTinyAction,
    };
    localStorage.setItem("spino_session_v2", JSON.stringify(payload));
  }, [
    line,
    chosenCard,
    focusWord,
    because,
    therefore,
    rules,
    commons,
    conseq,
    rejects,
    refinedDef,
    priorCause,
    exampleText,
    counterExample,
    counterHolds,
    journal,
    g,
    trail,
    clarityStart,
    clarityNow,
    aha,
    nextTinyAction,
  ]);

  function handleStart() {
    const claim = line.trim() || chosenCard || "";
    const next = initGraph(claim);
    setG(next);
    setStep(2);
  }

  function handlePin() {
    if (!because || !therefore) return;
    if (focusWord) {
      const kind: "real" | "verbal" =
        /because|therefore|caus|leads|results/.test((because + therefore).toLowerCase()) ? "real" : "verbal";
      addDefinition(g, focusWord, `${focusWord}: ${because} → ${therefore}`, kind);
    }
    addDerivation(g, because, therefore);
    if (rules.length) addDefinition(g, "rule", `Hidden rule(s): ${rules.join(", ")}`, "verbal");
    setG({ ...g, scores: scoreAdequacy(g) });
    if (maxLoops > 0) setStep(4);
    else setStep(5);
  }

  function toggleRule(r: string) {
    setRules((prev) => (prev.includes(r) ? prev.filter((x) => x !== r) : [...prev, r]));
  }
  function toggleCommon(c: string) {
    setCommons((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  }
  function applyCommons() {
    commons.forEach((c) => addCommonNotion(g, c));
    setG({ ...g, scores: scoreAdequacy(g) });
    setStep(6);
  }
  function applyConsequences() {
    const pairs = conseq.map((c, i) => ({ c: c.trim(), r: rejects[i] }));
    pairs.forEach((p) => {
      if (!p.c) return;
      if (p.r) {
        const x = addContradiction(g, `Rejects necessary consequence: ${p.c}`);
        const lastDer =
          (g.nodes as any).findLast?.((n: any) => n.kind === "Derivation") ||
          [...g.nodes].reverse().find((n) => n.kind === "Derivation");
        if (lastDer) g.edges.push({ from: lastDer.id, to: x.id, role: "contradicts" });
      } else {
        addCommonNotion(g, `Accepts consequence: ${p.c}`);
      }
    });
    setG({ ...g, scores: scoreAdequacy(g) });
    setStep(7);
  }

  function runDeepenOnce() {
    if (refinedDef.trim()) {
      addDefinition(
        g,
        focusWord || "term",
        refinedDef.trim(),
        refinedDef.toLowerCase().includes("→") || refinedDef.toLowerCase().includes("because") ? "real" : "verbal"
      );
    }
    if (priorCause.trim() && (because.trim() || therefore.trim())) {
      addDerivation(g, priorCause.trim(), because.trim() || therefore.trim());
    }
    if (exampleText.trim()) addCommonNotion(g, `Example evidence: ${exampleText.trim()}`);
    if (counterExample.trim()) {
      if (counterHolds === "yes") {
        const x = addContradiction(g, `Counterexample holds: ${counterExample.trim()}`);
        const lastDer =
          (g.nodes as any).findLast?.((n: any) => n.kind === "Derivation") ||
          [...g.nodes].reverse().find((n) => n.kind === "Derivation");
        if (lastDer) g.edges.push({ from: lastDer.id, to: x.id, role: "contradicts" });
      } else if (counterHolds === "no") {
        addCommonNotion(g, `Counterexample resolved: ${counterExample.trim()}`);
      } else {
        addCommonNotion(g, `Counterexample under review: ${counterExample.trim()}`);
      }
    }
    setG({ ...g, scores: scoreAdequacy(g) });
    setLoopsDone((n) => n + 1);
    setRefinedDef("");
    setPriorCause("");
    setExampleText("");
    setCounterExample("");
    setCounterHolds("unclear");
  }

  // Fractal zoom
  function zoomIn(seed?: string) {
    const newSeed =
      (seed && seed.trim()) ||
      priorCause.trim() ||
      because.trim() ||
      (focusWord ? `${focusWord}: refine` : "");
    if (!newSeed) return;
    setTrail((t) => [...t, { ...g }]);
    const next = initGraph(newSeed);
    setG(next);
    setLine(newSeed);
    setChosenCard(null);
    setFocusWord("");
    setBecause("");
    setTherefore("");
    setRules([]);
    setCommons([]);
    setConseq(["", ""]);
    setRejects([false, false]);
    setRefinedDef("");
    setPriorCause("");
    setExampleText("");
    setCounterExample("");
    setCounterHolds("unclear");
    setStep(2);
  }
  function zoomOut() {
    if (!trail.length) return;
    const t = [...trail];
    const prev = t.pop()!;
    setTrail(t);
    setG(prev);
    setStep(7);
  }

  // Export
  function exportMarkdown() {
    const lines = [
      `# SpinO Idea Walkthrough`,
      ``,
      `**Claim:** ${line || chosenCard || ""}`,
      `**Focus word:** ${focusWord}`,
      `**Because → Therefore:** ${because} → ${therefore}`,
      ``,
      `## Rings`,
      `Count: ${levels.length}`,
      `Fractal adequacy (min): ${Math.round(agg.adequacy)}, coherence (min): ${Math.round(agg.coherence)}`,
      ``,
      `## Journal`,
      journal || "_(empty)_",
      ``,
      `## Proof Tree (latest nodes)`,
      ...g.nodes.slice(-12).map((n) => `- **${n.kind}**: ${n.text}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "spino-idea.md";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  // Crystallize
  const [selfCert, setSelfCert] = useState(false);
  const [synthesis, setSynthesis] = useState("");
  function adequacyReached() {
    return agg.adequacy >= 78 && agg.coherence >= 70 && agg.signDependence <= 12 && agg.passivity <= 18;
  }
  function copySynthesis() {
    const text =
      synthesis.trim() ||
      `Because ${because}, therefore ${therefore}. (Levels: ${levels.length}, min adequacy ${Math.round(
        agg.adequacy
      )})`;
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="relative h-7 w-7">
            <svg viewBox="0 0 36 36" className="h-7 w-7 -rotate-90">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={`${pct}, 100`}
              />
            </svg>
            <div className="absolute inset-0 grid place-items-center text-xs font-semibold">{pct}%</div>
          </div>
          <h1 className="text-xl md:text-2xl font-semibold">
            {he ? "מסלול הרעיון — Adequacy Walkthrough" : "Idea Walkthrough — Adequacy"}
          </h1>
        </div>
        <p className="mt-2 text-sm opacity-70">
          {he
            ? "בלי שאלון. שורה אחת שלך → הגדרה → קשר סיבתי → בדיקת השלכות. הכל גלוי ובדוק."
            : "No forms. One line → definition → causal link → consequence check. Public, checkable."}
        </p>
        <div className="mt-3 flex items-center justify-between gap-4">
          <FractalWheel
            levels={levels.map((L, idx) => ({
              label: idx === 0 ? (he ? "תמונה רחבה" : "Big picture") : `L${idx + 1}`,
              adequacy: scoreAdequacy(L).adequacy,
              coherence: scoreAdequacy(L).coherence,
            }))}
          />
          <div className="text-xs">
            <div>
              <span className="opacity-70">{he ? "מספר טבעות:" : "Rings:"}</span>{" "}
              <span className="font-medium">{levels.length}</span>
            </div>
            <div>
              <span className="opacity-70">{he ? "מספיקות כוללת:" : "Fractal adequacy:"}</span>{" "}
              <span className="font-medium">{Math.round(agg.adequacy)}</span>
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs">
          <span className="opacity-70">{he ? "עומק:" : "Depth:"}</span>
          {[
            { k: "quick", label: he ? "מהיר" : "Quick" },
            { k: "guided", label: he ? "מונחה" : "Guided" },
            { k: "deep", label: he ? "עמוק" : "Deep" },
          ].map((o: any) => (
            <button
              key={o.k}
              onClick={() => {
                setDepthMode(o.k);
                setLoopsDone(0);
              }}
              className={
                "rounded-full border px-3 py-1 " +
                (depthMode === o.k ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")
              }
            >
              {o.label}
            </button>
          ))}
          <button
            onClick={()=>setGuideOpen(true)}
            className="ml-auto rounded-full border border-black/10 dark:border-white/10 px-3 py-1"
            title={he ? "הדרכה קולית/דמיון מודרך" : "Guided voice/imagination"}
          >
            {he ? "פתח שיחת הדרכה" : "Open Guided Conversation"}
          </button>
          <button
            onClick={() => zoomOut()}
            className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1 disabled:opacity-40"
            disabled={!trail.length}
          >
            {he ? "זום החוצה" : "Zoom out"}
          </button>
          <button
            onClick={() => zoomIn()}
            className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1"
          >
            {he ? "זום פנימה" : "Zoom in"}
          </button>
        </div>
      </div>

      {/* Step 1: Hook */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Overview help - open by default */}
          <WalkHelpBox id="overview" he={he} defaultOpen />
          {/* Step 1 specific help */}
          <WalkHelpBox id="step1" he={he} />
          <div>
            <div className="mb-2 text-sm font-medium">
              {he ? "בחר/י רגע או כתוב/כתבי משלך" : "Pick a moment or write your own"}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(he ? MOMENT_CARDS_HE : MOMENT_CARDS_EN).map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setChosenCard(c);
                    setLine(c);
                  }}
                  className={
                    "rounded-xl border px-3 py-2 text-left hover:bg-black/5 dark:hover:bg-white/10 " +
                    (chosenCard === c ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")
                  }
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">
              {he ? "או: תן/תני את השורה שהמוח אמר באותו רגע" : "Or: give me the line your mind said in that moment"}
            </div>
            <input
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder={he ? "לדוגמה: הוא התעלם → אני חסר ערך" : "e.g., He ignored me → I'm worthless"}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3"
            />
          </div>
          {/* Felt clarity at entry */}
          <ClarityMeter
            label={he ? "כמה זה ברור לך עכשיו?" : "How clear is this for you right now?"}
            value={clarityStart}
            onChange={setClarityStart}
          />
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-70">{he ? "לחץ/י המשך עם השורה הזו" : "Continue with this line"}</div>
            <button
              onClick={handleStart}
              disabled={!line.trim() && !chosenCard}
              className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-40"
            >
              {he ? "המשך" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Mirror */}
      {step === 2 && (
        <div className="space-y-6">
          <WalkHelpBox id="step2" he={he} />
          <div className="text-sm font-medium">
            {he ? "סמן/י מילה אחת שנושאת את העוקץ" : "Underline one word that carries the sting"}
          </div>
          <div className="flex flex-wrap gap-2">
            {tokenizedWords(line).map((w, i) => (
              <button
                key={i}
                onClick={() => setFocusWord(w)}
                className={
                  "rounded-full border px-3 py-2 " +
                  (focusWord === w ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")
                }
              >
                {w}
              </button>
            ))}
          </div>
          <div>
            <div className="mb-2 text-sm font-medium">
              {he ? "איזה כלל הסתתר ברקע?" : "Which hidden rule was in play?"}
            </div>
            <div className="flex flex-wrap gap-2">
              {RULE_CHIPS.map((r) => (
                <button
                  key={r}
                  onClick={() => toggleRule(r)}
                  className={
                    "rounded-full border px-3 py-1 text-xs " +
                    (rules.includes(r) ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(1)} className="text-xs opacity-70 hover:opacity-100">
              {he ? "חזרה" : "Back"}
            </button>
            <button
              onClick={() => setStep(3)}
              className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2"
            >
              {he ? "הלאה" : "Next"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Pin */}
      {step === 3 && (
        <div className="space-y-6">
          <WalkHelpBox id="step3" he={he} />
          <div className="text-sm font-medium">
            {he ? "הפוך/הפכי לסיבתי: בגלל ___ לכן ___" : "Make it causal: Because ___, therefore ___"}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={because}
              onChange={(e) => setBecause(e.target.value)}
              placeholder={he ? "בגלל..." : "Because..."}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3"
            />
            <input
              value={therefore}
              onChange={(e) => setTherefore(e.target.value)}
              placeholder={he ? "לכן..." : "Therefore..."}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3"
            />
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(2)} className="text-xs opacity-70 hover:opacity-100">
              {he ? "חזרה" : "Back"}
            </button>
            <button
              onClick={handlePin}
              disabled={!because.trim() || !therefore.trim()}
              className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 disabled:opacity-40"
            >
              {he ? "המשך" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Deepen */}
      {step === 4 && (
        <div className="space-y-6">
          <WalkHelpBox id="step4" he={he} />
          <div className="text-sm font-medium">
            {he ? "העמקה: הגדרה מחדש, סיבה קודמת, דוגמה, דוגמה נגדית" : "Deepen: refine, prior cause, example, counterexample"}
          </div>
          {digestSeconds > 0 && <PauseTimer seconds={digestSeconds} label={he ? "זמן עיכול" : "Digest time"} />}
          <div className="grid grid-cols-1 gap-3">
            <textarea
              value={refinedDef}
              onChange={(e) => setRefinedDef(e.target.value)}
              placeholder={he ? "חדד/י את ההגדרה במשפט אחד אמיתי/סיבתי" : "Refine the definition in one real/causal sentence"}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 min-h-[80px]"
            />
            <input
              value={priorCause}
              onChange={(e) => setPriorCause(e.target.value)}
              placeholder={he ? "סיבה קודמת (אם יש)" : "One prior cause (if any)"}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3"
            />
            <textarea
              value={exampleText}
              onChange={(e) => setExampleText(e.target.value)}
              placeholder={he ? "דוגמה תומכת קצרה" : "Short supporting example"}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 min-h-[70px]"
            />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              <textarea
                value={counterExample}
                onChange={(e) => setCounterExample(e.target.value)}
                placeholder={he ? "דוגמה נגדית (חזקה)" : "Counterexample (steelman)"}
                className="md:col-span-4 w-full rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3 min-h-[70px]"
              />
              <div className="md:col-span-1 flex md:flex-col gap-2">
                {[
                  { k: "yes", l: he ? "מחזיקה" : "Holds" },
                  { k: "no", l: he ? "נפתרה" : "Resolved" },
                  { k: "unclear", l: he ? "לא ברור" : "Unclear" },
                ].map((o: any) => (
                  <button
                    key={o.k}
                    onClick={() => setCounterHolds(o.k)}
                    className={
                      "flex-1 rounded-xl border px-3 py-2 text-xs " +
                      (counterHolds === o.k ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")
                    }
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(3)} className="text-xs opacity-70 hover:opacity-100">
              {he ? "חזרה" : "Back"}
            </button>
            <div className="flex items-center gap-2">
              {loopsDone < maxLoops && (
                <button onClick={runDeepenOnce} className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2">
                  {he ? "הוסף/י לולאה" : "Add loop"}
                </button>
              )}
              <button
                onClick={() => zoomIn()}
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2"
                title={he ? "טבעת פנימית חדשה" : "Create inner ring"}
              >
                {he ? "זום פנימה (טבעת)" : "Zoom in (ring)"}
              </button>
              <button
                onClick={() => {
                  if (refinedDef || priorCause || exampleText || counterExample) runDeepenOnce();
                  setStep(5);
                }}
                className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2"
              >
                {he ? "המשך" : "Continue"}
              </button>
            </div>
          </div>
          <ProofTree g={{ ...g, scores }} />
          <JournalPane
            he={he}
            value={journal}
            onChange={setJournal}
            placeholder={he ? "כתיבה חופשית. נשמר אוטומטית במכשיר." : "Free writing. Autosaved locally."}
          />
        </div>
      )}

      {/* Step 5: Common notions */}
      {step === 5 && (
        <div className="space-y-6">
          <WalkHelpBox id="step5" he={he} />
          <div className="text-sm font-medium">
            {he ? "בחר/י מה בטוח נכון כאן (ניתן לעריכה/הוספה)" : "Pick what is definitely true here (editable/addable)"}
          </div>
          <div className="grid grid-cols-1 gap-2">
            {(he ? COMMON_NOTIONS_HE : COMMON_NOTIONS_EN).map((c) => (
              <button
                key={c}
                onClick={() => toggleCommon(c)}
                className={
                  "rounded-xl border px-3 py-2 text-left " +
                  (commons.includes(c) ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")
                }
              >
                {c}
              </button>
            ))}
            <AddCommon he={he} onAdd={(txt) => toggleCommon(txt)} />
          </div>
          <ProofTree g={{ ...g, scores }} />
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(4)} className="text-xs opacity-70 hover:opacity-100">
              {he ? "חזרה" : "Back"}
            </button>
            <button onClick={applyCommons} className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2">
              {he ? "המשך" : "Continue"}
            </button>
          </div>
        </div>
      )}

      {/* Step 6: Consequence test */}
      {step === 6 && (
        <div className="space-y-6">
          <WalkHelpBox id="step6" he={he} />
          <div className="text-sm font-medium">
            {he ? "אם המסקנה נכונה — מה עוד חייב לנבוע במקרים דומים?" : "If your take is right, what else must follow in similar cases?"}
          </div>
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={conseq[i]}
                onChange={(e) => {
                  const next = [...conseq];
                  next[i] = e.target.value;
                  setConseq(next);
                }}
                placeholder={he ? "השלכה הכרחית..." : "Necessary consequence..."}
                className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 px-4 py-3"
              />
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={rejects[i]}
                  onChange={(e) => {
                    const next = [...rejects];
                    next[i] = e.target.checked;
                    setRejects(next);
                  }}
                />
                {he ? "דוחה" : "Reject"}
              </label>
            </div>
          ))}
          <ProofTree g={{ ...g, scores }} />
          <div className="flex items-center justify-between">
            <button onClick={() => setStep(5)} className="text-xs opacity-70 hover:opacity-100">
              {he ? "חזרה" : "Back"}
            </button>
            <button onClick={applyConsequences} className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2">
              {he ? "סיום" : "Finish"}
            </button>
          </div>
        </div>
      )}

      {/* Step 7: Mark + Action + Crystallize */}
      {step === 7 && (
        <div className="space-y-6">
          {/* Adequacy help */}
          <WalkHelpBox id="adequacy" he={he} defaultOpen />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <ScoreCard title={he ? "מספיקות" : "Adequacy"} v={scores.adequacy} />
            <ScoreCard title={he ? "קוהרנטיות" : "Coherence"} v={scores.coherence} />
            <ScoreCard title={he ? "תלות בסימנים" : "Sign reliance"} v={scores.signDependence} inverse />
            <ScoreCard title={he ? "פסיביות" : "Passivity"} v={scores.passivity} inverse />
          </div>
          {/* Zoom help */}
          <WalkHelpBox id="zoom" he={he} />
          {/* Felt clarity at exit */}
          <ClarityMeter
            label={he ? "כמה זה ברור לך עכשיו בסוף?" : "How clear is this at the end?"}
            value={clarityNow}
            onChange={setClarityNow}
          />
          {clarityDelta !== null && (
            <div className="rounded-2xl border border-black/10 dark:border-white/10 p-3 text-sm">
              <span className="opacity-70">{he ? "שינוי בבהירות" : "Clarity change"}</span>:{" "}
              <b>{clarityDelta >= 0 ? "+" : ""}{clarityDelta}</b>
            </div>
          )}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
            <div className="text-sm font-medium mb-1">{he ? "מספיקות פרקטלית" : "Fractal adequacy"}</div>
            <div className="text-sm">
              {he ? "מספר טבעות" : "Rings"}: <b>{levels.length}</b> · {he ? "מינ' מספיקות" : "min adequacy"}:{" "}
              <b>{Math.round(agg.adequacy)}</b> · {he ? "מינ' קוהרנטיות" : "min coherence"}:{" "}
              <b>{Math.round(agg.coherence)}</b>
            </div>
          </div>
          {/* Action help */}
          <WalkHelpBox id="actions" he={he} />
          <Action he={he} scores={scores} />
          {/* Proof help */}
          <WalkHelpBox id="proof" he={he} />
          <ProofTree g={{ ...g, scores }} />
          {/* Aha + Next tiny action */}
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
            <div className="text-sm font-medium mb-2">{he ? "מה הובן כאן?" : "What clicked here?"}</div>
            <textarea
              value={aha}
              onChange={(e) => setAha(e.target.value)}
              placeholder={he ? "כתוב/כתבי רגע 'אהה' אחד במשפט." : "Write one 'aha' in one sentence."}
              className="w-full min-h-[70px] rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2"
            />
            <div className="mt-3 text-sm font-medium">{he ? "צעד קטן אחד" : "One tiny next action"}</div>
            <input
              value={nextTinyAction}
              onChange={(e) => setNextTinyAction(e.target.value)}
              placeholder={he ? "מה תעשה/תעשי תוך 24 שעות?" : "What will you do in 24 hours?"}
              className="w-full rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2 mt-1"
            />
          </div>
          {/* Synthesis help */}
          <WalkHelpBox id="synthesis" he={he} />
          <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
            <div className="text-sm font-medium mb-2">{he ? "גבישיות — משפט נקי אחד" : "Crystallize — one clean sentence"}</div>
            <textarea
              value={synthesis}
              onChange={(e) => setSynthesis(e.target.value)}
              placeholder={he ? "בגלל ___ לכן ___ (משפט אחד)" : "Because ___, therefore ___ (one sentence)"}
              className="w-full min-h-[70px] rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2"
            />
            <div className="mt-2 flex items-center gap-2 text-xs">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={selfCert} onChange={(e) => setSelfCert(e.target.checked)} />
                {he ? "אני יכול/ה להסביר את הסיבה בנשימה אחת." : "I can explain the cause in one breath."}
              </label>
              <button onClick={copySynthesis} className="ml-auto rounded-xl border border-black/10 dark:border-white/10 px-3 py-1">
                {he ? "העתקה" : "Copy"}
              </button>
              <span className={"text-xs " + (adequacyReached() && selfCert ? "text-green-600" : "opacity-60")}>
                {adequacyReached() && selfCert ? (he ? "הושגה מספיקות." : "Adequacy reached.") : he ? "המשך ללטש או זום פנימה." : "Keep refining or zoom in."}
              </span>
            </div>
          </div>
          {/* Final plain-language summary so the last page is obvious */}
          <WalkHelpBox id="final" he={he} />
          <FinalSummary
            he={he}
            line={line}
            because={because}
            therefore={therefore}
            clarityDelta={clarityDelta}
            aha={aha}
            nextTinyAction={nextTinyAction}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => zoomOut()}
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2 disabled:opacity-40"
                disabled={!trail.length}
              >
                {he ? "זום החוצה" : "Zoom out"}
              </button>
              <button onClick={() => zoomIn()} className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2">
                {he ? "זום פנימה" : "Zoom in"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportMarkdown} className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2">
                {he ? "ייצוא Markdown" : "Export Markdown"}
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setLine("");
                  setChosenCard(null);
                  setFocusWord("");
                  setBecause("");
                  setTherefore("");
                  setRules([]);
                  setCommons([]);
                  setConseq(["", ""]);
                  setRejects([false, false]);
                  setRefinedDef("");
                  setPriorCause("");
                  setExampleText("");
                  setCounterExample("");
                  setCounterHolds("unclear");
                  setLoopsDone(0);
                  setJournal("");
                  setTrail([]);
                  setG(initGraph(""));
                  setClarityStart(null);
                  setClarityNow(null);
                  setAha("");
                  setNextTinyAction("");
                }}
                className="rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2"
              >
                {he ? "עוד רעיון" : "Another idea"}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Guided modal */}
      <GuidedConversation open={guideOpen} he={he} onClose={()=>setGuideOpen(false)} onCommit={handleGuideCommit}/>
    </div>
  );
}

function ScoreCard({ title, v, inverse = false }: { title: string; v: number; inverse?: boolean }) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-3">
      <div className="text-xs opacity-70 mb-1">{title}</div>
      <div className="text-lg font-semibold">{Math.round(v)}</div>
      <div className="text-[10px] opacity-50">{inverse ? "lower is better" : "higher is better"}</div>
    </div>
  );
}

function AddCommon({ he, onAdd }: { he: boolean; onAdd: (t: string) => void }) {
  const [t, setT] = useState("");
  return (
    <div className="flex items-center gap-2">
      <input
        value={t}
        onChange={(e) => setT(e.target.value)}
        placeholder={he ? "הוסף/י כלל משותף..." : "Add a common notion..."}
        className="flex-1 rounded-2xl border border-black/10 dark:border-white/10 px-4 py-2"
      />
      <button
        onClick={() => {
          if (!t.trim()) return;
          onAdd(t.trim());
          setT("");
        }}
        className="rounded-2xl border border-black/10 dark:border-white/10 px-3 py-2 text-sm"
      >
        {he ? "הוסף" : "Add"}
      </button>
    </div>
  );
}

function Action({ he, scores }: { he: boolean; scores: { adequacy: number; signDependence: number } }) {
  const advice =
    scores.adequacy >= 65
      ? he
        ? "הסיבה נראית מספקת. בחר/י פעולה אחת שמתאימה לסיבה — בצע/י היום."
        : "Cause looks sufficient. Pick one action that matches the cause — do it today."
      : scores.signDependence > 20
      ? he
        ? "יותר מדי תלות בסימנים. חזור/י להגדרה: משפט אמיתי ובדיד על המילה המסומנת."
        : "Too much reliance on signs. Return to definition: one real, checkable sentence for the sting word."
      : he
      ? "סביר שיש חור בהסקה. נסה/י סיבה קודמת אחת או בדוק/בדקי השלכה נוספת."
      : "Likely a gap in derivation. Try one prior cause or test another consequence.";
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm font-medium mb-1">{he ? "צעד הבא" : "Next action"}</div>
      <div className="text-sm">{advice}</div>
    </div>
  );
}