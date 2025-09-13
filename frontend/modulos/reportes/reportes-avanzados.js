/**
 * AXYRA - Sistema Avanzado de Reportes
 * Generación de reportes detallados con PDF, Excel y análisis de datos
 */

class AxyraReportesAvanzados {
  constructor() {
    this.empleados = [];
    this.horas = [];
    this.nominas = [];
    this.facturas = [];
    this.inventario = [];
    this.reportesGenerados = [];
    this.filtros = this.getFiltrosDefault();
    this.configuracion = this.getConfiguracionDefault();

    this.init();
  }

  init() {
    try {
      console.log('📊 Inicializando sistema avanzado de reportes...');

      // Cargar datos
      this.cargarDatos();

      // Configurar event listeners
      this.configurarEventListeners();

      // Cargar historial de reportes
      this.cargarHistorialReportes();

      console.log('✅ Sistema de reportes inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando reportes:', error);
    }
  }

  cargarDatos() {
    // Cargar datos de todos los módulos
    this.empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    this.horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    this.nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
    this.facturas = JSON.parse(localStorage.getItem('axyra_facturas') || '[]');
    this.inventario = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');

    console.log(
      `📊 Datos cargados: ${this.empleados.length} empleados, ${this.horas.length} horas, ${this.nominas.length} nóminas`
    );
  }

  getFiltrosDefault() {
    return {
      fechaInicio: '',
      fechaFin: '',
      departamento: '',
      formato: 'pdf',
      incluirGraficos: true,
      incluirDetalles: true,
      idioma: 'es',
    };
  }

  getConfiguracionDefault() {
    return {
      empresa: {
        nombre: 'VILLA VENECIA',
        nit: '900123456-7',
        direccion: 'Calle Principal #123',
        telefono: '+57 300 123 4567',
        email: 'contacto@villavenecia.com',
      },
      reportes: {
        logo: 'logo.png',
        colores: {
          primario: '#667eea',
          secundario: '#764ba2',
          texto: '#374151',
        },
        formato: {
          margen: 20,
          fuente: 'Arial',
          tamanoFuente: 12,
        },
      },
    };
  }

  configurarEventListeners() {
    // Event listeners para botones de reportes
    this.configurarBotonesReportes();

    // Event listeners para filtros
    this.configurarFiltros();

    // Event listeners para acciones del visor
    this.configurarAccionesVisor();
  }

  configurarBotonesReportes() {
    const botones = {
      btnReporteEmpleados: () => this.generarReporteEmpleados(),
      btnVistaPreviaEmpleados: () => this.vistaPreviaEmpleados(),
      btnReporteFinanciero: () => this.generarReporteFinanciero(),
      btnVistaPreviaFinanciero: () => this.vistaPreviaFinanciero(),
      btnReporteInventario: () => this.generarReporteInventario(),
      btnVistaPreviaInventario: () => this.vistaPreviaInventario(),
      btnReporteHoras: () => this.generarReporteHoras(),
      btnVistaPreviaHoras: () => this.vistaPreviaHoras(),
      btnReporteCaja: () => this.generarReporteCaja(),
      btnVistaPreviaCaja: () => this.vistaPreviaCaja(),
      btnReportePersonalizado: () => this.crearReportePersonalizado(),
      btnGestionarPersonalizados: () => this.gestionarReportesPersonalizados(),
    };

    Object.entries(botones).forEach(([id, funcion]) => {
      const boton = document.getElementById(id);
      if (boton) {
        boton.addEventListener('click', funcion);
      }
    });
  }

  configurarFiltros() {
    // Aplicar filtros
    const btnAplicarFiltros = document.getElementById('btnAplicarFiltros');
    if (btnAplicarFiltros) {
      btnAplicarFiltros.addEventListener('click', () => this.aplicarFiltros());
    }

    // Cargar departamentos en el filtro
    this.cargarDepartamentos();
  }

  configurarAccionesVisor() {
    const botones = {
      btnExportarReporte: () => this.exportarReporte(),
      btnImprimirReporte: () => this.imprimirReporte(),
      btnCompartirReporte: () => this.compartirReporte(),
    };

    Object.entries(botones).forEach(([id, funcion]) => {
      const boton = document.getElementById(id);
      if (boton) {
        boton.addEventListener('click', funcion);
      }
    });
  }

  cargarDepartamentos() {
    const select = document.getElementById('filtroDepartamento');
    if (select) {
      const departamentos = [...new Set(this.empleados.map((emp) => emp.departamento).filter(Boolean))];
      select.innerHTML = '<option value="">Todos los departamentos</option>';
      departamentos.forEach((dept) => {
        const option = document.createElement('option');
        option.value = dept;
        option.textContent = dept;
        select.appendChild(option);
      });
    }
  }

  aplicarFiltros() {
    this.filtros.fechaInicio = document.getElementById('filtroFechaInicio')?.value || '';
    this.filtros.fechaFin = document.getElementById('filtroFechaFin')?.value || '';
    this.filtros.departamento = document.getElementById('filtroDepartamento')?.value || '';
    this.filtros.formato = document.getElementById('filtroFormato')?.value || 'pdf';

    console.log('Filtros aplicados:', this.filtros);
    this.mostrarExito('Filtros aplicados correctamente');
  }

  // Generación de Reportes
  generarReporteEmpleados() {
    try {
      console.log('📊 Generando reporte de empleados...');

      const datos = this.obtenerDatosEmpleados();
      const reporte = this.crearReporteEmpleados(datos);

      this.mostrarReporte(reporte);
      this.guardarReporte('empleados', reporte);

      this.mostrarExito('Reporte de empleados generado correctamente');
    } catch (error) {
      console.error('Error generando reporte de empleados:', error);
      this.mostrarError('Error generando reporte: ' + error.message);
    }
  }

  obtenerDatosEmpleados() {
    let empleados = [...this.empleados];

    // Aplicar filtros
    if (this.filtros.departamento) {
      empleados = empleados.filter((emp) => emp.departamento === this.filtros.departamento);
    }

    // Agregar datos calculados
    return empleados.map((emp) => ({
      ...emp,
      horasTrabajadas: this.calcularHorasTrabajadas(emp.id),
      salarioPromedio: this.calcularSalarioPromedio(emp.id),
      antiguedad: this.calcularAntiguedad(emp.fechaIngreso),
    }));
  }

  calcularHorasTrabajadas(empleadoId) {
    return this.horas
      .filter((h) => h.empleado_id === empleadoId)
      .reduce((total, h) => total + (h.horas_trabajadas || 0), 0);
  }

  calcularSalarioPromedio(empleadoId) {
    const nominasEmpleado = this.nominas.filter((n) => n.empleado_id === empleadoId);
    if (nominasEmpleado.length === 0) return 0;

    const totalSalario = nominasEmpleado.reduce((sum, n) => sum + (n.neto_a_pagar || 0), 0);
    return totalSalario / nominasEmpleado.length;
  }

  calcularAntiguedad(fechaIngreso) {
    if (!fechaIngreso) return 0;
    const hoy = new Date();
    const ingreso = new Date(fechaIngreso);
    const diffTime = Math.abs(hoy - ingreso);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 365));
  }

  crearReporteEmpleados(datos) {
    const fecha = new Date().toLocaleDateString('es-CO');
    const totalEmpleados = datos.length;
    const totalHoras = datos.reduce((sum, emp) => sum + emp.horasTrabajadas, 0);
    const salarioPromedio = datos.reduce((sum, emp) => sum + emp.salarioPromedio, 0) / totalEmpleados;

    return {
      tipo: 'empleados',
      titulo: 'Reporte de Empleados',
      fecha,
      resumen: {
        totalEmpleados,
        totalHoras,
        salarioPromedio: salarioPromedio || 0,
      },
      datos,
      graficos: this.generarGraficosEmpleados(datos),
    };
  }

  generarGraficosEmpleados(datos) {
    const graficos = [];

    // Gráfico de empleados por departamento
    const porDepartamento = this.agruparPorDepartamento(datos);
    graficos.push({
      tipo: 'doughnut',
      titulo: 'Empleados por Departamento',
      datos: porDepartamento,
    });

    // Gráfico de distribución salarial
    const rangosSalariales = this.calcularRangosSalariales(datos);
    graficos.push({
      tipo: 'bar',
      titulo: 'Distribución Salarial',
      datos: rangosSalariales,
    });

    return graficos;
  }

  agruparPorDepartamento(datos) {
    const agrupado = {};
    datos.forEach((emp) => {
      const dept = emp.departamento || 'Sin departamento';
      agrupado[dept] = (agrupado[dept] || 0) + 1;
    });
    return agrupado;
  }

  calcularRangosSalariales(datos) {
    const rangos = {
      '0 - 1M': 0,
      '1M - 2M': 0,
      '2M - 3M': 0,
      '3M - 5M': 0,
      '5M+': 0,
    };

    datos.forEach((emp) => {
      const salario = emp.salarioPromedio;
      if (salario < 1000000) rangos['0 - 1M']++;
      else if (salario < 2000000) rangos['1M - 2M']++;
      else if (salario < 3000000) rangos['2M - 3M']++;
      else if (salario < 5000000) rangos['3M - 5M']++;
      else rangos['5M+']++;
    });

    return rangos;
  }

  mostrarReporte(reporte) {
    const contenido = document.getElementById('reporteContent');
    if (!contenido) return;

    contenido.innerHTML = this.generarHTMLReporte(reporte);

    // Habilitar botones de acción
    this.habilitarBotonesAccion();

    // Generar gráficos
    this.generarGraficosReporte(reporte.graficos);
  }

  generarHTMLReporte(reporte) {
    return `
      <div class="axyra-reporte-contenido">
        <div class="axyra-reporte-header">
          <h2>${reporte.titulo}</h2>
          <p class="axyra-reporte-fecha">Generado el ${reporte.fecha}</p>
        </div>
        
        <div class="axyra-reporte-resumen">
          <h3>Resumen Ejecutivo</h3>
          <div class="axyra-resumen-grid">
            ${Object.entries(reporte.resumen)
              .map(
                ([key, value]) => `
              <div class="axyra-resumen-item">
                <span class="axyra-resumen-label">${this.formatearEtiqueta(key)}:</span>
                <span class="axyra-resumen-value">${this.formatearValor(key, value)}</span>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
        
        <div class="axyra-reporte-tabla">
          <h3>Datos Detallados</h3>
          <div class="axyra-tabla-container">
            <table class="axyra-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Departamento</th>
                  <th>Cargo</th>
                  <th>Horas Trabajadas</th>
                  <th>Salario Promedio</th>
                  <th>Antigüedad</th>
                </tr>
              </thead>
              <tbody>
                ${reporte.datos
                  .map(
                    (emp) => `
                  <tr>
                    <td>${emp.nombre || 'N/A'}</td>
                    <td>${emp.departamento || 'N/A'}</td>
                    <td>${emp.cargo || 'N/A'}</td>
                    <td>${emp.horasTrabajadas || 0}</td>
                    <td>$${(emp.salarioPromedio || 0).toLocaleString()}</td>
                    <td>${emp.antiguedad || 0} años</td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
        
        <div class="axyra-reporte-graficos">
          <h3>Análisis Gráfico</h3>
          <div class="axyra-graficos-container" id="graficosContainer">
            <!-- Los gráficos se generarán aquí -->
          </div>
        </div>
      </div>
    `;
  }

  formatearEtiqueta(key) {
    const etiquetas = {
      totalEmpleados: 'Total Empleados',
      totalHoras: 'Total Horas',
      salarioPromedio: 'Salario Promedio',
    };
    return etiquetas[key] || key;
  }

  formatearValor(key, value) {
    if (key === 'salarioPromedio') {
      return `$${value.toLocaleString()}`;
    }
    return value;
  }

  generarGraficosReporte(graficos) {
    const container = document.getElementById('graficosContainer');
    if (!container || !graficos) return;

    graficos.forEach((grafico, index) => {
      const canvas = document.createElement('canvas');
      canvas.id = `grafico${index}`;
      canvas.width = 400;
      canvas.height = 300;
      container.appendChild(canvas);

      this.crearGrafico(canvas, grafico);
    });
  }

  crearGrafico(canvas, config) {
    const ctx = canvas.getContext('2d');

    if (config.tipo === 'doughnut') {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(config.datos),
          datasets: [
            {
              data: Object.values(config.datos),
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: config.titulo,
            },
          },
        },
      });
    } else if (config.tipo === 'bar') {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(config.datos),
          datasets: [
            {
              label: 'Cantidad',
              data: Object.values(config.datos),
              backgroundColor: '#667eea',
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: config.titulo,
            },
          },
        },
      });
    }
  }

  habilitarBotonesAccion() {
    const botones = ['btnExportarReporte', 'btnImprimirReporte', 'btnCompartirReporte'];
    botones.forEach((id) => {
      const boton = document.getElementById(id);
      if (boton) {
        boton.disabled = false;
      }
    });
  }

  // Métodos de exportación
  exportarReporte() {
    const formato = this.filtros.formato;

    switch (formato) {
      case 'pdf':
        this.exportarPDF();
        break;
      case 'excel':
        this.exportarExcel();
        break;
      case 'html':
        this.exportarHTML();
        break;
      default:
        this.mostrarError('Formato no soportado');
    }
  }

  exportarPDF() {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Agregar contenido del reporte
      const contenido = document.getElementById('reporteContent');
      if (contenido) {
        doc.html(contenido, {
          callback: function (doc) {
            doc.save('reporte_axyra.pdf');
          },
        });
      }

      this.mostrarExito('Reporte PDF exportado correctamente');
    } catch (error) {
      console.error('Error exportando PDF:', error);
      this.mostrarError('Error exportando PDF: ' + error.message);
    }
  }

  exportarExcel() {
    try {
      const contenido = document.getElementById('reporteContent');
      if (!contenido) return;

      const tabla = contenido.querySelector('.axyra-tabla');
      if (!tabla) return;

      const datos = this.extraerDatosTabla(tabla);
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.aoa_to_sheet(datos);

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte');
      XLSX.writeFile(workbook, 'reporte_axyra.xlsx');

      this.mostrarExito('Reporte Excel exportado correctamente');
    } catch (error) {
      console.error('Error exportando Excel:', error);
      this.mostrarError('Error exportando Excel: ' + error.message);
    }
  }

  extraerDatosTabla(tabla) {
    const datos = [];
    const filas = tabla.querySelectorAll('tr');

    filas.forEach((fila) => {
      const celdas = fila.querySelectorAll('th, td');
      const filaDatos = Array.from(celdas).map((celda) => celda.textContent.trim());
      datos.push(filaDatos);
    });

    return datos;
  }

  exportarHTML() {
    try {
      const contenido = document.getElementById('reporteContent');
      if (!contenido) return;

      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Reporte AXYRA</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .axyra-reporte-contenido { max-width: 1200px; margin: 0 auto; }
            .axyra-tabla { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .axyra-tabla th, .axyra-tabla td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .axyra-tabla th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          ${contenido.innerHTML}
        </body>
        </html>
      `;

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reporte_axyra.html';
      link.click();
      URL.revokeObjectURL(url);

      this.mostrarExito('Reporte HTML exportado correctamente');
    } catch (error) {
      console.error('Error exportando HTML:', error);
      this.mostrarError('Error exportando HTML: ' + error.message);
    }
  }

  imprimirReporte() {
    const contenido = document.getElementById('reporteContent');
    if (!contenido) return;

    const ventana = window.open('', '_blank');
    ventana.document.write(`
      <html>
        <head>
          <title>Reporte AXYRA</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .axyra-reporte-contenido { max-width: 1200px; margin: 0 auto; }
            .axyra-tabla { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .axyra-tabla th, .axyra-tabla td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .axyra-tabla th { background-color: #f2f2f2; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${contenido.innerHTML}
        </body>
      </html>
    `);
    ventana.document.close();
    ventana.print();
  }

  compartirReporte() {
    if (navigator.share) {
      navigator.share({
        title: 'Reporte AXYRA',
        text: 'Reporte generado desde el sistema AXYRA',
        url: window.location.href,
      });
    } else {
      // Fallback: copiar URL al portapapeles
      navigator.clipboard.writeText(window.location.href).then(() => {
        this.mostrarExito('URL copiada al portapapeles');
      });
    }
  }

  // Métodos de utilidad
  guardarReporte(tipo, reporte) {
    const reporteGuardado = {
      id: 'reporte_' + Date.now(),
      tipo,
      titulo: reporte.titulo,
      fecha: reporte.fecha,
      datos: reporte.datos.length,
      usuario: this.obtenerUsuarioActual()?.nombre || 'Sistema',
    };

    this.reportesGenerados.push(reporteGuardado);
    localStorage.setItem('axyra_reportes_generados', JSON.stringify(this.reportesGenerados));
    this.actualizarHistorialReportes();
  }

  cargarHistorialReportes() {
    this.reportesGenerados = JSON.parse(localStorage.getItem('axyra_reportes_generados') || '[]');
    this.actualizarHistorialReportes();
  }

  actualizarHistorialReportes() {
    const container = document.getElementById('historialReportes');
    if (!container) return;

    container.innerHTML = this.reportesGenerados
      .map(
        (reporte) => `
      <div class="axyra-historial-item">
        <div class="axyra-historial-info">
          <h4>${reporte.titulo}</h4>
          <p>Generado el ${reporte.fecha} por ${reporte.usuario}</p>
          <span class="axyra-historial-datos">${reporte.datos} registros</span>
        </div>
        <div class="axyra-historial-actions">
          <button class="axyra-btn axyra-btn-sm axyra-btn-primary" onclick="axyraReportes.verReporte('${reporte.id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="axyra-btn axyra-btn-sm axyra-btn-danger" onclick="axyraReportes.eliminarReporte('${reporte.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `
      )
      .join('');
  }

  verReporte(id) {
    const reporte = this.reportesGenerados.find((r) => r.id === id);
    if (reporte) {
      // Implementar lógica para mostrar reporte guardado
      this.mostrarExito(`Mostrando reporte: ${reporte.titulo}`);
    }
  }

  eliminarReporte(id) {
    this.reportesGenerados = this.reportesGenerados.filter((r) => r.id !== id);
    localStorage.setItem('axyra_reportes_generados', JSON.stringify(this.reportesGenerados));
    this.actualizarHistorialReportes();
    this.mostrarExito('Reporte eliminado correctamente');
  }

  // Métodos de notificación
  mostrarExito(mensaje) {
    this.mostrarNotificacion(mensaje, 'success');
  }

  mostrarError(mensaje) {
    this.mostrarNotificacion(mensaje, 'error');
  }

  mostrarNotificacion(mensaje, tipo) {
    const notificacion = document.createElement('div');
    notificacion.className = `axyra-notificacion axyra-notificacion-${tipo}`;
    notificacion.innerHTML = `
      <div class="axyra-notificacion-content">
        <i class="fas fa-${tipo === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
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

  obtenerUsuarioActual() {
    if (window.obtenerUsuarioActual) {
      return window.obtenerUsuarioActual();
    }
    return { nombre: 'Sistema', email: 'sistema@axyra.com' };
  }

  // Métodos placeholder para otros tipos de reportes
  vistaPreviaEmpleados() {
    this.generarReporteEmpleados();
  }

  generarReporteFinanciero() {
    this.mostrarExito('Reporte financiero en desarrollo');
  }

  vistaPreviaFinanciero() {
    this.mostrarExito('Vista previa financiera en desarrollo');
  }

  generarReporteInventario() {
    this.mostrarExito('Reporte de inventario en desarrollo');
  }

  vistaPreviaInventario() {
    this.mostrarExito('Vista previa de inventario en desarrollo');
  }

  generarReporteHoras() {
    this.mostrarExito('Reporte de horas en desarrollo');
  }

  vistaPreviaHoras() {
    this.mostrarExito('Vista previa de horas en desarrollo');
  }

  generarReporteCaja() {
    this.mostrarExito('Reporte de caja en desarrollo');
  }

  vistaPreviaCaja() {
    this.mostrarExito('Vista previa de caja en desarrollo');
  }

  crearReportePersonalizado() {
    this.mostrarExito('Creación de reportes personalizados en desarrollo');
  }

  gestionarReportesPersonalizados() {
    this.mostrarExito('Gestión de reportes personalizados en desarrollo');
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  window.axyraReportes = new AxyraReportesAvanzados();
});

