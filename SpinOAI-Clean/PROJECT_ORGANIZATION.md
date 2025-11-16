# SpiñO Project Organization Guide

## 🏗️ Project Structure

```
SpinOAI-Clean/
├── 📁 app/                    # Next.js app directory
├── 📁 lib/                    # Core library files
│   ├── 📁 spino/             # SpiñO AI core system
│   │   ├── emotionalCausalPatterns.ts    # ECPU system (9.8KB)
│   │   ├── enhancedRAG.ts               # RAG with emotional intelligence (7.1KB)
│   │   ├── dynamicPromptComposer.ts     # Dynamic prompt generation (2.3KB)
│   │   ├── errorHandler.ts              # Error handling system (2.5KB)
│   │   ├── logicEngine.ts               # Spinozistic logic processing (4.9KB)
│   │   ├── responseEngine.ts            # Response generation (6.0KB)
│   │   └── generatedTraining.ts         # Training data system (8.7KB)
│   ├── 📁 noesis/            # Noesis system
│   │   └── enhancedRAG.ts              # Noesis RAG (33KB)
│   ├── 📁 agents/            # AI agents
│   │   └── trainingGenerator.ts        # Training generator (10KB)
│   └── types.ts              # Shared TypeScript interfaces
├── 📁 src/                   # Source files
├── 📁 public/                # Public assets
├── 📁 scripts/               # Utility scripts
├── 📁 backup/                # Backup system
└── 📄 Configuration files
```

## 🔧 Critical Files (NEVER DELETE)

### Core SpiñO System (`lib/spino/`)
- **`emotionalCausalPatterns.ts`** - ECPU emotional intelligence system
- **`enhancedRAG.ts`** - Main RAG with emotional analysis
- **`dynamicPromptComposer.ts`** - Dynamic prompt generation
- **`errorHandler.ts`** - Error handling and fallbacks
- **`logicEngine.ts`** - Spinozistic logic processing
- **`responseEngine.ts`** - Response generation system
- **`generatedTraining.ts`** - Training data management

### Supporting Systems
- **`lib/types.ts`** - Shared TypeScript interfaces
- **`lib/noesis/enhancedRAG.ts`** - Noesis system
- **`lib/agents/trainingGenerator.ts`** - Training generator

## 🛡️ Backup System

### Automatic Backups
- **Location**: `backup/` directory
- **Format**: `lib_backup_YYYYMMDD_HHMMSS/`
- **Frequency**: Before major changes

### Manual Backup Commands
```powershell
# Create backup
copy lib backup\lib_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')

# Restore from backup
copy backup\lib_backup_YYYYMMDD_HHMMSS\* lib\ -Recurse
```

## 🚨 Safety Protocols

### Before Making Changes
1. **Create backup**: `copy lib backup\lib_backup_$(Get-Date -Format 'yyyyMMdd_HHmmss')`
2. **Verify current state**: `dir lib\spino`
3. **Check file sizes**: Ensure all files are properly saved

### After Making Changes
1. **Verify file sizes**: All files should be >1KB
2. **Test compilation**: `npm run build`
3. **Commit changes**: `git add . && git commit -m "description"`
4. **Deploy**: `git push`

## 📊 File Size Verification

### Expected File Sizes
- `emotionalCausalPatterns.ts`: ~9.8KB (258 lines)
- `enhancedRAG.ts`: ~7.1KB (184 lines)
- `generatedTraining.ts`: ~8.7KB (240 lines)
- `responseEngine.ts`: ~6.0KB (190 lines)
- `logicEngine.ts`: ~4.9KB (156 lines)
- `errorHandler.ts`: ~2.5KB (78 lines)
- `dynamicPromptComposer.ts`: ~2.3KB (75 lines)

### Warning Signs
- Files <1KB = Likely corrupted/empty
- Missing "Keep changes?" prompt = File not saved
- Git shows "nothing to commit" = Files not saved to disk

## 🔍 Troubleshooting

### File Not Saving
1. Check if "Keep changes?" prompt appears
2. Verify file size with `dir lib\spino`
3. Check file content with `Get-Content lib\spino\filename.ts`
4. If file is empty, recreate it

### Missing Files
1. Check `backup/` directory for recent backups
2. Restore from backup: `copy backup\lib_backup_YYYYMMDD_HHMMSS\* lib\ -Recurse`
3. If no backup, recreate files from this documentation

### Git Issues
1. Check if files are actually saved: `dir lib\spino`
2. Verify file sizes match expected values
3. If files are missing, restore from backup first

## 📋 Maintenance Checklist

### Daily
- [ ] Verify all files exist and have correct sizes
- [ ] Test system functionality
- [ ] Check for any error logs

### Weekly
- [ ] Create full backup
- [ ] Review and update documentation
- [ ] Check for unused files

### Monthly
- [ ] Audit project structure
- [ ] Update backup system
- [ ] Review security settings

## 🎯 Key Principles

1. **NEVER delete files from `lib/spino/`** without backup
2. **ALWAYS verify file sizes** after creation/modification
3. **CREATE backups** before major changes
4. **TEST thoroughly** before deployment
5. **DOCUMENT everything** for future reference

## 🚀 Deployment Checklist

- [ ] All files exist and have correct sizes
- [ ] No TypeScript compilation errors
- [ ] All tests pass
- [ ] Backup created
- [ ] Changes committed to git
- [ ] Deployed to Vercel
- [ ] Live system tested

---

**Last Updated**: August 5, 2025
**Version**: 1.0
**Maintainer**: Erez Ashkenazi 