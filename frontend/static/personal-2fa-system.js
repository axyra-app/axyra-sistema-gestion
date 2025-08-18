/**
 * AXYRA Personal 2FA System
 * Sistema de autenticación de dos factores personalizado
 * Versión: 3.0 - Sistema unificado
 */

class AXYRAPersonal2FASystem {
  constructor() {
    this.codeValidity = 5 * 60 * 1000; // 5 minutos para todos
    this.activeCodes = new Map();
    this.failedAttempts = new Map();
    this.maxFailedAttempts = 5;
    this.lockoutDuration = 30 * 60 * 1000; // 30 minutos

    this.init();
  }

  init() {
    this.loadFailedAttempts();
    this.cleanupExpiredCodes();
    console.log('AXYRA Personal 2FA System inicializado - Sistema unificado');
  }

  // Generar código 2FA personal
  generatePersonalCode(username) {
    if (this.isUserLocked(username)) {
      return { success: false, message: 'Usuario bloqueado temporalmente' };
    }

    const code = this.generateRandomCode();
    const expiresAt = Date.now() + this.codeValidity;

    this.activeCodes.set(username, {
      code,
      expiresAt,
      attempts: 0,
    });

    console.log(`Código 2FA generado para ${username}: ${code}`);

    return {
      success: true,
      code,
      validity: Math.floor(this.codeValidity / 60000),
      message: `Código 2FA generado: ${code}`,
    };
  }

  // Verificar código 2FA
  verifyPersonalCode(username, inputCode) {
    if (this.isUserLocked(username)) {
      return { success: false, message: 'Usuario bloqueado temporalmente' };
    }

    const codeData = this.activeCodes.get(username);
    if (!codeData) {
      this.recordFailedAttempt(username);
      return { success: false, message: 'No hay código 2FA activo' };
    }

    if (Date.now() > codeData.expiresAt) {
      this.activeCodes.delete(username);
      this.recordFailedAttempt(username);
      return { success: false, message: 'Código 2FA expirado' };
    }

    if (codeData.code === inputCode) {
      this.activeCodes.delete(username);
      this.removeFailedAttempts(username);
      console.log(`✅ Código 2FA verificado para ${username}`);
      return {
        success: true,
        message: 'Código 2FA verificado correctamente',
      };
    } else {
      codeData.attempts++;
      if (codeData.attempts >= 3) {
        this.activeCodes.delete(username);
      }
      this.recordFailedAttempt(username);
      return { success: false, message: 'Código 2FA incorrecto' };
    }
  }

  // Generar código aleatorio de 6 dígitos
  generateRandomCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Registrar intento fallido
  recordFailedAttempt(username) {
    const attempts = this.failedAttempts.get(username) || 0;
    this.failedAttempts.set(username, attempts + 1);
    this.saveFailedAttempts();

    if (attempts + 1 >= this.maxFailedAttempts) {
      this.lockUser(username);
    }
  }

  // Verificar si usuario está bloqueado
  isUserLocked(username) {
    const lockData = this.failedAttempts.get(username);
    if (!lockData) return false;

    if (lockData.lockedUntil && Date.now() < lockData.lockedUntil) {
      return true;
    }

    // Desbloquear si ya pasó el tiempo
    if (lockData.lockedUntil && Date.now() >= lockData.lockedUntil) {
      this.removeFailedAttempts(username);
      return false;
    }

    return false;
  }

  // Bloquear usuario
  lockUser(username) {
    this.failedAttempts.set(username, {
      attempts: this.maxFailedAttempts,
      lockedUntil: Date.now() + this.lockoutDuration,
    });
    this.saveFailedAttempts();
    console.log(`🚫 Usuario ${username} bloqueado por ${this.lockoutDuration / 60000} minutos`);
  }

  // Remover intentos fallidos
  removeFailedAttempts(username) {
    this.failedAttempts.delete(username);
    this.saveFailedAttempts();
  }

  // Limpiar códigos expirados
  cleanupExpiredCodes() {
    const now = Date.now();
    for (const [username, codeData] of this.activeCodes.entries()) {
      if (now > codeData.expiresAt) {
        this.activeCodes.delete(username);
      }
    }
  }

  // Guardar intentos fallidos en localStorage
  saveFailedAttempts() {
    try {
      localStorage.setItem('axyra_failed_attempts', JSON.stringify(Array.from(this.failedAttempts.entries())));
    } catch (error) {
      console.error('Error al guardar intentos fallidos:', error);
    }
  }

  // Cargar intentos fallidos desde localStorage
  loadFailedAttempts() {
    try {
      const saved = localStorage.getItem('axyra_failed_attempts');
      if (saved) {
        this.failedAttempts = new Map(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error al cargar intentos fallidos:', error);
    }
  }

  // Obtener estadísticas del sistema
  getSystemStats() {
    return {
      activeCodes: this.activeCodes.size,
      failedAttempts: this.failedAttempts.size,
      codeValidity: this.codeValidity / 60000,
    };
  }

  // Resetear usuario
  resetUser(username) {
    this.activeCodes.delete(username);
    this.removeFailedAttempts(username);
    console.log(`🔄 Usuario ${username} reseteado en 2FA`);
  }

  // Resetear sistema completo
  resetSystem() {
    this.activeCodes.clear();
    this.failedAttempts.clear();
    localStorage.removeItem('axyra_failed_attempts');
    console.log('🔄 Sistema 2FA reseteado completamente');
  }
}

// Instancia global
const axyraPersonal2FA = new AXYRAPersonal2FASystem();

// Funciones globales para uso en HTML
window.generatePersonal2FA = () => {
  const username = document.getElementById('username').value;
  if (!username) {
    alert('Por favor ingrese un nombre de usuario');
    return;
  }

  const result = axyraPersonal2FA.generatePersonalCode(username);
  if (result.success) {
    alert(`✅ Código 2FA generado: ${result.code}\nVálido por: ${result.validity} minutos`);
  } else {
    alert(`❌ Error: ${result.message}`);
  }
};

// Exportar para uso en otros módulos
window.AXYRAPersonal2FASystem = AXYRAPersonal2FASystem;
window.axyraPersonal2FA = axyraPersonal2FA;
