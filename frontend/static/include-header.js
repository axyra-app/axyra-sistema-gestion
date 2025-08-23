// INCLUIR HEADER COMPARTIDO AXYRA
// Este script incluye automáticamente el header compartido en cualquier página

class AxyraHeaderIncluder {
  constructor() {
    this.headerPath = '../../static/shared-header.html';
    this.scriptPath = '../../static/shared-header.js';
    this.init();
  }

  async init() {
    try {
      await this.includeHeader();
      await this.includeScript();
      console.log('✅ Header compartido AXYRA incluido correctamente');
    } catch (error) {
      console.error('❌ Error incluyendo header compartido:', error);
    }
  }

  async includeHeader() {
    try {
      console.log('📥 Intentando cargar header desde:', this.headerPath);
      const response = await fetch(this.headerPath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const headerHTML = await response.text();
      console.log('✅ Header HTML cargado correctamente, longitud:', headerHTML.length);
      
      // Insertar el header al inicio del body
      const body = document.body;
      if (body) {
        body.insertAdjacentHTML('afterbegin', headerHTML);
        console.log('✅ Header insertado en el body');
      } else {
        console.error('❌ Body no encontrado');
      }
    } catch (error) {
      console.warn('⚠️ No se pudo cargar header compartido, usando fallback:', error);
      this.createFallbackHeader();
    }
  }

  async includeScript() {
    try {
      console.log('📥 Cargando script del header desde:', this.scriptPath);
      const script = document.createElement('script');
      script.src = this.scriptPath;
      script.async = false; // Cambiar a false para asegurar que se ejecute
      script.onload = () => {
        console.log('✅ Script del header cargado y ejecutado');
        // Inicializar el header después de cargar el script
        if (window.axyraSharedHeader) {
          setTimeout(() => {
            try {
              new window.axyraSharedHeader();
              console.log('✅ Header inicializado correctamente');
            } catch (error) {
              console.error('❌ Error inicializando header:', error);
            }
          }, 100);
        } else {
          console.log('⚠️ Clase del header no disponible');
        }
      };
      script.onerror = (error) => {
        console.error('❌ Error cargando script del header:', error);
      };
      document.head.appendChild(script);
    } catch (error) {
      console.warn('⚠️ No se pudo cargar script del header:', error);
    }
  }

  createFallbackHeader() {
    // Header de respaldo si falla la carga
    const fallbackHeader = `
      <header class="axyra-header">
        <div class="axyra-header-content">
          <div class="axyra-logo-title">
            <img src="../../logo.png" alt="AXYRA Logo" class="axyra-logo">
            <div class="axyra-title-section">
              <h1 class="axyra-title">AXYRA</h1>
              <span class="axyra-subtitle">Dashboard</span>
            </div>
          </div>
          <nav class="axyra-nav">
            <a href="../../index.html" class="axyra-nav-link">
              <i class="fas fa-home"></i> Inicio
            </a>
            <a href="../dashboard/dashboard.html" class="axyra-nav-link">
              <i class="fas fa-tachometer-alt"></i> Dashboard
            </a>
            <a href="../empleados/empleados.html" class="axyra-nav-link">
              <i class="fas fa-users"></i> Empleados
            </a>
            <a href="../horas/gestionar_horas.html" class="axyra-nav-link">
              <i class="fas fa-clock"></i> Horas
            </a>
            <a href="../nomina/gestionar_nomina.html" class="axyra-nav-link">
              <i class="fas fa-file-invoice-dollar"></i> Nómina
            </a>
            <a href="../cuadre_caja/cuadre_caja.html" class="axyra-nav-link">
              <i class="fas fa-calculator"></i> Caja
            </a>
            <a href="../inventario/inventario.html" class="axyra-nav-link">
              <i class="fas fa-boxes"></i> Inventario
            </a>
            <a href="../configuracion/configuracion.html" class="axyra-nav-link">
              <i class="fas fa-cog"></i> Config
            </a>
          </nav>
          <div class="axyra-user-section">
            <span class="axyra-user-email">Usuario</span>
            <button class="axyra-logout-btn" onclick="logout()">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </header>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
  }
}

// Función global para incluir el header
function incluirHeaderAXYRA() {
  return new AxyraHeaderIncluder();
}

// Incluir automáticamente cuando se carga la página
function initHeader() {
  console.log('🚀 Inicializando header compartido AXYRA...');
  incluirHeaderAXYRA();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  // Si el DOM ya está listo, esperar un poco para asegurar que todos los scripts estén cargados
  setTimeout(initHeader, 100);
}
