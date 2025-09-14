# ========================================
# MÓDULO DE INTEGRACIÓN CON GOOGLE DRIVE
# ========================================

import os
import io
from typing import Optional, Dict, Any
from datetime import datetime

try:
    from google.oauth2.credentials import Credentials
    from google_auth_oauthlib.flow import InstalledAppFlow
    from google.auth.transport.requests import Request
    from googleapiclient.discovery import build
    from googleapiclient.http import MediaIoBaseUpload
    GOOGLE_DRIVE_AVAILABLE = True
except ImportError:
    GOOGLE_DRIVE_AVAILABLE = False
    print("⚠️ Google Drive API no disponible. Instala: pip install google-api-python-client google-auth-httplib2 google-auth-oauthlib")

class GoogleDriveManager:
    def __init__(self):
        self.service = None
        self.credentials = None
        self.SCOPES = ['https://www.googleapis.com/auth/drive.file']
        self.CREDENTIALS_FILE = 'credentials.json'
        self.TOKEN_FILE = 'token.json'
        self.FOLDER_ID = os.getenv('GOOGLE_DRIVE_FOLDER_ID', '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms')  # ID de carpeta por defecto
        
    def authenticate(self) -> bool:
        """Autenticar con Google Drive API"""
        if not GOOGLE_DRIVE_AVAILABLE:
            print("❌ Google Drive API no está disponible")
            return False
            
        try:
            # Cargar credenciales existentes
            if os.path.exists(self.TOKEN_FILE):
                self.credentials = Credentials.from_authorized_user_file(self.TOKEN_FILE, self.SCOPES)
            
            # Si no hay credenciales válidas, autenticar
            if not self.credentials or not self.credentials.valid:
                if self.credentials and self.credentials.expired and self.credentials.refresh_token:
                    self.credentials.refresh(Request())
                else:
                    if not os.path.exists(self.CREDENTIALS_FILE):
                        print(f"❌ Archivo de credenciales no encontrado: {self.CREDENTIALS_FILE}")
                        print("📝 Descarga el archivo credentials.json desde Google Cloud Console")
                        return False
                    
                    flow = InstalledAppFlow.from_client_secrets_file(self.CREDENTIALS_FILE, self.SCOPES)
                    self.credentials = flow.run_local_server(port=0)
                
                # Guardar credenciales para futuras ejecuciones
                with open(self.TOKEN_FILE, 'w') as token:
                    token.write(self.credentials.to_json())
            
            # Construir servicio
            self.service = build('drive', 'v3', credentials=self.credentials)
            print("✅ Autenticación con Google Drive exitosa")
            return True
            
        except Exception as e:
            print(f"❌ Error en autenticación con Google Drive: {str(e)}")
            return False
    
    def upload_file(self, file_path: str, folder_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Subir archivo a Google Drive"""
        if not self.service:
            if not self.authenticate():
                return None
        
        try:
            folder_id = folder_id or self.FOLDER_ID
            
            # Obtener metadatos del archivo
            file_name = os.path.basename(file_path)
            file_size = os.path.getsize(file_path)
            
            # Crear metadatos del archivo
            file_metadata = {
                'name': file_name,
                'parents': [folder_id] if folder_id else []
            }
            
            # Subir archivo
            with open(file_path, 'rb') as file_data:
                media = MediaIoBaseUpload(io.BytesIO(file_data.read()), 
                                       mimetype='application/octet-stream',
                                       resumable=True)
                
                file = self.service.files().create(
                    body=file_metadata,
                    media_body=media,
                    fields='id,name,webViewLink,size,createdTime'
                ).execute()
            
            print(f"✅ Archivo subido exitosamente: {file_name}")
            return {
                'id': file.get('id'),
                'name': file.get('name'),
                'webViewLink': file.get('webViewLink'),
                'size': file.get('size'),
                'createdTime': file.get('createdTime')
            }
            
        except Exception as e:
            print(f"❌ Error subiendo archivo a Google Drive: {str(e)}")
            return None
    
    def create_folder(self, folder_name: str, parent_folder_id: Optional[str] = None) -> Optional[str]:
        """Crear carpeta en Google Drive"""
        if not self.service:
            if not self.authenticate():
                return None
        
        try:
            folder_metadata = {
                'name': folder_name,
                'mimeType': 'application/vnd.google-apps.folder',
                'parents': [parent_folder_id] if parent_folder_id else []
            }
            
            folder = self.service.files().create(
                body=folder_metadata,
                fields='id'
            ).execute()
            
            print(f"✅ Carpeta creada: {folder_name}")
            return folder.get('id')
            
        except Exception as e:
            print(f"❌ Error creando carpeta: {str(e)}")
            return None
    
    def list_files(self, folder_id: Optional[str] = None, query: str = "") -> list:
        """Listar archivos en Google Drive"""
        if not self.service:
            if not self.authenticate():
                return []
        
        try:
            # Construir query
            if folder_id:
                query = f"'{folder_id}' in parents"
            elif query:
                query = query
            
            results = self.service.files().list(
                q=query,
                fields="nextPageToken, files(id, name, webViewLink, size, createdTime)"
            ).execute()
            
            return results.get('files', [])
            
        except Exception as e:
            print(f"❌ Error listando archivos: {str(e)}")
            return []
    
    def delete_file(self, file_id: str) -> bool:
        """Eliminar archivo de Google Drive"""
        if not self.service:
            if not self.authenticate():
                return False
        
        try:
            self.service.files().delete(fileId=file_id).execute()
            print(f"✅ Archivo eliminado: {file_id}")
            return True
            
        except Exception as e:
            print(f"❌ Error eliminando archivo: {str(e)}")
            return False

# Instancia global del manager
drive_manager = GoogleDriveManager()

def upload_nomina_to_drive(file_path: str) -> Optional[Dict[str, Any]]:
    """Subir archivo de nómina a Google Drive"""
    try:
        # Crear carpeta de nóminas si no existe
        folder_name = f"AXYRA_Nominas_{datetime.now().strftime('%Y')}"
        folder_id = drive_manager.create_folder(folder_name)
        
        if folder_id:
            return drive_manager.upload_file(file_path, folder_id)
        else:
            return drive_manager.upload_file(file_path)
            
    except Exception as e:
        print(f"❌ Error en upload_nomina_to_drive: {str(e)}")
        return None

def upload_cuadre_to_drive(file_path: str) -> Optional[Dict[str, Any]]:
    """Subir archivo de cuadre de caja a Google Drive"""
    try:
        # Crear carpeta de cuadres si no existe
        folder_name = f"AXYRA_Cuadres_{datetime.now().strftime('%Y')}"
        folder_id = drive_manager.create_folder(folder_name)
        
        if folder_id:
            return drive_manager.upload_file(file_path, folder_id)
        else:
            return drive_manager.upload_file(file_path)
            
    except Exception as e:
        print(f"❌ Error en upload_cuadre_to_drive: {str(e)}")
        return None

def upload_report_to_drive(file_path: str, report_type: str = "general") -> Optional[Dict[str, Any]]:
    """Subir archivo de reporte a Google Drive"""
    try:
        # Crear carpeta de reportes si no existe
        folder_name = f"AXYRA_Reportes_{report_type}_{datetime.now().strftime('%Y')}"
        folder_id = drive_manager.create_folder(folder_name)
        
        if folder_id:
            return drive_manager.upload_file(file_path, folder_id)
        else:
            return drive_manager.upload_file(file_path)
            
    except Exception as e:
        print(f"❌ Error en upload_report_to_drive: {str(e)}")
        return None

def get_drive_files(folder_name: str = None) -> list:
    """Obtener lista de archivos de Google Drive"""
    try:
        if folder_name:
            # Buscar carpeta por nombre
            folders = drive_manager.list_files(query=f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder'")
            if folders:
                return drive_manager.list_files(folder_id=folders[0]['id'])
            else:
                return []
        else:
            return drive_manager.list_files()
            
    except Exception as e:
        print(f"❌ Error obteniendo archivos de Drive: {str(e)}")
        return []

def delete_drive_file(file_id: str) -> bool:
    """Eliminar archivo de Google Drive"""
    try:
        return drive_manager.delete_file(file_id)
    except Exception as e:
        print(f"❌ Error eliminando archivo de Drive: {str(e)}")
        return False

# Función de utilidad para verificar configuración
def check_google_drive_setup() -> Dict[str, Any]:
    """Verificar configuración de Google Drive"""
    setup_status = {
        'api_available': GOOGLE_DRIVE_AVAILABLE,
        'credentials_file_exists': os.path.exists('credentials.json'),
        'token_file_exists': os.path.exists('token.json'),
        'authenticated': False,
        'folder_id': os.getenv('GOOGLE_DRIVE_FOLDER_ID', 'No configurado')
    }
    
    if GOOGLE_DRIVE_AVAILABLE and setup_status['credentials_file_exists']:
        try:
            setup_status['authenticated'] = drive_manager.authenticate()
        except Exception as e:
            setup_status['error'] = str(e)
    
    return setup_status

if __name__ == "__main__":
    # Verificar configuración
    status = check_google_drive_setup()
    print("📊 Estado de configuración de Google Drive:")
    for key, value in status.items():
        print(f"  {key}: {value}")