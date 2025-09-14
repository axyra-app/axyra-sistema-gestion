// ========================================
// SERVICIO DE AUTENTICACIÓN AXYRA
// ========================================

/**
 * Servicio de autenticación centralizado
 * Maneja login, logout, registro y gestión de sesiones
 */
class AxyraAuthService {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.authStateListeners = [];
    this.firebaseService = null;
  }

  /**
   * Inicializar el servicio de autenticación
   */
  async init(firebaseService) {
    this.firebaseService = firebaseService;

    // Escuchar cambios en el estado de autenticación
    this.firebaseService.onAuthStateChanged((user) => {
      this.handleAuthStateChange(user);
    });

    console.log('🔐 Servicio de autenticación inicializado');
  }

  /**
   * Manejar cambios en el estado de autenticación
   */
  handleAuthStateChange(user) {
    const wasAuthenticated = this.isAuthenticated;
    this.currentUser = user;
    this.isAuthenticated = !!user;

    // Notificar a los listeners
    this.authStateListeners.forEach((listener) => {
      listener(this.currentUser, wasAuthenticated);
    });

    // Emitir eventos
    if (this.isAuthenticated && !wasAuthenticated) {
      this.emit('auth:login', this.currentUser);
    } else if (!this.isAuthenticated && wasAuthenticated) {
      this.emit('auth:logout');
    }
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  async login(email, password) {
    try {
      console.log('🔐 Iniciando sesión...');

      const userCredential = await this.firebaseService.signInWithEmailAndPassword(email, password);
      this.currentUser = userCredential.user;
      this.isAuthenticated = true;

      console.log('✅ Sesión iniciada correctamente');
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('❌ Error iniciando sesión:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Cerrar sesión
   */
  async logout() {
    try {
      console.log('👋 Cerrando sesión...');

      await this.firebaseService.signOut();
      this.currentUser = null;
      this.isAuthenticated = false;

      console.log('✅ Sesión cerrada correctamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async register(email, password, userData = {}) {
    try {
      console.log('📝 Registrando nuevo usuario...');

      const userCredential = await this.firebaseService.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Guardar datos adicionales del usuario
      if (Object.keys(userData).length > 0) {
        await this.firebaseService.setUserData(user.uid, userData);
      }

      this.currentUser = user;
      this.isAuthenticated = true;

      console.log('✅ Usuario registrado correctamente');
      return { success: true, user: this.currentUser };
    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Obtener token de autenticación
   */
  async getAuthToken() {
    if (!this.currentUser) {
      return null;
    }

    try {
      return await this.currentUser.getIdToken();
    } catch (error) {
      console.error('❌ Error obteniendo token:', error);
      return null;
    }
  }

  /**
   * Escuchar cambios en el estado de autenticación
   */
  onAuthStateChanged(callback) {
    this.authStateListeners.push(callback);

    // Si ya hay un usuario autenticado, llamar inmediatamente
    if (this.isAuthenticated) {
      callback(this.currentUser, false);
    }
  }

  /**
   * Emitir evento
   */
  emit(eventName, data) {
    const event = new CustomEvent(eventName, { detail: data });
    document.dispatchEvent(event);
  }

  /**
   * Verificar permisos del usuario
   */
  hasPermission(permission) {
    if (!this.currentUser) {
      return false;
    }

    // Implementar lógica de permisos
    const userPermissions = this.currentUser.permissions || [];
    return userPermissions.includes(permission);
  }

  /**
   * Obtener información del usuario
   */
  getUserInfo() {
    if (!this.currentUser) {
      return null;
    }

    return {
      uid: this.currentUser.uid,
      email: this.currentUser.email,
      displayName: this.currentUser.displayName,
      photoURL: this.currentUser.photoURL,
      emailVerified: this.currentUser.emailVerified,
      lastLogin: this.currentUser.metadata?.lastSignInTime,
      createdAt: this.currentUser.metadata?.creationTime,
    };
  }
}

// Exportar para uso global
window.AxyraAuthService = AxyraAuthService;
