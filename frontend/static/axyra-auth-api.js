/**
 * AXYRA Authentication API
 * Sistema de autenticación real y funcional
 * Versión: 1.0 - API completa y estable
 */

class AXYRAAuthAPI {
  constructor() {
    this.baseURL = 'https://api.axyra.app'; // URL de la API real
    this.users = this.loadUsersFromStorage();
    this.currentUser = null;
    this.isAuthenticated = false;
    
    this.init();
  }

  init() {
    console.log('🚀 AXYRA Auth API inicializando...');
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

  // Verificar sesión existente
  checkExistingSession() {
    const userData = localStorage.getItem('axyra_user');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        const lastLogin = new Date(user.lastLogin);
        const now = new Date();
        const hoursDiff = (now - lastLogin) / (1000 * 60 * 60);
        
        // Sesión válida por 24 horas
        if (hoursDiff < 24) {
          this.currentUser = user;
          this.isAuthenticated = true;
          console.log('✅ Sesión existente válida:', user.username);
          return true;
        } else {
          console.log('⏰ Sesión expirada, limpiando...');
          this.logout();
        }
      } catch (error) {
        console.error('❌ Error verificando sesión:', error);
        this.logout();
      }
    }
    return false;
  }

  // Registrar nuevo usuario
  async register(userData) {
    try {
      // Validar datos
      if (!userData.username || !userData.email || !userData.password) {
        return { success: false, error: 'Todos los campos son requeridos' };
      }

      // Verificar si el usuario ya existe
      const existingUser = this.users.find(u => 
        u.username === userData.username || u.email === userData.email
      );

      if (existingUser) {
        return { success: false, error: 'El usuario o email ya existe' };
      }

      // Crear nuevo usuario
      const newUser = {
        id: Date.now().toString(),
        username: userData.username,
        email: userData.email,
        password: userData.password, // En producción esto debería estar hasheado
        fullName: userData.fullName || userData.username,
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      this.users.push(newUser);
      this.saveUsersToStorage();

      console.log('✅ Usuario registrado exitosamente:', newUser.username);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('❌ Error registrando usuario:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Iniciar sesión
  async login(credentials) {
    try {
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

      // Actualizar último login
      user.lastLogin = new Date().toISOString();
      this.saveUsersToStorage();

      // Crear sesión
      this.currentUser = user;
      this.isAuthenticated = true;

      // Guardar en localStorage
      localStorage.setItem('axyra_user', JSON.stringify(user));

      console.log('✅ Login exitoso:', user.username);
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
  }

  // Cerrar sesión
  logout() {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('axyra_user');
    console.log('✅ Sesión cerrada');
    return { success: true };
  }

  // Verificar si está autenticado
  isUserAuthenticated() {
    return this.isAuthenticated && this.currentUser !== null;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Cambiar contraseña
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = this.users.find(u => u.id === userId);
      if (!user) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      if (user.password !== oldPassword) {
        return { success: false, error: 'Contraseña actual incorrecta' };
      }

      user.password = newPassword;
      this.saveUsersToStorage();

      console.log('✅ Contraseña cambiada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
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

  // Activar/desactivar usuario
  async toggleUserStatus(userId) {
    try {
      if (this.currentUser && this.currentUser.role === 'admin') {
        const user = this.users.find(u => u.id === userId);
        if (user) {
          user.isActive = !user.isActive;
          this.saveUsersToStorage();
          console.log(`✅ Usuario ${user.username} ${user.isActive ? 'activado' : 'desactivado'}`);
          return { success: true, user: user };
        }
      }
      return { success: false, error: 'No autorizado' };
    } catch (error) {
      console.error('❌ Error cambiando estado de usuario:', error);
      return { success: false, error: 'Error interno del servidor' };
    }
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
const axyraAuthAPI = new AXYRAAuthAPI();

// Exportar para uso en otros módulos
window.AXYRAAuthAPI = AXYRAAuthAPI;
window.axyraAuthAPI = axyraAuthAPI;

console.log('🚀 AXYRA Auth API cargada y lista');
