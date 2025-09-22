/**
 * 🎯 HEADER BRUTAL - AXYRA SISTEMA DE GESTIÓN
 * Header moderno, funcional y brutal
 */

class AdvancedHeader {
    constructor() {
        this.header = null;
        this.user = null;
        this.companyId = null;
        this.notifications = [];
        this.init();
    }

    async init() {
        await this.loadUserAndCompany();
        this.createHeader();
        this.setupEventListeners();
        this.updateConnectionStatus();
        this.loadNotifications();
        console.log('🎯 Header brutal inicializado');
    }

    async loadUserAndCompany() {
        // Cargar datos del usuario desde localStorage o Firebase
        this.user = {
            displayName: localStorage.getItem('userName') || 'Usuario',
            email: localStorage.getItem('userEmail') || 'usuario@empresa.com',
            photoURL: localStorage.getItem('userPhoto') || 'https://via.placeholder.com/32x32/007bff/ffffff?text=U'
        };
        this.companyId = localStorage.getItem('companyId') || 'default';
    }

    createHeader() {
        // Crear el header si no existe
        if (!document.querySelector('.advanced-header')) {
            this.header = document.createElement('header');
            this.header.className = 'advanced-header';
            document.body.insertBefore(this.header, document.body.firstChild);
        } else {
            this.header = document.querySelector('.advanced-header');
        }

        this.renderHeader();
    }

    renderHeader() {
        const userName = this.user ? this.user.displayName : 'Usuario';
        const userEmail = this.user ? this.user.email : 'usuario@empresa.com';
        const userPhoto = this.user && this.user.photoURL ? this.user.photoURL : 'https://via.placeholder.com/32x32/007bff/ffffff?text=U';
        const notificationCount = this.getNotificationCount();

        this.header.innerHTML = `
          <div class="header-left">
            <div class="logo-container">
              <img src="static/logo-axyra.svg" alt="AXYRA" class="logo">
              <span class="system-name">AXYRA</span>
              <span class="system-version">v2.0</span>
            </div>
          </div>
          <div class="header-center">
            <div class="search-container">
              <input type="text" id="global-search" placeholder="Buscar empleados, nóminas, movimientos..." class="search-input">
              <button class="search-btn" id="search-btn">
                <i class="fas fa-search"></i>
              </button>
              <div class="search-results" id="search-results"></div>
            </div>
          </div>
          <div class="header-right">
            <div class="connection-status" id="connection-status">
              <i class="fas fa-wifi" id="connection-icon"></i>
              <span id="connection-text">Online</span>
            </div>
            <div class="notifications-container">
              <button class="notification-btn" id="notification-btn">
                <i class="fas fa-bell"></i>
                <span class="notification-badge" id="notification-badge">${notificationCount > 0 ? notificationCount : ''}</span>
              </button>
              <div class="notifications-dropdown" id="notifications-dropdown">
                <div class="notifications-header">
                  <h3>Notificaciones</h3>
                  <button class="mark-all-read" id="mark-all-read">Marcar todas como leídas</button>
                </div>
                <div class="notifications-list" id="notifications-list">
                  <div class="no-notifications">No hay notificaciones</div>
                </div>
              </div>
            </div>
            <div class="ai-chat-container">
              <button class="ai-chat-btn" id="ai-chat-btn">
                <i class="fas fa-robot"></i>
                <span class="ai-indicator" id="ai-indicator"></span>
              </button>
            </div>
            <div class="user-profile-container">
              <button class="user-profile-btn" id="user-profile-btn">
                <img src="${userPhoto}" alt="Usuario" class="user-avatar" id="user-avatar">
                <span class="user-name" id="user-name">${userName}</span>
                <i class="fas fa-chevron-down"></i>
              </button>
              <div class="user-dropdown" id="user-dropdown">
                <div class="user-info">
                  <img src="${userPhoto}" alt="Usuario" class="user-avatar-large">
                  <div class="user-details">
                    <div class="user-name-large" id="user-name-large">${userName}</div>
                    <div class="user-email" id="user-email">${userEmail}</div>
                    <div class="user-role" id="user-role">Administrador</div>
                  </div>
                </div>
                <div class="user-menu">
                  <a href="#" class="menu-item" id="profile-settings">
                    <i class="fas fa-user-cog"></i>
                    Configuración de Perfil
                  </a>
                  <a href="#" class="menu-item" id="system-settings">
                    <i class="fas fa-cog"></i>
                    Configuración del Sistema
                  </a>
                  <a href="#" class="menu-item" id="help-support">
                    <i class="fas fa-question-circle"></i>
                    Ayuda y Soporte
                  </a>
                  <div class="menu-divider"></div>
                  <a href="#" class="menu-item logout" id="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                  </a>
                </div>
              </div>
            </div>
          </div>
        `;
    }

    setupEventListeners() {
        // Búsqueda global
        const searchInput = this.header.querySelector('#global-search');
        const searchBtn = this.header.querySelector('#search-btn');
        const searchResults = this.header.querySelector('#search-results');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(e.target.value);
                }
            });

            searchInput.addEventListener('focus', () => {
                this.showSearchResults();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput?.value || '';
                this.performSearch(query);
            });
        }

        // Notificaciones
        const notificationBtn = this.header.querySelector('#notification-btn');
        const notificationsDropdown = this.header.querySelector('#notifications-dropdown');
        const markAllRead = this.header.querySelector('#mark-all-read');

        if (notificationBtn) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsDropdown.classList.toggle('active');
                this.header.querySelector('#user-dropdown').classList.remove('active');
            });
        }

        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
            });
        }

        // Chat IA
        const aiChatBtn = this.header.querySelector('#ai-chat-btn');
        if (aiChatBtn) {
            aiChatBtn.addEventListener('click', () => {
                this.openAIChat();
            });
        }

        // Perfil de usuario
        const userProfileBtn = this.header.querySelector('#user-profile-btn');
        const userDropdown = this.header.querySelector('#user-dropdown');
        const logoutBtn = this.header.querySelector('#logout-btn');
        const profileSettings = this.header.querySelector('#profile-settings');
        const systemSettings = this.header.querySelector('#system-settings');
        const helpSupport = this.header.querySelector('#help-support');

        if (userProfileBtn) {
            userProfileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
                notificationsDropdown.classList.remove('active');
            });
        }

        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }

        if (profileSettings) {
            profileSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.openProfileSettings();
            });
        }

        if (systemSettings) {
            systemSettings.addEventListener('click', (e) => {
                e.preventDefault();
                this.openSystemSettings();
            });
        }

        if (helpSupport) {
            helpSupport.addEventListener('click', (e) => {
                e.preventDefault();
                this.openHelpSupport();
            });
        }

        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notifications-container')) {
                notificationsDropdown.classList.remove('active');
            }
            if (!e.target.closest('.user-profile-container')) {
                userDropdown.classList.remove('active');
            }
            if (!e.target.closest('.search-container')) {
                searchResults.classList.remove('active');
            }
        });

        // Estado de conexión
        window.addEventListener('online', () => this.updateConnectionStatus());
        window.addEventListener('offline', () => this.updateConnectionStatus());
    }

    async handleSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        console.log('🔍 Buscando:', query);
        
        // Simular búsqueda con datos de ejemplo
        const results = await this.searchData(query);
        this.displaySearchResults(results);
    }

    async searchData(query) {
        // Simular datos de búsqueda
        const mockData = [
            {
                type: 'empleado',
                title: 'Juan Pérez',
                description: 'Desarrollador - Tecnología',
                icon: 'fas fa-user',
                link: '/modulos/gestion_personal/gestion_personal.html#empleados'
            },
            {
                type: 'nomina',
                title: 'Nómina Enero 2024',
                description: 'Total: $2,500,000',
                icon: 'fas fa-calculator',
                link: '/modulos/gestion_personal/gestion_personal.html#nomina'
            },
            {
                type: 'movimiento',
                title: 'Pago de servicios',
                description: 'Egreso - $150,000',
                icon: 'fas fa-cash-register',
                link: '/modulos/cuadre_caja/index.html'
            }
        ];

        return mockData.filter(item => 
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    displaySearchResults(results) {
        const searchResults = this.header.querySelector('#search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="no-results">No se encontraron resultados</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-link="${result.link}">
                    <div class="search-result-icon">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="search-result-content">
                        <div class="search-result-title">${result.title}</div>
                        <div class="search-result-description">${result.description}</div>
                        <div class="search-result-type">${result.type.toUpperCase()}</div>
                    </div>
                </div>
            `).join('');

            // Agregar event listeners a los resultados
            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('click', () => {
                    const link = item.dataset.link;
                    if (link) {
                        window.location.href = link;
                    }
                });
            });
        }

        searchResults.classList.add('active');
    }

    showSearchResults() {
        const searchResults = this.header.querySelector('#search-results');
        searchResults.classList.add('active');
    }

    hideSearchResults() {
        const searchResults = this.header.querySelector('#search-results');
        searchResults.classList.remove('active');
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        console.log('🔍 Realizando búsqueda:', query);
        this.handleSearch(query);
        
        // Mostrar notificación
        this.showNotification('Búsqueda realizada', `Se encontraron resultados para "${query}"`, 'info');
    }

    loadNotifications() {
        // Cargar notificaciones desde localStorage
        const stored = localStorage.getItem('axyra_notifications');
        this.notifications = stored ? JSON.parse(stored) : [];
        this.updateNotificationBadge();
        this.renderNotifications();
    }

    getNotificationCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    updateNotificationBadge() {
        const badge = this.header.querySelector('#notification-badge');
        const count = this.getNotificationCount();
        
        if (badge) {
            badge.textContent = count > 0 ? count : '';
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    renderNotifications() {
        const notificationsList = this.header.querySelector('#notifications-list');
        
        if (this.notifications.length === 0) {
            notificationsList.innerHTML = '<div class="no-notifications">No hay notificaciones</div>';
            return;
        }

        notificationsList.innerHTML = this.notifications.map(notif => `
            <div class="notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-message">${notif.message}</div>
                    <div class="notification-time">${this.formatTimeAgo(notif.timestamp)}</div>
                </div>
            </div>
        `).join('');

        // Agregar event listeners
        notificationsList.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.markNotificationAsRead(id);
            });
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
            this.updateNotificationBadge();
            this.renderNotifications();
        }
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
        localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
        this.updateNotificationBadge();
        this.renderNotifications();
        this.showNotification('Notificaciones marcadas como leídas', '', 'success');
    }

    showNotification(message, description = '', type = 'info') {
        const notification = {
            id: Date.now().toString(),
            message,
            description,
            type,
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);
        localStorage.setItem('axyra_notifications', JSON.stringify(this.notifications));
        this.updateNotificationBadge();
        this.renderNotifications();
    }

    updateConnectionStatus() {
        const connectionIcon = this.header.querySelector('#connection-icon');
        const connectionText = this.header.querySelector('#connection-text');
        
        if (navigator.onLine) {
            connectionIcon.className = 'fas fa-wifi';
            connectionText.textContent = 'Online';
            connectionIcon.style.color = '#4ade80';
        } else {
            connectionIcon.className = 'fas fa-wifi-slash';
            connectionText.textContent = 'Offline';
            connectionIcon.style.color = '#ef4444';
        }
    }

    openAIChat() {
        // Abrir chat de IA si está disponible
        if (window.axyraAIChatSystem) {
            window.axyraAIChatSystem.toggleChatWindow();
        } else {
            this.showNotification('Chat de IA no disponible', 'El sistema de chat está cargando...', 'warning');
        }
    }

    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Limpiar datos locales
            localStorage.clear();
            
            // Redirigir al login
            window.location.href = '/login.html';
        }
    }

    openProfileSettings() {
        this.showNotification('Configuración de perfil', 'Esta funcionalidad estará disponible pronto', 'info');
    }

    openSystemSettings() {
        this.showNotification('Configuración del sistema', 'Esta funcionalidad estará disponible pronto', 'info');
    }

    openHelpSupport() {
        this.showNotification('Ayuda y soporte', 'Esta funcionalidad estará disponible pronto', 'info');
    }

    formatTimeAgo(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        if (days < 30) return `${days}d`;
        const months = Math.floor(days / 30);
        if (months < 12) return `${months}m`;
        const years = Math.floor(months / 12);
        return `${years}a`;
    }
}

// Inicializar header cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.axyraAdvancedHeader = new AdvancedHeader();
});

// Exportar para uso global
window.AdvancedHeader = AdvancedHeader;