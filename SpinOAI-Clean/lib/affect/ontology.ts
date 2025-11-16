export type AffectNode = {
  key: string;
  base: "Joy"|"Sadness"|"Desire";
  valence: number;       // -1..+1
  activation: number;    // 0..1 (not plotted yet; used for size or pulse)
  passive: { label: string; x: number }; // x in [0..1] passive side
  active:  { label: string; x: number }; // x in [0..1] active side
  note?: string;
};

export const affects: AffectNode[] = [
  {
    key: "fear",
    base: "Sadness",
    valence: -0.6,
    activation: 0.8,
    passive: { label: "Fear", x: 0.15 },
    active:  { label: "Prudence", x: 0.65 },
    note: "Understanding the cause of danger."
  },
  {
    key: "anger",
    base: "Sadness",
    valence: -0.5,
    activation: 0.85,
    passive: { label: "Anger", x: 0.18 },
    active:  { label: "Assertion", x: 0.62 },
    note: "From blame → clarity about needs/limits."
  },
  {
    key: "envy",
    base: "Sadness",
    valence: -0.7,
    activation: 0.6,
    passive: { label: "Envy", x: 0.12 },
    active:  { label: "Admiration", x: 0.58 },
    note: "Seeing the other as model, not rival."
  },
  {
    key: "pity",
    base: "Sadness",
    valence: -0.4,
    activation: 0.5,
    passive: { label: "Pity", x: 0.20 },
    active:  { label: "Compassion", x: 0.60 },
    note: "Shared cause of suffering."
  },
  {
    key: "pride",
    base: "Joy",
    valence: 0.5,
    activation: 0.7,
    passive: { label: "Pride", x: 0.35 },
    active:  { label: "Self-Esteem", x: 0.75 },
    note: "From confused self-cause → true cause."
  },
  {
    key: "love",
    base: "Joy",
    valence: 0.8,
    activation: 0.7,
    passive: { label: "Love", x: 0.45 },
    active:  { label: "Benevolence", x: 0.85 },
    note: "From object-bound → universal goodwill."
  },
  {
    key: "gratitude",
    base: "Joy",
    valence: 0.6,
    activation: 0.4,
    passive: { label: "Gratitude", x: 0.50 },
    active:  { label: "Mutual Recognition", x: 0.90 },
    note: "Recognizing mutual causality."
  },
  {
    key: "guilt",
    base: "Sadness",
    valence: -0.55,
    activation: 0.6,
    passive: { label: "Guilt", x: 0.18 },
    active:  { label: "Responsibility", x: 0.64 },
    note: "From self-blame → repair & necessity."
  },
  {
    key: "hope",
    base: "Desire",
    valence: 0.3,
    activation: 0.6,
    passive: { label: "Hope (uncertain)", x: 0.40 },
    active:  { label: "Rational Trust", x: 0.78 },
    note: "Cause becomes stable/predictable."
  }
];

// Axis helpers
export const xToPx = (x:number, w:number, padding=48)=> padding + x*(w-2*padding);
export const yToPx = (valence:number, h:number, padding=48)=> {
  // valence -1..1 → y: bottom..top
  const t = (valence + 1)/2; // 0..1
  return h - padding - t*(h-2*padding);
};
