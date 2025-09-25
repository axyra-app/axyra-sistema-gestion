// ========================================
// LIMPIADOR DE CLASES DUPLICADAS AXYRA
// ========================================

class AxyraDuplicateCleaner {
  constructor() {
    this.init();
  }

  init() {
    console.log('🧹 Iniciando limpieza de clases duplicadas...');
    
    // Limpiar inmediatamente
    this.cleanDuplicateClasses();
    
    // Limpiar periódicamente
    setInterval(() => {
      this.cleanDuplicateClasses();
    }, 5000);
  }

  cleanDuplicateClasses() {
    try {
      // Limpiar referencias globales duplicadas
      this.cleanGlobalReferences();
      
      // Limpiar scripts duplicados
      this.cleanDuplicateScripts();
      
    } catch (error) {
      console.warn('⚠️ Error limpiando clases duplicadas:', error);
    }
  }

  cleanGlobalReferences() {
    try {
      // Limpiar referencias a clases duplicadas
      const duplicateClasses = [
        'AxyraAIChatProfessional',
        'AxyraMembershipSystemUnified',
        'AxyraNotificationSystemOld'
      ];
      
      duplicateClasses.forEach(className => {
        if (window[className]) {
          console.log(`🗑️ Limpiando referencia duplicada: ${className}`);
          delete window[className];
        }
      });
      
    } catch (error) {
      console.warn('⚠️ Error limpiando referencias globales:', error);
    }
  }

  cleanDuplicateScripts() {
    try {
      // Buscar y eliminar scripts duplicados
      const scripts = document.querySelectorAll('script[src*="axyra-ai-chat-professional"]');
      scripts.forEach((script, index) => {
        if (index > 0) { // Mantener solo el primero
          console.log('🗑️ Eliminando script duplicado:', script.src);
          script.remove();
        }
      });
      
    } catch (error) {
      console.warn('⚠️ Error limpiando scripts duplicados:', error);
    }
  }

  // Método para forzar limpieza completa
  forceClean() {
    console.log('🧹 Forzando limpieza completa de duplicados...');
    
    // Limpiar todas las referencias globales problemáticas
    const globalKeys = Object.keys(window);
    globalKeys.forEach(key => {
      if (key.includes('AxyraAI') || key.includes('AxyraMembership') || key.includes('AxyraNotification')) {
        if (key.includes('Professional') || key.includes('Unified') || key.includes('Old')) {
          console.log(`🗑️ Limpiando referencia global: ${key}`);
          delete window[key];
        }
      }
    });
    
    console.log('✅ Limpieza completa de duplicados realizada');
  }
}

// Inicializar limpiador inmediatamente
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraDuplicateCleaner = new AxyraDuplicateCleaner();
  });
} else {
  window.axyraDuplicateCleaner = new AxyraDuplicateCleaner();
}

// Exportar para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraDuplicateCleaner;
}
