"use client";
import { IdeaGraph } from "../lib/adequacy";

export default function ProofTree({ g }: { g: IdeaGraph }) {
  const nodes = g.nodes.slice(-8); // show last up to 8 to keep it small
  const edges = g.edges.filter((e) =>
    nodes.find((n) => n.id === e.from || n.id === e.to)
  );
  return (
    <div className="mt-4 rounded-2xl border border-black/10 dark:border-white/10 p-4">
      <div className="text-sm font-medium mb-2">Proof tree (live)</div>
      <div className="grid grid-cols-1 gap-2">
        {nodes.map((n) => {
          const badge =
            n.kind === "Definition"
              ? "Definition"
              : n.kind === "CommonNotion"
              ? "Common"
              : n.kind === "Derivation"
              ? "Step"
              : n.kind === "Proposition"
              ? "Claim"
              : n.kind === "Contradiction"
              ? "Contradiction"
              : n.kind;
          return (
            <div
              key={n.id}
              className="rounded-xl border border-black/10 dark:border-white/10 p-3"
            >
              <div className="text-[10px] uppercase tracking-wide opacity-60 mb-1">
                {badge}
              </div>
              <div className="text-sm">{n.text}</div>
            </div>
          );
        })}
      </div>
      {edges.length > 0 && (
        <div className="mt-3 text-xs opacity-70">
          {edges.map((e, i) => (
            <div key={i}>
              {e.from} — <span className="italic">{e.role}</span> → {e.to}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
