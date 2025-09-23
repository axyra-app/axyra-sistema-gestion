#!/bin/bash

# Script para agregar SOLO las reglas e índices faltantes
echo "🔧 Agregando solo las reglas e índices faltantes..."

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# 1. Agregar reglas faltantes al archivo principal
print_status "Agregando reglas faltantes..."
cat firestore-rules-faltantes.rules >> firestore.rules

# 2. Agregar índices faltantes al archivo principal
print_status "Agregando índices faltantes..."
# Aquí necesitarías un script más complejo para fusionar JSONs
# Por ahora, te doy las instrucciones manuales

print_warning "Para agregar los índices faltantes:"
echo "1. Ve a Firebase Console → Firestore → Indexes"
echo "2. Crea estos 5 índices manualmente:"
echo "   - backups: tipo (ASC) + fechaCreacion (DESC)"
echo "   - movimientos_inventario: userId (ASC) + fecha (DESC)"
echo "   - subscriptions: userId (ASC) + fechaInicio (DESC)"
echo "   - subscriptions: userId (ASC) + estado (ASC)"
echo "   - sistema: categoria (ASC) + fechaActualizacion (DESC)"

print_status "¡Reglas agregadas! Solo faltan los 5 índices manuales."







