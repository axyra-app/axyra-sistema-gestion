# 🧪 PLAN DE PRUEBAS CRÍTICAS - AXYRA SISTEMA DE GESTIÓN

## 📋 **CHECKLIST DE PRUEBAS OBLIGATORIAS**

### **1. AUTENTICACIÓN Y ACCESO** 🔐
- [ ] **Login de administrador**
  - [ ] Acceso con credenciales válidas
  - [ ] Redirección correcta después del login
  - [ ] Persistencia de sesión
- [ ] **Registro de nuevos usuarios**
  - [ ] Formulario de registro funcional
  - [ ] Validación de campos
  - [ ] Confirmación por email (si está habilitado)

### **2. GESTIÓN DE EMPLEADOS** 👥 (PRIORIDAD MÁXIMA)
- [ ] **CRUD de Empleados**
  - [ ] Crear nuevo empleado
  - [ ] Editar empleado existente
  - [ ] Eliminar empleado
  - [ ] Listar empleados
- [ ] **Registro de Horas**
  - [ ] Registrar horas trabajadas
  - [ ] Calcular horas extras
  - [ ] Validar fechas y horarios
  - [ ] Generar comprobante de horas
- [ ] **Cálculo de Nómina**
  - [ ] Cálculo automático de salarios
  - [ ] Aplicación de recargos (nocturno, dominical, etc.)
  - [ ] Descuentos de ley (salud, pensión)
  - [ ] Generación de nómina en PDF
- [ ] **Departamentos**
  - [ ] Crear departamento
  - [ ] Asignar empleados a departamentos
  - [ ] Editar departamentos

### **3. CUADRE DE CAJA** 💰 (PRIORIDAD MÁXIMA)
- [ ] **Movimientos de Caja**
  - [ ] Registrar ingreso
  - [ ] Registrar egreso
  - [ ] Editar movimiento
  - [ ] Eliminar movimiento
- [ ] **Corte de Caja**
  - [ ] Realizar corte diario
  - [ ] Calcular saldo final
  - [ ] Generar reporte de corte
- [ ] **Reportes**
  - [ ] Exportar movimientos a CSV
  - [ ] Exportar cortes a CSV
  - [ ] Filtros por fecha

### **4. SISTEMA DE PAGOS** 💳
- [ ] **Wompi Integration**
  - [ ] Procesar pago de membresía
  - [ ] Verificar transacción
  - [ ] Actualizar plan de usuario
- [ ] **PayPal Integration**
  - [ ] Procesar pago de membresía
  - [ ] Verificar orden
  - [ ] Actualizar plan de usuario

### **5. FUNCIONALIDADES OFFLINE** 📱
- [ ] **Modo Offline**
  - [ ] Funcionar sin conexión
  - [ ] Sincronizar datos al reconectar
  - [ ] Indicador de estado de conexión
- [ ] **Almacenamiento Local**
  - [ ] Guardar datos en localStorage
  - [ ] Recuperar datos al cargar
  - [ ] Limpiar datos obsoletos

### **6. RENDIMIENTO Y UX** ⚡
- [ ] **Carga de Páginas**
  - [ ] Tiempo de carga < 3 segundos
  - [ ] Carga progresiva de datos
  - [ ] Indicadores de carga
- [ ] **Responsive Design**
  - [ ] Funciona en móvil
  - [ ] Funciona en tablet
  - [ ] Funciona en desktop

## 🚨 **PRUEBAS DE ERRORES**

### **7. MANEJO DE ERRORES** ❌
- [ ] **Errores de Red**
  - [ ] Pérdida de conexión
  - [ ] Timeout de requests
  - [ ] Reconexión automática
- [ ] **Errores de Validación**
  - [ ] Campos obligatorios
  - [ ] Formatos incorrectos
  - [ ] Datos duplicados
- [ ] **Errores de Permisos**
  - [ ] Acceso no autorizado
  - [ ] Operaciones restringidas

## 📊 **MÉTRICAS DE ÉXITO**

- ✅ **Tiempo de carga**: < 3 segundos
- ✅ **Disponibilidad**: > 99%
- ✅ **Funcionalidades críticas**: 100% operativas
- ✅ **Sincronización offline**: Funcional
- ✅ **Generación de reportes**: Sin errores

## 🔧 **HERRAMIENTAS DE PRUEBA**

1. **Navegador**: Chrome DevTools
2. **Red**: Throttling para simular conexiones lentas
3. **Dispositivos**: Móvil, tablet, desktop
4. **Datos de prueba**: Usuarios, empleados, movimientos

## 📝 **REPORTE DE PRUEBAS**

Para cada prueba:
- [ ] Fecha y hora
- [ ] Navegador y versión
- [ ] Dispositivo
- [ ] Resultado: ✅ ÉXITO / ❌ FALLO
- [ ] Observaciones
- [ ] Screenshots (si es necesario)

---

**⚠️ IMPORTANTE**: Las pruebas de Gestión de Empleados y Cuadre de Caja son CRÍTICAS y deben funcionar al 100% antes de considerar el sistema listo para producción.
