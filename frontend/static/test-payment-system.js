/**
 * AXYRA - Sistema de Pruebas de Pagos
 * Permite simular pagos sin usar dinero real
 */

class AxyraTestPaymentSystem {
  constructor() {
    this.isTestMode = this.checkTestMode();
    this.init();
  }

  init() {
    if (this.isTestMode) {
      console.log('🧪 Modo de prueba activado - Pagos simulados');
      this.addTestModeIndicator();
      this.overridePaymentMethods();
    } else {
      // Agregar botón para activar modo de prueba
      this.addTestModeButton();
    }
  }

  /**
   * Verifica si está en modo de prueba
   */
  checkTestMode() {
    // Activar modo de prueba si hay parámetro ?test=true en la URL
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('test') === 'true' || 
           localStorage.getItem('axyra_test_mode') === 'true';
  }

  /**
   * Agrega botón para activar modo de prueba
   */
  addTestModeButton() {
    const button = document.createElement('button');
    button.id = 'test-mode-button';
    button.innerHTML = '🧪 Activar Modo de Prueba';
    button.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #ff6b35;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
      z-index: 9999;
      font-size: 14px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    `;
    
    button.addEventListener('click', () => {
      localStorage.setItem('axyra_test_mode', 'true');
      location.reload();
    });
    
    document.body.appendChild(button);
  }

  /**
   * Agrega indicador visual de modo de prueba
   */
  addTestModeIndicator() {
    const indicator = document.createElement('div');
    indicator.id = 'test-mode-indicator';
    indicator.innerHTML = '🧪 MODO DE PRUEBA - Pagos Simulados';
    indicator.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: #ff6b35;
      color: white;
      text-align: center;
      padding: 8px;
      font-weight: bold;
      z-index: 10000;
      font-size: 14px;
    `;
    document.body.appendChild(indicator);
  }

  /**
   * Sobrescribe los métodos de pago para simular
   */
  overridePaymentMethods() {
    console.log('🧪 Configurando interceptores de pago...');
    
    // Interceptar cuando se llame a createWompiTransaction
    this.interceptWompiIntegration();
    
    // Interceptar otros sistemas de pago
    this.overrideDualPaymentSystem();
    this.overrideWompiOnlyPayment();
  }

  /**
   * Intercepta la integración de Wompi
   */
  interceptWompiIntegration() {
    // Interceptar cuando se defina la clase AxyraWompiIntegration
    const originalCreateWompiTransaction = window.axyraWompiIntegration?.createWompiTransaction;
    
    // Función para interceptar cuando se cree la instancia
    const interceptWhenReady = () => {
      if (window.axyraWompiIntegration && window.axyraWompiIntegration.createWompiTransaction) {
        console.log('🧪 Interceptando createWompiTransaction...');
        window.axyraWompiIntegration.createWompiTransaction = async (paymentData) => {
          console.log('🧪 Simulando pago:', paymentData);
          await this.simulatePayment(paymentData);
        };
      } else {
        // Reintentar en 100ms
        setTimeout(interceptWhenReady, 100);
      }
    };
    
    interceptWhenReady();
  }

  /**
   * Sobrescribe el sistema de pago dual
   */
  overrideDualPaymentSystem() {
    if (window.axyraDualPaymentSystem) {
      const originalShowPaymentMethodModal = window.axyraDualPaymentSystem.showPaymentMethodModal;
      window.axyraDualPaymentSystem.showPaymentMethodModal = (planType, amount, description, userId) => {
        this.showTestPaymentModal(planType, amount, description, userId);
      };
    }
  }

  /**
   * Sobrescribe el sistema de pago solo Wompi
   */
  overrideWompiOnlyPayment() {
    if (window.axyraWompiOnlyPayment) {
      const originalShowPaymentModal = window.axyraWompiOnlyPayment.showPaymentModal;
      window.axyraWompiOnlyPayment.showPaymentModal = (planType, amount, description, userId) => {
        this.showTestPaymentModal(planType, amount, description, userId);
      };
    }
  }

  /**
   * Muestra modal de prueba de pago
   */
  showTestPaymentModal(planType, amount, description, userId) {
    const modal = document.createElement('div');
    modal.className = 'test-payment-modal';
    modal.innerHTML = `
      <div class="test-payment-content">
        <div class="test-header">
          <h2>🧪 Simulación de Pago</h2>
          <button class="close-test-modal">&times;</button>
        </div>
        
        <div class="test-body">
          <div class="plan-info">
            <h3>${description}</h3>
            <p class="plan-price">$${amount.toLocaleString()} COP</p>
          </div>
          
          <div class="test-options">
            <h4>Simular resultado del pago:</h4>
            <button class="btn-test-success" data-plan="${planType}" data-amount="${amount}" data-description="${description}" data-user="${userId}">
              ✅ Pago Exitoso
            </button>
            <button class="btn-test-failed" data-plan="${planType}" data-amount="${amount}" data-description="${description}" data-user="${userId}">
              ❌ Pago Fallido
            </button>
            <button class="btn-test-cancel">
              🚫 Cancelar
            </button>
          </div>
        </div>
      </div>
    `;

    // Estilos
    const style = document.createElement('style');
    style.textContent = `
      .test-payment-modal {
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
      
      .test-payment-content {
        background: white;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .test-header {
        background: #ff6b35;
        color: white;
        padding: 1rem;
        border-radius: 10px 10px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .test-body {
        padding: 2rem;
      }
      
      .plan-info {
        text-align: center;
        margin-bottom: 2rem;
        padding: 1rem;
        background: #f8f9fa;
        border-radius: 8px;
      }
      
      .plan-price {
        font-size: 1.5rem;
        font-weight: bold;
        color: #28a745;
        margin: 0.5rem 0;
      }
      
      .test-options {
        text-align: center;
      }
      
      .test-options h4 {
        margin-bottom: 1rem;
        color: #333;
      }
      
      .btn-test-success, .btn-test-failed, .btn-test-cancel {
        display: block;
        width: 100%;
        padding: 12px;
        margin: 8px 0;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
      }
      
      .btn-test-success {
        background: #28a745;
        color: white;
      }
      
      .btn-test-success:hover {
        background: #218838;
      }
      
      .btn-test-failed {
        background: #dc3545;
        color: white;
      }
      
      .btn-test-failed:hover {
        background: #c82333;
      }
      
      .btn-test-cancel {
        background: #6c757d;
        color: white;
      }
      
      .btn-test-cancel:hover {
        background: #5a6268;
      }
      
      .close-test-modal {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-test-modal').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.btn-test-cancel').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.btn-test-success').addEventListener('click', (e) => {
      const planType = e.target.dataset.plan;
      const amount = parseFloat(e.target.dataset.amount);
      const description = e.target.dataset.description;
      const userId = e.target.dataset.user;
      
      this.simulateSuccessfulPayment(planType, amount, description, userId);
      modal.remove();
    });

    modal.querySelector('.btn-test-failed').addEventListener('click', (e) => {
      const planType = e.target.dataset.plan;
      const amount = parseFloat(e.target.dataset.amount);
      const description = e.target.dataset.description;
      const userId = e.target.dataset.user;
      
      this.simulateFailedPayment(planType, amount, description, userId);
      modal.remove();
    });

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Simula un pago exitoso
   */
  async simulateSuccessfulPayment(planType, amount, description, userId) {
    try {
      console.log('🎉 Simulando pago exitoso...');
      
      // Simular datos de transacción
      const transactionData = {
        id: `test_${Date.now()}`,
        amount_in_cents: amount * 100,
        currency: 'COP',
        status: 'APPROVED',
        reference: `TEST_${planType}_${Date.now()}`,
        customer_email: this.getCurrentUserEmail()
      };

      // Actualizar membresía
      await this.updateUserMembership(userId, planType, transactionData);
      
      // Mostrar confirmación
      this.showPaymentSuccess(planType);
      
      // Redirigir a la página de éxito
      setTimeout(() => {
        window.location.href = `${window.location.pathname}?payment=success&plan=${planType}&test=true`;
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error simulando pago:', error);
      this.showError('Error simulando el pago: ' + error.message);
    }
  }

  /**
   * Simula un pago fallido
   */
  async simulateFailedPayment(planType, amount, description, userId) {
    console.log('❌ Simulando pago fallido...');
    this.showError('Pago fallido - Simulación de error');
  }

  /**
   * Actualiza la membresía del usuario
   */
  async updateUserMembership(userId, plan, transactionData) {
    try {
      console.log('📝 Actualizando membresía:', { userId, plan });

      const membershipData = {
        plan: plan,
        status: 'active',
        startDate: new Date(),
        endDate: this.calculateEndDate(plan),
        paymentMethod: 'wompi_test',
        transactionId: transactionData.id,
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
        amount: transactionData.amount_in_cents / 100,
        currency: transactionData.currency,
        status: 'completed',
        paymentMethod: 'wompi_test',
        transactionId: transactionData.id,
        reference: transactionData.reference,
        timestamp: new Date()
      });

      console.log('✅ Membresía actualizada correctamente');
    } catch (error) {
      console.error('❌ Error actualizando membresía:', error);
      throw error;
    }
  }

  /**
   * Calcula la fecha de vencimiento
   */
  calculateEndDate(plan) {
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate;
  }

  /**
   * Obtiene el email del usuario actual
   */
  getCurrentUserEmail() {
    const user = firebase.auth().currentUser;
    return user ? user.email : 'test@example.com';
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
    modal.className = 'test-success-modal';
    modal.innerHTML = `
      <div class="test-success-content">
        <div class="success-icon">🎉</div>
        <h2>¡Pago Simulado Exitoso!</h2>
        <p>Tu ${planNames[plan]} ha sido activado correctamente.</p>
        <p><strong>Modo de Prueba:</strong> Este es un pago simulado.</p>
        <button class="btn-test-ok" onclick="this.closest('.test-success-modal').remove()">
          Continuar
        </button>
      </div>
    `;

    // Estilos
    const style = document.createElement('style');
    style.textContent = `
      .test-success-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10002;
      }
      
      .test-success-content {
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
      
      .btn-test-ok {
        background: #28a745;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 1rem;
      }
      
      .btn-test-ok:hover {
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
}

// Inicializar modo de prueba
document.addEventListener('DOMContentLoaded', () => {
  // Activar modo de prueba si hay ?test=true en la URL
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('test') === 'true') {
    localStorage.setItem('axyra_test_mode', 'true');
  }
  
  // Inicializar sistema de pruebas
  window.axyraTestPaymentSystem = new AxyraTestPaymentSystem();
});

// También inicializar si ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraTestPaymentSystem = new AxyraTestPaymentSystem();
  });
} else {
  window.axyraTestPaymentSystem = new AxyraTestPaymentSystem();
}
