// ========================================
// SISTEMA DE MEMBRESÍAS DESHABILITADO AXYRA
// ========================================

console.log('⚠️ Sistema de membresías deshabilitado temporalmente');

// Crear un objeto mock para evitar errores
window.axyraMembershipSystem = {
  getCurrentMembership: () => ({ id: 'free', name: 'Plan Gratuito', status: 'active' }),
  getAvailablePlans: () => [],
  hasFeature: () => false,
  canAccessModule: () => true,
  showNotification: (message, type = 'info') => {
    console.log(`📢 Notificación (${type}): ${message}`);
  },
  show: (message, type = 'info') => {
    console.log(`📢 Notificación (${type}): ${message}`);
  },
  success: (message) => {
    console.log(`✅ Éxito: ${message}`);
  },
  error: (message) => {
    console.log(`❌ Error: ${message}`);
  },
  warning: (message) => {
    console.log(`⚠️ Advertencia: ${message}`);
  },
  info: (message) => {
    console.log(`ℹ️ Info: ${message}`);
  },
  clear: () => {
    console.log('🧹 Notificaciones limpiadas');
  },
  getStats: () => ({
    total: 0,
    byType: {},
    maxNotifications: 5
  })
};

console.log('✅ Sistema de membresías mock inicializado');
