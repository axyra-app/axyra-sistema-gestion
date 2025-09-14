/**
 * AXYRA Auth Manager - Sistema de Gestión de Autenticación Simplificado
 * Maneja el estado de autenticación del usuario y evita logout automático
 */

class AxyraAuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    init() {
        console.log('🔐 Inicializando AXYRA Auth Manager...');
        this.checkAuthStatus();
        console.log('✅ AXYRA Auth Manager inicializado');
    }

    checkAuthStatus() {
        try {
            console.log('🔍 Verificando estado de autenticación...');
            
            // Verificar localStorage primero
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    if (user && user.uid) {
                        this.currentUser = user;
                        this.isAuthenticated = true;
                        console.log('✅ Usuario autenticado desde localStorage:', user.email || user.username);
                        return true;
                    }
                } catch (parseError) {
                    console.warn('⚠️ Error parseando usuario de localStorage:', parseError);
                }
            }

            // Verificar Firebase si está disponible
            if (typeof firebase !== 'undefined' && firebase.auth) {
                const user = firebase.auth().currentUser;
                if (user) {
                    console.log('✅ Usuario autenticado desde Firebase');
                    
                    // Crear usuario en formato dashboard
                    const userInfo = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0],
                        username: user.email.split('@')[0],
                        photoURL: user.photoURL || null,
                        provider: 'firebase',
                        hasPassword: true,
                        emailVerified: user.emailVerified,
                        id: user.uid,
                        isAuthenticated: true
                    };
                    
                    // Guardar en localStorage
                    localStorage.setItem('axyra_isolated_user', JSON.stringify(userInfo));
                    this.currentUser = userInfo;
                    this.isAuthenticated = true;
                    return true;
                }
            }

            console.log('❌ No se encontró usuario autenticado');
            this.isAuthenticated = false;
            this.currentUser = null;
            return false;
            
        } catch (error) {
            console.error('❌ Error verificando estado de autenticación:', error);
            return false;
        }
    }

    // Método público para verificar si el usuario está autenticado
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    // Método público para obtener el usuario actual
    getCurrentUser() {
        return this.currentUser;
    }

    // Método público para forzar verificación de autenticación
    forceAuthCheck() {
        return this.checkAuthStatus();
    }
}

// Inicializar Auth Manager cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando AXYRA Auth Manager...');
    try {
        window.axyraAuthManager = new AxyraAuthManager();
    } catch (error) {
        console.error('❌ Error inicializando Auth Manager:', error);
    }
});

// Hacer disponible globalmente
window.AxyraAuthManager = AxyraAuthManager;
