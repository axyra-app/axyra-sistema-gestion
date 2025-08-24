// ========================================
// LEY LABORAL COLOMBIANA - CÁLCULOS DE HORAS
// ========================================

/**
 * Sistema de cálculo de horas según la Ley Laboral Colombiana
 * Basado en el Código Sustantivo del Trabajo y decretos reglamentarios
 */

class ColombianLaborLawCalculator {
  constructor() {
    // Constantes según la ley colombiana
    this.HORAS_MENSUALES = 220; // 8 horas diarias * 27.5 días (según el usuario)
    this.HORAS_DIARIAS = 8;
    this.DIAS_LABORALES_MENSUALES = 27.5;

    // Tipos de horas según la aplicación de escritorio del usuario
    this.TIPOS_HORAS = [
      ['ordinarias', 0.0],
      ['recargo_nocturno', 0.35],
      ['recargo_diurno_dominical', 0.75],
      ['recargo_nocturno_dominical', 1.1],
      ['hora_extra_diurna', 0.25],
      ['hora_extra_nocturna', 0.75],
      ['hora_diurna_dominical_o_festivo', 0.8],
      ['hora_extra_diurna_dominical_o_festivo', 1.05],
      ['hora_nocturna_dominical_o_festivo', 1.1],
      ['hora_extra_nocturna_dominical_o_festivo', 1.85],
    ];

    // Recargos según la ley (mantener compatibilidad)
    this.RECARGOS = {
      HORAS_EXTRA_DIURNAS: 1.25, // 25% extra
      HORAS_EXTRA_NOCTURNAS: 1.75, // 75% extra
      HORAS_DOMINICALES: 1.75, // 75% extra
      HORAS_FESTIVAS: 1.75, // 75% extra
      HORAS_EXTRA_FESTIVAS_DIURNAS: 2.0, // 100% extra
      HORAS_EXTRA_FESTIVAS_NOCTURNAS: 2.5, // 150% extra
      HORAS_NOCTURNAS: 1.35, // 35% extra (6 PM a 6 AM)
      HORAS_DOMINICALES_FESTIVAS: 2.0, // 100% extra
      HORAS_EXTRA_DOMINICALES: 2.0, // 100% extra
      HORAS_EXTRA_DOMINICALES_FESTIVAS: 2.5, // 150% extra
    };

    // Horarios según la ley
    this.HORARIOS = {
      DIURNO: { inicio: 6, fin: 18 }, // 6:00 AM a 6:00 PM
      NOCTURNO: { inicio: 18, fin: 6 }, // 6:00 PM a 6:00 AM
    };
  }

  /**
   * Calcular valor de la hora ordinaria
   * @param {number} salarioMensual - Salario mensual del empleado
   * @param {string} tipoContrato - Tipo de contrato ('Fijo' o 'Por Horas')
   * @returns {number} Valor de la hora ordinaria
   */
  calcularValorHoraOrdinaria(salarioMensual, tipoContrato = 'Por Horas') {
    if (!salarioMensual || salarioMensual <= 0) {
      throw new Error('El salario mensual debe ser mayor a 0');
    }

    if (tipoContrato === 'Fijo') {
      // Empleados fijos: 44 horas semanales, salario/2
      return salarioMensual / 2;
    } else {
      // Empleados por horas: salario/240 horas mensuales
      return salarioMensual / this.HORAS_MENSUALES;
    }
  }

  /**
   * Calcular horas ordinarias (6:00 AM a 6:00 PM)
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas ordinarias
   */
  calcularHorasOrdinarias(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    return horas * valorHora;
  }

  /**
   * Calcular horas nocturnas (6:00 PM a 6:00 AM)
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas nocturnas
   */
  calcularHorasNocturnas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 35% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_NOCTURNAS;
  }

  /**
   * Calcular horas extra diurnas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas extra diurnas
   */
  calcularHorasExtraDiurnas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 25% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_EXTRA_DIURNAS;
  }

  /**
   * Calcular horas extra nocturnas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas extra nocturnas
   */
  calcularHorasExtraNocturnas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 75% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_EXTRA_NOCTURNAS;
  }

  /**
   * Calcular horas dominicales
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas dominicales
   */
  calcularHorasDominicales(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 75% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_DOMINICALES;
  }

  /**
   * Calcular horas festivas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas festivas
   */
  calcularHorasFestivas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 75% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_FESTIVAS;
  }

  /**
   * Calcular horas extra festivas diurnas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas extra festivas diurnas
   */
  calcularHorasExtraFestivasDiurnas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 100% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_EXTRA_FESTIVAS_DIURNAS;
  }

  /**
   * Calcular horas extra festivas nocturnas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas extra festivas nocturnas
   */
  calcularHorasExtraFestivasNocturnas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 150% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_EXTRA_FESTIVAS_NOCTURNAS;
  }

  /**
   * Calcular horas dominicales festivas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas dominicales festivas
   */
  calcularHorasDominicalesFestivas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 100% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_DOMINICALES_FESTIVAS;
  }

  /**
   * Calcular horas extra dominicales
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas extra dominicales
   */
  calcularHorasExtraDominicales(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 100% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_EXTRA_DOMINICALES;
  }

  /**
   * Calcular horas extra dominicales festivas
   * @param {number} horas - Cantidad de horas
   * @param {number} valorHora - Valor de la hora ordinaria
   * @returns {number} Valor total de horas extra dominicales festivas
   */
  calcularHorasExtraDominicalesFestivas(horas, valorHora) {
    if (!horas || horas < 0) return 0;
    // 150% de recargo según la ley
    return horas * valorHora * this.RECARGOS.HORAS_EXTRA_DOMINICALES_FESTIVAS;
  }

  /**
   * Calcular total de horas trabajadas
   * @param {Object} horasData - Objeto con todos los tipos de horas
   * @returns {number} Total de horas trabajadas
   */
  calcularTotalHoras(horasData) {
    const {
      ordinarias = 0,
      nocturnas = 0,
      extraDiurnas = 0,
      extraNocturnas = 0,
      dominicales = 0,
      festivas = 0,
      extraFestivasDiurnas = 0,
      extraFestivasNocturnas = 0,
      dominicalesFestivas = 0,
      extraDominicales = 0,
      extraDominicalesFestivas = 0,
    } = horasData;

    return (
      ordinarias +
      nocturnas +
      extraDiurnas +
      extraNocturnas +
      dominicales +
      festivas +
      extraFestivasDiurnas +
      extraFestivasNocturnas +
      dominicalesFestivas +
      extraDominicales +
      extraDominicalesFestivas
    );
  }

  /**
   * Calcular total de salarios según tipos de horas
   * @param {Object} horasData - Objeto con todos los tipos de horas
   * @param {number} salarioMensual - Salario mensual del empleado
   * @param {string} tipoContrato - Tipo de contrato ('Fijo' o 'Por Horas')
   * @returns {Object} Objeto con todos los cálculos
   */
  calcularSalariosCompletos(horasData, salarioMensual, tipoContrato = 'Por Horas') {
    if (!salarioMensual || salarioMensual <= 0) {
      throw new Error('El salario mensual debe ser mayor a 0');
    }

    const valorHora = this.calcularValorHoraOrdinaria(salarioMensual, tipoContrato);
    const valoresHoras = this.calcularValoresHoras(salarioMensual, tipoContrato);

    // Mapear nombres de campos a los tipos de horas correctos
    const mapeoCampos = {
      ordinarias: 'ordinarias',
      nocturnas: 'recargo_nocturno',
      extraDiurnas: 'hora_extra_diurna',
      extraNocturnas: 'hora_extra_nocturna',
      dominicales: 'recargo_diurno_dominical',
      festivas: 'hora_diurna_dominical_o_festivo',
      extraFestivasDiurnas: 'hora_extra_diurna_dominical_o_festivo',
      extraFestivasNocturnas: 'hora_extra_nocturna_dominical_o_festivo',
      dominicalesFestivas: 'hora_nocturna_dominical_o_festivo',
      extraDominicales: 'recargo_nocturno_dominical',
      extraDominicalesFestivas: 'hora_extra_nocturna_dominical_o_festivo',
    };

    // Calcular cada tipo de salario usando los valores correctos
    const salarios = {};
    Object.entries(horasData).forEach(([campo, horas]) => {
      if (horas > 0) {
        const tipoHora = mapeoCampos[campo] || campo;
        const valorHoraTipo = valoresHoras.valores[tipoHora] || valorHora;
        salarios[campo] = horas * valorHoraTipo;
      } else {
        salarios[campo] = 0;
      }
    });

    // Calcular totales
    const totalHoras = Object.values(horasData).reduce((sum, horas) => sum + (horas || 0), 0);
    const totalSalario = Object.values(salarios).reduce((sum, valor) => sum + valor, 0);

    return {
      valorHora,
      valoresHoras,
      salarios,
      totalHoras,
      totalSalario,
      resumen: {
        salarioBase: salarioMensual,
        horasTrabajadas: totalHoras,
        valorTotal: totalSalario,
        tipoContrato: tipoContrato,
        valoresPorHora: valoresHoras.valores,
      },
    };
  }

  /**
   * Generar resumen detallado para comprobantes
   * @param {Object} calculo - Resultado de calcularSalariosCompletos
   * @param {Object} empleado - Datos del empleado
   * @param {string} fecha - Fecha de trabajo
   * @returns {Object} Resumen para comprobante
   */
  generarResumenComprobante(calculo, empleado, fecha) {
    return {
      empleado: {
        nombre: empleado.nombre || 'N/A',
        cedula: empleado.cedula || 'N/A',
        cargo: empleado.cargo || 'N/A',
        departamento: empleado.departamento || 'N/A',
      },
      fecha: fecha,
      resumen: calculo.resumen,
      desglose: calculo.salarios,
      totales: {
        horas: calculo.totalHoras,
        salario: calculo.totalSalario,
        valorHora: calculo.valorHora,
      },
      ley: {
        horasMensuales: this.HORAS_MENSUALES,
        recargos: this.RECARGOS,
        horarios: this.HORARIOS,
      },
    };
  }

  /**
   * Calcular valor de cada tipo de hora según el empleado
   * @param {number} salarioMensual - Salario mensual del empleado
   * @param {string} tipoContrato - Tipo de contrato ('Fijo' o 'Por Horas')
   * @returns {Object} Valores de cada tipo de hora
   */
  calcularValoresHoras(salarioMensual, tipoContrato = 'Por Horas') {
    if (!salarioMensual || salarioMensual <= 0) {
      throw new Error('El salario mensual debe ser mayor a 0');
    }

    const valorHoraBase = this.calcularValorHoraOrdinaria(salarioMensual, tipoContrato);
    const valores = {};

    // Mapear campos del formulario a tipos de horas
    const mapeoCampos = {
      ordinarias: 'ordinarias',
      nocturnas: 'recargo_nocturno',
      extraDiurnas: 'hora_extra_diurna',
      extraNocturnas: 'hora_extra_nocturna',
      dominicales: 'recargo_diurno_dominical',
      festivas: 'hora_diurna_dominical_o_festivo',
      extraFestivasDiurnas: 'hora_extra_diurna_dominical_o_festivo',
      extraFestivasNocturnas: 'hora_extra_nocturna_dominical_o_festivo',
      dominicalesFestivas: 'hora_nocturna_dominical_o_festivo',
      extraDominicales: 'recargo_nocturno_dominical',
      extraDominicalesFestivas: 'hora_extra_nocturna_dominical_o_festivo',
    };

    // Calcular valor de cada tipo de hora según los TIPOS_HORAS
    this.TIPOS_HORAS.forEach(([tipo, recargo]) => {
      valores[tipo] = valorHoraBase * (1 + recargo);
    });

    // Agregar valores mapeados para los campos del formulario
    Object.entries(mapeoCampos).forEach(([campoFormulario, tipoHora]) => {
      if (valores[tipoHora] !== undefined) {
        valores[campoFormulario] = valores[tipoHora];
      }
    });

    return {
      valorHoraBase,
      valores,
      tipoContrato,
      salarioMensual,
      mapeoCampos,
    };
  }

  /**
   * Validar datos de entrada
   * @param {Object} horasData - Datos de horas
   * @param {number} salarioMensual - Salario mensual
   * @returns {Object} Resultado de validación
   */
  validarDatos(horasData, salarioMensual) {
    const errores = [];

    if (!salarioMensual || salarioMensual <= 0) {
      errores.push('El salario mensual debe ser mayor a 0');
    }

    if (!horasData || typeof horasData !== 'object') {
      errores.push('Los datos de horas son requeridos');
      return { valido: false, errores };
    }

    // Validar que al menos una hora sea mayor a 0
    const totalHoras = this.calcularTotalHoras(horasData);
    if (totalHoras <= 0) {
      errores.push('Debe registrar al menos una hora trabajada');
    }

    // Validar que no haya horas negativas
    Object.entries(horasData).forEach(([tipo, horas]) => {
      if (horas < 0) {
        errores.push(`Las horas ${tipo} no pueden ser negativas`);
      }
    });

    return {
      valido: errores.length === 0,
      errores,
      totalHoras,
    };
  }
}

// Crear instancia global
window.colombianLaborLawCalculator = new ColombianLaborLawCalculator();

// Función de conveniencia para uso directo
window.calcularHorasColombia = function (horasData, salarioMensual) {
  try {
    const validacion = window.colombianLaborLawCalculator.validarDatos(horasData, salarioMensual);

    if (!validacion.valido) {
      throw new Error(validacion.errores.join(', '));
    }

    return window.colombianLaborLawCalculator.calcularSalariosCompletos(horasData, salarioMensual);
  } catch (error) {
    console.error('❌ Error calculando horas:', error);
    throw error;
  }
};

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ColombianLaborLawCalculator;
}

console.log('✅ Calculadora de Ley Laboral Colombiana cargada correctamente');
