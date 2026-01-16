@echo off
chcp 65001 >nul
color 0B
title 🏢 CRM V3 - Launcher

REM === LOGGING PARA DEBUG ===
set LOG_FILE=debug_log.txt
echo === INICIO DO SCRIPT === > %LOG_FILE%
echo Data/Hora: %date% %time% >> %LOG_FILE%
echo. >> %LOG_FILE%

cd /d "%~dp0"
echo CD para: %~dp0 >> %LOG_FILE%

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
echo CHECKPOINT: Verificando idade da base >> %LOG_FILE%

REM PowerShell Check: Returns 0 if update needed (Older than 7 days), 1 if ok (Recent).
powershell -Command "$json = 'dados/clientes_crm_v2.json'; if (-not (Test-Path $json)) { exit 0 }; $last = (Get-Item $json).LastWriteTime; $days = (New-TimeSpan -Start $last -End (Get-Date)).Days; if ($days -ge 7) { Write-Host '⚠️ Base desatualizada (' $days 'dias).' -ForegroundColor Yellow; exit 0 } else { Write-Host '✅ Base atualizada (' $days 'dias atrás).' -ForegroundColor Green; exit 1 }" 2>>%LOG_FILE%

echo PowerShell ERRORLEVEL: %ERRORLEVEL% >> %LOG_FILE%

if %ERRORLEVEL% EQ 0 (
    echo CHECKPOINT: Base antiga detectada >> %LOG_FILE%
    echo.
    echo [AUTO] Base antiga. Iniciando atualização obrigatória...
    goto RUN_SCRAPER
) else (
    echo CHECKPOINT: Base recente, perguntando usuario >> %LOG_FILE%
    echo.
    echo ----------------------------------------------------
    echo [OPCIONAL] Deseja atualizar mesmo assim?
    echo (Isso permite alterar os filtros de M² agora)
    echo.
    set /p choice="👉 Atualizar agora? (S/N) [N]: "
    echo Escolha do usuario: %choice% >> %LOG_FILE%
)

if /i "%choice%"=="S" goto RUN_SCRAPER
if /i "%choice%"=="s" goto RUN_SCRAPER

echo CHECKPOINT: Usuario optou por nao atualizar >> %LOG_FILE%
echo.
echo [INFO] Mantendo dados atuais. Iniciando CRM...
goto START_CRM

:RUN_SCRAPER
echo CHECKPOINT: Iniciando scraper >> %LOG_FILE%
echo.
echo [EXECUÇÃO] Iniciando Scraper de Dados...
echo ----------------------------------------
echo ⚠️ Janela do navegador abrirá. Configure os M² quando pedido.
echo.

cd scripts
echo CD para scripts >> %LOG_FILE%
echo Executando python scraper_guia_automatico.py >> %LOG_FILE%

python scraper_guia_automatico.py 2>>../%LOG_FILE%

REM Salvar código de erro
set SCRAPER_ERROR=%ERRORLEVEL%
echo Scraper retornou codigo: %SCRAPER_ERROR% >> ../%LOG_FILE%
cd ..

if %SCRAPER_ERROR% NEQ 0 (
    echo CHECKPOINT: ERRO no scraper - codigo %SCRAPER_ERROR% >> %LOG_FILE%
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
    echo  - Unicode/Emoji encoding error (já corrigido)
    echo.
    echo 💡 SOLUÇÃO: Verifique as credenciais e tente novamente.
    echo.
    echo ════════════════════════════════════════════════
    echo.
    echo 📋 Log detalhado salvo em: %LOG_FILE%
    echo.
    echo 🔴 PRESSIONE QUALQUER TECLA PARA CONTINUAR...
    pause >nul
    echo.
    set /p continuar="👉 Deseja abrir o CRM com dados antigos? (S/N) [S]: "
    echo Usuario escolheu: %continuar% >> %LOG_FILE%
    
    if /i "%continuar%"=="N" (
        echo CHECKPOINT: Usuario cancelou >> %LOG_FILE%
        echo.
        echo ⏹️ Operação cancelada pelo usuário.
        echo.
        echo Verifique o arquivo %LOG_FILE% para mais detalhes.
        echo.
        pause
        exit /b 1
    )
    
    if /i "%continuar%"=="n" (
        echo CHECKPOINT: Usuario cancelou >> %LOG_FILE%
        echo.
        echo ⏹️ Operação cancelada pelo usuário.
        echo.
        echo Verifique o arquivo %LOG_FILE% para mais detalhes.
        echo.
        pause
        exit /b 1
    )
    
    echo CHECKPOINT: Usuario optou por continuar com dados antigos >> %LOG_FILE%
    echo.
    echo [INFO] Mantendo dados anteriores...
) else (
    echo CHECKPOINT: Scraper executou com sucesso >> %LOG_FILE%
    echo.
    echo ════════════════════════════════════════════════
    echo ✅ ATUALIZAÇÃO CONCLUÍDA COM SUCESSO!
    echo ════════════════════════════════════════════════
    echo.
)

:START_CRM
echo CHECKPOINT: Abrindo CRM >> %LOG_FILE%
echo.
echo 🚀 Abrindo Dashboard do CRM...
echo ════════════════════════════════════════════════
start "" "CRM.html"
echo CRM.html iniciado >> %LOG_FILE%
echo.
echo ✅ CRM iniciado! Verifique seu navegador.
echo.
echo 📋 Log completo salvo em: %LOG_FILE%
echo.
echo Janela encerrando em 5 segundos...
echo (Pressione qualquer tecla para fechar agora)
timeout /t 5
echo CHECKPOINT: FIM DO SCRIPT >> %LOG_FILE%
exit
