# 🚀 Spino Quick Start Guide

## ⚠️ IMPORTANT: Always Run from the Correct Directory!

**The most common issue is running commands from the wrong directory.**

### ✅ Correct Way:
```bash
cd "SpinOAI-Clean"
npm run dev
```

### ❌ Wrong Way:
```bash
# Don't run from the parent directory!
cd "New integrated project"
npm run dev  # This will fail!
```

## 🛠️ Easy Start Methods

### Method 1: Use the PowerShell Script (Recommended)
```powershell
# Right-click on start-spino.ps1 and "Run with PowerShell"
# OR run from PowerShell:
.\start-spino.ps1
```

### Method 2: Use the Batch File
```cmd
# Double-click start-spino.bat
# OR run from Command Prompt:
start-spino.bat
```

### Method 3: Manual (Always Check Directory First)
```bash
# 1. Navigate to the correct directory
cd "SpinOAI-Clean"

# 2. Verify you're in the right place
dir package.json

# 3. Start the server
npm run dev
```

## 🔍 How to Verify You're in the Right Directory

Look for these files in your current directory:
- ✅ `package.json`
- ✅ `next.config.js`
- ✅ `app/` folder
- ✅ `lib/` folder

If you don't see these files, you're in the wrong directory!

## 🚨 Common Error Messages

### "Could not read package.json"
**Solution:** You're in the wrong directory. Navigate to `SpinOAI-Clean`.

### "ECONNREFUSED" when testing API
**Solution:** The server isn't running. Make sure you started it from the correct directory.

## 📁 Project Structure
```
SpinOAI-Clean/
├── package.json          ← You must be here!
├── next.config.js
├── app/
├── lib/
├── start-spino.ps1      ← Use this script!
└── start-spino.bat      ← Or this batch file!
```

## 🎯 Quick Commands

```bash
# Start development server
.\start-spino.ps1

# Test the API
node test-api.js

# Build the project
npm run build

# Install dependencies
npm install
```

## 🆘 Need Help?

1. **Check your current directory:** `pwd` (PowerShell) or `cd` (Command Prompt)
2. **Look for package.json:** `dir package.json`
3. **Use the start script:** `.\start-spino.ps1`

Remember: **Always run from the SpinOAI-Clean directory!** 🎯
