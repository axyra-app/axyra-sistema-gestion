#!/bin/bash

# Script de despliegue completo para producción
echo "🚀 Iniciando despliegue completo de AXYRA..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# 1. Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# 2. Instalar dependencias
print_status "Instalando dependencias..."
npm install

# 3. Desplegar Firebase Functions
print_status "Desplegando Firebase Functions..."
firebase deploy --only functions

if [ $? -eq 0 ]; then
    print_status "Firebase Functions desplegadas correctamente"
else
    print_error "Error desplegando Firebase Functions"
    exit 1
fi

# 4. Desplegar Firestore Rules
print_status "Desplegando Firestore Rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    print_status "Firestore Rules desplegadas correctamente"
else
    print_error "Error desplegando Firestore Rules"
    exit 1
fi

# 5. Desplegar Firestore Indexes
print_status "Desplegando Firestore Indexes..."
firebase deploy --only firestore:indexes

if [ $? -eq 0 ]; then
    print_status "Firestore Indexes desplegados correctamente"
else
    print_error "Error desplegando Firestore Indexes"
    exit 1
fi

# 6. Desplegar Storage Rules
print_status "Desplegando Storage Rules..."
firebase deploy --only storage

if [ $? -eq 0 ]; then
    print_status "Storage Rules desplegadas correctamente"
else
    print_error "Error desplegando Storage Rules"
    exit 1
fi

# 7. Desplegar a Vercel
print_status "Desplegando a Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    print_status "Despliegue a Vercel completado"
else
    print_error "Error desplegando a Vercel"
    exit 1
fi

# 8. Verificar despliegue
print_status "Verificando despliegue..."
echo "🔍 URLs de despliegue:"
echo "   Frontend: https://axyra.vercel.app"
echo "   Firebase Functions: https://us-central1-axyra-48238.cloudfunctions.net"

# 9. Mensaje final
print_status "🎉 ¡Despliegue completo exitoso!"
print_warning "Recuerda configurar las variables de entorno en Vercel Dashboard"
print_warning "Recuerda configurar los webhooks en Wompi y PayPal"

echo ""
echo "📋 Próximos pasos:"
echo "1. Configurar variables de entorno en Vercel"
echo "2. Configurar webhooks de pagos"
echo "3. Probar la aplicación en producción"
echo "4. Configurar monitoreo y alertas"
echo ""







