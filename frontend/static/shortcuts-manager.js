/**
 * AXYRA - Sistema de Gestión de Shortcuts y Atajos de Teclado
 * Maneja atajos de teclado, comandos y navegación rápida
 */

class AxyraShortcutsManager {
  constructor() {
    this.shortcuts = [];
    this.commands = [];
    this.isEnabled = true;
    this.isRecording = false;
    this.recordingShortcut = null;
    this.activeShortcuts = new Set();

    this.init();
  }

  init() {
    console.log('⌨️ Inicializando sistema de shortcuts...');
    this.loadShortcuts();
    this.setupDefaultShortcuts();
    this.setupDefaultCommands();
    this.setupEventListeners();
    this.setupKeyboardHandlers();
  }

  loadShortcuts() {
    try {
      const stored = localStorage.getItem('axyra_shortcuts');
      if (stored) {
        this.shortcuts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando shortcuts:', error);
    }
  }

  saveShortcuts() {
    try {
      localStorage.setItem('axyra_shortcuts', JSON.stringify(this.shortcuts));
    } catch (error) {
      console.error('Error guardando shortcuts:', error);
    }
  }

  setupDefaultShortcuts() {
    if (this.shortcuts.length === 0) {
      this.shortcuts = [
        {
          id: 'ctrl_s',
          key: 'Ctrl+S',
          keys: ['ctrl', 's'],
          description: 'Guardar',
          action: 'save',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_n',
          key: 'Ctrl+N',
          keys: ['ctrl', 'n'],
          description: 'Nuevo',
          action: 'new',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_o',
          key: 'Ctrl+O',
          keys: ['ctrl', 'o'],
          description: 'Abrir',
          action: 'open',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_f',
          key: 'Ctrl+F',
          keys: ['ctrl', 'f'],
          description: 'Buscar',
          action: 'search',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_h',
          key: 'Ctrl+H',
          keys: ['ctrl', 'h'],
          description: 'Ayuda',
          action: 'help',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_shift_p',
          key: 'Ctrl+Shift+P',
          keys: ['ctrl', 'shift', 'p'],
          description: 'Paleta de comandos',
          action: 'command_palette',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_shift_t',
          key: 'Ctrl+Shift+T',
          keys: ['ctrl', 'shift', 't'],
          description: 'Nueva pestaña',
          action: 'new_tab',
          category: 'navigation',
          enabled: true,
        },
        {
          id: 'ctrl_w',
          key: 'Ctrl+W',
          keys: ['ctrl', 'w'],
          description: 'Cerrar pestaña',
          action: 'close_tab',
          category: 'navigation',
          enabled: true,
        },
        {
          id: 'ctrl_tab',
          key: 'Ctrl+Tab',
          keys: ['ctrl', 'tab'],
          description: 'Siguiente pestaña',
          action: 'next_tab',
          category: 'navigation',
          enabled: true,
        },
        {
          id: 'ctrl_shift_tab',
          key: 'Ctrl+Shift+Tab',
          keys: ['ctrl', 'shift', 'tab'],
          description: 'Pestaña anterior',
          action: 'previous_tab',
          category: 'navigation',
          enabled: true,
        },
        {
          id: 'f1',
          key: 'F1',
          keys: ['f1'],
          description: 'Ayuda',
          action: 'help',
          category: 'general',
          enabled: true,
        },
        {
          id: 'f2',
          key: 'F2',
          keys: ['f2'],
          description: 'Renombrar',
          action: 'rename',
          category: 'general',
          enabled: true,
        },
        {
          id: 'f5',
          key: 'F5',
          keys: ['f5'],
          description: 'Actualizar',
          action: 'refresh',
          category: 'general',
          enabled: true,
        },
        {
          id: 'f11',
          key: 'F11',
          keys: ['f11'],
          description: 'Pantalla completa',
          action: 'fullscreen',
          category: 'view',
          enabled: true,
        },
        {
          id: 'escape',
          key: 'Escape',
          keys: ['escape'],
          description: 'Cancelar',
          action: 'cancel',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_shift_d',
          key: 'Ctrl+Shift+D',
          keys: ['ctrl', 'shift', 'd'],
          description: 'Duplicar',
          action: 'duplicate',
          category: 'general',
          enabled: true,
        },
        {
          id: 'ctrl_shift_c',
          key: 'Ctrl+Shift+C',
          keys: ['ctrl', 'shift', 'c'],
          description: 'Copiar formato',
          action: 'copy_format',
          category: 'format',
          enabled: true,
        },
        {
          id: 'ctrl_shift_v',
          key: 'Ctrl+Shift+V',
          keys: ['ctrl', 'shift', 'v'],
          description: 'Pegar formato',
          action: 'paste_format',
          category: 'format',
          enabled: true,
        },
        {
          id: 'ctrl_shift_z',
          key: 'Ctrl+Shift+Z',
          keys: ['ctrl', 'shift', 'z'],
          description: 'Rehacer',
          action: 'redo',
          category: 'edit',
          enabled: true,
        },
        {
          id: 'ctrl_shift_s',
          key: 'Ctrl+Shift+S',
          keys: ['ctrl', 'shift', 's'],
          description: 'Guardar como',
          action: 'save_as',
          category: 'general',
          enabled: true,
        },
      ];

      this.saveShortcuts();
    }
  }

  setupDefaultCommands() {
    this.commands = [
      {
        id: 'save',
        name: 'Guardar',
        description: 'Guarda el documento actual',
        handler: this.handleSave.bind(this),
      },
      {
        id: 'new',
        name: 'Nuevo',
        description: 'Crea un nuevo documento',
        handler: this.handleNew.bind(this),
      },
      {
        id: 'open',
        name: 'Abrir',
        description: 'Abre un documento existente',
        handler: this.handleOpen.bind(this),
      },
      {
        id: 'search',
        name: 'Buscar',
        description: 'Abre el diálogo de búsqueda',
        handler: this.handleSearch.bind(this),
      },
      {
        id: 'help',
        name: 'Ayuda',
        description: 'Muestra la ayuda del sistema',
        handler: this.handleHelp.bind(this),
      },
      {
        id: 'command_palette',
        name: 'Paleta de Comandos',
        description: 'Muestra la paleta de comandos',
        handler: this.handleCommandPalette.bind(this),
      },
      {
        id: 'new_tab',
        name: 'Nueva Pestaña',
        description: 'Abre una nueva pestaña',
        handler: this.handleNewTab.bind(this),
      },
      {
        id: 'close_tab',
        name: 'Cerrar Pestaña',
        description: 'Cierra la pestaña actual',
        handler: this.handleCloseTab.bind(this),
      },
      {
        id: 'next_tab',
        name: 'Siguiente Pestaña',
        description: 'Cambia a la siguiente pestaña',
        handler: this.handleNextTab.bind(this),
      },
      {
        id: 'previous_tab',
        name: 'Pestaña Anterior',
        description: 'Cambia a la pestaña anterior',
        handler: this.handlePreviousTab.bind(this),
      },
      {
        id: 'rename',
        name: 'Renombrar',
        description: 'Renombra el elemento seleccionado',
        handler: this.handleRename.bind(this),
      },
      {
        id: 'refresh',
        name: 'Actualizar',
        description: 'Actualiza la página actual',
        handler: this.handleRefresh.bind(this),
      },
      {
        id: 'fullscreen',
        name: 'Pantalla Completa',
        description: 'Alterna el modo de pantalla completa',
        handler: this.handleFullscreen.bind(this),
      },
      {
        id: 'cancel',
        name: 'Cancelar',
        description: 'Cancela la operación actual',
        handler: this.handleCancel.bind(this),
      },
      {
        id: 'duplicate',
        name: 'Duplicar',
        description: 'Duplica el elemento seleccionado',
        handler: this.handleDuplicate.bind(this),
      },
      {
        id: 'copy_format',
        name: 'Copiar Formato',
        description: 'Copia el formato del elemento seleccionado',
        handler: this.handleCopyFormat.bind(this),
      },
      {
        id: 'paste_format',
        name: 'Pegar Formato',
        description: 'Pega el formato copiado',
        handler: this.handlePasteFormat.bind(this),
      },
      {
        id: 'redo',
        name: 'Rehacer',
        description: 'Rehace la última acción deshecha',
        handler: this.handleRedo.bind(this),
      },
      {
        id: 'save_as',
        name: 'Guardar Como',
        description: 'Guarda el documento con un nuevo nombre',
        handler: this.handleSaveAs.bind(this),
      },
    ];
  }

  setupEventListeners() {
    // Escuchar cambios en la configuración
    document.addEventListener('shortcutsChanged', (event) => {
      this.handleShortcutsChange(event.detail);
    });
  }

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (event) => {
      if (!this.isEnabled) return;

      const shortcut = this.findShortcut(event);
      if (shortcut) {
        event.preventDefault();
        this.executeShortcut(shortcut);
      }
    });

    document.addEventListener('keyup', (event) => {
      this.activeShortcuts.delete(event.key.toLowerCase());
    });
  }

  findShortcut(event) {
    const keys = this.getPressedKeys(event);
    const shortcut = this.shortcuts.find((s) => s.enabled && this.keysMatch(s.keys, keys));

    return shortcut;
  }

  getPressedKeys(event) {
    const keys = [];

    if (event.ctrlKey) keys.push('ctrl');
    if (event.shiftKey) keys.push('shift');
    if (event.altKey) keys.push('alt');
    if (event.metaKey) keys.push('meta');

    keys.push(event.key.toLowerCase());

    return keys;
  }

  keysMatch(shortcutKeys, pressedKeys) {
    if (shortcutKeys.length !== pressedKeys.length) return false;

    return shortcutKeys.every((key) => pressedKeys.includes(key));
  }

  executeShortcut(shortcut) {
    const command = this.commands.find((c) => c.id === shortcut.action);
    if (command) {
      command.handler();
      console.log('⌨️ Shortcut ejecutado:', shortcut.description);
    }
  }

  handleShortcutsChange(change) {
    const { shortcutId, enabled } = change;
    const shortcut = this.shortcuts.find((s) => s.id === shortcutId);
    if (shortcut) {
      shortcut.enabled = enabled;
      this.saveShortcuts();
    }
  }

  // Handlers de comandos
  handleSave() {
    console.log('💾 Guardando documento...');
    // Implementar lógica de guardado
  }

  handleNew() {
    console.log('📄 Creando nuevo documento...');
    // Implementar lógica de nuevo documento
  }

  handleOpen() {
    console.log('📂 Abriendo documento...');
    // Implementar lógica de apertura
  }

  handleSearch() {
    console.log('🔍 Abriendo búsqueda...');
    // Implementar lógica de búsqueda
  }

  handleHelp() {
    console.log('❓ Mostrando ayuda...');
    // Implementar lógica de ayuda
  }

  handleCommandPalette() {
    this.showCommandPalette();
  }

  handleNewTab() {
    console.log('➕ Abriendo nueva pestaña...');
    // Implementar lógica de nueva pestaña
  }

  handleCloseTab() {
    console.log('❌ Cerrando pestaña...');
    // Implementar lógica de cerrar pestaña
  }

  handleNextTab() {
    console.log('➡️ Siguiente pestaña...');
    // Implementar lógica de siguiente pestaña
  }

  handlePreviousTab() {
    console.log('⬅️ Pestaña anterior...');
    // Implementar lógica de pestaña anterior
  }

  handleRename() {
    console.log('✏️ Renombrando...');
    // Implementar lógica de renombrar
  }

  handleRefresh() {
    console.log('🔄 Actualizando...');
    window.location.reload();
  }

  handleFullscreen() {
    console.log('🖥️ Alternando pantalla completa...');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  handleCancel() {
    console.log('❌ Cancelando...');
    // Implementar lógica de cancelar
  }

  handleDuplicate() {
    console.log('📋 Duplicando...');
    // Implementar lógica de duplicar
  }

  handleCopyFormat() {
    console.log('📋 Copiando formato...');
    // Implementar lógica de copiar formato
  }

  handlePasteFormat() {
    console.log('📋 Pegando formato...');
    // Implementar lógica de pegar formato
  }

  handleRedo() {
    console.log('↩️ Rehaciendo...');
    // Implementar lógica de rehacer
  }

  handleSaveAs() {
    console.log('💾 Guardando como...');
    // Implementar lógica de guardar como
  }

  showCommandPalette() {
    const palette = document.createElement('div');
    palette.id = 'command-palette';
    palette.innerHTML = `
      <div class="command-palette-overlay">
        <div class="command-palette-container">
          <div class="command-palette-header">
            <input type="text" id="command-search" placeholder="Buscar comandos..." autofocus>
            <button onclick="document.getElementById('command-palette').remove()" class="btn-close">×</button>
          </div>
          <div class="command-palette-body">
            <div class="command-list" id="command-list">
              ${this.renderCommandList()}
            </div>
          </div>
          <div class="command-palette-footer">
            <div class="shortcuts-help">
              <span>↑↓</span> Navegar
              <span>Enter</span> Ejecutar
              <span>Esc</span> Cerrar
            </div>
          </div>
        </div>
      </div>
    `;

    palette.style.cssText = `
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

    document.body.appendChild(palette);

    // Configurar búsqueda
    const searchInput = document.getElementById('command-search');
    const commandList = document.getElementById('command-list');

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const filteredCommands = this.commands.filter(
        (c) => c.name.toLowerCase().includes(query) || c.description.toLowerCase().includes(query)
      );
      commandList.innerHTML = this.renderCommandList(filteredCommands);
    });

    // Configurar navegación con teclado
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        palette.remove();
      } else if (e.key === 'Enter') {
        const selectedCommand = commandList.querySelector('.command-item.selected');
        if (selectedCommand) {
          const commandId = selectedCommand.dataset.commandId;
          this.executeCommand(commandId);
          palette.remove();
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateCommands(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateCommands(-1);
      }
    });

    // Configurar clics
    commandList.addEventListener('click', (e) => {
      const commandItem = e.target.closest('.command-item');
      if (commandItem) {
        const commandId = commandItem.dataset.commandId;
        this.executeCommand(commandId);
        palette.remove();
      }
    });
  }

  renderCommandList(commands = null) {
    const commandsToRender = commands || this.commands;

    return commandsToRender
      .map(
        (command) => `
      <div class="command-item" data-command-id="${command.id}">
        <div class="command-name">${command.name}</div>
        <div class="command-description">${command.description}</div>
        <div class="command-shortcut">${this.getCommandShortcut(command.id)}</div>
      </div>
    `
      )
      .join('');
  }

  getCommandShortcut(commandId) {
    const shortcut = this.shortcuts.find((s) => s.action === commandId);
    return shortcut ? shortcut.key : '';
  }

  navigateCommands(direction) {
    const commandItems = document.querySelectorAll('.command-item');
    const selected = document.querySelector('.command-item.selected');

    if (commandItems.length === 0) return;

    let newIndex = 0;
    if (selected) {
      const currentIndex = Array.from(commandItems).indexOf(selected);
      newIndex = currentIndex + direction;
      if (newIndex < 0) newIndex = commandItems.length - 1;
      if (newIndex >= commandItems.length) newIndex = 0;
    }

    commandItems.forEach((item) => item.classList.remove('selected'));
    commandItems[newIndex].classList.add('selected');
  }

  executeCommand(commandId) {
    const command = this.commands.find((c) => c.id === commandId);
    if (command) {
      command.handler();
    }
  }

  createShortcut(shortcutData) {
    const shortcut = {
      id: shortcutData.id || 'shortcut_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      key: shortcutData.key,
      keys: shortcutData.keys,
      description: shortcutData.description,
      action: shortcutData.action,
      category: shortcutData.category || 'general',
      enabled: shortcutData.enabled !== false,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    this.shortcuts.push(shortcut);
    this.saveShortcuts();

    console.log('✅ Shortcut creado:', shortcut.description);
    return shortcut;
  }

  updateShortcut(shortcutId, updates) {
    const shortcutIndex = this.shortcuts.findIndex((s) => s.id === shortcutId);
    if (shortcutIndex === -1) {
      throw new Error('Shortcut no encontrado');
    }

    this.shortcuts[shortcutIndex] = {
      ...this.shortcuts[shortcutIndex],
      ...updates,
    };

    this.saveShortcuts();

    console.log('✅ Shortcut actualizado:', this.shortcuts[shortcutIndex].description);
    return this.shortcuts[shortcutIndex];
  }

  deleteShortcut(shortcutId) {
    const shortcutIndex = this.shortcuts.findIndex((s) => s.id === shortcutId);
    if (shortcutIndex === -1) {
      throw new Error('Shortcut no encontrado');
    }

    const shortcut = this.shortcuts[shortcutIndex];
    this.shortcuts.splice(shortcutIndex, 1);
    this.saveShortcuts();

    console.log('🗑️ Shortcut eliminado:', shortcut.description);
    return shortcut;
  }

  getShortcuts(filters = {}) {
    let filteredShortcuts = [...this.shortcuts];

    if (filters.category) {
      filteredShortcuts = filteredShortcuts.filter((s) => s.category === filters.category);
    }

    if (filters.enabled !== undefined) {
      filteredShortcuts = filteredShortcuts.filter((s) => s.enabled === filters.enabled);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredShortcuts = filteredShortcuts.filter(
        (s) => s.description.toLowerCase().includes(searchTerm) || s.key.toLowerCase().includes(searchTerm)
      );
    }

    return filteredShortcuts;
  }

  getShortcutsByCategory() {
    const categories = {};
    this.shortcuts.forEach((shortcut) => {
      if (!categories[shortcut.category]) {
        categories[shortcut.category] = [];
      }
      categories[shortcut.category].push(shortcut);
    });
    return categories;
  }

  getShortcutStatistics() {
    const totalShortcuts = this.shortcuts.length;
    const enabledShortcuts = this.shortcuts.filter((s) => s.enabled).length;
    const categoryStats = {};

    this.shortcuts.forEach((shortcut) => {
      categoryStats[shortcut.category] = (categoryStats[shortcut.category] || 0) + 1;
    });

    return {
      total: totalShortcuts,
      enabled: enabledShortcuts,
      disabled: totalShortcuts - enabledShortcuts,
      categoryStats: categoryStats,
    };
  }

  enableShortcut(shortcutId) {
    const shortcut = this.shortcuts.find((s) => s.id === shortcutId);
    if (shortcut) {
      shortcut.enabled = true;
      this.saveShortcuts();
      console.log('✅ Shortcut habilitado:', shortcut.description);
    }
  }

  disableShortcut(shortcutId) {
    const shortcut = this.shortcuts.find((s) => s.id === shortcutId);
    if (shortcut) {
      shortcut.enabled = false;
      this.saveShortcuts();
      console.log('❌ Shortcut deshabilitado:', shortcut.description);
    }
  }

  enableAllShortcuts() {
    this.shortcuts.forEach((shortcut) => {
      shortcut.enabled = true;
    });
    this.saveShortcuts();
    console.log('✅ Todos los shortcuts habilitados');
  }

  disableAllShortcuts() {
    this.shortcuts.forEach((shortcut) => {
      shortcut.enabled = false;
    });
    this.saveShortcuts();
    console.log('❌ Todos los shortcuts deshabilitados');
  }

  startRecordingShortcut() {
    this.isRecording = true;
    this.recordingShortcut = null;
    console.log('🎬 Grabando shortcut...');
  }

  stopRecordingShortcut() {
    this.isRecording = false;
    this.recordingShortcut = null;
    console.log('⏹️ Grabación de shortcut detenida');
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  exportShortcuts() {
    const data = {
      shortcuts: this.shortcuts,
      commands: this.commands,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-shortcuts-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Shortcuts exportados');
  }

  importShortcuts(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (data.shortcuts) {
            this.shortcuts = [...this.shortcuts, ...data.shortcuts];
            this.saveShortcuts();
          }

          if (data.commands) {
            this.commands = [...this.commands, ...data.commands];
          }

          console.log('✅ Shortcuts importados exitosamente');
          resolve();
        } catch (error) {
          console.error('Error importando shortcuts:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };

      reader.readAsText(file);
    });
  }

  showShortcutsHelp() {
    const help = document.createElement('div');
    help.id = 'shortcuts-help';
    help.innerHTML = `
      <div class="shortcuts-help-overlay">
        <div class="shortcuts-help-container">
          <div class="shortcuts-help-header">
            <h3>⌨️ Atajos de Teclado</h3>
            <button onclick="document.getElementById('shortcuts-help').remove()" class="btn-close">×</button>
          </div>
          <div class="shortcuts-help-body">
            ${this.renderShortcutsHelp()}
          </div>
        </div>
      </div>
    `;

    help.style.cssText = `
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

    document.body.appendChild(help);
  }

  renderShortcutsHelp() {
    const categories = this.getShortcutsByCategory();

    return Object.entries(categories)
      .map(
        ([category, shortcuts]) => `
      <div class="shortcuts-category">
        <h4>${category.charAt(0).toUpperCase() + category.slice(1)}</h4>
        <div class="shortcuts-list">
          ${shortcuts
            .map(
              (shortcut) => `
            <div class="shortcut-item">
              <div class="shortcut-key">${shortcut.key}</div>
              <div class="shortcut-description">${shortcut.description}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
      )
      .join('');
  }
}

// Inicializar sistema de shortcuts
let axyraShortcutsManager;
document.addEventListener('DOMContentLoaded', () => {
  axyraShortcutsManager = new AxyraShortcutsManager();
  window.axyraShortcutsManager = axyraShortcutsManager;
});

// Exportar para uso global
window.AxyraShortcutsManager = AxyraShortcutsManager;

