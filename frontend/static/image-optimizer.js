// ========================================
// SISTEMA DE OPTIMIZACIÓN DE IMÁGENES AXYRA
// ========================================

class AxyraImageOptimizer {
  constructor() {
    this.config = {
      enabled: true,
      lazyLoading: true,
      webpConversion: true,
      responsiveImages: true,
      compression: true,
      blurPlaceholder: true,
      progressiveLoading: true,
    };
    
    this.metrics = {
      totalImages: 0,
      optimizedImages: 0,
      originalSize: 0,
      optimizedSize: 0,
      compressionRatio: 0,
      loadTime: 0,
    };
    
    this.init();
  }

  init() {
    console.log('🖼️ Inicializando optimizador de imágenes...');
    this.optimizeExistingImages();
    this.setupLazyLoading();
    this.setupWebPConversion();
    this.setupResponsiveImages();
    this.setupBlurPlaceholders();
    this.setupProgressiveLoading();
  }

  // OPTIMIZAR IMÁGENES EXISTENTES
  optimizeExistingImages() {
    const images = document.querySelectorAll('img');
    this.metrics.totalImages = images.length;
    
    images.forEach((img, index) => {
      this.optimizeImage(img, index);
    });
    
    console.log('🖼️ Imágenes optimizadas:', this.metrics.optimizedImages, 'de', this.metrics.totalImages);
  }

  // OPTIMIZAR IMAGEN INDIVIDUAL
  optimizeImage(img, index) {
    const originalSize = this.getImageSize(img);
    this.metrics.originalSize += originalSize;
    
    // Lazy loading
    if (this.config.lazyLoading) {
      this.setupLazyLoad(img);
    }
    
    // WebP conversion
    if (this.config.webpConversion) {
      this.convertToWebP(img);
    }
    
    // Responsive images
    if (this.config.responsiveImages) {
      this.setupResponsiveImage(img);
    }
    
    // Blur placeholder
    if (this.config.blurPlaceholder) {
      this.setupBlurPlaceholder(img);
    }
    
    // Progressive loading
    if (this.config.progressiveLoading) {
      this.setupProgressiveLoading(img);
    }
    
    this.metrics.optimizedImages++;
    console.log(`🖼️ Imagen ${index + 1} optimizada:`, img.src);
  }

  // OBTENER TAMAÑO DE IMAGEN
  getImageSize(img) {
    return img.naturalWidth * img.naturalHeight * 4; // Aproximación RGBA
  }

  // CONFIGURAR LAZY LOADING
  setupLazyLoad(img) {
    if (!img.loading) {
      img.loading = 'lazy';
    }
    
    // Intersection Observer para lazy loading personalizado
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    observer.observe(img);
  }

  // CARGAR IMAGEN
  loadImage(img) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    
    img.addEventListener('load', () => {
      img.classList.add('loaded');
      this.metrics.optimizedSize += this.getImageSize(img);
    });
  }

  // CONVERTIR A WEBP
  convertToWebP(img) {
    if (this.supportsWebP() && !img.src.includes('.webp')) {
      const webpSrc = img.src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      // Verificar si existe la versión WebP
      this.checkWebPExists(webpSrc).then(exists => {
        if (exists) {
          img.src = webpSrc;
        }
      });
    }
  }

  // VERIFICAR SI EXISTE WEBP
  checkWebPExists(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  // VERIFICAR SOPORTE DE WEBP
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // CONFIGURAR IMÁGENES RESPONSIVAS
  setupResponsiveImage(img) {
    if (!img.srcset) {
      const src = img.src;
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

  // CONFIGURAR BLUR PLACEHOLDER
  setupBlurPlaceholder(img) {
    if (!img.dataset.blur) {
      // Crear placeholder con blur
      const placeholder = this.createBlurPlaceholder(img);
      img.style.backgroundImage = `url(${placeholder})`;
      img.style.backgroundSize = 'cover';
      img.style.backgroundPosition = 'center';
      img.style.filter = 'blur(10px)';
      
      img.addEventListener('load', () => {
        img.style.filter = 'none';
        img.style.backgroundImage = 'none';
      });
    }
  }

  // CREAR BLUR PLACEHOLDER
  createBlurPlaceholder(img) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 40;
    canvas.height = 40;
    
    // Crear gradiente simple
    const gradient = ctx.createLinearGradient(0, 0, 40, 40);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 40, 40);
    
    return canvas.toDataURL('image/jpeg', 0.1);
  }

  // CONFIGURAR CARGA PROGRESIVA
  setupProgressiveLoading(img) {
    if (!img.dataset.progressive) {
      img.style.opacity = '0';
      img.style.transition = 'opacity 0.3s ease';
      
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
    }
  }

  // OPTIMIZAR IMAGEN CON CANVAS
  optimizeImageWithCanvas(img, quality = 0.8) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    
    ctx.drawImage(img, 0, 0);
    
    return canvas.toDataURL('image/jpeg', quality);
  }

  // COMPRIMIR IMAGEN
  compressImage(img, maxWidth = 1920, maxHeight = 1080, quality = 0.8) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    let { width, height } = img;
    
    // Calcular nuevas dimensiones manteniendo aspect ratio
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width *= ratio;
      height *= ratio;
    }
    
    canvas.width = width;
    canvas.height = height;
    
    ctx.drawImage(img, 0, 0, width, height);
    
    return canvas.toDataURL('image/jpeg', quality);
  }

  // GENERAR THUMBNAIL
  generateThumbnail(img, size = 150) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = size;
    canvas.height = size;
    
    ctx.drawImage(img, 0, 0, size, size);
    
    return canvas.toDataURL('image/jpeg', 0.7);
  }

  // OPTIMIZAR IMÁGENES EN BACKGROUND
  optimizeImagesInBackground() {
    const images = document.querySelectorAll('img[data-optimize="true"]');
    
    images.forEach(img => {
      this.optimizeImageInBackground(img);
    });
  }

  // OPTIMIZAR IMAGEN EN BACKGROUND
  optimizeImageInBackground(img) {
    const worker = new Worker('/static/image-worker.js');
    
    worker.postMessage({
      imageData: img.src,
      options: {
        maxWidth: 1920,
        maxHeight: 1080,
        quality: 0.8,
        format: 'webp'
      }
    });
    
    worker.onmessage = (event) => {
      const { optimizedData } = event.data;
      img.src = optimizedData;
      worker.terminate();
    };
  }

  // CONFIGURAR OBSERVER PARA NUEVAS IMÁGENES
  setupImageObserver() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'IMG') {
              this.optimizeImage(node);
            }
            
            const images = node.querySelectorAll('img');
            images.forEach(img => this.optimizeImage(img));
          }
        });
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // OBTENER MÉTRICAS DE OPTIMIZACIÓN
  getOptimizationMetrics() {
    this.metrics.compressionRatio = 
      ((this.metrics.originalSize - this.metrics.optimizedSize) / this.metrics.originalSize) * 100;
    
    return {
      config: this.config,
      metrics: this.metrics,
      recommendations: this.getOptimizationRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  // OBTENER RECOMENDACIONES DE OPTIMIZACIÓN
  getOptimizationRecommendations() {
    const recommendations = [];
    
    if (this.metrics.compressionRatio < 30) {
      recommendations.push({
        type: 'compression',
        priority: 'medium',
        message: 'Ratio de compresión de imágenes bajo',
        action: 'Implementar compresión más agresiva y conversión a WebP'
      });
    }
    
    if (this.metrics.originalSize > 5000000) {
      recommendations.push({
        type: 'size',
        priority: 'high',
        message: 'Tamaño total de imágenes muy grande',
        action: 'Implementar lazy loading y optimización de imágenes'
      });
    }
    
    if (this.metrics.optimizedImages < this.metrics.totalImages * 0.8) {
      recommendations.push({
        type: 'coverage',
        priority: 'medium',
        message: 'Cobertura de optimización baja',
        action: 'Revisar configuración de optimización'
      });
    }
    
    return recommendations;
  }

  // FORMATEAR BYTES
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // OPTIMIZAR TODAS LAS IMÁGENES
  optimizeAllImages() {
    console.log('🖼️ Optimizando todas las imágenes...');
    
    this.optimizeExistingImages();
    this.setupImageObserver();
    
    console.log('✅ Optimización de imágenes completada');
    console.log('📊 Métricas de optimización:', this.getOptimizationMetrics());
  }
}

// Inicializar optimizador de imágenes
document.addEventListener('DOMContentLoaded', () => {
  window.axyraImageOptimizer = new AxyraImageOptimizer();
  
  // Optimizar imágenes después de un delay
  setTimeout(() => {
    window.axyraImageOptimizer.optimizeAllImages();
  }, 1000);
});

// Exportar para uso global
window.AxyraImageOptimizer = AxyraImageOptimizer;
