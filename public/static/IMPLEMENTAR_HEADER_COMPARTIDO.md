# 🚀 IMPLEMENTAR HEADER COMPARTIDO AXYRA

## 📋 **PASOS PARA IMPLEMENTAR EN TODOS LOS MÓDULOS:**

### **1. INCLUIR SCRIPT DEL HEADER COMPARTIDO**

Agregar esta línea en el `<head>` de cada módulo HTML:

```html
<script src="../../static/include-header.js"></script>
```

### **2. ELIMINAR HEADER EXISTENTE**

Remover todo el código del header actual de cada módulo, incluyendo:
- `<header class="axyra-header">`
- `<nav class="axyra-nav">`
- Todo el contenido del header

### **3. ELIMINAR FUNCIONES DE NAVEGACIÓN**

Remover funciones relacionadas con la navegación del header:
- `ocultarBotonEmpleados()`
- `ocultarBotonDashboard()`
- Cualquier función de navegación específica del módulo

### **4. AJUSTAR RUTAS RELATIVAS**

El header compartido usa rutas relativas desde `frontend/static/`, asegurarse de que funcionen desde cada módulo.

---

## 🔧 **EJEMPLO DE IMPLEMENTACIÓN:**

### **ANTES (Header individual en cada módulo):**
```html
<header class="axyra-header">
  <div class="axyra-header-content">
    <!-- Todo el código del header -->
  </div>
</header>

<script>
  // Funciones de navegación específicas del módulo
  function ocultarBotonEmpleados() { ... }
</script>
```

### **DESPUÉS (Header compartido):**
```html
<!-- Solo incluir el script -->
<script src="../../static/include-header.js"></script>

<!-- El header se incluye automáticamente -->
```

---

## 📁 **ARCHIVOS CREADOS:**

1. **`shared-header.html`** - HTML del header compartido
2. **`shared-header.js`** - Funcionalidad JavaScript del header
3. **`include-header.js`** - Script para incluir automáticamente el header
4. **`IMPLEMENTAR_HEADER_COMPARTIDO.md`** - Este archivo de instrucciones

---

## ✅ **BENEFICIOS:**

- **Consistencia visual** en toda la aplicación
- **Mantenimiento centralizado** del header
- **Navegación inteligente** que oculta botones innecesarios
- **Experiencia de usuario uniforme**
- **Fácil actualización** de estilos y funcionalidad

---

## 🚨 **IMPORTANTE:**

- El header se incluye **automáticamente** al cargar la página
- La navegación se genera **dinámicamente** según la página actual
- Los botones se **ocultan automáticamente** para evitar redundancia
- El subtítulo de la página se **actualiza automáticamente**

---

## 🔄 **PRÓXIMOS PASOS:**

1. Implementar en **empleados.html** (ya está listo)
2. Implementar en **horas.html**
3. Implementar en **nomina.html**
4. Implementar en **cuadre_caja.html**
5. Implementar en **inventario.html**
6. Implementar en **configuracion.html**
7. Implementar en **dashboard.html**

---

## 📞 **SOPORTE:**

Si hay algún problema con la implementación, revisar:
- Rutas relativas de los archivos
- Consola del navegador para errores
- Que el script se incluya correctamente
- Que no haya conflictos con CSS existente
