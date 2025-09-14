// ========================================
// GENERADOR DE PDFS PARA COMPROBANTES - BASADO EN MAIN.PY
// ========================================

class ComprobantePDFGenerator {
  constructor() {
    this.config = this.loadConfig();
    this.init();
  }

  init() {
    try {
      // Verificar que jsPDF esté disponible
      if (typeof jsPDF === 'undefined') {
        console.warn('⚠️ jsPDF no está disponible, usando generación HTML');
      } else {
        console.log('✅ ComprobantePDFGenerator inicializado con jsPDF');
      }
    } catch (error) {
      console.error('❌ Error inicializando ComprobantePDFGenerator:', error);
    }
  }

  loadConfig() {
    try {
      const config = localStorage.getItem('axyra_config_simple');
      return config
        ? JSON.parse(config)
        : {
            empresa: {
              nombre: 'VILLA VENECIA',
              nit: 'NIT PENDIENTE',
              direccion: 'DIRECCIÓN PENDIENTE',
            },
            salarioMinimo: 1423500,
            cesantias: 8.33,
            salud: 4,
            pension: 4,
            riesgo: 0.522,
            horasMes: 240,
            horasExtras: 1.5,
          };
    } catch (error) {
      console.error('❌ Error cargando configuración:', error);
      return {};
    }
  }

  // ========================================
  // GENERACIÓN DE PDF CON JSPDF
  // ========================================

  async generarPDFComprobante(comprobante) {
    try {
      if (typeof jsPDF !== 'undefined') {
        return this.generarPDFConJsPDF(comprobante);
      } else {
        return this.generarPDFConHTML(comprobante);
      }
    } catch (error) {
      console.error('❌ Error generando PDF:', error);
      throw error;
    }
  }

  generarPDFConJsPDF(comprobante) {
    try {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Configurar fuente y estilos
      doc.setFont('helvetica');
      doc.setFontSize(20);

      // Título principal
      doc.text('COMPROBANTE DE PAGO', 105, 20, { align: 'center' });

      // Información de la empresa
      doc.setFontSize(12);
      doc.text('EMPRESA:', 20, 40);
      doc.text(this.config.empresa?.nombre || 'VILLA VENECIA', 80, 40);

      doc.text('NIT:', 20, 50);
      doc.text(this.config.empresa?.nit || 'NIT PENDIENTE', 80, 50);

      doc.text('DIRECCIÓN:', 20, 60);
      doc.text(this.config.empresa?.direccion || 'DIRECCIÓN PENDIENTE', 80, 60);

      // Línea separadora
      doc.line(20, 70, 190, 70);

      // Información del empleado
      doc.setFontSize(14);
      doc.text('INFORMACIÓN DEL EMPLEADO', 105, 85, { align: 'center' });

      doc.setFontSize(12);
      doc.text('Nombre:', 20, 100);
      doc.text(comprobante.empleado || 'N/A', 80, 100);

      doc.text('Cargo:', 20, 110);
      doc.text(comprobante.cargo || 'N/A', 80, 110);

      doc.text('Departamento:', 20, 120);
      doc.text(comprobante.departamento || 'N/A', 80, 120);

      doc.text('Cédula:', 20, 130);
      doc.text(comprobante.cedula || 'N/A', 80, 130);

      doc.text('Email:', 20, 140);
      doc.text(comprobante.email || 'N/A', 80, 140);

      // Información del contrato
      doc.setFontSize(14);
      doc.text('DETALLES DEL CONTRATO', 105, 160, { align: 'center' });

      doc.setFontSize(12);
      doc.text('Tipo de Contrato:', 20, 175);
      doc.text(comprobante.tipoContrato || 'N/A', 80, 175);

      doc.text('Salario Base:', 20, 185);
      doc.text(`$${(comprobante.salarioBase || 0).toLocaleString()}`, 80, 185);

      // Información de deuda si existe
      if (comprobante.deudaValor && comprobante.deudaValor > 0) {
        doc.text('Deuda Pendiente:', 20, 195);
        doc.text(`$${comprobante.deudaValor.toLocaleString()}`, 80, 195);

        if (comprobante.deudaComentario) {
          doc.text('Motivo:', 20, 205);
          doc.text(comprobante.deudaComentario, 80, 205);
        }
      }

      // Fecha de generación
      doc.setFontSize(10);
      doc.text(`Fecha de Generación: ${new Date().toLocaleDateString()}`, 20, 250);
      doc.text(`Hora: ${new Date().toLocaleTimeString()}`, 20, 255);

      // Pie de página
      doc.setFontSize(8);
      doc.text('Este documento es generado automáticamente por el sistema AXYRA', 105, 280, { align: 'center' });

      return doc;
    } catch (error) {
      console.error('❌ Error generando PDF con jsPDF:', error);
      throw error;
    }
  }

  generarPDFConHTML(comprobante) {
    try {
      // Crear contenido HTML para imprimir
      const contenido = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <title>Comprobante de Pago - ${comprobante.empleado}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
              .no-print { display: none; }
            }
            
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            
            .header {
              text-align: center;
              border-bottom: 3px solid #1e3a8a;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            
            .header h1 {
              color: #1e3a8a;
              margin: 0;
              font-size: 28px;
              text-transform: uppercase;
            }
            
            .empresa-info {
              background: #f8fafc;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #1e3a8a;
            }
            
            .empleado-info {
              background: white;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border: 1px solid #e2e8f0;
            }
            
            .empleado-info h3 {
              color: #1e3a8a;
              margin: 0 0 15px 0;
              border-bottom: 2px solid #cbd5e1;
              padding-bottom: 8px;
            }
            
            .info-row {
              display: flex;
              margin-bottom: 10px;
              align-items: center;
            }
            
            .info-label {
              font-weight: bold;
              width: 150px;
              color: #374151;
            }
            
            .info-value {
              flex: 1;
              color: #1f2937;
            }
            
            .deuda-section {
              background: #fef2f2;
              padding: 20px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #ef4444;
            }
            
            .deuda-section h3 {
              color: #dc2626;
              margin: 0 0 15px 0;
            }
            
            .footer {
              text-align: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid #e2e8f0;
              color: #6b7280;
              font-size: 12px;
            }
            
            .print-buttons {
              text-align: center;
              margin: 20px 0;
            }
            
            .btn {
              background: #1e3a8a;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 6px;
              cursor: pointer;
              margin: 0 10px;
              font-size: 14px;
            }
            
            .btn:hover {
              background: #1e40af;
            }
            
            .btn-print {
              background: #059669;
            }
            
            .btn-print:hover {
              background: #047857;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>COMPROBANTE DE PAGO</h1>
            <p>${this.config.empresa?.nombre || 'VILLA VENECIA'}</p>
          </div>
          
          <div class="empresa-info">
            <div class="info-row">
              <span class="info-label">Empresa:</span>
              <span class="info-value">${this.config.empresa?.nombre || 'VILLA VENECIA'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">NIT:</span>
              <span class="info-value">${this.config.empresa?.nit || 'NIT PENDIENTE'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Dirección:</span>
              <span class="info-value">${this.config.empresa?.direccion || 'DIRECCIÓN PENDIENTE'}</span>
            </div>
          </div>
          
          <div class="empleado-info">
            <h3>INFORMACIÓN DEL EMPLEADO</h3>
            <div class="info-row">
              <span class="info-label">Nombre:</span>
              <span class="info-value">${comprobante.empleado || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cargo:</span>
              <span class="info-value">${comprobante.cargo || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Departamento:</span>
              <span class="info-value">${comprobante.departamento || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Cédula:</span>
              <span class="info-value">${comprobante.cedula || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Email:</span>
              <span class="info-value">${comprobante.email || 'N/A'}</span>
            </div>
          </div>
          
          <div class="empleado-info">
            <h3>DETALLES DEL CONTRATO</h3>
            <div class="info-row">
              <span class="info-label">Tipo de Contrato:</span>
              <span class="info-value">${comprobante.tipoContrato || 'N/A'}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Salario Base:</span>
              <span class="info-value">$${(comprobante.salarioBase || 0).toLocaleString()}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Fecha de Generación:</span>
              <span class="info-value">${new Date().toLocaleDateString()}</span>
            </div>
          </div>
          
          ${
            comprobante.deudaValor && comprobante.deudaValor > 0
              ? `
          <div class="deuda-section">
            <h3>INFORMACIÓN DE DEUDA</h3>
            <div class="info-row">
              <span class="info-label">Valor de Deuda:</span>
              <span class="info-value">$${comprobante.deudaValor.toLocaleString()}</span>
            </div>
            ${
              comprobante.deudaComentario
                ? `
            <div class="info-row">
              <span class="info-label">Motivo:</span>
              <span class="info-value">${comprobante.deudaComentario}</span>
            </div>
            `
                : ''
            }
          </div>
          `
              : ''
          }
          
          <div class="footer">
            <p>Este documento es generado automáticamente por el sistema AXYRA</p>
            <p>Fecha: ${new Date().toLocaleDateString()} | Hora: ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="print-buttons no-print">
            <button class="btn btn-print" onclick="window.print()">
              🖨️ Imprimir Comprobante
            </button>
            <button class="btn" onclick="window.close()">
              ❌ Cerrar
            </button>
          </div>
        </body>
        </html>
      `;

      // Abrir en nueva ventana
      const ventana = window.open('', '_blank');
      ventana.document.write(contenido);
      ventana.document.close();

      return ventana;
    } catch (error) {
      console.error('❌ Error generando PDF con HTML:', error);
      throw error;
    }
  }

  // ========================================
  // GENERACIÓN DE COMPROBANTE COMPLETO
  // ========================================

  async generarComprobanteCompleto(empleadoId, tipoContrato, salarioBase, deudaComentario = '', deudaValor = 0) {
    try {
      // Obtener información del empleado
      const empleados = await this.getEmpleados();
      const empleado = empleados.find((emp) => emp.id == empleadoId || emp.id == parseInt(empleadoId));

      if (!empleado) {
        throw new Error('Empleado no encontrado');
      }

      // Crear objeto del comprobante
      const comprobante = {
        empleado: empleado.nombre,
        cargo: empleado.cargo || 'N/A',
        departamento: empleado.departamento || 'N/A',
        tipoContrato: tipoContrato,
        salarioBase: parseFloat(salarioBase),
        deudaComentario: deudaComentario || '',
        deudaValor: parseFloat(deudaValor) || 0,
        fecha: new Date().toISOString().split('T')[0],
        cedula: empleado.cedula || 'N/A',
        email: empleado.email || 'N/A',
      };

      // Generar PDF
      const resultado = await this.generarPDFComprobante(comprobante);

      // Si es jsPDF, descargar el archivo
      if (resultado && resultado.output) {
        const nombreArchivo = `COMPROBANTE_${empleado.nombre.replace(/\s+/g, '_')}_${empleado.cedula || 'SIN_CEDULA'}_${
          new Date().toISOString().split('T')[0]
        }.pdf`;
        resultado.save(nombreArchivo);
        return { success: true, message: 'PDF generado y descargado correctamente' };
      }

      // Si es HTML, mostrar mensaje de éxito
      if (resultado && resultado.document) {
        return { success: true, message: 'Comprobante generado, se abrirá en nueva ventana para imprimir' };
      }

      throw new Error('No se pudo generar el comprobante');
    } catch (error) {
      console.error('❌ Error generando comprobante completo:', error);
      throw error;
    }
  }

  // ========================================
  // UTILIDADES
  // ========================================

  async getEmpleados() {
    try {
      // Usar el sistema de sincronización si está disponible
      if (window.firebaseSyncManager) {
        return await window.firebaseSyncManager.getEmpleados();
      }

      // Fallback a localStorage
      const data = localStorage.getItem('axyra_empleados');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error obteniendo empleados:', error);
      return [];
    }
  }

  // ========================================
  // MÉTODOS PÚBLICOS
  // ========================================

  async generarComprobante(empleadoId, tipoContrato, salarioBase, deudaComentario = '', deudaValor = 0) {
    return await this.generarComprobanteCompleto(empleadoId, tipoContrato, salarioBase, deudaComentario, deudaValor);
  }

  previsualizarComprobante(empleadoId, tipoContrato, salarioBase, deudaComentario = '', deudaValor = 0) {
    return this.generarComprobanteCompleto(empleadoId, tipoContrato, salarioBase, deudaComentario, deudaValor);
  }
}

// Crear instancia global
window.comprobantePDFGenerator = new ComprobantePDFGenerator();
