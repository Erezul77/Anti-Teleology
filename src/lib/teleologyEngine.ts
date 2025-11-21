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
/**
 * Check if a teleology phrase is negated in the text
 */
function isNegated(text: string, index: number): boolean {
  // Look back a bit from the match index (e.g. 30–50 chars) for negation words
  const windowStart = Math.max(0, index - 50);
  const context = text.slice(windowStart, index).toLowerCase();

  const negationMarkers = [
    "don't", "do not", "dont",
    "not", "isn't", "isnt", "aren't", "arent",
    "no", "never", "can't", "cannot", "won't", "wont",
    "doesn't", "does not", "doesnt",
    "didn't", "did not", "didnt",
    "haven't", "have not", "havent",
    "hasn't", "has not", "hasnt"
  ];

  return negationMarkers.some(marker => context.includes(marker));
}

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

  // Patterns that should be checked for negation
  const negationSensitivePatterns = [
    "meant to be",
    "meant to",
    "happens for a reason",
    "for a reason",
    "everything happens for a reason",
    "this happened for a reason"
  ];

  // Check strong patterns with negation awareness
  for (const pattern of strongTeleologyPatterns) {
    const isNegationSensitive = negationSensitivePatterns.includes(pattern);
    let idx = lower.indexOf(pattern);
    
    if (idx !== -1) {
      let foundNonNegated = false;
      while (idx !== -1) {
        if (!isNegationSensitive || !isNegated(lower, idx)) {
          foundNonNegated = true;
          if (!detected.includes(pattern)) {
            detected.push(pattern);
          }
        }
        idx = lower.indexOf(pattern, idx + pattern.length);
      }
      if (foundNonNegated) {
        strongPatternCount++;
      }
    }
  }

  // Check regex patterns (less precise negation check, but still attempt)
  for (const regex of strongPatternRegexes) {
    try {
      const matches = Array.from(input.matchAll(regex));
      let foundNonNegated = false;
      for (const match of matches) {
        if (match.index !== undefined && !isNegated(input.toLowerCase(), match.index)) {
          foundNonNegated = true;
          if (match[0] && !detected.includes(match[0])) {
            detected.push(match[0]);
          }
        }
      }
      if (foundNonNegated) {
        strongPatternCount++;
      }
    } catch (err) {
      // If regex matching fails, skip this pattern
      console.warn('[teleologyEngine] Regex pattern failed:', regex, err);
    }
  }

  // Check standard keywords with negation awareness for key phrases
  for (const keyword of teleologyKeywords) {
    if (negationSensitivePatterns.includes(keyword)) {
      // Already handled above, skip
      continue;
    }
    
    const isNegationSensitive = keyword === "meant to" || keyword.includes("for a reason");
    let idx = lower.indexOf(keyword);
    
    if (idx !== -1) {
      let foundNonNegated = false;
      while (idx !== -1) {
        if (!isNegationSensitive || !isNegated(lower, idx)) {
          foundNonNegated = true;
          break; // Found at least one non-negated instance
        }
        idx = lower.indexOf(keyword, idx + keyword.length);
      }
      if (foundNonNegated && !detected.includes(keyword)) {
        detected.push(keyword);
      }
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
    // Check for collective/national markers (strict criteria)
    const collectiveMarkers = [
      "our country", "this country", "our nation", "this nation", "the state", "the regime",
      "our people", "our side", "our party", "our movement", "the party", "the movement",
      "we were chosen", "chosen people", "our nation", "this country", "our country"
    ];
    const hasCollectiveMarkers = collectiveMarkers.some(marker => lower.includes(marker));
    const hasChosen = lower.includes("chosen") && (hasCollectiveMarkers || 
      (lower.includes("we") && (lower.includes("country") || lower.includes("nation") || lower.includes("people"))));
    
    // Check for personal relationship markers
    const personalRelationshipMarkers = [
      "partner", "relationship", "breakup", "breakups", "my ex", "my exes",
      "dating", "romance", "love life", "significant other", "spouse", "wife", "husband"
    ];
    const hasPersonalRelationshipMarkers = personalRelationshipMarkers.some(marker => lower.includes(marker));
    const hasFirstPerson = /\bI\b|\bme\b|\bmy\b|\bmine\b/i.test(input);

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
    // First check for collective/national (strict criteria - only with clear group markers)
    if (hasCollectiveMarkers && (hasChosen || lower.includes("suffer") || lower.includes("sacrifice"))) {
      teleologyType = "collective-destiny";
      manipulationRisk = hasChosen || lower.includes("sacrifice") || lower.includes("must suffer") ? "high" : "medium";
    } else if (hasCollectiveMarkers && (lower.includes("nation") || lower.includes("country") || lower.includes("state") || lower.includes("regime"))) {
      teleologyType = "national/ideological";
      manipulationRisk = "medium";
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
      // Personal-meaning for cosmic/existential patterns
      teleologyType = "personal-meaning";
      manipulationRisk = hasMoralDesert ? "high" : "medium";
    } else if (hasPersonalRelationshipMarkers && hasFirstPerson) {
      // Personal relationship teleology (e.g., "life keeps sending me the same partner")
      teleologyType = "personal-meaning";
      manipulationRisk = hasMoralDesert ? "high" : "medium";
    } else if (hasFirstPerson && !hasCollectiveMarkers) {
      // First-person narrative without collective markers -> personal
      teleologyType = "personal-meaning";
      manipulationRisk = hasMoralDesert ? "high" : "low";
    } else {
      // Default to personal if we have teleology but no clear category
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

