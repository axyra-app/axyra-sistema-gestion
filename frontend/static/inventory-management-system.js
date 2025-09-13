/**
 * AXYRA - Sistema Avanzado de Gestión de Inventario
 * Maneja productos, categorías, stock, proveedores, compras y ventas
 */

class AxyraInventoryManagementSystem {
  constructor() {
    this.products = [];
    this.categories = [];
    this.suppliers = [];
    this.purchases = [];
    this.sales = [];
    this.stockMovements = [];
    this.priceHistory = [];
    this.lowStockAlerts = [];
    this.isInitialized = false;

    this.init();
  }

  init() {
    console.log('📦 Inicializando sistema de gestión de inventario...');
    this.loadProducts();
    this.loadCategories();
    this.loadSuppliers();
    this.loadPurchases();
    this.loadSales();
    this.loadStockMovements();
    this.loadPriceHistory();
    this.loadLowStockAlerts();
    this.setupEventListeners();
    this.setupLowStockMonitoring();
    this.isInitialized = true;
  }

  loadProducts() {
    try {
      const stored = localStorage.getItem('axyra_inventory_products');
      if (stored) {
        this.products = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando productos:', error);
    }
  }

  saveProducts() {
    try {
      localStorage.setItem('axyra_inventory_products', JSON.stringify(this.products));
    } catch (error) {
      console.error('Error guardando productos:', error);
    }
  }

  loadCategories() {
    try {
      const stored = localStorage.getItem('axyra_inventory_categories');
      if (stored) {
        this.categories = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando categorías:', error);
    }
  }

  saveCategories() {
    try {
      localStorage.setItem('axyra_inventory_categories', JSON.stringify(this.categories));
    } catch (error) {
      console.error('Error guardando categorías:', error);
    }
  }

  loadSuppliers() {
    try {
      const stored = localStorage.getItem('axyra_inventory_suppliers');
      if (stored) {
        this.suppliers = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando proveedores:', error);
    }
  }

  saveSuppliers() {
    try {
      localStorage.setItem('axyra_inventory_suppliers', JSON.stringify(this.suppliers));
    } catch (error) {
      console.error('Error guardando proveedores:', error);
    }
  }

  loadPurchases() {
    try {
      const stored = localStorage.getItem('axyra_inventory_purchases');
      if (stored) {
        this.purchases = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando compras:', error);
    }
  }

  savePurchases() {
    try {
      localStorage.setItem('axyra_inventory_purchases', JSON.stringify(this.purchases));
    } catch (error) {
      console.error('Error guardando compras:', error);
    }
  }

  loadSales() {
    try {
      const stored = localStorage.getItem('axyra_inventory_sales');
      if (stored) {
        this.sales = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando ventas:', error);
    }
  }

  saveSales() {
    try {
      localStorage.setItem('axyra_inventory_sales', JSON.stringify(this.sales));
    } catch (error) {
      console.error('Error guardando ventas:', error);
    }
  }

  loadStockMovements() {
    try {
      const stored = localStorage.getItem('axyra_inventory_stock_movements');
      if (stored) {
        this.stockMovements = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando movimientos de stock:', error);
    }
  }

  saveStockMovements() {
    try {
      localStorage.setItem('axyra_inventory_stock_movements', JSON.stringify(this.stockMovements));
    } catch (error) {
      console.error('Error guardando movimientos de stock:', error);
    }
  }

  loadPriceHistory() {
    try {
      const stored = localStorage.getItem('axyra_inventory_price_history');
      if (stored) {
        this.priceHistory = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando historial de precios:', error);
    }
  }

  savePriceHistory() {
    try {
      localStorage.setItem('axyra_inventory_price_history', JSON.stringify(this.priceHistory));
    } catch (error) {
      console.error('Error guardando historial de precios:', error);
    }
  }

  loadLowStockAlerts() {
    try {
      const stored = localStorage.getItem('axyra_inventory_low_stock_alerts');
      if (stored) {
        this.lowStockAlerts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando alertas de stock bajo:', error);
    }
  }

  saveLowStockAlerts() {
    try {
      localStorage.setItem('axyra_inventory_low_stock_alerts', JSON.stringify(this.lowStockAlerts));
    } catch (error) {
      console.error('Error guardando alertas de stock bajo:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en productos
    document.addEventListener('productChanged', (event) => {
      this.handleProductChange(event.detail);
    });

    // Escuchar cambios en stock
    document.addEventListener('stockChanged', (event) => {
      this.handleStockChange(event.detail);
    });
  }

  setupLowStockMonitoring() {
    // Verificar stock bajo cada 5 minutos
    setInterval(() => {
      this.checkLowStock();
    }, 5 * 60 * 1000);
  }

  handleProductChange(change) {
    const { productId, action, data } = change;

    switch (action) {
      case 'created':
        this.products.push(data);
        this.saveProducts();
        break;
      case 'updated':
        const productIndex = this.products.findIndex((p) => p.id === productId);
        if (productIndex !== -1) {
          this.products[productIndex] = { ...this.products[productIndex], ...data };
          this.saveProducts();
        }
        break;
      case 'deleted':
        this.products = this.products.filter((p) => p.id !== productId);
        this.saveProducts();
        break;
    }
  }

  handleStockChange(change) {
    const { productId, action, data } = change;

    switch (action) {
      case 'movement':
        this.stockMovements.push(data);
        this.saveStockMovements();
        break;
      case 'adjustment':
        this.adjustStock(productId, data.quantity, data.reason);
        break;
    }
  }

  createProduct(productData) {
    const product = {
      id: 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: productData.name,
      description: productData.description || '',
      sku: productData.sku || this.generateSKU(),
      barcode: productData.barcode || '',
      categoryId: productData.categoryId,
      supplierId: productData.supplierId,
      costPrice: productData.costPrice || 0,
      sellingPrice: productData.sellingPrice || 0,
      minStock: productData.minStock || 0,
      maxStock: productData.maxStock || 0,
      currentStock: productData.currentStock || 0,
      unit: productData.unit || 'pcs',
      weight: productData.weight || 0,
      dimensions: productData.dimensions || { length: 0, width: 0, height: 0 },
      images: productData.images || [],
      tags: productData.tags || [],
      isActive: productData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.products.push(product);
    this.saveProducts();

    // Crear entrada inicial de stock
    this.addStockMovement(product.id, 'initial', product.currentStock, 'Stock inicial');

    console.log('✅ Producto creado:', product.name);
    return product;
  }

  updateProduct(productId, updates) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const oldProduct = this.products[productIndex];
    const newProduct = {
      ...oldProduct,
      ...updates,
      metadata: {
        ...oldProduct.metadata,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    // Si cambió el precio, registrar en historial
    if (updates.sellingPrice && updates.sellingPrice !== oldProduct.sellingPrice) {
      this.addPriceHistory(productId, oldProduct.sellingPrice, updates.sellingPrice);
    }

    this.products[productIndex] = newProduct;
    this.saveProducts();

    console.log('✅ Producto actualizado:', newProduct.name);
    return newProduct;
  }

  deleteProduct(productId) {
    const productIndex = this.products.findIndex((p) => p.id === productId);
    if (productIndex === -1) {
      throw new Error('Producto no encontrado');
    }

    const product = this.products[productIndex];

    // Verificar si tiene stock
    if (product.currentStock > 0) {
      throw new Error('No se puede eliminar un producto que tiene stock');
    }

    this.products.splice(productIndex, 1);
    this.saveProducts();

    console.log('🗑️ Producto eliminado:', product.name);
    return product;
  }

  createCategory(categoryData) {
    const category = {
      id: 'category_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: categoryData.name,
      description: categoryData.description || '',
      parentId: categoryData.parentId || null,
      isActive: categoryData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.categories.push(category);
    this.saveCategories();

    console.log('✅ Categoría creada:', category.name);
    return category;
  }

  createSupplier(supplierData) {
    const supplier = {
      id: 'supplier_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: supplierData.name,
      contactPerson: supplierData.contactPerson || '',
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address || '',
      city: supplierData.city || '',
      state: supplierData.state || '',
      country: supplierData.country || '',
      postalCode: supplierData.postalCode || '',
      website: supplierData.website || '',
      paymentTerms: supplierData.paymentTerms || '30',
      isActive: supplierData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.suppliers.push(supplier);
    this.saveSuppliers();

    console.log('✅ Proveedor creado:', supplier.name);
    return supplier;
  }

  addStock(productId, quantity, reason = 'Ajuste de stock') {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const oldStock = product.currentStock;
    product.currentStock += quantity;

    this.saveProducts();
    this.addStockMovement(productId, 'in', quantity, reason);

    console.log('📈 Stock agregado:', product.name, '+', quantity);
    return product.currentStock;
  }

  removeStock(productId, quantity, reason = 'Ajuste de stock') {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (product.currentStock < quantity) {
      throw new Error('Stock insuficiente');
    }

    const oldStock = product.currentStock;
    product.currentStock -= quantity;

    this.saveProducts();
    this.addStockMovement(productId, 'out', quantity, reason);

    console.log('📉 Stock removido:', product.name, '-', quantity);
    return product.currentStock;
  }

  adjustStock(productId, newQuantity, reason = 'Ajuste de stock') {
    const product = this.products.find((p) => p.id === productId);
    if (!product) {
      throw new Error('Producto no encontrado');
    }

    const oldStock = product.currentStock;
    const difference = newQuantity - oldStock;

    product.currentStock = newQuantity;
    this.saveProducts();

    if (difference > 0) {
      this.addStockMovement(productId, 'in', difference, reason);
    } else if (difference < 0) {
      this.addStockMovement(productId, 'out', Math.abs(difference), reason);
    }

    console.log('🔄 Stock ajustado:', product.name, 'de', oldStock, 'a', newQuantity);
    return product.currentStock;
  }

  addStockMovement(productId, type, quantity, reason) {
    const movement = {
      id: 'movement_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      productId,
      type, // 'in', 'out', 'initial', 'adjustment'
      quantity,
      reason,
      date: new Date().toISOString(),
      userId: this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.stockMovements.push(movement);
    this.saveStockMovements();

    return movement;
  }

  addPriceHistory(productId, oldPrice, newPrice) {
    const priceEntry = {
      id: 'price_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      productId,
      oldPrice,
      newPrice,
      changeDate: new Date().toISOString(),
      userId: this.getCurrentUser(),
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
    };

    this.priceHistory.push(priceEntry);
    this.savePriceHistory();

    return priceEntry;
  }

  createPurchase(purchaseData) {
    const purchase = {
      id: 'purchase_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      supplierId: purchaseData.supplierId,
      items: purchaseData.items, // [{ productId, quantity, unitPrice }]
      totalAmount: purchaseData.totalAmount,
      purchaseDate: purchaseData.purchaseDate || new Date().toISOString(),
      expectedDeliveryDate: purchaseData.expectedDeliveryDate,
      actualDeliveryDate: purchaseData.actualDeliveryDate || null,
      status: purchaseData.status || 'pending',
      notes: purchaseData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.purchases.push(purchase);
    this.savePurchases();

    // Si la compra está confirmada, agregar stock
    if (purchase.status === 'confirmed') {
      purchase.items.forEach((item) => {
        this.addStock(item.productId, item.quantity, `Compra ${purchase.id}`);
      });
    }

    console.log('✅ Compra creada:', purchase.id);
    return purchase;
  }

  createSale(saleData) {
    const sale = {
      id: 'sale_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      customerId: saleData.customerId,
      items: saleData.items, // [{ productId, quantity, unitPrice }]
      totalAmount: saleData.totalAmount,
      saleDate: saleData.saleDate || new Date().toISOString(),
      status: saleData.status || 'completed',
      notes: saleData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser(),
      },
    };

    this.sales.push(sale);
    this.saveSales();

    // Remover stock de los productos vendidos
    sale.items.forEach((item) => {
      this.removeStock(item.productId, item.quantity, `Venta ${sale.id}`);
    });

    console.log('✅ Venta creada:', sale.id);
    return sale;
  }

  checkLowStock() {
    const lowStockProducts = this.products.filter((p) => p.isActive && p.currentStock <= p.minStock);

    lowStockProducts.forEach((product) => {
      const existingAlert = this.lowStockAlerts.find((a) => a.productId === product.id && a.status === 'active');

      if (!existingAlert) {
        const alert = {
          id: 'alert_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          productId: product.id,
          productName: product.name,
          currentStock: product.currentStock,
          minStock: product.minStock,
          status: 'active',
          createdAt: new Date().toISOString(),
          createdBy: this.getCurrentUser(),
        };

        this.lowStockAlerts.push(alert);
        this.saveLowStockAlerts();

        // Enviar notificación
        if (window.axyraNotificationSystem) {
          window.axyraNotificationSystem.warning(
            'Stock Bajo',
            `El producto ${product.name} tiene stock bajo (${product.currentStock}/${product.minStock})`
          );
        }
      }
    });

    console.log('🔍 Verificación de stock bajo completada');
  }

  getProducts(filters = {}) {
    let filteredProducts = [...this.products];

    if (filters.categoryId) {
      filteredProducts = filteredProducts.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.supplierId) {
      filteredProducts = filteredProducts.filter((p) => p.supplierId === filters.supplierId);
    }

    if (filters.lowStock) {
      filteredProducts = filteredProducts.filter((p) => p.currentStock <= p.minStock);
    }

    if (filters.outOfStock) {
      filteredProducts = filteredProducts.filter((p) => p.currentStock === 0);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm) ||
          p.sku.toLowerCase().includes(searchTerm) ||
          p.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredProducts;
  }

  getInventoryStatistics() {
    const totalProducts = this.products.length;
    const activeProducts = this.products.filter((p) => p.isActive).length;
    const outOfStockProducts = this.products.filter((p) => p.currentStock === 0).length;
    const lowStockProducts = this.products.filter((p) => p.currentStock <= p.minStock).length;

    const totalStockValue = this.products.reduce((sum, p) => sum + p.currentStock * p.costPrice, 0);
    const totalSalesValue = this.sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalPurchaseValue = this.purchases.reduce((sum, p) => sum + p.totalAmount, 0);

    const categoryStats = {};
    this.products.forEach((product) => {
      const category = this.categories.find((c) => c.id === product.categoryId);
      if (category) {
        categoryStats[category.name] = (categoryStats[category.name] || 0) + 1;
      }
    });

    return {
      totalProducts,
      activeProducts,
      outOfStockProducts,
      lowStockProducts,
      totalStockValue,
      totalSalesValue,
      totalPurchaseValue,
      categoryStats,
    };
  }

  generateSKU() {
    const prefix = 'SKU';
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 4);
    return `${prefix}-${timestamp}-${random}`.toUpperCase();
  }

  showInventoryDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'inventory-dashboard';
    dashboard.innerHTML = `
      <div class="inventory-dashboard-overlay">
        <div class="inventory-dashboard-container">
          <div class="inventory-dashboard-header">
            <h3>📦 Dashboard de Inventario</h3>
            <div class="inventory-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraInventoryManagementSystem.showCreateProductDialog()">Nuevo Producto</button>
              <button class="btn btn-secondary" onclick="axyraInventoryManagementSystem.showCreateCategoryDialog()">Nueva Categoría</button>
              <button class="btn btn-close" onclick="document.getElementById('inventory-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="inventory-dashboard-body">
            <div class="inventory-dashboard-stats">
              ${this.renderInventoryStats()}
            </div>
            <div class="inventory-dashboard-content">
              <div class="inventory-dashboard-tabs">
                <button class="tab-btn active" data-tab="products">Productos</button>
                <button class="tab-btn" data-tab="categories">Categorías</button>
                <button class="tab-btn" data-tab="suppliers">Proveedores</button>
                <button class="tab-btn" data-tab="movements">Movimientos</button>
                <button class="tab-btn" data-tab="alerts">Alertas</button>
              </div>
              <div class="inventory-dashboard-tab-content">
                <div class="tab-content active" id="products-tab">
                  ${this.renderProductsList()}
                </div>
                <div class="tab-content" id="categories-tab">
                  ${this.renderCategoriesList()}
                </div>
                <div class="tab-content" id="suppliers-tab">
                  ${this.renderSuppliersList()}
                </div>
                <div class="tab-content" id="movements-tab">
                  ${this.renderMovementsList()}
                </div>
                <div class="tab-content" id="alerts-tab">
                  ${this.renderAlertsList()}
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

  renderInventoryStats() {
    const stats = this.getInventoryStatistics();

    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${stats.totalProducts}</div>
          <div class="stat-label">Total Productos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.activeProducts}</div>
          <div class="stat-label">Productos Activos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.outOfStockProducts}</div>
          <div class="stat-label">Sin Stock</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.lowStockProducts}</div>
          <div class="stat-label">Stock Bajo</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${stats.totalStockValue.toLocaleString()}</div>
          <div class="stat-label">Valor del Stock</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${stats.totalSalesValue.toLocaleString()}</div>
          <div class="stat-label">Ventas Totales</div>
        </div>
      </div>
    `;
  }

  renderProductsList() {
    const products = this.getProducts();

    return products
      .map(
        (product) => `
      <div class="product-card">
        <div class="product-header">
          <h4>${product.name}</h4>
          <span class="product-sku">${product.sku}</span>
        </div>
        <div class="product-info">
          <p>Stock: ${product.currentStock} ${product.unit}</p>
          <p>Precio: $${product.sellingPrice}</p>
          <p>Costo: $${product.costPrice}</p>
        </div>
        <div class="product-actions">
          <button onclick="axyraInventoryManagementSystem.showProductDetails('${product.id}')">Ver</button>
          <button onclick="axyraInventoryManagementSystem.editProduct('${product.id}')">Editar</button>
          <button onclick="axyraInventoryManagementSystem.adjustStockDialog('${product.id}')">Ajustar Stock</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderCategoriesList() {
    const categories = this.categories;

    return categories
      .map(
        (category) => `
      <div class="category-card">
        <div class="category-header">
          <h4>${category.name}</h4>
        </div>
        <div class="category-description">${category.description}</div>
        <div class="category-actions">
          <button onclick="axyraInventoryManagementSystem.showCategoryDetails('${category.id}')">Ver</button>
          <button onclick="axyraInventoryManagementSystem.editCategory('${category.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderSuppliersList() {
    const suppliers = this.suppliers;

    return suppliers
      .map(
        (supplier) => `
      <div class="supplier-card">
        <div class="supplier-header">
          <h4>${supplier.name}</h4>
        </div>
        <div class="supplier-info">
          <p>${supplier.email}</p>
          <p>${supplier.phone}</p>
          <p>${supplier.contactPerson}</p>
        </div>
        <div class="supplier-actions">
          <button onclick="axyraInventoryManagementSystem.showSupplierDetails('${supplier.id}')">Ver</button>
          <button onclick="axyraInventoryManagementSystem.editSupplier('${supplier.id}')">Editar</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderMovementsList() {
    const movements = this.stockMovements.slice(-20); // Últimos 20 movimientos

    return movements
      .map(
        (movement) => `
      <div class="movement-card">
        <div class="movement-header">
          <h5>${movement.type.toUpperCase()}</h5>
          <span class="movement-date">${new Date(movement.date).toLocaleString()}</span>
        </div>
        <div class="movement-info">
          <p>Cantidad: ${movement.quantity}</p>
          <p>Razón: ${movement.reason}</p>
        </div>
      </div>
    `
      )
      .join('');
  }

  renderAlertsList() {
    const activeAlerts = this.lowStockAlerts.filter((a) => a.status === 'active');

    return activeAlerts
      .map(
        (alert) => `
      <div class="alert-card">
        <div class="alert-header">
          <h5>⚠️ Stock Bajo</h5>
          <span class="alert-date">${new Date(alert.createdAt).toLocaleString()}</span>
        </div>
        <div class="alert-info">
          <p>Producto: ${alert.productName}</p>
          <p>Stock actual: ${alert.currentStock}</p>
          <p>Stock mínimo: ${alert.minStock}</p>
        </div>
        <div class="alert-actions">
          <button onclick="axyraInventoryManagementSystem.resolveAlert('${alert.id}')">Resolver</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  showCreateProductDialog() {
    const name = prompt('Nombre del producto:');
    if (name) {
      const sku = prompt('SKU del producto:');
      const costPrice = parseFloat(prompt('Precio de costo:'));
      const sellingPrice = parseFloat(prompt('Precio de venta:'));
      const minStock = parseInt(prompt('Stock mínimo:'));
      this.createProduct({ name, sku, costPrice, sellingPrice, minStock });
    }
  }

  showCreateCategoryDialog() {
    const name = prompt('Nombre de la categoría:');
    if (name) {
      const description = prompt('Descripción de la categoría:');
      this.createCategory({ name, description });
    }
  }

  showProductDetails(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      alert(
        `Producto: ${product.name}\nSKU: ${product.sku}\nStock: ${product.currentStock} ${product.unit}\nPrecio: $${product.sellingPrice}\nCosto: $${product.costPrice}`
      );
    }
  }

  editProduct(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      const newPrice = parseFloat(prompt('Nuevo precio de venta:', product.sellingPrice));
      if (newPrice) {
        this.updateProduct(productId, { sellingPrice: newPrice });
      }
    }
  }

  adjustStockDialog(productId) {
    const product = this.products.find((p) => p.id === productId);
    if (product) {
      const newStock = parseInt(prompt('Nuevo stock:', product.currentStock));
      if (newStock !== null) {
        this.adjustStock(productId, newStock, 'Ajuste manual');
      }
    }
  }

  showCategoryDetails(categoryId) {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) {
      alert(`Categoría: ${category.name}\nDescripción: ${category.description}`);
    }
  }

  editCategory(categoryId) {
    const category = this.categories.find((c) => c.id === categoryId);
    if (category) {
      const newName = prompt('Nuevo nombre:', category.name);
      if (newName) {
        category.name = newName;
        this.saveCategories();
      }
    }
  }

  showSupplierDetails(supplierId) {
    const supplier = this.suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      alert(
        `Proveedor: ${supplier.name}\nEmail: ${supplier.email}\nTeléfono: ${supplier.phone}\nContacto: ${supplier.contactPerson}`
      );
    }
  }

  editSupplier(supplierId) {
    const supplier = this.suppliers.find((s) => s.id === supplierId);
    if (supplier) {
      const newName = prompt('Nuevo nombre:', supplier.name);
      if (newName) {
        supplier.name = newName;
        this.saveSuppliers();
      }
    }
  }

  resolveAlert(alertId) {
    const alert = this.lowStockAlerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      this.saveLowStockAlerts();
      console.log('✅ Alerta resuelta:', alert.productName);
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

// Inicializar sistema de inventario
let axyraInventoryManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraInventoryManagementSystem = new AxyraInventoryManagementSystem();
  window.axyraInventoryManagementSystem = axyraInventoryManagementSystem;
});

// Exportar para uso global
window.AxyraInventoryManagementSystem = AxyraInventoryManagementSystem;

