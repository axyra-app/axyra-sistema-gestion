// ========================================
// CONFIGURACIÓN DE PAYPAL - AXYRA
// ========================================
// Archivo de ejemplo para configuración de PayPal
// Copia este archivo como paypal-config.js y configura tus valores reales

const paypalConfig = {
  // ========================================
  // CREDENCIALES DE PAYPAL BUSINESS
  // ========================================
  clientId: 'AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw',
  clientSecret: 'EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj;',
  merchantId: 'tu_paypal_merchant_id_aqui', // Obtener desde PayPal Dashboard
  webhookId: 'tu_paypal_webhook_id_aqui', // Configurar webhook en PayPal

  // ========================================
  // CONFIGURACIÓN DE ENTORNO
  // ========================================
  environment: 'sandbox', // 'sandbox' para pruebas, 'production' para producción
  baseUrl: 'https://api.sandbox.paypal.com', // Cambiar a https://api.paypal.com para producción

  // ========================================
  // URLs DE CALLBACK
  // ========================================
  returnUrl: 'https://tu-dominio.com/payment/success',
  cancelUrl: 'https://tu-dominio.com/payment/cancel',
  webhookUrl: 'https://tu-dominio.com/api/paypal/webhook',

  // ========================================
  // CONFIGURACIÓN DE PAGOS
  // ========================================
  currency: 'COP', // Moneda por defecto
  locale: 'es_CO', // Idioma y región
  intent: 'capture', // 'capture' para capturar inmediatamente, 'authorize' para autorizar

  // ========================================
  // CONFIGURACIÓN DE EXPERIENCIA
  // ========================================
  experience: {
    brandName: 'AXYRA Sistema de Gestión',
    logoUrl: 'https://tu-dominio.com/logo.png',
    locale: 'es_CO',
    colorScheme: 'blue',
    buttonShape: 'rect',
    buttonSize: 'large',
    buttonLabel: 'paypal',
  },

  // ========================================
  // CONFIGURACIÓN DE WEBHOOKS
  // ========================================
  webhookEvents: [
    'PAYMENT.CAPTURE.COMPLETED',
    'PAYMENT.CAPTURE.DENIED',
    'PAYMENT.CAPTURE.PENDING',
    'PAYMENT.CAPTURE.REFUNDED',
    'PAYMENT.CAPTURE.REVERSED',
    'CHECKOUT.ORDER.APPROVED',
    'CHECKOUT.ORDER.COMPLETED',
    'CHECKOUT.ORDER.VOIDED',
  ],

  // ========================================
  // CONFIGURACIÓN DE TIMEOUTS
  // ========================================
  timeout: 30000, // 30 segundos
  retryAttempts: 3,
  retryDelay: 1000, // 1 segundo

  // ========================================
  // CONFIGURACIÓN DE LOGGING
  // ========================================
  logging: {
    enabled: true,
    level: 'info', // 'debug', 'info', 'warn', 'error'
    logRequests: true,
    logResponses: true,
  },

  // ========================================
  // CONFIGURACIÓN DE SEGURIDAD
  // ========================================
  security: {
    validateWebhookSignature: true,
    requireHttps: true,
    allowedIps: [], // Array de IPs permitidas para webhooks
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMs: 900000, // 15 minutos
    },
  },

  // ========================================
  // CONFIGURACIÓN DE NOTIFICACIONES
  // ========================================
  notifications: {
    email: {
      enabled: true,
      from: 'jfuran.va@gmail.com',
      to: 'jfuran.va@gmail.com',
    },
    webhook: {
      enabled: true,
      url: 'https://tu-dominio.com/api/notifications/paypal',
    },
  },

  // ========================================
  // CONFIGURACIÓN DE DESARROLLO
  // ========================================
  development: {
    mockPayments: false, // Simular pagos en desarrollo
    debugMode: true,
    verboseLogging: true,
  },

  // ========================================
  // CONFIGURACIÓN DE PRODUCCIÓN
  // ========================================
  production: {
    mockPayments: false,
    debugMode: false,
    verboseLogging: false,
    enableAnalytics: true,
  },
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Obtiene la configuración según el entorno
 */
function getConfig() {
  const env = process.env.NODE_ENV || 'development';
  const isProduction = env === 'production';

  return {
    ...paypalConfig,
    environment: isProduction ? 'production' : 'sandbox',
    baseUrl: isProduction ? 'https://api.paypal.com' : 'https://api.sandbox.paypal.com',
    ...(isProduction ? paypalConfig.production : paypalConfig.development),
  };
}

/**
 * Valida la configuración de PayPal
 */
function validateConfig(config) {
  const required = ['clientId', 'clientSecret', 'merchantId'];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Configuración de PayPal incompleta. Faltan: ${missing.join(', ')}`);
  }

  return true;
}

/**
 * Obtiene las credenciales de autenticación
 */
function getAuthCredentials() {
  const config = getConfig();
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
  };
}

// ========================================
// EXPORTACIONES
// ========================================
module.exports = {
  paypalConfig,
  getConfig,
  validateConfig,
  getAuthCredentials,
};

// ========================================
// INSTRUCCIONES DE USO
// ========================================
/*
1. Copia este archivo como paypal-config.js
2. Reemplaza todos los valores de ejemplo con tus credenciales reales
3. Configura las URLs según tu dominio
4. Ajusta la configuración según tus necesidades
5. Importa el archivo en tu aplicación:
   const { getConfig, validateConfig } = require('./paypal-config');
   
6. Valida la configuración antes de usar:
   const config = getConfig();
   validateConfig(config);
*/
