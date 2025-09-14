// VERIFICACIÓN DEL HEADER COMPARTIDO AXYRA
// Este script verifica que el header compartido esté funcionando correctamente

class AxyraHeaderVerification {
  constructor() {
    this.verificationResults = {
      headerExists: false,
      navigationExists: false,
      userSectionExists: false,
      logoExists: false,
      scriptsLoaded: false,
    };
    this.init();
  }

  init() {
    console.log('🔍 Iniciando verificación del header compartido AXYRA...');

    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.verifyHeader());
    } else {
      this.verifyHeader();
    }
  }

  verifyHeader() {
    console.log('🔍 Verificando elementos del header...');

    // Verificar que el header existe
    const header = document.querySelector('.axyra-header');
    this.verificationResults.headerExists = !!header;

    if (header) {
      console.log('✅ Header encontrado');

      // Verificar navegación
      const nav = header.querySelector('.axyra-nav');
      this.verificationResults.navigationExists = !!nav;

      // Verificar sección de usuario
      const userSection = header.querySelector('.axyra-user-section');
      this.verificationResults.userSectionExists = !!userSection;

      // Verificar logo
      const logo = header.querySelector('.axyra-logo, .axyra-logo-img, .axyra-logo-icon');
      this.verificationResults.logoExists = !!logo;

      // Verificar scripts
      this.verificationResults.scriptsLoaded = this.checkScripts();

      // Mostrar resultados
      this.showResults();

      // Configurar funcionalidad del header
      this.setupHeaderFunctionality();
    } else {
      console.error('❌ Header no encontrado');
      this.showError();
    }
  }

  checkScripts() {
    const requiredScripts = ['shared-header.js', 'include-header.js', 'axyra-styles.css'];

    let loadedCount = 0;

    requiredScripts.forEach((script) => {
      if (document.querySelector(`script[src*="${script}"]`) || document.querySelector(`link[href*="${script}"]`)) {
        loadedCount++;
      }
    });

    return loadedCount === requiredScripts.length;
  }

  setupHeaderFunctionality() {
    try {
      // Configurar logout
      const logoutBtn = document.querySelector('[data-action="logout"]');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
        console.log('✅ Botón de logout configurado');
      }

      // Configurar navegación
      const navLinks = document.querySelectorAll('.axyra-nav-link');
      navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
          // Verificar si el enlace es válido
          if (link.href && link.href !== '#' && link.href !== window.location.href) {
            console.log('✅ Navegación configurada:', link.href);
          }
        });
      });

      // Actualizar información del usuario
      this.updateUserInfo();
    } catch (error) {
      console.error('❌ Error configurando funcionalidad del header:', error);
    }
  }

  updateUserInfo() {
    try {
      const userEmail = document.getElementById('userEmail');
      if (userEmail) {
        // Obtener usuario del localStorage
        const userData = localStorage.getItem('axyra_isolated_user');
        if (userData) {
          const user = JSON.parse(userData);
          userEmail.textContent = user.email || user.username || 'Usuario';
          console.log('✅ Información del usuario actualizada');
        } else {
          userEmail.textContent = 'Usuario';
        }
      }
    } catch (error) {
      console.error('❌ Error actualizando información del usuario:', error);
    }
  }

  handleLogout() {
    try {
      console.log('🚪 Procesando logout...');

      // Limpiar localStorage
      localStorage.removeItem('axyra_isolated_user');
      localStorage.removeItem('axyra_firebase_user');

      // Redirigir al login
      window.location.href = '../../login.html';
    } catch (error) {
      console.error('❌ Error en logout:', error);
      // Fallback: recargar página
      window.location.reload();
    }
  }

  showResults() {
    console.log('📊 RESULTADOS DE VERIFICACIÓN DEL HEADER:');
    console.log('==========================================');
    console.log(`✅ Header existe: ${this.verificationResults.headerExists}`);
    console.log(`✅ Navegación existe: ${this.verificationResults.navigationExists}`);
    console.log(`✅ Sección de usuario existe: ${this.verificationResults.userSectionExists}`);
    console.log(`✅ Logo existe: ${this.verificationResults.logoExists}`);
    console.log(`✅ Scripts cargados: ${this.verificationResults.scriptsLoaded}`);

    const successCount = Object.values(this.verificationResults).filter(Boolean).length;
    const totalCount = Object.keys(this.verificationResults).length;

    console.log(`\n🎯 RESULTADO FINAL: ${successCount}/${totalCount} elementos funcionando`);

    if (successCount === totalCount) {
      console.log('🎉 ¡Header compartido funcionando perfectamente!');
    } else {
      console.log('⚠️ Algunos elementos del header necesitan atención');
    }
  }

  showError() {
    console.error('❌ ERROR: Header compartido no encontrado');
    console.log('🔧 SOLUCIONES:');
    console.log('1. Verificar que include-header.js esté incluido en el HTML');
    console.log('2. Verificar que las rutas relativas sean correctas');
    console.log('3. Verificar que shared-header.html exista en static/');
    console.log('4. Verificar la consola del navegador para errores');
  }
}

// Inicializar verificación cuando se carga la página
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.axyraHeaderVerification = new AxyraHeaderVerification();
  });
} else {
  window.axyraHeaderVerification = new AxyraHeaderVerification();
}

// Exportar para uso en otros módulos
window.AxyraHeaderVerification = AxyraHeaderVerification;
