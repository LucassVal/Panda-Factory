// 🐼 PANDA FABRICS CORE KERNEL
// SYSTEM LOGIC - DO NOT EDIT

let clientes = [];
      let clienteAtual = null;
      let charts = {};
      let vendedores = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
      let templates = JSON.parse(localStorage.getItem('crmWhatsappTemplates') || '[]');

      // ========== CONFIGURAÇÕES (Vendedores e Templates) ==========
      // ========== CONFIGURAÇÕES (Vendedores e Templates) ==========
      function abrirConfiguracoes() {
          document.getElementById('settingsModal').style.display = 'block';
          
          // Load all configs
          renderizarUsuarios();
          renderizarTemplates();
          carregarConfiguracoesNaTela(); // White Label + Keys + Sources
      }

      function switchConfigTab(tabName) {
          // Esconder todas as abas
          document.querySelectorAll('#configModal .tab-content').forEach(el => el.style.display = 'none');
          document.querySelectorAll('#configModal .tab').forEach(el => el.classList.remove('active'));
          
          // Mostrar selecionada
          if(tabName === 'vendedores') {
              document.getElementById('tabVendedores').style.display = 'block';
              document.querySelector('#configModal .tab:nth-child(1)').classList.add('active');
          } else {
              document.getElementById('tabTemplates').style.display = 'block';
              document.querySelector('#configModal .tab:nth-child(2)').classList.add('active');
          }
      }

      // ========== WHITE LABEL / TEMA ==========
      let appConfig = JSON.parse(localStorage.getItem('crmConfig') || '{}');

      function aplicarTema() {
          if(appConfig.name) document.title = appConfig.name;
          
          if(appConfig.color) {
              const root = document.documentElement;
              root.style.setProperty('--primary-color', appConfig.color);
              // Simple darken logic for hover
              root.style.setProperty('--primary-hover', adjustColor(appConfig.color, -20));
              
              // FORCE BACKGROUND OVERRIDE
              // The default is a linear-gradient purple. We replace it if color is set.
              document.body.style.background = appConfig.color;
              document.body.style.backgroundImage = 'none'; // Remove gradient
          }
          
          if(appConfig.font) {
              document.body.style.fontFamily = appConfig.font;
          }
      }

      function salvarTema() {
          const name = document.getElementById('configAppName').value;
          const logo = document.getElementById('configAppLogo').value;
          const color = document.getElementById('configAppColor').value;
          const font = document.getElementById('configAppFont').value;

          appConfig = { name, logo, color, font };
          localStorage.setItem('crmConfig', JSON.stringify(appConfig));
          aplicarTema();
          alert('🎨 Tema salvo com sucesso!');
      }

      function adjustColor(color, amount) {
          return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
      }

      // ========== CUSTOM SOURCES & KEYS ==========
      let customSources = JSON.parse(localStorage.getItem('crmCustomSources') || '[]');
      // SaaS MODE: Hardcoded Keys
      const apiKeys = {
          maps: 'AIzaSyAih-Jd1LzzUWKvK5dSW6oi0zixmqynil0', 
          gemini: 'AIzaSyB7fd4wjaco1d8glU9UkWaCisC-mbU5EUw' 
      };

      // Integration functions removed for SaaS mode

      function adicionarFonteCustom() {
          const val = document.getElementById('newFonteName').value.trim().toUpperCase();
          if(!val) return;
          if(customSources.includes(val)) return alert('Fonte já existe!');
          
          customSources.push(val);
          localStorage.setItem('crmCustomSources', JSON.stringify(customSources));
          document.getElementById('newFonteName').value = '';
          renderizarListaFontesSettings();
      }

      function removerFonteCustom(idx) {
          if(confirm('Remover esta fonte?')) {
              customSources.splice(idx, 1);
              localStorage.setItem('crmCustomSources', JSON.stringify(customSources));
              renderizarListaFontesSettings();
          }
      }

      function renderizarListaFontesSettings() {
          const div = document.getElementById('listaFontesCustom');
          if(!div) return;
          div.innerHTML = customSources.map((s, i) => `
              <span class="status-badge" style="background:#e2e8f0; color:#475569; display:flex; align-items:center; gap:5px;">
                  ${s} <span onclick="removerFonteCustom(${i})" style="cursor:pointer; color:#ef4444; font-weight:bold;">&times;</span>
              </span>
          `).join('');
      }

      function carregarConfiguracoesNaTela() {
          // White Label
          if(document.getElementById('configAppName')) {
             document.getElementById('configAppName').value = appConfig.name;
             document.getElementById('configAppLogo').value = appConfig.logo;
             document.getElementById('configAppColor').value = appConfig.color;
             document.getElementById('configAppFont').value = appConfig.font; 
          }
          // Sources
          renderizarListaFontesSettings();
      }

      function renderizarOptionsFontes() {
          const select = document.getElementById('newClientFonte');
          if(!select) return;
          
          // Base Sources (Hardcoded as per user request)
          select.innerHTML = '<option value="">Selecione...</option>' +
                             '<option value="GC">GC - Guia da Construção</option>' +
                             '<option value="APPARATO">APPARATO - Marcenaria</option>' +
                             '<option value="APTTA">APTTA - Marcenaria</option>' +
                             '<option value="SIGNORE">SIGNORE - Showroom</option>' +
                             '<option value="GOOGLE">GOOGLE - Ads</option>' +
                             '<option value="META">FACE/INSTA - Meta Ads</option>';
          
          // Custom Sources (from Settings) - Excluding duplicates if any
          const baseKeys = ['GC', 'APPARATO', 'APTTA', 'SIGNORE', 'GOOGLE', 'META', 'OUTROS'];
          
          customSources.forEach(s => {
              if(!baseKeys.includes(s.toUpperCase())) {
                  select.innerHTML += `<option value="${s}">${s}</option>`;
              }
          });
      }

      // ========== MODAL CONTROL ==========

      function abrirNovoCliente() {
          document.getElementById('newClientModal').style.display = 'block';
          document.getElementById('newClientModalLabel') && (document.getElementById('newClientModalLabel').innerText = "Novo Cadastro");
          
          // Reset fields
          document.getElementById('newClientNome').value = '';
          document.getElementById('newClientFonte').value = '';
          document.getElementById('newClientCidade').value = '';
          
          renderizarInputsCustomizados(); 
          renderizarOptionsFontes();
          
          // Tentar inicializar autocomplete se o script já carregou
          if(window.google && window.google.maps && window.google.maps.places) {
              initAutocomplete();
          }
      }

      function fecharNovoCliente() {
          document.getElementById('newClientModal').style.display = 'none';
      }

      
      // Load Maps dynamically (Modern Async Loader)
      function loadGoogleMapsScript() {
          if(!apiKeys.maps) return;
          if(document.getElementById('gmaps-script')) return; 
          
          const script = document.createElement('script');
          script.id = 'gmaps-script';
          // Added loading=async per 2026 standards
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKeys.maps}&loading=async&libraries=places&callback=initAutocomplete`;
          script.async = true;
          script.defer = true;
          document.head.appendChild(script);
      }
      
      window.initAutocomplete = async function() {
          console.log("📍 Google Maps (PlaceAutocompleteElement) Iniciado");
          
          const container = document.getElementById('place-autocomplete-container');
          if(!container) return;
          
          // Clear previous instances if any
          container.innerHTML = '';

          try {
              const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");
              
              // Create the web component
              const autocomplete = new PlaceAutocompleteElement({
                  componentRestrictions: { country: ['br'] }
              });
              
              // Style styling (can be done via CSS class 'gmp-place-autocomplete-element')
              autocomplete.classList.add('form-input'); // Try to inherit usage styles
              autocomplete.style.width = '100%';
              
              container.appendChild(autocomplete);
              
              autocomplete.addEventListener('gmp-places-place-select', async ({ place }) => {
                  if (!place) return;

                  await place.fetchFields({
                      fields: ['displayName', 'formattedAddress', 'addressComponents', 'location'],
                  });
                  
                  // Reset fields
                  document.getElementById('newClientRua').value = '';
                  document.getElementById('newClientNumero').value = '';
                  document.getElementById('newClientBairro').value = '';
                  document.getElementById('newClientCidade').value = '';
                  document.getElementById('newClientEstado').value = '';
                  document.getElementById('newClientCep').value = '';

                  let rua = '';
                  let numero = '';

                  for (const component of place.addressComponents) {
                      const type = component.types[0];
                      // console.log("Component:", type, component.shortText); // Debug critico

                      if (type === 'route') {
                          rua = component.shortText;
                      } else if (type === 'street_number') {
                          numero = component.shortText;
                      } else if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1') || component.types.includes('neighborhood')) {
                          // Prioridade: Salvar qualquer indicio de bairro
                          document.getElementById('newClientBairro').value = component.shortText;
                      } else if (type === 'administrative_area_level_2') {
                          document.getElementById('newClientCidade').value = component.shortText;
                      } else if (type === 'administrative_area_level_1') {
                          document.getElementById('newClientEstado').value = component.shortText;
                      } else if (type === 'postal_code') {
                          document.getElementById('newClientCep').value = component.shortText;
                      }
                  }
                  
                  document.getElementById('newClientRua').value = rua;
                  document.getElementById('newClientNumero').value = numero;
                  
                  if(!numero) document.getElementById('newClientNumero').focus();
              });

          } catch (e) {
              console.error("Falha ao inicializar Google Maps Novo:", e);
              container.innerHTML = '<p style="color:red; font-size:12px;">Erro ao carregar mapa. Verifique API Key.</p>';
          }
      };

      // Logic for Edit Modal Autocomplete
      window.initEditAutocomplete = async function() {
          const container = document.getElementById('edit-place-autocomplete-container');
          if(!container) return;
          
          container.innerHTML = ''; // Clean

          try {
              const { PlaceAutocompleteElement } = await google.maps.importLibrary("places");
              const autocomplete = new PlaceAutocompleteElement({
                  componentRestrictions: { country: ['br'] }
              });
              
              autocomplete.classList.add('form-input');
              autocomplete.style.width = '100%';
              container.appendChild(autocomplete);
              
              autocomplete.addEventListener('gmp-places-place-select', async ({ place }) => {
                  if (!place) return;

                  await place.fetchFields({
                      fields: ['displayName', 'formattedAddress', 'addressComponents', 'location'],
                  });
                  
                  // Fill existing edit fields
                  let rua='', numero='', bairro='', cidade='', estado='', cep='';

                  for (const component of place.addressComponents) {
                      const type = component.types[0];
                      
                      if (type === 'route') rua = component.shortText;
                      if (type === 'street_number') numero = component.shortText;
                      if (type === 'administrative_area_level_2') cidade = component.shortText;
                      if (type === 'administrative_area_level_1') estado = component.shortText;
                      if (type === 'postal_code') cep = component.shortText;
                      
                      if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1') || component.types.includes('neighborhood')) {
                          bairro = component.shortText;
                      }
                  }
                  
                  // Update UI
                  document.getElementById('editClientRua').value = rua;
                  document.getElementById('editClientNumero').value = numero;
                  document.getElementById('editBairro').value = bairro;
                  document.getElementById('editClientCep').value = cep;
                  
                  // City Logic (Combined or Separate? Using combined for now to match render)
                  // The UI has City and UF separate now in my new HTML.
                  document.getElementById('editCidade').value = cidade;
                  document.getElementById('editClientEstado').value = estado;
                  
                  if(!numero) document.getElementById('editClientNumero').focus();
              });
          } catch(e) { console.error(e); }
      };

      // --- Vendedores ---
      function adicionarVendedor() {
          const nome = document.getElementById('newVendedorName').value.trim();
          if(!nome) return alert('Digite o nome do vendedor');
          
          if(vendedores.includes(nome)) return alert('Vendedor já cadastrado');
          
          vendedores.push(nome);
          localStorage.setItem('crmVendedores', JSON.stringify(vendedores));
          renderizarVendedores();
          document.getElementById('newVendedorName').value = '';
      }

      function removerVendedor(index) {
          if(confirm('Remover vendedor?')) {
              vendedores.splice(index, 1);
              localStorage.setItem('crmVendedores', JSON.stringify(vendedores));
              renderizarVendedores();
          }
      }

      function renderizarVendedores() {
          const listaValida = document.getElementById('listaVendedores');
          if (listaValida) {
             listaValida.innerHTML = vendedores.length ? '' : '<p style="color:#999">Nenhum vendedor cadastrado.</p>';
          }
          
          // Populate Report Filter
          const relSelect = document.getElementById('relVendedor');
          if(relSelect) {
              relSelect.innerHTML = '<option value="">Todos</option>';
              vendedores.forEach(v => {
                 relSelect.innerHTML += `<option value="${v}">${v}</option>`; 
              });
          }
          
          // Populate New Client Modal Vendedor Select
          const newClientSelect = document.getElementById('newClientVendedor');
          if(newClientSelect) {
              newClientSelect.innerHTML = '<option value="">Selecione...</option>';
              vendedores.forEach(v => {
                  newClientSelect.innerHTML += `<option value="${v}">${v}</option>`;
              });
          }

          // Populate Edit Client Modal Vendedor Select (if exists)
          const editClientSelect = document.getElementById('modalClientVendedor');
          if(editClientSelect) {
              editClientSelect.innerHTML = '<option value="">Selecione...</option>';
              vendedores.forEach(v => {
                  editClientSelect.innerHTML += `<option value="${v}">${v}</option>`;
              });
          }
          
          if (listaValida) {
              vendedores.forEach((v, index) => {
                  listaValida.innerHTML += `
                      <div class="item" style="display:flex; justify-content:space-between; align-items:center;">
                          <span>👤 ${v}</span>
                          <button onclick="removerVendedor(${index})" style="color:red; border:none; background:none; cursor:pointer;">🗑️</button>
                      </div>
                  `;
              });
          }
      }



      // ========== USER MANAGEMENT (NEW) ==========
      let usuarios = JSON.parse(localStorage.getItem('crmUsuarios') || '[]');

      function renderizarUsuarios() {
          const lista = document.getElementById('listaUsuarios');
          if(!lista) return;
          
          lista.innerHTML = usuarios.length ? '' : '<p style="color:#999">Nenhum usuário cadastrado.</p>';
          
          usuarios.forEach((u, index) => {
              lista.innerHTML += `
                  <div class="item" style="display:flex; justify-content:space-between; align-items:center;">
                      <div>
                          <strong>👤 ${u.login}</strong> <span style="font-size:12px; color:#666">(${u.nivel})</span>
                      </div>
                      <button onclick="removerUsuario(${index})" style="color:red; border:none; background:none; cursor:pointer;">🗑️</button>
                  </div>
              `;
          });
      }

      function adicionarUsuario() {
          const loginInput = document.getElementById('newUserLogin');
          const senhaInput = document.getElementById('newUserSenha');
          const nivelInput = document.getElementById('newUserNivel');
          
          const login = loginInput.value.trim();
          const senha = senhaInput.value.trim();
          const nivel = nivelInput.value;
          
          if(!login || !senha) return alert("Preencha login e senha!");
          
          // Check duplicate
          if(usuarios.find(u => u.login === login)) return alert("Usuário já existe!");
          
          usuarios.push({ login, senha, nivel });
          localStorage.setItem('crmUsuarios', JSON.stringify(usuarios));
          
          // Sync with Vendedores list if needed
          if(nivel === 'vendedor' && !vendedores.includes(login)) {
              vendedores.push(login);
              localStorage.setItem('crmVendedores', JSON.stringify(vendedores));
              renderizarVendedores(); // Update dropdowns
          }
          
          renderizarUsuarios();
          loginInput.value = '';
          senhaInput.value = '';
          alert("Usuário adicionado!");
      }

      function removerUsuario(index) {
          if(confirm("Remover usuário?")) {
              const u = usuarios[index];
              usuarios.splice(index, 1);
              localStorage.setItem('crmUsuarios', JSON.stringify(usuarios));
              
              // Remove from vendedores if exists
              const vIndex = vendedores.indexOf(u.login);
              if(vIndex !== -1) {
                  vendedores.splice(vIndex, 1);
                  localStorage.setItem('crmVendedores', JSON.stringify(vendedores));
                  renderizarVendedores();
              }
              
              renderizarUsuarios();
          }
      }

      // ========== SECURITY ACTIONS ==========
      
      async function solicitarAcaoSegura(acao) {
          const senhaAdmin = prompt("🔒 Digite a senha de ADMIN para continuar:");
          if (!senhaAdmin) return;

          // Verificar senha (busca usuário admin na lista)
          const adminUser = usuarios.find(u => u.nivel === 'admin' && u.login === 'admin'); // ou qualquer admin
          // Fallback para admin/admin se não existir (primeiro run)
          const senhaCorreta = adminUser ? adminUser.senha : 'admin';
          
          if(senhaAdmin !== senhaCorreta) {
              alert("❌ Senha incorreta!");
              return;
          }

          if (acao === 'limpar_clientes') {
              if(!confirm("⚠️ Tem certeza? Isso apagará TODOS os clientes cadastrados.")) return;
              
              // Limpar Store Clientes
              try {
                  const tx = window.Repo.db.transaction(['clientes'], 'readwrite');
                  tx.objectStore('clientes').clear();
                  tx.oncomplete = () => {
                      alert("✅ Clientes apagados com sucesso!");
                      location.reload();
                  };
              } catch(e) {
                  console.error(e);
                  alert("Erro ao limpar clientes.");
              }
          }

          if (acao === 'reset_fabrica') {
              if(!confirm("☢️ TEM CERTEZA? Isso fará um RESET DE FÁBRICA.\n\n- Apaga Clientes\n- Apaga Usuários\n- Apaga Templates\n- Reinicia como zero.")) return;
              
              window.Repo.clear().then(() => location.reload());
          }
      }

      async function executarImportacao(tipo) {
          if(!confirm(`Deseja importar os dados de ${tipo.toUpperCase()}? Isso adicionará registros ao banco atual.`)) return;

          let url = "";
          if(tipo === 'seed') url = "dados/seed_system.json";
          if(tipo === 'scraper') url = "dados/clientes_import_scraper.json";

          try {
              let response = await fetch(url);
              // Fallback legacy para scraper
              if(!response.ok && tipo === 'scraper') response = await fetch("dados/clientes_crm_v2.json");

              if(response.ok) {
                  let dados = await response.json();
                  let count = 0;
                  for(let c of dados) {
                       c.id = String(c.id || Date.now() + Math.random());
                       await window.Repo.save('clientes', c);
                       count++;
                  }
                  alert(`✅ Importados ${count} registros! A página será recarregada.`);
                  location.reload();
              } else {
                  alert("❌ Arquivo de dados não encontrado: " + url);
              }
          } catch(e) {
              console.error(e);
              alert("Erro na importação: " + e.message);
          }
      }

      // --- Templates ---
      function adicionarTemplate() {
          const title = document.getElementById('newTemplateTitle').value.trim();
          const body = document.getElementById('newTemplateBody').value.trim();
          
          if(!title || !body) return alert('Preencha título e conteúdo');
          
          templates.push({ title, body });
          localStorage.setItem('crmWhatsappTemplates', JSON.stringify(templates));
          renderizarTemplates();
          
          document.getElementById('newTemplateTitle').value = '';
          document.getElementById('newTemplateBody').value = '';
          alert('Template salvo!');
      }

      function removerTemplate(index) {
          if(confirm('Remover template?')) {
              templates.splice(index, 1);
              localStorage.setItem('crmWhatsappTemplates', JSON.stringify(templates));
              renderizarTemplates();
          }
      }

      function renderizarTemplates() {
          const lista = document.getElementById('listaTemplates');
          if(!lista) return; // Segurança contra crash
          
          lista.innerHTML = templates.length ? '' : '<p style="color:#999">Nenhum template cadastrado.</p>';
          
          templates.forEach((t, index) => {
              lista.innerHTML += `
                  <div class="item">
                      <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                          <strong>📱 ${t.title}</strong>
                          <button onclick="removerTemplate(${index})" style="color:red; border:none; background:none; cursor:pointer;">🗑️</button>
                      </div>
                      <div style="font-size:12px; color:#666; white-space:pre-wrap;">${t.body.substring(0, 100)}${t.body.length > 100 ? '...' : ''}</div>
                  </div>
              `;
          });
      }

      // --- Telefones Dinâmicos ---
      function adicionarInputTelefone(nome = '', numero = '') {
          const container = document.getElementById('phonesContainer');
          // const id = Date.now() + Math.random(); // Unused
          
          const div = document.createElement('div');
          div.className = 'phone-row';
          div.innerHTML = `
              <input type="text" class="form-input" placeholder="Nome (Ex: Esposa)" value="${nome}" style="width: 40%;">
              <input type="tel" class="form-input phone-input-field" placeholder="(XX) XXXXX-XXXX" value="${numero}" style="width: 50%;" maxlength="15">
              <button class="btn-icon" onclick="this.parentElement.remove()" style="color:red;">🗑️</button>
              <button class="btn-whatsapp" onclick="abrirWhatsappManual(this.previousElementSibling.previousElementSibling.value, '${clienteAtual?.nome || ''}')" title="Enviar WhatsApp" style="margin-left:5px;">📱</button>
          `;
          container.appendChild(div);
          
          // Adicionar máscara ao novo input
          const inputTel = div.querySelector('.phone-input-field');
          inputTel.addEventListener('input', function() {
              this.value = mascaraTelefone(this.value);
          });
          
          // Fix logic for whatsapp button target (getting values dynamically)
          const btnZap = div.querySelector('.btn-whatsapp');
          btnZap.onclick = function() {
              const telVal = inputTel.value;
              abrirWhatsappManual(telVal, clienteAtual?.nome || '');
          };
      }

      function mascaraTelefone(v) {
          v = v.replace(/\D/g, ""); // Remove tudo o que não é dígito
          v = v.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em volta dos dois primeiros dígitos
          v = v.replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca hífen entre o quarto e o quinto dígitos
          return v;
      }

      function aplicarMascaras() {
          document.querySelectorAll('.phone-input-field').forEach(input => {
              input.addEventListener('input', function() {
                  this.value = mascaraTelefone(this.value);
              });
          });
      }

      function verificarFonteOutros(select) {
          const input = document.getElementById('newClientFonteOutro');
          if(select.value === 'OUTROS') {
              input.style.display = 'block';
              input.required = true;
          } else {
              input.style.display = 'none';
              input.required = false;
          }
      }

      // --- LEAD MANAGEMENT (REPOSITORY PATTERN) ---
      
      async function salvarNovoCliente() {
        const nome = document.getElementById("newClientName").value.trim();
        const cidade = document.getElementById("newClientCidade").value;
        const data = document.getElementById("newClientData").value;
        const endereco = document.getElementById("newClientEndereco").value.trim();
        const bairro = document.getElementById("newClientBairro").value.trim();
        const estagio = document.getElementById("newClientEstagio").value;
        const observacao = document.getElementById("newClientObs").value.trim();
        const vendedor = document.getElementById("newClientVendedor")?.value || ""; 
        
        // Telefones dinâmicos
        const telInputs = document.querySelectorAll('#phonesContainer .phone-row');
        let telefones = [];
        
        // Adicionar telefone principal (se preenchido)
        const telPrincipal = document.getElementById("newClientPhone").value.trim();
        if(telPrincipal) {
            telefones.push({ nome: 'Principal', numero: telPrincipal });
        }
        
        telInputs.forEach(row => {
           const nomeTel = row.querySelector('input[type="text"]').value.trim() || 'Outro';
           const numTel = row.querySelector('input[type="tel"]').value.trim();
           if(numTel) {
               telefones.push({ nome: nomeTel, numero: numTel });
           }
        });

        // Fonte
        const fonteSelect = document.getElementById("newClientFonte");
        let fonte = fonteSelect.value;
        // OUTROS removed


        if (!nome || !data) {
          document.getElementById("newClientAlert").innerHTML =
            '<div class="error-alert">Preencha Nome e Data!</div>';
          return;
        }

        const novoId = Date.now().toString();

        const novoCliente = {
          id: novoId,
          nome,
          cidade,
          data,
          telefones: telefones,
          endereco,
          bairro,
          estagio,
          observacao,
          status: "nao_acompanhando",
          motivo: "",
          valor_estimado: parseFloat(document.getElementById("newClientValor").value) || 0,
          fonte: fonte,
          vendedor: vendedor,
          prospect: true,
          historico: [
            {
              id: Date.now() + Math.random(),
              tipo: "sistema",
              data: new Date().toISOString(),
              texto: "Cliente cadastrado no sistema v2.2 (Repository)",
              autor: "Sistema"
            }
          ],
          
          // GHOST COLUMNS
          _id_loja: '1',
          _metadata_fiscal: {}
        };

        try {
            // SALVAR NO REPOSITORY (IndexedDB)
            await window.Repo.save('clientes', novoCliente);
            
            // Atualizar memória e UI
            clientes.push(novoCliente);
            
            document.getElementById("newClientAlert").innerHTML =
              '<div class="success-alert">Cliente salvo com sucesso!</div>';
            
            // Limpar
            document.getElementById("newClientName").value = "";
            document.getElementById("newClientPhone").value = "";
            document.getElementById("newClientEndereco").value = "";
            document.getElementById("newClientBairro").value = "";
            document.getElementById("newClientObs").value = "";
            document.getElementById("newClientValor").value = "";
            document.getElementById("phonesContainer").innerHTML = "";

            renderizarClientes();
            atualizarGraficos(); 
            
            setTimeout(() => {
              fecharNovoCliente();
              document.getElementById("newClientAlert").innerHTML = "";
            }, 1000);
            
        } catch(e) {
            console.error("Erro CRÍTICO ao salvar:", e);
            document.getElementById("newClientAlert").innerHTML = 
                '<div class="error-alert">Erro ao salvar no banco.</div>';
        }
      }

      function abrirWhatsappManual(telefone, nomeCliente) {
          if(!telefone) return alert('Telefone inválido');
          // Limpar caracteres não numéricos
          const cleanPhone = telefone.replace(/\D/g, '');
          
          // Abrir modal de templates passando o telefone alvo
          abrirModalWhatsapp(cleanPhone, nomeCliente);
      }

      async function carregarDados() {
        try {
          console.log("🚀 Iniciando sistema com Repository...");
          
          // 1. Inicializar Banco (IndexedDB) + Sync Loop
          await window.Repo.init();

          // 2. Migração Silenciosa (LocalStorage -> IndexedDB)
          await migrarDadosLegados();

          // 3. Carregar do Banco Novo
          clientes = await window.Repo.getAll('clientes');
          console.log(`📡 ${clientes.length} clientes carregados do IndexedDB`);

          // Fallback: Se banco novo vazio, apenas loga.
          if (clientes.length === 0) {
              console.log("⚠️ IndexedDB vazio. Iniciando sistema zerado.");
          }

          // Compatibilidade e tratamento de dados legacy
          clientes = clientes.map(c => {
             // Tratamentos de historico/telefones legados podem ser feitos aqui se necessário
             // Ex: Garantir array historico
             c.historico = c.historico || [];
             c.telefones = c.telefones || [];
             return c;
          });

          inicializar();
          
        } catch (error) {
           console.error("❌ Erro CRÍTICO ao carregar:", error);
           alert("Erro ao inicializar banco de dados. Veja o console.");
        }
      }

      // --- MIGRATION UTILS ---
      async function migrarDadosLegados() {
          const dadosSalvos = localStorage.getItem("crmDados_v2");
          if (dadosSalvos) {
              console.log("🔄 Detectado localStorage. Migrando para IndexedDB...");
              try {
                  const clientesAntigos = JSON.parse(dadosSalvos);
                  if(Array.isArray(clientesAntigos) && clientesAntigos.length > 0) {
                      let count = 0;
                      for (const c of clientesAntigos) {
                          const existe = await window.Repo.getById('clientes', c.id);
                          if (!existe) {
                              await window.Repo.save('clientes', c);
                              count++;
                          }
                      }
                      console.log(`✅ Migração concluída: ${count} registros movidos.`);
                      // localStorage.removeItem("crmDados_v2"); // Descomentar futuramente
                  }
              } catch(e) {
                  console.error("Erro na migração:", e);
              }
          }
      }


      // ========== UI CONTROL & SESSION ==========

      function mudarTabSettings(index) {
          // Hide all tabs CONTENT
          document.getElementById('settingsTab0').classList.remove('active');
          document.getElementById('settingsTab1').classList.remove('active');
          document.getElementById('settingsTab2').classList.remove('active');
          
          // Deactivate all tabs BUTTONS
          document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          
          // Activate specific
          document.getElementById('settingsTab' + index).classList.add('active');
          document.querySelectorAll('.tab')[index].classList.add('active');

          if(index === 0) renderizarUsuarios();
          if(index === 1) renderizarTemplates();
          if(index === 2) carregarConfiguracoesNaTela();
      }

      function mudarView(viewId) {
          // Hide all views
          document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
          const targetView = document.getElementById(viewId + '-view');
          if(targetView) targetView.classList.add('active');
          
          // Update Nav Items in Dock (using data-view attribute)
          document.querySelectorAll('#appDock .nav-item[data-view]').forEach(el => {
              el.classList.remove('active');
              if(el.dataset.view === viewId || (viewId === 'home' && el.dataset.view === 'inicio')) {
                  el.classList.add('active');
              }
          });
      }

      // ========== DRAGGABLE DOCK ==========
      function initDraggableDock() {
          const dock = document.getElementById('appDock');
          const handle = document.getElementById('dockHandle');
          if(!dock || !handle) return;

          let isDragging = false;
          let startX, startY, initialLeft, initialTop;

          // Load saved position
          const savedPosition = localStorage.getItem('crmDockPosition');
          if(savedPosition) {
              try {
                  const pos = JSON.parse(savedPosition);
                  dock.style.left = pos.left + 'px';
                  dock.style.top = pos.top + 'px';
                  dock.style.bottom = 'auto'; // Override default bottom positioning
                  dock.style.transform = 'none';
              } catch(e) {
                  console.warn('Invalid dock position saved, using default.');
                  centerDock();
              }
          } else {
              centerDock();
          }

          function centerDock() {
              // Center horizontally at bottom
              const dockWidth = dock.offsetWidth;
              dock.style.left = (window.innerWidth / 2 - dockWidth / 2) + 'px';
              dock.style.bottom = '30px';
              dock.style.top = 'auto';
              dock.style.transform = 'none';
          }

          handle.addEventListener('mousedown', startDrag);
          handle.addEventListener('touchstart', startDrag, { passive: false });

          function startDrag(e) {
              e.preventDefault();
              isDragging = true;
              dock.classList.add('dragging');

              const touch = e.touches ? e.touches[0] : e;
              startX = touch.clientX;
              startY = touch.clientY;

              // Get current position
              const rect = dock.getBoundingClientRect();
              initialLeft = rect.left;
              initialTop = rect.top;

              // Switch to absolute positioning from current visual position
              dock.style.left = initialLeft + 'px';
              dock.style.top = initialTop + 'px';
              dock.style.bottom = 'auto';
              dock.style.transform = 'none';

              document.addEventListener('mousemove', drag);
              document.addEventListener('mouseup', stopDrag);
              document.addEventListener('touchmove', drag, { passive: false });
              document.addEventListener('touchend', stopDrag);
          }

          function drag(e) {
              if(!isDragging) return;
              e.preventDefault();

              const touch = e.touches ? e.touches[0] : e;
              const deltaX = touch.clientX - startX;
              const deltaY = touch.clientY - startY;

              let newLeft = initialLeft + deltaX;
              let newTop = initialTop + deltaY;

              // Bounds checking
              const dockRect = dock.getBoundingClientRect();
              const maxX = window.innerWidth - dockRect.width;
              const maxY = window.innerHeight - dockRect.height;

              newLeft = Math.max(0, Math.min(newLeft, maxX));
              newTop = Math.max(0, Math.min(newTop, maxY));

              dock.style.left = newLeft + 'px';
              dock.style.top = newTop + 'px';
          }

          function stopDrag() {
              if(!isDragging) return;
              isDragging = false;
              dock.classList.remove('dragging');

              // Save position
              const rect = dock.getBoundingClientRect();
              localStorage.setItem('crmDockPosition', JSON.stringify({
                  left: rect.left,
                  top: rect.top
              }));

              document.removeEventListener('mousemove', drag);
              document.removeEventListener('mouseup', stopDrag);
              document.removeEventListener('touchmove', drag);
              document.removeEventListener('touchend', stopDrag);
          }

          // Reset dock position on double-click
          handle.addEventListener('dblclick', () => {
              localStorage.removeItem('crmDockPosition');
              centerDock();
          });
      }

      // Auto-init dock when DOM ready
      document.addEventListener('DOMContentLoaded', initDraggableDock);

      function abrirConfig() {
          renderizarUsuarios();
          renderizarTemplates();
          document.getElementById('settingsModal').style.display = 'block';
      }

      function fazerLogout() {
          if(confirm("Sair do sistema?")) {
              sessionStorage.removeItem('crmLogado');
              sessionStorage.removeItem('usuarioAtual');
              location.reload();
          }
      }

      function inicializar() {
        // Garantir Vendedores Padrão
        if(!vendedores || vendedores.length === 0) {
            vendedores = ['Vendedor 1', 'Vendedor 2'];
            localStorage.setItem('crmVendedores', JSON.stringify(vendedores));
        }

        popularFiltros();
        atualizarEstatisticas();
        renderizarClientes();
        criarGraficos();
        // Inicializar configurações
        renderizarVendedores();
        renderizarTemplates();
        initReportGenerator(); // Iniciar UI Relatórios
          aplicarTema(); // Aplica personalização salva
          if(apiKeys?.maps) loadGoogleMapsScript(); // Load Maps if key exists em inputs estáticos

        // Listeners
        document.getElementById("searchInput").addEventListener("input", filtrarClientes);
        document.getElementById("statusFilter").addEventListener("change", filtrarClientes);
        document.getElementById("cidadeFilter").addEventListener("change", filtrarClientes);
        document.getElementById("bairroFilter").addEventListener("change", filtrarClientes);
        
        // Novos Listeners
        document.getElementById("minArea").addEventListener("input", filtrarClientes);
        document.getElementById("maxArea").addEventListener("input", filtrarClientes);

        document.querySelectorAll(".status-option").forEach((option) => {
          option.addEventListener("click", function () {
            document.querySelectorAll(".status-option").forEach((o) => o.classList.remove("selected"));
            this.classList.add("selected");
          });
        });
      }

      function popularFiltros() {
        // Ordenar cidades alfabeticamente
        const cidades = [...new Set(clientes.map((c) => c.cidade))].sort((a,b) => a.localeCompare(b));
        const bairros = [...new Set(clientes.map((c) => c.bairro).filter(b => b))].sort((a,b) => a.localeCompare(b));

        // Populate Main Filters
        const cidadeSelect = document.getElementById("cidadeFilter");
        const reportCidadeSelect = document.getElementById("reportCidade");
        
        cidadeSelect.innerHTML = '<option value="">Todas as Cidades</option>';
        if(reportCidadeSelect) reportCidadeSelect.innerHTML = '<option value="">Todas</option>';
        
        cidades.forEach((cidade) => {
          if(!cidade) return;
          const option = document.createElement("option");
          option.value = cidade;
          option.textContent = cidade;
          cidadeSelect.appendChild(option);
          
          if(reportCidadeSelect) {
              const opt2 = document.createElement("option");
              opt2.value = cidade;
              opt2.textContent = cidade;
              reportCidadeSelect.appendChild(opt2);
          }
        });
        
        const bairroSelect = document.getElementById("bairroFilter");
        bairroSelect.innerHTML = '<option value="">Todos os Bairros</option>';
        bairros.forEach((bairro) => {
          const option = document.createElement("option");
          option.value = bairro;
          option.textContent = bairro;
          bairroSelect.appendChild(option);
        });
      }
      
      function filtrarClientes() {
        const busca = document.getElementById("searchInput").value.toLowerCase();
        const statusFiltro = document.getElementById("statusFilter").value;
        const cidadeFiltro = document.getElementById("cidadeFilter").value;
        const bairroFiltro = document.getElementById("bairroFilter").value;
        const minArea = parseFloat(document.getElementById("minArea").value) || 0;
        const maxArea = parseFloat(document.getElementById("maxArea").value) || Infinity;
        const sortOption = document.getElementById("sortOption").value;

        // Filtragem
        let clientesFiltrados = clientes.filter((cliente) => {
          const matchBusca =
            !busca ||
            cliente.nome.toLowerCase().includes(busca) ||
            cliente.id.includes(busca) ||
            cliente.cidade.toLowerCase().includes(busca) ||
            (cliente.bairro && cliente.bairro.toLowerCase().includes(busca));

          const matchStatus = !statusFiltro || cliente.status === statusFiltro;
          const matchCidade = !cidadeFiltro || cliente.cidade === cidadeFiltro;
          const matchBairro = !bairroFiltro || cliente.bairro === bairroFiltro;
          
          // Filtro M²
          const metragem = parseFloat(cliente.metragem) || 0;
          const matchArea = metragem >= minArea && metragem <= maxArea;

          return matchBusca && matchStatus && matchCidade && matchBairro && matchArea;
        });
        
        // Ordenação
        clientesFiltrados.sort((a, b) => {
            if(sortOption === 'az') return a.nome.localeCompare(b.nome);
            if(sortOption === 'za') return b.nome.localeCompare(a.nome);
            if(sortOption === 'm2desc') return (parseFloat(b.metragem)||0) - (parseFloat(a.metragem)||0);
            if(sortOption === 'm2asc') return (parseFloat(a.metragem)||0) - (parseFloat(b.metragem)||0);
            
             // Default: Mais recentes primeiro (pela ID/Timestamp)
             // Assumindo IDs como MAN-TIMESTAMP ou numéricos que crescem
             // Se ID não for comparável, usar data. Mas ID timestamp já serve.
             return (b.id > a.id) ? 1 : -1;
        });

        if(isKanbanView) {
            // Se estiver no Kanban, renderizar o Kanban (mas ele usa a lista global 'clientes', então filtrar nela visualmente ou atualizar global?)
            // O Kanban geralmente mostra tudo ou filtrar colunas?
            // Vamos filtrar visualmente:
            // Kanban complexo: filtrar arrays internos.
            // Solução simples: Atualizar variável global 'clientesFiltradosParaKanban' e chamar renderizarKanban passando lista?
            // O renderizarKanban atual usa 'clientes' global. Vamos alterá-lo para aceitar argumento opcional.
            renderizarKanban(clientesFiltrados);
        } else {
            renderizarClientes(clientesFiltrados);
        }
      }

      function atualizarEstatisticas() {
        const totalProspects = clientes.length;
        const emAcompanhamento = clientes.filter(
          (c) => c.status === "em_acompanhamento"
        ).length;
        const comOrcamento = clientes.filter(
          (c) => c.status === "com_orcamento"
        ).length;
        const fechados = clientes.filter((c) => c.status === "fechado").length;
        const perdidos = clientes.filter(
          (c) => c.status === "finalizado"
        ).length;

        document.getElementById("totalProspects").textContent = totalProspects;
        document.getElementById("totalAcompanhamento").textContent =
          emAcompanhamento;
        document.getElementById("totalOrcamento").textContent = comOrcamento;
        document.getElementById("totalFechados").textContent = fechados;
        document.getElementById("totalPerdidos").textContent = perdidos;

        if (charts.statusChart) {
          atualizarGraficos();
        }
      }

      function criarGraficos() {
        // [REMOVIDO: GRÁFICOS FORAM DEPRECIADOS EM FAVOR DO PANDA HERO UI]
        // Mantendo função vazia para não quebrar chamadas antigas
        console.log('🐼 Charts are deprecated in new UI.');
      }
      // [CÓDIGO LEGADO REMOVIDO]

      function atualizarGraficos() {
        const statusData = [
          clientes.filter((c) => c.status === "nao_acompanhando").length,
          clientes.filter((c) => c.status === "em_acompanhamento").length,
          clientes.filter((c) => c.status === "com_orcamento").length,
          clientes.filter((c) => c.status === "fechado").length,
          clientes.filter((c) => c.status === "finalizado").length,
        ];
        charts.statusChart.data.datasets[0].data = statusData;
        charts.statusChart.update();

        const valueData = [
          clientes
            .filter((c) => c.status === "em_acompanhamento")
            .reduce((sum, c) => sum + (c.valor_estimado || 0), 0),
          clientes
            .filter((c) => c.status === "com_orcamento")
            .reduce((sum, c) => sum + (c.valor_estimado || 0), 0),
          clientes
            .filter((c) => c.status === "fechado")
            .reduce((sum, c) => sum + (c.valor_estimado || 0), 0),
          clientes
            .filter((c) => c.status === "finalizado")
            .reduce((sum, c) => sum + (c.valor_estimado || 0), 0),
        ];
        charts.valueChart.data.datasets[0].data = valueData;
        charts.valueChart.update();

        const acompanhando = clientes.filter(
          (c) => c.status !== "nao_acompanhando"
        ).length;
        const naoAcompanhando = clientes.filter(
          (c) => c.status === "nao_acompanhando"
        ).length;
        charts.prospectChart.data.datasets[0].data = [
          acompanhando,
          naoAcompanhando,
        ];
        charts.prospectChart.update();
      }

      // Formatar telefone para (xx) xxxxx-xxxx
      function formatarTelefone(numero) {
        if (!numero) return 'Não informado';
        
        // Remove tudo que não é número
        const nums = numero.toString().replace(/\D/g, '');
        
        // Formata (xx) xxxxx-xxxx ou (xx) xxxx-xxxx
        if (nums.length === 11) {
          return `(${nums.slice(0,2)}) ${nums.slice(2,7)}-${nums.slice(7)}`;
        } else if (nums.length === 10) {
          return `(${nums.slice(0,2)}) ${nums.slice(2,6)}-${nums.slice(6)}`;
        } else if (nums.length === 9) {
          return `${nums.slice(0,5)}-${nums.slice(5)}`;
        } else if (nums.length === 8) {
          return `${nums.slice(0,4)}-${nums.slice(4)}`;
        }
        
        return numero; // Retorna original se não conseguir formatar
      }

      function renderizarClientes(clientesFiltrados = clientes) {
        const grid = document.getElementById("clientsGrid");
        if(!grid) return;
        
        grid.innerHTML = "";

        if (clientesFiltrados.length === 0) {
          grid.innerHTML =
            `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #444;">
                <div style="font-size: 40px; margin-bottom: 10px;">👻</div>
                <p>Nenhum cliente encontrado.</p>
             </div>`;
          return;
        }

        const statusLabels = {
            nao_acompanhando: "Não Acompanhando",
            em_acompanhamento: "Em Acompanhamento",
            com_orcamento: "Com Orçamento",
            fechado: "Fechado",
            finalizado: "Finalizado",
        };

        // Fragment for performance
        const fragment = document.createDocumentFragment();

        clientesFiltrados.forEach((cliente) => {
          const card = document.createElement("div");
          card.className = "client-card"; // Removed status specific class on card to keep it clean
          card.onclick = () => abrirModal(cliente);

          const numAnotacoes = cliente.anotacoes?.length || 0;
          const numRetornos = cliente.retornos?.length || 0;
          
          // Tratamento de telefone
          let telDisplay = "Sem telefone";
          if(cliente.telefone) telDisplay = formatarTelefone(cliente.telefone);
          else if(Array.isArray(cliente.telefones) && cliente.telefones.length > 0) {
              telDisplay = formatarTelefone(typeof cliente.telefones[0] === 'string' ? cliente.telefones[0] : cliente.telefones[0].numero);
          }

          // Tratamento de valores para exibição segura
          const infoMetragem = cliente.metragem ? `${cliente.metragem}m²` : '--';
          const infoCidade = cliente.cidade || 'Local não informado';
          const labelStatus = statusLabels[cliente.status] || cliente.status;

          card.innerHTML = `
              <div class="client-header">
                  <span class="client-id">#${String(cliente.id).substring(0,6)}</span>
                  <span class="status-label status-${cliente.status}-label">${labelStatus}</span>
              </div>
              
              <div class="client-name" title="${cliente.nome}">${cliente.nome}</div>
              
              <div class="client-info">📍 ${infoCidade}</div>
              <div class="client-info">📱 ${telDisplay}</div>
              <div class="client-info">📐 ${infoMetragem}</div>

              <div class="badges">
                  ${cliente.prospect ? '<span class="badge" style="color:#a8a29e">Prospect</span>' : ''}
                  <span class="badge">📝 ${numAnotacoes}</span>
                  <span class="badge">📞 ${numRetornos}</span>
              </div>
          `;

          fragment.appendChild(card);
        });
        
        grid.appendChild(fragment);
      }

      function filtrarClientes() {
        const busca = document
          .getElementById("searchInput")
          .value.toLowerCase();
        const statusFiltro = document.getElementById("statusFilter").value;
        const cidadeFiltro = document.getElementById("cidadeFilter").value;
        const bairroFiltro = document.getElementById("bairroFilter").value;
        const minArea = parseFloat(document.getElementById("minArea").value) || 0;
        const maxArea = parseFloat(document.getElementById("maxArea").value) || Infinity;

        let clientesFiltrados = clientes.filter((cliente) => {
          const matchBusca =
            !busca ||
            cliente.nome.toLowerCase().includes(busca) ||
            cliente.id.includes(busca) ||
            cliente.cidade.toLowerCase().includes(busca);

          const matchStatus = !statusFiltro || cliente.status === statusFiltro;
          const matchCidade = !cidadeFiltro || cliente.cidade === cidadeFiltro;
          const matchBairro = !bairroFiltro || cliente.bairro === bairroFiltro;
          
          const metragem = parseFloat(cliente.metragem) || 0;
          const matchArea = metragem >= minArea && metragem <= maxArea;

          return matchBusca && matchStatus && matchCidade && matchBairro && matchArea;
        });

        renderizarClientes(clientesFiltrados);
      }

      // Variável global para controlar ordenação
      let ordemAtual = { campo: null, ascendente: true };

      function ordenarClientes(campo) {
        // Alternar direção se clicar no mesmo campo
        if (ordemAtual.campo === campo) {
          ordemAtual.ascendente = !ordemAtual.ascendente;
        } else {
          ordemAtual.campo = campo;
          ordemAtual.ascendente = true;
        }

        clientes.sort((a, b) => {
          let valorA, valorB;

          switch (campo) {
            case 'nome':
              valorA = (a.nome || '').toLowerCase();
              valorB = (b.nome || '').toLowerCase();
              break;
            case 'cidade':
              valorA = (a.cidade || '').toLowerCase();
              valorB = (b.cidade || '').toLowerCase();
              break;
            case 'bairro':
              valorA = (a.bairro || '').toLowerCase();
              valorB = (b.bairro || '').toLowerCase();
              break;
            case 'metragem':
              valorA = parseFloat(a.metragem) || 0;
              valorB = parseFloat(b.metragem) || 0;
              break;
            case 'estagio':
              valorA = (a.estagio || '').toLowerCase();
              valorB = (b.estagio || '').toLowerCase();
              break;
            default:
              return 0;
          }

          if (valorA < valorB) return ordemAtual.ascendente ? -1 : 1;
          if (valorA > valorB) return ordemAtual.ascendente ? 1 : -1;
          return 0;
        });

        filtrarClientes(); // Re-renderizar com nova ordem
      }


      function abrirModal(cliente) {
        clienteAtual = cliente;
        mudarTab(0); // Resetar para aba Informações

        document.getElementById("modalClientName").textContent = cliente.nome;
        document.getElementById("modalClientId").textContent = `Código: #${cliente.id} | Fonte: ${cliente.fonte}`;

        // Formatar Telefones V2 (Robusto)
        let telefonesHtml = 'Não informado';
        if(cliente.telefones && Array.isArray(cliente.telefones) && cliente.telefones.length > 0) {
            telefonesHtml = cliente.telefones.map(t => {
                if (!t) return '';
                // Extrair número e nome com segurança
                const num = (typeof t === 'object' && t.numero) ? t.numero : (typeof t === 'string' ? t : '');
                
                if (!num) return ''; // Ignora vazios

                const nome = (typeof t === 'object' && t.nome) ? `(${t.nome})` : '';
                const nomeClienteSafe = cliente.nome.replace(/'/g, "\\'"); // Escape quotes
                
                return `
                    <div style="display:flex; align-items:center; gap:5px; margin-bottom:5px;">
                        <span>${num} ${nome}</span>
                        <button class="btn-whatsapp" onclick="abrirWhatsappManual('${num}', '${nomeClienteSafe}')" title="WhatsApp">📱</button>
                    </div>
                `;
            }).join('');
            
            if (telefonesHtml === '') telefonesHtml = 'Não informado';
        }

        const modalInfo = document.getElementById("modalInfo");
        modalInfo.innerHTML = `
                <!-- ... (Cidades, Endereço mantidos) ... -->
                <div class="info-item">
                    <div class="info-label">Cidade</div>
                    <div class="info-value">${cliente.cidade}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Endereço/Bairro</div>
                    <div class="info-value">${cliente.endereco || '-'}, ${cliente.bairro || '-'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Metragem</div>
                    <div class="info-value">${cliente.metragem}m²</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Estágio</div>
                    <div class="info-value">${cliente.estagio || "Não informado"}</div>
                </div>
                <!-- Telefones Atualizado -->
                <div class="info-item">
                    <div class="info-label">Telefones</div>
                    <div class="info-value">${telefonesHtml}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Valor Estimado</div>
                    <div class="info-value">R$ ${(cliente.valor_estimado || 0).toLocaleString("pt-BR", {minimumFractionDigits: 2})}</div>
                </div>
                <div class="info-item" style="grid-column: 1 / -1;">
                    <div class="info-label">Observação</div>
                    <div class="info-value">${cliente.observacao || "Nenhuma observação"}</div>
                </div>
            `;
            
        // Seleção de Vendedor na Anotação (Se houver)
        // ... (será adicionado no renderizarAnotacoes) ...

        document.querySelectorAll(".status-option").forEach((option) => {
          option.classList.remove("selected");
          if (option.dataset.status === cliente.status) {
            option.classList.add("selected");
          }
        });

        document.getElementById("statusMotivo").value = cliente.motivo || "";
        document.getElementById("statusValor").value = cliente.valor_estimado || 0;
        document.getElementById("statusAlert").innerHTML = "";

        document.getElementById("clientModal").style.display = "block";
      }

      // ========== KANBAN ==========
      let isKanbanView = false;
      
      function toggleKanbanView() {
          isKanbanView = !isKanbanView;
          const grid = document.getElementById('clientsGrid');
          const kanban = document.getElementById('kanbanContainer');
          const btn = document.getElementById('toggleViewBtn');
          
          if(isKanbanView) {
              grid.style.display = 'none';
              kanban.classList.add('active');
              btn.textContent = '📋 Ver em Lista';
              renderizarKanban();
          } else {
              kanban.classList.remove('active');
              grid.style.display = 'grid';
              btn.textContent = '📊 Ver Kanban';
              renderizarClientes();
          }
      }

      function renderizarKanban(listaClientes = clientes) {
          const container = document.getElementById('kanbanContainer');
          container.innerHTML = '';
          
          const statusMap = {
             'nao_acompanhando': '⚪ Não Acompanhando',
             'em_acompanhamento': '🟢 Em Acompanhamento',
             'com_orcamento': '🟡 Com Orçamento',
             'fechado': '🟢 Fechado',
             'finalizado': '🔴 Perdido'
          };
          
          Object.keys(statusMap).forEach(statusKey => {
              const col = document.createElement('div');
              col.className = 'kanban-column';
              col.ondragover = allowDrop;
              col.ondrop = (e) => drop(e, statusKey);
              
              const header = document.createElement('div');
              header.className = 'kanban-header';
              // Contar itens filtrados
              const itensStatus = listaClientes.filter(c => c.status === statusKey);
              header.innerHTML = `<span>${statusMap[statusKey]}</span> <span style="background:#ddd; padding:2px 8px; border-radius:10px; font-size:12px;">${itensStatus.length}</span>`;
              
              const body = document.createElement('div');
              body.className = 'kanban-body';
              
              itensStatus.forEach(c => {
                  const card = document.createElement('div');
                  card.className = 'kanban-card';
                  card.draggable = true;
                  card.ondragstart = (e) => drag(e, c.id);
                  card.onclick = () => abrirModal(c);
                  card.innerHTML = `
                      <div style="font-weight:bold; margin-bottom:5px;">${c.nome}</div>
                      <div style="font-size:12px; color:#666;">${c.cidade}</div>
                      ${c.valor_estimado > 0 ? `<div style="font-size:12px; color:#16a34a; font-weight:bold;">R$ ${c.valor_estimado.toLocaleString('pt-BR')}</div>` : ''}
                  `;
                  body.appendChild(card);
              });
              
              col.appendChild(header);
              col.appendChild(body);
              container.appendChild(col);
          });
      }

      // Drag and Drop
      function allowDrop(ev) {
          ev.preventDefault();
          ev.currentTarget.classList.add('drag-over');
      }
      
      function drag(ev, id) {
          ev.dataTransfer.setData("text", id);
      }
      
      function drop(ev, newStatus) {
          ev.preventDefault();
          ev.currentTarget.classList.remove('drag-over');
          const id = ev.dataTransfer.getData("text");
          
          const cliente = clientes.find(c => c.id === id);
          if(cliente && cliente.status !== newStatus) {
              cliente.status = newStatus;
              cliente.data_status = new Date().toISOString();
              // Se for perdido, pedir motivo
              if(newStatus === 'finalizado' && !cliente.motivo) {
                  cliente.motivo = prompt('Motivo da perda?') || 'Não informado';
              }
              salvarDados();
              renderizarKanban();
              atualizarEstatisticas();
          }
      }

      // ========== WHATSAPP LOGIC ==========
      function abrirModalWhatsapp(telefone, nomeCliente) {
          document.getElementById('whatsappModal').style.display = 'block';
          
          const lista = document.getElementById('whatsappTemplatesList');
          lista.innerHTML = '';
          
          // Renderizar templates
          templates.forEach(t => {
              const div = document.createElement('div');
              div.className = 'template-card';
              div.innerHTML = `<strong>${t.title}</strong>`;
              div.onclick = () => selecionarTemplate(t, nomeCliente);
              lista.appendChild(div);
          });
          
          // Armazenar dados no botão enviar
          const btn = document.querySelector('#whatsappModal .btn-success');
          btn.onclick = () => enviarWhatsappReal(telefone);
      }
      
      function selecionarTemplate(template, nomeCliente) {
          let texto = template.body;
          // Substituir variáveis
          texto = texto.replace(/{nome}/g, nomeCliente);
          texto = texto.replace(/{cidade}/g, clienteAtual?.cidade || '');
          texto = texto.replace(/{bairro}/g, clienteAtual?.bairro || '');
          texto = texto.replace(/{estagio}/g, clienteAtual?.estagio || '');
          
          document.getElementById('whatsappPreview').value = texto;
      }
      
      function enviarWhatsappReal(telefone) {
          const texto = document.getElementById('whatsappPreview').value;
          if(!texto.trim()) return alert('Digite uma mensagem');
          
          const encodedText = encodeURIComponent(texto);
          const url = `https://wa.me/55${telefone}?text=${encodedText}`;
          window.open(url, '_blank');
          fecharModal('whatsappModal');
      }

      // Fechar Modal Universal
      function fecharModal(modalId) {
          if(modalId) {
              document.getElementById(modalId).style.display = 'none';
          } else {
              // Fechar todos os modais principais
              document.getElementById("clientModal").style.display = "none";
              document.getElementById("auditModal").style.display = "none";
              document.getElementById("configModal").style.display = "none";
              document.getElementById("whatsappModal").style.display = "none";
              clienteAtual = null;
          }
      }

      function abrirNovoCliente() {
          document.getElementById("newClientModal").style.display = "block";
          document.getElementById("newClientModalLabel").innerText = "Novo Prospect";
          
          // Reset fields
          // ...
          renderizarInputsCustomizados(); // Renderiza campos extras
      }

      function mudarTab(index) {
        const context = document.getElementById("clientModal");
        if (!context) return;
        
        const tabs = context.querySelectorAll(".tab");
        tabs.forEach((tab, i) => {
          tab.classList.toggle("active", i === index);
        });

        const contents = context.querySelectorAll(".tab-content");
        contents.forEach((content, i) => {
          content.classList.toggle("active", i === index);
        });
      }

      async function salvarStatus() {
        const statusSelecionado = document.querySelector(".status-option.selected");
        const motivo = document.getElementById("statusMotivo").value.trim();
        const valor = parseFloat(document.getElementById("statusValor").value) || 0;
        const alertDiv = document.getElementById("statusAlert");

        if (!statusSelecionado) {
          alertDiv.innerHTML = '<div class="alert alert-warning">⚠️ Selecione um status antes de salvar.</div>';
          return;
        }

        if (!motivo && statusSelecionado.dataset.status !== "nao_acompanhando") {
          alertDiv.innerHTML = '<div class="alert alert-warning">⚠️ O campo Motivo é obrigatório para este status.</div>';
          return;
        }

        // Atualizar Objeto Local
        clienteAtual.status = statusSelecionado.dataset.status;
        clienteAtual.motivo = motivo;
        clienteAtual.valor_estimado = valor;
        clienteAtual.data_status = new Date().toISOString();
        
        // Log Histórico Automático
        clienteAtual.historico.push({
            id: Date.now(),
            tipo: "sistema",
            data: new Date().toISOString(),
            texto: `Status alterado para: ${statusSelecionado.innerText}`,
            autor: "Sistema"
        });

        // 💾 SALVAR NO REPOSITORY (IndexedDB)
        try {
            await window.Repo.save('clientes', clienteAtual);
            
            // UI Feedback
            alertDiv.innerHTML = '<div class="alert alert-success">✅ Status atualizado com sucesso (IndexedDB)!</div>';
            
            setTimeout(() => {
              atualizarEstatisticas();
              renderizarClientes();
              // Não fecha modal automaticamente para permitir mais edições, apenas atualiza visual
            }, 500);
            
        } catch(e) {
            console.error("Erro status update:", e);
            alertDiv.innerHTML = '<div class="alert alert-error">❌ Erro ao salvar status. Tente novamente.</div>';
        }
      }

      // ========== SISTEMA DE HISTÓRICO UNIFICADO (Anotações + Agenda) ==========
      
      function renderizarHistorico() {
          const list = document.getElementById("historicoList");
          const historico = clienteAtual.historico || [];
          
          // Injetar Select de Vendedor se não existir
          const container = document.getElementById("histVendedorContainer");
          if(container && !container.innerHTML.trim()) {
               let options = '<option value="">-- Quem? --</option>';
               vendedores.forEach(v => options += `<option value="${v}">${v}</option>`);
               container.innerHTML = `<select id="histVendedor" class="form-input">${options}</select>`;
          }

          if (historico.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">Nenhuma interação registrada.</p>';
            return;
          }
          
          list.innerHTML = '';
          
          historico.forEach((item, index) => {
              const date = new Date(item.data).toLocaleString('pt-BR');
              const autorHtml = item.autor ? `<span style="background:#e0e7ff; color:#4338ca; padding:2px 8px; border-radius:10px; font-size:11px; margin-left:10px;">👤 ${item.autor}</span>` : '';
              
              let agendamentoHtml = '';
              if(item.agendamento && item.agendamento.data) {
                  const dataAg = new Date(item.agendamento.data).toLocaleString('pt-BR');
                  const status = item.agendamento.status;
                  const color = status === 'Pendente' ? '#f59e0b' : (status === 'Concluído' ? '#22c55e' : '#ef4444');
                  
                  agendamentoHtml = `
                      <div style="margin-top:8px; padding:8px; background:#f8fafc; border-radius:6px; border-left:3px solid ${color}; font-size:13px;">
                          <strong>📅 Retorno:</strong> ${dataAg} 
                          <span style="float:right; color:${color}; font-weight:bold;">${status}</span>
                          ${status === 'Pendente' ? `<button onclick="concluirAgendamento(${index})" style="margin-left:10px; font-size:11px; cursor:pointer;">✅ Concluir</button>` : ''}
                      </div>
                  `;
              }
              
              const div = document.createElement('div');
              div.className = 'item';
              div.innerHTML = `
                  <div class="item-header">
                      <div>
                          <span class="item-date">${date}</span>
                          <span style="font-size:11px; color:#666; margin-left:5px; border:1px solid #ddd; padding:1px 4px; border-radius:4px;">
                            ${item.tipo === 'agendamento' ? '📅 AGENDAMENTO' : '📝 NOTA'}
                          </span>
                          ${autorHtml}
                      </div>
                      <div class="item-actions">
                          <button class="item-btn btn-delete" onclick="excluirItemHistorico(${index})">🗑️ Excluir</button>
                      </div>
                  </div>
                  <div style="margin-top:5px; white-space:pre-wrap;">${item.texto}</div>
                  ${agendamentoHtml}
              `;
              list.appendChild(div);
          });
      }

      async function excluirItemHistorico(index) {
          if(confirm("Excluir este item do histórico?")) {
              clienteAtual.historico.splice(index, 1);
              try {
                  await window.Repo.save('clientes', clienteAtual);
                  renderizarHistorico();
                  renderizarClientes(); // Atualizar tabela principal
              } catch(e) {
                  alert('Erro ao salvar exclusão.');
                  console.error(e);
              }
          }
      }

      async function concluirAgendamento(index) {
          if(clienteAtual.historico[index].agendamento) {
              clienteAtual.historico[index].agendamento.status = 'Concluído';
              // Adicionar log automático de conclusão
              clienteAtual.historico.unshift({
                  id: Date.now(),
                  tipo: 'sistema',
                  data: new Date().toISOString(),
                  texto: `Agendamento concluído (Item original: ${clienteAtual.historico[index].texto})`,
                  autor: 'Sistema'
              });
              
              try {
                  await window.Repo.save('clientes', clienteAtual);
                  renderizarHistorico();
                  renderizarClientes();
              } catch(e) {
                  alert('Erro ao concluir agendamento.');
                  console.error(e);
              }
          }
      }

      async function salvarHistorico() {
          const texto = document.getElementById("histTexto").value.trim();
          const dataRetorno = document.getElementById("histDataRetorno").value;
          const vendedor = document.getElementById("histVendedor").value;
          
          if(!texto && !dataRetorno) {
              alert("Digite uma descrição ou agende uma data.");
              return;
          }
          
          const novoItem = {
              id: Date.now(),
              data: new Date().toISOString(),
              texto: texto || (dataRetorno ? "Agendamento de retorno" : ""),
              tipo: dataRetorno ? 'agendamento' : 'nota',
              autor: vendedor,
              agendamento: null
          };
          
          if(dataRetorno) {
              novoItem.agendamento = {
                  data: dataRetorno,
                  status: 'Pendente'
              };
          }
          
          if(!clienteAtual.historico) clienteAtual.historico = [];
          clienteAtual.historico.unshift(novoItem);
          
          try {
              await window.Repo.save('clientes', clienteAtual);
              
              document.getElementById("histTexto").value = "";
              document.getElementById("histDataRetorno").value = "";
              
              renderizarHistorico();
              renderizarClientes();
          } catch(e) {
              alert("Erro ao salvar histórico.");
              console.error(e);
          }
      }

      /**
       * Aplica filtros manualmente quando o botão ✓ é clicado
       */
      function aplicarFiltrosBotao() {
        // Forçar atualização dos filtros
        filtrarClientes();
        
        // Feedback visual
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = '✅';
        btn.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.transform = 'scale(1)';
        }, 300);
      }

      /**
       * Abre modal de importação manual de HTML
       */
      /**
       * Abre modal de Upload Manual
       */
      function abrirImportacao() {
        document.getElementById('uploadArea').style.display = 'flex';
      }


      async function excluirItemHistorico(index) {
          if(confirm("Excluir este item do histórico?")) {
              clienteAtual.historico.splice(index, 1);
              await window.Repo.save('clientes', clienteAtual); // Salva no banco
              renderizarHistorico();
          }
      }
      
      async function concluirAgendamento(index) {
          if(clienteAtual.historico[index].agendamento) {
            clienteAtual.historico[index].agendamento.status = 'Concluído';
            clienteAtual.historico[index].texto += " ✅ (Concluído)"; 
            
            await window.Repo.save('clientes', clienteAtual); // Salva no banco
            renderizarHistorico();
          }
      }


      // ========== AI ENERGY SYSTEM (GEMINI 3.0 READY) ==========
      const AI_CONFIG = {
          maxCredits: 1000,
          costPerAction: 10,
          costPerAnalysis: 50,
          refillRate: 5 // per hour (mock)
      };

      function initEnergySystem() {
          let energy = parseInt(localStorage.getItem('aiCredits'));
          if(isNaN(energy)) {
              energy = AI_CONFIG.maxCredits;
              localStorage.setItem('aiCredits', energy);
          }
          updateEnergyUI(energy);
          
          // Tooltip/Explanation on click
          document.querySelector('.energy-container').onclick = () => {
              alert(`🔋 Status da IA\n\nCréditos Disponíveis: ${energy}/${AI_CONFIG.maxCredits}\n\n- O Gemini usa Context Caching para economizar.\n- Cada análise consome ~${AI_CONFIG.costPerAnalysis} créditos.\n- Recarga automática mensal.`);
          };
      }

      function updateEnergyUI(energy) {
          const percent = Math.min(100, Math.max(0, (energy / AI_CONFIG.maxCredits) * 100));
          const fill = document.getElementById('aiEnergyFill');
          const text = document.getElementById('aiEnergyText');
          
          if(fill) fill.style.width = `${percent}%`;
          if(text) text.innerText = `${percent.toFixed(0)}%`;
          
          // Visual warning
          if(fill) {
            if(percent < 20) fill.style.background = '#ef4444'; // Red
            else if(percent < 50) fill.style.background = '#f59e0b'; // Orange
            else fill.style.background = 'linear-gradient(90deg, #10b981, #3b82f6)'; // Green/Blue
          }
      }

      function consumeEnergy(amount) {
          let energy = parseInt(localStorage.getItem('aiCredits')) || 0;
          if (energy >= amount) {
              energy -= amount;
              localStorage.setItem('aiCredits', energy);
              updateEnergyUI(energy);
              return true;
          } else {
              alert("⚠️ Energia da IA Esgotada! Aguarde recarga ou contate o suporte.");
              return false;
          }
      }

      // Initialize on load
      window.addEventListener('load', initEnergySystem);

      // ========== PANDA CORE BRIDGE (FUSÃO TITAN + PANDA) ==========
      const PANDA_CORE = {
        endpoint: "https://script.google.com/macros/s/AKfycbxPx18ed1gP8cR08dRxEInmVheihSoSkqiucXp2icFmF5dZO_ccM6c3Q6LMvjeE2VcM/exec",
        userId: null, // Será preenchido no login
        balance: 1000, // Saldo inicial (PC)
        maxBalance: 1000
      };

      /**
       * Central de comunicação com o Panda Core Backend.
       * @param {string} type - Tipo de serviço (TEXT_GEN, DRIVE_READ, TOOL_CALL, etc)
       * @param {Object} payload - Dados do pedido
       * @returns {Promise<Object>} Resposta do backend
       */
      async function callPandaBrain(type, payload, action = null) {
        try {
          const body = {
            userId: PANDA_CORE.userId || localStorage.getItem('crmUsuarioLogado') || 'anonymous',
            type: type,
            payload: payload
          };
          
          if (action) body.action = action;

          const response = await fetch(PANDA_CORE.endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
          });

          const result = await response.json();

          // Atualiza a barra de energia se a transação foi bem-sucedida
          if (result.meta?.new_balance !== undefined) {
            PANDA_CORE.balance = result.meta.new_balance;
            updateEnergyFromPanda(result.meta.new_balance);
          }

          // Verifica saldo insuficiente
          if (result.status === "INSUFFICIENT_FUNDS") {
            showRechargeModal(result.requiredPC, result.currentBalance);
            return result;
          }

          return result;

        } catch (error) {
          console.error("❌ Erro Panda Core:", error);
          return { status: "ERROR", message: error.toString() };
        }
      }

      /**
       * Atualiza a barra de energia visual com o saldo real do Panda Core.
       */
      function updateEnergyFromPanda(balance) {
        PANDA_CORE.balance = balance;
        const percent = Math.min(100, Math.max(0, (balance / PANDA_CORE.maxBalance) * 100));
        
        const fill = document.getElementById('aiEnergyFill');
        const text = document.getElementById('aiEnergyText');
        
        if (fill) fill.style.width = `${percent}%`;
        if (text) text.innerText = `${Math.round(balance)} PC`;
        
        // Visual warning
        if (fill) {
          if (percent < 20) fill.style.background = '#ef4444';
          else if (percent < 50) fill.style.background = '#f59e0b';
          else fill.style.background = 'linear-gradient(90deg, #10b981, #3b82f6)';
        }
      }

      /**
       * Busca o saldo atual do usuário no Panda Core.
       * 🛡️ Safe-Fail: Se falhar (CORS/Offline), usa modo Local.
       */
      async function fetchPandaBalance() {
        if (!navigator.onLine) {
          console.log("📡 Offline Mode detected.");
          return;
        }

        try {
          const result = await callPandaBrain(null, null, "GET_BALANCE");
          
          if (result && result.status === "SUCCESS") {
            PANDA_CORE.balance = result.balance;
            updateEnergyFromPanda(result.balance);
            PANDA_CORE.offline = false;
          }
        } catch (e) {
          console.warn("⚠️ Panda Core unreachable (CORS/Net):", e.message);
          // Fallback silenciou para evitar spam no console
          PANDA_CORE.offline = true;
          
          // Visual Hint no Energy Bar
          const text = document.getElementById('aiEnergyText');
          if (text) text.innerText += " (Local)";
        }
      }

      /**
       * Mostra modal de recarga quando saldo é insuficiente.
       */
      function showRechargeModal(required, current) {
        alert(`⚠️ Saldo Insuficiente!\n\nNecessário: ${required} PC\nAtual: ${current} PC\n\nRecarregue para continuar usando os serviços de IA.`);
        // TODO: Implementar modal de pagamento
      }

      // Carrega saldo real ao iniciar (se online)
      window.addEventListener('load', () => {
        setTimeout(fetchPandaBalance, 2000); // Delay para não travar o carregamento
      });


      // ========== GESTÃO DE USUÁRIOS ==========
        
      async function renderizarUsuarios() {
          const lista = document.getElementById('listaUsuarios');
          if(!lista) return;
          
          lista.innerHTML = '';
          const users = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
          
          if(users.length === 0) {
              lista.innerHTML = '<p style="color:#666;">Nenhum usuário cadastrado.</p>';
              return;
          }
          
          users.forEach((u, index) => {
              if(!u || !u.user) return; // Skip invalid entries
              
              const div = document.createElement('div');
              div.style.cssText = 'background:#f8fafc; padding:10px; border-radius:8px; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; border:1px solid #e2e8f0;';
              
              const initial = u.user ? u.user.charAt(0).toUpperCase() : '?';
              
              div.innerHTML = `
                  <div style="display:flex; align-items:center; gap:10px;">
                      <div style="background:#e0e7ff; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center; color:#4338ca; font-weight:bold;">
                          ${initial}
                      </div>
                      <div>
                          <strong>${u.user || 'Sem nome'}</strong> <span style="font-size:11px; background:#f3f4f6; color:#666; padding:2px 6px; border-radius:10px;">${u.nivel || 'vendedor'}</span>
                      </div>
                  </div>
                  <button class="btn" style="background:#fee2e2; color:#ef4444; padding:5px 10px; font-size:16px; border-radius:50%; width:30px; height:30px; display:flex; align-items:center; justify-content:center;" onclick="excluirUsuario(${index})">🗑️</button>
              `;
              lista.appendChild(div);
          });
      }
      
      // Alias for legacy support
      // Alias removed

      
      async function adicionarUsuario() {
          const login = document.getElementById('newUserLogin').value.trim();
          const pass = document.getElementById('newUserSenha').value.trim();
          const nivel = document.getElementById('newUserNivel').value;
          
          if(!login || !pass) {
              alert('Preencha Login e Senha!');
              return;
          }
          
          const users = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
          if(users.find(u => u.user === login)) {
              alert('Usuário já existe!');
              return;
          }
          
          users.push({ user: login, pass: pass, nivel: nivel });
          localStorage.setItem('crmVendedores', JSON.stringify(users));
          
          document.getElementById('newUserLogin').value = '';
          document.getElementById('newUserSenha').value = '';
          
          renderizarUsuarios();
      }
      
      async function excluirUsuario(index) {
          if(confirm('Remover este usuário?')) {
              const users = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
              users.splice(index, 1);
              localStorage.setItem('crmVendedores', JSON.stringify(users));
              renderizarUsuarios();
          }
      }

      // ========== UPLOAD MANUAL ==========
      function mostrarUpload() {
        document.getElementById("uploadArea").style.display = "flex";
      }

      function fecharUpload() {
        document.getElementById("uploadArea").style.display = "none";
      }

      function processarUpload(input) {
        const file = input.files[0];
        if (!file) return;

        const statusDiv = document.getElementById("uploadStatus");
        statusDiv.innerHTML = "<p>⏳ Processando arquivo...</p>";

        const reader = new FileReader();
        reader.onload = async function (e) {
          try {
            const html = e.target.result;
            const novosClientes = parsearHTMLRelatorio(html);

            // Mesclar com clientes existentes
            for (const novoCliente of novosClientes) {
              const existe = clientes.find((c) => c.id === novoCliente.id);
              if (!existe) {
                // Injeta schema novo
                novoCliente._id_loja = '1';
                novoCliente._metadata_fiscal = {};
                
                clientes.push(novoCliente);
                await window.Repo.save('clientes', novoCliente); // Salva item a item
              }
            }

            // Não chamamos mais salvarDados() global
            inicializar();

            statusDiv.innerHTML = `<div class="alert alert-success">✅ ${novosClientes.length} clientes importados com sucesso!</div>`;

            // Log Audit
            // ... (logica de log mantida)
            adicionarLogAuditoria(
              "Upload Manual HTML",
              novosClientes.length,
              0,
              clientes.length
            );

            setTimeout(() => {
              fecharUpload();
              statusDiv.innerHTML = "";
            }, 2000);
          } catch (error) {
            console.error("Erro JSON:", error);
            statusDiv.innerHTML = `❌ Erro: Arquivo inválido ou corrompido.`;
            setTimeout(() => document.body.removeChild(statusDiv), 3000);
            alert(
              "Erro ao ler o arquivo JSON. Verifique se é o arquivo correto gerado pelo scraper."
            );
          }

          // Limpar input para permitir selecionar o mesmo arquivo novamente se precisar
          input.value = "";
        };

        reader.readAsText(file);
      }

      // ========== IMPORTAÇÃO MANUAL HTML (Upload) ==========
      function parsearHTMLRelatorio(html) {
        // Parser simples (usar mesmo do Python)
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const novosClientes = [];

        // Procurar todas as tabelas tbody
        const tbodies = doc.querySelectorAll("tbody");

        tbodies.forEach((tbody) => {
          try {
            const tds = tbody.querySelectorAll("td");
            let cliente = {
              id: "",
              nome: "",
              cidade: "",
              data: "",
              telefones: [],
              metragem: "",
              endereco: "",
              bairro: "",
              estagio: "",
              observacao: "",
              status: "nao_acompanhando",
              motivo: "",
              valor_estimado: 0,
              fonte: "guia_construcao",
              prospect: true,
              anotacoes: [],
              retornos: [],
            };

            // Extrair código (primeiro td com número de 6 dígitos)
            const codigo = tbody.textContent.match(/\b\d{6}\b/);
            if (codigo) {
              cliente.id = codigo[0];
              cliente.nome = codigo[0];
            }

            // Extrair cidade
            const cidadeMatch = tbody.innerHTML.match(
              /Cidade\/UF:<\/td>\s*<td[^>]*>([^<]+)<\/td>/
            );
            if (cidadeMatch) {
              cliente.cidade = cidadeMatch[1].trim();
            }

            // Extrair metragem
            const metragemMatch = tbody.innerHTML.match(
              /Metragem:<\/td>\s*<td[^>]*>([^<]+)<\/td>/
            );
            if (metragemMatch) {
              cliente.metragem = metragemMatch[1].trim();
            }

            // Extrair estágio
            const estagioMatch = tbody.innerHTML.match(
              /Estágio:<\/td>\s*<td[^>]*>([^<]+)<\/td>/
            );
            if (estagioMatch) {
              cliente.estagio = estagioMatch[1].trim();
            }

            // Extrair telefones
            const telefonesRegex = /\((\d{2})\)\s*(\d{4,5})-(\d{4})/g;
            let tel;
            while ((tel = telefonesRegex.exec(tbody.innerHTML)) !== null) {
              cliente.telefones.push(`(${tel[1]}) ${tel[2]}-${tel[3]}`);
            }

            if (cliente.id && cliente.cidade) {
              novosClientes.push(cliente);
            }
          } catch (e) {
            console.error("Erro ao processar tbody:", e);
          }
        });

        return novosClientes;
      }

      // ========== IMPORTAÇÃO AUTOMÁTICA REMOVIDA ==========
      // Função ativarImportacaoAutomatica removida para segurança.
      // O scraper não deve rodar automaticamente no app.

        // Legacy abrirNovoCliente removed to fix conflict


        async function salvarNovoCliente() {
            const alertDiv = document.getElementById('newClientAlert');
            
            // Validar campos obrigatórios
            const nome = document.getElementById('newClientNome').value.trim();
            let fonte = document.getElementById('newClientFonte').value;
            const cidade = document.getElementById('newClientCidade').value.trim();
            
            // Fonte Custom
            if(fonte === 'OUTROS') {
                const fonteOutro = document.getElementById('newClientFonteOutro').value.trim();
                if(!fonteOutro) {
                    alert('Digite a descrição da fonte');
                    return;
                }
                fonte = fonteOutro;
            }
            
            if (!nome || !fonte || !cidade) {
                alertDiv.innerHTML = '<div class="alert alert-warning">⚠️ Preencha os campos obrigatórios: Nome, Fonte de Captação e Cidade.</div>';
                return;
            }
            
            // Coletar telefones dinâmicos
            const telefones = [];
            document.querySelectorAll('#phonesContainer .phone-row').forEach(row => {
                const inputs = row.querySelectorAll('input');
                const tNome = inputs[0].value.trim();
                const tNum = inputs[1].value.trim();
                
                if(tNum) {
                    telefones.push({ nome: tNome || 'Principal', numero: tNum });
                }
            });
            
            // Capturar Campos Customizados
            let dadosExtras = {};
            customFields.forEach(f => {
                const input = document.getElementById(f.id);
                if(input) dadosExtras[f.id] = input.value;
            });

            const novoCliente = {
                id: String(Date.now()), // Assuming this is for new client, not editing
                nome: nome,
                telefones: telefones, // Use the collected 'telefones'
                // ... (outros campos)
                fonte: fonte,
                fonte_detalhe: document.getElementById('newClientFonteOutro').value.trim(), // Assuming this is the 'fonteOutro'
                
                // Mapeia legacy para novo schema se precisar, mas salva customizados
                custom_fields: dadosExtras,
                
                etiquetas: [],
                historico: [
                    {
                        data: new Date().toISOString(),
                        tipo: 'criacao',
                        nota: `Cliente criado`
                    }
                ],
                _ativo: true,
                _created_at: new Date().toISOString()
            };
            
            // Merge manual dos campos fixos (simplificado aqui para focarmos no custom)
            novoCliente.cidade = document.getElementById("newClientCidade").value;
            novoCliente.endereco = document.getElementById("newClientEndereco").value;
            novoCliente.bairro = document.getElementById("newClientBairro").value;
            novoCliente.metragem = document.getElementById("newClientMetragem").value || 0; // Ensure numeric or default
            novoCliente.estagio = document.getElementById("newClientEstagio").value || 'Não informado'; // Ensure default
            novoCliente.valor_estimado = parseFloat(document.getElementById("newClientValor").value) || 0; // Ensure numeric
            novoCliente.observacao = document.getElementById("newClientObservacao").value; // Corrected ID
            novoCliente.vendedor = document.getElementById("newClientVendedor").value;
            
            novoCliente.status = 'nao_acompanhando'; // Default novo

            await window.Repo.save('clientes', novoCliente);
            
            alertDiv.innerHTML = '<div class="alert alert-success">✅ Cliente cadastrado com sucesso!</div>';
            adicionarLogAuditoria('Cadastro Manual', 1, 0, clientes.length); // This count will be off if not reloaded
            
            setTimeout(() => {
                fecharNovoCliente();
                inicializar();
            }, 1000);
        }

        // ========== EDIÇÃO DE CLIENTES ==========
        function editarCliente() {
            if (!clienteAtual) return;
            
            // Preencher campos
            document.getElementById('newClientNome').value = clienteAtual.nome || '';
            document.getElementById('newClientCidade').value = clienteAtual.cidade || '';
            document.getElementById('newClientEndereco').value = clienteAtual.endereco || '';
            document.getElementById('newClientBairro').value = clienteAtual.bairro || '';
            // Legacy Metragem/Estagio removed from UI
            document.getElementById('newClientValor').value = clienteAtual.valor_estimado || 0;
            document.getElementById('newClientObservacao').value = clienteAtual.observacao || '';

            // Popular e Selecionar Vendedor (Global Var)
            const selectVend = document.getElementById('newClientVendedor');
            selectVend.innerHTML = '<option value="">Selecione...</option>';
            vendedores.forEach(v => {
                const sel = (clienteAtual.vendedor === v) ? 'selected' : '';
                selectVend.innerHTML += `<option value="${v}" ${sel}>${v}</option>`;
            });
            
            // Fonte
            const selectFonte = document.getElementById('newClientFonte');
            const opcoes = Array.from(selectFonte.options).map(o => o.value);
            
            if(opcoes.includes(clienteAtual.fonte)) {
                selectFonte.value = clienteAtual.fonte;
                document.getElementById('newClientFonteOutro').style.display = 'none';
            } else {
                selectFonte.value = 'OUTROS';
                const inputOutro = document.getElementById('newClientFonteOutro');
                inputOutro.style.display = 'block';
                inputOutro.value = clienteAtual.fonte;
            }
            
            // Telefones
            const container = document.getElementById('phonesContainer');
            container.innerHTML = '';
            
            if(clienteAtual.telefones && clienteAtual.telefones.length > 0) {
                clienteAtual.telefones.forEach(tel => {
                    adicionarInputTelefone(tel.nome, tel.numero);
                });
            } else {
                adicionarInputTelefone('Principal', '');
            }
            
            // Configurar Modal
            document.querySelector('#newClientModal h2').textContent = '✏️ Editar Cliente';
            const saveBtn = document.querySelector('#newClientModal .btn-success');
            saveBtn.textContent = '💾 Atualizar Cliente';
            saveBtn.onclick = atualizarCliente;
            
            fecharModal();
            document.getElementById('newClientModal').style.display = 'block';
        }

        function atualizarCliente() {
            const alertDiv = document.getElementById('newClientAlert');
            
            const nome = document.getElementById('newClientNome').value.trim();
            const cidade = document.getElementById('newClientCidade').value.trim();
            let fonte = document.getElementById('newClientFonte').value;
            // Fonte Custom removed
            
            if (!nome || !fonte || !cidade) {

                alertDiv.innerHTML = '<div class="alert alert-warning">⚠️ Preencha os campos obrigatórios.</div>';
                return;
            }
            
            // Coletar telefones dinâmicos
            const telefones = [];
            document.querySelectorAll('#phonesContainer .phone-row').forEach(row => {
                const inputs = row.querySelectorAll('input');
                const tNome = inputs[0].value.trim();
                const tNum = inputs[1].value.trim();
                
                if(tNum) {
                    telefones.push({ nome: tNome || 'Principal', numero: tNum });
                }
            });
            
            // Atualizar
            clienteAtual.nome = nome;
            clienteAtual.cidade = cidade;
            clienteAtual.telefones = telefones;
            clienteAtual.metragem = document.getElementById('newClientMetragem').value || '0';
            clienteAtual.endereco = document.getElementById('newClientEndereco').value.trim() || '';
            clienteAtual.bairro = document.getElementById('newClientBairro').value.trim() || '';
            clienteAtual.estagio = document.getElementById('newClientEstagio').value || 'Não informado';
            clienteAtual.observacao = document.getElementById('newClientObservacao').value.trim() || '';
            clienteAtual.valor_estimado = parseFloat(document.getElementById('newClientValor').value) || 0;
            clienteAtual.source = fonte; // Legacy support
            clienteAtual.fonte = fonte;
            clienteAtual.vendedor = document.getElementById('newClientVendedor').value || '';
            clienteAtual.data_atualizacao = new Date().toISOString();
            
            salvarDados();
            
            alertDiv.innerHTML = '<div class="alert alert-success">✅ Cliente atualizado!</div>';
            setTimeout(() => {
                fecharNovoCliente();
                inicializar();
                
                // Restaurar Modal para cadastro
                document.querySelector('#newClientModal h2').textContent = '➕ Cadastrar Novo Cliente';
                const saveBtn = document.querySelector('#newClientModal .btn-success');
                saveBtn.textContent = '💾 Salvar Cliente';
                saveBtn.onclick = salvarNovoCliente;
            }, 1000);
        }

      // ========== EXCLUSÃO DE CLIENTES ==========
      function deletarCliente() {
        if (!clienteAtual) {
          alert("❌ Nenhum cliente selecionado");
          return;
        }

        // Confirmação dupla
        const confirmacao1 = confirm(
          `⚠️ ATENÇÃO: Você está prestes a DELETAR o cliente:\n\n` +
            `Nome: ${clienteAtual.nome}\n` +
            `ID: ${clienteAtual.id}\n` +
            `Cidade: ${clienteAtual.cidade}\n\n` +
            `Esta ação NÃO PODE SER DESFEITA!\n\n` +
            `Deseja continuar?`
        );

        if (!confirmacao1) {
          return;
        }

        // Segunda confirmação
        const confirmacao2 = confirm(
          `🚨 ÚLTIMA CONFIRMAÇÃO\n\n` +
            `Tem CERTEZA ABSOLUTA que deseja deletar "${clienteAtual.nome}"?\n\n` +
            `Todos os dados serão perdidos permanentemente:\n` +
            `• ${clienteAtual.anotacoes?.length || 0} anotações\n` +
            `• ${clienteAtual.retornos?.length || 0} retornos\n` +
            `• Status e histórico completo\n\n` +
            `Digite OK para confirmar`
        );

        if (!confirmacao2) {
          return;
        }

        // Encontrar índice do cliente
        const index = clientes.findIndex((c) => c.id === clienteAtual.id);

        if (index === -1) {
          alert("❌ Erro: Cliente não encontrado no sistema");
          return;
        }

        // Salvar dados do cliente para log
        const clienteDeletado = { ...clienteAtual };

        // Remover cliente
        clientes.splice(index, 1);

        // Salvar dados
        salvarDados();

        // Fechar modal
        fecharModal();

        // Atualizar interface
        inicializar();

        // Feedback
        alert(
          `✅ Cliente deletado com sucesso!\n\n` +
            `Nome: ${clienteDeletado.nome}\n` +
            `ID: ${clienteDeletado.id}\n\n` +
            `Total de clientes restantes: ${clientes.length}`
        );

        console.log("Cliente deletado:", clienteDeletado);
      }

      function salvarDados() {
        try {
          localStorage.setItem("crmDados_v2", JSON.stringify(clientes));
        } catch (error) {
          console.error("Erro ao salvar no localStorage:", error);
        }
      }

      function exportarDados() {
        try {
          const dataStr = JSON.stringify(clientes, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `crm-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          alert("✅ Dados exportados com sucesso!");
        } catch (error) {
          console.error("Erro ao exportar:", error);
          alert("Erro ao exportar dados. Tente novamente.");
        }
      }

      // ========== LOG DE AUDITORIA ==========
      function adicionarLogAuditoria(tipo, novos, duplicados, total) {
        const log = JSON.parse(localStorage.getItem("crmAuditLog") || "[]");

        log.unshift({
          data: new Date().toISOString(),
          tipo: tipo,
          novos: novos,
          duplicados: duplicados,
          total: total,
        });

        // Manter apenas últimos 50 logs
        if (log.length > 50) log.pop();

        localStorage.setItem("crmAuditLog", JSON.stringify(log));
      }

      function verAuditoria() {
        const log = JSON.parse(localStorage.getItem("crmAuditLog") || "[]");
        const modal = document.getElementById("auditModal");
        const lista = document.getElementById("auditList");

        if (log.length === 0) {
          lista.innerHTML =
            '<p style="text-align: center; color: #666; padding: 20px;">Nenhum registro de importação encontrado.</p>';
        } else {
          lista.innerHTML = log
            .map(
              (item) => `
                    <div class="item">
                        <div class="item-header">
                            <span class="item-date">📅 ${new Date(
                              item.data
                            ).toLocaleString("pt-BR")}</span>
                            <span class="status-badge status-fechado" style="background: #e0f2fe; color: #0369a1;">${
                              item.tipo
                            }</span>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-top: 10px; text-align: center;">
                            <div style="background: #dcfce7; padding: 5px; border-radius: 5px; color: #166534;">
                                <strong>+${
                                  item.novos
                                }</strong><br><small>Novos</small>
                            </div>
                            <div style="background: #fee2e2; padding: 5px; border-radius: 5px; color: #991b1b;">
                                <strong>${
                                  item.duplicados
                                }</strong><br><small>Duplicados</small>
                            </div>
                            <div style="background: #f3f4f6; padding: 5px; border-radius: 5px; color: #374151;">
                                <strong>${
                                  item.total
                                }</strong><br><small>Total CRM</small>
                            </div>
                        </div>
                    </div>
                `
            )
            .join("");
        }

        modal.style.display = "block";
      }

        // ========== AUTO-IMPORT ZERO CLIQUE ==========
        // ========== V3 LOGIC - AGENDA & DASHBOARD ==========
      let agendaDate = new Date();

      function mudarView(viewId) {
          // Limpar ativação dos botões
          document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

          // Esconder todas as views principais
          document.getElementById('inicio-view').classList.remove('active');
          document.getElementById('contatos-view').classList.remove('active');
          document.getElementById('agenda-view').classList.remove('active');
          document.getElementById('reports-view').classList.remove('active');

          // Ativar view específica e botão correspondente
          let navIndex = 0;
          
          if(viewId === 'home') {
              // INÍCIO: Mostrar apenas os gráficos (dashboard overview)
              document.getElementById('inicio-view').classList.add('active');
              navIndex = 0;
          } else if(viewId === 'contatos') {
              // CONTATOS: Mostrar lista completa
              document.getElementById('contatos-view').classList.add('active');
              // Limpar filtros para mostrar tudo
              document.getElementById('searchInput').value = '';
              document.getElementById('statusFilter').value = '';
              document.getElementById('cidadeFilter').value = '';
              document.getElementById('bairroFilter').value = '';
              window.customFilterType = null;
              window.currentSortField = null;
              filtrarClientes();
              navIndex = 1;
          } else if(viewId === 'agenda') {
              // AGENDA: Mostrar calendário
              document.getElementById('agenda-view').classList.add('active');
              renderizarAgenda();
              navIndex = 2;
          } else if(viewId === 'reports') {
              // RELATÓRIOS: Dashboard completo
              document.getElementById('reports-view').classList.add('active');
              renderizarDashboard();
              navIndex = 3;
          }

          // Ativar botão de navegação (skip logout button which is last)
          const navItems = document.querySelectorAll('.nav-item');
          if(navItems[navIndex]) navItems[navIndex].classList.add('active');
      }

      function navegarAgenda(offset) {
          if(offset === 0) agendaDate = new Date();
          else agendaDate.setMonth(agendaDate.getMonth() + offset);
          renderizarAgenda();
      }

      function renderizarAgenda() {
           const container = document.getElementById('agendaHeaderContainer');
           const grid = document.getElementById('calendarGrid');
           const year = agendaDate.getFullYear();
           const month = agendaDate.getMonth();
           
           const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
           
           container.innerHTML = `
               <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                   <div style="display:flex; gap:10px; align-items:center;">
                       <select id="agendaMonthSelect" class="filter-select" onchange="mudarAgendaData()" style="font-weight:bold; font-size:16px;">
                           ${meses.map((m,i) => `<option value="${i}" ${i===month?'selected':''}>${m}</option>`).join('')}
                       </select>
                       <select id="agendaYearSelect" class="filter-select" onchange="mudarAgendaData()" style="font-weight:bold; font-size:16px;">
                           ${[2024,2025,2026,2027].map(y => `<option value="${y}" ${y===year?'selected':''}>${y}</option>`).join('')}
                       </select>
                   </div>
                   <div>
                       <button class="btn btn-primary" onclick="navegarAgenda(0)">Hoje</button>
                       <button class="btn" onclick="navegarAgenda(-1)">◀</button>
                       <button class="btn" onclick="navegarAgenda(1)">▶</button>
                   </div>
               </div>
           `;
           
           grid.innerHTML = '';
           ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].forEach(d => grid.innerHTML += `<div class="calendar-day-header">${d}</div>`);
           
           const firstDay = new Date(year, month, 1).getDay();
           const daysInMonth = new Date(year, month + 1, 0).getDate();
           
           for(let i=0; i<firstDay; i++) grid.innerHTML += `<div class="calendar-day disabled" style="background:#f9fafb;"></div>`;
           
           for(let day=1; day<=daysInMonth; day++) {
               const loopDate = new Date(year, month, day);
               const isToday = (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear());
               const events = getEventsForDate(loopDate);
               
                let dayHTML = `<div class="calendar-day ${isToday ? 'day-today' : ''}" onclick="abrirAgendaDrawer(${year}, ${month}, ${day})">`;
                dayHTML += `<span class="day-number">${day}</span>`;
                
                events.slice(0,3).forEach(ev => {
                    let color = ev.item.status==='Concluído' ? '#ecfdf5' : '#fffbeb';
                    let border = ev.item.status==='Concluído' ? '#10b981' : '#f59e0b';
                    dayHTML += `<div class="calendar-event" style="background:${color}; border-left-color:${border}; pointer-events:none;">
                        ${ev.time} ${ev.clienteNome.split(' ')[0]}
                    </div>`;
                });
                if(events.length > 3) dayHTML += `<div style="font-size:10px; color:#666; padding-left:5px;">+${events.length-3}</div>`;
                dayHTML += `</div>`;
                grid.innerHTML += dayHTML;
            }
       }

      function mudarAgendaData() {
          const m = document.getElementById('agendaMonthSelect').value;
          const y = document.getElementById('agendaYearSelect').value;
          agendaDate = new Date(y, m, 1);
          renderizarAgenda();
      }

      function abrirSidebarAgenda(year, month, day) {
          const date = new Date(year, month, day);
          const dateStr = date.toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long'});
          
          document.querySelector('#sidebarTitle span').textContent = `📅 ${dateStr}`;
          const content = document.getElementById('sidebarContent');
          content.innerHTML = '';
          
          const events = getEventsForDate(date);
          
          if(events.length === 0) {
              content.innerHTML = '<p style="color:#666; text-align:center; padding:20px;">Nenhum agendamento para este dia.</p>';
          } else {
              events.forEach(ev => {
                  content.innerHTML += `
                      <div class="agenda-item-card" onclick="abrirModal('${ev.clienteId}')">
                          <span class="agenda-time">⏰ ${ev.time}</span>
                          <span class="agenda-client">${ev.clienteNome}</span>
                          <span class="agenda-desc">${ev.item.texto || ev.item.descricao || ''}</span>
                          <div style="margin-top:8px;font-size:11px;color:#999;">
                              Status: <span style="font-weight:bold;color:${ev.item.status==='Concluído'?'green':'orange'}">${ev.item.status||'Pendente'}</span>
                          </div>
                      </div>
                  `;
              });
          }
          
          document.getElementById('agendaSidebar').classList.add('active');
          document.getElementById('agendaBackdrop').classList.add('active');
      }

      function fecharSidebarAgenda() {
          document.getElementById('agendaSidebar').classList.remove('active');
          document.getElementById('agendaBackdrop').classList.remove('active');
      }

      function getEventsForDate(dateObj) {
          let events = [];
          const dateStr = dateObj.toISOString().split('T')[0];
          
          clientes.forEach(c => {
             if(c.historico && Array.isArray(c.historico)) {
                 c.historico.forEach(h => {
                     if(h.tipo === 'agendamento' && h.data) {
                         const hDate = new Date(h.data);
                         // Comparar apenas data YYYY-MM-DD (ignorando fuso horário complexo, usando ISO slice simples)
                         // Ajuste: h.data é ISO string completa com Timezone? Scraper salva text ou ISO?
                         // Assumindo ISO salvo pelo modal.
                         if(h.data.startsWith(dateStr)) {
                             events.push({
                                 clienteId: c.id,
                                 clienteNome: c.nome,
                                 item: h,
                                 time: hDate.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})
                             });
                         }
                     }
                 });
             } 
          });
          return events.sort((a,b) => a.time.localeCompare(b.time));
      }

      function renderizarDashboard() {
          // Cálculo de KPIs
          let total = clientes.length;
          let fechados = clientes.filter(c => c.status === 'fechado').length;
          let conversion = total > 0 ? ((fechados/total)*100).toFixed(1) : 0;
          let notesCount = 0;
          
          clientes.forEach(c => {
             if(c.historico) notesCount += c.historico.length;
          });

          // Injetar KPIs
          document.getElementById('kpiGrid').innerHTML = `
              <div class="metric-card"><div class="metric-value">${total}</div><div class="metric-label">Total Leads</div></div>
              <div class="metric-card"><div class="metric-value">${fechados}</div><div class="metric-label">Vendas Fechadas</div></div>
              <div class="metric-card"><div class="metric-value">${conversion}%</div><div class="metric-label">Taxa Conversão</div></div>
              <div class="metric-card"><div class="metric-value">${notesCount}</div><div class="metric-label">Interações</div></div>
          `;

          // Tabela de Performance
          const tbody = document.getElementById('performanceTableBody');
          tbody.innerHTML = '';
          
          const vendedores = {};
          
          clientes.forEach(c => {
              // Simular Vendedor se não existir
              const vend = c.vendedor || 'Sem Vendedor';
              if(!vendedores[vend]) vendedores[vend] = { em_acompanhamento:0, com_orcamento:0, fechado:0, total:0, valor:0 };
              
              vendedores[vend].total++;
              if(c.status === 'em_acompanhamento') vendedores[vend].em_acompanhamento++;
              if(c.status === 'com_orcamento') vendedores[vend].com_orcamento++;
              if(c.status === 'fechado') {
                  vendedores[vend].fechado++;
                  // Tentar extrair valor numérico
                  let val = parseFloat(c.valor_estimado) || 0;
                  vendedores[vend].valor += val;
              }
          });

          Object.keys(vendedores).forEach(nome => {
              const v = vendedores[nome];
              const conv = v.total > 0 ? ((v.fechado/v.total)*100).toFixed(1) : 0;
              const valorFormatado = v.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

              tbody.innerHTML += `
                  <tr>
                      <td><strong>${nome}</strong></td>
                      <td style="text-align:center">${v.em_acompanhamento}</td>
                      <td style="text-align:center">${v.com_orcamento}</td>
                      <td style="text-align:center; color:#10b981; font-weight:bold">${v.fechado}</td>
                      <td style="text-align:center">${valorFormatado}</td>
                      <td style="text-align:center">${conv}%</td>
                  </tr>
              `;
          });
      }

       function renderizarDashboard() {
           const periodo = document.getElementById('dashPeriodo') ? document.getElementById('dashPeriodo').value : 'all';
           const now = new Date();
           let start = null;
           
           if(periodo === 'today') start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
           if(periodo === 'last_7') start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
           if(periodo === 'this_month') start = new Date(now.getFullYear(), now.getMonth(), 1);
           if(periodo === 'last_month') start = new Date(now.getFullYear(), now.getMonth()-1, 1);
           if(periodo === 'this_year') start = new Date(now.getFullYear(), 0, 1);

           // Cálculo de KPIs
           let kpiTotal = 0;
           let kpiFechados = 0;
           let kpiValor = 0;
           let kpiInteracoes = 0;
           
           const vendedoresStats = {};
           
           const endLastMonth = (periodo === 'last_month') ? new Date(now.getFullYear(), now.getMonth(), 0) : null;

           clientes.forEach(c => {
               // Normalizar datas
               const dataCriacao = new Date(c.data);
               const dataStatus = c.data_status ? new Date(c.data_status) : dataCriacao;
               
               // Filtros
               let inPeriodCreation = !start || dataCriacao >= start;
               let inPeriodStatus = !start || dataStatus >= start;

               if(periodo === 'last_month' && endLastMonth) {
                   inPeriodCreation = dataCriacao >= start && dataCriacao <= endLastMonth;
                   inPeriodStatus = dataStatus >= start && dataStatus <= endLastMonth;
               }
               
               // KPI Total Leads (Novos no periodo)
               if(inPeriodCreation) kpiTotal++;
               
               // KPI Vendas (Fechado no periodo)
               if(c.status === 'fechado' && inPeriodStatus) {
                   kpiFechados++;
                   kpiValor += parseFloat(c.valor_estimado || 0);
               }
               
               // Interações (estimativa via historico)
               if(c.historico) {
                   c.historico.forEach(h => {
                       const hDate = new Date(h.data);
                       if(!start || hDate >= start) kpiInteracoes++;
                   });
               }
               
               // Tabela por Vendedor (Snapshot Atual + Vendas no Periodo)
               const vend = c.vendedor || 'Sem Vendedor';
               if(!vendedoresStats[vend]) vendedoresStats[vend] = { novos:0, fechado:0, valor:0, ativos:0 };
               
               if(inPeriodCreation) vendedoresStats[vend].novos++; // Novos Leads deste vendedor
               if(c.status === 'fechado' && inPeriodStatus) {
                   vendedoresStats[vend].fechado++;
                   vendedoresStats[vend].valor += parseFloat(c.valor_estimado || 0);
               }
               // Ativos é snapshot (ignorando data, mostra carga atual)
               if(c.status !== 'fechado' && c.status !== 'finalizado') {
                   vendedoresStats[vend].ativos++;
               }
           });
           
           const kpiConversion = kpiTotal > 0 ? ((kpiFechados/kpiTotal)*100).toFixed(1) : 0;
           const valorFormatado = kpiValor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});

           // Injetar KPIs
           document.getElementById('kpiGrid').innerHTML = `
               <div class="metric-card"><div class="metric-value">${kpiTotal}</div><div class="metric-label">Novos Leads</div></div>
               <div class="metric-card"><div class="metric-value">${kpiFechados}</div><div class="metric-label">Vendas Fechadas</div></div>
               <div class="metric-card"><div class="metric-value">${kpiConversion}%</div><div class="metric-label">Taxa Conversão</div></div>
               <div class="metric-card"><div class="metric-value">${kpiInteracoes}</div><div class="metric-label">Interações</div></div>
           `;

           // Tabela de Performance
           const tbody = document.getElementById('performanceTableBody');
           if(tbody) {
               tbody.innerHTML = '';
               Object.keys(vendedoresStats).forEach(nome => {
                   const v = vendedoresStats[nome];
                   const conversao = v.novos > 0 ? ((v.fechado/v.novos)*100).toFixed(1) : 0; 
                   
                   tbody.innerHTML += `
                       <tr>
                           <td><strong>${nome}</strong></td>
                           <td>${v.ativos}</td>
                           <td>${v.novos} (Novo)</td>
                           <td>${v.fechado}</td>
                           <td>${v.valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}</td>
                           <td>${conversao}%</td>
                       </tr>
                   `;
               });
           }
       }

       function gerarRelatorio() {
           const status = document.getElementById('relStatus').value;
           const cidade = document.getElementById('reportCidade').value;
           const vendedor = document.getElementById('relVendedor').value;

           const filtrados = clientes.filter(c => {
               if(status && c.status !== status) return false;
               if(cidade && c.cidade !== cidade) return false;
               if(vendedor && (c.vendedor || 'Sem Vendedor') !== vendedor) return false;
               return true;
           });

           const divResultado = document.getElementById('relatorioResultado');
           if(filtrados.length === 0) {
               divResultado.innerHTML = '<p style="text-align:center; padding:20px;">Nenhum cliente encontrado com estes filtros.</p>';
               return;
           }

           let html = `
               <table class="performance-table">
                   <thead>
                       <tr>
                           <th>Nome</th>
                           <th>Telefone</th>
                           <th>Cidade</th>
                           <th>Status</th>
                           <th>Vendedor</th>
                           <th>Última Atualização</th>
                       </tr>
                   </thead>
                   <tbody>
           `;
           
           filtrados.forEach(c => {
               const tel = c.telefones && c.telefones.length > 0 ? c.telefones[0].numero : 'N/A';
               const dataAt = new Date(c.data_atualizacao || c.data).toLocaleDateString();
               html += `
                   <tr>
                       <td><a href="#" onclick="abrirModal('${c.id}')" style="font-weight:bold; color:#667eea">${c.nome}</a></td>
                       <td>${tel}</td>
                       <td>${c.cidade}</td>
                       <td>${c.status}</td>
                       <td>${c.vendedor || '-'}</td>
                       <td>${dataAt}</td>
                   </tr>
               `;
           });
           
           html += '</tbody></table>';
           divResultado.innerHTML = html;
       }

       // QUICK FILTERS
       function filtroRapido(tipo) {
           document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
           
           if(tipo === 'meus') {
               document.getElementById('btnFiltroMeus').classList.add('active');
               const usr = JSON.parse(sessionStorage.getItem('usuarioAtual'));
               if(usr) {
                   document.getElementById('searchInput').value = usr.nome // Approximation
                   // Better: Apply custom filter logic in filtrarClientes by modifying source code or adding global Check.
                   alert('Filtro "Meus Clientes" aplicado (Simulação: busca por nome)');
               }
           }
           if(tipo === 'novos') {
               document.getElementById('btnFiltroNovos').classList.add('active');
               alert('Filtro "Novos" aplicado');
           }
           if(tipo === 'atrasados') {
               document.getElementById('btnFiltroAtrasados').classList.add('active');
               alert('Filtro "Atrasados" aplicado');
           }
           // Real logic requires refactoring filtrarClientes.
           // For now, this is UI Placeholder as refinement step.
       }
       
       function limparFiltrosRapidos() {
           document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
           document.getElementById('searchInput').value = '';
           filtrarClientes();
       }
       
       // Quick Filters
       window.customFilterType = null;
       
       function filtroRapido(tipo) {
           // Clear all filter-tag active states
           document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
           
           // Set the custom filter type
           if(window.customFilterType === tipo) {
               // Toggle off if clicking the same filter
               window.customFilterType = null;
           } else {
               window.customFilterType = tipo;
               // Mark the clicked button as active
               const btnId = tipo === 'meus' ? 'btnFiltroMeus' : tipo === 'novos' ? 'btnFiltroNovos' : 'btnFiltroAtrasados';
               const btn = document.getElementById(btnId);
               if(btn) btn.classList.add('active');
           }
           
           filtrarClientes();
       }
       
       function limparFiltrosRapidos() {
           document.querySelectorAll('.filter-tag').forEach(b => b.classList.remove('active'));
           document.getElementById('searchInput').value = '';
           document.getElementById('statusFilter').value = '';
           document.getElementById('cidadeFilter').value = '';
           document.getElementById('bairroFilter').value = '';
           window.customFilterType = null;
           window.currentSortField = null;
           filtrarClientes();
       }

      // ========== REPORT UI INJECTION (FALLBACK) ==========
      function initReportGenerator() {
          if(document.getElementById('reportGeneratorCard')) return;
          const container = document.getElementById('reports-view');
          if(!container) return;
          
          const div = document.createElement('div');
          div.id = 'reportGeneratorCard';
          div.className = 'chart-card';
          div.style.marginTop = '30px';
          div.style.marginBottom = '50px';
          div.innerHTML = `
               <div class="chart-title">📋 Gerador de Relatórios Avançado</div>
               <div style="background:#f8fafc; padding:20px; border-radius:10px; margin-bottom:20px;">
                   <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:15px; margin-bottom:15px;">
                       <div>
                           <label class="form-label">Status</label>
                           <select id="relStatus" class="filter-select" style="width:100%">
                               <option value="">Todos</option>
                               <option value="nao_acompanhando">Não Acompanhando</option>
                               <option value="em_acompanhamento">Em Acompanhamento</option>
                               <option value="com_orcamento">Com Orçamento</option>
                               <option value="fechado">Fechado</option>
                               <option value="finalizado">Concluído/Perdido</option>
                           </select>
                       </div>
                       <div>
                           <label class="form-label">Vendedor</label>
                           <select id="relVendedor" class="filter-select" style="width:100%"><option value="">Todos</option></select>
                       </div>
                       <div>
                           <label class="form-label">Cidade</label>
                           <select id="reportCidade" class="filter-select" style="width:100%"><option value="">Todas</option></select>
                       </div>
                   </div>
                   <button class="btn btn-primary" style="width:100%" onclick="gerarRelatorio()">🔍 Gerar Relatório</button>
               </div>
               <div id="relatorioResultado" style="overflow-x:auto;">
                   <p style="text-align:center; color:#999; padding:20px;">Selecione os filtros e clique em Gerar.</p>
               </div>
          `;
          container.appendChild(div);
          
          // Popular filtros agora se já carregado
          popularFiltros(); 
          renderizarVendedores();
      }

      // ================= REFINAMENTO V3.2: LOGICA UNIFICADA =================

      // 1. FILTRO E ORDENAÇÃO
      window.currentSortField = null;
      window.currentSortDir = 'desc';

      function filtrarClientes() {
         const busca = document.getElementById("searchInput").value.toLowerCase();
         const statusFiltro = document.getElementById("statusFilter").value;
         const cidadeFiltro = document.getElementById("cidadeFilter").value;
         const bairroFiltro = document.getElementById("bairroFilter").value;
         const minArea = parseFloat(document.getElementById("minArea").value) || 0;
         const maxArea = parseFloat(document.getElementById("maxArea").value) || Infinity;

         let clientesFiltrados = clientes.filter((cliente) => {
           const matchBusca = !busca || cliente.nome.toLowerCase().includes(busca) || cliente.id.includes(busca) || cliente.cidade.toLowerCase().includes(busca) || (cliente.bairro && cliente.bairro.toLowerCase().includes(busca));
           const matchStatus = !statusFiltro || cliente.status === statusFiltro;
           const matchCidade = !cidadeFiltro || cliente.cidade === cidadeFiltro;
           const matchBairro = !bairroFiltro || cliente.bairro === bairroFiltro;
           const metragem = parseFloat(cliente.metragem) || 0;
           const matchArea = metragem >= minArea && metragem <= maxArea;
           
           let matchCustom = true;
           if(window.customFilterType === 'novos') {
              const hoje = new Date().setHours(0,0,0,0);
              const dataC = new Date(cliente.data).setHours(0,0,0,0);
              if(dataC !== hoje) matchCustom = false;
           }
           if(window.customFilterType === 'atrasados') {
              const days = (new Date() - new Date(cliente.data_atualizacao || cliente.data)) / (1000*3600*24);
              if(days < 7 || cliente.status === 'fechado' || cliente.status === 'finalizado') matchCustom = false;
           }
           if(window.customFilterType === 'meus') {
               const usr = JSON.parse(sessionStorage.getItem('usuarioAtual'));
               if(usr && (cliente.vendedor !== usr.nome)) matchCustom = false;
           }

           return matchBusca && matchStatus && matchCidade && matchBairro && matchArea && matchCustom;
      });

      // ORDENAÇÃO
      if(window.currentSortField) {
         const field = window.currentSortField;
         const dir = window.currentSortDir === 'asc' ? 1 : -1;
         clientesFiltrados.sort((a,b) => {
             let valA = a[field] || '';
             let valB = b[field] || '';
             if(field === 'metragem') {
                 valA = parseFloat(valA) || 0; valB = parseFloat(valB) || 0;
             } else {
                 valA = valA.toString().toLowerCase(); valB = valB.toString().toLowerCase();
             }
             if(valA < valB) return -1 * dir;
             if(valA > valB) return 1 * dir;
             return 0;
         });
      } else {
         clientesFiltrados.sort((a, b) => new Date(b.data) - new Date(a.data));
      }

      renderizarClientes(clientesFiltrados);
      // atualizarContadores(clientesFiltrados.length); // Função não existe, removida
      }

      function ordenarClientes(field) {
         if(window.currentSortField === field) {
             window.currentSortDir = window.currentSortDir === 'asc' ? 'desc' : 'asc';
         } else {
             window.currentSortField = field;
             window.currentSortDir = 'asc';
         }
         
         document.querySelectorAll('.quick-filters .filter-tag').forEach(btn => {
             if(btn.textContent.includes('⇅') || btn.textContent.includes('↑') || btn.textContent.includes('↓')) {
                 const originalText = btn.textContent.split(' ')[0];
                 btn.textContent = originalText + ' ⇅';
                 if(btn.onclick.toString().includes(field)) {
                      btn.textContent = originalText + (window.currentSortDir === 'asc' ? ' ↑' : ' ↓');
                      btn.classList.add('active');
                 } else {
                     btn.classList.remove('active');
                 }
             }
         });
         
         filtrarClientes();
      }

      // 2. AGENDA DRAWER
      function abrirSidebarAgenda(year, month, day) { abrirAgendaDrawer(year, month, day); }

      function abrirAgendaDrawer(year, month, day) {
          const date = new Date(year, month, day);
          const dateStr = date.toLocaleDateString('pt-BR', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
          
          // Update title
          document.getElementById('agendaDrawerDate').textContent = `📅 ${dateStr}`;
          
          // Populate form dropdowns and set default date
          if (typeof popularFormularioAgenda === 'function') {
              popularFormularioAgenda(year, month, day);
          }
          
          // Render appointments for this day
          if (typeof renderizarAgendamentosDia === 'function') {
              renderizarAgendamentosDia(year, month, day);
          }
          
          document.getElementById('agendaDrawer').classList.add('active');
          document.getElementById('agendaBackdrop').classList.add('active');
      }

      function fecharAgendaDrawer() {
          document.getElementById('agendaDrawer').classList.remove('active');
          document.getElementById('agendaBackdrop').classList.remove('active');
      }
      
      function fecharSidebarAgenda() { fecharAgendaDrawer(); }


      // 3. UNIFIED MODAL LOGIC
      function abrirModal(id) {
          clienteAtual = clientes.find(c => c.id === id);
          if(!clienteAtual) return;
          
          document.getElementById('modalClientName').textContent = clienteAtual.nome;
          document.getElementById('modalClientId').textContent = 'ID: ' + clienteAtual.id;
          document.getElementById('modalClientPhone').textContent = '📞 ' + (clienteAtual.telefones[0]?.numero || 'N/A');
          document.getElementById('modalClientCity').textContent = '📍 ' + clienteAtual.cidade;
          
          // Populate Inputs (Tab 1)
          document.getElementById('editNome').value = clienteAtual.nome;
          document.getElementById('editCidade').value = clienteAtual.cidade;
          document.getElementById('editBairro').value = clienteAtual.bairro || '';
          document.getElementById('editMetragem').value = clienteAtual.metragem || '';
          document.getElementById('editValor').value = clienteAtual.valor_estimado || '';

          // Populate Fonte
          const editFonte = document.getElementById('editFonte');
          if(editFonte) {
              // Re-render options to ensure latest custom sources
              editFonte.innerHTML = '<option value="">Selecione...</option>';
              (customSources || []).forEach(s => {
                  editFonte.innerHTML += `<option value="${s}">${s}</option>`;
              });
              editFonte.value = clienteAtual.origem_contato || '';
          }
          
          // Trigger Maps Init for Edit
          if(window.initEditAutocomplete && apiKeys && apiKeys.maps) {
             // Small delay to ensure container is visible
             setTimeout(() => window.initEditAutocomplete(), 200);
          }
          
          // Populate Unified Status (Tab 0)
          document.getElementById('unifiedStatus').value = clienteAtual.status || 'nao_acompanhando';
          
          renderizarTimelineUnificada();
          popularAtendentes(); // Populate attendant dropdown
          
          document.getElementById('clientModal').style.display = 'block';
          mudarTab(0); // Default to Ficha
      }
      
      function renderizarTimelineUnificada() {
          const container = document.getElementById('unifiedTimeline');
          container.innerHTML = '';
          
          if(!clienteAtual.historico || clienteAtual.historico.length === 0) {
              container.innerHTML = '<p style="color:#999; text-align:center;">Nenhum histórico encontrado.</p>';
              return;
          }
          
          // Sort Historico DESC
          const lista = [...clienteAtual.historico].sort((a,b) => new Date(b.data) - new Date(a.data));
          
          lista.forEach(h => {
              const date = new Date(h.data).toLocaleString('pt-BR');
              let icon = '📝';
              let bg = '#f8fafc';
              
              if(h.tipo === 'status_change') { icon = '🔄'; bg = '#eff6ff'; }
              if(h.tipo === 'agendamento') { icon = '📅'; bg = '#fffbeb'; }
              if(h.tipo === 'venda') { icon = '💰'; bg = '#ecfdf5'; }
              
              container.innerHTML += `
                  <div style="background:${bg}; padding:10px; border-radius:8px; margin-bottom:10px; border-left:4px solid #cbd5e1;">
                      <div style="display:flex; justify-content:space-between; font-size:11px; color:#64748b; margin-bottom:5px;">
                          <span>${icon} ${h.tipo.toUpperCase()}</span>
                          <span>${date}</span>
                      </div>
                      <div style="color:#333; font-size:14px;">${h.texto || h.descricao}</div>
                      ${h.data_status ? `<div style="font-size:11px; color:#666; margin-top:5px;">Data de Status: ${new Date(h.data_status).toLocaleDateString()}</div>` : ''}
                  </div>
              `;
          });
      }
      
      function salvarNotaUnificada() {
          const txt = document.getElementById('unifiedNoteInput').value;
          const date = document.getElementById('unifiedScheduleDate').value;
          const attendantSelect = document.getElementById('attendantSelect');
          const atendente = attendantSelect ? attendantSelect.value : '';
          
          if(!txt && !date) return alert('Escreva uma nota ou selecione uma data.');
          
          if(txt) {
              registrarHistorico(clienteAtual.id, 'nota', txt);
          }
          
          if(date) {
              const usuario = sessionStorage.getItem('usuarioLogado') || 'Admin';
              
              // Salvar no histórico do cliente
              const item = {
                  data: date,
                  tipo: 'agendamento',
                  texto: txt || 'Retorno Agendado',
                  status: 'pendente',
                  atendente: atendente || usuario
              };
              if(!clienteAtual.historico) clienteAtual.historico = [];
              clienteAtual.historico.push(item);
              
              // Salvar na agenda global (crmAgendamentos)
              const agendamentos = JSON.parse(localStorage.getItem('crmAgendamentos') || '[]');
              agendamentos.push({
                  id: `agd_${Date.now()}`,
                  tipo: 'visita',
                  titulo: txt || 'Retorno Agendado',
                  descricao: txt || '',
                  clienteId: clienteAtual.id,
                  clienteNome: clienteAtual.nome,
                  responsavel: atendente || usuario,
                  dataHora: date,
                  criadoPor: usuario,
                  criadoEm: new Date().toISOString(),
                  status: 'pendente'
              });
              localStorage.setItem('crmAgendamentos', JSON.stringify(agendamentos));
          }
          
          salvarDados();
          renderizarTimelineUnificada();
          document.getElementById('unifiedNoteInput').value = '';
          document.getElementById('unifiedScheduleDate').value = '';
          popularAtendentes(); // Reset dropdown
          // Refresh Calendar if open?
          if(typeof renderizarAgenda === 'function') renderizarAgenda();
      }
      
      function registarHistorico(id, tipo, texto) {
          const c = clientes.find(x => x.id === id);
          if(!c) return;
          if(!c.historico) c.historico = [];
          
          c.historico.push({
              data: new Date().toISOString(),
              tipo: tipo,
              texto: texto
          });
          salvarDados();
      }
      // Fix Typo
      function registrarHistorico(id, tipo, texto) { registarHistorico(id, tipo, texto); }
      
      // Popular dropdown de atendentes
      function popularAtendentes() {
          const select = document.getElementById('attendantSelect');
          if (!select) return;
          
          const usuarioLogado = sessionStorage.getItem('usuarioLogado') || 'Admin';
          const vendedores = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
          
          select.innerHTML = '<option value="">Selecione o atendente...</option>';
          
          vendedores.forEach(v => {
              const nome = v.user || v;
              const selected = nome === usuarioLogado ? 'selected' : '';
              select.innerHTML += `<option value="${nome}" ${selected}>${nome}</option>`;
          });
      }
      
      function setStatusRapido(status, label) {
           document.getElementById('unifiedStatus').value = status;
           atualizarStatusRapido(label);
      }
      
      function atualizarStatusRapido(customLabel) {
           const status = document.getElementById('unifiedStatus').value;
           const old = clienteAtual.status;
           
           if(status !== old) {
               clienteAtual.status = status;
               clienteAtual.data_status = new Date().toISOString();
               registrarHistorico(clienteAtual.id, 'status_change', `Status alterado de "${old}" para "${status}". ${customLabel ? '('+customLabel+')' : ''}`);
               salvarDados();
               renderizarTimelineUnificada();
               // Update UI
               filtrarClientes();
               renderizarDashboard();
           }
      }
      
      function salvarEdicaoRapida() {
          clienteAtual.nome = document.getElementById('editNome').value;
          clienteAtual.cidade = document.getElementById('editCidade').value;
          clienteAtual.bairro = document.getElementById('editBairro').value;
          clienteAtual.metragem = document.getElementById('editMetragem').value;
          clienteAtual.valor_estimado = document.getElementById('editValor').value;
          
          salvarDados();
          alert('Dados atualizados!');
          renderizarClientes(clientes); // Refresh bg
      }

      // ========== LOGIN SYSTEM ==========
      function fazerLogin() {
          const u = document.getElementById('loginUser').value;
          const p = document.getElementById('loginPass').value;
          
          const users = JSON.parse(localStorage.getItem('crmUsuarios') || '[{"user":"admin","pass":"admin","nome":"Administrador"}]');
          
          const valid = users.find(user =>
            ((user.user || user.login) === u) && ((user.pass || user.senha) === p)
          );
          if(valid) {
              // Salvar usuário e horário de login
              const loginTimestamp = new Date().toISOString();
              sessionStorage.setItem('usuarioAtual', JSON.stringify(valid));
              sessionStorage.setItem('loginTimestamp', loginTimestamp);
              
              document.getElementById('loginOverlay').style.display = 'none';
              iniciarSistema();
              atualizarInfoLogin(); // Atualizar navbar
          } else {
              alert('Dados incorretos!');
          }
      }
      
      /**
       * Atualizar informações de login na navbar
       */
      function atualizarInfoLogin() {
        const userInfoDiv = document.getElementById('userLoginInfo');
        if (!userInfoDiv) return;
        
        const usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioAtual') || '{}');
        const loginTimestamp = sessionStorage.getItem('loginTimestamp');
        
        // Verificar se temos dados de usuário
        const nomeUsuario = usuarioAtual.nome || usuarioAtual.user || null;
        
        if (nomeUsuario && loginTimestamp) {
          const loginDate = new Date(loginTimestamp);
          const hora = loginDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          
          userInfoDiv.innerHTML = `
            <div style="display:flex; flex-direction:column; line-height:1.3;">
              <span style="font-weight:600; color:#1e293b;">👤 ${nomeUsuario}</span>
              <span style="font-size:10px; color:#94a3b8;">Login: ${hora}</span>
            </div>
          `;
        } else {
          // Se não tiver dados, exibir placeholder
          userInfoDiv.innerHTML = `<span style="color:#94a3b8; font-size:12px;">Sem usuário</span>`;
        }
      }
      
      /**
       * Obter lista de usuários ativos do sistema
       * Retorna array de nomes para popular selects
       */
      function obterUsuariosAtivos() {
        const usuarios = JSON.parse(localStorage.getItem('crmUsuarios') || '[]');
        return usuarios.map(u => u.nome || u.user || 'Sem nome').filter(Boolean);
      }
      
      /**
       * Popular todos os selects de vendedor/atendente com usuários reais
       */
      function popularSelectsUsuarios() {
        const usuarios = obterUsuariosAtivos();
        
        // 1. Select de novo cliente (modal)
        const newClientSelect = document.getElementById('newClientVendedor');
        if (newClientSelect) {
          newClientSelect.innerHTML = '<option value="">Selecione...</option>';
          usuarios.forEach(nome => {
            newClientSelect.innerHTML += `<option value="${nome}">${nome}</option>`;
          });
        }
        
        // 2. Select de edição de cliente (se existir)
        const editClientSelect = document.getElementById('modalClientVendedor');
        if (editClientSelect) {
          editClientSelect.innerHTML = '<option value="">Selecione...</option>';
          usuarios.forEach(nome => {
            editClientSelect.innerHTML += `<option value="${nome}">${nome}</option>`;
          });
        }
        
        // 3. Select de relatórios (se existir)
        const relSelect = document.getElementById('filterVendedor');
        if (relSelect) {
          relSelect.innerHTML = '<option value="">Todos</option>';
          usuarios.forEach(nome => {
            relSelect.innerHTML += `<option value="${nome}">${nome}</option>`;
          });
        }
      }
      

      function fazerLogout() {
          sessionStorage.removeItem('usuarioAtual');
          location.reload();
      }

      window.onload = function() {
          if(!sessionStorage.getItem('usuarioAtual')) {
              document.getElementById('loginOverlay').style.display = 'flex';
          } else {
              iniciarSistema();
          }
      };

      function iniciarSistema() {
            // Inicializar CRM
            carregarDados();
            
            
            // Inicializar selects de usuários
            popularSelectsUsuarios();
            
            // Atualizar info de login na navbar
            atualizarInfoLogin();
        };

      window.onclick = function (event) {
        const modal = document.getElementById("clientModal");
        const uploadArea = document.getElementById("uploadArea");
        const newClientModal = document.getElementById("newClientModal");
        const auditModal = document.getElementById("auditModal");

        if (event.target === modal) fecharModal();
        if (event.target === uploadArea) fecharUpload();
        if (event.target === newClientModal) fecharNovoCliente();
        if (event.target === auditModal) fecharModal();
      };

      // ========== SISTEMA DE MODAL DO CLIENTE (V3.2) ==========
      
      /** 
       * Abre o modal do cliente e popula com dados
       * @param {Object|String} cliente - Objeto do cliente ou ID do cliente
       */
      function abrirModal(cliente) {
        // Permitir passar ID ou objeto
        if (typeof cliente === 'string') {
          cliente = clientes.find(c => c.id === cliente);
        }
        
        if (!cliente) {
          console.error('Cliente não encontrado:', cliente);
          return;
        }
        
        // Fechar outros modais primeiro
        fecharModal();
        
        // Guardar referência global
        clienteAtual = cliente;
        
        // ===== POPULAR HEADER =====
        document.getElementById('modalClientName').textContent = cliente.nome || 'Sem nome';
        document.getElementById('modalClientId').textContent = `ID: ${cliente.id}`;
        // Helper para extrair telefone (string OU objeto)
        const getTelefone = (tel) => {
          if (!tel || !Array.isArray(tel) || tel.length === 0) return null;
          const first = tel[0];
          return typeof first === 'string' ? first : (first?.numero || null);
        };
        document.getElementById('modalClientPhone').textContent = `📞 ${cliente.telefone || getTelefone(cliente.telefones) || 'Não informado'}`;
        document.getElementById('modalClientCity').textContent = `📍 ${cliente.cidade || 'Não informado'}`;
        
        // ===== POPULAR STATUS (TAB 0) =====
        const statusSelect = document.getElementById('unifiedStatus');
        if (statusSelect) {
          statusSelect.value = cliente.status || 'nao_acompanhando';
        }
        
        // ===== RENDERIZAR TIMELINE =====
        renderizarTimelineUnificada();
        
        // ===== POPULAR FORMULÁRIO DE EDIÇÃO (TAB 1) =====
        document.getElementById('editNome').value = cliente.nome || '';
        document.getElementById('editCidade').value = cliente.cidade || '';
        document.getElementById('editBairro').value = cliente.bairro || '';
        // Metragem removed
        document.getElementById('editValor').value = cliente.valor_estimado || '';
        
        function carregarConfiguracoesNaTela() {
          document.getElementById('configAppName').value = appConfig.name || '';
          document.getElementById('configAppLogo').value = appConfig.logo || '';
          document.getElementById('configAppColor').value = appConfig.color || '#667eea';
          if(appConfig.font) document.getElementById('configAppFont').value = appConfig.font;
          
          renderizarListaCampos();
          renderizarListaFontesSettings();
          carregarIntegracoes();
      }  // ===== POPULAR ATENDENTES E TELEFONES =====
        popularAtendentes();
        renderizarTelefonesEdit();
        
        // ===== RESETAR PARA TAB 0 =====
        mudarTab(0);
        
        // ===== MOSTRAR MODAL =====
        document.getElementById('clientModal').style.display = 'flex';
      }
      
      /**
       * Fecha todos os modais e limpa referências
       */
      function fecharModal() {
        // Fechar todos os modais possíveis
        const modals = [
          'clientModal',
          'newClientModal',
          'auditModal',
          'importModal',
          'whatsappModal',
          'settingsModal'
        ];
        
        modals.forEach(modalId => {
          const modal = document.getElementById(modalId);
          if (modal) {
            modal.style.display = 'none';
          }
        });
        
        // Limpar referência global
        clienteAtual = null;
        
        // Limpar input de nota
        const noteInput = document.getElementById('unifiedNoteInput');
        if (noteInput) noteInput.value = '';
        
        const scheduleInput = document.getElementById('unifiedScheduleDate');
        if (scheduleInput) scheduleInput.value = '';
      }
      
      /**
       * Alterna entre as tabs do modal
       * @param {Number} index - Índice da tab (0 ou 1)
       */
      function mudarTab(index) {
        // Remover 'active' de todas as tabs e conteúdos
        const tabs = document.querySelectorAll('#clientModal .tab');
        const contents = document.querySelectorAll('#clientModal .tab-content');
        
        tabs.forEach(tab => tab.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));
        
        // Ativar tab e conteúdo selecionados
        if (tabs[index]) tabs[index].classList.add('active');
        if (contents[index]) contents[index].classList.add('active');
      }
      
      /**
       * Renderiza a timeline unificada do cliente atual
       */
      function renderizarTimelineUnificada() {
        if (!clienteAtual) return;
        
        const timeline = document.getElementById('unifiedTimeline');
        if (!timeline) return;
        
        // Coletar todos os eventos do cliente
        const eventos = [];
        
        // 1. HISTÓRICO UNIFICADO (já migrado)
        if (clienteAtual.historico && clienteAtual.historico.length > 0) {
          clienteAtual.historico.forEach(hist => {
            const icone = hist.tipo === 'nota' ? '📝' : 
                          hist.tipo === 'agendamento' ? '📅' :
                          hist.tipo === 'status' ? '🔄' : '💬';
            
            eventos.push({
              tipo: hist.tipo,
              data: hist.data,
              usuario: hist.autor || hist.usuario || 'Sistema',
              texto: hist.texto,
              icone: icone,
              status: hist.agendamento?.status
            });
          });
        }
        
        // 2. NOTAS ANTIGAS (compatibilidade retroativa)
        if (clienteAtual.anotacoes && clienteAtual.anotacoes.length > 0) {
          clienteAtual.anotacoes.forEach(nota => {
            if (!eventos.some(e => e.texto === nota.texto && e.data === nota.timestamp)) {
              eventos.push({
                tipo: 'nota',
                data: nota.timestamp || nota.data || new Date().toISOString(),
                usuario: nota.usuario || 'Sistema',
                texto: nota.texto || nota.anotacao,
                icone: '📝'
              });
            }
          });
        }
        
        // 3. AGENDAMENTOS ANTIGOS (compatibilidade retroativa)
        if (clienteAtual.retornos && clienteAtual.retornos.length > 0) {
          clienteAtual.retornos.forEach(retorno => {
            if (!eventos.some(e => e.data === retorno.data_retorno)) {
              const dataRetorno = new Date(retorno.data_retorno);
              const agora = new Date();
              const status = retorno.status || (dataRetorno < agora ? 'atrasado' : 'pendente');
              
              eventos.push({
                tipo: 'agendamento',
                data: retorno.data_retorno || retorno.timestamp,
                usuario: retorno.usuario || 'Sistema',
                texto: retorno.texto || retorno.descricao || 'Retorno agendado',
                status: status,
                icone: '📅'
              });
            }
          });
        }
        
        // 4. DADOS DE IMPORTAÇÃO (primeiro evento)
        if (clienteAtual.data_importacao) {
          eventos.push({
            tipo: 'importacao',
            data: clienteAtual.data_importacao,
            usuario: 'Sistema',
            texto: `Cliente importado via ${clienteAtual.fonte || 'Guia da Construção'}`,
            icone: '🔽'
          });
        }
        
        // Ordenar por data (mais recente primeiro)
        eventos.sort((a, b) => new Date(b.data) - new Date(a.data));
        
        // Renderizar timeline
        if (eventos.length === 0) {
          timeline.innerHTML = `
            <div style="text-align:center; padding:40px; color:#94a3b8;">
              <p style="font-size:48px; margin:0;">📋</p>
              <p style="margin-top:10px;">Nenhum histórico ainda.</p>
              <p style="font-size:13px; color:#cbd5e1;">Adicione notas ou agende retornos para começar.</p>
            </div>
          `;
          return;
        }
        
        timeline.innerHTML = eventos.map(ev => {
          const dataFormatada = new Date(ev.data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          return `
            <div class="timeline-item" style="border-left:3px solid #e2e8f0; padding-left:15px; margin-bottom:20px; position:relative;">
              <span style="position:absolute; left:-12px; top:0; background:white; font-size:20px;">${ev.icone}</span>
              <div style="font-size:11px; color:#94a3b8; margin-bottom:5px;">
                ${dataFormatada} • ${ev.usuario}
              </div>
              <div style="color:#334155; line-height:1.5;">
                ${ev.texto}
              </div>
              ${ev.atendente ? `<div style="font-size:11px; color:#10b981; margin-top:5px;"><strong>👤 Atendente:</strong> ${ev.atendente}</div>` : ''}
              ${ev.status === 'atrasado' ? '<span style="color:#ef4444; font-size:11px; font-weight:bold;">⚠️ ATRASADO</span>' : ''}
            </div>
          `;
        }).join('');
      }
      
      /**
       * Salva uma nota ou agendamento na timeline
       */
      function salvarNotaUnificada() {
        if (!clienteAtual) return;
        
        const noteInput = document.getElementById('unifiedNoteInput');
        const scheduleInput = document.getElementById('unifiedScheduleDate');
        const attendantSelect = document.getElementById('attendantSelect');
        
        const textoNota = noteInput.value.trim();
        const dataAgendamento = scheduleInput.value;
        const atendente = attendantSelect ? attendantSelect.value : '';
        
        if (!textoNota) {
          alert('Digite uma nota primeiro!');
          return;
        }
        
        if (!atendente) {
          alert('Selecione o atendente responsável!');
          return;
        }
        
        const usuario = sessionStorage.getItem('usuarioLogado') || 'Admin';
        const timestamp = new Date().toISOString();
        
        // Inicializar histórico se não existir
        if (!clienteAtual.historico) clienteAtual.historico = [];
        
        // ===== SALVAR COMO NOTA =====
        clienteAtual.historico.push({
          id: `nota_${Date.now()}`,
          tipo: 'nota',
          data: timestamp,
          texto: textoNota,
          autor: usuario,
          atendente: atendente  // NOVO: Salvar atendente
        });
        
        // ===== SE TEM AGENDAMENTO, SALVAR TAMBÉM =====
        if (dataAgendamento) {
          clienteAtual.historico.push({
            id: `agend_${Date.now()}`,
            tipo: 'agendamento',
            data: dataAgendamento,
            texto: textoNota,
            autor: usuario,
            agendamento: {
              data: dataAgendamento,
              status: 'pendente'
            }
          });
        }
        
        // ===== ATUALIZAR CLIENTE NO ARRAY GLOBAL =====
        const index = clientes.findIndex(c => c.id === clienteAtual.id);
        if (index !== -1) {
          clientes[index] = clienteAtual;
        }
        
        // ===== SALVAR NO LOCALSTORAGE =====
        salvarDados();
        
        // ===== LIMPAR INPUTS =====
        noteInput.value = '';
        scheduleInput.value = '';
        popularAtendentes(); // Re-seleciona usuário atual
        
        // ===== RE-RENDERIZAR TIMELINE =====
        renderizarTimelineUnificada();
        
        // Feedback visual
        noteInput.placeholder = '✅ Nota salva com sucesso!';
        setTimeout(() => {
          noteInput.placeholder = 'Digite uma nota ou resumo do atendimento...';
        }, 2000);
      }
      
      /**
       * Popular dropdown de atendentes com usuários cadastrados
       */
      function popularAtendentes() {
        const select = document.getElementById('attendantSelect');
        if (!select) return;
        
        const usuarios = obterUsuariosAtivos(); // Usar função centralizada
        const usuarioAtual = JSON.parse(sessionStorage.getItem('usuarioAtual') || '{}');
        
        // Limpar e adicionar placeholder
        select.innerHTML = '<option value="">Selecione o atendente...</option>';
        
        // Adicionar cada usuário
        usuarios.forEach(nome => {
          const option = document.createElement('option');
          option.value = nome;
          option.textContent = nome;
          
          // Pre-selecionar usuário logado
          if (nome === usuarioAtual.nome) {
            option.selected = true;
          }
          
          select.appendChild(option);
        });
      }
      
      /**
       * Renderizar lista de telefones editáveis na Tab 1
       */
      function renderizarTelefonesEdit() {
        const container = document.getElementById('editPhonesList');
        if (!container || !clienteAtual) return;
        
        container.innerHTML = '';
        
        // Pegar telefones (array de strings ou objetos)
        const telefones = clienteAtual.telefones || [];
        
        if (telefones.length === 0) {
          container.innerHTML = '<small style="color:#94a3b8;">Nenhum telefone cadastrado</small>';
          return;
        }
        
        telefones.forEach((tel, index) => {
          const numero = typeof tel === 'string' ? tel : (tel.numero || '');
          
          const div = document.createElement('div');
          div.style.cssText = 'display:flex; gap:8px; align-items:center;';
          div.innerHTML = `
            <input type="tel" value="${numero}" 
                   onchange="atualizarTelefone(${index}, this.value)"
                   class="form-input" style="flex:1;" 
                   placeholder="(00) 00000-0000">
            <button type="button" onclick="removerTelefone(${index})" 
                    class="btn" style="padding:6px 12px; background:#ef4444; color:white;">
              🗑️
            </button>
          `;
          
          container.appendChild(div);
        });
      }
      
      /**
       * Adicionar novo campo de telefone vazio
       */
      function adicionarTelefoneEdit() {
        if (!clienteAtual) return;
        
        if (!clienteAtual.telefones) clienteAtual.telefones = [];
        clienteAtual.telefones.push('');
        
        renderizarTelefonesEdit();
      }
      
      /**
       * Atualizar telefone específico
       */
      function atualizarTelefone(index, novoValor) {
        if (!clienteAtual || !clienteAtual.telefones) return;
        
        clienteAtual.telefones[index] = novoValor.trim();
        salvarDados();
      }
      
      /**
       * Remover telefone
       */
      function removerTelefone(index) {
        if (!clienteAtual || !clienteAtual.telefones) return;
        
        if (confirm('Remover este telefone?')) {
          clienteAtual.telefones.splice(index, 1);
          salvarDados();
          renderizarTelefonesEdit();
        }
      }
      
      
      /**
       * Atualiza o status do cliente via dropdown
       */
      function atualizarStatusRapido() {
        if (!clienteAtual) return;
        
        const statusSelect = document.getElementById('unifiedStatus');
        const novoStatus = statusSelect.value;
        
        if (clienteAtual.status === novoStatus) return; // Sem mudança
        
        const statusAnterior = clienteAtual.status;
        clienteAtual.status = novoStatus;
        
        // ===== REGISTRAR NO HISTÓRICO =====
        registrarHistorico(statusAnterior, novoStatus);
        
        // ===== ATUALIZAR NO ARRAY GLOBAL =====
        const index = clientes.findIndex(c => c.id === clienteAtual.id);
        if (index !== -1) {
          clientes[index] = clienteAtual;
        }
        
        // ===== SALVAR =====
        salvarDados();
        
        // ===== RE-RENDERIZAR PARA REFLETIR MUDANÇA =====
        renderizarTimelineUnificada();
        filtrarClientes(); // Atualizar card na lista
        atualizarEstatisticas(); // Atualizar gráficos
      }
      
      /**
       * Define status via quick action button
       * @param {String} status - Novo status
       * @param {String} nota - Nota automática
       */
      function setStatusRapido(status, nota) {
        if (!clienteAtual) return;
        
        const statusAnterior = clienteAtual.status;
        clienteAtual.status = status;
        
        // Inicializar histórico se não existir
        if (!clienteAtual.historico) clienteAtual.historico = [];
        
        // ===== ADICIONAR NOTA AUTOMÁTICA =====
        const usuario = sessionStorage.getItem('usuarioLogado') || 'Admin';
        
        clienteAtual.historico.push({
          id: `nota_${Date.now()}`,
          tipo: 'nota',
          data: new Date().toISOString(),
          texto: nota,
          autor: usuario
        });
        
        // ===== REGISTRAR MUDANÇA DE STATUS NO HISTÓRICO =====
        registrarHistorico(statusAnterior, status);
        
        // ===== ATUALIZAR DROPDOWN =====
        document.getElementById('unifiedStatus').value = status;
        
        // ===== SALVAR =====
        const index = clientes.findIndex(c => c.id === clienteAtual.id);
        if (index !== -1) {
          clientes[index] = clienteAtual;
        }
        salvarDados();
        
        // ===== RE-RENDERIZAR =====
        renderizarTimelineUnificada();
        filtrarClientes();
        atualizarEstatisticas();
      }
      
      /**
       * Helper: Registra mudança de status no histórico
       * @param {String} statusAnterior 
       * @param {String} statusNovo 
       */
      function registrarHistorico(statusAnterior, statusNovo) {
        if (!clienteAtual) return;
        
        if (!clienteAtual.historico) clienteAtual.historico = [];
        
        const usuario = sessionStorage.getItem('usuarioLogado') || 'Admin';
        
        const statusLabels = {
          nao_acompanhando: "Não Acompanhando",
          em_acompanhamento: "Em Acompanhamento",
          com_orcamento: "Com Orçamento",
          fechado: "Fechado",
          finalizado: "Finalizado/Perdido"
        };
        
        clienteAtual.historico.push({
          id: `status_${Date.now()}`,
          tipo: 'status',
          data: new Date().toISOString(),
          texto: `Status alterado de "${statusLabels[statusAnterior] || statusAnterior}" para "${statusLabels[statusNovo] || statusNovo}"`,
          autor: usuario
        });
      }
      
      /**
       * Salva edições feitas no formulário da Tab 1
       */
      function salvarEdicaoRapida() {
        if (!clienteAtual) return;
        
        // ===== VALIDAR NOME OBRIGATÓRIO =====
        const nome = document.getElementById('editNome').value.trim();
        if (!nome) {
          alert('❌ Nome do cliente é obrigatório!');
          document.getElementById('editNome').focus();
          return;
        }
        
        // ===== ATUALIZAR DADOS DO CLIENTE =====
        clienteAtual.nome = nome;
        clienteAtual.cidade = document.getElementById('editCidade').value.trim();
        clienteAtual.bairro = document.getElementById('editBairro').value.trim();
        // clienteAtual.metragem removed from edit
        clienteAtual.valor_estimado = parseFloat(document.getElementById('editValor').value) || 0;
        
        // ===== ATUALIZAR NO ARRAY GLOBAL =====
        const index = clientes.findIndex(c => c.id === clienteAtual.id);
        if (index !== -1) {
          clientes[index] = clienteAtual;
        }
        
        // ===== SALVAR =====
        salvarDados();
        
        // ===== ATUALIZAR HEADER DO MODAL =====
        document.getElementById('modalClientName').textContent = clienteAtual.nome;
        document.getElementById('modalClientCity').textContent = `📍 ${clienteAtual.cidade}`;
        
        // ===== RE-RENDERIZAR LISTA =====
        popularFiltros(); // Re-popular filtros (cidades/bairros podem ter mudado)
        filtrarClientes(); // Re-renderizar cards
        
        // ===== FEEDBACK =====
        alert('✅ Dados salvos com sucesso!');
      }
      
      /**
       * Deleta o cliente após confirmação
       */
      function deletarCliente() {
        if (!clienteAtual) return;
        
        const confirmacao = confirm(
          `⚠️ TEM CERTEZA?\n\n` +
          `Deseja REALMENTE deletar o cliente:\n` +
          `"${clienteAtual.nome}" (ID: ${clienteAtual.id})?\n\n` +
          `Esta ação NÃO pode ser desfeita!`
        );
        
        if (!confirmacao) return;
        
        // ===== REMOVER DO ARRAY =====
        const index = clientes.findIndex(c => c.id === clienteAtual.id);
        if (index !== -1) {
          clientes.splice(index, 1);
        }
        
        // ===== SALVAR =====
        salvarDados();
        
        // ===== FECHAR MODAL =====
        fecharModal();
        
        // ===== RE-RENDERIZAR =====
        popularFiltros();
        filtrarClientes();
        atualizarEstatisticas();
        
        alert('🗑️ Cliente deletado com sucesso!');
      }

      // ========== SETTINGS MODAL (USUÁRIOS + TEMPLATES WHATSAPP) ==========
      
      /**
       * Abre o modal de configurações
       */
      function abrirConfig() {
        // Fechar outros modais
        fecharModal();
        
        // Renderizar conteúdo
        renderizarUsuarios();
        renderizarTemplatesSettings();
        
        // Mostrar modal
        document.getElementById('settingsModal').style.display = 'flex';
        mudarTabSettings(0);
      }
      
      /**
       * Alternar tabs do settings
       */
      function mudarTabSettings(index) {
        const tabs = document.querySelectorAll('#settingsModal .tab');
        const contents = document.querySelectorAll('#settingsModal .tab-content');
        
        tabs.forEach(t => t.classList.remove('active'));
        contents.forEach(c => c.classList.remove('active'));
        
        tabs[index].classList.add('active');
        contents[index].classList.add('active');
      }
      
      // ========== GERENCIAMENTO DE USUÁRIOS (Unified above) ==========
      // Logic moved to lines 1573+ to avoid duplication and ReferenceErrors


      
      // ========== WHATSAPP TEMPLATES (INTEGRADO COM SETTINGS) ==========
      
      
      // ========== FUNÇÕES DE AGENDAMENTO ==========
      
      function salvarAgendamento() {
          const tipo = document.getElementById('agendaTipo').value;
          const titulo = document.getElementById('agendaTitulo').value.trim();
          const clienteId = document.getElementById('agendaCliente').value;
          const responsavel = document.getElementById('agendaResponsavel').value;
          const dataHora = document.getElementById('agendaDataHora').value;
          const descricao = document.getElementById('agendaDescricao').value.trim();
          
          if (!titulo) { alert('Digite um título para o agendamento'); return; }
          if (!responsavel) { alert('Selecione o responsável'); return; }
          if (!dataHora) { alert('Selecione data e hora'); return; }
          
          const usuario = sessionStorage.getItem('usuarioLogado') || 'Admin';
          const agendamentos = JSON.parse(localStorage.getItem('crmAgendamentos') || '[]');
          
          let clienteNome = '';
          if (clienteId) {
              const cliente = clientes.find(c => c.id === clienteId);
              clienteNome = cliente ? cliente.nome : '';
          }
          
          const novoAgendamento = {
              id: `agd_${Date.now()}`,
              tipo: tipo,
              titulo: titulo,
              descricao: descricao,
              clienteId: clienteId || null,
              clienteNome: clienteNome,
              responsavel: responsavel,
              dataHora: dataHora,
              criadoPor: usuario,
              criadoEm: new Date().toISOString(),
              status: 'pendente'
          };
          
          agendamentos.push(novoAgendamento);
          localStorage.setItem('crmAgendamentos', JSON.stringify(agendamentos));
          
          if (clienteId) {
              const cliente = clientes.find(c => c.id === clienteId);
              if (cliente) {
                  if (!cliente.historico) cliente.historico = [];
                  cliente.historico.push({
                      id: novoAgendamento.id,
                      tipo: 'agendamento',
                      data: dataHora,
                      texto: titulo,
                      descricao: descricao,
                      autor: usuario,
                      status: 'pendente',
                      atendente: responsavel
                  });
                  salvarDados();
              }
          }
          
          alert('✅ Agendamento criado com sucesso!');
          document.getElementById('agendaTitulo').value = '';
          document.getElementById('agendaCliente').value = '';
          document.getElementById('agendaDescricao').value = '';
          
          const dateObj = new Date(dataHora);
          if(typeof renderizarAgenda === 'function') renderizarAgenda();
          renderizarAgendamentosDia(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
          popularFormularioAgenda(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
      }
      
      function renderizarAgendamentosDia(ano, mes, dia) {
          const container = document.getElementById('listaAgendamentosDia');
          if (!container) return;
          
          const agendamentos = JSON.parse(localStorage.getItem('crmAgendamentos') || '[]');
          const agendamentosDoDia = agendamentos.filter(agd => {
              const agdDate = new Date(agd.dataHora);
              return agdDate.getFullYear() === ano && agdDate.getMonth() === mes && agdDate.getDate() === dia;
          });
          
          if (agendamentosDoDia.length === 0) {
              container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhum agendamento para este dia.</p>';
              return;
          }
          
          agendamentosDoDia.sort((a, b) => new Date(a.dataHora) - new Date(b.dataHora));
          container.innerHTML = '<h4 style="margin:15px 0 10px 0; color:#334155;">📋 Agendamentos do Dia</h4>';
          
          agendamentosDoDia.forEach(agd => {
              const hora = new Date(agd.dataHora).toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});
              const tipoIcon = {'reuniao': '📅', 'ligacao': '📞', 'visita': '🏠', 'outro': '📝'}[agd.tipo] || '📝';
              const statusColor = agd.status === 'concluido' ? '#10b981' : '#f59e0b';
              
              const clienteInfo = agd.clienteNome ? `<div style="font-size:13px; color:#667eea; margin-bottom:5px;">👤 Cliente: ${agd.clienteNome}</div>` : '';
              const descInfo = agd.descricao ? `<div style="font-size:13px; color:#475569;">${agd.descricao}</div>` : '';
              
              container.innerHTML += `
                  <div style="background:white; border:1px solid #e2e8f0; padding:12px; border-radius:8px; margin-bottom:10px; border-left:4px solid ${statusColor};">
                      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
                          <div>
                              <div style="font-weight:600; color:#334155; margin-bottom:4px;">${tipoIcon} ${agd.titulo}</div>
                              <div style="font-size:12px; color:#64748b;">⏰ ${hora} • 👤 ${agd.responsavel}</div>
                          </div>
                          <button onclick="excluirAgendamento('${agd.id}')" class="btn" style="background:#ef4444; color:white; padding:4px 8px; font-size:11px;">🗑️</button>
                      </div>
                      ${clienteInfo}
                      ${descInfo}
                  </div>
              `;
          });
      }
      
      function excluirAgendamento(id) {
          if (!confirm('Deseja excluir este agendamento?')) return;
          
          let agendamentos = JSON.parse(localStorage.getItem('crmAgendamentos') || '[]');
          const agendamento = agendamentos.find(a => a.id === id);
          
          agendamentos = agendamentos.filter(a => a.id !== id);
          localStorage.setItem('crmAgendamentos', JSON.stringify(agendamentos));
          
          if (agendamento && agendamento.clienteId) {
              const cliente = clientes.find(c => c.id === agendamento.clienteId);
              if (cliente && cliente.historico) {
                  cliente.historico = cliente.historico.filter(h => h.id !== id);
                  salvarDados();
              }
          }
          
          const agdDate = new Date(agendamento.dataHora);
          if(typeof renderizarAgenda === 'function') renderizarAgenda();
          renderizarAgendamentosDia(agdDate.getFullYear(), agdDate.getMonth(), agdDate.getDate());
      }
      
      function popularFormularioAgenda(ano, mes, dia) {
          const targetDate = new Date(ano, mes, dia, 9, 0);
          const dateTimeString = targetDate.toISOString().slice(0, 16);
          const dataInput = document.getElementById('agendaDataHora');
          if(dataInput) dataInput.value = dateTimeString;
          
          // Popular datalist de clientes
          const clienteDatalist = document.getElementById('clientesList');
          const clienteInput = document.getElementById('agendaClienteInput');
          const clienteHidden = document.getElementById('agendaCliente');
          
          if (clienteDatalist) {
              clienteDatalist.innerHTML = '';
              clientes.forEach(c => {
                  const option = document.createElement('option');
                  option.value = `${c.id} - ${c.nome}`;
                  option.setAttribute('data-id', c.id);
                  clienteDatalist.appendChild(option);
              });
              
              // Listener para capturar seleção
              if (clienteInput) {
                  clienteInput.addEventListener('input', function() {
                      const val = this.value;
                      const cliente = clientes.find(c => val.includes(c.id) || val === c.nome);
                      if (cliente) {
                          clienteHidden.value = cliente.id;
                      } else {
                          clienteHidden.value = '';
                      }
                  });
              }
          }
          
          const responsavelSelect = document.getElementById('agendaResponsavel');
          if (responsavelSelect) {
              const vendedores = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
              const usuarioLogado = sessionStorage.getItem('usuarioLogado') || 'Admin';
              
              responsavelSelect.innerHTML = '<option value="">Selecione...</option>';
              vendedores.forEach(v => {
                  const nome = v.user || v;
                  const selected = nome === usuarioLogado ? 'selected' : '';
                  responsavelSelect.innerHTML += `<option value="${nome}" ${selected}>${nome}</option>`;
              });
          }
      }
      
      function renderizarTemplatesSettings() {
        const lista = document.getElementById('listaTemplatesSettings');
        if (!lista) return;
        
        const templates = JSON.parse(localStorage.getItem('crmWhatsappTemplates') || '[]');
        
        if (templates.length === 0) {
          lista.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Nenhum template cadastrado.</p>';
          return;
        }
        
        lista.innerHTML = templates.map((t, i) => `
          <div style="padding:12px; background:#f8f9fa; margin-bottom:10px; border-radius:8px;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
              <strong style="font-size:14px;">${t.title}</strong>
              <button class="btn" style="background:#dc3545; color:white; padding:5px 10px; font-size:12px;" onclick="removerTemplate(${i}); renderizarTemplatesSettings();">🗑️</button>
            </div>
            <div style="color:#666; font-size:13px; white-space:pre-wrap; line-height:1.5;">${t.body}</div>
          </div>
        `).join('');
      }