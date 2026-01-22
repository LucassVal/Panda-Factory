@echo off
echo ===================================================
echo   INICIANDO TITAN GESTAO CRM LOCAL SERVER
echo ===================================================
echo.
echo 1. Iniciando servidor Python na porta 8080...
start "SERVIDOR CRM" /min python -m http.server 8080
echo.
echo 2. Aguardando inicializacao...
timeout /t 2 /nobreak >nul
echo.
echo 3. Abrindo navegador...
start http://localhost:8080/CRM.html
echo.
echo ===================================================
echo   SISTEMA ONLINE!
echo   Pode minimizar esta janela, mas NAO FECHE.
echo ===================================================
pause
