// ========================================
// SISTEMA DE RESTRICCIÓN POR PLANES - AXYRA
// ========================================
// Sistema para controlar acceso basado en planes de suscripción

class AxyraPlanRestrictionSystem {
  constructor() {
    this.currentUser = null;
    this.userPlan = 'free';
    this.planStatus = 'inactive';
    this.restrictedModules = ['gestion_personal', 'caja', 'inventario', 'configuracion'];
    this.planFeatures = {
      free: {
        name: 'Plan Gratuito',
        price: 0,
        features: ['dashboard', 'reportes_basicos'],
        restrictions: ['gestion_personal', 'caja', 'inventario', 'configuracion'],
      },
      basic: {
        name: 'Plan Básico',
        price: 49900,
        features: [
          'Hasta 10 empleados',
          'Reportes básicos',
          'Soporte por email',
          'Dashboard completo',
          'Gestión de empleados',
          'Cálculo de nóminas',
        ],
        restrictions: ['caja', 'inventario', 'configuracion'],
      },
      professional: {
        name: 'Plan Profesional',
        price: 129900,
        features: [
          'Hasta 50 empleados',
          'Reportes avanzados',
          'Soporte prioritario',
          'Dashboard avanzado',
          'Gestión completa de nóminas',
          'Inventario básico',
          'Integración con bancos',
          'Chat de IA profesional',
        ],
        restrictions: ['configuracion'],
      },
      enterprise: {
        name: 'Plan Empresarial',
        price: 259900,
        features: [
          'Empleados ilimitados',
          'Reportes ejecutivos',
          'Soporte 24/7',
          'Dashboard personalizado',
          'Gestión multi-sucursal',
          'Inventario completo',
          'Integraciones avanzadas',
          'IA avanzada',
          'Configuración avanzada',
        ],
        restrictions: [],
      },
    };

    this.init();
  }

  /**
   * Inicializa el sistema de restricciones
   */
  async init() {
    try {
      await this.loadUserData();
      this.setupEventListeners();
      this.applyRestrictions();
      this.createUpgradePrompts();
      console.log('✅ Sistema de restricciones inicializado');
    } catch (error) {
      console.error('❌ Error inicializando restricciones:', error);
    }
  }

  /**
   * Carga los datos del usuario actual
   */
  async loadUserData() {
    try {
      // Obtener usuario actual de Firebase
      const user = firebase.auth().currentUser;
      if (!user) {
        this.currentUser = null;
        return;
      }

      this.currentUser = user;

      // Verificar plan del usuario
      await this.checkUserPlan(user.uid);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    }
  }

  /**
   * Verifica el plan del usuario
   */
  async checkUserPlan(userId) {
    try {
      const response = await fetch(`/api/checkUserPlan?userId=${userId}`);
      const data = await response.json();

      if (data.success !== false) {
        this.userPlan = data.plan || 'free';
        this.planStatus = data.status || 'inactive';
        this.hasAccess = data.hasAccess || false;
      }
    } catch (error) {
      console.error('Error verificando plan del usuario:', error);
      this.userPlan = 'free';
      this.planStatus = 'inactive';
      this.hasAccess = false;
    }
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    // Escuchar cambios de autenticación
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
        this.loadUserData();
      } else {
        this.currentUser = null;
        this.userPlan = 'free';
        this.planStatus = 'inactive';
        this.hasAccess = false;
        this.applyRestrictions();
      }
    });

    // Escuchar eventos de actualización de plan
    window.addEventListener('plan-updated', (event) => {
      this.userPlan = event.detail.plan;
      this.planStatus = event.detail.status;
      this.hasAccess = event.detail.hasAccess;
      this.applyRestrictions();
    });
  }

  /**
   * Aplica las restricciones según el plan
   */
  applyRestrictions() {
    const currentPlan = this.planFeatures[this.userPlan];
    if (!currentPlan) return;

    // Ocultar módulos restringidos
    this.restrictedModules.forEach((module) => {
      this.restrictModule(module, currentPlan.restrictions.includes(module));
    });

    // Mostrar/ocultar elementos según el plan
    this.updatePlanIndicators();
  }

  /**
   * Restringe un módulo específico
   */
  restrictModule(moduleName, isRestricted) {
    const moduleElements = document.querySelectorAll(`[data-module="${moduleName}"]`);

    moduleElements.forEach((element) => {
      if (isRestricted) {
        element.classList.add('restricted-module');
        element.style.opacity = '0.5';
        element.style.pointerEvents = 'none';

        // Agregar overlay de restricción
        this.addRestrictionOverlay(element, moduleName);
      } else {
        element.classList.remove('restricted-module');
        element.style.opacity = '1';
        element.style.pointerEvents = 'auto';

        // Remover overlay de restricción
        this.removeRestrictionOverlay(element);
      }
    });
  }

  /**
   * Agrega overlay de restricción
   */
  addRestrictionOverlay(element, moduleName) {
    // Verificar si ya tiene overlay
    if (element.querySelector('.restriction-overlay')) return;

    const overlay = document.createElement('div');
    overlay.className = 'restriction-overlay';
    overlay.innerHTML = `
      <div class="restriction-content">
        <div class="restriction-icon">🔒</div>
        <h3>Módulo Restringido</h3>
        <p>Este módulo requiere un plan de pago</p>
        <button class="btn-upgrade-plan" data-module="${moduleName}">
          Actualizar Plan
        </button>
      </div>
    `;

    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: 8px;
    `;

    element.style.position = 'relative';
    element.appendChild(overlay);

    // Event listener para botón de actualización
    overlay.querySelector('.btn-upgrade-plan').addEventListener('click', (e) => {
      e.stopPropagation();
      this.showUpgradeModal(moduleName);
    });
  }

  /**
   * Remueve overlay de restricción
   */
  removeRestrictionOverlay(element) {
    const overlay = element.querySelector('.restriction-overlay');
    if (overlay) {
      overlay.remove();
    }
  }

  /**
   * Actualiza indicadores de plan
   */
  updatePlanIndicators() {
    // Actualizar indicador de plan en la UI
    const planIndicators = document.querySelectorAll('.plan-indicator');
    planIndicators.forEach((indicator) => {
      indicator.textContent = this.planFeatures[this.userPlan].name;
      indicator.className = `plan-indicator plan-${this.userPlan}`;
    });

    // Mostrar/ocultar botones de actualización
    const upgradeButtons = document.querySelectorAll('.btn-upgrade');
    upgradeButtons.forEach((button) => {
      if (this.userPlan === 'free' || this.userPlan === 'basic') {
        button.style.display = 'inline-block';
      } else {
        button.style.display = 'none';
      }
    });
  }

  /**
   * Crea prompts de actualización
   */
  createUpgradePrompts() {
    // Crear modal de actualización si no existe
    if (!document.getElementById('upgrade-plan-modal')) {
      this.createUpgradeModal();
    }
  }

  /**
   * Crea modal de actualización de plan
   */
  createUpgradeModal() {
    const modal = document.createElement('div');
    modal.id = 'upgrade-plan-modal';
    modal.className = 'upgrade-modal';
    modal.style.cssText = `
       position: fixed;
       top: 0;
       left: 0;
       width: 100%;
       height: 100%;
       background: rgba(0, 0, 0, 0.95);
       display: none;
       justify-content: center;
       align-items: center;
       z-index: 10000;
       backdrop-filter: blur(10px);
     `;

    modal.innerHTML = `
      <div class="upgrade-modal-content">
        <div class="upgrade-header">
          <h2>🚀 Actualizar Plan</h2>
          <button class="close-modal">&times;</button>
        </div>
        
        <div class="upgrade-body">
          <p>Desbloquea todas las funcionalidades de AXYRA</p>
          
           <div class="plans-grid">
             <div class="plan-card" data-plan="basic">
               <h3>Plan Básico</h3>
               <div class="price">$49,900<span>/mes</span></div>
               <p class="plan-description">Perfecto para pequeñas empresas que están comenzando</p>
               <ul class="features">
                 <li>✅ Hasta 10 empleados</li>
                 <li>✅ Reportes básicos</li>
                 <li>✅ Soporte por email</li>
                 <li>✅ Dashboard completo</li>
                 <li>✅ Gestión de empleados</li>
                 <li>✅ Cálculo de nóminas</li>
               </ul>
               <button class="btn-select-plan" data-plan="basic">ELEGIR BÁSICO</button>
             </div>
             
             <div class="plan-card featured" data-plan="professional">
               <div class="badge">MÁS POPULAR</div>
               <h3>Plan Profesional</h3>
               <div class="price">$129,900<span>/mes</span></div>
               <p class="plan-description">Ideal para empresas en crecimiento y establecidas</p>
               <ul class="features">
                 <li>✅ Hasta 50 empleados</li>
                 <li>✅ Reportes avanzados</li>
                 <li>✅ Soporte prioritario</li>
                 <li>✅ Dashboard avanzado</li>
                 <li>✅ Gestión completa de nóminas</li>
                 <li>✅ Inventario básico</li>
                 <li>✅ Integración con bancos</li>
                 <li>✅ Chat de IA profesional</li>
               </ul>
               <button class="btn-select-plan" data-plan="professional">ELEGIR PROFESIONAL</button>
             </div>
             
             <div class="plan-card" data-plan="enterprise">
               <div class="badge">PREMIUM</div>
               <h3>Plan Empresarial</h3>
               <div class="price">$259,900<span>/mes</span></div>
               <p class="plan-description">Para grandes empresas con necesidades complejas</p>
               <ul class="features">
                 <li>✅ Empleados ilimitados</li>
                 <li>✅ Reportes ejecutivos</li>
                 <li>✅ Soporte 24/7</li>
                 <li>✅ Dashboard personalizado</li>
                 <li>✅ Gestión multi-sucursal</li>
                 <li>✅ Inventario completo</li>
                 <li>✅ Integraciones avanzadas</li>
                 <li>✅ IA avanzada</li>
               </ul>
               <button class="btn-select-plan" data-plan="enterprise">ELEGIR EMPRESARIAL</button>
             </div>
           </div>
        </div>
      </div>
    `;

    // Estilos CSS
    const styles = document.createElement('style');
    styles.textContent = `
       .upgrade-modal-content {
         background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
         border-radius: 20px;
         padding: 40px;
         max-width: 1000px;
         width: 95%;
         max-height: 90vh;
         overflow-y: auto;
         position: relative;
         border: 1px solid #333;
         box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
       }
      
       .upgrade-header {
         display: flex;
         justify-content: space-between;
         align-items: center;
         margin-bottom: 30px;
         border-bottom: 2px solid #333;
         padding-bottom: 20px;
       }
       
       .upgrade-header h2 {
         color: white;
         font-size: 28px;
         font-weight: bold;
         margin: 0;
       }
       
       .close-modal {
         background: none;
         border: none;
         font-size: 28px;
         cursor: pointer;
         color: #aaa;
         transition: color 0.3s;
       }
       
       .close-modal:hover {
         color: white;
       }
       
       .upgrade-body p {
         color: #ccc;
         font-size: 16px;
         text-align: center;
         margin-bottom: 30px;
       }
      
      .plans-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 30px;
        margin-top: 20px;
      }
      
      @media (max-width: 768px) {
        .plans-grid {
          grid-template-columns: 1fr;
          gap: 20px;
        }
        
        .plan-card.featured {
          transform: none;
        }
      }
      
       .plan-card {
         border: 2px solid #333;
         border-radius: 12px;
         padding: 30px;
         text-align: center;
         position: relative;
         transition: all 0.3s;
         background: #1a1a1a;
         color: white;
         min-height: 500px;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
       }
       
       .plan-card:hover {
         border-color: #0070ba;
         transform: translateY(-5px);
         box-shadow: 0 10px 30px rgba(0, 112, 186, 0.3);
       }
       
       .plan-card.featured {
         border-color: #0070ba;
         background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
         transform: scale(1.05);
       }
      
       .badge {
         position: absolute;
         top: -15px;
         left: 50%;
         transform: translateX(-50%);
         background: linear-gradient(135deg, #ff6b6b, #ee5a52);
         color: white;
         padding: 8px 20px;
         border-radius: 20px;
         font-size: 12px;
         font-weight: bold;
         text-transform: uppercase;
         letter-spacing: 1px;
         box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
       }
       
       .price {
         font-size: 36px;
         font-weight: 900;
         color: #0070ba;
         margin: 20px 0 10px 0;
         text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
       }
       
       .price span {
         font-size: 18px;
         color: #aaa;
         font-weight: 400;
       }
       
       .plan-description {
         color: #ccc;
         font-size: 14px;
         margin: 10px 0 20px 0;
         line-height: 1.4;
       }
      
       .features {
         list-style: none;
         padding: 0;
         margin: 20px 0;
         flex-grow: 1;
       }
       
       .features li {
         padding: 8px 0;
         text-align: left;
         color: #e0e0e0;
         font-size: 14px;
         border-bottom: 1px solid #333;
       }
       
       .features li:last-child {
         border-bottom: none;
       }
       
       .btn-select-plan {
         background: linear-gradient(135deg, #0070ba, #005ea6);
         color: white;
         border: none;
         padding: 15px 30px;
         border-radius: 8px;
         cursor: pointer;
         font-size: 16px;
         font-weight: bold;
         width: 100%;
         transition: all 0.3s;
         text-transform: uppercase;
         letter-spacing: 1px;
         box-shadow: 0 4px 15px rgba(0, 112, 186, 0.3);
         margin-top: 20px;
       }
       
       .btn-select-plan:hover {
         background: linear-gradient(135deg, #005ea6, #004c8c);
         transform: translateY(-2px);
         box-shadow: 0 6px 20px rgba(0, 112, 186, 0.4);
       }
      
      .restricted-module {
        position: relative;
      }
      
      .restriction-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        border-radius: 8px;
      }
      
      .restriction-content {
        text-align: center;
        color: white;
        padding: 20px;
      }
      
      .restriction-icon {
        font-size: 48px;
        margin-bottom: 15px;
      }
      
      .btn-upgrade-plan {
        background: #0070ba;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 6px;
        cursor: pointer;
        margin-top: 15px;
      }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-modal').addEventListener('click', () => {
      this.hideUpgradeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.hideUpgradeModal();
      }
    });

    // Event listeners para botones de plan
    modal.querySelectorAll('.btn-select-plan').forEach((button) => {
      button.addEventListener('click', (e) => {
        const plan = e.target.dataset.plan;
        this.processPlanUpgrade(plan);
      });
    });
  }

  /**
   * Muestra modal de actualización
   */
  showUpgradeModal(moduleName = null) {
    const modal = document.getElementById('upgrade-plan-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  /**
   * Oculta modal de actualización
   */
  hideUpgradeModal() {
    const modal = document.getElementById('upgrade-plan-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  /**
   * Procesa actualización de plan
   */
  async processPlanUpgrade(planType) {
    if (!this.currentUser) {
      this.showError('Debes iniciar sesión para actualizar tu plan');
      return;
    }

    try {
      // Mostrar loading
      this.showLoading('Procesando actualización...');

      // Crear botón de pago PayPal
      const payButton = this.createPayPalPaymentButton(planType);

      // Mostrar modal de pago
      this.showPaymentModal(payButton, planType);
    } catch (error) {
      console.error('Error procesando actualización:', error);
      this.showError('Error procesando la actualización');
    }
  }

  /**
   * Crea botón de pago PayPal
   */
  createPayPalPaymentButton(planType) {
    const planPrices = {
      basic: 49900,
      professional: 129900,
      enterprise: 259900,
    };

    const planNames = {
      basic: 'Plan Básico',
      professional: 'Plan Profesional',
      enterprise: 'Plan Empresarial',
    };

    const button = document.createElement('button');
    button.className = 'btn btn-paypal';
    button.dataset.paypalPayment = 'true';
    button.dataset.amount = planPrices[planType];
    button.dataset.description = planNames[planType];
    button.dataset.currency = 'COP';
    button.dataset.planType = planType;
    button.dataset.userId = this.currentUser.uid;

    button.innerHTML = `
      <i class="fab fa-paypal"></i>
      Pagar $${planPrices[planType].toLocaleString()} COP
    `;

    return button;
  }

  /**
   * Muestra modal de pago
   */
  showPaymentModal(payButton, planType) {
    // Simular clic en el botón de PayPal
    setTimeout(() => {
      payButton.click();
    }, 100);
  }

  /**
   * Muestra loading
   */
  showLoading(message) {
    // Implementar loading
    console.log('Loading:', message);
  }

  /**
   * Muestra error
   */
  showError(message) {
    alert(message);
  }

  /**
   * Verifica si el usuario tiene acceso a un módulo
   */
  hasModuleAccess(moduleName) {
    const currentPlan = this.planFeatures[this.userPlan];
    return !currentPlan.restrictions.includes(moduleName);
  }

  /**
   * Obtiene el plan actual del usuario
   */
  getCurrentPlan() {
    return {
      plan: this.userPlan,
      status: this.planStatus,
      hasAccess: this.hasAccess,
      features: this.planFeatures[this.userPlan],
    };
  }
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  window.axyraPlanRestriction = new AxyraPlanRestrictionSystem();
});

// ========================================
// FUNCIONES GLOBALES
// ========================================

/**
 * Verifica acceso a un módulo
 */
function checkModuleAccess(moduleName) {
  if (window.axyraPlanRestriction) {
    return window.axyraPlanRestriction.hasModuleAccess(moduleName);
  }
  return false;
}

/**
 * Obtiene información del plan actual
 */
function getCurrentPlanInfo() {
  if (window.axyraPlanRestriction) {
    return window.axyraPlanRestriction.getCurrentPlan();
  }
  return null;
}

// ========================================
// EXPORTACIONES
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AxyraPlanRestrictionSystem, checkModuleAccess, getCurrentPlanInfo };
}
