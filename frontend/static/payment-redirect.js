/**
 * AXYRA - Sistema de Redirección Post-Pago
 * Maneja la redirección después del pago exitoso
 */

class AxyraPaymentRedirect {
  constructor() {
    this.init();
  }

  init() {
    // Verificar si hay parámetros de pago exitoso
    this.checkForPaymentSuccess();
  }

  /**
   * Verifica si hay parámetros de pago exitoso en la URL
   */
  checkForPaymentSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const paymentSuccess = urlParams.get('payment');
    const plan = urlParams.get('plan');
    const testMode = urlParams.get('test');

    if (paymentSuccess === 'success' && plan) {
      console.log('🎉 Redirección post-pago detectada:', { plan, testMode });
      this.handlePaymentSuccess(plan, testMode === 'true');
    }
  }

  /**
   * Maneja el pago exitoso
   */
  async handlePaymentSuccess(plan, isTestMode = false) {
    try {
      console.log('🔄 Procesando pago exitoso...');
      
      // Obtener usuario actual
      const user = firebase.auth().currentUser;
      if (!user) {
        console.error('❌ Usuario no autenticado');
        this.showError('Error: Usuario no autenticado');
        return;
      }

      // Actualizar membresía en Firestore
      await this.updateUserMembership(user.uid, plan, isTestMode);
      
      // Mostrar notificación de bienvenida
      this.showWelcomeNotification(plan, isTestMode);
      
    } catch (error) {
      console.error('❌ Error procesando pago exitoso:', error);
      this.showError('Error procesando el pago: ' + error.message);
    }
  }

  /**
   * Actualiza la membresía del usuario en Firestore
   */
  async updateUserMembership(userId, plan, isTestMode = false) {
    try {
      console.log('📝 Actualizando membresía:', { userId, plan });

      const membershipData = {
        plan: plan,
        status: 'active',
        startDate: new Date(),
        endDate: this.calculateEndDate(plan),
        paymentMethod: isTestMode ? 'wompi_test' : 'wompi',
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
        paymentMethod: isTestMode ? 'wompi_test' : 'wompi',
        timestamp: new Date(),
        testMode: isTestMode
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
   * Muestra la notificación de bienvenida
   */
  showWelcomeNotification(plan, isTestMode = false) {
    // Esperar un poco para que se cargue la página
    setTimeout(() => {
      if (window.axyraWelcomeNotification) {
        window.axyraWelcomeNotification.showWelcomeNotification(plan, isTestMode);
      }
    }, 1000);
  }

  /**
   * Muestra error
   */
  showError(message) {
    const errorModal = document.createElement('div');
    errorModal.className = 'error-modal';
    errorModal.innerHTML = `
      <div class="error-content">
        <div class="error-icon">❌</div>
        <h2>Error</h2>
        <p>${message}</p>
        <button class="btn-error" onclick="this.closest('.error-modal').remove()">
          Cerrar
        </button>
      </div>
    `;

    // Estilos
    const style = document.createElement('style');
    style.textContent = `
      .error-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10001;
      }
      
      .error-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        max-width: 400px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .error-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
      }
      
      .btn-error {
        background: #dc3545;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 1rem;
      }
      
      .btn-error:hover {
        background: #c82333;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(errorModal);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraPaymentRedirect = new AxyraPaymentRedirect();
});

// También inicializar si ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraPaymentRedirect = new AxyraPaymentRedirect();
  });
} else {
  window.axyraPaymentRedirect = new AxyraPaymentRedirect();
}
