"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { VERBAL_PROMPTS } from "../lib/verbalPrompts";
import { extractEssence } from "../lib/feelingEssence";
import TranscriptPane, { Msg } from "./TranscriptPane";
import QAFlow from "./QAFlow";
import HelpBox from "./HelpBox";
import IdeaWalkthrough from "./IdeaWalkthrough";
import GuidedConversation from "./GuidedConversation";
import FractalWheel from "./FractalWheel";
import { aggregateScores, initGraph, scoreAdequacy, IdeaGraph } from "../lib/adequacy";

export default function SpinOStudio(){
  const router = useRouter();
  const [he, setHe] = useState(false);
  useEffect(()=>{ try{ const lang = navigator?.language?.toLowerCase() ?? ""; setHe(lang.startsWith("he")||lang.includes("iw")); }catch{} },[]);
  // Demand settings
  const [rigor, setRigor] = useState<"rigorous"|"very_rigorous">("very_rigorous");
  const baselineLongMin = rigor === "very_rigorous" ? 90 : 60;
  const [gate, setGate] = useState(0);
  const prompts = VERBAL_PROMPTS.filter(p=>p.gate===gate);
  const [idx, setIdx] = useState(0);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [guideOpen, setGuideOpen] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  // Seeds for walkthrough
  const [seed, setSeed] = useState<{line:string; because:string; therefore:string; rules:string[]}|null>(null);
  // Local mini-graph for adequacy preview
  const [g, setG] = useState<IdeaGraph>(()=>initGraph(""));
  const wheel = useMemo(()=>[{ adequacy: scoreAdequacy(g).adequacy }], [g]);
  const agg = useMemo(()=>aggregateScores([g]), [g]);

  useEffect(()=>{
    // start with a guide message
    if (msgs.length===0){
      pushGuide(he
        ? "ברוך/ה הבא/ה ל-SpinO Studio. זה תהליך ארוך, תובעני, ומדויק. נלך שלב-שלב עד מספִיקות."
        : "Welcome to SpinO Studio. This is long, demanding, and precise. We proceed step by step to adequacy.");
      pushGuide(he? prompts[0].he : prompts[0].en);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  function pushGuide(t:string){ setMsgs(m=>[...m,{role:"guide", text:t, ts:Date.now()}]); }
  function pushUser(t:string){ setMsgs(m=>[...m,{role:"you", text:t, ts:Date.now()}]); }

  function nextPrompt(){
    if (idx < prompts.length-1){ setIdx(i=>i+1); pushGuide(he? prompts[idx+1].he : prompts[idx+1].en); }
    else {
      // advance gate
      const nextGate = Math.min(gate+1, 7);
      setGate(nextGate); setIdx(0);
      const pool = VERBAL_PROMPTS.filter(p=>p.gate===nextGate);
      if (pool.length) pushGuide(he? pool[0].he : pool[0].en);
    }
  }

  function handleSend(userText:string){
    pushUser(userText);
    // Update seed dynamically with essence extraction
    const ess = extractEssence(userText);
    const because = ess.becauseSuggestion;
    const therefore = ess.thereforeSuggestion;
    const line = (seed?.line?.trim() || userText.split("\n")[0]).slice(0,240);
    setSeed({ line, because, therefore, rules: ess.rules || [] });
    setG(initGraph(line)); // preview only
    nextPrompt();
  }

  function commitSeed(){
    if(!seed) return;
    try { localStorage.setItem("spino_incoming_seed", JSON.stringify(seed)); } catch {}
    router.push("/idea-walkthrough");
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {/* Verbal Studio only */}
      <div>
        <div className="rounded-2xl border border-black/10 dark:border-white/10 p-4 mb-3">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">{he? "סטודיו מילולי (קפדני)" : "Verbal Studio (rigorous)"}</div>
            <div className="flex items-center gap-2 text-xs">
              <span className="opacity-70">{he? "רמת דרישה:" : "Demand:"}</span>
              {["rigorous","very_rigorous"].map(k=>(
                <button key={k} onClick={()=>setRigor(k as any)}
                  className={"rounded-full border px-3 py-1 " + (rigor===k ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")}>
                  {k==="rigorous" ? (he? "קפדני" : "Rigorous") : (he? "קפדני מאד" : "Very rigorous")}
                </button>
              ))}
              <span className="mx-1">·</span>
              <button
                onClick={()=>setFocusMode(f=>!f)}
                className={"rounded-full border px-3 py-1 " + (focusMode ? "border-black dark:border-white" : "border-black/10 dark:border-white/10")}
                title={he? "מצב מיקוד: שאלה–תשובה" : "Focus Q&A mode"}
              >
                {focusMode ? (he? "מיקוד פעיל" : "Focus on") : (he? "מיקוד כבוי" : "Focus off")}
              </button>
              <button onClick={()=>setGuideOpen(true)}
                className="rounded-full border border-black/10 dark:border-white/10 px-3 py-1"
                title={he? "דמיון מודרך/קול" : "Guided imagination/voice"}>
                {he? "שיחת הדרכה" : "Guided Conversation"}
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs opacity-70">
            {he
              ? "אין קיצורי דרך. תשובתך חייבת להיות עשירה, לא תמציתית. מינימום מילים נאכף בכל שלב."
              : "No shortcuts. Your replies must be rich, not snappy. A minimum word count is enforced each step."}
          </div>
        </div>
        {focusMode ? (
          <QAFlow
            he={he}
            rigor={rigor}
            onSeedUpdate={(s)=>{ setSeed(s); setG(initGraph(s.line)); }}
            onCommit={(s)=>{ setSeed(s); commitSeed(); }}
          />
        ) : (
          <>
            {(() => {
              const active = prompts[idx];
              return (
                <div className="mb-3">
                  <HelpBox promptId={active?.id} he={he} />
                </div>
              );
            })()}
            <TranscriptPane
              items={msgs}
              onSend={handleSend}
              minWords={baselineLongMin}
              he={he}
              placeholder={he? "כתוב/כתבי תשובה מפורטת…" : "Write a detailed reply…"}
            />
          </>
        )}
        {/* Seed + Adequacy preview + commit */}
        <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 p-4">
          <div className="text-sm font-medium mb-2">{he? "גביש ראשוני" : "First crystal"}</div>
          {seed ? (
            <div className="text-sm space-y-1">
              <div><b>{he? "שורה" : "Line"}:</b> {seed.line}</div>
              <div><b>{he? "בגלל" : "Because"}:</b> {seed.because}</div>
              <div><b>{he? "לכן" : "Therefore"}:</b> {seed.therefore}</div>
              {seed.rules?.length ? <div><b>rule(s):</b> {seed.rules.join(", ")}</div> : null}
              <div className="mt-2 flex items-center justify-between">
                <FractalWheel levels={[{ adequacy: agg.adequacy }]} />
                <button onClick={commitSeed}
                  className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm">
                  {he? "המשך למסלול" : "Continue to Walkthrough"}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-xs opacity-70">
              {he? "ענה/עני לפרומפטים למעלה כדי לקבל גביש ראשוני." : "Reply to the prompts above to form a first crystal."}
            </div>
          )}
        </div>
      </div>

      {/* Guided modal */}
      <GuidedConversation
        open={guideOpen}
        he={he}
        onClose={()=>setGuideOpen(false)}
        onCommit={(r)=>{
          // use guided essence as seed and push into conversation
          const text = `${he? "השורה:" : "Line:"} ${r.stingLine}\n${he? "מהות:" : "Essence:"} ${r.essenceWords.join(", ")}\n${he? "בגלל:" : "Because:"} ${r.because}\n${he? "לכן:" : "Therefore:"} ${r.therefore}`;
          setSeed({ line: r.stingLine, because: r.because, therefore: r.therefore, rules: r.rules });
          setG(initGraph(r.stingLine));
          setMsgs(m=>[...m,{role:"guide", text: he? "גביש מהשיחה המודרכת הוזן. אפשר להמשיך או לשלוח למסלול." : "Crystal from guided conversation injected. Continue or send to walkthrough.", ts: Date.now()}]);
        }}
      />
    </div>
  );
}
