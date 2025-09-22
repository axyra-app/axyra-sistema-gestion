// Sistema de notificaciones básico para AXYRA
class NotificationsSystem {
    constructor() {
        this.notifications = [];
        this.init();
    }

    init() {
        this.loadNotifications();
        this.setupEventListeners();
        console.log('🔔 Sistema de notificaciones inicializado');
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.createNotification('Conexión restaurada', 'success', 'Sistema conectado nuevamente');
        });

        window.addEventListener('offline', () => {
            this.createNotification('Conexión perdida', 'warning', 'Trabajando en modo offline');
        });
    }

    createNotification(title, type = 'info', message = '') {
        const notification = {
            id: this.generateId(),
            title,
            message,
            type,
            timestamp: new Date(),
            read: false
        };

        this.addNotification(notification);
        this.updateUI();
        return notification;
    }

    addNotification(notification) {
        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateUI();
    }

    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateUI();
        }
    }

    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.saveNotifications();
        this.updateUI();
    }

    updateUI() {
        const badge = document.getElementById('notification-badge');
        if (badge) {
            const unreadCount = this.notifications.filter(n => !n.read).length;
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    saveNotifications() {
        try {
            localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error guardando notificaciones:', error);
        }
    }

    loadNotifications() {
        try {
            const saved = localStorage.getItem('axyra_notifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
                this.updateUI();
            }
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        }
    }

    generateId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showSuccess(title, message) {
        return this.createNotification(title, 'success', message);
    }

    showWarning(title, message) {
        return this.createNotification(title, 'warning', message);
    }

    showError(title, message) {
        return this.createNotification(title, 'error', message);
    }

    showInfo(title, message) {
        return this.createNotification(title, 'info', message);
    }
}

// Inicializar
let notificationsSystem;

document.addEventListener('DOMContentLoaded', () => {
    notificationsSystem = new NotificationsSystem();
    window.notificationsSystem = notificationsSystem;
});

window.NotificationsSystem = NotificationsSystem;
