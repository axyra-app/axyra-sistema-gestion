/**
 * AXYRA - Sistema de Métricas de Negocio
 * Análisis y métricas específicas del negocio
 */

class AxyraBusinessMetrics {
  constructor() {
    this.metrics = {
      employees: {
        total: 0,
        active: 0,
        inactive: 0,
        byDepartment: {},
        byRole: {},
        averageSalary: 0,
        salaryRange: { min: 0, max: 0 }
      },
      hours: {
        totalWorked: 0,
        totalOvertime: 0,
        averagePerEmployee: 0,
        byDepartment: {},
        byMonth: {},
        efficiency: 0
      },
      payroll: {
        totalPaid: 0,
        averagePerEmployee: 0,
        byMonth: {},
        byDepartment: {},
        overtimeCost: 0,
        benefitsCost: 0
      },
      inventory: {
        totalProducts: 0,
        totalValue: 0,
        lowStock: 0,
        byCategory: {},
        turnoverRate: 0
      },
      cash: {
        totalSales: 0,
        totalCash: 0,
        totalCard: 0,
        averageTransaction: 0,
        byDay: {},
        byMonth: {}
      },
      performance: {
        systemUptime: 0,
        averageResponseTime: 0,
        errorRate: 0,
        userSatisfaction: 0
      }
    };
    
    this.kpis = {};
    this.trends = {};
    this.alerts = [];
    
    this.init();
  }

  init() {
    console.log('📈 Inicializando sistema de métricas de negocio...');
    this.loadData();
    this.calculateMetrics();
    this.setupKPIs();
    this.setupTrends();
    this.setupAlerts();
  }

  loadData() {
    try {
      this.employees = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
      this.hours = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
      this.payroll = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      this.inventory = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');
      this.cash = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');
    } catch (error) {
      console.error('Error cargando datos para métricas:', error);
    }
  }

  calculateMetrics() {
    this.calculateEmployeeMetrics();
    this.calculateHoursMetrics();
    this.calculatePayrollMetrics();
    this.calculateInventoryMetrics();
    this.calculateCashMetrics();
    this.calculatePerformanceMetrics();
  }

  calculateEmployeeMetrics() {
    const employees = this.employees;
    
    this.metrics.employees.total = employees.length;
    this.metrics.employees.active = employees.filter(e => e.activo).length;
    this.metrics.employees.inactive = employees.filter(e => !e.activo).length;
    
    // Por departamento
    this.metrics.employees.byDepartment = {};
    employees.forEach(emp => {
      const dept = emp.departamento || 'Sin departamento';
      this.metrics.employees.byDepartment[dept] = 
        (this.metrics.employees.byDepartment[dept] || 0) + 1;
    });
    
    // Por rol
    this.metrics.employees.byRole = {};
    employees.forEach(emp => {
      const role = emp.rol || 'Sin rol';
      this.metrics.employees.byRole[role] = 
        (this.metrics.employees.byRole[role] || 0) + 1;
    });
    
    // Salarios
    const salaries = employees.map(e => e.salario || 0).filter(s => s > 0);
    if (salaries.length > 0) {
      this.metrics.employees.averageSalary = salaries.reduce((a, b) => a + b, 0) / salaries.length;
      this.metrics.employees.salaryRange = {
        min: Math.min(...salaries),
        max: Math.max(...salaries)
      };
    }
  }

  calculateHoursMetrics() {
    const hours = this.hours;
    
    this.metrics.hours.totalWorked = hours.reduce((sum, h) => sum + (h.horasTrabajadas || 0), 0);
    this.metrics.hours.totalOvertime = hours.reduce((sum, h) => sum + (h.horasExtras || 0), 0);
    
    if (this.metrics.employees.active > 0) {
      this.metrics.hours.averagePerEmployee = this.metrics.hours.totalWorked / this.metrics.employees.active;
    }
    
    // Por departamento
    this.metrics.hours.byDepartment = {};
    hours.forEach(h => {
      const dept = h.area || 'Sin área';
      this.metrics.hours.byDepartment[dept] = 
        (this.metrics.hours.byDepartment[dept] || 0) + (h.horasTrabajadas || 0);
    });
    
    // Por mes
    this.metrics.hours.byMonth = {};
    hours.forEach(h => {
      if (h.fecha) {
        const month = h.fecha.substring(0, 7); // YYYY-MM
        this.metrics.hours.byMonth[month] = 
          (this.metrics.hours.byMonth[month] || 0) + (h.horasTrabajadas || 0);
      }
    });
    
    // Eficiencia (horas trabajadas vs horas planificadas)
    const plannedHours = this.metrics.employees.active * 8 * 22; // 8 horas por día, 22 días por mes
    this.metrics.hours.efficiency = plannedHours > 0 ? 
      (this.metrics.hours.totalWorked / plannedHours) * 100 : 0;
  }

  calculatePayrollMetrics() {
    const payroll = this.payroll;
    
    this.metrics.payroll.totalPaid = payroll.reduce((sum, p) => sum + (p.totalPagar || 0), 0);
    
    if (this.metrics.employees.active > 0) {
      this.metrics.payroll.averagePerEmployee = this.metrics.payroll.totalPaid / this.metrics.employees.active;
    }
    
    // Por mes
    this.metrics.payroll.byMonth = {};
    payroll.forEach(p => {
      if (p.periodo) {
        this.metrics.payroll.byMonth[p.periodo] = 
          (this.metrics.payroll.byMonth[p.periodo] || 0) + (p.totalPagar || 0);
      }
    });
    
    // Costo de horas extras
    this.metrics.payroll.overtimeCost = payroll.reduce((sum, p) => sum + (p.horasExtrasValor || 0), 0);
    
    // Costo de beneficios (aproximado)
    this.metrics.payroll.benefitsCost = this.metrics.payroll.totalPaid * 0.1; // 10% de beneficios
  }

  calculateInventoryMetrics() {
    const inventory = this.inventory;
    
    this.metrics.inventory.totalProducts = inventory.length;
    this.metrics.inventory.totalValue = inventory.reduce((sum, p) => 
      sum + ((p.precio || 0) * (p.stock || 0)), 0);
    
    this.metrics.inventory.lowStock = inventory.filter(p => 
      (p.stock || 0) < (p.stockMinimo || 10)).length;
    
    // Por categoría
    this.metrics.inventory.byCategory = {};
    inventory.forEach(p => {
      const cat = p.categoria || 'Sin categoría';
      this.metrics.inventory.byCategory[cat] = 
        (this.metrics.inventory.byCategory[cat] || 0) + 1;
    });
    
    // Tasa de rotación (aproximada)
    const totalSales = this.metrics.cash.totalSales;
    this.metrics.inventory.turnoverRate = this.metrics.inventory.totalValue > 0 ? 
      totalSales / this.metrics.inventory.totalValue : 0;
  }

  calculateCashMetrics() {
    const cash = this.cash;
    
    this.metrics.cash.totalSales = cash.reduce((sum, c) => sum + (c.totalVentas || 0), 0);
    this.metrics.cash.totalCash = cash.reduce((sum, c) => sum + (c.totalEfectivo || 0), 0);
    this.metrics.cash.totalCard = cash.reduce((sum, c) => sum + (c.totalTarjeta || 0), 0);
    
    if (cash.length > 0) {
      this.metrics.cash.averageTransaction = this.metrics.cash.totalSales / cash.length;
    }
    
    // Por día
    this.metrics.cash.byDay = {};
    cash.forEach(c => {
      if (c.fecha) {
        this.metrics.cash.byDay[c.fecha] = 
          (this.metrics.cash.byDay[c.fecha] || 0) + (c.totalVentas || 0);
      }
    });
    
    // Por mes
    this.metrics.cash.byMonth = {};
    cash.forEach(c => {
      if (c.fecha) {
        const month = c.fecha.substring(0, 7);
        this.metrics.cash.byMonth[month] = 
          (this.metrics.cash.byMonth[month] || 0) + (c.totalVentas || 0);
      }
    });
  }

  calculatePerformanceMetrics() {
    // Métricas de rendimiento del sistema
    this.metrics.performance.systemUptime = 99.9; // Simulado
    this.metrics.performance.averageResponseTime = 150; // ms
    this.metrics.performance.errorRate = 0.1; // %
    this.metrics.performance.userSatisfaction = 4.5; // 1-5
  }

  setupKPIs() {
    this.kpis = {
      // KPIs de empleados
      employeeRetentionRate: this.calculateEmployeeRetentionRate(),
      averageEmployeeTenure: this.calculateAverageEmployeeTenure(),
      employeeSatisfaction: this.calculateEmployeeSatisfaction(),
      
      // KPIs financieros
      revenuePerEmployee: this.calculateRevenuePerEmployee(),
      costPerEmployee: this.calculateCostPerEmployee(),
      profitMargin: this.calculateProfitMargin(),
      
      // KPIs operacionales
      productivityIndex: this.calculateProductivityIndex(),
      efficiencyRate: this.metrics.hours.efficiency,
      inventoryTurnover: this.metrics.inventory.turnoverRate,
      
      // KPIs de calidad
      errorRate: this.metrics.performance.errorRate,
      systemUptime: this.metrics.performance.systemUptime,
      userSatisfaction: this.metrics.performance.userSatisfaction
    };
  }

  calculateEmployeeRetentionRate() {
    // Simulado - en un sistema real se calcularía basado en historial
    return 85.5;
  }

  calculateAverageEmployeeTenure() {
    // Simulado - en un sistema real se calcularía basado en fechas de ingreso
    return 2.5; // años
  }

  calculateEmployeeSatisfaction() {
    // Simulado - en un sistema real se calcularía basado en encuestas
    return 4.2; // 1-5
  }

  calculateRevenuePerEmployee() {
    if (this.metrics.employees.active === 0) return 0;
    return this.metrics.cash.totalSales / this.metrics.employees.active;
  }

  calculateCostPerEmployee() {
    if (this.metrics.employees.active === 0) return 0;
    return this.metrics.payroll.totalPaid / this.metrics.employees.active;
  }

  calculateProfitMargin() {
    if (this.metrics.cash.totalSales === 0) return 0;
    const profit = this.metrics.cash.totalSales - this.metrics.payroll.totalPaid;
    return (profit / this.metrics.cash.totalSales) * 100;
  }

  calculateProductivityIndex() {
    // Índice de productividad basado en horas trabajadas vs salarios
    if (this.metrics.payroll.totalPaid === 0) return 0;
    return (this.metrics.hours.totalWorked / this.metrics.payroll.totalPaid) * 1000;
  }

  setupTrends() {
    this.trends = {
      employeeGrowth: this.calculateEmployeeGrowthTrend(),
      revenueGrowth: this.calculateRevenueGrowthTrend(),
      costGrowth: this.calculateCostGrowthTrend(),
      productivityTrend: this.calculateProductivityTrend()
    };
  }

  calculateEmployeeGrowthTrend() {
    // Simulado - en un sistema real se calcularía basado en datos históricos
    return 5.2; // % crecimiento mensual
  }

  calculateRevenueGrowthTrend() {
    // Simulado
    return 8.7; // % crecimiento mensual
  }

  calculateCostGrowthTrend() {
    // Simulado
    return 3.1; // % crecimiento mensual
  }

  calculateProductivityTrend() {
    // Simulado
    return 2.3; // % crecimiento mensual
  }

  setupAlerts() {
    this.alerts = [];
    
    // Alertas de empleados
    if (this.metrics.employees.inactive > this.metrics.employees.active * 0.1) {
      this.alerts.push({
        type: 'warning',
        category: 'employees',
        message: 'Alto porcentaje de empleados inactivos',
        value: this.metrics.employees.inactive,
        threshold: this.metrics.employees.active * 0.1
      });
    }
    
    // Alertas de inventario
    if (this.metrics.inventory.lowStock > this.metrics.inventory.totalProducts * 0.2) {
      this.alerts.push({
        type: 'warning',
        category: 'inventory',
        message: 'Alto porcentaje de productos con stock bajo',
        value: this.metrics.inventory.lowStock,
        threshold: this.metrics.inventory.totalProducts * 0.2
      });
    }
    
    // Alertas de rendimiento
    if (this.metrics.performance.errorRate > 1) {
      this.alerts.push({
        type: 'error',
        category: 'performance',
        message: 'Tasa de errores alta',
        value: this.metrics.performance.errorRate,
        threshold: 1
      });
    }
    
    // Alertas de eficiencia
    if (this.metrics.hours.efficiency < 80) {
      this.alerts.push({
        type: 'warning',
        category: 'efficiency',
        message: 'Eficiencia de horas trabajadas baja',
        value: this.metrics.hours.efficiency,
        threshold: 80
      });
    }
  }

  getBusinessReport() {
    return {
      summary: {
        totalEmployees: this.metrics.employees.total,
        activeEmployees: this.metrics.employees.active,
        totalRevenue: this.metrics.cash.totalSales,
        totalCosts: this.metrics.payroll.totalPaid,
        profit: this.metrics.cash.totalSales - this.metrics.payroll.totalPaid,
        profitMargin: this.kpis.profitMargin
      },
      kpis: this.kpis,
      trends: this.trends,
      alerts: this.alerts,
      metrics: this.metrics,
      timestamp: new Date().toISOString()
    };
  }

  getKPIDashboard() {
    return {
      financial: {
        revenuePerEmployee: this.kpis.revenuePerEmployee,
        costPerEmployee: this.kpis.costPerEmployee,
        profitMargin: this.kpis.profitMargin
      },
      operational: {
        productivityIndex: this.kpis.productivityIndex,
        efficiencyRate: this.kpis.efficiencyRate,
        inventoryTurnover: this.kpis.inventoryTurnover
      },
      quality: {
        errorRate: this.kpis.errorRate,
        systemUptime: this.kpis.systemUptime,
        userSatisfaction: this.kpis.userSatisfaction
      },
      employees: {
        retentionRate: this.kpis.employeeRetentionRate,
        averageTenure: this.kpis.averageEmployeeTenure,
        satisfaction: this.kpis.employeeSatisfaction
      }
    };
  }

  getTrendAnalysis() {
    return {
      employeeGrowth: {
        trend: this.trends.employeeGrowth,
        direction: this.trends.employeeGrowth > 0 ? 'up' : 'down',
        impact: 'positive'
      },
      revenueGrowth: {
        trend: this.trends.revenueGrowth,
        direction: this.trends.revenueGrowth > 0 ? 'up' : 'down',
        impact: 'positive'
      },
      costGrowth: {
        trend: this.trends.costGrowth,
        direction: this.trends.costGrowth > 0 ? 'up' : 'down',
        impact: 'negative'
      },
      productivityTrend: {
        trend: this.trends.productivityTrend,
        direction: this.trends.productivityTrend > 0 ? 'up' : 'down',
        impact: 'positive'
      }
    };
  }

  getAlerts() {
    return this.alerts;
  }

  getCriticalAlerts() {
    return this.alerts.filter(alert => alert.type === 'error');
  }

  getWarningAlerts() {
    return this.alerts.filter(alert => alert.type === 'warning');
  }

  exportBusinessReport(format = 'json') {
    const report = this.getBusinessReport();
    
    let content;
    let filename;
    let mimeType;
    
    switch (format) {
      case 'csv':
        content = this.convertToCSV(report);
        filename = 'axyra-business-report.csv';
        mimeType = 'text/csv';
        break;
      case 'excel':
        content = this.convertToExcel(report);
        filename = 'axyra-business-report.xlsx';
        mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        break;
      case 'json':
      default:
        content = JSON.stringify(report, null, 2);
        filename = 'axyra-business-report.json';
        mimeType = 'application/json';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log(`📊 Reporte de negocio exportado: ${filename}`);
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Reporte de negocio exportado: ${filename}`);
    }
  }

  convertToCSV(report) {
    const rows = [];
    
    // Resumen
    rows.push(['Métrica', 'Valor']);
    rows.push(['Total Empleados', report.summary.totalEmployees]);
    rows.push(['Empleados Activos', report.summary.activeEmployees]);
    rows.push(['Ingresos Totales', report.summary.totalRevenue]);
    rows.push(['Costos Totales', report.summary.totalCosts]);
    rows.push(['Beneficio', report.summary.profit]);
    rows.push(['Margen de Beneficio', report.summary.profitMargin + '%']);
    
    rows.push([]);
    rows.push(['KPI', 'Valor']);
    Object.entries(report.kpis).forEach(([kpi, value]) => {
      rows.push([kpi, value]);
    });
    
    rows.push([]);
    rows.push(['Tendencia', 'Valor']);
    Object.entries(report.trends).forEach(([trend, value]) => {
      rows.push([trend, value + '%']);
    });
    
    return rows.map(row => row.join(',')).join('\n');
  }

  convertToExcel(report) {
    // Simular conversión a Excel (en un entorno real usaría una librería como SheetJS)
    return this.convertToCSV(report);
  }

  refreshMetrics() {
    console.log('🔄 Actualizando métricas de negocio...');
    this.loadData();
    this.calculateMetrics();
    this.setupKPIs();
    this.setupTrends();
    this.setupAlerts();
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Métricas de negocio actualizadas');
    }
  }

  getMetricValue(category, metric) {
    return this.metrics[category]?.[metric] || 0;
  }

  getKPIValue(kpi) {
    return this.kpis[kpi] || 0;
  }

  getTrendValue(trend) {
    return this.trends[trend] || 0;
  }

  formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(value);
  }

  formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  formatNumber(value) {
    return new Intl.NumberFormat('es-CO').format(value);
  }
}

// Inicializar sistema de métricas de negocio
let axyraBusinessMetrics;
document.addEventListener('DOMContentLoaded', () => {
  axyraBusinessMetrics = new AxyraBusinessMetrics();
  window.axyraBusinessMetrics = axyraBusinessMetrics;
});

// Exportar para uso global
window.AxyraBusinessMetrics = AxyraBusinessMetrics;
