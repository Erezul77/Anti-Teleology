"use client";
import React, { useMemo, useState, useEffect } from "react";
import type { EmotionKey, FuelKey } from "../lib/spinoCore";
import { SubMap, SpinoMap, fuelHuman as fuelHumanCore } from "../lib/spinoCore";

/**
 * PDWizardV6 — step-per-page (insurance-style) precision flow
 * Steps:
 * 1) Feeling & Sub (lock emotion exactly)
 * 2) Who it's about (role-specific) + auto link
 * 3) The Part (Top-3) + Rule (Top-2) + exact passive line + baseline meters + checklist lock
 * 4) Active lens (Top-2) → read once → after meters (+ Tighten once if needed)
 * 5) Summary (before/after lines + vectors + deltas)
 *
 * Props:
 *   input: {
 *     emotion, sub?, target_kind, target_role?, part, rule?, intensity_before, clarity_before
 *   }
 *   onComplete?: (payload) => void
 */

type TargetKind = "person" | "group" | "thing" | "self";
type LinkWord = "with" | "under" | "when";

const LINK_DEFAULT: Record<TargetKind, LinkWord> = {
  person: "with",
  group: "with",
  thing: "when",
  self: "under",
};

// Tight two-lens set per emotion (no menus of 4)
const LENS_PRIOR: Record<
  EmotionKey,
  Array<"necessity" | "misread" | "shape" | "accept">
> = {
  regret: ["shape", "necessity"],
  shame: ["shape", "misread"],
  envy: ["misread", "shape"],
  blame: ["necessity", "shape"],
  hate: ["misread", "necessity"],
  sadness: ["accept", "shape"],
};

export interface PDInput {
  emotion: EmotionKey;
  sub?: string;
  target_kind: TargetKind;
  target_role?: string;
  part: FuelKey;
  rule?: string;
  intensity_before: number; // 0..10
  clarity_before: number;   // 0..10
}

export default function PDWizardV6({
  input,
  onComplete,
}: {
  input: PDInput;
  onComplete?: (out: any) => void;
}) {
  // ── State ───────────────────────────────────────────────────────────────────
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // 1) Feeling
  const [emotion, setEmotion] = useState<EmotionKey>(input.emotion);
  const [sub, setSub] = useState<string | undefined>(input.sub);

  // 2) Who / link
  const [targetKind, setTargetKind] = useState<TargetKind>(input.target_kind);
  const [targetRole, setTargetRole] = useState<string | undefined>(input.target_role);
  const [link, setLink] = useState<LinkWord>(LINK_DEFAULT[input.target_kind]);

  // 3) Part / Rule / Passive line / Baseline meters / Checklist
  const PARTS_TOP3 = useMemo(() => top3Parts(emotion, sub), [emotion, sub]);
  const [part, setPart] = useState<FuelKey>(
    PARTS_TOP3.includes(input.part) ? input.part : PARTS_TOP3[0]
  );
  const RULES_TOP2 = useMemo(() => top2Rules(emotion, sub), [emotion, sub]);
  const [rule, setRule] = useState<string | undefined>(() =>
    RULES_TOP2.length ? (input.rule && RULES_TOP2.includes(input.rule) ? input.rule : RULES_TOP2[0]) : undefined
  );

  const [I0, setI0] = useState<number>(clamp0to10(input.intensity_before));
  const [C0, setC0] = useState<number>(clamp0to10(input.clarity_before));

  // checklist locks precision — user must tick all three before proceed
  const [ckWho, setCkWho] = useState(false);
  const [ckPart, setCkPart] = useState(false);
  const [ckLine, setCkLine] = useState(false);

  // 4) Lens / After meters / Tighten gate
  const LENSES = LENS_PRIOR[emotion];
  const [lens, setLens] = useState<(typeof LENSES)[number]>(LENSES[0]);
  const [I1, setI1] = useState(Math.max(0, I0 - 1));
  const [C1, setC1] = useState(Math.min(10, C0 + 1));
  const [tightenMode, setTightenMode] = useState(false);
  const [tightenUsed, setTightenUsed] = useState(false);

  // reset lens if emotion/sub changes
  useEffect(() => { setLens(LENS_PRIOR[emotion][0]); }, [emotion, sub]);

  // ── Derived labels & lines ──────────────────────────────────────────────────
  const whoLabel = useMemo(() => {
    if (targetKind === "person") return targetRole || "someone";
    if (targetKind === "group") return targetRole || "a group";
    if (targetKind === "thing") return targetRole || "the thing";
    return "a rule in me";
  }, [targetKind, targetRole]);

  const passiveLine = useMemo(() => {
    const base = `It's mainly about ${whoLabel} ${link} ${fuelHuman(part)}`;
    return `${base}.${rule ? ` (and a rule: ${rule})` : ""}`;
  }, [whoLabel, link, part, rule]);

  const activeLine = useMemo(() => {
    switch (lens) {
      case "necessity":
        return `With ${whoLabel} ${link} ${fuelHuman(part)}, this was bound to happen.`;
      case "misread":
        return targetKind === "thing"
          ? `It wasn't the thing; it was how I met it ${link} ${fuelHuman(part)}.`
          : `It wasn't the look/sign; it was ${whoLabel} ${link} ${fuelHuman(part)}.`;
      case "shape":
        return `Same shape, new scene — I see it now.`;
      case "accept":
        return `I don't fully know here — and I accept that.`;
    }
  }, [lens, whoLabel, link, part, targetKind]);

  // vectors (conatus)
  const vectorPassive = useMemo(() => {
    const R = rule ? 2 : targetKind === "person" || targetKind === "group" ? 1 : 0;
    const F = 1;
    const power = Math.round(10 * (0.6 * n01(I0) + 0.2 * (R / 2) + 0.2 * F));
    return { power, direction: -1 as const };
  }, [I0, targetKind, rule]);

  const vectorActive = useMemo(() => {
    const U = Math.round(10 * n01(C1));
    const dir = clamp(-1 + 0.2 * 1 + 0.1 * U, -1, +1); // picked a lens → +0.2
    const pow = Math.round(10 * (0.5 * n01(I1) + 0.3 * n01(U) + 0.2 * 0)); // part still exists conceptually
    return { power: pow, direction: dir };
  }, [I1, C1]);

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[100svh] bg-gray-50 text-gray-900">
      <Header />
      <main className="mx-auto max-w-xl px-4 py-6 space-y-6">
        <Stepper step={step} />

        {/* Step 1 — Feeling & Sub */}
        {step === 1 && (
          <Card>
            <Stage title="1. Name the feeling">
              <Row title="Feeling">
                <ChipRow>
                  {(["regret","shame","envy","blame","hate","sadness"] as EmotionKey[]).map(k=>(
                    <Pill key={k} label={cap(k)} selected={emotion===k} onClick={()=>{ setEmotion(k); setSub(undefined); }} />
                  ))}
                </ChipRow>
              </Row>
              {!!SubMap[emotion]?.length && (
                <Row title="Make it sharp">
                  <ChipRow>
                    {(SubMap[emotion]||[]).map(s=>(
                      <Pill key={s.key} label={s.label} selected={sub===s.key} onClick={()=>setSub(s.key)} />
                    ))}
                  </ChipRow>
                </Row>
              )}
              <Actions>
                <Button primary onClick={()=>setStep(2)} disabled={!emotion}>Continue</Button>
              </Actions>
            </Stage>
          </Card>
        )}

        {/* Step 2 — Who & Link */}
        {step === 2 && (
          <Card>
            <Stage title="2. Who is it about? (be exact)">
              <Row title="Pick one">
                <ChipRow>
                  {(["person","group","thing","self"] as TargetKind[]).map(k=>(
                    <Pill key={k} label={labelTarget(k)} selected={targetKind===k} onClick={()=>{
                      setTargetKind(k);
                      setLink(LINK_DEFAULT[k]);
                      if(k!=="person" && k!=="group") setTargetRole(undefined);
                    }} />
                  ))}
                </ChipRow>
              </Row>
              {(targetKind==="person"||targetKind==="group") && (
                <Row title="Role">
                  <ChipRow>
                    {roleSeeds(targetKind).map(r=>(
                      <Pill key={r} label={r} selected={targetRole===r} onClick={()=>setTargetRole(r)} />
                    ))}
                  </ChipRow>
                </Row>
              )}
              {targetKind==="thing" && (
                <Row title="Pick the thing">
                  <ChipRow>
                    {thingSeeds().map(r=>(
                      <Pill key={r} label={r} selected={targetRole===r} onClick={()=>setTargetRole(r)} />
                    ))}
                  </ChipRow>
                </Row>
              )}
              <Row title="Link (auto)">
                <ChipRow><Pill label={LINK_DEFAULT[targetKind]} selected /></ChipRow>
              </Row>

              <Actions>
                <Button onClick={()=>setStep(1)}>Back</Button>
                <Button primary onClick={()=>setStep(3)} disabled={targetKind!=="self" ? !targetRole : false}>Continue</Button>
              </Actions>
            </Stage>
          </Card>
        )}

        {/* Step 3 — Part, Rule, Passive line, Baseline, Checklist */}
        {step === 3 && (
          <Card>
            <Stage title="3. The part + your line">
              <Row title="What part made it sting? (pick one)">
                <ChipRow>
                  {PARTS_TOP3.map(p=>(
                    <Pill key={p} label={fuelHuman(p)} selected={part===p} onClick={()=>setPart(p)} />
                  ))}
                </ChipRow>
              </Row>

              {!!RULES_TOP2.length && (
                <Row title="+ rule (pick one)">
                  <ChipRow>
                    {RULES_TOP2.map(r=>(
                      <Pill key={r} label={r} selected={rule===r} onClick={()=>setRule(r)} />
                    ))}
                  </ChipRow>
                </Row>
              )}

              <Preview label="Your passive line" text={passiveLine} />

              <Row title="Baseline">
                <Meters
                  I={I0} onI={setI0} iLabel="Intensity (0–10)"
                  C={C0} onC={setC0} cLabel="Clarity (0–10)"
                />
              </Row>

              <Row title="Checklist (lock precision)">
                <Checklist
                  items={[
                    {label:`This is about: ${whoLabel}`, value:ckWho, onChange:setCkWho},
                    {label:`The part is: ${fuelHuman(part)}`, value:ckPart, onChange:setCkPart},
                    {label:`This line is exact for me`, value:ckLine, onChange:setCkLine},
                  ]}
                />
              </Row>

              <Actions>
                <Button onClick={()=>setStep(2)}>Back</Button>
                <Button primary onClick={()=>setStep(4)} disabled={!(ckWho && ckPart && ckLine)}>Continue</Button>
              </Actions>
            </Stage>
          </Card>
        )}

        {/* Step 4 — Lens, Read, After meters (+ Tighten once if needed) */}
        {step === 4 && (
          <Card>
            <Stage title="4. New read (active)">
              <Row title="Pick a lens">
                <ChipRow>
                  {LENSES.map(k=>(
                    <Pill key={k} label={lensLabel(k, whoLabel, link, part, targetKind)} selected={lens===k} onClick={()=>setLens(k)} />
                  ))}
                </ChipRow>
              </Row>

              <Preview label="Read once (plain)" text={activeLine} />

              <Row title="Now">
                <Meters
                  I={I1} onI={setI1} iLabel="Intensity now (0–10)"
                  C={C1} onC={setC1} cLabel="Clarity now (0–10)"
                />
              </Row>

              {tightenMode && (
                <Row title="Tighten (one time)">
                  <div className="text-xs text-gray-600 mb-2">If this didn't shift enough, try the other lens or swap the part.</div>
                  <ChipRow className="mb-2">
                    {LENSES.map(k=>(
                      <Pill key={k} label={cap(k)} selected={lens===k} onClick={()=>setLens(k)} />
                    ))}
                  </ChipRow>
                  <ChipRow>
                    {PARTS_TOP3.map(p=>(
                      <Pill key={p} label={fuelHuman(p)} selected={part===p} onClick={()=>setPart(p)} />
                    ))}
                  </ChipRow>
                </Row>
              )}

              <Row title="Vectors & deltas">
                <div className="grid grid-cols-2 gap-3">
                  <Tile small title="Vector (passive)">
                    <div className="text-sm">Power: <strong>{vectorPassive.power}</strong></div>
                    <div className="text-sm">Direction: <strong>−1</strong></div>
                  </Tile>
                  <Tile small title="Vector (active)">
                    <div className="text-sm">Power: <strong>{vectorActive.power}</strong></div>
                    <div className="text-sm">Direction: <strong>{vectorActive.direction.toFixed(2)}</strong></div>
                  </Tile>
                  <Tile small title="Δ Intensity"><div className="text-sm"><strong>{I1 - I0}</strong></div></Tile>
                  <Tile small title="Δ Clarity"><div className="text-sm"><strong>{C1 - C0}</strong></div></Tile>
                </div>
              </Row>

              <Actions>
                <Button onClick={()=>setStep(3)}>Back</Button>
                <Button
                  primary
                  onClick={()=>{
                    const pass = (I1 - I0) <= -2 || (C1 - C0) >= 2;
                    if(!pass && !tightenUsed){ setTightenMode(true); setTightenUsed(true); return; }
                    setStep(5);
                  }}
                >
                  Continue
                </Button>
              </Actions>
            </Stage>
          </Card>
        )}

        {/* Step 5 — Summary */}
        {step === 5 && (
          <Card>
            <Stage title="5. Summary">
              <Preview label="Old read" text={passiveLine} />
              <Preview label="New read" text={activeLine} />
              <Row title="Numbers">
                <div className="grid grid-cols-2 gap-3">
                  <Tile small title="Intensity before"><div className="text-sm"><strong>{I0}</strong></div></Tile>
                  <Tile small title="Intensity now"><div className="text-sm"><strong>{I1}</strong></div></Tile>
                  <Tile small title="Clarity before"><div className="text-sm"><strong>{C0}</strong></div></Tile>
                  <Tile small title="Clarity now"><div className="text-sm"><strong>{C1}</strong></div></Tile>
                </div>
              </Row>
              <Actions>
                <Button onClick={()=>location.reload()}>Restart</Button>
                <Button
                  primary
                  onClick={()=>{
                    onComplete?.({
                      passive_line: passiveLine,
                      active_line: activeLine,
                      vector_passive: vectorPassive,
                      vector_active: vectorActive,
                      intensity_before: I0, intensity_after: I1,
                      clarity_before: C0, clarity_after: C1,
                      deltas: { intensity: I1 - I0, clarity: C1 - C0 },
                      meta: { emotion, sub, target_kind: targetKind, target_role: targetRole, part, rule, link, lens },
                    });
                  }}
                >
                  Save
                </Button>
              </Actions>
            </Stage>
          </Card>
        )}
      </main>
    </div>
  );
}

// ── UI atoms ──────────────────────────────────────────────────────────────────
function Header(){
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-700"><strong>SpinO</strong> — PD Wizard v6</div>
        <button className="px-3 py-1.5 rounded-full border" onClick={()=>location.reload()}>Restart</button>
      </div>
    </div>
  );
}
function Stepper({step}:{step:1|2|3|4|5}){
  const labels = ["Feeling","Who","Part+Line","Lens","Summary"];
  return (
    <div className="flex items-center justify-between text-xs text-gray-600">
      {labels.map((lb,i)=>{
        const n=i+1, active=step===n, done=step>n;
        return (
          <div key={lb} className="flex items-center gap-2">
            <div className={[
              "w-6 h-6 rounded-full border flex items-center justify-center",
              done?"bg-black text-white border-black":active?"bg-gray-900 text-white border-gray-900":"bg-white border-gray-300"
            ].join(" ")}>{n}</div>
            <div className={active?"text-gray-900 font-medium":"text-gray-500"}>{lb}</div>
            {i<labels.length-1 && <div className="w-6 border-t border-dashed border-gray-300" />}
          </div>
        );
      })}
    </div>
  );
}
function Card({children}:{children:React.ReactNode}){ return <div className="rounded-2xl border p-5 shadow-sm bg-white">{children}</div>; }
function Stage({title,children}:{title:string;children:React.ReactNode}){ return (<><div className="text-sm text-gray-500 mb-2">{title}</div>{children}</>); }
function Row({title,children}:{title:string;children:React.ReactNode}){ return (<div className="mb-3"><div className="text-sm mb-1">{title}</div>{children}</div>); }
function ChipRow({children,className}:{children:React.ReactNode;className?:string}){ return <div className={"flex flex-wrap gap-2 "+(className||"")}>{children}</div>; }
function Pill({label,selected,onClick}:{label:string;selected?:boolean;onClick?:()=>void}){
  return <button onClick={onClick} className={["px-3 py-1.5 rounded-full text-sm border",selected?"bg-black text-white border-black":"bg-white hover:bg-gray-50 border-gray-300"].join(" ")}>{label}</button>;
}
function Preview({label,text}:{label:string;text:string}){
  return <div className="rounded-xl border p-3 bg-gray-50 text-sm"><div className="font-medium mb-1">{label}</div><div>{text}</div></div>;
}
function Meters({I,onI,C,onC,iLabel,cLabel}:{I:number;onI:(v:number)=>void;C:number;onC:(v:number)=>void;iLabel:string;cLabel:string}){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div><div className="text-sm mb-1">{iLabel}</div><Scale10 value={I} onChange={onI} /></div>
      <div><div className="text-sm mb-1">{cLabel}</div><Scale10 value={C} onChange={onC} /></div>
    </div>
  );
}
function Scale10({value,onChange}:{value:number;onChange:(v:number)=>void}){
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Array.from({length:11},(_,i)=>i).map(n=>(
        <button key={n} onClick={()=>onChange(n)} className={["w-7 h-7 rounded-md border text-xs flex items-center justify-center", value===n?"bg-black text-white border-black":"bg-white text-gray-600 border-gray-300"].join(" ")}>{n}</button>
      ))}
    </div>
  );
}
function Tile({title,children,small}:{title:string;children:React.ReactNode;small?:boolean}){
  return <div className="rounded-xl border p-3"><div className={"text-xs text-gray-500 "+(small?"":"mb-1")}>{title}</div>{children}</div>;
}
function Checklist({items}:{items:{label:string,value:boolean,onChange:(v:boolean)=>void}[]}){
  return (
    <div className="space-y-2">
      {items.map((it,i)=>(
        <label key={i} className="flex items-center gap-2 text-sm">
          <input type="checkbox" className="accent-black w-4 h-4" checked={it.value} onChange={e=>it.onChange(e.target.checked)} />
          <span>{it.label}</span>
        </label>
      ))}
    </div>
  );
}
function Actions({children}:{children:React.ReactNode}){ return <div className="mt-4 flex items-center gap-3">{children}</div>; }
function Button({children,onClick,primary,disabled}:{children:React.ReactNode;onClick:()=>void;primary?:boolean;disabled?:boolean}){
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "px-4 py-2 rounded-xl",
        primary ? "bg-black text-white" : "border",
        disabled ? "opacity-50 cursor-not-allowed" : ""
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ── Seeds & helpers ───────────────────────────────────────────────────────────
function roleSeeds(kind: "person"|"group"){
  if(kind==="person") return ["parent","mother","father","partner","ex-partner","boss/teacher","peer","neighbor","stranger","officer"];
  return ["family","team","class","crowd","online"];
}
function thingSeeds(){
  return ["noise","mess","rule","paperwork","traffic","delay","accident","barking","odor"];
}
function top3Parts(emotion: EmotionKey, sub?: string): FuelKey[] {
  const subs = SubMap[emotion] || [];
  const subRow = subs.find((s) => s.key === sub);
  const fromSub = (subRow?.fuels || []) as FuelKey[];
  const fromBase = (SpinoMap[emotion]?.defaultFuels || []) as FuelKey[];
  const merged = [...fromSub, ...fromBase];
  const uniq: FuelKey[] = [];
  for (const k of merged) if (!uniq.includes(k)) uniq.push(k);
  const fallback: FuelKey[] = ["people_watching","rule_should","power_gap","no_exit","threat_cue","place","time","authority_present","noise_smell"];
  for (const k of fallback) if (uniq.length < 3 && !uniq.includes(k as FuelKey)) uniq.push(k as FuelKey);
  return uniq.slice(0, 3);
}
function top2Rules(emotion: EmotionKey, sub?: string): string[] {
  const subs = SubMap[emotion] || [];
  const subRow = subs.find((s) => s.key === sub);
  const fromSub = subRow?.ruleOptions || [];
  const fromBase = SpinoMap[emotion]?.ruleOptions || [];
  const merged = Array.from(new Set([...fromSub, ...fromBase]));
  return merged.slice(0, 2);
}
function labelTarget(k: TargetKind){ return k==="person"?"person":k==="group"?"group":k==="thing"?"thing":"a rule in me"; }
function cap(s:string){ return s.charAt(0).toUpperCase()+s.slice(1); }
function fuelHuman(f: FuelKey){ try { return fuelHumanCore(f); } catch { return f.replaceAll("_"," "); } }
function clamp0to10(n:number){ return Math.max(0, Math.min(10, Math.round(n))); }
function n01(n:number){ return Math.max(0, Math.min(1, n/10)); }
function clamp(n:number,a:number,b:number){ return Math.max(a, Math.min(b, n)); }

function lensLabel(
  k: "necessity" | "misread" | "shape" | "accept",
  who: string, link: LinkWord, part: FuelKey, targetKind: TargetKind
) {
  if (k === "necessity") return `bound to happen ( ${who} ${link} ${fuelHuman(part)} )`;
  if (k === "misread")  return targetKind === "thing" ? "not the thing (structure)" : "not the look (them + part)";
  if (k === "shape")    return "same shape, new scene";
  return "accept not-knowing";
}
