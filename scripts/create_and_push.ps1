<#
Create and push this project to GitHub using GitHub CLI (gh).

IMPORTANT: This script does NOT authenticate for you. You must run
`gh auth login` interactively before `gh repo create`, or run the
commands step-by-step and authenticate when prompted.

Run: Open PowerShell in the repo root and run as administrator if needed:
    .\scripts\create_and_push.ps1 -RepoName "studio-main" -Visibility public

If you prefer not to use `gh`, follow the manual steps in the README.
#>

param(
    [string]$RepoName = "studio-main",
    [ValidateSet('public','private')]
    [string]$Visibility = 'public'
)

Write-Host "Preparing repository files..."

if (-not (Test-Path .git)) {
    git init
    Write-Host "Initialized git repository."
} else {
    Write-Host ".git already exists, skipping git init."
}

if (-not (Test-Path .gitignore)) {
@"
node_modules
.next
dist
.env
.vscode
npm-debug.log
yarn-error.log
"@ > .gitignore
    Write-Host "Created .gitignore"
} else {
    Write-Host ".gitignore exists, skipping creation."
}

git add .
git commit -m "chore: initial commit" --allow-empty

Write-Host "Ensure GitHub CLI (gh) is installed and you are logged in."
Write-Host "If not logged in, run: gh auth login"

try {
    gh auth status -h github.com | Out-Null
} catch {
    Write-Host "gh not authenticated or not installed. Run 'gh auth login' and rerun this script." -ForegroundColor Yellow
    exit 1
}

Write-Host "Creating repository on GitHub: $RepoName (visibility: $Visibility)"
gh repo create $RepoName --$Visibility --source=. --remote=origin --push

Write-Host "Repository create/push finished. Check GitHub to confirm."
Write-Host "Next: connect this repo to Vercel (see scripts/vercel-setup.md) or run 'vercel --prod' if you use Vercel CLI."
