// Generador de PDFs para AXYRA - Sistema de Nómina
// Basado en la función generar_pdf de Python

class PDFGenerator {
  constructor() {
    this.config = {
      empresa: {
        nombre: 'VILLA VENECIA',
        nit: '900.123.456-7',
        direccion: 'Calle 123 # 45-67, Bogotá D.C.',
      },
      salario_minimo: 1423500,
      auxilio_transporte: 100000,
      recargos: {
        nocturno: 0.35,
        dominical: 0.75,
        nocturno_dominical: 1.1,
        extra_diurna: 1.25,
        extra_nocturna: 1.75,
        diurna_dominical: 0.8,
        nocturna_dominical: 1.1,
        extra_diurna_dominical: 1.05,
        extra_nocturna_dominical: 1.85,
      },
    };
  }

  // Generar comprobante de pago
  async generarComprobante(nombre, cedula, tipo, salario_base, horas_dict, deuda_comentario = '', deuda_valor = 0) {
    try {
      // Crear nuevo documento PDF
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      // Configurar fuente y estilos
      doc.setFont('helvetica');
      doc.setFontSize(12);

      // Título principal - Formato exacto como en la captura
      const fecha = new Date();
      const dia = fecha.getDate().toString().padStart(2, '0');
      const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
      const año = fecha.getFullYear();
      const hora = fecha.getHours().toString().padStart(2, '0');
      const minutos = fecha.getMinutes().toString().padStart(2, '0');
      const periodo = fecha.getHours() >= 12 ? 'PM' : 'AM';

      const numeroOrden = `${mes}-${dia}-${año}_${hora}-${minutos}-${periodo}`;

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`ORDEN DE TRABAJO N° ${numeroOrden}`, 105, 30, { align: 'center' });

      // Información de la empresa - Formato exacto como en la captura
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`EMPRESA: VILLA VENECIA`, 20, 50);
      doc.text(`NIT: 901.234.567-8`, 20, 60);
      doc.text(`DIRECCIÓN: CRA. 43 SUCRE, VENECIA, ANTIOQUIA, COLOMBIA`, 20, 70);

      // Información del empleado - Formato exacto como en la captura
      doc.text(`PRESTADOR DEL SERVICIO: ${nombre.toUpperCase()}`, 20, 90);
      doc.text(`CÉDULA: ${cedula.toUpperCase()}`, 20, 100);
      doc.text(`TIPO DE CONTRATO: ${tipo === 'POR_HORAS' ? 'TEMPORAL' : 'EMPLEADO FIJO'}`, 20, 110);
      doc.text(`SALARIO BASE LIQUIDACIÓN: $${this.formatearMoneda(salario_base)}`, 20, 120);
      doc.text(`TOTAL HORAS TRABAJADAS: ${horas_dict.total_horas.toFixed(1)}`, 20, 130);

      // Tabla de conceptos
      this.crearTablaConceptos(doc, horas_dict, tipo, salario_base);

      // Resumen de valores
      const resumen = this.calcularResumen(horas_dict, tipo, salario_base, deuda_valor);
      this.crearResumenValores(doc, resumen, deuda_comentario);

      // Firmas
      doc.text('FIRMA DEL TRABAJADOR: __________________________', 20, 250);
      doc.text('CÉDULA: __________________________', 20, 260);

      // Guardar PDF
      const nombreArchivo = `COMPROBANTE_${nombre.replace(/\s+/g, '_').toUpperCase()}_${cedula}_${fechaArchivo}.pdf`;
      doc.save(nombreArchivo);

      return { success: true, filename: nombreArchivo };
    } catch (error) {
      console.error('Error generando PDF:', error);
      return { success: false, error: error.message };
    }
  }

  // Crear tabla de conceptos
  crearTablaConceptos(doc, horas_dict, tipo, salario_base) {
    const headers = ['CONCEPTO', 'VALOR HORA', 'VALOR RECARGO', 'VALOR TOTAL', 'HORAS', 'SUBTOTAL'];
    const startY = 150;
    const colWidths = [60, 25, 25, 25, 20, 30];
    const startX = 20;

    // Encabezados
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);

    let currentX = startX;
    headers.forEach((header, index) => {
      doc.text(header, currentX, startY, { align: 'center' });
      currentX += colWidths[index];
    });

    // Línea separadora
    doc.line(startX, startY + 5, startX + 185, startY + 5);

    // Datos de conceptos
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    const conceptos = this.calcularConceptos(horas_dict, tipo, salario_base);
    let currentY = startY + 15;

    conceptos.forEach((concepto) => {
      if (concepto.horas > 0) {
        currentX = startX;
        doc.text(concepto.nombre, currentX, currentY);
        currentX += colWidths[0];

        doc.text(`$${this.formatearMoneda(concepto.valor_hora)}`, currentX, currentY, { align: 'center' });
        currentX += colWidths[1];

        doc.text(`$${this.formatearMoneda(concepto.valor_recargo)}`, currentX, currentY, { align: 'center' });
        currentX += colWidths[2];

        doc.text(`$${this.formatearMoneda(concepto.valor_total)}`, currentX, currentY, { align: 'center' });
        currentX += colWidths[3];

        doc.text(concepto.horas.toFixed(1), currentX, currentY, { align: 'center' });
        currentX += colWidths[4];

        doc.text(`$${this.formatearMoneda(concepto.subtotal)}`, currentX, currentY, { align: 'center' });

        currentY += 8;
      }
    });
  }

  // Calcular conceptos según tipo de contrato
  calcularConceptos(horas_dict, tipo, salario_base) {
    const valorHoraBase = salario_base / 220; // 220 horas mensuales
    const conceptos = [];

    if (tipo === 'FIJO') {
      // Empleado fijo - salario fijo mensual
      conceptos.push({
        nombre: 'SALARIO MENSUAL',
        valor_hora: valorHoraBase,
        valor_recargo: 0,
        valor_total: valorHoraBase,
        horas: 160,
        subtotal: salario_base,
      });
    } else {
      // Empleado por horas
      if (horas_dict.horas_ordinarias > 0) {
        conceptos.push({
          nombre: 'HORAS ORDINARIAS',
          valor_hora: valorHoraBase,
          valor_recargo: 0,
          valor_total: valorHoraBase,
          horas: horas_dict.horas_ordinarias,
          subtotal: valorHoraBase * horas_dict.horas_ordinarias,
        });
      }

      if (horas_dict.horas_nocturnas > 0) {
        conceptos.push({
          nombre: 'HORAS NOCTURNAS',
          valor_hora: valorHoraBase,
          valor_recargo: valorHoraBase * this.config.recargos.nocturno,
          valor_total: valorHoraBase * (1 + this.config.recargos.nocturno),
          horas: horas_dict.horas_nocturnas,
          subtotal: valorHoraBase * (1 + this.config.recargos.nocturno) * horas_dict.horas_nocturnas,
        });
      }

      if (horas_dict.horas_dominicales > 0) {
        conceptos.push({
          nombre: 'HORAS DOMINICALES',
          valor_hora: valorHoraBase,
          valor_recargo: valorHoraBase * this.config.recargos.dominical,
          valor_total: valorHoraBase * (1 + this.config.recargos.dominical),
          horas: horas_dict.horas_dominicales,
          subtotal: valorHoraBase * (1 + this.config.recargos.dominical) * horas_dict.horas_dominicales,
        });
      }

      if (horas_dict.horas_extra_diurnas > 0) {
        conceptos.push({
          nombre: 'HORAS EXTRA DIURNAS',
          valor_hora: valorHoraBase,
          valor_recargo: valorHoraBase * this.config.recargos.extra_diurna,
          valor_total: valorHoraBase * (1 + this.config.recargos.extra_diurna),
          horas: horas_dict.horas_extra_diurnas,
          subtotal: valorHoraBase * (1 + this.config.recargos.extra_diurna) * horas_dict.horas_extra_diurnas,
        });
      }

      if (horas_dict.horas_extra_nocturnas > 0) {
        conceptos.push({
          nombre: 'HORAS EXTRA NOCTURNAS',
          valor_hora: valorHoraBase,
          valor_recargo: valorHoraBase * this.config.recargos.extra_nocturna,
          valor_total: valorHoraBase * (1 + this.config.recargos.extra_nocturna),
          horas: horas_dict.horas_extra_nocturnas,
          subtotal: valorHoraBase * (1 + this.config.recargos.extra_nocturna) * horas_dict.horas_extra_nocturnas,
        });
      }
    }

    return conceptos;
  }

  // Crear resumen de valores
  crearResumenValores(doc, resumen, deuda_comentario) {
    let currentY = 220;

    if (resumen.auxilio > 0) {
      doc.text(`AUXILIO DE TRANSPORTE: $${this.formatearMoneda(resumen.auxilio)}`, 20, currentY);
      currentY += 10;
    }

    if (resumen.salud > 0) {
      doc.text(`APORTE SALUD: ($${this.formatearMoneda(resumen.salud)})`, 20, currentY);
      currentY += 10;
    }

    if (resumen.pension > 0) {
      doc.text(`APORTE PENSIÓN: ($${this.formatearMoneda(resumen.pension)})`, 20, currentY);
      currentY += 10;
    }

    if (resumen.deuda > 0) {
      doc.text(`MOTIVO DE DEUDA: ${deuda_comentario.toUpperCase()}`, 20, currentY);
      currentY += 10;
      doc.text(`DEUDA: ($${this.formatearMoneda(resumen.deuda)})`, 20, currentY);
      currentY += 10;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(`TOTAL (CON AUXILIO): $${this.formatearMoneda(resumen.total_con_auxilio)}`, 20, currentY);
    currentY += 10;
    doc.text(`TOTAL NETO A PAGAR: $${this.formatearMoneda(resumen.neto)}`, 20, currentY);
  }

  // Calcular resumen de valores
  calcularResumen(horas_dict, tipo, salario_base, deuda_valor) {
    const conceptos = this.calcularConceptos(horas_dict, tipo, salario_base);
    const total = conceptos.reduce((sum, concepto) => sum + concepto.subtotal, 0);

    const auxilio = this.config.auxilio_transporte;
    const salud = tipo === 'FIJO' ? salario_base * 0.04 : 0;
    const pension = tipo === 'FIJO' ? salario_base * 0.04 : 0;
    const deuda = deuda_valor || 0;

    const total_con_auxilio = total + auxilio;
    const neto = Math.max(0, total_con_auxilio - salud - pension - deuda);

    return {
      total,
      auxilio,
      salud,
      pension,
      deuda,
      total_con_auxilio,
      neto,
    };
  }

  // Formatear moneda colombiana
  formatearMoneda(valor) {
    return valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  // Actualizar configuración
  actualizarConfiguracion(nuevaConfig) {
    this.config = { ...this.config, ...nuevaConfig };
  }
}

// Exportar para uso global
window.PDFGenerator = PDFGenerator;
