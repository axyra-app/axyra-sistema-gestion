/**
 * Sistema de Chat con IA AXYRA
 * Versión: 1.0.0
 * Descripción: Sistema inteligente de chat para asistencia en temas relacionados con la página
 */

class AxyraAIChatSystem {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.isTyping = false;
    this.knowledgeBase = this.initializeKnowledgeBase();
    this.init();
  }

  init() {
    console.log('🤖 Inicializando Sistema de Chat con IA AXYRA...');
    this.createChatInterface();
    this.setupEventListeners();
    this.loadChatHistory();
    console.log('✅ Sistema de Chat con IA AXYRA inicializado correctamente');
  }

  initializeKnowledgeBase() {
    return {
      // Información general del sistema
      general: {
        '¿Qué es AXYRA?':
          'AXYRA es un sistema integral de gestión empresarial que incluye módulos para nómina, inventario, caja, personal y más.',
        '¿Cómo funciona el sistema?':
          'El sistema está organizado en módulos especializados: Dashboard, Gestión Personal, Cuadre de Caja, Inventario y Configuración.',
        '¿Necesito capacitación?':
          'No, el sistema está diseñado para ser intuitivo. Puede usar este chat para obtener ayuda específica en cualquier momento.',
      },

      // Dashboard
      dashboard: {
        '¿Cómo personalizar el dashboard?':
          'Use el botón "Personalizar" en la esquina superior derecha para agregar, quitar o reorganizar widgets.',
        '¿Qué widgets están disponibles?':
          'Estadísticas de empleados, horas trabajadas, nómina, inventario, caja y gráficos de rendimiento.',
        '¿Cómo configurar alertas?':
          'Vaya a Configuración > Notificaciones para configurar alertas por email, push o sonido.',
      },

      // Gestión Personal
      personal: {
        '¿Cómo agregar un empleado?':
          'Vaya a Gestión Personal > Empleados y haga clic en "Nuevo Empleado". Complete los datos requeridos.',
        '¿Cómo calcular horas trabajadas?':
          'El sistema calcula automáticamente las horas basándose en las entradas y salidas registradas.',
        '¿Cómo generar una nómina?':
          'Vaya a Gestión Personal > Nómina, seleccione el período y haga clic en "Generar Nómina".',
        '¿Qué incluye el cálculo de nómina?':
          'Salario básico, horas extras, recargos nocturnos, dominicales, festivos, descuentos y prestaciones según la ley colombiana.',
      },

      // Cuadre de Caja
      caja: {
        '¿Cómo hacer un cuadre de caja?':
          'Vaya a Cuadre de Caja, registre las entradas y salidas del día, y el sistema calculará automáticamente el total.',
        '¿Cómo exportar a Excel?':
          'Use el botón "Exportar Excel" para generar un reporte detallado del cuadre de caja.',
        '¿Qué son los KPIs de caja?':
          'Indicadores clave como total de ventas, efectivo, tarjetas, gastos y utilidad del día.',
        '¿Cómo registrar una factura?':
          'Use el botón "Nueva Factura" para registrar ventas o compras con todos los detalles necesarios.',
      },

      // Inventario
      inventario: {
        '¿Cómo agregar un producto?':
          'Vaya a Inventario > Productos y haga clic en "Nuevo Producto". Complete la información del producto.',
        '¿Cómo registrar movimientos?':
          'Use los botones "Entrada" o "Salida" para registrar movimientos de inventario.',
        '¿Cómo categorizar productos?': 'Cree categorías en la sección de categorías y asígnelas a los productos.',
        '¿Cómo hacer un inventario físico?':
          'Use la función de "Inventario Físico" para comparar con el inventario del sistema.',
        '¿Cómo exportar inventario?':
          'Use el botón "Exportar" para generar reportes en Excel o PDF del inventario actual.',
      },

      // Configuración
      configuracion: {
        '¿Cómo configurar la empresa?':
          'Vaya a Configuración > Información de la Empresa para actualizar los datos de su empresa.',
        '¿Cómo gestionar usuarios?':
          'En Configuración > Gestión de Usuarios puede agregar, editar o eliminar usuarios del sistema.',
        '¿Cómo configurar seguridad?':
          'En Configuración > Seguridad puede establecer políticas de contraseñas y autenticación.',
        '¿Cómo hacer backup?':
          'En Configuración > Backup puede crear copias de seguridad de todos los datos del sistema.',
      },

      // Problemas comunes
      problemas: {
        'No puedo iniciar sesión':
          'Verifique su email y contraseña. Si el problema persiste, contacte al administrador.',
        'Los datos no se guardan': 'Verifique su conexión a internet y que tenga permisos para modificar datos.',
        'Error al exportar': 'Asegúrese de que el navegador permita descargas y que no haya archivos abiertos.',
        'El sistema va lento': 'Cierre pestañas innecesarias del navegador y verifique su conexión a internet.',
        'No veo mis datos': 'Verifique que esté en la sección correcta y que tenga permisos para ver esos datos.',
      },

      // Funcionalidades avanzadas
      avanzado: {
        '¿Cómo usar reportes personalizados?':
          'En la sección de Reportes puede crear reportes personalizados con filtros específicos.',
        '¿Cómo configurar notificaciones automáticas?':
          'En Configuración > Notificaciones puede programar alertas automáticas.',
        '¿Cómo sincronizar con Firebase?':
          'El sistema se sincroniza automáticamente, pero puede forzar la sincronización en Configuración.',
        '¿Cómo usar la búsqueda global?':
          'Use la barra de búsqueda en el header para buscar en todos los módulos del sistema.',
      },
    };
  }

  createChatInterface() {
    // Crear contenedor principal del chat
    const chatContainer = document.createElement('div');
    chatContainer.id = 'axyra-ai-chat';
    chatContainer.innerHTML = `
            <!-- Botón flotante para abrir chat -->
            <div class="axyra-chat-toggle" id="axyraChatToggle">
                <i class="fas fa-robot"></i>
                <span class="axyra-chat-badge" id="axyraChatBadge" style="display: none;">1</span>
            </div>

            <!-- Ventana del chat -->
            <div class="axyra-chat-window" id="axyraChatWindow">
                <!-- Header del chat -->
                <div class="axyra-chat-header">
                    <div class="axyra-chat-title">
                        <i class="fas fa-robot"></i>
                        <span>Asistente AXYRA</span>
                    </div>
                    <div class="axyra-chat-actions">
                        <button class="axyra-chat-minimize" id="axyraChatMinimize">
                            <i class="fas fa-minus"></i>
                        </button>
                        <button class="axyra-chat-close" id="axyraChatClose">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Mensajes del chat -->
                <div class="axyra-chat-messages" id="axyraChatMessages">
                    <div class="axyra-chat-welcome">
                        <div class="axyra-chat-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="axyra-chat-message-content">
                            <h4>¡Hola! Soy tu asistente AXYRA</h4>
                            <p>Puedo ayudarte con cualquier pregunta sobre el sistema. ¿En qué puedo asistirte hoy?</p>
                            <div class="axyra-chat-suggestions">
                                <button class="axyra-chat-suggestion" data-query="¿Cómo agregar un empleado?">
                                    <i class="fas fa-user-plus"></i> Agregar empleado
                                </button>
                                <button class="axyra-chat-suggestion" data-query="¿Cómo hacer un cuadre de caja?">
                                    <i class="fas fa-calculator"></i> Cuadre de caja
                                </button>
                                <button class="axyra-chat-suggestion" data-query="¿Cómo configurar notificaciones?">
                                    <i class="fas fa-bell"></i> Configurar notificaciones
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input del chat -->
                <div class="axyra-chat-input-container">
                    <div class="axyra-chat-input-wrapper">
                        <input type="text" class="axyra-chat-input" id="axyraChatInput" placeholder="Escribe tu pregunta aquí...">
                        <button class="axyra-chat-send" id="axyraChatSend">
                            <i class="fas fa-paper-plane"></i>
                        </button>
                    </div>
                    <div class="axyra-chat-footer">
                        <small>Powered by AXYRA AI • Escribe "ayuda" para ver comandos disponibles</small>
                    </div>
                </div>
            </div>
        `;

    // Agregar estilos
    this.addChatStyles();

    // Insertar en el body
    document.body.appendChild(chatContainer);
  }

  addChatStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
            /* Estilos del Chat con IA AXYRA */
            #axyra-ai-chat {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }

            /* Botón flotante */
            .axyra-chat-toggle {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #4f81bd 0%, #2e5c8a 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(79, 129, 189, 0.4);
                transition: all 0.3s ease;
                position: relative;
            }

            .axyra-chat-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 25px rgba(79, 129, 189, 0.6);
            }

            .axyra-chat-toggle i {
                color: white;
                font-size: 24px;
            }

            .axyra-chat-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: bold;
            }

            /* Ventana del chat */
            .axyra-chat-window {
                position: absolute;
                bottom: 80px;
                right: 0;
                width: 400px;
                height: 600px;
                background: white;
                border-radius: 16px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                display: none;
                flex-direction: column;
                overflow: hidden;
                border: 1px solid #e2e8f0;
            }

            .axyra-chat-window.open {
                display: flex;
                animation: slideUp 0.3s ease;
            }

            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            /* Header del chat */
            .axyra-chat-header {
                background: linear-gradient(135deg, #4f81bd 0%, #2e5c8a 100%);
                color: white;
                padding: 16px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .axyra-chat-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-weight: 600;
                font-size: 16px;
            }

            .axyra-chat-title i {
                font-size: 18px;
            }

            .axyra-chat-actions {
                display: flex;
                gap: 8px;
            }

            .axyra-chat-minimize,
            .axyra-chat-close {
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                padding: 4px;
                border-radius: 4px;
                transition: background 0.2s ease;
            }

            .axyra-chat-minimize:hover,
            .axyra-chat-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            /* Mensajes del chat */
            .axyra-chat-messages {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8fafc;
            }

            .axyra-chat-welcome {
                display: flex;
                gap: 12px;
                margin-bottom: 20px;
            }

            .axyra-chat-avatar {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #4f81bd 0%, #2e5c8a 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                flex-shrink: 0;
            }

            .axyra-chat-message-content h4 {
                margin: 0 0 8px 0;
                color: #374151;
                font-size: 16px;
            }

            .axyra-chat-message-content p {
                margin: 0 0 16px 0;
                color: #6b7280;
                font-size: 14px;
                line-height: 1.5;
            }

            .axyra-chat-suggestions {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .axyra-chat-suggestion {
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                padding: 8px 12px;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: left;
                font-size: 13px;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .axyra-chat-suggestion:hover {
                background: #f1f5f9;
                border-color: #4f81bd;
            }

            .axyra-chat-suggestion i {
                color: #4f81bd;
                width: 16px;
            }

            /* Mensaje individual */
            .axyra-chat-message {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .axyra-chat-message.user {
                flex-direction: row-reverse;
            }

            .axyra-chat-message.user .axyra-chat-avatar {
                background: #10b981;
            }

            .axyra-chat-message-content {
                background: white;
                padding: 12px 16px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                max-width: 280px;
            }

            .axyra-chat-message.user .axyra-chat-message-content {
                background: #4f81bd;
                color: white;
            }

            .axyra-chat-message-text {
                margin: 0;
                font-size: 14px;
                line-height: 1.4;
            }

            .axyra-chat-message-time {
                font-size: 11px;
                color: #9ca3af;
                margin-top: 4px;
            }

            .axyra-chat-message.user .axyra-chat-message-time {
                color: rgba(255, 255, 255, 0.7);
            }

            /* Indicador de escritura */
            .axyra-chat-typing {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .axyra-chat-typing-dots {
                background: white;
                padding: 12px 16px;
                border-radius: 12px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .axyra-chat-typing-dots::after {
                content: '...';
                animation: typing 1.5s infinite;
            }

            @keyframes typing {
                0%, 20% { content: '.'; }
                40% { content: '..'; }
                60%, 100% { content: '...'; }
            }

            /* Input del chat */
            .axyra-chat-input-container {
                background: white;
                border-top: 1px solid #e2e8f0;
                padding: 16px 20px;
            }

            .axyra-chat-input-wrapper {
                display: flex;
                gap: 8px;
                margin-bottom: 8px;
            }

            .axyra-chat-input {
                flex: 1;
                padding: 12px 16px;
                border: 1px solid #e2e8f0;
                border-radius: 24px;
                font-size: 14px;
                outline: none;
                transition: border-color 0.2s ease;
            }

            .axyra-chat-input:focus {
                border-color: #4f81bd;
            }

            .axyra-chat-send {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #4f81bd 0%, #2e5c8a 100%);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
            }

            .axyra-chat-send:hover {
                transform: scale(1.05);
            }

            .axyra-chat-send:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .axyra-chat-footer {
                text-align: center;
                color: #9ca3af;
                font-size: 11px;
            }

            /* Responsive */
            @media (max-width: 480px) {
                .axyra-chat-window {
                    width: calc(100vw - 40px);
                    height: calc(100vh - 100px);
                    right: -10px;
                }
            }

            /* Scrollbar personalizado */
            .axyra-chat-messages::-webkit-scrollbar {
                width: 6px;
            }

            .axyra-chat-messages::-webkit-scrollbar-track {
                background: #f1f5f9;
            }

            .axyra-chat-messages::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 3px;
            }

            .axyra-chat-messages::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
        `;
    document.head.appendChild(styles);
  }

  setupEventListeners() {
    // Toggle del chat
    const toggle = document.getElementById('axyraChatToggle');
    const window = document.getElementById('axyraChatWindow');
    const close = document.getElementById('axyraChatClose');
    const minimize = document.getElementById('axyraChatMinimize');
    const input = document.getElementById('axyraChatInput');
    const send = document.getElementById('axyraChatSend');

    if (toggle) {
      toggle.addEventListener('click', () => this.toggleChat());
    }

    if (close) {
      close.addEventListener('click', () => this.closeChat());
    }

    if (minimize) {
      minimize.addEventListener('click', () => this.minimizeChat());
    }

    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    if (send) {
      send.addEventListener('click', () => this.sendMessage());
    }

    // Sugerencias
    const suggestions = document.querySelectorAll('.axyra-chat-suggestion');
    suggestions.forEach((suggestion) => {
      suggestion.addEventListener('click', () => {
        const query = suggestion.getAttribute('data-query');
        this.sendMessage(query);
      });
    });
  }

  toggleChat() {
    const window = document.getElementById('axyraChatWindow');
    if (window) {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        window.classList.add('open');
        document.getElementById('axyraChatInput')?.focus();
        this.hideBadge();
      } else {
        window.classList.remove('open');
      }
    }
  }

  closeChat() {
    this.isOpen = false;
    const window = document.getElementById('axyraChatWindow');
    if (window) {
      window.classList.remove('open');
    }
  }

  minimizeChat() {
    this.closeChat();
  }

  sendMessage(text = null) {
    const input = document.getElementById('axyraChatInput');
    const message = text || input?.value?.trim();

    if (!message) return;

    // Limpiar input
    if (input) {
      input.value = '';
    }

    // Agregar mensaje del usuario
    this.addMessage(message, 'user');

    // Procesar mensaje
    this.processMessage(message);
  }

  addMessage(text, sender = 'bot') {
    const messagesContainer = document.getElementById('axyraChatMessages');
    if (!messagesContainer) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `axyra-chat-message ${sender}`;

    const time = new Date().toLocaleTimeString('es-CO', {
      hour: '2-digit',
      minute: '2-digit',
    });

    messageDiv.innerHTML = `
            <div class="axyra-chat-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="axyra-chat-message-content">
                <p class="axyra-chat-message-text">${text}</p>
                <div class="axyra-chat-message-time">${time}</div>
            </div>
        `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Guardar en historial
    this.messages.push({ text, sender, time });
    this.saveChatHistory();
  }

  processMessage(message) {
    const lowerMessage = message.toLowerCase();

    // Mostrar indicador de escritura
    this.showTypingIndicator();

    // Simular delay de procesamiento
    setTimeout(() => {
      this.hideTypingIndicator();
      const response = this.generateResponse(lowerMessage);
      this.addMessage(response, 'bot');
    }, 1000 + Math.random() * 1000);
  }

  generateResponse(message) {
    // Comandos especiales
    if (message.includes('ayuda') || message.includes('help')) {
      return this.getHelpResponse();
    }

    if (message.includes('hola') || message.includes('hi')) {
      return '¡Hola! ¿En qué puedo ayudarte hoy con el sistema AXYRA?';
    }

    if (message.includes('gracias') || message.includes('thanks')) {
      return '¡De nada! Estoy aquí para ayudarte cuando lo necesites.';
    }

    // Buscar en la base de conocimiento
    const response = this.searchKnowledgeBase(message);
    if (response) {
      return response;
    }

    // Respuesta por defecto
    return this.getDefaultResponse();
  }

  searchKnowledgeBase(message) {
    for (const category in this.knowledgeBase) {
      for (const question in this.knowledgeBase[category]) {
        if (this.isSimilar(message, question)) {
          return this.knowledgeBase[category][question];
        }
      }
    }
    return null;
  }

  isSimilar(message, question) {
    const messageWords = message.toLowerCase().split(' ');
    const questionWords = question.toLowerCase().split(' ');

    let matches = 0;
    for (const word of messageWords) {
      if (questionWords.some((qWord) => qWord.includes(word) || word.includes(qWord))) {
        matches++;
      }
    }

    return matches >= 2 || messageWords.some((word) => questionWords.some((qWord) => qWord.includes(word)));
  }

  getHelpResponse() {
    return `Aquí tienes algunos comandos útiles:

🔍 **Búsquedas comunes:**
• "¿Cómo agregar un empleado?"
• "¿Cómo hacer un cuadre de caja?"
• "¿Cómo configurar notificaciones?"
• "¿Cómo exportar datos?"

📋 **Módulos disponibles:**
• Dashboard - Personalización y widgets
• Gestión Personal - Empleados y nómina
• Cuadre de Caja - Control de ingresos y gastos
• Inventario - Productos y movimientos
• Configuración - Ajustes del sistema

💡 **Tip:** Puedes preguntar sobre cualquier funcionalidad específica del sistema.`;
  }

  getDefaultResponse() {
    const responses = [
      'Entiendo tu pregunta. Aunque no tengo una respuesta específica, puedo ayudarte con temas relacionados con el sistema AXYRA. ¿Podrías ser más específico?',
      'Esa es una buena pregunta. Te sugiero revisar la sección de ayuda o preguntarme sobre funcionalidades específicas del sistema.',
      'No estoy seguro de entender completamente tu pregunta. ¿Podrías reformularla o preguntarme sobre alguna funcionalidad específica del sistema?',
      'Interesante pregunta. Aunque no tengo esa información específica, puedo ayudarte con el uso del sistema AXYRA. ¿Hay algo específico que te gustaría saber?',
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('axyraChatMessages');
    if (!messagesContainer) return;

    const typingDiv = document.createElement('div');
    typingDiv.className = 'axyra-chat-typing';
    typingDiv.id = 'axyraChatTyping';
    typingDiv.innerHTML = `
            <div class="axyra-chat-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="axyra-chat-typing-dots"></div>
        `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingDiv = document.getElementById('axyraChatTyping');
    if (typingDiv) {
      typingDiv.remove();
    }
  }

  showBadge() {
    const badge = document.getElementById('axyraChatBadge');
    if (badge) {
      badge.style.display = 'flex';
    }
  }

  hideBadge() {
    const badge = document.getElementById('axyraChatBadge');
    if (badge) {
      badge.style.display = 'none';
    }
  }

  loadChatHistory() {
    try {
      const history = localStorage.getItem('axyra_chat_history');
      if (history) {
        this.messages = JSON.parse(history);
        this.renderChatHistory();
      }
    } catch (error) {
      console.error('❌ Error cargando historial del chat:', error);
    }
  }

  saveChatHistory() {
    try {
      localStorage.setItem('axyra_chat_history', JSON.stringify(this.messages));
    } catch (error) {
      console.error('❌ Error guardando historial del chat:', error);
    }
  }

  renderChatHistory() {
    const messagesContainer = document.getElementById('axyraChatMessages');
    if (!messagesContainer || this.messages.length === 0) return;

    // Limpiar mensajes existentes (excepto el welcome)
    const welcome = messagesContainer.querySelector('.axyra-chat-welcome');
    messagesContainer.innerHTML = '';
    if (welcome) {
      messagesContainer.appendChild(welcome);
    }

    // Renderizar historial
    this.messages.forEach((msg) => {
      this.addMessage(msg.text, msg.sender);
    });
  }

  // Método público para mostrar notificaciones
  showNotification(message) {
    this.showBadge();
    if (!this.isOpen) {
      // Opcional: mostrar notificación del sistema
      if (window.axyraNotifications) {
        window.axyraNotifications.show(message, 'info');
      }
    }
  }

  // Método para agregar conocimiento dinámico
  addKnowledge(category, question, answer) {
    if (!this.knowledgeBase[category]) {
      this.knowledgeBase[category] = {};
    }
    this.knowledgeBase[category][question] = answer;
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAIChat = new AxyraAIChatSystem();
});

// Exportar para uso global
window.AxyraAIChatSystem = AxyraAIChatSystem;
