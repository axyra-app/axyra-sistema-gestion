/**
 * AXYRA Simple Authentication
 * Sistema MUY SIMPLE sin verificaciones automáticas molestas
 * Versión: 1.0 - Solo lo esencial
 */

class AXYRASimpleAuth {
  constructor() {
    this.users = this.loadUsersFromStorage();
    this.currentUser = null;
    this.isAuthenticated = false;
    
    this.init();
  }

  init() {
    console.log('🚀 AXYRA Simple Auth inicializando...');
    this.setupDefaultUsers();
    this.checkExistingSession();
  }

  // Cargar usuarios desde localStorage
  loadUsersFromStorage() {
    try {
      const stored = localStorage.getItem('axyra_users');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      return [];
    }
  }

  // Configurar usuarios por defecto si no existen
  setupDefaultUsers() {
    if (this.users.length === 0) {
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

      this.users = defaultUsers;
      this.saveUsersToStorage();
      console.log('✅ Usuarios por defecto creados');
    }
  }

  // Guardar usuarios en localStorage
  saveUsersToStorage() {
    try {
      localStorage.setItem('axyra_users', JSON.stringify(this.users));
    } catch (error) {
      console.error('❌ Error guardando usuarios:', error);
    }
  }

  // Verificar sesión existente - SIN VERIFICACIONES AUTOMÁTICAS
  checkExistingSession() {
    const userData = localStorage.getItem('axyra_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser = user;
        this.isAuthenticated = true;
        console.log('✅ Sesión existente cargada:', user.username);
        return true;
      } catch (error) {
        console.error('❌ Error verificando sesión:', error);
        this.logout();
      }
    }
    return false;
  }

  // Iniciar sesión - MUY SIMPLE
  login(credentials) {
    const { usernameOrEmail, password } = credentials;

    if (!usernameOrEmail || !password) {
      return { success: false, error: 'Usuario/email y contraseña son requeridos' };
    }

    // Buscar usuario por username o email
    const user = this.users.find(u => 
      (u.username === usernameOrEmail || u.email === usernameOrEmail) && 
      u.password === password && 
      u.isActive
    );

    if (!user) {
      return { success: false, error: 'Credenciales incorrectas' };
    }

    // Crear sesión simple
    this.currentUser = user;
    this.isAuthenticated = true;
    localStorage.setItem('axyra_user', JSON.stringify(user));

    console.log('✅ Login exitoso:', user.username);
    return { success: true, user: user };
  }

  // Cerrar sesión - MUY SIMPLE
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('axyra_user');
    console.log('✅ Sesión cerrada');
    return { success: true };
  }

  // Verificar si está autenticado - SIN VERIFICACIONES AUTOMÁTICAS
  isUserAuthenticated() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Obtener todos los usuarios (solo para admin)
  getUsers() {
    if (this.currentUser && this.currentUser.role === 'admin') {
      return this.users.map(u => ({
        id: u.id,
        username: u.username,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
        lastLogin: u.lastLogin
      }));
    }
    return [];
  }

  // Verificar salud de la API
  healthCheck() {
    return {
      status: 'healthy',
      usersCount: this.users.length,
      authenticatedUsers: this.isAuthenticated ? 1 : 0,
      timestamp: new Date().toISOString()
    };
  }
}

// Instancia global
const axyraSimpleAuth = new AXYRASimpleAuth();

// Exportar para uso en otros módulos
window.AXYRASimpleAuth = AXYRASimpleAuth;
window.axyraSimpleAuth = axyraSimpleAuth;

console.log('🚀 AXYRA Simple Auth cargado y lista - SIN VERIFICACIONES AUTOMÁTICAS');
