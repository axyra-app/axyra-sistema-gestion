/**
 * Sistema de Búsqueda Global AXYRA - VERSIÓN MEJORADA
 * Sistema completo y robusto de búsqueda en todos los módulos
 * NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD
 */

class AxyraGlobalSearchSystem {
  constructor() {
    this.isInitialized = false;
    this.searchIndex = {};
    this.searchResults = [];
    this.currentQuery = '';
    this.searchContainer = null;
    this.searchInput = null;
    this.resultsContainer = null;
    this.isSearching = false;
    this.searchTimeout = null;
    this.minSearchLength = 2;
    this.maxResults = 20;

    this.init();
  }

  async init() {
    try {
      // Verificar si ya está inicializado
      if (this.isInitialized) {
        console.log('⚠️ Sistema de búsqueda global ya inicializado');
        return;
      }

      // Crear interfaz de búsqueda
      this.createSearchInterface();

      // Construir índice de búsqueda
      await this.buildSearchIndex();

      // Configurar event listeners
      this.setupEventListeners();

      // Inicializar el sistema
      this.isInitialized = true;
      console.log('✅ Sistema de búsqueda global AXYRA inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando sistema de búsqueda global:', error);
    }
  }

  createSearchInterface() {
    try {
      // Verificar si ya existe la interfaz
      if (document.getElementById('axyra-global-search')) {
        this.searchContainer = document.getElementById('axyra-global-search');
        this.searchInput = document.getElementById('axyra-search-input');
        this.resultsContainer = document.getElementById('axyra-search-results');
        return;
      }

      // Crear contenedor principal
      const container = document.createElement('div');
      container.id = 'axyra-global-search';
      container.className = 'axyra-global-search';
      container.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 10001;
        width: 90%;
        max-width: 600px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        border: 1px solid #e2e8f0;
        overflow: hidden;
        display: none;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      `;

      // Crear input de búsqueda
      const searchInput = document.createElement('div');
      searchInput.className = 'axyra-search-input-container';
      searchInput.style.cssText = `
        padding: 20px;
        border-bottom: 1px solid #e2e8f0;
        background: #f8fafc;
      `;

      const input = document.createElement('input');
      input.id = 'axyra-search-input';
      input.type = 'text';
      input.placeholder = '🔍 Buscar en AXYRA... (Ctrl+K)';
      input.className = 'axyra-search-input';
      input.style.cssText = `
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        font-size: 16px;
        outline: none;
        transition: all 0.2s ease;
        background: white;
      `;

      searchInput.appendChild(input);
      container.appendChild(searchInput);

      // Crear contenedor de resultados
      const resultsContainer = document.createElement('div');
      resultsContainer.id = 'axyra-search-results';
      resultsContainer.className = 'axyra-search-results';
      resultsContainer.style.cssText = `
        max-height: 400px;
        overflow-y: auto;
        padding: 0;
      `;

      container.appendChild(resultsContainer);

      // Agregar al DOM
      document.body.appendChild(container);

      // Guardar referencias
      this.searchContainer = container;
      this.searchInput = input;
      this.resultsContainer = resultsContainer;

      console.log('✅ Interfaz de búsqueda global creada');
    } catch (error) {
      console.error('❌ Error creando interfaz de búsqueda:', error);
    }
  }

  setupEventListeners() {
    try {
      // Event listener para el input
      if (this.searchInput) {
        this.searchInput.addEventListener('input', (e) => {
          this.handleSearchInput(e.target.value);
        });

        this.searchInput.addEventListener('keydown', (e) => {
          this.handleSearchKeydown(e);
        });

        this.searchInput.addEventListener('focus', () => {
          this.showSearchInterface();
        });
      }

      // Event listener para Ctrl+K
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          this.toggleSearchInterface();
        }

        // ESC para cerrar
        if (e.key === 'Escape') {
          this.hideSearchInterface();
        }
      });

      // Event listener para clics fuera del contenedor
      document.addEventListener('click', (e) => {
        if (!this.searchContainer?.contains(e.target)) {
          this.hideSearchInterface();
        }
      });

      console.log('✅ Event listeners configurados');
    } catch (error) {
      console.error('❌ Error configurando event listeners:', error);
    }
  }

  async buildSearchIndex() {
    try {
      console.log('🔍 Construyendo índice de búsqueda...');

      // Obtener datos de todos los módulos
      const empleados = this.getDataFromStorage('axyra_empleados') || [];
      const horas = this.getDataFromStorage('axyra_horas') || [];
      const nominas = this.getDataFromStorage('axyra_nominas') || [];
      const cuadres = this.getDataFromStorage('axyra_cuadres') || [];
      const inventario = this.getDataFromStorage('axyra_inventario') || [];
      const config = this.getDataFromStorage('axyra_config_empresa') || {};

      // Construir índice
      this.searchIndex = {
        empleados: this.indexData(empleados, 'empleados', [
          'nombre',
          'apellido',
          'cedula',
          'cargo',
          'departamento',
          'email',
        ]),
        horas: this.indexData(horas, 'horas', ['cedula', 'fecha', 'horas_trabajadas', 'tipo_hora']),
        nominas: this.indexData(nominas, 'nominas', ['cedula', 'periodo', 'total_bruto', 'total_neto', 'estado']),
        cuadres: this.indexData(cuadres, 'cuadres', [
          'fecha',
          'total_ingresos',
          'total_gastos',
          'diferencia',
          'estado',
        ]),
        inventario: this.indexData(inventario, 'inventario', ['nombre', 'categoria', 'codigo', 'descripcion']),
        config: this.indexData([config], 'configuracion', ['nombre_empresa', 'nit', 'direccion', 'telefono']),
      };

      console.log('✅ Índice de búsqueda construido:', Object.keys(this.searchIndex));
    } catch (error) {
      console.error('❌ Error construyendo índice de búsqueda:', error);
    }
  }

  indexData(data, type, fields) {
    try {
      const indexed = [];

      data.forEach((item, index) => {
        const searchableText = fields
          .map((field) => item[field] || '')
          .join(' ')
          .toLowerCase();

        indexed.push({
          id: item.id || index,
          type: type,
          data: item,
          searchableText: searchableText,
          displayText: this.generateDisplayText(item, type),
          url: this.generateUrl(item, type),
        });
      });

      return indexed;
    } catch (error) {
      console.error(`❌ Error indexando datos de ${type}:`, error);
      return [];
    }
  }

  generateDisplayText(item, type) {
    try {
      switch (type) {
        case 'empleados':
          return `${item.nombre || ''} ${item.apellido || ''} - ${item.cargo || ''} (${item.cedula || ''})`;
        case 'horas':
          return `Horas: ${item.cedula || ''} - ${item.fecha || ''} - ${item.horas_trabajadas || 0}h`;
        case 'nominas':
          return `Nómina: ${item.cedula || ''} - ${item.periodo || ''} - $${item.total_neto || 0}`;
        case 'cuadres':
          return `Cuadre: ${item.fecha || ''} - $${item.total_ingresos || 0} - $${item.total_gastos || 0}`;
        case 'inventario':
          return `${item.nombre || ''} - ${item.categoria || ''} (${item.codigo || ''})`;
        case 'configuracion':
          return `${item.nombre_empresa || 'Empresa'} - ${item.nit || ''}`;
        default:
          return JSON.stringify(item).substring(0, 100);
      }
    } catch (error) {
      return 'Sin información disponible';
    }
  }

  generateUrl(item, type) {
    try {
      const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '');

      switch (type) {
        case 'empleados':
          return `${baseUrl}/modulos/empleados/empleados.html#empleado-${item.cedula || item.id}`;
        case 'horas':
          return `${baseUrl}/modulos/horas/gestionar_horas.html#hora-${item.id}`;
        case 'nominas':
          return `${baseUrl}/modulos/nomina/gestionar_nomina.html#nomina-${item.id}`;
        case 'cuadres':
          return `${baseUrl}/modulos/cuadre_caja/cuadre_caja.html#cuadre-${item.id}`;
        case 'inventario':
          return `${baseUrl}/modulos/inventario/inventario.html#item-${item.id}`;
        case 'configuracion':
          return `${baseUrl}/modulos/configuracion/configuracion.html`;
        default:
          return baseUrl;
      }
    } catch (error) {
      return window.location.href;
    }
  }

  handleSearchInput(query) {
    try {
      // Limpiar timeout anterior
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }

      // Configurar nuevo timeout para búsqueda en tiempo real
      this.searchTimeout = setTimeout(() => {
        this.performSearch(query);
      }, 300);

      this.currentQuery = query;
    } catch (error) {
      console.error('❌ Error manejando input de búsqueda:', error);
    }
  }

  handleSearchKeydown(e) {
    try {
      switch (e.key) {
        case 'Enter':
          if (this.searchResults.length > 0) {
            this.selectFirstResult();
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.navigateResults(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.navigateResults(-1);
          break;
      }
    } catch (error) {
      console.error('❌ Error manejando teclas de búsqueda:', error);
    }
  }

  async performSearch(query) {
    try {
      if (!query || query.length < this.minSearchLength) {
        this.clearResults();
        return;
      }

      this.isSearching = true;
      this.showSearchingIndicator();

      // Realizar búsqueda en todos los índices
      const results = [];
      const queryLower = query.toLowerCase();

      Object.values(this.searchIndex).forEach((indexedData) => {
        indexedData.forEach((item) => {
          if (item.searchableText.includes(queryLower)) {
            results.push({
              ...item,
              relevance: this.calculateRelevance(item, queryLower),
            });
          }
        });
      });

      // Ordenar por relevancia
      results.sort((a, b) => b.relevance - a.relevance);

      // Limitar resultados
      this.searchResults = results.slice(0, this.maxResults);

      // Renderizar resultados
      this.renderSearchResults();

      this.isSearching = false;
      this.hideSearchingIndicator();

      console.log(`🔍 Búsqueda completada: ${this.searchResults.length} resultados para "${query}"`);
    } catch (error) {
      console.error('❌ Error realizando búsqueda:', error);
      this.isSearching = false;
      this.hideSearchingIndicator();
    }
  }

  calculateRelevance(item, query) {
    try {
      let relevance = 0;
      const text = item.searchableText;

      // Coincidencia exacta
      if (text === query) relevance += 100;

      // Coincidencia al inicio
      if (text.startsWith(query)) relevance += 50;

      // Coincidencia de palabras
      const words = query.split(' ');
      words.forEach((word) => {
        if (text.includes(word)) relevance += 10;
      });

      // Coincidencia de caracteres
      relevance += text.match(new RegExp(query.split('').join('.*'), 'i')) ? 5 : 0;

      return relevance;
    } catch (error) {
      return 0;
    }
  }

  renderSearchResults() {
    try {
      if (!this.resultsContainer) return;

      // Limpiar contenedor
      this.resultsContainer.innerHTML = '';

      if (this.searchResults.length === 0) {
        this.resultsContainer.innerHTML = `
          <div class="axyra-no-results" style="padding: 20px; text-align: center; color: #64748b;">
            <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            <p>No se encontraron resultados para "${this.currentQuery}"</p>
          </div>
        `;
        return;
      }

      // Agrupar resultados por tipo
      const groupedResults = this.groupResultsByType();

      // Renderizar cada grupo
      Object.entries(groupedResults).forEach(([type, results]) => {
        const groupElement = this.createResultGroup(type, results);
        this.resultsContainer.appendChild(groupElement);
      });
    } catch (error) {
      console.error('❌ Error renderizando resultados:', error);
    }
  }

  groupResultsByType() {
    try {
      const grouped = {};

      this.searchResults.forEach((result) => {
        if (!grouped[result.type]) {
          grouped[result.type] = [];
        }
        grouped[result.type].push(result);
      });

      return grouped;
    } catch (error) {
      return {};
    }
  }

  createResultGroup(type, results) {
    try {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'axyra-result-group';
      groupDiv.style.cssText = `
        border-bottom: 1px solid #e2e8f0;
        padding: 16px;
      `;

      // Título del grupo
      const titleDiv = document.createElement('div');
      titleDiv.className = 'axyra-result-group-title';
      titleDiv.style.cssText = `
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 12px;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      `;
      titleDiv.textContent = this.getTypeDisplayName(type);
      groupDiv.appendChild(titleDiv);

      // Resultados del grupo
      results.forEach((result, index) => {
        const resultElement = this.createResultElement(result, index);
        groupDiv.appendChild(resultElement);
      });

      return groupDiv;
    } catch (error) {
      console.error('❌ Error creando grupo de resultados:', error);
      return document.createElement('div');
    }
  }

  createResultElement(result, index) {
    try {
      const resultDiv = document.createElement('div');
      resultDiv.className = 'axyra-result-item';
      resultDiv.style.cssText = `
        padding: 12px;
        margin: 8px 0;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
      `;

      resultDiv.innerHTML = `
        <div class="axyra-result-content">
          <div class="axyra-result-text">${result.displayText}</div>
          <div class="axyra-result-type">${this.getTypeDisplayName(result.type)}</div>
        </div>
      `;

      // Event listeners
      resultDiv.addEventListener('click', () => {
        this.selectResult(result);
      });

      resultDiv.addEventListener('mouseenter', () => {
        resultDiv.style.background = '#f1f5f9';
        resultDiv.style.borderColor = '#cbd5e1';
      });

      resultDiv.addEventListener('mouseleave', () => {
        resultDiv.style.background = 'transparent';
        resultDiv.style.borderColor = 'transparent';
      });

      return resultDiv;
    } catch (error) {
      console.error('❌ Error creando elemento de resultado:', error);
      return document.createElement('div');
    }
  }

  getTypeDisplayName(type) {
    const names = {
      empleados: 'Empleados',
      horas: 'Horas Trabajadas',
      nominas: 'Nóminas',
      cuadres: 'Cuadres de Caja',
      inventario: 'Inventario',
      configuracion: 'Configuración',
    };
    return names[type] || type;
  }

  selectResult(result) {
    try {
      console.log('✅ Resultado seleccionado:', result);

      // Navegar a la URL del resultado
      if (result.url) {
        window.location.href = result.url;
      }

      // Ocultar interfaz de búsqueda
      this.hideSearchInterface();
    } catch (error) {
      console.error('❌ Error seleccionando resultado:', error);
    }
  }

  selectFirstResult() {
    try {
      if (this.searchResults.length > 0) {
        this.selectResult(this.searchResults[0]);
      }
    } catch (error) {
      console.error('❌ Error seleccionando primer resultado:', error);
    }
  }

  navigateResults(direction) {
    try {
      // Implementar navegación con teclado
      console.log('Navegando resultados:', direction);
    } catch (error) {
      console.error('❌ Error navegando resultados:', error);
    }
  }

  showSearchInterface() {
    try {
      if (this.searchContainer) {
        this.searchContainer.style.display = 'block';
        this.searchContainer.style.opacity = '0';
        this.searchContainer.style.transform = 'translateX(-50%) scale(0.95)';

        setTimeout(() => {
          this.searchContainer.style.opacity = '1';
          this.searchContainer.style.transform = 'translateX(-50%) scale(1)';
        }, 10);

        // Enfocar input
        if (this.searchInput) {
          this.searchInput.focus();
        }
      }
    } catch (error) {
      console.error('❌ Error mostrando interfaz de búsqueda:', error);
    }
  }

  hideSearchInterface() {
    try {
      if (this.searchContainer) {
        this.searchContainer.style.opacity = '0';
        this.searchContainer.style.transform = 'translateX(-50%) scale(0.95)';

        setTimeout(() => {
          this.searchContainer.style.display = 'none';
        }, 300);
      }
    } catch (error) {
      console.error('❌ Error ocultando interfaz de búsqueda:', error);
    }
  }

  toggleSearchInterface() {
    try {
      if (this.searchContainer?.style.display === 'none') {
        this.showSearchInterface();
      } else {
        this.hideSearchInterface();
      }
    } catch (error) {
      console.error('❌ Error alternando interfaz de búsqueda:', error);
    }
  }

  showSearchingIndicator() {
    try {
      if (this.resultsContainer) {
        this.resultsContainer.innerHTML = `
          <div class="axyra-searching" style="padding: 20px; text-align: center; color: #64748b;">
            <i class="fas fa-spinner fa-spin" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
            <p>Buscando...</p>
          </div>
        `;
      }
    } catch (error) {
      console.error('❌ Error mostrando indicador de búsqueda:', error);
    }
  }

  hideSearchingIndicator() {
    // Se oculta automáticamente cuando se renderizan los resultados
  }

  clearResults() {
    try {
      this.searchResults = [];
      if (this.resultsContainer) {
        this.resultsContainer.innerHTML = '';
      }
    } catch (error) {
      console.error('❌ Error limpiando resultados:', error);
    }
  }

  getDataFromStorage(key) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error(`❌ Error obteniendo datos de ${key}:`, error);
      return null;
    }
  }

  // Métodos públicos para uso externo
  search(query) {
    return this.performSearch(query);
  }

  show() {
    return this.showSearchInterface();
  }

  hide() {
    return this.hideSearchInterface();
  }

  toggle() {
    return this.toggleSearchInterface();
  }

  refresh() {
    return this.buildSearchIndex();
  }
}

// Inicializar sistema de búsqueda global cuando se carga la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraGlobalSearch = new AxyraGlobalSearchSystem();
  });
} else {
  window.axyraGlobalSearch = new AxyraGlobalSearchSystem();
}

// Exportar para uso en otros módulos
window.AxyraGlobalSearchSystem = AxyraGlobalSearchSystem;
