/**
 * AXYRA - Sistema de Gestión de Archivos y Documentos
 * Maneja archivos, documentos y almacenamiento
 */

class AxyraFileManagement {
  constructor() {
    this.files = [];
    this.folders = [];
    this.categories = [];
    this.versions = [];
    this.shares = [];

    this.maxFileSize = 10 * 1024 * 1024; // 10MB
    this.allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip',
      'application/x-rar-compressed',
    ];

    this.init();
  }

  init() {
    console.log('📁 Inicializando sistema de gestión de archivos...');
    this.loadData();
    this.setupDefaultCategories();
    this.setupFileHandlers();
    this.setupDragAndDrop();
  }

  loadData() {
    try {
      this.files = JSON.parse(localStorage.getItem('axyra_files') || '[]');
      this.folders = JSON.parse(localStorage.getItem('axyra_folders') || '[]');
      this.categories = JSON.parse(localStorage.getItem('axyra_file_categories') || '[]');
      this.versions = JSON.parse(localStorage.getItem('axyra_file_versions') || '[]');
      this.shares = JSON.parse(localStorage.getItem('axyra_file_shares') || '[]');
    } catch (error) {
      console.error('Error cargando datos de archivos:', error);
    }
  }

  saveData() {
    try {
      localStorage.setItem('axyra_files', JSON.stringify(this.files));
      localStorage.setItem('axyra_folders', JSON.stringify(this.folders));
      localStorage.setItem('axyra_file_categories', JSON.stringify(this.categories));
      localStorage.setItem('axyra_file_versions', JSON.stringify(this.versions));
      localStorage.setItem('axyra_file_shares', JSON.stringify(this.shares));
    } catch (error) {
      console.error('Error guardando datos de archivos:', error);
    }
  }

  setupDefaultCategories() {
    if (this.categories.length === 0) {
      this.categories = [
        { id: 'documents', name: 'Documentos', icon: '📄', color: '#3498db' },
        { id: 'images', name: 'Imágenes', icon: '🖼️', color: '#e74c3c' },
        { id: 'spreadsheets', name: 'Hojas de Cálculo', icon: '📊', color: '#27ae60' },
        { id: 'presentations', name: 'Presentaciones', icon: '📽️', color: '#f39c12' },
        { id: 'archives', name: 'Archivos Comprimidos', icon: '📦', color: '#9b59b6' },
        { id: 'other', name: 'Otros', icon: '📁', color: '#95a5a6' },
      ];
      this.saveData();
    }
  }

  setupFileHandlers() {
    // Configurar manejadores de archivos
    this.fileHandlers = {
      'image/jpeg': this.handleImageFile.bind(this),
      'image/png': this.handleImageFile.bind(this),
      'image/gif': this.handleImageFile.bind(this),
      'image/webp': this.handleImageFile.bind(this),
      'application/pdf': this.handlePDFFile.bind(this),
      'text/plain': this.handleTextFile.bind(this),
      'text/csv': this.handleCSVFile.bind(this),
      'application/vnd.ms-excel': this.handleExcelFile.bind(this),
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': this.handleExcelFile.bind(this),
      'application/msword': this.handleWordFile.bind(this),
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': this.handleWordFile.bind(this),
      'application/zip': this.handleArchiveFile.bind(this),
      'application/x-rar-compressed': this.handleArchiveFile.bind(this),
    };
  }

  setupDragAndDrop() {
    // Configurar drag and drop
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    document.addEventListener('drop', (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      this.uploadFiles(files);
    });
  }

  createFolder(folderData) {
    const folder = {
      id: 'folder_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      name: folderData.name,
      description: folderData.description || '',
      parentId: folderData.parentId || null,
      category: folderData.category || 'other',
      color: folderData.color || '#3498db',
      icon: folderData.icon || '📁',
      permissions: folderData.permissions || ['view', 'edit'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
      size: 0,
      fileCount: 0,
    };

    this.folders.push(folder);
    this.saveData();

    console.log('✅ Carpeta creada:', folder.name);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Carpeta creada: ${folder.name}`);
    }

    return folder;
  }

  uploadFile(file, options = {}) {
    return new Promise((resolve, reject) => {
      // Validar archivo
      if (!this.validateFile(file)) {
        reject(new Error('Archivo no válido'));
        return;
      }

      const fileData = {
        id: 'file_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        name: file.name,
        originalName: file.name,
        size: file.size,
        type: file.type,
        category: this.getFileCategory(file.type),
        folderId: options.folderId || null,
        description: options.description || '',
        tags: options.tags || [],
        permissions: options.permissions || ['view'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        uploadedBy: this.getCurrentUser(),
        version: 1,
        url: null,
        thumbnail: null,
        metadata: {},
      };

      // Procesar archivo
      this.processFile(file, fileData)
        .then((processedFile) => {
          this.files.push(processedFile);
          this.updateFolderStats(processedFile.folderId);
          this.saveData();

          console.log('✅ Archivo subido:', processedFile.name);

          if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.showSuccess(`Archivo subido: ${processedFile.name}`);
          }

          resolve(processedFile);
        })
        .catch((error) => {
          console.error('Error procesando archivo:', error);
          reject(error);
        });
    });
  }

  uploadFiles(files, options = {}) {
    const uploadPromises = Array.from(files).map((file) => this.uploadFile(file, options));

    return Promise.all(uploadPromises);
  }

  validateFile(file) {
    // Validar tamaño
    if (file.size > this.maxFileSize) {
      throw new Error(`El archivo es demasiado grande. Tamaño máximo: ${this.formatBytes(this.maxFileSize)}`);
    }

    // Validar tipo
    if (!this.allowedTypes.includes(file.type)) {
      throw new Error(`Tipo de archivo no permitido: ${file.type}`);
    }

    return true;
  }

  getFileCategory(fileType) {
    const categoryMap = {
      'image/jpeg': 'images',
      'image/png': 'images',
      'image/gif': 'images',
      'image/webp': 'images',
      'application/pdf': 'documents',
      'text/plain': 'documents',
      'text/csv': 'spreadsheets',
      'application/vnd.ms-excel': 'spreadsheets',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'spreadsheets',
      'application/msword': 'documents',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'documents',
      'application/vnd.ms-powerpoint': 'presentations',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'presentations',
      'application/zip': 'archives',
      'application/x-rar-compressed': 'archives',
    };

    return categoryMap[fileType] || 'other';
  }

  async processFile(file, fileData) {
    const handler = this.fileHandlers[file.type];
    if (handler) {
      return await handler(file, fileData);
    } else {
      return await this.handleGenericFile(file, fileData);
    }
  }

  async handleImageFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;

        // Crear thumbnail
        this.createThumbnail(file, 150, 150).then((thumbnail) => {
          fileData.thumbnail = thumbnail;
          fileData.metadata = {
            width: 0,
            height: 0,
            format: file.type,
          };
          resolve(fileData);
        });
      };
      reader.readAsDataURL(file);
    });
  }

  async handlePDFFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        fileData.metadata = {
          pages: 0,
          format: 'PDF',
        };
        resolve(fileData);
      };
      reader.readAsDataURL(file);
    });
  }

  async handleTextFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        fileData.metadata = {
          content: e.target.result,
          lines: e.target.result.split('\n').length,
          characters: e.target.result.length,
        };
        resolve(fileData);
      };
      reader.readAsText(file);
    });
  }

  async handleCSVFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        const lines = e.target.result.split('\n');
        fileData.metadata = {
          rows: lines.length,
          columns: lines[0] ? lines[0].split(',').length : 0,
          content: e.target.result,
        };
        resolve(fileData);
      };
      reader.readAsText(file);
    });
  }

  async handleExcelFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        fileData.metadata = {
          format: 'Excel',
          sheets: 1,
        };
        resolve(fileData);
      };
      reader.readAsDataURL(file);
    });
  }

  async handleWordFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        fileData.metadata = {
          format: 'Word',
          pages: 0,
        };
        resolve(fileData);
      };
      reader.readAsDataURL(file);
    });
  }

  async handleArchiveFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        fileData.metadata = {
          format: file.type.includes('zip') ? 'ZIP' : 'RAR',
          compressed: true,
        };
        resolve(fileData);
      };
      reader.readAsDataURL(file);
    });
  }

  async handleGenericFile(file, fileData) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        fileData.url = e.target.result;
        fileData.metadata = {
          format: file.type,
        };
        resolve(fileData);
      };
      reader.readAsDataURL(file);
    });
  }

  createThumbnail(file, maxWidth, maxHeight) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.src = URL.createObjectURL(file);
    });
  }

  updateFile(fileId, updates) {
    const fileIndex = this.files.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) {
      throw new Error('Archivo no encontrado');
    }

    this.files[fileIndex] = {
      ...this.files[fileIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.saveData();

    console.log('✅ Archivo actualizado:', this.files[fileIndex].name);
    return this.files[fileIndex];
  }

  deleteFile(fileId) {
    const fileIndex = this.files.findIndex((f) => f.id === fileId);
    if (fileIndex === -1) {
      throw new Error('Archivo no encontrado');
    }

    const file = this.files[fileIndex];
    this.files.splice(fileIndex, 1);
    this.updateFolderStats(file.folderId);
    this.saveData();

    console.log('🗑️ Archivo eliminado:', file.name);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showWarning(`Archivo eliminado: ${file.name}`);
    }

    return file;
  }

  updateFolderStats(folderId) {
    if (!folderId) return;

    const folder = this.folders.find((f) => f.id === folderId);
    if (!folder) return;

    const folderFiles = this.files.filter((f) => f.folderId === folderId);
    folder.fileCount = folderFiles.length;
    folder.size = folderFiles.reduce((total, file) => total + file.size, 0);
    folder.updatedAt = new Date().toISOString();

    this.saveData();
  }

  getFiles(filters = {}) {
    let filteredFiles = [...this.files];

    if (filters.folderId) {
      filteredFiles = filteredFiles.filter((f) => f.folderId === filters.folderId);
    }

    if (filters.category) {
      filteredFiles = filteredFiles.filter((f) => f.category === filters.category);
    }

    if (filters.type) {
      filteredFiles = filteredFiles.filter((f) => f.type === filters.type);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFiles = filteredFiles.filter(
        (f) =>
          f.name.toLowerCase().includes(searchTerm) ||
          f.description.toLowerCase().includes(searchTerm) ||
          f.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    if (filters.uploadedBy) {
      filteredFiles = filteredFiles.filter((f) => f.uploadedBy === filters.uploadedBy);
    }

    if (filters.dateFrom) {
      filteredFiles = filteredFiles.filter((f) => new Date(f.createdAt) >= new Date(filters.dateFrom));
    }

    if (filters.dateTo) {
      filteredFiles = filteredFiles.filter((f) => new Date(f.createdAt) <= new Date(filters.dateTo));
    }

    return filteredFiles;
  }

  getFolders(filters = {}) {
    let filteredFolders = [...this.folders];

    if (filters.parentId !== undefined) {
      filteredFolders = filteredFolders.filter((f) => f.parentId === filters.parentId);
    }

    if (filters.category) {
      filteredFolders = filteredFolders.filter((f) => f.category === filters.category);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredFolders = filteredFolders.filter(
        (f) => f.name.toLowerCase().includes(searchTerm) || f.description.toLowerCase().includes(searchTerm)
      );
    }

    return filteredFolders;
  }

  getFileById(fileId) {
    return this.files.find((f) => f.id === fileId);
  }

  getFolderById(folderId) {
    return this.folders.find((f) => f.id === folderId);
  }

  getFileVersions(fileId) {
    return this.versions.filter((v) => v.fileId === fileId);
  }

  createFileVersion(fileId, file, description = '') {
    const fileData = this.getFileById(fileId);
    if (!fileData) {
      throw new Error('Archivo no encontrado');
    }

    const version = {
      id: 'version_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      fileId: fileId,
      version: fileData.version + 1,
      description: description,
      size: file.size,
      type: file.type,
      url: null,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
    };

    // Procesar archivo de versión
    this.processFile(file, version).then((processedVersion) => {
      this.versions.push(processedVersion);
      this.updateFile(fileId, { version: processedVersion.version });
      this.saveData();

      console.log('✅ Versión creada para archivo:', fileData.name);
    });

    return version;
  }

  shareFile(fileId, shareData) {
    const file = this.getFileById(fileId);
    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    const share = {
      id: 'share_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      fileId: fileId,
      fileName: file.name,
      sharedWith: shareData.sharedWith,
      permissions: shareData.permissions || ['view'],
      expiresAt: shareData.expiresAt || null,
      password: shareData.password || null,
      createdAt: new Date().toISOString(),
      createdBy: this.getCurrentUser(),
      accessCount: 0,
      lastAccessed: null,
    };

    this.shares.push(share);
    this.saveData();

    console.log('✅ Archivo compartido:', file.name);

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Archivo compartido: ${file.name}`);
    }

    return share;
  }

  getSharedFiles(userId) {
    return this.shares.filter((s) => s.sharedWith === userId);
  }

  downloadFile(fileId) {
    const file = this.getFileById(fileId);
    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log('📥 Archivo descargado:', file.name);
  }

  previewFile(fileId) {
    const file = this.getFileById(fileId);
    if (!file) {
      throw new Error('Archivo no encontrado');
    }

    const previewWindow = window.open('', '_blank');
    previewWindow.document.write(`
      <html>
        <head>
          <title>Vista previa - ${file.name}</title>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            img { max-width: 100%; height: auto; }
            iframe { width: 100%; height: 80vh; border: none; }
          </style>
        </head>
        <body>
          <h2>${file.name}</h2>
          ${this.getPreviewContent(file)}
        </body>
      </html>
    `);
  }

  getPreviewContent(file) {
    if (file.type.startsWith('image/')) {
      return `<img src="${file.url}" alt="${file.name}">`;
    } else if (file.type === 'application/pdf') {
      return `<iframe src="${file.url}"></iframe>`;
    } else if (file.type === 'text/plain') {
      return `<pre>${file.metadata.content}</pre>`;
    } else {
      return `<p>Vista previa no disponible para este tipo de archivo.</p>`;
    }
  }

  getFileStatistics() {
    const totalFiles = this.files.length;
    const totalSize = this.files.reduce((sum, file) => sum + file.size, 0);
    const categoryStats = {};
    const typeStats = {};

    this.files.forEach((file) => {
      categoryStats[file.category] = (categoryStats[file.category] || 0) + 1;
      typeStats[file.type] = (typeStats[file.type] || 0) + 1;
    });

    return {
      totalFiles: totalFiles,
      totalSize: totalSize,
      averageSize: totalFiles > 0 ? totalSize / totalFiles : 0,
      categoryStats: categoryStats,
      typeStats: typeStats,
      totalFolders: this.folders.length,
      totalShares: this.shares.length,
    };
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getCurrentUser() {
    if (window.obtenerUsuarioActual) {
      const user = window.obtenerUsuarioActual();
      return user ? user.id : 'anonymous';
    }
    return 'anonymous';
  }

  exportFiles(format = 'json') {
    const data = {
      files: this.files,
      folders: this.folders,
      categories: this.categories,
      exportDate: new Date().toISOString(),
    };

    let content;
    let filename;
    let mimeType;

    switch (format) {
      case 'csv':
        content = this.convertFilesToCSV();
        filename = 'axyra-files.csv';
        mimeType = 'text/csv';
        break;
      case 'json':
      default:
        content = JSON.stringify(data, null, 2);
        filename = 'axyra-files.json';
        mimeType = 'application/json';
        break;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    console.log('📊 Archivos exportados');

    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess('Archivos exportados');
    }
  }

  convertFilesToCSV() {
    const rows = [];

    // Encabezados
    rows.push(['ID', 'Nombre', 'Tipo', 'Tamaño', 'Categoría', 'Carpeta', 'Subido por', 'Fecha']);

    // Datos
    this.files.forEach((file) => {
      const folder = file.folderId ? this.getFolderById(file.folderId) : null;
      rows.push([
        file.id,
        file.name,
        file.type,
        this.formatBytes(file.size),
        file.category,
        folder ? folder.name : 'Sin carpeta',
        file.uploadedBy,
        new Date(file.createdAt).toLocaleDateString(),
      ]);
    });

    return rows.map((row) => row.join(',')).join('\n');
  }

  importFiles(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);

          if (data.files) {
            this.files = [...this.files, ...data.files];
          }

          if (data.folders) {
            this.folders = [...this.folders, ...data.folders];
          }

          if (data.categories) {
            this.categories = [...this.categories, ...data.categories];
          }

          this.saveData();

          console.log('✅ Archivos importados exitosamente');

          if (window.axyraNotificationSystem) {
            window.axyraNotificationSystem.showSuccess('Archivos importados exitosamente');
          }

          resolve();
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
}

// Inicializar sistema de gestión de archivos
let axyraFileManagement;
document.addEventListener('DOMContentLoaded', () => {
  axyraFileManagement = new AxyraFileManagement();
  window.axyraFileManagement = axyraFileManagement;
});

// Exportar para uso global
window.AxyraFileManagement = AxyraFileManagement;
