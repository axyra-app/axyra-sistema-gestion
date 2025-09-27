// ========================================
// CONFIGURACIÓN FIREBASE SIMPLE
// Sin dependencias de process.env
// ========================================

// Configuración directa de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAW3ejokcsWAP5G1yJT63jLBpFmdTiTUwc",
  authDomain: "axyra-48238.firebaseapp.com",
  projectId: "axyra-48238",
  storageBucket: "axyra-48238.firebasestorage.app",
  messagingSenderId: "796334517286",
  appId: "1:796334517286:web:95947cf0f773dc11378ae7",
  measurementId: "G-R8W2MP15B7"
};

// Función para obtener la configuración
window.getFirebaseConfig = function() {
  return firebaseConfig;
};

// Función para obtener la configuración AXYRA
window.getAxyraConfig = function() {
  return {
    firebase: firebaseConfig,
    company: {
      name: 'AXYRA Sistema de Gestión',
      version: '2.0.0',
      description: 'Sistema integral de gestión empresarial',
      url: 'https://axyra.vercel.app'
    },
    security: {
      sessionTimeout: 3600000,
      maxLoginAttempts: 5,
      lockoutTime: 900000,
      passwordMinLength: 6,
      requireEmailVerification: false
    },
    notifications: {
      enabled: true,
      types: ['success', 'error', 'warning', 'info'],
      autoHide: true,
      duration: 5000,
      position: 'top-right'
    },
    app: {
      theme: 'light',
      language: 'es',
      timezone: 'America/Bogota',
      currency: 'COP',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h'
    }
  };
};

console.log('🔥 Firebase Simple configurado correctamente');
