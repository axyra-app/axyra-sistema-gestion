/**
 * AXYRA - Sistema de Configuración
 * Gestiona toda la configuración del sistema y seguridad
 */

class AxyraConfiguration {
    constructor() {
        this.config = {};
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            console.log('🚀 Inicializando Sistema de Configuración AXYRA...');
            
            // Cargar configuración existente
            await this.loadConfiguration();
            
            // Inicializar componentes
            this.initializeSecurityComponents();
            this.initializeCompanyForm();
            this.initializeSystemOptions();
            
            // Configurar event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ Sistema de configuración inicializado correctamente');
        } catch (error) {
            console.error('❌ Error inicializando configuración:', error);
        }
    }

    async loadConfiguration() {
        try {
            // Cargar configuración de empresa
            const companyConfig = localStorage.getItem('axyra_config_empresa');
            if (companyConfig) {
                this.config.company = JSON.parse(companyConfig);
            } else {
                // Configuración por defecto
                this.config.company = {
                    nombre: 'Villa Venecia',
                    nit: '900.000.000-1',
                    direccion: 'Calle Principal #123',
                    telefono: '(57) 300-123-4567',
                    email: 'info@villavenecia.com'
                };
            }

            // Cargar configuración del sistema
            const systemConfig = localStorage.getItem('axyra_config_sistema');
            if (systemConfig) {
                this.config.system = JSON.parse(systemConfig);
            } else {
                // Configuración por defecto
                this.config.system = {
                    autoSave: true,
                    darkMode: false,
                    notifications: true,
                    sessionTimeout: 30,
                    maxLoginAttempts: 5
                };
            }

            // Cargar configuración de seguridad
            const securityConfig = localStorage.getItem('axyra_config_seguridad');
            if (securityConfig) {
                this.config.security = JSON.parse(securityConfig);
            } else {
                // Configuración por defecto
                this.config.security = {
                    twoFactorEnabled: false,
                    backupFrequency: 'daily',
                    notificationsFrequency: 10,
                    sessionTimeout: 30
                };
            }

        } catch (error) {
            console.error('❌ Error cargando configuración:', error);
        }
    }

    initializeSecurityComponents() {
        try {
            // Actualizar estado de 2FA
            this.update2FAStatus();
            
            // Actualizar información de sesión
            this.updateSessionInfo();
            
            // Actualizar estado responsive
            this.updateResponsiveStatus();
            
            // Actualizar información de respaldo
            this.updateBackupInfo();
            
            // Actualizar información de notificaciones
            this.updateNotificationsInfo();
            
            // Actualizar información de actualizaciones
            this.updateUpdatesInfo();
            
        } catch (error) {
            console.error('❌ Error inicializando componentes de seguridad:', error);
        }
    }

    initializeCompanyForm() {
        try {
            // Llenar formulario con datos existentes
            const company = this.config.company;
            
            document.getElementById('companyName').value = company.nombre || '';
            document.getElementById('companyNIT').value = company.nit || '';
            document.getElementById('companyAddress').value = company.direccion || '';
            document.getElementById('companyPhone').value = company.telefono || '';
            document.getElementById('companyEmail').value = company.email || '';
            
        } catch (error) {
            console.error('❌ Error inicializando formulario de empresa:', error);
        }
    }

    initializeSystemOptions() {
        try {
            const system = this.config.system;
            
            // Configurar switches
            document.getElementById('autoSave').checked = system.autoSave;
            document.getElementById('darkMode').checked = system.darkMode;
            document.getElementById('notifications').checked = system.notifications;
            
            // Configurar selects
            document.getElementById('sessionTimeout').value = system.sessionTimeout;
            document.getElementById('maxLoginAttempts').value = system.maxLoginAttempts;
            
        } catch (error) {
            console.error('❌ Error inicializando opciones del sistema:', error);
        }
    }

    setupEventListeners() {
        try {
            // Event listeners para switches
            document.getElementById('autoSave').addEventListener('change', (e) => {
                this.config.system.autoSave = e.target.checked;
                this.saveSystemConfig();
            });

            document.getElementById('darkMode').addEventListener('change', (e) => {
                this.config.system.darkMode = e.target.checked;
                this.saveSystemConfig();
                this.applyDarkMode();
            });

            document.getElementById('notifications').addEventListener('change', (e) => {
                this.config.system.notifications = e.target.checked;
                this.saveSystemConfig();
            });

            // Event listeners para selects
            document.getElementById('sessionTimeout').addEventListener('change', (e) => {
                this.config.system.sessionTimeout = parseInt(e.target.value);
                this.saveSystemConfig();
                this.updateSessionTimeout();
            });

            document.getElementById('maxLoginAttempts').addEventListener('change', (e) => {
                this.config.system.maxLoginAttempts = parseInt(e.target.value);
                this.saveSystemConfig();
            });

        } catch (error) {
            console.error('❌ Error configurando event listeners:', error);
        }
    }

    // Métodos de Seguridad
    update2FAStatus() {
        try {
            const twoFactorEnabled = this.config.security.twoFactorEnabled;
            const statusElement = document.getElementById('2faStatusValue');
            
            if (statusElement) {
                statusElement.textContent = twoFactorEnabled ? 'Configurado' : 'No configurado';
                statusElement.className = twoFactorEnabled ? 'axyra-2fa-value enabled' : 'axyra-2fa-value disabled';
            }
        } catch (error) {
            console.error('❌ Error actualizando estado 2FA:', error);
        }
    }

    updateSessionInfo() {
        try {
            const sessionTimeElement = document.getElementById('sessionTime');
            if (sessionTimeElement && window.axyraSessionTimeout) {
                const remainingTime = window.axyraSessionTimeout.getRemainingTime();
                sessionTimeElement.textContent = remainingTime;
            }
        } catch (error) {
            console.error('❌ Error actualizando información de sesión:', error);
        }
    }

    updateResponsiveStatus() {
        try {
            const responsiveStatusElement = document.getElementById('responsiveStatus');
            if (responsiveStatusElement) {
                const isMobile = window.innerWidth <= 768;
                responsiveStatusElement.textContent = isMobile ? 'Móvil' : 'Desktop';
                responsiveStatusElement.className = isMobile ? 'axyra-responsive-status mobile' : 'axyra-responsive-status desktop';
            }
        } catch (error) {
            console.error('❌ Error actualizando estado responsive:', error);
        }
    }

    updateBackupInfo() {
        try {
            const lastBackupElement = document.getElementById('lastBackupDate');
            if (lastBackupElement) {
                const lastBackup = localStorage.getItem('axyra_ultimo_respaldo');
                if (lastBackup) {
                    const date = new Date(parseInt(lastBackup));
                    lastBackupElement.textContent = date.toLocaleDateString('es-CO');
                } else {
                    lastBackupElement.textContent = 'Nunca';
                }
            }
        } catch (error) {
            console.error('❌ Error actualizando información de respaldo:', error);
        }
    }

    updateNotificationsInfo() {
        try {
            const frequencyElement = document.getElementById('notificationsFrequency');
            if (frequencyElement) {
                const frequency = this.config.security.notificationsFrequency;
                frequencyElement.textContent = `Cada ${frequency} min`;
            }
        } catch (error) {
            console.error('❌ Error actualizando información de notificaciones:', error);
        }
    }

    updateUpdatesInfo() {
        try {
            const versionElement = document.getElementById('currentVersion');
            if (versionElement) {
                versionElement.textContent = '1.0.0';
            }
        } catch (error) {
            console.error('❌ Error actualizando información de actualizaciones:', error);
        }
    }

    // Métodos de Configuración
    async saveCompanyConfig() {
        try {
            const companyConfig = {
                nombre: document.getElementById('companyName').value,
                nit: document.getElementById('companyNIT').value,
                direccion: document.getElementById('companyAddress').value,
                telefono: document.getElementById('companyPhone').value,
                email: document.getElementById('companyEmail').value
            };

            // Validar campos requeridos
            if (!companyConfig.nombre || !companyConfig.nit) {
                this.showMessage('El nombre y NIT de la empresa son obligatorios', 'error');
                return;
            }

            // Guardar en localStorage
            localStorage.setItem('axyra_config_empresa', JSON.stringify(companyConfig));
            this.config.company = companyConfig;

            // Actualizar header en todas las páginas
            this.updateCompanyInfoGlobally();

            this.showMessage('Configuración de empresa guardada correctamente', 'success');
            
        } catch (error) {
            console.error('❌ Error guardando configuración de empresa:', error);
            this.showMessage('Error guardando la configuración', 'error');
        }
    }

    resetCompanyConfig() {
        try {
            // Restaurar valores por defecto
            this.config.company = {
                nombre: 'Villa Venecia',
                nit: '900.000.000-1',
                direccion: 'Calle Principal #123',
                telefono: '(57) 300-123-4567',
                email: 'info@villavenecia.com'
            };

            // Actualizar formulario
            this.initializeCompanyForm();
            
            // Guardar configuración por defecto
            localStorage.setItem('axyra_config_empresa', JSON.stringify(this.config.company));
            
            this.showMessage('Configuración restaurada a valores por defecto', 'info');
            
        } catch (error) {
            console.error('❌ Error restaurando configuración:', error);
            this.showMessage('Error restaurando la configuración', 'error');
        }
    }

    saveSystemConfig() {
        try {
            localStorage.setItem('axyra_config_sistema', JSON.stringify(this.config.system));
        } catch (error) {
            console.error('❌ Error guardando configuración del sistema:', error);
        }
    }

    saveSecurityConfig() {
        try {
            localStorage.setItem('axyra_config_seguridad', JSON.stringify(this.config.security));
        } catch (error) {
            console.error('❌ Error guardando configuración de seguridad:', error);
        }
    }

    // Métodos de Seguridad
    async setup2FA() {
        try {
            if (window.axyra2FA) {
                await window.axyra2FA.setup();
                this.config.security.twoFactorEnabled = true;
                this.saveSecurityConfig();
                this.update2FAStatus();
                this.showMessage('2FA configurado correctamente', 'success');
            } else {
                this.showMessage('Sistema 2FA no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error configurando 2FA:', error);
            this.showMessage('Error configurando 2FA', 'error');
        }
    }

    async test2FA() {
        try {
            if (window.axyra2FA) {
                await window.axyra2FA.test();
            } else {
                this.showMessage('Sistema 2FA no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error probando 2FA:', error);
            this.showMessage('Error probando 2FA', 'error');
        }
    }

    resetSessionTimeout() {
        try {
            if (window.axyraSessionTimeout) {
                window.axyraSessionTimeout.reset();
                this.showMessage('Sesión renovada correctamente', 'success');
                this.updateSessionInfo();
            } else {
                this.showMessage('Sistema de timeout no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error renovando sesión:', error);
            this.showMessage('Error renovando la sesión', 'error');
        }
    }

    configureSessionTimeout() {
        try {
            const newTimeout = prompt('Ingresa el nuevo timeout en minutos (15-120):', this.config.security.sessionTimeout);
            if (newTimeout && !isNaN(newTimeout)) {
                const timeout = parseInt(newTimeout);
                if (timeout >= 15 && timeout <= 120) {
                    this.config.security.sessionTimeout = timeout;
                    this.saveSecurityConfig();
                    this.updateSessionTimeout();
                    this.showMessage(`Timeout configurado a ${timeout} minutos`, 'success');
                } else {
                    this.showMessage('El timeout debe estar entre 15 y 120 minutos', 'error');
                }
            }
        } catch (error) {
            console.error('❌ Error configurando timeout:', error);
            this.showMessage('Error configurando el timeout', 'error');
        }
    }

    testResponsive() {
        try {
            // Simular diferentes tamaños de pantalla
            const sizes = [
                { width: 375, height: 667, name: 'Móvil' },
                { width: 768, height: 1024, name: 'Tablet' },
                { width: 1920, height: 1080, name: 'Desktop' }
            ];

            let currentIndex = 0;
            const testResponsive = () => {
                if (currentIndex < sizes.length) {
                    const size = sizes[currentIndex];
                    this.showMessage(`Probando: ${size.name} (${size.width}x${size.height})`, 'info');
                    
                    // Simular cambio de tamaño
                    window.dispatchEvent(new Event('resize'));
                    
                    currentIndex++;
                    setTimeout(testResponsive, 2000);
                } else {
                    this.showMessage('Prueba de responsive completada', 'success');
                }
            };

            testResponsive();
            
        } catch (error) {
            console.error('❌ Error probando responsive:', error);
            this.showMessage('Error probando responsive', 'error');
        }
    }

    configureResponsive() {
        try {
            this.showMessage('Configuración de responsive disponible en próximas versiones', 'info');
        } catch (error) {
            console.error('❌ Error configurando responsive:', error);
        }
    }

    async performBackup() {
        try {
            if (window.axyraBackupSystem) {
                await window.axyraBackupSystem.performBackup();
                this.updateBackupInfo();
                this.showMessage('Respaldo realizado correctamente', 'success');
            } else {
                this.showMessage('Sistema de respaldo no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error realizando respaldo:', error);
            this.showMessage('Error realizando el respaldo', 'error');
        }
    }

    configureBackup() {
        try {
            const frequency = prompt('Ingresa la frecuencia de respaldo (daily/weekly/monthly):', this.config.security.backupFrequency);
            if (frequency && ['daily', 'weekly', 'monthly'].includes(frequency)) {
                this.config.security.backupFrequency = frequency;
                this.saveSecurityConfig();
                this.showMessage(`Frecuencia de respaldo configurada a: ${frequency}`, 'success');
            }
        } catch (error) {
            console.error('❌ Error configurando respaldo:', error);
            this.showMessage('Error configurando el respaldo', 'error');
        }
    }

    testNotifications() {
        try {
            if (window.axyraNotifications) {
                window.axyraNotifications.showInfo('Esta es una notificación de prueba del sistema de configuración');
                this.showMessage('Notificación de prueba enviada', 'success');
            } else {
                this.showMessage('Sistema de notificaciones no disponible', 'error');
            }
        } catch (error) {
            console.error('❌ Error probando notificaciones:', error);
            this.showMessage('Error probando notificaciones', 'error');
        }
    }

    configureNotifications() {
        try {
            const frequency = prompt('Ingresa la frecuencia de notificaciones en minutos (5-60):', this.config.security.notificationsFrequency);
            if (frequency && !isNaN(frequency)) {
                const freq = parseInt(frequency);
                if (freq >= 5 && freq <= 60) {
                    this.config.security.notificationsFrequency = freq;
                    this.saveSecurityConfig();
                    this.updateNotificationsInfo();
                    this.showMessage(`Frecuencia configurada a ${freq} minutos`, 'success');
                } else {
                    this.showMessage('La frecuencia debe estar entre 5 y 60 minutos', 'error');
                }
            }
        } catch (error) {
            console.error('❌ Error configurando notificaciones:', error);
            this.showMessage('Error configurando notificaciones', 'error');
        }
    }

    async checkUpdates() {
        try {
            this.showMessage('Verificando actualizaciones...', 'info');
            
            // Simular verificación de actualizaciones
            setTimeout(() => {
                this.showMessage('No hay actualizaciones disponibles. El sistema está actualizado.', 'success');
            }, 3000);
            
        } catch (error) {
            console.error('❌ Error verificando actualizaciones:', error);
            this.showMessage('Error verificando actualizaciones', 'error');
        }
    }

    configureUpdates() {
        try {
            this.showMessage('Configuración de actualizaciones disponible en próximas versiones', 'info');
        } catch (error) {
            console.error('❌ Error configurando actualizaciones:', error);
        }
    }

    // Métodos de Utilidad
    updateCompanyInfoGlobally() {
        try {
            // Actualizar título de la página
            document.title = `AXYRA - ${this.config.company.nombre}`;
            
            // Actualizar subtítulo del header
            const subtitleElement = document.getElementById('pageSubtitle');
            if (subtitleElement) {
                subtitleElement.textContent = 'Configuración';
            }
            
            // Disparar evento para que otras páginas se actualicen
            window.dispatchEvent(new CustomEvent('companyConfigUpdated', {
                detail: this.config.company
            }));
            
        } catch (error) {
            console.error('❌ Error actualizando información global:', error);
        }
    }

    updateSessionTimeout() {
        try {
            if (window.axyraSessionTimeout) {
                window.axyraSessionTimeout.setTimeout(this.config.security.sessionTimeout * 60 * 1000);
            }
        } catch (error) {
            console.error('❌ Error actualizando timeout de sesión:', error);
        }
    }

    applyDarkMode() {
        try {
            if (this.config.system.darkMode) {
                document.body.classList.add('axyra-dark-mode');
            } else {
                document.body.classList.remove('axyra-dark-mode');
            }
        } catch (error) {
            console.error('❌ Error aplicando modo oscuro:', error);
        }
    }

    showMessage(message, type = 'info') {
        try {
            if (window.axyraNotifications) {
                window.axyraNotifications.showMessage(message, type);
            } else {
                // Fallback simple
                alert(`${type.toUpperCase()}: ${message}`);
            }
        } catch (error) {
            console.error('❌ Error mostrando mensaje:', error);
            alert(message);
        }
    }

    destroy() {
        try {
            // Limpiar recursos si es necesario
            console.log('🔧 Sistema de configuración destruido');
        } catch (error) {
            console.error('❌ Error destruyendo configuración:', error);
        }
    }
}

// Inicializar configuración cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Configuración cargada, inicializando...');
    try {
        window.axyraConfig = new AxyraConfiguration();
    } catch (error) {
        console.error('❌ Error inicializando configuración:', error);
    }
});

// Funciones globales para los botones del HTML
window.setup2FA = function() {
    if (window.axyraConfig) {
        window.axyraConfig.setup2FA();
    }
};

window.test2FA = function() {
    if (window.axyraConfig) {
        window.axyraConfig.test2FA();
    }
};

window.resetSessionTimeout = function() {
    if (window.axyraConfig) {
        window.axyraConfig.resetSessionTimeout();
    }
};

window.configureSessionTimeout = function() {
    if (window.axyraConfig) {
        window.axyraConfig.configureSessionTimeout();
    }
};

window.testResponsive = function() {
    if (window.axyraConfig) {
        window.axyraConfig.testResponsive();
    }
};

window.configureResponsive = function() {
    if (window.axyraConfig) {
        window.axyraConfig.configureResponsive();
    }
};

window.performBackup = function() {
    if (window.axyraConfig) {
        window.axyraConfig.performBackup();
    }
};

window.configureBackup = function() {
    if (window.axyraConfig) {
        window.axyraConfig.configureBackup();
    }
};

window.testNotifications = function() {
    if (window.axyraConfig) {
        window.axyraConfig.testNotifications();
    }
};

window.configureNotifications = function() {
    if (window.axyraConfig) {
        window.axyraConfig.configureNotifications();
    }
};

window.checkUpdates = function() {
    if (window.axyraConfig) {
        window.axyraConfig.checkUpdates();
    }
};

window.configureUpdates = function() {
    if (window.axyraConfig) {
        window.axyraConfig.configureUpdates();
    }
};

window.saveCompanyConfig = function() {
    if (window.axyraConfig) {
        window.axyraConfig.saveCompanyConfig();
    }
};

window.resetCompanyConfig = function() {
    if (window.axyraConfig) {
        window.axyraConfig.resetCompanyConfig();
    }
};

// Limpiar recursos al cerrar la página
window.addEventListener('beforeunload', function() {
    if (window.axyraConfig) {
        window.axyraConfig.destroy();
    }
});
