// Empowerapy Training Program Knowledge Base
// Integration of Spinozistic emotional transformation system
// SHARED LIBRARY VERSION - Used by both Spino and Noesis projects

import { 
  EmpowerapyEmotion, 
  EmpowerapyTherapeuticPractice, 
  EmpowerapyTrainingDialogue, 
  EmpowerapyRAGIndex 
} from '../enhancedRAG'

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
  }],
  ['shame', {
    name: 'Shame',
    userUtterance: "I feel ashamed of my failure.",
    detectedBelief: "Failure is a reflection of essence.",
    inadequateIdea: "Self-worth is contingent on outcomes.",
    causalReconstruction: {
      event: "Project failed.",
      misinterpretedCause: "I am not good enough.",
      realCause: "Mistaking a mode of extension (action result) as a judgment on your mode of thought (essence).",
      rootProblem: "Mistaking a mode of extension (action result) as a judgment on your mode of thought (essence)."
    },
    reframe: "My essence is the power to understand. This failure does not diminish my nature.",
    philosophicalSource: [
      "Blessedness is not the reward of virtue, but virtue itself.",
      "The power of the mind consists in understanding."
    ],
    intervention: [
      "Separate action from essence",
      "Focus on power of understanding",
      "Transform shame to learning"
    ],
    adequateIdea: "My essence is understanding, which grows through experience."
  }],
  ['envy', {
    name: 'Envy',
    userUtterance: "Why do others succeed while I struggle?",
    detectedBelief: "Good is scarce and distributed unjustly.",
    inadequateIdea: "Value is relative and competitive.",
    causalReconstruction: {
      event: "See someone else's success.",
      misinterpretedCause: "That means I have less.",
      realCause: "Zero-sum idea of goodness, rooted in passion and comparison.",
      rootProblem: "Zero-sum idea of goodness, rooted in passion and comparison."
    },
    reframe: "Another's success does not reduce mine. Joy is not a subtractive quantity.",
    philosophicalSource: [
      "He who lives under the guidance of reason strives to aid others' joy as his own.",
      "Insofar as men live under the guidance of reason, they agree in nature."
    ],
    intervention: [
      "Dissolve zero-sum thinking",
      "Introduce interdependence",
      "Celebrate collective joy"
    ],
    adequateIdea: "Joy is additive and shared, not competitive."
  }],
  ['sadness', {
    name: 'Sadness (Grief)',
    userUtterance: "I can't stop grieving what I lost.",
    detectedBelief: "Goodness existed in something perishable.",
    inadequateIdea: "Joy came from an external object, now gone.",
    causalReconstruction: {
      event: "Loss of person, object, opportunity.",
      misinterpretedCause: "I've lost the good itself.",
      realCause: "Mistaking temporal modification for eternal cause.",
      rootProblem: "Mistaking temporal modification for eternal cause."
    },
    reframe: "The source of joy is clarity, not possession. What I loved still reflects eternal substance.",
    philosophicalSource: [
      "Love toward a thing eternal and infinite feeds the mind with joy alone.",
      "The free man thinks least of death."
    ],
    intervention: [
      "Distinguish eternal from temporal",
      "Find joy in understanding",
      "Transform loss to appreciation"
    ],
    adequateIdea: "Joy comes from understanding, not possession."
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
  },
  {
    name: "Dissolving Shame Through Ontology",
    goal: "Replace self-blame with clarity.",
    script: [
      "Recall a time you felt ashamed.",
      "Ask: Is this emotion based on something temporary or eternal?",
      "Imagine your essence as an expression of one eternal Substance.",
      "Say: 'No act can reduce my nature. My power lies in understanding.'",
      "Breathe into this idea until it becomes clear."
    ],
    therapeuticRole: "Transforms shame to self-understanding",
    adequacyLevel: "intermediate",
    emotionalStates: ["shame", "guilt", "self-doubt"]
  },
  {
    name: "From Passion to Action",
    goal: "Shift from being emotionally passive to being mentally active.",
    script: [
      "Identify an emotion that feels overwhelming.",
      "Ask: Did I cause this emotion by my own adequate understanding?",
      "If not, you are passive. That's not shameful — it's a signal.",
      "Use your reason to trace the cause.",
      "Then speak: 'From now on, I act through understanding, not through reaction.'"
    ],
    therapeuticRole: "Transforms passive emotions to active understanding",
    adequacyLevel: "intermediate",
    emotionalStates: ["overwhelm", "helplessness", "reactivity"]
  },
  {
    name: "Intellectual Love of God/Nature",
    goal: "Connect the self to eternal joy.",
    script: [
      "Visualize all of existence as a single, infinite organism — Substance.",
      "Within it, you are a unique expression of understanding.",
      "Say silently: 'I am not outside God. I am an idea in the Mind of Nature.'",
      "Feel the love not as a desire, but as a clarity: your joy is its own reward."
    ],
    therapeuticRole: "Connects to eternal source of joy",
    adequacyLevel: "advanced",
    emotionalStates: ["loneliness", "meaninglessness", "disconnection"]
  },
  {
    name: "Journaling Prompt – Adequacy Log",
    goal: "Cultivate awareness of mental adequacy over time.",
    script: [
      "Today I experienced ___________.",
      "I originally interpreted it as: ___________.",
      "Upon reflection, I see the causes were: ___________.",
      "The adequate idea I now hold is: ___________.",
      "How does this change how I feel? ___________."
    ],
    therapeuticRole: "Builds self-awareness and adequacy tracking",
    adequacyLevel: "beginner",
    emotionalStates: ["all"]
  },
  {
    name: "Contemplation on Commonality",
    goal: "Dissolve envy, resentment, and superiority.",
    script: [
      "Bring to mind someone you compare yourself with.",
      "Say: 'They too are a mode of the one Substance.'",
      "Any joy they feel enhances the world, not detracts from me.",
      "We are not in competition. We are in parallel expression."
    ],
    therapeuticRole: "Dissolves comparison and competition",
    adequacyLevel: "intermediate",
    emotionalStates: ["envy", "resentment", "superiority"]
  }
]

// Training Dialogues
export const EMPOWERAPY_TRAINING_DIALOGUES: EmpowerapyTrainingDialogue[] = [
  {
    scenario: "Social Anxiety",
    userInput: "I feel like everyone is judging me when I walk into a room.",
    coachResponse: "What belief is contained in that feeling?",
    userFollowUp: "That I'm not good enough. That they see I'm a failure.",
    coachGuidance: "Is your value dependent on their perception?",
    userInsight: "That would be freeing. But it feels so real.",
    finalClarity: "Feelings are often based on imagination. Let's search for an idea based on reason. You are a mode of Nature. Your value is not subject to vote.",
    emotionalTransformation: "From external validation to internal understanding",
    adequacyImprovement: 0.7
  },
  {
    scenario: "Fear of Loss",
    userInput: "I'm scared I'll lose everything I've worked for.",
    coachResponse: "What would that loss mean to you?",
    userFollowUp: "That I'm worthless. That I've failed.",
    coachGuidance: "What if the loss is a necessary mode, not a judgment?",
    userInsight: "You mean… it's not about me?",
    finalClarity: "Nothing perishes except as a transformation. Your essence remains. Fear comes when you bind your joy to the perishable.",
    emotionalTransformation: "From fear of loss to understanding of transformation",
    adequacyImprovement: 0.8
  },
  {
    scenario: "Shame After Mistake",
    userInput: "I feel so ashamed of how I acted. It's haunting me.",
    coachResponse: "What idea do you hold about yourself?",
    userFollowUp: "That I'm a bad person because I failed.",
    coachGuidance: "Let's examine the cause. Did you act from understanding or confusion?",
    userInsight: "From confusion.",
    finalClarity: "Then you were passive — not yet acting from your true nature. Would you condemn a child for not walking perfectly?",
    emotionalTransformation: "From self-condemnation to self-compassion",
    adequacyImprovement: 0.6
  },
  {
    scenario: "Envy Toward a Peer",
    userInput: "I hate that she's doing better than me. It makes me feel small.",
    coachResponse: "What does her success threaten?",
    userFollowUp: "My sense of worth. That I'm behind.",
    coachGuidance: "Does another's joy diminish yours?",
    userInsight: "…I guess not. But it feels like competition.",
    finalClarity: "That feeling is a passion. Under reason, we see others as fellow expressions of Substance. Her increase in joy expands the total.",
    emotionalTransformation: "From competitive envy to shared joy",
    adequacyImprovement: 0.7
  },
  {
    scenario: "Existential Confusion",
    userInput: "I just don't understand what the point of anything is.",
    coachResponse: "What do you seek that feels missing?",
    userFollowUp: "Meaning. Purpose. Something more.",
    coachGuidance: "Look within your capacity to understand. That is where Substance reveals itself in you.",
    userInsight: "So I shouldn't look outside?",
    finalClarity: "No. The external is fragmented. Truth arises when you follow the order of causes inward.",
    emotionalTransformation: "From external seeking to internal understanding",
    adequacyImprovement: 0.9
  }
]

// RAG JSON Index
export const EMPOWERAPY_RAG_INDEX: EmpowerapyRAGIndex[] = [
  {
    query: "Why am I so afraid of losing everything?",
    emotion: "fear",
    beliefDetected: "My worth depends on external success.",
    inadequateIdea: "If I lose what I built, I lose who I am.",
    reframe: "Your essence is not dependent on possessions. Loss is transformation, not negation.",
    intervention: [
      "Trace source of fear to imagination",
      "Introduce concept of mode vs. substance",
      "Replace contingency with necessity"
    ],
    adequateIdea: "My being is an expression of Nature, not of outcomes.",
    quotes: [
      "Love toward a thing eternal and infinite feeds the mind with joy alone.",
      "He who lives under the guidance of reason endeavors to understand necessity."
    ],
    therapeuticPractice: "Meditation on Necessity",
    dialogueExample: "Fear of Loss"
  },
  {
    query: "Why do I feel ashamed for failing?",
    emotion: "shame",
    beliefDetected: "My actions define my essence.",
    inadequateIdea: "Failing makes me a lesser being.",
    reframe: "Mistakes are modes, not identities. Only understanding expresses essence.",
    intervention: [
      "Clarify the difference between action and passion",
      "Frame shame as confusion, not essence",
      "Return focus to power of the mind"
    ],
    adequateIdea: "My essence is the power of understanding, which remains untouched by temporary failure.",
    quotes: [
      "Blessedness is not the reward of virtue, but virtue itself.",
      "The mind's power is the very essence of the mind."
    ],
    therapeuticPractice: "Dissolving Shame Through Ontology",
    dialogueExample: "Shame After Mistake"
  },
  {
    query: "Why am I so angry when people disrespect me?",
    emotion: "anger",
    beliefDetected: "They have the power to diminish me.",
    inadequateIdea: "My dignity is vulnerable to others' actions.",
    reframe: "Their behavior is theirs alone. You remain unchanged in essence.",
    intervention: [
      "Show anger as reaction to external cause",
      "Return to internal adequacy",
      "Teach parallelism: others' actions ≠ ontological injury"
    ],
    adequateIdea: "My nature is not altered by another's confusion.",
    quotes: [
      "He who understands that all things follow from necessity cannot hate.",
      "We are passive only when we are not the adequate cause."
    ],
    therapeuticPractice: "From Passion to Action",
    dialogueExample: "Social Anxiety"
  },
  {
    query: "Why do I envy others' success?",
    emotion: "envy",
    beliefDetected: "Goodness is competitive and scarce.",
    inadequateIdea: "Their success reduces my own value.",
    reframe: "Joy is not subtractive. All are expressions of the same infinite cause.",
    intervention: [
      "Dissolve zero-sum thinking",
      "Introduce interdependence and parallelism",
      "Celebrate clarity in others as your own increase"
    ],
    adequateIdea: "The more I understand others' joy as natural, the more I increase my own power.",
    quotes: [
      "Insofar as men live under the guidance of reason, they agree in nature.",
      "He who lives by reason desires for others the good he desires for himself."
    ],
    therapeuticPractice: "Contemplation on Commonality",
    dialogueExample: "Envy Toward a Peer"
  }
]

// Export the complete Empowerapy knowledge base
export const EMPOWERAPY_KNOWLEDGE_BASE = {
  ontology: EMPOWERAPY_ONTOLOGY,
  emotions: EMPOWERAPY_EMOTIONS,
  therapeuticPractices: EMPOWERAPY_THERAPEUTIC_PRACTICES,
  trainingDialogues: EMPOWERAPY_TRAINING_DIALOGUES,
  ragIndex: EMPOWERAPY_RAG_INDEX
}
