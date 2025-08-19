/**
 * AXYRA Isolated Authentication
 * Sistema COMPLETAMENTE AISLADO sin interferencias externas
 * Versión: 1.0 - Solo autenticación pura
 */

class AXYRAIsolatedAuth {
  constructor() {
    this.users = [];
    this.currentUser = null;
    this.isAuthenticated = false;
    
    this.init();
  }

  init() {
    console.log('🚀 AXYRA Isolated Auth inicializando...');
    this.setupDefaultUsers();
    this.loadExistingSession();
    
    // 🚨 MONITOREO: Observar cambios en localStorage
    this.setupStorageMonitoring();
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
        lastLogin: null
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
        lastLogin: null
      }
    ];

    // Guardar en localStorage con clave única
    localStorage.setItem('axyra_isolated_users', JSON.stringify(defaultUsers));
    this.users = defaultUsers;
    console.log('✅ Usuarios por defecto creados en sistema aislado');
  }

  // Cargar sesión existente
  loadExistingSession() {
    const userData = localStorage.getItem('axyra_isolated_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser = user;
        this.isAuthenticated = true;
        console.log('✅ Sesión existente cargada en sistema aislado:', user.username);
      } catch (error) {
        console.error('❌ Error cargando sesión aislada:', error);
        this.clearSession();
      }
    }
  }

  // Iniciar sesión - COMPLETAMENTE AISLADO
  login(credentials) {
    console.log('🔐 Iniciando login en sistema aislado...');
    
    const { usernameOrEmail, password } = credentials;

    if (!usernameOrEmail || !password) {
      return { success: false, error: 'Usuario/email y contraseña son requeridos' };
    }

    // Buscar usuario
    const user = this.users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password && 
      u.isActive
    );

    if (!user) {
      return { success: false, error: 'Credenciales incorrectas' };
    }

    // Crear sesión aislada
    this.currentUser = user;
    this.isAuthenticated = true;
    
    // Guardar en localStorage aislado
    localStorage.setItem('axyra_isolated_user', JSON.stringify(user));
    
    console.log('✅ Login exitoso en sistema aislado:', user.username);
    console.log('✅ Estado del sistema:', {
      isAuthenticated: this.isAuthenticated,
      currentUser: this.currentUser.username
    });
    
    // 🚨 SUPERVIVENCIA: Verificar que la sesión persista
    console.log('🚨 SUPERVIVENCIA: Verificando persistencia de sesión...');
    
    // Verificar inmediatamente después del login
    setTimeout(() => {
      console.log('🚨 SUPERVIVENCIA (100ms): Estado del sistema:', {
        isAuthenticated: this.isAuthenticated,
        currentUser: this.currentUser ? this.currentUser.username : 'NULL',
        localStorage: localStorage.getItem('axyra_isolated_user') ? 'PERSISTE' : 'DESAPARECIÓ'
      });
    }, 100);
    
    // Verificar después de 500ms
    setTimeout(() => {
      console.log('🚨 SUPERVIVENCIA (500ms): Estado del sistema:', {
        isAuthenticated: this.isAuthenticated,
        currentUser: this.currentUser ? this.currentUser.username : 'NULL',
        localStorage: localStorage.getItem('axyra_isolated_user') ? 'PERSISTE' : 'DESAPARECIÓ'
      });
    }, 500);
    
    // Verificar después de 1 segundo
    setTimeout(() => {
      console.log('🚨 SUPERVIVENCIA (1s): Estado del sistema:', {
        isAuthenticated: this.isAuthenticated,
        currentUser: this.currentUser ? this.currentUser.username : 'NULL',
        localStorage: localStorage.getItem('axyra_isolated_user') ? 'PERSISTE' : 'DESAPARECIÓ'
      });
    }, 1000);
    
    return { success: true, user: user };
  }

  // Cerrar sesión - COMPLETAMENTE AISLADO
  logout() {
    console.log('🔒 Cerrando sesión en sistema aislado...');
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('axyra_isolated_user');
    console.log('✅ Sesión cerrada en sistema aislado');
    return { success: true };
  }

  // Verificar autenticación - COMPLETAMENTE AISLADO
  isUserAuthenticated() {
    const hasSession = this.isAuthenticated && this.currentUser !== null;
    console.log('🔍 Verificando autenticación aislada:', hasSession);
    return hasSession;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Verificar salud del sistema
  healthCheck() {
    return {
      status: 'isolated_healthy',
      usersCount: this.users.length,
      authenticatedUsers: this.isAuthenticated ? 1 : 0,
      currentUser: this.currentUser ? this.currentUser.username : null,
      timestamp: new Date().toISOString()
    };
  }

  // Limpiar sesión
  clearSession() {
    console.log('🚨 ALERTA: clearSession() fue llamado - ¿QUIÉN LO LLAMÓ?');
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
}

// Instancia global aislada
const axyraIsolatedAuth = new AXYRAIsolatedAuth();

    // Exportar para uso en otros módulos
    window.AXYRAIsolatedAuth = AXYRAIsolatedAuth;
    window.axyraIsolatedAuth = axyraIsolatedAuth;
    
    // 🚨 MONITOREO: Interceptar redirecciones
    const originalLocationHref = Object.getOwnPropertyDescriptor(window.location, 'href');
    Object.defineProperty(window.location, 'href', {
      set: function(value) {
        if (value.includes('dashboard') || value.includes('modulos')) {
          console.log('🚨 ALERTA: Redirección detectada a:', value);
          console.trace('🚨 STACK TRACE de redirección');
          console.log('🚨 QUIEN LO LLAMÓ:', new Error().stack);
        }
        return originalLocationHref.set.call(this, value);
      },
      get: function() {
        return originalLocationHref.get.call(this);
      }
    });
    
    console.log('🚀 AXYRA Isolated Auth cargado - SISTEMA COMPLETAMENTE AISLADO CON MONITOREO');
