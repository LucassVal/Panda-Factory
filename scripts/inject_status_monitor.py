
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# HTML for the Status Monitor
# Using 2-letter codes and gradient dots.
status_html = """
        <!-- CENTER/RIGHT: System Status Monitor -->
        <div class="status-monitor-bar" style="display:flex; gap:12px; margin-right:auto; margin-left: 40px; align-items:center;">
             <div class="status-pill" title="Firebase Realtime (Heartbeat)">
                <span class="status-label">FB</span>
                <div class="status-dot online"></div>
             </div>
             <div class="status-pill" title="Google App Script (Serverless)">
                <span class="status-label">GA</span>
                <div class="status-dot warning"></div>
             </div>
             <div class="status-pill" title="Rust Agent (Local Bridge)">
                <span class="status-label">RU</span>
                <div class="status-dot offline"></div>
             </div>
             <div class="status-pill" title="Database (Persistência)">
                <span class="status-label">DB</span>
                <div class="status-dot online"></div>
             </div>
             <div class="status-pill" title="Gemini AI (Intelligence)">
                <span class="status-label">AI</span>
                <div class="status-dot online"></div>
             </div>
             <div class="status-pill" title="Local GPU (Hardware)">
                <span class="status-label">GP</span>
                <div class="status-dot offline"></div>
             </div>
        </div>
"""

# CSS for the monitor
monitor_css = """
<style>
/* Status Monitor Styles */
.status-monitor-bar {
    /* Adaptive visibility: Hide on very small screens? */
}
.status-pill {
    display: flex; align-items: center; gap: 6px;
    background: rgba(0,0,0,0.03);
    border: 1px solid var(--border-subtle);
    padding: 4px 8px;
    border-radius: 8px;
    cursor: help;
    transition: all 0.2s;
}
.status-pill:hover {
    background: var(--bg-card);
    transform: translateY(-1px);
    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}
.status-label {
    font-size: 10px;    
    font-weight: 700;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
}
.status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
}

/* Gradients for Status */
/* Online: Green Neon Gradient */
.status-dot.online {
    background: radial-gradient(circle at 30% 30%, #4ade80, #22c55e); 
    box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
}
/* Warning: Yellow/Orange */
.status-dot.warning {
    background: radial-gradient(circle at 30% 30%, #facc15, #eab308);
    box-shadow: 0 0 6px rgba(234, 179, 8, 0.4);
}
/* Offline: Red Hot */
.status-dot.offline {
    background: radial-gradient(circle at 30% 30%, #f87171, #ef4444);
    box-shadow: 0 0 6px rgba(239, 68, 68, 0.4);
}
</style>
"""

def inject_monitor():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject HTML
    # We want to place it between the "Brand Div" (Left) and "Controls Div" (Right).
    # Structure is:
    # <div class="header" ...>
    #    <div ...> ... <h1> ... </h1> <span>v2.2</span> </div>  <-- We want AFTER this div
    #
    #    <div class="header-controls" ...>                       <-- And BEFORE this div
    
    # Let's find "v2.2</span>\n         </div>" or similar closing tag of the first child.
    # Searching for the class="version-badge">v2.2</span> closing context.
    
    # To be safe, let's target the START of the Controls div
    target_str = '<!-- RIGHT: Controls -->'
    if target_str in content:
        content = content.replace(target_str, status_html + '\n\n        ' + target_str)
        print("Injected Status Monitor HTML.")
    else:
        print("Could not find insertion point '<!-- RIGHT: Controls -->'")
        return

    # 2. Inject CSS
    if ".status-dot.online" not in content:
        content = content.replace("</head>", monitor_css + "\n</head>")
        print("Injected Status Monitor CSS.")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    inject_monitor()
