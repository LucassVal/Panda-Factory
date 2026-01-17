# Read the file
$content = Get-Content "C:\Users\Lucas Valério\Desktop\CRM\CRM.html" -Raw

# Find the line with "function fecharSidebarAgenda"
$searchPattern = 'function fecharSidebarAgenda\(\) \{ fecharAgendaDrawer\(\); \}'

# The new functions to add
$newFunctions = @"

      // ========== FUNÇÕES DE AGENDAMENTO (NOVO SISTEMA) ==========
      
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
              id: `+"`agd_${Date.now()}`"+`,
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
              
              container.innerHTML += `+"`"+`
                  <div style="background:white; border:1px solid #e2e8f0; padding:12px; border-radius:8px; margin-bottom:10px; border-left:4px solid ${statusColor};">
                      <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
                          <div>
                              <div style="font-weight:600; color:#334155; margin-bottom:4px;">${tipoIcon} ${agd.titulo}</div>
                              <div style="font-size:12px; color:#64748b;">⏰ ${hora} • 👤 ${agd.responsavel}</div>
                          </div>
                          <button onclick="excluirAgendamento('${agd.id}')" class="btn" style="background:#ef4444; color:white; padding:4px 8px; font-size:11px;">🗑️</button>
                      </div>
                      ${agd.clienteNome ? `+"`<div style=\"font-size:13px; color:#667eea; margin-bottom:5px;\">👤 Cliente: ${agd.clienteNome}</div>`"+` : ''}
                      ${agd.descricao ? `+"`<div style=\"font-size:13px; color:#475569;\">${agd.descricao}</div>`"+` : ''}
                  </div>
              `+"`"+`;
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
          
          const clienteSelect = document.getElementById('agendaCliente');
          if (clienteSelect) {
              clienteSelect.innerHTML = '<option value="">-- Sem vínculo --</option>';
              clientes.forEach(c => {
                  clienteSelect.innerHTML += `+"`<option value=\"${c.id}\">${c.nome}</option>`"+`;
              });
          }
          
          const responsavelSelect = document.getElementById('agendaResponsavel');
          if (responsavelSelect) {
              const vendedores = JSON.parse(localStorage.getItem('crmVendedores') || '[]');
              const usuarioLogado = sessionStorage.getItem('usuarioLogado') || 'Admin';
              
              responsavelSelect.innerHTML = '<option value="">Selecione...</option>';
              vendedores.forEach(v => {
                  const nome = v.user || v;
                  const selected = nome === usuarioLogado ? 'selected' : '';
                  responsavelSelect.innerHTML += `+"`<option value=\"${nome}\" ${selected}>${nome}</option>`"+`;
              });
          }
      }
"@

# Replace
$content = $content -replace $searchPattern, ($searchPattern + $newFunctions)

# Save
$content | Set-Content "C:\Users\Lucas Valério\Desktop\CRM\CRM.html" -NoNewline

Write-Host "✅ Funções de agendamento adicionadas com sucesso!"
"@
