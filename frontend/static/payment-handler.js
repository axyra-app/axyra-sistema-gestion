/**
 * 🚀 AXYRA Payment Handler - Sistema de Pagos Wompi
 * Maneja la integración completa con Wompi para membresías
 */

class AxyraPaymentHandler {
  constructor() {
    this.wompiConfig = {
      publicKey: 'pub_prod_DMd1RNFhiA38l3HZ3YZFsNjSg2beSSOO',
      privateKey: 'prv_prod_aKa7VAtItpCAF3qhVuD8zvt7FUWXduPY',
      integritySecret: 'prod_integrity_qQz4LLXZep6Vs2OqAamNccOayPhi7NTV',
      eventsSecret: 'prod_events_4ob12JL0RXAolocztVa9GThpUrGfy8Dn',
      baseUrl: 'https://production.wompi.co/v1',
    };

    this.plans = {
      basic: {
        id: 'basic',
        name: 'Plan Básico',
        price: 29900,
        wompiLink: 'https://checkout.wompi.co/l/CNouhH',
        features: ['Hasta 5 empleados', 'Gestión básica de nómina', 'Inventario simple'],
      },
      professional: {
        id: 'professional',
        name: 'Plan Profesional',
        price: 49900,
        wompiLink: 'https://checkout.wompi.co/l/6uOGGL',
        features: ['Hasta 25 empleados', 'Gestión completa', 'Cuadre de caja', 'Chat IA'],
      },
      enterprise: {
        id: 'enterprise',
        name: 'Plan Empresarial',
        price: 99900,
        wompiLink: 'https://checkout.wompi.co/l/LfxrYP',
        features: ['Empleados ilimitados', 'Todas las funciones', 'Soporte 24/7'],
      },
    };

    this.init();
  }

  init() {
    console.log('🚀 AXYRA Payment Handler inicializado');
    this.setupEventListeners();
    this.checkPaymentStatus();
  }

  setupEventListeners() {
    // Escuchar eventos de pago desde Wompi
    window.addEventListener('message', (event) => {
      if (event.origin.includes('wompi.co')) {
        this.handleWompiEvent(event.data);
      }
    });

    // Escuchar cambios en localStorage para actualizar membresía
    window.addEventListener('storage', (event) => {
      if (event.key === 'axyra_payment_success') {
        this.handlePaymentSuccess(JSON.parse(event.newValue));
      }
    });
  }

  handleWompiEvent(data) {
    console.log('📨 Evento de Wompi recibido:', data);

    if (data.type === 'payment_success') {
      this.handlePaymentSuccess(data);
    } else if (data.type === 'payment_error') {
      this.handlePaymentError(data);
    }
  }

  async handlePaymentSuccess(paymentData) {
    try {
      console.log('✅ Pago exitoso procesando:', paymentData);

      // Obtener información del plan
      const plan = this.getPlanFromPayment(paymentData);
      if (!plan) {
        console.error('❌ Plan no encontrado para el pago');
        return;
      }

      // Actualizar membresía del usuario
      await this.updateUserMembership(plan);

      // Mostrar confirmación
      this.showPaymentSuccess(plan);

      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = '../dashboard/dashboard.html';
      }, 3000);
    } catch (error) {
      console.error('❌ Error procesando pago exitoso:', error);
      this.showPaymentError('Error procesando el pago. Contacta soporte.');
    }
  }

  handlePaymentError(errorData) {
    console.error('❌ Error en pago:', errorData);
    this.showPaymentError('Error en el procesamiento del pago. Intenta nuevamente.');
  }

  getPlanFromPayment(paymentData) {
    // Determinar el plan basado en el monto del pago
    const amount = paymentData.amount || paymentData.value;

    if (amount === 29900) return this.plans.basic;
    if (amount === 49900) return this.plans.professional;
    if (amount === 99900) return this.plans.enterprise;

    return null;
  }

  async updateUserMembership(plan) {
    try {
      // Obtener usuario actual
      const userData = localStorage.getItem('axyra_isolated_user');
      if (!userData) {
        throw new Error('Usuario no encontrado');
      }

      const user = JSON.parse(userData);

      // Actualizar membresía
      user.membresia = plan.id;
      user.plan = plan.id;
      user.membershipStatus = 'active';
      user.membershipStartDate = new Date().toISOString();
      user.membershipEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 días

      // Guardar usuario actualizado
      localStorage.setItem('axyra_isolated_user', JSON.stringify(user));
      localStorage.setItem('axyra_membership_plan', plan.id);
      localStorage.setItem('axyra_membership_status', 'active');

      console.log('✅ Membresía actualizada:', plan.name);

      // Emitir evento de actualización
      window.dispatchEvent(
        new CustomEvent('membershipUpdated', {
          detail: { plan: plan.id, status: 'active' },
        })
      );
    } catch (error) {
      console.error('❌ Error actualizando membresía:', error);
      throw error;
    }
  }

  showPaymentSuccess(plan) {
    const successMessage = `
      <div class="axyra-payment-success">
        <div class="axyra-success-icon">✅</div>
        <h2>¡Pago Exitoso!</h2>
        <p>Tu ${plan.name} ha sido activado correctamente.</p>
        <p>Redirigiendo al dashboard...</p>
      </div>
    `;

    this.showModal(successMessage, 'success');
  }

  showPaymentError(message) {
    const errorMessage = `
      <div class="axyra-payment-error">
        <div class="axyra-error-icon">❌</div>
        <h2>Error en el Pago</h2>
        <p>${message}</p>
        <button onclick="this.parentElement.parentElement.remove()" class="axyra-btn axyra-btn-primary">
          Cerrar
        </button>
      </div>
    `;

    this.showModal(errorMessage, 'error');
  }

  showModal(content, type) {
    // Remover modales existentes
    const existingModal = document.querySelector('.axyra-payment-modal');
    if (existingModal) {
      existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.className = `axyra-payment-modal axyra-payment-modal-${type}`;
    modal.innerHTML = content;

    // Estilos del modal
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    `;

    document.body.appendChild(modal);

    // Auto-remover después de 5 segundos para success
    if (type === 'success') {
      setTimeout(() => {
        if (modal.parentElement) {
          modal.remove();
        }
      }, 5000);
    }
  }

  checkPaymentStatus() {
    // Verificar si hay un pago pendiente en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentStatus = urlParams.get('payment_status');
    const transactionId = urlParams.get('transaction_id');

    if (paymentStatus === 'success' && transactionId) {
      // Simular datos de pago exitoso
      const mockPaymentData = {
        transactionId: transactionId,
        amount: this.getAmountFromUrl(),
        status: 'approved',
        type: 'payment_success',
      };

      this.handlePaymentSuccess(mockPaymentData);
    }
  }

  getAmountFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const amount = urlParams.get('amount');
    return amount ? parseInt(amount) : null;
  }

  // Método para iniciar pago
  initiatePayment(planId) {
    const plan = this.plans[planId];
    if (!plan) {
      console.error('❌ Plan no encontrado:', planId);
      return;
    }

    console.log('🚀 Iniciando pago para:', plan.name);

    // Abrir Wompi en nueva ventana
    const wompiWindow = window.open(plan.wompiLink, '_blank', 'width=800,height=600');

    // Monitorear la ventana de Wompi
    const checkClosed = setInterval(() => {
      if (wompiWindow.closed) {
        clearInterval(checkClosed);
        this.checkPaymentStatus();
      }
    }, 1000);
  }
}

// Inicializar el manejador de pagos
window.AxyraPaymentHandler = new AxyraPaymentHandler();

// Función global para seleccionar plan
function seleccionarPlan(planId) {
  if (window.AxyraPaymentHandler) {
    window.AxyraPaymentHandler.initiatePayment(planId);
  } else {
    console.error('❌ Payment Handler no disponible');
  }
}

console.log('✅ AXYRA Payment Handler cargado correctamente');


