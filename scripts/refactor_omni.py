
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# The HTML we want to INSERT into the main bar (replacing the fake one)
real_input_html = """
        <!-- OMNI INPUT INTEGRATED -->
        <div class="omni-input-wrapper" style="display: flex; align-items: center; width: 100%; gap: 10px;">
            <i class="fas fa-search omni-icon" style="color: var(--text-secondary); font-size: 18px;"></i>
            <input type="text" id="omni-input" placeholder="Pergunte ao Panda ou busque ferramentas..." autocomplete="off" 
                   style="flex: 1; background: transparent; border: none; font-size: 16px; color: var(--text-primary); outline: none;">
            
            <!-- Model Badge -->
            <div class="omni-model-badge" onclick="cycleModel()" id="current-model-badge" 
                 style="font-size: 11px; padding: 4px 10px; border-radius: 6px; background: var(--bg-app); border: 1px solid var(--border-subtle); cursor: pointer; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
                <i class="fas fa-bolt" style="color: #f59e0b;"></i> Gemini Flash
            </div>
            
            <!-- Shortcut Hint -->
            <span class="omni-shortcut-badge" style="font-size: 10px; color: var(--text-secondary); opacity: 0.7; border: 1px solid var(--border-subtle); padding: 2px 6px; border-radius: 4px;">Ctrl + K</span>
        </div>
        
        <!-- Dropdown Results (Hidden by default) -->
        <div id="omni-results" style="display: none; border-top: 1px solid var(--border-subtle); margin-top: 10px; padding-top: 10px; max-height: 400px; overflow-y: auto;">
            <!-- JS will populate this -->
        </div>
"""

def refactor_omni():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. REMOVE THE OLD OVERLAY (Lines ~1673)
    # We look for <div id="omni-overlay" ...> and remove it up to its closing div.
    # It's better to verify uniqueness.
    
    if 'id="omni-overlay"' in content:
        # Regex to match the div block. 
        # Since it likely contains nested divs, simple regex is hard.
        # But we know the content from the previous view_file.
        # It ends with </div> on line 1686 followed by empty lines.
        
        # We can search for the start line and then simple bracket counting or just match the known structure?
        # Known structure:
        # <div id="omni-overlay" onclick="if(event.target===this) toggleOmniBar()">
        #    ...
        # </div>
        
        # Let's clean it by replacing the wrapper but LEAVING empty space or comment.
        # Actually, if we just remove the ID, the JS might break.
        # BUT we are moving the ID "omni-input" to the new location.
        # We must also ensure "omni-overlay" ID is gone so JS doesn't toggle a ghost.
        # OR we leave "omni-overlay" as a dummy hidden div if JS relies on it, 
        # but the request implies "remove floating window".
        
        # Strategy: Replace the entire `omni-overlay` block with an empty string.
        pattern_overlay = re.compile(r'<div id="omni-overlay".*?</div>\s*</div>', re.DOTALL) 
        # This regex is risky if nested divs exist.
        
        # Safer: Split lines, find start/end range by indentation or markers.
        lines = content.splitlines()
        new_lines = []
        skip = False
        overlay_indent = -1
        
        for line in lines:
            if 'id="omni-overlay"' in line:
                skip = True
                overlay_indent = len(line) - len(line.lstrip())
                continue
            
            if skip:
                # Check for closing div at same indentation
                curr_indent = len(line) - len(line.lstrip())
                if line.strip() == "</div>" and curr_indent == overlay_indent:
                    skip = False
                continue
            
            new_lines.append(line)
        
        content = '\n'.join(new_lines)
        print("Removed Old Overlay.")
    else:
        print("Old overlay not found or already removed.")

    # 2. INJECT INTO MAIN BAR (Replace fake input)
    # Target: The specific `omni-search-bar` or `omni-trigger` that contains "omni-fake-input".
    # We want to replace the INNER html of that container.
    
    # Let's find the identifier for the line containing "omni-fake-input"
    if 'class="omni-fake-input"' in content:
        # We want to replace the DIV that HAS this class, with our new `real_input_html`.
        # <div class="omni-fake-input"> ... </div>
        
        # Regex to find this specific div block
        # <div class="omni-fake-input"> ... </div>
        # It might span multiple lines.
        
        lines = content.splitlines()
        final_lines = []
        skip_fake = False
        fake_indent = -1
        
        for line in lines:
            if 'class="omni-fake-input"' in line:
                skip_fake = True
                fake_indent = len(line) - len(line.lstrip())
                # Insert our NEW HTML here
                final_lines.append(real_input_html)
                continue
            
            if skip_fake:
                curr_indent = len(line) - len(line.lstrip())
                if line.strip() == "</div>" and curr_indent == fake_indent:
                    skip_fake = False
                continue
            
            final_lines.append(line)
            
        content = '\n'.join(final_lines)
        print("Injected Real Input into Main Bar.")

    # 3. CSS Cleanup (optional but good)
    # Ensure #omni-input has styles if we didn't inline them enough. 
    # (I inlined them in `real_input_html` for safety).

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    refactor_omni()
