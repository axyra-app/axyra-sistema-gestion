/* ========================================
   SISTEMA DE AUTENTICACIÓN DE DOS FACTORES (2FA) AXYRA
   ======================================== */

class Axyra2FA {
    constructor() {
        this.secretKey = null;
        this.qrCode = null;
        this.isEnabled = false;
        this.backupCodes = [];
        this.init();
    }

    init() {
        console.log('🔐 Inicializando Sistema 2FA AXYRA...');
        this.load2FAStatus();
        this.setupEventListeners();
    }

    async load2FAStatus() {
        try {
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                this.isEnabled = user.twoFactorEnabled || false;
                this.secretKey = user.twoFactorSecret || null;
                
                if (this.isEnabled) {
                    this.show2FAStatus();
                }
            }
        } catch (error) {
            console.error('❌ Error cargando estado 2FA:', error);
        }
    }

    setupEventListeners() {
        // Botón para configurar 2FA
        const setup2FABtn = document.getElementById('setup2FABtn');
        if (setup2FABtn) {
            setup2FABtn.addEventListener('click', () => this.showSetupModal());
        }

        // Botón para desactivar 2FA
        const disable2FABtn = document.getElementById('disable2FABtn');
        if (disable2FABtn) {
            disable2FABtn.addEventListener('click', () => this.showDisableModal());
        }

        // Botón para generar códigos de respaldo
        const backupCodesBtn = document.getElementById('backupCodesBtn');
        if (backupCodesBtn) {
            backupCodesBtn.addEventListener('click', () => this.generateBackupCodes());
        }
    }

    async generateSecretKey() {
        try {
            // Generar clave secreta de 32 caracteres
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
            let secret = '';
            for (let i = 0; i < 32; i++) {
                secret += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            
            this.secretKey = secret;
            return secret;
        } catch (error) {
            console.error('❌ Error generando clave secreta:', error);
            throw error;
        }
    }

    async generateQRCode(secret, username, issuer = 'AXYRA') {
        try {
            // Formato TOTP URI para Google Authenticator
            const totpUri = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(username)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
            
            // Generar código QR usando la librería QRCode.js
            if (typeof QRCode !== 'undefined') {
                const qrContainer = document.getElementById('qrCode');
                if (qrContainer) {
                    qrContainer.innerHTML = '';
                    new QRCode(qrContainer, {
                        text: totpUri,
                        width: 200,
                        height: 200,
                        colorDark: '#1e293b',
                        colorLight: '#ffffff',
                        correctLevel: QRCode.CorrectLevel.H
                    });
                }
            } else {
                // Fallback si no hay librería QR
                this.showManualSetup(secret);
            }
            
            return totpUri;
        } catch (error) {
            console.error('❌ Error generando código QR:', error);
            throw error;
        }
    }

    showManualSetup(secret) {
        const qrContainer = document.getElementById('qrCode');
        if (qrContainer) {
            qrContainer.innerHTML = `
                <div class="axyra-manual-setup">
                    <h4>Configuración Manual</h4>
                    <p>Si no puedes escanear el código QR, ingresa manualmente en tu aplicación:</p>
                    <div class="axyra-secret-key">
                        <strong>Clave Secreta:</strong>
                        <code>${secret}</code>
                        <button class="axyra-btn axyra-btn-secondary" onclick="navigator.clipboard.writeText('${secret}')">
                            <i class="fas fa-copy"></i> Copiar
                        </button>
                    </div>
                </div>
            `;
        }
    }

    async verifyCode(code) {
        try {
            if (!this.secretKey) {
                throw new Error('No hay clave secreta configurada');
            }

            // Verificar código TOTP
            const isValid = this.verifyTOTP(code, this.secretKey);
            return isValid;
        } catch (error) {
            console.error('❌ Error verificando código:', error);
            return false;
        }
    }

    verifyTOTP(code, secret) {
        try {
            // Implementación básica de verificación TOTP
            // En producción, usar librería como speakeasy o similar
            
            const now = Math.floor(Date.now() / 30000); // Ventana de 30 segundos
            const expectedCode = this.generateTOTP(secret, now);
            
            // Verificar código actual y códigos adyacentes (ventana de ±1)
            for (let i = -1; i <= 1; i++) {
                const checkCode = this.generateTOTP(secret, now + i);
                if (code === checkCode) {
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('❌ Error en verificación TOTP:', error);
            return false;
        }
    }

    generateTOTP(secret, counter) {
        try {
            // Implementación simplificada de TOTP
            // En producción, usar librería especializada
            
            // Simular generación de código de 6 dígitos
            const hash = this.simpleHash(secret + counter);
            const code = parseInt(hash.substring(0, 6), 16) % 1000000;
            return code.toString().padStart(6, '0');
        } catch (error) {
            console.error('❌ Error generando TOTP:', error);
            return '000000';
        }
    }

    simpleHash(str) {
        // Hash simple para demostración
        // En producción, usar SHA-1 o SHA-256
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convertir a entero de 32 bits
        }
        return Math.abs(hash).toString(16);
    }

    async generateBackupCodes() {
        try {
            // Generar 10 códigos de respaldo únicos
            this.backupCodes = [];
            for (let i = 0; i < 10; i++) {
                const code = this.generateBackupCode();
                this.backupCodes.push(code);
            }
            
            // Guardar códigos en localStorage
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                user.backupCodes = this.backupCodes;
                localStorage.setItem('axyra_isolated_user', JSON.stringify(user));
            }
            
            this.showBackupCodes();
            return this.backupCodes;
        } catch (error) {
            console.error('❌ Error generando códigos de respaldo:', error);
            throw error;
        }
    }

    generateBackupCode() {
        // Generar código de respaldo de 8 caracteres
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    async enable2FA(verificationCode) {
        try {
            if (!this.secretKey) {
                throw new Error('No hay clave secreta generada');
            }

            // Verificar código
            const isValid = await this.verifyCode(verificationCode);
            if (!isValid) {
                throw new Error('Código de verificación inválido');
            }

            // Activar 2FA
            this.isEnabled = true;
            
            // Guardar en localStorage
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                user.twoFactorEnabled = true;
                user.twoFactorSecret = this.secretKey;
                localStorage.setItem('axyra_isolated_user', JSON.stringify(user));
            }

            // Generar códigos de respaldo
            await this.generateBackupCodes();
            
            // Mostrar confirmación
            this.showSuccessMessage('2FA activado correctamente');
            this.update2FAStatus();
            
            return true;
        } catch (error) {
            console.error('❌ Error activando 2FA:', error);
            this.showErrorMessage(error.message);
            return false;
        }
    }

    async disable2FA(verificationCode) {
        try {
            if (!this.isEnabled) {
                throw new Error('2FA no está activado');
            }

            // Verificar código
            const isValid = await this.verifyCode(verificationCode);
            if (!isValid) {
                throw new Error('Código de verificación inválido');
            }

            // Desactivar 2FA
            this.isEnabled = false;
            this.secretKey = null;
            this.backupCodes = [];
            
            // Guardar en localStorage
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                user.twoFactorEnabled = false;
                user.twoFactorSecret = null;
                user.backupCodes = [];
                localStorage.setItem('axyra_isolated_user', JSON.stringify(user));
            }

            // Mostrar confirmación
            this.showSuccessMessage('2FA desactivado correctamente');
            this.update2FAStatus();
            
            return true;
        } catch (error) {
            console.error('❌ Error desactivando 2FA:', error);
            this.showErrorMessage(error.message);
            return false;
        }
    }

    async verifyBackupCode(code) {
        try {
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                const backupCodes = user.backupCodes || [];
                
                const index = backupCodes.indexOf(code);
                if (index !== -1) {
                    // Remover código usado
                    backupCodes.splice(index, 1);
                    user.backupCodes = backupCodes;
                    localStorage.setItem('axyra_isolated_user', JSON.stringify(user));
                    return true;
                }
            }
            
            return false;
        } catch (error) {
            console.error('❌ Error verificando código de respaldo:', error);
            return false;
        }
    }

    showSetupModal() {
        const modal = document.createElement('div');
        modal.className = 'axyra-modal';
        modal.innerHTML = `
            <div class="axyra-modal-content">
                <div class="axyra-modal-header">
                    <h3><i class="fas fa-shield-alt"></i> Configurar Autenticación de Dos Factores</h3>
                    <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="axyra-modal-body">
                    <div class="axyra-2fa-setup">
                        <div class="axyra-setup-step">
                            <h4>1. Escanea el código QR</h4>
                            <div id="qrCode" class="axyra-qr-container">
                                <!-- El código QR se generará aquí -->
                            </div>
                            <p>Usa la aplicación Google Authenticator o similar</p>
                        </div>
                        
                        <div class="axyra-setup-step">
                            <h4>2. Verifica la configuración</h4>
                            <div class="axyra-form-group">
                                <label>Código de Verificación:</label>
                                <input type="text" id="verificationCode" class="axyra-form-input" 
                                       placeholder="Ingresa el código de 6 dígitos" maxlength="6" />
                            </div>
                            <button class="axyra-btn axyra-btn-primary" onclick="axyra2FA.activate2FA()">
                                <i class="fas fa-check"></i> Activar 2FA
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Generar clave secreta y código QR
        this.generateSecretKey().then(secret => {
            this.generateQRCode(secret, 'Usuario AXYRA');
        });
    }

    showDisableModal() {
        const modal = document.createElement('div');
        modal.className = 'axyra-modal';
        modal.innerHTML = `
            <div class="axyra-modal-content">
                <div class="axyra-modal-header">
                    <h3><i class="fas fa-shield-alt"></i> Desactivar Autenticación de Dos Factores</h3>
                    <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="axyra-modal-body">
                    <div class="axyra-2fa-disable">
                        <div class="axyra-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p><strong>Advertencia:</strong> Desactivar 2FA reducirá la seguridad de tu cuenta.</p>
                        </div>
                        
                        <div class="axyra-form-group">
                            <label>Código de Verificación:</label>
                            <input type="text" id="disableVerificationCode" class="axyra-form-input" 
                                   placeholder="Ingresa el código de 6 dígitos" maxlength="6" />
                        </div>
                        
                        <button class="axyra-btn axyra-btn-danger" onclick="axyra2FA.confirmDisable()">
                            <i class="fas fa-times"></i> Desactivar 2FA
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    showBackupCodes() {
        const modal = document.createElement('div');
        modal.className = 'axyra-modal';
        modal.innerHTML = `
            <div class="axyra-modal-content">
                <div class="axyra-modal-header">
                    <h3><i class="fas fa-key"></i> Códigos de Respaldo</h3>
                    <button class="axyra-modal-close" onclick="this.closest('.axyra-modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="axyra-modal-body">
                    <div class="axyra-backup-codes">
                        <div class="axyra-warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            <p><strong>Importante:</strong> Guarda estos códigos en un lugar seguro. Solo se mostrarán una vez.</p>
                        </div>
                        
                        <div class="axyra-codes-grid">
                            ${this.backupCodes.map(code => `
                                <div class="axyra-backup-code">${code}</div>
                            `).join('')}
                        </div>
                        
                        <button class="axyra-btn axyra-btn-secondary" onclick="axyra2FA.downloadBackupCodes()">
                            <i class="fas fa-download"></i> Descargar Códigos
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    async activate2FA() {
        const code = document.getElementById('verificationCode').value;
        if (!code || code.length !== 6) {
            this.showErrorMessage('Ingresa un código de 6 dígitos válido');
            return;
        }

        const success = await this.enable2FA(code);
        if (success) {
            // Cerrar modal de configuración
            const modal = document.querySelector('.axyra-modal');
            if (modal) {
                modal.remove();
            }
        }
    }

    async confirmDisable() {
        const code = document.getElementById('disableVerificationCode').value;
        if (!code || code.length !== 6) {
            this.showErrorMessage('Ingresa un código de 6 dígitos válido');
            return;
        }

        const success = await this.disable2FA(code);
        if (success) {
            // Cerrar modal de desactivación
            const modal = document.querySelector('.axyra-modal');
            if (modal) {
                modal.remove();
            }
        }
    }

    downloadBackupCodes() {
        try {
            const codes = this.backupCodes.join('\n');
            const blob = new Blob([codes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'axyra-backup-codes.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('❌ Error descargando códigos:', error);
        }
    }

    update2FAStatus() {
        // Actualizar UI según el estado de 2FA
        const statusElement = document.getElementById('2faStatus');
        if (statusElement) {
            if (this.isEnabled) {
                statusElement.innerHTML = `
                    <span class="axyra-status-enabled">
                        <i class="fas fa-shield-check"></i> 2FA Activado
                    </span>
                `;
            } else {
                statusElement.innerHTML = `
                    <span class="axyra-status-disabled">
                        <i class="fas fa-shield-alt"></i> 2FA Desactivado
                    </span>
                `;
            }
        }
    }

    show2FAStatus() {
        // Mostrar estado actual de 2FA en la UI
        this.update2FAStatus();
    }

    showSuccessMessage(message) {
        // Mostrar mensaje de éxito
        console.log('✅', message);
        // Aquí podrías mostrar una notificación visual
    }

    showErrorMessage(message) {
        // Mostrar mensaje de error
        console.error('❌', message);
        // Aquí podrías mostrar una notificación visual
    }
}

// Inicializar sistema 2FA cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔐 Inicializando Sistema 2FA...');
    try {
        window.axyra2FA = new Axyra2FA();
    } catch (error) {
        console.error('❌ Error inicializando 2FA:', error);
    }
});

// Funciones globales para botones del HTML
window.setup2FA = function() {
    if (window.axyra2FA) {
        window.axyra2FA.showSetupModal();
    }
};

window.disable2FA = function() {
    if (window.axyra2FA) {
        window.axyra2FA.showDisableModal();
    }
};

window.generateBackupCodes = function() {
    if (window.axyra2FA) {
        window.axyra2FA.generateBackupCodes();
    }
};
