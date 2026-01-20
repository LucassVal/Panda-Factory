# 🎨 UI MOCKUP - Cadastro de Cliente Completo

**Versão:** 3.0 (Com todas customizações)  
**Features:** Telefone internacional, Google Maps, Campos customizáveis

---

## 📋 JANELA MODAL COMPLETA

```
╔══════════════════════════════════════════════════════════════════╗
║  ➕ Novo Cliente                                          [X]    ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  ┌─ 📋 Dados Básicos ──────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │  Nome Completo: *                                        │   ║
║  │  [_______________________________________________]       │   ║
║  │                                                          │   ║
║  │  Email:                                                  │   ║
║  │  [_______________________________________________]       │   ║
║  │                                                          │   ║
║  │  Telefone: *                                             │   ║
║  │  [+55 ▼] (__)_____-____                                 │   ║
║  │   ↑ País  ↑ Formatação automática por país              │   ║
║  │                                                          │   ║
║  │  WhatsApp:                                               │   ║
║  │  [ ] Mesmo do telefone  [+55 ▼] (__)_____-____         │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌─ 📍 Endereço (Google Maps) ──────────────────────────────┐   ║
║  │                                                          │   ║
║  │  🔍 Buscar endereço:                                     │   ║
║  │  [Rua Augusta, 123_________________] 🗺️                 │   ║
║  │       ↓ (Digite e aparece sugestões)                     │   ║
║  │  ┌────────────────────────────────────────────┐         │   ║
║  │  │ 📍 Rua Augusta, 123 - Consolação          │         │   ║
║  │  │    São Paulo, SP - 01305-100              │         │   ║
║  │  │ ─────────────────────────────────────────  │         │   ║
║  │  │ 📍 Rua Augusta, 123 - Centro              │         │   ║
║  │  │    Curitiba, PR - 80060-100               │         │   ║
║  │  └────────────────────────────────────────────┘         │   ║
║  │                                                          │   ║
║  │  OU preencher manualmente:                               │   ║
║  │                                                          │   ║
║  │  Rua/Avenida:           Número:     Complemento:        │   ║
║  │  [________________]     [_____]     [__________]        │   ║
║  │                                                          │   ║
║  │  Bairro:                Cidade:          Estado:        │   ║
║  │  [____________]         [____________]   [SP ▼]         │   ║
║  │                                                          │   ║
║  │  CEP:                   País:                            │   ║
║  │  [_____-___]            [🇧🇷 Brasil ▼]                  │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌─ 🏷️ Captação e Classificação ────────────────────────────┐   ║
║  │                                                          │   ║
║  │  Fonte de Captação: *                                    │   ║
║  │  [Google Ads ▼]  [⚙️ Configurar Fontes]                │   ║
║  │   └─ Opções: Google Ads, Facebook, Instagram,           │   ║
║  │               Indicação, Site, Outros                    │   ║
║  │                                                          │   ║
║  │  Status Inicial:                                         │   ║
║  │  ⚪ Não Acompanhando  🟢 Em Acompanhamento              │   ║
║  │  🟡 Com Orçamento    🔵 Fechado  ⚫ Finalizado          │   ║
║  │                                                          │   ║
║  │  Vendedor Responsável:                                   │   ║
║  │  [João Silva ▼]                                         │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌─ 📝 Campos Personalizados ───────────────────────────────┐   ║
║  │  (Configurados em Settings → Campos Customizados)        │   ║
║  │                                                          │   ║
║  │  Área (m²):                                              │   ║
║  │  [_______] m²                                            │   ║
║  │                                                          │   ║
║  │  Orçamento Previsto:                                     │   ║
║  │  R$ [____________]                                       │   ║
║  │                                                          │   ║
║  │  Tipo de Obra:                                           │   ║
║  │  [Residencial ▼]  (Residencial, Comercial, Industrial)  │   ║
║  │                                                          │   ║
║  │  Prazo Desejado:                                         │   ║
║  │  [__/__/____] 📅                                         │   ║
║  │                                                          │   ║
║  │  Observações:                                            │   ║
║  │  [_____________________________________________]         │   ║
║  │  [_____________________________________________]         │   ║
║  │  [_____________________________________________]         │   ║
║  │                                                          │   ║
║  │  [+ Adicionar Campo] ← Cria campo na hora               │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌─ 📋 LGPD ─────────────────────────────────────────────────┐   ║
║  │                                                          │   ║
║  │  ☑️ Declaro que obtive consentimento do titular para    │   ║
║  │     armazenar e processar estes dados (LGPD Lei 13.709) │   ║
║  │     [Saiba mais]                                         │   ║
║  └──────────────────────────────────────────────────────────┘   ║
║                                                                  ║
║  ┌────────────────────────────────────────────────────────┐     ║
║  │ [Cancelar]                    [💾 Salvar Cliente]      │     ║
║  └────────────────────────────────────────────────────────┘     ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🎯 FUNCIONALIDADES ATIVAS

### 1. Telefone Inteligente

**Seletor de País:**

```
[+55 ▼] ← Dropdown com bandeiras
└─ 🇧🇷 Brasil (+55)
   🇺🇸 EUA (+1)
   🇲🇽 México (+52)
   🇦🇷 Argentina (+54)
   🇨🇱 Chile (+56)
   🇨🇴 Colômbia (+57)
   ... (todos países América Latina + principais)
```

**Formatação Automática:**

```
Brasil (+55):    (11) 98765-4321
EUA (+1):        (212) 555-0123
México (+52):    (55) 1234-5678
Argentina (+54): (11) 1234-5678
```

**Validação:**

- ✅ Número válido pro país selecionado
- ✅ Tamanho correto
- ✅ Prefixo DDD válido (se aplicável)

### 2. Google Maps Autocomplete

**Fluxo:**

```
1. Cliente digita: "Rua Augusta, 1"

2. Sistema chama Google Places API:
   GET https://maps.googleapis.com/maps/api/place/autocomplete/json
   ?input=Rua+Augusta,+1
   &types=address
   &components=country:br
   &key=SUA_API_KEY

3. Retorno (exemplo):
   [
     {
       description: "Rua Augusta, 123 - Consolação, São Paulo - SP",
       place_id: "ChIJ..."
     },
     {
       description: "Rua Augusta, 150 - Centro, Curitiba - PR",
       place_id: "ChIJ..."
     }
   ]

4. Cliente clica na sugestão

5. Sistema busca detalhes:
   GET https://maps.googleapis.com/maps/api/place/details/json
   ?place_id=ChIJ...
   &fields=address_components
   &key=SUA_API_KEY

6. Preenche automático:
   ├─ Rua: Rua Augusta
   ├─ Número: 123
   ├─ Bairro: Consolação
   ├─ Cidade: São Paulo
   ├─ Estado: SP
   └─ CEP: 01305-100
```

**Vantagens:**

- ✅ Zero digitação
- ✅ Endereço sempre correto
- ✅ Bairro/cidade padronizados (filtros funcionam)

### 3. Campos Personalizados Dinâmicos

**Configuração (Settings):**

```
⚙️ Settings → Campos Personalizados

[+ Novo Campo]

Nome do Campo:    [Área (m²)___________]
Tipo:             [Número ▼]
Obrigatório:      [ ] Sim
Filtrável:        [✓] Sim
Ordem:            [3]

[Salvar Campo]
```

**Tipos Disponíveis:**

- 📝 Texto curto
- 📄 Texto longo (textarea)
- 🔢 Número
- 💰 Dinheiro (R$)
- 📅 Data
- ⏰ Data/Hora
- ☑️ Checkbox (Sim/Não)
- 🎛️ Select (dropdown)
- 📻 Radio buttons
- 🏷️ Tags (múltipla escolha)

**Na Modal de Cadastro:**

- Campos padrões sempre aparecem
- Campos customizados aparecem na seção "Campos Personalizados"
- Ordem definida em Settings
- Validação automática (obrigatório, formato)

### 4. LGPD Built-in

**Checkbox Obrigatório:**

- Cliente SÓ salva se marcar
- Salva timestamp do aceite
- Audita quem cadastrou

**Link "Saiba mais":**

```
╔═══════════════════════════════════════════╗
║  ℹ️ Informações LGPD                      ║
╠═══════════════════════════════════════════╣
║  Ao marcar esta opção, você declara que: ║
║                                           ║
║  ✓ Obteve consentimento do titular        ║
║  ✓ Informou a finalidade do tratamento   ║
║  ✓ Está em conformidade com a Lei 13.709 ║
║                                           ║
║  Responsabilidade pelo tratamento dos     ║
║  dados é sua (controlador de dados).      ║
║                                           ║
║  [Entendi]                                ║
╚═══════════════════════════════════════════╝
```

---

## 🎨 VISUAL REAL (HTML/CSS)

### Código Simplificado

```html
<div class="modal" id="clienteModal">
  <div
    class="modal-content"
    style="max-width: 900px; max-height: 90vh; overflow-y: auto;"
  >
    <!-- Header -->
    <div class="modal-header">
      <h2>➕ Novo Cliente</h2>
      <button class="close-btn" onclick="fecharModal()">×</button>
    </div>

    <!-- Dados Básicos -->
    <div class="form-section">
      <h3>📋 Dados Básicos</h3>

      <div class="form-group">
        <label class="required">Nome Completo:</label>
        <input type="text" id="nome" required />
      </div>

      <div class="form-group">
        <label>Email:</label>
        <input type="email" id="email" />
      </div>

      <div class="form-group">
        <label class="required">Telefone:</label>
        <div class="phone-input">
          <select id="paisTelefone" style="width: 100px;">
            <option value="+55" data-format="(XX) XXXXX-XXXX">🇧🇷 +55</option>
            <option value="+1" data-format="(XXX) XXX-XXXX">🇺🇸 +1</option>
            <option value="+52" data-format="(XX) XXXX-XXXX">🇲🇽 +52</option>
          </select>
          <input type="tel" id="telefone" placeholder="(11) 98765-4321" />
        </div>
      </div>
    </div>

    <!-- Endereço Google Maps -->
    <div class="form-section">
      <h3>📍 Endereço</h3>

      <div class="form-group">
        <label>🔍 Buscar endereço:</label>
        <input
          type="text"
          id="enderecoBusca"
          placeholder="Digite o endereço..."
          oninput="buscarGoogleMaps(this.value)"
        />
        <div id="sugestoesEndereco" class="autocomplete-dropdown"></div>
      </div>

      <div class="form-group">
        <label>OU preencher manualmente:</label>
      </div>

      <div class="form-row">
        <input type="text" id="rua" placeholder="Rua/Avenida" />
        <input
          type="text"
          id="numero"
          placeholder="Número"
          style="width: 100px;"
        />
        <input type="text" id="complemento" placeholder="Complemento" />
      </div>

      <div class="form-row">
        <input type="text" id="bairro" placeholder="Bairro" />
        <input type="text" id="cidade" placeholder="Cidade" />
        <select id="estado">
          <option>SP</option>
          <option>RJ</option>
          <!-- ... todos estados ... -->
        </select>
      </div>
    </div>

    <!-- Captação -->
    <div class="form-section">
      <h3>🏷️ Captação</h3>

      <div class="form-group">
        <label class="required">Fonte:</label>
        <select id="fonte">
          <option>Google Ads</option>
          <option>Facebook</option>
          <option>Indicação</option>
          <!-- Dinâmico de Settings -->
        </select>
        <button onclick="abrirConfigFontes()">⚙️ Configurar</button>
      </div>
    </div>

    <!-- Campos Personalizados (Dinâmicos) -->
    <div class="form-section" id="camposPersonalizados">
      <h3>📝 Campos Personalizados</h3>

      <!-- Gerado dinamicamente via JS -->
      <div id="customFieldsContainer"></div>

      <button onclick="adicionarCampoTemporario()">+ Adicionar Campo</button>
    </div>

    <!-- LGPD -->
    <div
      class="form-section"
      style="background: #fff3cd; padding: 15px; border-radius: 8px;"
    >
      <label style="display: flex; align-items: start; gap: 10px;">
        <input type="checkbox" id="lgpdConsent" required />
        <span>
          Declaro que obtive consentimento do titular para armazenar e processar
          estes dados (LGPD Lei 13.709).
          <a href="#" onclick="mostrarInfoLGPD()">Saiba mais</a>
        </span>
      </label>
    </div>

    <!-- Botões -->
    <div class="modal-footer">
      <button class="btn" onclick="fecharModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="salvarCliente()">
        💾 Salvar Cliente
      </button>
    </div>
  </div>
</div>
```

---

## ⚙️ SETTINGS → CAMPOS PERSONALIZADOS

**Interface de Configuração:**

```
╔═══════════════════════════════════════════════════════════╗
║  ⚙️ Configurações → Campos Personalizados                 ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  📋 Campos Padrões (sempre visíveis):                     ║
║  ✅ Nome                                                  ║
║  ✅ Email                                                 ║
║  ✅ Telefone                                              ║
║  ✅ Endereço                                              ║
║                                                           ║
║  ─────────────────────────────────────────────────────    ║
║                                                           ║
║  📝 Campos Personalizados:                                ║
║                                                           ║
║  ┌──────────────────────────────────────────────┐        ║
║  │ 1. Área (m²)                    [✏️] [🗑️]   │        ║
║  │    Tipo: Número | Obrigatório: Não           │        ║
║  │    Filtrável: Sim                             │        ║
║  └──────────────────────────────────────────────┘        ║
║                                                           ║
║  ┌──────────────────────────────────────────────┐        ║
║  │ 2. Orçamento                    [✏️] [🗑️]   │        ║
║  │    Tipo: Dinheiro | Obrigatório: Não         │        ║
║  │    Filtrável: Sim                             │        ║
║  └──────────────────────────────────────────────┘        ║
║                                                           ║
║  ┌──────────────────────────────────────────────┐        ║
║  │ 3. Tipo de Obra                 [✏️] [🗑️]   │        ║
║  │    Tipo: Select | Obrigatório: Não           │        ║
║  │    Opções: Residencial, Comercial, Industrial│        ║
║  │    Filtrável: Sim                             │        ║
║  └──────────────────────────────────────────────┘        ║
║                                                           ║
║  [+ Novo Campo Personalizado]                            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Modal Criar Campo:**

```
╔═══════════════════════════════════════════╗
║  ➕ Novo Campo Personalizado              ║
╠═══════════════════════════════════════════╣
║                                           ║
║  Nome do Campo: *                         ║
║  [Prazo Desejado___]                      ║
║                                           ║
║  Tipo: *                                  ║
║  [Data ▼]                                 ║
║   └─ Texto, Número, Dinheiro, Data,       ║
║       Select, Checkbox, etc               ║
║                                           ║
║  [ ] Campo obrigatório                    ║
║  [✓] Permitir filtrar por este campo     ║
║                                           ║
║  Ordem de exibição:                       ║
║  [4] (1=primeiro, 10=último)              ║
║                                           ║
║  ─────────────────────────────────────    ║
║  [Cancelar]           [Criar Campo]       ║
╚═══════════════════════════════════════════╝
```

---

## 💾 ESTRUTURA DE DADOS (JSON)

```json
{
  "clientes": {
    "CLI_001": {
      "nome": { "value": "João Silva Construtora", "_timestamp": 1705518000 },
      "email": { "value": "joao@construtora.com", "_timestamp": 1705518000 },
      "telefone": {
        "value": {
          "pais": "+55",
          "numero": "(11) 98765-4321",
          "numeroCompleto": "+5511987654321"
        },
        "_timestamp": 1705518000
      },
      "endereco": {
        "value": {
          "rua": "Rua Augusta",
          "numero": "123",
          "complemento": "Sala 10",
          "bairro": "Consolação",
          "cidade": "São Paulo",
          "estado": "SP",
          "cep": "01305-100",
          "pais": "Brasil",
          "placeId": "ChIJ...",
          "coordenadas": { "lat": -23.55, "lng": -46.64 }
        },
        "_timestamp": 1705518000
      },
      "fonte": { "value": "Google Ads", "_timestamp": 1705518000 },
      "status": { "value": "em_acompanhamento", "_timestamp": 1705518000 },
      "vendedor": { "value": "USR_001", "_timestamp": 1705518000 },

      // Campos customizados
      "area_m2": { "value": 250, "_timestamp": 1705518000 },
      "orcamento": { "value": 150000, "_timestamp": 1705518000 },
      "tipo_obra": { "value": "Comercial", "_timestamp": 1705518000 },
      "prazo_desejado": { "value": "2026-06-30", "_timestamp": 1705518000 },

      // LGPD
      "lgpd_consentimento": {
        "value": true,
        "timestamp": 1705518000,
        "usuario_cadastrou": "USR_001"
      },

      // Metadados
      "_criadoEm": 1705518000,
      "_criadoPor": "USR_001",
      "_modificadoEm": 1705520000,
      "_modificadoPor": "USR_002"
    }
  },

  // Configurações de campos customizados
  "config_campos_custom": [
    {
      "id": "area_m2",
      "label": "Área (m²)",
      "tipo": "numero",
      "obrigatorio": false,
      "filtravel": true,
      "ordem": 1
    },
    {
      "id": "orcamento",
      "label": "Orçamento Previsto",
      "tipo": "dinheiro",
      "obrigatorio": false,
      "filtravel": true,
      "ordem": 2
    },
    {
      "id": "tipo_obra",
      "label": "Tipo de Obra",
      "tipo": "select",
      "opcoes": ["Residencial", "Comercial", "Industrial"],
      "obrigatorio": false,
      "filtravel": true,
      "ordem": 3
    }
  ]
}
```

---

## ✅ RESUMO

**Janela de Cadastro TEM:**

- ✅ Telefone inteligente (país + formatação auto)
- ✅ Google Maps autocomplete (padronização)
- ✅ Campos customizáveis (dinâmicos)
- ✅ LGPD (checkbox obrigatório)
- ✅ Validação completa
- ✅ UX limpa e profissional

**Configurável em Settings:**

- ✅ País padrão
- ✅ Formato telefone
- ✅ Google Maps on/off
- ✅ Criar/editar campos personalizados

**Pronto para:**

- Sprint 3-4 (implementação)
- Multi-usuário (Apps Script sync)
- Filtros avançados (campos customizados)

---

**Está assim que você imaginou?** Algo a ajustar?
