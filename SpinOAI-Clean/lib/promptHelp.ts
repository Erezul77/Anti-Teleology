export type HelpEntry = {
  title: string;
  how: string[];
  examples: string[];
  notes?: string[];
};

export const PROMPT_HELP_EN: Record<string, HelpEntry> = {
  o1: {
    title: "Consent to rigor",
    how: ["Click \"I agree\" to proceed, or \"No\" to exit."],
    examples: ["I agree.", "Not now."],
    notes: ["No writing needed here."],
  },
  o2: {
    title: "Intention in one breath (10–15 words)",
    how: [
      "State a single aim for this session—no story, no blame.",
      "Template: \"I want to [verb] [topic] so I can [result].\"",
    ],
    examples: [
      "I want to clarify why that email stung so I can respond calmly.",
      "I want to define 'disrespect' precisely to judge yesterday's meeting fairly.",
      "I want to test if my rule \"late = disrespect\" actually holds.",
    ],
    notes: ["Stay within 10–15 words."],
  },
  s1: {
    title: "Name the moment (observable, past tense)",
    how: [
      "Describe the event without theory or judgment.",
      "One sentence, observable facts, past tense.",
    ],
    examples: [
      "Yesterday, my manager ended the call without responding to my question.",
      "At 8pm, my message was marked read and I received no reply.",
    ],
  },
  e1: {
    title: "Body scan (location + sensation)",
    how: [
      "Point where it sits (chest/throat/belly/jaw/shoulders…).",
      "Name the feel (pressure/heat/heavy/tight/shaky…).",
    ],
    examples: ["Tightness in my chest; heat in my face.", "Heavy feeling in my belly, slight tremble in hands."],
  },
  e2: {
    title: "Feeling essence (1–4 words)",
    how: ["Name the core feeling in up to 4 words."],
    examples: ["Anger", "Shame", "Fear", "Grief", "Hurt", "Disgust"],
  },
  c1: {
    title: "Make it causal (25–60 words)",
    how: [
      "Write \"Because ___, therefore ___\" and name the mechanism (how the cause produces the effect).",
      "Stay literal; avoid mind-reading.",
    ],
    examples: [
      "Because my question was ignored in a public meeting, therefore I concluded my work lacks value. The mechanism: social cues of silence plus no follow-up were interpreted as rejection.",
    ],
  },
  d1: {
    title: "Define one loaded word (testable, causal)",
    how: [
      "Pick one loaded word from your line (e.g., disrespect, loyalty).",
      "Define it in one checkable sentence that involves a cause and effect.",
    ],
    examples: [
      "\"Disrespect\" = a person knowingly ignores a reasonable request that affects my work.",
    ],
    notes: ["Prefer \"real\" (causal) definitions over purely verbal synonyms."],
  },
  p1: {
    title: "One prior cause",
    how: [
      "Name a single earlier condition that made the cause possible.",
      "Keep it brief and specific.",
    ],
    examples: [
      "Prior cause: ambiguous ownership of decisions in our team norms.",
      "Prior cause: I assumed immediate replies are standard in this group.",
    ],
  },
  n1: {
    title: "Necessary consequences (2 items)",
    how: [
      "If your take is true, what must also follow in similar cases?",
      "Write two necessities and why they follow.",
    ],
    examples: [
      "If \"late = disrespect,\" then any delayed reply always signals contempt—across colleagues and clients.",
      "If being ignored means my work lacks value, I must quit when it happens again.",
    ],
  },
  x1: {
    title: "Steelman a counterexample",
    how: [
      "Describe a strong opposing case.",
      "If it holds, say what breaks. If not, say exactly why not.",
    ],
    examples: [
      "Counterexample: They were in crisis and answered the next morning with an apology. This weakens 'late = disrespect'.",
    ],
  },
};

export const PROMPT_HELP_HE: Record<string, HelpEntry> = {
  o1: {
    title: "הסכמה לקפדנות",
    how: ["לחצו \"מסכים/ה\" להמשך, או \"לא\" ליציאה."],
    examples: ["אני מסכים/ה.", "לא כעת."],
    notes: ["אין צורך לכתוב כאן."],
  },
  o2: {
    title: "כוונה בנשימה אחת (10–15 מילים)",
    how: [
      "נסחו מטרה אחת לפגישה—בלי סיפור ובלי אשמה.",
      "תבנית: \"אני רוצה [פועל] [נושא] כדי שאוכל [תוצאה].\"",
    ],
    examples: [
      "אני רוצה להבהיר למה המייל כאב כדי להגיב בשקט.",
      "אני רוצה להגדיר \"זלזול\" באופן בדיק כדי לשפוט הוגן.",
      "אני רוצה לבדוק אם הכלל \"איחור = זלזול\" באמת מחזיק.",
    ],
    notes: ["להישאר בטווח 10–15 מילים."],
  },
  s1: {
    title: "תיאור הרגע (נצפה, זמן עבר)",
    how: ["תארו את האירוע בלי תאוריה או שיפוט.", "משפט אחד, עובדות נצפות, זמן עבר."],
    examples: [
      "אתמול המנהלת סיימה את השיחה בלי לענות לשאלתי.",
      "בשעה 20:00 ההודעה שלי נקראה ולא התקבלה תשובה.",
    ],
  },
  e1: {
    title: "סריקת גוף (מיקום + תחושה)",
    how: ["היכן זה יושב (חזה/גרון/בטן/לסת/כתפיים…)", "שם התחושה (לחץ/חום/כבד/מתח/רעד…)."],
    examples: ["לחץ בחזה; חום בפנים.", "כובד בבטן, רעד קל בידיים."],
  },
  e2: {
    title: "מהות תחושה (1–4 מילים)",
    how: ["תנו שם לתחושה המרכזית עד 4 מילים."],
    examples: ["כעס", "בושה", "פחד", "צער", "פגיעה", "גועל"],
  },
  c1: {
    title: "הפיכה לסיבתית (25–60 מילים)",
    how: [
      "כתבו \"בגלל ___, לכן ___\" ותנו שם למנגנון (איך הסיבה מייצרת את התוצאה).",
      "להישאר ממשי; בלי קריאת מחשבות.",
    ],
    examples: [
      "בגלל שהתעלמו משאלתי בפגישה פומבית, לכן הסקתי שעבודתי חסרת ערך. המנגנון: סימני שתיקה ללא מעקב הובנו כדחייה.",
    ],
  },
  d1: {
    title: "הגדרת מילה טעונה (בדיקה, סיבתית)",
    how: [
      "בחרו מילה טעונה מהשורה (למשל: זלזול, נאמנות).",
      "נסחו משפט אחד בדיק שכולל סיבה ותוצאה.",
    ],
    examples: ['"זלזול" = אדם מתעלם ביודעין מבקשה סבירה שמשפיעה על עבודתי.'],
    notes: ["העדיפו הגדרה \"אמיתית/סיבתית\" על פני מילונית בלבד."],
  },
  p1: {
    title: "סיבה קודמת אחת",
    how: ["ציינו תנאי מוקדם אחד שאיפשר את הסיבה.", "קצר וספציפי."],
    examples: [
      "סיבה קודמת: עמימות בבעלות על החלטות בנורמות הצוות.",
      "סיבה קודמת: הנחתי שתגובה מיידית היא סטנדרט בקבוצה הזאת.",
    ],
  },
  n1: {
    title: "השלכות הכרחיות (2 פריטים)",
    how: ["אם המסקנה נכונה—מה חייב לנבוע במקרים דומים?", "כתבו שתי הכרחיות ולמה."],
    examples: [
      "אם \"איחור = זלזול\", אז כל איחור תמיד מסמן בוז—גם בעמיתים וגם בלקוחות.",
      "אם התעלמות = ערך אפסי, עליי להתפטר בכל פעם שזה קורה.",
    ],
  },
  x1: {
    title: "דוגמה נגדית מחוזקת",
    how: ["תארו מקרה נגדי חזק.", "אם מחזיק—מה נשבר? אם לא—למה לא, ספציפית."],
    examples: [
      "דוגמה נגדית: הם היו במשבר וענו בבוקר עם התנצלות. זה מחליש את \"איחור = זלזול\".",
    ],
  },
};
