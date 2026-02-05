#!/usr/bin/env python3
"""
Script to clean up old UI elements from PandaFactory.html
Removes: app-dock, dev-tools-dock, omni-bar duplicates, and old JS files
"""

import re

def clean_html():
    filepath = r"C:\Users\Lucas Valério\Desktop\CRM\PandaFactory.html"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Original size:", len(content), "bytes")
    
    # Remove app-dock (lines ~2451-2469)
    content = re.sub(
        r'<div class="app-dock" id="appDock">.*?</div>\s*</div>',
        '<!-- App Dock removed -->',
        content,
        flags=re.DOTALL
    )
    
    # Remove dev-tools-dock (lines ~2473-2508)
    content = re.sub(
        r'<!-- Developer Tools Dock.*?</div>\s*(?=<!-- =====)',
        '<!-- DevTools Dock removed -->\n\n      ',
        content,
        flags=re.DOTALL
    )
    
    # Remove duplicate omni-bar comments
    content = re.sub(
        r'(<!-- OMNI-BAR \(Unified & integrated, Floating\) -->\s*){2,}',
        r'<!-- OMNI-BAR (Unified & integrated, Floating) -->\n    ',
        content
    )
    
    print("New size:", len(content), "bytes")
    print("Removed:", len(open(filepath, 'r', encoding='utf-8').read()) - len(content), "bytes")
    
    # Backup
    with open(filepath + '.backup', 'w', encoding='utf-8') as f:
        f.write(open(filepath, 'r', encoding='utf-8').read())
    print("Backup created:", filepath + '.backup')
    
    # Write cleaned content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Cleanup complete!")

if __name__ == '__main__':
    clean_html()
