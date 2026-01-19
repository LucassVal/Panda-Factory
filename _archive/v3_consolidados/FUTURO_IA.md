# 🤖 FUTURO IA - Agentes e Automações

**Roadmap IA:** v2.0 (Junho 2026)  
**Plataforma:** Gemini API (Google)  
**Arquitetura:** Cloud Functions + Apps Script

---

## 🎯 Visão Geral

TitanGestão v2.0 adiciona **agentes IA** para automação completa de:

✅ WhatsApp (atendimento 24/7)  
✅ Email marketing  
✅ Follow-up automático  
✅ Previsões e insights  
✅ Automações customizáveis

**Modelo:** R$ 47/mês (adicional à licença base R$ 149,90)

---

## 🤖 AGENTES IA

### 1. Agente WhatsApp 24/7

**Funcionalidades:**

- Responde leads automaticamente
- Qualifica prospect (perguntas inteligentes)
- Agenda demonstração
- Envia orçamento
- Follow-up persistente

**Implementação:**

```javascript
// Cloud Function
exports.onWhatsAppMessage = functions.https.onRequest(async (req, res) => {
  const { from, message } = req.body;

  // 1. Buscar contexto do cliente
  const cliente = await getClienteByPhone(from);
  const historico = cliente?.historico || [];

  // 2. Gerar resposta com Gemini
  const prompt = `
    Você é assistente da ${empresaNome}.
    
    Contexto:
    - Cliente: ${cliente?.nome || "Novo lead"}
    - Histórico: ${JSON.stringify(historico)}
    
    Mensagem recebida: "${message}"
    
    Responda de forma consultiva, amigável.
    Objetivo: agendar demonstração.
  `;

  const response = await gemini.generateContent(prompt);

  // 3. Enviar WhatsApp
  await whatsappAPI.send({ to: from, message: response.text() });

  // 4. Salvar no CRM (Apps Script sincroniza)
  await saveToDrive(cliente.driveToken, {
    entity: "historico",
    entityId: cliente.id,
    value: { tipo: "whatsapp_ia", mensagem: response.text() },
  });
});
```

### 2. Email Marketing Inteligente

**Automações:**

- Campanha boas-vindas (5 emails)
- Follow-up pós-orçamento
- Remarketing clientes inativos
- Newsletter personalizada

**Implementação:**

```javascript
// Trigger: Cliente no meio do funil há 7 dias
exports.followUpAutomatico = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    const clientesParados = await getClientesSemMov;
    imento(7);

    for (const cliente of clientesParados) {
      const prompt = `
        Gere email follow-up para:
        Nome: ${cliente.nome}
        Interesse: ${cliente.interesse}
        Último contato: ${cliente.ultimoContato}
        
        Tom: Consultivo, não vendedor
      `;

      const email = await gemini.generateContent(prompt);

      await sendEmail({
        to: cliente.email,
        subject: email.subject,
        body: email.body,
      });
    }
  });
```

### 3. Insights Preditivos

**Funcionalidades:**

- Probabilidade de compra
- Melhor dia/horário para contato
- Mensagem ideal
- Próximos passos sugeridos

**Implementação:**

```javascript
// Vertex AI (ML model)
const insights = await vertexAI.predict({
  model: "titan-lead-score",
  input: {
    fonte: cliente.fonte,
    interesse: cliente.interesse,
    diasNoFunil: cliente.diasNoFunil,
    interacoes: cliente.historico.length,
  },
});

// Salvar no Drive
cliente._ia_insights = {
  probabilidade_compra: insights.score, // 0-1
  proximo_contato_sugerido: insights.next_contact_date,
  mensagem_sugerida: insights.suggested_message,
  confidence: insights.confidence,
};
```

---

## 📧 EMAIL MARKETING INTERNO

**v2.0 adiciona módulo completo:**

### Interface no CRM

```html
<!-- Nova aba: Email Marketing -->
<div id="email-view">
  <h2>📧 Campanhas Email</h2>

  <!-- Criar campanha -->
  <button onclick="criarCampanha()">+ Nova Campanha</button>

  <!-- Lista campanhas -->
  <div id="campanhas-list">
    <div class="campanha-card">
      <h3>Boas-vindas Novos Leads</h3>
      <p>5 emails • Taxa abertura: 42% • Conversão: 8%</p>
      <button onclick="editarCampanha()">Editar</button>
    </div>
  </div>

  <!-- Editor campanha (Gemini gera conteúdo) -->
  <div id="editor" style="display:none;">
    <input placeholder="Assunto do email" />
    <textarea placeholder="Corpo (HTML)"></textarea>
    <button onclick="gerarComIA()">✨ Gerar com IA</button>
  </div>
</div>
```

### Backend

```javascript
// Cloud Function: Enviar campanha
exports.sendCampaign = functions.https.onCall(async (data, context) => {
  const { campaignId, userId } = data;

  // 1. Buscar destinatários
  const clientes = await getClientesBySegment(campaignId);

  // 2. Para cada cliente
  for (const cliente of clientes) {
    // 3. Personalizar com IA
    const emailPersonalizado = await gemini.generateContent(`
      Personalize este email para:
      Nome: ${cliente.nome}
      Empresa: ${cliente.empresa}
      
      Template: ${campaign.template}
    `);

    // 4. Enviar
    await sendEmail({
      to: cliente.email,
      subject: emailPersonalizado.subject,
      body: emailPersonalizado.body,
    });

    // 5. Salvar no histórico
    await saveToDrive(cliente.driveToken, {
      entity: "historico",
      value: { tipo: "email_campanha", enviado: true },
    });
  }
});
```

---

## 🔄 AUTOMAÇÕES CUSTOMIZÁVEIS

### Workflow Builder (v2.0)

**Interface visual:**

```
Trigger: Novo lead cadastrado
    ↓
Condição: Se fonte = "Google Ads"
    ↓
    ├─ SIM → Enviar WhatsApp boas-vindas (IA gera mensagem)
    │         ↓
    │         Aguardar 24h
    │         ↓
    │         Se não respondeu → Email follow-up
    │
    └─ NÃO → Adicionar à campanha genérica
```

**Implementação (Cloud Functions + Workflows):**

```javascript
// Workflow YAML
const workflow = {
  triggers: [{ type: "novo_lead", filter: 'fonte == "Google Ads"' }],

  steps: [
    {
      action: "whatsapp_ia",
      params: { template: "boas_vindas" },
    },
    {
      delay: "24h",
    },
    {
      condition: "historico.last.respondeu == false",
      then: [{ action: "email", params: { template: "followup" } }],
    },
  ],
};

// Engine executa automaticamente
```

---

## 💰 PRICING IA

### Planos

```
TitanGestão PRO (Base)
├─ R$ 149,90 (único)
├─ Sem IA (features manuais)
└─ Upgrade disponível

    ↓ Upgrade

TitanIA Básico
├─ R$ 47/mês
├─ 1.000 mensagens WhatsApp IA/mês
├─ 5.000 emails/mês
└─ Insights básicos

    ↓ Upgrade

TitanIA Pro
├─ R$ 97/mês
├─ Mensagens ilimitadas
├─ Emails ilimitados
├─ Workflows customizáveis
└─ Modelos ML treinados
```

### Custo Operacional vs Pricing

**Por cliente IA ativo:**

| Serviço                | Custo     | Incluso em R$ 47/mês    |
| ---------------------- | --------- | ----------------------- |
| Gemini API (1k msgs)   | R$ 1      | ✅                      |
| WhatsApp API (1k msgs) | R$ 15     | ✅                      |
| Email (5k envios)      | R$ 2      | ✅                      |
| Cloud Functions        | R$ 3      | ✅                      |
| **Total custo**        | **R$ 21** | **Margem: R$ 26 (55%)** |

---

## 🚀 ROADMAP IMPLEMENTAÇÃO

### Junho 2026 (v2.0)

**Mês 1-2:**

- Integração Gemini API
- Agente WhatsApp básico
- Interface email marketing

**Mês 3:**

- Workflows customizáveis
- Insights preditivos
- Dashboard IA

### Dezembro 2026 (v2.5)

- Vertex AI (ML models)
- Voz IA (ligações automáticas)
- Integração Zapier

---

## 📊 MÉTRICAS DE SUCESSO

**KPIs IA:**

- Taxa conversão lead → cliente (automático vs manual)
- Tempo médio resposta (3s vs 2h humano)
- Satisfação cliente (NPS)
- ROI por cliente IA

**Meta Ano 1:**

- 100 clientes IA ativos
- MRR: R$ 4.700/mês
- Conversão +30% vs sem IA

---

**Atualizado:** 17 Janeiro 2026  
**Status:** Planejado (v2.0 Junho 2026)
