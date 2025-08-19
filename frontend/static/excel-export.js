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
    try {
      const fecha = fechaSeleccionada || new Date().toISOString().split('T')[0];
      const facturasHoy = facturas.filter(f => f.fecha === fecha);
      
      // Crear workbook
      const wb = XLSX.utils.book_new();
      
      // Datos del cuadre de caja
      const datosCuadre = this.formatearDatosCuadreCaja(facturasHoy, fecha);
      
      // Crear worksheet
      const ws = XLSX.utils.aoa_to_sheet(datosCuadre);
      
      // Aplicar formato profesional
      this.aplicarFormatoCuadreCaja(ws, datosCuadre);
      
      // Agregar worksheet al workbook
      XLSX.utils.book_append_sheet(wb, ws, 'Cuadre de Caja');
      
      // Generar nombre de archivo
      const nombreArchivo = `CUADRE_CAJA_${fecha}.xlsx`;
      
      // Guardar archivo
      XLSX.writeFile(wb, nombreArchivo);
      
      console.log('✅ Cuadre de caja exportado a Excel:', nombreArchivo);
      return nombreArchivo;
    } catch (error) {
      console.error('❌ Error exportando cuadre de caja:', error);
      throw error;
    }
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
  formatearDatosCuadreCaja(facturas, fecha) {
    const datos = [];
    
    // Encabezado principal
    datos.push(['CUADRE DE CAJA - AXYRA']);
    datos.push([]);
    datos.push(['FECHA DEL CUADRE:', fecha]);
    datos.push(['TOTAL FACTURAS:', facturas.length]);
    
    const totalIngresos = facturas.reduce((total, f) => total + parseFloat(f.monto), 0);
    datos.push(['TOTAL INGRESOS:', `$${totalIngresos.toLocaleString()}`]);
    datos.push([]);
    
    // Encabezados de la tabla
    datos.push(['FECHA', 'NÚMERO', 'ENCARGADO', 'ÁREA', 'MONTO', 'MÉTODO DE PAGO', 'DESCRIPCIÓN', 'ESTADO']);
    
    // Datos de las facturas
    facturas.forEach(factura => {
      datos.push([
        factura.fecha,
        factura.numero,
        factura.encargado,
        factura.area,
        `$${parseFloat(factura.monto).toLocaleString()}`,
        factura.metodoPago,
        factura.descripcion || '-',
        factura.estado || 'Activo'
      ]);
    });
    
    datos.push([]);
    
    // Resumen por método de pago
    datos.push(['RESUMEN POR MÉTODO DE PAGO']);
    datos.push(['Método', 'Total', 'Cantidad']);
    
    const metodosPago = {};
    facturas.forEach(f => {
      const metodo = f.metodoPago;
      if (!metodosPago[metodo]) {
        metodosPago[metodo] = { total: 0, cantidad: 0 };
      }
      metodosPago[metodo].total += parseFloat(f.monto);
      metodosPago[metodo].cantidad += 1;
    });
    
    Object.entries(metodosPago).forEach(([metodo, datos]) => {
      datos.push([metodo, `$${datos.total.toLocaleString()}`, datos.cantidad]);
    });
    
    datos.push([]);
    
    // Resumen por área
    datos.push(['RESUMEN POR ÁREA']);
    datos.push(['Área', 'Total Venta', 'Cantidad Facturas']);
    
    const areas = {};
    facturas.forEach(f => {
      const area = f.area;
      if (!areas[area]) {
        areas[area] = { total: 0, cantidad: 0 };
      }
      areas[area].total += parseFloat(f.monto);
      areas[area].cantidad += 1;
    });
    
    Object.entries(areas).forEach(([area, datos]) => {
      datos.push([area, `$${datos.total.toLocaleString()}`, datos.cantidad]);
    });
    
    datos.push([]);
    
    // Totales finales
    datos.push(['TOTALES FINALES']);
    datos.push(['Concepto', 'Valor']);
    datos.push(['Total Facturas', facturas.length]);
    datos.push(['Total Ingreso', `$${totalIngresos.toLocaleString()}`]);
    datos.push(['Promedio por Factura', `$${(totalIngresos / facturas.length).toLocaleString()}`]);
    
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
  aplicarFormatoCuadreCaja(ws, datos) {
    // Configurar anchos de columna
    const anchos = [15, 12, 20, 15, 15, 18, 25, 12];
    ws['!cols'] = anchos.map(ancho => ({ width: ancho }));
    
    // Aplicar estilos a encabezado principal
    this.aplicarEstilosCelda('A1:A1', {
      font: { bold: true, size: 16, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E40AF' } },
      alignment: { horizontal: 'center' }
    });
    
    // Aplicar estilos a información del cuadre
    this.aplicarEstilosCelda('A3:A5', {
      font: { bold: true, size: 12 },
      fill: { fgColor: { rgb: 'F3F4F6' } }
    });
    
    // Aplicar estilos a encabezados de tabla
    const filaEncabezados = 7;
    this.aplicarEstilosCelda(`A${filaEncabezados}:H${filaEncabezados}`, {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '1E40AF' } },
      alignment: { horizontal: 'center' }
    });
    
    // Aplicar estilos a datos de facturas
    const filaInicioDatos = 8;
    const filaFinDatos = filaInicioDatos + datos.length - 1;
    
    // Filas alternadas para mejor legibilidad
    for (let fila = filaInicioDatos; fila <= filaFinDatos; fila++) {
      const colorFondo = fila % 2 === 0 ? 'FFFFFF' : 'F8FAFC';
      this.aplicarEstilosCelda(`A${fila}:H${fila}`, {
        fill: { fgColor: { rgb: colorFondo } },
        border: {
          top: { style: 'thin', color: { rgb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { rgb: 'E2E8F0' } }
        }
      });
    }
    
    // Aplicar estilos a resúmenes
    const filaResumenMetodos = filaFinDatos + 3;
    this.aplicarEstilosCelda(`A${filaResumenMetodos}:A${filaResumenMetodos}`, {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '059669' } }
    });
    
    const filaResumenAreas = filaResumenMetodos + Object.keys(metodosPago).length + 4;
    this.aplicarEstilosCelda(`A${filaResumenAreas}:A${filaResumenAreas}`, {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'DC2626' } }
    });
    
    const filaTotalesFinales = filaResumenAreas + Object.keys(areas).length + 4;
    this.aplicarEstilosCelda(`A${filaTotalesFinales}:A${filaTotalesFinales}`, {
      font: { bold: true, size: 14, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '7C3AED' } }
    });
    
    // Aplicar estilos a encabezados de resúmenes
    this.aplicarEstilosCelda(`A${filaResumenMetodos + 1}:C${filaResumenMetodos + 1}`, {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '059669' } },
      alignment: { horizontal: 'center' }
    });
    
    this.aplicarEstilosCelda(`A${filaResumenAreas + 1}:C${filaResumenAreas + 1}`, {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: 'DC2626' } },
      alignment: { horizontal: 'center' }
    });
    
    this.aplicarEstilosCelda(`A${filaTotalesFinales + 1}:B${filaTotalesFinales + 1}`, {
      font: { bold: true, color: { rgb: 'FFFFFF' } },
      fill: { fgColor: { rgb: '7C3AED' } },
      alignment: { horizontal: 'center' }
    });
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
