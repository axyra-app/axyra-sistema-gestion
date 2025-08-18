/**
 * AXYRA Firebase Configuration
 * Configuración para Firebase Authentication y Firestore
 * Versión: 2.0 - Con validación de configuración
 */

// Configuración de Firebase (reemplaza con tu configuración real)
const firebaseConfig = {
  apiKey: 'AIzaSyDZIgISusap5LecwLzdXR9AhqjH3QiASSY',
  authDomain: 'axyra-32d95.firebaseapp.com',
  projectId: 'axyra-32d95',
  storageBucket: 'axyra-32d95.firebasestorage.app',
  messagingSenderId: '105198865804',
  appId: '1:105198865804:web:2656885e240ad6a4bedaa9',
  measurementId: 'G-Y6H4Y6QX1G',
};

// Validar configuración
function validateFirebaseConfig() {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingFields = requiredFields.filter(field => !firebaseConfig[field]);
  
  if (missingFields.length > 0) {
    console.error('❌ Configuración de Firebase incompleta. Campos faltantes:', missingFields);
    return false;
  }
  
  if (firebaseConfig.apiKey === 'TU_API_KEY' || firebaseConfig.projectId === 'TU_PROJECT_ID') {
    console.error('❌ Configuración de Firebase no personalizada. Usa credenciales reales.');
    return false;
  }
  
  console.log('✅ Configuración de Firebase válida');
  return true;
}

// Inicializar Firebase
if (validateFirebaseConfig()) {
  try {
    firebase.initializeApp(firebaseConfig);
    
    // Inicializar servicios
    const auth = firebase.auth();
    const db = firebase.firestore();
    
    // Configuración de Firestore
    const firestoreSettings = {
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    };
    
    db.settings(firestoreSettings);
    
    // Exportar para uso en otros módulos
    window.axyraFirebase = {
      auth: auth,
      db: db,
      firebase: firebase,
    };
    
    console.log('✅ Firebase inicializado correctamente');
    console.log('🔐 Auth disponible:', auth);
    console.log('🗄️ Firestore disponible:', db);
    console.log('📊 Proyecto:', firebaseConfig.projectId);
    console.log('🌐 Dominio:', firebaseConfig.authDomain);
    
  } catch (error) {
    console.error('❌ Error inicializando Firebase:', error);
  }
} else {
  console.error('❌ Firebase no se inicializó debido a configuración inválida');
}
