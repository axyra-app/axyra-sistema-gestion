// ========================================
// SISTEMA DE OPTIMIZACIÓN AXYRA - FASE 2
// ========================================

class AxyraOptimizationSystem {
  constructor() {
    this.config = {
      minification: true,
      compression: true,
      lazyLoading: true,
      imageOptimization: true,
      bundleOptimization: true,
      cacheOptimization: true,
      performanceMonitoring: true,
    };
    
    this.metrics = {
      loadTime: 0,
      bundleSize: 0,
      imageSize: 0,
      cacheHitRate: 0,
      compressionRatio: 0,
    };
    
    this.init();
  }

  init() {
    console.log('⚡ Inicializando sistema de optimización AXYRA...');
    this.setupPerformanceMonitoring();
    this.optimizeImages();
    this.optimizeCSS();
    this.optimizeJavaScript();
    this.setupServiceWorker();
    this.optimizeFonts();
    this.setupPreloading();
  }

  // MONITOREO DE RENDIMIENTO
  setupPerformanceMonitoring() {
    if (this.config.performanceMonitoring) {
      // Medir tiempo de carga
      window.addEventListener('load', () => {
        this.metrics.loadTime = performance.now();
        this.logPerformanceMetrics();
      });

      // Medir Core Web Vitals
      this.measureCoreWebVitals();
      
      // Monitorear memoria
      this.monitorMemoryUsage();
      
      // Monitorear red
      this.monitorNetworkPerformance();
    }
  }

  // MEDIR CORE WEB VITALS
  measureCoreWebVitals() {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('📊 LCP:', lastEntry.startTime);
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        console.log('📊 FID:', entry.processingStart - entry.startTime);
      });
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('📊 CLS:', clsValue);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  // MONITOREAR USO DE MEMORIA
  monitorMemoryUsage() {
    if (performance.memory) {
      setInterval(() => {
        const memory = performance.memory;
        console.log('🧠 Memoria:', {
          used: this.formatBytes(memory.usedJSHeapSize),
          total: this.formatBytes(memory.totalJSHeapSize),
          limit: this.formatBytes(memory.jsHeapSizeLimit),
        });
      }, 30000); // Cada 30 segundos
    }
  }

  // MONITOREAR RENDIMIENTO DE RED
  monitorNetworkPerformance() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'resource') {
          console.log('🌐 Recurso:', {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize,
          });
        }
      });
    });
    observer.observe({ entryTypes: ['resource'] });
  }

  // OPTIMIZAR IMÁGENES
  optimizeImages() {
    if (this.config.imageOptimization) {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        // Lazy loading nativo
        if (!img.loading) {
          img.loading = 'lazy';
        }
        
        // Optimizar srcset
        this.optimizeImageSrcset(img);
        
        // Compresión WebP
        this.convertToWebP(img);
      });
    }
  }

  // OPTIMIZAR SRCSET DE IMÁGENES
  optimizeImageSrcset(img) {
    const src = img.src;
    if (src && !img.srcset) {
      const baseName = src.replace(/\.[^/.]+$/, '');
      const extension = src.split('.').pop();
      
      img.srcset = `
        ${baseName}-320w.${extension} 320w,
        ${baseName}-640w.${extension} 640w,
        ${baseName}-1024w.${extension} 1024w,
        ${baseName}-1920w.${extension} 1920w
      `;
      img.sizes = '(max-width: 320px) 320px, (max-width: 640px) 640px, (max-width: 1024px) 1024px, 1920px';
    }
  }

  // CONVERTIR A WEBP
  convertToWebP(img) {
    if (this.supportsWebP()) {
      const src = img.src;
      if (src && !src.includes('.webp')) {
        const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        img.src = webpSrc;
      }
    }
  }

  // VERIFICAR SOPORTE DE WEBP
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // OPTIMIZAR CSS
  optimizeCSS() {
    if (this.config.minification) {
      const styleSheets = document.styleSheets;
      for (let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets[i];
        if (sheet.href && !sheet.href.includes('cdn')) {
          this.minifyCSS(sheet);
        }
      }
    }
  }

  // MINIFICAR CSS
  minifyCSS(sheet) {
    try {
      const rules = sheet.cssRules;
      if (rules) {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule.type === CSSRule.STYLE_RULE) {
            // Remover espacios innecesarios
            rule.selectorText = rule.selectorText.replace(/\s+/g, ' ').trim();
            rule.style.cssText = rule.style.cssText.replace(/\s+/g, ' ').trim();
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo minificar CSS:', error);
    }
  }

  // OPTIMIZAR JAVASCRIPT
  optimizeJavaScript() {
    if (this.config.minification) {
      // Minificar scripts inline
      const scripts = document.querySelectorAll('script:not([src])');
      scripts.forEach((script) => {
        this.minifyJavaScript(script);
      });
    }
  }

  // MINIFICAR JAVASCRIPT
  minifyJavaScript(script) {
    const code = script.textContent;
    if (code) {
      // Remover comentarios
      const minified = code
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\/\/.*$/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      script.textContent = minified;
    }
  }

  // CONFIGURAR SERVICE WORKER
  setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registrado:', registration);
        })
        .catch((error) => {
          console.warn('⚠️ Error registrando Service Worker:', error);
        });
    }
  }

  // OPTIMIZAR FUENTES
  optimizeFonts() {
    // Preload fuentes críticas
    const criticalFonts = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
    ];

    criticalFonts.forEach((font) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = font;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }

  // CONFIGURAR PRELOADING
  setupPreloading() {
    // Preload recursos críticos
    const criticalResources = [
      '/static/firebase-config-secure.js',
      '/static/admin-brutal-functions.js',
      '/static/admin-god-mode.js',
      '/static/user-management-god.js'
    ];

    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = resource;
      document.head.appendChild(link);
    });
  }

  // OPTIMIZAR BUNDLE
  optimizeBundle() {
    if (this.config.bundleOptimization) {
      // Lazy load módulos no críticos
      this.lazyLoadNonCriticalModules();
      
      // Tree shaking de funciones no utilizadas
      this.treeShakeUnusedFunctions();
      
      // Code splitting
      this.splitCodeByRoute();
    }
  }

  // LAZY LOAD MÓDULOS NO CRÍTICOS
  lazyLoadNonCriticalModules() {
    const nonCriticalModules = [
      'modulos/reportes/reportes-avanzados.js',
      'modulos/inventario/inventario.js',
      'modulos/membresias/membresias.js'
    ];

    nonCriticalModules.forEach((module) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = module;
      document.head.appendChild(link);
    });
  }

  // TREE SHAKE FUNCIONES NO UTILIZADAS
  treeShakeUnusedFunctions() {
    // Identificar funciones no utilizadas
    const usedFunctions = new Set();
    const allFunctions = this.getAllFunctions();
    
    // Marcar funciones utilizadas
    allFunctions.forEach(func => {
      if (this.isFunctionUsed(func)) {
        usedFunctions.add(func);
      }
    });
    
    console.log('🌳 Funciones no utilizadas:', allFunctions.filter(f => !usedFunctions.has(f)));
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

  // VERIFICAR SI FUNCIÓN ES UTILIZADA
  isFunctionUsed(funcName) {
    const scripts = document.querySelectorAll('script');
    for (let script of scripts) {
      const code = script.textContent;
      if (code && code.includes(funcName)) {
        return true;
      }
    }
    return false;
  }

  // DIVIDIR CÓDIGO POR RUTA
  splitCodeByRoute() {
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
          this.loadModule(module);
        });
      }
    });
  }

  // CARGAR MÓDULO
  loadModule(modulePath) {
    const script = document.createElement('script');
    script.src = modulePath;
    script.async = true;
    document.head.appendChild(script);
  }

  // OPTIMIZAR CACHE
  optimizeCache() {
    if (this.config.cacheOptimization) {
      // Configurar cache headers
      this.setCacheHeaders();
      
      // Implementar cache strategy
      this.implementCacheStrategy();
      
      // Limpiar cache antiguo
      this.cleanOldCache();
    }
  }

  // CONFIGURAR CACHE HEADERS
  setCacheHeaders() {
    const resources = document.querySelectorAll('link[rel="stylesheet"], script[src], img[src]');
    resources.forEach(resource => {
      if (resource.href || resource.src) {
        // Agregar timestamp para cache busting
        const url = new URL(resource.href || resource.src);
        url.searchParams.set('v', Date.now());
        if (resource.href) resource.href = url.toString();
        if (resource.src) resource.src = url.toString();
      }
    });
  }

  // IMPLEMENTAR ESTRATEGIA DE CACHE
  implementCacheStrategy() {
    // Cache first para recursos estáticos
    const staticResources = document.querySelectorAll('img[src], link[rel="stylesheet"]');
    staticResources.forEach(resource => {
      resource.addEventListener('load', () => {
        this.cacheResource(resource.href || resource.src);
      });
    });
  }

  // CACHEAR RECURSO
  cacheResource(url) {
    if ('caches' in window) {
      caches.open('axyra-cache-v1').then(cache => {
        cache.add(url);
      });
    }
  }

  // LIMPIAR CACHE ANTIGUO
  cleanOldCache() {
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          if (name !== 'axyra-cache-v1') {
            caches.delete(name);
          }
        });
      });
    }
  }

  // LOGGING DE MÉTRICAS
  logPerformanceMetrics() {
    console.log('📊 Métricas de rendimiento:', {
      loadTime: this.metrics.loadTime,
      bundleSize: this.metrics.bundleSize,
      imageSize: this.metrics.imageSize,
      cacheHitRate: this.metrics.cacheHitRate,
      compressionRatio: this.metrics.compressionRatio,
    });
  }

  // FORMATEAR BYTES
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // OBTENER REPORTE DE OPTIMIZACIÓN
  getOptimizationReport() {
    return {
      config: this.config,
      metrics: this.metrics,
      recommendations: this.getRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  // OBTENER RECOMENDACIONES
  getRecommendations() {
    const recommendations = [];

    if (this.metrics.loadTime > 3000) {
      recommendations.push({
        type: 'performance',
        priority: 'high',
        message: 'Tiempo de carga lento',
        action: 'Optimizar recursos críticos y implementar lazy loading'
      });
    }

    if (this.metrics.bundleSize > 500000) {
      recommendations.push({
        type: 'bundle',
        priority: 'medium',
        message: 'Bundle de JavaScript muy grande',
        action: 'Implementar code splitting y tree shaking'
      });
    }

    if (this.metrics.imageSize > 1000000) {
      recommendations.push({
        type: 'images',
        priority: 'medium',
        message: 'Imágenes sin optimizar',
        action: 'Convertir a WebP y implementar lazy loading'
      });
    }

    return recommendations;
  }
}

// Inicializar sistema de optimización
document.addEventListener('DOMContentLoaded', () => {
  window.axyraOptimization = new AxyraOptimizationSystem();
});

// Exportar para uso global
window.AxyraOptimizationSystem = AxyraOptimizationSystem;
