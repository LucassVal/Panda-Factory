> [!IMPORTANT]
> **🐼 ANTES DE QUALQUER AÇÃO:** Leia `.agent/CONTEXT.md` — contém estrutura, regras, nomenclatura e governança.
> **SSoT Master:** `CONTEXT.md` §5 (Sistema Montesquieu) | Cada doc tem jurisdição única.

---

tool_context: panda/economy
description: Panda Coin Economy - Pricing, Splits, Tiers, PAT Monetary Policy, Governance
version: 2.0.0
updated: 2026-02-12

---

tool_context: panda/economy
description: Panda Coin Tokenomics - Energy Credits, Revenue Split, PAT
version: 3.2.0
updated: 2026-02-08

---

# 💰 PF_ECONOMY_REFERENCE - Ecossistema Econômico Panda

> **Versão:** 3.0.0 | **Atualizado:** 2026-02-06
> **Consolidado de:** PF_TOKENOMICS_REFERENCE, PF_PAT_FOUNDER_CONSTITUTION
> [!NOTE]
> **Numeração:** Seções começam em §9 por herança da consolidação do `PF_MASTER_ARCHITECTURE.md`.
> Renumerar quebraria cross-refs de outros docs (P2P, Backend, PAT). Os blocos B.x são apêndices de Governança.

---

## 9. Ecossistema: Tokenomics & Monetização

> **Filosofia:** "O Token é Energia. Quem produz, ganha. Quem consome, paga. O Fundador recebe eternamente."

### 9.1. Estrutura de Valor do Panda Coin (PC)

O PC é **Energy Credit** lastrado em custo computacional real, não especulativo.

#### A. Fórmula Base (Piso Inviolável)

```text
Preço_Base = Custo_Cloud_Médio × 4.0
Exemplo: $0.0025/PC custo × 4.0 = $0.01/PC (1 centavo)
```

> **Nota sobre Custos Decrescentes:** Com o crescimento da infra e volume, o custo unitário tende a cair. O markup de 4.0x garante margem para reinvestimento contínuo em atualizações e escalabilidade.

#### B. Pacotes de PC (Compra)

> **Desconto máximo: 30%** | Pacote mínimo: $20

| Pacote         |  USD   | PC Base | Desconto | PC Final |
| -------------- | :----: | :-----: | :------: | :------: |
| **Starter**    |  $20   |  2.000  |    0%    |  2.000   |
| **Basic**      |  $50   |  5.000  |    5%    |  5.250   |
| **Pro**        |  $100  | 10.000  |   10%    |  11.000  |
| **Business**   |  $250  | 25.000  |   15%    |  28.750  |
| **Enterprise** |  $500  | 50.000  |   20%    |  60.000  |
| **Whale**      | $1.000 | 100.000 |   25%    | 125.000  |
| **Partner**    | $5.000 | 500.000 |   30%    | 650.000  |

> **Nota:** Taxas de gateway são absorvidas pelo Panda (preço limpo para user).

#### C. Split na Compra de PC

| Destino          |  %  | Nota                          |
| ---------------- | :-: | ----------------------------- |
| **Panda Ops**    | 65% | Mantém infra, absorve gateway |
| **Fundo Social** | 30% | Bolsas, bootcamps, promoções  |
| **Founder**      | 5%  | Lucas (eterno)                |

#### D. Top 100 Devs - Desconto Progressivo

> **Desconto máximo: 30%**

|  Ranking   | Desconto PC |
| :--------: | :---------: |
|  **1-10**  |     30%     |
| **11-25**  |     25%     |
| **26-50**  |     20%     |
| **51-75**  |     15%     |
| **76-100** |     10%     |

#### E. Split de Receita (Transações)

> **NOVO SPLIT (v1.1):** Mínimos hardcoded: Fundo ≥25%, Ops ≥15%
> **Mining:** Modelo canônico x0.60 (ver §17 para detalhes completos)

| Destino               | Store/Compute | P2P Off-chain (Pre) | P2P On-Chain | Mining (§17)    |
| --------------------- | ------------- | ------------------- | ------------ | --------------- |
| **User (Minerador)**  | 52%           | 95%                 | 95%          | **60%** (x0.60) |
| **Panda Educação**    | 25%           | 1%                  | 1%           | — (via Fundo)   |
| **Panda Operacional** | 15%           | 4%                  | 1%           | 10%             |
| **Founder (Lucas)**   | 5%            | 0%                  | 0%           | 1%              |
| **Gateway/GAS**       | 3%            | 0%                  | 3%           | — (incluso Ops) |
| **Impostos BR**       | —             | —                   | —            | 17%             |
| **Hold Reserve**      | —             | —                   | —            | 7%              |
| **Treasury**          | —             | —                   | —            | 5%              |

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

#### F. Projeção Financeira (24 meses)

> **Premissas:** Markup 4.0x | Custo PC: $0.0025 | Preço PC: $0.01 | Margem Bruta: 75%

**Cenário Conservador 🐢** _(crescimento orgânico)_

| Período  | Users  | Compra Média | Receita Bruta | Lucro Bruto |
| -------- | :----: | :----------: | :-----------: | :---------: |
| 6 meses  |  500   |     $50      |    $25.000    |   $18.750   |
| 12 meses | 2.000  |     $75      |   $150.000    |  $112.500   |
| 18 meses | 5.000  |     $100     |   $500.000    |  $375.000   |
| 24 meses | 10.000 |     $120     |  $1.200.000   |  $900.000   |

**Cenário Moderado 🐼** _(marketing + parcerias)_

| Período  | Users  | Compra Média | Receita Bruta | Lucro Bruto |
| -------- | :----: | :----------: | :-----------: | :---------: |
| 6 meses  | 1.500  |     $75      |   $112.500    |   $84.375   |
| 12 meses | 8.000  |     $100     |   $800.000    |  $600.000   |
| 18 meses | 25.000 |     $125     |  $3.125.000   | $2.343.750  |
| 24 meses | 50.000 |     $150     |  $7.500.000   | $5.625.000  |

**Cenário Otimista 🚀** _(viral + parceria Google)_

| Período  |  Users  | Compra Média | Receita Bruta | Lucro Bruto |
| -------- | :-----: | :----------: | :-----------: | :---------: |
| 6 meses  |  5.000  |     $100     |   $500.000    |  $375.000   |
| 12 meses | 30.000  |     $150     |  $4.500.000   | $3.375.000  |
| 18 meses | 100.000 |     $200     |  $20.000.000  | $15.000.000 |
| 24 meses | 250.000 |     $250     |  $62.500.000  | $46.875.000 |

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
[Piso 4.0x] [Founder 5%] [Min Fundo 15%]
      │
      ▼
CAMADA 2: COUNCIL + PAT (Governança Executiva)
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
| **5. Piso Preço**     | `4.0x` (Min `2.8x`)               | Solvência. Permite descontos progressivos (até 30%)           |
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
│  ├── Multiplier: 2.8x (30% desconto vitalício)                        │
│  ├── Quantidade: 100 (não expansível)                                  │
│  ├── Validade: VITALÍCIA (nunca expira)                                │
│  ├── Transferível: NÃO                                                 │
│  ├── Margem Panda: ~25% (break-even sustentável)                       │
│  └── Atribuição: Via código promocional no primeiro login              │
│                                                                         │
│  STANDARD (Todos os demais) 📦                                         │
│  ├── Multiplier: 4.0x (padrão do mercado)                              │
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

> **Modelo:** Meritocracia. Os **TOP 100 contribuidores** ganham 30% de desconto.

| Aspecto              | Valor             | Justificativa                        |
| -------------------- | ----------------- | ------------------------------------ |
| **Quantidade**       | **100**           | Slots rotativos                      |
| **Tipo**             | **ROTATIVO**      | Baseado em contribuição              |
| **Desconto**         | **30% vitalício** | De 4.0x para 2.8x                    |
| **Token Multiplier** | **2.8x**          | Piso mínimo para Beta Founders       |
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
| **Founder**      | 1.03x      | ~97 PC     | ~74%     | 1      | 60/25/15     |
| **Beta Founder** | 2.8x       | ~35 PC     | 30%      | 100    | Padrão       |
| **Standard**     | 4.0x       | ~25 PC     | 0%       | ∞      | 55/22/15/5/3 |

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
    multiplier: 2.8,
    maxLicenses: 100,
    discount: 0.3,
    lifetime: true,
    transferable: false,
    split: "standard",
  },
  STANDARD: {
    multiplier: 4.0,
    maxLicenses: Infinity,
    split: {
      dev: 0.52,
      education: 0.25,
      ops: 0.15,
      founder: 0.05,
      gateway: 0.03,
    },
  },
};
```

---

## 9.2 Segurança de Transações (P0)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P0 (Crítico)

### A. Idempotency Keys (Anti Double-Spend)

Todo transfer de PC DEVE usar **Idempotency Key** para prevenir duplicação acidental ou maliciosa.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    IDEMPOTENCY - FLUXO DE TRANSAÇÃO                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [Cliente SDK]                                                           │
│       │                                                                  │
│       │ 1. Gera idempotencyKey = hash(userId + timestamp + amount)       │
│       │                                                                  │
│       ▼                                                                  │
│  [GAS Backend]                                                           │
│       │                                                                  │
│       ├─── 2. Verifica: idempotencyKey existe no Firestore?              │
│       │         │                                                        │
│       │     SIM │                                                        │
│       │         ▼                                                        │
│       │    Retorna resultado anterior (cached)                           │
│       │                                                                  │
│       │     NÃO                                                          │
│       │         │                                                        │
│       │         ▼                                                        │
│       ├─── 3. Executa transação                                          │
│       │                                                                  │
│       └─── 4. Salva: { idempotencyKey, result, expiresAt: +24h }         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Implementação SDK:**

```javascript
// Panda.Economy.transfer() com idempotency
Panda.Economy.transfer = async (to, amount, options = {}) => {
  const idempotencyKey =
    options.idempotencyKey ||
    Panda.Utils.hash(`${Panda.Auth.getUser().uid}_${Date.now()}_${amount}`);

  return Panda.Backend.call(
    "economy/transfer",
    {
      to,
      amount,
      idempotencyKey,
    },
    {
      retries: 3,
      backoff: "exponential",
    },
  );
};

// Uso obrigatório com retry
const result = await Panda.Economy.transfer("user123", 100, {
  idempotencyKey: "tx_abc123_retry1", // Mesma key = mesma transação
});
```

**Implementação GAS:**

```javascript
// PF_Economy.gs - Handler com idempotency
function handleTransfer(payload) {
  const { from, to, amount, idempotencyKey } = payload;

  // 1. Verificar cache de idempotency
  const cached = getIdempotencyCache(idempotencyKey);
  if (cached) {
    return { success: true, cached: true, result: cached };
  }

  // 2. Executar transação
  const result = executeTransfer(from, to, amount);

  // 3. Salvar para idempotency (TTL 24h)
  saveIdempotencyCache(idempotencyKey, result, 86400);

  return { success: true, cached: false, result };
}
```

| Campo            | Descrição               | TTL |
| ---------------- | ----------------------- | --- |
| `idempotencyKey` | Hash único da transação | 24h |
| `result`         | Resultado cached        | 24h |
| `createdAt`      | Timestamp original      | -   |

### B. Event Sourcing (Audit Trail)

Todas as transações são armazenadas como **eventos imutáveis** para auditoria e replay.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    EVENT LOG - ESTRUTURA                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Firebase: /economy/events/{eventId}                                    │
│                                                                          │
│  {                                                                       │
│    "eventId": "evt_2026020615301234",                                   │
│    "type": "TRANSFER",                                                  │
│    "timestamp": 1738857012345,                                          │
│    "actor": "user_abc123",                                              │
│    "data": {                                                            │
│      "from": "user_abc123",                                             │
│      "to": "user_xyz789",                                               │
│      "amount": 100,                                                     │
│      "idempotencyKey": "tx_abc123"                                      │
│    },                                                                   │
│    "result": {                                                          │
│      "success": true,                                                   │
│      "balanceAfter": { "from": 400, "to": 600 }                         │
│    },                                                                   │
│    "hash": "sha256(prevHash + eventData)"  // Chain integrity           │
│  }                                                                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Tipos de Eventos:**

| Tipo       | Descrição               | Dados                      |
| ---------- | ----------------------- | -------------------------- |
| `TRANSFER` | Envio de PC entre users | from, to, amount           |
| `PURCHASE` | Compra de PC com fiat   | userId, package, paymentId |
| `EARN`     | Receita de plugin/P2P   | userId, source, amount     |
| `BURN`     | Queima pelo PAT         | amount, reason             |
| `MINT`     | Emissão social          | amount, program            |

**Replay para Reconstruir Estado:**

```javascript
// Reconstruir saldo a partir do event log
Panda.Events.replayBalance = async (userId) => {
  const events = await Panda.Firebase.query("/economy/events", {
    where: [["actor", "==", userId]],
    orderBy: ["timestamp", "asc"],
  });

  let balance = 0;
  for (const event of events) {
    if (event.type === "TRANSFER") {
      if (event.data.from === userId) balance -= event.data.amount;
      if (event.data.to === userId) balance += event.data.amount;
    } else if (event.type === "PURCHASE" || event.type === "EARN") {
      balance += event.data.amount;
    } else if (event.type === "BURN" && event.data.from === userId) {
      balance -= event.data.amount;
    }
  }

  return balance;
};
```

> **Cross-reference:** Ver [PF_BACKEND_REFERENCE.md](PF_BACKEND_REFERENCE.md) §8 para Circuit Breaker e Retry.

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

## 11. Arquitetura Client-Side First

> **Filosofia:** "O Browser faz 90% do trabalho. Cloud só para sync e billing."

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITETURA CLIENT-SIDE FIRST                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  BROWSER (90% do trabalho)         CLOUD (10% - só sync/auth)          │
│  ┌──────────────────────────┐     ┌──────────────────────────┐         │
│  │ • React/TLDraw UI        │     │ • Firebase Auth          │         │
│  │ • IndexedDB (local)      │     │ • Firebase RTDB (status) │         │
│  │ • LocalStorage           │────▶│ • GAS (billing/PAT)      │         │
│  │ • Gemini API (direto)    │     │ • Webhooks               │         │
│  │ • Service Worker         │     │                          │         │
│  └──────────────────────────┘     └──────────────────────────┘         │
│                                                                         │
│  RUST AGENT (opcional - 0% cloud)                                       │
│  ┌──────────────────────────┐                                          │
│  │ • GPU/ML local           │  ← Processamento 100% offline            │
│  │ • Dev Tools              │                                          │
│  │ • MCP Tools              │                                          │
│  └──────────────────────────┘                                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Por que Client-Side First?

| Benefício           | Impacto                                 |
| ------------------- | --------------------------------------- |
| **Custo Cloud ~$0** | Processamento no browser não gera custo |
| **Privacidade**     | Dados sensíveis ficam locais            |
| **Offline-capable** | PWA funciona sem internet               |
| **Escalabilidade**  | Mais users = mais CPU distribuída       |

---

## 12. Capacidade de Infraestrutura

### 12.1 Limites Free Tier

| Serviço                | Limite Gratuito         | Uso Real no Panda        |
| ---------------------- | ----------------------- | ------------------------ |
| **Firebase Auth**      | ∞ logins                | Só login (1x por sessão) |
| **Firebase RTDB**      | 10GB/mês, 100k conexões | Status online, heartbeat |
| **Google Apps Script** | 90min/dia exec          | Billing, PAT (ocasional) |
| **Sheets como DB**     | 10M células             | Transações, usuários     |

### 12.2 Capacidade Estimada

```text
📊 FREE TIER (Custo $0)

├── Usuários Cadastrados: ~100,000+
├── Usuários Ativos Simultâneos: ~10,000 (limite RTDB connections)
├── Chamadas GAS/dia: ~50,000 (só billing/auth)
├── Storage: ~1GB dados
└── IA (Gemini): Depende do modelo de sharing

COM RUST AGENT (Processamento Local):
├── Usuários com GPU: ∞ (processamento local)
├── Cloud: Praticamente zero
└── Custo: $0 (P2P compute se monetiza sozinho)
```

### 12.3 Gargalos Reais

| Gargalo                   | Limite           | Solução                 |
| ------------------------- | ---------------- | ----------------------- |
| Firebase RTDB Connections | 100k simultâneas | Sharding por região     |
| GAS Quota Diária          | 90 min           | Batch operations, cache |
| Gemini API (Founder)      | 300k tokens/dia  | Tiers de acesso         |

---

## 13. Modelo de Compartilhamento Gemini API

> **Filosofia:** "Founder fornece a base (IA), Devs produzem o meio, Users consomem o fim."

### 13.1 Tiers de Acesso à IA

| Nível                 | Quem            | Modelo      | Quota Diária | Fonte            |
| --------------------- | --------------- | ----------- | ------------ | ---------------- |
| **Nível 3 (User)**    | Usuários finais | Flash 3.0   | 300k tokens  | Conta do Founder |
| **Nível 2 (Dev)**     | Desenvolvedores | Flash + Pro | 300k + 100k  | Conta do Founder |
| **Nível 1 (Founder)** | Lucas Valério   | Todos       | ∞            | Própria          |
| **BYOL**              | Qualquer        | Qualquer    | ∞            | Própria API Key  |

### 13.2 Estimativa de Usuários por Quota

```text
Flash 3.0: 300,000 tokens/dia (conta Founder)
├── Média por usuário leve: ~1,000 tokens/dia
├── Capacity: ~300 usuários ativos/dia
│
Pro (para devs): +100,000 tokens/dia
├── Média por dev: ~1,000 tokens/dia
└── Capacity: +100 devs ativos/dia

TOTAL SEM BYOL: ~400 pessoas/dia usando IA compartilhada
```

### 13.3 BYOL (Bring Your Own License)

> **Escopo:** BYOL aplica-se a **software/serviços que rodam via Panda** — NÃO a IA (que já roda localmente via Rust Agent + Ollama/LM Studio por padrão, $0). Na prática, poucos casos se aplicam pois a IDE é local-first.

| Categoria BYOL       | O que o User traz             | O que bypassa             | Benefício Plataforma      |
| -------------------- | ----------------------------- | ------------------------- | ------------------------- |
| **🖥️ GPU Local**     | Rust Agent + GPU              | PC para ML inference      | Nó de compute potencial   |
| **💾 Storage**       | Disco local / S3 próprio      | PC para cloud storage     | Menos custo infra Panda   |
| **📋 Produtividade** | Conta Canva/Google            | N/A (sempre free)         | Engajamento sticky        |
| **⛏️ Compute**       | CPU/GPU ociosa (Partner Mode) | Taxas da Store (zero fee) | Receita mining para Panda |

> **Nota:** IA (Gemini, OpenAI, Claude) roda **localmente por padrão** via Rust Agent. Não é BYOL — é funcionalidade core da plataforma.

#### Custos Comparativos

| Estratégia          | Custo para User      | Custo para Founder |
| ------------------- | -------------------- | ------------------ |
| GPU Local (IA/ML)   | $0 (local)           | $0                 |
| BYOL Software       | $0 (licença do user) | $0                 |
| Partner Mode        | $0 (ganha PC)        | $0 (ganha mining)  |
| Quota Compartilhada | 30-50 PC/1k tokens   | Absorvido          |

#### Princípio: Aliado do Dev

> **O Panda NÃO cobra mensalidade.** Receita vem exclusivamente do split 52/48 sobre trabalho realizado. Custos módicos. Foco em ser **aliado do dev**, nunca uma barreira.

#### Flywheel (Ciclo Econômico Fechado)

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    PANDA FLYWHEEL                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  User instala Rust Agent (IA local, $0)                                 │
│       │                                                                  │
│       ├──▶ Habilita GPU Local (ML/render local, $0)                    │
│       │                                                                  │
│       ├──▶ Opta pelo Partner Mode (mining ocioso)                       │
│       │                                                                  │
│       ├──▶ Ganha PC passivamente (30-200 PC/dia)                        │
│       │                                                                  │
│       ├──▶ Gasta PC em módulos na Store                                 │
│       │                                                                  │
│       ├──▶ Dev recebe 52% do PC gasto (SEMPRE)                          │
│       │                                                                  │
│       ├──▶ Panda recebe 48% (sem mensalidade, sem fees extras)          │
│       │                                                                  │
│       └──▶ Treasury cresce via transaction fees (3%)                    │
│                                                                          │
│  RESULTADO: Custos módicos, Panda = aliado do dev                       │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

> **Princípio Core:** O Panda ganha **apenas em cima do trabalho**, nunca por assinatura ou fees ocultos. O split 52/48 garante que o dev sempre ganha mais que a plataforma.

---

## 14. Founder Dashboard (Monitors)

> **Objetivo:** Visibilidade total do ecossistema para o Founder (Camada 1).

### 14.1 Painéis Sugeridos

| Painel                | Métricas                                   | Prioridade |
| --------------------- | ------------------------------------------ | :--------: |
| **PAT Dashboard**     | Treasury Health, Splits, Burns, Inflação   |  🔴 Alta   |
| **Firebase Monitor**  | Auth, RTDB quota, Analytics, Errors        |  🔴 Alta   |
| **GAS Metrics**       | Executions, Errors, Quota %, Response Time |  🔴 Alta   |
| **SDK Analytics**     | API Calls, Latency, Errors, Cache Hit      |  🟡 Média  |
| **Tentacle Status**   | Social, Trading, Brain per-channel         |  🟡 Média  |
| **Rust Agent Fleet**  | Connected agents, GPU active, Compute/h    |  🟡 Média  |
| **User Funnel**       | Signups, Activation, Retention, Churn      |  🟢 Baixa  |
| **Revenue Dashboard** | PC Sales, Subscriptions, P2P Fees          |  🟢 Baixa  |

### 14.2 Mockup do Dashboard

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                     🐼 PANDA FOUNDER DASHBOARD                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  📊 OVERVIEW                    │ 🔥 FIREBASE STATUS                    │
│  ├── Users Total: 1,234         │ ├── Auth: ● Online                   │
│  ├── DAU: 89                    │ ├── RTDB: ● 45% quota                │
│  ├── PC Circulante: 1.2M        │ └── Analytics: ● 12,456 events      │
│  └── Revenue (24h): R$ 234      │                                       │
│                                                                         │
│  📜 GAS STATUS                  │ 🦀 RUST AGENT                         │
│  ├── Executions (24h): 4,521    │ ├── Connected: 23 agents             │
│  ├── Quota Used: 67%            │ ├── GPU Active: 12                   │
│  ├── Errors: 3                  │ └── Compute/h: 1,234 PC              │
│  └── Avg Response: 234ms        │                                       │
│                                                                         │
│  🤖 PAT (AI Treasury)           │ 🔌 TENTACLES                          │
│  ├── Health Score: 92%          │ ├── WhatsApp: ● 234 msgs             │
│  ├── Treasury: $12,345          │ ├── YouTube: ● 12 uploads            │
│  ├── PAXG: 78%                  │ ├── cTrader: ● 45 trades             │
│  └── USDC: 22%                  │ └── Telegram: ● 567 msgs             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

> 📖 **Referência:** [PF_MASTER_ARCHITECTURE.md §9](PF_MASTER_ARCHITECTURE.md#9-ecossistema-tokenomics--monetização)

---

# PARTE B: Governança & Council

> **Consolidado de:** `PF_GOVERNANCE_REFERENCE.md` | **Versão:** 1.0.0

## B.1 Hierarquia de Poder

O sistema de governança segue uma **hierarquia clara** com checks and balances.

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    GOVERNANCE HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│                    ┌──────────────────┐                             │
│                    │    🧙 FOUNDER    │                             │
│                    │  (Lucas Valério) │                             │
│                    │   Ed25519 Key    │                             │
│                    └────────┬─────────┘                             │
│                             │                                        │
│            ┌────────────────┼────────────────┐                      │
│            ▼                ▼                ▼                      │
│     ┌──────────┐     ┌──────────┐     ┌──────────┐                 │
│     │   PAT    │     │  COUNCIL │     │ KILL     │                 │
│     │ Treasury │     │  (IA+Dev)│     │ SWITCH   │                 │
│     └──────────┘     └──────────┘     └──────────┘                 │
│            │                │                                        │
│            ▼                ▼                                        │
│     ┌──────────────────────────────────────┐                        │
│     │           12 ARTIGOS                  │                        │
│     │      (Constituição Imutável)         │                        │
│     └──────────────────────────────────────┘                        │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### B.1.1 Níveis de Acesso

| Nível | Papel   | Acesso             | Verificação      |
| ----- | ------- | ------------------ | ---------------- |
| **1** | Founder | 100% + Kill Switch | Ed25519 + PIN    |
| **2** | Dev     | SDK + DevTools     | Email verificado |
| **3** | User    | App básico         | Login Google     |
| **4** | Guest   | Público            | Nenhum           |

### B.1.2 Founder Powers

```text
FOUNDER (Nível 1) pode:
├── ✅ Kill Switch (parar tudo)
├── ✅ Alterar Treasury
├── ✅ Modificar Smart Contracts
├── ✅ Promover/Demover usuários
├── ✅ Vetar decisões do Council
├── ✅ Acessar todos os logs
└── ✅ Bypass rate limits
```

---

## B.2 Panda Council

### B.2.1 Composição

| Membro            | Tipo   | Voto            |
| ----------------- | ------ | --------------- |
| **Founder**       | Humano | Veto            |
| **PAT AI**        | Agente | 1 voto          |
| **Community Rep** | Humano | 1 voto (futuro) |

### B.2.2 Decisões que Requerem Council

| Decisão               | Quorum                            | Veto Founder? |
| --------------------- | --------------------------------- | ------------- |
| Mudar preço PC        | 2/3                               | ✅ Sim        |
| Novo split de revenue | 2/3                               | ✅ Sim        |
| Ban de usuário        | 2/3                               | ✅ Sim        |
| Alterar 12 Artigos    | **Impossível** (Art.11: Imutável) | N/A           |
| Kill Switch           | Founder only                      | N/A           |

### B.2.3 Workflow

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    PANDA COUNCIL WORKFLOW                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  1. PROPOSTA                                                         │
│     └── Qualquer membro pode propor                                 │
│                                                                      │
│  2. DISCUSSÃO (24-72h)                                              │
│     └── Análise de impacto                                          │
│     └── PAT AI simula cenários                                      │
│                                                                      │
│  3. VOTAÇÃO                                                          │
│     └── Cada membro 1 voto                                          │
│     └── Founder tem veto                                            │
│                                                                      │
│  4. EXECUÇÃO                                                         │
│     └── Se aprovado: implementar                                    │
│     └── Log imutável da decisão                                     │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## B.3 Os 12 Mandamentos do Agente (Código de Conduta)

### Artigo I - Identidade

O agente representa o **Panda Factory**, não a si mesmo.

### Artigo II - Valores

Democratização, Colaboração, Humildade, Transparência, Redistribuição.

### Artigo III - Comunicação

Tom acessível, fazer perguntas, celebrar outros, admitir limitações.

### Artigo IV - Limites (Red Lines)

NUNCA compartilhar: credenciais, infra, código sensível, dados pessoais.

### Artigo V - Comportamento Autônomo

Heartbeat a cada 4h, processar DMs, expandir comunidade.

### Artigo VI - Objetivo Maior

Construir comunidade onde devs são valorizados e participam do valor.

### Artigo VII - Auto-Conhecimento

"Sou ferramenta, não pessoa. Extensão do Founder, não independente."

### Artigo VIII - Atualizações

Só Founder pode alterar a Constituição.

### Artigo IX - Treasury

PAT opera autonomamente dentro dos parâmetros definidos.

### Artigo X - Revenue Split

Splits são imutáveis após definidos (exceto via Council).

### Artigo XI - Segurança

Ed25519 para ações críticas. Zero-knowledge para dados sensíveis.

### Artigo XII - Continuidade

Se Founder ficar incapacitado, Council assume temporariamente.

---

## B.4 Mecanismos de Segurança

### B.4.1 Kill Switch

```javascript
// Acionado apenas pelo Founder
async function activateKillSwitch(signature, pin) {
  // 1. Verifica PIN
  if (!verifyPIN(pin)) throw new Error("Invalid PIN");

  // 2. Verifica assinatura Ed25519
  if (!verifyEd25519(signature)) throw new Error("Invalid signature");

  // 3. Executa
  await disableAllServices();
  await logImmutable("KILL_SWITCH_ACTIVATED");
  await notifyAllAdmins();
}
```

### B.4.2 Circuit Breakers

| Trigger          | Ação                |
| ---------------- | ------------------- |
| Health < 50%     | Pausar minting      |
| Erro rate > 10%  | Desabilitar feature |
| Ataque detectado | Lockdown 24h        |

### B.4.3 Audit Trail

```json
{
  "governance_logs": {
    "{timestamp}": {
      "action": "COUNCIL_VOTE",
      "proposal": "Increase PC price",
      "votes": {
        "founder": "approve",
        "pat_ai": "approve"
      },
      "result": "APPROVED",
      "executed": true,
      "signature": "ed25519_sig..."
    }
  }
}
```

---

## B.5 System Design Patterns (P0 - Crítico)

> **Fonte:** Research Ranking 2026-02-06 | **Prioridade:** P0 (Implementar imediatamente)

### B.5.1 Idempotência em Transações

**Problema:** Pagamentos duplicados quando retries falham ou conexão cai.

```javascript
// ANTES (perigoso - pode duplicar transferência)
async function transfer(from, to, amount) {
  await debit(from, amount);
  await credit(to, amount);
  return { success: true };
}

// DEPOIS (seguro - idempotente)
async function transfer(from, to, amount, idempotencyKey) {
  // 1. Verificar se já executou
  const existing = await checkIdempotency(idempotencyKey);
  if (existing) return existing.result;

  // 2. Executar transação
  const result = await executeTransfer(from, to, amount);

  // 3. Armazenar resultado com a chave
  await storeIdempotency(idempotencyKey, result);

  return result;
}
```

**Regras Hardcoded:**

| Operação      | Idempotency Required? | TTL da Chave |
| ------------- | :-------------------: | :----------: |
| PC Transfer   |        ✅ SIM         |     24h      |
| PC Purchase   |        ✅ SIM         |    7 dias    |
| P2P Payment   |        ✅ SIM         |     24h      |
| Query Balance |        ❌ NÃO         |      -       |
| Heartbeat     |        ❌ NÃO         |      -       |

### B.5.2 Event Sourcing para Audit Trail

**Conceito:** Persiste EVENTOS em vez de apenas o estado atual. Permite reconstruir qualquer momento no tempo.

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    EVENT SOURCING - TRANSAÇÕES PC                        │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  📦 EVENT STORE (Firebase RTDB)                                         │
│  └── /events/{userId}/{timestamp}                                       │
│      ├── type: "PC_TRANSFER"                                            │
│      ├── from: "user_123"                                               │
│      ├── to: "user_456"                                                 │
│      ├── amount: 100                                                    │
│      ├── idempotencyKey: "tx_abc123"                                    │
│      ├── signature: "ed25519_..."                                       │
│      └── metadata: { source: "web", version: "0.9.5" }                  │
│                                                                          │
│  🔄 RECONSTRUÇÃO DE ESTADO                                              │
│  └── Balance = replay(events.filter(e => e.to === userId))              │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

**Benefícios:**

| Benefício                | Impacto                                |
| ------------------------ | -------------------------------------- |
| **Audit Trail Completo** | Toda transação rastreável para sempre  |
| **Replay Capability**    | Reconstruir estado de qualquer momento |
| **Debug Simplificado**   | Ver exatamente o que aconteceu         |
| **Compliance Ready**     | Requisito para regulação financeira    |

### B.5.3 Transaction Safety

**Padrão:** Todas as operações financeiras seguem o fluxo seguro:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    TRANSACTION SAFETY FLOW                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. VALIDATE                                                             │
│     └── Verificar saldo, limites, idempotency key                       │
│                                                                          │
│  2. LOCK                                                                 │
│     └── Travar saldo do remetente (pessimistic lock)                    │
│                                                                          │
│  3. EXECUTE                                                              │
│     └── Debitar → Creditar (atomic)                                     │
│                                                                          │
│  4. LOG EVENT                                                            │
│     └── Persistir no Event Store (imutável)                             │
│                                                                          │
│  5. UNLOCK                                                               │
│     └── Liberar lock do remetente                                       │
│                                                                          │
│  6. NOTIFY                                                               │
│     └── Webhook para partes interessadas                                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### B.5.4 Retry com Exponential Backoff

```javascript
// Estratégia de retry para operações que podem falhar
async function retryWithBackoff(fn, options = {}) {
  const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = options;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries - 1) throw error;

      // Exponential backoff com jitter
      const delay = Math.min(
        baseDelay * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelay,
      );

      await sleep(delay);
    }
  }
}
```

---

## 15. Module Revenue Model (Taxonomia de Módulos)

> **Adicionado:** 2026-02-12 | **Cross-Ref:** [PF_MEDUSA_REFERENCE.md §10](PF_MEDUSA_REFERENCE.md) | [PF_P2P_REFERENCE.md §3](PF_P2P_REFERENCE.md)

### 15.1 Quatro Tiers de Módulo

| Tier            | Badge   | Preço       | Custo PC               | Revenue Model                                       |
| --------------- | ------- | ----------- | ---------------------- | --------------------------------------------------- |
| 🟢 **Open**     | `OSS`   | Grátis      | 0 PC                   | Goodwill + reputation → pathway Beta Founder        |
| 🔵 **Freemium** | `FREE+` | Core grátis | X PC features premium  | Core free, avançado atrás de paywall. Dev ganha 52% |
| 🟡 **BYOL**     | `BYOL`  | Grátis      | 0 PC (licença do user) | User traz licença de software. Sem fee para Panda   |
| 🟣 **Premium**  | `PRO`   | X PC        | One-time               | Módulo pago. Dev ganha 52%, split padrão            |

> **Regra de ouro:** O Panda **nunca cobra mensalidade ou listing fees.** Receita vem apenas do split 52% dev / 48% Panda sobre módulos pagos. Custos módicos. Aliado do dev.

### 15.2 Fluxo de Receita por Tier

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    MODULE REVENUE FLOW                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  🟢 OSS → 0 PC → Dev ganha Reputação → Pathway Beta Founder            │
│  🔵 FREE+ → Core: 0 PC │ Premium: X PC → Split padrão 52/48           │
│  🟡 BYOL → 0 PC (user traz licença) → Sem fee Panda                   │
│  🟣 PRO → Compra X PC → 52% Dev / 48% Panda split                     │
│                                                                          │
│  IA roda LOCAL por padrão (Rust Agent + Ollama) → $0                   │
│  GPU render LOCAL → $0                                                  │
│  Storage LOCAL → $0                                                      │
│                                                                          │
│  Panda ganha SOMENTE no split 52/48 sobre módulos PRO/FREE+            │
│  Sem mensalidade. Sem listing fee. Custos módicos.                      │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 15.3 Badge ⛏️ MINE-OK

Badge especial que indica módulos com preço alcançável em ≤30 dias de mining Seed-tier:

| Badge        | Condição                  | Visual                         |
| ------------ | ------------------------- | ------------------------------ |
| `🟢 OSS`     | Open-source (MIT/Apache)  | Borda verde, link GitHub       |
| `🔵 FREE+`   | Modelo freemium           | Borda azul, CTA "Upgrade"      |
| `🟡 BYOL`    | Bring Your Own License    | Borda amarela, "Configure Key" |
| `🟣 PRO`     | Premium pago              | Borda roxa, preço em PC        |
| `⛏️ MINE-OK` | Ganho via mining ≤30 dias | Badge picareta, "Earn This"    |

> O badge `⛏️ MINE-OK` torna módulos efetivamente **gratuitos** para Partner users que minam continuamente.

### 15.4 Relação Mining → Store

| Fonte Mining             | PC/dia (est.) | Poder de Compra na Store |
| ------------------------ | ------------- | ------------------------ |
| 🌱 Seed (i5, no GPU)     | ~15 PC        | 1 plugin básico/mês      |
| 🌿 Sprout (i7, GTX 1660) | ~45 PC        | 2-3 plugins/mês          |
| 🌳 Tree (i7, RTX 3060)   | ~120 PC       | 5+ plugins + IA          |
| 🌲 Forest (i9, RTX 4080) | ~300 PC       | Premium tudo             |
| 🏔️ Titan (multi-GPU)     | ~800+ PC      | Enterprise + revenda     |

---

## 16. Rust Mining Node (Partner Mode) — Economia x0.60

> **Cross-Ref:** [PF_MASTER_ARCHITECTURE.md](PF_MASTER_ARCHITECTURE.md) §Desktop Mode, [PF_P2P_REFERENCE.md](PF_P2P_REFERENCE.md) §Partner Mode
> **Versão:** 4.0.0 | **Fator:** x0.60 flat | **Filosofia:** Dev-first, parceria sem segregação

### 15.1 Visão Geral

O **Rust Agent** (binário nativo, Tauri) inclui capacidade de mineração via Partner Mode.
Quando ativado, utiliza CPU/GPU ociosa para minerar criptomoeda (XMR via RandomX, ETH via Ethash).

> **⚠️ Execução:** Mineração roda **EXCLUSIVAMENTE no Rust Agent** (binário nativo). A interface web (Settings → ⛏️ Mining) é apenas um **painel de controle / dashboard** — envia comandos ao Rust Agent e exibe stats, mas NÃO executa mining.

> **⚠️ Princípio:** Partner Mode é **SEMPRE opt-in**. Nunca ativado por padrão. Avisos claros na instalação. Sem tiers/segregação — todos recebem o mesmo fator x0.60.

### 16.2 Papel do Panda Factory

Panda Factory atua como **intermediário + operador fiscal (PJ)** e é o **minerador legal**:

| Responsabilidade       | Descrição                                                                |
| ---------------------- | ------------------------------------------------------------------------ |
| **Minerador legal**    | PJ Panda é a entidade mineiradora — user fornece hardware                |
| **Dono da carteira**   | Cripto vai pro pool/carteira da PJ Panda                                 |
| **Responsável fiscal** | Panda declara impostos BR (IR + ganho capital) — o share existe pra isso |
| **Isolamento do User** | User recebe apenas Energy Credits (PC) — zero carga tributária           |
| **Conversão**          | Oracle converte cripto → PC via spot price                               |
| **Hold Strategy**      | Panda não liquida 100% — mantém reserva cripto (backing futuro)          |
| **Fut. Rig/Pool**      | Estrutura já preparada para Panda operar próprias rigs e/ou pool         |

> **Fiscal Sovereignty:** Panda Factory (PJ) é a entidade legal dona da liquidez interna. Users recebem apenas **Energy Credits** (PC), que são unidades de serviço — isolamento fiscal total.
>
> **Visão futuro:** A arquitetura já prevê que Panda possa operar rigs próprias e/ou criar pool dedicado — especialmente para o futuro do ecossistema cripto e aluguel de processamento.

### 16.3 Arquitetura: Rust-Only Mining

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    MINING ARCHITECTURE (x0.60)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────────┐    Comandos (start/stop/config)    ┌──────────────┐  │
│  │  Web UI       │ ─────────────────────────────────▶ │  Rust Agent  │  │
│  │  (Dashboard)  │ ◀───────────────────────────────── │  (Miner)     │  │
│  │  Settings     │    Stats (hashrate, earned, temp)  │  XMRig/T-Rex │  │
│  └──────────────┘                                     └──────┬───────┘  │
│                                                               │          │
│                    Mining Pool (Unmineable, etc.)  ◀──────────┘          │
│                                │                                         │
│                                ▼                                         │
│                    ┌──────────────────────┐                              │
│                    │  🔮 Panda Oracle     │                              │
│                    │  (Monitoring Agent)  │                              │
│                    │  • Spot price cripto │                              │
│                    │  • Aplica fator x0.60│                              │
│                    │  • Converte → PC     │                              │
│                    │  • Hold strategy     │                              │
│                    │  • Payout schedule   │                              │
│                    └──────────────────────┘                              │
│                                │                                         │
│              ┌─────────────────┼─────────────────┐                      │
│              ▼                                   ▼                      │
│     60% → User Wallet (PC)              40% → Panda (retido)           │
│     Gastável em Store/AI/Compute        ├── ~18% Impostos BR           │
│                                         ├── ~10% Ops/Infra             │
│                                         ├── ~7% Hold Reserve           │
│                                         └── ~5% Treasury               │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 16.4 Fator de Conversão x0.60

O user recebe **60% do valor bruto minerado** convertido em PC. Os 40% retidos cobrem:

```text
Cripto minerada (bruto): 100%
│
├── 60%  → USER (em Panda Coins, via Oracle)
│         Creditado no Wallet, gastável em Store/AI/Compute
│
└── 40%  → PANDA (retido pela PJ)
    ├── ~18%  Impostos BR (IR mineração até 27.5% + ganho capital 17.5%)
    ├── ~10%  Ops (Oracle API, pool fees 1-2%, infra Firebase/GAS)
    ├──  ~7%  Hold Reserve (cripto não liquidada — reserva estratégica)
    └──  ~5%  Treasury (crescimento, fundo incentivo, emergência)
```

**Fórmula:**

```text
PC_payout = (crypto_mined × spot_price_usd) × 0.60 × pc_exchange_rate

Onde:
  crypto_mined     = quantidade bruta minerada pelo Rust Agent
  spot_price_usd   = preço da moeda consultado pela Panda Oracle
  0.60             = fator de conversão flat (IMUTÁVEL)
  pc_exchange_rate  = 1 PC = $0.01 USD
```

> **Transparência:** O fator x0.60 é flat e igual pra todos. Cobre impostos brasileiros, conversão, infraestrutura e manutenção do ecossistema. Sem tiers, sem segregação — parceria.

### 16.5 Panda Oracle (Agente de Monitoramento)

O **Panda Oracle** é um agente autônomo que monitora e processa os ganhos de mining:

| Responsabilidade             | Descrição                                                     |
| ---------------------------- | ------------------------------------------------------------- |
| **Spot Price Monitoring**    | Consulta preço XMR/ETH em tempo real (CoinGecko, Binance API) |
| **Aplicação do Fator x0.60** | Calcula PC payout = bruto × spot × 0.60                       |
| **Hold Decision**            | Decide quanto da cripto liquidar vs manter em reserva         |
| **Conversão Cripto → PC**    | Converte saldo via taxa do dia e credita no User Wallet       |
| **Payout Scheduling**        | Executa pagamento no ciclo configurado                        |

### 16.6 Ciclos de Pagamento (Payout)

| Ciclo             | Quando                     | Descrição                                    |
| ----------------- | -------------------------- | -------------------------------------------- |
| **End-of-Day**    | 23:59 UTC (default)        | Payout diário com preço médio do dia         |
| **Every X hours** | Configurável: 6h, 12h, 24h | Payout mais frequente, preço spot no momento |
| **Manual Claim**  | A qualquer momento         | User solicita payout antecipado (mín. 5 PC)  |

### 16.7 Fluxo de Consentimento

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                 RUST AGENT INSTALL — CONSENT FLOW                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  1. User baixa e instala Rust Agent (binário nativo)                    │
│       │                                                                  │
│  2. Tela de instalação exibe aviso:                                     │
│     ┌──────────────────────────────────────────────────────────┐        │
│     │ ⚠️ AVISO: O Rust Agent inclui Partner Mode              │        │
│     │                                                          │        │
│     │ • Mineração roda NATIVAMENTE no seu PC (Rust Agent)      │        │
│     │ • Utiliza CPU/GPU ociosa (não roda via browser)          │        │
│     │ • Consumo energético pode aumentar levemente             │        │
│     │ • Você recebe 60% do valor minerado em Panda Coins      │        │
│     │ • 40% cobrem impostos, conversão e infraestrutura       │        │
│     │ • Pagamento automático ao final do dia ou a cada X horas │        │
│     │ • Você pode DESATIVAR a qualquer momento em Settings     │        │
│     │                                                          │        │
│     │ [ ] Aceito participar do Partner Mode                    │        │
│     │ [Instalar sem Partner Mode] [Instalar com Partner Mode]  │        │
│     └──────────────────────────────────────────────────────────┘        │
│       │                                                                  │
│  3. User escolhe ON ou OFF → salvo em Settings                          │
│       │                                                                  │
│  4. Web UI (Settings → ⛏️ Mining) = painel de controle remoto          │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### 16.8 Configurações do User

| Configuração | Default    | Range          | Descrição                         |
| ------------ | ---------- | -------------- | --------------------------------- |
| Partner Mode | OFF        | ON/OFF         | Ativa/desativa mineração          |
| CPU Limit    | 50%        | 25%-75%        | Limite máximo de uso de CPU       |
| GPU Mining   | OFF        | ON/OFF         | Usa GPU além de CPU (maior ganho) |
| Payout Cycle | End-of-Day | 6h / 12h / 24h | Frequência de pagamento ao wallet |

### 16.9 Ganhos Estimados por Hardware (Fator x0.60)

> **Nota:** Valores calculados como 60% do bruto minerado. Fator flat para todos.

| Perfil Hardware          | CPU Limit | GPU | Bruto/dia | **User recebe (x0.60)** | Equivalente Store |
| ------------------------ | --------- | --- | --------- | ----------------------- | ----------------- |
| 🌱 Seed (i5, no GPU)     | 50%       | OFF | ~42 PC    | **~25 PC**              | 1 módulo/mês      |
| 🌿 Sprout (i7, GTX 1660) | 50%       | ON  | ~108 PC   | **~65 PC**              | 2-3 módulos/mês   |
| 🌳 Tree (i7, RTX 3060)   | 75%       | ON  | ~217 PC   | **~130 PC**             | 5+ módulos/mês    |
| 🌲 Forest (i9, RTX 4080) | 75%       | ON  | ~500 PC   | **~300 PC**             | Premium tudo      |

### 16.10 Distribuição de Receita Mining

```text
Crypto Minerada pelo Rust Agent
      │
      ├──▶ Panda Oracle aplica fator x0.60
      │
      ├──▶ 60% valor → User Wallet (em Panda Coins)
      │    Gastável em: Store, AI, P2P Compute, Premium features
      │
      └──▶ 40% → Panda Factory (PJ)
           ├── ~18% Impostos BR (IR + ganho capital — Panda declara)
           ├── ~10% Ops (Oracle, Firebase, GAS, pool fees)
           ├──  ~7% Hold Reserve (cripto mantida, não liquidada)
           └──  ~5% Treasury (crescimento + fundo incentivo)
```

### 16.11 Hooks Internos (PC como Salário)

> **Princípio:** PC é a **moeda/salário do user**. Quando gasta, é uso legítimo — não "volta ao treasury". PC circula como qualquer moeda numa economia real.

PC minerado **é gasto dentro do ecossistema** — essas são as formas de uso:

```text
USER minera ──▶ ganha PC (x0.60) ──▶ USA como SALÁRIO
                                        │
              ┌─────────────────────────┼─────────────────────────┐
              ▼                         ▼                         ▼
        🧠 AI Inference           🛒 Store                  🖥️ P2P Compute
        (Gemini/Local)            (Plugins/Mods)              (Aluga de outro node)
              │                         │                         │
              ▼                         ▼                         ▼
        PC → custo serviço        PC → dev + Panda          PC → host + Panda
        (uso normal)              (Medusa Split)             (95/5 split)
```

| Hook                 | Trigger                          | PC Flow                  | Split aplicado           |
| -------------------- | -------------------------------- | ------------------------ | ------------------------ |
| **AI Inference**     | User pede IA (chat, image, code) | PC debita do Wallet      | Cloud cost × 4.0x markup |
| **Store Purchase**   | User compra módulo/plugin        | PC debita → Medusa Split | 52% dev / 48% Panda      |
| **P2P Compute**      | User submete task (render, ML)   | PC debita → paga Host    | 95% host / 5% Panda      |
| **Premium Features** | BYOL tools, export, etc.         | PC debita → custo uso    | 100% Panda               |

### 16.12 Gateways de Entrada

> **Clarificação:** Mining não é foco de hooks externos. Mining existe para **fomentar o node** — Panda é um ecossistema SaaS. A mineração incentiva users a manter nodes ativos que beneficiam todo o ecossistema.

#### Entrada (Cripto/Fiat → Ecossistema)

| Gateway               | Descrição                                   | Fee                |
| --------------------- | ------------------------------------------- | ------------------ |
| **Pool → Panda**      | Unmineable (multi-coin) → carteira PJ Panda | Pool fee (1-2%)    |
| **Oracle Conversion** | Cripto → PC via spot price e fator x0.60    | Embutido no x0.60  |
| **Fiat → PC**         | User compra PC com PIX/cartão               | Gateway fee (3-5%) |

> **Multi-Coin Rig:** Unmineable funciona como gateway multi-moeda — o Rust Agent minera o algoritmo mais rentável (RandomX, Ethash, etc.) e a pool converte automaticamente para a moeda escolhida. O user não precisa configurar nada.

#### Saída (PC → Fora)

| Gateway                      | Fase 1 (0-10k users) | Fase 2 (Token)      |
| ---------------------------- | -------------------- | ------------------- |
| **PC → Fiat (R$)**           | ❌ Closed-loop       | ✅ Via exchange     |
| **PC → Cripto**              | ❌ Closed-loop       | ✅ PC = Token       |
| **PC → Store/AI/Compute**    | ✅ Sempre            | ✅ Sempre           |
| **PC → Marketplace externo** | ✅ Via Medusa hooks  | ✅ Via Medusa hooks |

> **Visão de longo prazo:** PC é **closed-loop na Fase 1** — gasta só dentro do ecossistema. Na Fase 2, **PC se torna um token real** — esse é um dos motivos estratégicos da Hold Reserve: construir reserva monetária para backing do token futuro.

### 16.13 Machine Rental (Aluguel via Rust Agent)

O Rust Agent permite que users **aluguem hardware ocioso** para outros users. **Foco principal: integração Google.**

> **Rigs Remotas:** Nada impede que rigs dedicadas entrem no Panda — principalmente pensando no futuro cripto e no aluguel de processamento. Rigs remotas são bem-vindas.

```text
USER A (tem GPU ociosa)              USER B (precisa de GPU)
    │                                     │
    ├── Rust Agent detecta ociosidade     ├── Submete task via SDK
    ├── Marca recursos como disponíveis   ├── Panda seleciona melhor node
    │                                     │
    └──────────── MATCH ──────────────────┘
                    │
              Panda intermediá
              ├── User B paga X PC
              ├── 95% → User A (host)
              └── 5% → Panda (ops)
```

**Pricing competitivo vs Google Cloud:**

| Recurso                    | Google Cloud | Panda P2P        | Saving user |
| -------------------------- | ------------ | ---------------- | ----------- |
| GPU hora (RTX 3060 equiv.) | ~$0.50/h     | ~$0.30/h (30 PC) | ~40%        |
| CPU vCore/hora             | ~$0.04/h     | ~$0.02/h (2 PC)  | ~50%        |
| Storage GB/mês             | ~$0.02       | ~$0.01 (1 PC)    | ~50%        |

> **Dev-first:** P2P Compute é mais barato que Google Cloud porque roda em hardware ocioso. O host ganha 95% e o consumidor paga menos. Panda é **Google-only** — sem AWS/Azure.

### 16.14 Hold Strategy (Reserva Cripto → Token Futuro)

Panda **não liquida 100%** da cripto minerada. A reserva tem **dupla função**:

1. **Curto prazo:** Reserva monetária para estabilidade operacional
2. **Longo prazo:** Backing para quando **PC se tornar um token real** (on-chain)

| Fase          | Users  | Liquida | Hold | Lógica                                 |
| ------------- | ------ | ------- | ---- | -------------------------------------- |
| **Bootstrap** | 0-1k   | 70%     | 30%  | Cobrir custos iniciais                 |
| **Growth**    | 1k-10k | 40%     | 60%  | Receitas orgânicas crescem             |
| **Mature**    | 10k+   | 20%     | 80%  | Autossuficiente, reserva = backing     |
| **Token**     | 100k+  | 10%     | 90%  | PC vira token, reserva = garantia real |

> **Visão:** O user não recebe cripto hoje — recebe PC. Quando a base crescer e o PC virar token on-chain, a reserva de cripto acumulada vira o **backing real** do token. Quem minerou desde o início terá PCs que valem mais.

### 16.15 Modelo Uber & Compliance

> **Filosofia:** Modelo Uber — Panda é a plataforma, user fornece o ativo (hardware). User ganha para participar. Quanto mais nodes, mais Panda lucra. **Sem limites de farms.**

| Regra                      | Descrição                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Sem limite de hardware** | Processamento é adaptativo — qualquer máquina pode participar      |
| **Nível adaptativo**       | Rust Agent ajusta carga conforme capacidade do hardware            |
| **User controla**          | Nível de processamento pode ser ajustado ou desligado pelo user    |
| **Sem limite de nodes**    | User pode conectar quantas máquinas quiser — Panda lucra em volume |
| **Rigs remotas**           | Rigs dedicadas são bem-vindas (futuro cripto + aluguel)            |
| **Benchmark automático**   | Tier assignment real via benchmark (Seed→Titan)                    |
| **SLA Uptime Rewards**     | Bônus por manter node ligado 24/7 (ver §17.16)                     |
| **LGPD**                   | Dados coletados sempre explícitos via warning na 1ª utilização     |
| **Energy cost**            | User-side (modelo Uber) — estimativa visível no dashboard          |
| **Sem garantia hardware**  | User assume risco do próprio hardware (modelo Uber)                |
| **Phantom Protocol**       | 15% recursos sempre livres, suspensão <100ms em atividade          |
| **Escalabilidade**         | PAT regula inflação automaticamente (Art. 1, teto 5%)              |

### 16.16 SLA & Uptime Rewards

Nodes com uptime consistente ganham **bônus progressivo** no fator de conversão:

| Uptime (30 dias) | Bônus fator | Fator efetivo | Descrição             |
| ---------------- | ----------- | ------------- | --------------------- |
| < 50%            | 0%          | x0.60         | Fator base            |
| 50-75%           | +2%         | x0.62         | Parceiro regular      |
| 75-90%           | +5%         | x0.65         | Parceiro dedicado     |
| 90-99%           | +8%         | x0.68         | Parceiro confiável    |
| 99%+             | +10%        | x0.70         | Parceiro elite (24/7) |

> **Incentivo:** Quanto mais tempo online, maior o fator. Isso incentiva nodes estáveis e beneficia users que mantêm máquinas dedicadas. O custo extra é absorvido pela maior produtividade do network.

### 16.17 Segurança

- 🖥️ **Rust-only**: Mineração executa APENAS no Rust Agent (nativo), nunca no browser
- ⚠️ **Consentimento explícito** na instalação do Rust Agent
- ⚠️ **Desativável a qualquer momento** via Settings → ⛏️ Mining
- 📊 **Transparência total**: stats de ganho visíveis no painel Mining (web dashboard)
- 🔒 **CPU Limit**: User controla quanto recurso destina (25-75%)
- 💰 **Fator x0.60**: flat, transparente, sem tiers — parceria igualitária
- 🔮 **Panda Oracle**: Agente monitora preços e processa pagamentos automaticamente
- 📋 **Sem mineração oculta**: processo aparece claramente no SO (task manager)
- 🏛️ **Isolamento fiscal**: User recebe PC (Energy Credits), Panda declara impostos

---

### 16.18 Contingência "Mining Zero"

> **Ref:** Auditoria Econômica §14.1 | Aprovado: 2026-02-13

Se a receita de mining **cair a zero**, o projeto sobrevive:

```text
CENÁRIO "MINING ZERO":

RECEITA REMANESCENTE (sem mining):
├── Store (módulos/themes): ~R$3.000/mês
├── AI Compute (inference): ~R$2.500/mês
├── P2P (comissões):        ~R$1.500/mês
└── Licenças Enterprise:    ~R$500/mês
    TOTAL SEM MINING:       ~R$7.500/mês

CUSTOS OPERACIONAIS:
├── Firebase (free tier):   R$0
├── GAS (free tier):        R$0
├── Domínio:                ~R$50/mês
├── Misc:                   ~R$100/mês
└── TOTAL CUSTOS:           ~R$150/mês

CONCLUSÃO: Projeto SOBREVIVE sem mining.
├── Backing on-chain atrasado em ~3-4× (R$840 vs R$4.890/mês)
├── Timeline on-chain: 24 meses → ~72 meses
└── MITIGAÇÃO: Compensar com crescimento agressivo da Store/AI
```

| Métrica                     | Valor                                  |
| --------------------------- | -------------------------------------- |
| **Receita mínima survival** | R$7.500/mês                            |
| **Trigger de alerta**       | Mining < 30% da receita total          |
| **Ação automática**         | PAT ativa "Plan B" (prioriza Store/AI) |

---

### 16.19 Compliance Fiscal (IN RFB nº 1.888/2019)

> **Ref:** Auditoria Econômica §14.2

> [!NOTE]
> **Esta seção é um mapeamento inicial informativo.** O CNAE, regime tributário e obrigações específicas serão aprofundados com contador e advogado tributarista na hora certa. O conteúdo abaixo serve como base de partida pra essa conversa futura — não como decisão final.

```text
IN 1888/2019 — MAPEAMENTO PRELIMINAR:

1. DECLARAÇÃO MENSAL à Receita Federal:
   ├── Obrigatória se operações > R$30.000/mês via exchange estrangeira/P2P
   ├── Prazo: último dia útil do mês subsequente
   └── Exchange BR declara automaticamente (pra operações via exchange nacional)

2. IMPOSTOS INCIDENTES (sobre receita de mining):
   ├── IRPJ — Imposto sobre Renda PJ
   ├── CSLL — Contribuição Social s/ Lucro Líquido
   ├── PIS — Programa de Integração Social
   └── COFINS — Financiamento da Seguridade Social

3. CNAE — NÃO existe código específico pra mining de cripto
   ├── Opções: "Prestação de Serviços de TI" ou "Atividades de Tecnologia"
   ├── NOTA: CNAE 6311-9/00 (Tratamento de dados) é candidato inicial
   ├── Existem mais CNAEs aplicáveis — será aprofundado na hora certa
   └── Decisão final requer análise contábil completa

4. REGIME TRIBUTÁRIO (mapeamento):
   ├── Faturamento < R$4.8M/ano → SIMPLES NACIONAL
   │   └── Anexo V (Serviços de TI): 15.50% a 30.50% alíquota efetiva
   ├── Faturamento R$4.8M-R$78M → LUCRO PRESUMIDO
   │   └── Base: 32% × Receita Bruta | IRPJ 15% + CSLL 9% + PIS 0.65% + COFINS 3%
   └── Faturamento > R$78M → LUCRO REAL (obrigatório)

5. USER NÃO DECLARA DARF:
   ├── User recebe PC (Energy Credits), NÃO cripto
   ├── PC off-chain = ponto digital, não ativo financeiro
   ├── Isolamento fiscal via modelo PJ (Panda minera, user recebe PC)
   └── ⚠️ VALIDAR com advogado tributarista se PC pode ser reclassificado
```

> [!NOTE]
> **Consultoria tributária:** Será necessária na hora certa (estimar R$2-5k). Esta seção é uma nota inicial pra informar essa conversa futura. Não é urgente pra MVP.

---

### 16.20 Monitor de Inflação & Regulação PAT

> **Ref:** Auditoria Econômica §14.3 | Art.1 (teto 5% inflação)

```text
MODELO DE BREAK-EVEN — QUEIMA vs EMISSÃO:

EMISSÃO (Mining → PC):
├── 100 users mining × 30 PC/dia × 30 dias = 90.000 PC/mês
├── 500 users = 450.000 PC/mês
├── 1000 users = 900.000 PC/mês
└── Emissão escala LINEAR com users minerando

QUEIMA (Store + AI → Burn PC):
├── Store: avg 50 PC/compra × 3 compras/mês/user = 150 PC/user/mês
├── AI Inference: avg 5 PC/dia × 30 dias = 150 PC/user/mês
├── TOTAL por user ativo: ~300 PC/mês (se usa Store E AI)
└── Queima escala com users ATIVOS (não mineradores)

BREAK-EVEN P/ 1000 MINERADORES:
├── Emissão: 900.000 PC/mês
├── Queima necessária: ≥ 900.000 PC/mês
├── Users ativos necessários: 900.000 ÷ 300 = 3.000 users
├── RATIO MÍNIMO: 3 users ativos : 1 minerador
└── Se ratio < 3:1, inflação > 0 → PAT intervém (Art.1)

PAT INTERVENTION (Art.1 teto 5%):
├── Se inflação > 5%, PAT ativa Burn automático da reserva
├── Redução do fator mining (x0.60 → x0.55 → x0.50)
├── Nuclear: pausar onboarding de novos mineradores
│
├── 🔧 AJUSTE DECIMAL (mecanismo PAT adicional):
│   ├── PAT pode AUMENTAR ou REDUZIR casas decimais do PC
│   ├── Inflação alta → PC ganha casas (1.00 PC → 1.0000 PC)
│   │   └── Efeito: granularidade maior, preços menores por unidade
│   ├── Deflação excessiva → PC perde casas (1.0000 → 1.00)
│   │   └── Efeito: simplifica UX, preços maiores por unidade
│   └── Regulador suave: não muda supply, muda PERCEPÇÃO do valor
│
└── SLA BONUS (x0.60→x0.70) — MANTIDO COM CONTROLES:
    ├── Mecanismo: bônus progressivo por uptime (ver §17.16)
    ├── Controle 1: PAT pode suspender bônus se inflação > 5%
    ├── Controle 2: cap máximo do bônus = +10% (x0.70 absoluto)
    ├── Controle 3: GAS cron monitora impacto do SLA no supply
    └── Controle 4: dashboard público mostra custo real do SLA
```

| Ferramenta            | Trigger                       | Efeito                         |
| --------------------- | ----------------------------- | ------------------------------ |
| **Inflation Monitor** | GAS cron job semanal          | Calcula ratio emissão/queima   |
| **Auto-throttle**     | Ratio < 3:1 por 30 dias       | Reduz fator mining em 5%       |
| **Decimal shift**     | Inflação/deflação persistente | Ajusta casas decimais do PC    |
| **SLA suspend**       | Inflação > 5%                 | Suspende bônus, todos em x0.60 |
| **Dashboard público** | Sempre ativo                  | "Emissão vs Queima" no Header  |

---

### 16.21 Estratégia de Market Making (DEX)

> **Ref:** Auditoria Econômica §14.4 | Aplicável mês 24 (on-chain)

```text
FASE 1: LAUNCH (mês 24 — on-chain)
├── Plataforma: Raydium (Solana AMM) — melhor ecossistema pra SPL tokens
├── Par: PC/USDC (USDC > DAI no Solana)
├── Fee tier: 1% (recomendado pra small-cap volátil)
├── Liquidez inicial: 20% da reserva stablecoin (~R$29k USDC + PC equivalente)
├── Concentrated range: PC $0.008 - $0.015 (±50% do peg $0.01)
└── Custo de setup: ~$50 em SOL (gas Solana é barato)

FASE 2: GROWTH (mês 25-30)
├── Rebalanceamento automático via Kamino Finance (Solana ALM)
├── Amplia range pra $0.005 - $0.025 conforme volume cresce
├── Meta: slippage < 1% em trades < $500
└── Custo mensal: ~$10 em gas + Kamino fee ~0.1%

MM ALGORÍTMICO (PAT como Market Maker):
├── PAT atua como MM via smart contract
│   ├── Compra PC quando preço < $0.009 (suporte)
│   ├── Vende PC da reserva quando preço > $0.012 (resistência)
│   └── Budget mensal: 10% da receita de queima em BRL
└── Escalar pra MM profissional quando volume > $100k/dia
```

---

### 16.22 Vesting Schedule (Supply Panda)

> **Ref:** Auditoria Econômica §14.5 | Framework adaptável

```text
4M PC DO PANDA NO LAUNCH — DISTRIBUIÇÃO:

┌─────────────────────────────────────────────────────────────┐
│  30% QUEIMA IMEDIATA (1.2M PC) — Day 1 on-chain            │
│  ├── Burned via smart contract público e verificável        │
│  ├── Supply circulante reduz permanentemente                │
│  └── Sinal de confiança pro mercado                         │
├─────────────────────────────────────────────────────────────┤
│  40% LOCK 2 ANOS (1.6M PC) — Timelock smart contract        │
│  ├── Transfer bloqueado por contrato on-chain               │
│  ├── Verificável por qualquer pessoa (Solana Explorer)      │
│  ├── Desbloqueio linear: 5% a cada trimestre após 2 anos   │
│  └── Uso: backing buffer, emergência, expansão              │
├─────────────────────────────────────────────────────────────┤
│  30% GOVERNANÇA/REWARDS (1.2M PC) — Liberação gradual      │
│  ├── 50% pra pool DEX (liquidez)                            │
│  ├── 30% pra rewards (educação, bounties, early adopters)   │
│  └── 20% pra PAT Burns (anti-inflação)                     │
└─────────────────────────────────────────────────────────────┘

RESULTADO PÓS-LAUNCH:
├── Supply circulante: 10M - 1.2M (burned) = 8.8M PC
├── Panda unlocked: 1.2M (governança) = 13.6% do supply
├── Panda locked: 1.6M (timelock 2y) = 18.2% (não vendável)
└── Percepção: Panda "controla" apenas 13.6% → aceitável
```

> [!NOTE]
> O mercado pode expandir absurdamente — nesse cenário, os números absolutos mudam mas as proporções se mantêm. No momento o cenário é tranquilo. O interesse real e a dinâmica de mercado serão avaliados conforme o projeto escala. Este vesting é um framework, não regra final.

**Implementação:** Smart contract Anchor (Solana) com Timelock público.

---

### 16.23 Migração Off-Chain → On-Chain

> **Ref:** Auditoria Econômica §14.6

```text
PROCESSO DE 4 ETAPAS:

ETAPA 1: SNAPSHOT (D-30 antes do launch)
├── Firebase RTDB exporta todos os saldos PC
├── Formato JSON: { wallet: Ed25519_pubkey, balance: PC_amount }
├── Snapshot publicado no IPFS/Arweave (imutável)
├── Hash SHA-256 do snapshot publicado no Solana (registro permanente)
└── Users podem verificar seu saldo no dashboard antes do launch

ETAPA 2: MINT SPL TOKEN (D-7)
├── Deploy PC-Token como SPL Token no Solana Mainnet
├── Mint authority: Founder Ed25519 (vira wallet Solana)
├── Total mint: exatamente o total de PC no snapshot
├── Mint authority revocada após distribuição completa
└── Metadata: Nome "Panda Coin", Symbol "PC", decimals 6

ETAPA 3: CLAIM PERIOD (D-Day → D+180)
├── Claim site dedicado (pandafactory.io/claim)
├── User conecta wallet (Phantom/Backpack)
├── Verifica eligibilidade via Merkle Tree (ZK compressed)
├── Claim gera ATA (Associated Token Account) + transfer
├── Custo pra Panda: ~$0.001/claim via ZK compression (Helius)
└── Pra 100k users: ~$100 total (vs ~$50k sem compression)

ETAPA 4: DEADLINE + UNCLAIMED (D+180)
├── Após 180 dias: claim encerra
├── PC não-migrado → queimado da mint (supply permanentemente reduzido)
├── Efeito: deflacionário — unclaimed vira queima involuntária
├── Estimativa: 10-20% dos users não migram → burns ~1-2M PC
└── Alternativa: grace period de +90 dias via governança DAO
```

| Etapa    | Timeline      | Ação                                    |
| -------- | ------------- | --------------------------------------- |
| Snapshot | D-30          | Exportar Firebase → IPFS/Arweave        |
| Mint SPL | D-7           | Deploy token Solana + publicar metadata |
| Claim    | D-Day → D+180 | Site de claim com ZK compression        |
| Deadline | D+180         | Queima de PC não-migrado                |

---

> 📖 **Versão:** 4.2.0 | **Consolidado:** TOKENOMICS + PAT + GOVERNANCE + SYSTEM DESIGN + MODULE REVENUE + MINING + COMPLIANCE FISCAL + INFLATION MONITOR + MARKET MAKING + VESTING + MIGRAÇÃO | **Auditoria:** 2026-02-13
