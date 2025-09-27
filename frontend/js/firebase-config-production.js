/**
 * Configuración de Firebase para Producción
 * AXYRA Sistema de Gestión
 */

class FirebaseConfigProduction {
  constructor() {
    this.config = {
      apiKey: "AIzaSyBvQKjJ8X9Y2Z3A4B5C6D7E8F9G0H1I2J3K",
      authDomain: "axyra-sistema-gestion.firebaseapp.com",
      projectId: "axyra-sistema-gestion",
      storageBucket: "axyra-sistema-gestion.appspot.com",
      messagingSenderId: "123456789012",
      appId: "1:123456789012:web:abcdef1234567890abcdef",
      measurementId: "G-ABCDEF1234"
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
