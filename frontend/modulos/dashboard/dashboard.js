// Dashboard AXYRA - Sistema de Gestión Empresarial
// Conecta con la base de datos y muestra estadísticas en tiempo real

class AxyraDashboard {
  constructor() {
    this.empleados = [];
    this.horas = [];
    this.nominas = [];
    this.cuadres = [];
    this.actividadReciente = [];
    this.charts = {};
    this.updateInterval = null;
    this.init();
  }

  async init() {
    console.log('🚀 Inicializando Dashboard AXYRA...');

    try {
      // Verificar autenticación
      const isAuthenticated = await this.checkAuth();
      console.log('🔐 Estado de autenticación:', isAuthenticated);

      if (isAuthenticated) {
        await this.loadDashboardData();
        this.setupRealTimeUpdates();
        this.startAutoRefresh();
        this.setupModals();
        this.setupEventListeners();
        console.log('✅ Dashboard inicializado correctamente');
      } else {
        console.log('❌ Usuario no autenticado, redirigiendo al login...');
        this.showLoginMessage();

        // Redirigir al login después de un breve delay
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error inicializando dashboard:', error);
      this.showErrorMessage('Error inicializando el dashboard');

      // En caso de error, también redirigir al login
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 3000);
    }
  }

  async checkAuth() {
    try {
      console.log('🔐 Verificando autenticación...');

      // Usar el Auth Manager si está disponible
      if (window.axyraAuthManager) {
        const isAuth = window.axyraAuthManager.isUserAuthenticated();
        if (isAuth) {
          console.log('✅ Usuario autenticado desde Auth Manager');
          return true;
        }
      }

      // Fallback: verificar directamente
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          if (user && user.isAuthenticated) {
            console.log('✅ Usuario autenticado desde localStorage:', user.username || user.email);
            return true;
          }
        } catch (parseError) {
          console.warn('⚠️ Error parseando usuario de localStorage:', parseError);
        }
      }

      console.log('❌ No se encontró usuario autenticado');
      return false;
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      return false;
    }
  }

  async loadDashboardData() {
    console.log('📊 Cargando datos del dashboard...');

    try {
      // Cargar datos desde la base de datos
      await this.loadEmpleados();
      await this.loadHoras();
      await this.loadNominas();
      await this.loadCuadres();
      await this.loadActividadReciente();

      // Actualizar estadísticas
      this.updateStats();
      this.updateCharts();
      this.updateWelcomeMessage();
      this.updateActividadReciente();

      console.log('✅ Dashboard cargado correctamente');
    } catch (error) {
      console.error('❌ Error cargando dashboard:', error);
      this.showErrorMessage('Error cargando datos del dashboard');
    }
  }

  async loadEmpleados() {
    try {
      // Usar el sistema de sincronización si está disponible
      if (window.firebaseSyncManager) {
        try {
          console.log('🔄 Usando sistema de sincronización para empleados...');
          this.empleados = await window.firebaseSyncManager.getEmpleados();

          // Obtener usuario actual para filtrar
          let currentUser = null;
          if (window.axyraIsolatedAuth && window.axyraIsolatedAuth.isUserAuthenticated()) {
            currentUser = window.axyraIsolatedAuth.getCurrentUser();
          } else {
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
              currentUser = JSON.parse(userData);
            }
          }

          // Filtrar solo empleados del usuario actual
          if (currentUser) {
            this.empleados = this.empleados.filter(
              (emp) =>
                emp.userId === currentUser.username || emp.userId === currentUser.email || emp.userId === currentUser.id
            );
          }

          console.log(`✅ ${this.empleados.length} empleados cargados desde sistema de sincronización`);
          return;
        } catch (syncError) {
          console.warn('⚠️ Error con sistema de sincronización, usando método directo:', syncError);
        }
      }

      // Método directo - cargar desde localStorage primero
      const empleadosData = localStorage.getItem('axyra_empleados');
      if (empleadosData) {
        this.empleados = JSON.parse(empleadosData);
      }

      // Intentar cargar desde Firebase si está disponible
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          const snapshot = await db.collection('empleados').get();
          if (!snapshot.empty) {
            this.empleados = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            // Actualizar localStorage
            localStorage.setItem('axyra_empleados', JSON.stringify(this.empleados));
          }
        } catch (firebaseError) {
          console.warn('⚠️ Error cargando desde Firebase, usando localStorage:', firebaseError);
        }
      }

      console.log(`✅ ${this.empleados.length} empleados cargados`);
    } catch (error) {
      console.error('❌ Error cargando empleados:', error);
      this.empleados = [];
    }
  }

  async loadHoras() {
    try {
      // Usar el sistema de sincronización si está disponible
      if (window.firebaseSyncManager) {
        try {
          this.horas = await window.firebaseSyncManager.getHoras() || [];
          console.log('✅ Horas cargadas desde Firebase Sync Manager:', this.horas.length);
        } catch (error) {
          console.warn('⚠️ Error con Firebase Sync Manager, usando método directo:', error);
        }
      }

      // Si no hay datos del sync manager, intentar método directo
      if (this.horas.length === 0) {
        const horasData = localStorage.getItem('axyra_horas');
        if (horasData) {
          this.horas = JSON.parse(horasData);
        }

        if (typeof firebase !== 'undefined' && firebase.firestore) {
          try {
            const db = firebase.firestore();
            const snapshot = await db.collection('horas_trabajadas').get();
            if (!snapshot.empty) {
              this.horas = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));
              localStorage.setItem('axyra_horas', JSON.stringify(this.horas));
            }
          } catch (firebaseError) {
            console.warn('⚠️ Error cargando horas desde Firebase:', firebaseError);
          }
        }
      }

      console.log(`✅ ${this.horas.length} registros de horas cargados`);
      console.log('🔍 Detalle de horas:', this.horas);
    } catch (error) {
      console.error('❌ Error cargando horas:', error);
      this.horas = [];
    }
  }

  async loadNominas() {
    try {
      const nominasData = localStorage.getItem('axyra_nominas');
      if (nominasData) {
        this.nominas = JSON.parse(nominasData);
      }

      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          const snapshot = await db.collection('nominas').get();
          if (!snapshot.empty) {
            this.nominas = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            localStorage.setItem('axyra_nominas', JSON.stringify(this.nominas));
          }
        } catch (firebaseError) {
          console.warn('⚠️ Error cargando nóminas desde Firebase:', firebaseError);
        }
      }

      console.log(`✅ ${this.nominas.length} nóminas cargadas`);
    } catch (error) {
      console.error('❌ Error cargando nóminas:', error);
      this.nominas = [];
    }
  }

  async loadCuadres() {
    try {
      const cuadresData = localStorage.getItem('axyra_cuadres');
      if (cuadresData) {
        this.cuadres = JSON.parse(cuadresData);
      }

      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const db = firebase.firestore();
          const snapshot = await db.collection('cuadre_caja').get();
          if (!snapshot.empty) {
            this.cuadres = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            localStorage.setItem('axyra_cuadres', JSON.stringify(this.cuadres));
          }
        } catch (firebaseError) {
          console.warn('⚠️ Error cargando cuadres desde Firebase:', firebaseError);
        }
      }

      console.log(`✅ ${this.cuadres.length} cuadres de caja cargados`);
    } catch (error) {
      console.error('❌ Error cargando cuadres:', error);
      this.cuadres = [];
    }
  }

  async loadActividadReciente() {
    try {
      const actividadData = localStorage.getItem('axyra_actividad');
      if (actividadData) {
        this.actividadReciente = JSON.parse(actividadData);
      }

      // Crear actividad reciente basada en los datos cargados
      this.actividadReciente = this.generateActividadReciente();
      localStorage.setItem('axyra_actividad', JSON.stringify(this.actividadReciente));
    } catch (error) {
      console.error('❌ Error cargando actividad reciente:', error);
      this.actividadReciente = [];
    }
  }

  generateActividadReciente() {
    const actividades = [];
    const now = new Date();

    try {
      // Actividad de empleados
      if (this.empleados.length > 0) {
        const ultimoEmpleado = this.empleados[this.empleados.length - 1];
        if (ultimoEmpleado && ultimoEmpleado.nombre) {
          actividades.push({
            tipo: 'empleado',
            accion: 'Empleado registrado',
            detalle: ultimoEmpleado.nombre,
            timestamp: ultimoEmpleado.fecha_registro || ultimoEmpleado.createdAt || now.toISOString(),
            icono: 'fas fa-user-plus',
          });
        }
      }

      // Actividad de horas
      if (this.horas.length > 0) {
        const ultimaHora = this.horas[this.horas.length - 1];
        if (ultimaHora && ultimaHora.empleado_id) {
          const empleado = this.empleados.find((e) => e.id === ultimaHora.empleado_id);
          if (empleado && empleado.nombre) {
            actividades.push({
              tipo: 'hora',
              accion: 'Horas registradas',
              detalle: `${empleado.nombre}: ${ultimaHora.total_horas || 0} horas`,
              timestamp: ultimaHora.fecha || ultimaHora.createdAt || now.toISOString(),
              icono: 'fas fa-clock',
            });
          }
        }
      }

      // Actividad de nóminas
      if (this.nominas.length > 0) {
        const ultimaNomina = this.nominas[this.nominas.length - 1];
        if (ultimaNomina && ultimaNomina.quincena) {
          actividades.push({
            tipo: 'nomina',
            accion: 'Nómina generada',
            detalle: `Quincena: ${ultimaNomina.quincena}`,
            timestamp: ultimaNomina.fecha_generacion || ultimaNomina.createdAt || now.toISOString(),
            icono: 'fas fa-file-invoice-dollar',
          });
        }
      }

      // Actividad de cuadres
      if (this.cuadres.length > 0) {
        const ultimoCuadre = this.cuadres[this.cuadres.length - 1];
        if (ultimoCuadre && ultimoCuadre.total !== undefined) {
          actividades.push({
            tipo: 'cuadre',
            accion: 'Cuadre de caja',
            detalle: `Total: $${ultimoCuadre.total}`,
            timestamp: ultimoCuadre.fecha || ultimoCuadre.createdAt || now.toISOString(),
            icono: 'fas fa-calculator',
          });
        }
      }

      // Ordenar por timestamp más reciente
      return actividades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);
    } catch (error) {
      console.error('❌ Error generando actividad reciente:', error);
      return [];
    }
  }

  updateStats() {
    try {
      // Total empleados
      const totalEmpleados = this.empleados.length;
      const totalEmpleadosElement = document.getElementById('totalEmpleados');
      if (totalEmpleadosElement) {
        totalEmpleadosElement.textContent = totalEmpleados;
      }

      // Empleados activos (incluye todos los estados excepto 'INACTIVO' o 'BAJA')
      const empleadosActivos = this.empleados.filter((e) => {
        if (!e || !e.estado) return true; // Si no hay estado, considerar activo
        const estado = e.estado.toUpperCase();
        return estado !== 'INACTIVO' && estado !== 'BAJA' && estado !== 'DESPEDIDO';
      }).length;
      
      const empleadosActivosElement = document.getElementById('empleadosActivos');
      if (empleadosActivosElement) {
        empleadosActivosElement.textContent = empleadosActivos;
      }
      
      // Debug: mostrar información de empleados
      console.log('👥 Empleados cargados:', this.empleados.length);
      console.log('✅ Empleados activos:', empleadosActivos);
      console.log('🔍 Detalle de empleados:', this.empleados.map(e => ({ id: e.id, nombre: e.nombre, estado: e.estado, tipoContrato: e.tipoContrato })));

      // Horas trabajadas - calcular correctamente según estructura de datos
      const totalHoras = this.horas.reduce((sum, h) => {
        if (!h || !h.horas) return sum;
        
        // Sumar todos los tipos de horas
        const horasOrdinarias = h.horas.ordinarias || 0;
        const horasExtras = h.horas.extras || 0;
        const horasFestivas = h.horas.extrasFestivas || 0;
        const horasNocturnas = h.horas.extrasFestivasNocturnas || 0;
        
        return sum + horasOrdinarias + horasExtras + horasFestivas + horasNocturnas;
      }, 0);
      
      const horasTrabajadasElement = document.getElementById('horasTrabajadas');
      if (horasTrabajadasElement) {
        horasTrabajadasElement.textContent = totalHoras.toFixed(1);
      }

      // Horas del mes - calcular correctamente según estructura de datos
      const mesActual = new Date().getMonth();
      const horasMes = this.horas
        .filter((h) => {
          try {
            return new Date(h.fecha).getMonth() === mesActual;
          } catch (e) {
            return false;
          }
        })
        .reduce((sum, h) => {
          if (!h || !h.horas) return sum;
          
          // Sumar todos los tipos de horas
          const horasOrdinarias = h.horas.ordinarias || 0;
          const horasExtras = h.horas.extras || 0;
          const horasFestivas = h.horas.extrasFestivas || 0;
          const horasNocturnas = h.horas.extrasFestivasNocturnas || 0;
          
          return sum + horasOrdinarias + horasExtras + horasFestivas + horasNocturnas;
        }, 0);
      
      const horasMesElement = document.getElementById('horasMes');
      if (horasMesElement) {
        horasMesElement.textContent = horasMes.toFixed(1);
      }

      // Nóminas generadas
      const nominasGeneradas = this.nominas.filter((n) => n.estado === 'Generada').length;
      const nominasGeneradasElement = document.getElementById('nominasGeneradas');
      if (nominasGeneradasElement) {
        nominasGeneradasElement.textContent = nominasGeneradas;
      }

      // Comprobantes generados
      const comprobantesGenerados = this.nominas.length;
      const comprobantesGeneradosElement = document.getElementById('comprobantesGenerados');
      if (comprobantesGeneradosElement) {
        comprobantesGeneradosElement.textContent = comprobantesGenerados;
      }

      // Cuadres de caja
      const cuadresCajaElement = document.getElementById('cuadresCaja');
      if (cuadresCajaElement) {
        cuadresCajaElement.textContent = this.cuadres.length;
      }

      // Total salarios netos (cambiado de salarios base a netos)
      const totalSalariosNetos = this.empleados.reduce((sum, e) => sum + this.calcularSalarioNeto(e), 0);
      const totalSalariosElement = document.getElementById('totalSalarios');
      if (totalSalariosElement) {
        totalSalariosElement.textContent = `$${totalSalariosNetos.toLocaleString()}`;
      }

      // Total pagos por horas trabajadas - calcular según ley colombiana
      const totalPagosHoras = this.horas.reduce((sum, h) => {
        if (!h || !h.horas || !h.salarios) return sum;
        
        // Obtener el empleado para saber su tipo de contrato
        const empleado = this.empleados.find(e => e.id == h.empleadoId);
        if (!empleado) return sum;
        
        // Calcular según tipo de contrato
        if (empleado.tipoContrato === 'Fijo') {
          // Empleados fijos: 44 horas semanales, salario/2
          const salarioHora = empleado.salario / 2; // 44 horas semanales
          const horasOrdinarias = h.horas.ordinarias || 0;
          const horasExtras = h.horas.extras || 0;
          const horasFestivas = h.horas.extrasFestivas || 0;
          const horasNocturnas = h.horas.extrasFestivasNocturnas || 0;
          
          const pagoOrdinario = horasOrdinarias * salarioHora;
          const pagoExtras = horasExtras * (salarioHora * 1.25); // 25% extra
          const pagoFestivas = horasFestivas * (salarioHora * 1.75); // 75% extra
          const pagoNocturnas = horasNocturnas * (salarioHora * 2.1); // 110% extra
          
          return sum + pagoOrdinario + pagoExtras + pagoFestivas + pagoNocturnas;
        } else {
          // Empleados por horas: salario/240
          const salarioHora = empleado.salario / 240; // 240 horas mensuales
          const horasOrdinarias = h.horas.ordinarias || 0;
          const horasExtras = h.horas.extras || 0;
          const horasFestivas = h.horas.extrasFestivas || 0;
          const horasNocturnas = h.horas.extrasFestivasNocturnas || 0;
          
          const pagoOrdinario = horasOrdinarias * salarioHora;
          const pagoExtras = horasExtras * (salarioHora * 1.25); // 25% extra
          const pagoFestivas = horasFestivas * (salarioHora * 1.75); // 75% extra
          const pagoNocturnas = horasNocturnas * (salarioHora * 2.1); // 110% extra
          
          return sum + pagoOrdinario + pagoExtras + pagoFestivas + pagoNocturnas;
        }
      }, 0);
      
      const totalPagosElement = document.getElementById('totalPagos');
      if (totalPagosElement) {
        totalPagosElement.textContent = `$${totalPagosHoras.toFixed(0)}`;
      }

      // Días trabajados - solo para empleados fijos (44 horas semanales)
      const diasTrabajados = this.horas
        .filter((h) => {
          if (!h || !h.empleadoId) return false;
          const empleado = this.empleados.find(e => e.id == h.empleadoId);
          return empleado && empleado.tipoContrato === 'Fijo';
        })
        .reduce((sum, h) => {
          if (!h || !h.horas) return sum;
          
          // Para empleados fijos, contar días con horas ordinarias
          const horasOrdinarias = h.horas.ordinarias || 0;
          return sum + (horasOrdinarias > 0 ? 1 : 0);
        }, 0);
      
      const diasTrabajadosElement = document.getElementById('diasTrabajados');
      if (diasTrabajadosElement) {
        diasTrabajadosElement.textContent = diasTrabajados;
      }

      // Departamentos
      const departamentos = [
        ...new Set(
          this.empleados.map((e) => (e && e.departamento ? e.departamento : 'Sin Departamento')).filter(Boolean)
        ),
      ];
      const departamentosElement = document.getElementById('departamentos');
      if (departamentosElement) {
        departamentosElement.textContent = departamentos.length;
      }

      // Tareas pendientes (simulado)
      const tareasPendientesElement = document.getElementById('tareasPendientes');
      if (tareasPendientesElement) {
        tareasPendientesElement.textContent = Math.floor(Math.random() * 5) + 1;
      }
    } catch (error) {
      console.error('❌ Error actualizando estadísticas:', error);
    }
  }

  updateCharts() {
    try {
      this.updateEmployeeDistributionChart();
      this.updateHoursTrendChart();
      this.updateSalaryDistributionChart();
      this.updateProductivityChart();
    } catch (error) {
      console.error('❌ Error actualizando gráficos:', error);
    }
  }

  updateEmployeeDistributionChart() {
    try {
      const ctx = document.getElementById('employeeDistributionChart');
      if (!ctx) return;

      const departamentos = {};
      this.empleados.forEach((emp) => {
        const dept = emp.departamento || 'Sin departamento';
        departamentos[dept] = (departamentos[dept] || 0) + 1;
      });

      if (this.charts.employeeDistribution) {
        this.charts.employeeDistribution.destroy();
      }

      this.charts.employeeDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(departamentos),
          datasets: [
            {
              data: Object.values(departamentos),
              backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error actualizando gráfico de distribución de empleados:', error);
    }
  }

  updateHoursTrendChart() {
    try {
      const ctx = document.getElementById('hoursTrendChart');
      if (!ctx) return;

      // Agrupar horas por mes
      const horasPorMes = {};
      this.horas.forEach((hora) => {
        try {
          const fecha = new Date(hora.fecha);
          const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
          horasPorMes[mes] = (horasPorMes[mes] || 0) + (hora.total_horas || 0);
        } catch (e) {
          console.warn('⚠️ Fecha inválida en horas:', hora.fecha);
        }
      });

      const meses = Object.keys(horasPorMes).sort();
      const datos = meses.map((mes) => horasPorMes[mes]);

      if (this.charts.hoursTrend) {
        this.charts.hoursTrend.destroy();
      }

      this.charts.hoursTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: meses.map((mes) => {
            const [year, month] = mes.split('-');
            return `${month}/${year}`;
          }),
          datasets: [
            {
              label: 'Horas Trabajadas',
              data: datos,
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error actualizando gráfico de tendencia de horas:', error);
    }
  }

  updateSalaryDistributionChart() {
    try {
      const ctx = document.getElementById('salaryDistributionChart');
      if (!ctx) return;

      // Agrupar salarios por rangos
      const rangosSalario = {
        'Menos de $1M': 0,
        '$1M - $2M': 0,
        '$2M - $3M': 0,
        'Más de $3M': 0,
      };

      this.empleados.forEach((emp) => {
        const salario = emp.salario || 0;
        if (salario < 1000000) rangosSalario['Menos de $1M']++;
        else if (salario < 2000000) rangosSalario['$1M - $2M']++;
        else if (salario < 3000000) rangosSalario['$2M - $3M']++;
        else rangosSalario['Más de $3M']++;
      });

      if (this.charts.salaryDistribution) {
        this.charts.salaryDistribution.destroy();
      }

      this.charts.salaryDistribution = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(rangosSalario),
          datasets: [
            {
              label: 'Empleados',
              data: Object.values(rangosSalario),
              backgroundColor: '#667eea',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error actualizando gráfico de distribución de salarios:', error);
    }
  }

  updateProductivityChart() {
    try {
      const ctx = document.getElementById('productivityChart');
      if (!ctx) return;

      // Calcular métricas de productividad
      const totalEmpleados = this.empleados.length;
      const empleadosActivos = this.empleados.filter((e) => e.estado === 'ACTIVO').length;
      const totalHoras = this.horas.reduce((sum, h) => sum + (h.total_horas || 0), 0);
      const promedioHoras = totalEmpleados > 0 ? totalHoras / totalEmpleados : 0;

      if (this.charts.productivity) {
        this.charts.productivity.destroy();
      }

      this.charts.productivity = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: ['Empleados Activos', 'Horas Promedio', 'Eficiencia', 'Ocupación'],
          datasets: [
            {
              label: 'Métricas',
              data: [
                totalEmpleados > 0 ? (empleadosActivos / totalEmpleados) * 100 : 0,
                Math.min((promedioHoras / 160) * 100, 100), // 160 horas mensuales estándar
                85, // Eficiencia simulada
                90, // Ocupación simulada
              ],
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.2)',
              pointBackgroundColor: '#667eea',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error actualizando gráfico de productividad:', error);
    }
  }

  updateWelcomeMessage() {
    try {
      const welcomeTitle = document.getElementById('welcomeTitle');
      const welcomeMessage = document.getElementById('welcomeMessage');
      const companyName = document.getElementById('companyName');
      const companyNIT = document.getElementById('companyNIT');
      const pageSubtitle = document.getElementById('pageSubtitle');
      const roleBadge = document.getElementById('roleBadge');

      if (welcomeTitle) {
        welcomeTitle.textContent = `¡Bienvenido a AXYRA!`;
      }

      if (welcomeMessage) {
        welcomeMessage.textContent = 'Sistema de Gestión Empresarial';
      }

      // Cargar información de la empresa desde localStorage
      this.updateCompanyInfo(companyName, companyNIT);

      // Actualizar subtítulo de la página
      if (pageSubtitle) {
        pageSubtitle.textContent = 'Dashboard';
      }

      // Actualizar badge de rol
      this.updateRoleBadge(roleBadge);

      // Actualizar hora de bienvenida
      this.updateWelcomeTime();

      // Actualizar información del usuario
      this.updateUserInfo();
    } catch (error) {
      console.error('❌ Error actualizando mensaje de bienvenida:', error);
    }
  }

  updateCompanyInfo(companyNameElement, companyNITElement) {
    try {
      // Intentar cargar desde configuración de empresa
      const companyConfig = localStorage.getItem('axyra_config_empresa');
      if (companyConfig) {
        const config = JSON.parse(companyConfig);

        if (companyNameElement && config.nombre) {
          companyNameElement.textContent = config.nombre;
          // También actualizar el título de la página
          document.title = `AXYRA - ${config.nombre}`;
        }

        if (companyNITElement && config.nit) {
          companyNITElement.textContent = `NIT: ${config.nit}`;
        }
      } else {
        // Configuración por defecto
        if (companyNameElement) {
          companyNameElement.textContent = 'Villa Venecia';
        }
        if (companyNITElement) {
          companyNITElement.textContent = 'NIT: Por configurar';
        }
      }
    } catch (error) {
      console.warn('⚠️ Error cargando información de empresa:', error);
      // Fallback a valores por defecto
      if (companyNameElement) {
        companyNameElement.textContent = 'Villa Venecia';
      }
      if (companyNITElement) {
        companyNITElement.textContent = 'NIT: Por configurar';
      }
    }
  }

  updateRoleBadge(roleBadgeElement) {
    try {
      if (!roleBadgeElement) return;

      // Determinar el rol del usuario actual
      let userRole = 'Empleado';
      let roleIcon = 'fas fa-user-shield';
      let roleColor = 'var(--axyra-blue-500)';

      // Verificar si es administrador
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        if (currentUser.rol === 'admin' || currentUser.rol === 'administrador') {
          userRole = 'Administrador';
          roleIcon = 'fas fa-user-crown';
          roleColor = 'var(--axyra-warning)';
        } else if (currentUser.rol === 'supervisor' || currentUser.rol === 'supervisor') {
          userRole = 'Supervisor';
          roleIcon = 'fas fa-user-tie';
          roleColor = 'var(--axyra-success)';
        } else if (currentUser.rol === 'usuario' || currentUser.rol === 'user') {
          userRole = 'Usuario';
          roleIcon = 'fas fa-user';
          roleColor = 'var(--axyra-blue-500)';
        }
      }

      // Actualizar el badge
      const roleIconElement = roleBadgeElement.querySelector('i');
      const roleTextElement = roleBadgeElement.querySelector('.axyra-role-badge-text');

      if (roleIconElement) {
        roleIconElement.className = roleIcon;
      }

      if (roleTextElement) {
        roleTextElement.textContent = userRole;
      }

      // Aplicar color personalizado
      roleBadgeElement.style.setProperty('--role-color', roleColor);
    } catch (error) {
      console.error('❌ Error actualizando badge de rol:', error);
    }
  }

  getCurrentUser() {
    try {
      // Usar el Auth Manager si está disponible
      if (window.axyraAuthManager) {
        return window.axyraAuthManager.getCurrentUser();
      }

      // Fallback: verificar directamente
      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        return JSON.parse(userData);
      }

      return null;
    } catch (error) {
      console.warn('⚠️ Error obteniendo usuario actual:', error);
      return null;
    }
  }

  updateWelcomeTime() {
    try {
      const welcomeTimeElement = document.getElementById('welcomeTime');
      if (!welcomeTimeElement) return;

      const now = new Date();
      const hour = now.getHours();
      let greeting = '';

      if (hour < 12) {
        greeting = 'Buenos días';
      } else if (hour < 18) {
        greeting = 'Buenas tardes';
      } else {
        greeting = 'Buenas noches';
      }

      const timeString = now.toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      welcomeTimeElement.textContent = `${greeting} - ${timeString}`;
    } catch (error) {
      console.error('❌ Error actualizando hora de bienvenida:', error);
    }
  }

  updateUserInfo() {
    try {
      const userEmailElement = document.getElementById('userEmail');
      if (!userEmailElement) return;

      const currentUser = this.getCurrentUser();
      if (currentUser) {
        userEmailElement.textContent = currentUser.email || currentUser.username || 'Usuario';
      } else {
        userEmailElement.textContent = 'Usuario';
      }
    } catch (error) {
      console.error('❌ Error actualizando información del usuario:', error);
    }
  }

  updateActividadReciente() {
    try {
      const container = document.getElementById('actividadReciente');
      if (!container) return;

      container.innerHTML = this.actividadReciente
        .map(
          (actividad) => `
                <div class="axyra-activity-item">
                    <div class="axyra-activity-icon">
                        <i class="${actividad.icono}"></i>
                    </div>
                    <div class="axyra-activity-content">
                        <div class="axyra-activity-action">${actividad.accion}</div>
                        <div class="axyra-activity-detail">${actividad.detalle}</div>
                        <div class="axyra-activity-time">${this.formatTimestamp(actividad.timestamp)}</div>
                    </div>
                </div>
            `
        )
        .join('');
    } catch (error) {
      console.error('❌ Error actualizando actividad reciente:', error);
    }
  }

  formatTimestamp(timestamp) {
    try {
      const fecha = new Date(timestamp);
      const ahora = new Date();
      const diffMs = ahora - fecha;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return 'Hace un momento';
      if (diffMins < 60) return `Hace ${diffMins} minutos`;
      if (diffHours < 24) return `Hace ${diffHours} horas`;
      if (diffDays < 7) return `Hace ${diffDays} días`;
      return fecha.toLocaleDateString('es-CO');
    } catch (error) {
      return 'Fecha no disponible';
    }
  }

  setupRealTimeUpdates() {
    try {
      // Actualizar actividad reciente cada 30 segundos
      setInterval(() => {
        this.loadActividadReciente();
        this.updateActividadReciente();
      }, 30000);

      // Escuchar cambios en localStorage para actualizaciones en tiempo real
      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('axyra_')) {
          this.loadDashboardData();
        }
      });
    } catch (error) {
      console.error('❌ Error configurando actualizaciones en tiempo real:', error);
    }
  }

  startAutoRefresh() {
    try {
      // Actualizar datos cada 5 minutos
      this.updateInterval = setInterval(() => {
        this.loadDashboardData();
      }, 300000);
    } catch (error) {
      console.error('❌ Error iniciando auto-refresh:', error);
    }
  }

  // Funciones para mostrar detalles
  mostrarDetalleEmpleados() {
    try {
      this.showModal('Detalle de Empleados', this.createEmpleadosDetailHTML());
    } catch (error) {
      console.error('❌ Error mostrando detalle de empleados:', error);
    }
  }

  mostrarDetalleHoras() {
    try {
      this.showModal('Detalle de Horas', this.createHorasDetailHTML());
    } catch (error) {
      console.error('❌ Error mostrando detalle de horas:', error);
    }
  }

  mostrarDetalleComprobantes() {
    try {
      this.showModal('Detalle de Comprobantes', this.createComprobantesDetailHTML());
    } catch (error) {
      console.error('❌ Error mostrando detalle de comprobantes:', error);
    }
  }

  mostrarDetalleSalarios() {
    try {
      this.showModal('Detalle de Salarios Netos', this.createSalariosDetailHTML());
    } catch (error) {
      console.error('❌ Error mostrando detalle de salarios:', error);
    }
  }

  createEmpleadosDetailHTML() {
    try {
      return `
                <div class="axyra-empleados-lista">
                    ${this.empleados
                      .map(
                        (emp) => `
                        <div class="axyra-empleado-item">
                            <div class="axyra-empleado-info">
                                <strong>${emp.nombre || 'N/A'}</strong>
                                <span>Cédula: ${emp.cedula || 'N/A'}</span>
                                <span>Departamento: ${emp.departamento || 'Sin asignar'}</span>
                                <span>Estado: ${emp.estado || 'ACTIVO'}</span>
                            </div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            `;
    } catch (error) {
      console.error('❌ Error creando HTML de empleados:', error);
      return '<p>Error cargando información de empleados</p>';
    }
  }

  createHorasDetailHTML() {
    try {
      const totalHoras = this.horas.reduce((sum, h) => sum + (h.total_horas || 0), 0);
      return `
                <div class="axyra-horas-lista">
                    <div class="axyra-horas-resumen">
                        <strong>Total de horas registradas: ${totalHoras.toFixed(1)}</strong>
                    </div>
                    ${this.horas
                      .slice(-10)
                      .map((hora) => {
                        const empleado = this.empleados.find((e) => e.id === hora.empleado_id);
                        return `
                            <div class="axyra-hora-item">
                                <div class="axyra-hora-info">
                                    <strong>${empleado ? empleado.nombre : 'Empleado no encontrado'}</strong>
                                    <span>Fecha: ${hora.fecha || 'N/A'}</span>
                                    <span>Horas: ${hora.total_horas || 0}</span>
                                </div>
                            </div>
                        `;
                      })
                      .join('')}
                </div>
            `;
    } catch (error) {
      console.error('❌ Error creando HTML de horas:', error);
      return '<p>Error cargando información de horas</p>';
    }
  }

  createComprobantesDetailHTML() {
    try {
      return `
                <div class="axyra-comprobantes-lista">
                    ${this.nominas
                      .map(
                        (nomina) => `
                        <div class="axyra-comprobante-item">
                            <div class="axyra-comprobante-info">
                                <strong>Quincena: ${nomina.quincena || 'N/A'}</strong>
                                <span>Estado: ${nomina.estado || 'Pendiente'}</span>
                                <span>Fecha: ${nomina.fecha_generacion || 'N/A'}</span>
                            </div>
                        </div>
                    `
                      )
                      .join('')}
                </div>
            `;
    } catch (error) {
      console.error('❌ Error creando HTML de comprobantes:', error);
      return '<p>Error cargando información de comprobantes</p>';
    }
  }

  createSalariosDetailHTML() {
    try {
      // Calcular salarios netos para cada empleado
      const empleadosConSalarioNeto = this.empleados.map((emp) => {
        const salarioNeto = this.calcularSalarioNeto(emp);
        return { ...emp, salarioNeto };
      });

      const totalSalariosNetos = empleadosConSalarioNeto.reduce((sum, e) => sum + (e.salarioNeto || 0), 0);

      return `
                <div class="axyra-salarios-lista">
                    ${empleadosConSalarioNeto
                      .map(
                        (emp) => `
                        <div class="axyra-salario-item">
                            <div class="axyra-salario-info">
                                <strong>${emp.nombre || 'N/A'}</strong>
                                <span>Salario Neto: $${(emp.salarioNeto || 0).toLocaleString()}</span>
                                <span>Salario Base: $${(emp.salario || 0).toLocaleString()}</span>
                                <span>Departamento: ${emp.departamento || 'Sin asignar'}</span>
                            </div>
                        </div>
                    `
                      )
                      .join('')}
                    <div class="axyra-salario-total">
                        <strong>Total Salarios Netos: $${totalSalariosNetos.toLocaleString()}</strong>
                    </div>
                </div>
            `;
    } catch (error) {
      console.error('❌ Error creando HTML de salarios:', error);
      return '<p>Error cargando información de salarios</p>';
    }
  }

  calcularSalarioNeto(empleado) {
    try {
      // Buscar las horas trabajadas del empleado en la quincena actual
      const quincenaActual = this.obtenerQuincenaActual();
      const horasEmpleado = this.horas.find((h) => h.empleado_id === empleado.id && h.quincena === quincenaActual);

      if (!horasEmpleado) {
        // Si no hay horas registradas, retornar 0 para empleados temporales
        // o salario base / 2 para empleados fijos
        if (empleado.tipo === 'FIJO') {
          return Math.round((empleado.salario || 0) / 2);
        }
        return 0;
      }

      // Construir el diccionario de horas como lo espera el backend
      const horasDict = {
        ordinarias: horasEmpleado.horas_ordinarias || 0,
        recargo_nocturno: horasEmpleado.recargo_nocturno || 0,
        recargo_diurno_dominical: horasEmpleado.recargo_diurno_dominical || 0,
        recargo_nocturno_dominical: horasEmpleado.recargo_nocturno_dominical || 0,
        hora_extra_diurna: horasEmpleado.hora_extra_diurna || 0,
        hora_extra_nocturna: horasEmpleado.hora_extra_nocturna || 0,
        hora_diurna_dominical_o_festivo: horasEmpleado.hora_diurna_dominical_o_festivo || 0,
        hora_extra_diurna_dominical_o_festivo: horasEmpleado.hora_extra_diurna_dominical_o_festivo || 0,
        hora_nocturna_dominical_o_festivo: horasEmpleado.hora_nocturna_dominical_o_festivo || 0,
        hora_extra_nocturna_dominical_o_festivo: horasEmpleado.hora_extra_nocturna_dominical_o_festivo || 0,
      };

      // Calcular valor de la hora base
      const valorHoraBase = (empleado.salario || 0) / 220;

      let total = 0;

      // Calcular horas ordinarias
      const horasOrdinarias = horasDict.ordinarias || 0;
      if (empleado.tipo === 'FIJO') {
        // Para empleados fijos: salario mínimo / 2
        const salarioMinimo = 1423500; // Valor por defecto
        total += salarioMinimo / 2;
      } else {
        // Para empleados temporales: horas * valor hora
        total += horasOrdinarias * valorHoraBase;
      }

      // Calcular recargos y horas extras
      const recargosConfig = {
        recargo_nocturno: 0.35,
        recargo_diurno_dominical: 0.75,
        recargo_nocturno_dominical: 1.1,
        hora_extra_diurna: 0.25,
        hora_extra_nocturna: 0.75,
        hora_diurna_dominical_o_festivo: 0.8,
        hora_extra_diurna_dominical_o_festivo: 1.1,
        hora_nocturna_dominical_o_festivo: 1.05,
        hora_extra_nocturna_dominical_o_festivo: 1.85,
      };

      for (const [concepto, porcentaje] of Object.entries(recargosConfig)) {
        const horas = horasDict[concepto] || 0;
        if (horas > 0) {
          const valorRecargo = valorHoraBase * porcentaje;
          const valorTotal = valorHoraBase + valorRecargo;
          const subtotal = horas * valorTotal;
          total += subtotal;
        }
      }

      // Calcular auxilio de transporte (solo para fijos)
      let auxilio = 0;
      if (empleado.tipo === 'FIJO' && (empleado.salario || 0) <= 3000000 && horasOrdinarias > 0) {
        auxilio = 100000; // Valor por defecto
      }

      // Calcular deducciones (solo para fijos)
      let salud = 0;
      let pension = 0;
      if (empleado.tipo === 'FIJO') {
        salud = total * 0.04; // 4% salud
        pension = total * 0.04; // 4% pensión
      }

      // Calcular deuda si existe
      const deuda = horasEmpleado.valor_deuda || 0;

      // Calcular salario neto
      const salarioNeto = total + auxilio - salud - pension - deuda;

      return Math.max(0, Math.round(salarioNeto));
    } catch (error) {
      console.error('❌ Error calculando salario neto para', empleado.nombre, error);
      // En caso de error, retornar el salario base como fallback
      return empleado.salario || 0;
    }
  }

  obtenerQuincenaActual() {
    try {
      const ahora = new Date();
      const dia = ahora.getDate();
      const mes = ahora.getMonth() + 1;
      const año = ahora.getFullYear();

      // Determinar quincena basándose en el día del mes
      if (dia <= 15) {
        return `15_${mes.toString().padStart(2, '0')}_${año}`;
      } else {
        return `31_${mes.toString().padStart(2, '0')}_${año}`;
      }
    } catch (error) {
      console.error('❌ Error obteniendo quincena actual:', error);
      return '15_01_2025'; // Fallback
    }
  }

  showModal(title, content) {
    try {
      const modal = document.createElement('div');
      modal.className = 'axyra-modal';
      modal.innerHTML = `
                <div class="axyra-modal-content">
                    <div class="axyra-modal-header">
                        <h3>${title}</h3>
                        <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="axyra-modal-body">
                        ${content}
                    </div>
                </div>
            `;
      document.body.appendChild(modal);
    } catch (error) {
      console.error('❌ Error mostrando modal:', error);
    }
  }

  showLoginMessage() {
    try {
      const container = document.querySelector('.axyra-section');
      if (container) {
        container.innerHTML = `
                    <div class="axyra-login-message">
                        <h2>Inicia sesión para continuar</h2>
                        <p>Necesitas autenticarte para acceder al dashboard</p>
                        <a href="/login.html" class="axyra-btn axyra-btn-primary">Ir al Login</a>
                    </div>
                `;
      }
    } catch (error) {
      console.error('❌ Error mostrando mensaje de login:', error);
    }
  }

  showErrorMessage(message) {
    console.error(message);
    // Aquí podrías mostrar una notificación visual
  }

  setupModals() {
    try {
      // Configurar modales para estadísticas
      this.modals = {
        empleados: document.getElementById('empleadosModal'),
        horas: document.getElementById('horasModal'),
        nominas: document.getElementById('nominasModal'),
        salarios: document.getElementById('salariosModal'),
        cuadres: document.getElementById('cuadresModal'),
        inventario: document.getElementById('inventarioModal'),
      };

      // Configurar botones de cierre
      Object.values(this.modals).forEach((modal) => {
        if (modal) {
          const closeBtn = modal.querySelector('.axyra-modal-close');
          if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(modal));
          }
        }
      });

      console.log('✅ Modales configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando modales:', error);
    }
  }

  setupEventListeners() {
    try {
      // Event listeners para tarjetas de estadísticas
      const statCards = document.querySelectorAll('.axyra-stat-card');
      statCards.forEach((card) => {
        card.addEventListener('click', (e) => {
          const modalId = card.getAttribute('data-modal');
          if (modalId && this.modals[modalId.replace('Modal', '')]) {
            this.openModal(modalId);
          }
        });
      });

      // Event listeners para búsqueda global
      const searchInput = document.getElementById('globalSearchInput');
      const searchBtn = document.getElementById('searchBtn');
      const clearSearchBtn = document.getElementById('clearSearchBtn');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          if (window.axyraGlobalSearch) {
            window.axyraGlobalSearch.handleSearchInput(e.target.value);
          }
        });

        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            if (window.axyraGlobalSearch) {
              window.axyraGlobalSearch.performSearch();
            }
          }
        });
      }

      if (searchBtn) {
        searchBtn.addEventListener('click', () => {
          if (window.axyraGlobalSearch) {
            window.axyraGlobalSearch.performSearch();
          }
        });
      }

      if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
          if (window.axyraGlobalSearch) {
            window.axyraGlobalSearch.clearSearch();
          }
        });
      }

      console.log('✅ Event listeners configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando event listeners:', error);
    }
  }

  openModal(modalId) {
    try {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
        this.loadModalContent(modalId);
        document.body.style.overflow = 'hidden';
      }
    } catch (error) {
      console.error('❌ Error abriendo modal:', error);
    }
  }

  closeModal(modal) {
    try {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    } catch (error) {
      console.error('❌ Error cerrando modal:', error);
    }
  }

  loadModalContent(modalId) {
    try {
      switch (modalId) {
        case 'empleadosModal':
          this.loadEmpleadosModalContent();
          break;
        case 'horasModal':
          this.loadHorasModalContent();
          break;
        case 'nominasModal':
          this.loadNominasModalContent();
          break;
        case 'salariosModal':
          this.loadSalariosModalContent();
          break;
        case 'cuadresModal':
          this.loadCuadresModalContent();
          break;
        case 'inventarioModal':
          this.loadInventarioModalContent();
          break;
      }
    } catch (error) {
      console.error('❌ Error cargando contenido del modal:', error);
    }
  }

  loadEmpleadosModalContent() {
    try {
      const modalBody = document.getElementById('empleadosModalBody');
      if (!modalBody) return;

      let html = '<div class="axyra-modal-stats">';
      html += `<h4>Total: ${this.empleados.length} empleados</h4>`;

      // Agrupar por departamento
      const porDepartamento = {};
      this.empleados.forEach((emp) => {
        const dept = emp.departamento || 'Sin departamento';
        if (!porDepartamento[dept]) porDepartamento[dept] = [];
        porDepartamento[dept].push(emp);
      });

      Object.entries(porDepartamento).forEach(([dept, emps]) => {
        html += `<div class="axyra-dept-group">`;
        html += `<h5>${dept} (${emps.length})</h5>`;
        html += `<div class="axyra-emp-list">`;
        emps.forEach((emp) => {
          html += `<div class="axyra-emp-item">`;
          html += `<span class="axyra-emp-name">${emp.nombre}</span>`;
          html += `<span class="axyra-emp-cedula">${emp.cedula}</span>`;
          html += `<span class="axyra-emp-tipo">${emp.tipo}</span>`;
          html += `</div>`;
        });
        html += `</div>`;
        html += `</div>`;
      });

      html += '</div>';
      modalBody.innerHTML = html;
    } catch (error) {
      console.error('❌ Error cargando modal de empleados:', error);
    }
  }

  loadHorasModalContent() {
    try {
      const modalBody = document.getElementById('horasModalBody');
      if (!modalBody) return;

      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();

      const horasMes = this.horas.filter((h) => {
        const fecha = new Date(h.fecha);
        return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
      });

      let html = '<div class="axyra-modal-stats">';
      html += `<h4>Horas del mes: ${mesActual + 1}/${añoActual}</h4>`;
      html += `<p>Total horas registradas: ${horasMes.reduce((sum, h) => sum + (h.horas || 0), 0).toFixed(1)}</p>`;

      // Agrupar por empleado
      const porEmpleado = {};
      horasMes.forEach((h) => {
        const emp = this.empleados.find((e) => e.cedula === h.cedula);
        if (emp) {
          if (!porEmpleado[emp.nombre]) porEmpleado[emp.nombre] = 0;
          porEmpleado[emp.nombre] += h.horas || 0;
        }
      });

      Object.entries(porEmpleado).forEach(([nombre, horas]) => {
        html += `<div class="axyra-emp-hours">`;
        html += `<span class="axyra-emp-name">${emp.nombre}</span>`;
        html += `<span class="axyra-emp-hours-value">${horas.toFixed(1)}h</span>`;
        html += `</div>`;
      });

      html += '</div>';
      modalBody.innerHTML = html;
    } catch (error) {
      console.error('❌ Error cargando modal de horas:', error);
    }
  }

  loadNominasModalContent() {
    try {
      const modalBody = document.getElementById('nominasModalBody');
      if (!modalBody) return;

      const quincenaActual = this.obtenerQuincenaActual();
      const nominasQuincena = this.nominas.filter((n) => n.quincena === quincenaActual);

      let html = '<div class="axyra-modal-stats">';
      html += `<h4>Nóminas de la quincena ${quincenaActual}</h4>`;
      html += `<p>Total generadas: ${nominasQuincena.length}</p>`;

      nominasQuincena.forEach((nomina) => {
        const emp = this.empleados.find((e) => e.cedula === nomina.cedula);
        if (emp) {
          html += `<div class="axyra-emp-item">`;
          html += `<span class="axyra-emp-name">${emp.nombre}</span>`;
          html += `<span class="axyra-emp-fecha">${nomina.fecha}</span>`;
          html += `<span class="axyra-emp-total">$${nomina.total?.toLocaleString() || '0'}</span>`;
          html += `</div>`;
        }
      });

      html += '</div>';
      modalBody.innerHTML = html;
    } catch (error) {
      console.error('❌ Error cargando modal de nóminas:', error);
    }
  }

  loadSalariosModalContent() {
    try {
      const modalBody = document.getElementById('salariosModalBody');
      if (!modalBody) return;

      let html = '<div class="axyra-top">';
      html += '<h4>Detalle de Salarios Netos</h4>';

      let totalNeto = 0;
      this.empleados.forEach((emp) => {
        const salarioNeto = this.calcularSalarioNeto(emp);
        totalNeto += salarioNeto;

        html += `<div class="axyra-salary-item">`;
        html += `<span class="axyra-salary-emp">${emp.nombre}</span>`;
        html += `<span class="axyra-salary-base">$${emp.salario?.toLocaleString() || '0'}</span>`;
        html += `<span class="axyra-salary-net">$${salarioNeto.toLocaleString()}</span>`;
        html += `</div>`;
      });

      html += `<div class="axyra-salary-total">`;
      html += `<strong>Total Neto: $${totalNeto.toLocaleString()}</strong>`;
      html += `</div>`;
      html += '</div>';
      modalBody.innerHTML = html;
    } catch (error) {
      console.error('❌ Error cargando modal de salarios:', error);
    }
  }

  loadCuadresModalContent() {
    try {
      const modalBody = document.getElementById('cuadresModalBody');
      if (!modalBody) return;

      let html = '<div class="axyra-modal-stats">';
      html += '<h4>Cuadres de Caja</h4>';
      html += `<p>Total realizados: ${this.cuadres.length}</p>`;

      this.cuadres.forEach((cuadre) => {
        html += `<div class="axyra-cuadre-item">`;
        html += `<span class="axyra-cuadre-fecha">${cuadre.fecha}</span>`;
        html += `<span class="axyra-cuadre-total">$${cuadre.total?.toLocaleString() || '0'}</span>`;
        html += `<span class="axyra-cuadre-estado">${cuadre.estado || 'Pendiente'}</span>`;
        html += `</div>`;
      });

      html += '</div>';
      modalBody.innerHTML = html;
    } catch (error) {
      console.error('❌ Error cargando modal de cuadres:', error);
    }
  }

  loadInventarioModalContent() {
    try {
      const modalBody = document.getElementById('inventarioModalBody');
      if (!modalBody) return;

      // Cargar datos de inventario desde localStorage
      const inventario = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');

      let html = '<div class="axyra-modal-stats">';
      html += '<h4>Inventario</h4>';
      html += `<p>Total items: ${inventario.length}</p>`;

      inventario.forEach((item) => {
        html += `<div class="axyra-emp-item">`;
        html += `<span class="axyra-emp-name">${item.nombre}</span>`;
        html += `<span class="axyra-emp-cedula">${item.cantidad}</span>`;
        html += `<span class="axyra-emp-tipo">$${item.precio?.toLocaleString() || '0'}</span>`;
        html += `</div>`;
      });

      html += '</div>';
      modalBody.innerHTML = html;
    } catch (error) {
      console.error('❌ Error cargando modal de inventario:', error);
    }
  }

  // Limpiar recursos al destruir
  destroy() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    if (this.charts) {
      Object.values(this.charts).forEach((chart) => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    }
  }
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
  console.log('🚀 Dashboard cargado, inicializando...');
  try {
    window.axyraDashboard = new AxyraDashboard();
  } catch (error) {
    console.error('❌ Error inicializando dashboard:', error);
  }
});

// Funciones globales para los botones del HTML
window.mostrarDetalleEmpleados = function () {
  if (window.axyraDashboard) {
    window.axyraDashboard.mostrarDetalleEmpleados();
  }
};

window.mostrarDetalleHoras = function () {
  if (window.axyraDashboard) {
    window.axyraDashboard.mostrarDetalleHoras();
  }
};

window.mostrarDetalleComprobantes = function () {
  if (window.axyraDashboard) {
    window.axyraDashboard.mostrarDetalleComprobantes();
  }
};

window.mostrarDetalleSalarios = function () {
  if (window.axyraDashboard) {
    window.axyraDashboard.mostrarDetalleSalarios();
  }
};

// Funciones para el sistema de seguridad
window.resetSessionTimeout = function () {
  try {
    if (window.axyraSessionTimeout) {
      window.axyraSessionTimeout.reset();
      console.log('✅ Sesión renovada');
    }
  } catch (error) {
    console.error('❌ Error renovando sesión:', error);
  }
};

// Limpiar recursos al cerrar la página
window.addEventListener('beforeunload', function () {
  if (window.axyraDashboard) {
    window.axyraDashboard.destroy();
  }
});
