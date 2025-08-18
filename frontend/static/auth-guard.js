/**
 * AXYRA Authentication Guard
 * Sistema unificado de verificación de autenticación para todos los módulos
 * Versión: 1.0 - Sistema robusto y consistente
 */

class AXYRAAuthGuard {
  constructor() {
    this.isAuthenticated = false;
    this.currentUser = null;
    this.protectedRoutes = [
      'dashboard',
      'empleados', 
      'horas',
      'nomina',
      'cuadre-caja',
      'configuracion'
    ];
    
    this.init();
  }

  init() {
    console.log('🛡️ AXYRA Auth Guard inicializando...');
    this.checkAuthStatus();
    this.setupAuthListener();
  }

  // Verificar estado de autenticación
  checkAuthStatus() {
    const user = localStorage.getItem('axyra_user');
    const firebaseUser = localStorage.getItem('axyra_firebase_user');
    
    if (user || firebaseUser) {
      try {
        this.currentUser = user ? JSON.parse(user) : JSON.parse(firebaseUser);
        this.isAuthenticated = true;
        console.log('✅ Usuario autenticado:', this.currentUser.email || this.currentUser.username);
        return true;
      } catch (error) {
        console.error('❌ Error parseando datos de usuario:', error);
        this.clearSession();
        return false;
      }
    } else {
      this.isAuthenticated = false;
      this.currentUser = null;
      console.log('🔒 Usuario no autenticado');
      return false;
    }
  }

  // Configurar listener de autenticación
  setupAuthListener() {
    // Verificar cada 30 segundos si la sesión sigue válida
    setInterval(() => {
      this.checkAuthStatus();
    }, 30000);

    // Escuchar cambios en localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'axyra_user' || e.key === 'axyra_firebase_user') {
        this.checkAuthStatus();
      }
    });
  }

  // Verificar si la ruta actual requiere autenticación
  isRouteProtected() {
    const currentPath = window.location.pathname;
    return this.protectedRoutes.some(route => currentPath.includes(route));
  }

  // Verificar acceso a módulo
  checkModuleAccess() {
    if (this.isRouteProtected() && !this.isAuthenticated) {
      console.log('🚫 Acceso denegado a módulo protegido');
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  // Redirigir al login
  redirectToLogin() {
    console.log('🔄 Redirigiendo al login...');
    window.location.href = '/login.html';
  }

  // Limpiar sesión
  clearSession() {
    this.isAuthenticated = false;
    this.currentUser = null;
    localStorage.removeItem('axyra_user');
    localStorage.removeItem('axyra_firebase_user');
    localStorage.removeItem('axyra_empleados');
    localStorage.removeItem('axyra_horas');
    localStorage.removeItem('axyra_nomina');
    console.log('🧹 Sesión limpiada');
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Verificar si está autenticado
  isUserAuthenticated() {
    return this.isAuthenticated;
  }

  // Logout
  logout() {
    this.clearSession();
    this.redirectToLogin();
  }
}

// Instancia global
const axyraAuthGuard = new AXYRAAuthGuard();

// Exportar para uso en otros módulos
window.AXYRAAuthGuard = AXYRAAuthGuard;
window.axyraAuthGuard = axyraAuthGuard;

// Verificar acceso automáticamente en cada página
document.addEventListener('DOMContentLoaded', () => {
  if (axyraAuthGuard.isRouteProtected()) {
    axyraAuthGuard.checkModuleAccess();
  }
});

console.log('🛡️ AXYRA Auth Guard cargado y activo');
