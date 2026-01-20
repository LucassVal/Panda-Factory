# 🔌 PANDA FABRICS - Integrações Google Workspace

**Objetivo:** Documentar todas as APIs Google disponíveis nativamente via Apps Script

---

## 📌 Visão Geral

O Apps Script tem acesso **nativo** a todo o Google Workspace. Desenvolvedores podem criar qualquer tipo de solução:

| Vertical       | Exemplo                       |
| :------------- | :---------------------------- |
| **Pizzaria**   | Pedidos via WhatsApp + Agenda |
| **Apostas**    | Dashboard + Sheets + APIs     |
| **Jurídico**   | Docs + Contratos + Prazos     |
| **Bot Farm**   | Automação + Triggers          |
| **E-commerce** | Pedidos + Estoque + NFe       |

---

## 📧 Gmail

### Enviar E-mail

```javascript
function enviarEmail(destinatario, assunto, corpo) {
  GmailApp.sendEmail(destinatario, assunto, corpo, {
    htmlBody: corpo,
    name: "Panda Fabrics",
  });
}
```

### Ler E-mails

```javascript
function lerInbox() {
  const threads = GmailApp.getInboxThreads(0, 10);
  return threads.map((t) => ({
    assunto: t.getFirstMessageSubject(),
    de: t.getMessages()[0].getFrom(),
  }));
}
```

### Criar Rascunho

```javascript
GmailApp.createDraft(email, assunto, corpo);
```

---

## 📅 Google Calendar

### Criar Evento

```javascript
function criarAgendamento(titulo, inicio, fim, convidados) {
  CalendarApp.getDefaultCalendar().createEvent(titulo, inicio, fim, {
    guests: convidados,
    sendInvites: true,
  });
}
```

### Listar Eventos

```javascript
function listarEventos(dataInicio, dataFim) {
  const eventos = CalendarApp.getDefaultCalendar().getEvents(
    dataInicio,
    dataFim,
  );
  return eventos.map((e) => ({
    titulo: e.getTitle(),
    inicio: e.getStartTime(),
  }));
}
```

---

## 📊 Google Sheets

### Ler Planilha

```javascript
function lerDados(spreadsheetId, aba) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(aba);
  return sheet.getDataRange().getValues();
}
```

### Escrever Dados

```javascript
function escreverDados(spreadsheetId, aba, dados) {
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(aba);
  sheet.getRange(1, 1, dados.length, dados[0].length).setValues(dados);
}
```

### Criar Planilha

```javascript
function criarPlanilha(nome, dados) {
  const ss = SpreadsheetApp.create(nome);
  ss.getActiveSheet()
    .getRange(1, 1, dados.length, dados[0].length)
    .setValues(dados);
  return ss.getUrl();
}
```

---

## 📝 Google Docs

### Criar Documento

```javascript
function criarDocumento(titulo, conteudo) {
  const doc = DocumentApp.create(titulo);
  doc.getBody().appendParagraph(conteudo);
  return doc.getUrl();
}
```

### Gerar Contrato (Template)

```javascript
function gerarContrato(templateId, dados) {
  const template = DriveApp.getFileById(templateId);
  const copia = template.makeCopy(`Contrato_${dados.cliente}`);
  const doc = DocumentApp.openById(copia.getId());
  const body = doc.getBody();

  // Substituir placeholders
  body.replaceText("{{CLIENTE}}", dados.cliente);
  body.replaceText("{{VALOR}}", dados.valor);
  body.replaceText("{{DATA}}", dados.data);

  doc.saveAndClose();
  return copia.getUrl();
}
```

---

## 📁 Google Drive

### Upload Arquivo

```javascript
function uploadArquivo(nome, conteudo, mimeType, pastaId) {
  const pasta = DriveApp.getFolderById(pastaId);
  const blob = Utilities.newBlob(conteudo, mimeType, nome);
  return pasta.createFile(blob).getUrl();
}
```

### Listar Arquivos

```javascript
function listarArquivos(pastaId) {
  const pasta = DriveApp.getFolderById(pastaId);
  const arquivos = pasta.getFiles();
  const lista = [];
  while (arquivos.hasNext()) {
    const f = arquivos.next();
    lista.push({ id: f.getId(), nome: f.getName() });
  }
  return lista;
}
```

### Criar Pasta

```javascript
function criarPasta(nome, paiId) {
  const pai = paiId ? DriveApp.getFolderById(paiId) : DriveApp.getRootFolder();
  return pai.createFolder(nome).getId();
}
```

---

## 📊 Google Forms

### Criar Formulário

```javascript
function criarFormulario(titulo, perguntas) {
  const form = FormApp.create(titulo);
  perguntas.forEach((p) => {
    if (p.tipo === "texto") {
      form.addTextItem().setTitle(p.pergunta);
    } else if (p.tipo === "multipla") {
      form
        .addMultipleChoiceItem()
        .setTitle(p.pergunta)
        .setChoiceValues(p.opcoes);
    }
  });
  return form.getPublishedUrl();
}
```

### Ler Respostas

```javascript
function lerRespostas(formId) {
  const form = FormApp.openById(formId);
  return form.getResponses().map((r) => r.getItemResponses());
}
```

---

## 📍 Google Maps

### Geocoding (Endereço → Coordenadas)

```javascript
function geocode(endereco) {
  const response = Maps.newGeocoder().geocode(endereco);
  const loc = response.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
}
```

### Distância Entre Pontos

```javascript
function calcularDistancia(origem, destino) {
  const response = Maps.newDirectionFinder()
    .setOrigin(origem)
    .setDestination(destino)
    .getDirections();
  return response.routes[0].legs[0].distance.text;
}
```

---

## 💬 Google Chat

### Enviar Mensagem (Webhook)

```javascript
function enviarParaChat(webhookUrl, mensagem) {
  UrlFetchApp.fetch(webhookUrl, {
    method: "POST",
    contentType: "application/json",
    payload: JSON.stringify({ text: mensagem }),
  });
}
```

---

## 🎨 Google Slides

### Criar Apresentação

```javascript
function criarApresentacao(titulo) {
  const slides = SlidesApp.create(titulo);
  slides.getSlides()[0].insertTextBox("Bem-vindo!");
  return slides.getUrl();
}
```

---

## ⏰ Triggers (Automação)

### Timer (Executar a cada X minutos)

```javascript
ScriptApp.newTrigger("minhaFuncao").timeBased().everyMinutes(5).create();
```

### Webhook (OnEdit)

```javascript
function onEdit(e) {
  // Executa quando planilha é editada
  const range = e.range;
  const valor = e.value;
}
```

### Form Submit

```javascript
function onFormSubmit(e) {
  const respostas = e.response.getItemResponses();
}
```

---

## 🔐 APIs Avançadas

### BigQuery

```javascript
BigQuery.Jobs.query(
  {
    query: "SELECT * FROM dataset.table LIMIT 10",
    useLegacySql: false,
  },
  projectId,
);
```

### YouTube

```javascript
YouTube.Search.list("snippet", {
  q: "tutorial",
  maxResults: 5,
});
```

### Analytics

```javascript
Analytics.Data.Ga.get("ga:12345678", "7daysAgo", "today", "ga:sessions");
```

---

## 📋 Casos de Uso por Vertical

### 🍕 Pizzaria

```
Gmail (Confirmação) + Calendar (Entregas) + Sheets (Pedidos) + Maps (Rotas)
```

### ⚖️ Jurídico

```
Docs (Contratos) + Drive (Processos) + Calendar (Prazos) + Forms (Intake)
```

### 🎰 Apostas

```
Sheets (Odds) + BigQuery (Analytics) + Triggers (Auto-update)
```

### 🤖 Bot Farm

```
Triggers (Scheduler) + Sheets (Config) + UrlFetch (APIs externas)
```

---

## 📚 Referências

- [Apps Script Reference](https://developers.google.com/apps-script/reference)
- [Advanced Services](https://developers.google.com/apps-script/guides/services/advanced)
- [Quotas](https://developers.google.com/apps-script/guides/services/quotas)

---

© 2026 Panda Fabrics - Google Workspace para Desenvolvedores
