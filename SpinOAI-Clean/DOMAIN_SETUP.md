# 🌐 Domain Setup Guide: spino-ai.com

## 🎯 Overview
This guide will help you connect your SpinOAI project to your custom domain `spino-ai.com`.

## 📋 Domain Configuration Steps

### **1. Domain Provider Setup**

#### **A. Frontend Domain (spino-ai.com)**
1. **Go to your domain provider** (GoDaddy, Namecheap, etc.)
2. **Add DNS records**:
   ```
   Type: A
   Name: @
   Value: 76.76.19.36 (Vercel's IP)
   
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

#### **B. Backend Domain (api.spino-ai.com)**
1. **Add subdomain DNS record**:
   ```
   Type: CNAME
   Name: api
   Value: spinoai-backend.onrender.com
   ```

### **2. Vercel Configuration**

#### **A. Connect Custom Domain**
1. Go to your Vercel dashboard
2. Select your `spinoai-frontend` project
3. Go to **Settings** → **Domains**
4. Add domain: `spino-ai.com`
5. Add domain: `www.spino-ai.com`
6. Verify DNS records are correct

#### **B. Environment Variables**
Add to Vercel environment variables:
```env
NEXT_PUBLIC_API_BASE=https://api.spino-ai.com
```

### **3. Render Configuration**

#### **A. Custom Domain Setup**
1. Go to your Render dashboard
2. Select your `spinoai-backend` service
3. Go to **Settings** → **Custom Domains**
4. Add domain: `api.spino-ai.com`
5. Configure SSL certificate (Render handles this automatically)

#### **B. Environment Variables**
Ensure these are set in Render:
```env
OPENAI_API_KEY=your_openai_api_key
```

### **4. DNS Verification**

#### **Test Your Setup**
```bash
# Test frontend
curl -I https://spino-ai.com

# Test backend
curl -I https://api.spino-ai.com

# Test API endpoint
curl https://api.spino-ai.com/
```

## 🔧 Configuration Files

### **Frontend (Vercel)**
- ✅ `vercel.json` - Updated with domain configuration
- ✅ `lib/config.ts` - Dynamic API URL configuration
- ✅ `app/components/ChatBox.tsx` - Uses dynamic API URL

### **Backend (Render)**
- ✅ `app.py` - CORS configured for custom domains
- ✅ Environment variables set for production

## 🚀 Deployment Commands

### **Frontend Deployment**
```bash
cd frontend_vercel
npm run build
# Deploy to Vercel (automatic with git push)
```

### **Backend Deployment**
```bash
cd backend_render
# Deploy to Render (automatic with git push)
```

## 📊 Expected URLs

### **Production URLs**
- **Frontend**: https://spino-ai.com
- **Backend API**: https://api.spino-ai.com
- **API Endpoint**: https://api.spino-ai.com/spinozist_reply

### **Development URLs**
- **Frontend**: http://localhost:3000
- **Backend**: https://spinoai-backend.onrender.com

## 🔍 Troubleshooting

### **Common Issues**

1. **DNS Propagation**
   - DNS changes can take 24-48 hours
   - Use `nslookup` or `dig` to check propagation

2. **SSL Certificate Issues**
   - Render/Vercel handle SSL automatically
   - Wait 24 hours for certificate generation

3. **CORS Errors**
   - Ensure CORS origins include your domain
   - Check browser console for specific errors

4. **API Connection Issues**
   - Verify `config.ts` has correct API URL
   - Check environment variables in Vercel

### **Testing Commands**
```bash
# Test DNS resolution
nslookup spino-ai.com
nslookup api.spino-ai.com

# Test SSL certificates
openssl s_client -connect spino-ai.com:443
openssl s_client -connect api.spino-ai.com:443

# Test API functionality
curl -X POST https://api.spino-ai.com/spinozist_reply \
  -H "Content-Type: application/json" \
  -d '{"prompt":"test","deltaP":0.0,"stage":1}'
```

## ✅ Success Checklist

- [ ] DNS records configured correctly
- [ ] Vercel domain connected and verified
- [ ] Render custom domain configured
- [ ] SSL certificates active
- [ ] Frontend loads at https://spino-ai.com
- [ ] Backend responds at https://api.spino-ai.com
- [ ] Chat functionality works with custom domain
- [ ] No CORS errors in browser console

## 🎉 Final Result

Once configured, your app will be accessible at:
- **Main App**: https://spino-ai.com
- **API**: https://api.spino-ai.com

Your SpinOAI therapeutic system will be a professional web application with your custom domain! ✨ 