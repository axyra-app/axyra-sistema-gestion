/**
 * AXYRA - Exportación de Cuadre de Caja
 * Genera reportes en formato Excel exacto al mostrado
 */

class AXYRACashReconciliationExport {
  constructor() {
    this.defaultAreas = ['RESTAURANTE', 'BAR', 'PISCINA', 'DIA DE SOL', 'HOSPEDAJE', 'TURCO', 'OTROS'];
    this.init();
  }

  /**
   * Inicializa el sistema de exportación
   */
  init() {
    this.loadCustomAreas();
  }

  /**
   * Carga las áreas personalizadas del usuario
   */
  loadCustomAreas() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return this.defaultAreas;

    const customAreas = localStorage.getItem(`axyra_work_areas_${currentUser.username}`);
    if (customAreas) {
      try {
        return JSON.parse(customAreas);
      } catch (error) {
        console.error('Error cargando áreas personalizadas:', error);
        return this.defaultAreas;
      }
    }

    return this.defaultAreas;
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('axyra_user');
      if (!userData) return null;

      const user = JSON.parse(userData);
      return user && user.username ? user : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  /**
   * Obtiene las facturas del usuario actual
   */
  getInvoices() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return [];

    const invoices = JSON.parse(localStorage.getItem('axyra_comprobantes') || '[]').filter(
      (inv) => inv.userId === currentUser.username
    );

    return invoices;
  }

  /**
   * Genera el reporte de cuadre de caja en formato Excel
   */
  generateCashReconciliationReport() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const areas = this.loadCustomAreas();
      const invoices = this.getInvoices();

      console.log('Generando reporte para usuario:', currentUser.username);
      console.log('Áreas configuradas:', areas);
      console.log('Facturas encontradas:', invoices);

      // Crear el contenido del Excel
      const excelContent = this.createExcelContent(areas, invoices, currentUser);

      // Descargar el archivo
      this.downloadExcel(excelContent, currentUser.username);

      return true;
    } catch (error) {
      console.error('Error generando reporte:', error);
      this.showMessage(`Error generando reporte: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Crea el contenido del Excel con el formato exacto de la plantilla
   */
  createExcelContent(areas, invoices, user) {
    const currentDate = new Date().toLocaleDateString('es-CO');
    const currentMonth = new Date().toLocaleDateString('es-CO', { month: 'long' }).toUpperCase();

    // Crear array de arrays para Excel (formato profesional)
    const excelContent = [];

    // Título principal
    excelContent.push(['CUADRE DE CAJA - VILLA VENECIA']);
    excelContent.push([]);

    // Información de la empresa
    excelContent.push(['EMPRESA:', 'VILLA VENECIA']);
    excelContent.push(['NIT:', '901.234.567-8']);
    excelContent.push(['DIRECCIÓN:', 'CRA. 43 SUCRE, VENECIA, ANTIOQUIA, COLOMBIA']);
    excelContent.push(['FECHA:', currentDate]);
    excelContent.push(['ENCARGADO:', user.username || 'ADMIN']);
    excelContent.push([]);

    // Resumen del día
    excelContent.push(['RESUMEN DEL DÍA']);
    excelContent.push(['Total Facturas', 'Total Ingresos']);

    const totalFacturas = invoices.length;
    const totalIngresos = invoices.reduce((total, inv) => total + (parseFloat(inv.monto) || 0), 0);

    excelContent.push([totalFacturas, totalIngresos]);
    excelContent.push([]);

    // Tabla de facturas
    excelContent.push(['FACTURAS REGISTRADAS']);
    excelContent.push(['Número', 'Fecha', 'Área', 'Monto', 'Método de Pago', 'Descripción']);

    if (invoices.length > 0) {
      invoices.forEach((invoice) => {
        excelContent.push([
          invoice.numeroFactura || '',
          invoice.fecha || '',
          invoice.area || '',
          invoice.monto || 0,
          invoice.metodoPago || '',
          invoice.descripcion || '',
        ]);
      });
    } else {
      excelContent.push(['No hay facturas registradas', '', '', '', '', '']);
    }
    excelContent.push([]);

    // Resumen por área
    excelContent.push(['RESUMEN POR ÁREA']);
    excelContent.push(['Área', 'Total Ventas', 'Cantidad Facturas']);

    const resumenAreas = {};
    invoices.forEach((invoice) => {
      const area = invoice.area || 'SIN ÁREA';
      if (!resumenAreas[area]) {
        resumenAreas[area] = { total: 0, cantidad: 0 };
      }
      resumenAreas[area].total += parseFloat(invoice.monto) || 0;
      resumenAreas[area].cantidad += 1;
    });

    Object.keys(resumenAreas).forEach((area) => {
      excelContent.push([area, resumenAreas[area].total, resumenAreas[area].cantidad]);
    });
    excelContent.push([]);

    // Resumen por método de pago
    excelContent.push(['RESUMEN POR MÉTODO DE PAGO']);
    excelContent.push(['Método', 'Total']);

    const resumenMetodos = {};
    invoices.forEach((invoice) => {
      const metodo = invoice.metodoPago || 'NO ESPECIFICADO';
      if (!resumenMetodos[metodo]) {
        resumenMetodos[metodo] = 0;
      }
      resumenMetodos[metodo] += parseFloat(invoice.monto) || 0;
    });

    Object.keys(resumenMetodos).forEach((metodo) => {
      excelContent.push([metodo, resumenMetodos[metodo]]);
    });
    excelContent.push([]);

    // Totales finales
    excelContent.push(['TOTALES FINALES']);
    excelContent.push(['Concepto', 'Valor']);
    excelContent.push(['Total Facturas', totalFacturas]);
    excelContent.push(['Total Ingresos', totalIngresos]);
    excelContent.push(['Promedio por Factura', totalFacturas > 0 ? (totalIngresos / totalFacturas).toFixed(2) : 0]);

    return excelContent;
  }

  /**
   * Calcula totales por área
   */
  calculateTotalsByArea(invoices, areas) {
    const totals = {
      total: 0,
    };

    // Inicializar totales por área
    areas.forEach((area) => {
      totals[area] = 0;
    });

    // Calcular totales
    invoices.forEach((invoice) => {
      const amount = parseFloat(invoice.monto) || 0;
      totals.total += amount;

      if (invoice.area && totals.hasOwnProperty(invoice.area)) {
        totals[invoice.area] += amount;
      }
    });

    return totals;
  }

  /**
   * Obtiene los métodos de pago disponibles
   */
  getPaymentMethods() {
    return ['EFECTIVO', 'DATÁFONO', 'TRANSFERENCIA', 'QR', 'CxC', 'GASTOS'];
  }

  /**
   * Calcula totales por método de pago
   */
  calculateTotalsByPaymentMethod(invoices) {
    const totals = {};
    const methods = this.getPaymentMethods();

    // Inicializar totales
    methods.forEach((method) => {
      totals[method] = 0;
    });

    // Calcular totales
    invoices.forEach((invoice) => {
      const amount = parseFloat(invoice.monto) || 0;
      const method = (invoice.metodoPago || '').toUpperCase();

      if (totals.hasOwnProperty(method)) {
        totals[method] += amount;
      }
    });

    return totals;
  }

  /**
   * Descarga el archivo Excel
   */
  downloadExcel(content, username) {
    try {
      // Crear archivo Excel real usando la librería SheetJS
      if (typeof XLSX !== 'undefined') {
        // Usar SheetJS para crear Excel real
        const workbook = XLSX.utils.book_new();

        // Crear hoja de datos
        const worksheet = XLSX.utils.aoa_to_sheet(content);

        // Agregar hoja al libro
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Cuadre de Caja');

        // Generar archivo Excel
        XLSX.writeFile(workbook, `CUADRE_CAJA_${username}_${new Date().toISOString().split('T')[0]}.xlsx`);

        this.showMessage('✅ Reporte Excel exportado correctamente', 'success');
      } else {
        // Fallback a CSV si no hay SheetJS
        const csvContent = this.convertToCSV(content);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');

        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', `CUADRE_CAJA_${username}_${new Date().toISOString().split('T')[0]}.csv`);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }

        this.showMessage('✅ Reporte CSV exportado correctamente', 'success');
      }
    } catch (error) {
      console.error('Error descargando archivo:', error);
      this.showMessage(`Error descargando archivo: ${error.message}`, 'error');
    }
  }

  /**
   * Convierte el contenido a formato CSV
   */
  convertToCSV(content) {
    return content
      .map((row) => row.map((cell) => (typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell)).join(','))
      .join('\n');
  }

  /**
   * Genera reporte en formato PDF (alternativo)
   */
  generatePDFReport() {
    try {
      const currentUser = this.getCurrentUser();
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      const areas = this.loadCustomAreas();
      const invoices = this.getInvoices();

      // Crear contenido HTML para PDF
      const htmlContent = this.createPDFContent(areas, invoices, currentUser);

      // Generar PDF usando jsPDF
      if (window.jsPDF) {
        this.generatePDF(htmlContent, currentUser.username);
      } else {
        throw new Error('jsPDF no está disponible');
      }

      return true;
    } catch (error) {
      console.error('Error generando PDF:', error);
      this.showMessage(`Error generando PDF: ${error.message}`, 'error');
      return false;
    }
  }

  /**
   * Crea contenido HTML para PDF
   */
  createPDFContent(areas, invoices, user) {
    const currentDate = new Date().toLocaleDateString('es-CO');
    const totals = this.calculateTotalsByArea(invoices, areas);

    let html = `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h1 style="text-align: center; color: #2563eb;">CUADRE DE CAJA</h1>
                
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="background-color: #f3f4f6;">
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">MES:</th>
                        <th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">Total</th>
        `;

    // Encabezados de áreas
    areas.forEach((area) => {
      html += `<th style="border: 1px solid #d1d5db; padding: 8px; text-align: center;">${area}</th>`;
    });

    html += '</tr>';

    // Fila de totales
    html += `<tr style="background-color: #f8fafc;">
            <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">Totales</td>
            <td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">$${totals.total.toLocaleString(
              'es-CO'
            )}</td>
        `;

    areas.forEach((area) => {
      const total = totals[area] || 0;
      html += `<td style="border: 1px solid #d1d5db; padding: 8px; font-weight: bold;">$${total.toLocaleString(
        'es-CO'
      )}</td>`;
    });

    html += '</tr></table>';

    // Información adicional
    html += `
            <div style="margin: 20px 0;">
                <p><strong>Encargado:</strong> ${user.username}</p>
                <p><strong>Fecha:</strong> ${currentDate}</p>
            </div>
        `;

    // Tabla de transacciones
    html += `
            <h3>Transacciones</h3>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <tr style="background-color: #f3f4f6;">
                    <th style="border: 1px solid #d1d5db; padding: 8px;">FACTURA</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px;">AREA</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px;">FECHA</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px;">VENTA</th>
                    <th style="border: 1px solid #d1d5db; padding: 8px;">MODO DE PAGO</th>
                </tr>
        `;

    invoices.forEach((invoice) => {
      html += `
                <tr>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${invoice.numeroFactura || ''}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${invoice.area || ''}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${invoice.fecha || ''}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">$${parseFloat(
                      invoice.monto || 0
                    ).toLocaleString('es-CO')}</td>
                    <td style="border: 1px solid #d1d5db; padding: 8px;">${invoice.metodoPago || ''}</td>
                </tr>
            `;
    });

    html += '</table></div>';

    return html;
  }

  /**
   * Genera PDF usando jsPDF
   */
  generatePDF(htmlContent, username) {
    const { jsPDF } = window.jsPDF;
    const doc = new jsPDF();

    // Agregar contenido HTML al PDF
    doc.html(htmlContent, {
      callback: function (doc) {
        doc.save(`CUADRE_CAJA_${username}_${new Date().toISOString().split('T')[0]}.pdf`);
      },
      margin: [10, 10, 10, 10],
      autoPaging: 'text',
    });

    this.showMessage('PDF de cuadre de caja generado exitosamente', 'success');
  }

  /**
   * Muestra mensajes al usuario
   */
  showMessage(message, type = 'info') {
    // Buscar sistema de mensajes existente
    if (window.showMessage) {
      window.showMessage(message, type);
    } else if (window.mostrarMensaje) {
      window.mostrarMensaje(message, type);
    } else {
      // Fallback: alert simple
      alert(message);
    }
  }

  /**
   * Obtiene estadísticas del cuadre de caja
   */
  getCashReconciliationStats() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const invoices = this.getInvoices();
    const areas = this.loadCustomAreas();

    const totals = this.calculateTotalsByArea(invoices, areas);
    const paymentTotals = this.calculateTotalsByPaymentMethod(invoices);

    return {
      totalInvoices: invoices.length,
      totalAmount: totals.total,
      totalsByArea: totals,
      totalsByPaymentMethod: paymentTotals,
      areas: areas,
      lastUpdate: new Date().toISOString(),
    };
  }
}

// Inicializar sistema de exportación
let axyraCashExport;
document.addEventListener('DOMContentLoaded', () => {
  axyraCashExport = new AXYRACashReconciliationExport();
});

// Exportar para uso global
window.AXYRACashReconciliationExport = AXYRACashReconciliationExport;
