/**
 * AXYRA - Sistema de Analytics y Reportes Avanzados
 * Dashboard profesional con métricas y gráficos
 */

class AXYRADashboardAnalytics {
  constructor() {
    this.charts = {};
    this.metrics = {};
    this.init();
  }

  /**
   * Inicializa el sistema de analytics
   */
  init() {
    this.loadMetrics();
    this.setupCharts();
    this.setupRealTimeUpdates();
  }

  /**
   * Carga métricas del sistema
   */
  loadMetrics() {
    const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    const registrosHoras = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    const comprobantes = JSON.parse(localStorage.getItem('axyra_comprobantes') || '[]');
    const departamentos = JSON.parse(localStorage.getItem('axyra_departamentos') || '[]');

    // Métricas básicas
    this.metrics = {
      totalEmpleados: empleados.length,
      totalHoras: this.calcularTotalHoras(registrosHoras),
      totalComprobantes: comprobantes.length,
      totalSalarios: this.calcularTotalSalarios(empleados),
      promedioHorasPorEmpleado: empleados.length > 0 ? this.calcularTotalHoras(registrosHoras) / empleados.length : 0,
      empleadosPorDepartamento: this.agruparEmpleadosPorDepartamento(empleados),
      horasPorMes: this.agruparHorasPorMes(registrosHoras),
      salariosPorDepartamento: this.agruparSalariosPorDepartamento(empleados),
      productividad: this.calcularProductividad(empleados, registrosHoras),
    };

    this.updateMetricsDisplay();
  }

  /**
   * Calcula el total de horas trabajadas
   */
  calcularTotalHoras(registrosHoras) {
    return registrosHoras.reduce((total, registro) => {
      const horasOrdinarias = parseFloat(registro.horasOrdinarias) || 0;
      const horasNocturnas = parseFloat(registro.horasNocturnas) || 0;
      const horasExtras = parseFloat(registro.horasExtras) || 0;
      const horasDominicales = parseFloat(registro.horasDominicales) || 0;
      return total + horasOrdinarias + horasNocturnas + horasExtras + horasDominicales;
    }, 0);
  }

  /**
   * Calcula el total de salarios base
   */
  calcularTotalSalarios(empleados) {
    return empleados.reduce((total, empleado) => {
      const salario = parseFloat(empleado.salario) || 0;
      return total + salario;
    }, 0);
  }

  /**
   * Agrupa empleados por departamento
   */
  agruparEmpleadosPorDepartamento(empleados) {
    const agrupacion = {};
    empleados.forEach((empleado) => {
      const depto = empleado.departamento || 'Sin Departamento';
      agrupacion[depto] = (agrupacion[depto] || 0) + 1;
    });
    return agrupacion;
  }

  /**
   * Agrupa horas por mes
   */
  agruparHorasPorMes(registrosHoras) {
    const agrupacion = {};
    const meses = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    registrosHoras.forEach((registro) => {
      const fecha = new Date(registro.fecha);
      const mes = meses[fecha.getMonth()];
      const totalHoras =
        (parseFloat(registro.horasOrdinarias) || 0) +
        (parseFloat(registro.horasNocturnas) || 0) +
        (parseFloat(registro.horasExtras) || 0) +
        (parseFloat(registro.horasDominicales) || 0);

      agrupacion[mes] = (agrupacion[mes] || 0) + totalHoras;
    });

    return agrupacion;
  }

  /**
   * Agrupa salarios por departamento
   */
  agruparSalariosPorDepartamento(empleados) {
    const agrupacion = {};
    empleados.forEach((empleado) => {
      const depto = empleado.departamento || 'Sin Departamento';
      const salario = parseFloat(empleado.salario) || 0;
      agrupacion[depto] = (agrupacion[depto] || 0) + salario;
    });
    return agrupacion;
  }

  /**
   * Calcula métricas de productividad
   */
  calcularProductividad(empleados, registrosHoras) {
    if (empleados.length === 0) return {};

    const totalEmpleados = empleados.length;
    const totalHoras = this.calcularTotalHoras(registrosHoras);
    const promedioHoras = totalHoras / totalEmpleados;
    const horasEstandar = 160; // 160 horas por mes estándar

    return {
      eficiencia: Math.round((promedioHoras / horasEstandar) * 100),
      horasPromedio: Math.round(promedioHoras),
      empleadosActivos: registrosHoras.length > 0 ? empleados.length : 0,
      tasaOcupacion: Math.round((totalHoras / (totalEmpleados * horasEstandar)) * 100),
    };
  }

  /**
   * Actualiza la visualización de métricas
   */
  updateMetricsDisplay() {
    // Actualizar tarjetas principales
    this.updateMainMetrics();

    // Actualizar gráficos
    this.updateCharts();

    // Actualizar indicadores de productividad
    this.updateProductivityIndicators();
  }

  /**
   * Actualiza métricas principales
   */
  updateMainMetrics() {
    // Empleados
    const empleadosElement = document.getElementById('totalEmpleados');
    if (empleadosElement) {
      empleadosElement.textContent = this.metrics.totalEmpleados;
    }

    // Horas
    const horasElement = document.getElementById('horasTrabajadas');
    if (horasElement) {
      horasElement.textContent = this.metrics.totalHoras;
    }

    // Comprobantes
    const comprobantesElement = document.getElementById('comprobantesGenerados');
    if (comprobantesElement) {
      comprobantesElement.textContent = this.metrics.totalComprobantes;
    }

    // Salarios
    const salariosElement = document.getElementById('totalSalarios');
    if (salariosElement) {
      const salarioFormateado = this.metrics.totalSalarios.toLocaleString('es-CO', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
      salariosElement.textContent = `$${salarioFormateado}`;
    }
  }

  /**
   * Configura los gráficos del dashboard
   */
  setupCharts() {
    this.createEmployeeDistributionChart();
    this.createHoursTrendChart();
    this.createSalaryDistributionChart();
    this.createProductivityChart();
  }

  /**
   * Crea gráfico de distribución de empleados por departamento
   */
  createEmployeeDistributionChart() {
    const chartContainer = document.getElementById('employeeDistributionChart');
    if (!chartContainer) return;

    const data = this.metrics.empleadosPorDepartamento;
    const labels = Object.keys(data);
    const values = Object.values(data);

    // Crear gráfico de dona
    this.createDoughnutChart(chartContainer, labels, values, 'Empleados por Departamento');
  }

  /**
   * Crea gráfico de tendencia de horas
   */
  createHoursTrendChart() {
    const chartContainer = document.getElementById('hoursTrendChart');
    if (!chartContainer) return;

    const data = this.metrics.horasPorMes;
    const labels = Object.keys(data);
    const values = Object.values(data);

    // Crear gráfico de línea
    this.createLineChart(chartContainer, labels, values, 'Horas Trabajadas por Mes');
  }

  /**
   * Crea gráfico de distribución de salarios
   */
  createSalaryDistributionChart() {
    const chartContainer = document.getElementById('salaryDistributionChart');
    if (!chartContainer) return;

    const data = this.metrics.salariosPorDepartamento;
    const labels = Object.keys(data);
    const values = Object.values(data);

    // Crear gráfico de barras
    this.createBarChart(chartContainer, labels, values, 'Salarios por Departamento');
  }

  /**
   * Crea gráfico de productividad
   */
  createProductivityChart() {
    const chartContainer = document.getElementById('productivityChart');
    if (!chartContainer) return;

    const data = this.metrics.productividad;
    const labels = ['Eficiencia', 'Tasa Ocupación'];
    const values = [data.eficiencia || 0, data.tasaOcupacion || 0];

    // Crear gráfico de radar
    this.createRadarChart(chartContainer, labels, values, 'Métricas de Productividad');
  }

  /**
   * Crea gráfico de dona
   */
  createDoughnutChart(container, labels, data, title) {
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const colors = this.generateColors(data.length);

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' },
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  /**
   * Crea gráfico de línea
   */
  createLineChart(container, labels, data, title) {
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Horas',
            data: data,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  /**
   * Crea gráfico de barras
   */
  createBarChart(container, labels, data, title) {
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const colors = this.generateColors(data.length);

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Salarios',
            data: data,
            backgroundColor: colors,
            borderColor: colors.map((c) => this.darkenColor(c)),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '$' + value.toLocaleString('es-CO');
              },
            },
          },
        },
      },
    });
  }

  /**
   * Crea gráfico de radar
   */
  createRadarChart(container, labels, data, title) {
    const canvas = document.createElement('canvas');
    container.innerHTML = '';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Porcentaje',
            data: data,
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: '#3b82f6',
            borderWidth: 2,
            pointBackgroundColor: '#3b82f6',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: title,
            font: { size: 16, weight: 'bold' },
          },
        },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function (value) {
                return value + '%';
              },
            },
          },
        },
      },
    });
  }

  /**
   * Genera colores para los gráficos
   */
  generateColors(count) {
    const colors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316',
      '#ec4899',
      '#6366f1',
    ];

    const result = [];
    for (let i = 0; i < count; i++) {
      result.push(colors[i % colors.length]);
    }
    return result;
  }

  /**
   * Oscurece un color para bordes
   */
  darkenColor(color) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 40);
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 40);
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 40);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Actualiza los gráficos
   */
  updateCharts() {
    // Los gráficos se actualizan automáticamente cuando se recrean
    this.createEmployeeDistributionChart();
    this.createHoursTrendChart();
    this.createSalaryDistributionChart();
    this.createProductivityChart();
  }

  /**
   * Actualiza indicadores de productividad
   */
  updateProductivityIndicators() {
    const productividad = this.metrics.productividad;

    // Crear o actualizar indicadores de productividad
    this.createProductivityIndicators(productividad);
  }

  /**
   * Crea indicadores visuales de productividad
   */
  createProductivityIndicators(productividad) {
    const container = document.getElementById('productivityIndicators');
    if (!container) return;

    container.innerHTML = `
            <div class="axyra-productivity-grid">
                <div class="axyra-productivity-item">
                    <div class="axyra-productivity-icon">
                        <i class="fas fa-chart-line"></i>
                    </div>
                    <div class="axyra-productivity-content">
                        <div class="axyra-productivity-value">${productividad.eficiencia || 0}%</div>
                        <div class="axyra-productivity-label">Eficiencia</div>
                    </div>
                </div>
                
                <div class="axyra-productivity-item">
                    <div class="axyra-productivity-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="axyra-productivity-content">
                        <div class="axyra-productivity-value">${productividad.horasPromedio || 0}</div>
                        <div class="axyra-productivity-label">Horas Promedio</div>
                    </div>
                </div>
                
                <div class="axyra-productivity-item">
                    <div class="axyra-productivity-icon">
                        <i class="fas fa-users"></i>
                    </div>
                    <div class="axyra-productivity-content">
                        <div class="axyra-productivity-value">${productividad.empleadosActivos || 0}</div>
                        <div class="axyra-productivity-label">Empleados Activos</div>
                    </div>
                </div>
                
                <div class="axyra-productivity-item">
                    <div class="axyra-productivity-icon">
                        <i class="fas fa-percentage"></i>
                    </div>
                    <div class="axyra-productivity-content">
                        <div class="axyra-productivity-value">${productividad.tasaOcupacion || 0}%</div>
                        <div class="axyra-productivity-label">Tasa Ocupación</div>
                    </div>
                </div>
            </div>
        `;
  }

  /**
   * Configura actualizaciones en tiempo real
   */
  setupRealTimeUpdates() {
    // Actualizar métricas cada 30 segundos
    setInterval(() => {
      this.loadMetrics();
    }, 30000);

    // Escuchar cambios en localStorage
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('axyra_')) {
        this.loadMetrics();
      }
    });
  }

  /**
   * Genera reporte completo del dashboard
   */
  generateDashboardReport() {
    const report = {
      fecha: new Date().toISOString(),
      metricas: this.metrics,
      resumen: {
        totalEmpleados: this.metrics.totalEmpleados,
        totalHoras: this.metrics.totalHoras,
        totalSalarios: this.metrics.totalSalarios,
        eficiencia: this.metrics.productividad.eficiencia,
        recomendaciones: this.generarRecomendaciones(),
      },
    };

    // Descargar reporte como JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dashboard_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    return report;
  }

  /**
   * Genera recomendaciones basadas en las métricas
   */
  generarRecomendaciones() {
    const recomendaciones = [];
    const productividad = this.metrics.productividad;

    if (productividad.eficiencia < 80) {
      recomendaciones.push('Considerar revisar la distribución de horas de trabajo');
    }

    if (this.metrics.totalEmpleados === 0) {
      recomendaciones.push('Agregar empleados al sistema para comenzar a generar métricas');
    }

    if (this.metrics.totalHoras === 0) {
      recomendaciones.push('Registrar horas trabajadas para obtener estadísticas de productividad');
    }

    if (recomendaciones.length === 0) {
      recomendaciones.push('El sistema está funcionando de manera óptima');
    }

    return recomendaciones;
  }
}

// Inicializar analytics del dashboard
let axyraDashboardAnalytics;
document.addEventListener('DOMContentLoaded', () => {
  // Verificar si estamos en el dashboard
  if (window.location.pathname.includes('dashboard')) {
    axyraDashboardAnalytics = new AXYRADashboardAnalytics();
  }
});

// Exportar para uso global
window.AXYRADashboardAnalytics = AXYRADashboardAnalytics;
