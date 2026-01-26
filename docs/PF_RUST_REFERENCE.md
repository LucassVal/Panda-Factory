# 🦀 PF_RUST_REFERENCE - Panda Rust Agent

> **Versão:** 1.0.0 | **Status:** Planejado | **Atualizado:** 2026-01-26

---

## 📋 Índice

1. [Visão Geral](#1-visão-geral)
2. [Arquitetura](#2-arquitetura)
3. [Módulos Planejados](#3-módulos-planejados)
4. [MCP Server](#4-mcp-server)
5. [Integração Firebase](#5-integração-firebase)
6. [Distribuição](#6-distribuição)

---

## 1. Visão Geral

O **Rust Agent** é o "corpo físico" do Panda Factory no PC do usuário. Responsável por:

- 🖥️ **Hardware Bridge:** Acesso a GPU, files, DLLs
- 🧠 **MCP Server:** Tools para IAs (Gemini, Claude, etc)
- 🔥 **Firebase Direct:** Conexão direta sem CORS
- 🔒 **Segurança:** Chaves ficam locais, nunca no browser

### 1.1 Por que Rust?

| Critério            |   Rust    | Node/Python |  Electron   |
| ------------------- | :-------: | :---------: | :---------: |
| **Performance**     |  ⭐⭐⭐   |     ⭐      |    ⭐⭐     |
| **Tamanho binário** |   ~5MB    |    ~50MB    |   ~150MB    |
| **Sem runtime**     |    ✅     |   ❌ Node   | ❌ Chromium |
| **Memory safety**   |    ✅     |     ⚠️      |     ⚠️      |
| **GPU (CUDA/ROCm)** | ✅ Nativo | ⚠️ Binding  |     ❌      |

---

## 2. Arquitetura

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    RUST AGENT + FIREBASE DIRETO                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  BROWSER                    RUST AGENT                   CLOUD      │
│  ┌──────────────┐          ┌──────────────┐          ┌───────────┐ │
│  │ React UI     │◀────────▶│ Tauri        │─────────▶│ Firebase  │ │
│  │ TLDraw       │  IPC     │ WebView      │  REST    │ RTDB      │ │
│  │ LocalStorage │          │              │          │           │ │
│  └──────────────┘          │ MCP Server   │          └───────────┘ │
│                            │ GPU Module   │                │       │
│                            │ File Bridge  │                ▼       │
│                            └──────────────┘          ┌───────────┐ │
│                                   │                  │ GAS       │ │
│                                   └─────────────────▶│ (billing) │ │
│                                                      └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Módulos Planejados

### 3.1 Core Modules

| Módulo          | Crate     | Função              | Prioridade |
| --------------- | --------- | ------------------- | :--------: |
| **pf_core**     | -         | Bootstrap, config   |  🔴 Alta   |
| **pf_mcp**      | `rmcp`    | MCP Server para IAs |  🔴 Alta   |
| **pf_firebase** | `reqwest` | Firebase REST       |  🔴 Alta   |
| **pf_tauri**    | `tauri`   | WebView UI          |  🟡 Média  |

### 3.2 Extension Modules

| Módulo             | Crate           | Função               | Prioridade |
| ------------------ | --------------- | -------------------- | :--------: |
| **pf_gpu**         | `cudarc`/`wgpu` | CUDA/WebGPU          |  🟡 Média  |
| **pf_files**       | `std::fs`       | File operations      |  🟡 Média  |
| **pf_translator**  | `nllb` (ONNX)   | Tradução offline     |  🟡 Média  |
| **pf_whisper**     | `whisper-rs`    | Speech-to-Text local |  🟡 Média  |
| **pf_antigravity** | `tauri`+chrome  | IDE embarcada        |  🔴 Alta   |
| **pf_dll**         | `libloading`    | DLL bridge (MT4/5)   |  🟢 Baixa  |
| **pf_automation**  | `rdev`/`enigo`  | Mouse/keyboard       |  🟢 Baixa  |
| **pf_rig**         | `rig`           | Multi-provider IA    |  🟢 Baixa  |

### 3.3 Antigravity Manager

> ⚠️ **Questão de Arquitetura:** Como lidar com usuários que já têm Antigravity instalado?

| Cenário                         | Estratégia                              |
| ------------------------------- | --------------------------------------- |
| Usuário **NÃO** tem Antigravity | Panda Agent instala embarcado (WebView) |
| Usuário **JÁ** tem Antigravity  | Panda detecta e oferece escolha         |
| **Conta Founder** pré-logada    | Usa token compartilhado via API         |
| **BYOL** (Bring Your Own Login) | Usuário usa própria conta Google        |

**Implementação planejada:**

```rust
// pf_antigravity/src/lib.rs
pub struct AntigravityManager {
    embedded: Option<TauriWebView>,  // Antigravity embarcado
    external_path: Option<PathBuf>,  // Antigravity externo detectado
    use_embedded: bool,              // Qual usar
}

impl AntigravityManager {
    pub fn detect_external() -> Option<PathBuf> {
        // Windows: %LOCALAPPDATA%\Google\Antigravity
        // macOS: ~/Library/Application Support/Antigravity
        // Linux: ~/.config/antigravity
        todo!()
    }

    pub fn inject_founder_token(&mut self, token: &str) -> Result<()> {
        // Injeta token da conta Founder para quota compartilhada
        todo!()
    }
}
```

---

## 4. MCP Server

O Rust Agent expõe **Tools** que IAs podem invocar via MCP:

```rust
// Exemplo: pf_mcp/src/tools.rs
pub enum McpTool {
    // Filesystem
    FsRead { path: String },
    FsWrite { path: String, content: String },
    FsList { directory: String },

    // GPU
    GpuCheck,
    GpuProcess { model: String, input: Vec<f32> },

    // Automation
    MouseMove { x: i32, y: i32 },
    KeyboardType { text: String },
    ScreenCapture { region: Option<Rect> },
}
```

---

## 5. Integração Firebase

### 5.1 Por que Firebase Direto?

- **Sem CORS:** Rust não tem restrição de origem
- **Seguro:** Token fica no PC, não no browser
- **Offline:** Queue local + sync depois
- **Rápido:** Conexão direta, sem intermediários

### 5.2 Implementação Planejada

```rust
// pf_firebase/src/lib.rs
use reqwest::Client;

pub struct FirebaseClient {
    client: Client,
    database_url: String,
    auth_token: Option<String>,
}

impl FirebaseClient {
    pub async fn write_status(&self, user_id: &str, online: bool) -> Result<()> {
        let url = format!("{}/pf_cells/{}/status.json", self.database_url, user_id);

        self.client.put(&url)
            .json(&serde_json::json!({
                "online": online,
                "lastSeen": chrono::Utc::now().timestamp_millis(),
                "rustAgent": { "connected": true }
            }))
            .send().await?;

        Ok(())
    }
}
```

---

## 6. Distribuição

### 6.1 Objetivo de Tamanho

| Target          | Tamanho | Técnicas                      |
| --------------- | ------- | ----------------------------- |
| **Windows x64** | ~5MB    | `strip`, `LTO`, `opt-level=z` |
| **Linux x64**   | ~4MB    | `musl` static                 |
| **macOS arm64** | ~4MB    | Universal binary              |

### 6.2 Cargo.toml Otimizado

```toml
[profile.release]
opt-level = "z"      # Otimiza tamanho
lto = true           # Link-time optimization
codegen-units = 1    # Melhor otimização
panic = "abort"      # Sem unwind
strip = true         # Remove símbolos
```

### 6.3 Instalação

```text
📦 DISTRIBUIÇÃO PLANEJADA

├── Windows: panda-agent.exe (~5MB)
│   └── Instalador: panda-setup.msi
├── Linux: panda-agent (~4MB)
│   └── AppImage ou .deb
└── macOS: PandaAgent.app (~4MB)
    └── DMG assinado
```

---

## 7. Roadmap

| Fase   | Entregas               | Prazo    |
| ------ | ---------------------- | -------- |
| **P1** | MCP básico + Firebase  | Sprint 3 |
| **P2** | Tauri WebView + GPU    | Sprint 4 |
| **P3** | DLL Bridge + Automação | Sprint 5 |

---

## 8. Referências

- [PF_MASTER_ARCHITECTURE.md §5.1](PF_MASTER_ARCHITECTURE.md) - Pilar Rust
- [PF_FIREBASE_REFERENCE.md](PF_FIREBASE_REFERENCE.md) - Firebase
- [MCP Specification](https://modelcontextprotocol.io/)
- [Tauri Documentation](https://tauri.app/)

---

> 📖 **Versão:** 1.0.0 | **Status:** Planejado
