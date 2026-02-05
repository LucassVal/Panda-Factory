
import os

# Caminho do arquivo
file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# Modal HTML Structure
modal_html = """
<div id="configModal" class="modal" style="display: none;">
    <div class="modal-content glass-panel" style="max-width: 600px; padding: 0;">
        <div class="modal-header" style="justify-content: space-between; padding: 15px 20px; border-bottom: 1px solid var(--border-color);">
            <h2 style="margin: 0; font-size: 1.2rem;">Configurações</h2>
            <span class="close-modal" onclick="fecharConfiguracoes()" style="cursor: pointer; font-size: 1.5rem;">&times;</span>
        </div>
        <div class="modal-body" style="padding: 0;">
            <div class="settings-container" style="display: flex; height: 400px;">
                <!-- Sidebar Navigation -->
                <div class="settings-sidebar" style="width: 150px; background: rgba(0,0,0,0.05); padding: 10px; border-right: 1px solid var(--border-color);">
                    <div class="setting-tab active" onclick="mudarSecaoSettings('geral', this)" style="padding: 10px; cursor: pointer; border-radius: 8px; margin-bottom: 5px;">Geral</div>
                    <div class="setting-tab" onclick="mudarSecaoSettings('aparencia', this)" style="padding: 10px; cursor: pointer; border-radius: 8px; margin-bottom: 5px;">Aparência</div>
                    <div class="setting-tab" onclick="mudarSecaoSettings('sistema', this)" style="padding: 10px; cursor: pointer; border-radius: 8px; margin-bottom: 5px;">Sistema</div>
                </div>

                <!-- Content Area -->
                <div class="settings-content" style="flex: 1; padding: 20px; overflow-y: auto;">
                    
                    <!-- Secao Geral -->
                    <div id="sec-geral" class="setting-section">
                        <h3>Informações</h3>
                        <div class="setting-item">
                            <label>Versão do Sistema</label>
                            <div style="opacity: 0.7;">Panda CRM v2.2 (Build 2024)</div>
                        </div>
                        <div class="setting-item" style="margin-top: 15px;">
                            <label>Usuário Atual</label>
                            <div id="configUserDisplay" style="font-weight: bold;">--</div>
                        </div>
                    </div>

                    <!-- Secao Aparencia -->
                    <div id="sec-aparencia" class="setting-section" style="display: none;">
                        <h3>Personalização</h3>
                        <div class="setting-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                            <label>Modo Escuro</label>
                            <button id="btnToggleDark" onclick="toggleDarkMode()" style="padding: 5px 15px; border-radius: 20px; border: 1px solid var(--border-color); cursor: pointer; background: var(--card-bg);">Alternar</button>
                        </div>
                        <div class="setting-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; opacity: 0.5;">
                            <label>Cor de Destaque (Em breve)</label>
                            <div style="width: 20px; height: 20px; background: #00E676; border-radius: 50%;"></div>
                        </div>
                    </div>

                    <!-- Secao Sistema -->
                    <div id="sec-sistema" class="setting-section" style="display: none;">
                        <h3>Performance & Dados</h3>
                        <div class="setting-item" style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                            <label>GPU Acceleration (Cloud)</label>
                            <label class="switch">
                              <input type="checkbox" id="gpuToggle" onchange="toggleGPU(this)">
                              <span class="slider round"></span>
                            </label>
                        </div>
                        <p style="font-size: 0.8rem; opacity: 0.7; margin-bottom: 20px;">Use recursos da sua GPU local ou alugue poder computacional para tarefas pesadas.</p>
                        
                        <div style="border-top: 1px solid var(--border-color); margin: 10px 0;"></div>
                        
                        <button onclick="limparCacheSistema()" style="background: #ff4757; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer; width: 100%;">Limpar Cache & Reiniciar</button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</div>
"""

# CSS Injection
css_fixes = """
<style>
/* Settings Modal Specifics */
.glass-panel {
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    border-radius: 12px;
}

.setting-tab:hover {
    background: rgba(0,0,0,0.1);
}
.setting-tab.active {
    background: var(--primary-color, #00E676);
    color: #000;
    font-weight: bold;
}

/* Toggle Switch */
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
}
.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}
input:checked + .slider {
  background-color: var(--primary-color, #00E676);
}
input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}
.slider.round {
  border-radius: 34px;
}
.slider.round:before {
  border-radius: 50%;
}
</style>
"""

# JS Logic
js_logic = """
<script>
// --- Settings Modal Logic ---

function abrirConfiguracoes() {
    const modal = document.getElementById('configModal');
    if(modal) {
        modal.style.display = 'block'; // Or 'flex' depending on CSS
        
        // Load User Info
        const user = JSON.parse(sessionStorage.getItem('usuarioAtual')) || { nome: 'Visitante' };
        const display = document.getElementById('configUserDisplay');
        if(display) display.innerText = user.nome;

        // Load GPU State
        const gpuState = localStorage.getItem('gpuEnabled') === 'true';
        const gpuCheck = document.getElementById('gpuToggle');
        if(gpuCheck) gpuCheck.checked = gpuState;
    }
}

function fecharConfiguracoes() {
    const modal = document.getElementById('configModal');
    if(modal) modal.style.display = 'none';
}

function mudarSecaoSettings(secaoId, tabElement) {
    // Hide all sections
    document.querySelectorAll('.setting-section').forEach(el => el.style.display = 'none');
    
    // Show target section
    const target = document.getElementById('sec-' + secaoId);
    if(target) target.style.display = 'block';
    
    // Update Tabs
    document.querySelectorAll('.setting-tab').forEach(el => el.classList.remove('active'));
    tabElement.classList.add('active');
}

function toggleGPU(checkbox) {
    localStorage.setItem('gpuEnabled', checkbox.checked);
    // Visual feedback or logic trigger could go here
    console.log('GPU Acceleration:', checkbox.checked ? 'ON' : 'OFF');
}

function limparCacheSistema() {
    if(confirm('Tem certeza? Isso fará logout e limpará as configurações locais.')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload();
    }
}

// Ensure Modal closes on outside click (Generic)
window.addEventListener('click', function(event) {
    const modal = document.getElementById('configModal');
    if (event.target == modal) {
        fecharConfiguracoes();
    }
});

</script>
"""

def inject_settings():
    if not os.path.exists(file_path):
        print("Erro: CRM.html nao encontrado.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject CSS (before </head>)
    if "/* Settings Modal Specifics */" not in content:
        content = content.replace("</head>", css_fixes + "\n</head>")
        print("CSS Injected.")
    else:
        print("CSS already present.")

    # 2. Inject HTML (before </body>)
    if 'id="configModal"' not in content:
        content = content.replace("</body>", modal_html + "\n</body>")
        print("HTML Modal Injected.")
    else:
        print("HTML Modal already present.")

    # 3. Inject JS (before </body>)
    if "function abrirConfiguracoes()" not in content:
        content = content.replace("</body>", js_logic + "\n</body>")
        print("JS Logic Injected.")
    else:
        print("JS Logic already present.")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    inject_settings()
