// ========================================
// CONFIGURACIÓN PAYPAL SANDBOX - AXYRA
// ========================================
// Configuración específica para entorno de pruebas

const paypalSandboxConfig = {
  // ========================================
  // CREDENCIALES DE SANDBOX
  // ========================================
  clientId: 'AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw', // Mismo Client ID para sandbox y live
  clientSecret: 'EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj',

  // Credenciales específicas de sandbox
  sandbox: {
    username: 'sb-iibki46281699@business.example.com',
    password: 'N:oX7d3)',
    environment: 'sandbox',
    baseUrl: 'https://api.sandbox.paypal.com',
  },

  // ========================================
  // CONFIGURACIÓN DE PAGOS SANDBOX
  // ========================================
  currency: 'COP',
  locale: 'es_CO',
  intent: 'capture',

  // ========================================
  // EXPERIENCIA DE USUARIO
  // ========================================
  experience: {
    brandName: 'AXYRA Sistema de Gestión (Sandbox)',
    logoUrl: 'https://axyra-sistema-gestion.vercel.app/logo.png',
    locale: 'es_CO',
    colorScheme: 'blue',
    buttonShape: 'rect',
    buttonSize: 'large',
    buttonLabel: 'paypal',
  },

  // ========================================
  // URLs DE CALLBACK SANDBOX
  // ========================================
  returnUrl: 'https://axyra-sistema-gestion.vercel.app/payment/success',
  cancelUrl: 'https://axyra-sistema-gestion.vercel.app/payment/cancel',
  webhookUrl: 'https://axyra-sistema-gestion.vercel.app/api/paypal/webhook',

  // ========================================
  // CONFIGURACIÓN DE TESTING
  // ========================================
  testing: {
    enabled: true,
    mockPayments: false,
    debugMode: true,
    verboseLogging: true,
    testCards: {
      visa: '4111111111111111',
      mastercard: '5555555555554444',
      amex: '378282246310005',
    },
  },

  // ========================================
  // DATOS DE PRUEBA
  // ========================================
  testAccounts: {
    buyer: {
      email: 'sb-buyer@personal.example.com',
      password: 'password123',
    },
    business: {
      email: 'sb-iibki46281699@business.example.com',
      password: 'N:oX7d3)',
    },
  },
};

// ========================================
// FUNCIONES DE UTILIDAD SANDBOX
// ========================================

/**
 * Obtiene la configuración de sandbox
 */
function getSandboxConfig() {
  return {
    ...paypalSandboxConfig,
    ...paypalSandboxConfig.sandbox,
  };
}

/**
 * Valida la configuración de sandbox
 */
function validateSandboxConfig() {
  const config = getSandboxConfig();
  const required = ['clientId', 'clientSecret', 'username', 'password'];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Configuración de sandbox incompleta. Faltan: ${missing.join(', ')}`);
  }

  return true;
}

/**
 * Obtiene las credenciales de autenticación para sandbox
 */
function getSandboxAuthCredentials() {
  const config = getSandboxConfig();
  return {
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    username: config.username,
    password: config.password,
  };
}

// ========================================
// EXPORTACIONES
// ========================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    paypalSandboxConfig,
    getSandboxConfig,
    validateSandboxConfig,
    getSandboxAuthCredentials,
  };
}

// ========================================
// INSTRUCCIONES DE USO SANDBOX
// ========================================
/*
1. Usa este archivo para configurar el entorno de pruebas
2. Las credenciales están configuradas para sandbox
3. Para cambiar a producción, usa paypal-config.js
4. Prueba con las cuentas de test proporcionadas
5. Los pagos en sandbox no son reales
*/
