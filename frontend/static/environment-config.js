/**
 * AXYRA Environment Configuration
 * Configuración centralizada del entorno y credenciales
 * Versión: 1.0
 */

const AXYRA_ENV = {
  // Firebase Configuration
  FIREBASE: {
    API_KEY: 'AIzaSyDZIgISusap5LecwLzdXR9AhqjH3QiASSY',
    AUTH_DOMAIN: 'axyra-32d95.firebaseapp.com',
    PROJECT_ID: 'axyra-32d95',
    STORAGE_BUCKET: 'axyra-32d95.firebasestorage.app',
    MESSAGING_SENDER_ID: '105198865804',
    APP_ID: '1:105198865804:web:2656885e240ad6a4bedaa9',
    MEASUREMENT_ID: 'G-Y6H4Y6QX1G'
  },

  // Google OAuth Configuration
  GOOGLE_OAUTH: {
    CLIENT_ID: '105198865804-2q8q8q8q8q8q8q8q8q8q8q8q8q8q8q8q.apps.googleusercontent.com',
    API_KEY: 'AIzaSyDZIgISusap5LecwLzdXR9AhqjH3QiASSY',
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/oauth2/v2/rest'],
    SCOPE: 'email profile'
  },

  // App Configuration
  APP: {
    NAME: 'AXYRA',
    VERSION: '3.0.0',
    ENVIRONMENT: 'production',
    DEBUG_MODE: false,
    SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 horas en milisegundos
    MAX_RETRY_ATTEMPTS: 3
  },

  // API Configuration
  API: {
    BASE_URL: 'https://axyra-32d95.firebaseapp.com',
    TIMEOUT: 30000,
    RETRY_ATTEMPTS: 3
  }
};

// Validar configuración
function validateEnvironmentConfig() {
  const errors = [];

  // Validar Firebase
  Object.entries(AXYRA_ENV.FIREBASE).forEach(([key, value]) => {
    if (!value || value === 'TU_' + key) {
      errors.push(`Firebase ${key} no configurado`);
    }
  });

  // Validar Google OAuth
  Object.entries(AXYRA_ENV.GOOGLE_OAUTH).forEach(([key, value]) => {
    if (!value || value === 'TU_' + key) {
      errors.push(`Google OAuth ${key} no configurado`);
    }
  });

  if (errors.length > 0) {
    console.error('❌ Errores de configuración encontrados:');
    errors.forEach(error => console.error(`  - ${error}`));
    return false;
  }

  console.log('✅ Configuración del entorno válida');
  return true;
}

// Función para obtener configuración
function getConfig(section, key = null) {
  if (key) {
    return AXYRA_ENV[section]?.[key];
  }
  return AXYRA_ENV[section];
}

// Función para verificar si estamos en desarrollo
function isDevelopment() {
  return AXYRA_ENV.APP.ENVIRONMENT === 'development';
}

// Función para verificar si estamos en producción
function isProduction() {
  return AXYRA_ENV.APP.ENVIRONMENT === 'production';
}

// Función para obtener información del entorno
function getEnvironmentInfo() {
  return {
    app: AXYRA_ENV.APP.NAME,
    version: AXYRA_ENV.APP.VERSION,
    environment: AXYRA_ENV.APP.ENVIRONMENT,
    debug: AXYRA_ENV.APP.DEBUG_MODE,
    firebase: {
      projectId: AXYRA_ENV.FIREBASE.PROJECT_ID,
      authDomain: AXYRA_ENV.FIREBASE.AUTH_DOMAIN
    },
    google: {
      clientIdConfigured: !!AXYRA_ENV.GOOGLE_OAUTH.CLIENT_ID,
      apiKeyConfigured: !!AXYRA_ENV.GOOGLE_OAUTH.API_KEY
    }
  };
}

// Exportar configuración
window.AXYRA_ENV = AXYRA_ENV;
window.getConfig = getConfig;
window.isDevelopment = isDevelopment;
window.isProduction = isProduction;
window.getEnvironmentInfo = getEnvironmentInfo;
window.validateEnvironmentConfig = validateEnvironmentConfig;

// Validar configuración al cargar
if (validateEnvironmentConfig()) {
  console.log('🚀 AXYRA Environment configurado correctamente');
  console.log('📊 Información del entorno:', getEnvironmentInfo());
} else {
  console.error('❌ AXYRA Environment no configurado correctamente');
}
