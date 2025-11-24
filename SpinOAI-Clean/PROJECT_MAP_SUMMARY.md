# SpinOAI-Clean Project Map & Summary

**Generated:** 2025-01-27  
**Purpose:** High-level overview of the SpinO system architecture, features, and components for decision-making on what to keep, simplify, or archive.

---

## 📐 Architecture Overview

### **Tech Stack**
- **Framework:** Next.js 14.0.0 (App Router)
- **Language:** TypeScript
- **UI:** React 18, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes
- **Storage:** Firebase Firestore (optional), localStorage (primary)
- **AI:** OpenAI GPT-4, Claude (via API keys)
- **Deployment:** Vercel

### **Project Structure**
```
SpinOAI-Clean/
├── app/
│   ├── api/                    # API endpoints
│   │   ├── unified-philosophical/  # Main chat API (CORE)
│   │   ├── tts/                # Text-to-speech (optional)
│   │   ├── insight/            # Insight trial logging (experimental)
│   │   ├── minimal/            # Minimal test endpoint
│   │   └── hello/              # Health check
│   ├── components/             # React components
│   │   ├── UnifiedChatBox.tsx  # Main chat UI (CORE)
│   │   ├── UnifiedAnalytics.tsx # Real-time analytics dashboard
│   │   ├── SessionAnalytics.tsx # Session-level analytics
│   │   ├── SessionSummary.tsx  # Session summary card
│   │   └── DeltaATracker.tsx   # Adequacy score tracker
│   ├── page.tsx                # Main landing page (CORE)
│   └── layout.tsx              # Root layout
├── lib/                        # Core business logic
│   ├── emotionalWizardSystem.ts    # Main orchestration (CORE)
│   ├── conversationMemory.ts        # Session memory system
│   ├── emotionalAnalysis.ts         # Emotion detection (LLM-based)
│   ├── emotionalAdequacyEngine.ts   # Spinozistic adequacy scoring
│   ├── contextBuilder.ts            # Context integration (CORE - uses teleology)
│   ├── advancedLanguageGenerator.ts # GPT-4 response generation (CORE - uses teleology)
│   ├── ragSystem.ts                # RAG system wrapper
│   ├── enhancedRAG.ts              # Enhanced RAG implementation
│   ├── sessionManager.ts           # Session persistence (Firebase + localStorage)
│   ├── empowerapy/                  # Empowerapy knowledge base
│   ├── affect/ontology.ts           # Emotional ontology
│   ├── agents/trainingGenerator.ts  # Training data generator (experimental)
│   └── training/                    # Training documents (Word/PDF)
├── components/                 # Shared components
│   ├── ToolsPanel.tsx          # Tools sidebar (minimal)
│   ├── ClarityMeter.tsx        # (unused?)
│   └── FinalSummary.tsx        # (unused?)
├── archive/spino-legacy/        # Archived legacy features
│   ├── app/                    # Old page routes (pd-core, pd-wizard, studio, etc.)
│   └── components/             # Old components (FractalWheel, PDWizard, etc.)
└── backup/                     # Backup folders (can be removed)
```

---

## 🎯 Core Features (Active & Production-Ready)

### **1. Main Chat Interface** ✅
- **Location:** `app/page.tsx` + `app/components/UnifiedChatBox.tsx`
- **Description:** Full-featured chat UI with:
  - Real-time message display
  - Dark/light mode toggle
  - 11-language support (EN, ES, FR, DE, IT, PT, RU, ZH, JA, KO, HE)
  - Dual session modes: "Therapy" vs "Philosophical Reflection"
  - Mobile-responsive design
  - Session save/load functionality

### **2. Emotional Wizard System** ✅ (CORE)
- **Location:** `lib/emotionalWizardSystem.ts`
- **Description:** Main orchestration system that:
  - Coordinates all subsystems (memory, emotion analysis, adequacy engine, context building, language generation)
  - Processes user messages through a 5-stage pipeline
  - Returns structured responses with emotional analysis, adequacy scores, and therapeutic guidance
  - **Integrates teleology analysis** (calls `analyzeTeleology` from shared `src/lib/teleologyEngine.ts`)

### **3. Teleology Integration** ✅ (CORE)
- **Location:** 
  - Import: `app/api/unified-philosophical/route.ts` (line 3)
  - Usage: `lib/emotionalWizardSystem.ts` (line 6, 144)
  - Context: `lib/contextBuilder.ts` (line 4, 68, 136-163)
  - Prompt: `lib/advancedLanguageGenerator.ts` (line 116, 196-207)
- **Description:** 
  - Teleology analysis is **fully integrated** into the chat flow
  - Every user message is analyzed for teleological language
  - Results are passed to the context builder and language generator
  - The LLM prompt explicitly instructs SpiñO to use teleology analysis in its 3-part response format:
    1. **Teleology you're using** (identifies purpose-based framing)
    2. **Causal clarity** (restates in causal terms)
    3. **Clear next steps** (actionable guidance)

### **4. Emotional Analysis** ✅
- **Location:** `lib/emotionalAnalysis.ts`
- **Description:** 
  - Uses LLM (GPT-4/Claude) to detect primary emotions, intensity, confidence scores
  - Identifies subtle emotional cues
  - Provides structured emotional state analysis

### **5. Spinozistic Adequacy Engine** ✅
- **Location:** `lib/emotionalAdequacyEngine.ts`
- **Description:**
  - Calculates adequacy scores (α, Δα, χ) based on Spinoza's framework
  - Measures "power of acting" changes
  - Identifies inadequate ideas (external cause attribution)
  - Computes freedom ratios and bondage levels
  - Tracks transformation potential and blessedness levels

### **6. Conversation Memory System** ✅
- **Location:** `lib/conversationMemory.ts`
- **Description:**
  - Tracks conversation history across sessions
  - Builds relationship context and trust metrics
  - Identifies recurring emotional patterns
  - Enables learning from previous interactions

### **7. Context Builder** ✅ (CORE - uses teleology)
- **Location:** `lib/contextBuilder.ts`
- **Description:**
  - Integrates all analysis components into rich context
  - **Explicitly formats teleology analysis** with:
    - Teleology score, type, manipulation risk
    - Detected phrases
    - Purpose claim (from LLM)
    - Neutral causal paraphrase (from LLM)
  - Builds manipulation strategies and response guidance
  - Ensures coherent therapeutic approach

### **8. Advanced Language Generator** ✅ (CORE - uses teleology)
- **Location:** `lib/advancedLanguageGenerator.ts`
- **Description:**
  - Generates GPT-4 responses using Spinozistic prompts
  - **Explicitly incorporates teleology analysis** into the system prompt
  - Instructs the LLM to use the 3-part teleology debugger format
  - Applies quality control to remove generic therapy language

### **9. Session Management** ✅
- **Location:** `lib/sessionManager.ts`
- **Description:**
  - Saves sessions to Firebase Firestore (if configured) and localStorage
  - Loads previous sessions
  - Calculates session analytics (duration, average adequacy, dominant emotions, etc.)
  - Singleton pattern for global access

### **10. Real-time Analytics Dashboard** ✅
- **Location:** `app/components/UnifiedAnalytics.tsx`, `SessionAnalytics.tsx`, `DeltaATracker.tsx`
- **Description:**
  - Live display of adequacy scores (Spino + Noesis metrics)
  - Emotional state tracking
  - Therapeutic stage progression
  - Causal chain visualization
  - Session summary cards

### **11. RAG System** ✅ (Optional/Experimental)
- **Location:** `lib/ragSystem.ts`, `lib/enhancedRAG.ts`
- **Description:**
  - Local RAG implementation (no external vector DB)
  - Integrates with Empowerapy knowledge base
  - Provides context retrieval for emotional transformation
  - **Note:** Not clear if this is actively used in the main chat flow

---

## 🧪 Experimental / Legacy Features

### **1. Archived Legacy Features** 📦
- **Location:** `archive/spino-legacy/`
- **Contents:**
  - `pd-core/` - Old "PD Core" page
  - `pd-wizard/` - Old "PD Wizard" page
  - `pd-whisper/` - Old "PD Whisper" page
  - `studio/` - Old "SpinO Studio" page
  - `idea-walkthrough/` - Old idea walkthrough flow
  - Components: `FractalWheel.tsx`, `PDWizardV6.tsx`, `ProofTree.tsx`, `VoiceIO.tsx`, etc.
- **Status:** Archived, not used in current system
- **Recommendation:** Can be safely removed if not needed for reference

### **2. Training Generator Agent** 🧪
- **Location:** `lib/agents/trainingGenerator.ts`
- **Description:** 
  - Automatically converts Spinoza's theory and coaching sessions into training data
  - Generates training examples for fine-tuning
- **Status:** Experimental, not integrated into main chat flow
- **Usage:** Has a script command `npm run generate-training` but unclear if actively used

### **3. Text-to-Speech (TTS)** 🧪
- **Location:** `app/api/tts/route.ts`
- **Description:**
  - Optional external TTS proxy (ElevenLabs/Azure)
  - Returns 501 if not configured
- **Status:** Optional feature, not required for core functionality

### **4. Insight Trial Logging** 🧪
- **Location:** `app/api/insight/route.ts`
- **Description:**
  - Logs insight trial data (world, trial, timing, scores)
  - Appears to be for research/experimentation
- **Status:** Experimental endpoint, not used in main UI

### **5. Minimal/Hello Endpoints** 🧪
- **Location:** `app/api/minimal/route.ts`, `app/api/hello/route.ts`
- **Description:** Test/health check endpoints
- **Status:** Utility endpoints, can be kept for debugging

### **6. Empowerapy Knowledge Base** 🧪
- **Location:** `lib/empowerapy/empowerapyKnowledge.ts`
- **Description:**
  - Large knowledge base of emotions, therapeutic practices, training dialogues
  - Used by RAG system
- **Status:** Integrated but unclear if actively used in main chat flow

### **7. Training Documents** 📚
- **Location:** `lib/training/`
- **Contents:** Word/PDF documents about Spinozistic Emotional Layer training
- **Status:** Reference materials, not code

### **8. Unused Components** ❓
- **Location:** `components/ClarityMeter.tsx`, `components/FinalSummary.tsx`
- **Status:** Not imported or used in main app
- **Recommendation:** Can be removed if not needed

### **9. Backup Folders** 📦
- **Location:** `backup/`
- **Status:** Old backups, can be removed

---

## 🔍 Places Where Teleology Engine is Used

### **1. Main API Route** ✅
- **File:** `app/api/unified-philosophical/route.ts`
- **Lines:** 3 (import), 29-37 (analysis), 44 (pass to wizard)
- **Usage:** 
  - Imports `analyzeTeleology` from shared `@/lib/teleologyEngine`
  - Analyzes every user message before processing
  - Passes teleology analysis to the Emotional Wizard System

### **2. Emotional Wizard System** ✅
- **File:** `lib/emotionalWizardSystem.ts`
- **Lines:** 6 (import), 14 (type), 143-158 (usage)
- **Usage:**
  - Accepts `teleologyAnalysis` as optional parameter in `WizardRequest`
  - If not provided, calls `analyzeTeleology` itself
  - Passes teleology analysis to context builder

### **3. Context Builder** ✅
- **File:** `lib/contextBuilder.ts`
- **Lines:** 4 (import), 68 (type), 136-163 (formatting)
- **Usage:**
  - Receives `TeleologyAnalysis` object
  - Formats it into a detailed summary string including:
    - Score, type, manipulation risk
    - Detected phrases
    - Purpose claim (LLM-generated)
    - Neutral causal paraphrase (LLM-generated)
  - Includes this summary in the rich context passed to the language generator

### **4. Advanced Language Generator** ✅
- **File:** `lib/advancedLanguageGenerator.ts`
- **Lines:** 116, 121, 137, 161, 196-207
- **Usage:**
  - Receives teleology analysis in `richContext`
  - Explicitly includes it in the system prompt
  - Instructs the LLM to use teleology analysis in the 3-part response format:
    1. Identify teleology the user is using
    2. Provide causal clarity
    3. Offer clear next steps

---

## 📊 Feature Summary Table

| Feature | Status | Location | Priority | Notes |
|---------|--------|----------|----------|-------|
| Main Chat UI | ✅ Active | `app/page.tsx`, `UnifiedChatBox.tsx` | **CORE** | Production-ready |
| Emotional Wizard | ✅ Active | `lib/emotionalWizardSystem.ts` | **CORE** | Main orchestration |
| Teleology Integration | ✅ Active | Multiple files (see above) | **CORE** | Fully integrated |
| Emotional Analysis | ✅ Active | `lib/emotionalAnalysis.ts` | **CORE** | LLM-based |
| Adequacy Engine | ✅ Active | `lib/emotionalAdequacyEngine.ts` | **CORE** | Spinozistic scoring |
| Conversation Memory | ✅ Active | `lib/conversationMemory.ts` | **CORE** | Session tracking |
| Context Builder | ✅ Active | `lib/contextBuilder.ts` | **CORE** | Uses teleology |
| Language Generator | ✅ Active | `lib/advancedLanguageGenerator.ts` | **CORE** | Uses teleology |
| Session Management | ✅ Active | `lib/sessionManager.ts` | **CORE** | Firebase + localStorage |
| Analytics Dashboard | ✅ Active | `app/components/UnifiedAnalytics.tsx` | **CORE** | Real-time metrics |
| RAG System | 🧪 Optional | `lib/ragSystem.ts` | Medium | Not clearly used in main flow |
| TTS | 🧪 Optional | `app/api/tts/route.ts` | Low | External service |
| Training Generator | 🧪 Experimental | `lib/agents/trainingGenerator.ts` | Low | Not integrated |
| Insight Logging | 🧪 Experimental | `app/api/insight/route.ts` | Low | Research endpoint |
| Legacy Features | 📦 Archived | `archive/spino-legacy/` | None | Can be removed |
| Backup Folders | 📦 Old | `backup/` | None | Can be removed |

---

## 🎯 Recommendations

### **Keep (Core System)**
1. ✅ All files in `app/` (except experimental endpoints)
2. ✅ All files in `lib/` that are imported by the main chat flow
3. ✅ Teleology integration (already working well)
4. ✅ Session management and analytics

### **Consider Simplifying**
1. 🧪 RAG system - If not actively used, consider removing or documenting its purpose
2. 🧪 Empowerapy knowledge base - Large file, verify if it's actually used
3. 🧪 Training generator - If not generating training data, can be archived

### **Can Archive/Remove**
1. 📦 `archive/spino-legacy/` - Already archived, can be removed if not needed for reference
2. 📦 `backup/` folders - Old backups, not needed
3. 📦 Unused components (`ClarityMeter.tsx`, `FinalSummary.tsx`)
4. 🧪 Experimental endpoints (`/api/insight`, `/api/minimal`, `/api/hello`) - Keep only if needed for debugging

### **Documentation**
- ✅ Good documentation exists (`README.md`, `SPINO_SYSTEM_MAP.md`, `FINAL_SYSTEM_SUMMARY.md`)
- Consider consolidating or updating if system has evolved

---

## 🔗 Key Dependencies

### **External Services**
- OpenAI API (required for chat, emotional analysis, teleology LLM summaries)
- Claude API (optional, for emotional analysis)
- Firebase (optional, for session persistence)
- ElevenLabs/Azure TTS (optional, for text-to-speech)

### **Shared Modules (Monorepo)**
- `src/lib/teleologyEngine.ts` - Shared teleology analysis engine (used by both SpinO and Honestra)

---

## 📝 Notes

- **Teleology is fully integrated** and working in production (spino-ai.com)
- The system is **well-structured** with clear separation of concerns
- **No vector database** - RAG is local/in-memory
- **Firebase is optional** - localStorage is the primary session storage
- The main chat flow is **production-ready** and actively used
- Legacy features are properly archived and not interfering with the main system

---

**End of Summary**

