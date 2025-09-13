// Configuración del módulo de Gestión de Empleados
const CONFIG_EMPLEADOS = {
  // Estados del empleado
  estados: [
    { id: 'activo', nombre: 'Activo', color: 'success' },
    { id: 'inactivo', nombre: 'Inactivo', color: 'error' },
    { id: 'vacaciones', nombre: 'Vacaciones', color: 'warning' },
    { id: 'licencia', nombre: 'Licencia', color: 'info' },
  ],

  // Tipos de contrato
  tiposContrato: [
    { id: 'indefinido', nombre: 'Indefinido' },
    { id: 'fijo', nombre: 'Término Fijo' },
    { id: 'obra', nombre: 'Por Obra o Labor' },
    { id: 'aprendizaje', nombre: 'Contrato de Aprendizaje' },
  ],

  // Departamentos
  departamentos: [
    'Administrativo',
    'Ventas',
    'Marketing',
    'Recursos Humanos',
    'Tecnología',
    'Operaciones',
    'Finanzas',
    'Legal',
  ],

  // Cargos comunes
  cargos: ['Gerente', 'Director', 'Coordinador', 'Analista', 'Asistente', 'Operario', 'Técnico', 'Practicante'],

  // Configuración de exportación
  exportacion: {
    formatoExcel: true,
    formatoPDF: true,
    incluirFoto: false,
    incluirHistorial: true,
  },
};

export default CONFIG_EMPLEADOS;
