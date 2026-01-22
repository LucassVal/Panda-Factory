
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# 1. Javascript for Tab Switching
settings_js = """
<script>
    // Settings Modal Logic
    function mudarSecaoSettings(sectionId) {
        // 1. Sidebar Active State
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('data-section') === sectionId) {
                item.classList.add('active');
            }
        });

        // 2. Hide all Sections
        document.querySelectorAll('.settings-section').forEach(sec => {
            sec.style.display = 'none';
        });

        // 3. Show Target Section
        const target = document.getElementById('settings-' + sectionId);
        if(target) {
            target.style.display = 'block';
            // Animation
            target.style.opacity = '0';
            target.style.transform = 'translateY(10px)';
            setTimeout(() => {
                target.style.opacity = '1';
                target.style.transform = 'translateY(0)';
            }, 50);
        }
    }

    // Toggle GPU Mock
    function toggleGPU() {
        const toggle = document.getElementById('gpuToggle');
        toggle.classList.toggle('active');
        const isActive = toggle.classList.contains('active');
        
        // Update Badge
        const badge = document.getElementById('gpuBadge');
        if(isActive) {
            badge.className = 'gpu-badge online';
            badge.innerHTML = '<span>⚡</span> RTX 3060 (Simulated)';
        } else {
            badge.className = 'gpu-badge offline';
            badge.innerHTML = '<span>⚠️</span> Nenhuma GPU detectada';
        }
    }
</script>
"""

# 2. HTML Update for GPU Section (Firebase ID)
gpu_section_html = """
            <!-- GPU Settings Section (Updated for Firebase Architecture) -->
            <div class="settings-section" id="settings-gpu" style="display:none;">
              <h2 class="settings-section-title">GPU & Agent Bridge</h2>
              <p class="settings-section-desc">Conecte o Agente Local via Firebase</p>
              
              <div class="settings-card">
                <div class="settings-row">
                  <div>
                    <div class="settings-label">Modo Agente Local (Rust)</div>
                    <div class="settings-sublabel">Processamento no seu hardware (0 tokens)</div>
                  </div>
                  <div class="toggle-switch" id="gpuToggle" onclick="toggleGPU()"></div>
                </div>
              </div>

              <!-- Firebase Config Input -->
              <div class="settings-card">
                  <div class="settings-row" style="display:block;">
                      <div class="settings-label" style="margin-bottom:8px;">Firebase Channel UID</div>
                      <input type="text" id="firebaseUidInput" placeholder="ex: user_123_abc" 
                             style="width:100%; background:#111; border:1px solid #333; color:#ccc; padding:10px; border-radius:6px; font-family:monospace;">
                      <div class="settings-sublabel" style="margin-top:6px;">Este ID conecta seu navegador ao Agente Rust.</div>
                  </div>
                  <div class="settings-row">
                      <button onclick="window.PandaBridge.connect(document.getElementById('firebaseUidInput').value)" 
                              style="width:100%; padding:10px; background:var(--accent-primary); border:none; color:white; border-radius:6px; cursor:pointer; font-weight:bold;">
                          💾 Salvar & Conectar
                      </button>
                  </div>
              </div>
              
              <div class="settings-card">
                <div class="settings-row">
                  <div class="settings-label">Status Panda Agent</div>
                  <div class="gpu-badge offline" id="agentBadge">
                    <span>🔴</span> Desconectado
                  </div>
                </div>
              </div>
              
              <div style="text-align:center; margin-top:20px;">
                <a href="#" style="color:#10b981; text-decoration:none;">📥 Baixar Panda Agent Installer (v2.0)</a>
              </div>
            </div>
"""

def fix_settings():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject JS logic
    if "function mudarSecaoSettings" not in content:
        content = content.replace("</body>", settings_js + "\n</body>")
        print("Injected Settings JS.")

    # 2. Replace GPU Section
    # Find start: <div class="settings-section" id="settings-gpu" style="display:none;">
    # Find end: <!-- Store Section -->
    start_marker = '<div class="settings-section" id="settings-gpu" style="display:none;">'
    end_marker = '<!-- Store Section -->'
    
    if start_marker in content and end_marker in content:
        # Simple extraction via split
        parts = content.split(start_marker)
        pre_gpu = parts[0]
        
        # The part after start marker contains the rest. Split by end_marker
        rest = parts[1]
        if end_marker in rest:
            gpu_content_end_idx = rest.find(end_marker)
            # The part *after* the GPU content
            post_gpu = rest[gpu_content_end_idx:]
            
            # Reassemble
            content = pre_gpu + gpu_section_html + "\n            " + post_gpu
            print("Updated GPU Section HTML.")
        else:
            print("Could not find end marker for GPU section")
    else:
        print("Could not find start marker for GPU section")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_settings()
