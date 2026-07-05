# Build browser bundle and zip for itch.io HTML embed (base path ./).
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

$version = (Get-Content package.json | ConvertFrom-Json).version
$releaseDir = Join-Path $Root "release"
$distDir = Join-Path $Root "dist"
$outZip = Join-Path $releaseDir "warp-monkeys-browser-v$version.zip"

New-Item -ItemType Directory -Force -Path $releaseDir | Out-Null

# itch HTML must use relative asset paths (not /warp-monkeys/).
npm run build
if (-not (Test-Path $distDir)) {
  throw "dist/ missing after build"
}

Copy-Item -Force (Join-Path $Root "playtest.html") (Join-Path $distDir "playtest.html")

if (Test-Path $outZip) { Remove-Item $outZip -Force }
Compress-Archive -Path (Join-Path $distDir "*") -DestinationPath $outZip -Force

Write-Host "Wrote $outZip ($((Get-Item $outZip).Length) bytes)"
Write-Host "itch.io: Kind=HTML, Main file=index.html, Viewport 800x600 (see docs/ITCH_PASTE_READY.md)"
