#!/bin/bash

# ========================================
# SCRIPT DE DESPLIEGUE A PRODUCCIÓN - AXYRA
# ========================================

echo "🚀 Iniciando despliegue a producción de AXYRA..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] ✅${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] ⚠️${NC} $1"
}

print_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ❌${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI no está instalado. Instálalo con: npm install -g vercel"
    exit 1
fi

print_message "Verificando archivos de configuración..."

# Verificar archivos críticos
required_files=(
    "firestore.rules"
    "firestore.indexes.json"
    "firebase.json"
    "vercel.json"
    "storage.rules"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Archivo requerido no encontrado: $file"
        exit 1
    fi
done

print_success "Todos los archivos de configuración están presentes"

# Verificar que el usuario está autenticado en Firebase
print_message "Verificando autenticación de Firebase..."
if ! firebase projects:list &> /dev/null; then
    print_error "No estás autenticado en Firebase. Ejecuta: firebase login"
    exit 1
fi

print_success "Autenticación de Firebase verificada"

# Verificar que el usuario está autenticado en Vercel
print_message "Verificando autenticación de Vercel..."
if ! vercel whoami &> /dev/null; then
    print_error "No estás autenticado en Vercel. Ejecuta: vercel login"
    exit 1
fi

print_success "Autenticación de Vercel verificada"

# Desplegar reglas de Firestore
print_message "Desplegando reglas de Firestore..."
if firebase deploy --only firestore:rules; then
    print_success "Reglas de Firestore desplegadas correctamente"
else
    print_error "Error desplegando reglas de Firestore"
    exit 1
fi

# Desplegar índices de Firestore
print_message "Desplegando índices de Firestore..."
if firebase deploy --only firestore:indexes; then
    print_success "Índices de Firestore desplegados correctamente"
else
    print_error "Error desplegando índices de Firestore"
    exit 1
fi

# Desplegar reglas de Storage
print_message "Desplegando reglas de Storage..."
if firebase deploy --only storage; then
    print_success "Reglas de Storage desplegadas correctamente"
else
    print_error "Error desplegando reglas de Storage"
    exit 1
fi

# Desplegar Cloud Functions
print_message "Desplegando Cloud Functions..."
if firebase deploy --only functions; then
    print_success "Cloud Functions desplegadas correctamente"
else
    print_error "Error desplegando Cloud Functions"
    exit 1
fi

# Desplegar hosting en Firebase
print_message "Desplegando hosting en Firebase..."
if firebase deploy --only hosting; then
    print_success "Hosting de Firebase desplegado correctamente"
else
    print_error "Error desplegando hosting de Firebase"
    exit 1
fi

# Desplegar en Vercel
print_message "Desplegando en Vercel..."
if vercel --prod; then
    print_success "Despliegue en Vercel completado correctamente"
else
    print_error "Error desplegando en Vercel"
    exit 1
fi

# Verificar despliegue
print_message "Verificando despliegue..."

# Obtener URL de Firebase
firebase_url=$(firebase hosting:channel:list | grep "live" | awk '{print $2}')
if [ -n "$firebase_url" ]; then
    print_success "URL de Firebase: https://$firebase_url"
fi

# Obtener URL de Vercel
vercel_url=$(vercel ls | grep "axyra-sistema-gestion" | awk '{print $2}')
if [ -n "$vercel_url" ]; then
    print_success "URL de Vercel: https://$vercel_url"
fi

# Mostrar resumen
print_success "🎉 Despliegue a producción completado exitosamente!"
echo ""
echo "📋 Resumen del despliegue:"
echo "  ✅ Reglas de Firestore desplegadas"
echo "  ✅ Índices de Firestore desplegados"
echo "  ✅ Reglas de Storage desplegadas"
echo "  ✅ Cloud Functions desplegadas"
echo "  ✅ Hosting de Firebase desplegado"
echo "  ✅ Aplicación desplegada en Vercel"
echo ""
echo "🔗 URLs de acceso:"
if [ -n "$firebase_url" ]; then
    echo "  Firebase: https://$firebase_url"
fi
if [ -n "$vercel_url" ]; then
    echo "  Vercel: https://$vercel_url"
fi
echo ""
echo "📝 Próximos pasos:"
echo "  1. Verificar que todas las funcionalidades funcionan correctamente"
echo "  2. Probar el sistema de pagos con Wompi y PayPal"
echo "  3. Verificar que la gestión de empleados funciona correctamente"
echo "  4. Probar el cuadre de caja"
echo "  5. Configurar monitoreo y alertas"
echo ""
print_success "¡Despliegue completado! 🚀"
