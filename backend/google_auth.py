#!/usr/bin/env python3
"""
Sistema de autenticación OAuth2 directo para Google Drive
Sin necesidad de archivos de credenciales
"""

import os
import json
import base64
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError
import webbrowser
import http.server
import socketserver
import threading
import urllib.parse

# Importar configuración
from google_config import get_google_config, get_drive_config, get_auth_config

# Configuración OAuth2 para aplicación web
CLIENT_CONFIG = get_google_config()

# Scopes necesarios para Google Drive
SCOPES = get_auth_config()['scopes']

class GoogleAuthManager:
    """Gestor de autenticación de Google"""
    
    def __init__(self):
        self.credentials: Optional[Credentials] = None
        self.token_file = "token.json"
        self.auth_server = None
        self.auth_code = None
        
    def get_credentials(self) -> Optional[Credentials]:
        """Obtener credenciales válidas"""
        if self.credentials and self.credentials.valid:
            return self.credentials
            
        if self.credentials and self.credentials.expired and self.credentials.refresh_token:
            try:
                self.credentials.refresh(Request())
                self._save_token()
                return self.credentials
            except Exception as e:
                print(f"Error refrescando token: {e}")
                
        return None
    
    def authenticate_user(self) -> bool:
        """Autenticar usuario mediante OAuth2 web flow"""
        try:
            # Crear flujo OAuth2
            flow = Flow.from_client_config(
                CLIENT_CONFIG, 
                scopes=SCOPES,
                redirect_uri="http://localhost:8080/callback"
            )
            
            # Generar URL de autorización
            auth_url, _ = flow.authorization_url(
                access_type='offline',
                include_granted_scopes='true',
                prompt='consent'
            )
            
            print(f"🔐 Abriendo navegador para autenticación...")
            print(f"📱 Si no se abre automáticamente, ve a: {auth_url}")
            
            # Abrir navegador
            webbrowser.open(auth_url)
            
            # Iniciar servidor local para recibir callback
            if self._start_auth_server():
                # Esperar código de autorización
                while not self.auth_code:
                    import time
                    time.sleep(1)
                
                # Intercambiar código por token
                flow.fetch_token(code=self.auth_code)
                self.credentials = flow.credentials
                self._save_token()
                
                print("✅ Autenticación exitosa!")
                return True
            else:
                print("❌ Error iniciando servidor de autenticación")
                return False
                
        except Exception as e:
            print(f"❌ Error en autenticación: {e}")
            return False
    
    def _start_auth_server(self) -> bool:
        """Iniciar servidor local para recibir callback de OAuth"""
        try:
            # Crear servidor HTTP simple
            class AuthHandler(http.server.BaseHTTPRequestHandler):
                def __init__(self, *args, auth_manager=None, **kwargs):
                    self.auth_manager = auth_manager
                    super().__init__(*args, **kwargs)
                
                def do_GET(self):
                    if self.path.startswith('/callback'):
                        # Extraer código de autorización
                        query = urllib.parse.urlparse(self.path).query
                        params = urllib.parse.parse_qs(query)
                        
                        if 'code' in params:
                            self.auth_manager.auth_code = params['code'][0]
                            
                            # Respuesta exitosa
                            self.send_response(200)
                            self.send_header('Content-type', 'text/html')
                            self.end_headers()
                            
                            response = """
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>Autenticación Exitosa - Axyra</title>
                                <style>
                                    body { 
                                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                        background: linear-gradient(135deg, #0B1F3F 0%, #4CA9FF 100%);
                                        color: white;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        margin: 0;
                                    }
                                    .container {
                                        text-align: center;
                                        padding: 40px;
                                        background: rgba(255,255,255,0.1);
                                        border-radius: 20px;
                                        backdrop-filter: blur(10px);
                                    }
                                    h1 { margin-bottom: 20px; }
                                    .success-icon { font-size: 60px; margin-bottom: 20px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="success-icon">✅</div>
                                    <h1>¡Autenticación Exitosa!</h1>
                                    <p>Ya puedes cerrar esta ventana y volver a Axyra.</p>
                                    <p>Tu cuenta de Google Drive ha sido conectada.</p>
                                </div>
                            </body>
                            </html>
                            """
                            
                            self.wfile.write(response.encode())
                            
                            # Detener servidor después de recibir código
                            threading.Timer(1, self.auth_manager._stop_auth_server).start()
                        else:
                            # Error en autenticación
                            self.send_response(400)
                            self.send_header('Content-type', 'text/html')
                            self.end_headers()
                            
                            error_response = """
                            <!DOCTYPE html>
                            <html>
                            <head>
                                <title>Error de Autenticación - Axyra</title>
                                <style>
                                    body { 
                                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                        background: linear-gradient(135deg, #ff4444 0%, #cc0000 100%);
                                        color: white;
                                        display: flex;
                                        justify-content: center;
                                        align-items: center;
                                        height: 100vh;
                                        margin: 0;
                                    }
                                    .container {
                                        text-align: center;
                                        padding: 40px;
                                        background: rgba(255,255,255,0.1);
                                        border-radius: 20px;
                                        backdrop-filter: blur(10px);
                                    }
                                    h1 { margin-bottom: 20px; }
                                    .error-icon { font-size: 60px; margin-bottom: 20px; }
                                </style>
                            </head>
                            <body>
                                <div class="container">
                                    <div class="error-icon">❌</div>
                                    <h1>Error de Autenticación</h1>
                                    <p>Hubo un problema con la autenticación.</p>
                                    <p>Intenta nuevamente desde Axyra.</p>
                                </div>
                            </body>
                            </html>
                            """
                            
                            self.wfile.write(error_response.encode())
                    else:
                        self.send_response(404)
                        self.end_headers()
                        self.wfile.write(b"Not Found")
                
                def log_message(self, format, *args):
                    # Silenciar logs del servidor
                    pass
            
            # Crear servidor con handler personalizado
            def create_handler(*args, **kwargs):
                return AuthHandler(*args, auth_manager=self, **kwargs)
            
            with socketserver.TCPServer(("localhost", 8080), create_handler) as httpd:
                self.auth_server = httpd
                print("🌐 Servidor de autenticación iniciado en puerto 8080")
                httpd.serve_forever()
                
            return True
            
        except Exception as e:
            print(f"❌ Error iniciando servidor: {e}")
            return False
    
    def _stop_auth_server(self):
        """Detener servidor de autenticación"""
        if self.auth_server:
            self.auth_server.shutdown()
            self.auth_server = None
            print("🛑 Servidor de autenticación detenido")
    
    def _save_token(self):
        """Guardar token en archivo local"""
        if self.credentials:
            token_data = {
                'token': self.credentials.token,
                'refresh_token': self.credentials.refresh_token,
                'token_uri': self.credentials.token_uri,
                'client_id': self.credentials.client_id,
                'client_secret': self.credentials.client_secret,
                'scopes': self.credentials.scopes
            }
            
            with open(self.token_file, 'w') as token:
                json.dump(token_data, token)
    
    def _load_token(self) -> bool:
        """Cargar token desde archivo local"""
        try:
            if os.path.exists(self.token_file):
                with open(self.token_file, 'r') as token:
                    token_data = json.load(token)
                
                self.credentials = Credentials(
                    token=token_data['token'],
                    refresh_token=token_data['refresh_token'],
                    token_uri=token_data['token_uri'],
                    client_id=token_data['client_id'],
                    client_secret=token_data['client_secret'],
                    scopes=token_data['scopes']
                )
                return True
        except Exception as e:
            print(f"⚠️ No se pudo cargar token: {e}")
        
        return False

class GoogleDriveManager:
    """Gestor de Google Drive"""
    
    def __init__(self):
        self.auth_manager = GoogleAuthManager()
        self.service = None
        self.root_folder_id = None
        
    def authenticate(self) -> bool:
        """Autenticar y preparar servicio de Drive"""
        # Intentar cargar token existente
        if not self.auth_manager._load_token():
            # Si no hay token, autenticar usuario
            if not self.auth_manager.authenticate_user():
                return False
        
        # Obtener credenciales válidas
        credentials = self.auth_manager.get_credentials()
        if not credentials:
            return False
        
        try:
            # Crear servicio de Drive
            self.service = build('drive', 'v3', credentials=credentials)
            
            # Crear o encontrar carpeta raíz de Axyra
            self.root_folder_id = self._get_or_create_root_folder()
            
            return True
            
        except Exception as e:
            print(f"❌ Error creando servicio de Drive: {e}")
            return False
    
    def _get_or_create_root_folder(self) -> str:
        """Obtener o crear carpeta raíz de Axyra"""
        try:
            # Buscar carpeta existente
            results = self.service.files().list(
                q="name='Axyra - Sistema de Nómina' and mimeType='application/vnd.google-apps.folder' and trashed=false",
                spaces='drive',
                fields='files(id, name)'
            ).execute()
            
            if results['files']:
                folder_id = results['files'][0]['id']
                print(f"📁 Carpeta raíz encontrada: {folder_id}")
                return folder_id
            
            # Crear nueva carpeta raíz
            folder_metadata = {
                'name': 'Axyra - Sistema de Nómina',
                'mimeType': 'application/vnd.google-apps.folder',
                'description': 'Sistema de gestión de nómina y empleados'
            }
            
            folder = self.service.files().create(
                body=folder_metadata,
                fields='id'
            ).execute()
            
            print(f"📁 Nueva carpeta raíz creada: {folder['id']}")
            return folder['id']
            
        except Exception as e:
            print(f"❌ Error con carpeta raíz: {e}")
            return None
    
    def _get_or_create_subfolder(self, parent_id: str, folder_name: str) -> str:
        """Obtener o crear subcarpeta"""
        try:
            # Buscar subcarpeta existente
            results = self.service.files().list(
                q=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and '{parent_id}' in parents and trashed=false",
                spaces='drive',
                fields='files(id, name)'
            ).execute()
            
            if results['files']:
                return results['files'][0]['id']
            
            # Crear nueva subcarpeta
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent_id]
            }
            
            folder = self.service.files().create(
                body=folder_metadata,
                fields='id'
            ).execute()
            
            return folder['id']
            
        except Exception as e:
            print(f"❌ Error creando subcarpeta {folder_name}: {e}")
            return None
    
    def upload_file(self, file_path: str, file_type: str = "general") -> Optional[str]:
        """Subir archivo a Google Drive"""
        if not self.service or not self.root_folder_id:
            if not self.authenticate():
                return None
        
        try:
            # Determinar carpeta de destino
            if file_type == "comprobantes":
                folder_id = self._get_or_create_subfolder(self.root_folder_id, "Comprobantes de Pago")
            elif file_type == "nomina":
                folder_id = self._get_or_create_subfolder(self.root_folder_id, "Nóminas")
            elif file_type == "reportes":
                folder_id = self._get_or_create_subfolder(self.root_folder_id, "Reportes")
            else:
                folder_id = self._get_or_create_subfolder(self.root_folder_id, "General")
            
            if not folder_id:
                return None
            
            # Preparar metadatos del archivo
            file_name = os.path.basename(file_path)
            file_metadata = {
                'name': file_name,
                'parents': [folder_id]
            }
            
            # Crear media para subida
            media = MediaFileUpload(file_path, resumable=True)
            
            # Subir archivo
            file = self.service.files().create(
                body=file_metadata,
                media_body=media,
                fields='id, name, webViewLink'
            ).execute()
            
            print(f"✅ Archivo subido: {file_name} -> {file['id']}")
            return file['webViewLink']
            
        except HttpError as error:
            print(f"❌ Error de API de Drive: {error}")
            return None
        except Exception as e:
            print(f"❌ Error subiendo archivo: {e}")
            return None
    
    def upload_multiple_files(self, file_paths: list, file_type: str = "general") -> list:
        """Subir múltiples archivos"""
        results = []
        for file_path in file_paths:
            if os.path.exists(file_path):
                link = self.upload_file(file_path, file_type)
                if link:
                    results.append({
                        'file': os.path.basename(file_path),
                        'link': link,
                        'status': 'success'
                    })
                else:
                    results.append({
                        'file': os.path.basename(file_path),
                        'link': None,
                        'status': 'error'
                    })
            else:
                results.append({
                    'file': os.path.basename(file_path),
                    'link': None,
                    'status': 'file_not_found'
                })
        
        return results

# Instancia global
drive_manager = GoogleDriveManager()

def authenticate_google_drive() -> bool:
    """Función para autenticar Google Drive"""
    return drive_manager.authenticate()

def upload_to_drive(file_path: str, file_type: str = "general") -> Optional[str]:
    """Función para subir archivo a Drive"""
    return drive_manager.upload_file(file_path, file_type)

def upload_multiple_to_drive(file_paths: list, file_type: str = "general") -> list:
    """Función para subir múltiples archivos a Drive"""
    return drive_manager.upload_multiple_files(file_paths, file_type)
