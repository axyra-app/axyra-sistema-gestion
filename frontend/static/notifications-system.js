/**
 * AXYRA - Sistema de Notificaciones Avanzado
 * Sistema completo para gestionar notificaciones, alertas y recordatorios
 */

class AXYRANotificationsSystem {
    constructor() {
        this.notifications = [];
        this.settings = this.loadSettings();
        this.init();
    }

    /**
     * Inicializa el sistema de notificaciones
     */
    init() {
        this.loadNotifications();
        this.setupNotificationContainer();
        this.checkScheduledNotifications();
        this.setupAutoRefresh();
    }

    /**
     * Crea el contenedor de notificaciones en el DOM
     */
    setupNotificationContainer() {
        // Crear contenedor principal
        if (!document.getElementById('axyra-notifications-container')) {
            const container = document.createElement('div');
            container.id = 'axyra-notifications-container';
            container.className = 'axyra-notifications-container';
            document.body.appendChild(container);
        }

        // Crear botón de notificaciones en el header
        this.setupNotificationButton();
    }

    /**
     * Configura el botón de notificaciones en el header
     */
    setupNotificationButton() {
        const header = document.querySelector('.axyra-header-content');
        if (header && !document.getElementById('axyra-notifications-btn')) {
            const nav = header.querySelector('.axyra-nav');
            if (nav) {
                const notificationBtn = document.createElement('button');
                notificationBtn.id = 'axyra-notifications-btn';
                notificationBtn.className = 'axyra-btn axyra-btn-ghost axyra-notifications-btn';
                notificationBtn.innerHTML = `
                    <i class="fas fa-bell"></i>
                    <span class="axyra-notifications-count" id="axyra-notifications-count">0</span>
                `;
                notificationBtn.onclick = () => this.toggleNotificationsPanel();
                
                // Insertar antes del botón de cerrar sesión
                const logoutBtn = nav.querySelector('button[onclick="logout()"]');
                if (logoutBtn) {
                    nav.insertBefore(notificationBtn, logoutBtn);
                } else {
                    nav.appendChild(notificationBtn);
                }
            }
        }
    }

    /**
     * Crea el panel de notificaciones
     */
    createNotificationsPanel() {
        const container = document.getElementById('axyra-notifications-container');
        
        if (!document.getElementById('axyra-notifications-panel')) {
            const panel = document.createElement('div');
            panel.id = 'axyra-notifications-panel';
            panel.className = 'axyra-notifications-panel';
            panel.innerHTML = `
                <div class="axyra-notifications-header">
                    <h3><i class="fas fa-bell"></i> Notificaciones</h3>
                    <div class="axyra-notifications-actions">
                        <button class="axyra-btn axyra-btn-sm" onclick="axyraNotifications.markAllAsRead()">
                            <i class="fas fa-check-double"></i> Marcar todas como leídas
                        </button>
                        <button class="axyra-btn axyra-btn-sm axyra-btn-ghost" onclick="axyraNotifications.clearAll()">
                            <i class="fas fa-trash"></i> Limpiar todas
                        </button>
                    </div>
                </div>
                <div class="axyra-notifications-list" id="axyra-notifications-list">
                    <!-- Las notificaciones se cargan aquí dinámicamente -->
                </div>
                <div class="axyra-notifications-footer">
                    <button class="axyra-btn axyra-btn-sm axyra-btn-ghost" onclick="axyraNotifications.openSettings()">
                        <i class="fas fa-cog"></i> Configuración
                    </button>
                </div>
            `;
            
            container.appendChild(panel);
        }
    }

    /**
     * Alterna la visibilidad del panel de notificaciones
     */
    toggleNotificationsPanel() {
        const panel = document.getElementById('axyra-notifications-panel');
        if (!panel) {
            this.createNotificationsPanel();
        }
        
        const panelExists = document.getElementById('axyra-notifications-panel');
        if (panelExists) {
            panelExists.classList.toggle('active');
            this.loadNotificationsList();
        }
    }

    /**
     * Carga la lista de notificaciones en el panel
     */
    loadNotificationsList() {
        const listContainer = document.getElementById('axyra-notifications-list');
        if (!listContainer) return;

        const unreadNotifications = this.notifications.filter(n => !n.read);
        const recentNotifications = this.notifications.slice(0, 10); // Últimas 10

        if (recentNotifications.length === 0) {
            listContainer.innerHTML = `
                <div class="axyra-notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>No hay notificaciones</p>
                </div>
            `;
            return;
        }

        listContainer.innerHTML = recentNotifications.map(notification => `
            <div class="axyra-notification-item ${notification.read ? 'read' : 'unread'} ${notification.priority}" 
                 onclick="axyraNotifications.markAsRead('${notification.id}')">
                <div class="axyra-notification-icon">
                    <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="axyra-notification-content">
                    <div class="axyra-notification-title">${notification.title}</div>
                    <div class="axyra-notification-message">${notification.message}</div>
                    <div class="axyra-notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
                <div class="axyra-notification-actions">
                    ${!notification.read ? '<span class="axyra-notification-unread-dot"></span>' : ''}
                    <button class="axyra-notification-close" onclick="axyraNotifications.deleteNotification('${notification.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Crea una nueva notificación
     */
    createNotification(title, message, type = 'info', priority = 'normal', data = {}) {
        const notification = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            title,
            message,
            type,
            priority,
            data,
            timestamp: new Date(),
            read: false
        };

        this.notifications.unshift(notification);
        this.saveNotifications();
        this.updateNotificationCount();
        this.showToastNotification(notification);
        
        // Verificar si debe mostrar notificación del navegador
        if (this.settings.browserNotifications && this.settings.browserNotificationsEnabled) {
            this.showBrowserNotification(notification);
        }

        return notification;
    }

    /**
     * Muestra notificación toast
     */
    showToastNotification(notification) {
        const toast = document.createElement('div');
        toast.className = `axyra-toast-notification axyra-toast-${notification.type} axyra-toast-${notification.priority}`;
        toast.innerHTML = `
            <div class="axyra-toast-icon">
                <i class="fas ${this.getNotificationIcon(notification.type)}"></i>
            </div>
            <div class="axyra-toast-content">
                <div class="axyra-toast-title">${notification.title}</div>
                <div class="axyra-toast-message">${notification.message}</div>
            </div>
            <button class="axyra-toast-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        document.body.appendChild(toast);

        // Auto-remove después de 5 segundos
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 5000);
    }

    /**
     * Muestra notificación del navegador
     */
    async showBrowserNotification(notification) {
        if (!('Notification' in window)) return;

        if (Notification.permission === 'granted') {
            new Notification(notification.title, {
                body: notification.message,
                icon: '/frontend/logo.png',
                tag: notification.id
            });
        } else if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                this.showBrowserNotification(notification);
            }
        }
    }

    /**
     * Marca una notificación como leída
     */
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateNotificationCount();
            this.loadNotificationsList();
        }
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateNotificationCount();
        this.loadNotificationsList();
    }

    /**
     * Elimina una notificación
     */
    deleteNotification(notificationId) {
        this.notifications = this.notifications.filter(n => n.id !== notificationId);
        this.saveNotifications();
        this.updateNotificationCount();
        this.loadNotificationsList();
    }

    /**
     * Limpia todas las notificaciones
     */
    clearAll() {
        if (confirm('¿Estás seguro de que deseas eliminar todas las notificaciones?')) {
            this.notifications = [];
            this.saveNotifications();
            this.updateNotificationCount();
            this.loadNotificationsList();
        }
    }

    /**
     * Actualiza el contador de notificaciones
     */
    updateNotificationCount() {
        const countElement = document.getElementById('axyra-notifications-count');
        if (countElement) {
            const unreadCount = this.notifications.filter(n => !n.read).length;
            countElement.textContent = unreadCount;
            countElement.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    /**
     * Verifica notificaciones programadas
     */
    checkScheduledNotifications() {
        setInterval(() => {
            this.checkOverdueTasks();
            this.checkUpcomingPayments();
            this.checkHoursAlerts();
        }, 60000); // Verificar cada minuto
    }

    /**
     * Verifica tareas vencidas
     */
    checkOverdueTasks() {
        const tareas = JSON.parse(localStorage.getItem('axyra_tareas') || '[]');
        const hoy = new Date();
        
        tareas.forEach(tarea => {
            if (tarea.estado === 'pendiente' && new Date(tarea.fechaVencimiento) < hoy) {
                // Verificar si ya se creó la notificación
                const notificationExists = this.notifications.find(n => 
                    n.data.tareaId === tarea.id && n.type === 'overdue_task'
                );
                
                if (!notificationExists) {
                    this.createNotification(
                        'Tarea Vencida',
                        `La tarea "${tarea.titulo}" está vencida desde ${this.formatTime(new Date(tarea.fechaVencimiento))}`,
                        'warning',
                        'high',
                        { tareaId: tarea.id, type: 'overdue_task' }
                    );
                }
            }
        });
    }

    /**
     * Verifica pagos próximos
     */
    checkUpcomingPayments() {
        const historial = JSON.parse(localStorage.getItem('axyra_historial') || '[]');
        const hoy = new Date();
        const proximaSemana = new Date(hoy.getTime() + 7 * 24 * 60 * 60 * 1000);
        
        historial.forEach(periodo => {
            if (new Date(periodo.fechaPago) <= proximaSemana && new Date(periodo.fechaPago) > hoy) {
                const diasRestantes = Math.ceil((new Date(periodo.fechaPago) - hoy) / (1000 * 60 * 60 * 24));
                
                if (diasRestantes <= 3) {
                    this.createNotification(
                        'Pago de Nómina Próximo',
                        `El pago de nómina del período ${periodo.periodo} vence en ${diasRestantes} día(s)`,
                        'info',
                        'high',
                        { periodoId: periodo.id, type: 'upcoming_payment' }
                    );
                }
            }
        });
    }

    /**
     * Verifica alertas de horas
     */
    checkHoursAlerts() {
        const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
        const hoy = new Date();
        const inicioSemana = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        empleados.forEach(empleado => {
            const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
            const horasEmpleado = horas.filter(h => 
                h.empleadoId === empleado.id && 
                new Date(h.fecha) >= inicioSemana
            );
            
            const totalHoras = horasEmpleado.reduce((total, h) => 
                total + (h.horasOrdinarias || 0) + (h.horasNocturnas || 0) + 
                (h.horasExtras || 0) + (h.horasDominicales || 0), 0
            );
            
            if (totalHoras > 48) { // Más de 48 horas por semana
                this.createNotification(
                    'Horas Extras Excesivas',
                    `${empleado.nombre} ha trabajado ${totalHoras} horas esta semana (límite recomendado: 48h)`,
                    'warning',
                    'normal',
                    { empleadoId: empleado.id, type: 'excessive_hours' }
                );
            }
        });
    }

    /**
     * Configuración automática de refresh
     */
    setupAutoRefresh() {
        setInterval(() => {
            this.updateNotificationCount();
        }, 30000); // Actualizar cada 30 segundos
    }

    /**
     * Abre la configuración de notificaciones
     */
    openSettings() {
        const settings = `
            <div class="axyra-modal" id="axyra-notifications-settings">
                <div class="axyra-modal-content">
                    <div class="axyra-modal-header">
                        <h3><i class="fas fa-cog"></i> Configuración de Notificaciones</h3>
                        <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">×</button>
                    </div>
                    <div class="axyra-modal-body">
                        <div class="axyra-form-group">
                            <label>
                                <input type="checkbox" id="browser-notifications" ${this.settings.browserNotifications ? 'checked' : ''}>
                                Notificaciones del navegador
                            </label>
                        </div>
                        <div class="axyra-form-group">
                            <label>
                                <input type="checkbox" id="sound-notifications" ${this.settings.soundNotifications ? 'checked' : ''}>
                                Notificaciones de sonido
                            </label>
                        </div>
                        <div class="axyra-form-group">
                            <label>Frecuencia de verificación:</label>
                            <select id="check-frequency">
                                <option value="30" ${this.settings.checkFrequency === 30 ? 'selected' : ''}>30 segundos</option>
                                <option value="60" ${this.settings.checkFrequency === 60 ? 'selected' : ''}>1 minuto</option>
                                <option value="300" ${this.settings.checkFrequency === 300 ? 'selected' : ''}>5 minutos</option>
                            </select>
                        </div>
                    </div>
                    <div class="axyra-modal-footer">
                        <button class="axyra-btn" onclick="axyraNotifications.saveSettings()">Guardar</button>
                        <button class="axyra-btn axyra-btn-ghost" onclick="this.closest('.axyra-modal').remove()">Cancelar</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', settings);
    }

    /**
     * Guarda la configuración
     */
    saveSettings() {
        this.settings.browserNotifications = document.getElementById('browser-notifications').checked;
        this.settings.soundNotifications = document.getElementById('sound-notifications').checked;
        this.settings.checkFrequency = parseInt(document.getElementById('check-frequency').value);
        
        localStorage.setItem('axyra_notifications_settings', JSON.stringify(this.settings));
        
        // Cerrar modal
        document.getElementById('axyra-notifications-settings').remove();
        
        // Mostrar confirmación
        this.createNotification(
            'Configuración Guardada',
            'Las preferencias de notificaciones se han actualizado correctamente',
            'success',
            'normal'
        );
    }

    // Métodos auxiliares
    getNotificationIcon(type) {
        const icons = {
            'info': 'fa-info-circle',
            'success': 'fa-check-circle',
            'warning': 'fa-exclamation-triangle',
            'error': 'fa-times-circle',
            'overdue_task': 'fa-clock',
            'upcoming_payment': 'fa-dollar-sign',
            'excessive_hours': 'fa-hourglass-half'
        };
        return icons[type] || 'fa-bell';
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) return 'Hace un momento';
        if (diff < 3600000) return `Hace ${Math.floor(diff / 60000)} minutos`;
        if (diff < 86400000) return `Hace ${Math.floor(diff / 3600000)} horas`;
        if (diff < 604800000) return `Hace ${Math.floor(diff / 86400000)} días`;
        
        return date.toLocaleDateString('es-CO');
    }

    loadSettings() {
        const defaultSettings = {
            browserNotifications: true,
            soundNotifications: false,
            checkFrequency: 60
        };
        
        const saved = localStorage.getItem('axyra_notifications_settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    loadNotifications() {
        const saved = localStorage.getItem('axyra_notifications');
        this.notifications = saved ? JSON.parse(saved) : [];
    }

    saveNotifications() {
        localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
    }
}

// Inicializar sistema de notificaciones
let axyraNotifications;
document.addEventListener('DOMContentLoaded', () => {
    axyraNotifications = new AXYRANotificationsSystem();
});

// Exportar para uso global
window.AXYRANotificationsSystem = AXYRANotificationsSystem;
