/**
 * Configuración de Firebase para Producción
 * AXYRA Sistema de Gestión
 */

class FirebaseConfigProduction {
  constructor() {
    this.config = {
      apiKey: "AIzaSyAW3ejokcsWAP5G1yJT63jLBpFmdTiTUwc",
      authDomain: "axyra-48238.firebaseapp.com",
      projectId: "axyra-48238",
      storageBucket: "axyra-48238.firebasestorage.app",
      messagingSenderId: "796334517286",
      appId: "1:796334517286:web:95947cf0f773dc11378ae7",
      measurementId: "G-R8W2MP15B7"
    };
    
    this.isInitialized = false;
    this.firebase = null;
    this.auth = null;
    this.firestore = null;
  }

  async initialize() {
    try {
      console.log('🔥 Inicializando Firebase para producción...');
      
      // Verificar si Firebase ya está cargado
      if (typeof firebase !== 'undefined') {
        this.firebase = firebase;
        this.auth = firebase.auth();
        this.firestore = firebase.firestore();
        
        // Inicializar Firebase
        if (!firebase.apps.length) {
          firebase.initializeApp(this.config);
        }
        
        this.isInitialized = true;
        console.log('✅ Firebase inicializado correctamente para producción');
        return true;
      } else {
        console.warn('⚠️ Firebase SDK no está disponible, usando modo offline');
        return false;
      }
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      return false;
    }
  }

  getFirebase() {
    return this.firebase;
  }

  getAuth() {
    return this.auth;
  }

  getFirestore() {
    return this.firestore;
  }

  isReady() {
    return this.isInitialized;
  }
}

// Crear instancia global
window.firebaseConfigProduction = new FirebaseConfigProduction();

// Inicializar automáticamente
document.addEventListener('DOMContentLoaded', async () => {
  await window.firebaseConfigProduction.initialize();
});

console.log('🔥 Firebase Config Production cargado');
