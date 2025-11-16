# 🛡️ Project Backup System Script
# Run this before making any major changes

param(
    [string]$Description = "backup",
    [switch]$CreateBackupBranch = $true,
    [switch]$TestBuild = $true
)

Write-Host "Starting Project Backup System..." -ForegroundColor Green

# 1. Get current timestamp
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupName = "backup-$timestamp-$Description"

Write-Host "Timestamp: $timestamp" -ForegroundColor Yellow
Write-Host "Backup Name: $backupName" -ForegroundColor Yellow

# 2. Check git status
Write-Host "`nChecking Git Status..." -ForegroundColor Cyan
git status

# 3. Add all changes
Write-Host "`nAdding all changes..." -ForegroundColor Cyan
git add .

# 4. Commit current state
Write-Host "`nCommitting current state..." -ForegroundColor Cyan
$commitMessage = "Backup: $Description - $timestamp"
git commit -m $commitMessage

# 5. Push to remote
Write-Host "`nPushing to remote..." -ForegroundColor Cyan
git push

# 6. Create backup branch if requested
if ($CreateBackupBranch) {
    Write-Host "`nCreating backup branch..." -ForegroundColor Cyan
    git checkout -b $backupName
    git push origin $backupName
    git checkout main
    Write-Host "Backup branch created: $backupName" -ForegroundColor Green
}

# 7. Create file system backup
Write-Host "`nCreating file system backup..." -ForegroundColor Cyan
$backupDir = "backup/lib_backup_$timestamp"
if (Test-Path "lib") {
    New-Item -ItemType Directory -Path $backupDir -Force
    Copy-Item -Path "lib" -Destination $backupDir -Recurse
    Write-Host "File backup created: $backupDir" -ForegroundColor Green
}

# 8. Test build if requested
if ($TestBuild) {
    Write-Host "`nTesting build..." -ForegroundColor Cyan
    npm run build
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Build successful!" -ForegroundColor Green
    } else {
        Write-Host "Build failed!" -ForegroundColor Red
    }
}

# 9. Document backup
Write-Host "`nDocumenting backup..." -ForegroundColor Cyan
$buildStatus = if ($TestBuild) { "Tested" } else { "Skipped" }
$backupLog = @"
## Backup Created: $timestamp
- Description: $Description
- Git Branch: $backupName
- File Backup: $backupDir
- Build Status: $buildStatus

"@

Add-Content -Path "PROJECT_HISTORY.md" -Value $backupLog

# 10. Display critical files
Write-Host "`nCritical Files Status:" -ForegroundColor Cyan
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

foreach ($file in $criticalFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length
        Write-Host "OK: $file ($size bytes)" -ForegroundColor Green
    } else {
        Write-Host "MISSING: $file" -ForegroundColor Red
    }
}

# 11. Summary
Write-Host "`nBackup Summary:" -ForegroundColor Green
Write-Host "Git commit: $commitMessage" -ForegroundColor Green
if ($CreateBackupBranch) {
    Write-Host "Backup branch: $backupName" -ForegroundColor Green
}
Write-Host "File backup: $backupDir" -ForegroundColor Green
if ($TestBuild) {
    Write-Host "Build tested" -ForegroundColor Green
}
Write-Host "Documentation updated" -ForegroundColor Green

Write-Host "`nBackup complete! You can now make changes safely." -ForegroundColor Green 