/**
 * AXYRA Payment System - Fallback Version
 * Sistema de pagos enfocado en Wompi con fallback para PayPal
 */

class AxyraPaymentSystemFallback {
  constructor() {
    this.wompiAvailable = false;
    this.paypalAvailable = false;
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Sistema de Pagos AXYRA...');

    // Inicializar Wompi primero (más confiable)
    await this.initWompi();

    // Intentar PayPal como fallback
    await this.initPayPal();

    console.log('✅ Sistema de Pagos AXYRA inicializado');
  }

  async initWompi() {
    try {
      if (window.axyraWompiIntegration) {
        this.wompiAvailable = true;
        console.log('✅ Wompi disponible');
      } else {
        console.warn('⚠️ Wompi no disponible');
      }
    } catch (error) {
      console.warn('⚠️ Error inicializando Wompi:', error);
    }
  }

  async initPayPal() {
    try {
      // Verificar si PayPal está disponible
      if (window.axyraPayPalSimple && window.axyraPayPalSimple.isLoaded) {
        this.paypalAvailable = true;
        console.log('✅ PayPal disponible');
      } else {
        console.warn('⚠️ PayPal no disponible - usando solo Wompi');
      }
    } catch (error) {
      console.warn('⚠️ Error verificando PayPal:', error);
    }
  }

  /**
   * Muestra modal de selección de método de pago
   */
  showPaymentMethodModal(planType, amount, description, userId) {
    const modal = document.createElement('div');
    modal.id = 'payment-method-modal';
    modal.className = 'payment-method-modal';

    // Determinar métodos disponibles
    const availableMethods = [];
    if (this.wompiAvailable) {
      availableMethods.push({
        id: 'wompi',
        name: 'Wompi',
        icon: 'fas fa-credit-card',
        description: 'Pagos en Colombia',
        color: '#00D4AA',
      });
    }

    if (this.paypalAvailable) {
      availableMethods.push({
        id: 'paypal',
        name: 'PayPal',
        icon: 'fab fa-paypal',
        description: 'Pagos Internacionales',
        color: '#0070BA',
      });
    }

    // Si no hay métodos disponibles, mostrar mensaje
    if (availableMethods.length === 0) {
      this.showNoPaymentMethodsModal(planType, amount, description);
      return;
    }

    modal.innerHTML = `
            <div class="payment-modal-content">
                <div class="payment-modal-header">
                    <h2>💳 Seleccionar Método de Pago</h2>
                    <button class="close-payment-modal">&times;</button>
                </div>
                
                <div class="payment-modal-body">
                    <div class="plan-info">
                        <h3>${description}</h3>
                        <p class="plan-price">$${amount.toLocaleString()} COP</p>
                    </div>
                    
                    <div class="payment-methods">
                        ${availableMethods
                          .map(
                            (method) => `
                            <button class="payment-method-btn" data-method="${method.id}" style="--method-color: ${method.color}">
                                <i class="${method.icon}"></i>
                                <span>${method.name}</span>
                                <small>${method.description}</small>
                            </button>
                        `
                          )
                          .join('')}
                    </div>
                </div>
                
                <div class="payment-modal-footer">
                    <button class="btn-cancel">Cancelar</button>
                </div>
            </div>
        `;

    // Estilos del modal
    const fallbackStyle = document.createElement('style');
    style.textContent = `
            .payment-method-modal {
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
                animation: fadeIn 0.3s ease;
            }
            
            .payment-modal-content {
                background: white;
                border-radius: 16px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                max-height: 80vh;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }
            
            .payment-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .payment-modal-header h2 {
                margin: 0;
                color: #333;
                font-size: 24px;
            }
            
            .close-payment-modal {
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .plan-info {
                text-align: center;
                margin-bottom: 30px;
                padding: 20px;
                background: #f8f9fa;
                border-radius: 12px;
            }
            
            .plan-info h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 20px;
            }
            
            .plan-price {
                margin: 0;
                color: #0070BA;
                font-size: 28px;
                font-weight: bold;
            }
            
            .payment-methods {
                display: grid;
                gap: 15px;
                margin-bottom: 25px;
            }
            
            .payment-method-btn {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 20px;
                border: 2px solid #e0e0e0;
                border-radius: 12px;
                background: white;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: left;
            }
            
            .payment-method-btn:hover {
                border-color: var(--method-color);
                background: #f8f9fa;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }
            
            .payment-method-btn i {
                font-size: 24px;
                color: var(--method-color);
                width: 30px;
            }
            
            .payment-method-btn span {
                font-size: 18px;
                font-weight: bold;
                color: #333;
            }
            
            .payment-method-btn small {
                display: block;
                color: #666;
                font-size: 14px;
                margin-top: 2px;
            }
            
            .payment-modal-footer {
                text-align: center;
            }
            
            .btn-cancel {
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
                transition: background 0.3s ease;
            }
            
            .btn-cancel:hover {
                background: #5a6268;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
    document.head.appendChild(style);

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-payment-modal').addEventListener('click', () => {
      this.hidePaymentModal();
    });

    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      this.hidePaymentModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hidePaymentModal();
      }
    });

    // Botones de métodos de pago
    modal.querySelectorAll('.payment-method-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const method = btn.dataset.method;
        this.handlePaymentMethod(method, planType, amount, description, userId);
      });
    });
  }

  /**
   * Maneja la selección del método de pago
   */
  async handlePaymentMethod(method, planType, amount, description, userId) {
    this.hidePaymentModal();

    if (method === 'wompi' && this.wompiAvailable) {
      await this.handleWompiPayment(planType, amount, description, userId);
    } else if (method === 'paypal' && this.paypalAvailable) {
      await this.handlePayPalPayment(planType, amount, description, userId);
    } else {
      this.showError('Método de pago no disponible');
    }
  }

  /**
   * Maneja pago con Wompi
   */
  async handleWompiPayment(planType, amount, description, userId) {
    try {
      if (window.axyraWompiIntegration) {
        await window.axyraWompiIntegration.processPayment(planType, amount, description, userId);
      } else {
        throw new Error('Wompi no disponible');
      }
    } catch (error) {
      console.error('Error procesando pago Wompi:', error);
      this.showError('Error procesando pago con Wompi');
    }
  }

  /**
   * Maneja pago con PayPal
   */
  async handlePayPalPayment(planType, amount, description, userId) {
    try {
      if (window.axyraPayPalSimple && window.axyraPayPalSimple.isLoaded) {
        await window.axyraPayPalSimple.processPayment(amount, description, planType, userId);
      } else {
        throw new Error('PayPal no disponible');
      }
    } catch (error) {
      console.error('Error procesando pago PayPal:', error);
      this.showError('Error procesando pago con PayPal');
    }
  }

  /**
   * Muestra modal cuando no hay métodos de pago disponibles
   */
  showNoPaymentMethodsModal(planType, amount, description) {
    const modal = document.createElement('div');
    modal.className = 'no-payment-modal';
    modal.innerHTML = `
            <div class="no-payment-content">
                <div class="no-payment-icon">⚠️</div>
                <h3>Métodos de Pago No Disponibles</h3>
                <p>Por el momento, los sistemas de pago no están disponibles. Por favor, contacta con soporte.</p>
                <div class="plan-info">
                    <h4>${description}</h4>
                    <p class="plan-price">$${amount.toLocaleString()} COP</p>
                </div>
                <div class="contact-info">
                    <p><strong>Contacto:</strong> axyra.app@gmail.com</p>
                    <p><strong>WhatsApp:</strong> +57 300 123 4567</p>
                </div>
                <button class="btn-close-modal">Cerrar</button>
            </div>
        `;

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

    modal.querySelector('.btn-close-modal').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Oculta el modal de métodos de pago
   */
  hidePaymentModal() {
    const modal = document.getElementById('payment-method-modal');
    if (modal) {
      modal.remove();
    }
  }

  /**
   * Muestra mensaje de error
   */
  showError(message) {
    const notification = document.createElement('div');
    notification.className = 'payment-error-notification';
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
            z-index: 10001;
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
  window.axyraPaymentSystemFallback = new AxyraPaymentSystemFallback();
});

// Agregar estilos CSS
const fallbackStyle = document.createElement('style');
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
    
    .no-payment-content {
        background: white;
        padding: 40px;
        border-radius: 16px;
        text-align: center;
        max-width: 400px;
        width: 90%;
    }
    
    .no-payment-icon {
        font-size: 48px;
        margin-bottom: 20px;
    }
    
    .no-payment-content h3 {
        color: #333;
        margin-bottom: 15px;
    }
    
    .no-payment-content p {
        color: #666;
        margin-bottom: 20px;
    }
    
    .plan-info {
        background: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
    }
    
    .plan-price {
        font-size: 24px;
        font-weight: bold;
        color: #0070BA;
        margin: 5px 0;
    }
    
    .contact-info {
        background: #e9ecef;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
        text-align: left;
    }
    
    .btn-close-modal {
        background: #0070BA;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
    }
`;
document.head.appendChild(style);
