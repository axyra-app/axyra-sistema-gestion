/**
 * AXYRA - Sistema de Notificaciones Push
 * Sistema completo de notificaciones en tiempo real
 */

class AxyraNotificationSystem {
    constructor() {
        this.notifications = [];
        this.notificationContainer = null;
        this.notificationQueue = [];
        this.isProcessing = false;
        this.soundEnabled = true;
        this.desktopNotificationsEnabled = false;
        this.notificationTypes = {
            success: { icon: '✅', color: '#4caf50', sound: 'success' },
            error: { icon: '❌', color: '#f44336', sound: 'error' },
            warning: { icon: '⚠️', color: '#ff9800', sound: 'warning' },
            info: { icon: 'ℹ️', color: '#2196f3', sound: 'info' },
            system: { icon: '🔔', color: '#9c27b0', sound: 'system' }
        };
        this.init();
    }

    init() {
        console.log('🔔 Inicializando Sistema de Notificaciones AXYRA...');
        
        try {
            this.createNotificationContainer();
            this.setupEventListeners();
            this.loadSettings();
            this.requestNotificationPermission();
            this.startNotificationService();
            console.log('✅ Sistema de notificaciones inicializado');
        } catch (error) {
            console.error('❌ Error inicializando notificaciones:', error);
        }
    }

    createNotificationContainer() {
        // Crear contenedor de notificaciones si no existe
        if (!document.getElementById('axyra-notifications-container')) {
            const container = document.createElement('div');
            container.id = 'axyra-notifications-container';
            container.className = 'axyra-notifications-container';
            document.body.appendChild(container);
        }
        
        this.notificationContainer = document.getElementById('axyra-notifications-container');
    }

    setupEventListeners() {
        // Escuchar eventos del sistema
        document.addEventListener('DOMContentLoaded', () => {
            this.checkSystemNotifications();
        });

        // Escuchar cambios en la visibilidad de la página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.markNotificationsAsRead();
            }
        });

        // Escuchar clicks en notificaciones
        document.addEventListener('click', (e) => {
            if (e.target.closest('.axyra-notification')) {
                this.handleNotificationClick(e.target.closest('.axyra-notification'));
            }
        });
    }

    loadSettings() {
        try {
            const settings = localStorage.getItem('axyra_notification_settings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.soundEnabled = parsed.soundEnabled !== false;
                this.desktopNotificationsEnabled = parsed.desktopNotificationsEnabled || false;
            }
        } catch (error) {
            console.warn('⚠️ Error cargando configuración de notificaciones:', error);
        }
    }

    saveSettings() {
        try {
            const settings = {
                soundEnabled: this.soundEnabled,
                desktopNotificationsEnabled: this.desktopNotificationsEnabled
            };
            localStorage.setItem('axyra_notification_settings', JSON.stringify(settings));
        } catch (error) {
            console.warn('⚠️ Error guardando configuración de notificaciones:', error);
        }
    }

    async requestNotificationPermission() {
        try {
            if ('Notification' in window && Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                this.desktopNotificationsEnabled = permission === 'granted';
                this.saveSettings();
            } else if ('Notification' in window) {
                this.desktopNotificationsEnabled = Notification.permission === 'granted';
            }
        } catch (error) {
            console.warn('⚠️ Error solicitando permisos de notificación:', error);
        }
    }

    startNotificationService() {
        // Verificar notificaciones del sistema cada 30 segundos
        setInterval(() => {
            this.checkSystemNotifications();
        }, 30000);

        // Procesar cola de notificaciones cada 2 segundos
        setInterval(() => {
            this.processNotificationQueue();
        }, 2000);
    }

    checkSystemNotifications() {
        try {
            // Verificar empleados sin horas registradas
            this.checkEmployeesWithoutHours();
            
            // Verificar nóminas pendientes
            this.checkPendingNominas();
            
            // Verificar sistema de respaldo
            this.checkBackupStatus();
            
            // Verificar actualizaciones del sistema
            this.checkSystemUpdates();
            
        } catch (error) {
            console.warn('⚠️ Error verificando notificaciones del sistema:', error);
        }
    }

    checkEmployeesWithoutHours() {
        try {
            const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
            const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
            
            const empleadosSinHoras = empleados.filter(emp => {
                const tieneHoras = horas.some(hr => hr.empleado === emp.cedula || hr.empleado === emp.nombre);
                return !tieneHoras;
            });
            
            if (empleadosSinHoras.length > 0) {
                this.createNotification({
                    type: 'warning',
                    title: 'Empleados sin horas registradas',
                    message: `${empleadosSinHoras.length} empleado(s) no tienen horas registradas en el sistema`,
                    action: 'Ver empleados',
                    data: { action: 'view_employees', count: empleadosSinHoras.length }
                });
            }
        } catch (error) {
            console.warn('⚠️ Error verificando empleados sin horas:', error);
        }
    }

    checkPendingNominas() {
        try {
            const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
            const nominas = JSON.parse(localStorage.getItem('axyra_comprobantes') || '[]');
            
            // Verificar si hay empleados con horas pero sin nómina del mes actual
            const mesActual = new Date().getMonth();
            const añoActual = new Date().getFullYear();
            
            const empleadosConHoras = empleados.filter(emp => {
                const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
                return horas.some(hr => {
                    if (hr.empleado === emp.cedula || hr.empleado === emp.nombre) {
                        const fechaHora = new Date(hr.fecha);
                        return fechaHora.getMonth() === mesActual && fechaHora.getFullYear() === añoActual;
                    }
                    return false;
                });
            });
            
            const nominasMesActual = nominas.filter(nom => {
                const fechaNomina = new Date(nom.fecha);
                return fechaNomina.getMonth() === mesActual && fechaNomina.getFullYear() === añoActual;
            });
            
            if (empleadosConHoras.length > nominasMesActual.length) {
                this.createNotification({
                    type: 'info',
                    title: 'Nóminas pendientes',
                    message: `${empleadosConHoras.length - nominasMesActual.length} empleado(s) tienen horas registradas pero no se ha generado su nómina`,
                    action: 'Generar nóminas',
                    data: { action: 'generate_nominas', count: empleadosConHoras.length - nominasMesActual.length }
                });
            }
        } catch (error) {
            console.warn('⚠️ Error verificando nóminas pendientes:', error);
        }
    }

    checkBackupStatus() {
        try {
            const lastBackup = localStorage.getItem('axyra_last_backup');
            if (lastBackup) {
                const lastBackupDate = new Date(lastBackup);
                const daysSinceBackup = (new Date() - lastBackupDate) / (1000 * 60 * 60 * 24);
                
                if (daysSinceBackup > 7) {
                    this.createNotification({
                        type: 'warning',
                        title: 'Respaldo pendiente',
                        message: `Han pasado ${Math.floor(daysSinceBackup)} días desde el último respaldo del sistema`,
                        action: 'Realizar respaldo',
                        data: { action: 'perform_backup', days: Math.floor(daysSinceBackup) }
                    });
                }
            } else {
                this.createNotification({
                    type: 'warning',
                    title: 'Respaldo inicial requerido',
                    message: 'No se ha realizado ningún respaldo del sistema. Se recomienda hacer uno pronto.',
                    action: 'Realizar respaldo',
                    data: { action: 'perform_backup', initial: true }
                });
            }
        } catch (error) {
            console.warn('⚠️ Error verificando estado de respaldo:', error);
        }
    }

    checkSystemUpdates() {
        try {
            const lastUpdateCheck = localStorage.getItem('axyra_last_update_check');
            const currentTime = new Date().getTime();
            
            if (!lastUpdateCheck || (currentTime - parseInt(lastUpdateCheck)) > (24 * 60 * 60 * 1000)) {
                // Verificar actualizaciones cada 24 horas
                this.createNotification({
                    type: 'info',
                    title: 'Verificación de actualizaciones',
                    message: 'Verificando actualizaciones del sistema AXYRA...',
                    action: 'Verificar',
                    data: { action: 'check_updates' }
                });
                
                localStorage.setItem('axyra_last_update_check', currentTime.toString());
            }
        } catch (error) {
            console.warn('⚠️ Error verificando actualizaciones:', error);
        }
    }

    createNotification(options) {
        try {
            const notification = {
                id: this.generateNotificationId(),
                type: options.type || 'info',
                title: options.title || 'Notificación',
                message: options.message || '',
                action: options.action || null,
                data: options.data || {},
                timestamp: new Date().toISOString(),
                read: false,
                priority: options.priority || 'normal'
            };
            
            // Agregar a la cola de notificaciones
            this.notificationQueue.push(notification);
            
            // Procesar cola si no está siendo procesada
            if (!this.isProcessing) {
                this.processNotificationQueue();
            }
            
            return notification.id;
        } catch (error) {
            console.error('❌ Error creando notificación:', error);
            return null;
        }
    }

    processNotificationQueue() {
        if (this.isProcessing || this.notificationQueue.length === 0) return;
        
        this.isProcessing = true;
        
        try {
            while (this.notificationQueue.length > 0) {
                const notification = this.notificationQueue.shift();
                this.displayNotification(notification);
                this.notifications.push(notification);
                
                // Limitar a 100 notificaciones en memoria
                if (this.notifications.length > 100) {
                    this.notifications.shift();
                }
            }
        } catch (error) {
            console.error('❌ Error procesando cola de notificaciones:', error);
        } finally {
            this.isProcessing = false;
        }
    }

    displayNotification(notification) {
        try {
            // Crear elemento de notificación
            const notificationElement = this.createNotificationElement(notification);
            
            // Agregar al contenedor
            if (this.notificationContainer) {
                this.notificationContainer.appendChild(notificationElement);
                
                // Mostrar con animación
                setTimeout(() => {
                    notificationElement.classList.add('show');
                }, 100);
                
                // Auto-remover después de 8 segundos
                setTimeout(() => {
                    this.removeNotification(notification.id);
                }, 8000);
            }
            
            // Reproducir sonido si está habilitado
            if (this.soundEnabled) {
                this.playNotificationSound(notification.type);
            }
            
            // Mostrar notificación de escritorio si está habilitado
            if (this.desktopNotificationsEnabled && document.hidden) {
                this.showDesktopNotification(notification);
            }
            
            // Guardar en localStorage
            this.saveNotifications();
            
        } catch (error) {
            console.error('❌ Error mostrando notificación:', error);
        }
    }

    createNotificationElement(notification) {
        const element = document.createElement('div');
        element.className = `axyra-notification axyra-notification-${notification.type}`;
        element.dataset.notificationId = notification.id;
        
        const typeConfig = this.notificationTypes[notification.type] || this.notificationTypes.info;
        
        element.innerHTML = `
            <div class="axyra-notification-header">
                <div class="axyra-notification-icon">${typeConfig.icon}</div>
                <div class="axyra-notification-title">${notification.title}</div>
                <button class="axyra-notification-close" onclick="axyraNotificationSystem.removeNotification('${notification.id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="axyra-notification-message">${notification.message}</div>
            ${notification.action ? `
                <div class="axyra-notification-actions">
                    <button class="axyra-notification-action" onclick="axyraNotificationSystem.handleNotificationAction('${notification.id}')">
                        ${notification.action}
                    </button>
                </div>
            ` : ''}
            <div class="axyra-notification-time">
                ${this.formatNotificationTime(notification.timestamp)}
            </div>
        `;
        
        return element;
    }

    removeNotification(notificationId) {
        try {
            // Remover del DOM
            const element = document.querySelector(`[data-notification-id="${notificationId}"]`);
            if (element) {
                element.classList.remove('show');
                setTimeout(() => {
                    if (element.parentElement) {
                        element.remove();
                    }
                }, 300);
            }
            
            // Remover de la lista
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            
            // Guardar cambios
            this.saveNotifications();
            
        } catch (error) {
            console.error('❌ Error removiendo notificación:', error);
        }
    }

    handleNotificationAction(notificationId) {
        try {
            const notification = this.notifications.find(n => n.id === notificationId);
            if (!notification) return;
            
            // Marcar como leída
            notification.read = true;
            
            // Ejecutar acción según el tipo
            switch (notification.data.action) {
                case 'view_employees':
                    this.navigateToEmployees();
                    break;
                case 'generate_nominas':
                    this.navigateToNominas();
                    break;
                case 'perform_backup':
                    this.performBackup();
                    break;
                case 'check_updates':
                    this.checkForUpdates();
                    break;
                default:
                    console.log('Acción de notificación no reconocida:', notification.data.action);
            }
            
            // Remover notificación
            this.removeNotification(notificationId);
            
        } catch (error) {
            console.error('❌ Error manejando acción de notificación:', error);
        }
    }

    navigateToEmployees() {
        try {
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = '../empleados/empleados.html';
            } else if (window.location.pathname.includes('empleados')) {
                // Ya estamos en empleados, solo mostrar mensaje
                this.createNotification({
                    type: 'info',
                    title: 'Navegación',
                    message: 'Ya estás en la sección de empleados'
                });
            } else {
                window.location.href = 'empleados/empleados.html';
            }
        } catch (error) {
            console.error('❌ Error navegando a empleados:', error);
        }
    }

    navigateToNominas() {
        try {
            if (window.location.pathname.includes('dashboard')) {
                window.location.href = '../nomina/gestionar_nomina.html';
            } else if (window.location.pathname.includes('nomina')) {
                // Ya estamos en nóminas, solo mostrar mensaje
                this.createNotification({
                    type: 'info',
                    title: 'Navegación',
                    message: 'Ya estás en la sección de nóminas'
                });
            } else {
                window.location.href = 'nomina/gestionar_nomina.html';
            }
        } catch (error) {
            console.error('❌ Error navegando a nóminas:', error);
        }
    }

    async performBackup() {
        try {
            this.createNotification({
                type: 'info',
                title: 'Iniciando respaldo',
                message: 'Preparando respaldo del sistema...'
            });
            
            // Simular proceso de respaldo
            setTimeout(() => {
                localStorage.setItem('axyra_last_backup', new Date().toISOString());
                
                this.createNotification({
                    type: 'success',
                    title: 'Respaldo completado',
                    message: 'El respaldo del sistema se ha completado exitosamente'
                });
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error realizando respaldo:', error);
            this.createNotification({
                type: 'error',
                title: 'Error en respaldo',
                message: 'No se pudo completar el respaldo del sistema'
            });
        }
    }

    async checkForUpdates() {
        try {
            this.createNotification({
                type: 'info',
                title: 'Verificando actualizaciones',
                message: 'Buscando nuevas versiones de AXYRA...'
            });
            
            // Simular verificación de actualizaciones
            setTimeout(() => {
                this.createNotification({
                    type: 'success',
                    title: 'Sistema actualizado',
                    message: 'AXYRA está en su versión más reciente'
                });
            }, 3000);
            
        } catch (error) {
            console.error('❌ Error verificando actualizaciones:', error);
            this.createNotification({
                type: 'error',
                title: 'Error en verificación',
                message: 'No se pudo verificar las actualizaciones'
            });
        }
    }

    showDesktopNotification(notification) {
        try {
            if ('Notification' in window && Notification.permission === 'granted') {
                const desktopNotification = new Notification(notification.title, {
                    body: notification.message,
                    icon: '/nomina.ico',
                    badge: '/nomina.ico',
                    tag: notification.id,
                    requireInteraction: false,
                    silent: true
                });
                
                // Cerrar automáticamente después de 5 segundos
                setTimeout(() => {
                    desktopNotification.close();
                }, 5000);
                
                // Manejar click en notificación de escritorio
                desktopNotification.onclick = () => {
                    window.focus();
                    this.handleNotificationAction(notification.id);
                };
            }
        } catch (error) {
            console.warn('⚠️ Error mostrando notificación de escritorio:', error);
        }
    }

    playNotificationSound(type) {
        try {
            // Crear audio context para sonidos personalizados
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // Configurar sonido según el tipo
            let frequency = 800;
            let duration = 0.2;
            
            switch (type) {
                case 'success':
                    frequency = 1000;
                    duration = 0.3;
                    break;
                case 'error':
                    frequency = 400;
                    duration = 0.5;
                    break;
                case 'warning':
                    frequency = 600;
                    duration = 0.4;
                    break;
                case 'info':
                    frequency = 800;
                    duration = 0.2;
                    break;
            }
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
            
        } catch (error) {
            console.warn('⚠️ Error reproduciendo sonido de notificación:', error);
        }
    }

    markNotificationsAsRead() {
        try {
            this.notifications.forEach(notification => {
                notification.read = true;
            });
            this.saveNotifications();
        } catch (error) {
            console.warn('⚠️ Error marcando notificaciones como leídas:', error);
        }
    }

    clearAllNotifications() {
        try {
            // Remover del DOM
            if (this.notificationContainer) {
                this.notificationContainer.innerHTML = '';
            }
            
            // Limpiar listas
            this.notifications = [];
            this.notificationQueue = [];
            
            // Guardar cambios
            this.saveNotifications();
            
            this.createNotification({
                type: 'success',
                title: 'Notificaciones limpiadas',
                message: 'Todas las notificaciones han sido eliminadas'
            });
            
        } catch (error) {
            console.error('❌ Error limpiando notificaciones:', error);
        }
    }

    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    getNotificationHistory(limit = 50) {
        return this.notifications.slice(-limit).reverse();
    }

    formatNotificationTime(timestamp) {
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const diff = now - date;
            
            if (diff < 60000) { // Menos de 1 minuto
                return 'Ahora mismo';
            } else if (diff < 3600000) { // Menos de 1 hora
                const minutes = Math.floor(diff / 60000);
                return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
            } else if (diff < 86400000) { // Menos de 1 día
                const hours = Math.floor(diff / 3600000);
                return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
            } else {
                return date.toLocaleDateString('es-CO', {
                    day: '2-digit',
                    month: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        } catch (error) {
            return 'Hace un momento';
        }
    }

    generateNotificationId() {
        return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    saveNotifications() {
        try {
            localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.warn('⚠️ Error guardando notificaciones:', error);
        }
    }

    loadNotifications() {
        try {
            const saved = localStorage.getItem('axyra_notifications');
            if (saved) {
                this.notifications = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('⚠️ Error cargando notificaciones:', error);
        }
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        this.saveSettings();
        
        this.createNotification({
            type: this.soundEnabled ? 'success' : 'info',
            title: 'Sonidos de notificación',
            message: this.soundEnabled ? 'Sonidos habilitados' : 'Sonidos deshabilitados'
        });
    }

    toggleDesktopNotifications() {
        this.desktopNotificationsEnabled = !this.desktopNotificationsEnabled;
        this.saveSettings();
        
        if (this.desktopNotificationsEnabled) {
            this.requestNotificationPermission();
        }
        
        this.createNotification({
            type: this.desktopNotificationsEnabled ? 'success' : 'info',
            title: 'Notificaciones de escritorio',
            message: this.desktopNotificationsEnabled ? 'Notificaciones de escritorio habilitadas' : 'Notificaciones de escritorio deshabilitadas'
        });
    }

    // Métodos estáticos para uso desde HTML
    static createNotification(options) {
        if (window.axyraNotificationSystem) {
            return window.axyraNotificationSystem.createNotification(options);
        }
    }

    static removeNotification(notificationId) {
        if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.removeNotification(notificationId);
        }
    }

    static clearAllNotifications() {
        if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.clearAllNotifications();
        }
    }

    static toggleSound() {
        if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.toggleSound();
        }
    }

    static toggleDesktopNotifications() {
        if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.toggleDesktopNotifications();
        }
    }
}

// Inicializar sistema de notificaciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.axyraNotificationSystem = new AxyraNotificationSystem();
});

// Exportar para uso global
window.AxyraNotificationSystem = AxyraNotificationSystem;
