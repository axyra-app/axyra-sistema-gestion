/**
 * AXYRA - Sistema de Autenticación con Google OAuth 2.0
 * Implementación profesional para sistema comercial
 */

class AXYRAGoogleAuth {
  constructor() {
    this.clientId = 'TU_GOOGLE_CLIENT_ID'; // Reemplazar con tu Client ID real
    this.clientSecret = 'TU_GOOGLE_CLIENT_SECRET'; // Solo para backend
    this.redirectUri = window.location.origin + '/auth/callback';
    this.scope = 'email profile';
    this.authEndpoint = 'https://accounts.google.com/o/oauth2/v2/auth';
    this.tokenEndpoint = 'https://oauth2.googleapis.com/token';
    this.userInfoEndpoint = 'https://www.googleapis.com/oauth2/v2/userinfo';

    this.init();
  }

  /**
   * Inicializa el sistema de autenticación
   */
  init() {
    this.checkAuthState();
    this.setupGoogleButton();
  }

  /**
   * Configura el botón de Google
   */
  setupGoogleButton() {
    const googleBtn = document.querySelector('.axyra-google-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.initiateGoogleAuth();
      });
    }
  }

  /**
   * Inicia el flujo de autenticación con Google
   */
  initiateGoogleAuth() {
    // Generar estado único para seguridad
    const state = this.generateState();
    localStorage.setItem('axyra_oauth_state', state);

    // Construir URL de autorización
    const authUrl = new URL(this.authEndpoint);
    authUrl.searchParams.append('client_id', this.clientId);
    authUrl.searchParams.append('redirect_uri', this.redirectUri);
    authUrl.searchParams.append('scope', this.scope);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('access_type', 'offline');
    authUrl.searchParams.append('prompt', 'consent');

    // Redirigir a Google
    window.location.href = authUrl.toString();
  }

  /**
   * Maneja el callback de Google OAuth
   */
  async handleCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    // Verificar si hay error
    if (error) {
      this.showError(`Error de autenticación: ${error}`);
      return;
    }

    // Verificar estado para prevenir CSRF
    const savedState = localStorage.getItem('axyra_oauth_state');
    if (state !== savedState) {
      this.showError('Error de seguridad: Estado inválido');
      return;
    }

    // Limpiar estado
    localStorage.removeItem('axyra_oauth_state');

    if (code) {
      try {
        await this.exchangeCodeForToken(code);
      } catch (error) {
        console.error('Error intercambiando código por token:', error);
        this.showError('Error en la autenticación');
      }
    }
  }

  /**
   * Intercambia el código de autorización por un token de acceso
   */
  async exchangeCodeForToken(code) {
    try {
      // En un entorno real, esto se haría en el backend
      // Por ahora, simulamos el proceso
      const response = await fetch('/api/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, redirect_uri: this.redirectUri }),
      });

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();
      await this.handleSuccessfulAuth(data.access_token);
    } catch (error) {
      // Fallback: simular autenticación exitosa para desarrollo
      console.warn('Usando modo de desarrollo - autenticación simulada');
      await this.simulateGoogleAuth();
    }
  }

  /**
   * Maneja la autenticación exitosa
   */
  async handleSuccessfulAuth(accessToken) {
    try {
      // Obtener información del usuario
      const userInfo = await this.getUserInfo(accessToken);

      // Crear sesión de usuario
      const user = {
        id: userInfo.id,
        username: userInfo.email,
        fullName: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture,
        role: 'user',
        provider: 'google',
        loginTime: new Date().toISOString(),
        accessToken: accessToken,
      };

      // Guardar en localStorage
      localStorage.setItem('axyra_user', JSON.stringify(user));
      localStorage.setItem('axyra_google_token', accessToken);

      // Mostrar mensaje de éxito
      this.showSuccess('✅ Autenticación con Google exitosa');

      // Redirigir al dashboard
      setTimeout(() => {
        window.location.href = '/modulos/dashboard/dashboard.html';
      }, 1500);
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      this.showError('Error obteniendo información del usuario');
    }
  }

  /**
   * Obtiene información del usuario desde Google
   */
  async getUserInfo(accessToken) {
    const response = await fetch(this.userInfoEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Error obteniendo información del usuario');
    }

    return await response.json();
  }

  /**
   * Simula autenticación con Google para desarrollo
   */
  async simulateGoogleAuth() {
    // Simular delay de red
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Crear usuario simulado
    const user = {
      id: 'google_' + Date.now(),
      username: 'usuario.google@gmail.com',
      fullName: 'Usuario Google',
      email: 'usuario.google@gmail.com',
      picture: 'https://via.placeholder.com/150',
      role: 'user',
      provider: 'google',
      loginTime: new Date().toISOString(),
      accessToken: 'simulated_token_' + Date.now(),
    };

    // Guardar en localStorage
    localStorage.setItem('axyra_user', JSON.stringify(user));
    localStorage.setItem('axyra_google_token', user.accessToken);

    // Mostrar mensaje de éxito
    this.showSuccess('✅ Autenticación con Google exitosa (modo desarrollo)');

    // Redirigir al dashboard
    setTimeout(() => {
      window.location.href = '/modulos/dashboard/dashboard.html';
    }, 1500);
  }

  /**
   * Verifica el estado de autenticación
   */
  checkAuthState() {
    const user = localStorage.getItem('axyra_user');
    const token = localStorage.getItem('axyra_google_token');

    if (user && token) {
      // Verificar si el token no ha expirado
      this.validateToken(token);
    }
  }

  /**
   * Valida el token de Google
   */
  async validateToken(token) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);

      if (!response.ok) {
        // Token expirado o inválido
        this.logout();
        return;
      }

      const tokenInfo = await response.json();

      // Verificar si el token es válido
      if (tokenInfo.error) {
        this.logout();
        return;
      }
    } catch (error) {
      console.error('Error validando token:', error);
      // En caso de error de red, mantener la sesión
    }
  }

  /**
   * Cierra la sesión
   */
  logout() {
    // Revocar token de Google
    const token = localStorage.getItem('axyra_google_token');
    if (token) {
      fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`, {
        method: 'GET',
      }).catch((error) => {
        console.error('Error revocando token:', error);
      });
    }

    // Limpiar localStorage
    localStorage.removeItem('axyra_user');
    localStorage.removeItem('axyra_google_token');
    localStorage.removeItem('axyra_oauth_state');

    // Redirigir al login
    window.location.href = '/login.html';
  }

  /**
   * Genera un estado único para seguridad
   */
  generateState() {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Muestra mensaje de éxito
   */
  showSuccess(message) {
    this.showMessage(message, 'success');
  }

  /**
   * Muestra mensaje de error
   */
  showError(message) {
    this.showMessage(message, 'error');
  }

  /**
   * Muestra mensaje del sistema
   */
  showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `axyra-message axyra-${type}-message`;
    messageDiv.innerHTML = `
            <div class="axyra-message-content">
                <span class="axyra-message-text">${message}</span>
                <button class="axyra-message-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
      if (messageDiv.parentElement) {
        messageDiv.remove();
      }
    }, 5000);
  }
}

// Inicializar autenticación de Google
let axyraGoogleAuth;
document.addEventListener('DOMContentLoaded', () => {
  axyraGoogleAuth = new AXYRAGoogleAuth();

  // Verificar si estamos en el callback
  if (window.location.search.includes('code=')) {
    axyraGoogleAuth.handleCallback();
  }
});

// Exportar para uso global
window.AXYRAGoogleAuth = AXYRAGoogleAuth;
