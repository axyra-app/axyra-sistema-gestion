/**
 * AXYRA - Sistema de Documentación Automática
 * Genera documentación completa del sistema automáticamente
 */

class AxyraAutoDocumentation {
  constructor() {
    this.documentation = {
      modules: {},
      apis: {},
      configs: {},
      styles: {},
      tests: {}
    };
    
    this.init();
  }

  init() {
    console.log('📚 Inicializando sistema de documentación automática...');
    this.scanSystem();
  }

  scanSystem() {
    this.scanModules();
    this.scanAPIs();
    this.scanConfigurations();
    this.scanStyles();
    this.scanTests();
  }

  scanModules() {
    const modules = [
      'empleados', 'horas', 'nomina', 'inventario', 'cuadre_caja',
      'dashboard', 'configuracion', 'reportes', 'gestion_personal'
    ];

    modules.forEach(module => {
      this.documentation.modules[module] = {
        name: this.getModuleDisplayName(module),
        description: this.getModuleDescription(module),
        files: this.getModuleFiles(module),
        features: this.getModuleFeatures(module),
        dependencies: this.getModuleDependencies(module)
      };
    });
  }

  getModuleDisplayName(module) {
    const names = {
      'empleados': 'Gestión de Empleados',
      'horas': 'Gestión de Horas',
      'nomina': 'Sistema de Nómina',
      'inventario': 'Control de Inventario',
      'cuadre_caja': 'Cuadre de Caja',
      'dashboard': 'Dashboard Principal',
      'configuracion': 'Configuración del Sistema',
      'reportes': 'Sistema de Reportes',
      'gestion_personal': 'Gestión de Personal Unificada'
    };
    return names[module] || module;
  }

  getModuleDescription(module) {
    const descriptions = {
      'empleados': 'Módulo para la gestión completa de empleados, incluyendo CRUD, roles y permisos',
      'horas': 'Sistema de registro y gestión de horas trabajadas y extras',
      'nomina': 'Sistema avanzado de nómina con cálculos automáticos y reportes',
      'inventario': 'Control de inventario con gestión de productos y categorías',
      'cuadre_caja': 'Sistema de cuadre de caja y reconciliación financiera',
      'dashboard': 'Dashboard principal con métricas y widgets personalizables',
      'configuracion': 'Configuración avanzada del sistema y usuarios',
      'reportes': 'Sistema de reportes avanzados con exportación múltiple',
      'gestion_personal': 'Módulo unificado para gestión de personal, horas y nómina'
    };
    return descriptions[module] || 'Módulo del sistema AXYRA';
  }

  getModuleFiles(module) {
    const basePath = `frontend/modulos/${module}/`;
    const files = [];
    
    // Archivos comunes
    const commonFiles = ['html', 'js', 'css'];
    commonFiles.forEach(ext => {
      files.push(`${basePath}${module}.${ext}`);
    });
    
    // Archivos específicos por módulo
    const specificFiles = {
      'nomina': ['nomina-avanzada.js', 'nomina-avanzada-styles.css'],
      'dashboard': ['dashboard-avanzado.js', 'dashboard-avanzado-styles.css'],
      'configuracion': ['configuracion-avanzada.js', 'configuracion-avanzada-styles.css'],
      'reportes': ['reportes-avanzados.js', 'reportes-avanzados-styles.css', 'reportes-avanzados.html'],
      'gestion_personal': ['gestion_personal.js', 'gestion_personal-styles.css', 'datos-ejemplo.js']
    };
    
    if (specificFiles[module]) {
      specificFiles[module].forEach(file => {
        files.push(`${basePath}${file}`);
      });
    }
    
    return files;
  }

  getModuleFeatures(module) {
    const features = {
      'empleados': [
        'CRUD completo de empleados',
        'Gestión de roles y permisos',
        'Validación de datos',
        'Exportación a Excel/PDF',
        'Búsqueda y filtros avanzados'
      ],
      'horas': [
        'Registro de horas trabajadas',
        'Cálculo automático de horas extras',
        'Gestión por áreas de trabajo',
        'Validación de horarios',
        'Reportes detallados'
      ],
      'nomina': [
        'Cálculo automático de salarios',
        'Gestión de deducciones',
        'Cálculo de horas extras',
        'Generación de comprobantes',
        'Exportación múltiple'
      ],
      'inventario': [
        'Gestión de productos',
        'Control de stock',
        'Categorización',
        'Alertas de stock bajo',
        'Reportes de inventario'
      ],
      'cuadre_caja': [
        'Reconciliación diaria',
        'Gestión de facturas',
        'Cálculo de diferencias',
        'Reportes financieros',
        'Exportación de datos'
      ],
      'dashboard': [
        'Métricas en tiempo real',
        'Widgets personalizables',
        'Gráficos interactivos',
        'Alertas del sistema',
        'Vista ejecutiva'
      ],
      'configuracion': [
        'Configuración de empresa',
        'Gestión de usuarios',
        'Configuración de seguridad',
        'Temas personalizables',
        'Sistema de backup'
      ],
      'reportes': [
        'Reportes ejecutivos',
        'Múltiples formatos de exportación',
        'Filtros avanzados',
        'Gráficos interactivos',
        'Historial de reportes'
      ],
      'gestion_personal': [
        'Vista unificada',
        'Gestión completa de personal',
        'Integración de módulos',
        'Flujo de trabajo optimizado',
        'Reportes consolidados'
      ]
    };
    
    return features[module] || [];
  }

  getModuleDependencies(module) {
    const dependencies = {
      'empleados': ['firebase-config.js', 'firebase-sync-manager.js', 'roles-config.js'],
      'horas': ['firebase-config.js', 'firebase-sync-manager.js', 'colombian-labor-law.js'],
      'nomina': ['firebase-config.js', 'firebase-sync-manager.js', 'colombian-labor-law.js', 'comprobante-pdf-generator.js'],
      'inventario': ['firebase-config.js', 'firebase-sync-manager.js', 'advanced-validation-system.js'],
      'cuadre_caja': ['firebase-config.js', 'firebase-sync-manager.js', 'chart.js'],
      'dashboard': ['firebase-config.js', 'firebase-sync-manager.js', 'chart.js'],
      'configuracion': ['firebase-config.js', 'firebase-sync-manager.js', 'roles-config.js', '2fa-system-complete.js'],
      'reportes': ['firebase-config.js', 'firebase-sync-manager.js', 'chart.js', 'jspdf', 'xlsx'],
      'gestion_personal': ['firebase-config.js', 'firebase-sync-manager.js', 'colombian-labor-law.js', 'comprobante-pdf-generator.js']
    };
    
    return dependencies[module] || [];
  }

  scanAPIs() {
    this.documentation.apis = {
      firebase: {
        name: 'Firebase Integration',
        description: 'Integración completa con Firebase para autenticación y sincronización',
        files: ['firebase-config.js', 'firebase-sync-manager.js'],
        features: [
          'Autenticación de usuarios',
          'Sincronización de datos',
          'Gestión de timestamps',
          'Fallback a localStorage'
        ]
      },
      notifications: {
        name: 'Sistema de Notificaciones',
        description: 'Sistema robusto de notificaciones push y del sistema',
        files: ['notifications-system.js', 'push-notifications-system.js', 'sw.js'],
        features: [
          'Notificaciones push reales',
          'Notificaciones del sistema',
          'Service Workers',
          'Gestión de permisos'
        ]
      },
      validation: {
        name: 'Sistema de Validación',
        description: 'Sistema avanzado de validación de formularios y datos',
        files: ['advanced-validation-system.js'],
        features: [
          'Validaciones personalizadas',
          'Validación de cédula colombiana',
          'Validación de códigos únicos',
          'Validación de rangos de fechas'
        ]
      },
      audit: {
        name: 'Sistema de Auditoría',
        description: 'Sistema completo de auditoría y logging',
        files: ['audit-system-complete.js'],
        features: [
          'Logging de eventos',
          'Trazabilidad de cambios',
          'Reportes de auditoría',
          'Filtros avanzados'
        ]
      },
      backup: {
        name: 'Sistema de Backup',
        description: 'Sistema avanzado de backup y restauración',
        files: ['backup-system-advanced.js'],
        features: [
          'Backup automático',
          'Múltiples formatos',
          'Programación de backups',
          'Restauración de datos'
        ]
      }
    };
  }

  scanConfigurations() {
    this.documentation.configs = {
      roles: {
        name: 'Configuración de Roles',
        file: 'roles-config.js',
        description: 'Sistema de roles y permisos del sistema',
        roles: ['ADMIN', 'GERENTE', 'SUPERVISOR', 'EMPLEADO', 'CONTADOR']
      },
      workAreas: {
        name: 'Configuración de Áreas de Trabajo',
        file: 'work-areas-config.js',
        description: 'Gestión de áreas de trabajo personalizables'
      },
      company: {
        name: 'Configuración de Empresa',
        file: 'config.js',
        description: 'Configuración general de la empresa y sistema'
      }
    };
  }

  scanStyles() {
    this.documentation.styles = {
      main: {
        name: 'Estilos Principales',
        file: 'axyra-styles.css',
        description: 'Estilos base del sistema AXYRA'
      },
      modules: this.getModuleStyles()
    };
  }

  getModuleStyles() {
    const modules = ['nomina', 'dashboard', 'configuracion', 'reportes', 'gestion_personal'];
    const styles = {};
    
    modules.forEach(module => {
      styles[module] = {
        file: `frontend/modulos/${module}/${module}-avanzado-styles.css`,
        description: `Estilos específicos para el módulo ${module}`
      };
    });
    
    return styles;
  }

  scanTests() {
    this.documentation.tests = {
      integration: {
        name: 'Tests de Integración',
        file: 'integration-tests.js',
        description: 'Sistema completo de pruebas de integración',
        features: [
          'Tests de módulos',
          'Tests de autenticación',
          'Tests de configuración',
          'Tests de rendimiento',
          'Reportes automáticos'
        ]
      }
    };
  }

  generateMarkdownDocumentation() {
    let markdown = '# AXYRA - Sistema de Gestión Empresarial\n\n';
    markdown += `*Documentación generada automáticamente el ${new Date().toLocaleString()}*\n\n`;
    
    // Tabla de contenidos
    markdown += '## Tabla de Contenidos\n\n';
    markdown += '- [Módulos del Sistema](#módulos-del-sistema)\n';
    markdown += '- [APIs y Servicios](#apis-y-servicios)\n';
    markdown += '- [Configuraciones](#configuraciones)\n';
    markdown += '- [Estilos](#estilos)\n';
    markdown += '- [Tests](#tests)\n';
    markdown += '- [Instalación y Uso](#instalación-y-uso)\n\n';
    
    // Módulos del sistema
    markdown += '## Módulos del Sistema\n\n';
    Object.entries(this.documentation.modules).forEach(([key, module]) => {
      markdown += `### ${module.name}\n\n`;
      markdown += `${module.description}\n\n`;
      
      markdown += '**Archivos:**\n';
      module.files.forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
      markdown += '\n';
      
      markdown += '**Características:**\n';
      module.features.forEach(feature => {
        markdown += `- ${feature}\n`;
      });
      markdown += '\n';
      
      if (module.dependencies.length > 0) {
        markdown += '**Dependencias:**\n';
        module.dependencies.forEach(dep => {
          markdown += `- \`${dep}\`\n`;
        });
        markdown += '\n';
      }
    });
    
    // APIs y servicios
    markdown += '## APIs y Servicios\n\n';
    Object.entries(this.documentation.apis).forEach(([key, api]) => {
      markdown += `### ${api.name}\n\n`;
      markdown += `${api.description}\n\n`;
      
      markdown += '**Archivos:**\n';
      api.files.forEach(file => {
        markdown += `- \`${file}\`\n`;
      });
      markdown += '\n';
      
      markdown += '**Características:**\n';
      api.features.forEach(feature => {
        markdown += `- ${feature}\n`;
      });
      markdown += '\n';
    });
    
    // Configuraciones
    markdown += '## Configuraciones\n\n';
    Object.entries(this.documentation.configs).forEach(([key, config]) => {
      markdown += `### ${config.name}\n\n`;
      markdown += `**Archivo:** \`${config.file}\`\n\n`;
      markdown += `${config.description}\n\n`;
      
      if (config.roles) {
        markdown += '**Roles disponibles:**\n';
        config.roles.forEach(role => {
          markdown += `- ${role}\n`;
        });
        markdown += '\n';
      }
    });
    
    // Estilos
    markdown += '## Estilos\n\n';
    markdown += `### ${this.documentation.styles.main.name}\n\n`;
    markdown += `**Archivo:** \`${this.documentation.styles.main.file}\`\n\n`;
    markdown += `${this.documentation.styles.main.description}\n\n`;
    
    markdown += '### Estilos de Módulos\n\n';
    Object.entries(this.documentation.styles.modules).forEach(([key, style]) => {
      markdown += `- **${key}:** \`${style.file}\` - ${style.description}\n`;
    });
    markdown += '\n';
    
    // Tests
    markdown += '## Tests\n\n';
    Object.entries(this.documentation.tests).forEach(([key, test]) => {
      markdown += `### ${test.name}\n\n`;
      markdown += `**Archivo:** \`${test.file}\`\n\n`;
      markdown += `${test.description}\n\n`;
      
      markdown += '**Características:**\n';
      test.features.forEach(feature => {
        markdown += `- ${feature}\n`;
      });
      markdown += '\n';
    });
    
    // Instalación y uso
    markdown += '## Instalación y Uso\n\n';
    markdown += '### Requisitos\n\n';
    markdown += '- Navegador web moderno\n';
    markdown += '- Conexión a internet (para Firebase)\n';
    markdown += '- JavaScript habilitado\n\n';
    
    markdown += '### Instalación\n\n';
    markdown += '1. Clonar el repositorio\n';
    markdown += '2. Configurar Firebase (opcional)\n';
    markdown += '3. Abrir `index.html` en el navegador\n\n';
    
    markdown += '### Configuración Inicial\n\n';
    markdown += '1. Acceder al módulo de Configuración\n';
    markdown += '2. Configurar datos de la empresa\n';
    markdown += '3. Crear usuarios y roles\n';
    markdown += '4. Configurar áreas de trabajo\n\n';
    
    markdown += '### Uso de Tests\n\n';
    markdown += '```javascript\n';
    markdown += '// Ejecutar todos los tests\n';
    markdown += 'window.axyraIntegrationTests.runAllTests();\n\n';
    markdown += '// Ver último reporte\n';
    markdown += 'const report = window.axyraIntegrationTests.getLastReport();\n';
    markdown += 'console.log(report);\n';
    markdown += '```\n\n';
    
    markdown += '---\n\n';
    markdown += '*Esta documentación se genera automáticamente. Para actualizarla, ejecute el sistema de documentación.*\n';
    
    return markdown;
  }

  generateHTMLDocumentation() {
    const markdown = this.generateMarkdownDocumentation();
    
    // Convertir markdown básico a HTML
    let html = markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/`(.*?)`/gim, '<code>$1</code>')
      .replace(/^- (.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gims, '<ul>$1</ul>')
      .replace(/\n\n/gim, '</p><p>')
      .replace(/^(?!<[h|u|l])/gim, '<p>')
      .replace(/(<p>.*<\/p>)$/gims, '$1</p>');
    
    // Agregar estilos
    const styledHtml = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AXYRA - Documentación del Sistema</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8f9fa;
        }
        .container {
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
        h2 { color: #34495e; margin-top: 30px; }
        h3 { color: #7f8c8d; }
        code { 
            background: #f1f2f6; 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-family: 'Monaco', 'Consolas', monospace;
        }
        ul { margin: 10px 0; }
        li { margin: 5px 0; }
        .toc {
            background: #ecf0f1;
            padding: 20px;
            border-radius: 5px;
            margin: 20px 0;
        }
        .module-card {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 15px;
            margin: 10px 0;
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div class="container">
        ${html}
    </div>
</body>
</html>`;
    
    return styledHtml;
  }

  exportDocumentation(format = 'markdown') {
    let content;
    let filename;
    let mimeType;
    
    switch (format) {
      case 'html':
        content = this.generateHTMLDocumentation();
        filename = 'axyra-documentation.html';
        mimeType = 'text/html';
        break;
      case 'markdown':
      default:
        content = this.generateMarkdownDocumentation();
        filename = 'axyra-documentation.md';
        mimeType = 'text/markdown';
        break;
    }
    
    // Crear y descargar archivo
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    console.log(`📚 Documentación exportada: ${filename}`);
    
    if (window.axyraNotificationSystem) {
      window.axyraNotificationSystem.showSuccess(`Documentación exportada: ${filename}`);
    }
  }

  getSystemInfo() {
    return {
      modules: Object.keys(this.documentation.modules).length,
      apis: Object.keys(this.documentation.apis).length,
      configs: Object.keys(this.documentation.configs).length,
      tests: Object.keys(this.documentation.tests).length,
      lastScan: new Date().toISOString()
    };
  }
}

// Inicializar sistema de documentación
let axyraAutoDocumentation;
document.addEventListener('DOMContentLoaded', () => {
  axyraAutoDocumentation = new AxyraAutoDocumentation();
  window.axyraAutoDocumentation = axyraAutoDocumentation;
});

// Exportar para uso global
window.AxyraAutoDocumentation = AxyraAutoDocumentation;
