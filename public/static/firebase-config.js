// ========================================
// CONFIGURACIÓN DE FIREBASE AXYRA
// ========================================

// Configuración de Firebase para AXYRA
const firebaseConfig = {
  // 🔑 API Key de Firebase - CONFIGURACIÓN REAL
  apiKey: 'AIzaSyAW3ejokcsWAP5G1yJT63jLBpFmdTiTUwc',

  // 🌐 Dominio de autenticación
  authDomain: 'axyra-48238.firebaseapp.com',

  // 📁 ID del proyecto
  projectId: 'axyra-48238',

  // 🗄️ Bucket de almacenamiento
  storageBucket: 'axyra-48238.firebasestorage.app',

  // 📱 ID del remitente de mensajes
  messagingSenderId: '796334517286',

  // 🆔 ID de la aplicación
  appId: '1:796334517286:web:95947cf0f773dc11378ae7',

  // 📊 ID de medición (opcional)
  measurementId: 'G-R8W2MP15B7',
};

// Dominios autorizados para OAuth
const authorizedDomains = [
  'axyra.vercel.app',
  'axyra-sistema-gestion.vercel.app',
  'axyra-sistema-gestion-imj6s312h-axyras-projects.vercel.app',
  'localhost',
  '127.0.0.1',
];

// Verificar si el dominio actual está autorizado
function isDomainAuthorized() {
  const currentDomain = window.location.hostname;
  return authorizedDomains.includes(currentDomain);
}

// Inicializar Firebase cuando el SDK esté disponible
function initializeFirebase() {
  if (typeof firebase !== 'undefined') {
    try {
      // Verificar dominio autorizado
      if (!isDomainAuthorized()) {
        console.warn('⚠️ Dominio no autorizado:', window.location.hostname);
        console.warn('📝 Agrega este dominio en Firebase Console -> Authentication -> Settings -> Authorized domains');
      }

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

      // Configurar Firestore con merge: true para evitar warnings
      firebaseFirestore.settings({
        cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
        merge: true,
      });

      // Configurar persistencia de autenticación
      firebaseAuth
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => {
          console.log('✅ Persistencia de autenticación configurada');
        })
        .catch((error) => {
          console.warn('⚠️ Error configurando persistencia:', error);
        });

      // Configurar listener de estado de autenticación
      firebaseAuth.onAuthStateChanged((user) => {
        if (user) {
          console.log('🔐 Usuario autenticado en Firebase:', user.email);

          // Crear y guardar usuario en formato dashboard
          const userInfo = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email.split('@')[0],
            username: user.email.split('@')[0],
            photoURL: user.photoURL || null,
            provider: 'firebase',
            hasPassword: true,
            emailVerified: user.emailVerified,
            id: user.uid,
            isAuthenticated: true,
          };

          // Guardar en localStorage para el dashboard
          localStorage.setItem('axyra_isolated_user', JSON.stringify(userInfo));
          localStorage.setItem('axyra_firebase_user', JSON.stringify(user));

          console.log('✅ Usuario Firebase guardado en localStorage');
        } else {
          console.log('🔐 Usuario no autenticado en Firebase');
        }
      });

      // Exportar para uso global
      window.axyraFirebase = {
        auth: firebaseAuth,
        firestore: firebaseFirestore,
        config: firebaseConfig,
        isDomainAuthorized: isDomainAuthorized(),
        FieldValue: firebase.firestore.FieldValue,
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

// Función para generar ID único de empresa
function generateCompanyId() {
  return 'company_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Función para obtener o crear ID de empresa
function getOrCreateCompanyId() {
  let companyId = localStorage.getItem('axyra_company_id');

  if (!companyId) {
    companyId = generateCompanyId();
    localStorage.setItem('axyra_company_id', companyId);
    console.log('🏢 Nueva empresa creada con ID:', companyId);
  }

  return companyId;
}

// Función para limpiar datos de empresa anterior
function clearPreviousCompanyData() {
  // Limpiar todos los datos excepto el ID de empresa actual
  const currentCompanyId = localStorage.getItem('axyra_company_id');

  // Lista de claves a limpiar
  const keysToClean = [
    'axyra_empleados',
    'axyra_horas',
    'axyra_nomina',
    'axyra_facturas',
    'axyra_configuracion',
    'axyra_areas_trabajo',
  ];

  keysToClean.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`🧹 Datos limpiados: ${key}`);
    }
  });

  console.log('✅ Datos de empresa anterior limpiados');
}

// Función para limpiar datos al cambiar de usuario
function clearUserDataOnChange(newUserId) {
  const currentUserId = localStorage.getItem('axyra_isolated_user_id');

  if (currentUserId && currentUserId !== newUserId) {
    console.log('🔄 Usuario cambiado, limpiando datos...');
    clearPreviousCompanyData();

    // Generar nuevo ID de empresa
    const newCompanyId = generateCompanyId();
    localStorage.setItem('axyra_company_id', newCompanyId);
    console.log('🏢 Nueva empresa creada para nuevo usuario:', newCompanyId);
  }
}

// Función para hacer logout de Firebase
async function firebaseLogout() {
  if (isFirebaseAvailable()) {
    try {
      await firebase.auth().signOut();
      console.log('✅ Logout de Firebase exitoso');

      // Limpiar localStorage pero mantener ID de empresa
      const companyId = localStorage.getItem('axyra_company_id');
      localStorage.clear();
      if (companyId) {
        localStorage.setItem('axyra_company_id', companyId);
      }

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
      providerData: user.providerData,
      companyId: getOrCreateCompanyId(),
    };
  }
  return null;
}

// Función para crear usuario en Firestore con aislamiento por empresa
async function createFirebaseUser(userData) {
  if (isFirebaseAvailable() && userData) {
    try {
      const companyId = getOrCreateCompanyId();

      // Agregar ID de empresa al usuario
      const userWithCompany = {
        ...userData,
        companyId: companyId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      };

      await window.axyraFirebase.firestore.collection('users').doc(userData.uid).set(userWithCompany, { merge: true });

      console.log('✅ Usuario creado en Firestore con empresa:', companyId);
      return true;
    } catch (error) {
      console.error('❌ Error creando usuario en Firestore:', error);
      return false;
    }
  }
  return false;
}

// Función para obtener datos de Firestore con aislamiento por empresa
async function getFirestoreData(collection, options = {}) {
  if (isFirebaseAvailable()) {
    try {
      const companyId = getOrCreateCompanyId();
      let query = window.axyraFirebase.firestore.collection(collection);

      // Aplicar filtro de empresa si no se especifica lo contrario
      if (!options.ignoreCompany) {
        query = query.where('companyId', '==', companyId);
      }

      // Aplicar otros filtros si se especifican
      if (options.where) {
        options.where.forEach((filter) => {
          query = query.where(filter.field, filter.operator, filter.value);
        });
      }

      // Aplicar ordenamiento si se especifica
      if (options.orderBy) {
        query = query.orderBy(options.orderBy.field, options.orderBy.direction || 'asc');
      }

      // Aplicar límite si se especifica
      if (options.limit) {
        query = query.limit(options.limit);
      }

      const snapshot = await query.get();
      return snapshot;
    } catch (error) {
      console.error('❌ Error obteniendo datos de Firestore:', error);
      return null;
    }
  }
  return null;
}

// Función para guardar datos en Firestore con aislamiento por empresa
async function saveFirestoreData(collection, docId, data, options = {}) {
  if (isFirebaseAvailable()) {
    try {
      const companyId = getOrCreateCompanyId();

      // Agregar companyId si no se especifica lo contrario
      if (!options.ignoreCompany) {
        data.companyId = companyId;
      }

      // Agregar timestamp de creación/actualización
      if (!data.createdAt) {
        data.createdAt = new Date().toISOString();
      }
      data.updatedAt = new Date().toISOString();

      const docRef = window.axyraFirebase.firestore.collection(collection).doc(docId);
      await docRef.set(data, { merge: true });

      console.log(`✅ Datos guardados en ${collection}/${docId}`);
      return docRef;
    } catch (error) {
      console.error('❌ Error guardando datos en Firestore:', error);
      throw error;
    }
  }
  throw new Error('Firebase no disponible');
}

// Función para eliminar datos de Firestore
async function deleteFirestoreData(collection, docId) {
  if (isFirebaseAvailable()) {
    try {
      await window.axyraFirebase.firestore.collection(collection).doc(docId).delete();
      console.log(`✅ Documento eliminado: ${collection}/${docId}`);
      return true;
    } catch (error) {
      console.error('❌ Error eliminando documento:', error);
      throw error;
    }
  }
  throw new Error('Firebase no disponible');
}

// Función global para obtener usuario actual (compatible con sistema existente)
function obtenerUsuarioActual() {
  // Intentar obtener de Firebase primero
  if (isFirebaseAvailable()) {
    const firebaseUser = getCurrentFirebaseUser();
    if (firebaseUser) {
      return {
        id: firebaseUser.uid,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        nombre: firebaseUser.displayName || firebaseUser.email.split('@')[0],
        timestamp: Date.now(),
      };
    }
  }

  // Fallback a localStorage
  const usuario = localStorage.getItem('axyra_isolated_user') || localStorage.getItem('axyra_usuario_actual');
  if (usuario) {
    try {
      return JSON.parse(usuario);
    } catch (error) {
      console.warn('Error parseando usuario del localStorage:', error);
    }
  }

  // Crear usuario temporal único
  const usuarioTemp = {
    id: 'usuario_' + Date.now(),
    uid: 'usuario_' + Date.now(),
    nombre: 'Usuario',
    email: 'usuario@axyra.com',
    timestamp: Date.now(),
  };

  localStorage.setItem('axyra_usuario_actual', JSON.stringify(usuarioTemp));
  return usuarioTemp;
}

// Exportar funciones para uso global
window.axyraFirebaseUtils = {
  isAvailable: isFirebaseAvailable,
  getCurrentUser: getCurrentFirebaseUser,
  isAuthenticated: isFirebaseUserAuthenticated,
  logout: firebaseLogout,
  getUserInfo: getFirebaseUserInfo,
  createUser: createFirebaseUser,
  getData: getFirestoreData,
  saveData: saveFirestoreData,
  deleteData: deleteFirestoreData,
  getCompanyId: getOrCreateCompanyId,
  clearCompanyData: clearPreviousCompanyData,
  initialize: initializeFirebase,
};

// Exportar función global
window.obtenerUsuarioActual = obtenerUsuarioActual;
