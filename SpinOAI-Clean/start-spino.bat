@echo off
echo 🚀 Starting Spino Development Server...
echo.

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
echo 📁 Script directory: %SCRIPT_DIR%

REM Check if package.json exists
if exist "%SCRIPT_DIR%package.json" (
    echo ✅ Found package.json - we're in the right directory!
) else (
    echo ❌ No package.json found in current directory!
    echo 💡 Make sure you're running this from the SpinOAI-Clean folder
    pause
    exit /b 1
)

REM Kill any existing Node processes on port 3000
echo 🔄 Checking for existing processes on port 3000...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo ⚠️  Found existing process on port 3000, killing it...
    taskkill /f /im node.exe >nul 2>&1
    timeout /t 2 >nul
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the development server
echo 🚀 Starting Next.js development server...
echo 🌐 Server will be available at: http://localhost:3000
echo 📝 Press Ctrl+C to stop the server
echo.

npm run dev
