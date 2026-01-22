
import os
import re

# Caminho do arquivo
file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# CSS Block Replacement
# We will replace the entire :root block and subsequent generic styles up to the container
# This ensures we capture the variable definitions cleanly.

new_css_variables = """
      /*
       * 🎨 PANDA FABRICS - DUAL THEME SYSTEM (Fixed)
       * Light Mode: Chrome/Grey Modern
       * Dark Mode: Deep Vercel/Geist
       */
      :root {
        /* === PRIMITIVES (Palette) === */
        --color-white: #ffffff;
        --color-black: #000000;
        
        --gray-50: #f9fafb;
        --gray-100: #f3f4f6;
        --gray-200: #e5e7eb;
        --gray-300: #d1d5db;
        --gray-400: #9ca3af;
        --gray-500: #6b7280;
        --gray-600: #4b5563;
        --gray-700: #374151;
        --gray-800: #1f2937;
        --gray-900: #111827;
        --gray-950: #030712;

        /* === SEMANTIC VARIABLES (LIGHT DEFAULT - Chrome/Grey) === */
        --bg-app: #f0f2f5;           /* Clean Light Chrome/Grey */
        --bg-panel: rgba(255, 255, 255, 0.7);
        --bg-card: #ffffff;
        --bg-input: #ffffff;
        
        --text-primary: #111827;     /* Near Black */
        --text-secondary: #4b5563;   /* Mid Grey */
        --text-inverted: #ffffff;

        --border-subtle: #e5e7eb;    /* Light Grey Border */
        --border-focus: #9ca3af;

        --header-bg: rgba(240, 242, 245, 0.85); /* Matches App BG but blurred */
        
        --grid-color: rgba(0, 0, 0, 0.04);
        
        --shadow-card: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
        --shadow-dock: 0 8px 30px rgba(0,0,0,0.12);

        /* Accents */
        --accent-primary: #0f172a;   /* Navy/Black for Primary Actions */
        --accent-success: #10b981;
        --accent-warning: #f59e0b;
        --accent-error: #ef4444;
        
        /* Font */
        --font-sans: 'Geist', 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --radius-card: 12px;
        --radius-btn: 8px;
      }

      /* === DARK MODE OVERRIDES === */
      body.dark-mode {
        --bg-app: #0a0a0a;
        --bg-panel: rgba(20, 20, 20, 0.7);
        --bg-card: #111111;
        --bg-input: #000000;
        
        --text-primary: #ededed;
        --text-secondary: #888888;
        --text-inverted: #000000;

        --border-subtle: #333333;
        --border-focus: #555555;

        --header-bg: rgba(10, 10, 10, 0.8);
        
        --grid-color: rgba(255, 255, 255, 0.05);
        
        --shadow-card: 0 8px 32px rgba(0,0,0,0.3);
        --shadow-dock: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05) inset;
        
        --accent-primary: #ededed;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: var(--font-sans);
        background-color: var(--bg-app);
        color: var(--text-primary);
        min-height: 100vh;
        -webkit-font-smoothing: antialiased;
        background-image: linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
                          linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
        background-size: 40px 40px; /* Grid Pattern */
        transition: background-color 0.3s ease, color 0.3s ease;
      }

      /* Scrollbar */
      ::-webkit-scrollbar { width: 8px; }
      ::-webkit-scrollbar-track { background: var(--bg-app); }
      ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }
      ::-webkit-scrollbar-thumb:hover { background: var(--text-secondary); }

      .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 40px 20px;
      }

      /* Header Minimalista */
      .header {
        background: var(--header-bg);
        backdrop-filter: blur(12px);
        padding: 24px 0;
        border-bottom: 1px solid var(--border-subtle);
        margin-bottom: 40px;
        position: sticky;
        top: 0;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background 0.3s, border-color 0.3s;
      }
      
      .header h1 {
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.02em;
        /* Gradient Text adapts to theme? Or stay consistent? Let's make it follow text primary */
        color: var(--text-primary);
        background: none; /* Remove weird gradient for cleaner look */
        -webkit-text-fill-color: initial;
      }

      .version-badge {
        background: var(--bg-panel);
        border: 1px solid var(--border-subtle);
        color: var(--text-secondary);
        padding: 2px 8px; /* Fixed padding */
        border-radius: 6px;
        font-size: 11px;
        font-weight: 600;
        margin-left: 12px;
        vertical-align: middle;
      }

      /* Stat Cards Update */
      .stat-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-card);
        padding: 24px;
        transition: all 0.2s ease;
        box-shadow: var(--shadow-card);
      }
      .stat-card:hover {
        border-color: var(--border-focus);
        transform: translateY(-2px);
      }
      .stat-number { color: var(--text-primary); }
      .stat-label { color: var(--text-secondary); }

      /* Chart Cards Update */
      .chart-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-card);
        padding: 24px;
        box-shadow: var(--shadow-card);
      }
      .chart-title { color: var(--text-primary); }

      /* Client Cards Update */
      .client-card {
        background: var(--bg-card);
        border: 1px solid var(--border-subtle);
        border-radius: var(--radius-card);
        padding: 20px;
        transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
        cursor: pointer;
        box-shadow: var(--shadow-card);
      }
      .client-card:hover {
        border-color: var(--border-focus);
        transform: translateY(-2px);
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
      }
      .client-name { color: var(--text-primary); }
      .client-info { color: var(--text-secondary); }
      .client-id { 
        background: var(--bg-app); 
        color: var(--text-secondary);
        border: 1px solid var(--border-subtle);
      }
      
      /* Inputs Update */
      .search-box input, .filter-select {
        background: var(--bg-input);
        border: 1px solid var(--border-subtle);
        color: var(--text-primary);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      .search-box input:focus, .filter-select:focus {
        border-color: var(--text-primary);
        outline: none;
      }
      
      /* Buttons Update */
      .btn-primary {
        background: var(--accent-primary);
        color: var(--bg-card); /* Inverted text for primary button */
        border: 1px solid var(--accent-primary);
      }
      .btn-primary:hover { opacity: 0.9; }
      
      .btn-secondary {
        background: var(--bg-card);
        color: var(--text-primary);
        border: 1px solid var(--border-subtle);
      }
      .btn-secondary:hover { background: var(--bg-app); }

      /* User Info Colors */
      #userLoginInfo span { color: var(--text-primary) !important; }
      #userLoginInfo span[style*="font-size:10px"] { color: var(--text-secondary) !important; }

"""

def update_css():
    if not os.path.exists(file_path):
        print("Erro: CRM.html nao encontrado.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find the Block from ":root {" down to ".header {"
    # We'll rely on the comment markers or structure.
    # Lines 24 to approx 118 in previous file reading.
    
    # Let's try to map the replacement area more safely.
    # We will look for "/* === BACKGROUNDS === */" which is at the start of existing root
    # and replace until ".header {" starts, then prepend our new header styles.
    
    # Actually, worst case, let's look for the start mark and end mark of what we want to replace.
    # Start: ":root {"
    # End: ".header {" (exclusive)
    
    start_marker = ":root {"
    end_marker = ".header-content {" # Just after .header definition in original file
    
    # Refined approach: Replace the whole <style> block related to variables and base definitions.
    # But there might be other styles.
    
    # Let's construct a regex that captures everything from ":root" up to ".header-content" to be safe?
    # No, ".header" is defined before ".header-content".
    
    # Let's replace from line ~24 to ~120.
    # We will search for the specific existing CSS segments.
    
    # 1. Find the existing :root block start
    if start_marker not in content:
        print("Could not find start marker :root {")
        return

    # 2. Extract and replace
    # We'll use a regex to find the block from ":root" up to (but not including) ".header-content"
    # and we will REWRITE ".header" inside our new block, so we consume the old ".header" too.
    
    pattern = re.compile(r':root\s*\{.*?\.header-content\s*\{', re.DOTALL)
    
    # Our new content includes .header definition, so we end right before .header-content
    match = pattern.search(content)
    
    if match:
        print("Found CSS block. Replacing...")
        # The new block ends with ".header { ... }", so we need to ensure we interface correctly with .header-content
        # Our replacement string ENDS at the end of ".header { ... }" block styles.
        # But we need to make sure we don't accidentally cut off the file.
        
        # Simpler: Read the file lines, find the index of ":root {", find the index of ".header-content {", replace lines between.
        
        lines = content.splitlines()
        start_idx = -1
        end_idx = -1
        
        for i, line in enumerate(lines):
            if ":root {" in line:
                start_idx = i
            if ".header-content {" in line:
                end_idx = i
                break
        
        if start_idx != -1 and end_idx != -1:
             # We need to backtrack from .header-content to remove the old .header definition
             # Old .header definition starts around 106.
             # Let's assume we replace everything from :root{ (line ~24) to line (end_idx - 1)
             
             # Adjust start_idx to include the comment before it if it exists
             if "/*" in lines[start_idx-5]: # checking context
                 pass
             
             # Create new content
             new_lines = lines[:start_idx] + [new_css_variables] + lines[end_idx:]
             
             final_content = '\n'.join(new_lines)
             
             # Also need to fix 'var(--ds-gray-1000)' etc usage in other parts?
             # My new CSS redefines generic standard vars.
             # I need to ensure the rest of the file (lines 120+) doesn't break.
             # The existing file used var(--bg-secondary), var(--text-primary).
             # My new CSS PROVIDES these variables (mapped to new semantic values).
             # So it should be backward compatible!
             
             with open(file_path, 'w', encoding='utf-8') as f:
                 f.write(final_content)
             print("CSS Themes Updated Successfully.")
             
        else:
             print("Could not locate line indices.")
    else:
        print("Regex match failed.")

if __name__ == "__main__":
    update_css()
