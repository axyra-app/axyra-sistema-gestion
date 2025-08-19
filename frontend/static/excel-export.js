// ========================================
// SISTEMA DE EXPORTACIÓN EXCEL AXYRA PROFESIONAL
// ========================================

class AXYRAExcelExporter {
  constructor() {
    this.companyName = this.getCompanyName();
    this.companyNIT = this.getCompanyNIT();
    this.exportDate = new Date().toLocaleDateString('es-CO');
  }

  // Obtener nombre de empresa desde configuración
  getCompanyName() {
    const config = localStorage.getItem('axyra_configuracion');
    if (config) {
      try {
        const configData = JSON.parse(config);
        return configData.nombreEmpresa || 'AXYRA';
      } catch (e) {
        return 'AXYRA';
      }
    }
    return 'AXYRA';
  }

  // Obtener NIT de empresa desde configuración
  getCompanyNIT() {
    const config = localStorage.getItem('axyra_configuracion');
    if (config) {
      try {
        const configData = JSON.parse(config);
        return configData.nit || 'NIT Pendiente';
      } catch (e) {
        return 'NIT Pendiente';
      }
    }
    return 'NIT Pendiente';
  }

  // Aplicar estilos profesionales a una hoja
  applyProfessionalStyles(worksheet, dataRange) {
    // Estilos para encabezados
    const headerStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, size: 12 },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { rgb: '1E3A8A' },
      },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: {
        top: { style: 'thin', color: { rgb: '1E40AF' } },
        bottom: { style: 'thin', color: { rgb: '1E40AF' } },
        left: { style: 'thin', color: { rgb: '1E40AF' } },
        right: { style: 'thin', color: { rgb: '1E40AF' } },
      },
    };

    // Estilos para datos
    const dataStyle = {
      font: { size: 11, color: { rgb: '1F2937' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { rgb: 'F8FAFC' },
      },
      border: {
        top: { style: 'thin', color: { rgb: 'E2E8F0' } },
        bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
        left: { style: 'thin', color: { rgb: 'E2E8F0' } },
        right: { style: 'thin', color: { rgb: 'E2E8F0' } },
      },
    };

    // Estilos para totales
    const totalStyle = {
      font: { bold: true, size: 12, color: { rgb: 'FFFFFF' } },
      fill: {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { rgb: '059669' },
      },
      border: {
        top: { style: 'thin', color: { rgb: '047857' } },
        bottom: { style: 'thin', color: { rgb: '047857' } },
        left: { style: 'thin', color: { rgb: '047857' } },
        right: { style: 'thin', color: { rgb: '047857' } },
      },
    };

    // Aplicar estilos a encabezados
    for (let col = 0; col < dataRange.e.c + 1; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
      worksheet[cellRef].s = headerStyle;
    }

    // Aplicar estilos a datos
    for (let row = 1; row <= dataRange.e.r; row++) {
      for (let col = 0; col <= dataRange.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = dataStyle;
        }
      }
    }

    // Aplicar estilos a totales (última fila)
    const lastRow = dataRange.e.r;
    for (let col = 0; col <= dataRange.e.c; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: lastRow, c: col });
      if (worksheet[cellRef]) {
        worksheet[cellRef].s = totalStyle;
      }
    }

    return worksheet;
  }

  // Formatear moneda colombiana sin decimales
  formatCurrencyCOP(value) {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value;
  }

  // Exportar empleados con diseño profesional
  exportarEmpleados(empleados) {
    try {
      console.log('📊 Exportando empleados con diseño profesional...');

      // Crear libro de trabajo
      const workbook = XLSX.utils.book_new();

      // Preparar datos con encabezados
      const data = [
        ['REPORTE DE EMPLEADOS - ' + this.companyName],
        ['EMPRESA: ' + this.companyName],
        ['NIT: ' + this.companyNIT],
        ['FECHA DE EXPORTACIÓN: ' + this.exportDate],
        [], // Línea en blanco
        ['ID', 'NOMBRE', 'DEPARTAMENTO', 'CARGO', 'SALARIO', 'ESTADO', 'FECHA CONTRATACIÓN'],
        ...empleados.map((emp) => [
          emp.id || 'N/A',
          emp.nombre || 'N/A',
          emp.departamento || 'N/A',
          emp.cargo || 'N/A',
          emp.salario ? this.formatCurrencyCOP(emp.salario) : 'N/A',
          emp.estado || 'N/A',
          emp.fechaContratacion || 'N/A',
        ]),
        [], // Línea en blanco
        ['Total Empleados: ' + empleados.length],
        [
          'Promedio Salario: ' +
            (empleados.length > 0
              ? this.formatCurrencyCOP(empleados.reduce((sum, emp) => sum + (emp.salario || 0), 0) / empleados.length)
              : '$0'),
        ],
      ];

      // Crear hoja de trabajo
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Definir rango de datos para estilos
      const dataRange = { s: { r: 0, c: 0 }, e: { r: data.length - 1, c: 5 } };

      // Aplicar estilos profesionales
      this.applyProfessionalStyles(worksheet, dataRange);

      // Ajustar ancho de columnas
      const colWidths = [8, 35, 20, 20, 15, 12, 20];
      worksheet['!cols'] = colWidths.map((width) => ({ width }));

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

      // Generar nombre de archivo
      const fileName = `REPORTE_EMPLEADOS_${this.companyName}_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Descargar archivo
      XLSX.writeFile(workbook, fileName);

      console.log('✅ Empleados exportados con diseño profesional:', fileName);
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando empleados:', error);
      throw new Error('Error al exportar empleados: ' + error.message);
    }
  }

  // Exportar facturas con diseño profesional
  exportarFacturas(facturas) {
    try {
      console.log('📊 Exportando facturas con diseño profesional...');

      const workbook = XLSX.utils.book_new();

      const data = [
        ['REPORTE DE FACTURAS - ' + this.companyName],
        ['EMPRESA: ' + this.companyName],
        ['NIT: ' + this.companyNIT],
        ['FECHA DE EXPORTACIÓN: ' + this.exportDate],
        [],
        ['FECHA', 'NÚMERO', 'ENCARGADO', 'ÁREA', 'MONTO', 'MÉTODO PAGO', 'DESCRIPCIÓN'],
        ...facturas.map((fact) => [
          new Date(fact.fecha).toLocaleDateString('es-CO'),
          fact.numero,
          fact.encargado,
          fact.area,
          this.formatCurrencyCOP(fact.monto),
          fact.metodoPago,
          fact.descripcion || '-',
        ]),
        [],
        ['Total Facturas: ' + facturas.length],
        ['Total Ingresos: ' + this.formatCurrencyCOP(facturas.reduce((sum, fact) => sum + parseFloat(fact.monto), 0))],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const dataRange = { s: { r: 0, c: 0 }, e: { r: data.length - 1, c: 6 } };

      this.applyProfessionalStyles(worksheet, dataRange);

      const colWidths = [15, 12, 25, 20, 18, 15, 30];
      worksheet['!cols'] = colWidths.map((width) => ({ width }));

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');

      const fileName = `REPORTE_FACTURAS_${this.companyName}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      console.log('✅ Facturas exportadas con diseño profesional:', fileName);
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando facturas:', error);
      throw new Error('Error al exportar facturas: ' + error.message);
    }
  }

  // Exportar nómina con diseño profesional
  exportarNomina(empleados, periodo) {
    try {
      console.log('📊 Exportando nómina con diseño profesional...');

      const workbook = XLSX.utils.book_new();

      const data = [
        ['REPORTE DE NÓMINA - ' + this.companyName],
        ['PERÍODO: ' + periodo],
        ['EMPRESA: ' + this.companyName],
        ['NIT: ' + this.companyNIT],
        ['FECHA DE EXPORTACIÓN: ' + this.exportDate],
        [],
        ['EMPLEADO', 'CARGO', 'DEPARTAMENTO', 'SALARIO BASE', 'HORAS TRABAJADAS', 'SALARIO NETO'],
        ...empleados.map((emp) => [
          emp.nombre || 'N/A',
          emp.cargo || 'N/A',
          emp.departamento || 'N/A',
          emp.salario ? this.formatCurrencyCOP(emp.salario) : 'N/A',
          emp.horasTrabajadas || '0',
          emp.salarioNeto ? this.formatCurrencyCOP(emp.salarioNeto) : 'N/A',
        ]),
        [],
        ['RESUMEN POR DEPARTAMENTO'],
        ['Departamento', 'Cantidad', 'Total Salarios'],
        ...this.agruparPorDepartamento(empleados),
        [],
        ['TOTALES FINALES'],
        ['Concepto', 'Valor'],
        ['Total Empleados', empleados.length],
        ['Total Salarios', this.formatCurrencyCOP(empleados.reduce((sum, emp) => sum + (emp.salarioNeto || 0), 0))],
        [
          'Promedio Salario',
          this.formatCurrencyCOP(
            empleados.length > 0
              ? empleados.reduce((sum, emp) => sum + (emp.salarioNeto || 0), 0) / empleados.length
              : 0
          ),
        ],
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      const dataRange = { s: { r: 0, c: 0 }, e: { r: data.length - 1, c: 5 } };

      this.applyProfessionalStyles(worksheet, dataRange);

      const colWidths = [30, 20, 20, 18, 20, 18];
      worksheet['!cols'] = colWidths.map((width) => ({ width }));

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Nómina');

      const fileName = `NOMINA_${period.replace(/\//g, '-')}_${this.companyName}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      console.log('✅ Nómina exportada con diseño profesional:', fileName);
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando nómina:', error);
      throw new Error('Error al exportar nómina: ' + error.message);
    }
  }

  // Agrupar empleados por departamento
  agruparPorDepartamento(empleados) {
    const grupos = {};
    empleados.forEach((emp) => {
      const dept = emp.departamento || 'Sin Departamento';
      if (!grupos[dept]) {
        grupos[dept] = { cantidad: 0, totalSalarios: 0 };
      }
      grupos[dept].cantidad++;
      grupos[dept].totalSalarios += emp.salarioNeto || 0;
    });

    return Object.entries(grupos).map(([dept, data]) => [
      dept,
      data.cantidad,
      this.formatCurrencyCOP(data.totalSalarios),
    ]);
  }
}

// Exportar para uso global
window.AXYRAExcelExporter = AXYRAExcelExporter;
