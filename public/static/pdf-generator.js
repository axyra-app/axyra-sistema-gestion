/**
 * AXYRA - Generador de PDF para Comprobantes
 * Genera comprobantes exactamente como las imágenes de referencia
 */

class PDFGenerator {
  constructor() {
    this.doc = null;
  }

  /**
   * Genera un comprobante de pago
   */
  async generarComprobante(empleado, horasTrabajadas, salarioBase, tipoContrato) {
    try {
      // Crear nuevo documento PDF
      this.doc = new jsPDF();

      // Configurar fuente y tamaño
      this.doc.setFont('helvetica');
      this.doc.setFontSize(12);

      // Agregar encabezado
      this.agregarEncabezado();

      // Agregar información del empleado
      this.agregarInformacionEmpleado(empleado, tipoContrato, salarioBase);

      // Agregar tabla de horas trabajadas
      this.agregarTablaHoras(horasTrabajadas, salarioBase);

      // Agregar totales
      this.agregarTotales(horasTrabajadas, salarioBase);

      // Agregar sección de firma
      this.agregarFirma();

      // Generar nombre del archivo
      const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
      const hora = new Date()
        .toLocaleTimeString('es-CO', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
        })
        .replace(/:/g, '-');
      const filename = `ORDEN_DE_TRABAJO_N°_${fecha}_${hora}.pdf`;

      // Guardar PDF
      this.doc.save(filename);

      return {
        success: true,
        filename: filename,
      };
    } catch (error) {
      console.error('Error generando PDF:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Obtiene la configuración completa de la empresa
   */
  obtenerConfiguracionEmpresa() {
    try {
      const configuracion = JSON.parse(localStorage.getItem('axyra_configuracion') || '{}');

      return {
        nombreEmpresa: configuracion.nombreEmpresa || 'VILLA VENECIA',
        nitEmpresa: configuracion.nitEmpresa || '901.234.567-8',
        direccionEmpresa: configuracion.direccionEmpresa || 'CRA. 43 SUCRE, VENECIA, ANTIOQUIA, COLOMBIA',
        telefonoEmpresa: configuracion.telefonoEmpresa || '',
        emailEmpresa: configuracion.emailEmpresa || '',
        sitioWebEmpresa: configuracion.sitioWebEmpresa || '',
        // Configuración de nómina
        salarioMinimo: parseFloat(configuracion.salarioMinimo) || 1423500,
        auxilioTransporte: parseFloat(configuracion.auxilioTransporte) || 100000,
        porcentajeSalud: parseFloat(configuracion.porcentajeSalud) || 4,
        porcentajePension: parseFloat(configuracion.porcentajePension) || 4,
        horasEstandar: parseFloat(configuracion.horasEstandar) || 160,
        // Recargos
        recargoNocturno: parseFloat(configuracion.recargoNocturno) || 35,
        recargoDominical: parseFloat(configuracion.recargoDominical) || 75,
        recargoExtraDiurna: parseFloat(configuracion.recargoExtraDiurna) || 25,
        recargoExtraNocturna: parseFloat(configuracion.recargoExtraNocturna) || 75,
        recargoFestivo: parseFloat(configuracion.recargoFestivo) || 75,
        recargoDominicalNocturno: parseFloat(configuracion.recargoDominicalNocturno) || 110,
      };
    } catch (error) {
      console.error('Error obteniendo configuración de empresa:', error);
      // Retornar valores por defecto
      return {
        nombreEmpresa: 'VILLA VENECIA',
        nitEmpresa: '901.234.567-8',
        direccionEmpresa: 'CRA. 43 SUCRE, VENECIA, ANTIOQUIA, COLOMBIA',
        telefonoEmpresa: '',
        emailEmpresa: '',
        sitioWebEmpresa: '',
        salarioMinimo: 1423500,
        auxilioTransporte: 100000,
        porcentajeSalud: 4,
        porcentajePension: 4,
        horasEstandar: 160,
        recargoNocturno: 35,
        recargoDominical: 75,
        recargoExtraDiurna: 25,
        recargoExtraNocturna: 75,
        recargoFestivo: 75,
        recargoDominicalNocturno: 110,
      };
    }
  }

  /**
   * Agrega el encabezado del documento
   */
  agregarEncabezado() {
    // Obtener configuración de la empresa
    const config = this.obtenerConfiguracionEmpresa();

    // Título principal
    this.doc.setFontSize(18);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('ORDEN DE TRABAJO', 105, 30, { align: 'center' });

    // Número de orden
    const fecha = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const hora = new Date()
      .toLocaleTimeString('es-CO', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      })
      .replace(/:/g, '-');
    this.doc.setFontSize(14);
    this.doc.text(`N° ${fecha}_${hora}`, 105, 45, { align: 'center' });

    // Información de la empresa - DINÁMICA
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`EMPRESA: ${config.nombreEmpresa.toUpperCase()}`, 20, 65);
    this.doc.text(`NIT: ${config.nitEmpresa}`, 20, 75);
    this.doc.text(`DIRECCIÓN: ${config.direccionEmpresa.toUpperCase()}`, 20, 85);
  }

  /**
   * Agrega la información del empleado
   */
  agregarInformacionEmpleado(empleado, tipoContrato, salarioBase) {
    // Título de sección
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('PRESTADOR DEL SERVICIO', 20, 110);

    // Información del empleado
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text(`Name: ${empleado.nombre}`, 20, 125);
    this.doc.text(`CÉDULA: ${empleado.cedula || 'N/A'}`, 20, 135);
    this.doc.text(`TIPO DE CONTRATO: ${tipoContrato === 'POR_HORAS' ? 'TEMPORAL' : 'FIJO'}`, 20, 145);

    // Salario base y horas
    this.doc.text(`SALARIO BASE LIQUIDACIÓN: $${this.formatearMoneda(salarioBase)}`, 20, 155);

    // Calcular total de horas
    const totalHoras = this.calcularTotalHoras(empleado);
    this.doc.text(`TOTAL HORAS TRABAJADAS: ${totalHoras.toFixed(1)}`, 20, 165);
  }

  /**
   * Agrega la tabla de horas trabajadas
   */
  agregarTablaHoras(horasTrabajadas, salarioBase) {
    // Obtener configuración de la empresa para recargos
    const config = this.obtenerConfiguracionEmpresa();

    // Título de la tabla
    this.doc.setFontSize(14);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text('DETALLE DE HORAS Y VALORES', 20, 190);

    // Encabezados de la tabla
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'bold');
    const headers = ['CONCEPTO', 'VALOR HORA', 'VALOR RECARGO', 'VALOR TOTAL', 'HORAS', 'SUBTOTAL'];
    const columnWidths = [50, 25, 25, 25, 20, 25];
    let xPos = 20;

    headers.forEach((header, index) => {
      this.doc.text(header, xPos, 205);
      xPos += columnWidths[index];
    });

    // Línea separadora
    this.doc.line(20, 210, 190, 210);

    // Datos de la tabla
    this.doc.setFontSize(9);
    this.doc.setFont('helvetica', 'normal');
    let yPos = 220;

    const conceptos = [
      { nombre: 'ORDINARIAS', recargo: 0, horas: horasTrabajadas.horas_ordinarias || 0 },
      { nombre: 'RECARGO NOCTURNO', recargo: config.recargoNocturno, horas: horasTrabajadas.horas_nocturnas || 0 },
      {
        nombre: 'RECARGO DIURNO DOMINICAL',
        recargo: config.recargoDominical,
        horas: horasTrabajadas.horas_dominicales || 0,
      },
      {
        nombre: 'RECARGO NOCTURNO DOMINICAL',
        recargo: config.recargoDominicalNocturno,
        horas: horasTrabajadas.horas_dominicales_nocturnas || 0,
      },
      {
        nombre: 'HORA EXTRA DIURNA',
        recargo: config.recargoExtraDiurna,
        horas: horasTrabajadas.horas_extra_diurnas || 0,
      },
      {
        nombre: 'HORA EXTRA NOCTURNA',
        recargo: config.recargoExtraNocturna,
        horas: horasTrabajadas.horas_extra_nocturnas || 0,
      },
      {
        nombre: 'HORA DIURNA DOMINICAL O FESTIVO',
        recargo: config.recargoFestivo,
        horas: horasTrabajadas.horas_festivas || 0,
      },
      {
        nombre: 'HORA EXTRA DIURNA DOMINICAL O FESTIVO',
        recargo: config.recargoExtraDiurna,
        horas: horasTrabajadas.horas_extra_dominicales || 0,
      },
      {
        nombre: 'HORA NOCTURNA DOMINICAL O FESTIVO',
        recargo: config.recargoDominicalNocturno,
        horas: horasTrabajadas.horas_dominicales_nocturnas || 0,
      },
      {
        nombre: 'HORA EXTRA NOCTURNA DOMINICAL O FESTIVO',
        recargo: config.recargoDominicalNocturno,
        horas: horasTrabajadas.horas_extra_dominicales_nocturnas || 0,
      },
    ];

    // Usar horas estándar configuradas por la empresa
    const valorHora = salarioBase / config.horasEstandar;

    conceptos.forEach((concepto) => {
      if (concepto.horas > 0) {
        const valorRecargo = valorHora * (concepto.recargo / 100);
        const valorTotal = valorHora + valorRecargo;
        const subtotal = valorTotal * concepto.horas;

        // Concepto
        this.doc.text(concepto.nombre, 20, yPos);

        // Valor hora
        this.doc.text(`$${this.formatearMoneda(valorHora)}`, 70, yPos);

        // Valor recargo
        this.doc.text(`$${this.formatearMoneda(valorRecargo)}`, 95, yPos);

        // Valor total
        this.doc.text(`$${this.formatearMoneda(valorTotal)}`, 120, yPos);

        // Horas
        this.doc.text(concepto.horas.toFixed(1), 145, yPos);

        // Subtotal
        this.doc.text(`$${this.formatearMoneda(subtotal)}`, 165, yPos);

        yPos += 8;
      }
    });
  }

  /**
   * Agrega los totales del documento
   */
  agregarTotales(horasTrabajadas, salarioBase) {
    // Obtener configuración de la empresa
    const config = this.obtenerConfiguracionEmpresa();

    // Calcular totales
    const totalHoras = this.calcularTotalHoras(horasTrabajadas);
    const valorHora = salarioBase / config.horasEstandar;
    const totalSalario = totalHoras * valorHora;

    // Línea separadora
    this.doc.line(20, 350, 190, 350);

    // Total con auxilio
    this.doc.setFontSize(12);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(`TOTAL (CON AUXILIO): $${this.formatearMoneda(totalSalario)}`, 20, 365);

    // Total neto a pagar
    this.doc.text(`TOTAL NETO A PAGAR: $${this.formatearMoneda(totalSalario)}`, 20, 375);
  }

  /**
   * Agrega la sección de firma
   */
  agregarFirma() {
    // Línea para firma
    this.doc.line(20, 420, 80, 420);
    this.doc.setFontSize(10);
    this.doc.setFont('helvetica', 'normal');
    this.doc.text('FIRMA DEL TRABAJADOR:', 20, 430);

    // Línea para cédula
    this.doc.line(20, 440, 80, 440);
    this.doc.text('CÉDULA:', 20, 450);
  }

  /**
   * Calcula el total de horas trabajadas
   */
  calcularTotalHoras(empleado) {
    // Obtener horas desde localStorage
    const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    const horasEmpleado = horas.filter((h) => h.empleadoId === empleado.id);

    let total = 0;
    horasEmpleado.forEach((registro) => {
      total += parseFloat(registro.horasOrdinarias) || 0;
      total += parseFloat(registro.horasNocturnas) || 0;
      total += parseFloat(registro.horasExtraDiurnas) || 0;
      total += parseFloat(registro.horasExtraNocturnas) || 0;
      total += parseFloat(registro.horasDominicales) || 0;
      total += parseFloat(registro.horasFestivas) || 0;
    });

    return total;
  }

  /**
   * Formatea moneda
   */
  formatearMoneda(valor) {
    return valor.toLocaleString('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}

// Exportar para uso global
window.PDFGenerator = PDFGenerator;
