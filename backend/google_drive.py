"""
Módulo para integración con Google Drive
"""
import os
import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from googleapiclient.errors import HttpError

# Scopes necesarios para Google Drive
SCOPES = ['https://www.googleapis.com/auth/drive.file']

# Archivo de token
TOKEN_FILE = 'token.json'
# Archivo de credenciales (debes descargarlo desde Google Cloud Console)
CREDENTIALS_FILE = 'credentials.json'

def get_google_drive_service():
    """Obtener servicio de Google Drive autenticado."""
    creds = None
    
    try:
        # El archivo token.json almacena los tokens de acceso y actualización del usuario
        if os.path.exists(TOKEN_FILE):
            creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
            # Token encontrado
        else:
            # Token no encontrado
            creds = None
        
        # Si no hay credenciales válidas disponibles, deja que el usuario se autentique
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                # Token expirado, refrescando
                creds.refresh(Request())
            else:
                if not os.path.exists(CREDENTIALS_FILE):
                    error_msg = (
                        f"Archivo credentials.json no encontrado en: {os.path.abspath(CREDENTIALS_FILE)}\n"
                        "Para activar Google Drive:\n"
                        "1. Ve a https://console.cloud.google.com\n"
                        "2. Crea un proyecto o selecciona uno existente\n"
                        "3. Habilita la API de Google Drive\n"
                        "4. Crea credenciales de tipo 'Cuenta de servicio'\n"
                        "5. Descarga el archivo JSON y renómbralo a 'credentials.json'\n"
                        "6. Colócalo en la carpeta backend/"
                    )
                    # Error en autenticación
                    raise FileNotFoundError(error_msg)
                
                # Credenciales encontradas
                flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
                # Forzar selección de cuenta y acceso offline
                creds = flow.run_local_server(port=0, access_type='offline', prompt='consent')
                # Autenticación completada
                pass
        
        # Guardar las credenciales para la próxima ejecución
        if not os.path.exists(TOKEN_FILE):
            with open(TOKEN_FILE, 'w') as token:
                token.write(creds.to_json())
            # Token guardado
            pass
        
        try:
            service = build('drive', 'v3', credentials=creds)
            # Servicio de Google Drive creado exitosamente
            return service
        except HttpError as error:
            # Error al crear servicio de Google Drive
            return None
            
    except Exception as e:
        # Error inesperado en get_google_drive_service
        return None

def upload_file_to_drive(file_path, filename=None, folder_id=None):
    """
    Subir archivo a Google Drive.
    
    Args:
        file_path: Ruta del archivo local
        filename: Nombre del archivo en Drive (opcional)
        folder_id: ID de la carpeta en Drive (opcional)
    
    Returns:
        dict: Información del archivo subido o None si falla
    """
    if not os.path.exists(file_path):
        # Archivo no encontrado
        return None
    
    service = get_google_drive_service()
    if not service:
        return None
    
    try:
        # Preparar metadatos del archivo
        file_metadata = {
            'name': filename or os.path.basename(file_path)
        }
        
        # Si se especifica una carpeta, agregarla
        if folder_id:
            file_metadata['parents'] = [folder_id]
        
        # Crear objeto MediaFileUpload
        media = MediaFileUpload(file_path, resumable=True)
        
        # Subir archivo
        file = service.files().create(
            body=file_metadata,
            media_body=media,
            fields='id,name,webViewLink'
        ).execute()
        
        # Archivo subido exitosamente
        return {
            'id': file.get('id'),
            'name': file.get('name'),
            'webViewLink': file.get('webViewLink')
        }
        
    except HttpError as error:
        # Error al subir archivo
        return None

def list_files_in_folder(folder_id=None):
    """
    Listar archivos en una carpeta específica o en la raíz.
    
    Args:
        folder_id: ID de la carpeta (opcional)
    
    Returns:
        list: Lista de archivos
    """
    service = get_google_drive_service()
    if not service:
        return []
    
    try:
        query = "trashed=false"
        if folder_id:
            query += f" and '{folder_id}' in parents"
        
        results = service.files().list(
            q=query,
            pageSize=50,
            fields="nextPageToken, files(id, name, mimeType, webViewLink)"
        ).execute()
        
        files = results.get('files', [])
        return files
        
    except HttpError as error:
        # Error al listar archivos
        return []

def create_folder(folder_name, parent_folder_id=None):
    """
    Crear una nueva carpeta en Google Drive.
    
    Args:
        folder_name: Nombre de la carpeta
        parent_folder_id: ID de la carpeta padre (opcional)
    
    Returns:
        dict: Información de la carpeta creada o None si falla
    """
    service = get_google_drive_service()
    if not service:
        return None
    
    try:
        file_metadata = {
            'name': folder_name,
            'mimeType': 'application/vnd.google-apps.folder'
        }
        
        if parent_folder_id:
            file_metadata['parents'] = [parent_folder_id]
        
        file = service.files().create(
            body=file_metadata,
            fields='id,name,webViewLink'
        ).execute()
        
        # Carpeta creada exitosamente
        return {
            'id': file.get('id'),
            'name': file.get('name'),
            'webViewLink': file.get('webViewLink')
        }
        
    except HttpError as error:
        # Error al crear carpeta
        return None

def get_folder_id_by_name(folder_name, parent_folder_id=None):
    """
    Obtener el ID de una carpeta por nombre.
    
    Args:
        folder_name: Nombre de la carpeta
        parent_folder_id: ID de la carpeta padre (opcional)
    
    Returns:
        str: ID de la carpeta o None si no se encuentra
    """
    service = get_google_drive_service()
    if not service:
        return None
    
    try:
        query = f"name='{folder_name}' and mimeType='application/vnd.google-apps.folder' and trashed=false"
        if parent_folder_id:
            query += f" and '{parent_folder_id}' in parents"
        
        results = service.files().list(
            q=query,
            fields="files(id,name)"
        ).execute()
        
        files = results.get('files', [])
        if files and len(files) > 0:
            return files[0]['id']
        return None
        
    except HttpError as error:
        # Error al buscar carpeta
        return None
    except Exception as e:
        # Error inesperado al buscar carpeta
        return None

def upload_nomina_to_drive(file_path):
    """Subir archivo de nómina a Google Drive."""
    folder_name = "Nómina Villa Venecia"
    folder_id = get_folder_id_by_name(folder_name)
    
    if not folder_id:
        folder_created = create_folder(folder_name)
        if folder_created:
            folder_id = folder_created['id']
    
    if folder_id:
        return upload_file_to_drive(file_path, os.path.basename(file_path), folder_id)
    else:
        return upload_file_to_drive(file_path, os.path.basename(file_path))

def upload_cuadre_to_drive(file_path):
    """Subir archivo de cuadre de caja a Google Drive."""
    folder_name = "Cuadre de Caja Villa Venecia"
    folder_id = get_folder_id_by_name(folder_name)
    
    if not folder_id:
        folder_created = create_folder(folder_name)
        if folder_created:
            folder_id = folder_created['id']
    
    if folder_id:
        return upload_file_to_drive(file_path, os.path.basename(file_path), folder_id)
    else:
        return upload_file_to_drive(file_path, os.path.basename(file_path))
