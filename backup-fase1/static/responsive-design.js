/* ========================================
   SISTEMA DE RESPONSIVE DESIGN AXYRA
   ======================================== */

class AxyraResponsiveDesign {
    constructor() {
        this.currentBreakpoint = 'desktop';
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1025
        };
        this.init();
    }

    init() {
        console.log('📱 Inicializando Sistema de Responsive Design AXYRA...');
        this.setupEventListeners();
        this.detectBreakpoint();
        this.applyResponsiveStyles();
        this.setupTouchSupport();
        this.setupMobileNavigation();
    }

    setupEventListeners() {
        // Escuchar cambios de tamaño de ventana
        window.addEventListener('resize', this.debounce(() => {
            this.detectBreakpoint();
            this.applyResponsiveStyles();
        }, 250));

        // Escuchar cambios de orientación en dispositivos móviles
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.detectBreakpoint();
                this.applyResponsiveStyles();
            }, 100);
        });

        // Escuchar cambios de preferencias del usuario
        if (window.matchMedia) {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
            prefersDark.addEventListener('change', (e) => {
                this.handleThemeChange(e.matches);
            });

            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
            prefersReducedMotion.addEventListener('change', (e) => {
                this.handleMotionPreference(e.matches);
            });
        }
    }

    detectBreakpoint() {
        const width = window.innerWidth;
        let newBreakpoint = 'desktop';

        if (width <= this.breakpoints.mobile) {
            newBreakpoint = 'mobile';
        } else if (width <= this.breakpoints.tablet) {
            newBreakpoint = 'tablet';
        }

        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.onBreakpointChange(newBreakpoint);
        }
    }

    onBreakpointChange(breakpoint) {
        console.log(`📱 Cambio de breakpoint: ${breakpoint}`);
        
        // Aplicar estilos específicos del breakpoint
        document.body.className = document.body.className.replace(/axyra-breakpoint-\w+/g, '');
        document.body.classList.add(`axyra-breakpoint-${breakpoint}`);
        
        // Actualizar navegación móvil
        if (breakpoint === 'mobile') {
            this.setupMobileNavigation();
        } else {
            this.cleanupMobileNavigation();
        }
        
        // Ajustar gráficos y tablas
        this.adjustChartsForBreakpoint(breakpoint);
        this.adjustTablesForBreakpoint(breakpoint);
        
        // Emitir evento personalizado
        window.dispatchEvent(new CustomEvent('axyra-breakpoint-change', {
            detail: { breakpoint }
        }));
    }

    applyResponsiveStyles() {
        // Aplicar estilos responsivos según el breakpoint actual
        const styles = this.getResponsiveStyles();
        this.injectResponsiveCSS(styles);
        
        // Ajustar layout de grid
        this.adjustGridLayout();
        
        // Ajustar navegación
        this.adjustNavigation();
        
        // Ajustar formularios
        this.adjustForms();
        
        // Ajustar modales
        this.adjustModals();
    }

    getResponsiveStyles() {
        const baseStyles = `
            /* Estilos base responsivos AXYRA */
            .axyra-responsive-hidden-mobile { display: block; }
            .axyra-responsive-hidden-tablet { display: block; }
            .axyra-responsive-hidden-desktop { display: block; }
            
            .axyra-responsive-visible-mobile { display: none; }
            .axyra-responsive-visible-tablet { display: none; }
            .axyra-responsive-visible-desktop { display: none; }
        `;

        const mobileStyles = `
            /* Estilos móviles */
            .axyra-responsive-hidden-mobile { display: none !important; }
            .axyra-responsive-visible-mobile { display: block !important; }
            
            .axyra-container { padding: 1rem; }
            .axyra-grid { grid-template-columns: 1fr !important; }
            .axyra-grid-2 { grid-template-columns: 1fr !important; }
            .axyra-grid-3 { grid-template-columns: 1fr !important; }
            
            .axyra-stats-grid { grid-template-columns: 1fr !important; gap: 1rem; }
            .axyra-stats-grid-secondary { grid-template-columns: 1fr !important; gap: 1rem; }
            
            .axyra-card { margin-bottom: 1rem; padding: 1rem; }
            .axyra-page-header { text-align: center; }
            .axyra-page-title { font-size: 1.5rem; }
            .axyra-page-subtitle { font-size: 1rem; }
            
            .axyra-welcome-card { padding: 1.5rem; text-align: center; }
            .axyra-welcome-title { font-size: 2rem; }
            .axyra-welcome-message { font-size: 1rem; }
            
            .axyra-actions-bar { grid-template-columns: 1fr !important; gap: 0.5rem; }
            .axyra-action-btn { padding: 0.75rem; font-size: 0.9rem; }
            
            .axyra-modal-content { max-width: 95%; margin: 1rem; }
            .axyra-modal-body { padding: 1rem; }
            
            .axyra-form-row { flex-direction: column; }
            .axyra-form-group { margin-bottom: 1rem; }
            
            .axyra-nav { flex-direction: column; gap: 0.5rem; }
            .axyra-nav-link { padding: 0.75rem; text-align: center; }
            
            /* Navegación móvil */
            .axyra-mobile-nav-toggle { display: block; }
            .axyra-nav { display: none; }
            .axyra-nav.axyra-nav-open { display: flex; }
            
            /* Ajustes de gráficos */
            .axyra-chart-container { height: 250px !important; }
            
            /* Ajustes de tablas */
            .axyra-table-responsive { overflow-x: auto; }
            .axyra-table { font-size: 0.8rem; }
            .axyra-table th, .axyra-table td { padding: 0.5rem; }
        `;

        const tabletStyles = `
            /* Estilos tablet */
            .axyra-responsive-hidden-tablet { display: none !important; }
            .axyra-responsive-visible-tablet { display: block !important; }
            
            .axyra-container { padding: 1.5rem; }
            .axyra-grid-3 { grid-template-columns: repeat(2, 1fr) !important; }
            
            .axyra-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .axyra-stats-grid-secondary { grid-template-columns: repeat(3, 1fr) !important; }
            
            .axyra-actions-bar { grid-template-columns: repeat(2, 1fr) !important; }
            
            .axyra-modal-content { max-width: 90%; }
            
            .axyra-form-row { flex-direction: row; flex-wrap: wrap; }
            .axyra-form-group { flex: 1 1 calc(50% - 1rem); }
        `;

        const desktopStyles = `
            /* Estilos desktop */
            .axyra-responsive-hidden-desktop { display: none !important; }
            .axyra-responsive-visible-desktop { display: block !important; }
            
            .axyra-container { padding: 2rem; }
            .axyra-grid { grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
            .axyra-grid-2 { grid-template-columns: repeat(2, 1fr); }
            .axyra-grid-3 { grid-template-columns: repeat(3, 1fr); }
            
            .axyra-stats-grid { grid-template-columns: repeat(4, 1fr); }
            .axyra-stats-grid-secondary { grid-template-columns: repeat(6, 1fr); }
            
            .axyra-actions-bar { grid-template-columns: repeat(4, 1fr); }
            
            .axyra-modal-content { max-width: 80%; }
            
            .axyra-form-row { flex-direction: row; }
            .axyra-form-group { flex: 1; }
        `;

        return baseStyles + mobileStyles + tabletStyles + desktopStyles;
    }

    injectResponsiveCSS(styles) {
        let styleElement = document.getElementById('axyra-responsive-styles');
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = 'axyra-responsive-styles';
            document.head.appendChild(styleElement);
        }
        styleElement.textContent = styles;
    }

    adjustGridLayout() {
        const grids = document.querySelectorAll('.axyra-grid, .axyra-grid-2, .axyra-grid-3');
        grids.forEach(grid => {
            if (this.currentBreakpoint === 'mobile') {
                grid.style.gridTemplateColumns = '1fr';
            } else if (this.currentBreakpoint === 'tablet') {
                if (grid.classList.contains('axyra-grid-3')) {
                    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                } else {
                    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
                }
            } else {
                // Desktop - mantener configuración original
                grid.style.gridTemplateColumns = '';
            }
        });
    }

    adjustNavigation() {
        const nav = document.querySelector('.axyra-nav');
        if (!nav) return;

        if (this.currentBreakpoint === 'mobile') {
            nav.classList.add('axyra-nav-mobile');
        } else {
            nav.classList.remove('axyra-nav-mobile');
        }
    }

    adjustForms() {
        const formRows = document.querySelectorAll('.axyra-form-row');
        formRows.forEach(row => {
            if (this.currentBreakpoint === 'mobile') {
                row.style.flexDirection = 'column';
            } else {
                row.style.flexDirection = 'row';
            }
        });
    }

    adjustModals() {
        const modals = document.querySelectorAll('.axyra-modal-content');
        modals.forEach(modal => {
            if (this.currentBreakpoint === 'mobile') {
                modal.style.maxWidth = '95%';
                modal.style.margin = '1rem';
            } else if (this.currentBreakpoint === 'tablet') {
                modal.style.maxWidth = '90%';
                modal.style.margin = '2rem';
            } else {
                modal.style.maxWidth = '80%';
                modal.style.margin = '2rem';
            }
        });
    }

    setupMobileNavigation() {
        // Crear botón de navegación móvil si no existe
        let mobileNavToggle = document.querySelector('.axyra-mobile-nav-toggle');
        if (!mobileNavToggle) {
            mobileNavToggle = document.createElement('button');
            mobileNavToggle.className = 'axyra-mobile-nav-toggle';
            mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
            mobileNavToggle.setAttribute('aria-label', 'Abrir menú de navegación');
            
            // Insertar antes de la navegación
            const nav = document.querySelector('.axyra-nav');
            if (nav && nav.parentNode) {
                nav.parentNode.insertBefore(mobileNavToggle, nav);
            }
        }

        // Agregar evento de toggle
        mobileNavToggle.addEventListener('click', () => {
            const nav = document.querySelector('.axyra-nav');
            if (nav) {
                nav.classList.toggle('axyra-nav-open');
                const isOpen = nav.classList.contains('axyra-nav-open');
                mobileNavToggle.innerHTML = isOpen ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
                mobileNavToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
            }
        });

        // Cerrar navegación al hacer click en un enlace
        const navLinks = document.querySelectorAll('.axyra-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const nav = document.querySelector('.axyra-nav');
                if (nav && nav.classList.contains('axyra-nav-open')) {
                    nav.classList.remove('axyra-nav-open');
                    mobileNavToggle.innerHTML = '<i class="fas fa-bars"></i>';
                    mobileNavToggle.setAttribute('aria-label', 'Abrir menú de navegación');
                }
            });
        });
    }

    cleanupMobileNavigation() {
        const mobileNavToggle = document.querySelector('.axyra-mobile-nav-toggle');
        if (mobileNavToggle) {
            mobileNavToggle.remove();
        }
        
        const nav = document.querySelector('.axyra-nav');
        if (nav) {
            nav.classList.remove('axyra-nav-open', 'axyra-nav-mobile');
        }
    }

    setupTouchSupport() {
        // Agregar soporte táctil para dispositivos móviles
        if ('ontouchstart' in window) {
            document.body.classList.add('axyra-touch-device');
            
            // Mejorar scroll táctil
            this.setupTouchScroll();
            
            // Agregar gestos táctiles
            this.setupTouchGestures();
        }
    }

    setupTouchScroll() {
        // Mejorar scroll suave en dispositivos táctiles
        const scrollableElements = document.querySelectorAll('.axyra-modal-body, .axyra-card-content');
        scrollableElements.forEach(element => {
            element.style.webkitOverflowScrolling = 'touch';
            element.style.overflowScrolling = 'touch';
        });
    }

    setupTouchGestures() {
        // Implementar gestos táctiles básicos
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            this.handleSwipeGesture(startX, startY, endX, endY);
        });
    }

    handleSwipeGesture(startX, startY, endX, endY) {
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;

        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            // Swipe horizontal
            if (deltaX > 0) {
                // Swipe derecha
                this.handleSwipeRight();
            } else {
                // Swipe izquierda
                this.handleSwipeLeft();
            }
        } else if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > minSwipeDistance) {
            // Swipe vertical
            if (deltaY > 0) {
                // Swipe abajo
                this.handleSwipeDown();
            } else {
                // Swipe arriba
                this.handleSwipeUp();
            }
        }
    }

    handleSwipeRight() {
        // Cerrar navegación móvil si está abierta
        const nav = document.querySelector('.axyra-nav');
        if (nav && nav.classList.contains('axyra-nav-open')) {
            nav.classList.remove('axyra-nav-open');
            const toggle = document.querySelector('.axyra-mobile-nav-toggle');
            if (toggle) {
                toggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    }

    handleSwipeLeft() {
        // Abrir navegación móvil si está cerrada
        const nav = document.querySelector('.axyra-nav');
        if (nav && !nav.classList.contains('axyra-nav-open') && this.currentBreakpoint === 'mobile') {
            nav.classList.add('axyra-nav-open');
            const toggle = document.querySelector('.axyra-mobile-nav-toggle');
            if (toggle) {
                toggle.innerHTML = '<i class="fas fa-times"></i>';
            }
        }
    }

    handleSwipeDown() {
        // Scroll hacia arriba
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    handleSwipeUp() {
        // Scroll hacia abajo
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    adjustChartsForBreakpoint(breakpoint) {
        const charts = document.querySelectorAll('canvas');
        charts.forEach(chart => {
            if (chart.chart) {
                const chartInstance = chart.chart;
                
                // Ajustar opciones según el breakpoint
                if (breakpoint === 'mobile') {
                    chartInstance.options.responsive = true;
                    chartInstance.options.maintainAspectRatio = false;
                    chart.style.height = '250px';
                } else if (breakpoint === 'tablet') {
                    chartInstance.options.responsive = true;
                    chartInstance.options.maintainAspectRatio = false;
                    chart.style.height = '300px';
                } else {
                    chartInstance.options.responsive = true;
                    chartInstance.options.maintainAspectRatio = false;
                    chart.style.height = '400px';
                }
                
                chartInstance.resize();
            }
        });
    }

    adjustTablesForBreakpoint(breakpoint) {
        const tables = document.querySelectorAll('.axyra-table');
        tables.forEach(table => {
            if (breakpoint === 'mobile') {
                // Hacer tabla responsive en móvil
                if (!table.parentNode.classList.contains('axyra-table-responsive')) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'axyra-table-responsive';
                    table.parentNode.insertBefore(wrapper, table);
                    wrapper.appendChild(table);
                }
                
                // Ajustar tamaño de fuente
                table.style.fontSize = '0.8rem';
            } else {
                // Restaurar en tablet/desktop
                table.style.fontSize = '';
            }
        });
    }

    handleThemeChange(isDark) {
        // Cambiar tema según preferencia del usuario
        if (isDark) {
            document.body.classList.add('axyra-theme-dark');
        } else {
            document.body.classList.remove('axyra-theme-dark');
        }
    }

    handleMotionPreference(reduceMotion) {
        // Ajustar animaciones según preferencia del usuario
        if (reduceMotion) {
            document.body.classList.add('axyra-reduce-motion');
        } else {
            document.body.classList.remove('axyra-reduce-motion');
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Métodos públicos para uso externo
    getCurrentBreakpoint() {
        return this.currentBreakpoint;
    }

    isMobile() {
        return this.currentBreakpoint === 'mobile';
    }

    isTablet() {
        return this.currentBreakpoint === 'tablet';
    }

    isDesktop() {
        return this.currentBreakpoint === 'desktop';
    }

    refresh() {
        this.detectBreakpoint();
        this.applyResponsiveStyles();
    }
}

// Inicializar sistema de responsive design cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📱 Inicializando Sistema de Responsive Design...');
    try {
        window.axyraResponsive = new AxyraResponsiveDesign();
    } catch (error) {
        console.error('❌ Error inicializando responsive design:', error);
    }
});

// Funciones globales para uso externo
window.axyraGetBreakpoint = function() {
    if (window.axyraResponsive) {
        return window.axyraResponsive.getCurrentBreakpoint();
    }
    return 'desktop';
};

window.axyraIsMobile = function() {
    if (window.axyraResponsive) {
        return window.axyraResponsive.isMobile();
    }
    return false;
};

window.axyraRefreshResponsive = function() {
    if (window.axyraResponsive) {
        window.axyraResponsive.refresh();
    }
};
