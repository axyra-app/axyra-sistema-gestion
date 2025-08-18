/**
 * AXYRA Real Email Verification System
 * Sistema real de verificación de email usando servicios externos
 * Versión: 1.0
 */

class AXYRARealEmailVerification {
  constructor() {
    this.verificationCodes = new Map();
    this.emailService = 'emailjs'; // Puedes cambiar a 'sendgrid', 'mailgun', etc.
    this.isInitialized = false;

    this.init();
  }

  init() {
    try {
      // Esperar a que EmailJS esté completamente cargado
      if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init('SRhw4RGz8nrZInNaZ'); // User ID de EmailJS configurado
        this.isInitialized = true;
        this.emailService = 'emailjs';
        console.log('✅ EmailJS inicializado para verificación real');
      } else {
        // Si EmailJS no está disponible, usar verificación simulada
        console.log('⚠️ EmailJS no disponible, usando verificación simulada');
        this.emailService = 'simulated';
        this.initSimulatedEmail();
      }
    } catch (error) {
      console.error('❌ Error inicializando verificación de email:', error);
      this.emailService = 'simulated';
      this.initSimulatedEmail();
    }
  }

  // Inicializar verificación simulada como fallback
  initSimulatedEmail() {
    this.isInitialized = true;
    console.log('✅ Verificación de email simulada activada');
  }

  // Generar código de verificación
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Verificar si EmailJS está disponible antes de enviar
  isEmailJSAvailable() {
    return typeof emailjs !== 'undefined' && typeof emailjs.send === 'function' && this.emailService === 'emailjs';
  }

  // Forzar reinicialización de EmailJS
  forceReinitializeEmailJS() {
    try {
      if (typeof emailjs !== 'undefined' && emailjs.init) {
        emailjs.init('SRhw4RGz8nrZInNaZ');
        this.emailService = 'emailjs';
        this.isInitialized = true;
        console.log('🔄 EmailJS reinicializado forzadamente');
        return true;
      }
      return false;
    } catch (error) {
      console.error('❌ Error reinicializando EmailJS:', error);
      return false;
    }
  }

  // Enviar email de verificación
  async sendVerificationEmail(email, username) {
    try {
      const code = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Guardar código temporalmente
      this.verificationCodes.set(email, {
        code: code,
        username: username,
        expiresAt: expiresAt,
      });

      // Verificar disponibilidad de EmailJS ANTES de enviar
      if (this.isEmailJSAvailable()) {
        console.log('📧 Enviando email real usando EmailJS...');

        // Enviar email real usando EmailJS
        const templateParams = {
          email: email, // Variable que usa el template OTP
          passcode: code, // Variable que usa el template OTP
          app_name: 'AXYRA',
          // Configuración adicional para mejor entrega
          from_name: 'AXYRA Sistema',
          reply_to: 'axyra.app@gmail.com',
          subject: `Código de verificación AXYRA - ${code}`,
        };

        const result = await emailjs.send(
          'service_11ie3vq', // Service ID de Gmail configurado (NUEVO)
          'template_1jkao1i', // Template ID de verificación AXYRA (NUEVO)
          templateParams
        );

        console.log('✅ Email de verificación enviado usando EmailJS:', result);
        console.log('📧 Detalles del envío:', {
          serviceId: 'service_11ie3vq',
          templateId: 'template_1jkao1i',
          email: email,
          code: code,
          result: result,
        });

        return { success: true, message: 'Código enviado a tu email' };
      } else {
        // Verificación simulada
        console.log('📧 [SIMULADO] Código de verificación enviado a:', email);
        console.log('🔑 Código:', code);
        console.log('⏰ Válido hasta:', expiresAt.toLocaleTimeString());

        return {
          success: true,
          message: 'Código enviado a tu email (modo simulado)',
          simulatedCode: code, // Solo para desarrollo
        };
      }
    } catch (error) {
      console.error('❌ Error enviando email de verificación:', error);
      console.error('📧 Detalles del error:', {
        error: error.message,
        status: error.status,
        text: error.text,
        email: email,
        username: username,
      });

      // Fallback a verificación simulada
      const code = this.generateVerificationCode();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      this.verificationCodes.set(email, {
        code: code,
        username: username,
        expiresAt: expiresAt,
      });

      console.log('📧 [FALLBACK] Código de verificación:', code);

      return {
        success: true,
        message: 'Código enviado (modo fallback)',
        simulatedCode: code,
        error: error.message,
      };
    }
  }

  // Verificar código
  verifyCode(email, code) {
    try {
      const verificationData = this.verificationCodes.get(email);

      if (!verificationData) {
        return { success: false, message: 'No hay código de verificación para este email' };
      }

      if (new Date() > verificationData.expiresAt) {
        this.verificationCodes.delete(email);
        return { success: false, message: 'El código ha expirado' };
      }

      if (verificationData.code === code) {
        // Código válido, eliminar de la lista temporal
        this.verificationCodes.delete(email);
        return { success: true, message: 'Código verificado correctamente' };
      } else {
        return { success: false, message: 'Código incorrecto' };
      }
    } catch (error) {
      console.error('❌ Error verificando código:', error);
      return { success: false, message: 'Error al verificar el código' };
    }
  }

  // Enviar email de bienvenida
  async sendWelcomeEmail(email, username) {
    try {
      if (this.isEmailJSAvailable()) {
        console.log('📧 Enviando email de bienvenida usando EmailJS...');

        const templateParams = {
          email: email, // Variable que usa el template OTP
          passcode: 'VERIFICADO', // Indicador de cuenta verificada
          app_name: 'AXYRA',
          welcome_message: '¡Bienvenido a AXYRA! Tu cuenta ha sido verificada exitosamente.',
        };

        const result = await emailjs.send(
          'service_11ie3vq', // Service ID de Gmail configurado (NUEVO)
          'template_1jkao1i', // Template ID de verificación AXYRA (NUEVO)
          templateParams
        );

        console.log('✅ Email de bienvenida enviado:', result);
        return { success: true };
      } else {
        console.log('📧 [SIMULADO] Email de bienvenida enviado a:', email);
        return { success: true };
      }
    } catch (error) {
      console.error('❌ Error enviando email de bienvenida:', error);
      return { success: false, error: error.message };
    }
  }

  // Marcar usuario como verificado
  markUserAsVerified(email) {
    try {
      const verificationData = this.verificationCodes.get(email);
      if (verificationData) {
        // Marcar como verificado en Firestore
        if (window.axyraFirebaseDataSystem && window.axyraFirebaseDataSystem.currentUser) {
          window.axyraFirebaseDataSystem.db
            .collection('users')
            .doc(window.axyraFirebaseDataSystem.currentUser.uid)
            .update({
              emailVerified: true,
              verifiedAt: new Date().toISOString(),
            });
        }

        console.log('✅ Usuario marcado como verificado:', email);
        return { success: true };
      } else {
        return { success: false, message: 'Usuario no encontrado para verificación' };
      }
    } catch (error) {
      console.error('❌ Error marcando usuario como verificado:', error);
      return { success: false, error: error.message };
    }
  }

  // Obtener estado del sistema
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      emailService: this.emailService,
      activeCodes: this.verificationCodes.size,
      hasEmailJS: typeof emailjs !== 'undefined',
      emailJSFunctions: {
        init: typeof emailjs?.init === 'function',
        send: typeof emailjs?.send === 'function',
      },
      emailJSAvailable: this.isEmailJSAvailable(),
    };
  }

  // Configurar servicio de email
  setEmailService(service) {
    this.emailService = service;
    console.log('✅ Servicio de email cambiado a:', service);
  }
}

// Instancia global
const axyraRealEmailVerification = new AXYRARealEmailVerification();

// Exportar para uso en otros módulos
window.AXYRARealEmailVerification = AXYRARealEmailVerification;
window.axyraRealEmailVerification = axyraRealEmailVerification;
