/* ========================================
   AXYRA ADMIN AUTHENTICATION
   Sistema de Autenticación para Administradores
   ======================================== */

class AxyraAdminAuth {
  constructor() {
    this.adminEmails = [
      'admin@axyra.com',
      'axyra.app@gmail.com',
      'juan@axyra.com' // Agregar tu email personal
    ];
    
    this.adminPassword = 'AxyraAdmin2024!'; // Contraseña temporal
    this.isAuthenticated = false;
    this.currentAdmin = null;
    
    this.init();
  }

  init() {
    console.log('🔐 Inicializando Autenticación de Administradores AXYRA...');
    this.checkExistingAuth();
    this.setupEventListeners();
  }

  setupEventListeners() {
    // Escuchar cambios en la autenticación
    document.addEventListener('adminAuthenticated', (e) => {
      this.isAuthenticated = true;
      this.currentAdmin = e.detail.admin;
      this.redirectToAdmin();
    });

    // Escuchar logout
    document.addEventListener('adminLogout', () => {
      this.isAuthenticated = false;
      this.currentAdmin = null;
      this.redirectToLogin();
    });
  }

  checkExistingAuth() {
    try {
      const adminData = localStorage.getItem('axyra_admin');
      if (adminData) {
        const admin = JSON.parse(adminData);
        if (this.isValidAdmin(admin)) {
          this.isAuthenticated = true;
          this.currentAdmin = admin;
          this.redirectToAdmin();
        } else {
          this.logout();
        }
      }
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      this.logout();
    }
  }

  isValidAdmin(admin) {
    return admin && 
           admin.email && 
           this.adminEmails.includes(admin.email) &&
           admin.expiresAt && 
           new Date(admin.expiresAt) > new Date();
  }

  async authenticate(email, password) {
    try {
      // Verificar credenciales
      if (!this.adminEmails.includes(email)) {
        throw new Error('Email no autorizado');
      }

      if (password !== this.adminPassword) {
        throw new Error('Contraseña incorrecta');
      }

      // Crear sesión de administrador
      const admin = {
        email: email,
        name: this.getAdminName(email),
        role: 'super_admin',
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 horas
      };

      // Guardar en localStorage
      localStorage.setItem('axyra_admin', JSON.stringify(admin));
      
      this.isAuthenticated = true;
      this.currentAdmin = admin;

      // Disparar evento
      document.dispatchEvent(new CustomEvent('adminAuthenticated', {
        detail: { admin }
      }));

      return { success: true, admin };
    } catch (error) {
      console.error('Error en autenticación:', error);
      throw error;
    }
  }

  getAdminName(email) {
    const names = {
      'admin@axyra.com': 'Administrador Principal',
      'axyra.app@gmail.com': 'Juan Fernando',
      'juan@axyra.com': 'Juan Fernando'
    };
    return names[email] || 'Administrador';
  }

  logout() {
    localStorage.removeItem('axyra_admin');
    this.isAuthenticated = false;
    this.currentAdmin = null;
    
    document.dispatchEvent(new CustomEvent('adminLogout'));
  }

  redirectToAdmin() {
    if (window.location.pathname !== '/admin.html') {
      window.location.href = 'admin.html';
    }
  }

  redirectToLogin() {
    if (window.location.pathname !== '/admin-login.html') {
      window.location.href = 'admin-login.html';
    }
  }

  requireAuth() {
    if (!this.isAuthenticated) {
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  getCurrentAdmin() {
    return this.currentAdmin;
  }

  isAdmin(email) {
    return this.adminEmails.includes(email);
  }

  // Método para cambiar contraseña (solo para desarrollo)
  changePassword(newPassword) {
    this.adminPassword = newPassword;
    console.log('Contraseña de administrador actualizada');
  }

  // Método para agregar nuevo administrador
  addAdmin(email, name) {
    if (!this.adminEmails.includes(email)) {
      this.adminEmails.push(email);
      console.log(`Nuevo administrador agregado: ${email}`);
    }
  }

  // Método para remover administrador
  removeAdmin(email) {
    const index = this.adminEmails.indexOf(email);
    if (index > -1) {
      this.adminEmails.splice(index, 1);
      console.log(`Administrador removido: ${email}`);
    }
  }
}

// Inicializar sistema de autenticación de administradores
window.axyraAdminAuth = new AxyraAdminAuth();

// Exportar para uso global
window.AxyraAdminAuth = AxyraAdminAuth;
