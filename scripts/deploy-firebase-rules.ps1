# Script para desplegar reglas e índices de Firebase en Windows
# Uso: .\scripts\deploy-firebase-rules.ps1

Write-Host "🚀 Iniciando despliegue de reglas e índices de Firebase..." -ForegroundColor Green
Write-Host ""

# Verificar que Firebase CLI esté instalado
try {
    $firebaseVersion = firebase --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase CLI detectado: $firebaseVersion" -ForegroundColor Green
    } else {
        throw "Firebase CLI no encontrado"
    }
} catch {
    Write-Host "❌ Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools" -ForegroundColor Red
    exit 1
}

# Verificar que estemos en el directorio correcto
if (-not (Test-Path "firebase.json")) {
    Write-Host "❌ No se encontró firebase.json. Ejecuta este script desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}

# Verificar que los archivos de reglas existan
$requiredFiles = @(
    "firestore.rules",
    "firestore.indexes.json", 
    "storage.rules"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Host "❌ No se encontró $file" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Archivos de reglas encontrados" -ForegroundColor Green

try {
    # Desplegar reglas de Firestore
    Write-Host "`n📋 Desplegando reglas de Firestore..." -ForegroundColor Yellow
    firebase deploy --only firestore:rules
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Reglas de Firestore desplegadas" -ForegroundColor Green
    } else {
        throw "Error desplegando reglas de Firestore"
    }

    # Desplegar índices de Firestore
    Write-Host "`n📊 Desplegando índices de Firestore..." -ForegroundColor Yellow
    firebase deploy --only firestore:indexes
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Índices de Firestore desplegados" -ForegroundColor Green
    } else {
        throw "Error desplegando índices de Firestore"
    }

    # Desplegar reglas de Storage
    Write-Host "`n💾 Desplegando reglas de Storage..." -ForegroundColor Yellow
    firebase deploy --only storage
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Reglas de Storage desplegadas" -ForegroundColor Green
    } else {
        throw "Error desplegando reglas de Storage"
    }

    Write-Host "`n🎉 ¡Despliegue completado exitosamente!" -ForegroundColor Green
    Write-Host "`n📝 Resumen:" -ForegroundColor Cyan
    Write-Host "   • Reglas de Firestore ✅" -ForegroundColor Green
    Write-Host "   • Índices de Firestore ✅" -ForegroundColor Green
    Write-Host "   • Reglas de Storage ✅" -ForegroundColor Green
    
    Write-Host "`n🔗 Verifica el estado en: https://console.firebase.google.com/" -ForegroundColor Blue
    
} catch {
    Write-Host "`n❌ Error durante el despliegue: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
