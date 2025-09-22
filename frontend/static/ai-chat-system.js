/**
 * 🤖 SISTEMA DE CHAT CON IA AVANZADO - AXYRA
 */

class AIChatSystem {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.context = {
            currentModule: null,
            userRole: 'admin',
            companyId: null,
            sessionId: this.generateSessionId()
        };
        
        this.knowledgeBase = this.initializeKnowledgeBase();
        this.init();
    }

    init() {
        this.createChatInterface();
        this.setupEventListeners();
        this.loadChatHistory();
        console.log('🤖 Sistema de Chat IA inicializado');
    }

    createChatInterface() {
        const chatHTML = `
            <div class="ai-chat-container" id="ai-chat-container">
                <button class="ai-chat-toggle" id="ai-chat-toggle">
                    <i class="fas fa-robot"></i>
                    <span class="ai-chat-badge" id="ai-chat-badge">0</span>
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

                    <div class="ai-chat-body">
                        <div class="ai-chat-messages" id="ai-chat-messages">
                            <div class="ai-welcome-message">
                                <div class="ai-avatar">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <div class="message-content">
                                    <p>¡Hola! Soy tu asistente de IA de AXYRA. ¿En qué puedo ayudarte hoy?</p>
                                </div>
                            </div>
                        </div>

                        <div class="ai-quick-suggestions" id="ai-quick-suggestions">
                            <button class="suggestion-btn" data-query="¿Cómo registro un nuevo empleado?">
                                <i class="fas fa-user-plus"></i>
                                Registrar empleado
                            </button>
                            <button class="suggestion-btn" data-query="¿Cómo genero una nómina?">
                                <i class="fas fa-calculator"></i>
                                Generar nómina
                            </button>
                            <button class="suggestion-btn" data-query="¿Cómo hago un corte de caja?">
                                <i class="fas fa-cash-register"></i>
                                Corte de caja
                            </button>
                        </div>

                        <div class="ai-typing-indicator" id="ai-typing-indicator">
                            <div class="ai-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="typing-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>

                    <div class="ai-chat-footer">
                        <div class="ai-chat-input-container">
                            <input type="text" id="ai-chat-input" placeholder="Escribe tu pregunta..." class="ai-chat-input">
                            <button class="ai-chat-send" id="ai-chat-send">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    setupEventListeners() {
        document.getElementById('ai-chat-toggle').addEventListener('click', () => {
            this.toggleChat();
        });

        document.getElementById('ai-chat-close').addEventListener('click', () => {
            this.closeChat();
        });

        document.getElementById('ai-chat-send').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('ai-chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const query = e.currentTarget.dataset.query;
                document.getElementById('ai-chat-input').value = query;
                this.sendMessage();
            });
        });
    }

    initializeKnowledgeBase() {
        return {
            empleados: {
                registrar: {
                    pregunta: ["registrar empleado", "nuevo empleado", "agregar empleado"],
                    respuesta: "Para registrar un nuevo empleado:\n1. Ve a 'Gestión de Personal' → 'Empleados'\n2. Haz clic en 'Nuevo Empleado'\n3. Completa los datos personales y laborales\n4. Guarda el empleado"
                }
            },
            nominas: {
                generar: {
                    pregunta: ["generar nómina", "crear nómina", "calcular nómina"],
                    respuesta: "Para generar una nómina:\n1. Ve a 'Gestión de Personal' → 'Nómina'\n2. Selecciona el período\n3. Elige los empleados a incluir\n4. Revisa los cálculos automáticos\n5. Genera el PDF de la nómina"
                }
            },
            cuadre_caja: {
                movimiento: {
                    pregunta: ["registrar movimiento", "nuevo movimiento", "movimiento de caja"],
                    respuesta: "Para registrar un movimiento de caja:\n1. Ve a 'Cuadre de Caja' → 'Movimientos'\n2. Haz clic en 'Nuevo Movimiento'\n3. Selecciona tipo (Ingreso/Egreso)\n4. Completa concepto y monto\n5. Guarda el movimiento"
                }
            }
        };
    }

    toggleChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            chatWindow.classList.add('show');
            document.getElementById('ai-chat-input').focus();
        } else {
            chatWindow.classList.remove('show');
        }
    }

    closeChat() {
        const chatWindow = document.getElementById('ai-chat-window');
        chatWindow.classList.remove('show');
        this.isOpen = false;
    }

    async sendMessage() {
        const input = document.getElementById('ai-chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        this.addMessage(message, 'user');
        input.value = '';

        this.showTypingIndicator();

        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.processMessage(message);
            this.addMessage(response.text, 'ai');
        }, 1500);
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('ai-chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const timestamp = new Date().toLocaleTimeString();
        
        if (sender === 'user') {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${timestamp}</span>
                </div>
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                    <span class="message-time">${timestamp}</span>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({
            text,
            sender,
            timestamp: new Date(),
            id: this.generateMessageId()
        });
    }

    processMessage(message) {
        const query = message.toLowerCase();
        
        for (const category in this.knowledgeBase) {
            for (const topic in this.knowledgeBase[category]) {
                const topicData = this.knowledgeBase[category][topic];
                
                for (const keyword of topicData.pregunta) {
                    if (query.includes(keyword.toLowerCase())) {
                        return { text: topicData.respuesta };
                    }
                }
            }
        }

        if (query.includes('hola') || query.includes('hi')) {
            return {
                text: "¡Hola! ¿En qué puedo ayudarte con AXYRA? Puedes preguntarme sobre empleados, nóminas, cuadre de caja o cualquier funcionalidad del sistema."
            };
        }

        return {
            text: "Entiendo tu consulta. Puedo ayudarte con gestión de empleados, nóminas, cuadre de caja y reportes. ¿Hay algo específico de estos temas en lo que pueda ayudarte?"
        };
    }

    showTypingIndicator() {
        const indicator = document.getElementById('ai-typing-indicator');
        indicator.style.display = 'flex';
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('ai-typing-indicator');
        indicator.style.display = 'none';
    }

    loadChatHistory() {
        try {
            const saved = localStorage.getItem('axyra_ai_chat_history');
            if (saved) {
                this.messages = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error cargando historial del chat:', error);
        }
    }

    generateSessionId() {
        return 'ai_session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateMessageId() {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Inicializar sistema de chat IA
document.addEventListener('DOMContentLoaded', () => {
    new AIChatSystem();
});

window.AIChatSystem = AIChatSystem;