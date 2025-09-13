/**
 * AXYRA - Dashboard Avanzado
 * Sistema de dashboard con widgets personalizables, alertas en tiempo real y análisis avanzados
 */

class AxyraDashboardAvanzado {
  constructor() {
    this.widgets = [];
    this.alertas = [];
    this.metricas = {};
    this.configuracion = this.getConfiguracionDefault();
    this.intervalos = {};
    this.websocket = null;

    this.init();
  }

  async init() {
    try {
      await this.cargarDatos();
      this.configurarEventos();
      this.inicializarWidgets();
      this.configurarAlertas();
      this.iniciarActualizacionesTiempoReal();
      console.log('✅ AxyraDashboardAvanzado inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando dashboard avanzado:', error);
    }
  }

  getConfiguracionDefault() {
    return {
      actualizacionAutomatica: true,
      intervaloActualizacion: 30000, // 30 segundos
      mostrarAlertas: true,
      tema: 'claro',
      widgets: {
        metricas: true,
        graficos: true,
        actividad: true,
        alertas: true,
        clima: false,
        noticias: false,
      },
      notificaciones: {
        sonido: true,
        push: false,
        email: false,
      },
    };
  }

  async cargarDatos() {
    try {
      // Cargar configuración
      const configGuardada = localStorage.getItem('axyra_dashboard_config');
      if (configGuardada) {
        this.configuracion = { ...this.configuracion, ...JSON.parse(configGuardada) };
      }

      // Cargar widgets personalizados
      const widgetsGuardados = localStorage.getItem('axyra_dashboard_widgets');
      if (widgetsGuardados) {
        this.widgets = JSON.parse(widgetsGuardados);
      } else {
        this.widgets = this.getWidgetsDefault();
      }

      // Cargar alertas
      const alertasGuardadas = localStorage.getItem('axyra_dashboard_alertas');
      if (alertasGuardadas) {
        this.alertas = JSON.parse(alertasGuardadas);
      }

      console.log('📊 Datos del dashboard cargados');
    } catch (error) {
      console.error('❌ Error cargando datos del dashboard:', error);
    }
  }

  getWidgetsDefault() {
    return [
      {
        id: 'metricas-principales',
        tipo: 'metricas',
        titulo: 'Métricas Principales',
        posicion: { x: 0, y: 0, w: 6, h: 4 },
        configuracion: {
          mostrarEmpleados: true,
          mostrarHoras: true,
          mostrarNominas: true,
          mostrarSalarios: true,
        },
      },
      {
        id: 'grafico-empleados',
        tipo: 'grafico',
        titulo: 'Distribución de Empleados',
        posicion: { x: 6, y: 0, w: 6, h: 4 },
        configuracion: {
          tipo: 'doughnut',
          datos: 'departamentos',
        },
      },
      {
        id: 'actividad-reciente',
        tipo: 'actividad',
        titulo: 'Actividad Reciente',
        posicion: { x: 0, y: 4, w: 8, h: 4 },
        configuracion: {
          limite: 10,
          mostrarTiempo: true,
        },
      },
      {
        id: 'alertas-sistema',
        tipo: 'alertas',
        titulo: 'Alertas del Sistema',
        posicion: { x: 8, y: 4, w: 4, h: 4 },
        configuracion: {
          mostrarCriticas: true,
          mostrarAdvertencias: true,
          mostrarInfo: false,
        },
      },
    ];
  }

  configurarEventos() {
    // Event listeners para personalización
    this.configurarPersonalizacion();

    // Event listeners para widgets
    this.configurarWidgets();

    // Event listeners para alertas
    this.configurarSistemaAlertas();
  }

  configurarPersonalizacion() {
    // Botón de personalización
    const btnPersonalizar = document.getElementById('btnPersonalizarDashboard');
    if (btnPersonalizar) {
      btnPersonalizar.addEventListener('click', () => this.mostrarModalPersonalizacion());
    }

    // Botón de configuración
    const btnConfigurar = document.getElementById('btnConfigurarDashboard');
    if (btnConfigurar) {
      btnConfigurar.addEventListener('click', () => this.mostrarModalConfiguracion());
    }
  }

  configurarWidgets() {
    // Hacer widgets arrastrables
    this.hacerWidgetsArrastrables();

    // Configurar redimensionamiento
    this.configurarRedimensionamiento();
  }

  configurarSistemaAlertas() {
    // Escuchar cambios en datos para generar alertas
    window.addEventListener('storage', (e) => {
      if (e.key && e.key.startsWith('axyra_')) {
        this.verificarAlertas();
      }
    });
  }

  inicializarWidgets() {
    const container = document.getElementById('dashboard-widgets');
    if (!container) return;

    container.innerHTML = '';

    this.widgets.forEach((widget) => {
      const widgetElement = this.crearWidget(widget);
      container.appendChild(widgetElement);
    });

    this.actualizarWidgets();
  }

  crearWidget(widget) {
    const div = document.createElement('div');
    div.className = 'axyra-widget';
    div.id = `widget-${widget.id}`;
    div.style.gridArea = `${widget.posicion.y + 1} / ${widget.posicion.x + 1} / span ${widget.posicion.h} / span ${
      widget.posicion.w
    }`;

    div.innerHTML = `
      <div class="axyra-widget-header">
        <h3>${widget.titulo}</h3>
        <div class="axyra-widget-controls">
          <button class="axyra-widget-btn" onclick="axyraDashboard.toggleWidget('${widget.id}')">
            <i class="fas fa-minus"></i>
          </button>
          <button class="axyra-widget-btn" onclick="axyraDashboard.configurarWidget('${widget.id}')">
            <i class="fas fa-cog"></i>
          </button>
          <button class="axyra-widget-btn" onclick="axyraDashboard.eliminarWidget('${widget.id}')">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      <div class="axyra-widget-content" id="content-${widget.id}">
        ${this.getContenidoWidget(widget)}
      </div>
    `;

    return div;
  }

  getContenidoWidget(widget) {
    switch (widget.tipo) {
      case 'metricas':
        return this.getContenidoMetricas(widget);
      case 'grafico':
        return this.getContenidoGrafico(widget);
      case 'actividad':
        return this.getContenidoActividad(widget);
      case 'alertas':
        return this.getContenidoAlertas(widget);
      case 'clima':
        return this.getContenidoClima(widget);
      case 'noticias':
        return this.getContenidoNoticias(widget);
      default:
        return '<p>Widget no implementado</p>';
    }
  }

  getContenidoMetricas(widget) {
    const config = widget.configuracion;
    let html = '<div class="axyra-metricas-grid">';

    if (config.mostrarEmpleados) {
      html += `
        <div class="axyra-metrica">
          <div class="axyra-metrica-icono">
            <i class="fas fa-users"></i>
          </div>
          <div class="axyra-metrica-contenido">
            <div class="axyra-metrica-valor" id="metric-empleados">0</div>
            <div class="axyra-metrica-etiqueta">Empleados</div>
          </div>
        </div>
      `;
    }

    if (config.mostrarHoras) {
      html += `
        <div class="axyra-metrica">
          <div class="axyra-metrica-icono">
            <i class="fas fa-clock"></i>
          </div>
          <div class="axyra-metrica-contenido">
            <div class="axyra-metrica-valor" id="metric-horas">0</div>
            <div class="axyra-metrica-etiqueta">Horas</div>
          </div>
        </div>
      `;
    }

    if (config.mostrarNominas) {
      html += `
        <div class="axyra-metrica">
          <div class="axyra-metrica-icono">
            <i class="fas fa-file-invoice-dollar"></i>
          </div>
          <div class="axyra-metrica-contenido">
            <div class="axyra-metrica-valor" id="metric-nominas">0</div>
            <div class="axyra-metrica-etiqueta">Nóminas</div>
          </div>
        </div>
      `;
    }

    if (config.mostrarSalarios) {
      html += `
        <div class="axyra-metrica">
          <div class="axyra-metrica-icono">
            <i class="fas fa-dollar-sign"></i>
          </div>
          <div class="axyra-metrica-contenido">
            <div class="axyra-metrica-valor" id="metric-salarios">$0</div>
            <div class="axyra-metrica-etiqueta">Salarios</div>
          </div>
        </div>
      `;
    }

    html += '</div>';
    return html;
  }

  getContenidoGrafico(widget) {
    const config = widget.configuracion;
    return `
      <div class="axyra-grafico-container">
        <canvas id="grafico-${widget.id}" width="400" height="300"></canvas>
      </div>
    `;
  }

  getContenidoActividad(widget) {
    const config = widget.configuracion;
    return `
      <div class="axyra-actividad-container" id="actividad-${widget.id}">
        <div class="axyra-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Cargando actividad...</span>
        </div>
      </div>
    `;
  }

  getContenidoAlertas(widget) {
    const config = widget.configuracion;
    return `
      <div class="axyra-alertas-container" id="alertas-${widget.id}">
        <div class="axyra-loading">
          <i class="fas fa-spinner fa-spin"></i>
          <span>Cargando alertas...</span>
        </div>
      </div>
    `;
  }

  getContenidoClima(widget) {
    return `
      <div class="axyra-clima-container">
        <div class="axyra-clima-info">
          <div class="axyra-clima-temperatura">25°C</div>
          <div class="axyra-clima-descripcion">Soleado</div>
          <div class="axyra-clima-ubicacion">Bogotá, Colombia</div>
        </div>
        <div class="axyra-clima-icono">
          <i class="fas fa-sun"></i>
        </div>
      </div>
    `;
  }

  getContenidoNoticias(widget) {
    return `
      <div class="axyra-noticias-container">
        <div class="axyra-noticia">
          <h4>Noticia 1</h4>
          <p>Descripción de la noticia...</p>
          <small>Hace 2 horas</small>
        </div>
        <div class="axyra-noticia">
          <h4>Noticia 2</h4>
          <p>Descripción de la noticia...</p>
          <small>Hace 4 horas</small>
        </div>
      </div>
    `;
  }

  actualizarWidgets() {
    this.widgets.forEach((widget) => {
      this.actualizarWidget(widget);
    });
  }

  actualizarWidget(widget) {
    switch (widget.tipo) {
      case 'metricas':
        this.actualizarMetricas(widget);
        break;
      case 'grafico':
        this.actualizarGrafico(widget);
        break;
      case 'actividad':
        this.actualizarActividad(widget);
        break;
      case 'alertas':
        this.actualizarAlertas(widget);
        break;
    }
  }

  actualizarMetricas(widget) {
    // Obtener datos actuales
    const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');

    // Actualizar métricas
    const metricEmpleados = document.getElementById('metric-empleados');
    if (metricEmpleados) {
      metricEmpleados.textContent = empleados.length;
    }

    const metricHoras = document.getElementById('metric-horas');
    if (metricHoras) {
      const totalHoras = horas.reduce((sum, h) => sum + (h.total_horas || 0), 0);
      metricHoras.textContent = totalHoras.toFixed(1);
    }

    const metricNominas = document.getElementById('metric-nominas');
    if (metricNominas) {
      metricNominas.textContent = nominas.length;
    }

    const metricSalarios = document.getElementById('metric-salarios');
    if (metricSalarios) {
      const totalSalarios = empleados.reduce((sum, e) => sum + (e.salario || 0), 0);
      metricSalarios.textContent = `$${totalSalarios.toLocaleString()}`;
    }
  }

  actualizarGrafico(widget) {
    const canvas = document.getElementById(`grafico-${widget.id}`);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const config = widget.configuracion;

    // Destruir gráfico anterior si existe
    if (this.charts && this.charts[widget.id]) {
      this.charts[widget.id].destroy();
    }

    // Crear nuevo gráfico según configuración
    if (config.datos === 'departamentos') {
      this.crearGraficoDepartamentos(ctx, widget);
    } else if (config.datos === 'salarios') {
      this.crearGraficoSalarios(ctx, widget);
    } else if (config.datos === 'horas') {
      this.crearGraficoHoras(ctx, widget);
    }
  }

  crearGraficoDepartamentos(ctx, widget) {
    const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    const departamentos = {};

    empleados.forEach((emp) => {
      const dept = emp.departamento || 'Sin departamento';
      departamentos[dept] = (departamentos[dept] || 0) + 1;
    });

    if (!this.charts) this.charts = {};

    this.charts[widget.id] = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(departamentos),
        datasets: [
          {
            data: Object.values(departamentos),
            backgroundColor: ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'],
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
  }

  actualizarActividad(widget) {
    const container = document.getElementById(`actividad-${widget.id}`);
    if (!container) return;

    const actividades = this.generarActividadReciente();
    const config = widget.configuracion;
    const limite = config.limite || 10;

    container.innerHTML = actividades
      .slice(0, limite)
      .map(
        (actividad) => `
        <div class="axyra-actividad-item">
          <div class="axyra-actividad-icono">
            <i class="${actividad.icono}"></i>
          </div>
          <div class="axyra-actividad-contenido">
            <div class="axyra-actividad-accion">${actividad.accion}</div>
            <div class="axyra-actividad-detalle">${actividad.detalle}</div>
            ${config.mostrarTiempo ? `<div class="axyra-actividad-tiempo">${actividad.tiempo}</div>` : ''}
          </div>
        </div>
      `
      )
      .join('');
  }

  actualizarAlertas(widget) {
    const container = document.getElementById(`alertas-${widget.id}`);
    if (!container) return;

    const config = widget.configuracion;
    const alertasFiltradas = this.alertas.filter((alerta) => {
      if (config.mostrarCriticas && alerta.nivel === 'critica') return true;
      if (config.mostrarAdvertencias && alerta.nivel === 'advertencia') return true;
      if (config.mostrarInfo && alerta.nivel === 'info') return true;
      return false;
    });

    container.innerHTML =
      alertasFiltradas.length > 0
        ? alertasFiltradas
            .map(
              (alerta) => `
          <div class="axyra-alerta axyra-alerta-${alerta.nivel}">
            <div class="axyra-alerta-icono">
              <i class="${alerta.icono}"></i>
            </div>
            <div class="axyra-alerta-contenido">
              <div class="axyra-alerta-titulo">${alerta.titulo}</div>
              <div class="axyra-alerta-mensaje">${alerta.mensaje}</div>
              <div class="axyra-alerta-tiempo">${alerta.tiempo}</div>
            </div>
            <button class="axyra-alerta-cerrar" onclick="axyraDashboard.cerrarAlerta('${alerta.id}')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        `
            )
            .join('')
        : '<div class="axyra-sin-alertas">No hay alertas activas</div>';
  }

  generarActividadReciente() {
    const actividades = [];
    const ahora = new Date();

    // Actividad de empleados
    const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    if (empleados.length > 0) {
      const ultimoEmpleado = empleados[empleados.length - 1];
      actividades.push({
        accion: 'Empleado registrado',
        detalle: ultimoEmpleado.nombre,
        icono: 'fas fa-user-plus',
        tiempo: this.formatearTiempo(ultimoEmpleado.fecha_registro || ahora.toISOString()),
      });
    }

    // Actividad de horas
    const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
    if (horas.length > 0) {
      const ultimaHora = horas[horas.length - 1];
      const empleado = empleados.find((e) => e.id === ultimaHora.empleado_id);
      if (empleado) {
        actividades.push({
          accion: 'Horas registradas',
          detalle: `${empleado.nombre}: ${ultimaHora.total_horas || 0} horas`,
          icono: 'fas fa-clock',
          tiempo: this.formatearTiempo(ultimaHora.fecha || ahora.toISOString()),
        });
      }
    }

    // Actividad de nóminas
    const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
    if (nominas.length > 0) {
      const ultimaNomina = nominas[nominas.length - 1];
      actividades.push({
        accion: 'Nómina generada',
        detalle: `Período: ${ultimaNomina.periodo || 'N/A'}`,
        icono: 'fas fa-file-invoice-dollar',
        tiempo: this.formatearTiempo(ultimaNomina.fecha_generacion || ahora.toISOString()),
      });
    }

    return actividades.sort((a, b) => new Date(b.tiempo) - new Date(a.tiempo));
  }

  formatearTiempo(timestamp) {
    const fecha = new Date(timestamp);
    const ahora = new Date();
    const diffMs = ahora - fecha;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return fecha.toLocaleDateString('es-CO');
  }

  verificarAlertas() {
    const nuevasAlertas = [];

    // Verificar empleados sin horas registradas
    const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    const horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');

    empleados.forEach((emp) => {
      const tieneHoras = horas.some((h) => h.empleado_id === emp.id);
      if (!tieneHoras && emp.estado === 'ACTIVO') {
        nuevasAlertas.push({
          id: `sin-horas-${emp.id}`,
          nivel: 'advertencia',
          titulo: 'Empleado sin horas registradas',
          mensaje: `${emp.nombre} no tiene horas registradas este mes`,
          icono: 'fas fa-exclamation-triangle',
          tiempo: new Date().toISOString(),
        });
      }
    });

    // Verificar nóminas pendientes
    const nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
    const nominasPendientes = nominas.filter((n) => n.estado === 'PENDIENTE');
    if (nominasPendientes.length > 0) {
      nuevasAlertas.push({
        id: 'nominas-pendientes',
        nivel: 'info',
        titulo: 'Nóminas pendientes',
        mensaje: `Hay ${nominasPendientes.length} nóminas pendientes de procesar`,
        icono: 'fas fa-info-circle',
        tiempo: new Date().toISOString(),
      });
    }

    // Agregar nuevas alertas
    nuevasAlertas.forEach((alerta) => {
      if (!this.alertas.find((a) => a.id === alerta.id)) {
        this.alertas.push(alerta);
      }
    });

    // Guardar alertas
    localStorage.setItem('axyra_dashboard_alertas', JSON.stringify(this.alertas));

    // Actualizar widgets de alertas
    this.actualizarWidgets();
  }

  iniciarActualizacionesTiempoReal() {
    if (!this.configuracion.actualizacionAutomatica) return;

    this.intervalos.actualizacion = setInterval(() => {
      this.actualizarWidgets();
      this.verificarAlertas();
    }, this.configuracion.intervaloActualizacion);

    // Actualizar hora cada minuto
    this.intervalos.hora = setInterval(() => {
      this.actualizarHora();
    }, 60000);
  }

  actualizarHora() {
    const elementosHora = document.querySelectorAll('.axyra-hora-actual');
    elementosHora.forEach((elemento) => {
      elemento.textContent = new Date().toLocaleTimeString('es-CO');
    });
  }

  // ========================================
  // GESTIÓN DE WIDGETS
  // ========================================

  hacerWidgetsArrastrables() {
    // Implementar funcionalidad de arrastrar y soltar
    // Esta es una implementación básica, se puede mejorar con librerías como SortableJS
    const widgets = document.querySelectorAll('.axyra-widget');
    widgets.forEach((widget) => {
      widget.draggable = true;
      widget.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', widget.id);
      });
    });
  }

  configurarRedimensionamiento() {
    // Implementar redimensionamiento de widgets
    // Se puede usar una librería como GridStack para esto
  }

  toggleWidget(widgetId) {
    const widget = document.getElementById(`widget-${widgetId}`);
    if (widget) {
      const content = widget.querySelector('.axyra-widget-content');
      const icono = widget.querySelector('.axyra-widget-btn i');

      if (content.style.display === 'none') {
        content.style.display = 'block';
        icono.className = 'fas fa-minus';
      } else {
        content.style.display = 'none';
        icono.className = 'fas fa-plus';
      }
    }
  }

  configurarWidget(widgetId) {
    const widget = this.widgets.find((w) => w.id === widgetId);
    if (widget) {
      this.mostrarModalConfiguracionWidget(widget);
    }
  }

  eliminarWidget(widgetId) {
    if (confirm('¿Estás seguro de que quieres eliminar este widget?')) {
      this.widgets = this.widgets.filter((w) => w.id !== widgetId);
      const widgetElement = document.getElementById(`widget-${widgetId}`);
      if (widgetElement) {
        widgetElement.remove();
      }
      this.guardarWidgets();
    }
  }

  mostrarModalPersonalizacion() {
    const modal = this.crearModal('modalPersonalizacion', 'Personalizar Dashboard', this.getContenidoPersonalizacion());
    document.body.appendChild(modal);
  }

  getContenidoPersonalizacion() {
    return `
      <div class="axyra-personalizacion-container">
        <div class="axyra-personalizacion-section">
          <h4>Widgets Disponibles</h4>
          <div class="axyra-widgets-disponibles">
            <div class="axyra-widget-disponible" data-tipo="metricas">
              <i class="fas fa-chart-bar"></i>
              <span>Métricas</span>
            </div>
            <div class="axyra-widget-disponible" data-tipo="grafico">
              <i class="fas fa-chart-pie"></i>
              <span>Gráficos</span>
            </div>
            <div class="axyra-widget-disponible" data-tipo="actividad">
              <i class="fas fa-history"></i>
              <span>Actividad</span>
            </div>
            <div class="axyra-widget-disponible" data-tipo="alertas">
              <i class="fas fa-bell"></i>
              <span>Alertas</span>
            </div>
            <div class="axyra-widget-disponible" data-tipo="clima">
              <i class="fas fa-sun"></i>
              <span>Clima</span>
            </div>
            <div class="axyra-widget-disponible" data-tipo="noticias">
              <i class="fas fa-newspaper"></i>
              <span>Noticias</span>
            </div>
          </div>
        </div>
        
        <div class="axyra-personalizacion-section">
          <h4>Widgets Actuales</h4>
          <div class="axyra-widgets-actuales" id="widgets-actuales">
            ${this.widgets
              .map(
                (widget) => `
              <div class="axyra-widget-actual" data-id="${widget.id}">
                <i class="fas fa-${this.getIconoWidget(widget.tipo)}"></i>
                <span>${widget.titulo}</span>
                <button onclick="axyraDashboard.eliminarWidget('${widget.id}')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            `
              )
              .join('')}
          </div>
        </div>
      </div>
    `;
  }

  getIconoWidget(tipo) {
    const iconos = {
      metricas: 'chart-bar',
      grafico: 'chart-pie',
      actividad: 'history',
      alertas: 'bell',
      clima: 'sun',
      noticias: 'newspaper',
    };
    return iconos[tipo] || 'square';
  }

  mostrarModalConfiguracion() {
    const modal = this.crearModal(
      'modalConfiguracion',
      'Configuración del Dashboard',
      this.getContenidoConfiguracion()
    );
    document.body.appendChild(modal);
  }

  getContenidoConfiguracion() {
    return `
      <div class="axyra-configuracion-container">
        <div class="axyra-configuracion-section">
          <h4>Actualización Automática</h4>
          <div class="axyra-form-group">
            <label>
              <input type="checkbox" id="actualizacionAutomatica" ${
                this.configuracion.actualizacionAutomatica ? 'checked' : ''
              }>
              Habilitar actualización automática
            </label>
          </div>
          <div class="axyra-form-group">
            <label for="intervaloActualizacion">Intervalo de actualización (segundos):</label>
            <input type="number" id="intervaloActualizacion" value="${
              this.configuracion.intervaloActualizacion / 1000
            }" min="10" max="300">
          </div>
        </div>
        
        <div class="axyra-configuracion-section">
          <h4>Notificaciones</h4>
          <div class="axyra-form-group">
            <label>
              <input type="checkbox" id="sonidoNotificaciones" ${
                this.configuracion.notificaciones.sonido ? 'checked' : ''
              }>
              Sonido de notificaciones
            </label>
          </div>
          <div class="axyra-form-group">
            <label>
              <input type="checkbox" id="pushNotificaciones" ${this.configuracion.notificaciones.push ? 'checked' : ''}>
              Notificaciones push
            </label>
          </div>
        </div>
        
        <div class="axyra-configuracion-section">
          <h4>Tema</h4>
          <div class="axyra-form-group">
            <label for="temaDashboard">Tema del dashboard:</label>
            <select id="temaDashboard">
              <option value="claro" ${this.configuracion.tema === 'claro' ? 'selected' : ''}>Claro</option>
              <option value="oscuro" ${this.configuracion.tema === 'oscuro' ? 'selected' : ''}>Oscuro</option>
              <option value="auto" ${this.configuracion.tema === 'auto' ? 'selected' : ''}>Automático</option>
            </select>
          </div>
        </div>
      </div>
    `;
  }

  guardarConfiguracion() {
    const nuevaConfig = {
      actualizacionAutomatica: document.getElementById('actualizacionAutomatica').checked,
      intervaloActualizacion: parseInt(document.getElementById('intervaloActualizacion').value) * 1000,
      notificaciones: {
        sonido: document.getElementById('sonidoNotificaciones').checked,
        push: document.getElementById('pushNotificaciones').checked,
      },
      tema: document.getElementById('temaDashboard').value,
    };

    this.configuracion = { ...this.configuracion, ...nuevaConfig };
    localStorage.setItem('axyra_dashboard_config', JSON.stringify(this.configuracion));

    // Reiniciar actualizaciones si es necesario
    if (this.intervalos.actualizacion) {
      clearInterval(this.intervalos.actualizacion);
    }
    this.iniciarActualizacionesTiempoReal();

    this.mostrarExito('Configuración guardada correctamente');
    this.cerrarModal('modalConfiguracion');
  }

  guardarWidgets() {
    localStorage.setItem('axyra_dashboard_widgets', JSON.stringify(this.widgets));
  }

  cerrarAlerta(alertaId) {
    this.alertas = this.alertas.filter((a) => a.id !== alertaId);
    localStorage.setItem('axyra_dashboard_alertas', JSON.stringify(this.alertas));
    this.actualizarWidgets();
  }

  // ========================================
  // UTILIDADES
  // ========================================

  crearModal(id, titulo, contenido) {
    const modal = document.createElement('div');
    modal.className = 'axyra-modal-overlay';
    modal.id = id;

    modal.innerHTML = `
      <div class="axyra-modal-content axyra-modal-large">
        <div class="axyra-modal-header">
          <h3>${titulo}</h3>
          <button class="axyra-modal-close" onclick="axyraDashboard.cerrarModal('${id}')">×</button>
        </div>
        <div class="axyra-modal-body">
          ${contenido}
        </div>
        <div class="axyra-modal-footer">
          <button class="axyra-btn axyra-btn-secondary" onclick="axyraDashboard.cerrarModal('${id}')">
            <i class="fas fa-times"></i> Cerrar
          </button>
          ${
            id === 'modalConfiguracion'
              ? `
            <button class="axyra-btn axyra-btn-primary" onclick="axyraDashboard.guardarConfiguracion()">
              <i class="fas fa-save"></i> Guardar
            </button>
          `
              : ''
          }
        </div>
      </div>
    `;

    return modal;
  }

  cerrarModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.remove();
    }
  }

  mostrarExito(mensaje) {
    this.mostrarNotificacion(mensaje, 'success');
  }

  mostrarError(mensaje) {
    this.mostrarNotificacion(mensaje, 'error');
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `axyra-notificacion axyra-notificacion-${tipo}`;
    notificacion.innerHTML = `
      <div class="axyra-notificacion-content">
        <i class="fas fa-${
          tipo === 'error' ? 'exclamation-triangle' : tipo === 'success' ? 'check-circle' : 'info-circle'
        }"></i>
        <span>${mensaje}</span>
        <button onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      if (notificacion.parentElement) {
        notificacion.remove();
      }
    }, 5000);
  }

  // Limpiar recursos
  destroy() {
    Object.values(this.intervalos).forEach((intervalo) => {
      if (intervalo) clearInterval(intervalo);
    });

    if (this.charts) {
      Object.values(this.charts).forEach((chart) => {
        if (chart && typeof chart.destroy === 'function') {
          chart.destroy();
        }
      });
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
  window.axyraDashboard = new AxyraDashboardAvanzado();
});
