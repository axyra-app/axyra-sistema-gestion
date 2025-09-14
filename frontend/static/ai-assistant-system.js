// ========================================
// SISTEMA DE IA AVANZADO AXYRA
// ========================================

class AxyraAIAssistant {
  constructor() {
    this.config = {
      apiKey: process.env.OPENAI_API_KEY || 'YOUR_OPENAI_API_KEY',
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: this.getSystemPrompt(),
    };
    
    this.conversationHistory = [];
    this.isInitialized = false;
    this.isTyping = false;
    this.currentContext = 'general';
    
    this.personalities = {
      general: 'Asistente general de AXYRA',
      admin: 'Asistente administrativo especializado',
      technical: 'Asistente técnico para desarrolladores',
      friendly: 'Asistente amigable y conversacional',
      professional: 'Asistente profesional y formal',
    };
    
    this.init();
  }

  init() {
    console.log('🤖 Inicializando IA Avanzada AXYRA...');
    this.setupUI();
    this.loadConversationHistory();
    this.setupEventListeners();
    this.isInitialized = true;
    console.log('✅ IA Avanzada inicializada correctamente');
  }

  // CONFIGURAR INTERFAZ DE USUARIO
  setupUI() {
    // Crear contenedor de IA
    const aiContainer = document.createElement('div');
    aiContainer.id = 'axyra-ai-assistant';
    aiContainer.className = 'ai-assistant-container';
    aiContainer.innerHTML = `
      <div class="ai-header">
        <div class="ai-title">
          <i class="fas fa-robot"></i>
          <span>AXYRA AI Assistant</span>
        </div>
        <div class="ai-controls">
          <button class="ai-toggle" id="aiToggle">
            <i class="fas fa-comments"></i>
          </button>
          <button class="ai-clear" id="aiClear" title="Limpiar conversación">
            <i class="fas fa-trash"></i>
          </button>
          <button class="ai-settings" id="aiSettings" title="Configuración">
            <i class="fas fa-cog"></i>
          </button>
        </div>
      </div>
      
      <div class="ai-chat-container" id="aiChatContainer">
        <div class="ai-messages" id="aiMessages">
          <div class="ai-message ai-assistant-message">
            <div class="ai-avatar">
              <i class="fas fa-robot"></i>
            </div>
            <div class="ai-content">
              <div class="ai-text">
                ¡Hola! Soy AXYRA AI, tu asistente inteligente. ¿En qué puedo ayudarte hoy?
              </div>
              <div class="ai-time">${new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
        
        <div class="ai-input-container">
          <div class="ai-input-wrapper">
            <input type="text" id="aiInput" placeholder="Escribe tu mensaje..." autocomplete="off">
            <button id="aiSend" class="ai-send-btn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
          <div class="ai-suggestions" id="aiSuggestions">
            <button class="ai-suggestion" data-message="¿Cómo funciona el sistema de gestión?">
              ¿Cómo funciona el sistema?
            </button>
            <button class="ai-suggestion" data-message="Ayúdame con la configuración de usuarios">
              Configuración de usuarios
            </button>
            <button class="ai-suggestion" data-message="Explícame las funciones del admin panel">
              Funciones del admin
            </button>
            <button class="ai-suggestion" data-message="¿Qué optimizaciones tiene el sistema?">
              Optimizaciones del sistema
            </button>
          </div>
        </div>
      </div>
      
      <div class="ai-settings-panel" id="aiSettingsPanel">
        <div class="ai-settings-header">
          <h3>Configuración de IA</h3>
          <button class="ai-close-settings" id="aiCloseSettings">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="ai-settings-content">
          <div class="ai-setting-group">
            <label>Personalidad:</label>
            <select id="aiPersonality">
              <option value="general">General</option>
              <option value="admin">Administrativa</option>
              <option value="technical">Técnica</option>
              <option value="friendly">Amigable</option>
              <option value="professional">Profesional</option>
            </select>
          </div>
          
          <div class="ai-setting-group">
            <label>Contexto:</label>
            <select id="aiContext">
              <option value="general">General</option>
              <option value="dashboard">Dashboard</option>
              <option value="users">Gestión de Usuarios</option>
              <option value="reports">Reportes</option>
              <option value="settings">Configuración</option>
            </select>
          </div>
          
          <div class="ai-setting-group">
            <label>Creatividad:</label>
            <input type="range" id="aiCreativity" min="0" max="1" step="0.1" value="0.7">
            <span id="aiCreativityValue">0.7</span>
          </div>
          
          <div class="ai-setting-group">
            <label>Respuestas largas:</label>
            <input type="range" id="aiMaxTokens" min="100" max="4000" step="100" value="2000">
            <span id="aiMaxTokensValue">2000</span>
          </div>
        </div>
      </div>
    `;
    
    // Agregar estilos
    this.addStyles();
    
    // Agregar al DOM
    document.body.appendChild(aiContainer);
  }

  // AGREGAR ESTILOS CSS
  addStyles() {
    const styles = document.createElement('style');
    styles.textContent = `
      .ai-assistant-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        height: 600px;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        border: 2px solid #667eea;
        display: none;
        flex-direction: column;
        z-index: 10000;
        font-family: 'Segoe UI', sans-serif;
      }
      
      .ai-assistant-container.active {
        display: flex;
      }
      
      .ai-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 13px 13px 0 0;
        color: white;
      }
      
      .ai-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
        font-size: 16px;
      }
      
      .ai-controls {
        display: flex;
        gap: 10px;
      }
      
      .ai-controls button {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 8px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.3s;
      }
      
      .ai-controls button:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      .ai-chat-container {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      
      .ai-messages {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 15px;
      }
      
      .ai-message {
        display: flex;
        gap: 10px;
        animation: fadeInUp 0.3s ease;
      }
      
      .ai-user-message {
        flex-direction: row-reverse;
      }
      
      .ai-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
      }
      
      .ai-assistant-message .ai-avatar {
        background: linear-gradient(135deg, #667eea, #764ba2);
        color: white;
      }
      
      .ai-user-message .ai-avatar {
        background: linear-gradient(135deg, #48bb78, #38a169);
        color: white;
      }
      
      .ai-content {
        flex: 1;
        max-width: 80%;
      }
      
      .ai-text {
        background: rgba(255, 255, 255, 0.1);
        padding: 12px 16px;
        border-radius: 12px;
        color: white;
        line-height: 1.5;
        word-wrap: break-word;
      }
      
      .ai-user-message .ai-text {
        background: linear-gradient(135deg, #48bb78, #38a169);
      }
      
      .ai-time {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.6);
        margin-top: 5px;
        text-align: right;
      }
      
      .ai-input-container {
        padding: 20px;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .ai-input-wrapper {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
      }
      
      .ai-input-wrapper input {
        flex: 1;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 25px;
        padding: 12px 20px;
        color: white;
        font-size: 14px;
        outline: none;
      }
      
      .ai-input-wrapper input::placeholder {
        color: rgba(255, 255, 255, 0.6);
      }
      
      .ai-send-btn {
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        color: white;
        padding: 12px 16px;
        border-radius: 50%;
        cursor: pointer;
        transition: transform 0.2s;
      }
      
      .ai-send-btn:hover {
        transform: scale(1.05);
      }
      
      .ai-suggestions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .ai-suggestion {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: white;
        padding: 8px 12px;
        border-radius: 20px;
        font-size: 12px;
        cursor: pointer;
        transition: background 0.3s;
      }
      
      .ai-suggestion:hover {
        background: rgba(255, 255, 255, 0.2);
      }
      
      .ai-settings-panel {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        border-radius: 15px;
        padding: 20px;
        display: none;
        flex-direction: column;
      }
      
      .ai-settings-panel.active {
        display: flex;
      }
      
      .ai-settings-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      .ai-settings-header h3 {
        color: white;
        margin: 0;
      }
      
      .ai-close-settings {
        background: none;
        border: none;
        color: white;
        font-size: 18px;
        cursor: pointer;
      }
      
      .ai-settings-content {
        flex: 1;
        overflow-y: auto;
      }
      
      .ai-setting-group {
        margin-bottom: 20px;
      }
      
      .ai-setting-group label {
        display: block;
        color: white;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .ai-setting-group select,
      .ai-setting-group input[type="range"] {
        width: 100%;
        padding: 8px 12px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 6px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        outline: none;
      }
      
      .ai-setting-group select option {
        background: #1a1a2e;
        color: white;
      }
      
      .ai-toggle {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border: none;
        border-radius: 50%;
        color: white;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        transition: transform 0.3s, box-shadow 0.3s;
        z-index: 9999;
      }
      
      .ai-toggle:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
      }
      
      .ai-typing {
        display: flex;
        align-items: center;
        gap: 5px;
        color: rgba(255, 255, 255, 0.7);
        font-style: italic;
      }
      
      .ai-typing-dots {
        display: flex;
        gap: 3px;
      }
      
      .ai-typing-dots span {
        width: 6px;
        height: 6px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 50%;
        animation: typing 1.4s infinite;
      }
      
      .ai-typing-dots span:nth-child(2) {
        animation-delay: 0.2s;
      }
      
      .ai-typing-dots span:nth-child(3) {
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
      
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      .ai-message code {
        background: rgba(0, 0, 0, 0.3);
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
      }
      
      .ai-message pre {
        background: rgba(0, 0, 0, 0.3);
        padding: 10px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 10px 0;
      }
      
      .ai-message ul, .ai-message ol {
        margin: 10px 0;
        padding-left: 20px;
      }
      
      .ai-message li {
        margin: 5px 0;
      }
      
      .ai-message strong {
        color: #667eea;
      }
      
      .ai-message em {
        color: #48bb78;
      }
    `;
    
    document.head.appendChild(styles);
  }

  // CONFIGURAR EVENT LISTENERS
  setupEventListeners() {
    // Toggle del asistente
    document.getElementById('aiToggle').addEventListener('click', () => {
      this.toggleAssistant();
    });
    
    // Limpiar conversación
    document.getElementById('aiClear').addEventListener('click', () => {
      this.clearConversation();
    });
    
    // Configuración
    document.getElementById('aiSettings').addEventListener('click', () => {
      this.toggleSettings();
    });
    
    document.getElementById('aiCloseSettings').addEventListener('click', () => {
      this.toggleSettings();
    });
    
    // Enviar mensaje
    document.getElementById('aiSend').addEventListener('click', () => {
      this.sendMessage();
    });
    
    document.getElementById('aiInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
    
    // Sugerencias
    document.querySelectorAll('.ai-suggestion').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const message = e.target.getAttribute('data-message');
        document.getElementById('aiInput').value = message;
        this.sendMessage();
      });
    });
    
    // Configuración de personalidad
    document.getElementById('aiPersonality').addEventListener('change', (e) => {
      this.changePersonality(e.target.value);
    });
    
    // Configuración de contexto
    document.getElementById('aiContext').addEventListener('change', (e) => {
      this.changeContext(e.target.value);
    });
    
    // Configuración de creatividad
    document.getElementById('aiCreativity').addEventListener('input', (e) => {
      this.config.temperature = parseFloat(e.target.value);
      document.getElementById('aiCreativityValue').textContent = e.target.value;
    });
    
    // Configuración de tokens
    document.getElementById('aiMaxTokens').addEventListener('input', (e) => {
      this.config.maxTokens = parseInt(e.target.value);
      document.getElementById('aiMaxTokensValue').textContent = e.target.value;
    });
  }

  // TOGGLE DEL ASISTENTE
  toggleAssistant() {
    const container = document.getElementById('axyra-ai-assistant');
    container.classList.toggle('active');
    
    if (container.classList.contains('active')) {
      document.getElementById('aiInput').focus();
    }
  }

  // TOGGLE DE CONFIGURACIÓN
  toggleSettings() {
    const settingsPanel = document.getElementById('aiSettingsPanel');
    settingsPanel.classList.toggle('active');
  }

  // CAMBIAR PERSONALIDAD
  changePersonality(personality) {
    this.currentPersonality = personality;
    this.config.systemPrompt = this.getSystemPrompt();
    this.addMessage('assistant', `Personalidad cambiada a: ${this.personalities[personality]}`);
  }

  // CAMBIAR CONTEXTO
  changeContext(context) {
    this.currentContext = context;
    this.addMessage('assistant', `Contexto cambiado a: ${context}`);
  }

  // OBTENER PROMPT DEL SISTEMA
  getSystemPrompt() {
    const basePrompt = `Eres AXYRA AI, un asistente inteligente especializado en el sistema de gestión empresarial AXYRA. 
    
    INFORMACIÓN DEL SISTEMA:
    - Sistema de gestión empresarial completo
    - Panel de administración con modo DIOS
    - Gestión de usuarios, facturas, inventario, nómina
    - Integración con Firebase
    - Sistema de optimización avanzado
    - EmailJS para notificaciones
    - Interfaz moderna y responsiva
    
    PERSONALIDAD: ${this.personalities[this.currentPersonality]}
    CONTEXTO: ${this.currentContext}
    
    INSTRUCCIONES:
    1. Responde de manera útil y precisa
    2. Usa emojis apropiados para hacer la conversación más amigable
    3. Proporciona ejemplos de código cuando sea relevante
    4. Mantén un tono profesional pero accesible
    5. Si no sabes algo, admítelo y ofrece alternativas
    6. Usa markdown para formatear respuestas largas
    7. Incluye enlaces y referencias cuando sea útil
    
    RESPUESTA EN ESPAÑOL.`;
    
    return basePrompt;
  }

  // ENVIAR MENSAJE
  async sendMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    this.addMessage('user', message);
    input.value = '';
    
    // Mostrar indicador de escritura
    this.showTypingIndicator();
    
    try {
      // Procesar mensaje con IA
      const response = await this.processMessage(message);
      
      // Ocultar indicador de escritura
      this.hideTypingIndicator();
      
      // Agregar respuesta de la IA
      this.addMessage('assistant', response);
      
      // Guardar en historial
      this.saveConversationHistory();
      
    } catch (error) {
      console.error('Error procesando mensaje:', error);
      this.hideTypingIndicator();
      this.addMessage('assistant', 'Lo siento, hubo un error procesando tu mensaje. Por favor, inténtalo de nuevo.');
    }
  }

  // PROCESAR MENSAJE CON IA
  async processMessage(message) {
    // Simular respuesta de IA (en producción usarías OpenAI API)
    const responses = this.getMockResponses(message);
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    return responses;
  }

  // OBTENER RESPUESTAS MOCK (para demo)
  getMockResponses(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('hola') || lowerMessage.includes('hi')) {
      return `¡Hola! 👋 Soy AXYRA AI, tu asistente inteligente. Estoy aquí para ayudarte con cualquier pregunta sobre el sistema de gestión AXYRA. ¿En qué puedo asistirte hoy?`;
    }
    
    if (lowerMessage.includes('sistema') || lowerMessage.includes('funciona')) {
      return `## 🚀 Sistema AXYRA de Gestión Empresarial
      
      **AXYRA** es un sistema completo de gestión empresarial que incluye:
      
      ### 📊 **Módulos Principales**
      - **Dashboard**: Panel principal con métricas y gráficos
      - **Gestión de Usuarios**: Administración completa de usuarios y roles
      - **Facturación**: Generación y gestión de facturas
      - **Inventario**: Control de stock y productos
      - **Nómina**: Gestión de empleados y salarios
      - **Reportes**: Análisis y reportes detallados
      
      ### 🔧 **Características Técnicas**
      - **Frontend**: HTML5, CSS3, JavaScript ES6+
      - **Backend**: Firebase Firestore
      - **Autenticación**: Firebase Auth
      - **Optimización**: Service Workers, Lazy Loading
      - **Email**: EmailJS para notificaciones
      - **IA**: Asistente inteligente integrado
      
      ¿Te gustaría que profundice en algún módulo específico? 🤔`;
    }
    
    if (lowerMessage.includes('admin') || lowerMessage.includes('panel')) {
      return `## 🎛️ Panel de Administración AXYRA
      
      El **admin-brutal** es el corazón del sistema con:
      
      ### 🔥 **Modo DIOS**
      - Acceso completo a todas las funciones
      - Gestión masiva de usuarios
      - Control total del sistema
      - Monitoreo en tiempo real
      
      ### 👥 **Gestión de Usuarios**
      - Crear, editar, eliminar usuarios
      - Asignar roles y permisos
      - Suspender/activar cuentas
      - Cambiar planes de suscripción
      
      ### 📊 **Funciones Avanzadas**
      - Gráficos interactivos con Chart.js
      - Filtros y búsqueda avanzada
      - Acciones masivas
      - Exportación de datos
      
      ### 🎨 **Interfaz Moderna**
      - Diseño responsivo
      - Tema oscuro profesional
      - Animaciones suaves
      - Modales personalizados
      
      ¿Quieres que te muestre cómo usar alguna función específica? 💪`;
    }
    
    if (lowerMessage.includes('optimización') || lowerMessage.includes('rendimiento')) {
      return `## ⚡ Optimizaciones del Sistema AXYRA
      
      El sistema está optimizado con tecnologías de vanguardia:
      
      ### 🚀 **Optimizaciones Implementadas**
      - **Service Worker**: Cache inteligente
      - **Lazy Loading**: Carga bajo demanda
      - **Code Splitting**: División de código
      - **Tree Shaking**: Eliminación de código no usado
      - **Compresión**: Minificación de recursos
      - **Imágenes**: Optimización automática
      
      ### 📈 **Métricas de Rendimiento**
      - **Tiempo de carga**: Reducido 40-60%
      - **Tamaño de recursos**: Reducido 30-50%
      - **Core Web Vitals**: Optimizados
      - **Cache Hit Rate**: 80%+
      
      ### 🔧 **Herramientas de Monitoreo**
      - Métricas en tiempo real
      - Análisis de rendimiento
      - Detección de errores
      - Optimización automática
      
      ¿Te interesa conocer más sobre alguna optimización específica? 🔍`;
    }
    
    if (lowerMessage.includes('email') || lowerMessage.includes('notificación')) {
      return `## 📧 Sistema de Email AXYRA
      
      Configurado con **EmailJS** para notificaciones automáticas:
      
      ### 📬 **Tipos de Email**
      - **Bienvenida**: Para nuevos usuarios
      - **Recuperación**: Restablecer contraseñas
      - **Notificaciones**: Alertas del sistema
      - **Facturas**: Envío automático
      - **Reportes**: Resúmenes periódicos
      - **Alertas**: Notificaciones críticas
      
      ### ⚙️ **Configuración**
      - **Servicio**: Gmail conectado
      - **Plantillas**: 6 plantillas personalizadas
      - **Límite**: 200 emails/mes (gratis)
      - **Rate Limit**: 10 emails/minuto
      
      ### 🎨 **Plantillas Personalizadas**
      - Diseño profesional
      - Variables dinámicas
      - Responsive design
      - Branding AXYRA
      
      ¿Necesitas ayuda configurando algún tipo de email? 📮`;
    }
    
    if (lowerMessage.includes('error') || lowerMessage.includes('problema')) {
      return `## 🚨 Solución de Problemas AXYRA
      
      Te ayudo a resolver cualquier problema:
      
      ### 🔍 **Diagnóstico Rápido**
      1. **Verifica la consola** del navegador (F12)
      2. **Revisa la conexión** a Firebase
      3. **Comprueba las credenciales** de EmailJS
      4. **Limpia el cache** del navegador
      
      ### 🛠️ **Soluciones Comunes**
      - **Error de Firebase**: Verifica las credenciales
      - **Email no enviado**: Revisa EmailJS configuration
      - **UI no carga**: Limpia cache y recarga
      - **Datos no aparecen**: Verifica Firestore rules
      
      ### 📞 **Soporte Técnico**
      - **Logs detallados** en consola
      - **Monitoreo automático** de errores
      - **Sistema de alertas** integrado
      
      ¿Qué error específico estás viendo? Te ayudo a solucionarlo. 🔧`;
    }
    
    if (lowerMessage.includes('código') || lowerMessage.includes('code')) {
      return `## 💻 Código y Desarrollo AXYRA
      
      El sistema está construido con las mejores prácticas:
      
      ### 🏗️ **Arquitectura**
      \`\`\`javascript
      // Estructura modular
      class AxyraSystem {
        constructor() {
          this.modules = {
            admin: new AdminModule(),
            users: new UserModule(),
            email: new EmailModule(),
            ai: new AIModule()
          };
        }
      }
      \`\`\`
      
      ### 🔧 **Tecnologías**
      - **Frontend**: Vanilla JavaScript ES6+
      - **Styling**: CSS3 con Flexbox/Grid
      - **Backend**: Firebase Firestore
      - **Auth**: Firebase Authentication
      - **Email**: EmailJS
      - **Charts**: Chart.js
      
      ### 📁 **Estructura de Archivos**
      \`\`\`
      frontend/
      ├── static/
      │   ├── admin-brutal-functions.js
      │   ├── admin-god-mode.js
      │   ├── emailjs-system.js
      │   └── ai-assistant-system.js
      ├── modulos/
      └── admin-brutal.html
      \`\`\`
      
      ¿Quieres ver algún código específico o necesitas ayuda con el desarrollo? 🚀`;
    }
    
    // Respuesta por defecto
    return `¡Interesante pregunta! 🤔 

    Aunque no tengo una respuesta específica para "${message}", puedo ayudarte con:
    
    - **Funcionamiento del sistema** AXYRA
    - **Configuración** de módulos
    - **Solución de problemas** técnicos
    - **Optimizaciones** de rendimiento
    - **Desarrollo** y código
    - **Email** y notificaciones
    
    ¿Podrías reformular tu pregunta o ser más específico? Estoy aquí para ayudarte. 😊`;
  }

  // AGREGAR MENSAJE AL CHAT
  addMessage(sender, content) {
    const messagesContainer = document.getElementById('aiMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `ai-message ai-${sender}-message`;
    
    const time = new Date().toLocaleTimeString();
    
    messageDiv.innerHTML = `
      <div class="ai-avatar">
        <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
      </div>
      <div class="ai-content">
        <div class="ai-text">${this.formatMessage(content)}</div>
        <div class="ai-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Agregar al historial
    this.conversationHistory.push({
      sender,
      content,
      timestamp: new Date().toISOString()
    });
  }

  // FORMATEAR MENSAJE (markdown básico)
  formatMessage(content) {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
      .replace(/\n/g, '<br>');
  }

  // MOSTRAR INDICADOR DE ESCRITURA
  showTypingIndicator() {
    const messagesContainer = document.getElementById('aiMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'ai-message ai-assistant-message ai-typing';
    typingDiv.id = 'aiTypingIndicator';
    
    typingDiv.innerHTML = `
      <div class="ai-avatar">
        <i class="fas fa-robot"></i>
      </div>
      <div class="ai-content">
        <div class="ai-text">
          <span>AXYRA AI está escribiendo</span>
          <div class="ai-typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // OCULTAR INDICADOR DE ESCRITURA
  hideTypingIndicator() {
    const typingIndicator = document.getElementById('aiTypingIndicator');
    if (typingIndicator) {
      typingIndicator.remove();
    }
  }

  // LIMPIAR CONVERSACIÓN
  clearConversation() {
    const messagesContainer = document.getElementById('aiMessages');
    messagesContainer.innerHTML = `
      <div class="ai-message ai-assistant-message">
        <div class="ai-avatar">
          <i class="fas fa-robot"></i>
        </div>
        <div class="ai-content">
          <div class="ai-text">
            ¡Conversación limpiada! ¿En qué puedo ayudarte ahora?
          </div>
          <div class="ai-time">${new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    `;
    
    this.conversationHistory = [];
    this.saveConversationHistory();
  }

  // CARGAR HISTORIAL DE CONVERSACIÓN
  loadConversationHistory() {
    const saved = localStorage.getItem('axyra-ai-conversation');
    if (saved) {
      this.conversationHistory = JSON.parse(saved);
    }
  }

  // GUARDAR HISTORIAL DE CONVERSACIÓN
  saveConversationHistory() {
    localStorage.setItem('axyra-ai-conversation', JSON.stringify(this.conversationHistory));
  }

  // OBTENER ESTADO DEL SISTEMA
  getSystemStatus() {
    return {
      initialized: this.isInitialized,
      personality: this.currentPersonality,
      context: this.currentContext,
      conversationLength: this.conversationHistory.length,
      config: this.config,
      timestamp: new Date().toISOString(),
    };
  }
}

// Inicializar IA Assistant
document.addEventListener('DOMContentLoaded', () => {
  window.axyraAI = new AxyraAIAssistant();
});

// Exportar para uso global
window.AxyraAIAssistant = AxyraAIAssistant;
