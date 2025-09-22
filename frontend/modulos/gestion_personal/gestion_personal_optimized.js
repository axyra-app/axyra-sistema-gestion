// ========================================
// MÓDULO DE GESTIÓN DE PERSONAL OPTIMIZADO PARA PRODUCCIÓN
// ========================================

class GestionPersonalOptimized {
  constructor() {
    this.empleados = [];
    this.horas = [];
    this.departamentos = [];
    this.empleadoSeleccionado = null;
    this.horasSeleccionadas = null;
    this.currentTab = 'horas';
    this.isOnline = navigator.onLine;
    this.pendingSync = [];
    this.retryAttempts = 3;
    this.retryDelay = 1000;

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Gestión de Personal Optimizada...');

      // Configurar listeners de conectividad
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Inicializar sistemas de apoyo
      if (typeof FirebaseSyncManager !== 'undefined') {
        this.firebaseSyncManager = new FirebaseSyncManager();
        await this.firebaseSyncManager.init();
      }

      if (typeof ColombianLaborLawCalculator !== 'undefined') {
        this.colombianLaborLawCalculator = new ColombianLaborLawCalculator();
      }

      if (typeof ComprobantePDFGenerator !== 'undefined') {
        this.comprobantePDFGenerator = new ComprobantePDFGenerator();
        await this.comprobantePDFGenerator.init();
      }

      // Cargar datos
      await this.cargarDatos();

      // Configurar eventos
      this.configurarEventos();

      // Actualizar estadísticas
      this.actualizarEstadisticas();

      console.log('✅ Gestión de Personal Optimizada inicializada correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar Gestión de Personal:', error);
      this.mostrarNotificacion('Error al inicializar el sistema', 'error');
    }
  }

  // ========================================
  // MANEJO DE CONECTIVIDAD
  // ========================================

  handleOnline() {
    this.isOnline = true;
    console.log('🌐 Conexión restaurada, sincronizando datos...');
    this.syncPendingData();
  }

  handleOffline() {
    this.isOnline = false;
    console.log('📡 Conexión perdida, trabajando en modo offline...');
  }

  // ========================================
  // CARGA DE DATOS OPTIMIZADA
  // ========================================

  async cargarDatos() {
    try {
      if (this.firebaseSyncManager && this.isOnline) {
        // Cargar desde Firebase con fallback a localStorage
        this.empleados = await this.firebaseSyncManager.getEmpleados();
        this.horas = await this.firebaseSyncManager.getHoras();
        this.departamentos = await this.firebaseSyncManager.getDepartamentos();
      } else {
        // Cargar desde localStorage
        this.empleados = this.loadFromStorage('axyra_empleados') || [];
        this.horas = this.loadFromStorage('axyra_horas') || [];
        this.departamentos = this.loadFromStorage('axyra_departamentos') || [];
      }

      // Renderizar datos
      this.llenarSelectorEmpleados();
      this.llenarSelectorDepartamentos();
      this.renderizarEmpleados();
      this.renderizarHoras();
      this.renderizarDepartamentos();
      this.actualizarEstadisticas();

      console.log('✅ Datos cargados correctamente:', {
        empleados: this.empleados.length,
        horas: this.horas.length,
        departamentos: this.departamentos.length,
      });
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
      this.mostrarNotificacion('Error al cargar datos del sistema', 'error');
    }
  }

  // ========================================
  // GESTIÓN DE EMPLEADOS OPTIMIZADA
  // ========================================

  async guardarEmpleado(empleadoData) {
    try {
      // Validar datos
      const validation = this.validarEmpleado(empleadoData);
      if (!validation.valid) {
        this.mostrarNotificacion(validation.message, 'error');
        return false;
      }

      // Verificar cédula duplicada
      const cedulaExistente = this.empleados.find(
        (emp) => emp.cedula === empleadoData.cedula && emp.id !== empleadoData.id
      );
      if (cedulaExistente) {
        this.mostrarNotificacion('Ya existe un empleado con esta cédula', 'error');
        return false;
      }

      // Preparar datos del empleado
      const empleado = {
        id: empleadoData.id || this.generateId(),
        ...empleadoData,
        companyId: this.getCompanyId(),
        userId: this.getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estado: empleadoData.estado || 'activo',
      };

      // Guardar en Firebase o localStorage
      if (this.firebaseSyncManager && this.isOnline) {
        await this.firebaseSyncManager.saveEmpleado(empleado);
      } else {
        this.saveToStorage('axyra_empleados', empleado);
        this.pendingSync.push({ type: 'empleado', data: empleado, action: 'save' });
      }

      // Actualizar lista local
      const index = this.empleados.findIndex((emp) => emp.id === empleado.id);
      if (index >= 0) {
        this.empleados[index] = empleado;
      } else {
        this.empleados.push(empleado);
      }

      this.mostrarNotificacion('Empleado guardado correctamente', 'success');
      this.renderizarEmpleados();
      this.actualizarEstadisticas();

      return true;
    } catch (error) {
      console.error('❌ Error al guardar empleado:', error);
      this.mostrarNotificacion('Error al guardar empleado', 'error');
      return false;
    }
  }

  async eliminarEmpleado(empleadoId) {
    try {
      if (!confirm('¿Está seguro de que desea eliminar este empleado?')) {
        return false;
      }

      // Verificar si tiene horas registradas
      const horasEmpleado = this.horas.filter((h) => h.empleado_id === empleadoId);
      if (horasEmpleado.length > 0) {
        this.mostrarNotificacion('No se puede eliminar el empleado porque tiene horas registradas', 'warning');
        return false;
      }

      // Eliminar de Firebase o localStorage
      if (this.firebaseSyncManager && this.isOnline) {
        await this.firebaseSyncManager.deleteEmpleado(empleadoId);
      } else {
        this.deleteFromStorage('axyra_empleados', empleadoId);
        this.pendingSync.push({ type: 'empleado', data: { id: empleadoId }, action: 'delete' });
      }

      // Actualizar lista local
      this.empleados = this.empleados.filter((emp) => emp.id !== empleadoId);

      this.mostrarNotificacion('Empleado eliminado correctamente', 'success');
      this.renderizarEmpleados();
      this.actualizarEstadisticas();

      return true;
    } catch (error) {
      console.error('❌ Error al eliminar empleado:', error);
      this.mostrarNotificacion('Error al eliminar empleado', 'error');
      return false;
    }
  }

  // ========================================
  // GESTIÓN DE HORAS OPTIMIZADA
  // ========================================

  async registrarHoras(horasData) {
    try {
      // Validar datos
      const validation = this.validarHoras(horasData);
      if (!validation.valid) {
        this.mostrarNotificacion(validation.message, 'error');
        return false;
      }

      // Calcular salarios si está disponible el calculador
      let salariosCalculados = {};
      if (this.colombianLaborLawCalculator) {
        const empleado = this.empleados.find((emp) => emp.id === horasData.empleado_id);
        if (empleado) {
          salariosCalculados = this.colombianLaborLawCalculator.calcularSalariosCompletos(empleado, horasData.horas);
        }
      }

      // Preparar datos de horas
      const registroHoras = {
        id: this.generateId(),
        ...horasData,
        companyId: this.getCompanyId(),
        userId: this.getCurrentUserId(),
        salarios: salariosCalculados,
        totalHoras: this.calcularTotalHoras(horasData.horas),
        totalSalario: salariosCalculados.total || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en Firebase o localStorage
      if (this.firebaseSyncManager && this.isOnline) {
        await this.firebaseSyncManager.saveHoras(registroHoras);
      } else {
        this.saveToStorage('axyra_horas', registroHoras);
        this.pendingSync.push({ type: 'horas', data: registroHoras, action: 'save' });
      }

      // Actualizar lista local
      this.horas.push(registroHoras);

      this.mostrarNotificacion('Horas registradas correctamente', 'success');
      this.renderizarHoras();
      this.actualizarEstadisticas();

      return true;
    } catch (error) {
      console.error('❌ Error al registrar horas:', error);
      this.mostrarNotificacion('Error al registrar horas', 'error');
      return false;
    }
  }

  // ========================================
  // GESTIÓN DE DEPARTAMENTOS
  // ========================================

  async guardarDepartamento(departamentoData) {
    try {
      // Validar datos
      if (!departamentoData.nombre || departamentoData.nombre.trim() === '') {
        this.mostrarNotificacion('El nombre del departamento es obligatorio', 'error');
        return false;
      }

      // Verificar nombre duplicado
      const nombreExistente = this.departamentos.find(
        (dept) => dept.nombre === departamentoData.nombre && dept.id !== departamentoData.id
      );
      if (nombreExistente) {
        this.mostrarNotificacion('Ya existe un departamento con este nombre', 'error');
        return false;
      }

      // Preparar datos del departamento
      const departamento = {
        id: departamentoData.id || this.generateId(),
        ...departamentoData,
        companyId: this.getCompanyId(),
        userId: this.getCurrentUserId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Guardar en Firebase o localStorage
      if (this.firebaseSyncManager && this.isOnline) {
        await this.firebaseSyncManager.saveDepartamento(departamento);
      } else {
        this.saveToStorage('axyra_departamentos', departamento);
        this.pendingSync.push({ type: 'departamento', data: departamento, action: 'save' });
      }

      // Actualizar lista local
      const index = this.departamentos.findIndex((dept) => dept.id === departamento.id);
      if (index >= 0) {
        this.departamentos[index] = departamento;
      } else {
        this.departamentos.push(departamento);
      }

      this.mostrarNotificacion('Departamento guardado correctamente', 'success');
      this.renderizarDepartamentos();
      this.llenarSelectorDepartamentos();

      return true;
    } catch (error) {
      console.error('❌ Error al guardar departamento:', error);
      this.mostrarNotificacion('Error al guardar departamento', 'error');
      return false;
    }
  }

  // ========================================
  // VALIDACIONES
  // ========================================

  validarEmpleado(empleado) {
    if (!empleado.nombre || empleado.nombre.trim() === '') {
      return { valid: false, message: 'El nombre es obligatorio' };
    }
    if (!empleado.cedula || empleado.cedula.trim() === '') {
      return { valid: false, message: 'La cédula es obligatoria' };
    }
    if (!empleado.cargo || empleado.cargo.trim() === '') {
      return { valid: false, message: 'El cargo es obligatorio' };
    }
    if (!empleado.salario || empleado.salario <= 0) {
      return { valid: false, message: 'El salario debe ser mayor a 0' };
    }
    if (!/^[0-9]{6,12}$/.test(empleado.cedula)) {
      return { valid: false, message: 'La cédula debe contener entre 6 y 12 dígitos' };
    }
    return { valid: true };
  }

  validarHoras(horasData) {
    if (!horasData.empleado_id) {
      return { valid: false, message: 'Debe seleccionar un empleado' };
    }
    if (!horasData.fecha) {
      return { valid: false, message: 'La fecha es obligatoria' };
    }
    if (!horasData.horas || Object.keys(horasData.horas).length === 0) {
      return { valid: false, message: 'Debe ingresar al menos una hora' };
    }
    return { valid: true };
  }

  // ========================================
  // UTILIDADES
  // ========================================

  generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  getCompanyId() {
    return localStorage.getItem('axyra_company_id') || 'default_company';
  }

  getCurrentUserId() {
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    }
    return localStorage.getItem('currentUserId') || 'default_user';
  }

  calcularTotalHoras(horas) {
    return Object.values(horas).reduce((total, horas) => total + (parseFloat(horas) || 0), 0);
  }

  // ========================================
  // MANEJO DE ALMACENAMIENTO
  // ========================================

  loadFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error cargando desde localStorage:', error);
      return [];
    }
  }

  saveToStorage(key, item) {
    try {
      const data = this.loadFromStorage(key);
      const index = data.findIndex((item) => item.id === item.id);
      if (index >= 0) {
        data[index] = item;
      } else {
        data.push(item);
      }
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
    }
  }

  deleteFromStorage(key, id) {
    try {
      const data = this.loadFromStorage(key);
      const filteredData = data.filter((item) => item.id !== id);
      localStorage.setItem(key, JSON.stringify(filteredData));
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
    }
  }

  // ========================================
  // SINCRONIZACIÓN PENDIENTE
  // ========================================

  async syncPendingData() {
    if (!this.isOnline || !this.firebaseSyncManager) return;

    try {
      for (const pending of this.pendingSync) {
        switch (pending.type) {
          case 'empleado':
            if (pending.action === 'save') {
              await this.firebaseSyncManager.saveEmpleado(pending.data);
            } else if (pending.action === 'delete') {
              await this.firebaseSyncManager.deleteEmpleado(pending.data.id);
            }
            break;
          case 'horas':
            if (pending.action === 'save') {
              await this.firebaseSyncManager.saveHoras(pending.data);
            }
            break;
          case 'departamento':
            if (pending.action === 'save') {
              await this.firebaseSyncManager.saveDepartamento(pending.data);
            }
            break;
        }
      }

      this.pendingSync = [];
      console.log('✅ Datos pendientes sincronizados');
    } catch (error) {
      console.error('❌ Error sincronizando datos pendientes:', error);
    }
  }

  // ========================================
  // RENDERIZADO OPTIMIZADO
  // ========================================

  llenarSelectorEmpleados() {
    const selector = document.getElementById('empleadoHoras');
    if (!selector) return;

    selector.innerHTML = '<option value="">Seleccionar empleado</option>';
    this.empleados
      .filter((emp) => emp.estado === 'activo')
      .forEach((empleado) => {
        const option = document.createElement('option');
        option.value = empleado.id;
        option.textContent = `${empleado.nombre} - ${empleado.cargo}`;
        selector.appendChild(option);
      });
  }

  llenarSelectorDepartamentos() {
    const selectores = ['reporteDepartamento', 'nominaDepartamento', 'departamentoEmpleado'];
    selectores.forEach((id) => {
      const selector = document.getElementById(id);
      if (!selector) return;

      selector.innerHTML = '<option value="">Todos los Departamentos</option>';
      this.departamentos.forEach((departamento) => {
        const option = document.createElement('option');
        option.value = departamento.nombre;
        option.textContent = departamento.nombre;
        selector.appendChild(option);
      });
    });
  }

  renderizarEmpleados() {
    const container = document.getElementById('cuerpoEmpleados');
    if (!container) return;

    let html = '';
    this.empleados.forEach((empleado) => {
      html += `
        <tr>
          <td>${empleado.nombre}</td>
          <td>${empleado.cedula}</td>
          <td>${empleado.cargo}</td>
          <td>${empleado.departamento || 'Sin asignar'}</td>
          <td>$${(empleado.salario || 0).toLocaleString()}</td>
          <td>${empleado.tipoContrato || 'Indefinido'}</td>
          <td><span class="estado-badge ${empleado.estado}">${empleado.estado}</span></td>
          <td>
            <button class="btn btn-sm btn-outline-primary" onclick="gestionPersonal.mostrarModalEmpleado('${
              empleado.id
            }')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger" onclick="gestionPersonal.eliminarEmpleado('${empleado.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    });
    container.innerHTML = html;
  }

  renderizarHoras() {
    const container = document.getElementById('cuerpoHistorialHoras');
    if (!container) return;

    let html = '';
    this.horas.forEach((registro) => {
      const horas = registro.horas || {};
      html += `
        <tr>
          <td>${registro.fecha}</td>
          <td>${registro.empleadoNombre}</td>
          <td>${horas.ordinarias || 0}</td>
          <td>${horas.recargo_nocturno || 0}</td>
          <td>${horas.recargo_diurno_dominical || 0}</td>
          <td>${horas.recargo_nocturno_dominical || 0}</td>
          <td>${horas.hora_extra_diurna || 0}</td>
          <td>${horas.hora_extra_nocturna || 0}</td>
          <td>${horas.hora_diurna_dominical_o_festivo || 0}</td>
          <td>${horas.hora_extra_diurna_dominical_o_festivo || 0}</td>
          <td>${horas.hora_nocturna_dominical_o_festivo || 0}</td>
          <td>${horas.hora_extra_nocturna_dominical_o_festivo || 0}</td>
          <td>${registro.totalHoras || 0}</td>
          <td>$${(registro.totalSalario || 0).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-outline-info" onclick="gestionPersonal.verDetalleHoras('${registro.id}')">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        </tr>
      `;
    });
    container.innerHTML = html;
  }

  renderizarDepartamentos() {
    const container = document.getElementById('listaDepartamentos');
    if (!container) return;

    let html = '';
    this.departamentos.forEach((departamento) => {
      html += `
        <div class="departamento-item">
          <div class="departamento-header">
            <div class="departamento-color" style="background-color: ${departamento.color || '#007bff'}"></div>
            <div class="departamento-nombre">${departamento.nombre}</div>
          </div>
          <div class="departamento-descripcion">${departamento.descripcion || 'Sin descripción'}</div>
          <div class="departamento-actions">
            <button class="btn btn-small btn-danger" onclick="gestionPersonal.eliminarDepartamento('${
              departamento.id
            }')">
              <i class="fas fa-trash"></i> Eliminar
            </button>
          </div>
        </div>
      `;
    });
    container.innerHTML = html;
  }

  // ========================================
  // ESTADÍSTICAS OPTIMIZADAS
  // ========================================

  actualizarEstadisticas() {
    try {
      const totalEmpleados = this.empleados.length;
      const empleadosActivos = this.empleados.filter((emp) => emp.estado === 'activo').length;
      const mesActual = new Date().getMonth();
      const anioActual = new Date().getFullYear();

      const horasMes = this.horas
        .filter((hora) => {
          const fechaHora = new Date(hora.fecha);
          return fechaHora.getMonth() === mesActual && fechaHora.getFullYear() === anioActual;
        })
        .reduce((total, hora) => total + this.calcularTotalHoras(hora.horas), 0);

      let totalPagos = 0;
      this.empleados.forEach((empleado) => {
        if (empleado.estado === 'activo') {
          totalPagos += empleado.salario || 0;
        }
      });

      const promedioSalario = empleadosActivos > 0 ? totalPagos / empleadosActivos : 0;
      const promedioHoras = empleadosActivos > 0 ? horasMes / empleadosActivos : 0;

      const elementos = {
        totalEmpleados: totalEmpleados,
        horasMes: horasMes.toFixed(1),
        totalPagos: this.formatearMoneda(totalPagos),
        nominasGeneradas: this.calcularNominasGeneradas(),
        promedioHoras: promedioHoras.toFixed(1),
        promedioSalario: this.formatearMoneda(promedioSalario),
        empleadosActivos: empleadosActivos,
      };

      Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
          elemento.textContent = valor;
        }
      });

      console.log('✅ Estadísticas actualizadas:', elementos);
    } catch (error) {
      console.error('❌ Error al actualizar estadísticas:', error);
    }
  }

  formatearMoneda(valor) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  }

  calcularNominasGeneradas() {
    return this.empleados.filter((emp) => emp.estado === 'activo').length;
  }

  // ========================================
  // CONFIGURACIÓN DE EVENTOS
  // ========================================

  configurarEventos() {
    try {
      // Eventos de pestañas
      document.querySelectorAll('.gestion-personal-tab').forEach((tab) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const tabName = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
          this.cambiarTab(tabName);
        });
      });

      // Eventos de formularios
      const formEmpleado = document.getElementById('formEmpleado');
      if (formEmpleado) {
        formEmpleado.addEventListener('submit', (e) => this.manejarSubmitEmpleado(e));
      }

      const formDepartamento = document.getElementById('formDepartamento');
      if (formDepartamento) {
        formDepartamento.addEventListener('submit', (e) => this.manejarSubmitDepartamento(e));
      }

      const formHoras = document.getElementById('formRegistroHoras');
      if (formHoras) {
        formHoras.addEventListener('submit', (e) => this.manejarSubmitHoras(e));
      }

      // Eventos de botones
      this.configurarBotonesAccion();

      console.log('✅ Eventos configurados correctamente');
    } catch (error) {
      console.error('❌ Error al configurar eventos:', error);
    }
  }

  configurarBotonesAccion() {
    const btnRegistrarHoras = document.getElementById('btnRegistrarHoras');
    if (btnRegistrarHoras) {
      btnRegistrarHoras.addEventListener('click', () => this.registrarHoras());
    }

    const btnCalcularHoras = document.getElementById('btnCalcularHoras');
    if (btnCalcularHoras) {
      btnCalcularHoras.addEventListener('click', () => this.calcularHoras());
    }

    const btnGenerarComprobante = document.getElementById('btnGenerarComprobante');
    if (btnGenerarComprobante) {
      btnGenerarComprobante.addEventListener('click', () => this.generarComprobante());
    }

    const btnGenerarNomina = document.getElementById('btnGenerarNomina');
    if (btnGenerarNomina) {
      btnGenerarNomina.addEventListener('click', () => this.generarNomina());
    }
  }

  // ========================================
  // MANEJO DE FORMULARIOS
  // ========================================

  async manejarSubmitEmpleado(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const empleadoData = {
        id: formData.get('empleadoId') || this.generateId(),
        nombre: formData.get('nombre'),
        cedula: formData.get('cedula'),
        cargo: formData.get('cargo'),
        departamento: formData.get('departamento'),
        salario: parseFloat(formData.get('salario')),
        tipoContrato: formData.get('tipoContrato'),
        fechaContratacion: formData.get('fechaContratacion'),
        estado: formData.get('estado') || 'activo',
      };

      await this.guardarEmpleado(empleadoData);
      this.cerrarModalEmpleado();
    } catch (error) {
      console.error('❌ Error al manejar submit de empleado:', error);
      this.mostrarNotificacion('Error al procesar el formulario', 'error');
    }
  }

  async manejarSubmitDepartamento(e) {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const departamentoData = {
        id: formData.get('departamentoId') || this.generateId(),
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        color: formData.get('color') || '#007bff',
      };

      await this.guardarDepartamento(departamentoData);
      this.cerrarModalDepartamento();
    } catch (error) {
      console.error('❌ Error al manejar submit de departamento:', error);
      this.mostrarNotificacion('Error al procesar el formulario', 'error');
    }
  }

  async manejarSubmitHoras(e) {
    e.preventDefault();
    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      const fecha = document.getElementById('fechaHoras').value;

      if (!empleadoId || !fecha) {
        this.mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
        return;
      }

      const empleado = this.empleados.find((emp) => emp.id == empleadoId);
      if (!empleado) {
        this.mostrarNotificacion('Empleado no encontrado', 'error');
        return;
      }

      const horasData = {};
      const tiposHoras = [
        'ordinarias',
        'recargo_nocturno',
        'recargo_diurno_dominical',
        'recargo_nocturno_dominical',
        'hora_extra_diurna',
        'hora_extra_nocturna',
        'hora_diurna_dominical_o_festivo',
        'hora_extra_diurna_dominical_o_festivo',
        'hora_nocturna_dominical_o_festivo',
        'hora_extra_nocturna_dominical_o_festivo',
      ];

      tiposHoras.forEach((tipo) => {
        const input = document.getElementById(`horas_${tipo}`);
        if (input) {
          horasData[tipo] = parseFloat(input.value) || 0;
        }
      });

      const registroHoras = {
        empleado_id: empleadoId,
        empleadoNombre: empleado.nombre,
        fecha: fecha,
        horas: horasData,
      };

      await this.registrarHoras(registroHoras);
      this.limpiarFormularioHoras();
    } catch (error) {
      console.error('❌ Error al manejar submit de horas:', error);
      this.mostrarNotificacion('Error al procesar el formulario', 'error');
    }
  }

  // ========================================
  // FUNCIONES DE UTILIDAD
  // ========================================

  cambiarTab(tabName) {
    try {
      console.log(`🔄 Cambiando a pestaña: ${tabName}`);

      // Ocultar todos los contenidos
      document.querySelectorAll('.tab-content').forEach((content) => {
        content.style.display = 'none';
      });

      // Remover clase active de todas las pestañas
      document.querySelectorAll('.gestion-personal-tab').forEach((tab) => {
        tab.classList.remove('active');
      });

      // Mostrar contenido seleccionado
      const selectedContent = document.getElementById(`tab-${tabName}`);
      if (selectedContent) {
        selectedContent.style.display = 'block';
        console.log(`✅ Contenido de pestaña ${tabName} mostrado`);
      }

      // Activar pestaña seleccionada
      const selectedTab = document.querySelector(`[onclick*="cambiarTab('${tabName}')"]`);
      if (selectedTab) {
        selectedTab.classList.add('active');
        console.log(`✅ Pestaña ${tabName} activada`);
      }

      this.currentTab = tabName;
      this.actualizarDatosPestana(tabName);
    } catch (error) {
      console.error('❌ Error al cambiar pestaña:', error);
    }
  }

  actualizarDatosPestana(tabName) {
    try {
      switch (tabName) {
        case 'horas':
          break;
        case 'empleados':
          this.renderizarEmpleados();
          break;
        case 'nomina':
          break;
        case 'reportes':
          this.actualizarEstadisticas();
          break;
      }
    } catch (error) {
      console.error('❌ Error al actualizar datos de pestaña:', error);
    }
  }

  limpiarFormularioHoras() {
    const form = document.getElementById('formRegistroHoras');
    if (form) {
      form.reset();
    }
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    if (typeof mostrarNotificacionProfesional === 'function') {
      mostrarNotificacionProfesional(mensaje, tipo);
    } else if (typeof mostrarNotificacion === 'function') {
      mostrarNotificacion(mensaje, tipo);
    } else {
      alert(mensaje);
    }
  }

  // ========================================
  // FUNCIONES PÚBLICAS PARA COMPATIBILIDAD
  // ========================================

  mostrarModalEmpleado(empleadoId = null) {
    const modal = document.getElementById('modalEmpleado');
    if (!modal) return;

    const form = modal.querySelector('#formEmpleado');
    if (empleadoId) {
      const empleado = this.empleados.find((emp) => emp.id === empleadoId);
      if (empleado) {
        form.querySelector('[name="empleadoId"]').value = empleado.id;
        form.querySelector('[name="nombre"]').value = empleado.nombre;
        form.querySelector('[name="cedula"]').value = empleado.cedula;
        form.querySelector('[name="cargo"]').value = empleado.cargo;
        form.querySelector('[name="departamento"]').value = empleado.departamento;
        form.querySelector('[name="salario"]').value = empleado.salario;
        form.querySelector('[name="tipoContrato"]').value = empleado.tipoContrato;
        form.querySelector('[name="fechaContratacion"]').value = empleado.fechaContratacion;
        form.querySelector('[name="estado"]').value = empleado.estado;
      }
    } else {
      form.reset();
      form.querySelector('[name="empleadoId"]').value = '';
    }
    modal.style.display = 'block';
  }

  cerrarModalEmpleado() {
    const modal = document.getElementById('modalEmpleado');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  mostrarModalDepartamento(departamentoId = null) {
    const modal = document.getElementById('modalDepartamento');
    if (!modal) return;

    const form = modal.querySelector('#formDepartamento');
    if (departamentoId) {
      const departamento = this.departamentos.find((dept) => dept.id === departamentoId);
      if (departamento) {
        form.querySelector('[name="departamentoId"]').value = departamento.id;
        form.querySelector('[name="nombre"]').value = departamento.nombre;
        form.querySelector('[name="descripcion"]').value = departamento.descripcion;
        form.querySelector('[name="color"]').value = departamento.color;
      }
    } else {
      form.reset();
      form.querySelector('[name="departamentoId"]').value = '';
    }
    modal.style.display = 'block';
  }

  cerrarModalDepartamento() {
    const modal = document.getElementById('modalDepartamento');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // Funciones adicionales para compatibilidad
  calcularHoras() {
    // Implementar cálculo de horas
    console.log('Calculando horas...');
  }

  generarComprobante() {
    // Implementar generación de comprobante
    console.log('Generando comprobante...');
  }

  generarNomina() {
    // Implementar generación de nómina
    console.log('Generando nómina...');
  }

  verDetalleHoras(registroId) {
    // Implementar visualización de detalle
    console.log('Mostrando detalle de horas:', registroId);
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  try {
    window.gestionPersonal = new GestionPersonalOptimized();
    console.log('✅ Módulo de Gestión de Personal Optimizado cargado correctamente');
  } catch (error) {
    console.error('❌ Error al cargar módulo de Gestión de Personal:', error);
  }
});

// Exportar para uso global
window.GestionPersonalOptimized = GestionPersonalOptimized;
