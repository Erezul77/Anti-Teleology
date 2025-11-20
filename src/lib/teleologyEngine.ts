import OpenAI from "openai";

// Lazy initialization of OpenAI client (server-side only)
// This will only be used in API routes, never in client components
let openai: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export type TeleologyType =
  | "personal"
  | "personal-meaning"
  | "cosmic-plan"
  | "religious"
  | "moralistic"
  | "moral-desert"
  | "national/ideological"
  | "collective-destiny"
  | "conspiracy"
  | "harmless/weak";

export type ManipulationRisk = "low" | "medium" | "high";

export interface TeleologyAnalysis {
  teleologyScore: number; // 0.0–1.0, how strongly teleological the text is
  teleologyType: TeleologyType | null;
  manipulationRisk: ManipulationRisk;
  detectedPhrases: string[]; // raw phrases like "meant to", "in order to", "punishment", etc.
  purposeClaim: string | null; // short summary of the core "in order to" story, if present
  neutralCausalParaphrase: string | null; // same content rewritten in causal terms
}

/**
 * Generate purpose claim and neutral causal paraphrase using LLM
 */
async function generateTeleologySummaries(input: string): Promise<{
  purposeClaim: string | null;
  neutralCausalParaphrase: string | null;
}> {
  if (!input.trim()) {
    return { purposeClaim: null, neutralCausalParaphrase: null };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // No LLM available – fall back to heuristics only
    return {
      purposeClaim: null,
      neutralCausalParaphrase: null,
    };
  }

  try {
    const prompt = `
You are an assistant that analyzes teleological (purpose-based) language.

The user has written the following text:

---
${input}
---

1. First, identify the main *teleological story* in this text, if any. That is: how does the text explain events as happening "in order to", "meant to", "for the sake of", "as punishment", "as reward", etc. Summarize this in ONE short sentence. If there is no clear teleological story, return an empty string.

2. Second, rewrite the user's text as a neutral **causal description**:
   - Only talk about causes, conditions, actions, incentives, history, context.
   - Do NOT use "in order to", "meant to", "destiny", "fate", "punishment", "deserves", "reward", "for a reason", or any similar purpose-language.
   - The tone should be descriptive and matter-of-fact.

Return a JSON object with exactly the following fields:
{
  "purposeClaim": string,
  "neutralCausalParaphrase": string
}
If there is no teleological story, set "purposeClaim" to an empty string.
`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are a careful analyst of teleological language. You always return valid JSON that matches the requested schema.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const raw = response.choices?.[0]?.message?.content;
    if (!raw) {
      return { purposeClaim: null, neutralCausalParaphrase: null };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return { purposeClaim: null, neutralCausalParaphrase: null };
    }

    const purposeClaim =
      typeof parsed.purposeClaim === "string" && parsed.purposeClaim.trim().length > 0
        ? parsed.purposeClaim.trim()
        : null;

    const neutralCausalParaphrase =
      typeof parsed.neutralCausalParaphrase === "string" &&
      parsed.neutralCausalParaphrase.trim().length > 0
        ? parsed.neutralCausalParaphrase.trim()
        : null;

    return { purposeClaim, neutralCausalParaphrase };
  } catch (err) {
    console.error("[teleologyEngine] LLM summaries failed", err);
    return {
      purposeClaim: null,
      neutralCausalParaphrase: null,
    };
  }
}

/**
 * analyzeTeleology
 *
 * Shared entry point for teleology analysis.
 *
 * For now, this can be implemented in several ways:
 *  - a simple heuristic-based detector (regex over typical teleology phrases),
 *  - a call to an LLM (e.g. OpenAI) with a prompt that returns a JSON TeleologyAnalysis,
 *  - or a combination of both.
 *
 * The important thing is to keep the function signature stable so that:
 *  - SpiñO can call it on user messages,
 *  - Honestra components can call it on feed content / posts.
 */
export async function analyzeTeleology(input: string): Promise<TeleologyAnalysis> {
  // Heuristic-based detection (keywords, patterns)
  const lower = input.toLowerCase();

  // Strong teleology patterns (add significant weight)
  const strongTeleologyPatterns = [
    "everything happens for a reason",
    "happens for a reason",
    "this happened for a reason",
    "here to push me",
    "here to push",
    "this chaos is here to",
    "life is forcing me to grow",
    "life is forcing me",
    "life is trying to",
    "the universe is trying to",
    "meant to be",
    "supposed to happen",
    "so i'll finally",
    "so i will finally",
    "so that i finally",
    "so i can finally",
    "keeps arranging them so i",
    "life keeps arranging",
    "life keeps sending me",
    "the universe keeps sending me",
    "keeps sending me",
    "keeps bringing me"
  ];

  // Standard teleology keywords
  const teleologyKeywords = [
    "in order to",
    "so that",
    "meant to",
    "punishment",
    "deserves",
    "deserve",
    "fate",
    "destiny",
    "chosen",
    "god wants",
    "history wants",
    "the universe wants",
    "teaching me",
    "showing me",
    "telling me"
  ];

  // Check for strong patterns first (regex for flexible matching)
  const strongPatternRegexes = [
    /(here|this|life)\s+is\s+here\s+to\s+\w+/i,
    /forcing\s+me\s+to\s+(grow|change|learn)/i,
    /life\s+is\s+forcing\s+me/i,
    /the\s+universe\s+(wants|is\s+trying|is\s+forcing)/i,
    /so\s+(i|i'll|i will|i can|that i)\s+finally/i,
    /(life|the universe|fate|destiny)\s+keeps\s+(arranging|sending|bringing|giving)\s+(them|me|us)\s+so\s+(i|i'll|i will|i can|that i)/i,
    /keeps\s+(arranging|sending|bringing|giving)\s+(them|me|us)\s+so\s+(i|i'll|i will|i can|that i)\s+finally/i
  ];

  const detected: string[] = [];
  let strongPatternCount = 0;

  // Check strong patterns
  for (const pattern of strongTeleologyPatterns) {
    if (lower.includes(pattern)) {
      detected.push(pattern);
      strongPatternCount++;
    }
  }

  // Check regex patterns
  for (const regex of strongPatternRegexes) {
    if (regex.test(input)) {
      strongPatternCount++;
      const match = input.match(regex);
      if (match) detected.push(match[0]);
    }
  }

  // Check standard keywords
  for (const keyword of teleologyKeywords) {
    if (lower.includes(keyword) && !detected.includes(keyword)) {
      detected.push(keyword);
    }
  }

  // Calculate score: strong patterns add 0.3 each, standard keywords add 0.1 each
  const strongScore = Math.min(0.9, strongPatternCount * 0.3);
  const standardScore = Math.min(0.7, (detected.length - strongPatternCount) * 0.1);
  let score = Math.min(1, strongScore + standardScore);

  // Improved classification with collective, moral-desert, and personal-meaning types
  let teleologyType: TeleologyType | null = null;
  let manipulationRisk: ManipulationRisk = "low";

  if (score === 0) {
    teleologyType = null;
    manipulationRisk = "low";
  } else {
    // Check for collective markers first
    const collectiveMarkers = [
      "we", "our people", "our country", "this nation", "we were chosen",
      "our suffering", "our people were", "chosen people", "our nation"
    ];
    const hasCollectiveMarkers = collectiveMarkers.some(marker => lower.includes(marker));
    const hasChosen = lower.includes("chosen") && (hasCollectiveMarkers || lower.includes("we") || lower.includes("our"));

    // Check for moral-desert markers
    const moralDesertMarkers = [
      "deserve", "deserves", "punish", "punishment", "price i have to pay",
      "price to pay", "i deserve this", "they deserve this"
    ];
    const hasMoralDesert = moralDesertMarkers.some(marker => lower.includes(marker));

    // Check for religious markers (explicit religious lexicon)
    const religiousMarkers = [
      "god", "divine", "sin", "judgment", "god punished", "divine plan",
      "god wants", "god is", "holy", "sacred"
    ];
    const hasReligious = religiousMarkers.some(marker => lower.includes(marker));

    // Check for existential/cosmic markers (without explicit religion)
    const cosmicMarkers = [
      "fate", "destiny", "meant to be", "the universe wants", "the universe is trying",
      "life is trying", "life is forcing", "cosmic", "the universe"
    ];
    const hasCosmic = cosmicMarkers.some(marker => lower.includes(marker)) && !hasReligious;

    // Check for conspiracy markers
    const hasConspiracy = lower.includes("conspiracy") || 
                         lower.includes("they are all") || 
                         lower.includes("everything is orchestrated") ||
                         lower.includes("orchestrated");

    // Type classification logic
    if (hasCollectiveMarkers && (hasChosen || lower.includes("suffer") || lower.includes("sacrifice"))) {
      teleologyType = "collective-destiny";
      manipulationRisk = hasChosen || lower.includes("sacrifice") || lower.includes("must suffer") ? "high" : "medium";
    } else if (hasMoralDesert) {
      teleologyType = "moral-desert";
      manipulationRisk = "high"; // Moral-desert is always high risk
    } else if (hasReligious) {
      teleologyType = "religious";
      manipulationRisk = hasMoralDesert ? "high" : "medium";
    } else if (hasConspiracy) {
      teleologyType = "conspiracy";
      manipulationRisk = "medium";
    } else if (hasCosmic || lower.includes("meant to be") || lower.includes("fate") || lower.includes("destiny")) {
      teleologyType = "personal-meaning";
      manipulationRisk = hasMoralDesert ? "high" : "medium";
    } else if (lower.includes("nation") || lower.includes("history") || lower.includes("the people")) {
      teleologyType = "national/ideological";
      manipulationRisk = "medium";
    } else {
      teleologyType = "personal";
      manipulationRisk = hasMoralDesert ? "high" : "low";
    }

    // Additional risk adjustments
    if (hasMoralDesert && (hasCollectiveMarkers || lower.includes("they deserve"))) {
      manipulationRisk = "high"; // Moral-desert directed at groups or others is especially high risk
    }
    if (lower.includes("cleanse") || lower.includes("eradicate") || lower.includes("purge")) {
      manipulationRisk = "high";
    }
  }

  // Call LLM to generate purposeClaim and neutralCausalParaphrase
  const { purposeClaim, neutralCausalParaphrase } = await generateTeleologySummaries(input);

  // Safety net: if LLM clearly sees teleology but heuristics are near zero
  const hasPurpose = !!purposeClaim && purposeClaim.trim().length > 0;
  const heuristicScore = score;

  if (heuristicScore < 0.2 && hasPurpose) {
    // Bump score to moderate teleology level
    score = 0.4;

    // If type is null, set a sensible default
    if (!teleologyType) {
      teleologyType = "personal-meaning"; // Default to personal-meaning for missed patterns
    }

    // If risk is low, bump it to medium
    if (manipulationRisk === "low") {
      manipulationRisk = "medium";
    }
  }

  const analysis: TeleologyAnalysis = {
    teleologyScore: score,
    teleologyType,
    manipulationRisk,
    detectedPhrases: detected,
    purposeClaim,
    neutralCausalParaphrase,
  };

  return analysis;
}

