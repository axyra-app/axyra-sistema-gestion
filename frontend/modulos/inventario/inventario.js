// ========================================
// SISTEMA DE INVENTARIO AXYRA - JAVASCRIPT
// ========================================

// Variables globales
let productos = [];
let movimientos = [];
let productoEditando = null;
let usuarioActual = null;

// Inicialización del sistema
document.addEventListener('DOMContentLoaded', function () {
  inicializarInventario();
});

// Función principal de inicialización
async function inicializarInventario() {
  try {
    console.log('🚀 Inicializando sistema de inventario AXYRA...');

    // Verificar autenticación
    await verificarAutenticacion();

    // Cargar datos
    await cargarInventario();
    await cargarMovimientos();

    // Configurar event listeners
    configurarEventListeners();

    // Actualizar estadísticas
    actualizarEstadisticas();

    console.log('✅ Sistema de inventario inicializado correctamente');
  } catch (error) {
    console.error('❌ Error inicializando inventario:', error);
    mostrarNotificacion('Error al inicializar el sistema de inventario', 'error');
  }
}

// Verificar autenticación del usuario
async function verificarAutenticacion() {
  try {
    // Usar el sistema unificado de autenticación si está disponible
    if (window.axyraIsolatedAuth && window.axyraIsolatedAuth.isUserAuthenticated()) {
      usuarioActual = window.axyraIsolatedAuth.getCurrentUser();
      console.log('✅ Usuario autenticado desde AXYRA Auth:', usuarioActual.email || usuarioActual.username);
      return;
    }

    // Intentar obtener usuario de Firebase
    if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
      usuarioActual = firebase.auth().currentUser;
      console.log('✅ Usuario autenticado en Firebase:', usuarioActual.email);
      return;
    }

    // Fallback a localStorage
    const usuarioLocal = localStorage.getItem('axyra_isolated_user');
    if (usuarioLocal) {
      usuarioActual = JSON.parse(usuarioLocal);
      if (usuarioActual && usuarioActual.isAuthenticated) {
        console.log('✅ Usuario autenticado en localStorage:', usuarioActual.email || usuarioActual.username);
        return;
      }
    }

    throw new Error('No hay usuario autenticado');
  } catch (error) {
    console.error('❌ Error de autenticación:', error);
    throw error;
  }
}

// Cargar inventario desde Firebase
async function cargarInventario() {
  try {
    // Usar el sistema de sincronización si está disponible
    if (window.firebaseSyncManager) {
      try {
        console.log('🔄 Usando sistema de sincronización para inventario...');
        // Por ahora, cargar desde localStorage hasta que implementemos inventario en FirebaseSyncManager
        productos = cargarProductosLocalStorage();
        console.log('✅ Productos cargados desde localStorage:', productos.length);
        return;
      } catch (syncError) {
        console.warn('⚠️ Error con sistema de sincronización, usando método directo:', syncError);
      }
    }

    // Método directo - intentar cargar desde Firebase
    if (typeof firebase !== 'undefined' && firebase.firestore && usuarioActual) {
      try {
        console.log('🔥 Cargando inventario desde Firebase...');
        const snapshot = await firebase
          .firestore()
          .collection('productos')
          .where('userId', '==', usuarioActual.uid || usuarioActual.id)
          .get();

        productos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('✅ Productos cargados desde Firebase:', productos.length);
        
        // Guardar en localStorage como respaldo
        localStorage.setItem('axyra_productos', JSON.stringify(productos));
        return;
      } catch (firebaseError) {
        console.warn('⚠️ Error cargando desde Firebase, usando localStorage:', firebaseError);
      }
    }

    // Fallback a localStorage
    productos = cargarProductosLocalStorage();
    console.log('✅ Productos cargados desde localStorage:', productos.length);
  } catch (error) {
    console.error('❌ Error cargando inventario:', error);
    productos = [];
  }
}

// Cargar movimientos desde Firebase
async function cargarMovimientos() {
  try {
    // Usar el sistema de sincronización si está disponible
    if (window.firebaseSyncManager) {
      try {
        console.log('🔄 Usando sistema de sincronización para movimientos...');
        // Por ahora, cargar desde localStorage hasta que implementemos movimientos en FirebaseSyncManager
        movimientos = cargarMovimientosLocalStorage();
        console.log('✅ Movimientos cargados desde localStorage:', movimientos.length);
        return;
      } catch (syncError) {
        console.warn('⚠️ Error con sistema de sincronización, usando método directo:', syncError);
      }
    }

    // Método directo - intentar cargar desde Firebase
    if (typeof firebase !== 'undefined' && firebase.firestore && usuarioActual) {
      try {
        console.log('🔥 Cargando movimientos desde Firebase...');
        const snapshot = await firebase
          .firestore()
          .collection('movimientos')
          .where('userId', '==', usuarioActual.uid || usuarioActual.id)
          .orderBy('fecha', 'desc')
          .limit(100)
          .get();

        movimientos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('✅ Movimientos cargados desde Firebase:', movimientos.length);
      } catch (firebaseError) {
        console.warn('⚠️ Error cargando desde Firebase:', firebaseError);
        cargarMovimientosLocalStorage();
      }
    } else {
      console.log('ℹ️ Firebase no disponible, usando localStorage...');
      cargarMovimientosLocalStorage();
    }
  } catch (error) {
    console.log('⚠️ Error cargando desde Firebase, usando localStorage...');
    cargarMovimientosLocalStorage();
  }
}

// Cargar productos desde localStorage
function cargarProductosLocalStorage() {
  try {
    const productosGuardados = localStorage.getItem('axyra_productos');
    if (productosGuardados) {
      const productosCargados = JSON.parse(productosGuardados);
      console.log('💾 Productos cargados desde localStorage:', productosCargados.length);
      return productosCargados;
    } else {
      console.log('ℹ️ No hay productos guardados en localStorage');
      return [];
    }
  } catch (error) {
    console.error('❌ Error cargando productos desde localStorage:', error);
    return [];
  }
}

// Cargar movimientos desde localStorage
function cargarMovimientosLocalStorage() {
  try {
    const movimientosGuardados = localStorage.getItem('axyra_movimientos');
    if (movimientosGuardados) {
      const movimientosCargados = JSON.parse(movimientosGuardados);
      console.log('💾 Movimientos cargados desde localStorage:', movimientosCargados.length);
      return movimientosCargados;
    } else {
      console.log('ℹ️ No hay movimientos guardados en localStorage');
      return [];
    }
  } catch (error) {
    console.error('❌ Error cargando movimientos desde localStorage:', error);
    return [];
  }
}

// Guardar productos en localStorage
function guardarProductosLocalStorage() {
  try {
    localStorage.setItem('axyra_productos', JSON.stringify(productos));
    console.log('💾 Productos guardados en localStorage');
  } catch (error) {
    console.error('❌ Error guardando productos en localStorage:', error);
  }
}

// Guardar movimientos en localStorage
function guardarMovimientosLocalStorage() {
  try {
    localStorage.setItem('axyra_movimientos', JSON.stringify(movimientos));
    console.log('💾 Movimientos guardados en localStorage');
  } catch (error) {
    console.error('❌ Error guardando movimientos en localStorage:', error);
  }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
  try {
    // Usar el sistema de notificaciones AXYRA si está disponible
    if (window.axyraNotifications) {
      window.axyraNotifications.showNotification(mensaje, tipo);
      return;
    }

    // Fallback: crear notificación simple
    const notificacion = document.createElement('div');
    notificacion.className = `axyra-notification axyra-notification-${tipo}`;
    notificacion.innerHTML = `
      <div class="axyra-notification-content">
        <span class="axyra-notification-message">${mensaje}</span>
        <button class="axyra-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(notificacion);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      if (notificacion.parentElement) {
        notificacion.remove();
      }
    }, 5000);
  } catch (error) {
    console.error('❌ Error mostrando notificación:', error);
  }
}

// ========================================
// FUNCIONES DE MODALES
// ========================================

// Mostrar modal de producto
function mostrarModalProducto() {
  try {
    const modal = document.getElementById('modalProducto');
    if (modal) {
      modal.style.display = 'flex';
      document.getElementById('tituloModalProducto').textContent = 'Nuevo Producto';
      document.getElementById('formProducto').reset();
    }
  } catch (error) {
    console.error('❌ Error mostrando modal producto:', error);
    mostrarNotificacion('Error mostrando modal', 'error');
  }
}

// Cerrar modal de producto
function cerrarModalProducto() {
  try {
    const modal = document.getElementById('modalProducto');
    if (modal) {
      modal.style.display = 'none';
    }
  } catch (error) {
    console.error('❌ Error cerrando modal producto:', error);
  }
}

// Mostrar modal de entrada
function mostrarModalEntrada() {
  try {
    const modal = document.getElementById('modalEntrada');
    if (modal) {
      modal.style.display = 'flex';
      document.getElementById('formEntrada').reset();
    }
  } catch (error) {
    console.error('❌ Error mostrando modal entrada:', error);
    mostrarNotificacion('Error mostrando modal', 'error');
  }
}

// Cerrar modal de entrada
function cerrarModalEntrada() {
  try {
    const modal = document.getElementById('modalEntrada');
    if (modal) {
      modal.style.display = 'none';
    }
  } catch (error) {
    console.error('❌ Error cerrando modal entrada:', error);
  }
}

// Mostrar modal de salida
function mostrarModalSalida() {
  try {
    const modal = document.getElementById('modalSalida');
    if (modal) {
      modal.style.display = 'flex';
      document.getElementById('formSalida').reset();
    }
  } catch (error) {
    console.error('❌ Error mostrando modal salida:', error);
    mostrarNotificacion('Error mostrando modal', 'error');
  }
}

// Cerrar modal de salida
function cerrarModalSalida() {
  try {
    const modal = document.getElementById('modalSalida');
    if (modal) {
      modal.style.display = 'none';
    }
  } catch (error) {
    console.error('❌ Error cerrando modal salida:', error);
  }
}

// ========================================
// FUNCIONES DE EXPORTACIÓN
// ========================================

// Exportar inventario a Excel
function exportarInventarioExcel() {
  try {
    if (productos.length === 0) {
      mostrarNotificacion('No hay productos para exportar', 'warning');
      return;
    }

    // Verificar si XLSX está disponible
    if (typeof XLSX === 'undefined') {
      mostrarNotificacion('Error: Librería XLSX no disponible', 'error');
      return;
    }

    // Preparar datos para exportar
    const datosExportar = productos.map(producto => ({
      Código: producto.codigo || '',
      Nombre: producto.nombre || '',
      Categoría: producto.categoria || '',
      Stock: producto.stock || 0,
      Precio: producto.precio || 0,
      Estado: producto.estado || '',
      Fecha_Creación: producto.fechaCreacion || ''
    }));

    // Crear libro de Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(datosExportar);

    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario');

    // Generar archivo y descargar
    XLSX.writeFile(workbook, `Inventario_${new Date().toISOString().split('T')[0]}.xlsx`);

    mostrarNotificacion('Inventario exportado exitosamente', 'success');
  } catch (error) {
    console.error('❌ Error exportando inventario:', error);
    mostrarNotificacion('Error exportando inventario: ' + error.message, 'error');
  }
}
    console.error('❌ Error mostrando notificación:', error);
    // Fallback final: alert
    alert(`${tipo.toUpperCase()}: ${mensaje}`);
  }
}

// Renderizar tabla de productos
function renderizarTablaProductos() {
  const tbody = document.getElementById('cuerpoTablaProductos');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (productos.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No hay productos registrados. ¡Agrega tu primer producto!
                </td>
            </tr>
        `;
    return;
  }

  productos.forEach((producto) => {
    const estado = obtenerEstadoProducto(producto);
    const row = document.createElement('tr');
    row.innerHTML = `
            <td><strong>${producto.codigo}</strong></td>
            <td>${producto.nombre}</td>
            <td><span class="badge badge-info">${producto.categoria}</span></td>
            <td><strong>${producto.stock}</strong></td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td><span class="inventario-estado inventario-estado-${estado}">${estado}</span></td>
            <td>
                <button class="inventario-btn-view" onclick="verProducto('${producto.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="inventario-btn-edit" onclick="editarProducto('${producto.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="inventario-btn-delete" onclick="eliminarProducto('${producto.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Renderizar tabla de movimientos
function renderizarTablaMovimientos() {
  const tbody = document.getElementById('cuerpoTablaMovimientos');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (movimientos.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No hay movimientos registrados.
                </td>
            </tr>
        `;
    return;
  }

  movimientos.forEach((movimiento) => {
    const row = document.createElement('tr');
    const fecha = new Date(movimiento.fecha).toLocaleDateString('es-ES');
    const tipo =
      movimiento.tipo === 'entrada'
        ? '<span class="badge badge-success">Entrada</span>'
        : '<span class="badge badge-warning">Salida</span>';

    row.innerHTML = `
            <td>${fecha}</td>
            <td><strong>${movimiento.nombreProducto}</strong></td>
            <td>${tipo}</td>
            <td><strong>${movimiento.cantidad}</strong></td>
            <td>${movimiento.usuario}</td>
            <td>${movimiento.observacion || '-'}</td>
            <td>
                <button class="inventario-btn-view" onclick="verMovimiento('${movimiento.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Obtener estado del producto
function obtenerEstadoProducto(producto) {
  if (producto.stock <= 0) return 'inactivo';
  if (producto.stock <= (producto.stockMinimo || 5)) return 'bajo';
  return 'activo';
}

// Actualizar estadísticas
function actualizarEstadisticas() {
  const totalProductos = productos.length;
  const stockTotal = productos.reduce((total, p) => total + p.stock, 0);

  const hoy = new Date().toDateString();
  const entradasHoy = movimientos
    .filter((m) => m.tipo === 'entrada' && new Date(m.fecha).toDateString() === hoy)
    .reduce((total, m) => total + m.cantidad, 0);

  const salidasHoy = movimientos
    .filter((m) => m.tipo === 'salida' && new Date(m.fecha).toDateString() === hoy)
    .reduce((total, m) => total + m.cantidad, 0);

  document.getElementById('totalProductos').textContent = totalProductos;
  document.getElementById('stockTotal').textContent = stockTotal;
  document.getElementById('entradasHoy').textContent = entradasHoy;
  document.getElementById('salidasHoy').textContent = salidasHoy;
}

// Configurar event listeners
function configurarEventListeners() {
  // Formulario de producto
  const formProducto = document.getElementById('formProducto');
  if (formProducto) {
    formProducto.addEventListener('submit', guardarProducto);
  }

  // Formulario de entrada
  const formEntrada = document.getElementById('formEntrada');
  if (formEntrada) {
    formEntrada.addEventListener('submit', registrarEntrada);
  }

  // Formulario de salida
  const formSalida = document.getElementById('formSalida');
  if (formSalida) {
    formSalida.addEventListener('submit', registrarSalida);
  }

  // Búsqueda
  const buscarInput = document.getElementById('buscarProducto');
  if (buscarInput) {
    buscarInput.addEventListener('input', filtrarProductos);
  }

  // Filtros
  const filtroCategoria = document.getElementById('filtroCategoria');
  if (filtroCategoria) {
    filtroCategoria.addEventListener('change', filtrarProductos);
  }

  const filtroEstado = document.getElementById('filtroEstado');
  if (filtroEstado) {
    filtroEstado.addEventListener('change', filtrarProductos);
  }
}

// Filtrar productos
function filtrarProductos() {
  const busqueda = document.getElementById('buscarProducto').value.toLowerCase();
  const categoria = document.getElementById('filtroCategoria').value;
  const estado = document.getElementById('filtroEstado').value;

  let productosFiltrados = productos.filter((producto) => {
    const cumpleBusqueda =
      !busqueda ||
      producto.nombre.toLowerCase().includes(busqueda) ||
      producto.codigo.toLowerCase().includes(busqueda) ||
      producto.categoria.toLowerCase().includes(busqueda);

    const cumpleCategoria = !categoria || producto.categoria === categoria;
    const cumpleEstado = !estado || obtenerEstadoProducto(producto) === estado;

    return cumpleBusqueda && cumpleCategoria && cumpleEstado;
  });

  renderizarProductosFiltrados(productosFiltrados);
}

// Renderizar productos filtrados
function renderizarProductosFiltrados(productosFiltrados) {
  const tbody = document.getElementById('cuerpoTablaProductos');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (productosFiltrados.length === 0) {
    tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">
                    No se encontraron productos con los filtros aplicados.
                </td>
            </tr>
        `;
    return;
  }

  productosFiltrados.forEach((producto) => {
    const estado = obtenerEstadoProducto(producto);
    const row = document.createElement('tr');
    row.innerHTML = `
            <td><strong>${producto.codigo}</strong></td>
            <td>${producto.nombre}</td>
            <td><span class="badge badge-info">${producto.categoria}</span></td>
            <td><strong>${producto.stock}</strong></td>
            <td>$${producto.precio.toFixed(2)}</td>
            <td><span class="inventario-estado inventario-estado-${estado}">${estado}</span></td>
            <td>
                <button class="inventario-btn-view" onclick="verProducto('${producto.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="inventario-btn-edit" onclick="editarProducto('${producto.id}')" title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="inventario-btn-delete" onclick="eliminarProducto('${producto.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}

// Mostrar notificación
function mostrarNotificacion(mensaje, tipo = 'info') {
  // Crear elemento de notificación
  const notificacion = document.createElement('div');
  notificacion.className = `axyra-notificacion axyra-notificacion-${tipo}`;

  const icono =
    tipo === 'success'
      ? 'check-circle'
      : tipo === 'error'
      ? 'exclamation-circle'
      : tipo === 'warning'
      ? 'exclamation-triangle'
      : 'info-circle';

  notificacion.innerHTML = `
        <div class="axyra-notificacion-icono">
            <i class="fas fa-${icono}"></i>
        </div>
        <div class="axyra-notificacion-contenido">
            <p class="axyra-notificacion-mensaje">${mensaje}</p>
        </div>
        <button class="axyra-notificacion-cerrar" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;

  // Agregar al DOM
  document.body.appendChild(notificacion);

  // Auto-remover después de 5 segundos
  setTimeout(() => {
    if (notificacion.parentElement) {
      notificacion.remove();
    }
  }, 5000);
}

// ========================================
// GESTIÓN DE PRODUCTOS
// ========================================

// Mostrar modal de producto
function mostrarModalProducto(producto = null) {
  const modal = document.getElementById('modalProducto');
  const titulo = document.getElementById('tituloModalProducto');
  const form = document.getElementById('formProducto');

  if (producto) {
    // Modo edición
    titulo.textContent = 'Editar Producto';
    productoEditando = producto;
    llenarFormularioProducto(producto);
  } else {
    // Modo creación
    titulo.textContent = 'Nuevo Producto';
    productoEditando = null;
    form.reset();
  }

  modal.style.display = 'block';
}

// Llenar formulario con datos del producto
function llenarFormularioProducto(producto) {
  document.getElementById('codigoProducto').value = producto.codigo;
  document.getElementById('nombreProducto').value = producto.nombre;
  document.getElementById('categoriaProducto').value = producto.categoria;
  document.getElementById('stockInicial').value = producto.stock;
  document.getElementById('precioProducto').value = producto.precio;
  document.getElementById('stockMinimo').value = producto.stockMinimo || 5;
  document.getElementById('descripcionProducto').value = producto.descripcion || '';
}

// Guardar producto
async function guardarProducto(event) {
  event.preventDefault();

  try {
    const formData = new FormData(event.target);
    const producto = {
      codigo: formData.get('codigoProducto'),
      nombre: formData.get('nombreProducto'),
      categoria: formData.get('categoriaProducto'),
      stock: parseInt(formData.get('stockInicial')),
      precio: parseFloat(formData.get('precioProducto')),
      stockMinimo: parseInt(formData.get('stockMinimo')),
      descripcion: formData.get('descripcionProducto'),
      fechaCreacion: new Date().toISOString(),
      userId: usuarioActual.uid || 'local',
    };

    // Validaciones
    if (producto.stock < 0) {
      mostrarNotificacion('El stock no puede ser negativo', 'error');
      return;
    }
    if (producto.precio < 0) {
      mostrarNotificacion('El precio no puede ser negativo', 'error');
      return;
    }

    if (productoEditando) {
      // Actualizar producto existente
      await actualizarProducto(productoEditando.id, producto);
      mostrarNotificacion('Producto actualizado correctamente', 'success');
    } else {
      // Crear nuevo producto
      await crearProducto(producto);
      mostrarNotificacion('Producto creado correctamente', 'success');
    }

    cerrarModalProducto();
    await cargarInventario();
    renderizarTablaProductos();
    actualizarEstadisticas();
  } catch (error) {
    console.error('❌ Error guardando producto:', error);
    mostrarNotificacion('Error al guardar el producto', 'error');
  }
}

// Crear producto
async function crearProducto(producto) {
  try {
    if (firebase.auth().currentUser) {
      // Guardar en Firebase
      const docRef = await firebase.firestore().collection('productos').add(producto);
      producto.id = docRef.id;
      console.log('✅ Producto creado en Firebase:', docRef.id);
    } else {
      // Guardar en localStorage
      producto.id = Date.now().toString();
      productos.push(producto);
      guardarProductosLocalStorage();
      console.log('✅ Producto creado en localStorage:', producto.id);
    }
  } catch (error) {
    console.error('❌ Error creando producto:', error);
    throw error;
  }
}

// Actualizar producto
async function actualizarProducto(id, datos) {
  try {
    if (firebase.auth().currentUser) {
      // Actualizar en Firebase
      await firebase.firestore().collection('productos').doc(id).update(datos);
      console.log('✅ Producto actualizado en Firebase:', id);
    } else {
      // Actualizar en localStorage
      const index = productos.findIndex((p) => p.id === id);
      if (index !== -1) {
        productos[index] = { ...productos[index], ...datos };
        guardarProductosLocalStorage();
        console.log('✅ Producto actualizado en localStorage:', id);
      }
    }
  } catch (error) {
    console.error('❌ Error actualizando producto:', error);
    throw error;
  }
}

// Editar producto
function editarProducto(id) {
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    mostrarModalProducto(producto);
  }
}

// Ver producto
function verProducto(id) {
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    mostrarModalVerProducto(producto);
  }
}

// Eliminar producto
async function eliminarProducto(id) {
  if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    return;
  }

  try {
    if (firebase.auth().currentUser) {
      // Eliminar de Firebase
      await firebase.firestore().collection('productos').doc(id).delete();
      console.log('✅ Producto eliminado de Firebase:', id);
    } else {
      // Eliminar de localStorage
      productos = productos.filter((p) => p.id !== id);
      guardarProductosLocalStorage();
      console.log('✅ Producto eliminado de localStorage:', id);
    }

    mostrarNotificacion('Producto eliminado correctamente', 'success');
    await cargarInventario();
    renderizarTablaProductos();
    actualizarEstadisticas();
  } catch (error) {
    console.error('❌ Error eliminando producto:', error);
    mostrarNotificacion('Error al eliminar el producto', 'error');
  }
}

// ========================================
// GESTIÓN DE MOVIMIENTOS
// ========================================

// Mostrar modal de entrada
function mostrarModalEntrada() {
  const modal = document.getElementById('modalEntrada');
  const form = document.getElementById('formEntrada');

  form.reset();
  cargarProductosEnSelects();
  modal.style.display = 'block';
}

// Mostrar modal de salida
function mostrarModalSalida() {
  const modal = document.getElementById('modalSalida');
  const form = document.getElementById('formSalida');

  form.reset();
  cargarProductosEnSelects();
  modal.style.display = 'block';
}

// Cargar productos en selects
function cargarProductosEnSelects() {
  const selectEntrada = document.getElementById('productoEntrada');
  const selectSalida = document.getElementById('productoSalida');

  if (selectEntrada) {
    selectEntrada.innerHTML = '<option value="">Seleccionar producto</option>';
    productos.forEach((producto) => {
      const option = document.createElement('option');
      option.value = producto.id;
      option.textContent = `${producto.codigo} - ${producto.nombre} (Stock: ${producto.stock})`;
      selectEntrada.appendChild(option);
    });
  }

  if (selectSalida) {
    selectSalida.innerHTML = '<option value="">Seleccionar producto</option>';
    productos.forEach((producto) => {
      const option = document.createElement('option');
      option.value = producto.id;
      option.textContent = `${producto.codigo} - ${producto.nombre} (Stock: ${producto.stock})`;
      selectSalida.appendChild(option);
    });
  }
}

// Registrar entrada
async function registrarEntrada(event) {
  event.preventDefault();

  try {
    const formData = new FormData(event.target);
    const productoId = formData.get('productoEntrada');
    const cantidad = parseInt(formData.get('cantidadEntrada'));
    const observacion = formData.get('observacionEntrada');

    if (!productoId || cantidad <= 0) {
      mostrarNotificacion('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const producto = productos.find((p) => p.id === productoId);
    if (!producto) {
      mostrarNotificacion('Producto no encontrado', 'error');
      return;
    }

    // Crear movimiento
    const movimiento = {
      productoId: productoId,
      nombreProducto: producto.nombre,
      tipo: 'entrada',
      cantidad: cantidad,
      observacion: observacion,
      fecha: new Date().toISOString(),
      usuario: usuarioActual.email || 'Usuario Local',
      userId: usuarioActual.uid || 'local',
    };

    // Guardar movimiento
    await guardarMovimiento(movimiento);

    // Actualizar stock del producto
    producto.stock += cantidad;
    await actualizarProducto(productoId, { stock: producto.stock });

    mostrarNotificacion('Entrada registrada correctamente', 'success');
    cerrarModalEntrada();

    // Recargar datos
    await cargarInventario();
    await cargarMovimientos();
    renderizarTablaProductos();
    renderizarTablaMovimientos();
    actualizarEstadisticas();
  } catch (error) {
    console.error('❌ Error registrando entrada:', error);
    mostrarNotificacion('Error al registrar la entrada', 'error');
  }
}

// Registrar salida
async function registrarSalida(event) {
  event.preventDefault();

  try {
    const formData = new FormData(event.target);
    const productoId = formData.get('productoSalida');
    const cantidad = parseInt(formData.get('cantidadSalida'));
    const observacion = formData.get('observacionSalida');

    if (!productoId || cantidad <= 0) {
      mostrarNotificacion('Por favor completa todos los campos requeridos', 'error');
      return;
    }

    const producto = productos.find((p) => p.id === productoId);
    if (!producto) {
      mostrarNotificacion('Producto no encontrado', 'error');
      return;
    }

    if (producto.stock < cantidad) {
      mostrarNotificacion('Stock insuficiente para esta salida', 'error');
      return;
    }

    // Crear movimiento
    const movimiento = {
      productoId: productoId,
      nombreProducto: producto.nombre,
      tipo: 'salida',
      cantidad: cantidad,
      observacion: observacion,
      fecha: new Date().toISOString(),
      usuario: usuarioActual.email || 'Usuario Local',
      userId: usuarioActual.uid || 'local',
    };

    // Guardar movimiento
    await guardarMovimiento(movimiento);

    // Actualizar stock del producto
    producto.stock -= cantidad;
    await actualizarProducto(productoId, { stock: producto.stock });

    mostrarNotificacion('Salida registrada correctamente', 'success');
    cerrarModalSalida();

    // Recargar datos
    await cargarInventario();
    await cargarMovimientos();
    renderizarTablaProductos();
    renderizarTablaMovimientos();
    actualizarEstadisticas();
  } catch (error) {
    console.error('❌ Error registrando salida:', error);
    mostrarNotificacion('Error al registrar la salida', 'error');
  }
}

// Guardar movimiento
async function guardarMovimiento(movimiento) {
  try {
    if (firebase.auth().currentUser) {
      // Guardar en Firebase
      const docRef = await firebase.firestore().collection('movimientos').add(movimiento);
      movimiento.id = docRef.id;
      console.log('✅ Movimiento guardado en Firebase:', docRef.id);
    } else {
      // Guardar en localStorage
      movimiento.id = Date.now().toString();
      movimientos.unshift(movimiento);
      guardarMovimientosLocalStorage();
      console.log('✅ Movimiento guardado en localStorage:', movimiento.id);
    }
  } catch (error) {
    console.error('❌ Error guardando movimiento:', error);
    throw error;
  }
}

// Ver movimiento
function verMovimiento(id) {
  const movimiento = movimientos.find((m) => m.id === id);
  if (movimiento) {
    const detalles = `
            <div class="inventario-form">
                <div class="inventario-form-row">
                    <div class="inventario-form-group">
                        <label class="inventario-form-label">Producto</label>
                        <p><strong>${movimiento.nombreProducto}</strong></p>
                    </div>
                    <div class="inventario-form-group">
                        <label class="inventario-form-label">Tipo</label>
                        <p><span class="badge badge-${movimiento.tipo === 'entrada' ? 'success' : 'warning'}">${
      movimiento.tipo
    }</span></p>
                    </div>
                </div>
                <div class="inventario-form-row">
                    <div class="inventario-form-group">
                        <label class="inventario-form-label">Cantidad</label>
                        <p><strong>${movimiento.cantidad}</strong></p>
                    </div>
                    <div class="inventario-form-group">
                        <label class="inventario-form-label">Usuario</label>
                        <p>${movimiento.usuario}</p>
                    </div>
                </div>
                <div class="inventario-form-group">
                    <label class="inventario-form-label">Fecha</label>
                    <p>${new Date(movimiento.fecha).toLocaleString('es-ES')}</p>
                </div>
                <div class="inventario-form-group">
                    <label class="inventario-form-label">Observación</label>
                    <p>${movimiento.observacion || 'Sin observaciones'}</p>
                </div>
            </div>
        `;

    document.getElementById('detallesProducto').innerHTML = detalles;
    document.getElementById('modalVerProducto').style.display = 'block';
  }
}

// ========================================
// CONTROL DE MODALES
// ========================================

// Cerrar modal de producto
function cerrarModalProducto() {
  document.getElementById('modalProducto').style.display = 'none';
  productoEditando = null;
}

// Cerrar modal de entrada
function cerrarModalEntrada() {
  document.getElementById('modalEntrada').style.display = 'none';
}

// Cerrar modal de salida
function cerrarModalSalida() {
  document.getElementById('modalSalida').style.display = 'none';
}

// Cerrar modal de ver producto
function cerrarModalVerProducto() {
  document.getElementById('modalVerProducto').style.display = 'none';
}

// ========================================
// EXPORTACIÓN Y REPORTES
// ========================================

// Exportar inventario a Excel
function exportarInventarioExcel() {
  try {
    const workbook = XLSX.utils.book_new();

    // Hoja de productos
    const productosData = productos.map((p) => ({
      Código: p.codigo,
      Nombre: p.nombre,
      Categoría: p.categoria,
      Stock: p.stock,
      Precio: p.precio,
      'Stock Mínimo': p.stockMinimo || 5,
      Estado: obtenerEstadoProducto(p),
      Descripción: p.descripcion || '',
      'Fecha Creación': new Date(p.fechaCreacion).toLocaleDateString('es-ES'),
    }));

    const worksheetProductos = XLSX.utils.json_to_sheet(productosData);
    XLSX.utils.book_append_sheet(workbook, worksheetProductos, 'Productos');

    // Hoja de movimientos
    const movimientosData = movimientos.map((m) => ({
      Fecha: new Date(m.fecha).toLocaleDateString('es-ES'),
      Producto: m.nombreProducto,
      Tipo: m.tipo === 'entrada' ? 'Entrada' : 'Salida',
      Cantidad: m.cantidad,
      Usuario: m.usuario,
      Observación: m.observacion || '',
    }));

    const worksheetMovimientos = XLSX.utils.json_to_sheet(movimientosData);
    XLSX.utils.book_append_sheet(workbook, worksheetMovimientos, 'Movimientos');

    // Aplicar estilos
    aplicarEstilosExcel(worksheetProductos, worksheetMovimientos);

    // Descargar archivo
    const nombreArchivo = `inventario_axyra_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, nombreArchivo);

    mostrarNotificacion('Inventario exportado a Excel correctamente', 'success');
    console.log('✅ Inventario exportado a Excel:', nombreArchivo);
  } catch (error) {
    console.error('❌ Error exportando inventario:', error);
    mostrarNotificacion('Error al exportar el inventario', 'error');
  }
}

// Aplicar estilos al Excel
function aplicarEstilosExcel(worksheetProductos, worksheetMovimientos) {
  // Estilos para encabezados
  const headerStyle = {
    fill: { fgColor: { rgb: '667eea' } },
    font: { color: { rgb: 'FFFFFF' }, bold: true, sz: 12 },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: {
      top: { style: 'medium', color: { rgb: '000000' } },
      bottom: { style: 'medium', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  // Aplicar estilos a encabezados de productos
  const rangeProductos = XLSX.utils.decode_range(worksheetProductos['!ref']);
  for (let C = rangeProductos.s.c; C <= rangeProductos.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    worksheetProductos[cellAddress].s = headerStyle;
  }

  // Aplicar estilos a encabezados de movimientos
  const rangeMovimientos = XLSX.utils.decode_range(worksheetMovimientos['!ref']);
  for (let C = rangeMovimientos.s.c; C <= rangeMovimientos.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
    worksheetMovimientos[cellAddress].s = headerStyle;
  }

  // Ajustar ancho de columnas
  worksheetProductos['!cols'] = [
    { width: 15 }, // Código
    { width: 30 }, // Nombre
    { width: 15 }, // Categoría
    { width: 10 }, // Stock
    { width: 12 }, // Precio
    { width: 15 }, // Stock Mínimo
    { width: 12 }, // Estado
    { width: 40 }, // Descripción
    { width: 15 }, // Fecha
  ];

  worksheetMovimientos['!cols'] = [
    { width: 15 }, // Fecha
    { width: 30 }, // Producto
    { width: 12 }, // Tipo
    { width: 10 }, // Cantidad
    { width: 25 }, // Usuario
    { width: 40 }, // Observación
  ];
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Función de logout
function logout() {
  try {
    if (firebase.auth().currentUser) {
      firebase.auth().signOut();
    }
    localStorage.removeItem('axyra_user');
    window.location.href = '../../login.html';
  } catch (error) {
    console.error('❌ Error en logout:', error);
    window.location.href = '../../login.html';
  }
}

// Hacer funciones globales
window.mostrarModalProducto = mostrarModalProducto;
window.mostrarModalEntrada = mostrarModalEntrada;
window.mostrarModalSalida = mostrarModalSalida;
window.cerrarModalProducto = cerrarModalProducto;
window.cerrarModalEntrada = cerrarModalEntrada;
window.cerrarModalSalida = cerrarModalSalida;
window.cerrarModalVerProducto = cerrarModalVerProducto;
window.editarProducto = editarProducto;
window.verProducto = verProducto;
window.eliminarProducto = eliminarProducto;
window.verMovimiento = verMovimiento;
window.exportarInventarioExcel = exportarInventarioExcel;
window.logout = logout;
