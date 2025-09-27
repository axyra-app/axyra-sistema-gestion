/**
 * AXYRA - Sistema de Autenticación
 * Inicio de sesión con códigos y gestión de usuarios
 */

class AxyraAuthSystem {
  constructor() {
    this.currentUser = null;
    this.loginCodes = new Map(); // Almacenar códigos temporales
    this.resetTokens = new Map(); // Almacenar tokens de reinicio
    this.init();
  }

  init() {
    this.loadUserFromStorage();
    this.setupEventListeners();
    console.log('✅ Sistema de autenticación AXYRA inicializado');
  }

  setupEventListeners() {
    // Eventos para formularios de login
    document.addEventListener('DOMContentLoaded', () => {
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
      }

      const codeForm = document.getElementById('codeForm');
      if (codeForm) {
        codeForm.addEventListener('submit', (e) => this.handleCodeVerification(e));
      }

      const resetForm = document.getElementById('resetForm');
      if (resetForm) {
        resetForm.addEventListener('submit', (e) => this.handlePasswordReset(e));
      }
    });
  }

  // ========================================
  // INICIO DE SESIÓN CON CÓDIGO
  // ========================================
  async handleLogin(event) {
    event.preventDefault();
    
    try {
      const email = document.getElementById('email').value;
      
      if (!this.isValidEmail(email)) {
        this.showNotification('Por favor ingresa un email válido', 'error');
        return;
      }

      // Generar código de 6 dígitos
      const loginCode = this.generateLoginCode();
      
      // Guardar código temporalmente (expira en 10 minutos)
      this.loginCodes.set(email, {
        code: loginCode,
        timestamp: Date.now(),
        expires: Date.now() + (10 * 60 * 1000) // 10 minutos
      });

      // Buscar usuario por email
      const userData = await this.findUserByEmail(email);
      
      if (!userData) {
        this.showNotification('Usuario no encontrado', 'error');
        return;
      }

      // Enviar código por email
      if (window.axyraEmailService) {
        const result = await window.axyraEmailService.sendLoginCodeEmail(userData, loginCode);
        
        if (result.success) {
          this.showCodeForm(email);
          this.showNotification('Código enviado a tu email', 'success');
        } else {
          this.showNotification('Error enviando código', 'error');
        }
      } else {
        // Fallback: mostrar código en consola para desarrollo
        console.log(`🔐 Código de inicio para ${email}: ${loginCode}`);
        this.showCodeForm(email);
        this.showNotification('Código generado (ver consola)', 'info');
      }

    } catch (error) {
      console.error('❌ Error en inicio de sesión:', error);
      this.showNotification('Error en el inicio de sesión', 'error');
    }
  }

  // ========================================
  // VERIFICACIÓN DE CÓDIGO
  // ========================================
  async handleCodeVerification(event) {
    event.preventDefault();
    
    try {
      const email = document.getElementById('userEmail').value;
      const code = document.getElementById('loginCode').value;
      
      const storedCode = this.loginCodes.get(email);
      
      if (!storedCode) {
        this.showNotification('Código no encontrado o expirado', 'error');
        return;
      }

      if (Date.now() > storedCode.expires) {
        this.loginCodes.delete(email);
        this.showNotification('Código expirado', 'error');
        return;
      }

      if (code !== storedCode.code) {
        this.showNotification('Código incorrecto', 'error');
        return;
      }

      // Código válido - iniciar sesión
      const userData = await this.findUserByEmail(email);
      if (userData) {
        this.loginUser(userData);
        this.loginCodes.delete(email);
        this.showNotification('Inicio de sesión exitoso', 'success');
        
        // Redirigir al dashboard
        setTimeout(() => {
          window.location.href = '/index.html';
        }, 1000);
      }

    } catch (error) {
      console.error('❌ Error verificando código:', error);
      this.showNotification('Error verificando código', 'error');
    }
  }

  // ========================================
  // REINICIO DE CONTRASEÑA
  // ========================================
  async handlePasswordReset(event) {
    event.preventDefault();
    
    try {
      const email = document.getElementById('resetEmail').value;
      
      if (!this.isValidEmail(email)) {
        this.showNotification('Por favor ingresa un email válido', 'error');
        return;
      }

      const userData = await this.findUserByEmail(email);
      if (!userData) {
        this.showNotification('Usuario no encontrado', 'error');
        return;
      }

      // Generar token de reinicio
      const resetToken = this.generateResetToken();
      
      // Guardar token temporalmente (expira en 1 hora)
      this.resetTokens.set(resetToken, {
        email: email,
        timestamp: Date.now(),
        expires: Date.now() + (60 * 60 * 1000) // 1 hora
      });

      // Enviar email de reinicio
      if (window.axyraEmailService) {
        const result = await window.axyraEmailService.sendPasswordResetEmail(userData, resetToken);
        
        if (result.success) {
          this.showNotification('Instrucciones enviadas a tu email', 'success');
        } else {
          this.showNotification('Error enviando instrucciones', 'error');
        }
      } else {
        // Fallback para desarrollo
        console.log(`🔑 Token de reinicio para ${email}: ${resetToken}`);
        this.showNotification('Token generado (ver consola)', 'info');
      }

    } catch (error) {
      console.error('❌ Error en reinicio de contraseña:', error);
      this.showNotification('Error en el reinicio de contraseña', 'error');
    }
  }

  // ========================================
  // GESTIÓN DE USUARIOS
  // ========================================
  async findUserByEmail(email) {
    try {
      // Buscar en localStorage primero
      const users = JSON.parse(localStorage.getItem('axyra_users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (user) {
        return user;
      }

      // Si no se encuentra, crear usuario básico
      const newUser = {
        id: Date.now().toString(),
        email: email,
        nombre: email.split('@')[0],
        rol: 'empleado',
        fechaRegistro: new Date().toISOString(),
        activo: true
      };

      users.push(newUser);
      localStorage.setItem('axyra_users', JSON.stringify(users));

      // Enviar correo de bienvenida
      if (window.axyraEmailService) {
        await window.axyraEmailService.sendWelcomeEmail(newUser);
      }

      return newUser;
    } catch (error) {
      console.error('❌ Error buscando usuario:', error);
      return null;
    }
  }

  loginUser(userData) {
    this.currentUser = userData;
    localStorage.setItem('axyra_current_user', JSON.stringify(userData));
    
    // Actualizar header si existe
    if (window.axyraHeader) {
      window.axyraHeader.updateUserInfo(userData);
    }
  }

  logout() {
    this.currentUser = null;
    localStorage.removeItem('axyra_current_user');
    
    // Redirigir al login
    window.location.href = '/login-optimized.html';
  }

  loadUserFromStorage() {
    try {
      const storedUser = localStorage.getItem('axyra_current_user');
      if (storedUser) {
        this.currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
    }
  }

  // ========================================
  // INTERFAZ DE USUARIO
  // ========================================
  showCodeForm(email) {
    const loginForm = document.getElementById('loginForm');
    const codeForm = document.getElementById('codeForm');
    
    if (loginForm) loginForm.style.display = 'none';
    if (codeForm) {
      codeForm.style.display = 'block';
      document.getElementById('userEmail').value = email;
    }
  }

  showLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const codeForm = document.getElementById('codeForm');
    
    if (loginForm) loginForm.style.display = 'block';
    if (codeForm) codeForm.style.display = 'none';
  }

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================
  generateLoginCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showNotification(message, type = 'info') {
    if (window.axyraErrorHandler) {
      window.axyraErrorHandler.showNotification('Autenticación', message, type);
    } else {
      alert(`${type.toUpperCase()}: ${message}`);
    }
  }

  // ========================================
  // VERIFICACIÓN DE TOKEN DE REINICIO
  // ========================================
  verifyResetToken(token) {
    const tokenData = this.resetTokens.get(token);
    
    if (!tokenData) {
      return { valid: false, message: 'Token no encontrado' };
    }

    if (Date.now() > tokenData.expires) {
      this.resetTokens.delete(token);
      return { valid: false, message: 'Token expirado' };
    }

    return { valid: true, email: tokenData.email };
  }

  // ========================================
  // ACTUALIZAR CONTRASEÑA
  // ========================================
  async updatePassword(token, newPassword) {
    try {
      const tokenData = this.verifyResetToken(token);
      
      if (!tokenData.valid) {
        return { success: false, message: tokenData.message };
      }

      // Actualizar contraseña del usuario
      const users = JSON.parse(localStorage.getItem('axyra_users') || '[]');
      const userIndex = users.findIndex(u => u.email === tokenData.email);
      
      if (userIndex !== -1) {
        users[userIndex].password = newPassword; // En producción, hashear la contraseña
        localStorage.setItem('axyra_users', JSON.stringify(users));
        
        // Eliminar token usado
        this.resetTokens.delete(token);
        
        return { success: true, message: 'Contraseña actualizada correctamente' };
      }

      return { success: false, message: 'Usuario no encontrado' };
    } catch (error) {
      console.error('❌ Error actualizando contraseña:', error);
      return { success: false, message: 'Error actualizando contraseña' };
    }
  }
}

// Inicializar sistema de autenticación
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAuth = new AxyraAuthSystem();
  console.log('✅ Sistema de autenticación AXYRA cargado');
});

// Exportar para uso global
window.AxyraAuthSystem = AxyraAuthSystem;
