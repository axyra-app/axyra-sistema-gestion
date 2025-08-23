/**
 * AXYRA Auth Manager - Sistema de Gestión de Autenticación Centralizado
 * Maneja el estado de autenticación del usuario y evita logout automático
 */

class AxyraAuthManager {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.authCheckInterval = null;
        this.init();
    }

    init() {
        console.log('🔐 Inicializando AXYRA Auth Manager...');
        this.checkAuthStatus();
        this.startAuthMonitoring();
        this.setupEventListeners();
        console.log('✅ AXYRA Auth Manager inicializado');
    }

    checkAuthStatus() {
        try {
            console.log('🔍 Verificando estado de autenticación...');
            
            // Verificar múltiples fuentes de autenticación
            const authSources = [
                this.checkLocalStorageAuth(),
                this.checkSessionStorageAuth(),
                this.checkFirebaseAuth()
            ];

            // Si al menos una fuente es válida, el usuario está autenticado
            const validAuth = authSources.find(source => source !== null);
            
            if (validAuth) {
                this.currentUser = validAuth;
                this.isAuthenticated = true;
                console.log('✅ Usuario autenticado:', this.currentUser.email || this.currentUser.username);
                this.updateUIForAuthenticatedUser();
                return true;
            } else {
                console.log('❌ No se encontró usuario autenticado');
                this.isAuthenticated = false;
                this.currentUser = null;
                this.updateUIForUnauthenticatedUser();
                return false;
            }
        } catch (error) {
            console.error('❌ Error verificando estado de autenticación:', error);
            return false;
        }
    }

    checkLocalStorageAuth() {
        try {
            const userData = localStorage.getItem('axyra_isolated_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user && user.isAuthenticated && user.uid) {
                    console.log('✅ Usuario autenticado desde localStorage');
                    return user;
                }
            }
            return null;
        } catch (error) {
            console.warn('⚠️ Error verificando localStorage:', error);
            return null;
        }
    }

    checkSessionStorageAuth() {
        try {
            const userData = sessionStorage.getItem('axyra_firebase_user');
            if (userData) {
                const user = JSON.parse(userData);
                if (user && user.uid) {
                    console.log('✅ Usuario autenticado desde sessionStorage');
                    
                    // Convertir a formato dashboard
                    const userInfo = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName || user.email.split('@')[0],
                        username: user.email.split('@')[0],
                        photoURL: user.photoURL || null,
                        provider: 'session',
                        hasPassword: true,
                        emailVerified: user.emailVerified || false,
                        id: user.uid,
                        isAuthenticated: true
                    };
                    
                    // Guardar en localStorage para persistencia
                    localStorage.setItem('axyra_isolated_user', JSON.stringify(userInfo));
                    return userInfo;
                }
            }
            return null;
        } catch (error) {
            console.warn('⚠️ Error verificando sessionStorage:', error);
            return null;
        }
    }

    async checkFirebaseAuth() {
        try {
            if (typeof firebase !== 'undefined' && firebase.auth) {
                const user = firebase.auth().currentUser;
                if (user) {
                    console.log('✅ Usuario autenticado desde Firebase');
                    
                    // Convertir a formato dashboard
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
                    
                    // Guardar en localStorage para persistencia
                    localStorage.setItem('axyra_isolated_user', JSON.stringify(userInfo));
                    return userInfo;
                }
            }
            return null;
        } catch (error) {
            console.warn('⚠️ Error verificando Firebase:', error);
            return null;
        }
    }

    updateUIForAuthenticatedUser() {
        try {
            // Actualizar elementos de la UI que muestran información del usuario
            const userEmailElement = document.getElementById('userEmail');
            if (userEmailElement && this.currentUser) {
                userEmailElement.textContent = this.currentUser.email || this.currentUser.username || 'Usuario';
            }

            // Actualizar badge de rol si existe
            const roleBadge = document.getElementById('roleBadge');
            if (roleBadge) {
                this.updateRoleBadge(roleBadge);
            }

            // Ocultar mensajes de login si existen
            const loginMessage = document.querySelector('.axyra-login-message');
            if (loginMessage) {
                loginMessage.style.display = 'none';
            }

            console.log('✅ UI actualizada para usuario autenticado');
        } catch (error) {
            console.error('❌ Error actualizando UI para usuario autenticado:', error);
        }
    }

    updateUIForUnauthenticatedUser() {
        try {
            // Mostrar mensaje de login si estamos en el dashboard
            if (window.location.pathname.includes('dashboard')) {
                this.showLoginMessage();
            }
            console.log('✅ UI actualizada para usuario no autenticado');
        } catch (error) {
            console.error('❌ Error actualizando UI para usuario no autenticado:', error);
        }
    }

    updateRoleBadge(roleBadgeElement) {
        try {
            if (!roleBadgeElement || !this.currentUser) return;
            
            // Determinar el rol del usuario
            let userRole = 'Empleado';
            let roleIcon = 'fas fa-user-shield';
            
            if (this.currentUser.rol === 'admin' || this.currentUser.rol === 'administrador') {
                userRole = 'Administrador';
                roleIcon = 'fas fa-user-crown';
            } else if (this.currentUser.rol === 'supervisor') {
                userRole = 'Supervisor';
                roleIcon = 'fas fa-user-tie';
            }
            
            // Actualizar el badge
            const roleIconElement = roleBadgeElement.querySelector('i');
            const roleTextElement = roleBadgeElement.querySelector('.axyra-role-badge-text');
            
            if (roleIconElement) {
                roleIconElement.className = roleIcon;
            }
            
            if (roleTextElement) {
                roleTextElement.textContent = userRole;
            }
            
        } catch (error) {
            console.error('❌ Error actualizando badge de rol:', error);
        }
    }

    showLoginMessage() {
        try {
            const container = document.querySelector('.axyra-dashboard-container');
            if (container) {
                container.innerHTML = `
                    <div class="axyra-login-message" style="text-align: center; padding: 60px 20px;">
                        <div style="max-width: 400px; margin: 0 auto;">
                            <i class="fas fa-lock" style="font-size: 48px; color: #667eea; margin-bottom: 20px;"></i>
                            <h2 style="color: #333; margin-bottom: 16px;">Inicia sesión para continuar</h2>
                            <p style="color: #666; margin-bottom: 24px;">Necesitas autenticarte para acceder al dashboard</p>
                            <a href="../../login.html" class="axyra-btn axyra-btn-primary" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
                                Ir al Login
                            </a>
                        </div>
                    </div>
                `;
            }
        } catch (error) {
            console.error('❌ Error mostrando mensaje de login:', error);
        }
    }

    startAuthMonitoring() {
        try {
            // Verificar autenticación cada 30 segundos
            this.authCheckInterval = setInterval(() => {
                this.checkAuthStatus();
            }, 30000);

            // Escuchar cambios en localStorage
            window.addEventListener('storage', (e) => {
                if (e.key === 'axyra_isolated_user' || e.key === 'axyra_firebase_user') {
                    console.log('🔄 Cambio detectado en autenticación, verificando...');
                    this.checkAuthStatus();
                }
            });

            // Escuchar eventos de Firebase Auth
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().onAuthStateChanged((user) => {
                    if (user) {
                        console.log('🔄 Estado de Firebase Auth cambiado, usuario autenticado');
                        this.checkAuthStatus();
                    } else {
                        console.log('🔄 Estado de Firebase Auth cambiado, usuario no autenticado');
                        this.checkAuthStatus();
                    }
                });
            }

            console.log('✅ Monitoreo de autenticación iniciado');
        } catch (error) {
            console.error('❌ Error iniciando monitoreo de autenticación:', error);
        }
    }

    setupEventListeners() {
        try {
            // Escuchar clics en botones de logout
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-action="logout"]') || e.target.closest('[data-action="logout"]')) {
                    e.preventDefault();
                    this.logout();
                }
            });

            // Escuchar eventos de teclado para mantener sesión activa
            document.addEventListener('keydown', () => {
                this.resetSessionTimeout();
            });

            document.addEventListener('mousemove', () => {
                this.resetSessionTimeout();
            });

            console.log('✅ Event listeners configurados');
        } catch (error) {
            console.error('❌ Error configurando event listeners:', error);
        }
    }

    resetSessionTimeout() {
        try {
            // Actualizar timestamp de actividad
            if (this.isAuthenticated) {
                localStorage.setItem('axyra_last_activity', Date.now().toString());
            }
        } catch (error) {
            console.warn('⚠️ Error reseteando timeout de sesión:', error);
        }
    }

    logout() {
        try {
            console.log('🚪 Cerrando sesión...');
            
            // Limpiar Firebase Auth
            if (typeof firebase !== 'undefined' && firebase.auth) {
                firebase.auth().signOut();
            }
            
            // Limpiar localStorage
            localStorage.removeItem('axyra_isolated_user');
            localStorage.removeItem('axyra_firebase_user');
            localStorage.removeItem('axyra_isolated_user_id');
            localStorage.removeItem('axyra_remember_me');
            localStorage.removeItem('axyra_session_timestamp');
            localStorage.removeItem('axyra_last_activity');
            
            // Limpiar sessionStorage
            sessionStorage.removeItem('axyra_firebase_user');
            
            // Resetear estado
            this.currentUser = null;
            this.isAuthenticated = false;
            
            // Redirigir al login
            window.location.href = '../../login.html';
            
        } catch (error) {
            console.error('❌ Error durante logout:', error);
            // Forzar redirección
            window.location.href = '../../login.html';
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

    // Limpiar recursos
    destroy() {
        if (this.authCheckInterval) {
            clearInterval(this.authCheckInterval);
        }
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
