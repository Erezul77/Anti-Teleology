// Types
export type IdeaNodeKind =
  | "Definition"
  | "CommonNotion"
  | "Proposition"
  | "Derivation"
  | "Observation"
  | "Contradiction";

export type EdgeRole = "grounds" | "infers" | "contradicts" | "supports";

export interface IdeaNode {
  id: string;
  kind: IdeaNodeKind;
  text: string;
  meta?: Record<string, any>;
}

export interface Edge {
  from: string;
  to: string;
  role: EdgeRole;
}

export interface Scores {
  adequacy: number; // 0–100
  coherence: number; // 0–100
  signDependence: number; // 0–100 (higher = worse)
  passivity: number; // 0–100 (higher = worse)
}

export interface IdeaGraph {
  nodes: IdeaNode[];
  edges: Edge[];
  scores: Scores;
}

// Helpers
let _id = 0;
export const nid = (p = "n") => `${p}_${++_id}`;

export function initGraph(claim: string): IdeaGraph {
  const prop: IdeaNode = { id: nid("prop"), kind: "Proposition", text: claim };
  return {
    nodes: [prop],
    edges: [],
    scores: { adequacy: 0, coherence: 0, signDependence: 0, passivity: 0 },
  };
}

export function addDefinition(
  g: IdeaGraph,
  term: string,
  text: string,
  kind: "real" | "verbal"
): IdeaNode {
  const node: IdeaNode = {
    id: nid("def"),
    kind: "Definition",
    text,
    meta: { term, kind },
  };
  g.nodes.push(node);
  return node;
}

export function addCommonNotion(g: IdeaGraph, text: string): IdeaNode {
  const node: IdeaNode = { id: nid("cn"), kind: "CommonNotion", text };
  g.nodes.push(node);
  return node;
}

export function link(g: IdeaGraph, from: IdeaNode, to: IdeaNode, role: EdgeRole) {
  g.edges.push({ from: from.id, to: to.id, role });
}

export function addDerivation(g: IdeaGraph, cause: string, effect: string): IdeaNode {
  const causeNode: IdeaNode = { id: nid("d"), kind: "Derivation", text: cause };
  const effectNode: IdeaNode = { id: nid("d"), kind: "Derivation", text: effect };
  g.nodes.push(causeNode, effectNode);
  link(g, causeNode, effectNode, "infers");
  return effectNode;
}

export function addContradiction(g: IdeaGraph, text: string): IdeaNode {
  const node: IdeaNode = { id: nid("x"), kind: "Contradiction", text };
  g.nodes.push(node);
  return node;
}

export function detectSignsReliance(texts: string[]): number {
  const joined = texts.join(" ").toLowerCase();
  const patterns = [
    /he said|she said|they said|someone said|i heard|rumor|they say/,
    /always|never|must|should|owe|deserve|perfect/,
    /because i feel|just feel|vibe|gut/,
  ];
  return patterns.reduce((acc, re) => (re.test(joined) ? acc + 1 : acc), 0);
}

export function scoreAdequacy(g: IdeaGraph): Scores {
  const defs = g.nodes.filter((n) => n.kind === "Definition");
  const realDefs = defs.filter((d) => d.meta?.kind === "real").length;
  const commons = g.nodes.filter((n) => n.kind === "CommonNotion").length;
  const derivs = g.edges.filter((e) => e.role === "infers").length;
  const contras = g.edges.filter((e) => e.role === "contradicts").length;
  const obsTexts = g.nodes
    .filter((n) => n.kind === "Observation" || n.kind === "Proposition")
    .map((n) => n.text);
  const signs = detectSignsReliance(obsTexts);

  const adequacy = Math.max(
    0,
    Math.min(
      100,
      20 * (realDefs / Math.max(defs.length, 1)) +
        20 * Math.tanh(commons / 2) +
        40 * Math.tanh(derivs / 3) -
        30 * Math.tanh(contras) -
        20 * Math.tanh(signs / 2)
    )
  );
  const coherence = Math.max(0, Math.min(100, 100 - 25 * contras));
  const signDependence = Math.max(0, Math.min(100, 20 * signs));
  const passivity = Math.max(
    0,
    Math.min(100, 30 * Math.tanh(contras) + 10 * Math.tanh(signs))
  );
  return { adequacy, coherence, signDependence, passivity };
}

export function aggregateScores(stack: IdeaGraph[]): Scores {
  if (!stack.length) {
    return { adequacy: 0, coherence: 0, signDependence: 0, passivity: 0 };
  }
  const S = stack.map((g) => scoreAdequacy(g));
  return {
    adequacy: Math.min(...S.map((s) => s.adequacy)),
    coherence: Math.min(...S.map((s) => s.coherence)),
    signDependence: Math.max(...S.map((s) => s.signDependence)),
    passivity: Math.max(...S.map((s) => s.passivity)),
  };
}
