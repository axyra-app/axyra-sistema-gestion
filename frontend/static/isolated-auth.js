// ========================================
// SISTEMA DE AUTENTICACIÓN AISLADO AXYRA
// ========================================

// Clase para manejar la autenticación de forma aislada
class AxyraAuth {
  constructor() {
    this.currentUser = null;
    this.isAuthenticated = false;
    this.init();
  }

  // Inicializar el sistema de autenticación
  init() {
    console.log('🔐 Inicializando sistema de autenticación AXYRA...');
    this.checkAuthStatus();
    this.setupEventListeners();
  }

  // Verificar el estado de autenticación
  checkAuthStatus() {
    try {
      // Intentar cargar usuario desde localStorage
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        this.isAuthenticated = true;
        console.log('✅ Usuario autenticado con localStorage:', this.currentUser.username);
        this.updateUI();
      } else {
        // Intentar cargar desde Firebase si está disponible
        if (window.axyraFirebase && window.axyraFirebase.auth) {
          this.checkFirebaseAuth();
        } else {
          console.log('ℹ️ No hay usuario autenticado');
          this.redirectToLogin();
        }
      }
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      this.redirectToLogin();
    }
  }

  // Verificar autenticación de Firebase
  async checkFirebaseAuth() {
    try {
      const auth = window.axyraFirebase.auth;
      const user = auth.currentUser;

      if (user) {
        // Usuario autenticado en Firebase
        const userData = {
          username: user.displayName || user.email || 'Usuario',
          email: user.email,
          uid: user.uid,
          provider: user.providerData[0]?.providerId || 'password',
        };

        this.currentUser = userData;
        this.isAuthenticated = true;

        // Guardar en localStorage
        localStorage.setItem('axyra_isolated_user', JSON.stringify(userData));
        localStorage.setItem('axyra_firebase_user', JSON.stringify(user));

        console.log('✅ Usuario autenticado con Firebase:', userData.username);
        this.updateUI();
      } else {
        console.log('ℹ️ No hay usuario autenticado en Firebase');
        this.redirectToLogin();
      }
    } catch (error) {
      console.error('❌ Error verificando Firebase auth:', error);
      this.redirectToLogin();
    }
  }

  // Actualizar la interfaz de usuario
  updateUI() {
    if (!this.isAuthenticated || !this.currentUser) return;

    // Actualizar nombre de usuario en el dashboard
    const usernameElements = document.querySelectorAll('[data-username]');
    usernameElements.forEach((element) => {
      element.textContent = this.currentUser.username;
    });

    // Actualizar campos de entrada si existen
    const usernameInput = document.getElementById('usernameInput');
    if (usernameInput) {
      usernameInput.value = this.currentUser.username;
    }

    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
      emailInput.value = this.currentUser.email || '';
    }

    // Mostrar/ocultar elementos según autenticación
    const authElements = document.querySelectorAll('[data-auth]');
    authElements.forEach((element) => {
      const authType = element.getAttribute('data-auth');
      if (authType === 'authenticated') {
        element.style.display = this.isAuthenticated ? 'block' : 'none';
      } else if (authType === 'unauthenticated') {
        element.style.display = this.isAuthenticated ? 'none' : 'block';
      }
    });
  }

  // Configurar event listeners
  setupEventListeners() {
    // Botón de actualizar username
    const updateUsernameBtn = document.querySelector('[onclick*="actualizarUsername"]');
    if (updateUsernameBtn) {
      updateUsernameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.updateUsername();
      });
    }

    // Botón de verificar email
    const verifyEmailBtn = document.querySelector('[onclick*="enviarVerificacionEmail"]');
    if (verifyEmailBtn) {
      verifyEmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.verifyEmail();
      });
    }

    // Botón de cambiar contraseña
    const changePasswordBtn = document.querySelector('[onclick*="cambiarContraseña"]');
    if (changePasswordBtn) {
      changePasswordBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.changePassword();
      });
    }

    // Botón de cerrar sesión
    const logoutBtn = document.querySelector('[onclick*="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.logout();
      });
    }
  }

  // Actualizar nombre de usuario
  async updateUsername() {
    try {
      const usernameInput = document.getElementById('usernameInput');
      if (!usernameInput) {
        console.error('❌ Campo usernameInput no encontrado');
        this.showNotification('Error: Campo de nombre de usuario no encontrado', 'error');
        return;
      }

      const newUsername = usernameInput.value.trim();
      if (!newUsername) {
        this.showNotification('Por favor ingresa un nombre de usuario válido', 'error');
        return;
      }

      // Actualizar en localStorage
      this.currentUser.username = newUsername;
      localStorage.setItem('axyra_isolated_user', JSON.stringify(this.currentUser));

      // Actualizar en Firebase si está disponible
      if (window.axyraFirebase && window.axyraFirebase.auth) {
        const user = window.axyraFirebase.auth.currentUser;
        if (user) {
          await user.updateProfile({
            displayName: newUsername,
          });
        }
      }

      this.updateUI();
      this.showNotification('Nombre de usuario actualizado correctamente', 'success');
      console.log('✅ Usuario actualizado:', this.currentUser);
    } catch (error) {
      console.error('❌ Error actualizando username:', error);
      this.showNotification('Error actualizando nombre de usuario: ' + error.message, 'error');
    }
  }

  // Verificar email
  async verifyEmail() {
    try {
      if (!window.axyraFirebase || !window.axyraFirebase.auth) {
        this.showNotification('Sistema de verificación de email no disponible', 'warning');
        return;
      }

      const user = window.axyraFirebase.auth.currentUser;
      if (!user) {
        this.showNotification('No hay usuario autenticado', 'error');
        return;
      }

      if (user.emailVerified) {
        this.showNotification('El email ya está verificado', 'info');
        return;
      }

      await user.sendEmailVerification();
      this.showNotification('Email de verificación enviado. Revisa tu bandeja de entrada.', 'success');
      console.log('✅ Email de verificación enviado');
    } catch (error) {
      console.error('❌ Error verificando email:', error);
      this.showNotification('Error enviando verificación de email: ' + error.message, 'error');
    }
  }

  // Cambiar contraseña
  async changePassword() {
    try {
      if (!window.axyraFirebase || !window.axyraFirebase.auth) {
        this.showNotification('Sistema de cambio de contraseña no disponible', 'warning');
        return;
      }

      // Solicitar nueva contraseña
      const newPassword = prompt('Ingresa tu nueva contraseña (mínimo 6 caracteres):');
      if (!newPassword || newPassword.length < 6) {
        this.showNotification('La contraseña debe tener al menos 6 caracteres', 'error');
        return;
      }

      const user = window.axyraFirebase.auth.currentUser;
      if (!user) {
        this.showNotification('No hay usuario autenticado', 'error');
        return;
      }

      await user.updatePassword(newPassword);
      this.showNotification('Contraseña actualizada correctamente', 'success');
      console.log('✅ Contraseña actualizada');
    } catch (error) {
      console.error('❌ Error cambiando contraseña:', error);
      this.showNotification('Error cambiando contraseña: ' + error.message, 'error');
    }
  }

  // Cerrar sesión
  logout() {
    try {
      // Limpiar localStorage
      localStorage.removeItem('axyra_isolated_user');
      localStorage.removeItem('axyra_firebase_user');

      // Cerrar sesión en Firebase si está disponible
      if (window.axyraFirebase && window.axyraFirebase.auth) {
        window.axyraFirebase.auth.signOut();
      }

      this.currentUser = null;
      this.isAuthenticated = false;

      console.log('✅ Sesión cerrada correctamente');
      this.redirectToLogin();
    } catch (error) {
      console.error('❌ Error en logout:', error);
      this.redirectToLogin();
    }
  }

  // Redirigir al login
  redirectToLogin() {
    const currentPath = window.location.pathname;
    if (!currentPath.includes('login.html') && !currentPath.includes('register.html')) {
      window.location.href = '../../login.html';
    }
  }

  // Mostrar notificación
  showNotification(message, type = 'info', duration = 5000) {
    // Buscar contenedor de notificaciones
    let container = document.getElementById('notificationContainer');
    if (!container) {
      // Crear contenedor si no existe
      container = document.createElement('div');
      container.id = 'notificationContainer';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    notification.style.cssText = `
      background: ${this.getNotificationColor(type)};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
      </div>
    `;

    container.appendChild(notification);

    // Auto-remover después del tiempo especificado
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, duration);
  }

  // Obtener color de notificación según tipo
  getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return colors[type] || colors.info;
  }
}

// Inicializar sistema de autenticación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAuth = new AxyraAuth();
});

// Agregar estilos CSS para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(notificationStyles);

// Exportar para uso global
window.AxyraAuth = AxyraAuth;
