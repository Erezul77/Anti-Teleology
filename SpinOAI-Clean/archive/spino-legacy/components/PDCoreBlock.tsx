"use client";
import React, { useMemo, useState, useEffect } from "react";
import type { EmotionKey, FuelKey } from "../lib/spinoCore";
import { SubMap, SpinoMap, fuelHuman as fuelHumanFromCore } from "../lib/spinoCore";

// ───────────────────────────────────────────────────────────────────────────────
// Precision constants
// ───────────────────────────────────────────────────────────────────────────────
type TargetKind = "person" | "group" | "thing" | "self";
type LinkWord = "with" | "under" | "when";

const LINK_DEFAULT: Record<TargetKind, LinkWord> = {
  person: "with",
  group: "with",
  thing: "when",
  self: "under",
};

// Two-lens strategy per emotion (tight, direct)
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

// ───────────────────────────────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────────────────────────────
export interface PDInput {
  emotion: EmotionKey;
  sub?: string;
  target_kind: TargetKind;
  target_role?: string;
  part: FuelKey;                // initial guess
  rule?: string;                // optional incoming rule
  intensity_before: number;     // 0..10
  clarity_before: number;       // 0..10
}

export interface PDOutput {
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
    emotion: EmotionKey;
    sub?: string;
    target_kind: TargetKind;
    target_role?: string;
    part: FuelKey;
    rule?: string;
    link: LinkWord;
    lens: "necessity" | "misread" | "shape" | "accept";
  };
}

// ───────────────────────────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────────────────────────
export default function PDCoreBlock({
  input,
  onComplete,
}: {
  input: PDInput;
  onComplete?: (out: PDOutput) => void;
}) {
  // A) Passive tuple (locked, crisp)
  const [emotion, setEmotion] = useState<EmotionKey>(input.emotion);
  const [sub, setSub] = useState<string | undefined>(input.sub);
  const [targetKind, setTargetKind] = useState<TargetKind>(input.target_kind);
  const [targetRole, setTargetRole] = useState<string | undefined>(input.target_role);

  // Link is auto from target
  const [link, setLink] = useState<LinkWord>(LINK_DEFAULT[input.target_kind]);

  // Top-3 parts (by emotion/sub)
  const PARTS_TOP3 = useMemo(() => top3Parts(emotion, sub), [emotion, sub]);
  const [part, setPart] = useState<FuelKey>(
    PARTS_TOP3.includes(input.part) ? input.part : PARTS_TOP3[0]
  );

  // Rule: force pick 1 from top-2 if available
  const RULES_TOP2 = useMemo(() => top2Rules(emotion, sub), [emotion, sub]);
  const [rule, setRule] = useState<string | undefined>(() =>
    RULES_TOP2.length ? (input.rule && RULES_TOP2.includes(input.rule) ? input.rule : RULES_TOP2[0]) : undefined
  );

  // Baseline meters
  const [I0, setI0] = useState<number>(clamp0to10(input.intensity_before));
  const [C0, setC0] = useState<number>(clamp0to10(input.clarity_before));

  // B) Lens (Top-2 for emotion)
  const LENSES = LENS_PRIOR[emotion];
  const [lens, setLens] = useState<(typeof LENSES)[number] | null>(LENSES[0]);

  // After meters
  const [I1, setI1] = useState<number>(Math.max(0, I0 - 1));
  const [C1, setC1] = useState<number>(Math.min(10, C0 + 1));

  // Tighten step (one chance)
  const [needsTighten, setNeedsTighten] = useState<boolean>(false);
  const [tightenUsed, setTightenUsed] = useState<boolean>(false);

  // C) Derived lines
  const whoLabel = useMemo(() => {
    if (targetKind === "person") return targetRole || "someone";
    if (targetKind === "group") return targetRole || "a group";
    if (targetKind === "thing") return targetRole || "the thing";
    return "a rule in me";
  }, [targetKind, targetRole]);

  const passiveLine = useMemo(() => {
    const base = `It's mainly about ${whoLabel} ${link} ${fuelHuman(part)}`;
    const tail = rule ? ` (and a rule: ${rule})` : "";
    return `${base}.${tail}`;
  }, [whoLabel, link, part, rule]);

  const activeLine = useMemo(() => {
    if (!lens) return "";
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

  // D) Vectors
  const vectorPassive = useMemo(() => {
    const R = rule ? 2 : targetKind === "person" || targetKind === "group" ? 1 : 0;
    const F = 1; // the part is present
    const power = Math.round(10 * (0.6 * n01(I0) + 0.2 * (R / 2) + 0.2 * F));
    return { power, direction: -1 as const };
  }, [I0, targetKind, rule]);

  const vectorActive = useMemo(() => {
    const U = Math.round(10 * n01(C1));
    const dir = clamp(-1 + 0.2 * (lens ? 1 : 0) + 0.1 * U, -1, +1);
    const pow = Math.round(10 * (0.5 * n01(I1) + 0.3 * n01(U) + 0.2 * (part ? 0 : 1)));
    return { power: pow, direction: dir };
  }, [I1, C1, lens, part]);

  // E) Steps
  type Step = "P_LOCK" | "A_READ" | "TIGHTEN" | "DONE";
  const [step, setStep] = useState<Step>("P_LOCK");

  // Reset lens when feeling/sub changes
  useEffect(() => {
    setLens(LENS_PRIOR[emotion][0]);
  }, [emotion, sub]);

  // ────────────────────────────────────────────────────────────────────────────
  // UI
  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-xl px-4 py-6 space-y-6 text-gray-900">
      <Header />

      {step === "P_LOCK" && (
        <Card>
          <Stage title="Passive — lock it">
            {/* Feeling & sub (locked to current, but still switchable) */}
            <Row title="Feeling">
              <ChipRow>
                {(["regret","shame","envy","blame","hate","sadness"] as EmotionKey[]).map(k=>(
                  <Pill key={k} label={cap(k)} selected={emotion===k} onClick={()=>setEmotion(k)} />
                ))}
              </ChipRow>
              {!!SubMap[emotion]?.length && (
                <div className="mt-2">
                  <ChipRow>
                    {(SubMap[emotion]||[]).map(s=>(
                      <Pill key={s.key} label={s.label} selected={sub===s.key} onClick={()=>setSub(s.key)} />
                    ))}
                  </ChipRow>
                </div>
              )}
            </Row>

            <Row title="Who is it about?">
              <ChipRow>
                {(["person","group","thing","self"] as TargetKind[]).map(k=>(
                  <Pill key={k} label={labelTarget(k)} selected={targetKind===k} onClick={()=>{
                    setTargetKind(k);
                    setLink(LINK_DEFAULT[k]);
                    // reset role if switching
                    if(k!=="person" && k!=="group") setTargetRole(undefined);
                  }} />
                ))}
              </ChipRow>
              {(targetKind==="person"||targetKind==="group") && (
                <div className="mt-2">
                  <ChipRow>
                    {roleSeeds(targetKind).map(r=>(
                      <Pill key={r} label={r} selected={targetRole===r} onClick={()=>setTargetRole(r)} />
                    ))}
                  </ChipRow>
                </div>
              )}
            </Row>

            <Row title={`Link (auto)`}>
              <ChipRow>
                {[LINK_DEFAULT[targetKind]].map(lk=>(
                  <Pill key={lk} label={lk} selected />
                ))}
              </ChipRow>
            </Row>

            <Row title="The part (pick one)">
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

            <Preview label="Your line" text={passiveLine} />

            <Meters
              iLabel="Intensity (0–10)"
              cLabel="Clarity (0–10)"
              I={I0} onI={setI0}
              C={C0} onC={setC0}
            />

            <Actions>
              <Button onClick={()=>setStep("A_READ")} primary>Continue</Button>
            </Actions>
          </Stage>
        </Card>
      )}

      {step === "A_READ" && (
        <Card>
          <Stage title="Active — read once">
            <Row title="Lens">
              <ChipRow>
                {LENSES.map(k=>(
                  <Pill key={k} label={lensLabel(k, whoLabel, link, part, targetKind)} selected={lens===k} onClick={()=>setLens(k)} />
                ))}
              </ChipRow>
            </Row>

            <Preview label="Read this" text={activeLine} />

            <Meters
              iLabel="Intensity now (0–10)"
              cLabel="Clarity now (0–10)"
              I={I1} onI={setI1}
              C={C1} onC={setC1}
            />

            {/* Summary tiles */}
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Tile small title="Vector (passive)">
                <div className="text-sm">Power: <strong>{vectorPassive.power}</strong></div>
                <div className="text-sm">Direction: <strong>−1</strong></div>
              </Tile>
              <Tile small title="Vector (active)">
                <div className="text-sm">Power: <strong>{vectorActive.power}</strong></div>
                <div className="text-sm">Direction: <strong>{vectorActive.direction.toFixed(2)}</strong></div>
              </Tile>
              <Tile small title="Δ Intensity">
                <div className="text-sm"><strong>{I1 - I0}</strong></div>
              </Tile>
              <Tile small title="Δ Clarity">
                <div className="text-sm"><strong>{C1 - C0}</strong></div>
              </Tile>
            </div>

            <Actions>
              <Button onClick={()=>{
                const pass = (I1 - I0) <= -2 || (C1 - C0) >= 2;
                if(!pass && !tightenUsed) { setNeedsTighten(true); setStep("TIGHTEN"); }
                else finish();
              }} primary>
                Save
              </Button>
            </Actions>
          </Stage>
        </Card>
      )}

      {step === "TIGHTEN" && (
        <Card>
          <Stage title="Tighten (one step)">
            <Row title="Try the other lens or swap the part">
              <ChipRow>
                {LENSES.map(k=>(
                  <Pill key={k} label={cap(k)} selected={lens===k} onClick={()=>setLens(k)} />
                ))}
              </ChipRow>
              <div className="mt-2">
                <ChipRow>
                  {PARTS_TOP3.map(p=>(
                    <Pill key={p} label={fuelHuman(p)} selected={part===p} onClick={()=>setPart(p)} />
                  ))}
                </ChipRow>
              </div>
            </Row>

            <Preview label="Read again" text={activeLine} />

            <Meters
              iLabel="Intensity now (0–10)"
              cLabel="Clarity now (0–10)"
              I={I1} onI={setI1}
              C={C1} onC={setC1}
            />

            <Actions>
              <Button onClick={()=>{ setTightenUsed(true); finish(); }} primary>Save</Button>
            </Actions>
          </Stage>
        </Card>
      )}

      {step === "DONE" && (
        <Card>
          <Stage title="Saved">
            <div className="text-sm">Your change is saved in memory. You can copy it or restart.</div>
            <Actions>
              <Button onClick={()=>location.reload()}>Restart</Button>
            </Actions>
          </Stage>
        </Card>
      )}
    </div>
  );

  // ────────────────────────────────────────────────────────────────────────────
  // Finish → emit payload
  // ────────────────────────────────────────────────────────────────────────────
  function finish() {
    const out: PDOutput = {
      passive_line: passiveLine,
      active_line: activeLine,
      vector_passive: vectorPassive,
      vector_active: vectorActive,
      intensity_before: I0,
      intensity_after: I1,
      clarity_before: C0,
      clarity_after: C1,
      deltas: { intensity: I1 - I0, clarity: C1 - C0 },
      meta: { emotion, sub, target_kind: targetKind, target_role: targetRole, part, rule, link, lens: (lens as any) },
    };
    onComplete?.(out);
    setStep("DONE");
  }
}

// ───────────────────────────────────────────────────────────────────────────────
// Helpers (UI)
// ───────────────────────────────────────────────────────────────────────────────
function Header() {
  return (
    <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b">
      <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between">
        <div className="text-sm text-gray-700"><strong>SpinO</strong> — PD Core (Precision)</div>
        <button className="px-3 py-1.5 rounded-full border" onClick={()=>location.reload()}>Restart</button>
      </div>
    </div>
  );
}
function Stage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      {children}
    </>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border p-5 shadow-sm bg-white">{children}</div>;
}
function Row({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-sm mb-1">{title}</div>
      {children}
    </div>
  );
}
function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}
function Pill({ label, selected, onClick }: { label: string; selected?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "px-3 py-1.5 rounded-full text-sm border",
        selected ? "bg-black text-white border-black" : "bg-white hover:bg-gray-50 border-gray-300",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
function Preview({ label, text }: { label: string; text: string }) {
  return (
    <div className="mt-2 rounded-xl border p-3 bg-gray-50 text-sm">
      <div className="font-medium mb-1">{label}</div>
      <div>{text}</div>
    </div>
  );
}
function Meters({
  iLabel, cLabel, I, onI, C, onC,
}: {
  iLabel: string; cLabel: string;
  I: number; onI: (v: number) => void;
  C: number; onC: (v: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div className="text-sm mb-1">{iLabel}</div>
        <Scale10 value={I} onChange={onI} />
      </div>
      <div>
        <div className="text-sm mb-1">{cLabel}</div>
        <Scale10 value={C} onChange={onC} />
      </div>
    </div>
  );
}
function Scale10({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {Array.from({ length: 11 }, (_, i) => i).map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={[
            "w-7 h-7 rounded-md border text-xs flex items-center justify-center",
            value === n ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-300",
          ].join(" ")}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
function Tile({ title, children, small }: { title: string; children: React.ReactNode; small?: boolean }) {
  return (
    <div className="rounded-xl border p-3">
      <div className={"text-xs text-gray-500 " + (small ? "" : "mb-1")}>{title}</div>
      {children}
    </div>
  );
}
function Actions({ children }: { children: React.ReactNode }) {
  return <div className="mt-4 flex items-center gap-3">{children}</div>;
}
function Button({ children, onClick, primary }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={[
        "px-4 py-2 rounded-xl",
        primary ? "bg-black text-white" : "border",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

// ───────────────────────────────────────────────────────────────────────────────
// Helpers (logic)
// ───────────────────────────────────────────────────────────────────────────────
function top3Parts(emotion: EmotionKey, sub?: string): FuelKey[] {
  // Prefer sub-specific fuels; fallback to SpinoMap defaults; cap at 3
  const subs = SubMap[emotion] || [];
  const subRow = subs.find((s) => s.key === sub);
  const fromSub = (subRow?.fuels || []) as FuelKey[];
  const fromBase = (SpinoMap[emotion]?.defaultFuels || []) as FuelKey[];
  const merged = [...fromSub, ...fromBase];
  const uniq: FuelKey[] = [];
  for (const k of merged) if (!uniq.includes(k)) uniq.push(k);
  // Ensure at least 3 by adding generic fuels if needed
  const fallback: FuelKey[] = ["people_watching","rule_should","place","time","power_gap","no_exit","threat_cue","authority_present","noise_smell"];
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

function roleSeeds(targetKind: TargetKind): string[] {
  if (targetKind === "person") return ["parent", "partner", "boss/teacher", "peer", "stranger", "officer"];
  if (targetKind === "group") return ["crowd", "class", "team", "family", "online"];
  return [];
}

function labelTarget(k: TargetKind) {
  return k === "person" ? "person"
    : k === "group" ? "group"
    : k === "thing" ? "thing"
    : "a rule in me";
}

function lensLabel(
  k: "necessity" | "misread" | "shape" | "accept",
  who: string, link: LinkWord, part: FuelKey, targetKind: TargetKind
) {
  if (k === "necessity") return `bound to happen ( ${who} ${link} ${fuelHuman(part)} )`;
  if (k === "misread")  return targetKind === "thing" ? "not the thing (structure)" : "not the look (them + part)";
  if (k === "shape")    return "same shape, new scene";
  return "accept not-knowing";
}

function fuelHuman(f: FuelKey) {
  try { return fuelHumanFromCore(f); } catch { return f.replaceAll("_"," "); }
}
function cap(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
function clamp0to10(n: number) { return Math.max(0, Math.min(10, Math.round(n))); }
function n01(n: number) { return Math.max(0, Math.min(1, n / 10)); }
function clamp(n: number, a: number, b: number) { return Math.max(a, Math.min(b, n)); }
