# Spino Development Server Starter
# This script ensures you're always in the correct directory

Write-Host "🚀 Starting Spino Development Server..." -ForegroundColor Green

# Get the script's directory (should be SpinOAI-Clean)
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Write-Host "📁 Script directory: $scriptDir" -ForegroundColor Yellow

# Check if we're in the right place
if (Test-Path "$scriptDir\package.json") {
    Write-Host "✅ Found package.json - we're in the right directory!" -ForegroundColor Green
} else {
    Write-Host "❌ No package.json found in current directory!" -ForegroundColor Red
    Write-Host "Make sure you're running this from the SpinOAI-Clean folder" -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found! Please install npm first." -ForegroundColor Red
    exit 1
}

# Kill any existing Node processes on port 3000
Write-Host "🔄 Checking for existing processes on port 3000..." -ForegroundColor Yellow
$existingProcess = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($existingProcess) {
    Write-Host "Found existing process on port 3000, killing it..." -ForegroundColor Yellow
    taskkill /f /im node.exe 2>$null
    Start-Sleep 2
}

# Install dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "🚀 Starting Next.js development server..." -ForegroundColor Green
Write-Host "🌐 Server will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📝 Press Ctrl+C to stop the server" -ForegroundColor Gray

npm run dev
