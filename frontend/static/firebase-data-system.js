/**
 * AXYRA Firebase Data System
 * Sistema de gestión de datos empresariales en Firestore
 * Versión: 1.0
 */

class AXYRAFirebaseDataSystem {
  constructor() {
    this.db = null;
    this.currentUser = null;
    this.isInitialized = false;

    this.init();
  }

  init() {
    try {
      if (window.axyraFirebase) {
        this.db = axyraFirebase.db;
        this.isInitialized = true;
        console.log('✅ AXYRA Firebase Data System inicializado');
      } else {
        console.error('❌ Firebase no está disponible');
      }
    } catch (error) {
      console.error('❌ Error inicializando Firebase Data System:', error);
    }
  }

  // Establecer usuario actual
  setCurrentUser(user) {
    this.currentUser = user;
  }

  // ===== GESTIÓN DE EMPLEADOS =====

  // Crear empleado
  async createEmployee(employeeData) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const employee = {
        ...employeeData,
        userId: this.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await this.db.collection('empleados').add(employee);
      console.log('✅ Empleado creado con ID:', docRef.id);

      return { success: true, id: docRef.id, employee: employee };
    } catch (error) {
      console.error('❌ Error creando empleado:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener empleados del usuario actual
  async getEmployees() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const snapshot = await this.db
        .collection('empleados')
        .where('userId', '==', this.currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const employees = [];
      snapshot.forEach((doc) => {
        employees.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ ${employees.length} empleados cargados`);
      return { success: true, employees: employees };
    } catch (error) {
      console.error('❌ Error cargando empleados:', error);
      return { success: false, error: error.message };
    }
  }

  // Actualizar empleado
  async updateEmployee(employeeId, updates) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const updateData = {
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      await this.db.collection('empleados').doc(employeeId).update(updateData);
      console.log('✅ Empleado actualizado:', employeeId);

      return { success: true };
    } catch (error) {
      console.error('❌ Error actualizando empleado:', error);
      return { success: false, error: error.message };
    }
  }

  // Eliminar empleado
  async deleteEmployee(employeeId) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      await this.db.collection('empleados').doc(employeeId).delete();
      console.log('✅ Empleado eliminado:', employeeId);

      return { success: true };
    } catch (error) {
      console.error('❌ Error eliminando empleado:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== GESTIÓN DE HORAS =====

  // Registrar horas
  async registerHours(hoursData) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const hours = {
        ...hoursData,
        userId: this.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await this.db.collection('horas').add(hours);
      console.log('✅ Horas registradas con ID:', docRef.id);

      return { success: true, id: docRef.id, hours: hours };
    } catch (error) {
      console.error('❌ Error registrando horas:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener horas del usuario actual
  async getHours(filters = {}) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      let query = this.db.collection('horas').where('userId', '==', this.currentUser.uid);

      // Aplicar filtros
      if (filters.employeeId) {
        query = query.where('employeeId', '==', filters.employeeId);
      }
      if (filters.date) {
        query = query.where('date', '==', filters.date);
      }
      if (filters.month) {
        query = query.where('month', '==', filters.month);
      }

      const snapshot = await query.orderBy('date', 'desc').get();

      const hours = [];
      snapshot.forEach((doc) => {
        hours.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ ${hours.length} registros de horas cargados`);
      return { success: true, hours: hours };
    } catch (error) {
      console.error('❌ Error cargando horas:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== GESTIÓN DE NÓMINA =====

  // Generar nómina
  async generatePayroll(payrollData) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const payroll = {
        ...payrollData,
        userId: this.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await this.db.collection('nominas').add(payroll);
      console.log('✅ Nómina generada con ID:', docRef.id);

      return { success: true, id: docRef.id, payroll: payroll };
    } catch (error) {
      console.error('❌ Error generando nómina:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener nóminas del usuario actual
  async getPayrolls() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const snapshot = await this.db
        .collection('nominas')
        .where('userId', '==', this.currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const payrolls = [];
      snapshot.forEach((doc) => {
        payrolls.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ ${payrolls.length} nóminas cargadas`);
      return { success: true, payrolls: payrolls };
    } catch (error) {
      console.error('❌ Error cargando nóminas:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== GESTIÓN DE COMPROBANTES =====

  // Generar comprobante
  async generateReceipt(receiptData) {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const receipt = {
        ...receiptData,
        userId: this.currentUser.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const docRef = await this.db.collection('comprobantes').add(receipt);
      console.log('✅ Comprobante generado con ID:', docRef.id);

      return { success: true, id: docRef.id, receipt: receipt };
    } catch (error) {
      console.error('❌ Error generando comprobante:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener comprobantes del usuario actual
  async getReceipts() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      const snapshot = await this.db
        .collection('comprobantes')
        .where('userId', '==', this.currentUser.uid)
        .orderBy('createdAt', 'desc')
        .get();

      const receipts = [];
      snapshot.forEach((doc) => {
        receipts.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      console.log(`✅ ${receipts.length} comprobantes cargados`);
      return { success: true, receipts: receipts };
    } catch (error) {
      console.error('❌ Error cargando comprobantes:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== ESTADÍSTICAS Y REPORTES =====

  // Obtener estadísticas del usuario
  async getUserStats() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      // Contar empleados
      const employeesSnapshot = await this.db.collection('empleados').where('userId', '==', this.currentUser.uid).get();

      // Contar horas del mes actual
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
      const hoursSnapshot = await this.db
        .collection('horas')
        .where('userId', '==', this.currentUser.uid)
        .where('month', '==', currentMonth)
        .get();

      // Contar nóminas
      const payrollsSnapshot = await this.db.collection('nominas').where('userId', '==', this.currentUser.uid).get();

      const stats = {
        totalEmployees: employeesSnapshot.size,
        totalHoursThisMonth: hoursSnapshot.size,
        totalPayrolls: payrollsSnapshot.size,
        currentMonth: currentMonth,
      };

      console.log('✅ Estadísticas cargadas:', stats);
      return { success: true, stats: stats };
    } catch (error) {
      console.error('❌ Error cargando estadísticas:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== MIGRACIÓN DE DATOS =====

  // Migrar datos de localStorage a Firebase
  async migrateFromLocalStorage() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      console.log('🔄 Iniciando migración de datos...');

      // Migrar empleados
      const employees = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      for (const employee of employees) {
        if (employee.userId === this.currentUser.uid || !employee.userId) {
          await this.createEmployee({
            ...employee,
            userId: this.currentUser.uid,
          });
        }
      }

      // Migrar horas
      const hours = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
      for (const hour of hours) {
        if (hour.userId === this.currentUser.uid || !hour.userId) {
          await this.registerHours({
            ...hour,
            userId: this.currentUser.uid,
          });
        }
      }

      // Migrar nóminas
      const payrolls = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      for (const payroll of payrolls) {
        if (payroll.userId === this.currentUser.uid || !payroll.userId) {
          await this.generatePayroll({
            ...payroll,
            userId: this.currentUser.uid,
          });
        }
      }

      console.log('✅ Migración completada exitosamente');
      return { success: true, message: 'Migración completada' };
    } catch (error) {
      console.error('❌ Error en migración:', error);
      return { success: false, error: error.message };
    }
  }

  // ===== UTILIDADES =====

  // Obtener estado del sistema
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasDb: !!this.db,
      hasCurrentUser: !!this.currentUser,
      userEmail: this.currentUser ? this.currentUser.email : null,
    };
  }

  // Limpiar datos del usuario
  async clearUserData() {
    try {
      if (!this.isInitialized || !this.currentUser) {
        throw new Error('Sistema no inicializado o usuario no autenticado');
      }

      // Eliminar empleados
      const employeesSnapshot = await this.db.collection('empleados').where('userId', '==', this.currentUser.uid).get();

      const deletePromises = employeesSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deletePromises);

      // Eliminar horas
      const hoursSnapshot = await this.db.collection('horas').where('userId', '==', this.currentUser.uid).get();

      const deleteHoursPromises = hoursSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deleteHoursPromises);

      // Eliminar nóminas
      const payrollsSnapshot = await this.db.collection('nominas').where('userId', '==', this.currentUser.uid).get();

      const deletePayrollsPromises = payrollsSnapshot.docs.map((doc) => doc.ref.delete());
      await Promise.all(deletePayrollsPromises);

      console.log('✅ Datos del usuario limpiados');
      return { success: true };
    } catch (error) {
      console.error('❌ Error limpiando datos:', error);
      return { success: false, error: error.message };
    }
  }
}

// Instancia global
const axyraFirebaseDataSystem = new AXYRAFirebaseDataSystem();

// Exportar para uso en otros módulos
window.AXYRAFirebaseDataSystem = AXYRAFirebaseDataSystem;
window.axyraFirebaseDataSystem = axyraFirebaseDataSystem;
