// ========================================
// CONFIGURACIÓN FIREBASE PRODUCCIÓN AXYRA
// ========================================

console.log('🔥 Inicializando Firebase para producción...');

// Configuración de Firebase para producción
const firebaseConfig = {
  apiKey: 'AIzaSyAW3ejokcsWAP5G1yJT63jLBpFmdTiTUwc',
  authDomain: 'axyra-48238.firebaseapp.com',
  projectId: 'axyra-48238',
  storageBucket: 'axyra-48238.firebasestorage.app',
  messagingSenderId: '796334517286',
  appId: '1:796334517286:web:95947cf0f773dc11378ae7',
  measurementId: 'G-R8W2MP15B7',
};

// Función para obtener configuración segura
function getFirebaseConfig() {
  // En producción, usar configuración estática
  return firebaseConfig;
}

// Exportar configuración
window.firebaseConfig = getFirebaseConfig();

console.log('✅ Firebase configurado para producción');
