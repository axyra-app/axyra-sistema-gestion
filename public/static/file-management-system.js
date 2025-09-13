/**
 * AXYRA - Sistema de Gestión de Archivos y Documentos
 * Maneja archivos, documentos, versiones y colaboración
 */

class AxyraFileManagementSystem {
  constructor() {
    this.files = [];
    this.folders = [];
    this.versions = [];
    this.permissions = [];
    this.uploads = [];
    this.downloads = [];
    this.isInitialized = false;
    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/plain',
      'text/csv',
      'application/json',
      'application/zip',
    ];

    this.init();
  }

  init() {
    console.log('📁 Inicializando sistema de gestión de archivos...');
    this.loadFiles();
    this.loadFolders();
    this.loadVersions();
    this.loadPermissions();
    this.setupEventListeners();
    this.setupDragAndDrop();
    this.isInitialized = true;
  }

  loadFiles() {
    try {
      const stored = localStorage.getItem('axyra_files');
      if (stored) {
        this.files = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando archivos:', error);
    }
  }

  saveFiles() {
    try {
      localStorage.setItem('axyra_files', JSON.stringify(this.files));
    } catch (error) {
      console.error('Error guardando archivos:', error);
    }
  }

  loadFolders() {
    try {
      const stored = localStorage.getItem('axyra_folders');
      if (stored) {
        this.folders = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando carpetas:', error);
    }
  }

  saveFolders() {
    try {
      localStorage.setItem('axyra_folders', JSON.stringify(this.folders));
    } catch (error) {
      console.error('Error guardando carpetas:', error);
    }
  }

  loadVersions() {
    try {
      const stored = localStorage.getItem('axyra_file_versions');
      if (stored) {
        this.versions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando versiones:', error);
    }
  }

  saveVersions() {
    try {
      localStorage.setItem('axyra_file_versions', JSON.stringify(this.versions));
    } catch (error) {
      console.error('Error guardando versiones:', error);
    }
  }

  loadPermissions() {
    try {
      const stored = localStorage.getItem('axyra_file_permissions');
      if (stored) {
        this.permissions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Error cargando permisos:', error);
    }
  }

  savePermissions() {
    try {
      localStorage.setItem('axyra_file_permissions', JSON.stringify(this.permissions));
    } catch (error) {
      console.error('Error guardando permisos:', error);
    }
  }

  setupEventListeners() {
    // Escuchar cambios en archivos
    document.addEventListener('fileChanged', (event) => {
      this.handleFileChange(event.detail);
    });

    // Escuchar cambios en permisos
    document.addEventListener('permissionChanged', (event) => {
      this.handlePermissionChange(event.detail);
    });
  }

  setupDragAndDrop() {
    // Configurar drag and drop global
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      this.handleFileUpload(files);
    });
  }

  handleFileChange(change) {
    const { fileId, action, data } = change;

    switch (action) {
      case 'created':
        this.files.push(data);
        this.saveFiles();
        break;
      case 'updated':
        const fileIndex = this.files.findIndex((f) => f.id === fileId);
        if (fileIndex !== -1) {
          this.files[fileIndex] = { ...this.files[fileIndex], ...data };
          this.saveFiles();
        }
        break;
      case 'deleted':
        this.files = this.files.filter((f) => f.id !== fileId);
        this.saveFiles();
        break;
    }
  }

  handlePermissionChange(change) {
    const { fileId, userId, permissions } = change;

    const permissionIndex = this.permissions.findIndex((p) => p.fileId === fileId && p.userId === userId);
    if (permissionIndex !== -1) {
      this.permissions[permissionIndex].permissions = permissions;
    } else {
      this.permissions.push({
        fileId,
        userId,
        permissions,
        grantedAt: new Date().toISOString(),
        grantedBy: this.getCurrentUser(),
      });
    }

    this.savePermissions();
  }

  async uploadFile(file, folderId = null, metadata = {}) {
    return new Promise((resolve, reject) => {
      // Validar tipo de archivo
      if (!this.allowedTypes.includes(file.type)) {
        reject(new Error('Tipo de archivo no permitido'));
        return;
      }

      // Validar tamaño
      if (file.size > this.maxFileSize) {
        reject(new Error('Archivo demasiado grande'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const fileData = {
          id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type: file.type,
          size: file.size,
          data: event.target.result,
          folderId: folderId,
          metadata: {
            ...metadata,
            uploadedAt: new Date().toISOString(),
            uploadedBy: this.getCurrentUser(),
          },
          permissions: {
            owner: this.getCurrentUser(),
            read: [this.getCurrentUser()],
            write: [this.getCurrentUser()],
            delete: [this.getCurrentUser()],
          },
          version: 1,
          isActive: true,
        };

        this.files.push(fileData);
        this.saveFiles();

        // Crear versión inicial
        this.createVersion(fileData.id, fileData);

        console.log('✅ Archivo subido:', file.name);
        resolve(fileData);
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };

      reader.readAsDataURL(file);
    });
  }

  async handleFileUpload(files) {
    const uploadPromises = files.map((file) => this.uploadFile(file));

    try {
      const uploadedFiles = await Promise.all(uploadPromises);
      console.log('✅ Archivos subidos:', uploadedFiles.length);
      return uploadedFiles;
    } catch (error) {
      console.error('Error subiendo archivos:', error);
      throw error;
    }
  }

  downloadFile(fileId) {
    const file = this.files.find((f) => f.id === fileId);
    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    // Verificar permisos
    if (!this.hasPermission(fileId, 'read')) {
      throw new Error('Sin permisos para descargar este archivo');
    }

    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Registrar descarga
    this.recordDownload(fileId);

    console.log('📥 Archivo descargado:', file.name);
  }

  recordDownload(fileId) {
    const download = {
      fileId,
      downloadedAt: new Date().toISOString(),
      downloadedBy: this.getCurrentUser(),
    };

    this.downloads.push(download);

    // Mantener solo las últimas 100 descargas
    if (this.downloads.length > 100) {
      this.downloads = this.downloads.slice(-100);
    }

    console.log('📊 Descarga registrada:', fileId);
  }

  createFolder(name, parentId = null, metadata = {}) {
    const folder = {
      id: 'folder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name,
      parentId,
      metadata: {
        ...metadata,
        createdAt: new Date().toISOString(),
        createdBy: this.getCurrentUser(),
      },
      permissions: {
        owner: this.getCurrentUser(),
        read: [this.getCurrentUser()],
        write: [this.getCurrentUser()],
        delete: [this.getCurrentUser()],
      },
      isActive: true,
    };

    this.folders.push(folder);
    this.saveFolders();

    console.log('✅ Carpeta creada:', name);
    return folder;
  }

  updateFolder(folderId, updates) {
    const folderIndex = this.folders.findIndex((f) => f.id === folderId);
    if (folderIndex === -1) {
      throw new Error('Carpeta no encontrada');
    }

    this.folders[folderIndex] = {
      ...this.folders[folderIndex],
      ...updates,
    };

    this.saveFolders();

    console.log('✅ Carpeta actualizada:', this.folders[folderIndex].name);
    return this.folders[folderIndex];
  }

  deleteFolder(folderId) {
    const folderIndex = this.folders.findIndex((f) => f.id === folderId);
    if (folderIndex === -1) {
      throw new Error('Carpeta no encontrada');
    }

    const folder = this.folders[folderIndex];

    // Verificar permisos
    if (!this.hasPermission(folderId, 'delete')) {
      throw new Error('Sin permisos para eliminar esta carpeta');
    }

    // Verificar si tiene archivos o subcarpetas
    const hasFiles = this.files.some((f) => f.folderId === folderId);
    const hasSubfolders = this.folders.some((f) => f.parentId === folderId);

    if (hasFiles || hasSubfolders) {
      throw new Error('No se puede eliminar una carpeta que contiene archivos o subcarpetas');
    }

    this.folders.splice(folderIndex, 1);
    this.saveFolders();

    console.log('🗑️ Carpeta eliminada:', folder.name);
    return folder;
  }

  createVersion(fileId, fileData) {
    const version = {
      id: 'version_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      fileId,
      version: fileData.version,
      data: fileData.data,
      metadata: {
        ...fileData.metadata,
        versionedAt: new Date().toISOString(),
        versionedBy: this.getCurrentUser(),
      },
      isActive: true,
    };

    this.versions.push(version);
    this.saveVersions();

    console.log('📝 Versión creada:', fileId, 'v' + fileData.version);
    return version;
  }

  getFileVersions(fileId) {
    return this.versions.filter((v) => v.fileId === fileId && v.isActive);
  }

  restoreVersion(versionId) {
    const version = this.versions.find((v) => v.id === versionId);
    if (!version) {
      throw new Error('Versión no encontrada');
    }

    const fileIndex = this.files.findIndex((f) => f.id === version.fileId);
    if (fileIndex === -1) {
      throw new Error('Archivo no encontrado');
    }

    // Crear nueva versión con los datos restaurados
    const restoredFile = {
      ...this.files[fileIndex],
      data: version.data,
      version: this.files[fileIndex].version + 1,
      metadata: {
        ...this.files[fileIndex].metadata,
        restoredAt: new Date().toISOString(),
        restoredBy: this.getCurrentUser(),
        restoredFrom: versionId,
      },
    };

    this.files[fileIndex] = restoredFile;
    this.saveFiles();

    // Crear versión de la restauración
    this.createVersion(version.fileId, restoredFile);

    console.log('🔄 Versión restaurada:', version.fileId, 'v' + restoredFile.version);
    return restoredFile;
  }

  setPermission(fileId, userId, permissions) {
    const permission = {
      fileId,
      userId,
      permissions,
      grantedAt: new Date().toISOString(),
      grantedBy: this.getCurrentUser(),
    };

    const existingIndex = this.permissions.findIndex((p) => p.fileId === fileId && p.userId === userId);
    if (existingIndex !== -1) {
      this.permissions[existingIndex] = permission;
    } else {
      this.permissions.push(permission);
    }

    this.savePermissions();

    console.log('🔐 Permisos actualizados:', fileId, userId);
    return permission;
  }

  hasPermission(fileId, action) {
    const file = this.files.find((f) => f.id === fileId);
    if (!file) return false;

    const currentUser = this.getCurrentUser();

    // El propietario tiene todos los permisos
    if (file.permissions.owner === currentUser) return true;

    // Verificar permisos específicos
    const permission = this.permissions.find((p) => p.fileId === fileId && p.userId === currentUser);
    if (permission) {
      return permission.permissions.includes(action);
    }

    // Verificar permisos del archivo
    return file.permissions[action]?.includes(currentUser) || false;
  }

  getFiles(filters = {}) {
    let filteredFiles = [...this.files];

    if (filters.folderId) {
      filteredFiles = filteredFiles.filter((f) => f.folderId === filters.folderId);
    }

    if (filters.type) {
      filteredFiles = filteredFiles.filter((f) => f.type === filters.type);
    }

    if (filters.owner) {
      filteredFiles = filteredFiles.filter((f) => f.permissions.owner === filters.owner);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFiles = filteredFiles.filter(
        (f) => f.name.toLowerCase().includes(searchTerm) || f.metadata.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.permission) {
      filteredFiles = filteredFiles.filter((f) => this.hasPermission(f.id, filters.permission));
    }

    return filteredFiles;
  }

  getFolders(filters = {}) {
    let filteredFolders = [...this.folders];

    if (filters.parentId !== undefined) {
      filteredFolders = filteredFolders.filter((f) => f.parentId === filters.parentId);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFolders = filteredFolders.filter((f) => f.name.toLowerCase().includes(searchTerm));
    }

    if (filters.permission) {
      filteredFolders = filteredFolders.filter((f) => this.hasPermission(f.id, filters.permission));
    }

    return filteredFolders;
  }

  getFileStatistics() {
    const totalFiles = this.files.length;
    const totalFolders = this.folders.length;
    const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
    const typeStats = {};
    const ownerStats = {};

    this.files.forEach((file) => {
      // Estadísticas por tipo
      const type = file.type.split('/')[0];
      typeStats[type] = (typeStats[type] || 0) + 1;

      // Estadísticas por propietario
      const owner = file.permissions.owner;
      ownerStats[owner] = (ownerStats[owner] || 0) + 1;
    });

    return {
      totalFiles,
      totalFolders,
      totalSize,
      typeStats,
      ownerStats,
    };
  }

  searchFiles(query) {
    const searchTerm = query.toLowerCase();

    const fileResults = this.files.filter(
      (file) =>
        file.name.toLowerCase().includes(searchTerm) ||
        file.metadata.description?.toLowerCase().includes(searchTerm) ||
        file.type.toLowerCase().includes(searchTerm)
    );

    const folderResults = this.folders.filter((folder) => folder.name.toLowerCase().includes(searchTerm));

    return {
      files: fileResults,
      folders: folderResults,
      total: fileResults.length + folderResults.length,
    };
  }

  exportFiles(fileIds) {
    const filesToExport = this.files.filter((f) => fileIds.includes(f.id));

    const data = {
      files: filesToExport,
      exportDate: new Date().toISOString(),
      exportedBy: this.getCurrentUser(),
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `axyra-files-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Archivos exportados:', filesToExport.length);
  }

  importFiles(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (data.files) {
            data.files.forEach((fileData) => {
              fileData.id = 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
              fileData.metadata.importedAt = new Date().toISOString();
              fileData.metadata.importedBy = this.getCurrentUser();
              this.files.push(fileData);
            });

            this.saveFiles();
            console.log('✅ Archivos importados:', data.files.length);
            resolve(data.files);
          } else {
            reject(new Error('Archivo de importación inválido'));
          }
        } catch (error) {
          console.error('Error importando archivos:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(new Error('Error leyendo archivo'));
      };

      reader.readAsText(file);
    });
  }

  showFileManager() {
    const manager = document.createElement('div');
    manager.id = 'file-manager';
    manager.innerHTML = `
      <div class="file-manager-overlay">
        <div class="file-manager-container">
          <div class="file-manager-header">
            <h3>📁 Gestor de Archivos</h3>
            <div class="file-manager-actions">
              <button class="btn btn-primary" onclick="axyraFileManagementSystem.showUploadDialog()">Subir</button>
              <button class="btn btn-secondary" onclick="axyraFileManagementSystem.showCreateFolderDialog()">Nueva Carpeta</button>
              <button class="btn btn-close" onclick="document.getElementById('file-manager').remove()">×</button>
            </div>
          </div>
          <div class="file-manager-body">
            <div class="file-manager-sidebar">
              <div class="folder-tree" id="folder-tree">
                ${this.renderFolderTree()}
              </div>
            </div>
            <div class="file-manager-content">
              <div class="file-manager-toolbar">
                <input type="text" id="file-search" placeholder="Buscar archivos..." onkeyup="axyraFileManagementSystem.searchFiles(this.value)">
                <select id="file-filter" onchange="axyraFileManagementSystem.filterFiles(this.value)">
                  <option value="">Todos los tipos</option>
                  <option value="image">Imágenes</option>
                  <option value="application">Documentos</option>
                  <option value="text">Texto</option>
                </select>
              </div>
              <div class="file-manager-grid" id="file-grid">
                ${this.renderFileGrid()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    manager.style.cssText = `
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

    document.body.appendChild(manager);
  }

  renderFolderTree() {
    const rootFolders = this.folders.filter((f) => !f.parentId);

    return rootFolders.map((folder) => this.renderFolderNode(folder)).join('');
  }

  renderFolderNode(folder) {
    const subfolders = this.folders.filter((f) => f.parentId === folder.id);

    return `
      <div class="folder-node">
        <div class="folder-item" onclick="axyraFileManagementSystem.selectFolder('${folder.id}')">
          <span class="folder-icon">📁</span>
          <span class="folder-name">${folder.name}</span>
        </div>
        ${
          subfolders.length > 0
            ? `
          <div class="subfolders">
            ${subfolders.map((subfolder) => this.renderFolderNode(subfolder)).join('')}
          </div>
        `
            : ''
        }
      </div>
    `;
  }

  renderFileGrid() {
    const files = this.getFiles();

    return files
      .map(
        (file) => `
      <div class="file-item" data-file-id="${file.id}">
        <div class="file-icon">${this.getFileIcon(file.type)}</div>
        <div class="file-name">${file.name}</div>
        <div class="file-size">${this.formatFileSize(file.size)}</div>
        <div class="file-actions">
          <button onclick="axyraFileManagementSystem.downloadFile('${file.id}')" title="Descargar">⬇️</button>
          <button onclick="axyraFileManagementSystem.showFileInfo('${file.id}')" title="Información">ℹ️</button>
          <button onclick="axyraFileManagementSystem.deleteFile('${file.id}')" title="Eliminar">🗑️</button>
        </div>
      </div>
    `
      )
      .join('');
  }

  getFileIcon(type) {
    if (type.startsWith('image/')) return '🖼️';
    if (type.startsWith('video/')) return '🎥';
    if (type.startsWith('audio/')) return '🎵';
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    if (type.includes('excel')) return '📊';
    if (type.includes('zip')) return '📦';
    return '📄';
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  selectFolder(folderId) {
    // Implementar lógica de selección de carpeta
    console.log('📁 Carpeta seleccionada:', folderId);
  }

  filterFiles(type) {
    // Implementar lógica de filtrado
    console.log('🔍 Filtrando por tipo:', type);
  }

  showUploadDialog() {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      this.handleFileUpload(Array.from(e.target.files));
    };
    input.click();
  }

  showCreateFolderDialog() {
    const name = prompt('Nombre de la carpeta:');
    if (name) {
      this.createFolder(name);
    }
  }

  showFileInfo(fileId) {
    const file = this.files.find((f) => f.id === fileId);
    if (file) {
      alert(
        `Nombre: ${file.name}\nTipo: ${file.type}\nTamaño: ${this.formatFileSize(file.size)}\nSubido: ${new Date(
          file.metadata.uploadedAt
        ).toLocaleString()}`
      );
    }
  }

  deleteFile(fileId) {
    if (confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      const fileIndex = this.files.findIndex((f) => f.id === fileId);
      if (fileIndex !== -1) {
        this.files.splice(fileIndex, 1);
        this.saveFiles();
        console.log('🗑️ Archivo eliminado:', fileId);
      }
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

// Inicializar sistema de archivos
let axyraFileManagementSystem;
document.addEventListener('DOMContentLoaded', () => {
  axyraFileManagementSystem = new AxyraFileManagementSystem();
  window.axyraFileManagementSystem = axyraFileManagementSystem;
});

// Exportar para uso global
window.AxyraFileManagementSystem = AxyraFileManagementSystem;
