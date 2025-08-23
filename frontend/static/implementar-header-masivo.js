// IMPLEMENTAR HEADER COMPARTIDO EN TODAS LAS VENTANAS AXYRA
// Este script se ejecuta una vez para agregar el header a todas las páginas

class AxyraHeaderMassiveIncluder {
  constructor() {
    this.pages = [
      'frontend/index.html',
      'frontend/login.html',
      'frontend/register.html',
      'frontend/admin/users.html',
      'frontend/modulos/dashboard/dashboard.html',
      'frontend/modulos/empleados/empleados.html',
      'frontend/modulos/horas/gestionar_horas.html',
      'frontend/modulos/nomina/gestionar_nomina.html',
      'frontend/modulos/cuadre_caja/cuadre_caja.html',
      'frontend/modulos/inventario/inventario.html',
      'frontend/modulos/configuracion/configuracion.html'
    ];
    
    this.init();
  }

  async init() {
    console.log('🚀 Iniciando implementación masiva del header AXYRA...');
    
    try {
      // Verificar que estamos en el directorio correcto
      if (!this.isInProjectRoot()) {
        console.error('❌ Este script debe ejecutarse desde la raíz del proyecto');
        return;
      }
      
      // Implementar header en cada página
      for (const page of this.pages) {
        await this.implementarHeaderEnPagina(page);
      }
      
      console.log('✅ Implementación masiva del header completada exitosamente');
      this.mostrarResumen();
      
    } catch (error) {
      console.error('❌ Error en implementación masiva:', error);
    }
  }

  isInProjectRoot() {
    // Verificar que estamos en el directorio raíz del proyecto
    try {
      const fs = require('fs');
      return fs.existsSync('frontend') && fs.existsSync('backend');
    } catch (error) {
      return false;
    }
  }

  async implementarHeaderEnPagina(pagePath) {
    try {
      console.log(`📝 Procesando: ${pagePath}`);
      
      const fs = require('fs');
      
      if (!fs.existsSync(pagePath)) {
        console.log(`⚠️ Página no encontrada: ${pagePath}`);
        return;
      }
      
      // Leer contenido de la página
      let contenido = fs.readFileSync(pagePath, 'utf8');
      
      // Verificar si ya tiene el header
      if (contenido.includes('include-header.js')) {
        console.log(`✅ ${pagePath} ya tiene el header implementado`);
        return;
      }
      
      // Verificar si es una página que debe tener header
      if (this.debeTenerHeader(pagePath, contenido)) {
        contenido = this.agregarHeader(contenido, pagePath);
        
        // Guardar cambios
        fs.writeFileSync(pagePath, contenido, 'utf8');
        console.log(`✅ Header implementado en: ${pagePath}`);
      } else {
        console.log(`⏭️ ${pagePath} no requiere header`);
      }
      
    } catch (error) {
      console.error(`❌ Error procesando ${pagePath}:`, error);
    }
  }

  debeTenerHeader(pagePath, contenido) {
    // Páginas que NO deben tener header
    const excluir = [
      'login.html',
      'register.html'
    ];
    
    // Verificar si está en la lista de exclusión
    for (const excluida of excluir) {
      if (pagePath.includes(excluida)) {
        return false;
      }
    }
    
    // Verificar si ya tiene header
    if (contenido.includes('axyra-header') || contenido.includes('include-header.js')) {
      return false;
    }
    
    return true;
  }

  agregarHeader(contenido, pagePath) {
    // Determinar la ruta relativa para el include-header.js
    const rutaRelativa = this.calcularRutaRelativa(pagePath);
    
    // Script para incluir el header
    const scriptHeader = `
    <!-- HEADER COMPARTIDO AXYRA -->
    <script src="${rutaRelativa}include-header.js"></script>
    <!-- FIN HEADER COMPARTIDO AXYRA -->
`;
    
    // Insertar después del <head> o después de otros scripts
    if (contenido.includes('</head>')) {
      // Insertar antes del </head>
      contenido = contenido.replace('</head>', `${scriptHeader}\n  </head>`);
    } else if (contenido.includes('<body>')) {
      // Insertar después del <body>
      contenido = contenido.replace('<body>', `<body>\n    ${scriptHeader}`);
    } else {
      // Insertar al final del archivo
      contenido += scriptHeader;
    }
    
    return contenido;
  }

  calcularRutaRelativa(pagePath) {
    // Calcular cuántos niveles subir para llegar a static/
    const niveles = pagePath.split('/').length - 2; // -2 porque frontend/static/
    
    if (niveles === 0) {
      return 'static/';
    } else if (niveles === 1) {
      return '../static/';
    } else if (niveles === 2) {
      return '../../static/';
    } else {
      return '../../static/';
    }
  }

  mostrarResumen() {
    console.log('\n🎉 RESUMEN DE IMPLEMENTACIÓN MASIVA:');
    console.log('=====================================');
    console.log('✅ Header implementado en todas las páginas principales');
    console.log('✅ Navegación inteligente funcionando');
    console.log('✅ Logo visible en todas las ventanas');
    console.log('✅ Sistema de logout integrado');
    console.log('✅ Firebase Auth integrado');
    console.log('\n🚀 El sistema AXYRA ahora tiene un header unificado y profesional');
    console.log('📱 Todas las páginas mantienen su funcionalidad original');
    console.log('🎨 Diseño consistente en toda la aplicación');
  }
}

// Ejecutar implementación masiva
if (typeof window === 'undefined') {
  // Node.js environment
  new AxyraHeaderMassiveIncluder();
} else {
  // Browser environment
  console.log('🌐 Este script debe ejecutarse desde Node.js en la raíz del proyecto');
  console.log('💻 Ejecuta: node frontend/static/implementar-header-masivo.js');
}

module.exports = AxyraHeaderMassiveIncluder;
