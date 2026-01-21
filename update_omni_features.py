
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# New Omni Bar HTML with Minimize & Better Model Badge
new_omni_html = """
      <!-- OMNI-BAR (Unified & integrated, Floating) -->
      <div id="omni-trigger" class="omni-bar-container">
          <div class="omni-input-wrapper" style="box-shadow: none; border: none; background: transparent;">
              <i class="fas fa-search omni-icon"></i>
              <input type="text" id="omni-input" placeholder="Pergunte ao Panda ou busque ferramentas..." autocomplete="off">
              
              <!-- Model Selector (Dropdown Trigger) -->
              <div class="omni-model-badge" onclick="toggleModelSelector()" id="current-model-badge" title="Selecionar Modelo IA (Vertex AI Garden)">
                  <i class="fas fa-bolt"></i> <span id="model-name-text">Gemini Flash</span> <i class="fas fa-chevron-down" style="font-size:10px; opacity:0.6; margin-left:4px;"></i>
              </div>
              
              <div style="width:1px; height:16px; background:var(--border-subtle); margin:0 8px;"></div>
              
              <!-- Minimize Button -->
              <div class="omni-action-btn" onclick="minimizeOmniBar()" title="Minimizar">
                  <i class="fas fa-minus"></i>
              </div>
          </div>
          
          <!-- Results Container (Dropdown for Models or Search) -->
          <div id="omni-results" class="omni-results-dropdown" style="display: none;"></div>
      </div>
"""

# New CSS for the buttons
extra_css = """
<style>
/* New Omni Controls */
.omni-action-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 6px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s;
}
.omni-action-btn:hover {
    background: var(--bg-card-hover);
    color: var(--text-primary);
}
.omni-model-badge {
    /* Existing style override if needed */
    user-select: none;
}
</style>
"""

# JS for the new features
extra_js = """
<script>
    // Omni Bar Features
    function minimizeOmniBar() {
        // Logic to minimize: Scale down and move to corner, or hide and show a bubble
        // For now, let's just fade it out and show a refined notification or bubble (future)
        // User said: "when it minimizes ... opens the pop window"
        
        const bar = document.getElementById('omni-trigger');
        bar.style.transform = 'translate(-50%, 100vh)'; // Slide down off screen?
        bar.style.opacity = '0';
        
        // Show restore button (Mini Pop) - TODO: Implement the dedicated pop/bubble trigger
        // For now, let's allow Ctrl+K to restore
        setTimeout(() => {
             // Create or show a mini bubble? 
             // "vamos deixa o modo pop de fora" -> Maybe just hide it effectively.
        }, 300);
    }
    
    function toggleModelSelector() {
        const results = document.getElementById('omni-results');
        const isVisible = results.style.display !== 'none';
        
        if(isVisible) {
            results.style.display = 'none';
            return;
        }
        
        // Populate with Model Garden options
        const models = [
            {id: 'gemini-flash', name: 'Gemini 1.5 Flash', icon: 'fa-bolt', desc: 'Rápido e eficiente'},
            {id: 'gemini-pro', name: 'Gemini 1.5 Pro', icon: 'fa-brain', desc: 'Raciocínio complexo'},
            {id: 'claude-sonnet', name: 'Claude 3.5 Sonnet', icon: 'fa-feather', desc: 'Criatividade e código'},
            {id: 'imagen-3', name: 'Imagen 3', icon: 'fa-image', desc: 'Geração de imagens'}
        ];
        
        let html = '<div style="padding:8px;"><div style="font-size:11px; font-weight:600; color:var(--text-secondary); margin-bottom:8px; padding-left:8px;">MODEL GARDEN</div>';
        
        models.forEach(m => {
            html += `
            <div class="omni-item" onclick="selectModel('${m.name}')" style="padding:8px 12px; border-radius:8px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                <div style="width:24px; height:24px; background:var(--bg-app); border-radius:6px; display:flex; align-items:center; justify-content:center;">
                    <i class="fas ${m.icon}" style="font-size:12px;"></i>
                </div>
                <div>
                    <div style="font-size:13px; font-weight:500; color:var(--text-primary);">${m.name}</div>
                    <div style="font-size:11px; color:var(--text-secondary);">${m.desc}</div>
                </div>
                ${document.getElementById('model-name-text').innerText === m.name ? '<i class="fas fa-check" style="margin-left:auto; color:var(--accent-primary); font-size:12px;"></i>' : ''}
            </div>
            `;
        });
        
        html += '</div>';
        results.innerHTML = html;
        results.style.display = 'block';
    }
    
    function selectModel(name) {
        document.getElementById('model-name-text').innerText = name;
        document.getElementById('omni-results').style.display = 'none';
    }
</script>
"""


def update_omni_features():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. REMOVE PANDA FAB
    # Look for <div id="panda-fab" ...> ... </div>
    # Usually lines ~670 in original, but might be anywhere now.
    
    # Simple strategy: If line contains id="panda-fab", remove it and closing div.
    # We can be aggressive if it's a known single-line or small block.
    # Previous views showed it as:
    # <div id="panda-fab" class="panda-fab" onclick="toggleOmniBar()" ...>
    #   🐼
    # </div>
    
    # Let's use regex to remove the specific block
    content = re.sub(r'<div id="panda-fab"[^>]*>.*?</div>', '', content, flags=re.DOTALL)
    print("Removed Panda FAB.")

    # 2. UPDATE OMNI BAR HTML
    # We want to replace the `id="omni-trigger"` block we just moved to root.
    # We'll use the same trick as before or regex.
    # The new HTML `new_omni_html` has the same ID `omni-trigger` but new inner content.
    
    # Find start of #omni-trigger
    # Replace whole block
    
    # Regex for div id="omni-trigger" ... ending with </div>
    # Wait, regex for nested divs is impossible.
    # But we know the content structure from `release_window.py`.
    # It looked like:
    # <div id="omni-trigger" class="omni-bar-container">
    #     ...
    # </div>
    
    # We can Find the START string, and since it was just inserted cleanly, 
    # we can try to locate it.
    
    lines = content.splitlines()
    new_lines = []
    
    omni_bar_found = False
    inside_omni = False
    omni_indent = 0
    
    for line in lines:
        if 'id="omni-trigger"' in line and not omni_bar_found:
            omni_bar_found = True
            new_lines.append(new_omni_html)
            # We skip lines until we close this div
            inside_omni = True
            omni_indent = len(line) - len(line.lstrip())
            continue
        
        if inside_omni:
            curr_indent = len(line) - len(line.lstrip())
            if "</div>" in line and curr_indent == omni_indent:
                inside_omni = False # End of block
            continue
        
        new_lines.append(line)
    
    content = '\n'.join(new_lines)
    
    # 3. INJECT JS & CSS
    if "/* New Omni Controls */" not in content:
        content = content.replace("</head>", extra_css + "\n</head>")
        content = content.replace("</body>", extra_js + "\n</body>")
        print("Injected Scripts/Styles.")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    update_omni_features()
