// ========================================
// SISTEMA DUAL DE PAGOS - PAYPAL + WOMPI
// ========================================
// Sistema que combina PayPal y Wompi para máxima compatibilidad

class AxyraDualPaymentSystem {
  constructor() {
    this.paypalIntegration = null;
    this.wompiIntegration = null;
    this.isInitialized = false;

    this.init();
  }

  /**
   * Inicializa el sistema dual
   */
  async init() {
    try {
      // Esperar a que ambos sistemas estén disponibles
      await this.waitForPaymentSystems();

      this.setupEventListeners();
      this.createDualPaymentUI();
      this.isInitialized = true;

      console.log('✅ Sistema dual de pagos inicializado');
    } catch (error) {
      console.error('❌ Error inicializando sistema dual:', error);
    }
  }

  /**
   * Espera a que los sistemas de pago estén disponibles
   */
  async waitForPaymentSystems() {
    return new Promise((resolve) => {
      const checkSystems = () => {
        if (window.axyraPayPalIntegration && window.axyraWompiIntegration) {
          this.paypalIntegration = window.axyraPayPalIntegration;
          this.wompiIntegration = window.axyraWompiIntegration;
          resolve();
        } else {
          setTimeout(checkSystems, 100);
        }
      };
      checkSystems();
    });
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Escuchar eventos de actualización de plan
    window.addEventListener('plan-updated', (event) => {
      console.log('Plan actualizado desde sistema dual:', event.detail);
    });
  }

  /**
   * Crea la UI dual de pagos
   */
  createDualPaymentUI() {
    // Esta función se puede expandir para crear elementos de UI específicos
    console.log('UI dual de pagos creada');
  }

  /**
   * Crea botón de pago dual
   */
  createDualPaymentButton(planType, amount, description, userId) {
    const container = document.createElement('div');
    container.className = 'dual-payment-container';
    container.innerHTML = `
      <div class="payment-options">
        <h3>Elige tu método de pago:</h3>
          <div class="payment-methods">
            <button class="payment-method-btn paypal-btn" data-method="paypal">
              <i class="fab fa-paypal"></i>
              <span>PayPal</span>
              <small>Pagos Internacionales</small>
            </button>
            <button class="payment-method-btn wompi-btn" data-method="wompi">
              <i class="fas fa-credit-card"></i>
              <span>Wompi</span>
              <small>Pagos en Colombia</small>
            </button>
          </div>
      </div>
    `;

    // Estilos
    const styles = document.createElement('style');
    styles.textContent = `
      .dual-payment-container {
        background: #2a2a2a;
        border-radius: 12px;
        padding: 30px;
        margin: 20px 0;
        border: 1px solid #333;
      }
      
      .payment-options h3 {
        color: white;
        text-align: center;
        margin-bottom: 25px;
        font-size: 20px;
      }
      
      .payment-methods {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        max-width: 500px;
        margin: 0 auto;
      }
      
      .payment-method-btn {
        background: linear-gradient(135deg, #1a1a1a, #2d2d2d);
        border: 2px solid #333;
        border-radius: 12px;
        padding: 25px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-align: center;
        color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
      }
      
      .payment-method-btn:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
      }
      
      .paypal-btn:hover {
        border-color: #0070ba;
        box-shadow: 0 10px 30px rgba(0, 112, 186, 0.3);
      }
      
      .wompi-btn:hover {
        border-color: #00d4aa;
        box-shadow: 0 10px 30px rgba(0, 212, 170, 0.3);
      }
      
      .payment-method-btn i {
        font-size: 32px;
        margin-bottom: 5px;
      }
      
      .payment-method-btn span {
        font-size: 18px;
        font-weight: bold;
      }
      
      .payment-method-btn small {
        font-size: 12px;
        opacity: 0.7;
      }
      
      @media (max-width: 768px) {
        .payment-methods {
          grid-template-columns: 1fr;
          gap: 15px;
        }
      }
    `;

    document.head.appendChild(styles);

    // Event listeners para los botones
    container.querySelector('.paypal-btn').addEventListener('click', () => {
      this.handlePayPalPayment(planType, amount, description, userId);
    });

    container.querySelector('.wompi-btn').addEventListener('click', () => {
      this.handleWompiPayment(planType, amount, description, userId);
    });

    return container;
  }

  /**
   * Maneja pago con PayPal
   */
  async handlePayPalPayment(planType, amount, description, userId) {
    try {
      if (!window.axyraPayPalSimple) {
        throw new Error('Sistema PayPal no disponible');
      }

      // Cerrar modal actual
      this.hideDualPaymentModal();

      // Crear contenedor para el botón de PayPal
      const container = document.createElement('div');
      container.id = 'paypal-button-container';
      container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        min-width: 300px;
        text-align: center;
      `;

      container.innerHTML = `
        <h3>Procesando pago con PayPal</h3>
        <p>Redirigiendo a PayPal...</p>
        <div id="paypal-button-container"></div>
        <button onclick="this.parentElement.remove()" style="margin-top: 15px; padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">Cancelar</button>
      `;

      document.body.appendChild(container);

      // Procesar pago con PayPal
      await window.axyraPayPalSimple.processPayment(amount, description, planType, userId);

    } catch (error) {
      console.error('Error procesando pago PayPal:', error);
      this.showError('Error procesando pago con PayPal');
    }
  }

  /**
   * Maneja pago con Wompi
   */
  async handleWompiPayment(planType, amount, description, userId) {
    try {
      if (!this.wompiIntegration) {
        throw new Error('Sistema Wompi no disponible');
      }

      // Crear botón de Wompi
      const wompiButton = createWompiPaymentButton(planType, amount, description, userId);

      // Simular clic en el botón
      setTimeout(() => {
        wompiButton.click();
      }, 100);
    } catch (error) {
      console.error('Error procesando pago Wompi:', error);
      this.showError('Error procesando pago con Wompi');
    }
  }

  /**
   * Crea modal de selección de método de pago
   */
  showPaymentMethodModal(planType, amount, description, userId) {
    // Usar solo Wompi si está disponible
    if (window.axyraWompiOnlyPayment) {
      window.axyraWompiOnlyPayment.showPaymentModal(planType, amount, description, userId);
      return;
    }

    // Usar el sistema de fallback si está disponible
    if (window.axyraPaymentSystemFallback) {
      window.axyraPaymentSystemFallback.showPaymentMethodModal(planType, amount, description, userId);
      return;
    }

    // Fallback al sistema original
    const modal = document.createElement('div');
    modal.id = 'dual-payment-modal';
    modal.className = 'dual-payment-modal';
    modal.innerHTML = `
      <div class="dual-modal-content">
        <div class="dual-modal-header">
          <h2>💳 Seleccionar Método de Pago</h2>
          <button class="close-dual-modal">&times;</button>
        </div>
        
        <div class="dual-modal-body">
          <div class="plan-info">
            <h3>${description}</h3>
            <p class="plan-price">$${amount.toLocaleString()} COP</p>
          </div>
          
          <div class="payment-methods-grid">
            <div class="payment-option" data-method="paypal">
              <div class="payment-icon paypal-icon">
                <i class="fab fa-paypal"></i>
              </div>
              <h4>PayPal</h4>
              <p>Pago internacional seguro</p>
              <ul class="features">
                <li>✅ Tarjetas internacionales</li>
                <li>✅ PayPal balance</li>
                <li>✅ Protección del comprador</li>
              </ul>
              <button class="select-payment-btn paypal-select">
                Pagar con PayPal
              </button>
            </div>
            
            <div class="payment-option" data-method="wompi">
              <div class="payment-icon wompi-icon">
                <i class="fas fa-credit-card"></i>
              </div>
              <h4>Wompi</h4>
              <p>Pago local en Colombia</p>
              <ul class="features">
                <li>✅ Tarjetas colombianas</li>
                <li>✅ Nequi</li>
                <li>✅ Transferencia bancaria</li>
                <li>✅ QR Bancolombia</li>
              </ul>
              <button class="select-payment-btn wompi-select">
                Pagar con Wompi
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Estilos del modal
    const styles = document.createElement('style');
    styles.textContent = `
      .dual-payment-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
      }
      
      .dual-modal-content {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
        border-radius: 20px;
        padding: 40px;
        max-width: 800px;
        width: 95%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        border: 1px solid #333;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
      }
      
      .dual-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        border-bottom: 2px solid #333;
        padding-bottom: 20px;
      }
      
      .dual-modal-header h2 {
        color: white;
        font-size: 28px;
        font-weight: bold;
        margin: 0;
      }
      
      .close-dual-modal {
        background: none;
        border: none;
        font-size: 28px;
        cursor: pointer;
        color: #aaa;
        transition: color 0.3s;
      }
      
      .close-dual-modal:hover {
        color: white;
      }
      
      .plan-info {
        text-align: center;
        margin-bottom: 30px;
        color: white;
      }
      
      .plan-info h3 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      .plan-price {
        font-size: 32px;
        font-weight: bold;
        color: #00d4aa;
        margin: 0;
      }
      
      .payment-methods-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
      }
      
      .payment-option {
        background: #2a2a2a;
        border: 2px solid #333;
        border-radius: 15px;
        padding: 30px;
        text-align: center;
        transition: all 0.3s ease;
        color: white;
      }
      
      .payment-option:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
      }
      
      .payment-option[data-method="paypal"]:hover {
        border-color: #0070ba;
        box-shadow: 0 15px 40px rgba(0, 112, 186, 0.3);
      }
      
      .payment-option[data-method="wompi"]:hover {
        border-color: #00d4aa;
        box-shadow: 0 15px 40px rgba(0, 212, 170, 0.3);
      }
      
      .payment-icon {
        font-size: 48px;
        margin-bottom: 20px;
      }
      
      .paypal-icon {
        color: #0070ba;
      }
      
      .wompi-icon {
        color: #00d4aa;
      }
      
      .payment-option h4 {
        font-size: 24px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      
      .payment-option p {
        color: #ccc;
        margin-bottom: 20px;
        font-size: 16px;
      }
      
      .features {
        list-style: none;
        padding: 0;
        margin: 20px 0;
        text-align: left;
      }
      
      .features li {
        padding: 5px 0;
        color: #e0e0e0;
        font-size: 14px;
      }
      
      .select-payment-btn {
        background: linear-gradient(135deg, #333, #555);
        color: white;
        border: none;
        padding: 15px 30px;
        border-radius: 8px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        width: 100%;
        margin-top: 20px;
      }
      
      .paypal-select:hover {
        background: linear-gradient(135deg, #0070ba, #005ea6);
      }
      
      .wompi-select:hover {
        background: linear-gradient(135deg, #00d4aa, #00b894);
      }
      
      @media (max-width: 768px) {
        .payment-methods-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-dual-modal').addEventListener('click', () => {
      this.hideDualPaymentModal();
    });

    modal.querySelector('.paypal-select').addEventListener('click', () => {
      this.hideDualPaymentModal();
      this.handlePayPalPayment(planType, amount, description, userId);
    });

    modal.querySelector('.wompi-select').addEventListener('click', () => {
      this.hideDualPaymentModal();
      this.handleWompiPayment(planType, amount, description, userId);
    });

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideDualPaymentModal();
      }
    });
  }

  /**
   * Oculta el modal dual
   */
  hideDualPaymentModal() {
    const modal = document.getElementById('dual-payment-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * Muestra error
   */
  showError(message) {
    alert('❌ ' + message);
  }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  window.axyraDualPaymentSystem = new AxyraDualPaymentSystem();
});

// ========================================
// FUNCIONES GLOBALES
// ========================================

/**
 * Muestra modal de selección de método de pago
 */
function showPaymentMethodModal(planType, amount, description, userId) {
  if (window.axyraDualPaymentSystem) {
    window.axyraDualPaymentSystem.showPaymentMethodModal(planType, amount, description, userId);
  }
}

// ========================================
// EXPORTACIONES
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AxyraDualPaymentSystem, showPaymentMethodModal };
}
