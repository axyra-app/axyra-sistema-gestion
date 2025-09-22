# 📚 MANUAL DE USUARIO - AXYRA SISTEMA DE GESTIÓN

## 🎯 **INTRODUCCIÓN**

AXYRA es un sistema integral de gestión empresarial diseñado para optimizar los procesos de recursos humanos, nómina, inventario y gestión financiera. Este manual te guiará a través de todas las funcionalidades del sistema.

---

## 🚀 **ACCESO AL SISTEMA**

### **URL de Acceso**
- **Producción**: [Tu URL de Vercel]
- **Desarrollo**: http://localhost:8000

### **Credenciales de Acceso**
1. **Administrador Principal**
   - Email: admin@villa-venecia.com
   - Contraseña: [Configurar en Firebase]

2. **Usuarios Adicionales**
   - Los administradores pueden crear nuevos usuarios desde el panel de administración

---

## 👥 **GESTIÓN DE EMPLEADOS** (PRIORIDAD MÁXIMA)

### **1. Registrar Nuevo Empleado**

1. **Acceder al módulo**
   - Ir a "Gestión de Personal" → "Empleados"
   - Hacer clic en "Nuevo Empleado"

2. **Completar información**
   - **Datos Personales**: Nombre, cédula, teléfono, email
   - **Datos Laborales**: Cargo, departamento, salario base
   - **Datos de Contacto**: Dirección, teléfono de emergencia

3. **Guardar empleado**
   - Hacer clic en "Guardar"
   - El sistema validará automáticamente los datos

### **2. Registrar Horas Trabajadas**

1. **Acceder al registro**
   - Ir a "Gestión de Personal" → "Horas"
   - Hacer clic en "Registrar Horas"

2. **Completar formulario**
   - **Empleado**: Seleccionar de la lista
   - **Fecha**: Seleccionar fecha de trabajo
   - **Hora de Entrada**: Formato 24 horas
   - **Hora de Salida**: Formato 24 horas
   - **Tipo de Turno**: Diurno, Nocturno, Mixto

3. **Cálculo automático**
   - El sistema calcula automáticamente:
     - Horas normales
     - Horas extras
     - Recargos (nocturno, dominical, festivo)

### **3. Generar Nómina**

1. **Acceder a nómina**
   - Ir a "Gestión de Personal" → "Nómina"
   - Hacer clic en "Generar Nómina"

2. **Seleccionar período**
   - **Fecha de inicio**: Primer día del período
   - **Fecha de fin**: Último día del período
   - **Empleados**: Seleccionar empleados a incluir

3. **Revisar cálculos**
   - **Salario base**: Según configuración
   - **Horas extras**: Calculadas automáticamente
   - **Recargos**: Aplicados según turno
   - **Descuentos**: Salud, pensión, retención

4. **Generar comprobante**
   - Hacer clic en "Generar PDF"
   - Descargar comprobante de pago

---

## 💰 **CUADRE DE CAJA** (PRIORIDAD MÁXIMA)

### **1. Registrar Movimientos**

1. **Acceder al módulo**
   - Ir a "Cuadre de Caja" → "Movimientos"
   - Hacer clic en "Nuevo Movimiento"

2. **Completar movimiento**
   - **Tipo**: Ingreso o Egreso
   - **Concepto**: Descripción del movimiento
   - **Monto**: Cantidad en pesos colombianos
   - **Categoría**: Ventas, Gastos, Otros
   - **Observaciones**: Notas adicionales

3. **Guardar movimiento**
   - El sistema actualiza automáticamente el saldo

### **2. Realizar Corte de Caja**

1. **Acceder al corte**
   - Ir a "Cuadre de Caja" → "Cortes"
   - Hacer clic en "Nuevo Corte"

2. **Completar información**
   - **Fecha**: Fecha del corte
   - **Saldo inicial**: Saldo al inicio del día
   - **Observaciones**: Notas del corte

3. **Confirmar corte**
   - El sistema calcula el saldo final
   - Genera reporte del corte

### **3. Exportar Reportes**

1. **Exportar movimientos**
   - Ir a "Cuadre de Caja" → "Reportes"
   - Seleccionar rango de fechas
   - Hacer clic en "Exportar CSV"

2. **Exportar cortes**
   - Seleccionar "Exportar Cortes"
   - Descargar archivo CSV

---

## 🏢 **GESTIÓN DE DEPARTAMENTOS**

### **1. Crear Departamento**

1. **Acceder al módulo**
   - Ir a "Gestión de Personal" → "Departamentos"
   - Hacer clic en "Nuevo Departamento"

2. **Completar información**
   - **Nombre**: Nombre del departamento
   - **Descripción**: Descripción del departamento
   - **Responsable**: Empleado responsable

3. **Guardar departamento**

### **2. Asignar Empleados**

1. **Editar empleado**
   - Ir a "Empleados" → Seleccionar empleado
   - Hacer clic en "Editar"

2. **Asignar departamento**
   - Seleccionar departamento de la lista
   - Guardar cambios

---

## 💳 **SISTEMA DE PAGOS**

### **1. Membresías Wompi**

1. **Acceder a membresías**
   - Ir a "Membresías" → "Planes"
   - Seleccionar plan deseado

2. **Procesar pago**
   - Hacer clic en "Pagar con Wompi"
   - Completar datos de pago
   - Confirmar transacción

3. **Verificar activación**
   - El sistema actualiza automáticamente el plan
   - Recibir confirmación por email

### **2. Membresías PayPal**

1. **Seleccionar plan**
   - Ir a "Membresías" → "Planes"
   - Seleccionar plan con PayPal

2. **Procesar pago**
   - Hacer clic en "Pagar con PayPal"
   - Iniciar sesión en PayPal
   - Confirmar pago

---

## 📊 **REPORTES Y ANALYTICS**

### **1. Reportes de Empleados**

1. **Acceder a reportes**
   - Ir a "Gestión de Personal" → "Reportes"
   - Seleccionar tipo de reporte

2. **Configurar filtros**
   - **Período**: Rango de fechas
   - **Departamento**: Filtrar por departamento
   - **Empleado**: Filtrar por empleado específico

3. **Generar reporte**
   - Hacer clic en "Generar"
   - Descargar en formato PDF o Excel

### **2. Reportes de Caja**

1. **Acceder a reportes**
   - Ir a "Cuadre de Caja" → "Reportes"
   - Seleccionar tipo de reporte

2. **Configurar parámetros**
   - **Período**: Rango de fechas
   - **Tipo de movimiento**: Ingresos, Egresos, Ambos
   - **Categoría**: Filtrar por categoría

---

## 🔧 **FUNCIONALIDADES OFFLINE**

### **1. Modo Offline**

- El sistema funciona sin conexión a internet
- Los datos se guardan localmente
- Se sincronizan automáticamente al reconectar

### **2. Sincronización**

- **Automática**: Al detectar conexión
- **Manual**: Botón "Sincronizar" en la interfaz
- **Programada**: Cada 5 minutos

---

## ⚙️ **CONFIGURACIÓN DEL SISTEMA**

### **1. Configuración de Empresa**

1. **Acceder a configuración**
   - Ir a "Configuración" → "Empresa"
   - Editar información de la empresa

2. **Datos requeridos**
   - **Nombre**: Nombre de la empresa
   - **NIT**: Número de identificación tributaria
   - **Dirección**: Dirección completa
   - **Teléfono**: Número de contacto

### **2. Configuración de Nómina**

1. **Acceder a configuración**
   - Ir a "Configuración" → "Nómina"
   - Configurar parámetros de nómina

2. **Parámetros importantes**
   - **Salario mínimo**: Salario mínimo legal
   - **Auxilio de transporte**: Monto del auxilio
   - **Porcentajes**: Salud, pensión, retención
   - **Recargos**: Nocturno, dominical, festivo

---

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes**

1. **No puedo iniciar sesión**
   - Verificar credenciales
   - Verificar conexión a internet
   - Contactar administrador

2. **Los datos no se guardan**
   - Verificar conexión a internet
   - Verificar que estés en modo online
   - Intentar sincronizar manualmente

3. **Error al generar nómina**
   - Verificar que los empleados tengan horas registradas
   - Verificar configuración de nómina
   - Contactar soporte técnico

4. **Problemas con pagos**
   - Verificar configuración de Wompi/PayPal
   - Verificar que las credenciales estén correctas
   - Contactar soporte de pagos

### **Contacto de Soporte**

- **Email**: soporte@villa-venecia.com
- **Teléfono**: [Número de contacto]
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

---

## 📱 **ACCESO MÓVIL**

### **Compatibilidad**

- **Navegadores**: Chrome, Firefox, Safari, Edge
- **Dispositivos**: Móviles, tablets, computadoras
- **Sistemas**: Android, iOS, Windows, macOS

### **Recomendaciones**

- Usar Chrome para mejor rendimiento
- Mantener el navegador actualizado
- Usar conexión WiFi cuando sea posible

---

## 🔒 **SEGURIDAD**

### **Buenas Prácticas**

1. **Contraseñas seguras**
   - Mínimo 8 caracteres
   - Combinar letras, números y símbolos
   - Cambiar regularmente

2. **Cerrar sesión**
   - Siempre cerrar sesión al terminar
   - No compartir credenciales
   - Usar en dispositivos seguros

3. **Respaldo de datos**
   - El sistema hace respaldos automáticos
   - Los datos se sincronizan en la nube
   - Contactar soporte para restauración

---

## 📈 **ACTUALIZACIONES**

### **Versión Actual**
- **Versión**: 2.0.0
- **Fecha**: [Fecha de despliegue]
- **Nuevas características**: Sistema optimizado para producción

### **Próximas Actualizaciones**
- Mejoras en la interfaz de usuario
- Nuevos tipos de reportes
- Integración con más sistemas de pago
- Funcionalidades de análisis avanzado

---

**© 2024 Villa Venecia - Sistema AXYRA. Todos los derechos reservados.**
