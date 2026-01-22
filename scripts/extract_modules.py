
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')
modules_dir = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'modules')

def extract_and_remove(content, view_id, module_name):
    # Regex to capture the div: <div id="view_id" ...> ... </div>
    # Logic: Find start tag, find matching end tag (counting divs).
    
    start_pattern = f'<div id="{view_id}"'
    start_match = re.search(start_pattern, content)
    
    if not start_match:
        print(f"[{module_name}] View '{view_id}' not found.")
        return content

    start_idx = start_match.start()
    
    # Find matching closing div
    open_divs = 0
    end_idx = -1
    
    # Iterate through file starting from start_idx
    i = start_idx
    while i < len(content):
        if content[i:i+4] == '<div':
            open_divs += 1
            i += 4
        elif content[i:i+5] == '</div>':
            open_divs -= 1
            i += 5
            if open_divs == 0:
                end_idx = i
                break
        else:
            i += 1
            
    if end_idx == -1:
        print(f"[{module_name}] Could not find closing div for '{view_id}'.")
        return content

    # Extract Content
    view_html = content[start_idx:end_idx]
    
    # Save to Module File
    module_path = os.path.join(modules_dir, module_name, 'index.html')
    with open(module_path, 'w', encoding='utf-8') as f:
        f.write(view_html)
    print(f"[{module_name}] Extracted {len(view_html)} bytes to {module_path}")
    
    # Remove from CRM.html (Replace with <div id="view_id" class="module-placeholder"></div>)
    # Actually, user wants to remove them completely because they will be loaded into a container? 
    # Or keep a placeholder? User: "remover... encapsulados".
    # I'll replace with a comment for now.
    
    # Also removing the OLD Settings Modal if found (Lines ~2954)
    if module_name == "OLD_SETTINGS":
        new_content = content[:start_idx] + "\n<!-- OLD SETTINGS REMOVED -->\n" + content[end_idx:]
    else:
        new_content = content[:start_idx] + f'\n<!-- MODULE EXTRACTED: {module_name} -->\n' + content[end_idx:]
    
    return new_content

def run():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Extract CRM (Contatos)
    content = extract_and_remove(content, "contatos-view", "crm")
    
    # 2. Extract Agenda
    content = extract_and_remove(content, "agenda-view", "agenda")
    
    # 3. Extract Reports
    content = extract_and_remove(content, "reports-view", "reports")
    
    # 4. Remove Duplicate Old Settings Modal
    content = extract_and_remove(content, "settingsModal", "OLD_SETTINGS") # This is id="settingsModal"

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    run()
