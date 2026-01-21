
import os

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

def release_window():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to move the block <div id="omni-trigger" ...> ... </div>
    # It is currently inside <div id="inicio-view" ...>.
    # We want to move it TO THE END of the file, just before </body> or near other modals/dock.
    
    # Identify the block
    if 'id="omni-trigger"' in content:
        lines = content.splitlines()
        
        trigger_block = []
        new_lines = []
        in_trigger = False
        trigger_indent = -1
        
        # Determine where to insert it. Let's insert before <!-- PANDA LOADING SCREEN --> or similar root level element.
        # Or just before the Dock script.
        
        # Extract Block
        for line in lines:
            if 'id="omni-trigger"' in line:
                in_trigger = True
                trigger_indent = len(line) - len(line.lstrip())
                trigger_block.append(line.strip()) # Flatten indentation for re-insertion? Or keep relative?
                # Actually, let's keep it simple.
                continue
            
            if in_trigger:
                curr_indent = len(line) - len(line.lstrip())
                if "</div>" in line and curr_indent == trigger_indent:
                    in_trigger = False
                    trigger_block.append(line.strip())
                else:
                    trigger_block.append(line.strip())
                continue
            
            new_lines.append(line)
            
        # If extraction successful
        if trigger_block:
            print("Extracted Omni Trigger.")
            
            # Reconstruct the block with standard indentation
            formatted_block = '\n'.join(['      ' + l for l in trigger_block])
            
            # Insert it near #appDock (reference element)
            # Find line with <!-- Floating Draggable App Dock -->
            
            final_lines = []
            inserted = False
            
            for line in new_lines:
                if '<!-- Floating Draggable App Dock -->' in line and not inserted:
                    final_lines.append('      <!-- OMNI-BAR (Unified & integrated, Floating) -->')
                    final_lines.append(formatted_block)
                    final_lines.append('')
                    final_lines.append(line)
                    inserted = True
                else:
                    final_lines.append(line)
            
            # CSS Adjustment: Ensure it is 'fixed' not 'absolute' if we want it to float over everything regardless of scroll?
            # User referenced App Dock which is fixed.
            # My previous CSS set .omni-bar-container to position: absolute.
            # If moved to body root, absolute is relative to body. Fixed is relative to viewport.
            # I should probably update CSS to 'fixed' to match 'solta estilo a janela abaixo' (Dock).
            
            content_out = '\n'.join(final_lines)
            
            # Update CSS from absolute to fixed
            content_out = content_out.replace('.omni-bar-container {\n    position: absolute;', '.omni-bar-container {\n    position: fixed;')
            
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content_out)
                print("Moved Omni Trigger to Root Level (Floating).")
        else:
            print("Could not extract Omni Trigger block.")

    else:
        print("Omni Trigger ID not found.")

if __name__ == "__main__":
    release_window()
