/**
 * AXYRA - Sistema de Gestión de Flujos de Trabajo
 * Maneja workflows, procesos y automatizaciones
 */

class AxyraWorkflowManagement {
  constructor() {
    this.workflows = [];
    this.processes = [];
    this.steps = [];
    this.conditions = [];
    this.actions = [];
    this.executions = [];

    this.init();
  }

  init() {
    console.log('🔄 Inicializando sistema de gestión de flujos de trabajo...');
    this.loadData();
    this.setupDefaultWorkflows();
    this.setupWorkflowEngine();
    this.setupEventListeners();
  }

  loadData() {
    try {
      this.workflows = JSON.parse(localStorage.getItem('axyra_workflows') || '[]');
      this.processes = JSON.parse(localStorage.getItem('axyra_processes') || '[]');
      this.steps = JSON.parse(localStorage.getItem('axyra_workflow_steps') || '[]');
      this.conditions = JSON.parse(localStorage.getItem('axyra_workflow_conditions') || '[]');
      this.actions = JSON.parse(localStorage.getItem('axyra_workflow_actions') || '[]');
      this.executions = JSON.parse(localStorage.getItem('axyra_workflow_executions') || '[]');
    } catch (error) {
      console.error('Error cargando datos de workflows:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_workflows', JSON.stringify(this.workflows));
      localStorage.setItem('axyra_processes', JSON.stringify(this.processes));
      localStorage.setItem('axyra_workflow_steps', JSON.stringify(this.steps));
      localStorage.setItem('axyra_workflow_conditions', JSON.stringify(this.conditions));
      localStorage.setItem('axyra_workflow_actions', JSON.stringify(this.actions));
      localStorage.setItem('axyra_workflow_executions', JSON.stringify(this.executions));
    } catch (error) {
      console.error('Error guardando datos de workflows:', error);
    }
  }

  setupDefaultWorkflows() {
    if (this.workflows.length === 0) {
      this.workflows = [
        {
          id: 'employee_onboarding',
          name: 'Incorporación de Empleado',
          description: 'Proceso de incorporación de nuevos empleados',
          status: 'active',
          trigger: 'employee_created',
          steps: ['create_account', 'send_welcome_email', 'assign_manager', 'schedule_training'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'payroll_approval',
          name: 'Aprobación de Nómina',
          description: 'Proceso de aprobación de nómina mensual',
          status: 'active',
          trigger: 'payroll_generated',
          steps: ['notify_manager', 'wait_approval', 'send_notifications', 'finalize_payroll'],
          createdAt: new Date().toISOString(),
        },
        {
          id: 'inventory_low_stock',
          name: 'Stock Bajo',
          description: 'Proceso cuando el stock está bajo',
          status: 'active',
          trigger: 'inventory_low_stock',
          steps: ['check_stock', 'notify_purchasing', 'create_purchase_order', 'update_inventory'],
          createdAt: new Date().toISOString(),
        },
      ];
      this.saveData();
    }
  }

  setupWorkflowEngine() {
    // Configurar motor de workflows
    this.engine = {
      isRunning: false,
      currentExecution: null,
      queue: [],
    };
  }

  setupEventListeners() {
    // Escuchar eventos del sistema
    document.addEventListener('workflowEvent', (event) => {
      this.handleWorkflowEvent(event.detail);
    });
  }

  createWorkflow(workflowData) {
    const workflow = {
      id: workflowData.id || 'workflow_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: workflowData.name,
      description: workflowData.description || '',
      status: workflowData.status || 'draft',
      trigger: workflowData.trigger,
      steps: workflowData.steps || [],
      conditions: workflowData.conditions || [],
      actions: workflowData.actions || [],
      variables: workflowData.variables || {},
      settings: workflowData.settings || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    this.workflows.push(workflow);
    this.saveData();

    console.log('✅ Workflow creado:', workflow.name);
    return workflow;
  }

  updateWorkflow(workflowId, updates) {
    const workflowIndex = this.workflows.findIndex((w) => w.id === workflowId);
    if (workflowIndex === -1) {
      throw new Error('Workflow no encontrado');
    }

    this.workflows[workflowIndex] = {
      ...this.workflows[workflowIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();
    console.log('✅ Workflow actualizado:', this.workflows[workflowIndex].name);
    return this.workflows[workflowIndex];
  }

  deleteWorkflow(workflowId) {
    const workflowIndex = this.workflows.findIndex((w) => w.id === workflowId);
    if (workflowIndex === -1) {
      throw new Error('Workflow no encontrado');
    }

    const workflow = this.workflows[workflowIndex];
    this.workflows.splice(workflowIndex, 1);
    this.saveData();

    console.log('🗑️ Workflow eliminado:', workflow.name);
    return workflow;
  }

  createStep(stepData) {
    const step = {
      id: stepData.id || 'step_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: stepData.name,
      type: stepData.type, // 'action', 'condition', 'wait', 'parallel'
      description: stepData.description || '',
      workflowId: stepData.workflowId,
      order: stepData.order || 0,
      config: stepData.config || {},
      conditions: stepData.conditions || [],
      actions: stepData.actions || [],
      nextSteps: stepData.nextSteps || [],
      errorHandling: stepData.errorHandling || 'stop',
      timeout: stepData.timeout || 300000, // 5 minutos
      retries: stepData.retries || 0,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    this.steps.push(step);
    this.saveData();

    console.log('✅ Paso creado:', step.name);
    return step;
  }

  createCondition(conditionData) {
    const condition = {
      id: conditionData.id || 'condition_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: conditionData.name,
      type: conditionData.type, // 'field', 'expression', 'api', 'database'
      description: conditionData.description || '',
      expression: conditionData.expression || '',
      field: conditionData.field || '',
      operator: conditionData.operator || 'equals',
      value: conditionData.value || '',
      apiEndpoint: conditionData.apiEndpoint || '',
      databaseQuery: conditionData.databaseQuery || '',
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    this.conditions.push(condition);
    this.saveData();

    console.log('✅ Condición creada:', condition.name);
    return condition;
  }

  createAction(actionData) {
    const action = {
      id: actionData.id || 'action_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: actionData.name,
      type: actionData.type, // 'email', 'sms', 'notification', 'api', 'database', 'file'
      description: actionData.description || '',
      config: actionData.config || {},
      template: actionData.template || '',
      recipients: actionData.recipients || [],
      data: actionData.data || {},
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    this.actions.push(action);
    this.saveData();

    console.log('✅ Acción creada:', action.name);
    return action;
  }

  executeWorkflow(workflowId, data = {}) {
    const workflow = this.workflows.find((w) => w.id === workflowId);
    if (!workflow) {
      throw new Error('Workflow no encontrado');
    }

    if (workflow.status !== 'active') {
      throw new Error('Workflow no está activo');
    }

    const execution = {
      id: 'exec_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      workflowId: workflowId,
      workflowName: workflow.name,
      status: 'running',
      data: data,
      currentStep: 0,
      steps: workflow.steps,
      results: [],
      errors: [],
      startedAt: new Date().toISOString(),
      completedAt: null,
      createdBy: this.getCurrentUser(),
    };

    this.executions.push(execution);
    this.saveData();

    // Ejecutar workflow
    this.runWorkflow(execution);

    console.log('🚀 Workflow ejecutado:', workflow.name);
    return execution;
  }

  async runWorkflow(execution) {
    try {
      this.engine.isRunning = true;
      this.engine.currentExecution = execution;

      for (let i = 0; i < execution.steps.length; i++) {
        execution.currentStep = i;
        const stepId = execution.steps[i];
        const step = this.steps.find((s) => s.id === stepId);

        if (!step) {
          throw new Error(`Paso no encontrado: ${stepId}`);
        }

        // Ejecutar paso
        const result = await this.executeStep(step, execution.data);
        execution.results.push({
          stepId: stepId,
          stepName: step.name,
          result: result,
          executedAt: new Date().toISOString(),
        });

        // Verificar condiciones
        if (step.conditions && step.conditions.length > 0) {
          const shouldContinue = await this.evaluateConditions(step.conditions, execution.data);
          if (!shouldContinue) {
            execution.status = 'stopped';
            break;
          }
        }
      }

      execution.status = 'completed';
      execution.completedAt = new Date().toISOString();
    } catch (error) {
      execution.status = 'failed';
      execution.errors.push({
        step: execution.currentStep,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
    } finally {
      this.engine.isRunning = false;
      this.engine.currentExecution = null;
      this.saveData();
    }
  }

  async executeStep(step, data) {
    switch (step.type) {
      case 'action':
        return await this.executeActionStep(step, data);
      case 'condition':
        return await this.executeConditionStep(step, data);
      case 'wait':
        return await this.executeWaitStep(step, data);
      case 'parallel':
        return await this.executeParallelStep(step, data);
      default:
        throw new Error(`Tipo de paso no soportado: ${step.type}`);
    }
  }

  async executeActionStep(step, data) {
    const results = [];

    for (const actionId of step.actions) {
      const action = this.actions.find((a) => a.id === actionId);
      if (!action) {
        throw new Error(`Acción no encontrada: ${actionId}`);
      }

      const result = await this.executeAction(action, data);
      results.push(result);
    }

    return results;
  }

  async executeAction(action, data) {
    switch (action.type) {
      case 'email':
        return await this.sendEmailAction(action, data);
      case 'sms':
        return await this.sendSMSAction(action, data);
      case 'notification':
        return await this.sendNotificationAction(action, data);
      case 'api':
        return await this.callAPIAction(action, data);
      case 'database':
        return await this.executeDatabaseAction(action, data);
      case 'file':
        return await this.executeFileAction(action, data);
      default:
        throw new Error(`Tipo de acción no soportado: ${action.type}`);
    }
  }

  async sendEmailAction(action, data) {
    if (window.axyraExternalIntegrations) {
      const subject = this.replaceVariables(action.template, data);
      const body = this.replaceVariables(action.config.body || '', data);

      for (const recipient of action.recipients) {
        await window.axyraExternalIntegrations.sendEmail(recipient.email, subject, body);
      }
    }
    return { success: true, action: 'email' };
  }

  async sendSMSAction(action, data) {
    if (window.axyraExternalIntegrations) {
      const message = this.replaceVariables(action.template, data);

      for (const recipient of action.recipients) {
        await window.axyraExternalIntegrations.sendSMS(recipient.phone, message);
      }
    }
    return { success: true, action: 'sms' };
  }

  async sendNotificationAction(action, data) {
    if (window.axyraAdvancedNotifications) {
      const title = this.replaceVariables(action.config.title || '', data);
      const message = this.replaceVariables(action.template, data);

      await window.axyraAdvancedNotifications.createNotification({
        title: title,
        message: message,
        recipients: action.recipients,
        channels: action.config.channels || ['in-app'],
      });
    }
    return { success: true, action: 'notification' };
  }

  async callAPIAction(action, data) {
    // Simular llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, action: 'api', data: data });
      }, 1000);
    });
  }

  async executeDatabaseAction(action, data) {
    // Simular acción de base de datos
    return { success: true, action: 'database', data: data };
  }

  async executeFileAction(action, data) {
    // Simular acción de archivo
    return { success: true, action: 'file', data: data };
  }

  async executeConditionStep(step, data) {
    const conditions = step.conditions
      .map((conditionId) => this.conditions.find((c) => c.id === conditionId))
      .filter(Boolean);

    return await this.evaluateConditions(conditions, data);
  }

  async executeWaitStep(step, data) {
    const duration = step.config.duration || 1000;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, action: 'wait', duration: duration });
      }, duration);
    });
  }

  async executeParallelStep(step, data) {
    const promises = step.actions.map((actionId) =>
      this.executeAction(
        this.actions.find((a) => a.id === actionId),
        data
      )
    );

    const results = await Promise.all(promises);
    return results;
  }

  async evaluateConditions(conditions, data) {
    for (const condition of conditions) {
      const result = await this.evaluateCondition(condition, data);
      if (!result) {
        return false;
      }
    }
    return true;
  }

  async evaluateCondition(condition, data) {
    switch (condition.type) {
      case 'field':
        return this.evaluateFieldCondition(condition, data);
      case 'expression':
        return this.evaluateExpressionCondition(condition, data);
      case 'api':
        return await this.evaluateAPICondition(condition, data);
      case 'database':
        return await this.evaluateDatabaseCondition(condition, data);
      default:
        return false;
    }
  }

  evaluateFieldCondition(condition, data) {
    const fieldValue = this.getNestedValue(data, condition.field);
    const expectedValue = condition.value;

    switch (condition.operator) {
      case 'equals':
        return fieldValue === expectedValue;
      case 'not_equals':
        return fieldValue !== expectedValue;
      case 'greater_than':
        return fieldValue > expectedValue;
      case 'less_than':
        return fieldValue < expectedValue;
      case 'contains':
        return String(fieldValue).includes(String(expectedValue));
      case 'not_contains':
        return !String(fieldValue).includes(String(expectedValue));
      default:
        return false;
    }
  }

  evaluateExpressionCondition(condition, data) {
    try {
      // Evaluar expresión JavaScript (en un entorno real usaría un evaluador seguro)
      const expression = condition.expression.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return this.getNestedValue(data, key) || match;
      });

      return eval(expression);
    } catch (error) {
      console.error('Error evaluando expresión:', error);
      return false;
    }
  }

  async evaluateAPICondition(condition, data) {
    // Simular evaluación de API
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  }

  async evaluateDatabaseCondition(condition, data) {
    // Simular evaluación de base de datos
    return true;
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  replaceVariables(text, data) {
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.getNestedValue(data, key) || match;
    });
  }

  handleWorkflowEvent(eventData) {
    const { eventType, data } = eventData;

    // Buscar workflows que respondan a este evento
    const triggeredWorkflows = this.workflows.filter((w) => w.status === 'active' && w.trigger === eventType);

    // Ejecutar workflows
    triggeredWorkflows.forEach((workflow) => {
      this.executeWorkflow(workflow.id, data);
    });
  }

  getWorkflows(filters = {}) {
    let filteredWorkflows = [...this.workflows];

    if (filters.status) {
      filteredWorkflows = filteredWorkflows.filter((w) => w.status === filters.status);
    }

    if (filters.trigger) {
      filteredWorkflows = filteredWorkflows.filter((w) => w.trigger === filters.trigger);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredWorkflows = filteredWorkflows.filter(
        (w) => w.name.toLowerCase().includes(searchTerm) || w.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredWorkflows;
  }

  getExecutions(filters = {}) {
    let filteredExecutions = [...this.executions];

    if (filters.workflowId) {
      filteredExecutions = filteredExecutions.filter((e) => e.workflowId === filters.workflowId);
    }

    if (filters.status) {
      filteredExecutions = filteredExecutions.filter((e) => e.status === filters.status);
    }

    if (filters.dateFrom) {
      filteredExecutions = filteredExecutions.filter((e) => new Date(e.startedAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filteredExecutions = filteredExecutions.filter((e) => new Date(e.startedAt) <= new Date(filters.dateTo));
    }

    return filteredExecutions;
  }

  getWorkflowStatistics() {
    const totalWorkflows = this.workflows.length;
    const activeWorkflows = this.workflows.filter((w) => w.status === 'active').length;
    const totalExecutions = this.executions.length;
    const successfulExecutions = this.executions.filter((e) => e.status === 'completed').length;
    const failedExecutions = this.executions.filter((e) => e.status === 'failed').length;

    return {
      totalWorkflows: totalWorkflows,
      activeWorkflows: activeWorkflows,
      totalExecutions: totalExecutions,
      successfulExecutions: successfulExecutions,
      failedExecutions: failedExecutions,
      successRate: totalExecutions > 0 ? (successfulExecutions / totalExecutions) * 100 : 0,
    };
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  exportWorkflows(format = 'json') {
    const data = {
      workflows: this.workflows,
      steps: this.steps,
      conditions: this.conditions,
      actions: this.actions,
      exportDate: new Date().toISOString(),
    };

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertWorkflowsToCSV();
        filename = 'axyra-workflows.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-workflows.json';
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

    console.log('📊 Workflows exportados');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Workflows exportados');
    }
  }

  convertWorkflowsToCSV() {
    const rows = [];

    // Encabezados
    rows.push(['ID', 'Nombre', 'Descripción', 'Estado', 'Trigger', 'Pasos', 'Creado']);

    // Datos
    this.workflows.forEach((workflow) => {
      rows.push([
        workflow.id,
        workflow.name,
        workflow.description,
        workflow.status,
        workflow.trigger,
        workflow.steps.length,
        new Date(workflow.createdAt).toLocaleDateString(),
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }
}

// Inicializar sistema de gestión de workflows
let axyraWorkflowManagement;
document.addEventListener('DOMContentLoaded', () => {
  axyraWorkflowManagement = new AxyraWorkflowManagement();
  window.axyraWorkflowManagement = axyraWorkflowManagement;
});

// Exportar para uso global
window.AxyraWorkflowManagement = AxyraWorkflowManagement;

