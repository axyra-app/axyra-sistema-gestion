// ========================================
// SISTEMA DE OPTIMIZACIÓN DE BUNDLES AXYRA
// ========================================

class AxyraBundleOptimizer {
  constructor() {
    this.config = {
      enabled: true,
      codeSplitting: true,
      treeShaking: true,
      lazyLoading: true,
      preloading: true,
      minification: true,
      compression: true,
    };
    
    this.bundles = {
      critical: [],
      lazy: [],
      preload: [],
      unused: [],
    };
    
    this.metrics = {
      totalSize: 0,
      criticalSize: 0,
      lazySize: 0,
      unusedSize: 0,
      loadTime: 0,
      cacheHitRate: 0,
    };
    
    this.init();
  }

  init() {
    console.log('📦 Inicializando optimizador de bundles...');
    this.analyzeBundles();
    this.optimizeCriticalPath();
    this.setupLazyLoading();
    this.setupPreloading();
    this.implementTreeShaking();
    this.setupCodeSplitting();
  }

  // ANALIZAR BUNDLES EXISTENTES
  analyzeBundles() {
    const scripts = document.querySelectorAll('script[src]');
    const styles = document.querySelectorAll('link[rel="stylesheet"]');
    
    scripts.forEach(script => {
      const url = script.src;
      const isCritical = this.isCriticalResource(url);
      const isLazy = this.isLazyResource(url);
      
      if (isCritical) {
        this.bundles.critical.push(url);
      } else if (isLazy) {
        this.bundles.lazy.push(url);
      } else {
        this.bundles.preload.push(url);
      }
    });
    
    styles.forEach(style => {
      const url = style.href;
      if (this.isCriticalResource(url)) {
        this.bundles.critical.push(url);
      }
    });
    
    console.log('📊 Bundles analizados:', this.bundles);
  }

  // VERIFICAR SI ES RECURSO CRÍTICO
  isCriticalResource(url) {
    const criticalPatterns = [
      'firebase-config',
      'admin-brutal-functions',
      'admin-god-mode',
      'user-management-god',
      'form-validation',
      'lazy-loading',
      'cleanup-system',
      'optimization-system',
      'compression-system',
      'bundle-optimizer'
    ];
    
    return criticalPatterns.some(pattern => url.includes(pattern));
  }

  // VERIFICAR SI ES RECURSO LAZY
  isLazyResource(url) {
    const lazyPatterns = [
      'reportes',
      'inventario',
      'membresias',
      'configuracion',
      'cuadre_caja',
      'gestion_personal'
    ];
    
    return lazyPatterns.some(pattern => url.includes(pattern));
  }

  // OPTIMIZAR RUTA CRÍTICA
  optimizeCriticalPath() {
    console.log('⚡ Optimizando ruta crítica...');
    
    // Preload recursos críticos
    this.bundles.critical.forEach(url => {
      this.preloadResource(url, 'script');
    });
    
    // Optimizar orden de carga
    this.optimizeLoadOrder();
    
    // Implementar critical CSS
    this.implementCriticalCSS();
  }

  // PRELOAD RECURSO
  preloadResource(url, as) {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = as;
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  }

  // OPTIMIZAR ORDEN DE CARGA
  optimizeLoadOrder() {
    const criticalScripts = this.bundles.critical
      .filter(url => url.includes('.js'))
      .sort((a, b) => this.getLoadPriority(a) - this.getLoadPriority(b));
    
    criticalScripts.forEach((url, index) => {
      const script = document.querySelector(`script[src="${url}"]`);
      if (script) {
        script.setAttribute('data-priority', index + 1);
      }
    });
  }

  // OBTENER PRIORIDAD DE CARGA
  getLoadPriority(url) {
    const priorities = {
      'firebase-config': 1,
      'admin-brutal-functions': 2,
      'admin-god-mode': 3,
      'user-management-god': 4,
      'form-validation': 5,
      'lazy-loading': 6,
      'cleanup-system': 7,
      'optimization-system': 8,
      'compression-system': 9,
      'bundle-optimizer': 10
    };
    
    for (const [pattern, priority] of Object.entries(priorities)) {
      if (url.includes(pattern)) {
        return priority;
      }
    }
    
    return 999;
  }

  // IMPLEMENTAR CSS CRÍTICO
  implementCriticalCSS() {
    const criticalCSS = `
      /* CSS crítico para renderizado inicial */
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; font-family: 'Segoe UI', sans-serif; }
      .sidebar { position: fixed; left: 0; top: 0; width: 280px; height: 100vh; }
      .main-content { margin-left: 280px; padding: 20px; }
      .btn-brutal { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; }
      .modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); }
    `;
    
    const style = document.createElement('style');
    style.textContent = criticalCSS;
    style.setAttribute('data-critical', 'true');
    document.head.insertBefore(style, document.head.firstChild);
  }

  // CONFIGURAR LAZY LOADING
  setupLazyLoading() {
    if (this.config.lazyLoading) {
      this.bundles.lazy.forEach(url => {
        this.setupLazyLoad(url);
      });
    }
  }

  // CONFIGURAR LAZY LOAD PARA RECURSO
  setupLazyLoad(url) {
    const trigger = this.getLazyLoadTrigger(url);
    
    if (trigger === 'scroll') {
      this.setupScrollTrigger(url);
    } else if (trigger === 'hover') {
      this.setupHoverTrigger(url);
    } else if (trigger === 'click') {
      this.setupClickTrigger(url);
    }
  }

  // OBTENER TRIGGER DE LAZY LOAD
  getLazyLoadTrigger(url) {
    if (url.includes('reportes')) return 'click';
    if (url.includes('inventario')) return 'hover';
    if (url.includes('membresias')) return 'scroll';
    return 'scroll';
  }

  // CONFIGURAR TRIGGER DE SCROLL
  setupScrollTrigger(url) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadResource(url);
          observer.unobserve(entry.target);
        }
      });
    });
    
    // Observar elemento relacionado
    const relatedElement = this.getRelatedElement(url);
    if (relatedElement) {
      observer.observe(relatedElement);
    }
  }

  // CONFIGURAR TRIGGER DE HOVER
  setupHoverTrigger(url) {
    const relatedElement = this.getRelatedElement(url);
    if (relatedElement) {
      relatedElement.addEventListener('mouseenter', () => {
        this.loadResource(url);
      }, { once: true });
    }
  }

  // CONFIGURAR TRIGGER DE CLICK
  setupClickTrigger(url) {
    const relatedElement = this.getRelatedElement(url);
    if (relatedElement) {
      relatedElement.addEventListener('click', () => {
        this.loadResource(url);
      }, { once: true });
    }
  }

  // OBTENER ELEMENTO RELACIONADO
  getRelatedElement(url) {
    if (url.includes('reportes')) {
      return document.querySelector('[href*="reportes"]');
    }
    if (url.includes('inventario')) {
      return document.querySelector('[href*="inventario"]');
    }
    if (url.includes('membresias')) {
      return document.querySelector('[href*="membresias"]');
    }
    return null;
  }

  // CARGAR RECURSO
  loadResource(url) {
    if (url.includes('.js')) {
      this.loadScript(url);
    } else if (url.includes('.css')) {
      this.loadStyle(url);
    }
  }

  // CARGAR SCRIPT
  loadScript(url) {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    console.log('📜 Script cargado:', url);
  }

  // CARGAR ESTILO
  loadStyle(url) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
    console.log('🎨 Estilo cargado:', url);
  }

  // CONFIGURAR PRELOADING
  setupPreloading() {
    if (this.config.preloading) {
      this.bundles.preload.forEach(url => {
        this.preloadResource(url, 'script');
      });
    }
  }

  // IMPLEMENTAR TREE SHAKING
  implementTreeShaking() {
    if (this.config.treeShaking) {
      console.log('🌳 Implementando tree shaking...');
      
      // Identificar funciones no utilizadas
      const unusedFunctions = this.findUnusedFunctions();
      
      // Remover funciones no utilizadas
      unusedFunctions.forEach(func => {
        this.removeUnusedFunction(func);
      });
      
      console.log('🌳 Tree shaking completado:', unusedFunctions.length, 'funciones removidas');
    }
  }

  // ENCONTRAR FUNCIONES NO UTILIZADAS
  findUnusedFunctions() {
    const allFunctions = this.getAllFunctions();
    const usedFunctions = this.getUsedFunctions();
    
    return allFunctions.filter(func => !usedFunctions.includes(func));
  }

  // OBTENER TODAS LAS FUNCIONES
  getAllFunctions() {
    const functions = [];
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      const code = script.textContent;
      if (code) {
        const matches = code.match(/function\s+(\w+)/g);
        if (matches) {
          matches.forEach(match => {
            const funcName = match.replace('function ', '');
            functions.push(funcName);
          });
        }
      }
    });
    
    return functions;
  }

  // OBTENER FUNCIONES UTILIZADAS
  getUsedFunctions() {
    const usedFunctions = [];
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      const code = script.textContent;
      if (code) {
        const allFunctions = this.getAllFunctions();
        allFunctions.forEach(func => {
          if (code.includes(func) && !usedFunctions.includes(func)) {
            usedFunctions.push(func);
          }
        });
      }
    });
    
    return usedFunctions;
  }

  // REMOVER FUNCIÓN NO UTILIZADA
  removeUnusedFunction(funcName) {
    const scripts = document.querySelectorAll('script');
    
    scripts.forEach(script => {
      const code = script.textContent;
      if (code && code.includes(`function ${funcName}`)) {
        const regex = new RegExp(`function\\s+${funcName}\\s*\\([^)]*\\)\\s*\\{[^}]*\\}`, 'g');
        const newCode = code.replace(regex, '');
        script.textContent = newCode;
        console.log('🗑️ Función removida:', funcName);
      }
    });
  }

  // CONFIGURAR CODE SPLITTING
  setupCodeSplitting() {
    if (this.config.codeSplitting) {
      console.log('✂️ Configurando code splitting...');
      
      // Dividir por rutas
      this.splitByRoutes();
      
      // Dividir por funcionalidad
      this.splitByFunctionality();
      
      // Dividir por dependencias
      this.splitByDependencies();
    }
  }

  // DIVIDIR POR RUTAS
  splitByRoutes() {
    const routes = {
      '/admin-brutal.html': [
        'static/admin-brutal-functions.js',
        'static/admin-god-mode.js',
        'static/user-management-god.js'
      ],
      '/modulos/dashboard/': [
        'modulos/dashboard/dashboard.js'
      ],
      '/modulos/nomina/': [
        'modulos/nomina/nomina.js'
      ]
    };

    Object.entries(routes).forEach(([route, modules]) => {
      if (window.location.pathname.includes(route)) {
        modules.forEach(module => {
          this.loadResource(module);
        });
      }
    });
  }

  // DIVIDIR POR FUNCIONALIDAD
  splitByFunctionality() {
    const functionalities = {
      'authentication': ['firebase-config', 'auth-manager'],
      'admin': ['admin-brutal-functions', 'admin-god-mode'],
      'users': ['user-management-god'],
      'forms': ['form-validation'],
      'optimization': ['lazy-loading', 'cleanup-system', 'optimization-system']
    };

    Object.entries(functionalities).forEach(([func, modules]) => {
      if (this.isFunctionalityNeeded(func)) {
        modules.forEach(module => {
          this.loadResource(module);
        });
      }
    });
  }

  // VERIFICAR SI FUNCIONALIDAD ES NECESARIA
  isFunctionalityNeeded(functionality) {
    const currentPath = window.location.pathname;
    
    switch (functionality) {
      case 'authentication':
        return true; // Siempre necesaria
      case 'admin':
        return currentPath.includes('admin');
      case 'users':
        return currentPath.includes('admin') || currentPath.includes('users');
      case 'forms':
        return true; // Siempre necesaria
      case 'optimization':
        return true; // Siempre necesaria
      default:
        return false;
    }
  }

  // DIVIDIR POR DEPENDENCIAS
  splitByDependencies() {
    const dependencies = {
      'firebase': ['firebase-config', 'firebase-sync-manager'],
      'charts': ['chart.js'],
      'ui': ['form-validation', 'lazy-loading'],
      'admin': ['admin-brutal-functions', 'admin-god-mode', 'user-management-god']
    };

    Object.entries(dependencies).forEach(([dep, modules]) => {
      if (this.isDependencyNeeded(dep)) {
        modules.forEach(module => {
          this.loadResource(module);
        });
      }
    });
  }

  // VERIFICAR SI DEPENDENCIA ES NECESARIA
  isDependencyNeeded(dependency) {
    switch (dependency) {
      case 'firebase':
        return true; // Siempre necesaria
      case 'charts':
        return document.querySelector('#usersChart') !== null;
      case 'ui':
        return true; // Siempre necesaria
      case 'admin':
        return window.location.pathname.includes('admin');
      default:
        return false;
    }
  }

  // OBTENER MÉTRICAS DE BUNDLE
  getBundleMetrics() {
    return {
      bundles: this.bundles,
      metrics: this.metrics,
      recommendations: this.getBundleRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  // OBTENER RECOMENDACIONES DE BUNDLE
  getBundleRecommendations() {
    const recommendations = [];
    
    if (this.metrics.criticalSize > 500000) {
      recommendations.push({
        type: 'critical',
        priority: 'high',
        message: 'Bundle crítico muy grande',
        action: 'Implementar code splitting y lazy loading'
      });
    }
    
    if (this.metrics.unusedSize > 100000) {
      recommendations.push({
        type: 'unused',
        priority: 'medium',
        message: 'Código no utilizado detectado',
        action: 'Implementar tree shaking más agresivo'
      });
    }
    
    if (this.metrics.cacheHitRate < 0.8) {
      recommendations.push({
        type: 'cache',
        priority: 'medium',
        message: 'Tasa de cache hit baja',
        action: 'Mejorar estrategia de cache'
      });
    }
    
    return recommendations;
  }

  // OPTIMIZAR BUNDLE COMPLETO
  optimizeBundle() {
    console.log('📦 Optimizando bundle completo...');
    
    this.analyzeBundles();
    this.optimizeCriticalPath();
    this.setupLazyLoading();
    this.setupPreloading();
    this.implementTreeShaking();
    this.setupCodeSplitting();
    
    console.log('✅ Bundle optimizado correctamente');
    console.log('📊 Métricas de bundle:', this.getBundleMetrics());
  }
}

// Inicializar optimizador de bundles
document.addEventListener('DOMContentLoaded', () => {
  window.axyraBundleOptimizer = new AxyraBundleOptimizer();
  
  // Optimizar bundle después de un delay
  setTimeout(() => {
    window.axyraBundleOptimizer.optimizeBundle();
  }, 1000);
});

// Exportar para uso global
window.AxyraBundleOptimizer = AxyraBundleOptimizer;
