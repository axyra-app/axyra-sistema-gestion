/**
 * AXYRA Professional User System
 * Sistema de gestión de usuarios profesional y simplificado
 * Versión: 3.0 - Sistema unificado
 */

class AXYRAUserSystem {
  constructor() {
    this.sessionTimeout = 2 * 60 * 60 * 1000; // 2 horas
    this.currentUser = null;
    this.sessionTimer = null;

    this.init();
  }

  init() {
    this.loadCurrentUser();
    this.startSessionTimer();
    console.log('AXYRA Professional User System inicializado - Sistema unificado');
  }

  // Crear usuario
  async registerUser(userData) {
    try {
      const users = this.getUsers();

      // Verificar si el usuario ya existe
      if (users.find((u) => u.username === userData.username)) {
        return { success: false, error: 'El nombre de usuario ya existe' };
      }

      if (users.find((u) => u.email === userData.email)) {
        return { success: false, error: 'El email ya está registrado' };
      }

      const newUser = {
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        role: 'user',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        userId: userData.username,
      };

      users.push(newUser);
      this.saveUsers(users);

      console.log(`✅ Usuario ${newUser.username} registrado exitosamente`);
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Error registrando usuario:', error);
      return { success: false, error: 'Error al registrar usuario' };
    }
  }

  // Verificar email de usuario
  async verifyUserEmail(email, code) {
    try {
      const users = this.getUsers();
      const userIndex = users.findIndex((u) => u.email === email);

      if (userIndex === -1) {
        return { success: false, error: 'Usuario no encontrado' };
      }

      users[userIndex].emailVerified = true;
      this.saveUsers(users);

      console.log(`✅ Email verificado para ${users[userIndex].username}`);
      return { success: true, user: users[userIndex] };
    } catch (error) {
      console.error('Error verificando email:', error);
      return { success: false, error: 'Error al verificar email' };
    }
  }

  // Validar credenciales
  validateCredentials(username, password) {
    try {
      const users = this.getUsers();
      const user = users.find((u) => u.username === username && u.password === password);

      if (!user) {
        return { success: false, error: 'Credenciales incorrectas' };
      }

      if (!user.emailVerified) {
        return { success: false, needsVerification: true, error: 'Debes verificar tu email primero' };
      }

      return { success: true, user: user };
    } catch (error) {
      console.error('Error validando credenciales:', error);
      return { success: false, error: 'Error al validar credenciales' };
    }
  }

  // Crear sesión
  createSession(user) {
    try {
      this.currentUser = user;
      localStorage.setItem('axyra_user', JSON.stringify(user));
      localStorage.setItem('axyra_session_start', Date.now().toString());

      this.startSessionTimer();
      console.log(`✅ Sesión creada para ${user.username}`);

      return { success: true, user: user };
    } catch (error) {
      console.error('Error creando sesión:', error);
      return { success: false, error: 'Error al crear sesión' };
    }
  }

  // Verificar si hay sesión activa
  hasActiveSession() {
    try {
      const user = localStorage.getItem('axyra_user');
      const sessionStart = localStorage.getItem('axyra_session_start');

      if (!user || !sessionStart) {
        return false;
      }

      const sessionAge = Date.now() - parseInt(sessionStart);
      if (sessionAge > this.sessionTimeout) {
        this.logout();
        return false;
      }

      this.currentUser = JSON.parse(user);
      return true;
    } catch (error) {
      console.error('Error verificando sesión:', error);
      return false;
    }
  }

  // Obtener usuario actual
  getCurrentUser() {
    if (this.currentUser) {
      return this.currentUser;
    }

    try {
      const user = localStorage.getItem('axyra_user');
      if (user) {
        this.currentUser = JSON.parse(user);
        return this.currentUser;
      }
    } catch (error) {
      console.error('Error obteniendo usuario actual:', error);
    }

    return null;
  }

  // Cerrar sesión
  logout() {
    try {
      this.currentUser = null;
      localStorage.removeItem('axyra_user');
      localStorage.removeItem('axyra_session_start');

      if (this.sessionTimer) {
        clearInterval(this.sessionTimer);
        this.sessionTimer = null;
      }

      console.log('✅ Sesión cerrada');
      return { success: true };
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      return { success: false, error: 'Error al cerrar sesión' };
    }
  }

  // Limpiar todos los datos
  clearAllData() {
    try {
      this.logout();
      localStorage.removeItem('axyra_users');
      localStorage.removeItem('axyra_empleados');
      localStorage.removeItem('axyra_comprobantes');
      localStorage.removeItem('axyra_horas');
      localStorage.removeItem('axyra_areas_trabajo');
      console.log('✅ Todos los datos limpiados');
      return { success: true };
    } catch (error) {
      console.error('Error limpiando datos:', error);
      return { success: false, error: 'Error al limpiar datos' };
    }
  }

  // Obtener usuarios
  getUsers() {
    try {
      const users = localStorage.getItem('axyra_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      return [];
    }
  }

  // Guardar usuarios
  saveUsers(users) {
    try {
      localStorage.setItem('axyra_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error guardando usuarios:', error);
    }
  }

  // Cargar usuario actual desde localStorage
  loadCurrentUser() {
    try {
      const user = localStorage.getItem('axyra_user');
      if (user) {
        this.currentUser = JSON.parse(user);
      }
    } catch (error) {
      console.error('Error cargando usuario actual:', error);
    }
  }

  // Iniciar timer de sesión
  startSessionTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
    }

    this.sessionTimer = setInterval(() => {
      this.checkSessionValidity();
    }, 5 * 60 * 1000); // Verificar cada 5 minutos
  }

  // Verificar validez de sesión
  checkSessionValidity() {
    if (!this.hasActiveSession()) {
      console.log('⏰ Sesión expirada, cerrando...');
      this.logout();
      if (window.location.pathname.includes('dashboard')) {
        window.location.href = '../login.html';
      }
    }
  }

  // Crear datos de prueba
  createTestData() {
    try {
      // Crear áreas de trabajo
      const areas = [
        { id: 1, nombre: 'Administración', userId: 'test' },
        { id: 2, nombre: 'Ventas', userId: 'test' },
        { id: 3, nombre: 'Producción', userId: 'test' },
      ];
      localStorage.setItem('axyra_areas_trabajo', JSON.stringify(areas));

      // Crear empleados de prueba
      const empleados = [
        {
          id: 1,
          nombre: 'Juan Pérez',
          cargo: 'Administrador',
          salario: 0,
          area: 'Administración',
          userId: 'test',
          createdAt: new Date().toISOString(),
        },
        {
          id: 2,
          nombre: 'María García',
          cargo: 'Vendedora',
          salario: 0,
          area: 'Ventas',
          userId: 'test',
          createdAt: new Date().toISOString(),
        },
      ];
      localStorage.setItem('axyra_empleados', JSON.stringify(empleados));

      // Crear facturas de prueba
      const facturas = [
        {
          id: 1,
          numero: 'F001-2024',
          cliente: 'Cliente A',
          monto: 1500000,
          area: 'Ventas',
          fecha: new Date().toISOString(),
          userId: 'test',
        },
      ];
      localStorage.setItem('axyra_comprobantes', JSON.stringify(facturas));

      console.log('✅ Datos de prueba creados');
      return { success: true };
    } catch (error) {
      console.error('Error creando datos de prueba:', error);
      return { success: false, error: 'Error al crear datos de prueba' };
    }
  }

  // Obtener estadísticas del sistema
  getSystemStats() {
    try {
      const users = this.getUsers();
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      const facturas = JSON.parse(localStorage.getItem('axyra_comprobantes') || '[]');
      const areas = JSON.parse(localStorage.getItem('axyra_areas_trabajo') || '[]');

      return {
        totalUsers: users.length,
        totalEmployees: empleados.length,
        totalInvoices: facturas.length,
        totalWorkAreas: areas.length,
      };
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error);
      return {
        totalUsers: 0,
        totalEmployees: 0,
        totalInvoices: 0,
        totalWorkAreas: 0,
      };
    }
  }
}

// Instancia global
const axyraUserSystem = new AXYRAUserSystem();

// Exportar para uso en otros módulos
window.AXYRAUserSystem = AXYRAUserSystem;
window.axyraUserSystem = axyraUserSystem;
