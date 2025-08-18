/**
 * AXYRA Firebase User System
 * Sistema de usuarios basado en Firebase Authentication y Firestore
 * Versión: 3.0 - Sistema robusto y estable
 */

class AXYRAFirebaseUserSystem {
  constructor() {
    this.auth = null;
    this.db = null;
    this.currentUser = null;
    this.isInitialized = false;
    this.initRetries = 0;
    this.maxInitRetries = 3;

    this.init();
  }

  init() {
    try {
      if (window.axyraFirebase) {
        this.auth = axyraFirebase.auth;
        this.db = axyraFirebase.db;
        this.isInitialized = true;
        this.setupAuthListeners();
        console.log('✅ AXYRA Firebase User System inicializado');
        console.log('🔐 Auth disponible:', !!this.auth);
        console.log('🗄️ Firestore disponible:', !!this.db);
      } else {
        console.error('❌ Firebase no está disponible');
        this.retryInit();
      }
    } catch (error) {
      console.error('❌ Error inicializando Firebase User System:', error);
      this.retryInit();
    }
  }

  // Reintentar inicialización
  retryInit() {
    if (this.initRetries < this.maxInitRetries) {
      this.initRetries++;
      console.log(`🔄 Reintentando inicialización (${this.initRetries}/${this.maxInitRetries})...`);
      setTimeout(() => this.init(), 2000);
    } else {
      console.error('❌ Máximo de reintentos alcanzado. Firebase User System no disponible.');
    }
  }

  // Configurar listeners de autenticación
  setupAuthListeners() {
    if (!this.auth) {
      console.error('❌ Auth no disponible para configurar listeners');
      return;
    }

    this.auth.onAuthStateChanged((user) => {
      console.log('🔄 Estado de autenticación cambiado:', user ? user.email : 'No autenticado');
      
      if (user) {
        this.currentUser = user;
        console.log('✅ Usuario autenticado:', user.email);
        
        // Guardar sesión en localStorage para persistencia
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
        };
        
        localStorage.setItem('axyra_firebase_user', JSON.stringify(userData));

        // También guardar en axyra_user para compatibilidad
        const axyraUserData = {
          username: user.email.split('@')[0],
          email: user.email,
          fullName: user.displayName || user.email.split('@')[0],
          lastLogin: new Date().toISOString(),
          isFirebaseUser: true,
          uid: user.uid
        };
        
        localStorage.setItem('axyra_user', JSON.stringify(axyraUserData));
        
        // Cargar datos del usuario después de guardar en localStorage
        setTimeout(() => {
          this.loadUserData(user.uid);
        }, 500); // Aumentar el delay para evitar conflictos
        
      } else {
        // Verificar si hay sesión persistente antes de limpiar
        const savedUser = localStorage.getItem('axyra_user');
        const savedFirebaseUser = localStorage.getItem('axyra_firebase_user');
        
        if (savedUser || savedFirebaseUser) {
          try {
            const userData = savedUser ? JSON.parse(savedUser) : JSON.parse(savedFirebaseUser);
            const lastLogin = new Date(userData.lastLogin);
            const now = new Date();
            const hoursDiff = (now - lastLogin) / (1000 * 60 * 60);
            
            // Solo limpiar si han pasado más de 24 horas
            if (hoursDiff >= 24) {
              console.log('⏰ Sesión expirada por tiempo, limpiando...');
              this.clearSession();
            } else {
              console.log('🔄 Usuario desconectado de Firebase pero sesión válida en localStorage');
              return; // Mantener sesión
            }
          } catch (error) {
            console.error('❌ Error verificando sesión persistente:', error);
            this.clearSession();
          }
        } else {
          // Solo limpiar si realmente no hay usuario
          if (this.currentUser) {
            console.log('🔒 Usuario desconectado, limpiando sesión');
            this.currentUser = null;
          }
        }
      }
    });
  }

  // Limpiar sesión de manera segura
  clearSession() {
    this.currentUser = null;
    localStorage.removeItem('axyra_firebase_user');
    localStorage.removeItem('axyra_user');
    localStorage.removeItem('axyra_empleados');
    localStorage.removeItem('axyra_horas');
    localStorage.removeItem('axyra_nomina');
    console.log('🧹 Sesión limpiada completamente');
  }

  // Cargar datos del usuario desde Firestore
  async loadUserData(userId) {
    try {
      if (!this.db) {
        console.warn('⚠️ Firestore no disponible, saltando carga de datos del usuario');
        return;
      }

      const userDoc = await this.db.collection('users').doc(userId).get();
      if (userDoc.exists) {
        const userData = userDoc.data();
        this.currentUser = { ...this.currentUser, ...userData };
        console.log('✅ Datos del usuario cargados:', userData);
      } else {
        console.log('ℹ️ Usuario no encontrado en Firestore, creando documento...');
        await this.createUserDocument(userId);
      }
    } catch (error) {
      console.error('❌ Error cargando datos del usuario:', error);
    }
  }

  // Crear documento de usuario en Firestore
  async createUserDocument(userId) {
    try {
      if (!this.db) return;

      const user = this.currentUser;
      await this.db.collection('users').doc(userId).set({
        email: user.email,
        fullName: user.displayName || user.email.split('@')[0],
        username: user.email.split('@')[0],
        role: 'user',
        emailVerified: user.emailVerified || false,
        createdAt: new Date().toISOString(),
        userId: user.email.split('@')[0],
        lastLogin: new Date().toISOString(),
      });

      console.log('✅ Documento de usuario creado en Firestore');
    } catch (error) {
      console.error('❌ Error creando documento de usuario:', error);
    }
  }

  // Crear cuenta con email y contraseña
  async createAccount(email, password, fullName, username) {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase no está inicializado');
      }

      // Crear usuario en Firebase Auth
      const userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
      const user = userCredential.user;

      // Guardar datos adicionales en Firestore
      await this.db.collection('users').doc(user.uid).set({
        email: email,
        fullName: fullName,
        username: username,
        role: 'user',
        emailVerified: false,
        createdAt: new Date().toISOString(),
        userId: username,
      });

      console.log('✅ Cuenta creada exitosamente:', user.email);
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Error creando cuenta:', error);
      return { success: false, error: error.message };
    }
  }

  // Iniciar sesión con email y contraseña
  async signIn(email, password) {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase no está inicializado');
      }

      const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
      const user = userCredential.user;

      console.log('✅ Sesión iniciada exitosamente:', user.email);
      return { success: true, user: user };
    } catch (error) {
      console.error('❌ Error iniciando sesión:', error);
      return { success: false, error: error.message };
    }
  }

  // Iniciar sesión o registrar con Google
  async signInWithGoogle() {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase no está inicializado');
      }

      const provider = new firebase.auth.GoogleAuthProvider();
      const userCredential = await this.auth.signInWithPopup(provider);
      const user = userCredential.user;

      // Verificar si es un usuario nuevo
      if (userCredential.additionalUserInfo.isNewUser) {
        console.log('🆕 Nuevo usuario de Google detectado, creando cuenta...');

        // Guardar datos del usuario de Google en Firestore
        await this.db
          .collection('users')
          .doc(user.uid)
          .set({
            email: user.email,
            fullName: user.displayName,
            username: user.email.split('@')[0],
            role: 'user',
            emailVerified: true,
            createdAt: new Date().toISOString(),
            userId: user.email.split('@')[0],
            googleId: user.uid,
            picture: user.photoURL,
            isGoogleUser: true,
            lastLogin: new Date().toISOString(),
          });

        console.log('✅ Cuenta de Google creada exitosamente:', user.email);
      } else {
        console.log('✅ Usuario existente de Google, iniciando sesión:', user.email);

        // Actualizar último login
        await this.db.collection('users').doc(user.uid).update({
          lastLogin: new Date().toISOString(),
        });
      }

      console.log('✅ Sesión iniciada con Google:', user.email);
      return { success: true, user: user, isNewUser: userCredential.additionalUserInfo.isNewUser };
    } catch (error) {
      console.error('❌ Error iniciando sesión con Google:', error);
      return { success: false, error: error.message };
    }
  }

  // Cerrar sesión
  async signOut() {
    try {
      if (!this.isInitialized) {
        throw new Error('Firebase no está inicializado');
      }

      await this.auth.signOut();
      this.currentUser = null;
      console.log('✅ Sesión cerrada exitosamente');
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión:', error);
      return { success: false, error: error.message };
    }
  }

  // Verificar si hay sesión activa
  hasActiveSession() {
    // Verificar sesión actual de Firebase
    if (this.currentUser) {
      return true;
    }

    // Verificar sesión persistente en localStorage
    const savedUser = localStorage.getItem('axyra_firebase_user');
    const savedAxyraUser = localStorage.getItem('axyra_user');
    
    if (savedUser || savedAxyraUser) {
      try {
        const userData = savedUser ? JSON.parse(savedUser) : JSON.parse(savedAxyraUser);
        
        if (userData.lastLogin) {
          const lastLogin = new Date(userData.lastLogin);
          const now = new Date();
          const hoursDiff = (now - lastLogin) / (1000 * 60 * 60);

          // Sesión válida por 24 horas
          if (hoursDiff < 24) {
            console.log('✅ Sesión persistente encontrada:', userData.email || userData.username);
            // Restaurar usuario actual
            this.currentUser = userData;
            return true;
          } else {
            console.log('⏰ Sesión expirada por tiempo');
            this.clearSession();
            return false;
          }
        } else {
          // Si no hay lastLogin, asumir que es válida
          console.log('✅ Sesión persistente encontrada (sin timestamp)');
          this.currentUser = userData;
          return true;
        }
      } catch (error) {
        console.error('❌ Error verificando sesión persistente:', error);
        this.clearSession();
        return false;
      }
    }

    return false;
  }

  // Obtener usuario actual
  getCurrentUser() {
    return this.currentUser;
  }

  // Verificar si el email está verificado
  isEmailVerified() {
    return this.currentUser && this.currentUser.emailVerified;
  }

  // Enviar email de verificación
  async sendEmailVerification() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Usuario no autenticado');
      }

      await this.currentUser.sendEmailVerification();
      console.log('✅ Email de verificación enviado');
      return { success: true };
    } catch (error) {
      console.error('❌ Error enviando email de verificación:', error);
      return { success: false, error: error.message };
    }
  }

  // Actualizar perfil del usuario
  async updateProfile(updates) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Usuario no autenticado');
      }

      await this.db.collection('users').doc(this.currentUser.uid).update(updates);
      console.log('✅ Perfil actualizado:', updates);
      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estado del sistema
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasAuth: !!this.auth,
      hasDb: !!this.db,
      hasCurrentUser: !!this.currentUser,
      userEmail: this.currentUser ? this.currentUser.email : null,
      emailVerified: this.currentUser ? this.currentUser.emailVerified : false,
      initRetries: this.initRetries,
      maxInitRetries: this.maxInitRetries,
    };
  }

  // Verificar salud del sistema
  checkHealth() {
    const status = this.getStatus();
    const health = {
      firebase: status.isInitialized,
      auth: status.hasAuth,
      firestore: status.hasDb,
      user: status.hasCurrentUser,
      overall: status.isInitialized && status.hasAuth && status.hasDb
    };

    console.log('🏥 Estado del sistema:', health);
    return health;
  }

  // Cerrar sesión
  async signOut() {
    try {
      if (!this.isInitialized || !this.auth) {
        console.warn('⚠️ Firebase no está disponible para cerrar sesión');
        return { success: true };
      }

      await this.auth.signOut();
      console.log('✅ Sesión de Firebase cerrada');
      
      // Limpiar usuario actual
      this.currentUser = null;
      
      return { success: true };
    } catch (error) {
      console.error('❌ Error cerrando sesión de Firebase:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instancia global
const axyraFirebaseUserSystem = new AXYRAFirebaseUserSystem();

// Exportar para uso en otros módulos
window.AXYRAFirebaseUserSystem = AXYRAFirebaseUserSystem;
window.axyraFirebaseUserSystem = axyraFirebaseUserSystem;
