> [!CAUTION]
> **🏛️ LEIA ESTE DOC INTEIRO ANTES DE QUALQUER AÇÃO.**
> Leia os docs de referência (§7), execute, e documente o que fez.
> **NUNCA apague conteúdo existente — leia, compreenda e MELHORE.**

# 🐼 PANDA FACTORY — AGENT BOOTSTRAP CONTEXT

> **Cole este texto inteiro no início de qualquer conversa com qualquer AI agent.**
> Última atualização: 2026-02-10

---

## 1. O QUE É O PROJETO

**Panda Factory** é um SaaS de design colaborativo (tipo Figma/Canva) para lojas de móveis planejados.
Stack: React + TLDraw (frontend), Google Apps Script (backend), Rust (agente de segurança).
Owner: Lucas Valério (@LucassVal)

---

## 2. ESTRUTURA DE PASTAS (TAXONOMIA NUMERADA)

```
C:\Users\Lucas Valério\Desktop\Panda Factory\
│
├── 1.core/           → Backend GAS (Google Apps Script) — lógica de negócio
├── 2.system/         → PAT (governance), Kill Switch, DRM, Kernel
├── 3.sdk/            → SDK interno (pf.sdk.js, pf.components.js, pf.ai-core.js)
├── 4.ui/             → UI Legacy (HTML Components, Modules)
├── 5.tentacles/      → Módulos extensíveis (plugins internos)
├── 7.rust-agent/     → Agente Rust Ed25519 (verificação de licença)
├── 8.docs/           → 📄 Documentação técnica (16 docs .md)
├── 9.tools/          → Scripts Python, PowerShell, ferramentas
├── 10.assets/        → Assets, dados, imagens
├── 11.pf-app/        → ⚛️ REACT APP PRINCIPAL (Vite + TLDraw)
│   ├── src/
│   │   ├── App.jsx           → Entry point
│   │   ├── components/       → Todos com prefixo PF (PFCanvas, PFDock, PFStore...)
│   │   ├── hooks/            → useAuth, useGasometer, useHealthStatus...
│   │   ├── services/         → uiContext.js
│   │   └── styles/           → pf.css
│   ├── vite.config.js        → Build output: ../dist/jam/
│   └── package.json
│
├── .github/workflows/ → CI/CD (pages.yml deploya para GitHub Pages)
├── .agent/            → Workflows e contexto para agentes AI
├── dist/jam/          → Build output React (servido pelo GitHub Pages)
├── _archive/          → Arquivos antigos arquivados
├── _backup_pre_numbered/ → Backup antes da reorganização
│
├── README.md          → 📄 Pitch page pública (GitHub)
├── index.html         → Landing page
├── manifest.json      → PWA manifest
└── sw.js              → Service Worker
```

> ⚠️ **NÃO renomeie, mova ou delete NENHUMA pasta numerada sem autorização explícita.**
> ⚠️ **Pastas 6.social/ e 5.design/ foram consolidadas no SDK. Não recriar.**

> [!IMPORTANT]
> **📦 POLÍTICA DE ARCHIVE:** Nada se deleta no Panda Factory. Arquivos obsoletos vão para `_archive/`.
> Backups pré-reorganização ficam em `_backup_pre_numbered/`.
> Ambas as pastas estão **excluídas do `.antigravityignore`** — agentes AI focam apenas em `1.*` a `11.*`.
> Se precisa de um arquivo antigo, busque em `_archive/`. Se precisa da versão pré-reorganização, busque em `_backup_pre_numbered/`.

---

## 3. 🔒 ESTRATÉGIA DUAL REPOSITÓRIO (CRÍTICO)

### Repos

| Remote   | URL                                      | Visibilidade | Conteúdo                      |
| -------- | ---------------------------------------- | ------------ | ----------------------------- |
| `origin` | `github.com/LucassVal/SAAS.git`          | 🔒 Privado   | TUDO — código, secrets, docs  |
| `panda`  | `github.com/LucassVal/Panda-Factory.git` | 🌐 Público   | Só o que `.gitignore` PERMITE |

### REGRAS DE OURO:

1. **SEMPRE push pra `origin` PRIMEIRO, depois pra `panda`**
2. **NUNCA usar `git add -f` em arquivos sensíveis** (8.docs/, .env, 1.core/, etc.)
3. **O `.gitignore` controla o que vai pro público** — NÃO altere sem entender
4. **Se adicionou um arquivo antes do `.gitignore`**, ele continua tracked — use `git rm --cached <arquivo>` para corrigir
5. **Verificar SEMPRE antes de push pro panda:** `git diff --stat origin/main panda/main`

### O QUE É PÚBLICO (vai pro `panda`):

| Item            | Propósito                               |
| --------------- | --------------------------------------- |
| `11.pf-app/`    | Source React (build via GitHub Actions) |
| `dist/jam/`     | Build output para GitHub Pages          |
| `.github/`      | Workflows CI/CD (pages, android, steam) |
| `README.md`     | Pitch page pública                      |
| `index.html`    | Landing page                            |
| `manifest.json` | PWA manifest                            |
| `sw.js`         | Service Worker                          |
| `_config.yml`   | GitHub Pages config                     |
| `.gitignore`    | Regras de filtragem                     |

### O QUE É PRIVADO (`.gitignore` bloqueia do `panda`):

| Item                                 | Conteúdo sensível                      |
| ------------------------------------ | -------------------------------------- |
| `1.core/`                            | Backend GAS (lógica de negócio)        |
| `2.system/`                          | PAT, Kill Switch, DRM, Governance      |
| `3.sdk/`                             | SDK interno proprietário               |
| `4.ui/`                              | UI Legacy (lógica interna)             |
| `5.tentacles/`                       | Módulos extensíveis (plugins)          |
| `7.rust-agent/`                      | Ed25519, chaves privadas               |
| `8.docs/`                            | Documentação técnica interna (16 docs) |
| `9.tools/`                           | Scripts internos                       |
| `10.assets/`                         | Assets e dados internos                |
| `.env`, `.env.*`                     | Credenciais e secrets                  |
| `.agent/`                            | Config do agente AI e workflows        |
| `_archive/`, `_backup_pre_numbered/` | Backups e arquivos arquivados          |
| `scripts/`, `docs/`                  | Legacy                                 |

> ℹ️ **Guardas preventivos no `.gitignore`:** Entradas como `1.gas/`, `5.design/`, `6.social/`, `9.pitchdeck/`, `backend/`, `rust-agent/` são nomes antigos de pastas que não existem mais no disco. Mantidos como proteção caso sejam recriadas por engano.

### `.antigravityignore` (filtro do AI — separado do git)

Arquivo separado que controla o que o **agente AI indexa**. Não tem relação com git. Exclui pastas pesadas desnecessárias para o agente:

| Exclusão                                 | Motivo                              |
| ---------------------------------------- | ----------------------------------- |
| `7.rust-agent/target/`                   | 3000+ arquivos compilados Rust      |
| `8.docs/_consolidated/`                  | Rascunhos consolidados (não é SSoT) |
| `10.assets/data/`                        | JSONs de dados importados           |
| `docs/`                                  | Legacy docs no root                 |
| Fontes (`.woff`, `.ttf`, `.otf`)         | Binários                            |
| Imagens (`.png`, `.jpg`, `.gif`, `.ico`) | Binários                            |

---

## 4. CONVENÇÕES DE NOMENCLATURA

| Tipo             | Padrão                 | Exemplo                          |
| ---------------- | ---------------------- | -------------------------------- |
| Pasta            | `N.kebab-case/`        | `11.pf-app/`, `8.docs/`          |
| Componente React | `PFPascalCase.jsx`     | `PFCanvas.jsx`, `PFStore.jsx`    |
| CSS React        | `PFPascalCase.css`     | `PFCanvas.css`                   |
| JS Core/SDK      | `pf.kebab-case.js`     | `pf.sdk.js`, `pf.ai-core.js`     |
| CSS Legacy       | `pf.kebab-case.css`    | `pf.theme.css`                   |
| HTML Component   | `Comp_PascalCase.html` | `Comp_SettingsModal.html`        |
| Hooks React      | `useCamelCase.js`      | `useAuth.jsx`, `useGasometer.js` |
| Doc técnico      | `PF_SCREAMING_CASE.md` | `PF_MASTER_ARCHITECTURE.md`      |

---

## 5. 🏛️ GOVERNANÇA DOCUMENTAL (Sistema Montesquieu)

> **Regra de Ouro:** Cada tópico tem **um único doc dono (SSoT)**. Os outros fazem **cross-reference**, nunca duplicam.
> Se um tópico aparece em 2+ docs, apenas o SSoT tem conteúdo completo.

### Os 3 Poderes Documentais

#### 🏛️ PODER EXECUTIVO (O que FAZ — implementação)

| Doc                         | Jurisdição                                 | Prioridade    |
| --------------------------- | ------------------------------------------ | ------------- |
| `.agent/CONTEXT.md`         | Bootstrap, regras, nomenclatura, dual repo | 🔴 Ler SEMPRE |
| `PF_MASTER_ARCHITECTURE.md` | Arquitetura técnica completa (201KB)       | 🔴 Ler SEMPRE |
| `PF_FILE_REGISTRY.md`       | Catálogo de 220+ arquivos                  | 🔴 Ler SEMPRE |

#### 📜 PODER LEGISLATIVO (O que DEFINE — leis e regras)

| Doc                              | Jurisdição (SSoT)                         | Prioridade              |
| -------------------------------- | ----------------------------------------- | ----------------------- |
| `PF_ECONOMY_REFERENCE.md`        | Pricing, splits, tiers, PAT policy (94KB) | 🟡 Conforme necessidade |
| `PF_PAT_FOUNDER_CONSTITUTION.md` | 12 Artigos, governance, Red Lines         | 🟡 Conforme necessidade |
| `PF_SECURITY_REFERENCE.md`       | Kill Switch, Ed25519, DRM, Defend         | 🟡 Conforme necessidade |
| `PF_AGENT_CONSTITUTION.md`       | Persona IA, regras do agente              | 🟢 Referência           |

#### ⚖️ PODER JUDICIÁRIO (O que VALIDA — referência e auditoria)

| Doc                        | Jurisdição (SSoT)                       | Prioridade    |
| -------------------------- | --------------------------------------- | ------------- |
| `PF_SDK_REFERENCE.md`      | API contract, módulos, event bus (83KB) | 🔴 Ler SEMPRE |
| `PF_UI_REFERENCE.md`       | Design System, CSS tokens, componentes  | 🔴 Ler SEMPRE |
| `PF_OPENSOURCE_CATALOG.md` | Deps, licenças, compliance              | 🟢 Referência |

#### 📦 SERVIÇOS ESPECIALIZADOS (Jurisdição única)

| Doc                       | Jurisdição (SSoT)             | Prioridade              |
| ------------------------- | ----------------------------- | ----------------------- |
| `PF_BACKEND_REFERENCE.md` | GAS + Firebase backend        | 🟡 Conforme necessidade |
| `PF_GAS_REFERENCE.md`     | Google Apps Script específico | 🟡 Conforme necessidade |
| `PF_GEMINI_REFERENCE.md`  | Gemini AI integration         | 🟡 Conforme necessidade |
| `PF_MCP_REFERENCE.md`     | Model Context Protocol        | 🟡 Conforme necessidade |
| `PF_MEDUSA_REFERENCE.md`  | Distribuição, Store, hooks    | 🟡 Conforme necessidade |
| `PF_P2P_REFERENCE.md`     | Rede P2P, Partner, mining     | 🟡 Conforme necessidade |
| `PF_COLAB_REFERENCE.md`   | Google Colab templates        | 🟢 Referência           |

> ℹ️ `NPM_INSTALL_LIST.md` foi absorvido por `PF_OPENSOURCE_CATALOG.md` (arquivado em `_archive/`).
> ℹ️ `README_PANDA_OFICIAL.md` foi absorvido por `CONTEXT.md` (arquivado em `_archive/`).

### SSoT Matrix — Quem é Dono de Quê

| Tópico                      | SSoT (Único Dono)          | Pode Referenciar      |
| --------------------------- | -------------------------- | --------------------- |
| Governance / 12 Artigos     | `PAT_FOUNDER_CONSTITUTION` | Economy, Master Arch  |
| Kill Switch / Ed25519       | `SECURITY_REFERENCE`       | PAT, Economy, Backend |
| PC Pricing / Splits / Tiers | `ECONOMY_REFERENCE`        | Medusa, P2P           |
| PAT Monetary Policy         | `ECONOMY_REFERENCE`        | PAT Constitution      |
| P2P Splits / Mining         | `P2P_REFERENCE`            | Economy               |
| Store / Medusa Pipeline     | `MEDUSA_REFERENCE`         | Economy, SDK          |
| Folder Structure / Naming   | `CONTEXT.md`               | Master Arch           |
| CSS Tokens / Design         | `UI_REFERENCE`             | SDK                   |
| SDK API / Modules           | `SDK_REFERENCE`            | Master Arch           |
| GAS Backend / Firebase      | `BACKEND_REFERENCE`        | GAS Reference         |
| Google Apps Script          | `GAS_REFERENCE`            | Backend               |
| AI / Gemini Integration     | `GEMINI_REFERENCE`         | SDK, Master Arch      |
| MCP Protocol                | `MCP_REFERENCE`            | Master Arch, Backend  |
| Google Colab Templates      | `COLAB_REFERENCE`          | Gemini                |
| Dependencies / Licenças     | `OPENSOURCE_CATALOG`       | Master Arch, SDK      |
| IA Persona / Agent Rules    | `AGENT_CONSTITUTION`       | CONTEXT.md            |

### 🗺️ Roadmap Unificado 2026 (absorvido de README_PANDA_OFICIAL.md)

| Fase               | Status  | Período  | Foco Principal              |
| ------------------ | ------- | -------- | --------------------------- |
| **0 - Foundation** | ✅ 100% | Jan/2026 | Shell, SDK, GAS Backend     |
| **1 - Dia 1**      | 🚧 98%  | Fev/2026 | Docs, System Design, UI     |
| **2 - Escala**     | ⏳ 10%  | Mar-Abr  | P2P Network, Medusa Store   |
| **3 - Expansão**   | ⏳ 0%   | Q2-Q3    | EdTech, Marketplace, Mobile |

### 🔌 Integrações Suportadas

| Categoria         | Conexões                                       |
| ----------------- | ---------------------------------------------- |
| 💬 **Social**     | WhatsApp, Telegram, Twitter, Instagram, TikTok |
| 📺 **Conteúdo**   | YouTube, Twitch, Spotify                       |
| 💰 **Pagamentos** | Kiwify, Hotmart, Stripe, Pix                   |
| 📈 **Trading**    | cTrader, Binance                               |
| 🎮 **Games**      | Godot, Unity, Steam                            |

### 🚀 Quick Start (SDK)

```javascript
import Panda from "panda-sdk";
await Panda.Brain.chat("Analise meus dados");
await Panda.Social.WhatsApp.send("Olá!");
await Panda.Trading.CTrader.connect({ accountId: 123 });
```

### 🌐 Quick Links

| Plataforma      | Link                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| 📱 **App**      | [lucassval.github.io/Panda-Factory](https://lucassval.github.io/Panda-Factory/) |
| 🔥 **Firebase** | `panda-hook-master` (RTDB Backend)                                              |
| 📧 **GAS**      | [Script Project](https://script.google.com) (ID privado)                        |

---

## 6. COMO RODAR O PROJETO

### 🔧 Desenvolvimento Local (BANCADA)

```powershell
# Só necessário quando mexer em código React (11.pf-app/)
cd "11.pf-app"
npm run dev              # → http://localhost:3001 (hot reload)
```

> **⚠️ `npm run dev` = bancada de trabalho.** Hot reload, testa mudanças ao vivo.
> Se está só editando docs, GAS, SDK ou outros arquivos fora do React, **NÃO precisa rodar.**

### 🚀 Deploy (VITRINE — GitHub Pages)

```powershell
# 1. Build otimizado
npm run build            # → Output em ../dist/jam/

# 2. Commit + Push (SEMPRE origin PRIMEIRO)
git add -A
git commit -m "feat: description"
git push origin main     # → SAAS (privado) PRIMEIRO
git push panda main      # → Panda-Factory (público) DEPOIS
#                          → GitHub Actions faz deploy automático pro Pages
```

> **🌐 Produção:** [lucassval.github.io/Panda-Factory](https://lucassval.github.io/Panda-Factory/)
> Atualiza automaticamente após `git push panda main` via GitHub Actions.

---

## 7. REGRAS PARA O AGENTE

// turbo-all

### 🚀 MODO TURBO-ALL ATIVADO

> **O agente tem autonomia TOTAL para implementar, melhorar e evoluir o projeto.**
> A única trava: **se for REMOVER conteúdo existente, PARE e avise o Lucas com o motivo.**
> Se está apenas **melhorando** (adicionando, refatorando, otimizando) → **continue sem perguntar.**

### ✅ FAÇA (AUTONOMAMENTE):

- Leia `PF_MASTER_ARCHITECTURE.md` antes de qualquer mudança estrutural
- Use prefixo `PF` em todos os novos componentes React
- Use prefixo `pf.` em todos os novos arquivos JS/CSS
- **Commite frequentemente** com mensagens descritivas (turbo-all)
- Teste com `npm run dev` após mudanças no React
- **Pesquise na internet** sempre que precisar — busque as melhores práticas, libs, padrões
- **Seja curioso** — explore soluções melhores, compare abordagens, traga inovação
- **Mantenha os 16 docs de `8.docs/` atualizados** — ao mexer em algo, atualize o doc correspondente
- **Atualize `CONTEXT.md` §9** sempre que houver mudança relevante (roadmap, features, status)
- **Faça commit nos repos corretos** seguindo a Seção 3 (origin primeiro, panda depois)
- **Gere Council Report** ao final de cada bloco de trabalho

### 🔴 GUARDRAIL ÚNICO (TRAVA DE SEGURANÇA):

> **Se for REMOVER/REDUZIR conteúdo existente de QUALQUER arquivo:**
>
> 1. **PARE imediatamente**
> 2. **Informe o Lucas** com o motivo da remoção
> 3. **Só prossiga com aprovação explícita**
>
> Isso NÃO se aplica a refatorações que mantêm a mesma funcionalidade.
> Melhorar, expandir, reorganizar → ✅ PODE.
> Deletar, reduzir, remover → 🛑 PARE E AVISE.

### ❌ NÃO FAÇA:

- **NÃO delete pastas numeradas** (1.core/, 2.system/, etc.)
- **NÃO use `git add -f` em arquivos do .gitignore** sem saber o motivo
- **NÃO push 8.docs/ pro `panda` remote** (é público!)
- **NÃO renomeie pastas** sem parar o dev server primeiro
- **NÃO instale dependências globais** sem perguntar
- **NÃO crie pastas sem número** no root (segue a taxonomia)
- **NÃO altere o .gitignore** sem entender a estratégia dual-repo
- **NÃO remova conteúdo** sem explicar o motivo e ter aprovação

### 🌐 PESQUISA INTERNET (DESBLOQUEADO):

O agente PODE e DEVE pesquisar na internet para:

- Encontrar melhores práticas e padrões de arquitetura
- Verificar documentação de libs e APIs
- Buscar soluções para bugs e problemas
- Comparar abordagens antes de implementar
- Trazer inovações relevantes pro projeto

### 📝 CICLO DE TRABALHO AUTÔNOMO:

```text
1. LER    → Docs de referência (8.docs/) + CONTEXT.md
2. PENSAR → Pesquisar internet se necessário
3. FAZER  → Implementar melhorias (turbo-all)
4. SALVAR → Atualizar docs afetados + README
5. COMMIT → git push origin + panda (Seção 3)
6. REPORT → Gerar Council Report
```

---

## 8. 🏛️ PANDA COUNCIL (ATIVAR AQUI)

> **Cole `/panda-council` ou diga "Ativar Panda Council" para ativar.**
> O Panda Council é self-contained nesta seção — não depende de workflows externos.

### O QUE É

O Panda Council é o **sistema de governança autônoma** para desenvolvimento:

- **SSoT:** `CONTEXT.md` é o bootstrap master (este arquivo)
- **DDD:** Doc-Driven Dev — doc vem ANTES do código
- **Turbo-all:** Commits autônomos em ações TECH e DOC
- **Security Gates:** Bloqueio automático se secrets vazarem

### FASES DO COUNCIL

```text
FASE 0: BOOTSTRAP → Carregar contexto (15 docs hierárquicos)
FASE 1: CLASSIFY  → Classificar comando (TECH/SECURITY/PAT/COMMUNITY/DOC)
FASE 2: EXECUTE   → Implementar seguindo standards + pre-flight checks
FASE 3: REPORT    → Gerar Council Report com compliance check
```

### CLASSIFICATION MATRIX

| Tipo                | Trigger                               | Auto-Approve?          |
| ------------------- | ------------------------------------- | ---------------------- |
| 🛠️ **TECH**         | código, componente, bug, feature, SDK | ✅ turbo-all           |
| 🔐 **SECURITY**     | auth, Ed25519, PAT, secrets           | ❌ Founder confirm     |
| 💰 **PAT/TREASURY** | tokens, transfer, wallet, mint        | ❌ Ed25519 required    |
| 🌐 **COMMUNITY**    | post, social, docs públicos           | ✅ follow constitution |
| 📄 **DOC**          | doc, reference, readme                | ✅ turbo-all           |

### COUNCIL REPORT TEMPLATE

Após cada ação, gerar:

```markdown
## 🐼 PANDA COUNCIL REPORT v4.0

**Timestamp:** [ISO 8601]
**Classification:** [TECH | SECURITY | PAT | COMMUNITY | DOC]
**Status:** [🟢 Stable | 🟡 Attention | 🔴 Blocked]

### 📋 EXECUTION SUMMARY

| Action                     | File   | Status     |
| -------------------------- | ------ | ---------- |
| [Created/Modified/Deleted] | [path] | [✅/🟡/❌] |

### 📚 DOCUMENTATION IMPACT

| Doc Updated | Reason      |
| ----------- | ----------- |
| [PF_*.md]   | [Descrição] |

### ⚖️ GOVERNANCE CHECK

- Constitution Compliance: [✅ Passed / ❌ Violation]
- Security Gate: [✅ Passed / ⚠️ Review required]
- Secrets Scan: [✅ Clean / 🔴 HALT]
```

### GUARDRAILS (Safety Interlocks)

| Guardrail                  | Trigger                       | Action                   |
| -------------------------- | ----------------------------- | ------------------------ |
| **Secrets Exposure**       | Credentials em código público | 🔴 HALT + Alert Founder  |
| **Constitution Violation** | 14 Artigos                    | ⏸️ PAUSE + Confirm       |
| **Treasury Action**        | Qualquer movimento de token   | 🔐 Ed25519 Signature     |
| **PAT Override**           | Tentar modificar regras PAT   | ❌ REJECT (Hardcoded)    |
| **SSoT Violation**         | Duplicar info do README       | ⚠️ Reference, don't copy |

### ATIVAÇÃO

```bash
/panda-council              # Via slash command
"Ativar Panda Council"      # Via invocação direta
```

---

## 9. ESTADO ATUAL (Fev 2026)

- **React App**: v6.5 com TLDraw canvas, multi-window (flexlayout-react)
- **Store**: v3.2 com 12 extensões, em inglês
- **Componentes PF**: 28 componentes JSX com prefixo correto (+ 16 CSS = 44 arquivos)
- **Backend**: GAS com 17 arquivos .gs
- **Rust Agent**: Ed25519 para verificação de licença
- **GitHub Pages**: Ativo em lucassval.github.io/Panda-Factory/
- **Naming Convention**: ✅ Auditada e padronizada (11.pf-app + PF prefix)

---

## 10. 🔑 CREDENCIAIS E MODELO DE ACESSO

> ⚠️ **NÃO commitar ao `panda` remote — este arquivo está no .gitignore.**

### 🏗️ Modelo de 2 Camadas

| Camada       | userType        | DevTools | Founder Dashboard | PAT Council | Descrição                                   |
| ------------ | --------------- | -------- | ----------------- | ----------- | ------------------------------------------- |
| **Founder**  | `founder`       | ✅       | ✅                | ✅          | Acesso total — Lucas (Owner)                |
| **Dev/User** | `dev` / `admin` | ✅       | ❌                | ❌          | DevTools disponível, sem exclusivos Founder |

> **Regra:** DevTools está disponível para **TODOS** os usuários.
> Apenas o Founder Dashboard e PAT Council são exclusivos `isFounder`.

### 🧪 Credenciais de Teste (simples)

| Usuário   | Senha     | Perfil  | O que vê                          |
| --------- | --------- | ------- | --------------------------------- |
| `founder` | `founder` | Founder | Tudo — DevTools + Dashboard + PAT |
| `dev`     | `dev`     | Dev     | DevTools ✅ — Dashboard ❌        |

### 🔐 Credenciais Reais (produção)

| Usuário         | Senha        | Perfil  | Notas                                 |
| --------------- | ------------ | ------- | ------------------------------------- |
| `Lucassvalerio` | `U@g1232025` | Founder | Acesso total + Founder Dashboard (5%) |
| `admin`         | `admin`      | Admin   | Acesso geral, sem Founder Dashboard   |

### 📍 Onde está o login

- **Gate:** `11.pf-app/src/components/PFLoginGate.jsx` (hash-based)
- **Auth Hook:** `11.pf-app/src/hooks/useAuth.jsx` (expõe `isFounder`, `isDev`)
- **Sessão:** `sessionStorage('panda_auth')` + `localStorage('panda_user')`

### 🤖 Nota para browser agents (testes automáticos)

React controlled inputs exigem `nativeInputValueSetter`:

```javascript
const setter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype,
  "value",
).set;
setter.call(input, "founder");
input.dispatchEvent(new Event("input", { bubbles: true }));
```

Usar `value = 'x'` + `dispatchEvent('input')` **NÃO funciona** com controlled inputs.

---

## 11. ⚠️ OBSERVAÇÕES CRÍTICAS PARA AGENTES

### 🔴 Bug de escrita em arquivos JSX

**`App.jsx` e `PFDock.jsx` não persistem edits** feitos via ferramentas de edição padrão (replace_file_content / multi_replace).
As edits parecem aplicar mas **revertem silenciosamente** ao verificar com `git diff` ou `Select-String`.

**Workaround confirmado:** Usar PowerShell para escrever:

```powershell
$f = "c:\Users\Lucas Valério\Desktop\Panda Factory\11.pf-app\src\App.jsx"
$c = Get-Content $f -Raw
$c = $c -replace 'PATTERN', 'REPLACEMENT'
[System.IO.File]::WriteAllText($f, $c)
```

**Arquivos afetados:** `App.jsx`, `PFDock.jsx`
**Arquivos que funcionam normal:** `PFStatusBar.jsx`, todos `.css`, `index.html`

### 🟡 Vite HMR

- Dev server roda em `http://localhost:3001`
- Hot reload funciona bem para CSS e JSX
- Ao renomear pastas, **parar o dev server antes** (senão corrompe cache)

### 🟢 Light Mode

- Classe no body: `body.light-mode` (toggle via header ☀️/🌙)
- **NÃO usar** `body:not(.dark-mode)` como selector — usar `body.light-mode`
- CSS overrides distribuídos em 3 arquivos:
  - `PFDevModePanel.css` → DevMode panel
  - `PFCouncilPanel.css` → Council/PAT panel
  - `pf.css` (final) → FlexLayout, Store, Toolbar, Dock, Catalog, Chat

---

> 🐼 **Quando em dúvida: PERGUNTE ao Lucas antes de agir.**
> Este projeto tem regras de segurança estritas. Melhor perguntar do que quebrar.
