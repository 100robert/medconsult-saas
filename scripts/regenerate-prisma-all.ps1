# Script para regenerar el cliente de Prisma en todos los servicios
# Este script modifica temporalmente el schema.prisma para cada servicio

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Regenerando Cliente de Prisma" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Cerrar todos los procesos de Node.js
Write-Host "Cerrando todos los procesos de Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "Procesos de Node.js cerrados." -ForegroundColor Green
} else {
    Write-Host "No se encontraron procesos de Node.js." -ForegroundColor Gray
}

Write-Host ""
Write-Host "Esperando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Servicios que necesitan el cliente de Prisma
$services = @(
    "auth-service",
    "users-service",
    "appointments-service",
    "consultations-service",
    "audit-service",
    "notifications-service",
    "reviews-service",
    "payments-service"
)

$schemaPath = "shared\prisma\schema.prisma"
$schemaContent = Get-Content $schemaPath -Raw

# Leer el schema original
$originalSchema = Get-Content $schemaPath -Raw

Write-Host ""
Write-Host "Regenerando cliente de Prisma para cada servicio..." -ForegroundColor Cyan
Write-Host ""

foreach ($service in $services) {
    Write-Host "Generando cliente para: $service" -ForegroundColor Yellow
    
    # Modificar el output en el schema temporalmente
    $outputPath = "../../services/$service/node_modules/.prisma/client"
    $modifiedSchema = $originalSchema -replace 'output\s*=\s*"[^"]*"', "output   = `"$outputPath`""
    
    # Escribir el schema modificado
    Set-Content -Path $schemaPath -Value $modifiedSchema -NoNewline
    
    # Generar el cliente
    Push-Location "shared\prisma"
    $result = & npx prisma generate 2>&1
    Pop-Location
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] Cliente generado para $service" -ForegroundColor Green
    } else {
        Write-Host "  [ERROR] Error al generar cliente para $service" -ForegroundColor Red
        Write-Host $result -ForegroundColor Red
    }
}

# Restaurar el schema original (con output para auth-service)
$originalSchema | Set-Content -Path $schemaPath -NoNewline

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Cliente regenerado para todos los servicios" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora puedes reiniciar todos los servicios." -ForegroundColor Yellow
Write-Host ""

