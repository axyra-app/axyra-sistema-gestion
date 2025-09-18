/**
 * AXYRA - Sistema de Membresías Brutal
 * Control total de acceso, límites y funcionalidades por plan
 */

class AxyraMembershipSystem {
  constructor() {
    this.currentUser = null;
    this.userPlan = 'free';
    this.planStatus = 'inactive';
    this.usage = {
      empleados: 0,
      nominas: 0,
      almacenamiento: 0, // MB
      modulos_usados: []
    };
    
    this.restrictions = {
      // Módulos restringidos por plan
      free: ['inventario', 'cuadre_caja', 'reportes_avanzados', 'integraciones', 'ai_chat'],
      basic: ['inventario', 'cuadre_caja', 'reportes_avanzados', 'integraciones'],
      professional: ['ai_chat', 'personalizacion'],
      enterprise: []
    };

    this.init();
  }

  async init() {
    console.log('🔥 Inicializando Sistema de Membresías Brutal...');
    
    // Cargar configuración de membresías
    this.loadMembershipConfig();
    
    // Configurar listeners
    this.setupListeners();
    
    // Verificar estado del usuario
    await this.checkUserStatus();
    
    console.log('✅ Sistema de Membresías Brutal inicializado');
  }

  loadMembershipConfig() {
    if (window.AxyraConfig) {
      this.config = window.AxyraConfig.getAll().membresias;
    } else {
      // Configuración por defecto
      this.config = {
        planes: {
          free: {
            nombre: 'Gratuito',
            limite_empleados: 5,
            limite_nominas: 10,
            limite_almacenamiento: 100,
            modulos_disponibles: ['dashboard', 'empleados_basico', 'nominas_basico']
          },
          basic: {
            nombre: 'Básico',
            limite_empleados: 25,
            limite_nominas: 50,
            limite_almacenamiento: 500,
            modulos_disponibles: ['dashboard', 'empleados', 'nominas', 'reportes_basico']
          },
          professional: {
            nombre: 'Profesional',
            limite_empleados: 100,
            limite_nominas: 200,
            limite_almacenamiento: 2000,
            modulos_disponibles: ['dashboard', 'empleados', 'nominas', 'inventario', 'cuadre_caja', 'reportes', 'integraciones']
          },
          enterprise: {
            nombre: 'Empresarial',
            limite_empleados: -1,
            limite_nominas: -1,
            limite_almacenamiento: -1,
            modulos_disponibles: ['dashboard', 'empleados', 'nominas', 'inventario', 'cuadre_caja', 'reportes', 'integraciones', 'ai_chat', 'personalizacion']
          }
        }
      };
    }
  }

  setupListeners() {
    // Escuchar cambios de autenticación
    window.addEventListener('auth:userChanged', (user) => {
      this.currentUser = user;
      this.checkUserStatus();
    });

    // Escuchar cambios de plan
    window.addEventListener('membership:planChanged', (event) => {
      this.userPlan = event.detail.plan;
      this.updateUI();
    });

    // Escuchar cambios de uso
    window.addEventListener('data:changed', () => {
      this.updateUsage();
    });
  }

  async checkUserStatus() {
    if (!this.currentUser) {
      this.userPlan = 'free';
      this.planStatus = 'inactive';
      this.updateUI();
      return;
    }

    try {
      // Obtener información del usuario desde Firestore
      const userDoc = await this.getUserDocument();
      if (userDoc) {
        this.userPlan = userDoc.plan || 'free';
        this.planStatus = userDoc.planStatus || 'active';
        this.usage = userDoc.usage || this.usage;
      }
    } catch (error) {
      console.error('Error verificando estado del usuario:', error);
      this.userPlan = 'free';
      this.planStatus = 'inactive';
    }

    this.updateUI();
  }

  async getUserDocument() {
    if (!window.AxyraCore || !window.AxyraCore.db) return null;
    
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
      const userRef = doc(window.AxyraCore.db, 'usuarios', this.currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      return userSnap.exists() ? userSnap.data() : null;
    } catch (error) {
      console.error('Error obteniendo documento del usuario:', error);
      return null;
    }
  }

  // Verificaciones de acceso
  canAccessModule(moduleName) {
    const plan = this.config.planes[this.userPlan];
    if (!plan) return false;

    return plan.modulos_disponibles.includes(moduleName);
  }

  canAddEmployee() {
    return this.isWithinLimit('empleados', this.usage.empleados + 1);
  }

  canAddNomina() {
    return this.isWithinLimit('nominas', this.usage.nominas + 1);
  }

  canUploadFile(fileSize) {
    const newSize = this.usage.almacenamiento + (fileSize / 1024 / 1024); // Convertir a MB
    return this.isWithinLimit('almacenamiento', newSize);
  }

  isWithinLimit(resource, currentCount) {
    const plan = this.config.planes[this.userPlan];
    if (!plan) return false;

    const limit = plan[`limite_${resource}`];
    if (limit === -1) return true; // Ilimitado
    if (limit === undefined) return true; // No hay límite definido

    return currentCount <= limit;
  }

  // Obtener información del plan
  getPlanInfo(planName = null) {
    const plan = planName || this.userPlan;
    return this.config.planes[plan] || null;
  }

  getPlanLimits(planName = null) {
    const planInfo = this.getPlanInfo(planName);
    if (!planInfo) return null;

    return {
      empleados: planInfo.limite_empleados,
      nominas: planInfo.limite_nominas,
      almacenamiento: planInfo.limite_almacenamiento,
      modulos: planInfo.modulos_disponibles
    };
  }

  getCurrentUsage() {
    return { ...this.usage };
  }

  getUsagePercentage(resource) {
    const limits = this.getPlanLimits();
    if (!limits) return 0;

    const limit = limits[`limite_${resource}`];
    if (limit === -1) return 0; // Ilimitado
    if (limit === undefined) return 0; // No hay límite

    return Math.min((this.usage[resource] / limit) * 100, 100);
  }

  // Actualizar uso
  async updateUsage() {
    if (!this.currentUser) return;

    try {
      // Contar empleados
      const empleados = await this.countCollection('empleados');
      
      // Contar nóminas del mes actual
      const nominas = await this.countNominasThisMonth();
      
      // Calcular almacenamiento usado
      const almacenamiento = await this.calculateStorageUsed();

      this.usage = {
        empleados,
        nominas,
        almacenamiento,
        modulos_usados: this.getUsedModules()
      };

      // Actualizar en Firestore
      await this.updateUserUsage();

      // Emitir evento
      window.dispatchEvent(new CustomEvent('membership:usageUpdated', {
        detail: this.usage
      }));

    } catch (error) {
      console.error('Error actualizando uso:', error);
    }
  }

  async countCollection(collectionName) {
    if (!window.AxyraCore || !window.AxyraCore.db) return 0;
    
    try {
      const { collection, getDocs, query, where } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
      const q = query(collection(window.AxyraCore.db, collectionName), where('activo', '==', true));
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error(`Error contando ${collectionName}:`, error);
      return 0;
    }
  }

  async countNominasThisMonth() {
    if (!window.AxyraCore || !window.AxyraCore.db) return 0;
    
    try {
      const { collection, getDocs, query, where, gte } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const q = query(
        collection(window.AxyraCore.db, 'nominas'),
        where('fecha_creacion', '>=', startOfMonth)
      );
      const snapshot = await getDocs(q);
      return snapshot.size;
    } catch (error) {
      console.error('Error contando nóminas:', error);
      return 0;
    }
  }

  async calculateStorageUsed() {
    // Por ahora retornar 0, se puede implementar con Firebase Storage
    return 0;
  }

  getUsedModules() {
    const usedModules = [];
    
    // Verificar qué módulos están siendo usados
    if (this.usage.empleados > 0) usedModules.push('empleados');
    if (this.usage.nominas > 0) usedModules.push('nominas');
    
    return usedModules;
  }

  async updateUserUsage() {
    if (!this.currentUser || !window.AxyraCore || !window.AxyraCore.db) return;

    try {
      const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
      const userRef = doc(window.AxyraCore.db, 'usuarios', this.currentUser.uid);
      
      await updateDoc(userRef, {
        usage: this.usage,
        lastUsageUpdate: new Date()
      });
    } catch (error) {
      console.error('Error actualizando uso del usuario:', error);
    }
  }

  // Cambiar plan
  async upgradePlan(newPlan) {
    if (!this.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const planInfo = this.getPlanInfo(newPlan);
    if (!planInfo) {
      throw new Error('Plan no válido');
    }

    try {
      // Actualizar en Firestore
      const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js');
      const userRef = doc(window.AxyraCore.db, 'usuarios', this.currentUser.uid);
      
      await updateDoc(userRef, {
        plan: newPlan,
        planStatus: 'active',
        planUpgradedAt: new Date()
      });

      this.userPlan = newPlan;
      this.planStatus = 'active';

      // Emitir evento
      window.dispatchEvent(new CustomEvent('membership:planChanged', {
        detail: { plan: newPlan, status: 'active' }
      }));

      this.updateUI();

    } catch (error) {
      console.error('Error actualizando plan:', error);
      throw error;
    }
  }

  // Verificar restricciones
  checkRestrictions(action, resource = null) {
    const restrictions = this.restrictions[this.userPlan] || [];
    
    // Verificar si la acción está restringida
    if (restrictions.includes(action)) {
      return {
        allowed: false,
        reason: `Esta funcionalidad no está disponible en el plan ${this.getPlanInfo().nombre}`,
        upgradeRequired: true
      };
    }

    // Verificar límites específicos
    if (resource) {
      const limit = this.getPlanLimits()[`limite_${resource}`];
      if (limit !== -1 && this.usage[resource] >= limit) {
        return {
          allowed: false,
          reason: `Has alcanzado el límite de ${resource} para tu plan`,
          upgradeRequired: true
        };
      }
    }

    return { allowed: true };
  }

  // Mostrar restricciones en UI
  showRestriction(restriction) {
    // Crear modal de restricción
    const modal = document.createElement('div');
    modal.className = 'membership-restriction-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🚫 Funcionalidad Restringida</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <p>${restriction.reason}</p>
          ${restriction.upgradeRequired ? `
            <div class="upgrade-section">
              <h4>¿Quieres desbloquear esta funcionalidad?</h4>
              <button class="upgrade-btn">Ver Planes</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-btn').onclick = () => modal.remove();
    modal.querySelector('.upgrade-btn')?.onclick = () => {
      modal.remove();
      this.showPlansModal();
    };
  }

  showPlansModal() {
    const modal = document.createElement('div');
    modal.className = 'membership-plans-modal';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h3>🎯 Elige tu Plan</h3>
          <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
          <div class="plans-grid">
            ${Object.entries(this.config.planes).map(([key, plan]) => `
              <div class="plan-card ${key === this.userPlan ? 'current' : ''}">
                <h4>${plan.nombre}</h4>
                <div class="plan-price">
                  ${plan.precio === 0 ? 'Gratis' : `$${plan.precio.toLocaleString()}/mes`}
                </div>
                <ul class="plan-features">
                  ${plan.caracteristicas?.map(feature => `<li>${feature}</li>`).join('') || ''}
                </ul>
                <button class="select-plan-btn" data-plan="${key}">
                  ${key === this.userPlan ? 'Plan Actual' : 'Seleccionar'}
                </button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    modal.querySelector('.close-btn').onclick = () => modal.remove();
    modal.querySelectorAll('.select-plan-btn').forEach(btn => {
      btn.onclick = (e) => {
        const plan = e.target.dataset.plan;
        if (plan !== this.userPlan) {
          this.upgradePlan(plan);
        }
        modal.remove();
      };
    });
  }

  // Actualizar UI
  updateUI() {
    // Actualizar indicador de plan
    this.updatePlanIndicator();
    
    // Actualizar barras de progreso
    this.updateProgressBars();
    
    // Ocultar/mostrar elementos restringidos
    this.updateRestrictedElements();
    
    // Actualizar límites en tiempo real
    this.updateLiveLimits();
  }

  updatePlanIndicator() {
    const indicators = document.querySelectorAll('.plan-indicator');
    indicators.forEach(indicator => {
      indicator.textContent = this.getPlanInfo().nombre;
      indicator.className = `plan-indicator plan-${this.userPlan}`;
    });
  }

  updateProgressBars() {
    // Empleados
    const empleadosBar = document.querySelector('.progress-empleados');
    if (empleadosBar) {
      const percentage = this.getUsagePercentage('empleados');
      empleadosBar.style.width = `${percentage}%`;
      empleadosBar.parentElement.querySelector('.progress-text').textContent = 
        `${this.usage.empleados} / ${this.getPlanLimits().limite_empleados === -1 ? '∞' : this.getPlanLimits().limite_empleados} empleados`;
    }

    // Nóminas
    const nominasBar = document.querySelector('.progress-nominas');
    if (nominasBar) {
      const percentage = this.getUsagePercentage('nominas');
      nominasBar.style.width = `${percentage}%`;
      nominasBar.parentElement.querySelector('.progress-text').textContent = 
        `${this.usage.nominas} / ${this.getPlanLimits().limite_nominas === -1 ? '∞' : this.getPlanLimits().limite_nominas} nóminas`;
    }

    // Almacenamiento
    const storageBar = document.querySelector('.progress-storage');
    if (storageBar) {
      const percentage = this.getUsagePercentage('almacenamiento');
      storageBar.style.width = `${percentage}%`;
      storageBar.parentElement.querySelector('.progress-text').textContent = 
        `${this.usage.almacenamiento.toFixed(1)} / ${this.getPlanLimits().limite_almacenamiento === -1 ? '∞' : this.getPlanLimits().limite_almacenamiento} MB`;
    }
  }

  updateRestrictedElements() {
    // Ocultar elementos restringidos
    Object.keys(this.restrictions).forEach(plan => {
      if (plan !== this.userPlan) {
        this.restrictions[plan].forEach(module => {
          const elements = document.querySelectorAll(`[data-module="${module}"]`);
          elements.forEach(el => {
            el.style.display = 'none';
          });
        });
      }
    });

    // Mostrar elementos del plan actual
    const currentModules = this.getPlanInfo().modulos_disponibles;
    currentModules.forEach(module => {
      const elements = document.querySelectorAll(`[data-module="${module}"]`);
      elements.forEach(el => {
        el.style.display = '';
      });
    });
  }

  updateLiveLimits() {
    // Actualizar contadores en tiempo real
    const empleadosCount = document.querySelector('.empleados-count');
    if (empleadosCount) {
      empleadosCount.textContent = this.usage.empleados;
    }

    const nominasCount = document.querySelector('.nominas-count');
    if (nominasCount) {
      nominasCount.textContent = this.usage.nominas;
    }
  }

  // Métodos de utilidad
  isPlan(planName) {
    return this.userPlan === planName;
  }

  isFree() {
    return this.userPlan === 'free';
  }

  isPaid() {
    return this.userPlan !== 'free';
  }

  canUpgrade() {
    return this.userPlan !== 'enterprise';
  }

  getUpgradeOptions() {
    const currentIndex = Object.keys(this.config.planes).indexOf(this.userPlan);
    return Object.keys(this.config.planes).slice(currentIndex + 1);
  }

  // Obtener estadísticas de uso
  getUsageStats() {
    const limits = this.getPlanLimits();
    return {
      empleados: {
        used: this.usage.empleados,
        limit: limits.limite_empleados,
        percentage: this.getUsagePercentage('empleados')
      },
      nominas: {
        used: this.usage.nominas,
        limit: limits.limite_nominas,
        percentage: this.getUsagePercentage('nominas')
      },
      almacenamiento: {
        used: this.usage.almacenamiento,
        limit: limits.limite_almacenamiento,
        percentage: this.getUsagePercentage('almacenamiento')
      }
    };
  }
}

// Instancia global
window.AxyraMembership = new AxyraMembershipSystem();

// Exportar para módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraMembershipSystem;
}
