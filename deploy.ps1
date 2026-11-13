# PowerShell Automated Deployment Script for GitHub Pages
param (
    [Parameter(Mandatory=$false)]
    [string]$GithubUsername = "your-github-username"
)

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "🚀 Automated Deployment Script for Computer Science Portfolio" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

# Check if git is installed
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git is not installed or not in PATH. Please install Git first." -ForegroundColor Red
    exit 1
}

# Initialize git repository if not already initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git branch -M main
}

Write-Host "📝 Staging files and creating commit..." -ForegroundColor Yellow
git add .
git commit -m "Deploy CS Portfolio site - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"

if ($GithubUsername -eq "your-github-username") {
    Write-Host ""
    Write-Host "⚠️ Please provide your GitHub username to link repository:" -ForegroundColor Yellow
    $GithubUsername = Read-Host "Enter your GitHub username"
}

$RepoUrl = "https://github.com/$GithubUsername/$GithubUsername.github.io.git"
Write-Host "🔗 Setting remote repository: $RepoUrl" -ForegroundColor Cyan

git remote remove origin 2>$null
git remote add origin $RepoUrl

Write-Host "⬆️ Pushing changes to GitHub main branch..." -ForegroundColor Green
git push -u origin main

Write-Host ""
Write-Host "🎉 SUCCESS! Your portfolio is deploying to GitHub Pages." -ForegroundColor Green
Write-Host "🌐 Your live URL will be: https://$GithubUsername.github.io" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
