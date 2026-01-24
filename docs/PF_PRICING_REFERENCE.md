# 💰 PANDA COIN - Economia & Pricing Dinâmico

> **Versão:** 1.1.0 | **Controlado por:** PAT (Panda AI Treasury)

---

## ⚡ PC = Energy Credit

O Panda Coin (PC) é um **crédito de energia computacional**, não uma moeda especulativa.

### Fórmula Base (Hardcoded - Constituição Art. 5)

```
1 PC = Custo_Cloud_Médio × MULTIPLICADOR
MULTIPLICADOR = 2.5 (Piso) até 1.25 (Máximo Desconto 50%)
```

**Exemplo Real:**

```
Custo Cloud Médio = $0.10/hora
1000 PC = $0.10 × 2.5 = $0.25 de poder computacional
```

---

## 🏛️ PAT - Banco Central IA

O PAT controla dinamicamente os preços baseado em:

| Métrica       | Ação se Alto           | Ação se Baixo     |
| ------------- | ---------------------- | ----------------- |
| Inflação > 5% | 🔥 Burn tokens         | -                 |
| Deflação > 2% | -                      | 💸 Acelera grants |
| Reserva > 10% | 📈 Reinveste excedente | -                 |

### Ferramentas PAT

| Tool         | Descrição                          |
| ------------ | ---------------------------------- |
| `reinvest`   | Excedente reserva → Labs/Subsídios |
| `accelerate` | Aumenta grants se deflação         |
| `burn`       | Queima tokens se inflação alta     |
| `vesting`    | Libera tokens gradualmente         |

---

## 📊 Custos BASE por Módulo

> ⚠️ **Valores são BASE REFERENCE**. PAT ajusta dinamicamente.

### Fórmula de Conversão

```
CUSTO_REAL = CUSTO_BASE × PAT_MULTIPLIER

PAT_MULTIPLIER varia de 0.5 (economia) a 1.5 (demanda alta)
Default: 1.0
```

### WhatsApp

| Ação         | Base PC | Energia Equiv.  |
| ------------ | ------- | --------------- |
| Mensagem     | 1-2     | ~0.001 GPU-hora |
| Chatbot/conv | 10      | ~0.01 GPU-hora  |
| Campanha     | 20      | ~0.02 GPU-hora  |

### Twitter

| Ação        | Base PC | Energia Equiv.  |
| ----------- | ------- | --------------- |
| Tweet       | 5       | ~0.005 GPU-hora |
| Thread      | 20      | ~0.02 GPU-hora  |
| AI Generate | 15      | ~0.015 GPU-hora |

### YouTube

| Ação          | Base PC | Energia Equiv. |
| ------------- | ------- | -------------- |
| Upload        | 10      | ~0.01 GPU-hora |
| Thumbnail AI  | 30      | ~0.03 GPU-hora |
| Short Extract | 50      | ~0.05 GPU-hora |

### Meta

| Ação      | Base PC | Energia Equiv.  |
| --------- | ------- | --------------- |
| Post      | 15      | ~0.015 GPU-hora |
| Reel      | 25      | ~0.025 GPU-hora |
| Carrossel | 40      | ~0.04 GPU-hora  |

### cTrader

| Ação      | Base PC | Energia Equiv. |
| --------- | ------- | -------------- |
| Trade     | 10      | ~0.01 GPU-hora |
| AI Signal | 50      | ~0.05 GPU-hora |
| Backtest  | 100     | ~0.1 GPU-hora  |

### Brain (IA)

| Modelo       | Base PC/1k tokens | Free Tier |
| ------------ | ----------------- | --------- |
| Gemini Flash | **0**             | 500k/mês  |
| Gemini Pro   | 30                | -         |
| Claude 3.5   | 45                | -         |
| GPT-4o       | 50                | -         |
| Local (GPU)  | **0**             | ∞         |

---

## 🔄 Monitor em Tempo Real

O Header exibe o **Panda Meter** (Arc Energy Bar):

```
╭───────────────────────────────────╮
│  [Logo]  FB● RU● GPU●    ╭───╮ 🏦 │
│                         │65%│ 92% │
│                         ╰───╯     │
╰───────────────────────────────────╯
         ▲                    ▲
    PC Balance          Treasury Health
```

- **Arc (65%)**: Saldo de PC do usuário
- **Treasury (92%)**: Saúde do backing (PAXG + USDC)

---

## 📈 Alocação do Fundo (Hardcoded)

| Destino         | %       | Gestão              |
| --------------- | ------- | ------------------- |
| Labs (Educação) | 25%     | Automático          |
| Crescimento     | 65%     | PAT decide          |
| Reserva         | 10% max | Overflow → reinvest |

---

> 📖 **Referência:** [PF_MASTER_ARCHITECTURE.md §9](PF_MASTER_ARCHITECTURE.md)
