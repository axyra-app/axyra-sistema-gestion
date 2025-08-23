// HEADER COMPARTIDO AXYRA - Funcionalidad JavaScript
class AxyraSharedHeader {
  constructor() {
    // Mejorar la detección de página actual
    this.currentPage = this.detectarPaginaActual();
    console.log('📍 Página detectada:', this.currentPage);
    
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
    console.log('🚀 Inicializando header compartido AXYRA...');
    this.generarNavegacion();
    this.actualizarInformacionUsuario();
    this.setupEventListeners();
    console.log('✅ Header compartido AXYRA listo para usar');
  }

  generarNavegacion() {
    const nav = document.getElementById('axyraNav');
    const pageSubtitle = document.getElementById('pageSubtitle');
    
    if (!nav) return;
    
    console.log('🔍 Generando navegación inteligente...');
    console.log('📍 Página actual:', this.currentPage);
    
    // Determinar qué página está activa y ocultar botones innecesarios
    this.navigationItems.forEach(item => {
      let isCurrentPage = false;
      
      // Mapear nombres de página
      if (this.currentPage === 'empleados' && item.text === 'Empleados') {
        isCurrentPage = true;
      } else if (this.currentPage === 'dashboard' && item.text === 'Dashboard') {
        isCurrentPage = true;
      } else if (this.currentPage === 'horas' && item.text === 'Horas') {
        isCurrentPage = true;
      } else if (this.currentPage === 'nomina' && item.text === 'Nómina') {
        isCurrentPage = true;
      } else if (this.currentPage === 'caja' && item.text === 'Caja') {
        isCurrentPage = true;
      } else if (this.currentPage === 'inventario' && item.text === 'Inventario') {
        isCurrentPage = true;
      } else if (this.currentPage === 'configuracion' && item.text === 'Config') {
        isCurrentPage = true;
      } else if (this.currentPage === 'inicio' && item.text === 'Inicio') {
        isCurrentPage = true;
      }
      
      if (isCurrentPage) {
        item.active = true;
        item.show = false; // Ocultar botón de la página actual
        console.log(`🚫 Ocultando botón: ${item.text} (página actual)`);
        
        // Establecer subtítulo de la página
        if (pageSubtitle) {
          pageSubtitle.textContent = item.text;
          console.log(`📝 Subtítulo establecido: ${item.text}`);
        }
      } else {
        item.active = false;
        item.show = true;
        console.log(`✅ Mostrando botón: ${item.text}`);
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
    console.log('📋 Navegación generada:', navHTML);
    console.log(`✅ ${this.navigationItems.filter(item => item.show).length} enlaces de navegación insertados`);
  }

  async actualizarInformacionUsuario() {
    const userEmail = document.getElementById('userEmail');
    const roleBadge = document.getElementById('roleBadge');
    
    if (userEmail) {
      try {
        console.log('👤 Actualizando información del usuario...');
        
        // Obtener usuario actual de Firebase Auth
        const currentUser = firebase.auth().currentUser;
        
        if (currentUser) {
          userEmail.textContent = currentUser.email || 'Usuario';
          
          // Actualizar rol si está disponible
          if (roleBadge) {
            const roleText = roleBadge.querySelector('.axyra-role-badge-text');
            if (roleText) {
              roleText.textContent = 'Empleado'; // Por defecto, se puede personalizar
            }
          }
          
          console.log('✅ Email del usuario actualizado:', currentUser.email);
        } else {
          console.log('⚠️ No hay usuario de Firebase, usando localStorage...');
          // Fallback a localStorage si no hay usuario de Firebase
          let user = localStorage.getItem('axyra_firebase_user');
          if (!user) {
            user = localStorage.getItem('axyra_isolated_user');
          }
          
          if (user) {
            try {
              const userData = JSON.parse(user);
              userEmail.textContent = userData.email || userData.username || 'Usuario';
              
              if (roleBadge) {
                const roleText = roleBadge.querySelector('.axyra-role-badge-text');
                if (roleText) {
                  roleText.textContent = userData.role || 'Empleado';
                }
              }
            } catch (error) {
              console.warn('Error parseando información del usuario:', error);
            }
          }
        }
        
        if (roleBadge) {
          const roleText = roleBadge.querySelector('.axyra-role-badge-text');
          if (roleText) {
            roleText.textContent = 'Empleado';
            console.log('✅ Rol del usuario actualizado: Empleado');
          }
        }
      } catch (error) {
        console.error('Error obteniendo información del usuario:', error);
      }
    }
  }

  setupEventListeners() {
    console.log('🎯 Configurando eventos del header...');
    
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
    
    console.log('✅ Eventos configurados correctamente');
  }

  async handleLogout() {
    console.log('🔄 Cerrando sesión desde header compartido...');
    
    try {
      // Cerrar sesión de Firebase
      if (firebase && firebase.auth) {
        await firebase.auth().signOut();
        console.log('✅ Sesión de Firebase cerrada');
      }
      
      // Limpiar localStorage
      localStorage.removeItem('axyra_isolated_user');
      localStorage.removeItem('axyra_firebase_user');
      sessionStorage.clear();
      
      // Redirigir al login
      window.location.href = '../../login.html';
    } catch (error) {
      console.error('Error cerrando sesión:', error);
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

  // Método para detectar la página actual de manera más robusta
  detectarPaginaActual() {
    // Método más simple y directo
    const url = window.location.href;
    const pathname = window.location.pathname;
    
    console.log('🔍 URL completa:', url);
    console.log('🔍 Pathname:', pathname);
    
    // Detección directa por URL
    if (url.includes('/empleados/') || pathname.includes('/empleados/')) {
      console.log('🎯 Página detectada como: empleados');
      return 'empleados';
    } else if (url.includes('/dashboard/') || pathname.includes('/dashboard/')) {
      console.log('🎯 Página detectada como: dashboard');
      return 'dashboard';
    } else if (url.includes('/horas/') || pathname.includes('/horas/')) {
      console.log('🎯 Página detectada como: horas');
      return 'horas';
    } else if (url.includes('/nomina/') || pathname.includes('/nomina/')) {
      console.log('🎯 Página detectada como: nomina');
      return 'nomina';
    } else if (url.includes('/cuadre_caja/') || pathname.includes('/cuadre_caja/')) {
      console.log('🎯 Página detectada como: caja');
      return 'caja';
    } else if (url.includes('/inventario/') || pathname.includes('/inventario/')) {
      console.log('🎯 Página detectada como: inventario');
      return 'inventario';
    } else if (url.includes('/configuracion/') || pathname.includes('/configuracion/')) {
      console.log('🎯 Página detectada como: configuracion');
      return 'configuracion';
    } else if (url.includes('/index.html') || pathname.includes('/index.html') || url.endsWith('/') || pathname.endsWith('/')) {
      console.log('🎯 Página detectada como: inicio');
      return 'inicio';
    } else {
      console.log('🎯 Página detectada como: desconocida');
      return 'desconocida';
    }
  }
}

// Inicializar header compartido cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Script del header compartido cargado');
  window.axyraSharedHeader = new AxyraSharedHeader();
});
