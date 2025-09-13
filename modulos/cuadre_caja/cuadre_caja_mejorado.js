// Sistema Mejorado de Cuadre de Caja - AXYRA
// Versión profesional con KPIs organizados y funcionalidad completa

class AxyraCuadreCaja {
  constructor() {
    this.facturas = [];
    this.ingresos = [];
    this.graficos = {};
    this.currentUser = null;

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Sistema de Cuadre de Caja AXYRA...');

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

      // Renderizar facturas
      this.renderizarFacturas();

      // Inicializar gráficos
      this.inicializarGraficos();

      console.log('✅ Sistema de Cuadre de Caja AXYRA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de cuadre de caja:', error);
      this.showErrorMessage('Error inicializando el sistema de cuadre de caja');
    }
  }

  async checkAuth() {
    try {
      // Verificar autenticación con el sistema unificado
      if (window.axyraAuthManager) {
        return window.axyraAuthManager.isUserAuthenticated();
      }

      // Fallback: verificar localStorage
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
    const container = document.querySelector('.cuadre-caja-container');
    if (container) {
      container.innerHTML = `
        <div class="axyra-login-message" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 4rem; color: #4f81bd; margin-bottom: 20px;">
            <i class="fas fa-lock"></i>
          </div>
          <h2 style="color: #374151; margin-bottom: 16px;">Acceso Requerido</h2>
          <p style="color: #6b7280; margin-bottom: 24px;">
            Necesitas iniciar sesión para acceder al sistema de cuadre de caja
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
      console.log('📊 Cargando datos del sistema de cuadre de caja...');

      // Cargar facturas
      if (this.firebaseSyncManager) {
        this.facturas = (await this.firebaseSyncManager.getFacturas()) || [];
        this.ingresos = (await this.firebaseSyncManager.getIngresos()) || [];
      } else {
        // Fallback a localStorage
        this.facturas = JSON.parse(localStorage.getItem('axyra_facturas') || '[]');
        this.ingresos = JSON.parse(localStorage.getItem('axyra_ingresos') || '[]');
      }

      // Procesar datos
      this.procesarDatos();

      console.log('✅ Datos cargados:', {
        facturas: this.facturas.length,
        ingresos: this.ingresos.length,
      });
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      this.showErrorMessage('Error cargando datos del sistema');
    }
  }

  procesarDatos() {
    try {
      // Procesar facturas para cálculos
      this.facturas.forEach((factura) => {
        if (!factura.fecha) {
          factura.fecha = new Date().toISOString().split('T')[0];
        }
        if (!factura.estado) {
          factura.estado = 'pendiente';
        }
        if (!factura.id) {
          factura.id = this.generarId();
        }
      });

      // Ordenar facturas por fecha (más recientes primero)
      this.facturas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      console.log('✅ Datos procesados correctamente');
    } catch (error) {
      console.error('❌ Error procesando datos:', error);
    }
  }

  configurarEventos() {
    try {
      // Event listener para formulario de nueva factura
      const formNuevaFactura = document.getElementById('formNuevaFactura');
      if (formNuevaFactura) {
        formNuevaFactura.addEventListener('submit', (e) => {
          e.preventDefault();
          this.registrarFactura();
        });
      }

      // Configurar fecha por defecto
      const fechaInput = document.getElementById('fechaFactura');
      if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
      }

      // Configurar fecha de vencimiento (30 días por defecto)
      const vencimientoInput = document.getElementById('vencimientoFactura');
      if (vencimientoInput) {
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
        vencimientoInput.value = fechaVencimiento.toISOString().split('T')[0];
      }

      // Auto-generar número de factura
      this.generarNumeroFactura();

      console.log('✅ Eventos configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando eventos:', error);
    }
  }

  generarNumeroFactura() {
    try {
      const numeroFacturaInput = document.getElementById('numeroFactura');
      if (!numeroFacturaInput) return;

      const ultimaFactura = this.facturas
        .filter((f) => f.numero && f.numero.startsWith('FAC-'))
        .sort((a, b) => {
          const numA = parseInt(a.numero.split('-')[1]) || 0;
          const numB = parseInt(b.numero.split('-')[1]) || 0;
          return numB - numA;
        })[0];

      let siguienteNumero = 1;
      if (ultimaFactura && ultimaFactura.numero) {
        const ultimoNumero = parseInt(ultimaFactura.numero.split('-')[1]) || 0;
        siguienteNumero = ultimoNumero + 1;
      }

      numeroFacturaInput.value = `FAC-${siguienteNumero.toString().padStart(3, '0')}`;
    } catch (error) {
      console.error('❌ Error generando número de factura:', error);
    }
  }

  async registrarFactura() {
    try {
      const formData = new FormData(document.getElementById('formNuevaFactura'));

      const nuevaFactura = {
        id: this.generarId(),
        numero: formData.get('numeroFactura'),
        cliente: formData.get('clienteFactura'),
        valor: parseFloat(formData.get('valorFactura')),
        fecha: formData.get('fechaFactura'),
        vencimiento: formData.get('vencimientoFactura'),
        estado: formData.get('estadoFactura'),
        descripcion: formData.get('descripcionFactura'),
        created_at: new Date().toISOString(),
        user_id: this.getCurrentUserId(),
      };

      // Validar datos
      if (!nuevaFactura.numero || !nuevaFactura.cliente || !nuevaFactura.valor || !nuevaFactura.fecha) {
        this.showErrorMessage('Por favor complete todos los campos obligatorios');
        return;
      }

      // Verificar que el número de factura no exista
      if (this.facturas.some((f) => f.numero === nuevaFactura.numero)) {
        this.showErrorMessage('Ya existe una factura con este número');
        return;
      }

      // Agregar factura
      this.facturas.unshift(nuevaFactura);

      // Guardar en Firebase o localStorage
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.guardarFactura(nuevaFactura);
      } else {
        localStorage.setItem('axyra_facturas', JSON.stringify(this.facturas));
      }

      // Limpiar formulario
      this.limpiarFormularioFactura();

      // Actualizar vista
      this.actualizarKPIs();
      this.renderizarFacturas();
      this.actualizarGraficos();

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Factura Registrada', 'La factura se ha registrado correctamente');
      } else {
        alert('Factura registrada correctamente');
      }

      console.log('✅ Factura registrada correctamente');
    } catch (error) {
      console.error('❌ Error registrando factura:', error);
      this.showErrorMessage('Error registrando la factura');
    }
  }

  limpiarFormularioFactura() {
    try {
      const form = document.getElementById('formNuevaFactura');
      if (form) {
        form.reset();
        // Restablecer fechas
        document.getElementById('fechaFactura').value = new Date().toISOString().split('T')[0];
        const vencimientoInput = document.getElementById('vencimientoFactura');
        const fechaVencimiento = new Date();
        fechaVencimiento.setDate(fechaVencimiento.getDate() + 30);
        vencimientoInput.value = fechaVencimiento.toISOString().split('T')[0];
        // Generar nuevo número de factura
        this.generarNumeroFactura();
      }
    } catch (error) {
      console.error('❌ Error limpiando formulario:', error);
    }
  }

  actualizarKPIs() {
    try {
      // Calcular total de ingresos
      const totalIngresos = this.facturas
        .filter((f) => f.estado === 'pagada')
        .reduce((sum, f) => sum + (f.valor || 0), 0);

      // Calcular total de facturas
      const totalFacturas = this.facturas.length;

      // Calcular promedio por factura
      const promedioFactura = totalFacturas > 0 ? totalIngresos / totalFacturas : 0;

      // Calcular crecimiento mensual
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();
      const mesAnterior = mesActual === 0 ? 11 : mesActual - 1;
      const añoAnterior = mesActual === 0 ? añoActual - 1 : añoActual;

      const ingresosMesActual = this.facturas
        .filter((f) => {
          const fecha = new Date(f.fecha);
          return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual && f.estado === 'pagada';
        })
        .reduce((sum, f) => sum + (f.valor || 0), 0);

      const ingresosMesAnterior = this.facturas
        .filter((f) => {
          const fecha = new Date(f.fecha);
          return fecha.getMonth() === mesAnterior && fecha.getFullYear() === añoAnterior && f.estado === 'pagada';
        })
        .reduce((sum, f) => sum + (f.valor || 0), 0);

      const crecimientoMensual =
        ingresosMesAnterior > 0 ? ((ingresosMesActual - ingresosMesAnterior) / ingresosMesAnterior) * 100 : 0;

      // Actualizar elementos del DOM
      this.actualizarElemento('totalIngresos', `$${totalIngresos.toLocaleString()}`);
      this.actualizarElemento('totalFacturas', totalFacturas.toString());
      this.actualizarElemento('promedioFactura', `$${promedioFactura.toLocaleString()}`);
      this.actualizarElemento('crecimientoMensual', `${crecimientoMensual.toFixed(1)}%`);

      // Actualizar indicadores de cambio
      this.actualizarCambio('cambioIngresos', crecimientoMensual);
      this.actualizarCambio('cambioFacturas', 0); // Por implementar
      this.actualizarCambio('cambioPromedio', 0); // Por implementar
      this.actualizarCambio('cambioCrecimiento', crecimientoMensual);

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

  actualizarCambio(id, valor) {
    const elemento = document.getElementById(id);
    if (!elemento) return;

    elemento.textContent = `${valor >= 0 ? '+' : ''}${valor.toFixed(1)}%`;
    elemento.className = 'kpi-change';

    if (valor > 0) {
      elemento.classList.add('positive');
    } else if (valor < 0) {
      elemento.classList.add('negative');
    } else {
      elemento.classList.add('neutral');
    }
  }

  renderizarFacturas() {
    try {
      const container = document.getElementById('tablaFacturasContainer');
      if (!container) return;

      if (this.facturas.length === 0) {
        container.innerHTML = `
          <div class="no-data">
            <i class="fas fa-file-invoice"></i>
            <h3>No hay facturas registradas</h3>
            <p>Comience registrando su primera factura usando el formulario superior</p>
          </div>
        `;
        return;
      }

      const tablaHTML = `
        <table class="facturas-table">
          <thead>
            <tr>
              <th>Número</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Fecha</th>
              <th>Vencimiento</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${this.facturas
              .map(
                (factura) => `
              <tr>
                <td><strong>${factura.numero}</strong></td>
                <td>${factura.cliente}</td>
                <td>$${(factura.valor || 0).toLocaleString()}</td>
                <td>${this.formatearFecha(factura.fecha)}</td>
                <td>${this.formatearFecha(factura.vencimiento)}</td>
                <td>
                  <span class="factura-status ${factura.estado}">
                    ${this.formatearEstado(factura.estado)}
                  </span>
                </td>
                <td>
                  <button class="btn btn-primary" style="padding: 8px 12px; font-size: 0.75rem;" onclick="cuadreCaja.editarFactura('${
                    factura.id
                  }')">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-warning" style="padding: 8px 12px; font-size: 0.75rem;" onclick="cuadreCaja.verFactura('${
                    factura.id
                  }')">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-info" style="padding: 8px 12px; font-size: 0.75rem;" onclick="cuadreCaja.descargarFactura('${
                    factura.id
                  }')">
                    <i class="fas fa-download"></i>
                  </button>
                  <button class="btn btn-danger" style="padding: 8px 12px; font-size: 0.75rem; background: #ef4444;" onclick="cuadreCaja.eliminarFactura('${
                    factura.id
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
      console.log(`✅ ${this.facturas.length} facturas renderizadas`);
    } catch (error) {
      console.error('❌ Error renderizando facturas:', error);
    }
  }

  formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    try {
      return new Date(fecha).toLocaleDateString('es-CO');
    } catch (error) {
      return fecha;
    }
  }

  formatearEstado(estado) {
    const estados = {
      pagada: 'Pagada',
      pendiente: 'Pendiente',
      vencida: 'Vencida',
    };
    return estados[estado] || estado;
  }

  inicializarGraficos() {
    try {
      this.crearGraficoIngresosMensuales();
      this.crearGraficoEstadoFacturas();
      console.log('✅ Gráficos inicializados');
    } catch (error) {
      console.error('❌ Error inicializando gráficos:', error);
    }
  }

  crearGraficoIngresosMensuales() {
    try {
      const ctx = document.getElementById('graficoIngresosMensuales');
      if (!ctx) return;

      // Destruir gráfico existente
      if (this.graficos.ingresosMensuales) {
        this.graficos.ingresosMensuales.destroy();
      }

      // Preparar datos
      const datos = this.prepararDatosIngresosMensuales();

      this.graficos.ingresosMensuales = new Chart(ctx, {
        type: 'line',
        data: {
          labels: datos.labels,
          datasets: [
            {
              label: 'Ingresos',
              data: datos.valores,
              borderColor: '#4f81bd',
              backgroundColor: 'rgba(79, 129, 189, 0.1)',
              tension: 0.4,
              fill: true,
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
      console.error('❌ Error creando gráfico de ingresos mensuales:', error);
    }
  }

  crearGraficoEstadoFacturas() {
    try {
      const ctx = document.getElementById('graficoEstadoFacturas');
      if (!ctx) return;

      // Destruir gráfico existente
      if (this.graficos.estadoFacturas) {
        this.graficos.estadoFacturas.destroy();
      }

      // Preparar datos
      const datos = this.prepararDatosEstadoFacturas();

      this.graficos.estadoFacturas = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: datos.labels,
          datasets: [
            {
              data: datos.valores,
              backgroundColor: [
                '#10b981', // Pagada
                '#f59e0b', // Pendiente
                '#ef4444', // Vencida
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
      console.error('❌ Error creando gráfico de estado de facturas:', error);
    }
  }

  prepararDatosIngresosMensuales() {
    try {
      const meses = [];
      const valores = [];

      // Obtener últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const fecha = new Date();
        fecha.setMonth(fecha.getMonth() - i);
        const mes = fecha.getMonth();
        const año = fecha.getFullYear();

        const ingresosMes = this.facturas
          .filter((f) => {
            const fechaFactura = new Date(f.fecha);
            return fechaFactura.getMonth() === mes && fechaFactura.getFullYear() === año && f.estado === 'pagada';
          })
          .reduce((sum, f) => sum + (f.valor || 0), 0);

        meses.push(fecha.toLocaleDateString('es-CO', { month: 'short' }));
        valores.push(ingresosMes);
      }

      return { labels: meses, valores };
    } catch (error) {
      console.error('❌ Error preparando datos de ingresos mensuales:', error);
      return { labels: [], valores: [] };
    }
  }

  prepararDatosEstadoFacturas() {
    try {
      const estados = ['pagada', 'pendiente', 'vencida'];
      const valores = estados.map((estado) => this.facturas.filter((f) => f.estado === estado).length);

      return {
        labels: ['Pagadas', 'Pendientes', 'Vencidas'],
        valores,
      };
    } catch (error) {
      console.error('❌ Error preparando datos de estado de facturas:', error);
      return { labels: [], valores: [] };
    }
  }

  actualizarGraficos() {
    try {
      this.crearGraficoIngresosMensuales();
      this.crearGraficoEstadoFacturas();
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

  // Métodos para acciones de facturas
  editarFactura(facturaId) {
    console.log('Editar factura:', facturaId);
    // Implementar edición de factura
  }

  verFactura(facturaId) {
    console.log('Ver factura:', facturaId);
    // Implementar visualización de factura
  }

  descargarFactura(facturaId) {
    console.log('Descargar factura:', facturaId);
    // Implementar descarga de factura
  }

  eliminarFactura(facturaId) {
    if (window.axyraModals) {
      window.axyraModals.showDeleteWidgetModal('Factura', () => {
        this.facturas = this.facturas.filter((f) => f.id !== facturaId);
        localStorage.setItem('axyra_facturas', JSON.stringify(this.facturas));
        this.actualizarKPIs();
        this.renderizarFacturas();
        this.actualizarGraficos();
      });
    } else {
      if (confirm('¿Está seguro de que desea eliminar esta factura?')) {
        this.facturas = this.facturas.filter((f) => f.id !== facturaId);
        localStorage.setItem('axyra_facturas', JSON.stringify(this.facturas));
        this.actualizarKPIs();
        this.renderizarFacturas();
        this.actualizarGraficos();
      }
    }
  }

  // Métodos de exportación y reportes
  async exportarFacturasExcel() {
    try {
      if (this.facturas.length === 0) {
        this.showErrorMessage('No hay facturas para exportar');
        return;
      }

      // Crear libro de trabajo
      const wb = XLSX.utils.book_new();

      // Preparar datos
      const datos = this.facturas.map((factura) => ({
        Número: factura.numero,
        Cliente: factura.cliente,
        Valor: factura.valor,
        Fecha: this.formatearFecha(factura.fecha),
        Vencimiento: this.formatearFecha(factura.vencimiento),
        Estado: this.formatearEstado(factura.estado),
        Descripción: factura.descripcion || '',
      }));

      // Crear hoja de trabajo
      const ws = XLSX.utils.json_to_sheet(datos);

      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 15 }, // Número
        { wch: 25 }, // Cliente
        { wch: 15 }, // Valor
        { wch: 12 }, // Fecha
        { wch: 12 }, // Vencimiento
        { wch: 12 }, // Estado
        { wch: 30 }, // Descripción
      ];
      ws['!cols'] = colWidths;

      // Agregar hoja al libro
      XLSX.utils.book_append_sheet(wb, ws, 'Facturas');

      // Descargar archivo
      const nombreArchivo = `facturas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, nombreArchivo);

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Exportación Exitosa', 'Las facturas se han exportado correctamente');
      } else {
        alert('Facturas exportadas correctamente');
      }

      console.log('✅ Facturas exportadas a Excel');
    } catch (error) {
      console.error('❌ Error exportando facturas:', error);
      this.showErrorMessage('Error exportando las facturas');
    }
  }

  generarReporteFacturas() {
    console.log('Generar reporte de facturas');
    // Implementar generación de reporte
  }

  async actualizarFacturas() {
    try {
      await this.cargarDatos();
      this.actualizarKPIs();
      this.renderizarFacturas();
      this.actualizarGraficos();

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Actualización Exitosa', 'Los datos se han actualizado correctamente');
      } else {
        alert('Datos actualizados correctamente');
      }
    } catch (error) {
      console.error('❌ Error actualizando facturas:', error);
      this.showErrorMessage('Error actualizando los datos');
    }
  }
}

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando Sistema de Cuadre de Caja AXYRA...');
  window.cuadreCaja = new AxyraCuadreCaja();
});

// Funciones globales para compatibilidad
window.limpiarFormularioFactura = function () {
  if (window.cuadreCaja) {
    window.cuadreCaja.limpiarFormularioFactura();
  }
};

window.exportarFacturasExcel = function () {
  if (window.cuadreCaja) {
    window.cuadreCaja.exportarFacturasExcel();
  }
};

window.generarReporteFacturas = function () {
  if (window.cuadreCaja) {
    window.cuadreCaja.generarReporteFacturas();
  }
};

window.actualizarFacturas = function () {
  if (window.cuadreCaja) {
    window.cuadreCaja.actualizarFacturas();
  }
};

console.log('✅ Sistema de Cuadre de Caja AXYRA cargado');
