param(
  [string]$RepoName = "startup-ideas-index-clean",
  [ValidateSet("private","public")]
  [string]$Visibility = "private"
)
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) {
  Write-Host "GitHub CLI (gh) not found. Install from https://cli.github.com/" -ForegroundColor Yellow
  exit 1
}
gh repo create $RepoName --$Visibility --confirm
git init
git add .
git commit -m "Initial commit: Startup Ideas Index deploy kit"
git branch -M main
$login = (gh api user --jq ".login")
git remote add origin "https://github.com/$login/$RepoName.git"
git push -u origin main
Write-Host "Done. Repo: https://github.com/$login/$RepoName"
