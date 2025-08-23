// Sistema de Timeout de Sesiones AXYRA
// Monitorea la actividad del usuario y cierra la sesión automáticamente

class AxyraSessionManager {
    constructor() {
        this.timeoutDuration = 30 * 60 * 1000; // 30 minutos por defecto
        this.warningDuration = 5 * 60 * 1000; // 5 minutos de advertencia
        this.lastActivity = Date.now();
        this.timeoutTimer = null;
        this.warningTimer = null;
        this.isWarningShown = false;
        this.init();
    }

    init() {
        console.log('🔒 Inicializando Sistema de Timeout de Sesiones...');
        
        // Configurar eventos de actividad del usuario
        this.setupActivityListeners();
        
        // Iniciar monitoreo de sesión
        this.startSessionMonitoring();
        
        // Verificar configuración personalizada
        this.loadCustomTimeout();
        
        console.log('✅ Sistema de timeout configurado correctamente');
    }

    setupActivityListeners() {
        // Eventos que indican actividad del usuario
        const activityEvents = [
            'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart',
            'click', 'keydown', 'wheel', 'focus', 'blur'
        ];

        activityEvents.forEach(event => {
            document.addEventListener(event, () => this.resetActivity(), { passive: true });
        });

        // Eventos de visibilidad de página
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                this.resetActivity();
            }
        });

        // Eventos de foco de ventana
        window.addEventListener('focus', () => this.resetActivity());
        window.addEventListener('blur', () => this.resetActivity());
    }

    resetActivity() {
        this.lastActivity = Date.now();
        
        // Reiniciar timers
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }
        
        // Ocultar advertencia si estaba visible
        if (this.isWarningShown) {
            this.hideWarning();
        }
        
        // Reiniciar monitoreo
        this.startSessionMonitoring();
    }

    startSessionMonitoring() {
        // Timer para mostrar advertencia
        this.warningTimer = setTimeout(() => {
            this.showWarning();
        }, this.timeoutDuration - this.warningDuration);

        // Timer para cerrar sesión
        this.timeoutTimer = setTimeout(() => {
            this.forceLogout();
        }, this.timeoutDuration);
    }

    showWarning() {
        if (this.isWarningShown) return;
        
        this.isWarningShown = true;
        console.log('⚠️ Mostrando advertencia de timeout...');

        // Crear modal de advertencia
        const warningModal = document.createElement('div');
        warningModal.className = 'axyra-timeout-warning';
        warningModal.innerHTML = `
            <div class="axyra-timeout-content">
                <div class="axyra-timeout-header">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Sesión por Expirar</h3>
                </div>
                <div class="axyra-timeout-body">
                    <p>Tu sesión expirará en <span id="timeoutCountdown">5:00</span> minutos por inactividad.</p>
                    <p>¿Deseas continuar con tu sesión?</p>
                </div>
                <div class="axyra-timeout-actions">
                    <button class="axyra-btn axyra-btn-primary" onclick="axyraSessionManager.extendSession()">
                        <i class="fas fa-clock"></i> Extender Sesión
                    </button>
                    <button class="axyra-btn axyra-btn-secondary" onclick="axyraSessionManager.logout()">
                        <i class="fas fa-sign-out-alt"></i> Cerrar Sesión
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(warningModal);

        // Iniciar countdown
        this.startCountdown();
    }

    hideWarning() {
        this.isWarningShown = false;
        const warning = document.querySelector('.axyra-timeout-warning');
        if (warning) {
            warning.remove();
        }
    }

    startCountdown() {
        let timeLeft = this.warningDuration / 1000; // Convertir a segundos
        
        const countdownElement = document.getElementById('timeoutCountdown');
        if (!countdownElement) return;

        const countdownInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                clearInterval(countdownInterval);
                this.forceLogout();
            }
            
            timeLeft--;
        }, 1000);
    }

    extendSession() {
        console.log('✅ Sesión extendida por el usuario');
        
        // Ocultar advertencia
        this.hideWarning();
        
        // Mostrar notificación de éxito
        this.showNotification('Sesión extendida exitosamente', 'success');
        
        // Reiniciar actividad
        this.resetActivity();
    }

    logout() {
        console.log('👋 Usuario cerró sesión manualmente');
        
        // Ocultar advertencia
        this.hideWarning();
        
        // Limpiar sesión
        this.clearSession();
        
        // Redirigir al login
        window.location.href = '/login.html';
    }

    forceLogout() {
        console.log('🚫 Sesión expirada por inactividad');
        
        // Ocultar advertencia si está visible
        this.hideWarning();
        
        // Mostrar notificación
        this.showNotification('Sesión expirada por inactividad', 'warning');
        
        // Limpiar sesión
        this.clearSession();
        
        // Redirigir al login con mensaje
        setTimeout(() => {
            window.location.href = '/login.html?message=timeout';
        }, 2000);
    }

    clearSession() {
        // Limpiar localStorage
        localStorage.removeItem('axyra_isolated_user');
        localStorage.removeItem('axyra_firebase_user');
        localStorage.removeItem('axyra_session_start');
        
        // Limpiar sessionStorage
        sessionStorage.clear();
        
        // Cerrar sesión de Firebase si está disponible
        if (typeof firebase !== 'undefined' && firebase.auth) {
            firebase.auth().signOut().catch(console.error);
        }
        
        // Limpiar timers
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `axyra-notification axyra-notification-${type}`;
        notification.innerHTML = `
            <div class="axyra-notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="axyra-notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Agregar al contenedor de notificaciones o crear uno
        let container = document.querySelector('.axyra-notifications-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'axyra-notifications-container';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    loadCustomTimeout() {
        try {
            // Intentar cargar configuración personalizada
            const customTimeout = localStorage.getItem('axyra_session_timeout');
            if (customTimeout) {
                const timeout = parseInt(customTimeout);
                if (timeout > 0) {
                    this.timeoutDuration = timeout * 60 * 1000; // Convertir minutos a milisegundos
                    this.warningDuration = Math.min(5 * 60 * 1000, this.timeoutDuration / 6);
                    console.log(`⏰ Timeout personalizado configurado: ${timeout} minutos`);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error cargando configuración de timeout:', error);
        }
    }

    // Métodos públicos para configuración
    setCustomTimeout(minutes) {
        if (minutes > 0) {
            this.timeoutDuration = minutes * 60 * 1000;
            this.warningDuration = Math.min(5 * 60 * 1000, this.timeoutDuration / 6);
            localStorage.setItem('axyra_session_timeout', minutes.toString());
            
            // Reiniciar monitoreo con nueva configuración
            this.resetActivity();
            
            console.log(`⏰ Timeout configurado a ${minutes} minutos`);
            this.showNotification(`Timeout de sesión configurado a ${minutes} minutos`, 'success');
        }
    }

    getSessionInfo() {
        const now = Date.now();
        const elapsed = now - this.lastActivity;
        const remaining = this.timeoutDuration - elapsed;
        
        return {
            lastActivity: new Date(this.lastActivity).toLocaleString(),
            elapsedMinutes: Math.floor(elapsed / 60000),
            remainingMinutes: Math.floor(remaining / 60000),
            totalTimeoutMinutes: Math.floor(this.timeoutDuration / 60000)
        };
    }

    // Método para pausar/resumir el monitoreo
    pauseMonitoring() {
        if (this.timeoutTimer) {
            clearTimeout(this.timeoutTimer);
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }
        console.log('⏸️ Monitoreo de sesión pausado');
    }

    resumeMonitoring() {
        this.startSessionMonitoring();
        console.log('▶️ Monitoreo de sesión resumido');
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Inicializando gestor de sesiones...');
    window.axyraSessionManager = new AxyraSessionManager();
});

// Función global para extender sesión manualmente
window.extendSession = function() {
    if (window.axyraSessionManager) {
        window.axyraSessionManager.extendSession();
    }
};

// Función global para cerrar sesión manualmente
window.forceLogout = function() {
    if (window.axyraSessionManager) {
        window.axyraSessionManager.forceLogout();
    }
};
