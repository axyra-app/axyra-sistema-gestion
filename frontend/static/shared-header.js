// HEADER COMPARTIDO AXYRA - Funcionalidad JavaScript
class AxyraSharedHeader {
  constructor() {
    this.currentPage = window.location.pathname;
    this.navigationItems = [
      { href: '../../index.html', icon: 'fas fa-home', text: 'Inicio', show: true },
      { href: '../dashboard/dashboard.html', icon: 'fas fa-tachometer-alt', text: 'Dashboard', show: true },
      { href: '../empleados/empleados.html', icon: 'fas fa-users', text: 'Empleados', show: true },
      { href: '../horas/gestionar_horas.html', icon: 'fas fa-clock', text: 'Horas', show: true },
      { href: '../nomina/gestionar_nomina.html', icon: 'fas fa-file-invoice-dollar', text: 'Nómina', show: true },
      { href: '../cuadre_caja/cuadre_caja.html', icon: 'fas fa-calculator', text: 'Caja', show: true },
      { href: '../inventario/inventario.html', icon: 'fas fa-boxes', text: 'Inventario', show: true },
      { href: '../configuracion/configuracion.html', icon: 'fas fa-cog', text: 'Config', show: true }
    ];
    
    this.init();
  }

  init() {
    this.generarNavegacion();
    this.actualizarInformacionUsuario();
    this.setupEventListeners();
  }

  generarNavegacion() {
    const nav = document.getElementById('axyraNav');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (!nav) return;
    
    // Determinar qué página está activa y ocultar botones innecesarios
    this.navigationItems.forEach(item => {
      if (this.currentPage.includes(item.href.split('/').pop())) {
        item.active = true;
        item.show = false; // Ocultar botón de la página actual
        
        // Establecer subtítulo de la página
        if (pageSubtitle) {
          pageSubtitle.textContent = item.text;
        }
      } else {
        item.active = false;
        item.show = true;
      }
    });
    
    // Generar HTML de navegación
    let navHTML = '';
    this.navigationItems.forEach(item => {
      if (item.show) {
        navHTML += `
          <a href="${item.href}" class="axyra-nav-link ${item.active ? 'active' : ''}">
            <i class="${item.icon}"></i>
            <span>${item.text}</span>
          </a>
        `;
      }
    });
    
    nav.innerHTML = navHTML;
  }

  actualizarInformacionUsuario() {
    const userEmail = document.getElementById('userEmail');
    const roleBadge = document.getElementById('roleBadge');
    
    if (userEmail) {
      const user = localStorage.getItem('axyra_isolated_user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          userEmail.textContent = userData.email || userData.username || 'Usuario';
          
          // Actualizar rol si está disponible
          if (roleBadge && userData.role) {
            const roleText = roleBadge.querySelector('.axyra-role-badge-text');
            if (roleText) {
              roleText.textContent = userData.role;
            }
          }
        } catch (error) {
          console.warn('Error parseando información del usuario:', error);
        }
      }
    }
  }

  setupEventListeners() {
    // Manejar logout
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-action="logout"]')) {
        this.handleLogout();
      }
    });

    // Actualizar información del usuario cuando cambie localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'axyra_isolated_user') {
        this.actualizarInformacionUsuario();
      }
    });
  }

  handleLogout() {
    console.log('🔄 Cerrando sesión desde header compartido...');
    
    if (window.axyraIsolatedAuth) {
      window.axyraIsolatedAuth.logout();
    } else {
      // Fallback: limpiar localStorage y redirigir
      localStorage.removeItem('axyra_isolated_user');
      localStorage.removeItem('axyra_firebase_user');
      sessionStorage.clear();
      window.location.href = '../../login.html';
    }
  }

  // Método para actualizar el subtítulo de la página
  setPageSubtitle(text) {
    const pageSubtitle = document.getElementById('pageSubtitle');
    if (pageSubtitle) {
      pageSubtitle.textContent = text;
    }
  }

  // Método para actualizar el rol del usuario
  setUserRole(role) {
    const roleBadge = document.getElementById('roleBadge');
    if (roleBadge) {
      const roleText = roleBadge.querySelector('.axyra-role-badge-text');
      if (roleText) {
        roleText.textContent = role;
      }
    }
  }
}

// Inicializar header compartido cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  window.axyraSharedHeader = new AxyraSharedHeader();
});
