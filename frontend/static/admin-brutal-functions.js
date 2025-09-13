/* ========================================
   AXYRA ADMIN BRUTAL FUNCTIONS
   Funcionalidades avanzadas del panel de administración
   ======================================== */

class AxyraAdminBrutal {
  constructor() {
    this.users = [];
    this.subscriptions = [];
    this.analytics = {};
    this.init();
  }

  init() {
    console.log('🔥 Inicializando funciones BRUTAL del admin...');
    this.setupRealTimeUpdates();
    this.setupAdvancedFeatures();
  }

  // REAL-TIME UPDATES
  setupRealTimeUpdates() {
    // Actualizar datos cada 30 segundos
    setInterval(() => {
      this.updateDashboardData();
    }, 30000);

    // Escuchar cambios en Firestore
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      this.setupFirestoreListeners();
    }
  }

  setupFirestoreListeners() {
    // Escuchar cambios en usuarios
    firebase.firestore().collection('users')
      .onSnapshot((snapshot) => {
        console.log('📊 Usuarios actualizados en tiempo real');
        this.processUsersUpdate(snapshot);
      });

    // Escuchar cambios en suscripciones
    firebase.firestore().collection('subscriptions')
      .onSnapshot((snapshot) => {
        console.log('💳 Suscripciones actualizadas en tiempo real');
        this.processSubscriptionsUpdate(snapshot);
      });
  }

  processUsersUpdate(snapshot) {
    this.users = [];
    snapshot.forEach(doc => {
      this.users.push({ id: doc.id, ...doc.data() });
    });
    
    this.updateUsersStats();
    this.updateRecentUsersTable();
  }

  processSubscriptionsUpdate(snapshot) {
    this.subscriptions = [];
    snapshot.forEach(doc => {
      this.subscriptions.push({ id: doc.id, ...doc.data() });
    });
    
    this.updateSubscriptionsStats();
  }

  // DASHBOARD UPDATES
  async updateDashboardData() {
    try {
      await this.loadUsersData();
      await this.loadSubscriptionsData();
      await this.loadAnalyticsData();
      
      this.updateAllStats();
      this.updateCharts();
      
    } catch (error) {
      console.error('❌ Error actualizando datos:', error);
    }
  }

  async loadUsersData() {
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      // Datos simulados para desarrollo
      this.users = this.generateMockUsers();
      return;
    }

    try {
      const snapshot = await firebase.firestore().collection('users').get();
      this.users = [];
      snapshot.forEach(doc => {
        this.users.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      this.users = this.generateMockUsers();
    }
  }

  async loadSubscriptionsData() {
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      this.subscriptions = this.generateMockSubscriptions();
      return;
    }

    try {
      const snapshot = await firebase.firestore().collection('subscriptions').get();
      this.subscriptions = [];
      snapshot.forEach(doc => {
        this.subscriptions.push({ id: doc.id, ...doc.data() });
      });
    } catch (error) {
      console.error('❌ Error cargando suscripciones:', error);
      this.subscriptions = this.generateMockSubscriptions();
    }
  }

  async loadAnalyticsData() {
    // Cargar datos de analíticas
    this.analytics = {
      totalUsers: this.users.length,
      activeSubscriptions: this.subscriptions.filter(sub => sub.status === 'active').length,
      freeTrials: this.subscriptions.filter(sub => sub.status === 'trial').length,
      monthlyRevenue: this.calculateMonthlyRevenue()
    };
  }

  // STATS UPDATES
  updateAllStats() {
    this.updateUsersStats();
    this.updateSubscriptionsStats();
    this.updateRevenueStats();
  }

  updateUsersStats() {
    const totalUsers = this.users.length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthUsers = this.users.filter(user => {
      const userDate = new Date(user.createdAt?.toDate?.() || user.createdAt);
      return userDate.getMonth() === thisMonth && userDate.getFullYear() === thisYear;
    }).length;

    document.getElementById('totalUsers').textContent = totalUsers.toLocaleString();
    document.getElementById('usersChange').textContent = `+${thisMonthUsers} este mes`;
    document.getElementById('usersChange').className = `stat-change ${thisMonthUsers > 0 ? 'positive' : ''}`;
  }

  updateSubscriptionsStats() {
    const activeSubscriptions = this.subscriptions.filter(sub => sub.status === 'active').length;
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    const thisMonthSubs = this.subscriptions.filter(sub => {
      const subDate = new Date(sub.createdAt?.toDate?.() || sub.createdAt);
      return subDate.getMonth() === thisMonth && subDate.getFullYear() === thisYear;
    }).length;

    document.getElementById('activeSubscriptions').textContent = activeSubscriptions;
    document.getElementById('subscriptionsChange').textContent = `+${thisMonthSubs} este mes`;
    document.getElementById('subscriptionsChange').className = `stat-change ${thisMonthSubs > 0 ? 'positive' : ''}`;
  }

  updateRevenueStats() {
    const monthlyRevenue = this.calculateMonthlyRevenue();
    const previousMonthRevenue = this.calculatePreviousMonthRevenue();
    const growth = previousMonthRevenue > 0 ? ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue * 100) : 0;

    document.getElementById('monthlyRevenue').textContent = `$${monthlyRevenue.toLocaleString()}`;
    document.getElementById('revenueChange').textContent = `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}% vs mes anterior`;
    document.getElementById('revenueChange').className = `stat-change ${growth >= 0 ? 'positive' : 'negative'}`;
  }

  calculateMonthlyRevenue() {
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    
    return this.subscriptions
      .filter(sub => {
        const subDate = new Date(sub.createdAt?.toDate?.() || sub.createdAt);
        return sub.status === 'active' && 
               subDate.getMonth() === thisMonth && 
               subDate.getFullYear() === thisYear;
      })
      .reduce((total, sub) => total + (sub.amount || 0), 0);
  }

  calculatePreviousMonthRevenue() {
    const lastMonth = new Date().getMonth() - 1;
    const thisYear = new Date().getFullYear();
    
    return this.subscriptions
      .filter(sub => {
        const subDate = new Date(sub.createdAt?.toDate?.() || sub.createdAt);
        return sub.status === 'active' && 
               subDate.getMonth() === lastMonth && 
               subDate.getFullYear() === thisYear;
      })
      .reduce((total, sub) => total + (sub.amount || 0), 0);
  }

  // TABLE UPDATES
  updateRecentUsersTable() {
    const recentUsers = this.users
      .sort((a, b) => new Date(b.createdAt?.toDate?.() || b.createdAt) - new Date(a.createdAt?.toDate?.() || a.createdAt))
      .slice(0, 10);

    const tbody = document.getElementById('recentUsersTable');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (recentUsers.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 40px; color: #a0aec0;">
            No hay usuarios registrados
          </td>
        </tr>
      `;
      return;
    }

    recentUsers.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = this.createUserRow(user);
      tbody.appendChild(row);
    });
  }

  createUserRow(user) {
    const plan = this.getUserPlan(user);
    const status = this.getUserStatus(user);
    const date = new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString();
    
    return `
      <td>
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: linear-gradient(135deg, #667eea, #764ba2); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold;">
            ${(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          ${user.displayName || user.email.split('@')[0]}
        </div>
      </td>
      <td>${user.email}</td>
      <td>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${this.getPlanColor(plan)}; color: white;">
          ${plan}
        </span>
      </td>
      <td>
        <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; background: ${this.getStatusColor(status)}; color: white;">
          ${status}
        </span>
      </td>
      <td>${date}</td>
      <td>
        <div style="display: flex; gap: 5px;">
          <button class="btn-brutal btn-secondary" style="padding: 6px 12px; font-size: 11px;" onclick="adminBrutal.manageUser('${user.email}')" title="Gestionar">
            <i class="fas fa-cog"></i>
          </button>
          <button class="btn-brutal btn-primary" style="padding: 6px 12px; font-size: 11px;" onclick="adminBrutal.viewUser('${user.email}')" title="Ver">
            <i class="fas fa-eye"></i>
          </button>
        </div>
      </td>
    `;
  }

  getUserPlan(user) {
    // Lógica para determinar el plan del usuario
    if (user.plan) return user.plan;
    if (user.subscription) return user.subscription.plan || 'Básico';
    return 'Básico';
  }

  getUserStatus(user) {
    if (user.isAdmin) return 'Admin';
    if (user.subscription?.status === 'trial') return 'Prueba';
    if (user.subscription?.status === 'active') return 'Activo';
    return 'Inactivo';
  }

  getPlanColor(plan) {
    switch(plan) {
      case 'Básico': return 'linear-gradient(135deg, #4299e1, #3182ce)';
      case 'Profesional': return 'linear-gradient(135deg, #48bb78, #38a169)';
      case 'Empresarial': return 'linear-gradient(135deg, #ed8936, #dd6b20)';
      case 'Admin': return 'linear-gradient(135deg, #667eea, #764ba2)';
      default: return 'linear-gradient(135deg, #a0aec0, #718096)';
    }
  }

  getStatusColor(status) {
    switch(status) {
      case 'Activo': return 'linear-gradient(135deg, #48bb78, #38a169)';
      case 'Prueba': return 'linear-gradient(135deg, #ed8936, #dd6b20)';
      case 'Inactivo': return 'linear-gradient(135deg, #f56565, #e53e3e)';
      case 'Admin': return 'linear-gradient(135deg, #667eea, #764ba2)';
      default: return 'linear-gradient(135deg, #a0aec0, #718096)';
    }
  }

  // CHART UPDATES
  updateCharts() {
    if (window.usersChart) {
      this.updateUsersChart();
    }
  }

  updateUsersChart() {
    const monthlyData = this.getMonthlyUsersData();
    
    window.usersChart.data.datasets[0].data = monthlyData;
    window.usersChart.update();
  }

  getMonthlyUsersData() {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    
    return months.map((_, index) => {
      return this.users.filter(user => {
        const userDate = new Date(user.createdAt?.toDate?.() || user.createdAt);
        return userDate.getMonth() === index && userDate.getFullYear() === currentYear;
      }).length;
    });
  }

  // ADVANCED FEATURES
  setupAdvancedFeatures() {
    this.setupSearch();
    this.setupFilters();
    this.setupBulkActions();
  }

  setupSearch() {
    // Implementar búsqueda en tiempo real
    console.log('🔍 Configurando búsqueda avanzada...');
  }

  setupFilters() {
    // Implementar filtros avanzados
    console.log('🎛️ Configurando filtros avanzados...');
  }

  setupBulkActions() {
    // Implementar acciones masivas
    console.log('⚡ Configurando acciones masivas...');
  }

  // USER MANAGEMENT
  manageUser(email) {
    console.log('👤 Gestionando usuario:', email);
    this.showUserModal(email);
  }

  viewUser(email) {
    console.log('👁️ Viendo usuario:', email);
    this.showUserDetails(email);
  }

  showUserModal(email) {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    // Crear modal de gestión de usuario
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h3>Gestionar Usuario: ${user.displayName || user.email}</h3>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="user-info">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Plan:</strong> ${this.getUserPlan(user)}</p>
            <p><strong>Estado:</strong> ${this.getUserStatus(user)}</p>
            <p><strong>Registro:</strong> ${new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString()}</p>
          </div>
          <div class="user-actions">
            <button class="btn-brutal btn-primary" onclick="adminBrutal.changeUserPlan('${email}')">
              <i class="fas fa-crown"></i> Cambiar Plan
            </button>
            <button class="btn-brutal btn-secondary" onclick="adminBrutal.resetUserPassword('${email}')">
              <i class="fas fa-key"></i> Resetear Contraseña
            </button>
            <button class="btn-brutal btn-danger" onclick="adminBrutal.suspendUser('${email}')">
              <i class="fas fa-ban"></i> Suspender Usuario
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }

  showUserDetails(email) {
    const user = this.users.find(u => u.email === email);
    if (!user) return;

    console.log('📊 Detalles del usuario:', user);
    // Implementar vista detallada del usuario
  }

  changeUserPlan(email) {
    console.log('💳 Cambiando plan de usuario:', email);
    // Implementar cambio de plan
  }

  resetUserPassword(email) {
    console.log('🔑 Reseteando contraseña de usuario:', email);
    // Implementar reset de contraseña
  }

  suspendUser(email) {
    if (confirm('¿Estás seguro de que quieres suspender este usuario?')) {
      console.log('🚫 Suspendiendo usuario:', email);
      // Implementar suspensión de usuario
    }
  }

  // MOCK DATA FOR DEVELOPMENT
  generateMockUsers() {
    return [
      {
        id: '1',
        email: 'juan@empresa.com',
        displayName: 'Juan Pérez',
        createdAt: new Date('2024-01-15'),
        plan: 'Profesional',
        subscription: { status: 'active', plan: 'Profesional' }
      },
      {
        id: '2',
        email: 'maria@startup.com',
        displayName: 'María García',
        createdAt: new Date('2024-01-14'),
        plan: 'Básico',
        subscription: { status: 'trial', plan: 'Básico' }
      },
      {
        id: '3',
        email: 'carlos@corporacion.com',
        displayName: 'Carlos López',
        createdAt: new Date('2024-01-13'),
        plan: 'Empresarial',
        subscription: { status: 'active', plan: 'Empresarial' }
      }
    ];
  }

  generateMockSubscriptions() {
    return [
      {
        id: '1',
        userId: '1',
        plan: 'Profesional',
        status: 'active',
        amount: 99900,
        createdAt: new Date('2024-01-15')
      },
      {
        id: '2',
        userId: '2',
        plan: 'Básico',
        status: 'trial',
        amount: 0,
        createdAt: new Date('2024-01-14')
      },
      {
        id: '3',
        userId: '3',
        plan: 'Empresarial',
        status: 'active',
        amount: 159900,
        createdAt: new Date('2024-01-13')
      }
    ];
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.adminBrutal = new AxyraAdminBrutal();
});
