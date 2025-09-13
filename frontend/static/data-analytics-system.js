/**
 * AXYRA - Sistema de Gestión de Datos y Análisis
 * Maneja recopilación, procesamiento, análisis y visualización de datos
 */

class AxyraDataAnalyticsSystem {
  constructor() {
    this.dataSources = [];
    this.dataSets = [];
    this.dataQueries = [];
    this.dataVisualizations = [];
    this.dataReports = [];
    this.dataMetrics = [];
    this.dataInsights = [];
    this.dataAlerts = [];
    this.dataLogs = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('📊 Inicializando sistema de datos y análisis...');
    this.loadDataSources();
    this.loadDataSets();
    this.loadDataQueries();
    this.loadDataVisualizations();
    this.loadDataReports();
    this.loadDataMetrics();
    this.loadDataInsights();
    this.loadDataAlerts();
    this.loadDataLogs();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadDataSources() {
    try {
      const stored = localStorage.getItem('axyra_data_sources');
      if (stored) {
        this.dataSources = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando fuentes de datos:', error);
    }
  }

  saveDataSources() {
    try {
      localStorage.setItem('axyra_data_sources', JSON.stringify(this.dataSources));
    } catch (error) {
      console.error('Error guardando fuentes de datos:', error);
    }
  }

  loadDataSets() {
    try {
      const stored = localStorage.getItem('axyra_data_sets');
      if (stored) {
        this.dataSets = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando conjuntos de datos:', error);
    }
  }

  saveDataSets() {
    try {
      localStorage.setItem('axyra_data_sets', JSON.stringify(this.dataSets));
    } catch (error) {
      console.error('Error guardando conjuntos de datos:', error);
    }
  }

  loadDataQueries() {
    try {
      const stored = localStorage.getItem('axyra_data_queries');
      if (stored) {
        this.dataQueries = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando consultas de datos:', error);
    }
  }

  saveDataQueries() {
    try {
      localStorage.setItem('axyra_data_queries', JSON.stringify(this.dataQueries));
    } catch (error) {
      console.error('Error guardando consultas de datos:', error);
    }
  }

  loadDataVisualizations() {
    try {
      const stored = localStorage.getItem('axyra_data_visualizations');
      if (stored) {
        this.dataVisualizations = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando visualizaciones de datos:', error);
    }
  }

  saveDataVisualizations() {
    try {
      localStorage.setItem('axyra_data_visualizations', JSON.stringify(this.dataVisualizations));
    } catch (error) {
      console.error('Error guardando visualizaciones de datos:', error);
    }
  }

  loadDataReports() {
    try {
      const stored = localStorage.getItem('axyra_data_reports');
      if (stored) {
        this.dataReports = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando reportes de datos:', error);
    }
  }

  saveDataReports() {
    try {
      localStorage.setItem('axyra_data_reports', JSON.stringify(this.dataReports));
    } catch (error) {
      console.error('Error guardando reportes de datos:', error);
    }
  }

  loadDataMetrics() {
    try {
      const stored = localStorage.getItem('axyra_data_metrics');
      if (stored) {
        this.dataMetrics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando métricas de datos:', error);
    }
  }

  saveDataMetrics() {
    try {
      localStorage.setItem('axyra_data_metrics', JSON.stringify(this.dataMetrics));
    } catch (error) {
      console.error('Error guardando métricas de datos:', error);
    }
  }

  loadDataInsights() {
    try {
      const stored = localStorage.getItem('axyra_data_insights');
      if (stored) {
        this.dataInsights = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando insights de datos:', error);
    }
  }

  saveDataInsights() {
    try {
      localStorage.setItem('axyra_data_insights', JSON.stringify(this.dataInsights));
    } catch (error) {
      console.error('Error guardando insights de datos:', error);
    }
  }

  loadDataAlerts() {
    try {
      const stored = localStorage.getItem('axyra_data_alerts');
      if (stored) {
        this.dataAlerts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando alertas de datos:', error);
    }
  }

  saveDataAlerts() {
    try {
      localStorage.setItem('axyra_data_alerts', JSON.stringify(this.dataAlerts));
    } catch (error) {
      console.error('Error guardando alertas de datos:', error);
    }
  }

  loadDataLogs() {
    try {
      const stored = localStorage.getItem('axyra_data_logs');
      if (stored) {
        this.dataLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando logs de datos:', error);
    }
  }

  saveDataLogs() {
    try {
      localStorage.setItem('axyra_data_logs', JSON.stringify(this.dataLogs));
    } catch (error) {
      console.error('Error guardando logs de datos:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en fuentes de datos
    document.addEventListener('dataSourceChanged', (event) => {
      this.handleDataSourceChange(event.detail);
    });

    // Escuchar cambios en conjuntos de datos
    document.addEventListener('dataSetChanged', (event) => {
      this.handleDataSetChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.dataSources.length === 0) {
      this.dataSources = [
        {
          id: 'local_storage',
          name: 'Almacenamiento Local',
          description: 'Datos almacenados en localStorage del navegador',
          type: 'local_storage',
          connectionString: 'localStorage',
          isActive: true,
        },
        {
          id: 'firebase',
          name: 'Firebase',
          description: 'Base de datos en la nube de Firebase',
          type: 'firebase',
          connectionString: 'firebase://axyra-db',
          isActive: true,
        },
      ];
      this.saveDataSources();
    }

    if (this.dataSets.length === 0) {
      this.dataSets = [
        {
          id: 'employees_dataset',
          name: 'Conjunto de Datos de Empleados',
          description: 'Datos de empleados del sistema',
          sourceId: 'local_storage',
          tableName: 'axyra_empleados',
          fields: ['id', 'nombre', 'apellido', 'email', 'departamento', 'salario'],
          isActive: true,
        },
        {
          id: 'hours_dataset',
          name: 'Conjunto de Datos de Horas',
          description: 'Datos de horas trabajadas',
          sourceId: 'local_storage',
          tableName: 'axyra_horas',
          fields: ['id', 'empleado_id', 'fecha', 'horas_trabajadas', 'tipo_hora'],
          isActive: true,
        },
      ];
      this.saveDataSets();
    }
  }

  handleDataSourceChange(change) {
    const { sourceId, action, data } = change;

    switch (action) {
      case 'created':
        this.dataSources.push(data);
        this.saveDataSources();
        break;
      case 'updated':
        const sourceIndex = this.dataSources.findIndex((s) => s.id === sourceId);
        if (sourceIndex !== -1) {
          this.dataSources[sourceIndex] = { ...this.dataSources[sourceIndex], ...data };
          this.saveDataSources();
        }
        break;
      case 'deleted':
        this.dataSources = this.dataSources.filter((s) => s.id !== sourceId);
        this.saveDataSources();
        break;
    }
  }

  handleDataSetChange(change) {
    const { dataSetId, action, data } = change;

    switch (action) {
      case 'created':
        this.dataSets.push(data);
        this.saveDataSets();
        break;
      case 'updated':
        const dataSetIndex = this.dataSets.findIndex((d) => d.id === dataSetId);
        if (dataSetIndex !== -1) {
          this.dataSets[dataSetIndex] = { ...this.dataSets[dataSetIndex], ...data };
          this.saveDataSets();
        }
        break;
      case 'deleted':
        this.dataSets = this.dataSets.filter((d) => d.id !== dataSetId);
        this.saveDataSets();
        break;
    }
  }

  createDataSource(sourceData) {
    const source = {
      id: 'source_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: sourceData.name,
      description: sourceData.description || '',
      type: sourceData.type, // local_storage, firebase, mysql, postgresql, mongodb, api
      connectionString: sourceData.connectionString || '',
      credentials: sourceData.credentials || {},
      configuration: sourceData.configuration || {},
      isActive: sourceData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataSources.push(source);
    this.saveDataSources();

    console.log('✅ Fuente de datos creada:', source.name);
    return source;
  }

  createDataSet(dataSetData) {
    const dataSet = {
      id: 'dataset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: dataSetData.name,
      description: dataSetData.description || '',
      sourceId: dataSetData.sourceId,
      tableName: dataSetData.tableName || '',
      fields: dataSetData.fields || [],
      filters: dataSetData.filters || [],
      isActive: dataSetData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataSets.push(dataSet);
    this.saveDataSets();

    console.log('✅ Conjunto de datos creado:', dataSet.name);
    return dataSet;
  }

  createDataQuery(queryData) {
    const query = {
      id: 'query_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: queryData.name,
      description: queryData.description || '',
      dataSetId: queryData.dataSetId,
      sql: queryData.sql || '',
      parameters: queryData.parameters || [],
      isActive: queryData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataQueries.push(query);
    this.saveDataQueries();

    console.log('✅ Consulta de datos creada:', query.name);
    return query;
  }

  createDataVisualization(visualizationData) {
    const visualization = {
      id: 'viz_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: visualizationData.name,
      description: visualizationData.description || '',
      type: visualizationData.type, // chart, table, map, dashboard
      dataSetId: visualizationData.dataSetId,
      configuration: visualizationData.configuration || {},
      isActive: visualizationData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataVisualizations.push(visualization);
    this.saveDataVisualizations();

    console.log('✅ Visualización de datos creada:', visualization.name);
    return visualization;
  }

  createDataReport(reportData) {
    const report = {
      id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: reportData.name,
      description: reportData.description || '',
      type: reportData.type, // summary, detailed, executive, operational
      dataSetIds: reportData.dataSetIds || [],
      visualizations: reportData.visualizations || [],
      filters: reportData.filters || [],
      isGenerated: reportData.isGenerated || false,
      generatedAt: reportData.generatedAt || null,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataReports.push(report);
    this.saveDataReports();

    console.log('✅ Reporte de datos creado:', report.name);
    return report;
  }

  createDataMetric(metricData) {
    const metric = {
      id: 'metric_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: metricData.name,
      description: metricData.description || '',
      category: metricData.category || 'general', // general, performance, business, technical
      value: metricData.value || 0,
      unit: metricData.unit || 'count',
      threshold: metricData.threshold || 0,
      isAboveThreshold: metricData.isAboveThreshold || false,
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.dataMetrics.push(metric);
    this.saveDataMetrics();

    console.log('✅ Métrica de datos creada:', metric.name);
    return metric;
  }

  createDataInsight(insightData) {
    const insight = {
      id: 'insight_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: insightData.title,
      description: insightData.description || '',
      category: insightData.category || 'general', // general, trend, anomaly, prediction, recommendation
      dataSetId: insightData.dataSetId,
      confidence: insightData.confidence || 0, // 0-100
      impact: insightData.impact || 'medium', // low, medium, high
      isActionable: insightData.isActionable || false,
      actions: insightData.actions || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataInsights.push(insight);
    this.saveDataInsights();

    console.log('✅ Insight de datos creado:', insight.title);
    return insight;
  }

  createDataAlert(alertData) {
    const alert = {
      id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: alertData.name,
      description: alertData.description || '',
      type: alertData.type, // threshold, anomaly, trend, data_quality
      dataSetId: alertData.dataSetId,
      condition: alertData.condition || '',
      threshold: alertData.threshold || 0,
      isTriggered: alertData.isTriggered || false,
      triggeredAt: alertData.triggeredAt || null,
      isResolved: alertData.isResolved || false,
      resolvedAt: alertData.resolvedAt || null,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.dataAlerts.push(alert);
    this.saveDataAlerts();

    console.log('✅ Alerta de datos creada:', alert.name);
    return alert;
  }

  createDataLog(logData) {
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      level: logData.level, // info, warning, error, debug
      message: logData.message,
      source: logData.source || 'system',
      category: logData.category || 'general', // general, data_processing, visualization, reporting
      data: logData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.dataLogs.push(log);
    this.saveDataLogs();

    console.log('✅ Log de datos creado:', log.message);
    return log;
  }

  getDataStatistics() {
    const totalSources = this.dataSources.length;
    const activeSources = this.dataSources.filter((s) => s.isActive).length;
    const totalDataSets = this.dataSets.length;
    const activeDataSets = this.dataSets.filter((d) => d.isActive).length;
    const totalQueries = this.dataQueries.length;
    const activeQueries = this.dataQueries.filter((q) => q.isActive).length;
    const totalVisualizations = this.dataVisualizations.length;
    const activeVisualizations = this.dataVisualizations.filter((v) => v.isActive).length;
    const totalReports = this.dataReports.length;
    const generatedReports = this.dataReports.filter((r) => r.isGenerated).length;
    const totalMetrics = this.dataMetrics.length;
    const aboveThresholdMetrics = this.dataMetrics.filter((m) => m.isAboveThreshold).length;
    const totalInsights = this.dataInsights.length;
    const actionableInsights = this.dataInsights.filter((i) => i.isActionable).length;
    const totalAlerts = this.dataAlerts.length;
    const triggeredAlerts = this.dataAlerts.filter((a) => a.isTriggered).length;
    const totalLogs = this.dataLogs.length;
    const errorLogs = this.dataLogs.filter((l) => l.level === 'error').length;

    return {
      totalSources,
      activeSources,
      totalDataSets,
      activeDataSets,
      totalQueries,
      activeQueries,
      totalVisualizations,
      activeVisualizations,
      totalReports,
      generatedReports,
      totalMetrics,
      aboveThresholdMetrics,
      totalInsights,
      actionableInsights,
      totalAlerts,
      triggeredAlerts,
      totalLogs,
      errorLogs,
    };
  }

  showDataAnalyticsDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'data-analytics-dashboard';
    dashboard.innerHTML = `
      <div class="data-analytics-dashboard-overlay">
        <div class="data-analytics-dashboard-container">
          <div class="data-analytics-dashboard-header">
            <h3>📊 Dashboard de Datos y Análisis</h3>
            <div class="data-analytics-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraDataAnalyticsSystem.showCreateDataSourceDialog()">Nueva Fuente</button>
              <button class="btn btn-secondary" onclick="axyraDataAnalyticsSystem.showCreateDataSetDialog()">Nuevo Conjunto</button>
              <button class="btn btn-close" onclick="document.getElementById('data-analytics-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="data-analytics-dashboard-body">
            <div class="data-analytics-dashboard-stats">
              ${this.renderDataStats()}
            </div>
            <div class="data-analytics-dashboard-content">
              <div class="data-analytics-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="sources">Fuentes</button>
                <button class="tab-btn" data-tab="datasets">Conjuntos</button>
                <button class="tab-btn" data-tab="queries">Consultas</button>
                <button class="tab-btn" data-tab="visualizations">Visualizaciones</button>
                <button class="tab-btn" data-tab="reports">Reportes</button>
                <button class="tab-btn" data-tab="insights">Insights</button>
                <button class="tab-btn" data-tab="alerts">Alertas</button>
                <button class="tab-btn" data-tab="logs">Logs</button>
              </div>
              <div class="data-analytics-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="sources-tab">
                  ${this.renderSourcesList()}
                </div>
                <div class="tab-content" id="datasets-tab">
                  ${this.renderDataSetsList()}
                </div>
                <div class="tab-content" id="queries-tab">
                  ${this.renderQueriesList()}
                </div>
                <div class="tab-content" id="visualizations-tab">
                  ${this.renderVisualizationsList()}
                </div>
                <div class="tab-content" id="reports-tab">
                  ${this.renderReportsList()}
                </div>
                <div class="tab-content" id="insights-tab">
                  ${this.renderInsightsList()}
                </div>
                <div class="tab-content" id="alerts-tab">
                  ${this.renderAlertsList()}
                </div>
                <div class="tab-content" id="logs-tab">
                  ${this.renderLogsList()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    dashboard.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(dashboard);

    // Configurar tabs
    const tabBtns = dashboard.querySelectorAll('.tab-btn');
    const tabContents = dashboard.querySelectorAll('.tab-content');

    tabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;

        tabBtns.forEach((b) => b.classList.remove('active'));
        tabContents.forEach((c) => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  }

  renderDataStats() {
    const stats = this.getDataStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalSources}</div>
          <div class="stat-label">Total Fuentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeSources}</div>
          <div class="stat-label">Fuentes Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalDataSets}</div>
          <div class="stat-label">Total Conjuntos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeDataSets}</div>
          <div class="stat-label">Conjuntos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalQueries}</div>
          <div class="stat-label">Total Consultas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeQueries}</div>
          <div class="stat-label">Consultas Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalVisualizations}</div>
          <div class="stat-label">Total Visualizaciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeVisualizations}</div>
          <div class="stat-label">Visualizaciones Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalReports}</div>
          <div class="stat-label">Total Reportes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.generatedReports}</div>
          <div class="stat-label">Reportes Generados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalInsights}</div>
          <div class="stat-label">Total Insights</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.actionableInsights}</div>
          <div class="stat-label">Insights Accionables</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalAlerts}</div>
          <div class="stat-label">Total Alertas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.triggeredAlerts}</div>
          <div class="stat-label">Alertas Activadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalLogs}</div>
          <div class="stat-label">Total Logs</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.errorLogs}</div>
          <div class="stat-label">Logs de Error</div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const stats = this.getDataStatistics();

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Datos</h4>
          <div class="data-status">
            <div class="status-item">
              <span>Fuentes Activas</span>
              <span>${stats.activeSources}/${stats.totalSources}</span>
            </div>
            <div class="status-item">
              <span>Conjuntos Activos</span>
              <span>${stats.activeDataSets}/${stats.totalDataSets}</span>
            </div>
            <div class="status-item">
              <span>Consultas Activas</span>
              <span>${stats.activeQueries}/${stats.totalQueries}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Visualizaciones y Reportes</h4>
          <div class="visualizations-reports">
            <div class="viz-item">
              <span>Visualizaciones Activas</span>
              <span>${stats.activeVisualizations}</span>
            </div>
            <div class="viz-item">
              <span>Reportes Generados</span>
              <span>${stats.generatedReports}</span>
            </div>
            <div class="viz-item">
              <span>Total Reportes</span>
              <span>${stats.totalReports}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Insights y Alertas</h4>
          <div class="insights-alerts">
            <div class="insight-item">
              <span>Insights Accionables</span>
              <span>${stats.actionableInsights}</span>
            </div>
            <div class="insight-item">
              <span>Alertas Activadas</span>
              <span>${stats.triggeredAlerts}</span>
            </div>
            <div class="insight-item">
              <span>Total Alertas</span>
              <span>${stats.totalAlerts}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderSourcesList() {
    const sources = this.dataSources.slice(-20); // Últimas 20 fuentes

    return sources
      .map(
        (source) => `
      <div class="source-card">
        <div class="source-header">
          <h5>${source.name}</h5>
          <span class="source-status ${source.isActive ? 'active' : 'inactive'}">${
          source.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="source-info">
          <p>${source.description}</p>
          <p>Tipo: ${source.type}</p>
          <p>Conexión: ${source.connectionString}</p>
        </div>
        <div class="source-actions">
          <button onclick="axyraDataAnalyticsSystem.showSourceDetails('${source.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.editSource('${source.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderDataSetsList() {
    const dataSets = this.dataSets.slice(-20); // Últimos 20 conjuntos

    return dataSets
      .map(
        (dataSet) => `
      <div class="dataset-card">
        <div class="dataset-header">
          <h5>${dataSet.name}</h5>
          <span class="dataset-status ${dataSet.isActive ? 'active' : 'inactive'}">${
          dataSet.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="dataset-info">
          <p>${dataSet.description}</p>
          <p>Tabla: ${dataSet.tableName}</p>
          <p>Campos: ${dataSet.fields.length}</p>
        </div>
        <div class="dataset-actions">
          <button onclick="axyraDataAnalyticsSystem.showDataSetDetails('${dataSet.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.editDataSet('${dataSet.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderQueriesList() {
    const queries = this.dataQueries.slice(-20); // Últimas 20 consultas

    return queries
      .map(
        (query) => `
      <div class="query-card">
        <div class="query-header">
          <h5>${query.name}</h5>
          <span class="query-status ${query.isActive ? 'active' : 'inactive'}">${
          query.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="query-info">
          <p>${query.description}</p>
          <p>SQL: ${query.sql.substring(0, 100)}...</p>
        </div>
        <div class="query-actions">
          <button onclick="axyraDataAnalyticsSystem.showQueryDetails('${query.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.editQuery('${query.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderVisualizationsList() {
    const visualizations = this.dataVisualizations.slice(-20); // Últimas 20 visualizaciones

    return visualizations
      .map(
        (visualization) => `
      <div class="visualization-card">
        <div class="visualization-header">
          <h5>${visualization.name}</h5>
          <span class="visualization-status ${visualization.isActive ? 'active' : 'inactive'}">${
          visualization.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="visualization-info">
          <p>${visualization.description}</p>
          <p>Tipo: ${visualization.type}</p>
        </div>
        <div class="visualization-actions">
          <button onclick="axyraDataAnalyticsSystem.showVisualizationDetails('${visualization.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.editVisualization('${visualization.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderReportsList() {
    const reports = this.dataReports.slice(-20); // Últimos 20 reportes

    return reports
      .map(
        (report) => `
      <div class="report-card">
        <div class="report-header">
          <h5>${report.name}</h5>
          <span class="report-status ${report.isGenerated ? 'generated' : 'pending'}">${
          report.isGenerated ? 'Generado' : 'Pendiente'
        }</span>
        </div>
        <div class="report-info">
          <p>${report.description}</p>
          <p>Tipo: ${report.type}</p>
          <p>Conjuntos: ${report.dataSetIds.length}</p>
        </div>
        <div class="report-actions">
          <button onclick="axyraDataAnalyticsSystem.showReportDetails('${report.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.generateReport('${report.id}')">Generar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderInsightsList() {
    const insights = this.dataInsights.slice(-20); // Últimos 20 insights

    return insights
      .map(
        (insight) => `
      <div class="insight-card">
        <div class="insight-header">
          <h5>${insight.title}</h5>
          <span class="insight-impact impact-${insight.impact}">${insight.impact}</span>
        </div>
        <div class="insight-info">
          <p>${insight.description}</p>
          <p>Categoría: ${insight.category}</p>
          <p>Confianza: ${insight.confidence}%</p>
          <p>Accionable: ${insight.isActionable ? 'Sí' : 'No'}</p>
        </div>
        <div class="insight-actions">
          <button onclick="axyraDataAnalyticsSystem.showInsightDetails('${insight.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.editInsight('${insight.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderAlertsList() {
    const alerts = this.dataAlerts.slice(-20); // Últimas 20 alertas

    return alerts
      .map(
        (alert) => `
      <div class="alert-card">
        <div class="alert-header">
          <h5>${alert.name}</h5>
          <span class="alert-status ${alert.isTriggered ? 'triggered' : 'normal'}">${
          alert.isTriggered ? 'Activada' : 'Normal'
        }</span>
        </div>
        <div class="alert-info">
          <p>${alert.description}</p>
          <p>Tipo: ${alert.type}</p>
          <p>Condición: ${alert.condition}</p>
          <p>Umbral: ${alert.threshold}</p>
        </div>
        <div class="alert-actions">
          <button onclick="axyraDataAnalyticsSystem.showAlertDetails('${alert.id}')">Ver</button>
          <button onclick="axyraDataAnalyticsSystem.resolveAlert('${alert.id}')">Resolver</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderLogsList() {
    const logs = this.dataLogs.slice(-20); // Últimos 20 logs

    return logs
      .map(
        (log) => `
      <div class="log-card">
        <div class="log-header">
          <h5>${log.message}</h5>
          <span class="log-level level-${log.level}">${log.level}</span>
        </div>
        <div class="log-info">
          <p>Fuente: ${log.source}</p>
          <p>Categoría: ${log.category}</p>
          <p>Fecha: ${new Date(log.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  showCreateDataSourceDialog() {
    const name = prompt('Nombre de la fuente de datos:');
    if (name) {
      const type = prompt('Tipo (local_storage, firebase, mysql, postgresql, mongodb, api):');
      const connectionString = prompt('Cadena de conexión:');
      this.createDataSource({ name, type, connectionString });
    }
  }

  showCreateDataSetDialog() {
    const name = prompt('Nombre del conjunto de datos:');
    if (name) {
      const sourceId = prompt('ID de la fuente de datos:');
      const tableName = prompt('Nombre de la tabla:');
      this.createDataSet({ name, sourceId, tableName });
    }
  }

  showSourceDetails(sourceId) {
    const source = this.dataSources.find((s) => s.id === sourceId);
    if (source) {
      alert(
        `Fuente: ${source.name}\nDescripción: ${source.description}\nTipo: ${source.type}\nConexión: ${source.connectionString}`
      );
    }
  }

  editSource(sourceId) {
    const source = this.dataSources.find((s) => s.id === sourceId);
    if (source) {
      const newName = prompt('Nuevo nombre:', source.name);
      if (newName) {
        source.name = newName;
        this.saveDataSources();
      }
    }
  }

  showDataSetDetails(dataSetId) {
    const dataSet = this.dataSets.find((d) => d.id === dataSetId);
    if (dataSet) {
      alert(
        `Conjunto: ${dataSet.name}\nDescripción: ${dataSet.description}\nTabla: ${
          dataSet.tableName
        }\nCampos: ${dataSet.fields.join(', ')}`
      );
    }
  }

  editDataSet(dataSetId) {
    const dataSet = this.dataSets.find((d) => d.id === dataSetId);
    if (dataSet) {
      const newName = prompt('Nuevo nombre:', dataSet.name);
      if (newName) {
        dataSet.name = newName;
        this.saveDataSets();
      }
    }
  }

  showQueryDetails(queryId) {
    const query = this.dataQueries.find((q) => q.id === queryId);
    if (query) {
      alert(`Consulta: ${query.name}\nDescripción: ${query.description}\nSQL: ${query.sql}`);
    }
  }

  editQuery(queryId) {
    const query = this.dataQueries.find((q) => q.id === queryId);
    if (query) {
      const newName = prompt('Nuevo nombre:', query.name);
      if (newName) {
        query.name = newName;
        this.saveDataQueries();
      }
    }
  }

  showVisualizationDetails(visualizationId) {
    const visualization = this.dataVisualizations.find((v) => v.id === visualizationId);
    if (visualization) {
      alert(
        `Visualización: ${visualization.name}\nDescripción: ${visualization.description}\nTipo: ${visualization.type}`
      );
    }
  }

  editVisualization(visualizationId) {
    const visualization = this.dataVisualizations.find((v) => v.id === visualizationId);
    if (visualization) {
      const newName = prompt('Nuevo nombre:', visualization.name);
      if (newName) {
        visualization.name = newName;
        this.saveDataVisualizations();
      }
    }
  }

  showReportDetails(reportId) {
    const report = this.dataReports.find((r) => r.id === reportId);
    if (report) {
      alert(
        `Reporte: ${report.name}\nDescripción: ${report.description}\nTipo: ${report.type}\nEstado: ${
          report.isGenerated ? 'Generado' : 'Pendiente'
        }`
      );
    }
  }

  generateReport(reportId) {
    const report = this.dataReports.find((r) => r.id === reportId);
    if (report) {
      report.isGenerated = true;
      report.generatedAt = new Date().toISOString();
      this.saveDataReports();
    }
  }

  showInsightDetails(insightId) {
    const insight = this.dataInsights.find((i) => i.id === insightId);
    if (insight) {
      alert(
        `Insight: ${insight.title}\nDescripción: ${insight.description}\nCategoría: ${insight.category}\nConfianza: ${
          insight.confidence
        }%\nAccionable: ${insight.isActionable ? 'Sí' : 'No'}`
      );
    }
  }

  editInsight(insightId) {
    const insight = this.dataInsights.find((i) => i.id === insightId);
    if (insight) {
      const newTitle = prompt('Nuevo título:', insight.title);
      if (newTitle) {
        insight.title = newTitle;
        this.saveDataInsights();
      }
    }
  }

  showAlertDetails(alertId) {
    const alert = this.dataAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert(
        `Alerta: ${alert.name}\nDescripción: ${alert.description}\nTipo: ${alert.type}\nCondición: ${alert.condition}\nUmbral: ${alert.threshold}`
      );
    }
  }

  resolveAlert(alertId) {
    const alert = this.dataAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isResolved = true;
      alert.resolvedAt = new Date().toISOString();
      this.saveDataAlerts();
    }
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }
}

// Inicializar sistema de datos y análisis
let axyraDataAnalyticsSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraDataAnalyticsSystem = new AxyraDataAnalyticsSystem();
  window.axyraDataAnalyticsSystem = axyraDataAnalyticsSystem;
});

// Exportar para uso global
window.AxyraDataAnalyticsSystem = AxyraDataAnalyticsSystem;

