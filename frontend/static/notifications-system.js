/**
 * Sistema de Notificaciones AXYRA
 * Sistema completo y robusto de notificaciones push
 */

class AxyraNotificationSystem {
    constructor() {
        this.notifications = [];
        this.isInitialized = false;
        this.notificationInterval = null;
        this.lastNotificationTime = 0;
        this.notificationCooldown = 10 * 60 * 1000; // 10 minutos en milisegundos
        
        this.init();
    }

    async init() {
        try {
            // Verificar si las notificaciones están soportadas
            if (!('Notification' in window)) {
                console.warn('Este navegador no soporta notificaciones push');
                return;
            }

            // Solicitar permisos si no están otorgados
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    console.warn('Permisos de notificación denegados');
                    return;
                }
            }

            // Inicializar el sistema
            this.isInitialized = true;
            this.setupNotificationInterval();
            this.loadStoredNotifications();
            this.renderNotifications();
            
            console.log('Sistema de notificaciones AXYRA inicializado');
        } catch (error) {
            console.error('Error inicializando sistema de notificaciones:', error);
        }
    }

    setupNotificationInterval() {
        // Limpiar intervalo existente
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
        }

        // Configurar intervalo de 10 minutos
        this.notificationInterval = setInterval(() => {
            this.checkAndSendNotifications();
        }, this.notificationCooldown);

        // Ejecutar inmediatamente la primera vez
        this.checkAndSendNotifications();
    }

    checkAndSendNotifications() {
        const now = Date.now();
        
        // Verificar si ha pasado suficiente tiempo desde la última notificación
        if (now - this.lastNotificationTime < this.notificationCooldown) {
            return;
        }

        this.generateSystemNotifications();
        this.lastNotificationTime = now;
    }

    generateSystemNotifications() {
        try {
            // Obtener datos del sistema
            const empleados = this.getDataFromStorage('axyra_empleados') || [];
            const horas = this.getDataFromStorage('axyra_horas') || [];
            const nominas = this.getDataFromStorage('axyra_nominas') || [];
            const cuadres = this.getDataFromStorage('axyra_cuadres') || [];
            const config = this.getDataFromStorage('axyra_config_empresa') || {};

            // Generar notificaciones del sistema
            const systemNotifications = [];

            // Verificar empleados sin horas registradas
            const empleadosSinHoras = empleados.filter(emp => {
                const tieneHoras = horas.some(h => h.cedula === emp.cedula);
                return !tieneHoras;
            });

            if (empleadosSinHoras.length > 0) {
                systemNotifications.push({
                    id: 'empleados_sin_horas',
                    type: 'warning',
                    title: 'Empleados sin horas registradas',
                    message: `${empleadosSinHoras.length} empleado(s) no tienen horas registradas en el sistema`,
                    action: 'Ver empleados',
                    timestamp: Date.now(),
                    data: { empleados: empleadosSinHoras }
                });
            }

            // Verificar respaldo del sistema
            const ultimoRespaldo = this.getDataFromStorage('axyra_ultimo_respaldo');
            const diasSinRespaldo = ultimoRespaldo ? 
                Math.floor((Date.now() - ultimoRespaldo) / (1000 * 60 * 60 * 24)) : 30;

            if (diasSinRespaldo > 7) {
                systemNotifications.push({
                    id: 'respaldo_requerido',
                    type: 'info',
                    title: 'Respaldo inicial requerido',
                    message: 'No se ha realizado ningún respaldo del sistema. Se recomienda hacer uno pronto.',
                    action: 'Realizar respaldo',
                    timestamp: Date.now(),
                    data: { diasSinRespaldo }
                });
            }

            // Verificar nóminas pendientes
            const quincenaActual = this.obtenerQuincenaActual();
            const nominasPendientes = empleados.filter(emp => {
                const tieneNomina = nominas.some(n => 
                    n.cedula === emp.cedula && n.quincena === quincenaActual
                );
                return !tieneNomina;
            });

            if (nominasPendientes.length > 0) {
                systemNotifications.push({
                    id: 'nominas_pendientes',
                    type: 'info',
                    title: 'Nóminas pendientes',
                    message: `${nominasPendientes.length} empleado(s) tienen nóminas pendientes para la quincena actual`,
                    action: 'Generar nóminas',
                    timestamp: Date.now(),
                    data: { empleados: nominasPendientes, quincena: quincenaActual }
                });
            }

            // Agregar notificaciones del sistema
            systemNotifications.forEach(notification => {
                this.addNotification(notification);
            });

        } catch (error) {
            console.error('Error generando notificaciones del sistema:', error);
        }
    }

    obtenerQuincenaActual() {
        const hoy = new Date();
        const dia = hoy.getDate();
        return dia <= 15 ? 1 : 2;
    }

    getDataFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error(`Error obteniendo datos de ${key}:`, error);
            return null;
        }
    }

    addNotification(notification) {
        try {
            // Generar ID único si no existe
            if (!notification.id) {
                notification.id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            }

            // Agregar timestamp si no existe
            if (!notification.timestamp) {
                notification.timestamp = Date.now();
            }

            // Agregar a la lista
            this.notifications.unshift(notification);

            // Limitar a 50 notificaciones
            if (this.notifications.length > 50) {
                this.notifications = this.notifications.slice(0, 50);
            }

            // Guardar en localStorage
            this.saveNotifications();

            // Renderizar
            this.renderNotifications();

            // Enviar notificación push si está permitido
            this.sendPushNotification(notification);

            // Reproducir sonido
            this.playNotificationSound(notification.type);

            return notification.id;
        } catch (error) {
            console.error('Error agregando notificación:', error);
        }
    }

    sendPushNotification(notification) {
        try {
            if (Notification.permission === 'granted' && this.isInitialized) {
                const pushNotification = new Notification(notification.title, {
                    body: notification.message,
                    icon: '/static/logo.png',
                    badge: '/static/logo.png',
                    tag: notification.id,
                    requireInteraction: notification.type === 'error',
                    actions: notification.action ? [
                        {
                            action: 'view',
                            title: notification.action
                        }
                    ] : []
                });

                // Manejar clics en la notificación
                pushNotification.onclick = () => {
                    window.focus();
                    this.handleNotificationAction(notification);
                };

                // Auto-cerrar después de 5 segundos (excepto errores)
                if (notification.type !== 'error') {
                    setTimeout(() => {
                        pushNotification.close();
                    }, 5000);
                }
            }
        } catch (error) {
            console.error('Error enviando notificación push:', error);
        }
    }

    playNotificationSound(type) {
        try {
            const audio = new Audio();
            
            switch (type) {
                case 'error':
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
                    break;
                case 'warning':
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
                    break;
                default:
                    audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
            }

            audio.volume = 0.3;
            audio.play().catch(e => console.log('No se pudo reproducir sonido:', e));
        } catch (error) {
            console.error('Error reproduciendo sonido:', error);
        }
    }

    handleNotificationAction(notification) {
        try {
            switch (notification.id) {
                case 'empleados_sin_horas':
                    window.location.href = '../empleados/empleados.html';
                    break;
                case 'respaldo_requerido':
                    // Implementar lógica de respaldo
                    console.log('Iniciando respaldo del sistema...');
                    break;
                case 'nominas_pendientes':
                    window.location.href = '../nomina/nomina.html';
                    break;
                default:
                    console.log('Acción no implementada para:', notification.id);
            }
        } catch (error) {
            console.error('Error manejando acción de notificación:', error);
        }
    }

    renderNotifications() {
        try {
            const container = document.getElementById('notificationsContainer');
            if (!container) return;

            // Limpiar contenedor
            container.innerHTML = '';

            // Renderizar notificaciones
            this.notifications.slice(0, 5).forEach(notification => {
                const notificationElement = this.createNotificationElement(notification);
                container.appendChild(notificationElement);
            });

            // Actualizar badge
            this.updateNotificationBadge();
        } catch (error) {
            console.error('Error renderizando notificaciones:', error);
        }
    }

    createNotificationElement(notification) {
        try {
            const element = document.createElement('div');
            element.className = `axyra-notification axyra-notification-${notification.type}`;
            element.setAttribute('data-notification-id', notification.id);

            const timeAgo = this.getTimeAgo(notification.timestamp);

            element.innerHTML = `
                <div class="axyra-notification-header">
                    <span class="axyra-notification-title">${notification.title}</span>
                    <button class="axyra-notification-close" onclick="axyraNotifications.dismissNotification('${notification.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="axyra-notification-body">
                    <p class="axyra-notification-message">${notification.message}</p>
                    ${notification.action ? `
                        <button class="axyra-notification-action" onclick="axyraNotifications.handleNotificationAction('${notification.id}')">
                            ${notification.action}
                        </button>
                    ` : ''}
                </div>
                <div class="axyra-notification-footer">
                    <span class="axyra-notification-time">${timeAgo}</span>
                </div>
            `;

            return element;
        } catch (error) {
            console.error('Error creando elemento de notificación:', error);
            return document.createElement('div');
        }
    }

    getTimeAgo(timestamp) {
        try {
            const now = Date.now();
            const diff = now - timestamp;
            const minutes = Math.floor(diff / (1000 * 60));
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));

            if (minutes < 1) return 'Ahora mismo';
            if (minutes < 60) return `Hace ${minutes} minuto(s)`;
            if (hours < 24) return `Hace ${hours} hora(s)`;
            return `Hace ${days} día(s)`;
        } catch (error) {
            return 'Reciente';
        }
    }

    updateNotificationBadge() {
        try {
            const badge = document.getElementById('notificationBadge');
            if (badge) {
                const unreadCount = this.notifications.filter(n => !n.read).length;
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
                badge.style.display = unreadCount > 0 ? 'block' : 'none';
            }
        } catch (error) {
            console.error('Error actualizando badge de notificaciones:', error);
        }
    }

    dismissNotification(notificationId) {
        try {
            this.notifications = this.notifications.filter(n => n.id !== notificationId);
            this.saveNotifications();
            this.renderNotifications();
        } catch (error) {
            console.error('Error descartando notificación:', error);
        }
    }

    markAsRead(notificationId) {
        try {
            const notification = this.notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.read = true;
                this.saveNotifications();
                this.renderNotifications();
            }
        } catch (error) {
            console.error('Error marcando notificación como leída:', error);
        }
    }

    clearAllNotifications() {
        try {
            this.notifications = [];
            this.saveNotifications();
            this.renderNotifications();
        } catch (error) {
            console.error('Error limpiando notificaciones:', error);
        }
    }

    saveNotifications() {
        try {
            localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error guardando notificaciones:', error);
        }
    }

    loadStoredNotifications() {
        try {
            const stored = localStorage.getItem('axyra_notifications');
            if (stored) {
                this.notifications = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error cargando notificaciones almacenadas:', error);
            this.notifications = [];
        }
    }

    // Métodos públicos para uso externo
    showSuccess(message, title = 'Éxito') {
        return this.addNotification({
            type: 'success',
            title: title,
            message: message
        });
    }

    showError(message, title = 'Error') {
        return this.addNotification({
            type: 'error',
            title: title,
            message: message
        });
    }

    showWarning(message, title = 'Advertencia') {
        return this.addNotification({
            type: 'warning',
            title: title,
            message: message
        });
    }

    showInfo(message, title = 'Información') {
        return this.addNotification({
            type: 'info',
            title: title,
            message: message
        });
    }

    // Método para mostrar mensaje temporal
    showMessage(message, type = 'info', duration = 3000) {
        try {
            const messageElement = document.createElement('div');
            messageElement.className = `axyra-temp-message axyra-temp-message-${type}`;
            messageElement.textContent = message;

            // Agregar al DOM
            document.body.appendChild(messageElement);

            // Mostrar con animación
            setTimeout(() => {
                messageElement.classList.add('axyra-temp-message-show');
            }, 100);

            // Ocultar después del tiempo especificado
            setTimeout(() => {
                messageElement.classList.remove('axyra-temp-message-show');
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.parentNode.removeChild(messageElement);
                    }
                }, 300);
            }, duration);

        } catch (error) {
            console.error('Error mostrando mensaje temporal:', error);
        }
    }

    destroy() {
        try {
            if (this.notificationInterval) {
                clearInterval(this.notificationInterval);
                this.notificationInterval = null;
            }
        } catch (error) {
            console.error('Error destruyendo sistema de notificaciones:', error);
        }
    }
}

// Inicializar sistema globalmente
let axyraNotifications;

// Función para inicializar el sistema
function initializeAxyraNotifications() {
    if (!axyraNotifications) {
        axyraNotifications = new AxyraNotificationSystem();
        
        // Hacer disponible globalmente
        window.axyraNotifications = axyraNotifications;
        
        // Agregar al objeto global de AXYRA
        if (!window.AXYRA) window.AXYRA = {};
        window.AXYRA.notifications = axyraNotifications;
    }
    return axyraNotifications;
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAxyraNotifications);
} else {
    initializeAxyraNotifications();
}

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxyraNotificationSystem;
}
