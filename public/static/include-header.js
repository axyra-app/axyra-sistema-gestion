// INCLUIR HEADER COMPARTIDO AXYRA - VERSIÓN MEJORADA Y SEGURA
// Este script incluye automáticamente el header compartido en cualquier página
// NO MODIFICA NINGÚN CÓDIGO EXISTENTE - SOLO AGREGA FUNCIONALIDAD

class AxyraHeaderIncluder {
  constructor() {
    this.isInitialized = false;
    this.headerInserted = false;
    this.scriptLoaded = false;
    this.init();
  }

  async init() {
    try {
      // Verificar que no se haya inicializado antes
      if (this.isInitialized) {
        console.log('⚠️ Header ya inicializado, saltando...');
        return;
      }

      this.isInitialized = true;
      console.log('🚀 Inicializando header compartido AXYRA...');

      // Esperar a que el DOM esté completamente cargado
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.setupHeader());
      } else {
        this.setupHeader();
      }
    } catch (error) {
      console.error('❌ Error en inicialización del header:', error);
    }
  }

  async setupHeader() {
    try {
      // Verificar si ya existe un header
      if (document.querySelector('.axyra-header')) {
        console.log('✅ Header ya existe en la página, saltando inserción...');
        return;
      }

      // Determinar la ruta correcta según la ubicación de la página
      const paths = this.determinePaths();

      // Cargar header y script
      await this.includeHeader(paths.headerPath);
      await this.includeScript(paths.scriptPath);

      console.log('✅ Header compartido AXYRA configurado correctamente');
    } catch (error) {
      console.error('❌ Error configurando header:', error);
      this.createFallbackHeader();
    }
  }

  determinePaths() {
    // Determinar la ruta actual y calcular las rutas relativas correctas
    const currentPath = window.location.pathname;
    let headerPath, scriptPath;

    if (currentPath.includes('/modulos/')) {
      // Estamos en un módulo (2 niveles de profundidad)
      headerPath = '../../static/shared-header.html';
      scriptPath = '../../static/shared-header.js';
    } else if (currentPath.includes('/admin/')) {
      // Estamos en admin (1 nivel de profundidad)
      headerPath = '../static/shared-header.html';
      scriptPath = '../static/shared-header.js';
    } else {
      // Estamos en la raíz
      headerPath = 'static/shared-header.html';
      scriptPath = 'static/shared-header.js';
    }

    console.log('📍 Rutas calculadas:', { headerPath, scriptPath, currentPath });
    return { headerPath, scriptPath };
  }

  async includeHeader(headerPath) {
    try {
      console.log('📥 Cargando header desde:', headerPath);
      const response = await fetch(headerPath);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const headerHTML = await response.text();
      console.log('✅ Header HTML cargado correctamente, longitud:', headerHTML.length);

      // Insertar el header solo si no existe
      if (!document.querySelector('.axyra-header')) {
        const body = document.body;
        if (body) {
          body.insertAdjacentHTML('afterbegin', headerHTML);
          this.headerInserted = true;
          console.log('✅ Header insertado en el body');
        } else {
          console.error('❌ Body no encontrado');
        }
      } else {
        console.log('✅ Header ya existe, saltando inserción');
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cargar header compartido, usando fallback:', error);
      this.createFallbackHeader();
    }
  }

  async includeScript(scriptPath) {
    try {
      console.log('📥 Cargando script del header desde:', scriptPath);

      // Verificar si el script ya está cargado
      if (document.querySelector(`script[src="${scriptPath}"]`)) {
        console.log('✅ Script del header ya está cargado');
        this.scriptLoaded = true;
        return;
      }

      const script = document.createElement('script');
      script.src = scriptPath;
      script.async = false;
      script.onload = () => {
        console.log('✅ Script del header cargado y ejecutado');
        this.scriptLoaded = true;
        this.initializeHeader();
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando script del header:', error);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.warn('⚠️ No se pudo cargar script del header:', error);
    }
  }

  initializeHeader() {
    try {
      // Esperar un poco para asegurar que todo esté cargado
      setTimeout(() => {
        try {
          if (window.axyraSharedHeader) {
            new window.axyraSharedHeader();
            console.log('✅ Header inicializado correctamente');
          } else if (typeof AxyraSharedHeader !== 'undefined') {
            new AxyraSharedHeader();
            console.log('✅ Header inicializado directamente');
          } else {
            console.log('⚠️ Clase del header no disponible, intentando más tarde...');
            // Intentar de nuevo en 1 segundo
            setTimeout(() => this.initializeHeader(), 1000);
          }
        } catch (error) {
          console.error('❌ Error inicializando header:', error);
        }
      }, 300);
    } catch (error) {
      console.error('❌ Error en inicialización:', error);
    }
  }

  createFallbackHeader() {
    // Header de respaldo si falla la carga - NO MODIFICA ESTILOS EXISTENTES
    if (document.querySelector('.axyra-header')) {
      console.log('✅ Header ya existe, no creando fallback');
      return;
    }

    const paths = this.determinePaths();
    const fallbackHeader = `
      <header class="axyra-header">
        <div class="axyra-header-content">
          <div class="axyra-logo-title">
            <img src="${paths.headerPath.replace(
              'shared-header.html',
              'logo.png'
            )}" alt="AXYRA Logo" class="axyra-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
            <i class="fas fa-building" style="display: none; font-size: 32px; color: #4299e1; margin-right: 12px;" class="axyra-logo-fallback"></i>
            <div class="axyra-title-section">
              <h1 class="axyra-title">AXYRA</h1>
              <span class="axyra-subtitle" id="pageSubtitle">Dashboard</span>
            </div>
          </div>
          <nav class="axyra-nav" id="axyraNav">
            <a href="${paths.headerPath.replace('static/shared-header.html', 'index.html')}" class="axyra-nav-link">
              <i class="fas fa-home"></i> Inicio
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/dashboard/dashboard.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/empleados/empleados.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-users"></i> Empleados
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/horas/gestionar_horas.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-clock"></i> Horas
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/nomina/gestionar_nomina.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-file-invoice-dollar"></i> Nómina
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/cuadre_caja/cuadre_caja.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-calculator"></i> Caja
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/inventario/inventario.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-boxes"></i> Inventario
            </a>
            <a href="${paths.headerPath.replace(
              'static/shared-header.html',
              'modulos/configuracion/configuracion.html'
            )}" class="axyra-nav-link">
              <i class="fas fa-cog"></i> Config
            </a>
          </nav>
          <div class="axyra-user-section">
            <span class="axyra-user-email" id="userEmail">Usuario</span>
            <button class="axyra-logout-btn" data-action="logout">
              <i class="fas fa-sign-out-alt"></i>
              <span class="axyra-logout-text">Cerrar</span>
            </button>
          </div>
        </div>
      </header>
    `;

    document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
    console.log('✅ Header de respaldo creado');
  }
}

// Función global para incluir el header - NO MODIFICA CÓDIGO EXISTENTE
function incluirHeaderAXYRA() {
  return new AxyraHeaderIncluder();
}

// Función para inicializar el header - NO MODIFICA CÓDIGO EXISTENTE
function initHeaderAXYRA() {
  console.log('🚀 Inicializando header compartido AXYRA...');
  return incluirHeaderAXYRA();
}

// Incluir automáticamente cuando se carga la página - NO MODIFICA CÓDIGO EXISTENTE
function initHeader() {
  // Verificar que no se haya inicializado antes
  if (window.axyraHeaderIncluder) {
    console.log('⚠️ Header ya inicializado globalmente');
    return;
  }

  window.axyraHeaderIncluder = new AxyraHeaderIncluder();
}

// Inicialización automática - NO MODIFICA CÓDIGO EXISTENTE
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  // Si el DOM ya está listo, esperar un poco para asegurar que todos los scripts estén cargados
  setTimeout(initHeader, 100);
}

// Exportar para uso en otros módulos - NO MODIFICA CÓDIGO EXISTENTE
window.AxyraHeaderIncluder = AxyraHeaderIncluder;
window.incluirHeaderAXYRA = incluirHeaderAXYRA;
window.initHeaderAXYRA = initHeaderAXYRA;
