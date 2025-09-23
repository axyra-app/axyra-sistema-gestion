// ========================================
// INTEGRACIÓN REAL CON WOMPI - AXYRA
// ========================================
// Sistema completo de pagos con Wompi para producción

class AxyraWompiIntegration {
    constructor() {
        this.publicKey = process.env.WOMPI_PUBLIC_KEY || 'pub_test_xxxxxxxxx';
        this.privateKey = process.env.WOMPI_PRIVATE_KEY || 'prv_test_xxxxxxxxx';
        this.environment = process.env.WOMPI_ENVIRONMENT || 'sandbox';
        this.baseUrl = this.environment === 'production' 
            ? 'https://production.wompi.co/v1'
            : 'https://sandbox.wompi.co/v1';
        
        this.init();
    }

    init() {
        console.log('💳 Inicializando integración real con Wompi...');
        this.loadWompiSDK();
        this.setupEventListeners();
        console.log('✅ Integración Wompi inicializada');
    }

    loadWompiSDK() {
        if (window.WompiWidget) {
            console.log('✅ Wompi SDK ya cargado');
            return;
        }

        const script = document.createElement('script');
        script.src = `${this.baseUrl}/widget.js`;
        script.async = true;
        script.onload = () => {
            console.log('✅ Wompi SDK cargado correctamente');
            this.initializeWompiWidget();
        };
        script.onerror = () => {
            console.error('❌ Error cargando Wompi SDK');
            this.showError('No se pudo cargar el sistema de pagos. Intenta recargar la página.');
        };
        document.head.appendChild(script);
    }

    initializeWompiWidget() {
        if (window.WompiWidget) {
            window.WompiWidget.init({
                publicKey: this.publicKey,
                environment: this.environment
            });
            console.log('✅ Widget de Wompi inicializado');
        }
    }

    setupEventListeners() {
        // Event listeners para botones de pago
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-wompi-payment]')) {
                e.preventDefault();
                const planId = e.target.dataset.plan;
                this.initiatePayment(planId);
            }
        });
    }

    async initiatePayment(planId) {
        try {
            console.log(`💳 Iniciando pago para plan: ${planId}`);
            
            if (!window.axyraAuthSystem || !window.axyraAuthSystem.currentUser) {
                this.showError('Debes iniciar sesión para realizar un pago');
                return;
            }

            const userId = window.axyraAuthSystem.currentUser.uid;
            const planDetails = this.getPlanDetails(planId);
            
            if (!planDetails) {
                this.showError('Plan no encontrado');
                return;
            }

            // Mostrar modal de confirmación
            this.showPaymentConfirmation(planDetails, userId);
            
        } catch (error) {
            console.error('❌ Error iniciando pago:', error);
            this.showError('Error iniciando el proceso de pago');
        }
    }

    showPaymentConfirmation(planDetails, userId) {
        const modal = document.createElement('div');
        modal.className = 'axyra-modal';
        modal.innerHTML = `
            <div class="axyra-modal-content">
                <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">&times;</button>
                <h3>Confirmar Suscripción</h3>
                <div class="payment-confirmation">
                    <h4>${planDetails.name}</h4>
                    <p class="plan-price">${this.formatPrice(planDetails.price)}</p>
                    <p class="plan-description">${planDetails.description}</p>
                    <ul class="plan-features">
                        ${planDetails.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    <div class="payment-methods">
                        <button class="wompi-pay-btn" onclick="window.axyraWompiIntegration.processWompiPayment('${planDetails.id}', '${userId}')">
                            <i class="fas fa-credit-card"></i> Pagar con Wompi
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    async processWompiPayment(planId, userId) {
        try {
            console.log(`💳 Procesando pago Wompi para plan: ${planId}`);
            
            const planDetails = this.getPlanDetails(planId);
            const user = window.axyraAuthSystem.currentUser;
            
            // Crear transacción en Wompi
            const transactionData = {
                amount_in_cents: planDetails.price * 100,
                currency: 'COP',
                customer_email: user.email,
                reference: `AXYRA-${planId}-${Date.now()}`,
                payment_method: {
                    type: 'CARD',
                    installments: 1
                },
                customer_data: {
                    full_name: user.displayName || user.email,
                    phone_number: user.phoneNumber || '+573000000000'
                },
                shipping_address: {
                    address_line_1: 'Calle 123 #45-67',
                    city: 'Bogotá',
                    country: 'CO',
                    region: 'Cundinamarca',
                    postal_code: '110111'
                }
            };

            // Guardar referencia en Firebase para el webhook
            await this.savePaymentReference(userId, planId, transactionData.reference);

            // Crear widget de Wompi
            this.createWompiWidget(transactionData, planId, userId);
            
        } catch (error) {
            console.error('❌ Error procesando pago Wompi:', error);
            this.showError('Error procesando el pago. Intenta de nuevo.');
        }
    }

    async savePaymentReference(userId, planId, reference) {
        try {
            if (window.firebase && window.firebase.firestore) {
                await window.firebase.firestore().collection('users').doc(userId).update({
                    'membership.reference': reference,
                    'membership.plan': planId,
                    'membership.lastPaymentAttempt': window.firebase.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Referencia de pago guardada');
            }
        } catch (error) {
            console.error('❌ Error guardando referencia de pago:', error);
        }
    }

    createWompiWidget(transactionData, planId, userId) {
        try {
            if (!window.WompiWidget) {
                this.showError('Sistema de pagos no disponible. Intenta recargar la página.');
                return;
            }

            // Crear contenedor para el widget
            const widgetContainer = document.createElement('div');
            widgetContainer.id = 'wompi-widget-container';
            widgetContainer.innerHTML = `
                <div class="wompi-widget-header">
                    <h4>Completa tu pago</h4>
                    <p>Plan: ${this.getPlanDetails(planId).name}</p>
                </div>
                <div id="wompi-widget"></div>
            `;

            // Reemplazar contenido del modal
            const modal = document.querySelector('.axyra-modal .axyra-modal-content');
            modal.innerHTML = '';
            modal.appendChild(widgetContainer);

            // Inicializar widget de Wompi
            window.WompiWidget.create({
                container: '#wompi-widget',
                transaction: transactionData,
                onSuccess: (result) => {
                    console.log('✅ Pago exitoso:', result);
                    this.handlePaymentSuccess(result, planId, userId);
                },
                onError: (error) => {
                    console.error('❌ Error en pago:', error);
                    this.handlePaymentError(error);
                }
            });

        } catch (error) {
            console.error('❌ Error creando widget de Wompi:', error);
            this.showError('Error creando el formulario de pago.');
        }
    }

    async handlePaymentSuccess(result, planId, userId) {
        try {
            console.log('✅ Pago procesado exitosamente:', result);
            
            // Mostrar mensaje de éxito
            this.showSuccess('¡Pago procesado exitosamente! Tu suscripción será activada en breve.');
            
            // Cerrar modal
            const modal = document.querySelector('.axyra-modal');
            if (modal) modal.remove();
            
            // Recargar datos del usuario
            if (window.axyraMembershipSystem) {
                await window.axyraMembershipSystem.loadCurrentMembership();
            }
            
            // Redirigir al dashboard
            setTimeout(() => {
                window.location.href = '../dashboard/dashboard.html';
            }, 2000);
            
        } catch (error) {
            console.error('❌ Error manejando éxito de pago:', error);
            this.showError('Error procesando el pago exitoso.');
        }
    }

    handlePaymentError(error) {
        console.error('❌ Error en pago Wompi:', error);
        this.showError(`Error en el pago: ${error.message || 'Error desconocido'}`);
    }

    getPlanDetails(planId) {
        const plans = {
            'basic': {
                id: 'basic',
                name: 'Plan Básico',
                price: 49900,
                description: 'Perfecto para pequeñas empresas',
                features: [
                    'Hasta 25 empleados',
                    'Reportes básicos',
                    'Soporte por email',
                    'Dashboard completo'
                ]
            },
            'professional': {
                id: 'professional',
                name: 'Plan Profesional',
                price: 129900,
                description: 'Ideal para empresas en crecimiento',
                features: [
                    'Empleados ilimitados',
                    'Reportes avanzados',
                    'Soporte prioritario',
                    'Todas las funcionalidades'
                ]
            },
            'enterprise': {
                id: 'enterprise',
                name: 'Plan Empresarial',
                price: 259900,
                description: 'Para grandes empresas',
                features: [
                    'Todo lo anterior',
                    'Múltiples sucursales',
                    'Integración personalizada',
                    'Soporte dedicado'
                ]
            }
        };
        return plans[planId];
    }

    formatPrice(price) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(price);
    }

    showError(message) {
        if (window.axyraErrorHandler) {
            window.axyraErrorHandler.showNotification('Error', message, 'error');
        } else {
            alert(`Error: ${message}`);
        }
    }

    showSuccess(message) {
        if (window.axyraErrorHandler) {
            window.axyraErrorHandler.showNotification('Éxito', message, 'success');
        } else {
            alert(`Éxito: ${message}`);
        }
    }
}

// Inicializar integración Wompi cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    if (!window.axyraWompiIntegration) {
        window.axyraWompiIntegration = new AxyraWompiIntegration();
    }
});
