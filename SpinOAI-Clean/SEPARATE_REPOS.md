# 🔄 Separate Repository Setup Guide

## 🎯 Overview
Your SpinOAI project needs to be organized into two separate GitHub repositories for proper deployment.

## 📁 Repository Structure

### **Frontend Repository** (`spinoai-frontend`)
**URL**: https://github.com/Erezul77/spinoai-frontend.git
**Deployment**: Vercel
**Domain**: spino-ai.com

**Contents**:
```
frontend_vercel/
├── app/
│   ├── components/
│   │   ├── ChatBox.tsx
│   │   └── ChatMessage.tsx
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── config.ts
│   └── firebaseConfig.ts
├── src/
│   └── saveSession.ts
├── public/
├── package.json
├── vercel.json
└── README.md
```

### **Backend Repository** (`spinoai-backend`)
**URL**: https://github.com/Erezul77/spinoai-backend.git
**Deployment**: Render
**Domain**: api.spino-ai.com

**Contents**:
```
backend_render/
├── app.py
├── philosopher_engine/
│   ├── __init__.py
│   └── generate_spinozist_reply.py
├── requirements.txt
├── test_spinozist.py
└── README.md
```

## 🚀 Setup Steps

### **Step 1: Create Backend Repository**

1. **Create new repository on GitHub**:
   - Name: `spinoai-backend`
   - URL: https://github.com/Erezul77/spinoai-backend.git

2. **Clone and setup backend**:
   ```bash
   git clone https://github.com/Erezul77/spinoai-backend.git
   cd spinoai-backend
   ```

3. **Copy backend files**:
   ```bash
   # Copy all backend_render contents to the new repo
   cp -r ../SpinOAI-Clean/backend_render/* .
   ```

4. **Push backend code**:
   ```bash
   git add .
   git commit -m "Initial backend setup with domain configuration"
   git push origin main
   ```

### **Step 2: Update Frontend Repository**

1. **Navigate to frontend directory**:
   ```bash
   cd ../SpinOAI-Clean/frontend_vercel
   ```

2. **Update remote origin** (if needed):
   ```bash
   git remote set-url origin https://github.com/Erezul77/spinoai-frontend.git
   ```

3. **Push frontend code**:
   ```bash
   git add .
   git commit -m "Update frontend with domain configuration"
   git push origin main
   ```

## 🔧 Deployment Configuration

### **Frontend (Vercel)**
- **Repository**: spinoai-frontend
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Environment Variables**:
  ```
  NEXT_PUBLIC_API_BASE=https://api.spino-ai.com
  ```

### **Backend (Render)**
- **Repository**: spinoai-backend
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `python app.py`
- **Environment Variables**:
  ```
  OPENAI_API_KEY=your_openai_api_key
  ```

## 🌐 Domain Configuration

### **DNS Records** (in your domain provider):
```
A record: @ → 76.76.19.36 (Vercel)
CNAME: www → cname.vercel-dns.com
CNAME: api → spinoai-backend.onrender.com
```

### **Vercel Configuration**:
- Add domain: `spino-ai.com`
- Add domain: `www.spino-ai.com`

### **Render Configuration**:
- Add custom domain: `api.spino-ai.com`

## 📊 Expected URLs

### **Production**:
- **Frontend**: https://spino-ai.com
- **Backend API**: https://api.spino-ai.com
- **API Endpoint**: https://api.spino-ai.com/spinozist_reply

### **Development**:
- **Frontend**: http://localhost:3000
- **Backend**: https://spinoai-backend.onrender.com

## ✅ Success Checklist

- [ ] Backend repository created and populated
- [ ] Frontend repository updated
- [ ] Both repositories pushed to GitHub
- [ ] Vercel connected to frontend repository
- [ ] Render connected to backend repository
- [ ] DNS records configured
- [ ] Custom domains added to deployments
- [ ] Environment variables set
- [ ] Both deployments working correctly

## 🎉 Final Result

Once completed, you'll have:
- **Clean separation** of frontend and backend code
- **Independent deployments** on Vercel and Render
- **Professional domain** setup at spino-ai.com
- **Scalable architecture** for future development

Your SpinOAI therapeutic system will be properly organized and deployed! ✨ 