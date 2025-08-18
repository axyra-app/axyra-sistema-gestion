/**
 * AXYRA Google OAuth Configuration
 * Configuración para autenticación con Google
 * Versión: 2.0 - Con modo simulado para desarrollo
 */

class AXYRAGoogleOAuth {
  constructor() {
    this.clientId = null;
    this.apiKey = null;
    this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'];
    this.scope = 'email profile';
    this.isInitialized = false;
    this.useSimulatedMode = false; // Cambiar a false para usar Google real
    this.simulatedUsers = new Map();

    this.init();
  }

  init() {
    console.log('AXYRA Google OAuth inicializado');
    this.loadConfiguration();
    this.setupSimulatedUsers();
  }

  // Configurar usuarios simulados para desarrollo
  setupSimulatedUsers() {
    if (!this.useSimulatedMode) return;

    this.simulatedUsers.set('demo@gmail.com', {
      id: 'demo123',
      name: 'Usuario Demo',
      email: 'demo@gmail.com',
      picture: 'https://via.placeholder.com/150/667eea/ffffff?text=U',
    });

    this.simulatedUsers.set('test@gmail.com', {
      id: 'test456',
      name: 'Usuario Test',
      email: 'test@gmail.com',
      picture: 'https://via.placeholder.com/150/764ba2/ffffff?text=T',
    });

    console.log('✅ Usuarios simulados configurados para desarrollo');
  }

  // Cargar configuración
  loadConfiguration() {
    try {
      if (this.useSimulatedMode) {
        console.log('🔄 Modo simulado activado - No se requieren credenciales reales');
        return;
      }

      // En producción, esto debería venir de variables de entorno
      this.clientId = 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
      this.apiKey = 'TU_GOOGLE_API_KEY';

      console.log('✅ Configuración de Google OAuth real cargada');
    } catch (error) {
      console.error('❌ Error cargando configuración de Google OAuth:', error);
    }
  }

  // Inicializar Google OAuth
  async initialize() {
    try {
      if (this.isInitialized) {
        return { success: true, message: 'Ya inicializado' };
      }

      if (this.useSimulatedMode) {
        this.isInitialized = true;
        console.log('✅ Google OAuth simulado inicializado');
        return { success: true, message: 'Google OAuth simulado inicializado' };
      }

      // Cargar Google API si no está disponible
      if (typeof gapi === 'undefined') {
        await this.loadGoogleAPI();
      }

      // Inicializar OAuth2
      await gapi.load('auth2', async () => {
        await gapi.auth2.init({
          client_id: this.clientId,
          api_key: this.apiKey,
          discovery_docs: this.discoveryDocs,
          scope: this.scope,
        });

        this.isInitialized = true;
        console.log('✅ Google OAuth real inicializado correctamente');
      });

      return { success: true, message: 'Google OAuth inicializado' };
    } catch (error) {
      console.error('❌ Error inicializando Google OAuth:', error);
      return { success: false, error: error.message };
    }
  }

  // Cargar Google API
  loadGoogleAPI() {
    return new Promise((resolve, reject) => {
      if (typeof gapi !== 'undefined') {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Iniciar flujo de autenticación
  async signIn() {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      if (this.useSimulatedMode) {
        return await this.simulatedSignIn();
      }

      const auth2 = gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();

      const profile = googleUser.getBasicProfile();
      const authResponse = googleUser.getAuthResponse();

      const userData = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
        idToken: authResponse.id_token,
        accessToken: authResponse.access_token,
        expiresAt: Date.now() + authResponse.expires_in * 1000,
      };

      console.log('✅ Usuario autenticado con Google real:', userData.name);
      return { success: true, userData };
    } catch (error) {
      console.error('❌ Error en autenticación con Google:', error);
      return { success: false, error: error.message };
    }
  }

  // Simular inicio de sesión para desarrollo
  async simulatedSignIn() {
    return new Promise((resolve) => {
      // Crear modal de selección de usuario simulado
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      `;

      const modalContent = document.createElement('div');
      modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        padding: 30px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      `;

      modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
          <h3 style="color: #2d3748; margin-bottom: 10px;">🔐 Simulación de Google OAuth</h3>
          <p style="color: #718096; font-size: 14px;">Selecciona un usuario para simular el login con Google</p>
        </div>
        
        <div style="margin-bottom: 25px;">
          <button onclick="selectSimulatedUser('demo@gmail.com')" 
                  style="width: 100%; padding: 15px; margin-bottom: 10px; background: #667eea; color: white; 
                         border: none; border-radius: 10px; cursor: pointer; font-size: 16px;">
            👤 Usuario Demo (demo@gmail.com)
          </button>
          
          <button onclick="selectSimulatedUser('test@gmail.com')" 
                  style="width: 100%; padding: 15px; background: #764ba2; color: white; 
                         border: none; border-radius: 10px; cursor: pointer; font-size: 16px;">
            👤 Usuario Test (test@gmail.com)
          </button>
        </div>
        
        <div style="font-size: 12px; color: #a0aec0;">
          <p>💡 Este es el modo simulado para desarrollo</p>
          <p>En producción, se conectará con Google real</p>
        </div>
        
        <button onclick="closeSimulatedModal()" 
                style="margin-top: 20px; padding: 10px 20px; background: #e2e8f0; color: #4a5568; 
                       border: none; border-radius: 8px; cursor: pointer;">
          Cancelar
        </button>
      `;

      modal.appendChild(modalContent);
      document.body.appendChild(modal);

      // Funciones globales para el modal
      window.selectSimulatedUser = (email) => {
        const userData = this.simulatedUsers.get(email);
        if (userData) {
          console.log('✅ Usuario simulado seleccionado:', userData.name);
          resolve({ success: true, userData });
          closeSimulatedModal();
        }
      };

      window.closeSimulatedModal = () => {
        document.body.removeChild(modal);
        resolve({ success: false, error: 'Login cancelado por el usuario' });
      };

      // Cerrar con Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeSimulatedModal();
        }
      });
    });
  }

  // Cerrar sesión de Google
  async signOut() {
    try {
      if (!this.isInitialized) {
        return { success: false, error: 'Google OAuth no inicializado' };
      }

      if (this.useSimulatedMode) {
        console.log('✅ Sesión simulada de Google cerrada');
        return { success: true };
      }

      const auth2 = gapi.auth2.getAuthInstance();
      await auth2.signOut();

      console.log('✅ Sesión de Google real cerrada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión de Google:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar si el usuario está autenticado
  async isSignedIn() {
    try {
      if (!this.isInitialized) {
        return false;
      }

      if (this.useSimulatedMode) {
        return false; // En modo simulado, siempre requiere nueva autenticación
      }

      const auth2 = gapi.auth2.getAuthInstance();
      return auth2.isSignedIn.get();
    } catch (error) {
      console.error('❌ Error verificando estado de autenticación:', error);
      return false;
    }
  }

  // Obtener usuario actual de Google
  async getCurrentUser() {
    try {
      if (!this.isInitialized) {
        return null;
      }

      if (this.useSimulatedMode) {
        return null; // En modo simulado, no hay usuario persistente
      }

      const auth2 = gapi.auth2.getAuthInstance();
      if (!auth2.isSignedIn.get()) {
        return null;
      }

      const googleUser = auth2.currentUser.get();
      const profile = googleUser.getBasicProfile();

      return {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        picture: profile.getImageUrl(),
      };
    } catch (error) {
      console.error('❌ Error obteniendo usuario actual de Google:', error);
      return null;
    }
  }

  // Revocar acceso
  async revokeAccess() {
    try {
      if (!this.isInitialized) {
        return { success: false, error: 'Google OAuth no inicializado' };
      }

      if (this.useSimulatedMode) {
        console.log('✅ Acceso simulado de Google revocado');
        return { success: true };
      }

      const auth2 = gapi.auth2.getAuthInstance();
      await auth2.disconnect();

      console.log('✅ Acceso de Google real revocado');
      return { success: true };
    } catch (error) {
      console.error('❌ Error revocando acceso de Google:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estado de la configuración
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      useSimulatedMode: this.useSimulatedMode,
      hasClientId: !!this.clientId,
      hasApiKey: !!this.apiKey,
      scope: this.scope,
      simulatedUsersCount: this.simulatedUsers.size,
    };
  }

  // Cambiar entre modo simulado y real
  toggleMode() {
    this.useSimulatedMode = !this.useSimulatedMode;
    this.isInitialized = false;

    if (this.useSimulatedMode) {
      this.setupSimulatedUsers();
      console.log('🔄 Cambiado a modo simulado para desarrollo');
    } else {
      console.log('🔄 Cambiado a modo real de Google OAuth');
    }

    return { success: true, useSimulatedMode: this.useSimulatedMode };
  }

  // Actualizar configuración
  updateConfiguration(newConfig) {
    try {
      if (newConfig.clientId) this.clientId = newConfig.clientId;
      if (newConfig.apiKey) this.apiKey = newConfig.apiKey;
      if (newConfig.scope) this.scope = newConfig.scope;
      if (newConfig.useSimulatedMode !== undefined) this.useSimulatedMode = newConfig.useSimulatedMode;

      this.isInitialized = false; // Forzar reinicialización

      console.log('✅ Configuración de Google OAuth actualizada');
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando configuración:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener instrucciones de configuración
  getSetupInstructions() {
    if (this.useSimulatedMode) {
      return {
        mode: 'simulado',
        instructions: 'Modo de desarrollo activo. No se requieren credenciales reales.',
        nextSteps: 'Para usar Google real, cambia useSimulatedMode a false y configura las credenciales.',
      };
    } else {
      return {
        mode: 'real',
        instructions: 'Modo de producción activo. Se requieren credenciales reales de Google Cloud Console.',
        nextSteps: [
          '1. Ve a Google Cloud Console',
          '2. Crea un proyecto o selecciona uno existente',
          '3. Habilita Google+ API',
          '4. Crea credenciales OAuth 2.0',
          '5. Configura los orígenes autorizados',
          '6. Actualiza clientId y apiKey en este archivo',
        ],
      };
    }
  }
}

// Instancia global
const axyraGoogleOAuth = new AXYRAGoogleOAuth();

// Funciones globales para uso en HTML
window.toggleGoogleMode = () => {
  const result = axyraGoogleOAuth.toggleMode();
  console.log('Modo Google OAuth:', result.useSimulatedMode ? 'Simulado' : 'Real');
  return result;
};

window.getGoogleStatus = () => {
  const status = axyraGoogleOAuth.getStatus();
  console.log('Estado Google OAuth:', status);
  return status;
};

window.getGoogleSetupInstructions = () => {
  const instructions = axyraGoogleOAuth.getSetupInstructions();
  console.log('Instrucciones de configuración:', instructions);
  return instructions;
};

// Exportar para uso en otros módulos
window.AXYRAGoogleOAuth = AXYRAGoogleOAuth;
window.axyraGoogleOAuth = axyraGoogleOAuth;
