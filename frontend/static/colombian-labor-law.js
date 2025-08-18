// Legislación Laboral Colombiana 2025 - Cálculo Automático de Horas
// Implementa todos los recargos y tipos de horas según la ley vigente

class ColombianLaborLaw {
  constructor() {
    // Festivos colombianos 2025
    this.festivos2025 = [
      '2025-01-01', // Año Nuevo
      '2025-01-06', // Reyes Magos
      '2025-03-24', // Domingo de Ramos
      '2025-03-27', // Jueves Santo
      '2025-03-28', // Viernes Santo
      '2025-03-30', // Domingo de Resurrección
      '2025-05-01', // Día del Trabajo
      '2025-05-12', // Día de la Ascensión
      '2025-06-02', // Corpus Christi
      '2025-06-09', // Sagrado Corazón
      '2025-06-30', // San Pedro y San Pablo
      '2025-07-20', // Día de la Independencia
      '2025-08-07', // Batalla de Boyacá
      '2025-08-18', // Asunción de la Virgen
      '2025-10-13', // Día de la Raza
      '2025-11-03', // Todos los Santos
      '2025-11-10', // Independencia de Cartagena
      '2025-12-08', // Día de la Inmaculada
      '2025-12-25', // Navidad
    ];

    // Recargos según legislación colombiana 2025
    this.recargos = {
      nocturno: 0.35, // 35% recargo nocturno
      dominical: 0.75, // 75% recargo dominical
      nocturno_dominical: 1.1, // 110% recargo dominical nocturno
      extra_diurna: 1.25, // 125% recargo extra diurna
      extra_nocturna: 1.75, // 175% recargo extra nocturna
      diurna_dominical: 0.8, // 80% recargo dominical diurno
      nocturna_dominical: 1.1, // 110% recargo dominical nocturno
      extra_diurna_dominical: 1.05, // 105% recargo extra dominical diurno
      extra_nocturna_dominical: 1.85, // 185% recargo extra dominical nocturno
      festivo: 0.75, // 75% recargo festivo
      festivo_nocturno: 1.1, // 110% recargo festivo nocturno
      extra_festivo: 1.05, // 105% recargo extra festivo
      extra_festivo_nocturno: 1.85, // 185% recargo extra festivo nocturno
    };

    // Horarios según legislación
    this.horarios = {
      inicio_dia: 6, // 6:00 AM - Inicio del día laboral
      fin_dia: 18, // 6:00 PM - Fin del día laboral
      max_horas_normales: 8, // Máximo 8 horas normales por día
      max_horas_semana: 48, // Máximo 48 horas por semana
    };
  }

  // Verificar si una fecha es festivo
  esFestivo(fecha) {
    const fechaStr = fecha.toISOString().split('T')[0];
    return this.festivos2025.includes(fechaStr);
  }

  // Verificar si es domingo
  esDomingo(fecha) {
    return fecha.getDay() === 0;
  }

  // Verificar si es hora nocturna
  esHoraNocturna(hora) {
    return hora < this.horarios.inicio_dia || hora >= this.horarios.fin_dia;
  }

  // Calcular distribución automática de horas según entrada y salida
  calcularDistribucionHoras(fecha, horaEntrada, horaSalida, salarioBase) {
    const entrada = new Date(`2000-01-01T${horaEntrada}`);
    const salida = new Date(`2000-01-01T${horaSalida}`);

    // Si la salida es menor que la entrada, asumir día siguiente
    if (salida <= entrada) {
      salida.setDate(salida.getDate() + 1);
    }

    const esDomingo = this.esDomingo(fecha);
    const esFestivo = this.esFestivo(fecha);

    // Inicializar contadores
    const distribucion = {
      horas_ordinarias: 0,
      horas_nocturnas: 0,
      horas_dominicales: 0,
      horas_dominicales_nocturnas: 0,
      horas_festivas: 0,
      horas_festivas_nocturnas: 0,
      horas_extra_diurnas: 0,
      horas_extra_nocturnas: 0,
      horas_extra_dominicales: 0,
      horas_extra_dominicales_nocturnas: 0,
      horas_extra_festivas: 0,
      horas_extra_festivas_nocturnas: 0,
      total_horas: 0,
    };

    let horaActual = new Date(entrada);
    let horasAcumuladas = 0;
    const incrementoMinutos = 1; // Calcular por minuto para mayor precisión

    while (horaActual < salida) {
      const hora = horaActual.getHours();
      const minutos = horaActual.getMinutes();
      const esNocturna = this.esHoraNocturna(hora);
      const esExtra = horasAcumuladas >= this.horarios.max_horas_normales;
      const incrementoHoras = incrementoMinutos / 60;

      // Determinar tipo de hora según legislación colombiana
      if (esFestivo) {
        if (esExtra) {
          if (esNocturna) {
            distribucion.horas_extra_festivas_nocturnas += incrementoHoras;
          } else {
            distribucion.horas_extra_festivas += incrementoHoras;
          }
        } else {
          if (esNocturna) {
            distribucion.horas_festivas_nocturnas += incrementoHoras;
          } else {
            distribucion.horas_festivas += incrementoHoras;
          }
        }
      } else if (esDomingo) {
        if (esExtra) {
          if (esNocturna) {
            distribucion.horas_extra_dominicales_nocturnas += incrementoHoras;
          } else {
            distribucion.horas_extra_dominicales += incrementoHoras;
          }
        } else {
          if (esNocturna) {
            distribucion.horas_dominicales_nocturnas += incrementoHoras;
          } else {
            distribucion.horas_dominicales += incrementoHoras;
          }
        }
      } else {
        if (esExtra) {
          if (esNocturna) {
            distribucion.horas_extra_nocturnas += incrementoHoras;
          } else {
            distribucion.horas_extra_diurnas += incrementoHoras;
          }
        } else {
          if (esNocturna) {
            distribucion.horas_nocturnas += incrementoHoras;
          } else {
            distribucion.horas_ordinarias += incrementoHoras;
          }
        }
      }

      // Avanzar tiempo
      horaActual.setMinutes(minutos + incrementoMinutos);
      horasAcumuladas += incrementoHoras;
    }

    // Calcular total
    distribucion.total_horas = Object.keys(distribucion)
      .filter((key) => key !== 'total_horas')
      .reduce((sum, key) => sum + distribucion[key], 0);

    return distribucion;
  }

  // Calcular valor total de las horas trabajadas
  calcularValorTotal(distribucion, salarioBase) {
    const valorHoraBase = salarioBase / 220; // 220 horas mensuales estándar

    let valorTotal = 0;

    // Horas ordinarias
    valorTotal += distribucion.horas_ordinarias * valorHoraBase;

    // Horas nocturnas (35% recargo)
    valorTotal += distribucion.horas_nocturnas * valorHoraBase * (1 + this.recargos.nocturno);

    // Horas dominicales (75% recargo)
    valorTotal += distribucion.horas_dominicales * valorHoraBase * (1 + this.recargos.dominical);

    // Horas dominicales nocturnas (110% recargo)
    valorTotal += distribucion.horas_dominicales_nocturnas * valorHoraBase * (1 + this.recargos.nocturno_dominical);

    // Horas festivas (75% recargo)
    valorTotal += distribucion.horas_festivas * valorHoraBase * (1 + this.recargos.festivo);

    // Horas festivas nocturnas (110% recargo)
    valorTotal += distribucion.horas_festivas_nocturnas * valorHoraBase * (1 + this.recargos.festivo_nocturno);

    // Horas extra diurnas (125% recargo)
    valorTotal += distribucion.horas_extra_diurnas * valorHoraBase * (1 + this.recargos.extra_diurna);

    // Horas extra nocturnas (175% recargo)
    valorTotal += distribucion.horas_extra_nocturnas * valorHoraBase * (1 + this.recargos.extra_nocturna);

    // Horas extra dominicales (105% recargo)
    valorTotal += distribucion.horas_extra_dominicales * valorHoraBase * (1 + this.recargos.extra_diurna_dominical);

    // Horas extra dominicales nocturnas (185% recargo)
    valorTotal +=
      distribucion.horas_extra_dominicales_nocturnas * valorHoraBase * (1 + this.recargos.extra_nocturna_dominical);

    // Horas extra festivas (105% recargo)
    valorTotal += distribucion.horas_extra_festivas * valorHoraBase * (1 + this.recargos.extra_festivo);

    // Horas extra festivas nocturnas (185% recargo)
    valorTotal +=
      distribucion.horas_extra_festivas_nocturnas * valorHoraBase * (1 + this.recargos.extra_festivo_nocturno);

    return {
      valorTotal: valorTotal,
      valorHoraBase: valorHoraBase,
      distribucion: distribucion,
    };
  }

  // Obtener descripción del tipo de día
  obtenerTipoDia(fecha) {
    if (this.esFestivo(fecha)) {
      return 'FESTIVO';
    } else if (this.esDomingo(fecha)) {
      return 'DOMINICAL';
    } else {
      return 'LABORAL';
    }
  }

  // Obtener descripción detallada de las horas
  obtenerDescripcionHoras(distribucion) {
    const descripciones = [];

    if (distribucion.horas_ordinarias > 0) {
      descripciones.push(`${distribucion.horas_ordinarias.toFixed(1)}h Ordinarias`);
    }
    if (distribucion.horas_nocturnas > 0) {
      descripciones.push(`${distribucion.horas_nocturnas.toFixed(1)}h Nocturnas`);
    }
    if (distribucion.horas_dominicales > 0) {
      descripciones.push(`${distribucion.horas_dominicales.toFixed(1)}h Dominicales`);
    }
    if (distribucion.horas_dominicales_nocturnas > 0) {
      descripciones.push(`${distribucion.horas_dominicales_nocturnas.toFixed(1)}h Dominicales Nocturnas`);
    }
    if (distribucion.horas_festivas > 0) {
      descripciones.push(`${distribucion.horas_festivas.toFixed(1)}h Festivas`);
    }
    if (distribucion.horas_festivas_nocturnas > 0) {
      descripciones.push(`${distribucion.horas_festivas_nocturnas.toFixed(1)}h Festivas Nocturnas`);
    }
    if (distribucion.horas_extra_diurnas > 0) {
      descripciones.push(`${distribucion.horas_extra_diurnas.toFixed(1)}h Extra Diurnas`);
    }
    if (distribucion.horas_extra_nocturnas > 0) {
      descripciones.push(`${distribucion.horas_extra_nocturnas.toFixed(1)}h Extra Nocturnas`);
    }
    if (distribucion.horas_extra_dominicales > 0) {
      descripciones.push(`${distribucion.horas_extra_dominicales.toFixed(1)}h Extra Dominicales`);
    }
    if (distribucion.horas_extra_dominicales_nocturnas > 0) {
      descripciones.push(`${distribucion.horas_extra_dominicales_nocturnas.toFixed(1)}h Extra Dominicales Nocturnas`);
    }
    if (distribucion.horas_extra_festivas > 0) {
      descripciones.push(`${distribucion.horas_extra_festivas.toFixed(1)}h Extra Festivas`);
    }
    if (distribucion.horas_extra_festivas_nocturnas > 0) {
      descripciones.push(`${distribucion.horas_extra_festivas_nocturnas.toFixed(1)}h Extra Festivas Nocturnas`);
    }

    return descripciones.join(', ');
  }

  // Validar horarios según legislación
  validarHorarios(horaEntrada, horaSalida) {
    const entrada = new Date(`2000-01-01T${horaEntrada}`);
    const salida = new Date(`2000-01-01T${horaSalida}`);

    if (salida <= entrada) {
      salida.setDate(salida.getDate() + 1);
    }

    const diferencia = salida - entrada;
    const totalHoras = diferencia / (1000 * 60 * 60);

    const validaciones = {
      esValido: true,
      errores: [],
      advertencias: [],
    };

    // Validar máximo de horas por día
    if (totalHoras > 12) {
      validaciones.esValido = false;
      validaciones.errores.push('Excede el máximo de 12 horas por día según la ley colombiana');
    } else if (totalHoras > 10) {
      validaciones.advertencias.push('Horario extenso - verificar cumplimiento de descansos obligatorios');
    }

    // Validar horario nocturno
    const horaEntradaNum = entrada.getHours();
    const horaSalidaNum = salida.getHours();

    if (horaEntradaNum < 6 && horaSalidaNum > 6) {
      validaciones.advertencias.push('Trabajo nocturno detectado - aplicar recargos correspondientes');
    }

    return validaciones;
  }

  // Obtener información del día
  obtenerInfoDia(fecha) {
    const fechaObj = new Date(fecha);
    const esDomingo = this.esDomingo(fechaObj);
    const esFestivo = this.esFestivo(fechaObj);

    return {
      fecha: fecha,
      esDomingo: esDomingo,
      esFestivo: esFestivo,
      tipoDia: this.obtenerTipoDia(fechaObj),
      nombreDia: fechaObj.toLocaleDateString('es-CO', { weekday: 'long' }),
      fechaFormateada: fechaObj.toLocaleDateString('es-CO', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    };
  }
}

// Exportar para uso global
window.ColombianLaborLaw = ColombianLaborLaw;
