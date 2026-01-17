# Build Script - TitanGestão PRO

## O Que Faz

Este script gera a versão protegida para distribuição:

- ✅ **Watermark único** (rastrear origem de pirataria)
- ✅ **Modal LGPD** (termos de uso na primeira abertura)
- ✅ **Copyright** (avisos legais)
- ✅ **Minificação** (reduz tamanho ~20%)
- ✅ **Metadados** (tracking de builds)

## Como Usar

### 1. Instalação (Uma Vez)

```bash
# Certifique-se que Node.js está instalado
node --version

# Se não tiver Node.js, baixe em: https://nodejs.org
```

### 2. Gerar Versão Protegida

```bash
cd C:\Users\Lucas Valério\Desktop\CRM
node build.js
```

**Output:**

```
dist/TitanGestao_PRO.html (versão protegida)
dist/build-info.json (metadados)
```

### 3. Upload para Kiwify

1. Compacte: `dist/TitanGestao_PRO.html` → `TitanGestao_PRO.zip`
2. Upload no produto Kiwify (R$ 149,90)
3. Quando cliente comprar, recebe automaticamente

## Proteções Implementadas

### 🔏 Watermark Único

Cada build tem ID exclusivo:

```
BUILD ID: a3f5c9e2d1b4...
```

Se encontrar versão pirata:

1. Abra o código
2. Procure por: `<!-- BUILD:...`
3. Decode Base64 para ver metadados
4. Identifica origem do vazamento

### 📜 LGPD Compliance

Modal automático na primeira abertura:

- Termos de uso
- Responsabilidades do controlador
- Checkbox de aceite obrigatório
- Salva timestamp do aceite

### ©️ Copyright

Avisos legais embutidos:

- Proibição de redistribuição
- Isenção de responsabilidade sobre dados
- Build ID e data

### ⚡ Minificação

- Remove comentários HTML
- Remove espaços extras
- Reduz ~20% do tamanho

## Ofuscação Avançada (Opcional)

Para proteção máxima contra pirataria:

```bash
# Instalar ferramenta profissional
npm install -g javascript-obfuscator

# Ofuscar código (torna MUITO difícil de ler)
javascript-obfuscator dist/TitanGestao_PRO.html \
  --output dist/TitanGestao_PRO_protected.html \
  --compact true \
  --control-flow-flattening true \
  --dead-code-injection true \
  --string-array true \
  --string-array-threshold 0.8

# Resultado: código ilegível
```

**Antes:**

```javascript
function salvarCliente(nome) {
  clientes.push({ nome: nome });
}
```

**Depois (ofuscado):**

```javascript
var _0x4a2b=['push'];(function(_0x2d8f05,_0x4b81bb){var _0x4d74cb=function...
```

## Watermark com Kiwify (Webhook)

Para inserir email do comprador no watermark:

### 1. Configurar Webhook na Kiwify

```
URL: https://seu-servidor.com/webhook-kiwify
Evento: order.paid
```

### 2. Servidor Recebe Compra

```javascript
// webhook-kiwify.js (Node.js)
app.post("/webhook-kiwify", async (req, res) => {
  const { customer_email, order_id } = req.body;

  // Gera versão única com email do cliente
  const codigoBase = fs.readFileSync("TitanGestao_PRO.html", "utf8");

  const watermark = {
    build_id: crypto.randomBytes(16).toString("hex"),
    buyer_email: customer_email,
    order_id: order_id,
    sold_at: new Date().toISOString(),
  };

  const watermarkEncoded = Buffer.from(JSON.stringify(watermark)).toString(
    "base64",
  );
  const codigoPersonalizado = codigoBase.replace(
    "<!-- WATERMARK_PLACEHOLDER -->",
    `<!-- BUILD:${watermarkEncoded} -->`,
  );

  // Salva versão única
  const nomeArquivo = `TitanGestao_PRO_${order_id}.html`;
  fs.writeFileSync(`downloads/${nomeArquivo}`, codigoPersonalizado);

  // Envia email pro cliente com link único
  enviarEmail(customer_email, {
    assunto: "Seu TitanGestão PRO está pronto!",
    link: `https://downloads.titan.com/${nomeArquivo}`,
  });

  res.json({ success: true });
});
```

**Vantagem:** Se vazar, você sabe exatamente quem foi (email + order_id)

## Limitações

### ⚠️ Pirataria é SEMPRE Possível

**Realidade:**

- HTML/JS é código aberto (navegador precisa ler)
- Qualquer proteção pode ser quebrada com tempo suficiente
- Ofuscação dificulta, mas não impede 100%

**Estratégia:**

- Proteção BÁSICA (watermark + ofuscação) = suficiente
- 90% dos piratas desistem
- 10% que conseguem = preço baixo não compensa esforço
- Velocidade de lançamento > proteção perfeita

### ✅ O Que Realmente Protege

1. **Marca forte** (primeiro a chegar)
2. **Rede de afiliados** (lock-in)
3. **Atualizações** (pirata fica desatualizado)
4. **Comunidade** (suporte, grupo, tutoriais)
5. **Ecossistema** (múltiplos produtos integrados)

**Conclusão:** Foque em lançar rápido, não em proteção perfeita.

## Troubleshooting

### Erro: "node não é reconhecido"

**Solução:** Instale Node.js

```
https://nodejs.org/
```

### Erro: "Cannot find module 'fs'"

**Solução:** `fs` e `crypto` são built-in do Node.js. Certifique-se de rodar com `node build.js`, não no navegador.

### Build não gerou arquivo

**Solução:** Verifique se `CRM.html` existe na mesma pasta que `build.js`

## Checklist Pré-Lançamento

Antes de subir na Kiwify:

- [ ] Rodar `node build.js` com sucesso
- [ ] Testar `dist/TitanGestao_PRO.html` no navegador
- [ ] Modal LGPD aparece na primeira abertura
- [ ] Aceitar termos funciona
- [ ] Rejeitar termos fecha sistema
- [ ] Sistema funciona normalmente após aceite
- [ ] (Opcional) Ofuscar com javascript-obfuscator
- [ ] Compactar em .zip
- [ ] Upload na Kiwify
- [ ] Testar compra (modo sandbox)

---

**Build criado:** 17 Janeiro 2026  
**Versão:** 1.0  
**Autor:** Lucas Valério
