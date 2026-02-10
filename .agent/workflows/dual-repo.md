---
description: How to commit and push changes correctly using the dual repo strategy
---

# 🐼 Dual Repo Git Workflow

## Architecture

```
LOCAL (Desktop/Panda Factory)
    │
    ├── git push origin main   → SAAS (PRIVATE) — ALL code
    │                            github.com/LucassVal/SAAS
    │
    └── git push panda main    → Panda-Factory (PUBLIC) — filtered by .gitignore
                                 github.com/LucassVal/Panda-Factory
                                 → GitHub Actions builds 11.jam/ → deploys dist/jam/
                                 → Site: lucassval.github.io/Panda-Factory/
```

## What Goes Where

| Remote   | Repo          | Visibility | Contains                                                        |
| -------- | ------------- | ---------- | --------------------------------------------------------------- |
| `origin` | SAAS          | 🔒 Private | EVERYTHING — all source code, secrets, docs                     |
| `panda`  | Panda-Factory | 🌐 Public  | Only what `.gitignore` ALLOWS (11.jam/, dist/, README.md, etc.) |

## ⚠️ RULES — READ BEFORE EVERY PUSH

1. **ALWAYS push to `origin` (SAAS) first** — this is the source of truth
2. **Push to `panda` only for deploy** — .gitignore filters sensitive files
3. **NEVER force-push to `origin`** — only to `panda` when cleaning history
4. **Check .gitignore before adding new folders** — any new numbered folder must be in .gitignore

## Sensitive Folders (NEVER go to panda)

These are in `.gitignore` and excluded from Panda-Factory:

```
1.core/     — GAS backend, PAT, DRM
2.system/   — Core kernel, governance
3.sdk/      — Proprietary SDK
4.ui/       — Legacy UI components
5.tentacles/— Internal tentacles
7.rust-agent/— Ed25519 keys, Rust agent
8.docs/     — Internal technical docs
9.tools/    — Internal tools
10.assets/  — Private data/assets
_archive/   — Legacy archives
_backup_pre_numbered/ — Old backups
.agent/     — Agent config (this file!)
```

## Public Files (GO to panda)

```
11.jam/     — JAM React UI source (needed for Actions build)
dist/jam/   — Built output for GitHub Pages
.github/    — CI/CD workflows
README.md   — Public pitch page
index.html  — Landing page
manifest.json — PWA config
sw.js       — Service Worker
_config.yml — GitHub Pages config
.gitignore  — Filter rules
```

## Step-by-Step: Normal Commit

```powershell
# 1. Stage and commit
git add -A
git commit -m "feat: description of changes"

# 2. Push to PRIVATE (always first!)
git push origin main

# 3. Push to PUBLIC (deploy)
git push panda main
```

## Step-by-Step: After Adding New Folder

```powershell
# 1. Add folder to .gitignore FIRST if it's sensitive
echo "new-folder/" >> .gitignore

# 2. Then commit and push normally
```

## Emergency: Sensitive Files Leaked

```powershell
# 1. Update .gitignore with correct paths
# 2. Remove from git cache
git rm -r --cached <sensitive-folder>/

# 3. Commit
git commit -m "🔒 SECURITY: remove sensitive files"

# 4. Force-push to panda (overwrites public history)
git push panda main --force

# 5. Normal push to origin
git push origin main
```

## GitHub Pages Deploy Flow

```
Push to panda → GitHub Actions triggers →
  npm ci (11.jam/) → npm run build →
  Upload dist/jam/ → Deploy to GitHub Pages →
  Live at lucassval.github.io/Panda-Factory/
```
