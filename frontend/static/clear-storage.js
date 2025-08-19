/**
 * AXYRA Clear Storage
 * Limpia localStorage para eliminar datos corruptos y ciclos infinitos
 */

function clearAXYRAStorage() {
  console.log('🧹 Limpiando localStorage de AXYRA...');
  
  // Lista de claves a eliminar
  const keysToRemove = [
    'axyra_user',
    'axyra_firebase_user',
    'axyra_users',
    'axyra_empleados',
    'axyra_horas',
    'axyra_nomina',
    'axyra_2fa_enabled',
    'axyra_session_data'
  ];
  
  // Eliminar cada clave
  keysToRemove.forEach(key => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
      console.log(`✅ Eliminado: ${key}`);
    }
  });
  
  // Limpiar también cualquier clave que empiece con 'axyra_'
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (key && key.startsWith('axyra_')) {
      localStorage.removeItem(key);
      console.log(`✅ Eliminado: ${key}`);
    }
  }
  
  console.log('✅ localStorage limpiado completamente');
  alert('✅ localStorage limpiado. Ahora puedes usar la aplicación sin problemas.');
}

// Función para limpiar solo la sesión del usuario
function clearUserSession() {
  console.log('🔒 Limpiando sesión del usuario...');
  localStorage.removeItem('axyra_user');
  localStorage.removeItem('axyra_firebase_user');
  console.log('✅ Sesión del usuario limpiada');
}

// Función para verificar estado del localStorage
function checkStorageStatus() {
  console.log('📊 Estado del localStorage:');
  
  let axyraKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('axyra_')) {
      axyraKeys.push(key);
    }
  }
  
  if (axyraKeys.length === 0) {
    console.log('✅ No hay claves de AXYRA en localStorage');
  } else {
    console.log('🔍 Claves de AXYRA encontradas:', axyraKeys);
    axyraKeys.forEach(key => {
      const value = localStorage.getItem(key);
      console.log(`  ${key}: ${value ? value.substring(0, 100) + '...' : 'null'}`);
    });
  }
}

// Exportar funciones
window.clearAXYRAStorage = clearAXYRAStorage;
window.clearUserSession = clearUserSession;
window.checkStorageStatus = checkStorageStatus;

console.log('🧹 AXYRA Clear Storage cargado');
console.log('💡 Usa clearAXYRAStorage() para limpiar todo');
console.log('💡 Usa clearUserSession() para limpiar solo la sesión');
console.log('💡 Usa checkStorageStatus() para ver el estado');
