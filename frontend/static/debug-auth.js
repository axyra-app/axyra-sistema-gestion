/**
 * AXYRA Debug Authentication
 * Script para diagnosticar problemas de autenticación
 */

function debugAuth() {
  console.log('🔍 === DEBUG AUTH AXYRA ===');
  
  // Verificar si el sistema está cargado
  console.log('1. Sistema de autenticación:', {
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
  if (window.axyraUltraSimpleAuth) {
    console.log('4. Estado del sistema:', {
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
  
  if (!window.axyraUltraSimpleAuth) {
    console.error('❌ Sistema de autenticación no está cargado');
    return;
  }
  
  // Probar login con admin
  const result = window.axyraUltraSimpleAuth.login({
    usernameOrEmail: 'admin',
    password: 'admin123'
  });
  
  console.log('Resultado del login:', result);
  
  if (result.success) {
    console.log('✅ Login exitoso, verificando estado...');
    console.log('Estado después del login:', {
      'isAuthenticated': window.axyraUltraSimpleAuth.isUserAuthenticated(),
      'currentUser': window.axyraUltraSimpleAuth.getCurrentUser()
    });
  } else {
    console.error('❌ Login falló:', result.error);
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

// Exportar funciones
window.debugAuth = debugAuth;
window.testLogin = testLogin;
window.createUsersManually = createUsersManually;

console.log('🔍 AXYRA Debug Auth cargado');
console.log('💡 Usa debugAuth() para ver el estado');
console.log('💡 Usa testLogin() para probar login');
console.log('💡 Usa createUsersManually() para crear usuarios');
