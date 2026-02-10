# Build shell using relative paths (run from project root)
$header = Get-Content "4.ui\Comp_HeaderStatus.html" -Raw -Encoding UTF8
$dock = Get-Content "4.ui\Comp_AppDock.html" -Raw -Encoding UTF8
$devdock = Get-Content "4.ui\Comp_DevToolsDock.html" -Raw -Encoding UTF8
$sidebar = Get-Content "4.ui\Comp_Sidebar.html" -Raw -Encoding UTF8
$settings = Get-Content "4.ui\Comp_SettingsModal.html" -Raw -Encoding UTF8

Write-Output "Header=$($header.Length) Dock=$($dock.Length) DevDock=$($devdock.Length) Sidebar=$($sidebar.Length) Settings=$($settings.Length)"

$head = @'
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Panda Fabrics 🐼</title>
    <link rel="manifest" href="manifest.json" />
    <meta name="theme-color" content="#667eea" />
    <link rel="icon" type="image/png" href="10.assets/icons/icon-192x192.png" />
    <link rel="apple-touch-icon" href="10.assets/icons/icon-192x192.png" />
    <link rel="stylesheet" href="10.assets/css/pf.theme.css?v=3.1" />
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="2.system/sdk/repository.js?v=sys_v1"></script>
    <script src="2.system/sdk/api.js?v=sys_v1"></script>
    <script src="2.system/core/kernel.js?v=sys_v1"></script>
    <script src="3.sdk/pf.sdk.js?v=0.8"></script>
    <script src="3.sdk/pf.app-init.js?v=1.1" defer></script>
    <script src="4.ui/pf.omnibar.js?v=2.0" defer></script>
    <script src="4.ui/pf.modal-pin.js?v=1.0" defer></script>
    <script src="4.ui/pf.settings.js?v=1.0" defer></script>
    <script src="4.ui/pf.dock-drag.js?v=1.0" defer></script>
    <script src="4.ui/pf.devtools.js?v=1.0" defer></script>
    <script src="3.sdk/pf.ai-core.js?v=1.0" defer></script>
    <script src="3.sdk/pf.firebase-bridge.js?v=1.0" defer></script>
  </head>
  <body>
    <div id="panda-loading" class="panda-loading-screen">
      <img src="10.assets/panda_logo.jpg" alt="Panda" class="panda-loading-logo" />
    </div>
    <div class="container">
'@

$mid1 = @'

      <!-- ═══ INLINE: HEADER STATUS ═══ -->
      <div id="header-container">
'@

$mid2 = @'
      </div>

      <!-- ═══ INLINE: APP DOCK (Left) ═══ -->
      <div id="app-dock-container">
'@

$mid3 = @'
      </div>

      <!-- ═══ INLINE: DEVTOOLS DOCK (Right) ═══ -->
      <div id="dev-dock-container">
'@

$mid4 = @'
      </div>

      <!-- ═══ INLINE: SETTINGS MODAL ═══ -->
      <div id="settings-modal-container">
'@

$mid5 = @'
      </div>

      <!-- ═══ INLINE: SIDEBAR / AI CHAT ═══ -->
      <div id="sidebar-container">
'@

$tail = @'
      </div>

      <!-- Additional containers for lazy-loaded components -->
      <div id="treasury-container"></div>
      <div id="login-overlay-container"></div>
      <div id="tentacle-monitor-container"></div>

      <!-- INICIO VIEW (Clean Canvas) -->
      <div id="inicio-view" class="view-section active clean-canvas">
        <img src="10.assets/panda_logo.jpg" alt="Panda Fabrics" class="canvas-logo" />
      </div>

      <!-- MODULE VIEWPORT (for dynamic modules) -->
      <div id="module-viewport" style="display: none;"></div>

    </div>

    <!-- Component Loader (skip-if-loaded aware) -->
    <script src="2.system/core/loader.js"></script>

    <!-- Module Loader -->
    <script src="3.sdk/pf.module-loader.js" onerror="console.log('pf.module-loader.js not found')"></script>

    <script>
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
          navigator.serviceWorker
            .register("./sw.js")
            .then((reg) => console.log("🐼 ServiceWorker OK:", reg.scope))
            .catch((err) => console.log("❌ ServiceWorker falhou:", err));
        });
      }
    </script>

    <style>
      .panda-loading-screen { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: var(--ds-background-100, #0a0a0f); z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.5s ease-out; }
      .panda-loading-logo { width: 150px; height: 150px; object-fit: contain; animation: pulsePanda 1.5s ease-in-out infinite; }
      @keyframes pulsePanda { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.8; } }
      .clean-canvas { position: relative; width: 100%; height: 100vh; display: flex; align-items: center; justify-content: center; background: var(--ds-background-100, #0a0a0f); }
      .canvas-logo { width: 200px; height: 200px; object-fit: contain; opacity: 0.3; }
      .pf-fab-chat { position: fixed; bottom: 24px; right: 24px; width: 56px; height: 56px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4); z-index: 3500; transition: all 0.3s ease; }
      .pf-fab-chat:hover { transform: scale(1.1); box-shadow: 0 6px 28px rgba(102, 126, 234, 0.6); }
    </style>

    <button class="pf-fab-chat" onclick="toggleSidebar()" title="🐼 Panda AI">🐼</button>

  </body>
</html>
'@

$result = $head + $mid1 + $header + $mid2 + $dock + $mid3 + $devdock + $mid4 + $settings + $mid5 + $sidebar + $tail

$result | Out-File "PandaFactory.html" -Encoding UTF8 -Force

Write-Output "Done! Total=$($result.Length) bytes"
