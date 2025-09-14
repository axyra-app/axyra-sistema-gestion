// ========================================
// MÓDULO DE GESTIÓN DE EMPLEADOS AXYRA
// ========================================

console.log('👥 Inicializando módulo de empleados...');

class AxyraEmpleadosModule {
  constructor() {
    this.empleados = [];
    this.filtros = {
      estado: 'todos',
      departamento: 'todos',
      busqueda: '',
    };
    this.init();
  }

  init() {
    console.log('✅ Módulo de empleados inicializado');
    this.cargarEmpleados();
    this.setupEventListeners();
  }

  cargarEmpleados() {
    try {
      const empleadosGuardados = localStorage.getItem('axyra_empleados');
      if (empleadosGuardados) {
        this.empleados = JSON.parse(empleadosGuardados);
        console.log(`📋 Cargados ${this.empleados.length} empleados`);
      } else {
        console.log('📋 No hay empleados guardados');
        this.empleados = [];
      }
    } catch (error) {
      console.error('❌ Error cargando empleados:', error);
      this.empleados = [];
    }
  }

  setupEventListeners() {
    console.log('🔗 Event listeners configurados');
  }

  obtenerEmpleadosFiltrados() {
    return this.empleados.filter((empleado) => {
      const cumpleEstado = this.filtros.estado === 'todos' || empleado.estado === this.filtros.estado;
      const cumpleDepartamento = this.filtros.departamento === 'todos' || empleado.departamento === this.filtros.departamento;
      const cumpleBusqueda = this.filtros.busqueda === '' || 
        empleado.nombre.toLowerCase().includes(this.filtros.busqueda.toLowerCase()) ||
        empleado.cedula.includes(this.filtros.busqueda);
      
      return cumpleEstado && cumpleDepartamento && cumpleBusqueda;
    });
  }

  agregarEmpleado(empleadoData) {
    const nuevoEmpleado = {
      id: 'emp_' + Date.now(),
      ...empleadoData,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };
    
    this.empleados.push(nuevoEmpleado);
    this.guardarEmpleados();
    console.log('✅ Empleado agregado:', nuevoEmpleado.nombre);
    return nuevoEmpleado;
  }

  actualizarEmpleado(id, datosActualizados) {
    const index = this.empleados.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      this.empleados[index] = {
        ...this.empleados[index],
        ...datosActualizados,
        fechaActualizacion: new Date().toISOString(),
      };
      this.guardarEmpleados();
      console.log('✅ Empleado actualizado:', this.empleados[index].nombre);
      return this.empleados[index];
    }
    return null;
  }

  eliminarEmpleado(id) {
    const index = this.empleados.findIndex((emp) => emp.id === id);
    if (index !== -1) {
      const empleadoEliminado = this.empleados.splice(index, 1)[0];
      this.guardarEmpleados();
      console.log('🗑️ Empleado eliminado:', empleadoEliminado.nombre);
      return empleadoEliminado;
    }
    return null;
  }

  guardarEmpleados() {
    try {
      localStorage.setItem('axyra_empleados', JSON.stringify(this.empleados));
      console.log('💾 Empleados guardados en localStorage');
    } catch (error) {
      console.error('❌ Error guardando empleados:', error);
    }
  }

  obtenerEstadisticas() {
    const total = this.empleados.length;
    const activos = this.empleados.filter((emp) => emp.estado === 'activo').length;
    const inactivos = this.empleados.filter((emp) => emp.estado === 'inactivo').length;
    const vacaciones = this.empleados.filter((emp) => emp.estado === 'vacaciones').length;
    
    return {
      total,
      activos,
      inactivos,
      vacaciones,
      porcentajeActivos: total > 0 ? Math.round((activos / total) * 100) : 0,
    };
  }
}

// Registrar en el objeto global
window.AxyraEmpleados = AxyraEmpleadosModule;
window.axyraEmpleados = AxyraEmpleadosModule;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.axyraEmpleadosModule === 'undefined') {
    window.axyraEmpleadosModule = new AxyraEmpleadosModule();
    console.log('🎯 Módulo de empleados disponible globalmente');
  }
});

window.AxyraEmpleadosModule = AxyraEmpleadosModule;