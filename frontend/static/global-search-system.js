/**
 * AXYRA - Sistema de Búsqueda Global
 * Permite buscar en todos los módulos del sistema
 */

class AxyraGlobalSearch {
    constructor() {
        this.searchInput = null;
        this.searchFilter = null;
        this.searchResults = [];
        this.currentPage = 1;
        this.resultsPerPage = 10;
        this.savedSearches = [];
        this.init();
    }

    init() {
        console.log('🔍 Inicializando Sistema de Búsqueda Global AXYRA...');
        
        try {
            this.setupEventListeners();
            this.loadSavedSearches();
            this.setupKeyboardShortcuts();
            console.log('✅ Sistema de búsqueda global inicializado');
        } catch (error) {
            console.error('❌ Error inicializando búsqueda global:', error);
        }
    }

    setupEventListeners() {
        // Búsqueda en tiempo real
        this.searchInput = document.getElementById('globalSearchInput');
        if (this.searchInput) {
            this.searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
            this.searchInput.addEventListener('keydown', (e) => this.handleSearchKeydown(e));
        }

        // Filtro de búsqueda
        this.searchFilter = document.getElementById('searchFilter');
        if (this.searchFilter) {
            this.searchFilter.addEventListener('change', () => this.performSearch());
        }

        // Botón de limpiar búsqueda
        const clearBtn = document.getElementById('searchClearBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSearch());
        }

        // Botón de búsqueda
        const searchBtn = document.querySelector('.axyra-search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.performSearch());
        }
    }

    setupKeyboardShortcuts() {
        // Ctrl/Cmd + K para enfocar búsqueda
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                if (this.searchInput) {
                    this.searchInput.focus();
                }
            }
        });
    }

    handleSearchInput(e) {
        const query = e.target.value.trim();
        const clearBtn = document.getElementById('searchClearBtn');
        
        if (clearBtn) {
            clearBtn.style.display = query ? 'flex' : 'none';
        }

        // Búsqueda automática después de 500ms de inactividad
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            if (query.length >= 2) {
                this.performSearch();
            }
        }, 500);
    }

    handleSearchKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            this.performSearch();
        } else if (e.key === 'Escape') {
            this.clearSearch();
        }
    }

    async performSearch() {
        const query = this.searchInput?.value.trim() || '';
        const filter = this.searchFilter?.value || 'all';
        
        if (!query || query.length < 2) {
            this.showMessage('Por favor ingresa al menos 2 caracteres para buscar', 'warning');
            return;
        }

        try {
            console.log(`🔍 Realizando búsqueda: "${query}" en categoría: ${filter}`);
            
            // Mostrar indicador de carga
            this.showLoadingIndicator();
            
            // Realizar búsqueda
            const results = await this.searchData(query, filter);
            
            // Mostrar resultados
            this.displaySearchResults(results, query);
            
            // Guardar búsqueda en historial
            this.saveToSearchHistory(query, filter, results.length);
            
        } catch (error) {
            console.error('❌ Error en búsqueda:', error);
            this.showMessage('Error al realizar la búsqueda', 'error');
        }
    }

    async searchData(query, filter) {
        const results = [];
        const searchTerm = query.toLowerCase();
        
        try {
            // Buscar en empleados
            if (filter === 'all' || filter === 'empleados') {
                const empleados = this.getDataFromStorage('axyra_empleados');
                const empleadosResults = empleados.filter(emp => 
                    this.matchesSearch(emp, searchTerm, ['nombre', 'cargo', 'departamento', 'cedula'])
                ).map(emp => ({
                    ...emp,
                    type: 'empleado',
                    icon: 'fas fa-user',
                    title: emp.nombre || 'Sin nombre',
                    subtitle: `${emp.cargo || 'Sin cargo'} - ${emp.departamento || 'Sin departamento'}`,
                    meta: `Cédula: ${emp.cedula || 'N/A'} | Salario: $${emp.salario?.toLocaleString('es-CO') || '0'}`
                }));
                results.push(...empleadosResults);
            }

            // Buscar en nóminas
            if (filter === 'all' || filter === 'nominas') {
                const nominas = this.getDataFromStorage('axyra_comprobantes');
                const nominasResults = nominas.filter(nom => 
                    this.matchesSearch(nom, searchTerm, ['numeroFactura', 'encargado', 'area', 'descripcion'])
                ).map(nom => ({
                    ...nom,
                    type: 'nomina',
                    icon: 'fas fa-file-invoice-dollar',
                    title: `Nómina ${nom.numeroFactura || 'N/A'}`,
                    subtitle: `${nom.encargado || 'Sin encargado'} - ${nom.area || 'Sin área'}`,
                    meta: `Monto: $${nom.monto?.toLocaleString('es-CO') || '0'} | Fecha: ${nom.fecha || 'N/A'}`
                }));
                results.push(...nominasResults);
            }

            // Buscar en horas
            if (filter === 'all' || filter === 'horas') {
                const horas = this.getDataFromStorage('axyra_horas');
                const horasResults = horas.filter(hr => 
                    this.matchesSearch(hr, searchTerm, ['empleado', 'fecha', 'observaciones'])
                ).map(hr => ({
                    ...hr,
                    type: 'hora',
                    icon: 'fas fa-clock',
                    title: `Registro de ${hr.empleado || 'Sin empleado'}`,
                    subtitle: `Fecha: ${hr.fecha || 'N/A'}`,
                    meta: `Total: ${this.calculateTotalHours(hr)} horas`
                }));
                results.push(...horasResults);
            }

            // Buscar en cuadres de caja
            if (filter === 'all' || filter === 'cuadres') {
                const cuadres = this.getDataFromStorage('axyra_cuadres');
                const cuadresResults = cuadres.filter(cq => 
                    this.matchesSearch(cq, searchTerm, ['numeroCuadre', 'encargado', 'area', 'observaciones'])
                ).map(cq => ({
                    ...cq,
                    type: 'cuadre',
                    icon: 'fas fa-calculator',
                    title: `Cuadre ${cq.numeroCuadre || 'N/A'}`,
                    subtitle: `${cq.encargado || 'Sin encargado'} - ${cq.area || 'Sin área'}`,
                    meta: `Total: $${cq.total?.toLocaleString('es-CO') || '0'} | Fecha: ${cq.fecha || 'N/A'}`
                }));
                results.push(...cuadresResults);
            }

            // Buscar en configuración
            if (filter === 'all' || filter === 'configuracion') {
                const config = this.getDataFromStorage('axyra_config_empresa');
                const configResults = config.filter(cfg => 
                    this.matchesSearch(cfg, searchTerm, ['nombre', 'nit', 'direccion', 'telefono'])
                ).map(cfg => ({
                    ...cfg,
                    type: 'configuracion',
                    icon: 'fas fa-cog',
                    title: `Configuración: ${cfg.nombre || 'Empresa'}`,
                    subtitle: `NIT: ${cfg.nit || 'N/A'}`,
                    meta: `Dirección: ${cfg.direccion || 'N/A'}`
                }));
                results.push(...configResults);
            }

            console.log(`✅ Búsqueda completada: ${results.length} resultados encontrados`);
            return results;

        } catch (error) {
            console.error('❌ Error buscando datos:', error);
            return [];
        }
    }

    matchesSearch(item, searchTerm, fields) {
        return fields.some(field => {
            const value = item[field];
            if (!value) return false;
            return value.toString().toLowerCase().includes(searchTerm);
        });
    }

    getDataFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.warn(`⚠️ Error obteniendo datos de ${key}:`, error);
            return [];
        }
    }

    calculateTotalHours(registro) {
        const horasOrdinarias = parseFloat(registro.horasOrdinarias) || 0;
        const horasNocturnas = parseFloat(registro.horasNocturnas) || 0;
        const horasExtras = parseFloat(registro.horasExtras) || 0;
        const horasDominicales = parseFloat(registro.horasDominicales) || 0;
        return (horasOrdinarias + horasNocturnas + horasExtras + horasDominicales).toFixed(1);
    }

    displaySearchResults(results, query) {
        this.searchResults = results;
        this.currentPage = 1;
        
        const modal = document.getElementById('globalSearchModal');
        const resultsCount = document.getElementById('searchResultsCount');
        const resultsContainer = document.getElementById('searchResults');
        
        if (!modal || !resultsCount || !resultsContainer) {
            console.error('❌ Elementos del modal de búsqueda no encontrados');
            return;
        }

        // Actualizar contador de resultados
        resultsCount.textContent = results.length;

        // Mostrar resultados
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="axyra-search-no-results">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--axyra-gray-400); margin-bottom: 16px;"></i>
                    <h4>No se encontraron resultados</h4>
                    <p>Intenta con otros términos de búsqueda o cambia el filtro</p>
                </div>
            `;
        } else {
            this.renderSearchResults(resultsContainer, results);
            this.renderPagination();
        }

        // Mostrar modal
        modal.style.display = 'block';
        this.hideLoadingIndicator();
    }

    renderSearchResults(container, results) {
        const startIndex = (this.currentPage - 1) * this.resultsPerPage;
        const endIndex = startIndex + this.resultsPerPage;
        const pageResults = results.slice(startIndex, endIndex);

        let html = '';
        pageResults.forEach(result => {
            html += `
                <div class="axyra-search-result-item" onclick="axyraGlobalSearch.openResult('${result.type}', '${result.id || result.cedula || result.numeroFactura}')">
                    <div class="axyra-search-result-icon">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="axyra-search-result-content">
                        <div class="axyra-search-result-title">${result.title}</div>
                        <div class="axyra-search-result-subtitle">${result.subtitle}</div>
                        <div class="axyra-search-result-meta">${result.meta}</div>
                    </div>
                    <div class="axyra-search-result-actions">
                        <button class="axyra-btn axyra-btn-sm axyra-btn-secondary" onclick="event.stopPropagation(); axyraGlobalSearch.exportResult('${result.type}', '${result.id || result.cedula || result.numeroFactura}')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    renderPagination() {
        const paginationContainer = document.getElementById('searchPagination');
        if (!paginationContainer) return;

        const totalPages = Math.ceil(this.searchResults.length / this.resultsPerPage);
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let html = '';
        
        // Botón anterior
        if (this.currentPage > 1) {
            html += `<button class="axyra-pagination-btn" onclick="axyraGlobalSearch.goToPage(${this.currentPage - 1})">
                <i class="fas fa-chevron-left"></i> Anterior
            </button>`;
        }

        // Números de página
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                html += `<button class="axyra-pagination-btn active">${i}</button>`;
            } else if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                html += `<button class="axyra-pagination-btn" onclick="axyraGlobalSearch.goToPage(${i})">${i}</button>`;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                html += `<span class="axyra-pagination-ellipsis">...</span>`;
            }
        }

        // Botón siguiente
        if (this.currentPage < totalPages) {
            html += `<button class="axyra-pagination-btn" onclick="axyraGlobalSearch.goToPage(${this.currentPage + 1})">
                Siguiente <i class="fas fa-chevron-right"></i>
            </button>`;
        }

        paginationContainer.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        const resultsContainer = document.getElementById('searchResults');
        if (resultsContainer) {
            this.renderSearchResults(resultsContainer, this.searchResults);
            this.renderPagination();
        }
    }

    openResult(type, id) {
        console.log(`🔗 Abriendo resultado: ${type} - ${id}`);
        
        // Navegar al módulo correspondiente
        switch (type) {
            case 'empleado':
                window.location.href = `../empleados/empleados.html?search=${id}`;
                break;
            case 'nomina':
                window.location.href = `../nomina/gestionar_nomina.html?search=${id}`;
                break;
            case 'hora':
                window.location.href = `../horas/gestionar_horas.html?search=${id}`;
                break;
            case 'cuadre':
                window.location.href = `../cuadre_caja/cuadre_caja.html?search=${id}`;
                break;
            case 'configuracion':
                window.location.href = `../configuracion/configuracion.html?search=${id}`;
                break;
            default:
                console.warn('⚠️ Tipo de resultado no reconocido:', type);
        }
    }

    exportResult(type, id) {
        console.log(`📥 Exportando resultado: ${type} - ${id}`);
        
        try {
            // Buscar el resultado en los datos
            const result = this.searchResults.find(r => 
                r.id === id || r.cedula === id || r.numeroFactura === id
            );
            
            if (!result) {
                this.showMessage('No se pudo encontrar el resultado para exportar', 'error');
                return;
            }

            // Crear contenido para exportar
            let content = '';
            switch (type) {
                case 'empleado':
                    content = `EMPLEADO: ${result.nombre}\nCargo: ${result.cargo}\nDepartamento: ${result.departamento}\nCédula: ${result.cedula}\nSalario: $${result.salario?.toLocaleString('es-CO') || '0'}`;
                    break;
                case 'nomina':
                    content = `NÓMINA: ${result.numeroFactura}\nEncargado: ${result.encargado}\nÁrea: ${result.area}\nMonto: $${result.monto?.toLocaleString('es-CO') || '0'}\nFecha: ${result.fecha}`;
                    break;
                case 'hora':
                    content = `REGISTRO DE HORAS: ${result.empleado}\nFecha: ${result.fecha}\nTotal: ${this.calculateTotalHours(result)} horas`;
                    break;
                default:
                    content = JSON.stringify(result, null, 2);
            }

            // Crear y descargar archivo
            const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_${id}_${new Date().toISOString().split('T')[0]}.txt`;
            a.click();
            window.URL.revokeObjectURL(url);

            this.showMessage('Resultado exportado correctamente', 'success');
        } catch (error) {
            console.error('❌ Error exportando resultado:', error);
            this.showMessage('Error al exportar el resultado', 'error');
        }
    }

    saveSearchQuery() {
        const query = this.searchInput?.value.trim() || '';
        const filter = this.searchFilter?.value || 'all';
        
        if (!query) {
            this.showMessage('No hay consulta para guardar', 'warning');
            return;
        }

        try {
            const savedSearch = {
                id: Date.now().toString(),
                query: query,
                filter: filter,
                resultsCount: this.searchResults.length,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };

            this.savedSearches.unshift(savedSearch);
            
            // Mantener solo las últimas 20 búsquedas
            if (this.savedSearches.length > 20) {
                this.savedSearches = this.savedSearches.slice(0, 20);
            }

            // Guardar en localStorage
            localStorage.setItem('axyra_saved_searches', JSON.stringify(this.savedSearches));
            
            this.showMessage('Búsqueda guardada correctamente', 'success');
        } catch (error) {
            console.error('❌ Error guardando búsqueda:', error);
            this.showMessage('Error al guardar la búsqueda', 'error');
        }
    }

    loadSavedSearches() {
        try {
            const saved = localStorage.getItem('axyra_saved_searches');
            if (saved) {
                this.savedSearches = JSON.parse(saved);
                console.log(`✅ Búsquedas guardadas cargadas: ${this.savedSearches.length}`);
            }
        } catch (error) {
            console.warn('⚠️ Error cargando búsquedas guardadas:', error);
            this.savedSearches = [];
        }
    }

    saveToSearchHistory(query, filter, resultsCount) {
        try {
            const history = JSON.parse(localStorage.getItem('axyra_search_history') || '[]');
            const searchRecord = {
                query: query,
                filter: filter,
                resultsCount: resultsCount,
                timestamp: Date.now(),
                date: new Date().toISOString()
            };
            
            history.unshift(searchRecord);
            
            // Mantener solo las últimas 100 búsquedas
            if (history.length > 100) {
                history.splice(100);
            }
            
            localStorage.setItem('axyra_search_history', JSON.stringify(history));
        } catch (error) {
            console.warn('⚠️ Error guardando historial de búsqueda:', error);
        }
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.focus();
        }
        
        const clearBtn = document.getElementById('searchClearBtn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
    }

    showLoadingIndicator() {
        const searchBtn = document.querySelector('.axyra-search-btn');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Buscando...';
            searchBtn.disabled = true;
        }
    }

    hideLoadingIndicator() {
        const searchBtn = document.querySelector('.axyra-search-btn');
        if (searchBtn) {
            searchBtn.innerHTML = '<i class="fas fa-search"></i> Buscar';
            searchBtn.disabled = false;
        }
    }

    showMessage(message, type = 'info') {
        // Crear notificación temporal
        const notification = document.createElement('div');
        notification.className = `axyra-notification axyra-notification-${type}`;
        notification.innerHTML = `
            <div class="axyra-notification-icon">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
            </div>
            <div class="axyra-notification-message">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 3000);
    }

    // Métodos públicos para uso desde HTML
    static performGlobalSearch() {
        if (window.axyraGlobalSearch) {
            window.axyraGlobalSearch.performSearch();
        }
    }

    static closeGlobalSearchModal() {
        const modal = document.getElementById('globalSearchModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static closeSavedSearchesModal() {
        const modal = document.getElementById('savedSearchesModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static exportSearchResults() {
        if (window.axyraGlobalSearch) {
            // Exportar todos los resultados de la búsqueda actual
            const results = window.axyraGlobalSearch.searchResults;
            if (results.length === 0) {
                window.axyraGlobalSearch.showMessage('No hay resultados para exportar', 'warning');
                return;
            }

            try {
                let content = `RESULTADOS DE BÚSQUEDA\n`;
                content += `Fecha: ${new Date().toLocaleString('es-CO')}\n`;
                content += `Total resultados: ${results.length}\n\n`;
                
                results.forEach((result, index) => {
                    content += `${index + 1}. ${result.title}\n`;
                    content += `   ${result.subtitle}\n`;
                    content += `   ${result.meta}\n\n`;
                });

                const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `busqueda_global_${new Date().toISOString().split('T')[0]}.txt`;
                a.click();
                window.URL.revokeObjectURL(url);

                window.axyraGlobalSearch.showMessage('Resultados exportados correctamente', 'success');
            } catch (error) {
                console.error('❌ Error exportando resultados:', error);
                window.axyraGlobalSearch.showMessage('Error al exportar los resultados', 'error');
            }
        }
    }
}

// Inicializar sistema de búsqueda global cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.axyraGlobalSearch = new AxyraGlobalSearch();
});

// Exportar para uso global
window.AxyraGlobalSearch = AxyraGlobalSearch;
