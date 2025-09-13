/**
 * AXYRA - Sistema de Gestión de Proyectos y Tareas
 * Maneja proyectos, tareas, equipos, hitos y seguimiento
 */

class AxyraProjectManagementSystem {
  constructor() {
    this.projects = [];
    this.tasks = [];
    this.teams = [];
    this.milestones = [];
    this.timeEntries = [];
    this.comments = [];
    this.attachments = [];
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('📋 Inicializando sistema de gestión de proyectos...');
    this.loadProjects();
    this.loadTasks();
    this.loadTeams();
    this.loadMilestones();
    this.loadTimeEntries();
    this.loadComments();
    this.loadAttachments();
    this.setupEventListeners();
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

  loadTimeEntries() {
    try {
      const stored = localStorage.getItem('axyra_time_entries');
      if (stored) {
        this.timeEntries = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando entradas de tiempo:', error);
    }
  }

  saveTimeEntries() {
    try {
      localStorage.setItem('axyra_time_entries', JSON.stringify(this.timeEntries));
    } catch (error) {
      console.error('Error guardando entradas de tiempo:', error);
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

  handleProjectChange(change) {
    const { projectId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.projects.push(data);
        this.saveProjects();
        break;
      case 'updated':
        const projectIndex = this.projects.findIndex(p => p.id === projectId);
        if (projectIndex !== -1) {
          this.projects[projectIndex] = { ...this.projects[projectIndex], ...data };
          this.saveProjects();
        }
        break;
      case 'deleted':
        this.projects = this.projects.filter(p => p.id !== projectId);
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
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], ...data };
          this.saveTasks();
        }
        break;
      case 'deleted':
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveTasks();
        break;
    }
  }

  createProject(projectData) {
    const project = {
      id: 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: projectData.name,
      description: projectData.description || '',
      status: projectData.status || 'planning',
      priority: projectData.priority || 'medium',
      startDate: projectData.startDate || new Date().toISOString(),
      endDate: projectData.endDate || null,
      budget: projectData.budget || 0,
      progress: 0,
      team: projectData.team || [],
      client: projectData.client || null,
      tags: projectData.tags || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      },
      isActive: true
    };

    this.projects.push(project);
    this.saveProjects();

    console.log('✅ Proyecto creado:', project.name);
    return project;
  }

  updateProject(projectId, updates) {
    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Proyecto no encontrado');
    }

    this.projects[projectIndex] = { 
      ...this.projects[projectIndex], 
      ...updates,
      metadata: {
        ...this.projects[projectIndex].metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.saveProjects();

    console.log('✅ Proyecto actualizado:', this.projects[projectIndex].name);
    return this.projects[projectIndex];
  }

  deleteProject(projectId) {
    const projectIndex = this.projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
      throw new Error('Proyecto no encontrado');
    }

    const project = this.projects[projectIndex];
    
    // Verificar si tiene tareas
    const hasTasks = this.tasks.some(t => t.projectId === projectId);
    if (hasTasks) {
      throw new Error('No se puede eliminar un proyecto que tiene tareas');
    }

    this.projects.splice(projectIndex, 1);
    this.saveProjects();

    console.log('🗑️ Proyecto eliminado:', project.name);
    return project;
  }

  createTask(taskData) {
    const task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description || '',
      projectId: taskData.projectId,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assignee || null,
      reporter: taskData.reporter || this.getCurrentUser(),
      startDate: taskData.startDate || null,
      dueDate: taskData.dueDate || null,
      estimatedHours: taskData.estimatedHours || 0,
      actualHours: 0,
      progress: 0,
      tags: taskData.tags || [],
      dependencies: taskData.dependencies || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      },
      isActive: true
    };

    this.tasks.push(task);
    this.saveTasks();

    console.log('✅ Tarea creada:', task.title);
    return task;
  }

  updateTask(taskId, updates) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Tarea no encontrada');
    }

    this.tasks[taskIndex] = { 
      ...this.tasks[taskIndex], 
      ...updates,
      metadata: {
        ...this.tasks[taskIndex].metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.saveTasks();

    console.log('✅ Tarea actualizada:', this.tasks[taskIndex].title);
    return this.tasks[taskIndex];
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error('Tarea no encontrada');
    }

    const task = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);
    this.saveTasks();

    console.log('🗑️ Tarea eliminada:', task.title);
    return task;
  }

  createTeam(teamData) {
    const team = {
      id: 'team_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: teamData.name,
      description: teamData.description || '',
      members: teamData.members || [],
      leader: teamData.leader || null,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      },
      isActive: true
    };

    this.teams.push(team);
    this.saveTeams();

    console.log('✅ Equipo creado:', team.name);
    return team;
  }

  addTeamMember(teamId, userId, role = 'member') {
    const teamIndex = this.teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) {
      throw new Error('Equipo no encontrado');
    }

    const member = {
      userId,
      role,
      joinedAt: new Date().toISOString(),
      addedBy: this.getCurrentUser()
    };

    this.teams[teamIndex].members.push(member);
    this.saveTeams();

    console.log('✅ Miembro agregado al equipo:', userId);
    return member;
  }

  removeTeamMember(teamId, userId) {
    const teamIndex = this.teams.findIndex(t => t.id === teamId);
    if (teamIndex === -1) {
      throw new Error('Equipo no encontrado');
    }

    this.teams[teamIndex].members = this.teams[teamIndex].members.filter(m => m.userId !== userId);
    this.saveTeams();

    console.log('❌ Miembro removido del equipo:', userId);
  }

  createMilestone(milestoneData) {
    const milestone = {
      id: 'milestone_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: milestoneData.name,
      description: milestoneData.description || '',
      projectId: milestoneData.projectId,
      dueDate: milestoneData.dueDate,
      status: milestoneData.status || 'pending',
      tasks: milestoneData.tasks || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      },
      isActive: true
    };

    this.milestones.push(milestone);
    this.saveMilestones();

    console.log('✅ Hito creado:', milestone.name);
    return milestone;
  }

  addTimeEntry(timeEntryData) {
    const timeEntry = {
      id: 'time_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      taskId: timeEntryData.taskId,
      projectId: timeEntryData.projectId,
      userId: timeEntryData.userId || this.getCurrentUser(),
      description: timeEntryData.description || '',
      hours: timeEntryData.hours,
      date: timeEntryData.date || new Date().toISOString(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser()
      },
      isActive: true
    };

    this.timeEntries.push(timeEntry);
    this.saveTimeEntries();

    // Actualizar horas reales de la tarea
    this.updateTaskActualHours(timeEntryData.taskId);

    console.log('⏱️ Entrada de tiempo agregada:', timeEntry.hours + ' horas');
    return timeEntry;
  }

  updateTaskActualHours(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      const totalHours = this.timeEntries
        .filter(te => te.taskId === taskId && te.isActive)
        .reduce((sum, te) => sum + te.hours, 0);
      
      task.actualHours = totalHours;
      this.saveTasks();
    }
  }

  addComment(commentData) {
    const comment = {
      id: 'comment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      taskId: commentData.taskId,
      projectId: commentData.projectId,
      content: commentData.content,
      author: commentData.author || this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser()
      },
      isActive: true
    };

    this.comments.push(comment);
    this.saveComments();

    console.log('💬 Comentario agregado');
    return comment;
  }

  getProjects(filters = {}) {
    let filteredProjects = [...this.projects];

    if (filters.status) {
      filteredProjects = filteredProjects.filter(p => p.status === filters.status);
    }

    if (filters.priority) {
      filteredProjects = filteredProjects.filter(p => p.priority === filters.priority);
    }

    if (filters.team) {
      filteredProjects = filteredProjects.filter(p => p.team.includes(filters.team));
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProjects = filteredProjects.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredProjects;
  }

  getTasks(filters = {}) {
    let filteredTasks = [...this.tasks];

    if (filters.projectId) {
      filteredTasks = filteredTasks.filter(t => t.projectId === filters.projectId);
    }

    if (filters.status) {
      filteredTasks = filteredTasks.filter(t => t.status === filters.status);
    }

    if (filters.assignee) {
      filteredTasks = filteredTasks.filter(t => t.assignee === filters.assignee);
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredTasks = filteredTasks.filter(t => 
        t.title.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredTasks;
  }

  getProjectStatistics(projectId) {
    const project = this.projects.find(p => p.id === projectId);
    if (!project) return null;

    const projectTasks = this.tasks.filter(t => t.projectId === projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(t => t.status === 'done').length;
    const inProgressTasks = projectTasks.filter(t => t.status === 'in_progress').length;
    const todoTasks = projectTasks.filter(t => t.status === 'todo').length;
    
    const totalEstimatedHours = projectTasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActualHours = projectTasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);
    
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      totalEstimatedHours,
      totalActualHours,
      progress: Math.round(progress),
      budget: project.budget,
      spent: totalActualHours * 50 // Asumiendo $50 por hora
    };
  }

  getTaskStatistics() {
    const totalTasks = this.tasks.length;
    const completedTasks = this.tasks.filter(t => t.status === 'done').length;
    const inProgressTasks = this.tasks.filter(t => t.status === 'in_progress').length;
    const todoTasks = this.tasks.filter(t => t.status === 'todo').length;
    
    const overdueTasks = this.tasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done'
    ).length;

    const totalEstimatedHours = this.tasks.reduce((sum, t) => sum + (t.estimatedHours || 0), 0);
    const totalActualHours = this.tasks.reduce((sum, t) => sum + (t.actualHours || 0), 0);

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      totalEstimatedHours,
      totalActualHours,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }

  showProjectDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'project-dashboard';
    dashboard.innerHTML = `
      <div class="project-dashboard-overlay">
        <div class="project-dashboard-container">
          <div class="project-dashboard-header">
            <h3>📋 Dashboard de Proyectos</h3>
            <div class="project-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraProjectManagementSystem.showCreateProjectDialog()">Nuevo Proyecto</button>
              <button class="btn btn-secondary" onclick="axyraProjectManagementSystem.showCreateTaskDialog()">Nueva Tarea</button>
              <button class="btn btn-close" onclick="document.getElementById('project-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="project-dashboard-body">
            <div class="project-dashboard-stats">
              ${this.renderProjectStats()}
            </div>
            <div class="project-dashboard-content">
              <div class="project-dashboard-tabs">
                <button class="tab-btn active" data-tab="projects">Proyectos</button>
                <button class="tab-btn" data-tab="tasks">Tareas</button>
                <button class="tab-btn" data-tab="teams">Equipos</button>
                <button class="tab-btn" data-tab="timeline">Timeline</button>
              </div>
              <div class="project-dashboard-tab-content">
                <div class="tab-content active" id="projects-tab">
                  ${this.renderProjectsList()}
                </div>
                <div class="tab-content" id="tasks-tab">
                  ${this.renderTasksList()}
                </div>
                <div class="tab-content" id="teams-tab">
                  ${this.renderTeamsList()}
                </div>
                <div class="tab-content" id="timeline-tab">
                  ${this.renderTimeline()}
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

  renderProjectStats() {
    const stats = this.getTaskStatistics();
    
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalTasks}</div>
          <div class="stat-label">Total Tareas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.completedTasks}</div>
          <div class="stat-label">Completadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.inProgressTasks}</div>
          <div class="stat-label">En Progreso</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.overdueTasks}</div>
          <div class="stat-label">Vencidas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.completionRate}%</div>
          <div class="stat-label">Tasa de Completado</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalActualHours}h</div>
          <div class="stat-label">Horas Registradas</div>
        </div>
      </div>
    `;
  }

  renderProjectsList() {
    const projects = this.getProjects();
    
    return projects.map(project => {
      const stats = this.getProjectStatistics(project.id);
      return `
        <div class="project-card">
          <div class="project-header">
            <h4>${project.name}</h4>
            <span class="project-status status-${project.status}">${project.status}</span>
          </div>
          <div class="project-description">${project.description}</div>
          <div class="project-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${stats?.progress || 0}%"></div>
            </div>
            <span class="progress-text">${stats?.progress || 0}%</span>
          </div>
          <div class="project-stats">
            <span>${stats?.totalTasks || 0} tareas</span>
            <span>${stats?.totalActualHours || 0}h</span>
            <span>$${stats?.spent || 0}</span>
          </div>
        </div>
      `;
    }).join('');
  }

  renderTasksList() {
    const tasks = this.getTasks();
    
    return tasks.map(task => `
      <div class="task-card">
        <div class="task-header">
          <h5>${task.title}</h5>
          <span class="task-priority priority-${task.priority}">${task.priority}</span>
        </div>
        <div class="task-description">${task.description}</div>
        <div class="task-meta">
          <span class="task-status status-${task.status}">${task.status}</span>
          <span class="task-assignee">${task.assignee || 'Sin asignar'}</span>
          <span class="task-hours">${task.actualHours}/${task.estimatedHours}h</span>
        </div>
      </div>
    `).join('');
  }

  renderTeamsList() {
    const teams = this.teams;
    
    return teams.map(team => `
      <div class="team-card">
        <div class="team-header">
          <h4>${team.name}</h4>
          <span class="team-leader">Líder: ${team.leader || 'Sin asignar'}</span>
        </div>
        <div class="team-description">${team.description}</div>
        <div class="team-members">
          <span class="member-count">${team.members.length} miembros</span>
        </div>
      </div>
    `).join('');
  }

  renderTimeline() {
    const tasks = this.getTasks();
    const timeline = tasks.map(task => ({
      ...task,
      date: task.dueDate || task.metadata.createdAt
    })).sort((a, b) => new Date(a.date) - new Date(b.date));

    return `
      <div class="timeline">
        ${timeline.map(task => `
          <div class="timeline-item">
            <div class="timeline-date">${new Date(task.date).toLocaleDateString()}</div>
            <div class="timeline-content">
              <h5>${task.title}</h5>
              <p>${task.description}</p>
              <span class="timeline-status status-${task.status}">${task.status}</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  showCreateProjectDialog() {
    const name = prompt('Nombre del proyecto:');
    if (name) {
      const description = prompt('Descripción del proyecto:');
      this.createProject({ name, description });
    }
  }

  showCreateTaskDialog() {
    const title = prompt('Título de la tarea:');
    if (title) {
      const description = prompt('Descripción de la tarea:');
      const projectId = prompt('ID del proyecto:');
      this.createTask({ title, description, projectId });
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

// Inicializar sistema de proyectos
let axyraProjectManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraProjectManagementSystem = new AxyraProjectManagementSystem();
  window.axyraProjectManagementSystem = axyraProjectManagementSystem;
});

// Exportar para uso global
window.AxyraProjectManagementSystem = AxyraProjectManagementSystem;
