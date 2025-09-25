// ========================================
// SISTEMA DE MEMBRESÍAS FUNCIONAL AXYRA
// ========================================

class AxyraMembershipSystemFunctional {
  constructor() {
    this.config = {
      plans: {
        free: {
          id: 'free',
          name: 'Plan Gratuito',
          price: 0,
          currency: 'COP',
          interval: 'month',
          features: ['Hasta 5 empleados', 'Dashboard básico', 'Reportes básicos', 'Soporte por email'],
          limitations: {
            maxEmployees: 5,
            maxReports: 10,
            advancedFeatures: false,
            prioritySupport: false,
            apiAccess: false,
          },
        },
        basic: {
          id: 'basic',
          name: 'Plan Básico',
          price: 29900,
          currency: 'COP',
          interval: 'month',
          features: [
            'Hasta 5 empleados',
            'Gestión básica de nómina',
            'Inventario simple',
            'Reportes básicos',
            'Soporte por email',
            '5GB de almacenamiento',
          ],
          limitations: {
            maxEmployees: 5,
            maxReports: 50,
            advancedFeatures: false,
            prioritySupport: false,
            apiAccess: false,
          },
        },
        professional: {
          id: 'professional',
          name: 'Plan Profesional',
          price: 49900,
          currency: 'COP',
          interval: 'month',
          features: [
            'Hasta 25 empleados',
            'Gestión completa de nómina',
            'Inventario avanzado',
            'Cuadre de caja',
            'Reportes avanzados',
            'Chat de IA incluido',
            'Soporte prioritario',
          ],
          limitations: {
            maxEmployees: 25,
            maxReports: 200,
            advancedFeatures: true,
            prioritySupport: true,
            apiAccess: false,
          },
        },
        enterprise: {
          id: 'enterprise',
          name: 'Plan Empresarial',
          price: 99900,
          currency: 'COP',
          interval: 'month',
          features: [
            'Empleados ilimitados',
            'Todas las funciones',
            'Múltiples sucursales',
            'API personalizada',
            'Reportes personalizados',
            'Soporte 24/7',
            'Almacenamiento ilimitado',
          ],
          limitations: {
            maxEmployees: -1,
            maxReports: -1,
            advancedFeatures: true,
            prioritySupport: true,
            apiAccess: true,
            multiBranch: true,
            customIntegration: true,
          },
        },
      },
    };

    this.currentUser = null;
    this.currentMembership = null;
    this.paymentMethods = ['wompi'];

    this.init();
  }

  async init() {
    try {
      console.log('💎 Inicializando Sistema de Membresías Funcional AXYRA...');

      // Cargar membresía actual
      await this.loadCurrentMembership();

      // Configurar event listeners
      this.setupEventListeners();

      console.log('✅ Sistema de Membresías Funcional AXYRA inicializado');
    } catch (error) {
      console.error('❌ Error inicializando sistema de membresías:', error);
      this.handleError(error);
    }
  }

  async loadCurrentMembership() {
    try {
      // Usar plan gratuito por defecto
      this.currentMembership = this.config.plans.free;

      // Verificar si hay datos en localStorage
      const storedMembership = localStorage.getItem('axyra_membership');
      if (storedMembership) {
        const membershipData = JSON.parse(storedMembership);
        this.currentMembership = {
          ...(this.config.plans[membershipData.plan] || this.config.plans.free),
          ...membershipData,
        };
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

      const plan = this.config.plans[planId];
      if (!plan) {
        throw new Error('Plan no encontrado');
      }

      // Verificar si ya tiene el plan
      if (this.currentMembership.id === planId && this.currentMembership.status === 'active') {
        this.showNotification('Ya tienes este plan activo', 'info');
        return;
      }

      // Mostrar modal de pago
      this.showPaymentModal(plan);
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
          <h3>Seleccionar Método de Pago</h3>
          <button class="axyra-payment-modal-close" onclick="this.closest('.axyra-payment-modal').remove()">×</button>
        </div>
        <div class="axyra-payment-modal-body">
          <div class="axyra-plan-info">
            <h4>${plan.name}</h4>
            <p class="plan-price">$${plan.price.toLocaleString()} COP</p>
            <ul class="axyra-plan-features">
              ${plan.features.map((feature) => `<li>✅ ${feature}</li>`).join('')}
            </ul>
          </div>
          <div class="axyra-payment-options">
            <div class="axyra-payment-option" data-payment-method="wompi">
              <div class="payment-icon">💳</div>
              <div class="payment-info">
                <h5>Wompi</h5>
                <p>Pago con tarjeta de crédito/débito</p>
              </div>
            </div>
          </div>
        </div>
        <div class="axyra-payment-modal-footer">
          <button id="axyra-process-payment" class="axyra-payment-button" disabled>
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
        border-radius: 16px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      }
      .axyra-payment-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .axyra-payment-modal-close {
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
      }
      .axyra-plan-info {
        margin-bottom: 20px;
        padding: 16px;
        background: #f8fafc;
        border-radius: 12px;
      }
      .plan-price {
        font-size: 24px;
        font-weight: bold;
        color: #3b82f6;
        margin: 8px 0;
      }
      .axyra-plan-features {
        list-style: none;
        padding: 0;
        margin: 16px 0 0 0;
      }
      .axyra-plan-features li {
        padding: 4px 0;
        color: #4b5563;
      }
      .axyra-payment-option {
        display: flex;
        align-items: center;
        padding: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-bottom: 12px;
      }
      .axyra-payment-option:hover {
        border-color: #3b82f6;
        background: #f0f9ff;
      }
      .axyra-payment-option.selected {
        border-color: #3b82f6;
        background: #f0f9ff;
      }
      .payment-icon {
        font-size: 24px;
        margin-right: 16px;
      }
      .payment-info h5 {
        margin: 0 0 4px 0;
        color: #1f2937;
      }
      .payment-info p {
        margin: 0;
        color: #6b7280;
        font-size: 14px;
      }
      .axyra-payment-button {
        width: 100%;
        padding: 12px 24px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 8px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
      }
      .axyra-payment-button:hover:not(:disabled) {
        background: #2563eb;
      }
      .axyra-payment-button:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    `;

    if (document.head) {
      document.head.appendChild(styles);
    }

    if (document.body) {
      document.body.appendChild(modal);
    }

    // Configurar event listeners
    modal.querySelectorAll('.axyra-payment-option').forEach((option) => {
      option.addEventListener('click', () => {
        modal.querySelectorAll('.axyra-payment-option').forEach((opt) => opt.classList.remove('selected'));
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
      // Simular pago exitoso para testing
      if (plan.price === 0) {
        await this.updateMembership(plan.id, 'wompi_test');
        this.showNotification('¡Plan activado exitosamente!', 'success');
        this.closePaymentModal();
        return;
      }

      // Aquí iría la integración real con Wompi
      console.log('🔄 Procesando pago con Wompi...', {
        amount: plan.price,
        currency: plan.currency,
        plan: plan.id,
      });

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
        lastUpdated: new Date(),
      };

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
    try {
      // Verificar que document.body existe
      if (!document.body || !document.body.appendChild) {
        console.log(`📢 Notificación: ${message}`);
        return;
      }

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
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
      `;

      const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      };

      notification.style.backgroundColor = colors[type] || colors.info;

      document.body.appendChild(notification);

      // Animación de entrada
      setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
      }, 100);

      setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
          if (notification.parentElement) {
            notification.remove();
          }
        }, 300);
      }, 5000);
    } catch (error) {
      console.warn('⚠️ Error mostrando notificación:', error);
      console.log(`📢 Notificación: ${message}`);
    }
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

// Inicializar el sistema de membresías funcional
document.addEventListener('DOMContentLoaded', () => {
  window.axyraMembershipSystem = new AxyraMembershipSystemFunctional();
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraMembershipSystemFunctional;
}
