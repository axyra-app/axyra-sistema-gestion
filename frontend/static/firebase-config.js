/**
 * AXYRA Firebase Configuration
 * Configuración para Firebase Authentication y Firestore
 * Versión: 1.0
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

// Inicializar Firebase
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
