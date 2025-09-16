/**
 * AXYRA PayPal Integration - Versión Simple y Robusta
 * Sistema de integración PayPal optimizado para producción
 */

class AxyraPayPalIntegrationSimple {
    constructor() {
        this.config = {
            clientId: 'AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw',
            environment: 'sandbox', // Cambiar a 'production' cuando esté listo
            currency: 'USD',
            locale: 'es_ES'
        };
        
        this.isLoaded = false;
        this.isLoading = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        
        this.init();
    }

    async init() {
        try {
            await this.loadPayPalSDK();
            this.setupErrorHandling();
            console.log('✅ PayPal Integration Simple inicializado');
        } catch (error) {
            console.warn('⚠️ Error inicializando PayPal:', error.message);
            this.disablePayPal();
        }
    }

    async loadPayPalSDK() {
        return new Promise((resolve, reject) => {
            if (this.isLoaded) {
                resolve();
                return;
            }

            if (this.isLoading) {
                // Esperar a que termine la carga actual
                const checkLoaded = setInterval(() => {
                    if (this.isLoaded) {
                        clearInterval(checkLoaded);
                        resolve();
                    } else if (!this.isLoading) {
                        clearInterval(checkLoaded);
                        reject(new Error('Carga cancelada'));
                    }
                }, 100);
                return;
            }

            this.isLoading = true;

            // URL simple sin parámetros problemáticos
            const baseUrl = this.config.environment === 'production' 
                ? 'https://www.paypal.com' 
                : 'https://www.sandbox.paypal.com';
            
            const script = document.createElement('script');
            script.src = `${baseUrl}/sdk/js?client-id=${this.config.clientId}`;
            script.async = true;
            script.defer = true;

            script.onload = () => {
                this.isLoaded = true;
                this.isLoading = false;
                this.retryCount = 0;
                resolve();
            };

            script.onerror = (error) => {
                this.isLoading = false;
                this.retryCount++;
                
                if (this.retryCount < this.maxRetries) {
                    console.warn(`⚠️ Intento ${this.retryCount} falló, reintentando...`);
                    setTimeout(() => {
                        this.loadPayPalSDK().then(resolve).catch(reject);
                    }, 1000 * this.retryCount);
                } else {
                    console.error('❌ PayPal SDK no se pudo cargar después de múltiples intentos');
                    this.disablePayPal();
                    reject(new Error('PayPal SDK no disponible'));
                }
            };

            document.head.appendChild(script);
        });
    }

    setupErrorHandling() {
        // Capturar errores de extensiones del navegador
        window.addEventListener('error', (event) => {
            if (event.message && event.message.includes('Cannot determine language')) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        });

        // Capturar errores de promesas no manejadas
        window.addEventListener('unhandledrejection', (event) => {
            if (event.reason && event.reason.message && 
                event.reason.message.includes('Cannot determine language')) {
                event.preventDefault();
                return false;
            }
        });
    }

    disablePayPal() {
        this.isLoaded = false;
        this.isLoading = false;
        
        // Ocultar botones de PayPal en la UI
        const paypalButtons = document.querySelectorAll('.paypal-btn, [data-method="paypal"]');
        paypalButtons.forEach(button => {
            button.style.display = 'none';
        });
        
        console.warn('⚠️ PayPal deshabilitado temporalmente');
    }

    async createPayment(amount, description, planType, userId) {
        if (!this.isLoaded) {
            throw new Error('PayPal SDK no está cargado');
        }

        try {
            const response = await fetch('/api/processPayPalPayment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: amount,
                    description: description,
                    planType: planType,
                    userId: userId,
                    currency: this.config.currency
                })
            });

            if (!response.ok) {
                throw new Error('Error en el servidor');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error creando pago PayPal:', error);
            throw error;
        }
    }

    async processPayment(amount, description, planType, userId) {
        try {
            if (!this.isLoaded) {
                throw new Error('PayPal no está disponible');
            }

            // Crear pago
            const paymentData = await this.createPayment(amount, description, planType, userId);
            
            // Mostrar botón de PayPal
            this.renderPayPalButton(paymentData, planType, userId);
            
        } catch (error) {
            console.error('Error procesando pago PayPal:', error);
            throw error;
        }
    }

    renderPayPalButton(paymentData, planType, userId) {
        const container = document.getElementById('paypal-button-container');
        if (!container) return;

        container.innerHTML = '';

        if (window.paypal && window.paypal.Buttons) {
            window.paypal.Buttons({
                createOrder: (data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: paymentData.amount,
                                currency_code: this.config.currency
                            },
                            description: paymentData.description
                        }]
                    });
                },
                onApprove: async (data, actions) => {
                    try {
                        const order = await actions.order.capture();
                        
                        // Emitir evento de pago exitoso
                        window.dispatchEvent(new CustomEvent('plan-updated', {
                            detail: { planType, order }
                        }));
                        
                        // Mostrar mensaje de éxito
                        this.showSuccessMessage('¡Pago procesado exitosamente!');
                        
                    } catch (error) {
                        console.error('Error capturando orden:', error);
                        this.showErrorMessage('Error procesando el pago');
                    }
                },
                onError: (error) => {
                    console.error('Error en PayPal:', error);
                    this.showErrorMessage('Error en el proceso de pago');
                }
            }).render('#paypal-button-container');
        }
    }

    showSuccessMessage(message) {
        // Crear notificación de éxito
        const notification = document.createElement('div');
        notification.className = 'paypal-success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showErrorMessage(message) {
        // Crear notificación de error
        const notification = document.createElement('div');
        notification.className = 'paypal-error-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-exclamation-circle"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.axyraPayPalSimple = new AxyraPayPalIntegrationSimple();
});

// Agregar estilos CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .paypal-success-notification,
    .paypal-error-notification {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-content i {
        font-size: 18px;
    }
`;
document.head.appendChild(style);
