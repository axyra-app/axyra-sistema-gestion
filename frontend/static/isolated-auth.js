/**
 * AXYRA Isolated Authentication
 * Sistema COMPLETAMENTE AISLADO sin interferencias externas
 * Versión: 2.0 - Sistema estable y sin bucles infinitos
 */

class AXYRAIsolatedAuth {
  constructor() {
    this.users = [];
    this.currentUser = null;
    this.isAuthenticated = false;
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('🚀 AXYRA Isolated Auth inicializando...');
    
    // LIMPIAR COMPLETAMENTE EL LOCALSTORAGE PARA EVITAR CONFLICTOS
    this.clearAllStorage();
    
    this.setupDefaultUsers();
    this.loadExistingSession();

    // 🚨 MONITOREO: Observar cambios en localStorage
    this.setupStorageMonitoring();

    this.isInitialized = true;
    console.log('✅ AXYRA Isolated Auth inicializado correctamente');
  }

  // Limpiar todo el localStorage para evitar conflictos
  clearAllStorage() {
    console.log('🧹 LIMPIANDO COMPLETAMENTE EL LOCALSTORAGE...');
    
    // Lista de claves a eliminar
    const keysToRemove = [
      'axyra_isolated_user',
      'axyra_isolated_session', 
      'axyra_isolated_remember',
      'axyra_firebase_user',
      'axyra_user_session',
      'axyra_remembered_user',
      'axyra_2fa_enabled',
      'axyra_2fa_secret',
      'axyra_2fa_backup_codes'
    ];
    
    // Eliminar cada clave
    keysToRemove.forEach(key => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ Eliminada clave: ${key}`);
      }
    });
    
    // Limpiar cookies también
    document.cookie.split(";").forEach(function(c) { 
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
    });
    
    console.log('✅ LocalStorage completamente limpiado');
  }

  // Configurar usuarios por defecto
  setupDefaultUsers() {
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@axyra.app',
        password: 'admin123',
        fullName: 'Administrador AXYRA',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
      {
        id: '2',
        username: 'demo',
        email: 'demo@axyra.app',
        password: 'demo123',
        fullName: 'Usuario Demo',
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null,
      },
    ];

    // Verificar si ya existen usuarios para no sobrescribir
    const existingUsers = localStorage.getItem('axyra_isolated_users');
    if (!existingUsers) {
      localStorage.setItem('axyra_isolated_users', JSON.stringify(defaultUsers));
      console.log('✅ Usuarios por defecto creados en sistema aislado');
    } else {
      try {
        this.users = JSON.parse(existingUsers);
        console.log('✅ Usuarios existentes cargados del sistema aislado');
      } catch (error) {
        console.error('❌ Error cargando usuarios existentes, creando nuevos:', error);
        localStorage.setItem('axyra_isolated_users', JSON.stringify(defaultUsers));
        this.users = defaultUsers;
      }
    }
  }

  // Cargar sesión existente
  loadExistingSession() {
    // NO cargar sesión automáticamente - requerir login manual
    console.log('⚠️ NO se carga sesión automáticamente - login manual requerido');
    
    // Limpiar cualquier sesión existente
    this.clearSession();
    
    // Verificar si hay una sesión recordada
    const rememberedUser = localStorage.getItem('axyra_isolated_remember');
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        const userExists = this.users.find((u) => u.id === userData.id);
        if (userExists) {
          console.log('✅ Usuario recordado encontrado, pero NO se autentica automáticamente');
          // NO establecer como autenticado automáticamente
        } else {
          console.log('⚠️ Usuario recordado no encontrado, limpiando');
          localStorage.removeItem('axyra_isolated_remember');
        }
      } catch (error) {
        console.error('❌ Error con usuario recordado:', error);
        localStorage.removeItem('axyra_isolated_remember');
      }
    }
  }

  // Iniciar sesión - COMPLETAMENTE AISLADO
  login(credentials) {
    console.log('🔐 Iniciando login en sistema aislado...');

    if (!this.isInitialized) {
      console.error('❌ Sistema no inicializado');
      return { success: false, error: 'Sistema de autenticación no inicializado' };
    }

    const { usernameOrEmail, password } = credentials;

    if (!usernameOrEmail || !password) {
      return { success: false, error: 'Usuario/email y contraseña son requeridos' };
    }

    console.log('🔍 Buscando usuario:', usernameOrEmail);

    // Buscar usuario
    const user = this.users.find(
      (u) => (u.username === usernameOrEmail || u.email === usernameOrEmail) && u.password === password && u.isActive
    );

    if (!user) {
      console.log('❌ Usuario no encontrado o credenciales incorrectas');
      return { success: false, error: 'Credenciales incorrectas' };
    }

    console.log('✅ Usuario encontrado:', user.username);

    // Crear sesión aislada
    this.currentUser = user;
    this.isAuthenticated = true;

    // Actualizar último login
    user.lastLogin = new Date().toISOString();

    // Guardar en localStorage aislado
    localStorage.setItem('axyra_isolated_user', JSON.stringify(user));

    // Actualizar usuario en la lista
    const userIndex = this.users.findIndex((u) => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
      localStorage.setItem('axyra_isolated_users', JSON.stringify(this.users));
    }

    console.log('✅ Login exitoso en sistema aislado:', user.username);
    console.log('✅ Estado del sistema:', {
      isAuthenticated: this.isAuthenticated,
      currentUser: this.currentUser.username,
    });

    return { success: true, user: user };
  }

  // Cerrar sesión - COMPLETAMENTE AISLADO
  logout() {
    try {
      console.log('🔄 Cerrando sesión...');
      
      // Limpiar sesión actual
      this.currentUser = null;
      this.isAuthenticated = false;
      
      // Limpiar localStorage
      localStorage.removeItem('axyra_isolated_user');
      localStorage.removeItem('axyra_isolated_session');
      localStorage.removeItem('axyra_isolated_remember');
      
      // Limpiar cualquier otra sesión que pueda estar activa
      localStorage.removeItem('axyra_firebase_user');
      localStorage.removeItem('axyra_user_session');
      localStorage.removeItem('axyra_remembered_user');
      
      // Limpiar cookies si existen
      document.cookie.split(";").forEach(function(c) { 
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
      });
      
      console.log('✅ Sesión cerrada completamente');
      
      // Redirigir al login
      if (!this.isOnLoginPage()) {
        window.location.href = '/login.html';
      }
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      // Forzar limpieza
      this.currentUser = null;
      this.isAuthenticated = false;
      localStorage.clear();
      window.location.href = '/login.html';
    }
  }

  // Verificar autenticación - COMPLETAMENTE AISLADO
  isUserAuthenticated() {
    if (!this.isInitialized) {
      console.log('⚠️ Sistema no inicializado, verificando localStorage directamente');
      const userData = localStorage.getItem('axyra_isolated_user');
      return userData !== null;
    }

    const hasSession = this.isAuthenticated && this.currentUser !== null;
    console.log('🔍 Verificando autenticación aislada:', hasSession);
    return hasSession;
  }

  // Obtener usuario actual
  getCurrentUser() {
    if (!this.isInitialized || !this.isAuthenticated) {
      // Fallback a localStorage
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (error) {
          console.error('❌ Error parseando usuario del localStorage:', error);
          return null;
        }
      }
      return null;
    }
    return this.currentUser;
  }

  // Verificar salud del sistema
  healthCheck() {
    return {
      status: 'isolated_healthy',
      isInitialized: this.isInitialized,
      usersCount: this.users.length,
      authenticatedUsers: this.isAuthenticated ? 1 : 0,
      currentUser: this.currentUser ? this.currentUser.username : null,
      timestamp: new Date().toISOString(),
    };
  }

  // Limpiar sesión
  clearSession() {
    console.log('🚨 ALERTA: clearSession() fue llamado');
    console.trace('🚨 STACK TRACE de clearSession');

    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('axyra_isolated_user');
    console.log('🧹 Sesión aislada limpiada');
  }

  // 🚨 MONITOREO: Observar cambios en localStorage
  setupStorageMonitoring() {
    console.log('🚨 MONITOREO: Configurando vigilancia de localStorage...');

    // Interceptar removeItem
    const originalRemoveItem = localStorage.removeItem;
    localStorage.removeItem = (key) => {
      if (key === 'axyra_isolated_user') {
        console.log('🚨 ALERTA: localStorage.removeItem("axyra_isolated_user") fue llamado');
        console.trace('🚨 STACK TRACE de removeItem');
        console.log('🚨 QUIEN LO LLAMÓ:', new Error().stack);
      }
      return originalRemoveItem.call(localStorage, key);
    };

    // Interceptar clear
    const originalClear = localStorage.clear;
    localStorage.clear = () => {
      console.log('🚨 ALERTA: localStorage.clear() fue llamado');
      console.trace('🚨 STACK TRACE de clear');
      console.log('🚨 QUIEN LO LLAMÓ:', new Error().stack);
      return originalClear.call(localStorage);
    };

    console.log('✅ MONITOREO: localStorage interceptado para detectar interferencias');
  }

  // Método para verificar si el usuario está en la página de login
  isOnLoginPage() {
    return window.location.pathname.includes('login.html') || window.location.pathname.includes('index.html');
  }

  // Método para verificar si debe redirigir (evita bucles infinitos)
  shouldRedirectToLogin() {
    // No redirigir si ya estamos en login o index
    if (this.isOnLoginPage()) {
      return false;
    }

    // Solo redirigir si no hay sesión activa
    return !this.isUserAuthenticated();
  }
}

// Instancia global aislada
const axyraIsolatedAuth = new AXYRAIsolatedAuth();

// Exportar para uso en otros módulos
window.AXYRAIsolatedAuth = AXYRAIsolatedAuth;
window.axyraIsolatedAuth = axyraIsolatedAuth;

console.log('🚀 AXYRA Isolated Auth cargado - SISTEMA COMPLETAMENTE AISLADO CON MONITOREO');
