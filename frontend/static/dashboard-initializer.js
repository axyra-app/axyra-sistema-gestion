/* ========================================
   AXYRA DASHBOARD INITIALIZER
   Inicializador Robusto del Dashboard
   ======================================== */

class AxyraDashboardInitializer {
  constructor() {
    this.initialized = false;
    this.retryCount = 0;
    this.maxRetries = 5;
    this.init();
  }

  init() {
    console.log('🚀 Inicializando Dashboard AXYRA...');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeDashboard());
    } else {
      this.initializeDashboard();
    }
  }

  async initializeDashboard() {
    try {
      console.log('📋 Iniciando proceso de inicialización del dashboard...');
      
      // 1. Verificar Firebase
      await this.waitForFirebase();
      
      // 2. Verificar autenticación
      await this.checkAuthentication();
      
      // 3. Inicializar componentes
      await this.initializeComponents();
      
      // 4. Cargar datos
      await this.loadDashboardData();
      
      // 5. Mostrar dashboard
      this.showDashboard();
      
      this.initialized = true;
      console.log('✅ Dashboard AXYRA inicializado correctamente');
      
    } catch (error) {
      console.error('❌ Error inicializando dashboard:', error);
      this.handleInitializationError(error);
    }
  }

  async waitForFirebase() {
    console.log('🔥 Esperando Firebase...');
    
    let attempts = 0;
    const maxAttempts = 50; // 5 segundos máximo
    
    while (attempts < maxAttempts) {
      if (window.axyraFirebase && window.axyraFirebase.auth) {
        console.log('✅ Firebase disponible');
        return true;
      }
      
      await this.sleep(100);
      attempts++;
    }
    
    throw new Error('Firebase no se cargó en el tiempo esperado');
  }

  async checkAuthentication() {
    console.log('🔐 Verificando autenticación...');
    
    // Verificar si hay usuario en localStorage
    const user = localStorage.getItem('axyra_user');
    if (!user) {
      console.log('⚠️ No hay usuario autenticado, redirigiendo al login...');
      window.location.href = '../../login.html';
      return;
    }
    
    try {
      const userData = JSON.parse(user);
      console.log('✅ Usuario autenticado:', userData.email);
      
      // Verificar si es administrador
      if (window.axyraAdminAuth && window.axyraAdminAuth.isAdmin(userData)) {
        console.log('👑 Usuario es administrador, redirigiendo al panel de administración...');
        window.location.href = '../../admin.html';
        return;
      }
      
    } catch (error) {
      console.error('❌ Error parseando datos de usuario:', error);
      window.location.href = '../../login.html';
    }
  }

  async initializeComponents() {
    console.log('🧩 Inicializando componentes...');
    
    // Inicializar chat de IA
    if (window.AxyraAIChatProfessional && !window.axyraAIChat) {
      try {
        window.axyraAIChat = new AxyraAIChatProfessional();
        console.log('✅ Chat de IA inicializado');
      } catch (error) {
        console.warn('⚠️ Error inicializando chat de IA:', error);
      }
    }
    
    // Inicializar sistema de modales
    if (window.AxyraModalSystem && !window.axyraModalSystem) {
      try {
        window.axyraModalSystem = new AxyraModalSystem();
        console.log('✅ Sistema de modales inicializado');
      } catch (error) {
        console.warn('⚠️ Error inicializando sistema de modales:', error);
      }
    }
    
    // Inicializar sistema de administración
    if (window.axyraAdminAuth) {
      try {
        window.axyraAdminAuth.checkAdminAccess();
        console.log('✅ Sistema de administración verificado');
      } catch (error) {
        console.warn('⚠️ Error verificando sistema de administración:', error);
      }
    }
  }

  async loadDashboardData() {
    console.log('📊 Cargando datos del dashboard...');
    
    // Simular carga de datos
    await this.sleep(500);
    
    // Aquí se cargarían los datos reales del dashboard
    console.log('✅ Datos del dashboard cargados');
  }

  showDashboard() {
    console.log('🎯 Mostrando dashboard...');
    
    // Ocultar loader si existe
    const loader = document.getElementById('dashboard-loader');
    if (loader) {
      loader.style.display = 'none';
    }
    
    // Mostrar contenido principal
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.style.display = 'block';
    }
    
    // Mostrar header si existe
    const header = document.querySelector('.axyra-header');
    if (header) {
      header.style.display = 'block';
    }
    
    console.log('✅ Dashboard visible');
  }

  handleInitializationError(error) {
    console.error('❌ Error crítico en inicialización:', error);
    
    // Mostrar mensaje de error al usuario
    this.showErrorMessage('Error cargando el dashboard. Por favor, recarga la página.');
    
    // Intentar reinicializar después de un tiempo
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      console.log(`🔄 Reintentando inicialización (${this.retryCount}/${this.maxRetries})...`);
      
      setTimeout(() => {
        this.initializeDashboard();
      }, 2000);
    } else {
      console.error('❌ Máximo número de reintentos alcanzado');
      this.showErrorMessage('Error persistente. Por favor, contacta al soporte técnico.');
    }
  }

  showErrorMessage(message) {
    // Crear mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'dashboard-error';
    errorDiv.innerHTML = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fef2f2;
        border: 1px solid #fecaca;
        color: #dc2626;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        text-align: center;
        max-width: 400px;
      ">
        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 10px;"></i>
        <h3 style="margin: 0 0 10px 0;">Error del Dashboard</h3>
        <p style="margin: 0 0 15px 0;">${message}</p>
        <button onclick="location.reload()" style="
          background: #dc2626;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 5px;
          cursor: pointer;
        ">Recargar Página</button>
      </div>
    `;
    
    document.body.appendChild(errorDiv);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Inicializar cuando el script se carga
window.axyraDashboardInitializer = new AxyraDashboardInitializer();
