/**
 * AXYRA - Sistema Avanzado de Gestión de Recursos Humanos
 * Maneja empleados, departamentos, evaluaciones, capacitaciones, beneficios y nómina
 */

class AxyraHRManagementSystem {
  constructor() {
    this.employees = [];
    this.departments = [];
    this.positions = [];
    this.evaluations = [];
    this.trainings = [];
    this.benefits = [];
    this.attendance = [];
    this.leaves = [];
    this.payroll = [];
    this.documents = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('👥 Inicializando sistema de recursos humanos...');
    this.loadEmployees();
    this.loadDepartments();
    this.loadPositions();
    this.loadEvaluations();
    this.loadTrainings();
    this.loadBenefits();
    this.loadAttendance();
    this.loadLeaves();
    this.loadPayroll();
    this.loadDocuments();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadEmployees() {
    try {
      const stored = localStorage.getItem('axyra_hr_employees');
      if (stored) {
        this.employees = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando empleados:', error);
    }
  }

  saveEmployees() {
    try {
      localStorage.setItem('axyra_hr_employees', JSON.stringify(this.employees));
    } catch (error) {
      console.error('Error guardando empleados:', error);
    }
  }

  loadDepartments() {
    try {
      const stored = localStorage.getItem('axyra_hr_departments');
      if (stored) {
        this.departments = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando departamentos:', error);
    }
  }

  saveDepartments() {
    try {
      localStorage.setItem('axyra_hr_departments', JSON.stringify(this.departments));
    } catch (error) {
      console.error('Error guardando departamentos:', error);
    }
  }

  loadPositions() {
    try {
      const stored = localStorage.getItem('axyra_hr_positions');
      if (stored) {
        this.positions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando posiciones:', error);
    }
  }

  savePositions() {
    try {
      localStorage.setItem('axyra_hr_positions', JSON.stringify(this.positions));
    } catch (error) {
      console.error('Error guardando posiciones:', error);
    }
  }

  loadEvaluations() {
    try {
      const stored = localStorage.getItem('axyra_hr_evaluations');
      if (stored) {
        this.evaluations = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando evaluaciones:', error);
    }
  }

  saveEvaluations() {
    try {
      localStorage.setItem('axyra_hr_evaluations', JSON.stringify(this.evaluations));
    } catch (error) {
      console.error('Error guardando evaluaciones:', error);
    }
  }

  loadTrainings() {
    try {
      const stored = localStorage.getItem('axyra_hr_trainings');
      if (stored) {
        this.trainings = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando capacitaciones:', error);
    }
  }

  saveTrainings() {
    try {
      localStorage.setItem('axyra_hr_trainings', JSON.stringify(this.trainings));
    } catch (error) {
      console.error('Error guardando capacitaciones:', error);
    }
  }

  loadBenefits() {
    try {
      const stored = localStorage.getItem('axyra_hr_benefits');
      if (stored) {
        this.benefits = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando beneficios:', error);
    }
  }

  saveBenefits() {
    try {
      localStorage.setItem('axyra_hr_benefits', JSON.stringify(this.benefits));
    } catch (error) {
      console.error('Error guardando beneficios:', error);
    }
  }

  loadAttendance() {
    try {
      const stored = localStorage.getItem('axyra_hr_attendance');
      if (stored) {
        this.attendance = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando asistencia:', error);
    }
  }

  saveAttendance() {
    try {
      localStorage.setItem('axyra_hr_attendance', JSON.stringify(this.attendance));
    } catch (error) {
      console.error('Error guardando asistencia:', error);
    }
  }

  loadLeaves() {
    try {
      const stored = localStorage.getItem('axyra_hr_leaves');
      if (stored) {
        this.leaves = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando permisos:', error);
    }
  }

  saveLeaves() {
    try {
      localStorage.setItem('axyra_hr_leaves', JSON.stringify(this.leaves));
    } catch (error) {
      console.error('Error guardando permisos:', error);
    }
  }

  loadPayroll() {
    try {
      const stored = localStorage.getItem('axyra_hr_payroll');
      if (stored) {
        this.payroll = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando nómina:', error);
    }
  }

  savePayroll() {
    try {
      localStorage.setItem('axyra_hr_payroll', JSON.stringify(this.payroll));
    } catch (error) {
      console.error('Error guardando nómina:', error);
    }
  }

  loadDocuments() {
    try {
      const stored = localStorage.getItem('axyra_hr_documents');
      if (stored) {
        this.documents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando documentos:', error);
    }
  }

  saveDocuments() {
    try {
      localStorage.setItem('axyra_hr_documents', JSON.stringify(this.documents));
    } catch (error) {
      console.error('Error guardando documentos:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en empleados
    document.addEventListener('employeeChanged', (event) => {
      this.handleEmployeeChange(event.detail);
    });

    // Escuchar cambios en asistencia
    document.addEventListener('attendanceChanged', (event) => {
      this.handleAttendanceChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.departments.length === 0) {
      this.departments = [
        {
          id: 'hr',
          name: 'Recursos Humanos',
          description: 'Gestión de personal y talento humano',
          managerId: null,
          isActive: true,
        },
        {
          id: 'finance',
          name: 'Finanzas',
          description: 'Gestión financiera y contable',
          managerId: null,
          isActive: true,
        },
        {
          id: 'it',
          name: 'Tecnología',
          description: 'Sistemas y tecnología',
          managerId: null,
          isActive: true,
        },
        {
          id: 'sales',
          name: 'Ventas',
          description: 'Ventas y marketing',
          managerId: null,
          isActive: true,
        },
      ];
      this.saveDepartments();
    }

    if (this.positions.length === 0) {
      this.positions = [
        {
          id: 'manager',
          name: 'Gerente',
          description: 'Posición de gerencia',
          level: 'senior',
          minSalary: 5000000,
          maxSalary: 8000000,
          isActive: true,
        },
        {
          id: 'supervisor',
          name: 'Supervisor',
          description: 'Posición de supervisión',
          level: 'mid',
          minSalary: 3000000,
          maxSalary: 5000000,
          isActive: true,
        },
        {
          id: 'employee',
          name: 'Empleado',
          description: 'Posición de empleado',
          level: 'junior',
          minSalary: 2000000,
          maxSalary: 4000000,
          isActive: true,
        },
      ];
      this.savePositions();
    }
  }

  handleEmployeeChange(change) {
    const { employeeId, action, data } = change;

    switch (action) {
      case 'created':
        this.employees.push(data);
        this.saveEmployees();
        break;
      case 'updated':
        const employeeIndex = this.employees.findIndex((e) => e.id === employeeId);
        if (employeeIndex !== -1) {
          this.employees[employeeIndex] = { ...this.employees[employeeIndex], ...data };
          this.saveEmployees();
        }
        break;
      case 'deleted':
        this.employees = this.employees.filter((e) => e.id !== employeeId);
        this.saveEmployees();
        break;
    }
  }

  handleAttendanceChange(change) {
    const { attendanceId, action, data } = change;

    switch (action) {
      case 'created':
        this.attendance.push(data);
        this.saveAttendance();
        break;
      case 'updated':
        const attendanceIndex = this.attendance.findIndex((a) => a.id === attendanceId);
        if (attendanceIndex !== -1) {
          this.attendance[attendanceIndex] = { ...this.attendance[attendanceIndex], ...data };
          this.saveAttendance();
        }
        break;
      case 'deleted':
        this.attendance = this.attendance.filter((a) => a.id !== attendanceId);
        this.saveAttendance();
        break;
    }
  }

  createEmployee(employeeData) {
    const employee = {
      id: 'employee_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      firstName: employeeData.firstName,
      lastName: employeeData.lastName,
      email: employeeData.email,
      phone: employeeData.phone,
      address: employeeData.address || '',
      city: employeeData.city || '',
      state: employeeData.state || '',
      country: employeeData.country || '',
      postalCode: employeeData.postalCode || '',
      dateOfBirth: employeeData.dateOfBirth,
      gender: employeeData.gender || '',
      maritalStatus: employeeData.maritalStatus || '',
      emergencyContact: employeeData.emergencyContact || '',
      emergencyPhone: employeeData.emergencyPhone || '',
      employeeId: employeeData.employeeId || this.generateEmployeeId(),
      departmentId: employeeData.departmentId,
      positionId: employeeData.positionId,
      managerId: employeeData.managerId || null,
      hireDate: employeeData.hireDate || new Date().toISOString(),
      terminationDate: employeeData.terminationDate || null,
      status: employeeData.status || 'active', // active, inactive, terminated
      salary: employeeData.salary || 0,
      benefits: employeeData.benefits || [],
      skills: employeeData.skills || [],
      certifications: employeeData.certifications || [],
      documents: employeeData.documents || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.employees.push(employee);
    this.saveEmployees();

    console.log('✅ Empleado creado:', employee.firstName + ' ' + employee.lastName);
    return employee;
  }

  updateEmployee(employeeId, updates) {
    const employeeIndex = this.employees.findIndex((e) => e.id === employeeId);
    if (employeeIndex === -1) {
      throw new Error('Empleado no encontrado');
    }

    this.employees[employeeIndex] = {
      ...this.employees[employeeIndex],
      ...updates,
      metadata: {
        ...this.employees[employeeIndex].metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.saveEmployees();

    console.log(
      '✅ Empleado actualizado:',
      this.employees[employeeIndex].firstName + ' ' + this.employees[employeeIndex].lastName
    );
    return this.employees[employeeIndex];
  }

  createDepartment(departmentData) {
    const department = {
      id: 'department_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: departmentData.name,
      description: departmentData.description || '',
      managerId: departmentData.managerId || null,
      parentId: departmentData.parentId || null,
      budget: departmentData.budget || 0,
      isActive: departmentData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.departments.push(department);
    this.saveDepartments();

    console.log('✅ Departamento creado:', department.name);
    return department;
  }

  createPosition(positionData) {
    const position = {
      id: 'position_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: positionData.name,
      description: positionData.description || '',
      level: positionData.level || 'junior',
      minSalary: positionData.minSalary || 0,
      maxSalary: positionData.maxSalary || 0,
      requirements: positionData.requirements || [],
      responsibilities: positionData.responsibilities || [],
      isActive: positionData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.positions.push(position);
    this.savePositions();

    console.log('✅ Posición creada:', position.name);
    return position;
  }

  createEvaluation(evaluationData) {
    const evaluation = {
      id: 'evaluation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      employeeId: evaluationData.employeeId,
      evaluatorId: evaluationData.evaluatorId,
      period: evaluationData.period, // quarterly, annual
      startDate: evaluationData.startDate,
      endDate: evaluationData.endDate,
      criteria: evaluationData.criteria || [], // [{ name, weight, score, comments }]
      overallScore: evaluationData.overallScore || 0,
      comments: evaluationData.comments || '',
      goals: evaluationData.goals || [],
      status: evaluationData.status || 'draft', // draft, completed, approved
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.evaluations.push(evaluation);
    this.saveEvaluations();

    console.log('✅ Evaluación creada:', evaluation.id);
    return evaluation;
  }

  createTraining(trainingData) {
    const training = {
      id: 'training_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: trainingData.name,
      description: trainingData.description || '',
      type: trainingData.type || 'internal', // internal, external, online
      category: trainingData.category || '',
      duration: trainingData.duration || 0, // in hours
      cost: trainingData.cost || 0,
      startDate: trainingData.startDate,
      endDate: trainingData.endDate,
      instructor: trainingData.instructor || '',
      participants: trainingData.participants || [],
      materials: trainingData.materials || [],
      status: trainingData.status || 'planned', // planned, in_progress, completed, cancelled
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.trainings.push(training);
    this.saveTrainings();

    console.log('✅ Capacitación creada:', training.name);
    return training;
  }

  createBenefit(benefitData) {
    const benefit = {
      id: 'benefit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: benefitData.name,
      description: benefitData.description || '',
      type: benefitData.type || 'monetary', // monetary, non_monetary
      value: benefitData.value || 0,
      category: benefitData.category || '',
      eligibility: benefitData.eligibility || 'all', // all, specific_positions, specific_departments
      eligibleEmployees: benefitData.eligibleEmployees || [],
      startDate: benefitData.startDate,
      endDate: benefitData.endDate,
      isActive: benefitData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.benefits.push(benefit);
    this.saveBenefits();

    console.log('✅ Beneficio creado:', benefit.name);
    return benefit;
  }

  recordAttendance(attendanceData) {
    const attendance = {
      id: 'attendance_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      employeeId: attendanceData.employeeId,
      date: attendanceData.date || new Date().toISOString().split('T')[0],
      checkIn: attendanceData.checkIn || null,
      checkOut: attendanceData.checkOut || null,
      breakStart: attendanceData.breakStart || null,
      breakEnd: attendanceData.breakEnd || null,
      totalHours: attendanceData.totalHours || 0,
      overtime: attendanceData.overtime || 0,
      status: attendanceData.status || 'present', // present, absent, late, half_day
      notes: attendanceData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.attendance.push(attendance);
    this.saveAttendance();

    console.log('✅ Asistencia registrada:', attendance.employeeId, attendance.date);
    return attendance;
  }

  createLeave(leaveData) {
    const leave = {
      id: 'leave_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      employeeId: leaveData.employeeId,
      type: leaveData.type, // vacation, sick, personal, maternity, paternity
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: leaveData.days || 0,
      reason: leaveData.reason || '',
      status: leaveData.status || 'pending', // pending, approved, rejected, taken
      approverId: leaveData.approverId || null,
      approvedAt: leaveData.approvedAt || null,
      comments: leaveData.comments || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.leaves.push(leave);
    this.saveLeaves();

    console.log('✅ Permiso creado:', leave.id);
    return leave;
  }

  generateEmployeeId() {
    const year = new Date().getFullYear();
    const count = this.employees.length + 1;
    return `EMP-${year}-${String(count).padStart(4, '0')}`;
  }

  getEmployees(filters = {}) {
    let filteredEmployees = [...this.employees];

    if (filters.departmentId) {
      filteredEmployees = filteredEmployees.filter((e) => e.departmentId === filters.departmentId);
    }

    if (filters.positionId) {
      filteredEmployees = filteredEmployees.filter((e) => e.positionId === filters.positionId);
    }

    if (filters.status) {
      filteredEmployees = filteredEmployees.filter((e) => e.status === filters.status);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredEmployees = filteredEmployees.filter(
        (e) =>
          e.firstName.toLowerCase().includes(searchTerm) ||
          e.lastName.toLowerCase().includes(searchTerm) ||
          e.email.toLowerCase().includes(searchTerm) ||
          e.employeeId.toLowerCase().includes(searchTerm)
      );
    }

    return filteredEmployees;
  }

  getHRStatistics() {
    const totalEmployees = this.employees.length;
    const activeEmployees = this.employees.filter((e) => e.status === 'active').length;
    const inactiveEmployees = this.employees.filter((e) => e.status === 'inactive').length;
    const terminatedEmployees = this.employees.filter((e) => e.status === 'terminated').length;

    const departmentStats = {};
    this.employees.forEach((employee) => {
      const department = this.departments.find((d) => d.id === employee.departmentId);
      if (department) {
        departmentStats[department.name] = (departmentStats[department.name] || 0) + 1;
      }
    });

    const positionStats = {};
    this.employees.forEach((employee) => {
      const position = this.positions.find((p) => p.id === employee.positionId);
      if (position) {
        positionStats[position.name] = (positionStats[position.name] || 0) + 1;
      }
    });

    const totalSalary = this.employees.reduce((sum, e) => sum + (e.salary || 0), 0);
    const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;

    return {
      totalEmployees,
      activeEmployees,
      inactiveEmployees,
      terminatedEmployees,
      departmentStats,
      positionStats,
      totalSalary,
      averageSalary,
    };
  }

  showHRDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'hr-dashboard';
    dashboard.innerHTML = `
      <div class="hr-dashboard-overlay">
        <div class="hr-dashboard-container">
          <div class="hr-dashboard-header">
            <h3>👥 Dashboard de RRHH</h3>
            <div class="hr-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraHRManagementSystem.showCreateEmployeeDialog()">Nuevo Empleado</button>
              <button class="btn btn-secondary" onclick="axyraHRManagementSystem.showCreateDepartmentDialog()">Nuevo Departamento</button>
              <button class="btn btn-close" onclick="document.getElementById('hr-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="hr-dashboard-body">
            <div class="hr-dashboard-stats">
              ${this.renderHRStats()}
            </div>
            <div class="hr-dashboard-content">
              <div class="hr-dashboard-tabs">
                <button class="tab-btn active" data-tab="employees">Empleados</button>
                <button class="tab-btn" data-tab="departments">Departamentos</button>
                <button class="tab-btn" data-tab="attendance">Asistencia</button>
                <button class="tab-btn" data-tab="evaluations">Evaluaciones</button>
                <button class="tab-btn" data-tab="trainings">Capacitaciones</button>
              </div>
              <div class="hr-dashboard-tab-content">
                <div class="tab-content active" id="employees-tab">
                  ${this.renderEmployeesList()}
                </div>
                <div class="tab-content" id="departments-tab">
                  ${this.renderDepartmentsList()}
                </div>
                <div class="tab-content" id="attendance-tab">
                  ${this.renderAttendanceList()}
                </div>
                <div class="tab-content" id="evaluations-tab">
                  ${this.renderEvaluationsList()}
                </div>
                <div class="tab-content" id="trainings-tab">
                  ${this.renderTrainingsList()}
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

  renderHRStats() {
    const stats = this.getHRStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalEmployees}</div>
          <div class="stat-label">Total Empleados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeEmployees}</div>
          <div class="stat-label">Empleados Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.inactiveEmployees}</div>
          <div class="stat-label">Empleados Inactivos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.terminatedEmployees}</div>
          <div class="stat-label">Empleados Terminados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${stats.averageSalary.toLocaleString()}</div>
          <div class="stat-label">Salario Promedio</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${stats.totalSalary.toLocaleString()}</div>
          <div class="stat-label">Total Salarios</div>
        </div>
      </div>
    `;
  }

  renderEmployeesList() {
    const employees = this.getEmployees();

    return employees
      .map((employee) => {
        const department = this.departments.find((d) => d.id === employee.departmentId);
        const position = this.positions.find((p) => p.id === employee.positionId);

        return `
        <div class="employee-card">
          <div class="employee-header">
            <h4>${employee.firstName} ${employee.lastName}</h4>
            <span class="employee-status status-${employee.status}">${employee.status}</span>
          </div>
          <div class="employee-info">
            <p>ID: ${employee.employeeId}</p>
            <p>Email: ${employee.email}</p>
            <p>Departamento: ${department ? department.name : 'N/A'}</p>
            <p>Posición: ${position ? position.name : 'N/A'}</p>
            <p>Salario: $${employee.salary.toLocaleString()}</p>
          </div>
          <div class="employee-actions">
            <button onclick="axyraHRManagementSystem.showEmployeeDetails('${employee.id}')">Ver</button>
            <button onclick="axyraHRManagementSystem.editEmployee('${employee.id}')">Editar</button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  renderDepartmentsList() {
    const departments = this.departments;

    return departments
      .map((department) => {
        const employeeCount = this.employees.filter((e) => e.departmentId === department.id).length;
        const manager = this.employees.find((e) => e.id === department.managerId);

        return `
        <div class="department-card">
          <div class="department-header">
            <h4>${department.name}</h4>
            <span class="department-status ${department.isActive ? 'active' : 'inactive'}">${
          department.isActive ? 'Activo' : 'Inactivo'
        }</span>
          </div>
          <div class="department-info">
            <p>${department.description}</p>
            <p>Empleados: ${employeeCount}</p>
            <p>Gerente: ${manager ? manager.firstName + ' ' + manager.lastName : 'Sin asignar'}</p>
            <p>Presupuesto: $${department.budget.toLocaleString()}</p>
          </div>
          <div class="department-actions">
            <button onclick="axyraHRManagementSystem.showDepartmentDetails('${department.id}')">Ver</button>
            <button onclick="axyraHRManagementSystem.editDepartment('${department.id}')">Editar</button>
          </div>
        </div>
      `;
      })
      .join('');
  }

  renderAttendanceList() {
    const attendance = this.attendance.slice(-20); // Últimos 20 registros

    return attendance
      .map((record) => {
        const employee = this.employees.find((e) => e.id === record.employeeId);

        return `
        <div class="attendance-card">
          <div class="attendance-header">
            <h5>${employee ? employee.firstName + ' ' + employee.lastName : 'Empleado no encontrado'}</h5>
            <span class="attendance-date">${new Date(record.date).toLocaleDateString()}</span>
          </div>
          <div class="attendance-info">
            <p>Entrada: ${record.checkIn || 'No registrada'}</p>
            <p>Salida: ${record.checkOut || 'No registrada'}</p>
            <p>Horas: ${record.totalHours}</p>
            <p>Estado: ${record.status}</p>
          </div>
        </div>
      `;
      })
      .join('');
  }

  renderEvaluationsList() {
    const evaluations = this.evaluations.slice(-20); // Últimas 20 evaluaciones

    return evaluations
      .map((evaluation) => {
        const employee = this.employees.find((e) => e.id === evaluation.employeeId);
        const evaluator = this.employees.find((e) => e.id === evaluation.evaluatorId);

        return `
        <div class="evaluation-card">
          <div class="evaluation-header">
            <h5>${employee ? employee.firstName + ' ' + employee.lastName : 'Empleado no encontrado'}</h5>
            <span class="evaluation-score">${evaluation.overallScore}/100</span>
          </div>
          <div class="evaluation-info">
            <p>Período: ${evaluation.period}</p>
            <p>Evaluador: ${evaluator ? evaluator.firstName + ' ' + evaluator.lastName : 'N/A'}</p>
            <p>Estado: ${evaluation.status}</p>
          </div>
        </div>
      `;
      })
      .join('');
  }

  renderTrainingsList() {
    const trainings = this.trainings.slice(-20); // Últimas 20 capacitaciones

    return trainings
      .map(
        (training) => `
      <div class="training-card">
        <div class="training-header">
          <h5>${training.name}</h5>
          <span class="training-status status-${training.status}">${training.status}</span>
        </div>
        <div class="training-info">
          <p>${training.description}</p>
          <p>Tipo: ${training.type}</p>
          <p>Duración: ${training.duration} horas</p>
          <p>Participantes: ${training.participants.length}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  showCreateEmployeeDialog() {
    const firstName = prompt('Nombre del empleado:');
    if (firstName) {
      const lastName = prompt('Apellido del empleado:');
      const email = prompt('Email del empleado:');
      const phone = prompt('Teléfono del empleado:');
      const salary = parseFloat(prompt('Salario del empleado:'));
      this.createEmployee({ firstName, lastName, email, phone, salary });
    }
  }

  showCreateDepartmentDialog() {
    const name = prompt('Nombre del departamento:');
    if (name) {
      const description = prompt('Descripción del departamento:');
      this.createDepartment({ name, description });
    }
  }

  showEmployeeDetails(employeeId) {
    const employee = this.employees.find((e) => e.id === employeeId);
    if (employee) {
      const department = this.departments.find((d) => d.id === employee.departmentId);
      const position = this.positions.find((p) => p.id === employee.positionId);

      alert(
        `Empleado: ${employee.firstName} ${employee.lastName}\nID: ${employee.employeeId}\nEmail: ${
          employee.email
        }\nTeléfono: ${employee.phone}\nDepartamento: ${department ? department.name : 'N/A'}\nPosición: ${
          position ? position.name : 'N/A'
        }\nSalario: $${employee.salary.toLocaleString()}`
      );
    }
  }

  editEmployee(employeeId) {
    const employee = this.employees.find((e) => e.id === employeeId);
    if (employee) {
      const newSalary = parseFloat(prompt('Nuevo salario:', employee.salary));
      if (newSalary) {
        this.updateEmployee(employeeId, { salary: newSalary });
      }
    }
  }

  showDepartmentDetails(departmentId) {
    const department = this.departments.find((d) => d.id === departmentId);
    if (department) {
      const employeeCount = this.employees.filter((e) => e.departmentId === departmentId).length;
      alert(
        `Departamento: ${department.name}\nDescripción: ${
          department.description
        }\nEmpleados: ${employeeCount}\nPresupuesto: $${department.budget.toLocaleString()}`
      );
    }
  }

  editDepartment(departmentId) {
    const department = this.departments.find((d) => d.id === departmentId);
    if (department) {
      const newBudget = parseFloat(prompt('Nuevo presupuesto:', department.budget));
      if (newBudget) {
        department.budget = newBudget;
        this.saveDepartments();
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

// Inicializar sistema de RRHH
let axyraHRManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraHRManagementSystem = new AxyraHRManagementSystem();
  window.axyraHRManagementSystem = axyraHRManagementSystem;
});

// Exportar para uso global
window.AxyraHRManagementSystem = AxyraHRManagementSystem;
