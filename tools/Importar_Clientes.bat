@echo off
chcp 65001 >nul
color 0A
title 🤖 CRM - Importação Automática de Clientes

echo.
echo ═══════════════════════════════════════════════════════
echo    🤖 CRM - IMPORTAÇÃO AUTOMÁTICA DE CLIENTES
echo ═══════════════════════════════════════════════════════
echo.
echo 📊 Iniciando scraper do Guia da Construção...
echo.

REM Navegar para pasta de scripts
cd /d "%~dp0scripts"

REM Executar scraper Python
echo ⏳ Executando scraper... (isso pode levar 2-5 minutos)
echo.
python scraper_guia_automatico.py

REM Verificar se teve sucesso
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ ERRO: Scraper falhou!
    echo.
    echo Possíveis causas:
    echo - Python não instalado
    echo - Playwright não instalado
    echo - Credenciais incorretas
    echo - Problema de conexão
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Scraper concluído com sucesso!
echo.
echo 🌐 Abrindo CRM no navegador...
echo.

REM Voltar para raiz do CRM
cd /d "%~dp0"

REM Abrir CRM no navegador padrão
start "" "CRM.html"

echo.
echo ═══════════════════════════════════════════════════════
echo    ✅ PROCESSO CONCLUÍDO!
echo ═══════════════════════════════════════════════════════
echo.
echo 📌 Próximos passos no navegador:
echo    1. Sistema CRM vai abrir automaticamente
echo    2. Clique no botão "🤖 Importar Automático"
echo    3. Novos clientes serão importados!
echo.
echo ═══════════════════════════════════════════════════════
echo.
timeout /t 3 >nul
