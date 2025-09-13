// ========================================
// SISTEMA DE DIAGNÓSTICO AXYRA
// ========================================

class AxyraDiagnostic {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  // Ejecutar diagnóstico completo
  async runFullDiagnostic() {
    console.log('🔍 Iniciando diagnóstico completo de AXYRA...');

    this.checkFirebaseConfiguration();
    this.checkGlobalFunctions();
    this.checkScriptLoading();
    this.checkLocalStorage();
    this.checkConsoleErrors();

    this.displayResults();
    return {
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions,
    };
  }

  // Verificar configuración de Firebase
  checkFirebaseConfiguration() {
    console.log('🔍 Verificando configuración de Firebase...');

    // Verificar si Firebase está cargado
    if (typeof firebase === 'undefined') {
      this.errors.push('Firebase SDK no está cargado');
      return;
    }

    // Verificar si Firebase está inicializado
    if (!window.axyraFirebase) {
      this.errors.push('Firebase no está inicializado correctamente');
      return;
    }

    // Verificar servicios de Firebase
    if (!window.axyraFirebase.auth) {
      this.errors.push('Firebase Auth no está disponible');
    }

    if (!window.axyraFirebase.firestore) {
      this.errors.push('Firebase Firestore no está disponible');
    }

    // Verificar FieldValue
    if (!window.axyraFirebase.FieldValue) {
      this.warnings.push('Firebase FieldValue no está disponible - usando timestamps locales');
    }

    // Verificar autenticación
    const user = window.axyraFirebase.auth.currentUser;
    if (!user) {
      this.warnings.push('Usuario no autenticado en Firebase');
    } else {
      console.log('✅ Usuario autenticado:', user.email);
    }
  }

  // Verificar funciones globales
  checkGlobalFunctions() {
    console.log('🔍 Verificando funciones globales...');

    if (typeof obtenerUsuarioActual !== 'function') {
      this.errors.push('Función obtenerUsuarioActual no está definida globalmente');
    } else {
      console.log('✅ Función obtenerUsuarioActual disponible');
    }

    if (typeof window.firebaseSyncManager === 'undefined') {
      this.errors.push('FirebaseSyncManager no está inicializado');
    } else {
      console.log('✅ FirebaseSyncManager disponible');
    }
  }

  // Verificar carga de scripts
  checkScriptLoading() {
    console.log('🔍 Verificando carga de scripts...');

    const requiredScripts = [
      'firebase-config.js',
      'firebase-sync-manager.js',
      'roles-config.js',
      'notifications-system.js',
    ];

    requiredScripts.forEach((script) => {
      const scriptElement = document.querySelector(`script[src*="${script}"]`);
      if (!scriptElement) {
        this.errors.push(`Script requerido no encontrado: ${script}`);
      } else {
        console.log(`✅ Script cargado: ${script}`);
      }
    });
  }

  // Verificar localStorage
  checkLocalStorage() {
    console.log('🔍 Verificando localStorage...');

    const requiredKeys = ['axyra_isolated_user', 'axyra_company_id'];

    requiredKeys.forEach((key) => {
      if (!localStorage.getItem(key)) {
        this.warnings.push(`Clave de localStorage no encontrada: ${key}`);
      } else {
        console.log(`✅ Clave de localStorage encontrada: ${key}`);
      }
    });
  }

  // Verificar errores de consola
  checkConsoleErrors() {
    console.log('🔍 Verificando errores de consola...');

    // Interceptar errores de consola
    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
      this.errors.push(`Error de consola: ${args.join(' ')}`);
      originalError.apply(console, args);
    };

    console.warn = (...args) => {
      this.warnings.push(`Advertencia de consola: ${args.join(' ')}`);
      originalWarn.apply(console, args);
    };
  }

  // Mostrar resultados
  displayResults() {
    console.log('\n📊 RESULTADOS DEL DIAGNÓSTICO AXYRA');
    console.log('=====================================');

    if (this.errors.length > 0) {
      console.error(`❌ ERRORES ENCONTRADOS (${this.errors.length}):`);
      this.errors.forEach((error, index) => {
        console.error(`  ${index + 1}. ${error}`);
      });
    } else {
      console.log('✅ No se encontraron errores críticos');
    }

    if (this.warnings.length > 0) {
      console.warn(`⚠️ ADVERTENCIAS (${this.warnings.length}):`);
      this.warnings.forEach((warning, index) => {
        console.warn(`  ${index + 1}. ${warning}`);
      });
    }

    if (this.suggestions.length > 0) {
      console.log(`💡 SUGERENCIAS (${this.suggestions.length}):`);
      this.suggestions.forEach((suggestion, index) => {
        console.log(`  ${index + 1}. ${suggestion}`);
      });
    }

    console.log('\n🔧 Para ejecutar este diagnóstico manualmente, usa:');
    console.log('axyraDiagnostic.runFullDiagnostic()');
  }

  // Función para probar Firebase
  async testFirebase() {
    console.log('🧪 Probando funcionalidad de Firebase...');

    try {
      if (!window.axyraFirebase?.firestore) {
        throw new Error('Firebase no disponible');
      }

      // Probar escritura de datos de prueba
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: 'Prueba de diagnóstico AXYRA',
      };

      await window.axyraFirebase.firestore.collection('diagnostic_tests').add(testData);

      console.log('✅ Prueba de Firebase exitosa');
      return true;
    } catch (error) {
      console.error('❌ Error en prueba de Firebase:', error);
      return false;
    }
  }

  // Función para limpiar datos de prueba
  async cleanupTestData() {
    try {
      if (!window.axyraFirebase?.firestore) return;

      const snapshot = await window.axyraFirebase.firestore.collection('diagnostic_tests').get();

      const batch = window.axyraFirebase.firestore.batch();
      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('🧹 Datos de prueba limpiados');
    } catch (error) {
      console.error('❌ Error limpiando datos de prueba:', error);
    }
  }
}

// Crear instancia global
window.axyraDiagnostic = new AxyraDiagnostic();

// Ejecutar diagnóstico automáticamente después de 2 segundos
setTimeout(() => {
  window.axyraDiagnostic.runFullDiagnostic();
}, 2000);

console.log('🔍 Sistema de diagnóstico AXYRA cargado');
console.log('💡 Usa axyraDiagnostic.runFullDiagnostic() para ejecutar diagnóstico manual');

