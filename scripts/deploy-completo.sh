#!/bin/bash

# Script para desplegar TODO el sistema completo
echo "🚀 Desplegando AXYRA Sistema de Gestión COMPLETO..."

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

print_status() {
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

print_step() {
    echo -e "${PURPLE}🔧 $1${NC}"
}

# 1. Verificar directorio
if [ ! -f "firebase.json" ]; then
    print_error "No se encontró firebase.json. Asegúrate de estar en el directorio raíz."
    exit 1
fi

# 2. Backup de archivos existentes
print_step "Creando backup de archivos existentes..."
cp firestore.rules firestore.rules.backup
cp firestore.indexes.json firestore.indexes.json.backup
print_status "Backup creado"

# 3. Reemplazar con archivos completos
print_step "Reemplazando con archivos completos..."
cp firestore-rules-completas.rules firestore.rules
cp firestore-indexes-completos.json firestore.indexes.json
print_status "Archivos reemplazados"

# 4. Verificar Firebase CLI
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# 5. Verificar autenticación
print_info "Verificando autenticación de Firebase..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_warning "No estás logueado en Firebase. Iniciando login..."
    firebase login
fi

# 6. Desplegar reglas de Firestore
print_step "Desplegando reglas de Firestore completas..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    print_status "Reglas de Firestore desplegadas correctamente"
else
    print_error "Error desplegando reglas de Firestore"
    exit 1
fi

# 7. Desplegar índices de Firestore
print_step "Desplegando índices de Firestore completos..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    print_status "Índices de Firestore desplegados correctamente"
else
    print_error "Error desplegando índices de Firestore"
    exit 1
fi

# 8. Desplegar reglas de Storage
print_step "Desplegando reglas de Storage..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    print_status "Reglas de Storage desplegadas correctamente"
else
    print_error "Error desplegando reglas de Storage"
    exit 1
fi

# 9. Desplegar Functions
print_step "Desplegando Firebase Functions..."
firebase deploy --only functions

if [ $? -eq 0 ]; then
    print_status "Firebase Functions desplegadas correctamente"
else
    print_error "Error desplegando Firebase Functions"
    exit 1
fi

# 10. Desplegar a Vercel
print_step "Desplegando a Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_status "Despliegue a Vercel completado"
else
    print_error "Error desplegando a Vercel"
    exit 1
fi

# 11. Verificar despliegue
print_info "Verificando despliegue completo..."
echo "🔍 URLs de despliegue:"
echo "   Frontend: https://axyra.vercel.app"
echo "   Firebase Console: https://console.firebase.google.com/project/axyra-48238"
echo "   Firestore Rules: https://console.firebase.google.com/project/axyra-48238/firestore/rules"
echo "   Firestore Indexes: https://console.firebase.google.com/project/axyra-48238/firestore/indexes"
echo "   Functions: https://console.firebase.google.com/project/axyra-48238/functions"

# 12. Mensaje final
print_status "🎉 ¡Despliegue COMPLETO exitoso!"
print_warning "Recuerda configurar las variables de entorno en Vercel Dashboard"

echo ""
echo "📋 Resumen del despliegue:"
echo "✅ Reglas de Firestore: 30+ colecciones"
echo "✅ Índices de Firestore: 30+ índices compuestos + 10+ campos únicos"
echo "✅ Reglas de Storage: Configuradas"
echo "✅ Firebase Functions: Desplegadas"
echo "✅ Frontend Vercel: Desplegado"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Configurar variables de entorno en Vercel"
echo "2. Configurar webhooks de pagos"
echo "3. Probar la aplicación completa"
echo "4. Configurar monitoreo y alertas"
echo ""


