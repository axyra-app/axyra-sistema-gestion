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
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('axyra_isolated_user');
    console.log('🧹 Sesión aislada limpiada');
  }
}

// Instancia global aislada
const axyraIsolatedAuth = new AXYRAIsolatedAuth();

// Exportar para uso en otros módulos
window.AXYRAIsolatedAuth = AXYRAIsolatedAuth;
window.axyraIsolatedAuth = axyraIsolatedAuth;

console.log('🚀 AXYRA Isolated Auth cargado - SISTEMA COMPLETAMENTE AISLADO');
