// ========================================
// SISTEMA DE SINCRONIZACIÓN FIREBASE ↔ LOCALSTORAGE
// ========================================

class FirebaseSyncManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.pendingSync = [];
    this.syncInterval = null;
    this.init();
  }

  async init() {
    try {
      // Configurar listeners de conectividad
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());

      // Iniciar sincronización automática
      this.startAutoSync();

      console.log('✅ FirebaseSyncManager inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando FirebaseSyncManager:', error);
    }
  }

  // ========================================
  // MANEJO DE CONECTIVIDAD
  // ========================================

  handleOnline() {
    this.isOnline = true;
    console.log('🌐 Conexión restaurada, iniciando sincronización...');
    this.syncPendingData();
  }

  handleOffline() {
    this.isOnline = false;
    console.log('📡 Conexión perdida, guardando en localStorage...');
  }

  // ========================================
  // SINCRONIZACIÓN DE EMPLEADOS
  // ========================================

  async syncEmpleados() {
    try {
      if (!this.isOnline || !firebase?.firestore) {
        console.log('📡 Sin conexión o Firebase no disponible, usando localStorage');
        return this.loadEmpleadosFromStorage();
      }

      const db = firebase.firestore();
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        console.log('🔐 Usuario no autenticado, usando localStorage');
        return this.loadEmpleadosFromStorage();
      }

      // Cargar desde Firebase
      const empleadosSnapshot = await db.collection('empleados').where('userId', '==', currentUser.uid).get();

      const empleadosFirebase = empleadosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Cargar desde localStorage
      const empleadosStorage = this.loadEmpleadosFromStorage();

      // Fusionar datos (Firebase tiene prioridad)
      const empleadosMerged = this.mergeEmpleados(empleadosFirebase, empleadosStorage);

      // Guardar en localStorage
      this.saveEmpleadosToStorage(empleadosMerged);

      // Sincronizar cambios pendientes
      await this.syncPendingEmpleados(empleadosMerged);

      console.log(`✅ Empleados sincronizados: ${empleadosMerged.length} total`);
      return empleadosMerged;
    } catch (error) {
      console.error('❌ Error sincronizando empleados:', error);
      return this.loadEmpleadosFromStorage();
    }
  }

  async saveEmpleado(empleado) {
    try {
      // Guardar en localStorage inmediatamente
      this.saveEmpleadoToStorage(empleado);

      // Si hay conexión, guardar en Firebase
      if (this.isOnline && firebase?.firestore) {
        await this.saveEmpleadoToFirebase(empleado);
        console.log('✅ Empleado guardado en Firebase y localStorage');
      } else {
        // Agregar a cola de sincronización
        this.addToPendingSync('empleados', 'create', empleado);
        console.log('📡 Empleado guardado en localStorage, pendiente de sincronización');
      }

      return true;
    } catch (error) {
      console.error('❌ Error guardando empleado:', error);
      return false;
    }
  }

  async saveEmpleadoToFirebase(empleado) {
    try {
      const db = firebase.firestore();
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const empleadoData = {
        ...empleado,
        userId: currentUser.uid,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (empleado.id && empleado.id !== 'temp') {
        // Actualizar empleado existente
        await db.collection('empleados').doc(empleado.id).set(empleadoData, { merge: true });
      } else {
        // Crear nuevo empleado
        const docRef = await db.collection('empleados').add(empleadoData);
        empleado.id = docRef.id;
        // Actualizar localStorage con el ID real
        this.updateEmpleadoInStorage(empleado);
      }

      return true;
    } catch (error) {
      console.error('❌ Error guardando empleado en Firebase:', error);
      throw error;
    }
  }

  // ========================================
  // SINCRONIZACIÓN DE HORAS
  // ========================================

  async syncHoras() {
    try {
      if (!this.isOnline || !firebase?.firestore) {
        return this.loadHorasFromStorage();
      }

      const db = firebase.firestore();
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        return this.loadHorasFromStorage();
      }

      // Cargar desde Firebase
      const horasSnapshot = await db.collection('horas').where('userId', '==', currentUser.uid).get();

      const horasFirebase = horasSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Cargar desde localStorage
      const horasStorage = this.loadHorasFromStorage();

      // Fusionar datos
      const horasMerged = this.mergeHoras(horasFirebase, horasStorage);

      // Guardar en localStorage
      this.saveHorasToStorage(horasMerged);

      // Sincronizar cambios pendientes
      await this.syncPendingHoras(horasMerged);

      console.log(`✅ Horas sincronizadas: ${horasMerged.length} total`);
      return horasMerged;
    } catch (error) {
      console.error('❌ Error sincronizando horas:', error);
      return this.loadHorasFromStorage();
    }
  }

  async saveHoras(horas) {
    try {
      // Guardar en localStorage inmediatamente
      this.saveHorasToStorage([horas]);

      // Si hay conexión, guardar en Firebase
      if (this.isOnline && firebase?.firestore) {
        await this.saveHorasToFirebase(horas);
        console.log('✅ Horas guardadas en Firebase y localStorage');
      } else {
        // Agregar a cola de sincronización
        this.addToPendingSync('horas', 'create', horas);
        console.log('📡 Horas guardadas en localStorage, pendiente de sincronización');
      }

      return true;
    } catch (error) {
      console.error('❌ Error guardando horas:', error);
      return false;
    }
  }

  async saveHorasToFirebase(horas) {
    try {
      const db = firebase.firestore();
      const currentUser = firebase.auth().currentUser;

      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }

      const horasData = {
        ...horas,
        userId: currentUser.uid,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
      };

      if (horas.id && horas.id !== 'temp') {
        // Actualizar horas existentes
        await db.collection('horas').doc(horas.id).set(horasData, { merge: true });
      } else {
        // Crear nuevas horas
        const docRef = await db.collection('horas').add(horasData);
        horas.id = docRef.id;
        // Actualizar localStorage con el ID real
        this.updateHorasInStorage(horas);
      }

      return true;
    } catch (error) {
      console.error('❌ Error guardando horas en Firebase:', error);
      throw error;
    }
  }

  // ========================================
  // FUNCIONES AUXILIARES
  // ========================================

  mergeEmpleados(firebaseData, storageData) {
    const merged = [...firebaseData];

    // Agregar empleados de localStorage que no estén en Firebase
    storageData.forEach((storageEmp) => {
      const exists = merged.find((fbEmp) => fbEmp.id === storageEmp.id);
      if (!exists) {
        merged.push(storageEmp);
      }
    });

    return merged;
  }

  mergeHoras(firebaseData, storageData) {
    const merged = [...firebaseData];

    // Agregar horas de localStorage que no estén en Firebase
    storageData.forEach((storageHora) => {
      const exists = merged.find((fbHora) => fbHora.id === storageHora.id);
      if (!exists) {
        merged.push(storageHora);
      }
    });

    return merged;
  }

  addToPendingSync(collection, action, data) {
    const syncItem = {
      id: Date.now().toString(),
      collection,
      action,
      data,
      timestamp: new Date().toISOString(),
      retries: 0,
    };

    this.pendingSync.push(syncItem);
    this.savePendingSync();
  }

  async syncPendingData() {
    if (this.pendingSync.length === 0) return;

    console.log(`📡 Sincronizando ${this.pendingSync.length} elementos pendientes...`);

    for (let i = this.pendingSync.length - 1; i >= 0; i--) {
      const item = this.pendingSync[i];

      try {
        if (item.collection === 'empleados') {
          await this.saveEmpleadoToFirebase(item.data);
        } else if (item.collection === 'horas') {
          await this.saveHorasToFirebase(item.data);
        }

        // Remover de la cola si se sincronizó correctamente
        this.pendingSync.splice(i, 1);
        console.log(`✅ ${item.collection} sincronizado: ${item.action}`);
      } catch (error) {
        item.retries++;
        console.warn(`⚠️ Error sincronizando ${item.collection}, reintentos: ${item.retries}`);

        // Remover si se han agotado los reintentos
        if (item.retries >= 3) {
          this.pendingSync.splice(i, 1);
          console.error(`❌ ${item.collection} removido de la cola después de 3 reintentos`);
        }
      }
    }

    this.savePendingSync();
  }

  // ========================================
  // MANEJO DE LOCALSTORAGE
  // ========================================

  loadEmpleadosFromStorage() {
    try {
      const data = localStorage.getItem('axyra_empleados');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error cargando empleados del localStorage:', error);
      return [];
    }
  }

  saveEmpleadosToStorage(empleados) {
    try {
      localStorage.setItem('axyra_empleados', JSON.stringify(empleados));
    } catch (error) {
      console.error('❌ Error guardando empleados en localStorage:', error);
    }
  }

  saveEmpleadoToStorage(empleado) {
    try {
      const empleados = this.loadEmpleadosFromStorage();
      const existingIndex = empleados.findIndex((emp) => emp.id === empleado.id);

      if (existingIndex >= 0) {
        empleados[existingIndex] = empleado;
      } else {
        empleados.push(empleado);
      }

      this.saveEmpleadosToStorage(empleados);
    } catch (error) {
      console.error('❌ Error guardando empleado en localStorage:', error);
    }
  }

  updateEmpleadoInStorage(empleado) {
    try {
      const empleados = this.loadEmpleadosFromStorage();
      const existingIndex = empleados.findIndex((emp) => emp.id === empleado.id);

      if (existingIndex >= 0) {
        empleados[existingIndex] = empleado;
        this.saveEmpleadosToStorage(empleados);
      }
    } catch (error) {
      console.error('❌ Error actualizando empleado en localStorage:', error);
    }
  }

  loadHorasFromStorage() {
    try {
      const data = localStorage.getItem('axyra_horas');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error cargando horas del localStorage:', error);
      return [];
    }
  }

  saveHorasToStorage(horas) {
    try {
      const existingHoras = this.loadHorasFromStorage();
      const updatedHoras = [...existingHoras];

      horas.forEach((hora) => {
        const existingIndex = updatedHoras.findIndex((h) => h.id === hora.id);
        if (existingIndex >= 0) {
          updatedHoras[existingIndex] = hora;
        } else {
          updatedHoras.push(hora);
        }
      });

      localStorage.setItem('axyra_horas', JSON.stringify(updatedHoras));
    } catch (error) {
      console.error('❌ Error guardando horas en localStorage:', error);
    }
  }

  updateHorasInStorage(horas) {
    try {
      const allHoras = this.loadHorasFromStorage();
      const existingIndex = allHoras.findIndex((h) => h.id === horas.id);

      if (existingIndex >= 0) {
        allHoras[existingIndex] = horas;
        localStorage.setItem('axyra_horas', JSON.stringify(allHoras));
      }
    } catch (error) {
      console.error('❌ Error actualizando horas en localStorage:', error);
    }
  }

  savePendingSync() {
    try {
      localStorage.setItem('axyra_pending_sync', JSON.stringify(this.pendingSync));
    } catch (error) {
      console.error('❌ Error guardando cola de sincronización:', error);
    }
  }

  loadPendingSync() {
    try {
      const data = localStorage.getItem('axyra_pending_sync');
      this.pendingSync = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('❌ Error cargando cola de sincronización:', error);
      this.pendingSync = [];
    }
  }

  // ========================================
  // SINCRONIZACIÓN AUTOMÁTICA
  // ========================================

  startAutoSync() {
    // Cargar datos pendientes
    this.loadPendingSync();

    // Sincronizar cada 30 segundos si hay conexión
    this.syncInterval = setInterval(() => {
      if (this.isOnline && this.pendingSync.length > 0) {
        this.syncPendingData();
      }
    }, 30000);
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  // ========================================
  // UTILIDADES PÚBLICAS
  // ========================================

  async getEmpleados() {
    return await this.syncEmpleados();
  }

  async getHoras() {
    return await this.syncHoras();
  }

  async addEmpleado(empleado) {
    return await this.saveEmpleado(empleado);
  }

  async addHoras(horas) {
    return await this.saveHoras(horas);
  }

  getSyncStatus() {
    return {
      isOnline: this.isOnline,
      pendingSync: this.pendingSync.length,
      lastSync: this.pendingSync.length > 0 ? this.pendingSync[0]?.timestamp : null,
    };
  }
}

// Crear instancia global
window.firebaseSyncManager = new FirebaseSyncManager();
