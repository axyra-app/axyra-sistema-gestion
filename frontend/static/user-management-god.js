/* ========================================
   AXYRA USER MANAGEMENT GOD
   Gestión avanzada de usuarios para modo dios
   ======================================== */

class AxyraUserManagementGod {
  constructor() {
    this.users = [];
    this.selectedUsers = new Set();
    this.filters = {
      role: 'all',
      status: 'all',
      plan: 'all',
      dateRange: 'all',
    };
    this.init();
  }

  init() {
    console.log('👥 Inicializando gestión de usuarios DIOS...');
    this.setupUserTable();
    this.setupAdvancedFilters();
    this.setupBulkActions();
    this.loadUsers();
  }

  // CONFIGURAR TABLA DE USUARIOS
  setupUserTable() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    // Agregar controles de tabla
    const tableControls = document.createElement('div');
    tableControls.id = 'tableControls';
    tableControls.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
        <div style="display: flex; gap: 10px; align-items: center;">
          <input type="checkbox" id="selectAllUsers" onchange="userManagementGod.toggleSelectAll(this.checked)">
          <label for="selectAllUsers" style="color: #e2e8f0; font-weight: 600;">Seleccionar Todos</label>
          <span id="selectedCount" style="color: #ff6b6b; font-weight: 700;">0 seleccionados</span>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <button class="btn-brutal btn-secondary" onclick="userManagementGod.refreshUsers()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-sync-alt"></i> Actualizar
          </button>
          <button class="btn-brutal btn-primary" onclick="userManagementGod.exportUsers()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-download"></i> Exportar
          </button>
        </div>
      </div>
    `;
    tableContainer.insertBefore(tableControls, tableContainer.querySelector('.table'));

    // Modificar tabla para incluir checkboxes
    this.modifyUserTable();
  }

  modifyUserTable() {
    const table = document.querySelector('.table');
    if (!table) return;

    // Agregar columna de selección
    const headerRow = table.querySelector('thead tr');
    if (headerRow && !headerRow.querySelector('.select-column')) {
      const selectHeader = document.createElement('th');
      selectHeader.className = 'select-column';
      selectHeader.innerHTML = '<i class="fas fa-check-square"></i>';
      selectHeader.style.width = '50px';
      headerRow.insertBefore(selectHeader, headerRow.firstChild);
    }
  }

  // CONFIGURAR FILTROS AVANZADOS
  setupAdvancedFilters() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    const filtersContainer = document.createElement('div');
    filtersContainer.id = 'advancedFilters';
    filtersContainer.innerHTML = `
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border: 2px solid #2d3748; border-radius: 15px; padding: 20px; margin-bottom: 20px;">
        <h4 style="color: #ff6b6b; margin-bottom: 15px; font-weight: 800;">
          <i class="fas fa-filter"></i> Filtros Avanzados (MODO DIOS)
        </h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
          <div>
            <label style="color: #e2e8f0; font-weight: 600; margin-bottom: 5px; display: block;">Rol:</label>
            <select id="roleFilter" onchange="userManagementGod.applyFilters()" style="width: 100%; padding: 8px; border: 2px solid #2d3748; border-radius: 8px; background: #1a1a2e; color: white;">
              <option value="all">Todos los roles</option>
              <option value="god">Dios</option>
              <option value="admin">Administrador</option>
              <option value="moderator">Moderador</option>
              <option value="support">Soporte</option>
              <option value="user">Usuario</option>
            </select>
          </div>
          <div>
            <label style="color: #e2e8f0; font-weight: 600; margin-bottom: 5px; display: block;">Estado:</label>
            <select id="statusFilter" onchange="userManagementGod.applyFilters()" style="width: 100%; padding: 8px; border: 2px solid #2d3748; border-radius: 8px; background: #1a1a2e; color: white;">
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="trial">Prueba</option>
              <option value="suspended">Suspendido</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <div>
            <label style="color: #e2e8f0; font-weight: 600; margin-bottom: 5px; display: block;">Plan:</label>
            <select id="planFilter" onchange="userManagementGod.applyFilters()" style="width: 100%; padding: 8px; border: 2px solid #2d3748; border-radius: 8px; background: #1a1a2e; color: white;">
              <option value="all">Todos los planes</option>
              <option value="basico">Básico</option>
              <option value="profesional">Profesional</option>
              <option value="empresarial">Empresarial</option>
            </select>
          </div>
          <div>
            <label style="color: #e2e8f0; font-weight: 600; margin-bottom: 5px; display: block;">Rango de fecha:</label>
            <select id="dateFilter" onchange="userManagementGod.applyFilters()" style="width: 100%; padding: 8px; border: 2px solid #2d3748; border-radius: 8px; background: #1a1a2e; color: white;">
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
              <option value="year">Este año</option>
            </select>
          </div>
        </div>
        <div style="margin-top: 15px; display: flex; gap: 10px;">
          <button class="btn-brutal btn-primary" onclick="userManagementGod.applyFilters()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-search"></i> Aplicar Filtros
          </button>
          <button class="btn-brutal btn-secondary" onclick="userManagementGod.clearFilters()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-times"></i> Limpiar
          </button>
        </div>
      </div>
    `;
    tableContainer.insertBefore(filtersContainer, tableContainer.querySelector('.table'));
  }

  // CONFIGURAR ACCIONES MASIVAS
  setupBulkActions() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    const bulkActions = document.createElement('div');
    bulkActions.id = 'bulkActionsPanel';
    bulkActions.innerHTML = `
      <div id="bulkActions" style="background: linear-gradient(135deg, #ff6b6b20, #ff8e8e20); border: 2px solid #ff6b6b; border-radius: 12px; padding: 20px; margin-bottom: 20px; display: none;">
        <h4 style="color: #ff6b6b; margin-bottom: 15px; font-weight: 800;">
          <i class="fas fa-bolt"></i> Acciones Masivas (<span id="bulkCount">0</span> usuarios seleccionados)
        </h4>
        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
          <button class="btn-brutal btn-danger" onclick="userManagementGod.bulkSuspend()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-ban"></i> Suspender
          </button>
          <button class="btn-brutal btn-secondary" onclick="userManagementGod.bulkChangePlan()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-crown"></i> Cambiar Plan
          </button>
          <button class="btn-brutal btn-primary" onclick="userManagementGod.bulkExport()" style="padding: 8px 16px; font-size: 12px;">
            <i class="fas fa-download"></i> Exportar
          </button>
          <button class="btn-brutal" onclick="userManagementGod.bulkDelete()" style="padding: 8px 16px; font-size: 12px; background: linear-gradient(135deg, #e74c3c, #c0392b);">
            <i class="fas fa-trash"></i> Eliminar
          </button>
          <button class="btn-brutal" onclick="userManagementGod.bulkSendEmail()" style="padding: 8px 16px; font-size: 12px; background: linear-gradient(135deg, #3498db, #2980b9);">
            <i class="fas fa-envelope"></i> Enviar Email
          </button>
        </div>
      </div>
    `;
    tableContainer.insertBefore(bulkActions, tableContainer.querySelector('.table'));
  }

  // CARGAR USUARIOS
  async loadUsers() {
    try {
      // Simular carga de usuarios (en producción vendría de Firebase)
      this.users = this.generateMockUsers();
      this.renderUsers();
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    }
  }

  generateMockUsers() {
    return [
      {
        id: '1',
        email: 'juan@empresa.com',
        displayName: 'Juan Pérez',
        role: 'user',
        plan: 'profesional',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        lastLogin: new Date('2024-01-20'),
        subscription: { status: 'active', plan: 'Profesional' },
      },
      {
        id: '2',
        email: 'maria@startup.com',
        displayName: 'María García',
        role: 'user',
        plan: 'basico',
        status: 'trial',
        createdAt: new Date('2024-01-14'),
        lastLogin: new Date('2024-01-19'),
        subscription: { status: 'trial', plan: 'Básico' },
      },
      {
        id: '3',
        email: 'carlos@corporacion.com',
        displayName: 'Carlos López',
        role: 'user',
        plan: 'empresarial',
        status: 'active',
        createdAt: new Date('2024-01-13'),
        lastLogin: new Date('2024-01-20'),
        subscription: { status: 'active', plan: 'Empresarial' },
      },
      {
        id: '4',
        email: 'ana@startup.com',
        displayName: 'Ana Martínez',
        role: 'moderator',
        plan: 'profesional',
        status: 'active',
        createdAt: new Date('2024-01-12'),
        lastLogin: new Date('2024-01-18'),
        subscription: { status: 'active', plan: 'Profesional' },
      },
      {
        id: '5',
        email: 'pedro@empresa.com',
        displayName: 'Pedro Rodríguez',
        role: 'user',
        plan: 'basico',
        status: 'suspended',
        createdAt: new Date('2024-01-10'),
        lastLogin: new Date('2024-01-15'),
        subscription: { status: 'suspended', plan: 'Básico' },
      },
    ];
  }

  // RENDERIZAR USUARIOS
  renderUsers() {
    const tbody = document.getElementById('recentUsersTable');
    if (!tbody) return;

    tbody.innerHTML = '';

    this.users.forEach((user) => {
      const row = document.createElement('tr');
      row.innerHTML = this.createUserRow(user);
      tbody.appendChild(row);
    });
  }

  createUserRow(user) {
    const isSelected = this.selectedUsers.has(user.id);

    return `
      <td class="select-column">
        <input type="checkbox" ${isSelected ? 'checked' : ''} 
               onchange="userManagementGod.toggleUserSelection('${user.id}', this.checked)"
               style="transform: scale(1.2);">
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-weight: 600; color: #ffffff;">${user.displayName || user.email.split('@')[0]}</div>
            <div style="font-size: 12px; color: #a0aec0;">${user.email}</div>
          </div>
        </div>
      </td>
      <td>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${this.getPlanColor(
          user.plan
        )}; color: white;">
          ${this.getPlanName(user.plan)}
        </span>
      </td>
      <td>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${this.getStatusColor(
          user.status
        )}; color: white;">
          ${this.getStatusName(user.status)}
        </span>
      </td>
      <td>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${this.getRoleColor(
          user.role
        )}; color: white;">
          ${this.getRoleName(user.role)}
        </span>
      </td>
      <td>${new Date(user.createdAt).toLocaleDateString()}</td>
      <td>
        <div style="display: flex; gap: 5px;">
          <button class="btn-brutal btn-secondary" onclick="userManagementGod.editUser('${
            user.id
          }')" style="padding: 6px 12px; font-size: 11px;" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn-brutal btn-primary" onclick="userManagementGod.viewUser('${
            user.id
          }')" style="padding: 6px 12px; font-size: 11px;" title="Ver">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-brutal btn-danger" onclick="userManagementGod.suspendUser('${
            user.id
          }')" style="padding: 6px 12px; font-size: 11px;" title="Suspender">
            <i class="fas fa-ban"></i>
          </button>
        </div>
      </td>
    `;
  }

  // UTILIDADES DE COLORES
  getPlanColor(plan) {
    switch (plan) {
      case 'basico':
        return 'linear-gradient(135deg, #4299e1, #3182ce)';
      case 'profesional':
        return 'linear-gradient(135deg, #48bb78, #38a169)';
      case 'empresarial':
        return 'linear-gradient(135deg, #ed8936, #dd6b20)';
      default:
        return 'linear-gradient(135deg, #a0aec0, #718096)';
    }
  }

  getStatusColor(status) {
    switch (status) {
      case 'active':
        return 'linear-gradient(135deg, #48bb78, #38a169)';
      case 'trial':
        return 'linear-gradient(135deg, #ed8936, #dd6b20)';
      case 'suspended':
        return 'linear-gradient(135deg, #f56565, #e53e3e)';
      case 'inactive':
        return 'linear-gradient(135deg, #a0aec0, #718096)';
      default:
        return 'linear-gradient(135deg, #a0aec0, #718096)';
    }
  }

  getRoleColor(role) {
    switch (role) {
      case 'god':
        return 'linear-gradient(135deg, #ff6b6b, #e74c3c)';
      case 'admin':
        return 'linear-gradient(135deg, #4ecdc4, #44a08d)';
      case 'moderator':
        return 'linear-gradient(135deg, #45b7d1, #96c93d)';
      case 'support':
        return 'linear-gradient(135deg, #96ceb4, #feca57)';
      case 'user':
        return 'linear-gradient(135deg, #a0aec0, #718096)';
      default:
        return 'linear-gradient(135deg, #a0aec0, #718096)';
    }
  }

  getPlanName(plan) {
    switch (plan) {
      case 'basico':
        return 'Básico';
      case 'profesional':
        return 'Profesional';
      case 'empresarial':
        return 'Empresarial';
      default:
        return 'N/A';
    }
  }

  getStatusName(status) {
    switch (status) {
      case 'active':
        return 'Activo';
      case 'trial':
        return 'Prueba';
      case 'suspended':
        return 'Suspendido';
      case 'inactive':
        return 'Inactivo';
      default:
        return 'N/A';
    }
  }

  getRoleName(role) {
    switch (role) {
      case 'god':
        return 'Dios';
      case 'admin':
        return 'Admin';
      case 'moderator':
        return 'Moderador';
      case 'support':
        return 'Soporte';
      case 'user':
        return 'Usuario';
      default:
        return 'N/A';
    }
  }

  // GESTIÓN DE SELECCIÓN
  toggleSelectAll(checked) {
    this.selectedUsers.clear();

    if (checked) {
      this.users.forEach((user) => {
        this.selectedUsers.add(user.id);
      });
    }

    this.updateSelectionUI();
    this.renderUsers();
  }

  toggleUserSelection(userId, checked) {
    if (checked) {
      this.selectedUsers.add(userId);
    } else {
      this.selectedUsers.delete(userId);
    }

    this.updateSelectionUI();
  }

  updateSelectionUI() {
    const selectedCount = document.getElementById('selectedCount');
    const bulkActions = document.getElementById('bulkActions');
    const bulkCount = document.getElementById('bulkCount');

    if (selectedCount) {
      selectedCount.textContent = `${this.selectedUsers.size} seleccionados`;
    }

    if (bulkActions) {
      bulkActions.style.display = this.selectedUsers.size > 0 ? 'block' : 'none';
    }

    if (bulkCount) {
      bulkCount.textContent = this.selectedUsers.size;
    }
  }

  // FILTROS
  applyFilters() {
    const roleFilter = document.getElementById('roleFilter')?.value || 'all';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const planFilter = document.getElementById('planFilter')?.value || 'all';
    const dateFilter = document.getElementById('dateFilter')?.value || 'all';

    this.filters = { role: roleFilter, status: statusFilter, plan: planFilter, dateRange: dateFilter };

    // Aplicar filtros (en producción se haría en el backend)
    console.log('🔍 Aplicando filtros:', this.filters);
    this.renderUsers();
  }

  clearFilters() {
    document.getElementById('roleFilter').value = 'all';
    document.getElementById('statusFilter').value = 'all';
    document.getElementById('planFilter').value = 'all';
    document.getElementById('dateFilter').value = 'all';

    this.filters = { role: 'all', status: 'all', plan: 'all', dateRange: 'all' };
    this.renderUsers();
  }

  // ACCIONES MASIVAS
  bulkSuspend() {
    if (this.selectedUsers.size === 0) return;

    if (confirm(`¿Estás seguro de suspender ${this.selectedUsers.size} usuarios?`)) {
      console.log('🚫 Suspendiendo usuarios masivamente:', Array.from(this.selectedUsers));
      // Implementar suspensión masiva
    }
  }

  bulkChangePlan() {
    if (this.selectedUsers.size === 0) return;

    console.log('💳 Cambiando plan masivamente:', Array.from(this.selectedUsers));
    // Implementar cambio de plan masivo
  }

  bulkExport() {
    if (this.selectedUsers.size === 0) return;

    console.log('📊 Exportando usuarios:', Array.from(this.selectedUsers));
    // Implementar exportación masiva
  }

  bulkDelete() {
    if (this.selectedUsers.size === 0) return;

    if (
      confirm(`⚠️ PELIGRO: ¿Estás seguro de eliminar ${this.selectedUsers.size} usuarios? Esta acción es IRREVERSIBLE.`)
    ) {
      console.log('🗑️ Eliminando usuarios masivamente:', Array.from(this.selectedUsers));
      // Implementar eliminación masiva
    }
  }

  bulkSendEmail() {
    if (this.selectedUsers.size === 0) return;

    console.log('📧 Enviando email masivo:', Array.from(this.selectedUsers));
    // Implementar envío de email masivo
  }

  // ACCIONES INDIVIDUALES
  editUser(userId) {
    const user = this.users.find((u) => u.id === userId);
    console.log('✏️ Editando usuario:', user);
    // Implementar edición de usuario
  }

  viewUser(userId) {
    const user = this.users.find((u) => u.id === userId);
    console.log('👁️ Viendo usuario:', user);
    // Implementar vista de usuario
  }

  suspendUser(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (confirm(`¿Estás seguro de suspender a ${user.displayName}?`)) {
      console.log('🚫 Suspendiendo usuario:', user);
      // Implementar suspensión de usuario
    }
  }

  // UTILIDADES
  refreshUsers() {
    console.log('🔄 Actualizando usuarios...');
    this.loadUsers();
  }

  exportUsers() {
    console.log('📊 Exportando todos los usuarios...');
    // Implementar exportación de usuarios
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.userManagementGod = new AxyraUserManagementGod();
});
