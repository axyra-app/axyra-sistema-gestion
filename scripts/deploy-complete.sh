#!/bin/bash

# ========================================
# SCRIPT DE DESPLIEGUE COMPLETO AXYRA
# ========================================

echo "🚀 Iniciando despliegue completo de AXYRA..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "vercel.json" ]; then
    print_error "No se encontró vercel.json. Ejecuta desde el directorio raíz del proyecto."
    exit 1
fi

# Paso 1: Verificar dependencias
print_status "Verificando dependencias..."
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Paso 2: Verificar configuración de Firebase
print_status "Verificando configuración de Firebase..."
if [ ! -f "firebase.json" ]; then
    print_error "No se encontró firebase.json"
    exit 1
fi

if [ ! -f "firestore.rules" ]; then
    print_error "No se encontró firestore.rules"
    exit 1
fi

if [ ! -f "firestore.indexes.json" ]; then
    print_error "No se encontró firestore.indexes.json"
    exit 1
fi

# Paso 3: Desplegar reglas de Firebase
print_status "Desplegando reglas de Firebase..."
firebase deploy --only firestore:rules,firestore:indexes,storage:rules

if [ $? -eq 0 ]; then
    print_success "Reglas de Firebase desplegadas correctamente"
else
    print_error "Error desplegando reglas de Firebase"
    exit 1
fi

# Paso 4: Verificar configuración de Vercel
print_status "Verificando configuración de Vercel..."
if [ ! -f "vercel.json" ]; then
    print_error "No se encontró vercel.json"
    exit 1
fi

# Paso 5: Desplegar en Vercel
print_status "Desplegando en Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_success "Desplegado en Vercel correctamente"
else
    print_error "Error desplegando en Vercel"
    exit 1
fi

# Paso 6: Verificar despliegue
print_status "Verificando despliegue..."
vercel ls

# Paso 7: Mostrar información del despliegue
print_success "Despliegue completado exitosamente!"
echo ""
echo "📊 Información del despliegue:"
echo "  - Frontend: Vercel"
echo "  - Backend: Firebase"
echo "  - Base de datos: Firestore"
echo "  - Storage: Firebase Storage"
echo "  - Seguridad: Reglas configuradas"
echo ""
echo "🔗 Enlaces útiles:"
echo "  - Vercel Dashboard: https://vercel.com/dashboard"
echo "  - Firebase Console: https://console.firebase.google.com"
echo "  - Documentación: ./GUIA_DESPLIEGUE_COMPLETA.md"
echo ""
print_success "¡AXYRA está listo para producción! 🎉"
