/**
 * AXYRA - Sistema de Notificaciones Avanzado
 * Maneja notificaciones, alertas y comunicaciones
 */

class AxyraAdvancedNotifications {
  constructor() {
    this.notifications = [];
    this.templates = [];
    this.channels = ['email', 'sms', 'push', 'in-app'];
    this.priorities = ['low', 'medium', 'high', 'urgent'];
    this.categories = ['system', 'business', 'security', 'user', 'reminder'];

    this.init();
  }

  init() {
    console.log('🔔 Inicializando sistema de notificaciones avanzado...');
    this.loadData();
    this.setupDefaultTemplates();
    this.setupNotificationHandlers();
    this.setupScheduledNotifications();
  }

  loadData() {
    try {
      this.notifications = JSON.parse(localStorage.getItem('axyra_notifications') || '[]');
      this.templates = JSON.parse(localStorage.getItem('axyra_notification_templates') || '[]');
    } catch (error) {
      console.error('Error cargando datos de notificaciones:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
      localStorage.setItem('axyra_notification_templates', JSON.stringify(this.templates));
    } catch (error) {
      console.error('Error guardando datos de notificaciones:', error);
    }
  }

  setupDefaultTemplates() {
    if (this.templates.length === 0) {
      this.templates = [
        {
          id: 'welcome',
          name: 'Bienvenida',
          subject: 'Bienvenido a AXYRA',
          body: 'Hola {{name}}, bienvenido al sistema AXYRA. Tu cuenta ha sido creada exitosamente.',
          channels: ['email', 'in-app'],
          category: 'user',
          priority: 'medium',
        },
        {
          id: 'password_reset',
          name: 'Restablecimiento de Contraseña',
          subject: 'Restablecer Contraseña',
          body: 'Hola {{name}}, has solicitado restablecer tu contraseña. Haz clic en el enlace: {{resetLink}}',
          channels: ['email'],
          category: 'security',
          priority: 'high',
        },
        {
          id: 'task_assigned',
          name: 'Tarea Asignada',
          subject: 'Nueva Tarea Asignada',
          body: 'Hola {{name}}, se te ha asignado una nueva tarea: {{taskTitle}}. Fecha límite: {{dueDate}}',
          channels: ['email', 'in-app', 'push'],
          category: 'business',
          priority: 'medium',
        },
        {
          id: 'system_maintenance',
          name: 'Mantenimiento del Sistema',
          subject: 'Mantenimiento Programado',
          body: 'El sistema estará en mantenimiento el {{date}} de {{startTime}} a {{endTime}}.',
          channels: ['email', 'in-app'],
          category: 'system',
          priority: 'high',
        },
      ];
      this.saveData();
    }
  }

  setupNotificationHandlers() {
    // Configurar manejadores de notificaciones
    this.handlers = {
      email: this.sendEmailNotification.bind(this),
      sms: this.sendSMSNotification.bind(this),
      push: this.sendPushNotification.bind(this),
      'in-app': this.sendInAppNotification.bind(this),
    };
  }

  setupScheduledNotifications() {
    // Verificar notificaciones programadas cada minuto
    setInterval(() => {
      this.processScheduledNotifications();
    }, 60000);
  }

  createNotification(notificationData) {
    const notification = {
      id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: notificationData.title,
      message: notificationData.message,
      type: notificationData.type || 'info',
      category: notificationData.category || 'system',
      priority: notificationData.priority || 'medium',
      channels: notificationData.channels || ['in-app'],
      recipients: notificationData.recipients || [],
      templateId: notificationData.templateId || null,
      data: notificationData.data || {},
      scheduledFor: notificationData.scheduledFor || null,
      expiresAt: notificationData.expiresAt || null,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
      sentAt: null,
      readAt: null,
      clickedAt: null,
    };

    this.notifications.push(notification);
    this.saveData();

    // Procesar notificación si no está programada
    if (!notification.scheduledFor) {
      this.processNotification(notification);
    }

    console.log('✅ Notificación creada:', notification.title);
    return notification;
  }

  async processNotification(notification) {
    try {
      // Procesar cada canal
      for (const channel of notification.channels) {
        if (this.handlers[channel]) {
          await this.handlers[channel](notification);
        }
      }

      // Actualizar estado
      notification.status = 'sent';
      notification.sentAt = new Date().toISOString();
      this.saveData();

      console.log('✅ Notificación enviada:', notification.title);
    } catch (error) {
      console.error('Error enviando notificación:', error);
      notification.status = 'failed';
      this.saveData();
    }
  }

  async sendEmailNotification(notification) {
    if (window.axyraExternalIntegrations) {
      for (const recipient of notification.recipients) {
        try {
          await window.axyraExternalIntegrations.sendEmail(recipient.email, notification.title, notification.message);
        } catch (error) {
          console.error('Error enviando email:', error);
        }
      }
    }
  }

  async sendSMSNotification(notification) {
    if (window.axyraExternalIntegrations) {
      for (const recipient of notification.recipients) {
        try {
          await window.axyraExternalIntegrations.sendSMS(recipient.phone, notification.message);
        } catch (error) {
          console.error('Error enviando SMS:', error);
        }
      }
    }
  }

  async sendPushNotification(notification) {
    if (window.axyraPushNotifications) {
      try {
        await window.axyraPushNotifications.sendNotification({
          title: notification.title,
          body: notification.message,
          data: notification.data,
        });
      } catch (error) {
        console.error('Error enviando push notification:', error);
      }
    }
  }

  async sendInAppNotification(notification) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showNotification(notification.title, notification.message, {
        type: notification.type,
        duration: this.getDurationByPriority(notification.priority),
        actions: this.getNotificationActions(notification),
      });
    }
  }

  getDurationByPriority(priority) {
    const durations = {
      low: 3000,
      medium: 5000,
      high: 8000,
      urgent: 0, // No se cierra automáticamente
    };
    return durations[priority] || 5000;
  }

  getNotificationActions(notification) {
    const actions = [];

    if (notification.data.actionUrl) {
      actions.push({
        text: 'Ver',
        action: () => window.open(notification.data.actionUrl, '_blank'),
      });
    }

    if (notification.data.dismissible !== false) {
      actions.push({
        text: 'Cerrar',
        action: () => this.markAsRead(notification.id),
      });
    }

    return actions;
  }

  processScheduledNotifications() {
    const now = new Date();
    const scheduledNotifications = this.notifications.filter(
      (n) => n.scheduledFor && new Date(n.scheduledFor) <= now && n.status === 'pending'
    );

    scheduledNotifications.forEach((notification) => {
      this.processNotification(notification);
    });
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.readAt = new Date().toISOString();
      this.saveData();
    }
  }

  markAsClicked(notificationId) {
    const notification = this.notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.clickedAt = new Date().toISOString();
      this.saveData();
    }
  }

  getNotifications(filters = {}) {
    let filteredNotifications = [...this.notifications];

    if (filters.recipient) {
      filteredNotifications = filteredNotifications.filter((n) => n.recipients.some((r) => r.id === filters.recipient));
    }

    if (filters.category) {
      filteredNotifications = filteredNotifications.filter((n) => n.category === filters.category);
    }

    if (filters.priority) {
      filteredNotifications = filteredNotifications.filter((n) => n.priority === filters.priority);
    }

    if (filters.status) {
      filteredNotifications = filteredNotifications.filter((n) => n.status === filters.status);
    }

    if (filters.unread) {
      filteredNotifications = filteredNotifications.filter((n) => !n.readAt);
    }

    if (filters.dateFrom) {
      filteredNotifications = filteredNotifications.filter((n) => new Date(n.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filteredNotifications = filteredNotifications.filter((n) => new Date(n.createdAt) <= new Date(filters.dateTo));
    }

    return filteredNotifications;
  }

  getUnreadCount(recipientId) {
    return this.notifications.filter((n) => n.recipients.some((r) => r.id === recipientId) && !n.readAt).length;
  }

  createTemplate(templateData) {
    const template = {
      id: templateData.id || 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: templateData.name,
      subject: templateData.subject,
      body: templateData.body,
      channels: templateData.channels || ['in-app'],
      category: templateData.category || 'system',
      priority: templateData.priority || 'medium',
      variables: templateData.variables || [],
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    this.templates.push(template);
    this.saveData();

    console.log('✅ Plantilla creada:', template.name);
    return template;
  }

  sendTemplateNotification(templateId, recipients, data = {}) {
    const template = this.templates.find((t) => t.id === templateId);
    if (!template) {
      throw new Error('Plantilla no encontrada');
    }

    const notification = {
      title: this.replaceVariables(template.subject, data),
      message: this.replaceVariables(template.body, data),
      type: this.getTypeByPriority(template.priority),
      category: template.category,
      priority: template.priority,
      channels: template.channels,
      recipients: recipients,
      templateId: templateId,
      data: data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    return this.createNotification(notification);
  }

  replaceVariables(text, data) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return data[key] || match;
    });
  }

  getTypeByPriority(priority) {
    const types = {
      low: 'info',
      medium: 'info',
      high: 'warning',
      urgent: 'error',
    };
    return types[priority] || 'info';
  }

  getNotificationStatistics() {
    const total = this.notifications.length;
    const sent = this.notifications.filter((n) => n.status === 'sent').length;
    const pending = this.notifications.filter((n) => n.status === 'pending').length;
    const failed = this.notifications.filter((n) => n.status === 'failed').length;
    const read = this.notifications.filter((n) => n.readAt).length;
    const unread = total - read;

    const categoryStats = {};
    const priorityStats = {};

    this.notifications.forEach((notification) => {
      categoryStats[notification.category] = (categoryStats[notification.category] || 0) + 1;
      priorityStats[notification.priority] = (priorityStats[notification.priority] || 0) + 1;
    });

    return {
      total: total,
      sent: sent,
      pending: pending,
      failed: failed,
      read: read,
      unread: unread,
      categoryStats: categoryStats,
      priorityStats: priorityStats,
    };
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  exportNotifications(format = 'json') {
    const data = {
      notifications: this.notifications,
      templates: this.templates,
      exportDate: new Date().toISOString(),
    };

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertNotificationsToCSV();
        filename = 'axyra-notifications.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-notifications.json';
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Notificaciones exportadas');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Notificaciones exportadas');
    }
  }

  convertNotificationsToCSV() {
    const rows = [];

    // Encabezados
    rows.push(['ID', 'Título', 'Mensaje', 'Tipo', 'Categoría', 'Prioridad', 'Estado', 'Creado']);

    // Datos
    this.notifications.forEach((notification) => {
      rows.push([
        notification.id,
        notification.title,
        notification.message,
        notification.type,
        notification.category,
        notification.priority,
        notification.status,
        new Date(notification.createdAt).toLocaleDateString(),
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  clearOldNotifications(days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const oldNotifications = this.notifications.filter((n) => new Date(n.createdAt) < cutoffDate);

    this.notifications = this.notifications.filter((n) => new Date(n.createdAt) >= cutoffDate);

    this.saveData();

    console.log(`🧹 ${oldNotifications.length} notificaciones antiguas eliminadas`);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`${oldNotifications.length} notificaciones antiguas eliminadas`);
    }
  }
}

// Inicializar sistema de notificaciones avanzado
let axyraAdvancedNotifications;
document.addEventListener('DOMContentLoaded', () => {
  axyraAdvancedNotifications = new AxyraAdvancedNotifications();
  window.axyraAdvancedNotifications = axyraAdvancedNotifications;
});

// Exportar para uso global
window.AxyraAdvancedNotifications = AxyraAdvancedNotifications;

