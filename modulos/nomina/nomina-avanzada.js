/**
 * AXYRA - Sistema Avanzado de Nómina
 * Sistema completo de gestión de nómina con cálculos automáticos, reportes y análisis
 */

class AxyraNominaAvanzada {
  constructor() {
    this.empleados = [];
    this.nominas = [];
    this.configuracion = this.getConfiguracionDefault();
    this.historialNominas = [];
    this.auditoria = [];
    this.estadisticas = {};

    this.init();
  }

  async init() {
    try {
      await this.cargarDatos();
      this.configurarEventos();
      this.actualizarMetricas();
      this.configurarValidaciones();
      console.log('✅ AxyraNominaAvanzada inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de nómina:', error);
    }
  }

  getConfiguracionDefault() {
    return {
      salarioMinimo: 1160000, // Salario mínimo 2024 Colombia
      cesantias: 8.33,
      salud: 4.0,
      pension: 4.0,
      riesgo: 0.522,
      cajaCompensacion: 4.0,
      sena: 2.0,
      icbf: 3.0,
      horasMes: 240,
      factorHorasExtras: 1.5,
      factorHorasNocturnas: 1.35,
      factorHorasFestivas: 2.0,
      factorHorasFestivasNocturnas: 2.5,
      diasVacaciones: 15,
      primaServicios: 8.33,
      bonificacionTransporte: 140606,
      auxilioTransporte: 140606,
      fechaActualizacion: new Date().toISOString(),
    };
  }

  async cargarDatos() {
    try {
      // Cargar empleados
      this.empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');

      // Cargar nóminas
      this.nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');

      // Cargar configuración
      const configGuardada = localStorage.getItem('axyra_config_nomina');
      if (configGuardada) {
        this.configuracion = { ...this.configuracion, ...JSON.parse(configGuardada) };
      }

      // Cargar historial
      this.historialNominas = JSON.parse(localStorage.getItem('axyra_historial_nominas') || '[]');

      // Cargar auditoría
      this.auditoria = JSON.parse(localStorage.getItem('axyra_auditoria_nomina') || '[]');

      console.log(`📊 Datos cargados: ${this.empleados.length} empleados, ${this.nominas.length} nóminas`);
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
    }
  }

  configurarEventos() {
    // Event listeners para botones principales
    this.configurarBotonesPrincipales();

    // Event listeners para filtros y búsquedas
    this.configurarFiltros();

    // Event listeners para modales
    this.configurarModales();
  }

  configurarBotonesPrincipales() {
    const botones = {
      btnGenerarNomina: () => this.mostrarModalGenerarNomina(),
      btnExportarExcel: () => this.exportarExcel(),
      btnGenerarPDF: () => this.generarPDF(),
      btnReportes: () => this.mostrarReportes(),
      btnConfiguracion: () => this.mostrarConfiguracion(),
      btnHistorial: () => this.mostrarHistorial(),
      btnAuditoria: () => this.mostrarAuditoria(),
    };

    Object.entries(botones).forEach(([id, handler]) => {
      const boton = document.getElementById(id);
      if (boton) {
        boton.onclick = handler;
      }
    });
  }

  configurarFiltros() {
    // Filtro por empleado
    const filtroEmpleado = document.getElementById('filtroEmpleado');
    if (filtroEmpleado) {
      filtroEmpleado.addEventListener('change', () => this.aplicarFiltros());
    }

    // Filtro por mes
    const filtroMes = document.getElementById('filtroMes');
    if (filtroMes) {
      filtroMes.addEventListener('change', () => this.aplicarFiltros());
    }

    // Filtro por estado
    const filtroEstado = document.getElementById('filtroEstado');
    if (filtroEstado) {
      filtroEstado.addEventListener('change', () => this.aplicarFiltros());
    }
  }

  configurarModales() {
    // Cerrar modales al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('axyra-modal-overlay')) {
        this.cerrarModal(e.target.id);
      }
    });

    // Cerrar modales con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modalesAbiertos = document.querySelectorAll('.axyra-modal-overlay');
        modalesAbiertos.forEach((modal) => this.cerrarModal(modal.id));
      }
    });
  }

  configurarValidaciones() {
    // Validaciones en tiempo real para formularios
    const inputs = document.querySelectorAll('input[data-validation]');
    inputs.forEach((input) => {
      input.addEventListener('blur', () => this.validarCampo(input));
      input.addEventListener('input', () => this.limpiarError(input));
    });
  }

  // ========================================
  // GENERACIÓN DE NÓMINA
  // ========================================

  mostrarModalGenerarNomina() {
    const modal = this.crearModal('modalGenerarNomina', 'Generar Nueva Nómina', this.getContenidoModalGenerarNomina());
    document.body.appendChild(modal);
    this.cargarEmpleadosEnSelect();
  }

  getContenidoModalGenerarNomina() {
    return `
      <div class="axyra-form-container">
        <div class="axyra-form-section">
          <h4><i class="fas fa-user"></i> Información del Empleado</h4>
          <div class="axyra-form-group">
            <label for="empleadoSelect">Empleado *</label>
            <select id="empleadoSelect" class="axyra-form-control" required>
              <option value="">Seleccione un empleado...</option>
            </select>
          </div>
        </div>

        <div class="axyra-form-section">
          <h4><i class="fas fa-calendar"></i> Período de Nómina</h4>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="mesNomina">Mes *</label>
              <input type="month" id="mesNomina" class="axyra-form-control" 
                     value="${new Date().toISOString().slice(0, 7)}" required>
            </div>
            <div class="axyra-form-group">
              <label for="fechaCorte">Fecha de Corte</label>
              <input type="date" id="fechaCorte" class="axyra-form-control" 
                     value="${new Date().toISOString().split('T')[0]}">
            </div>
          </div>
        </div>

        <div class="axyra-form-section">
          <h4><i class="fas fa-clock"></i> Horas Trabajadas</h4>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="horasTrabajadas">Horas Ordinarias *</label>
              <input type="number" id="horasTrabajadas" class="axyra-form-control" 
                     placeholder="240" min="0" step="0.5" required>
            </div>
            <div class="axyra-form-group">
              <label for="horasExtras">Horas Extras</label>
              <input type="number" id="horasExtras" class="axyra-form-control" 
                     placeholder="0" min="0" step="0.5" value="0">
            </div>
          </div>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="horasNocturnas">Horas Nocturnas</label>
              <input type="number" id="horasNocturnas" class="axyra-form-control" 
                     placeholder="0" min="0" step="0.5" value="0">
            </div>
            <div class="axyra-form-group">
              <label for="horasFestivas">Horas Festivas</label>
              <input type="number" id="horasFestivas" class="axyra-form-control" 
                     placeholder="0" min="0" step="0.5" value="0">
            </div>
          </div>
        </div>

        <div class="axyra-form-section">
          <h4><i class="fas fa-plus-circle"></i> Bonificaciones y Descuentos</h4>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="bonificaciones">Bonificaciones</label>
              <input type="number" id="bonificaciones" class="axyra-form-control" 
                     placeholder="0" min="0" step="1000" value="0">
            </div>
            <div class="axyra-form-group">
              <label for="descuentos">Descuentos</label>
              <input type="number" id="descuentos" class="axyra-form-control" 
                     placeholder="0" min="0" step="1000" value="0">
            </div>
          </div>
        </div>

        <div class="axyra-form-section">
          <h4><i class="fas fa-info-circle"></i> Información Adicional</h4>
          <div class="axyra-form-group">
            <label for="observaciones">Observaciones</label>
            <textarea id="observaciones" class="axyra-form-control" rows="3" 
                      placeholder="Observaciones adicionales..."></textarea>
          </div>
        </div>
      </div>
    `;
  }

  cargarEmpleadosEnSelect() {
    const select = document.getElementById('empleadoSelect');
    if (select) {
      select.innerHTML = '<option value="">Seleccione un empleado...</option>';
      this.empleados.forEach((emp) => {
        const option = document.createElement('option');
        option.value = emp.id;
        option.textContent = `${emp.nombre} - ${emp.cargo} (${emp.departamento || 'Sin departamento'})`;
        select.appendChild(option);
      });
    }
  }

  generarNomina() {
    try {
      const datos = this.obtenerDatosFormulario();
      if (!this.validarDatosNomina(datos)) return;

      const empleado = this.empleados.find((emp) => emp.id === datos.empleadoId);
      if (!empleado) {
        this.mostrarError('Empleado no encontrado');
        return;
      }

      // Calcular nómina
      const calculos = this.calcularNomina(empleado, datos);

      // Crear registro de nómina
      const nomina = {
        id: this.generarId(),
        empleado_id: empleado.id,
        empleado_nombre: empleado.nombre,
        empleado_cargo: empleado.cargo,
        empleado_departamento: empleado.departamento,
        periodo: datos.mes,
        fecha_corte: datos.fechaCorte,
        ...datos,
        ...calculos,
        estado: 'GENERADA',
        fecha_generacion: new Date().toISOString(),
        usuario_generacion: this.obtenerUsuarioActual()?.nombre || 'Sistema',
      };

      // Guardar nómina
      this.nominas.push(nomina);
      this.guardarDatos();

      // Registrar en auditoría
      this.registrarAuditoria('GENERAR_NOMINA', nomina);

      this.mostrarExito('Nómina generada correctamente');
      this.cerrarModal('modalGenerarNomina');
      this.actualizarMetricas();
      this.mostrarResumenNomina(nomina);
    } catch (error) {
      console.error('Error generando nómina:', error);
      this.mostrarError('Error generando nómina: ' + error.message);
    }
  }

  obtenerDatosFormulario() {
    return {
      empleadoId: document.getElementById('empleadoSelect').value,
      mes: document.getElementById('mesNomina').value,
      fechaCorte: document.getElementById('fechaCorte').value,
      horasTrabajadas: parseFloat(document.getElementById('horasTrabajadas').value) || 0,
      horasExtras: parseFloat(document.getElementById('horasExtras').value) || 0,
      horasNocturnas: parseFloat(document.getElementById('horasNocturnas').value) || 0,
      horasFestivas: parseFloat(document.getElementById('horasFestivas').value) || 0,
      bonificaciones: parseFloat(document.getElementById('bonificaciones').value) || 0,
      descuentos: parseFloat(document.getElementById('descuentos').value) || 0,
      observaciones: document.getElementById('observaciones').value,
    };
  }

  validarDatosNomina(datos) {
    if (!datos.empleadoId) {
      this.mostrarError('Debe seleccionar un empleado');
      return false;
    }
    if (!datos.mes) {
      this.mostrarError('Debe seleccionar un mes');
      return false;
    }
    if (datos.horasTrabajadas <= 0) {
      this.mostrarError('Las horas trabajadas deben ser mayores a 0');
      return false;
    }
    return true;
  }

  calcularNomina(empleado, datos) {
    const salarioBase = parseFloat(empleado.salario) || 0;
    const valorHora = salarioBase / this.configuracion.horasMes;

    // Cálculos básicos
    const salarioOrdinario = datos.horasTrabajadas * valorHora;
    const valorHorasExtras = datos.horasExtras * valorHora * this.configuracion.factorHorasExtras;
    const valorHorasNocturnas = datos.horasNocturnas * valorHora * this.configuracion.factorHorasNocturnas;
    const valorHorasFestivas = datos.horasFestivas * valorHora * this.configuracion.factorHorasFestivas;

    const totalDevengado =
      salarioOrdinario + valorHorasExtras + valorHorasNocturnas + valorHorasFestivas + datos.bonificaciones;

    // Descuentos legales (solo para empleados fijos)
    const tipoContrato = empleado.tipoContrato || 'FIJO';
    const descuentos = this.calcularDescuentosLegales(totalDevengado, tipoContrato);

    const totalDescuentos = descuentos.total + datos.descuentos;
    const netoAPagar = totalDevengado - totalDescuentos;

    return {
      salario_base: salarioBase,
      valor_hora: valorHora,
      salario_ordinario: salarioOrdinario,
      valor_horas_extras: valorHorasExtras,
      valor_horas_nocturnas: valorHorasNocturnas,
      valor_horas_festivas: valorHorasFestivas,
      total_devengado: totalDevengado,
      ...descuentos,
      descuentos_adicionales: datos.descuentos,
      total_descuentos: totalDescuentos,
      neto_a_pagar: netoAPagar,
    };
  }

  calcularDescuentosLegales(salario, tipoContrato) {
    if (tipoContrato !== 'FIJO') {
      return {
        salud: 0,
        pension: 0,
        cesantias: 0,
        total: 0,
      };
    }

    const salud = salario * (this.configuracion.salud / 100);
    const pension = salario * (this.configuracion.pension / 100);
    const cesantias = salario * (this.configuracion.cesantias / 100);

    return {
      salud,
      pension,
      cesantias,
      total: salud + pension + cesantias,
    };
  }

  // ========================================
  // REPORTES Y ANÁLISIS
  // ========================================

  mostrarReportes() {
    const modal = this.crearModal('modalReportes', 'Reportes de Nómina', this.getContenidoReportes());
    document.body.appendChild(modal);
    this.generarGraficosReportes();
  }

  getContenidoReportes() {
    return `
      <div class="axyra-reportes-container">
        <div class="axyra-reportes-tabs">
          <button class="axyra-tab-btn active" onclick="axyraNomina.cambiarTabReporte('resumen')">
            <i class="fas fa-chart-pie"></i> Resumen
          </button>
          <button class="axyra-tab-btn" onclick="axyraNomina.cambiarTabReporte('costos')">
            <i class="fas fa-dollar-sign"></i> Costos
          </button>
          <button class="axyra-tab-btn" onclick="axyraNomina.cambiarTabReporte('empleados')">
            <i class="fas fa-users"></i> Empleados
          </button>
          <button class="axyra-tab-btn" onclick="axyraNomina.cambiarTabReporte('tendencias')">
            <i class="fas fa-chart-line"></i> Tendencias
          </button>
        </div>

        <div class="axyra-reportes-content">
          <div id="tabResumen" class="axyra-tab-content active">
            <div class="axyra-graficos-container">
              <div class="axyra-grafico">
                <canvas id="graficoCostosPorDepartamento"></canvas>
              </div>
              <div class="axyra-grafico">
                <canvas id="graficoDistribucionSalarios"></canvas>
              </div>
            </div>
          </div>

          <div id="tabCostos" class="axyra-tab-content">
            <div class="axyra-costos-container">
              <div class="axyra-costos-resumen">
                <h4>Resumen de Costos</h4>
                <div class="axyra-costos-grid" id="costosGrid">
                  <!-- Se llenará dinámicamente -->
                </div>
              </div>
            </div>
          </div>

          <div id="tabEmpleados" class="axyra-tab-content">
            <div class="axyra-empleados-container">
              <h4>Análisis por Empleado</h4>
              <div class="axyra-empleados-table" id="empleadosTable">
                <!-- Se llenará dinámicamente -->
              </div>
            </div>
          </div>

          <div id="tabTendencias" class="axyra-tab-content">
            <div class="axyra-tendencias-container">
              <canvas id="graficoTendencias"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  generarGraficosReportes() {
    // Generar gráfico de costos por departamento
    this.generarGraficoCostosDepartamento();

    // Generar gráfico de distribución de salarios
    this.generarGraficoDistribucionSalarios();

    // Generar análisis de costos
    this.generarAnalisisCostos();

    // Generar tabla de empleados
    this.generarTablaEmpleados();

    // Generar gráfico de tendencias
    this.generarGraficoTendencias();
  }

  generarGraficoCostosDepartamento() {
    const ctx = document.getElementById('graficoCostosPorDepartamento');
    if (!ctx) return;

    const costosPorDepartamento = this.calcularCostosPorDepartamento();

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(costosPorDepartamento),
        datasets: [
          {
            data: Object.values(costosPorDepartamento),
            backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: 'Costos por Departamento',
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  calcularCostosPorDepartamento() {
    const costos = {};

    this.nominas.forEach((nomina) => {
      const empleado = this.empleados.find((emp) => emp.id === nomina.empleado_id);
      if (empleado) {
        const departamento = empleado.departamento || 'Sin departamento';
        costos[departamento] = (costos[departamento] || 0) + (nomina.neto_a_pagar || 0);
      }
    });

    return costos;
  }

  // ========================================
  // EXPORTACIÓN Y REPORTES
  // ========================================

  exportarExcel() {
    try {
      if (this.nominas.length === 0) {
        this.mostrarError('No hay nóminas para exportar');
        return;
      }

      const datos = this.prepararDatosExcel();
      const workbook = XLSX.utils.book_new();

      // Hoja principal de nóminas
      const worksheet = XLSX.utils.aoa_to_sheet(datos);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Nóminas');

      // Hoja de resumen
      const resumen = this.prepararResumenExcel();
      const worksheetResumen = XLSX.utils.aoa_to_sheet(resumen);
      XLSX.utils.book_append_sheet(workbook, worksheetResumen, 'Resumen');

      // Descargar archivo
      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Nómina_Villa_Venecia_${fecha}.xlsx`;
      XLSX.writeFile(workbook, nombreArchivo);

      this.mostrarExito('Archivo Excel exportado correctamente');
    } catch (error) {
      console.error('Error exportando Excel:', error);
      this.mostrarError('Error exportando Excel: ' + error.message);
    }
  }

  prepararDatosExcel() {
    const datos = [
      ['VILLA VENECIA - SISTEMA DE NÓMINA'],
      [`Fecha de Exportación: ${new Date().toLocaleDateString()}`],
      [''],
      [
        'ID',
        'Empleado',
        'Cargo',
        'Departamento',
        'Período',
        'Horas Trabajadas',
        'Salario Base',
        'Total Devengado',
        'Descuentos',
        'Neto a Pagar',
        'Estado',
        'Fecha Generación',
      ],
    ];

    this.nominas.forEach((nomina) => {
      const empleado = this.empleados.find((emp) => emp.id === nomina.empleado_id);
      datos.push([
        nomina.id,
        nomina.empleado_nombre || 'N/A',
        nomina.empleado_cargo || 'N/A',
        nomina.empleado_departamento || 'N/A',
        nomina.periodo || 'N/A',
        nomina.horasTrabajadas || 0,
        `$${(nomina.salario_base || 0).toLocaleString()}`,
        `$${(nomina.total_devengado || 0).toLocaleString()}`,
        `$${(nomina.total_descuentos || 0).toLocaleString()}`,
        `$${(nomina.neto_a_pagar || 0).toLocaleString()}`,
        nomina.estado || 'N/A',
        nomina.fecha_generacion ? new Date(nomina.fecha_generacion).toLocaleDateString() : 'N/A',
      ]);
    });

    return datos;
  }

  prepararResumenExcel() {
    const totalNominas = this.nominas.length;
    const totalEmpleados = this.empleados.length;
    const totalSalarios = this.nominas.reduce((sum, n) => sum + (n.neto_a_pagar || 0), 0);
    const promedioSalario = totalNominas > 0 ? totalSalarios / totalNominas : 0;

    return [
      ['RESUMEN EJECUTIVO - VILLA VENECIA'],
      [''],
      ['Métrica', 'Valor'],
      ['Total Empleados', totalEmpleados],
      ['Total Nóminas', totalNominas],
      ['Total Salarios', `$${totalSalarios.toLocaleString()}`],
      ['Promedio Salario', `$${Math.round(promedioSalario).toLocaleString()}`],
      [''],
      ['Por Departamento:'],
      ...this.calcularResumenPorDepartamento(),
    ];
  }

  calcularResumenPorDepartamento() {
    const resumen = {};

    this.nominas.forEach((nomina) => {
      const empleado = this.empleados.find((emp) => emp.id === nomina.empleado_id);
      if (empleado) {
        const dept = empleado.departamento || 'Sin departamento';
        if (!resumen[dept]) {
          resumen[dept] = { nominas: 0, total: 0 };
        }
        resumen[dept].nominas++;
        resumen[dept].total += nomina.neto_a_pagar || 0;
      }
    });

    return Object.entries(resumen).map(([dept, data]) => [dept, data.nominas, `$${data.total.toLocaleString()}`]);
  }

  generarPDF() {
    try {
      if (this.nominas.length === 0) {
        this.mostrarError('No hay nóminas para generar PDF');
        return;
      }

      const contenido = this.generarContenidoPDF();
      const ventana = window.open('', '_blank');
      ventana.document.write(contenido);
      ventana.document.close();

      setTimeout(() => ventana.print(), 500);
      this.mostrarExito('PDF generado correctamente');
    } catch (error) {
      console.error('Error generando PDF:', error);
      this.mostrarError('Error generando PDF: ' + error.message);
    }
  }

  generarContenidoPDF() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nómina Villa Venecia</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .table th { background-color: #f2f2f2; font-weight: bold; }
            .total { font-weight: bold; margin-top: 20px; text-align: right; }
            .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>VILLA VENECIA</h1>
            <h2>Reporte de Nómina</h2>
            <p>Fecha: ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="summary">
            <h3>Resumen Ejecutivo</h3>
            <p><strong>Total Empleados:</strong> ${this.empleados.length}</p>
            <p><strong>Total Nóminas:</strong> ${this.nominas.length}</p>
            <p><strong>Total Salarios:</strong> $${this.nominas
              .reduce((sum, n) => sum + (n.neto_a_pagar || 0), 0)
              .toLocaleString()}</p>
          </div>

          <table class="table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Período</th>
                <th>Horas</th>
                <th>Salario Base</th>
                <th>Neto a Pagar</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${this.nominas
                .map((nomina) => {
                  const empleado = this.empleados.find((emp) => emp.id === nomina.empleado_id);
                  return `
                  <tr>
                    <td>${nomina.empleado_nombre || 'N/A'}</td>
                    <td>${nomina.empleado_cargo || 'N/A'}</td>
                    <td>${nomina.empleado_departamento || 'N/A'}</td>
                    <td>${nomina.periodo || 'N/A'}</td>
                    <td>${nomina.horasTrabajadas || 0}</td>
                    <td>$${(nomina.salario_base || 0).toLocaleString()}</td>
                    <td>$${(nomina.neto_a_pagar || 0).toLocaleString()}</td>
                    <td>${nomina.estado || 'N/A'}</td>
                  </tr>
                `;
                })
                .join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total a Pagar: $${this.nominas.reduce((sum, n) => sum + (n.neto_a_pagar || 0), 0).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  }

  mostrarConfiguracion() {
    const modal = this.crearModal('modalConfiguracion', 'Configuración de Nómina', this.getContenidoConfiguracion());
    document.body.appendChild(modal);
    this.cargarConfiguracionActual();
  }

  getContenidoConfiguracion() {
    return `
      <div class="axyra-config-container">
        <div class="axyra-config-section">
          <h4><i class="fas fa-dollar-sign"></i> Parámetros Salariales</h4>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="salarioMinimo">Salario Mínimo Legal</label>
              <input type="number" id="salarioMinimo" class="axyra-form-control" 
                     value="${this.configuracion.salarioMinimo}" min="0" step="1000">
            </div>
            <div class="axyra-form-group">
              <label for="horasMes">Horas por Mes</label>
              <input type="number" id="horasMes" class="axyra-form-control" 
                     value="${this.configuracion.horasMes}" min="160" max="300">
            </div>
          </div>
        </div>

        <div class="axyra-config-section">
          <h4><i class="fas fa-percentage"></i> Descuentos Legales (%)</h4>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="salud">Salud</label>
              <input type="number" id="salud" class="axyra-form-control" 
                     value="${this.configuracion.salud}" step="0.01" min="0" max="100">
            </div>
            <div class="axyra-form-group">
              <label for="pension">Pensión</label>
              <input type="number" id="pension" class="axyra-form-control" 
                     value="${this.configuracion.pension}" step="0.01" min="0" max="100">
            </div>
          </div>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="cesantias">Cesantías</label>
              <input type="number" id="cesantias" class="axyra-form-control" 
                     value="${this.configuracion.cesantias}" step="0.01" min="0" max="100">
            </div>
            <div class="axyra-form-group">
              <label for="riesgo">Riesgo Laboral</label>
              <input type="number" id="riesgo" class="axyra-form-control" 
                     value="${this.configuracion.riesgo}" step="0.001" min="0" max="10">
            </div>
          </div>
        </div>

        <div class="axyra-config-section">
          <h4><i class="fas fa-clock"></i> Factores de Horas</h4>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="factorHorasExtras">Horas Extras</label>
              <input type="number" id="factorHorasExtras" class="axyra-form-control" 
                     value="${this.configuracion.factorHorasExtras}" step="0.1" min="1" max="3">
            </div>
            <div class="axyra-form-group">
              <label for="factorHorasNocturnas">Horas Nocturnas</label>
              <input type="number" id="factorHorasNocturnas" class="axyra-form-control" 
                     value="${this.configuracion.factorHorasNocturnas}" step="0.1" min="1" max="3">
            </div>
          </div>
          <div class="axyra-form-row">
            <div class="axyra-form-group">
              <label for="factorHorasFestivas">Horas Festivas</label>
              <input type="number" id="factorHorasFestivas" class="axyra-form-control" 
                     value="${this.configuracion.factorHorasFestivas}" step="0.1" min="1" max="5">
            </div>
            <div class="axyra-form-group">
              <label for="factorHorasFestivasNocturnas">Horas Festivas Nocturnas</label>
              <input type="number" id="factorHorasFestivasNocturnas" class="axyra-form-control" 
                     value="${this.configuracion.factorHorasFestivasNocturnas}" step="0.1" min="1" max="5">
            </div>
          </div>
        </div>
      </div>
    `;
  }

  cargarConfiguracionActual() {
    // Los valores ya están cargados en el HTML
  }

  guardarConfiguracion() {
    try {
      const nuevaConfig = {
        salarioMinimo: parseFloat(document.getElementById('salarioMinimo').value),
        horasMes: parseInt(document.getElementById('horasMes').value),
        salud: parseFloat(document.getElementById('salud').value),
        pension: parseFloat(document.getElementById('pension').value),
        cesantias: parseFloat(document.getElementById('cesantias').value),
        riesgo: parseFloat(document.getElementById('riesgo').value),
        factorHorasExtras: parseFloat(document.getElementById('factorHorasExtras').value),
        factorHorasNocturnas: parseFloat(document.getElementById('factorHorasNocturnas').value),
        factorHorasFestivas: parseFloat(document.getElementById('factorHorasFestivas').value),
        factorHorasFestivasNocturnas: parseFloat(document.getElementById('factorHorasFestivasNocturnas').value),
        fechaActualizacion: new Date().toISOString(),
      };

      // Validar configuración
      if (!this.validarConfiguracion(nuevaConfig)) return;

      // Guardar configuración
      this.configuracion = { ...this.configuracion, ...nuevaConfig };
      localStorage.setItem('axyra_config_nomina', JSON.stringify(this.configuracion));

      // Registrar en auditoría
      this.registrarAuditoria('ACTUALIZAR_CONFIGURACION', nuevaConfig);

      this.mostrarExito('Configuración guardada correctamente');
      this.cerrarModal('modalConfiguracion');
    } catch (error) {
      console.error('Error guardando configuración:', error);
      this.mostrarError('Error guardando configuración: ' + error.message);
    }
  }

  validarConfiguracion(config) {
    if (config.salarioMinimo <= 0) {
      this.mostrarError('El salario mínimo debe ser mayor a 0');
      return false;
    }
    if (config.horasMes < 160 || config.horasMes > 300) {
      this.mostrarError('Las horas por mes deben estar entre 160 y 300');
      return false;
    }
    if (config.salud < 0 || config.salud > 100) {
      this.mostrarError('El porcentaje de salud debe estar entre 0 y 100');
      return false;
    }
    return true;
  }

  aplicarFiltros() {
    const filtroEmpleado = document.getElementById('filtroEmpleado').value;
    const filtroMes = document.getElementById('filtroMes').value;
    const filtroEstado = document.getElementById('filtroEstado').value;

    let nominasFiltradas = [...this.nominas];

    if (filtroEmpleado) {
      nominasFiltradas = nominasFiltradas.filter((n) => n.empleado_id === filtroEmpleado);
    }

    if (filtroMes) {
      nominasFiltradas = nominasFiltradas.filter((n) => n.periodo === filtroMes);
    }

    if (filtroEstado) {
      nominasFiltradas = nominasFiltradas.filter((n) => n.estado === filtroEstado);
    }

    this.mostrarNominasFiltradas(nominasFiltradas);
  }

  mostrarNominasFiltradas(nominas) {
    // Crear tabla de nóminas filtradas
    const tabla = document.createElement('div');
    tabla.className = 'axyra-tabla-nominas';
    tabla.innerHTML = `
      <h4>Nóminas Filtradas (${nominas.length} resultados)</h4>
      <div class="axyra-tabla-container">
        <table>
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Cargo</th>
              <th>Período</th>
              <th>Horas</th>
              <th>Neto a Pagar</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${nominas
              .map(
                (nomina) => `
              <tr>
                <td>${nomina.empleado_nombre || 'N/A'}</td>
                <td>${nomina.empleado_cargo || 'N/A'}</td>
                <td>${nomina.periodo || 'N/A'}</td>
                <td>${nomina.horasTrabajadas || 0}</td>
                <td>$${(nomina.neto_a_pagar || 0).toLocaleString()}</td>
                <td><span class="axyra-estado axyra-estado-${nomina.estado?.toLowerCase() || 'generada'}">${
                  nomina.estado || 'Generada'
                }</span></td>
                <td>
                  <button class="axyra-btn axyra-btn-sm axyra-btn-primary" onclick="axyraNomina.verDetalleNomina('${
                    nomina.id
                  }')">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="axyra-btn axyra-btn-sm axyra-btn-warning" onclick="axyraNomina.editarNomina('${
                    nomina.id
                  }')">
                    <i class="fas fa-edit"></i>
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    `;

    // Mostrar en el dashboard de analytics
    const analyticsDashboard = document.querySelector('.axyra-analytics-dashboard');
    if (analyticsDashboard) {
      analyticsDashboard.innerHTML = `
        <div class="axyra-analytics-header">
          <h3>📊 Resultados de Filtros</h3>
          <p>Nóminas que coinciden con los criterios seleccionados</p>
        </div>
        ${tabla.outerHTML}
      `;
    }
  }

  // ========================================
  // UTILIDADES
  // ========================================

  crearModal(id, titulo, contenido) {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal-overlay';
    modal.id = id;

    modal.innerHTML = `
      <div class="axyra-modal-content axyra-modal-large">
        <div class="axyra-modal-header">
          <h3>${titulo}</h3>
          <button class="axyra-modal-close" onclick="axyraNomina.cerrarModal('${id}')">×</button>
        </div>
        <div class="axyra-modal-body">
          ${contenido}
        </div>
        <div class="axyra-modal-footer">
          <button class="axyra-btn axyra-btn-secondary" onclick="axyraNomina.cerrarModal('${id}')">
            <i class="fas fa-times"></i> Cerrar
          </button>
          ${
            id === 'modalConfiguracion'
              ? `
            <button class="axyra-btn axyra-btn-primary" onclick="axyraNomina.guardarConfiguracion()">
              <i class="fas fa-save"></i> Guardar
            </button>
          `
              : ''
          }
          ${
            id === 'modalGenerarNomina'
              ? `
            <button class="axyra-btn axyra-btn-primary" onclick="axyraNomina.generarNomina()">
              <i class="fas fa-plus"></i> Generar
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;

    return modal;
  }

  cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.remove();
    }
  }

  mostrarError(mensaje) {
    this.mostrarNotificacion(mensaje, 'error');
  }

  mostrarExito(mensaje) {
    this.mostrarNotificacion(mensaje, 'success');
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `axyra-notificacion axyra-notificacion-${tipo}`;
    notificacion.innerHTML = `
      <div class="axyra-notificacion-content">
        <i class="fas fa-${
          tipo === 'error' ? 'exclamation-triangle' : tipo === 'success' ? 'check-circle' : 'info-circle'
        }"></i>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      if (notificacion.parentElement) {
        notificacion.remove();
      }
    }, 5000);
  }

  generarId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  obtenerUsuarioActual() {
    if (typeof obtenerUsuarioActual === 'function') {
      return obtenerUsuarioActual();
    }
    return { nombre: 'Usuario', id: 'temp_user' };
  }

  guardarDatos() {
    localStorage.setItem('axyra_nominas', JSON.stringify(this.nominas));
    localStorage.setItem('axyra_historial_nominas', JSON.stringify(this.historialNominas));
    localStorage.setItem('axyra_auditoria_nomina', JSON.stringify(this.auditoria));
  }

  registrarAuditoria(accion, datos) {
    this.auditoria.push({
      id: this.generarId(),
      accion,
      datos,
      usuario: this.obtenerUsuarioActual()?.nombre || 'Sistema',
      fecha: new Date().toISOString(),
      ip: 'localhost',
    });
  }

  actualizarMetricas() {
    // Actualizar métricas en el dashboard
    const metricas = {
      totalEmpleados: this.empleados.length,
      totalNominas: this.nominas.length,
      costoTotalEmpresa: this.nominas.reduce((sum, n) => sum + (n.neto_a_pagar || 0), 0),
      totalHorasTrabajadas: this.nominas.reduce((sum, n) => sum + (n.horasTrabajadas || 0), 0),
      promedioSalario: this.calcularPromedioSalario(),
      nominasEsteMes: this.contarNominasEsteMes(),
    };

    Object.entries(metricas).forEach(([id, valor]) => {
      const elemento = document.getElementById(id);
      if (elemento) {
        if (typeof valor === 'number' && valor > 1000) {
          elemento.textContent = valor.toLocaleString();
        } else {
          elemento.textContent = valor;
        }
      }
    });
  }

  calcularPromedioSalario() {
    if (this.nominas.length === 0) return 0;
    const total = this.nominas.reduce((sum, n) => sum + (n.neto_a_pagar || 0), 0);
    return Math.round(total / this.nominas.length);
  }

  contarNominasEsteMes() {
    const mesActual = new Date().toISOString().slice(0, 7);
    return this.nominas.filter((n) => n.periodo === mesActual).length;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  window.axyraNomina = new AxyraNominaAvanzada();
});
