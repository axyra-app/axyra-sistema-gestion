// ========================================
// SERVICIO DE FIREBASE AXYRA
// ========================================

/**
 * Servicio centralizado de Firebase
 * Maneja todas las operaciones de Firebase (Auth, Firestore, Storage)
 */
class AxyraFirebaseService {
  constructor() {
    this.app = null;
    this.auth = null;
    this.firestore = null;
    this.storage = null;
    this.isInitialized = false;
  }

  /**
   * Inicializar Firebase
   */
  async init() {
    if (this.isInitialized) {
      console.warn('⚠️ Firebase ya está inicializado');
      return;
    }

    try {
      console.log('🔥 Inicializando Firebase...');

      // Verificar si Firebase ya está disponible
      if (typeof firebase !== 'undefined') {
        this.app = firebase.app();
        this.auth = firebase.auth();
        this.firestore = firebase.firestore();
        this.storage = firebase.storage();
      } else {
        throw new Error('Firebase no está disponible');
      }

      // Configurar Firestore
      this.configureFirestore();

      this.isInitialized = true;
      console.log('✅ Firebase inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Firebase:', error);
      throw error;
    }
  }

  /**
   * Configurar Firestore
   */
  configureFirestore() {
    // Configuraciones de Firestore
    const settings = {
      cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
      ignoreUndefinedProperties: true,
    };

    this.firestore.settings(settings);

    // Configurar persistencia offline
    this.firestore
      .enablePersistence({
        synchronizeTabs: true,
      })
      .catch((err) => {
        if (err.code === 'failed-precondition') {
          console.warn('⚠️ Múltiples pestañas abiertas, persistencia deshabilitada');
        } else if (err.code === 'unimplemented') {
          console.warn('⚠️ Persistencia no soportada en este navegador');
        }
      });
  }

  // ========================================
  // MÉTODOS DE AUTENTICACIÓN
  // ========================================

  /**
   * Iniciar sesión con email y contraseña
   */
  async signInWithEmailAndPassword(email, password) {
    return await this.auth.signInWithEmailAndPassword(email, password);
  }

  /**
   * Crear usuario con email y contraseña
   */
  async createUserWithEmailAndPassword(email, password) {
    return await this.auth.createUserWithEmailAndPassword(email, password);
  }

  /**
   * Cerrar sesión
   */
  async signOut() {
    return await this.auth.signOut();
  }

  /**
   * Escuchar cambios en el estado de autenticación
   */
  onAuthStateChanged(callback) {
    return this.auth.onAuthStateChanged(callback);
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  // ========================================
  // MÉTODOS DE FIRESTORE
  // ========================================

  /**
   * Obtener documento
   */
  async getDocument(collection, docId) {
    try {
      const doc = await this.firestore.collection(collection).doc(docId).get();
      return doc.exists ? { id: doc.id, ...doc.data() } : null;
    } catch (error) {
      console.error('❌ Error obteniendo documento:', error);
      throw error;
    }
  }

  /**
   * Obtener colección
   */
  async getCollection(collection, orderBy = null, limit = null) {
    try {
      let query = this.firestore.collection(collection);

      if (orderBy) {
        query = query.orderBy(orderBy);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const snapshot = await query.get();
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('❌ Error obteniendo colección:', error);
      throw error;
    }
  }

  /**
   * Agregar documento
   */
  async addDocument(collection, data) {
    try {
      const docRef = await this.firestore.collection(collection).add(data);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error agregando documento:', error);
      throw error;
    }
  }

  /**
   * Actualizar documento
   */
  async updateDocument(collection, docId, data) {
    try {
      await this.firestore.collection(collection).doc(docId).update(data);
      return true;
    } catch (error) {
      console.error('❌ Error actualizando documento:', error);
      throw error;
    }
  }

  /**
   * Eliminar documento
   */
  async deleteDocument(collection, docId) {
    try {
      await this.firestore.collection(collection).doc(docId).delete();
      return true;
    } catch (error) {
      console.error('❌ Error eliminando documento:', error);
      throw error;
    }
  }

  /**
   * Escuchar cambios en tiempo real
   */
  onSnapshot(collection, callback, orderBy = null, limit = null) {
    let query = this.firestore.collection(collection);

    if (orderBy) {
      query = query.orderBy(orderBy);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return query.onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(data);
    });
  }

  /**
   * Establecer datos de usuario
   */
  async setUserData(userId, userData) {
    try {
      await this.firestore.collection('users').doc(userId).set(userData, { merge: true });
      return true;
    } catch (error) {
      console.error('❌ Error estableciendo datos de usuario:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTODOS DE STORAGE
  // ========================================

  /**
   * Subir archivo
   */
  async uploadFile(path, file) {
    try {
      const storageRef = this.storage.ref().child(path);
      const snapshot = await storageRef.put(file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('❌ Error subiendo archivo:', error);
      throw error;
    }
  }

  /**
   * Eliminar archivo
   */
  async deleteFile(path) {
    try {
      const storageRef = this.storage.ref().child(path);
      await storageRef.delete();
      return true;
    } catch (error) {
      console.error('❌ Error eliminando archivo:', error);
      throw error;
    }
  }

  /**
   * Obtener URL de descarga
   */
  async getDownloadURL(path) {
    try {
      const storageRef = this.storage.ref().child(path);
      return await storageRef.getDownloadURL();
    } catch (error) {
      console.error('❌ Error obteniendo URL de descarga:', error);
      throw error;
    }
  }

  // ========================================
  // MÉTODOS UTILITARIOS
  // ========================================

  /**
   * Verificar si Firebase está inicializado
   */
  isFirebaseInitialized() {
    return this.isInitialized;
  }

  /**
   * Obtener instancia de Firebase
   */
  getFirebaseInstance() {
    return {
      app: this.app,
      auth: this.auth,
      firestore: this.firestore,
      storage: this.storage,
    };
  }

  /**
   * Limpiar recursos
   */
  cleanup() {
    // Limpiar listeners y recursos
    this.isInitialized = false;
    console.log('🧹 Firebase limpiado');
  }
}

// Exportar para uso global
window.AxyraFirebaseService = AxyraFirebaseService;
