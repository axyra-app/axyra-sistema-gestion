// Sistema Unificado de Reportes Avanzados AXYRA - VERSIÓN SIMPLIFICADA
// Evita conflictos y mejora el rendimiento

class AxyraAdvancedReportsUnified {
  constructor() {
    this.isInitialized = false;
    this.reports = [];
    this.config = {
      autoSave: true,
      maxReports: 100,
      debug: false
    };
  }

  // Inicialización simple sin conflictos
  async initialize() {
    if (this.isInitialized) return;
    
    try {
      console.log('📊 Inicializando Sistema Unificado de Reportes AXYRA...');
      
      // Configurar listeners básicos
      this.setupEventListeners();
      
      // Cargar reportes existentes
      this.loadExistingReports();
      
      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Reportes AXYRA inicializado');
    } catch (error) {
      console.warn('⚠️ Error inicializando sistema unificado de reportes:', error);
    }
  }

  // Configurar listeners básicos
  setupEventListeners() {
    // Solo configurar si no hay conflictos
    if (!window.axyraAdvancedReports) {
      document.addEventListener('click', (e) => {
        if (e.target.matches('[data-report-action]')) {
          this.handleReportRequest(e);
        }
      });
    }
  }

  // Cargar reportes existentes
  loadExistingReports() {
    try {
      const savedReports = localStorage.getItem('axyra_reports');
      if (savedReports) {
        this.reports = JSON.parse(savedReports);
        console.log(`📋 ${this.reports.length} reportes cargados del almacenamiento`);
      }
    } catch (error) {
      console.warn('⚠️ Error cargando reportes existentes:', error);
    }
  }

  // Manejar solicitud de reporte
  handleReportRequest(event) {
    try {
      const action = event.target.dataset.reportAction;
      const module = event.target.dataset.reportModule || 'general';
      
      console.log(`📊 Solicitud de reporte: ${action} para módulo ${module}`);
      
      // Generar reporte básico
      this.generateReport(module, action);
    } catch (error) {
      console.warn('⚠️ Error manejando solicitud de reporte:', error);
    }
  }

  // Generar reporte básico
  generateReport(module, type) {
    try {
      const report = {
        id: Date.now(),
        module: module,
        type: type,
        timestamp: new Date().toISOString(),
        data: this.getReportData(module, type)
      };
      
      // Agregar a historial
      this.addToHistory(report);
      
      // Mostrar notificación
      this.showReportNotification(report);
      
      return report;
    } catch (error) {
      console.warn('⚠️ Error generando reporte:', error);
      return null;
    }
  }

  // Obtener datos del reporte
  getReportData(module, type) {
    try {
      switch (module) {
        case 'nomina':
          return this.getNominaData();
        case 'cuadreCaja':
          return this.getCuadreCajaData();
        case 'inventario':
          return this.getInventarioData();
        case 'empleados':
          return this.getEmpleadosData();
        case 'horas':
          return this.getHorasData();
        default:
          return this.getGeneralData();
      }
    } catch (error) {
      console.warn('⚠️ Error obteniendo datos del reporte:', error);
      return { error: 'Error obteniendo datos' };
    }
  }

  // Datos básicos para cada módulo
  getNominaData() {
    try {
      const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      return {
        total: nominas.length,
        ultimaGenerada: nominas.length > 0 ? nominas[nominas.length - 1].fecha : 'N/A'
      };
    } catch (error) {
      return { error: 'Error obteniendo datos de nómina' };
    }
  }

  getCuadreCajaData() {
    try {
      const cuadres = JSON.parse(localStorage.getItem('axyra_cuadres') || '[]');
      return {
        total: cuadres.length,
        ultimoCuadre: cuadres.length > 0 ? cuadres[cuadres.length - 1].fecha : 'N/A'
      };
    } catch (error) {
      return { error: 'Error obteniendo datos de cuadre de caja' };
    }
  }

  getInventarioData() {
    try {
      const inventario = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');
      return {
        total: inventario.length,
        itemsBajoStock: inventario.filter(item => item.stock < item.stockMinimo).length
      };
    } catch (error) {
      return { error: 'Error obteniendo datos de inventario' };
    }
  }

  getEmpleadosData() {
    try {
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      return {
        total: empleados.length,
        activos: empleados.filter(emp => emp.estado === 'Activo').length
      };
    } catch (error) {
      return { error: 'Error obteniendo datos de empleados' };
    }
  }

  getHorasData() {
    try {
      const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
      return {
        total: horas.length,
        ultimoRegistro: horas.length > 0 ? horas[horas.length - 1].fecha : 'N/A'
      };
    } catch (error) {
      return { error: 'Error obteniendo datos de horas' };
    }
  }

  getGeneralData() {
    return {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  // Agregar reporte al historial
  addToHistory(report) {
    try {
      this.reports.unshift(report);
      
      // Limitar número de reportes
      if (this.reports.length > this.config.maxReports) {
        this.reports = this.reports.slice(0, this.config.maxReports);
      }
      
      // Guardar en localStorage
      if (this.config.autoSave) {
        localStorage.setItem('axyra_reports', JSON.stringify(this.reports));
      }
      
      console.log(`📋 Reporte agregado al historial: ${report.module} - ${report.type}`);
    } catch (error) {
      console.warn('⚠️ Error agregando reporte al historial:', error);
    }
  }

  // Mostrar notificación de reporte
  showReportNotification(report) {
    try {
      const message = `Reporte generado: ${report.module} - ${report.type}`;
      
      // Usar sistema de notificaciones existente si está disponible
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showNotification(message, 'success');
      } else {
        // Fallback simple
        console.log(`✅ ${message}`);
      }
    } catch (error) {
      console.warn('⚠️ Error mostrando notificación de reporte:', error);
    }
  }

  // Obtener historial de reportes
  getReportHistory() {
    return this.reports;
  }

  // Limpiar historial
  clearHistory() {
    this.reports = [];
    localStorage.removeItem('axyra_reports');
    console.log('🗑️ Historial de reportes limpiado');
  }

  // Información del sistema
  getSystemInfo() {
    return {
      version: '1.0.0-simplified',
      isInitialized: this.isInitialized,
      totalReports: this.reports.length,
      config: this.config
    };
  }
}

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  if (!window.axyraAdvancedReportsUnified) {
    window.axyraAdvancedReportsUnified = new AxyraAdvancedReportsUnified();
    window.axyraAdvancedReportsUnified.initialize();
  }
});

// Exportar para uso global
window.AxyraAdvancedReportsUnified = AxyraAdvancedReportsUnified;

