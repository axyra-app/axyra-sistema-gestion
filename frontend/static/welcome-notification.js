/**
 * AXYRA - Sistema de Notificaciones de Bienvenida
 * Muestra notificaciones elegantes después del pago
 */

class AxyraWelcomeNotification {
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

    if (paymentSuccess === 'success' && plan) {
      console.log('🎉 Pago exitoso detectado:', { plan });
      this.showWelcomeNotification(plan);
    }
  }

  /**
   * Muestra la notificación de bienvenida
   */
  showWelcomeNotification(plan) {
    const planNames = {
      basic: 'Plan Básico',
      professional: 'Plan Profesional',
      enterprise: 'Plan Empresarial'
    };

    const planDescriptions = {
      basic: 'Hasta 10 empleados, reportes básicos y soporte por email',
      professional: 'Hasta 50 empleados, reportes avanzados y soporte prioritario',
      enterprise: 'Empleados ilimitados, reportes personalizados y soporte 24/7'
    };

    const planColors = {
      basic: '#28a745',
      professional: '#007bff',
      enterprise: '#6f42c1'
    };

    const modal = document.createElement('div');
    modal.className = 'welcome-notification-modal';
    modal.innerHTML = `
      <div class="welcome-content">
        <div class="welcome-header">
          <div class="success-icon">🎉</div>
          <h1>¡Bienvenido a Axyra!</h1>
          <p class="welcome-subtitle">Gracias por confiar en nuestro sistema</p>
        </div>
        
        <div class="plan-info">
          <div class="plan-badge" style="background: ${planColors[plan]}">
            ${planNames[plan]}
          </div>
          <p class="plan-description">${planDescriptions[plan]}</p>
        </div>

        <div class="features-preview">
          <h3>¿Qué puedes hacer ahora?</h3>
          <div class="features-grid">
            <div class="feature-item">
              <div class="feature-icon">👥</div>
              <span>Gestionar empleados</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📊</div>
              <span>Generar reportes</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">💰</div>
              <span>Calcular nóminas</span>
            </div>
            <div class="feature-item">
              <div class="feature-icon">📱</div>
              <span>Acceso móvil</span>
            </div>
          </div>
        </div>

        <div class="welcome-actions">
          <button class="btn-primary" onclick="this.goToDashboard()">
            <i class="fas fa-tachometer-alt"></i>
            Ir al Dashboard
          </button>
          <button class="btn-secondary" onclick="this.closeWelcome()">
            <i class="fas fa-times"></i>
            Cerrar
          </button>
        </div>

      </div>
    `;

    // Estilos
    const style = document.createElement('style');
    style.textContent = `
      .welcome-notification-modal {
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
        animation: fadeIn 0.3s ease-out;
      }
      
      .welcome-content {
        background: white;
        border-radius: 20px;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.4s ease-out;
      }
      
      .welcome-header {
        text-align: center;
        padding: 2rem 2rem 1rem;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border-radius: 20px 20px 0 0;
      }
      
      .success-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
        animation: bounce 1s ease-in-out;
      }
      
      .welcome-header h1 {
        margin: 0 0 0.5rem;
        font-size: 2.5rem;
        font-weight: bold;
      }
      
      .welcome-subtitle {
        margin: 0;
        font-size: 1.2rem;
        opacity: 0.9;
      }
      
      .plan-info {
        padding: 2rem;
        text-align: center;
        background: #f8f9fa;
      }
      
      .plan-badge {
        display: inline-block;
        color: white;
        padding: 0.8rem 2rem;
        border-radius: 50px;
        font-size: 1.3rem;
        font-weight: bold;
        margin-bottom: 1rem;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      }
      
      .plan-description {
        margin: 0;
        color: #666;
        font-size: 1.1rem;
      }
      
      .features-preview {
        padding: 2rem;
      }
      
      .features-preview h3 {
        text-align: center;
        margin-bottom: 1.5rem;
        color: #333;
        font-size: 1.4rem;
      }
      
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
      }
      
      .feature-item {
        text-align: center;
        padding: 1rem;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        transition: transform 0.2s ease;
      }
      
      .feature-item:hover {
        transform: translateY(-2px);
      }
      
      .feature-icon {
        font-size: 2rem;
        margin-bottom: 0.5rem;
      }
      
      .feature-item span {
        display: block;
        font-size: 0.9rem;
        color: #666;
        font-weight: 500;
      }
      
      .welcome-actions {
        padding: 2rem;
        display: flex;
        gap: 1rem;
        justify-content: center;
        flex-wrap: wrap;
      }
      
      .btn-primary, .btn-secondary {
        padding: 1rem 2rem;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
        min-width: 180px;
        justify-content: center;
      }
      
      .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      }
      
      .btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
      
      .btn-secondary {
        background: #6c757d;
        color: white;
      }
      
      .btn-secondary:hover {
        background: #5a6268;
        transform: translateY(-2px);
      }
      
      
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideUp {
        from { 
          opacity: 0;
          transform: translateY(50px);
        }
        to { 
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes bounce {
        0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
        40% { transform: translateY(-10px); }
        60% { transform: translateY(-5px); }
      }
      
      @media (max-width: 768px) {
        .welcome-content {
          width: 95%;
          margin: 1rem;
        }
        
        .welcome-header h1 {
          font-size: 2rem;
        }
        
        .features-grid {
          grid-template-columns: repeat(2, 1fr);
        }
        
        .welcome-actions {
          flex-direction: column;
          align-items: center;
        }
        
        .btn-primary, .btn-secondary {
          width: 100%;
          max-width: 300px;
        }
      }
    `;

    document.head.appendChild(style);
    document.body.appendChild(modal);

    // Agregar funciones al botón
    modal.querySelector('.btn-primary').goToDashboard = () => {
      this.goToDashboard();
    };

    modal.querySelector('.btn-secondary').closeWelcome = () => {
      this.closeWelcome();
    };

    // Cerrar al hacer clic fuera del modal
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeWelcome();
      }
    });

    // Limpiar URL después de mostrar la notificación
    setTimeout(() => {
      this.cleanUrl();
    }, 1000);
  }

  /**
   * Va al dashboard
   */
  goToDashboard() {
    // Limpiar URL primero
    this.cleanUrl();
    
    // Redirigir al dashboard
    window.location.href = '/modulos/dashboard/dashboard.html';
  }

  /**
   * Cierra la notificación
   */
  closeWelcome() {
    const modal = document.querySelector('.welcome-notification-modal');
    if (modal) {
      modal.remove();
    }
    
    // Limpiar URL
    this.cleanUrl();
  }

  /**
   * Limpia la URL de parámetros de pago
   */
  cleanUrl() {
    const url = new URL(window.location);
    url.searchParams.delete('payment');
    url.searchParams.delete('plan');
    
    window.history.replaceState({}, '', url);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraWelcomeNotification = new AxyraWelcomeNotification();
});

// También inicializar si ya está cargado
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraWelcomeNotification = new AxyraWelcomeNotification();
  });
} else {
  window.axyraWelcomeNotification = new AxyraWelcomeNotification();
}
