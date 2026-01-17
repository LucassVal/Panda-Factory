# 🛠️ README TÉCNICO - TitanGestão PRO v1.0

**Para:** Desenvolvedores  
**Versão:** 1.0 (Lançamento Março 2026)

---

## 🚀 Tecnologias (v1.0 Real)

### Stack Confirmado

```
Frontend:
├─ HTML5 + CSS3 (Single file)
├─ JavaScript ES6+ (Vanilla, sem frameworks)
├─ IndexedDB (banco local)
├─ Chart.js (local, sem CDN)
└─ Service Worker (PWA offline)

Backend:
├─ Google Apps Script (merge multi-user)
├─ Node.js + Express (auth apenas)
├─ MongoDB Atlas (usuários)
└─ Google Drive API (storage)

APIs Externas:
├─ Google Maps API (autocomplete endereço)
└─ Google OAuth 2.0 (autenticação)
```

---

## 📁 Estrutura Projeto

```
SAAS/
├── CRM.html                      ← Sistema completo (165KB)
├── README.md                     ← Docs principal
├── ROADMAP.md                    ← 8 sprints
├── ARQUITETURA.md                ← Decisões técnicas
├── APPS_SCRIPT.md                ← Código Google (pronto)
│
├── dados/
│   └── clientes_crm_v2.json     ← Banco JSON local
│
├── scripts/
│   └── scraper_guia_automatico.py ← Python scraper
│
└── docs/
    ├── PRICING.md
    ├── FEATURES.md
    └── FAQ.md
```

---

## ⚙️ Setup Desenvolvimento

### 1. Clone

```bash
git clone https://github.com/LucassVal/SAAS.git
cd SAAS
```

### 2. Abrir CRM

```bash
# Método 1: Duplo clique em CRM.html

# Método 2: Servidor local (para PWA funcionar)
python -m http.server 8000
# Abrir http://localhost:8000/CRM.html
```

**Não precisa npm install!** Tudo inline no HTML.

---

## 🔧 Configuração Google (Obrigatório)

### Google Cloud Console

**1. Criar Projeto:**

```
console.cloud.google.com → Novo Projeto
Nome: "TitanGestao-Production"
```

**2. Ativar APIs:**

```
APIs & Services → Library
✅ Google Drive API
✅ Google Maps JavaScript API
✅ Google Apps Script API
```

**3. OAuth Credentials:**

```
APIs & Services → Credentials
Create → OAuth client ID
Type: Web application
Redirect URIs:
  - https://tocadobarbaro.com/callback
  - http://localhost:3000/callback (dev)

Download JSON
```

**4. Google Maps API Key:**

```
Credentials → Create → API key
Restrict to: Google Maps JavaScript API
Add to CRM.html (linha TBD)
```

---

## 📱 PWA Setup

### Service Worker (já no CRM.html)

```javascript
// Registrar SW
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").then(() => console.log("✅ PWA"));
}
```

### Testar Offline

```
Chrome DevTools → Application
├─ Service Workers → Offline checkbox
├─ Recarregar página
└─ Sistema funciona 100%
```

---

## 🗄️ MongoDB Setup

```
1. mongodb.com/cloud/atlas
2. Create FREE M0 cluster
3. Database Access → Add user (admin/senha)
4. Network → Add IP: 0.0.0.0/0
5. Connect → Drivers → Copy string
```

**Schema:**

```javascript
// Collection: users
{
  email: String,
  senha: String, // bcrypt
  codigoAtivacao: String,
  driveToken: { access, refresh, expires },
  folderId: String
}

// Collection: licenses
{
  codigo: "TIT-ABC123",
  usado: Boolean,
  userId: ObjectId
}
```

---

## 🔐 Apps Script Deploy

**Ver:** [`APPS_SCRIPT.md`](APPS_SCRIPT.md)

**Resumo:**

```
1. script.google.com
2. Novo → "TitanGestao-Merge"
3. Colar código (APPS_SCRIPT.md)
4. Settings → Script Properties (API keys)
5. Deploy → Web app
6. Triggers → mergeClienteData() every 3s
```

---

## 🧪 Testes v1.0

### Teste 1: Offline Puro

```
1. Abrir CRM.html (sem internet)
2. Cadastrar cliente
3. localStorage tem dados ✅
4. Fechar/reabrir → dados persistem ✅
```

### Teste 2: Google Maps

```
1. Campo endereço → digitar "Rua Augusta, 1"
2. Sugestões aparecem ✅
3. Clicar sugestão → preenche tudo ✅
```

### Teste 3: Multi-User Sync

```
1. Conectar Google Drive (OAuth)
2. Abrir 2 abas
3. Aba 1: Editar cliente
4. Aba 2: Atualiza em 3s ✅
```

---

## 🚀 Deploy Produção

### Frontend (Vercel)

```bash
npm i -g vercel
vercel

# Custom domain
vercel domains add tocadobarbaro.com
```

### Backend (Railway)

```bash
# railway.app
Novo projeto → Deploy from GitHub
Env vars: MONGODB_URI, GOOGLE_CLIENT_ID, etc
```

---

## 📊 Funcionalidades v1.0 (Real)

**✅ TEM:**

- CRM completo (CRUD, histórico, funil)
- Tags captação customizáveis
- Telefone internacional (país + formato)
- Google Maps autocomplete
- Campos customizáveis
- Importação Excel
- White label
- PWA offline
- Multi-usuário (10 users)
- Apps Script sync
- Orçamentos PDF
- Gráficos (12 Chart.js)
- Estoque básico
- PDV básico (sem gateway)
- Financeiro básico
- Agenda

**❌ NÃO TEM (v2.0+):**

- Gateway pagamento (PagSeguro, Mercado Pago) → v2.5
- Impressora térmica → v1.1
- IA WhatsApp → v2.0
- Nota fiscal → v3.0
- Zapier → v2.5

---

## 🐛 Troubleshooting

**"Google Maps não carrega:"**

```
Verificar API key válida
Billing ativado no Google Cloud ($200 grátis/mês)
```

**"Apps Script timeout:"**

```
Reduzir batch (processar menos clientes por vez)
```

**"OAuth error:"**

```
Verificar redirect URI configurada
Token expirado → renova automático
```

---

## 💡 Notas Importantes v1.0

### PIX (Forma Pagamento)

```javascript
// Cliente cadastra chave PIX
configuracoes.pixChave = "11987654321"; // telefone, email, etc
configuracoes.pixNome = "João Silva";

// No PDV, mostra:
("Pagar via PIX: 11987654321 (João Silva)");
// Ou gera QR code (biblioteca qrcode.js)
```

**Sem integração bancária!** Cliente mostra chave ou QR, comprador paga manualmente.

### Multi-Local (Usar com Cuidado)

**Se ativar:**

- Fontes captação por local
- Estoques separados
- Relatórios por local
- **Complexidade +50%**

**Recomendação:** Só ativar se REAL necessidade (2+ locais físicos).

### WhatsApp (Scripts Opcionais)

```javascript
// Botão WhatsApp abre Web
function abrirWhatsApp(telefone) {
  window.open(`https://wa.me/${telefone}`);
}

// Cliente pode adicionar script próprio
// (exemplo: Chatwoot, Evolution API)
```

**IA WhatsApp 24/7** = v2.0 (R$ 47/mês SaaS opcional)

---

## 📚 Recursos Técnicos

**Google Docs:**

- [Drive API](https://developers.google.com/drive/api/guides/about-sdk)
- [Apps Script](https://developers.google.com/apps-script)
- [OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)

**Libraries:**

- [Chart.js](https://www.chartjs.org/docs/latest/)
- [jsPDF](https://github.com/parallax/jsPDF)
- [IndexedDB](https://web.dev/indexeddb/)

---

## 🔄 Git Workflow

```bash
# Feature branch
git checkout -b feature/nome

# Commits
git add .
git commit -m "feat(modulo): descrição"

# Push
git push origin feature/nome

# Merge
git checkout main
git merge feature/nome
```

---

## ✅ Checklist Pré-Launch

- [ ] Google Cloud configurado
- [ ] Apps Script rodando
- [ ] MongoDB criado
- [ ] OAuth funcionando
- [ ] Google Maps API ativa
- [ ] PWA offline OK
- [ ] Multi-user testado (2 abas)
- [ ] Build minificado (build.js)
- [ ] Landing page Kiwify
- [ ] 5 beta testers

---

**Dúvidas Técnicas?** [FAQ.md](FAQ.md) | [ARQUITETURA.md](ARQUITETURA.md)

**Issues:** [GitHub Issues](https://github.com/LucassVal/SAAS/issues)
