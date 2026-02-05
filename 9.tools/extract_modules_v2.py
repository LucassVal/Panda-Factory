
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')
modules_dir = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'modules')

def extract_block(content, start_marker, end_marker, module_name, is_removal_only=False):
    start_idx = content.find(start_marker)
    if start_idx == -1:
        print(f"[{module_name}] Start marker not found: {start_marker[:30]}...")
        return content

    end_idx = content.find(end_marker, start_idx)
    if end_idx == -1:
        print(f"[{module_name}] End marker not found: {end_marker[:30]}...")
        return content

    # Content to extract (everything between start and end)
    # Note: determining if we include markers or not.
    # Usually we want the DIV to be in the file.
    # But for "Agenda", the end marker is the NEXT view. So we should NOT include the end marker in the extraction, 
    # but we SHOULD remove up to the end marker.
    
    extracted_html = content[start_idx:end_idx]
    
    # Save to file
    if not is_removal_only:
        module_folder = os.path.join(modules_dir, module_name)
        if not os.path.exists(module_folder):
            os.makedirs(module_folder)
            
        module_path = os.path.join(module_folder, 'index.html')
        with open(module_path, 'w', encoding='utf-8') as f:
            f.write(extracted_html)
        print(f"[{module_name}] Extracted to {module_path}")

    # Remove from original
    # We replace with a placeholder comment
    if is_removal_only:
        placeholder = f"<!-- REMOVED OLD COMPONENT: {module_name} -->\n"
    else:
        placeholder = f"<!-- MODULE PLACEHOLDER: {module_name} -->\n"
        
    new_content = content[:start_idx] + placeholder + content[end_idx:]
    return new_content

def run():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. CRM (Contatos)
    # Start: <div id="contatos-view"
    # End: <!-- End contatos-view -->
    # We want to INCLUDE the End comment in the REPLACEMENT (to keep structure clean) or just stop before it?
    # If I stop before it, the "<!-- End contatos-view -->" remains in CRM.html. That's fine.
    content = extract_block(content, '<div id="contatos-view"', '<!-- End contatos-view -->', 'crm')
    
    # 2. Agenda
    # Start: <div id="agenda-view"
    # End: <!-- REPORTS VIEW -->
    content = extract_block(content, '<div id="agenda-view"', '<!-- REPORTS VIEW -->', 'agenda')

    # 3. Reports
    # Start: <div id="reports-view"
    # End: <!-- Upload de HTML -->
    content = extract_block(content, '<div id="reports-view"', '<!-- Upload de HTML -->', 'reports')

    # 4. Old Settings Modal (Removal Only)
    # Start: <div id="settingsModal" (The one at line 2954)
    # End: <!-- Modal de Novo Cliente -->
    content = extract_block(content, '<div id="settingsModal" class="modal">', '<!-- Modal de Novo Cliente -->', 'old_settings', is_removal_only=True)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Done.")

if __name__ == "__main__":
    run()
