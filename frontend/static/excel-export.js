// ========================================
// SISTEMA DE EXPORTACIÓN EXCEL AXYRA PROFESIONAL
// ========================================

class AXYRAExcelExporter {
  constructor() {
    this.companyName = this.getCompanyName();
    this.companyNIT = this.getCompanyNIT();
    this.exportDate = new Date().toLocaleDateString('es-CO', {
      timeZone: 'America/Bogota',
    });
  }

  // Obtener nombre de empresa desde configuración
  getCompanyName() {
    const config = localStorage.getItem('axyra_configuracion');
    if (config) {
      try {
        const configData = JSON.parse(config);
        return configData.nombreEmpresa || 'Villa Venecia';
      } catch (e) {
        return 'Villa Venecia';
      }
    }
    return 'Villa Venecia';
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

  // Formatear número con separadores de miles
  formatNumberWithSeparators(number) {
    if (number === null || number === undefined || number === '') return '0';

    const num = parseFloat(number);
    if (isNaN(num)) return '0';

    return num.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Formatear moneda colombiana
  formatCurrency(amount) {
    if (amount === null || amount === undefined || amount === '') return '$0';

    const num = parseFloat(amount);
    if (isNaN(num)) return '$0';

    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  }

  // Aplicar estilos profesionales a una hoja
  applyProfessionalStyles(worksheet, dataRange) {
    try {
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

      // Estilos para filas alternas
      const alternateRowStyle = {
        font: { size: 11, color: { rgb: '1F2937' } },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { rgb: 'FFFFFF' },
        },
        border: {
          top: { style: 'thin', color: { rgb: 'E2E8F0' } },
          bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
          left: { style: 'thin', color: { rgb: 'E2E8F0' } },
          right: { style: 'thin', color: { rgb: 'E2E8F0' } },
        },
      };

      // Aplicar estilos a encabezados
      for (let col = 0; col <= dataRange.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = headerStyle;
        }
      }

      // Aplicar estilos a datos con filas alternas
      for (let row = 1; row <= dataRange.e.r; row++) {
        for (let col = 0; col <= dataRange.e.c; col++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellRef]) {
            // Aplicar estilo alternado
            worksheet[cellRef].s = row % 2 === 0 ? alternateRowStyle : dataStyle;
          }
        }
      }

      // Aplicar estilos a la fila de totales si existe
      const totalRow = dataRange.e.r + 1;
      for (let col = 0; col <= dataRange.e.c; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: totalRow, c: col });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = totalStyle;
        }
      }

      // Ajustar ancho de columnas automáticamente
      const columnWidths = [];
      for (let col = 0; col <= dataRange.e.c; col++) {
        let maxWidth = 0;
        for (let row = 0; row <= dataRange.e.r; row++) {
          const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
          if (worksheet[cellRef] && worksheet[cellRef].v) {
            const cellLength = String(worksheet[cellRef].v).length;
            maxWidth = Math.max(maxWidth, cellLength);
          }
        }
        columnWidths[col] = Math.min(Math.max(maxWidth + 2, 10), 50);
      }

      worksheet['!cols'] = columnWidths.map((width) => ({ width }));

      console.log('✅ Estilos profesionales aplicados correctamente');
    } catch (error) {
      console.error('❌ Error aplicando estilos:', error);
    }
  }

  // Crear encabezado del reporte
  createReportHeader(worksheet, title, subtitle = '') {
    try {
      // Título principal
      worksheet['A1'] = { v: title, t: 's' };
      worksheet['A1'].s = {
        font: { bold: true, size: 16, color: { rgb: '1E3A8A' } },
        alignment: { horizontal: 'center' },
      };

      // Información de la empresa
      worksheet['A2'] = { v: `EMPRESA: ${this.companyName}`, t: 's' };
      worksheet['A3'] = { v: `NIT: ${this.companyNIT}`, t: 's' };
      worksheet['A4'] = { v: `FECHA DE EXPORTACIÓN: ${this.exportDate}`, t: 's' };

      // Estilos para la información de la empresa
      [2, 3, 4].forEach((row) => {
        worksheet[`A${row}`].s = {
          font: { size: 12, color: { rgb: '374151' } },
        };
      });

      // Combinar celdas para el título
      worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];

      console.log('✅ Encabezado del reporte creado correctamente');
    } catch (error) {
      console.error('❌ Error creando encabezado:', error);
    }
  }

  // Exportar nóminas con estilos profesionales
  exportarNomina() {
    try {
      // Obtener datos de nóminas desde localStorage
      const nominasData = localStorage.getItem('axyra_nominas');
      if (!nominasData) {
        this.showNotification('No hay nóminas para exportar', 'warning');
        return;
      }

      const nominas = JSON.parse(nominasData);
      if (nominas.length === 0) {
        this.showNotification('No hay nóminas generadas para exportar', 'warning');
        return;
      }

      // Obtener empleados para completar información
      const empleadosData = localStorage.getItem('axyra_empleados');
      const empleados = empleadosData ? JSON.parse(empleadosData) : [];

      // Preparar datos para exportación
      const data = [
        // Encabezados
        [
          'ID',
          'Empleado',
          'Cédula',
          'Período',
          'Horas Normales',
          'Horas Extras',
          'Horas Nocturnas',
          'Horas Dominicales',
          'Salario Base',
          'Bonificaciones',
          'Deducciones',
          'Salario Neto',
          'Costo Empresa',
          'Estado',
          'Fecha Generación',
        ],
      ];

      // Agregar datos de nóminas
      nominas.forEach((nomina) => {
        const empleado = empleados.find((e) => e.id === nomina.empleado_id);
        data.push([
          nomina.id || 'N/A',
          empleado ? empleado.nombre : 'Empleado no encontrado',
          empleado ? empleado.cedula || 'N/A' : 'N/A',
          `${this.getMonthName(nomina.mes)} ${nomina.anio}`,
          this.formatNumberWithSeparators(nomina.horas_trabajadas || 0),
          this.formatNumberWithSeparators(nomina.horas_extras || 0),
          this.formatNumberWithSeparators(nomina.horas_nocturnas || 0),
          this.formatNumberWithSeparators(nomina.horas_dominicales || 0),
          this.formatCurrency(nomina.salario_base || 0),
          this.formatCurrency(nomina.bonificaciones || 0),
          this.formatCurrency(nomina.deducciones || 0),
          this.formatCurrency(nomina.salario_neto || 0),
          this.formatCurrency(nomina.costo_total_empresa || 0),
          nomina.estado || 'Generada',
          new Date(nomina.fecha_generacion).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' }),
        ]);
      });

      // Agregar fila de totales
      const totales = [
        'TOTALES',
        '',
        '',
        '',
        this.formatNumberWithSeparators(nominas.reduce((sum, n) => sum + (n.horas_trabajadas || 0), 0)),
        this.formatNumberWithSeparators(nominas.reduce((sum, n) => sum + (n.horas_extras || 0), 0)),
        this.formatNumberWithSeparators(nominas.reduce((sum, n) => sum + (n.horas_nocturnas || 0), 0)),
        this.formatNumberWithSeparators(nominas.reduce((sum, n) => sum + (n.horas_dominicales || 0), 0)),
        this.formatCurrency(nominas.reduce((sum, n) => sum + (n.salario_base || 0), 0)),
        this.formatCurrency(nominas.reduce((sum, n) => sum + (n.bonificaciones || 0), 0)),
        this.formatCurrency(nominas.reduce((sum, n) => sum + (n.deducciones || 0), 0)),
        this.formatCurrency(nominas.reduce((sum, n) => sum + (n.salario_neto || 0), 0)),
        this.formatCurrency(nominas.reduce((sum, n) => sum + (n.costo_total_empresa || 0), 0)),
        '',
        '',
      ];
      data.push(totales);

      // Crear hoja de trabajo
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Crear encabezado del reporte
      this.createReportHeader(worksheet, 'REPORTE DE NÓMINAS - Villa Venecia');

      // Aplicar estilos profesionales
      const dataRange = XLSX.utils.decode_range(worksheet['!ref']);
      this.applyProfessionalStyles(worksheet, dataRange);

      // Crear libro de trabajo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Nóminas');

      // Generar nombre de archivo con fecha y hora de Colombia
      const now = new Date();
      const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const fileName = `REPORTE_NOMINAS_Villa_Venecia_${colombiaTime.toISOString().split('T')[0]}_${colombiaTime
        .getHours()
        .toString()
        .padStart(2, '0')}-${colombiaTime.getMinutes().toString().padStart(2, '0')}.xlsx`;

      // Exportar archivo
      XLSX.writeFile(workbook, fileName);

      this.showNotification('Reporte de nóminas exportado correctamente con estilos profesionales', 'success');
      console.log('✅ Nóminas exportadas con estilos profesionales');
    } catch (error) {
      console.error('❌ Error exportando nóminas:', error);
      this.showNotification('Error exportando nóminas: ' + error.message, 'error');
    }
  }

  // Exportar facturas con estilos profesionales
  exportarFacturas() {
    try {
      // Obtener datos de facturas desde localStorage
      const facturasData = localStorage.getItem('axyra_facturas');
      if (!facturasData) {
        this.showNotification('No hay facturas para exportar', 'warning');
        return;
      }

      const facturas = JSON.parse(facturasData);
      if (facturas.length === 0) {
        this.showNotification('No hay facturas registradas para exportar', 'warning');
        return;
      }

      // Preparar datos para exportación
      const data = [
        // Encabezados
        ['FECHA', 'NÚMERO', 'ENCARGADO', 'ÁREA', 'MONTO', 'MÉTODO PAGO', 'DESCRIPCIÓN'],
      ];

      // Agregar datos de facturas
      facturas.forEach((factura) => {
        data.push([
          new Date(factura.fecha).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' }),
          this.formatNumberWithSeparators(factura.numero || factura.id),
          factura.encargado || 'N/A',
          factura.area || 'N/A',
          this.formatCurrency(factura.monto || 0),
          factura.metodoPago || 'N/A',
          factura.descripcion || '-',
        ]);
      });

      // Agregar fila de totales
      const totalFacturas = facturas.length;
      const totalIngresos = facturas.reduce((sum, f) => sum + (f.monto || 0), 0);

      data.push(['', '', '', '', '', '', '']);
      data.push(['Total Facturas:', totalFacturas, '', '', '', '', '']);
      data.push(['Total Ingresos:', '', '', '', this.formatCurrency(totalIngresos), '', '']);

      // Crear hoja de trabajo
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Crear encabezado del reporte
      this.createReportHeader(worksheet, 'REPORTE DE FACTURAS - Villa Venecia');

      // Aplicar estilos profesionales
      const dataRange = XLSX.utils.decode_range(worksheet['!ref']);
      this.applyProfessionalStyles(worksheet, dataRange);

      // Crear libro de trabajo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Facturas');

      // Generar nombre de archivo con fecha y hora de Colombia
      const now = new Date();
      const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const fileName = `REPORTE_FACTURAS_Villa_Venecia_${colombiaTime.toISOString().split('T')[0]}_${colombiaTime
        .getHours()
        .toString()
        .padStart(2, '0')}-${colombiaTime.getMinutes().toString().padStart(2, '0')}.xlsx`;

      // Exportar archivo
      XLSX.writeFile(workbook, fileName);

      this.showNotification('Reporte de facturas exportado correctamente con estilos profesionales', 'success');
      console.log('✅ Facturas exportadas con estilos profesionales');
    } catch (error) {
      console.error('❌ Error exportando facturas:', error);
      this.showNotification('Error exportando facturas: ' + error.message, 'error');
    }
  }

  // Exportar empleados con estilos profesionales
  exportarEmpleados() {
    try {
      // Obtener datos de empleados desde localStorage
      const empleadosData = localStorage.getItem('axyra_empleados');
      if (!empleadosData) {
        this.showNotification('No hay empleados para exportar', 'warning');
        return;
      }

      const empleados = JSON.parse(empleadosData);
      if (empleados.length === 0) {
        this.showNotification('No hay empleados registrados para exportar', 'warning');
        return;
      }

      // Preparar datos para exportación
      const data = [
        // Encabezados
        [
          'ID',
          'Nombre',
          'Cédula',
          'Email',
          'Teléfono',
          'Cargo',
          'Departamento',
          'Salario',
          'Tipo Contrato',
          'Fecha Contratación',
          'Estado',
        ],
      ];

      // Agregar datos de empleados
      empleados.forEach((empleado) => {
        data.push([
          empleado.id || 'N/A',
          empleado.nombre || 'N/A',
          empleado.cedula || 'N/A',
          empleado.email || 'N/A',
          empleado.telefono || 'N/A',
          empleado.cargo || 'N/A',
          empleado.departamento || 'N/A',
          this.formatCurrency(empleado.salario || 0),
          empleado.tipo_contrato || 'N/A',
          empleado.fecha_contratacion
            ? new Date(empleado.fecha_contratacion).toLocaleDateString('es-CO', { timeZone: 'America/Bogota' })
            : 'N/A',
          empleado.estado || 'N/A',
        ]);
      });

      // Agregar fila de totales
      const totalEmpleados = empleados.length;
      const totalSalarios = empleados.reduce((sum, e) => sum + (e.salario || 0), 0);

      data.push(['', '', '', '', '', '', '', '', '', '', '']);
      data.push(['Total Empleados:', totalEmpleados, '', '', '', '', '', '', '', '', '']);
      data.push(['Total Salarios:', '', '', '', '', '', '', this.formatCurrency(totalSalarios), '', '', '']);

      // Crear hoja de trabajo
      const worksheet = XLSX.utils.aoa_to_sheet(data);

      // Crear encabezado del reporte
      this.createReportHeader(worksheet, 'REPORTE DE EMPLEADOS - Villa Venecia');

      // Aplicar estilos profesionales
      const dataRange = XLSX.utils.decode_range(worksheet['!ref']);
      this.applyProfessionalStyles(worksheet, dataRange);

      // Crear libro de trabajo
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Empleados');

      // Generar nombre de archivo con fecha y hora de Colombia
      const now = new Date();
      const colombiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Bogota' }));
      const fileName = `REPORTE_EMPLEADOS_Villa_Venecia_${colombiaTime.toISOString().split('T')[0]}_${colombiaTime
        .getHours()
        .toString()
        .padStart(2, '0')}-${colombiaTime.getMinutes().toString().padStart(2, '0')}.xlsx`;

      // Exportar archivo
      XLSX.writeFile(workbook, fileName);

      this.showNotification('Reporte de empleados exportado correctamente con estilos profesionales', 'success');
      console.log('✅ Empleados exportados con estilos profesionales');
    } catch (error) {
      console.error('❌ Error exportando empleados:', error);
      this.showNotification('Error exportando empleados: ' + error.message, 'error');
    }
  }

  // Obtener nombre del mes
  getMonthName(month) {
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];
    return meses[month - 1] || 'Mes inválido';
  }

  // Mostrar notificación
  showNotification(message, type = 'info') {
    // Buscar contenedor de notificaciones
    let container = document.getElementById('notificationContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notificationContainer';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        max-width: 400px;
      `;
      document.body.appendChild(container);
    }

    // Crear notificación
    const notification = document.createElement('div');
    const colors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
    };

    notification.style.cssText = `
      background: ${colors[type] || colors.info};
      color: white;
      padding: 15px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: slideInRight 0.3s ease;
    `;
    notification.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span>${message}</span>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">×</button>
      </div>
    `;

    container.appendChild(notification);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }
}

// Crear instancia global
window.axyraExcelExport = new AXYRAExcelExporter();

// Agregar estilos CSS para las notificaciones
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(notificationStyles);

console.log('✅ Sistema de exportación Excel AXYRA cargado correctamente');
console.log('📊 Funciones disponibles:');
console.log('- axyraExcelExport.exportarNomina()');
console.log('- axyraExcelExport.exportarFacturas()');
console.log('- axyraExcelExport.exportarEmpleados()');
