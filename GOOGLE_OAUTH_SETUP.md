# 🔐 Configuración de Google OAuth para AXYRA

## 🎯 **OBJETIVO**

Implementar autenticación completa con Google OAuth en el sistema AXYRA para permitir a los usuarios iniciar sesión con sus cuentas de Google.

## 📋 **PRERREQUISITOS**

- Cuenta de Google (Gmail)
- Acceso a Google Cloud Console
- Dominio web (para producción) o localhost (para desarrollo)

## 🚀 **PASO A PASO PARA CONFIGURAR GOOGLE OAUTH**

### **1. Crear Proyecto en Google Cloud Console**

1. **Ir a Google Cloud Console:**

   - Abrir [https://console.cloud.google.com/](https://console.cloud.google.com/)
   - Iniciar sesión con tu cuenta de Google

2. **Crear nuevo proyecto:**

   - Click en el selector de proyectos (arriba a la izquierda)
   - Click en "Nuevo Proyecto"
   - Nombre: `AXYRA-System`
   - Click en "Crear"

3. **Seleccionar el proyecto:**
   - Asegurarse de que `AXYRA-System` esté seleccionado

### **2. Habilitar Google+ API**

1. **Ir a APIs y Servicios:**

   - En el menú lateral, click en "APIs y Servicios" > "Biblioteca"

2. **Buscar y habilitar APIs:**

   - Buscar "Google+ API"
   - Click en "Google+ API"
   - Click en "Habilitar"

   - Buscar "Google OAuth2 API"
   - Click en "Google OAuth2 API"
   - Click en "Habilitar"

### **3. Configurar Pantalla de Consentimiento OAuth**

1. **Ir a Pantalla de Consentimiento:**

   - En el menú lateral, click en "APIs y Servicios" > "Pantalla de Consentimiento OAuth"

2. **Seleccionar tipo de usuario:**

   - Seleccionar "Externo"
   - Click en "Crear"

3. **Completar información básica:**

   - **Nombre de la aplicación:** `AXYRA - Sistema de Gestión Empresarial`
   - **Correo electrónico de soporte:** Tu email
   - **Logo de la aplicación:** Subir logo de AXYRA (opcional)
   - **Dominio de la aplicación:** `localhost` (para desarrollo)
   - **Correo electrónico del desarrollador:** Tu email

4. **Agregar scopes:**

   - Click en "Agregar o quitar scopes"
   - Seleccionar:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
   - Click en "Actualizar"

5. **Agregar usuarios de prueba:**

   - Click en "Usuarios de prueba"
   - Click en "Agregar usuarios"
   - Agregar tu email y otros emails de prueba
   - Click en "Guardar y continuar"

6. **Revisar y publicar:**
   - Revisar toda la información
   - Click en "Volver al panel"
   - Click en "Publicar aplicación"

### **4. Crear Credenciales OAuth**

1. **Ir a Credenciales:**

   - En el menú lateral, click en "APIs y Servicios" > "Credenciales"

2. **Crear credenciales:**

   - Click en "Crear Credenciales"
   - Seleccionar "ID de cliente de OAuth 2.0"

3. **Configurar aplicación:**

   - **Tipo de aplicación:** Aplicación web
   - **Nombre:** `AXYRA Web Client`

4. **Configurar URIs autorizados:**

   - **Orígenes de JavaScript autorizados:**

     ```
     http://localhost:3000
     http://localhost:8000
     http://127.0.0.1:3000
     http://127.0.0.1:8000
     ```

   - **URIs de redirección autorizados:**
     ```
     http://localhost:3000/frontend/login.html
     http://localhost:8000/frontend/login.html
     http://127.0.0.1:3000/frontend/login.html
     http://127.0.0.1:8000/frontend/login.html
     ```

5. **Crear credenciales:**
   - Click en "Crear"
   - **Guardar el Client ID y Client Secret**

### **5. Configurar AXYRA con las Credenciales**

1. **Editar archivo de configuración:**

   - Abrir `frontend/static/google-oauth-config.js`
   - Reemplazar `TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com` con tu Client ID real
   - Reemplazar `TU_GOOGLE_API_KEY` con tu API Key (opcional)

2. **Ejemplo de configuración:**
   ```javascript
   loadConfiguration() {
       try {
           this.clientId = '123456789-abcdefghijklmnop.apps.googleusercontent.com';
           this.apiKey = 'AIzaSyB...'; // Opcional

           console.log('✅ Configuración de Google OAuth cargada');
       } catch (error) {
           console.error('❌ Error cargando configuración de Google OAuth:', error);
       }
   }
   ```

### **6. Probar la Configuración**

1. **Iniciar el servidor:**

   ```bash
   cd frontend
   python server.py
   # o
   npx http-server -p 3000
   ```

2. **Abrir la aplicación:**

   - Ir a `http://localhost:3000/frontend/login.html`
   - Click en "Continuar con Google"
   - Debería abrirse la ventana de autenticación de Google

3. **Verificar en consola:**
   - Abrir DevTools (F12)
   - Ver en la consola los mensajes de Google OAuth

## 🔧 **CONFIGURACIÓN PARA PRODUCCIÓN**

### **1. Actualizar URIs autorizados:**

```
https://tudominio.com
https://www.tudominio.com
```

### **2. Configurar variables de entorno:**

```bash
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_API_KEY=tu_api_key
```

### **3. Actualizar pantalla de consentimiento:**

- Cambiar dominio de `localhost` a tu dominio real
- Publicar la aplicación

## 🚨 **SOLUCIÓN DE PROBLEMAS**

### **Error: "popup_closed_by_user"**

- **Causa:** El usuario cerró la ventana de autenticación
- **Solución:** Verificar que no haya bloqueadores de popups

### **Error: "access_denied"**

- **Causa:** Usuario rechazó los permisos
- **Solución:** Verificar scopes en pantalla de consentimiento

### **Error: "redirect_uri_mismatch"**

- **Causa:** URI de redirección no coincide
- **Solución:** Verificar URIs en credenciales OAuth

### **Error: "invalid_client"**

- **Causa:** Client ID incorrecto
- **Solución:** Verificar Client ID en configuración

## 📊 **VERIFICAR FUNCIONAMIENTO**

### **1. Estado del sistema:**

- Click en "Ver Estado del Sistema"
- Verificar que Google OAuth aparezca como "Inicializado"

### **2. Consola del navegador:**

- Mensajes de éxito de Google OAuth
- Usuario creado/obtenido correctamente

### **3. Login exitoso:**

- Redirección al dashboard
- Sesión creada correctamente

## 🎉 **RESULTADO FINAL**

Una vez configurado correctamente:

- ✅ Los usuarios pueden iniciar sesión con Google
- ✅ Se crean automáticamente cuentas para usuarios de Google
- ✅ El sistema mantiene la compatibilidad con login tradicional
- ✅ Autenticación segura y profesional

## 📞 **SOPORTE**

Si tienes problemas:

1. Verificar la consola del navegador
2. Verificar la configuración en Google Cloud Console
3. Verificar que las credenciales estén correctas
4. Verificar que las APIs estén habilitadas

---

**© 2024 AXYRA - Sistema de Gestión Empresarial Profesional**
