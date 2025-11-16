// Empowerapy Training Program Knowledge Base
// Integration of Spinozistic emotional transformation system

// Local type definitions instead of shared library imports
interface EmpowerapyEmotion {
  name: string
  userUtterance: string
  detectedBelief: string
  inadequateIdea: string
  causalReconstruction: {
    event: string
    misinterpretedCause: string
    realCause: string
    rootProblem: string
  }
  reframe: string
  philosophicalSource: string[]
  intervention: string[]
  adequateIdea: string
}

interface EmpowerapyTherapeuticPractice {
  name: string
  goal: string
  script: string[]
  therapeuticRole: string
  adequacyLevel: 'beginner' | 'intermediate' | 'advanced'
  emotionalStates: string[]
}

interface EmpowerapyTrainingDialogue {
  scenario: string
  userInput: string
  coachResponse: string
  userFollowUp: string
  coachGuidance: string
  userInsight: string
  finalClarity: string
  emotionalTransformation: string
  adequacyImprovement: number
}

interface EmpowerapyRAGIndex {
  query: string
  emotion: string
  beliefDetected: string
  inadequateIdea: string
  reframe: string
  intervention: string[]
  adequateIdea: string
  quotes: string[]
  therapeuticPractice: string
  dialogueExample: string
}

// Core Ontology & Definitions
export const EMPOWERAPY_ONTOLOGY = {
  substance: {
    definition: "That which is in itself and is conceived through itself.",
    ontology: "God/Nature is the only true substance.",
    therapeuticRole: "Grounds the self in necessity, dissolves illusion of separation.",
    userSymptoms: ["I feel lost.", "I'm disconnected from everything."],
    intervention: "Teach that we are expressions of infinite substance.",
    code: "Substance = λ x: (x.exists_by_nature and x.conceived_by_self)"
  },
  mode: {
    definition: "That which exists in and is conceived through something else.",
    ontology: "All things are modes of substance, not self-caused.",
    therapeuticRole: "Undoes the ego-fantasy of independent will.",
    userSymptoms: ["Why is this happening to me?"],
    intervention: "Explain causal dependence.",
    code: "class Mode: def __init__(self, substance): self.exists_in = substance; self.conceived_through = substance"
  },
  idea: {
    definition: "Mental conception formed by a thinking mind.",
    ontology: "Ideas affirm reality, they are not images.",
    therapeuticRole: "Replaces reactivity with reasoning.",
    userSymptoms: ["I just know it's true.", "I can't stop imagining..."],
    intervention: "Clarify distinction between idea and imagination.",
    code: "class Idea: def __init__(self, content, clarity): self.content = content; self.is_affirmative = True; self.clarity = clarity"
  },
  adequateIdea: {
    definition: "An idea which has all the marks of truth internally.",
    ontology: "Reveals causal structure, not just form.",
    therapeuticRole: "The key to joy and power.",
    userSymptoms: ["Why do I keep doing this?"],
    intervention: "Trace cause → clarify idea.",
    code: "def is_adequate(idea): return idea.clarity >= 1.0 and idea.is_affirmative"
  },
  emotion: {
    definition: "A body modification and its idea.",
    ontology: "Emotions are real, but may be passive.",
    therapeuticRole: "Don't repress, understand.",
    userSymptoms: ["I feel overwhelmed for no reason."],
    intervention: "Identify inadequate ideas behind the emotion.",
    code: "class Emotion: def __init__(self, delta_power, idea): self.delta_power = delta_power; self.idea = idea"
  }
}

// Affect Transformation Dataset
export const EMPOWERAPY_EMOTIONS: Map<string, EmpowerapyEmotion> = new Map([
  ['fear', {
    name: 'Fear',
    userUtterance: "I'm terrified of being rejected.",
    detectedBelief: "My worth depends on how others respond to me.",
    inadequateIdea: "The cause of my value lies outside of me.",
    causalReconstruction: {
      event: "A person ignores you.",
      misinterpretedCause: "They must not like me.",
      realCause: "You imagine your essence is defined by external modes (esteem, attention).",
      rootProblem: "You treat a mode (social rejection) as a substance (truth)."
    },
    reframe: "I am a mode of Substance, whose existence and essence are not dependent on anyone's perception.",
    philosophicalSource: [
      "The mind's essence is understanding, not imagination.",
      "He who lives under the guidance of reason endeavors to understand rather than to be understood."
    ],
    intervention: [
      "Identify external dependency",
      "Introduce substance vs. mode distinction",
      "Ground self-worth in understanding"
    ],
    adequateIdea: "My essence exists independently of external validation."
  }],
  ['anger', {
    name: 'Anger',
    userUtterance: "I'm furious that they disrespected me.",
    detectedBelief: "Their action has the power to damage my dignity.",
    inadequateIdea: "My value is something that can be increased or diminished by others.",
    causalReconstruction: {
      event: "Someone interrupts you aggressively.",
      misinterpretedCause: "They reduced me.",
      realCause: "You confuse passion (external cause) with action (internal cause).",
      rootProblem: "You confuse passion (external cause) with action (internal cause)."
    },
    reframe: "Their behavior followed from their own nature. My dignity cannot be harmed by another's confusion.",
    philosophicalSource: [
      "He who understands necessity cannot hate.",
      "We are only passive when we are not the adequate cause of what happens within us."
    ],
    intervention: [
      "Distinguish external from internal causes",
      "Clarify power of understanding",
      "Transform passion to action"
    ],
    adequateIdea: "My dignity is rooted in understanding, not external validation."
  }]
])

// Therapeutic Practice Scripts
export const EMPOWERAPY_THERAPEUTIC_PRACTICES: EmpowerapyTherapeuticPractice[] = [
  {
    name: "Meditation on Necessity",
    goal: "Reduce confusion and resistance by contemplating the necessity of all events.",
    script: [
      "Sit quietly and observe a recent event that disturbed you.",
      "Ask yourself: Could it have been otherwise?",
      "Now reflect: If everything follows from the essence of Nature, then this event was part of a necessary unfolding.",
      "Breathe and say inwardly: 'This too had its cause.'",
      "You are not outside Nature. You are its mode."
    ],
    therapeuticRole: "Reduces resistance and confusion",
    adequacyLevel: "beginner",
    emotionalStates: ["fear", "anger", "confusion"]
  }
]

// Training Dialogues
export const EMPOWERAPY_TRAINING_DIALOGUES: EmpowerapyTrainingDialogue[] = [
  {
    scenario: "User struggling with fear of rejection",
    userInput: "I'm afraid to speak up because people might judge me.",
    coachResponse: "What makes you think their judgment defines your worth?",
    userFollowUp: "Well, if they don't like me, then I'm not valuable.",
    coachGuidance: "You're confusing a mode (their opinion) with substance (your essence).",
    userInsight: "So my value isn't dependent on what others think?",
    finalClarity: "Exactly. Your worth comes from understanding, not external validation.",
    emotionalTransformation: "Fear → Understanding",
    adequacyImprovement: 0.8
  }
]

// RAG Index for Quick Retrieval
export const EMPOWERAPY_RAG_INDEX: EmpowerapyRAGIndex[] = [
  {
    query: "I'm afraid of being rejected",
    emotion: "fear",
    beliefDetected: "My worth depends on others' approval",
    inadequateIdea: "External validation determines my value",
    reframe: "I am a mode of Substance, independent of others' perception",
    intervention: ["Identify external dependency", "Introduce substance vs. mode distinction"],
    adequateIdea: "My essence exists independently of external validation",
    quotes: ["The mind's essence is understanding, not imagination"],
    therapeuticPractice: "Meditation on Necessity",
    dialogueExample: "Fear of rejection → Understanding of independent worth"
  }
]

// Complete Knowledge Base
export const EMPOWERAPY_KNOWLEDGE_BASE = {
  ontology: EMPOWERAPY_ONTOLOGY,
  emotions: EMPOWERAPY_EMOTIONS,
  therapeuticPractices: EMPOWERAPY_THERAPEUTIC_PRACTICES,
  trainingDialogues: EMPOWERAPY_TRAINING_DIALOGUES,
  ragIndex: EMPOWERAPY_RAG_INDEX
}
