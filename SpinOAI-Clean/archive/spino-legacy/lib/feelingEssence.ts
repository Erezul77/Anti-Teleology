// Minimal, rule-based "feeling essence" extractor — runs locally in the browser.
// It maps raw text to {emotions[], body[], rules[], focusWord, because, therefore}
// No external libs; conservative heuristics only.

const EMO_LEX: Record<string, string> = {
  angry: "anger", mad: "anger", rage: "anger", furious: "anger", irritated: "anger", annoyed: "anger",
  sad: "sadness", sorrow: "sadness", grief: "sadness", down: "sadness", depressed: "sadness",
  fear: "fear", scared: "fear", anxious: "fear", anxiety: "fear", worried: "fear", panic: "fear",
  shame: "shame", embarrassed: "shame", humiliated: "shame",
  guilt: "guilt", guilty: "guilt", regret: "guilt", sorry: "guilt",
  jealous: "envy", envy: "envy", envious: "envy",
  disgust: "disgust", gross: "disgust", repulsed: "disgust",
  hurt: "hurt", pain: "hurt", painful: "hurt", wounded: "hurt",
  lonely: "loneliness", alone: "loneliness", abandoned: "loneliness",
  relieved: "relief", relief: "relief", calm: "relief",
  joy: "joy", happy: "joy", glad: "joy", proud: "pride", pride: "pride",
};

const BODY_WORDS = ["chest","heart","throat","stomach","belly","gut","head","temples","jaw","shoulders","back","hands","legs","eyes"];
const SENSATIONS = ["tight","heavy","hot","cold","buzzing","numb","pressure","burning","shaky","tingly"];
const RULE_WORDS = ["must","always","never","should","owe","deserve","perfect","respect"];

const VIOLATIONS: Array<[RegExp,string]> = [
  [/(ignored|ghosted|no reply|left on read)/, "expectation of response violated"],
  [/(unfair|uneven|double standard)/, "expectation of fairness violated"],
  [/(late|last minute|cancel)/, "expectation of reliability violated"],
  [/(critici[sz]ed|insulted|disrespect)/, "expectation of respect violated"],
  [/(boundary|crossed)/, "boundary expectation violated"],
  [/(money|expense|charge|bill|invoice)/, "expectation of financial predictability violated"],
];

export type EssenceResult = {
  emotions: string[];
  bodies: string[];
  rules: string[];
  focusWord: string | null;
  becauseSuggestion: string;
  thereforeSuggestion: string;
};

export function extractEssence(text: string): EssenceResult {
  const raw = (text || "").toLowerCase();
  const tokens = raw.split(/[^a-zA-Zא-ת]+/).filter(Boolean);

  // emotions
  const emoCount: Record<string, number> = {};
  for (const t of tokens) {
    const k = EMO_LEX[t];
    if (k) emoCount[k] = (emoCount[k] || 0) + 1;
  }
  const emotions = Object.entries(emoCount).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k])=>k);

  // body + sensation phrases
  const bodies = new Set<string>();
  for (const b of BODY_WORDS) if (raw.includes(b)) bodies.add(b);
  for (const s of SENSATIONS) if (raw.includes(s)) bodies.add(s);

  // rules
  const rules = RULE_WORDS.filter(r=> raw.includes(r));

  // focus word candidate = first "loaded" word from either tokens that is emotive, rule, or violation noun
  let focusWord: string | null = emotions[0] || rules[0] || null;
  if (!focusWord) {
    const v = VIOLATIONS.find(([re])=>re.test(raw));
    if (v) focusWord = v[1].split(" ")[1] || "cause";
  }

  // violation cause
  const vio = VIOLATIONS.find(([re])=>re.test(raw));
  const because = vio ? vio[1] : (rules[0] ? `a hidden rule ("${rules[0]}") was assumed` : "an expectation was violated");

  // therefore: try to detect self-judgment words
  const SELF_JUDGE = /(worthless|failure|not good enough|bad person|i'm the problem|my fault|i'm weak|i'm stupid)/;
  const therefore = SELF_JUDGE.test(raw)
    ? raw.match(SELF_JUDGE)![0]
    : emotions.length
    ? `I concluded something matching ${emotions[0]}`
    : "I drew a harsh conclusion about myself";

  return {
    emotions,
    bodies: Array.from(bodies),
    rules,
    focusWord,
    becauseSuggestion: because,
    thereforeSuggestion: therefore,
  };
}
