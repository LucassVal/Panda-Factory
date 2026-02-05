
import os
import re

file_path = os.path.join(os.environ['USERPROFILE'], 'Desktop', 'CRM', 'CRM.html')

# 1. HTML for Language Switcher (Button + Dropdown)
lang_html = """
           <!-- Language Switcher -->
           <div class="lang-switcher-wrapper" style="position: relative;">
               <button class="theme-toggle-btn" onclick="toggleLangMenu()" title="Alterar Idioma / Change Language" id="langBtn">
                   <span style="font-size: 16px;">🇧🇷</span>
               </button>
               <!-- Dropdown Menu -->
               <div id="langDropdown" class="lang-dropdown">
                   <div class="lang-option" onclick="changeLanguage('pt')">
                       <span>🇧🇷</span> Português
                   </div>
                   <div class="lang-option" onclick="changeLanguage('en')">
                       <span>🇺🇸</span> English
                   </div>
                   <div class="lang-option" onclick="changeLanguage('es')">
                       <span>🇪🇸</span> Español
                   </div>
               </div>
           </div>
"""

# 2. CSS for the Dropdown
lang_css = """
<style>
/* Language Dropdown */
.lang-dropdown {
    display: none;
    position: absolute;
    top: 45px;
    right: 0;
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: 12px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    width: 140px;
    z-index: 5000;
    overflow: hidden;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
}
.lang-dropdown.show {
    display: block;
    animation: fadeIn 0.2s ease;
}
.lang-option {
    padding: 10px 15px;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 13px;
    color: var(--text-primary);
    transition: background 0.2s;
}
.lang-option:hover {
    background: rgba(0,0,0,0.05);
}
.theme-toggle-btn {
    /* Recycle existing btn style but ensure relative positioning if needed */
}
</style>
"""

# 3. JS Logic
lang_js = """
<script>
    // Language Switcher Logic
    function toggleLangMenu() {
        const dropdown = document.getElementById('langDropdown');
        dropdown.classList.toggle('show');
        
        // Close on click outside
        document.addEventListener('click', function closeLang(e) {
            if (!e.target.closest('.lang-switcher-wrapper')) {
                dropdown.classList.remove('show');
                document.removeEventListener('click', closeLang);
            }
        });
    }

    function changeLanguage(lang) {
        const btn = document.getElementById('langBtn');
        const map = {
            'pt': '🇧🇷',
            'en': '🇺🇸',
            'es': '🇪🇸'
        };
        btn.innerHTML = `<span style="font-size: 16px;">${map[lang]}</span>`;
        // Future: trigger translation logic here
        console.log("Language changed to:", lang);
    }
</script>
"""

def inject_lang_switcher():
    if not os.path.exists(file_path):
        print("CRM.html not found.")
        return

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Inject HTML
    # We want it AFTER the Theme Toggle Button.
    # We look for the closing of the theme toggle: 
    # <button class="theme-toggle-btn" ...> ... </button>
    # And BEFORE the User Info: <!-- User Info -->
    
    markup_target = '<!-- User Info -->'
    if markup_target in content:
        content = content.replace(markup_target, lang_html + '\n\n           ' + markup_target)
        print("Injected Language Switcher HTML.")
    else:
        print("Could not find insertion point '<!-- User Info -->'")

    # 2. Inject CSS
    if ".lang-dropdown" not in content:
        content = content.replace("</head>", lang_css + "\n</head>")
        print("Injected Language CSS.")

    # 3. Inject JS
    if "function toggleLangMenu" not in content:
        content = content.replace("</body>", lang_js + "\n</body>")
        print("Injected Language JS.")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    inject_lang_switcher()
