/**
 * AXYRA Email Verification System
 * Sistema de verificación por email para registro y login
 * Versión: 2.0
 */

class AXYRAEmailVerificationSystem {
    constructor() {
        this.pendingVerifications = new Map();
        this.loginCodes = new Map();
        this.passwordResetCodes = new Map();
        this.failedAttempts = new Map();
        this.maxFailedAttempts = 5;
        this.blockDuration = 30 * 60 * 1000; // 30 minutos
        
        this.init();
    }

    init() {
        this.loadPendingVerifications();
        this.cleanupExpiredCodes();
        console.log('AXYRA Email Verification System inicializado');
    }

    // Generar código de verificación
    generateVerificationCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Generar código de login
    generateLoginCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Generar código de reset de contraseña
    generatePasswordResetCode() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Enviar email de verificación
    async sendVerificationEmail(email, username, code = null) {
        try {
            if (!code) {
                code = this.generateVerificationCode();
            }

            const verificationData = {
                email,
                username,
                code,
                createdAt: Date.now(),
                expiresAt: Date.now() + (10 * 60 * 1000), // 10 minutos
                attempts: 0
            };

            this.pendingVerifications.set(email, verificationData);
            this.savePendingVerifications();

            // Simular envío de email
            console.log(`📧 Email de verificación enviado a: ${email}`);
            console.log(`🔑 Código: ${code}`);
            console.log(`⏰ Expira en: 10 minutos`);

            return {
                success: true,
                code,
                message: 'Email de verificación enviado correctamente'
            };
        } catch (error) {
            console.error('Error enviando email de verificación:', error);
            return {
                success: false,
                message: 'Error enviando email de verificación'
            };
        }
    }

    // Verificar código
    verifyCode(email, inputCode) {
        const verificationData = this.pendingVerifications.get(email);
        
        if (!verificationData) {
            return { success: false, message: 'No hay verificación pendiente para este email' };
        }

        if (Date.now() > verificationData.expiresAt) {
            this.pendingVerifications.delete(email);
            this.savePendingVerifications();
            return { success: false, message: 'Código de verificación expirado' };
        }

        if (verificationData.code === inputCode) {
            this.pendingVerifications.delete(email);
            this.savePendingVerifications();
            console.log(`✅ Email verificado para: ${email}`);
            return { 
                success: true, 
                message: 'Email verificado correctamente',
                username: verificationData.username
            };
        } else {
            verificationData.attempts++;
            if (verificationData.attempts >= 3) {
                this.pendingVerifications.delete(email);
                this.savePendingVerifications();
            }
            return { success: false, message: 'Código de verificación incorrecto' };
        }
    }

    // Enviar código de login
    async sendLoginCode(email, username) {
        try {
            const code = this.generateLoginCode();
            const loginData = {
                email,
                username,
                code,
                createdAt: Date.now(),
                expiresAt: Date.now() + (5 * 60 * 1000), // 5 minutos
                attempts: 0
            };

            this.loginCodes.set(email, loginData);

            // Simular envío de email
            console.log(`📧 Código de login enviado a: ${email}`);
            console.log(`🔑 Código: ${code}`);
            console.log(`⏰ Expira en: 5 minutos`);

            return {
                success: true,
                code,
                message: 'Código de login enviado correctamente'
            };
        } catch (error) {
            console.error('Error enviando código de login:', error);
            return {
                success: false,
                message: 'Error enviando código de login'
            };
        }
    }

    // Enviar email de bienvenida
    async sendWelcomeEmail(email, username) {
        try {
            // Simular envío de email de bienvenida
            console.log(`📧 Email de bienvenida enviado a: ${email}`);
            console.log(`👋 Bienvenido ${username} a AXYRA!`);

            return {
                success: true,
                message: 'Email de bienvenida enviado correctamente'
            };
        } catch (error) {
            console.error('Error enviando email de bienvenida:', error);
            return {
                success: false,
                message: 'Error enviando email de bienvenida'
            };
        }
    }

    // Enviar código de reset de contraseña
    async sendPasswordResetCode(email, username) {
        try {
            const code = this.generatePasswordResetCode();
            const resetData = {
                email,
                username,
                code,
                createdAt: Date.now(),
                expiresAt: Date.now() + (15 * 60 * 1000), // 15 minutos
                attempts: 0
            };

            this.passwordResetCodes.set(email, resetData);

            // Simular envío de email
            console.log(`📧 Código de reset de contraseña enviado a: ${email}`);
            console.log(`🔑 Código: ${code}`);
            console.log(`⏰ Expira en: 15 minutos`);

            return {
                success: true,
                code,
                message: 'Código de reset de contraseña enviado correctamente'
            };
        } catch (error) {
            console.error('Error enviando código de reset:', error);
            return {
                success: false,
                message: 'Error enviando código de reset de contraseña'
            };
        }
    }

    // Registrar intento fallido
    recordFailedAttempt(email) {
        const attempts = this.failedAttempts.get(email) || 0;
        this.failedAttempts.set(email, attempts + 1);

        if (attempts + 1 >= this.maxFailedAttempts) {
            this.blockEmail(email);
        }
    }

    // Verificar si email está bloqueado
    isEmailBlocked(email) {
        const blockData = this.failedAttempts.get(email);
        if (!blockData) return false;

        if (blockData.blockedUntil && Date.now() < blockData.blockedUntil) {
            return true;
        }

        // Desbloquear si ya pasó el tiempo
        if (blockData.blockedUntil && Date.now() >= blockData.blockedUntil) {
            this.failedAttempts.delete(email);
            return false;
        }

        return false;
    }

    // Bloquear email
    blockEmail(email) {
        this.failedAttempts.set(email, {
            attempts: this.maxFailedAttempts,
            blockedUntil: Date.now() + this.blockDuration
        });
        console.log(`🚫 Email ${email} bloqueado por ${this.blockDuration / 60000} minutos`);
    }

    // Remover intentos fallidos
    removeFailedAttempts(email) {
        this.failedAttempts.delete(email);
    }

    // Limpiar códigos expirados
    cleanupExpiredCodes() {
        const now = Date.now();
        
        // Limpiar verificaciones pendientes
        for (const [email, data] of this.pendingVerifications.entries()) {
            if (now > data.expiresAt) {
                this.pendingVerifications.delete(email);
            }
        }

        // Limpiar códigos de login
        for (const [email, data] of this.loginCodes.entries()) {
            if (now > data.expiresAt) {
                this.loginCodes.delete(email);
            }
        }

        // Limpiar códigos de reset
        for (const [email, data] of this.passwordResetCodes.entries()) {
            if (now > data.expiresAt) {
                this.passwordResetCodes.delete(email);
            }
        }

        this.savePendingVerifications();
    }

    // Guardar verificaciones pendientes
    savePendingVerifications() {
        try {
            localStorage.setItem('axyra_pending_verifications', JSON.stringify(Array.from(this.pendingVerifications.entries())));
        } catch (error) {
            console.error('Error al guardar verificaciones pendientes:', error);
        }
    }

    // Cargar verificaciones pendientes
    loadPendingVerifications() {
        try {
            const saved = localStorage.getItem('axyra_pending_verifications');
            if (saved) {
                this.pendingVerifications = new Map(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error al cargar verificaciones pendientes:', error);
        }
    }

    // Obtener datos de email
    getEmailData(email) {
        return {
            pendingVerification: this.pendingVerifications.get(email),
            loginCode: this.loginCodes.get(email),
            passwordResetCode: this.passwordResetCodes.get(email),
            isBlocked: this.isEmailBlocked(email)
        };
    }

    // Remover datos de email
    removeEmailData(email) {
        this.pendingVerifications.delete(email);
        this.loginCodes.delete(email);
        this.passwordResetCodes.delete(email);
        this.removeFailedAttempts(email);
        this.savePendingVerifications();
    }

    // Obtener estadísticas del sistema
    getSystemStats() {
        return {
            pendingVerifications: this.pendingVerifications.size,
            loginCodes: this.loginCodes.size,
            passwordResetCodes: this.passwordResetCodes.size,
            blockedEmails: Array.from(this.failedAttempts.entries()).filter(([_, data]) => 
                data.blockedUntil && Date.now() < data.blockedUntil
            ).length
        };
    }

    // Marcar usuario como verificado
    markUserAsVerified(email) {
        const verificationData = this.pendingVerifications.get(email);
        if (verificationData) {
            this.pendingVerifications.delete(email);
            this.savePendingVerifications();
            console.log(`✅ Usuario ${verificationData.username} marcado como verificado`);
        }
    }

    // Limpiar emails antiguos
    cleanupOldEmails() {
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        
        // Limpiar verificaciones antiguas
        for (const [email, data] of this.pendingVerifications.entries()) {
            if (data.createdAt < oneDayAgo) {
                this.pendingVerifications.delete(email);
            }
        }

        // Limpiar códigos de login antiguos
        for (const [email, data] of this.loginCodes.entries()) {
            if (data.createdAt < oneDayAgo) {
                this.loginCodes.delete(email);
            }
        }

        // Limpiar códigos de reset antiguos
        for (const [email, data] of this.passwordResetCodes.entries()) {
            if (data.createdAt < oneDayAgo) {
                this.passwordResetCodes.delete(email);
            }
        }

        this.savePendingVerifications();
        console.log('🧹 Emails antiguos limpiados');
    }

    // Obtener asunto del email
    getEmailSubject(type) {
        const subjects = {
            verification: 'AXYRA - Verifica tu cuenta',
            login: 'AXYRA - Código de acceso',
            welcome: 'AXYRA - ¡Bienvenido!',
            passwordReset: 'AXYRA - Reset de contraseña'
        };
        return subjects[type] || 'AXYRA - Notificación';
    }

    // Obtener cuerpo del email
    getEmailBody(type, username, code) {
        const bodies = {
            verification: `Hola ${username},\n\nTu código de verificación es: ${code}\n\nEste código expira en 10 minutos.\n\nSaludos,\nEquipo AXYRA`,
            login: `Hola ${username},\n\nTu código de acceso es: ${code}\n\nEste código expira en 5 minutos.\n\nSaludos,\nEquipo AXYRA`,
            welcome: `Hola ${username},\n\n¡Bienvenido a AXYRA!\n\nTu cuenta ha sido creada exitosamente.\n\nSaludos,\nEquipo AXYRA`,
            passwordReset: `Hola ${username},\n\nTu código para resetear la contraseña es: ${code}\n\nEste código expira en 15 minutos.\n\nSaludos,\nEquipo AXYRA`
        };
        return bodies[type] || 'Mensaje de AXYRA';
    }
}

// Instancia global
const axyraEmailVerification = new AXYRAEmailVerificationSystem();

// Limpiar emails antiguos cada hora
setInterval(() => {
    axyraEmailVerification.cleanupOldEmails();
}, 60 * 60 * 1000);

// Exportar para uso en otros módulos
window.AXYRAEmailVerificationSystem = AXYRAEmailVerificationSystem;
window.axyraEmailVerification = axyraEmailVerification;
