/**
 * AXYRA - Sistema de Configuración Avanzada
 * Maneja configuración del sistema, parámetros, ajustes y personalización
 */

class AxyraAdvancedConfigurationSystem {
  constructor() {
    this.configurations = [];
    this.configGroups = [];
    this.configParameters = [];
    this.configTemplates = [];
    this.configProfiles = [];
    this.configHistory = [];
    this.configValidation = [];
    this.configDependencies = [];
    this.configLogs = [];
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('⚙️ Inicializando sistema de configuración avanzada...');
    this.loadConfigurations();
    this.loadConfigGroups();
    this.loadConfigParameters();
    this.loadConfigTemplates();
    this.loadConfigProfiles();
    this.loadConfigHistory();
    this.loadConfigValidation();
    this.loadConfigDependencies();
    this.loadConfigLogs();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadConfigurations() {
    try {
      const stored = localStorage.getItem('axyra_configurations');
      if (stored) {
        this.configurations = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando configuraciones:', error);
    }
  }

  saveConfigurations() {
    try {
      localStorage.setItem('axyra_configurations', JSON.stringify(this.configurations));
    } catch (error) {
      console.error('Error guardando configuraciones:', error);
    }
  }

  loadConfigGroups() {
    try {
      const stored = localStorage.getItem('axyra_config_groups');
      if (stored) {
        this.configGroups = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando grupos de configuración:', error);
    }
  }

  saveConfigGroups() {
    try {
      localStorage.setItem('axyra_config_groups', JSON.stringify(this.configGroups));
    } catch (error) {
      console.error('Error guardando grupos de configuración:', error);
    }
  }

  loadConfigParameters() {
    try {
      const stored = localStorage.getItem('axyra_config_parameters');
      if (stored) {
        this.configParameters = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando parámetros de configuración:', error);
    }
  }

  saveConfigParameters() {
    try {
      localStorage.setItem('axyra_config_parameters', JSON.stringify(this.configParameters));
    } catch (error) {
      console.error('Error guardando parámetros de configuración:', error);
    }
  }

  loadConfigTemplates() {
    try {
      const stored = localStorage.getItem('axyra_config_templates');
      if (stored) {
        this.configTemplates = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando plantillas de configuración:', error);
    }
  }

  saveConfigTemplates() {
    try {
      localStorage.setItem('axyra_config_templates', JSON.stringify(this.configTemplates));
    } catch (error) {
      console.error('Error guardando plantillas de configuración:', error);
    }
  }

  loadConfigProfiles() {
    try {
      const stored = localStorage.getItem('axyra_config_profiles');
      if (stored) {
        this.configProfiles = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando perfiles de configuración:', error);
    }
  }

  saveConfigProfiles() {
    try {
      localStorage.setItem('axyra_config_profiles', JSON.stringify(this.configProfiles));
    } catch (error) {
      console.error('Error guardando perfiles de configuración:', error);
    }
  }

  loadConfigHistory() {
    try {
      const stored = localStorage.getItem('axyra_config_history');
      if (stored) {
        this.configHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando historial de configuración:', error);
    }
  }

  saveConfigHistory() {
    try {
      localStorage.setItem('axyra_config_history', JSON.stringify(this.configHistory));
    } catch (error) {
      console.error('Error guardando historial de configuración:', error);
    }
  }

  loadConfigValidation() {
    try {
      const stored = localStorage.getItem('axyra_config_validation');
      if (stored) {
        this.configValidation = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando validación de configuración:', error);
    }
  }

  saveConfigValidation() {
    try {
      localStorage.setItem('axyra_config_validation', JSON.stringify(this.configValidation));
    } catch (error) {
      console.error('Error guardando validación de configuración:', error);
    }
  }

  loadConfigDependencies() {
    try {
      const stored = localStorage.getItem('axyra_config_dependencies');
      if (stored) {
        this.configDependencies = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando dependencias de configuración:', error);
    }
  }

  saveConfigDependencies() {
    try {
      localStorage.setItem('axyra_config_dependencies', JSON.stringify(this.configDependencies));
    } catch (error) {
      console.error('Error guardando dependencias de configuración:', error);
    }
  }

  loadConfigLogs() {
    try {
      const stored = localStorage.getItem('axyra_config_logs');
      if (stored) {
        this.configLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando logs de configuración:', error);
    }
  }

  saveConfigLogs() {
    try {
      localStorage.setItem('axyra_config_logs', JSON.stringify(this.configLogs));
    } catch (error) {
      console.error('Error guardando logs de configuración:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en configuraciones
    document.addEventListener('configurationChanged', (event) => {
      this.handleConfigurationChange(event.detail);
    });

    // Escuchar cambios en parámetros
    document.addEventListener('parameterChanged', (event) => {
      this.handleParameterChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.configGroups.length === 0) {
      this.configGroups = [
        {
          id: 'system_general',
          name: 'Configuración General',
          description: 'Configuraciones generales del sistema',
          category: 'system',
          isActive: true
        },
        {
          id: 'user_interface',
          name: 'Interfaz de Usuario',
          description: 'Configuraciones de la interfaz de usuario',
          category: 'ui',
          isActive: true
        },
        {
          id: 'security_settings',
          name: 'Configuración de Seguridad',
          description: 'Configuraciones de seguridad del sistema',
          category: 'security',
          isActive: true
        }
      ];
      this.saveConfigGroups();
    }

    if (this.configParameters.length === 0) {
      this.configParameters = [
        {
          id: 'system_name',
          name: 'Nombre del Sistema',
          description: 'Nombre del sistema AXYRA',
          groupId: 'system_general',
          type: 'string',
          value: 'AXYRA Sistema de Gestión',
          defaultValue: 'AXYRA Sistema de Gestión',
          isRequired: true,
          isActive: true
        },
        {
          id: 'system_version',
          name: 'Versión del Sistema',
          description: 'Versión actual del sistema',
          groupId: 'system_general',
          type: 'string',
          value: '1.0.0',
          defaultValue: '1.0.0',
          isRequired: true,
          isActive: true
        },
        {
          id: 'theme_mode',
          name: 'Modo de Tema',
          description: 'Modo del tema (claro/oscuro)',
          groupId: 'user_interface',
          type: 'select',
          value: 'light',
          defaultValue: 'light',
          options: ['light', 'dark', 'auto'],
          isRequired: false,
          isActive: true
        },
        {
          id: 'session_timeout',
          name: 'Tiempo de Sesión',
          description: 'Tiempo de expiración de sesión en minutos',
          groupId: 'security_settings',
          type: 'number',
          value: 30,
          defaultValue: 30,
          min: 5,
          max: 480,
          isRequired: true,
          isActive: true
        }
      ];
      this.saveConfigParameters();
    }
  }

  handleConfigurationChange(change) {
    const { configId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.configurations.push(data);
        this.saveConfigurations();
        break;
      case 'updated':
        const configIndex = this.configurations.findIndex(c => c.id === configId);
        if (configIndex !== -1) {
          this.configurations[configIndex] = { ...this.configurations[configIndex], ...data };
          this.saveConfigurations();
        }
        break;
      case 'deleted':
        this.configurations = this.configurations.filter(c => c.id !== configId);
        this.saveConfigurations();
        break;
    }
  }

  handleParameterChange(change) {
    const { parameterId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.configParameters.push(data);
        this.saveConfigParameters();
        break;
      case 'updated':
        const parameterIndex = this.configParameters.findIndex(p => p.id === parameterId);
        if (parameterIndex !== -1) {
          this.configParameters[parameterIndex] = { ...this.configParameters[parameterIndex], ...data };
          this.saveConfigParameters();
        }
        break;
      case 'deleted':
        this.configParameters = this.configParameters.filter(p => p.id !== parameterId);
        this.saveConfigParameters();
        break;
    }
  }

  createConfiguration(configData) {
    const config = {
      id: 'config_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: configData.name,
      description: configData.description || '',
      category: configData.category || 'general', // general, system, ui, security, performance
      parameters: configData.parameters || {},
      isActive: configData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.configurations.push(config);
    this.saveConfigurations();

    console.log('✅ Configuración creada:', config.name);
    return config;
  }

  createConfigGroup(groupData) {
    const group = {
      id: 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: groupData.name,
      description: groupData.description || '',
      category: groupData.category || 'general', // general, system, ui, security, performance
      isActive: groupData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.configGroups.push(group);
    this.saveConfigGroups();

    console.log('✅ Grupo de configuración creado:', group.name);
    return group;
  }

  createConfigParameter(parameterData) {
    const parameter = {
      id: 'param_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: parameterData.name,
      description: parameterData.description || '',
      groupId: parameterData.groupId,
      type: parameterData.type, // string, number, boolean, select, textarea, file
      value: parameterData.value || '',
      defaultValue: parameterData.defaultValue || '',
      options: parameterData.options || [],
      min: parameterData.min || null,
      max: parameterData.max || null,
      isRequired: parameterData.isRequired || false,
      isActive: parameterData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.configParameters.push(parameter);
    this.saveConfigParameters();

    console.log('✅ Parámetro de configuración creado:', parameter.name);
    return parameter;
  }

  createConfigTemplate(templateData) {
    const template = {
      id: 'template_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: templateData.name,
      description: templateData.description || '',
      category: templateData.category || 'general', // general, system, ui, security, performance
      parameters: templateData.parameters || {},
      isActive: templateData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.configTemplates.push(template);
    this.saveConfigTemplates();

    console.log('✅ Plantilla de configuración creada:', template.name);
    return template;
  }

  createConfigProfile(profileData) {
    const profile = {
      id: 'profile_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: profileData.name,
      description: profileData.description || '',
      category: profileData.category || 'general', // general, system, ui, security, performance
      configurations: profileData.configurations || {},
      isActive: profileData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.configProfiles.push(profile);
    this.saveConfigProfiles();

    console.log('✅ Perfil de configuración creado:', profile.name);
    return profile;
  }

  createConfigHistory(historyData) {
    const history = {
      id: 'history_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      configId: historyData.configId,
      action: historyData.action, // created, updated, deleted, restored
      oldValue: historyData.oldValue || null,
      newValue: historyData.newValue || null,
      reason: historyData.reason || '',
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser()
      }
    };

    this.configHistory.push(history);
    this.saveConfigHistory();

    console.log('✅ Historial de configuración creado:', history.action);
    return history;
  }

  createConfigValidation(validationData) {
    const validation = {
      id: 'validation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      parameterId: validationData.parameterId,
      rule: validationData.rule, // required, min, max, pattern, custom
      value: validationData.value || '',
      message: validationData.message || '',
      isPassed: validationData.isPassed || false,
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser()
      }
    };

    this.configValidation.push(validation);
    this.saveConfigValidation();

    console.log('✅ Validación de configuración creada:', validation.rule);
    return validation;
  }

  createConfigDependency(dependencyData) {
    const dependency = {
      id: 'dependency_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      sourceParameterId: dependencyData.sourceParameterId,
      targetParameterId: dependencyData.targetParameterId,
      condition: dependencyData.condition || '',
      action: dependencyData.action || 'enable', // enable, disable, show, hide, require
      isActive: dependencyData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.configDependencies.push(dependency);
    this.saveConfigDependencies();

    console.log('✅ Dependencia de configuración creada:', dependency.condition);
    return dependency;
  }

  createConfigLog(logData) {
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      level: logData.level, // info, warning, error, debug
      message: logData.message,
      source: logData.source || 'system',
      category: logData.category || 'general', // general, validation, dependency, history
      data: logData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser()
      }
    };

    this.configLogs.push(log);
    this.saveConfigLogs();

    console.log('✅ Log de configuración creado:', log.message);
    return log;
  }

  getConfigurationStatistics() {
    const totalConfigurations = this.configurations.length;
    const activeConfigurations = this.configurations.filter(c => c.isActive).length;
    const totalGroups = this.configGroups.length;
    const activeGroups = this.configGroups.filter(g => g.isActive).length;
    const totalParameters = this.configParameters.length;
    const activeParameters = this.configParameters.filter(p => p.isActive).length;
    const totalTemplates = this.configTemplates.length;
    const activeTemplates = this.configTemplates.filter(t => t.isActive).length;
    const totalProfiles = this.configProfiles.length;
    const activeProfiles = this.configProfiles.filter(p => p.isActive).length;
    const totalHistory = this.configHistory.length;
    const totalValidation = this.configValidation.length;
    const passedValidation = this.configValidation.filter(v => v.isPassed).length;
    const totalDependencies = this.configDependencies.length;
    const activeDependencies = this.configDependencies.filter(d => d.isActive).length;
    const totalLogs = this.configLogs.length;
    const errorLogs = this.configLogs.filter(l => l.level === 'error').length;

    return {
      totalConfigurations,
      activeConfigurations,
      totalGroups,
      activeGroups,
      totalParameters,
      activeParameters,
      totalTemplates,
      activeTemplates,
      totalProfiles,
      activeProfiles,
      totalHistory,
      totalValidation,
      passedValidation,
      totalDependencies,
      activeDependencies,
      totalLogs,
      errorLogs
    };
  }

  showConfigurationDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'configuration-dashboard';
    dashboard.innerHTML = `
      <div class="configuration-dashboard-overlay">
        <div class="configuration-dashboard-container">
          <div class="configuration-dashboard-header">
            <h3>⚙️ Dashboard de Configuración</h3>
            <div class="configuration-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraAdvancedConfigurationSystem.showCreateConfigurationDialog()">Nueva Configuración</button>
              <button class="btn btn-secondary" onclick="axyraAdvancedConfigurationSystem.showCreateGroupDialog()">Nuevo Grupo</button>
              <button class="btn btn-close" onclick="document.getElementById('configuration-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="configuration-dashboard-body">
            <div class="configuration-dashboard-stats">
              ${this.renderConfigurationStats()}
            </div>
            <div class="configuration-dashboard-content">
              <div class="configuration-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="configurations">Configuraciones</button>
                <button class="tab-btn" data-tab="groups">Grupos</button>
                <button class="tab-btn" data-tab="parameters">Parámetros</button>
                <button class="tab-btn" data-tab="templates">Plantillas</button>
                <button class="tab-btn" data-tab="profiles">Perfiles</button>
                <button class="tab-btn" data-tab="history">Historial</button>
                <button class="tab-btn" data-tab="validation">Validación</button>
                <button class="tab-btn" data-tab="dependencies">Dependencias</button>
                <button class="tab-btn" data-tab="logs">Logs</button>
              </div>
              <div class="configuration-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="configurations-tab">
                  ${this.renderConfigurationsList()}
                </div>
                <div class="tab-content" id="groups-tab">
                  ${this.renderGroupsList()}
                </div>
                <div class="tab-content" id="parameters-tab">
                  ${this.renderParametersList()}
                </div>
                <div class="tab-content" id="templates-tab">
                  ${this.renderTemplatesList()}
                </div>
                <div class="tab-content" id="profiles-tab">
                  ${this.renderProfilesList()}
                </div>
                <div class="tab-content" id="history-tab">
                  ${this.renderHistoryList()}
                </div>
                <div class="tab-content" id="validation-tab">
                  ${this.renderValidationList()}
                </div>
                <div class="tab-content" id="dependencies-tab">
                  ${this.renderDependenciesList()}
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

  renderConfigurationStats() {
    const stats = this.getConfigurationStatistics();
    
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalConfigurations}</div>
          <div class="stat-label">Total Configuraciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeConfigurations}</div>
          <div class="stat-label">Configuraciones Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalGroups}</div>
          <div class="stat-label">Total Grupos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeGroups}</div>
          <div class="stat-label">Grupos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalParameters}</div>
          <div class="stat-label">Total Parámetros</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeParameters}</div>
          <div class="stat-label">Parámetros Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTemplates}</div>
          <div class="stat-label">Total Plantillas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeTemplates}</div>
          <div class="stat-label">Plantillas Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalProfiles}</div>
          <div class="stat-label">Total Perfiles</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeProfiles}</div>
          <div class="stat-label">Perfiles Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalHistory}</div>
          <div class="stat-label">Total Historial</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalValidation}</div>
          <div class="stat-label">Total Validaciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.passedValidation}</div>
          <div class="stat-label">Validaciones Exitosas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalDependencies}</div>
          <div class="stat-label">Total Dependencias</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeDependencies}</div>
          <div class="stat-label">Dependencias Activas</div>
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
    const stats = this.getConfigurationStatistics();
    
    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Configuración</h4>
          <div class="configuration-status">
            <div class="status-item">
              <span>Configuraciones Activas</span>
              <span>${stats.activeConfigurations}/${stats.totalConfigurations}</span>
            </div>
            <div class="status-item">
              <span>Grupos Activos</span>
              <span>${stats.activeGroups}/${stats.totalGroups}</span>
            </div>
            <div class="status-item">
              <span>Parámetros Activos</span>
              <span>${stats.activeParameters}/${stats.totalParameters}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Plantillas y Perfiles</h4>
          <div class="templates-profiles">
            <div class="template-item">
              <span>Plantillas Activas</span>
              <span>${stats.activeTemplates}</span>
            </div>
            <div class="template-item">
              <span>Perfiles Activos</span>
              <span>${stats.activeProfiles}</span>
            </div>
            <div class="template-item">
              <span>Total Plantillas</span>
              <span>${stats.totalTemplates}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Validación y Dependencias</h4>
          <div class="validation-dependencies">
            <div class="validation-item">
              <span>Validaciones Exitosas</span>
              <span>${stats.passedValidation}</span>
            </div>
            <div class="validation-item">
              <span>Dependencias Activas</span>
              <span>${stats.activeDependencies}</span>
            </div>
            <div class="validation-item">
              <span>Total Validaciones</span>
              <span>${stats.totalValidation}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderConfigurationsList() {
    const configurations = this.configurations.slice(-20); // Últimas 20 configuraciones
    
    return configurations.map(config => `
      <div class="configuration-card">
        <div class="configuration-header">
          <h5>${config.name}</h5>
          <span class="configuration-status ${config.isActive ? 'active' : 'inactive'}">${config.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="configuration-info">
          <p>${config.description}</p>
          <p>Categoría: ${config.category}</p>
          <p>Parámetros: ${Object.keys(config.parameters).length}</p>
        </div>
        <div class="configuration-actions">
          <button onclick="axyraAdvancedConfigurationSystem.showConfigurationDetails('${config.id}')">Ver</button>
          <button onclick="axyraAdvancedConfigurationSystem.editConfiguration('${config.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderGroupsList() {
    const groups = this.configGroups.slice(-20); // Últimos 20 grupos
    
    return groups.map(group => `
      <div class="group-card">
        <div class="group-header">
          <h5>${group.name}</h5>
          <span class="group-status ${group.isActive ? 'active' : 'inactive'}">${group.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="group-info">
          <p>${group.description}</p>
          <p>Categoría: ${group.category}</p>
        </div>
        <div class="group-actions">
          <button onclick="axyraAdvancedConfigurationSystem.showGroupDetails('${group.id}')">Ver</button>
          <button onclick="axyraAdvancedConfigurationSystem.editGroup('${group.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderParametersList() {
    const parameters = this.configParameters.slice(-20); // Últimos 20 parámetros
    
    return parameters.map(parameter => `
      <div class="parameter-card">
        <div class="parameter-header">
          <h5>${parameter.name}</h5>
          <span class="parameter-type type-${parameter.type}">${parameter.type}</span>
        </div>
        <div class="parameter-info">
          <p>${parameter.description}</p>
          <p>Valor: ${parameter.value}</p>
          <p>Requerido: ${parameter.isRequired ? 'Sí' : 'No'}</p>
        </div>
        <div class="parameter-actions">
          <button onclick="axyraAdvancedConfigurationSystem.showParameterDetails('${parameter.id}')">Ver</button>
          <button onclick="axyraAdvancedConfigurationSystem.editParameter('${parameter.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderTemplatesList() {
    const templates = this.configTemplates.slice(-20); // Últimas 20 plantillas
    
    return templates.map(template => `
      <div class="template-card">
        <div class="template-header">
          <h5>${template.name}</h5>
          <span class="template-status ${template.isActive ? 'active' : 'inactive'}">${template.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="template-info">
          <p>${template.description}</p>
          <p>Categoría: ${template.category}</p>
          <p>Parámetros: ${Object.keys(template.parameters).length}</p>
        </div>
        <div class="template-actions">
          <button onclick="axyraAdvancedConfigurationSystem.showTemplateDetails('${template.id}')">Ver</button>
          <button onclick="axyraAdvancedConfigurationSystem.editTemplate('${template.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderProfilesList() {
    const profiles = this.configProfiles.slice(-20); // Últimos 20 perfiles
    
    return profiles.map(profile => `
      <div class="profile-card">
        <div class="profile-header">
          <h5>${profile.name}</h5>
          <span class="profile-status ${profile.isActive ? 'active' : 'inactive'}">${profile.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="profile-info">
          <p>${profile.description}</p>
          <p>Categoría: ${profile.category}</p>
          <p>Configuraciones: ${Object.keys(profile.configurations).length}</p>
        </div>
        <div class="profile-actions">
          <button onclick="axyraAdvancedConfigurationSystem.showProfileDetails('${profile.id}')">Ver</button>
          <button onclick="axyraAdvancedConfigurationSystem.editProfile('${profile.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderHistoryList() {
    const history = this.configHistory.slice(-20); // Últimos 20 historiales
    
    return history.map(hist => `
      <div class="history-card">
        <div class="history-header">
          <h5>${hist.action}</h5>
          <span class="history-timestamp">${new Date(hist.timestamp).toLocaleString()}</span>
        </div>
        <div class="history-info">
          <p>Configuración: ${hist.configId}</p>
          <p>Razón: ${hist.reason}</p>
          <p>Valor anterior: ${hist.oldValue || 'N/A'}</p>
          <p>Nuevo valor: ${hist.newValue || 'N/A'}</p>
        </div>
      </div>
    `).join('');
  }

  renderValidationList() {
    const validations = this.configValidation.slice(-20); // Últimas 20 validaciones
    
    return validations.map(validation => `
      <div class="validation-card">
        <div class="validation-header">
          <h5>${validation.rule}</h5>
          <span class="validation-status ${validation.isPassed ? 'passed' : 'failed'}">${validation.isPassed ? 'Exitoso' : 'Fallido'}</span>
        </div>
        <div class="validation-info">
          <p>Parámetro: ${validation.parameterId}</p>
          <p>Mensaje: ${validation.message}</p>
          <p>Valor: ${validation.value}</p>
        </div>
      </div>
    `).join('');
  }

  renderDependenciesList() {
    const dependencies = this.configDependencies.slice(-20); // Últimas 20 dependencias
    
    return dependencies.map(dependency => `
      <div class="dependency-card">
        <div class="dependency-header">
          <h5>${dependency.condition}</h5>
          <span class="dependency-status ${dependency.isActive ? 'active' : 'inactive'}">${dependency.isActive ? 'Activo' : 'Inactivo'}</span>
        </div>
        <div class="dependency-info">
          <p>Parámetro origen: ${dependency.sourceParameterId}</p>
          <p>Parámetro destino: ${dependency.targetParameterId}</p>
          <p>Acción: ${dependency.action}</p>
        </div>
        <div class="dependency-actions">
          <button onclick="axyraAdvancedConfigurationSystem.showDependencyDetails('${dependency.id}')">Ver</button>
          <button onclick="axyraAdvancedConfigurationSystem.editDependency('${dependency.id}')">Editar</button>
        </div>
      </div>
    `).join('');
  }

  renderLogsList() {
    const logs = this.configLogs.slice(-20); // Últimos 20 logs
    
    return logs.map(log => `
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
    `).join('');
  }

  showCreateConfigurationDialog() {
    const name = prompt('Nombre de la configuración:');
    if (name) {
      const category = prompt('Categoría (general, system, ui, security, performance):');
      this.createConfiguration({ name, category });
    }
  }

  showCreateGroupDialog() {
    const name = prompt('Nombre del grupo:');
    if (name) {
      const category = prompt('Categoría (general, system, ui, security, performance):');
      this.createConfigGroup({ name, category });
    }
  }

  showConfigurationDetails(configId) {
    const config = this.configurations.find(c => c.id === configId);
    if (config) {
      alert(`Configuración: ${config.name}\nDescripción: ${config.description}\nCategoría: ${config.category}\nParámetros: ${Object.keys(config.parameters).length}`);
    }
  }

  editConfiguration(configId) {
    const config = this.configurations.find(c => c.id === configId);
    if (config) {
      const newName = prompt('Nuevo nombre:', config.name);
      if (newName) {
        config.name = newName;
        this.saveConfigurations();
      }
    }
  }

  showGroupDetails(groupId) {
    const group = this.configGroups.find(g => g.id === groupId);
    if (group) {
      alert(`Grupo: ${group.name}\nDescripción: ${group.description}\nCategoría: ${group.category}`);
    }
  }

  editGroup(groupId) {
    const group = this.configGroups.find(g => g.id === groupId);
    if (group) {
      const newName = prompt('Nuevo nombre:', group.name);
      if (newName) {
        group.name = newName;
        this.saveConfigGroups();
      }
    }
  }

  showParameterDetails(parameterId) {
    const parameter = this.configParameters.find(p => p.id === parameterId);
    if (parameter) {
      alert(`Parámetro: ${parameter.name}\nDescripción: ${parameter.description}\nTipo: ${parameter.type}\nValor: ${parameter.value}\nRequerido: ${parameter.isRequired ? 'Sí' : 'No'}`);
    }
  }

  editParameter(parameterId) {
    const parameter = this.configParameters.find(p => p.id === parameterId);
    if (parameter) {
      const newValue = prompt('Nuevo valor:', parameter.value);
      if (newValue !== null) {
        parameter.value = newValue;
        this.saveConfigParameters();
      }
    }
  }

  showTemplateDetails(templateId) {
    const template = this.configTemplates.find(t => t.id === templateId);
    if (template) {
      alert(`Plantilla: ${template.name}\nDescripción: ${template.description}\nCategoría: ${template.category}\nParámetros: ${Object.keys(template.parameters).length}`);
    }
  }

  editTemplate(templateId) {
    const template = this.configTemplates.find(t => t.id === templateId);
    if (template) {
      const newName = prompt('Nuevo nombre:', template.name);
      if (newName) {
        template.name = newName;
        this.saveConfigTemplates();
      }
    }
  }

  showProfileDetails(profileId) {
    const profile = this.configProfiles.find(p => p.id === profileId);
    if (profile) {
      alert(`Perfil: ${profile.name}\nDescripción: ${profile.description}\nCategoría: ${profile.category}\nConfiguraciones: ${Object.keys(profile.configurations).length}`);
    }
  }

  editProfile(profileId) {
    const profile = this.configProfiles.find(p => p.id === profileId);
    if (profile) {
      const newName = prompt('Nuevo nombre:', profile.name);
      if (newName) {
        profile.name = newName;
        this.saveConfigProfiles();
      }
    }
  }

  showDependencyDetails(dependencyId) {
    const dependency = this.configDependencies.find(d => d.id === dependencyId);
    if (dependency) {
      alert(`Dependencia: ${dependency.condition}\nParámetro origen: ${dependency.sourceParameterId}\nParámetro destino: ${dependency.targetParameterId}\nAcción: ${dependency.action}`);
    }
  }

  editDependency(dependencyId) {
    const dependency = this.configDependencies.find(d => d.id === dependencyId);
    if (dependency) {
      const newCondition = prompt('Nueva condición:', dependency.condition);
      if (newCondition) {
        dependency.condition = newCondition;
        this.saveConfigDependencies();
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

// Inicializar sistema de configuración avanzada
let axyraAdvancedConfigurationSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraAdvancedConfigurationSystem = new AxyraAdvancedConfigurationSystem();
  window.axyraAdvancedConfigurationSystem = axyraAdvancedConfigurationSystem;
});

// Exportar para uso global
window.AxyraAdvancedConfigurationSystem = AxyraAdvancedConfigurationSystem;
