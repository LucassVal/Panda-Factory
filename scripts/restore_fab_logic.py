
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# 1. HTML for the FAB (Hidden by default, assuming Bar starts Open)
fab_html = """
    <!-- Restored Panda FAB (Pop-up Trigger) -->
    <div id="panda-fab" class="panda-fab" onclick="toggleOmniBar()" title="Falar com Panda Assistant" style="display: none;">
        🐼
    </div>
"""

# 2. Updated JS Logic for Toggle (Minimize <-> FAB)
toggle_js = """
<script>
    // State: Start with Bar Open, FAB Hidden (or logic choice)
    // User wants: Minimize -> Show FAB. Click FAB -> Show Bar.
    
    function minimizeOmniBar() {
        // Animation Out
        const bar = document.getElementById('omni-trigger');
        bar.style.opacity = '0';
        bar.style.transform = 'translate(-50%, 20px) scale(0.95)';
        
        setTimeout(() => {
            bar.style.display = 'none';
            // Show FAB
            const fab = document.getElementById('panda-fab');
            fab.style.display = 'flex';
            // Small animation for FAB pop
            fab.style.transform = 'scale(0)';
            setTimeout(() => fab.style.transform = 'scale(1)', 50);
        }, 200);
    }
    
    // This function might already exist, we override or ensure it handles the FAB
    window.toggleOmniBar = function() {
        const bar = document.getElementById('omni-trigger');
        const fab = document.getElementById('panda-fab');
        
        // If bar is hidden, show it
        if (bar.style.display === 'none') {
            fab.style.transform = 'scale(0)';
            setTimeout(() => fab.style.display = 'none', 200);
            
            bar.style.display = 'flex'; // Was flex due to new layout? Or block?
            // .omni-bar-container is flex column? Let's check CSS. 
            // Usually 'flex' if it has flex children, or 'block' with display:flex inside.
            // The injected CSS had .omni-bar-container { display: flex; flex-direction: column; ... }
            
            setTimeout(() => {
                bar.style.opacity = '1';
                bar.style.transform = 'translate(-50%, 0) scale(1)'; // Assuming centered fixed pos
            }, 50);
            
            // Focus input
            setTimeout(() => document.getElementById('omni-input').focus(), 100);
            
        } else {
            // If open, close it? Or do nothing? 
            // Usually toggle means toggle. But minimize button calls minimizeOmniBar specifically.
            // FAB calls this. So FAB click -> Show Bar.
            // Ctrl+K -> Toggle.
            minimizeOmniBar();
        }
    };
    
    // Ensure Minimize Icon is Visible (Force Color fix if needed)
    // Injected styles handle it, but let's be safe.
</script>
"""

# 3. CSS Fix for Minimize Icon & FAB
fix_css = """
<style>
/* Ensure Minimize Icon Contrast */
.omni-action-btn i.fa-minus {
    color: var(--text-secondary);
    font-size: 14px;
}
/* Ensure FAB is above Dock */
#panda-fab {
    z-index: 6000;
    bottom: 120px; /* Above dock */
    right: 30px;
    position: fixed;
    /* Ensure other styles from previous CSS apply, providing generic .panda-fab exists */
}
</style>
"""

def restore_fab():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject FAB HTML
    # Put it near the Omni Bar or Dock.
    if 'id="panda-fab"' not in content:
        # Insert before #appDock
        if 'id="appDock"' in content:
            content = content.replace('<div class="app-dock" id="appDock">', fab_html + '\n      <div class="app-dock" id="appDock">')
            print("Injected Panda FAB HTML.")
        else:
            print("Could not find #appDock to anchor FAB.")

    # 2. Inject JS Logic (Overwrite or Append)
    # We'll append close to body end to override previous definitions.
    content = content.replace("</body>", toggle_js + "\n</body>")

    # 3. Inject CSS Fixes
    content = content.replace("</head>", fix_css + "\n</head>")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Restored FAB Logic.")

if __name__ == "__main__":
    restore_fab()
