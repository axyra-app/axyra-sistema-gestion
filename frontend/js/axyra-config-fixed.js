// ========================================
// AXYRA CONFIGURACIÓN - VERSIÓN CORREGIDA
// ========================================

class AxyraConfig {
  constructor() {
    this.config = {
      // Configuración de Firebase
      firebase: {
        apiKey: 'AIzaSyAW3ejokcsWAP5G1yJT63jLBpFmdTiTUwc',
        authDomain: 'axyra-48238.firebaseapp.com',
        projectId: 'axyra-48238',
        storageBucket: 'axyra-48238.firebasestorage.app',
        messagingSenderId: '796334517286',
        appId: '1:796334517286:web:95947cf0f773dc11378ae7',
        measurementId: 'G-R8W2MP15B7'
      },

      // Configuración de la empresa
      company: {
        name: 'AXYRA Sistema de Gestión',
        version: '2.0.0',
        description: 'Sistema integral de gestión empresarial',
        url: 'https://axyra.vercel.app',
        logo: '/assets/logo.png',
        timezone: 'America/Bogota',
        locale: 'es_CO',
        currency: 'COP'
      },

      // Configuración de seguridad
      security: {
        encryptionKey: '0b8ff81aefce1985a7f8b41499905fd311a35b530c0b839aadbec5a4e9171995',
        jwtSecret: '0b8ff81aefce1985a7f8b41499905fd311a35b530c0b839aadbec5a4e9171995',
        sessionTimeout: 30 * 60 * 1000, // 30 minutos
        maxLoginAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutos
        passwordMinLength: 8,
        requireSpecialChars: true,
        requireNumbers: true,
        requireUppercase: true
      },

      // Planes de membresía
      membershipPlans: {
        free: {
          name: 'Gratuito',
          price: 0,
          maxEmployees: 5,
          maxHours: 100,
          features: ['Gestión básica', 'Reportes simples']
        },
        basic: {
          name: 'Básico',
          price: 50000,
          maxEmployees: 25,
          maxHours: 1000,
          features: ['Gestión completa', 'Reportes avanzados', 'Soporte por email']
        },
        premium: {
          name: 'Premium',
          price: 100000,
          maxEmployees: 100,
          maxHours: 5000,
          features: ['Gestión completa', 'Reportes avanzados', 'Soporte prioritario', 'Integraciones']
        },
        enterprise: {
          name: 'Empresarial',
          price: 200000,
          maxEmployees: -1, // Ilimitado
          maxHours: -1, // Ilimitado
          features: ['Gestión completa', 'Reportes avanzados', 'Soporte 24/7', 'Todas las integraciones', 'Personalización']
        }
      },

      // Cálculos de nómina colombiana
      colombianPayroll: {
        smlv: 1160000, // Salario mínimo legal vigente 2024
        uvt: 42505, // Unidad de Valor Tributario 2024
        healthPercentage: 0.04, // 4% salud
        pensionPercentage: 0.04, // 4% pensión
        solidarityPercentage: 0.01, // 1% solidaridad
        icbfPercentage: 0.003, // 0.3% ICBF
        senaPercentage: 0.02, // 2% SENA
        parafiscalesPercentage: 0.053, // 5.3% parafiscales
        cesantiasPercentage: 0.0833, // 8.33% cesantías
        primasPercentage: 0.0833, // 8.33% prima de servicios
        vacacionesPercentage: 0.0417, // 4.17% vacaciones
        horasExtrasDiurnasMultiplier: 1.25, // 25% recargo
        horasExtrasNocturnasMultiplier: 1.75, // 75% recargo
        horasExtrasDominicalesMultiplier: 1.75, // 75% recargo
        horasExtrasNocturnasDominicalesMultiplier: 2.0 // 100% recargo
      },

      // Configuración de notificaciones
      notifications: {
        enabled: true,
        types: {
          success: { duration: 3000, sound: true },
          error: { duration: 5000, sound: true },
          warning: { duration: 4000, sound: false },
          info: { duration: 3000, sound: false }
        },
        position: 'top-right',
        maxVisible: 5,
        autoHide: true
      },

      // Configuración de integraciones
      integrations: {
        // Google Workspace
        googleWorkspace: {
          clientId: '',
          clientSecret: '',
          redirectUri: window.location.origin + '/auth/google/callback',
          enabled: false,
          scopes: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/calendar.readonly',
            'https://www.googleapis.com/auth/calendar.events',
          ]
        },

        // Microsoft 365
        microsoft365: {
          clientId: '',
          clientSecret: '',
          tenantId: 'common',
          redirectUri: window.location.origin + '/auth/microsoft/callback',
          enabled: false,
          scopes: [
            'https://graph.microsoft.com/Mail.Read',
            'https://graph.microsoft.com/Mail.Send',
            'https://graph.microsoft.com/Files.ReadWrite',
            'https://graph.microsoft.com/Calendars.ReadWrite',
            'https://graph.microsoft.com/Team.ReadBasic.All',
            'https://graph.microsoft.com/User.Read',
          ]
        },

        // Pagos
        payments: {
          wompi: {
            publicKey: '',
            privateKey: '',
            merchantId: '',
            environment: 'sandbox',
            currency: 'COP',
            country: 'CO'
          },
          paypal: {
            clientId: '',
            clientSecret: '',
            environment: 'sandbox',
            currency: 'USD'
          },
          stripe: {
            publishableKey: '',
            secretKey: '',
            environment: 'test',
            currency: 'usd'
          }
        },

        // Email
        email: {
          emailjs: {
            serviceId: '',
            templateId: '',
            publicKey: '',
            userId: ''
          },
          smtp: {
            host: '',
            port: 587,
            secure: false,
            username: '',
            password: ''
          },
          sendgrid: {
            apiKey: '',
            fromEmail: '',
            fromName: 'AXYRA'
          }
        },

        // SMS
        sms: {
          twilio: {
            accountSid: '',
            authToken: '',
            phoneNumber: ''
          },
          aws: {
            accessKeyId: '',
            secretAccessKey: '',
            region: 'us-east-1'
          }
        },

        // Almacenamiento en la nube
        cloudStorage: {
          aws: {
            accessKeyId: '',
            secretAccessKey: '',
            region: 'us-east-2',
            bucketName: ''
          },
          google: {
            projectId: '',
            keyFilename: '',
            bucketName: ''
          },
          azure: {
            accountName: '',
            accountKey: '',
            containerName: ''
          }
        }
      },

      // Configuración de API
      api: {
        baseUrl: '/api',
        timeout: 30000,
        retries: 3,
        rateLimit: {
          windowMs: 15 * 60 * 1000, // 15 minutos
          max: 100 // máximo 100 requests por ventana
        }
      },

      // Configuración de caché
      cache: {
        enabled: true,
        ttl: 5 * 60 * 1000, // 5 minutos
        maxSize: 100,
        strategy: 'lru'
      },

      // Configuración de logs
      logging: {
        level: 'info',
        console: true,
        remote: false,
        maxEntries: 1000
      }
    };

    this.loadSavedConfig();
  }

  // Cargar configuración guardada
  loadSavedConfig() {
    try {
      const savedConfig = localStorage.getItem('axyra_config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        this.config = { ...this.config, ...parsed };
      }
    } catch (error) {
      console.warn('Error cargando configuración guardada:', error);
    }
  }

  // Guardar configuración
  saveConfig() {
    try {
      localStorage.setItem('axyra_config', JSON.stringify(this.config));
    } catch (error) {
      console.error('Error guardando configuración:', error);
    }
  }

  // Obtener configuración
  getAxyraConfig() {
    return this.config;
  }

  // Actualizar configuración
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.saveConfig();
  }

  // Obtener configuración de Firebase
  getFirebaseConfig() {
    return this.config.firebase;
  }

  // Obtener configuración de la empresa
  getCompanyConfig() {
    return this.config.company;
  }

  // Obtener configuración de seguridad
  getSecurityConfig() {
    return this.config.security;
  }

  // Obtener planes de membresía
  getMembershipPlans() {
    return this.config.membershipPlans;
  }

  // Obtener configuración de nómina colombiana
  getColombianPayrollConfig() {
    return this.config.colombianPayroll;
  }

  // Obtener configuración de notificaciones
  getNotificationsConfig() {
    return this.config.notifications;
  }

  // Obtener configuración de integraciones
  getIntegrationsConfig() {
    return this.config.integrations;
  }

  // Obtener configuración de API
  getApiConfig() {
    return this.config.api;
  }

  // Obtener configuración de caché
  getCacheConfig() {
    return this.config.cache;
  }

  // Obtener configuración de logs
  getLoggingConfig() {
    return this.config.logging;
  }

  // Verificar si una integración está habilitada
  isIntegrationEnabled(integrationName) {
    const integration = this.config.integrations[integrationName];
    return integration && integration.enabled;
  }

  // Habilitar/deshabilitar integración
  setIntegrationEnabled(integrationName, enabled) {
    if (this.config.integrations[integrationName]) {
      this.config.integrations[integrationName].enabled = enabled;
      this.saveConfig();
    }
  }

  // Obtener configuración de una integración específica
  getIntegrationConfig(integrationName) {
    return this.config.integrations[integrationName] || null;
  }

  // Actualizar configuración de integración
  updateIntegrationConfig(integrationName, config) {
    if (this.config.integrations[integrationName]) {
      this.config.integrations[integrationName] = { ...this.config.integrations[integrationName], ...config };
      this.saveConfig();
    }
  }

  // Resetear configuración a valores por defecto
  resetToDefaults() {
    this.config = new AxyraConfig().config;
    this.saveConfig();
  }

  // Exportar configuración
  exportConfig() {
    return JSON.stringify(this.config, null, 2);
  }

  // Importar configuración
  importConfig(configJson) {
    try {
      const importedConfig = JSON.parse(configJson);
      this.config = { ...this.config, ...importedConfig };
      this.saveConfig();
      return true;
    } catch (error) {
      console.error('Error importando configuración:', error);
      return false;
    }
  }
}

// Crear instancia global
window.axyraConfig = new AxyraConfig();

// Inicializar configuración
document.addEventListener('DOMContentLoaded', () => {
  console.log('🔧 AXYRA Config cargado correctamente');
});

console.log('🔧 AXYRA Config inicializado');
