/* ========================================
   AXYRA ADMIN GOD MODE
   Sistema de control total con modo dios
   ======================================== */

class AxyraAdminGodMode {
  constructor() {
    this.currentUser = null;
    this.permissions = new Map();
    this.roleHierarchy = {
      god: 100,
      admin: 80,
      moderator: 60,
      support: 40,
      viewer: 20,
    };
    this.init();
  }

  init() {
    console.log('🔥 Inicializando MODO DIOS...');
    this.setupPermissionSystem();
    this.setupAccessControl();
    this.setupGodModeFeatures();
  }

  // SISTEMA DE PERMISOS BRUTAL
  setupPermissionSystem() {
    this.permissions.set('god', {
      level: 100,
      name: 'Dios',
      color: '#ff6b6b',
      icon: 'fas fa-crown',
      permissions: [
        'full_access',
        'user_management',
        'subscription_management',
        'analytics_access',
        'system_settings',
        'god_mode',
        'impersonate_users',
        'delete_anything',
        'modify_anything',
        'view_logs',
        'export_data',
        'bulk_operations',
      ],
    });

    this.permissions.set('admin', {
      level: 80,
      name: 'Administrador',
      color: '#4ecdc4',
      icon: 'fas fa-user-shield',
      permissions: [
        'user_management',
        'subscription_management',
        'analytics_access',
        'view_logs',
        'export_data',
        'bulk_operations',
      ],
    });

    this.permissions.set('moderator', {
      level: 60,
      name: 'Moderador',
      color: '#45b7d1',
      icon: 'fas fa-user-check',
      permissions: ['user_management', 'view_logs', 'export_data'],
    });

    this.permissions.set('support', {
      level: 40,
      name: 'Soporte',
      color: '#96ceb4',
      icon: 'fas fa-headset',
      permissions: ['view_users', 'view_logs'],
    });

    this.permissions.set('viewer', {
      level: 20,
      name: 'Visualizador',
      color: '#feca57',
      icon: 'fas fa-eye',
      permissions: ['view_analytics'],
    });
  }

  // CONTROL DE ACCESO
  setupAccessControl() {
    this.checkUserRole();
    this.setupRoleBasedUI();
    this.setupGodModeFeatures();
  }

  checkUserRole() {
    const user = localStorage.getItem('axyra_isolated_user');
    if (!user) {
      this.redirectToLogin();
      return;
    }

    const userData = JSON.parse(user);
    this.currentUser = userData;

    // Verificar si es dios
    if (userData.email === 'axyra.app@gmail.com') {
      userData.role = 'god';
      userData.isGod = true;
      console.log('🔥 MODO DIOS ACTIVADO');
    }

    console.log('👤 Usuario actual:', userData.role || 'user');
  }

  setupRoleBasedUI() {
    const role = this.currentUser?.role || 'user';
    const roleInfo = this.permissions.get(role);

    if (!roleInfo) {
      this.redirectToLogin();
      return;
    }

    // Actualizar UI con información del rol
    this.updateRoleIndicator(roleInfo);
    this.hideRestrictedFeatures(role);
    this.showGodModeFeatures(role);
  }

  updateRoleIndicator(roleInfo) {
    // Crear indicador de rol en el header
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('roleIndicator')) {
      const roleIndicator = document.createElement('div');
      roleIndicator.id = 'roleIndicator';
      roleIndicator.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; padding: 8px 16px; background: ${roleInfo.color}20; border: 2px solid ${roleInfo.color}; border-radius: 25px; color: ${roleInfo.color}; font-weight: 700;">
          <i class="${roleInfo.icon}"></i>
          <span>${roleInfo.name}</span>
        </div>
      `;
      headerActions.insertBefore(roleIndicator, headerActions.firstChild);
    }
  }

  hideRestrictedFeatures(role) {
    const restrictedFeatures = this.getRestrictedFeatures(role);

    restrictedFeatures.forEach((feature) => {
      const elements = document.querySelectorAll(`[data-feature="${feature}"]`);
      elements.forEach((el) => {
        el.style.display = 'none';
      });
    });
  }

  showGodModeFeatures(role) {
    if (role === 'god') {
      this.addGodModeUI();
      this.setupGodModeFeatures();
    }
  }

  addGodModeUI() {
    // Agregar botón de modo dios
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('godModeBtn')) {
      const godModeBtn = document.createElement('button');
      godModeBtn.id = 'godModeBtn';
      godModeBtn.className = 'btn-brutal btn-danger';
      godModeBtn.innerHTML = '<i class="fas fa-bolt"></i> MODO DIOS';
      godModeBtn.onclick = () => this.toggleGodMode();
      headerActions.appendChild(godModeBtn);
    }

    // Agregar panel de control de dios
    this.addGodControlPanel();
  }

  addGodControlPanel() {
    const sidebar = document.querySelector('.sidebar-nav');
    if (sidebar && !document.getElementById('godControlPanel')) {
      const godPanel = document.createElement('div');
      godPanel.id = 'godControlPanel';
      godPanel.innerHTML = `
        <div style="border-top: 2px solid #ff6b6b; margin-top: 20px; padding-top: 20px;">
          <div style="color: #ff6b6b; font-weight: 700; margin-bottom: 15px; text-align: center;">
            <i class="fas fa-bolt"></i> CONTROL DIOS
          </div>
          <a href="#" class="nav-item" data-section="god-users" onclick="godMode.manageAllUsers()">
            <i class="fas fa-users-cog"></i>
            <span>Gestionar Todos</span>
          </a>
          <a href="#" class="nav-item" data-section="god-system" onclick="godMode.systemControl()">
            <i class="fas fa-cogs"></i>
            <span>Control Sistema</span>
          </a>
          <a href="#" class="nav-item" data-section="god-logs" onclick="godMode.viewAllLogs()">
            <i class="fas fa-file-alt"></i>
            <span>Logs Completos</span>
          </a>
          <a href="#" class="nav-item" data-section="god-impersonate" onclick="godMode.impersonateUser()">
            <i class="fas fa-user-secret"></i>
            <span>Suplantar Usuario</span>
          </a>
        </div>
      `;
      sidebar.appendChild(godPanel);
    }
  }

  // FUNCIONALIDADES DE MODO DIOS
  setupGodModeFeatures() {
    this.setupBulkOperations();
    this.setupAdvancedSearch();
    this.setupSystemControl();
    this.setupImpersonation();
  }

  setupBulkOperations() {
    // Operaciones masivas solo para dios
    if (this.currentUser?.role === 'god') {
      this.addBulkOperationsUI();
    }
  }

  addBulkOperationsUI() {
    const tableContainer = document.querySelector('.table-container');
    if (tableContainer && !document.getElementById('bulkOperations')) {
      const bulkOps = document.createElement('div');
      bulkOps.id = 'bulkOperations';
      bulkOps.innerHTML = `
        <div style="margin-bottom: 20px; padding: 15px; background: linear-gradient(135deg, #ff6b6b20, #ff8e8e20); border: 2px solid #ff6b6b; border-radius: 12px;">
          <h4 style="color: #ff6b6b; margin-bottom: 15px;">
            <i class="fas fa-bolt"></i> Operaciones Masivas (MODO DIOS)
          </h4>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn-brutal btn-danger" onclick="godMode.bulkSuspendUsers()" style="padding: 8px 16px; font-size: 12px;">
              <i class="fas fa-ban"></i> Suspender Seleccionados
            </button>
            <button class="btn-brutal btn-secondary" onclick="godMode.bulkChangePlan()" style="padding: 8px 16px; font-size: 12px;">
              <i class="fas fa-crown"></i> Cambiar Plan Masivo
            </button>
            <button class="btn-brutal btn-primary" onclick="godMode.bulkExportUsers()" style="padding: 8px 16px; font-size: 12px;">
              <i class="fas fa-download"></i> Exportar Seleccionados
            </button>
            <button class="btn-brutal" onclick="godMode.bulkDeleteUsers()" style="padding: 8px 16px; font-size: 12px; background: linear-gradient(135deg, #e74c3c, #c0392b);">
              <i class="fas fa-trash"></i> Eliminar Seleccionados
            </button>
          </div>
        </div>
      `;
      tableContainer.insertBefore(bulkOps, tableContainer.firstChild);
    }
  }

  setupAdvancedSearch() {
    // Búsqueda avanzada solo para dios
    if (this.currentUser?.role === 'god') {
      this.addAdvancedSearchUI();
    }
  }

  addAdvancedSearchUI() {
    const headerActions = document.querySelector('.header-actions');
    if (headerActions && !document.getElementById('advancedSearch')) {
      const searchContainer = document.createElement('div');
      searchContainer.id = 'advancedSearch';
      searchContainer.innerHTML = `
        <div style="position: relative;">
          <input type="text" id="godSearchInput" placeholder="Búsqueda DIOS..." 
                 style="padding: 10px 40px 10px 15px; border: 2px solid #ff6b6b; border-radius: 25px; background: #1a1a2e; color: white; width: 300px; font-size: 14px;"
                 onkeyup="window.axyraAdminGodMode.performGodSearch(this.value)">
          <i class="fas fa-search" style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); color: #ff6b6b;"></i>
        </div>
      `;
      headerActions.insertBefore(searchContainer, headerActions.firstChild);
    }
  }

  setupSystemControl() {
    // Control del sistema solo para dios
    if (this.currentUser?.role === 'god') {
      this.addSystemControlUI();
    }
  }

  addSystemControlUI() {
    const dashboardGrid = document.querySelector('.dashboard-grid');
    if (dashboardGrid && !document.getElementById('systemControlCard')) {
      const systemCard = document.createElement('div');
      systemCard.id = 'systemControlCard';
      systemCard.className = 'stat-card fade-in-up';
      systemCard.innerHTML = `
        <div class="stat-header">
          <div class="stat-title">Control del Sistema</div>
          <div class="stat-icon" style="background: linear-gradient(135deg, #ff6b6b, #e74c3c);">
            <i class="fas fa-bolt"></i>
          </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 20px;">
          <button class="btn-brutal btn-danger" onclick="godMode.restartSystem()" style="padding: 8px 12px; font-size: 11px;">
            <i class="fas fa-power-off"></i> Reiniciar
          </button>
          <button class="btn-brutal btn-secondary" onclick="godMode.clearCache()" style="padding: 8px 12px; font-size: 11px;">
            <i class="fas fa-trash"></i> Limpiar Cache
          </button>
          <button class="btn-brutal btn-primary" onclick="godMode.backupSystem()" style="padding: 8px 12px; font-size: 11px;">
            <i class="fas fa-save"></i> Backup
          </button>
          <button class="btn-brutal" onclick="godMode.systemStatus()" style="padding: 8px 12px; font-size: 11px; background: linear-gradient(135deg, #48bb78, #38a169);">
            <i class="fas fa-heartbeat"></i> Estado
          </button>
        </div>
      `;
      dashboardGrid.appendChild(systemCard);
    }
  }

  setupImpersonation() {
    // Suplantación de usuarios solo para dios
    if (this.currentUser?.role === 'god') {
      this.addImpersonationUI();
    }
  }

  addImpersonationUI() {
    // Modal de suplantación
    if (!document.getElementById('impersonationModal')) {
      const modal = document.createElement('div');
      modal.id = 'impersonationModal';
      modal.className = 'modal-overlay';
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
          <div class="modal-header">
            <h3><i class="fas fa-user-secret"></i> Suplantar Usuario</h3>
            <button class="modal-close" onclick="godMode.closeImpersonationModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Email del usuario a suplantar:</label>
              <input type="email" id="impersonateEmail" placeholder="usuario@ejemplo.com" 
                     style="width: 100%; padding: 10px; border: 2px solid #ff6b6b; border-radius: 8px; background: #1a1a2e; color: white; margin-top: 5px;">
            </div>
            <div class="modal-actions">
              <button class="btn-brutal btn-danger" onclick="godMode.executeImpersonation()">
                <i class="fas fa-user-secret"></i> Suplantar
              </button>
              <button class="btn-brutal btn-secondary" onclick="godMode.closeImpersonationModal()">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
  }

  // MÉTODOS DE MODO DIOS
  toggleGodMode() {
    console.log('🔥 Alternando MODO DIOS...');
    // Implementar toggle de modo dios
  }

  manageAllUsers() {
    console.log('👥 Gestionando todos los usuarios...');
    // Implementar gestión masiva de usuarios
  }

  systemControl() {
    console.log('⚙️ Accediendo al control del sistema...');
    // Implementar control del sistema
  }

  viewAllLogs() {
    console.log('📋 Viendo todos los logs...');
    // Implementar vista completa de logs
  }

  impersonateUser() {
    const modal = document.getElementById('impersonationModal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  executeImpersonation() {
    const email = document.getElementById('impersonateEmail').value;
    if (!email) {
      alert('Por favor ingresa un email válido');
      return;
    }

    if (confirm(`¿Estás seguro de que quieres suplantar a ${email}?`)) {
      console.log('🕵️ Suplantando usuario:', email);
      // Implementar suplantación
      this.closeImpersonationModal();
    }
  }

  closeImpersonationModal() {
    const modal = document.getElementById('impersonationModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // OPERACIONES MASIVAS
  bulkSuspendUsers() {
    if (confirm('¿Estás seguro de suspender los usuarios seleccionados?')) {
      console.log('🚫 Suspendiendo usuarios masivamente...');
      // Implementar suspensión masiva
    }
  }

  bulkChangePlan() {
    console.log('💳 Cambiando plan masivamente...');
    // Implementar cambio de plan masivo
  }

  bulkExportUsers() {
    console.log('📊 Exportando usuarios seleccionados...');
    // Implementar exportación masiva
  }

  bulkDeleteUsers() {
    if (confirm('⚠️ PELIGRO: ¿Estás seguro de eliminar los usuarios seleccionados? Esta acción es IRREVERSIBLE.')) {
      console.log('🗑️ Eliminando usuarios masivamente...');
      // Implementar eliminación masiva
    }
  }

  // BÚSQUEDA AVANZADA
  performGodSearch(query) {
    if (query.length < 3) return;

    console.log('🔍 Búsqueda DIOS:', query);
    // Implementar búsqueda avanzada
  }

  // CONTROL DEL SISTEMA
  restartSystem() {
    if (confirm('⚠️ ¿Estás seguro de reiniciar el sistema?')) {
      console.log('🔄 Reiniciando sistema...');
      // Implementar reinicio del sistema
    }
  }

  clearCache() {
    if (confirm('¿Limpiar cache del sistema?')) {
      console.log('🧹 Limpiando cache...');
      // Implementar limpieza de cache
    }
  }

  backupSystem() {
    console.log('💾 Creando backup del sistema...');
    // Implementar backup del sistema
  }

  systemStatus() {
    console.log('💓 Verificando estado del sistema...');
    // Implementar verificación de estado
  }

  // UTILIDADES
  getRestrictedFeatures(role) {
    const roleInfo = this.permissions.get(role);
    if (!roleInfo) return [];

    const allFeatures = [
      'bulk_operations',
      'advanced_search',
      'system_control',
      'impersonation',
      'god_mode',
      'delete_anything',
      'modify_anything',
    ];

    return allFeatures.filter((feature) => !roleInfo.permissions.includes(feature));
  }

  hasPermission(permission) {
    const role = this.currentUser?.role || 'user';
    const roleInfo = this.permissions.get(role);
    return roleInfo && roleInfo.permissions.includes(permission);
  }

  redirectToLogin() {
    window.location.href = '/login.html';
  }

  // GESTIÓN DE USUARIOS INDIVIDUALES
  manageUser(email) {
    console.log(`🔧 Gestionando usuario: ${email}`);
    
    // Crear modal de gestión de usuario
    const modal = document.createElement('div');
    modal.className = 'modal';
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
    
    modal.innerHTML = `
      <div style="
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        padding: 2rem;
        border-radius: 15px;
        border: 2px solid #667eea;
        max-width: 500px;
        width: 90%;
        color: white;
      ">
        <h3 style="margin-bottom: 1rem; color: #667eea;">🔧 Gestión de Usuario</h3>
        <p><strong>Email:</strong> ${email}</p>
        <div style="margin-top: 1.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
          <button onclick="window.axyraAdminGodMode.suspendUser('${email}')" 
                  style="background: #f56565; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            🚫 Suspender
          </button>
          <button onclick="window.axyraAdminGodMode.changeUserPlan('${email}')" 
                  style="background: #667eea; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            💳 Cambiar Plan
          </button>
          <button onclick="window.axyraAdminGodMode.viewUserDetails('${email}')" 
                  style="background: #48bb78; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            👁️ Ver Detalles
          </button>
          <button onclick="this.closest('.modal').remove()" 
                  style="background: #718096; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            ❌ Cerrar
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Cerrar modal al hacer click fuera
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  suspendUser(email) {
    console.log(`🚫 Suspendiendo usuario: ${email}`);
    alert(`Usuario ${email} suspendido`);
    document.querySelector('.modal')?.remove();
  }

  changeUserPlan(email) {
    console.log(`💳 Cambiando plan de usuario: ${email}`);
    const newPlan = prompt('Ingresa el nuevo plan (Básico, Profesional, Empresarial):');
    if (newPlan) {
      alert(`Plan de ${email} cambiado a: ${newPlan}`);
    }
    document.querySelector('.modal')?.remove();
  }

  viewUserDetails(email) {
    console.log(`👁️ Viendo detalles de usuario: ${email}`);
    alert(`Detalles de ${email}:\n\n- Plan: Profesional\n- Estado: Activo\n- Registro: 14/1/2024\n- Última actividad: Hoy`);
    document.querySelector('.modal')?.remove();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAdminGodMode = new AxyraAdminGodMode();
  window.godMode = window.axyraAdminGodMode; // Compatibilidad
});
