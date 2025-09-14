/**
 * AXYRA - Sistema de Gestión de Calidad y Compliance
 * Maneja estándares, auditorías, no conformidades, acciones correctivas y certificaciones
 */

class AxyraQualityManagementSystem {
  constructor() {
    this.standards = [];
    this.audits = [];
    this.nonConformities = [];
    this.correctiveActions = [];
    this.certifications = [];
    this.documents = [];
    this.procedures = [];
    this.risks = [];
    this.incidents = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('🔍 Inicializando sistema de gestión de calidad...');
    this.loadStandards();
    this.loadAudits();
    this.loadNonConformities();
    this.loadCorrectiveActions();
    this.loadCertifications();
    this.loadDocuments();
    this.loadProcedures();
    this.loadRisks();
    this.loadIncidents();
    this.setupEventListeners();
    this.setupDefaultStandards();
    this.isInitialized = true;
  }

  loadStandards() {
    try {
      const stored = localStorage.getItem('axyra_quality_standards');
      if (stored) {
        this.standards = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando estándares:', error);
    }
  }

  saveStandards() {
    try {
      localStorage.setItem('axyra_quality_standards', JSON.stringify(this.standards));
    } catch (error) {
      console.error('Error guardando estándares:', error);
    }
  }

  loadAudits() {
    try {
      const stored = localStorage.getItem('axyra_quality_audits');
      if (stored) {
        this.audits = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando auditorías:', error);
    }
  }

  saveAudits() {
    try {
      localStorage.setItem('axyra_quality_audits', JSON.stringify(this.audits));
    } catch (error) {
      console.error('Error guardando auditorías:', error);
    }
  }

  loadNonConformities() {
    try {
      const stored = localStorage.getItem('axyra_quality_non_conformities');
      if (stored) {
        this.nonConformities = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando no conformidades:', error);
    }
  }

  saveNonConformities() {
    try {
      localStorage.setItem('axyra_quality_non_conformities', JSON.stringify(this.nonConformities));
    } catch (error) {
      console.error('Error guardando no conformidades:', error);
    }
  }

  loadCorrectiveActions() {
    try {
      const stored = localStorage.getItem('axyra_quality_corrective_actions');
      if (stored) {
        this.correctiveActions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando acciones correctivas:', error);
    }
  }

  saveCorrectiveActions() {
    try {
      localStorage.setItem('axyra_quality_corrective_actions', JSON.stringify(this.correctiveActions));
    } catch (error) {
      console.error('Error guardando acciones correctivas:', error);
    }
  }

  loadCertifications() {
    try {
      const stored = localStorage.getItem('axyra_quality_certifications');
      if (stored) {
        this.certifications = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando certificaciones:', error);
    }
  }

  saveCertifications() {
    try {
      localStorage.setItem('axyra_quality_certifications', JSON.stringify(this.certifications));
    } catch (error) {
      console.error('Error guardando certificaciones:', error);
    }
  }

  loadDocuments() {
    try {
      const stored = localStorage.getItem('axyra_quality_documents');
      if (stored) {
        this.documents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando documentos:', error);
    }
  }

  saveDocuments() {
    try {
      localStorage.setItem('axyra_quality_documents', JSON.stringify(this.documents));
    } catch (error) {
      console.error('Error guardando documentos:', error);
    }
  }

  loadProcedures() {
    try {
      const stored = localStorage.getItem('axyra_quality_procedures');
      if (stored) {
        this.procedures = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando procedimientos:', error);
    }
  }

  saveProcedures() {
    try {
      localStorage.setItem('axyra_quality_procedures', JSON.stringify(this.procedures));
    } catch (error) {
      console.error('Error guardando procedimientos:', error);
    }
  }

  loadRisks() {
    try {
      const stored = localStorage.getItem('axyra_quality_risks');
      if (stored) {
        this.risks = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando riesgos:', error);
    }
  }

  saveRisks() {
    try {
      localStorage.setItem('axyra_quality_risks', JSON.stringify(this.risks));
    } catch (error) {
      console.error('Error guardando riesgos:', error);
    }
  }

  loadIncidents() {
    try {
      const stored = localStorage.getItem('axyra_quality_incidents');
      if (stored) {
        this.incidents = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando incidentes:', error);
    }
  }

  saveIncidents() {
    try {
      localStorage.setItem('axyra_quality_incidents', JSON.stringify(this.incidents));
    } catch (error) {
      console.error('Error guardando incidentes:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en auditorías
    document.addEventListener('auditChanged', (event) => {
      this.handleAuditChange(event.detail);
    });

    // Escuchar cambios en no conformidades
    document.addEventListener('nonConformityChanged', (event) => {
      this.handleNonConformityChange(event.detail);
    });
  }

  setupDefaultStandards() {
    if (this.standards.length === 0) {
      this.standards = [
        {
          id: 'iso_9001',
          name: 'ISO 9001:2015',
          description: 'Sistema de Gestión de la Calidad',
          version: '2015',
          type: 'international',
          category: 'quality_management',
          requirements: [
            'Contexto de la organización',
            'Liderazgo',
            'Planificación',
            'Soporte',
            'Operación',
            'Evaluación del desempeño',
            'Mejora',
          ],
          isActive: true,
        },
        {
          id: 'iso_14001',
          name: 'ISO 14001:2015',
          description: 'Sistema de Gestión Ambiental',
          version: '2015',
          type: 'international',
          category: 'environmental_management',
          requirements: [
            'Contexto de la organización',
            'Liderazgo',
            'Planificación',
            'Soporte',
            'Operación',
            'Evaluación del desempeño',
            'Mejora',
          ],
          isActive: true,
        },
        {
          id: 'ohsas_18001',
          name: 'OHSAS 18001:2007',
          description: 'Sistema de Gestión de Seguridad y Salud en el Trabajo',
          version: '2007',
          type: 'international',
          category: 'occupational_health_safety',
          requirements: [
            'Planificación',
            'Implementación y operación',
            'Verificación y acción correctiva',
            'Revisión por la dirección',
          ],
          isActive: true,
        },
      ];

      this.saveStandards();
    }
  }

  handleAuditChange(change) {
    const { auditId, action, data } = change;

    switch (action) {
      case 'created':
        this.audits.push(data);
        this.saveAudits();
        break;
      case 'updated':
        const auditIndex = this.audits.findIndex((a) => a.id === auditId);
        if (auditIndex !== -1) {
          this.audits[auditIndex] = { ...this.audits[auditIndex], ...data };
          this.saveAudits();
        }
        break;
      case 'deleted':
        this.audits = this.audits.filter((a) => a.id !== auditId);
        this.saveAudits();
        break;
    }
  }

  handleNonConformityChange(change) {
    const { nonConformityId, action, data } = change;

    switch (action) {
      case 'created':
        this.nonConformities.push(data);
        this.saveNonConformities();
        break;
      case 'updated':
        const nonConformityIndex = this.nonConformities.findIndex((nc) => nc.id === nonConformityId);
        if (nonConformityIndex !== -1) {
          this.nonConformities[nonConformityIndex] = { ...this.nonConformities[nonConformityIndex], ...data };
          this.saveNonConformities();
        }
        break;
      case 'deleted':
        this.nonConformities = this.nonConformities.filter((nc) => nc.id !== nonConformityId);
        this.saveNonConformities();
        break;
    }
  }

  createStandard(standardData) {
    const standard = {
      id: 'standard_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: standardData.name,
      description: standardData.description || '',
      version: standardData.version || '',
      type: standardData.type || 'internal', // international, national, internal
      category: standardData.category || '',
      requirements: standardData.requirements || [],
      complianceLevel: standardData.complianceLevel || 0,
      isActive: standardData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.standards.push(standard);
    this.saveStandards();

    console.log('✅ Estándar creado:', standard.name);
    return standard;
  }

  createAudit(auditData) {
    const audit = {
      id: 'audit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: auditData.name,
      description: auditData.description || '',
      type: auditData.type || 'internal', // internal, external, supplier
      standardId: auditData.standardId,
      scope: auditData.scope || '',
      auditor: auditData.auditor,
      auditee: auditData.auditee,
      startDate: auditData.startDate,
      endDate: auditData.endDate,
      status: auditData.status || 'planned', // planned, in_progress, completed, cancelled
      findings: auditData.findings || [],
      score: auditData.score || 0,
      recommendations: auditData.recommendations || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.audits.push(audit);
    this.saveAudits();

    console.log('✅ Auditoría creada:', audit.name);
    return audit;
  }

  createNonConformity(nonConformityData) {
    const nonConformity = {
      id: 'nc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: nonConformityData.title,
      description: nonConformityData.description,
      type: nonConformityData.type || 'major', // major, minor, observation
      category: nonConformityData.category || '',
      standardId: nonConformityData.standardId,
      auditId: nonConformityData.auditId || null,
      department: nonConformityData.department || '',
      responsible: nonConformityData.responsible,
      detectedDate: nonConformityData.detectedDate || new Date().toISOString(),
      dueDate: nonConformityData.dueDate,
      status: nonConformityData.status || 'open', // open, in_progress, closed, cancelled
      rootCause: nonConformityData.rootCause || '',
      correctiveActions: nonConformityData.correctiveActions || [],
      preventiveActions: nonConformityData.preventiveActions || [],
      evidence: nonConformityData.evidence || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.nonConformities.push(nonConformity);
    this.saveNonConformities();

    console.log('✅ No conformidad creada:', nonConformity.title);
    return nonConformity;
  }

  createCorrectiveAction(actionData) {
    const action = {
      id: 'ca_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: actionData.title,
      description: actionData.description,
      nonConformityId: actionData.nonConformityId,
      responsible: actionData.responsible,
      startDate: actionData.startDate || new Date().toISOString(),
      dueDate: actionData.dueDate,
      status: actionData.status || 'planned', // planned, in_progress, completed, cancelled
      priority: actionData.priority || 'medium', // low, medium, high, critical
      cost: actionData.cost || 0,
      resources: actionData.resources || [],
      milestones: actionData.milestones || [],
      evidence: actionData.evidence || [],
      effectiveness: actionData.effectiveness || 0,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.correctiveActions.push(action);
    this.saveCorrectiveActions();

    console.log('✅ Acción correctiva creada:', action.title);
    return action;
  }

  createCertification(certificationData) {
    const certification = {
      id: 'cert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: certificationData.name,
      description: certificationData.description || '',
      standardId: certificationData.standardId,
      certifyingBody: certificationData.certifyingBody,
      certificateNumber: certificationData.certificateNumber,
      issueDate: certificationData.issueDate,
      expiryDate: certificationData.expiryDate,
      status: certificationData.status || 'active', // active, expired, suspended, cancelled
      scope: certificationData.scope || '',
      auditor: certificationData.auditor || '',
      cost: certificationData.cost || 0,
      documents: certificationData.documents || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.certifications.push(certification);
    this.saveCertifications();

    console.log('✅ Certificación creada:', certification.name);
    return certification;
  }

  createDocument(documentData) {
    const document = {
      id: 'doc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: documentData.title,
      description: documentData.description || '',
      type: documentData.type || 'procedure', // procedure, policy, form, record, manual
      category: documentData.category || '',
      version: documentData.version || '1.0',
      status: documentData.status || 'draft', // draft, approved, obsolete
      author: documentData.author,
      approver: documentData.approver || null,
      approvalDate: documentData.approvalDate || null,
      effectiveDate: documentData.effectiveDate,
      reviewDate: documentData.reviewDate,
      content: documentData.content || '',
      attachments: documentData.attachments || [],
      tags: documentData.tags || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.documents.push(document);
    this.saveDocuments();

    console.log('✅ Documento creado:', document.title);
    return document;
  }

  createProcedure(procedureData) {
    const procedure = {
      id: 'proc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: procedureData.title,
      description: procedureData.description || '',
      purpose: procedureData.purpose || '',
      scope: procedureData.scope || '',
      responsibilities: procedureData.responsibilities || [],
      steps: procedureData.steps || [],
      forms: procedureData.forms || [],
      references: procedureData.references || [],
      version: procedureData.version || '1.0',
      status: procedureData.status || 'draft',
      author: procedureData.author,
      approver: procedureData.approver || null,
      approvalDate: procedureData.approvalDate || null,
      effectiveDate: procedureData.effectiveDate,
      reviewDate: procedureData.reviewDate,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.procedures.push(procedure);
    this.saveProcedures();

    console.log('✅ Procedimiento creado:', procedure.title);
    return procedure;
  }

  createRisk(riskData) {
    const risk = {
      id: 'risk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: riskData.title,
      description: riskData.description,
      category: riskData.category || '',
      probability: riskData.probability || 1, // 1-5 scale
      impact: riskData.impact || 1, // 1-5 scale
      riskLevel: riskData.riskLevel || 'low', // low, medium, high, critical
      owner: riskData.owner,
      department: riskData.department || '',
      status: riskData.status || 'identified', // identified, assessed, treated, monitored, closed
      mitigation: riskData.mitigation || [],
      controls: riskData.controls || [],
      residualRisk: riskData.residualRisk || 'low',
      reviewDate: riskData.reviewDate,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.risks.push(risk);
    this.saveRisks();

    console.log('✅ Riesgo creado:', risk.title);
    return risk;
  }

  createIncident(incidentData) {
    const incident = {
      id: 'incident_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: incidentData.title,
      description: incidentData.description,
      type: incidentData.type || 'safety', // safety, quality, environmental, security
      severity: incidentData.severity || 'low', // low, medium, high, critical
      status: incidentData.status || 'reported', // reported, investigating, resolved, closed
      reporter: incidentData.reporter,
      department: incidentData.department || '',
      location: incidentData.location || '',
      date: incidentData.date || new Date().toISOString(),
      time: incidentData.time || new Date().toTimeString(),
      affected: incidentData.affected || [],
      witnesses: incidentData.witnesses || [],
      immediateActions: incidentData.immediateActions || [],
      investigation: incidentData.investigation || '',
      rootCause: incidentData.rootCause || '',
      correctiveActions: incidentData.correctiveActions || [],
      preventiveActions: incidentData.preventiveActions || [],
      evidence: incidentData.evidence || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.incidents.push(incident);
    this.saveIncidents();

    console.log('✅ Incidente creado:', incident.title);
    return incident;
  }

  getQualityStatistics() {
    const totalAudits = this.audits.length;
    const completedAudits = this.audits.filter((a) => a.status === 'completed').length;
    const totalNonConformities = this.nonConformities.length;
    const openNonConformities = this.nonConformities.filter((nc) => nc.status === 'open').length;
    const totalCorrectiveActions = this.correctiveActions.length;
    const completedActions = this.correctiveActions.filter((ca) => ca.status === 'completed').length;
    const totalCertifications = this.certifications.length;
    const activeCertifications = this.certifications.filter((c) => c.status === 'active').length;
    const totalRisks = this.risks.length;
    const highRisks = this.risks.filter((r) => r.riskLevel === 'high' || r.riskLevel === 'critical').length;
    const totalIncidents = this.incidents.length;
    const openIncidents = this.incidents.filter((i) => i.status === 'reported' || i.status === 'investigating').length;

    return {
      totalAudits,
      completedAudits,
      totalNonConformities,
      openNonConformities,
      totalCorrectiveActions,
      completedActions,
      totalCertifications,
      activeCertifications,
      totalRisks,
      highRisks,
      totalIncidents,
      openIncidents,
    };
  }

  showQualityDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'quality-dashboard';
    dashboard.innerHTML = `
      <div class="quality-dashboard-overlay">
        <div class="quality-dashboard-container">
          <div class="quality-dashboard-header">
            <h3>🔍 Dashboard de Calidad</h3>
            <div class="quality-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraQualityManagementSystem.showCreateAuditDialog()">Nueva Auditoría</button>
              <button class="btn btn-secondary" onclick="axyraQualityManagementSystem.showCreateNonConformityDialog()">Nueva No Conformidad</button>
              <button class="btn btn-close" onclick="document.getElementById('quality-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="quality-dashboard-body">
            <div class="quality-dashboard-stats">
              ${this.renderQualityStats()}
            </div>
            <div class="quality-dashboard-content">
              <div class="quality-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="audits">Auditorías</button>
                <button class="tab-btn" data-tab="nonconformities">No Conformidades</button>
                <button class="tab-btn" data-tab="certifications">Certificaciones</button>
                <button class="tab-btn" data-tab="risks">Riesgos</button>
              </div>
              <div class="quality-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="audits-tab">
                  ${this.renderAuditsList()}
                </div>
                <div class="tab-content" id="nonconformities-tab">
                  ${this.renderNonConformitiesList()}
                </div>
                <div class="tab-content" id="certifications-tab">
                  ${this.renderCertificationsList()}
                </div>
                <div class="tab-content" id="risks-tab">
                  ${this.renderRisksList()}
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

  renderQualityStats() {
    const stats = this.getQualityStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalAudits}</div>
          <div class="stat-label">Total Auditorías</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.completedAudits}</div>
          <div class="stat-label">Auditorías Completadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalNonConformities}</div>
          <div class="stat-label">No Conformidades</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.openNonConformities}</div>
          <div class="stat-label">No Conformidades Abiertas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCorrectiveActions}</div>
          <div class="stat-label">Acciones Correctivas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.completedActions}</div>
          <div class="stat-label">Acciones Completadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalCertifications}</div>
          <div class="stat-label">Certificaciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeCertifications}</div>
          <div class="stat-label">Certificaciones Activas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalRisks}</div>
          <div class="stat-label">Total Riesgos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.highRisks}</div>
          <div class="stat-label">Riesgos Altos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalIncidents}</div>
          <div class="stat-label">Total Incidentes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.openIncidents}</div>
          <div class="stat-label">Incidentes Abiertos</div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const stats = this.getQualityStatistics();

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Cumplimiento</h4>
          <div class="compliance-status">
            <div class="compliance-item">
              <span>Auditorías Completadas</span>
              <span>${stats.completedAudits}/${stats.totalAudits}</span>
            </div>
            <div class="compliance-item">
              <span>No Conformidades Abiertas</span>
              <span>${stats.openNonConformities}</span>
            </div>
            <div class="compliance-item">
              <span>Acciones Correctivas Completadas</span>
              <span>${stats.completedActions}/${stats.totalCorrectiveActions}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Riesgos y Incidentes</h4>
          <div class="risk-status">
            <div class="risk-item">
              <span>Riesgos Altos</span>
              <span class="risk-high">${stats.highRisks}</span>
            </div>
            <div class="risk-item">
              <span>Incidentes Abiertos</span>
              <span class="incident-open">${stats.openIncidents}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAuditsList() {
    const audits = this.audits.slice(-20); // Últimas 20 auditorías

    return audits
      .map(
        (audit) => `
      <div class="audit-card">
        <div class="audit-header">
          <h5>${audit.name}</h5>
          <span class="audit-status status-${audit.status}">${audit.status}</span>
        </div>
        <div class="audit-info">
          <p>${audit.description}</p>
          <p>Tipo: ${audit.type}</p>
          <p>Auditor: ${audit.auditor}</p>
          <p>Fecha: ${new Date(audit.startDate).toLocaleDateString()}</p>
          <p>Puntuación: ${audit.score}/100</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderNonConformitiesList() {
    const nonConformities = this.nonConformities.slice(-20); // Últimas 20 no conformidades

    return nonConformities
      .map(
        (nc) => `
      <div class="nonconformity-card">
        <div class="nonconformity-header">
          <h5>${nc.title}</h5>
          <span class="nonconformity-type type-${nc.type}">${nc.type}</span>
        </div>
        <div class="nonconformity-info">
          <p>${nc.description}</p>
          <p>Departamento: ${nc.department}</p>
          <p>Responsable: ${nc.responsible}</p>
          <p>Estado: ${nc.status}</p>
          <p>Fecha: ${new Date(nc.detectedDate).toLocaleDateString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderCertificationsList() {
    const certifications = this.certifications;

    return certifications
      .map(
        (cert) => `
      <div class="certification-card">
        <div class="certification-header">
          <h5>${cert.name}</h5>
          <span class="certification-status status-${cert.status}">${cert.status}</span>
        </div>
        <div class="certification-info">
          <p>${cert.description}</p>
          <p>Organismo: ${cert.certifyingBody}</p>
          <p>Número: ${cert.certificateNumber}</p>
          <p>Vigencia: ${new Date(cert.expiryDate).toLocaleDateString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderRisksList() {
    const risks = this.risks.slice(-20); // Últimos 20 riesgos

    return risks
      .map(
        (risk) => `
      <div class="risk-card">
        <div class="risk-header">
          <h5>${risk.title}</h5>
          <span class="risk-level level-${risk.riskLevel}">${risk.riskLevel}</span>
        </div>
        <div class="risk-info">
          <p>${risk.description}</p>
          <p>Probabilidad: ${risk.probability}/5</p>
          <p>Impacto: ${risk.impact}/5</p>
          <p>Propietario: ${risk.owner}</p>
          <p>Estado: ${risk.status}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  showCreateAuditDialog() {
    const name = prompt('Nombre de la auditoría:');
    if (name) {
      const description = prompt('Descripción de la auditoría:');
      const auditor = prompt('Auditor:');
      this.createAudit({ name, description, auditor });
    }
  }

  showCreateNonConformityDialog() {
    const title = prompt('Título de la no conformidad:');
    if (title) {
      const description = prompt('Descripción de la no conformidad:');
      const responsible = prompt('Responsable:');
      this.createNonConformity({ title, description, responsible });
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

// Inicializar sistema de calidad
let axyraQualityManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraQualityManagementSystem = new AxyraQualityManagementSystem();
  window.axyraQualityManagementSystem = axyraQualityManagementSystem;
});

// Exportar para uso global
window.AxyraQualityManagementSystem = AxyraQualityManagementSystem;
