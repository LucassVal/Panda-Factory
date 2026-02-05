#!/bin/bash
# ==========================================
# 🐼 Panda Factory - Publish SDK to Public Repo
# ==========================================
# 
# Este script copia APENAS arquivos públicos do repo privado
# (SAAS) para o repo público (panda-sdk).
#
# Uso: ./scripts/publish-sdk.sh
#
# Arquivos que NÃO são copiados (ficam privados):
# - js/core/ (PAT, Kill Switch, DRM, Governance)
# - data/secrets/
# - .agent/
# - rust-agent/
# - backend/
# ==========================================

set -e

# Configuração
PRIVATE_REPO="$HOME/Desktop/CRM"
PUBLIC_REPO="$HOME/Desktop/panda-sdk"
PUBLIC_REMOTE="git@github.com:LucassVal/panda-sdk.git"

echo "🐼 Panda Factory - SDK Publisher"
echo "================================="

# Verificar se repo público existe
if [ ! -d "$PUBLIC_REPO" ]; then
    echo "📦 Clonando repo público..."
    git clone "$PUBLIC_REMOTE" "$PUBLIC_REPO" || {
        echo "❌ Repo não existe. Criando..."
        mkdir -p "$PUBLIC_REPO"
        cd "$PUBLIC_REPO"
        git init
        git remote add origin "$PUBLIC_REMOTE"
    }
fi

# Limpar repo público (manter .git)
echo "🧹 Limpando repo público..."
cd "$PUBLIC_REPO"
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# Copiar arquivos públicos
echo "📋 Copiando arquivos públicos..."

# SDK Core (público)
cp "$PRIVATE_REPO/js/pf.sdk.js" "$PUBLIC_REPO/" 2>/dev/null || true
cp "$PRIVATE_REPO/js/pf.bootstrap.js" "$PUBLIC_REPO/" 2>/dev/null || true

# Tentacles (público)
mkdir -p "$PUBLIC_REPO/tentacles"
cp -r "$PRIVATE_REPO/js/tentacles/github" "$PUBLIC_REPO/tentacles/" 2>/dev/null || true
cp -r "$PRIVATE_REPO/js/tentacles/google" "$PUBLIC_REPO/tentacles/" 2>/dev/null || true
cp -r "$PRIVATE_REPO/js/tentacles/social" "$PUBLIC_REPO/tentacles/" 2>/dev/null || true
cp -r "$PRIVATE_REPO/js/tentacles/distribution" "$PUBLIC_REPO/tentacles/" 2>/dev/null || true
cp -r "$PRIVATE_REPO/js/tentacles/brain" "$PUBLIC_REPO/tentacles/" 2>/dev/null || true
cp -r "$PRIVATE_REPO/js/tentacles/trading" "$PUBLIC_REPO/tentacles/" 2>/dev/null || true

# UI público (sem secrets)
mkdir -p "$PUBLIC_REPO/js/ui"
cp "$PRIVATE_REPO/js/ui/"*.js "$PUBLIC_REPO/js/ui/" 2>/dev/null || true

# CSS público
mkdir -p "$PUBLIC_REPO/css"
cp "$PRIVATE_REPO/css/"*.css "$PUBLIC_REPO/css/" 2>/dev/null || true

# HTML público
cp "$PRIVATE_REPO/index.html" "$PUBLIC_REPO/" 2>/dev/null || true
cp "$PRIVATE_REPO/manifest.json" "$PUBLIC_REPO/" 2>/dev/null || true

# Docs públicos (sem PANDA.md que é interno)
mkdir -p "$PUBLIC_REPO/docs"
cp "$PRIVATE_REPO/docs/PF_SDK_REFERENCE.md" "$PUBLIC_REPO/docs/" 2>/dev/null || true
cp "$PRIVATE_REPO/README.md" "$PUBLIC_REPO/" 2>/dev/null || true

# GitHub Actions públicos
mkdir -p "$PUBLIC_REPO/.github/workflows"
cp "$PRIVATE_REPO/.github/workflows/pages.yml" "$PUBLIC_REPO/.github/workflows/" 2>/dev/null || true

# Criar estrutura de dados vazia
mkdir -p "$PUBLIC_REPO/data/users"
mkdir -p "$PUBLIC_REPO/data/projects"
echo '{"_note": "Public data store"}' > "$PUBLIC_REPO/data/manifest.json"

# Gerar lista do que FOI copiado
echo ""
echo "✅ Arquivos copiados:"
find "$PUBLIC_REPO" -type f ! -path '*/.git/*' | head -30

# Gerar lista do que NÃO foi copiado
echo ""
echo "🔒 Arquivos PRIVADOS (não copiados):"
echo "  - js/core/*           (PAT, Kill Switch, DRM)"
echo "  - rust-agent/*        (Chaves Ed25519)"
echo "  - backend/*           (GAS Backend)"
echo "  - .agent/*            (Codex interno)"
echo "  - data/secrets/*      (Configurações)"

# Commit e push
echo ""
echo "📤 Enviando para GitHub..."
cd "$PUBLIC_REPO"
git add -A
git commit -m "🐼 SDK Update $(date +%Y-%m-%d)" || echo "Nada para commitar"
git push origin main || git push -u origin main

echo ""
echo "✅ Publicação concluída!"
echo "🌐 URL: https://lucassval.github.io/panda-sdk/"
echo ""
