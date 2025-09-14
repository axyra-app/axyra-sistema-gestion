# 📁 NUEVA ESTRUCTURA DEL PROYECTO AXYRA

## 🏗️ **ARQUITECTURA ORGANIZADA**

```
axyra-sistema-gestion/
├── src/                          # Código fuente principal
│   ├── components/               # Componentes reutilizables
│   │   ├── ui/                  # Componentes de interfaz
│   │   ├── forms/               # Componentes de formularios
│   │   └── modals/              # Componentes de modales
│   ├── modules/                 # Módulos de negocio
│   │   ├── dashboard/           # Dashboard principal
│   │   ├── empleados/           # Gestión de empleados
│   │   ├── nomina/              # Gestión de nómina
│   │   ├── inventario/          # Gestión de inventario
│   │   └── reportes/            # Sistema de reportes
│   ├── services/                # Servicios y APIs
│   │   ├── firebase/            # Servicios de Firebase
│   │   ├── api/                 # APIs externas
│   │   └── storage/             # Servicios de almacenamiento
│   ├── utils/                   # Utilidades y helpers
│   │   ├── validators/          # Validadores
│   │   ├── formatters/          # Formateadores
│   │   └── constants/           # Constantes
│   ├── styles/                  # Estilos globales
│   │   ├── base/                # Estilos base
│   │   ├── components/          # Estilos de componentes
│   │   └── themes/              # Temas
│   └── assets/                  # Recursos estáticos
│       ├── images/              # Imágenes
│       ├── icons/               # Iconos
│       └── fonts/               # Fuentes
├── frontend/                    # Frontend actual (mantener)
│   ├── static/                  # Archivos estáticos
│   ├── modulos/                 # Módulos existentes
│   └── *.html                   # Páginas HTML
├── backend/                     # Backend Python
├── static/                      # Archivos duplicados (a limpiar)
├── backup-fase1/                # Backup de seguridad
└── docs/                        # Documentación
```

## 🎯 **BENEFICIOS DE LA NUEVA ESTRUCTURA**

### **1. Separación de Responsabilidades**

- **Components**: Componentes reutilizables
- **Modules**: Lógica de negocio específica
- **Services**: Servicios externos y APIs
- **Utils**: Funciones auxiliares

### **2. Mantenibilidad Mejorada**

- Código organizado por funcionalidad
- Fácil localización de archivos
- Estructura escalable

### **3. Reutilización de Código**

- Componentes compartidos
- Servicios centralizados
- Utilidades comunes

### **4. Desarrollo Colaborativo**

- Estructura clara para equipos
- Convenciones de nomenclatura
- Documentación integrada

## 📋 **PLAN DE MIGRACIÓN**

### **Fase 1: Limpieza** ✅

- [x] Eliminar archivos duplicados
- [x] Crear nueva estructura
- [x] Backup de seguridad

### **Fase 2: Migración Gradual** 🔄

- [ ] Migrar componentes comunes
- [ ] Consolidar servicios
- [ ] Unificar estilos

### **Fase 3: Optimización** ⏳

- [ ] Implementar build system
- [ ] Optimizar carga
- [ ] Testing automatizado

## 🔧 **CONVENCIONES DE NOMENCLATURA**

### **Archivos JavaScript**

- **Componentes**: `PascalCase.js` (ej: `UserCard.js`)
- **Servicios**: `camelCase.js` (ej: `firebaseService.js`)
- **Utilidades**: `camelCase.js` (ej: `dateUtils.js`)

### **Archivos CSS**

- **Componentes**: `component-name.css` (ej: `user-card.css`)
- **Páginas**: `page-name.css` (ej: `dashboard.css`)

### **Carpetas**

- **Componentes**: `kebab-case` (ej: `user-management`)
- **Servicios**: `camelCase` (ej: `firebaseService`)

## 📚 **DOCUMENTACIÓN**

Cada módulo debe incluir:

- `README.md` - Documentación del módulo
- `index.js` - Punto de entrada
- `styles.css` - Estilos específicos
- `tests/` - Tests unitarios

## 🚀 **PRÓXIMOS PASOS**

1. **Migrar componentes comunes** a `src/components/`
2. **Consolidar servicios** en `src/services/`
3. **Unificar estilos** en `src/styles/`
4. **Implementar build system**
5. **Agregar testing automatizado**
