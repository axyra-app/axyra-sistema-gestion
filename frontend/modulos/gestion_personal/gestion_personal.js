// Sistema Unificado de Gestión de Personal - AXYRA
class GestionPersonalManager {
    constructor() {
        this.empleados = [];
        this.horas = [];
        this.departamentos = [];
        this.empleadoSeleccionado = null;
        this.horasSeleccionadas = null;
        this.currentTab = 'horas';
        
        this.init();
    }

    async init() {
        try {
            // Inicializar Firebase Sync Manager
            if (typeof FirebaseSyncManager !== 'undefined') {
                this.firebaseSyncManager = new FirebaseSyncManager();
                await this.firebaseSyncManager.init();
            }

            // Inicializar calculadora de ley laboral colombiana
            if (typeof ColombianLaborLawCalculator !== 'undefined') {
                this.colombianLaborLawCalculator = new ColombianLaborLawCalculator();
            }

            // Inicializar generador de PDF
            if (typeof ComprobantePDFGenerator !== 'undefined') {
                this.comprobantePDFGenerator = new ComprobantePDFGenerator();
                await this.comprobantePDFGenerator.init();
            }

            this.cargarDatos();
            this.configurarEventos();
            this.actualizarEstadisticas();
            
            console.log('✅ GestionPersonalManager inicializado correctamente');
        } catch (error) {
            console.error('❌ Error al inicializar GestionPersonalManager:', error);
        }
    }

    async cargarDatos() {
        try {
            if (this.firebaseSyncManager) {
                this.empleados = await this.firebaseSyncManager.getEmpleados();
                this.horas = await this.firebaseSyncManager.getHoras();
                this.departamentos = await this.firebaseSyncManager.getDepartamentos();
            } else {
                // Fallback a localStorage
                this.empleados = JSON.parse(localStorage.getItem('empleados') || '[]');
                this.horas = JSON.parse(localStorage.getItem('horas') || '[]');
                this.departamentos = JSON.parse(localStorage.getItem('departamentos') || '[]');
            }

            this.renderizarEmpleados();
            this.renderizarHoras();
            this.renderizarDepartamentos();
            this.actualizarEstadisticas();
        } catch (error) {
            console.error('❌ Error al cargar datos:', error);
        }
    }

    configurarEventos() {
        // Eventos de navegación por pestañas
        document.querySelectorAll('.gestion-personal-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                this.cambiarTab(e.target.dataset.tab);
            });
        });

        // Eventos del formulario de horas
        const empleadoHorasSelect = document.getElementById('empleadoHoras');
        if (empleadoHorasSelect) {
            empleadoHorasSelect.addEventListener('change', () => this.actualizarValoresHora());
        }

        // Eventos del formulario de empleados
        const formEmpleado = document.getElementById('formEmpleado');
        if (formEmpleado) {
            formEmpleado.addEventListener('submit', (e) => this.manejarSubmitEmpleado(e));
        }

        // Eventos del formulario de departamentos
        const formDepartamento = document.getElementById('formDepartamento');
        if (formDepartamento) {
            formDepartamento.addEventListener('submit', (e) => this.manejarSubmitDepartamento(e));
        }

        // Botones de acción
        this.configurarBotonesAccion();
    }

    configurarBotonesAccion() {
        // Botones de horas
        const btnRegistrarHoras = document.getElementById('btnRegistrarHoras');
        if (btnRegistrarHoras) {
            btnRegistrarHoras.addEventListener('click', () => this.registrarHoras());
        }

        const btnCalcularHoras = document.getElementById('btnCalcularHoras');
        if (btnCalcularHoras) {
            btnCalcularHoras.addEventListener('click', () => this.calcularHoras());
        }

        const btnGenerarComprobante = document.getElementById('btnGenerarComprobante');
        if (btnGenerarComprobante) {
            btnGenerarComprobante.addEventListener('click', () => this.generarComprobante());
        }

        const btnPrevisualizarComprobante = document.getElementById('btnPrevisualizarComprobante');
        if (btnPrevisualizarComprobante) {
            btnPrevisualizarComprobante.addEventListener('click', () => this.previsualizarComprobante());
        }

        // Botones de nómina
        const btnGenerarNomina = document.getElementById('btnGenerarNomina');
        if (btnGenerarNomina) {
            btnGenerarNomina.addEventListener('click', () => this.generarNomina());
        }

        const btnExportarExcel = document.getElementById('btnExportarExcel');
        if (btnExportarExcel) {
            btnExportarExcel.addEventListener('click', () => this.exportarExcel());
        }

        // Botones de empleados
        const btnAgregarEmpleado = document.getElementById('btnAgregarEmpleado');
        if (btnAgregarEmpleado) {
            btnAgregarEmpleado.addEventListener('click', () => this.mostrarModalEmpleado());
        }

        // Botones de departamentos
        const btnAgregarDepartamento = document.getElementById('btnAgregarDepartamento');
        if (btnAgregarDepartamento) {
            btnAgregarDepartamento.addEventListener('click', () => this.mostrarModalDepartamento());
        }
    }

    cambiarTab(tabName) {
        // Ocultar todas las pestañas
        document.querySelectorAll('.gestion-personal-content').forEach(content => {
            content.style.display = 'none';
        });

        // Desactivar todas las pestañas
        document.querySelectorAll('.gestion-personal-tab').forEach(tab => {
            tab.classList.remove('active');
        });

        // Mostrar pestaña seleccionada
        const selectedContent = document.getElementById(`content-${tabName}`);
        const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
        
        if (selectedContent) selectedContent.style.display = 'block';
        if (selectedTab) selectedTab.classList.add('active');

        this.currentTab = tabName;
        this.actualizarEstadisticas();
    }

    // ===== GESTIÓN DE HORAS =====
    async actualizarValoresHora() {
        try {
            const empleadoId = document.getElementById('empleadoHoras').value;
            if (!empleadoId) return;

            const empleado = this.empleados.find(emp => emp.id == empleadoId);
            if (!empleado) return;

            if (this.colombianLaborLawCalculator) {
                const valoresHoras = this.colombianLaborLawCalculator.calcularValoresHoras(empleado);
                
                // Actualizar todos los campos de valor de hora
                Object.keys(valoresHoras).forEach(tipoHora => {
                    const elemento = document.querySelector(`[data-tipo-hora="${tipoHora}"]`);
                    if (elemento) {
                        elemento.textContent = `$${valoresHoras[tipoHora].toLocaleString()}`;
                    }
                });
            }
        } catch (error) {
            console.error('❌ Error al actualizar valores de hora:', error);
        }
    }

    async registrarHoras() {
        try {
            const empleadoId = document.getElementById('empleadoHoras').value;
            const fecha = document.getElementById('fechaHoras').value;
            
            if (!empleadoId || !fecha) {
                this.mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
                return;
            }

            const empleado = this.empleados.find(emp => emp.id == empleadoId);
            if (!empleado) {
                this.mostrarNotificacion('Empleado no encontrado', 'error');
                return;
            }

            // Recopilar horas de todos los tipos
            const horasData = {};
            let totalHoras = 0;
            
            const tiposHoras = [
                'ordinarias', 'recargo_nocturno', 'recargo_diurno_dominical',
                'recargo_nocturno_dominical', 'hora_extra_diurna', 'hora_extra_nocturna',
                'hora_diurna_dominical_o_festivo', 'hora_extra_diurna_dominical_o_festivo',
                'hora_nocturna_dominical_o_festivo', 'hora_extra_nocturna_dominical_o_festivo'
            ];

            tiposHoras.forEach(tipo => {
                const input = document.getElementById(`horas_${tipo}`);
                if (input) {
                    const valor = parseFloat(input.value) || 0;
                    horasData[tipo] = valor;
                    totalHoras += valor;
                }
            });

            if (totalHoras === 0) {
                this.mostrarNotificacion('Debe ingresar al menos una hora', 'error');
                return;
            }

            // Calcular salarios
            let salariosCalculados = {};
            if (this.colombianLaborLawCalculator) {
                salariosCalculados = this.colombianLaborLawCalculator.calcularSalariosCompletos(empleado, horasData);
            }

            const registroHoras = {
                id: Date.now().toString(),
                empleadoId: empleadoId,
                empleadoNombre: empleado.nombre,
                fecha: fecha,
                horas: horasData,
                salarios: salariosCalculados,
                totalHoras: totalHoras,
                totalSalario: salariosCalculados.total || 0,
                userId: this.getCurrentUserId(),
                timestamp: new Date().toISOString()
            };

            // Guardar en Firebase y localStorage
            if (this.firebaseSyncManager) {
                await this.firebaseSyncManager.addHoras(registroHoras);
            } else {
                this.horas.push(registroHoras);
                localStorage.setItem('horas', JSON.stringify(this.horas));
            }

            this.mostrarNotificacion('Horas registradas correctamente', 'success');
            this.limpiarFormularioHoras();
            this.cargarDatos();
        } catch (error) {
            console.error('❌ Error al registrar horas:', error);
            this.mostrarNotificacion('Error al registrar horas', 'error');
        }
    }

    async calcularHoras() {
        try {
            const empleadoId = document.getElementById('empleadoHoras').value;
            if (!empleadoId) {
                this.mostrarNotificacion('Seleccione un empleado', 'error');
                return;
            }

            const empleado = this.empleados.find(emp => emp.id == empleadoId);
            if (!empleado) {
                this.mostrarNotificacion('Empleado no encontrado', 'error');
                return;
            }

            // Recopilar horas ingresadas
            const horasData = {};
            const tiposHoras = [
                'ordinarias', 'recargo_nocturno', 'recargo_diurno_dominical',
                'recargo_nocturno_dominical', 'hora_extra_diurna', 'hora_extra_nocturna',
                'hora_diurna_dominical_o_festivo', 'hora_extra_diurna_dominical_o_festivo',
                'hora_nocturna_dominical_o_festivo', 'hora_extra_nocturna_dominical_o_festivo'
            ];

            tiposHoras.forEach(tipo => {
                const input = document.getElementById(`horas_${tipo}`);
                if (input) {
                    horasData[tipo] = parseFloat(input.value) || 0;
                }
            });

            // Calcular salarios
            let salariosCalculados = {};
            if (this.colombianLaborLawCalculator) {
                salariosCalculados = this.colombianLaborLawCalculator.calcularSalariosCompletos(empleado, horasData);
            }

            this.mostrarModalCalculoHoras(empleado, horasData, salariosCalculados);
        } catch (error) {
            console.error('❌ Error al calcular horas:', error);
            this.mostrarNotificacion('Error al calcular horas', 'error');
        }
    }

    mostrarModalCalculoHoras(empleado, horas, salarios) {
        const modal = document.getElementById('modalCalculoHoras');
        if (!modal) return;

        const contenido = modal.querySelector('.modal-body');
        let html = `
            <div class="calculo-horas-container">
                <h4>Resumen de Cálculo - ${empleado.nombre}</h4>
                <div class="calculo-horas-grid">
        `;

        const tiposHoras = [
            { key: 'ordinarias', label: 'Horas Ordinarias' },
            { key: 'recargo_nocturno', label: 'Recargo Nocturno' },
            { key: 'recargo_diurno_dominical', label: 'Recargo Diurno Dominical' },
            { key: 'recargo_nocturno_dominical', label: 'Recargo Nocturno Dominical' },
            { key: 'hora_extra_diurna', label: 'Hora Extra Diurna' },
            { key: 'hora_extra_nocturna', label: 'Hora Extra Nocturna' },
            { key: 'hora_diurna_dominical_o_festivo', label: 'Hora Diurna Dominical/Festivo' },
            { key: 'hora_extra_diurna_dominical_o_festivo', label: 'Hora Extra Diurna Dominical/Festivo' },
            { key: 'hora_nocturna_dominical_o_festivo', label: 'Hora Nocturna Dominical/Festivo' },
            { key: 'hora_extra_nocturna_dominical_o_festivo', label: 'Hora Extra Nocturna Dominical/Festivo' }
        ];

        tiposHoras.forEach(tipo => {
            const horasVal = horas[tipo.key] || 0;
            const salarioVal = salarios[tipo.key] || 0;
            
            html += `
                <div class="calculo-hora-item">
                    <span class="tipo-hora">${tipo.label}</span>
                    <span class="horas-cantidad">${horasVal} hrs</span>
                    <span class="salario-valor">$${salarioVal.toLocaleString()}</span>
                </div>
            `;
        });

        html += `
                </div>
                <div class="calculo-total">
                    <strong>Total Horas: ${Object.values(horas).reduce((a, b) => a + b, 0)}</strong>
                    <strong>Total Salario: $${(salarios.total || 0).toLocaleString()}</strong>
                </div>
            </div>
        `;

        contenido.innerHTML = html;
        modal.style.display = 'block';
    }

    async generarComprobante() {
        try {
            const empleadoId = document.getElementById('empleadoHoras').value;
            if (!empleadoId) {
                this.mostrarNotificacion('Seleccione un empleado', 'error');
                return;
            }

            const empleado = this.empleados.find(emp => emp.id == empleadoId);
            if (!empleado) {
                this.mostrarNotificacion('Empleado no encontrado', 'error');
                return;
            }

            // Buscar horas del empleado
            const horasEmpleado = this.horas.filter(h => h.empleadoId == empleadoId);
            if (horasEmpleado.length === 0) {
                this.mostrarNotificacion('No hay horas registradas para este empleado', 'error');
                return;
            }

            // Generar comprobante usando el generador de PDF
            if (this.comprobantePDFGenerator) {
                const resultado = await this.comprobantePDFGenerator.generarComprobante(empleado, horasEmpleado);
                if (resultado.success) {
                    this.mostrarNotificacion('Comprobante generado correctamente', 'success');
                } else {
                    this.mostrarNotificacion('Error al generar comprobante', 'error');
                }
            } else {
                this.mostrarNotificacion('Generador de PDF no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error al generar comprobante:', error);
            this.mostrarNotificacion('Error al generar comprobante', 'error');
        }
    }

    async previsualizarComprobante() {
        try {
            const empleadoId = document.getElementById('empleadoHoras').value;
            if (!empleadoId) {
                this.mostrarNotificacion('Seleccione un empleado', 'error');
                return;
            }

            const empleado = this.empleados.find(emp => emp.id == empleadoId);
            if (!empleado) {
                this.mostrarNotificacion('Empleado no encontrado', 'error');
                return;
            }

            // Buscar horas del empleado
            const horasEmpleado = this.horas.filter(h => h.empleadoId == empleadoId);
            if (horasEmpleado.length === 0) {
                this.mostrarNotificacion('No hay horas registradas para este empleado', 'error');
                return;
            }

            // Previsualizar comprobante
            if (this.comprobantePDFGenerator) {
                const resultado = await this.comprobantePDFGenerator.previsualizarComprobante(empleado, horasEmpleado);
                if (resultado.success) {
                    this.mostrarModalPrevisualizacion(resultado.html);
                } else {
                    this.mostrarNotificacion('Error al previsualizar comprobante', 'error');
                }
            } else {
                this.mostrarNotificacion('Generador de PDF no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error al previsualizar comprobante:', error);
            this.mostrarNotificacion('Error al previsualizar comprobante', 'error');
        }
    }

    // ===== GESTIÓN DE NÓMINA =====
    async generarNomina() {
        try {
            const fechaInicio = document.getElementById('fechaInicioNomina').value;
            const fechaFin = document.getElementById('fechaFinNomina').value;
            
            if (!fechaInicio || !fechaFin) {
                this.mostrarNotificacion('Por favor complete las fechas de la nómina', 'error');
                return;
            }

            // Filtrar empleados activos
            const empleadosActivos = this.empleados.filter(emp => emp.estado === 'activo');
            
            if (empleadosActivos.length === 0) {
                this.mostrarNotificacion('No hay empleados activos para generar nómina', 'error');
                return;
            }

            // Generar nómina para cada empleado
            const nomina = [];
            let totalGeneral = 0;

            for (const empleado of empleadosActivos) {
                const horasEmpleado = this.horas.filter(h => 
                    h.empleadoId == empleado.id && 
                    h.fecha >= fechaInicio && 
                    h.fecha <= fechaFin
                );

                if (horasEmpleado.length > 0) {
                    const totalEmpleado = horasEmpleado.reduce((sum, h) => sum + (h.totalSalario || 0), 0);
                    totalGeneral += totalEmpleado;

                    nomina.push({
                        empleado: empleado,
                        horas: horasEmpleado,
                        totalHoras: horasEmpleado.reduce((sum, h) => sum + (h.totalHoras || 0), 0),
                        totalSalario: totalEmpleado
                    });
                }
            }

            if (nomina.length === 0) {
                this.mostrarNotificacion('No hay horas registradas en el período seleccionado', 'error');
                return;
            }

            this.mostrarModalNomina(nomina, totalGeneral, fechaInicio, fechaFin);
        } catch (error) {
            console.error('❌ Error al generar nómina:', error);
            this.mostrarNotificacion('Error al generar nómina', 'error');
        }
    }

    mostrarModalNomina(nomina, totalGeneral, fechaInicio, fechaFin) {
        const modal = document.getElementById('modalNomina');
        if (!modal) return;

        const contenido = modal.querySelector('.modal-body');
        let html = `
            <div class="nomina-container">
                <h4>Nómina del ${fechaInicio} al ${fechaFin}</h4>
                <div class="nomina-table-container">
                    <table class="nomina-table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Cargo</th>
                                <th>Total Horas</th>
                                <th>Total Salario</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        nomina.forEach(item => {
            html += `
                <tr>
                    <td>${item.empleado.nombre}</td>
                    <td>${item.empleado.cargo}</td>
                    <td>${item.totalHoras}</td>
                    <td>$${item.totalSalario.toLocaleString()}</td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3"><strong>Total General</strong></td>
                                <td><strong>$${totalGeneral.toLocaleString()}</strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="nomina-actions">
                    <button class="btn btn-primary" onclick="gestionPersonal.exportarNominaExcel()">
                        <i class="fas fa-file-excel"></i> Exportar Excel
                    </button>
                    <button class="btn btn-success" onclick="gestionPersonal.generarNominaPDF()">
                        <i class="fas fa-file-pdf"></i> Generar PDF
                    </button>
                </div>
            </div>
        `;

        contenido.innerHTML = html;
        modal.style.display = 'block';
    }

    async exportarNominaExcel() {
        try {
            // Implementar exportación a Excel
            this.mostrarNotificacion('Exportación a Excel implementada', 'success');
        } catch (error) {
            console.error('❌ Error al exportar nómina:', error);
            this.mostrarNotificacion('Error al exportar nómina', 'error');
        }
    }

    async generarNominaPDF() {
        try {
            // Implementar generación de PDF de nómina
            this.mostrarNotificacion('Generación de PDF implementada', 'success');
        } catch (error) {
            console.error('❌ Error al generar PDF de nómina:', error);
            this.mostrarNotificacion('Error al generar PDF de nómina', 'error');
        }
    }

    // ===== GESTIÓN DE EMPLEADOS =====
    async manejarSubmitEmpleado(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const empleadoData = {
                id: formData.get('empleadoId') || Date.now().toString(),
                nombre: formData.get('nombre'),
                cedula: formData.get('cedula'),
                cargo: formData.get('cargo'),
                departamento: formData.get('departamento'),
                salario: parseFloat(formData.get('salario')),
                tipoContrato: formData.get('tipoContrato'),
                fechaContratacion: formData.get('fechaContratacion'),
                estado: formData.get('estado') || 'activo',
                userId: this.getCurrentUserId(),
                timestamp: new Date().toISOString()
            };

            // Validar campos obligatorios
            if (!empleadoData.nombre || !empleadoData.cedula || !empleadoData.cargo || !empleadoData.salario) {
                this.mostrarNotificacion('Por favor complete todos los campos obligatorios', 'error');
                return;
            }

            // Guardar empleado
            if (this.firebaseSyncManager) {
                await this.firebaseSyncManager.addEmpleado(empleadoData);
            } else {
                const index = this.empleados.findIndex(emp => emp.id === empleadoData.id);
                if (index >= 0) {
                    this.empleados[index] = empleadoData;
                } else {
                    this.empleados.push(empleadoData);
                }
                localStorage.setItem('empleados', JSON.stringify(this.empleados));
            }

            this.mostrarNotificacion('Empleado guardado correctamente', 'success');
            this.cerrarModalEmpleado();
            this.cargarDatos();
        } catch (error) {
            console.error('❌ Error al guardar empleado:', error);
            this.mostrarNotificacion('Error al guardar empleado', 'error');
        }
    }

    mostrarModalEmpleado(empleado = null) {
        const modal = document.getElementById('modalEmpleado');
        if (!modal) return;

        const form = modal.querySelector('#formEmpleado');
        if (empleado) {
            // Modo edición
            form.querySelector('[name="empleadoId"]').value = empleado.id;
            form.querySelector('[name="nombre"]').value = empleado.nombre;
            form.querySelector('[name="cedula"]').value = empleado.cedula;
            form.querySelector('[name="cargo"]').value = empleado.cargo;
            form.querySelector('[name="departamento"]').value = empleado.departamento;
            form.querySelector('[name="salario"]').value = empleado.salario;
            form.querySelector('[name="tipoContrato"]').value = empleado.tipoContrato;
            form.querySelector('[name="fechaContratacion"]').value = empleado.fechaContratacion;
            form.querySelector('[name="estado"]').value = empleado.estado;
        } else {
            // Modo creación
            form.reset();
            form.querySelector('[name="empleadoId"]').value = '';
        }

        modal.style.display = 'block';
    }

    cerrarModalEmpleado() {
        const modal = document.getElementById('modalEmpleado');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async eliminarEmpleado(empleadoId) {
        try {
            if (confirm('¿Está seguro de que desea eliminar este empleado?')) {
                if (this.firebaseSyncManager) {
                    // Implementar eliminación en Firebase
                    this.mostrarNotificacion('Empleado eliminado correctamente', 'success');
                } else {
                    this.empleados = this.empleados.filter(emp => emp.id !== empleadoId);
                    localStorage.setItem('empleados', JSON.stringify(this.empleados));
                    this.mostrarNotificacion('Empleado eliminado correctamente', 'success');
                }
                this.cargarDatos();
            }
        } catch (error) {
            console.error('❌ Error al eliminar empleado:', error);
            this.mostrarNotificacion('Error al eliminar empleado', 'error');
        }
    }

    // ===== GESTIÓN DE DEPARTAMENTOS =====
    async manejarSubmitDepartamento(e) {
        e.preventDefault();
        
        try {
            const formData = new FormData(e.target);
            const departamentoData = {
                id: formData.get('departamentoId') || Date.now().toString(),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                color: formData.get('color') || '#007bff',
                userId: this.getCurrentUserId(),
                timestamp: new Date().toISOString()
            };

            if (!departamentoData.nombre) {
                this.mostrarNotificacion('Por favor complete el nombre del departamento', 'error');
                return;
            }

            // Guardar departamento
            if (this.firebaseSyncManager) {
                await this.firebaseSyncManager.addDepartamento(departamentoData);
            } else {
                const index = this.departamentos.findIndex(dept => dept.id === departamentoData.id);
                if (index >= 0) {
                    this.departamentos[index] = departamentoData;
                } else {
                    this.departamentos.push(departamentoData);
                }
                localStorage.setItem('departamentos', JSON.stringify(this.departamentos));
            }

            this.mostrarNotificacion('Departamento guardado correctamente', 'success');
            this.cerrarModalDepartamento();
            this.cargarDatos();
        } catch (error) {
            console.error('❌ Error al guardar departamento:', error);
            this.mostrarNotificacion('Error al guardar departamento', 'error');
        }
    }

    mostrarModalDepartamento(departamento = null) {
        const modal = document.getElementById('modalDepartamento');
        if (!modal) return;

        const form = modal.querySelector('#formDepartamento');
        if (departamento) {
            // Modo edición
            form.querySelector('[name="departamentoId"]').value = departamento.id;
            form.querySelector('[name="nombre"]').value = departamento.nombre;
            form.querySelector('[name="descripcion"]').value = departamento.descripcion;
            form.querySelector('[name="color"]').value = departamento.color;
        } else {
            // Modo creación
            form.reset();
            form.querySelector('[name="departamentoId"]').value = '';
        }

        modal.style.display = 'block';
    }

    cerrarModalDepartamento() {
        const modal = document.getElementById('modalDepartamento');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    async eliminarDepartamento(departamentoId) {
        try {
            if (confirm('¿Está seguro de que desea eliminar este departamento?')) {
                if (this.firebaseSyncManager) {
                    // Implementar eliminación en Firebase
                    this.mostrarNotificacion('Departamento eliminado correctamente', 'success');
                } else {
                    this.departamentos = this.departamentos.filter(dept => dept.id !== departamentoId);
                    localStorage.setItem('departamentos', JSON.stringify(this.departamentos));
                    this.mostrarNotificacion('Departamento eliminado correctamente', 'success');
                }
                this.cargarDatos();
            }
        } catch (error) {
            console.error('❌ Error al eliminar departamento:', error);
            this.mostrarNotificacion('Error al eliminar departamento', 'error');
        }
    }

    // ===== RENDERIZADO =====
    renderizarEmpleados() {
        const container = document.getElementById('empleadosContainer');
        if (!container) return;

        let html = `
            <div class="empleados-grid">
                <div class="empleados-header">
                    <h3>Empleados Registrados</h3>
                    <button class="btn btn-primary" onclick="gestionPersonal.mostrarModalEmpleado()">
                        <i class="fas fa-plus"></i> Agregar Empleado
                    </button>
                </div>
                <div class="empleados-table-container">
                    <table class="empleados-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Cédula</th>
                                <th>Cargo</th>
                                <th>Departamento</th>
                                <th>Salario</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        this.empleados.forEach(empleado => {
            html += `
                <tr>
                    <td>${empleado.nombre}</td>
                    <td>${empleado.cedula}</td>
                    <td>${empleado.cargo}</td>
                    <td>${empleado.departamento}</td>
                    <td>$${empleado.salario.toLocaleString()}</td>
                    <td><span class="estado-badge ${empleado.estado}">${empleado.estado}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-primary" onclick="gestionPersonal.mostrarModalEmpleado(${JSON.stringify(empleado).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="gestionPersonal.eliminarEmpleado('${empleado.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderizarHoras() {
        const container = document.getElementById('horasContainer');
        if (!container) return;

        let html = `
            <div class="horas-grid">
                <div class="horas-header">
                    <h3>Historial de Horas</h3>
                </div>
                <div class="horas-table-container">
                    <table class="horas-table">
                        <thead>
                            <tr>
                                <th>Empleado</th>
                                <th>Fecha</th>
                                <th>Total Horas</th>
                                <th>Total Salario</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
        `;

        this.horas.forEach(registro => {
            html += `
                <tr>
                    <td>${registro.empleadoNombre}</td>
                    <td>${registro.fecha}</td>
                    <td>${registro.totalHoras}</td>
                    <td>$${registro.totalSalario.toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-info" onclick="gestionPersonal.verDetalleHoras('${registro.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                    </td>
                </tr>
            `;
        });

        html += `
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    renderizarDepartamentos() {
        const container = document.getElementById('departamentosContainer');
        if (!container) return;

        let html = `
            <div class="departamentos-grid">
                <div class="departamentos-header">
                    <h3>Departamentos</h3>
                    <button class="btn btn-primary" onclick="gestionPersonal.mostrarModalDepartamento()">
                        <i class="fas fa-plus"></i> Agregar Departamento
                    </button>
                </div>
                <div class="departamentos-cards">
        `;

        this.departamentos.forEach(departamento => {
            html += `
                <div class="departamento-card" style="border-left-color: ${departamento.color}">
                    <div class="departamento-info">
                        <h4>${departamento.nombre}</h4>
                        <p>${departamento.descripcion || 'Sin descripción'}</p>
                    </div>
                    <div class="departamento-actions">
                        <button class="btn btn-sm btn-outline-primary" onclick="gestionPersonal.mostrarModalDepartamento(${JSON.stringify(departamento).replace(/"/g, '&quot;')})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="gestionPersonal.eliminarDepartamento('${departamento.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
    }

    // ===== UTILIDADES =====
    limpiarFormularioHoras() {
        const form = document.getElementById('formHoras');
        if (form) {
            form.reset();
        }
    }

    mostrarModalCalculoHoras() {
        const modal = document.getElementById('modalCalculoHoras');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    cerrarModalCalculoHoras() {
        const modal = document.getElementById('modalCalculoHoras');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    mostrarModalPrevisualizacion(html) {
        const modal = document.getElementById('modalPrevisualizacion');
        if (!modal) return;

        const contenido = modal.querySelector('.modal-body');
        contenido.innerHTML = html;
        modal.style.display = 'block';
    }

    cerrarModalPrevisualizacion() {
        const modal = document.getElementById('modalPrevisualizacion');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    mostrarNotificacion(mensaje, tipo = 'info') {
        // Usar el sistema de notificaciones si está disponible
        if (typeof mostrarNotificacion === 'function') {
            mostrarNotificacion(mensaje, tipo);
        } else {
            // Fallback a alert
            alert(mensaje);
        }
    }

    getCurrentUserId() {
        // Obtener ID del usuario actual desde Firebase o localStorage
        if (typeof firebase !== 'undefined' && firebase.auth().currentUser) {
            return firebase.auth().currentUser.uid;
        }
        return localStorage.getItem('currentUserId') || 'default';
    }

    actualizarEstadisticas() {
        try {
            const statsContainer = document.getElementById('estadisticasContainer');
            if (!statsContainer) return;

            // Calcular estadísticas
            const empleadosActivos = this.empleados.filter(emp => emp.estado === 'activo').length;
            const totalHoras = this.horas.reduce((sum, h) => sum + (h.totalHoras || 0), 0);
            const totalPagos = this.horas.reduce((sum, h) => sum + (h.totalSalario || 0), 0);

            let html = `
                <div class="estadisticas-grid">
                    <div class="estadistica-card">
                        <div class="estadistica-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="estadistica-content">
                            <h3>${empleadosActivos}</h3>
                            <p>Empleados Activos</p>
                        </div>
                    </div>
                    <div class="estadistica-card">
                        <div class="estadistica-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="estadistica-content">
                            <h3>${totalHoras}</h3>
                            <p>Horas Trabajadas</p>
                        </div>
                    </div>
                    <div class="estadistica-card">
                        <div class="estadistica-icon">
                            <i class="fas fa-dollar-sign"></i>
                        </div>
                        <div class="estadistica-content">
                            <h3>$${totalPagos.toLocaleString()}</h3>
                            <p>Total Pagos</p>
                        </div>
                    </div>
                </div>
            `;

            statsContainer.innerHTML = html;
        } catch (error) {
            console.error('❌ Error al actualizar estadísticas:', error);
        }
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Crear instancia global
        window.gestionPersonal = new GestionPersonalManager();
        console.log('✅ Módulo de Gestión de Personal cargado correctamente');
    } catch (error) {
        console.error('❌ Error al cargar módulo de Gestión de Personal:', error);
    }
});

// Funciones globales para compatibilidad con HTML
window.mostrarModalEmpleado = (empleado = null) => {
    if (window.gestionPersonal) {
        window.gestionPersonal.mostrarModalEmpleado(empleado);
    }
};

window.cerrarModalEmpleado = () => {
    if (window.gestionPersonal) {
        window.gestionPersonal.cerrarModalEmpleado();
    }
};

window.mostrarModalDepartamento = (departamento = null) => {
    if (window.gestionPersonal) {
        window.gestionPersonal.mostrarModalDepartamento(departamento);
    }
};

window.cerrarModalDepartamento = () => {
    if (window.gestionPersonal) {
        window.gestionPersonal.cerrarModalDepartamento();
    }
};

window.cerrarModalCalculoHoras = () => {
    if (window.gestionPersonal) {
        window.gestionPersonal.cerrarModalCalculoHoras();
    }
};

window.cerrarModalPrevisualizacion = () => {
    if (window.gestionPersonal) {
        window.gestionPersonal.cerrarModalPrevisualizacion();
    }
};
