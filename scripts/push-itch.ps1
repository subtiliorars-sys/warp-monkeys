# Package + push to itch.io via Butler when BUTLER_API_KEY is set.
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$version = (Get-Content package.json | ConvertFrom-Json).version
$zip = Join-Path $Root "release/warp-monkeys-browser-v$version.zip"
$target = "subtiliorars/jimmythehat-codemonkeys-warp-division:html"

& (Join-Path $Root "scripts/package-itchio.ps1")

if (-not $env:BUTLER_API_KEY) {
  $keyScript = @'
import keytar from "keytar";
const k = await keytar.getPassword("fleet-automation", "itch-butler-key");
if (k) process.stdout.write(k.trim());
'@
  $faRoot = "C:\Users\hrmread\MeniscusMaximus\tools\fleet-automation"
  if (Test-Path $faRoot) {
    Push-Location $faRoot
    $fromKeychain = (node --input-type=module -e $keyScript 2>$null).Trim()
    Pop-Location
    if ($fromKeychain) { $env:BUTLER_API_KEY = $fromKeychain }
  }
}

if (-not $env:BUTLER_API_KEY) {
  Write-Host ""
  Write-Host "BUTLER_API_KEY not set — zip is ready for manual upload." -ForegroundColor Yellow
  Write-Host "1. Create project (first time): docs/ITCH_PASTE_READY.md"
  Write-Host "2. Dashboard -> Uploads -> $zip -> Play in browser"
  Write-Host ""
  Write-Host "For Butler: get a wharf key at https://itch.io/user/settings/api-keys"
  exit 0
}

$butler = Get-Command butler -ErrorAction SilentlyContinue
if (-not $butler) {
  $mmButler = "C:\Users\hrmread\MeniscusMaximus\tools\fleet-automation\bin\butler.exe"
  if (Test-Path $mmButler) { $butler = Get-Item $mmButler }
}
if (-not $butler) {
  Write-Host "Butler CLI not on PATH. Install: https://itch.io/docs/butler/" -ForegroundColor Yellow
  Write-Host "Manual zip: $zip"
  exit 1
}

$butlerPath = if ($butler -is [System.Management.Automation.ApplicationInfo]) { $butler.Source } else { $butler.FullName }

Write-Host "Pushing to $target ..."
& $butlerPath push $zip $target
& $butlerPath status $target
Write-Host "Done. Verify: https://subtiliorars.itch.io/jimmythehat-codemonkeys-warp-division"
