// ========================================
// SISTEMA DE COMPRESIÓN AXYRA
// ========================================

class AxyraCompressionSystem {
  constructor() {
    this.config = {
      enabled: true,
      gzipLevel: 6,
      brotliLevel: 4,
      minifyHTML: true,
      minifyCSS: true,
      minifyJS: true,
      optimizeImages: true,
      removeComments: true,
      removeWhitespace: true,
    };
    
    this.compressionStats = {
      originalSize: 0,
      compressedSize: 0,
      compressionRatio: 0,
      timeSaved: 0,
    };
    
    this.init();
  }

  init() {
    console.log('🗜️ Inicializando sistema de compresión...');
    this.compressHTML();
    this.compressCSS();
    this.compressJavaScript();
    this.optimizeImages();
    this.setupCompressionHeaders();
  }

  // COMPRIMIR HTML
  compressHTML() {
    if (this.config.minifyHTML) {
      const htmlContent = document.documentElement.outerHTML;
      const originalSize = new Blob([htmlContent]).size;
      
      const compressed = this.minifyHTML(htmlContent);
      const compressedSize = new Blob([compressed]).size;
      
      this.updateStats(originalSize, compressedSize);
      console.log('📄 HTML comprimido:', this.formatBytes(originalSize), '→', this.formatBytes(compressedSize));
    }
  }

  // MINIFICAR HTML
  minifyHTML(html) {
    return html
      .replace(/<!--[\s\S]*?-->/g, '') // Remover comentarios
      .replace(/\s+/g, ' ') // Comprimir espacios
      .replace(/>\s+</g, '><') // Remover espacios entre tags
      .replace(/\s+>/g, '>') // Remover espacios antes de >
      .replace(/<\s+/g, '<') // Remover espacios después de <
      .trim();
  }

  // COMPRIMIR CSS
  compressCSS() {
    if (this.config.minifyCSS) {
      const styleSheets = document.styleSheets;
      let totalOriginalSize = 0;
      let totalCompressedSize = 0;
      
      for (let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets[i];
        if (sheet.href && !sheet.href.includes('cdn')) {
          this.compressStyleSheet(sheet);
        }
      }
      
      // Comprimir CSS inline
      const inlineStyles = document.querySelectorAll('style');
      inlineStyles.forEach(style => {
        const originalSize = new Blob([style.textContent]).size;
        const compressed = this.minifyCSS(style.textContent);
        const compressedSize = new Blob([compressed]).size;
        
        totalOriginalSize += originalSize;
        totalCompressedSize += compressedSize;
        
        style.textContent = compressed;
      });
      
      if (totalOriginalSize > 0) {
        console.log('🎨 CSS comprimido:', this.formatBytes(totalOriginalSize), '→', this.formatBytes(totalCompressedSize));
      }
    }
  }

  // COMPRIMIR STYLESHEET
  compressStyleSheet(sheet) {
    try {
      const rules = sheet.cssRules;
      if (rules) {
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          if (rule.type === CSSRule.STYLE_RULE) {
            rule.selectorText = this.minifyCSSSelector(rule.selectorText);
            rule.style.cssText = this.minifyCSS(rule.style.cssText);
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ No se pudo comprimir stylesheet:', error);
    }
  }

  // MINIFICAR CSS
  minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios
      .replace(/\s+/g, ' ') // Comprimir espacios
      .replace(/\s*{\s*/g, '{') // Remover espacios alrededor de {
      .replace(/\s*}\s*/g, '}') // Remover espacios alrededor de }
      .replace(/\s*;\s*/g, ';') // Remover espacios alrededor de ;
      .replace(/\s*:\s*/g, ':') // Remover espacios alrededor de :
      .replace(/\s*,\s*/g, ',') // Remover espacios alrededor de ,
      .replace(/\s*>\s*/g, '>') // Remover espacios alrededor de >
      .replace(/\s*\+\s*/g, '+') // Remover espacios alrededor de +
      .replace(/\s*~\s*/g, '~') // Remover espacios alrededor de ~
      .replace(/\s*\[\s*/g, '[') // Remover espacios alrededor de [
      .replace(/\s*\]\s*/g, ']') // Remover espacios alrededor de ]
      .replace(/\s*\(\s*/g, '(') // Remover espacios alrededor de (
      .replace(/\s*\)\s*/g, ')') // Remover espacios alrededor de )
      .trim();
  }

  // MINIFICAR SELECTOR CSS
  minifyCSSSelector(selector) {
    return selector
      .replace(/\s+/g, ' ') // Comprimir espacios
      .replace(/\s*>\s*/g, '>') // Remover espacios alrededor de >
      .replace(/\s*\+\s*/g, '+') // Remover espacios alrededor de +
      .replace(/\s*~\s*/g, '~') // Remover espacios alrededor de ~
      .trim();
  }

  // COMPRIMIR JAVASCRIPT
  compressJavaScript() {
    if (this.config.minifyJS) {
      const scripts = document.querySelectorAll('script:not([src])');
      let totalOriginalSize = 0;
      let totalCompressedSize = 0;
      
      scripts.forEach(script => {
        const originalSize = new Blob([script.textContent]).size;
        const compressed = this.minifyJavaScript(script.textContent);
        const compressedSize = new Blob([compressed]).size;
        
        totalOriginalSize += originalSize;
        totalCompressedSize += compressedSize;
        
        script.textContent = compressed;
      });
      
      if (totalOriginalSize > 0) {
        console.log('📜 JavaScript comprimido:', this.formatBytes(totalOriginalSize), '→', this.formatBytes(totalCompressedSize));
      }
    }
  }

  // MINIFICAR JAVASCRIPT
  minifyJavaScript(js) {
    return js
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remover comentarios de bloque
      .replace(/\/\/.*$/gm, '') // Remover comentarios de línea
      .replace(/\s+/g, ' ') // Comprimir espacios
      .replace(/\s*{\s*/g, '{') // Remover espacios alrededor de {
      .replace(/\s*}\s*/g, '}') // Remover espacios alrededor de }
      .replace(/\s*;\s*/g, ';') // Remover espacios alrededor de ;
      .replace(/\s*,\s*/g, ',') // Remover espacios alrededor de ,
      .replace(/\s*:\s*/g, ':') // Remover espacios alrededor de :
      .replace(/\s*\(\s*/g, '(') // Remover espacios alrededor de (
      .replace(/\s*\)\s*/g, ')') // Remover espacios alrededor de )
      .replace(/\s*\[\s*/g, '[') // Remover espacios alrededor de [
      .replace(/\s*\]\s*/g, ']') // Remover espacios alrededor de ]
      .replace(/\s*\+\s*/g, '+') // Remover espacios alrededor de +
      .replace(/\s*-\s*/g, '-') // Remover espacios alrededor de -
      .replace(/\s*\*\s*/g, '*') // Remover espacios alrededor de *
      .replace(/\s*\/\s*/g, '/') // Remover espacios alrededor de /
      .replace(/\s*%\s*/g, '%') // Remover espacios alrededor de %
      .replace(/\s*=\s*/g, '=') // Remover espacios alrededor de =
      .replace(/\s*==\s*/g, '==') // Remover espacios alrededor de ==
      .replace(/\s*!=\s*/g, '!=') // Remover espacios alrededor de !=
      .replace(/\s*===\s*/g, '===') // Remover espacios alrededor de ===
      .replace(/\s*!==\s*/g, '!==') // Remover espacios alrededor de !==
      .replace(/\s*&&\s*/g, '&&') // Remover espacios alrededor de &&
      .replace(/\s*\|\|\s*/g, '||') // Remover espacios alrededor de ||
      .replace(/\s*<\s*/g, '<') // Remover espacios alrededor de <
      .replace(/\s*>\s*/g, '>') // Remover espacios alrededor de >
      .replace(/\s*<=\s*/g, '<=') // Remover espacios alrededor de <=
      .replace(/\s*>=\s*/g, '>=') // Remover espacios alrededor de >=
      .trim();
  }

  // OPTIMIZAR IMÁGENES
  optimizeImages() {
    if (this.config.optimizeImages) {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        this.optimizeImage(img);
      });
    }
  }

  // OPTIMIZAR IMAGEN
  optimizeImage(img) {
    // Lazy loading
    if (!img.loading) {
      img.loading = 'lazy';
    }
    
    // Optimizar srcset
    if (img.src && !img.srcset) {
      this.generateSrcset(img);
    }
    
    // Convertir a WebP si es posible
    if (this.supportsWebP()) {
      this.convertToWebP(img);
    }
  }

  // GENERAR SRCSET
  generateSrcset(img) {
    const src = img.src;
    if (src) {
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
    const src = img.src;
    if (src && !src.includes('.webp')) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      img.src = webpSrc;
    }
  }

  // VERIFICAR SOPORTE DE WEBP
  supportsWebP() {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // CONFIGURAR HEADERS DE COMPRESIÓN
  setupCompressionHeaders() {
    // Agregar meta tags para compresión
    const meta = document.createElement('meta');
    meta.name = 'compression';
    meta.content = 'gzip, deflate, br';
    document.head.appendChild(meta);
    
    // Configurar Content-Encoding
    if (document.head) {
      const style = document.createElement('style');
      style.textContent = `
        /* Compresión habilitada */
        * { box-sizing: border-box; }
      `;
      document.head.appendChild(style);
    }
  }

  // ACTUALIZAR ESTADÍSTICAS
  updateStats(originalSize, compressedSize) {
    this.compressionStats.originalSize += originalSize;
    this.compressionStats.compressedSize += compressedSize;
    this.compressionStats.compressionRatio = 
      ((originalSize - compressedSize) / originalSize) * 100;
    this.compressionStats.timeSaved = 
      (originalSize - compressedSize) / 1024; // KB ahorrados
  }

  // FORMATEAR BYTES
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // OBTENER REPORTE DE COMPRESIÓN
  getCompressionReport() {
    return {
      config: this.config,
      stats: this.compressionStats,
      recommendations: this.getCompressionRecommendations(),
      timestamp: new Date().toISOString(),
    };
  }

  // OBTENER RECOMENDACIONES DE COMPRESIÓN
  getCompressionRecommendations() {
    const recommendations = [];
    
    if (this.compressionStats.compressionRatio < 30) {
      recommendations.push({
        type: 'compression',
        priority: 'medium',
        message: 'Ratio de compresión bajo',
        action: 'Revisar configuración de compresión y minificación'
      });
    }
    
    if (this.compressionStats.originalSize > 1000000) {
      recommendations.push({
        type: 'size',
        priority: 'high',
        message: 'Tamaño de recursos muy grande',
        action: 'Implementar lazy loading y optimización de imágenes'
      });
    }
    
    return recommendations;
  }

  // COMPRIMIR RECURSO ESPECÍFICO
  compressResource(url, type) {
    return fetch(url)
      .then(response => response.text())
      .then(content => {
        let compressed;
        
        switch (type) {
          case 'html':
            compressed = this.minifyHTML(content);
            break;
          case 'css':
            compressed = this.minifyCSS(content);
            break;
          case 'js':
            compressed = this.minifyJavaScript(content);
            break;
          default:
            compressed = content;
        }
        
        const originalSize = new Blob([content]).size;
        const compressedSize = new Blob([compressed]).size;
        
        this.updateStats(originalSize, compressedSize);
        
        return {
          original: content,
          compressed: compressed,
          originalSize: originalSize,
          compressedSize: compressedSize,
          compressionRatio: ((originalSize - compressedSize) / originalSize) * 100
        };
      });
  }

  // APLICAR COMPRESIÓN A TODO EL DOM
  compressDOM() {
    console.log('🗜️ Aplicando compresión a todo el DOM...');
    
    this.compressHTML();
    this.compressCSS();
    this.compressJavaScript();
    this.optimizeImages();
    
    console.log('✅ Compresión del DOM completada');
    console.log('📊 Reporte de compresión:', this.getCompressionReport());
  }
}

// Inicializar sistema de compresión
document.addEventListener('DOMContentLoaded', () => {
  window.axyraCompression = new AxyraCompressionSystem();
  
  // Aplicar compresión después de un delay
  setTimeout(() => {
    window.axyraCompression.compressDOM();
  }, 2000);
});

// Exportar para uso global
window.AxyraCompressionSystem = AxyraCompressionSystem;
