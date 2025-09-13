/**
 * AXYRA - Sistema de Gestión Financiera y Contabilidad
 * Maneja cuentas, transacciones, presupuestos, facturación y reportes financieros
 */

class AxyraFinancialManagementSystem {
  constructor() {
    this.accounts = [];
    this.transactions = [];
    this.budgets = [];
    this.invoices = [];
    this.payments = [];
    this.expenses = [];
    this.revenues = [];
    this.taxRates = [];
    this.fiscalPeriods = [];
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    console.log('💰 Inicializando sistema de gestión financiera...');
    this.loadAccounts();
    this.loadTransactions();
    this.loadBudgets();
    this.loadInvoices();
    this.loadPayments();
    this.loadExpenses();
    this.loadRevenues();
    this.loadTaxRates();
    this.loadFiscalPeriods();
    this.setupEventListeners();
    this.setupDefaultAccounts();
    this.setupDefaultTaxRates();
    this.isInitialized = true;
  }

  loadAccounts() {
    try {
      const stored = localStorage.getItem('axyra_financial_accounts');
      if (stored) {
        this.accounts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando cuentas:', error);
    }
  }

  saveAccounts() {
    try {
      localStorage.setItem('axyra_financial_accounts', JSON.stringify(this.accounts));
    } catch (error) {
      console.error('Error guardando cuentas:', error);
    }
  }

  loadTransactions() {
    try {
      const stored = localStorage.getItem('axyra_financial_transactions');
      if (stored) {
        this.transactions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando transacciones:', error);
    }
  }

  saveTransactions() {
    try {
      localStorage.setItem('axyra_financial_transactions', JSON.stringify(this.transactions));
    } catch (error) {
      console.error('Error guardando transacciones:', error);
    }
  }

  loadBudgets() {
    try {
      const stored = localStorage.getItem('axyra_financial_budgets');
      if (stored) {
        this.budgets = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando presupuestos:', error);
    }
  }

  saveBudgets() {
    try {
      localStorage.setItem('axyra_financial_budgets', JSON.stringify(this.budgets));
    } catch (error) {
      console.error('Error guardando presupuestos:', error);
    }
  }

  loadInvoices() {
    try {
      const stored = localStorage.getItem('axyra_financial_invoices');
      if (stored) {
        this.invoices = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando facturas:', error);
    }
  }

  saveInvoices() {
    try {
      localStorage.setItem('axyra_financial_invoices', JSON.stringify(this.invoices));
    } catch (error) {
      console.error('Error guardando facturas:', error);
    }
  }

  loadPayments() {
    try {
      const stored = localStorage.getItem('axyra_financial_payments');
      if (stored) {
        this.payments = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando pagos:', error);
    }
  }

  savePayments() {
    try {
      localStorage.setItem('axyra_financial_payments', JSON.stringify(this.payments));
    } catch (error) {
      console.error('Error guardando pagos:', error);
    }
  }

  loadExpenses() {
    try {
      const stored = localStorage.getItem('axyra_financial_expenses');
      if (stored) {
        this.expenses = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando gastos:', error);
    }
  }

  saveExpenses() {
    try {
      localStorage.setItem('axyra_financial_expenses', JSON.stringify(this.expenses));
    } catch (error) {
      console.error('Error guardando gastos:', error);
    }
  }

  loadRevenues() {
    try {
      const stored = localStorage.getItem('axyra_financial_revenues');
      if (stored) {
        this.revenues = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando ingresos:', error);
    }
  }

  saveRevenues() {
    try {
      localStorage.setItem('axyra_financial_revenues', JSON.stringify(this.revenues));
    } catch (error) {
      console.error('Error guardando ingresos:', error);
    }
  }

  loadTaxRates() {
    try {
      const stored = localStorage.getItem('axyra_financial_tax_rates');
      if (stored) {
        this.taxRates = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando tasas de impuestos:', error);
    }
  }

  saveTaxRates() {
    try {
      localStorage.setItem('axyra_financial_tax_rates', JSON.stringify(this.taxRates));
    } catch (error) {
      console.error('Error guardando tasas de impuestos:', error);
    }
  }

  loadFiscalPeriods() {
    try {
      const stored = localStorage.getItem('axyra_financial_fiscal_periods');
      if (stored) {
        this.fiscalPeriods = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando períodos fiscales:', error);
    }
  }

  saveFiscalPeriods() {
    try {
      localStorage.setItem('axyra_financial_fiscal_periods', JSON.stringify(this.fiscalPeriods));
    } catch (error) {
      console.error('Error guardando períodos fiscales:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en transacciones
    document.addEventListener('transactionChanged', (event) => {
      this.handleTransactionChange(event.detail);
    });

    // Escuchar cambios en presupuestos
    document.addEventListener('budgetChanged', (event) => {
      this.handleBudgetChange(event.detail);
    });
  }

  setupDefaultAccounts() {
    if (this.accounts.length === 0) {
      this.accounts = [
        {
          id: 'cash',
          name: 'Efectivo',
          type: 'asset',
          category: 'current_asset',
          code: '1000',
          balance: 0,
          isActive: true
        },
        {
          id: 'bank',
          name: 'Cuenta Bancaria',
          type: 'asset',
          category: 'current_asset',
          code: '1100',
          balance: 0,
          isActive: true
        },
        {
          id: 'accounts_receivable',
          name: 'Cuentas por Cobrar',
          type: 'asset',
          category: 'current_asset',
          code: '1200',
          balance: 0,
          isActive: true
        },
        {
          id: 'inventory',
          name: 'Inventario',
          type: 'asset',
          category: 'current_asset',
          code: '1300',
          balance: 0,
          isActive: true
        },
        {
          id: 'accounts_payable',
          name: 'Cuentas por Pagar',
          type: 'liability',
          category: 'current_liability',
          code: '2000',
          balance: 0,
          isActive: true
        },
        {
          id: 'sales_revenue',
          name: 'Ingresos por Ventas',
          type: 'revenue',
          category: 'operating_revenue',
          code: '4000',
          balance: 0,
          isActive: true
        },
        {
          id: 'cost_of_goods_sold',
          name: 'Costo de Ventas',
          type: 'expense',
          category: 'operating_expense',
          code: '5000',
          balance: 0,
          isActive: true
        },
        {
          id: 'operating_expenses',
          name: 'Gastos Operativos',
          type: 'expense',
          category: 'operating_expense',
          code: '6000',
          balance: 0,
          isActive: true
        }
      ];
      
      this.saveAccounts();
    }
  }

  setupDefaultTaxRates() {
    if (this.taxRates.length === 0) {
      this.taxRates = [
        {
          id: 'iva_19',
          name: 'IVA 19%',
          rate: 19,
          type: 'vat',
          isActive: true
        },
        {
          id: 'rete_fuente',
          name: 'Retención en la Fuente',
          rate: 3.5,
          type: 'withholding',
          isActive: true
        },
        {
          id: 'rete_ica',
          name: 'Retención ICA',
          rate: 1,
          type: 'withholding',
          isActive: true
        }
      ];
      
      this.saveTaxRates();
    }
  }

  handleTransactionChange(change) {
    const { transactionId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.transactions.push(data);
        this.saveTransactions();
        this.updateAccountBalances(data);
        break;
      case 'updated':
        const transactionIndex = this.transactions.findIndex(t => t.id === transactionId);
        if (transactionIndex !== -1) {
          this.transactions[transactionIndex] = { ...this.transactions[transactionIndex], ...data };
          this.saveTransactions();
        }
        break;
      case 'deleted':
        this.transactions = this.transactions.filter(t => t.id !== transactionId);
        this.saveTransactions();
        break;
    }
  }

  handleBudgetChange(change) {
    const { budgetId, action, data } = change;
    
    switch (action) {
      case 'created':
        this.budgets.push(data);
        this.saveBudgets();
        break;
      case 'updated':
        const budgetIndex = this.budgets.findIndex(b => b.id === budgetId);
        if (budgetIndex !== -1) {
          this.budgets[budgetIndex] = { ...this.budgets[budgetIndex], ...data };
          this.saveBudgets();
        }
        break;
      case 'deleted':
        this.budgets = this.budgets.filter(b => b.id !== budgetId);
        this.saveBudgets();
        break;
    }
  }

  createAccount(accountData) {
    const account = {
      id: 'account_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: accountData.name,
      type: accountData.type, // asset, liability, equity, revenue, expense
      category: accountData.category,
      code: accountData.code,
      balance: accountData.balance || 0,
      parentId: accountData.parentId || null,
      isActive: accountData.isActive !== false,
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.accounts.push(account);
    this.saveAccounts();

    console.log('✅ Cuenta creada:', account.name);
    return account;
  }

  createTransaction(transactionData) {
    const transaction = {
      id: 'transaction_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      date: transactionData.date || new Date().toISOString(),
      description: transactionData.description,
      type: transactionData.type, // debit, credit
      amount: transactionData.amount,
      debitAccountId: transactionData.debitAccountId,
      creditAccountId: transactionData.creditAccountId,
      reference: transactionData.reference || '',
      category: transactionData.category || '',
      tags: transactionData.tags || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.transactions.push(transaction);
    this.saveTransactions();
    this.updateAccountBalances(transaction);

    console.log('✅ Transacción creada:', transaction.description);
    return transaction;
  }

  updateAccountBalances(transaction) {
    // Actualizar saldo de cuenta de débito
    if (transaction.debitAccountId) {
      const debitAccount = this.accounts.find(a => a.id === transaction.debitAccountId);
      if (debitAccount) {
        if (debitAccount.type === 'asset' || debitAccount.type === 'expense') {
          debitAccount.balance += transaction.amount;
        } else {
          debitAccount.balance -= transaction.amount;
        }
      }
    }

    // Actualizar saldo de cuenta de crédito
    if (transaction.creditAccountId) {
      const creditAccount = this.accounts.find(a => a.id === transaction.creditAccountId);
      if (creditAccount) {
        if (creditAccount.type === 'liability' || creditAccount.type === 'equity' || creditAccount.type === 'revenue') {
          creditAccount.balance += transaction.amount;
        } else {
          creditAccount.balance -= transaction.amount;
        }
      }
    }

    this.saveAccounts();
  }

  createBudget(budgetData) {
    const budget = {
      id: 'budget_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: budgetData.name,
      description: budgetData.description || '',
      period: budgetData.period, // monthly, quarterly, yearly
      startDate: budgetData.startDate,
      endDate: budgetData.endDate,
      categories: budgetData.categories || [], // [{ accountId, budgetedAmount, actualAmount }]
      totalBudgeted: budgetData.totalBudgeted || 0,
      totalActual: budgetData.totalActual || 0,
      status: budgetData.status || 'draft',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.budgets.push(budget);
    this.saveBudgets();

    console.log('✅ Presupuesto creado:', budget.name);
    return budget;
  }

  createInvoice(invoiceData) {
    const invoice = {
      id: 'invoice_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      number: invoiceData.number || this.generateInvoiceNumber(),
      customerId: invoiceData.customerId,
      customerName: invoiceData.customerName,
      customerEmail: invoiceData.customerEmail,
      items: invoiceData.items || [], // [{ description, quantity, unitPrice, total }]
      subtotal: invoiceData.subtotal || 0,
      taxAmount: invoiceData.taxAmount || 0,
      total: invoiceData.total || 0,
      issueDate: invoiceData.issueDate || new Date().toISOString(),
      dueDate: invoiceData.dueDate,
      status: invoiceData.status || 'draft', // draft, sent, paid, overdue, cancelled
      paymentTerms: invoiceData.paymentTerms || '30',
      notes: invoiceData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentUser()
      }
    };

    this.invoices.push(invoice);
    this.saveInvoices();

    console.log('✅ Factura creada:', invoice.number);
    return invoice;
  }

  createPayment(paymentData) {
    const payment = {
      id: 'payment_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      invoiceId: paymentData.invoiceId,
      amount: paymentData.amount,
      paymentDate: paymentData.paymentDate || new Date().toISOString(),
      method: paymentData.method, // cash, bank_transfer, check, credit_card
      reference: paymentData.reference || '',
      notes: paymentData.notes || '',
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser()
      }
    };

    this.payments.push(payment);
    this.savePayments();

    // Actualizar estado de la factura
    this.updateInvoiceStatus(paymentData.invoiceId);

    console.log('✅ Pago registrado:', payment.amount);
    return payment;
  }

  updateInvoiceStatus(invoiceId) {
    const invoice = this.invoices.find(i => i.id === invoiceId);
    if (invoice) {
      const totalPayments = this.payments
        .filter(p => p.invoiceId === invoiceId)
        .reduce((sum, p) => sum + p.amount, 0);

      if (totalPayments >= invoice.total) {
        invoice.status = 'paid';
      } else if (totalPayments > 0) {
        invoice.status = 'partial';
      } else if (new Date(invoice.dueDate) < new Date()) {
        invoice.status = 'overdue';
      }

      this.saveInvoices();
    }
  }

  createExpense(expenseData) {
    const expense = {
      id: 'expense_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      description: expenseData.description,
      amount: expenseData.amount,
      category: expenseData.category,
      accountId: expenseData.accountId,
      vendor: expenseData.vendor || '',
      date: expenseData.date || new Date().toISOString(),
      receipt: expenseData.receipt || '',
      tags: expenseData.tags || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser()
      }
    };

    this.expenses.push(expense);
    this.saveExpenses();

    // Crear transacción automática
    this.createTransaction({
      description: expense.description,
      amount: expense.amount,
      debitAccountId: expense.accountId,
      creditAccountId: 'cash',
      category: 'expense'
    });

    console.log('✅ Gasto registrado:', expense.description);
    return expense;
  }

  createRevenue(revenueData) {
    const revenue = {
      id: 'revenue_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      description: revenueData.description,
      amount: revenueData.amount,
      category: revenueData.category,
      accountId: revenueData.accountId,
      customer: revenueData.customer || '',
      date: revenueData.date || new Date().toISOString(),
      invoiceId: revenueData.invoiceId || null,
      tags: revenueData.tags || [],
      metadata: {
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser()
      }
    };

    this.revenues.push(revenue);
    this.saveRevenues();

    // Crear transacción automática
    this.createTransaction({
      description: revenue.description,
      amount: revenue.amount,
      debitAccountId: 'cash',
      creditAccountId: revenue.accountId,
      category: 'revenue'
    });

    console.log('✅ Ingreso registrado:', revenue.description);
    return revenue;
  }

  generateInvoiceNumber() {
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const count = this.invoices.filter(i => i.number.startsWith(`INV-${year}${month}`)).length + 1;
    return `INV-${year}${month}-${String(count).padStart(4, '0')}`;
  }

  getFinancialReports(filters = {}) {
    const startDate = filters.startDate || new Date(new Date().getFullYear(), 0, 1).toISOString();
    const endDate = filters.endDate || new Date().toISOString();

    const filteredTransactions = this.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );

    const filteredExpenses = this.expenses.filter(e => 
      e.date >= startDate && e.date <= endDate
    );

    const filteredRevenues = this.revenues.filter(r => 
      r.date >= startDate && r.date <= endDate
    );

    const totalRevenue = filteredRevenues.reduce((sum, r) => sum + r.amount, 0);
    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netIncome = totalRevenue - totalExpenses;

    const accountBalances = this.accounts.map(account => ({
      ...account,
      currentBalance: account.balance
    }));

    return {
      period: { startDate, endDate },
      revenue: totalRevenue,
      expenses: totalExpenses,
      netIncome,
      accountBalances,
      transactionCount: filteredTransactions.length,
      expenseCount: filteredExpenses.length,
      revenueCount: filteredRevenues.length
    };
  }

  getBudgetPerformance(budgetId) {
    const budget = this.budgets.find(b => b.id === budgetId);
    if (!budget) return null;

    const actualAmounts = budget.categories.map(category => {
      const account = this.accounts.find(a => a.id === category.accountId);
      return {
        ...category,
        actualAmount: account ? account.balance : 0,
        variance: category.budgetedAmount - (account ? account.balance : 0),
        variancePercentage: category.budgetedAmount > 0 ? 
          ((category.budgetedAmount - (account ? account.balance : 0)) / category.budgetedAmount) * 100 : 0
      };
    });

    return {
      budget,
      categories: actualAmounts,
      totalBudgeted: budget.totalBudgeted,
      totalActual: actualAmounts.reduce((sum, c) => sum + c.actualAmount, 0),
      totalVariance: budget.totalBudgeted - actualAmounts.reduce((sum, c) => sum + c.actualAmount, 0)
    };
  }

  getCashFlow(startDate, endDate) {
    const transactions = this.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );

    const cashInflows = transactions
      .filter(t => t.creditAccountId === 'cash')
      .reduce((sum, t) => sum + t.amount, 0);

    const cashOutflows = transactions
      .filter(t => t.debitAccountId === 'cash')
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      inflows: cashInflows,
      outflows: cashOutflows,
      netCashFlow: cashInflows - cashOutflows
    };
  }

  showFinancialDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'financial-dashboard';
    dashboard.innerHTML = `
      <div class="financial-dashboard-overlay">
        <div class="financial-dashboard-container">
          <div class="financial-dashboard-header">
            <h3>💰 Dashboard Financiero</h3>
            <div class="financial-dashboard-actions">
              <button class="btn btn-primary" onclick="axyraFinancialManagementSystem.showCreateTransactionDialog()">Nueva Transacción</button>
              <button class="btn btn-secondary" onclick="axyraFinancialManagementSystem.showCreateInvoiceDialog()">Nueva Factura</button>
              <button class="btn btn-close" onclick="document.getElementById('financial-dashboard').remove()">×</button>
            </div>
          </div>
          <div class="financial-dashboard-body">
            <div class="financial-dashboard-stats">
              ${this.renderFinancialStats()}
            </div>
            <div class="financial-dashboard-content">
              <div class="financial-dashboard-tabs">
                <button class="tab-btn active" data-tab="overview">Resumen</button>
                <button class="tab-btn" data-tab="transactions">Transacciones</button>
                <button class="tab-btn" data-tab="invoices">Facturas</button>
                <button class="tab-btn" data-tab="budgets">Presupuestos</button>
                <button class="tab-btn" data-tab="reports">Reportes</button>
              </div>
              <div class="financial-dashboard-tab-content">
                <div class="tab-content active" id="overview-tab">
                  ${this.renderOverview()}
                </div>
                <div class="tab-content" id="transactions-tab">
                  ${this.renderTransactionsList()}
                </div>
                <div class="tab-content" id="invoices-tab">
                  ${this.renderInvoicesList()}
                </div>
                <div class="tab-content" id="budgets-tab">
                  ${this.renderBudgetsList()}
                </div>
                <div class="tab-content" id="reports-tab">
                  ${this.renderReports()}
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

  renderFinancialStats() {
    const reports = this.getFinancialReports();
    
    return `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">$${reports.revenue.toLocaleString()}</div>
          <div class="stat-label">Ingresos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${reports.expenses.toLocaleString()}</div>
          <div class="stat-label">Gastos</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">$${reports.netIncome.toLocaleString()}</div>
          <div class="stat-label">Ingreso Neto</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${reports.transactionCount}</div>
          <div class="stat-label">Transacciones</div>
        </div>
      </div>
    `;
  }

  renderOverview() {
    const reports = this.getFinancialReports();
    const cashFlow = this.getCashFlow(reports.period.startDate, reports.period.endDate);
    
    return `
      <div class="overview-grid">
        <div class="overview-card">
          <h4>Estado de Cuentas</h4>
          <div class="account-list">
            ${reports.accountBalances.map(account => `
              <div class="account-item">
                <span class="account-name">${account.name}</span>
                <span class="account-balance">$${account.currentBalance.toLocaleString()}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="overview-card">
          <h4>Flujo de Efectivo</h4>
          <div class="cash-flow">
            <div class="cash-flow-item">
              <span>Entradas</span>
              <span>$${cashFlow.inflows.toLocaleString()}</span>
            </div>
            <div class="cash-flow-item">
              <span>Salidas</span>
              <span>$${cashFlow.outflows.toLocaleString()}</span>
            </div>
            <div class="cash-flow-item total">
              <span>Flujo Neto</span>
              <span>$${cashFlow.netCashFlow.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderTransactionsList() {
    const transactions = this.transactions.slice(-20); // Últimas 20 transacciones
    
    return transactions.map(transaction => `
      <div class="transaction-card">
        <div class="transaction-header">
          <h5>${transaction.description}</h5>
          <span class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</span>
        </div>
        <div class="transaction-info">
          <p>Monto: $${transaction.amount.toLocaleString()}</p>
          <p>Referencia: ${transaction.reference}</p>
        </div>
      </div>
    `).join('');
  }

  renderInvoicesList() {
    const invoices = this.invoices.slice(-20); // Últimas 20 facturas
    
    return invoices.map(invoice => `
      <div class="invoice-card">
        <div class="invoice-header">
          <h5>${invoice.number}</h5>
          <span class="invoice-status status-${invoice.status}">${invoice.status}</span>
        </div>
        <div class="invoice-info">
          <p>Cliente: ${invoice.customerName}</p>
          <p>Total: $${invoice.total.toLocaleString()}</p>
          <p>Fecha: ${new Date(invoice.issueDate).toLocaleDateString()}</p>
        </div>
      </div>
    `).join('');
  }

  renderBudgetsList() {
    const budgets = this.budgets;
    
    return budgets.map(budget => `
      <div class="budget-card">
        <div class="budget-header">
          <h5>${budget.name}</h5>
          <span class="budget-status status-${budget.status}">${budget.status}</span>
        </div>
        <div class="budget-info">
          <p>Período: ${budget.period}</p>
          <p>Presupuestado: $${budget.totalBudgeted.toLocaleString()}</p>
          <p>Actual: $${budget.totalActual.toLocaleString()}</p>
        </div>
      </div>
    `).join('');
  }

  renderReports() {
    return `
      <div class="reports-grid">
        <div class="report-card">
          <h4>Estado de Resultados</h4>
          <button onclick="axyraFinancialManagementSystem.generateIncomeStatement()">Generar</button>
        </div>
        <div class="report-card">
          <h4>Balance General</h4>
          <button onclick="axyraFinancialManagementSystem.generateBalanceSheet()">Generar</button>
        </div>
        <div class="report-card">
          <h4>Flujo de Efectivo</h4>
          <button onclick="axyraFinancialManagementSystem.generateCashFlowStatement()">Generar</button>
        </div>
      </div>
    `;
  }

  showCreateTransactionDialog() {
    const description = prompt('Descripción de la transacción:');
    if (description) {
      const amount = parseFloat(prompt('Monto:'));
      const debitAccount = prompt('Cuenta de débito (ID):');
      const creditAccount = prompt('Cuenta de crédito (ID):');
      this.createTransaction({ description, amount, debitAccountId: debitAccount, creditAccountId: creditAccount });
    }
  }

  showCreateInvoiceDialog() {
    const customerName = prompt('Nombre del cliente:');
    if (customerName) {
      const total = parseFloat(prompt('Total de la factura:'));
      const customerEmail = prompt('Email del cliente:');
      this.createInvoice({ customerName, total, customerEmail });
    }
  }

  generateIncomeStatement() {
    const reports = this.getFinancialReports();
    alert(`Estado de Resultados\n\nIngresos: $${reports.revenue.toLocaleString()}\nGastos: $${reports.expenses.toLocaleString()}\nIngreso Neto: $${reports.netIncome.toLocaleString()}`);
  }

  generateBalanceSheet() {
    const reports = this.getFinancialReports();
    const assets = reports.accountBalances.filter(a => a.type === 'asset');
    const liabilities = reports.accountBalances.filter(a => a.type === 'liability');
    const equity = reports.accountBalances.filter(a => a.type === 'equity');
    
    alert(`Balance General\n\nActivos: $${assets.reduce((sum, a) => sum + a.currentBalance, 0).toLocaleString()}\nPasivos: $${liabilities.reduce((sum, l) => sum + l.currentBalance, 0).toLocaleString()}\nPatrimonio: $${equity.reduce((sum, e) => sum + e.currentBalance, 0).toLocaleString()}`);
  }

  generateCashFlowStatement() {
    const reports = this.getFinancialReports();
    const cashFlow = this.getCashFlow(reports.period.startDate, reports.period.endDate);
    
    alert(`Estado de Flujo de Efectivo\n\nEntradas: $${cashFlow.inflows.toLocaleString()}\nSalidas: $${cashFlow.outflows.toLocaleString()}\nFlujo Neto: $${cashFlow.netCashFlow.toLocaleString()}`);
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }
}

// Inicializar sistema financiero
let axyraFinancialManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraFinancialManagementSystem = new AxyraFinancialManagementSystem();
  window.axyraFinancialManagementSystem = axyraFinancialManagementSystem;
});

// Exportar para uso global
window.AxyraFinancialManagementSystem = AxyraFinancialManagementSystem;
