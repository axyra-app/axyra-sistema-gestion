/**
 * AXYRA - Configuración de PayPal
 * Configuración centralizada de credenciales y entorno
 */

window.AxyraPayPalConfig = {
  // Configuración de entorno
  environment: 'sandbox', // 'sandbox' o 'production'

  // Credenciales de Sandbox (para pruebas)
  sandbox: {
    clientId: 'sb-iibki46281699@business.example.com',
    clientSecret: 'N:oX7d3)',
    environment: 'sandbox',
  },

  // Credenciales de Producción
  production: {
    clientId: 'AfphhCNx4l5bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw',
    clientSecret: 'EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj',
    environment: 'production',
  },

  // Configuración de moneda
  currency: 'COP',

  // URLs de redirección
  redirectUrls: {
    return: `${window.location.origin}/modulos/cuadre_caja/payment-success.html`,
    cancel: `${window.location.origin}/modulos/cuadre_caja/payment-cancel.html`,
  },

  // Configuración de la empresa
  business: {
    name: 'Villa Venecia',
    email: 'contacto@villavenecia.com',
    phone: '+57 300 123 4567',
    address: {
      line1: 'Calle Principal #123',
      city: 'Bogotá',
      state: 'Cundinamarca',
      postalCode: '110111',
      country: 'CO',
    },
  },

  // Configuración de webhooks
  webhooks: {
    enabled: true,
    url: `${window.location.origin}/api/paypal-webhook`,
    events: [
      'PAYMENT.CAPTURE.COMPLETED',
      'PAYMENT.CAPTURE.DENIED',
      'PAYMENT.CAPTURE.PENDING',
      'PAYMENT.CAPTURE.REFUNDED',
      'PAYMENT.CAPTURE.REVERSED',
    ],
  },

  // Configuración de notificaciones
  notifications: {
    enabled: true,
    email: true,
    push: true,
  },

  // Métodos de obtener configuración actual
  getCurrentConfig() {
    return this[this.environment];
  },

  // Cambiar entorno
  setEnvironment(env) {
    if (env === 'sandbox' || env === 'production') {
      this.environment = env;
      localStorage.setItem('axyra_paypal_environment', env);
      console.log(`🔄 Entorno PayPal cambiado a: ${env}`);
    } else {
      console.error('❌ Entorno inválido. Use "sandbox" o "production"');
    }
  },

  // Cargar configuración guardada
  loadSavedConfig() {
    const savedEnv = localStorage.getItem('axyra_paypal_environment');
    if (savedEnv && (savedEnv === 'sandbox' || savedEnv === 'production')) {
      this.environment = savedEnv;
      console.log(`📋 Entorno PayPal cargado: ${savedEnv}`);
    }
  },

  // Validar configuración
  validateConfig() {
    const config = this.getCurrentConfig();
    const required = ['clientId', 'clientSecret', 'environment'];

    for (const field of required) {
      if (!config[field]) {
        console.error(`❌ Campo requerido faltante: ${field}`);
        return false;
      }
    }

    console.log('✅ Configuración PayPal válida');
    return true;
  },

  // Obtener URL del SDK
  getSDKUrl() {
    const config = this.getCurrentConfig();
    return `https://www.paypal.com/sdk/js?client-id=${config.clientId}&currency=${this.currency}&intent=capture`;
  },

  // Inicializar configuración
  init() {
    this.loadSavedConfig();
    this.validateConfig();
    console.log('🚀 Configuración PayPal inicializada');
  },
};

// Inicializar automáticamente
window.AxyraPayPalConfig.init();








