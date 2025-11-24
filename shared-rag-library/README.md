# 🧠 Shared RAG Library

## 🎯 Overview

This is a **shared library** containing the complete EnhancedRAG system with Empowerapy integration. It's designed to be used by both the **Spino** and **Noesis-net** projects, providing:

- **Complete RAG system** with Spinozistic philosophy
- **Empowerapy emotional transformation** capabilities
- **Shared knowledge base** for both projects
- **Unified interfaces** and data structures

## 🏗️ Architecture

```
shared-rag-library/
├── src/
│   ├── enhancedRAG.ts          # Core RAG system
│   ├── empowerapy/             # Empowerapy integration
│   │   └── empowerapyKnowledge.ts
│   └── index.ts               # Main exports
├── package.json                # Dependencies
├── tsconfig.json              # TypeScript config
└── README.md                  # This file
```

## 🚀 Usage

### **From Spino Project**

```typescript
// Import the shared library
import { EnhancedRAG, EMPOWERAPY_KNOWLEDGE_BASE } from '../shared-rag-library/src'

// Use EnhancedRAG system
const rag = EnhancedRAG.getInstance()
await rag.initialize()

// Query with Empowerapy insights
const response = await rag.query({
  question: "I'm afraid of losing my job",
  maxResults: 5
})
```

### **From Noesis Project**

```typescript
// Import the shared library
import { EnhancedRAG, EMPOWERAPY_KNOWLEDGE_BASE } from '../shared-rag-library/src'

// Use EnhancedRAG system
const rag = EnhancedRAG.getInstance()
await rag.initialize()

// Query with Empowerapy insights
const response = await rag.query({
  question: "I feel ashamed of my failure",
  maxResults: 5
})
```

## 📚 What's Included

### **1. EnhancedRAG System**
- Complete RAG functionality
- Spinozistic affect analysis
- Emotional context analysis
- Causal chain identification
- Comprehensive response generation

### **2. Empowerapy Integration**
- **5 Core Emotions**: Fear, Anger, Shame, Envy, Sadness
- **6 Therapeutic Practices**: Guided exercises for transformation
- **5 Training Dialogues**: Real coaching conversation examples
- **RAG Index**: Pattern matching for emotional queries

### **3. Spinozistic Knowledge**
- Core ontology (Substance, Mode, Idea, etc.)
- Philosophical propositions and definitions
- Causal chains and emotional mappings
- Adequacy scoring and analysis

## 🔧 Setup

### **1. Install Dependencies**
```bash
cd shared-rag-library
npm install
```

### **2. Build the Library**
```bash
npm run build
```

### **3. Import in Projects**
Both projects can now import from the shared library using relative paths.

## 📁 File Structure

### **Core Files**
- **`enhancedRAG.ts`** - Main RAG system with all functionality
- **`empowerapy/empowerapyKnowledge.ts`** - Complete Empowerapy dataset
- **`index.ts`** - Main export file for easy importing

### **Exports**
- **`EnhancedRAG`** - Main RAG class
- **`EMPOWERAPY_KNOWLEDGE_BASE`** - Complete Empowerapy data
- **All interfaces and types** for TypeScript support

## 🔄 Integration Benefits

### **For Spino**
- ✅ **Complete independence** with own RAG system
- ✅ **Empowerapy emotional coaching** capabilities
- ✅ **No dependency** on Noesis-net
- ✅ **Full control** over AI responses

### **For Noesis**
- ✅ **Keeps existing functionality** intact
- ✅ **Enhanced with Empowerapy** insights
- ✅ **Shared knowledge base** with Spino
- ✅ **No breaking changes**

### **For Development**
- ✅ **Single source of truth** for RAG system
- ✅ **Easy maintenance** and updates
- ✅ **Consistent behavior** across projects
- ✅ **Shared improvements** benefit both

## 🧪 Testing

### **Test the Library**
```bash
cd shared-rag-library
npm run build
```

### **Test Integration**
```typescript
// Test import
import { EnhancedRAG } from '../shared-rag-library/src'
console.log('✅ Shared library imported successfully')

// Test initialization
const rag = EnhancedRAG.getInstance()
console.log('✅ EnhancedRAG instance created')
```

## 🔮 Future Enhancements

### **Planned Features**
1. **Advanced emotional pattern recognition**
2. **Personalized therapeutic recommendations**
3. **Progress tracking across sessions**
4. **Advanced Spinozistic analysis**

### **Easy Updates**
- **Update once** in shared library
- **Both projects** automatically get improvements
- **No duplication** of code or effort

## 🤝 Support

### **Documentation**
- This README provides comprehensive usage details
- Code comments explain key functionality
- TypeScript interfaces provide type safety

### **Troubleshooting**
- Check import paths are correct
- Ensure TypeScript compilation succeeds
- Verify all dependencies are installed

---

**🎉 Shared Library Ready!** Both Spino and Noesis projects can now use the same powerful RAG system with Empowerapy integration.
