#!/usr/bin/env python3
"""
Complete cleanup script - Remove all omni, panda-fab, and DockController references
"""

import re

def clean_all():
    filepath = r"C:\Users\Lucas Valério\Desktop\CRM\PandaFactory.html"
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    print("Original size:", len(content), "bytes")
    
    # Remove entire omni-bar section (including all nested divs)
    content = re.sub(
        r'<!-- OMNI-BAR.*?</div>\s*(?=\s*<!-- ===)',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove panda-fab if exists
    content = re.sub(
        r'<div id="panda-fab"[^>]*>.*?</div>',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove DockController script
    content = re.sub(
        r'<script src="js/DockController\.js"></script>\s*',
        '',
        content
    )
    
    # Remove OmniBarResize script
    content = re.sub(
        r'<script src="js/OmniBarResize\.js"></script>\s*',
        '',
        content
    )
    
    # Remove omni CSS
    content = re.sub(
        r'/\* OMNI BAR INTEGRATED STYLES \*/.*?(?=</style>)',
        '',
        content,
        flags=re.DOTALL
    )
    
    # Remove omni-related functions
    content = re.sub(
        r'function toggleOmniBar\(\).*?}\s*',
        '',
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(
        r'function minimizeOmniBar\(\).*?}\s*',
        '',
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(
        r'function toggleModelSelector\(\).*?}\s*',
        '',
        content,
        flags=re.DOTALL
    )
    
    content = re.sub(
        r'function toggleChatExpansion\(\).*?}\s*',
        '',
        content,
        flags=re.DOTALL
    )
    
    print("New size:", len(content), "bytes")
    print("Removed:", len(open(filepath, 'r', encoding='utf-8').read()) - len(content), "bytes")
    
    # Backup
    with open(filepath + '.cleanup_backup', 'w', encoding='utf-8') as f:
        f.write(open(filepath, 'r', encoding='utf-8').read())
    print("Backup created:", filepath + '.cleanup_backup')
    
    # Write cleaned content
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Complete cleanup done!")

if __name__ == '__main__':
    clean_all()
