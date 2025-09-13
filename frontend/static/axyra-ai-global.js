/* ========================================
   AXYRA AI CHAT GLOBAL
   Chat de IA global para todas las páginas
   ======================================== */

// Función para cargar el chat de IA en cualquier página
function loadAxyraAIChat() {
  // Verificar si ya está cargado
  if (document.getElementById('axyra-ai-chat-container')) {
    return;
  }

  // Cargar el script del chat de IA
  const script = document.createElement('script');
  script.src = 'static/axyra-ai-chat-professional.js';
  script.onload = () => {
    console.log('✅ Axyra-IA cargado globalmente');
  };
  script.onerror = () => {
    console.error('❌ Error cargando Axyra-IA');
  };
  
  document.head.appendChild(script);
}

// Cargar el chat cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadAxyraAIChat);
} else {
  loadAxyraAIChat();
}

// También cargar inmediatamente si es necesario
setTimeout(loadAxyraAIChat, 1000);
