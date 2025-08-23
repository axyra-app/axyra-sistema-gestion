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
            if (await this.checkAuth()) {
                await this.loadDashboardData();
                this.setupRealTimeUpdates();
                this.startAutoRefresh();
                console.log('✅ Dashboard inicializado correctamente');
            } else {
                this.showLoginMessage();
            }
        } catch (error) {
            console.error('❌ Error inicializando dashboard:', error);
            this.showErrorMessage('Error inicializando el dashboard');
        }
    }

    async checkAuth() {
        try {
            // Verificar si hay usuario en localStorage
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                console.log('✅ Usuario autenticado:', user.username);
                return true;
            }

            // Verificar Firebase si está disponible
            if (typeof firebase !== 'undefined' && firebase.auth) {
                const user = firebase.auth().currentUser;
                if (user) {
                    console.log('✅ Usuario Firebase autenticado:', user.email);
                    return true;
                }
            }

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
            this.updateSecurityStatus();
            
            console.log('✅ Dashboard cargado correctamente');
        } catch (error) {
            console.error('❌ Error cargando dashboard:', error);
            this.showErrorMessage('Error cargando datos del dashboard');
        }
    }

    async loadEmpleados() {
        try {
            // Cargar desde localStorage primero
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
                        this.empleados = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
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
            const horasData = localStorage.getItem('axyra_horas');
            if (horasData) {
                this.horas = JSON.parse(horasData);
            }

            if (typeof firebase !== 'undefined' && firebase.firestore) {
                try {
                    const db = firebase.firestore();
                    const snapshot = await db.collection('horas_trabajadas').get();
                    if (!snapshot.empty) {
                        this.horas = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        localStorage.setItem('axyra_horas', JSON.stringify(this.horas));
                    }
                } catch (firebaseError) {
                    console.warn('⚠️ Error cargando horas desde Firebase:', firebaseError);
                }
            }

            console.log(`✅ ${this.horas.length} registros de horas cargados`);
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
                        this.nominas = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
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
                        this.cuadres = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
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
                actividades.push({
                    tipo: 'empleado',
                    accion: 'Empleado registrado',
                    detalle: ultimoEmpleado.nombre || 'N/A',
                    timestamp: ultimoEmpleado.fecha_registro || now.toISOString(),
                    icono: 'fas fa-user-plus'
                });
            }

            // Actividad de horas
            if (this.horas.length > 0) {
                const ultimaHora = this.horas[this.horas.length - 1];
                const empleado = this.empleados.find(e => e.id === ultimaHora.empleado_id);
                if (empleado) {
                    actividades.push({
                        tipo: 'hora',
                        accion: 'Horas registradas',
                        detalle: `${empleado.nombre}: ${ultimaHora.total_horas || 0} horas`,
                        timestamp: ultimaHora.fecha || now.toISOString(),
                        icono: 'fas fa-clock'
                    });
                }
            }

            // Actividad de nóminas
            if (this.nominas.length > 0) {
                const ultimaNomina = this.nominas[this.nominas.length - 1];
                actividades.push({
                    tipo: 'nomina',
                    accion: 'Nómina generada',
                    detalle: `Quincena: ${ultimaNomina.quincena || 'N/A'}`,
                    timestamp: ultimaNomina.fecha_generacion || now.toISOString(),
                    icono: 'fas fa-file-invoice-dollar'
                });
            }

            // Actividad de cuadres
            if (this.cuadres.length > 0) {
                const ultimoCuadre = this.cuadres[this.cuadres.length - 1];
                actividades.push({
                    tipo: 'cuadre',
                    accion: 'Cuadre de caja',
                    detalle: `Total: $${ultimoCuadre.total || 0}`,
                    timestamp: ultimoCuadre.fecha || now.toISOString(),
                    icono: 'fas fa-calculator'
                });
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

            // Empleados activos
            const empleadosActivos = this.empleados.filter(e => e.estado === 'ACTIVO').length;
            const empleadosActivosElement = document.getElementById('empleadosActivos');
            if (empleadosActivosElement) {
                empleadosActivosElement.textContent = empleadosActivos;
            }

            // Horas trabajadas
            const totalHoras = this.horas.reduce((sum, h) => sum + (h.total_horas || 0), 0);
            const horasTrabajadasElement = document.getElementById('horasTrabajadas');
            if (horasTrabajadasElement) {
                horasTrabajadasElement.textContent = totalHoras.toFixed(1);
            }

            // Horas del mes
            const mesActual = new Date().getMonth();
            const horasMes = this.horas
                .filter(h => {
                    try {
                        return new Date(h.fecha).getMonth() === mesActual;
                    } catch (e) {
                        return false;
                    }
                })
                .reduce((sum, h) => sum + (h.total_horas || 0), 0);
            const horasMesElement = document.getElementById('horasMes');
            if (horasMesElement) {
                horasMesElement.textContent = horasMes.toFixed(1);
            }

            // Nóminas generadas
            const nominasGeneradas = this.nominas.filter(n => n.estado === 'Generada').length;
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

            // Departamentos
            const departamentos = [...new Set(this.empleados.map(e => e.departamento).filter(Boolean))];
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
            this.empleados.forEach(emp => {
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
                    datasets: [{
                        data: Object.values(departamentos),
                        backgroundColor: [
                            '#667eea', '#764ba2', '#f093fb', '#f5576c',
                            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
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
            this.horas.forEach(hora => {
                try {
                    const fecha = new Date(hora.fecha);
                    const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
                    horasPorMes[mes] = (horasPorMes[mes] || 0) + (hora.total_horas || 0);
                } catch (e) {
                    console.warn('⚠️ Fecha inválida en horas:', hora.fecha);
                }
            });

            const meses = Object.keys(horasPorMes).sort();
            const datos = meses.map(mes => horasPorMes[mes]);

            if (this.charts.hoursTrend) {
                this.charts.hoursTrend.destroy();
            }

            this.charts.hoursTrend = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: meses.map(mes => {
                        const [year, month] = mes.split('-');
                        return `${month}/${year}`;
                    }),
                    datasets: [{
                        label: 'Horas Trabajadas',
                        data: datos,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
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
                'Más de $3M': 0
            };

            this.empleados.forEach(emp => {
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
                    datasets: [{
                        label: 'Empleados',
                        data: Object.values(rangosSalario),
                        backgroundColor: '#667eea'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
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
            const empleadosActivos = this.empleados.filter(e => e.estado === 'ACTIVO').length;
            const totalHoras = this.horas.reduce((sum, h) => sum + (h.total_horas || 0), 0);
            const promedioHoras = totalEmpleados > 0 ? totalHoras / totalEmpleados : 0;

            if (this.charts.productivity) {
                this.charts.productivity.destroy();
            }

            this.charts.productivity = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: ['Empleados Activos', 'Horas Promedio', 'Eficiencia', 'Ocupación'],
                    datasets: [{
                        label: 'Métricas',
                        data: [
                            totalEmpleados > 0 ? (empleadosActivos / totalEmpleados) * 100 : 0,
                            Math.min((promedioHoras / 160) * 100, 100), // 160 horas mensuales estándar
                            85, // Eficiencia simulada
                            90  // Ocupación simulada
                        ],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.2)',
                        pointBackgroundColor: '#667eea'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
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
            // Intentar obtener usuario desde múltiples fuentes
            if (window.axyraIsolatedAuth && window.axyraIsolatedAuth.isUserAuthenticated()) {
                return window.axyraIsolatedAuth.getCurrentUser();
            }
            
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                return JSON.parse(userData);
            }
            
            const firebaseUser = localStorage.getItem('axyra_firebase_user');
            if (firebaseUser) {
                return JSON.parse(firebaseUser);
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
                hour12: true
            });
            
            welcomeTimeElement.textContent = `${greeting} - ${timeString}`;
            
        } catch (error) {
            console.error('❌ Error actualizando hora de bienvenida:', error);
        }
    }

    updateSecurityStatus() {
        try {
            // Actualizar estado del 2FA
            this.update2FAStatus();
            
            // Actualizar estado del responsive design
            this.updateResponsiveStatus();
            
            // Actualizar estado de la sesión
            this.updateSessionStatus();
        } catch (error) {
            console.error('❌ Error actualizando estado de seguridad:', error);
        }
    }

    update2FAStatus() {
        try {
            const statusElement = document.getElementById('2faStatus');
            if (!statusElement) return;

            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                const isEnabled = user.twoFactorEnabled || false;
                
                if (isEnabled) {
                    statusElement.innerHTML = `
                        <span class="axyra-status-enabled">
                            <i class="fas fa-shield-check"></i> 2FA Activado
                        </span>
                    `;
                } else {
                    statusElement.innerHTML = `
                        <span class="axyra-status-disabled">
                            <i class="fas fa-shield-alt"></i> 2FA Desactivado
                        </span>
                    `;
                }
            }
        } catch (error) {
            console.error('❌ Error actualizando estado 2FA:', error);
        }
    }

    updateResponsiveStatus() {
        try {
            const statusElement = document.getElementById('responsiveStatus');
            if (!statusElement) return;

            if (window.axyraResponsive) {
                const breakpoint = window.axyraResponsive.getCurrentBreakpoint();
                const deviceType = this.getDeviceType(breakpoint);
                statusElement.textContent = deviceType;
            } else {
                statusElement.textContent = 'No disponible';
            }
        } catch (error) {
            console.error('❌ Error actualizando estado responsive:', error);
        }
    }

    getDeviceType(breakpoint) {
        switch (breakpoint) {
            case 'mobile':
                return '📱 Móvil';
            case 'tablet':
                return '📱 Tablet';
            case 'desktop':
                return '💻 Desktop';
            default:
                return '💻 Desktop';
        }
    }

    updateSessionStatus() {
        try {
            const timeElement = document.getElementById('sessionTimeRemaining');
            if (!timeElement) return;

            // Simular tiempo de sesión restante
            const sessionTime = 30; // minutos
            timeElement.textContent = `${sessionTime}:00`;
        } catch (error) {
            console.error('❌ Error actualizando estado de sesión:', error);
        }
    }

    updateActividadReciente() {
        try {
            const container = document.getElementById('actividadReciente');
            if (!container) return;

            container.innerHTML = this.actividadReciente.map(actividad => `
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
            `).join('');
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
                    ${this.empleados.map(emp => `
                        <div class="axyra-empleado-item">
                            <div class="axyra-empleado-info">
                                <strong>${emp.nombre || 'N/A'}</strong>
                                <span>Cédula: ${emp.cedula || 'N/A'}</span>
                                <span>Departamento: ${emp.departamento || 'Sin asignar'}</span>
                                <span>Estado: ${emp.estado || 'ACTIVO'}</span>
                            </div>
                        </div>
                    `).join('')}
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
                    ${this.horas.slice(-10).map(hora => {
                        const empleado = this.empleados.find(e => e.id === hora.empleado_id);
                        return `
                            <div class="axyra-hora-item">
                                <div class="axyra-hora-info">
                                    <strong>${empleado ? empleado.nombre : 'Empleado no encontrado'}</strong>
                                    <span>Fecha: ${hora.fecha || 'N/A'}</span>
                                    <span>Horas: ${hora.total_horas || 0}</span>
                                </div>
                            </div>
                        `;
                    }).join('')}
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
                    ${this.nominas.map(nomina => `
                        <div class="axyra-comprobante-item">
                            <div class="axyra-comprobante-info">
                                <strong>Quincena: ${nomina.quincena || 'N/A'}</strong>
                                <span>Estado: ${nomina.estado || 'Pendiente'}</span>
                                <span>Fecha: ${nomina.fecha_generacion || 'N/A'}</span>
                            </div>
                        </div>
                    `).join('')}
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
            const empleadosConSalarioNeto = this.empleados.map(emp => {
                const salarioNeto = this.calcularSalarioNeto(emp);
                return { ...emp, salarioNeto };
            });
            
            const totalSalariosNetos = empleadosConSalarioNeto.reduce((sum, e) => sum + (e.salarioNeto || 0), 0);
            
            return `
                <div class="axyra-salarios-lista">
                    ${empleadosConSalarioNeto.map(emp => `
                        <div class="axyra-salario-item">
                            <div class="axyra-salario-info">
                                <strong>${emp.nombre || 'N/A'}</strong>
                                <span>Salario Neto: $${(emp.salarioNeto || 0).toLocaleString()}</span>
                                <span>Salario Base: $${(emp.salario || 0).toLocaleString()}</span>
                                <span>Departamento: ${emp.departamento || 'Sin asignar'}</span>
                            </div>
                        </div>
                    `).join('')}
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
            const horasEmpleado = this.horas.find(h => 
                h.empleado_id === empleado.id && h.quincena === quincenaActual
            );
            
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
                hora_extra_nocturna_dominical_o_festivo: horasEmpleado.hora_extra_nocturna_dominical_o_festivo || 0
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
                recargo_nocturno_dominical: 1.10,
                hora_extra_diurna: 0.25,
                hora_extra_nocturna: 0.75,
                hora_diurna_dominical_o_festivo: 0.80,
                hora_extra_diurna_dominical_o_festivo: 1.10,
                hora_nocturna_dominical_o_festivo: 1.05,
                hora_extra_nocturna_dominical_o_festivo: 1.85
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
                        <a href="../../login.html" class="axyra-btn axyra-btn-primary">Ir al Login</a>
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

    // Limpiar recursos al destruir
    destroy() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        if (this.charts) {
            Object.values(this.charts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
        }
    }
}

// Inicializar dashboard cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Dashboard cargado, inicializando...');
    try {
        window.axyraDashboard = new AxyraDashboard();
    } catch (error) {
        console.error('❌ Error inicializando dashboard:', error);
    }
});

// Funciones globales para los botones del HTML
window.mostrarDetalleEmpleados = function() {
    if (window.axyraDashboard) {
        window.axyraDashboard.mostrarDetalleEmpleados();
    }
};

window.mostrarDetalleHoras = function() {
    if (window.axyraDashboard) {
        window.axyraDashboard.mostrarDetalleHoras();
    }
};

window.mostrarDetalleComprobantes = function() {
    if (window.axyraDashboard) {
        window.axyraDashboard.mostrarDetalleComprobantes();
    }
};

window.mostrarDetalleSalarios = function() {
    if (window.axyraDashboard) {
        window.axyraDashboard.mostrarDetalleSalarios();
    }
};

// Funciones para el sistema de seguridad
window.resetSessionTimeout = function() {
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
window.addEventListener('beforeunload', function() {
    if (window.axyraDashboard) {
        window.axyraDashboard.destroy();
    }
});
