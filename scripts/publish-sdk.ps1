# 🐼 Panda Factory - Publish SDK to Public Repo (Windows PowerShell)
# ===================================================================
#
# Este script copia APENAS arquivos públicos do repo privado
# (SAAS) para o repo público (panda-sdk).
#
# Uso: .\scripts\publish-sdk.ps1
#
# Arquivos que NÃO são copiados (ficam privados):
# - js/core/ (PAT, Kill Switch, DRM, Governance)
# - data/secrets/
# - .agent/
# - rust-agent/
# - backend/
# ===================================================================

$ErrorActionPreference = "Stop"

# Configuração
$PRIVATE_REPO = "$env:USERPROFILE\Desktop\CRM"
$PUBLIC_REPO = "$env:USERPROFILE\Desktop\panda-sdk"
$PUBLIC_REMOTE = "git@github.com:LucassVal/panda-sdk.git"

Write-Host "🐼 Panda Factory - SDK Publisher" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

# Verificar se repo público existe
if (-not (Test-Path $PUBLIC_REPO)) {
    Write-Host "📦 Criando repo público..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $PUBLIC_REPO -Force
    Set-Location $PUBLIC_REPO
    git init
    git remote add origin $PUBLIC_REMOTE
}

# Limpar repo público (manter .git)
Write-Host "🧹 Limpando repo público..." -ForegroundColor Yellow
Set-Location $PUBLIC_REPO
Get-ChildItem -Path $PUBLIC_REPO -Exclude ".git" | Remove-Item -Recurse -Force -ErrorAction SilentlyContinue

# Função para copiar com verificação
function Copy-If-Exists {
    param($Source, $Destination)
    if (Test-Path $Source) {
        $destDir = Split-Path $Destination -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }
        Copy-Item $Source $Destination -Force -Recurse
        return $true
    }
    return $false
}

Write-Host "📋 Copiando arquivos públicos..." -ForegroundColor Yellow

# SDK Core (público)
Copy-If-Exists "$PRIVATE_REPO\js\pf.sdk.js" "$PUBLIC_REPO\pf.sdk.js"
Copy-If-Exists "$PRIVATE_REPO\js\pf.bootstrap.js" "$PUBLIC_REPO\pf.bootstrap.js"

# Tentacles (público)
New-Item -ItemType Directory -Path "$PUBLIC_REPO\tentacles" -Force | Out-Null
Copy-If-Exists "$PRIVATE_REPO\js\tentacles\github" "$PUBLIC_REPO\tentacles\github"
Copy-If-Exists "$PRIVATE_REPO\js\tentacles\google" "$PUBLIC_REPO\tentacles\google"
Copy-If-Exists "$PRIVATE_REPO\js\tentacles\social" "$PUBLIC_REPO\tentacles\social"
Copy-If-Exists "$PRIVATE_REPO\js\tentacles\distribution" "$PUBLIC_REPO\tentacles\distribution"
Copy-If-Exists "$PRIVATE_REPO\js\tentacles\brain" "$PUBLIC_REPO\tentacles\brain"
Copy-If-Exists "$PRIVATE_REPO\js\tentacles\trading" "$PUBLIC_REPO\tentacles\trading"

# UI público
New-Item -ItemType Directory -Path "$PUBLIC_REPO\js\ui" -Force | Out-Null
Copy-If-Exists "$PRIVATE_REPO\js\ui\*.js" "$PUBLIC_REPO\js\ui\"

# CSS público
New-Item -ItemType Directory -Path "$PUBLIC_REPO\css" -Force | Out-Null
Copy-If-Exists "$PRIVATE_REPO\css\*.css" "$PUBLIC_REPO\css\"

# HTML público
Copy-If-Exists "$PRIVATE_REPO\index.html" "$PUBLIC_REPO\index.html"
Copy-If-Exists "$PRIVATE_REPO\manifest.json" "$PUBLIC_REPO\manifest.json"

# Docs públicos
New-Item -ItemType Directory -Path "$PUBLIC_REPO\docs" -Force | Out-Null
Copy-If-Exists "$PRIVATE_REPO\docs\PF_SDK_REFERENCE.md" "$PUBLIC_REPO\docs\PF_SDK_REFERENCE.md"
Copy-If-Exists "$PRIVATE_REPO\README.md" "$PUBLIC_REPO\README.md"

# GitHub Actions
New-Item -ItemType Directory -Path "$PUBLIC_REPO\.github\workflows" -Force | Out-Null
Copy-If-Exists "$PRIVATE_REPO\.github\workflows\pages.yml" "$PUBLIC_REPO\.github\workflows\pages.yml"

# Estrutura de dados vazia
New-Item -ItemType Directory -Path "$PUBLIC_REPO\data\users" -Force | Out-Null
New-Item -ItemType Directory -Path "$PUBLIC_REPO\data\projects" -Force | Out-Null
'{"_note": "Public data store"}' | Out-File "$PUBLIC_REPO\data\manifest.json" -Encoding UTF8

Write-Host ""
Write-Host "✅ Arquivos copiados:" -ForegroundColor Green
Get-ChildItem $PUBLIC_REPO -Recurse -File | Select-Object -First 30 | ForEach-Object { Write-Host "  $($_.Name)" }

Write-Host ""
Write-Host "🔒 Arquivos PRIVADOS (não copiados):" -ForegroundColor Red
Write-Host "  - js/core/*           (PAT, Kill Switch, DRM)"
Write-Host "  - rust-agent/*        (Chaves Ed25519)"
Write-Host "  - backend/*           (GAS Backend)"
Write-Host "  - .agent/*            (Codex interno)"
Write-Host "  - data/secrets/*      (Configurações)"

Write-Host ""
Write-Host "📤 Enviando para GitHub..." -ForegroundColor Yellow
Set-Location $PUBLIC_REPO
git add -A
git commit -m "🐼 SDK Update $(Get-Date -Format 'yyyy-MM-dd')" 2>$null
git push origin main 2>$null

Write-Host ""
Write-Host "✅ Publicação concluída!" -ForegroundColor Green
Write-Host "🌐 URL: https://lucassval.github.io/panda-sdk/" -ForegroundColor Cyan
Write-Host ""
