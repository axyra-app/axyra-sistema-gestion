# 🚀 Instrucciones de Despliegue PayPal - AXYRA

## ✅ **Estado Actual: SISTEMA COMPLETO CONFIGURADO**

### 📋 **Lo que se ha implementado:**

1. ✅ **API Endpoints de PayPal** (`api/paypal-payment.js`)
2. ✅ **Sistema de Restricción por Planes** (`frontend/static/plan-restriction-system.js`)
3. ✅ **Integración PayPal Frontend** (`frontend/static/paypal-integration.js`)
4. ✅ **Configuración Vercel** (`vercel.json`)
5. ✅ **Variables de entorno configuradas**

## 🔧 **Pasos para Activar el Sistema:**

### **1. Desplegar las Functions de Vercel**

```bash
# En la terminal, ejecuta:
vercel --prod

# O si ya tienes Vercel configurado:
vercel deploy --prod
```

### **2. Verificar Variables de Entorno en Vercel**

Ve a [Vercel Dashboard](https://vercel.com/dashboard) y verifica que estas variables estén configuradas:

```
PAYPAL_CLIENT_ID=AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw
PAYPAL_CLIENT_SECRET=EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj;
PAYPAL_ENVIRONMENT=sandbox
PAYPAL_BASE_URL=https://api.sandbox.paypal.com
```

### **3. Configurar Webhook en PayPal (Opcional)**

1. Ve a [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Configura un webhook con la URL: `https://axyra-sistema-gestion.vercel.app/api/paypal/webhook`
3. Selecciona estos eventos:
   - `PAYMENT.CAPTURE.COMPLETED`
   - `PAYMENT.CAPTURE.DENIED`
   - `CHECKOUT.ORDER.COMPLETED`

## 🎯 **Cómo Funciona el Sistema:**

### **Para Usuarios SIN Plan (Plan Gratuito):**

- ❌ **Gestión Personal** - Bloqueado con overlay
- ❌ **Caja** - Bloqueado con overlay
- ❌ **Inventario** - Bloqueado con overlay
- ❌ **Configuración** - Bloqueado con overlay
- ✅ **Dashboard** - Acceso completo
- ✅ **Reportes Básicos** - Acceso completo

### **Para Usuarios CON Plan:**

- ✅ **Todos los módulos** - Acceso completo
- ✅ **Funcionalidades premium** - Disponibles

## 💳 **Proceso de Pago:**

1. **Usuario hace clic** en módulo restringido
2. **Aparece overlay** con mensaje de restricción
3. **Usuario hace clic** en "Actualizar Plan"
4. **Se abre modal** con opciones de planes
5. **Usuario selecciona** plan y hace clic en "Pagar"
6. **Se abre PayPal** para procesar pago
7. **Después del pago** se desbloquean los módulos

## 🧪 **Probar el Sistema:**

### **1. Modo Sandbox (Recomendado para pruebas):**

- Usa las credenciales de sandbox
- Los pagos no son reales
- Perfecto para testing

### **2. Datos de Prueba PayPal:**

```
Email: sb-buyer@personal.example.com
Password: password123
```

### **3. Verificar Funcionamiento:**

1. Inicia sesión en tu aplicación
2. Intenta acceder a "Gestión Personal"
3. Debería aparecer el overlay de restricción
4. Haz clic en "Actualizar Plan"
5. Selecciona un plan y prueba el pago

## 🔄 **Cambiar a Producción:**

### **1. Actualizar Variables de Entorno:**

```
PAYPAL_ENVIRONMENT=production
PAYPAL_BASE_URL=https://api.paypal.com
```

### **2. Actualizar URLs en el Código:**

- Cambiar todas las URLs de sandbox a producción
- Actualizar webhook URL si es necesario

## 🚨 **Solución de Problemas:**

### **Error: "API endpoint no encontrado"**

- Verifica que `vercel.json` esté en la raíz del proyecto
- Ejecuta `vercel deploy --prod` nuevamente

### **Error: "PayPal SDK no carga"**

- Verifica que `PAYPAL_CLIENT_ID` esté configurado
- Revisa la consola del navegador para errores

### **Error: "Usuario no autenticado"**

- Asegúrate de que Firebase Auth esté funcionando
- Verifica que el usuario esté logueado

## 📊 **Monitoreo:**

### **Verificar Pagos:**

- Ve a [PayPal Dashboard](https://www.paypal.com/businessprofile/mytools)
- Revisa las transacciones en "Actividad"

### **Verificar en Firebase:**

- Ve a Firestore > colección `payments`
- Revisa las transacciones registradas

## 🎉 **¡Sistema Listo!**

Una vez completados estos pasos, tu sistema AXYRA tendrá:

- ✅ **Control de acceso por planes**
- ✅ **Pagos con PayPal integrados**
- ✅ **Restricciones automáticas**
- ✅ **Actualización de planes en tiempo real**
- ✅ **Interfaz de usuario profesional**

## 📞 **Soporte:**

Si tienes problemas:

1. Revisa la consola del navegador
2. Verifica las variables de entorno en Vercel
3. Revisa los logs de Vercel Functions
4. Contacta: jfuran.va@gmail.com

---

**¡El sistema está completamente configurado y listo para usar!** 🚀
