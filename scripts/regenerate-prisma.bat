@echo off
echo ============================================
echo Regenerando Cliente de Prisma
echo ============================================
echo.
echo Cerrando todos los procesos de Node.js...
taskkill /IM node.exe /F >nul 2>&1
if %errorlevel% equ 0 (
    echo Procesos de Node.js cerrados exitosamente.
) else (
    echo No se encontraron procesos de Node.js en ejecucion.
)
echo.
echo Esperando 3 segundos para asegurar que los procesos se cierren...
timeout /t 3 /nobreak >nul
echo.
echo Regenerando cliente de Prisma para todos los servicios...
cd shared\prisma
npx prisma generate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: No se pudo regenerar el cliente de Prisma.
    echo Asegurate de que no haya otros procesos usando los archivos.
    pause
    exit /b %errorlevel%
)
cd ..\..
echo.
echo ============================================
echo Cliente regenerado exitosamente
echo ============================================
echo Ahora puedes reiniciar todos los servicios.
pause

