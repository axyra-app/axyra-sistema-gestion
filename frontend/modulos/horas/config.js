// Configuración del módulo de Gestión de Horas
const CONFIG_HORAS = {
  // Tipos de horas disponibles
  tiposHoras: [
    { id: 'normal', nombre: 'Horas Normales', recargo: 0 },
    { id: 'extra', nombre: 'Horas Extras', recargo: 25 },
    { id: 'nocturna', nombre: 'Horas Nocturnas', recargo: 35 },
    { id: 'dominical', nombre: 'Horas Dominicales', recargo: 80 },
  ],

  // Configuración de horarios
  horarios: {
    entradaEstandar: '08:00',
    salidaEstandar: '17:00',
    horaInicioNocturno: '18:00',
    horaFinNocturno: '06:00',
  },

  // Límites de horas
  limites: {
    maxHorasNormales: 8,
    maxHorasExtras: 4,
    maxHorasDiarias: 12,
  },

  // Configuración de exportación
  exportacion: {
    formatoExcel: true,
    formatoPDF: true,
    incluirCalculos: true,
  },
};

export default CONFIG_HORAS;
