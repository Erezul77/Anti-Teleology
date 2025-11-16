"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { affects, xToPx, yToPx, AffectNode } from "../../lib/affect/ontology";

type Hit = { key:string; mode:"passive"|"active"; x:number; y:number; };

export default function AffectPlane(){
  const ref = useRef<HTMLCanvasElement>(null);
  const [hover, setHover] = useState<Hit|null>(null);
  const [selected, setSelected] = useState<string|null>(null);

  // Colors
  const col = {
    bg: "#0b0b12",
    grid: "#2d2d3a",
    axis: "#8b8bb3",
    passive: "#ff7676",
    active: "#76ffd1",
    link: "rgba(255,255,255,.25)",
    text: "#eaeaf5"
  };

  // draw
  useEffect(()=>{
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    const DPR = Math.max(1, window.devicePixelRatio||1);
    const SIZE = 680;
    c.style.width = SIZE+"px";
    c.style.height= SIZE+"px";
    c.width = Math.round(SIZE*DPR);
    c.height= Math.round(SIZE*DPR);
    ctx.setTransform(DPR,0,0,DPR,0,0);

    const padding = 56;

    const render = ()=>{
      ctx.fillStyle = col.bg; ctx.fillRect(0,0,SIZE,SIZE);

      // grid
      ctx.strokeStyle = col.grid; ctx.lineWidth = 1;
      for (let i=0;i<=10;i++){
        const xx = padding + i*(SIZE-2*padding)/10;
        ctx.beginPath(); ctx.moveTo(xx,padding); ctx.lineTo(xx,SIZE-padding); ctx.stroke();
      }
      for (let j=0;j<=10;j++){
        const yy = padding + j*(SIZE-2*padding)/10;
        ctx.beginPath(); ctx.moveTo(padding,yy); ctx.lineTo(SIZE-padding,yy); ctx.stroke();
      }

      // axes labels
      ctx.fillStyle = col.axis; ctx.font = "12px system-ui";
      ctx.fillText("Passive", padding, SIZE-padding+24);
      ctx.fillText("Active", SIZE-padding-40, SIZE-padding+24);
      ctx.save(); ctx.translate(18, SIZE/2); ctx.rotate(-Math.PI/2);
      ctx.fillText("Sadness", 0, 0); ctx.restore();
      ctx.save(); ctx.translate(SIZE-18, SIZE/2); ctx.rotate(Math.PI/2);
      ctx.fillText("Joy", 0, 0); ctx.restore();

      // links + nodes
      const r = 8;
      affects.forEach((a)=>{
        const pxP = xToPx(a.passive.x, SIZE, padding);
        const pxA = xToPx(a.active.x, SIZE, padding);
        const py = yToPx(a.valence, SIZE, padding);

        // link
        ctx.strokeStyle = col.link; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(pxP, py); ctx.lineTo(pxA, py); ctx.stroke();

        // passive node
        ctx.fillStyle = col.passive;
        ctx.beginPath(); ctx.arc(pxP, py, r, 0, Math.PI*2); ctx.fill();

        // active node
        ctx.fillStyle = col.active;
        ctx.beginPath(); ctx.arc(pxA, py, r, 0, Math.PI*2); ctx.fill();

        // labels (minimal)
        ctx.fillStyle = col.text; ctx.font = "11px system-ui";
        ctx.fillText(a.passive.label, pxP+10, py-6);
        ctx.fillText(a.active.label,  pxA+10, py-6);

        // selection pulse
        if (selected === a.key){
          ctx.strokeStyle = "#ffffffaa";
          ctx.lineWidth = 3;
          ctx.beginPath(); ctx.arc(pxA, py, r+6*Math.sin(performance.now()/300), 0, Math.PI*2); ctx.stroke();
        }
      });
    };

    let rId = 0;
    const loop = ()=>{ render(); rId = requestAnimationFrame(loop); };
    rId = requestAnimationFrame(loop);
    return ()=> cancelAnimationFrame(rId);
  }, [selected]);

  // hit testing
  useEffect(()=>{
    const c = ref.current!;
    const SIZE = 680, padding = 56;
    const rHit = 10;

    const pick = (x:number,y:number): Hit|null => {
      for (const a of affects){
        const pxP = xToPx(a.passive.x, SIZE, padding);
        const pxA = xToPx(a.active.x, SIZE, padding);
        const py  = yToPx(a.valence, SIZE, padding);
        const dP = Math.hypot(x-pxP, y-py);
        if (dP <= rHit) return { key:a.key, mode:"passive", x:pxP, y:py };
        const dA = Math.hypot(x-pxA, y-py);
        if (dA <= rHit) return { key:a.key, mode:"active", x:pxA, y:py };
      }
      return null;
    };

    const onMove = (e:PointerEvent)=>{
      const rect = c.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setHover(pick(x,y));
    };
    const onDown = (e:PointerEvent)=>{
      const rect = c.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const h = pick(x,y);
      if (h) setSelected(h.key);
    };

    c.addEventListener("pointermove", onMove);
    c.addEventListener("pointerdown", onDown);
    return ()=>{ c.removeEventListener("pointermove", onMove); c.removeEventListener("pointerdown", onDown); };
  }, []);

  return (
    <div className="grid place-items-center min-h-screen bg-[#09090b]">
      <canvas ref={ref} className="rounded-2xl shadow-xl" />
      {hover && <div
        className="fixed text-[11px] px-2 py-1 rounded bg-black/70 text-white pointer-events-none"
        style={{ left: hover.x+12, top: hover.y+12 }}
      >
        {hover.mode === "passive" ? "Passive" : "Active"}
      </div>}
    </div>
  );
}
