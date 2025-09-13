// ========================================
// SISTEMA COMPLETO DE GESTIÓN DE HORAS AXYRA
// ========================================

class AxyraGestionHoras {
  constructor() {
    this.empleados = [];
    this.horas = [];
    this.usuarioActual = null;
    this.isInitialized = false;
    this.filters = {
      fechaInicio: null,
      fechaFin: null,
      empleado: null,
      tipo: null,
    };
    this.tiposHoras = [
      { id: 'normal', nombre: 'Horas Normales', recargo: 0, color: '#3b82f6' },
      { id: 'extra_diurna', nombre: 'Hora Extra Diurna', recargo: 25, color: '#10b981' },
      { id: 'extra_nocturna', nombre: 'Hora Extra Nocturna', recargo: 75, color: '#8b5cf6' },
      { id: 'nocturna', nombre: 'Hora Nocturna', recargo: 35, color: '#6366f1' },
      { id: 'dominical_diurna', nombre: 'Hora Dominical Diurna', recargo: 80, color: '#f59e0b' },
      { id: 'dominical_nocturna', nombre: 'Hora Dominical Nocturna', recargo: 100, color: '#ef4444' },
      { id: 'festivo_diurna', nombre: 'Hora Festivo Diurna', recargo: 80, color: '#f97316' },
      { id: 'festivo_nocturna', nombre: 'Hora Festivo Nocturna', recargo: 100, color: '#dc2626' },
      { id: 'extra_dominical_diurna', nombre: 'Hora Extra Dominical Diurna', recargo: 100, color: '#eab308' },
      { id: 'extra_dominical_nocturna', nombre: 'Hora Extra Dominical Nocturna', recargo: 120, color: '#ca8a04' },
    ];
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Sistema de Gestión de Horas AXYRA...');

      // Verificar autenticación
      await this.verificarAutenticacion();

      // Cargar datos
      await this.cargarDatos();

      // Configurar interfaz
      this.configurarInterfaz();

      // Configurar event listeners
      this.configurarEventListeners();

      // Renderizar datos
      this.renderizarHoras();
      this.actualizarEstadisticas();

      this.isInitialized = true;
      console.log('✅ Sistema de Gestión de Horas inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Gestión de Horas:', error);
      this.mostrarNotificacion('Error inicializando el sistema de gestión de horas', 'error');
    }
  }

  // ========================================
  // AUTENTICACIÓN Y DATOS
  // ========================================

  async verificarAutenticacion() {
    try {
      // Intentar obtener usuario de Firebase
      if (window.axyraFirebase?.auth?.currentUser) {
        this.usuarioActual = {
          id: window.axyraFirebase.auth.currentUser.uid,
          email: window.axyraFirebase.auth.currentUser.email,
          nombre: window.axyraFirebase.auth.currentUser.displayName || 'Usuario',
        };
        console.log('✅ Usuario autenticado en Firebase:', this.usuarioActual.email);
        return;
      }

      // Fallback a localStorage
      const usuario = localStorage.getItem('axyra_isolated_user') || localStorage.getItem('axyra_usuario_actual');
      if (usuario) {
        this.usuarioActual = JSON.parse(usuario);
        console.log('✅ Usuario cargado desde localStorage:', this.usuarioActual.nombre);
        return;
      }

      // Usuario temporal
      this.usuarioActual = {
        id: 'usuario_' + Date.now(),
        nombre: 'Usuario',
        email: 'usuario@axyra.com',
      };
      console.log('⚠️ Usando usuario temporal');
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      throw error;
    }
  }

  async cargarDatos() {
    try {
      // Cargar empleados
      await this.cargarEmpleados();

      // Cargar horas
      await this.cargarHoras();

      console.log(`✅ Datos cargados: ${this.empleados.length} empleados, ${this.horas.length} registros de horas`);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      throw error;
    }
  }

  async cargarEmpleados() {
    try {
      // Intentar cargar desde FirebaseSyncManager
      if (window.firebaseSyncManager) {
        this.empleados = await window.firebaseSyncManager.getEmpleados();
        return;
      }

      // Fallback a localStorage
      const empleadosData = localStorage.getItem('axyra_empleados');
      if (empleadosData) {
        this.empleados = JSON.parse(empleadosData);
        return;
      }

      // Datos de ejemplo
      this.empleados = [
        {
          id: 'emp_1',
          nombre: 'Juan Pérez',
          cargo: 'Vendedor',
          salario: 1500000,
          activo: true,
        },
        {
          id: 'emp_2',
          nombre: 'María García',
          cargo: 'Cajera',
          salario: 1200000,
          activo: true,
        },
      ];
    } catch (error) {
      console.error('❌ Error cargando empleados:', error);
      this.empleados = [];
    }
  }

  async cargarHoras() {
    try {
      // Intentar cargar desde FirebaseSyncManager
      if (window.firebaseSyncManager) {
        this.horas = await window.firebaseSyncManager.getHoras();
        return;
      }

      // Fallback a localStorage
      const horasData = localStorage.getItem('axyra_horas');
      if (horasData) {
        this.horas = JSON.parse(horasData);
        return;
      }

      // Datos de ejemplo
      this.horas = [
        {
          id: 'hora_1',
          empleadoId: 'emp_1',
          empleado: 'Juan Pérez',
          fecha: new Date().toISOString(),
          horasNormales: 8,
          horasExtras: 2,
          totalHoras: 10,
          salarioBase: 1500000,
          totalPago: 1875000,
          userId: this.usuarioActual.id,
        },
      ];
    } catch (error) {
      console.error('❌ Error cargando horas:', error);
      this.horas = [];
    }
  }

  // ========================================
  // CONFIGURACIÓN DE INTERFAZ
  // ========================================

  configurarInterfaz() {
    // Configurar fechas por defecto
    const hoy = new Date();
    const inicioSemana = new Date(hoy);
    inicioSemana.setDate(hoy.getDate() - hoy.getDay());

    this.filters.fechaInicio = inicioSemana.toISOString().split('T')[0];
    this.filters.fechaFin = hoy.toISOString().split('T')[0];

    // Actualizar inputs de fecha
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');

    if (fechaInicioInput) fechaInicioInput.value = this.filters.fechaInicio;
    if (fechaFinInput) fechaFinInput.value = this.filters.fechaFin;

    // Configurar select de empleados
    this.configurarSelectEmpleados();

    // Configurar select de tipos de horas
    this.configurarSelectTiposHoras();
  }

  configurarSelectEmpleados() {
    const selectEmpleado = document.getElementById('filtroEmpleado');
    if (!selectEmpleado) return;

    selectEmpleado.innerHTML = '<option value="">Todos los empleados</option>';

    this.empleados.forEach((empleado) => {
      if (empleado.activo) {
        const option = document.createElement('option');
        option.value = empleado.id;
        option.textContent = empleado.nombre;
        selectEmpleado.appendChild(option);
      }
    });
  }

  configurarSelectTiposHoras() {
    const selectTipo = document.getElementById('filtroTipo');
    if (!selectTipo) return;

    selectTipo.innerHTML = '<option value="">Todos los tipos</option>';

    this.tiposHoras.forEach((tipo) => {
      const option = document.createElement('option');
      option.value = tipo.id;
      option.textContent = tipo.nombre;
      selectTipo.appendChild(option);
    });
  }

  configurarEventListeners() {
    // Botón agregar horas
    const btnAgregarHoras = document.getElementById('btnAgregarHoras');
    if (btnAgregarHoras) {
      btnAgregarHoras.addEventListener('click', () => this.mostrarModalAgregarHoras());
    }

    // Botón exportar
    const btnExportar = document.getElementById('btnExportarHoras');
    if (btnExportar) {
      btnExportar.addEventListener('click', () => this.exportarHoras());
    }

    // Filtros
    const filtros = ['fechaInicio', 'fechaFin', 'filtroEmpleado', 'filtroTipo'];
    filtros.forEach((filtroId) => {
      const elemento = document.getElementById(filtroId);
      if (elemento) {
        elemento.addEventListener('change', () => this.aplicarFiltros());
      }
    });

    // Botón limpiar filtros
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltrosHoras');
    if (btnLimpiarFiltros) {
      btnLimpiarFiltros.addEventListener('click', () => this.limpiarFiltros());
    }
  }

  // ========================================
  // GESTIÓN DE HORAS
  // ========================================

  mostrarModalAgregarHoras() {
    const modalHTML = `
      <div id="modalAgregarHoras" class="axyra-modal" style="display: flex;">
        <div class="axyra-modal-content axyra-modal-large">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-clock"></i> Registrar Horas
            </h3>
            <button class="axyra-modal-close" onclick="cerrarModalAgregarHoras()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <form id="formAgregarHoras">
              <div class="axyra-form-row">
                <div class="axyra-form-group">
                  <label for="empleadoHoras" class="axyra-form-label">Empleado:</label>
                  <select id="empleadoHoras" class="axyra-form-input" required>
                    <option value="">Seleccionar empleado</option>
                    ${this.empleados.map((emp) => `<option value="${emp.id}">${emp.nombre}</option>`).join('')}
                  </select>
                </div>
                <div class="axyra-form-group">
                  <label for="fechaHoras" class="axyra-form-label">Fecha:</label>
                  <input type="date" id="fechaHoras" class="axyra-form-input" required>
                </div>
              </div>
              
              <div class="axyra-horas-section">
                <h4>Registro de Horas por Tipo</h4>
                <div class="axyra-horas-grid">
                  ${this.tiposHoras
                    .map(
                      (tipo) => `
                    <div class="axyra-hora-item">
                      <label for="hora_${tipo.id}" class="axyra-hora-label">
                        <span class="axyra-hora-color" style="background-color: ${tipo.color}"></span>
                        ${tipo.nombre}
                        ${tipo.recargo > 0 ? `<small>(+${tipo.recargo}%)</small>` : ''}
                      </label>
                      <input type="number" id="hora_${
                        tipo.id
                      }" class="axyra-hora-input" min="0" max="24" step="0.5" value="0">
                    </div>
                  `
                    )
                    .join('')}
                </div>
              </div>

              <div class="axyra-form-group">
                <label for="observacionesHoras" class="axyra-form-label">Observaciones:</label>
                <textarea id="observacionesHoras" class="axyra-form-input" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="cerrarModalAgregarHoras()">
              Cancelar
            </button>
            <button class="axyra-btn axyra-btn-primary" onclick="axyraGestionHoras.agregarHoras()">
              <i class="fas fa-save"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Configurar fecha por defecto
    const fechaInput = document.getElementById('fechaHoras');
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split('T')[0];
    }

    // Configurar cálculo automático
    this.configurarCalculoAutomatico();
  }

  configurarCalculoAutomatico() {
    const empleadoSelect = document.getElementById('empleadoHoras');
    if (!empleadoSelect) return;

    empleadoSelect.addEventListener('change', () => {
      const empleadoId = empleadoSelect.value;
      const empleado = this.empleados.find((emp) => emp.id === empleadoId);

      if (empleado) {
        // Mostrar información del empleado
        this.mostrarInfoEmpleado(empleado);
      }
    });

    // Configurar cálculo en tiempo real
    const inputsHoras = document.querySelectorAll('.axyra-hora-input');
    inputsHoras.forEach((input) => {
      input.addEventListener('input', () => {
        this.calcularTotalHoras();
        this.calcularTotalPago();
      });
    });
  }

  mostrarInfoEmpleado(empleado) {
    // Crear o actualizar información del empleado
    let infoDiv = document.getElementById('infoEmpleado');
    if (!infoDiv) {
      infoDiv = document.createElement('div');
      infoDiv.id = 'infoEmpleado';
      infoDiv.className = 'axyra-info-empleado';
      document.getElementById('formAgregarHoras').insertBefore(infoDiv, document.querySelector('.axyra-horas-section'));
    }

    infoDiv.innerHTML = `
      <div class="axyra-empleado-info">
        <h5>Información del Empleado</h5>
        <p><strong>Nombre:</strong> ${empleado.nombre}</p>
        <p><strong>Cargo:</strong> ${empleado.cargo}</p>
        <p><strong>Salario Base:</strong> $${empleado.salario.toLocaleString()}</p>
        <p><strong>Salario por Hora:</strong> $${(empleado.salario / 240).toLocaleString()}</p>
      </div>
    `;
  }

  calcularTotalHoras() {
    let total = 0;
    const inputsHoras = document.querySelectorAll('.axyra-hora-input');

    inputsHoras.forEach((input) => {
      total += parseFloat(input.value) || 0;
    });

    // Mostrar total
    let totalDiv = document.getElementById('totalHoras');
    if (!totalDiv) {
      totalDiv = document.createElement('div');
      totalDiv.id = 'totalHoras';
      totalDiv.className = 'axyra-total-horas';
      document.querySelector('.axyra-horas-section').appendChild(totalDiv);
    }

    totalDiv.innerHTML = `
      <div class="axyra-total-info">
        <strong>Total de Horas: ${total.toFixed(1)}</strong>
      </div>
    `;
  }

  calcularTotalPago() {
    const empleadoId = document.getElementById('empleadoHoras').value;
    const empleado = this.empleados.find((emp) => emp.id === empleadoId);

    if (!empleado) return;

    const salarioHora = empleado.salario / 240; // 240 horas mensuales
    let totalPago = 0;

    this.tiposHoras.forEach((tipo) => {
      const input = document.getElementById(`hora_${tipo.id}`);
      const horas = parseFloat(input.value) || 0;

      if (horas > 0) {
        const recargo = tipo.recargo / 100;
        const pagoHora = salarioHora * (1 + recargo);
        totalPago += horas * pagoHora;
      }
    });

    // Mostrar total de pago
    let totalPagoDiv = document.getElementById('totalPago');
    if (!totalPagoDiv) {
      totalPagoDiv = document.createElement('div');
      totalPagoDiv.id = 'totalPago';
      totalPagoDiv.className = 'axyra-total-pago';
      document.querySelector('.axyra-horas-section').appendChild(totalPagoDiv);
    }

    totalPagoDiv.innerHTML = `
      <div class="axyra-total-info">
        <strong>Total a Pagar: $${totalPago.toLocaleString()}</strong>
      </div>
    `;
  }

  async agregarHoras() {
    try {
      const form = document.getElementById('formAgregarHoras');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const empleadoId = document.getElementById('empleadoHoras').value;
      const empleado = this.empleados.find((emp) => emp.id === empleadoId);
      const fecha = document.getElementById('fechaHoras').value;
      const observaciones = document.getElementById('observacionesHoras').value;

      // Recopilar horas por tipo
      const horasPorTipo = {};
      let totalHoras = 0;

      this.tiposHoras.forEach((tipo) => {
        const input = document.getElementById(`hora_${tipo.id}`);
        const horas = parseFloat(input.value) || 0;
        horasPorTipo[tipo.id] = horas;
        totalHoras += horas;
      });

      if (totalHoras === 0) {
        this.mostrarNotificacion('Debe registrar al menos una hora', 'warning');
        return;
      }

      // Calcular total de pago
      const salarioHora = empleado.salario / 240;
      let totalPago = 0;

      this.tiposHoras.forEach((tipo) => {
        const horas = horasPorTipo[tipo.id];
        if (horas > 0) {
          const recargo = tipo.recargo / 100;
          const pagoHora = salarioHora * (1 + recargo);
          totalPago += horas * pagoHora;
        }
      });

      const registroHoras = {
        id: 'hora_' + Date.now(),
        empleadoId: empleadoId,
        empleado: empleado.nombre,
        fecha: fecha,
        ...horasPorTipo,
        totalHoras: totalHoras,
        salarioBase: empleado.salario,
        salarioHora: salarioHora,
        totalPago: totalPago,
        observaciones: observaciones,
        fechaCreacion: new Date().toISOString(),
        userId: this.usuarioActual.id,
      };

      // Guardar usando FirebaseSyncManager
      if (window.firebaseSyncManager) {
        await window.firebaseSyncManager.addHoras(registroHoras);
      } else {
        // Fallback a localStorage
        this.horas.push(registroHoras);
        localStorage.setItem('axyra_horas', JSON.stringify(this.horas));
      }

      // Cerrar modal y actualizar
      this.cerrarModalAgregarHoras();
      this.renderizarHoras();
      this.actualizarEstadisticas();

      this.mostrarNotificacion('Horas registradas exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error agregando horas:', error);
      this.mostrarNotificacion('Error registrando horas', 'error');
    }
  }

  cerrarModalAgregarHoras() {
    const modal = document.getElementById('modalAgregarHoras');
    if (modal) {
      modal.remove();
    }
  }

  async editarHoras(horasId) {
    const horas = this.horas.find((h) => h.id === horasId);
    if (!horas) return;

    // Implementar modal de edición similar al de agregar
    this.mostrarNotificacion('Función de edición en desarrollo', 'info');
  }

  async eliminarHoras(horasId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este registro de horas?')) return;

    try {
      // Eliminar de Firebase
      if (window.axyraFirebase?.firestore) {
        await window.axyraFirebase.firestore.collection('horas').doc(horasId).delete();
      }

      // Eliminar de localStorage
      this.horas = this.horas.filter((h) => h.id !== horasId);
      localStorage.setItem('axyra_horas', JSON.stringify(this.horas));

      this.renderizarHoras();
      this.actualizarEstadisticas();

      this.mostrarNotificacion('Registro de horas eliminado exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error eliminando horas:', error);
      this.mostrarNotificacion('Error eliminando registro de horas', 'error');
    }
  }

  // ========================================
  // RENDERIZADO
  // ========================================

  renderizarHoras() {
    const tbody = document.getElementById('horasTableBody');
    if (!tbody) return;

    const horasFiltradas = this.obtenerHorasFiltradas();

    tbody.innerHTML = horasFiltradas
      .map(
        (horas) => `
      <tr>
        <td>${new Date(horas.fecha).toLocaleDateString()}</td>
        <td>${horas.empleado}</td>
        <td>${horas.horasNormales || 0}</td>
        <td>${horas.horasExtras || 0}</td>
        <td>${horas.totalHoras}</td>
        <td>$${horas.totalPago.toLocaleString()}</td>
        <td>${horas.observaciones || '-'}</td>
        <td>
          <div class="axyra-action-buttons">
            <button class="axyra-btn axyra-btn-sm axyra-btn-warning" onclick="axyraGestionHoras.editarHoras('${
              horas.id
            }')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="axyra-btn axyra-btn-sm axyra-btn-danger" onclick="axyraGestionHoras.eliminarHoras('${
              horas.id
            }')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  }

  obtenerHorasFiltradas() {
    let horas = [...this.horas];

    // Filtrar por fechas
    if (this.filters.fechaInicio) {
      horas = horas.filter((h) => h.fecha >= this.filters.fechaInicio);
    }
    if (this.filters.fechaFin) {
      horas = horas.filter((h) => h.fecha <= this.filters.fechaFin + 'T23:59:59');
    }

    // Filtrar por empleado
    if (this.filters.empleado) {
      horas = horas.filter((h) => h.empleadoId === this.filters.empleado);
    }

    // Filtrar por tipo (si se implementa)
    if (this.filters.tipo) {
      // Implementar filtro por tipo si es necesario
    }

    return horas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
  }

  actualizarEstadisticas() {
    const horasFiltradas = this.obtenerHorasFiltradas();

    // Calcular estadísticas
    const totalRegistros = horasFiltradas.length;
    const totalHoras = horasFiltradas.reduce((sum, h) => sum + h.totalHoras, 0);
    const totalPago = horasFiltradas.reduce((sum, h) => sum + h.totalPago, 0);
    const promedioHoras = totalRegistros > 0 ? totalHoras / totalRegistros : 0;

    // Actualizar elementos
    const totalRegistrosEl = document.getElementById('totalRegistros');
    const totalHorasEl = document.getElementById('totalHoras');
    const totalPagoEl = document.getElementById('totalPago');
    const promedioHorasEl = document.getElementById('promedioHoras');

    if (totalRegistrosEl) totalRegistrosEl.textContent = totalRegistros;
    if (totalHorasEl) totalHorasEl.textContent = totalHoras.toFixed(1);
    if (totalPagoEl) totalPagoEl.textContent = `$${totalPago.toLocaleString()}`;
    if (promedioHorasEl) promedioHorasEl.textContent = promedioHoras.toFixed(1);
  }

  // ========================================
  // FILTROS
  // ========================================

  aplicarFiltros() {
    // Obtener valores de los filtros
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    const empleado = document.getElementById('filtroEmpleado')?.value;
    const tipo = document.getElementById('filtroTipo')?.value;

    // Actualizar filtros
    this.filters.fechaInicio = fechaInicio;
    this.filters.fechaFin = fechaFin;
    this.filters.empleado = empleado;
    this.filters.tipo = tipo;

    // Re-renderizar
    this.renderizarHoras();
    this.actualizarEstadisticas();
  }

  limpiarFiltros() {
    // Limpiar inputs
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    const empleado = document.getElementById('filtroEmpleado');
    const tipo = document.getElementById('filtroTipo');

    if (fechaInicio) fechaInicio.value = '';
    if (fechaFin) fechaFin.value = '';
    if (empleado) empleado.value = '';
    if (tipo) tipo.value = '';

    // Limpiar filtros
    this.filters = {
      fechaInicio: null,
      fechaFin: null,
      empleado: null,
      tipo: null,
    };

    // Re-renderizar
    this.renderizarHoras();
    this.actualizarEstadisticas();
  }

  // ========================================
  // EXPORTACIÓN
  // ========================================

  async exportarHoras() {
    try {
      const horasFiltradas = this.obtenerHorasFiltradas();

      if (horasFiltradas.length === 0) {
        this.mostrarNotificacion('No hay registros de horas para exportar', 'warning');
        return;
      }

      // Crear workbook
      const wb = XLSX.utils.book_new();

      // Preparar datos para Excel
      const datosExcel = horasFiltradas.map((horas) => ({
        Fecha: new Date(horas.fecha).toLocaleDateString(),
        Empleado: horas.empleado,
        'Horas Normales': horas.horasNormales || 0,
        'Horas Extras': horas.horasExtras || 0,
        'Total Horas': horas.totalHoras,
        'Total Pago': horas.totalPago,
        Observaciones: horas.observaciones || '',
      }));

      // Crear hoja de trabajo
      const ws = XLSX.utils.json_to_sheet(datosExcel);
      XLSX.utils.book_append_sheet(wb, ws, 'Registro de Horas');

      // Exportar archivo
      const nombreArchivo = `registro_horas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      this.mostrarNotificacion('Registro de horas exportado exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error exportando horas:', error);
      this.mostrarNotificacion('Error exportando registro de horas', 'error');
    }
  }

  // ========================================
  // NOTIFICACIONES
  // ========================================

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Usar sistema de notificaciones existente si está disponible
    if (window.axyraNotifications) {
      window.axyraNotifications.show(mensaje, tipo);
      return;
    }

    // Fallback a notificación visual simple
    const iconos = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    console.log(`${iconos[tipo]} ${mensaje}`);

    // Mostrar notificación visual simple
    const notificacion = document.createElement('div');
    notificacion.className = `axyra-notificacion axyra-notificacion-${tipo}`;
    notificacion.innerHTML = `
      <div class="axyra-notificacion-icono">
        <i class="fas fa-${
          tipo === 'success' ? 'check' : tipo === 'error' ? 'times' : tipo === 'warning' ? 'exclamation' : 'info'
        }-circle"></i>
      </div>
      <div class="axyra-notificacion-contenido">
        <div class="axyra-notificacion-mensaje">${mensaje}</div>
      </div>
      <button class="axyra-notificacion-cerrar" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      if (notificacion.parentElement) {
        notificacion.remove();
      }
    }, 5000);
  }
}

// ========================================
// FUNCIONES GLOBALES
// ========================================

// Función para cerrar modal (llamada desde HTML)
function cerrarModalAgregarHoras() {
  if (window.axyraGestionHoras) {
    window.axyraGestionHoras.cerrarModalAgregarHoras();
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  window.axyraGestionHoras = new AxyraGestionHoras();
});

console.log('⏰ Sistema de Gestión de Horas AXYRA cargado');
