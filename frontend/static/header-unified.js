/**
 * 🎯 HEADER UNIFICADO - AXYRA SISTEMA DE GESTIÓN
 * Header consistente basado en el diseño del dashboard
 */

class UnifiedHeader {
    constructor() {
        this.user = null;
        this.companyId = null;
        this.notifications = [];
        this.currentPage = this.detectarPaginaActual();
        this.navigationItems = [
            { href: '../../index.html', icon: 'fas fa-home', text: 'Inicio', show: true },
            { href: '../dashboard/dashboard.html', icon: 'fas fa-tachometer-alt', text: 'Dashboard', show: true },
            { href: '../gestion_personal/gestion_personal.html', icon: 'fas fa-users-cog', text: 'Gestión Personal', show: true },
            { href: '../cuadre_caja/cuadre_caja.html', icon: 'fas fa-calculator', text: 'Caja', show: true },
            { href: '../inventario/inventario.html', icon: 'fas fa-boxes', text: 'Inventario', show: true },
            { href: '../configuracion/configuracion.html', icon: 'fas fa-cog', text: 'Config', show: true }
        ];
        this.init();
    }

    async init() {
        await this.loadUserAndCompany();
        this.createHeader();
        this.setupEventListeners();
        this.updateConnectionStatus();
        this.loadNotifications();
        this.initializeAIChat();
        console.log('🎯 Header unificado inicializado');
    }

    async loadUserAndCompany() {
        // Cargar datos del usuario desde localStorage
        this.user = {
            displayName: localStorage.getItem('userName') || 'Usuario',
            email: localStorage.getItem('userEmail') || 'axyra.app@gmail.com',
            photoURL: localStorage.getItem('userPhoto') || 'https://via.placeholder.com/40x40/667eea/ffffff?text=U',
            role: localStorage.getItem('userRole') || 'Empleado'
        };
        this.companyId = localStorage.getItem('companyId') || 'default';
    }

    createHeader() {
        // Solo crear header si no existe uno personalizado
        if (document.querySelector('.axyra-header')) {
            console.log('Header personalizado detectado, no se creará header unificado');
            return;
        }

        // Crear el header unificado
        this.header = document.createElement('header');
        this.header.className = 'axyra-header';
        document.body.insertBefore(this.header, document.body.firstChild);

        this.renderHeader();
    }

    renderHeader() {
        const userName = this.user ? this.user.displayName : 'Usuario';
        const userEmail = this.user ? this.user.email : 'axyra.app@gmail.com';
        const userRole = this.user ? this.user.role : 'Empleado';
        const notificationCount = this.getNotificationCount();

        this.header.innerHTML = `
          <div class="axyra-header-content">
            <div class="axyra-logo-title">
              <img src="logo.png" alt="AXYRA Logo" class="axyra-logo" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
              <i class="fas fa-building" style="display: none; font-size: 32px; color: #4299e1; margin-right: 12px;" class="axyra-logo-fallback"></i>
              <div class="axyra-title-section">
                <h1 class="axyra-title">AXYRA</h1>
                <span class="axyra-subtitle" id="pageSubtitle">Dashboard</span>
              </div>
              <div class="axyra-role-badge" id="roleBadge">
                <i class="fas fa-user-shield"></i>
                <span class="axyra-role-badge-text">${userRole}</span>
              </div>
            </div>
            
            <nav class="axyra-nav" id="axyraNav">
              <!-- Los enlaces se generarán dinámicamente -->
            </nav>
            
            <div class="axyra-user-section">
              <div class="axyra-search-container">
                <input type="text" id="global-search" placeholder="Buscar empleados, nóminas, movimientos..." class="axyra-search-input">
                <button class="axyra-search-btn" id="search-btn">
                  <i class="fas fa-search"></i>
                </button>
                <div class="axyra-search-results" id="search-results"></div>
              </div>
              
              <div class="axyra-connection-status" id="connection-status">
                <i class="fas fa-wifi" id="connection-icon"></i>
                <span id="connection-text">Online</span>
              </div>
              
              <div class="axyra-notifications-container">
                <button class="axyra-notification-btn" id="notification-btn">
                  <i class="fas fa-bell"></i>
                  <span class="axyra-notification-badge" id="notification-badge">${notificationCount > 0 ? notificationCount : ''}</span>
                </button>
                <div class="axyra-notifications-dropdown" id="notifications-dropdown">
                  <div class="axyra-notifications-header">
                    <h3>Notificaciones</h3>
                    <button class="axyra-mark-all-read" id="mark-all-read">Marcar todas como leídas</button>
                  </div>
                  <div class="axyra-notifications-list" id="notifications-list">
                    <div class="axyra-no-notifications">No hay notificaciones</div>
                  </div>
                </div>
              </div>
              
              <span class="axyra-user-email" id="userEmail">${userEmail}</span>
              <button class="axyra-logout-btn" data-action="logout">
                <i class="fas fa-sign-out-alt"></i>
                <span class="axyra-logout-text">Cerrar</span>
              </button>
            </div>
          </div>
        `;

        // Generar navegación
        this.generarNavegacion();
    }

    generarNavegacion() {
        const nav = this.header.querySelector('#axyraNav');
        const pageSubtitle = this.header.querySelector('#pageSubtitle');
        
        if (!nav) return;

        console.log('🔍 Generando navegación inteligente...');
        console.log('📍 Página actual:', this.currentPage);

        this.navigationItems.forEach(item => {
            let isCurrentPage = false;
            
            if (this.currentPage === 'empleados' && item.text === 'Empleados') {
                isCurrentPage = true;
            } else if (this.currentPage === 'dashboard' && item.text === 'Dashboard') {
                isCurrentPage = true;
            } else if (this.currentPage === 'horas' && item.text === 'Horas') {
                isCurrentPage = true;
            } else if (this.currentPage === 'nomina' && item.text === 'Nómina') {
                isCurrentPage = true;
            } else if (this.currentPage === 'gestion_personal' && item.text === 'Gestión Personal') {
                isCurrentPage = true;
            } else if (this.currentPage === 'caja' && item.text === 'Caja') {
                isCurrentPage = true;
            } else if (this.currentPage === 'inventario' && item.text === 'Inventario') {
                isCurrentPage = true;
            } else if (this.currentPage === 'configuracion' && item.text === 'Config') {
                isCurrentPage = true;
            } else if (this.currentPage === 'inicio' && item.text === 'Inicio') {
                isCurrentPage = true;
            }

            if (isCurrentPage) {
                item.active = true;
                item.show = false;
                console.log(`🚫 Ocultando botón: ${item.text} (página actual)`);
                if (pageSubtitle) {
                    pageSubtitle.textContent = item.text;
                    console.log(`📝 Subtítulo establecido: ${item.text}`);
                }
            } else {
                item.active = false;
                item.show = true;
                console.log(`✅ Mostrando botón: ${item.text}`);
            }
        });

        let navHTML = '';
        this.navigationItems.forEach(item => {
            if (item.show) {
                navHTML += `
                  <a href="${item.href}" class="axyra-nav-link ${item.active ? 'active' : ''}">
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                  </a>
                `;
            }
        });

        nav.innerHTML = navHTML;
        console.log('📋 Navegación generada:', navHTML);
        console.log(`✅ ${this.navigationItems.filter(item => item.show).length} enlaces de navegación insertados`);
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
            });
        }

        if (markAllRead) {
            markAllRead.addEventListener('click', () => {
                this.markAllNotificationsAsRead();
            });
        }

        // Logout
        const logoutBtn = this.header.querySelector('[data-action="logout"]');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Cerrar dropdowns al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.axyra-notifications-container')) {
                notificationsDropdown.classList.remove('active');
            }
            if (!e.target.closest('.axyra-search-container')) {
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
            searchResults.innerHTML = '<div class="axyra-no-results">No se encontraron resultados</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="axyra-search-result-item" data-link="${result.link}">
                    <div class="axyra-search-result-icon">
                        <i class="${result.icon}"></i>
                    </div>
                    <div class="axyra-search-result-content">
                        <div class="axyra-search-result-title">${result.title}</div>
                        <div class="axyra-search-result-description">${result.description}</div>
                        <div class="axyra-search-result-type">${result.type.toUpperCase()}</div>
                    </div>
                </div>
            `).join('');

            // Agregar event listeners a los resultados
            searchResults.querySelectorAll('.axyra-search-result-item').forEach(item => {
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
            notificationsList.innerHTML = '<div class="axyra-no-notifications">No hay notificaciones</div>';
            return;
        }

        notificationsList.innerHTML = this.notifications.map(notif => `
            <div class="axyra-notification-item ${notif.type} ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                <div class="axyra-notification-icon">
                    <i class="fas fa-${this.getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="axyra-notification-content">
                    <div class="axyra-notification-message">${notif.message}</div>
                    <div class="axyra-notification-time">${this.formatTimeAgo(notif.timestamp)}</div>
                </div>
            </div>
        `).join('');

        // Agregar event listeners
        notificationsList.querySelectorAll('.axyra-notification-item').forEach(item => {
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

    async handleLogout() {
        console.log('🔄 Cerrando sesión desde header unificado...');
        try {
            if (firebase && firebase.auth) {
                await firebase.auth().signOut();
                console.log('✅ Sesión de Firebase cerrada');
            }
            localStorage.removeItem('axyra_isolated_user');
            localStorage.removeItem('axyra_firebase_user');
            sessionStorage.clear();
            window.location.href = '../../login.html';
        } catch (error) {
            console.error('Error cerrando sesión:', error);
            localStorage.removeItem('axyra_isolated_user');
            localStorage.removeItem('axyra_firebase_user');
            sessionStorage.clear();
            window.location.href = '../../login.html';
        }
    }

    detectarPaginaActual() {
        const url = window.location.href;
        const pathname = window.location.pathname;
        console.log('🔍 URL completa:', url);
        console.log('🔍 Pathname:', pathname);
        
        if (url.includes('/empleados/') || pathname.includes('/empleados/')) {
            console.log('🎯 Página detectada como: empleados');
            return 'empleados';
        } else if (url.includes('/dashboard/') || pathname.includes('/dashboard/')) {
            console.log('🎯 Página detectada como: dashboard');
            return 'dashboard';
        } else if (url.includes('/horas/') || pathname.includes('/horas/')) {
            console.log('🎯 Página detectada como: horas');
            return 'horas';
        } else if (url.includes('/nomina/') || pathname.includes('/nomina/')) {
            console.log('🎯 Página detectada como: nomina');
            return 'nomina';
        } else if (url.includes('/gestion_personal/') || pathname.includes('/gestion_personal/')) {
            console.log('🎯 Página detectada como: gestion_personal');
            return 'gestion_personal';
        } else if (url.includes('/cuadre_caja/') || pathname.includes('/cuadre_caja/')) {
            console.log('🎯 Página detectada como: caja');
            return 'caja';
        } else if (url.includes('/inventario/') || pathname.includes('/inventario/')) {
            console.log('🎯 Página detectada como: inventario');
            return 'inventario';
        } else if (url.includes('/configuracion/') || pathname.includes('/configuracion/')) {
            console.log('🎯 Página detectada como: configuracion');
            return 'configuracion';
        } else if (url.includes('/index.html') || pathname.includes('/index.html') || url.endsWith('/') || pathname.endsWith('/')) {
            console.log('🎯 Página detectada como: inicio');
            return 'inicio';
        } else {
            console.log('🎯 Página detectada como: desconocida');
            return 'desconocida';
        }
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

    openProfileSettings() {
        window.location.href = '../configuracion/configuracion.html#perfil';
    }

    openSystemSettings() {
        window.location.href = '../configuracion/configuracion.html#sistema';
    }

    openHelpSupport() {
        window.location.href = '../../ayuda.html';
    }

    initializeAIChat() {
        // Solo crear chat IA si no existe
        if (document.querySelector('#ai-chat-bubble')) {
            console.log('Chat IA ya existe, saltando inicialización');
            return;
        }

        // Crear el chat IA
        const chatHTML = `
            <div class="ai-chat-container" id="ai-chat-container">
                <button class="ai-chat-toggle" id="ai-chat-toggle">
                    <div class="chat-bubble-content">
                        <i class="fas fa-robot"></i>
                        <span class="chat-badge"></span>
                    </div>
                    <div class="chat-bubble-text">
                        <span class="chat-title">AXYRA Assistant</span>
                        <span class="chat-subtitle">¿En qué puedo ayudarte?</span>
                    </div>
                </button>

                <div class="ai-chat-window" id="ai-chat-window">
                    <div class="ai-chat-header">
                        <div class="ai-chat-title">
                            <div class="ai-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="ai-info">
                                <h3>Asistente IA</h3>
                                <span class="ai-status">Disponible</span>
                            </div>
                        </div>
                        <div class="ai-chat-controls">
                            <button class="ai-chat-close" id="ai-chat-close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div class="ai-chat-messages" id="ai-chat-messages">
                        <div class="ai-chat-message ai">
                            <strong>¡Hola! Soy tu asistente AXYRA.</strong><br>
                            Puedo ayudarte con:
                            <ul>
                                <li>Gestión de empleados</li>
                                <li>Registro de horas</li>
                                <li>Cálculo de nóminas</li>
                                <li>Cuadre de caja</li>
                                <li>Y mucho más...</li>
                            </ul>
                        </div>
                    </div>

                    <div class="ai-chat-typing-indicator" id="ai-chat-typing">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div class="ai-chat-input-area">
                        <input type="text" id="ai-chat-input" placeholder="Escribe tu pregunta...">
                        <button id="ai-chat-send">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>

                    <div class="quick-suggestions">
                        <button class="suggestion-btn" data-suggestion="¿Cómo registro horas?">¿Cómo registro horas?</button>
                        <button class="suggestion-btn" data-suggestion="¿Cómo calculo nómina?">¿Cómo calculo nómina?</button>
                        <button class="suggestion-btn" data-suggestion="¿Cómo agrego empleado?">¿Cómo agrego empleado?</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
        this.setupAIChatEvents();
        console.log('🤖 Chat IA inicializado desde header unificado');
    }

    setupAIChatEvents() {
        const chatToggle = document.getElementById('ai-chat-toggle');
        const chatWindow = document.getElementById('ai-chat-window');
        const chatClose = document.getElementById('ai-chat-close');
        const chatInput = document.getElementById('ai-chat-input');
        const chatSend = document.getElementById('ai-chat-send');
        const chatMessages = document.getElementById('ai-chat-messages');
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');

        if (chatToggle) {
            chatToggle.addEventListener('click', () => {
                chatWindow.classList.toggle('active');
            });
        }

        if (chatClose) {
            chatClose.addEventListener('click', () => {
                chatWindow.classList.remove('active');
            });
        }

        if (chatSend) {
            chatSend.addEventListener('click', () => {
                this.sendAIMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendAIMessage();
                }
            });
        }

        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const suggestion = btn.dataset.suggestion;
                chatInput.value = suggestion;
                this.sendAIMessage();
            });
        });
    }

    sendAIMessage() {
        const chatInput = document.getElementById('ai-chat-input');
        const chatMessages = document.getElementById('ai-chat-messages');
        const message = chatInput.value.trim();

        if (!message) return;

        // Agregar mensaje del usuario
        const userMessage = document.createElement('div');
        userMessage.className = 'ai-chat-message user';
        userMessage.textContent = message;
        chatMessages.appendChild(userMessage);

        // Limpiar input
        chatInput.value = '';

        // Mostrar indicador de escritura
        const typingIndicator = document.getElementById('ai-chat-typing');
        typingIndicator.classList.add('active');

        // Simular respuesta de IA
        setTimeout(() => {
            typingIndicator.classList.remove('active');
            
            const aiMessage = document.createElement('div');
            aiMessage.className = 'ai-chat-message ai';
            aiMessage.innerHTML = this.generateAIResponse(message);
            chatMessages.appendChild(aiMessage);

            // Scroll al final
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1500);
    }

    generateAIResponse(message) {
        const responses = {
            'horas': 'Para registrar horas:<br>1. Selecciona el empleado<br>2. Elige la fecha<br>3. Ingresa las horas trabajadas<br>4. Haz clic en "Registrar Horas"',
            'nomina': 'Para calcular nómina:<br>1. Ve a la pestaña "Nómina"<br>2. Selecciona el empleado<br>3. Elige el período<br>4. Haz clic en "Generar Nómina"',
            'empleado': 'Para agregar empleado:<br>1. Ve a la pestaña "Empleados"<br>2. Haz clic en "Agregar Empleado"<br>3. Completa los datos<br>4. Guarda la información',
            'caja': 'Para cuadre de caja:<br>1. Ve al módulo "Caja"<br>2. Registra movimientos<br>3. Calcula el cuadre<br>4. Genera reporte'
        };

        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }

        return 'Entiendo tu consulta. Te puedo ayudar con:<br>• Gestión de empleados<br>• Registro de horas<br>• Cálculo de nóminas<br>• Cuadre de caja<br><br>¿En qué más puedo ayudarte?';
    }
}

// Inicializar header unificado cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar si no hay header personalizado
    if (!document.querySelector('.axyra-header')) {
        window.unifiedHeader = new UnifiedHeader();
    }
});

// Exportar para uso global
window.UnifiedHeader = UnifiedHeader;