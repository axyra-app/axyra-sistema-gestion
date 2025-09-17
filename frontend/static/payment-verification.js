/**
 * AXYRA - Sistema de Verificación de Pagos
 * Verifica pagos de Wompi y actualiza membresías
 */

class AxyraPaymentVerification {
  constructor() {
    this.config = {
      wompiApiUrl: 'https://production.wompi.co/v1',
      wompiPublicKey: 'pub_prod_DMd1RNFhiA3813HZ3YZFsNjSg2beSS00'
    };
    
    this.planMapping = {
      'dJSIja': 'basic',      // Plan Básico
      'Lk65dP': 'professional', // Plan Profesional  
      'Hg5RaQ': 'enterprise'   // Plan Empresarial
    };
    
    this.init();
  }

  init() {
    console.log('🔍 Inicializando verificación de pagos...');
    this.checkUrlForPaymentSuccess();
    this.setupPaymentListeners();
  }

  /**
   * Verifica si hay parámetros de pago exitoso en la URL
   */
  checkUrlForPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    const plan = urlParams.get('plan');
    const transactionId = urlParams.get('transaction_id');
    const reference = urlParams.get('reference');

    if (paymentSuccess === 'success' && plan) {
      console.log('✅ Pago exitoso detectado:', { plan, transactionId, reference });
      this.handlePaymentSuccess(plan, transactionId, reference);
    }
  }

  /**
   * Maneja un pago exitoso
   */
  async handlePaymentSuccess(plan, transactionId, reference) {
    try {
      console.log('🎉 Procesando pago exitoso...');
      
      // Obtener usuario actual
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('❌ Usuario no autenticado');
        this.showError('Error: Usuario no autenticado');
        return;
      }

      // Verificar pago con Wompi (opcional)
      if (transactionId) {
        const isValidPayment = await this.verifyPaymentWithWompi(transactionId);
        if (!isValidPayment) {
          console.error('❌ Pago no verificado con Wompi');
          this.showError('Error: Pago no verificado');
          return;
        }
      }

      // Actualizar membresía en Firestore
      await this.updateUserMembership(user.uid, plan);
      
      // Mostrar confirmación
      this.showPaymentSuccess(plan);
      
      // Limpiar URL
      this.cleanUrl();
      
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      this.showError('Error procesando el pago: ' + error.message);
    }
  }

  /**
   * Verifica el pago con la API de Wompi
   */
  async verifyPaymentWithWompi(transactionId) {
    try {
      console.log('🔍 Verificando pago con Wompi:', transactionId);
      
      const response = await fetch(`${this.config.wompiApiUrl}/transactions/${transactionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.wompiPublicKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.data && result.data.status === 'APPROVED') {
        console.log('✅ Pago verificado con Wompi');
        return true;
      } else {
        console.log('❌ Pago no aprobado en Wompi:', result.data?.status);
        return false;
      }
    } catch (error) {
      console.error('❌ Error verificando pago con Wompi:', error);
      return false;
    }
  }

  /**
   * Actualiza la membresía del usuario en Firestore
   */
  async updateUserMembership(userId, plan) {
    try {
      console.log('📝 Actualizando membresía:', { userId, plan });
      
      const membershipData = {
        plan: plan,
        status: 'active',
        startDate: new Date(),
        endDate: this.calculateEndDate(plan),
        paymentMethod: 'wompi',
        lastUpdated: new Date()
      };

      // Actualizar documento del usuario
      await firebase.firestore().collection('users').doc(userId).update({
        membership: membershipData,
        lastUpdated: new Date()
      });

      // Crear registro de pago
      await firebase.firestore().collection('payments').add({
        userId: userId,
        plan: plan,
        amount: this.getPlanPrice(plan),
        currency: 'COP',
        status: 'completed',
        paymentMethod: 'wompi',
        timestamp: new Date()
      });

      console.log('✅ Membresía actualizada correctamente');
      
    } catch (error) {
      console.error('❌ Error actualizando membresía:', error);
      throw error;
    }
  }

  /**
   * Calcula la fecha de vencimiento de la membresía
   */
  calculateEndDate(plan) {
    const startDate = new Date();
    const endDate = new Date();
    
    // Membresías mensuales
    endDate.setMonth(endDate.getMonth() + 1);
    
    return endDate;
  }

  /**
   * Obtiene el precio del plan
   */
  getPlanPrice(plan) {
    const prices = {
      basic: 49900,
      professional: 129900,
      enterprise: 259900
    };
    return prices[plan] || 0;
  }

  /**
   * Muestra confirmación de pago exitoso
   */
  showPaymentSuccess(plan) {
    const planNames = {
      basic: 'Plan Básico',
      professional: 'Plan Profesional',
      enterprise: 'Plan Empresarial'
    };

    const modal = document.createElement('div');
    modal.className = 'payment-success-modal';
    modal.innerHTML = `
      <div class="payment-success-content">
        <div class="success-icon">✅</div>
        <h2>¡Pago Exitoso!</h2>
        <p>Tu ${planNames[plan]} ha sido activado correctamente.</p>
        <p>Ya puedes acceder a todas las funcionalidades de tu plan.</p>
        <button class="btn-success" onclick="this.closest('.payment-success-modal').remove()">
          Continuar al Dashboard
        </button>
      </div>
    `;

    // Estilos
    const style = document.createElement('style');
    style.textContent = `
      .payment-success-modal {
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
      }
      
      .payment-success-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      .btn-success {
        background: #28a745;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 1rem;
      }
      
      .btn-success:hover {
        background: #218838;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);
  }

  /**
   * Muestra error
   */
  showError(message) {
    alert('Error: ' + message);
  }

  /**
   * Limpia la URL de parámetros de pago
   */
  cleanUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('payment');
    url.searchParams.delete('plan');
    url.searchParams.delete('transaction_id');
    url.searchParams.delete('reference');
    
    window.history.replaceState({}, '', url);
  }

  /**
   * Configura listeners para pagos
   */
  setupPaymentListeners() {
    // Escuchar cambios en la URL
    window.addEventListener('popstate', () => {
      this.checkUrlForPaymentSuccess();
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraPaymentVerification = new AxyraPaymentVerification();
});

// También inicializar si ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraPaymentVerification = new AxyraPaymentVerification();
  });
} else {
  window.axyraPaymentVerification = new AxyraPaymentVerification();
}
