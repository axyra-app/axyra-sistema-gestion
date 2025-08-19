/**
 * AXYRA Professional Excel Export System
 * Genera archivos Excel profesionales con formato y diseño
 */

class AXYRAExcelExporter {
  constructor() {
    this.workbook = null;
    this.worksheet = null;
  }

  /**
   * Exportar empleados a Excel profesional
   */
  exportarEmpleados(empleados) {
    if (!empleados || empleados.length === 0) {
      throw new Error('No hay empleados para exportar');
    }

    // Crear nuevo workbook
    this.workbook = XLSX.utils.book_new();
    
    // Preparar datos con formato profesional
    const datosFormateados = this.formatearDatosEmpleados(empleados);
    
    // Crear worksheet
    this.worksheet = XLSX.utils.aoa_to_sheet(datosFormateados);
    
    // Aplicar estilos y formato
    this.aplicarFormatoEmpleados();
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(this.workbook, this.worksheet, 'Empleados');
    
    // Generar archivo
    const nombreArchivo = `EMPLEADOS_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(this.workbook, nombreArchivo);
    
    return nombreArchivo;
  }

  /**
   * Exportar facturas a Excel profesional
   */
  exportarFacturas(facturas) {
    if (!facturas || facturas.length === 0) {
      throw new Error('No hay facturas para exportar');
    }

    // Crear nuevo workbook
    this.workbook = XLSX.utils.book_new();
    
    // Preparar datos con formato profesional
    const datosFormateados = this.formatearDatosFacturas(facturas);
    
    // Crear worksheet
    this.worksheet = XLSX.utils.aoa_to_sheet(datosFormateados);
    
    // Aplicar estilos y formato
    this.aplicarFormatoFacturas();
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(this.workbook, this.worksheet, 'Facturas');
    
    // Generar archivo
    const nombreArchivo = `FACTURAS_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(this.workbook, nombreArchivo);
    
    return nombreArchivo;
  }

  /**
   * Exportar cuadre de caja a Excel profesional
   */
  exportarCuadreCaja(facturas, fechaSeleccionada = null) {
    if (!facturas || facturas.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    // Crear nuevo workbook
    this.workbook = XLSX.utils.book_new();
    
    // Preparar datos con formato profesional
    const datosFormateados = this.formatearDatosCuadreCaja(facturas, fechaSeleccionada);
    
    // Crear worksheet
    this.worksheet = XLSX.utils.aoa_to_sheet(datosFormateados);
    
    // Aplicar estilos y formato
    this.aplicarFormatoCuadreCaja();
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(this.workbook, this.worksheet, 'Cuadre de Caja');
    
    // Generar archivo
    const fecha = fechaSeleccionada || new Date().toISOString().split('T')[0];
    const nombreArchivo = `CUADRE_CAJA_${fecha}.xlsx`;
    XLSX.writeFile(this.workbook, nombreArchivo);
    
    return nombreArchivo;
  }

  /**
   * Formatear datos de empleados para Excel
   */
  formatearDatosEmpleados(empleados) {
    const datos = [];
    
    // Título principal
    datos.push(['REPORTE DE EMPLEADOS - AXYRA']);
    datos.push([]);
    
    // Información de la empresa
    datos.push(['EMPRESA:', 'AXYRA']);
    datos.push(['FECHA DE EXPORTACIÓN:', new Date().toLocaleDateString('es-ES')]);
    datos.push(['TOTAL EMPLEADOS:', empleados.length]);
    datos.push([]);
    
    // Encabezados de la tabla
    datos.push([
      'ID',
      'Nombre Completo',
      'Email',
      'Teléfono',
      'Departamento',
      'Cargo',
      'Salario Base',
      'Fecha de Ingreso',
      'Estado'
    ]);
    
    // Datos de empleados
    empleados.forEach(empleado => {
      datos.push([
        empleado.id,
        empleado.nombre,
        empleado.email,
        empleado.telefono || '',
        empleado.departamento,
        empleado.cargo,
        empleado.salario,
        empleado.fechaIngreso,
        empleado.estado
      ]);
    });
    
    // Resumen por departamento
    datos.push([]);
    datos.push(['RESUMEN POR DEPARTAMENTO']);
    datos.push(['Departamento', 'Cantidad', 'Total Salarios']);
    
    const resumenDepartamentos = {};
    empleados.forEach(emp => {
      if (!resumenDepartamentos[emp.departamento]) {
        resumenDepartamentos[emp.departamento] = { cantidad: 0, totalSalarios: 0 };
      }
      resumenDepartamentos[emp.departamento].cantidad++;
      resumenDepartamentos[emp.departamento].totalSalarios += parseFloat(emp.salario) || 0;
    });
    
    Object.entries(resumenDepartamentos).forEach(([depto, datos]) => {
      datos.push([depto, datos.cantidad, `$${datos.totalSalarios.toLocaleString('es-CO')}`]);
    });
    
    // Totales finales
    datos.push([]);
    datos.push(['TOTALES FINALES']);
    datos.push(['Concepto', 'Valor']);
    datos.push(['Total Empleados', empleados.length]);
    datos.push(['Total Salarios', `$${empleados.reduce((sum, emp) => sum + (parseFloat(emp.salario) || 0), 0).toLocaleString('es-CO')}`]);
    datos.push(['Promedio Salario', `$${(empleados.reduce((sum, emp) => sum + (parseFloat(emp.salario) || 0), 0) / empleados.length).toLocaleString('es-CO')}`]);
    
    return datos;
  }

  /**
   * Formatear datos de facturas para Excel
   */
  formatearDatosFacturas(facturas) {
    const datos = [];
    
    // Título principal
    datos.push(['REPORTE DE FACTURAS - AXYRA']);
    datos.push([]);
    
    // Información de la empresa
    datos.push(['EMPRESA:', 'AXYRA']);
    datos.push(['FECHA DE EXPORTACIÓN:', new Date().toLocaleDateString('es-ES')]);
    datos.push(['TOTAL FACTURAS:', facturas.length]);
    datos.push([]);
    
    // Encabezados de la tabla
    datos.push([
      'Fecha',
      'Número',
      'Encargado',
      'Área',
      'Monto',
      'Método de Pago',
      'Descripción'
    ]);
    
    // Datos de facturas
    facturas.forEach(factura => {
      datos.push([
        this.formatearFecha(factura.fecha),
        factura.numero,
        factura.encargado,
        factura.area,
        factura.monto,
        factura.metodoPago || '',
        factura.descripcion || ''
      ]);
    });
    
    // Resumen por área
    datos.push([]);
    datos.push(['RESUMEN POR ÁREA']);
    datos.push(['Área', 'Total Ventas', 'Cantidad Facturas']);
    
    const resumenAreas = {};
    facturas.forEach(fact => {
      if (!resumenAreas[fact.area]) {
        resumenAreas[fact.area] = { totalVentas: 0, cantidad: 0 };
      }
      resumenAreas[fact.area].totalVentas += parseFloat(fact.monto) || 0;
      resumenAreas[fact.area].cantidad++;
    });
    
    Object.entries(resumenAreas).forEach(([area, datosArea]) => {
      datos.push([area, `$${datosArea.totalVentas.toLocaleString('es-CO')}`, datosArea.cantidad]);
    });
    
    // Resumen por método de pago
    datos.push([]);
    datos.push(['RESUMEN POR MÉTODO DE PAGO']);
    datos.push(['Método', 'Total']);
    
    const resumenMetodos = {};
    facturas.forEach(fact => {
      const metodo = fact.metodoPago || 'No especificado';
      if (!resumenMetodos[metodo]) {
        resumenMetodos[metodo] = 0;
      }
      resumenMetodos[metodo] += parseFloat(fact.monto) || 0;
    });
    
    Object.entries(resumenMetodos).forEach(([metodo, total]) => {
      datos.push([metodo, `$${total.toLocaleString('es-CO')}`]);
    });
    
    // Totales finales
    datos.push([]);
    datos.push(['TOTALES FINALES']);
    datos.push(['Concepto', 'Valor']);
    datos.push(['Total Facturas', facturas.length]);
    datos.push(['Total Ingreso', `$${facturas.reduce((sum, fact) => sum + (parseFloat(fact.monto) || 0), 0).toLocaleString('es-CO')}`]);
    datos.push(['Promedio por Factura', `$${(facturas.reduce((sum, fact) => sum + (parseFloat(fact.monto) || 0), 0) / facturas.length).toLocaleString('es-CO')}`]);
    
    return datos;
  }

  /**
   * Formatear datos de cuadre de caja para Excel
   */
  formatearDatosCuadreCaja(facturas, fechaSeleccionada) {
    const datos = [];
    const fecha = fechaSeleccionada || new Date().toISOString().split('T')[0];
    
    // Título principal
    datos.push(['CUADRE DE CAJA - AXYRA']);
    datos.push([]);
    
    // Información del cuadre
    datos.push(['FECHA DEL CUADRE:', fecha]);
    datos.push(['TOTAL FACTURAS:', facturas.length]);
    datos.push(['TOTAL INGRESOS:', `$${facturas.reduce((sum, fact) => sum + (parseFloat(fact.monto) || 0), 0).toLocaleString('es-CO')}`]);
    datos.push([]);
    
    // Encabezados de la tabla
    datos.push([
      'Fecha',
      'Número',
      'Encargado',
      'Área',
      'Monto',
      'Método de Pago',
      'Descripción',
      'Estado'
    ]);
    
    // Datos de facturas
    facturas.forEach(factura => {
      datos.push([
        this.formatearFecha(factura.fecha),
        factura.numero,
        factura.encargado,
        factura.area,
        factura.monto,
        factura.metodoPago || '',
        factura.descripcion || '',
        factura.estado || 'Activo'
      ]);
    });
    
    // Resumen por método de pago
    datos.push([]);
    datos.push(['RESUMEN POR MÉTODO DE PAGO']);
    datos.push(['Método', 'Total', 'Cantidad']);
    
    const resumenMetodos = {};
    facturas.forEach(fact => {
      const metodo = fact.metodoPago || 'No especificado';
      if (!resumenMetodos[metodo]) {
        resumenMetodos[metodo] = { total: 0, cantidad: 0 };
      }
      resumenMetodos[metodo].total += parseFloat(fact.monto) || 0;
      resumenMetodos[metodo].cantidad++;
    });
    
    Object.entries(resumenMetodos).forEach(([metodo, datosMetodo]) => {
      datos.push([metodo, `$${datosMetodo.total.toLocaleString('es-CO')}`, datosMetodo.cantidad]);
    });
    
    // Resumen por área
    datos.push([]);
    datos.push(['RESUMEN POR ÁREA']);
    datos.push(['Área', 'Total Ventas', 'Cantidad Facturas']);
    
    const resumenAreas = {};
    facturas.forEach(fact => {
      if (!resumenAreas[fact.area]) {
        resumenAreas[fact.area] = { totalVentas: 0, cantidad: 0 };
      }
      resumenAreas[fact.area].totalVentas += parseFloat(fact.monto) || 0;
      resumenAreas[fact.area].cantidad++;
    });
    
    Object.entries(resumenAreas).forEach(([area, datosArea]) => {
      datos.push([area, `$${datosArea.totalVentas.toLocaleString('es-CO')}`, datosArea.cantidad]);
    });
    
    // Totales finales
    datos.push([]);
    datos.push(['TOTALES FINALES']);
    datos.push(['Concepto', 'Valor']);
    datos.push(['Total Facturas', facturas.length]);
    datos.push(['Total Ingreso', `$${facturas.reduce((sum, fact) => sum + (parseFloat(fact.monto) || 0), 0).toLocaleString('es-CO')}`]);
    datos.push(['Promedio por Factura', `$${(facturas.reduce((sum, fact) => sum + (parseFloat(fact.monto) || 0), 0) / facturas.length).toLocaleString('es-CO')}`]);
    
    return datos;
  }

  /**
   * Aplicar formato profesional a la hoja de empleados
   */
  aplicarFormatoEmpleados() {
    // Configurar ancho de columnas
    const anchosColumnas = [8, 25, 30, 15, 20, 20, 15, 15, 12];
    this.worksheet['!cols'] = anchosColumnas.map(ancho => ({ width: ancho }));
    
    // Aplicar estilos a celdas específicas
    this.aplicarEstilosCelda('A1', { font: { bold: true, size: 16 }, alignment: { horizontal: 'center' } });
    this.aplicarEstilosCelda('A3:A5', { font: { bold: true } });
    this.aplicarEstilosCelda('A7:I7', { font: { bold: true }, fill: { fgColor: { rgb: '4472C4' } }, font: { color: { rgb: 'FFFFFF' } } });
  }

  /**
   * Aplicar formato profesional a la hoja de facturas
   */
  aplicarFormatoFacturas() {
    // Configurar ancho de columnas
    const anchosColumnas = [12, 10, 20, 15, 15, 15, 30];
    this.worksheet['!cols'] = anchosColumnas.map(ancho => ({ width: ancho }));
    
    // Aplicar estilos a celdas específicas
    this.aplicarEstilosCelda('A1', { font: { bold: true, size: 16 }, alignment: { horizontal: 'center' } });
    this.aplicarEstilosCelda('A3:A5', { font: { bold: true } });
    this.aplicarEstilosCelda('A7:G7', { font: { bold: true }, fill: { fgColor: { rgb: '4472C4' } }, font: { color: { rgb: 'FFFFFF' } } });
  }

  /**
   * Aplicar formato profesional a la hoja de cuadre de caja
   */
  aplicarFormatoCuadreCaja() {
    // Configurar ancho de columnas
    const anchosColumnas = [12, 10, 20, 15, 15, 15, 30, 12];
    this.worksheet['!cols'] = anchosColumnas.map(ancho => ({ width: ancho }));
    
    // Aplicar estilos a celdas específicas
    this.aplicarEstilosCelda('A1', { font: { bold: true, size: 16 }, alignment: { horizontal: 'center' } });
    this.aplicarEstilosCelda('A3:A5', { font: { bold: true } });
    this.aplicarEstilosCelda('A7:H7', { font: { bold: true }, fill: { fgColor: { rgb: '4472C4' } }, font: { color: { rgb: 'FFFFFF' } } });
  }

  /**
   * Aplicar estilos a una celda específica
   */
  aplicarEstilosCelda(rango, estilos) {
    if (this.worksheet[rango]) {
      this.worksheet[rango].s = estilos;
    }
  }

  /**
   * Formatear fecha para Excel
   */
  formatearFecha(fecha) {
    if (!fecha) return '';
    const fechaObj = new Date(fecha);
    return fechaObj.toLocaleDateString('es-ES');
  }
}

// Crear instancia global
window.axyraExcelExporter = new AXYRAExcelExporter();
