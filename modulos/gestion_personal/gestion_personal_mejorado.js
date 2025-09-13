// Sistema Mejorado de Gestión de Personal - AXYRA
// Versión profesional sin botones de prueba

class AxyraGestionPersonal {
  constructor() {
    this.empleados = [];
    this.horas = [];
    this.departamentos = [];
    this.nominas = [];
    this.currentTab = 'horas';
    this.empleadoSeleccionado = null;
    this.horasSeleccionadas = null;

    this.init();
  }

  async init() {
    try {
      console.log('🚀 Inicializando Sistema de Gestión de Personal AXYRA...');

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

      // Actualizar estadísticas
      this.actualizarEstadisticas();

      // Configurar formularios
      this.configurarFormularios();

      console.log('✅ Sistema de Gestión de Personal AXYRA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de gestión personal:', error);
      this.showErrorMessage('Error inicializando el sistema de gestión personal');
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
    const container = document.querySelector('.gestion-personal-container');
    if (container) {
      container.innerHTML = `
        <div class="axyra-login-message" style="text-align: center; padding: 60px 20px;">
          <div style="font-size: 4rem; color: #4f81bd; margin-bottom: 20px;">
            <i class="fas fa-lock"></i>
          </div>
          <h2 style="color: #374151; margin-bottom: 16px;">Acceso Requerido</h2>
          <p style="color: #6b7280; margin-bottom: 24px;">
            Necesitas iniciar sesión para acceder al sistema de gestión de personal
          </p>
          <a href="../../login.html" class="gestion-personal-btn gestion-personal-btn-primary">
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
      console.log('📊 Cargando datos del sistema de gestión personal...');

      // Cargar empleados
      if (this.firebaseSyncManager) {
        this.empleados = (await this.firebaseSyncManager.getEmpleados()) || [];
        this.horas = (await this.firebaseSyncManager.getHoras()) || [];
        this.departamentos = (await this.firebaseSyncManager.getDepartamentos()) || [];
        this.nominas = (await this.firebaseSyncManager.getNominas()) || [];
      } else {
        // Fallback a localStorage
        this.empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
        this.horas = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
        this.departamentos = JSON.parse(localStorage.getItem('axyra_departamentos') || '[]');
        this.nominas = JSON.parse(localStorage.getItem('axyra_nominas') || '[]');
      }

      // Llenar selectores
      this.llenarSelectorEmpleados();
      this.llenarSelectorDepartamentos();

      // Renderizar contenido
      this.renderizarEmpleados();
      this.renderizarHoras();
      this.renderizarNominas();
      this.actualizarEstadisticas();

      console.log('✅ Datos cargados:', {
        empleados: this.empleados.length,
        horas: this.horas.length,
        departamentos: this.departamentos.length,
        nominas: this.nominas.length,
      });
    } catch (error) {
      console.error('❌ Error cargando datos:', error);
      this.showErrorMessage('Error cargando datos del sistema');
    }
  }

  llenarSelectorEmpleados() {
    const selectores = ['empleadoHoras', 'reporteEmpleadoSelect'];

    selectores.forEach((selectorId) => {
      const selector = document.getElementById(selectorId);
      if (!selector) return;

      // Limpiar opciones existentes
      selector.innerHTML = '<option value="">Seleccionar empleado</option>';

      // Agregar empleados activos
      this.empleados
        .filter((emp) => emp.estado === 'activo' || emp.estado === 'ACTIVO')
        .forEach((empleado) => {
          const option = document.createElement('option');
          option.value = empleado.id;
          option.textContent = `${empleado.nombre} - ${empleado.cargo || 'Sin cargo'}`;
          selector.appendChild(option);
        });
    });
  }

  llenarSelectorDepartamentos() {
    const selectores = [
      'departamentoEmpleado',
      'reporteDepartamento',
      'nominaDepartamento',
      'exportDepartamentoEmpleados',
    ];

    selectores.forEach((selectorId) => {
      const selector = document.getElementById(selectorId);
      if (!selector) return;

      // Limpiar opciones existentes
      selector.innerHTML = '<option value="">Todos los departamentos</option>';

      // Agregar departamentos
      this.departamentos.forEach((departamento) => {
        const option = document.createElement('option');
        option.value = departamento.nombre;
        option.textContent = departamento.nombre;
        selector.appendChild(option);
      });
    });
  }

  configurarEventos() {
    try {
      // Event listeners para tabs
      const tabs = document.querySelectorAll('.gestion-personal-tab');
      tabs.forEach((tab) => {
        tab.addEventListener('click', (e) => {
          const tabName = e.currentTarget.getAttribute('onclick').match(/'([^']+)'/)[1];
          this.cambiarTab(tabName);
        });
      });

      // Event listeners para formularios
      const formRegistroHoras = document.getElementById('formRegistroHoras');
      if (formRegistroHoras) {
        formRegistroHoras.addEventListener('submit', (e) => {
          e.preventDefault();
          this.registrarHoras();
        });
      }

      // Event listeners para inputs de horas
      const inputsHoras = document.querySelectorAll('input[name^="horas_"]');
      inputsHoras.forEach((input) => {
        input.addEventListener('input', () => {
          this.calcularValoresHoras();
        });
      });

      // Event listener para selector de empleado
      const selectorEmpleado = document.getElementById('empleadoHoras');
      if (selectorEmpleado) {
        selectorEmpleado.addEventListener('change', (e) => {
          this.empleadoSeleccionado = this.empleados.find((emp) => emp.id === e.target.value);
          this.calcularValoresHoras();
        });
      }

      console.log('✅ Eventos configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando eventos:', error);
    }
  }

  configurarFormularios() {
    try {
      // Configurar fecha por defecto
      const fechaInput = document.getElementById('fechaHoras');
      if (fechaInput) {
        fechaInput.value = new Date().toISOString().split('T')[0];
      }

      // Configurar validaciones
      this.configurarValidaciones();

      console.log('✅ Formularios configurados correctamente');
    } catch (error) {
      console.error('❌ Error configurando formularios:', error);
    }
  }

  configurarValidaciones() {
    // Validación de cédula colombiana
    const cedulaInput = document.getElementById('cedulaEmpleado');
    if (cedulaInput) {
      cedulaInput.addEventListener('input', (e) => {
        const cedula = e.target.value.replace(/\D/g, '');
        if (cedula.length > 10) {
          e.target.value = cedula.substring(0, 10);
        }
      });
    }

    // Validación de salarios
    const salarioInputs = document.querySelectorAll('input[type="text"][pattern="[0-9]*"]');
    salarioInputs.forEach((input) => {
      input.addEventListener('input', (e) => {
        const value = e.target.value.replace(/\D/g, '');
        e.target.value = value;
      });
    });
  }

  cambiarTab(tabName) {
    try {
      // Remover clase active de todas las tabs
      document.querySelectorAll('.gestion-personal-tab').forEach((tab) => {
        tab.classList.remove('active');
      });

      // Remover clase active de todos los contenidos
      document.querySelectorAll('.tab-content').forEach((content) => {
        content.classList.remove('active');
      });

      // Activar tab seleccionada
      const tabButton = document.querySelector(`[onclick*="'${tabName}'"]`);
      if (tabButton) {
        tabButton.classList.add('active');
      }

      // Activar contenido correspondiente
      const tabContent = document.getElementById(`tab-${tabName}`);
      if (tabContent) {
        tabContent.classList.add('active');
      }

      this.currentTab = tabName;

      // Cargar datos específicos de la tab
      switch (tabName) {
        case 'horas':
          this.renderizarHoras();
          break;
        case 'nomina':
          this.renderizarNominas();
          break;
        case 'empleados':
          this.renderizarEmpleados();
          break;
        case 'reportes':
          this.renderizarReportes();
          break;
      }

      console.log(`✅ Tab cambiada a: ${tabName}`);
    } catch (error) {
      console.error('❌ Error cambiando tab:', error);
    }
  }

  calcularValoresHoras() {
    try {
      if (!this.empleadoSeleccionado) return;

      const salarioBase = this.empleadoSeleccionado.salario || 0;
      const valorHoraBase = salarioBase / 220; // 220 horas mensuales

      const tiposHoras = {
        ordinarias: { factor: 1.0, label: 'Ordinarias' },
        recargo_nocturno: { factor: 1.35, label: 'Recargo Nocturno' },
        recargo_diurno_dominical: { factor: 1.75, label: 'Recargo Diurno Dominical' },
        recargo_nocturno_dominical: { factor: 2.1, label: 'Recargo Nocturno Dominical' },
        hora_extra_diurna: { factor: 1.25, label: 'Hora Extra Diurna' },
        hora_extra_nocturna: { factor: 1.75, label: 'Hora Extra Nocturna' },
        hora_diurna_dominical_o_festivo: { factor: 1.8, label: 'Hora Diurna Dominical/Festivo' },
        hora_extra_diurna_dominical_o_festivo: { factor: 2.1, label: 'Hora Extra Diurna Dominical/Festivo' },
        hora_nocturna_dominical_o_festivo: { factor: 2.05, label: 'Hora Nocturna Dominical/Festivo' },
        hora_extra_nocturna_dominical_o_festivo: { factor: 2.85, label: 'Hora Extra Nocturna Dominical/Festivo' },
      };

      Object.entries(tiposHoras).forEach(([tipo, config]) => {
        const input = document.getElementById(`horas_${tipo}`);
        const valorElement = document.querySelector(`[data-tipo-hora="${tipo}"]`);

        if (input && valorElement) {
          const horas = parseFloat(input.value) || 0;
          const valorHora = valorHoraBase * config.factor;
          const valorTotal = horas * valorHora;

          valorElement.textContent = `Valor: $${valorTotal.toLocaleString()}`;
        }
      });
    } catch (error) {
      console.error('❌ Error calculando valores de horas:', error);
    }
  }

  async registrarHoras() {
    try {
      const formData = new FormData(document.getElementById('formRegistroHoras'));
      const empleadoId = formData.get('empleadoHoras');
      const fecha = formData.get('fechaHoras');

      if (!empleadoId || !fecha) {
        this.showErrorMessage('Por favor seleccione un empleado y una fecha');
        return;
      }

      // Recopilar datos de horas
      const horasData = {
        empleado_id: empleadoId,
        fecha: fecha,
        horas: {
          ordinarias: parseFloat(formData.get('horas_ordinarias')) || 0,
          recargo_nocturno: parseFloat(formData.get('horas_recargo_nocturno')) || 0,
          recargo_diurno_dominical: parseFloat(formData.get('horas_recargo_diurno_dominical')) || 0,
          recargo_nocturno_dominical: parseFloat(formData.get('horas_recargo_nocturno_dominical')) || 0,
          hora_extra_diurna: parseFloat(formData.get('horas_hora_extra_diurna')) || 0,
          hora_extra_nocturna: parseFloat(formData.get('horas_hora_extra_nocturna')) || 0,
          hora_diurna_dominical_o_festivo: parseFloat(formData.get('horas_hora_diurna_dominical_o_festivo')) || 0,
          hora_extra_diurna_dominical_o_festivo:
            parseFloat(formData.get('horas_hora_extra_diurna_dominical_o_festivo')) || 0,
          hora_nocturna_dominical_o_festivo: parseFloat(formData.get('horas_hora_nocturna_dominical_o_festivo')) || 0,
          hora_extra_nocturna_dominical_o_festivo:
            parseFloat(formData.get('horas_hora_extra_nocturna_dominical_o_festivo')) || 0,
        },
        created_at: new Date().toISOString(),
        user_id: this.getCurrentUserId(),
      };

      // Calcular total de horas
      horasData.total_horas = Object.values(horasData.horas).reduce((sum, horas) => sum + horas, 0);

      if (horasData.total_horas === 0) {
        this.showErrorMessage('Debe registrar al menos una hora');
        return;
      }

      // Guardar en Firebase o localStorage
      if (this.firebaseSyncManager) {
        await this.firebaseSyncManager.guardarHoras(horasData);
      } else {
        this.horas.push(horasData);
        localStorage.setItem('axyra_horas', JSON.stringify(this.horas));
      }

      // Limpiar formulario
      this.limpiarFormularioHoras();

      // Actualizar vista
      this.renderizarHoras();
      this.actualizarEstadisticas();

      if (window.axyraModals) {
        window.axyraModals.showSuccessModal('Horas Registradas', 'Las horas se han registrado correctamente');
      } else {
        alert('Horas registradas correctamente');
      }

      console.log('✅ Horas registradas correctamente');
    } catch (error) {
      console.error('❌ Error registrando horas:', error);
      this.showErrorMessage('Error registrando las horas');
    }
  }

  limpiarFormularioHoras() {
    try {
      const form = document.getElementById('formRegistroHoras');
      if (form) {
        form.reset();
        document.getElementById('fechaHoras').value = new Date().toISOString().split('T')[0];
      }

      // Limpiar valores mostrados
      document.querySelectorAll('.valor-hora').forEach((element) => {
        element.textContent = 'Valor: $0';
      });

      this.empleadoSeleccionado = null;
    } catch (error) {
      console.error('❌ Error limpiando formulario:', error);
    }
  }

  renderizarEmpleados() {
    try {
      const tbody = document.getElementById('cuerpoEmpleados');
      if (!tbody) return;

      tbody.innerHTML = '';

      this.empleados.forEach((empleado) => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${empleado.nombre || 'N/A'}</td>
          <td>${empleado.cedula || 'N/A'}</td>
          <td>${empleado.cargo || 'Sin cargo'}</td>
          <td>${empleado.departamento || 'Sin departamento'}</td>
          <td>$${(empleado.salario || 0).toLocaleString()}</td>
          <td>${empleado.tipoContrato || 'N/A'}</td>
          <td>
            <span class="badge ${empleado.estado === 'activo' ? 'badge-success' : 'badge-warning'}">
              ${empleado.estado || 'N/A'}
            </span>
          </td>
          <td>
            <button class="btn btn-primary-sm" onclick="gestionPersonal.editarEmpleado('${empleado.id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger-sm" onclick="gestionPersonal.eliminarEmpleado('${empleado.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });

      console.log(`✅ ${this.empleados.length} empleados renderizados`);
    } catch (error) {
      console.error('❌ Error renderizando empleados:', error);
    }
  }

  renderizarHoras() {
    try {
      const tbody = document.getElementById('cuerpoHistorialHoras');
      if (!tbody) return;

      tbody.innerHTML = '';

      // Ordenar horas por fecha (más recientes primero)
      const horasOrdenadas = [...this.horas].sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      horasOrdenadas.forEach((hora) => {
        const empleado = this.empleados.find((emp) => emp.id === hora.empleado_id);
        const empleadoNombre = empleado ? empleado.nombre : 'Empleado no encontrado';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${hora.fecha || 'N/A'}</td>
          <td>${empleadoNombre}</td>
          <td>${hora.horas.ordinarias || 0}</td>
          <td>${hora.horas.recargo_nocturno || 0}</td>
          <td>${hora.horas.recargo_diurno_dominical || 0}</td>
          <td>${hora.horas.recargo_nocturno_dominical || 0}</td>
          <td>${hora.horas.hora_extra_diurna || 0}</td>
          <td>${hora.horas.hora_extra_nocturna || 0}</td>
          <td>${hora.horas.hora_diurna_dominical_o_festivo || 0}</td>
          <td>${hora.horas.hora_extra_diurna_dominical_o_festivo || 0}</td>
          <td>${hora.horas.hora_nocturna_dominical_o_festivo || 0}</td>
          <td>${hora.horas.hora_extra_nocturna_dominical_o_festivo || 0}</td>
          <td>${hora.total_horas || 0}</td>
          <td>$${this.calcularTotalPago(hora).toLocaleString()}</td>
          <td>
            <button class="btn btn-warning-sm" onclick="gestionPersonal.editarHoras('${hora.id || hora.empleado_id}')">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-danger-sm" onclick="gestionPersonal.eliminarHoras('${hora.id || hora.empleado_id}')">
              <i class="fas fa-trash"></i>
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });

      console.log(`✅ ${this.horas.length} registros de horas renderizados`);
    } catch (error) {
      console.error('❌ Error renderizando horas:', error);
    }
  }

  renderizarNominas() {
    try {
      const tbody = document.getElementById('cuerpoNominas');
      if (!tbody) return;

      tbody.innerHTML = '';

      this.nominas.forEach((nomina) => {
        const empleado = this.empleados.find((emp) => emp.id === nomina.empleado_id);
        const empleadoNombre = empleado ? empleado.nombre : 'Empleado no encontrado';

        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${nomina.periodo || 'N/A'}</td>
          <td>${empleadoNombre}</td>
          <td>${nomina.total_horas || 0}</td>
          <td>$${(nomina.salario_base || 0).toLocaleString()}</td>
          <td>$${(nomina.total_pagar || 0).toLocaleString()}</td>
          <td>
            <span class="badge ${nomina.estado === 'generada' ? 'badge-success' : 'badge-warning'}">
              ${nomina.estado || 'Pendiente'}
            </span>
          </td>
          <td>
            <button class="btn btn-primary-sm" onclick="gestionPersonal.verNomina('${nomina.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-success-sm" onclick="gestionPersonal.descargarNomina('${nomina.id}')">
              <i class="fas fa-download"></i>
            </button>
          </td>
        `;
        tbody.appendChild(row);
      });

      console.log(`✅ ${this.nominas.length} nóminas renderizadas`);
    } catch (error) {
      console.error('❌ Error renderizando nóminas:', error);
    }
  }

  renderizarReportes() {
    try {
      const container = document.getElementById('graficosContainer');
      if (!container) return;

      // Aquí se pueden agregar gráficos usando Chart.js
      container.innerHTML = `
        <div class="reporte-placeholder" style="text-align: center; padding: 40px; color: #6b7280;">
          <i class="fas fa-chart-bar" style="font-size: 3rem; margin-bottom: 16px;"></i>
          <h3>Reportes y Estadísticas</h3>
          <p>Los gráficos y reportes se generarán dinámicamente aquí</p>
        </div>
      `;

      console.log('✅ Reportes renderizados');
    } catch (error) {
      console.error('❌ Error renderizando reportes:', error);
    }
  }

  calcularTotalPago(hora) {
    try {
      if (!hora.horas || !this.empleadoSeleccionado) return 0;

      const empleado = this.empleados.find((emp) => emp.id === hora.empleado_id);
      if (!empleado) return 0;

      const salarioBase = empleado.salario || 0;
      const valorHoraBase = salarioBase / 220;

      let total = 0;
      const tiposHoras = {
        ordinarias: 1.0,
        recargo_nocturno: 1.35,
        recargo_diurno_dominical: 1.75,
        recargo_nocturno_dominical: 2.1,
        hora_extra_diurna: 1.25,
        hora_extra_nocturna: 1.75,
        hora_diurna_dominical_o_festivo: 1.8,
        hora_extra_diurna_dominical_o_festivo: 2.1,
        hora_nocturna_dominical_o_festivo: 2.05,
        hora_extra_nocturna_dominical_o_festivo: 2.85,
      };

      Object.entries(tiposHoras).forEach(([tipo, factor]) => {
        const horas = hora.horas[tipo] || 0;
        const valorHora = valorHoraBase * factor;
        total += horas * valorHora;
      });

      return Math.round(total);
    } catch (error) {
      console.error('❌ Error calculando total de pago:', error);
      return 0;
    }
  }

  actualizarEstadisticas() {
    try {
      // Total empleados
      const totalEmpleados = this.empleados.length;
      const totalEmpleadosElement = document.getElementById('totalEmpleados');
      if (totalEmpleadosElement) {
        totalEmpleadosElement.textContent = totalEmpleados;
      }

      // Horas del mes
      const mesActual = new Date().getMonth();
      const añoActual = new Date().getFullYear();
      const horasMes = this.horas
        .filter((h) => {
          const fecha = new Date(h.fecha);
          return fecha.getMonth() === mesActual && fecha.getFullYear() === añoActual;
        })
        .reduce((sum, h) => sum + (h.total_horas || 0), 0);

      const horasMesElement = document.getElementById('horasMes');
      if (horasMesElement) {
        horasMesElement.textContent = horasMes.toFixed(1);
      }

      // Total pagos
      const totalPagos = this.horas.reduce((sum, h) => sum + this.calcularTotalPago(h), 0);
      const totalPagosElement = document.getElementById('totalPagos');
      if (totalPagosElement) {
        totalPagosElement.textContent = `$${totalPagos.toLocaleString()}`;
      }

      // Nóminas generadas
      const nominasGeneradas = this.nominas.filter((n) => n.estado === 'generada').length;
      const nominasGeneradasElement = document.getElementById('nominasGeneradas');
      if (nominasGeneradasElement) {
        nominasGeneradasElement.textContent = nominasGeneradas;
      }

      console.log('✅ Estadísticas actualizadas');
    } catch (error) {
      console.error('❌ Error actualizando estadísticas:', error);
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

  // Métodos para acciones de empleados
  editarEmpleado(empleadoId) {
    console.log('Editar empleado:', empleadoId);
    // Implementar edición de empleado
  }

  eliminarEmpleado(empleadoId) {
    if (window.axyraModals) {
      window.axyraModals.showDeleteWidgetModal('Empleado', () => {
        this.empleados = this.empleados.filter((emp) => emp.id !== empleadoId);
        localStorage.setItem('axyra_empleados', JSON.stringify(this.empleados));
        this.renderizarEmpleados();
        this.actualizarEstadisticas();
      });
    } else {
      if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
        this.empleados = this.empleados.filter((emp) => emp.id !== empleadoId);
        localStorage.setItem('axyra_empleados', JSON.stringify(this.empleados));
        this.renderizarEmpleados();
        this.actualizarEstadisticas();
      }
    }
  }

  // Métodos para acciones de horas
  editarHoras(horasId) {
    console.log('Editar horas:', horasId);
    // Implementar edición de horas
  }

  eliminarHoras(horasId) {
    if (window.axyraModals) {
      window.axyraModals.showDeleteWidgetModal('Registro de Horas', () => {
        this.horas = this.horas.filter((h) => h.id !== horasId);
        localStorage.setItem('axyra_horas', JSON.stringify(this.horas));
        this.renderizarHoras();
        this.actualizarEstadisticas();
      });
    } else {
      if (confirm('¿Está seguro de que desea eliminar este registro de horas?')) {
        this.horas = this.horas.filter((h) => h.id !== horasId);
        localStorage.setItem('axyra_horas', JSON.stringify(this.horas));
        this.renderizarHoras();
        this.actualizarEstadisticas();
      }
    }
  }

  // Métodos para acciones de nóminas
  verNomina(nominaId) {
    console.log('Ver nómina:', nominaId);
    // Implementar visualización de nómina
  }

  descargarNomina(nominaId) {
    console.log('Descargar nómina:', nominaId);
    // Implementar descarga de nómina
  }
}

// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Inicializando Sistema de Gestión de Personal AXYRA...');
  window.gestionPersonal = new AxyraGestionPersonal();
});

// Funciones globales para compatibilidad
window.cambiarTab = function (tabName) {
  if (window.gestionPersonal) {
    window.gestionPersonal.cambiarTab(tabName);
  }
};

window.limpiarFormularioHoras = function () {
  if (window.gestionPersonal) {
    window.gestionPersonal.limpiarFormularioHoras();
  }
};

// Funciones de modales (placeholder)
window.mostrarModalEmpleado = function () {
  console.log('Mostrar modal empleado');
};

window.mostrarModalDepartamento = function () {
  console.log('Mostrar modal departamento');
};

window.mostrarModalExportarEmpleados = function () {
  console.log('Mostrar modal exportar empleados');
};

window.mostrarModalRegistroHoras = function () {
  console.log('Mostrar modal registro horas');
};

window.mostrarModalCalculoHoras = function () {
  console.log('Mostrar modal cálculo horas');
};

window.mostrarModalExportarExcel = function () {
  console.log('Mostrar modal exportar excel');
};

window.mostrarModalReporteHoras = function () {
  console.log('Mostrar modal reporte horas');
};

window.mostrarModalGenerarNomina = function () {
  console.log('Mostrar modal generar nómina');
};

window.mostrarModalReporteGeneral = function () {
  console.log('Mostrar modal reporte general');
};

window.mostrarModalReporteEmpleado = function () {
  console.log('Mostrar modal reporte empleado');
};

window.mostrarModalReporteDepartamento = function () {
  console.log('Mostrar modal reporte departamento');
};

console.log('✅ Sistema de Gestión de Personal AXYRA cargado');
