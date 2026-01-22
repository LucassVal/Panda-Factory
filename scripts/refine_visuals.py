
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# New CSS for Visual Refinements
visuals_css = """
      /* === VISUAL REFINEMENTS (Gradient Body + Logo Fix) === */
      
      body {
        /* Subtle Gradient Background for both modes */
        background: radial-gradient(circle at 50% 0%, var(--bg-app) 0%, var(--bg-card) 100%);
        /* Fallback if var not ready, but they are defined in root */
        background-color: var(--bg-app);
      }
      
      body.dark-mode {
        background: radial-gradient(circle at 50% 0%, #171717 0%, #0a0a0a 100%);
      }

      /* Header Refinement */
      .header {
        /* "Borda Externa" interpreted as strong separation */
        border-bottom: 1px solid var(--border-subtle);
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
      }
      
      /* LOGO ISOLATION FIX */
      .header h1 {
        display: flex; 
        align-items: center; 
        gap: 8px;
        color: var(--text-primary);
        font-size: 24px;
        font-weight: 700;
        letter-spacing: -0.02em;
        background: none !important; 
        -webkit-text-fill-color: initial !important; 
        /* Reset parent gradient usage */
      }
      
      /* Apply gradient ONLY to the Text Span (Panda Fábrica) */
      .header h1 span:last-child {
        background: linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-weight: 800;
      }
      
      /* Ensure Panda Emoji is normal */
      .header h1 span:first-child {
        font-size: 24px;
        filter: none;
        -webkit-text-fill-color: initial;
      }
"""

def refine_visuals():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Inject CSS
    if "/* === VISUAL REFINEMENTS (Gradient Body + Logo Fix) === */" not in content:
        content = content.replace("</head>", visuals_css + "\n</head>")
        print("Visual CSS Injected.")
    else:
        print("Visual CSS already present.")
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refine_visuals()
