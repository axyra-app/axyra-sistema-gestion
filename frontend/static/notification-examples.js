// ========================================
// EJEMPLOS DE NOTIFICACIONES PROFESIONALES AXYRA
// ========================================

class AxyraNotificationExamples {
  constructor() {
    this.examples = [
      {
        type: 'warning',
        title: 'Empleados sin horas registradas',
        message: '1 empleado(s) no tienen horas registradas en el sistema',
        action: 'Ver empleados',
        duration: 0 // Persistente hasta que el usuario la cierre
      },
      {
        type: 'success',
        title: 'Pago procesado exitosamente',
        message: 'Tu suscripción al Plan Profesional ha sido activada',
        action: null,
        duration: 5000
      },
      {
        type: 'info',
        title: 'Nueva funcionalidad disponible',
        message: 'El módulo de inventario ha sido actualizado con nuevas características',
        action: 'Explorar',
        duration: 8000
      },
      {
        type: 'error',
        title: 'Error en el sistema',
        message: 'No se pudo conectar con el servidor. Verificando conexión...',
        action: 'Reintentar',
        duration: 10000
      }
    ];
  }

  showExampleNotification(index = 0) {
    if (window.axyraNotificationSystem) {
      const example = this.examples[index] || this.examples[0];
      
      window.axyraNotificationSystem.showNotification(
        example.message,
        example.type,
        example.duration,
        example.action
      );
    }
  }

  showAllExamples() {
    this.examples.forEach((example, index) => {
      setTimeout(() => {
        this.showExampleNotification(index);
      }, index * 2000);
    });
  }

  showEmployeeWarning() {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.warning(
        '1 empleado(s) no tienen horas registradas en el sistema',
        0, // Persistente
        'Ver empleados'
      );
    }
  }

  showPaymentSuccess() {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.success(
        'Tu suscripción al Plan Profesional ha sido activada',
        5000,
        null
      );
    }
  }

  showSystemInfo() {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.info(
        'El módulo de inventario ha sido actualizado con nuevas características',
        8000,
        'Explorar'
      );
    }
  }
}

// Inicializar ejemplos
document.addEventListener('DOMContentLoaded', () => {
  window.axyraNotificationExamples = new AxyraNotificationExamples();
  
  // Mostrar notificación de ejemplo después de 2 segundos
  setTimeout(() => {
    if (window.axyraNotificationExamples) {
      window.axyraNotificationExamples.showEmployeeWarning();
    }
  }, 2000);
});

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraNotificationExamples;
}
