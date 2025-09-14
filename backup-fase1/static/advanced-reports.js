// Sistema de Reportes Avanzados AXYRA
// Genera reportes personalizados con gráficos interactivos y exportación

class AxyraAdvancedReports {
    constructor() {
        this.reports = {};
        this.currentReport = null;
        this.chartInstances = {};
        this.init();
    }

    init() {
        console.log('📊 Inicializando Sistema de Reportes Avanzados...');
        this.setupReportTemplates();
        this.setupEventListeners();
        console.log('✅ Sistema de reportes inicializado correctamente');
    }

    setupReportTemplates() {
        // Plantillas de reportes predefinidos
        this.reportTemplates = {
            'empleados_departamento': {
                name: 'Reporte de Empleados por Departamento',
                description: 'Análisis detallado de la distribución de empleados por departamento',
                type: 'chart',
                chartType: 'doughnut',
                dataSource: 'empleados'
            },
            'horas_mensuales': {
                name: 'Reporte de Horas Mensuales',
                description: 'Tendencia de horas trabajadas por mes',
                type: 'chart',
                chartType: 'line',
                dataSource: 'horas'
            },
            'salarios_rangos': {
                name: 'Reporte de Salarios por Rangos',
                description: 'Distribución de empleados por rangos salariales',
                type: 'chart',
                chartType: 'bar',
                dataSource: 'empleados'
            },
            'productividad_general': {
                name: 'Reporte de Productividad General',
                description: 'Métricas generales de productividad y eficiencia',
                type: 'dashboard',
                dataSource: 'all'
            },
            'nominas_quincenales': {
                name: 'Reporte de Nóminas Quincenales',
                description: 'Análisis de nóminas generadas por quincena',
                type: 'table',
                dataSource: 'nominas'
            },
            'cuadre_caja_mensual': {
                name: 'Reporte de Cuadre de Caja Mensual',
                description: 'Resumen mensual de ingresos y gastos',
                type: 'summary',
                dataSource: 'cuadres'
            }
        };
    }

    setupEventListeners() {
        // Escuchar eventos de generación de reportes
        document.addEventListener('generateReport', (e) => {
            this.generateReport(e.detail);
        });

        // Escuchar eventos de exportación
        document.addEventListener('exportReport', (e) => {
            this.exportReport(e.detail);
        });
    }

    async generateReport(reportConfig) {
        try {
            console.log('📊 Generando reporte:', reportConfig);

            const template = this.reportTemplates[reportConfig.template];
            if (!template) {
                throw new Error('Plantilla de reporte no encontrada');
            }

            // Cargar datos necesarios
            const data = await this.loadReportData(template.dataSource);
            
            // Crear reporte
            const report = await this.createReport(template, data, reportConfig);
            
            // Mostrar reporte
            this.displayReport(report);
            
            console.log('✅ Reporte generado exitosamente');
            return report;

        } catch (error) {
            console.error('❌ Error generando reporte:', error);
            this.showError('Error generando reporte: ' + error.message);
        }
    }

    async loadReportData(dataSource) {
        const data = {};

        try {
            if (dataSource === 'all' || dataSource === 'empleados') {
                data.empleados = await this.loadEmpleados();
            }
            
            if (dataSource === 'all' || dataSource === 'horas') {
                data.horas = await this.loadHoras();
            }
            
            if (dataSource === 'all' || dataSource === 'nominas') {
                data.nominas = await this.loadNominas();
            }
            
            if (dataSource === 'all' || dataSource === 'cuadres') {
                data.cuadres = await this.loadCuadres();
            }

            return data;
        } catch (error) {
            console.error('❌ Error cargando datos del reporte:', error);
            throw error;
        }
    }

    async loadEmpleados() {
        // Cargar desde localStorage
        const empleadosData = localStorage.getItem('axyra_empleados');
        if (empleadosData) {
            return JSON.parse(empleadosData);
        }

        // Intentar cargar desde Firebase
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const db = firebase.firestore();
                const snapshot = await db.collection('empleados').get();
                if (!snapshot.empty) {
                    const empleados = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    localStorage.setItem('axyra_empleados', JSON.stringify(empleados));
                    return empleados;
                }
            } catch (error) {
                console.warn('⚠️ Error cargando empleados desde Firebase:', error);
            }
        }

        return [];
    }

    async loadHoras() {
        const horasData = localStorage.getItem('axyra_horas');
        if (horasData) {
            return JSON.parse(horasData);
        }

        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const db = firebase.firestore();
                const snapshot = await db.collection('horas_trabajadas').get();
                if (!snapshot.empty) {
                    const horas = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    localStorage.setItem('axyra_horas', JSON.stringify(horas));
                    return horas;
                }
            } catch (error) {
                console.warn('⚠️ Error cargando horas desde Firebase:', error);
            }
        }

        return [];
    }

    async loadNominas() {
        const nominasData = localStorage.getItem('axyra_nominas');
        if (nominasData) {
            return JSON.parse(nominasData);
        }

        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const db = firebase.firestore();
                const snapshot = await db.collection('nominas').get();
                if (!snapshot.empty) {
                    const nominas = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    localStorage.setItem('axyra_nominas', JSON.stringify(nominas));
                    return nominas;
                }
            } catch (error) {
                console.warn('⚠️ Error cargando nóminas desde Firebase:', error);
            }
        }

        return [];
    }

    async loadCuadres() {
        const cuadresData = localStorage.getItem('axyra_cuadres');
        if (cuadresData) {
            return JSON.parse(cuadresData);
        }

        if (typeof firebase !== 'undefined' && firebase.firestore) {
            try {
                const db = firebase.firestore();
                const snapshot = await db.collection('cuadre_caja').get();
                if (!snapshot.empty) {
                    const cuadres = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    localStorage.setItem('axyra_cuadres', JSON.stringify(cuadres));
                    return cuadres;
                }
            } catch (error) {
                console.warn('⚠️ Error cargando cuadres desde Firebase:', error);
            }
        }

        return [];
    }

    async createReport(template, data, config) {
        const report = {
            id: this.generateReportId(),
            template: template,
            config: config,
            data: data,
            generatedAt: new Date().toISOString(),
            charts: [],
            tables: [],
            summaries: []
        };

        // Procesar datos según el tipo de reporte
        switch (template.type) {
            case 'chart':
                report.charts = await this.createCharts(template, data, config);
                break;
            case 'table':
                report.tables = await this.createTables(template, data, config);
                break;
            case 'dashboard':
                report.charts = await this.createCharts(template, data, config);
                report.summaries = await this.createSummaries(template, data, config);
                break;
            case 'summary':
                report.summaries = await this.createSummaries(template, data, config);
                break;
        }

        return report;
    }

    async createCharts(template, data, config) {
        const charts = [];

        try {
            switch (template.chartType) {
                case 'doughnut':
                    if (template.dataSource === 'empleados') {
                        charts.push(await this.createEmpleadosDepartamentoChart(data.empleados));
                    }
                    break;
                case 'line':
                    if (template.dataSource === 'horas') {
                        charts.push(await this.createHorasMensualesChart(data.horas));
                    }
                    break;
                case 'bar':
                    if (template.dataSource === 'empleados') {
                        charts.push(await this.createSalariosRangosChart(data.empleados));
                    }
                    break;
            }
        } catch (error) {
            console.error('❌ Error creando gráficos:', error);
        }

        return charts;
    }

    async createEmpleadosDepartamentoChart(empleados) {
        const departamentos = {};
        empleados.forEach(emp => {
            const dept = emp.departamento || 'Sin departamento';
            departamentos[dept] = (departamentos[dept] || 0) + 1;
        });

        return {
            type: 'doughnut',
            title: 'Distribución de Empleados por Departamento',
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
                    legend: { position: 'bottom' },
                    title: {
                        display: true,
                        text: 'Distribución de Empleados por Departamento'
                    }
                }
            }
        };
    }

    async createHorasMensualesChart(horas) {
        const horasPorMes = {};
        horas.forEach(hora => {
            const fecha = new Date(hora.fecha);
            const mes = `${fecha.getFullYear()}-${fecha.getMonth() + 1}`;
            horasPorMes[mes] = (horasPorMes[mes] || 0) + (hora.total_horas || 0);
        });

        const meses = Object.keys(horasPorMes).sort();
        const datos = meses.map(mes => horasPorMes[mes]);

        return {
            type: 'line',
            title: 'Tendencia de Horas Mensuales',
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
                    y: { beginAtZero: true }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Tendencia de Horas Mensuales'
                    }
                }
            }
        };
    }

    async createSalariosRangosChart(empleados) {
        const rangosSalario = {
            'Menos de $1M': 0,
            '$1M - $2M': 0,
            '$2M - $3M': 0,
            'Más de $3M': 0
        };

        empleados.forEach(emp => {
            const salario = emp.salario || 0;
            if (salario < 1000000) rangosSalario['Menos de $1M']++;
            else if (salario < 2000000) rangosSalario['$1M - $2M']++;
            else if (salario < 3000000) rangosSalario['$2M - $3M']++;
            else rangosSalario['Más de $3M']++;
        });

        return {
            type: 'bar',
            title: 'Distribución de Salarios por Rangos',
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
                    y: { beginAtZero: true }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribución de Salarios por Rangos'
                    }
                }
            }
        };
    }

    async createTables(template, data, config) {
        const tables = [];

        try {
            if (template.dataSource === 'nominas') {
                tables.push(await this.createNominasTable(data.nominas));
            }
        } catch (error) {
            console.error('❌ Error creando tablas:', error);
        }

        return tables;
    }

    async createNominasTable(nominas) {
        return {
            title: 'Reporte de Nóminas Quincenales',
            headers: ['Quincena', 'Estado', 'Fecha Generación', 'Total Empleados', 'Total Salarios'],
            data: nominas.map(nomina => [
                nomina.quincena || 'N/A',
                nomina.estado || 'Pendiente',
                nomina.fecha_generacion || 'N/A',
                nomina.total_empleados || 0,
                `$${(nomina.total_salarios || 0).toLocaleString()}`
            ])
        };
    }

    async createSummaries(template, data, config) {
        const summaries = [];

        try {
            if (template.dataSource === 'all') {
                summaries.push(await this.createProductivitySummary(data));
            }
            if (template.dataSource === 'cuadres') {
                summaries.push(await this.createCuadreSummary(data.cuadres));
            }
        } catch (error) {
            console.error('❌ Error creando resúmenes:', error);
        }

        return summaries;
    }

    async createProductivitySummary(data) {
        const totalEmpleados = data.empleados?.length || 0;
        const empleadosActivos = data.empleados?.filter(e => e.estado === 'ACTIVO').length || 0;
        const totalHoras = data.horas?.reduce((sum, h) => sum + (h.total_horas || 0), 0) || 0;
        const totalSalarios = data.empleados?.reduce((sum, e) => sum + (e.salario || 0), 0) || 0;

        return {
            title: 'Resumen de Productividad General',
            metrics: [
                { label: 'Total Empleados', value: totalEmpleados, icon: 'fas fa-users' },
                { label: 'Empleados Activos', value: empleadosActivos, icon: 'fas fa-user-check' },
                { label: 'Total Horas', value: totalHoras.toFixed(1), icon: 'fas fa-clock' },
                { label: 'Total Salarios', value: `$${totalSalarios.toLocaleString()}`, icon: 'fas fa-dollar-sign' }
            ]
        };
    }

    async createCuadreSummary(cuadres) {
        const totalIngresos = cuadres.reduce((sum, c) => sum + (c.ingresos || 0), 0);
        const totalGastos = cuadres.reduce((sum, c) => sum + (c.gastos || 0), 0);
        const balance = totalIngresos - totalGastos;

        return {
            title: 'Resumen de Cuadre de Caja',
            metrics: [
                { label: 'Total Ingresos', value: `$${totalIngresos.toLocaleString()}`, icon: 'fas fa-arrow-up', color: 'success' },
                { label: 'Total Gastos', value: `$${totalGastos.toLocaleString()}`, icon: 'fas fa-arrow-down', color: 'error' },
                { label: 'Balance', value: `$${balance.toLocaleString()}`, icon: 'fas fa-balance-scale', color: balance >= 0 ? 'success' : 'error' }
            ]
        };
    }

    displayReport(report) {
        // Crear modal para mostrar el reporte
        const modal = document.createElement('div');
        modal.className = 'axyra-report-modal';
        modal.innerHTML = this.createReportHTML(report);
        
        document.body.appendChild(modal);
        
        // Renderizar gráficos
        this.renderReportCharts(report);
        
        // Configurar eventos
        this.setupReportEvents(modal, report);
    }

    createReportHTML(report) {
        return `
            <div class="axyra-report-content">
                <div class="axyra-report-header">
                    <h2>${report.template.name}</h2>
                    <div class="axyra-report-actions">
                        <button class="axyra-btn axyra-btn-primary" onclick="axyraAdvancedReports.exportReport('${report.id}')">
                            <i class="fas fa-download"></i> Exportar
                        </button>
                        <button class="axyra-btn axyra-btn-secondary" onclick="axyraAdvancedReports.printReport('${report.id}')">
                            <i class="fas fa-print"></i> Imprimir
                        </button>
                        <button class="axyra-report-close" onclick="this.closest('.axyra-report-modal').remove()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="axyra-report-body">
                    <div class="axyra-report-description">
                        <p>${report.template.description}</p>
                        <small>Generado el ${new Date(report.generatedAt).toLocaleString()}</small>
                    </div>
                    
                    ${this.createChartsHTML(report.charts)}
                    ${this.createTablesHTML(report.tables)}
                    ${this.createSummariesHTML(report.summaries)}
                </div>
            </div>
        `;
    }

    createChartsHTML(charts) {
        if (!charts || charts.length === 0) return '';
        
        return `
            <div class="axyra-report-charts">
                <h3>Gráficos</h3>
                ${charts.map((chart, index) => `
                    <div class="axyra-chart-container">
                        <h4>${chart.title}</h4>
                        <canvas id="reportChart${index}" style="height: 300px;"></canvas>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createTablesHTML(tables) {
        if (!tables || tables.length === 0) return '';
        
        return `
            <div class="axyra-report-tables">
                <h3>Tablas de Datos</h3>
                ${tables.map(table => `
                    <div class="axyra-table-container">
                        <h4>${table.title}</h4>
                        <table class="axyra-data-table">
                            <thead>
                                <tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${table.data.map(row => `
                                    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createSummariesHTML(summaries) {
        if (!summaries || summaries.length === 0) return '';
        
        return `
            <div class="axyra-report-summaries">
                <h3>Resúmenes</h3>
                ${summaries.map(summary => `
                    <div class="axyra-summary-container">
                        <h4>${summary.title}</h4>
                        <div class="axyra-summary-metrics">
                            ${summary.metrics.map(metric => `
                                <div class="axyra-metric-item ${metric.color ? `axyra-metric-${metric.color}` : ''}">
                                    <i class="${metric.icon}"></i>
                                    <div class="axyra-metric-content">
                                        <span class="axyra-metric-label">${metric.label}</span>
                                        <span class="axyra-metric-value">${metric.value}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    renderReportCharts(report) {
        report.charts.forEach((chartConfig, index) => {
            const canvas = document.getElementById(`reportChart${index}`);
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const chart = new Chart(ctx, {
                    type: chartConfig.type,
                    data: chartConfig.data,
                    options: chartConfig.options
                });
                
                this.chartInstances[`${report.id}_${index}`] = chart;
            }
        });
    }

    setupReportEvents(modal, report) {
        // Configurar eventos específicos del reporte
        const exportBtn = modal.querySelector('button[onclick*="exportReport"]');
        if (exportBtn) {
            exportBtn.onclick = () => this.exportReport(report.id);
        }
    }

    async exportReport(reportId) {
        try {
            const report = this.reports[reportId];
            if (!report) {
                throw new Error('Reporte no encontrado');
            }

            // Crear archivo Excel
            const workbook = await this.createExcelWorkbook(report);
            
            // Descargar archivo
            const fileName = `reporte_${report.template.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;
            this.downloadExcelFile(workbook, fileName);
            
            this.showSuccess('Reporte exportado exitosamente');
            
        } catch (error) {
            console.error('❌ Error exportando reporte:', error);
            this.showError('Error exportando reporte: ' + error.message);
        }
    }

    async createExcelWorkbook(report) {
        // Esta función requeriría una librería como SheetJS
        // Por ahora, crearemos un CSV simple
        return this.createCSVReport(report);
    }

    createCSVReport(report) {
        let csvContent = '';
        
        // Agregar encabezado
        csvContent += `Reporte: ${report.template.name}\n`;
        csvContent += `Generado: ${new Date(report.generatedAt).toLocaleString()}\n\n`;
        
        // Agregar datos de gráficos
        if (report.charts.length > 0) {
            csvContent += 'DATOS DE GRÁFICOS\n';
            report.charts.forEach(chart => {
                csvContent += `${chart.title}\n`;
                if (chart.data.labels) {
                    chart.data.labels.forEach((label, index) => {
                        csvContent += `${label},${chart.data.datasets[0].data[index]}\n`;
                    });
                }
                csvContent += '\n';
            });
        }
        
        // Agregar datos de tablas
        if (report.tables.length > 0) {
            csvContent += 'DATOS DE TABLAS\n';
            report.tables.forEach(table => {
                csvContent += `${table.title}\n`;
                csvContent += table.headers.join(',') + '\n';
                table.data.forEach(row => {
                    csvContent += row.join(',') + '\n';
                });
                csvContent += '\n';
            });
        }
        
        return csvContent;
    }

    downloadExcelFile(content, fileName) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', fileName);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    printReport(reportId) {
        try {
            const report = this.reports[reportId];
            if (!report) {
                throw new Error('Reporte no encontrado');
            }

            // Crear ventana de impresión
            const printWindow = window.open('', '_blank');
            printWindow.document.write(this.createPrintHTML(report));
            printWindow.document.close();
            printWindow.print();
            
        } catch (error) {
            console.error('❌ Error imprimiendo reporte:', error);
            this.showError('Error imprimiendo reporte: ' + error.message);
        }
    }

    createPrintHTML(report) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <title>${report.template.name}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .section { margin-bottom: 20px; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .metric { display: inline-block; margin: 10px; padding: 10px; border: 1px solid #ddd; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>${report.template.name}</h1>
                    <p>Generado el ${new Date(report.generatedAt).toLocaleString()}</p>
                </div>
                
                <div class="section">
                    <p>${report.template.description}</p>
                </div>
                
                ${this.createPrintChartsHTML(report.charts)}
                ${this.createPrintTablesHTML(report.tables)}
                ${this.createPrintSummariesHTML(report.summaries)}
            </body>
            </html>
        `;
    }

    createPrintChartsHTML(charts) {
        if (!charts || charts.length === 0) return '';
        
        return `
            <div class="section">
                <h2>Gráficos</h2>
                ${charts.map(chart => `
                    <div>
                        <h3>${chart.title}</h3>
                        <p>Datos: ${chart.data.labels ? chart.data.labels.join(', ') : 'N/A'}</p>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createPrintTablesHTML(tables) {
        if (!tables || tables.length === 0) return '';
        
        return `
            <div class="section">
                <h2>Tablas de Datos</h2>
                ${tables.map(table => `
                    <div>
                        <h3>${table.title}</h3>
                        <table>
                            <thead>
                                <tr>${table.headers.map(h => `<th>${h}</th>`).join('')}</tr>
                            </thead>
                            <tbody>
                                ${table.data.map(row => `
                                    <tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `).join('')}
            </div>
        `;
    }

    createPrintSummariesHTML(summaries) {
        if (!summaries || summaries.length === 0) return '';
        
        return `
            <div class="section">
                <h2>Resúmenes</h2>
                ${summaries.map(summary => `
                    <div>
                        <h3>${summary.title}</h3>
                        ${summary.metrics.map(metric => `
                            <div class="metric">
                                <strong>${metric.label}:</strong> ${metric.value}
                            </div>
                        `).join('')}
                    </div>
                `).join('')}
            </div>
        `;
    }

    generateReportId() {
        return 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    showSuccess(message) {
        // Mostrar notificación de éxito
        if (window.axyraSessionManager) {
            window.axyraSessionManager.showNotification(message, 'success');
        }
    }

    showError(message) {
        // Mostrar notificación de error
        if (window.axyraSessionManager) {
            window.axyraSessionManager.showNotification(message, 'error');
        }
    }

    // Métodos públicos para uso externo
    generateQuickReport(templateName, customConfig = {}) {
        const template = this.reportTemplates[templateName];
        if (!template) {
            throw new Error(`Plantilla '${templateName}' no encontrada`);
        }

        const config = { template: templateName, ...customConfig };
        return this.generateReport(config);
    }

    getAvailableTemplates() {
        return Object.keys(this.reportTemplates).map(key => ({
            id: key,
            ...this.reportTemplates[key]
        }));
    }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Inicializando sistema de reportes avanzados...');
    window.axyraAdvancedReports = new AxyraAdvancedReports();
});

// Funciones globales para uso externo
window.generateQuickReport = function(templateName, customConfig) {
    if (window.axyraAdvancedReports) {
        return window.axyraAdvancedReports.generateQuickReport(templateName, customConfig);
    }
};

window.getAvailableReportTemplates = function() {
    if (window.axyraAdvancedReports) {
        return window.axyraAdvancedReports.getAvailableTemplates();
    }
    return [];
};
