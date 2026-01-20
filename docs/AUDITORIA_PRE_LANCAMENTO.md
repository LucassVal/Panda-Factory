# 📋 Auditoria Pré-Lançamento & Compliance Firewall

> **Estratégia:** "Gray Market" Legítimo (Service Provider).
> **Objetivo:** Aumentar o market share da Google via agregação, mantendo separação total de responsabilidade.

## 🛡️ O Muro de Compliance (Firewall Jurídico)

Nós fornecemos a **Infraestrutura**, não o **Conteúdo**.

1.  **Segregação de Dados:**
    - O banco de dados do cliente fica no Google Drive _dele_. Nosso sistema não vê o conteúdo, apenas trafega a "instrução".
    - Isso nos isenta de responsabilidade sobre _o que_ está sendo armazenado.

2.  **Responsabilidade do Usuário (ToS):**
    - Ao usar o Panda Fabrics, o usuário concorda que é o único responsável pelo uso das APIs da Google.
    - Qualquer violação (spam, abuso) resulta em banimento da API Key dele (se usada externamente) ou da conta Panda.

3.  **Google Partner Alignment:**
    - Não somos "revenda não autorizada". Somos um **Software de Gestão de Cloud** que facilita o uso.
    - Geramos receita legítima para a Google ao trazer milhares de usuários que jamais usariam GCP sozinhos.

---

## 🚨 Checklist de Risco (Legal & TI)

### 💰 CONTÁBIL (Estratégia Inicial MEI)

- [ ] **CNPJ MEI** (Microempreendedor Individual)
- [ ] **CNAE Sugerido:** 8599-6/03 (Treinamento), 6319-4/00 (Portais)
- [ ] **PagSeguro:** Checkout Transparente (BRL)
- [ ] **Panda Coin:** Tratar como **Crédito pré-pago** (Game Token), NÃO criptomoeda.

### ⚖️ LEGAL

- [ ] **Termos de Uso:** Cláusula de "Neutralidade de Rede" (nós somos o solo, não o agricultor).
- [ ] **Limitação de Responsabilidade:** O usuário responde pelo uso das APIs.

### 🔒 TI / SEGURANÇA

- [ ] **LGPD:** Política de Privacidade clara.
- [ ] **Segredos:** API Keys em `PropertiesService` (nunca hardcoded).
- [ ] **HTTPS:** Obrigatório em todas as pontas.
