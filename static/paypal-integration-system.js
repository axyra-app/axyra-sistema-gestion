/**
 * AXYRA - Sistema de Integración PayPal
 * Gestión completa de pagos con PayPal
 */

class AxyraPayPalIntegration {
  constructor() {
    this.config = {
      // Credenciales de Producción
      production: {
        clientId: 'AfphhCNx4l5bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw',
        clientSecret: 'EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj',
        environment: 'production',
      },
      // Credenciales de Sandbox
      sandbox: {
        clientId: 'sb-iibki46281699@business.example.com',
        clientSecret: 'N:oX7d3)',
        environment: 'sandbox',
      },
    };

    this.currentEnvironment = 'sandbox'; // Cambiar a 'production' en producción
    this.isInitialized = false;
    this.payments = [];
    this.webhooks = [];

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando sistema de integración PayPal...');

      // Cargar configuración guardada
      this.loadConfiguration();

      // Inicializar SDK de PayPal
      await this.initializePayPalSDK();

      // Configurar webhooks
      this.setupWebhooks();

      // Cargar pagos existentes
      await this.loadPayments();

      this.isInitialized = true;
      console.log('✅ Sistema PayPal inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando PayPal:', error);
      this.showError('Error inicializando sistema de pagos PayPal');
    }
  }

  loadConfiguration() {
    const savedConfig = localStorage.getItem('axyra_paypal_config');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      this.currentEnvironment = config.environment || 'sandbox';
      console.log('📋 Configuración PayPal cargada:', this.currentEnvironment);
    }
  }

  async initializePayPalSDK() {
    return new Promise((resolve, reject) => {
      // Cargar script de PayPal
      if (window.paypal) {
        this.setupPayPal();
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${this.getClientId()}&currency=COP&intent=capture`;
      script.async = true;

      script.onload = () => {
        this.setupPayPal();
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Error cargando SDK de PayPal'));
      };

      document.head.appendChild(script);
    });
  }

  setupPayPal() {
    if (window.paypal) {
      console.log('✅ SDK de PayPal cargado correctamente');
      this.paypal = window.paypal;
    }
  }

  getClientId() {
    return this.config[this.currentEnvironment].clientId;
  }

  getClientSecret() {
    return this.config[this.currentEnvironment].clientSecret;
  }

  getEnvironment() {
    return this.config[this.currentEnvironment].environment;
  }

  // Crear pago
  async createPayment(paymentData) {
    try {
      console.log('💳 Creando pago PayPal:', paymentData);

      const payment = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        redirect_urls: {
          return_url: `${window.location.origin}/modulos/cuadre_caja/payment-success.html`,
          cancel_url: `${window.location.origin}/modulos/cuadre_caja/payment-cancel.html`,
        },
        transactions: [
          {
            amount: {
              total: paymentData.amount.toString(),
              currency: 'COP',
            },
            description: paymentData.description || 'Pago AXYRA - Villa Venecia',
            custom: paymentData.custom || '',
            item_list: {
              items: paymentData.items || [
                {
                  name: paymentData.description || 'Servicio',
                  sku: 'AXYRA-001',
                  price: paymentData.amount.toString(),
                  currency: 'COP',
                  quantity: 1,
                },
              ],
            },
          },
        ],
      };

      // Guardar pago en localStorage
      const paymentRecord = {
        id: this.generatePaymentId(),
        ...paymentData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        paypalPayment: payment,
      };

      this.payments.push(paymentRecord);
      this.savePayments();

      console.log('✅ Pago creado:', paymentRecord.id);
      return paymentRecord;
    } catch (error) {
      console.error('❌ Error creando pago:', error);
      throw error;
    }
  }

  // Ejecutar pago
  async executePayment(paymentId, payerId) {
    try {
      console.log('🔄 Ejecutando pago:', paymentId);

      const payment = this.payments.find((p) => p.id === paymentId);
      if (!payment) {
        throw new Error('Pago no encontrado');
      }

      // Aquí implementarías la lógica real de ejecución con PayPal API
      // Por ahora simulamos la ejecución
      payment.status = 'completed';
      payment.payerId = payerId;
      payment.completedAt = new Date().toISOString();
      payment.transactionId = this.generateTransactionId();

      this.savePayments();
      this.showSuccess('Pago procesado correctamente');

      console.log('✅ Pago ejecutado:', paymentId);
      return payment;
    } catch (error) {
      console.error('❌ Error ejecutando pago:', error);
      throw error;
    }
  }

  // Obtener pagos
  getPayments(filters = {}) {
    let filteredPayments = [...this.payments];

    if (filters.status) {
      filteredPayments = filteredPayments.filter((p) => p.status === filters.status);
    }

    if (filters.dateFrom) {
      filteredPayments = filteredPayments.filter((p) => new Date(p.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filteredPayments = filteredPayments.filter((p) => new Date(p.createdAt) <= new Date(filters.dateTo));
    }

    return filteredPayments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Obtener estadísticas de pagos
  getPaymentStats(period = 'month') {
    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    const payments = this.payments.filter((p) => new Date(p.createdAt) >= startDate && p.status === 'completed');

    const totalAmount = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const totalCount = payments.length;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

    return {
      totalAmount,
      totalCount,
      averageAmount,
      period,
      payments,
    };
  }

  // Configurar webhooks
  setupWebhooks() {
    // En un entorno real, configurarías webhooks aquí
    console.log('🔗 Webhooks de PayPal configurados');
  }

  // Cargar pagos
  async loadPayments() {
    const savedPayments = localStorage.getItem('axyra_paypal_payments');
    if (savedPayments) {
      this.payments = JSON.parse(savedPayments);
      console.log('📊 Pagos cargados:', this.payments.length);
    }
  }

  // Guardar pagos
  savePayments() {
    localStorage.setItem('axyra_paypal_payments', JSON.stringify(this.payments));
  }

  // Generar ID de pago
  generatePaymentId() {
    return 'PAY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Generar ID de transacción
  generateTransactionId() {
    return 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Mostrar dashboard de pagos
  showPaymentDashboard() {
    const modal = this.createPaymentDashboardModal();
    document.body.appendChild(modal);
  }

  createPaymentDashboardModal() {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal-overlay';
    modal.id = 'paypalDashboardModal';

    const stats = this.getPaymentStats();

    modal.innerHTML = `
      <div class="axyra-modal axyra-modal-large">
        <div class="axyra-modal-header">
          <h3><i class="fas fa-credit-card"></i> Dashboard de Pagos PayPal</h3>
          <button onclick="this.closest('.axyra-modal-overlay').remove()" class="axyra-modal-close">&times;</button>
        </div>
        <div class="axyra-modal-content">
          <div class="axyra-payment-stats">
            <div class="axyra-stat-card">
              <div class="axyra-stat-icon">
                <i class="fas fa-dollar-sign"></i>
              </div>
              <div class="axyra-stat-value">$${stats.totalAmount.toLocaleString()}</div>
              <div class="axyra-stat-label">Total Pagos</div>
            </div>
            <div class="axyra-stat-card">
              <div class="axyra-stat-icon">
                <i class="fas fa-receipt"></i>
              </div>
              <div class="axyra-stat-value">${stats.totalCount}</div>
              <div class="axyra-stat-label">Transacciones</div>
            </div>
            <div class="axyra-stat-card">
              <div class="axyra-stat-icon">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="axyra-stat-value">$${stats.averageAmount.toLocaleString()}</div>
              <div class="axyra-stat-label">Promedio</div>
            </div>
          </div>
          
          <div class="axyra-payment-actions">
            <button onclick="axyraPayPalIntegration.createNewPayment()" class="axyra-btn axyra-btn-primary">
              <i class="fas fa-plus"></i> Nuevo Pago
            </button>
            <button onclick="axyraPayPalIntegration.exportPayments()" class="axyra-btn axyra-btn-secondary">
              <i class="fas fa-download"></i> Exportar
            </button>
          </div>
          
          <div class="axyra-payments-table">
            <h4>Últimos Pagos</h4>
            <table class="axyra-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Descripción</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                ${this.payments
                  .slice(0, 10)
                  .map(
                    (payment) => `
                  <tr>
                    <td>${payment.id}</td>
                    <td>${payment.description}</td>
                    <td>$${payment.amount.toLocaleString()}</td>
                    <td><span class="axyra-status axyra-status-${payment.status}">${payment.status}</span></td>
                    <td>${new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button onclick="axyraPayPalIntegration.viewPayment('${
                        payment.id
                      }')" class="axyra-btn axyra-btn-sm axyra-btn-primary">
                        <i class="fas fa-eye"></i>
                      </button>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    return modal;
  }

  // Crear nuevo pago
  createNewPayment() {
    const modal = this.createNewPaymentModal();
    document.body.appendChild(modal);
  }

  createNewPaymentModal() {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal-overlay';
    modal.id = 'newPaymentModal';

    modal.innerHTML = `
      <div class="axyra-modal">
        <div class="axyra-modal-header">
          <h3><i class="fas fa-plus"></i> Nuevo Pago PayPal</h3>
          <button onclick="this.closest('.axyra-modal-overlay').remove()" class="axyra-modal-close">&times;</button>
        </div>
        <div class="axyra-modal-content">
          <form id="newPaymentForm">
            <div class="axyra-form-group">
              <label>Descripción del Pago *</label>
              <input type="text" id="paymentDescription" class="axyra-form-input" required 
                     placeholder="Ej: Pago de nómina, Servicio de catering, etc.">
            </div>
            <div class="axyra-form-group">
              <label>Monto (COP) *</label>
              <input type="number" id="paymentAmount" class="axyra-form-input" required 
                     min="1" step="0.01" placeholder="0.00">
            </div>
            <div class="axyra-form-group">
              <label>Cliente/Empleado</label>
              <input type="text" id="paymentCustomer" class="axyra-form-input" 
                     placeholder="Nombre del cliente o empleado">
            </div>
            <div class="axyra-form-group">
              <label>Observaciones</label>
              <textarea id="paymentNotes" class="axyra-form-textarea" 
                        placeholder="Notas adicionales sobre el pago"></textarea>
            </div>
          </form>
        </div>
        <div class="axyra-modal-footer">
          <button onclick="axyraPayPalIntegration.processNewPayment()" class="axyra-btn axyra-btn-primary">
            <i class="fas fa-credit-card"></i> Procesar Pago
          </button>
          <button onclick="this.closest('.axyra-modal-overlay').remove()" class="axyra-btn axyra-btn-secondary">
            Cancelar
          </button>
        </div>
      </div>
    `;

    return modal;
  }

  // Procesar nuevo pago
  async processNewPayment() {
    try {
      const description = document.getElementById('paymentDescription').value;
      const amount = parseFloat(document.getElementById('paymentAmount').value);
      const customer = document.getElementById('paymentCustomer').value;
      const notes = document.getElementById('paymentNotes').value;

      if (!description || !amount || amount <= 0) {
        this.showError('Por favor complete todos los campos requeridos');
        return;
      }

      const paymentData = {
        description,
        amount,
        customer,
        notes,
        custom: `CUSTOM_${Date.now()}`,
      };

      const payment = await this.createPayment(paymentData);

      // Cerrar modal
      document.getElementById('newPaymentModal').remove();

      // Mostrar dashboard actualizado
      this.showPaymentDashboard();

      this.showSuccess('Pago creado correctamente');
    } catch (error) {
      console.error('❌ Error procesando pago:', error);
      this.showError('Error procesando el pago: ' + error.message);
    }
  }

  // Exportar pagos
  exportPayments() {
    try {
      const payments = this.getPayments();
      const csvContent = this.convertToCSV(payments);

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pagos_paypal_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      URL.revokeObjectURL(url);
      this.showSuccess('Pagos exportados correctamente');
    } catch (error) {
      console.error('❌ Error exportando pagos:', error);
      this.showError('Error exportando pagos');
    }
  }

  convertToCSV(payments) {
    const headers = ['ID', 'Descripción', 'Monto', 'Estado', 'Cliente', 'Fecha Creación', 'Fecha Completado'];
    const rows = payments.map((p) => [
      p.id,
      p.description,
      p.amount,
      p.status,
      p.customer || '',
      p.createdAt,
      p.completedAt || '',
    ]);

    return [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(',')).join('\n');
  }

  // Ver pago específico
  viewPayment(paymentId) {
    const payment = this.payments.find((p) => p.id === paymentId);
    if (!payment) {
      this.showError('Pago no encontrado');
      return;
    }

    const modal = this.createPaymentDetailModal(payment);
    document.body.appendChild(modal);
  }

  createPaymentDetailModal(payment) {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal-overlay';
    modal.id = 'paymentDetailModal';

    modal.innerHTML = `
      <div class="axyra-modal">
        <div class="axyra-modal-header">
          <h3><i class="fas fa-receipt"></i> Detalle del Pago</h3>
          <button onclick="this.closest('.axyra-modal-overlay').remove()" class="axyra-modal-close">&times;</button>
        </div>
        <div class="axyra-modal-content">
          <div class="axyra-payment-detail">
            <div class="axyra-detail-row">
              <label>ID del Pago:</label>
              <span>${payment.id}</span>
            </div>
            <div class="axyra-detail-row">
              <label>Descripción:</label>
              <span>${payment.description}</span>
            </div>
            <div class="axyra-detail-row">
              <label>Monto:</label>
              <span class="axyra-amount">$${payment.amount.toLocaleString()}</span>
            </div>
            <div class="axyra-detail-row">
              <label>Estado:</label>
              <span class="axyra-status axyra-status-${payment.status}">${payment.status}</span>
            </div>
            <div class="axyra-detail-row">
              <label>Cliente:</label>
              <span>${payment.customer || 'N/A'}</span>
            </div>
            <div class="axyra-detail-row">
              <label>Fecha de Creación:</label>
              <span>${new Date(payment.createdAt).toLocaleString()}</span>
            </div>
            ${
              payment.completedAt
                ? `
            <div class="axyra-detail-row">
              <label>Fecha de Completado:</label>
              <span>${new Date(payment.completedAt).toLocaleString()}</span>
            </div>
            `
                : ''
            }
            ${
              payment.notes
                ? `
            <div class="axyra-detail-row">
              <label>Notas:</label>
              <span>${payment.notes}</span>
            </div>
            `
                : ''
            }
          </div>
        </div>
        <div class="axyra-modal-footer">
          <button onclick="this.closest('.axyra-modal-overlay').remove()" class="axyra-btn axyra-btn-secondary">
            Cerrar
          </button>
        </div>
      </div>
    `;

    return modal;
  }

  // Mostrar notificaciones
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  showError(message) {
    this.showNotification(message, 'error');
  }

  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `axyra-notification axyra-notification-${type}`;
    notification.innerHTML = `
      <div class="axyra-notification-content">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" class="axyra-notification-close">&times;</button>
      </div>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Inicializar sistema PayPal
window.axyraPayPalIntegration = new AxyraPayPalIntegration();

// Exportar para uso global
window.AxyraPayPalIntegration = AxyraPayPalIntegration;



