"use client";
import { useEffect, useMemo, useState } from "react";
import PauseTimer from "./PauseTimer";
import VoiceIO from "./VoiceIO";
import { extractEssence } from "../lib/feelingEssence";
import TTSControls from "./TTSControls";
import { speak, stop, TTSProfile } from "../lib/tts";

type GuidedResult = {
  stingLine: string;
  essenceWords: string[];
  bodyNotes: string[];
  rules: string[];
  because: string;
  therefore: string;
};

export default function GuidedConversation({
  open,
  he = false,
  onClose,
  onCommit,
}: {
  open: boolean;
  he?: boolean;
  onClose: () => void;
  onCommit: (r: GuidedResult) => void;
}) {
  const [step, setStep] = useState<1|2|3|4|5|6>(1);
  const [transcript, setTranscript] = useState("");
  const [textA, setTextA] = useState(""); // "the line your mind said"
  const [body, setBody] = useState("");   // body scan notes
  const [free, setFree] = useState("");   // free associations
  const [ttsCfg, setTtsCfg] = useState<{ profile: TTSProfile; voiceName?: string; rate: number; pitch: number; volume: number; mute: boolean }>({
    profile: "gentle", voiceName: undefined, rate: 0.9, pitch: 1.05, volume: 0.95, mute: false
  });

  useEffect(()=>{ if(!open){ setStep(1); setTranscript(""); setTextA(""); setBody(""); setFree(""); }}, [open]);

  useEffect(()=>{
    if (!open) return;
    // Soft opening line
    const line = he
      ? "נשום/נשמי עמוק. נלך לאט, בעדינות. אני אשאל, את/ה תענה/י."
      : "Take a breath. We'll go slowly and gently. I'll ask; you'll answer.";
    speak(line, { lang: he ? "he-IL" : "en-US", ...ttsCfg });
    // cleanup
    return ()=>{ stop(); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const script = useMemo(()=>({
    arrival: he
      ? "עצמי עיניים. שתי נשימות עמוקות. אין מה לפתור כרגע; רק לשים לב."
      : "Close your eyes. Two deep breaths. Nothing to solve; just notice.",
    room: he
      ? "דמיינ/י חדר שקט. הרגע ההוא עומד בפתח. אל תיכנס/י עדיין—רק תראה/י שאתה בטוח."
      : "Imagine a quiet room. The moment stands at the doorway. Don't enter yet—just feel you're safe.",
    theLine: he
      ? "עכשיו תן/י למוח לומר את השורה המדויקת שקפצה אז. כתוב/כתבי אותה כמו שהיא."
      : "Now let your mind say the exact line it said then. Write it exactly, as-is.",
    bodyScan: he
      ? "סריקה קצרה של הגוף: היכן זה יושב? חזה, גרון, בטן, לסת, כתפיים… ומה התחושה? לחץ/חום/כבדות?"
      : "Quick body scan: where does it sit—chest, throat, belly, jaw, shoulders… and what's the feel—pressure/heat/heavy?",
    freeAssoc: he
      ? "דקה של כתיבה חופשית: מה קפץ עכשיו? מותר לקטוע, מותר לכתוב מבולגן."
      : "One minute of free writing. What just popped? Fragments are welcome.",
    crystallize: he
      ? "נסגור בזרם אחד. קבל/י 'בגלל → לכן' ראשוני. אפשר לערוך אחר כך."
      : "Let's finish with a single stream. We'll make a first 'Because → Therefore'. You can edit later.",
  }),[he]);

  const essence = useMemo(()=> extractEssence(`${textA}\n${body}\n${free}`), [textA, body, free]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:h-[80vh] h-[85vh] w-full md:w-[720px] bg-white dark:bg-black rounded-t-3xl md:rounded-2xl border border-black/10 dark:border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-black/10 dark:border-white/10">
          <div className="text-sm font-medium">{he ? "שיחת הדרכה" : "Guided Conversation"}</div>
          <button onClick={onClose} className="text-xs opacity-70 hover:opacity-100">{he ? "סגור" : "Close"}</button>
        </div>
        {/* Soft, appealing voice controls */}
        <div className="px-4 py-2 border-b border-black/10 dark:border-white/10">
          <div className="rounded-xl border border-black/10 dark:border-white/10 p-2">
            <TTSControls he={he} lang={he?"he-IL":"en-US"} onChange={setTtsCfg} />
          </div>
        </div>
        <div className="h-[calc(100%-96px)] overflow-y-auto p-4 space-y-5">
          {step===1 && (
            <Section title={he ? "הגעה" : "Arrival"} text={script.arrival}>
              <VoiceIO text={script.arrival} onTranscript={setTranscript}/>
              <PauseTimer seconds={20} label={he ? "נשימות" : "Breaths"} />
              <div className="flex justify-end">
                <button onClick={()=>setStep(2)} className="rounded-xl border px-3 py-2 text-sm">Next</button>
              </div>
            </Section>
          )}
          {step===2 && (
            <Section title={he ? "החדר" : "The Room"} text={script.room}>
              <VoiceIO text={script.room} onTranscript={setTranscript}/>
              <PauseTimer seconds={25} label={he ? "היווכחות" : "Settling"} />
              <div className="flex justify-end">
                <button onClick={()=>setStep(3)} className="rounded-xl border px-3 py-2 text-sm">Next</button>
              </div>
            </Section>
          )}
          {step===3 && (
            <Section title={he ? "השורה" : "The Line"} text={script.theLine}>
              <VoiceIO text={script.theLine} onTranscript={setTextA}/>
              <textarea value={textA} onChange={e=>setTextA(e.target.value)} placeholder={he ? "כתוב/כתבי את השורה המדויקת" : "Write the exact line"} className="w-full min-h-[80px] rounded-2xl border px-3 py-2"/>
              <div className="flex justify-end">
                <button disabled={!textA.trim()} onClick={()=>setStep(4)} className="rounded-xl border px-3 py-2 text-sm disabled:opacity-40">Next</button>
              </div>
            </Section>
          )}
          {step===4 && (
            <Section title={he ? "הגוף" : "Body scan"} text={script.bodyScan}>
              <VoiceIO text={script.bodyScan} onTranscript={setBody}/>
              <textarea value={body} onChange={e=>setBody(e.target.value)} placeholder={he ? "מיקום + תחושה (לדוגמה: 'לחץ בחזה')" : "Location + feel (e.g., 'pressure in chest')"} className="w-full min-h-[70px] rounded-2xl border px-3 py-2"/>
              <div className="flex justify-end">
                <button onClick={()=>setStep(5)} className="rounded-xl border px-3 py-2 text-sm">Next</button>
              </div>
            </Section>
          )}
          {step===5 && (
            <Section title={he ? "אסוציאציות" : "Free associations"} text={script.freeAssoc}>
              <VoiceIO text={script.freeAssoc} onTranscript={setFree}/>
              <textarea value={free} onChange={e=>setFree(e.target.value)} placeholder={he ? "פירורים, מילים, תמונות" : "Fragments, words, images"} className="w-full min-h-[90px] rounded-2xl border px-3 py-2"/>
              <PauseTimer seconds={45} label={he ? "זמן חופשי" : "Free time"} />
              <div className="rounded-xl border border-black/10 dark:border-white/10 p-3 text-sm">
                <div className="opacity-70">{he ? "ליבת תחושה (ניחוש ראשון):" : "Feeling essence (first read):"}</div>
                <div className="mt-1 text-sm">
                  <b>{essence.emotions.join(", ") || (he ? "—" : "—")}</b>
                  {essence.bodies.length ? <> · {essence.bodies.join(", ")}</> : null}
                  {essence.rules.length ? <> · rule: {essence.rules.join(", ")}</> : null}
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={()=>setStep(6)} className="rounded-xl border px-3 py-2 text-sm">Next</button>
              </div>
            </Section>
          )}
          {step===6 && (
            <Section title={he ? "גביש ראשון" : "First crystal"} text={script.crystallize}>
              <VoiceIO text={script.crystallize}/>
              <SuggestionCard he={he} because={essence.becauseSuggestion} therefore={essence.thereforeSuggestion} />
              <div className="flex items-center justify-between">
                <button onClick={onClose} className="text-xs opacity-70 hover:opacity-100">{he ? "בטל" : "Cancel"}</button>
                <button
                  onClick={()=>{
                    onCommit({
                      stingLine: textA.trim(),
                      essenceWords: essence.emotions,
                      bodyNotes: essence.bodies,
                      rules: essence.rules,
                      because: essence.becauseSuggestion,
                      therefore: essence.thereforeSuggestion
                    });
                    onClose();
                  }}
                  className="rounded-2xl bg-black text-white dark:bg-white dark:text-black px-4 py-2 text-sm"
                >
                  {he ? "שלח למסלול הרעיון" : "Send to Idea Walkthrough"}
                </button>
              </div>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({title, text, children}:{title:string; text:string; children:React.ReactNode}) {
  return (
    <div className="space-y-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="text-sm opacity-80">{text}</div>
      {children}
    </div>
  );
}

function SuggestionCard({he, because, therefore}:{he:boolean; because:string; therefore:string}) {
  return (
    <div className="rounded-2xl border border-black/10 dark:border-white/10 p-3 text-sm">
      <div className="opacity-70 mb-1">{he ? "הצעת ניסוח" : "Suggested wording"}</div>
      <div><b>{he ? "בגלל" : "Because"}</b> {because}</div>
      <div><b>{he ? "לכן" : "Therefore"}</b> {therefore}</div>
      <div className="mt-2 text-[11px] opacity-60">
        {he ? "זה רק זרז להתחלה — ניתן לערוך במסלול." : "Just a starter—edit freely in the walkthrough."}
      </div>
    </div>
  );
}
