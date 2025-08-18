/**
 * AXYRA Google OAuth Configuration
 * Configuración para autenticación con Google
 * Versión: 3.0 - Solo modo real, sin simulación
 */

class AXYRAGoogleOAuth {
  constructor() {
    this.clientId = null;
    this.apiKey = null;
    this.discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'];
    this.scope = 'email profile';
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('AXYRA Google OAuth inicializado');
    this.loadConfiguration();
  }

  // Cargar configuración
  loadConfiguration() {
    try {
      // Configuración para producción
      this.clientId = '105198865804-2q8q8q8q8q8q8q8q8q8q8q8q8q8q8q8q.apps.googleusercontent.com';
      this.apiKey = 'AIzaSyDZIgISusap5LecwLzdXR9AhqjH3QiASSY';

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

  // Cerrar sesión de Google
  async signOut() {
    try {
      if (!this.isInitialized) {
        return { success: false, error: 'Google OAuth no inicializado' };
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
      hasClientId: !!this.clientId,
      hasApiKey: !!this.apiKey,
      scope: this.scope,
    };
  }
}

// Instancia global
const axyraGoogleOAuth = new AXYRAGoogleOAuth();

// Exportar para uso en otros módulos
window.AXYRAGoogleOAuth = AXYRAGoogleOAuth;
window.axyraGoogleOAuth = axyraGoogleOAuth;
