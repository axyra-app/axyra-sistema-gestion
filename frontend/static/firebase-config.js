// ========================================
// CONFIGURACIÓN DE FIREBASE AXYRA
// ========================================

// Configuración de Firebase para AXYRA
const firebaseConfig = {
  // 🔑 API Key de Firebase - REEMPLAZAR CON TU CONFIGURACIÓN REAL
  apiKey: "AIzaSyDZIgISusap5LecwLzdXR9AhqjH3QiASSY",
  
  // 🌐 Dominio de autenticación
  authDomain: "axyra-32d95.firebaseapp.com",
  
  // 📁 ID del proyecto
  projectId: "axyra-32d95",
  
  // 🗄️ Bucket de almacenamiento
  storageBucket: "axyra-32d95.firebasestorage.app",
  
  // 📱 ID del remitente de mensajes
  messagingSenderId: "105198865804",
  
  // 🆔 ID de la aplicación
  appId: "1:105198865804:web:2656885e240ad6a4bedaa9",
  
  // 📊 ID de medición (opcional)
  measurementId: "G-Y6H4Y6QX1G"
};

// Inicializar Firebase cuando el SDK esté disponible
function initializeFirebase() {
  if (typeof firebase !== 'undefined') {
    try {
      // Verificar si ya está inicializado
      if (firebase.apps.length === 0) {
        firebase.initializeApp(firebaseConfig);
        console.log('🔥 Firebase AXYRA inicializado correctamente');
      } else {
        console.log('🔥 Firebase ya estaba inicializado');
      }
      
      // Inicializar servicios
      const firebaseAuth = firebase.auth();
      const firebaseFirestore = firebase.firestore();
      
      // Configurar Firestore
      firebaseFirestore.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      });
      
      // Exportar para uso global
      window.axyraFirebase = {
        auth: firebaseAuth,
        firestore: firebaseFirestore,
        config: firebaseConfig
      };
      
      console.log('✅ Servicios de Firebase disponibles');
      return true;
      
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      return false;
    }
  } else {
    console.error('❌ Firebase SDK no está disponible');
    return false;
  }
}

// Intentar inicializar inmediatamente
let firebaseInitialized = initializeFirebase();

// Si no se pudo inicializar, intentar cuando esté disponible
if (!firebaseInitialized) {
  // Esperar a que Firebase se cargue
  const checkFirebase = setInterval(() => {
    if (typeof firebase !== 'undefined') {
      firebaseInitialized = initializeFirebase();
      if (firebaseInitialized) {
        clearInterval(checkFirebase);
        console.log('🔥 Firebase inicializado después de esperar');
      }
    }
  }, 100);
}

// ========================================
// FUNCIONES DE AUTENTICACIÓN FIREBASE
// ========================================

// Función para verificar si Firebase está disponible
function isFirebaseAvailable() {
  return typeof firebase !== 'undefined' && firebase.auth && window.axyraFirebase;
}

// Función para obtener el usuario actual de Firebase
function getCurrentFirebaseUser() {
  if (isFirebaseAvailable()) {
    return firebase.auth().currentUser;
  }
  return null;
}

// Función para verificar si hay un usuario autenticado
function isFirebaseUserAuthenticated() {
  const user = getCurrentFirebaseUser();
  return user !== null;
}

// Función para hacer logout de Firebase
async function firebaseLogout() {
  if (isFirebaseAvailable()) {
    try {
      await firebase.auth().signOut();
      console.log('✅ Logout de Firebase exitoso');
      
      // Limpiar localStorage
      localStorage.removeItem('axyra_firebase_user');
      localStorage.removeItem('axyra_isolated_user');
      
      return true;
    } catch (error) {
      console.error('❌ Error en logout de Firebase:', error);
      return false;
    }
  }
  return false;
}

// Función para obtener información del usuario
function getFirebaseUserInfo() {
  const user = getCurrentFirebaseUser();
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      providerData: user.providerData
    };
  }
  return null;
}

// Función para crear usuario en Firestore
async function createFirebaseUser(userData) {
  if (isFirebaseAvailable() && userData) {
    try {
      await window.axyraFirebase.firestore
        .collection('users')
        .doc(userData.uid)
        .set(userData, { merge: true });
      
      console.log('✅ Usuario creado en Firestore:', userData.email);
      return true;
    } catch (error) {
      console.error('❌ Error creando usuario en Firestore:', error);
      return false;
    }
  }
  return false;
}

// Exportar funciones para uso global
window.axyraFirebaseUtils = {
  isAvailable: isFirebaseAvailable,
  getCurrentUser: getCurrentFirebaseUser,
  isAuthenticated: isFirebaseUserAuthenticated,
  logout: firebaseLogout,
  getUserInfo: getFirebaseUserInfo,
  createUser: createFirebaseUser,
  initialize: initializeFirebase
};
