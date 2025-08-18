#!/usr/bin/env python3
"""
Configuración de Google OAuth2 para Axyra
Actualiza estos valores con tus credenciales reales de Google Cloud Console
"""

# ========================================
# CONFIGURACIÓN DE GOOGLE CLOUD CONSOLE
# ========================================

# Reemplaza estos valores con tus credenciales reales
GOOGLE_CLIENT_ID = "TU_CLIENT_ID_AQUI"
GOOGLE_CLIENT_SECRET = "TU_CLIENT_SECRET_AQUI"
GOOGLE_PROJECT_ID = "villa-venecia-nomina"

# URLs de OAuth2
GOOGLE_AUTH_URI = "https://accounts.google.com/o/oauth2/auth"
GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token"
GOOGLE_AUTH_PROVIDER_X509_CERT_URL = "https://www.googleapis.com/oauth2/v1/certs"

# URLs de redirección (deben coincidir con las configuradas en Google Cloud Console)
GOOGLE_REDIRECT_URIS = [
    "http://localhost:8080/callback",
    "http://127.0.0.1:8080/callback"
]

# Orígenes JavaScript permitidos
GOOGLE_JAVASCRIPT_ORIGINS = [
    "http://localhost:8000",
    "http://127.0.0.1:8000"
]

# Scopes de permisos
GOOGLE_SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
]

# ========================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ========================================

# Nombre de la aplicación
APP_NAME = "Axyra - Sistema de Nómina"
APP_VERSION = "1.0.0"

# Configuración de carpetas en Google Drive
DRIVE_ROOT_FOLDER_NAME = "Axyra - Sistema de Nómina"
DRIVE_SUBFOLDERS = {
    "comprobantes": "Comprobantes de Pago",
    "nomina": "Nóminas",
    "reportes": "Reportes",
    "general": "General"
}

# Configuración de autenticación
AUTH_SERVER_PORT = 8080
AUTH_SERVER_HOST = "localhost"
TOKEN_FILE_NAME = "axyra_token.json"

# ========================================
# FUNCIÓN PARA OBTENER CONFIGURACIÓN
# ========================================

def get_google_config():
    """Obtener configuración completa de Google OAuth2"""
    return {
        "web": {
            "client_id": GOOGLE_CLIENT_ID,
            "project_id": GOOGLE_PROJECT_ID,
            "auth_uri": GOOGLE_AUTH_URI,
            "token_uri": GOOGLE_TOKEN_URI,
            "auth_provider_x509_cert_url": GOOGLE_AUTH_PROVIDER_X509_CERT_URL,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "redirect_uris": GOOGLE_REDIRECT_URIS,
            "javascript_origins": GOOGLE_JAVASCRIPT_ORIGINS
        }
    }

def get_drive_config():
    """Obtener configuración de Google Drive"""
    return {
        "root_folder_name": DRIVE_ROOT_FOLDER_NAME,
        "subfolders": DRIVE_SUBFOLDERS,
        "token_file": TOKEN_FILE_NAME
    }

def get_auth_config():
    """Obtener configuración de autenticación"""
    return {
        "scopes": GOOGLE_SCOPES,
        "server_port": AUTH_SERVER_PORT,
        "server_host": AUTH_SERVER_HOST,
        "app_name": APP_NAME
    }

# ========================================
# VERIFICACIÓN DE CONFIGURACIÓN
# ========================================

def is_config_valid():
    """Verificar si la configuración es válida"""
    if GOOGLE_CLIENT_ID == "TU_CLIENT_ID_AQUI":
        print("❌ ERROR: Debes configurar GOOGLE_CLIENT_ID en google_config.py")
        return False
    
    if GOOGLE_CLIENT_SECRET == "TU_CLIENT_SECRET_AQUI":
        print("❌ ERROR: Debes configurar GOOGLE_CLIENT_SECRET en google_config.py")
        return False
    
    print("✅ Configuración de Google válida")
    return True

# ========================================
# INSTRUCCIONES DE CONFIGURACIÓN
# ========================================

def print_setup_instructions():
    """Imprimir instrucciones de configuración"""
    print("""
🚀 CONFIGURACIÓN DE GOOGLE DRIVE PARA AXYRA
============================================

Para conectar Google Drive, sigue estos pasos:

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API de Google Drive
4. Crea credenciales OAuth 2.0 para aplicación web
5. Copia el Client ID y Client Secret
6. Actualiza este archivo (google_config.py) con tus credenciales

CREDENCIALES NECESARIAS:
- Client ID: {client_id}
- Client Secret: {client_secret}

URLs DE REDIRECCIÓN CONFIGURADAS:
{redirect_uris}

Una vez configurado, podrás usar la autenticación OAuth2 directa
sin necesidad de archivos de credenciales externos.
""".format(
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
        redirect_uris="\n".join(GOOGLE_REDIRECT_URIS)
    ))

if __name__ == "__main__":
    print_setup_instructions()
    print("\nEstado de la configuración:")
    is_config_valid()
