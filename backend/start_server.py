#!/usr/bin/env python3
"""
Script mejorado para iniciar el servidor
"""

import os
import sys
import uvicorn

# Agregar el directorio actual al path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def main():
    """Función principal para iniciar el servidor"""
    print("=== INICIANDO SERVIDOR VILLA VENECIA ===")
    print(f"Directorio actual: {os.getcwd()}")
    print(f"Directorio del script: {os.path.dirname(os.path.abspath(__file__))}")
    
    try:
        # Importar la aplicación
        print("Importando aplicación...")
        from main import app
        print("✅ Aplicación importada correctamente")
        
        # Iniciar servidor
        print("Iniciando servidor en http://127.0.0.1:8000")
        uvicorn.run(
            app, 
            host="127.0.0.1", 
            port=8000, 
            log_level="info",
            reload=False
        )
        
    except Exception as e:
        print(f"❌ Error al iniciar servidor: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    sys.exit(main())

