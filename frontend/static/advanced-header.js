/**
 * 🎯 HEADER AVANZADO - AXYRA SISTEMA DE GESTIÓN
 * 
 * Header completo con navegación, notificaciones, perfil de usuario
 * y funcionalidades avanzadas del sistema.
 */

class AdvancedHeader {
    constructor() {
        this.notifications = [];
        this.user = null;
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        this.createHeaderHTML();
        this.setupEventListeners();
        this.loadUserData();
        this.setupNotifications();
        this.setupOnlineStatus();
        console.log('🎯 Header avanzado inicializado');
    }

    createHeaderHTML() {
        const headerHTML = `
            <header class="advanced-header">
                <!-- Logo y Título -->
                <div class="header-left">
                    <div class="logo-container">
                        <img src="logo.png" alt="AXYRA" class="logo">
                        <span class="system-name">AXYRA</span>
                        <span class="system-version">v2.0</span>
                    </div>
                </div>

                <!-- Barra de Búsqueda -->
                <div class="header-center">
                    <div class="search-container">
                        <input type="text" id="global-search" placeholder="Buscar empleados, nóminas, movimientos..." class="search-input">
                        <button class="search-btn" id="search-btn">
                            <i class="fas fa-search"></i>
                        </button>
                        <div class="search-results" id="search-results"></div>
                    </div>
                </div>

                <!-- Funcionalidades del Header -->
                <div class="header-right">
                    <!-- Estado de Conexión -->
                    <div class="connection-status" id="connection-status">
                        <i class="fas fa-wifi" id="connection-icon"></i>
                        <span id="connection-text">Online</span>
                    </div>

                    <!-- Notificaciones -->
                    <div class="notifications-container">
                        <button class="notification-btn" id="notification-btn">
                            <i class="fas fa-bell"></i>
                            <span class="notification-badge" id="notification-badge">0</span>
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

                    <!-- Chat IA -->
                    <div class="ai-chat-container">
                        <button class="ai-chat-btn" id="ai-chat-btn">
                            <i class="fas fa-robot"></i>
                            <span class="ai-indicator" id="ai-indicator"></span>
                        </button>
                    </div>

                    <!-- Perfil de Usuario -->
                    <div class="user-profile-container">
                        <button class="user-profile-btn" id="user-profile-btn">
                            <img src="https://via.placeholder.com/32x32/007bff/ffffff?text=U" alt="Usuario" class="user-avatar" id="user-avatar">
                            <span class="user-name" id="user-name">Usuario</span>
                            <i class="fas fa-chevron-down"></i>
                        </button>
                        <div class="user-dropdown" id="user-dropdown">
                            <div class="user-info">
                                <img src="https://via.placeholder.com/48x48/007bff/ffffff?text=U" alt="Usuario" class="user-avatar-large">
                                <div class="user-details">
                                    <div class="user-name-large" id="user-name-large">Usuario</div>
                                    <div class="user-email" id="user-email">usuario@empresa.com</div>
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

                    <!-- Menú Móvil -->
                    <button class="mobile-menu-btn" id="mobile-menu-btn">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </header>

            <!-- Chat IA Flotante -->
            <div class="ai-chat-window" id="ai-chat-window">
                <div class="ai-chat-header">
                    <div class="ai-chat-title">
                        <i class="fas fa-robot"></i>
                        <span>Asistente IA</span>
                        <div class="ai-status" id="ai-status">Disponible</div>
                    </div>
                    <button class="ai-chat-close" id="ai-chat-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="ai-chat-messages" id="ai-chat-messages">
                    <div class="ai-message">
                        <div class="ai-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="ai-message-content">
                            <p>¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?</p>
                        </div>
                    </div>
                </div>
                <div class="ai-chat-input-container">
                    <input type="text" id="ai-chat-input" placeholder="Escribe tu pregunta..." class="ai-chat-input">
                    <button id="ai-chat-send" class="ai-chat-send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>

            <!-- Overlay para móvil -->
            <div class="mobile-overlay" id="mobile-overlay"></div>
        `;

        // Insertar header al inicio del body
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    setupEventListeners() {
        // Búsqueda global
        const searchInput = document.getElementById('global-search');
        const searchBtn = document.getElementById('search-btn');
        const searchResults = document.getElementById('search-results');

        searchInput.addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });

        searchBtn.addEventListener('click', () => {
            this.performSearch(searchInput.value);
        });

        // Notificaciones
        const notificationBtn = document.getElementById('notification-btn');
        const notificationsDropdown = document.getElementById('notifications-dropdown');
        const markAllRead = document.getElementById('mark-all-read');

        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotifications();
        });

        markAllRead.addEventListener('click', () => {
            this.markAllNotificationsAsRead();
        });

        // Chat IA
        const aiChatBtn = document.getElementById('ai-chat-btn');
        const aiChatWindow = document.getElementById('ai-chat-window');
        const aiChatClose = document.getElementById('ai-chat-close');
        const aiChatSend = document.getElementById('ai-chat-send');
        const aiChatInput = document.getElementById('ai-chat-input');

        aiChatBtn.addEventListener('click', () => {
            this.toggleAIChat();
        });

        aiChatClose.addEventListener('click', () => {
            this.closeAIChat();
        });

        aiChatSend.addEventListener('click', () => {
            this.sendAIMessage();
        });

        aiChatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAIMessage();
            }
        });

        // Perfil de usuario
        const userProfileBtn = document.getElementById('user-profile-btn');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutBtn = document.getElementById('logout-btn');

        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserDropdown();
        });

        logoutBtn.addEventListener('click', () => {
            this.logout();
        });

        // Menú móvil
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileOverlay = document.getElementById('mobile-overlay');

        mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        mobileOverlay.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.notifications-container')) {
                this.closeNotifications();
            }
            if (!e.target.closest('.user-profile-container')) {
                this.closeUserDropdown();
            }
        });
    }

    loadUserData() {
        try {
            const userData = JSON.parse(localStorage.getItem('axyra_user_data') || '{}');
            this.user = userData;
            
            if (userData.uid) {
                document.getElementById('user-name').textContent = userData.displayName || 'Usuario';
                document.getElementById('user-name-large').textContent = userData.displayName || 'Usuario';
                document.getElementById('user-email').textContent = userData.email || 'usuario@empresa.com';
                document.getElementById('user-role').textContent = userData.role || 'Administrador';
            }
        } catch (error) {
            console.error('Error cargando datos de usuario:', error);
        }
    }

    setupNotifications() {
        // Simular notificaciones de ejemplo
        this.notifications = [
            {
                id: 1,
                title: 'Nueva nómina generada',
                message: 'Se ha generado la nómina del período actual',
                timestamp: new Date(),
                read: false,
                type: 'success'
            },
            {
                id: 2,
                title: 'Corte de caja pendiente',
                message: 'El corte de caja del día anterior está pendiente',
                timestamp: new Date(Date.now() - 3600000),
                read: false,
                type: 'warning'
            },
            {
                id: 3,
                title: 'Sistema actualizado',
                message: 'AXYRA se ha actualizado a la versión 2.0',
                timestamp: new Date(Date.now() - 7200000),
                read: true,
                type: 'info'
            }
        ];

        this.updateNotificationsDisplay();
    }

    setupOnlineStatus() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.updateConnectionStatus();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.updateConnectionStatus();
        });

        this.updateConnectionStatus();
    }

    updateConnectionStatus() {
        const connectionIcon = document.getElementById('connection-icon');
        const connectionText = document.getElementById('connection-text');

        if (this.isOnline) {
            connectionIcon.className = 'fas fa-wifi';
            connectionText.textContent = 'Online';
            connectionIcon.style.color = '#28a745';
        } else {
            connectionIcon.className = 'fas fa-wifi-slash';
            connectionText.textContent = 'Offline';
            connectionIcon.style.color = '#dc3545';
        }
    }

    handleGlobalSearch(query) {
        if (query.length < 2) {
            this.hideSearchResults();
            return;
        }

        // Simular búsqueda
        const results = this.performSearch(query);
        this.showSearchResults(results);
    }

    performSearch(query) {
        // Aquí implementarías la búsqueda real
        console.log('Buscando:', query);
        return [];
    }

    showSearchResults(results) {
        const searchResults = document.getElementById('search-results');
        searchResults.style.display = 'block';
        // Implementar resultados de búsqueda
    }

    hideSearchResults() {
        const searchResults = document.getElementById('search-results');
        searchResults.style.display = 'none';
    }

    toggleNotifications() {
        const dropdown = document.getElementById('notifications-dropdown');
        dropdown.classList.toggle('show');
    }

    closeNotifications() {
        const dropdown = document.getElementById('notifications-dropdown');
        dropdown.classList.remove('show');
    }

    updateNotificationsDisplay() {
        const unreadCount = this.notifications.filter(n => !n.read).length;
        const badge = document.getElementById('notification-badge');
        const list = document.getElementById('notifications-list');

        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'block' : 'none';

        if (this.notifications.length === 0) {
            list.innerHTML = '<div class="no-notifications">No hay notificaciones</div>';
            return;
        }

        list.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
                </div>
            </div>
        `).join('');

        // Agregar event listeners a las notificaciones
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = parseInt(item.dataset.id);
                this.markNotificationAsRead(id);
            });
        });
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            error: 'times-circle',
            info: 'info-circle'
        };
        return icons[type] || 'bell';
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Ahora';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        return `${days}d`;
    }

    markNotificationAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.updateNotificationsDisplay();
        }
    }

    markAllNotificationsAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.updateNotificationsDisplay();
    }

    toggleAIChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        chatWindow.classList.toggle('show');
        
        if (chatWindow.classList.contains('show')) {
            document.getElementById('ai-chat-input').focus();
        }
    }

    closeAIChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        chatWindow.classList.remove('show');
    }

    sendAIMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        // Agregar mensaje del usuario
        this.addChatMessage(message, 'user');
        input.value = '';

        // Simular respuesta de IA
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addChatMessage(response, 'ai');
        }, 1000);
    }

    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `${sender}-message`;
        
        const avatar = sender === 'user' ? 
            '<div class="user-avatar"><i class="fas fa-user"></i></div>' :
            '<div class="ai-avatar"><i class="fas fa-robot"></i></div>';

        messageDiv.innerHTML = `
            ${avatar}
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    generateAIResponse(message) {
        const responses = [
            'Entiendo tu consulta. Te ayudo con eso.',
            'Excelente pregunta. Aquí tienes la información que necesitas.',
            'Perfecto, puedo ayudarte con esa funcionalidad.',
            'Esa es una característica importante del sistema.',
            'Te explico cómo funciona esa parte del sistema.'
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    toggleUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        dropdown.classList.toggle('show');
    }

    closeUserDropdown() {
        const dropdown = document.getElementById('user-dropdown');
        dropdown.classList.remove('show');
    }

    toggleMobileMenu() {
        const overlay = document.getElementById('mobile-overlay');
        overlay.classList.toggle('show');
    }

    closeMobileMenu() {
        const overlay = document.getElementById('mobile-overlay');
        overlay.classList.remove('show');
    }

    logout() {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            // Limpiar datos locales
            localStorage.removeItem('axyra_user_data');
            localStorage.removeItem('axyra_analytics_events');
            
            // Redirigir al login
            window.location.href = '/login.html';
        }
    }
}

// Inicializar header cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new AdvancedHeader();
});

// Exportar para uso global
window.AdvancedHeader = AdvancedHeader;
