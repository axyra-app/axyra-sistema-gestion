/**
 * AXYRA - Sistema de Pagos con EmailJS
 * Integración de correos electrónicos para notificaciones de pagos
 */

class AxyraPaymentEmailSystem {
  constructor() {
    this.paymentHistory = [];
    this.subscriptions = [];
    this.plans = [];
    this.init();
  }

  init() {
    this.loadData();
    this.setupEventListeners();
    console.log('✅ Sistema de pagos con EmailJS inicializado');
  }

  loadData() {
    try {
      this.paymentHistory = JSON.parse(localStorage.getItem('axyra_payment_history') || '[]');
      this.subscriptions = JSON.parse(localStorage.getItem('axyra_subscriptions') || '[]');
      this.plans = JSON.parse(localStorage.getItem('axyra_plans') || '[]');
    } catch (error) {
      console.error('❌ Error cargando datos de pagos:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_payment_history', JSON.stringify(this.paymentHistory));
      localStorage.setItem('axyra_subscriptions', JSON.stringify(this.subscriptions));
    } catch (error) {
      console.error('❌ Error guardando datos de pagos:', error);
    }
  }

  setupEventListeners() {
    document.addEventListener('paymentProcessed', (event) => {
      this.handlePaymentProcessed(event.detail);
    });
  }

  // ========================================
  // PROCESAMIENTO DE PAGOS
  // ========================================
  async processPayment(paymentData) {
    try {
      console.log('💳 Procesando pago:', paymentData);
      
      // Simular procesamiento de pago
      const transactionId = 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      const paymentResult = {
        success: true,
        transactionId: transactionId,
        amount: paymentData.amount,
        currency: 'COP',
        status: 'APPROVED',
        paymentMethod: paymentData.method || 'Wompi',
        timestamp: new Date().toISOString()
      };
      
      // Guardar pago
      this.paymentHistory.push(paymentResult);
      this.saveData();
      
      // Crear o actualizar suscripción
      await this.updateUserSubscription(paymentData.userId, paymentData.planId);
      
      // Enviar correo de resumen
      await this.sendPaymentSummaryEmail(paymentData, paymentResult);
      
      // Mostrar notificación
      this.showNotification('Pago procesado exitosamente', 'success');
      
      return paymentResult;
      
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      this.showNotification('Error procesando pago', 'error');
      throw error;
    }
  }

  // ========================================
  // ENVÍO DE CORREOS DE PAGO
  // ========================================
  async sendPaymentSummaryEmail(paymentData, paymentResult) {
    try {
      if (!window.axyraEmailService) {
        console.warn('⚠️ Servicio de correos no disponible');
        return;
      }

      // Obtener datos del usuario
      const userData = await this.getUserData(paymentData.userId);
      if (!userData) {
        console.warn('⚠️ Usuario no encontrado para envío de correo');
        return;
      }

      // Obtener datos del plan
      const planData = this.getPlanData(paymentData.planId);
      
      // Preparar datos para el correo
      const emailData = {
        amount: paymentResult.amount,
        method: paymentResult.paymentMethod,
        transactionId: paymentResult.transactionId,
        planName: planData.name,
        duration: planData.duration,
        nextPayment: this.calculateNextPayment(planData)
      };

      // Enviar correo
      const result = await window.axyraEmailService.sendPaymentSummaryEmail(userData, emailData);
      
      if (result.success) {
        console.log('✅ Correo de resumen de pago enviado');
      } else {
        console.warn('⚠️ Error enviando correo de resumen:', result.message);
      }

    } catch (error) {
      console.error('❌ Error enviando correo de resumen:', error);
    }
  }

  // ========================================
  // GESTIÓN DE SUSCRIPCIONES
  // ========================================
  async updateUserSubscription(userId, planId) {
    try {
      // Buscar suscripción existente
      let subscription = this.subscriptions.find(sub => sub.userId === userId);
      
      if (subscription) {
        // Actualizar suscripción existente
        subscription.planId = planId;
        subscription.status = 'active';
        subscription.endDate = this.calculateEndDate(planId);
        subscription.lastPayment = new Date().toISOString();
      } else {
        // Crear nueva suscripción
        subscription = {
          id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          userId: userId,
          planId: planId,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: this.calculateEndDate(planId),
          lastPayment: new Date().toISOString()
        };
        
        this.subscriptions.push(subscription);
      }
      
      this.saveData();
      console.log('✅ Suscripción actualizada:', subscription.id);
      
    } catch (error) {
      console.error('❌ Error actualizando suscripción:', error);
    }
  }

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================
  async getUserData(userId) {
    try {
      // Buscar usuario en localStorage
      const users = JSON.parse(localStorage.getItem('axyra_users') || '[]');
      return users.find(user => user.id === userId);
    } catch (error) {
      console.error('❌ Error obteniendo datos del usuario:', error);
      return null;
    }
  }

  getPlanData(planId) {
    const plans = {
      basic: { name: 'Plan Básico', duration: '1 mes', price: 29000 },
      professional: { name: 'Plan Profesional', duration: '1 mes', price: 59000 },
      enterprise: { name: 'Plan Empresarial', duration: '1 mes', price: 99000 }
    };
    
    return plans[planId] || { name: 'Plan Desconocido', duration: '1 mes', price: 0 };
  }

  calculateEndDate(planId) {
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);
    return endDate.toISOString();
  }

  calculateNextPayment(planData) {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toLocaleDateString('es-CO');
  }

  // ========================================
  // NOTIFICACIONES DE NÓMINA
  // ========================================
  async sendPayrollNotification(employeeData, payrollData) {
    try {
      if (!window.axyraEmailService) {
        console.warn('⚠️ Servicio de correos no disponible');
        return;
      }

      const result = await window.axyraEmailService.sendPayrollNotificationEmail(employeeData, payrollData);
      
      if (result.success) {
        console.log('✅ Notificación de nómina enviada');
      } else {
        console.warn('⚠️ Error enviando notificación de nómina:', result.message);
      }

    } catch (error) {
      console.error('❌ Error enviando notificación de nómina:', error);
    }
  }

  // ========================================
  // ESTADÍSTICAS DE PAGOS
  // ========================================
  getPaymentStatistics() {
    const totalPayments = this.paymentHistory.length;
    const successfulPayments = this.paymentHistory.filter(p => p.status === 'APPROVED').length;
    const totalRevenue = this.paymentHistory
      .filter(p => p.status === 'APPROVED')
      .reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalPayments,
      successfulPayments,
      totalRevenue,
      successRate: totalPayments > 0 ? Math.round((successfulPayments / totalPayments) * 100) : 0
    };
  }

  // ========================================
  // INTERFAZ DE USUARIO
  // ========================================
  showPaymentDashboard() {
    const stats = this.getPaymentStatistics();
    
    const dashboard = document.createElement('div');
    dashboard.id = 'payment-dashboard';
    dashboard.innerHTML = `
      <div class="payment-dashboard-overlay">
        <div class="payment-dashboard-container">
          <div class="payment-dashboard-header">
            <h3>💳 Dashboard de Pagos</h3>
            <button class="btn btn-close" onclick="document.getElementById('payment-dashboard').remove()">×</button>
          </div>
          <div class="payment-dashboard-body">
            <div class="payment-stats">
              <div class="stat-card">
                <div class="stat-value">${stats.totalPayments}</div>
                <div class="stat-label">Total Pagos</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.successfulPayments}</div>
                <div class="stat-label">Pagos Exitosos</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${stats.successRate}%</div>
                <div class="stat-label">Tasa de Éxito</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">$${stats.totalRevenue.toLocaleString()}</div>
                <div class="stat-label">Ingresos Totales</div>
              </div>
            </div>
            <div class="payment-history">
              <h4>Historial de Pagos Recientes</h4>
              ${this.renderPaymentHistory()}
            </div>
          </div>
        </div>
      </div>
    `;
    
    dashboard.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    
    document.body.appendChild(dashboard);
  }

  renderPaymentHistory() {
    const recentPayments = this.paymentHistory.slice(-10);
    
    if (recentPayments.length === 0) {
      return '<p>No hay pagos registrados</p>';
    }
    
    return recentPayments.map(payment => `
      <div class="payment-item">
        <div class="payment-info">
          <span class="payment-id">${payment.transactionId}</span>
          <span class="payment-amount">$${payment.amount.toLocaleString()}</span>
        </div>
        <div class="payment-details">
          <span class="payment-method">${payment.paymentMethod}</span>
          <span class="payment-date">${new Date(payment.timestamp).toLocaleDateString()}</span>
          <span class="payment-status status-${payment.status.toLowerCase()}">${payment.status}</span>
        </div>
      </div>
    `).join('');
  }

  showNotification(message, type = 'info') {
    if (window.axyraErrorHandler) {
      window.axyraErrorHandler.showNotification('Sistema de Pagos', message, type);
    } else {
      alert(`${type.toUpperCase()}: ${message}`);
    }
  }

  // ========================================
  // FUNCIONES PÚBLICAS
  // ========================================
  async simulatePayment(userId, planId, amount) {
    const paymentData = {
      userId: userId,
      planId: planId,
      amount: amount,
      method: 'Wompi'
    };
    
    return await this.processPayment(paymentData);
  }
}

// Inicializar sistema de pagos con EmailJS
document.addEventListener('DOMContentLoaded', () => {
  window.axyraPaymentEmailSystem = new AxyraPaymentEmailSystem();
  console.log('✅ Sistema de pagos con EmailJS cargado');
});

// Exportar para uso global
window.AxyraPaymentEmailSystem = AxyraPaymentEmailSystem;
