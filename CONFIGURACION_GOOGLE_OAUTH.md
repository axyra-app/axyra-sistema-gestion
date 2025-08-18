# 🔐 **Configuración de Google OAuth para AXYRA**

## 📋 **Resumen**

Este documento explica cómo configurar **Google OAuth real** para el sistema AXYRA, reemplazando el modo simulado por la autenticación real de Google.

## 🚀 **Modo Actual: Simulado (Desarrollo)**

Actualmente, AXYRA está configurado en **modo simulado** para desarrollo:

- ✅ **No requiere credenciales reales**
- ✅ **Funciona inmediatamente**
- ✅ **Perfecto para desarrollo y pruebas**
- ❌ **No es autenticación real de Google**

## 🌐 **Modo Real: Google OAuth (Producción)**

Para usar **Google OAuth real**, necesitas configurar credenciales en Google Cloud Console.

---

## 🛠️ **PASOS PARA CONFIGURAR GOOGLE OAUTH REAL**

### **Paso 1: Acceder a Google Cloud Console**

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto o selecciona uno existente

### **Paso 2: Habilitar APIs**

1. En el menú lateral, ve a **"APIs y servicios" > "Biblioteca"**
2. Busca y habilita estas APIs:
   - **Google+ API** (o Google Identity API)
   - **Google OAuth2 API**

### **Paso 3: Crear Credenciales OAuth 2.0**

1. Ve a **"APIs y servicios" > "Credenciales"**
2. Haz clic en **"Crear credenciales" > "ID de cliente de OAuth 2.0"**
3. Selecciona **"Aplicación web"**
4. Configura:
   - **Nombre**: `AXYRA Web App`
   - **Orígenes autorizados de JavaScript**:
     - `http://localhost:8000`
     - `http://127.0.0.1:8000`
     - `http://localhost:3000`
     - `http://127.0.0.1:3000`
     - Tu dominio de producción (ej: `https://tuapp.com`)
   - **URI de redirección autorizados**:
     - `http://localhost:8000/frontend/login.html`
     - `http://127.0.0.1:8000/frontend/login.html`
     - Tu URL de login de producción

### **Paso 4: Obtener Credenciales**

Después de crear las credenciales, obtendrás:

- **ID de cliente**: `123456789-abcdef.apps.googleusercontent.com`
- **Secreto del cliente**: (guárdalo de forma segura)

### **Paso 5: Actualizar Configuración en AXYRA**

1. Abre `frontend/static/google-oauth-config.js`
2. Cambia la línea:

   ```javascript
   this.useSimulatedMode = true; // Cambiar a false para usar Google real
   ```

   Por:

   ```javascript
   this.useSimulatedMode = false; // Usar Google OAuth real
   ```

3. Actualiza las credenciales:
   ```javascript
   // En producción, esto debería venir de variables de entorno
   this.clientId = 'TU_ID_DE_CLIENTE_REAL.apps.googleusercontent.com';
   this.apiKey = 'TU_API_KEY_REAL';
   ```

---

## 🔄 **CAMBIO ENTRE MODOS**

### **Desde la Interfaz Web**

En la página de login, usa los botones:

- **🔄 Cambiar Modo**: Alterna entre simulado y real
- **📊 Estado**: Muestra el estado actual de la configuración

### **Desde la Consola del Navegador**

```javascript
// Cambiar a modo real
axyraGoogleOAuth.updateConfiguration({
  useSimulatedMode: false,
  clientId: 'tu-client-id.apps.googleusercontent.com',
  apiKey: 'tu-api-key',
});

// Cambiar a modo simulado
axyraGoogleOAuth.updateConfiguration({
  useSimulatedMode: true,
});

// Ver estado
axyraGoogleOAuth.getStatus();

// Ver instrucciones
axyraGoogleOAuth.getSetupInstructions();
```

---

## 🧪 **PRUEBAS**

### **Modo Simulado (Actual)**

1. Haz clic en **"Continuar con Google"**
2. Selecciona un usuario simulado
3. ✅ **Funciona inmediatamente**

### **Modo Real (Después de configuración)**

1. Cambia a modo real
2. Haz clic en **"Continuar con Google"**
3. Se abrirá la ventana real de Google
4. ✅ **Autenticación real con tu cuenta de Google**

---

## ⚠️ **NOTAS IMPORTANTES**

### **Seguridad**

- **Nunca** subas credenciales reales a repositorios públicos
- Usa variables de entorno en producción
- Rota las credenciales regularmente

### **Limitaciones del Modo Simulado**

- Solo funciona localmente
- No es autenticación real
- No cumple requisitos de producción

### **Ventajas del Modo Real**

- Autenticación real y segura
- Cumple estándares de seguridad
- Funciona en producción
- Integración completa con Google

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Error: "Invalid Client ID"**

- Verifica que el Client ID sea correcto
- Asegúrate de que el origen esté autorizado
- Revisa que la API esté habilitada

### **Error: "Redirect URI Mismatch"**

- Verifica que la URI de redirección esté configurada correctamente
- Incluye tanto localhost como tu dominio de producción

### **Error: "API Not Enabled"**

- Habilita las APIs necesarias en Google Cloud Console
- Espera unos minutos para que se propaguen los cambios

---

## 📞 **SOPORTE**

Si tienes problemas con la configuración:

1. **Verifica el estado** usando el botón "📊 Estado"
2. **Revisa la consola** del navegador para errores
3. **Confirma las credenciales** en Google Cloud Console
4. **Prueba en modo simulado** para verificar que AXYRA funciona

---

## 🎯 **PRÓXIMOS PASOS**

1. **Configura credenciales reales** siguiendo esta guía
2. **Prueba la autenticación** en modo real
3. **Despliega en producción** con credenciales reales
4. **Configura variables de entorno** para mayor seguridad

---

**¡Con esta configuración, AXYRA tendrá autenticación real y segura con Google!** 🚀✨
