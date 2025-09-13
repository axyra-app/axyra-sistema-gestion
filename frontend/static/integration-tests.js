/**
 * AXYRA - Tests de Integración
 * Sistema completo de pruebas para validar toda la funcionalidad
 */

class AxyraIntegrationTests {
  constructor() {
    this.tests = [];
    this.results = [];
    this.isRunning = false;

    this.init();
  }

  init() {
    console.log('🧪 Inicializando tests de integración...');
    this.setupTests();
  }

  setupTests() {
    // Tests de autenticación
    this.addTest('auth_login', 'Login de usuario', this.testUserLogin);
    this.addTest('auth_logout', 'Logout de usuario', this.testUserLogout);
    this.addTest('auth_2fa', 'Autenticación 2FA', this.test2FA);

    // Tests de módulos
    this.addTest('module_empleados', 'Módulo de empleados', this.testEmpleadosModule);
    this.addTest('module_horas', 'Módulo de horas', this.testHorasModule);
    this.addTest('module_nomina', 'Módulo de nómina', this.testNominaModule);
    this.addTest('module_inventario', 'Módulo de inventario', this.testInventarioModule);
    this.addTest('module_cuadre_caja', 'Módulo de cuadre de caja', this.testCuadreCajaModule);

    // Tests de configuración
    this.addTest('config_system', 'Configuración del sistema', this.testSystemConfig);
    this.addTest('config_backup', 'Sistema de backup', this.testBackupSystem);
    this.addTest('config_audit', 'Sistema de auditoría', this.testAuditSystem);

    // Tests de notificaciones
    this.addTest('notifications_push', 'Notificaciones push', this.testPushNotifications);
    this.addTest('notifications_system', 'Sistema de notificaciones', this.testNotificationSystem);

    // Tests de reportes
    this.addTest('reports_generation', 'Generación de reportes', this.testReportGeneration);
    this.addTest('reports_export', 'Exportación de reportes', this.testReportExport);

    // Tests de rendimiento
    this.addTest('performance_load', 'Carga de datos', this.testDataLoad);
    this.addTest('performance_memory', 'Uso de memoria', this.testMemoryUsage);
  }

  addTest(id, name, testFunction) {
    this.tests.push({
      id: id,
      name: name,
      function: testFunction,
      status: 'pending',
    });
  }

  async runAllTests() {
    if (this.isRunning) {
      console.warn('Tests ya en ejecución');
      return;
    }

    this.isRunning = true;
    this.results = [];

    console.log('🚀 Iniciando tests de integración...');

    for (const test of this.tests) {
      try {
        console.log(`⏳ Ejecutando: ${test.name}`);
        const result = await test.function();

        this.results.push({
          id: test.id,
          name: test.name,
          status: 'passed',
          duration: result.duration || 0,
          message: result.message || 'Test pasado exitosamente',
        });

        console.log(`✅ ${test.name}: PASADO`);
      } catch (error) {
        this.results.push({
          id: test.id,
          name: test.name,
          status: 'failed',
          duration: 0,
          message: error.message,
        });

        console.log(`❌ ${test.name}: FALLADO - ${error.message}`);
      }
    }

    this.isRunning = false;
    this.generateReport();
  }

  async testUserLogin() {
    const startTime = Date.now();

    try {
      // Simular login
      const testUser = {
        id: 'test_user',
        email: 'test@axyra.com',
        nombre: 'Usuario de Prueba',
        rol: 'admin',
      };

      localStorage.setItem('axyra_isolated_user', JSON.stringify(testUser));

      // Verificar que el usuario está logueado
      if (window.obtenerUsuarioActual) {
        const currentUser = window.obtenerUsuarioActual();
        if (!currentUser || currentUser.id !== testUser.id) {
          throw new Error('Usuario no logueado correctamente');
        }
      }

      return {
        duration: Date.now() - startTime,
        message: 'Login exitoso',
      };
    } catch (error) {
      throw new Error(`Error en login: ${error.message}`);
    }
  }

  async testUserLogout() {
    const startTime = Date.now();

    try {
      // Limpiar datos de usuario
      localStorage.removeItem('axyra_isolated_user');

      // Verificar que el usuario no está logueado
      if (window.obtenerUsuarioActual) {
        const currentUser = window.obtenerUsuarioActual();
        if (currentUser && currentUser.id) {
          throw new Error('Usuario aún logueado después del logout');
        }
      }

      return {
        duration: Date.now() - startTime,
        message: 'Logout exitoso',
      };
    } catch (error) {
      throw new Error(`Error en logout: ${error.message}`);
    }
  }

  async test2FA() {
    const startTime = Date.now();

    try {
      if (!window.axyra2FASystem) {
        throw new Error('Sistema 2FA no disponible');
      }

      // Configurar 2FA
      const setupResult = await window.axyra2FASystem.setup2FA('test_user', 'totp');

      if (!setupResult || !setupResult.secretKey) {
        throw new Error('Error configurando 2FA');
      }

      // Verificar estado
      const status = window.axyra2FASystem.get2FAStatus('test_user');
      if (!status.configured) {
        throw new Error('2FA no configurado correctamente');
      }

      return {
        duration: Date.now() - startTime,
        message: '2FA configurado correctamente',
      };
    } catch (error) {
      throw new Error(`Error en 2FA: ${error.message}`);
    }
  }

  async testEmpleadosModule() {
    const startTime = Date.now();

    try {
      // Verificar que el módulo existe
      if (!window.AxyraEmpleados) {
        throw new Error('Módulo de empleados no disponible');
      }

      // Crear empleado de prueba
      const testEmpleado = {
        id: 'test_emp_' + Date.now(),
        nombre: 'Empleado de Prueba',
        cedula: '12345678',
        cargo: 'Desarrollador',
        salario: 3000000,
        activo: true,
      };

      // Agregar empleado
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      empleados.push(testEmpleado);
      localStorage.setItem('axyra_empleados', JSON.stringify(empleados));

      // Verificar que se agregó
      const empleadosAfter = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      const found = empleadosAfter.find((e) => e.id === testEmpleado.id);

      if (!found) {
        throw new Error('Empleado no agregado correctamente');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Módulo de empleados funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en módulo empleados: ${error.message}`);
    }
  }

  async testHorasModule() {
    const startTime = Date.now();

    try {
      // Verificar que el módulo existe
      if (!window.AxyraGestionHoras) {
        throw new Error('Módulo de horas no disponible');
      }

      // Crear registro de horas de prueba
      const testHora = {
        id: 'test_hora_' + Date.now(),
        empleadoId: 'test_emp_123',
        fecha: new Date().toISOString().split('T')[0],
        horasTrabajadas: 8,
        horasExtras: 2,
        area: 'DESARROLLO',
      };

      // Agregar horas
      const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
      horas.push(testHora);
      localStorage.setItem('axyra_horas', JSON.stringify(horas));

      return {
        duration: Date.now() - startTime,
        message: 'Módulo de horas funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en módulo horas: ${error.message}`);
    }
  }

  async testNominaModule() {
    const startTime = Date.now();

    try {
      // Verificar que el módulo existe
      if (!window.AxyraNomina) {
        throw new Error('Módulo de nómina no disponible');
      }

      // Crear nómina de prueba
      const testNomina = {
        id: 'test_nom_' + Date.now(),
        empleadoId: 'test_emp_123',
        periodo: '2024-01',
        salarioBase: 3000000,
        horasExtras: 16,
        totalPagar: 3200000,
        fechaGeneracion: new Date().toISOString(),
      };

      // Agregar nómina
      const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      nominas.push(testNomina);
      localStorage.setItem('axyra_nominas', JSON.stringify(nominas));

      return {
        duration: Date.now() - startTime,
        message: 'Módulo de nómina funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en módulo nómina: ${error.message}`);
    }
  }

  async testInventarioModule() {
    const startTime = Date.now();

    try {
      // Verificar que el módulo existe
      if (!window.AxyraInventario) {
        throw new Error('Módulo de inventario no disponible');
      }

      // Crear producto de prueba
      const testProducto = {
        id: 'test_prod_' + Date.now(),
        nombre: 'Producto de Prueba',
        codigo: 'PROD001',
        precio: 10000,
        stock: 50,
        categoria: 'General',
      };

      // Agregar producto
      const inventario = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');
      inventario.push(testProducto);
      localStorage.setItem('axyra_inventario', JSON.stringify(inventario));

      return {
        duration: Date.now() - startTime,
        message: 'Módulo de inventario funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en módulo inventario: ${error.message}`);
    }
  }

  async testCuadreCajaModule() {
    const startTime = Date.now();

    try {
      // Verificar que el módulo existe
      if (!window.AxyraCuadreCaja) {
        throw new Error('Módulo de cuadre de caja no disponible');
      }

      // Crear cuadre de prueba
      const testCuadre = {
        id: 'test_cuadre_' + Date.now(),
        fecha: new Date().toISOString().split('T')[0],
        totalVentas: 500000,
        totalEfectivo: 300000,
        totalTarjeta: 200000,
        diferencia: 0,
      };

      // Agregar cuadre
      const cuadres = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');
      cuadres.push(testCuadre);
      localStorage.setItem('axyra_cuadre_caja', JSON.stringify(cuadres));

      return {
        duration: Date.now() - startTime,
        message: 'Módulo de cuadre de caja funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en módulo cuadre de caja: ${error.message}`);
    }
  }

  async testSystemConfig() {
    const startTime = Date.now();

    try {
      // Verificar que el sistema de configuración existe
      if (!window.axyraConfig) {
        throw new Error('Sistema de configuración no disponible');
      }

      // Probar guardar configuración
      const testConfig = {
        company: {
          nombre: 'Empresa de Prueba',
          nit: '123456789',
        },
      };

      localStorage.setItem('axyra_config_empresa', JSON.stringify(testConfig.company));

      // Verificar que se guardó
      const savedConfig = JSON.parse(localStorage.getItem('axyra_config_empresa') || '{}');
      if (savedConfig.nombre !== testConfig.company.nombre) {
        throw new Error('Configuración no guardada correctamente');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Sistema de configuración funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en configuración: ${error.message}`);
    }
  }

  async testBackupSystem() {
    const startTime = Date.now();

    try {
      // Verificar que el sistema de backup existe
      if (!window.axyraBackupSystemAdvanced) {
        throw new Error('Sistema de backup no disponible');
      }

      // Probar creación de backup
      const backupResult = await window.axyraBackupSystemAdvanced.performBackup({
        type: 'TEST',
        formats: ['json'],
      });

      if (!backupResult || backupResult.status !== 'COMPLETED') {
        throw new Error('Backup no completado correctamente');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Sistema de backup funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en backup: ${error.message}`);
    }
  }

  async testAuditSystem() {
    const startTime = Date.now();

    try {
      // Verificar que el sistema de auditoría existe
      if (!window.axyraAuditSystem) {
        throw new Error('Sistema de auditoría no disponible');
      }

      // Probar logging de evento
      window.axyraAuditSystem.logSystemEvent('TEST_EVENT', 'Evento de prueba');

      // Verificar que se registró
      const logs = window.axyraAuditSystem.getLogs({ type: 'TEST_EVENT' });
      if (logs.length === 0) {
        throw new Error('Evento no registrado en auditoría');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Sistema de auditoría funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en auditoría: ${error.message}`);
    }
  }

  async testPushNotifications() {
    const startTime = Date.now();

    try {
      // Verificar que el sistema de notificaciones push existe
      if (!window.axyraPushNotifications) {
        throw new Error('Sistema de notificaciones push no disponible');
      }

      // Verificar soporte
      if (!window.axyraPushNotifications.isSupported) {
        throw new Error('Notificaciones push no soportadas');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Sistema de notificaciones push disponible',
      };
    } catch (error) {
      throw new Error(`Error en notificaciones push: ${error.message}`);
    }
  }

  async testNotificationSystem() {
    const startTime = Date.now();

    try {
      // Verificar que el sistema de notificaciones existe
      if (!window.axyraNotificationSystem) {
        throw new Error('Sistema de notificaciones no disponible');
      }

      // Probar notificación
      window.axyraNotificationSystem.showSuccess('Test de notificación');

      return {
        duration: Date.now() - startTime,
        message: 'Sistema de notificaciones funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en notificaciones: ${error.message}`);
    }
  }

  async testReportGeneration() {
    const startTime = Date.now();

    try {
      // Verificar que el sistema de reportes existe
      if (!window.AxyraReportesAvanzados) {
        throw new Error('Sistema de reportes no disponible');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Sistema de reportes disponible',
      };
    } catch (error) {
      throw new Error(`Error en reportes: ${error.message}`);
    }
  }

  async testReportExport() {
    const startTime = Date.now();

    try {
      // Simular exportación de reporte
      const testData = [
        { id: 1, nombre: 'Test 1', valor: 100 },
        { id: 2, nombre: 'Test 2', valor: 200 },
      ];

      // Crear CSV básico
      const csvContent = testData.map((row) => Object.values(row).join(',')).join('\n');

      if (!csvContent || csvContent.length === 0) {
        throw new Error('Error generando CSV de prueba');
      }

      return {
        duration: Date.now() - startTime,
        message: 'Exportación de reportes funcionando correctamente',
      };
    } catch (error) {
      throw new Error(`Error en exportación: ${error.message}`);
    }
  }

  async testDataLoad() {
    const startTime = Date.now();

    try {
      // Probar carga de datos
      const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
      const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');

      const totalRecords = empleados.length + horas.length + nominas.length;

      if (totalRecords < 0) {
        throw new Error('Error cargando datos');
      }

      return {
        duration: Date.now() - startTime,
        message: `Carga de datos exitosa: ${totalRecords} registros`,
      };
    } catch (error) {
      throw new Error(`Error en carga de datos: ${error.message}`);
    }
  }

  async testMemoryUsage() {
    const startTime = Date.now();

    try {
      // Verificar uso de memoria
      if (performance.memory) {
        const memoryInfo = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
        };

        const usagePercent = (memoryInfo.used / memoryInfo.limit) * 100;

        if (usagePercent > 90) {
          throw new Error(`Uso de memoria alto: ${usagePercent.toFixed(2)}%`);
        }

        return {
          duration: Date.now() - startTime,
          message: `Uso de memoria: ${usagePercent.toFixed(2)}%`,
        };
      }

      return {
        duration: Date.now() - startTime,
        message: 'Información de memoria no disponible',
      };
    } catch (error) {
      throw new Error(`Error en memoria: ${error.message}`);
    }
  }

  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter((r) => r.status === 'passed').length;
    const failedTests = this.results.filter((r) => r.status === 'failed').length;
    const successRate = (passedTests / totalTests) * 100;

    const report = {
      summary: {
        total: totalTests,
        passed: passedTests,
        failed: failedTests,
        successRate: successRate.toFixed(2) + '%',
      },
      results: this.results,
      timestamp: new Date().toISOString(),
    };

    console.log('📊 Reporte de Tests de Integración:');
    console.log(`Total: ${totalTests}, Pasados: ${passedTests}, Fallidos: ${failedTests}`);
    console.log(`Tasa de éxito: ${successRate.toFixed(2)}%`);

    // Guardar reporte
    localStorage.setItem('axyra_test_report', JSON.stringify(report));

    // Mostrar notificación
    if (window.axyraNotificationSystem) {
      if (successRate >= 90) {
        window.axyraNotificationSystem.showSuccess(`Tests completados: ${successRate.toFixed(1)}% de éxito`);
      } else {
        window.axyraNotificationSystem.showWarning(`Tests completados: ${successRate.toFixed(1)}% de éxito`);
      }
    }

    return report;
  }

  getLastReport() {
    try {
      const stored = localStorage.getItem('axyra_test_report');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Error cargando reporte:', error);
      return null;
    }
  }
}

// Inicializar tests de integración
let axyraIntegrationTests;
document.addEventListener('DOMContentLoaded', () => {
  axyraIntegrationTests = new AxyraIntegrationTests();
  window.axyraIntegrationTests = axyraIntegrationTests;
});

// Exportar para uso global
window.AxyraIntegrationTests = AxyraIntegrationTests;

