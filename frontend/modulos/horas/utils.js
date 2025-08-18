// Utilidades para el módulo de Gestión de Horas

// Calcular horas trabajadas entre dos horarios
export function calcularHorasTrabajadas(horaEntrada, horaSalida) {
  const entrada = new Date(`2000-01-01T${horaEntrada}`);
  let salida = new Date(`2000-01-01T${horaSalida}`);

  // Si la salida es menor que la entrada, asumir día siguiente
  if (salida <= entrada) {
    salida.setDate(salida.getDate() + 1);
  }

  const diferencia = salida - entrada;
  return diferencia / (1000 * 60 * 60); // Convertir a horas
}

// Calcular recargo por tipo de hora
export function calcularRecargo(horas, tipo, config) {
  const tipoHora = config.tiposHoras.find((t) => t.id === tipo);
  if (!tipoHora) return 0;

  return (horas * tipoHora.recargo) / 100;
}

// Validar límites de horas
export function validarLimitesHoras(horasNormales, horasExtras, config) {
  const errores = [];

  if (horasNormales > config.limites.maxHorasNormales) {
    errores.push(`Las horas normales no pueden exceder ${config.limites.maxHorasNormales} horas`);
  }

  if (horasExtras > config.limites.maxHorasExtras) {
    errores.push(`Las horas extras no pueden exceder ${config.limites.maxHorasExtras} horas`);
  }

  const total = horasNormales + horasExtras;
  if (total > config.limites.maxHorasDiarias) {
    errores.push(`El total de horas diarias no puede exceder ${config.limites.maxHorasDiarias} horas`);
  }

  return errores;
}

// Formatear hora para mostrar
export function formatearHora(hora) {
  return hora.substring(0, 5); // Formato HH:MM
}

// Obtener nombre del día de la semana
export function obtenerNombreDia(fecha) {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dia = new Date(fecha).getDay();
  return dias[dia];
}

// Verificar si es día dominical
export function esDomingo(fecha) {
  return new Date(fecha).getDay() === 0;
}

// Verificar si es hora nocturna
export function esHoraNocturna(hora, config) {
  const horaNum = parseInt(hora.split(':')[0]);
  return (
    horaNum >= parseInt(config.horarios.horaInicioNocturno.split(':')[0]) ||
    horaNum < parseInt(config.horarios.horaFinNocturno.split(':')[0])
  );
}
