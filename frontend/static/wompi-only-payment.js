/**
 * AXYRA Wompi Only Payment System
 * Sistema de pagos enfocado únicamente en Wompi
 */

class AxyraWompiOnlyPayment {
  constructor() {
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Sistema Wompi AXYRA...');

    if (window.axyraWompiIntegration) {
      console.log('✅ Wompi disponible');
    } else {
      console.warn('⚠️ Wompi no disponible');
    }
  }

  /**
   * Muestra modal de pago con Wompi
   */
  showPaymentModal(planType, amount, description, userId) {
    // Validar que amount sea un número válido
    if (!amount || isNaN(amount) || amount <= 0) {
      console.error('❌ Amount inválido:', amount);
      this.showError('Error: Monto inválido para el pago');
      return;
    }

    const modal = document.createElement('div');
    modal.id = 'wompi-payment-modal';
    modal.className = 'wompi-payment-modal';

    modal.innerHTML = `
            <div class="wompi-modal-content">
                <div class="wompi-modal-header">
                    <h2>💳 Pago con Wompi</h2>
                    <button class="close-wompi-modal">&times;</button>
                </div>
                
                <div class="wompi-modal-body">
                    <div class="plan-info">
                        <h3>${description}</h3>
                        <p class="plan-price">$${amount ? amount.toLocaleString() : '0'} COP</p>
                    </div>
                    
                    <div class="wompi-payment-section">
                        <div class="wompi-logo">
                            <i class="fas fa-credit-card"></i>
                            <span>Wompi</span>
                        </div>
                        <p>Pago seguro en Colombia</p>
                        <button class="btn-pay-wompi" data-plan="${planType}" data-amount="${amount}" data-description="${description}" data-user="${userId}">
                            <i class="fas fa-credit-card"></i>
                            Pagar con Wompi
                        </button>
                    </div>
                </div>
                
                <div class="wompi-modal-footer">
                    <button class="btn-cancel">Cancelar</button>
                </div>
            </div>
        `;

    // Estilos
    const style = document.createElement('style');
    style.textContent = `
            .wompi-payment-modal {
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
            
            .wompi-modal-content {
                background: white;
                border-radius: 16px;
                padding: 30px;
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.3s ease;
            }
            
            .wompi-modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 15px;
                border-bottom: 2px solid #f0f0f0;
            }
            
            .wompi-modal-header h2 {
                margin: 0;
                color: #333;
                font-size: 24px;
            }
            
            .close-wompi-modal {
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #666;
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
                color: #00D4AA;
                font-size: 28px;
                font-weight: bold;
            }
            
            .wompi-payment-section {
                text-align: center;
                margin-bottom: 25px;
            }
            
            .wompi-logo {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                margin-bottom: 15px;
                font-size: 24px;
                color: #00D4AA;
                font-weight: bold;
            }
            
            .wompi-logo i {
                font-size: 28px;
            }
            
            .btn-pay-wompi {
                background: #00D4AA;
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 8px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 10px;
                margin: 0 auto;
            }
            
            .btn-pay-wompi:hover {
                background: #00B894;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
            }
            
            .btn-cancel {
                background: #6c757d;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 16px;
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
    modal.querySelector('.close-wompi-modal').addEventListener('click', () => {
      modal.remove();
    });

    modal.querySelector('.btn-cancel').addEventListener('click', () => {
      modal.remove();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Botón de pago Wompi
    modal.querySelector('.btn-pay-wompi').addEventListener('click', async (e) => {
      const planType = e.target.dataset.plan;
      const amount = parseFloat(e.target.dataset.amount);
      const description = e.target.dataset.description;
      const userId = e.target.dataset.user;

      try {
        if (window.axyraWompiIntegration) {
          await window.axyraWompiIntegration.processPayment(planType, amount, description, userId);
          modal.remove();
        } else {
          throw new Error('Wompi no disponible');
        }
      } catch (error) {
        console.error('Error procesando pago Wompi:', error);
        this.showError('Error procesando pago con Wompi');
      }
    });
  }

  showError(message) {
    const notification = document.createElement('div');
    notification.className = 'wompi-error-notification';
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
  window.axyraWompiOnlyPayment = new AxyraWompiOnlyPayment();
});
