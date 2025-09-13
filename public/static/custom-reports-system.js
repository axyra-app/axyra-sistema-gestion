/**
 * AXYRA - Sistema de Reportes Personalizados
 * Permite generar reportes personalizados y análisis detallados
 */

class AxyraCustomReports {
    constructor() {
        this.reportTemplates = {};
        this.currentReport = null;
        this.reportData = {};
        this.charts = {};
        this.init();
    }

    init() {
        console.log('📊 Inicializando Sistema de Reportes Personalizados AXYRA...');
        
        try {
            this.loadReportTemplates();
            this.setupEventListeners();
            console.log('✅ Sistema de reportes personalizados inicializado');
        } catch (error) {
            console.error('❌ Error inicializando reportes personalizados:', error);
        }
    }

    loadReportTemplates() {
        this.reportTemplates = {
            empleados_departamento: {
                name: 'Empleados por Departamento',
                description: 'Distribución de empleados por área de trabajo',
                icon: 'fas fa-users',
                category: 'empleados',
                fields: ['departamento', 'cargo', 'salario'],
                chartType: 'pie',
                exportFormats: ['pdf', 'excel', 'csv']
            },
            horas_mensuales: {
                name: 'Horas Mensuales',
                description: 'Tendencia de horas trabajadas por mes',
                icon: 'fas fa-clock',
                category: 'horas',
                fields: ['fecha', 'empleado', 'total_horas'],
                chartType: 'line',
                exportFormats: ['pdf', 'excel', 'csv']
            },
            salarios_rangos: {
                name: 'Salarios por Rangos',
                description: 'Distribución salarial de empleados',
                icon: 'fas fa-dollar-sign',
                category: 'empleados',
                fields: ['salario', 'departamento', 'cargo'],
                chartType: 'bar',
                exportFormats: ['pdf', 'excel', 'csv']
            },
            productividad_general: {
                name: 'Productividad General',
                description: 'Métricas generales de eficiencia',
                icon: 'fas fa-chart-line',
                category: 'general',
                fields: ['empleados', 'horas', 'nominas'],
                chartType: 'doughnut',
                exportFormats: ['pdf', 'excel', 'csv']
            },
            nominas_quincenales: {
                name: 'Nóminas Quincenales',
                description: 'Análisis de nóminas generadas por quincena',
                icon: 'fas fa-file-invoice-dollar',
                category: 'nominas',
                fields: ['fecha', 'monto', 'empleado'],
                chartType: 'bar',
                exportFormats: ['pdf', 'excel', 'csv']
            },
            cuadre_caja_mensual: {
                name: 'Cuadre de Caja Mensual',
                description: 'Resumen mensual de ingresos y egresos',
                icon: 'fas fa-calculator',
                category: 'cuadres',
                fields: ['fecha', 'total', 'area'],
                chartType: 'line',
                exportFormats: ['pdf', 'excel', 'csv']
            }
        };
    }

    setupEventListeners() {
        // Escuchar clicks en elementos de reportes
        document.addEventListener('click', (e) => {
            if (e.target.closest('.axyra-report-item')) {
                const reportItem = e.target.closest('.axyra-report-item');
                const reportType = reportItem.dataset.reportType || 
                    reportItem.onclick?.toString().match(/generateQuickReport\('([^']+)'\)/)?.[1];
                
                if (reportType) {
                    this.generateQuickReport(reportType);
                }
            }
        });
    }

    async generateQuickReport(reportType) {
        try {
            console.log(`📊 Generando reporte rápido: ${reportType}`);
            
            const template = this.reportTemplates[reportType];
            if (!template) {
                this.showMessage('Tipo de reporte no reconocido', 'error');
                return;
            }

            // Mostrar modal de configuración del reporte
            this.showReportConfigModal(template, reportType);
            
        } catch (error) {
            console.error('❌ Error generando reporte rápido:', error);
            this.showMessage('Error al generar el reporte', 'error');
        }
    }

    showReportConfigModal(template, reportType) {
        const modalHTML = `
            <div id="reportConfigModal" class="axyra-modal">
                <div class="axyra-modal-content axyra-report-modal">
                    <div class="axyra-modal-header">
                        <h3><i class="${template.icon}"></i> ${template.name}</h3>
                        <button class="axyra-modal-close" onclick="axyraCustomReports.closeReportConfigModal()">&times;</button>
                    </div>
                    <div class="axyra-modal-body">
                        <div class="axyra-report-description">
                            <p>${template.description}</p>
                        </div>
                        
                        <div class="axyra-report-filters">
                            <h4>Filtros del Reporte</h4>
                            <div class="axyra-form-group">
                                <label>Rango de Fechas:</label>
                                <div class="axyra-date-range">
                                    <input type="date" id="reportStartDate" class="axyra-form-input" />
                                    <span>hasta</span>
                                    <input type="date" id="reportEndDate" class="axyra-form-input" />
                                </div>
                            </div>
                            
                            <div class="axyra-form-group">
                                <label>Departamento:</label>
                                <select id="reportDepartment" class="axyra-form-input">
                                    <option value="">Todos los departamentos</option>
                                    <option value="Administrativo">Administrativo</option>
                                    <option value="Operativo">Operativo</option>
                                    <option value="Técnico">Técnico</option>
                                    <option value="Ventas">Ventas</option>
                                </select>
                            </div>
                            
                            <div class="axyra-form-group">
                                <label>Formato de Exportación:</label>
                                <select id="reportExportFormat" class="axyra-form-input">
                                    <option value="pdf">PDF</option>
                                    <option value="excel">Excel</option>
                                    <option value="csv">CSV</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="axyra-report-preview" id="reportPreview">
                            <!-- Vista previa del reporte se cargará aquí -->
                        </div>
                    </div>
                    <div class="axyra-modal-footer">
                        <button class="axyra-btn axyra-btn-secondary" onclick="axyraCustomReports.closeReportConfigModal()">
                            Cancelar
                        </button>
                        <button class="axyra-btn axyra-btn-primary" onclick="axyraCustomReports.generateReport('${reportType}')">
                            <i class="fas fa-file-alt"></i> Generar Reporte
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Cerrar modales existentes
        this.closeAllModals();
        
        // Agregar modal al DOM
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Configurar fechas por defecto
        this.setDefaultDates();
        
        // Generar vista previa
        this.generateReportPreview(reportType);
    }

    setDefaultDates() {
        const startDate = document.getElementById('reportStartDate');
        const endDate = document.getElementById('reportEndDate');
        
        if (startDate && endDate) {
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            
            startDate.value = firstDay.toISOString().split('T')[0];
            endDate.value = lastDay.toISOString().split('T')[0];
        }
    }

    async generateReportPreview(reportType) {
        try {
            const template = this.reportTemplates[reportType];
            const previewContainer = document.getElementById('reportPreview');
            
            if (!previewContainer) return;
            
            // Mostrar indicador de carga
            previewContainer.innerHTML = `
                <div class="axyra-loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Generando vista previa...</p>
                </div>
            `;
            
            // Obtener datos para la vista previa
            const data = await this.getReportData(reportType);
            
            // Generar vista previa según el tipo de reporte
            let previewHTML = '';
            
            switch (reportType) {
                case 'empleados_departamento':
                    previewHTML = this.generateEmpleadosPreview(data);
                    break;
                case 'horas_mensuales':
                    previewHTML = this.generateHorasPreview(data);
                    break;
                case 'salarios_rangos':
                    previewHTML = this.generateSalariosPreview(data);
                    break;
                case 'productividad_general':
                    previewHTML = this.generateProductividadPreview(data);
                    break;
                case 'nominas_quincenales':
                    previewHTML = this.generateNominasPreview(data);
                    break;
                case 'cuadre_caja_mensual':
                    previewHTML = this.generateCuadrePreview(data);
                    break;
                default:
                    previewHTML = '<p>Vista previa no disponible para este tipo de reporte</p>';
            }
            
            previewContainer.innerHTML = previewHTML;
            
            // Generar gráfico si es necesario
            if (template.chartType) {
                this.generateChart(reportType, data, template.chartType);
            }
            
        } catch (error) {
            console.error('❌ Error generando vista previa:', error);
            const previewContainer = document.getElementById('reportPreview');
            if (previewContainer) {
                previewContainer.innerHTML = `
                    <div class="axyra-error">
                        <i class="fas fa-exclamation-triangle"></i>
                        <p>Error al generar vista previa</p>
                    </div>
                `;
            }
        }
    }

    async getReportData(reportType) {
        try {
            const startDate = document.getElementById('reportStartDate')?.value;
            const endDate = document.getElementById('reportEndDate')?.value;
            const department = document.getElementById('reportDepartment')?.value;
            
            let data = {};
            
            switch (reportType) {
                case 'empleados_departamento':
                    data = this.getEmpleadosData(department);
                    break;
                case 'horas_mensuales':
                    data = this.getHorasData(startDate, endDate, department);
                    break;
                case 'salarios_rangos':
                    data = this.getSalariosData(department);
                    break;
                case 'productividad_general':
                    data = this.getProductividadData(startDate, endDate);
                    break;
                case 'nominas_quincenales':
                    data = this.getNominasData(startDate, endDate);
                    break;
                case 'cuadre_caja_mensual':
                    data = this.getCuadreData(startDate, endDate);
                    break;
            }
            
            return data;
        } catch (error) {
            console.error('❌ Error obteniendo datos del reporte:', error);
            return {};
        }
    }

    getEmpleadosData(department) {
        try {
            const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
            
            if (department) {
                return empleados.filter(emp => emp.departamento === department);
            }
            
            return empleados;
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de empleados:', error);
            return [];
        }
    }

    getHorasData(startDate, endDate, department) {
        try {
            const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
            let filteredHoras = horas;
            
            // Filtrar por fecha si se especifica
            if (startDate && endDate) {
                filteredHoras = horas.filter(hr => {
                    const hrDate = new Date(hr.fecha);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return hrDate >= start && hrDate <= end;
                });
            }
            
            // Filtrar por departamento si se especifica
            if (department) {
                const empleados = this.getEmpleadosData(department);
                const empleadosIds = empleados.map(emp => emp.cedula);
                filteredHoras = filteredHoras.filter(hr => 
                    empleadosIds.includes(hr.empleado)
                );
            }
            
            return filteredHoras;
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de horas:', error);
            return [];
        }
    }

    getSalariosData(department) {
        try {
            const empleados = this.getEmpleadosData(department);
            return empleados.map(emp => ({
                nombre: emp.nombre,
                salario: parseFloat(emp.salario) || 0,
                departamento: emp.departamento,
                cargo: emp.cargo
            }));
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de salarios:', error);
            return [];
        }
    }

    getProductividadData(startDate, endDate) {
        try {
            const empleados = this.getEmpleadosData();
            const horas = this.getHorasData(startDate, endDate);
            const nominas = this.getNominasData(startDate, endDate);
            
            return {
                totalEmpleados: empleados.length,
                totalHoras: horas.reduce((total, hr) => {
                    return total + (parseFloat(hr.horasOrdinarias) || 0) + 
                           (parseFloat(hr.horasNocturnas) || 0) + 
                           (parseFloat(hr.horasExtras) || 0) + 
                           (parseFloat(hr.horasDominicales) || 0);
                }, 0),
                totalNominas: nominas.length,
                promedioHorasPorEmpleado: empleados.length > 0 ? 
                    (horas.reduce((total, hr) => {
                        return total + (parseFloat(hr.horasOrdinarias) || 0) + 
                               (parseFloat(hr.horasNocturnas) || 0) + 
                               (parseFloat(hr.horasExtras) || 0) + 
                               (parseFloat(hr.horasDominicales) || 0);
                    }, 0) / empleados.length).toFixed(1) : 0
            };
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de productividad:', error);
            return {};
        }
    }

    getNominasData(startDate, endDate) {
        try {
            const nominas = JSON.parse(localStorage.getItem('axyra_comprobantes') || '[]');
            
            if (startDate && endDate) {
                return nominas.filter(nom => {
                    const nomDate = new Date(nom.fecha);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return nomDate >= start && nomDate <= end;
                });
            }
            
            return nominas;
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de nóminas:', error);
            return [];
        }
    }

    getCuadreData(startDate, endDate) {
        try {
            const cuadres = JSON.parse(localStorage.getItem('axyra_cuadres') || '[]');
            
            if (startDate && endDate) {
                return cuadres.filter(cq => {
                    const cqDate = new Date(cq.fecha);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return cqDate >= start && cqDate <= end;
                });
            }
            
            return cuadres;
        } catch (error) {
            console.warn('⚠️ Error obteniendo datos de cuadres:', error);
            return [];
        }
    }

    generateEmpleadosPreview(data) {
        if (!data || data.length === 0) {
            return '<p>No hay empleados para mostrar</p>';
        }
        
        const departamentos = {};
        data.forEach(emp => {
            const dept = emp.departamento || 'Sin departamento';
            departamentos[dept] = (departamentos[dept] || 0) + 1;
        });
        
        let html = `
            <div class="axyra-report-summary">
                <h4>Resumen de Empleados</h4>
                <div class="axyra-summary-stats">
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.length}</span>
                        <span class="axyra-summary-label">Total Empleados</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${Object.keys(departamentos).length}</span>
                        <span class="axyra-summary-label">Departamentos</span>
                    </div>
                </div>
            </div>
            <div class="axyra-report-chart" id="chartContainer">
                <!-- El gráfico se generará aquí -->
            </div>
        `;
        
        return html;
    }

    generateHorasPreview(data) {
        if (!data || data.length === 0) {
            return '<p>No hay registros de horas para mostrar</p>';
        }
        
        const totalHoras = data.reduce((total, hr) => {
            return total + (parseFloat(hr.horasOrdinarias) || 0) + 
                   (parseFloat(hr.horasNocturnas) || 0) + 
                   (parseFloat(hr.horasExtras) || 0) + 
                   (parseFloat(hr.horasDominicales) || 0);
        }, 0);
        
        let html = `
            <div class="axyra-report-summary">
                <h4>Resumen de Horas</h4>
                <div class="axyra-summary-stats">
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.length}</span>
                        <span class="axyra-summary-label">Registros</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${totalHoras.toFixed(1)}</span>
                        <span class="axyra-summary-label">Total Horas</span>
                    </div>
                </div>
            </div>
            <div class="axyra-report-chart" id="chartContainer">
                <!-- El gráfico se generará aquí -->
            </div>
        `;
        
        return html;
    }

    generateSalariosPreview(data) {
        if (!data || data.length === 0) {
            return '<p>No hay datos de salarios para mostrar</p>';
        }
        
        const totalSalarios = data.reduce((total, emp) => total + emp.salario, 0);
        const promedioSalario = totalSalarios / data.length;
        
        let html = `
            <div class="axyra-report-summary">
                <h4>Resumen de Salarios</h4>
                <div class="axyra-summary-stats">
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">$${totalSalarios.toLocaleString('es-CO')}</span>
                        <span class="axyra-summary-label">Total Salarios</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">$${promedioSalario.toLocaleString('es-CO')}</span>
                        <span class="axyra-summary-label">Promedio</span>
                    </div>
                </div>
            </div>
            <div class="axyra-report-chart" id="chartContainer">
                <!-- El gráfico se generará aquí -->
            </div>
        `;
        
        return html;
    }

    generateProductividadPreview(data) {
        if (!data || Object.keys(data).length === 0) {
            return '<p>No hay datos de productividad para mostrar</p>';
        }
        
        let html = `
            <div class="axyra-report-summary">
                <h4>Resumen de Productividad</h4>
                <div class="axyra-summary-stats">
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.totalEmpleados || 0}</span>
                        <span class="axyra-summary-label">Empleados</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.totalHoras || 0}</span>
                        <span class="axyra-summary-label">Total Horas</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.promedioHorasPorEmpleado || 0}</span>
                        <span class="axyra-summary-label">Promedio/Empleado</span>
                    </div>
                </div>
            </div>
            <div class="axyra-report-chart" id="chartContainer">
                <!-- El gráfico se generará aquí -->
            </div>
        `;
        
        return html;
    }

    generateNominasPreview(data) {
        if (!data || data.length === 0) {
            return '<p>No hay nóminas para mostrar</p>';
        }
        
        const totalMonto = data.reduce((total, nom) => total + (parseFloat(nom.monto) || 0), 0);
        
        let html = `
            <div class="axyra-report-summary">
                <h4>Resumen de Nóminas</h4>
                <div class="axyra-summary-stats">
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.length}</span>
                        <span class="axyra-summary-label">Total Nóminas</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">$${totalMonto.toLocaleString('es-CO')}</span>
                        <span class="axyra-summary-label">Total Monto</span>
                    </div>
                </div>
            </div>
            <div class="axyra-report-chart" id="chartContainer">
                <!-- El gráfico se generará aquí -->
            </div>
        `;
        
        return html;
    }

    generateCuadrePreview(data) {
        if (!data || data.length === 0) {
            return '<p>No hay cuadres de caja para mostrar</p>';
        }
        
        const totalCuadres = data.reduce((total, cq) => total + (parseFloat(cq.total) || 0), 0);
        
        let html = `
            <div class="axyra-report-summary">
                <h4>Resumen de Cuadres</h4>
                <div class="axyra-summary-stats">
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">${data.length}</span>
                        <span class="axyra-summary-label">Total Cuadres</span>
                    </div>
                    <div class="axyra-summary-stat">
                        <span class="axyra-summary-number">$${totalCuadres.toLocaleString('es-CO')}</span>
                        <span class="axyra-summary-label">Total Monto</span>
                    </div>
                </div>
            </div>
            <div class="axyra-report-chart" id="chartContainer">
                <!-- El gráfico se generará aquí -->
            </div>
        `;
        
        return html;
    }

    generateChart(reportType, data, chartType) {
        try {
            const chartContainer = document.getElementById('chartContainer');
            if (!chartContainer) return;
            
            // Limpiar contenedor
            chartContainer.innerHTML = '<canvas id="reportChart"></canvas>';
            
            const ctx = document.getElementById('reportChart');
            if (!ctx) return;
            
            // Destruir gráfico existente
            if (this.charts[reportType]) {
                this.charts[reportType].destroy();
            }
            
            // Generar datos del gráfico según el tipo de reporte
            const chartData = this.prepareChartData(reportType, data, chartType);
            
            // Crear nuevo gráfico
            this.charts[reportType] = new Chart(ctx, {
                type: chartType,
                data: chartData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        },
                        title: {
                            display: true,
                            text: this.reportTemplates[reportType].name
                        }
                    }
                }
            });
            
        } catch (error) {
            console.error('❌ Error generando gráfico:', error);
        }
    }

    prepareChartData(reportType, data, chartType) {
        switch (reportType) {
            case 'empleados_departamento':
                return this.prepareEmpleadosChartData(data);
            case 'horas_mensuales':
                return this.prepareHorasChartData(data);
            case 'salarios_rangos':
                return this.prepareSalariosChartData(data);
            case 'productividad_general':
                return this.prepareProductividadChartData(data);
            case 'nominas_quincenales':
                return this.prepareNominasChartData(data);
            case 'cuadre_caja_mensual':
                return this.prepareCuadreChartData(data);
            default:
                return { labels: [], datasets: [] };
        }
    }

    prepareEmpleadosChartData(data) {
        const departamentos = {};
        data.forEach(emp => {
            const dept = emp.departamento || 'Sin departamento';
            departamentos[dept] = (departamentos[dept] || 0) + 1;
        });
        
        return {
            labels: Object.keys(departamentos),
            datasets: [{
                data: Object.values(departamentos),
                backgroundColor: [
                    '#667eea', '#764ba2', '#f093fb', '#4facfe',
                    '#43e97b', '#f5576c', '#00f2fe', '#ff9a9e'
                ]
            }]
        };
    }

    prepareHorasChartData(data) {
        // Agrupar por mes
        const meses = {};
        data.forEach(hr => {
            const fecha = new Date(hr.fecha);
            const mes = fecha.toLocaleString('es-CO', { month: 'long', year: 'numeric' });
            const totalHoras = (parseFloat(hr.horasOrdinarias) || 0) + 
                              (parseFloat(hr.horasNocturnas) || 0) + 
                              (parseFloat(hr.horasExtras) || 0) + 
                              (parseFloat(hr.horasDominicales) || 0);
            
            meses[mes] = (meses[mes] || 0) + totalHoras;
        });
        
        return {
            labels: Object.keys(meses),
            datasets: [{
                label: 'Horas Trabajadas',
                data: Object.values(meses),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                tension: 0.4
            }]
        };
    }

    prepareSalariosChartData(data) {
        // Crear rangos de salarios
        const rangos = {
            '0-500k': 0,
            '500k-1M': 0,
            '1M-2M': 0,
            '2M-5M': 0,
            '5M+': 0
        };
        
        data.forEach(emp => {
            const salario = emp.salario;
            if (salario <= 500000) rangos['0-500k']++;
            else if (salario <= 1000000) rangos['500k-1M']++;
            else if (salario <= 2000000) rangos['1M-2M']++;
            else if (salario <= 5000000) rangos['2M-5M']++;
            else rangos['5M+']++;
        });
        
        return {
            labels: Object.keys(rangos),
            datasets: [{
                label: 'Empleados',
                data: Object.values(rangos),
                backgroundColor: [
                    '#43e97b', '#4facfe', '#f093fb', '#f5576c', '#00f2fe'
                ]
            }]
        };
    }

    prepareProductividadChartData(data) {
        return {
            labels: ['Empleados', 'Horas', 'Nóminas'],
            datasets: [{
                data: [
                    data.totalEmpleados || 0,
                    data.totalHoras || 0,
                    data.totalNominas || 0
                ],
                backgroundColor: [
                    '#667eea', '#43e97b', '#f093fb'
                ]
            }]
        };
    }

    prepareNominasChartData(data) {
        // Agrupar por quincena
        const quincenas = {};
        data.forEach(nom => {
            const fecha = new Date(nom.fecha);
            const quincena = fecha.getDate() <= 15 ? '1ra Quincena' : '2da Quincena';
            const mes = fecha.toLocaleString('es-CO', { month: 'long', year: 'numeric' });
            const key = `${mes} - ${quincena}`;
            
            quincenas[key] = (quincenas[key] || 0) + (parseFloat(nom.monto) || 0);
        });
        
        return {
            labels: Object.keys(quincenas),
            datasets: [{
                label: 'Monto Total',
                data: Object.values(quincenas),
                backgroundColor: '#4facfe'
            }]
        };
    }

    prepareCuadreChartData(data) {
        // Agrupar por mes
        const meses = {};
        data.forEach(cq => {
            const fecha = new Date(cq.fecha);
            const mes = fecha.toLocaleString('es-CO', { month: 'long', year: 'numeric' });
            meses[mes] = (meses[mes] || 0) + (parseFloat(cq.total) || 0);
        });
        
        return {
            labels: Object.keys(meses),
            datasets: [{
                label: 'Total Cuadres',
                data: Object.values(meses),
                borderColor: '#43e97b',
                backgroundColor: 'rgba(67, 233, 123, 0.1)',
                tension: 0.4
            }]
        };
    }

    async generateReport(reportType) {
        try {
            console.log(`📊 Generando reporte completo: ${reportType}`);
            
            const template = this.reportTemplates[reportType];
            const exportFormat = document.getElementById('reportExportFormat')?.value || 'pdf';
            
            // Obtener datos del reporte
            const data = await this.getReportData(reportType);
            
            // Generar reporte según el formato
            switch (exportFormat) {
                case 'pdf':
                    await this.generatePDFReport(reportType, data, template);
                    break;
                case 'excel':
                    await this.generateExcelReport(reportType, data, template);
                    break;
                case 'csv':
                    this.generateCSVReport(reportType, data, template);
                    break;
                default:
                    this.showMessage('Formato de exportación no soportado', 'error');
            }
            
        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            this.showMessage('Error al generar el reporte', 'error');
        }
    }

    async generatePDFReport(reportType, data, template) {
        try {
            // Crear contenido del PDF
            const content = this.createPDFContent(reportType, data, template);
            
            // Generar PDF usando jsPDF
            const { jsPDF } = await import('jspdf');
            const doc = new jsPDF();
            
            // Agregar contenido
            doc.setFontSize(20);
            doc.text(template.name, 20, 20);
            
            doc.setFontSize(12);
            doc.text(`Generado el: ${new Date().toLocaleString('es-CO')}`, 20, 40);
            
            // Agregar más contenido según el tipo de reporte
            let yPosition = 60;
            content.forEach(line => {
                if (yPosition > 280) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 10;
            });
            
            // Guardar PDF
            const filename = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.pdf`;
            doc.save(filename);
            
            this.showMessage('Reporte PDF generado correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error generando PDF:', error);
            this.showMessage('Error al generar PDF. Asegúrate de tener jsPDF instalado', 'error');
        }
    }

    async generateExcelReport(reportType, data, template) {
        try {
            // Crear contenido del Excel
            const workbook = this.createExcelContent(reportType, data, template);
            
            // Generar Excel usando XLSX
            const XLSX = await import('xlsx');
            const filename = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            XLSX.writeFile(workbook, filename);
            
            this.showMessage('Reporte Excel generado correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error generando Excel:', error);
            this.showMessage('Error al generar Excel. Asegúrate de tener XLSX instalado', 'error');
        }
    }

    generateCSVReport(reportType, data, template) {
        try {
            // Crear contenido del CSV
            const csvContent = this.createCSVContent(reportType, data, template);
            
            // Crear y descargar archivo
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `reporte_${reportType}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            
            this.showMessage('Reporte CSV generado correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error generando CSV:', error);
            this.showMessage('Error al generar CSV', 'error');
        }
    }

    createPDFContent(reportType, data, template) {
        const content = [];
        content.push(`REPORTE: ${template.name}`);
        content.push(`DESCRIPCIÓN: ${template.description}`);
        content.push(`FECHA DE GENERACIÓN: ${new Date().toLocaleString('es-CO')}`);
        content.push('');
        
        switch (reportType) {
            case 'empleados_departamento':
                content.push('RESUMEN POR DEPARTAMENTO:');
                const departamentos = {};
                data.forEach(emp => {
                    const dept = emp.departamento || 'Sin departamento';
                    departamentos[dept] = (departamentos[dept] || 0) + 1;
                });
                Object.entries(departamentos).forEach(([dept, count]) => {
                    content.push(`  ${dept}: ${count} empleados`);
                });
                break;
            // Agregar más casos según sea necesario
        }
        
        return content;
    }

    createExcelContent(reportType, data, template) {
        // Crear estructura básica del Excel
        const workbook = {
            SheetNames: ['Reporte'],
            Sheets: {
                'Reporte': {
                    'A1': { v: 'REPORTE' },
                    'A2': { v: template.name },
                    'A4': { v: 'DESCRIPCIÓN' },
                    'B4': { v: template.description },
                    'A6': { v: 'FECHA' },
                    'B6': { v: new Date().toLocaleString('es-CO') }
                }
            }
        };
        
        return workbook;
    }

    createCSVContent(reportType, data, template) {
        let csv = 'REPORTE,DESCRIPCIÓN,FECHA\n';
        csv += `"${template.name}","${template.description}","${new Date().toLocaleString('es-CO')}"\n`;
        csv += '\n';
        
        // Agregar datos específicos según el tipo de reporte
        switch (reportType) {
            case 'empleados_departamento':
                csv += 'DEPARTAMENTO,CANTIDAD_EMPLEADOS\n';
                const departamentos = {};
                data.forEach(emp => {
                    const dept = emp.departamento || 'Sin departamento';
                    departamentos[dept] = (departamentos[dept] || 0) + 1;
                });
                Object.entries(departamentos).forEach(([dept, count]) => {
                    csv += `"${dept}",${count}\n`;
                });
                break;
            // Agregar más casos según sea necesario
        }
        
        return csv;
    }

    closeReportConfigModal() {
        const modal = document.getElementById('reportConfigModal');
        if (modal) {
            modal.remove();
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.axyra-modal');
        modals.forEach(modal => modal.remove());
    }

    showMessage(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `axyra-notification axyra-notification-${type}`;
        notification.innerHTML = `
            <div class="axyra-notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div class="axyra-notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Métodos estáticos para uso desde HTML
    static generateQuickReport(reportType) {
        if (window.axyraCustomReports) {
            window.axyraCustomReports.generateQuickReport(reportType);
        }
    }

    static closeReportConfigModal() {
        if (window.axyraCustomReports) {
            window.axyraCustomReports.closeReportConfigModal();
        }
    }
}

// Inicializar sistema de reportes personalizados cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.axyraCustomReports = new AxyraCustomReports();
});

// Exportar para uso global
window.AxyraCustomReports = AxyraCustomReports;
