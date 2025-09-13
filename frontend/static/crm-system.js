/**
 * AXYRA - Sistema de Gestión de Clientes y CRM
 * Maneja clientes, contactos, oportunidades, ventas y seguimiento
 */

class AxyraCRMSystem {
  constructor() {
    this.customers = [];
    this.contacts = [];
    this.opportunities = [];
    this.deals = [];
    this.activities = [];
    this.notes = [];
    this.tasks = [];
    this.campaigns = [];
    this.leads = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('👥 Inicializando sistema CRM...');
    this.loadCustomers();
    this.loadContacts();
    this.loadOpportunities();
    this.loadDeals();
    this.loadActivities();
    this.loadNotes();
    this.loadTasks();
    this.loadCampaigns();
    this.loadLeads();
    this.setupEventListeners();
    this.isInitialized = true;
  }

  loadCustomers() {
    try {
      const stored = localStorage.getItem('axyra_customers');
      if (stored) {
        this.customers = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando clientes:', error);
    }
  }

  saveCustomers() {
    try {
      localStorage.setItem('axyra_customers', JSON.stringify(this.customers));
    } catch (error) {
      console.error('Error guardando clientes:', error);
    }
  }

  loadContacts() {
    try {
      const stored = localStorage.getItem('axyra_contacts');
      if (stored) {
        this.contacts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando contactos:', error);
    }
  }

  saveContacts() {
    try {
      localStorage.setItem('axyra_contacts', JSON.stringify(this.contacts));
    } catch (error) {
      console.error('Error guardando contactos:', error);
    }
  }

  loadOpportunities() {
    try {
      const stored = localStorage.getItem('axyra_opportunities');
      if (stored) {
        this.opportunities = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando oportunidades:', error);
    }
  }

  saveOpportunities() {
    try {
      localStorage.setItem('axyra_opportunities', JSON.stringify(this.opportunities));
    } catch (error) {
      console.error('Error guardando oportunidades:', error);
    }
  }

  loadDeals() {
    try {
      const stored = localStorage.getItem('axyra_deals');
      if (stored) {
        this.deals = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando negocios:', error);
    }
  }

  saveDeals() {
    try {
      localStorage.setItem('axyra_deals', JSON.stringify(this.deals));
    } catch (error) {
      console.error('Error guardando negocios:', error);
    }
  }

  loadActivities() {
    try {
      const stored = localStorage.getItem('axyra_activities');
      if (stored) {
        this.activities = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando actividades:', error);
    }
  }

  saveActivities() {
    try {
      localStorage.setItem('axyra_activities', JSON.stringify(this.activities));
    } catch (error) {
      console.error('Error guardando actividades:', error);
    }
  }

  loadNotes() {
    try {
      const stored = localStorage.getItem('axyra_notes');
      if (stored) {
        this.notes = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando notas:', error);
    }
  }

  saveNotes() {
    try {
      localStorage.setItem('axyra_notes', JSON.stringify(this.notes));
    } catch (error) {
      console.error('Error guardando notas:', error);
    }
  }

  loadTasks() {
    try {
      const stored = localStorage.getItem('axyra_crm_tasks');
      if (stored) {
        this.tasks = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando tareas CRM:', error);
    }
  }

  saveTasks() {
    try {
      localStorage.setItem('axyra_crm_tasks', JSON.stringify(this.tasks));
    } catch (error) {
      console.error('Error guardando tareas CRM:', error);
    }
  }

  loadCampaigns() {
    try {
      const stored = localStorage.getItem('axyra_campaigns');
      if (stored) {
        this.campaigns = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando campañas:', error);
    }
  }

  saveCampaigns() {
    try {
      localStorage.setItem('axyra_campaigns', JSON.stringify(this.campaigns));
    } catch (error) {
      console.error('Error guardando campañas:', error);
    }
  }

  loadLeads() {
    try {
      const stored = localStorage.getItem('axyra_leads');
      if (stored) {
        this.leads = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando leads:', error);
    }
  }

  saveLeads() {
    try {
      localStorage.setItem('axyra_leads', JSON.stringify(this.leads));
    } catch (error) {
      console.error('Error guardando leads:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en clientes
    document.addEventListener('customerChanged', (event) => {
      this.handleCustomerChange(event.detail);
    });

    // Escuchar cambios en oportunidades
    document.addEventListener('opportunityChanged', (event) => {
      this.handleOpportunityChange(event.detail);
    });
  }

  handleCustomerChange(change) {
    const { customerId, action, data } = change;

    switch (action) {
      case 'created':
        this.customers.push(data);
        this.saveCustomers();
        break;
      case 'updated':
        const customerIndex = this.customers.findIndex((c) => c.id === customerId);
        if (customerIndex !== -1) {
          this.customers[customerIndex] = { ...this.customers[customerIndex], ...data };
          this.saveCustomers();
        }
        break;
      case 'deleted':
        this.customers = this.customers.filter((c) => c.id !== customerId);
        this.saveCustomers();
        break;
    }
  }

  handleOpportunityChange(change) {
    const { opportunityId, action, data } = change;

    switch (action) {
      case 'created':
        this.opportunities.push(data);
        this.saveOpportunities();
        break;
      case 'updated':
        const opportunityIndex = this.opportunities.findIndex((o) => o.id === opportunityId);
        if (opportunityIndex !== -1) {
          this.opportunities[opportunityIndex] = { ...this.opportunities[opportunityIndex], ...data };
          this.saveOpportunities();
        }
        break;
      case 'deleted':
        this.opportunities = this.opportunities.filter((o) => o.id !== opportunityId);
        this.saveOpportunities();
        break;
    }
  }

  createCustomer(customerData) {
    const customer = {
      id: 'customer_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: customerData.name,
      email: customerData.email,
      phone: customerData.phone,
      company: customerData.company || '',
      address: customerData.address || '',
      city: customerData.city || '',
      state: customerData.state || '',
      country: customerData.country || '',
      postalCode: customerData.postalCode || '',
      website: customerData.website || '',
      industry: customerData.industry || '',
      size: customerData.size || '',
      status: customerData.status || 'active',
      source: customerData.source || 'direct',
      tags: customerData.tags || [],
      notes: customerData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.customers.push(customer);
    this.saveCustomers();

    console.log('✅ Cliente creado:', customer.name);
    return customer;
  }

  updateCustomer(customerId, updates) {
    const customerIndex = this.customers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Cliente no encontrado');
    }

    this.customers[customerIndex] = {
      ...this.customers[customerIndex],
      ...updates,
      metadata: {
        ...this.customers[customerIndex].metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.saveCustomers();

    console.log('✅ Cliente actualizado:', this.customers[customerIndex].name);
    return this.customers[customerIndex];
  }

  deleteCustomer(customerId) {
    const customerIndex = this.customers.findIndex((c) => c.id === customerId);
    if (customerIndex === -1) {
      throw new Error('Cliente no encontrado');
    }

    const customer = this.customers[customerIndex];

    // Verificar si tiene oportunidades o negocios
    const hasOpportunities = this.opportunities.some((o) => o.customerId === customerId);
    const hasDeals = this.deals.some((d) => d.customerId === customerId);

    if (hasOpportunities || hasDeals) {
      throw new Error('No se puede eliminar un cliente que tiene oportunidades o negocios');
    }

    this.customers.splice(customerIndex, 1);
    this.saveCustomers();

    console.log('🗑️ Cliente eliminado:', customer.name);
    return customer;
  }

  createContact(contactData) {
    const contact = {
      id: 'contact_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      firstName: contactData.firstName,
      lastName: contactData.lastName,
      email: contactData.email,
      phone: contactData.phone,
      position: contactData.position || '',
      department: contactData.department || '',
      customerId: contactData.customerId,
      isPrimary: contactData.isPrimary || false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.contacts.push(contact);
    this.saveContacts();

    console.log('✅ Contacto creado:', contact.firstName + ' ' + contact.lastName);
    return contact;
  }

  createOpportunity(opportunityData) {
    const opportunity = {
      id: 'opportunity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: opportunityData.name,
      description: opportunityData.description || '',
      customerId: opportunityData.customerId,
      contactId: opportunityData.contactId,
      value: opportunityData.value || 0,
      probability: opportunityData.probability || 0,
      stage: opportunityData.stage || 'prospecting',
      expectedCloseDate: opportunityData.expectedCloseDate,
      actualCloseDate: opportunityData.actualCloseDate || null,
      source: opportunityData.source || 'direct',
      owner: opportunityData.owner || this.getCurrentUser(),
      tags: opportunityData.tags || [],
      notes: opportunityData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.opportunities.push(opportunity);
    this.saveOpportunities();

    console.log('✅ Oportunidad creada:', opportunity.name);
    return opportunity;
  }

  updateOpportunity(opportunityId, updates) {
    const opportunityIndex = this.opportunities.findIndex((o) => o.id === opportunityId);
    if (opportunityIndex === -1) {
      throw new Error('Oportunidad no encontrada');
    }

    this.opportunities[opportunityIndex] = {
      ...this.opportunities[opportunityIndex],
      ...updates,
      metadata: {
        ...this.opportunities[opportunityIndex].metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.saveOpportunities();

    console.log('✅ Oportunidad actualizada:', this.opportunities[opportunityIndex].name);
    return this.opportunities[opportunityIndex];
  }

  createDeal(dealData) {
    const deal = {
      id: 'deal_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: dealData.name,
      description: dealData.description || '',
      customerId: dealData.customerId,
      opportunityId: dealData.opportunityId,
      value: dealData.value,
      status: dealData.status || 'pending',
      closeDate: dealData.closeDate,
      owner: dealData.owner || this.getCurrentUser(),
      products: dealData.products || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.deals.push(deal);
    this.saveDeals();

    console.log('✅ Negocio creado:', deal.name);
    return deal;
  }

  addActivity(activityData) {
    const activity = {
      id: 'activity_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      type: activityData.type, // call, email, meeting, task, note
      subject: activityData.subject,
      description: activityData.description || '',
      customerId: activityData.customerId,
      contactId: activityData.contactId,
      opportunityId: activityData.opportunityId,
      dealId: activityData.dealId,
      date: activityData.date || new Date().toISOString(),
      duration: activityData.duration || 0,
      outcome: activityData.outcome || '',
      owner: activityData.owner || this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.activities.push(activity);
    this.saveActivities();

    console.log('✅ Actividad agregada:', activity.subject);
    return activity;
  }

  addNote(noteData) {
    const note = {
      id: 'note_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      content: noteData.content,
      customerId: noteData.customerId,
      contactId: noteData.contactId,
      opportunityId: noteData.opportunityId,
      dealId: noteData.dealId,
      author: noteData.author || this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.notes.push(note);
    this.saveNotes();

    console.log('✅ Nota agregada');
    return note;
  }

  createTask(taskData) {
    const task = {
      id: 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: taskData.title,
      description: taskData.description || '',
      customerId: taskData.customerId,
      contactId: taskData.contactId,
      opportunityId: taskData.opportunityId,
      dealId: taskData.dealId,
      status: taskData.status || 'pending',
      priority: taskData.priority || 'medium',
      dueDate: taskData.dueDate,
      assignee: taskData.assignee || this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.tasks.push(task);
    this.saveTasks();

    console.log('✅ Tarea creada:', task.title);
    return task;
  }

  createCampaign(campaignData) {
    const campaign = {
      id: 'campaign_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: campaignData.name,
      description: campaignData.description || '',
      type: campaignData.type || 'email',
      status: campaignData.status || 'draft',
      startDate: campaignData.startDate,
      endDate: campaignData.endDate,
      budget: campaignData.budget || 0,
      targetAudience: campaignData.targetAudience || [],
      owner: campaignData.owner || this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.campaigns.push(campaign);
    this.saveCampaigns();

    console.log('✅ Campaña creada:', campaign.name);
    return campaign;
  }

  createLead(leadData) {
    const lead = {
      id: 'lead_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      firstName: leadData.firstName,
      lastName: leadData.lastName,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company || '',
      position: leadData.position || '',
      source: leadData.source || 'direct',
      status: leadData.status || 'new',
      score: leadData.score || 0,
      notes: leadData.notes || '',
      owner: leadData.owner || this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.leads.push(lead);
    this.saveLeads();

    console.log('✅ Lead creado:', lead.firstName + ' ' + lead.lastName);
    return lead;
  }

  getCustomers(filters = {}) {
    let filteredCustomers = [...this.customers];

    if (filters.status) {
      filteredCustomers = filteredCustomers.filter((c) => c.status === filters.status);
    }

    if (filters.industry) {
      filteredCustomers = filteredCustomers.filter((c) => c.industry === filters.industry);
    }

    if (filters.source) {
      filteredCustomers = filteredCustomers.filter((c) => c.source === filters.source);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCustomers = filteredCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm) ||
          c.company.toLowerCase().includes(searchTerm)
      );
    }

    return filteredCustomers;
  }

  getOpportunities(filters = {}) {
    let filteredOpportunities = [...this.opportunities];

    if (filters.stage) {
      filteredOpportunities = filteredOpportunities.filter((o) => o.stage === filters.stage);
    }

    if (filters.owner) {
      filteredOpportunities = filteredOpportunities.filter((o) => o.owner === filters.owner);
    }

    if (filters.customerId) {
      filteredOpportunities = filteredOpportunities.filter((o) => o.customerId === filters.customerId);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOpportunities = filteredOpportunities.filter(
        (o) => o.name.toLowerCase().includes(searchTerm) || o.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredOpportunities;
  }

  getCRMStatistics() {
    const totalCustomers = this.customers.length;
    const activeCustomers = this.customers.filter((c) => c.status === 'active').length;
    const totalOpportunities = this.opportunities.length;
    const openOpportunities = this.opportunities.filter(
      (o) => o.stage !== 'closed_won' && o.stage !== 'closed_lost'
    ).length;
    const totalDeals = this.deals.length;
    const closedDeals = this.deals.filter((d) => d.status === 'closed').length;
    const totalLeads = this.leads.length;
    const qualifiedLeads = this.leads.filter((l) => l.status === 'qualified').length;

    const totalOpportunityValue = this.opportunities.reduce((sum, o) => sum + (o.value || 0), 0);
    const totalDealValue = this.deals.reduce((sum, d) => sum + (d.value || 0), 0);

    const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
    const winRate = totalOpportunities > 0 ? Math.round((closedDeals / totalOpportunities) * 100) : 0;

    return {
      totalCustomers,
      activeCustomers,
      totalOpportunities,
      openOpportunities,
      totalDeals,
      closedDeals,
      totalLeads,
      qualifiedLeads,
      totalOpportunityValue,
      totalDealValue,
      conversionRate,
      winRate,
    };
  }

  showCRMDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'crm-dashboard';
    dashboard.innerHTML = `
      <div class="crm-dashboard-overlay">
        <div class="crm-dashboard-container">
          <div class="crm-dashboard-header">
            <h3>👥 Dashboard CRM</h3>
            <div class="crm-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraCRMSystem.showCreateCustomerDialog()">Nuevo Cliente</button>
              <button class="btn btn-secondary" onclick="axyraCRMSystem.showCreateOpportunityDialog()">Nueva Oportunidad</button>
              <button class="btn btn-close" onclick="document.getElementById('crm-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="crm-dashboard-body">
            <div class="crm-dashboard-stats">
              ${this.renderCRMStats()}
            </div>
            <div class="crm-dashboard-content">
              <div class="crm-dashboard-tabs">
                <button class="tab-btn active" data-tab="customers">Clientes</button>
                <button class="tab-btn" data-tab="opportunities">Oportunidades</button>
                <button class="tab-btn" data-tab="deals">Negocios</button>
                <button class="tab-btn" data-tab="leads">Leads</button>
                <button class="tab-btn" data-tab="activities">Actividades</button>
              </div>
              <div class="crm-dashboard-tab-content">
                <div class="tab-content active" id="customers-tab">
                  ${this.renderCustomersList()}
                </div>
                <div class="tab-content" id="opportunities-tab">
                  ${this.renderOpportunitiesList()}
                </div>
                <div class="tab-content" id="deals-tab">
                  ${this.renderDealsList()}
                </div>
                <div class="tab-content" id="leads-tab">
                  ${this.renderLeadsList()}
                </div>
                <div class="tab-content" id="activities-tab">
                  ${this.renderActivitiesList()}
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

  renderCRMStats() {
    const stats = this.getCRMStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalCustomers}</div>
          <div class="stat-label">Total Clientes</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeCustomers}</div>
          <div class="stat-label">Clientes Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalOpportunities}</div>
          <div class="stat-label">Oportunidades</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.openOpportunities}</div>
          <div class="stat-label">Oportunidades Abiertas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalDeals}</div>
          <div class="stat-label">Negocios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.closedDeals}</div>
          <div class="stat-label">Negocios Cerrados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalLeads}</div>
          <div class="stat-label">Leads</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.qualifiedLeads}</div>
          <div class="stat-label">Leads Calificados</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${stats.totalOpportunityValue.toLocaleString()}</div>
          <div class="stat-label">Valor Oportunidades</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${stats.totalDealValue.toLocaleString()}</div>
          <div class="stat-label">Valor Negocios</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.conversionRate}%</div>
          <div class="stat-label">Tasa de Conversión</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.winRate}%</div>
          <div class="stat-label">Tasa de Éxito</div>
        </div>
      </div>
    `;
  }

  renderCustomersList() {
    const customers = this.getCustomers();

    return customers
      .map(
        (customer) => `
      <div class="customer-card">
        <div class="customer-header">
          <h4>${customer.name}</h4>
          <span class="customer-status status-${customer.status}">${customer.status}</span>
        </div>
        <div class="customer-info">
          <p>${customer.email}</p>
          <p>${customer.phone}</p>
          <p>${customer.company}</p>
        </div>
        <div class="customer-actions">
          <button onclick="axyraCRMSystem.showCustomerDetails('${customer.id}')">Ver</button>
          <button onclick="axyraCRMSystem.editCustomer('${customer.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderOpportunitiesList() {
    const opportunities = this.getOpportunities();

    return opportunities
      .map(
        (opportunity) => `
      <div class="opportunity-card">
        <div class="opportunity-header">
          <h4>${opportunity.name}</h4>
          <span class="opportunity-stage stage-${opportunity.stage}">${opportunity.stage}</span>
        </div>
        <div class="opportunity-info">
          <p>Valor: $${opportunity.value.toLocaleString()}</p>
          <p>Probabilidad: ${opportunity.probability}%</p>
          <p>Fecha esperada: ${new Date(opportunity.expectedCloseDate).toLocaleDateString()}</p>
        </div>
        <div class="opportunity-actions">
          <button onclick="axyraCRMSystem.showOpportunityDetails('${opportunity.id}')">Ver</button>
          <button onclick="axyraCRMSystem.editOpportunity('${opportunity.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderDealsList() {
    const deals = this.deals;

    return deals
      .map(
        (deal) => `
      <div class="deal-card">
        <div class="deal-header">
          <h4>${deal.name}</h4>
          <span class="deal-status status-${deal.status}">${deal.status}</span>
        </div>
        <div class="deal-info">
          <p>Valor: $${deal.value.toLocaleString()}</p>
          <p>Fecha de cierre: ${new Date(deal.closeDate).toLocaleDateString()}</p>
        </div>
        <div class="deal-actions">
          <button onclick="axyraCRMSystem.showDealDetails('${deal.id}')">Ver</button>
          <button onclick="axyraCRMSystem.editDeal('${deal.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderLeadsList() {
    const leads = this.leads;

    return leads
      .map(
        (lead) => `
      <div class="lead-card">
        <div class="lead-header">
          <h4>${lead.firstName} ${lead.lastName}</h4>
          <span class="lead-status status-${lead.status}">${lead.status}</span>
        </div>
        <div class="lead-info">
          <p>${lead.email}</p>
          <p>${lead.phone}</p>
          <p>${lead.company}</p>
          <p>Score: ${lead.score}</p>
        </div>
        <div class="lead-actions">
          <button onclick="axyraCRMSystem.showLeadDetails('${lead.id}')">Ver</button>
          <button onclick="axyraCRMSystem.editLead('${lead.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderActivitiesList() {
    const activities = this.activities.slice(-10); // Últimas 10 actividades

    return activities
      .map(
        (activity) => `
      <div class="activity-card">
        <div class="activity-header">
          <h5>${activity.subject}</h5>
          <span class="activity-type type-${activity.type}">${activity.type}</span>
        </div>
        <div class="activity-info">
          <p>${activity.description}</p>
          <p>Fecha: ${new Date(activity.date).toLocaleString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  showCreateCustomerDialog() {
    const name = prompt('Nombre del cliente:');
    if (name) {
      const email = prompt('Email del cliente:');
      const phone = prompt('Teléfono del cliente:');
      const company = prompt('Empresa del cliente:');
      this.createCustomer({ name, email, phone, company });
    }
  }

  showCreateOpportunityDialog() {
    const name = prompt('Nombre de la oportunidad:');
    if (name) {
      const value = parseFloat(prompt('Valor de la oportunidad:'));
      const customerId = prompt('ID del cliente:');
      this.createOpportunity({ name, value, customerId });
    }
  }

  showCustomerDetails(customerId) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (customer) {
      alert(
        `Cliente: ${customer.name}\nEmail: ${customer.email}\nTeléfono: ${customer.phone}\nEmpresa: ${customer.company}\nEstado: ${customer.status}`
      );
    }
  }

  editCustomer(customerId) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (customer) {
      const newName = prompt('Nuevo nombre:', customer.name);
      if (newName) {
        this.updateCustomer(customerId, { name: newName });
      }
    }
  }

  showOpportunityDetails(opportunityId) {
    const opportunity = this.opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      alert(
        `Oportunidad: ${opportunity.name}\nValor: $${opportunity.value}\nProbabilidad: ${opportunity.probability}%\nEtapa: ${opportunity.stage}`
      );
    }
  }

  editOpportunity(opportunityId) {
    const opportunity = this.opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      const newValue = parseFloat(prompt('Nuevo valor:', opportunity.value));
      if (newValue) {
        this.updateOpportunity(opportunityId, { value: newValue });
      }
    }
  }

  showDealDetails(dealId) {
    const deal = this.deals.find((d) => d.id === dealId);
    if (deal) {
      alert(
        `Negocio: ${deal.name}\nValor: $${deal.value}\nEstado: ${deal.status}\nFecha de cierre: ${new Date(
          deal.closeDate
        ).toLocaleDateString()}`
      );
    }
  }

  editDeal(dealId) {
    const deal = this.deals.find((d) => d.id === dealId);
    if (deal) {
      const newValue = parseFloat(prompt('Nuevo valor:', deal.value));
      if (newValue) {
        deal.value = newValue;
        this.saveDeals();
      }
    }
  }

  showLeadDetails(leadId) {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      alert(
        `Lead: ${lead.firstName} ${lead.lastName}\nEmail: ${lead.email}\nTeléfono: ${lead.phone}\nEmpresa: ${lead.company}\nScore: ${lead.score}`
      );
    }
  }

  editLead(leadId) {
    const lead = this.leads.find((l) => l.id === leadId);
    if (lead) {
      const newScore = parseInt(prompt('Nuevo score:', lead.score));
      if (newScore) {
        lead.score = newScore;
        this.saveLeads();
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

// Inicializar sistema CRM
let axyraCRMSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraCRMSystem = new AxyraCRMSystem();
  window.axyraCRMSystem = axyraCRMSystem;
});

// Exportar para uso global
window.AxyraCRMSystem = AxyraCRMSystem;
