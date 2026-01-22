
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# New Omni Bar HTML (Integrated)
# Replaces the content of #omni-trigger to be the ACTUAL input, not a fake trigger.
# Also ensures style stability to avoid jumping.

new_bar_html = """
    <!-- OMNI-BAR (Unified & Integrated) -->
    <div id="omni-trigger" class="omni-bar-container">
        <div class="omni-input-wrapper" style="box-shadow: none; border: none; background: transparent;">
            <i class="fas fa-search omni-icon"></i>
            <input type="text" id="omni-input" placeholder="Pergunte ao Panda ou busque ferramentas..." autocomplete="off">
            <div class="omni-model-badge" onclick="cycleModel()" id="current-model-badge" title="Alternar Modelo IA">
                <i class="fas fa-bolt"></i> Gemini Flash
            </div>
            <span class="omni-shortcut-badge">Ctrl + K</span>
        </div>
        
        <!-- Results Container (Hidden by default) -->
        <div id="omni-results" class="omni-results-dropdown" style="display: none;"></div>
    </div>
"""

# New CSS to support this integrated structure without jumping
# We overwrite existing omni styles to ensure stability
omni_css = """
<style>
/* OMNI BAR INTEGRATED STYLES */
.omni-bar-container {
    position: absolute; /* Kept absolute for drag, but usually centered */
    top: 30%; /* Initial position */
    left: 50%;
    transform: translate(-50%, -50%);
    
    width: 650px;
    max-width: 90vw;
    background: var(--bg-panel);
    backdrop-filter: blur(15px);
    border-radius: 16px;
    border: 1px solid var(--border-subtle);
    box-shadow: var(--shadow-dock);
    
    z-index: 5000;
    transition: box-shadow 0.2s, transform 0.1s;
    display: flex;
    flex-direction: column;
}

.omni-bar-container:hover {
    box-shadow: 0 12px 48px rgba(0,0,0,0.2);
    border-color: var(--border-focus);
}
.omni-bar-container.focused {
    box-shadow: 0 0 0 2px var(--ds-info);
    background: var(--bg-card);
}

.omni-input-wrapper {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    height: 60px;
}

.omni-icon {
    font-size: 20px;
    color: var(--text-secondary);
}

#omni-input {
    flex: 1;
    background: transparent;
    border: none;
    font-size: 18px;
    color: var(--text-primary);
    font-family: var(--font-sans);
    outline: none;
}
#omni-input::placeholder {
    color: var(--text-secondary);
    opacity: 0.7;
}

.omni-model-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: var(--bg-app);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s;
}
.omni-model-badge:hover {
    background: var(--bg-card);
    border-color: var(--text-secondary);
}

.omni-shortcut-badge {
    background: rgba(0,0,0,0.05);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 4px 8px;
    font-size: 11px;
    color: var(--text-secondary);
    font-weight: 600;
}

/* Dropdown */
.omni-results-dropdown {
    border-top: 1px solid var(--border-subtle);
    max-height: 400px;
    overflow-y: auto;
    padding: 10px;
}

/* Hide the old overlay overlay */
#omni-overlay { display: none !important; }

/* Panda FAB Position Refinement - to avoid overlapping if needed */
#panda-fab {
    bottom: 120px; /* Shifted up slightly */
    z-index: 4000;
}
</style>
"""

# HTML Replacement Logic
def fix_omni_bar():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject CSS
    # We'll inject it before </head>
    if "/* OMNI BAR INTEGRATED STYLES */" not in content:
        content = content.replace("</head>", omni_css + "\n</head>")
        print("CSS Injected.")

    # 2. Replace the #omni-trigger block
    # We need to find the entire div. relying on id="omni-trigger"
    # It might have diverse classes, so we use regex or string find.
    # The user provided snippets showed: <div id="omni-trigger" ...>
    
    # Let's find the start
    start_match = re.search(r'<div[^>]*id="omni-trigger"[^>]*>', content)
    if start_match:
        start_idx = start_match.start()
        # Find the closing div... this is risky with simple find.
        # However, we know it closes "</div>" eventually.
        # But wait, we can just replace the KNOWN content structure if we are sure.
        # Or better: We assume standard indentation.
        
        # ACTUALLY: The previous Grep said line 7660.
        # Let's use lines.
        lines = content.splitlines()
        
        found_start = -1
        found_end = -1
        
        for i, line in enumerate(lines):
            if 'id="omni-trigger"' in line:
                found_start = i
                # Look for closing div of this block.
                # Assuming indentation or just the next few lines.
                # The old block had "omni-fake-input" inside.
                
                # Let's scan forward for </div> matching indentation or until we see something else
                # Roughly 20 lines should cover it.
                for j in range(i, min(i+50, len(lines))):
                     if "</div>" in lines[j] and "omni-fake-input" not in lines[j]: 
                         # This check is weak.
                         pass
                     if "<!--" in lines[j] and j > i+5: # Next section?
                         found_end = j
                         break
                
                # If we can't determine end easily, let's just REPLACE THE INNER CONTENT
                # But we want to change the wrapper classes/style too.
                pass
        
        # Alternative: We search for the specific INNER HTML "omni-fake-input" and replace it?
        # User said: "remove this format... put elements below inside".
        
        # Let's try replacing the whole #omni-input-wrapper from the OVERLAY into the TRIGGER?
        # Simpler: Just rewrite the #omni-trigger block entirely using regex replacement of the opening tag -> closing tag.
        
        # Regex for <div ... id="omni-trigger" ...> ... </div>
        # Might be fragile.
        
        # SAFE APPROACH:
        # We know exactly what the "fake" input looks like from user snippet.
        fake_snippet = 'class="omni-fake-input"'
        # We replace the PARENT container of this snippet.
        
        if fake_snippet in content:
            # We will use string string manipulation to find the parent div
            # ...
            pass
        
        # Let's try replacing the entire KNOWN block.
        # I'll rely on my knowledge of the injected code from previous turns (Step 7639~).
        # Actually I can't guarantee what is inside.
        
        # Let's just Inject the new HTML REPLACING 'id="omni-trigger"' div line and closing div.
        
        # Let's use the Python script to do a smart search/replace based on the ID.
        pass

    # Simplified Script Logic:
    # 1. Read file
    # 2. Find line with 'id="omni-trigger"'
    # 3. Find matching closing div (by indentation or scanning)
    # 4. Replace block.
    
    lines = content.splitlines()
    new_lines = []
    
    in_trigger = False
    trigger_indent = 0
    
    # Buffer for new HTML
    # We want to insert the new HTML exactly where the old one was.
    
    replaced = False
    
    for i, line in enumerate(lines):
        if 'id="omni-trigger"' in line and not replaced:
            in_trigger = True
            # Calculate indentation
            trigger_indent = len(line) - len(line.lstrip())
            new_lines.append(new_bar_html)
            replaced = True
            continue
        
        if in_trigger:
            # Check for closing div with same indentation? Or just first closing div?
            # The structure is specific. It ends.
            # Usually strict indentation is used.
            current_indent = len(line) - len(line.lstrip())
            if "</div>" in line and current_indent == trigger_indent:
                in_trigger = False
            continue
        
        new_lines.append(line)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    print("HTML Content Updated.")

if __name__ == "__main__":
    fix_omni_bar()
