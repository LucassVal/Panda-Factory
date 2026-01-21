#!/usr/bin/env python3
"""
COMPLETE CLEANUP - Remove ALL omni, panda-fab, DockController
"""

import re

filepath = r"C:\Users\Lucas Valério\Desktop\CRM\PandaFactory.html"

with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

print("BEFORE:", len(content), "bytes")

# 1. Remove ENTIRE omni-bar section
content = re.sub(
    r'<!-- OMNI-BAR.*?</div>\s*(?=\s*<!-- ===)',
    '',
    content,
    flags=re.DOTALL | re.MULTILINE
)

# 2. Remove panda-fab
content = re.sub(
    r'<div id="panda-fab"[^>]*>.*?</div>',
    '',
    content,
    flags=re.DOTALL
)

# 3. Remove DockController.js script
content = re.sub(
    r'<script src="js/DockController\.js"></script>\r?\n?',
    '',
    content
)

# 4. Remove OmniBarResize.js script
content = re.sub(
    r'<script src="js/OmniBarResize\.js"></script>\r?\n?',
    '',
    content
)

# 5. Remove ALL omni CSS
content = re.sub(
    r'/\* OMNI BAR.*?(?=\r?\n\r?\n[/\*]|\r?\n</style>)',
    '',
    content,
    flags=re.DOTALL
)

# 6. Remove omni-related CSS classes
content = re.sub(
    r'\.omni-[^{]*\{[^}]*\}\r?\n?',
    '',
    content,
    flags=re.DOTALL
)

# 7. Remove ALL omni functions
content = re.sub(
    r'function (toggleOmniBar|minimizeOmniBar|toggleModelSelector|toggleChatExpansion|selectModel)\([^)]*\)[^{]*\{(?:[^{}]|\{[^{}]*\})*\}\r?\n?',
    '',
    content,
    flags=re.DOTALL
)

# 8. Remove window.toggleOmniBar
content = re.sub(
    r'window\.toggleOmniBar\s*=\s*function[^{]*\{(?:[^{}]|\{[^{}]*\})*\};\r?\n?',
    '',
    content,
    flags=re.DOTALL
)

print("AFTER:", len(content), "bytes")
print("REMOVED:", len(open(filepath, 'r', encoding='utf-8').read()) - len(content), "bytes")

# Backup
backup_path = filepath + '.final_backup'
with open(backup_path, 'w', encoding='utf-8') as f:
    f.write(open(filepath, 'r', encoding='utf-8').read())
print("Backup:", backup_path)

# Write clean
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ ALL OMNI, PANDA-FAB, DOCKCONTROLLER DELETED!")
