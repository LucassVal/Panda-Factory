
import os

crm_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')
module_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'modules', 'crm', 'index.html')

def run():
    if not os.path.exists(crm_path):
        return

    with open(crm_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extract New Client Modal
    # Line ~2878 to ~3150? Need to be careful with closure.
    # It has id="newClientModal" and ends with </div>...
    
    start_marker = '<div class="modal" id="newClientModal">'
    start_idx = content.find(start_marker)
    
    if start_idx == -1:
        print("Modal not found")
        return
        
    # Finding the matching closing div is hard with simple find.
    # We'll assume the indentation helps or use a counter.
    # Or just grab until the next comment or known section?
    # The modal ends before <div id="editClientModal"> or end of body?
    
    # Just manual slicing based on visual inspection or use a stack?
    # Let's count divs.
    
    cnt = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i:i+4] == '<div':
            cnt += 1
        elif content[i:i+5] == '</div':
            cnt -= 1
            if cnt == 0:
                end_idx = i + 6
                break
    
    if end_idx == -1:
        print("Could not analyze modal structure")
        return
        
    modal_html = content[start_idx:end_idx]
    
    # Now append to module file
    with open(module_path, 'r', encoding='utf-8') as f:
        mod_content = f.read()
        
    # Append at the end (inside the wrapper?)
    # The module has a wrapper <div id="contatos-view" class="view-section">
    # We should put the modal INSIDE this wrapper or just after?
    # If we put inside, scoped css works better.
    
    if modal_html not in mod_content:
        # close the last div
        last_div = mod_content.rfind('</div>')
        # inject before the last closing div of the main container
        new_mod_content = mod_content[:last_div] + "\n" + modal_html + "\n</div>"
        
        with open(module_path, 'w', encoding='utf-8') as f:
            f.write(new_mod_content)
        print("Injected modal into module.")
        
    # Remove from CRM.html
    # We replace with empty string
    new_crm_content = content[:start_idx] + "<!-- Modal Moved to modules/crm/index.html -->" + content[end_idx:]
    
    with open(crm_path, 'w', encoding='utf-8') as f:
        f.write(new_crm_content)
    print("Removed modal from CRM.html.")

if __name__ == "__main__":
    run()
