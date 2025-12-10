@echo off
echo ============================================
echo Regenerando Cliente de Prisma para TODOS los servicios
echo ============================================
echo.
echo IMPORTANTE: Este script requiere PowerShell
echo.
echo Cerrando todos los procesos de Node.js...
taskkill /IM node.exe /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Procesos de Node.js cerrados exitosamente.
) else (
    echo No se encontraron procesos de Node.js en ejecucion.
)
echo.
echo Esperando 3 segundos...
timeout /t 3 /nobreak >nul
echo.
echo Ejecutando script de PowerShell...
powershell -ExecutionPolicy Bypass -File "%~dp0regenerate-prisma-all.ps1"
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo ejecutar el script de PowerShell.
    pause
    exit /b %errorlevel%
)
pause

