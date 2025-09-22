#!/bin/bash

# Script para desplegar reglas e índices de Firestore completos
echo "🔥 Desplegando reglas e índices de Firestore completos..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar mensajes
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

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "firebase.json" ]; then
    print_error "No se encontró firebase.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# 2. Verificar que Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools"
    exit 1
fi

# 3. Verificar que estamos logueados
print_info "Verificando autenticación de Firebase..."
firebase projects:list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    print_warning "No estás logueado en Firebase. Iniciando login..."
    firebase login
fi

# 4. Desplegar reglas de Firestore
print_info "Desplegando reglas de Firestore..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    print_status "Reglas de Firestore desplegadas correctamente"
else
    print_error "Error desplegando reglas de Firestore"
    exit 1
fi

# 5. Desplegar índices de Firestore
print_info "Desplegando índices de Firestore..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    print_status "Índices de Firestore desplegados correctamente"
else
    print_error "Error desplegando índices de Firestore"
    exit 1
fi

# 6. Desplegar reglas de Storage
print_info "Desplegando reglas de Storage..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    print_status "Reglas de Storage desplegadas correctamente"
else
    print_error "Error desplegando reglas de Storage"
    exit 1
fi

# 7. Desplegar Functions
print_info "Desplegando Firebase Functions..."
firebase deploy --only functions

if [ $? -eq 0 ]; then
    print_status "Firebase Functions desplegadas correctamente"
else
    print_error "Error desplegando Firebase Functions"
    exit 1
fi

# 8. Verificar despliegue
print_info "Verificando despliegue..."
echo "🔍 URLs de despliegue:"
echo "   Firebase Console: https://console.firebase.google.com/project/axyra-48238"
echo "   Firestore Rules: https://console.firebase.google.com/project/axyra-48238/firestore/rules"
echo "   Firestore Indexes: https://console.firebase.google.com/project/axyra-48238/firestore/indexes"
echo "   Functions: https://console.firebase.google.com/project/axyra-48238/functions"

# 9. Mensaje final
print_status "🎉 ¡Despliegue de Firebase completado exitosamente!"
print_warning "Recuerda verificar que todas las reglas e índices estén funcionando correctamente"

echo ""
echo "📋 Próximos pasos:"
echo "1. Verificar reglas en Firebase Console"
echo "2. Verificar índices en Firebase Console"
echo "3. Probar las funciones de Firebase"
echo "4. Configurar variables de entorno en Vercel"
echo "5. Desplegar a Vercel"
echo ""


