// Utilidades para el módulo de Gestión de Nómina

// Calcular salario neto
export function calcularSalarioNeto(salarioBase, config) {
  const descuentoSalud = (salarioBase * config.descuentos.salud) / 100;
  const descuentoPension = (salarioBase * config.descuentos.pension) / 100;
  const retencionFuente = (salarioBase * config.descuentos.retencionFuente) / 100;

  return salarioBase - descuentoSalud - descuentoPension - retencionFuente;
}

// Calcular bonificaciones
export function calcularBonificaciones(horasNocturnas, horasDominicales, config) {
  const bonificacionNocturna = (horasNocturnas * config.bonificaciones.nocturno) / 100;
  const bonificacionDominical = (horasDominicales * config.bonificaciones.dominical) / 100;

  return {
    nocturna: bonificacionNocturna,
    dominical: bonificacionDominical,
    total: bonificacionNocturna + bonificacionDominical,
  };
}

// Calcular salario total
export function calcularSalarioTotal(salarioBase, horasExtras, bonificaciones, config) {
  const salarioNeto = calcularSalarioNeto(salarioBase, config);
  const valorHoraExtra = (salarioBase / 240) * 1.25; // 25% de recargo
  const totalHorasExtras = horasExtras * valorHoraExtra;

  return salarioNeto + totalHorasExtras + bonificaciones.total + config.bonificaciones.transporte;
}

// Formatear moneda
export function formatearMoneda(valor, config) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: config.salarios.moneda,
    minimumFractionDigits: config.salarios.decimales,
  }).format(valor);
}

// Calcular días trabajados en el período
export function calcularDiasTrabajados(fechaInicio, fechaFin) {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin - inicio;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1;
}

// Validar período de nómina
export function validarPeriodoNomina(fechaInicio, fechaFin, periodo, config) {
  const diasTrabajados = calcularDiasTrabajados(fechaInicio, fechaFin);
  const periodoConfig = config.periodos.find((p) => p.id === periodo);

  if (!periodoConfig) {
    return { valido: false, error: 'Período no válido' };
  }

  if (diasTrabajados !== periodoConfig.dias) {
    return {
      valido: false,
      error: `El período ${periodoConfig.nombre} debe tener ${periodoConfig.dias} días`,
    };
  }

  return { valido: true };
}

// Generar número de nómina
export function generarNumeroNomina(fecha, consecutivo) {
  const fechaFormateada = fecha.replace(/-/g, '');
  return `NOM-${fechaFormateada}-${consecutivo.toString().padStart(3, '0')}`;
}

// Calcular fecha de pago
export function calcularFechaPago(fechaFin, diasPago = 5) {
  const fecha = new Date(fechaFin);
  fecha.setDate(fecha.getDate() + diasPago);
  return fecha.toISOString().split('T')[0];
}
