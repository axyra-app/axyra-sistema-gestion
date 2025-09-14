/**
 * AXYRA - Configuración de Áreas de Trabajo
 * Sistema personalizable para diferentes empresas
 */

class AXYRAWorkAreasConfig {
  constructor() {
    this.defaultAreas = ['RESTAURANTE', 'BAR', 'PISCINA', 'DIA DE SOL', 'HOSPEDAJE', 'TURCO', 'OTROS'];
    this.init();
  }

  /**
   * Inicializa la configuración de áreas
   */
  init() {
    this.loadCustomAreas();
    this.setupAreaManagement();
    this.createModals();
  }

  /**
   * Crea los modales necesarios
   */
  createModals() {
    // Modal para agregar área
    const addAreaModal = `
      <div id="modalAddArea" class="axyra-modal" style="display: none;">
        <div class="axyra-modal-content">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-plus"></i> Agregar Nueva Área
            </h3>
            <button class="axyra-modal-close" onclick="axyraWorkAreas.closeModal('modalAddArea')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <div class="axyra-form-group">
              <label for="newAreaName" class="axyra-form-label">Nombre de la Nueva Área</label>
              <input type="text" id="newAreaName" class="axyra-form-input" placeholder="Ej: RECEPCIÓN" required />
            </div>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="axyraWorkAreas.closeModal('modalAddArea')">
              Cancelar
            </button>
            <button class="axyra-btn axyra-btn-primary" onclick="axyraWorkAreas.confirmAddArea()">
              <i class="fas fa-plus"></i> Agregar Área
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal para editar área
    const editAreaModal = `
      <div id="modalEditArea" class="axyra-modal" style="display: none;">
        <div class="axyra-modal-content">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-edit"></i> Editar Área
            </h3>
            <button class="axyra-modal-close" onclick="axyraWorkAreas.closeModal('modalEditArea')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <div class="axyra-form-group">
              <label for="editAreaName" class="axyra-form-label">Nuevo Nombre del Área</label>
              <input type="text" id="editAreaName" class="axyra-form-input" required />
              <input type="hidden" id="editAreaOldName" />
            </div>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="axyraWorkAreas.closeModal('modalEditArea')">
              Cancelar
            </button>
            <button class="axyra-btn axyra-btn-primary" onclick="axyraWorkAreas.confirmEditArea()">
              <i class="fas fa-save"></i> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal de confirmación para eliminar
    const deleteAreaModal = `
      <div id="modalDeleteArea" class="axyra-modal" style="display: none;">
        <div class="axyra-modal-content">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-exclamation-triangle"></i> Confirmar Eliminación
            </h3>
            <button class="axyra-modal-close" onclick="axyraWorkAreas.closeModal('modalDeleteArea')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <p>¿Está seguro de que desea eliminar el área "<span id="deleteAreaName"></span>"?</p>
            <p class="axyra-text-warning">Esta acción no se puede deshacer.</p>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="axyraWorkAreas.closeModal('modalDeleteArea')">
              Cancelar
            </button>
            <button class="axyra-btn axyra-btn-error" onclick="axyraWorkAreas.confirmDeleteArea()">
              <i class="fas fa-trash"></i> Eliminar Área
            </button>
          </div>
        </div>
      </div>
    `;

    // Modal de confirmación para reset
    const resetAreasModal = `
      <div id="modalResetAreas" class="axyra-modal" style="display: none;">
        <div class="axyra-modal-content">
          <div class="axyra-modal-header">
            <h3 class="axyra-modal-title">
              <i class="fas fa-undo"></i> Restablecer Áreas por Defecto
            </h3>
            <button class="axyra-modal-close" onclick="axyraWorkAreas.closeModal('modalResetAreas')">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="axyra-modal-body">
            <p>¿Está seguro de que desea restablecer las áreas por defecto?</p>
            <p class="axyra-text-warning">Se perderán todas las áreas personalizadas.</p>
          </div>
          <div class="axyra-modal-footer">
            <button class="axyra-btn axyra-btn-secondary" onclick="axyraWorkAreas.closeModal('modalResetAreas')">
              Cancelar
            </button>
            <button class="axyra-btn axyra-btn-warning" onclick="axyraWorkAreas.confirmResetAreas()">
              <i class="fas fa-undo"></i> Restablecer
            </button>
          </div>
        </div>
      </div>
    `;

    // Agregar modales al body
    document.body.insertAdjacentHTML('beforeend', addAreaModal);
    document.body.insertAdjacentHTML('beforeend', editAreaModal);
    document.body.insertAdjacentHTML('beforeend', deleteAreaModal);
    document.body.insertAdjacentHTML('beforeend', resetAreasModal);
  }

  /**
   * Abre un modal específico
   */
  openModal(modalId) {
    document.getElementById(modalId).style.display = 'flex';
  }

  /**
   * Cierra un modal específico
   */
  closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }

  /**
   * Carga las áreas personalizadas del usuario
   */
  loadCustomAreas() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return this.defaultAreas;

    const customAreas = localStorage.getItem(`axyra_work_areas_${currentUser.username}`);
    if (customAreas) {
      try {
        return JSON.parse(customAreas);
      } catch (error) {
        console.error('Error cargando áreas personalizadas:', error);
        return this.defaultAreas;
      }
    }

    // Si no hay áreas personalizadas, crear con las por defecto
    this.saveCustomAreas(this.defaultAreas);
    return this.defaultAreas;
  }

  /**
   * Guarda las áreas personalizadas del usuario
   */
  saveCustomAreas(areas) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return false;

    try {
      localStorage.setItem(`axyra_work_areas_${currentUser.username}`, JSON.stringify(areas));
      console.log('Áreas de trabajo guardadas:', areas);
      return true;
    } catch (error) {
      console.error('Error guardando áreas:', error);
      return false;
    }
  }

  /**
   * Obtiene el usuario actual
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem('axyra_isolated_user');
      if (!userData) return null;

      const user = JSON.parse(userData);
      return user && user.username ? user : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  }

  /**
   * Obtiene las áreas de trabajo actuales
   */
  getWorkAreas() {
    return this.loadCustomAreas();
  }

  /**
   * Agrega una nueva área de trabajo
   */
  addWorkArea(areaName) {
    if (!areaName || areaName.trim() === '') {
      throw new Error('El nombre del área no puede estar vacío');
    }

    const areas = this.getWorkAreas();
    const normalizedName = areaName.trim().toUpperCase();

    if (areas.includes(normalizedName)) {
      throw new Error('Esta área ya existe');
    }

    areas.push(normalizedName);
    this.saveCustomAreas(areas);
    return areas;
  }

  /**
   * Elimina un área de trabajo
   */
  removeWorkArea(areaName) {
    const areas = this.getWorkAreas();
    const normalizedName = areaName.trim().toUpperCase();

    const index = areas.indexOf(normalizedName);
    if (index === -1) {
      throw new Error('Área no encontrada');
    }

    areas.splice(index, 1);
    this.saveCustomAreas(areas);
    return areas;
  }

  /**
   * Edita un área de trabajo
   */
  editWorkArea(oldName, newName) {
    if (!newName || newName.trim() === '') {
      throw new Error('El nuevo nombre del área no puede estar vacío');
    }

    const areas = this.getWorkAreas();
    const oldNormalizedName = oldName.trim().toUpperCase();
    const newNormalizedName = newName.trim().toUpperCase();

    const index = areas.indexOf(oldNormalizedName);
    if (index === -1) {
      throw new Error('Área no encontrada');
    }

    if (areas.includes(newNormalizedName) && oldNormalizedName !== newNormalizedName) {
      throw new Error('Ya existe un área con ese nombre');
    }

    areas[index] = newNormalizedName;
    this.saveCustomAreas(areas);
    return areas;
  }

  /**
   * Restablece las áreas por defecto
   */
  resetToDefault() {
    this.saveCustomAreas(this.defaultAreas);
    return this.defaultAreas;
  }

  /**
   * Configura la gestión de áreas en la interfaz
   */
  setupAreaManagement() {
    // Buscar elementos de configuración de áreas
    const areaConfigElements = document.querySelectorAll('[data-axyra-area-config]');
    areaConfigElements.forEach((element) => {
      this.setupAreaConfigElement(element);
    });
  }

  /**
   * Configura un elemento específico para gestión de áreas
   */
  setupAreaConfigElement(element) {
    const configType = element.getAttribute('data-axyra-area-config');

    switch (configType) {
      case 'select':
        this.setupAreaSelect(element);
        break;
      case 'input':
        this.setupAreaInput(element);
        break;
      case 'manager':
        this.setupAreaManager(element);
        break;
    }
  }

  /**
   * Configura un select de áreas
   */
  setupAreaSelect(selectElement) {
    const areas = this.getWorkAreas();

    // Limpiar opciones existentes
    selectElement.innerHTML = '<option value="">Seleccionar área</option>';

    // Agregar opciones de áreas
    areas.forEach((area) => {
      const option = document.createElement('option');
      option.value = area;
      option.textContent = area;
      selectElement.appendChild(option);
    });
  }

  /**
   * Configura un input de áreas con autocompletado
   */
  setupAreaInput(inputElement) {
    const areas = this.getWorkAreas();

    // Crear datalist para autocompletado
    const datalist = document.createElement('datalist');
    datalist.id = `axyra-areas-${Math.random().toString(36).substr(2, 9)}`;

    areas.forEach((area) => {
      const option = document.createElement('option');
      option.value = area;
      datalist.appendChild(option);
    });

    // Conectar input con datalist
    inputElement.setAttribute('list', datalist.id);
    document.body.appendChild(datalist);
  }

  /**
   * Configura un gestor completo de áreas
   */
  setupAreaManager(containerElement) {
    const areas = this.getWorkAreas();

    containerElement.innerHTML = `
            <div class="axyra-area-manager">
                <div class="axyra-area-manager-header">
                    <h4>Configuración de Áreas de Trabajo</h4>
                    <button class="axyra-btn axyra-btn-primary" onclick="axyraWorkAreas.addNewArea()">
                        <i class="fas fa-plus"></i> Agregar Área
                    </button>
                </div>
                <div class="axyra-area-manager-content">
                    <div class="axyra-area-list" id="axyraAreaList">
                        ${this.renderAreaList(areas)}
                    </div>
                </div>
                <div class="axyra-area-manager-actions">
                    <button class="axyra-btn axyra-btn-secondary" onclick="axyraWorkAreas.resetToDefault()">
                        <i class="fas fa-undo"></i> Restablecer por Defecto
                    </button>
                </div>
            </div>
        `;
  }

  /**
   * Renderiza la lista de áreas
   */
  renderAreaList(areas) {
    if (areas.length === 0) {
      return '<p class="axyra-no-areas">No hay áreas configuradas</p>';
    }

    return areas
      .map(
        (area) => `
            <div class="axyra-area-item" data-area="${area}">
                <span class="axyra-area-name">${area}</span>
                <div class="axyra-area-actions">
                    <button class="axyra-btn axyra-btn-sm axyra-btn-ghost" onclick="axyraWorkAreas.editArea('${area}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="axyra-btn axyra-btn-sm axyra-btn-danger" onclick="axyraWorkAreas.deleteArea('${area}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
      )
      .join('');
  }

  /**
   * Agrega una nueva área (llamado desde la interfaz)
   */
  addNewArea() {
    this.openModal('modalAddArea');
    document.getElementById('newAreaName').value = '';
    document.getElementById('newAreaName').focus();
  }

  /**
   * Confirma la adición de área
   */
  confirmAddArea() {
    const areaName = document.getElementById('newAreaName').value.trim();
    if (!areaName) {
      this.showMessage('El nombre del área no puede estar vacío', 'error');
      return;
    }

    try {
      const newAreas = this.addWorkArea(areaName);
      this.refreshAreaManager();
      this.closeModal('modalAddArea');
      this.showMessage('Área agregada exitosamente', 'success');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Edita un área existente (llamado desde la interfaz)
   */
  editArea(oldName) {
    document.getElementById('editAreaOldName').value = oldName;
    document.getElementById('editAreaName').value = oldName;
    this.openModal('modalEditArea');
    document.getElementById('editAreaName').focus();
  }

  /**
   * Confirma la edición de área
   */
  confirmEditArea() {
    const oldName = document.getElementById('editAreaOldName').value;
    const newName = document.getElementById('editAreaName').value.trim();
    
    if (!newName) {
      this.showMessage('El nuevo nombre del área no puede estar vacío', 'error');
      return;
    }

    if (newName === oldName) {
      this.closeModal('modalEditArea');
      return;
    }

    try {
      const newAreas = this.editWorkArea(oldName, newName);
      this.refreshAreaManager();
      this.closeModal('modalEditArea');
      this.showMessage('Área editada exitosamente', 'success');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Elimina un área (llamado desde la interfaz)
   */
  deleteArea(areaName) {
    document.getElementById('deleteAreaName').textContent = areaName;
    this.openModal('modalDeleteArea');
  }

  /**
   * Confirma la eliminación de área
   */
  confirmDeleteArea() {
    const areaName = document.getElementById('deleteAreaName').textContent;

    try {
      const newAreas = this.removeWorkArea(areaName);
      this.refreshAreaManager();
      this.closeModal('modalDeleteArea');
      this.showMessage('Área eliminada exitosamente', 'success');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Restablece áreas por defecto (llamado desde la interfaz)
   */
  resetToDefault() {
    this.openModal('modalResetAreas');
  }

  /**
   * Confirma el reset de áreas
   */
  confirmResetAreas() {
    try {
      const defaultAreas = this.resetToDefault();
      this.refreshAreaManager();
      this.closeModal('modalResetAreas');
      this.showMessage('Áreas restablecidas por defecto', 'success');
    } catch (error) {
      this.showMessage(error.message, 'error');
    }
  }

  /**
   * Actualiza el gestor de áreas
   */
  refreshAreaManager() {
    const areaList = document.getElementById('axyraAreaList');
    if (areaList) {
      const areas = this.getWorkAreas();
      areaList.innerHTML = this.renderAreaList(areas);
    }

    // Actualizar todos los selects e inputs de áreas
    this.refreshAllAreaElements();
  }

  /**
   * Actualiza todos los elementos de áreas en la página
   */
  refreshAllAreaElements() {
    // Actualizar selects
    document.querySelectorAll('[data-axyra-area-config="select"]').forEach((select) => {
      this.setupAreaSelect(select);
    });

    // Actualizar inputs
    document.querySelectorAll('[data-axyra-area-config="input"]').forEach((input) => {
      this.setupAreaInput(input);
    });
  }

  /**
   * Muestra mensajes al usuario
   */
  showMessage(message, type = 'info') {
    // Buscar sistema de mensajes existente
    if (window.showMessage) {
      window.showMessage(message, type);
    } else if (window.mostrarMensaje) {
      window.mostrarMensaje(message, type);
    } else {
      // Fallback: crear mensaje temporal
      const mensajeDiv = document.createElement('div');
      mensajeDiv.className = `axyra-message axyra-${type}-message`;
      mensajeDiv.innerHTML = `
        <div class="axyra-message-content">
          <span class="axyra-message-text">${message}</span>
          <button class="axyra-message-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
      `;

      document.body.appendChild(mensajeDiv);

      setTimeout(() => {
        if (mensajeDiv.parentElement) {
          mensajeDiv.remove();
        }
      }, 5000);
    }
  }

  /**
   * Exporta las áreas configuradas
   */
  exportAreas() {
    const areas = this.getWorkAreas();
    const data = {
      areas: areas,
      exportDate: new Date().toISOString(),
      user: this.getCurrentUser()?.username || 'unknown',
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `axyra_work_areas_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /**
   * Importa áreas desde un archivo
   */
  importAreas(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data.areas && Array.isArray(data.areas)) {
          this.saveCustomAreas(data.areas);
          this.refreshAreaManager();
          this.showMessage('Áreas importadas exitosamente', 'success');
        } else {
          throw new Error('Formato de archivo inválido');
        }
      } catch (error) {
        this.showMessage('Error importando áreas: ' + error.message, 'error');
      }
    };
    reader.readAsText(file);
  }
}

// Inicializar sistema de áreas de trabajo
let axyraWorkAreas;
document.addEventListener('DOMContentLoaded', () => {
  axyraWorkAreas = new AXYRAWorkAreasConfig();
});

// Exportar para uso global
window.AXYRAWorkAreasConfig = AXYRAWorkAreasConfig;
