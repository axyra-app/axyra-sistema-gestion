// ========================================
// SISTEMA DE NOTIFICACIONES MEJORADO AXYRA
// ========================================

class AxyraNotificationSystemImproved {
  constructor() {
    this.notifications = [];
    this.isInitialized = false;
    this.notificationInterval = null;
    this.lastNotificationTime = 0;
    this.notificationCooldown = 10 * 60 * 1000; // 10 minutos
    this.notificationContainer = null;
    this.notificationCount = 0;
    this.maxNotifications = 5; // Máximo de notificaciones visibles
    this.notificationStack = []; // Stack para organizar notificaciones
    
    this.init();
  }

  async init() {
    try {
      if (this.isInitialized) {
        console.log('⚠️ Sistema de notificaciones ya inicializado');
        return;
      }

      if (!('Notification' in window)) {
        console.warn('Este navegador no soporta notificaciones push');
        return;
      }

      if (Notification.permission === 'default') {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('Permisos de notificación denegados');
          return;
        }
      }

      this.createNotificationContainer();
      this.isInitialized = true;
      this.setupNotificationInterval();
      this.loadStoredNotifications();
      this.renderNotifications();
      this.setupEventListeners();
      
      console.log('✅ Sistema de notificaciones AXYRA mejorado inicializado correctamente');
      this.showWelcomeNotification();
    } catch (error) {
      console.error('❌ Error inicializando sistema de notificaciones:', error);
    }
  }

  createNotificationContainer() {
    try {
      if (document.getElementById('axyra-notifications-container')) {
        this.notificationContainer = document.getElementById('axyra-notifications-container');
        return;
      }

      const container = document.createElement('div');
      container.id = 'axyra-notifications-container';
      container.className = 'axyra-notifications-container';
      container.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 10000;
        max-width: 420px;
        min-width: 380px;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        gap: 12px;
        max-height: calc(100vh - 120px);
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0 8px;
      `;

      // Agregar estilos CSS para scrollbar personalizada
      const style = document.createElement('style');
      style.textContent = `
        .axyra-notifications-container::-webkit-scrollbar {
          width: 6px;
        }
        .axyra-notifications-container::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        .axyra-notifications-container::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.3);
          border-radius: 3px;
        }
        .axyra-notifications-container::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 0, 0, 0.5);
        }
      `;
      document.head.appendChild(style);

      document.body.appendChild(container);
      this.notificationContainer = container;
      
      console.log('✅ Contenedor de notificaciones mejorado creado');
    } catch (error) {
      console.error('❌ Error creando contenedor de notificaciones:', error);
    }
  }

  setupEventListeners() {
    try {
      document.addEventListener('axyra-show-notification', (e) => {
        this.showNotification(e.detail.message, e.detail.type, e.detail.duration);
      });

      document.addEventListener('axyra-push-notification', (e) => {
        this.showPushNotification(e.detail.title, e.detail.message, e.detail.icon);
      });

      document.addEventListener('axyra-error-notification', (e) => {
        this.showErrorNotification(e.detail.message, e.detail.duration);
      });

      document.addEventListener('axyra-success-notification', (e) => {
        this.showSuccessNotification(e.detail.message, e.detail.duration);
      });

      console.log('✅ Event listeners configurados');
    } catch (error) {
      console.error('❌ Error configurando event listeners:', error);
    }
  }

  setupNotificationInterval() {
    try {
      if (this.notificationInterval) {
        clearInterval(this.notificationInterval);
      }

      this.notificationInterval = setInterval(() => {
        this.checkAndSendNotifications();
      }, this.notificationCooldown);

      this.checkAndSendNotifications();
      console.log('✅ Intervalo de notificaciones configurado');
    } catch (error) {
      console.error('❌ Error configurando intervalo de notificaciones:', error);
    }
  }

  checkAndSendNotifications() {
    try {
      const now = Date.now();
      if (now - this.lastNotificationTime < this.notificationCooldown) {
        return;
      }

      this.generateSystemNotifications();
      this.lastNotificationTime = now;
    } catch (error) {
      console.error('❌ Error verificando notificaciones:', error);
    }
  }

  generateSystemNotifications() {
    try {
      const empleados = this.getDataFromStorage('axyra_empleados') || [];
      const horas = this.getDataFromStorage('axyra_horas') || [];
      const nominas = this.getDataFromStorage('axyra_nominas') || [];
      const cuadres = this.getDataFromStorage('axyra_cuadres') || [];
      const config = this.getDataFromStorage('axyra_config_empresa') || {};
      
      const systemNotifications = [];

      // Verificar empleados sin horas registradas
      if (empleados.length > 0) {
        const empleadosSinHoras = empleados.filter((emp) => {
          const tieneHorasPorId = horas.some((h) => h.empleadoId === emp.id);
          const tieneHorasPorCedula = horas.some((h) => h.cedula === emp.cedula);
          return !tieneHorasPorId && !tieneHorasPorCedula;
        });

        if (empleadosSinHoras.length > 0) {
          systemNotifications.push({
            id: 'empleados_sin_horas',
            type: 'warning',
            title: 'Empleados sin horas registradas',
            message: `${empleadosSinHoras.length} empleado(s) no tienen horas registradas en el sistema`,
            action: 'Ver empleados',
            timestamp: Date.now(),
            data: { empleados: empleadosSinHoras },
            priority: 'high'
          });
        }
      }

      // Verificar nóminas pendientes
      const nominasPendientes = nominas.filter((nom) => nom.estado === 'pendiente');
      if (nominasPendientes.length > 0) {
        systemNotifications.push({
          id: 'nominas_pendientes',
          type: 'info',
          title: 'Nóminas pendientes',
          message: `${nominasPendientes.length} nómina(s) pendiente(s) de aprobación`,
          action: 'Ver nóminas',
          timestamp: Date.now(),
          data: { nominas: nominasPendientes },
          priority: 'medium'
        });
      }

      // Verificar cuadres pendientes
      const cuadresPendientes = cuadres.filter((cuadre) => cuadre.estado === 'pendiente');
      if (cuadresPendientes.length > 0) {
        systemNotifications.push({
          id: 'cuadres_pendientes',
          type: 'info',
          title: 'Cuadres de caja pendientes',
          message: `${cuadresPendientes.length} cuadre(s) de caja pendiente(s) de revisión`,
          action: 'Ver cuadres',
          timestamp: Date.now(),
          data: { cuadres: cuadresPendientes },
          priority: 'medium'
        });
      }

      // Organizar notificaciones por prioridad
      systemNotifications.sort((a, b) => {
        const priorityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      });

      systemNotifications.forEach((notification) => {
        this.showSystemNotification(notification);
      });

      console.log(`✅ ${systemNotifications.length} notificaciones del sistema generadas`);
    } catch (error) {
      console.error('❌ Error generando notificaciones del sistema:', error);
    }
  }

  showSystemNotification(notification) {
    try {
      const existingNotification = this.notifications.find(n => n.id === notification.id);
      if (existingNotification) {
        console.log(`⚠️ Notificación ${notification.id} ya existe, saltando...`);
        return;
      }

      const notificationElement = this.createNotificationElement({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        action: notification.action,
        timestamp: notification.timestamp,
        isSystem: true,
        priority: notification.priority
      });

      this.addNotification(notificationElement);
    } catch (error) {
      console.error('❌ Error mostrando notificación del sistema:', error);
    }
  }

  showWelcomeNotification() {
    try {
      const hasShownWelcome = localStorage.getItem('axyra_welcome_shown');
      if (!hasShownWelcome) {
        this.showSuccessNotification('¡Bienvenido a AXYRA! Sistema de notificaciones mejorado activado.', 5000);
        localStorage.setItem('axyra_welcome_shown', 'true');
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación de bienvenida:', error);
    }
  }

  showNotification(message, type = 'info', duration = 5000) {
    try {
      const notificationElement = this.createNotificationElement({
        id: `notification_${Date.now()}`,
        type: type,
        title: this.getNotificationTitle(type),
        message: message,
        timestamp: Date.now(),
        priority: 'low'
      });

      this.addNotification(notificationElement);

      if (duration > 0) {
        setTimeout(() => {
          this.removeNotification(notificationElement.id);
        }, duration);
      }

      return notificationElement.id;
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
      return null;
    }
  }

  showSuccessNotification(message, duration = 5000) {
    return this.showNotification(message, 'success', duration);
  }

  showErrorNotification(message, duration = 5000) {
    return this.showNotification(message, 'error', duration);
  }

  showWarningNotification(message, duration = 5000) {
    return this.showNotification(message, 'warning', duration);
  }

  showInfoNotification(message, duration = 5000) {
    return this.showNotification(message, 'info', duration);
  }

  showPushNotification(title, message, icon = '🔔') {
    try {
      if (Notification.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: icon,
          badge: icon,
          tag: 'axyra-notification',
        });
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación push:', error);
    }
  }

  createNotificationElement(notification) {
    try {
      const notificationDiv = document.createElement('div');
      notificationDiv.id = notification.id;
      notificationDiv.className = `axyra-notification axyra-notification-${notification.type}`;
      
      // Estilos mejorados con mejor organización
      notificationDiv.style.cssText = `
        background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(0,0,0,0.06);
        margin-bottom: 12px;
        padding: 20px;
        border: 1px solid rgba(255,255,255,0.8);
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        pointer-events: auto;
        max-width: 400px;
        min-width: 360px;
        overflow: visible;
        position: relative;
        z-index: 10000;
        backdrop-filter: blur(10px);
        border-left: 4px solid ${this.getNotificationColor(notification.type)};
      `;

      // Contenido HTML mejorado
      notificationDiv.innerHTML = `
        <div class="axyra-notification-header" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="axyra-notification-icon" style="
              width: 40px; 
              height: 40px; 
              border-radius: 50%; 
              background: ${this.getNotificationGradient(notification.type)}; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 20px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            ">
              ${this.getNotificationIcon(notification.type)}
            </div>
            <div>
              <div class="axyra-notification-title" style="
                font-weight: 700; 
                font-size: 16px; 
                color: #1e293b; 
                margin-bottom: 2px;
                line-height: 1.2;
              ">
                ${notification.title}
              </div>
              <div class="axyra-notification-time" style="
                font-size: 11px; 
                color: #64748b; 
                font-weight: 500;
              ">
                ${this.formatTime(notification.timestamp)}
              </div>
            </div>
          </div>
          <button class="axyra-notification-close" onclick="window.axyraNotificationSystem.removeNotification('${notification.id}')" style="
            background: rgba(148, 163, 184, 0.1); 
            border: none; 
            color: #64748b; 
            font-size: 16px; 
            cursor: pointer; 
            padding: 6px; 
            border-radius: 50%; 
            transition: all 0.3s ease; 
            width: 32px; 
            height: 32px; 
            display: flex; 
            align-items: center; 
            justify-content: center;
          ">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="axyra-notification-content">
          <div class="axyra-notification-message" style="
            color: #475569; 
            font-size: 14px; 
            line-height: 1.5; 
            margin-bottom: 16px; 
            font-weight: 500;
          ">
            ${notification.message}
          </div>
          
          ${notification.action ? `
            <div class="axyra-notification-actions" style="display: flex; gap: 8px; align-items: center;">
              <button class="axyra-notification-action" onclick="window.axyraNotificationSystem.handleNotificationAction('${notification.id}')" style="
                background: ${this.getNotificationColor(notification.type)}; 
                color: white; 
                border: none; 
                padding: 10px 20px; 
                border-radius: 8px; 
                font-size: 13px; 
                font-weight: 600; 
                cursor: pointer; 
                transition: all 0.3s ease; 
                box-shadow: 0 4px 12px ${this.getNotificationColor(notification.type)}40;
                flex: 1;
              ">
                ${notification.action}
              </button>
              <button class="axyra-notification-dismiss" onclick="window.axyraNotificationSystem.removeNotification('${notification.id}')" style="
                background: rgba(148, 163, 184, 0.1); 
                color: #64748b; 
                border: 1px solid rgba(148, 163, 184, 0.2); 
                padding: 10px 16px; 
                border-radius: 8px; 
                font-size: 13px; 
                font-weight: 500; 
                cursor: pointer; 
                transition: all 0.3s ease;
              ">
                Descartar
              </button>
            </div>
          ` : ''}
        </div>
      `;

      return notificationDiv;
    } catch (error) {
      console.error('❌ Error creando elemento de notificación:', error);
      return null;
    }
  }

  addNotification(notificationElement) {
    try {
      if (!this.notificationContainer) {
        this.createNotificationContainer();
      }

      if (notificationElement && this.notificationContainer) {
        // Limitar número de notificaciones visibles
        if (this.notifications.length >= this.maxNotifications) {
          const oldestNotification = this.notifications[0];
          this.removeNotification(oldestNotification.id);
        }

        this.notificationContainer.appendChild(notificationElement);
        this.notificationCount++;

        // Animación de entrada mejorada
        setTimeout(() => {
          notificationElement.style.transform = 'translateX(0)';
          notificationElement.style.opacity = '1';
        }, 100);

        this.notifications.push({
          id: notificationElement.id,
          element: notificationElement,
          timestamp: Date.now(),
        });

        console.log(`✅ Notificación agregada: ${notificationElement.id}`);
      }
    } catch (error) {
      console.error('❌ Error agregando notificación:', error);
    }
  }

  removeNotification(notificationId) {
    try {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification && notification.element) {
        notification.element.style.transform = 'translateX(100%)';
        notification.element.style.opacity = '0';
        
        setTimeout(() => {
          if (notification.element.parentNode) {
            notification.element.parentNode.removeChild(notification.element);
          }
          this.notifications = this.notifications.filter((n) => n.id !== notificationId);
          this.notificationCount--;
          console.log(`✅ Notificación removida: ${notificationId}`);
        }, 300);
      }
    } catch (error) {
      console.error('❌ Error removiendo notificación:', error);
    }
  }

  handleNotificationAction(notificationId) {
    try {
      const notification = this.notifications.find((n) => n.id === notificationId);
      if (notification) {
        console.log(`✅ Acción ejecutada para notificación: ${notificationId}`);
        
        if (notification.id === 'empleados_sin_horas') {
          if (window.location.pathname.includes('/empleados/')) {
            if (typeof gestionarDepartamentos === 'function') {
              gestionarDepartamentos();
            }
          } else {
            window.location.href = '/modulos/empleados/empleados.html';
          }
        } else if (notification.id === 'nominas_pendientes') {
          if (!window.location.pathname.includes('/nomina/')) {
            window.location.href = '/modulos/nomina/gestionar_nomina.html';
          }
        } else if (notification.id === 'cuadres_pendientes') {
          if (!window.location.pathname.includes('/caja/')) {
            window.location.href = '/modulos/caja/caja.html';
          }
        }
        
        this.removeNotification(notificationId);
      }
    } catch (error) {
      console.error('❌ Error manejando acción de notificación:', error);
    }
  }

  getNotificationColor(type) {
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };
    return colors[type] || colors.info;
  }

  getNotificationGradient(type) {
    const gradients = {
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };
    return gradients[type] || gradients.info;
  }

  getNotificationIcon(type) {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };
    return icons[type] || icons.info;
  }

  getNotificationTitle(type) {
    const titles = {
      success: 'Éxito',
      error: 'Error',
      warning: 'Advertencia',
      info: 'Información',
    };
    return titles[type] || titles.info;
  }

  formatTime(timestamp) {
    try {
      const now = Date.now();
      const diff = now - timestamp;
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);
      const days = Math.floor(diff / 86400000);

      if (minutes < 1) return 'Ahora';
      if (minutes < 60) return `Hace ${minutes}m`;
      if (hours < 24) return `Hace ${hours}h`;
      if (days < 7) return `Hace ${days}d`;
      return new Date(timestamp).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
    } catch (error) {
      return 'Ahora';
    }
  }

  getDataFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Error obteniendo datos de ${key}:`, error);
      return null;
    }
  }

  loadStoredNotifications() {
    try {
      const stored = localStorage.getItem('axyra_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        console.log(`✅ ${this.notifications.length} notificaciones cargadas del almacenamiento`);
      }
    } catch (error) {
      console.error('❌ Error cargando notificaciones almacenadas:', error);
    }
  }

  renderNotifications() {
    try {
      if (this.notifications.length > 0) {
        this.notifications.forEach((notification) => {
          if (notification.element) {
            this.addNotification(notification.element);
          }
        });
      }
    } catch (error) {
      console.error('❌ Error renderizando notificaciones:', error);
    }
  }

  // Métodos públicos mejorados
  show(message, type = 'info', duration = 5000) {
    return this.showNotification(message, type, duration);
  }

  success(message, duration = 5000) {
    return this.showSuccessNotification(message, duration);
  }

  error(message, duration = 5000) {
    return this.showErrorNotification(message, duration);
  }

  warning(message, duration = 5000) {
    return this.showWarningNotification(message, duration);
  }

  info(message, duration = 5000) {
    return this.showInfoNotification(message, duration);
  }

  push(title, message, icon = '🔔') {
    return this.showPushNotification(title, message, icon);
  }

  remove(id) {
    return this.removeNotification(id);
  }

  clear() {
    try {
      this.notifications.forEach((notification) => {
        this.removeNotification(notification.id);
      });
      console.log('✅ Todas las notificaciones removidas');
    } catch (error) {
      console.error('❌ Error limpiando notificaciones:', error);
    }
  }

  // Método para obtener estadísticas
  getStats() {
    return {
      total: this.notifications.length,
      byType: this.notifications.reduce((acc, notif) => {
        const type = notif.element?.className?.match(/axyra-notification-(\w+)/)?.[1] || 'unknown';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {}),
      maxNotifications: this.maxNotifications
    };
  }
}

// Inicialización mejorada
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraNotificationSystem = new AxyraNotificationSystemImproved();
  });
} else {
  window.axyraNotificationSystem = new AxyraNotificationSystemImproved();
}

window.AxyraNotificationSystemImproved = AxyraNotificationSystemImproved;
