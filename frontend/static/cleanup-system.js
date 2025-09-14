// ========================================
// SISTEMA DE LIMPIEZA Y OPTIMIZACIÓN AXYRA
// ========================================

class AxyraCleanupSystem {
  constructor() {
    this.duplicateFiles = new Map();
    this.unusedFiles = new Set();
    this.optimizationStats = {
      filesRemoved: 0,
      spaceSaved: 0,
      duplicatesFound: 0,
      unusedFound: 0,
    };
    this.init();
  }

  init() {
    console.log('🧹 Inicializando sistema de limpieza...');
    this.scanForDuplicates();
    this.scanForUnusedFiles();
    this.optimizeLocalStorage();
  }

  // Escanear archivos duplicados
  scanForDuplicates() {
    console.log('🔍 Escaneando archivos duplicados...');
    
    const duplicatePatterns = [
      // Archivos de configuración duplicados
      { pattern: /package\.json$/, description: 'Archivos package.json' },
      { pattern: /vercel\.json$/, description: 'Archivos vercel.json' },
      { pattern: /firebase\.json$/, description: 'Archivos firebase.json' },
      
      // Archivos HTML duplicados
      { pattern: /admin.*\.html$/, description: 'Archivos admin HTML' },
      { pattern: /index\.html$/, description: 'Archivos index.html' },
      { pattern: /login\.html$/, description: 'Archivos login.html' },
      
      // Archivos JavaScript duplicados
      { pattern: /firebase-config.*\.js$/, description: 'Archivos de configuración Firebase' },
      { pattern: /auth.*\.js$/, description: 'Archivos de autenticación' },
      { pattern: /dashboard.*\.js$/, description: 'Archivos de dashboard' },
      { pattern: /nomina.*\.js$/, description: 'Archivos de nómina' },
      { pattern: /empleados.*\.js$/, description: 'Archivos de empleados' },
      { pattern: /horas.*\.js$/, description: 'Archivos de horas' },
      { pattern: /inventario.*\.js$/, description: 'Archivos de inventario' },
      { pattern: /reportes.*\.js$/, description: 'Archivos de reportes' },
      { pattern: /configuracion.*\.js$/, description: 'Archivos de configuración' },
      { pattern: /cuadre.*\.js$/, description: 'Archivos de cuadre de caja' },
      { pattern: /gestion.*\.js$/, description: 'Archivos de gestión personal' },
      { pattern: /membresias.*\.js$/, description: 'Archivos de membresías' },
      
      // Archivos CSS duplicados
      { pattern: /styles?\.css$/, description: 'Archivos de estilos' },
      { pattern: /responsive.*\.css$/, description: 'Archivos responsive' },
      { pattern: /modal.*\.css$/, description: 'Archivos de modales' },
      
      // Archivos de plantillas duplicados
      { pattern: /plantilla.*\.xlsx$/, description: 'Archivos de plantillas Excel' },
      { pattern: /logo\.png$/, description: 'Archivos de logo' },
      { pattern: /nomina\.ico$/, description: 'Archivos de favicon' },
    ];

    duplicatePatterns.forEach(({ pattern, description }) => {
      const duplicates = this.findFilesByPattern(pattern);
      if (duplicates.length > 1) {
        this.duplicateFiles.set(description, duplicates);
        this.optimizationStats.duplicatesFound += duplicates.length;
        console.log(`⚠️ ${description}: ${duplicates.length} archivos encontrados`);
        duplicates.forEach(file => console.log(`   - ${file}`));
      }
    });
  }

  // Encontrar archivos por patrón
  findFilesByPattern(pattern) {
    const files = [];
    
    // Simular búsqueda de archivos (en un entorno real, esto se haría con el sistema de archivos)
    const knownFiles = [
      'package.json',
      'frontend/package.json',
      'vercel.json',
      'firebase.json',
      'admin.html',
      'admin-brutal.html',
      'frontend/admin.html',
      'index.html',
      'frontend/index.html',
      'login.html',
      'frontend/login.html',
      'firebase-config.js',
      'firebase-config-secure.js',
      'frontend/static/firebase-config.js',
      'auth-manager.js',
      'frontend/static/auth-manager.js',
      'dashboard.js',
      'frontend/modulos/dashboard/dashboard.js',
      'nomina.js',
      'frontend/modulos/nomina/nomina.js',
      'empleados.js',
      'frontend/modulos/empleados/empleados.js',
      'horas.js',
      'frontend/modulos/horas/gestionar_horas_complete.js',
      'inventario.js',
      'frontend/modulos/inventario/inventario.js',
      'reportes.js',
      'frontend/modulos/reportes/reportes-avanzados.js',
      'configuracion.js',
      'frontend/modulos/configuracion/configuracion-avanzada.js',
      'cuadre_caja.js',
      'frontend/modulos/cuadre_caja/cuadre_caja.js',
      'gestion_personal.js',
      'frontend/modulos/gestion_personal/gestion_personal_mejorado.js',
      'membresias.js',
      'frontend/modulos/membresias/membresias.js',
      'styles.css',
      'frontend/static/axyra-styles.css',
      'responsive-styles.css',
      'frontend/static/responsive-styles.css',
      'modal-fixes.css',
      'frontend/static/modal-fixes.css',
      'plantilla_empleados.xlsx',
      'frontend/plantillas/plantilla_empleados.xlsx',
      'logo.png',
      'frontend/logo.png',
      'nomina.ico',
      'frontend/nomina.ico',
    ];

    knownFiles.forEach(file => {
      if (pattern.test(file)) {
        files.push(file);
      }
    });

    return files;
  }

  // Escanear archivos no utilizados
  scanForUnusedFiles() {
    console.log('🔍 Escaneando archivos no utilizados...');
    
    const potentiallyUnusedFiles = [
      // Archivos de prueba
      'test-verificacion.html',
      'test-chat-simple.html',
      'test-modals-simple.html',
      'test-complete.html',
      
      // Archivos de backup
      'gestionar_nomina_backup.html',
      'gestionar_nomina_roto.html',
      'gestionar_nomina_clean.html',
      
      // Archivos duplicados en modulos/
      'modulos/dashboard/index.html',
      'modulos/empleados/index.html',
      'modulos/horas/index.html',
      'modulos/nomina/index.html',
      
      // Archivos de configuración duplicados
      'modulos/configuracion/config.js',
      'modulos/empleados/config.js',
      'modulos/horas/config.js',
      'modulos/nomina/config.js',
      
      // Archivos de utilidades duplicados
      'modulos/horas/utils.js',
      'modulos/nomina/utils.js',
      
      // Archivos de estilos duplicados
      'modulos/configuracion/config-styles.css',
      'modulos/configuracion/configuracion-avanzada-styles.css',
      'modulos/dashboard/dashboard-styles.css',
      'modulos/dashboard/dashboard-avanzado-styles.css',
      'modulos/gestion_personal/gestion_personal-styles.css',
      'modulos/nomina/nomina-styles.css',
      'modulos/nomina/nomina-avanzada-styles.css',
      'modulos/reportes/reportes-avanzados-styles.css',
    ];

    potentiallyUnusedFiles.forEach(file => {
      this.unusedFiles.add(file);
      this.optimizationStats.unusedFound++;
    });

    console.log(`⚠️ Archivos potencialmente no utilizados: ${this.unusedFiles.size}`);
  }

  // Optimizar localStorage
  optimizeLocalStorage() {
    console.log('🧹 Optimizando localStorage...');
    
    const keysToClean = [
      'axyra_debug_logs',
      'axyra_performance_metrics',
      'axyra_old_sessions',
      'axyra_temp_data',
      'axyra_cache_old',
    ];

    let spaceSaved = 0;
    
    keysToClean.forEach(key => {
      if (localStorage.getItem(key)) {
        const size = localStorage.getItem(key).length;
        localStorage.removeItem(key);
        spaceSaved += size;
        console.log(`🧹 Limpiado: ${key} (${this.formatBytes(size)})`);
      }
    });

    // Limpiar logs antiguos
    const logs = JSON.parse(localStorage.getItem('axyra_logs') || '[]');
    const recentLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return logDate > weekAgo;
    });

    if (recentLogs.length !== logs.length) {
      localStorage.setItem('axyra_logs', JSON.stringify(recentLogs));
      const removedCount = logs.length - recentLogs.length;
      console.log(`🧹 Limpiados ${removedCount} logs antiguos`);
    }

    this.optimizationStats.spaceSaved += spaceSaved;
    console.log(`✅ Espacio liberado en localStorage: ${this.formatBytes(spaceSaved)}`);
  }

  // Generar reporte de limpieza
  generateCleanupReport() {
    const report = {
      timestamp: new Date().toISOString(),
      duplicates: Array.from(this.duplicateFiles.entries()),
      unusedFiles: Array.from(this.unusedFiles),
      stats: this.optimizationStats,
      recommendations: this.getCleanupRecommendations(),
    };

    console.log('📊 Reporte de limpieza generado:', report);
    return report;
  }

  // Obtener recomendaciones de limpieza
  getCleanupRecommendations() {
    const recommendations = [];

    if (this.optimizationStats.duplicatesFound > 0) {
      recommendations.push({
        priority: 'high',
        action: 'Eliminar archivos duplicados',
        description: `Se encontraron ${this.optimizationStats.duplicatesFound} archivos duplicados que pueden ser eliminados`,
        impact: 'Reducir tamaño del proyecto y confusión en el código'
      });
    }

    if (this.optimizationStats.unusedFound > 0) {
      recommendations.push({
        priority: 'medium',
        action: 'Revisar archivos no utilizados',
        description: `Se encontraron ${this.optimizationStats.unusedFound} archivos potencialmente no utilizados`,
        impact: 'Limpiar el proyecto y mejorar la organización'
      });
    }

    if (this.optimizationStats.spaceSaved > 0) {
      recommendations.push({
        priority: 'low',
        action: 'Optimización completada',
        description: `Se liberaron ${this.formatBytes(this.optimizationStats.spaceSaved)} de espacio`,
        impact: 'Mejorar rendimiento del navegador'
      });
    }

    return recommendations;
  }

  // Formatear bytes
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Ejecutar limpieza automática
  async executeCleanup() {
    console.log('🚀 Ejecutando limpieza automática...');
    
    try {
      // Limpiar localStorage
      this.optimizeLocalStorage();
      
      // Generar reporte
      const report = this.generateCleanupReport();
      
      // Mostrar notificación
      if (window.axyraNotificationSystem) {
        window.axyraNotificationSystem.showSuccess(
          `Limpieza completada: ${this.optimizationStats.filesRemoved} archivos procesados, ${this.formatBytes(this.optimizationStats.spaceSaved)} liberados`
        );
      }
      
      return report;
    } catch (error) {
      console.error('❌ Error en limpieza automática:', error);
      throw error;
    }
  }

  // Programar limpieza automática
  scheduleCleanup(intervalHours = 24) {
    const intervalMs = intervalHours * 60 * 60 * 1000;
    
    setInterval(() => {
      console.log('🕐 Ejecutando limpieza programada...');
      this.executeCleanup();
    }, intervalMs);
    
    console.log(`⏰ Limpieza programada cada ${intervalHours} horas`);
  }
}

// Inicializar sistema de limpieza
document.addEventListener('DOMContentLoaded', () => {
  window.axyraCleanup = new AxyraCleanupSystem();
  
  // Ejecutar limpieza inicial
  setTimeout(() => {
    window.axyraCleanup.executeCleanup();
  }, 5000);
  
  // Programar limpieza automática
  window.axyraCleanup.scheduleCleanup(24);
});

// Exportar para uso global
window.AxyraCleanupSystem = AxyraCleanupSystem;
