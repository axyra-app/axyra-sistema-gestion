/**
 * AXYRA - Sistema de Onboarding
 * Guía a nuevos usuarios a través del proceso de registro y configuración
 */

class AxyraOnboardingSystem {
  constructor() {
    this.steps = [];
    this.currentStep = 0;
    this.userProgress = {};
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('🎯 Inicializando sistema de onboarding...');
    this.setupSteps();
    this.loadUserProgress();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  setupSteps() {
    this.steps = [
      {
        id: 'welcome',
        title: '¡Bienvenido a AXYRA!',
        description: 'Te guiaremos paso a paso para configurar tu cuenta',
        component: 'welcome',
        isCompleted: false
      },
      {
        id: 'company_info',
        title: 'Información de tu Empresa',
        description: 'Configura los datos básicos de tu empresa',
        component: 'company_info',
        isCompleted: false
      },
      {
        id: 'payment_setup',
        title: 'Configuración de Pagos',
        description: 'Selecciona tu plan y método de pago',
        component: 'payment_setup',
        isCompleted: false
      },
      {
        id: 'team_setup',
        title: 'Configuración del Equipo',
        description: 'Agrega los primeros empleados a tu sistema',
        component: 'team_setup',
        isCompleted: false
      },
      {
        id: 'system_tour',
        title: 'Tour del Sistema',
        description: 'Conoce las principales funcionalidades',
        component: 'system_tour',
        isCompleted: false
      },
      {
        id: 'completion',
        title: '¡Configuración Completa!',
        description: 'Ya estás listo para usar AXYRA',
        component: 'completion',
        isCompleted: false
      }
    ];
  }

  loadUserProgress() {
    try {
      const stored = localStorage.getItem('axyra_onboarding_progress');
      if (stored) {
        this.userProgress = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando progreso de onboarding:', error);
    }
  }

  saveUserProgress() {
    try {
      localStorage.setItem('axyra_onboarding_progress', JSON.stringify(this.userProgress));
    } catch (error) {
      console.error('Error guardando progreso de onboarding:', error);
    }
  }

  setupEventListeners() {
    // Escuchar eventos de onboarding
    document.addEventListener('onboardingStepCompleted', (event) => {
      this.handleStepCompleted(event.detail);
    });
  }

  handleStepCompleted(stepData) {
    const { stepId, data } = stepData;
    
    // Marcar paso como completado
    const step = this.steps.find(s => s.id === stepId);
    if (step) {
      step.isCompleted = true;
    }

    // Guardar datos del usuario
    this.userProgress[stepId] = data;
    this.saveUserProgress();

    // Avanzar al siguiente paso
    this.nextStep();
  }

  startOnboarding() {
    this.currentStep = 0;
    this.showOnboardingModal();
  }

  showOnboardingModal() {
    const modal = document.createElement('div');
    modal.id = 'onboarding-modal';
    modal.innerHTML = `
      <div class="onboarding-overlay">
        <div class="onboarding-container">
          <div class="onboarding-header">
            <div class="onboarding-progress">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${(this.currentStep / this.steps.length) * 100}%"></div>
              </div>
              <span class="progress-text">Paso ${this.currentStep + 1} de ${this.steps.length}</span>
            </div>
            <button class="btn-close" onclick="axyraOnboardingSystem.closeOnboarding()">×</button>
          </div>
          <div class="onboarding-content">
            ${this.renderCurrentStep()}
          </div>
          <div class="onboarding-footer">
            <button class="btn btn-secondary" onclick="axyraOnboardingSystem.previousStep()" ${this.currentStep === 0 ? 'disabled' : ''}>
              Anterior
            </button>
            <button class="btn btn-primary" onclick="axyraOnboardingSystem.nextStep()">
              ${this.currentStep === this.steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </button>
          </div>
        </div>
      </div>
    `;

    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(modal);
  }

  renderCurrentStep() {
    const step = this.steps[this.currentStep];
    
    switch (step.component) {
      case 'welcome':
        return this.renderWelcomeStep();
      case 'company_info':
        return this.renderCompanyInfoStep();
      case 'payment_setup':
        return this.renderPaymentSetupStep();
      case 'team_setup':
        return this.renderTeamSetupStep();
      case 'system_tour':
        return this.renderSystemTourStep();
      case 'completion':
        return this.renderCompletionStep();
      default:
        return '<p>Paso no encontrado</p>';
    }
  }

  renderWelcomeStep() {
    return `
      <div class="onboarding-step">
        <div class="step-icon">🎉</div>
        <h2>${this.steps[this.currentStep].title}</h2>
        <p>${this.steps[this.currentStep].description}</p>
        <div class="welcome-features">
          <div class="feature-item">
            <i class="fas fa-users"></i>
            <span>Gestión de Empleados</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-clock"></i>
            <span>Control de Horas</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-calculator"></i>
            <span>Cálculo de Nómina</span>
          </div>
          <div class="feature-item">
            <i class="fas fa-chart-bar"></i>
            <span>Reportes Avanzados</span>
          </div>
        </div>
      </div>
    `;
  }

  renderCompanyInfoStep() {
    return `
      <div class="onboarding-step">
        <div class="step-icon">🏢</div>
        <h2>${this.steps[this.currentStep].title}</h2>
        <p>${this.steps[this.currentStep].description}</p>
        <form id="company-info-form" class="onboarding-form">
          <div class="form-group">
            <label for="companyName">Nombre de la Empresa *</label>
            <input type="text" id="companyName" required placeholder="Ej: Mi Empresa S.A.S">
          </div>
          <div class="form-group">
            <label for="companyNit">NIT *</label>
            <input type="text" id="companyNit" required placeholder="12345678-9">
          </div>
          <div class="form-group">
            <label for="companyAddress">Dirección</label>
            <input type="text" id="companyAddress" placeholder="Calle 123 #45-67">
          </div>
          <div class="form-group">
            <label for="companyPhone">Teléfono</label>
            <input type="tel" id="companyPhone" placeholder="+57 300 123 4567">
          </div>
          <div class="form-group">
            <label for="companyEmail">Email</label>
            <input type="email" id="companyEmail" placeholder="empresa@ejemplo.com">
          </div>
        </form>
      </div>
    `;
  }

  renderPaymentSetupStep() {
    return `
      <div class="onboarding-step">
        <div class="step-icon">💳</div>
        <h2>${this.steps[this.currentStep].title}</h2>
        <p>${this.steps[this.currentStep].description}</p>
        <div class="payment-plans">
          <div class="plan-card" data-plan="basic">
            <h3>Plan Básico</h3>
            <div class="plan-price">$29,000 COP/mes</div>
            <ul class="plan-features">
              <li>Hasta 5 empleados</li>
              <li>Gestión básica de nómina</li>
              <li>Reportes básicos</li>
              <li>Soporte por email</li>
            </ul>
            <button class="btn btn-outline-primary" onclick="axyraOnboardingSystem.selectPlan('basic')">Seleccionar</button>
          </div>
          <div class="plan-card recommended" data-plan="professional">
            <div class="plan-badge">Recomendado</div>
            <h3>Plan Profesional</h3>
            <div class="plan-price">$59,000 COP/mes</div>
            <ul class="plan-features">
              <li>Hasta 25 empleados</li>
              <li>Gestión completa de nómina</li>
              <li>Reportes avanzados</li>
              <li>Soporte prioritario</li>
            </ul>
            <button class="btn btn-primary" onclick="axyraOnboardingSystem.selectPlan('professional')">Seleccionar</button>
          </div>
          <div class="plan-card" data-plan="enterprise">
            <h3>Plan Empresarial</h3>
            <div class="plan-price">$99,000 COP/mes</div>
            <ul class="plan-features">
              <li>Empleados ilimitados</li>
              <li>Todas las funcionalidades</li>
              <li>Reportes personalizados</li>
              <li>Soporte 24/7</li>
            </ul>
            <button class="btn btn-outline-primary" onclick="axyraOnboardingSystem.selectPlan('enterprise')">Seleccionar</button>
          </div>
        </div>
        <div class="payment-methods">
          <h4>Métodos de Pago Disponibles</h4>
          <div class="method-options">
            <div class="method-option">
              <i class="fas fa-university"></i>
              <span>Bancolombia</span>
            </div>
            <div class="method-option">
              <i class="fas fa-mobile-alt"></i>
              <span>Nequi</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTeamSetupStep() {
    return `
      <div class="onboarding-step">
        <div class="step-icon">👥</div>
        <h2>${this.steps[this.currentStep].title}</h2>
        <p>${this.steps[this.currentStep].description}</p>
        <div class="team-setup-options">
          <div class="setup-option">
            <h4>Agregar Empleados Ahora</h4>
            <p>Puedes agregar hasta 3 empleados para comenzar</p>
            <button class="btn btn-primary" onclick="axyraOnboardingSystem.showAddEmployees()">Agregar Empleados</button>
          </div>
          <div class="setup-option">
            <h4>Hacerlo Después</h4>
            <p>Puedes agregar empleados más tarde desde el panel</p>
            <button class="btn btn-secondary" onclick="axyraOnboardingSystem.skipTeamSetup()">Omitir por Ahora</button>
          </div>
        </div>
      </div>
    `;
  }

  renderSystemTourStep() {
    return `
      <div class="onboarding-step">
        <div class="step-icon">🎯</div>
        <h2>${this.steps[this.currentStep].title}</h2>
        <p>${this.steps[this.currentStep].description}</p>
        <div class="tour-features">
          <div class="tour-item">
            <div class="tour-icon">📊</div>
            <h4>Dashboard Principal</h4>
            <p>Vista general de tu empresa con métricas importantes</p>
          </div>
          <div class="tour-item">
            <div class="tour-icon">👥</div>
            <h4>Gestión de Empleados</h4>
            <p>Administra la información de tu equipo</p>
          </div>
          <div class="tour-item">
            <div class="tour-icon">⏰</div>
            <h4>Control de Horas</h4>
            <p>Registra y controla las horas trabajadas</p>
          </div>
          <div class="tour-item">
            <div class="tour-icon">💰</div>
            <h4>Cálculo de Nómina</h4>
            <p>Genera nóminas automáticamente</p>
          </div>
        </div>
        <div class="tour-actions">
          <button class="btn btn-primary" onclick="axyraOnboardingSystem.startSystemTour()">Iniciar Tour</button>
          <button class="btn btn-secondary" onclick="axyraOnboardingSystem.skipTour()">Omitir Tour</button>
        </div>
      </div>
    `;
  }

  renderCompletionStep() {
    return `
      <div class="onboarding-step">
        <div class="step-icon">🎉</div>
        <h2>${this.steps[this.currentStep].title}</h2>
        <p>${this.steps[this.currentStep].description}</p>
        <div class="completion-summary">
          <h4>Resumen de tu Configuración</h4>
          <div class="summary-item">
            <span>Empresa:</span>
            <span>${this.userProgress.company_info?.companyName || 'No configurado'}</span>
          </div>
          <div class="summary-item">
            <span>Plan Seleccionado:</span>
            <span>${this.userProgress.payment_setup?.planId || 'No seleccionado'}</span>
          </div>
          <div class="summary-item">
            <span>Empleados Agregados:</span>
            <span>${this.userProgress.team_setup?.employeeCount || 0}</span>
          </div>
        </div>
        <div class="completion-actions">
          <button class="btn btn-primary" onclick="axyraOnboardingSystem.completeOnboarding()">¡Comenzar a Usar AXYRA!</button>
        </div>
      </div>
    `;
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateOnboardingModal();
    } else {
      this.completeOnboarding();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateOnboardingModal();
    }
  }

  updateOnboardingModal() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
      const content = modal.querySelector('.onboarding-content');
      const progressFill = modal.querySelector('.progress-fill');
      const progressText = modal.querySelector('.progress-text');
      
      content.innerHTML = this.renderCurrentStep();
      progressFill.style.width = `${(this.currentStep / this.steps.length) * 100}%`;
      progressText.textContent = `Paso ${this.currentStep + 1} de ${this.steps.length}`;
    }
  }

  selectPlan(planId) {
    // Guardar selección de plan
    this.userProgress.payment_setup = { planId };
    this.saveUserProgress();
    
    // Actualizar UI
    document.querySelectorAll('.plan-card').forEach(card => {
      card.classList.remove('selected');
    });
    document.querySelector(`[data-plan="${planId}"]`).classList.add('selected');
    
    alert(`Plan ${planId} seleccionado`);
  }

  showAddEmployees() {
    const count = prompt('¿Cuántos empleados quieres agregar? (máximo 3):');
    if (count && parseInt(count) <= 3) {
      this.userProgress.team_setup = { employeeCount: parseInt(count) };
      this.saveUserProgress();
      alert(`${count} empleados serán agregados`);
    }
  }

  skipTeamSetup() {
    this.userProgress.team_setup = { employeeCount: 0 };
    this.saveUserProgress();
    this.nextStep();
  }

  startSystemTour() {
    alert('Iniciando tour del sistema...');
    this.nextStep();
  }

  skipTour() {
    this.nextStep();
  }

  completeOnboarding() {
    // Marcar onboarding como completado
    this.userProgress.completed = true;
    this.userProgress.completedAt = new Date().toISOString();
    this.saveUserProgress();
    
    // Cerrar modal
    this.closeOnboarding();
    
    // Mostrar mensaje de bienvenida
    alert('¡Bienvenido a AXYRA! Tu cuenta está lista para usar.');
    
    // Redirigir al dashboard
    window.location.href = 'dashboard.html';
  }

  closeOnboarding() {
    const modal = document.getElementById('onboarding-modal');
    if (modal) {
      modal.remove();
    }
  }

  isOnboardingCompleted() {
    return this.userProgress.completed === true;
  }

  getOnboardingProgress() {
    const completedSteps = this.steps.filter(step => step.isCompleted).length;
    return {
      totalSteps: this.steps.length,
      completedSteps,
      progress: (completedSteps / this.steps.length) * 100
    };
  }
}

// Inicializar sistema de onboarding
let axyraOnboardingSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraOnboardingSystem = new AxyraOnboardingSystem();
  window.axyraOnboardingSystem = axyraOnboardingSystem;
  
  // Verificar si el usuario necesita onboarding
  if (!axyraOnboardingSystem.isOnboardingCompleted()) {
    // Mostrar botón de onboarding en el header
    const header = document.querySelector('.axyra-header');
    if (header) {
      const onboardingBtn = document.createElement('button');
      onboardingBtn.className = 'btn btn-primary';
      onboardingBtn.innerHTML = '🎯 Completar Configuración';
      onboardingBtn.onclick = () => axyraOnboardingSystem.startOnboarding();
      header.appendChild(onboardingBtn);
    }
  }
});

window.AxyraOnboardingSystem = AxyraOnboardingSystem;
