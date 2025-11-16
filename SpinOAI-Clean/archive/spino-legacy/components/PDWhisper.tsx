"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * PDWhisper — intimate, not-a-form flow
 * Format: one prompt per screen, your-words-first, subtle chips, hidden extraction.
 *
 * Steps
 * 1) One sentence (their words)
 * 2) Pick & polish (we pre-extract "who/what", "the part", "a rule in me"; they accept/tweak)
 * 3) Compose (auto line in their words, fully editable)
 * 4) Sit (10s ring)
 * 5) Check in (strength / clarity)
 * 6) New read (two soft cards built from their words)
 * 7) Save (before/after + vectors)
 *
 * Drop-in: <PDWhisper onComplete={(out)=>...} />
 */

type TargetKind = "person" | "group" | "thing" | "self";
type LinkWord = "with" | "under" | "when";

const LINK_DEFAULT: Record<TargetKind, LinkWord> = { person: "with", group: "with", thing: "when", self: "under" };

// Soft dictionaries (expand as you like)
const FEELING_WORDS = ["regret","shame","envy","blame","hate","sadness","anger","fear","anxious","jealous","guilty","embarrassed","lonely"];
const ROLE_WORDS = ["mother","father","parent","partner","wife","husband","ex","boss","manager","teacher","professor","peer","friend","neighbor","stranger","officer","police","cop","crowd","class","team","family","online","group"];
const THING_WORDS = ["noise","mess","rule","paperwork","traffic","delay","accident","barking","odor","smell","email","meeting","deadline","intercom"];
const PART_PATTERNS: Array<[RegExp, string]> = [
  [/(in\s+front\s+of|people\s+watching|audience|on\s+stage)/i, "people watching"],
  [/(power\s+gap|above\s+me|they\s+decide|authority)/i, "power gap"],
  [/(stuck|no\s+way\s+out|trapped|can't\s+leave|no\s+exit)/i, "no exit"],
  [/(threat|danger|sign|look|tone|gesture)/i, "threat sign"],
  [/(at\s+home|at\s+work|office|the\s+place|this\s+room)/i, "the place"],
  [/(late|time|deadline|night|morning|always\s+when)/i, "the time"],
  [/(should|must|have\s+to|supposed\s+to)/i, "a 'should'"],
  [/(boss|police|teacher|authority)/i, "authority"],
  [/(noise|odor|smell|loud|barking|crowded)/i, "noise/smell"],
];
const RULE_PATTERNS: Array<[RegExp, string]> = [
  [/(must|should)\s+be\s+perfect/i, "I must be perfect"],
  [/(must|should)\s+be\s+fair/i, "Fairness must hold"],
  [/(must|should)\s+be\s+respected/i, "Respect must be shown"],
  [/(must|should)\s+stay\s+in\s+control|control\s+everything/i, "I must stay in control"],
  [/(status|winning)\s*=\s*worth|be\s+the\s+best/i, "Status = worth"],
];

export interface WhisperOutput {
  passive_line: string;
  active_line: string;
  vector_passive: { power: number; direction: -1 };
  vector_active: { power: number; direction: number };
  intensity_before: number;
  intensity_after: number;
  clarity_before: number;
  clarity_after: number;
  deltas: { intensity: number; clarity: number };
  meta: {
    feeling?: string;
    target_kind: TargetKind;
    target_label?: string;
    link: LinkWord;
    part?: string;
    rule?: string;
    lens?: "had_to_be" | "not_the_sign";
    raw_sentence: string;
  };
}

export default function PDWhisper({ onComplete }: { onComplete?: (out: WhisperOutput)=>void }) {
  type Scene = "write" | "polish" | "compose" | "sit" | "numbers" | "reframe" | "done";
  const [scene, setScene] = useState<Scene>("write");

  // 1) Their sentence
  const [raw, setRaw] = useState("");
  const [feeling, setFeeling] = useState<string>("");

  // 2) Hidden extraction → soft fields they can tweak
  const guess = useMemo(()=>extract(raw), [raw]);
  const [targetKind, setTargetKind] = useState<TargetKind>("person");
  const [targetLabel, setTargetLabel] = useState<string>("");
  const link: LinkWord = LINK_DEFAULT[targetKind];
  const [part, setPart] = useState<string>("");
  const [rule, setRule] = useState<string>("");

  // 3) Composed lines (editable passive)
  const [passive, setPassive] = useState("");
  const [lens, setLens] = useState<"had_to_be"|"not_the_sign"|null>(null);
  const active = useMemo(()=>{
    if(!lens) return "";
    if(lens==="had_to_be") return `With ${targetLabel || labelForKind(targetKind)} ${link} ${part || "that part"}, it would end up like this.`;
    if(targetKind==="thing") return `It wasn't the thing; it was how I met it ${link} ${part || "that part"}.`;
    return `I looked at the sign; the cause was ${targetLabel || labelForKind(targetKind)} ${link} ${part || "that part"}.`;
  },[lens,targetKind,targetLabel,link,part]);

  // 4–5) Sit + meters
  const [I0,setI0]=useState(6), [C0,setC0]=useState(3);
  const [I1,setI1]=useState(5), [C1,setC1]=useState(4);
  const [sitLeft,setSitLeft]=useState(10);
  const sitId=useRef<NodeJS.Timeout|null>(null);
  useEffect(()=>{
    if(scene!=="sit") return;
    setSitLeft(10);
    sitId.current && clearInterval(sitId.current);
    sitId.current = setInterval(()=>setSitLeft(s=>s>0?s-1:0),1000);
    return ()=>{ sitId.current && clearInterval(sitId.current); };
  },[scene]);

  // Prep when entering POLISH from WRITE
  useEffect(()=>{
    if(scene!=="polish") return;
    setFeeling(guess.feeling || feeling || "");
    setTargetKind(guess.targetKind || "person");
    setTargetLabel(guess.targetLabel || "");
    setPart(guess.part || "");
    setRule(guess.rule || "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[scene]);

  // Prep passive suggestion
  const passiveHint = useMemo(()=>{
    const who = targetLabel || labelForKind(targetKind);
    const p   = part || "the part that spikes it";
    const tail= rule ? ` (rule in me: ${rule})` : "";
    return `Right now, it's about ${who} ${link} ${p}.${tail}`;
  },[targetKind,targetLabel,link,part,rule]);

  // Vectors (hidden math)
  const vectorPassive = useMemo(()=>{
    const R = rule ? 2 : (targetKind==="person"||targetKind==="group") ? 1 : 0;
    const F = part ? 1 : 0;
    const power = Math.round(10*(0.6*n01(I0)+0.2*(R/2)+0.2*F));
    return { power, direction: -1 as const };
  },[I0, targetKind, rule, part]);
  const vectorActive = useMemo(()=>{
    const U = Math.round(10*n01(C1));
    const dir = clamp(-1 + 0.2*(lens?1:0) + 0.1*U, -1, +1);
    const pow = Math.round(10*(0.5*n01(I1)+0.3*n01(U)));
    return { power: pow, direction: dir };
  },[I1,C1,lens]);

  return (
    <div className="min-h-[100svh] bg-gradient-to-b from-stone-50 to-stone-100 text-stone-900">
      <AnimatePresence mode="wait">
        {scene==="write" && (
          <Scene key="write" title="tell me one sentence" hint="say it like you'd text a friend (no need to be polite).">
            <BigInput value={raw} onChange={setRaw} placeholder="e.g., I freeze when my boss calls me out in meetings and everyone stares" />
            <Ghost hint="you can add names, places, tiny details" />
            <Row>
              <div className="text-xs text-stone-600 mb-1">if helpful, tap a word</div>
              <ChipRow>
                {FEELING_WORDS.slice(0,6).map(w=><Chip key={w} onClick={()=>setRaw((r)=>r?`${r} (${w})`:w)}>{w}</Chip>)}
              </ChipRow>
            </Row>
            <Nav primary={{label:"continue", onClick:()=>raw.trim() && setScene("polish"), disabled:!raw.trim()}} />
          </Scene>
        )}

        {scene==="polish" && (
          <Scene key="polish" title="pick & polish" hint="keep what's true, change what's not — your words win.">
            <Field
              label="who/what is it about?"
              value={targetLabel}
              setValue={setTargetLabel}
              suggestions={suggestSubjectChips(guess)}
              onKindChange={setTargetKind}
              kind={targetKind}
            />
            <Field
              label="what part makes it hurt more?"
              value={part}
              setValue={setPart}
              suggestions={suggestPartChips(guess)}
            />
            <Field
              label="a rule in me (optional)"
              value={rule}
              setValue={setRule}
              suggestions={suggestRuleChips(guess)}
            />
            <Nav back={{onClick:()=>setScene("write")}} primary={{label:"compose", onClick:()=>{ setPassive(passiveHint); setScene("compose"); }}} />
          </Scene>
        )}

        {scene==="compose" && (
          <Scene key="compose" title="say it in one line" hint="make it sound like you (edit anything).">
            <ComposeBox value={passive} onChange={setPassive} />
            <Ghost hint={`suggestion: ${passiveHint}`} />
            <Nav back={{onClick:()=>setScene("polish")}} primary={{label:"continue", onClick:()=>setScene("sit"), disabled:!passive.trim()}} />
          </Scene>
        )}

        {scene==="sit" && (
          <Scene key="sit" title="sit with it" hint="10 seconds — breathe and let it be there.">
            <BreathRing seconds={sitLeft} />
            {!sitLeft && (
              <>
                <div className="text-sm text-center text-stone-600">ready</div>
                <Nav primary={{label:"continue", onClick:()=>setScene("numbers")}} />
              </>
            )}
          </Scene>
        )}

        {scene==="numbers" && (
          <Scene key="numbers" title="check in" hint="no right answers.">
            <Dial label="strength of the feeling (0–10)" value={I0} onChange={setI0} />
            <Dial label="how clear is the picture? (0–10)" value={C0} onChange={setC0} />
            <Nav back={{onClick:()=>setScene("sit")}} primary={{label:"new read", onClick:()=>setScene("reframe")}} />
          </Scene>
        )}

        {scene==="reframe" && (
          <Scene key="reframe" title="try a new read" hint="pick the one that eases it, even a little.">
            <RefCard
              selected={lens==="had_to_be"}
              onClick={()=>setLens("had_to_be")}
              title="had to be"
              body={`With ${targetLabel || labelForKind(targetKind)} ${LINK_DEFAULT[targetKind]} ${part || "that part"}, it would end up like this.`}
            />
            <RefCard
              selected={lens==="not_the_sign"}
              onClick={()=>setLens("not_the_sign")}
              title={targetKind==="thing" ? "not the thing" : "not the sign"}
              body={targetKind==="thing"
                ? `It wasn't the thing; it was how I met it ${LINK_DEFAULT[targetKind]} ${part || "that part"}.`
                : `I looked at the sign; the cause was ${targetLabel || labelForKind(targetKind)} ${LINK_DEFAULT[targetKind]} ${part || "that part"}.`}
            />
            <Prev title="old read" text={passive} />
            <Prev title="new read" text={active} />
            <div className="grid gap-4">
              <Dial label="strength now (0–10)" value={I1} onChange={setI1} />
              <Dial label="clarity now (0–10)" value={C1} onChange={setC1} />
            </div>
            <Nav
              back={{onClick:()=>setScene("numbers")}}
              primary={{label:"save", onClick:()=>{
                if(!lens) return;
                onComplete?.({
                  passive_line: passive.trim(),
                  active_line: active.trim(),
                  vector_passive: vectorPassive,
                  vector_active: vectorActive,
                  intensity_before: I0, intensity_after: I1,
                  clarity_before: C0,  clarity_after: C1,
                  deltas: { intensity: I1-I0, clarity: C1-C0 },
                  meta: {
                    feeling: feeling || guess.feeling || undefined,
                    target_kind: targetKind,
                    target_label: targetLabel || undefined,
                    link: LINK_DEFAULT[targetKind],
                    part: part || undefined,
                    rule: rule || undefined,
                    lens,
                    raw_sentence: raw
                  }
                });
                setScene("done");
              }, disabled: !lens}}
            />
          </Scene>
        )}

        {scene==="done" && (
          <Scene key="done" title="saved" hint="you can restart anytime.">
            <button className="px-4 py-2 rounded-xl border" onClick={()=>location.reload()}>restart</button>
          </Scene>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────── extraction & helpers (subtle) ─────────────────── */

function extract(text: string): {
  feeling?: string;
  targetKind?: TargetKind;
  targetLabel?: string;
  part?: string;
  rule?: string;
} {
  const t = text.trim();

  // feeling (pick last known feeling word seen)
  let feeling = undefined as string|undefined;
  for(const w of FEELING_WORDS){
    if(new RegExp(`\\b${escapeReg(w)}\\b`, "i").test(t)) feeling = w;
  }

  // rule
  let rule = undefined as string|undefined;
  for(const [rx, label] of RULE_PATTERNS){ if(rx.test(t)){ rule = label; break; } }

  // part
  let part = undefined as string|undefined;
  for(const [rx, label] of PART_PATTERNS){ if(rx.test(t)){ part = label; break; } }

  // subject
  let targetLabel = undefined as string|undefined;
  let targetKind: TargetKind | undefined = undefined;

  // heuristic: pick named roles / groups / things
  for(const r of ROLE_WORDS){
    const rx = new RegExp(`\\b${escapeReg(r)}\\b`, "i");
    if(rx.test(t)){ targetLabel = r; targetKind = ["crowd","class","team","family","online","group"].includes(r) ? "group":"person"; break; }
  }
  if(!targetLabel){
    for(const r of THING_WORDS){
      const rx = new RegExp(`\\b${escapeReg(r)}\\b`, "i");
      if(rx.test(t)){ targetLabel = r; targetKind = "thing"; break; }
    }
  }

  // heuristic: "my X", "the X"
  const mMy = t.match(/\bmy\s+([A-Z][a-z]+|\w+)\b/);
  if(mMy && !targetLabel){ targetLabel = `my ${mMy[1]}`; targetKind = "person"; }

  // fallback
  if(!targetKind) targetKind = "person";

  return { feeling, targetKind, targetLabel, part, rule };
}

/* ───────────────────────── UI atoms ───────────────────────── */

function Scene({ title, hint, children }:{ title: string; hint?: string; children: React.ReactNode }) {
  return (
    <motion.div className="mx-auto max-w-2xl px-6 py-10"
      initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.25}}>
      <div className="mb-2 text-xs uppercase tracking-wide text-stone-500">{title}</div>
      {hint && <div className="mb-6 text-stone-600 text-sm">{hint}</div>}
      <div className="space-y-4">{children}</div>
    </motion.div>
  );
}

function Row({ children }:{ children: React.ReactNode }){ return <div className="mt-3">{children}</div>; }

function BigInput({ value, onChange, placeholder }:{ value:string; onChange:(v:string)=>void; placeholder?:string }){
  return <textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3}
    className="w-full rounded-2xl border px-4 py-3 text-lg leading-relaxed bg-white/80" />;
}
function ComposeBox({ value, onChange }:{ value:string; onChange:(v:string)=>void }){
  return <textarea value={value} onChange={e=>onChange(e.target.value)} rows={3}
    className="w-full rounded-2xl border px-4 py-3 text-lg leading-relaxed bg-white/80" />;
}
function ChipRow({ children }:{ children: React.ReactNode }){ return <div className="flex flex-wrap gap-2">{children}</div>; }
function Chip({ children, selected, onClick }:{ children: React.ReactNode; selected?: boolean; onClick?:()=>void }){
  return <button onClick={onClick} className={[
    "px-3 py-1.5 rounded-full border text-sm",
    selected?"bg-stone-900 text-white border-stone-900":"bg-white/80 hover:bg-white border-stone-300"
  ].join(" ")}>{children}</button>;
}
function Ghost({ hint }:{ hint: string }){ return <div className="text-xs text-stone-500">{hint}</div>; }

function BreathRing({ seconds }:{ seconds:number }){
  const pct = (10 - seconds)/10;
  return (
    <div className="flex items-center justify-center py-10">
      <div className="relative w-40 h-40">
        <div className="absolute inset-0 rounded-full border-2 border-stone-300" />
        <div className="absolute inset-0 rounded-full" style={{boxShadow:"inset 0 0 0 9999px rgba(0,0,0,0.04)"}} />
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="h-full bg-stone-900/10" style={{clipPath:`inset(${100 - pct*100}% 0 0 0)`}} />
        </div>
      </div>
    </div>
  );
}
function Dial({ label, value, onChange }:{ label:string; value:number; onChange:(n:number)=>void }){
  return (
    <div>
      <div className="text-sm mb-2">{label}</div>
      <div className="flex gap-1 flex-wrap">
        {Array.from({length:11},(_,i)=>i).map(n=>(
          <button key={n} onClick={()=>onChange(n)} className={[
            "w-8 h-8 rounded-md border text-xs flex items-center justify-center",
            value===n?"bg-stone-900 text-white border-stone-900":"bg-white border-stone-300 text-stone-600"
          ].join(" ")}>{n}</button>
        ))}
      </div>
      <div className="text-xs text-stone-500 mt-1">{value===0?"none / foggy": value===10?"overwhelming / crystal": " "}</div>
    </div>
  );
}
function RefCard({ title, body, selected, onClick }:{ title:string; body:string; selected?:boolean; onClick:()=>void }){
  return (
    <button onClick={onClick} className={[
      "w-full text-left rounded-2xl border p-4 transition",
      selected?"bg-stone-900 text-white border-stone-900":"bg-white/80 hover:bg-white border-stone-300"
    ].join(" ")}>
      <div className="text-sm opacity-70">{title}</div>
      <div className="text-base leading-relaxed mt-1">{body}</div>
    </button>
  );
}
function Prev({ title, text }:{ title:string; text:string }){
  return (
    <div className="rounded-2xl border p-4 bg-white/80">
      <div className="text-xs uppercase tracking-wide text-stone-500">{title}</div>
      <div className="mt-1 text-base leading-relaxed whitespace-pre-wrap">{text}</div>
    </div>
  );
}
function Nav({ back, primary }:{ back?:{onClick:()=>void}, primary?:{label:string; onClick:()=>void; disabled?:boolean} }){
  return (
    <div className="mt-6 flex items-center justify-between">
      {back ? <button className="text-stone-600 hover:text-stone-900 text-sm" onClick={back.onClick}>back</button> : <span/>}
      {primary && <button disabled={primary.disabled} className={[
        "px-5 py-2 rounded-xl border text-sm",
        primary.disabled?"opacity-40 cursor-not-allowed":"hover:bg-white"
      ].join(" ")} onClick={primary.onClick}>{primary.label}</button>}
    </div>
  );
}

/* ───────────────────────── suggestors ───────────────────────── */
function suggestSubjectChips(guess: ReturnType<typeof extract>){
  const chips: Array<{label:string,kind?:TargetKind}> = [];
  if(guess.targetLabel) chips.push({label:guess.targetLabel});
  ["partner","boss","teacher","parent","crowd","team","class","family","online","noise","rule","traffic"].forEach(x=>{
    if(!chips.find(c=>c.label===x)) chips.push({label:x});
  });
  return chips;
}
function suggestPartChips(guess: ReturnType<typeof extract>){
  const xs = ["people watching","power gap","no exit","threat sign","the place","the time","a 'should'","authority","noise/smell"];
  if(guess.part && !xs.includes(guess.part)) xs.unshift(guess.part);
  return xs.map(label=>({label}));
}
function suggestRuleChips(guess: ReturnType<typeof extract>){
  const xs = ["I must be perfect","Fairness must hold","Respect must be shown","I must stay in control","Status = worth"];
  if(guess.rule && !xs.includes(guess.rule)) xs.unshift(guess.rule);
  return xs.map(label=>({label}));
}

/* ───────────────────────── compound field ───────────────────────── */
function Field({ label, value, setValue, suggestions, onKindChange, kind }:{
  label: string;
  value: string;
  setValue: (v:string)=>void;
  suggestions: Array<{label:string, kind?:TargetKind}>;
  onKindChange?: (k:TargetKind)=>void;
  kind?: TargetKind;
}){
  return (
    <div>
      <div className="text-sm mb-1">{label}</div>
      {onKindChange && kind && (
        <div className="mb-2">
          <ChipRow>
            {(["person","group","thing","self"] as TargetKind[]).map(k=>(
              <Chip key={k} onClick={()=>onKindChange(k)} selected={kind===k}>{labelForKind(k)}</Chip>
            ))}
          </ChipRow>
        </div>
      )}
      <input value={value} onChange={e=>setValue(e.target.value)} placeholder="your words"
        className="w-full rounded-xl border px-3 py-2 text-sm bg-white/80" />
      {!!suggestions?.length && (
        <div className="mt-2">
          <ChipRow>
            {suggestions.slice(0,8).map((s,i)=>(
              <Chip key={i} onClick={()=>setValue(s.label)}>{s.label}</Chip>
            ))}
          </ChipRow>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── tiny utils ───────────────────────── */
function labelForKind(k: TargetKind){ return k==="person"?"someone":k==="group"?"a group":k==="thing"?"the thing":"a rule in me"; }
function n01(n:number){ return Math.max(0, Math.min(1, n/10)); }
function clamp(n:number,a:number,b:number){ return Math.max(a, Math.min(b, n)); }
function escapeReg(s:string){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }
