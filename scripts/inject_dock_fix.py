
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# CSS to inject for App Dock
# Uses Semantic Variables + distinct styling for icons as requested
# "Mais opaco" = higher alpha in background or blur
# "Delinear icones" = borders / visible backgrounds

new_dock_css = """
      /* APP DOCK - Draggable Glassmorphism (Themed) */
      .app-dock {
        position: fixed;
        /* Default position */
        bottom: 30px;
        left: 50%;
        transform: none; 
        
        /* THEMED BACKGROUND */
        background: var(--bg-panel); /* Uses alpha from theme */
        backdrop-filter: blur(20px) saturate(180%);
        -webkit-backdrop-filter: blur(20px) saturate(180%);
        
        padding: 8px 12px;
        border-radius: 20px;
        border: 1px solid var(--border-subtle);
        
        display: flex;
        align-items: center;
        gap: 8px; /* More gap for delineation */
        
        z-index: 9999;
        box-shadow: var(--shadow-dock);
        
        user-select: none;
        touch-action: none; 
        transition: box-shadow 0.2s, opacity 0.2s, background-color 0.3s;
        cursor: default;
      }
      .app-dock:hover {
        box-shadow: 0 12px 48px rgba(0,0,0,0.25), 0 0 0 1px var(--border-focus) inset; /* Lighter shadow in light mode */
      }
      .app-dock.dragging {
        opacity: 0.9;
        cursor: grabbing;
        transform: scale(1.02);
      }
      
      /* Drag Handle (Grip) */
      .dock-handle {
        width: 24px;
        height: 36px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3px;
        cursor: grab;
        padding: 0 4px;
        border-radius: 8px;
        margin-right: 4px;
        transition: background 0.2s;
      }
      .dock-handle span {
        width: 14px;
        height: 2px;
        background: var(--text-secondary);
        border-radius: 1px;
        opacity: 0.5;
      }
      .dock-handle:hover span {
        background: var(--text-primary);
        opacity: 1;
      }

      /* Nav Separator */
      .nav-separator {
        width: 1px;
        height: 24px;
        background: var(--border-subtle);
        margin: 0 4px;
      }
      
      /* Nav Items - Delineated */
      .nav-item {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        
        /* Default State - Subtle Delineation */
        background: var(--bg-app); /* Subtle contrast against panel */
        border: 1px solid transparent; /* Ready for border */
        color: var(--text-secondary);
        
        transition: all 0.2s cubic-bezier(0.25, 1, 0.5, 1);
        cursor: pointer;
        position: relative;
      }
      
      .nav-item:hover {
        background: var(--bg-card);
        border-color: var(--border-subtle);
        color: var(--text-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      }
      
      .nav-item.active {
        background: var(--bg-input); /* Lightest/Darkest bg */
        border-color: var(--border-focus);
        color: var(--text-primary);
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      
      .logout-btn:hover {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.2);
        color: #ef4444;
      }
      
      /* Tooltip Themed */
      .nav-item[title]:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 56px;
        left: 50%;
        transform: translateX(-50%);
        
        background: var(--accent-primary);
        color: var(--text-inverted);
        border: 1px solid var(--accent-primary);
        
        font-family: var(--font-sans);
        padding: 6px 12px;
        font-size: 11px;
        font-weight: 500;
        border-radius: 8px;
        white-space: nowrap;
        pointer-events: none;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: tooltipFadeIn 0.15s ease-out;
      }
"""

def update_dock_css():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Identify the block to replace.
    # From "/* APP DOCK - Draggable Glassmorphism" down to just before ".nav-item[title]:hover::after" block end?
    # Or simplified: We know the structure from previous read.
    # Start: "/* APP DOCK - Draggable Glassmorphism (Gemini-like) */"
    # End: "@keyframes tooltipFadeIn" (exclusive) or similar.
    
    # Original Header: /* APP DOCK - Draggable Glassmorphism (Gemini-like) */
    
    # Let's try to find start/end indices based on content markers
    start_marker = "/* APP DOCK - Draggable Glassmorphism (Gemini-like) */"
    end_marker = "/* Panda FAB (Floating Action Button) */" 
    # Note: tooltip keyframes are JUST BEFORE Panda FAB.
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx != -1 and end_idx != -1:
        print("Found Dock CSS Block. Replacing...")
        
        # We need to preserve the @keyframes if they are inside the block we are replacing?
        # My new_dock_css INCLUDES the tooltip style but NOT the keyframes.
        # The keyframes were at the end of the block in the original file.
        # Let's add keyframes to new_dock_css to be safe/complete.
        
        keyframes = """
      @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(5px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
"""
        full_replacement = new_dock_css + keyframes

        new_content = content[:start_idx] + full_replacement + "\n\n      " + content[end_idx:]
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Dock CSS Updated.")
    else:
        print("Could not locate Dock CSS block markers.")
        # Fallback: Print what we found to debug
        print(f"Start found: {start_idx}, End found: {end_idx}")

if __name__ == "__main__":
    update_dock_css()
