#!/bin/bash

# ========================================
# SCRIPT DE DESPLIEGUE AXYRA
# ========================================

echo "🚀 Iniciando despliegue de AXYRA..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes
print_message() {
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
if [ ! -f "package.json" ]; then
    print_error "No se encontró package.json. Asegúrate de estar en el directorio raíz del proyecto."
    exit 1
fi

# Verificar que Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Verificar que Firebase CLI está instalado
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI no está instalado. Instalando..."
    npm install -g firebase-tools
fi

# Instalar dependencias
print_message "Instalando dependencias..."
npm install

# Verificar variables de entorno
print_message "Verificando configuración..."

if [ ! -f ".env.local" ]; then
    print_warning "Archivo .env.local no encontrado. Creando desde .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        print_warning "Por favor, configura las variables de entorno en .env.local"
    else
        print_error "No se encontró .env.example"
        exit 1
    fi
fi

# Preguntar al usuario qué tipo de despliegue quiere
echo ""
echo "¿Qué tipo de despliegue quieres realizar?"
echo "1) Vercel (recomendado)"
echo "2) Firebase Hosting"
echo "3) Ambos"
echo ""
read -p "Selecciona una opción (1-3): " choice

case $choice in
    1)
        deploy_vercel
        ;;
    2)
        deploy_firebase
        ;;
    3)
        deploy_vercel
        deploy_firebase
        ;;
    *)
        print_error "Opción inválida"
        exit 1
        ;;
esac

# Función para desplegar en Vercel
deploy_vercel() {
    print_message "Desplegando en Vercel..."
    
    # Verificar si ya está configurado Vercel
    if [ ! -f ".vercel/project.json" ]; then
        print_message "Configurando proyecto en Vercel..."
        vercel --yes
    fi
    
    # Desplegar
    print_message "Desplegando a producción..."
    vercel --prod
    
    if [ $? -eq 0 ]; then
        print_success "Despliegue en Vercel completado exitosamente"
        print_message "Tu aplicación estará disponible en: https://tu-proyecto.vercel.app"
    else
        print_error "Error en el despliegue de Vercel"
        exit 1
    fi
}

# Función para desplegar en Firebase
deploy_firebase() {
    print_message "Desplegando en Firebase Hosting..."
    
    # Verificar si Firebase está configurado
    if [ ! -f ".firebaserc" ]; then
        print_message "Configurando Firebase..."
        firebase init hosting
    fi
    
    # Usar configuración personalizada
    if [ -f "firebase-hosting.json" ]; then
        print_message "Usando configuración personalizada de Firebase..."
        cp firebase-hosting.json firebase.json
    fi
    
    # Desplegar
    print_message "Desplegando a Firebase Hosting..."
    firebase deploy --only hosting
    
    if [ $? -eq 0 ]; then
        print_success "Despliegue en Firebase completado exitosamente"
        print_message "Tu aplicación estará disponible en: https://tu-proyecto.web.app"
    else
        print_error "Error en el despliegue de Firebase"
        exit 1
    fi
}

# Función para configurar Firebase
setup_firebase() {
    print_message "Configurando Firebase..."
    
    # Iniciar sesión en Firebase
    firebase login
    
    # Inicializar proyecto
    firebase init
    
    print_success "Firebase configurado correctamente"
}

# Función para configurar Vercel
setup_vercel() {
    print_message "Configurando Vercel..."
    
    # Iniciar sesión en Vercel
    vercel login
    
    # Configurar proyecto
    vercel
    
    print_success "Vercel configurado correctamente"
}

# Función para mostrar ayuda
show_help() {
    echo "Uso: ./deploy.sh [opción]"
    echo ""
    echo "Opciones:"
    echo "  deploy          Desplegar la aplicación"
    echo "  setup-firebase  Configurar Firebase"
    echo "  setup-vercel    Configurar Vercel"
    echo "  help            Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  ./deploy.sh deploy"
    echo "  ./deploy.sh setup-firebase"
    echo "  ./deploy.sh setup-vercel"
}

# Procesar argumentos de línea de comandos
case "${1:-deploy}" in
    "deploy")
        # Ya está implementado arriba
        ;;
    "setup-firebase")
        setup_firebase
        ;;
    "setup-vercel")
        setup_vercel
        ;;
    "help"|"-h"|"--help")
        show_help
        ;;
    *)
        print_error "Opción desconocida: $1"
        show_help
        exit 1
        ;;
esac

print_success "¡Despliegue completado! 🎉"
