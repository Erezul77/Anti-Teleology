# 🚨 Project Recovery System Script
# Use this when files are lost or build fails

param(
    [string]$BackupDate = "",
    [string]$FileToRestore = "",
    [switch]$ListBackups = $false,
    [switch]$RestoreAll = $false
)

Write-Host "🚨 Starting Project Recovery System..." -ForegroundColor Red

# 1. List available backups
if ($ListBackups) {
    Write-Host "`n📋 Available Backups:" -ForegroundColor Cyan
    
    # List git backup branches
    Write-Host "Git Backup Branches:" -ForegroundColor Yellow
    git branch -a | Where-Object { $_ -like "*backup*" } | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Green
    }
    
    # List file system backups
    Write-Host "`nFile System Backups:" -ForegroundColor Yellow
    if (Test-Path "backup") {
        Get-ChildItem "backup" -Directory | Where-Object { $_.Name -like "*backup*" } | ForEach-Object {
            Write-Host "  $($_.Name)" -ForegroundColor Green
        }
    } else {
        Write-Host "  No file backups found" -ForegroundColor Red
    }
    
    # List recent commits
    Write-Host "`nRecent Commits:" -ForegroundColor Yellow
    git log --oneline -10 | ForEach-Object {
        Write-Host "  $_" -ForegroundColor Green
    }
    
    return
}

# 2. Restore specific file
if ($FileToRestore -ne "") {
    Write-Host "`n🔧 Restoring file: $FileToRestore" -ForegroundColor Cyan
    
    # Try to restore from git history
    Write-Host "Attempting to restore from git history..." -ForegroundColor Yellow
    git checkout HEAD~1 -- $FileToRestore
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ File restored from git history" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to restore from git history" -ForegroundColor Red
        
        # Try to restore from file backup
        if ($BackupDate -ne "") {
            $backupPath = "backup/lib_backup_$BackupDate/$FileToRestore"
            if (Test-Path $backupPath) {
                Copy-Item $backupPath $FileToRestore
                Write-Host "✅ File restored from backup: $backupPath" -ForegroundColor Green
            } else {
                Write-Host "❌ File not found in backup: $backupPath" -ForegroundColor Red
            }
        }
    }
}

# 3. Restore all files from backup
if ($RestoreAll) {
    if ($BackupDate -eq "") {
        Write-Host "❌ Please specify backup date with -BackupDate parameter" -ForegroundColor Red
        return
    }
    
    Write-Host "`n🔄 Restoring all files from backup: $BackupDate" -ForegroundColor Cyan
    $backupPath = "backup/lib_backup_$BackupDate"
    
    if (Test-Path $backupPath) {
        # Remove current lib directory
        if (Test-Path "lib") {
            Remove-Item "lib" -Recurse -Force
        }
        
        # Restore from backup
        Copy-Item "$backupPath/lib" "lib" -Recurse
        Write-Host "✅ All files restored from backup" -ForegroundColor Green
    } else {
        Write-Host "❌ Backup not found: $backupPath" -ForegroundColor Red
    }
}

# 4. Check critical files
Write-Host "`n📋 Critical Files Status:" -ForegroundColor Cyan
$criticalFiles = @(
    "lib/enhancedRAG.ts",
    "lib/unifiedPhilosophicalSystem.ts",
    "lib/logicEngine.ts",
    "lib/responseEngine.ts",
    "lib/errorHandler.ts",
    "lib/types.ts",
    "lib/generatedTraining.ts",
    "lib/dynamicPromptComposer.ts"
)

$missingFiles = @()
foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "✅ $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "❌ $file (MISSING!)" -ForegroundColor Red
        $missingFiles += $file
    }
}

# 5. Test build after recovery
if ($missingFiles.Count -eq 0) {
    Write-Host "`n🔨 Testing build after recovery..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Build successful after recovery!" -ForegroundColor Green
    } else {
        Write-Host "❌ Build still failing after recovery!" -ForegroundColor Red
    }
} else {
    Write-Host "`n⚠️ Missing files detected. Please restore them first." -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Red
    }
}

# 6. Usage instructions
Write-Host "`n📖 Recovery System Usage:" -ForegroundColor Cyan
Write-Host "  List backups: .\recovery-system.ps1 -ListBackups" -ForegroundColor White
Write-Host "  Restore file: .\recovery-system.ps1 -FileToRestore 'lib/enhancedRAG.ts'" -ForegroundColor White
Write-Host "  Restore all: .\recovery-system.ps1 -RestoreAll -BackupDate '20250805-175856'" -ForegroundColor White
Write-Host "  Restore from git: git checkout [commit-hash] -- [filename]" -ForegroundColor White

Write-Host "`n🛡️ Recovery system ready!" -ForegroundColor Green 