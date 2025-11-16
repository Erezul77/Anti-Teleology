// SpinO Core V6 — Analyzer
// Core types and analysis functions for SpinO Closed v6

export type EmotionKey = "regret" | "shame" | "envy" | "blame" | "hate" | "sadness";
export type DomainKey = "death" | "illness" | "aging" | "betrayal" | "unfairness" | "humiliation" | "envy_status" | "rejection" | "authority" | "money_work" | "politics_culture" | "relationships" | "neighbors_noise_animals";
export type TargetKind = "person" | "group" | "me" | "thing";
export type FuelKey = "people_watching" | "power_gap" | "no_exit" | "noise_smell" | "place" | "time" | "rule_should" | "authority_present" | "threat_cue";
export type ReliefLever = "necessity" | "misread" | "adequate" | "accept";

export interface AnalysisInput {
  domain: DomainKey;
  emotion: EmotionKey;
  sub?: string;
  targetKind: TargetKind;
  targetRole?: string;
  thingLabel?: string;
  fuel: FuelKey;
  facesBefore: number;
  fuelDropFaces: number;
  rulePick?: string;
}

export interface AnalysisOutput {
  causeLineOptions: string[];
  reliefRanking: ReliefLever[];
  whyLine?: string;
}

export interface SubEmotion {
  key: string;
  label: string;
  ruleOptions?: string[];
  fuels?: FuelKey[];
}

export const SubMap: Record<EmotionKey, SubEmotion[]> = {
  regret: [
    { key: "missed_chance", label: "missed chance", ruleOptions: ["I should have acted", "I missed my chance", "I failed to choose"] },
    { key: "wrong_choice", label: "wrong choice", ruleOptions: ["I made the wrong call", "I chose poorly", "I should have known better"] },
    { key: "hurt_someone", label: "hurt someone", ruleOptions: ["I hurt them", "I caused pain", "I was careless"] },
  ],
  shame: [
    { key: "exposed", label: "exposed", ruleOptions: ["I must be perfect", "I can't be seen failing", "I must hide my flaws"] },
    { key: "inadequate", label: "inadequate", ruleOptions: ["I'm not good enough", "I must prove myself", "I'm defective"] },
    { key: "failed", label: "failed", ruleOptions: ["I must succeed", "Failure is unacceptable", "I'm a failure"] },
  ],
  envy: [
    { key: "status", label: "status", ruleOptions: ["I deserve what they have", "It's not fair", "I'm entitled to more"] },
    { key: "possessions", label: "possessions", ruleOptions: ["I need what they have", "I'm missing out", "I deserve better"] },
    { key: "relationships", label: "relationships", ruleOptions: ["I should have that too", "It's not fair", "I'm being excluded"] },
  ],
  blame: [
    { key: "unfair", label: "unfair", ruleOptions: ["They did wrong", "It's their fault", "They should pay"] },
    { key: "hurtful", label: "hurtful", ruleOptions: ["They hurt me", "They're responsible", "They owe me"] },
    { key: "negligent", label: "negligent", ruleOptions: ["They failed me", "They were careless", "They should have known"] },
  ],
  hate: [
    { key: "toxic", label: "toxic", ruleOptions: ["They're poison", "I must get away", "They're dangerous"] },
    { key: "oppressive", label: "oppressive", ruleOptions: ["They control me", "I'm trapped", "They have power over me"] },
    { key: "destructive", label: "destructive", ruleOptions: ["They destroy things", "They're harmful", "They cause damage"] },
  ],
  sadness: [
    { key: "loss", label: "loss", ruleOptions: ["I lost something important", "It's gone forever", "I can't get it back"] },
    { key: "disappointment", label: "disappointment", ruleOptions: ["It didn't work out", "I'm let down", "Things went wrong"] },
    { key: "loneliness", label: "loneliness", ruleOptions: ["I'm alone", "No one understands", "I'm isolated"] },
  ],
};

// SpinoMap for rule options and default fuels by emotion
export const SpinoMap: Record<EmotionKey, { ruleOptions: string[]; defaultFuels: FuelKey[] }> = {
  regret: { 
    ruleOptions: ["I should have acted differently", "I made a mistake", "I failed to choose wisely"],
    defaultFuels: ["time", "rule_should", "place"]
  },
  shame: { 
    ruleOptions: ["I must be perfect", "I can't show weakness", "I must hide my flaws"],
    defaultFuels: ["people_watching", "rule_should", "authority_present"]
  },
  envy: { 
    ruleOptions: ["I deserve what they have", "It's not fair", "I'm missing out"],
    defaultFuels: ["power_gap", "people_watching", "place"]
  },
  blame: { 
    ruleOptions: ["They did wrong", "It's their fault", "They should pay"],
    defaultFuels: ["power_gap", "rule_should", "authority_present"]
  },
  hate: { 
    ruleOptions: ["They're dangerous", "I must get away", "They're harmful"],
    defaultFuels: ["threat_cue", "no_exit", "place"]
  },
  sadness: { 
    ruleOptions: ["I lost something important", "It's gone forever", "I'm alone"],
    defaultFuels: ["time", "place", "noise_smell"]
  },
};

// Default emotion mappings by domain
const DOMAIN_EMOTION_MAP: Record<DomainKey, EmotionKey> = {
  death: "sadness",
  illness: "sadness", 
  aging: "regret",
  betrayal: "blame",
  unfairness: "blame",
  humiliation: "shame",
  envy_status: "envy",
  rejection: "sadness",
  authority: "hate",
  money_work: "blame",
  politics_culture: "hate",
  relationships: "sadness",
  neighbors_noise_animals: "hate",
};

// Default fuel mappings by emotion
const EMOTION_FUEL_MAP: Record<EmotionKey, FuelKey> = {
  regret: "time",
  shame: "people_watching",
  envy: "people_watching",
  blame: "power_gap",
  hate: "no_exit",
  sadness: "place",
};

// Human-readable fuel descriptions
const FUEL_HUMAN_MAP: Record<FuelKey, string> = {
  people_watching: "people watching",
  power_gap: "power over me",
  no_exit: "stuck / no exit",
  noise_smell: "loud / smell",
  place: "the place",
  time: "the time",
  rule_should: "a rule / should",
  authority_present: "authority around",
  threat_cue: "threat sign",
};

export function defaultEmotionFor(domain: DomainKey): EmotionKey {
  return DOMAIN_EMOTION_MAP[domain];
}

export function defaultFuelFor(emotion: EmotionKey, sub?: string): FuelKey {
  // Use sub-specific fuel if available, otherwise use emotion default
  if (sub) {
    const subFuelMap: Record<string, FuelKey> = {
      "missed_chance": "time",
      "wrong_choice": "no_exit", 
      "hurt_someone": "people_watching",
      "exposed": "people_watching",
      "inadequate": "power_gap",
      "failed": "authority_present",
      "status": "people_watching",
      "possessions": "place",
      "relationships": "people_watching",
      "unfair": "power_gap",
      "hurtful": "people_watching",
      "negligent": "authority_present",
      "toxic": "no_exit",
      "oppressive": "power_gap",
      "destructive": "threat_cue",
      "loss": "place",
      "disappointment": "time",
      "loneliness": "place",
    };
    return subFuelMap[sub] || EMOTION_FUEL_MAP[emotion];
  }
  return EMOTION_FUEL_MAP[emotion];
}

export function fuelHuman(fuel: FuelKey): string {
  return FUEL_HUMAN_MAP[fuel];
}

// Generate cause line options based on analysis input
function generateCauseLines(input: AnalysisInput): string[] {
  const { domain, emotion, sub, targetKind, targetRole, thingLabel, fuel } = input;
  
  const target = targetKind === "thing" ? (thingLabel || "it") : 
                 targetKind === "person" ? (targetRole || "them") :
                 targetKind === "group" ? (targetRole || "the group") : "me";
  
  const fuelDesc = fuelHuman(fuel);
  
  const lines = [
    `With ${target} + ${fuelDesc}, this was bound to happen.`,
    `I mixed up a sign with a cause.`,
    `I see how it fits together now.`,
    `I don't fully get it — and I accept that.`,
  ];
  
  // Add domain-specific variations
  if (domain === "death") {
    lines.push("Loss is part of life, not a punishment.");
  } else if (domain === "betrayal") {
    lines.push("Trust was broken, but I can choose my response.");
  } else if (domain === "authority") {
    lines.push("Power dynamics created this situation.");
  }
  
  return lines;
}

// Generate why line explanation
function generateWhyLine(input: AnalysisInput): string | undefined {
  const { emotion, sub, targetKind, targetRole, thingLabel } = input;
  
  if (!sub) return undefined;
  
  const target = targetKind === "thing" ? (thingLabel || "it") : 
                 targetKind === "person" ? (targetRole || "them") :
                 targetKind === "group" ? (targetRole || "the group") : "me";
  
  const subLabel = SubMap[emotion]?.find(s => s.key === sub)?.label || sub;
  
  return `This ${emotion} (${subLabel}) with ${target} shows a pattern that can be understood.`;
}

// Generate relief ranking based on analysis
function generateReliefRanking(input: AnalysisInput): ReliefLever[] {
  const { emotion, facesBefore, fuelDropFaces } = input;
  
  // Base ranking
  let ranking: ReliefLever[] = ["necessity", "misread", "adequate", "accept"];
  
  // Adjust based on intensity drop
  const intensityDrop = facesBefore - fuelDropFaces;
  if (intensityDrop > 1) {
    // High fuel impact - necessity is more likely
    ranking = ["necessity", "adequate", "misread", "accept"];
  } else if (intensityDrop < 1) {
    // Low fuel impact - misread is more likely
    ranking = ["misread", "adequate", "necessity", "accept"];
  }
  
  return ranking;
}

export function analyze(input: AnalysisInput): AnalysisOutput {
  return {
    causeLineOptions: generateCauseLines(input),
    reliefRanking: generateReliefRanking(input),
    whyLine: generateWhyLine(input),
  };
}
