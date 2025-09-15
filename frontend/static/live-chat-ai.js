/**
 * AXYRA Live Chat AI System
 * Sistema de chat en vivo con IA para soporte técnico
 */

class AxyraLiveChatAI {
  constructor() {
    this.isOpen = false;
    this.isMinimized = false;
    this.messages = [];
    this.isTyping = false;
    this.knowledgeBase = this.initializeKnowledgeBase();
    
    this.init();
    console.log('🤖 AXYRA Live Chat AI inicializado');
  }

  init() {
    this.createChatInterface();
    this.bindEvents();
    this.addWelcomeMessage();
  }

  initializeKnowledgeBase() {
    return {
      // Información general del sistema
      general: {
        "que es axyra": "AXYRA es un sistema integral de gestión empresarial que te permite controlar empleados, nóminas, horas de trabajo y más desde una sola plataforma. Es la solución completa para la administración de tu empresa.",
        "que hace axyra": "AXYRA te permite gestionar empleados, calcular nóminas, controlar horarios, administrar vacaciones, generar reportes, y mucho más. Todo desde una interfaz moderna y fácil de usar.",
        "beneficios de axyra": "Los principales beneficios son: automatización de procesos, ahorro de tiempo, precisión en cálculos, reportes detallados, interfaz intuitiva, y escalabilidad para empresas de cualquier tamaño.",
        "para que sirve axyra": "AXYRA sirve para digitalizar y automatizar la gestión de recursos humanos, nóminas, horarios y administración empresarial, haciendo tu empresa más eficiente y organizada."
      },
      
      // Planes y precios
      plans: {
        "planes disponibles": "AXYRA ofrece 3 planes: Básico ($49.900/mes), Profesional ($129.900/mes) y Empresarial ($259.900/mes). Cada plan incluye diferentes funcionalidades y límites de empleados.",
        "plan basico": "El plan Básico ($49.900/mes) incluye gestión de hasta 10 empleados, nóminas básicas, control de horarios y soporte por email.",
        "plan profesional": "El plan Profesional ($129.900/mes) incluye hasta 50 empleados, reportes avanzados, integraciones, chat en vivo y más funcionalidades.",
        "plan empresarial": "El plan Empresarial ($259.900/mes) incluye empleados ilimitados, todas las funcionalidades, soporte prioritario y personalización avanzada.",
        "precio de axyra": "Los precios van desde $49.900/mes para el plan Básico hasta $259.900/mes para el plan Empresarial. Todos los precios están en pesos colombianos.",
        "costo de axyra": "El costo depende del plan que elijas. El plan más económico es el Básico a $49.900/mes, ideal para pequeñas empresas."
      },
      
      // Funcionalidades técnicas
      features: {
        "funcionalidades de axyra": "AXYRA incluye: gestión de empleados, cálculo de nóminas, control de horarios, administración de vacaciones, reportes detallados, dashboard interactivo, y sistema de notificaciones.",
        "gestion de empleados": "Puedes agregar, editar y administrar información de empleados, incluyendo datos personales, salarios, horarios de trabajo y más.",
        "calculo de nominas": "AXYRA calcula automáticamente nóminas considerando salarios, horas extras, descuentos, bonificaciones y retenciones según la legislación colombiana.",
        "control de horarios": "El sistema permite registrar entrada y salida de empleados, calcular horas trabajadas y generar reportes de asistencia.",
        "reportes disponibles": "Puedes generar reportes de nóminas, asistencia, horas trabajadas, gastos por empleado, y reportes personalizados según tus necesidades.",
        "dashboard": "El dashboard te muestra estadísticas en tiempo real, gráficos de productividad, resúmenes de nóminas y métricas importantes de tu empresa."
      },
      
      // Límites y restricciones
      limits: {
        "limite de empleados": "El límite depende de tu plan: Básico (10 empleados), Profesional (50 empleados), Empresarial (empleados ilimitados).",
        "usuarios en plan gratuito": "El plan gratuito permite hasta 3 empleados y funcionalidades básicas para que puedas probar el sistema.",
        "restricciones del plan gratuito": "El plan gratuito incluye solo las funcionalidades básicas y está limitado a 3 empleados. Para más funcionalidades necesitas actualizar tu plan.",
        "que incluye el plan gratuito": "El plan gratuito incluye: gestión básica de 3 empleados, cálculo simple de nóminas, y acceso limitado a reportes."
      },
      
      // Soporte y ayuda
      support: {
        "como obtener soporte": "Puedes obtener soporte a través de email (axyra.app@gmail.com), chat en vivo (horario laboral), o WhatsApp Business para respuestas rápidas.",
        "horario de soporte": "Nuestro soporte está disponible de lunes a viernes de 8:00 AM a 6:00 PM (hora Colombia). El chat en vivo está disponible en horario laboral.",
        "contacto de soporte": "Puedes contactarnos por email: axyra.app@gmail.com, chat en vivo en esta página, o WhatsApp Business para soporte inmediato.",
        "tiempo de respuesta": "Respondemos emails en menos de 24 horas, chat en vivo en tiempo real, y WhatsApp en minutos durante horario laboral."
      },
      
      // Seguridad y privacidad
      security: {
        "seguridad de datos": "AXYRA utiliza encriptación de extremo a extremo, servidores seguros, y cumple con estándares internacionales de seguridad de datos.",
        "privacidad de informacion": "Tu información está protegida con las más altas medidas de seguridad. No compartimos datos con terceros y cumplimos con la normativa de protección de datos.",
        "backup de datos": "Realizamos respaldos automáticos diarios de toda la información para garantizar que nunca pierdas tus datos.",
        "acceso a datos": "Solo tú y tu equipo autorizado pueden acceder a los datos de tu empresa. Cada usuario tiene permisos específicos según su rol."
      },
      
      // Implementación y uso
      implementation: {
        "como empezar": "Para empezar, regístrate en AXYRA, elige tu plan, y comienza agregando tus empleados. El sistema te guiará paso a paso.",
        "tiempo de implementacion": "La implementación básica toma menos de 1 hora. Puedes tener tu empresa funcionando en AXYRA el mismo día que te registres.",
        "migracion de datos": "Ofrecemos asistencia gratuita para migrar datos de otros sistemas. Nuestro equipo te ayuda con la importación de información existente.",
        "capacitacion": "Incluimos capacitación gratuita para ti y tu equipo. Videos tutoriales, documentación completa y soporte personalizado."
      }
    };
  }

  createChatInterface() {
    // Crear contenedor principal
    const chatContainer = document.createElement('div');
    chatContainer.id = 'axyra-live-chat';
    chatContainer.innerHTML = `
      <div class="axyra-chat-toggle" id="chatToggle">
        <div class="axyra-chat-icon">
          <img src="logo.png" alt="AXYRA" class="axyra-chat-logo" />
        </div>
        <div class="axyra-chat-badge">1</div>
      </div>
      
      <div class="axyra-chat-window" id="chatWindow">
        <div class="axyra-chat-header">
          <div class="axyra-chat-title">
            <div class="axyra-chat-avatar">
              <img src="logo.png" alt="AXYRA" class="axyra-chat-avatar-logo" />
            </div>
            <div class="axyra-chat-info">
              <h3>Asistente AXYRA</h3>
              <span class="axyra-chat-status">En línea</span>
            </div>
          </div>
          <div class="axyra-chat-controls">
            <button class="axyra-chat-minimize" id="minimizeBtn">−</button>
            <button class="axyra-chat-close" id="closeBtn">×</button>
          </div>
        </div>
        
        <div class="axyra-chat-messages" id="chatMessages">
          <!-- Mensajes se agregarán aquí -->
        </div>
        
        <div class="axyra-chat-input-container">
          <div class="axyra-chat-typing" id="typingIndicator" style="display: none;">
            <div class="axyra-typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <span>Asistente está escribiendo...</span>
          </div>
          <div class="axyra-chat-input-wrapper">
            <input type="text" id="chatInput" placeholder="Escribe tu pregunta sobre AXYRA..." />
            <button id="sendBtn" class="axyra-chat-send">📤</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(chatContainer);
  }

  bindEvents() {
    const toggle = document.getElementById('chatToggle');
    const closeBtn = document.getElementById('closeBtn');
    const minimizeBtn = document.getElementById('minimizeBtn');
    const sendBtn = document.getElementById('sendBtn');
    const chatInput = document.getElementById('chatInput');

    toggle.addEventListener('click', () => this.toggleChat());
    closeBtn.addEventListener('click', () => this.closeChat());
    minimizeBtn.addEventListener('click', () => this.minimizeChat());
    sendBtn.addEventListener('click', () => this.sendMessage());
    
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    // Auto-focus en el input cuando se abre
    toggle.addEventListener('click', () => {
      setTimeout(() => chatInput.focus(), 300);
    });
  }

  addWelcomeMessage() {
    const welcomeMsg = {
      type: 'ai',
      content: '¡Hola! 👋 Soy el asistente de AXYRA. Puedo ayudarte con preguntas sobre nuestros planes, funcionalidades, precios, o cualquier duda técnica. ¿En qué puedo asistirte?',
      timestamp: new Date()
    };
    
    this.messages.push(welcomeMsg);
    this.displayMessage(welcomeMsg);
  }

  toggleChat() {
    const chatWindow = document.getElementById('chatWindow');
    const toggle = document.getElementById('chatToggle');
    
    this.isOpen = !this.isOpen;
    
    if (this.isOpen) {
      chatWindow.style.display = 'block';
      toggle.style.display = 'none';
      this.isMinimized = false;
      // Enfocar el input cuando se abre
      setTimeout(() => {
        const input = document.getElementById('chatInput');
        if (input) input.focus();
      }, 300);
    } else {
      chatWindow.style.display = 'none';
      toggle.style.display = 'flex';
      this.isMinimized = false;
    }
  }

  closeChat() {
    const chatWindow = document.getElementById('chatWindow');
    const toggle = document.getElementById('chatToggle');
    
    this.isOpen = false;
    chatWindow.style.display = 'none';
    toggle.style.display = 'flex';
  }

  minimizeChat() {
    // Al minimizar, cerrar completamente y volver a la burbuja
    this.closeChat();
  }

  async sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Agregar mensaje del usuario
    const userMessage = {
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    this.messages.push(userMessage);
    this.displayMessage(userMessage);
    
    input.value = '';
    
    // Mostrar indicador de escritura
    this.showTyping();
    
    // Procesar con IA
    setTimeout(() => {
      this.processAIResponse(message);
    }, 1000);
  }

  showTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    this.isTyping = true;
    typingIndicator.style.display = 'flex';
  }

  hideTyping() {
    const typingIndicator = document.getElementById('typingIndicator');
    this.isTyping = false;
    typingIndicator.style.display = 'none';
  }

  processAIResponse(userMessage) {
    this.hideTyping();
    
    const response = this.getAIResponse(userMessage);
    
    const aiMessage = {
      type: 'ai',
      content: response,
      timestamp: new Date()
    };
    
    this.messages.push(aiMessage);
    this.displayMessage(aiMessage);
  }

  getAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Buscar en la base de conocimiento
    for (const category in this.knowledgeBase) {
      for (const key in this.knowledgeBase[category]) {
        if (lowerMessage.includes(key)) {
          return this.knowledgeBase[category][key];
        }
      }
    }
    
    // Respuestas por defecto
    if (lowerMessage.includes('hola') || lowerMessage.includes('hi')) {
      return '¡Hola! 👋 ¿En qué puedo ayudarte con AXYRA hoy?';
    }
    
    if (lowerMessage.includes('gracias') || lowerMessage.includes('thanks')) {
      return '¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?';
    }
    
    if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuanto')) {
      return 'Los precios de AXYRA van desde $49.900/mes para el plan Básico hasta $259.900/mes para el plan Empresarial. ¿Te gustaría conocer más detalles de algún plan específico?';
    }
    
    if (lowerMessage.includes('plan') || lowerMessage.includes('planes')) {
      return 'AXYRA ofrece 3 planes: Básico ($49.900/mes), Profesional ($129.900/mes) y Empresarial ($259.900/mes). Cada uno con diferentes funcionalidades y límites de empleados. ¿Cuál te interesa más?';
    }
    
    if (lowerMessage.includes('funcionalidad') || lowerMessage.includes('que hace') || lowerMessage.includes('para que sirve')) {
      return 'AXYRA te permite gestionar empleados, calcular nóminas, controlar horarios, administrar vacaciones, generar reportes y mucho más. Es tu sistema integral de gestión empresarial. ¿Qué funcionalidad específica te interesa?';
    }
    
    if (lowerMessage.includes('soporte') || lowerMessage.includes('ayuda') || lowerMessage.includes('contacto')) {
      return 'Puedes obtener soporte por email (axyra.app@gmail.com), chat en vivo (horario laboral), o WhatsApp Business. También puedes usar este chat para preguntas técnicas sobre AXYRA.';
    }
    
    if (lowerMessage.includes('credencial') || lowerMessage.includes('password') || lowerMessage.includes('usuario') || lowerMessage.includes('login')) {
      return 'Para temas de credenciales y acceso, por favor contacta directamente a nuestro soporte técnico por email o WhatsApp. No puedo proporcionar información sensible de seguridad.';
    }
    
    if (lowerMessage.includes('codigo') || lowerMessage.includes('programacion') || lowerMessage.includes('desarrollo')) {
      return 'No puedo proporcionar detalles técnicos del código o arquitectura del sistema. Si necesitas información técnica específica, contacta a nuestro equipo de desarrollo.';
    }
    
    // Respuesta por defecto
    return 'Entiendo tu pregunta. Aunque no tengo una respuesta específica para eso, puedo ayudarte con información sobre planes, precios, funcionalidades, o conectarte con nuestro equipo de soporte. ¿Hay algo más específico sobre AXYRA que te interese?';
  }

  displayMessage(message) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `axyra-chat-message axyra-chat-message-${message.type}`;
    
    const time = message.timestamp.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    messageElement.innerHTML = `
      <div class="axyra-chat-message-content">
        <div class="axyra-chat-message-text">${message.content}</div>
        <div class="axyra-chat-message-time">${time}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
  // Inicializar en todas las páginas
  if (!window.axyraLiveChat) {
    window.axyraLiveChat = new AxyraLiveChatAI();
    console.log('🤖 Chat en vivo inicializado en:', window.location.pathname);
  }
});
