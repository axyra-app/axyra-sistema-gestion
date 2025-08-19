/**
 * AXYRA Ultra Simple Authentication
 * Sistema SIN VERIFICACIONES AUTOMÁTICAS - Solo login manual
 * Versión: 1.0 - Sin molestias, sin ciclos infinitos
 */

class AXYRAUltraSimpleAuth {
  constructor() {
    this.users = this.loadUsersFromStorage();
    this.currentUser = null;
    this.isAuthenticated = false;
    
    this.init();
  }

  init() {
    console.log('🚀 AXYRA Ultra Simple Auth inicializando...');
    this.setupDefaultUsers();
    // NO verificar sesión existente automáticamente
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

  // Iniciar sesión - MUY SIMPLE, SIN VERIFICACIONES
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
    // Solo verificar el estado actual, NO redirigir automáticamente
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
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
const axyraUltraSimpleAuth = new AXYRAUltraSimpleAuth();

// Exportar para uso en otros módulos
window.AXYRAUltraSimpleAuth = AXYRAUltraSimpleAuth;
window.axyraUltraSimpleAuth = axyraUltraSimpleAuth;

console.log('🚀 AXYRA Ultra Simple Auth cargado - SIN VERIFICACIONES AUTOMÁTICAS');
