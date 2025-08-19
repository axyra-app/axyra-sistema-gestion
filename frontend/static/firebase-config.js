// ========================================
// CONFIGURACIÓN DE FIREBASE AXYRA
// ========================================

// Configuración de Firebase para AXYRA
const firebaseConfig = {
  // 🔑 API Key de Firebase
  apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  
  // 🌐 Dominio de autenticación
  authDomain: "axyra-sistema-gestion.firebaseapp.com",
  
  // 📁 ID del proyecto
  projectId: "axyra-sistema-gestion",
  
  // 🗄️ Bucket de almacenamiento
  storageBucket: "axyra-sistema-gestion.appspot.com",
  
  // 📱 ID del remitente de mensajes
  messagingSenderId: "123456789012",
  
  // 🆔 ID de la aplicación
  appId: "1:123456789012:web:abcdefghijklmnop"
};

// Inicializar Firebase
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  
  // Inicializar servicios
  const firebaseAuth = firebase.auth();
  const firebaseFirestore = firebase.firestore();
  
  console.log('🔥 Firebase AXYRA inicializado correctamente');
  
  // Exportar para uso global
  window.axyraFirebase = {
    auth: firebaseAuth,
    firestore: firebaseFirestore,
    config: firebaseConfig
  };
} else {
  console.error('❌ Firebase SDK no está disponible');
}

// ========================================
// FUNCIONES DE AUTENTICACIÓN FIREBASE
// ========================================

// Función para verificar si Firebase está disponible
function isFirebaseAvailable() {
  return typeof firebase !== 'undefined' && firebase.auth;
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

// Exportar funciones para uso global
window.axyraFirebaseUtils = {
  isAvailable: isFirebaseAvailable,
  getCurrentUser: getCurrentFirebaseUser,
  isAuthenticated: isFirebaseUserAuthenticated,
  logout: firebaseLogout,
  getUserInfo: getFirebaseUserInfo
};
