/**
 * AXYRA - Sistema de Gestión de Usuarios Avanzado
 * Maneja usuarios, roles, permisos y autenticación avanzada
 */

class AxyraAdvancedUserManagement {
  constructor() {
    this.users = [];
    this.roles = [];
    this.permissions = [];
    this.sessions = [];
    this.auditLog = [];
    
    this.init();
  }

  init() {
    console.log('👥 Inicializando sistema de gestión de usuarios avanzado...');
    this.loadData();
    this.setupDefaultRoles();
    this.setupDefaultPermissions();
    this.setupSessionManagement();
    this.setupAuditLogging();
  }

  loadData() {
    try {
      this.users = JSON.parse(localStorage.getItem('axyra_users') || '[]');
      this.roles = JSON.parse(localStorage.getItem('axyra_roles') || '[]');
      this.permissions = JSON.parse(localStorage.getItem('axyra_permissions') || '[]');
      this.sessions = JSON.parse(localStorage.getItem('axyra_sessions') || '[]');
      this.auditLog = JSON.parse(localStorage.getItem('axyra_audit_log') || '[]');
    } catch (error) {
      console.error('Error cargando datos de usuarios:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_users', JSON.stringify(this.users));
      localStorage.setItem('axyra_roles', JSON.stringify(this.roles));
      localStorage.setItem('axyra_permissions', JSON.stringify(this.permissions));
      localStorage.setItem('axyra_sessions', JSON.stringify(this.sessions));
      localStorage.setItem('axyra_audit_log', JSON.stringify(this.auditLog));
    } catch (error) {
      console.error('Error guardando datos de usuarios:', error);
    }
  }

  setupDefaultRoles() {
    if (this.roles.length === 0) {
      this.roles = [
        {
          id: 'admin',
          name: 'Administrador',
          description: 'Acceso completo al sistema',
          level: 100,
          permissions: ['*'],
          color: '#e74c3c',
          icon: '👑',
          createdAt: new Date().toISOString()
        },
        {
          id: 'manager',
          name: 'Gerente',
          description: 'Gestión de equipos y proyectos',
          level: 80,
          permissions: [
            'users.view', 'users.edit',
            'employees.*', 'hours.*', 'payroll.*',
            'reports.*', 'dashboard.*'
          ],
          color: '#3498db',
          icon: '👔',
          createdAt: new Date().toISOString()
        },
        {
          id: 'supervisor',
          name: 'Supervisor',
          description: 'Supervisión de empleados y procesos',
          level: 60,
          permissions: [
            'employees.view', 'employees.edit',
            'hours.view', 'hours.edit',
            'reports.view', 'dashboard.view'
          ],
          color: '#f39c12',
          icon: '👨‍💼',
          createdAt: new Date().toISOString()
        },
        {
          id: 'employee',
          name: 'Empleado',
          description: 'Acceso básico del empleado',
          level: 40,
          permissions: [
            'employees.view.own',
            'hours.view.own', 'hours.edit.own',
            'dashboard.view'
          ],
          color: '#27ae60',
          icon: '👤',
          createdAt: new Date().toISOString()
        },
        {
          id: 'accountant',
          name: 'Contador',
          description: 'Gestión financiera y contable',
          level: 70,
          permissions: [
            'payroll.*', 'reports.*',
            'employees.view', 'hours.view',
            'dashboard.view'
          ],
          color: '#9b59b6',
          icon: '🧮',
          createdAt: new Date().toISOString()
        }
      ];
      
      this.saveData();
    }
  }

  setupDefaultPermissions() {
    if (this.permissions.length === 0) {
      this.permissions = [
        // Usuarios
        { id: 'users.view', name: 'Ver Usuarios', description: 'Ver lista de usuarios', category: 'users' },
        { id: 'users.create', name: 'Crear Usuarios', description: 'Crear nuevos usuarios', category: 'users' },
        { id: 'users.edit', name: 'Editar Usuarios', description: 'Editar usuarios existentes', category: 'users' },
        { id: 'users.delete', name: 'Eliminar Usuarios', description: 'Eliminar usuarios', category: 'users' },
        { id: 'users.manage_roles', name: 'Gestionar Roles', description: 'Asignar y modificar roles', category: 'users' },
        
        // Empleados
        { id: 'employees.view', name: 'Ver Empleados', description: 'Ver lista de empleados', category: 'employees' },
        { id: 'employees.create', name: 'Crear Empleados', description: 'Crear nuevos empleados', category: 'employees' },
        { id: 'employees.edit', name: 'Editar Empleados', description: 'Editar empleados existentes', category: 'employees' },
        { id: 'employees.delete', name: 'Eliminar Empleados', description: 'Eliminar empleados', category: 'employees' },
        { id: 'employees.view.own', name: 'Ver Propios Datos', description: 'Ver solo sus propios datos', category: 'employees' },
        
        // Horas
        { id: 'hours.view', name: 'Ver Horas', description: 'Ver registros de horas', category: 'hours' },
        { id: 'hours.create', name: 'Registrar Horas', description: 'Registrar horas trabajadas', category: 'hours' },
        { id: 'hours.edit', name: 'Editar Horas', description: 'Editar registros de horas', category: 'hours' },
        { id: 'hours.delete', name: 'Eliminar Horas', description: 'Eliminar registros de horas', category: 'hours' },
        { id: 'hours.view.own', name: 'Ver Propias Horas', description: 'Ver solo sus propias horas', category: 'hours' },
        { id: 'hours.edit.own', name: 'Editar Propias Horas', description: 'Editar solo sus propias horas', category: 'hours' },
        
        // Nómina
        { id: 'payroll.view', name: 'Ver Nómina', description: 'Ver registros de nómina', category: 'payroll' },
        { id: 'payroll.create', name: 'Generar Nómina', description: 'Generar nómina', category: 'payroll' },
        { id: 'payroll.edit', name: 'Editar Nómina', description: 'Editar registros de nómina', category: 'payroll' },
        { id: 'payroll.delete', name: 'Eliminar Nómina', description: 'Eliminar registros de nómina', category: 'payroll' },
        
        // Inventario
        { id: 'inventory.view', name: 'Ver Inventario', description: 'Ver inventario', category: 'inventory' },
        { id: 'inventory.create', name: 'Crear Productos', description: 'Crear productos', category: 'inventory' },
        { id: 'inventory.edit', name: 'Editar Inventario', description: 'Editar inventario', category: 'inventory' },
        { id: 'inventory.delete', name: 'Eliminar Productos', description: 'Eliminar productos', category: 'inventory' },
        
        // Reportes
        { id: 'reports.view', name: 'Ver Reportes', description: 'Ver reportes', category: 'reports' },
        { id: 'reports.create', name: 'Crear Reportes', description: 'Crear reportes', category: 'reports' },
        { id: 'reports.export', name: 'Exportar Reportes', description: 'Exportar reportes', category: 'reports' },
        
        // Dashboard
        { id: 'dashboard.view', name: 'Ver Dashboard', description: 'Ver dashboard', category: 'dashboard' },
        { id: 'dashboard.customize', name: 'Personalizar Dashboard', description: 'Personalizar dashboard', category: 'dashboard' },
        
        // Configuración
        { id: 'config.view', name: 'Ver Configuración', description: 'Ver configuración', category: 'config' },
        { id: 'config.edit', name: 'Editar Configuración', description: 'Editar configuración', category: 'config' },
        
        // Sistema
        { id: 'system.admin', name: 'Administrar Sistema', description: 'Administrar sistema', category: 'system' },
        { id: 'system.backup', name: 'Gestionar Backups', description: 'Gestionar backups', category: 'system' },
        { id: 'system.audit', name: 'Ver Auditoría', description: 'Ver logs de auditoría', category: 'system' }
      ];
      
      this.saveData();
    }
  }

  setupSessionManagement() {
    // Limpiar sesiones expiradas cada 5 minutos
    setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000);
  }

  setupAuditLogging() {
    // Configurar logging de auditoría
    this.auditLog = this.auditLog || [];
  }

  createUser(userData) {
    const user = {
      id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: this.hashPassword(userData.password),
      role: userData.role || 'employee',
      status: 'active',
      avatar: userData.avatar || null,
      phone: userData.phone || null,
      department: userData.department || null,
      position: userData.position || null,
      hireDate: userData.hireDate || new Date().toISOString().split('T')[0],
      lastLogin: null,
      loginAttempts: 0,
      lockedUntil: null,
      preferences: {
        theme: 'light',
        language: 'es',
        notifications: true,
        emailNotifications: true,
        smsNotifications: false
      },
      permissions: this.getRolePermissions(userData.role || 'employee'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };
    
    this.users.push(user);
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('USER_CREATED', `Usuario creado: ${user.username}`, {
      userId: user.id,
      username: user.username,
      role: user.role
    });
    
    console.log('✅ Usuario creado:', user.username);
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Usuario creado: ${user.username}`);
    }
    
    return user;
  }

  updateUser(userId, updates) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    const oldUser = { ...this.users[userIndex] };
    this.users[userIndex] = { 
      ...this.users[userIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    
    // Actualizar permisos si cambió el rol
    if (updates.role && updates.role !== oldUser.role) {
      this.users[userIndex].permissions = this.getRolePermissions(updates.role);
    }
    
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('USER_UPDATED', `Usuario actualizado: ${this.users[userIndex].username}`, {
      userId: userId,
      changes: Object.keys(updates)
    });
    
    console.log('✅ Usuario actualizado:', this.users[userIndex].username);
    
    return this.users[userIndex];
  }

  deleteUser(userId) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('Usuario no encontrado');
    }
    
    const user = this.users[userIndex];
    this.users.splice(userIndex, 1);
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('USER_DELETED', `Usuario eliminado: ${user.username}`, {
      userId: userId,
      username: user.username
    });
    
    console.log('🗑️ Usuario eliminado:', user.username);
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showWarning(`Usuario eliminado: ${user.username}`);
    }
    
    return user;
  }

  authenticateUser(username, password) {
    const user = this.users.find(u => 
      (u.username === username || u.email === username) && u.status === 'active'
    );
    
    if (!user) {
      this.logAuditEvent('LOGIN_FAILED', `Intento de login fallido: ${username}`, {
        username: username,
        reason: 'Usuario no encontrado'
      });
      throw new Error('Credenciales inválidas');
    }
    
    // Verificar si la cuenta está bloqueada
    if (user.lockedUntil && new Date() < new Date(user.lockedUntil)) {
      this.logAuditEvent('LOGIN_BLOCKED', `Intento de login bloqueado: ${username}`, {
        username: username,
        reason: 'Cuenta bloqueada'
      });
      throw new Error('Cuenta bloqueada temporalmente');
    }
    
    // Verificar contraseña
    if (!this.verifyPassword(password, user.password)) {
      user.loginAttempts++;
      
      // Bloquear cuenta después de 5 intentos fallidos
      if (user.loginAttempts >= 5) {
        user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutos
        this.logAuditEvent('ACCOUNT_LOCKED', `Cuenta bloqueada: ${username}`, {
          username: username,
          reason: 'Múltiples intentos fallidos'
        });
      }
      
      this.saveData();
      
      this.logAuditEvent('LOGIN_FAILED', `Intento de login fallido: ${username}`, {
        username: username,
        reason: 'Contraseña incorrecta',
        attempts: user.loginAttempts
      });
      
      throw new Error('Credenciales inválidas');
    }
    
    // Login exitoso
    user.loginAttempts = 0;
    user.lockedUntil = null;
    user.lastLogin = new Date().toISOString();
    
    // Crear sesión
    const session = this.createSession(user);
    
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('LOGIN_SUCCESS', `Login exitoso: ${username}`, {
      userId: user.id,
      username: username,
      sessionId: session.id
    });
    
    console.log('✅ Login exitoso:', username);
    
    return { user, session };
  }

  createSession(user) {
    const session = {
      id: 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      userId: user.id,
      username: user.username,
      role: user.role,
      permissions: user.permissions,
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutos
    };
    
    this.sessions.push(session);
    this.saveData();
    
    return session;
  }

  logoutUser(sessionId) {
    const sessionIndex = this.sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) {
      throw new Error('Sesión no encontrada');
    }
    
    const session = this.sessions[sessionIndex];
    this.sessions.splice(sessionIndex, 1);
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('LOGOUT', `Logout: ${session.username}`, {
      userId: session.userId,
      username: session.username,
      sessionId: sessionId
    });
    
    console.log('👋 Logout:', session.username);
    
    return session;
  }

  getCurrentUser() {
    const sessionId = sessionStorage.getItem('axyra_session_id');
    if (!sessionId) return null;
    
    const session = this.sessions.find(s => s.id === sessionId);
    if (!session) return null;
    
    // Verificar si la sesión ha expirado
    if (new Date() > new Date(session.expiresAt)) {
      this.logoutUser(sessionId);
      return null;
    }
    
    // Actualizar última actividad
    session.lastActivity = new Date().toISOString();
    this.saveData();
    
    return this.users.find(u => u.id === session.userId);
  }

  getCurrentSession() {
    const sessionId = sessionStorage.getItem('axyra_session_id');
    if (!sessionId) return null;
    
    return this.sessions.find(s => s.id === sessionId);
  }

  hasPermission(permission) {
    const session = this.getCurrentSession();
    if (!session) return false;
    
    // Administradores tienen todos los permisos
    if (session.permissions.includes('*')) return true;
    
    // Verificar permiso específico
    return session.permissions.includes(permission);
  }

  hasRole(role) {
    const session = this.getCurrentSession();
    if (!session) return false;
    
    return session.role === role;
  }

  hasAnyRole(roles) {
    const session = this.getCurrentSession();
    if (!session) return false;
    
    return roles.includes(session.role);
  }

  getRolePermissions(roleId) {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) return [];
    
    return role.permissions;
  }

  createRole(roleData) {
    const role = {
      id: roleData.id || 'role_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: roleData.name,
      description: roleData.description,
      level: roleData.level || 50,
      permissions: roleData.permissions || [],
      color: roleData.color || '#3498db',
      icon: roleData.icon || '👤',
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };
    
    this.roles.push(role);
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('ROLE_CREATED', `Rol creado: ${role.name}`, {
      roleId: role.id,
      roleName: role.name
    });
    
    console.log('✅ Rol creado:', role.name);
    
    return role;
  }

  updateRole(roleId, updates) {
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    if (roleIndex === -1) {
      throw new Error('Rol no encontrado');
    }
    
    this.roles[roleIndex] = { ...this.roles[roleIndex], ...updates };
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('ROLE_UPDATED', `Rol actualizado: ${this.roles[roleIndex].name}`, {
      roleId: roleId,
      changes: Object.keys(updates)
    });
    
    console.log('✅ Rol actualizado:', this.roles[roleIndex].name);
    
    return this.roles[roleIndex];
  }

  deleteRole(roleId) {
    const roleIndex = this.roles.findIndex(r => r.id === roleId);
    if (roleIndex === -1) {
      throw new Error('Rol no encontrado');
    }
    
    // Verificar si hay usuarios con este rol
    const usersWithRole = this.users.filter(u => u.role === roleId);
    if (usersWithRole.length > 0) {
      throw new Error('No se puede eliminar un rol que está asignado a usuarios');
    }
    
    const role = this.roles[roleIndex];
    this.roles.splice(roleIndex, 1);
    this.saveData();
    
    // Log de auditoría
    this.logAuditEvent('ROLE_DELETED', `Rol eliminado: ${role.name}`, {
      roleId: roleId,
      roleName: role.name
    });
    
    console.log('🗑️ Rol eliminado:', role.name);
    
    return role;
  }

  hashPassword(password) {
    // Simulación de hash de contraseña (en un entorno real usaría bcrypt o similar)
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a 32-bit integer
    }
    return hash.toString(16);
  }

  verifyPassword(password, hash) {
    return this.hashPassword(password) === hash;
  }

  getClientIP() {
    // Simulación de IP del cliente
    return '192.168.1.100';
  }

  cleanupExpiredSessions() {
    const now = new Date();
    const expiredSessions = this.sessions.filter(s => new Date(s.expiresAt) < now);
    
    expiredSessions.forEach(session => {
      this.logoutUser(session.id);
    });
    
    if (expiredSessions.length > 0) {
      console.log(`🧹 ${expiredSessions.length} sesiones expiradas limpiadas`);
    }
  }

  logAuditEvent(eventType, description, details = {}) {
    const event = {
      id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: eventType,
      description: description,
      details: details,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUser()?.id || 'system',
      username: this.getCurrentUser()?.username || 'system',
      ipAddress: this.getClientIP(),
      userAgent: navigator.userAgent
    };
    
    this.auditLog.push(event);
    
    // Limitar tamaño del log
    if (this.auditLog.length > 1000) {
      this.auditLog = this.auditLog.slice(-500);
    }
    
    this.saveData();
  }

  getUsers(filters = {}) {
    let filteredUsers = [...this.users];
    
    if (filters.role) {
      filteredUsers = filteredUsers.filter(u => u.role === filters.role);
    }
    
    if (filters.status) {
      filteredUsers = filteredUsers.filter(u => u.status === filters.status);
    }
    
    if (filters.department) {
      filteredUsers = filteredUsers.filter(u => u.department === filters.department);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(u => 
        u.username.toLowerCase().includes(searchTerm) ||
        u.email.toLowerCase().includes(searchTerm) ||
        u.firstName.toLowerCase().includes(searchTerm) ||
        u.lastName.toLowerCase().includes(searchTerm)
      );
    }
    
    return filteredUsers;
  }

  getRoles() {
    return [...this.roles];
  }

  getPermissions() {
    return [...this.permissions];
  }

  getActiveSessions() {
    const now = new Date();
    return this.sessions.filter(s => new Date(s.expiresAt) > now);
  }

  getAuditLog(filters = {}) {
    let filteredLog = [...this.auditLog];
    
    if (filters.eventType) {
      filteredLog = filteredLog.filter(event => event.type === filters.eventType);
    }
    
    if (filters.userId) {
      filteredLog = filteredLog.filter(event => event.userId === filters.userId);
    }
    
    if (filters.dateFrom) {
      filteredLog = filteredLog.filter(event => 
        new Date(event.timestamp) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filteredLog = filteredLog.filter(event => 
        new Date(event.timestamp) <= new Date(filters.dateTo)
      );
    }
    
    return filteredLog.slice(-filters.limit || 100);
  }

  getUserStatistics() {
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.status === 'active').length;
    const inactiveUsers = this.users.filter(u => u.status === 'inactive').length;
    const lockedUsers = this.users.filter(u => u.lockedUntil && new Date() < new Date(u.lockedUntil)).length;
    
    const roleDistribution = {};
    this.users.forEach(user => {
      roleDistribution[user.role] = (roleDistribution[user.role] || 0) + 1;
    });
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      locked: lockedUsers,
      roleDistribution: roleDistribution,
      activeSessions: this.getActiveSessions().length
    };
  }

  exportUsers(format = 'json') {
    const data = {
      users: this.users,
      roles: this.roles,
      permissions: this.permissions,
      exportDate: new Date().toISOString()
    };
    
    let content;
    let filename;
    let mimeType;
    
    switch (format) {
      case 'csv':
        content = this.convertUsersToCSV();
        filename = 'axyra-users.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-users.json';
        mimeType = 'application/json';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('📊 Usuarios exportados');
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Usuarios exportados');
    }
  }

  convertUsersToCSV() {
    const rows = [];
    
    // Encabezados
    rows.push(['ID', 'Usuario', 'Email', 'Nombre', 'Apellido', 'Rol', 'Estado', 'Departamento', 'Creado']);
    
    // Datos
    this.users.forEach(user => {
      rows.push([
        user.id,
        user.username,
        user.email,
        user.firstName,
        user.lastName,
        user.role,
        user.status,
        user.department || '',
        new Date(user.createdAt).toLocaleDateString()
      ]);
    });
    
    return rows.map(row => row.join(',')).join('\n');
  }

  importUsers(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.users) {
            this.users = [...this.users, ...data.users];
          }
          
          if (data.roles) {
            this.roles = [...this.roles, ...data.roles];
          }
          
          if (data.permissions) {
            this.permissions = [...this.permissions, ...data.permissions];
          }
          
          this.saveData();
          
          console.log('✅ Usuarios importados exitosamente');
          
          if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.showSuccess('Usuarios importados exitosamente');
          }
          
          resolve();
        } catch (error) {
          console.error('Error importando usuarios:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };
      
      reader.readAsText(file);
    });
  }
}

// Inicializar sistema de gestión de usuarios
let axyraAdvancedUserManagement;
document.addEventListener('DOMContentLoaded', () => {
  axyraAdvancedUserManagement = new AxyraAdvancedUserManagement();
  window.axyraAdvancedUserManagement = axyraAdvancedUserManagement;
});

// Exportar para uso global
window.AxyraAdvancedUserManagement = AxyraAdvancedUserManagement;
