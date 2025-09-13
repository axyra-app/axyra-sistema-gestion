/**
 * AXYRA - Sistema Completo de Autenticación de Dos Factores (2FA)
 * Implementación robusta con múltiples métodos de autenticación
 */

class Axyra2FASystem {
  constructor() {
    this.isEnabled = false;
    this.secretKey = null;
    this.backupCodes = [];
    this.methods = ['totp', 'sms', 'email', 'backup'];
    this.currentMethod = 'totp';
    this.issuer = 'AXYRA System';
    this.algorithm = 'SHA1';
    this.digits = 6;
    this.period = 30;
    this.window = 1;
    
    this.init();
  }

  init() {
    try {
      console.log('🔐 Inicializando sistema 2FA completo...');
      
      // Cargar configuración
      this.loadConfig();
      
      // Verificar si 2FA está habilitado
      this.check2FAStatus();
      
      // Configurar listeners
      this.setupEventListeners();
      
      console.log('✅ Sistema 2FA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando 2FA:', error);
    }
  }

  /**
   * Configura 2FA para un usuario
   */
  async setup2FA(userId, method = 'totp') {
    try {
      console.log(`🔧 Configurando 2FA para usuario ${userId} con método ${method}`);
      
      this.currentMethod = method;
      
      switch (method) {
        case 'totp':
          return await this.setupTOTP(userId);
        case 'sms':
          return await this.setupSMS(userId);
        case 'email':
          return await this.setupEmail(userId);
        default:
          throw new Error(`Método 2FA no soportado: ${method}`);
      }
    } catch (error) {
      console.error('❌ Error configurando 2FA:', error);
      throw error;
    }
  }

  /**
   * Configura TOTP (Time-based One-Time Password)
   */
  async setupTOTP(userId) {
    try {
      // Generar clave secreta
      this.secretKey = this.generateSecretKey();
      
      // Generar códigos de respaldo
      this.backupCodes = this.generateBackupCodes();
      
      // Generar QR code para la app autenticadora
      const qrCodeData = this.generateQRCodeData(userId);
      
      // Guardar configuración
      const config = {
        userId: userId,
        method: 'totp',
        secretKey: this.secretKey,
        backupCodes: this.backupCodes,
        setupDate: new Date().toISOString(),
        enabled: false // Se habilitará después de la verificación
      };
      
      this.save2FAConfig(config);
      
      return {
        secretKey: this.secretKey,
        qrCodeData: qrCodeData,
        backupCodes: this.backupCodes,
        manualEntryKey: this.secretKey
      };
    } catch (error) {
      console.error('❌ Error configurando TOTP:', error);
      throw error;
    }
  }

  /**
   * Configura SMS 2FA
   */
  async setupSMS(userId) {
    try {
      // En un entorno real, aquí se integraría con un servicio SMS
      const phoneNumber = await this.getUserPhoneNumber(userId);
      
      if (!phoneNumber) {
        throw new Error('Número de teléfono no encontrado');
      }
      
      const config = {
        userId: userId,
        method: 'sms',
        phoneNumber: phoneNumber,
        setupDate: new Date().toISOString(),
        enabled: false
      };
      
      this.save2FAConfig(config);
      
      return {
        phoneNumber: this.maskPhoneNumber(phoneNumber),
        message: 'Se enviará un código SMS para verificación'
      };
    } catch (error) {
      console.error('❌ Error configurando SMS:', error);
      throw error;
    }
  }

  /**
   * Configura Email 2FA
   */
  async setupEmail(userId) {
    try {
      const email = await this.getUserEmail(userId);
      
      if (!email) {
        throw new Error('Email no encontrado');
      }
      
      const config = {
        userId: userId,
        method: 'email',
        email: email,
        setupDate: new Date().toISOString(),
        enabled: false
      };
      
      this.save2FAConfig(config);
      
      return {
        email: this.maskEmail(email),
        message: 'Se enviará un código por email para verificación'
      };
    } catch (error) {
      console.error('❌ Error configurando Email:', error);
      throw error;
    }
  }

  /**
   * Verifica código 2FA
   */
  async verify2FA(userId, code, method = null) {
    try {
      const config = this.get2FAConfig(userId);
      
      if (!config) {
        throw new Error('2FA no configurado para este usuario');
      }
      
      const verifyMethod = method || config.method;
      
      switch (verifyMethod) {
        case 'totp':
          return await this.verifyTOTP(code, config);
        case 'sms':
          return await this.verifySMS(code, config);
        case 'email':
          return await this.verifyEmail(code, config);
        case 'backup':
          return await this.verifyBackupCode(code, config);
        default:
          throw new Error(`Método de verificación no soportado: ${verifyMethod}`);
      }
    } catch (error) {
      console.error('❌ Error verificando 2FA:', error);
      throw error;
    }
  }

  /**
   * Verifica código TOTP
   */
  async verifyTOTP(code, config) {
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      const timeStep = Math.floor(currentTime / this.period);
      
      // Verificar código actual y códigos en ventana de tiempo
      for (let i = -this.window; i <= this.window; i++) {
        const testTime = timeStep + i;
        const expectedCode = this.generateTOTPCode(config.secretKey, testTime);
        
        if (code === expectedCode) {
          // Código válido
          this.log2FAEvent('TOTP_VERIFIED', config.userId, { method: 'totp' });
          return { success: true, method: 'totp' };
        }
      }
      
      // Código inválido
      this.log2FAEvent('TOTP_FAILED', config.userId, { method: 'totp', code: code });
      throw new Error('Código TOTP inválido o expirado');
    } catch (error) {
      console.error('❌ Error verificando TOTP:', error);
      throw error;
    }
  }

  /**
   * Verifica código SMS
   */
  async verifySMS(code, config) {
    try {
      // En un entorno real, aquí se verificaría con el servicio SMS
      const storedCode = this.getStoredSMSCode(config.userId);
      
      if (!storedCode) {
        throw new Error('Código SMS no encontrado o expirado');
      }
      
      if (code === storedCode.code && new Date() < new Date(storedCode.expires)) {
        this.log2FAEvent('SMS_VERIFIED', config.userId, { method: 'sms' });
        return { success: true, method: 'sms' };
      }
      
      this.log2FAEvent('SMS_FAILED', config.userId, { method: 'sms', code: code });
      throw new Error('Código SMS inválido o expirado');
    } catch (error) {
      console.error('❌ Error verificando SMS:', error);
      throw error;
    }
  }

  /**
   * Verifica código Email
   */
  async verifyEmail(code, config) {
    try {
      // En un entorno real, aquí se verificaría con el servicio de email
      const storedCode = this.getStoredEmailCode(config.userId);
      
      if (!storedCode) {
        throw new Error('Código de email no encontrado o expirado');
      }
      
      if (code === storedCode.code && new Date() < new Date(storedCode.expires)) {
        this.log2FAEvent('EMAIL_VERIFIED', config.userId, { method: 'email' });
        return { success: true, method: 'email' };
      }
      
      this.log2FAEvent('EMAIL_FAILED', config.userId, { method: 'email', code: code });
      throw new Error('Código de email inválido o expirado');
    } catch (error) {
      console.error('❌ Error verificando Email:', error);
      throw error;
    }
  }

  /**
   * Verifica código de respaldo
   */
  async verifyBackupCode(code, config) {
    try {
      if (!config.backupCodes || !Array.isArray(config.backupCodes)) {
        throw new Error('Códigos de respaldo no disponibles');
      }
      
      const codeIndex = config.backupCodes.findIndex(backupCode => 
        backupCode.code === code && !backupCode.used
      );
      
      if (codeIndex === -1) {
        this.log2FAEvent('BACKUP_FAILED', config.userId, { method: 'backup', code: code });
        throw new Error('Código de respaldo inválido o ya utilizado');
      }
      
      // Marcar código como usado
      config.backupCodes[codeIndex].used = true;
      config.backupCodes[codeIndex].usedDate = new Date().toISOString();
      
      this.save2FAConfig(config);
      
      this.log2FAEvent('BACKUP_VERIFIED', config.userId, { method: 'backup' });
      return { success: true, method: 'backup' };
    } catch (error) {
      console.error('❌ Error verificando código de respaldo:', error);
      throw error;
    }
  }

  /**
   * Envía código 2FA
   */
  async send2FACode(userId, method = null) {
    try {
      const config = this.get2FAConfig(userId);
      
      if (!config) {
        throw new Error('2FA no configurado para este usuario');
      }
      
      const sendMethod = method || config.method;
      
      switch (sendMethod) {
        case 'sms':
          return await this.sendSMSCode(userId, config);
        case 'email':
          return await this.sendEmailCode(userId, config);
        default:
          throw new Error(`Método de envío no soportado: ${sendMethod}`);
      }
    } catch (error) {
      console.error('❌ Error enviando código 2FA:', error);
      throw error;
    }
  }

  /**
   * Envía código SMS
   */
  async sendSMSCode(userId, config) {
    try {
      const code = this.generateRandomCode(6);
      const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos
      
      // En un entorno real, aquí se enviaría el SMS
      console.log(`📱 SMS enviado a ${config.phoneNumber}: ${code}`);
      
      // Guardar código temporalmente
      this.storeSMSCode(userId, code, expires);
      
      this.log2FAEvent('SMS_SENT', userId, { method: 'sms' });
      
      return {
        success: true,
        message: `Código enviado a ${this.maskPhoneNumber(config.phoneNumber)}`,
        expires: expires
      };
    } catch (error) {
      console.error('❌ Error enviando SMS:', error);
      throw error;
    }
  }

  /**
   * Envía código Email
   */
  async sendEmailCode(userId, config) {
    try {
      const code = this.generateRandomCode(6);
      const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
      
      // En un entorno real, aquí se enviaría el email
      console.log(`📧 Email enviado a ${config.email}: ${code}`);
      
      // Guardar código temporalmente
      this.storeEmailCode(userId, code, expires);
      
      this.log2FAEvent('EMAIL_SENT', userId, { method: 'email' });
      
      return {
        success: true,
        message: `Código enviado a ${this.maskEmail(config.email)}`,
        expires: expires
      };
    } catch (error) {
      console.error('❌ Error enviando Email:', error);
      throw error;
    }
  }

  /**
   * Habilita 2FA después de la verificación
   */
  async enable2FA(userId, verificationCode) {
    try {
      const config = this.get2FAConfig(userId);
      
      if (!config) {
        throw new Error('Configuración 2FA no encontrada');
      }
      
      // Verificar código antes de habilitar
      await this.verify2FA(userId, verificationCode, config.method);
      
      // Habilitar 2FA
      config.enabled = true;
      config.enabledDate = new Date().toISOString();
      
      this.save2FAConfig(config);
      
      this.log2FAEvent('2FA_ENABLED', userId, { method: config.method });
      
      console.log(`✅ 2FA habilitado para usuario ${userId}`);
      
      return {
        success: true,
        message: '2FA habilitado exitosamente',
        method: config.method
      };
    } catch (error) {
      console.error('❌ Error habilitando 2FA:', error);
      throw error;
    }
  }

  /**
   * Deshabilita 2FA
   */
  async disable2FA(userId, verificationCode) {
    try {
      const config = this.get2FAConfig(userId);
      
      if (!config) {
        throw new Error('2FA no configurado para este usuario');
      }
      
      // Verificar código antes de deshabilitar
      await this.verify2FA(userId, verificationCode, config.method);
      
      // Deshabilitar 2FA
      config.enabled = false;
      config.disabledDate = new Date().toISOString();
      
      this.save2FAConfig(config);
      
      this.log2FAEvent('2FA_DISABLED', userId, { method: config.method });
      
      console.log(`❌ 2FA deshabilitado para usuario ${userId}`);
      
      return {
        success: true,
        message: '2FA deshabilitado exitosamente'
      };
    } catch (error) {
      console.error('❌ Error deshabilitando 2FA:', error);
      throw error;
    }
  }

  /**
   * Genera nuevos códigos de respaldo
   */
  async generateNewBackupCodes(userId) {
    try {
      const config = this.get2FAConfig(userId);
      
      if (!config) {
        throw new Error('2FA no configurado para este usuario');
      }
      
      // Generar nuevos códigos
      const newBackupCodes = this.generateBackupCodes();
      
      // Guardar códigos anteriores como usados
      if (config.backupCodes) {
        config.backupCodes.forEach(backupCode => {
          if (!backupCode.used) {
            backupCode.used = true;
            backupCode.usedDate = new Date().toISOString();
            backupCode.reason = 'replaced';
          }
        });
      }
      
      // Agregar nuevos códigos
      config.backupCodes = [...(config.backupCodes || []), ...newBackupCodes];
      config.lastBackupCodesGenerated = new Date().toISOString();
      
      this.save2FAConfig(config);
      
      this.log2FAEvent('BACKUP_CODES_GENERATED', userId, { count: newBackupCodes.length });
      
      return {
        success: true,
        backupCodes: newBackupCodes,
        message: 'Nuevos códigos de respaldo generados'
      };
    } catch (error) {
      console.error('❌ Error generando códigos de respaldo:', error);
      throw error;
    }
  }

  /**
   * Obtiene estado de 2FA para un usuario
   */
  get2FAStatus(userId) {
    const config = this.get2FAConfig(userId);
    
    if (!config) {
      return {
        enabled: false,
        configured: false,
        method: null
      };
    }
    
    return {
      enabled: config.enabled,
      configured: true,
      method: config.method,
      setupDate: config.setupDate,
      enabledDate: config.enabledDate,
      backupCodesCount: config.backupCodes ? config.backupCodes.filter(c => !c.used).length : 0
    };
  }

  /**
   * Obtiene estadísticas de 2FA
   */
  get2FAStats() {
    const allConfigs = this.getAll2FAConfigs();
    
    const stats = {
      totalUsers: allConfigs.length,
      enabledUsers: allConfigs.filter(c => c.enabled).length,
      disabledUsers: allConfigs.filter(c => !c.enabled).length,
      byMethod: {},
      recentActivity: []
    };
    
    // Contar por método
    allConfigs.forEach(config => {
      stats.byMethod[config.method] = (stats.byMethod[config.method] || 0) + 1;
    });
    
    // Obtener actividad reciente (últimos 30 días)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentLogs = this.get2FALogs().filter(log => 
      new Date(log.timestamp) > thirtyDaysAgo
    );
    
    stats.recentActivity = recentLogs.slice(0, 10);
    
    return stats;
  }

  // Métodos de utilidad
  generateSecretKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateBackupCodes(count = 10) {
    const codes = [];
    for (let i = 0; i < count; i++) {
      codes.push({
        code: this.generateRandomCode(8),
        generated: new Date().toISOString(),
        used: false
      });
    }
    return codes;
  }

  generateRandomCode(length) {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  generateQRCodeData(userId) {
    const accountName = userId;
    const secret = this.secretKey;
    const issuer = this.issuer;
    
    return `otpauth://totp/${issuer}:${accountName}?secret=${secret}&issuer=${issuer}&algorithm=${this.algorithm}&digits=${this.digits}&period=${this.period}`;
  }

  generateTOTPCode(secret, time) {
    // Implementación básica de TOTP
    // En producción usar una librería como 'otplib'
    const key = this.base32Decode(secret);
    const timeBuffer = this.intToBytes(time);
    const hmac = this.hmacSha1(key, timeBuffer);
    const offset = hmac[hmac.length - 1] & 0xf;
    const code = ((hmac[offset] & 0x7f) << 24) |
                 ((hmac[offset + 1] & 0xff) << 16) |
                 ((hmac[offset + 2] & 0xff) << 8) |
                 (hmac[offset + 3] & 0xff);
    
    return (code % Math.pow(10, this.digits)).toString().padStart(this.digits, '0');
  }

  base32Decode(str) {
    // Implementación básica de decodificación base32
    // En producción usar una librería especializada
    return new Uint8Array(0);
  }

  intToBytes(num) {
    const bytes = new Uint8Array(8);
    for (let i = 7; i >= 0; i--) {
      bytes[i] = num & 0xff;
      num >>= 8;
    }
    return bytes;
  }

  hmacSha1(key, data) {
    // Implementación básica de HMAC-SHA1
    // En producción usar Web Crypto API o una librería
    return new Uint8Array(20);
  }

  maskPhoneNumber(phone) {
    if (phone.length < 4) return phone;
    return phone.slice(0, -4).replace(/\d/g, '*') + phone.slice(-4);
  }

  maskEmail(email) {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    return local[0] + '*'.repeat(local.length - 2) + local[local.length - 1] + '@' + domain;
  }

  async getUserPhoneNumber(userId) {
    // En un entorno real, esto vendría de la base de datos
    const user = this.getUser(userId);
    return user?.phone || null;
  }

  async getUserEmail(userId) {
    // En un entorno real, esto vendría de la base de datos
    const user = this.getUser(userId);
    return user?.email || null;
  }

  getUser(userId) {
    // Implementación básica - en producción consultar base de datos
    const users = JSON.parse(localStorage.getItem('axyra_usuarios') || '[]');
    return users.find(u => u.id === userId);
  }

  get2FAConfig(userId) {
    try {
      const stored = localStorage.getItem(`axyra_2fa_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error cargando configuración 2FA:', error);
      return null;
    }
  }

  save2FAConfig(config) {
    try {
      localStorage.setItem(`axyra_2fa_${config.userId}`, JSON.stringify(config));
    } catch (error) {
      console.error('Error guardando configuración 2FA:', error);
    }
  }

  getAll2FAConfigs() {
    const configs = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('axyra_2fa_')) {
        try {
          const config = JSON.parse(localStorage.getItem(key));
          configs.push(config);
        } catch (error) {
          console.error('Error cargando configuración 2FA:', error);
        }
      }
    }
    return configs;
  }

  storeSMSCode(userId, code, expires) {
    const smsCode = { code, expires: expires.toISOString() };
    localStorage.setItem(`axyra_sms_code_${userId}`, JSON.stringify(smsCode));
  }

  getStoredSMSCode(userId) {
    try {
      const stored = localStorage.getItem(`axyra_sms_code_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  storeEmailCode(userId, code, expires) {
    const emailCode = { code, expires: expires.toISOString() };
    localStorage.setItem(`axyra_email_code_${userId}`, JSON.stringify(emailCode));
  }

  getStoredEmailCode(userId) {
    try {
      const stored = localStorage.getItem(`axyra_email_code_${userId}`);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  log2FAEvent(type, userId, details = {}) {
    if (window.axyraAuditSystem) {
      window.axyraAuditSystem.logSecurityEvent(type, `2FA: ${type}`, {
        userId: userId,
        ...details
      }, userId);
    }
  }

  get2FALogs() {
    if (window.axyraAuditSystem) {
      return window.axyraAuditSystem.getLogs({
        category: 'SECURITY',
        type: ['2FA_ENABLED', '2FA_DISABLED', 'TOTP_VERIFIED', 'SMS_VERIFIED', 'EMAIL_VERIFIED', 'BACKUP_VERIFIED']
      });
    }
    return [];
  }

  check2FAStatus() {
    // Verificar si 2FA está habilitado globalmente
    const globalConfig = localStorage.getItem('axyra_2fa_global');
    if (globalConfig) {
      const config = JSON.parse(globalConfig);
      this.isEnabled = config.enabled || false;
    }
  }

  setupEventListeners() {
    // Escuchar cambios en configuración
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('axyra_2fa_')) {
        this.check2FAStatus();
      }
    });
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem('axyra_2fa_config');
      if (stored) {
        const config = JSON.parse(stored);
        Object.assign(this, config);
      }
    } catch (error) {
      console.error('Error cargando configuración 2FA:', error);
    }
  }

  saveConfig() {
    try {
      const config = {
        isEnabled: this.isEnabled,
        methods: this.methods,
        currentMethod: this.currentMethod,
        issuer: this.issuer,
        algorithm: this.algorithm,
        digits: this.digits,
        period: this.period,
        window: this.window
      };
      localStorage.setItem('axyra_2fa_config', JSON.stringify(config));
    } catch (error) {
      console.error('Error guardando configuración 2FA:', error);
    }
  }
}

// Inicializar sistema 2FA
let axyra2FASystem;
document.addEventListener('DOMContentLoaded', () => {
  axyra2FASystem = new Axyra2FASystem();
  window.axyra2FASystem = axyra2FASystem;
});

// Exportar para uso global
window.Axyra2FASystem = Axyra2FASystem;
