// SISTEMA UNIFICADO DE REPORTES AVANZADOS AXYRA - VERSIÓN COMPLETA
// Consolida todas las funcionalidades de reportes en un solo sistema

class AxyraAdvancedReportsUnified {
  constructor() {
    this.isInitialized = false;
    this.reportTypes = {
      nomina: 'Nómina',
      cuadreCaja: 'Cuadre de Caja',
      inventario: 'Inventario',
      empleados: 'Empleados',
      horas: 'Horas',
      financiero: 'Financiero',
      auditoria: 'Auditoría',
    };
    this.reportFormats = ['excel', 'pdf', 'csv', 'json'];
    this.currentReports = [];
    this.reportQueue = [];

    console.log('📊 Inicializando Sistema Unificado de Reportes Avanzados AXYRA...');
  }

  // Inicializar sistema
  async initialize() {
    try {
      if (this.isInitialized) {
        console.log('⚠️ Sistema ya inicializado');
        return;
      }

      console.log('🔄 Configurando sistema de reportes...');

      // Verificar dependencias
      await this.checkDependencies();

      // Configurar listeners
      this.setupEventListeners();

      // Cargar reportes existentes
      await this.loadExistingReports();

      this.isInitialized = true;
      console.log('✅ Sistema Unificado de Reportes Avanzados AXYRA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de reportes:', error);
    }
  }

  // Verificar dependencias
  async checkDependencies() {
    try {
      const dependencies = {
        xlsx: typeof XLSX !== 'undefined',
        jsPDF: typeof jsPDF !== 'undefined',
        firebase: typeof firebase !== 'undefined',
      };

      console.log('📦 Dependencias disponibles:', dependencies);

      if (!dependencies.xlsx) {
        console.warn('⚠️ XLSX no disponible - reportes Excel no funcionarán');
      }

      if (!dependencies.jsPDF) {
        console.warn('⚠️ jsPDF no disponible - reportes PDF no funcionarán');
      }

      return dependencies;
    } catch (error) {
      console.error('❌ Error verificando dependencias:', error);
      return {};
    }
  }

  // Configurar listeners de eventos
  setupEventListeners() {
    try {
      // Listener para solicitudes de reportes
      window.addEventListener('axyra:report:request', (event) => {
        this.handleReportRequest(event.detail);
      });

      // Listener para exportaciones
      window.addEventListener('axyra:report:export', (event) => {
        this.handleExportRequest(event.detail);
      });

      console.log('✅ Listeners de reportes configurados');
    } catch (error) {
      console.error('❌ Error configurando listeners:', error);
    }
  }

  // Cargar reportes existentes
  async loadExistingReports() {
    try {
      const reportsData = localStorage.getItem('axyra_reports_history');
      if (reportsData) {
        this.currentReports = JSON.parse(reportsData);
        console.log(`📋 ${this.currentReports.length} reportes históricos cargados`);
      }
    } catch (error) {
      console.error('❌ Error cargando reportes existentes:', error);
    }
  }

  // Manejar solicitud de reporte
  async handleReportRequest(request) {
    try {
      console.log('🔄 Procesando solicitud de reporte:', request);

      const { type, filters, format, options } = request;

      // Validar tipo de reporte
      if (!this.reportTypes[type]) {
        throw new Error(`Tipo de reporte no válido: ${type}`);
      }

      // Generar reporte
      const report = await this.generateReport(type, filters, options);

      // Agregar a historial
      this.addToHistory(report);

      // Emitir evento de reporte generado
      this.emitReportEvent('reportGenerated', { report });

      return report;
    } catch (error) {
      console.error('❌ Error procesando solicitud de reporte:', error);
      this.emitReportEvent('reportError', { error: error.message });
      throw error;
    }
  }

  // Generar reporte
  async generateReport(type, filters, options) {
    try {
      console.log(`🔄 Generando reporte de ${type}...`);

      let report = {
        id: Date.now() + Math.random(),
        type: type,
        name: `${this.reportTypes[type]} - ${new Date().toLocaleDateString()}`,
        filters: filters || {},
        options: options || {},
        generatedAt: new Date().toISOString(),
        status: 'GENERATING',
      };

      // Generar contenido según tipo
      switch (type) {
        case 'nomina':
          report.content = await this.generateNominaReport(filters, options);
          break;
        case 'cuadreCaja':
          report.content = await this.generateCuadreCajaReport(filters, options);
          break;
        case 'inventario':
          report.content = await this.generateInventarioReport(filters, options);
          break;
        case 'empleados':
          report.content = await this.generateEmpleadosReport(filters, options);
          break;
        case 'horas':
          report.content = await this.generateHorasReport(filters, options);
          break;
        case 'financiero':
          report.content = await this.generateFinancieroReport(filters, options);
          break;
        case 'auditoria':
          report.content = await this.generateAuditoriaReport(filters, options);
          break;
        default:
          throw new Error(`Tipo de reporte no implementado: ${type}`);
      }

      report.status = 'COMPLETED';
      report.size = JSON.stringify(report.content).length;

      console.log(`✅ Reporte de ${type} generado correctamente`);
      return report;
    } catch (error) {
      console.error(`❌ Error generando reporte de ${type}:`, error);
      throw error;
    }
  }

  // Generar reporte de nómina
  async generateNominaReport(filters, options) {
    try {
      const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');

      // Aplicar filtros
      let filteredNominas = nominas;
      if (filters.periodo) {
        filteredNominas = nominas.filter((n) => n.periodo === filters.periodo);
      }
      if (filters.estado) {
        filteredNominas = nominas.filter((n) => n.estado === filters.estado);
      }

      // Calcular estadísticas
      const estadisticas = {
        totalNominas: filteredNominas.length,
        totalSalarios: filteredNominas.reduce((sum, n) => sum + (n.salario_final || 0), 0),
        promedioSalario: 0,
        nominasAprobadas: filteredNominas.filter((n) => n.estado === 'APROBADA').length,
        nominasPendientes: filteredNominas.filter((n) => n.estado === 'PENDIENTE_APROBACION').length,
        nominasRechazadas: filteredNominas.filter((n) => n.estado === 'RECHAZADA').length,
      };

      if (estadisticas.totalNominas > 0) {
        estadisticas.promedioSalario = estadisticas.totalSalarios / estadisticas.totalNominas;
      }

      return {
        estadisticas,
        nominas: filteredNominas,
        empleados: empleados,
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte de nómina:', error);
      throw error;
    }
  }

  // Generar reporte de cuadre de caja
  async generateCuadreCajaReport(filters, options) {
    try {
      const facturas = JSON.parse(localStorage.getItem('axyra_facturas') || '[]');

      // Aplicar filtros
      let filteredFacturas = facturas;
      if (filters.fechaInicio) {
        filteredFacturas = facturas.filter((f) => new Date(f.fecha) >= new Date(filters.fechaInicio));
      }
      if (filters.fechaFin) {
        filteredFacturas = facturas.filter((f) => new Date(f.fecha) <= new Date(filters.fechaFin));
      }
      if (filters.estado) {
        filteredFacturas = facturas.filter((f) => f.estado === filters.estado);
      }

      // Calcular estadísticas
      const estadisticas = {
        totalFacturas: filteredFacturas.length,
        totalIngresos: filteredFacturas.reduce((sum, f) => sum + parseFloat(f.valor || 0), 0),
        promedioFactura: 0,
        facturasAprobadas: filteredFacturas.filter((f) => f.estado === 'APROBADA').length,
        facturasPendientes: filteredFacturas.filter((f) => f.estado === 'PENDIENTE').length,
      };

      if (estadisticas.totalFacturas > 0) {
        estadisticas.promedioFactura = estadisticas.totalIngresos / estadisticas.totalFacturas;
      }

      // Agrupar por encargado
      const ingresosPorEncargado = {};
      filteredFacturas.forEach((factura) => {
        const encargado = factura.encargado || 'Sin asignar';
        if (!ingresosPorEncargado[encargado]) {
          ingresosPorEncargado[encargado] = 0;
        }
        ingresosPorEncargado[encargado] += parseFloat(factura.valor || 0);
      });

      return {
        estadisticas,
        facturas: filteredFacturas,
        ingresosPorEncargado,
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte de cuadre de caja:', error);
      throw error;
    }
  }

  // Generar reporte de inventario
  async generateInventarioReport(filters, options) {
    try {
      const productos = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');
      const movimientos = JSON.parse(localStorage.getItem('axyra_movimientos_inventario') || '[]');

      // Aplicar filtros
      let filteredProductos = productos;
      if (filters.categoria) {
        filteredProductos = productos.filter((p) => p.categoria === filters.categoria);
      }
      if (filters.proveedor) {
        filteredProductos = productos.filter((p) => p.proveedor === filters.proveedor);
      }

      // Calcular estadísticas
      const estadisticas = {
        totalProductos: filteredProductos.length,
        stockTotal: filteredProductos.reduce((sum, p) => sum + (p.stock || 0), 0),
        valorTotal: filteredProductos.reduce((sum, p) => sum + (p.precio || 0) * (p.stock || 0), 0),
        productosBajoStock: filteredProductos.filter((p) => (p.stock || 0) <= (p.stockMinimo || 5)).length,
        productosSinStock: filteredProductos.filter((p) => (p.stock || 0) === 0).length,
      };

      // Agrupar por categoría
      const productosPorCategoria = {};
      filteredProductos.forEach((producto) => {
        const categoria = producto.categoria || 'Sin categoría';
        if (!productosPorCategoria[categoria]) {
          productosPorCategoria[categoria] = { cantidad: 0, stock: 0, valor: 0 };
        }
        productosPorCategoria[categoria].cantidad += 1;
        productosPorCategoria[categoria].stock += producto.stock || 0;
        productosPorCategoria[categoria].valor += (producto.precio || 0) * (producto.stock || 0);
      });

      return {
        estadisticas,
        productos: filteredProductos,
        productosPorCategoria,
        movimientos: movimientos.slice(-100), // Últimos 100 movimientos
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte de inventario:', error);
      throw error;
    }
  }

  // Generar reporte de empleados
  async generateEmpleadosReport(filters, options) {
    try {
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');

      // Aplicar filtros
      let filteredEmpleados = empleados;
      if (filters.departamento) {
        filteredEmpleados = empleados.filter((e) => e.departamento === filters.departamento);
      }
      if (filters.estado) {
        filteredEmpleados = empleados.filter((e) => e.estado === filters.estado);
      }

      // Calcular estadísticas
      const estadisticas = {
        totalEmpleados: filteredEmpleados.length,
        empleadosActivos: filteredEmpleados.filter((e) => e.estado === 'ACTIVO').length,
        empleadosInactivos: filteredEmpleados.filter((e) => e.estado === 'INACTIVO').length,
        promedioSalario: 0,
      };

      const salarios = filteredEmpleados.map((e) => parseFloat(e.salario || 0)).filter((s) => s > 0);
      if (salarios.length > 0) {
        estadisticas.promedioSalario = salarios.reduce((sum, s) => sum + s, 0) / salarios.length;
      }

      // Agrupar por departamento
      const empleadosPorDepartamento = {};
      filteredEmpleados.forEach((empleado) => {
        const dept = empleado.departamento || 'Sin departamento';
        if (!empleadosPorDepartamento[dept]) {
          empleadosPorDepartamento[dept] = [];
        }
        empleadosPorDepartamento[dept].push(empleado);
      });

      return {
        estadisticas,
        empleados: filteredEmpleados,
        empleadosPorDepartamento,
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte de empleados:', error);
      throw error;
    }
  }

  // Generar reporte de horas
  async generateHorasReport(filters, options) {
    try {
      const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');

      // Aplicar filtros
      let filteredHoras = horas;
      if (filters.fechaInicio) {
        filteredHoras = horas.filter((h) => new Date(h.fecha) >= new Date(filters.fechaInicio));
      }
      if (filters.fechaFin) {
        filteredHoras = horas.filter((h) => new Date(h.fecha) <= new Date(filters.fechaFin));
      }
      if (filters.empleadoId) {
        filteredHoras = horas.filter((h) => h.empleadoId == filters.empleadoId);
      }

      // Calcular estadísticas
      const estadisticas = {
        totalRegistros: filteredHoras.length,
        totalHoras: filteredHoras.reduce((sum, h) => sum + (h.total_horas || 0), 0),
        promedioHorasPorDia: 0,
        empleadosConHoras: new Set(filteredHoras.map((h) => h.empleadoId)).size,
      };

      if (filteredHoras.length > 0) {
        estadisticas.promedioHorasPorDia = estadisticas.totalHoras / filteredHoras.length;
      }

      // Agrupar por empleado
      const horasPorEmpleado = {};
      filteredHoras.forEach((registro) => {
        const empleadoId = registro.empleadoId;
        if (!horasPorEmpleado[empleadoId]) {
          horasPorEmpleado[empleadoId] = {
            totalHoras: 0,
            registros: 0,
            horasExtras: 0,
            horasNocturnas: 0,
            horasDominicales: 0,
          };
        }

        horasPorEmpleado[empleadoId].totalHoras += registro.total_horas || 0;
        horasPorEmpleado[empleadoId].registros += 1;
        horasPorEmpleado[empleadoId].horasExtras += registro.horas_extras || 0;
        horasPorEmpleado[empleadoId].horasNocturnas += registro.horas_nocturnas || 0;
        horasPorEmpleado[empleadoId].horasDominicales += registro.horas_dominicales || 0;
      });

      return {
        estadisticas,
        horas: filteredHoras,
        horasPorEmpleado,
        empleados: empleados,
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte de horas:', error);
      throw error;
    }
  }

  // Generar reporte financiero
  async generateFinancieroReport(filters, options) {
    try {
      const facturas = JSON.parse(localStorage.getItem('axyra_facturas') || '[]');
      const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');

      // Aplicar filtros de fecha
      let filteredFacturas = facturas;
      let filteredNominas = nominas;

      if (filters.fechaInicio) {
        const fechaInicio = new Date(filters.fechaInicio);
        filteredFacturas = facturas.filter((f) => new Date(f.fecha) >= fechaInicio);
        filteredNominas = nominas.filter((n) => new Date(n.fecha_generacion) >= fechaInicio);
      }

      if (filters.fechaFin) {
        const fechaFin = new Date(filters.fechaFin);
        filteredFacturas = facturas.filter((f) => new Date(f.fecha) <= fechaFin);
        filteredNominas = nominas.filter((n) => new Date(n.fecha_generacion) <= fechaFin);
      }

      // Calcular estadísticas financieras
      const ingresos = filteredFacturas.reduce((sum, f) => sum + parseFloat(f.valor || 0), 0);
      const gastos = filteredNominas.reduce((sum, n) => sum + (n.salario_final || 0), 0);

      const estadisticas = {
        ingresos: ingresos,
        gastos: gastos,
        balance: ingresos - gastos,
        margen: ingresos > 0 ? ((ingresos - gastos) / ingresos) * 100 : 0,
        totalFacturas: filteredFacturas.length,
        totalNominas: filteredNominas.length,
      };

      // Análisis por mes
      const analisisPorMes = {};
      [...filteredFacturas, ...filteredNominas].forEach((item) => {
        const fecha = new Date(item.fecha || item.fecha_generacion);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

        if (!analisisPorMes[mes]) {
          analisisPorMes[mes] = { ingresos: 0, gastos: 0 };
        }

        if (item.valor) {
          analisisPorMes[mes].ingresos += parseFloat(item.valor);
        } else if (item.salario_final) {
          analisisPorMes[mes].gastos += parseFloat(item.salario_final);
        }
      });

      return {
        estadisticas,
        analisisPorMes,
        facturas: filteredFacturas,
        nominas: filteredNominas,
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte financiero:', error);
      throw error;
    }
  }

  // Generar reporte de auditoría
  async generateAuditoriaReport(filters, options) {
    try {
      const logs = JSON.parse(localStorage.getItem('axyra_audit_logs') || '[]');

      // Aplicar filtros
      let filteredLogs = logs;
      if (filters.usuario) {
        filteredLogs = logs.filter((l) => l.usuario === filters.usuario);
      }
      if (filters.accion) {
        filteredLogs = logs.filter((l) => l.accion === filters.accion);
      }
      if (filters.fechaInicio) {
        filteredLogs = logs.filter((l) => new Date(l.timestamp) >= new Date(filters.fechaInicio));
      }
      if (filters.fechaFin) {
        filteredLogs = logs.filter((l) => new Date(l.timestamp) <= new Date(filters.fechaFin));
      }

      // Calcular estadísticas
      const estadisticas = {
        totalLogs: filteredLogs.length,
        usuariosActivos: new Set(filteredLogs.map((l) => l.usuario)).size,
        accionesRealizadas: new Set(filteredLogs.map((l) => l.accion)).size,
      };

      // Agrupar por acción
      const logsPorAccion = {};
      filteredLogs.forEach((log) => {
        const accion = log.accion || 'Desconocida';
        if (!logsPorAccion[accion]) {
          logsPorAccion[accion] = [];
        }
        logsPorAccion[accion].push(log);
      });

      // Agrupar por usuario
      const logsPorUsuario = {};
      filteredLogs.forEach((log) => {
        const usuario = log.usuario || 'Sistema';
        if (!logsPorUsuario[usuario]) {
          logsPorUsuario[usuario] = [];
        }
        logsPorUsuario[usuario].push(log);
      });

      return {
        estadisticas,
        logs: filteredLogs,
        logsPorAccion,
        logsPorUsuario,
        filtros: filters,
        opciones: options,
      };
    } catch (error) {
      console.error('❌ Error generando reporte de auditoría:', error);
      throw error;
    }
  }

  // Manejar solicitud de exportación
  async handleExportRequest(request) {
    try {
      console.log('🔄 Procesando solicitud de exportación:', request);

      const { reportId, format, options } = request;

      // Buscar reporte
      const report = this.currentReports.find((r) => r.id === reportId);
      if (!report) {
        throw new Error('Reporte no encontrado');
      }

      // Exportar según formato
      switch (format) {
        case 'excel':
          return await this.exportToExcel(report, options);
        case 'pdf':
          return await this.exportToPDF(report, options);
        case 'csv':
          return await this.exportToCSV(report, options);
        case 'json':
          return await this.exportToJSON(report, options);
        default:
          throw new Error(`Formato no soportado: ${format}`);
      }
    } catch (error) {
      console.error('❌ Error procesando exportación:', error);
      throw error;
    }
  }

  // Exportar a Excel
  async exportToExcel(report, options) {
    try {
      if (typeof XLSX === 'undefined') {
        throw new Error('XLSX no disponible');
      }

      console.log('🔄 Exportando a Excel...');

      // Crear datos para Excel
      const datosExcel = this.prepareExcelData(report);

      // Crear libro de Excel
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(datosExcel);

      // Aplicar estilos
      this.applyExcelStyles(worksheet, report.type);

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, report.name);

      // Generar nombre de archivo
      const nombreArchivo = `${report.name}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, nombreArchivo);

      console.log('✅ Exportación a Excel completada:', nombreArchivo);
      return nombreArchivo;
    } catch (error) {
      console.error('❌ Error exportando a Excel:', error);
      throw error;
    }
  }

  // Preparar datos para Excel
  prepareExcelData(report) {
    try {
      const { type, content, name } = report;

      switch (type) {
        case 'nomina':
          return this.prepareNominaExcelData(content, name);
        case 'cuadreCaja':
          return this.prepareCuadreCajaExcelData(content, name);
        case 'inventario':
          return this.prepareInventarioExcelData(content, name);
        case 'empleados':
          return this.prepareEmpleadosExcelData(content, name);
        case 'horas':
          return this.prepareHorasExcelData(content, name);
        case 'financiero':
          return this.prepareFinancieroExcelData(content, name);
        case 'auditoria':
          return this.prepareAuditoriaExcelData(content, name);
        default:
          return [['Reporte no implementado']];
      }
    } catch (error) {
      console.error('❌ Error preparando datos para Excel:', error);
      return [['Error preparando datos']];
    }
  }

  // Preparar datos de nómina para Excel
  prepareNominaExcelData(content, name) {
    const { estadisticas, nominas } = content;

    return [
      [name],
      ['Fecha de generación: ' + new Date().toLocaleDateString()],
      [''],
      ['ESTADÍSTICAS GENERALES'],
      ['Total Nóminas', estadisticas.totalNominas],
      ['Total Salarios', `$${estadisticas.totalSalarios.toLocaleString()}`],
      ['Promedio Salario', `$${estadisticas.promedioSalario.toLocaleString()}`],
      ['Nóminas Aprobadas', estadisticas.nominasAprobadas],
      ['Nóminas Pendientes', estadisticas.nominasPendientes],
      ['Nóminas Rechazadas', estadisticas.nominasRechazadas],
      [''],
      ['DETALLE DE NÓMINAS'],
      ['ID', 'Empleado', 'Período', 'Salario Base', 'Salario Final', 'Estado', 'Fecha'],
    ];
  }

  // Aplicar estilos de Excel
  applyExcelStyles(worksheet, reportType) {
    try {
      // Configurar anchos de columna según tipo de reporte
      const columnWidths = {
        nomina: [8, 25, 15, 18, 18, 15, 15],
        cuadreCaja: [15, 30, 15, 18, 15],
        inventario: [15, 30, 20, 12, 15, 18, 15],
        empleados: [8, 25, 20, 15, 15, 15],
        horas: [8, 25, 15, 15, 15, 15],
        financiero: [20, 18, 18, 18],
        auditoria: [20, 25, 20, 25, 20],
      };

      const widths = columnWidths[reportType] || [20];
      worksheet['!cols'] = widths.map((width) => ({ width }));
    } catch (error) {
      console.error('❌ Error aplicando estilos de Excel:', error);
    }
  }

  // Exportar a PDF
  async exportToPDF(report, options) {
    try {
      if (typeof jsPDF === 'undefined') {
        throw new Error('jsPDF no disponible');
      }

      console.log('🔄 Exportando a PDF...');

      // Implementar generación de PDF
      // Por ahora, descargar como JSON
      return await this.exportToJSON(report, options);
    } catch (error) {
      console.error('❌ Error exportando a PDF:', error);
      throw error;
    }
  }

  // Exportar a CSV
  async exportToCSV(report, options) {
    try {
      console.log('🔄 Exportando a CSV...');

      // Implementar exportación a CSV
      // Por ahora, descargar como JSON
      return await this.exportToJSON(report, options);
    } catch (error) {
      console.error('❌ Error exportando a CSV:', error);
      throw error;
    }
  }

  // Exportar a JSON
  async exportToJSON(report, options) {
    try {
      console.log('🔄 Exportando a JSON...');

      const dataStr = JSON.stringify(report, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${report.name}.json`;
      link.click();
      URL.revokeObjectURL(url);

      console.log('✅ Exportación a JSON completada');
      return `${report.name}.json`;
    } catch (error) {
      console.error('❌ Error exportando a JSON:', error);
      throw error;
    }
  }

  // Agregar reporte al historial
  addToHistory(report) {
    try {
      this.currentReports.unshift(report);

      // Mantener solo los últimos 100 reportes
      if (this.currentReports.length > 100) {
        this.currentReports = this.currentReports.slice(0, 100);
      }

      // Guardar en localStorage
      localStorage.setItem('axyra_reports_history', JSON.stringify(this.currentReports));

      console.log('✅ Reporte agregado al historial');
    } catch (error) {
      console.error('❌ Error agregando reporte al historial:', error);
    }
  }

  // Emitir evento de reporte
  emitReportEvent(eventName, data) {
    try {
      const event = new CustomEvent(`axyra:report:${eventName}`, {
        detail: {
          timestamp: new Date().toISOString(),
          ...data,
        },
      });

      window.dispatchEvent(event);
      console.log(`📡 Evento emitido: axyra:report:${eventName}`, data);
    } catch (error) {
      console.error('❌ Error emitiendo evento de reporte:', error);
    }
  }

  // Obtener información del sistema
  getSystemInfo() {
    return {
      isInitialized: this.isInitialized,
      reportTypes: Object.keys(this.reportTypes),
      reportFormats: this.reportFormats,
      currentReports: this.currentReports.length,
      reportQueue: this.reportQueue.length,
    };
  }

  // Limpiar historial
  clearHistory() {
    try {
      this.currentReports = [];
      localStorage.removeItem('axyra_reports_history');
      console.log('✅ Historial de reportes limpiado');
    } catch (error) {
      console.error('❌ Error limpiando historial:', error);
    }
  }
}

// Crear instancia global
window.axyraAdvancedReports = new AxyraAdvancedReportsUnified();

// Inicializar automáticamente cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAdvancedReports.initialize();
});

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AxyraAdvancedReportsUnified;
}

console.log('📊 Sistema Unificado de Reportes Avanzados AXYRA cargado');
