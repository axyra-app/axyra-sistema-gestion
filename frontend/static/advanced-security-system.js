/**
 * AXYRA - Sistema de Seguridad Avanzada
 * Maneja autenticación, autorización, encriptación, auditoría y monitoreo de seguridad
 */

class AxyraAdvancedSecuritySystem {
  constructor() {
    this.securityPolicies = [];
    this.securityEvents = [];
    this.securityAlerts = [];
    this.securityIncidents = [];
    this.securityReports = [];
    this.securityMetrics = [];
    this.securityLogs = [];
    this.securityConfig = {};
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('🔒 Inicializando sistema de seguridad avanzada...');
    this.loadSecurityPolicies();
    this.loadSecurityEvents();
    this.loadSecurityAlerts();
    this.loadSecurityIncidents();
    this.loadSecurityReports();
    this.loadSecurityMetrics();
    this.loadSecurityLogs();
    this.loadSecurityConfig();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadSecurityPolicies() {
    try {
      const stored = localStorage.getItem('axyra_security_policies');
      if (stored) {
        this.securityPolicies = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando políticas de seguridad:', error);
    }
  }

  saveSecurityPolicies() {
    try {
      localStorage.setItem('axyra_security_policies', JSON.stringify(this.securityPolicies));
    } catch (error) {
      console.error('Error guardando políticas de seguridad:', error);
    }
  }

  loadSecurityEvents() {
    try {
      const stored = localStorage.getItem('axyra_security_events');
      if (stored) {
        this.securityEvents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando eventos de seguridad:', error);
    }
  }

  saveSecurityEvents() {
    try {
      localStorage.setItem('axyra_security_events', JSON.stringify(this.securityEvents));
    } catch (error) {
      console.error('Error guardando eventos de seguridad:', error);
    }
  }

  loadSecurityAlerts() {
    try {
      const stored = localStorage.getItem('axyra_security_alerts');
      if (stored) {
        this.securityAlerts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando alertas de seguridad:', error);
    }
  }

  saveSecurityAlerts() {
    try {
      localStorage.setItem('axyra_security_alerts', JSON.stringify(this.securityAlerts));
    } catch (error) {
      console.error('Error guardando alertas de seguridad:', error);
    }
  }

  loadSecurityIncidents() {
    try {
      const stored = localStorage.getItem('axyra_security_incidents');
      if (stored) {
        this.securityIncidents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando incidentes de seguridad:', error);
    }
  }

  saveSecurityIncidents() {
    try {
      localStorage.setItem('axyra_security_incidents', JSON.stringify(this.securityIncidents));
    } catch (error) {
      console.error('Error guardando incidentes de seguridad:', error);
    }
  }

  loadSecurityReports() {
    try {
      const stored = localStorage.getItem('axyra_security_reports');
      if (stored) {
        this.securityReports = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando reportes de seguridad:', error);
    }
  }

  saveSecurityReports() {
    try {
      localStorage.setItem('axyra_security_reports', JSON.stringify(this.securityReports));
    } catch (error) {
      console.error('Error guardando reportes de seguridad:', error);
    }
  }

  loadSecurityMetrics() {
    try {
      const stored = localStorage.getItem('axyra_security_metrics');
      if (stored) {
        this.securityMetrics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando métricas de seguridad:', error);
    }
  }

  saveSecurityMetrics() {
    try {
      localStorage.setItem('axyra_security_metrics', JSON.stringify(this.securityMetrics));
    } catch (error) {
      console.error('Error guardando métricas de seguridad:', error);
    }
  }

  loadSecurityLogs() {
    try {
      const stored = localStorage.getItem('axyra_security_logs');
      if (stored) {
        this.securityLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando logs de seguridad:', error);
    }
  }

  saveSecurityLogs() {
    try {
      localStorage.setItem('axyra_security_logs', JSON.stringify(this.securityLogs));
    } catch (error) {
      console.error('Error guardando logs de seguridad:', error);
    }
  }

  loadSecurityConfig() {
    try {
      const stored = localStorage.getItem('axyra_security_config');
      if (stored) {
        this.securityConfig = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando configuración de seguridad:', error);
    }
  }

  saveSecurityConfig() {
    try {
      localStorage.setItem('axyra_security_config', JSON.stringify(this.securityConfig));
    } catch (error) {
      console.error('Error guardando configuración de seguridad:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en políticas de seguridad
    document.addEventListener('securityPolicyChanged', (event) => {
      this.handleSecurityPolicyChange(event.detail);
    });

    // Escuchar cambios en eventos de seguridad
    document.addEventListener('securityEventChanged', (event) => {
      this.handleSecurityEventChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.securityPolicies.length === 0) {
      this.securityPolicies = [
        {
          id: 'password_policy',
          name: 'Política de Contraseñas',
          description: 'Política para el manejo de contraseñas',
          rules: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            maxAge: 90, // días
            preventReuse: 5,
          },
          isActive: true,
        },
        {
          id: 'session_policy',
          name: 'Política de Sesiones',
          description: 'Política para el manejo de sesiones',
          rules: {
            timeout: 30, // minutos
            maxConcurrent: 3,
            requireReauth: true,
          },
          isActive: true,
        },
      ];
      this.saveSecurityPolicies();
    }

    if (this.securityConfig.length === 0) {
      this.securityConfig = {
        encryption: {
          algorithm: 'AES-256-GCM',
          keyRotation: 90, // días
          isEnabled: true,
        },
        authentication: {
          mfaRequired: true,
          lockoutAttempts: 5,
          lockoutDuration: 15, // minutos
          isEnabled: true,
        },
        monitoring: {
          logLevel: 'info',
          retentionDays: 365,
          realTimeAlerts: true,
          isEnabled: true,
        },
      };
      this.saveSecurityConfig();
    }
  }

  handleSecurityPolicyChange(change) {
    const { policyId, action, data } = change;

    switch (action) {
      case 'created':
        this.securityPolicies.push(data);
        this.saveSecurityPolicies();
        break;
      case 'updated':
        const policyIndex = this.securityPolicies.findIndex((p) => p.id === policyId);
        if (policyIndex !== -1) {
          this.securityPolicies[policyIndex] = { ...this.securityPolicies[policyIndex], ...data };
          this.saveSecurityPolicies();
        }
        break;
      case 'deleted':
        this.securityPolicies = this.securityPolicies.filter((p) => p.id !== policyId);
        this.saveSecurityPolicies();
        break;
    }
  }

  handleSecurityEventChange(change) {
    const { eventId, action, data } = change;

    switch (action) {
      case 'created':
        this.securityEvents.push(data);
        this.saveSecurityEvents();
        break;
      case 'updated':
        const eventIndex = this.securityEvents.findIndex((e) => e.id === eventId);
        if (eventIndex !== -1) {
          this.securityEvents[eventIndex] = { ...this.securityEvents[eventIndex], ...data };
          this.saveSecurityEvents();
        }
        break;
      case 'deleted':
        this.securityEvents = this.securityEvents.filter((e) => e.id !== eventId);
        this.saveSecurityEvents();
        break;
    }
  }

  createSecurityPolicy(policyData) {
    const policy = {
      id: 'policy_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: policyData.name,
      description: policyData.description || '',
      category: policyData.category || 'general', // general, authentication, authorization, data, network
      rules: policyData.rules || {},
      severity: policyData.severity || 'medium', // low, medium, high, critical
      isActive: policyData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.securityPolicies.push(policy);
    this.saveSecurityPolicies();

    console.log('✅ Política de seguridad creada:', policy.name);
    return policy;
  }

  createSecurityEvent(eventData) {
    const event = {
      id: 'event_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: eventData.type, // login, logout, access_denied, data_access, config_change, security_violation
      severity: eventData.severity || 'info', // info, warning, error, critical
      message: eventData.message,
      source: eventData.source || 'system',
      userId: eventData.userId || this.getCurrentUser(),
      ipAddress: eventData.ipAddress || 'unknown',
      userAgent: eventData.userAgent || navigator.userAgent,
      data: eventData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.securityEvents.push(event);
    this.saveSecurityEvents();

    console.log('✅ Evento de seguridad creado:', event.message);
    return event;
  }

  createSecurityAlert(alertData) {
    const alert = {
      id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: alertData.type, // suspicious_activity, failed_login, data_breach, policy_violation
      severity: alertData.severity || 'warning', // info, warning, error, critical
      title: alertData.title,
      description: alertData.description || '',
      source: alertData.source || 'system',
      userId: alertData.userId || this.getCurrentUser(),
      isResolved: alertData.isResolved || false,
      resolvedAt: alertData.resolvedAt || null,
      resolvedBy: alertData.resolvedBy || null,
      data: alertData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.securityAlerts.push(alert);
    this.saveSecurityAlerts();

    console.log('✅ Alerta de seguridad creada:', alert.title);
    return alert;
  }

  createSecurityIncident(incidentData) {
    const incident = {
      id: 'incident_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: incidentData.title,
      description: incidentData.description || '',
      type: incidentData.type, // data_breach, unauthorized_access, malware, phishing
      severity: incidentData.severity || 'high', // low, medium, high, critical
      status: incidentData.status || 'open', // open, investigating, resolved, closed
      assignedTo: incidentData.assignedTo || null,
      priority: incidentData.priority || 'medium', // low, medium, high, urgent
      affectedUsers: incidentData.affectedUsers || [],
      affectedSystems: incidentData.affectedSystems || [],
      timeline: incidentData.timeline || [],
      resolution: incidentData.resolution || null,
      lessonsLearned: incidentData.lessonsLearned || null,
      isActive: incidentData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.securityIncidents.push(incident);
    this.saveSecurityIncidents();

    console.log('✅ Incidente de seguridad creado:', incident.title);
    return incident;
  }

  createSecurityReport(reportData) {
    const report = {
      id: 'report_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: reportData.title,
      description: reportData.description || '',
      type: reportData.type, // security_audit, compliance, incident, vulnerability
      period: reportData.period || 'monthly', // daily, weekly, monthly, quarterly, yearly
      startDate: reportData.startDate || new Date().toISOString(),
      endDate: reportData.endDate || new Date().toISOString(),
      data: reportData.data || {},
      findings: reportData.findings || [],
      recommendations: reportData.recommendations || [],
      isGenerated: reportData.isGenerated || false,
      generatedAt: reportData.generatedAt || null,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.securityReports.push(report);
    this.saveSecurityReports();

    console.log('✅ Reporte de seguridad creado:', report.title);
    return report;
  }

  createSecurityMetric(metricData) {
    const metric = {
      id: 'metric_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: metricData.name,
      description: metricData.description || '',
      category: metricData.category || 'general', // general, authentication, authorization, data, network
      value: metricData.value || 0,
      unit: metricData.unit || 'count',
      threshold: metricData.threshold || 0,
      isAboveThreshold: metricData.isAboveThreshold || false,
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.securityMetrics.push(metric);
    this.saveSecurityMetrics();

    console.log('✅ Métrica de seguridad creada:', metric.name);
    return metric;
  }

  createSecurityLog(logData) {
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      level: logData.level, // info, warning, error, debug
      message: logData.message,
      source: logData.source || 'system',
      category: logData.category || 'general', // general, authentication, authorization, data, network
      data: logData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.securityLogs.push(log);
    this.saveSecurityLogs();

    console.log('✅ Log de seguridad creado:', log.message);
    return log;
  }

  getSecurityStatistics() {
    const totalPolicies = this.securityPolicies.length;
    const activePolicies = this.securityPolicies.filter((p) => p.isActive).length;
    const totalEvents = this.securityEvents.length;
    const criticalEvents = this.securityEvents.filter((e) => e.severity === 'critical').length;
    const totalAlerts = this.securityAlerts.length;
    const unresolvedAlerts = this.securityAlerts.filter((a) => !a.isResolved).length;
    const totalIncidents = this.securityIncidents.length;
    const openIncidents = this.securityIncidents.filter((i) => i.status === 'open').length;
    const totalReports = this.securityReports.length;
    const generatedReports = this.securityReports.filter((r) => r.isGenerated).length;
    const totalMetrics = this.securityMetrics.length;
    const aboveThresholdMetrics = this.securityMetrics.filter((m) => m.isAboveThreshold).length;
    const totalLogs = this.securityLogs.length;
    const errorLogs = this.securityLogs.filter((l) => l.level === 'error').length;

    return {
      totalPolicies,
      activePolicies,
      totalEvents,
      criticalEvents,
      totalAlerts,
      unresolvedAlerts,
      totalIncidents,
      openIncidents,
      totalReports,
      generatedReports,
      totalMetrics,
      aboveThresholdMetrics,
      totalLogs,
      errorLogs,
    };
  }

  showSecurityDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'security-dashboard';
    dashboard.innerHTML = `
      <div class="security-dashboard-overlay">
        <div class="security-dashboard-container">
          <div class="security-dashboard-header">
            <h3>🔒 Dashboard de Seguridad</h3>
            <div class="security-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraAdvancedSecuritySystem.showCreatePolicyDialog()">Nueva Política</button>
              <button class="btn btn-secondary" onclick="axyraAdvancedSecuritySystem.showCreateAlertDialog()">Nueva Alerta</button>
              <button class="btn btn-close" onclick="document.getElementById('security-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="security-dashboard-body">
            <div class="security-dashboard-stats">
              ${this.renderSecurityStats()}
            </div>
            <div class="security-dashboard-content">
              <div class="security-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="policies">Políticas</button>
                <button class="tab-btn" data-tab="events">Eventos</button>
                <button class="tab-btn" data-tab="alerts">Alertas</button>
                <button class="tab-btn" data-tab="incidents">Incidentes</button>
                <button class="tab-btn" data-tab="reports">Reportes</button>
                <button class="tab-btn" data-tab="logs">Logs</button>
              </div>
              <div class="security-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="policies-tab">
                  ${this.renderPoliciesList()}
                </div>
                <div class="tab-content" id="events-tab">
                  ${this.renderEventsList()}
                </div>
                <div class="tab-content" id="alerts-tab">
                  ${this.renderAlertsList()}
                </div>
                <div class="tab-content" id="incidents-tab">
                  ${this.renderIncidentsList()}
                </div>
                <div class="tab-content" id="reports-tab">
                  ${this.renderReportsList()}
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

  renderSecurityStats() {
    const stats = this.getSecurityStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalPolicies}</div>
          <div class="stat-label">Total Políticas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activePolicies}</div>
          <div class="stat-label">Políticas Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalEvents}</div>
          <div class="stat-label">Total Eventos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.criticalEvents}</div>
          <div class="stat-label">Eventos Críticos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalAlerts}</div>
          <div class="stat-label">Total Alertas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.unresolvedAlerts}</div>
          <div class="stat-label">Alertas Sin Resolver</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalIncidents}</div>
          <div class="stat-label">Total Incidentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.openIncidents}</div>
          <div class="stat-label">Incidentes Abiertos</div>
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
          <div class="stat-value">${stats.totalMetrics}</div>
          <div class="stat-label">Total Métricas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.aboveThresholdMetrics}</div>
          <div class="stat-label">Métricas Críticas</div>
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
    const stats = this.getSecurityStatistics();

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Seguridad</h4>
          <div class="security-status">
            <div class="status-item">
              <span>Políticas Activas</span>
              <span>${stats.activePolicies}/${stats.totalPolicies}</span>
            </div>
            <div class="status-item">
              <span>Eventos Críticos</span>
              <span>${stats.criticalEvents}</span>
            </div>
            <div class="status-item">
              <span>Alertas Sin Resolver</span>
              <span>${stats.unresolvedAlerts}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Incidentes y Alertas</h4>
          <div class="incidents-alerts">
            <div class="incident-item">
              <span>Incidentes Abiertos</span>
              <span>${stats.openIncidents}</span>
            </div>
            <div class="incident-item">
              <span>Total Incidentes</span>
              <span>${stats.totalIncidents}</span>
            </div>
            <div class="incident-item">
              <span>Total Alertas</span>
              <span>${stats.totalAlerts}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Métricas y Logs</h4>
          <div class="metrics-logs">
            <div class="metric-item">
              <span>Métricas Críticas</span>
              <span>${stats.aboveThresholdMetrics}</span>
            </div>
            <div class="metric-item">
              <span>Total Métricas</span>
              <span>${stats.totalMetrics}</span>
            </div>
            <div class="metric-item">
              <span>Logs de Error</span>
              <span>${stats.errorLogs}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderPoliciesList() {
    const policies = this.securityPolicies.slice(-20); // Últimas 20 políticas

    return policies
      .map(
        (policy) => `
      <div class="policy-card">
        <div class="policy-header">
          <h5>${policy.name}</h5>
          <span class="policy-severity severity-${policy.severity}">${policy.severity}</span>
        </div>
        <div class="policy-info">
          <p>${policy.description}</p>
          <p>Categoría: ${policy.category}</p>
          <p>Estado: ${policy.isActive ? 'Activo' : 'Inactivo'}</p>
        </div>
        <div class="policy-actions">
          <button onclick="axyraAdvancedSecuritySystem.showPolicyDetails('${policy.id}')">Ver</button>
          <button onclick="axyraAdvancedSecuritySystem.editPolicy('${policy.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderEventsList() {
    const events = this.securityEvents.slice(-20); // Últimos 20 eventos

    return events
      .map(
        (event) => `
      <div class="event-card">
        <div class="event-header">
          <h5>${event.message}</h5>
          <span class="event-severity severity-${event.severity}">${event.severity}</span>
        </div>
        <div class="event-info">
          <p>Tipo: ${event.type}</p>
          <p>Fuente: ${event.source}</p>
          <p>Usuario: ${event.userId}</p>
          <p>Fecha: ${new Date(event.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderAlertsList() {
    const alerts = this.securityAlerts.slice(-20); // Últimas 20 alertas

    return alerts
      .map(
        (alert) => `
      <div class="alert-card">
        <div class="alert-header">
          <h5>${alert.title}</h5>
          <span class="alert-severity severity-${alert.severity}">${alert.severity}</span>
        </div>
        <div class="alert-info">
          <p>${alert.description}</p>
          <p>Tipo: ${alert.type}</p>
          <p>Estado: ${alert.isResolved ? 'Resuelto' : 'Pendiente'}</p>
          <p>Fecha: ${new Date(alert.timestamp).toLocaleString()}</p>
        </div>
        <div class="alert-actions">
          <button onclick="axyraAdvancedSecuritySystem.showAlertDetails('${alert.id}')">Ver</button>
          <button onclick="axyraAdvancedSecuritySystem.resolveAlert('${alert.id}')">Resolver</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderIncidentsList() {
    const incidents = this.securityIncidents.slice(-20); // Últimos 20 incidentes

    return incidents
      .map(
        (incident) => `
      <div class="incident-card">
        <div class="incident-header">
          <h5>${incident.title}</h5>
          <span class="incident-severity severity-${incident.severity}">${incident.severity}</span>
        </div>
        <div class="incident-info">
          <p>${incident.description}</p>
          <p>Tipo: ${incident.type}</p>
          <p>Estado: ${incident.status}</p>
          <p>Prioridad: ${incident.priority}</p>
          <p>Fecha: ${new Date(incident.metadata.createdAt).toLocaleString()}</p>
        </div>
        <div class="incident-actions">
          <button onclick="axyraAdvancedSecuritySystem.showIncidentDetails('${incident.id}')">Ver</button>
          <button onclick="axyraAdvancedSecuritySystem.updateIncident('${incident.id}')">Actualizar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderReportsList() {
    const reports = this.securityReports.slice(-20); // Últimos 20 reportes

    return reports
      .map(
        (report) => `
      <div class="report-card">
        <div class="report-header">
          <h5>${report.title}</h5>
          <span class="report-status ${report.isGenerated ? 'generated' : 'pending'}">${
          report.isGenerated ? 'Generado' : 'Pendiente'
        }</span>
        </div>
        <div class="report-info">
          <p>${report.description}</p>
          <p>Tipo: ${report.type}</p>
          <p>Período: ${report.period}</p>
          <p>Fecha: ${new Date(report.metadata.createdAt).toLocaleString()}</p>
        </div>
        <div class="report-actions">
          <button onclick="axyraAdvancedSecuritySystem.showReportDetails('${report.id}')">Ver</button>
          <button onclick="axyraAdvancedSecuritySystem.generateReport('${report.id}')">Generar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderLogsList() {
    const logs = this.securityLogs.slice(-20); // Últimos 20 logs

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

  showCreatePolicyDialog() {
    const name = prompt('Nombre de la política:');
    if (name) {
      const category = prompt('Categoría (general, authentication, authorization, data, network):');
      const severity = prompt('Severidad (low, medium, high, critical):');
      this.createSecurityPolicy({ name, category, severity });
    }
  }

  showCreateAlertDialog() {
    const title = prompt('Título de la alerta:');
    if (title) {
      const type = prompt('Tipo de alerta (suspicious_activity, failed_login, data_breach, policy_violation):');
      const severity = prompt('Severidad (info, warning, error, critical):');
      this.createSecurityAlert({ title, type, severity });
    }
  }

  showPolicyDetails(policyId) {
    const policy = this.securityPolicies.find((p) => p.id === policyId);
    if (policy) {
      alert(
        `Política: ${policy.name}\nDescripción: ${policy.description}\nCategoría: ${policy.category}\nSeveridad: ${
          policy.severity
        }\nEstado: ${policy.isActive ? 'Activo' : 'Inactivo'}`
      );
    }
  }

  editPolicy(policyId) {
    const policy = this.securityPolicies.find((p) => p.id === policyId);
    if (policy) {
      const newName = prompt('Nuevo nombre:', policy.name);
      if (newName) {
        policy.name = newName;
        this.saveSecurityPolicies();
      }
    }
  }

  showAlertDetails(alertId) {
    const alert = this.securityAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert(
        `Alerta: ${alert.title}\nDescripción: ${alert.description}\nTipo: ${alert.type}\nSeveridad: ${
          alert.severity
        }\nEstado: ${alert.isResolved ? 'Resuelto' : 'Pendiente'}`
      );
    }
  }

  resolveAlert(alertId) {
    const alert = this.securityAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.isResolved = true;
      alert.resolvedAt = new Date().toISOString();
      alert.resolvedBy = this.getCurrentUser();
      this.saveSecurityAlerts();
    }
  }

  showIncidentDetails(incidentId) {
    const incident = this.securityIncidents.find((i) => i.id === incidentId);
    if (incident) {
      alert(
        `Incidente: ${incident.title}\nDescripción: ${incident.description}\nTipo: ${incident.type}\nSeveridad: ${incident.severity}\nEstado: ${incident.status}\nPrioridad: ${incident.priority}`
      );
    }
  }

  updateIncident(incidentId) {
    const incident = this.securityIncidents.find((i) => i.id === incidentId);
    if (incident) {
      const newStatus = prompt('Nuevo estado (open, investigating, resolved, closed):', incident.status);
      if (newStatus) {
        incident.status = newStatus;
        this.saveSecurityIncidents();
      }
    }
  }

  showReportDetails(reportId) {
    const report = this.securityReports.find((r) => r.id === reportId);
    if (report) {
      alert(
        `Reporte: ${report.title}\nDescripción: ${report.description}\nTipo: ${report.type}\nPeríodo: ${
          report.period
        }\nEstado: ${report.isGenerated ? 'Generado' : 'Pendiente'}`
      );
    }
  }

  generateReport(reportId) {
    const report = this.securityReports.find((r) => r.id === reportId);
    if (report) {
      report.isGenerated = true;
      report.generatedAt = new Date().toISOString();
      this.saveSecurityReports();
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

// Inicializar sistema de seguridad avanzada
let axyraAdvancedSecuritySystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraAdvancedSecuritySystem = new AxyraAdvancedSecuritySystem();
  window.axyraAdvancedSecuritySystem = axyraAdvancedSecuritySystem;
});

// Exportar para uso global
window.AxyraAdvancedSecuritySystem = AxyraAdvancedSecuritySystem;
