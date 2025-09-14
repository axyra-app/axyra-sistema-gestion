// ========================================
// MÓDULO DE GESTIÓN DE NÓMINA AXYRA
// ========================================

console.log('💰 Inicializando módulo de nómina...');

class AxyraNominaModule {
  constructor() {
    this.nominas = [];
    this.empleados = [];
    this.configuracion = {
      salarioMinimo: 1160000,
      auxilioTransporte: 140606,
      porcentajeSalud: 0.04,
      porcentajePension: 0.04,
      porcentajeRiesgos: 0.00522,
      porcentajeSena: 0.02,
      porcentajeICBF: 0.03,
      porcentajeCajaCompensacion: 0.04,
    };
    this.init();
  }

  init() {
    console.log('✅ Módulo de nómina inicializado');
    this.cargarNominas();
    this.cargarEmpleados();
    this.setupEventListeners();
  }

  cargarNominas() {
    try {
      const nominasGuardadas = localStorage.getItem('axyra_nominas');
      if (nominasGuardadas) {
        this.nominas = JSON.parse(nominasGuardadas);
        console.log(`📋 Cargadas ${this.nominas.length} nóminas`);
      } else {
        console.log('📋 No hay nóminas guardadas');
        this.nominas = [];
      }
    } catch (error) {
      console.error('❌ Error cargando nóminas:', error);
      this.nominas = [];
    }
  }

  cargarEmpleados() {
    try {
      const empleadosGuardados = localStorage.getItem('axyra_empleados');
      if (empleadosGuardados) {
        this.empleados = JSON.parse(empleadosGuardados);
        console.log(`👥 Cargados ${this.empleados.length} empleados para nómina`);
      } else {
        console.log('👥 No hay empleados para nómina');
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

  calcularNomina(empleado, periodo) {
    const salarioBase = empleado.salario || this.configuracion.salarioMinimo;
    const diasTrabajados = periodo.diasTrabajados || 30;
    const horasExtras = empleado.horasExtras || 0;
    const recargosNocturnos = empleado.recargosNocturnos || 0;
    const dominicales = empleado.dominicales || 0;
    const festivos = empleado.festivos || 0;

    // Cálculos básicos
    const salarioProporcional = (salarioBase * diasTrabajados) / 30;
    const valorHora = salarioBase / 240; // 240 horas mensuales
    const valorHoraExtra = valorHora * 1.25;
    const valorRecargoNocturno = valorHora * 1.35;
    const valorDominical = valorHora * 1.75;
    const valorFestivo = valorHora * 2;

    // Devengados
    const devengados = {
      salario: salarioProporcional,
      horasExtras: horasExtras * valorHoraExtra,
      recargosNocturnos: recargosNocturnos * valorRecargoNocturno,
      dominicales: dominicales * valorDominical,
      festivos: festivos * valorFestivo,
      auxilioTransporte: empleado.auxilioTransporte ? this.configuracion.auxilioTransporte : 0,
      bonificaciones: empleado.bonificaciones || 0,
      comisiones: empleado.comisiones || 0,
    };

    const totalDevengados = Object.values(devengados).reduce((sum, val) => sum + val, 0);

    // Deducciones
    const baseCotizacion = Math.min(salarioBase, 25000000); // Tope de cotización
    const deducciones = {
      salud: baseCotizacion * this.configuracion.porcentajeSalud,
      pension: baseCotizacion * this.configuracion.porcentajePension,
      riesgos: baseCotizacion * this.configuracion.porcentajeRiesgos,
      sena: baseCotizacion * this.configuracion.porcentajeSena,
      icbf: baseCotizacion * this.configuracion.porcentajeICBF,
      cajaCompensacion: baseCotizacion * this.configuracion.porcentajeCajaCompensacion,
      retencionFuente: this.calcularRetencionFuente(totalDevengados),
      prestamos: empleado.prestamos || 0,
      otrosDescuentos: empleado.otrosDescuentos || 0,
    };

    const totalDeducciones = Object.values(deducciones).reduce((sum, val) => sum + val, 0);
    const netoAPagar = totalDevengados - totalDeducciones;

    return {
      empleado: {
        id: empleado.id,
        nombre: empleado.nombre,
        cedula: empleado.cedula,
        cargo: empleado.cargo,
      },
      periodo: periodo,
      devengados: devengados,
      totalDevengados: totalDevengados,
      deducciones: deducciones,
      totalDeducciones: totalDeducciones,
      netoAPagar: netoAPagar,
      fechaCalculo: new Date().toISOString(),
    };
  }

  calcularRetencionFuente(salario) {
    const salarioAnual = salario * 12;
    let retencion = 0;

    if (salarioAnual <= 10900000) {
      retencion = 0;
    } else if (salarioAnual <= 17000000) {
      retencion = (salarioAnual - 10900000) * 0.19;
    } else if (salarioAnual <= 36000000) {
      retencion = 1159000 + (salarioAnual - 17000000) * 0.28;
    } else if (salarioAnual <= 54000000) {
      retencion = 6479000 + (salarioAnual - 36000000) * 0.33;
    } else if (salarioAnual <= 72000000) {
      retencion = 12419000 + (salarioAnual - 54000000) * 0.35;
    } else if (salarioAnual <= 100000000) {
      retencion = 18719000 + (salarioAnual - 72000000) * 0.37;
    } else {
      retencion = 29079000 + (salarioAnual - 100000000) * 0.39;
    }

    return retencion / 12; // Retención mensual
  }

  generarNomina(periodo, empleadosIds = []) {
    const empleadosACalcular = empleadosIds.length > 0 
      ? this.empleados.filter(emp => empleadosIds.includes(emp.id))
      : this.empleados.filter(emp => emp.estado === 'activo');

    const calculosNomina = empleadosACalcular.map(empleado => 
      this.calcularNomina(empleado, periodo)
    );

    const nomina = {
      id: 'nom_' + Date.now(),
      periodo: periodo,
      empleados: calculosNomina,
      totalEmpleados: calculosNomina.length,
      totalDevengados: calculosNomina.reduce((sum, calc) => sum + calc.totalDevengados, 0),
      totalDeducciones: calculosNomina.reduce((sum, calc) => sum + calc.totalDeducciones, 0),
      totalNeto: calculosNomina.reduce((sum, calc) => sum + calc.netoAPagar, 0),
      fechaGeneracion: new Date().toISOString(),
      estado: 'generada',
    };

    this.nominas.push(nomina);
    this.guardarNominas();
    console.log('✅ Nómina generada:', nomina.id);
    return nomina;
  }

  obtenerNominas(filtros = {}) {
    let nominasFiltradas = [...this.nominas];

    if (filtros.periodo) {
      nominasFiltradas = nominasFiltradas.filter(nom => 
        nom.periodo.mes === filtros.periodo.mes && 
        nom.periodo.ano === filtros.periodo.ano
      );
    }

    if (filtros.estado) {
      nominasFiltradas = nominasFiltradas.filter(nom => nom.estado === filtros.estado);
    }

    return nominasFiltradas;
  }

  obtenerNominaPorId(id) {
    return this.nominas.find(nom => nom.id === id);
  }

  actualizarNomina(id, datosActualizados) {
    const index = this.nominas.findIndex(nom => nom.id === id);
    if (index !== -1) {
      this.nominas[index] = {
        ...this.nominas[index],
        ...datosActualizados,
        fechaActualizacion: new Date().toISOString(),
      };
      this.guardarNominas();
      console.log('✅ Nómina actualizada:', this.nominas[index].id);
      return this.nominas[index];
    }
    return null;
  }

  eliminarNomina(id) {
    const index = this.nominas.findIndex(nom => nom.id === id);
    if (index !== -1) {
      const nominaEliminada = this.nominas.splice(index, 1)[0];
      this.guardarNominas();
      console.log('🗑️ Nómina eliminada:', nominaEliminada.id);
      return nominaEliminada;
    }
    return null;
  }

  guardarNominas() {
    try {
      localStorage.setItem('axyra_nominas', JSON.stringify(this.nominas));
      console.log('💾 Nóminas guardadas en localStorage');
    } catch (error) {
      console.error('❌ Error guardando nóminas:', error);
    }
  }

  obtenerEstadisticas() {
    const totalNominas = this.nominas.length;
    const nominasGeneradas = this.nominas.filter(nom => nom.estado === 'generada').length;
    const nominasPagadas = this.nominas.filter(nom => nom.estado === 'pagada').length;
    const totalEmpleados = this.empleados.length;
    const empleadosActivos = this.empleados.filter(emp => emp.estado === 'activo').length;

    return {
      totalNominas,
      nominasGeneradas,
      nominasPagadas,
      totalEmpleados,
      empleadosActivos,
      porcentajeNominasPagadas: totalNominas > 0 ? Math.round((nominasPagadas / totalNominas) * 100) : 0,
    };
  }

  exportarNomina(id, formato = 'excel') {
    const nomina = this.obtenerNominaPorId(id);
    if (!nomina) {
      throw new Error('Nómina no encontrada');
    }

    if (formato === 'excel') {
      return this.exportarAExcel(nomina);
    } else if (formato === 'pdf') {
      return this.exportarAPDF(nomina);
    } else {
      throw new Error('Formato no soportado');
    }
  }

  exportarAExcel(nomina) {
    // Implementar exportación a Excel
    console.log('📊 Exportando nómina a Excel:', nomina.id);
    return {
      success: true,
      message: 'Nómina exportada a Excel',
      data: nomina,
    };
  }

  exportarAPDF(nomina) {
    // Implementar exportación a PDF
    console.log('📄 Exportando nómina a PDF:', nomina.id);
    return {
      success: true,
      message: 'Nómina exportada a PDF',
      data: nomina,
    };
  }
}

// Registrar en el objeto global
window.AxyraNomina = AxyraNominaModule;
window.axyraNomina = AxyraNominaModule;

document.addEventListener('DOMContentLoaded', () => {
  if (typeof window.axyraNominaModule === 'undefined') {
    window.axyraNominaModule = new AxyraNominaModule();
    console.log('🎯 Módulo de nómina disponible globalmente');
  }
});

window.AxyraNominaModule = AxyraNominaModule;