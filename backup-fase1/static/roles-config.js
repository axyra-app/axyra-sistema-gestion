/**
 * AXYRA - Sistema de Roles y Permisos
 * Configuración centralizada de roles y permisos del sistema
 *
 * NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD
 */

// ========================================
// CONFIGURACIÓN DE ROLES
// ========================================

const AXYRA_ROLES = {
  // Rol de administrador - acceso completo
  ADMIN: {
    id: 'admin',
    name: 'Administrador',
    description: 'Acceso completo a todas las funcionalidades del sistema',
    permissions: [
      'dashboard:read',
      'dashboard:write',
      'empleados:read',
      'empleados:write',
      'empleados:delete',
      'empleados:import',
      'empleados:export',
      'horas:read',
      'horas:write',
      'horas:delete',
      'horas:approve',
      'nomina:read',
      'nomina:write',
      'nomina:delete',
      'nomina:approve',
      'nomina:export',
      'cuadre_caja:read',
      'cuadre_caja:write',
      'cuadre_caja:delete',
      'cuadre_caja:approve',
      'cuadre_caja:export',
      'configuracion:read',
      'configuracion:write',
      'inventario:read',
      'inventario:write',
      'inventario:delete',
      'usuarios:read',
      'usuarios:write',
      'usuarios:delete',
      'roles:read',
      'roles:write',
      'roles:delete',
      'sistema:admin',
    ],
  },

  // Rol de gerente - acceso a gestión y reportes
  GERENTE: {
    id: 'gerente',
    name: 'Gerente',
    description: 'Acceso a gestión de empleados, nóminas y reportes ejecutivos',
    permissions: [
      'dashboard:read',
      'dashboard:write',
      'empleados:read',
      'empleados:write',
      'empleados:import',
      'empleados:export',
      'horas:read',
      'horas:write',
      'horas:approve',
      'nomina:read',
      'nomina:write',
      'nomina:approve',
      'nomina:export',
      'cuadre_caja:read',
      'cuadre_caja:write',
      'cuadre_caja:export',
      'configuracion:read',
      'inventario:read',
      'inventario:write',
      'usuarios:read',
    ],
  },

  // Rol de supervisor - gestión de equipos
  SUPERVISOR: {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Gestión de empleados y control de horas de su equipo',
    permissions: [
      'dashboard:read',
      'empleados:read',
      'empleados:write',
      'horas:read',
      'horas:write',
      'horas:approve',
      'nomina:read',
      'cuadre_caja:read',
      'inventario:read',
    ],
  },

  // Rol de empleado - acceso limitado
  EMPLEADO: {
    id: 'empleado',
    name: 'Empleado',
    description: 'Acceso básico para consultar información personal',
    permissions: ['dashboard:read', 'empleados:read_own', 'horas:read_own', 'nomina:read_own'],
  },

  // Rol de contador - gestión financiera
  CONTADOR: {
    id: 'contador',
    name: 'Contador',
    description: 'Acceso a nóminas, cuadre de caja y reportes financieros',
    permissions: [
      'dashboard:read',
      'empleados:read',
      'horas:read',
      'nomina:read',
      'nomina:write',
      'nomina:export',
      'cuadre_caja:read',
      'cuadre_caja:write',
      'cuadre_caja:export',
      'configuracion:read',
    ],
  },
};

// ========================================
// FUNCIONES DE VERIFICACIÓN DE PERMISOS
// ========================================

/**
 * Verifica si el usuario tiene un permiso específico
 * @param {string} permission - Permiso a verificar
 * @param {string} role - Rol del usuario
 * @returns {boolean} - True si tiene permiso
 */
function hasPermission(permission, role) {
  try {
    const userRole = AXYRA_ROLES[role.toUpperCase()];
    if (!userRole) {
      console.warn(`Rol no encontrado: ${role}`);
      return false;
    }
    return userRole.permissions.includes(permission);
  } catch (error) {
    console.error('Error verificando permiso:', error);
    return false;
  }
}

/**
 * Verifica si el usuario tiene acceso a un módulo específico
 * @param {string} module - Módulo a verificar
 * @param {string} action - Acción (read, write, delete, etc.)
 * @param {string} role - Rol del usuario
 * @returns {boolean} - True si tiene acceso
 */
function hasModuleAccess(module, action, role) {
  const permission = `${module}:${action}`;
  return hasPermission(permission, role);
}

/**
 * Obtiene el rol del usuario desde localStorage
 * @returns {string} - Rol del usuario o 'empleado' por defecto
 */
function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem('axyra_isolated_user') || '{}');
    return user.role || 'empleado';
  } catch (error) {
    console.error('Error obteniendo rol del usuario:', error);
    return 'empleado';
  }
}

/**
 * Verifica si el usuario actual tiene un permiso
 * @param {string} permission - Permiso a verificar
 * @returns {boolean} - True si tiene permiso
 */
function userHasPermission(permission) {
  const role = getUserRole();
  return hasPermission(permission, role);
}

/**
 * Verifica si el usuario actual tiene acceso a un módulo
 * @param {string} module - Módulo a verificar
 * @param {string} action - Acción a verificar
 * @returns {boolean} - True si tiene acceso
 */
function userHasModuleAccess(module, action) {
  const role = getUserRole();
  return hasModuleAccess(module, action, role);
}

/**
 * Obtiene todos los permisos del usuario actual
 * @returns {Array} - Lista de permisos
 */
function getUserPermissions() {
  try {
    const role = getUserRole();
    const userRole = AXYRA_ROLES[role.toUpperCase()];
    return userRole ? userRole.permissions : [];
  } catch (error) {
    console.error('Error obteniendo permisos del usuario:', error);
    return [];
  }
}

/**
 * Obtiene información del rol del usuario actual
 * @returns {Object} - Información del rol
 */
function getUserRoleInfo() {
  try {
    const role = getUserRole();
    return AXYRA_ROLES[role.toUpperCase()] || AXYRA_ROLES.EMPLEADO;
  } catch (error) {
    console.error('Error obteniendo información del rol:', error);
    return AXYRA_ROLES.EMPLEADO;
  }
}

// ========================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ========================================

/**
 * Oculta elementos de la interfaz según los permisos del usuario
 * Esta función se ejecuta automáticamente al cargar la página
 */
function applyRoleBasedUI() {
  try {
    const role = getUserRole();
    const permissions = getUserPermissions();

    console.log(`Aplicando UI para rol: ${role}`);
    console.log(`Permisos disponibles:`, permissions);

    // Ocultar elementos según permisos
    hideElementsByPermissions(permissions);

    // Mostrar información del rol
    showRoleInfo(role);
  } catch (error) {
    console.error('Error aplicando UI basada en roles:', error);
  }
}

/**
 * Oculta elementos HTML según los permisos del usuario
 * @param {Array} permissions - Lista de permisos del usuario
 */
function hideElementsByPermissions(permissions) {
  // Elementos que requieren permisos específicos
  const permissionElements = {
    'empleados:delete': ['.axyra-delete-btn', '.axyra-delete-empleado', '[onclick*="eliminarEmpleado"]'],
    'empleados:import': ['.axyra-import-btn', '.axyra-import-empleados', '[onclick*="importarEmpleados"]'],
    'empleados:export': ['.axyra-export-btn', '.axyra-export-empleados', '[onclick*="exportarEmpleados"]'],
    'nomina:approve': ['.axyra-approve-btn', '.axyra-approve-nomina', '[onclick*="aprobarNomina"]'],
    'cuadre_caja:approve': ['.axyra-approve-cuadre', '[onclick*="aprobarCuadre"]'],
    'usuarios:write': ['.axyra-user-management', '.axyra-create-user'],
    'sistema:admin': ['.axyra-admin-only', '.axyra-system-settings'],
  };

  // Ocultar elementos según permisos
  Object.keys(permissionElements).forEach((permission) => {
    if (!permissions.includes(permission)) {
      permissionElements[permission].forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
          element.style.display = 'none';
        });
      });
    }
  });
}

/**
 * Muestra información del rol del usuario en la interfaz
 * @param {string} role - Rol del usuario
 */
function showRoleInfo(role) {
  try {
    const roleInfo = AXYRA_ROLES[role.toUpperCase()];
    if (!roleInfo) return;

    // Buscar elementos donde mostrar el rol
    const roleElements = document.querySelectorAll('.axyra-user-role, .axyra-role-info');
    roleElements.forEach((element) => {
      element.textContent = roleInfo.name;
      element.title = roleInfo.description;
    });

    // Agregar indicador visual del rol en el header si existe
    const header = document.querySelector('.axyra-header');
    if (header && !document.querySelector('.axyra-role-badge')) {
      const roleBadge = document.createElement('div');
      roleBadge.className = 'axyra-role-badge';
      roleBadge.innerHTML = `
        <span class="axyra-role-badge-text">${roleInfo.name}</span>
        <i class="fas fa-user-shield" title="${roleInfo.description}"></i>
      `;
      header.appendChild(roleBadge);
    }
  } catch (error) {
    console.error('Error mostrando información del rol:', error);
  }
}

// ========================================
// FUNCIONES DE VALIDACIÓN EN TIEMPO REAL
// ========================================

/**
 * Valida si una acción está permitida antes de ejecutarla
 * @param {string} module - Módulo de la acción
 * @param {string} action - Acción a ejecutar
 * @param {Function} callback - Función a ejecutar si está permitido
 * @param {string} errorMessage - Mensaje de error personalizado
 */
function validateAndExecute(module, action, callback, errorMessage = null) {
  if (userHasModuleAccess(module, action)) {
    if (typeof callback === 'function') {
      callback();
    }
  } else {
    const defaultMessage = `No tienes permisos para realizar esta acción en ${module}`;
    showPermissionError(errorMessage || defaultMessage);
  }
}

/**
 * Muestra un mensaje de error de permisos
 * @param {string} message - Mensaje de error
 */
function showPermissionError(message) {
  // Crear notificación de error
  const notification = document.createElement('div');
  notification.className = 'axyra-notificacion axyra-notificacion-error';
  notification.innerHTML = `
    <div class="axyra-notificacion-icono">
      <i class="fas fa-ban"></i>
    </div>
    <div class="axyra-notificacion-contenido">
      <p class="axyra-notificacion-mensaje">${message}</p>
    </div>
    <button class="axyra-notificacion-cerrar" onclick="this.parentElement.remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  // Agregar al DOM
  document.body.appendChild(notification);

  // Remover automáticamente después de 5 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// ========================================
// INICIALIZACIÓN AUTOMÁTICA
// ========================================

/**
 * Inicializa el sistema de roles cuando se carga la página
 */
function initRoleSystem() {
  try {
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyRoleBasedUI);
    } else {
      applyRoleBasedUI();
    }

    // Aplicar también cuando cambie el usuario
    window.addEventListener('storage', (e) => {
      if (e.key === 'axyra_isolated_user') {
        setTimeout(applyRoleBasedUI, 100);
      }
    });

    console.log('Sistema de roles AXYRA inicializado correctamente');
  } catch (error) {
    console.error('Error inicializando sistema de roles:', error);
  }
}

// ========================================
// EXPORTACIÓN DE FUNCIONES
// ========================================

// Hacer las funciones disponibles globalmente
window.AXYRA_ROLES = AXYRA_ROLES;
window.hasPermission = hasPermission;
window.hasModuleAccess = hasModuleAccess;
window.getUserRole = getUserRole;
window.userHasPermission = userHasPermission;
window.userHasModuleAccess = userHasModuleAccess;
window.getUserPermissions = getUserPermissions;
window.getUserRoleInfo = getUserRoleInfo;
window.validateAndExecute = validateAndExecute;
window.showPermissionError = showPermissionError;
window.initRoleSystem = initRoleSystem;

// Inicializar automáticamente
initRoleSystem();
