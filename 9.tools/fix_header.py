
import os

file_path = "CRM.html"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. NEW HEADER HTML
# Cleaner, flexbox-based, with IDs preserved for JS compatibility
new_header = '''
      <div class="header" style="display: flex; justify-content: space-between; align-items: center; padding: 15px 25px; border-bottom: 1px solid var(--ds-gray-alpha-400); background: var(--ds-background-100);">
        <!-- LEFT: Brand -->
        <div style="display: flex; align-items: center; gap: 12px;">
           <h1 style="margin:0; font-size:24px; display:flex; align-items:center; gap:8px; color: var(--ds-gray-1000);">
             <span>🐼</span> 
             <span style="font-weight:700; letter-spacing:-0.5px;">Panda Fábrica</span>
           </h1>
           <span class="version-badge">v2.2</span>
        </div>

        <!-- RIGHT: Controls -->
        <div class="header-controls" style="display:flex; align-items:center; gap:20px;">
           
           <!-- Energy Bar (Row Layout) -->
           <div class="energy-wrapper" title="Créditos de IA">
               <span class="energy-icon">⚡</span>
               <div class="energy-bar-container">
                   <div class="energy-fill" id="aiEnergyFill" style="width: 100%;"></div>
               </div>
               <span class="energy-text" id="aiEnergyText">100%</span>
           </div>

           <!-- Theme Toggle -->
           <button class="theme-toggle-btn" onclick="toggleDarkMode()" title="Alternar Tema Escuro/Claro">
              <span id="themeIcon">🌙</span>
           </button>

           <!-- User Info -->
           <div style="display:flex; align-items:center; gap:10px; border-left: 1px solid var(--ds-gray-alpha-400); padding-left: 20px;">
              <div id="userLoginInfo" style="text-align:right;">
                  <!-- JS Injects User Name here -->
                  <div style="font-weight:600; color:var(--ds-gray-1000); font-size:13px;">Carregando...</div>
              </div>
           </div>
        </div>
      </div>
'''

# 2. CSS & JS For Header
header_assets = '''
<style>
/* HEADER REFINEMENTS */
.version-badge {
    background: var(--ds-gray-200); color: var(--ds-gray-1000);
    padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600;
    vertical-align: middle; border: 1px solid var(--ds-gray-alpha-400);
}

.energy-wrapper {
    display: flex; align-items: center; gap: 10px;
    background: var(--ds-background-200); padding: 5px 12px; border-radius: 99px;
    border: 1px solid var(--ds-gray-alpha-400); height: 34px; box-sizing: border-box;
}
.energy-bar-container {
    width: 60px; height: 6px; background: var(--ds-gray-300); border-radius: 3px; overflow: hidden;
}
.energy-fill {
    height: 100%; background: linear-gradient(90deg, #10b981, #3b82f6);
    transition: width 0.5s ease;
}
.energy-text { font-size: 12px; font-weight: 600; color: var(--ds-gray-1000); min-width: 35px; text-align:right; }

.theme-toggle-btn {
    background: transparent; border: 1px solid var(--ds-gray-alpha-400);
    width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 16px; transition: all 0.2s; color: var(--ds-gray-1000);
}
.theme-toggle-btn:hover { background: var(--ds-gray-200); }

/* User Info Styles Injection Helper */
#userLoginInfo span { color: var(--ds-gray-1000) !important; }
#userLoginInfo span[style*="font-size:10px"] { color: var(--ds-gray-500) !important; }
</style>

<script>
  function toggleDarkMode() {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');
      localStorage.setItem('crmTheme', isDark ? 'dark' : 'light');
      
      // Update Icon
      const icon = document.getElementById('themeIcon');
      if(icon) icon.textContent = isDark ? '☀️' : '🌙';
  }

  // Auto-load theme
  (function() {
      const saved = localStorage.getItem('crmTheme');
      if(saved === 'dark') {
          document.body.classList.add('dark-mode');
          const icon = document.getElementById('themeIcon');
          if(icon) icon.textContent = '☀️';
      }
  })();
</script>
'''

# 3. REPLACE HEADER
# Locating the old header. It starts with <div class="header"
header_start_marker = '<div class="header"'
start_idx = content.find(header_start_marker)

if start_idx != -1:
    # Find the closing div for the header.
    # Header contains: 
    #   div (title) -> h1, p
    #   div (controls) -> div (energy) -> div, div, span / span (user) -> div
    # It's safer to look for the next section start "<!-- Conteúdo Principal" or just "wrapper"
    # Or count divs. 
    
    # Let's count matching divs.
    depth = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i:i+4] == '<div':
            depth += 1
        elif content[i:i+5] == '</div':
            depth -= 1
            if depth == 0:
                end_idx = i + 6 # Include </div>
                break
    
    if end_idx != -1:
        print("Header Block Found. Replacing...")
        # Inject Assets first
        content = header_assets + "\n" + content[:start_idx] + new_header + content[end_idx:]
        
        # NOTE: Replacing the header might duplicate style block if I prepend it.
        # Better to put style/script at end of body.
        # Let's move header_assets to end of body.
        pos_body = content.rfind("</body>")
        content = content[:pos_body] + header_assets + content[pos_body:]
        
        # Now replace header
        # Re-calculate index because we modified content length? 
        # Wait, I did `content = header_assets + ...` - NO, checking logic above.
        
        # Correct logic:
        # 1. Replace Header in original string
        # 2. Append Assets to end
        
        # Reset content
        with open(file_path, "r", encoding="utf-8") as f: content = f.read()
        
        # Re-calc indices
        start_idx = content.find(header_start_marker)
        depth = 0
        end_idx = -1
        for i in range(start_idx, len(content)):
            if content[i:i+4] == '<div':
                depth += 1
            elif content[i:i+5] == '</div':
                depth -= 1
                if depth == 0:
                    end_idx = i + 6
                    break

        new_content_start = content[:start_idx] + new_header + content[end_idx:]
        pos_body = new_content_start.rfind("</body>")
        final_content = new_content_start[:pos_body] + header_assets + new_content_start[pos_body:]
        
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(final_content)
        print("Header Fixed.")
    else:
        print("Could not find end of header div.")
else:
    print("Header start not found.")
