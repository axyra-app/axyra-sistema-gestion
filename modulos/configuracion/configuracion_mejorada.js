/**
 * Sistema de Configuración Mejorado AXYRA
 * Versión: 2.0.0
 * Descripción: Sistema profesional de configuración con modales y organización mejorada
 */

class AxyraConfiguracionMejorada {
  constructor() {
    this.usuarios = [];
    this.configuracion = {};
    this.modales = {};
    this.init();
  }

  init() {
    console.log('🚀 Inicializando Sistema de Configuración Mejorada AXYRA...');
    this.cargarConfiguracion();
    this.setupEventListeners();
    this.setupNavegacion();
    this.cargarUsuarios();
    console.log('✅ Sistema de Configuración Mejorada AXYRA inicializado correctamente');
  }

  setupEventListeners() {
    try {
      // Navegación de secciones
      const navItems = document.querySelectorAll('.config-nav-item');
      navItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const section = item.getAttribute('data-section');
          this.mostrarSeccion(section);
        });
      });

      // Formularios
      const formEmpresa = document.getElementById('formEmpresa');
      if (formEmpresa) {
        formEmpresa.addEventListener('submit', (e) => {
          e.preventDefault();
          this.guardarConfiguracionEmpresa();
        });
      }

      const formSistema = document.getElementById('formSistema');
      if (formSistema) {
        formSistema.addEventListener('submit', (e) => {
          e.preventDefault();
          this.guardarConfiguracionSistema();
        });
      }

      // Toggles de notificaciones
      const toggles = document.querySelectorAll('.toggle-switch');
      toggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
          this.actualizarNotificacion(toggle);
        });
      });

      console.log('✅ Event listeners configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando event listeners:', error);
    }
  }

  setupNavegacion() {
    // Mostrar la primera sección por defecto
    this.mostrarSeccion('empresa');
  }

  mostrarSeccion(seccionId) {
    try {
      // Ocultar todas las secciones
      const secciones = document.querySelectorAll('.config-section');
      secciones.forEach((seccion) => {
        seccion.classList.remove('active');
      });

      // Desactivar todos los items de navegación
      const navItems = document.querySelectorAll('.config-nav-item');
      navItems.forEach((item) => {
        item.classList.remove('active');
      });

      // Mostrar la sección seleccionada
      const seccion = document.getElementById(`section-${seccionId}`);
      if (seccion) {
        seccion.classList.add('active');
      }

      // Activar el item de navegación correspondiente
      const navItem = document.querySelector(`[data-section="${seccionId}"]`);
      if (navItem) {
        navItem.classList.add('active');
      }

      // Cargar datos específicos de la sección
      this.cargarDatosSeccion(seccionId);

      console.log(`✅ Sección ${seccionId} mostrada correctamente`);
    } catch (error) {
      console.error(`❌ Error mostrando sección ${seccionId}:`, error);
    }
  }

  cargarDatosSeccion(seccionId) {
    switch (seccionId) {
      case 'usuarios':
        this.cargarUsuarios();
        break;
      case 'seguridad':
        this.cargarConfiguracionSeguridad();
        break;
      case 'notificaciones':
        this.cargarConfiguracionNotificaciones();
        break;
      case 'backup':
        this.cargarEstadoBackup();
        break;
      case 'sistema':
        this.cargarConfiguracionSistema();
        break;
    }
  }

  cargarConfiguracion() {
    try {
      // Cargar configuración desde localStorage
      const configGuardada = localStorage.getItem('axyra_configuracion');
      if (configGuardada) {
        this.configuracion = JSON.parse(configGuardada);
        this.aplicarConfiguracion();
      } else {
        this.configuracion = this.getConfiguracionDefault();
      }
      console.log('✅ Configuración cargada correctamente');
    } catch (error) {
      console.error('❌ Error cargando configuración:', error);
      this.configuracion = this.getConfiguracionDefault();
    }
  }

  getConfiguracionDefault() {
    return {
      empresa: {
        nombre: '',
        nit: '',
        direccion: '',
        telefono: '',
        email: '',
        web: '',
        descripcion: '',
      },
      sistema: {
        idioma: 'es',
        zonaHoraria: 'America/Bogota',
        formatoFecha: 'DD/MM/YYYY',
        formatoMoneda: 'COP',
        tema: 'light',
        actualizacionAutomatica: true,
      },
      notificaciones: {
        email: true,
        push: false,
        sonido: true,
      },
      seguridad: {
        politicasContrasena: {
          longitudMinima: 8,
          requiereMayusculas: true,
          requiereMinusculas: true,
          requiereNumeros: true,
          requiereSimbolos: false,
        },
        sesion: {
          tiempoExpiracion: 30, // minutos
          recordarSesion: true,
        },
        autenticacion: {
          dosFactores: false,
          intentosMaximos: 5,
        },
      },
    };
  }

  aplicarConfiguracion() {
    try {
      // Aplicar configuración de empresa
      if (this.configuracion.empresa) {
        Object.keys(this.configuracion.empresa).forEach((key) => {
          const input = document.getElementById(`${key}Empresa`);
          if (input) {
            input.value = this.configuracion.empresa[key] || '';
          }
        });
      }

      // Aplicar configuración del sistema
      if (this.configuracion.sistema) {
        Object.keys(this.configuracion.sistema).forEach((key) => {
          const input = document.getElementById(`${key}Sistema`);
          if (input) {
            input.value = this.configuracion.sistema[key] || '';
          }
        });
      }

      // Aplicar configuración de notificaciones
      if (this.configuracion.notificaciones) {
        const toggles = document.querySelectorAll('.toggle-switch');
        toggles.forEach((toggle, index) => {
          const keys = ['email', 'push', 'sonido'];
          if (keys[index] && this.configuracion.notificaciones[keys[index]]) {
            toggle.classList.add('active');
          }
        });
      }

      console.log('✅ Configuración aplicada correctamente');
    } catch (error) {
      console.error('❌ Error aplicando configuración:', error);
    }
  }

  guardarConfiguracionEmpresa() {
    try {
      const formData = new FormData(document.getElementById('formEmpresa'));
      const configuracionEmpresa = {
        nombre: document.getElementById('nombreEmpresa').value,
        nit: document.getElementById('nitEmpresa').value,
        direccion: document.getElementById('direccionEmpresa').value,
        telefono: document.getElementById('telefonoEmpresa').value,
        email: document.getElementById('emailEmpresa').value,
        web: document.getElementById('webEmpresa').value,
        descripcion: document.getElementById('descripcionEmpresa').value,
      };

      // Validar campos requeridos
      if (!configuracionEmpresa.nombre || !configuracionEmpresa.nit || !configuracionEmpresa.direccion) {
        this.mostrarNotificacion('Por favor complete todos los campos requeridos', 'error');
        return;
      }

      this.configuracion.empresa = configuracionEmpresa;
      this.guardarConfiguracion();
      this.mostrarNotificacion('Configuración de empresa guardada correctamente', 'success');
    } catch (error) {
      console.error('❌ Error guardando configuración de empresa:', error);
      this.mostrarNotificacion('Error guardando configuración', 'error');
    }
  }

  guardarConfiguracionSistema() {
    try {
      const configuracionSistema = {
        idioma: document.getElementById('idiomaSistema').value,
        zonaHoraria: document.getElementById('zonaHoraria').value,
        formatoFecha: document.getElementById('formatoFecha').value,
        formatoMoneda: document.getElementById('formatoMoneda').value,
        tema: document.getElementById('temaSistema').value,
        actualizacionAutomatica: document.getElementById('actualizacionAutomatica').value === 'true',
      };

      this.configuracion.sistema = configuracionSistema;
      this.guardarConfiguracion();
      this.mostrarNotificacion('Configuración del sistema guardada correctamente', 'success');
    } catch (error) {
      console.error('❌ Error guardando configuración del sistema:', error);
      this.mostrarNotificacion('Error guardando configuración', 'error');
    }
  }

  guardarConfiguracion() {
    try {
      localStorage.setItem('axyra_configuracion', JSON.stringify(this.configuracion));
      console.log('✅ Configuración guardada correctamente');
    } catch (error) {
      console.error('❌ Error guardando configuración:', error);
    }
  }

  cargarUsuarios() {
    try {
      const container = document.getElementById('usuariosContainer');
      if (!container) return;

      // Simular carga de usuarios (en producción vendría de Firebase)
      this.usuarios = [
        {
          id: 1,
          nombre: 'Juan Fernando',
          email: 'juanfernando10gamer@gmail.com',
          rol: 'admin',
          activo: true,
          ultimoAcceso: '2024-01-15 14:30',
        },
        {
          id: 2,
          nombre: 'María García',
          email: 'maria.garcia@empresa.com',
          rol: 'supervisor',
          activo: true,
          ultimoAcceso: '2024-01-15 13:45',
        },
        {
          id: 3,
          nombre: 'Carlos López',
          email: 'carlos.lopez@empresa.com',
          rol: 'empleado',
          activo: false,
          ultimoAcceso: '2024-01-14 16:20',
        },
      ];

      this.renderizarUsuarios();
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
      this.mostrarErrorUsuarios();
    }
  }

  renderizarUsuarios() {
    const container = document.getElementById('usuariosContainer');
    if (!container) return;

    if (this.usuarios.length === 0) {
      container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-users"></i>
                    <h3>No hay usuarios registrados</h3>
                    <p>Agregue el primer usuario del sistema</p>
                </div>
            `;
      return;
    }

    const usuariosHTML = this.usuarios
      .map(
        (usuario) => `
            <div class="usuario-card">
                <div class="usuario-header">
                    <div class="usuario-avatar">
                        ${usuario.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div class="usuario-info">
                        <h4>${usuario.nombre}</h4>
                        <p>${usuario.email}</p>
                    </div>
                </div>
                <div class="usuario-rol ${usuario.rol}">
                    ${usuario.rol.toUpperCase()}
                </div>
                <div class="usuario-actions">
                    <button class="btn btn-primary btn-sm" onclick="configuracion.editarUsuario(${usuario.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-warning btn-sm" onclick="configuracion.cambiarEstadoUsuario(${usuario.id})">
                        <i class="fas fa-${usuario.activo ? 'ban' : 'check'}"></i> 
                        ${usuario.activo ? 'Desactivar' : 'Activar'}
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="configuracion.eliminarUsuario(${usuario.id})">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `
      )
      .join('');

    container.innerHTML = usuariosHTML;
  }

  mostrarErrorUsuarios() {
    const container = document.getElementById('usuariosContainer');
    if (container) {
      container.innerHTML = `
                <div class="no-data">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Error cargando usuarios</h3>
                    <p>No se pudieron cargar los usuarios. Intente nuevamente.</p>
                </div>
            `;
    }
  }

  mostrarModalNuevoUsuario() {
    if (window.axyraModals) {
      window.axyraModals.showNuevoUsuarioModal();
    } else {
      this.mostrarNotificacion('Sistema de modales no disponible', 'error');
    }
  }

  editarUsuario(usuarioId) {
    const usuario = this.usuarios.find((u) => u.id === usuarioId);
    if (usuario && window.axyraModals) {
      window.axyraModals.showEditarUsuarioModal(usuario);
    }
  }

  cambiarEstadoUsuario(usuarioId) {
    const usuario = this.usuarios.find((u) => u.id === usuarioId);
    if (usuario) {
      usuario.activo = !usuario.activo;
      this.renderizarUsuarios();
      this.mostrarNotificacion(`Usuario ${usuario.activo ? 'activado' : 'desactivado'} correctamente`, 'success');
    }
  }

  eliminarUsuario(usuarioId) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
      this.usuarios = this.usuarios.filter((u) => u.id !== usuarioId);
      this.renderizarUsuarios();
      this.mostrarNotificacion('Usuario eliminado correctamente', 'success');
    }
  }

  cargarConfiguracionSeguridad() {
    // Implementar carga de configuración de seguridad
    console.log('🔒 Cargando configuración de seguridad...');
  }

  cargarConfiguracionNotificaciones() {
    // Implementar carga de configuración de notificaciones
    console.log('🔔 Cargando configuración de notificaciones...');
  }

  cargarEstadoBackup() {
    // Implementar carga del estado de backup
    console.log('💾 Cargando estado de backup...');
  }

  actualizarNotificacion(toggle) {
    try {
      const isActive = toggle.classList.contains('active');
      const notificationType = this.getNotificationType(toggle);

      if (notificationType) {
        this.configuracion.notificaciones[notificationType] = isActive;
        this.guardarConfiguracion();
        this.mostrarNotificacion(
          `Notificación ${notificationType} ${isActive ? 'habilitada' : 'deshabilitada'}`,
          'success'
        );
      }
    } catch (error) {
      console.error('❌ Error actualizando notificación:', error);
    }
  }

  getNotificationType(toggle) {
    const notificationItems = document.querySelectorAll('.notification-item');
    const toggleIndex = Array.from(notificationItems).findIndex(
      (item) => item.querySelector('.toggle-switch') === toggle
    );

    const types = ['email', 'push', 'sonido'];
    return types[toggleIndex];
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    try {
      if (window.axyraNotifications) {
        window.axyraNotifications.show(mensaje, tipo);
      } else {
        // Fallback simple
        const notification = document.createElement('div');
        notification.className = `notification notification-${tipo}`;
        notification.textContent = mensaje;
        notification.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 12px 20px;
                    border-radius: 8px;
                    color: white;
                    font-weight: 500;
                    z-index: 10000;
                    background: ${tipo === 'success' ? '#10b981' : tipo === 'error' ? '#ef4444' : '#4f81bd'};
                `;
        document.body.appendChild(notification);

        setTimeout(() => {
          notification.remove();
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Error mostrando notificación:', error);
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.configuracion = new AxyraConfiguracionMejorada();
});

// Exportar para uso global
window.AxyraConfiguracionMejorada = AxyraConfiguracionMejorada;
