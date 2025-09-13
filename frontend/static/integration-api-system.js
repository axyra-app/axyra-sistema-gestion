/**
 * AXYRA - Sistema de Gestión de Integraciones y APIs
 * Maneja integraciones, APIs, webhooks, sincronización y monitoreo
 */

class AxyraIntegrationAPISystem {
  constructor() {
    this.integrations = [];
    this.apis = [];
    this.webhooks = [];
    this.syncJobs = [];
    this.apiKeys = [];
    this.endpoints = [];
    this.requests = [];
    this.responses = [];
    this.logs = [];
    this.monitoring = [];
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('🔌 Inicializando sistema de integraciones y APIs...');
    this.loadIntegrations();
    this.loadAPIs();
    this.loadWebhooks();
    this.loadSyncJobs();
    this.loadAPIKeys();
    this.loadEndpoints();
    this.loadRequests();
    this.loadResponses();
    this.loadLogs();
    this.loadMonitoring();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadIntegrations() {
    try {
      const stored = localStorage.getItem('axyra_integration_integrations');
      if (stored) {
        this.integrations = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando integraciones:', error);
    }
  }

  saveIntegrations() {
    try {
      localStorage.setItem('axyra_integration_integrations', JSON.stringify(this.integrations));
    } catch (error) {
      console.error('Error guardando integraciones:', error);
    }
  }

  loadAPIs() {
    try {
      const stored = localStorage.getItem('axyra_integration_apis');
      if (stored) {
        this.apis = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando APIs:', error);
    }
  }

  saveAPIs() {
    try {
      localStorage.setItem('axyra_integration_apis', JSON.stringify(this.apis));
    } catch (error) {
      console.error('Error guardando APIs:', error);
    }
  }

  loadWebhooks() {
    try {
      const stored = localStorage.getItem('axyra_integration_webhooks');
      if (stored) {
        this.webhooks = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando webhooks:', error);
    }
  }

  saveWebhooks() {
    try {
      localStorage.setItem('axyra_integration_webhooks', JSON.stringify(this.webhooks));
    } catch (error) {
      console.error('Error guardando webhooks:', error);
    }
  }

  loadSyncJobs() {
    try {
      const stored = localStorage.getItem('axyra_integration_sync_jobs');
      if (stored) {
        this.syncJobs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando trabajos de sincronización:', error);
    }
  }

  saveSyncJobs() {
    try {
      localStorage.setItem('axyra_integration_sync_jobs', JSON.stringify(this.syncJobs));
    } catch (error) {
      console.error('Error guardando trabajos de sincronización:', error);
    }
  }

  loadAPIKeys() {
    try {
      const stored = localStorage.getItem('axyra_integration_api_keys');
      if (stored) {
        this.apiKeys = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando claves API:', error);
    }
  }

  saveAPIKeys() {
    try {
      localStorage.setItem('axyra_integration_api_keys', JSON.stringify(this.apiKeys));
    } catch (error) {
      console.error('Error guardando claves API:', error);
    }
  }

  loadEndpoints() {
    try {
      const stored = localStorage.getItem('axyra_integration_endpoints');
      if (stored) {
        this.endpoints = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando endpoints:', error);
    }
  }

  saveEndpoints() {
    try {
      localStorage.setItem('axyra_integration_endpoints', JSON.stringify(this.endpoints));
    } catch (error) {
      console.error('Error guardando endpoints:', error);
    }
  }

  loadRequests() {
    try {
      const stored = localStorage.getItem('axyra_integration_requests');
      if (stored) {
        this.requests = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando solicitudes:', error);
    }
  }

  saveRequests() {
    try {
      localStorage.setItem('axyra_integration_requests', JSON.stringify(this.requests));
    } catch (error) {
      console.error('Error guardando solicitudes:', error);
    }
  }

  loadResponses() {
    try {
      const stored = localStorage.getItem('axyra_integration_responses');
      if (stored) {
        this.responses = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando respuestas:', error);
    }
  }

  saveResponses() {
    try {
      localStorage.setItem('axyra_integration_responses', JSON.stringify(this.responses));
    } catch (error) {
      console.error('Error guardando respuestas:', error);
    }
  }

  loadLogs() {
    try {
      const stored = localStorage.getItem('axyra_integration_logs');
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando logs:', error);
    }
  }

  saveLogs() {
    try {
      localStorage.setItem('axyra_integration_logs', JSON.stringify(this.logs));
    } catch (error) {
      console.error('Error guardando logs:', error);
    }
  }

  loadMonitoring() {
    try {
      const stored = localStorage.getItem('axyra_integration_monitoring');
      if (stored) {
        this.monitoring = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando monitoreo:', error);
    }
  }

  saveMonitoring() {
    try {
      localStorage.setItem('axyra_integration_monitoring', JSON.stringify(this.monitoring));
    } catch (error) {
      console.error('Error guardando monitoreo:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en integraciones
    document.addEventListener('integrationChanged', (event) => {
      this.handleIntegrationChange(event.detail);
    });

    // Escuchar cambios en APIs
    document.addEventListener('apiChanged', (event) => {
      this.handleAPIChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.apis.length === 0) {
      this.apis = [
        {
          id: 'rest_api',
          name: 'API REST',
          description: 'API REST principal del sistema',
          baseUrl: 'https://api.axyra.com',
          version: 'v1',
          authentication: 'bearer',
          isActive: true
        },
        {
          id: 'graphql_api',
          name: 'API GraphQL',
          description: 'API GraphQL para consultas complejas',
          baseUrl: 'https://graphql.axyra.com',
          version: 'v1',
          authentication: 'bearer',
          isActive: true
        }
      ];
      this.saveAPIs();
    }

    if (this.endpoints.length === 0) {
      this.endpoints = [
        {
          id: 'users_endpoint',
          name: 'Usuarios',
          path: '/users',
          method: 'GET',
          description: 'Obtener lista de usuarios',
          apiId: 'rest_api',
          isActive: true
        },
        {
          id: 'users_create_endpoint',
          name: 'Crear Usuario',
          path: '/users',
          method: 'POST',
          description: 'Crear un nuevo usuario',
          apiId: 'rest_api',
          isActive: true
        }
      ];
      this.saveEndpoints();
    }
  }

  handleIntegrationChange(change) {
    const { integrationId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.integrations.push(data);
        this.saveIntegrations();
        break;
      case 'updated':
        const integrationIndex = this.integrations.findIndex(i => i.id === integrationId);
        if (integrationIndex !== -1) {
          this.integrations[integrationIndex] = { ...this.integrations[integrationIndex], ...data };
          this.saveIntegrations();
        }
        break;
      case 'deleted':
        this.integrations = this.integrations.filter(i => i.id !== integrationId);
        this.saveIntegrations();
        break;
    }
  }

  handleAPIChange(change) {
    const { apiId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.apis.push(data);
        this.saveAPIs();
        break;
      case 'updated':
        const apiIndex = this.apis.findIndex(a => a.id === apiId);
        if (apiIndex !== -1) {
          this.apis[apiIndex] = { ...this.apis[apiIndex], ...data };
          this.saveAPIs();
        }
        break;
      case 'deleted':
        this.apis = this.apis.filter(a => a.id !== apiId);
        this.saveAPIs();
        break;
    }
  }

  createIntegration(integrationData) {
    const integration = {
      id: 'integration_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: integrationData.name,
      description: integrationData.description || '',
      type: integrationData.type, // api, webhook, sftp, database, file
      provider: integrationData.provider || '',
      status: integrationData.status || 'inactive', // active, inactive, error
      configuration: integrationData.configuration || {},
      credentials: integrationData.credentials || {},
      isActive: integrationData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.integrations.push(integration);
    this.saveIntegrations();

    console.log('✅ Integración creada:', integration.name);
    return integration;
  }

  createAPI(apiData) {
    const api = {
      id: 'api_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: apiData.name,
      description: apiData.description || '',
      baseUrl: apiData.baseUrl,
      version: apiData.version || 'v1',
      authentication: apiData.authentication || 'none', // none, bearer, basic, api_key, oauth
      headers: apiData.headers || {},
      timeout: apiData.timeout || 30000,
      retryAttempts: apiData.retryAttempts || 3,
      isActive: apiData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.apis.push(api);
    this.saveAPIs();

    console.log('✅ API creada:', api.name);
    return api;
  }

  createWebhook(webhookData) {
    const webhook = {
      id: 'webhook_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: webhookData.name,
      description: webhookData.description || '',
      url: webhookData.url,
      events: webhookData.events || [],
      secret: webhookData.secret || '',
      isActive: webhookData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.webhooks.push(webhook);
    this.saveWebhooks();

    console.log('✅ Webhook creado:', webhook.name);
    return webhook;
  }

  createSyncJob(syncJobData) {
    const syncJob = {
      id: 'sync_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: syncJobData.name,
      description: syncJobData.description || '',
      sourceIntegrationId: syncJobData.sourceIntegrationId,
      targetIntegrationId: syncJobData.targetIntegrationId,
      frequency: syncJobData.frequency || 'manual', // manual, hourly, daily, weekly
      lastRun: syncJobData.lastRun || null,
      nextRun: syncJobData.nextRun || null,
      status: syncJobData.status || 'pending', // pending, running, completed, failed
      isActive: syncJobData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.syncJobs.push(syncJob);
    this.saveSyncJobs();

    console.log('✅ Trabajo de sincronización creado:', syncJob.name);
    return syncJob;
  }

  createAPIKey(apiKeyData) {
    const apiKey = {
      id: 'key_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: apiKeyData.name,
      key: apiKeyData.key || this.generateAPIKey(),
      apiId: apiKeyData.apiId,
      permissions: apiKeyData.permissions || [],
      expiresAt: apiKeyData.expiresAt || null,
      isActive: apiKeyData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser()
      }
    };

    this.apiKeys.push(apiKey);
    this.saveAPIKeys();

    console.log('✅ Clave API creada:', apiKey.name);
    return apiKey;
  }

  createEndpoint(endpointData) {
    const endpoint = {
      id: 'endpoint_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: endpointData.name,
      path: endpointData.path,
      method: endpointData.method, // GET, POST, PUT, DELETE, PATCH
      description: endpointData.description || '',
      apiId: endpointData.apiId,
      parameters: endpointData.parameters || [],
      headers: endpointData.headers || {},
      body: endpointData.body || null,
      isActive: endpointData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.endpoints.push(endpoint);
    this.saveEndpoints();

    console.log('✅ Endpoint creado:', endpoint.name);
    return endpoint;
  }

  async makeAPIRequest(requestData) {
    const request = {
      id: 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      endpointId: requestData.endpointId,
      method: requestData.method,
      url: requestData.url,
      headers: requestData.headers || {},
      body: requestData.body || null,
      timestamp: new Date().toISOString(),
      status: 'pending',
      metadata: {
        createdBy: this.getCurrentUser()
      }
    };

    this.requests.push(request);
    this.saveRequests();

    try {
      const response = await fetch(request.url, {
        method: request.method,
        headers: request.headers,
        body: request.body ? JSON.stringify(request.body) : null
      });

      const responseData = {
        id: 'res_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        requestId: request.id,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: await response.text(),
        timestamp: new Date().toISOString()
      };

      this.responses.push(responseData);
      this.saveResponses();

      request.status = 'completed';
      this.saveRequests();

      console.log('✅ Solicitud API completada:', request.id);
      return responseData;

    } catch (error) {
      request.status = 'failed';
      this.saveRequests();

      console.error('❌ Error en solicitud API:', error);
      throw error;
    }
  }

  createLog(logData) {
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      level: logData.level, // info, warning, error, debug
      message: logData.message,
      source: logData.source || 'system',
      data: logData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser()
      }
    };

    this.logs.push(log);
    this.saveLogs();

    console.log('✅ Log creado:', log.message);
    return log;
  }

  createMonitoring(monitoringData) {
    const monitoring = {
      id: 'monitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: monitoringData.name,
      description: monitoringData.description || '',
      type: monitoringData.type, // uptime, performance, error_rate, response_time
      target: monitoringData.target,
      threshold: monitoringData.threshold || 0,
      frequency: monitoringData.frequency || 300, // in seconds
      isActive: monitoringData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.monitoring.push(monitoring);
    this.saveMonitoring();

    console.log('✅ Monitoreo creado:', monitoring.name);
    return monitoring;
  }

  generateAPIKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  getIntegrationStatistics() {
    const totalIntegrations = this.integrations.length;
    const activeIntegrations = this.integrations.filter(i => i.isActive).length;
    const totalAPIs = this.apis.length;
    const activeAPIs = this.apis.filter(a => a.isActive).length;
    const totalWebhooks = this.webhooks.length;
    const activeWebhooks = this.webhooks.filter(w => w.isActive).length;
    const totalSyncJobs = this.syncJobs.length;
    const runningSyncJobs = this.syncJobs.filter(s => s.status === 'running').length;
    const totalRequests = this.requests.length;
    const successfulRequests = this.requests.filter(r => r.status === 'completed').length;
    const totalLogs = this.logs.length;
    const errorLogs = this.logs.filter(l => l.level === 'error').length;

    return {
      totalIntegrations,
      activeIntegrations,
      totalAPIs,
      activeAPIs,
      totalWebhooks,
      activeWebhooks,
      totalSyncJobs,
      runningSyncJobs,
      totalRequests,
      successfulRequests,
      totalLogs,
      errorLogs
    };
  }

  showIntegrationDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'integration-dashboard';
    dashboard.innerHTML = `
      <div class="integration-dashboard-overlay">
        <div class="integration-dashboard-container">
          <div class="integration-dashboard-header">
            <h3>🔌 Dashboard de Integraciones</h3>
            <div class="integration-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraIntegrationAPISystem.showCreateIntegrationDialog()">Nueva Integración</button>
              <button class="btn btn-secondary" onclick="axyraIntegrationAPISystem.showCreateAPIDialog()">Nueva API</button>
              <button class="btn btn-close" onclick="document.getElementById('integration-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="integration-dashboard-body">
            <div class="integration-dashboard-stats">
              ${this.renderIntegrationStats()}
            </div>
            <div class="integration-dashboard-content">
              <div class="integration-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="integrations">Integraciones</button>
                <button class="tab-btn" data-tab="apis">APIs</button>
                <button class="tab-btn" data-tab="webhooks">Webhooks</button>
                <button class="tab-btn" data-tab="logs">Logs</button>
              </div>
              <div class="integration-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="integrations-tab">
                  ${this.renderIntegrationsList()}
                </div>
                <div class="tab-content" id="apis-tab">
                  ${this.renderAPIsList()}
                </div>
                <div class="tab-content" id="webhooks-tab">
                  ${this.renderWebhooksList()}
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

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  }

  renderIntegrationStats() {
    const stats = this.getIntegrationStatistics();
    
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalIntegrations}</div>
          <div class="stat-label">Total Integraciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeIntegrations}</div>
          <div class="stat-label">Integraciones Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalAPIs}</div>
          <div class="stat-label">Total APIs</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeAPIs}</div>
          <div class="stat-label">APIs Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalWebhooks}</div>
          <div class="stat-label">Total Webhooks</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeWebhooks}</div>
          <div class="stat-label">Webhooks Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalRequests}</div>
          <div class="stat-label">Total Solicitudes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.successfulRequests}</div>
          <div class="stat-label">Solicitudes Exitosas</div>
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
    const stats = this.getIntegrationStatistics();
    
    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Integraciones</h4>
          <div class="integration-status">
            <div class="status-item">
              <span>Integraciones Activas</span>
              <span>${stats.activeIntegrations}/${stats.totalIntegrations}</span>
            </div>
            <div class="status-item">
              <span>APIs Activas</span>
              <span>${stats.activeAPIs}/${stats.totalAPIs}</span>
            </div>
            <div class="status-item">
              <span>Webhooks Activos</span>
              <span>${stats.activeWebhooks}/${stats.totalWebhooks}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Actividad de APIs</h4>
          <div class="api-activity">
            <div class="activity-item">
              <span>Total Solicitudes</span>
              <span>${stats.totalRequests}</span>
            </div>
            <div class="activity-item">
              <span>Solicitudes Exitosas</span>
              <span>${stats.successfulRequests}</span>
            </div>
            <div class="activity-item">
              <span>Tasa de Éxito</span>
              <span>${stats.totalRequests > 0 ? Math.round((stats.successfulRequests / stats.totalRequests) * 100) : 0}%</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Logs y Monitoreo</h4>
          <div class="monitoring-status">
            <div class="monitor-item">
              <span>Total Logs</span>
              <span>${stats.totalLogs}</span>
            </div>
            <div class="monitor-item">
              <span>Logs de Error</span>
              <span>${stats.errorLogs}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderIntegrationsList() {
    const integrations = this.integrations.slice(-20); // Últimas 20 integraciones
    
    return integrations.map(integration => `
      <div class="integration-card">
        <div class="integration-header">
          <h5>${integration.name}</h5>
          <span class="integration-status status-${integration.status}">${integration.status}</span>
        </div>
        <div class="integration-info">
          <p>${integration.description}</p>
          <p>Tipo: ${integration.type}</p>
          <p>Proveedor: ${integration.provider}</p>
          <p>Estado: ${integration.isActive ? 'Activo' : 'Inactivo'}</p>
        </div>
        <div class="integration-actions">
          <button onclick="axyraIntegrationAPISystem.showIntegrationDetails('${integration.id}')">Ver</button>
          <button onclick="axyraIntegrationAPISystem.editIntegration('${integration.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderAPIsList() {
    const apis = this.apis.slice(-20); // Últimas 20 APIs
    
    return apis.map(api => `
      <div class="api-card">
        <div class="api-header">
          <h5>${api.name}</h5>
          <span class="api-status ${api.isActive ? 'active' : 'inactive'}">${api.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="api-info">
          <p>${api.description}</p>
          <p>URL: ${api.baseUrl}</p>
          <p>Versión: ${api.version}</p>
          <p>Autenticación: ${api.authentication}</p>
        </div>
        <div class="api-actions">
          <button onclick="axyraIntegrationAPISystem.showAPIDetails('${api.id}')">Ver</button>
          <button onclick="axyraIntegrationAPISystem.editAPI('${api.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderWebhooksList() {
    const webhooks = this.webhooks.slice(-20); // Últimos 20 webhooks
    
    return webhooks.map(webhook => `
      <div class="webhook-card">
        <div class="webhook-header">
          <h5>${webhook.name}</h5>
          <span class="webhook-status ${webhook.isActive ? 'active' : 'inactive'}">${webhook.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="webhook-info">
          <p>${webhook.description}</p>
          <p>URL: ${webhook.url}</p>
          <p>Eventos: ${webhook.events.join(', ')}</p>
        </div>
        <div class="webhook-actions">
          <button onclick="axyraIntegrationAPISystem.showWebhookDetails('${webhook.id}')">Ver</button>
          <button onclick="axyraIntegrationAPISystem.editWebhook('${webhook.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderLogsList() {
    const logs = this.logs.slice(-20); // Últimos 20 logs
    
    return logs.map(log => `
      <div class="log-card">
        <div class="log-header">
          <h5>${log.message}</h5>
          <span class="log-level level-${log.level}">${log.level}</span>
        </div>
        <div class="log-info">
          <p>Fuente: ${log.source}</p>
          <p>Fecha: ${new Date(log.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `).join('');
  }

  showCreateIntegrationDialog() {
    const name = prompt('Nombre de la integración:');
    if (name) {
      const type = prompt('Tipo de integración (api, webhook, sftp, database, file):');
      const provider = prompt('Proveedor:');
      this.createIntegration({ name, type, provider });
    }
  }

  showCreateAPIDialog() {
    const name = prompt('Nombre de la API:');
    if (name) {
      const baseUrl = prompt('URL base de la API:');
      const version = prompt('Versión de la API:');
      this.createAPI({ name, baseUrl, version });
    }
  }

  showIntegrationDetails(integrationId) {
    const integration = this.integrations.find(i => i.id === integrationId);
    if (integration) {
      alert(`Integración: ${integration.name}\nDescripción: ${integration.description}\nTipo: ${integration.type}\nProveedor: ${integration.provider}\nEstado: ${integration.status}`);
    }
  }

  editIntegration(integrationId) {
    const integration = this.integrations.find(i => i.id === integrationId);
    if (integration) {
      const newName = prompt('Nuevo nombre:', integration.name);
      if (newName) {
        integration.name = newName;
        this.saveIntegrations();
      }
    }
  }

  showAPIDetails(apiId) {
    const api = this.apis.find(a => a.id === apiId);
    if (api) {
      alert(`API: ${api.name}\nDescripción: ${api.description}\nURL: ${api.baseUrl}\nVersión: ${api.version}\nAutenticación: ${api.authentication}`);
    }
  }

  editAPI(apiId) {
    const api = this.apis.find(a => a.id === apiId);
    if (api) {
      const newName = prompt('Nuevo nombre:', api.name);
      if (newName) {
        api.name = newName;
        this.saveAPIs();
      }
    }
  }

  showWebhookDetails(webhookId) {
    const webhook = this.webhooks.find(w => w.id === webhookId);
    if (webhook) {
      alert(`Webhook: ${webhook.name}\nDescripción: ${webhook.description}\nURL: ${webhook.url}\nEventos: ${webhook.events.join(', ')}`);
    }
  }

  editWebhook(webhookId) {
    const webhook = this.webhooks.find(w => w.id === webhookId);
    if (webhook) {
      const newName = prompt('Nuevo nombre:', webhook.name);
      if (newName) {
        webhook.name = newName;
        this.saveWebhooks();
      }
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

// Inicializar sistema de integraciones
let axyraIntegrationAPISystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraIntegrationAPISystem = new AxyraIntegrationAPISystem();
  window.axyraIntegrationAPISystem = axyraIntegrationAPISystem;
});

// Exportar para uso global
window.AxyraIntegrationAPISystem = AxyraIntegrationAPISystem;
