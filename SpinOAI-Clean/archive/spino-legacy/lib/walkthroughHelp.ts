export type WalkHelp = {
  title: string;
  how: string[];
  tips?: string[];
  terms?: { label: string; text: string }[];
};

export const WALK_HELP_EN: Record<string, WalkHelp> = {
  overview: {
    title: "What is this walkthrough?",
    how: [
      "This is a 7-step process to make your emotional insight more 'adequate' — grounded in real causes, not surface signs.",
      "You'll start with one line (a moment/feeling), turn it causal, deepen it, test it, and end with clarity + one action.",
      "Each step builds on the last. The 'Proof Tree' shows your reasoning structure growing in real-time.",
      "Your goal: understand the actual mechanism, not just label the emotion.",
    ],
    terms: [
      { label: "Adequacy", text: "How well your explanation captures real causes (Spinoza: 'adequate' = cause-based, 'inadequate' = sign-based)." },
      { label: "Sign vs Cause", text: "Sign: 'He was late' = disrespect. Cause: 'His lateness triggered my assumption of disrespect because...'" },
      { label: "Proof Tree", text: "Visual structure showing definitions, causal links, and how your idea holds together." },
    ],
    tips: [
      "Take your time. This isn't a quiz — it's clarity-building.",
      "If you get stuck, use 'Guided Conversation' to explore the feeling first.",
      "You can zoom in/out to explore sub-causes or the bigger picture.",
    ],
  },
  step1: {
    title: "Step 1: Start with the line",
    how: [
      "Pick a moment card or write the exact line your mind said in that moment.",
      "This is your starting point — one sentence that captures the feeling/thought.",
      "Example: 'He ignored me → I'm worthless' or pick a moment card that resonates.",
    ],
    tips: [
      "Be literal. Don't explain yet — just capture the raw line as your mind said it.",
      "Set your 'clarity' meter: how clear is this for you right now? (We'll check again at the end.)",
    ],
  },
  step2: {
    title: "Step 2: Find the sting word",
    how: [
      "Click one word from your line that carries the most emotional weight — the 'sting'.",
      "Identify any hidden rules that were in play (e.g., 'If someone ignores me, that means X').",
      "This helps us focus on what needs defining and what assumptions are operating.",
    ],
    tips: [
      "The sting word is usually the one that feels most loaded or triggering.",
      "Hidden rules are often implicit — they're the 'if-then' assumptions behind the feeling.",
    ],
  },
  step3: {
    title: "Step 3: Make it causal",
    how: [
      "Turn your line into a 'Because → Therefore' statement.",
      "Because [something happened/you noticed X] → Therefore [you concluded Y].",
      "This is where you shift from sign ('he ignored me' = disrespect) to cause ('because he ignored me in context Z, therefore I inferred...').",
    ],
    tips: [
      "Keep it literal and observable. No mind-reading: what actually happened, what did you actually conclude?",
      "This causal link becomes the core of your proof tree.",
    ],
  },
  step4: {
    title: "Step 4: Deepen the understanding",
    how: [
      "Refine your definition of the focus word — make it causal and testable.",
      "Add a prior cause: what came before this?",
      "Give a supporting example, and test a counterexample (does it hold? does it challenge your idea?).",
      "You can loop this multiple times (guided: 1x, deep: 3x) or zoom into a sub-cause.",
    ],
    tips: [
      "This is where depth happens. Each refinement makes your idea more adequate.",
      "Use the journal for free associations — anything that comes up.",
      "The Proof Tree updates in real-time as you add definitions and links.",
    ],
  },
  step5: {
    title: "Step 5: Identify common notions",
    how: [
      "Pick general truths that apply here — things that are 'definitely true' and shared.",
      "Examples: 'People have feelings', 'Context matters', 'Assumptions shape interpretation'.",
      "These strengthen your reasoning by grounding it in shared principles.",
      "You can add your own common notion if needed.",
    ],
    tips: [
      "Common notions are the building blocks of reasoning — they're what you and others can agree on.",
      "They help your idea be more 'public' and checkable, less private and vague.",
    ],
  },
  step6: {
    title: "Step 6: Test consequences",
    how: [
      "If your 'Because → Therefore' is right, what else must follow in similar situations?",
      "List 1-2 necessary consequences. For each, decide: do you accept it or reject it?",
      "If you reject it, that creates a contradiction — which means you may need to refine your idea.",
      "This tests whether your causal link actually holds up to logical extension.",
    ],
    tips: [
      "Consequences help you find gaps. If you reject a necessary consequence, your original link may be too strong or missing something.",
      "This is like 'steelman testing' — what would your idea predict, and do you actually believe those predictions?",
    ],
  },
  adequacy: {
    title: "Adequacy metrics — what they mean",
    how: [
      "Raise Adequacy by grounding claims in causes (not signs or vibes).",
      "Raise Coherence by keeping terms consistent and definitions testable.",
      "Lower Sign-reliance by replacing cues/labels with mechanisms.",
      "Lower Passivity by shifting from 'they made me' to 'here's the cause I can examine'.",
    ],
    terms: [
      { label: "Adequacy", text: "How causal and well-grounded your statement is (Spinoza-style, cause over sign)." },
      { label: "Coherence", text: "Internal consistency of your terms and steps." },
      { label: "Sign reliance", text: "Use of surface cues (late = disrespect) instead of causes." },
      { label: "Passivity", text: "Extent you treat effects as happening to you rather than understood in causes." },
    ],
    tips: [
      "Define one loaded word. Add one prior cause. Replace one sign with a mechanism.",
      "Then recompute: scores should move in the right direction.",
    ],
  },
  synthesis: {
    title: "Crystallize — one clean sentence",
    how: [
      "Write exactly one 'Because → Therefore' sentence you can say in one breath.",
      "Keep it literal; no mind-reading; include the mechanism if possible.",
    ],
  },
  actions: {
    title: "One tiny next action",
    how: [
      "Pick a 24-hour, 5-minute action that tests the cause or reduces passivity.",
      "Examples: Ask for clarification; rename a term; try a different cue; schedule a check-in.",
    ],
  },
  proof: {
    title: "Proof Tree — how to use it",
    how: [
      "Add nodes: Definitions (real, causal), Derivations (because → therefore), Common Notions (shared general rules).",
      "Trim contradictions or vague terms until the structure holds together.",
    ],
  },
  zoom: {
    title: "Fractal Wheel & Zoom — understanding nested levels",
    how: [
      "The Fractal Wheel shows concentric rings — each ring is a 'level' of depth in your exploration.",
      "Outer ring = Big picture (your main idea). Inner rings = deeper dives into sub-causes.",
      "Each ring's completeness shows its adequacy score — how well-grounded that level is.",
      "Zoom in: When you find a prior cause or sub-cause worth exploring separately, click 'Zoom in'. This creates a new inner ring and lets you walk through that sub-cause from scratch.",
      "Zoom out: Returns you to the previous outer level, keeping all your work in the inner rings.",
      "Why zoom in? Sometimes a sub-cause (like 'why did I assume disrespect?') needs its own full walkthrough to reach adequacy. The wheel tracks adequacy at each level.",
    ],
    terms: [
      { label: "Fractal Wheel", text: "Visual representation of nested levels — outer rings are broader, inner rings are deeper sub-causes." },
      { label: "Level", text: "One complete walkthrough cycle. Multiple levels = exploring a main idea and its sub-causes separately." },
      { label: "Adequacy per ring", text: "Each ring shows how adequate that level is. Inner rings can have different scores than outer rings — that's normal." },
      { label: "Fractal adequacy", text: "The minimum adequacy across all rings — your weakest link determines overall adequacy." },
    ],
    tips: [
      "Start simple: get one ring (one idea) to good adequacy first, then zoom in if a sub-cause needs its own exploration.",
      "You'll see multiple rings when you've zoomed in — each represents a separate idea you've explored.",
      "The wheel updates as you build your proof tree at each level.",
      "Fractal adequacy (shown below the wheel) = the minimum across all levels — improve your lowest ring to raise it.",
    ],
  },
  final: {
    title: "What this page shows",
    how: [
      "A plain-language summary of your claim, what changed (clarity), and one tiny action.",
      "Use it as your takeaway; you can copy it to notes or share it.",
    ],
  },
};

export const WALK_HELP_HE: Record<string, WalkHelp> = {
  overview: {
    title: "מה זה המסלול הזה?",
    how: [
      "זהו תהליך של 7 שלבים להפוך את התובנה הרגשית שלך ל'מספיקה' יותר — מעוגנת בסיבות אמיתיות, לא בסימנים שטחיים.",
      "תתחיל/י עם שורה אחת (רגע/תחושה), תהפוך/י אותה לסיבתית, תעמיק/י, תבדוק/י, וסיים/י עם בהירות + פעולה אחת.",
      "כל שלב בונה על הקודם. 'עץ ההוכחה' מציג את מבנה ההיגיון שלך גדל בזמן אמת.",
      "המטרה שלך: להבין את המנגנון האמיתי, לא רק לתייג את הרגש.",
    ],
    terms: [
      { label: "מספיקות", text: "כמה ההסבר שלך תופס סיבות אמיתיות (ספינוזה: 'מספיק' = מבוסס סיבה, 'לא מספיק' = מבוסס סימן)." },
      { label: "סימן מול סיבה", text: "סימן: 'הוא איחר' = חוסר כבוד. סיבה: 'איחורו עורר את ההנחה שלי על חוסר כבוד כי...'" },
      { label: "עץ הוכחה", text: "מבנה ויזואלי שמציג הגדרות, קשרים סיבתיים, ואיך הרעיון שלך מחזיק." },
    ],
    tips: [
      "קח/י את הזמן. זה לא בוחן — זה בניית בהירות.",
      "אם נתקעת, השתמש/י ב'שיחת הדרכה' כדי לחקור את התחושה קודם.",
      "אפשר לזום פנימה/החוצה לחקור תת-סיבות או את התמונה הגדולה.",
    ],
  },
  step1: {
    title: "שלב 1: התחל/י עם השורה",
    how: [
      "בחר/י כרטיס רגע או כתוב/כתבי את השורה המדויקת שהמוח שלך אמר באותו רגע.",
      "זו נקודת ההתחלה — משפט אחד שתופס את התחושה/מחשבה.",
      "דוגמה: 'הוא התעלם ממני → אני חסר ערך' או בחר/י כרטיס רגע שמדבר אליך.",
    ],
    tips: [
      "היה/י ממשי. אל תסביר/י עדיין — רק תפוס/י את השורה הגולמית כמו שהמוח אמר אותה.",
      "הגדר/י את מדד ה'בהירות': כמה זה ברור לך עכשיו? (נבדוק שוב בסוף.)",
    ],
  },
  step2: {
    title: "שלב 2: מצא/י את מילת העוקץ",
    how: [
      "לחץ/י על מילה אחת מהשורה שלך שנושאת הכי הרבה משקל רגשי — ה'עוקץ'.",
      "זהה/י כללים סמויים שהיו פעילים (למשל, 'אם מישהו מתעלם ממני, זה אומר X').",
      "זה עוזר להתמקד במה שצריך הגדרה ובאילו הנחות פועלות.",
    ],
    tips: [
      "מילת העוקץ היא בדרך כלל זו שמרגישה הכי טעונה או מעוררת.",
      "כללים סמויים הם לרוב משתמעים — הם ה'אם-אז' מאחורי התחושה.",
    ],
  },
  step3: {
    title: "שלב 3: הפוך/י לסיבתי",
    how: [
      "הפוך/י את השורה שלך להצהרה 'בגלל → לכן'.",
      "בגלל [משהו קרה/שמת לב ל-X] → לכן [סיכמת Y].",
      "כאן אתה עובר מסימן ('הוא התעלם ממני' = חוסר כבוד) לסיבה ('בגלל שהוא התעלם ממני בהקשר Z, לכן הסברתי...').",
    ],
    tips: [
      "שמור/י על ממשי ותצפיתי. בלי קריאת מחשבות: מה בעצם קרה, מה באמת סיכמת?",
      "קשר סיבתי זה הופך להיות הליבה של עץ ההוכחה שלך.",
    ],
  },
  step4: {
    title: "שלב 4: עמק/י את ההבנה",
    how: [
      "חדד/י את ההגדרה של מילת המיקוד — הפוך/י אותה לסיבתית ובדיקה.",
      "הוסף/י סיבה קודמת: מה בא לפני זה?",
      "תן/י דוגמה תומכת, ובדוק/י דוגמה נגדית (האם היא מחזיקה? האם היא מאתגרת את הרעיון שלך?).",
      "אפשר לעשות את זה כמה פעמים (מונחה: פעם אחת, עמוק: 3 פעמים) או לזום פנימה לתת-סיבה.",
    ],
    tips: [
      "כאן קורה העומק. כל עדכון הופך את הרעיון שלך למספיק יותר.",
      "השתמש/י ביומן לאסוציאציות חופשיות — כל מה שעולה.",
      "עץ ההוכחה מתעדכן בזמן אמת כשאת/ה מוסיף/ה הגדרות וקשרים.",
    ],
  },
  step5: {
    title: "שלב 5: זהה/י מושגים משותפים",
    how: [
      "בחר/י אמיתות כלליות שחלות כאן — דברים ש'בטוח נכונים' ומשותפים.",
      "דוגמאות: 'לאנשים יש רגשות', 'ההקשר חשוב', 'הנחות מעצבות פרשנות'.",
      "אלה מחזקים את ההיגיון שלך על ידי עיגון בעקרונות משותפים.",
      "אפשר להוסיף מושג משותף משלך אם צריך.",
    ],
    tips: [
      "מושגים משותפים הם אבני הבניין של ההיגיון — מה שאתה ואחרים יכולים להסכים עליו.",
      "הם עוזרים לרעיון שלך להיות יותר 'ציבורי' ובדיק, פחות פרטי ומעורפל.",
    ],
  },
  step6: {
    title: "שלב 6: בדוק/י השלכות",
    how: [
      "אם ה'בגלל → לכן' שלך נכון, מה עוד חייב לנבוע במקרים דומים?",
      "רשום/י 1-2 השלכות הכרחיות. לכל אחת, החלט/י: האם את/ה מקבל/ת אותה או דוחה אותה?",
      "אם את/ה דוחה אותה, זה יוצר סתירה — מה שאומר שאת/ה אולי צריך/ה לחדד את הרעיון שלך.",
      "זה בודק האם הקשר הסיבתי שלך באמת מחזיק בהיקף לוגי.",
    ],
    tips: [
      "השלכות עוזרות למצוא פערים. אם את/ה דוחה השלכה הכרחית, הקשר המקורי שלך אולי חזק מדי או חסר משהו.",
      "זה כמו 'steelman testing' — מה הרעיון שלך היה מנבא, והאם את/ה באמת מאמין/ה בתחזיות האלה?",
    ],
  },
  adequacy: {
    title: "מדדי מספיקות — מה הם אומרים",
    how: [
      "העלו מספיקות ע״י עיגון הטענה בסיבות (לא בסימנים/וויבים).",
      "העלו קוהרנטיות ע״י הגדרות בדיקות ושפה עקבית.",
      "הפחיתו תלות בסימנים ע״י החלפת רמזים במנגנון.",
      "הפחיתו פסיביות: מעבר מ״עשו לי״ ל״הנה סיבה שאני בודק/ת״.",
    ],
    terms: [
      { label: "מספיקות", text: "מידת הסיבתיות והעיגון של הטענה (ספינוזה: סיבה ולא סימן)." },
      { label: "קוהרנטיות", text: "עקביות פנימית של המונחים והשלבים." },
      { label: "תלות בסימנים", text: "שימוש ברמזים שטחיים במקום בסיבות." },
      { label: "פסיביות", text: "מידת ההתייחסות לאפקטים כמתרחשים לי במקום כהבנה בסיבות." },
    ],
    tips: [
      "הגדירו מילה טעונה אחת. הוסיפו סיבה קודמת אחת. החליפו סימן אחד במנגנון.",
      "אח״כ חשבו מחדש: המדדים אמורים להשתפר.",
    ],
  },
  synthesis: {
    title: "גביש — משפט נקי אחד",
    how: ["כתבו משפט אחד של \"בגלל → לכן\" שאפשר לומר בנשימה אחת.", "שימרו על ממשי; בלי קריאת מחשבות; הוסיפו מנגנון אם אפשר."],
  },
  actions: {
    title: "צעד קטן אחד",
    how: ["בחרו פעולה של 5 דקות בתוך 24 שעות שבודקת את הסיבה או מפחיתה פסיביות."],
  },
  proof: {
    title: "עץ הוכחה — שימוש",
    how: ["הוסיפו צמתים: הגדרות (אמיתיות), היסקים (בגלל→לכן), מושגים משותפים.", "נקו סתירות/עמימות עד שהמבנה מחזיק."],
  },
  zoom: {
    title: "גלגל פרקטלי וזום — הבנת רמות מקוננות",
    how: [
      "הגלגל הפרקטלי מציג טבעות קונצנטריות — כל טבעת היא 'רמה' של עומק בחקירה שלך.",
      "טבעת חיצונית = תמונה רחבה (הרעיון העיקרי). טבעות פנימיות = צלילות עמוקות יותר לתת-סיבות.",
      "השלמות של כל טבעת מציגה את ציון המספיקות שלה — כמה טוב הרמה הזו מעוגנת.",
      "זום פנימה: כשאת/ה מוצא/ת סיבה קודמת או תת-סיבה ששווה לחקור בנפרד, לחץ/י 'זום פנימה'. זה יוצר טבעת פנימית חדשה ומאפשר לך לעבור על התת-סיבה מאפס.",
      "זום החוצה: מחזיר אותך לרמה החיצונית הקודמת, תוך שמירה על כל העבודה בטבעות הפנימיות.",
      "למה לזום פנימה? לפעמים תת-סיבה (כמו 'למה הנחתי חוסר כבוד?') צריכה מסלול מלא משלה כדי להגיע למספיקות. הגלגל עוקב אחר מספיקות בכל רמה.",
    ],
    terms: [
      { label: "גלגל פרקטלי", text: "ייצוג ויזואלי של רמות מקוננות — טבעות חיצוניות רחבות יותר, טבעות פנימיות הן תת-סיבות עמוקות יותר." },
      { label: "רמה", text: "מחזור מסלול אחד שלם. רמות מרובות = חקירת רעיון עיקרי ותת-סיבות שלו בנפרד." },
      { label: "מספיקות לכל טבעת", text: "כל טבעת מציגה כמה הרמה הזו מספיקה. טבעות פנימיות יכולות להיות עם ציונים שונים מהחיצוניות — זה נורמלי." },
      { label: "מספיקות פרקטלית", text: "המספיקות המינימלית בכל הטבעות — החוליה החלשה שלך קובעת את המספיקות הכוללת." },
    ],
    tips: [
      "התחל/י פשוט: קבל/י טבעת אחת (רעיון אחד) למספיקות טובה קודם, אז זום פנימה אם תת-סיבה צריכה חקירה משלה.",
      "תראה/י טבעות מרובות כשזוממת פנימה — כל אחת מייצגת רעיון נפרד שחקרת.",
      "הגלגל מתעדכן כשאת/ה בונה את עץ ההוכחה בכל רמה.",
      "מספיקות פרקטלית (מוצגת מתחת לגלגל) = המינימום בכל הרמות — שפר/י את הטבעת החלשה ביותר כדי להעלות אותה.",
    ],
  },
  final: {
    title: "מה רואים כאן",
    how: ["סיכום שפה פשוטה של הטענה, שינוי הבהירות, וצעד קטן אחד.", "זה ה-takeaway; העתיקו ליומן או לשיתוף."],
  },
};
