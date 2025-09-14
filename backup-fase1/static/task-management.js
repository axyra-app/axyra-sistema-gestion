/**
 * AXYRA - Sistema de Gestión de Tareas y Proyectos
 * Maneja tareas, proyectos y flujos de trabajo
 */

class AxyraTaskManagement {
  constructor() {
    this.tasks = [];
    this.projects = [];
    this.categories = [];
    this.priorities = ['Baja', 'Media', 'Alta', 'Crítica'];
    this.statuses = ['Pendiente', 'En Progreso', 'Completada', 'Cancelada', 'Pausada'];
    this.workflows = {};

    this.init();
  }

  init() {
    console.log('📋 Inicializando sistema de gestión de tareas...');
    this.loadData();
    this.setupWorkflows();
    this.setupNotifications();
    this.setupAutoAssignments();
  }

  loadData() {
    try {
      this.tasks = JSON.parse(localStorage.getItem('axyra_tasks') || '[]');
      this.projects = JSON.parse(localStorage.getItem('axyra_projects') || '[]');
      this.categories = JSON.parse(localStorage.getItem('axyra_task_categories') || '[]');
    } catch (error) {
      console.error('Error cargando datos de tareas:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_tasks', JSON.stringify(this.tasks));
      localStorage.setItem('axyra_projects', JSON.stringify(this.projects));
      localStorage.setItem('axyra_task_categories', JSON.stringify(this.categories));
    } catch (error) {
      console.error('Error guardando datos de tareas:', error);
    }
  }

  setupWorkflows() {
    this.workflows = {
      default: {
        name: 'Flujo por Defecto',
        steps: ['Pendiente', 'En Progreso', 'Completada'],
        transitions: {
          Pendiente: ['En Progreso', 'Cancelada'],
          'En Progreso': ['Completada', 'Pausada', 'Cancelada'],
          Pausada: ['En Progreso', 'Cancelada'],
          Completada: [],
          Cancelada: [],
        },
      },
      approval: {
        name: 'Flujo de Aprobación',
        steps: ['Pendiente', 'En Revisión', 'Aprobada', 'Rechazada', 'Completada'],
        transitions: {
          Pendiente: ['En Revisión', 'Cancelada'],
          'En Revisión': ['Aprobada', 'Rechazada', 'Cancelada'],
          Aprobada: ['Completada', 'Cancelada'],
          Rechazada: ['En Revisión', 'Cancelada'],
          Completada: [],
          Cancelada: [],
        },
      },
      development: {
        name: 'Flujo de Desarrollo',
        steps: ['Pendiente', 'En Desarrollo', 'En Pruebas', 'Completada', 'Cancelada'],
        transitions: {
          Pendiente: ['En Desarrollo', 'Cancelada'],
          'En Desarrollo': ['En Pruebas', 'Cancelada'],
          'En Pruebas': ['Completada', 'En Desarrollo', 'Cancelada'],
          Completada: [],
          Cancelada: [],
        },
      },
    };
  }

  setupNotifications() {
    // Notificaciones para tareas próximas a vencer
    setInterval(() => {
      this.checkUpcomingDeadlines();
    }, 60 * 60 * 1000); // Cada hora

    // Notificaciones para tareas asignadas
    setInterval(() => {
      this.checkAssignedTasks();
    }, 30 * 60 * 1000); // Cada 30 minutos
  }

  setupAutoAssignments() {
    // Asignación automática basada en reglas
    this.autoAssignmentRules = {
      byCategory: {
        Desarrollo: 'developer',
        Diseño: 'designer',
        Marketing: 'marketer',
        Ventas: 'sales',
      },
      byPriority: {
        Crítica: 'manager',
        Alta: 'supervisor',
      },
      byProject: {},
    };
  }

  createTask(taskData) {
    const task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description || '',
      category: taskData.category || 'General',
      priority: taskData.priority || 'Media',
      status: 'Pendiente',
      assignee: taskData.assignee || null,
      project: taskData.project || null,
      dueDate: taskData.dueDate || null,
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: 0,
      tags: taskData.tags || [],
      attachments: [],
      comments: [],
      workflow: taskData.workflow || 'default',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
      progress: 0,
    };

    // Aplicar reglas de asignación automática
    if (!task.assignee) {
      task.assignee = this.autoAssignTask(task);
    }

    this.tasks.push(task);
    this.saveData();

    // Notificar creación
    this.notifyTaskCreated(task);

    console.log('✅ Tarea creada:', task.title);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Tarea creada: ${task.title}`);
    }

    return task;
  }

  autoAssignTask(task) {
    // Asignar por categoría
    if (this.autoAssignmentRules.byCategory[task.category]) {
      return this.autoAssignmentRules.byCategory[task.category];
    }

    // Asignar por prioridad
    if (this.autoAssignmentRules.byPriority[task.priority]) {
      return this.autoAssignmentRules.byPriority[task.priority];
    }

    // Asignar por proyecto
    if (task.project && this.autoAssignmentRules.byProject[task.project]) {
      return this.autoAssignmentRules.byProject[task.project];
    }

    return null;
  }

  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Tarea no encontrada');
    }

    const oldTask = { ...this.tasks[taskIndex] };
    this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };

    // Validar transición de estado
    if (updates.status && updates.status !== oldTask.status) {
      this.validateStatusTransition(oldTask.status, updates.status, this.tasks[taskIndex].workflow);
    }

    this.saveData();

    // Notificar cambios
    this.notifyTaskUpdated(oldTask, this.tasks[taskIndex]);

    console.log('✅ Tarea actualizada:', this.tasks[taskIndex].title);

    return this.tasks[taskIndex];
  }

  validateStatusTransition(fromStatus, toStatus, workflow) {
    const workflowConfig = this.workflows[workflow];
    if (!workflowConfig) {
      throw new Error('Flujo de trabajo no encontrado');
    }

    const allowedTransitions = workflowConfig.transitions[fromStatus] || [];
    if (!allowedTransitions.includes(toStatus)) {
      throw new Error(`Transición no permitida de ${fromStatus} a ${toStatus}`);
    }
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Tarea no encontrada');
    }

    const task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);
    this.saveData();

    // Notificar eliminación
    this.notifyTaskDeleted(task);

    console.log('🗑️ Tarea eliminada:', task.title);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showWarning(`Tarea eliminada: ${task.title}`);
    }
  }

  createProject(projectData) {
    const project = {
      id: 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: projectData.name,
      description: projectData.description || '',
      status: 'Activo',
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      endDate: projectData.endDate || null,
      budget: projectData.budget || 0,
      manager: projectData.manager || this.getCurrentUser(),
      team: projectData.team || [],
      tags: projectData.tags || [],
      attachments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0,
    };

    this.projects.push(project);
    this.saveData();

    // Notificar creación
    this.notifyProjectCreated(project);

    console.log('✅ Proyecto creado:', project.name);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Proyecto creado: ${project.name}`);
    }

    return project;
  }

  updateProject(projectId, updates) {
    const projectIndex = this.projects.findIndex((p) => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Proyecto no encontrado');
    }

    const oldProject = { ...this.projects[projectIndex] };
    this.projects[projectIndex] = { ...this.projects[projectIndex], ...updates, updatedAt: new Date().toISOString() };

    // Recalcular progreso
    this.projects[projectIndex].progress = this.calculateProjectProgress(projectId);

    this.saveData();

    // Notificar cambios
    this.notifyProjectUpdated(oldProject, this.projects[projectIndex]);

    console.log('✅ Proyecto actualizado:', this.projects[projectIndex].name);

    return this.projects[projectIndex];
  }

  calculateProjectProgress(projectId) {
    const projectTasks = this.tasks.filter((t) => t.project === projectId);
    if (projectTasks.length === 0) return 0;

    const completedTasks = projectTasks.filter((t) => t.status === 'Completada').length;
    return Math.round((completedTasks / projectTasks.length) * 100);
  }

  createCategory(categoryData) {
    const category = {
      id: 'cat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: categoryData.name,
      description: categoryData.description || '',
      color: categoryData.color || '#3498db',
      icon: categoryData.icon || '📋',
      createdAt: new Date().toISOString(),
    };

    this.categories.push(category);
    this.saveData();

    console.log('✅ Categoría creada:', category.name);

    return category;
  }

  getTasks(filters = {}) {
    let filteredTasks = [...this.tasks];

    if (filters.status) {
      filteredTasks = filteredTasks.filter((t) => t.status === filters.status);
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter((t) => t.priority === filters.priority);
    }

    if (filters.category) {
      filteredTasks = filteredTasks.filter((t) => t.category === filters.category);
    }

    if (filters.assignee) {
      filteredTasks = filteredTasks.filter((t) => t.assignee === filters.assignee);
    }

    if (filters.project) {
      filteredTasks = filteredTasks.filter((t) => t.project === filters.project);
    }

    if (filters.dueDate) {
      const today = new Date().toISOString().split('T')[0];
      filteredTasks = filteredTasks.filter((t) => t.dueDate && t.dueDate <= filters.dueDate);
    }

    if (filters.overdue) {
      const today = new Date().toISOString().split('T')[0];
      filteredTasks = filteredTasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== 'Completada');
    }

    return filteredTasks;
  }

  getProjects(filters = {}) {
    let filteredProjects = [...this.projects];

    if (filters.status) {
      filteredProjects = filteredProjects.filter((p) => p.status === filters.status);
    }

    if (filters.manager) {
      filteredProjects = filteredProjects.filter((p) => p.manager === filters.manager);
    }

    return filteredProjects;
  }

  getTaskById(taskId) {
    return this.tasks.find((t) => t.id === taskId);
  }

  getProjectById(projectId) {
    return this.projects.find((p) => p.id === projectId);
  }

  getTasksByProject(projectId) {
    return this.tasks.filter((t) => t.project === projectId);
  }

  getTasksByAssignee(assignee) {
    return this.tasks.filter((t) => t.assignee === assignee);
  }

  getOverdueTasks() {
    const today = new Date().toISOString().split('T')[0];
    return this.tasks.filter((t) => t.dueDate && t.dueDate < today && t.status !== 'Completada');
  }

  getUpcomingTasks(days = 7) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    const futureDateStr = futureDate.toISOString().split('T')[0];

    return this.tasks.filter((t) => t.dueDate && t.dueDate <= futureDateStr && t.status !== 'Completada');
  }

  addComment(taskId, comment) {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    const newComment = {
      id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      text: comment.text,
      author: this.getCurrentUser(),
      timestamp: new Date().toISOString(),
      type: comment.type || 'comment',
    };

    task.comments.push(newComment);
    task.updatedAt = new Date().toISOString();

    this.saveData();

    // Notificar comentario
    this.notifyTaskCommented(task, newComment);

    console.log('💬 Comentario agregado a tarea:', task.title);

    return newComment;
  }

  addAttachment(taskId, file) {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    const attachment = {
      id: 'att_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      uploadedBy: this.getCurrentUser(),
      uploadedAt: new Date().toISOString(),
    };

    task.attachments.push(attachment);
    task.updatedAt = new Date().toISOString();

    this.saveData();

    console.log('📎 Archivo adjunto agregado a tarea:', task.title);

    return attachment;
  }

  updateTaskProgress(taskId, progress) {
    const task = this.getTaskById(taskId);
    if (!task) {
      throw new Error('Tarea no encontrada');
    }

    task.progress = Math.max(0, Math.min(100, progress));
    task.updatedAt = new Date().toISOString();

    // Si el progreso es 100%, marcar como completada
    if (task.progress === 100 && task.status !== 'Completada') {
      task.status = 'Completada';
      this.notifyTaskCompleted(task);
    }

    this.saveData();

    console.log(`📊 Progreso actualizado para tarea ${task.title}: ${progress}%`);

    return task;
  }

  checkUpcomingDeadlines() {
    const upcomingTasks = this.getUpcomingTasks(3); // Próximos 3 días

    upcomingTasks.forEach((task) => {
      const daysUntilDue = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

      if (daysUntilDue <= 1) {
        this.notifyTaskDeadline(task, daysUntilDue);
      }
    });
  }

  checkAssignedTasks() {
    const currentUser = this.getCurrentUser();
    const assignedTasks = this.getTasksByAssignee(currentUser);
    const pendingTasks = assignedTasks.filter((t) => t.status === 'Pendiente');

    if (pendingTasks.length > 0) {
      this.notifyAssignedTasks(pendingTasks);
    }
  }

  notifyTaskCreated(task) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo(`Nueva tarea asignada: ${task.title}`);
    }
  }

  notifyTaskUpdated(oldTask, newTask) {
    if (window.axyraNotificationSystem) {
      if (oldTask.status !== newTask.status) {
        window.axyraNotificationSystem.showInfo(`Tarea ${newTask.title} actualizada a ${newTask.status}`);
      }
    }
  }

  notifyTaskDeleted(task) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showWarning(`Tarea eliminada: ${task.title}`);
    }
  }

  notifyTaskCompleted(task) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Tarea completada: ${task.title}`);
    }
  }

  notifyTaskDeadline(task, daysUntilDue) {
    if (window.axyraNotificationSystem) {
      const message =
        daysUntilDue === 0 ? `Tarea vence hoy: ${task.title}` : `Tarea vence en ${daysUntilDue} días: ${task.title}`;

      window.axyraNotificationSystem.showWarning(message);
    }
  }

  notifyAssignedTasks(tasks) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo(`Tienes ${tasks.length} tareas pendientes`);
    }
  }

  notifyTaskCommented(task, comment) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo(`Nuevo comentario en tarea: ${task.title}`);
    }
  }

  notifyProjectCreated(project) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo(`Nuevo proyecto creado: ${project.name}`);
    }
  }

  notifyProjectUpdated(oldProject, newProject) {
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showInfo(`Proyecto actualizado: ${newProject.name}`);
    }
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  getTaskStatistics() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter((t) => t.status === 'Completada').length;
    const pendingTasks = this.tasks.filter((t) => t.status === 'Pendiente').length;
    const inProgressTasks = this.tasks.filter((t) => t.status === 'En Progreso').length;
    const overdueTasks = this.getOverdueTasks().length;

    return {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      inProgress: inProgressTasks,
      overdue: overdueTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  }

  getProjectStatistics() {
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter((p) => p.status === 'Activo').length;
    const completedProjects = this.projects.filter((p) => p.status === 'Completado').length;

    return {
      total: totalProjects,
      active: activeProjects,
      completed: completedProjects,
      completionRate: totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0,
    };
  }

  exportTasks(format = 'json') {
    const data = {
      tasks: this.tasks,
      projects: this.projects,
      categories: this.categories,
      exportDate: new Date().toISOString(),
    };

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertTasksToCSV();
        filename = 'axyra-tasks.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-tasks.json';
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

    console.log('📊 Tareas exportadas');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Tareas exportadas');
    }
  }

  convertTasksToCSV() {
    const rows = [];

    // Encabezados
    rows.push([
      'ID',
      'Título',
      'Descripción',
      'Categoría',
      'Prioridad',
      'Estado',
      'Asignado',
      'Proyecto',
      'Fecha Vencimiento',
      'Progreso',
      'Creado',
    ]);

    // Datos
    this.tasks.forEach((task) => {
      rows.push([
        task.id,
        task.title,
        task.description,
        task.category,
        task.priority,
        task.status,
        task.assignee || '',
        task.project || '',
        task.dueDate || '',
        task.progress + '%',
        new Date(task.createdAt).toLocaleDateString(),
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  importTasks(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (data.tasks) {
            this.tasks = [...this.tasks, ...data.tasks];
          }

          if (data.projects) {
            this.projects = [...this.projects, ...data.projects];
          }

          if (data.categories) {
            this.categories = [...this.categories, ...data.categories];
          }

          this.saveData();

          console.log('✅ Tareas importadas exitosamente');

          if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.showSuccess('Tareas importadas exitosamente');
          }

          resolve();
        } catch (error) {
          console.error('Error importando tareas:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };

      reader.readAsText(file);
    });
  }
}

// Inicializar sistema de gestión de tareas
let axyraTaskManagement;
document.addEventListener('DOMContentLoaded', () => {
  axyraTaskManagement = new AxyraTaskManagement();
  window.axyraTaskManagement = axyraTaskManagement;
});

// Exportar para uso global
window.AxyraTaskManagement = AxyraTaskManagement;
