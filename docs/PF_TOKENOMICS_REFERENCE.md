# 💰 PF_TOKENOMICS_REFERENCE - Ecossistema Panda Coin

> **Versão:** 2.0.0 | **Fonte:** PF_MASTER_ARCHITECTURE.md §9

---

## 9. Ecossistema: Tokenomics & Monetização

> **Filosofia:** "O Token é Energia. Quem produz, ganha. Quem consome, paga. O Fundador recebe eternamente."

### 9.1. Estrutura de Valor do Panda Coin (PC)

O PC é **Energy Credit** lastrado em custo computacional real, não especulativo.

#### A. Fórmula Base (Piso Inviolável)

```text
Preço_Base = Custo_Cloud_Médio × 2.5
Exemplo: $0.10/hora × 2.5 = $0.25/hora ≈ 1000 PC
```

#### B. Split de Receita (Transações)

> **NOVO SPLIT (v1.1):** Mínimos hardcoded: Fundo ≥25%, Ops ≥15%

| Destino               | Store/Compute | P2P Off-chain (Pre) | P2P On-Chain |
| --------------------- | ------------- | ------------------- | ------------ |
| **Dev/Host**          | 52%           | 95%                 | 95%          |
| **Fundo Incentivo**   | 25%           | 1%                  | 1%           |
| **Panda Operacional** | 15%           | 4%                  | 1%           |
| **Founder (Lucas)**   | 5%            | 0%                  | 0%           |
| **Gateway/GAS**       | 3%            | 0%                  | 3%           |

> **Nota - Lógica de Distribuição P2P (Hardcoded):**
> A taxa total flutua entre **5% (Base)** e **10% (Teto)**. O Host tem blindagem mínima de 90%.
>
> **1. A Base Imutável (3% + 1% + 1% = 5%):**
>
> - **3% Slot Fixo:** Reservado para Gas/Gateway. **Na fase Off-chain (sem Gas), esses 3% revertem integralmente para o Panda Ops.**
> - **1% Fundo Incentivo:** Mínimo hardcoded.
> - **1% Panda Ops:** Mínimo hardcoded.
> - _Resumo Pré-Chain:_ 4% Ops + 1% Fundo. (Host 95%)
> - _Resumo Pós-Chain:_ 1% Ops + 1% Fundo + 3% Gas. (Host 95%)
>
> **2. O Teto Ajustável (Até 10%):**
>
> - O DAO pode aumentar as taxas de Ops e Fundo em até **2.5% adicionais cada** (de 1% para máx 3.5%).
> - _Cenário Máximo:_ 3% Gas + 3.5% Ops + 3.5% Fundo = 10%. (Host 90%).

---

### 9.2. Treasury Backing (Reservas & Lastro) 🏦

O Panda Coin é lastreado em ativos reais para garantir solvência e confiança:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    TREASURY - ARQUITETURA DE LASTRO                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  PAXG (Ouro Tokenizado) - LASTRO PRIMÁRIO 🥇                           │
│  ├── Proporção: ~70% das reservas                                      │
│  ├── Função: Lastro de VALOR do futuro Panda Coin on-chain             │
│  ├── Blockchain: Ethereum (ERC-20) / Solana (Wrapped)                  │
│  └── Razão: Ouro é reserva de valor milenar, proteção contra inflação  │
│                                                                         │
│  USDC (Dólar Tokenizado) - LIQUIDEZ & SOLVÊNCIA 💵                      │
│  ├── Proporção: ~30% das reservas                                      │
│  ├── Função: Garantir SAQUES imediatos em fiat                         │
│  ├── Blockchain: Solana (nativo) / Ethereum                           │
│  └── Razão: Estabilidade e liquidez instantânea                        │
│                                                                         │
│  AUDITORIA ON-CHAIN - SNAPSHOTS DIÁRIOS 📊                            │
│  ├── Frequência: 1x ao dia (custo ~$0.01/dia = $0.30/mês)              │
│  ├── Blockchain: Solana (taxas baixas)                                 │
│  ├── Conteúdo: Hash do balanço total + timestamp                       │
│  └── Verificador: Qualquer pessoa pode auditar via explorer            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### A. Health Score (Pontuação de Saúde do Treasury)

O Health Score é exibido no Header e calculado dinamicamente:

```javascript
// Cálculo do Health Score (0-100%)
function calculateHealthScore(treasury) {
  const weights = {
    reserves: 0.4, // Reservas totais vs supply circulante
    runway: 0.25, // Meses de operação garantidos
    diversification: 0.2, // Distribuição PAXG/USDC/Ops
    liquidity: 0.15, // Capacidade de saque imediato
  };

  const scores = {
    reserves: Math.min(
      100,
      (treasury.totalReserves / treasury.circulatingSupply) * 100,
    ),
    runway: Math.min(100, (treasury.runwayMonths / 12) * 100),
    diversification: calculateDiversificationScore(treasury.breakdown),
    liquidity: Math.min(
      100,
      (treasury.usdc / treasury.monthlyWithdrawals) * 33,
    ),
  };

  return Object.entries(weights).reduce(
    (total, [key, weight]) => total + scores[key] * weight,
    0,
  );
}
```

#### B. Indicadores do Treasury Dashboard

| Métrica             | Fórmula                 | Meta Saudável |
| ------------------- | ----------------------- | ------------- |
| **Backing Ratio**   | Reservas / Supply       | ≥ 100%        |
| **Runway**          | Reservas / Custo Mensal | ≥ 12 meses    |
| **PAXG Ratio**      | PAXG / Total Reservas   | 60-80%        |
| **Liquidity Ratio** | USDC / Saques (30d)     | ≥ 3x          |
| **Snapshot Age**    | Tempo desde último hash | < 24h         |

#### C. Widget do Header (Arc Energy Bar)

```text
┌──────────────────────────────────────────────────┐
│  [Logo]  FB ●  RU ●  GPU ●     ╭───╮  🏦 92%  ⚙️  │
│                               │ 65%│              │
│                               ╰───╯              │
│                                ▲                  │
│                          Arc Energy        Treasury│
│                          (PC Balance)      Health  │
└──────────────────────────────────────────────────┘

Clique em 🏦 92% → Abre Treasury Dashboard Modal
```

> **Por que Daily Snapshots?**
>
> - Custo Solana: ~$0.01/transação = $0.30/mês (muito barato)
> - Equilíbrio: Segurança adequada sem overhead excessivo
> - Auditabilidade: Qualquer pessoa verifica via Solscan

---

### 9.3. Hierarquia de Governança (4 Camadas)

A economia é gerida por um sistema de pesos e contrapesos para garantir longevidade.

```text
CAMADA 1: HARDCODE (A Constituição Imutável)
[Piso 2.5x] [Founder 5%] [Min Fundo 15%]
      │
      ▼
CAMADA 2: DAO (O Congresso Político)
[Define Splits flutuantes] [Aprova Parcerias]
      │
      ▼
CAMADA 3: BANCO CENTRAL IA (O Executivo - PAT)
[Controla Inflação] [Gere Fundo] [Executa Queimas]
      │
      ▼
CAMADA 4: MERCADO ÚNICO (O Varejo)
[Vende Tokens] [Aplica Descontos] [Coleta Taxas]
```

#### A. Camada 1: Constituição Federal (Hardcoded)

_Imutáveis. Smart Contract Nível Supremo._

| Artigo                | Regra                             | Por quê?                                                      |
| --------------------- | --------------------------------- | ------------------------------------------------------------- |
| **1. Teto Inflação**  | `Max 5% ao ano`                   | Trava rígida contra desvalorização                            |
| **2. Panda Labs**     | `25% do Fundo → Educação`         | Verba garantida para University/Inovação                      |
| **3. Reserva Ops**    | `20% do Lucro Ops → Caixa`        | Fundo de Emergência (Incide sobre Split Panda)                |
| **4. Crescimento**    | `65% do Fundo → Ação`             | Subsídios, Viralização e Eventos (Gestão IA)                  |
| **5. Piso Preço**     | `2.5x` (Min `1.25x`)              | Solvência. Permite descontos progressivos (até 50%)           |
| **6. Founder Fee**    | `5%` Bruto Eterno                 | Direito do Criador ("Satoshi Fee")                            |
| **7. Garantia Host**  | `90% a 95%` (Taxa P2P 5-10%)      | Blinda a descentralização contra taxas abusivas               |
| **8. Reserva Fundo**  | `Max 10%` (Excedente = Reinveste) | Estabilidade. Sobra reforça Labs e Subsídios (PAT)            |
| **9. Bill of Rights** | `Liberdade Total`                 | Ver tabela abaixo (Direitos Civis Digitais)                   |
| **10. Arbitragem**    | `IA → Founder`                    | Disputa escala: IA julga, Founder decide em última instância  |
| **11. Leis Pétreas**  | `Imutável`                        | Zero processo de emenda. A Constituição é eterna.             |
| **12. Emergência**    | `Failover Agent`                  | IA Auxiliar assume se a principal falhar. Não só Kill Switch. |

#### A.1. Bill of Rights (Direitos Civis Digitais)

_O Protocolo é neutro como a Física. Ele não julga, apenas executa._

| Direito Hardcoded             | Regra Imutável                                                                  | Por quê?                                          |
| ----------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------- |
| **1. Free Speech**            | **Censura Zero.** O protocolo é agnóstico ao conteúdo.                          | A verdade não precisa de proteção, a mentira sim. |
| **2. Non-Expulsion**          | **Banimento Impossível.** A chave privada é soberana. Ninguém pode ser expulso. | Neutralidade Suíça. Se pagou o Gas, executa.      |
| **3. Rust Law (Privacidade)** | **Execução Consentida.** O código NUNCA roda sem permissão explícita (Pop-up).  | "Seus dados, Suas regras". Anti-Spyware nativo.   |

> **Nota de Aplicação do Fundo (Art 2, 4 & 8) - Distribuição Total (100%):**
> O Fundo de Incentivo (~23% da Receita Global) é **100% Alocado** via Hardcode:
>
> 1. **25% - Panda Labs (Educação & P&D):**
>    - `20%` **Bolsas "Learn-to-Earn":** Pagamento direto e automático p/ alunos (Automação Total).
>    - `5%` **Hubs & Infra:** Modernização de laboratórios físicos e Doação de Hardware para Universidades parceiras.
> 2. **65% - Crescimento & Distribuição (Gestão Ativa via IA):**
>    - `30%` **Robin Hood (Subsídios):** Custeia o acesso de entrada e "Free Tier" para baixa renda.
>    - `20%` **Viralização (Afiliados):** Comissões automáticas para influencers e referrals.
>    - `15%` **Eventos (Bootcamps):** Hackathons e prêmios para atrair devs.
> 3. **10% - Reserva Técnica (Lastro):**
>    - Mínimo existencial para estabilidade. Todo excedente acima de 10% é **Reinvestido automaticamente** (via PAT) em Bolsas e Subsídios. Zero desperdício.

---

#### B. Camada 2: Governança via IA ("Super Jarvis")

Em vez de políticos humanos (DAO), uma **Superinteligência (PAT)** gere o ecossistema desde o **Dia 1**, operando estritamente dentro dos limites constitucionais (Hardcode).

| Era         | Quem Governa?                  | Papel do Founder (Lucas)                                      |
| ----------- | ------------------------------ | ------------------------------------------------------------- |
| **Dia 1**   | **IA Assistida (Alpha)**       | **Piloto:** A IA sugere alocações, você aprova.               |
| **Escala**  | **IA Autônoma (Beta)**         | **Auditor:** A IA executa realocações sozinha. Você monitora. |
| **Suprema** | **IA Soberana (The Overmind)** | **Kill Switch:** Só intervém se a IA violar a Constituição.   |

> **Segurança:** A IA tem liberdade total para operar, mas **zero poder** para alterar a Constituição (Camada 1). Ela joga o jogo, mas não muda as regras.

**Capacidades Expandidas (Google Organism):**
A IA não é isolada. Ela atua como um "Crawler Inteligente" dentro do ecossistema Google:

1. **Hunter de Inovação:** Monitora o _Google Garden_ e _Hugging Face_ por novos modelos (Gemini, Llama) e sugere auto-implementação.
2. **Trend Watcher:** Busca na web por demandas emergentes (ex: "Rust está em alta") para criar currículos do Panda Labs instantaneamente.
3. **Cloud Native:** Acesso direto às APIs do Google Cloud para alocar/desalocar recursos conforme a demanda.

---

#### C. Camada 3: Panda AI Treasury (PAT)

A IA atua como **Banco Central**, executando a política monetária para manter inflação em **0-3% a.a.**.

| Ferramenta         | Nível      | Gatilho        | Ação                                                   | Resultado Esperado       |
| ------------------ | ---------- | -------------- | ------------------------------------------------------ | ------------------------ |
| **Reinvestimento** | 🟢 Baixo   | Reserva > 10%  | Distribui excedente em Bolsas e Subsídios (Robin Hood) | Manter Zero Ociosidade   |
| **Aceleração**     | 🟡 Médio   | Deflação > 2%  | Aumenta Grants de entrada e Cashback                   | Atrair novos usuários    |
| **Vesting**        | 🟠 Alto    | Compra > 5M PC | Trava tokens (30% à vista, 70% prazo de 6 meses)       | Evitar "Pump & Dump"     |
| **Burn (Crise)**   | 🔴 Crítico | Inflação > 5%  | Queima tokens da Reserva de Emergência                 | Forçar Deflação Imediata |

---

#### D. Camada 4: Mercado Único (Panda Energy)

Um único mercado para todos, com descontos automáticos por volume histórico.

| Volume         | Desconto | Fonte dos Tokens                          |
| -------------- | -------- | ----------------------------------------- |
| **Iniciante**  | 0%       | Mercado Aberto (Sobe preço)               |
| **Dev Ativo**  | 5-20%    | Mercado Aberto (Sobe preço)               |
| **Enterprise** | 30-50%   | **Reserva de Liquidez** (Não afeta preço) |

---

### 9.4. Tiers Especiais (Licenças Hardcoded) 🎫

Além dos tiers padrão, existem licenças especiais com condições exclusivas:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    TIERS DE LICENÇA - HIERARQUIA                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  FOUNDER (1 licença - Lucas Valério) 👑                                │
│  ├── Multiplier: 1.03x (custo + 3% overhead)                           │
│  ├── Microtransações: 5% (igual a todos)                               │
│  ├── Split Vendas Próprias: 60% Founder / 25% Fundo / 15% Ops          │
│  └── Justificativa: Criador recebe condições de custo operacional      │
│                                                                         │
│  BETA FOUNDER (100 licenças - Early Supporters) 🌟                     │
│  ├── Multiplier: 1.25x (50% desconto vitalício)                        │
│  ├── Quantidade: 100 (não expansível)                                  │
│  ├── Validade: VITALÍCIA (nunca expira)                                │
│  ├── Transferível: NÃO                                                 │
│  ├── Margem Panda: ~25% (break-even sustentável)                       │
│  └── Atribuição: Via código promocional no primeiro login              │
│                                                                         │
│  STANDARD (Todos os demais) 📦                                         │
│  ├── Multiplier: 2.5x (padrão do mercado)                              │
│  └── Descontos: Via volume histórico (Camada 4)                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

#### A. Founder Tier (Único)

| Aspecto              | Valor             | Justificativa                          |
| -------------------- | ----------------- | -------------------------------------- |
| **ID**               | `FOUNDER_001`     | Licença única                          |
| **Token Multiplier** | **1.03x**         | Cobre custo cloud + 3% overhead        |
| **Microtransações**  | 5%                | Igual a todos (não há privilégio)      |
| **Split Vendas**     | 60/25/15          | 60% Founder, 25% Fundo, 15% Ops        |
| **Elegibilidade**    | Ed25519 Signature | Verificado via chave pública hardcoded |

> **Nota:** O Founder paga por uso como qualquer outro usuário, mas com taxa mínima (1.03x) para cobrir custos operacionais. Microtransações (5%) são iguais para todos.

#### B. Beta Founder Tier (100 Licenças ROTATIVAS)

> **Modelo:** Meritocracia. Os **TOP 100 contribuidores** ganham 50% de desconto.

| Aspecto              | Valor             | Justificativa                        |
| -------------------- | ----------------- | ------------------------------------ |
| **Quantidade**       | **100**           | Slots rotativos                      |
| **Tipo**             | **ROTATIVO**      | Baseado em contribuição              |
| **Desconto**         | **50% vitalício** | De 2.5x para 1.25x                   |
| **Token Multiplier** | **1.25x**         | Piso mínimo absoluto                 |
| **Margem Panda**     | ~25%              | Break-even (devs ajudam a organizar) |
| **Elegibilidade**    | Contribuição      | PRs, Issues, Docs, Community         |
| **Transferível**     | NÃO               | Vinculado ao user ID                 |

**Sistema de Pontuação:**

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    BETA FOUNDER - SISTEMA DE MERITOCRACIA               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📊 PONTUAÇÃO POR CONTRIBUIÇÃO                                         │
│  ├── Pull Request (merged)         : +50 pontos                        │
│  ├── Issue resolvida               : +20 pontos                        │
│  ├── Documentação                  : +30 pontos                        │
│  ├── Bug report válido             : +10 pontos                        │
│  ├── Community help (Discord)      : +5 pontos/semana                  │
│  ├── Plugin/Extension publicado    : +100 pontos                       │
│  └── Indicação de dev ativo        : +15 pontos                        │
│                                                                         │
│  🔄 ROTAÇÃO                                                            │
│  ├── Recálculo: Mensal (dia 1)                                         │
│  ├── Top 100 mantém desconto                                           │
│  ├── Dev fora do top 100 → Standard (sem penalidade)                   │
│  └── Dev volta ao top 100 → Recupera desconto automaticamente          │
│                                                                         │
│  💡 OBJETIVO                                                           │
│  └── Devs que ajudam a organizar a casa são recompensados              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Filosofia:** 25% de margem é baixo, mas esses 100 devs estão **trabalhando** para o projeto. O desconto é compensação pelo trabalho, não caridade.

#### C. Tabela Comparativa de Tiers

| Tier             | Multiplier | PC por R$1 | Desconto | Limite | Split        |
| ---------------- | ---------- | ---------- | -------- | ------ | ------------ |
| **Founder**      | 1.03x      | ~97 PC     | ~59%     | 1      | 60/25/15     |
| **Beta Founder** | 1.25x      | ~80 PC     | 50%      | 100    | Padrão       |
| **Standard**     | 2.50x      | ~40 PC     | 0%       | ∞      | 55/22/15/5/3 |

#### D. Implementação Técnica

```javascript
// js/pf.sdk.js - License Tiers
Panda._LICENSE_TIERS = {
  FOUNDER: {
    id: "FOUNDER_001",
    multiplier: 1.03,
    maxLicenses: 1,
    split: { owner: 0.6, fund: 0.25, ops: 0.15 },
    microtx: 0.05,
    verification: "ed25519",
  },
  BETA_FOUNDER: {
    prefix: "BETA_",
    multiplier: 1.25,
    maxLicenses: 100,
    discount: 0.5,
    lifetime: true,
    transferable: false,
    split: "standard",
  },
  STANDARD: {
    multiplier: 2.5,
    maxLicenses: Infinity,
    split: { dev: 0.55, fund: 0.22, ops: 0.15, founder: 0.05, gateway: 0.03 },
  },
};
```

---

## 10. Custos BASE por Módulo

> ⚠️ **Valores são REFERÊNCIA**. PAT ajusta via `PAT_MULTIPLIER` (0.5-1.5).

### WhatsApp

| Ação         | Base PC |
| ------------ | ------- |
| Mensagem     | 1-2     |
| Chatbot/conv | 10      |
| Campanha     | 20      |
| Flow         | 30      |

### Twitter

| Ação        | Base PC |
| ----------- | ------- |
| Tweet       | 5       |
| Thread      | 20      |
| AI Generate | 15      |

### YouTube

| Ação          | Base PC |
| ------------- | ------- |
| Upload        | 10      |
| Thumbnail AI  | 30      |
| Short Extract | 50      |

### Meta

| Ação      | Base PC |
| --------- | ------- |
| Post      | 15      |
| Reel      | 25      |
| Carrossel | 40      |

### cTrader

| Ação      | Base PC |
| --------- | ------- |
| Trade     | 10      |
| AI Signal | 50      |
| Backtest  | 100     |

### Brain (IA)

| Modelo       | PC/1k tokens | Free Tier |
| ------------ | ------------ | --------- |
| Gemini Flash | **0**        | 500k/mês  |
| Gemini Pro   | 30           | -         |
| Claude 3.5   | 45           | -         |
| GPT-4o       | 50           | -         |
| Local (GPU)  | **0**        | ∞         |

---

## 11. Planos de Assinatura

| Plano    | Preço    | PC Incluídos | PC/R$ |
| -------- | -------- | ------------ | ----- |
| Free     | R$ 0     | 100 PC       | -     |
| Starter  | R$ 9,90  | 500 PC       | 50,5  |
| Pro      | R$ 29,90 | 2000 PC      | 66,9  |
| Business | R$ 99,90 | 8000 PC      | 80,1  |
| Lifetime | R$ 150   | 500 PC/mês   | ∞     |

---

> 📖 **Referência:** [PF_MASTER_ARCHITECTURE.md §9](PF_MASTER_ARCHITECTURE.md#9-ecossistema-tokenomics--monetização)
