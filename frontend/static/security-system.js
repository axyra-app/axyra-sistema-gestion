/**
 * AXYRA - Sistema de Seguridad Avanzado
 * Protección integral del sistema y datos
 */

class AxyraSecuritySystem {
  constructor() {
    this.securityConfig = {
      maxLoginAttempts: 5,
      lockoutDuration: 15 * 60 * 1000, // 15 minutos
      sessionTimeout: 30 * 60 * 1000, // 30 minutos
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      maxConcurrentSessions: 3,
    };

    this.loginAttempts = {};
    this.activeSessions = {};
    this.securityLog = [];
    this.isMonitoring = false;

    this.init();
  }

  init() {
    console.log('🔒 Inicializando sistema de seguridad...');
    this.loadSecurityConfig();
    this.setupSessionMonitoring();
    this.setupSecurityHeaders();
    this.setupInputValidation();
    this.setupXSSProtection();
    this.setupCSRFProtection();
    this.startSecurityMonitoring();
  }

  loadSecurityConfig() {
    try {
      const stored = localStorage.getItem('axyra_security_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.securityConfig = { ...this.securityConfig, ...parsed };
      }
    } catch (error) {
      console.warn('Error cargando configuración de seguridad:', error);
    }
  }

  saveSecurityConfig() {
    try {
      localStorage.setItem('axyra_security_config', JSON.stringify(this.securityConfig));
    } catch (error) {
      console.error('Error guardando configuración de seguridad:', error);
    }
  }

  setupSessionMonitoring() {
    // Verificar sesión activa
    this.checkActiveSession();

    // Monitorear actividad del usuario
    this.setupActivityMonitoring();

    // Limpiar sesiones expiradas
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 60000); // Cada minuto
  }

  checkActiveSession() {
    const sessionData = sessionStorage.getItem('axyra_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        const now = Date.now();

        if (now - session.lastActivity > this.securityConfig.sessionTimeout) {
          this.logoutUser('Sesión expirada por inactividad');
          return false;
        }

        return true;
      } catch (error) {
        this.logoutUser('Sesión inválida');
        return false;
      }
    }

    return false;
  }

  setupActivityMonitoring() {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    events.forEach((event) => {
      document.addEventListener(
        event,
        () => {
          this.updateLastActivity();
        },
        true
      );
    });
  }

  updateLastActivity() {
    const sessionData = sessionStorage.getItem('axyra_session');
    if (sessionData) {
      try {
        const session = JSON.parse(sessionData);
        session.lastActivity = Date.now();
        sessionStorage.setItem('axyra_session', JSON.stringify(session));
      } catch (error) {
        console.warn('Error actualizando actividad de sesión:', error);
      }
    }
  }

  setupSecurityHeaders() {
    // Configurar headers de seguridad
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content =
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:;";
    document.head.appendChild(meta);

    // Configurar X-Frame-Options
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);

    // Configurar X-Content-Type-Options
    const contentTypeOptions = document.createElement('meta');
    contentTypeOptions.httpEquiv = 'X-Content-Type-Options';
    contentTypeOptions.content = 'nosniff';
    document.head.appendChild(contentTypeOptions);
  }

  setupInputValidation() {
    // Validar todos los inputs
    document.addEventListener('input', (event) => {
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        this.validateInput(event.target);
      }
    });

    // Validar formularios antes del envío
    document.addEventListener('submit', (event) => {
      if (!this.validateForm(event.target)) {
        event.preventDefault();
      }
    });
  }

  validateInput(input) {
    const value = input.value;
    const type = input.type;

    // Validar longitud
    if (input.maxLength && value.length > input.maxLength) {
      this.showInputError(input, 'El texto excede la longitud máxima permitida');
      return false;
    }

    // Validar patrones
    if (input.pattern) {
      const regex = new RegExp(input.pattern);
      if (!regex.test(value)) {
        this.showInputError(input, 'El formato no es válido');
        return false;
      }
    }

    // Validar tipos específicos
    switch (type) {
      case 'email':
        if (value && !this.isValidEmail(value)) {
          this.showInputError(input, 'El formato de email no es válido');
          return false;
        }
        break;
      case 'password':
        if (value && !this.isValidPassword(value)) {
          this.showInputError(input, 'La contraseña no cumple con los requisitos de seguridad');
          return false;
        }
        break;
      case 'tel':
        if (value && !this.isValidPhone(value)) {
          this.showInputError(input, 'El formato de teléfono no es válido');
          return false;
        }
        break;
    }

    this.clearInputError(input);
    return true;
  }

  validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isValid = true;

    inputs.forEach((input) => {
      if (!this.validateInput(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  isValidPassword(password) {
    const config = this.securityConfig;
    let isValid = true;

    if (password.length < config.passwordMinLength) {
      isValid = false;
    }

    if (config.requireUppercase && !/[A-Z]/.test(password)) {
      isValid = false;
    }

    if (config.requireNumbers && !/\d/.test(password)) {
      isValid = false;
    }

    if (config.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      isValid = false;
    }

    return isValid;
  }

  isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  showInputError(input, message) {
    this.clearInputError(input);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'input-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '4px';

    input.parentNode.appendChild(errorDiv);
    input.style.borderColor = '#e74c3c';
  }

  clearInputError(input) {
    const errorDiv = input.parentNode.querySelector('.input-error');
    if (errorDiv) {
      errorDiv.remove();
    }
    input.style.borderColor = '';
  }

  setupXSSProtection() {
    // Sanitizar contenido HTML
    const originalInnerHTML = Element.prototype.innerHTML;
    Element.prototype.innerHTML = function (html) {
      if (typeof html === 'string') {
        html = this.sanitizeHTML(html);
      }
      return originalInnerHTML.call(this, html);
    }.bind(this);

    // Sanitizar atributos
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function (name, value) {
      if (typeof value === 'string') {
        value = this.sanitizeAttribute(name, value);
      }
      return originalSetAttribute.call(this, name, value);
    }.bind(this);
  }

  sanitizeHTML(html) {
    // Remover scripts y eventos peligrosos
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/vbscript:/gi, '');
  }

  sanitizeAttribute(name, value) {
    // Sanitizar atributos peligrosos
    const dangerousAttributes = ['onclick', 'onload', 'onerror', 'onmouseover'];
    if (dangerousAttributes.includes(name.toLowerCase())) {
      return '';
    }

    // Sanitizar URLs
    if (name.toLowerCase() === 'src' || name.toLowerCase() === 'href') {
      if (value.startsWith('javascript:') || value.startsWith('vbscript:')) {
        return '#';
      }
    }

    return value;
  }

  setupCSRFProtection() {
    // Generar token CSRF
    this.generateCSRFToken();

    // Validar token en formularios
    document.addEventListener('submit', (event) => {
      if (!this.validateCSRFToken(event.target)) {
        event.preventDefault();
        this.logSecurityEvent('CSRF_ATTACK_ATTEMPT', 'Intento de ataque CSRF detectado');
      }
    });
  }

  generateCSRFToken() {
    const token = 'csrf_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('axyra_csrf_token', token);
    return token;
  }

  validateCSRFToken(form) {
    const formToken = form.querySelector('input[name="csrf_token"]')?.value;
    const sessionToken = sessionStorage.getItem('axyra_csrf_token');

    return formToken && sessionToken && formToken === sessionToken;
  }

  startSecurityMonitoring() {
    this.isMonitoring = true;

    // Monitorear intentos de login
    this.monitorLoginAttempts();

    // Monitorear actividad sospechosa
    this.monitorSuspiciousActivity();

    // Monitorear cambios en el DOM
    this.monitorDOMChanges();
  }

  monitorLoginAttempts() {
    // Interceptar intentos de login
    const originalLogin = window.loginUser;
    if (originalLogin) {
      window.loginUser = (credentials) => {
        const clientId = this.getClientId();

        if (this.isAccountLocked(clientId)) {
          this.logSecurityEvent('LOGIN_ATTEMPT_LOCKED', 'Intento de login en cuenta bloqueada');
          return false;
        }

        const result = originalLogin(credentials);

        if (result) {
          this.clearLoginAttempts(clientId);
          this.logSecurityEvent('LOGIN_SUCCESS', 'Login exitoso');
        } else {
          this.recordLoginAttempt(clientId);
          this.logSecurityEvent('LOGIN_FAILED', 'Intento de login fallido');
        }

        return result;
      };
    }
  }

  monitorSuspiciousActivity() {
    // Monitorear múltiples pestañas
    window.addEventListener('storage', (event) => {
      if (event.key === 'axyra_session') {
        this.logSecurityEvent('MULTIPLE_TABS', 'Múltiples pestañas detectadas');
      }
    });

    // Monitorear cambios en localStorage
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function (key, value) {
      if (key.startsWith('axyra_')) {
        axyraSecuritySystem.logSecurityEvent('LOCALSTORAGE_CHANGE', `Cambio en ${key}`);
      }
      return originalSetItem.call(this, key, value);
    };
  }

  monitorDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Verificar scripts inyectados
              if (node.tagName === 'SCRIPT') {
                this.logSecurityEvent('SCRIPT_INJECTION', 'Script inyectado detectado');
              }

              // Verificar elementos sospechosos
              if (node.innerHTML && node.innerHTML.includes('javascript:')) {
                this.logSecurityEvent('XSS_ATTEMPT', 'Intento de XSS detectado');
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  getClientId() {
    let clientId = localStorage.getItem('axyra_client_id');
    if (!clientId) {
      clientId = 'client_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('axyra_client_id', clientId);
    }
    return clientId;
  }

  isAccountLocked(clientId) {
    const attempts = this.loginAttempts[clientId];
    if (!attempts) return false;

    const now = Date.now();
    const lockoutTime = attempts.lastAttempt + this.securityConfig.lockoutDuration;

    return attempts.count >= this.securityConfig.maxLoginAttempts && now < lockoutTime;
  }

  recordLoginAttempt(clientId) {
    if (!this.loginAttempts[clientId]) {
      this.loginAttempts[clientId] = { count: 0, lastAttempt: 0 };
    }

    const attempts = this.loginAttempts[clientId];
    attempts.count++;
    attempts.lastAttempt = Date.now();

    if (attempts.count >= this.securityConfig.maxLoginAttempts) {
      this.logSecurityEvent(
        'ACCOUNT_LOCKED',
        `Cuenta bloqueada por ${this.securityConfig.maxLoginAttempts} intentos fallidos`
      );
    }
  }

  clearLoginAttempts(clientId) {
    delete this.loginAttempts[clientId];
  }

  cleanupExpiredSessions() {
    const now = Date.now();
    Object.keys(this.activeSessions).forEach((sessionId) => {
      const session = this.activeSessions[sessionId];
      if (now - session.lastActivity > this.securityConfig.sessionTimeout) {
        delete this.activeSessions[sessionId];
        this.logSecurityEvent('SESSION_EXPIRED', `Sesión ${sessionId} expirada`);
      }
    });
  }

  logSecurityEvent(eventType, description, details = {}) {
    const event = {
      id: Date.now() + Math.random(),
      type: eventType,
      description: description,
      details: details,
      timestamp: new Date().toISOString(),
      clientId: this.getClientId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.securityLog.push(event);

    // Limitar tamaño del log
    if (this.securityLog.length > 1000) {
      this.securityLog = this.securityLog.slice(-500);
    }

    // Guardar en localStorage
    this.saveSecurityLog();

    // Mostrar alerta para eventos críticos
    if (this.isCriticalEvent(eventType)) {
      this.showSecurityAlert(event);
    }

    console.log(`🔒 Evento de seguridad: ${eventType} - ${description}`);
  }

  isCriticalEvent(eventType) {
    const criticalEvents = [
      'CSRF_ATTACK_ATTEMPT',
      'XSS_ATTEMPT',
      'SCRIPT_INJECTION',
      'ACCOUNT_LOCKED',
      'MULTIPLE_TABS',
    ];

    return criticalEvents.includes(eventType);
  }

  showSecurityAlert(event) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showError(`Alerta de seguridad: ${event.description}`, {
        duration: 10000,
        actions: [
          {
            text: 'Ver Detalles',
            action: () => this.showSecurityDetails(event),
          },
        ],
      });
    }
  }

  showSecurityDetails(event) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3>Detalles de Seguridad</h3>
          <button onclick="this.closest('.modal-overlay').remove()" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="security-event">
            <h4>${event.type}</h4>
            <p><strong>Descripción:</strong> ${event.description}</p>
            <p><strong>Timestamp:</strong> ${new Date(event.timestamp).toLocaleString()}</p>
            <p><strong>Cliente:</strong> ${event.clientId}</p>
            <p><strong>URL:</strong> ${event.url}</p>
            ${
              Object.keys(event.details).length > 0
                ? `
              <h5>Detalles Adicionales:</h5>
              <pre>${JSON.stringify(event.details, null, 2)}</pre>
            `
                : ''
            }
          </div>
        </div>
        <div class="modal-footer">
          <button onclick="this.closest('.modal-overlay').remove()" class="btn btn-primary">
            Cerrar
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  }

  saveSecurityLog() {
    try {
      const logToSave = this.securityLog.slice(-100); // Últimos 100 eventos
      localStorage.setItem('axyra_security_log', JSON.stringify(logToSave));
    } catch (error) {
      console.error('Error guardando log de seguridad:', error);
    }
  }

  getSecurityReport() {
    const now = Date.now();
    const last24Hours = this.securityLog.filter(
      (event) => now - new Date(event.timestamp).getTime() < 24 * 60 * 60 * 1000
    );

    const eventCounts = {};
    last24Hours.forEach((event) => {
      eventCounts[event.type] = (eventCounts[event.type] || 0) + 1;
    });

    return {
      summary: {
        totalEvents: this.securityLog.length,
        last24Hours: last24Hours.length,
        criticalEvents: last24Hours.filter((e) => this.isCriticalEvent(e.type)).length,
      },
      eventTypes: eventCounts,
      recentEvents: this.securityLog.slice(-20),
      timestamp: new Date().toISOString(),
    };
  }

  exportSecurityReport() {
    const report = this.getSecurityReport();
    const dataStr = JSON.stringify(report, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('🔒 Reporte de seguridad exportado');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Reporte de seguridad exportado');
    }
  }

  updateSecurityConfig(newConfig) {
    this.securityConfig = { ...this.securityConfig, ...newConfig };
    this.saveSecurityConfig();
    console.log('⚙️ Configuración de seguridad actualizada');
  }

  logoutUser(reason = 'Logout manual') {
    this.logSecurityEvent('LOGOUT', reason);

    // Limpiar sesión
    sessionStorage.removeItem('axyra_session');
    sessionStorage.removeItem('axyra_csrf_token');

    // Redirigir al login
    if (window.location.pathname !== '/login.html') {
      window.location.href = '/login.html';
    }
  }

  getSecurityStatus() {
    return {
      isMonitoring: this.isMonitoring,
      activeSessions: Object.keys(this.activeSessions).length,
      securityEvents: this.securityLog.length,
      lockedAccounts: Object.keys(this.loginAttempts).filter((clientId) => this.isAccountLocked(clientId)).length,
    };
  }
}

// Inicializar sistema de seguridad
let axyraSecuritySystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraSecuritySystem = new AxyraSecuritySystem();
  window.axyraSecuritySystem = axyraSecuritySystem;
});

// Exportar para uso global
window.AxyraSecuritySystem = AxyraSecuritySystem;

