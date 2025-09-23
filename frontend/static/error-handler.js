/**
 * 🛠️ MANEJADOR DE ERRORES AXYRA
 * Sistema centralizado para manejo de errores
 */

class AxyraErrorHandler {
    constructor() {
        this.errors = [];
        this.maxErrors = 100;
        this.init();
    }

    init() {
        // Capturar errores globales
        window.addEventListener('error', (event) => {
            this.handleError('Global Error', event.error);
        });

        // Capturar errores de promesas no manejadas
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('Unhandled Promise Rejection', event.reason);
        });

        console.log('🛠️ Manejador de errores AXYRA inicializado');
    }

    handleError(type, error) {
        const errorInfo = {
            type,
            message: error?.message || error?.toString() || 'Error desconocido',
            stack: error?.stack || '',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        };

        this.errors.push(errorInfo);

        // Mantener solo los últimos errores
        if (this.errors.length > this.maxErrors) {
            this.errors = this.errors.slice(-this.maxErrors);
        }

        // Log del error
        console.error(`❌ ${type}:`, errorInfo.message);

        // Mostrar notificación al usuario si es crítico
        if (this.isCriticalError(errorInfo)) {
            this.showUserNotification(errorInfo);
        }
    }

    isCriticalError(errorInfo) {
        const criticalPatterns = [
            'Cannot determine language',
            'PayPal SDK no se pudo cargar',
            'Firebase no está disponible',
            'Network error',
            'Failed to fetch'
        ];

        return criticalPatterns.some(pattern => 
            errorInfo.message.toLowerCase().includes(pattern.toLowerCase())
        );
    }

    showUserNotification(errorInfo) {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 15px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        notification.innerHTML = `
            <strong>⚠️ Error del Sistema</strong><br>
            ${this.getUserFriendlyMessage(errorInfo.message)}
            <button onclick="this.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                float: right;
                font-size: 18px;
                cursor: pointer;
            ">×</button>
        `;

        document.body.appendChild(notification);

        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    getUserFriendlyMessage(errorMessage) {
        const messages = {
            'Cannot determine language': 'Error de idioma detectado. Recargando...',
            'PayPal SDK no se pudo cargar': 'PayPal temporalmente no disponible. Usando Wompi.',
            'Firebase no está disponible': 'Modo offline activado. Los datos se sincronizarán cuando se restablezca la conexión.',
            'Network error': 'Error de conexión. Verificando conectividad...',
            'Failed to fetch': 'Error de red. Intentando reconectar...'
        };

        for (const [pattern, message] of Object.entries(messages)) {
            if (errorMessage.toLowerCase().includes(pattern.toLowerCase())) {
                return message;
            }
        }

        return 'Se ha detectado un error. El sistema continuará funcionando.';
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
        console.log('🧹 Errores limpiados');
    }

    // Método para manejar errores específicos de PayPal
    handlePayPalError(error) {
        console.warn('⚠️ Error de PayPal:', error.message);
        
        // Deshabilitar PayPal temporalmente
        if (window.axyraPayPalIntegration) {
            window.axyraPayPalIntegration.disablePayPal();
        }

        // Mostrar notificación al usuario
        this.showUserNotification({
            type: 'PayPal Error',
            message: error.message,
            stack: error.stack || '',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }

    // Método para manejar errores específicos de Firebase
    handleFirebaseError(error) {
        console.warn('⚠️ Error de Firebase:', error.message);
        
        // Activar modo offline
        if (window.axyraFirebaseUtils) {
            window.axyraFirebaseUtils.setOfflineMode(true);
        }

        // Mostrar notificación al usuario
        this.showUserNotification({
            type: 'Firebase Error',
            message: error.message,
            stack: error.stack || '',
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }
}

// Inicializar el manejador de errores
window.axyraErrorHandler = new AxyraErrorHandler();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxyraErrorHandler;
}
