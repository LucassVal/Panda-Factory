# 💰 PANDA COIN - Tokenomics & PAT Reference

> **Versão:** 2.0.0 | **Fonte:** PF_MASTER_ARCHITECTURE.md §9

---

## 1. Filosofia

> **"O Token é Energia. Quem produz, ganha. Quem consome, paga. O Fundador recebe eternamente."**

---

## 2. Estrutura de Valor do Panda Coin (PC)

PC = **Energy Credit** lastrado em custo computacional real, não especulativo.

### 2.1. Fórmula Base (Constituição Art. 5)

```
Preço_Base = Custo_Cloud_Médio × MULTIPLICADOR

MULTIPLICADOR:
- Piso: 2.5x (preço cheio)
- Máximo Desconto: 1.25x (50% off)

Exemplo:
$0.10/hora × 2.5 = $0.25/hora ≈ 1000 PC
```

### 2.2. Split de Receita (Transações)

| Destino             | Store/Compute | P2P Off-chain | P2P On-Chain |
| ------------------- | ------------- | ------------- | ------------ |
| **Dev/Host**        | 55%           | 95%           | 95%          |
| **Fundo Incentivo** | 22%           | 1%            | 1%           |
| **Panda Ops**       | 15%           | 4%            | 1%           |
| **Founder (Lucas)** | 5%            | 0%            | 0%           |
| **Gateway/GAS**     | 3%            | 0%            | 3%           |

> **Lógica P2P:** Taxa total 5% (Base) a 10% (Teto). Host blindado mín 90%.

---

## 3. Treasury Backing (Reservas & Lastro) 🏦

O Panda Coin é lastreado em ativos reais:

```
┌─────────────────────────────────────────────────────────────┐
│              TREASURY - ARQUITETURA DE LASTRO               │
├─────────────────────────────────────────────────────────────┤
│  PAXG (Ouro Tokenizado) - LASTRO PRIMÁRIO 🥇               │
│  ├── Proporção: ~70% das reservas                          │
│  ├── Blockchain: Ethereum (ERC-20) / Solana (Wrapped)      │
│  └── Razão: Proteção contra inflação                       │
│                                                             │
│  USDC (Dólar Tokenizado) - LIQUIDEZ 💵                      │
│  ├── Proporção: ~30% das reservas                          │
│  └── Função: Saques rápidos, liquidez imediata             │
└─────────────────────────────────────────────────────────────┘
```

### 3.1. Métricas de Saúde

| Métrica             | Fórmula                 | Meta       |
| ------------------- | ----------------------- | ---------- |
| **Backing Ratio**   | Reservas / Supply       | ≥ 100%     |
| **Runway**          | Reservas / Custo Mensal | ≥ 12 meses |
| **PAXG Ratio**      | PAXG / Total Reservas   | 60-80%     |
| **Liquidity Ratio** | USDC / Saques (30d)     | ≥ 3x       |
| **Snapshot Age**    | Tempo desde último hash | < 24h      |

### 3.2. Widget do Header (Arc Energy Bar)

```
╭──────────────────────────────────────────────────╮
│  [Logo]  FB ●  RU ●  GPU ●     ╭───╮  🏦 92%  ⚙️  │
│                               │ 65%│              │
│                               ╰───╯              │
│                                ▲          ▲      │
│                          Arc Energy    Treasury  │
│                          (PC Balance)   Health   │
╰──────────────────────────────────────────────────╯
```

---

## 4. Hierarquia de Governança (4 Camadas)

```
CAMADA 1: HARDCODE (Constituição Imutável)
[Piso 2.5x] [Founder 5%] [Min Fundo 15%]
      │
      ▼
CAMADA 2: DAO (Congresso Político)
[Define Splits flutuantes] [Aprova Parcerias]
      │
      ▼
CAMADA 3: BANCO CENTRAL IA (PAT - Executivo)
[Controla Inflação] [Gere Fundo] [Executa Queimas]
      │
      ▼
CAMADA 4: MERCADO ÚNICO (Varejo)
[Vende Tokens] [Aplica Descontos] [Coleta Taxas]
```

### 4.1. Constituição Federal (12 Artigos - Hardcoded)

| Art | Nome           | Regra                   | Razão                       |
| --- | -------------- | ----------------------- | --------------------------- |
| 1   | Teto Inflação  | Max 5% ao ano           | Trava contra desvalorização |
| 2   | Panda Labs     | 25% do Fundo → Educação | Verba garantida             |
| 3   | Reserva Ops    | 20% Lucro Ops → Caixa   | Emergência                  |
| 4   | Crescimento    | 65% do Fundo → Ação     | Subsídios                   |
| 5   | Piso Preço     | 2.5x (Min 1.25x)        | Solvência                   |
| 6   | Founder Fee    | 5% Bruto Eterno         | "Satoshi Fee"               |
| 7   | Garantia Host  | 90% a 95% (5-10%)       | Protege P2P                 |
| 8   | Reserva Fundo  | Max 10%                 | Overflow reinveste          |
| 9   | Bill of Rights | Liberdade Total         | Direitos Civis              |
| 10  | Arbitragem     | IA → Founder            | Escalação                   |
| 11  | Leis Pétreas   | Imutável                | Eterna                      |
| 12  | Emergência     | Failover Agent          | Resiliência                 |

### 4.2. Bill of Rights (Art. 9)

| Direito       | Regra                | Razão                  |
| ------------- | -------------------- | ---------------------- |
| Free Speech   | Censura Zero         | Protocolo agnóstico    |
| Non-Expulsion | Banimento Impossível | Chave privada soberana |
| Rust Law      | Execução Consentida  | Pop-up obrigatório     |

---

## 5. PAT - Panda AI Treasury (Banco Central IA)

### 5.1. Evolução do Controle

| Era         | Quem Governa?          | Papel do Founder           |
| ----------- | ---------------------- | -------------------------- |
| **Dia 1**   | IA Assistida (Alpha)   | Piloto: aprova sugestões   |
| **Escala**  | IA Autônoma (Beta)     | Auditor: monitora          |
| **Suprema** | IA Soberana (Overmind) | Kill Switch: só emergência |

### 5.2. Ferramentas PAT

| Tool               | Nível | Gatilho        | Ação                 | Resultado        |
| ------------------ | ----- | -------------- | -------------------- | ---------------- |
| **Reinvestimento** | 🟢    | Reserva > 10%  | Distribui excedente  | Zero Ociosidade  |
| **Aceleração**     | 🟡    | Deflação > 2%  | Aumenta Grants       | Atrai usuários   |
| **Vesting**        | 🟠    | Compra > 5M PC | Trava tokens (30/70) | Anti Pump&Dump   |
| **Burn**           | 🔴    | Inflação > 5%  | Queima da Reserva    | Deflação Forçada |

### 5.3. Capacidades (Google Organism)

1. **Hunter de Inovação:** Monitora Google Garden + HuggingFace
2. **Trend Watcher:** Detecta demandas emergentes
3. **Cloud Native:** Aloca/desaloca recursos dinamicamente

---

## 6. Mercado Único (Camada 4)

Descontos automáticos por volume histórico:

| Volume     | Desconto | Fonte            |
| ---------- | -------- | ---------------- |
| Iniciante  | 0%       | Mercado Aberto   |
| Dev Ativo  | 5-20%    | Mercado Aberto   |
| Enterprise | 30-50%   | Reserva Liquidez |

---

## 7. Custos BASE por Módulo

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

## 8. Alocação do Fundo (100%)

| Destino         | %       | Detalhamento                                 |
| --------------- | ------- | -------------------------------------------- |
| **Labs**        | 25%     | 20% Bolsas + 5% Infra                        |
| **Crescimento** | 65%     | 30% Robin Hood + 20% Afiliados + 15% Eventos |
| **Reserva**     | 10% max | Overflow → PAT reinveste                     |

---

## 9. Planos de Assinatura

| Plano    | Preço    | PC Incluídos | PC/R$ |
| -------- | -------- | ------------ | ----- |
| Free     | R$ 0     | 100 PC       | -     |
| Starter  | R$ 9,90  | 500 PC       | 50,5  |
| Pro      | R$ 29,90 | 2000 PC      | 66,9  |
| Business | R$ 99,90 | 8000 PC      | 80,1  |
| Lifetime | R$ 150   | 500 PC/mês   | ∞     |

---

> 📖 **Referência:** [PF_MASTER_ARCHITECTURE.md §9](PF_MASTER_ARCHITECTURE.md#9-ecossistema-tokenomics--monetização)
