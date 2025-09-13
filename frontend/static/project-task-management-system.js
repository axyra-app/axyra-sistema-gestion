/**
 * AXYRA - Sistema de Gestión de Proyectos y Tareas
 * Maneja proyectos, tareas, equipos, hitos y seguimiento
 */

class AxyraProjectTaskManagementSystem {
  constructor() {
    this.projects = [];
    this.tasks = [];
    this.teams = [];
    this.milestones = [];
    this.assignments = [];
    this.comments = [];
    this.attachments = [];
    this.timeTracking = [];
    this.projectLogs = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('📋 Inicializando sistema de gestión de proyectos y tareas...');
    this.loadProjects();
    this.loadTasks();
    this.loadTeams();
    this.loadMilestones();
    this.loadAssignments();
    this.loadComments();
    this.loadAttachments();
    this.loadTimeTracking();
    this.loadProjectLogs();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadProjects() {
    try {
      const stored = localStorage.getItem('axyra_projects');
      if (stored) {
        this.projects = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando proyectos:', error);
    }
  }

  saveProjects() {
    try {
      localStorage.setItem('axyra_projects', JSON.stringify(this.projects));
    } catch (error) {
      console.error('Error guardando proyectos:', error);
    }
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem('axyra_tasks');
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando tareas:', error);
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('axyra_tasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error guardando tareas:', error);
    }
  }

  loadTeams() {
    try {
      const stored = localStorage.getItem('axyra_teams');
      if (stored) {
        this.teams = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando equipos:', error);
    }
  }

  saveTeams() {
    try {
      localStorage.setItem('axyra_teams', JSON.stringify(this.teams));
    } catch (error) {
      console.error('Error guardando equipos:', error);
    }
  }

  loadMilestones() {
    try {
      const stored = localStorage.getItem('axyra_milestones');
      if (stored) {
        this.milestones = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando hitos:', error);
    }
  }

  saveMilestones() {
    try {
      localStorage.setItem('axyra_milestones', JSON.stringify(this.milestones));
    } catch (error) {
      console.error('Error guardando hitos:', error);
    }
  }

  loadAssignments() {
    try {
      const stored = localStorage.getItem('axyra_assignments');
      if (stored) {
        this.assignments = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando asignaciones:', error);
    }
  }

  saveAssignments() {
    try {
      localStorage.setItem('axyra_assignments', JSON.stringify(this.assignments));
    } catch (error) {
      console.error('Error guardando asignaciones:', error);
    }
  }

  loadComments() {
    try {
      const stored = localStorage.getItem('axyra_comments');
      if (stored) {
        this.comments = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando comentarios:', error);
    }
  }

  saveComments() {
    try {
      localStorage.setItem('axyra_comments', JSON.stringify(this.comments));
    } catch (error) {
      console.error('Error guardando comentarios:', error);
    }
  }

  loadAttachments() {
    try {
      const stored = localStorage.getItem('axyra_attachments');
      if (stored) {
        this.attachments = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando adjuntos:', error);
    }
  }

  saveAttachments() {
    try {
      localStorage.setItem('axyra_attachments', JSON.stringify(this.attachments));
    } catch (error) {
      console.error('Error guardando adjuntos:', error);
    }
  }

  loadTimeTracking() {
    try {
      const stored = localStorage.getItem('axyra_time_tracking');
      if (stored) {
        this.timeTracking = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando seguimiento de tiempo:', error);
    }
  }

  saveTimeTracking() {
    try {
      localStorage.setItem('axyra_time_tracking', JSON.stringify(this.timeTracking));
    } catch (error) {
      console.error('Error guardando seguimiento de tiempo:', error);
    }
  }

  loadProjectLogs() {
    try {
      const stored = localStorage.getItem('axyra_project_logs');
      if (stored) {
        this.projectLogs = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando logs de proyecto:', error);
    }
  }

  saveProjectLogs() {
    try {
      localStorage.setItem('axyra_project_logs', JSON.stringify(this.projectLogs));
    } catch (error) {
      console.error('Error guardando logs de proyecto:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en proyectos
    document.addEventListener('projectChanged', (event) => {
      this.handleProjectChange(event.detail);
    });

    // Escuchar cambios en tareas
    document.addEventListener('taskChanged', (event) => {
      this.handleTaskChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.teams.length === 0) {
      this.teams = [
        {
          id: 'development_team',
          name: 'Equipo de Desarrollo',
          description: 'Equipo encargado del desarrollo de software',
          members: [],
          isActive: true,
        },
        {
          id: 'design_team',
          name: 'Equipo de Diseño',
          description: 'Equipo encargado del diseño y UX/UI',
          members: [],
          isActive: true,
        },
        {
          id: 'qa_team',
          name: 'Equipo de QA',
          description: 'Equipo encargado de la calidad y testing',
          members: [],
          isActive: true,
        },
      ];
      this.saveTeams();
    }
  }

  handleProjectChange(change) {
    const { projectId, action, data } = change;

    switch (action) {
      case 'created':
        this.projects.push(data);
        this.saveProjects();
        break;
      case 'updated':
        const projectIndex = this.projects.findIndex((p) => p.id === projectId);
        if (projectIndex !== -1) {
          this.projects[projectIndex] = { ...this.projects[projectIndex], ...data };
          this.saveProjects();
        }
        break;
      case 'deleted':
        this.projects = this.projects.filter((p) => p.id !== projectId);
        this.saveProjects();
        break;
    }
  }

  handleTaskChange(change) {
    const { taskId, action, data } = change;

    switch (action) {
      case 'created':
        this.tasks.push(data);
        this.saveTasks();
        break;
      case 'updated':
        const taskIndex = this.tasks.findIndex((t) => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...data };
          this.saveTasks();
        }
        break;
      case 'deleted':
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        this.saveTasks();
        break;
    }
  }

  createProject(projectData) {
    const project = {
      id: 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: projectData.name,
      description: projectData.description || '',
      status: projectData.status || 'planning', // planning, active, on_hold, completed, cancelled
      priority: projectData.priority || 'medium', // low, medium, high, urgent
      startDate: projectData.startDate || new Date().toISOString(),
      endDate: projectData.endDate || null,
      budget: projectData.budget || 0,
      progress: projectData.progress || 0,
      teamId: projectData.teamId || null,
      isActive: projectData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.projects.push(project);
    this.saveProjects();

    console.log('✅ Proyecto creado:', project.name);
    return project;
  }

  createTask(taskData) {
    const task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId,
      status: taskData.status || 'todo', // todo, in_progress, review, done, cancelled
      priority: taskData.priority || 'medium', // low, medium, high, urgent
      assigneeId: taskData.assigneeId || null,
      dueDate: taskData.dueDate || null,
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: taskData.actualHours || 0,
      tags: taskData.tags || [],
      isActive: taskData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.tasks.push(task);
    this.saveTasks();

    console.log('✅ Tarea creada:', task.title);
    return task;
  }

  createTeam(teamData) {
    const team = {
      id: 'team_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: teamData.name,
      description: teamData.description || '',
      members: teamData.members || [],
      isActive: teamData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.teams.push(team);
    this.saveTeams();

    console.log('✅ Equipo creado:', team.name);
    return team;
  }

  createMilestone(milestoneData) {
    const milestone = {
      id: 'milestone_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: milestoneData.name,
      description: milestoneData.description || '',
      projectId: milestoneData.projectId,
      dueDate: milestoneData.dueDate,
      status: milestoneData.status || 'pending', // pending, in_progress, completed, overdue
      isActive: milestoneData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.milestones.push(milestone);
    this.saveMilestones();

    console.log('✅ Hito creado:', milestone.name);
    return milestone;
  }

  createAssignment(assignmentData) {
    const assignment = {
      id: 'assignment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      taskId: assignmentData.taskId,
      userId: assignmentData.userId,
      assignedAt: assignmentData.assignedAt || new Date().toISOString(),
      assignedBy: assignmentData.assignedBy || this.getCurrentUser(),
      isActive: assignmentData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.assignments.push(assignment);
    this.saveAssignments();

    console.log('✅ Asignación creada:', assignment.taskId);
    return assignment;
  }

  createComment(commentData) {
    const comment = {
      id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      taskId: commentData.taskId,
      userId: commentData.userId || this.getCurrentUser(),
      content: commentData.content,
      isActive: commentData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.comments.push(comment);
    this.saveComments();

    console.log('✅ Comentario creado:', comment.content);
    return comment;
  }

  createAttachment(attachmentData) {
    const attachment = {
      id: 'attachment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      taskId: attachmentData.taskId,
      fileName: attachmentData.fileName,
      fileSize: attachmentData.fileSize || 0,
      fileType: attachmentData.fileType || 'unknown',
      fileUrl: attachmentData.fileUrl || '',
      uploadedBy: attachmentData.uploadedBy || this.getCurrentUser(),
      isActive: attachmentData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.attachments.push(attachment);
    this.saveAttachments();

    console.log('✅ Adjunto creado:', attachment.fileName);
    return attachment;
  }

  createTimeTracking(timeTrackingData) {
    const timeTracking = {
      id: 'time_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      taskId: timeTrackingData.taskId,
      userId: timeTrackingData.userId || this.getCurrentUser(),
      startTime: timeTrackingData.startTime || new Date().toISOString(),
      endTime: timeTrackingData.endTime || null,
      duration: timeTrackingData.duration || 0, // en minutos
      description: timeTrackingData.description || '',
      isActive: timeTrackingData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.timeTracking.push(timeTracking);
    this.saveTimeTracking();

    console.log('✅ Seguimiento de tiempo creado:', timeTracking.taskId);
    return timeTracking;
  }

  createProjectLog(logData) {
    const log = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      level: logData.level, // info, warning, error, debug
      message: logData.message,
      projectId: logData.projectId || null,
      taskId: logData.taskId || null,
      userId: logData.userId || this.getCurrentUser(),
      source: logData.source || 'system',
      category: logData.category || 'general', // general, project, task, team, milestone
      data: logData.data || {},
      timestamp: new Date().toISOString(),
      metadata: {
        createdBy: this.getCurrentUser(),
      },
    };

    this.projectLogs.push(log);
    this.saveProjectLogs();

    console.log('✅ Log de proyecto creado:', log.message);
    return log;
  }

  getProjectStatistics() {
    const totalProjects = this.projects.length;
    const activeProjects = this.projects.filter((p) => p.isActive).length;
    const totalTasks = this.tasks.length;
    const activeTasks = this.tasks.filter((t) => t.isActive).length;
    const totalTeams = this.teams.length;
    const activeTeams = this.teams.filter((t) => t.isActive).length;
    const totalMilestones = this.milestones.length;
    const activeMilestones = this.milestones.filter((m) => m.isActive).length;
    const totalAssignments = this.assignments.length;
    const activeAssignments = this.assignments.filter((a) => a.isActive).length;
    const totalComments = this.comments.length;
    const totalAttachments = this.attachments.length;
    const totalTimeTracking = this.timeTracking.length;
    const totalLogs = this.projectLogs.length;
    const errorLogs = this.projectLogs.filter((l) => l.level === 'error').length;

    return {
      totalProjects,
      activeProjects,
      totalTasks,
      activeTasks,
      totalTeams,
      activeTeams,
      totalMilestones,
      activeMilestones,
      totalAssignments,
      activeAssignments,
      totalComments,
      totalAttachments,
      totalTimeTracking,
      totalLogs,
      errorLogs,
    };
  }

  showProjectManagementDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'project-management-dashboard';
    dashboard.innerHTML = `
      <div class="project-management-dashboard-overlay">
        <div class="project-management-dashboard-container">
          <div class="project-management-dashboard-header">
            <h3>📋 Dashboard de Gestión de Proyectos</h3>
            <div class="project-management-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraProjectTaskManagementSystem.showCreateProjectDialog()">Nuevo Proyecto</button>
              <button class="btn btn-secondary" onclick="axyraProjectTaskManagementSystem.showCreateTaskDialog()">Nueva Tarea</button>
              <button class="btn btn-close" onclick="document.getElementById('project-management-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="project-management-dashboard-body">
            <div class="project-management-dashboard-stats">
              ${this.renderProjectStats()}
            </div>
            <div class="project-management-dashboard-content">
              <div class="project-management-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="projects">Proyectos</button>
                <button class="tab-btn" data-tab="tasks">Tareas</button>
                <button class="tab-btn" data-tab="teams">Equipos</button>
                <button class="tab-btn" data-tab="milestones">Hitos</button>
                <button class="tab-btn" data-tab="assignments">Asignaciones</button>
                <button class="tab-btn" data-tab="comments">Comentarios</button>
                <button class="tab-btn" data-tab="attachments">Adjuntos</button>
                <button class="tab-btn" data-tab="time">Tiempo</button>
                <button class="tab-btn" data-tab="logs">Logs</button>
              </div>
              <div class="project-management-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="projects-tab">
                  ${this.renderProjectsList()}
                </div>
                <div class="tab-content" id="tasks-tab">
                  ${this.renderTasksList()}
                </div>
                <div class="tab-content" id="teams-tab">
                  ${this.renderTeamsList()}
                </div>
                <div class="tab-content" id="milestones-tab">
                  ${this.renderMilestonesList()}
                </div>
                <div class="tab-content" id="assignments-tab">
                  ${this.renderAssignmentsList()}
                </div>
                <div class="tab-content" id="comments-tab">
                  ${this.renderCommentsList()}
                </div>
                <div class="tab-content" id="attachments-tab">
                  ${this.renderAttachmentsList()}
                </div>
                <div class="tab-content" id="time-tab">
                  ${this.renderTimeTrackingList()}
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

  renderProjectStats() {
    const stats = this.getProjectStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalProjects}</div>
          <div class="stat-label">Total Proyectos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeProjects}</div>
          <div class="stat-label">Proyectos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTasks}</div>
          <div class="stat-label">Total Tareas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeTasks}</div>
          <div class="stat-label">Tareas Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTeams}</div>
          <div class="stat-label">Total Equipos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeTeams}</div>
          <div class="stat-label">Equipos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalMilestones}</div>
          <div class="stat-label">Total Hitos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeMilestones}</div>
          <div class="stat-label">Hitos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalAssignments}</div>
          <div class="stat-label">Total Asignaciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeAssignments}</div>
          <div class="stat-label">Asignaciones Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalComments}</div>
          <div class="stat-label">Total Comentarios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalAttachments}</div>
          <div class="stat-label">Total Adjuntos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalTimeTracking}</div>
          <div class="stat-label">Total Seguimiento</div>
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
    const stats = this.getProjectStatistics();

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Proyectos</h4>
          <div class="project-status">
            <div class="status-item">
              <span>Proyectos Activos</span>
              <span>${stats.activeProjects}/${stats.totalProjects}</span>
            </div>
            <div class="status-item">
              <span>Tareas Activas</span>
              <span>${stats.activeTasks}/${stats.totalTasks}</span>
            </div>
            <div class="status-item">
              <span>Equipos Activos</span>
              <span>${stats.activeTeams}/${stats.totalTeams}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Hitos y Asignaciones</h4>
          <div class="milestones-assignments">
            <div class="milestone-item">
              <span>Hitos Activos</span>
              <span>${stats.activeMilestones}</span>
            </div>
            <div class="milestone-item">
              <span>Asignaciones Activas</span>
              <span>${stats.activeAssignments}</span>
            </div>
            <div class="milestone-item">
              <span>Total Hitos</span>
              <span>${stats.totalMilestones}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Colaboración y Tiempo</h4>
          <div class="collaboration-time">
            <div class="collab-item">
              <span>Total Comentarios</span>
              <span>${stats.totalComments}</span>
            </div>
            <div class="collab-item">
              <span>Total Adjuntos</span>
              <span>${stats.totalAttachments}</span>
            </div>
            <div class="collab-item">
              <span>Total Seguimiento</span>
              <span>${stats.totalTimeTracking}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderProjectsList() {
    const projects = this.projects.slice(-20); // Últimos 20 proyectos

    return projects
      .map(
        (project) => `
      <div class="project-card">
        <div class="project-header">
          <h5>${project.name}</h5>
          <span class="project-status status-${project.status}">${project.status}</span>
        </div>
        <div class="project-info">
          <p>${project.description}</p>
          <p>Prioridad: ${project.priority}</p>
          <p>Progreso: ${project.progress}%</p>
          <p>Presupuesto: $${project.budget}</p>
        </div>
        <div class="project-actions">
          <button onclick="axyraProjectTaskManagementSystem.showProjectDetails('${project.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editProject('${project.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderTasksList() {
    const tasks = this.tasks.slice(-20); // Últimas 20 tareas

    return tasks
      .map(
        (task) => `
      <div class="task-card">
        <div class="task-header">
          <h5>${task.title}</h5>
          <span class="task-status status-${task.status}">${task.status}</span>
        </div>
        <div class="task-info">
          <p>${task.description}</p>
          <p>Prioridad: ${task.priority}</p>
          <p>Horas estimadas: ${task.estimatedHours}</p>
          <p>Horas reales: ${task.actualHours}</p>
        </div>
        <div class="task-actions">
          <button onclick="axyraProjectTaskManagementSystem.showTaskDetails('${task.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editTask('${task.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderTeamsList() {
    const teams = this.teams.slice(-20); // Últimos 20 equipos

    return teams
      .map(
        (team) => `
      <div class="team-card">
        <div class="team-header">
          <h5>${team.name}</h5>
          <span class="team-status ${team.isActive ? 'active' : 'inactive'}">${
          team.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="team-info">
          <p>${team.description}</p>
          <p>Miembros: ${team.members.length}</p>
        </div>
        <div class="team-actions">
          <button onclick="axyraProjectTaskManagementSystem.showTeamDetails('${team.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editTeam('${team.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderMilestonesList() {
    const milestones = this.milestones.slice(-20); // Últimos 20 hitos

    return milestones
      .map(
        (milestone) => `
      <div class="milestone-card">
        <div class="milestone-header">
          <h5>${milestone.name}</h5>
          <span class="milestone-status status-${milestone.status}">${milestone.status}</span>
        </div>
        <div class="milestone-info">
          <p>${milestone.description}</p>
          <p>Fecha límite: ${new Date(milestone.dueDate).toLocaleDateString()}</p>
        </div>
        <div class="milestone-actions">
          <button onclick="axyraProjectTaskManagementSystem.showMilestoneDetails('${milestone.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editMilestone('${milestone.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderAssignmentsList() {
    const assignments = this.assignments.slice(-20); // Últimas 20 asignaciones

    return assignments
      .map(
        (assignment) => `
      <div class="assignment-card">
        <div class="assignment-header">
          <h5>Asignación ${assignment.id.substring(0, 8)}</h5>
          <span class="assignment-status ${assignment.isActive ? 'active' : 'inactive'}">${
          assignment.isActive ? 'Activa' : 'Inactiva'
        }</span>
        </div>
        <div class="assignment-info">
          <p>Tarea: ${assignment.taskId}</p>
          <p>Usuario: ${assignment.userId}</p>
          <p>Asignado: ${new Date(assignment.assignedAt).toLocaleDateString()}</p>
        </div>
        <div class="assignment-actions">
          <button onclick="axyraProjectTaskManagementSystem.showAssignmentDetails('${assignment.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editAssignment('${assignment.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderCommentsList() {
    const comments = this.comments.slice(-20); // Últimos 20 comentarios

    return comments
      .map(
        (comment) => `
      <div class="comment-card">
        <div class="comment-header">
          <h5>Comentario ${comment.id.substring(0, 8)}</h5>
          <span class="comment-status ${comment.isActive ? 'active' : 'inactive'}">${
          comment.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="comment-info">
          <p>Tarea: ${comment.taskId}</p>
          <p>Usuario: ${comment.userId}</p>
          <p>Contenido: ${comment.content.substring(0, 100)}...</p>
        </div>
        <div class="comment-actions">
          <button onclick="axyraProjectTaskManagementSystem.showCommentDetails('${comment.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editComment('${comment.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderAttachmentsList() {
    const attachments = this.attachments.slice(-20); // Últimos 20 adjuntos

    return attachments
      .map(
        (attachment) => `
      <div class="attachment-card">
        <div class="attachment-header">
          <h5>${attachment.fileName}</h5>
          <span class="attachment-status ${attachment.isActive ? 'active' : 'inactive'}">${
          attachment.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="attachment-info">
          <p>Tarea: ${attachment.taskId}</p>
          <p>Tamaño: ${this.formatFileSize(attachment.fileSize)}</p>
          <p>Tipo: ${attachment.fileType}</p>
        </div>
        <div class="attachment-actions">
          <button onclick="axyraProjectTaskManagementSystem.showAttachmentDetails('${attachment.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editAttachment('${attachment.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderTimeTrackingList() {
    const timeTracking = this.timeTracking.slice(-20); // Últimos 20 seguimientos

    return timeTracking
      .map(
        (time) => `
      <div class="time-card">
        <div class="time-header">
          <h5>Seguimiento ${time.id.substring(0, 8)}</h5>
          <span class="time-status ${time.isActive ? 'active' : 'inactive'}">${
          time.isActive ? 'Activo' : 'Inactivo'
        }</span>
        </div>
        <div class="time-info">
          <p>Tarea: ${time.taskId}</p>
          <p>Usuario: ${time.userId}</p>
          <p>Duración: ${time.duration} minutos</p>
          <p>Descripción: ${time.description}</p>
        </div>
        <div class="time-actions">
          <button onclick="axyraProjectTaskManagementSystem.showTimeTrackingDetails('${time.id}')">Ver</button>
          <button onclick="axyraProjectTaskManagementSystem.editTimeTracking('${time.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderLogsList() {
    const logs = this.projectLogs.slice(-20); // Últimos 20 logs

    return logs
      .map(
        (log) => `
      <div class="log-card">
        <div class="log-header">
          <h5>${log.message}</h5>
          <span class="log-level level-${log.level}">${log.level}</span>
        </div>
        <div class="log-info">
          <p>Proyecto: ${log.projectId || 'N/A'}</p>
          <p>Tarea: ${log.taskId || 'N/A'}</p>
          <p>Usuario: ${log.userId}</p>
          <p>Fuente: ${log.source}</p>
          <p>Categoría: ${log.category}</p>
          <p>Fecha: ${new Date(log.timestamp).toLocaleString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  showCreateProjectDialog() {
    const name = prompt('Nombre del proyecto:');
    if (name) {
      const description = prompt('Descripción:');
      const priority = prompt('Prioridad (low, medium, high, urgent):');
      this.createProject({ name, description, priority });
    }
  }

  showCreateTaskDialog() {
    const title = prompt('Título de la tarea:');
    if (title) {
      const description = prompt('Descripción:');
      const projectId = prompt('ID del proyecto:');
      this.createTask({ title, description, projectId });
    }
  }

  showProjectDetails(projectId) {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      alert(
        `Proyecto: ${project.name}\nDescripción: ${project.description}\nEstado: ${project.status}\nPrioridad: ${project.priority}\nProgreso: ${project.progress}%`
      );
    }
  }

  editProject(projectId) {
    const project = this.projects.find((p) => p.id === projectId);
    if (project) {
      const newName = prompt('Nuevo nombre:', project.name);
      if (newName) {
        project.name = newName;
        this.saveProjects();
      }
    }
  }

  showTaskDetails(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      alert(
        `Tarea: ${task.title}\nDescripción: ${task.description}\nEstado: ${task.status}\nPrioridad: ${task.priority}\nHoras estimadas: ${task.estimatedHours}`
      );
    }
  }

  editTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (task) {
      const newTitle = prompt('Nuevo título:', task.title);
      if (newTitle) {
        task.title = newTitle;
        this.saveTasks();
      }
    }
  }

  showTeamDetails(teamId) {
    const team = this.teams.find((t) => t.id === teamId);
    if (team) {
      alert(
        `Equipo: ${team.name}\nDescripción: ${team.description}\nMiembros: ${team.members.length}\nEstado: ${
          team.isActive ? 'Activo' : 'Inactivo'
        }`
      );
    }
  }

  editTeam(teamId) {
    const team = this.teams.find((t) => t.id === teamId);
    if (team) {
      const newName = prompt('Nuevo nombre:', team.name);
      if (newName) {
        team.name = newName;
        this.saveTeams();
      }
    }
  }

  showMilestoneDetails(milestoneId) {
    const milestone = this.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      alert(
        `Hito: ${milestone.name}\nDescripción: ${milestone.description}\nEstado: ${
          milestone.status
        }\nFecha límite: ${new Date(milestone.dueDate).toLocaleDateString()}`
      );
    }
  }

  editMilestone(milestoneId) {
    const milestone = this.milestones.find((m) => m.id === milestoneId);
    if (milestone) {
      const newName = prompt('Nuevo nombre:', milestone.name);
      if (newName) {
        milestone.name = newName;
        this.saveMilestones();
      }
    }
  }

  showAssignmentDetails(assignmentId) {
    const assignment = this.assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      alert(
        `Asignación: ${assignment.id}\nTarea: ${assignment.taskId}\nUsuario: ${assignment.userId}\nAsignado: ${new Date(
          assignment.assignedAt
        ).toLocaleDateString()}`
      );
    }
  }

  editAssignment(assignmentId) {
    const assignment = this.assignments.find((a) => a.id === assignmentId);
    if (assignment) {
      const newUserId = prompt('Nuevo usuario:', assignment.userId);
      if (newUserId) {
        assignment.userId = newUserId;
        this.saveAssignments();
      }
    }
  }

  showCommentDetails(commentId) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      alert(
        `Comentario: ${comment.id}\nTarea: ${comment.taskId}\nUsuario: ${comment.userId}\nContenido: ${comment.content}`
      );
    }
  }

  editComment(commentId) {
    const comment = this.comments.find((c) => c.id === commentId);
    if (comment) {
      const newContent = prompt('Nuevo contenido:', comment.content);
      if (newContent !== null) {
        comment.content = newContent;
        this.saveComments();
      }
    }
  }

  showAttachmentDetails(attachmentId) {
    const attachment = this.attachments.find((a) => a.id === attachmentId);
    if (attachment) {
      alert(
        `Adjunto: ${attachment.fileName}\nTarea: ${attachment.taskId}\nTamaño: ${this.formatFileSize(
          attachment.fileSize
        )}\nTipo: ${attachment.fileType}`
      );
    }
  }

  editAttachment(attachmentId) {
    const attachment = this.attachments.find((a) => a.id === attachmentId);
    if (attachment) {
      const newFileName = prompt('Nuevo nombre de archivo:', attachment.fileName);
      if (newFileName) {
        attachment.fileName = newFileName;
        this.saveAttachments();
      }
    }
  }

  showTimeTrackingDetails(timeId) {
    const time = this.timeTracking.find((t) => t.id === timeId);
    if (time) {
      alert(
        `Seguimiento: ${time.id}\nTarea: ${time.taskId}\nUsuario: ${time.userId}\nDuración: ${time.duration} minutos\nDescripción: ${time.description}`
      );
    }
  }

  editTimeTracking(timeId) {
    const time = this.timeTracking.find((t) => t.id === timeId);
    if (time) {
      const newDuration = prompt('Nueva duración en minutos:', time.duration);
      if (newDuration !== null) {
        time.duration = parseInt(newDuration);
        this.saveTimeTracking();
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

// Inicializar sistema de gestión de proyectos y tareas
let axyraProjectTaskManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraProjectTaskManagementSystem = new AxyraProjectTaskManagementSystem();
  window.axyraProjectTaskManagementSystem = axyraProjectTaskManagementSystem;
});

// Exportar para uso global
window.AxyraProjectTaskManagementSystem = AxyraProjectTaskManagementSystem;

