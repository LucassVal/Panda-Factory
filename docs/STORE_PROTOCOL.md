# 🛒 Panda Fabrics - Protocolo Agent Store

> **Padrão de Distribuição e Segurança de Módulos**

---

## 📦 Estrutura do Módulo (Package)

Cada módulo é um pacote `.zip` ou repositório contendo um manifesto obrigatório.

### `manifest.json` (Exemplo)

```json
{
  "id": "com.developer.trader-bot",
  "version": "1.0.0",
  "name": "Trader Pro AI",
  "description": "Bot de trading com análise de sentimento e gráficos.",
  "author": {
    "name": "AlphaDev",
    "contact": "support@alphadev.com"
  },
  "permissions": [
    "DRIVE_READ",
    "EXTERNAL_API: https://api.binance.com",
    "GPU_ACCESS"
  ],
  "price": {
    "module": 0, // Grátis para baixar
    "energy_fee": 1 // +1 PC/min taxa para o Dev (Revenue Share)
  },
  "type": "EXTENSION", // APP, EXTENSION, LIBRARY
  "ai_capabilities": {
    // Se for extensão para IA
    "functions": ["search_db", "analyze_chart"],
    "description": "Permite que a IA leia gráficos de velas (Candles)."
  },
  "entrypoint": "main.gs",
  "frontend": "index.html"
}
```

### Tipos de Módulos

1. **App (SaaS):** Aplicação completa com UI para o usuário final (ex: CRM, Trader Dashboard).
2. **Library (Code):** Bibliotecas para outros devs usarem (ex: MathUtils, PDFParser).
3. **Extension (AI Skill):** **Ferramentas para a IA usar.**
   - _Exemplo:_ Usuário baixa a extensão "Spotify Control".
   - _Efeito:_ Agora a IA do usuário sabe pausar música ou criar playlists.
   - _Antigravity-like:_ A IA ganha "superpoderes" baixando extensões.

---

## 🛡️ Modelo de Segurança

### 1. Para o Usuário (Consumidor)

- **Sandbox (JEA):** O módulo só acessa o que está declarado em `permissions`. O `ActiveCode.gs` do usuário bloqueia chamadas não autorizadas.
- **Assinatura Digital:** Todo módulo na loja é assinado criptograficamente pela Panda Fabrics. Se o código for alterado localmente sem re-assinatura, o Core alerta "Módulo Modificado - Sem Garantia".
- **Code Audit:** Módulos oficiais passam por auditoria automatizada (SAST) em busca de exfiltração de dados maliciosa.

### 2. Para o Desenvolvedor (Criador)

- **Propriedade Intelectual (Obfuscation):**
  - O código GAS pode ser entregue minificado/ofuscado se o Dev desejar proteção de lógica.
- **Segurança de Segredos (Vault):**
  - Chaves de API do Dev (ex: chave da Binance paga pelo Dev) NUNCA vão no código.
  - Usam o `PandaVault`: O script chama `Vault.get('DEV_KEY')` que é injetado em tempo de execução pelo servidor Panda, sem persistir no GAS do usuário.
- **Integridade:** Garantia que o usuário está rodando a versão exata que o Dev publicou (via Hash verification).

---

### 4. Open Registry (Descentralizado)

Seguindo o padrão **Open VSX**, permitimos lojas alternativas e instalação direta.

- **Direct URL:** Instalar via link (GitHub/Gist).
  - _Exemplo:_ `panda install https://github.com/user/plugin.zip`
- **Federated Stores:** Empresas podem ter sua própria "loja interna" (Private Registry).
  > **Conceito:** Uma empresa cria um `registry.json` próprio e aponta o Panda Core para ele.
  >
  > - _Caso de Uso:_ "AgroCorp Store" contendo apenas plugins aprovados para seus agrônomos, sem acesso à loja pública.
  > - _Benefício:_ Controle total de compliance e segurança para B2B.

---

## 🔄 Fluxo de Instalação (One-Click & URL)

1.  **Store:** Clique em "Instalar" na loja oficial.
2.  **URL (Sideload):** Cole o link do manifesto `.json` ou repositório.
3.  **Injection:** Core baixa, verifica assinatura (se houver) e injeta.
4.  **Activation:** Módulo ativo no menu.

---

## 💰 Revenue Share (Energy)

Se o Dev quiser monetizar:

- Usuário paga pelos Tokens/Energia ($PC).
- **Smart Split:** Do valor gasto, X% vai para o Panda (Infra) e Y% vai para o Dev (Criador do Módulo).
- Tudo registrado no Ledger transparente.
