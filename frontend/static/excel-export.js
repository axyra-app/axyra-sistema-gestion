// ========================================
// SISTEMA DE EXPORTACIÓN EXCEL AXYRA
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

  // Aplicar estilos profesionales a la hoja
  applyProfessionalStyles(worksheet) {
    // Estilos para encabezados
    worksheet['!cols'] = [];
    worksheet['!rows'] = [];

    // Aplicar estilos a todas las celdas
    Object.keys(worksheet).forEach(cellAddress => {
      if (cellAddress !== '!ref' && cellAddress !== '!cols' && cellAddress !== '!rows') {
        const cell = worksheet[cellAddress];
        
        // Estilos base para todas las celdas
        cell.s = {
          font: { name: 'Calibri', sz: 11, color: { rgb: '2F4F4F' } },
          alignment: { horizontal: 'center', vertical: 'center' },
          border: {
            top: { style: 'thin', color: { rgb: 'E6E6E6' } },
            bottom: { style: 'thin', color: { rgb: 'E6E6E6' } },
            left: { style: 'thin', color: { rgb: 'E6E6E6' } },
            right: { style: 'thin', color: { rgb: 'E6E6E6' } }
          },
          fill: { fgColor: { rgb: 'FFFFFF' } }
        };

        // Estilos especiales para encabezados
        if (cellAddress.match(/^[A-Z]+1$/)) {
          cell.s = {
            font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: 'FFFFFF' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'medium', color: { rgb: '1E3A8A' } },
              bottom: { style: 'medium', color: { rgb: '1E3A8A' } },
              left: { style: 'medium', color: { rgb: '1E3A8A' } },
              right: { style: 'medium', color: { rgb: '1E3A8A' } }
            },
            fill: { fgColor: { rgb: '1E3A8A' } }
          };
        }

        // Estilos para totales
        if (cell.v && typeof cell.v === 'string' && cell.v.includes('Total')) {
          cell.s = {
            font: { name: 'Calibri', sz: 11, bold: true, color: { rgb: '1E3A8A' } },
            alignment: { horizontal: 'center', vertical: 'center' },
            border: {
              top: { style: 'thin', color: { rgb: '1E3A8A' } },
              bottom: { style: 'thin', color: { rgb: '1E3A8A' } },
              left: { style: 'thin', color: { rgb: '1E3A8A' } },
              right: { style: 'thin', color: { rgb: '1E3A8A' } }
            },
            fill: { fgColor: { rgb: 'E0E7FF' } }
          };
        }
      }
    });

    return worksheet;
  }

  // Crear encabezado profesional
  createProfessionalHeader(title) {
    return [
      [{ v: title, s: { font: { name: 'Calibri', sz: 16, bold: true, color: { rgb: '1E3A8A' } }, alignment: { horizontal: 'center' } } }],
      [{ v: `EMPRESA: ${this.companyName}`, s: { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '374151' } } } }],
      [{ v: `NIT: ${this.companyNIT}`, s: { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '374151' } } } }],
      [{ v: `FECHA DE EXPORTACIÓN: ${this.exportDate}`, s: { font: { name: 'Calibri', sz: 12, bold: true, color: { rgb: '374151' } } } }],
      [''], // Línea en blanco
    ];
  }

  // Exportar empleados con diseño profesional
  exportarEmpleados(empleados) {
    try {
      const workbook = XLSX.utils.book_new();
      
      // Crear datos con encabezado profesional
      const header = this.createProfessionalHeader('REPORTE DE EMPLEADOS - AXYRA');
      
      const data = [
        ...header,
        ['ID', 'NOMBRE', 'DEPARTAMENTO', 'CARGO', 'SALARIO', 'ESTADO', 'FECHA CONTRATACIÓN'],
        ...empleados.map(emp => [
          emp.id,
          emp.nombre,
          emp.departamento,
          emp.cargo,
          this.formatearMoneda(emp.salario),
          emp.estado,
          emp.fechaContratacion || 'N/A'
        ]),
        [''], // Línea en blanco
        ['Total Empleados:', empleados.length, '', '', '', '', ''],
        ['Promedio Salario:', this.formatearMoneda(this.calcularPromedioSalario(empleados)), '', '', '', '', '']
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      this.applyProfessionalStyles(worksheet);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [
        { width: 8 },  // ID
        { width: 25 }, // NOMBRE
        { width: 20 }, // DEPARTAMENTO
        { width: 20 }, // CARGO
        { width: 15 }, // SALARIO
        { width: 12 }, // ESTADO
        { width: 18 }  // FECHA
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');
      
      const fileName = `EMPLEADOS_${this.exportDate.replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando empleados:', error);
      throw new Error('Error al exportar empleados');
    }
  }

  // Exportar nómina con diseño profesional
  exportarNomina(nominas) {
    try {
      const workbook = XLSX.utils.book_new();
      
      const header = this.createProfessionalHeader('REPORTE DE NÓMINA - AXYRA');
      
      const data = [
        ...header,
        ['PERÍODO:', this.exportDate, '', '', '', '', ''],
        ['FECHA DE EXPORTACIÓN:', this.exportDate, '', '', '', '', ''],
        ['TOTAL EMPLEADOS:', nominas.length, '', '', '', '', ''],
        [''], // Línea en blanco
        ['RESUMEN POR DEPARTAMENTO', '', '', '', '', '', ''],
        ['Departamento', 'Total Empleados', 'Total Salario', 'Promedio Salario', '', '', ''],
        ...this.agruparPorDepartamento(nominas),
        [''], // Línea en blanco
        ['TOTALES FINALES', '', '', '', '', '', ''],
        ['Total Salario:', this.formatearMoneda(this.calcularTotalSalario(nominas)), '', '', '', '', ''],
        ['Promedio Salario:', this.formatearMoneda(this.calcularPromedioSalario(nominas)), '', '', '', '', '']
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      this.applyProfessionalStyles(worksheet);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [
        { width: 20 }, // Columna 1
        { width: 20 }, // Columna 2
        { width: 20 }, // Columna 3
        { width: 20 }, // Columna 4
        { width: 20 }, // Columna 5
        { width: 20 }, // Columna 6
        { width: 20 }  // Columna 7
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Nómina');
      
      const fileName = `NOMINA_${this.exportDate.replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando nómina:', error);
      throw new Error('Error al exportar nómina');
    }
  }

  // Exportar facturas con diseño profesional
  exportarFacturas(facturas) {
    try {
      const workbook = XLSX.utils.book_new();
      
      const header = this.createProfessionalHeader('REPORTE DE FACTURAS - AXYRA');
      
      const data = [
        ...header,
        ['EMPRESA:', this.companyName, '', '', '', '', ''],
        ['FECHA DE EXPORTACIÓN:', this.exportDate, '', '', '', '', ''],
        ['TOTAL FACTURAS:', facturas.length, '', '', '', '', ''],
        [''], // Línea en blanco
        ['FECHA', 'NÚMERO', 'ENCARGADO', 'ÁREA', 'MONTO', 'MÉTODO DE PAGO', 'DESCRIPCIÓN'],
        ...facturas.map(fact => [
          fact.fecha,
          fact.numero,
          fact.encargado,
          fact.area,
          this.formatearMoneda(fact.monto),
          fact.metodoPago,
          fact.descripcion || ''
        ]),
        [''], // Línea en blanco
        ['RESUMEN POR ÁREA', '', '', '', '', '', ''],
        ['Área', 'Total Venta', 'Cantidad Facturas', '', '', '', ''],
        ...this.agruparPorArea(facturas),
        [''], // Línea en blanco
        ['RESUMEN POR MÉTODO DE PAGO', '', '', '', '', '', ''],
        ['Método', 'Total', '', '', '', '', ''],
        ...this.agruparPorMetodoPago(facturas),
        [''], // Línea en blanco
        ['TOTALES FINALES', '', '', '', '', '', ''],
        ['Total Facturas:', facturas.length, '', '', '', '', ''],
        ['Total Ingreso:', this.formatearMoneda(this.calcularTotalIngreso(facturas)), '', '', '', '', ''],
        ['Promedio por Factura:', this.formatearMoneda(this.calcularPromedioFactura(facturas)), '', '', '', '', '']
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      this.applyProfessionalStyles(worksheet);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [
        { width: 15 }, // FECHA
        { width: 12 }, // NÚMERO
        { width: 20 }, // ENCARGADO
        { width: 15 }, // ÁREA
        { width: 15 }, // MONTO
        { width: 18 }, // MÉTODO
        { width: 25 }  // DESCRIPCIÓN
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');
      
      const fileName = `FACTURAS_${this.exportDate.replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando facturas:', error);
      throw new Error('Error al exportar facturas');
    }
  }

  // Exportar horas con diseño profesional
  exportarHoras(horas) {
    try {
      const workbook = XLSX.utils.book_new();
      
      const header = this.createProfessionalHeader('REPORTE DE HORAS - AXYRA');
      
      const data = [
        ...header,
        ['PERÍODO:', this.exportDate, '', '', '', '', ''],
        ['FECHA DE EXPORTACIÓN:', this.exportDate, '', '', '', '', ''],
        ['TOTAL REGISTROS:', horas.length, '', '', '', '', ''],
        [''], // Línea en blanco
        ['EMPLEADO', 'FECHA', 'HORAS ORDINARIAS', 'HORAS EXTRA', 'HORAS FESTIVAS', 'TOTAL HORAS', 'SALARIO'],
        ...horas.map(hora => [
          hora.empleado,
          hora.fecha,
          hora.horasOrdinarias || 0,
          hora.horasExtra || 0,
          hora.horasFestivas || 0,
          (hora.horasOrdinarias || 0) + (hora.horasExtra || 0) + (hora.horasFestivas || 0),
          this.formatearMoneda(hora.salario || 0)
        ]),
        [''], // Línea en blanco
        ['TOTALES', '', '', '', '', '', ''],
        ['Total Horas Ordinarias:', this.calcularTotalHoras(horas, 'horasOrdinarias'), '', '', '', '', ''],
        ['Total Horas Extra:', this.calcularTotalHoras(horas, 'horasExtra'), '', '', '', '', ''],
        ['Total Horas Festivas:', this.calcularTotalHoras(horas, 'horasFestivas'), '', '', '', '', ''],
        ['Total Salario:', this.formatearMoneda(this.calcularTotalSalario(horas)), '', '', '', '', '']
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(data);
      this.applyProfessionalStyles(worksheet);
      
      // Ajustar ancho de columnas
      worksheet['!cols'] = [
        { width: 20 }, // EMPLEADO
        { width: 15 }, // FECHA
        { width: 18 }, // HORAS ORDINARIAS
        { width: 15 }, // HORAS EXTRA
        { width: 18 }, // HORAS FESTIVAS
        { width: 15 }, // TOTAL HORAS
        { width: 15 }  // SALARIO
      ];

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Horas');
      
      const fileName = `HORAS_${this.exportDate.replace(/\//g, '-')}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      return fileName;
    } catch (error) {
      console.error('❌ Error exportando horas:', error);
      throw new Error('Error al exportar horas');
    }
  }

  // Funciones auxiliares
  formatearMoneda(valor) {
    if (typeof valor === 'number') {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(valor);
    }
    return valor;
  }

  calcularPromedioSalario(items) {
    if (items.length === 0) return 0;
    const total = items.reduce((sum, item) => sum + (item.salario || 0), 0);
    return Math.round(total / items.length);
  }

  calcularTotalSalario(items) {
    return items.reduce((sum, item) => sum + (item.salario || 0), 0);
  }

  calcularTotalIngreso(facturas) {
    return facturas.reduce((sum, fact) => sum + (fact.monto || 0), 0);
  }

  calcularPromedioFactura(facturas) {
    if (facturas.length === 0) return 0;
    const total = facturas.reduce((sum, fact) => sum + (fact.monto || 0), 0);
    return Math.round(total / facturas.length);
  }

  calcularTotalHoras(horas, tipo) {
    return horas.reduce((sum, hora) => sum + (hora[tipo] || 0), 0);
  }

  agruparPorDepartamento(nominas) {
    const grupos = {};
    nominas.forEach(nomina => {
      const dept = nomina.departamento || 'Sin Departamento';
      if (!grupos[dept]) {
        grupos[dept] = { empleados: 0, salario: 0 };
      }
      grupos[dept].empleados++;
      grupos[dept].salario += nomina.salario || 0;
    });

    return Object.entries(grupos).map(([dept, data]) => [
      dept,
      data.empleados,
      this.formatearMoneda(data.salario),
      this.formatearMoneda(Math.round(data.salario / data.empleados))
    ]);
  }

  agruparPorArea(facturas) {
    const grupos = {};
    facturas.forEach(fact => {
      const area = fact.area || 'Sin Área';
      if (!grupos[area]) {
        grupos[area] = { venta: 0, cantidad: 0 };
      }
      grupos[area].venta += fact.monto || 0;
      grupos[area].cantidad++;
    });

    return Object.entries(grupos).map(([area, data]) => [
      area,
      this.formatearMoneda(data.venta),
      data.cantidad
    ]);
  }

  agruparPorMetodoPago(facturas) {
    const grupos = {};
    facturas.forEach(fact => {
      const metodo = fact.metodoPago || 'Sin Método';
      if (!grupos[metodo]) {
        grupos[metodo] = 0;
      }
      grupos[metodo] += fact.monto || 0;
    });

    return Object.entries(grupos).map(([metodo, total]) => [
      metodo,
      this.formatearMoneda(total)
    ]);
  }
}

// Exportar para uso global
window.AXYRAExcelExporter = AXYRAExcelExporter;
