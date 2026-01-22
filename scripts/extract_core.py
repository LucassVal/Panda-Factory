
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')
js_dir = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'js')
core_path = os.path.join(js_dir, 'panda.core.js')

def run():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Strategy: Find START of Core Logic and END of Logic.
    # Start: "function loadGoogleMapsScript() {" (Line ~3200)
    # End: The <script> block ending?
    # Actually, the block is likely inside a <script> tag or scattered?
    # Let's check where the main script starts.
    # It seems the logic is just loose functions inside <script> tags or just inside <body>?
    # Looking at previous view_files, there isn't a single <script> wrapper for everything.
    # Lines 3173 "function abrirNovoCliente()" ...
    
    # Wait, looking at file view (Step 8211), functions like `abrirNovoCliente` are just there.
    # Are they inside a <script> tag?
    # I need to find the <script> tag that ENCLOSES these functions.
    
    # Let's search for `<script>` tags backwards from line 3200.
    
    start_marker = "function loadGoogleMapsScript"
    start_idx = content.find(start_marker)
    
    if start_idx == -1:
        print("Could not find start marker.")
        return

    # Find the preceeding <script> tag
    script_start_idx = content.rfind("<script", 0, start_idx)
    # Find the closing </script> tag
    script_end_idx = content.find("</script>", start_idx)
    
    if script_start_idx == -1 or script_end_idx == -1:
        print("Could not find script boundaries.")
        return
        
    # We want to extract the CONTENT of this script tag.
    # Wait, user wants to separate "Core Logic".
    # Is "abrirNovoCliente" core logic? Yes.
    # Is it in the same script tag?
    
    # Let's extract everything inside this main script tag.
    # And also check if there are multiple script tags.
    # For now, let's extract THIS big block.
    
    # We interpret "start of script tag" + ">"
    tag_content_start = content.find(">", script_start_idx) + 1
    
    core_js_content = content[tag_content_start:script_end_idx]
    
    # Add header
    header = "// 🐼 PANDA FABRICS CORE KERNEL\n// SYSTEM LOGIC - DO NOT EDIT\n\n"
    final_js = header + core_js_content.strip()
    
    # Save to JS file
    with open(core_path, 'w', encoding='utf-8') as f:
        f.write(final_js)
    
    print(f"Extracted {len(final_js)} bytes to panda.core.js")
    
    # Replace in HTML
    # We replace the entire <script>...</script> block with <script src="js/panda.core.js"></script>
    
    new_script_tag = '\n<script src="js/panda.core.js"></script>\n'
    
    new_html = content[:script_start_idx] + new_script_tag + content[script_end_idx+9:]
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_html)

if __name__ == "__main__":
    run()
