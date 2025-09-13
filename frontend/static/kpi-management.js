/**
 * AXYRA - Sistema de Gestión de KPIs y Métricas
 * Maneja KPIs, métricas y dashboards ejecutivos
 */

class AxyraKPIManagement {
  constructor() {
    this.kpis = [];
    this.metrics = [];
    this.dashboards = [];
    this.widgets = [];
    this.alerts = [];
    this.reports = [];
    
    this.init();
  }

  init() {
    console.log('📊 Inicializando sistema de gestión de KPIs...');
    this.loadData();
    this.setupDefaultKPIs();
    this.setupMetricCalculators();
    this.setupAlertSystem();
    this.setupReportGenerators();
  }

  loadData() {
    try {
      this.kpis = JSON.parse(localStorage.getItem('axyra_kpis') || '[]');
      this.metrics = JSON.parse(localStorage.getItem('axyra_metrics') || '[]');
      this.dashboards = JSON.parse(localStorage.getItem('axyra_dashboards') || '[]');
      this.widgets = JSON.parse(localStorage.getItem('axyra_widgets') || '[]');
      this.alerts = JSON.parse(localStorage.getItem('axyra_kpi_alerts') || '[]');
      this.reports = JSON.parse(localStorage.getItem('axyra_kpi_reports') || '[]');
    } catch (error) {
      console.error('Error cargando datos de KPIs:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_kpis', JSON.stringify(this.kpis));
      localStorage.setItem('axyra_metrics', JSON.stringify(this.metrics));
      localStorage.setItem('axyra_dashboards', JSON.stringify(this.dashboards));
      localStorage.setItem('axyra_widgets', JSON.stringify(this.widgets));
      localStorage.setItem('axyra_kpi_alerts', JSON.stringify(this.alerts));
      localStorage.setItem('axyra_kpi_reports', JSON.stringify(this.reports));
    } catch (error) {
      console.error('Error guardando datos de KPIs:', error);
    }
  }

  setupDefaultKPIs() {
    if (this.kpis.length === 0) {
      this.kpis = [
        {
          id: 'revenue_growth',
          name: 'Crecimiento de Ingresos',
          description: 'Porcentaje de crecimiento de ingresos mensual',
          category: 'financial',
          type: 'percentage',
          target: 10,
          current: 0,
          unit: '%',
          frequency: 'monthly',
          formula: '((current_month - previous_month) / previous_month) * 100',
          dataSource: 'cash_flow',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'employee_satisfaction',
          name: 'Satisfacción del Empleado',
          description: 'Puntuación promedio de satisfacción del empleado',
          category: 'hr',
          type: 'score',
          target: 4.5,
          current: 0,
          unit: '/5',
          frequency: 'quarterly',
          formula: 'average(satisfaction_scores)',
          dataSource: 'surveys',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'customer_retention',
          name: 'Retención de Clientes',
          description: 'Porcentaje de clientes que se mantienen activos',
          category: 'customer',
          type: 'percentage',
          target: 85,
          current: 0,
          unit: '%',
          frequency: 'monthly',
          formula: '(retained_customers / total_customers) * 100',
          dataSource: 'customer_data',
          status: 'active',
          createdAt: new Date().toISOString()
        },
        {
          id: 'operational_efficiency',
          name: 'Eficiencia Operacional',
          description: 'Relación entre horas trabajadas y producción',
          category: 'operations',
          type: 'ratio',
          target: 0.8,
          current: 0,
          unit: 'ratio',
          frequency: 'weekly',
          formula: 'production_output / hours_worked',
          dataSource: 'operations',
          status: 'active',
          createdAt: new Date().toISOString()
        }
      ];
      this.saveData();
    }
  }

  setupMetricCalculators() {
    this.calculators = {
      financial: this.calculateFinancialMetrics.bind(this),
      hr: this.calculateHRMetrics.bind(this),
      operations: this.calculateOperationsMetrics.bind(this),
      customer: this.calculateCustomerMetrics.bind(this),
      system: this.calculateSystemMetrics.bind(this)
    };
  }

  setupAlertSystem() {
    // Configurar sistema de alertas para KPIs
    setInterval(() => {
      this.checkKPIAlerts();
    }, 60000); // Cada minuto
  }

  setupReportGenerators() {
    this.reportGenerators = {
      executive: this.generateExecutiveReport.bind(this),
      operational: this.generateOperationalReport.bind(this),
      financial: this.generateFinancialReport.bind(this),
      hr: this.generateHRReport.bind(this)
    };
  }

  createKPI(kpiData) {
    const kpi = {
      id: kpiData.id || 'kpi_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: kpiData.name,
      description: kpiData.description || '',
      category: kpiData.category || 'general',
      type: kpiData.type || 'number',
      target: kpiData.target || 0,
      current: kpiData.current || 0,
      unit: kpiData.unit || '',
      frequency: kpiData.frequency || 'monthly',
      formula: kpiData.formula || '',
      dataSource: kpiData.dataSource || '',
      status: kpiData.status || 'active',
      thresholds: kpiData.thresholds || {
        critical: 0,
        warning: 0,
        good: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };

    this.kpis.push(kpi);
    this.saveData();

    console.log('✅ KPI creado:', kpi.name);
    return kpi;
  }

  updateKPI(kpiId, updates) {
    const kpiIndex = this.kpis.findIndex(k => k.id === kpiId);
    if (kpiIndex === -1) {
      throw new Error('KPI no encontrado');
    }

    this.kpis[kpiIndex] = { 
      ...this.kpis[kpiIndex], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };

    this.saveData();
    console.log('✅ KPI actualizado:', this.kpis[kpiIndex].name);
    return this.kpis[kpiIndex];
  }

  deleteKPI(kpiId) {
    const kpiIndex = this.kpis.findIndex(k => k.id === kpiId);
    if (kpiIndex === -1) {
      throw new Error('KPI no encontrado');
    }

    const kpi = this.kpis[kpiIndex];
    this.kpis.splice(kpiIndex, 1);
    this.saveData();

    console.log('🗑️ KPI eliminado:', kpi.name);
    return kpi;
  }

  calculateKPI(kpiId) {
    const kpi = this.kpis.find(k => k.id === kpiId);
    if (!kpi) {
      throw new Error('KPI no encontrado');
    }

    const calculator = this.calculators[kpi.category];
    if (!calculator) {
      throw new Error(`Calculadora no encontrada para categoría: ${kpi.category}`);
    }

    const value = calculator(kpi);
    kpi.current = value;
    kpi.updatedAt = new Date().toISOString();

    this.saveData();
    return value;
  }

  calculateFinancialMetrics(kpi) {
    switch (kpi.id) {
      case 'revenue_growth':
        return this.calculateRevenueGrowth();
      case 'profit_margin':
        return this.calculateProfitMargin();
      case 'cost_per_employee':
        return this.calculateCostPerEmployee();
      default:
        return 0;
    }
  }

  calculateRevenueGrowth() {
    const cashData = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');
    if (cashData.length < 2) return 0;

    const currentMonth = cashData[cashData.length - 1];
    const previousMonth = cashData[cashData.length - 2];

    const currentRevenue = currentMonth.totalVentas || 0;
    const previousRevenue = previousMonth.totalVentas || 0;

    if (previousRevenue === 0) return 0;

    return ((currentRevenue - previousRevenue) / previousRevenue) * 100;
  }

  calculateProfitMargin() {
    const cashData = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');
    const payrollData = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');

    const totalRevenue = cashData.reduce((sum, c) => sum + (c.totalVentas || 0), 0);
    const totalCosts = payrollData.reduce((sum, p) => sum + (p.totalPagar || 0), 0);

    if (totalRevenue === 0) return 0;

    return ((totalRevenue - totalCosts) / totalRevenue) * 100;
  }

  calculateCostPerEmployee() {
    const employees = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    const payrollData = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');

    const activeEmployees = employees.filter(e => e.activo).length;
    const totalCosts = payrollData.reduce((sum, p) => sum + (p.totalPagar || 0), 0);

    if (activeEmployees === 0) return 0;

    return totalCosts / activeEmployees;
  }

  calculateHRMetrics(kpi) {
    switch (kpi.id) {
      case 'employee_satisfaction':
        return this.calculateEmployeeSatisfaction();
      case 'employee_retention':
        return this.calculateEmployeeRetention();
      case 'training_hours':
        return this.calculateTrainingHours();
      default:
        return 0;
    }
  }

  calculateEmployeeSatisfaction() {
    // Simular cálculo de satisfacción del empleado
    return 4.2;
  }

  calculateEmployeeRetention() {
    const employees = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    const totalEmployees = employees.length;
    const activeEmployees = employees.filter(e => e.activo).length;

    if (totalEmployees === 0) return 0;

    return (activeEmployees / totalEmployees) * 100;
  }

  calculateTrainingHours() {
    const hoursData = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    return hoursData.reduce((sum, h) => sum + (h.horasCapacitacion || 0), 0);
  }

  calculateOperationsMetrics(kpi) {
    switch (kpi.id) {
      case 'operational_efficiency':
        return this.calculateOperationalEfficiency();
      case 'inventory_turnover':
        return this.calculateInventoryTurnover();
      case 'quality_score':
        return this.calculateQualityScore();
      default:
        return 0;
    }
  }

  calculateOperationalEfficiency() {
    const hoursData = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    const totalHours = hoursData.reduce((sum, h) => sum + (h.horasTrabajadas || 0), 0);
    const totalProduction = hoursData.reduce((sum, h) => sum + (h.produccion || 0), 0);

    if (totalHours === 0) return 0;

    return totalProduction / totalHours;
  }

  calculateInventoryTurnover() {
    const inventoryData = JSON.parse(localStorage.getItem('axyra_inventario') || '[]');
    const cashData = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');

    const totalInventoryValue = inventoryData.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0);
    const totalSales = cashData.reduce((sum, c) => sum + (c.totalVentas || 0), 0);

    if (totalInventoryValue === 0) return 0;

    return totalSales / totalInventoryValue;
  }

  calculateQualityScore() {
    // Simular cálculo de puntuación de calidad
    return 8.5;
  }

  calculateCustomerMetrics(kpi) {
    switch (kpi.id) {
      case 'customer_retention':
        return this.calculateCustomerRetention();
      case 'customer_satisfaction':
        return this.calculateCustomerSatisfaction();
      case 'customer_acquisition_cost':
        return this.calculateCustomerAcquisitionCost();
      default:
        return 0;
    }
  }

  calculateCustomerRetention() {
    // Simular cálculo de retención de clientes
    return 85.5;
  }

  calculateCustomerSatisfaction() {
    // Simular cálculo de satisfacción del cliente
    return 4.3;
  }

  calculateCustomerAcquisitionCost() {
    // Simular cálculo de costo de adquisición de clientes
    return 150000;
  }

  calculateSystemMetrics(kpi) {
    switch (kpi.id) {
      case 'system_uptime':
        return this.calculateSystemUptime();
      case 'response_time':
        return this.calculateResponseTime();
      case 'error_rate':
        return this.calculateErrorRate();
      default:
        return 0;
    }
  }

  calculateSystemUptime() {
    // Simular cálculo de tiempo de actividad del sistema
    return 99.9;
  }

  calculateResponseTime() {
    // Simular cálculo de tiempo de respuesta
    return 150;
  }

  calculateErrorRate() {
    // Simular cálculo de tasa de errores
    return 0.1;
  }

  checkKPIAlerts() {
    this.kpis.forEach(kpi => {
      if (kpi.status !== 'active') return;

      const status = this.getKPIStatus(kpi);
      if (status !== 'good') {
        this.createKPIAlert(kpi, status);
      }
    });
  }

  getKPIStatus(kpi) {
    const current = kpi.current;
    const target = kpi.target;
    const thresholds = kpi.thresholds;

    if (current <= thresholds.critical) {
      return 'critical';
    } else if (current <= thresholds.warning) {
      return 'warning';
    } else if (current >= thresholds.good) {
      return 'good';
    } else {
      return 'needs_improvement';
    }
  }

  createKPIAlert(kpi, status) {
    const alert = {
      id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      kpiId: kpi.id,
      kpiName: kpi.name,
      status: status,
      currentValue: kpi.current,
      targetValue: kpi.target,
      message: this.getAlertMessage(kpi, status),
      createdAt: new Date().toISOString(),
      acknowledged: false,
      acknowledgedBy: null,
      acknowledgedAt: null
    };

    this.alerts.push(alert);
    this.saveData();

    // Enviar notificación
    if (window.axyraAdvancedNotifications) {
      window.axyraAdvancedNotifications.createNotification({
        title: `Alerta de KPI: ${kpi.name}`,
        message: alert.message,
        type: status === 'critical' ? 'error' : 'warning',
        channels: ['in-app', 'email']
      });
    }

    console.log('🚨 Alerta de KPI creada:', kpi.name);
    return alert;
  }

  getAlertMessage(kpi, status) {
    const messages = {
      critical: `${kpi.name} está en nivel crítico (${kpi.current}${kpi.unit}). Meta: ${kpi.target}${kpi.unit}`,
      warning: `${kpi.name} está por debajo del objetivo (${kpi.current}${kpi.unit}). Meta: ${kpi.target}${kpi.unit}`,
      needs_improvement: `${kpi.name} necesita mejora (${kpi.current}${kpi.unit}). Meta: ${kpi.target}${kpi.unit}`
    };

    return messages[status] || 'Alerta de KPI';
  }

  acknowledgeAlert(alertId) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.acknowledgedBy = this.getCurrentUser();
      alert.acknowledgedAt = new Date().toISOString();
      this.saveData();

      console.log('✅ Alerta reconocida:', alert.kpiName);
    }
  }

  createDashboard(dashboardData) {
    const dashboard = {
      id: dashboardData.id || 'dashboard_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: dashboardData.name,
      description: dashboardData.description || '',
      category: dashboardData.category || 'general',
      widgets: dashboardData.widgets || [],
      layout: dashboardData.layout || 'grid',
      permissions: dashboardData.permissions || ['view'],
      status: dashboardData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };

    this.dashboards.push(dashboard);
    this.saveData();

    console.log('✅ Dashboard creado:', dashboard.name);
    return dashboard;
  }

  createWidget(widgetData) {
    const widget = {
      id: widgetData.id || 'widget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: widgetData.name,
      type: widgetData.type, // 'chart', 'metric', 'table', 'gauge', 'progress'
      description: widgetData.description || '',
      kpiId: widgetData.kpiId || null,
      config: widgetData.config || {},
      position: widgetData.position || { x: 0, y: 0, w: 4, h: 3 },
      dashboardId: widgetData.dashboardId || null,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };

    this.widgets.push(widget);
    this.saveData();

    console.log('✅ Widget creado:', widget.name);
    return widget;
  }

  generateExecutiveReport() {
    const report = {
      id: 'exec_report_' + Date.now(),
      type: 'executive',
      title: 'Reporte Ejecutivo',
      period: 'monthly',
      data: {
        financial: this.getFinancialSummary(),
        operational: this.getOperationalSummary(),
        hr: this.getHRSummary(),
        customer: this.getCustomerSummary()
      },
      generatedAt: new Date().toISOString(),
      generatedBy: this.getCurrentUser()
    };

    this.reports.push(report);
    this.saveData();

    return report;
  }

  getFinancialSummary() {
    return {
      revenue: this.calculateRevenueGrowth(),
      profit: this.calculateProfitMargin(),
      costPerEmployee: this.calculateCostPerEmployee()
    };
  }

  getOperationalSummary() {
    return {
      efficiency: this.calculateOperationalEfficiency(),
      inventoryTurnover: this.calculateInventoryTurnover(),
      quality: this.calculateQualityScore()
    };
  }

  getHRSummary() {
    return {
      satisfaction: this.calculateEmployeeSatisfaction(),
      retention: this.calculateEmployeeRetention(),
      training: this.calculateTrainingHours()
    };
  }

  getCustomerSummary() {
    return {
      retention: this.calculateCustomerRetention(),
      satisfaction: this.calculateCustomerSatisfaction(),
      acquisitionCost: this.calculateCustomerAcquisitionCost()
    };
  }

  generateOperationalReport() {
    const report = {
      id: 'op_report_' + Date.now(),
      type: 'operational',
      title: 'Reporte Operacional',
      period: 'weekly',
      data: {
        efficiency: this.calculateOperationalEfficiency(),
        inventory: this.calculateInventoryTurnover(),
        quality: this.calculateQualityScore(),
        system: {
          uptime: this.calculateSystemUptime(),
          responseTime: this.calculateResponseTime(),
          errorRate: this.calculateErrorRate()
        }
      },
      generatedAt: new Date().toISOString(),
      generatedBy: this.getCurrentUser()
    };

    this.reports.push(report);
    this.saveData();

    return report;
  }

  generateFinancialReport() {
    const report = {
      id: 'fin_report_' + Date.now(),
      type: 'financial',
      title: 'Reporte Financiero',
      period: 'monthly',
      data: {
        revenue: this.calculateRevenueGrowth(),
        profit: this.calculateProfitMargin(),
        costPerEmployee: this.calculateCostPerEmployee(),
        cashFlow: this.getCashFlowData()
      },
      generatedAt: new Date().toISOString(),
      generatedBy: this.getCurrentUser()
    };

    this.reports.push(report);
    this.saveData();

    return report;
  }

  generateHRReport() {
    const report = {
      id: 'hr_report_' + Date.now(),
      type: 'hr',
      title: 'Reporte de Recursos Humanos',
      period: 'quarterly',
      data: {
        satisfaction: this.calculateEmployeeSatisfaction(),
        retention: this.calculateEmployeeRetention(),
        training: this.calculateTrainingHours(),
        demographics: this.getEmployeeDemographics()
      },
      generatedAt: new Date().toISOString(),
      generatedBy: this.getCurrentUser()
    };

    this.reports.push(report);
    this.saveData();

    return report;
  }

  getCashFlowData() {
    const cashData = JSON.parse(localStorage.getItem('axyra_cuadre_caja') || '[]');
    return cashData.map(c => ({
      date: c.fecha,
      sales: c.totalVentas || 0,
      cash: c.totalEfectivo || 0,
      card: c.totalTarjeta || 0
    }));
  }

  getEmployeeDemographics() {
    const employees = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    return {
      total: employees.length,
      active: employees.filter(e => e.activo).length,
      byDepartment: this.groupBy(employees, 'departamento'),
      byRole: this.groupBy(employees, 'rol')
    };
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'Sin especificar';
      groups[group] = (groups[group] || 0) + 1;
      return groups;
    }, {});
  }

  getKPIs(filters = {}) {
    let filteredKPIs = [...this.kpis];

    if (filters.category) {
      filteredKPIs = filteredKPIs.filter(k => k.category === filters.category);
    }

    if (filters.status) {
      filteredKPIs = filteredKPIs.filter(k => k.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredKPIs = filteredKPIs.filter(k => 
        k.name.toLowerCase().includes(searchTerm) ||
        k.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredKPIs;
  }

  getDashboards(filters = {}) {
    let filteredDashboards = [...this.dashboards];

    if (filters.category) {
      filteredDashboards = filteredDashboards.filter(d => d.category === filters.category);
    }

    if (filters.status) {
      filteredDashboards = filteredDashboards.filter(d => d.status === filters.status);
    }

    return filteredDashboards;
  }

  getAlerts(filters = {}) {
    let filteredAlerts = [...this.alerts];

    if (filters.status) {
      filteredAlerts = filteredAlerts.filter(a => a.status === filters.status);
    }

    if (filters.acknowledged !== undefined) {
      filteredAlerts = filteredAlerts.filter(a => a.acknowledged === filters.acknowledged);
    }

    if (filters.kpiId) {
      filteredAlerts = filteredAlerts.filter(a => a.kpiId === filters.kpiId);
    }

    return filteredAlerts;
  }

  getReports(filters = {}) {
    let filteredReports = [...this.reports];

    if (filters.type) {
      filteredReports = filteredReports.filter(r => r.type === filters.type);
    }

    if (filters.period) {
      filteredReports = filteredReports.filter(r => r.period === filters.period);
    }

    if (filters.dateFrom) {
      filteredReports = filteredReports.filter(r => 
        new Date(r.generatedAt) >= new Date(filters.dateFrom)
      );
    }

    if (filters.dateTo) {
      filteredReports = filteredReports.filter(r => 
        new Date(r.generatedAt) <= new Date(filters.dateTo)
      );
    }

    return filteredReports;
  }

  getKPIStatistics() {
    const totalKPIs = this.kpis.length;
    const activeKPIs = this.kpis.filter(k => k.status === 'active').length;
    const totalAlerts = this.alerts.length;
    const unacknowledgedAlerts = this.alerts.filter(a => !a.acknowledged).length;

    const categoryStats = {};
    this.kpis.forEach(kpi => {
      categoryStats[kpi.category] = (categoryStats[kpi.category] || 0) + 1;
    });

    return {
      totalKPIs: totalKPIs,
      activeKPIs: activeKPIs,
      totalAlerts: totalAlerts,
      unacknowledgedAlerts: unacknowledgedAlerts,
      categoryStats: categoryStats
    };
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  exportKPIs(format = 'json') {
    const data = {
      kpis: this.kpis,
      metrics: this.metrics,
      dashboards: this.dashboards,
      widgets: this.widgets,
      alerts: this.alerts,
      reports: this.reports,
      exportDate: new Date().toISOString()
    };

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertKPIsToCSV();
        filename = 'axyra-kpis.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-kpis.json';
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

    console.log('📊 KPIs exportados');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('KPIs exportados');
    }
  }

  convertKPIsToCSV() {
    const rows = [];

    // Encabezados
    rows.push(['ID', 'Nombre', 'Categoría', 'Tipo', 'Actual', 'Objetivo', 'Unidad', 'Estado', 'Creado']);

    // Datos
    this.kpis.forEach(kpi => {
      rows.push([
        kpi.id,
        kpi.name,
        kpi.category,
        kpi.type,
        kpi.current,
        kpi.target,
        kpi.unit,
        kpi.status,
        new Date(kpi.createdAt).toLocaleDateString()
      ]);
    });

    return rows.map(row => row.join(',')).join('\n');
  }
}

// Inicializar sistema de gestión de KPIs
let axyraKPIManagement;
document.addEventListener('DOMContentLoaded', () => {
  axyraKPIManagement = new AxyraKPIManagement();
  window.axyraKPIManagement = axyraKPIManagement;
});

// Exportar para uso global
window.AxyraKPIManagement = AxyraKPIManagement;
