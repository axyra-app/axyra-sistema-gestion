// ========================================
// SISTEMA DE CHAT CON IA AXYRA
// ========================================

console.log('🤖 Inicializando sistema de chat con IA...');

class AxyraAIChat {
  constructor() {
    this.isOpen = false;
    this.messages = [];
    this.personalities = {
      axyra: {
        name: 'AXYRA Assistant',
        icon: '🤖',
        description: 'Asistente general de AXYRA',
        context:
          'Eres un asistente virtual especializado en el sistema de gestión empresarial AXYRA. Ayudas a los usuarios con consultas sobre empleados, nóminas, horas, reportes y configuración del sistema.',
      },
      hr: {
        name: 'Especialista en RRHH',
        icon: '👥',
        description: 'Experto en gestión de personal',
        context:
          'Eres un especialista en recursos humanos con amplia experiencia en gestión de empleados, contratos, políticas laborales y mejores prácticas de RRHH.',
      },
      finance: {
        name: 'Analista Financiero',
        icon: '💰',
        description: 'Experto en finanzas y nóminas',
        context:
          'Eres un analista financiero especializado en liquidación de nóminas, cálculos salariales, recargos nocturnos, dominicales y festivos según la legislación laboral colombiana.',
      },
      tech: {
        name: 'Soporte Técnico',
        icon: '⚙️',
        description: 'Especialista en tecnología',
        context:
          'Eres un especialista en soporte técnico del sistema AXYRA. Ayudas con problemas técnicos, configuración, errores y optimización del sistema.',
      },
    };
    this.currentPersonality = 'axyra';
    this.init();
  }

  init() {
    this.createChatWidget();
    this.setupEventListeners();
    this.loadChatHistory();
    console.log('✅ Sistema de chat con IA inicializado');
  }

  createChatWidget() {
    // Crear contenedor del chat
    const chatContainer = document.createElement('div');
    chatContainer.id = 'axyra-chat-container';
    chatContainer.innerHTML = `
            <div class="axyra-chat-widget">
                <div class="axyra-chat-header" onclick="axyraAIChat.toggleChat()">
                    <div class="axyra-chat-header-content">
                        <div class="axyra-chat-avatar">🤖</div>
                        <div class="axyra-chat-info">
                            <h4>AXYRA Assistant</h4>
                            <p>¿En qué puedo ayudarte?</p>
                        </div>
                    </div>
                    <div class="axyra-chat-toggle">
                        <span class="axyra-chat-toggle-icon">💬</span>
                    </div>
                </div>
                
                <div class="axyra-chat-body" id="axyra-chat-body">
                    <div class="axyra-chat-messages" id="axyra-chat-messages">
                        <div class="axyra-chat-welcome">
                            <div class="axyra-chat-welcome-avatar">🤖</div>
                            <div class="axyra-chat-welcome-content">
                                <h4>¡Hola! Soy AXYRA Assistant</h4>
                                <p>Estoy aquí para ayudarte con cualquier consulta sobre el sistema. ¿En qué puedo asistirte hoy?</p>
                                <div class="axyra-chat-quick-actions">
                                    <button class="axyra-chat-quick-btn" onclick="axyraAIChat.sendQuickMessage('¿Cómo gestiono empleados?')">
                                        👥 Empleados
                                    </button>
                                    <button class="axyra-chat-quick-btn" onclick="axyraAIChat.sendQuickMessage('¿Cómo calculo nóminas?')">
                                        💰 Nóminas
                                    </button>
                                    <button class="axyra-chat-quick-btn" onclick="axyraAIChat.sendQuickMessage('¿Cómo genero reportes?')">
                                        📊 Reportes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="axyra-chat-input-container">
                        <div class="axyra-chat-personality-selector">
                            <select id="axyra-chat-personality" onchange="axyraAIChat.changePersonality(this.value)">
                                <option value="axyra">🤖 AXYRA Assistant</option>
                                <option value="hr">👥 Especialista RRHH</option>
                                <option value="finance">💰 Analista Financiero</option>
                                <option value="tech">⚙️ Soporte Técnico</option>
                            </select>
                        </div>
                        
                        <div class="axyra-chat-input-wrapper">
                            <input type="text" id="axyra-chat-input" placeholder="Escribe tu mensaje..." 
                                   onkeypress="axyraAIChat.handleKeyPress(event)">
                            <button class="axyra-chat-send-btn" onclick="axyraAIChat.sendMessage()">
                                📤
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

    // Agregar estilos
    const styles = document.createElement('style');
    styles.textContent = `
            #axyra-chat-container {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .axyra-chat-widget {
                width: 350px;
                height: 500px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.15);
                display: flex;
                flex-direction: column;
                overflow: hidden;
                transform: translateY(420px);
                transition: transform 0.3s ease;
            }

            .axyra-chat-widget.open {
                transform: translateY(0);
            }

            .axyra-chat-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px;
                cursor: pointer;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .axyra-chat-header-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .axyra-chat-avatar {
                width: 40px;
                height: 40px;
                background: rgba(255,255,255,0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 20px;
            }

            .axyra-chat-info h4 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }

            .axyra-chat-info p {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
            }

            .axyra-chat-toggle {
                font-size: 20px;
                transition: transform 0.3s ease;
            }

            .axyra-chat-widget.open .axyra-chat-toggle {
                transform: rotate(180deg);
            }

            .axyra-chat-body {
                flex: 1;
                display: flex;
                flex-direction: column;
                background: #f8f9fa;
            }

            .axyra-chat-messages {
                flex: 1;
                padding: 16px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .axyra-chat-welcome {
                display: flex;
                gap: 12px;
                margin-bottom: 16px;
            }

            .axyra-chat-welcome-avatar {
                width: 32px;
                height: 32px;
                background: #667eea;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                flex-shrink: 0;
            }

            .axyra-chat-welcome-content h4 {
                margin: 0 0 8px 0;
                font-size: 14px;
                color: #333;
            }

            .axyra-chat-welcome-content p {
                margin: 0 0 12px 0;
                font-size: 13px;
                color: #666;
                line-height: 1.4;
            }

            .axyra-chat-quick-actions {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .axyra-chat-quick-btn {
                background: white;
                border: 1px solid #e0e0e0;
                border-radius: 20px;
                padding: 6px 12px;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .axyra-chat-quick-btn:hover {
                background: #667eea;
                color: white;
                border-color: #667eea;
            }

            .axyra-chat-message {
                display: flex;
                gap: 8px;
                max-width: 85%;
            }

            .axyra-chat-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }

            .axyra-chat-message-avatar {
                width: 28px;
                height: 28px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                flex-shrink: 0;
            }

            .axyra-chat-message.user .axyra-chat-message-avatar {
                background: #667eea;
                color: white;
            }

            .axyra-chat-message.assistant .axyra-chat-message-avatar {
                background: #f0f0f0;
                color: #333;
            }

            .axyra-chat-message-content {
                background: white;
                padding: 10px 14px;
                border-radius: 18px;
                font-size: 14px;
                line-height: 1.4;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .axyra-chat-message.user .axyra-chat-message-content {
                background: #667eea;
                color: white;
            }

            .axyra-chat-input-container {
                padding: 16px;
                background: white;
                border-top: 1px solid #e0e0e0;
            }

            .axyra-chat-personality-selector {
                margin-bottom: 8px;
            }

            .axyra-chat-personality-selector select {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
                font-size: 12px;
                background: white;
            }

            .axyra-chat-input-wrapper {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .axyra-chat-input-wrapper input {
                flex: 1;
                padding: 10px 14px;
                border: 1px solid #e0e0e0;
                border-radius: 20px;
                font-size: 14px;
                outline: none;
            }

            .axyra-chat-input-wrapper input:focus {
                border-color: #667eea;
            }

            .axyra-chat-send-btn {
                width: 40px;
                height: 40px;
                background: #667eea;
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .axyra-chat-send-btn:hover {
                background: #5a6fd8;
                transform: scale(1.05);
            }

            .axyra-chat-typing {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #666;
                font-size: 12px;
                font-style: italic;
            }

            .axyra-chat-typing-dots {
                display: flex;
                gap: 2px;
            }

            .axyra-chat-typing-dot {
                width: 4px;
                height: 4px;
                background: #667eea;
                border-radius: 50%;
                animation: typing 1.4s infinite;
            }

            .axyra-chat-typing-dot:nth-child(2) {
                animation-delay: 0.2s;
            }

            .axyra-chat-typing-dot:nth-child(3) {
                animation-delay: 0.4s;
            }

            @keyframes typing {
                0%, 60%, 100% {
                    transform: translateY(0);
                }
                30% {
                    transform: translateY(-10px);
                }
            }

            @media (max-width: 480px) {
                #axyra-chat-container {
                    bottom: 10px;
                    right: 10px;
                    left: 10px;
                }

                .axyra-chat-widget {
                    width: 100%;
                    height: 400px;
                }
            }
        `;

    document.head.appendChild(styles);
    document.body.appendChild(chatContainer);
  }

  setupEventListeners() {
    // Event listeners ya están en el HTML
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    const widget = document.querySelector('.axyra-chat-widget');
    const body = document.getElementById('axyra-chat-body');

    if (this.isOpen) {
      widget.classList.add('open');
      body.style.display = 'flex';
      document.getElementById('axyra-chat-input').focus();
    } else {
      widget.classList.remove('open');
      body.style.display = 'none';
    }
  }

  changePersonality(personality) {
    this.currentPersonality = personality;
    const personalityData = this.personalities[personality];

    // Actualizar header
    const header = document.querySelector('.axyra-chat-header-content');
    header.innerHTML = `
            <div class="axyra-chat-avatar">${personalityData.icon}</div>
            <div class="axyra-chat-info">
                <h4>${personalityData.name}</h4>
                <p>${personalityData.description}</p>
            </div>
        `;

    // Agregar mensaje de cambio de personalidad
    this.addMessage(
      'assistant',
      `¡Hola! Ahora soy ${personalityData.name}. ${personalityData.description}. ¿En qué puedo ayudarte?`
    );
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  sendQuickMessage(message) {
    document.getElementById('axyra-chat-input').value = message;
    this.sendMessage();
  }

  sendMessage() {
    const input = document.getElementById('axyra-chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Agregar mensaje del usuario
    this.addMessage('user', message);
    input.value = '';

    // Mostrar indicador de escritura
    this.showTypingIndicator();

    // Simular respuesta de IA
    setTimeout(() => {
      this.hideTypingIndicator();
      this.generateAIResponse(message);
    }, 1000 + Math.random() * 2000);
  }

  addMessage(sender, content) {
    const messagesContainer = document.getElementById('axyra-chat-messages');
    const personalityData = this.personalities[this.currentPersonality];

    const messageDiv = document.createElement('div');
    messageDiv.className = `axyra-chat-message ${sender}`;

    const avatar = sender === 'user' ? '👤' : personalityData.icon;

    messageDiv.innerHTML = `
            <div class="axyra-chat-message-avatar">${avatar}</div>
            <div class="axyra-chat-message-content">${content}</div>
        `;

    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Guardar en historial
    this.messages.push({ sender, content, timestamp: Date.now() });
    this.saveChatHistory();
  }

  showTypingIndicator() {
    const messagesContainer = document.getElementById('axyra-chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'axyra-chat-typing-indicator';
    typingDiv.className = 'axyra-chat-typing';
    typingDiv.innerHTML = `
            <div class="axyra-chat-message-avatar">${this.personalities[this.currentPersonality].icon}</div>
            <div class="axyra-chat-typing-dots">
                <div class="axyra-chat-typing-dot"></div>
                <div class="axyra-chat-typing-dot"></div>
                <div class="axyra-chat-typing-dot"></div>
            </div>
        `;

    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  hideTypingIndicator() {
    const typingIndicator = document.getElementById('axyra-chat-typing-indicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  generateAIResponse(userMessage) {
    const personalityData = this.personalities[this.currentPersonality];
    const context = personalityData.context;

    // Respuestas predefinidas basadas en la personalidad y contexto
    let response = this.getContextualResponse(userMessage, this.currentPersonality);

    this.addMessage('assistant', response);
  }

  getContextualResponse(message, personality) {
    const lowerMessage = message.toLowerCase();

    const responses = {
      axyra: {
        empleados:
          'Para gestionar empleados en AXYRA, ve al módulo "Empleados" donde puedes agregar, editar y administrar toda la información de tu personal. ¿Te gustaría que te explique alguna función específica?',
        nómina:
          'El módulo de nómina calcula automáticamente salarios, recargos nocturnos, dominicales y festivos. Solo necesitas configurar los datos de los empleados y el sistema hace el resto. ¿Necesitas ayuda con algún cálculo específico?',
        horas:
          'El control de horas te permite registrar entrada/salida, horas extras y generar reportes de tiempo trabajado. Es muy fácil de usar y se integra automáticamente con la nómina.',
        reportes:
          'AXYRA genera reportes automáticamente: nóminas, horas trabajadas, análisis financiero y más. Puedes exportarlos en PDF o Excel. ¿Qué tipo de reporte necesitas?',
        configuración:
          'En configuración puedes personalizar parámetros del sistema, datos de la empresa, políticas laborales y más. ¿Qué aspecto te gustaría configurar?',
        ayuda:
          'Estoy aquí para ayudarte con cualquier consulta sobre AXYRA. Puedes preguntarme sobre empleados, nóminas, horas, reportes o cualquier funcionalidad del sistema.',
        default:
          'Entiendo tu consulta. AXYRA es un sistema completo de gestión empresarial. ¿Podrías ser más específico sobre qué funcionalidad necesitas? Puedo ayudarte con empleados, nóminas, horas, reportes o configuración.',
      },
      hr: {
        contrato:
          'Para gestionar contratos, ve al módulo de empleados y selecciona "Contratos". Puedes crear, modificar y hacer seguimiento a todos los contratos laborales.',
        política:
          'Las políticas laborales se configuran en el módulo de configuración. Puedes establecer horarios, días festivos, políticas de vacaciones y más.',
        evaluación:
          'AXYRA incluye herramientas para evaluaciones de desempeño. Ve al módulo de empleados y busca "Evaluaciones" para más detalles.',
        default:
          'Como especialista en RRHH, puedo ayudarte con contratos, políticas laborales, evaluaciones de desempeño y mejores prácticas de gestión de personal. ¿En qué área específica necesitas ayuda?',
      },
      finance: {
        salario:
          'Para calcular salarios, el sistema considera el salario base, horas trabajadas, recargos nocturnos (35%), dominicales (75%) y festivos (100%). ¿Necesitas ayuda con algún cálculo específico?',
        recargo:
          'Los recargos se calculan automáticamente: nocturno 35%, dominical 75%, festivo 100%. El sistema identifica automáticamente las horas que aplican para cada recargo.',
        liquidación:
          'La liquidación incluye salario base, recargos, deducciones (salud, pensión, etc.) y prestaciones. Todo se calcula automáticamente según la legislación colombiana.',
        default:
          'Como analista financiero, puedo ayudarte con cálculos de nómina, recargos, deducciones, prestaciones y análisis financiero. ¿Qué aspecto financiero necesitas revisar?',
      },
      tech: {
        error:
          'Si encuentras un error, primero intenta recargar la página. Si persiste, verifica tu conexión a internet y contacta soporte técnico en axyra.app@gmail.com.',
        lento:
          'Si el sistema está lento, verifica tu conexión a internet y cierra otras pestañas del navegador. También puedes limpiar la caché del navegador.',
        configuración:
          'Para problemas de configuración, ve al módulo de configuración y verifica que todos los campos estén completos. Si necesitas ayuda específica, contacta soporte.',
        default:
          'Como especialista técnico, puedo ayudarte con problemas de rendimiento, errores, configuración y optimización del sistema. ¿Qué problema técnico estás experimentando?',
      },
    };

    const personalityResponses = responses[personality] || responses['axyra'];

    // Buscar respuesta específica
    for (const [keyword, response] of Object.entries(personalityResponses)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    return personalityResponses['default'];
  }

  loadChatHistory() {
    const saved = localStorage.getItem('axyra_chat_history');
    if (saved) {
      this.messages = JSON.parse(saved);
      // Mostrar últimos 10 mensajes
      const recentMessages = this.messages.slice(-10);
      recentMessages.forEach((msg) => {
        if (msg.sender !== 'user') {
          const personalityData = this.personalities[this.currentPersonality];
          msg.avatar = personalityData.icon;
        }
      });
    }
  }

  saveChatHistory() {
    // Guardar solo los últimos 50 mensajes
    const recentMessages = this.messages.slice(-50);
    localStorage.setItem('axyra_chat_history', JSON.stringify(recentMessages));
  }
}

// Inicializar el chat cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAIChat = new AxyraAIChat();
});

console.log('✅ Sistema de chat con IA cargado');
