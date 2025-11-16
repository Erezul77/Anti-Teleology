"use client";

// SpinO — GLASSBREAKER v1
// A 3-minute game to surface a natural reflex under surprise and lock one mental "string".
// Phases: WarmUp (filters) → Chase (odd-one-out) + hidden rule flip → Reveal (handle + prediction).

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type WarmAnswers = {
  decideNow?: "decide" | "open";
  locus?: "outside" | "inside" | "mixed";
  frame?: "rule" | "loss" | "future" | "none";
  changeable?: "changeable" | "fixed";
  evidence?: "disconfirm" | "confirm";
  construal?: "concrete" | "gist";
};

type Reflex = "continue" | "askWhy" | "checkExample" | "switch" | "pause" | "image";
type Handle = "Check-Rule" | "Evidence-Ping" | "Decompose-Threat" | "Scope-Now" | "Clarify-Cause" | "Ask-Form";
type Prediction = "clearer" | "same" | "tangled" | "unsure";

type Phase = "WarmUp" | "Chase" | "Overlay" | "Reveal" | "Done";

// NEW: Context anchoring — scene + minimal meta so questions feel "about something"
type Scene = "message" | "request" | "decision" | "waiting" | "rule" | "threat" | "loss" | "money" | "health" | "study" | "other";
type SceneMeta = { horizon: "today" | "week" | "later"; stake: "low" | "mid" | "high"; agent: "me" | "other" | "system" };

// ---------- Odd-one-out engine ----------
type Item = { shape: "circle" | "square" | "triangle" | "diamond"; color: "red" | "blue" | "green" | "amber" };

function randomPick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

const SHAPES: Item["shape"][] = ["circle", "square", "triangle", "diamond"];
const COLORS: Item["color"][] = ["red", "blue", "green", "amber"];

// Rule 1: odd = unique color (shapes same)
// Rule 2: odd = unique shape (colors same)
function makeGrid(rule: 1 | 2): { items: Item[]; oddIndex: number } {
  const baseShape = randomPick(SHAPES);
  const baseColor = randomPick(COLORS);
  let items: Item[] = new Array(4).fill(null).map(() => ({ shape: baseShape, color: baseColor }));
  const oddIndex = Math.floor(Math.random() * 4);
  if (rule === 1) {
    // make odd a different color
    const otherColors = COLORS.filter(c => c !== baseColor);
    items[oddIndex] = { shape: baseShape, color: randomPick(otherColors) };
  } else {
    // rule 2: odd is different shape
    const otherShapes = SHAPES.filter(s => s !== baseShape);
    items[oddIndex] = { shape: randomPick(otherShapes), color: baseColor };
  }
  return { items, oddIndex };
}

function chip(text: string, active: boolean) {
  return `px-3 py-1.5 rounded-2xl border ${active ? "bg-black text-white" : "bg-white"}`;
}

function Shape({ item }: { item: Item }) {
  const colorClass = {
    red: "text-red-500",
    blue: "text-blue-500",
    green: "text-green-500",
    amber: "text-amber-500",
  }[item.color];
  const symbol = {
    circle: "●",
    square: "■",
    triangle: "▲",
    diamond: "◆",
  }[item.shape];
  return <span className={`text-3xl ${colorClass}`}>{symbol}</span>;
}

export default function GlassbreakerGame() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("WarmUp");
  const [warm, setWarm] = useState<WarmAnswers>({});
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [rule, setRule] = useState<1 | 2>(1);
  const [grid, setGrid] = useState(makeGrid(1));
  const [overlay, setOverlay] = useState<Reflex | null>(null);
  const [handle, setHandle] = useState<Handle | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  // Context Anchor state
  const [scene, setScene] = useState<Scene | null>(null);
  const [meta, setMeta] = useState<Partial<SceneMeta>>({});

  // Start Chase after WarmUp is completed
  function startChase() {
    setPhase("Chase");
    setRound(0);
    setScore(0);
    setRule(1);
    setGrid(makeGrid(1));
  }

  // Progress Chase; flip rule once at round 6 then show overlay
  useEffect(() => {
    if (phase !== "Chase") return;
    if (round === 6 && rule === 1) {
      // Flip the rule and prompt overlay
      setRule(2);
      setPhase("Overlay");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, phase]);

  function onPickOdd(i: number) {
    if (phase !== "Chase") return;
    if (i === grid.oddIndex) setScore(s => s + 1);
    setRound(r => r + 1);
    setGrid(makeGrid(rule));
    if (round >= 10) {
      // End after a handful more rounds post-flip
      setPhase("Reveal");
      selectHandle();
    }
  }

  function selectHandle(reflex?: Reflex) {
    const r = reflex ?? overlay ?? "continue";
    let chosen: Handle | null = null;
    if (r === "askWhy" || warm.frame === "rule") chosen = "Check-Rule";
    else if (r === "checkExample" || warm.evidence === "disconfirm") chosen = "Evidence-Ping";
    else if (r === "switch" || warm.frame === "future") chosen = "Decompose-Threat";
    else if (r === "pause" || (warm.frame === "loss" && warm.changeable === "fixed")) chosen = "Scope-Now";
    else if (r === "image") chosen = "Ask-Form";
    else chosen = "Clarify-Cause";
    setHandle(chosen);
  }

  function resetGame() {
    setPhase("WarmUp");
    setWarm({});
    setScore(0);
    setRound(0);
    setRule(1);
    setGrid(makeGrid(1));
    setOverlay(null);
    setHandle(null);
    setPrediction(null);
  }

  // --- Bridge: send current game summary → Affect Diagnostic (/diagnose)
  function analyzeInCube() {
    if (!handle || !prediction) return;
    const inputs = mapToDiagnostic({ warm, overlay, handle, prediction });
    const bridgePayload = {
      source: "glassbreaker",
      warm,
      overlay,
      handle,
      prediction,
      inputs,
      ts: Date.now(),
    };
    try {
      localStorage.setItem("spino_bridge", JSON.stringify(bridgePayload));
    } catch {}
    router.push("/diagnose");
  }

  function mapToDiagnostic({ warm, overlay, handle, prediction }: { warm: WarmAnswers; overlay: Reflex | null; handle: Handle; prediction: Prediction }) {
    // Defaults
    const mes = { M1:0,M2:0,M3:0,M4:0,M5:0,M6:0,M7:0,M8:0,M9:0,M10:0,M11:0,M12:0 } as any;
    const sliders = { clarity:50, agency:50, tension:50, valence:50 };
    const conatus = { C1:0,C2:0,C3:0,C4:0 };

    // Locus
    if (warm.locus === "outside") mes.M4 = 1;
    if (warm.locus === "inside") mes.M5 = 1;
    if (warm.locus === "mixed") { mes.M4 = 1; mes.M5 = 1; }

    // Changeability → influence
    mes.M3 = warm.changeable === "changeable" ? 1 : 0;

    // Evidence stance → perspective trading
    mes.M12 = warm.evidence === "disconfirm" ? 1 : 0;

    // Thinking mode → simplification ability
    mes.M9 = warm.construal === "concrete" ? 1 : 0;

    // Orientation & tendency from overlay/reflex
    const r = overlay ?? "continue";
    if (r === "switch" || r === "continue") { mes.M7 = 1; sliders.agency = 70; }
    if (r === "pause") { mes.M8 = 1; sliders.agency = 30; }
    if (r === "askWhy") { mes.M7 = 1; }
    if (r === "image") { sliders.agency = 45; }

    // Frame hints
    if (warm.frame === "future") sliders.tension = 65;
    if (warm.frame === "loss" && warm.changeable === "fixed") sliders.tension = 60;

    // Closure pressure hint
    if (warm.decideNow === "decide") sliders.clarity = 55; else if (warm.decideNow === "open") sliders.clarity = 50;
    if (warm.construal === "concrete") sliders.clarity += 10; // small boost
    if (warm.construal === "gist") sliders.clarity -= 5;
    sliders.clarity = Math.max(0, Math.min(100, sliders.clarity));

    // Conatus from prediction endorsement
    if (prediction === "clearer") { conatus.C1=1; conatus.C2=1; conatus.C3=1; conatus.C4=1; }
    if (prediction === "same") { conatus.C1=1; }

    // Minimal narrative for current ECPU stub (optional, neutral)
    const narBits = [
      warm.frame ? `frame:${warm.frame}`:null,
      warm.locus ? `locus:${warm.locus}`:null,
      warm.changeable?`changeable:${warm.changeable}`:null,
      warm.evidence?`evidence:${warm.evidence}`:null,
      warm.construal?`mode:${warm.construal}`:null,
      overlay?`reflex:${overlay}`:null,
      `handle:${handle}`,
    ].filter(Boolean).join("; ");

    const narrative = narBits;

    return { narrative, mes, sliders, conatus };
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">GLASSBREAKER</h1>
      <p className="text-sm text-gray-600">Pick a small real thing first. Then play. When things change, choose quickly.</p>

      {phase === "WarmUp" && (
        <div className="space-y-4">
          {/* Context Anchor */}
          <div className="space-y-2 p-3 border rounded-xl">
            <div className="text-sm font-medium">What is this about?</div>
            <div className="text-xs text-gray-500">Choose one that fits the thing on your mind right now.</div>
            <div className="flex flex-wrap gap-2">
              {([
                ["message","a message to write"],
                ["request","a request to make"],
                ["decision","a decision between options"],
                ["waiting","waiting for someone's reply"],
                ["rule","a rule/expectation in play"],
                ["threat","a future possibility"],
                ["loss","something already went wrong"],
                ["money","a money/admin task"],
                ["health","a health/admin task"],
                ["study","study/learning"],
                ["other","other/skip label"],
              ] as [Scene,string][]).map(([key,label])=> (
                <button key={key} className={chip(label, scene===key)} onClick={()=>setScene(key)}>{label}</button>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-2">
              <label className="text-xs">Time
                <div className="flex gap-2 mt-1">
                  {(["today","week","later"] as SceneMeta["horizon"][]).map(h=> (
                    <button key={h} className={chip(h, meta.horizon===h)} onClick={()=>setMeta(m=>({...m, horizon:h}))}>{h}</button>
                  ))}
                </div>
              </label>
              <label className="text-xs">Stake
                <div className="flex gap-2 mt-1">
                  {(["low","mid","high"] as SceneMeta["stake"][]).map(sv=> (
                    <button key={sv} className={chip(String(sv), meta.stake===sv)} onClick={()=>setMeta(m=>({...m, stake:sv}))}>{sv}</button>
                  ))}
                </div>
              </label>
              <label className="text-xs">Whose move mostly?
                <div className="flex gap-2 mt-1">
                  {(["me","other","system"] as SceneMeta["agent"][]).map(a=> (
                    <button key={a} className={chip(a, meta.agent===a)} onClick={()=>setMeta(m=>({...m, agent:a}))}>{a}</button>
                  ))}
                </div>
              </label>
            </div>
          </div>

          {/* Operator picks — phrased "about this ..." */}
          <div className="text-sm font-medium">Quick picks about this {scene ?? "thing"} (no thinking):</div>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 w-full">About this {scene ?? "thing"}: decide now or keep open?</span>
            <button className={chip("decide", warm.decideNow === "decide")} onClick={()=>setWarm(s=>({...s, decideNow:"decide"}))}>Decide now</button>
            <button className={chip("open", warm.decideNow === "open")} onClick={()=>setWarm(s=>({...s, decideNow:"open"}))}>Keep options open</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 w-full">For this {scene ?? "thing"}, cause location?</span>
            <button className={chip("outside", warm.locus === "outside")} onClick={()=>setWarm(s=>({...s, locus:"outside"}))}>Outside me</button>
            <button className={chip("inside", warm.locus === "inside")} onClick={()=>setWarm(s=>({...s, locus:"inside"}))}>Inside my thinking</button>
            <button className={chip("mixed", warm.locus === "mixed")} onClick={()=>setWarm(s=>({...s, locus:"mixed"}))}>Mixed</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 w-full">Closest frame for this {scene ?? "thing"}?</span>
            <button className={chip("rule", warm.frame === "rule")} onClick={()=>setWarm(s=>({...s, frame:"rule"}))}>Rule in play</button>
            <button className={chip("loss", warm.frame === "loss")} onClick={()=>setWarm(s=>({...s, frame:"loss"}))}>Loss already</button>
            <button className={chip("future", warm.frame === "future")} onClick={()=>setWarm(s=>({...s, frame:"future"}))}>Future possibility</button>
            <button className={chip("none", warm.frame === "none")} onClick={()=>setWarm(s=>({...s, frame:"none"}))}>None</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 w-full">Changeable for this {scene ?? "thing"}?</span>
            <button className={chip("chg", warm.changeable === "changeable")} onClick={()=>setWarm(s=>({...s, changeable:"changeable"}))}>Changeable</button>
            <button className={chip("fix", warm.changeable === "fixed")} onClick={()=>setWarm(s=>({...s, changeable:"fixed"}))}>Fixed</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 w-full">Evidence stance for this {scene ?? "thing"}?</span>
            <button className={chip("dis", warm.evidence === "disconfirm")} onClick={()=>setWarm(s=>({...s, evidence:"disconfirm"}))}>Disconfirming info</button>
            <button className={chip("con", warm.evidence === "confirm")} onClick={()=>setWarm(s=>({...s, evidence:"confirm"}))}>Supporting info</button>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-gray-500 w-full">Thinking mode for this {scene ?? "thing"}?</span>
            <button className={chip("conc", warm.construal === "concrete")} onClick={()=>setWarm(s=>({...s, construal:"concrete"}))}>Concrete details</button>
            <button className={chip("gist", warm.construal === "gist")} onClick={()=>setWarm(s=>({...s, construal:"gist"}))}>Big-picture gist</button>
          </div>

          <div className="pt-2">
            <button className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50" disabled={!scene || !meta.horizon || !meta.stake || !meta.agent || !warm.decideNow || !warm.locus || !warm.frame || !warm.changeable || !warm.evidence || !warm.construal} onClick={startChase}>Start game</button>
          </div>
        </div>
      )}

      {phase === "Chase" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">Odd-one-out · Rule {rule}</div>
            <div className="text-sm">Score: {score} · Round: {round}</div>
          </div>
          <div className="grid grid-cols-2 gap-6 p-6 border rounded-xl">
            {grid.items.map((it, idx) => (
              <button key={idx} className="aspect-square border rounded-xl flex items-center justify-center hover:scale-[1.02] transition" onClick={() => onPickOdd(idx)}>
                <Shape item={it} />
              </button>
            ))}
          </div>
        </div>
      )}

      {phase === "Overlay" && (
        <div className="space-y-3">
          <div className="p-4 border rounded-xl bg-amber-50">
            <div className="font-medium mb-2">Rule changed mid-round — pick your move:</div>
            <div className="flex flex-wrap gap-2">
              {([
                ["continue","Continue anyway"],
                ["askWhy","Ask why"],
                ["checkExample","Check one example"],
                ["switch","Switch strategy"],
                ["pause","Pause"],
                ["image","I don't care, just score"],
              ] as [Reflex,string][]).map(([key,label])=> (
                <button key={key} className={chip(label, overlay===key)} onClick={()=>{ setOverlay(key); }}>{label}</button>
              ))}
            </div>
            <div className="pt-3">
              <button className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50" disabled={!overlay} onClick={()=>{ selectHandle(); setPhase("Reveal"); }}>Continue</button>
            </div>
          </div>
        </div>
      )}

      {phase === "Reveal" && (
        <div className="space-y-4">
          <div className="p-4 border rounded-xl">
            <div className="font-medium mb-2">One small thought-step</div>
            {handle === "Check-Rule" && <p>Write the rule you think is in play, <b>one sentence</b>.</p>}
            {handle === "Evidence-Ping" && <p>List <b>one</b> reason <i>for</i> and <b>one</b> reason <i>against</i> your current view.</p>}
            {handle === "Decompose-Threat" && <p>Split the future possibility into <b>two</b> concrete possibilities.</p>}
            {handle === "Scope-Now" && <p>List what is <b>still up to you</b> in the next hour.</p>}
            {handle === "Clarify-Cause" && <p>Write <b>one exact sentence</b> naming the cause.</p>}
            {handle === "Ask-Form" && <p>Draft a <b>3-line question</b> to the relevant person/system.</p>}
          </div>
          <div className="p-4 border rounded-xl">
            <div className="font-medium mb-2">Prediction</div>
            <div className="flex flex-wrap gap-2">
              {(["clearer","same","tangled","unsure"] as Prediction[]).map(p=> (
                <button key={p} className={chip(p, prediction===p)} onClick={()=>setPrediction(p)}>{p}</button>
              ))}
            </div>
            {prediction && (
              <div className="pt-3">
                <button className="px-4 py-2 rounded-2xl bg-black text-white" onClick={()=>setPhase("Done")}>Finish</button>
              </div>
            )}
          </div>
        </div>
      )}

      {phase === "Done" && (
        <div className="space-y-4">
          <div className="p-4 border rounded-xl bg-gray-50">
            <div className="font-semibold mb-2">String found</div>
            <div className="text-sm">
              <div className="mb-1">About: <b>{scene ?? "—"}</b> · Time: <b>{meta.horizon ?? "—"}</b> · Stake: <b>{meta.stake ?? "—"}</b> · Agent: <b>{meta.agent ?? "—"}</b></div>
              <div className="mb-1">Play style under surprise: <b>{overlay ?? "—"}</b></div>
              <div className="mb-1">Glasses:</div>
              <ul className="list-disc pl-5">
                <li>Decide vs open: <b>{warm.decideNow}</b></li>
                <li>Locus: <b>{warm.locus}</b></li>
                <li>Frame: <b>{warm.frame}</b></li>
                <li>Changeable: <b>{warm.changeable}</b></li>
                <li>Evidence stance: <b>{warm.evidence}</b></li>
                <li>Thinking mode: <b>{warm.construal}</b></li>
              </ul>
              <div className="mt-2">Thought-step: <b>{handle}</b></div>
              <div>Your prediction: <b>{prediction}</b></div>
              <div className="mt-2">Status: <b>{prediction === "clearer" ? "locked" : "still mapping"}</b></div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-2xl border" onClick={resetGame}>Play again</button>
            <button className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-50" disabled={!handle || !prediction} onClick={analyzeInCube}>Analyze in Cube</button>
          </div>
        </div>
      )}
    </div>
  );
}
