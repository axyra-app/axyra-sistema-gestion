/**
 * AXYRA - Sistema Avanzado de Gestión de Temas y Personalización
 * Maneja temas, colores, fuentes, layouts y personalización completa
 */

class AxyraAdvancedThemeManager {
  constructor() {
    this.themes = [];
    this.currentTheme = null;
    this.customizations = {};
    this.fonts = [];
    this.colorPalettes = [];
    this.layouts = [];
    this.isDarkMode = false;
    this.autoTheme = true;
    this.systemTheme = 'light';
    
    this.init();
  }

  init() {
    console.log('🎨 Inicializando sistema avanzado de temas...');
    this.loadThemes();
    this.loadCustomizations();
    this.setupDefaultThemes();
    this.setupDefaultFonts();
    this.setupDefaultColorPalettes();
    this.setupDefaultLayouts();
    this.setupSystemThemeDetection();
    this.setupEventListeners();
    this.applyCurrentTheme();
  }

  loadThemes() {
    try {
      const stored = localStorage.getItem('axyra_themes');
      if (stored) {
        this.themes = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando temas:', error);
    }
  }

  saveThemes() {
    try {
      localStorage.setItem('axyra_themes', JSON.stringify(this.themes));
    } catch (error) {
      console.error('Error guardando temas:', error);
    }
  }

  loadCustomizations() {
    try {
      const stored = localStorage.getItem('axyra_theme_customizations');
      if (stored) {
        this.customizations = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando personalizaciones:', error);
    }
  }

  saveCustomizations() {
    try {
      localStorage.setItem('axyra_theme_customizations', JSON.stringify(this.customizations));
    } catch (error) {
      console.error('Error guardando personalizaciones:', error);
    }
  }

  setupDefaultThemes() {
    if (this.themes.length === 0) {
      this.themes = [
        {
          id: 'light',
          name: 'Claro',
          description: 'Tema claro estándar',
          type: 'light',
          colors: {
            primary: '#007bff',
            secondary: '#6c757d',
            success: '#28a745',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8',
            light: '#f8f9fa',
            dark: '#343a40',
            background: '#ffffff',
            surface: '#f8f9fa',
            text: '#212529',
            textSecondary: '#6c757d',
            border: '#dee2e6',
            shadow: 'rgba(0, 0, 0, 0.1)'
          },
          fonts: {
            primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            secondary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '3rem'
          },
          borderRadius: {
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '1rem'
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          },
          isDefault: true,
          isBuiltIn: true
        },
        {
          id: 'dark',
          name: 'Oscuro',
          description: 'Tema oscuro estándar',
          type: 'dark',
          colors: {
            primary: '#0d6efd',
            secondary: '#6c757d',
            success: '#198754',
            danger: '#dc3545',
            warning: '#ffc107',
            info: '#0dcaf0',
            light: '#f8f9fa',
            dark: '#212529',
            background: '#121212',
            surface: '#1e1e1e',
            text: '#ffffff',
            textSecondary: '#b3b3b3',
            border: '#333333',
            shadow: 'rgba(0, 0, 0, 0.3)'
          },
          fonts: {
            primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            secondary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '3rem'
          },
          borderRadius: {
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '1rem'
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
            md: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
            lg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
            xl: '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
          },
          isDefault: false,
          isBuiltIn: true
        },
        {
          id: 'blue',
          name: 'Azul',
          description: 'Tema con colores azules',
          type: 'light',
          colors: {
            primary: '#1e40af',
            secondary: '#64748b',
            success: '#059669',
            danger: '#dc2626',
            warning: '#d97706',
            info: '#0891b2',
            light: '#f1f5f9',
            dark: '#1e293b',
            background: '#ffffff',
            surface: '#f8fafc',
            text: '#1e293b',
            textSecondary: '#64748b',
            border: '#e2e8f0',
            shadow: 'rgba(30, 64, 175, 0.1)'
          },
          fonts: {
            primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            secondary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '3rem'
          },
          borderRadius: {
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '1rem'
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(30, 64, 175, 0.05)',
            md: '0 4px 6px -1px rgba(30, 64, 175, 0.1)',
            lg: '0 10px 15px -3px rgba(30, 64, 175, 0.1)',
            xl: '0 20px 25px -5px rgba(30, 64, 175, 0.1)'
          },
          isDefault: false,
          isBuiltIn: true
        },
        {
          id: 'green',
          name: 'Verde',
          description: 'Tema con colores verdes',
          type: 'light',
          colors: {
            primary: '#059669',
            secondary: '#64748b',
            success: '#10b981',
            danger: '#ef4444',
            warning: '#f59e0b',
            info: '#06b6d4',
            light: '#f0fdf4',
            dark: '#064e3b',
            background: '#ffffff',
            surface: '#f0fdf4',
            text: '#064e3b',
            textSecondary: '#64748b',
            border: '#d1fae5',
            shadow: 'rgba(5, 150, 105, 0.1)'
          },
          fonts: {
            primary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            secondary: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            mono: 'SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace'
          },
          spacing: {
            xs: '0.25rem',
            sm: '0.5rem',
            md: '1rem',
            lg: '1.5rem',
            xl: '3rem'
          },
          borderRadius: {
            sm: '0.25rem',
            md: '0.375rem',
            lg: '0.5rem',
            xl: '1rem'
          },
          shadows: {
            sm: '0 1px 2px 0 rgba(5, 150, 105, 0.05)',
            md: '0 4px 6px -1px rgba(5, 150, 105, 0.1)',
            lg: '0 10px 15px -3px rgba(5, 150, 105, 0.1)',
            xl: '0 20px 25px -5px rgba(5, 150, 105, 0.1)'
          },
          isDefault: false,
          isBuiltIn: true
        }
      ];
      
      this.saveThemes();
    }
  }

  setupDefaultFonts() {
    this.fonts = [
      {
        id: 'inter',
        name: 'Inter',
        family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        category: 'sans-serif',
        weights: ['300', '400', '500', '600', '700'],
        isDefault: true
      },
      {
        id: 'roboto',
        name: 'Roboto',
        family: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        category: 'sans-serif',
        weights: ['300', '400', '500', '700'],
        isDefault: false
      },
      {
        id: 'open-sans',
        name: 'Open Sans',
        family: 'Open Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        category: 'sans-serif',
        weights: ['300', '400', '600', '700'],
        isDefault: false
      },
      {
        id: 'lato',
        name: 'Lato',
        family: 'Lato, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        category: 'sans-serif',
        weights: ['300', '400', '700', '900'],
        isDefault: false
      },
      {
        id: 'poppins',
        name: 'Poppins',
        family: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        category: 'sans-serif',
        weights: ['300', '400', '500', '600', '700'],
        isDefault: false
      },
      {
        id: 'source-code-pro',
        name: 'Source Code Pro',
        family: 'Source Code Pro, SF Mono, Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
        category: 'monospace',
        weights: ['300', '400', '500', '600', '700'],
        isDefault: false
      }
    ];
  }

  setupDefaultColorPalettes() {
    this.colorPalettes = [
      {
        id: 'default',
        name: 'Por Defecto',
        colors: ['#007bff', '#6c757d', '#28a745', '#dc3545', '#ffc107', '#17a2b8'],
        isDefault: true
      },
      {
        id: 'blue',
        name: 'Azul',
        colors: ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe', '#eff6ff'],
        isDefault: false
      },
      {
        id: 'green',
        name: 'Verde',
        colors: ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'],
        isDefault: false
      },
      {
        id: 'purple',
        name: 'Púrpura',
        colors: ['#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'],
        isDefault: false
      },
      {
        id: 'orange',
        name: 'Naranja',
        colors: ['#ea580c', '#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'],
        isDefault: false
      },
      {
        id: 'red',
        name: 'Rojo',
        colors: ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca', '#fee2e2'],
        isDefault: false
      }
    ];
  }

  setupDefaultLayouts() {
    this.layouts = [
      {
        id: 'default',
        name: 'Por Defecto',
        description: 'Layout estándar del sistema',
        properties: {
          sidebarWidth: '250px',
          headerHeight: '60px',
          footerHeight: '40px',
          contentPadding: '20px',
          borderRadius: '8px',
          shadow: '0 2px 4px rgba(0,0,0,0.1)'
        },
        isDefault: true
      },
      {
        id: 'compact',
        name: 'Compacto',
        description: 'Layout compacto para pantallas pequeñas',
        properties: {
          sidebarWidth: '200px',
          headerHeight: '50px',
          footerHeight: '30px',
          contentPadding: '15px',
          borderRadius: '6px',
          shadow: '0 1px 3px rgba(0,0,0,0.1)'
        },
        isDefault: false
      },
      {
        id: 'spacious',
        name: 'Espacioso',
        description: 'Layout espacioso para pantallas grandes',
        properties: {
          sidebarWidth: '300px',
          headerHeight: '70px',
          footerHeight: '50px',
          contentPadding: '30px',
          borderRadius: '12px',
          shadow: '0 4px 8px rgba(0,0,0,0.1)'
        },
        isDefault: false
      }
    ];
  }

  setupSystemThemeDetection() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      this.systemTheme = mediaQuery.matches ? 'dark' : 'light';
      
      mediaQuery.addEventListener('change', (e) => {
        this.systemTheme = e.matches ? 'dark' : 'light';
        if (this.autoTheme) {
          this.applySystemTheme();
        }
      });
    }
  }

  setupEventListeners() {
    // Escuchar cambios en el tema
    document.addEventListener('themeChanged', (event) => {
      this.handleThemeChange(event.detail);
    });

    // Escuchar cambios en personalizaciones
    document.addEventListener('customizationChanged', (event) => {
      this.handleCustomizationChange(event.detail);
    });
  }

  handleThemeChange(change) {
    const { themeId } = change;
    this.setTheme(themeId);
  }

  handleCustomizationChange(change) {
    const { customization, value } = change;
    this.customizations[customization] = value;
    this.saveCustomizations();
    this.applyCurrentTheme();
  }

  setTheme(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) {
      console.warn('Tema no encontrado:', themeId);
      return;
    }

    this.currentTheme = theme;
    this.applyTheme(theme);
    
    // Guardar preferencia
    localStorage.setItem('axyra_current_theme', themeId);
    
    console.log('🎨 Tema aplicado:', theme.name);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    
    // Aplicar colores
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    // Aplicar fuentes
    Object.entries(theme.fonts).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });

    // Aplicar espaciado
    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Aplicar border radius
    Object.entries(theme.borderRadius).forEach(([key, value]) => {
      root.style.setProperty(`--border-radius-${key}`, value);
    });

    // Aplicar sombras
    Object.entries(theme.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Aplicar personalizaciones
    this.applyCustomizations();

    // Actualizar clase del body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme.id}`);
  }

  applyCustomizations() {
    const root = document.documentElement;
    
    Object.entries(this.customizations).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        root.style.setProperty(`--custom-${key}`, value);
      }
    });
  }

  applyCurrentTheme() {
    const savedTheme = localStorage.getItem('axyra_current_theme');
    if (savedTheme) {
      this.setTheme(savedTheme);
    } else if (this.autoTheme) {
      this.applySystemTheme();
    } else {
      const defaultTheme = this.themes.find(t => t.isDefault);
      if (defaultTheme) {
        this.setTheme(defaultTheme.id);
      }
    }
  }

  applySystemTheme() {
    const systemTheme = this.themes.find(t => t.id === this.systemTheme);
    if (systemTheme) {
      this.setTheme(systemTheme.id);
    }
  }

  createTheme(themeData) {
    const theme = {
      id: themeData.id || 'theme_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: themeData.name,
      description: themeData.description || '',
      type: themeData.type || 'light',
      colors: themeData.colors || {},
      fonts: themeData.fonts || {},
      spacing: themeData.spacing || {},
      borderRadius: themeData.borderRadius || {},
      shadows: themeData.shadows || {},
      isDefault: false,
      isBuiltIn: false,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser()
    };

    this.themes.push(theme);
    this.saveThemes();

    console.log('✅ Tema creado:', theme.name);
    return theme;
  }

  updateTheme(themeId, updates) {
    const themeIndex = this.themes.findIndex(t => t.id === themeId);
    if (themeIndex === -1) {
      throw new Error('Tema no encontrado');
    }

    this.themes[themeIndex] = { 
      ...this.themes[themeIndex], 
      ...updates 
    };

    this.saveThemes();

    console.log('✅ Tema actualizado:', this.themes[themeIndex].name);
    return this.themes[themeIndex];
  }

  deleteTheme(themeId) {
    const themeIndex = this.themes.findIndex(t => t.id === themeId);
    if (themeIndex === -1) {
      throw new Error('Tema no encontrado');
    }

    const theme = this.themes[themeIndex];
    
    // No permitir eliminar temas del sistema
    if (theme.isBuiltIn) {
      throw new Error('No se puede eliminar un tema del sistema');
    }

    this.themes.splice(themeIndex, 1);
    this.saveThemes();

    console.log('🗑️ Tema eliminado:', theme.name);
    return theme;
  }

  getThemes(filters = {}) {
    let filteredThemes = [...this.themes];

    if (filters.type) {
      filteredThemes = filteredThemes.filter(t => t.type === filters.type);
    }

    if (filters.builtIn !== undefined) {
      filteredThemes = filteredThemes.filter(t => t.isBuiltIn === filters.builtIn);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredThemes = filteredThemes.filter(t => 
        t.name.toLowerCase().includes(searchTerm) ||
        t.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredThemes;
  }

  getThemeStatistics() {
    const totalThemes = this.themes.length;
    const builtInThemes = this.themes.filter(t => t.isBuiltIn).length;
    const customThemes = this.themes.filter(t => !t.isBuiltIn).length;
    const lightThemes = this.themes.filter(t => t.type === 'light').length;
    const darkThemes = this.themes.filter(t => t.type === 'dark').length;

    return {
      total: totalThemes,
      builtIn: builtInThemes,
      custom: customThemes,
      light: lightThemes,
      dark: darkThemes
    };
  }

  setCustomization(key, value) {
    this.customizations[key] = value;
    this.saveCustomizations();
    this.applyCurrentTheme();
    
    console.log('🎨 Personalización actualizada:', key, value);
  }

  getCustomization(key) {
    return this.customizations[key];
  }

  resetCustomizations() {
    this.customizations = {};
    this.saveCustomizations();
    this.applyCurrentTheme();
    
    console.log('🔄 Personalizaciones restablecidas');
  }

  exportTheme(themeId) {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) {
      throw new Error('Tema no encontrado');
    }

    const data = {
      theme: theme,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-theme-${theme.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log('📊 Tema exportado:', theme.name);
  }

  importTheme(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          
          if (data.theme) {
            const theme = data.theme;
            theme.id = 'theme_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            theme.isBuiltIn = false;
            theme.createdAt = new Date().toISOString();
            theme.createdBy = this.getCurrentUser();
            
            this.themes.push(theme);
            this.saveThemes();
            
            console.log('✅ Tema importado:', theme.name);
            resolve(theme);
          } else {
            reject(new Error('Archivo de tema inválido'));
          }
        } catch (error) {
          console.error('Error importando tema:', error);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };
      
      reader.readAsText(file);
    });
  }

  showThemeEditor() {
    const editor = document.createElement('div');
    editor.id = 'theme-editor';
    editor.innerHTML = `
      <div class="theme-editor-overlay">
        <div class="theme-editor-container">
          <div class="theme-editor-header">
            <h3>🎨 Editor de Temas</h3>
            <button onclick="document.getElementById('theme-editor').remove()" class="btn-close">×</button>
          </div>
          <div class="theme-editor-body">
            <div class="theme-editor-tabs">
              <button class="tab-btn active" data-tab="colors">Colores</button>
              <button class="tab-btn" data-tab="fonts">Fuentes</button>
              <button class="tab-btn" data-tab="spacing">Espaciado</button>
              <button class="tab-btn" data-tab="layout">Layout</button>
            </div>
            <div class="theme-editor-content">
              <div class="tab-content active" id="colors-tab">
                ${this.renderColorEditor()}
              </div>
              <div class="tab-content" id="fonts-tab">
                ${this.renderFontEditor()}
              </div>
              <div class="tab-content" id="spacing-tab">
                ${this.renderSpacingEditor()}
              </div>
              <div class="tab-content" id="layout-tab">
                ${this.renderLayoutEditor()}
              </div>
            </div>
          </div>
          <div class="theme-editor-footer">
            <button class="btn btn-secondary" onclick="document.getElementById('theme-editor').remove()">Cancelar</button>
            <button class="btn btn-primary" onclick="axyraAdvancedThemeManager.saveCurrentTheme()">Guardar</button>
          </div>
        </div>
      </div>
    `;

    editor.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    document.body.appendChild(editor);

    // Configurar tabs
    const tabBtns = editor.querySelectorAll('.tab-btn');
    const tabContents = editor.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
      });
    });
  }

  renderColorEditor() {
    const colors = this.currentTheme?.colors || {};
    
    return Object.entries(colors).map(([key, value]) => `
      <div class="color-input-group">
        <label for="color-${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <div class="color-input-wrapper">
          <input type="color" id="color-${key}" value="${value}" onchange="axyraAdvancedThemeManager.updateColor('${key}', this.value)">
          <input type="text" value="${value}" onchange="axyraAdvancedThemeManager.updateColor('${key}', this.value)">
        </div>
      </div>
    `).join('');
  }

  renderFontEditor() {
    const fonts = this.currentTheme?.fonts || {};
    
    return Object.entries(fonts).map(([key, value]) => `
      <div class="font-input-group">
        <label for="font-${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <select id="font-${key}" onchange="axyraAdvancedThemeManager.updateFont('${key}', this.value)">
          ${this.fonts.map(font => `
            <option value="${font.family}" ${font.family === value ? 'selected' : ''}>${font.name}</option>
          `).join('')}
        </select>
      </div>
    `).join('');
  }

  renderSpacingEditor() {
    const spacing = this.currentTheme?.spacing || {};
    
    return Object.entries(spacing).map(([key, value]) => `
      <div class="spacing-input-group">
        <label for="spacing-${key}">${key.charAt(0).toUpperCase() + key.slice(1)}</label>
        <input type="text" id="spacing-${key}" value="${value}" onchange="axyraAdvancedThemeManager.updateSpacing('${key}', this.value)">
      </div>
    `).join('');
  }

  renderLayoutEditor() {
    const layouts = this.layouts;
    
    return `
      <div class="layout-selector">
        <label for="layout-select">Layout</label>
        <select id="layout-select" onchange="axyraAdvancedThemeManager.applyLayout(this.value)">
          ${layouts.map(layout => `
            <option value="${layout.id}">${layout.name}</option>
          `).join('')}
        </select>
      </div>
    `;
  }

  updateColor(key, value) {
    if (this.currentTheme) {
      this.currentTheme.colors[key] = value;
      this.applyTheme(this.currentTheme);
    }
  }

  updateFont(key, value) {
    if (this.currentTheme) {
      this.currentTheme.fonts[key] = value;
      this.applyTheme(this.currentTheme);
    }
  }

  updateSpacing(key, value) {
    if (this.currentTheme) {
      this.currentTheme.spacing[key] = value;
      this.applyTheme(this.currentTheme);
    }
  }

  applyLayout(layoutId) {
    const layout = this.layouts.find(l => l.id === layoutId);
    if (layout) {
      const root = document.documentElement;
      Object.entries(layout.properties).forEach(([key, value]) => {
        root.style.setProperty(`--layout-${key}`, value);
      });
    }
  }

  saveCurrentTheme() {
    if (this.currentTheme) {
      this.updateTheme(this.currentTheme.id, this.currentTheme);
      console.log('✅ Tema guardado');
    }
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }
}

// Inicializar sistema de temas
let axyraAdvancedThemeManager;
document.addEventListener('DOMContentLoaded', () => {
  axyraAdvancedThemeManager = new AxyraAdvancedThemeManager();
  window.axyraAdvancedThemeManager = axyraAdvancedThemeManager;
});

// Exportar para uso global
window.AxyraAdvancedThemeManager = AxyraAdvancedThemeManager;
