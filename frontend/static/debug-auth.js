/**
 * AXYRA Debug Authentication
 * Script para diagnosticar problemas de autenticación
 */

function debugAuth() {
  console.log('🔍 === DEBUG AUTH AXYRA ===');
  
  // Verificar si el sistema está cargado
  console.log('1. Sistema de autenticación:', {
    'axyraIsolatedAuth': !!window.axyraIsolatedAuth,
    'axyraUltraSimpleAuth': !!window.axyraUltraSimpleAuth,
    'axyraSimpleAuth': !!window.axyraSimpleAuth,
    'axyraAuthAPI': !!window.axyraAuthAPI
  });
  
  // Verificar usuarios en localStorage
  const users = localStorage.getItem('axyra_users');
  console.log('2. Usuarios en localStorage:', users ? JSON.parse(users) : 'NO HAY USUARIOS');
  
  // Verificar sesión actual
  const currentUser = localStorage.getItem('axyra_user');
  console.log('3. Usuario actual:', currentUser ? JSON.parse(currentUser) : 'NO HAY SESIÓN');
  
  // Verificar estado del sistema
  if (window.axyraIsolatedAuth) {
    console.log('4. Estado del sistema aislado:', {
      'isAuthenticated': window.axyraIsolatedAuth.isUserAuthenticated(),
      'currentUser': window.axyraIsolatedAuth.getCurrentUser(),
      'usersCount': window.axyraIsolatedAuth.users.length
    });
  }
  
  if (window.axyraUltraSimpleAuth) {
    console.log('4b. Estado del sistema ultra simple:', {
      'isAuthenticated': window.axyraUltraSimpleAuth.isUserAuthenticated(),
      'currentUser': window.axyraUltraSimpleAuth.getCurrentUser(),
      'usersCount': window.axyraUltraSimpleAuth.users.length
    });
  }
  
  // Verificar todas las claves de localStorage
  console.log('5. Todas las claves de localStorage:');
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('axyra_')) {
      console.log(`  ${key}: ${localStorage.getItem(key)}`);
    }
  }
  
  console.log('🔍 === FIN DEBUG ===');
}

  // Función para probar login
  function testLogin() {
    console.log('🧪 === PROBANDO LOGIN ===');
    
    if (window.axyraIsolatedAuth) {
      console.log('🧪 Probando login en sistema aislado...');
      
      // Probar login con admin
      const result = window.axyraIsolatedAuth.login({
        usernameOrEmail: 'admin',
        password: 'admin123'
      });
      
      console.log('Resultado del login aislado:', result);
      
      if (result.success) {
        console.log('✅ Login exitoso en sistema aislado, verificando estado...');
        console.log('Estado después del login aislado:', {
          'isAuthenticated': window.axyraIsolatedAuth.isUserAuthenticated(),
          'currentUser': window.axyraIsolatedAuth.getCurrentUser()
        });
      } else {
        console.error('❌ Login falló en sistema aislado:', result.error);
      }
    } else if (window.axyraUltraSimpleAuth) {
      console.log('🧪 Probando login en sistema ultra simple...');
      
      // Probar login con admin
      const result = window.axyraUltraSimpleAuth.login({
        usernameOrEmail: 'admin',
        password: 'admin123'
      });
      
      console.log('Resultado del login ultra simple:', result);
      
      if (result.success) {
        console.log('✅ Login exitoso en sistema ultra simple, verificando estado...');
        console.log('Estado después del login ultra simple:', {
          'isAuthenticated': window.axyraUltraSimpleAuth.isUserAuthenticated(),
          'currentUser': window.axyraUltraSimpleAuth.getCurrentUser()
        });
      } else {
        console.error('❌ Login falló en sistema ultra simple:', result.error);
      }
    } else {
      console.error('❌ Ningún sistema de autenticación está cargado');
    }
  }

  // Función para crear usuarios manualmente
  function createUsersManually() {
    console.log('👥 === CREANDO USUARIOS MANUALMENTE ===');
    
    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@axyra.app',
        password: 'admin123',
        fullName: 'Administrador AXYRA',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      },
      {
        id: '2',
        username: 'demo',
        email: 'demo@axyra.app',
        password: 'demo123',
        fullName: 'Usuario Demo',
        role: 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: null
      }
    ];
    
    localStorage.setItem('axyra_users', JSON.stringify(defaultUsers));
    console.log('✅ Usuarios creados manualmente');
    
    // Recargar el sistema
    if (window.axyraUltraSimpleAuth) {
      window.axyraUltraSimpleAuth.users = defaultUsers;
      console.log('✅ Sistema actualizado');
    }
  }
  
  // Función para verificar interferencias
  function checkInterferences() {
    console.log('🔍 === VERIFICANDO INTERFERENCIAS ===');
    
    // Verificar si hay otros scripts interfiriendo
    const scripts = document.querySelectorAll('script');
    console.log('📜 Scripts cargados:', scripts.length);
    
    scripts.forEach((script, index) => {
      if (script.src && script.src.includes('axyra')) {
        console.log(`  ${index}: ${script.src}`);
      }
    });
    
    // Verificar localStorage por interferencias
    console.log('🗄️ Verificando localStorage por interferencias...');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes('axyra')) {
        console.log(`  ${key}: ${localStorage.getItem(key)}`);
      }
    }
    
    // Verificar si hay listeners de storage
    console.log('👂 Verificando listeners de storage...');
    // Esto es difícil de verificar, pero podemos monitorear cambios
    
    console.log('🔍 === FIN VERIFICACIÓN DE INTERFERENCIAS ===');
  }

// Exportar funciones
window.debugAuth = debugAuth;
window.testLogin = testLogin;
window.createUsersManually = createUsersManually;
window.checkInterferences = checkInterferences;

console.log('🔍 AXYRA Debug Auth cargado');
console.log('💡 Usa debugAuth() para ver el estado');
console.log('💡 Usa testLogin() para probar login');
console.log('💡 Usa createUsersManually() para crear usuarios');
console.log('💡 Usa checkInterferences() para verificar interferencias');
