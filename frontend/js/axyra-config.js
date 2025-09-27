// ========================================
// CONFIGURACIÓN PRINCIPAL AXYRA
// Sistema de gestión empresarial
// ========================================

// Función para obtener la configuración
window.getAxyraConfig = function() {
  return window.AXYRA_CONFIG;
};

window.AXYRA_CONFIG = {
  // Configuración de Firebase
  firebase: {
    apiKey: window.ENV?.VITE_FIREBASE_API_KEY || 'AIzaSyAW3ejokcsWAP5G1yJT63jLBpFmdTiTUwc',
    authDomain: window.ENV?.VITE_FIREBASE_AUTH_DOMAIN || 'axyra-48238.firebaseapp.com',
    projectId: window.ENV?.VITE_FIREBASE_PROJECT_ID || 'axyra-48238',
    storageBucket: window.ENV?.VITE_FIREBASE_STORAGE_BUCKET || 'axyra-48238.firebasestorage.app',
    messagingSenderId: window.ENV?.VITE_FIREBASE_MESSAGING_SENDER_ID || '796334517286',
    appId: window.ENV?.VITE_FIREBASE_APP_ID || '1:796334517286:web:95947cf0f773dc11378ae7',
    measurementId: window.ENV?.VITE_FIREBASE_MEASUREMENT_ID || 'G-R8W2MP15B7',
  },

  // Configuración de la empresa
  company: {
    name: 'Villa Venecia',
    nit: '900.000.000-1',
    address: 'Calle Principal #123',
    phone: '(57)300-123-4567',
    email: 'info@villavenecia.com',
    logo: 'logo.png',
  },

  // Configuración del sistema
  system: {
    version: '1.0.0',
    environment: 'production',
    debug: false,
    autoSave: true,
    sessionTimeout: 30, // minutos
    maxLoginAttempts: 5,
  },

  // Configuración de seguridad
  security: {
    twoFactorEnabled: false,
    backupFrequency: 'daily',
    notificationsFrequency: 10, // minutos
    sessionTimeout: 30, // minutos
  },

  // Configuración de membresías
  memberships: {
    free: {
      name: 'Gratuito',
      price: 0,
      features: ['Hasta 5 empleados', 'Reportes básicos', 'Soporte por email'],
    },
    basic: {
      name: 'Básico',
      price: 49900,
      features: ['Hasta 10 empleados', 'Reportes avanzados', 'Soporte prioritario', 'Dashboard completo'],
    },
    professional: {
      name: 'Profesional',
      price: 129900,
      features: [
        'Hasta 50 empleados',
        'Reportes ejecutivos',
        'Soporte 24/7',
        'Dashboard avanzado',
        'Inventario completo',
      ],
    },
    enterprise: {
      name: 'Empresarial',
      price: 259900,
      features: [
        'Empleados ilimitados',
        'Reportes personalizados',
        'Soporte dedicado',
        'Dashboard personalizado',
        'API completa',
      ],
    },
  },

  // Configuración de nómina colombiana
  payroll: {
    salarioMinimo: 1300000,
    porcentajeCesantias: 8.33,
    porcentajePrima: 8.33,
    porcentajeInteresesCesantias: 12,
    porcentajeSalud: 4,
    porcentajePension: 4,
    porcentajeARL: 0.522,
    porcentajeCajaCompensacion: 4,
    porcentajeICBF: 3,
    porcentajeSENA: 2,
  },

  // Configuración de notificaciones
  notifications: {
    email: true,
    push: true,
    sms: false,
    whatsapp: false,
    frequency: 'INMEDIATA',
    schedule: {
      start: '08:00',
      end: '18:00',
    },
  },

  // Configuración de integraciones
  integrations: {
    // Google Workspace
    googleWorkspace: {
      clientId: window.ENV?.VITE_GOOGLE_CLIENT_ID || '',
      clientSecret: window.ENV?.VITE_GOOGLE_CLIENT_SECRET || '',
      redirectUri: window.ENV?.VITE_GOOGLE_REDIRECT_URI || window.location.origin + '/auth/google/callback',
      enabled: true,
      scopes: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/calendar.readonly',
        'https://www.googleapis.com/auth/calendar.events',
      ],
    },

    // Microsoft 365
    microsoft365: {
      clientId: window.ENV?.VITE_MICROSOFT_CLIENT_ID || '',
      clientSecret: window.ENV?.VITE_MICROSOFT_CLIENT_SECRET || '',
      tenantId: window.ENV?.VITE_MICROSOFT_TENANT_ID || 'common',
      redirectUri: window.ENV?.VITE_MICROSOFT_REDIRECT_URI || window.location.origin + '/auth/microsoft/callback',
      enabled: true,
      scopes: [
        'https://graph.microsoft.com/Mail.Read',
        'https://graph.microsoft.com/Mail.Send',
        'https://graph.microsoft.com/Files.ReadWrite',
        'https://graph.microsoft.com/Calendars.ReadWrite',
        'https://graph.microsoft.com/Team.ReadBasic.All',
        'https://graph.microsoft.com/User.Read',
      ],
    },

    // Pagos
    payments: {
      wompi: {
        publicKey: process.env.VITE_WOMPI_PUBLIC_KEY || '',
        privateKey: process.env.VITE_WOMPI_PRIVATE_KEY || '',
        environment: process.env.VITE_WOMPI_ENVIRONMENT || 'sandbox',
        enabled: true,
      },
      paypal: {
        clientId: process.env.VITE_PAYPAL_CLIENT_ID || '',
        clientSecret: process.env.VITE_PAYPAL_CLIENT_SECRET || '',
        environment: process.env.VITE_PAYPAL_ENVIRONMENT || 'sandbox',
        enabled: true,
      },
      stripe: {
        publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
        secretKey: process.env.VITE_STRIPE_SECRET_KEY || '',
        enabled: true,
      },
    },

    // Email
    email: {
      smtp: {
        host: process.env.VITE_SMTP_HOST || '',
        port: process.env.VITE_SMTP_PORT || 587,
        secure: process.env.VITE_SMTP_SECURE === 'true',
        user: process.env.VITE_SMTP_USER || '',
        password: process.env.VITE_SMTP_PASSWORD || '',
        enabled: true,
      },
      sendgrid: {
        apiKey: process.env.VITE_SENDGRID_API_KEY || '',
        enabled: false,
      },
      mailgun: {
        apiKey: process.env.VITE_MAILGUN_API_KEY || '',
        domain: process.env.VITE_MAILGUN_DOMAIN || '',
        enabled: false,
      },
      awsSes: {
        accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
        region: process.env.VITE_AWS_REGION || 'us-east-1',
        enabled: false,
      },
    },

    // SMS
    sms: {
      twilio: {
        accountSid: process.env.VITE_TWILIO_ACCOUNT_SID || '',
        authToken: process.env.VITE_TWILIO_AUTH_TOKEN || '',
        phoneNumber: process.env.VITE_TWILIO_PHONE_NUMBER || '',
        enabled: false,
      },
      awsSns: {
        accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
        region: process.env.VITE_AWS_REGION || 'us-east-1',
        enabled: false,
      },
      sendgrid: {
        apiKey: process.env.VITE_SENDGRID_API_KEY || '',
        enabled: false,
      },
    },

    // Cloud Storage
    cloudStorage: {
      awsS3: {
        accessKeyId: process.env.VITE_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.VITE_AWS_SECRET_ACCESS_KEY || '',
        region: process.env.VITE_AWS_REGION || 'us-east-1',
        bucket: process.env.VITE_AWS_S3_BUCKET || '',
        enabled: false,
      },
      googleCloud: {
        projectId: process.env.VITE_GOOGLE_CLOUD_PROJECT_ID || '',
        keyFilename: process.env.VITE_GOOGLE_CLOUD_KEY_FILE || '',
        bucket: process.env.VITE_GOOGLE_CLOUD_BUCKET || '',
        enabled: false,
      },
      azure: {
        accountName: process.env.VITE_AZURE_ACCOUNT_NAME || '',
        accountKey: process.env.VITE_AZURE_ACCOUNT_KEY || '',
        containerName: process.env.VITE_AZURE_CONTAINER_NAME || '',
        enabled: false,
      },
      dropbox: {
        accessToken: process.env.VITE_DROPBOX_ACCESS_TOKEN || '',
        enabled: false,
      },
    },
  },
};

// Función para obtener configuración
window.getAxyraConfig = function (key) {
  const keys = key.split('.');
  let value = window.AXYRA_CONFIG;

  for (const k of keys) {
    value = value[k];
    if (value === undefined) return null;
  }

  return value;
};

// Función para actualizar configuración
window.updateAxyraConfig = function (key, value) {
  const keys = key.split('.');
  let config = window.AXYRA_CONFIG;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!config[keys[i]]) config[keys[i]] = {};
    config = config[keys[i]];
  }

  config[keys[keys.length - 1]] = value;

  // Guardar en localStorage
  localStorage.setItem('axyra_config', JSON.stringify(window.AXYRA_CONFIG));
};

// Cargar configuración desde localStorage
document.addEventListener('DOMContentLoaded', function () {
  const savedConfig = localStorage.getItem('axyra_config');
  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig);
      window.AXYRA_CONFIG = { ...window.AXYRA_CONFIG, ...parsedConfig };
    } catch (error) {
      console.error('Error cargando configuración:', error);
    }
  }
});

console.log('✅ Configuración AXYRA cargada correctamente');
