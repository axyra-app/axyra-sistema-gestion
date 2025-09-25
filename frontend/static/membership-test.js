// ========================================
// PRUEBA DEL SISTEMA DE MEMBRESÍAS AXYRA
// ========================================

class AxyraMembershipTest {
  constructor() {
    this.init();
  }

  init() {
    console.log('🧪 Iniciando prueba del sistema de membresías...');
    
    // Esperar a que el sistema esté cargado
    setTimeout(() => {
      this.testMembershipSystem();
    }, 2000);
  }

  testMembershipSystem() {
    try {
      console.log('🧪 Probando sistema de membresías...');
      
      // Verificar si el sistema está disponible
      if (window.axyraMembershipSystem) {
        console.log('✅ Sistema de membresías encontrado');
        
        // Obtener membresía actual
        const currentMembership = window.axyraMembershipSystem.getCurrentMembership();
        console.log('💎 Membresía actual:', currentMembership);
        
        // Obtener planes disponibles
        const availablePlans = window.axyraMembershipSystem.getAvailablePlans();
        console.log('📋 Planes disponibles:', availablePlans);
        
        // Verificar funcionalidades
        const hasAdvancedFeatures = window.axyraMembershipSystem.hasFeature('advancedFeatures');
        console.log('🔧 Funcionalidades avanzadas:', hasAdvancedFeatures);
        
        // Verificar acceso a módulos
        const canAccessCaja = window.axyraMembershipSystem.canAccessModule('caja');
        console.log('🏦 Acceso a caja:', canAccessCaja);
        
        this.showTestResults(currentMembership, availablePlans, hasAdvancedFeatures, canAccessCaja);
        
      } else {
        console.error('❌ Sistema de membresías no encontrado');
        this.showError('Sistema de membresías no está disponible');
      }
      
    } catch (error) {
      console.error('❌ Error probando sistema de membresías:', error);
      this.showError('Error probando sistema: ' + error.message);
    }
  }

  showTestResults(membership, plans, hasAdvanced, canAccessCaja) {
    const results = {
      membership: membership,
      plansCount: plans.length,
      hasAdvanced: hasAdvanced,
      canAccessCaja: canAccessCaja,
      status: 'FUNCIONANDO'
    };
    
    console.log('📊 Resultados de la prueba:', results);
    
    // Mostrar notificación de prueba
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.success(
        `Sistema de membresías funcionando. Plan actual: ${membership.name}`,
        5000
      );
    }
  }

  showError(message) {
    console.error('❌ Error en prueba:', message);
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.error(message, 5000);
    }
  }

  // Método para probar selección de plan
  testPlanSelection(planId) {
    if (window.axyraMembershipSystem) {
      console.log(`🧪 Probando selección de plan: ${planId}`);
      window.axyraMembershipSystem.selectPlan(planId);
    }
  }

  // Método para mostrar estadísticas
  showStats() {
    if (window.axyraMembershipSystem) {
      const membership = window.axyraMembershipSystem.getCurrentMembership();
      const plans = window.axyraMembershipSystem.getAvailablePlans();
      
      console.log('📊 Estadísticas del sistema de membresías:');
      console.log('- Membresía actual:', membership);
      console.log('- Total de planes:', plans.length);
      console.log('- Planes disponibles:', plans.map(p => p.name));
    }
  }
}

// Inicializar prueba
document.addEventListener('DOMContentLoaded', () => {
  window.axyraMembershipTest = new AxyraMembershipTest();
});

// Exportar para uso manual
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraMembershipTest;
}
