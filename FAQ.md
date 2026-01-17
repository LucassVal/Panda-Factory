# ❓ FAQ - Perguntas Frequentes

**TitanGestão PRO** - Respostas rápidas

---

## 📦 PRODUTO

### O que é TitanGestão PRO?

Sistema completo de gestão (CRM + PDV + Estoque + Financeiro) que funciona offline e online, com dados no Google Drive do cliente, por R$ 149,90 pagamento único.

### Qual a diferença vs concorrentes (RD Station, Pipedrive)?

| TitanGestão               | Concorrentes            |
| ------------------------- | ----------------------- |
| R$ 149,90 único           | R$ 99-150/mês           |
| Funciona offline          | Só online               |
| Dados no seu Drive        | Dados no servidor deles |
| Até 10 usuários incluídos | Cobra por usuário       |

### Tem mensalidade?

**NÃO!** R$ 149,90 pagamento único, sem mensalidade.

**Opcional:** Upgrades de usuários (11+) ou IA (v2.0) são mensais, mas sistema base funciona sem.

---

## 💻 TÉCNICO

### Precisa instalar?

Não! É PWA (Progressive Web App). Acessa pelo navegador e pode "instalar" como app (opcional).

### Funciona offline?

**SIM!** Após primeiro login, sistema cacheia tudo localmente (Service Worker + IndexedDB). Funciona 100% sem internet.

### Como sincroniza entre dispositivos?

Google Drive. Mudanças locais sobem pro Drive do cliente, Apps Script faz merge, outros dispositivos baixam.

### Funciona no celular?

Sim! PWA funciona em:

- ✅ Windows, Mac, Linux (PC/Notebook)
- ✅ Android (Chrome, Edge)
- ✅ iOS (Safari 16+)

### Precisa internet sempre?

Não! Só precisa internet pra:

1. Primeiro acesso (ativação + download app)
2. Sincronizar mudanças (opcional)
3. Multi-usuário tempo real

Offline funciona 100%.

---

## 🔐 SEGURANÇA E PRIVACIDADE

### Meus dados ficam onde?

**No SEU Google Drive**, pasta "TitanGestao/". Nós NÃO temos acesso.

### Vocês veem meus dados?

**NÃO!** Dados ficam criptografados (OAuth) no Drive do cliente. Zero acesso nosso.

### E se vocês fecharem a empresa?

Sistema continua funcionando! Dados estão no SEU drive, offline funciona. Só perde sincronização multi-user (Apps Script nosso).

### É seguro pra LGPD?

Sim! VOCÊ é o controlador de dados, NÓS somos fornecedor de software. Responsabilidade é sua (documentado nos termos).

---

## 💰 PRICING E PAGAMENTO

### Como funciona o pagamento?

1. Compra na Kiwify (R$ 149,90)
2. Recebe código de ativação
3. Ativa em tocadobarbaro.com
4. Pronto! Sem mensalidade.

### Tem garantia?

**7 dias** devolução total, sem perguntas.

### Posso parcelar?

Sim, Kiwify aceita cartão até 12x (juros da operadora).

### Upgrades custam quanto?

**Usuários extras:**

- 11-20 usuários: R$ 59,90/mês
- 21-50 usuários: R$ 99,90/mês
- 51+ usuários: R$ 149,90/mês

**IA (v2.0):**

- Básico: R$ 47/mês
- Pro: R$ 97/mês

---

## 👥 MULTI-USUÁRIO

### Quantos usuários incluídos?

**10 usuários** no plano base (R$ 149,90).

### Como funciona multi-usuário?

João e Maria editam simultâneos. Apps Script faz merge automático (campo por campo). Conflitos raros.

### Precisa internet pra multi-user?

Sim, pra sincronização tempo real (3s delay). Offline cada um edita local, sync quando voltar online.

---

## 🛠️ SUPORTE

### Tem suporte?

**30 dias** suporte email incluído (BASE). Depois:

- Comunidade Telegram (grátis)
- Suporte prioritário: +R$ 19,90/ano (opcional)

### Tem tutorial?

Sim! YouTube com vídeos passo-a-passo + documentação completa.

### Tem updates?

**SIM! Grátis** para versão 1.x (bug fixes, melhorias). Versões maiores (2.0, 3.0) podem ter upgrade pago.

---

## 🎨 CUSTOMIZAÇÃO

### Posso mudar logo e cores?

**SIM!** White label completo:

- Upload logo
- Paleta de cores
- Nome do sistema
- Ícone PWA

### Posso revender?

Sim! White label permite revenda. Contate-nos pra plano de parceiro.

---

## 🚀 IMPLEMENTAÇÃO

### Quanto tempo pra começar usar?

**5 minutos:**

1. Compra (2min)
2. Ativa código (1min)
3. Conecta Google Drive (1min)
4. Pronto! (1min explorando)

### Preciso migrar dados?

Sim, mas fácil:

- Upload Excel (CSV/XLSX)
- Ou importa manual

---

## 📱 PWA

### O que é PWA?

Progressive Web App. Funciona como site mas instala como app nativo (sem App Store).

### Como instala?

**Chrome:** Ícone "Instalar" na barra de endereço  
**Mobile:** Menu → "Adicionar à tela inicial"

### Precisa instalar?

Não! Opcional. Funciona no navegador também.

---

## 🤖 INTELIGÊNCIA ARTIFICIAL

### IA vem incluída?

**NÃO.** IA é upgrade opcional (v2.0 - Junho 2026):

- R$ 47/mês (básico)
- R$ 97/mês (pro)

### O que a IA faz?

- WhatsApp 24/7 (responde clientes)
- Email marketing automático
- Follow-up inteligente
- Insights preditivos

### Precisa da IA pra sistema funcionar?

**NÃO!** Sistema v1.0 funciona completo sem IA. IA é extra opcional.

---

## 🌍 INTERNACIONAL

### Funciona fora do Brasil?

Sim! Sistema é universal. Versão espanhol em Abril 2026.

### Aceita outras moedas?

Sim, via Hotmart Global (USD, EUR, MXN, ARS, COP).

---

## 📊 LIMITES

### Quantos clientes posso cadastrar?

**Ilimitado!** IndexedDB suporta GB de dados.

### Quantos produtos no estoque?

**Ilimitado!**

### Google Drive tem limite?

15GB grátis (Google). Se passar, cliente paga upgrade (plano pessoal Google).

---

## 🐛 PROBLEMAS COMUNS

### "Código de ativação inválido"

- Verificar se digitou certo
- 1 código = 1 instalação
- Contatar suporte se persistir

### "Google Drive não conecta"

- Autorizar permissões OAuth
- Verificar firewall/antivírus
- Tentar navegador anônimo

### "Dados não sincronizam"

- Verificar internet
- Apps Script pode estar processando (aguardar 10s)
- Logs em DevTools Console

---

## 📞 CONTATO

**Email:** suporte@tocadobarbaro.com  
**Telegram:** @titangestao  
**GitHub:** [github.com/LucassVal/SAAS](https://github.com/LucassVal/SAAS)

---

**Não achou sua dúvida?** Abra issue no GitHub ou email.

**Última Atualização:** 17 Janeiro 2026
