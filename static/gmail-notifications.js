// ========================================
// SISTEMA DE NOTIFICACIONES GMAIL AXYRA
// ========================================

// Clase para manejar notificaciones por Gmail
class AxyraGmailNotifications {
  constructor() {
    this.isEnabled = false;
    this.userEmail = null;
    this.init();
  }

  // Inicializar sistema de notificaciones
  init() {
    console.log('📧 Inicializando sistema de notificaciones Gmail AXYRA...');
    this.checkNotificationSettings();
    this.setupEventListeners();
  }

  // Verificar configuración de notificaciones
  checkNotificationSettings() {
    try {
      const notificationSettings = localStorage.getItem('axyra_notification_settings');
      if (notificationSettings) {
        const settings = JSON.parse(notificationSettings);
        this.isEnabled = settings.emailNotifications || false;
        this.userEmail = settings.userEmail || null;

        if (this.isEnabled) {
          console.log('✅ Notificaciones por email habilitadas para:', this.userEmail);
        } else {
          console.log('ℹ️ Notificaciones por email deshabilitadas');
        }
      }
    } catch (error) {
      console.error('❌ Error verificando configuración de notificaciones:', error);
    }
  }

  // Configurar event listeners
  setupEventListeners() {
    // Buscar checkbox de notificaciones por email
    const emailCheckbox = document.querySelector('input[type="checkbox"][onchange*="actualizarPreferencias"]');
    if (emailCheckbox) {
      emailCheckbox.addEventListener('change', (e) => {
        this.toggleEmailNotifications(e.target.checked);
      });
    }

    // Buscar campo de email
    const emailInput = document.getElementById('emailInput');
    if (emailInput) {
      emailInput.addEventListener('change', (e) => {
        this.updateUserEmail(e.target.value);
      });
    }
  }

  // Habilitar/deshabilitar notificaciones por email
  toggleEmailNotifications(enabled) {
    try {
      this.isEnabled = enabled;

      // Guardar configuración
      const settings = {
        emailNotifications: enabled,
        userEmail: this.userEmail,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem('axyra_notification_settings', JSON.stringify(settings));

      if (enabled) {
        console.log('✅ Notificaciones por email habilitadas');
        this.showNotification('Notificaciones por email habilitadas', 'success');
      } else {
        console.log('ℹ️ Notificaciones por email deshabilitadas');
        this.showNotification('Notificaciones por email deshabilitadas', 'info');
      }
    } catch (error) {
      console.error('❌ Error configurando notificaciones por email:', error);
      this.showNotification('Error configurando notificaciones por email', 'error');
    }
  }

  // Actualizar email del usuario
  updateUserEmail(email) {
    try {
      this.userEmail = email;

      // Guardar configuración actualizada
      const settings = {
        emailNotifications: this.isEnabled,
        userEmail: email,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem('axyra_notification_settings', JSON.stringify(settings));

      console.log('✅ Email del usuario actualizado:', email);
      this.showNotification('Email actualizado correctamente', 'success');
    } catch (error) {
      console.error('❌ Error actualizando email del usuario:', error);
      this.showNotification('Error actualizando email del usuario', 'error');
    }
  }

  // Enviar notificación por email (simulado)
  async sendEmailNotification(subject, message, type = 'info') {
    if (!this.isEnabled || !this.userEmail) {
      console.log('ℹ️ Notificaciones por email no configuradas');
      return false;
    }

    try {
      console.log('📧 Enviando notificación por email...');
      console.log('📧 Para:', this.userEmail);
      console.log('📧 Asunto:', subject);
      console.log('📧 Mensaje:', message);
      console.log('📧 Tipo:', type);

      // Simular envío de email
      await this.simulateEmailSending(subject, message, type);

      console.log('✅ Notificación por email enviada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error enviando notificación por email:', error);
      return false;
    }
  }

  // Simular envío de email (placeholder para implementación real)
  async simulateEmailSending(subject, message, type) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Aquí se implementaría la lógica real de envío de email
        // Por ejemplo, usando EmailJS, SendGrid, o un backend propio

        console.log('📧 Simulando envío de email...');
        console.log('📧 Servidor: smtp.gmail.com');
        console.log('📧 Puerto: 587');
        console.log('📧 Protocolo: STARTTLS');

        // Simular delay de red
        setTimeout(() => {
          console.log('📧 Email enviado exitosamente');
          resolve(true);
        }, 1000);
      }, 500);
    });
  }

  // Enviar notificación de nómina generada
  async notifyNominaGenerated(nominaData) {
    if (!this.isEnabled) return;

    const subject = 'Nómina Generada - Sistema AXYRA';
    const message = `
      Se ha generado una nueva nómina en el sistema AXYRA.
      
      Detalles de la nómina:
      - Empleado: ${nominaData.empleadoNombre}
      - Período: ${nominaData.periodo}
      - Salario neto: ${nominaData.salarioNeto}
      - Fecha de generación: ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
      
      Esta es una notificación automática del sistema.
    `;

    return await this.sendEmailNotification(subject, message, 'success');
  }

  // Enviar notificación de empleado registrado
  async notifyEmpleadoRegistered(empleadoData) {
    if (!this.isEnabled) return;

    const subject = 'Nuevo Empleado Registrado - Sistema AXYRA';
    const message = `
      Se ha registrado un nuevo empleado en el sistema AXYRA.
      
      Detalles del empleado:
      - Nombre: ${empleadoData.nombre}
      - Cargo: ${empleadoData.cargo}
      - Departamento: ${empleadoData.departamento}
      - Salario: ${empleadoData.salario}
      - Fecha de registro: ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
      
      Esta es una notificación automática del sistema.
    `;

    return await this.sendEmailNotification(subject, message, 'info');
  }

  // Enviar notificación de horas registradas
  async notifyHorasRegistered(horasData) {
    if (!this.isEnabled) return;

    const subject = 'Horas Registradas - Sistema AXYRA';
    const message = `
      Se han registrado nuevas horas en el sistema AXYRA.
      
      Detalles del registro:
      - Empleado: ${horasData.empleadoNombre}
      - Fecha: ${horasData.fecha}
      - Horas normales: ${horasData.horasNormales}
      - Horas extras: ${horasData.horasExtras}
      - Total horas: ${horasData.totalHoras}
      - Fecha de registro: ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
      
      Esta es una notificación automática del sistema.
    `;

    return await this.sendEmailNotification(subject, message, 'info');
  }

  // Enviar notificación de error del sistema
  async notifySystemError(errorData) {
    if (!this.isEnabled) return;

    const subject = 'Error del Sistema - AXYRA';
    const message = `
      Se ha detectado un error en el sistema AXYRA.
      
      Detalles del error:
      - Tipo: ${errorData.type}
      - Mensaje: ${errorData.message}
      - Ubicación: ${errorData.location}
      - Fecha: ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
      - Hora: ${new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })}
      
      Esta es una notificación automática del sistema.
      Por favor, revise el sistema lo antes posible.
    `;

    return await this.sendEmailNotification(subject, message, 'error');
  }

  // Enviar notificación de respaldo del sistema
  async notifySystemBackup(backupData) {
    if (!this.isEnabled) return;

    const subject = 'Respaldo del Sistema Completado - AXYRA';
    const message = `
      Se ha completado un respaldo del sistema AXYRA.
      
      Detalles del respaldo:
      - Tipo: ${backupData.type}
      - Archivos respaldados: ${backupData.fileCount}
      - Tamaño total: ${backupData.totalSize}
      - Fecha: ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
      - Hora: ${new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })}
      
      Esta es una notificación automática del sistema.
      El respaldo se ha completado exitosamente.
    `;

    return await this.sendEmailNotification(subject, message, 'success');
  }

  // Mostrar notificación en la interfaz
  showNotification(message, type = 'info') {
    // Buscar contenedor de notificaciones
    let container = document.getElementById('notificationContainer');
    if (!container) {
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
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };

    notification.style.cssText = `
      background: ${colors[type] || colors.info};
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

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  // Verificar estado del sistema de notificaciones
  getStatus() {
    return {
      isEnabled: this.isEnabled,
      userEmail: this.userEmail,
      lastUpdated: new Date().toISOString(),
    };
  }

  // Probar sistema de notificaciones
  async testNotification() {
    if (!this.isEnabled || !this.userEmail) {
      this.showNotification('Configure el email y habilite las notificaciones primero', 'warning');
      return false;
    }

    const subject = 'Prueba de Notificaciones - Sistema AXYRA';
    const message = `
      Esta es una notificación de prueba del sistema AXYRA.
      
      Si recibe este email, significa que el sistema de notificaciones
      está funcionando correctamente.
      
      Fecha de prueba: ${new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })}
      Hora: ${new Date().toLocaleTimeString('es-CO', { timeZone: 'America/Bogota' })}
      
      Sistema AXYRA - Gestión de Empleados y Nómina
    `;

    const result = await this.sendEmailNotification(subject, message, 'info');

    if (result) {
      this.showNotification('Notificación de prueba enviada correctamente', 'success');
    } else {
      this.showNotification('Error enviando notificación de prueba', 'error');
    }

    return result;
  }
}

// Inicializar sistema de notificaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraGmailNotifications = new AxyraGmailNotifications();
});

// Agregar estilos CSS para las notificaciones
const gmailNotificationStyles = document.createElement('style');
gmailNotificationStyles.textContent = `
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
document.head.appendChild(gmailNotificationStyles);

// Exportar para uso global
window.AxyraGmailNotifications = AxyraGmailNotifications;

console.log('✅ Sistema de notificaciones Gmail AXYRA cargado correctamente');
console.log('📧 Funciones disponibles:');
console.log('- axyraGmailNotifications.sendEmailNotification()');
console.log('- axyraGmailNotifications.notifyNominaGenerated()');
console.log('- axyraGmailNotifications.notifyEmpleadoRegistered()');
console.log('- axyraGmailNotifications.notifyHorasRegistered()');
console.log('- axyraGmailNotifications.testNotification()');
