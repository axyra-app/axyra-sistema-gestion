@echo off
SETLOCAL
echo =========================================
echo   AXYRA - CONFIGURACION DE VERCEL
echo =========================================
echo.

REM Verificar si Vercel CLI está instalado
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI no está instalado
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
    if %errorlevel% neq 0 (
        echo ❌ Error instalando Vercel CLI
        pause
        exit /b 1
    )
)

echo ✅ Vercel CLI instalado correctamente
echo.

REM Configurar variables de entorno en Vercel
echo 🔧 Configurando variables de entorno en Vercel...
echo.

REM Firebase Configuration
echo 📱 Configurando Firebase...
vercel env add FIREBASE_API_KEY production
vercel env add FIREBASE_AUTH_DOMAIN production
vercel env add FIREBASE_PROJECT_ID production
vercel env add FIREBASE_STORAGE_BUCKET production
vercel env add FIREBASE_MESSAGING_SENDER_ID production
vercel env add FIREBASE_APP_ID production
vercel env add FIREBASE_MEASUREMENT_ID production
vercel env add FIREBASE_DATABASE_URL production

REM EmailJS Configuration
echo 📧 Configurando EmailJS...
vercel env add EMAILJS_SERVICE_ID production
vercel env add EMAILJS_TEMPLATE_ID production
vercel env add EMAILJS_PUBLIC_KEY production
vercel env add EMAILJS_USER_ID production

REM Email Configuration
echo 📨 Configurando Email...
vercel env add EMAIL_FROM_NAME production
vercel env add EMAIL_FROM_EMAIL production
vercel env add EMAIL_REPLY_TO production
vercel env add EMAIL_SUBJECT_PREFIX production

REM Security Configuration
echo 🔒 Configurando Seguridad...
vercel env add JWT_SECRET production
vercel env add ENCRYPTION_KEY production
vercel env add SESSION_SECRET production

REM Application Configuration
echo ⚙️ Configurando Aplicación...
vercel env add NODE_ENV production
vercel env add PORT production
vercel env add API_BASE_URL production
vercel env add FRONTEND_URL production

REM Monitoring Configuration
echo 📊 Configurando Monitoreo...
vercel env add MONITORING_ENABLED production
vercel env add METRICS_ENABLED production
vercel env add ALERT_EMAIL production
vercel env add MONITORING_INTERVAL production

REM Backup Configuration
echo 💾 Configurando Backup...
vercel env add BACKUP_ENABLED production
vercel env add BACKUP_FREQUENCY production
vercel env add BACKUP_RETENTION_DAYS production
vercel env add BACKUP_NOTIFICATION_EMAIL production

echo.
echo ✅ Variables de entorno configuradas en Vercel
echo.
echo 🚀 Desplegando proyecto...
vercel --prod

echo.
echo ✅ ¡CONFIGURACIÓN COMPLETA!
echo.
echo 📋 PRÓXIMOS PASOS:
echo 1. Verifica las variables en el dashboard de Vercel
echo 2. Prueba el sistema en producción
echo 3. Verifica que los emails funcionen
echo.
pause
ENDLOCAL

