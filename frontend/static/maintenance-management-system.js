/**
 * AXYRA - Sistema de Gestión de Mantenimiento y Activos
 * Maneja activos, mantenimiento preventivo, correctivo, órdenes de trabajo y inventario
 */

class AxyraMaintenanceManagementSystem {
  constructor() {
    this.assets = [];
    this.workOrders = [];
    this.maintenanceSchedules = [];
    this.spareParts = [];
    this.suppliers = [];
    this.technicians = [];
    this.maintenanceHistory = [];
    this.inspections = [];
    this.failures = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('🔧 Inicializando sistema de gestión de mantenimiento...');
    this.loadAssets();
    this.loadWorkOrders();
    this.loadMaintenanceSchedules();
    this.loadSpareParts();
    this.loadSuppliers();
    this.loadTechnicians();
    this.loadMaintenanceHistory();
    this.loadInspections();
    this.loadFailures();
    this.setupEventListeners();
    this.setupDefaultData();
    this.isInitialized = true;
  }

  loadAssets() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_assets');
      if (stored) {
        this.assets = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando activos:', error);
    }
  }

  saveAssets() {
    try {
      localStorage.setItem('axyra_maintenance_assets', JSON.stringify(this.assets));
    } catch (error) {
      console.error('Error guardando activos:', error);
    }
  }

  loadWorkOrders() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_work_orders');
      if (stored) {
        this.workOrders = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando órdenes de trabajo:', error);
    }
  }

  saveWorkOrders() {
    try {
      localStorage.setItem('axyra_maintenance_work_orders', JSON.stringify(this.workOrders));
    } catch (error) {
      console.error('Error guardando órdenes de trabajo:', error);
    }
  }

  loadMaintenanceSchedules() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_schedules');
      if (stored) {
        this.maintenanceSchedules = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando cronogramas de mantenimiento:', error);
    }
  }

  saveMaintenanceSchedules() {
    try {
      localStorage.setItem('axyra_maintenance_schedules', JSON.stringify(this.maintenanceSchedules));
    } catch (error) {
      console.error('Error guardando cronogramas de mantenimiento:', error);
    }
  }

  loadSpareParts() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_spare_parts');
      if (stored) {
        this.spareParts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando repuestos:', error);
    }
  }

  saveSpareParts() {
    try {
      localStorage.setItem('axyra_maintenance_spare_parts', JSON.stringify(this.spareParts));
    } catch (error) {
      console.error('Error guardando repuestos:', error);
    }
  }

  loadSuppliers() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_suppliers');
      if (stored) {
        this.suppliers = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando proveedores:', error);
    }
  }

  saveSuppliers() {
    try {
      localStorage.setItem('axyra_maintenance_suppliers', JSON.stringify(this.suppliers));
    } catch (error) {
      console.error('Error guardando proveedores:', error);
    }
  }

  loadTechnicians() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_technicians');
      if (stored) {
        this.technicians = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando técnicos:', error);
    }
  }

  saveTechnicians() {
    try {
      localStorage.setItem('axyra_maintenance_technicians', JSON.stringify(this.technicians));
    } catch (error) {
      console.error('Error guardando técnicos:', error);
    }
  }

  loadMaintenanceHistory() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_history');
      if (stored) {
        this.maintenanceHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando historial de mantenimiento:', error);
    }
  }

  saveMaintenanceHistory() {
    try {
      localStorage.setItem('axyra_maintenance_history', JSON.stringify(this.maintenanceHistory));
    } catch (error) {
      console.error('Error guardando historial de mantenimiento:', error);
    }
  }

  loadInspections() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_inspections');
      if (stored) {
        this.inspections = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando inspecciones:', error);
    }
  }

  saveInspections() {
    try {
      localStorage.setItem('axyra_maintenance_inspections', JSON.stringify(this.inspections));
    } catch (error) {
      console.error('Error guardando inspecciones:', error);
    }
  }

  loadFailures() {
    try {
      const stored = localStorage.getItem('axyra_maintenance_failures');
      if (stored) {
        this.failures = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando fallas:', error);
    }
  }

  saveFailures() {
    try {
      localStorage.setItem('axyra_maintenance_failures', JSON.stringify(this.failures));
    } catch (error) {
      console.error('Error guardando fallas:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en activos
    document.addEventListener('assetChanged', (event) => {
      this.handleAssetChange(event.detail);
    });

    // Escuchar cambios en órdenes de trabajo
    document.addEventListener('workOrderChanged', (event) => {
      this.handleWorkOrderChange(event.detail);
    });
  }

  setupDefaultData() {
    if (this.technicians.length === 0) {
      this.technicians = [
        {
          id: 'tech_1',
          name: 'Juan Pérez',
          specialization: 'Mecánica',
          experience: '5 años',
          certifications: ['Soldadura', 'Electricidad'],
          isActive: true,
        },
        {
          id: 'tech_2',
          name: 'María García',
          specialization: 'Eléctrica',
          experience: '3 años',
          certifications: ['Electricidad Industrial', 'PLC'],
          isActive: true,
        },
      ];
      this.saveTechnicians();
    }

    if (this.suppliers.length === 0) {
      this.suppliers = [
        {
          id: 'supplier_1',
          name: 'Repuestos Industriales S.A.',
          contact: 'Carlos López',
          phone: '300-123-4567',
          email: 'ventas@repuestos.com',
          specialties: ['Mecánica', 'Hidráulica'],
          isActive: true,
        },
        {
          id: 'supplier_2',
          name: 'Componentes Eléctricos Ltda.',
          contact: 'Ana Martínez',
          phone: '300-987-6543',
          email: 'info@componentes.com',
          specialties: ['Eléctrica', 'Electrónica'],
          isActive: true,
        },
      ];
      this.saveSuppliers();
    }
  }

  handleAssetChange(change) {
    const { assetId, action, data } = change;

    switch (action) {
      case 'created':
        this.assets.push(data);
        this.saveAssets();
        break;
      case 'updated':
        const assetIndex = this.assets.findIndex((a) => a.id === assetId);
        if (assetIndex !== -1) {
          this.assets[assetIndex] = { ...this.assets[assetIndex], ...data };
          this.saveAssets();
        }
        break;
      case 'deleted':
        this.assets = this.assets.filter((a) => a.id !== assetId);
        this.saveAssets();
        break;
    }
  }

  handleWorkOrderChange(change) {
    const { workOrderId, action, data } = change;

    switch (action) {
      case 'created':
        this.workOrders.push(data);
        this.saveWorkOrders();
        break;
      case 'updated':
        const workOrderIndex = this.workOrders.findIndex((wo) => wo.id === workOrderId);
        if (workOrderIndex !== -1) {
          this.workOrders[workOrderIndex] = { ...this.workOrders[workOrderIndex], ...data };
          this.saveWorkOrders();
        }
        break;
      case 'deleted':
        this.workOrders = this.workOrders.filter((wo) => wo.id !== workOrderId);
        this.saveWorkOrders();
        break;
    }
  }

  createAsset(assetData) {
    const asset = {
      id: 'asset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: assetData.name,
      description: assetData.description || '',
      category: assetData.category || '',
      type: assetData.type || '',
      model: assetData.model || '',
      serialNumber: assetData.serialNumber || '',
      manufacturer: assetData.manufacturer || '',
      location: assetData.location || '',
      department: assetData.department || '',
      status: assetData.status || 'active', // active, inactive, maintenance, retired
      condition: assetData.condition || 'good', // excellent, good, fair, poor, critical
      purchaseDate: assetData.purchaseDate || null,
      warrantyExpiry: assetData.warrantyExpiry || null,
      cost: assetData.cost || 0,
      currentValue: assetData.currentValue || 0,
      maintenanceInterval: assetData.maintenanceInterval || 0, // in days
      lastMaintenance: assetData.lastMaintenance || null,
      nextMaintenance: assetData.nextMaintenance || null,
      specifications: assetData.specifications || {},
      documents: assetData.documents || [],
      images: assetData.images || [],
      tags: assetData.tags || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.assets.push(asset);
    this.saveAssets();

    console.log('✅ Activo creado:', asset.name);
    return asset;
  }

  updateAsset(assetId, updates) {
    const assetIndex = this.assets.findIndex((a) => a.id === assetId);
    if (assetIndex === -1) {
      throw new Error('Activo no encontrado');
    }

    this.assets[assetIndex] = {
      ...this.assets[assetIndex],
      ...updates,
      metadata: {
        ...this.assets[assetIndex].metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.saveAssets();

    console.log('✅ Activo actualizado:', this.assets[assetIndex].name);
    return this.assets[assetIndex];
  }

  createWorkOrder(workOrderData) {
    const workOrder = {
      id: 'wo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      title: workOrderData.title,
      description: workOrderData.description,
      assetId: workOrderData.assetId,
      type: workOrderData.type || 'corrective', // preventive, corrective, emergency, inspection
      priority: workOrderData.priority || 'medium', // low, medium, high, critical
      status: workOrderData.status || 'open', // open, assigned, in_progress, completed, cancelled
      assignedTo: workOrderData.assignedTo || null,
      requestedBy: workOrderData.requestedBy || this.getCurrentUser(),
      createdDate: workOrderData.createdDate || new Date().toISOString(),
      scheduledDate: workOrderData.scheduledDate || null,
      completedDate: workOrderData.completedDate || null,
      estimatedHours: workOrderData.estimatedHours || 0,
      actualHours: workOrderData.actualHours || 0,
      cost: workOrderData.cost || 0,
      spareParts: workOrderData.spareParts || [],
      tools: workOrderData.tools || [],
      safetyRequirements: workOrderData.safetyRequirements || [],
      instructions: workOrderData.instructions || [],
      notes: workOrderData.notes || '',
      attachments: workOrderData.attachments || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.workOrders.push(workOrder);
    this.saveWorkOrders();

    console.log('✅ Orden de trabajo creada:', workOrder.title);
    return workOrder;
  }

  createMaintenanceSchedule(scheduleData) {
    const schedule = {
      id: 'schedule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      assetId: scheduleData.assetId,
      name: scheduleData.name,
      description: scheduleData.description || '',
      type: scheduleData.type || 'preventive', // preventive, predictive, condition_based
      frequency: scheduleData.frequency || 'monthly', // daily, weekly, monthly, quarterly, annually
      interval: scheduleData.interval || 30, // in days
      startDate: scheduleData.startDate,
      endDate: scheduleData.endDate || null,
      isActive: scheduleData.isActive !== false,
      tasks: scheduleData.tasks || [],
      estimatedDuration: scheduleData.estimatedDuration || 0,
      requiredSkills: scheduleData.requiredSkills || [],
      spareParts: scheduleData.spareParts || [],
      tools: scheduleData.tools || [],
      safetyRequirements: scheduleData.safetyRequirements || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.maintenanceSchedules.push(schedule);
    this.saveMaintenanceSchedules();

    console.log('✅ Cronograma de mantenimiento creado:', schedule.name);
    return schedule;
  }

  createSparePart(sparePartData) {
    const sparePart = {
      id: 'part_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: sparePartData.name,
      description: sparePartData.description || '',
      partNumber: sparePartData.partNumber || '',
      category: sparePartData.category || '',
      manufacturer: sparePartData.manufacturer || '',
      supplier: sparePartData.supplier || '',
      cost: sparePartData.cost || 0,
      quantity: sparePartData.quantity || 0,
      minQuantity: sparePartData.minQuantity || 0,
      maxQuantity: sparePartData.maxQuantity || 0,
      location: sparePartData.location || '',
      shelf: sparePartData.shelf || '',
      unit: sparePartData.unit || 'pcs',
      compatibleAssets: sparePartData.compatibleAssets || [],
      specifications: sparePartData.specifications || {},
      images: sparePartData.images || [],
      isActive: sparePartData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.spareParts.push(sparePart);
    this.saveSpareParts();

    console.log('✅ Repuesto creado:', sparePart.name);
    return sparePart;
  }

  createInspection(inspectionData) {
    const inspection = {
      id: 'inspection_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      assetId: inspectionData.assetId,
      title: inspectionData.title,
      description: inspectionData.description || '',
      type: inspectionData.type || 'routine', // routine, safety, compliance, pre_maintenance
      inspector: inspectionData.inspector,
      scheduledDate: inspectionData.scheduledDate,
      completedDate: inspectionData.completedDate || null,
      status: inspectionData.status || 'scheduled', // scheduled, in_progress, completed, cancelled
      findings: inspectionData.findings || [],
      recommendations: inspectionData.recommendations || [],
      photos: inspectionData.photos || [],
      notes: inspectionData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.inspections.push(inspection);
    this.saveInspections();

    console.log('✅ Inspección creada:', inspection.title);
    return inspection;
  }

  createFailure(failureData) {
    const failure = {
      id: 'failure_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      assetId: failureData.assetId,
      title: failureData.title,
      description: failureData.description,
      type: failureData.type || 'mechanical', // mechanical, electrical, hydraulic, pneumatic, electronic
      severity: failureData.severity || 'medium', // low, medium, high, critical
      status: failureData.status || 'reported', // reported, investigating, repairing, resolved, closed
      reportedBy: failureData.reportedBy || this.getCurrentUser(),
      reportedDate: failureData.reportedDate || new Date().toISOString(),
      resolvedDate: failureData.resolvedDate || null,
      rootCause: failureData.rootCause || '',
      impact: failureData.impact || '',
      downtime: failureData.downtime || 0, // in hours
      cost: failureData.cost || 0,
      workOrderId: failureData.workOrderId || null,
      photos: failureData.photos || [],
      notes: failureData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.failures.push(failure);
    this.saveFailures();

    console.log('✅ Falla registrada:', failure.title);
    return failure;
  }

  recordMaintenanceHistory(historyData) {
    const history = {
      id: 'history_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      assetId: historyData.assetId,
      workOrderId: historyData.workOrderId || null,
      type: historyData.type || 'maintenance', // maintenance, repair, inspection, calibration
      description: historyData.description,
      performedBy: historyData.performedBy,
      performedDate: historyData.performedDate || new Date().toISOString(),
      duration: historyData.duration || 0, // in hours
      cost: historyData.cost || 0,
      sparePartsUsed: historyData.sparePartsUsed || [],
      notes: historyData.notes || '',
      beforePhotos: historyData.beforePhotos || [],
      afterPhotos: historyData.afterPhotos || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.maintenanceHistory.push(history);
    this.saveMaintenanceHistory();

    // Actualizar último mantenimiento del activo
    this.updateAsset(historyData.assetId, {
      lastMaintenance: historyData.performedDate,
      nextMaintenance: this.calculateNextMaintenance(historyData.assetId, historyData.performedDate),
    });

    console.log('✅ Historial de mantenimiento registrado:', history.description);
    return history;
  }

  calculateNextMaintenance(assetId, lastMaintenanceDate) {
    const asset = this.assets.find((a) => a.id === assetId);
    if (!asset || !asset.maintenanceInterval) return null;

    const lastDate = new Date(lastMaintenanceDate);
    const nextDate = new Date(lastDate.getTime() + asset.maintenanceInterval * 24 * 60 * 60 * 1000);

    return nextDate.toISOString();
  }

  getMaintenanceStatistics() {
    const totalAssets = this.assets.length;
    const activeAssets = this.assets.filter((a) => a.status === 'active').length;
    const assetsInMaintenance = this.assets.filter((a) => a.status === 'maintenance').length;
    const totalWorkOrders = this.workOrders.length;
    const openWorkOrders = this.workOrders.filter(
      (wo) => wo.status === 'open' || wo.status === 'assigned' || wo.status === 'in_progress'
    ).length;
    const completedWorkOrders = this.workOrders.filter((wo) => wo.status === 'completed').length;
    const totalFailures = this.failures.length;
    const openFailures = this.failures.filter(
      (f) => f.status === 'reported' || f.status === 'investigating' || f.status === 'repairing'
    ).length;
    const totalSpareParts = this.spareParts.length;
    const lowStockParts = this.spareParts.filter((sp) => sp.quantity <= sp.minQuantity).length;
    const totalInspections = this.inspections.length;
    const pendingInspections = this.inspections.filter(
      (i) => i.status === 'scheduled' || i.status === 'in_progress'
    ).length;

    return {
      totalAssets,
      activeAssets,
      assetsInMaintenance,
      totalWorkOrders,
      openWorkOrders,
      completedWorkOrders,
      totalFailures,
      openFailures,
      totalSpareParts,
      lowStockParts,
      totalInspections,
      pendingInspections,
    };
  }

  showMaintenanceDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'maintenance-dashboard';
    dashboard.innerHTML = `
      <div class="maintenance-dashboard-overlay">
        <div class="maintenance-dashboard-container">
          <div class="maintenance-dashboard-header">
            <h3>🔧 Dashboard de Mantenimiento</h3>
            <div class="maintenance-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraMaintenanceManagementSystem.showCreateAssetDialog()">Nuevo Activo</button>
              <button class="btn btn-secondary" onclick="axyraMaintenanceManagementSystem.showCreateWorkOrderDialog()">Nueva Orden</button>
              <button class="btn btn-close" onclick="document.getElementById('maintenance-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="maintenance-dashboard-body">
            <div class="maintenance-dashboard-stats">
              ${this.renderMaintenanceStats()}
            </div>
            <div class="maintenance-dashboard-content">
              <div class="maintenance-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="assets">Activos</button>
                <button class="tab-btn" data-tab="workorders">Órdenes de Trabajo</button>
                <button class="tab-btn" data-tab="spareparts">Repuestos</button>
                <button class="tab-btn" data-tab="failures">Fallas</button>
              </div>
              <div class="maintenance-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="assets-tab">
                  ${this.renderAssetsList()}
                </div>
                <div class="tab-content" id="workorders-tab">
                  ${this.renderWorkOrdersList()}
                </div>
                <div class="tab-content" id="spareparts-tab">
                  ${this.renderSparePartsList()}
                </div>
                <div class="tab-content" id="failures-tab">
                  ${this.renderFailuresList()}
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

  renderMaintenanceStats() {
    const stats = this.getMaintenanceStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalAssets}</div>
          <div class="stat-label">Total Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeAssets}</div>
          <div class="stat-label">Activos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.assetsInMaintenance}</div>
          <div class="stat-label">En Mantenimiento</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalWorkOrders}</div>
          <div class="stat-label">Órdenes de Trabajo</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.openWorkOrders}</div>
          <div class="stat-label">Órdenes Abiertas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.completedWorkOrders}</div>
          <div class="stat-label">Órdenes Completadas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalFailures}</div>
          <div class="stat-label">Total Fallas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.openFailures}</div>
          <div class="stat-label">Fallas Abiertas</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalSpareParts}</div>
          <div class="stat-label">Total Repuestos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.lowStockParts}</div>
          <div class="stat-label">Stock Bajo</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalInspections}</div>
          <div class="stat-label">Total Inspecciones</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.pendingInspections}</div>
          <div class="stat-label">Inspecciones Pendientes</div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const stats = this.getMaintenanceStatistics();

    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Activos</h4>
          <div class="asset-status">
            <div class="asset-status-item">
              <span>Activos Activos</span>
              <span>${stats.activeAssets}</span>
            </div>
            <div class="asset-status-item">
              <span>En Mantenimiento</span>
              <span>${stats.assetsInMaintenance}</span>
            </div>
            <div class="asset-status-item">
              <span>Total Activos</span>
              <span>${stats.totalAssets}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Órdenes de Trabajo</h4>
          <div class="workorder-status">
            <div class="workorder-status-item">
              <span>Abiertas</span>
              <span>${stats.openWorkOrders}</span>
            </div>
            <div class="workorder-status-item">
              <span>Completadas</span>
              <span>${stats.completedWorkOrders}</span>
            </div>
            <div class="workorder-status-item">
              <span>Total</span>
              <span>${stats.totalWorkOrders}</span>
            </div>
          </div>
        </div>
        <div class="overview-card">
          <h4>Fallas y Repuestos</h4>
          <div class="failure-status">
            <div class="failure-status-item">
              <span>Fallas Abiertas</span>
              <span>${stats.openFailures}</span>
            </div>
            <div class="failure-status-item">
              <span>Repuestos con Stock Bajo</span>
              <span>${stats.lowStockParts}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderAssetsList() {
    const assets = this.assets.slice(-20); // Últimos 20 activos

    return assets
      .map(
        (asset) => `
      <div class="asset-card">
        <div class="asset-header">
          <h5>${asset.name}</h5>
          <span class="asset-status status-${asset.status}">${asset.status}</span>
        </div>
        <div class="asset-info">
          <p>${asset.description}</p>
          <p>Categoría: ${asset.category}</p>
          <p>Ubicación: ${asset.location}</p>
          <p>Condición: ${asset.condition}</p>
          <p>Valor: $${asset.currentValue.toLocaleString()}</p>
        </div>
        <div class="asset-actions">
          <button onclick="axyraMaintenanceManagementSystem.showAssetDetails('${asset.id}')">Ver</button>
          <button onclick="axyraMaintenanceManagementSystem.editAsset('${asset.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderWorkOrdersList() {
    const workOrders = this.workOrders.slice(-20); // Últimas 20 órdenes de trabajo

    return workOrders
      .map(
        (wo) => `
      <div class="workorder-card">
        <div class="workorder-header">
          <h5>${wo.title}</h5>
          <span class="workorder-priority priority-${wo.priority}">${wo.priority}</span>
        </div>
        <div class="workorder-info">
          <p>${wo.description}</p>
          <p>Tipo: ${wo.type}</p>
          <p>Estado: ${wo.status}</p>
          <p>Asignado a: ${wo.assignedTo || 'Sin asignar'}</p>
          <p>Fecha: ${new Date(wo.createdDate).toLocaleDateString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderSparePartsList() {
    const spareParts = this.spareParts.slice(-20); // Últimos 20 repuestos

    return spareParts
      .map(
        (part) => `
      <div class="sparepart-card">
        <div class="sparepart-header">
          <h5>${part.name}</h5>
          <span class="sparepart-stock ${part.quantity <= part.minQuantity ? 'low-stock' : 'normal-stock'}">${
          part.quantity
        }</span>
        </div>
        <div class="sparepart-info">
          <p>${part.description}</p>
          <p>Número de parte: ${part.partNumber}</p>
          <p>Categoría: ${part.category}</p>
          <p>Proveedor: ${part.supplier}</p>
          <p>Costo: $${part.cost.toLocaleString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderFailuresList() {
    const failures = this.failures.slice(-20); // Últimas 20 fallas

    return failures
      .map(
        (failure) => `
      <div class="failure-card">
        <div class="failure-header">
          <h5>${failure.title}</h5>
          <span class="failure-severity severity-${failure.severity}">${failure.severity}</span>
        </div>
        <div class="failure-info">
          <p>${failure.description}</p>
          <p>Tipo: ${failure.type}</p>
          <p>Estado: ${failure.status}</p>
          <p>Reportado por: ${failure.reportedBy}</p>
          <p>Fecha: ${new Date(failure.reportedDate).toLocaleDateString()}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  showCreateAssetDialog() {
    const name = prompt('Nombre del activo:');
    if (name) {
      const description = prompt('Descripción del activo:');
      const category = prompt('Categoría del activo:');
      const location = prompt('Ubicación del activo:');
      const cost = parseFloat(prompt('Costo del activo:'));
      this.createAsset({ name, description, category, location, cost });
    }
  }

  showCreateWorkOrderDialog() {
    const title = prompt('Título de la orden de trabajo:');
    if (title) {
      const description = prompt('Descripción de la orden:');
      const assetId = prompt('ID del activo:');
      const priority = prompt('Prioridad (low, medium, high, critical):');
      this.createWorkOrder({ title, description, assetId, priority });
    }
  }

  showAssetDetails(assetId) {
    const asset = this.assets.find((a) => a.id === assetId);
    if (asset) {
      alert(
        `Activo: ${asset.name}\nDescripción: ${asset.description}\nCategoría: ${asset.category}\nUbicación: ${
          asset.location
        }\nEstado: ${asset.status}\nCondición: ${asset.condition}\nValor: $${asset.currentValue.toLocaleString()}`
      );
    }
  }

  editAsset(assetId) {
    const asset = this.assets.find((a) => a.id === assetId);
    if (asset) {
      const newCondition = prompt('Nueva condición (excellent, good, fair, poor, critical):', asset.condition);
      if (newCondition) {
        this.updateAsset(assetId, { condition: newCondition });
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

// Inicializar sistema de mantenimiento
let axyraMaintenanceManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraMaintenanceManagementSystem = new AxyraMaintenanceManagementSystem();
  window.axyraMaintenanceManagementSystem = axyraMaintenanceManagementSystem;
});

// Exportar para uso global
window.AxyraMaintenanceManagementSystem = AxyraMaintenanceManagementSystem;
