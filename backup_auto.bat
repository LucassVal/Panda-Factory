@echo off
echo.
echo ========================================
echo   BACKUP AUTOMATICO - CRM.html
echo ========================================
echo.

set TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%
set TIMESTAMP=%TIMESTAMP: =0%

set SOURCE=CRM.html
set DEST=exports\CRM_BACKUP_%TIMESTAMP%.html

echo [1/3] Verificando arquivo fonte...
if not exist "%SOURCE%" (
    echo ❌ ERRO: CRM.html nao encontrado!
    pause
    exit /b 1
)

echo [2/3] Criando backup...
copy "%SOURCE%" "%DEST%" >nul

if %ERRORLEVEL% NEQ 0 (
    echo ❌ ERRO: Falha ao criar backup!
    pause
    exit /b 1
)

echo [3/3] Validando backup...
for %%A in ("%SOURCE%") do set SIZE_SOURCE=%%~zA
for %%A in ("%DEST%") do set SIZE_DEST=%%~zA

if %SIZE_SOURCE% NEQ %SIZE_DEST% (
    echo ⚠️  AVISO: Tamanhos diferentes!
    echo    Original: %SIZE_SOURCE% bytes
    echo    Backup:   %SIZE_DEST% bytes
) else (
    echo ✅ Backup validado!
)

echo.
echo ========================================
echo   Backup criado com sucesso!
echo ========================================
echo.
echo 📁 Arquivo: %DEST%
echo 📊 Tamanho: %SIZE_DEST% bytes
echo 🕐 Data/Hora: %date% %time:~0,8%
echo.
echo IMPORTANTE: Verifique se o backup abre no navegador antes de editar!
echo.
pause
