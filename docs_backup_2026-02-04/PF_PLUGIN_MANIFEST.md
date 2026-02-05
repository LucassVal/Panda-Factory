# Plugin Manifest Specification (plugin.json)

## Visão Geral

Todo plugin Panda **DEVE** incluir um arquivo `plugin.json` na raiz. Este manifesto define:

- Identidade do plugin
- Permissões necessárias
- Ponto de entrada
- Hooks de integração

---

## Estrutura Completa

```json
{
  "id": "com.vendor.plugin-name",
  "name": "Plugin Display Name",
  "version": "1.0.0",
  "description": "Descrição curta do plugin",
  "author": {
    "name": "Developer Name",
    "email": "dev@example.com",
    "url": "https://example.com"
  },
  "type": "game/wasm | app/js | connector/js | tool/mcp | widget/html",
  "entryPoint": "main.wasm | main.js | index.html",
  "icon": "icon.png",
  "permissions": [
    "auth.read",
    "wallet.read",
    "wallet.pay",
    "storage.read",
    "storage.write",
    "ui.window",
    "ui.menu",
    "bridge.mcp",
    "bridge.wasm"
  ],
  "hooks": {
    "mainMenu": true,
    "contextMenu": false,
    "appDock": true,
    "store": true,
    "settingsPanel": false
  },
  "api": {
    "minVersion": "1.0.0",
    "maxVersion": "2.0.0"
  },
  "sandbox": {
    "mode": "iframe | worker | direct",
    "allowNetwork": true,
    "allowStorage": true
  }
}
```

---

## Campos Obrigatórios

| Campo        | Tipo   | Descrição                                      |
| ------------ | ------ | ---------------------------------------------- |
| `id`         | string | Identificador único (formato: com.vendor.name) |
| `name`       | string | Nome de exibição                               |
| `version`    | string | Versão semântica (1.0.0)                       |
| `type`       | enum   | Tipo do plugin                                 |
| `entryPoint` | string | Arquivo de entrada                             |

---

## Tipos de Plugin

| Type           | Entry Point | Sandbox    | Descrição                  |
| -------------- | ----------- | ---------- | -------------------------- |
| `game/wasm`    | .wasm       | WebWorker  | Jogos (Godot, Unity, Bevy) |
| `app/js`       | .js         | iframe     | Apps JavaScript            |
| `connector/js` | .js         | direct     | Conectores (Medusa, Steam) |
| `tool/mcp`     | server URL  | MCP bridge | Ferramentas MCP            |
| `widget/html`  | .html       | iframe     | Widgets UI                 |

---

## Permissões

| Permission      | Descrição               | Risco    |
| --------------- | ----------------------- | -------- |
| `auth.read`     | Ler dados do usuário    | 🟢 Baixo |
| `wallet.read`   | Ver saldo               | 🟢 Baixo |
| `wallet.pay`    | Solicitar pagamentos    | 🟡 Médio |
| `storage.read`  | Ler dados salvos        | 🟢 Baixo |
| `storage.write` | Salvar dados            | 🟡 Médio |
| `ui.window`     | Abrir janelas           | 🟢 Baixo |
| `ui.menu`       | Adicionar itens ao menu | 🟢 Baixo |
| `bridge.mcp`    | Conectar servidores MCP | 🟡 Médio |
| `bridge.wasm`   | Carregar módulos Wasm   | 🔴 Alto  |

---

## Hooks Disponíveis

| Hook            | Descrição                                 |
| --------------- | ----------------------------------------- |
| `mainMenu`      | Aparece no menu principal do Panda        |
| `contextMenu`   | Aparece no menu de contexto (right-click) |
| `appDock`       | Aparece no AppDock (barra lateral)        |
| `store`         | Listado na Panda Store                    |
| `settingsPanel` | Tem painel em Configurações               |

---

## Exemplo: Jogo Godot

```json
{
  "id": "com.devX.super-panda-run",
  "name": "Super Panda Run",
  "version": "1.0.0",
  "description": "Jogo de plataforma feito em Godot",
  "author": { "name": "DevX", "email": "devx@email.com" },
  "type": "game/wasm",
  "entryPoint": "game.wasm",
  "icon": "icon.png",
  "permissions": ["wallet.read", "wallet.pay", "storage.write"],
  "hooks": { "mainMenu": true, "store": true },
  "api": { "minVersion": "1.0.0" },
  "sandbox": { "mode": "worker" }
}
```

---

## Exemplo: Connector Steam

```json
{
  "id": "com.panda.steam-connector",
  "name": "Steam Library",
  "version": "1.0.0",
  "type": "connector/js",
  "entryPoint": "steam-connector.js",
  "permissions": ["auth.read", "ui.window"],
  "hooks": { "store": true },
  "api": { "minVersion": "1.0.0" },
  "sandbox": { "mode": "direct", "allowNetwork": true }
}
```

---

## Validação

O Panda SDK **rejeita** plugins que:

- Não têm `id`, `name`, `version`, `type`, `entryPoint`
- Pedem permissões não declaradas
- Têm `api.minVersion` maior que a versão atual do SDK

---

## Cross-Reference

- Ver [PF_SDK_REFERENCE.md](./PF_SDK_REFERENCE.md) para API completa
- Ver [PF_MASTER_ARCHITECTURE.md](./PF_MASTER_ARCHITECTURE.md) §4 para arquitetura de plugins
