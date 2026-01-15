@echo off
chcp 65001 >nul
color 0B
title 🏢 CRM V3 - Launcher

cd /d "%~dp0"

echo.
echo  ██████╗██████╗ ███╗   ███╗
echo ██╔════╝██╔══██╗████╗ ████║
echo ██║     ██████╔╝██╔████╔██║
echo ██║     ██╔══██╗██║╚██╔╝██║
echo ╚██████╗██║  ██║██║ ╚═╝ ██║
echo  ╚═════╝╚═╝  ╚═╝╚═╝     ╚═╝
echo.
echo ════════════════════════════════════════════════
echo    GERENCIADOR DE INICIALIZAÇÃO INTELIGENTE
echo ════════════════════════════════════════════════
echo.

REM --- VERIFICAÇÃO DE 7 DIAS ---
echo [SYSTEM] Verificando idade da base de dados...

REM PowerShell Check: Returns 0 if update needed (Older than 7 days), 1 if ok (Recent).
powershell -Command "$json = 'dados/clientes_crm_v2.json'; if (-not (Test-Path $json)) { exit 0 }; $last = (Get-Item $json).LastWriteTime; $days = (New-TimeSpan -Start $last -End (Get-Date)).Days; if ($days -ge 7) { Write-Host '⚠️ Base desatualizada (' $days 'dias).' -ForegroundColor Yellow; exit 0 } else { Write-Host '✅ Base atualizada (' $days 'dias atrás).' -ForegroundColor Green; exit 1 }"

if %ERRORLEVEL% EQ 0 (
    echo.
    echo [AUTO] Base antiga. Iniciando atualização obrigatória...
    goto RUN_SCRAPER
) else (
    echo.
    echo ----------------------------------------------------
    echo [OPCIONAL] Deseja atualizar mesmo assim?
    echo (Isso permite alterar os filtros de M² agora)
    echo.
    set /p choice="👉 Atualizar agora? (S/N) [N]: "
)

if /i "%choice%"=="S" goto RUN_SCRAPER
if /i "%choice%"=="s" goto RUN_SCRAPER

echo.
echo [INFO] Mantendo dados atuais. Iniciando CRM...
goto START_CRM

:RUN_SCRAPER
echo.
echo [EXECUÇÃO] Iniciando Scraper de Dados...
echo ----------------------------------------
echo ⚠️ Uma nova janela abrirá. Configure os M² no console.
echo.

cd scripts
python scraper_guia_automatico.py
cd ..

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Erro durante a atualização. Usando dados antigos.
    timeout /t 5
) else (
    echo.
    echo ✅ Atualização concluída com sucesso!
)

:START_CRM
echo.
echo 🚀 Abrindo Dashboard...
echo ════════════════════════════════════════════════
start "" "CRM.html"
echo.
echo Janela encerrando em 3s...
timeout /t 3 >nul
exit
