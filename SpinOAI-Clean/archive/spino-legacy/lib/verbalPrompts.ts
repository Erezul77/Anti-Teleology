export type Prompt = {
  id: string;
  en: string;
  he: string;
  gate: number;
  mode?: "yesno" | "range" | "long";
  minWords?: number;
  maxWords?: number;
};
// gate legend: 0=orientation,1=scene,2=essence,3=causal,4=definition,5=priorCause,6=consequence,7=counterexample
export const VERBAL_PROMPTS: Prompt[] = [
  {
    id: "o1",
    gate: 0,
    mode: "yesno",
    en: "Consent to rigor: we aim for adequacy, not comfort. Do you agree to be exact and slow?",
    he: "הסכמה לקפדנות: המטרה היא מספיקות, לא נוחות. האם אתה/את מסכימ/ה להיות מדויק/ת ואיטי/ת?",
  },
  {
    id: "o2",
    gate: 0,
    mode: "range",
    minWords: 10,
    maxWords: 15,
    en: "State your intention in one breath (10–15 words).",
    he: "נסח/י כוונה בנשימה אחת (10–15 מילים).",
  },
  { id: "s1", gate: 1,
    mode: "range", minWords: 12, maxWords: 30,
    en: "Name the moment without theory. One sentence, past tense, observable (12–30 words).",
    he: "תאר/י את הרגע בלי תאוריה. משפט אחד, זמן עבר, ניתן לתצפית (12–30 מילים)." },
  { id: "e1", gate: 2,
    mode: "range", minWords: 6, maxWords: 35,
    en: "Body scan (20s). Where does it sit? Name the sensation (6–35 words).",
    he: "סריקת גוף (20ש׳). היכן זה יושב? שם תחושה (6–35 מילים)." },
  { id: "e2", gate: 2,
    mode: "range", minWords: 1, maxWords: 4,
    en: "Name the feeling essence in 1–4 words (anger, shame, fear, grief…).",
    he: "שם למהות התחושה ב-1–4 מילים (כעס, בושה, פחד, צער…)." },
  { id: "c1", gate: 3,
    mode: "range", minWords: 25, maxWords: 60,
    en: "Make it causal now (25–60 words): Because ____, therefore ____. Keep it literal and name the mechanism.",
    he: "הפוך/הפכי לסיבתי (25–60 מילים): בגלל ____, לכן ____. הישאר/י ממשי/ת ותן/י שם למנגנון." },
  { id: "d1", gate: 4,
    mode: "range", minWords: 20, maxWords: 50,
    en: "Define one loaded word (20–50 words). Make it causal and testable; then one-line why.",
    he: "הגדירו מילה טעונה (20–50 מילים). סיבתי ובדיק; ואז שורת נימוק." },
  { id: "p1", gate: 5,
    mode: "range", minWords: 15, maxWords: 40,
    en: "Name one prior cause (15–40 words). One specific earlier condition and why it matters.",
    he: "סיבה קודמת אחת (15–40 מילים). תנאי מוקדם ספציפי ולמה הוא משנה." },
  { id: "n1", gate: 6,
    mode: "range", minWords: 25, maxWords: 60,
    en: "Two necessary consequences (25–60 words). If your claim is true, what must also follow—and why?",
    he: "שתי השלכות הכרחיות (25–60 מילים). אם הטענה נכונה—מה חייב לנבוע ולמה?" },
  { id: "x1", gate: 7,
    mode: "range", minWords: 30, maxWords: 70,
    en: "Steelman a counterexample (30–70 words). If it holds, what breaks? If not, exactly why not.",
    he: "דוגמה נגדית מחוזקת (30–70 מילים). אם מחזיקה—מה נשבר? אם לא—בדיוק למה לא." },
];
