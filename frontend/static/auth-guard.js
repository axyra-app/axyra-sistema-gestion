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
        const userData = user ? JSON.parse(user) : JSON.parse(firebaseUser);
        
        // Verificar si la sesión no ha expirado (24 horas)
        if (userData.lastLogin) {
          const lastLogin = new Date(userData.lastLogin);
          const now = new Date();
          const hoursDiff = (now - lastLogin) / (1000 * 60 * 60);
          
          if (hoursDiff >= 24) {
            console.log('⏰ Sesión expirada por tiempo, limpiando...');
            this.clearSession();
            return false;
          }
        }
        
        this.currentUser = userData;
        this.isAuthenticated = true;
        console.log('✅ Usuario autenticado:', userData.email || userData.username);
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
    // Solo verificar si estamos en una ruta protegida
    if (this.isRouteProtected()) {
      // Verificar si hay sesión activa
      const hasSession = this.checkAuthStatus();
      
      if (!hasSession) {
        console.log('🚫 Acceso denegado a módulo protegido');
        this.redirectToLogin();
        return false;
      }
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
  // Solo verificar en módulos protegidos, no en la página principal
  if (axyraAuthGuard.isRouteProtected() && window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
    console.log('🛡️ Verificando acceso a módulo protegido...');
    axyraAuthGuard.checkModuleAccess();
  }
});

console.log('🛡️ AXYRA Auth Guard cargado y activo');
