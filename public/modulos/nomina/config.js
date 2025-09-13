// Configuración del módulo de Gestión de Nómina
const CONFIG_NOMINA = {
  // Períodos de nómina
  periodos: [
    { id: 'quincenal', nombre: 'Quincenal', dias: 15 },
    { id: 'mensual', nombre: 'Mensual', dias: 30 },
    { id: 'semanal', nombre: 'Semanal', dias: 7 },
  ],

  // Configuración de salarios
  salarios: {
    salarioMinimo: 1300000, // Salario mínimo legal vigente
    moneda: 'COP',
    decimales: 2,
  },

  // Descuentos y bonificaciones
  descuentos: {
    salud: 4, // Porcentaje de descuento por salud
    pension: 4, // Porcentaje de descuento por pensión
    retencionFuente: 0, // Porcentaje de retención en la fuente
  },

  // Bonificaciones
  bonificaciones: {
    transporte: 140606, // Subsidio de transporte
    alimentacion: 0, // Subsidio de alimentación
    nocturno: 35, // Porcentaje de bonificación por trabajo nocturno
    dominical: 80, // Porcentaje de bonificación por trabajo dominical
  },

  // Configuración de exportación
  exportacion: {
    formatoExcel: true,
    formatoPDF: true,
    incluirComprobantes: true,
    incluirResumen: true,
  },
};

export default CONFIG_NOMINA;
