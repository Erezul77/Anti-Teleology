// Shared RAG Library - Main Export File
// Used by both Spino and Noesis projects

// Core RAG System
export { default as EnhancedRAG } from './enhancedRAG'
export type { EnhancedRAGResponse, EnhancedRAGQuery } from './enhancedRAG'

// Empowerapy Integration
export { 
  EMPOWERAPY_KNOWLEDGE_BASE,
  EMPOWERAPY_ONTOLOGY,
  EMPOWERAPY_EMOTIONS,
  EMPOWERAPY_THERAPEUTIC_PRACTICES,
  EMPOWERAPY_TRAINING_DIALOGUES,
  EMPOWERAPY_RAG_INDEX
} from './empowerapy/empowerapyKnowledge'

// Types and Interfaces
export type {
  RAGContext,
  EmotionalInsight,
  CausalLink,
  UserContext,
  EmotionalState,
  RealTimeAnalysis,
  EmpowerapyEmotion,
  EmpowerapyTherapeuticPractice,
  EmpowerapyTrainingDialogue,
  EmpowerapyRAGIndex
} from './enhancedRAG'

// Convenience exports
export const SharedRAGLibrary = {
  version: '1.0.0',
  description: 'Shared RAG system with Empowerapy integration for Spino and Noesis projects',
  components: {
    enhancedRAG: 'EnhancedRAG',
    empowerapy: 'Empowerapy Knowledge Base',
    spinozistic: 'Spinozistic Philosophy System'
  }
}

// Default export for easy importing
export default {
  EnhancedRAG: require('./enhancedRAG').default,
  Empowerapy: require('./empowerapy/empowerapyKnowledge'),
  SharedRAGLibrary
}
