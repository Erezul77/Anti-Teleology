# SpinOAI Repository Organization Script
# This script helps organize your project into separate frontend and backend repositories

Write-Host "SpinOAI Repository Organization" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host ""
Write-Host "Current Setup:" -ForegroundColor Yellow
Write-Host "- Frontend Repository: https://github.com/Erezul77/spinoai-frontend.git"
Write-Host "- Backend Repository: https://github.com/Erezul77/spinoai-backend.git (needs to be created)"
Write-Host ""

Write-Host "Step 1: Create Backend Repository" -ForegroundColor Cyan
Write-Host "1. Go to GitHub.com"
Write-Host "2. Click 'New repository'"
Write-Host "3. Name: spinoai-backend"
Write-Host "4. Description: SpinOAI Backend - Spinoza's Therapeutic AI System"
Write-Host "5. Make it Public"
Write-Host "6. Don't initialize with README (we'll push our own)"
Write-Host ""

$response = Read-Host "Have you created the backend repository? (y/n)"
if ($response -notmatch "^[Yy]$") {
    Write-Host "Please create the backend repository first" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Step 2: Push Frontend Code" -ForegroundColor Cyan
Write-Host "Pushing frontend code to existing repository..."

# Navigate to frontend directory
Set-Location frontend_vercel

# Check if this is a git repository
if (-not (Test-Path ".git")) {
    Write-Host "Initializing git repository in frontend..."
    git init
    git remote add origin https://github.com/Erezul77/spinoai-frontend.git
}

# Add all files
git add .

# Commit changes
git commit -m "Update frontend with domain configuration for spino-ai.com"

# Push to repository
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Frontend code pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "Frontend push failed. Please check your repository access." -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 3: Push Backend Code" -ForegroundColor Cyan
Write-Host "Setting up backend repository..."

# Navigate back to root and then to backend
Set-Location ..
Set-Location backend_render

# Initialize git repository
git init
git remote add origin https://github.com/Erezul77/spinoai-backend.git

# Add all files
git add .

# Commit changes
git commit -m "Initial backend setup with domain configuration for api.spino-ai.com"

# Push to repository
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backend code pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "Backend push failed. Please check your repository access." -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 4: Deployment Configuration" -ForegroundColor Cyan
Write-Host ""

Write-Host "Frontend (Vercel):" -ForegroundColor Yellow
Write-Host "- Connect to: https://github.com/Erezul77/spinoai-frontend.git"
Write-Host "- Build Command: npm run build"
Write-Host "- Output Directory: .next"
Write-Host "- Environment Variable: NEXT_PUBLIC_API_BASE=https://api.spino-ai.com"
Write-Host ""

Write-Host "Backend (Render):" -ForegroundColor Yellow
Write-Host "- Connect to: https://github.com/Erezul77/spinoai-backend.git"
Write-Host "- Build Command: pip install -r requirements.txt"
Write-Host "- Start Command: python app.py"
Write-Host "- Environment Variable: OPENAI_API_KEY=your_key"
Write-Host ""

Write-Host "Step 5: Domain Configuration" -ForegroundColor Cyan
Write-Host ""

Write-Host "DNS Records (in your domain provider):" -ForegroundColor Yellow
Write-Host "A record: @ -> 76.76.19.36"
Write-Host "CNAME: www -> cname.vercel-dns.com"
Write-Host "CNAME: api -> spinoai-backend.onrender.com"
Write-Host ""

Write-Host "Vercel Domains:" -ForegroundColor Yellow
Write-Host "- Add: spino-ai.com"
Write-Host "- Add: www.spino-ai.com"
Write-Host ""

Write-Host "Render Domains:" -ForegroundColor Yellow
Write-Host "- Add: api.spino-ai.com"
Write-Host ""

Write-Host "Repository organization completed!" -ForegroundColor Green
Write-Host "Your SpinOAI project is now properly organized!" -ForegroundColor Green
Write-Host ""
Write-Host "See SEPARATE_REPOS.md for detailed instructions"
Write-Host "Your app will be available at https://spino-ai.com" 