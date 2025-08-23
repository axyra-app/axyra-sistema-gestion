// SISTEMA UNIFICADO DE AUTENTICACIÓN AXYRA - VERSIÓN COMPLETA
// Resuelve conflictos entre múltiples sistemas de autenticación

class AxyraUnifiedAuthSystem {
  constructor() {
    this.isInitialized = false;
    this.currentUser = null;
    this.authMethods = {
      firebase: false,
      localStorage: false,
      isolated: false,
    };
    this.authState = 'UNKNOWN';
    this.sessionTimeout = null;
    this.maxLoginAttempts = 5;
    this.currentLoginAttempts = 0;
    this.blockedUntil = null;

    console.log('🔐 Inicializando Sistema Unificado de Autenticación AXYRA...');
  }

  // Inicializar sistema unificado
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('⚠️ Sistema ya inicializado');
        return;
      }

      console.log('🔄 Configurando métodos de autenticación...');

      // Verificar disponibilidad de métodos
      await this.checkAuthMethods();

      // Intentar autenticación automática
      await this.autoAuthenticate();

      // Configurar listeners de seguridad
      this.setupSecurityListeners();

      // Configurar timeout de sesión
      this.setupSessionTimeout();

      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Autenticación AXYRA inicializado correctamente');

      // Emitir evento de inicialización
      this.emitAuthEvent('systemInitialized', { user: this.currentUser });
    } catch (error) {
      console.error('❌ Error inicializando sistema unificado:', error);
      this.authState = 'ERROR';
    }
  }

  // Verificar métodos de autenticación disponibles
  async checkAuthMethods() {
    try {
      // Verificar Firebase
      if (typeof firebase !== 'undefined' && firebase.auth) {
        this.authMethods.firebase = true;
        console.log('✅ Firebase Auth disponible');
      }

      // Verificar localStorage
      if (typeof localStorage !== 'undefined') {
        this.authMethods.localStorage = true;
        console.log('✅ localStorage disponible');
      }

      // Verificar sistema aislado
      if (window.axyraIsolatedAuth) {
        this.authMethods.isolated = true;
        console.log('✅ Sistema aislado disponible');
      }

      console.log('📊 Métodos disponibles:', this.authMethods);
    } catch (error) {
      console.error('❌ Error verificando métodos:', error);
    }
  }

  // Autenticación automática
  async autoAuthenticate() {
    try {
      console.log('🔄 Intentando autenticación automática...');

      // Prioridad 1: Firebase (si está disponible)
      if (this.authMethods.firebase) {
        const firebaseUser = await this.authenticateWithFirebase();
        if (firebaseUser) {
          this.currentUser = firebaseUser;
          this.authState = 'AUTHENTICATED';
          console.log('✅ Usuario autenticado con Firebase:', firebaseUser);
          return;
        }
      }

      // Prioridad 2: Sistema aislado
      if (this.authMethods.isolated && window.axyraIsolatedAuth) {
        const isolatedUser = await this.authenticateWithIsolated();
        if (isolatedUser) {
          this.currentUser = isolatedUser;
          this.authState = 'AUTHENTICATED';
          console.log('✅ Usuario autenticado con sistema aislado:', isolatedUser);
          return;
        }
      }

      // Prioridad 3: localStorage
      if (this.authMethods.localStorage) {
        const localUser = await this.authenticateWithLocalStorage();
        if (localUser) {
          this.currentUser = localUser;
          this.authState = 'AUTHENTICATED';
          console.log('✅ Usuario autenticado con localStorage:', localUser);
          return;
        }
      }

      // Sin autenticación
      this.authState = 'UNAUTHENTICATED';
      console.log('ℹ️ No se encontró usuario autenticado');
    } catch (error) {
      console.error('❌ Error en autenticación automática:', error);
      this.authState = 'ERROR';
    }
  }

  // Autenticación con Firebase
  async authenticateWithFirebase() {
    try {
      return new Promise((resolve) => {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            const firebaseUser = {
              id: user.uid,
              email: user.email,
              username: user.displayName || user.email,
              provider: 'firebase',
              lastLogin: new Date().toISOString(),
              isVerified: user.emailVerified,
            };
            resolve(firebaseUser);
          } else {
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('❌ Error autenticando con Firebase:', error);
      return null;
    }
  }

  // Autenticación con sistema aislado
  async authenticateWithIsolated() {
    try {
      if (window.axyraIsolatedAuth && window.axyraIsolatedAuth.getCurrentUser) {
        return await window.axyraIsolatedAuth.getCurrentUser();
      }
      return null;
    } catch (error) {
      console.error('❌ Error autenticando con sistema aislado:', error);
      return null;
    }
  }

  // Autenticación con localStorage
  async authenticateWithLocalStorage() {
    try {
      const userData = localStorage.getItem('axyra.app');
      if (userData) {
        const user = JSON.parse(userData);
        if (user && user.username) {
          return {
            id: user.id || Date.now(),
            username: user.username,
            email: user.email || user.username,
            provider: 'localStorage',
            lastLogin: new Date().toISOString(),
            isVerified: true,
          };
        }
      }
      return null;
    } catch (error) {
      console.error('❌ Error autenticando con localStorage:', error);
      return null;
    }
  }

  // Login unificado
  async login(credentials) {
    try {
      // Verificar si está bloqueado
      if (this.isBlocked()) {
        throw new Error('Cuenta temporalmente bloqueada por múltiples intentos fallidos');
      }

      console.log('🔄 Iniciando login unificado...');

      let authenticatedUser = null;

      // Intentar con Firebase primero
      if (this.authMethods.firebase && credentials.email && credentials.password) {
        try {
          authenticatedUser = await this.loginWithFirebase(credentials);
        } catch (error) {
          console.warn('⚠️ Login con Firebase falló:', error.message);
        }
      }

      // Fallback a sistema aislado
      if (!authenticatedUser && this.authMethods.isolated) {
        try {
          authenticatedUser = await this.loginWithIsolated(credentials);
        } catch (error) {
          console.warn('⚠️ Login con sistema aislado falló:', error.message);
        }
      }

      // Fallback a localStorage
      if (!authenticatedUser && this.authMethods.localStorage) {
        try {
          authenticatedUser = await this.loginWithLocalStorage(credentials);
        } catch (error) {
          console.warn('⚠️ Login con localStorage falló:', error.message);
        }
      }

      if (authenticatedUser) {
        // Login exitoso
        this.currentUser = authenticatedUser;
        this.authState = 'AUTHENTICATED';
        this.currentLoginAttempts = 0;
        this.blockedUntil = null;

        // Guardar en localStorage como respaldo
        if (this.authMethods.localStorage) {
          localStorage.setItem('axyra.app', JSON.stringify(authenticatedUser));
        }

        console.log('✅ Login exitoso:', authenticatedUser);
        this.emitAuthEvent('loginSuccess', { user: authenticatedUser });

        return authenticatedUser;
      } else {
        // Login fallido
        this.handleFailedLogin();
        throw new Error('Todas las opciones de autenticación fallaron');
      }
    } catch (error) {
      console.error('❌ Error en login unificado:', error);
      this.emitAuthEvent('loginError', { error: error.message });
      throw error;
    }
  }

  // Login con Firebase
  async loginWithFirebase(credentials) {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(credentials.email, credentials.password);

      return {
        id: userCredential.user.uid,
        email: userCredential.user.email,
        username: userCredential.user.displayName || userCredential.user.email,
        provider: 'firebase',
        lastLogin: new Date().toISOString(),
        isVerified: userCredential.user.emailVerified,
      };
    } catch (error) {
      throw new Error(`Firebase: ${error.message}`);
    }
  }

  // Login con sistema aislado
  async loginWithIsolated(credentials) {
    try {
      if (window.axyraIsolatedAuth && window.axyraIsolatedAuth.login) {
        return await window.axyraIsolatedAuth.login(credentials);
      }
      throw new Error('Sistema aislado no disponible');
    } catch (error) {
      throw new Error(`Sistema aislado: ${error.message}`);
    }
  }

  // Login con localStorage
  async loginWithLocalStorage(credentials) {
    try {
      // Simular validación (en producción esto vendría de una API)
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        return {
          id: Date.now(),
          username: credentials.username,
          email: credentials.username + '@villavenecia.com',
          provider: 'localStorage',
          lastLogin: new Date().toISOString(),
          isVerified: true,
        };
      }
      throw new Error('Credenciales inválidas');
    } catch (error) {
      throw new Error(`localStorage: ${error.message}`);
    }
  }

  // Logout unificado
  async logout() {
    try {
      console.log('🔄 Iniciando logout unificado...');

      // Logout de Firebase
      if (this.authMethods.firebase && firebase.auth) {
        try {
          await firebase.auth().signOut();
        } catch (error) {
          console.warn('⚠️ Logout de Firebase falló:', error.message);
        }
      }

      // Logout del sistema aislado
      if (this.authMethods.isolated && window.axyraIsolatedAuth && window.axyraIsolatedAuth.logout) {
        try {
          await window.axyraIsolatedAuth.logout();
        } catch (error) {
          console.warn('⚠️ Logout del sistema aislado falló:', error.message);
        }
      }

      // Limpiar localStorage
      if (this.authMethods.localStorage) {
        localStorage.removeItem('axyra.app');
      }

      // Limpiar estado
      this.currentUser = null;
      this.authState = 'UNAUTHENTICATED';

      // Limpiar timeout de sesión
      if (this.sessionTimeout) {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = null;
      }

      console.log('✅ Logout completado');
      this.emitAuthEvent('logoutSuccess', {});

      // Redirigir a login
      setTimeout(() => {
        window.location.href = '/frontend/login.html';
      }, 1000);
    } catch (error) {
      console.error('❌ Error en logout unificado:', error);
      this.emitAuthEvent('logoutError', { error: error.message });
    }
  }

  // Manejar login fallido
  handleFailedLogin() {
    this.currentLoginAttempts++;

    if (this.currentLoginAttempts >= this.maxLoginAttempts) {
      // Bloquear cuenta por 15 minutos
      this.blockedUntil = new Date(Date.now() + 15 * 60 * 1000);
      console.warn('⚠️ Cuenta bloqueada por múltiples intentos fallidos');
      this.emitAuthEvent('accountBlocked', {
        blockedUntil: this.blockedUntil,
        reason: 'Múltiples intentos fallidos de login',
      });
    }
  }

  // Verificar si está bloqueado
  isBlocked() {
    if (this.blockedUntil && new Date() < this.blockedUntil) {
      return true;
    }

    // Si ya pasó el tiempo de bloqueo, resetear
    if (this.blockedUntil && new Date() >= this.blockedUntil) {
      this.blockedUntil = null;
      this.currentLoginAttempts = 0;
    }

    return false;
  }

  // Configurar listeners de seguridad
  setupSecurityListeners() {
    try {
      // Listener para cambios de autenticación
      if (this.authMethods.firebase) {
        firebase.auth().onAuthStateChanged((user) => {
          if (user && this.authState !== 'AUTHENTICATED') {
            this.autoAuthenticate();
          } else if (!user && this.authState === 'AUTHENTICATED') {
            this.logout();
          }
        });
      }

      // Listener para cambios en localStorage
      if (this.authMethods.localStorage) {
        window.addEventListener('storage', (e) => {
          if (e.key === 'axyra.app') {
            this.autoAuthenticate();
          }
        });
      }

      console.log('✅ Listeners de seguridad configurados');
    } catch (error) {
      console.error('❌ Error configurando listeners de seguridad:', error);
    }
  }

  // Configurar timeout de sesión
  setupSessionTimeout() {
    try {
      const timeoutMinutes = 30; // Configurable
      const timeoutMs = timeoutMinutes * 60 * 1000;

      this.sessionTimeout = setTimeout(() => {
        console.log('⏰ Timeout de sesión alcanzado');
        this.logout();
      }, timeoutMs);

      console.log(`✅ Timeout de sesión configurado: ${timeoutMinutes} minutos`);
    } catch (error) {
      console.error('❌ Error configurando timeout de sesión:', error);
    }
  }

  // Verificar autenticación
  isAuthenticated() {
    return this.authState === 'AUTHENTICATED' && this.currentUser !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Obtener estado de autenticación
  getAuthState() {
    return this.authState;
  }

  // Verificar permisos
  hasPermission(permission) {
    if (!this.isAuthenticated()) {
      return false;
    }

    // Implementar lógica de permisos basada en roles
    // Por ahora, todos los usuarios autenticados tienen acceso completo
    return true;
  }

  // Emitir eventos de autenticación
  emitAuthEvent(eventName, data) {
    try {
      const event = new CustomEvent(`axyra:auth:${eventName}`, {
        detail: {
          timestamp: new Date().toISOString(),
          user: this.currentUser,
          authState: this.authState,
          ...data,
        },
      });

      window.dispatchEvent(event);
      console.log(`📡 Evento emitido: axyra:auth:${eventName}`, data);
    } catch (error) {
      console.error('❌ Error emitiendo evento:', error);
    }
  }

  // Actualizar configuración
  updateConfig(config) {
    try {
      if (config.maxLoginAttempts) {
        this.maxLoginAttempts = config.maxLoginAttempts;
      }

      if (config.sessionTimeout) {
        // Reiniciar timeout con nueva configuración
        if (this.sessionTimeout) {
          clearTimeout(this.sessionTimeout);
        }
        this.setupSessionTimeout();
      }

      console.log('✅ Configuración de autenticación actualizada:', config);
    } catch (error) {
      console.error('❌ Error actualizando configuración:', error);
    }
  }

  // Obtener información del sistema
  getSystemInfo() {
    return {
      isInitialized: this.isInitialized,
      authState: this.authState,
      authMethods: this.authMethods,
      currentUser: this.currentUser,
      loginAttempts: this.currentLoginAttempts,
      isBlocked: this.isBlocked(),
      blockedUntil: this.blockedUntil,
      sessionTimeout: this.sessionTimeout ? 'Configurado' : 'No configurado',
    };
  }
}

// Crear instancia global
window.axyraUnifiedAuth = new AxyraUnifiedAuthSystem();

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraUnifiedAuth.initialize();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraUnifiedAuthSystem;
}

console.log('🔐 Sistema Unificado de Autenticación AXYRA cargado');
