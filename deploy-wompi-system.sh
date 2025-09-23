#!/bin/bash

# ========================================
# DESPLIEGUE SISTEMA REAL WOMPI - AXYRA
# ========================================

echo "🚀 Iniciando despliegue del sistema real de pagos Wompi..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con color
print_message() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

print_info "Directorio de trabajo: $(pwd)"

# 1. Instalar dependencias
print_info "Instalando dependencias..."
npm install
if [ $? -eq 0 ]; then
    print_message "Dependencias instaladas correctamente"
else
    print_error "Error instalando dependencias"
    exit 1
fi

# 2. Verificar archivos del sistema Wompi
print_info "Verificando archivos del sistema Wompi..."

files_to_check=(
    "api/wompi-webhook.js"
    "functions/subscription-renewal.js"
    "functions/email-notifications.js"
    "frontend/static/wompi-integration-real.js"
    "frontend/static/subscription-manager.js"
    "frontend/static/subscription-monitoring.js"
    "vercel-wompi-config.json"
    "SISTEMA_PAGOS_REAL.md"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        print_message "✓ $file"
    else
        print_error "✗ $file - ARCHIVO FALTANTE"
        exit 1
    fi
done

# 3. Verificar configuración de Firebase
print_info "Verificando configuración de Firebase..."
if [ -f "firebase.json" ]; then
    print_message "✓ firebase.json encontrado"
else
    print_error "✗ firebase.json no encontrado"
    exit 1
fi

# 4. Verificar configuración de Vercel
print_info "Verificando configuración de Vercel..."
if [ -f "vercel.json" ]; then
    print_message "✓ vercel.json encontrado"
else
    print_warning "⚠️  vercel.json no encontrado, creando uno básico..."
    cat > vercel.json << EOF
{
  "version": 2,
  "functions": {
    "api/*.js": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ]
}
EOF
    print_message "✓ vercel.json creado"
fi

# 5. Desplegar a Vercel
print_info "Desplegando a Vercel..."
vercel --prod --yes
if [ $? -eq 0 ]; then
    print_message "Despliegue a Vercel exitoso"
else
    print_error "Error desplegando a Vercel"
    exit 1
fi

# 6. Desplegar Cloud Functions a Firebase
print_info "Desplegando Cloud Functions a Firebase..."
firebase deploy --only functions
if [ $? -eq 0 ]; then
    print_message "Cloud Functions desplegadas correctamente"
else
    print_error "Error desplegando Cloud Functions"
    exit 1
fi

# 7. Verificar variables de entorno
print_info "Verificando variables de entorno en Vercel..."
vercel env ls
if [ $? -eq 0 ]; then
    print_message "Variables de entorno listadas"
else
    print_warning "No se pudieron listar las variables de entorno"
fi

# 8. Mostrar resumen del despliegue
print_info "Resumen del despliegue:"
echo ""
echo "🌐 Aplicación: https://axyra.vercel.app"
echo "🔗 Webhook Wompi: https://axyra.vercel.app/api/wompi-webhook"
echo "📊 Dashboard: https://axyra.vercel.app/modulos/dashboard/dashboard.html"
echo "💳 Membresías: https://axyra.vercel.app/modulos/membresias/membresias.html"
echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar variables de entorno en Vercel"
echo "2. Obtener credenciales de Wompi para producción"
echo "3. Configurar webhook en Wompi"
echo "4. Realizar pruebas de pago"
echo "5. Configurar notificaciones por email"
echo ""
echo "📚 Documentación: SISTEMA_PAGOS_REAL.md"
echo "⚙️  Configuración: vercel-wompi-config.json"
echo ""

# 9. Crear archivo de estado del despliegue
cat > DEPLOY_STATUS_WOMPI.md << EOF
# 🚀 ESTADO DEL DESPLIEGUE - SISTEMA WOMPI

## ✅ COMPONENTES DESPLEGADOS:

- [x] Webhook de Wompi (\`api/wompi-webhook.js\`)
- [x] Sistema de Renovación Automática (\`functions/subscription-renewal.js\`)
- [x] Notificaciones por Email (\`functions/email-notifications.js\`)
- [x] Integración Frontend Wompi (\`frontend/static/wompi-integration-real.js\`)
- [x] Gestor de Suscripciones (\`frontend/static/subscription-manager.js\`)
- [x] Monitoreo de Suscripciones (\`frontend/static/subscription-monitoring.js\`)

## 🌐 URLs IMPORTANTES:

- **Aplicación:** https://axyra.vercel.app
- **Webhook Wompi:** https://axyra.vercel.app/api/wompi-webhook
- **Dashboard:** https://axyra.vercel.app/modulos/dashboard/dashboard.html
- **Membresías:** https://axyra.vercel.app/modulos/membresias/membresias.html

## ⚙️ CONFIGURACIÓN PENDIENTE:

### Variables de Entorno en Vercel:
\`\`\`bash
WOMPI_PUBLIC_KEY=pub_prod_xxxxxxxxx
WOMPI_PRIVATE_KEY=prv_prod_xxxxxxxxx
WOMPI_ENVIRONMENT=production
WOMPI_WEBHOOK_SECRET=webhook_secret_xxxxxxxxx
FIREBASE_PROJECT_ID=axyra-sistema-gestion
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@axyra-sistema-gestion.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://axyra-sistema-gestion-default-rtdb.firebaseio.com/
\`\`\`

### Webhook en Wompi:
- **URL:** https://axyra.vercel.app/api/wompi-webhook
- **Eventos:** transaction.updated
- **Método:** POST

## 📊 PRÓXIMOS PASOS:

1. **Configurar variables de entorno en Vercel**
2. **Obtener credenciales de Wompi para producción**
3. **Configurar webhook en Wompi**
4. **Realizar pruebas de pago**
5. **Configurar notificaciones por email**
6. **Monitorear métricas en producción**

## 📚 DOCUMENTACIÓN:

- **Sistema de Pagos:** SISTEMA_PAGOS_REAL.md
- **Configuración:** vercel-wompi-config.json
- **Estado:** DEPLOY_STATUS_WOMPI.md

---
**Desplegado el:** $(date)
**Versión:** 2.0.0
**Estado:** ✅ LISTO PARA CONFIGURACIÓN
EOF

print_message "Archivo de estado creado: DEPLOY_STATUS_WOMPI.md"

# 10. Mostrar mensaje final
echo ""
print_message "🎉 DESPLIEGUE COMPLETADO EXITOSAMENTE!"
echo ""
print_info "El sistema real de pagos Wompi ha sido desplegado correctamente."
print_info "Revisa el archivo DEPLOY_STATUS_WOMPI.md para los próximos pasos."
echo ""
print_warning "IMPORTANTE: Configura las variables de entorno en Vercel antes de usar el sistema en producción."
echo ""

# 11. Abrir documentación si es posible
if command -v open &> /dev/null; then
    print_info "Abriendo documentación..."
    open SISTEMA_PAGOS_REAL.md
elif command -v xdg-open &> /dev/null; then
    print_info "Abriendo documentación..."
    xdg-open SISTEMA_PAGOS_REAL.md
fi

print_message "¡Sistema listo para producción! 🚀"
