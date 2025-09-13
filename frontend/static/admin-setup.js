/* ========================================
   AXYRA ADMIN SETUP
   Script para configurar usuario administrador
   ======================================== */

class AxyraAdminSetup {
  constructor() {
    this.adminEmail = 'axyra.app@gmail.com';
    this.adminPassword = 'AxyraAdmin2024!';
    this.init();
  }

  init() {
    console.log('🔧 Inicializando configuración de administrador...');
    
    // Solo ejecutar en desarrollo o si se solicita explícitamente
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1' ||
        window.location.search.includes('setup=admin')) {
      this.setupAdmin();
    }
  }

  async setupAdmin() {
    try {
      console.log('👑 Configurando usuario administrador...');
      
      // Verificar si Firebase está disponible
      if (typeof firebase === 'undefined') {
        console.error('❌ Firebase no está disponible');
        return;
      }

      // Intentar crear el usuario admin
      await this.createAdminUser();
      
    } catch (error) {
      console.error('❌ Error configurando admin:', error);
    }
  }

  async createAdminUser() {
    try {
      // Intentar crear usuario con email y contraseña
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(
        this.adminEmail, 
        this.adminPassword
      );
      
      console.log('✅ Usuario administrador creado:', userCredential.user.email);
      
      // Crear perfil en Firestore
      await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
        uid: userCredential.user.uid,
        email: this.adminEmail,
        displayName: 'Administrador AXYRA',
        username: 'admin',
        role: 'admin',
        isAdmin: true,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
        provider: 'email',
        hasPassword: true,
        emailVerified: false
      });
      
      console.log('✅ Perfil de administrador creado en Firestore');
      
      // Cerrar sesión para que el usuario pueda hacer login normalmente
      await firebase.auth().signOut();
      console.log('✅ Sesión cerrada. El administrador puede hacer login ahora.');
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('ℹ️ Usuario administrador ya existe');
        await this.updateAdminUser();
      } else {
        console.error('❌ Error creando usuario admin:', error);
      }
    }
  }

  async updateAdminUser() {
    try {
      // Buscar el usuario existente
      const usersSnapshot = await firebase.firestore()
        .collection('users')
        .where('email', '==', this.adminEmail)
        .get();
      
      if (!usersSnapshot.empty) {
        const userDoc = usersSnapshot.docs[0];
        await userDoc.ref.update({
          role: 'admin',
          isAdmin: true,
          lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Usuario existente actualizado como administrador');
      }
    } catch (error) {
      console.error('❌ Error actualizando usuario admin:', error);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AxyraAdminSetup();
});

// Función global para ejecutar setup manualmente
window.setupAxyraAdmin = function() {
  new AxyraAdminSetup();
};
