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
      
      // Limpiar campos del formulario
      this.limpiarCamposHoras();

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
    if (!selector) {
      console.warn('Selector de empleados no encontrado');
      return;
    }

    selector.innerHTML = '<option value="">Seleccionar empleado</option>';
    
    if (!this.empleados || this.empleados.length === 0) {
      console.warn('No hay empleados para cargar en el selector');
      return;
    }

    this.empleados
      .filter((emp) => emp.estado !== 'inactivo') // Cambiar la condición
      .forEach((empleado) => {
        const option = document.createElement('option');
        option.value = empleado.id;
        option.textContent = `${empleado.nombre} ${empleado.apellido || ''} - ${empleado.cargo || 'Sin cargo'}`;
        selector.appendChild(option);
      });

    console.log(`✅ Selector de empleados llenado con ${this.empleados.length} empleados`);
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
    // Usar el sistema de notificaciones unificado si está disponible
    if (window.axyraErrorHandler) {
      window.axyraErrorHandler.showNotification('Gestión de Personal', mensaje, tipo);
      return;
    }

    // Fallback al sistema de notificaciones original
    if (typeof mostrarNotificacionProfesional === 'function') {
      mostrarNotificacionProfesional(mensaje, tipo);
    } else if (typeof mostrarNotificacion === 'function') {
      mostrarNotificacion(mensaje, tipo);
    } else {
      // Crear notificación profesional
      const notificacion = document.createElement('div');
      notificacion.className = `axyra-notification axyra-notification-${tipo}`;
      notificacion.innerHTML = `
        <div class="axyra-notification-content">
          <div class="axyra-notification-icon">
            <i class="fas fa-${this.getIconoNotificacion(tipo)}"></i>
          </div>
          <div class="axyra-notification-message">
            <strong>Gestión de Personal</strong>
            <p>${mensaje}</p>
          </div>
          <button class="axyra-notification-close" onclick="this.closest('.axyra-notification').remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;

      // Agregar estilos si no existen
      if (!document.getElementById('axyra-notification-styles')) {
        const style = document.createElement('style');
        style.id = 'axyra-notification-styles';
        style.textContent = `
          .axyra-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border: 1px solid #e9ecef;
            min-width: 300px;
            max-width: 400px;
            z-index: 10000;
            transform: translateX(100%);
            transition: all 0.3s ease;
          }
          .axyra-notification.mostrar {
            transform: translateX(0);
          }
          .axyra-notification-content {
            display: flex;
            align-items: center;
            padding: 16px;
            gap: 12px;
          }
          .axyra-notification-icon {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
          }
          .axyra-notification-success .axyra-notification-icon {
            background: #d1fae5;
            color: #065f46;
          }
          .axyra-notification-error .axyra-notification-icon {
            background: #fee2e2;
            color: #991b1b;
          }
          .axyra-notification-warning .axyra-notification-icon {
            background: #fef3c7;
            color: #92400e;
          }
          .axyra-notification-info .axyra-notification-icon {
            background: #dbeafe;
            color: #1e40af;
          }
          .axyra-notification-message {
            flex: 1;
          }
          .axyra-notification-message strong {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 4px;
          }
          .axyra-notification-message p {
            margin: 0;
            font-size: 13px;
            color: #6b7280;
            line-height: 1.4;
          }
          .axyra-notification-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          .axyra-notification-close:hover {
            background: #f3f4f6;
            color: #374151;
          }
        `;
        document.head.appendChild(style);
      }

      // Agregar al DOM
      document.body.appendChild(notificacion);

      // Mostrar con animación
      setTimeout(() => {
        notificacion.classList.add('mostrar');
      }, 100);

      // Ocultar después de 5 segundos
      setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
          if (notificacion.parentNode) {
            notificacion.parentNode.removeChild(notificacion);
          }
        }, 300);
      }, 5000);
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
    try {
      console.log('🧮 Calculando horas...');
      
      // Obtener valores de los campos
      const campos = [
        'ordinaryHours', 'nightSurchargeHours', 'daySundaySurchargeHours',
        'nightSundaySurchargeHours', 'dayOvertimeHours', 'nightOvertimeHours',
        'daySundayHolidayHours', 'daySundayOvertimeHours', 'nightSundayHolidayHours',
        'nightSundayOvertimeHours'
      ];
      
      let totalHoras = 0;
      let totalSalario = 0;
      
      // Tarifas por hora (según normativa colombiana)
      const tarifas = {
        ordinary: 6470,
        nightSurcharge: 6470 + 2265,
        daySundaySurcharge: 6470 + 4853,
        nightSundaySurcharge: 6470 + 7118,
        dayOvertime: 6470 + 1618,
        nightOvertime: 6470 + 4853,
        daySundayHoliday: 6470 + 5176,
        daySundayOvertime: 6470 + 6794,
        nightSundayHoliday: 6470 + 7118,
        nightSundayOvertime: 6470 + 11970
      };
      
      const nombresTarifas = {
        ordinary: 'Ordinarias',
        nightSurcharge: 'Recargo Nocturno',
        daySundaySurcharge: 'Recargo Diurno Dominical',
        nightSundaySurcharge: 'Recargo Nocturno Dominical',
        dayOvertime: 'Hora Extra Diurna',
        nightOvertime: 'Hora Extra Nocturna',
        daySundayHoliday: 'Hora Diurna Dominical/Festivo',
        daySundayOvertime: 'Hora Extra Diurna Dominical/Festivo',
        nightSundayHoliday: 'Hora Nocturna Dominical/Festivo',
        nightSundayOvertime: 'Hora Extra Nocturna Dominical/Festivo'
      };
      
      const calculos = [];
      
      campos.forEach((campo, index) => {
        const input = document.getElementById(campo);
        if (input) {
          const horas = parseFloat(input.value) || 0;
          const nombreTarifa = Object.keys(tarifas)[index];
          const tarifa = tarifas[nombreTarifa];
          const subtotal = horas * tarifa;
          
          totalHoras += horas;
          totalSalario += subtotal;
          
          if (horas > 0) {
            calculos.push({
              concepto: nombresTarifas[nombreTarifa],
              horas: horas,
              tarifa: tarifa,
              subtotal: subtotal
            });
          }
        }
      });
      
      // Mostrar resultados
      this.mostrarResultadosCalculo(calculos, totalHoras, totalSalario);
      
    } catch (error) {
      console.error('❌ Error calculando horas:', error);
      this.showNotification('Error calculando horas', error.message, 'error');
    }
  }

  mostrarResultadosCalculo(calculos, totalHoras, totalSalario) {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal';
    modal.innerHTML = `
      <div class="axyra-modal-content">
        <div class="axyra-modal-header">
          <h3><i class="fas fa-calculator"></i> Resultados del Cálculo</h3>
          <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">&times;</button>
        </div>
        <div class="axyra-modal-body">
          <div class="calculation-results">
            ${calculos.map(calc => `
              <div class="calc-item">
                <span class="calc-concept">${calc.concepto}</span>
                <span class="calc-hours">${calc.horas} hrs</span>
                <span class="calc-rate">$${calc.tarifa.toLocaleString()}</span>
                <span class="calc-subtotal">$${calc.subtotal.toLocaleString()}</span>
              </div>
            `).join('')}
            <div class="calc-total">
              <strong>Total Horas: ${totalHoras}</strong>
              <strong>Total Salario: $${totalSalario.toLocaleString()}</strong>
            </div>
          </div>
        </div>
      </div>
    `;
    
    // Agregar estilos
    const style = document.createElement('style');
    style.textContent = `
      .calculation-results {
        max-height: 400px;
        overflow-y: auto;
      }
      .calc-item {
        display: grid;
        grid-template-columns: 2fr 1fr 1fr 1fr;
        gap: 10px;
        padding: 10px;
        border-bottom: 1px solid #eee;
        align-items: center;
      }
      .calc-total {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 15px;
        background: #f8f9fa;
        border-radius: 8px;
        margin-top: 15px;
        font-size: 16px;
      }
      .calc-concept {
        font-weight: 600;
        color: #495057;
      }
      .calc-hours, .calc-rate, .calc-subtotal {
        text-align: right;
        color: #6c757d;
      }
      .calc-subtotal {
        font-weight: 600;
        color: #28a745;
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(modal);
  }

  generarComprobante() {
    try {
      console.log('📄 Generando comprobante...');
      
      // Verificar si hay datos para generar comprobante
      const campos = [
        'ordinaryHours', 'nightSurchargeHours', 'daySundaySurchargeHours',
        'nightSundaySurchargeHours', 'dayOvertimeHours', 'nightOvertimeHours',
        'daySundayHolidayHours', 'daySundayOvertimeHours', 'nightSundayHolidayHours',
        'nightSundayOvertimeHours'
      ];
      
      let tieneDatos = false;
      const datosHoras = {};
      
      campos.forEach((campo, index) => {
        const input = document.getElementById(campo);
        if (input) {
          const horas = parseFloat(input.value) || 0;
          datosHoras[campo] = horas;
          if (horas > 0) tieneDatos = true;
        }
      });
      
      if (!tieneDatos) {
        this.showNotification('No hay horas para generar comprobante', 'Ingresa al menos una hora trabajada', 'warning');
        return;
      }
      
      // Obtener datos del empleado seleccionado
      const empleadoSelect = document.getElementById('employeeSelect');
      const empleadoNombre = empleadoSelect ? empleadoSelect.options[empleadoSelect.selectedIndex]?.textContent : 'Empleado';
      const empleadoId = empleadoSelect ? empleadoSelect.value : '000001';
      
      // Generar comprobante usando el generador
      if (window.axyraWorkOrderGenerator) {
        const empleadoData = {
          name: empleadoNombre,
          id: empleadoId,
          contractType: 'TEMPORAL',
          baseSalary: 1423500
        };
        
        const horasData = {
          ordinary: datosHoras.ordinaryHours || 0,
          nightSurcharge: datosHoras.nightSurchargeHours || 0,
          daySundaySurcharge: datosHoras.daySundaySurchargeHours || 0,
          nightSundaySurcharge: datosHoras.nightSundaySurchargeHours || 0,
          dayOvertime: datosHoras.dayOvertimeHours || 0,
          nightOvertime: datosHoras.nightOvertimeHours || 0,
          daySundayHoliday: datosHoras.daySundayHolidayHours || 0,
          daySundayOvertime: datosHoras.daySundayOvertimeHours || 0,
          nightSundayHoliday: datosHoras.nightSundayHolidayHours || 0,
          nightSundayOvertime: datosHoras.nightSundayOvertimeHours || 0
        };
        
        window.axyraWorkOrderGenerator.generateWorkOrder(empleadoData, horasData);
      } else {
        this.showNotification('Generador de comprobantes no disponible', 'Intenta recargar la página', 'error');
      }
      
    } catch (error) {
      console.error('❌ Error generando comprobante:', error);
      this.showNotification('Error generando comprobante', error.message, 'error');
    }
  }

  limpiarCamposHoras() {
    const campos = [
      'ordinaryHours', 'nightSurchargeHours', 'daySundaySurchargeHours',
      'nightSundaySurchargeHours', 'dayOvertimeHours', 'nightOvertimeHours',
      'daySundayHolidayHours', 'daySundayOvertimeHours', 'nightSundayHolidayHours',
      'nightSundayOvertimeHours'
    ];
    
    campos.forEach(campo => {
      const input = document.getElementById(campo);
      if (input) {
        input.value = '0';
      }
    });
    
    console.log('🧹 Campos de horas limpiados');
  }

  limpiarTablaHoras() {
    try {
      // Confirmar acción
      if (!confirm('¿Estás seguro de que quieres limpiar toda la tabla de horas? Esta acción no se puede deshacer.')) {
        return;
      }

      // Limpiar datos del localStorage
      localStorage.removeItem('axyra_horas');
      this.horas = [];
      
      // Limpiar tabla
      this.renderizarHoras();
      
      // Actualizar estadísticas
      this.actualizarEstadisticas();
      
      this.mostrarNotificacion('Tabla de horas limpiada correctamente', 'success');
      console.log('🧹 Tabla de horas limpiada');
      
    } catch (error) {
      console.error('❌ Error limpiando tabla:', error);
      this.mostrarNotificacion('Error limpiando tabla', 'error');
    }
  }

  async generarNomina() {
    try {
      // Obtener empleados y horas trabajadas
      const empleados = await this.loadFromStorage('empleados');
      const horasTrabajadas = await this.loadFromStorage('horas_trabajadas');
      
      if (empleados.length === 0) {
        this.showNotification('No hay empleados registrados', 'Debes registrar empleados antes de generar nóminas', 'warning');
        return;
      }

      // Mostrar modal de selección de empleado
      this.showEmpleadoSelectionModal(empleados, horasTrabajadas);
      
    } catch (error) {
      console.error('Error generando nómina:', error);
      this.showNotification('Error generando nómina', error.message, 'error');
    }
  }

  showEmpleadoSelectionModal(empleados, horasTrabajadas) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content modal-large">
        <div class="modal-header">
          <h2><i class="fas fa-calculator"></i> Generar Nómina Individual</h2>
          <button class="modal-close">&times;</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="empleado-nomina">Seleccionar Empleado *</label>
            <select id="empleado-nomina" class="form-control" required>
              <option value="">Seleccionar empleado...</option>
              ${empleados.map(emp => `
                <option value="${emp.id}" data-cedula="${emp.cedula}" data-salario="${emp.salario || 0}">
                  ${emp.nombre} ${emp.apellido} - ${emp.cedula}
                </option>
              `).join('')}
            </select>
          </div>
          <div class="form-group">
            <label for="periodo-nomina">Período de Pago *</label>
            <select id="periodo-nomina" class="form-control" required>
              <option value="">Seleccionar período...</option>
              <option value="2024-01">Enero 2024</option>
              <option value="2024-02">Febrero 2024</option>
              <option value="2024-03">Marzo 2024</option>
              <option value="2024-04">Abril 2024</option>
              <option value="2024-05">Mayo 2024</option>
              <option value="2024-06">Junio 2024</option>
              <option value="2024-07">Julio 2024</option>
              <option value="2024-08">Agosto 2024</option>
              <option value="2024-09">Septiembre 2024</option>
              <option value="2024-10">Octubre 2024</option>
              <option value="2024-11">Noviembre 2024</option>
              <option value="2024-12">Diciembre 2024</option>
            </select>
          </div>
          <div id="nomina-preview" class="nomina-preview" style="display: none;">
            <h3>Vista Previa de Nómina</h3>
            <div id="nomina-detalle"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="cancelar-nomina">Cancelar</button>
          <button type="button" class="btn btn-primary" id="generar-pdf" disabled>Generar PDF</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Event listeners
    const empleadoSelect = modal.querySelector('#empleado-nomina');
    const periodoSelect = modal.querySelector('#periodo-nomina');
    const cancelarBtn = modal.querySelector('#cancelar-nomina');
    const generarPdfBtn = modal.querySelector('#generar-pdf');
    const closeBtn = modal.querySelector('.modal-close');

    empleadoSelect.addEventListener('change', () => {
      this.calcularNomina(empleadoSelect.value, periodoSelect.value, empleados, horasTrabajadas, modal);
    });

    periodoSelect.addEventListener('change', () => {
      this.calcularNomina(empleadoSelect.value, periodoSelect.value, empleados, horasTrabajadas, modal);
    });

    generarPdfBtn.addEventListener('click', () => {
      this.generarPDFNomina(empleadoSelect.value, periodoSelect.value, empleados, horasTrabajadas);
    });

    cancelarBtn.addEventListener('click', () => this.closeModal(modal));
    closeBtn.addEventListener('click', () => this.closeModal(modal));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal(modal);
    });
  }

  calcularNomina(empleadoId, periodo, empleados, horasTrabajadas, modal) {
    if (!empleadoId || !periodo) return;

    const empleado = empleados.find(e => e.id === empleadoId);
    if (!empleado) return;

    const salarioBase = parseFloat(empleado.salario || 0);
    const horasEmpleado = horasTrabajadas.filter(h => h.empleadoId === empleadoId);
    
    // Calcular horas del período (simplificado)
    const totalHorasOrdinarias = horasEmpleado.reduce((sum, h) => sum + (h.horasOrdinarias || 0), 0);
    const totalHorasExtras = horasEmpleado.reduce((sum, h) => sum + (h.horasExtras || 0), 0);
    
    const valorHora = salarioBase / 240; // 240 horas mensuales
    const valorHorasOrdinarias = totalHorasOrdinarias * valorHora;
    const valorHorasExtras = totalHorasExtras * valorHora * 1.5; // 50% extra
    
    const salarioBruto = valorHorasOrdinarias + valorHorasExtras;
    
    // Deducciones (simplificado)
    const salud = salarioBruto * 0.04;
    const pension = salarioBruto * 0.04;
    const totalDeducciones = salud + pension;
    
    const salarioNeto = salarioBruto - totalDeducciones;

    const nominaPreview = modal.querySelector('#nomina-preview');
    const nominaDetalle = modal.querySelector('#nomina-detalle');
    const generarPdfBtn = modal.querySelector('#generar-pdf');

    nominaDetalle.innerHTML = `
      <div class="nomina-info">
        <div class="empleado-info">
          <h4>${empleado.nombre} ${empleado.apellido}</h4>
          <p>Cédula: ${empleado.cedula}</p>
          <p>Cargo: ${empleado.cargo}</p>
          <p>Período: ${periodo}</p>
        </div>
        <div class="nomina-calculations">
          <div class="calculation-row">
            <span>Salario Base:</span>
            <span>$${this.formatCurrency(salarioBase)}</span>
          </div>
          <div class="calculation-row">
            <span>Horas Ordinarias (${totalHorasOrdinarias}h):</span>
            <span>$${this.formatCurrency(valorHorasOrdinarias)}</span>
          </div>
          <div class="calculation-row">
            <span>Horas Extras (${totalHorasExtras}h):</span>
            <span>$${this.formatCurrency(valorHorasExtras)}</span>
          </div>
          <div class="calculation-row total">
            <span>Salario Bruto:</span>
            <span>$${this.formatCurrency(salarioBruto)}</span>
          </div>
          <div class="deductions">
            <h5>Deducciones:</h5>
            <div class="calculation-row">
              <span>Salud (4%):</span>
              <span>$${this.formatCurrency(salud)}</span>
            </div>
            <div class="calculation-row">
              <span>Pensión (4%):</span>
              <span>$${this.formatCurrency(pension)}</span>
            </div>
            <div class="calculation-row total">
              <span>Total Deducciones:</span>
              <span>$${this.formatCurrency(totalDeducciones)}</span>
            </div>
          </div>
          <div class="calculation-row final-total">
            <span>Salario Neto a Pagar:</span>
            <span>$${this.formatCurrency(salarioNeto)}</span>
          </div>
        </div>
      </div>
    `;

    nominaPreview.style.display = 'block';
    generarPdfBtn.disabled = false;
  }

  async generarPDFNomina(empleadoId, periodo, empleados, horasTrabajadas) {
    try {
      const empleado = empleados.find(e => e.id === empleadoId);
      if (!empleado) return;

      // Crear contenido HTML para el PDF
      const htmlContent = this.generarHTMLNomina(empleado, periodo, horasTrabajadas);
      
      // Crear ventana para imprimir
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Esperar a que cargue y luego imprimir
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      this.showNotification('PDF generado', 'La nómina se ha generado correctamente', 'success');
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      this.showNotification('Error generando PDF', error.message, 'error');
    }
  }

  generarHTMLNomina(empleado, periodo, horasTrabajadas) {
    const fechaActual = new Date().toLocaleDateString('es-CO');
    const horasEmpleado = horasTrabajadas.filter(h => h.empleadoId === empleado.id);
    
    // Cálculos (simplificado)
    const salarioBase = parseFloat(empleado.salario || 0);
    const totalHorasOrdinarias = horasEmpleado.reduce((sum, h) => sum + (h.horasOrdinarias || 0), 0);
    const totalHorasExtras = horasEmpleado.reduce((sum, h) => sum + (h.horasExtras || 0), 0);
    
    const valorHora = salarioBase / 240;
    const valorHorasOrdinarias = totalHorasOrdinarias * valorHora;
    const valorHorasExtras = totalHorasExtras * valorHora * 1.5;
    
    const salarioBruto = valorHorasOrdinarias + valorHorasExtras;
    const salud = salarioBruto * 0.04;
    const pension = salarioBruto * 0.04;
    const totalDeducciones = salud + pension;
    const salarioNeto = salarioBruto - totalDeducciones;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Nómina - ${empleado.nombre} ${empleado.apellido}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #667eea; }
          .title { font-size: 20px; margin: 10px 0; }
          .info { margin-bottom: 20px; }
          .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .total-row { font-weight: bold; background-color: #f9f9f9; }
          .final-total { font-size: 18px; color: #667eea; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">AXYRA</div>
          <div class="title">COMPROBANTE DE PAGO DE NÓMINA</div>
          <div>Período: ${periodo}</div>
          <div>Fecha de emisión: ${fechaActual}</div>
        </div>
        
        <div class="info">
          <div class="info-row">
            <span><strong>Empleado:</strong> ${empleado.nombre} ${empleado.apellido}</span>
          </div>
          <div class="info-row">
            <span><strong>Cédula:</strong> ${empleado.cedula}</span>
            <span><strong>Cargo:</strong> ${empleado.cargo}</span>
          </div>
          <div class="info-row">
            <span><strong>Departamento:</strong> ${empleado.departamento || 'N/A'}</span>
            <span><strong>Fecha de ingreso:</strong> ${new Date(empleado.fechaIngreso).toLocaleDateString('es-CO')}</span>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Horas</th>
              <th>Valor Hora</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Horas Ordinarias</td>
              <td>${totalHorasOrdinarias}</td>
              <td>$${this.formatCurrency(valorHora)}</td>
              <td>$${this.formatCurrency(valorHorasOrdinarias)}</td>
            </tr>
            <tr>
              <td>Horas Extras</td>
              <td>${totalHorasExtras}</td>
              <td>$${this.formatCurrency(valorHora * 1.5)}</td>
              <td>$${this.formatCurrency(valorHorasExtras)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3"><strong>Salario Bruto</strong></td>
              <td><strong>$${this.formatCurrency(salarioBruto)}</strong></td>
            </tr>
          </tbody>
        </table>

        <table class="table">
          <thead>
            <tr>
              <th>Deducciones</th>
              <th>Porcentaje</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Salud</td>
              <td>4%</td>
              <td>$${this.formatCurrency(salud)}</td>
            </tr>
            <tr>
              <td>Pensión</td>
              <td>4%</td>
              <td>$${this.formatCurrency(pension)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="2"><strong>Total Deducciones</strong></td>
              <td><strong>$${this.formatCurrency(totalDeducciones)}</strong></td>
            </tr>
          </tbody>
        </table>

        <div class="info">
          <div class="info-row final-total">
            <span><strong>SALARIO NETO A PAGAR:</strong></span>
            <span><strong>$${this.formatCurrency(salarioNeto)}</strong></span>
          </div>
        </div>

        <div class="footer">
          <p>Este comprobante ha sido generado automáticamente por el sistema AXYRA</p>
          <p>Villa Venecia - Sistema de Gestión de Nómina</p>
        </div>
      </body>
      </html>
    `;
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
