$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

Copy-Item -Force (Join-Path $Root "playtest.html") (Join-Path $Root "dist\playtest.html") -ErrorAction SilentlyContinue

$files = @("index.html", "playtest.html")
foreach ($f in $files) {
  $path = Join-Path $Root $f
  if (-not (Test-Path $path)) { throw "Missing $f" }
  $html = Get-Content $path -Raw
  if ($html -notmatch '<!DOCTYPE html>') { throw "$f missing doctype" }
  if ($html -notmatch '<html') { throw "$f missing html tag" }
  Write-Host "OK $f"
}

Write-Host "HTML validation passed"
