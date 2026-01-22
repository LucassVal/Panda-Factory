
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# Improved Omni HTML
# - Includes Ctrl+K badge (Restored)
# - Includes Chat Expansion Area
# - Ensures Minimize button visibility
fixed_omni_html = """
    <!-- OMNI-BAR (Unified & integrated, Floating) -->
    <div id="omni-trigger" class="omni-bar-container">
        <!-- Input Area -->
        <div class="omni-input-wrapper" style="box-shadow: none; border: none; background: transparent;">
            <i class="fas fa-search omni-icon"></i>
            <input type="text" id="omni-input" placeholder="Pergunte ao Panda ou busque ferramentas..." autocomplete="off">
            
            <!-- Shortcut (Restored inside wrapper) -->
            <span class="omni-shortcut-badge" style="margin-right: 8px;">Ctrl + K</span>
            
            <!-- Model Selector -->
            <div class="omni-model-badge" onclick="toggleModelSelector()" id="current-model-badge" title="Selecionar Modelo IA">
                <i class="fas fa-bolt"></i> <span id="model-name-text">Gemini Flash</span> <i class="fas fa-chevron-down" style="font-size:10px; opacity:0.6; margin-left:4px;"></i>
            </div>
            
            <div style="width:1px; height:16px; background:var(--border-subtle); margin:0 8px;"></div>
            
            <!-- Minimize Button -->
            <div class="omni-action-btn" onclick="minimizeOmniBar()" title="Minimizar">
                <i class="fas fa-minus"></i>
            </div>
        </div>
        
        <!-- Results / Model Dropdown -->
        <div id="omni-results" class="omni-results-dropdown" style="display: none;"></div>
        
        <!-- Chat Expansion Window (Converstation Area) -->
        <div id="omni-chat-expansion" class="omni-chat-area" style="display:none;">
            <div class="chat-placeholder" style="color:var(--text-secondary); text-align:center; padding:20px; font-size:13px;">
                <i class="fas fa-sparkles" style="color:var(--accent-primary); margin-bottom:8px; font-size:16px;"></i><br>
                Panda IA pronta para conversar.
            </div>
        </div>
    </div>
"""

# Additional CSS suitable for Chat Expansion
chat_css = """
<style>
/* Chat Expansion Styles */
.omni-chat-area {
    border-top: 1px solid var(--border-subtle);
    background: rgba(0,0,0,0.02);
    min-height: 150px;
    max-height: 500px;
    overflow-y: auto;
    padding: 15px;
    display: none; /* Hidden by default */
    animation: slideDown 0.2s ease-out;
}
@keyframes slideDown {
    from { height: 0; opacity: 0; }
    to { height: 150px; opacity: 1; }
}

/* Ensure minimize button is visible */
.omni-action-btn i {
    color: var(--text-secondary); /* Ensure contrast */
}
</style>
"""

# Update JS to handle Chat Expansion (Toggle for demo?)
chat_js = """
<script>
    // Extend Omni Input to show chat on Enter
    document.getElementById('omni-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.value.trim()) {
            // Show chat window
            const chatArea = document.getElementById('omni-chat-expansion');
            chatArea.style.display = 'block';
            
            // Add user message (Demo)
            const msg = document.createElement('div');
            msg.innerHTML = `<div style="text-align:right; margin-bottom:10px;"><span style="background:var(--accent-primary); color:white; padding:6px 12px; border-radius:12px 12px 0 12px; font-size:14px;">${e.target.value}</span></div>`;
            chatArea.appendChild(msg);
            
            // Simulate Reply
            setTimeout(() => {
                 const reply = document.createElement('div');
                 reply.innerHTML = `<div style="text-align:left; margin-bottom:10px; display:flex; gap:8px;">
                    <div style="font-size:20px;">🐼</div>
                    <div style="background:var(--bg-card); border:1px solid var(--border-subtle); padding:8px 12px; border-radius:12px 12px 12px 0; font-size:14px; color:var(--text-primary);">Processando sua solicitação... <br><span style="font-size:11px; opacity:0.7;">(Conectado ao Gemini Flash)</span></div>
                 </div>`;
                 chatArea.appendChild(reply);
                 chatArea.scrollTop = chatArea.scrollHeight;
            }, 600);
            
            e.target.value = ''; // Clear
        }
    });
</script>
"""

def fix_omni_layout():
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Replace the entire #omni-trigger block again
    # We use the previous approach: Find start and end.
    
    # We know the ID is id="omni-trigger"
    lines = content.splitlines()
    new_lines = []
    
    in_block = False
    block_indent = 0
    replaced = False
    
    for line in lines:
        if 'id="omni-trigger"' in line and not replaced:
            in_block = True
            block_indent = len(line) - len(line.lstrip())
            new_lines.append(fixed_omni_html)
            replaced = True
            continue
        
        if in_block:
            curr_indent = len(line) - len(line.lstrip())
            # Check for closing div.
            # Assuming standard indentation structure
            if "</div>" in line and curr_indent == block_indent:
                in_block = False
            continue
            
        new_lines.append(line)
        
    content = '\n'.join(new_lines)
    
    # 2. Inject CSS/JS
    if "/* Chat Expansion Styles */" not in content:
        content = content.replace("</head>", chat_css + "\n</head>")
        content = content.replace("</body>", chat_js + "\n</body>")
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Omni Layout Fixed.")

if __name__ == "__main__":
    fix_omni_layout()
