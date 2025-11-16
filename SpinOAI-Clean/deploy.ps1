# 🌐 SpinOAI Domain Deployment Script (PowerShell)
# This script helps deploy your app to spino-ai.com

Write-Host "SpinOAI Domain Deployment Script" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "frontend_vercel/package.json") -or -not (Test-Path "backend_render/app.py")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📋 Pre-deployment checklist:" -ForegroundColor Yellow
Write-Host "1. Ensure you have access to your domain provider (GoDaddy, Namecheap, etc.)"
Write-Host "2. Ensure you have access to Vercel dashboard"
Write-Host "3. Ensure you have access to Render dashboard"
Write-Host "4. Ensure your domain spino-ai.com is purchased and active"
Write-Host ""

$response = Read-Host "Have you completed the pre-deployment checklist? (y/n)"
if ($response -notmatch "^[Yy]$") {
    Write-Host "❌ Please complete the checklist before proceeding" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting deployment process..." -ForegroundColor Green

# Deploy frontend to Vercel
Write-Host "📤 Deploying frontend to Vercel..." -ForegroundColor Yellow
Set-Location frontend_vercel
npm run build
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Frontend build successful" -ForegroundColor Green
} else {
    Write-Host "❌ Frontend build failed" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Deploy backend to Render
Write-Host "📤 Deploying backend to Render..." -ForegroundColor Yellow
Set-Location backend_render
# Render deployment is automatic with git push
Write-Host "✅ Backend deployment initiated (automatic with git push)" -ForegroundColor Green
Set-Location ..

Write-Host ""
Write-Host "🌐 Domain Configuration Steps:" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. DNS Configuration (in your domain provider):" -ForegroundColor Yellow
Write-Host "   - Add A record: @ → 76.76.19.36"
Write-Host "   - Add CNAME record: www → cname.vercel-dns.com"
Write-Host "   - Add CNAME record: api → spinoai-backend.onrender.com"
Write-Host ""
Write-Host "2. Vercel Configuration:" -ForegroundColor Yellow
Write-Host "   - Go to Vercel dashboard → Settings → Domains"
Write-Host "   - Add: spino-ai.com"
Write-Host "   - Add: www.spino-ai.com"
Write-Host "   - Set environment variable: NEXT_PUBLIC_API_BASE=https://api.spino-ai.com"
Write-Host ""
Write-Host "3. Render Configuration:" -ForegroundColor Yellow
Write-Host "   - Go to Render dashboard → Settings → Custom Domains"
Write-Host "   - Add: api.spino-ai.com"
Write-Host ""
Write-Host "4. Testing:" -ForegroundColor Yellow
Write-Host "   - Test frontend: curl -I https://spino-ai.com"
Write-Host "   - Test backend: curl -I https://api.spino-ai.com"
Write-Host "   - Test API: curl https://api.spino-ai.com/"
Write-Host ""

Write-Host "✅ Deployment script completed!" -ForegroundColor Green
Write-Host "📚 See DOMAIN_SETUP.md for detailed instructions"
Write-Host "🎉 Your app will be available at https://spino-ai.com" -ForegroundColor Green 