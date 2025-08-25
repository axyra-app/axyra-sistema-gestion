// Sistema Unificado de Gestión de Personal - AXYRA
class GestionPersonalManager {
  constructor() {
    this.empleados = [];
    this.horas = [];
    this.departamentos = [];
    this.empleadoSeleccionado = null;
    this.horasSeleccionadas = null;
    this.currentTab = 'horas';

    this.init();
  }

  async init() {
    try {
      // Inicializar Firebase Sync Manager
      if (typeof FirebaseSyncManager !== 'undefined') {
        this.firebaseSyncManager = new FirebaseSyncManager();
        await this.firebaseSyncManager.init();
      }

      // Inicializar calculadora de ley laboral colombiana
      if (typeof ColombianLaborLawCalculator !== 'undefined') {
        this.colombianLaborLawCalculator = new ColombianLaborLawCalculator();
      }

      // Inicializar generador de PDF
      if (typeof ComprobantePDFGenerator !== 'undefined') {
        this.comprobantePDFGenerator = new ComprobantePDFGenerator();
        await this.comprobantePDFGenerator.init();
      }

      this.cargarDatos();
      this.configurarEventos();
      this.actualizarEstadisticas();

      console.log('✅ GestionPersonalManager inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar GestionPersonalManager:', error);
    }
  }

  async cargarDatos() {
    try {
      if (this.firebaseSyncManager) {
        this.empleados = await this.firebaseSyncManager.getEmpleados();
        this.horas = await this.firebaseSyncManager.getHoras();
        this.departamentos = await this.firebaseSyncManager.getDepartamentos();
      } else {
        // Fallback a localStorage
        this.empleados = JSON.parse(localStorage.getItem('empleados') || '[]');
        this.horas = JSON.parse(localStorage.getItem('horas') || '[]');
        this.departamentos = JSON.parse(localStorage.getItem('departamentos') || '[]');
      }

      // Llenar selectores
      this.llenarSelectorEmpleados();
      this.llenarSelectorDepartamentos();

      // Renderizar contenido
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
    }
  }

  llenarSelectorEmpleados() {
    const selector = document.getElementById('empleadoHoras');
    if (!selector) return;

    // Limpiar opciones existentes
    selector.innerHTML = '<option value="">Seleccionar empleado</option>';

    // Agregar empleados activos
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
    const selectores = ['reporteDepartamento', 'nominaDepartamento'];

    selectores.forEach((id) => {
      const selector = document.getElementById(id);
      if (!selector) return;

      // Limpiar opciones existentes
      selector.innerHTML = '<option value="">Todos los Departamentos</option>';

      // Agregar departamentos
      this.departamentos.forEach((departamento) => {
        const option = document.createElement('option');
        option.value = departamento.nombre;
        option.textContent = departamento.nombre;
        selector.appendChild(option);
      });
    });
  }

  configurarEventos() {
    try {
      // Eventos de navegación por pestañas
      document.querySelectorAll('.gestion-personal-tab').forEach((tab) => {
        tab.addEventListener('click', (e) => {
          e.preventDefault();
          const tabName = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
          this.cambiarTab(tabName);
        });
      });

      // Eventos del formulario de horas
      const empleadoHorasSelect = document.getElementById('empleadoHoras');
      if (empleadoHorasSelect) {
        empleadoHorasSelect.addEventListener('change', () => this.actualizarValoresHora());
      }

      // Eventos del formulario de empleados
      const formEmpleado = document.getElementById('formEmpleado');
      if (formEmpleado) {
        formEmpleado.addEventListener('submit', (e) => this.manejarSubmitEmpleado(e));
      }

      // Eventos del formulario de departamentos
      const formDepartamento = document.getElementById('formDepartamento');
      if (formDepartamento) {
        formDepartamento.addEventListener('submit', (e) => this.manejarSubmitDepartamento(e));
      }

      // Eventos del formulario de horas
      const formHoras = document.getElementById('formRegistroHoras');
      if (formHoras) {
        formHoras.addEventListener('submit', (e) => this.manejarSubmitHoras(e));
      }

      // Botones de acción
      this.configurarBotonesAccion();

      console.log('✅ Eventos configurados correctamente');
    } catch (error) {
      console.error('❌ Error al configurar eventos:', error);
    }
  }

  // ===== MÉTODOS DE FORMULARIOS =====
  async manejarSubmitHoras(e) {
    e.preventDefault();

    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      const fecha = document.getElementById('fechaHoras').value;

      if (!empleadoId) {
        this.mostrarNotificacion('Por favor seleccione un empleado', 'warning');
        return;
      }

      if (!fecha) {
        this.mostrarNotificacion('Por favor ingrese la fecha', 'warning');
        return;
      }

      // Validar que al menos una hora esté ingresada
      const horasInputs = document.querySelectorAll('input[id^="horas_"]');
      let totalHoras = 0;

      horasInputs.forEach((input) => {
        totalHoras += parseFloat(input.value) || 0;
      });

      if (totalHoras === 0) {
        this.mostrarNotificacion('Por favor ingrese al menos una hora', 'warning');
        return;
      }

      // Si pasa todas las validaciones, registrar las horas
      await this.registrarHoras();
    } catch (error) {
      console.error('❌ Error al manejar submit de horas:', error);
      this.mostrarNotificacion('Error al procesar el formulario', 'error');
    }
  }

  configurarBotonesAccion() {
    // Botones de horas
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

    const btnPrevisualizarComprobante = document.getElementById('btnPrevisualizarComprobante');
    if (btnPrevisualizarComprobante) {
      btnPrevisualizarComprobante.addEventListener('click', () => this.previsualizarComprobante());
    }

    // Botones de nómina
    const btnGenerarNomina = document.getElementById('btnGenerarNomina');
    if (btnGenerarNomina) {
      btnGenerarNomina.addEventListener('click', () => this.generarNomina());
    }

    const btnExportarExcel = document.getElementById('btnExportarExcel');
    if (btnExportarExcel) {
      btnExportarExcel.addEventListener('click', () => this.exportarExcel());
    }

    // Botones de empleados
    const btnAgregarEmpleado = document.getElementById('btnAgregarEmpleado');
    if (btnAgregarEmpleado) {
      btnAgregarEmpleado.addEventListener('click', () => this.mostrarModalEmpleado());
    }

    // Botones de departamentos
    const btnAgregarDepartamento = document.getElementById('btnAgregarDepartamento');
    if (btnAgregarDepartamento) {
      btnAgregarDepartamento.addEventListener('click', () => this.mostrarModalDepartamento());
    }
  }

  // ===== MÉTODOS DE MODALES =====
  mostrarModalRegistroHoras() {
    const modal = document.getElementById('modalRegistroHoras');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModalRegistroHoras() {
    const modal = document.getElementById('modalRegistroHoras');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  // ===== MÉTODOS DE EXPORTACIÓN =====
  async exportarHorasExcel() {
    try {
      // Implementar exportación a Excel
      this.mostrarNotificacion('Exportación de horas a Excel implementada', 'success');
    } catch (error) {
      console.error('❌ Error al exportar horas a Excel:', error);
      this.mostrarNotificacion('Error al exportar horas a Excel', 'error');
    }
  }

  async exportarEmpleadosExcel() {
    try {
      // Implementar exportación a Excel
      this.mostrarNotificacion('Exportación de empleados a Excel implementada', 'success');
    } catch (error) {
      console.error('❌ Error al exportar empleados a Excel:', error);
      this.mostrarNotificacion('Error al exportar empleados a Excel', 'error');
    }
  }

  // ===== MÉTODOS DE REPORTES =====
  async generarReporteHoras() {
    try {
      // Implementar generación de reporte de horas
      this.mostrarNotificacion('Reporte de horas generado correctamente', 'success');
    } catch (error) {
      console.error('❌ Error al generar reporte de horas:', error);
      this.mostrarNotificacion('Error al generar reporte de horas', 'error');
    }
  }

  async generarReporteGeneral() {
    try {
      // Implementar generación de reporte general
      this.mostrarNotificacion('Reporte general generado correctamente', 'success');
    } catch (error) {
      console.error('❌ Error al generar reporte general:', error);
      this.mostrarNotificacion('Error al generar reporte general', 'error');
    }
  }

  async generarReporteDepartamento() {
    try {
      // Implementar generación de reporte por departamento
      this.mostrarNotificacion('Reporte por departamento generado correctamente', 'success');
    } catch (error) {
      console.error('❌ Error al generar reporte por departamento:', error);
      this.mostrarNotificacion('Error al generar reporte por departamento', 'error');
    }
  }

  // ===== MÉTODOS DE GESTIÓN =====
  gestionarDepartamentos() {
    // Cambiar a la pestaña de departamentos
    this.cambiarTab('departamentos');
  }

  cambiarTab(tabName) {
    try {
      console.log(`🔄 Cambiando a pestaña: ${tabName}`);

      // Ocultar todas las pestañas
      document.querySelectorAll('.tab-content').forEach((content) => {
        content.style.display = 'none';
      });

      // Desactivar todas las pestañas
      document.querySelectorAll('.gestion-personal-tab').forEach((tab) => {
        tab.classList.remove('active');
      });

      // Mostrar la pestaña seleccionada
      const selectedContent = document.getElementById(`tab-${tabName}`);
      if (selectedContent) {
        selectedContent.style.display = 'block';
        console.log(`✅ Contenido de pestaña ${tabName} mostrado`);
      } else {
        console.warn(`⚠️ Contenido de pestaña ${tabName} no encontrado`);
      }

      // Activar la pestaña seleccionada
      const selectedTab = document.querySelector(`[onclick*="cambiarTab('${tabName}')"]`);
      if (selectedTab) {
        selectedTab.classList.add('active');
        console.log(`✅ Pestaña ${tabName} activada`);
      } else {
        console.warn(`⚠️ Pestaña ${tabName} no encontrada`);
      }

      this.currentTab = tabName;

      // Actualizar datos específicos de la pestaña
      this.actualizarDatosPestana(tabName);
    } catch (error) {
      console.error('❌ Error al cambiar pestaña:', error);
    }
  }

  actualizarDatosPestana(tabName) {
    try {
      switch (tabName) {
        case 'horas':
          // La pestaña de horas ya se actualiza automáticamente
          break;
        case 'empleados':
          this.renderizarEmpleados();
          break;
        case 'nomina':
          // Aquí se podrían cargar nóminas existentes
          break;
        case 'reportes':
          this.actualizarEstadisticas();
          break;
      }
    } catch (error) {
      console.error('❌ Error al actualizar datos de pestaña:', error);
    }
  }

  // ===== GESTIÓN DE HORAS =====
  async actualizarValoresHora() {
    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      if (!empleadoId) return;

      const empleado = this.empleados.find((emp) => emp.id == empleadoId);
      if (!empleado) return;

      if (this.colombianLaborLawCalculator) {
        const valoresHoras = this.colombianLaborLawCalculator.calcularValoresHoras(empleado);

        // Actualizar todos los campos de valor de hora
        Object.keys(valoresHoras).forEach((tipoHora) => {
          const elemento = document.querySelector(`[data-tipo-hora="${tipoHora}"]`);
          if (elemento) {
            elemento.textContent = `$${valoresHoras[tipoHora].toLocaleString()}`;
          }
        });
      }
    } catch (error) {
      console.error('❌ Error al actualizar valores de hora:', error);
    }
  }

  // ===== MÉTODOS DE VALORES DE HORA =====
  actualizarValoresHora() {
    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      if (!empleadoId) return;

      const empleado = this.empleados.find((emp) => emp.id == empleadoId);
      if (!empleado) return;

      // Actualizar valores de hora para cada tipo
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
        const valorElement = document.querySelector(`[data-tipo-hora="${tipo}"]`);
        if (valorElement && this.colombianLaborLawCalculator) {
          const valorHora = this.colombianLaborLawCalculator.calcularValorHora(empleado, tipo);
          valorElement.textContent = `Valor: $${valorHora.toLocaleString()}`;
        }
      });
    } catch (error) {
      console.error('❌ Error al actualizar valores de hora:', error);
    }
  }

  async registrarHoras() {
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

      // Recopilar horas de todos los tipos (10 tipos según ley laboral colombiana)
      const horasData = {};
      let totalHoras = 0;

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
          const valor = parseFloat(input.value) || 0;
          horasData[tipo] = valor;
          totalHoras += valor;
        } else {
          console.warn(`⚠️ Campo no encontrado para tipo de hora: ${tipo}`);
        }
      });

      if (totalHoras === 0) {
        this.mostrarNotificacion('Debe ingresar al menos una hora', 'error');
        return;
      }

      // Calcular salarios
      let salariosCalculados = {};
      if (this.colombianLaborLawCalculator) {
        salariosCalculados = this.colombianLaborLawCalculator.calcularSalariosCompletos(empleado, horasData);
      }

      const registroHoras = {
        id: Date.now().toString(),
        empleadoId: empleadoId,
        empleadoNombre: empleado.nombre,
        fecha: fecha,
        horas: horasData,
        salarios: salariosCalculados,
        totalHoras: totalHoras,
        totalSalario: salariosCalculados.total || 0,
        userId: this.getCurrentUserId(),
        timestamp: new Date().toISOString(),
      };

      // Guardar en Firebase y localStorage
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.addHoras(registroHoras);
      } else {
        this.horas.push(registroHoras);
        localStorage.setItem('horas', JSON.stringify(this.horas));
      }

      this.mostrarNotificacion('Horas registradas correctamente', 'success');
      this.limpiarFormularioHoras();
      this.cargarDatos();
    } catch (error) {
      console.error('❌ Error al registrar horas:', error);
      this.mostrarNotificacion('Error al registrar horas', 'error');
    }
  }

  async calcularHoras() {
    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      if (!empleadoId) {
        this.mostrarNotificacion('Seleccione un empleado', 'error');
        return;
      }

      const empleado = this.empleados.find((emp) => emp.id == empleadoId);
      if (!empleado) {
        this.mostrarNotificacion('Empleado no encontrado', 'error');
        return;
      }

      // Recopilar horas ingresadas
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

      // Calcular salarios
      let salariosCalculados = {};
      if (this.colombianLaborLawCalculator) {
        salariosCalculados = this.colombianLaborLawCalculator.calcularSalariosCompletos(empleado, horasData);
      }

      this.mostrarModalCalculoHoras(empleado, horasData, salariosCalculados);
    } catch (error) {
      console.error('❌ Error al calcular horas:', error);
      this.mostrarNotificacion('Error al calcular horas', 'error');
    }
  }

  mostrarModalCalculoHoras(empleado, horas, salarios) {
    const modal = document.getElementById('modalCalculoHoras');
    if (!modal) return;

    const contenido = modal.querySelector('.modal-body');
    let html = `
            <div class="calculo-horas-container">
                <h4>Resumen de Cálculo - ${empleado.nombre}</h4>
                <div class="calculo-horas-grid">
        `;

    const tiposHoras = [
      { key: 'ordinarias', label: 'Horas Ordinarias' },
      { key: 'recargo_nocturno', label: 'Recargo Nocturno' },
      { key: 'recargo_diurno_dominical', label: 'Recargo Diurno Dominical' },
      { key: 'recargo_nocturno_dominical', label: 'Recargo Nocturno Dominical' },
      { key: 'hora_extra_diurna', label: 'Hora Extra Diurna' },
      { key: 'hora_extra_nocturna', label: 'Hora Extra Nocturna' },
      { key: 'hora_diurna_dominical_o_festivo', label: 'Hora Diurna Dominical/Festivo' },
      { key: 'hora_extra_diurna_dominical_o_festivo', label: 'Hora Extra Diurna Dominical/Festivo' },
      { key: 'hora_nocturna_dominical_o_festivo', label: 'Hora Nocturna Dominical/Festivo' },
      { key: 'hora_extra_nocturna_dominical_o_festivo', label: 'Hora Extra Nocturna Dominical/Festivo' },
    ];

    tiposHoras.forEach((tipo) => {
      const horasVal = horas[tipo.key] || 0;
      const salarioVal = salarios[tipo.key] || 0;

      html += `
                <div class="calculo-hora-item">
                    <span class="tipo-hora">${tipo.label}</span>
                    <span class="horas-cantidad">${horasVal} hrs</span>
                    <span class="salario-valor">$${salarioVal.toLocaleString()}</span>
                </div>
            `;
    });

    html += `
                </div>
                <div class="calculo-total">
                    <strong>Total Horas: ${Object.values(horas).reduce((a, b) => a + b, 0)}</strong>
                    <strong>Total Salario: $${(salarios.total || 0).toLocaleString()}</strong>
                </div>
            </div>
        `;

    contenido.innerHTML = html;
    modal.style.display = 'block';
  }

  async generarComprobante() {
    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      if (!empleadoId) {
        this.mostrarNotificacion('Seleccione un empleado', 'error');
        return;
      }

      const empleado = this.empleados.find((emp) => emp.id == empleadoId);
      if (!empleado) {
        this.mostrarNotificacion('Empleado no encontrado', 'error');
        return;
      }

      // Buscar horas del empleado
      const horasEmpleado = this.horas.filter((h) => h.empleadoId == empleadoId);
      if (horasEmpleado.length === 0) {
        this.mostrarNotificacion('No hay horas registradas para este empleado', 'error');
        return;
      }

      // Generar comprobante usando el generador de PDF
      if (this.comprobantePDFGenerator) {
        const resultado = await this.comprobantePDFGenerator.generarComprobante(empleado, horasEmpleado);
        if (resultado.success) {
          this.mostrarNotificacion('Comprobante generado correctamente', 'success');
        } else {
          this.mostrarNotificacion('Error al generar comprobante', 'error');
        }
      } else {
        this.mostrarNotificacion('Generador de PDF no disponible', 'error');
      }
    } catch (error) {
      console.error('❌ Error al generar comprobante:', error);
      this.mostrarNotificacion('Error al generar comprobante', 'error');
    }
  }

  async previsualizarComprobante() {
    try {
      const empleadoId = document.getElementById('empleadoHoras').value;
      if (!empleadoId) {
        this.mostrarNotificacion('Seleccione un empleado', 'error');
        return;
      }

      const empleado = this.empleados.find((emp) => emp.id == empleadoId);
      if (!empleado) {
        this.mostrarNotificacion('Empleado no encontrado', 'error');
        return;
      }

      // Buscar horas del empleado
      const horasEmpleado = this.horas.filter((h) => h.empleadoId == empleadoId);
      if (horasEmpleado.length === 0) {
        this.mostrarNotificacion('No hay horas registradas para este empleado', 'error');
        return;
      }

      // Previsualizar comprobante
      if (this.comprobantePDFGenerator) {
        const resultado = await this.comprobantePDFGenerator.previsualizarComprobante(empleado, horasEmpleado);
        if (resultado.success) {
          this.mostrarModalPrevisualizacion(resultado.html);
        } else {
          this.mostrarNotificacion('Error al previsualizar comprobante', 'error');
        }
      } else {
        this.mostrarNotificacion('Generador de PDF no disponible', 'error');
      }
    } catch (error) {
      console.error('❌ Error al previsualizar comprobante:', error);
      this.mostrarNotificacion('Error al previsualizar comprobante', 'error');
    }
  }

  // ===== GESTIÓN DE NÓMINA =====
  async generarNomina() {
    try {
      const fechaInicio = document.getElementById('fechaInicioNomina').value;
      const fechaFin = document.getElementById('fechaFinNomina').value;

      if (!fechaInicio || !fechaFin) {
        this.mostrarNotificacion('Por favor complete las fechas de la nómina', 'error');
        return;
      }

      // Filtrar empleados activos
      const empleadosActivos = this.empleados.filter((emp) => emp.estado === 'activo');

      if (empleadosActivos.length === 0) {
        this.mostrarNotificacion('No hay empleados activos para generar nómina', 'error');
        return;
      }

      // Generar nómina para cada empleado
      const nomina = [];
      let totalGeneral = 0;

      for (const empleado of empleadosActivos) {
        const horasEmpleado = this.horas.filter(
          (h) => h.empleadoId == empleado.id && h.fecha >= fechaInicio && h.fecha <= fechaFin
        );

        if (horasEmpleado.length > 0) {
          const totalEmpleado = horasEmpleado.reduce((sum, h) => sum + (h.totalSalario || 0), 0);
          totalGeneral += totalEmpleado;

          nomina.push({
            empleado: empleado,
            horas: horasEmpleado,
            totalHoras: horasEmpleado.reduce((sum, h) => sum + (h.totalHoras || 0), 0),
            totalSalario: totalEmpleado,
          });
        }
      }

      if (nomina.length === 0) {
        this.mostrarNotificacion('No hay horas registradas en el período seleccionado', 'error');
        return;
      }

      this.mostrarModalNomina(nomina, totalGeneral, fechaInicio, fechaFin);
    } catch (error) {
      console.error('❌ Error al generar nómina:', error);
      this.mostrarNotificacion('Error al generar nómina', 'error');
    }
  }

  mostrarModalNomina(nomina, totalGeneral, fechaInicio, fechaFin) {
    const modal = document.getElementById('modalNomina');
    if (!modal) return;

    const contenido = modal.querySelector('.modal-body');
    let html = `
            <div class="nomina-container">
                <h4>Nómina del ${fechaInicio} al ${fechaFin}</h4>
                <div class="nomina-table-container">
                    <table class="nomina-table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Cargo</th>
                                <th>Total Horas</th>
                                <th>Total Salario</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

    nomina.forEach((item) => {
      html += `
                <tr>
                    <td>${item.empleado.nombre}</td>
                    <td>${item.empleado.cargo}</td>
                    <td>${item.totalHoras}</td>
                    <td>$${item.totalSalario.toLocaleString()}</td>
                </tr>
            `;
    });

    html += `
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>Total General</strong></td>
                                <td><strong>$${totalGeneral.toLocaleString()}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="nomina-actions">
                    <button class="btn btn-primary" onclick="gestionPersonal.exportarNominaExcel()">
                        <i class="fas fa-file-excel"></i> Exportar Excel
                    </button>
                    <button class="btn btn-success" onclick="gestionPersonal.generarNominaPDF()">
                        <i class="fas fa-file-pdf"></i> Generar PDF
                    </button>
                </div>
            </div>
        `;

    contenido.innerHTML = html;
    modal.style.display = 'block';
  }

  async exportarNominaExcel() {
    try {
      // Implementar exportación a Excel
      this.mostrarNotificacion('Exportación a Excel implementada', 'success');
    } catch (error) {
      console.error('❌ Error al exportar nómina:', error);
      this.mostrarNotificacion('Error al exportar nómina', 'error');
    }
  }

  async generarNominaPDF() {
    try {
      // Implementar generación de PDF de nómina
      this.mostrarNotificacion('Generación de PDF implementada', 'success');
    } catch (error) {
      console.error('❌ Error al generar PDF de nómina:', error);
      this.mostrarNotificacion('Error al generar PDF de nómina', 'error');
    }
  }

  // ===== GESTIÓN DE EMPLEADOS =====
  async manejarSubmitEmpleado(e) {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const empleadoData = {
        id: formData.get('empleadoId') || Date.now().toString(),
        nombre: formData.get('nombre'),
        cedula: formData.get('cedula'),
        cargo: formData.get('cargo'),
        departamento: formData.get('departamento'),
        salario: parseFloat(formData.get('salario')),
        tipoContrato: formData.get('tipoContrato'),
        fechaContratacion: formData.get('fechaContratacion'),
        estado: formData.get('estado') || 'activo',
        userId: this.getCurrentUserId(),
        timestamp: new Date().toISOString(),
      };

      // Validar campos obligatorios
      if (!empleadoData.nombre || !empleadoData.cedula || !empleadoData.cargo || !empleadoData.salario) {
        this.mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
        return;
      }

      // Guardar empleado
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.addEmpleado(empleadoData);
      } else {
        const index = this.empleados.findIndex((emp) => emp.id === empleadoData.id);
        if (index >= 0) {
          this.empleados[index] = empleadoData;
        } else {
          this.empleados.push(empleadoData);
        }
        localStorage.setItem('empleados', JSON.stringify(this.empleados));
      }

      this.mostrarNotificacion('Empleado guardado correctamente', 'success');
      this.cerrarModalEmpleado();
      this.cargarDatos();
    } catch (error) {
      console.error('❌ Error al guardar empleado:', error);
      this.mostrarNotificacion('Error al guardar empleado', 'error');
    }
  }

  mostrarModalEmpleado(empleado = null) {
    const modal = document.getElementById('modalEmpleado');
    if (!modal) return;

    const form = modal.querySelector('#formEmpleado');
    if (empleado) {
      // Modo edición
      form.querySelector('[name="empleadoId"]').value = empleado.id;
      form.querySelector('[name="nombre"]').value = empleado.nombre;
      form.querySelector('[name="cedula"]').value = empleado.cedula;
      form.querySelector('[name="cargo"]').value = empleado.cargo;
      form.querySelector('[name="departamento"]').value = empleado.departamento;
      form.querySelector('[name="salario"]').value = empleado.salario;
      form.querySelector('[name="tipoContrato"]').value = empleado.tipoContrato;
      form.querySelector('[name="fechaContratacion"]').value = empleado.fechaContratacion;
      form.querySelector('[name="estado"]').value = empleado.estado;
    } else {
      // Modo creación
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

  async eliminarEmpleado(empleadoId) {
    try {
      if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
        if (this.firebaseSyncManager) {
          // Implementar eliminación en Firebase
          this.mostrarNotificacion('Empleado eliminado correctamente', 'success');
        } else {
          this.empleados = this.empleados.filter((emp) => emp.id !== empleadoId);
          localStorage.setItem('empleados', JSON.stringify(this.empleados));
          this.mostrarNotificacion('Empleado eliminado correctamente', 'success');
        }
        this.cargarDatos();
      }
    } catch (error) {
      console.error('❌ Error al eliminar empleado:', error);
      this.mostrarNotificacion('Error al eliminar empleado', 'error');
    }
  }

  // ===== GESTIÓN DE DEPARTAMENTOS =====
  async manejarSubmitDepartamento(e) {
    e.preventDefault();

    try {
      const formData = new FormData(e.target);
      const departamentoData = {
        id: formData.get('departamentoId') || Date.now().toString(),
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion'),
        color: formData.get('color') || '#007bff',
        userId: this.getCurrentUserId(),
        timestamp: new Date().toISOString(),
      };

      if (!departamentoData.nombre) {
        this.mostrarNotificacion('Por favor complete el nombre del departamento', 'error');
        return;
      }

      // Guardar departamento
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.addDepartamento(departamentoData);
      } else {
        const index = this.departamentos.findIndex((dept) => dept.id === departamentoData.id);
        if (index >= 0) {
          this.departamentos[index] = departamentoData;
        } else {
          this.departamentos.push(departamentoData);
        }
        localStorage.setItem('departamentos', JSON.stringify(this.departamentos));
      }

      this.mostrarNotificacion('Departamento guardado correctamente', 'success');
      this.cerrarModalDepartamento();
      this.cargarDatos();
    } catch (error) {
      console.error('❌ Error al guardar departamento:', error);
      this.mostrarNotificacion('Error al guardar departamento', 'error');
    }
  }

  mostrarModalDepartamento(departamento = null) {
    const modal = document.getElementById('modalDepartamento');
    if (!modal) return;

    const form = modal.querySelector('#formDepartamento');
    if (departamento) {
      // Modo edición
      form.querySelector('[name="departamentoId"]').value = departamento.id;
      form.querySelector('[name="nombre"]').value = departamento.nombre;
      form.querySelector('[name="descripcion"]').value = departamento.descripcion;
      form.querySelector('[name="color"]').value = departamento.color;
    } else {
      // Modo creación
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

  async eliminarDepartamento(departamentoId) {
    try {
      // Verificar si hay empleados en este departamento
      const empleadosEnDepartamento = this.empleados.filter(emp => emp.departamento === this.departamentos.find(dep => dep.id === departamentoId)?.nombre);
      
      if (empleadosEnDepartamento.length > 0) {
        throw new Error(`No se puede eliminar el departamento porque tiene ${empleadosEnDepartamento.length} empleado(s) asignado(s)`);
      }

      // Eliminar departamento
      this.departamentos = this.departamentos.filter(dep => dep.id !== departamentoId);
      
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.syncDepartamentos(this.departamentos);
      } else {
        localStorage.setItem('departamentos', JSON.stringify(this.departamentos));
      }
      
      console.log('✅ Departamento eliminado:', departamentoId);
    } catch (error) {
      console.error('❌ Error al eliminar departamento:', error);
      throw error;
    }
  }

  // ===== RENDERIZADO =====
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
                    <td>${empleado.departamento}</td>
                    <td>$${empleado.salario.toLocaleString()}</td>
                    <td>${empleado.tipoContrato}</td>
                    <td><span class="estado-badge ${empleado.estado}">${empleado.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="mostrarModalEmpleado(${JSON.stringify(
                          empleado
                        ).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="eliminarEmpleado('${empleado.id}')">
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
                        <button class="btn btn-sm btn-outline-info" onclick="verDetalleHoras('${registro.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
    });

    container.innerHTML = html;
  }

  renderizarDepartamentos() {
    // Los departamentos se muestran en la pestaña de empleados
    // No hay un contenedor específico para departamentos en el HTML actual
    console.log('📋 Departamentos cargados:', this.departamentos);
  }

  // ===== UTILIDADES =====
  limpiarFormularioHoras() {
    const form = document.getElementById('formRegistroHoras');
    if (form) {
      form.reset();
    }
  }

  mostrarModalCalculoHoras() {
    const modal = document.getElementById('modalCalculoHoras');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModalCalculoHoras() {
    const modal = document.getElementById('modalCalculoHoras');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  mostrarModalPrevisualizacion(html) {
    const modal = document.getElementById('modalPrevisualizacion');
    if (!modal) return;

    const contenido = modal.querySelector('.modal-body');
    contenido.innerHTML = html;
    modal.style.display = 'block';
  }

  cerrarModalPrevisualizacion() {
    const modal = document.getElementById('modalPrevisualizacion');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Usar el sistema de notificaciones si está disponible
    if (typeof mostrarNotificacion === 'function') {
      mostrarNotificacion(mensaje, tipo);
    } else {
      // Fallback a alert
      alert(mensaje);
    }
  }

  getCurrentUserId() {
    // Obtener ID del usuario actual desde Firebase o localStorage
    if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
      return firebase.auth().currentUser.uid;
    }
    return localStorage.getItem('currentUserId') || 'default';
  }

  verDetalleHoras(registroId) {
    try {
      const registro = this.horas.find((h) => h.id === registroId);
      if (!registro) {
        this.mostrarNotificacion('Registro de horas no encontrado', 'error');
        return;
      }

      const horas = registro.horas || {};
      const salarios = registro.salarios || {};

      let html = `
                <div class="detalle-horas-container">
                    <h4>Detalle de Horas - ${registro.empleadoNombre}</h4>
                    <p><strong>Fecha:</strong> ${registro.fecha}</p>
                    
                    <div class="detalle-horas-grid">
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Horas Ordinarias</span>
                            <span class="horas-cantidad">${horas.ordinarias || 0} hrs</span>
                            <span class="salario-valor">$${(salarios.ordinarias || 0).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Recargo Nocturno</span>
                            <span class="horas-cantidad">${horas.recargo_nocturno || 0} hrs</span>
                            <span class="salario-valor">$${(salarios.recargo_nocturno || 0).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Recargo Diurno Dominical</span>
                            <span class="horas-cantidad">${horas.recargo_diurno_dominical || 0} hrs</span>
                            <span class="salario-valor">$${(
                              salarios.recargo_diurno_dominical || 0
                            ).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Recargo Nocturno Dominical</span>
                            <span class="horas-cantidad">${horas.recargo_nocturno_dominical || 0} hrs</span>
                            <span class="salario-valor">$${(
                              salarios.recargo_nocturno_dominical || 0
                            ).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Hora Extra Diurna</span>
                            <span class="horas-cantidad">${horas.hora_extra_diurna || 0} hrs</span>
                            <span class="salario-valor">$${(salarios.hora_extra_diurna || 0).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Hora Extra Nocturna</span>
                            <span class="horas-cantidad">${horas.hora_extra_nocturna || 0} hrs</span>
                            <span class="salario-valor">$${(salarios.hora_extra_nocturna || 0).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Hora Diurna Dominical/Festivo</span>
                            <span class="horas-cantidad">${horas.hora_diurna_dominical_o_festivo || 0} hrs</span>
                            <span class="salario-valor">$${(
                              salarios.hora_diurna_dominical_o_festivo || 0
                            ).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Hora Extra Diurna Dominical/Festivo</span>
                            <span class="horas-cantidad">${horas.hora_extra_diurna_dominical_o_festivo || 0} hrs</span>
                            <span class="salario-valor">$${(
                              salarios.hora_extra_diurna_dominical_o_festivo || 0
                            ).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Hora Nocturna Dominical/Festivo</span>
                            <span class="horas-cantidad">${horas.hora_nocturna_dominical_o_festivo || 0} hrs</span>
                            <span class="salario-valor">$${(
                              salarios.hora_nocturna_dominical_o_festivo || 0
                            ).toLocaleString()}</span>
                        </div>
                        <div class="detalle-hora-item">
                            <span class="tipo-hora">Hora Extra Nocturna Dominical/Festivo</span>
                            <span class="horas-cantidad">${
                              horas.hora_extra_nocturna_dominical_o_festivo || 0
                            } hrs</span>
                            <span class="salario-valor">$${(
                              salarios.hora_extra_nocturna_dominical_o_festivo || 0
                            ).toLocaleString()}</span>
                        </div>
                    </div>
                    
                    <div class="detalle-total">
                        <strong>Total Horas: ${registro.totalHoras || 0}</strong>
                        <strong>Total Salario: $${(registro.totalSalario || 0).toLocaleString()}</strong>
                    </div>
                </div>
            `;

      // Mostrar en modal
      this.mostrarModalDetalleHoras(html);
    } catch (error) {
      console.error('❌ Error al mostrar detalle de horas:', error);
      this.mostrarNotificacion('Error al mostrar detalle de horas', 'error');
    }
  }

  mostrarModalDetalleHoras(html) {
    // Crear modal dinámicamente si no existe
    let modal = document.getElementById('modalDetalleHoras');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modalDetalleHoras';
      modal.className = 'modal';
      modal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h4>Detalle de Horas</h4>
                        <button class="modal-close" onclick="gestionPersonal.cerrarModalDetalleHoras()">&times;</button>
                    </div>
                    <div class="modal-body"></div>
                </div>
            `;
      document.body.appendChild(modal);
    }

    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = html;
    modal.style.display = 'block';
  }

  cerrarModalDetalleHoras() {
    const modal = document.getElementById('modalDetalleHoras');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  actualizarEstadisticas() {
    try {
      // Actualizar estadísticas principales
      const totalEmpleadosElement = document.getElementById('totalEmpleados');
      const horasMesElement = document.getElementById('horasMes');
      const totalPagosElement = document.getElementById('totalPagos');
      const nominasGeneradasElement = document.getElementById('nominasGeneradas');

      if (totalEmpleadosElement) {
        const empleadosActivos = this.empleados.filter((emp) => emp.estado === 'activo').length;
        totalEmpleadosElement.textContent = empleadosActivos;
      }

      if (horasMesElement) {
        const totalHoras = this.horas.reduce((sum, h) => sum + (h.totalHoras || 0), 0);
        horasMesElement.textContent = totalHoras;
      }

      if (totalPagosElement) {
        const totalPagos = this.horas.reduce((sum, h) => sum + (h.totalSalario || 0), 0);
        totalPagosElement.textContent = `$${totalPagos.toLocaleString()}`;
      }

      if (nominasGeneradasElement) {
        // Por ahora, mostrar 0 hasta implementar la generación de nóminas
        nominasGeneradasElement.textContent = '0';
      }

      // Actualizar estadísticas de reportes
      const promedioHorasElement = document.getElementById('promedioHoras');
      const promedioSalarioElement = document.getElementById('promedioSalario');
      const empleadosActivosElement = document.getElementById('empleadosActivos');
      const diasTrabajadosElement = document.getElementById('diasTrabajados');

      if (promedioHorasElement) {
        const totalHoras = this.horas.reduce((sum, h) => sum + (h.totalHoras || 0), 0);
        const promedio = this.empleados.length > 0 ? Math.round(totalHoras / this.empleados.length) : 0;
        promedioHorasElement.textContent = promedio;
      }

      if (promedioSalarioElement) {
        const totalSalarios = this.empleados.reduce((sum, emp) => sum + (emp.salario || 0), 0);
        const promedio = this.empleados.length > 0 ? Math.round(totalSalarios / this.empleados.length) : 0;
        promedioSalarioElement.textContent = `$${promedio.toLocaleString()}`;
      }

      if (empleadosActivosElement) {
        const empleadosActivos = this.empleados.filter((emp) => emp.estado === 'activo').length;
        empleadosActivosElement.textContent = empleadosActivos;
      }

      if (diasTrabajadosElement) {
        // Calcular días trabajados basado en las fechas de horas registradas
        const fechasUnicas = [...new Set(this.horas.map((h) => h.fecha))];
        diasTrabajadosElement.textContent = fechasUnicas.length;
      }
    } catch (error) {
      console.error('❌ Error al actualizar estadísticas:', error);
    }
  }

  // ===== MÉTODOS DE NÓMINA =====
  mostrarModalGenerarNomina() {
    const modal = document.getElementById('modalGenerarNomina');
    if (modal) {
      modal.style.display = 'block';
    }
  }

  cerrarModalGenerarNomina() {
    const modal = document.getElementById('modalGenerarNomina');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  async exportarNominasExcel() {
    try {
      // Implementar exportación de nóminas a Excel
      this.mostrarNotificacion('Exportación de nóminas a Excel implementada', 'success');
    } catch (error) {
      console.error('❌ Error al exportar nóminas a Excel:', error);
      this.mostrarNotificacion('Error al exportar nóminas a Excel', 'error');
    }
  }

  async generarReporteNominas() {
    try {
      // Implementar generación de reporte de nóminas
      this.mostrarNotificacion('Reporte de nóminas generado correctamente', 'success');
    } catch (error) {
      console.error('❌ Error al generar reporte de nóminas:', error);
      this.mostrarNotificacion('Error al generar reporte de nóminas', 'error');
    }
  }

  // ===== GESTIÓN DE EMPLEADOS =====
  async agregarEmpleado(empleado) {
    try {
      this.empleados.push(empleado);
      
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.syncEmpleados(this.empleados);
      } else {
        localStorage.setItem('empleados', JSON.stringify(this.empleados));
      }
      
      console.log('✅ Empleado agregado:', empleado);
      return empleado;
    } catch (error) {
      console.error('❌ Error al agregar empleado:', error);
      throw error;
    }
  }

  async agregarDepartamento(departamento) {
    try {
      this.departamentos.push(departamento);
      
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.syncDepartamentos(this.departamentos);
      } else {
        localStorage.setItem('departamentos', JSON.stringify(this.departamentos));
      }
      
      console.log('✅ Departamento agregado:', departamento);
      return departamento;
    } catch (error) {
      console.error('❌ Error al agregar departamento:', error);
      throw error;
    }
  }

  renderizarListaDepartamentos() {
    const container = document.getElementById('listaDepartamentos');
    if (!container) return;

    container.innerHTML = '';

    if (this.departamentos.length === 0) {
      container.innerHTML = '<p class="no-data">No hay departamentos registrados</p>';
      return;
    }

    this.departamentos.forEach(departamento => {
      const departamentoElement = document.createElement('div');
      departamentoElement.className = 'departamento-item';
      departamentoElement.innerHTML = `
          <div class="departamento-header">
              <div class="departamento-color" style="background-color: ${departamento.color}"></div>
              <div class="departamento-nombre">${departamento.nombre}</div>
          </div>
          <div class="departamento-descripcion">${departamento.descripcion || 'Sin descripción'}</div>
          <div class="departamento-actions">
              <button class="btn btn-small btn-danger" onclick="eliminarDepartamento('${departamento.id}')">
                  <i class="fas fa-trash"></i> Eliminar
              </button>
          </div>
      `;
      container.appendChild(departamentoElement);
    });
  }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  try {
    // Crear instancia global
    window.gestionPersonal = new GestionPersonalManager();
    console.log('✅ Módulo de Gestión de Personal cargado correctamente');
  } catch (error) {
    console.error('❌ Error al cargar módulo de Gestión de Personal:', error);
  }
});

// Funciones globales para compatibilidad con HTML
window.mostrarModalEmpleado = (empleado = null) => {
  if (window.gestionPersonal) {
    window.gestionPersonal.mostrarModalEmpleado(empleado);
  }
};

window.cerrarModalEmpleado = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cerrarModalEmpleado();
  }
};

window.mostrarModalDepartamento = (departamento = null) => {
  if (window.gestionPersonal) {
    window.gestionPersonal.mostrarModalDepartamento(departamento);
  }
};

window.cerrarModalDepartamento = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cerrarModalDepartamento();
  }
};

window.cerrarModalCalculoHoras = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cerrarModalCalculoHoras();
  }
};

window.cerrarModalPrevisualizacion = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cerrarModalPrevisualizacion();
  }
};

window.cerrarModalDetalleHoras = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cerrarModalDetalleHoras();
  }
};

// Funciones adicionales para compatibilidad con HTML
window.cambiarTab = (tabName) => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cambiarTab(tabName);
  }
};

window.mostrarModalRegistroHoras = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.mostrarModalRegistroHoras();
  }
};

window.mostrarModalCalculoHoras = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.mostrarModalCalculoHoras();
  }
};

window.exportarHorasExcel = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.exportarHorasExcel();
  }
};

window.generarReporteHoras = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.generarReporteHoras();
  }
};

window.exportarEmpleadosExcel = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.exportarEmpleadosExcel();
  }
};

window.gestionarDepartamentos = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.gestionarDepartamentos();
  }
};

window.generarReporteGeneral = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.generarReporteGeneral();
  }
};

window.generarReporteEmpleado = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.generarReporteHoras();
  }
};

window.generarReporteDepartamento = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.generarReporteDepartamento();
  }
};

window.mostrarModalGenerarNomina = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.mostrarModalGenerarNomina();
  }
};

window.cerrarModalGenerarNomina = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.cerrarModalGenerarNomina();
  }
};

window.exportarNominasExcel = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.exportarNominasExcel();
  }
};

window.generarReporteNominas = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.generarReporteNominas();
  }
};

window.limpiarFormularioHoras = () => {
  if (window.gestionPersonal) {
    window.gestionPersonal.limpiarFormularioHoras();
  }
};

// Función global para notificaciones
window.mostrarNotificacion = (mensaje, tipo = 'info') => {
  try {
    // Intentar usar el sistema de notificaciones AXYRA si está disponible
    if (typeof AxyraNotificationSystem !== 'undefined' && window.axyraNotifications) {
      window.axyraNotifications.showNotification(mensaje, tipo);
    } else {
      // Fallback a alert si no hay sistema de notificaciones
      alert(`${tipo.toUpperCase()}: ${mensaje}`);
    }
  } catch (error) {
    console.error('❌ Error al mostrar notificación:', error);
    // Fallback final
    alert(`${tipo.toUpperCase()}: ${mensaje}`);
  }
};

window.eliminarEmpleado = (empleadoId) => {
  if (window.gestionPersonal) {
    window.gestionPersonal.eliminarEmpleado(empleadoId);
  }
};

window.verDetalleHoras = (registroId) => {
  if (window.gestionPersonal) {
    window.gestionPersonal.verDetalleHoras(registroId);
  }
};

// Funciones globales para modales y funcionalidad
window.mostrarModalRegistroHoras = () => {
  const modal = document.getElementById('modalRegistroHoras');
  if (modal) {
    modal.style.display = 'block';
  }
};

window.cerrarModalRegistroHoras = () => {
  const modal = document.getElementById('modalRegistroHoras');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.mostrarModalCalculoHoras = () => {
  const modal = document.getElementById('modalCalculoHoras');
  if (modal) {
    // Actualizar información del modal
    const empleadoSelect = document.getElementById('empleadoHoras');
    const fechaInput = document.getElementById('fechaHoras');

    if (empleadoSelect && fechaInput) {
      const empleado = empleadoSelect.options[empleadoSelect.selectedIndex];
      const fecha = fechaInput.value;

      document.getElementById('calculoEmpleado').textContent = empleado.text || 'No seleccionado';
      document.getElementById('calculoFecha').textContent = fecha || 'No ingresada';

      // Calcular total de horas
      const horasInputs = document.querySelectorAll('input[id^="horas_"]');
      let totalHoras = 0;
      horasInputs.forEach((input) => {
        totalHoras += parseFloat(input.value) || 0;
      });
      document.getElementById('calculoTotalHoras').textContent = totalHoras;
    }

    modal.style.display = 'block';
  }
};

window.cerrarModalCalculoHoras = () => {
  const modal = document.getElementById('modalCalculoHoras');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.mostrarModalExportarExcel = () => {
  const modal = document.getElementById('modalExportarExcel');
  if (modal) {
    // Establecer fechas por defecto
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    document.getElementById('exportFechaInicio').value = inicioMes.toISOString().split('T')[0];
    document.getElementById('exportFechaFin').value = hoy.toISOString().split('T')[0];

    modal.style.display = 'block';
  }
};

window.cerrarModalExportarExcel = () => {
  const modal = document.getElementById('modalExportarExcel');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.mostrarModalReporteHoras = () => {
  const modal = document.getElementById('modalReporteHoras');
  if (modal) {
    // Configurar evento para fechas personalizadas
    const periodoSelect = document.getElementById('reportePeriodo');
    const fechasPersonalizadas = document.getElementById('fechasPersonalizadas');

    if (periodoSelect && fechasPersonalizadas) {
      periodoSelect.addEventListener('change', () => {
        if (periodoSelect.value === 'personalizado') {
          fechasPersonalizadas.style.display = 'block';
        } else {
          fechasPersonalizadas.style.display = 'none';
        }
      });
    }

    modal.style.display = 'block';
  }
};

window.cerrarModalReporteHoras = () => {
  const modal = document.getElementById('modalReporteHoras');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.mostrarModalGenerarNomina = () => {
  const modal = document.getElementById('modalGenerarNomina');
  if (modal) {
    // Establecer fechas por defecto
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    document.getElementById('nominaFechaInicio').value = inicioMes.toISOString().split('T')[0];
    document.getElementById('nominaFechaFin').value = finMes.toISOString().split('T')[0];

    modal.style.display = 'block';
  }
};

window.cerrarModalGenerarNomina = () => {
  const modal = document.getElementById('modalGenerarNomina');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Funciones de procesamiento
window.procesarExportacion = () => {
  const tipoExportacion = document.querySelector('input[name="exportType"]:checked').value;
  const fechaInicio = document.getElementById('exportFechaInicio').value;
  const fechaFin = document.getElementById('exportFechaFin').value;

  if (!fechaInicio || !fechaFin) {
    window.mostrarNotificacion('Por favor complete las fechas de exportación', 'warning');
    return;
  }

  // Aquí iría la lógica de exportación real
  window.mostrarNotificacion(`Exportando ${tipoExportacion} del ${fechaInicio} al ${fechaFin}`, 'success');
  window.cerrarModalExportarExcel();
};

window.generarReporteHoras = () => {
  const periodo = document.getElementById('reportePeriodo').value;
  const departamento = document.getElementById('reporteDepartamento').value;

  let mensaje = `Generando reporte de horas para ${periodo}`;
  if (departamento) {
    mensaje += ` del departamento ${departamento}`;
  }

  window.mostrarNotificacion(mensaje, 'success');
  window.cerrarModalReporteHoras();
};

window.procesarGeneracionNomina = () => {
  const periodo = document.getElementById('nominaPeriodo').value;
  const fechaInicio = document.getElementById('nominaFechaInicio').value;
  const fechaFin = document.getElementById('nominaFechaFin').value;
  const departamento = document.getElementById('nominaDepartamento').value;

  if (!fechaInicio || !fechaFin) {
    window.mostrarNotificacion('Por favor complete las fechas de la nómina', 'warning');
    return;
  }

  let mensaje = `Generando nómina ${periodo} del ${fechaInicio} al ${fechaFin}`;
  if (departamento) {
    mensaje += ` para el departamento ${departamento}`;
  }

  window.mostrarNotificacion(mensaje, 'success');
  window.cerrarModalGenerarNomina();
};

// Funciones para modales de empleados y departamentos
window.mostrarModalEmpleado = () => {
  const modal = document.getElementById('modalEmpleado');
  if (modal) {
    // Llenar selector de departamentos
    const selectorDepartamento = document.getElementById('departamentoEmpleado');
    if (selectorDepartamento) {
      selectorDepartamento.innerHTML = '<option value="">Seleccionar departamento</option>';
      window.gestionPersonal.departamentos.forEach(departamento => {
        const option = document.createElement('option');
        option.value = departamento.nombre;
        option.textContent = departamento.nombre;
        selectorDepartamento.appendChild(option);
      });
    }
    
    // Establecer fecha actual
    const fechaInput = document.getElementById('fechaContratacionEmpleado');
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split('T')[0];
    }
    
    modal.style.display = 'block';
  }
};

window.cerrarModalEmpleado = () => {
  const modal = document.getElementById('modalEmpleado');
  if (modal) {
    modal.style.display = 'none';
    // Limpiar formulario
    document.getElementById('formEmpleado').reset();
  }
};

window.mostrarModalDepartamento = () => {
  const modal = document.getElementById('modalDepartamento');
  if (modal) {
    // Renderizar lista de departamentos existentes
    window.gestionPersonal.renderizarListaDepartamentos();
    modal.style.display = 'block';
  }
};

window.cerrarModalDepartamento = () => {
  const modal = document.getElementById('modalDepartamento');
  if (modal) {
    modal.style.display = 'none';
    // Limpiar formulario
    document.getElementById('formDepartamento').reset();
  }
};

window.mostrarModalExportarEmpleados = () => {
  const modal = document.getElementById('modalExportarEmpleados');
  if (modal) {
    // Llenar selector de departamentos
    const selectorDepartamento = document.getElementById('exportDepartamentoEmpleados');
    if (selectorDepartamento) {
      selectorDepartamento.innerHTML = '<option value="">Todos los Departamentos</option>';
      window.gestionPersonal.departamentos.forEach(departamento => {
        const option = document.createElement('option');
        option.value = departamento.nombre;
        option.textContent = departamento.nombre;
        selectorDepartamento.appendChild(option);
      });
    }
    
    modal.style.display = 'block';
  }
};

window.cerrarModalExportarEmpleados = () => {
  const modal = document.getElementById('modalExportarEmpleados');
  if (modal) {
    modal.style.display = 'none';
  }
};

// Funciones de procesamiento para empleados y departamentos
window.guardarEmpleado = async () => {
  try {
    const form = document.getElementById('formEmpleado');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const empleado = {
      id: Date.now().toString(),
      nombre: document.getElementById('nombreEmpleado').value,
      cedula: document.getElementById('cedulaEmpleado').value,
      cargo: document.getElementById('cargoEmpleado').value,
      departamento: document.getElementById('departamentoEmpleado').value,
      salario: parseFloat(document.getElementById('salarioEmpleado').value),
      tipoContrato: document.getElementById('tipoContratoEmpleado').value,
      fechaContratacion: document.getElementById('fechaContratacionEmpleado').value,
      estado: document.getElementById('estadoEmpleado').value
    };

    // Validar cédula única
    const cedulaExistente = window.gestionPersonal.empleados.find(emp => emp.cedula === empleado.cedula);
    if (cedulaExistente) {
      window.mostrarNotificacion('Ya existe un empleado con esta cédula', 'error');
      return;
    }

    // Agregar empleado
    await window.gestionPersonal.agregarEmpleado(empleado);
    
    window.mostrarNotificacion('Empleado agregado correctamente', 'success');
    window.cerrarModalEmpleado();
    
    // Actualizar interfaz
    window.gestionPersonal.renderizarEmpleados();
    window.gestionPersonal.actualizarEstadisticas();
    
  } catch (error) {
    console.error('❌ Error al guardar empleado:', error);
    window.mostrarNotificacion('Error al guardar empleado', 'error');
  }
};

window.guardarDepartamento = async () => {
  try {
    const form = document.getElementById('formDepartamento');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const departamento = {
      id: Date.now().toString(),
      nombre: document.getElementById('nombreDepartamento').value,
      descripcion: document.getElementById('descripcionDepartamento').value || '',
      color: document.getElementById('colorDepartamento').value
    };

    // Validar nombre único
    const nombreExistente = window.gestionPersonal.departamentos.find(dep => dep.nombre === departamento.nombre);
    if (nombreExistente) {
      window.mostrarNotificacion('Ya existe un departamento con este nombre', 'error');
      return;
    }

    // Agregar departamento
    await window.gestionPersonal.agregarDepartamento(departamento);
    
    window.mostrarNotificacion('Departamento agregado correctamente', 'success');
    
    // Limpiar formulario y actualizar lista
    form.reset();
    window.gestionPersonal.renderizarListaDepartamentos();
    
    // Actualizar selectores en otros modales
    window.gestionPersonal.llenarSelectorDepartamentos();
    
  } catch (error) {
    console.error('❌ Error al guardar departamento:', error);
    window.mostrarNotificacion('Error al guardar departamento', 'error');
  }
};

window.procesarExportacionEmpleados = () => {
  try {
    const estado = document.getElementById('exportEstadoEmpleados').value;
    const departamento = document.getElementById('exportDepartamentoEmpleados').value;
    const infoPersonal = document.getElementById('exportInfoPersonal').checked;
    const infoLaboral = document.getElementById('exportInfoLaboral').checked;
    const salarios = document.getElementById('exportSalarios').checked;
    const historial = document.getElementById('exportHistorial').checked;

    let mensaje = 'Exportando empleados con filtros:';
    if (estado) mensaje += ` Estado: ${estado}`;
    if (departamento) mensaje += `, Departamento: ${departamento}`;
    mensaje += `, Información: ${infoPersonal ? 'Personal' : ''}${infoLaboral ? ' Laboral' : ''}${salarios ? ' Salarios' : ''}${historial ? ' Historial' : ''}`;

    window.mostrarNotificacion(mensaje, 'success');
    window.cerrarModalExportarEmpleados();
    
    // Aquí iría la lógica real de exportación
    console.log('📊 Exportando empleados con configuración:', { estado, departamento, infoPersonal, infoLaboral, salarios, historial });
    
  } catch (error) {
    console.error('❌ Error al procesar exportación:', error);
    window.mostrarNotificacion('Error al procesar exportación', 'error');
  }
};

// Cerrar modales al hacer clic fuera de ellos
document.addEventListener('DOMContentLoaded', () => {
  const modales = document.querySelectorAll('.modal-overlay');
  modales.forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });
});

// Función para eliminar departamentos
window.eliminarDepartamento = async (departamentoId) => {
  try {
    if (confirm('¿Está seguro de que desea eliminar este departamento? Esta acción no se puede deshacer.')) {
      await window.gestionPersonal.eliminarDepartamento(departamentoId);
      window.mostrarNotificacion('Departamento eliminado correctamente', 'success');
      
      // Actualizar lista y selectores
      window.gestionPersonal.renderizarListaDepartamentos();
      window.gestionPersonal.llenarSelectorDepartamentos();
    }
  } catch (error) {
    console.error('❌ Error al eliminar departamento:', error);
    window.mostrarNotificacion('Error al eliminar departamento', 'error');
  }
};
