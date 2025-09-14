@echo off
echo ========================================
echo    DESPLIEGUE AUTOMATICO AXYRA
echo ========================================

echo.
echo [1/5] Verificando archivos duplicados...
call node -e "const fs = require('fs'); const path = require('path'); const duplicates = []; const files = []; function scanDir(dir) { const items = fs.readdirSync(dir); items.forEach(item => { const fullPath = path.join(dir, item); const stat = fs.statSync(fullPath); if (stat.isDirectory() && item !== 'node_modules' && item !== '.git') { scanDir(fullPath); } else if (stat.isFile()) { const fileName = path.basename(fullPath); if (files.includes(fileName)) { duplicates.push(fullPath); } else { files.push(fileName); } } }); } scanDir('.'); console.log('Archivos duplicados encontrados:', duplicates.length); duplicates.forEach(dup => console.log('  -', dup));"

echo.
echo [2/5] Limpiando archivos temporales...
if exist "frontend\\static\\temp" rmdir /s /q "frontend\\static\\temp"
if exist "frontend\\static\\cache" rmdir /s /q "frontend\\static\\cache"
if exist "frontend\\static\\logs" rmdir /s /q "frontend\\static\\logs"

echo.
echo [3/5] Verificando configuración de Firebase...
if not exist "frontend\\static\\firebase-config-secure.js" (
    echo ERROR: Archivo de configuración segura de Firebase no encontrado
    pause
    exit /b 1
)

echo.
echo [4/5] Preparando archivos para despliegue...
if exist "frontend\\package.json" (
    echo Instalando dependencias...
    cd frontend
    call npm install --production
    cd ..
)

echo.
echo [5/5] Desplegando a Vercel...
call vercel --prod --confirm

echo.
echo ========================================
echo    DESPLIEGUE COMPLETADO
echo ========================================
echo.
echo El sistema AXYRA ha sido desplegado exitosamente
echo URL: https://axyra-sistema-gestion.vercel.app
echo.
pause
