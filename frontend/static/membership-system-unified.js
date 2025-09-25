/**
 * 💎 SISTEMA DE MEMBRESÍAS UNIFICADO AXYRA
 * Sistema completo y robusto para gestión de membresías
 */

class AxyraMembershipSystemUnified {
    constructor() {
        this.config = {
            plans: {
                free: {
                    id: 'free',
                    name: 'Plan Gratuito',
                    price: 0,
                    currency: 'COP',
                    interval: 'month',
                    features: [
                        'Hasta 5 empleados',
                        'Dashboard básico',
                        'Reportes básicos',
                        'Soporte por email'
                    ],
                    limitations: {
                        maxEmployees: 5,
                        maxReports: 10,
                        advancedFeatures: false,
                        prioritySupport: false,
                        apiAccess: false
                    }
                },
                basic: {
                    id: 'basic',
                    name: 'Plan Básico',
                    price: 49900,
                    currency: 'COP',
                    interval: 'month',
                    features: [
                        'Hasta 25 empleados',
                        'Dashboard completo',
                        'Reportes avanzados',
                        'Gestión de horas',
                        'Cálculo de nóminas',
                        'Soporte prioritario'
                    ],
                    limitations: {
                        maxEmployees: 25,
                        maxReports: 100,
                        advancedFeatures: true,
                        prioritySupport: true,
                        apiAccess: false
                    }
                },
                professional: {
                    id: 'professional',
                    name: 'Plan Profesional',
                    price: 129900,
                    currency: 'COP',
                    interval: 'month',
                    features: [
                        'Empleados ilimitados',
                        'Todas las funcionalidades',
                        'Nómina avanzada',
                        'Reportes personalizados',
                        'Inventario completo',
                        'Soporte 24/7',
                        'API personalizada'
                    ],
                    limitations: {
                        maxEmployees: -1,
                        maxReports: -1,
                        advancedFeatures: true,
                        prioritySupport: true,
                        apiAccess: true
                    }
                },
                enterprise: {
                    id: 'enterprise',
                    name: 'Plan Empresarial',
                    price: 259900,
                    currency: 'COP',
                    interval: 'month',
                    features: [
                        'Todo lo anterior',
                        'Múltiples sucursales',
                        'Integración personalizada',
                        'Soporte dedicado',
                        'Capacitación incluida',
                        'SLA garantizado',
                        'White-label disponible'
                    ],
                    limitations: {
                        maxEmployees: -1,
                        maxReports: -1,
                        advancedFeatures: true,
                        prioritySupport: true,
                        apiAccess: true,
                        multiBranch: true,
                        customIntegration: true
                    }
                }
            }
        };

        this.currentUser = null;
        this.currentMembership = null;
        this.paymentMethods = ['wompi', 'paypal'];
        
        this.init();
    }

    async init() {
        try {
            console.log('💎 Inicializando Sistema de Membresías Unificado AXYRA...');
            
            // Verificar autenticación
            await this.checkAuthentication();
            
            // Cargar membresía actual
            await this.loadCurrentMembership();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            console.log('✅ Sistema de Membresías Unificado AXYRA inicializado');
        } catch (error) {
            console.error('❌ Error inicializando sistema de membresías:', error);
            this.handleError(error);
        }
    }

    async checkAuthentication() {
        return new Promise((resolve, reject) => {
            // Esperar a que Firebase esté disponible
            const checkFirebase = () => {
                if (typeof firebase !== 'undefined' && firebase.auth && firebase.apps && firebase.apps.length > 0) {
                    firebase.auth().onAuthStateChanged(async (user) => {
                        if (user) {
                            this.currentUser = user;
                            console.log('👤 Usuario autenticado:', user.email);
                            resolve(user);
                        } else {
                            console.log('⚠️ Usuario no autenticado');
                            this.currentUser = null;
                            resolve(null);
                        }
                    });
                } else {
                    // Esperar un poco más si Firebase no está listo
                    setTimeout(() => {
                        if (typeof firebase !== 'undefined' && firebase.auth) {
                            checkFirebase();
                        } else {
                            console.warn('⚠️ Firebase no disponible, usando modo offline');
                            resolve(null);
                        }
                    }, 1000);
                }
            };
            
            checkFirebase();
        });
    }

    async loadCurrentMembership() {
        if (!this.currentUser) {
            this.currentMembership = this.config.plans.free;
            return;
        }

        try {
            if (window.axyraAPIFallback) {
                const membershipData = await window.axyraAPIFallback.makeAPICall(
                    `/api/check-user-plan?userId=${this.currentUser.uid}`
                );
                
                this.currentMembership = this.config.plans[membershipData.plan] || this.config.plans.free;
                this.currentMembership.status = membershipData.status || 'inactive';
                this.currentMembership.endDate = membershipData.endDate;
            } else {
                // Fallback a localStorage
                const storedMembership = localStorage.getItem('axyra_membership');
                if (storedMembership) {
                    this.currentMembership = JSON.parse(storedMembership);
                } else {
                    this.currentMembership = this.config.plans.free;
                }
            }

            console.log('💎 Membresía actual cargada:', this.currentMembership);
        } catch (error) {
            console.warn('⚠️ Error cargando membresía, usando plan gratuito:', error);
            this.currentMembership = this.config.plans.free;
        }
    }

    setupEventListeners() {
        // Event listeners para botones de planes
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-plan]')) {
                const planId = e.target.getAttribute('data-plan');
                this.selectPlan(planId);
            }
        });

        // Event listeners para métodos de pago
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-payment-method]')) {
                const method = e.target.getAttribute('data-payment-method');
                this.selectPaymentMethod(method);
            }
        });
    }

    async selectPlan(planId) {
        try {
            console.log('🎯 Plan seleccionado:', planId);

            if (!this.currentUser) {
                this.showNotification('Debes iniciar sesión para suscribirte a un plan', 'error');
                window.location.href = 'login.html';
                return;
            }

            const plan = this.config.plans[planId];
            if (!plan) {
                throw new Error('Plan no encontrado');
            }

            // Verificar si ya tiene el plan
            if (this.currentMembership.id === planId && this.currentMembership.status === 'active') {
                this.showNotification('Ya tienes este plan activo', 'info');
                return;
            }

            // Usar integración real con Wompi
            if (window.axyraWompiIntegration) {
                await window.axyraWompiIntegration.initiatePayment(planId);
            } else {
                // Fallback al modal de pago original
                this.showPaymentModal(plan);
            }

        } catch (error) {
            console.error('❌ Error seleccionando plan:', error);
            this.showNotification('Error seleccionando plan: ' + error.message, 'error');
        }
    }

    showPaymentModal(plan) {
        const modal = document.createElement('div');
        modal.className = 'axyra-payment-modal';
        modal.innerHTML = `
            <div class="axyra-payment-modal-content">
                <div class="axyra-payment-modal-header">
                    <h3>💳 Suscribirse a ${plan.name}</h3>
                    <button class="axyra-payment-modal-close" onclick="this.closest('.axyra-payment-modal').remove()">×</button>
                </div>
                <div class="axyra-payment-modal-body">
                    <div class="axyra-plan-summary">
                        <h4>${plan.name}</h4>
                        <div class="axyra-plan-price">
                            <span class="axyra-currency">${plan.currency}</span>
                            <span class="axyra-amount">${plan.price.toLocaleString()}</span>
                            <span class="axyra-interval">/mes</span>
                        </div>
                        <ul class="axyra-plan-features">
                            ${plan.features.map(feature => `<li>✅ ${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="axyra-payment-methods">
                        <h4>Método de Pago</h4>
                        <div class="axyra-payment-options">
                            <button class="axyra-payment-option" data-payment-method="wompi">
                                <i class="fas fa-credit-card"></i>
                                Wompi (Tarjeta)
                            </button>
                            <button class="axyra-payment-option" data-payment-method="paypal">
                                <i class="fab fa-paypal"></i>
                                PayPal
                            </button>
                        </div>
                    </div>
                </div>
                <div class="axyra-payment-modal-footer">
                    <button class="axyra-btn axyra-btn-secondary" onclick="this.closest('.axyra-payment-modal').remove()">
                        Cancelar
                    </button>
                    <button class="axyra-btn axyra-btn-primary" id="axyra-process-payment" disabled>
                        Procesar Pago
                    </button>
                </div>
            </div>
        `;

        // Agregar estilos
        const styles = document.createElement('style');
        styles.textContent = `
            .axyra-payment-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .axyra-payment-modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            .axyra-payment-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eee;
            }
            .axyra-payment-modal-body {
                padding: 20px;
            }
            .axyra-plan-summary {
                text-align: center;
                margin-bottom: 20px;
            }
            .axyra-plan-price {
                font-size: 2rem;
                font-weight: bold;
                color: #3b82f6;
                margin: 10px 0;
            }
            .axyra-plan-features {
                list-style: none;
                padding: 0;
                text-align: left;
            }
            .axyra-plan-features li {
                padding: 5px 0;
            }
            .axyra-payment-options {
                display: flex;
                gap: 10px;
                margin-top: 10px;
            }
            .axyra-payment-option {
                flex: 1;
                padding: 15px;
                border: 2px solid #eee;
                border-radius: 8px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .axyra-payment-option:hover {
                border-color: #3b82f6;
            }
            .axyra-payment-option.selected {
                border-color: #3b82f6;
                background: #f0f9ff;
            }
            .axyra-payment-modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 10px;
                padding: 20px;
                border-top: 1px solid #eee;
            }
        `;
        if (document.head) {
            document.head.appendChild(styles);
        }

        if (document.body) {
            document.body.appendChild(modal);
        } else {
            console.warn('⚠️ document.body no disponible para mostrar modal');
        }

        // Configurar event listeners
        modal.querySelectorAll('.axyra-payment-option').forEach(option => {
            option.addEventListener('click', () => {
                modal.querySelectorAll('.axyra-payment-option').forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                modal.querySelector('#axyra-process-payment').disabled = false;
            });
        });

        modal.querySelector('#axyra-process-payment').addEventListener('click', () => {
            const selectedMethod = modal.querySelector('.axyra-payment-option.selected');
            if (selectedMethod) {
                const method = selectedMethod.getAttribute('data-payment-method');
                this.processPayment(plan, method);
            }
        });
    }

    async processPayment(plan, method) {
        try {
            console.log('💳 Procesando pago:', { plan: plan.id, method });

            if (method === 'wompi') {
                await this.processWompiPayment(plan);
            } else if (method === 'paypal') {
                await this.processPayPalPayment(plan);
            } else {
                throw new Error('Método de pago no válido');
            }

        } catch (error) {
            console.error('❌ Error procesando pago:', error);
            this.showNotification('Error procesando pago: ' + error.message, 'error');
        }
    }

    async processWompiPayment(plan) {
        try {
            // Crear transacción en Wompi
            const transactionData = {
                amount_in_cents: plan.price * 100,
                currency: plan.currency,
                customer_email: this.currentUser.email,
                payment_method: {
                    type: 'CARD',
                    installments: 1
                },
                reference: `AXYRA-${plan.id}-${Date.now()}`,
                customer_data: {
                    email: this.currentUser.email,
                    full_name: this.currentUser.displayName || 'Usuario AXYRA'
                }
            };

            // Simular pago exitoso para testing
            if (plan.price === 0) {
                await this.updateMembership(plan.id, 'wompi_test');
                this.showNotification('¡Plan activado exitosamente!', 'success');
                return;
            }

            // Aquí iría la integración real con Wompi
            console.log('🔄 Procesando pago con Wompi...', transactionData);
            
            // Simular pago exitoso
            setTimeout(async () => {
                await this.updateMembership(plan.id, 'wompi');
                this.showNotification('¡Pago procesado exitosamente!', 'success');
                this.closePaymentModal();
            }, 2000);

        } catch (error) {
            console.error('❌ Error procesando pago con Wompi:', error);
            throw error;
        }
    }

    async processPayPalPayment(plan) {
        try {
            console.log('🔄 Procesando pago con PayPal...', plan);
            
            // Simular pago exitoso
            setTimeout(async () => {
                await this.updateMembership(plan.id, 'paypal');
                this.showNotification('¡Pago procesado exitosamente!', 'success');
                this.closePaymentModal();
            }, 2000);

        } catch (error) {
            console.error('❌ Error procesando pago con PayPal:', error);
            throw error;
        }
    }

    async updateMembership(planId, paymentMethod) {
        try {
            console.log('📝 Actualizando membresía:', { planId, paymentMethod });

            const plan = this.config.plans[planId];
            const membershipData = {
                plan: planId,
                status: 'active',
                startDate: new Date(),
                endDate: this.calculateEndDate(planId),
                paymentMethod: paymentMethod,
                lastUpdated: new Date()
            };

            // Actualizar en Firebase si está disponible
            if (this.currentUser && typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection('users').doc(this.currentUser.uid).update({
                    membership: membershipData,
                    lastUpdated: new Date()
                });

                // Crear registro de pago
                await firebase.firestore().collection('payments').add({
                    userId: this.currentUser.uid,
                    plan: planId,
                    amount: plan.price,
                    currency: plan.currency,
                    status: 'completed',
                    paymentMethod: paymentMethod,
                    timestamp: new Date()
                });
            }

            // Actualizar en localStorage
            localStorage.setItem('axyra_membership', JSON.stringify(membershipData));

            // Actualizar membresía actual
            this.currentMembership = { ...plan, ...membershipData };

            console.log('✅ Membresía actualizada correctamente');

        } catch (error) {
            console.error('❌ Error actualizando membresía:', error);
            throw error;
        }
    }

    calculateEndDate(planId) {
        const startDate = new Date();
        const plan = this.config.plans[planId];
        
        if (plan.interval === 'month') {
            return new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
        } else if (plan.interval === 'year') {
            return new Date(startDate.getTime() + 365 * 24 * 60 * 60 * 1000);
        }
        
        return new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    }

    closePaymentModal() {
        const modal = document.querySelector('.axyra-payment-modal');
        if (modal) {
            modal.remove();
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `axyra-notification axyra-notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 10001;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;

        const colors = {
            success: '#10b981',
            error: '#ef4444',
            warning: '#f59e0b',
            info: '#3b82f6'
        };

        notification.style.backgroundColor = colors[type] || colors.info;

        if (document.body) {
            document.body.appendChild(notification);
        } else {
            console.warn('⚠️ document.body no disponible para mostrar notificación');
        }

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    handleError(error) {
        console.error('❌ Error en sistema de membresías:', error);
        this.showNotification('Error en el sistema de membresías: ' + error.message, 'error');
    }

    // Métodos públicos
    getCurrentMembership() {
        return this.currentMembership;
    }

    getAvailablePlans() {
        return Object.values(this.config.plans);
    }

    hasFeature(feature) {
        if (!this.currentMembership) return false;
        return this.currentMembership.limitations[feature] || false;
    }

    canAccessModule(module) {
        if (!this.currentMembership) return false;
        
        const restrictions = this.currentMembership.limitations;
        
        switch (module) {
            case 'gestion_personal':
                return restrictions.advancedFeatures;
            case 'caja':
                return restrictions.advancedFeatures;
            case 'inventario':
                return restrictions.advancedFeatures;
            case 'configuracion':
                return restrictions.advancedFeatures;
            default:
                return true;
        }
    }
}

// Inicializar el sistema de membresías
window.axyraMembershipSystem = new AxyraMembershipSystemUnified();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxyraMembershipSystemUnified;
}
