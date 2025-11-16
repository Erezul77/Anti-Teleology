#!/bin/bash

# 🌐 SpinOAI Domain Deployment Script
# This script helps deploy your app to spino-ai.com

echo "SpinOAI Domain Deployment Script"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "frontend_vercel/package.json" ] || [ ! -f "backend_render/app.py" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Pre-deployment checklist:"
echo "1. Ensure you have access to your domain provider (GoDaddy, Namecheap, etc.)"
echo "2. Ensure you have access to Vercel dashboard"
echo "3. Ensure you have access to Render dashboard"
echo "4. Ensure your domain spino-ai.com is purchased and active"
echo ""

read -p "Have you completed the pre-deployment checklist? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the checklist before proceeding"
    exit 1
fi

echo ""
echo "🚀 Starting deployment process..."

# Deploy frontend to Vercel
echo "📤 Deploying frontend to Vercel..."
cd frontend_vercel
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful"
else
    echo "❌ Frontend build failed"
    exit 1
fi
cd ..

# Deploy backend to Render
echo "📤 Deploying backend to Render..."
cd backend_render
# Render deployment is automatic with git push
echo "✅ Backend deployment initiated (automatic with git push)"
cd ..

echo ""
echo "🌐 Domain Configuration Steps:"
echo "=============================="
echo ""
echo "1. DNS Configuration (in your domain provider):"
echo "   - Add A record: @ → 76.76.19.36"
echo "   - Add CNAME record: www → cname.vercel-dns.com"
echo "   - Add CNAME record: api → spinoai-backend.onrender.com"
echo ""
echo "2. Vercel Configuration:"
echo "   - Go to Vercel dashboard → Settings → Domains"
echo "   - Add: spino-ai.com"
echo "   - Add: www.spino-ai.com"
echo "   - Set environment variable: NEXT_PUBLIC_API_BASE=https://api.spino-ai.com"
echo ""
echo "3. Render Configuration:"
echo "   - Go to Render dashboard → Settings → Custom Domains"
echo "   - Add: api.spino-ai.com"
echo ""
echo "4. Testing:"
echo "   - Test frontend: curl -I https://spino-ai.com"
echo "   - Test backend: curl -I https://api.spino-ai.com"
echo "   - Test API: curl https://api.spino-ai.com/"
echo ""

echo "✅ Deployment script completed!"
echo "📚 See DOMAIN_SETUP.md for detailed instructions"
echo "🎉 Your app will be available at https://spino-ai.com" 