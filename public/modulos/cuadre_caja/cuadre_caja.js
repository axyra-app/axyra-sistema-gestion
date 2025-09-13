// ========================================
// SISTEMA COMPLETO DE CUADRE DE CAJA AXYRA
// ========================================

class AxyraCuadreCaja {
  constructor() {
    this.facturas = [];
    this.empleados = [];
    this.cuadres = [];
    this.usuarioActual = null;
    this.isInitialized = false;
    this.charts = {};
    this.filters = {
      fechaInicio: null,
      fechaFin: null,
      empleado: null,
      estado: null,
    };
    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Sistema de Cuadre de Caja AXYRA...');

      // Verificar autenticación
      await this.verificarAutenticacion();

      // Cargar datos
      await this.cargarDatos();

      // Configurar interfaz
      this.configurarInterfaz();

      // Configurar event listeners
      this.configurarEventListeners();

      // Inicializar gráficos
      this.inicializarGraficos();

      // Renderizar datos
      this.renderizarFacturas();
      this.actualizarEstadisticas();

      this.isInitialized = true;
      console.log('✅ Sistema de Cuadre de Caja inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando Cuadre de Caja:', error);
      this.mostrarNotificacion('Error inicializando el sistema de cuadre de caja', 'error');
    }
  }

  // ========================================
  // AUTENTICACIÓN Y DATOS
  // ========================================

  async verificarAutenticacion() {
    try {
      // Intentar obtener usuario de Firebase
      if (window.axyraFirebase?.auth?.currentUser) {
        this.usuarioActual = {
          id: window.axyraFirebase.auth.currentUser.uid,
          email: window.axyraFirebase.auth.currentUser.email,
          nombre: window.axyraFirebase.auth.currentUser.displayName || 'Usuario',
        };
        console.log('✅ Usuario autenticado en Firebase:', this.usuarioActual.email);
        return;
      }

      // Fallback a localStorage
      const usuario = localStorage.getItem('axyra_isolated_user') || localStorage.getItem('axyra_usuario_actual');
      if (usuario) {
        this.usuarioActual = JSON.parse(usuario);
        console.log('✅ Usuario cargado desde localStorage:', this.usuarioActual.nombre);
        return;
      }

      // Usuario temporal
      this.usuarioActual = {
        id: 'usuario_' + Date.now(),
        nombre: 'Usuario',
        email: 'usuario@axyra.com',
      };
      console.log('⚠️ Usando usuario temporal');
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      throw error;
    }
  }

  async cargarDatos() {
    try {
      // Cargar empleados
      await this.cargarEmpleados();

      // Cargar facturas
      await this.cargarFacturas();

      // Cargar cuadres
      await this.cargarCuadres();

      console.log(
        `✅ Datos cargados: ${this.empleados.length} empleados, ${this.facturas.length} facturas, ${this.cuadres.length} cuadres`
      );
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      throw error;
    }
  }

  async cargarEmpleados() {
    try {
      // Intentar cargar desde FirebaseSyncManager
      if (window.firebaseSyncManager) {
        this.empleados = await window.firebaseSyncManager.getEmpleados();
        return;
      }

      // Fallback a localStorage
      const empleadosData = localStorage.getItem('axyra_empleados');
      if (empleadosData) {
        this.empleados = JSON.parse(empleadosData);
        return;
      }

      // Datos de ejemplo
      this.empleados = [
        {
          id: 'emp_1',
          nombre: 'Juan Pérez',
          cargo: 'Vendedor',
          salario: 1500000,
          activo: true,
        },
        {
          id: 'emp_2',
          nombre: 'María García',
          cargo: 'Cajera',
          salario: 1200000,
          activo: true,
        },
      ];
    } catch (error) {
      console.error('❌ Error cargando empleados:', error);
      this.empleados = [];
    }
  }

  async cargarFacturas() {
    try {
      // Intentar cargar desde Firebase
      if (window.axyraFirebase?.firestore && this.usuarioActual) {
        const snapshot = await window.axyraFirebase.firestore
          .collection('facturas')
          .where('userId', '==', this.usuarioActual.id)
          .orderBy('fecha', 'desc')
          .get();

        this.facturas = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return;
      }

      // Fallback a localStorage
      const facturasData = localStorage.getItem('axyra_facturas');
      if (facturasData) {
        this.facturas = JSON.parse(facturasData);
        return;
      }

      // Datos de ejemplo
      this.facturas = [
        {
          id: 'fact_1',
          numero: 'F001',
          fecha: new Date().toISOString(),
          empleado: 'Juan Pérez',
          empleadoId: 'emp_1',
          valor: 50000,
          descripcion: 'Venta de productos',
          estado: 'pagada',
          userId: this.usuarioActual.id,
        },
      ];
    } catch (error) {
      console.error('❌ Error cargando facturas:', error);
      this.facturas = [];
    }
  }

  async cargarCuadres() {
    try {
      // Intentar cargar desde Firebase
      if (window.axyraFirebase?.firestore && this.usuarioActual) {
        const snapshot = await window.axyraFirebase.firestore
          .collection('cuadres_caja')
          .where('userId', '==', this.usuarioActual.id)
          .orderBy('fecha', 'desc')
          .get();

        this.cuadres = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return;
      }

      // Fallback a localStorage
      const cuadresData = localStorage.getItem('axyra_cuadres_caja');
      if (cuadresData) {
        this.cuadres = JSON.parse(cuadresData);
        return;
      }

      this.cuadres = [];
    } catch (error) {
      console.error('❌ Error cargando cuadres:', error);
      this.cuadres = [];
    }
  }

  // ========================================
  // CONFIGURACIÓN DE INTERFAZ
  // ========================================

  configurarInterfaz() {
    // Configurar fechas por defecto
    const hoy = new Date();
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    this.filters.fechaInicio = inicioMes.toISOString().split('T')[0];
    this.filters.fechaFin = hoy.toISOString().split('T')[0];

    // Actualizar inputs de fecha
    const fechaInicioInput = document.getElementById('fechaInicio');
    const fechaFinInput = document.getElementById('fechaFin');

    if (fechaInicioInput) fechaInicioInput.value = this.filters.fechaInicio;
    if (fechaFinInput) fechaFinInput.value = this.filters.fechaFin;

    // Configurar select de empleados
    this.configurarSelectEmpleados();
  }

  configurarSelectEmpleados() {
    const selectEmpleado = document.getElementById('filtroEmpleado');
    if (!selectEmpleado) return;

    selectEmpleado.innerHTML = '<option value="">Todos los empleados</option>';

    this.empleados.forEach((empleado) => {
      if (empleado.activo) {
        const option = document.createElement('option');
        option.value = empleado.id;
        option.textContent = empleado.nombre;
        selectEmpleado.appendChild(option);
      }
    });
  }

  configurarEventListeners() {
    // Botón agregar factura
    const btnAgregarFactura = document.getElementById('btnAgregarFactura');
    if (btnAgregarFactura) {
      btnAgregarFactura.addEventListener('click', () => this.mostrarModalAgregarFactura());
    }

    // Botón generar cuadre
    const btnGenerarCuadre = document.getElementById('btnGenerarCuadre');
    if (btnGenerarCuadre) {
      btnGenerarCuadre.addEventListener('click', () => this.generarCuadreCaja());
    }

    // Botón exportar
    const btnExportar = document.getElementById('btnExportar');
    if (btnExportar) {
      btnExportar.addEventListener('click', () => this.exportarDatos());
    }

    // Filtros
    const filtros = ['fechaInicio', 'fechaFin', 'filtroEmpleado', 'filtroEstado'];
    filtros.forEach((filtroId) => {
      const elemento = document.getElementById(filtroId);
      if (elemento) {
        elemento.addEventListener('change', () => this.aplicarFiltros());
      }
    });

    // Botón limpiar filtros
    const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
    if (btnLimpiarFiltros) {
      btnLimpiarFiltros.addEventListener('click', () => this.limpiarFiltros());
    }
  }

  // ========================================
  // GESTIÓN DE FACTURAS
  // ========================================

  mostrarModalAgregarFactura() {
    const modalHTML = `
      <div id="modalAgregarFactura" class="axyra-modal" style="display: flex;">
        <div class="axyra-modal-content">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-plus"></i> Agregar Factura
            </h3>
            <button class="axyra-modal-close" onclick="cerrarModalAgregarFactura()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <form id="formAgregarFactura">
              <div class="axyra-form-group">
                <label for="numeroFactura" class="axyra-form-label">Número de Factura:</label>
                <input type="text" id="numeroFactura" class="axyra-form-input" required>
              </div>
              <div class="axyra-form-group">
                <label for="fechaFactura" class="axyra-form-label">Fecha:</label>
                <input type="date" id="fechaFactura" class="axyra-form-input" required>
              </div>
              <div class="axyra-form-group">
                <label for="empleadoFactura" class="axyra-form-label">Empleado:</label>
                <select id="empleadoFactura" class="axyra-form-input" required>
                  <option value="">Seleccionar empleado</option>
                  ${this.empleados.map((emp) => `<option value="${emp.id}">${emp.nombre}</option>`).join('')}
                </select>
              </div>
              <div class="axyra-form-group">
                <label for="valorFactura" class="axyra-form-label">Valor:</label>
                <input type="number" id="valorFactura" class="axyra-form-input" min="0" step="100" required>
              </div>
              <div class="axyra-form-group">
                <label for="descripcionFactura" class="axyra-form-label">Descripción:</label>
                <textarea id="descripcionFactura" class="axyra-form-input" rows="3"></textarea>
              </div>
            </form>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="cerrarModalAgregarFactura()">
              Cancelar
            </button>
            <button class="axyra-btn axyra-btn-primary" onclick="axyraCuadreCaja.agregarFactura()">
              <i class="fas fa-save"></i> Guardar
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Configurar fecha por defecto
    const fechaInput = document.getElementById('fechaFactura');
    if (fechaInput) {
      fechaInput.value = new Date().toISOString().split('T')[0];
    }
  }

  async agregarFactura() {
    try {
      const form = document.getElementById('formAgregarFactura');
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const factura = {
        id: 'fact_' + Date.now(),
        numero: document.getElementById('numeroFactura').value,
        fecha: document.getElementById('fechaFactura').value,
        empleadoId: document.getElementById('empleadoFactura').value,
        empleado:
          this.empleados.find((emp) => emp.id === document.getElementById('empleadoFactura').value)?.nombre || '',
        valor: parseFloat(document.getElementById('valorFactura').value),
        descripcion: document.getElementById('descripcionFactura').value,
        estado: 'pendiente',
        userId: this.usuarioActual.id,
        fechaCreacion: new Date().toISOString(),
      };

      // Guardar en Firebase
      if (window.axyraFirebase?.firestore) {
        await window.axyraFirebase.firestore.collection('facturas').doc(factura.id).set(factura);
      }

      // Guardar en localStorage
      this.facturas.unshift(factura);
      localStorage.setItem('axyra_facturas', JSON.stringify(this.facturas));

      // Cerrar modal y actualizar
      this.cerrarModalAgregarFactura();
      this.renderizarFacturas();
      this.actualizarEstadisticas();
      this.actualizarGraficos();

      this.mostrarNotificacion('Factura agregada exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error agregando factura:', error);
      this.mostrarNotificacion('Error agregando factura', 'error');
    }
  }

  cerrarModalAgregarFactura() {
    const modal = document.getElementById('modalAgregarFactura');
    if (modal) {
      modal.remove();
    }
  }

  async editarFactura(facturaId) {
    const factura = this.facturas.find((f) => f.id === facturaId);
    if (!factura) return;

    // Implementar modal de edición similar al de agregar
    this.mostrarNotificacion('Función de edición en desarrollo', 'info');
  }

  async eliminarFactura(facturaId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta factura?')) return;

    try {
      // Eliminar de Firebase
      if (window.axyraFirebase?.firestore) {
        await window.axyraFirebase.firestore.collection('facturas').doc(facturaId).delete();
      }

      // Eliminar de localStorage
      this.facturas = this.facturas.filter((f) => f.id !== facturaId);
      localStorage.setItem('axyra_facturas', JSON.stringify(this.facturas));

      this.renderizarFacturas();
      this.actualizarEstadisticas();
      this.actualizarGraficos();

      this.mostrarNotificacion('Factura eliminada exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error eliminando factura:', error);
      this.mostrarNotificacion('Error eliminando factura', 'error');
    }
  }

  // ========================================
  // RENDERIZADO
  // ========================================

  renderizarFacturas() {
    const tbody = document.getElementById('facturasTableBody');
    if (!tbody) return;

    const facturasFiltradas = this.obtenerFacturasFiltradas();

    tbody.innerHTML = facturasFiltradas
      .map(
        (factura) => `
      <tr>
        <td>${factura.numero}</td>
        <td>${new Date(factura.fecha).toLocaleDateString()}</td>
        <td>${factura.empleado}</td>
        <td>$${factura.valor.toLocaleString()}</td>
        <td>${factura.descripcion || '-'}</td>
        <td>
          <span class="axyra-status axyra-status-${factura.estado}">
            ${this.getEstadoText(factura.estado)}
          </span>
        </td>
        <td>
          <div class="axyra-action-buttons">
            <button class="axyra-btn axyra-btn-sm axyra-btn-warning" onclick="axyraCuadreCaja.editarFactura('${
              factura.id
            }')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="axyra-btn axyra-btn-sm axyra-btn-danger" onclick="axyraCuadreCaja.eliminarFactura('${
              factura.id
            }')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `
      )
      .join('');
  }

  obtenerFacturasFiltradas() {
    let facturas = [...this.facturas];

    // Filtrar por fechas
    if (this.filters.fechaInicio) {
      facturas = facturas.filter((f) => f.fecha >= this.filters.fechaInicio);
    }
    if (this.filters.fechaFin) {
      facturas = facturas.filter((f) => f.fecha <= this.filters.fechaFin + 'T23:59:59');
    }

    // Filtrar por empleado
    if (this.filters.empleado) {
      facturas = facturas.filter((f) => f.empleadoId === this.filters.empleado);
    }

    // Filtrar por estado
    if (this.filters.estado) {
      facturas = facturas.filter((f) => f.estado === this.filters.estado);
    }

    return facturas;
  }

  actualizarEstadisticas() {
    const facturasFiltradas = this.obtenerFacturasFiltradas();

    // Calcular totales
    const totalIngresos = facturasFiltradas.reduce((sum, f) => sum + f.valor, 0);
    const facturasPagadas = facturasFiltradas.filter((f) => f.estado === 'pagada').length;
    const facturasPendientes = facturasFiltradas.filter((f) => f.estado === 'pendiente').length;

    // Actualizar elementos
    const totalIngresosEl = document.getElementById('totalIngresos');
    const facturasPagadasEl = document.getElementById('facturasPagadas');
    const facturasPendientesEl = document.getElementById('facturasPendientes');
    const totalFacturasEl = document.getElementById('totalFacturas');

    if (totalIngresosEl) totalIngresosEl.textContent = `$${totalIngresos.toLocaleString()}`;
    if (facturasPagadasEl) facturasPagadasEl.textContent = facturasPagadas;
    if (facturasPendientesEl) facturasPendientesEl.textContent = facturasPendientes;
    if (totalFacturasEl) totalFacturasEl.textContent = facturasFiltradas.length;
  }

  // ========================================
  // GRÁFICOS
  // ========================================

  inicializarGraficos() {
    this.actualizarGraficos();
  }

  actualizarGraficos() {
    this.actualizarGraficoIngresosMensuales();
    this.actualizarGraficoRendimientoEncargado();
    this.actualizarGraficoTendenciasDiarias();
  }

  actualizarGraficoIngresosMensuales() {
    const canvas = document.getElementById('ingresosMensualesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Destruir gráfico existente
    if (this.charts.ingresosMensuales) {
      this.charts.ingresosMensuales.destroy();
    }

    // Preparar datos
    const facturasFiltradas = this.obtenerFacturasFiltradas();
    const datosMensuales = this.agruparDatosPorMes(facturasFiltradas);

    this.charts.ingresosMensuales = new Chart(ctx, {
      type: 'line',
      data: {
        labels: datosMensuales.labels,
        datasets: [
          {
            label: 'Ingresos Mensuales',
            data: datosMensuales.valores,
            borderColor: '#667eea',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '$' + value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  actualizarGraficoRendimientoEncargado() {
    const canvas = document.getElementById('rendimientoEncargadoChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (this.charts.rendimientoEncargado) {
      this.charts.rendimientoEncargado.destroy();
    }

    const facturasFiltradas = this.obtenerFacturasFiltradas();
    const datosEmpleados = this.agruparDatosPorEmpleado(facturasFiltradas);

    this.charts.rendimientoEncargado = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: datosEmpleados.labels,
        datasets: [
          {
            data: datosEmpleados.valores,
            backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
        },
      },
    });
  }

  actualizarGraficoTendenciasDiarias() {
    const canvas = document.getElementById('tendenciasDiariasChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (this.charts.tendenciasDiarias) {
      this.charts.tendenciasDiarias.destroy();
    }

    const facturasFiltradas = this.obtenerFacturasFiltradas();
    const datosDiarios = this.agruparDatosPorDia(facturasFiltradas);

    this.charts.tendenciasDiarias = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: datosDiarios.labels,
        datasets: [
          {
            label: 'Ingresos Diarios',
            data: datosDiarios.valores,
            backgroundColor: '#667eea',
            borderColor: '#5a6fd8',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return '$' + value.toLocaleString();
              },
            },
          },
        },
      },
    });
  }

  // ========================================
  // UTILIDADES
  // ========================================

  agruparDatosPorMes(facturas) {
    const meses = {};

    facturas.forEach((factura) => {
      const fecha = new Date(factura.fecha);
      const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;

      if (!meses[mes]) {
        meses[mes] = 0;
      }
      meses[mes] += factura.valor;
    });

    const labels = Object.keys(meses).sort();
    const valores = labels.map((mes) => meses[mes]);

    return { labels, valores };
  }

  agruparDatosPorEmpleado(facturas) {
    const empleados = {};

    facturas.forEach((factura) => {
      if (!empleados[factura.empleado]) {
        empleados[factura.empleado] = 0;
      }
      empleados[factura.empleado] += factura.valor;
    });

    const labels = Object.keys(empleados);
    const valores = Object.values(empleados);

    return { labels, valores };
  }

  agruparDatosPorDia(facturas) {
    const dias = {};

    facturas.forEach((factura) => {
      const fecha = new Date(factura.fecha);
      const dia = fecha.toLocaleDateString();

      if (!dias[dia]) {
        dias[dia] = 0;
      }
      dias[dia] += factura.valor;
    });

    const labels = Object.keys(dias).sort((a, b) => new Date(a) - new Date(b));
    const valores = labels.map((dia) => dias[dia]);

    return { labels, valores };
  }

  getEstadoText(estado) {
    const estados = {
      pagada: 'Pagada',
      pendiente: 'Pendiente',
      cancelada: 'Cancelada',
    };
    return estados[estado] || estado;
  }

  // ========================================
  // FILTROS
  // ========================================

  aplicarFiltros() {
    // Obtener valores de los filtros
    const fechaInicio = document.getElementById('fechaInicio')?.value;
    const fechaFin = document.getElementById('fechaFin')?.value;
    const empleado = document.getElementById('filtroEmpleado')?.value;
    const estado = document.getElementById('filtroEstado')?.value;

    // Actualizar filtros
    this.filters.fechaInicio = fechaInicio;
    this.filters.fechaFin = fechaFin;
    this.filters.empleado = empleado;
    this.filters.estado = estado;

    // Re-renderizar
    this.renderizarFacturas();
    this.actualizarEstadisticas();
    this.actualizarGraficos();
  }

  limpiarFiltros() {
    // Limpiar inputs
    const fechaInicio = document.getElementById('fechaInicio');
    const fechaFin = document.getElementById('fechaFin');
    const empleado = document.getElementById('filtroEmpleado');
    const estado = document.getElementById('filtroEstado');

    if (fechaInicio) fechaInicio.value = '';
    if (fechaFin) fechaFin.value = '';
    if (empleado) empleado.value = '';
    if (estado) estado.value = '';

    // Limpiar filtros
    this.filters = {
      fechaInicio: null,
      fechaFin: null,
      empleado: null,
      estado: null,
    };

    // Re-renderizar
    this.renderizarFacturas();
    this.actualizarEstadisticas();
    this.actualizarGraficos();
  }

  // ========================================
  // CUADRE DE CAJA
  // ========================================

  async generarCuadreCaja() {
    try {
      const facturasFiltradas = this.obtenerFacturasFiltradas();

      if (facturasFiltradas.length === 0) {
        this.mostrarNotificacion('No hay facturas para generar cuadre', 'warning');
        return;
      }

      const cuadre = {
        id: 'cuadre_' + Date.now(),
        fecha: new Date().toISOString(),
        facturas: facturasFiltradas,
        totalIngresos: facturasFiltradas.reduce((sum, f) => sum + f.valor, 0),
        totalFacturas: facturasFiltradas.length,
        facturasPagadas: facturasFiltradas.filter((f) => f.estado === 'pagada').length,
        facturasPendientes: facturasFiltradas.filter((f) => f.estado === 'pendiente').length,
        userId: this.usuarioActual.id,
      };

      // Guardar en Firebase
      if (window.axyraFirebase?.firestore) {
        await window.axyraFirebase.firestore.collection('cuadres_caja').doc(cuadre.id).set(cuadre);
      }

      // Guardar en localStorage
      this.cuadres.unshift(cuadre);
      localStorage.setItem('axyra_cuadres_caja', JSON.stringify(this.cuadres));

      this.mostrarNotificacion('Cuadre de caja generado exitosamente', 'success');
      this.mostrarResumenCuadre(cuadre);
    } catch (error) {
      console.error('❌ Error generando cuadre:', error);
      this.mostrarNotificacion('Error generando cuadre de caja', 'error');
    }
  }

  mostrarResumenCuadre(cuadre) {
    const modalHTML = `
      <div id="modalResumenCuadre" class="axyra-modal" style="display: flex;">
        <div class="axyra-modal-content">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-calculator"></i> Resumen del Cuadre de Caja
            </h3>
            <button class="axyra-modal-close" onclick="cerrarModalResumenCuadre()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <div class="axyra-cuadre-resumen">
              <div class="axyra-cuadre-item">
                <span class="axyra-cuadre-label">Fecha:</span>
                <span class="axyra-cuadre-value">${new Date(cuadre.fecha).toLocaleDateString()}</span>
              </div>
              <div class="axyra-cuadre-item">
                <span class="axyra-cuadre-label">Total Facturas:</span>
                <span class="axyra-cuadre-value">${cuadre.totalFacturas}</span>
              </div>
              <div class="axyra-cuadre-item">
                <span class="axyra-cuadre-label">Facturas Pagadas:</span>
                <span class="axyra-cuadre-value">${cuadre.facturasPagadas}</span>
              </div>
              <div class="axyra-cuadre-item">
                <span class="axyra-cuadre-label">Facturas Pendientes:</span>
                <span class="axyra-cuadre-value">${cuadre.facturasPendientes}</span>
              </div>
              <div class="axyra-cuadre-item axyra-cuadre-total">
                <span class="axyra-cuadre-label">Total Ingresos:</span>
                <span class="axyra-cuadre-value">$${cuadre.totalIngresos.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="cerrarModalResumenCuadre()">
              Cerrar
            </button>
            <button class="axyra-btn axyra-btn-primary" onclick="axyraCuadreCaja.exportarCuadre('${cuadre.id}')">
              <i class="fas fa-download"></i> Exportar
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  cerrarModalResumenCuadre() {
    const modal = document.getElementById('modalResumenCuadre');
    if (modal) {
      modal.remove();
    }
  }

  // ========================================
  // EXPORTACIÓN
  // ========================================

  async exportarDatos() {
    try {
      const facturasFiltradas = this.obtenerFacturasFiltradas();

      if (facturasFiltradas.length === 0) {
        this.mostrarNotificacion('No hay datos para exportar', 'warning');
        return;
      }

      // Crear workbook
      const wb = XLSX.utils.book_new();

      // Preparar datos para Excel
      const datosExcel = facturasFiltradas.map((factura) => ({
        Número: factura.numero,
        Fecha: new Date(factura.fecha).toLocaleDateString(),
        Empleado: factura.empleado,
        Valor: factura.valor,
        Descripción: factura.descripcion || '',
        Estado: this.getEstadoText(factura.estado),
      }));

      // Crear hoja de trabajo
      const ws = XLSX.utils.json_to_sheet(datosExcel);
      XLSX.utils.book_append_sheet(wb, ws, 'Facturas');

      // Exportar archivo
      const nombreArchivo = `cuadre_caja_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      this.mostrarNotificacion('Datos exportados exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error exportando datos:', error);
      this.mostrarNotificacion('Error exportando datos', 'error');
    }
  }

  async exportarCuadre(cuadreId) {
    const cuadre = this.cuadres.find((c) => c.id === cuadreId);
    if (!cuadre) return;

    try {
      const wb = XLSX.utils.book_new();

      const datosExcel = cuadre.facturas.map((factura) => ({
        Número: factura.numero,
        Fecha: new Date(factura.fecha).toLocaleDateString(),
        Empleado: factura.empleado,
        Valor: factura.valor,
        Descripción: factura.descripcion || '',
        Estado: this.getEstadoText(factura.estado),
      }));

      const ws = XLSX.utils.json_to_sheet(datosExcel);
      XLSX.utils.book_append_sheet(wb, ws, 'Cuadre de Caja');

      const nombreArchivo = `cuadre_${cuadre.id}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      this.mostrarNotificacion('Cuadre exportado exitosamente', 'success');
    } catch (error) {
      console.error('❌ Error exportando cuadre:', error);
      this.mostrarNotificacion('Error exportando cuadre', 'error');
    }
  }

  // ========================================
  // NOTIFICACIONES
  // ========================================

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Usar sistema de notificaciones existente si está disponible
    if (window.axyraNotifications) {
      window.axyraNotifications.show(mensaje, tipo);
      return;
    }

    // Fallback a alert simple
    const iconos = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
    };

    console.log(`${iconos[tipo]} ${mensaje}`);

    // Mostrar notificación visual simple
    const notificacion = document.createElement('div');
    notificacion.className = `axyra-notification axyra-notification-${tipo}`;
    notificacion.innerHTML = `
      <i class="fas fa-${
        tipo === 'success' ? 'check' : tipo === 'error' ? 'times' : tipo === 'warning' ? 'exclamation' : 'info'
      }-circle"></i>
      <span>${mensaje}</span>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.remove();
    }, 3000);
  }
}

// ========================================
// FUNCIONES GLOBALES
// ========================================

// Función para cerrar modal (llamada desde HTML)
function cerrarModalAgregarFactura() {
  if (window.axyraCuadreCaja) {
    window.axyraCuadreCaja.cerrarModalAgregarFactura();
  }
}

function cerrarModalResumenCuadre() {
  if (window.axyraCuadreCaja) {
    window.axyraCuadreCaja.cerrarModalResumenCuadre();
  }
}

// Función para actualizar gráficos (llamada desde HTML)
function actualizarGraficosFinancieros() {
  if (window.axyraCuadreCaja) {
    window.axyraCuadreCaja.actualizarGraficos();
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  window.axyraCuadreCaja = new AxyraCuadreCaja();
});

console.log('📊 Sistema de Cuadre de Caja AXYRA cargado');
