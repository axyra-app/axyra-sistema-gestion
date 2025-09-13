// Sistema Mejorado de Inventario - AXYRA
// Versión completamente funcional con todas las características

class AxyraInventario {
  constructor() {
    this.productos = [];
    this.categorias = [];
    this.movimientos = [];
    this.graficos = {};
    this.filtros = {
      busqueda: '',
      categoria: '',
      estado: '',
    };

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Sistema de Inventario AXYRA...');

      // Verificar autenticación
      const isAuthenticated = await this.checkAuth();
      if (!isAuthenticated) {
        this.showLoginMessage();
        return;
      }

      // Inicializar Firebase Sync Manager si está disponible
      if (window.firebaseSyncManager) {
        this.firebaseSyncManager = window.firebaseSyncManager;
        await this.firebaseSyncManager.init();
      }

      // Cargar datos
      await this.cargarDatos();

      // Configurar eventos
      this.configurarEventos();

      // Actualizar KPIs
      this.actualizarKPIs();

      // Renderizar productos
      this.renderizarProductos();

      // Inicializar gráficos
      this.inicializarGraficos();

      console.log('✅ Sistema de Inventario AXYRA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de inventario:', error);
      this.showErrorMessage('Error inicializando el sistema de inventario');
    }
  }

  async checkAuth() {
    try {
      if (window.axyraAuthManager) {
        return window.axyraAuthManager.isUserAuthenticated();
      }

      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user && user.isAuthenticated;
      }

      return false;
    } catch (error) {
      console.error('❌ Error verificando autenticación:', error);
      return false;
    }
  }

  showLoginMessage() {
    const container = document.querySelector('.inventario-container');
    if (container) {
      container.innerHTML = `
        <div class="axyra-login-message" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 4rem; color: #4f81bd; margin-bottom: 20px;">
            <i class="fas fa-lock"></i>
          </div>
          <h2 style="color: #374151; margin-bottom: 16px;">Acceso Requerido</h2>
          <p style="color: #6b7280; margin-bottom: 24px;">
            Necesitas iniciar sesión para acceder al sistema de inventario
          </p>
          <a href="../../login.html" class="btn btn-primary">
            <i class="fas fa-sign-in-alt"></i> Ir al Login
          </a>
        </div>
      `;
    }
  }

  showErrorMessage(message) {
    if (window.axyraModals) {
      window.axyraModals.showErrorModal('Error del Sistema', message);
    } else {
      alert(message);
    }
  }

  async cargarDatos() {
    try {
      console.log('📊 Cargando datos del sistema de inventario...');

      // Cargar productos y categorías
      if (this.firebaseSyncManager) {
        this.productos = (await this.firebaseSyncManager.getProductos()) || [];
        this.categorias = (await this.firebaseSyncManager.getCategorias()) || [];
        this.movimientos = (await this.firebaseSyncManager.getMovimientos()) || [];
      } else {
        this.productos = JSON.parse(localStorage.getItem('axyra_productos') || '[]');
        this.categorias = JSON.parse(localStorage.getItem('axyra_categorias') || '[]');
        this.movimientos = JSON.parse(localStorage.getItem('axyra_movimientos') || '[]');
      }

      // Procesar datos
      this.procesarDatos();

      console.log('✅ Datos cargados:', {
        productos: this.productos.length,
        categorias: this.categorias.length,
        movimientos: this.movimientos.length,
      });
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      this.showErrorMessage('Error cargando datos del sistema');
    }
  }

  procesarDatos() {
    try {
      // Procesar productos
      this.productos.forEach((producto) => {
        if (!producto.id) {
          producto.id = this.generarId();
        }
        if (!producto.codigo) {
          producto.codigo = this.generarCodigoProducto();
        }
        if (!producto.stock) {
          producto.stock = 0;
        }
        if (!producto.stockMinimo) {
          producto.stockMinimo = 5;
        }
        if (!producto.precio) {
          producto.precio = 0;
        }
        if (!producto.categoria) {
          producto.categoria = 'Sin categoría';
        }
        if (!producto.estado) {
          producto.estado = this.calcularEstadoProducto(producto);
        }
      });

      // Procesar categorías
      this.categorias.forEach((categoria) => {
        if (!categoria.id) {
          categoria.id = this.generarId();
        }
      });

      // Procesar movimientos
      this.movimientos.forEach((movimiento) => {
        if (!movimiento.id) {
          movimiento.id = this.generarId();
        }
        if (!movimiento.fecha) {
          movimiento.fecha = new Date().toISOString().split('T')[0];
        }
      });

      console.log('✅ Datos procesados correctamente');
    } catch (error) {
      console.error('❌ Error procesando datos:', error);
    }
  }

  calcularEstadoProducto(producto) {
    if (producto.stock === 0) return 'agotado';
    if (producto.stock <= producto.stockMinimo) return 'bajo-stock';
    return 'disponible';
  }

  generarCodigoProducto() {
    const ultimoProducto = this.productos
      .filter((p) => p.codigo && p.codigo.startsWith('PROD-'))
      .sort((a, b) => {
        const numA = parseInt(a.codigo.split('-')[1]) || 0;
        const numB = parseInt(b.codigo.split('-')[1]) || 0;
        return numB - numA;
      })[0];

    let siguienteNumero = 1;
    if (ultimoProducto && ultimoProducto.codigo) {
      const ultimoNumero = parseInt(ultimoProducto.codigo.split('-')[1]) || 0;
      siguienteNumero = ultimoNumero + 1;
    }

    return `PROD-${siguienteNumero.toString().padStart(4, '0')}`;
  }

  configurarEventos() {
    try {
      // Event listeners para búsqueda
      const buscarInput = document.getElementById('buscarProducto');
      if (buscarInput) {
        buscarInput.addEventListener('input', (e) => {
          this.filtros.busqueda = e.target.value;
          this.aplicarFiltros();
        });
      }

      // Event listeners para filtros
      const filtroCategoria = document.getElementById('filtroCategoria');
      if (filtroCategoria) {
        filtroCategoria.addEventListener('change', (e) => {
          this.filtros.categoria = e.target.value;
          this.aplicarFiltros();
        });
      }

      const filtroEstado = document.getElementById('filtroEstado');
      if (filtroEstado) {
        filtroEstado.addEventListener('change', (e) => {
          this.filtros.estado = e.target.value;
          this.aplicarFiltros();
        });
      }

      // Llenar selector de categorías
      this.llenarSelectorCategorias();

      console.log('✅ Eventos configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando eventos:', error);
    }
  }

  llenarSelectorCategorias() {
    const selector = document.getElementById('filtroCategoria');
    if (!selector) return;

    selector.innerHTML = '<option value="">Todas las categorías</option>';
    this.categorias.forEach((categoria) => {
      const option = document.createElement('option');
      option.value = categoria.nombre;
      option.textContent = categoria.nombre;
      selector.appendChild(option);
    });
  }

  actualizarKPIs() {
    try {
      // Total productos
      const totalProductos = this.productos.length;
      this.actualizarElemento('totalProductos', totalProductos.toString());

      // Valor del inventario
      const valorInventario = this.productos.reduce((sum, p) => sum + p.precio * p.stock, 0);
      this.actualizarElemento('valorInventario', `$${valorInventario.toLocaleString()}`);

      // Total categorías
      const totalCategorias = this.categorias.length;
      this.actualizarElemento('totalCategorias', totalCategorias.toString());

      // Total movimientos
      const totalMovimientos = this.movimientos.length;
      this.actualizarElemento('totalMovimientos', totalMovimientos.toString());

      console.log('✅ KPIs actualizados');
    } catch (error) {
      console.error('❌ Error actualizando KPIs:', error);
    }
  }

  actualizarElemento(id, valor) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.textContent = valor;
    }
  }

  renderizarProductos() {
    try {
      const container = document.getElementById('tablaProductosContainer');
      if (!container) return;

      let productosFiltrados = this.productos;

      // Aplicar filtros
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase();
        productosFiltrados = productosFiltrados.filter(
          (p) =>
            p.nombre.toLowerCase().includes(busqueda) ||
            p.codigo.toLowerCase().includes(busqueda) ||
            (p.descripcion && p.descripcion.toLowerCase().includes(busqueda))
        );
      }

      if (this.filtros.categoria) {
        productosFiltrados = productosFiltrados.filter((p) => p.categoria === this.filtros.categoria);
      }

      if (this.filtros.estado) {
        productosFiltrados = productosFiltrados.filter((p) => p.estado === this.filtros.estado);
      }

      if (productosFiltrados.length === 0) {
        container.innerHTML = `
          <div class="no-data">
            <i class="fas fa-boxes"></i>
            <h3>No hay productos que coincidan con los filtros</h3>
            <p>Intente ajustar los criterios de búsqueda o agregue nuevos productos</p>
          </div>
        `;
        return;
      }

      const tablaHTML = `
        <table class="productos-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Valor Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${productosFiltrados
              .map(
                (producto) => `
              <tr>
                <td><strong>${producto.codigo}</strong></td>
                <td>${producto.nombre}</td>
                <td>${producto.categoria}</td>
                <td>${producto.stock}</td>
                <td>$${(producto.precio || 0).toLocaleString()}</td>
                <td>$${((producto.precio || 0) * producto.stock).toLocaleString()}</td>
                <td>
                  <span class="producto-status ${producto.estado}">
                    ${this.formatearEstado(producto.estado)}
                  </span>
                </td>
                <td>
                  <button class="btn btn-primary" style="padding: 8px 12px; font-size: 0.75rem;" onclick="inventario.editarProducto('${
                    producto.id
                  }')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-info" style="padding: 8px 12px; font-size: 0.75rem;" onclick="inventario.verProducto('${
                    producto.id
                  }')">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-warning" style="padding: 8px 12px; font-size: 0.75rem;" onclick="inventario.ajustarStock('${
                    producto.id
                  }')">
                    <i class="fas fa-exchange-alt"></i>
                  </button>
                  <button class="btn btn-danger" style="padding: 8px 12px; font-size: 0.75rem; background: #ef4444;" onclick="inventario.eliminarProducto('${
                    producto.id
                  }')">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `;

      container.innerHTML = tablaHTML;
      console.log(`✅ ${productosFiltrados.length} productos renderizados`);
    } catch (error) {
      console.error('❌ Error renderizando productos:', error);
    }
  }

  formatearEstado(estado) {
    const estados = {
      disponible: 'Disponible',
      'bajo-stock': 'Bajo Stock',
      agotado: 'Agotado',
    };
    return estados[estado] || estado;
  }

  aplicarFiltros() {
    this.renderizarProductos();
  }

  inicializarGraficos() {
    try {
      this.crearGraficoProductosCategoria();
      this.crearGraficoValorCategoria();
      console.log('✅ Gráficos inicializados');
    } catch (error) {
      console.error('❌ Error inicializando gráficos:', error);
    }
  }

  crearGraficoProductosCategoria() {
    try {
      const ctx = document.getElementById('graficoProductosCategoria');
      if (!ctx) return;

      if (this.graficos.productosCategoria) {
        this.graficos.productosCategoria.destroy();
      }

      const datos = this.prepararDatosProductosCategoria();

      this.graficos.productosCategoria = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: datos.labels,
          datasets: [
            {
              data: datos.valores,
              backgroundColor: [
                '#4f81bd',
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#06b6d4',
                '#84cc16',
                '#f97316',
                '#ec4899',
                '#6366f1',
              ],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
        },
      });
    } catch (error) {
      console.error('❌ Error creando gráfico de productos por categoría:', error);
    }
  }

  crearGraficoValorCategoria() {
    try {
      const ctx = document.getElementById('graficoValorCategoria');
      if (!ctx) return;

      if (this.graficos.valorCategoria) {
        this.graficos.valorCategoria.destroy();
      }

      const datos = this.prepararDatosValorCategoria();

      this.graficos.valorCategoria = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: datos.labels,
          datasets: [
            {
              label: 'Valor',
              data: datos.valores,
              backgroundColor: '#4f81bd',
              borderColor: '#2e5c8a',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
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
    } catch (error) {
      console.error('❌ Error creando gráfico de valor por categoría:', error);
    }
  }

  prepararDatosProductosCategoria() {
    try {
      const categorias = {};
      this.productos.forEach((producto) => {
        const categoria = producto.categoria || 'Sin categoría';
        categorias[categoria] = (categorias[categoria] || 0) + 1;
      });

      return {
        labels: Object.keys(categorias),
        valores: Object.values(categorias),
      };
    } catch (error) {
      console.error('❌ Error preparando datos de productos por categoría:', error);
      return { labels: [], valores: [] };
    }
  }

  prepararDatosValorCategoria() {
    try {
      const categorias = {};
      this.productos.forEach((producto) => {
        const categoria = producto.categoria || 'Sin categoría';
        const valor = (producto.precio || 0) * producto.stock;
        categorias[categoria] = (categorias[categoria] || 0) + valor;
      });

      return {
        labels: Object.keys(categorias),
        valores: Object.values(categorias),
      };
    } catch (error) {
      console.error('❌ Error preparando datos de valor por categoría:', error);
      return { labels: [], valores: [] };
    }
  }

  actualizarGraficos() {
    try {
      this.crearGraficoProductosCategoria();
      this.crearGraficoValorCategoria();
      console.log('✅ Gráficos actualizados');
    } catch (error) {
      console.error('❌ Error actualizando gráficos:', error);
    }
  }

  getCurrentUserId() {
    try {
      if (window.axyraAuthManager) {
        const user = window.axyraAuthManager.getCurrentUser();
        return user ? user.id || user.email : 'anonymous';
      }

      const userData = localStorage.getItem('axyra_isolated_user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || user.email || 'anonymous';
      }

      return 'anonymous';
    } catch (error) {
      console.error('❌ Error obteniendo ID de usuario:', error);
      return 'anonymous';
    }
  }

  generarId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Métodos para acciones de productos
  mostrarModalNuevoProducto() {
    if (window.axyraModals) {
      window.axyraModals.showModal({
        title: 'Nuevo Producto',
        icon: 'fas fa-plus',
        type: 'info',
        size: 'large',
        content: this.crearFormularioProducto(),
        buttons: [
          {
            text: 'Cancelar',
            type: 'secondary',
            action: 'cancel',
            icon: 'fas fa-times',
          },
          {
            text: 'Guardar Producto',
            type: 'primary',
            action: 'confirm',
            icon: 'fas fa-save',
          },
        ],
        onConfirm: () => this.guardarProducto(),
      });
    } else {
      alert('Funcionalidad de nuevo producto no disponible');
    }
  }

  crearFormularioProducto() {
    return `
      <form id="formNuevoProducto">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Nombre del Producto *</label>
            <input type="text" class="form-input" id="nombreProducto" required placeholder="Ingrese el nombre del producto">
          </div>
          <div class="form-group">
            <label class="form-label">Código</label>
            <input type="text" class="form-input" id="codigoProducto" placeholder="Se generará automáticamente" readonly>
          </div>
          <div class="form-group">
            <label class="form-label">Categoría *</label>
            <select class="form-select" id="categoriaProducto" required>
              <option value="">Seleccionar categoría</option>
              ${this.categorias.map((cat) => `<option value="${cat.nombre}">${cat.nombre}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Precio *</label>
            <input type="number" class="form-input" id="precioProducto" required placeholder="0" min="0" step="0.01">
          </div>
          <div class="form-group">
            <label class="form-label">Stock Inicial *</label>
            <input type="number" class="form-input" id="stockProducto" required placeholder="0" min="0">
          </div>
          <div class="form-group">
            <label class="form-label">Stock Mínimo</label>
            <input type="number" class="form-input" id="stockMinimoProducto" placeholder="5" min="0" value="5">
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Descripción</label>
          <textarea class="form-textarea" id="descripcionProducto" placeholder="Descripción del producto"></textarea>
        </div>
      </form>
    `;
  }

  async guardarProducto() {
    try {
      const formData = new FormData(document.getElementById('formNuevoProducto'));

      const nuevoProducto = {
        id: this.generarId(),
        codigo: this.generarCodigoProducto(),
        nombre: formData.get('nombreProducto'),
        categoria: formData.get('categoriaProducto'),
        precio: parseFloat(formData.get('precioProducto')),
        stock: parseInt(formData.get('stockProducto')),
        stockMinimo: parseInt(formData.get('stockMinimoProducto')) || 5,
        descripcion: formData.get('descripcionProducto'),
        estado: this.calcularEstadoProducto({
          stock: parseInt(formData.get('stockProducto')),
          stockMinimo: parseInt(formData.get('stockMinimoProducto')) || 5,
        }),
        created_at: new Date().toISOString(),
        user_id: this.getCurrentUserId(),
      };

      // Validar datos
      if (!nuevoProducto.nombre || !nuevoProducto.categoria || !nuevoProducto.precio || nuevoProducto.stock < 0) {
        this.showErrorMessage('Por favor complete todos los campos obligatorios');
        return false;
      }

      // Agregar producto
      this.productos.unshift(nuevoProducto);

      // Guardar en Firebase o localStorage
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.guardarProducto(nuevoProducto);
      } else {
        localStorage.setItem('axyra_productos', JSON.stringify(this.productos));
      }

      // Actualizar vista
      this.actualizarKPIs();
      this.renderizarProductos();
      this.actualizarGraficos();

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Producto Guardado', 'El producto se ha guardado correctamente');
      }

      console.log('✅ Producto guardado correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error guardando producto:', error);
      this.showErrorMessage('Error guardando el producto');
      return false;
    }
  }

  editarProducto(productoId) {
    console.log('Editar producto:', productoId);
    // Implementar edición de producto
  }

  verProducto(productoId) {
    console.log('Ver producto:', productoId);
    // Implementar visualización de producto
  }

  ajustarStock(productoId) {
    console.log('Ajustar stock:', productoId);
    // Implementar ajuste de stock
  }

  eliminarProducto(productoId) {
    if (window.axyraModals) {
      window.axyraModals.showDeleteWidgetModal('Producto', () => {
        this.productos = this.productos.filter((p) => p.id !== productoId);
        localStorage.setItem('axyra_productos', JSON.stringify(this.productos));
        this.actualizarKPIs();
        this.renderizarProductos();
        this.actualizarGraficos();
      });
    } else {
      if (confirm('¿Está seguro de que desea eliminar este producto?')) {
        this.productos = this.productos.filter((p) => p.id !== productoId);
        localStorage.setItem('axyra_productos', JSON.stringify(this.productos));
        this.actualizarKPIs();
        this.renderizarProductos();
        this.actualizarGraficos();
      }
    }
  }

  // Métodos de modales
  mostrarModalEntrada() {
    console.log('Mostrar modal entrada');
    // Implementar modal de entrada
  }

  mostrarModalSalida() {
    console.log('Mostrar modal salida');
    // Implementar modal de salida
  }

  mostrarModalCategoria() {
    console.log('Mostrar modal categoría');
    // Implementar modal de categoría
  }

  // Métodos de exportación y reportes
  async exportarInventario() {
    try {
      if (this.productos.length === 0) {
        this.showErrorMessage('No hay productos para exportar');
        return;
      }

      const wb = XLSX.utils.book_new();

      const datos = this.productos.map((producto) => ({
        Código: producto.codigo,
        Nombre: producto.nombre,
        Categoría: producto.categoria,
        Stock: producto.stock,
        Precio: producto.precio,
        'Valor Total': producto.precio * producto.stock,
        Estado: this.formatearEstado(producto.estado),
        Descripción: producto.descripcion || '',
      }));

      const ws = XLSX.utils.json_to_sheet(datos);

      const colWidths = [
        { wch: 15 }, // Código
        { wch: 25 }, // Nombre
        { wch: 15 }, // Categoría
        { wch: 10 }, // Stock
        { wch: 15 }, // Precio
        { wch: 15 }, // Valor Total
        { wch: 12 }, // Estado
        { wch: 30 }, // Descripción
      ];
      ws['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(wb, ws, 'Inventario');

      const nombreArchivo = `inventario_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Exportación Exitosa', 'El inventario se ha exportado correctamente');
      }

      console.log('✅ Inventario exportado a Excel');
    } catch (error) {
      console.error('❌ Error exportando inventario:', error);
      this.showErrorMessage('Error exportando el inventario');
    }
  }

  generarReporte() {
    console.log('Generar reporte de inventario');
    // Implementar generación de reporte
  }

  async actualizarInventario() {
    try {
      await this.cargarDatos();
      this.actualizarKPIs();
      this.renderizarProductos();
      this.actualizarGraficos();

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Actualización Exitosa', 'Los datos se han actualizado correctamente');
      }
    } catch (error) {
      console.error('❌ Error actualizando inventario:', error);
      this.showErrorMessage('Error actualizando los datos');
    }
  }
}

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando Sistema de Inventario AXYRA...');
  window.inventario = new AxyraInventario();
});

console.log('✅ Sistema de Inventario AXYRA cargado');
