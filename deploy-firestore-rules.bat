@echo off
echo 🔥 Desplegando reglas de Firestore...

firebase deploy --only firestore:rules

if %errorlevel% equ 0 (
    echo ✅ Reglas de Firestore desplegadas correctamente
) else (
    echo ❌ Error desplegando reglas de Firestore
)

pause
