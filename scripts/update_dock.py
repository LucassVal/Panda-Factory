
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# CSS for the Close Badge
css_styles = """
<style>
/* ... Dock Styles ... */
.nav-item {
    position: relative; /* For badge positioning */
}

/* Close Badge (X) */
.dock-close-badge {
    position: absolute;
    top: -5px;
    right: -5px;
    width: 16px;
    height: 16px;
    background: rgba(239, 68, 68, 0.8); /* Red translucent */
    color: white;
    font-size: 10px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    opacity: 0; /* Hidden by default */
    transition: all 0.2s ease;
    z-index: 10;
}

.nav-item:hover .dock-close-badge {
    opacity: 1; /* Show on hover */
    transform: scale(1.1);
}

.dock-close-badge:hover {
    background: rgba(220, 38, 38, 1); /* Solid red on hover */
}
</style>
"""

dock_html_update = """
      <div class="app-dock" id="appDock">
        <!-- Drag Handle -->
        <div class="dock-handle" id="dockHandle" title="Arrastar">
          <span></span><span></span><span></span>
        </div>
        
        <!-- Dyanmic Items Container -->
        <div id="appDockItems" style="display:flex; flex-direction:column; gap:12px;">
            <!-- JS will populate this -->
        </div>

        <div class="nav-separator"></div>
        
        <div class="nav-item" onclick="abrirConfiguracoes()" title="Configurações">⚙️</div>
        <div class="nav-item logout-btn" onclick="fazerLogout()" title="Sair">🚪</div>
      </div>
"""

script_import = '<script type="module" src="js/ModuleLoader.js"></script>'

def update_crm():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject CSS
    # Add before </head>
    if "dock-close-badge" not in content:
        content = content.replace("</head>", css_styles + "\n</head>")
        print("Injected CSS.")

    # 2. Update Dock HTML
    # We replace the static dock lines with our container
    # Simple strategy: Find the dock div and replace its inner content or just replace the whole block if clean.
    # Lines 2208-2223 roughly.
    start_marker = '<div class="app-dock" id="appDock">'
    end_marker = '<div class="nav-item logout-btn" onclick="fazerLogout()" title="Sair">🚪</div>'
    
    start_idx = content.find(start_marker)
    if start_idx != -1:
        # Find the closing div of the dock... roughly line 2223.
        # But wait, I have a clear end marker string on line 2222/2223.
        end_idx = content.find(end_marker, start_idx)
        if end_idx != -1:
            # We must include the closing </div> of the dock
            dock_end = content.find('</div>', end_idx) + 6
            
            # Replace
            content = content[:start_idx] + dock_html_update + content[dock_end:]
            print("Updated Dock HTML.")
    
    # 3. Inject Script Import
    if "js/ModuleLoader.js" not in content:
        content = content.replace("</body>", script_import + "\n</body>")
        print("Injected Module Loader Script.")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    update_crm()
