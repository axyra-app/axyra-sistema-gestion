// Sistema Unificado de Autenticación AXYRA - VERSIÓN SIMPLIFICADA
// Evita conflictos y mejora el rendimiento

class AxyraUnifiedAuthSystem {
  constructor() {
    this.isInitialized = false;
    this.authMethods = [];
    this.currentUser = null;
    this.config = {
      autoRedirect: true,
      sessionTimeout: 30 * 60 * 1000, // 30 minutos
      debug: false
    };
  }

  // Inicialización simple sin conflictos
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('🔐 Inicializando Sistema Unificado de Auth AXYRA...');
      
      // Verificar métodos disponibles sin interferir
      this.checkAuthMethods();
      
      // Configurar listeners básicos
      this.setupBasicListeners();
      
      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Auth AXYRA inicializado');
    } catch (error) {
      console.warn('⚠️ Error inicializando sistema unificado de auth:', error);
    }
  }

  // Verificar métodos disponibles sin interferir
  checkAuthMethods() {
    this.authMethods = [];
    
    // Verificar Firebase
    if (typeof firebase !== 'undefined' && firebase.auth) {
      this.authMethods.push('firebase');
    }
    
    // Verificar localStorage
    if (localStorage.getItem('axyra_isolated_user')) {
      this.authMethods.push('localStorage');
    }
    
    // Verificar sistema aislado
    if (window.axyraAuthManager) {
      this.authMethods.push('isolated');
    }
    
    console.log('🔍 Métodos de auth disponibles:', this.authMethods);
  }

  // Configurar listeners básicos
  setupBasicListeners() {
    // Solo configurar si no hay conflictos
    if (!window.axyraAuthManager) {
      window.addEventListener('storage', (e) => {
        if (e.key === 'axyra_isolated_user') {
          this.handleStorageChange(e);
        }
      });
    }
  }

  // Manejar cambios en storage
  handleStorageChange(event) {
    try {
      if (event.newValue) {
        const userData = JSON.parse(event.newValue);
        if (userData && userData.isAuthenticated) {
          this.currentUser = userData;
        }
      }
    } catch (error) {
      console.warn('⚠️ Error procesando cambio en storage:', error);
    }
  }

  // Verificar autenticación sin interferir
  isAuthenticated() {
    try {
      // Usar método existente si está disponible
      if (window.axyraAuthManager) {
        return window.axyraAuthManager.isUserAuthenticated();
      }
      
      // Fallback a localStorage
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user && user.isAuthenticated;
      }
      
      return false;
    } catch (error) {
      console.warn('⚠️ Error verificando autenticación:', error);
      return false;
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    try {
      if (window.axyraAuthManager) {
        return window.axyraAuthManager.getCurrentUser();
      }
      
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        return JSON.parse(userData);
      }
      
      return null;
    } catch (error) {
      console.warn('⚠️ Error obteniendo usuario actual:', error);
      return null;
    }
  }

  // Logout simple
  logout() {
    try {
      console.log('🚪 Cerrando sesión desde sistema unificado...');
      
      // Limpiar localStorage
      localStorage.removeItem('axyra_isolated_user');
      
      // Redirigir al login
      if (this.config.autoRedirect) {
        window.location.href = '../../login.html';
      }
    } catch (error) {
      console.warn('⚠️ Error en logout:', error);
      // Fallback
      window.location.href = '../../login.html';
    }
  }

  // Información del sistema
  getSystemInfo() {
    return {
      version: '1.0.0-simplified',
      authMethods: this.authMethods,
      isInitialized: this.isInitialized,
      currentUser: this.currentUser ? 'authenticated' : 'not_authenticated'
    };
  }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!window.axyraUnifiedAuth) {
    window.axyraUnifiedAuth = new AxyraUnifiedAuthSystem();
    window.axyraUnifiedAuth.initialize();
  }
});

// Exportar para uso global
window.AxyraUnifiedAuthSystem = AxyraUnifiedAuthSystem;
