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
echo ⚠️ Janela do navegador abrirá. Configure os M² quando pedido.
echo.

cd scripts
python scraper_guia_automatico.py

REM Salvar código de erro
set SCRAPER_ERROR=%ERRORLEVEL%
cd ..

if %SCRAPER_ERROR% NEQ 0 (
    echo.
    echo ════════════════════════════════════════════════
    echo ❌ ERRO DURANTE A ATUALIZAÇÃO
    echo ════════════════════════════════════════════════
    echo.
    echo Código de erro: %SCRAPER_ERROR%
    echo.
    echo Possíveis causas:
    echo  - Credenciais incorretas no script Python
    echo  - Problema de conexão com a internet
    echo  - Site do Guia da Construção fora do ar
    echo  - Playwright não instalado corretamente
    echo.
    echo 💡 SOLUÇÃO: Verifique as credenciais e tente novamente.
    echo.
    echo ════════════════════════════════════════════════
    echo.
    echo 🔴 PRESSIONE QUALQUER TECLA PARA CONTINUAR...
    pause >nul
    echo.
    set /p continuar="👉 Deseja abrir o CRM com dados antigos? (S/N) [S]: "
    
    if /i "%continuar%"=="N" (
        echo.
        echo ⏹️ Operação cancelada pelo usuário.
        echo.
        pause
        exit /b 1
    )
    
    if /i "%continuar%"=="n" (
        echo.
        echo ⏹️ Operação cancelada pelo usuário.
        echo.
        pause
        exit /b 1
    )
    
    echo.
    echo [INFO] Mantendo dados anteriores...
) else (
    echo.
    echo ════════════════════════════════════════════════
    echo ✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!
    echo ════════════════════════════════════════════════
    echo.
)

:START_CRM
echo.
echo 🚀 Abrindo Dashboard do CRM...
echo ════════════════════════════════════════════════
start "" "CRM.html"
echo.
echo ✅ CRM iniciado! Verifique seu navegador.
echo.
echo Janela encerrando em 5 segundos...
echo (Pressione qualquer tecla para fechar agora)
timeout /t 5
exit
