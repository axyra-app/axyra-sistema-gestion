# backend/main.py
"""
Sistema de Nómina - Villa Venecia
Desarrollado por Juan Fernando Urán
"""

import os
from fastapi import FastAPI, Request, Form, HTTPException
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, FileResponse
import uvicorn

app = FastAPI(title="Nómina Villa Venecia", description="Sistema de gestión de nómina profesional.")

# === Rutas absolutas ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
DATA_DIR = os.path.join(ROOT_DIR, "data")
PDF_DIR = os.path.join(BASE_DIR, "pdfs")
EXCEL_DIR = os.path.join(ROOT_DIR, "excels")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PDF_DIR, exist_ok=True)
os.makedirs(EXCEL_DIR, exist_ok=True)

DB_PATH = os.path.join(DATA_DIR, "nomina.db")

# === Montar archivos estáticos y plantillas ===
app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")
app.mount("/backend-static", StaticFiles(directory="static"), name="backend-static")
app.mount("/pdfs", StaticFiles(directory=PDF_DIR), name="pdfs")
templates = Jinja2Templates(directory=FRONTEND_DIR)

# === Filtro personalizado para formato de moneda ===
def format_currency(value):
    return f"${value:,.0f}"

templates.env.filters['format_currency'] = format_currency

# === Importar módulos auxiliares ===
from database import get_db, init_db
from utils import (
    generar_comprobante_pdf,
    exportar_cuadre_caja_plantilla,
    exportar_nomina_plantilla,
    calcular_nominas,
    obtener_empleados,
    guardar_empleado,
    guardar_horas_trabajadas,
    guardar_cuadre_caja,
    obtener_estadisticas,
    PayloadCuadre,
    PayloadNomina
)


@app.on_event("startup")
def startup():
    """Inicializar la base de datos al iniciar la app."""
    init_db()


@app.get("/test-functions")
def test_functions(request: Request):
    """Página de prueba de funciones del sistema."""
    return templates.TemplateResponse("test_functions.html", {"request": request})

@app.get("/test-simple")
def test_simple():
    """Página de prueba simple para verificar funcionalidades."""
    return FileResponse("../frontend/test_simple.html")

@app.get("/")
def home(request: Request):
    """Página principal con estadísticas y formulario de registro."""
    conn = get_db()
    empleados = obtener_empleados(conn)
    conn.close()

    total_fijos = sum(1 for e in empleados if e["tipo_contrato"] == "Fijo")
    total_temporales = sum(1 for e in empleados if e["tipo_contrato"] == "Por Horas")

    # Calcular nómina total de la quincena actual
    from datetime import date
    hoy = date.today()
    quincena = f"15_{hoy.month:02d}_{hoy.year}" if hoy.day <= 15 else f"31_{hoy.month:02d}_{hoy.year}"
    
    # Convertir empleados para usar la clave 'tipo' en lugar de 'tipo_contrato'
    empleados_para_nomina = []
    for emp in empleados:
        # Mapear el tipo del frontend al tipo de la base de datos
        tipo_db = "FIJO" if emp["tipo_contrato"] == "Fijo" else "TEMPORAL"
        empleado_nomina = {
            "id": emp["id"],
            "nombre": emp["nombre"],
            "cedula": emp["cedula"],
            "tipo": tipo_db,  # Usar el tipo de la base de datos (FIJO/TEMPORAL)
            "salario": emp["salario"]
        }
        empleados_para_nomina.append(empleado_nomina)
    
    nominas = calcular_nominas(empleados_para_nomina, quincena)
    total_nomina = sum(nomina["resumen"]["neto"] for nomina in nominas)

    return templates.TemplateResponse("index.html", {
        "request": request,
        "empleados": empleados,
        "total_fijos": total_fijos,
        "total_temporales": total_temporales,
        "total_nomina": total_nomina,
        "app_name": "Axyra - Sistema de Gestión Empresarial"
    })

@app.get("/axyra")
def axyra_dashboard():
    """Dashboard principal de Axyra."""
    return FileResponse("../frontend/axyra-dashboard.html")

@app.get("/dashboard")
def dashboard():
    """Dashboard para usuarios autenticados."""
    return FileResponse("../frontend/dashboard.html")

@app.post("/conectar-google-drive")
def conectar_google_drive():
    """Conectar cuenta de Google Drive."""
    try:
        from google_auth import authenticate_google_drive
        
        if authenticate_google_drive():
            return {
                "success": True,
                "message": "Google Drive conectado exitosamente"
            }
        else:
            return {
                "success": False,
                "message": "Error al conectar Google Drive"
            }
    except Exception as e:
        return {
            "success": False,
            "message": f"Error: {str(e)}"
        }


@app.post("/guardar-empleado")
def guardar_empleado_route(
    nombre: str = Form(...),
    cedula: str = Form(...),
    tipo_contrato: str = Form(...),
    salario: float = Form(...)
):
    """Registrar un nuevo empleado."""
    try:
        guardar_empleado(nombre, cedula, tipo_contrato, salario)
        return {"success": True, "message": "Empleado registrado exitosamente"}
    except Exception as e:
        return {"success": False, "message": f"Error al guardar empleado: {str(e)}"}


@app.put("/editar-empleado/{empleado_id}")
def editar_empleado_route(empleado_id: int, empleado_data: dict):
    """Editar un empleado existente."""
    try:
        from utils import actualizar_empleado
        actualizar_empleado(
            empleado_id,
            empleado_data["nombre"],
            empleado_data["cedula"],
            empleado_data["tipo_contrato"],
            empleado_data["salario"]
        )
        return {"success": True, "message": "Empleado actualizado exitosamente"}
    except Exception as e:
        return {"success": False, "message": f"Error al actualizar empleado: {str(e)}"}


@app.delete("/eliminar-empleado/{empleado_id}")
def eliminar_empleado_route(empleado_id: int):
    """Eliminar un empleado."""
    try:
        from utils import eliminar_empleado
        eliminar_empleado(empleado_id)
        return {"success": True, "message": "Empleado eliminado exitosamente"}
    except Exception as e:
        return {"success": False, "message": f"Error al eliminar empleado: {str(e)}"}


@app.get("/empleados")
def listar_empleados(request: Request):
    """Listar todos los empleados."""
    conn = get_db()
    empleados = obtener_empleados(conn)
    conn.close()
    return templates.TemplateResponse("empleados.html", {
        "request": request,
        "empleados": empleados
    })


@app.get("/gestionar-nomina")
def gestionar_nomina(request: Request):
    """Página dedicada a la gestión de nómina."""
    return templates.TemplateResponse("gestionar_nomina.html", {
        "request": request
    })


@app.get("/gestionar-horas/{empleado_id}")
def formulario_gestionar_horas(request: Request, empleado_id: int):
    """Mostrar formulario para gestionar horas de un empleado."""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT nombre, tipo, salario FROM empleados WHERE id = ?", (empleado_id,))
    empleado = cursor.fetchone()
    conn.close()

    if not empleado:
        raise HTTPException(status_code=404, detail="Empleado no encontrado")

    from datetime import date
    hoy = date.today()
    dia = hoy.day
    mes = hoy.month
    año = hoy.year
    quincena = f"15_{mes:02d}_{año}" if dia <= 15 else f"31_{mes:02d}_{año}"

    # Obtener horas existentes si las hay
    from utils import obtener_horas_empleado
    horas_existentes = obtener_horas_empleado(empleado_id, quincena)

    return templates.TemplateResponse("gestionar_horas.html", {
        "request": request,
        "empleado_id": empleado_id,
        "nombre_empleado": empleado[0],
        "tipo_empleado": empleado[1],
        "salario_empleado": empleado[2],
        "quincena": quincena,
        "horas_existentes": horas_existentes
    })


@app.post("/guardar-horas")
def guardar_horas_route(
    empleado_id: int = Form(...),
    quincena: str = Form(...),
    horas_ordinarias: str = Form("0"),
    recargo_nocturno: str = Form("0"),
    recargo_diurno_dominical: str = Form("0"),
    recargo_nocturno_dominical: str = Form("0"),
    hora_extra_diurna: str = Form("0"),
    hora_extra_nocturna: str = Form("0"),
    hora_diurna_dominical_o_festivo: str = Form("0"),
    hora_extra_diurna_dominical_o_festivo: str = Form("0"),
    hora_nocturna_dominical_o_festivo: str = Form("0"),
    hora_extra_nocturna_dominical_o_festivo: str = Form("0"),
    motivo_deuda: str = Form(""),
    valor_deuda: str = Form("0"),
    descuento_inasistencia: str = Form("0"),
    otros_descuentos: str = Form(""),
    valor_otros_descuentos: str = Form("0")
):
    """Guardar horas trabajadas de un empleado."""
    try:
        # Convertir strings a float, manejando valores vacíos como 0.0
        def safe_float(value: str) -> float:
            if not value or value.strip() == "":
                return 0.0
            try:
                return float(value)
            except (ValueError, TypeError):
                return 0.0
        
        guardar_horas_trabajadas(
            empleado_id,
            quincena,
            safe_float(horas_ordinarias),
            safe_float(recargo_nocturno),
            safe_float(recargo_diurno_dominical),
            safe_float(recargo_nocturno_dominical),
            safe_float(hora_extra_diurna),
            safe_float(hora_extra_nocturna),
            safe_float(hora_diurna_dominical_o_festivo),
            safe_float(hora_extra_diurna_dominical_o_festivo),
            safe_float(hora_nocturna_dominical_o_festivo),
            safe_float(hora_extra_nocturna_dominical_o_festivo),
            motivo_deuda,
            safe_float(valor_deuda),
            safe_float(descuento_inasistencia),
            otros_descuentos,
            safe_float(valor_otros_descuentos)
        )
        return RedirectResponse("/empleados", status_code=303)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar horas: {str(e)}")


@app.get("/generar-comprobante/{empleado_id}/{quincena}")
def generar_comprobante(empleado_id: int, quincena: str):
    """Generar comprobante PDF para un empleado."""
    try:
        filepath = generar_comprobante_pdf(empleado_id, quincena)
        filename = os.path.basename(filepath)
        return RedirectResponse(f"/pdfs/{filename}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar comprobante: {str(e)}")


# === RUTA ELIMINADA: /exportar-excel ===
# Esta ruta ha sido reemplazada por /exportar-nomina-plantilla
# que usa archivos de plantilla existentes para mayor eficiencia

@app.get("/exportar-excel-agosto")
def exportar_excel_agosto_route():
    """Exportar nómina de agosto a Excel."""
    try:
        # Usar la función de plantilla con tipo "agosto"
        from datetime import date
        hoy = date.today()
        quincena = f"15_{hoy.month:02d}_{hoy.year}" if hoy.day <= 15 else f"31_{hoy.month:02d}_{hoy.year}"
        
        filepath = exportar_nomina_plantilla(quincena, "agosto")
        return FileResponse(filepath, filename="AGOSTO_2025_NOMINA.xlsx")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar a Excel: {str(e)}")


@app.get("/cuadre-caja")
def cuadre_caja(request: Request):
    """Página para cuadre de caja."""
    return templates.TemplateResponse("cuadre_caja.html", {"request": request})


@app.post("/guardar-cuadre")
def guardar_cuadre(
    fecha: str = Form(...),
    numero_factura: str = Form(...),
    area: str = Form(...),
    monto: float = Form(...),
    metodo_pago: str = Form(...),
    encargado: str = Form(default="")
):
    """Guardar factura individual."""
    try:
        # Validar que todos los campos requeridos estén presentes
        if not fecha or not numero_factura or not area or monto is None or not metodo_pago:
            raise HTTPException(status_code=422, detail="Todos los campos son requeridos")
        
        # Validar que el monto sea positivo
        if monto <= 0:
            raise HTTPException(status_code=422, detail="El monto debe ser mayor a 0")
        
        # Asegurar que la fecha esté en formato YYYY-MM-DD para la base de datos
        fecha_db = fecha
        if fecha and '-' in fecha:
            # Si la fecha viene en formato DD-MM-YYYY, convertir a YYYY-MM-DD
            if len(fecha.split('-')[0]) == 2:
                try:
                    from datetime import datetime
                    fecha_obj = datetime.strptime(fecha, "%d-%m-%Y")
                    fecha_db = fecha_obj.strftime("%Y-%m-%d")
                except ValueError:
                    # Si falla el parsing, usar la fecha tal como viene
                    fecha_db = fecha
        
        datos = {
            "fecha": fecha_db,
            "numero_factura": numero_factura,
            "area": area,
            "monto": monto,
            "metodo_pago": metodo_pago,
            "encargado": encargado
        }
        
        # Guardando datos
        guardar_cuadre_caja(datos)
        return {"success": True, "message": "Factura guardada correctamente"}
    except HTTPException as he:
        # HTTPException
        return {"success": False, "message": str(he.detail)}
    except Exception as e:
        # Error al guardar factura
        return {"success": False, "message": f"Error al guardar factura: {str(e)}"}


@app.post("/guardar-gasto")
def guardar_gasto(
    fecha: str = Form(...),
    proveedor: str = Form(...),
    concepto: str = Form(...),
    valor: float = Form(...)
):
    """Guardar gasto individual."""
    try:
        # Validar que todos los campos requeridos estén presentes
        if not fecha or not proveedor or not concepto or valor is None:
            raise HTTPException(status_code=422, detail="Todos los campos son requeridos")
        
        # Validar que el valor sea positivo
        if valor <= 0:
            raise HTTPException(status_code=422, detail="El valor debe ser mayor a 0")
        
        # Asegurar que la fecha esté en formato YYYY-MM-DD para la base de datos
        fecha_db = fecha
        if fecha and '-' in fecha:
            # Si la fecha viene en formato DD-MM-YYYY, convertir a YYYY-MM-DD
            if len(fecha.split('-')[0]) == 2:
                try:
                    from datetime import datetime
                    fecha_obj = datetime.strptime(fecha, "%d-%m-%Y")
                    fecha_db = fecha_obj.strftime("%Y-%m-%d")
                except ValueError:
                    # Si falla el parsing, usar la fecha tal como viene
                    fecha_db = fecha
            # Si la fecha viene en formato DD/MM/YYYY, convertir a YYYY-MM-DD
            elif '/' in fecha:
                try:
                    from datetime import datetime
                    fecha_obj = datetime.strptime(fecha, "%d/%m/%Y")
                    fecha_db = fecha_obj.strftime("%Y-%m-%d")
                except ValueError:
                    # Si falla el parsing, usar la fecha tal como viene
                    fecha_db = fecha
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO gastos (fecha, proveedor, concepto, valor)
            VALUES (?, ?, ?, ?)
        """, (fecha_db, proveedor, concepto, valor))
        conn.commit()
        conn.close()
        return {"success": True, "message": "Gasto guardado correctamente"}
    except HTTPException as he:
        return {"success": False, "message": str(he.detail)}
    except Exception as e:
        # Error al guardar gasto
        return {"success": False, "message": f"Error al guardar gasto: {str(e)}"}


@app.get("/api/empleados")
def obtener_empleados_api():
    """Obtener lista de empleados en formato JSON."""
    try:
        conn = get_db()
        empleados = obtener_empleados(conn)
        conn.close()
        return empleados
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener empleados: {str(e)}")

@app.get("/api/estadisticas")
def obtener_estadisticas_api():
    """Obtener estadísticas del sistema."""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Total empleados
        cursor.execute("SELECT COUNT(*) FROM empleados")
        total_empleados = cursor.fetchone()[0]
        
        # Empleados por tipo
        cursor.execute("SELECT tipo, COUNT(*) FROM empleados GROUP BY tipo")
        empleados_por_tipo = dict(cursor.fetchall())
        empleados_fijos = empleados_por_tipo.get('FIJO', 0)
        empleados_temporales = empleados_por_tipo.get('TEMPORAL', 0)
        
        # Total nómina quincena actual
        from datetime import date
        hoy = date.today()
        quincena = f"15_{hoy.month:02d}_{hoy.year}" if hoy.day <= 15 else f"31_{hoy.month:02d}_{hoy.year}"
        
        try:
            empleados = obtener_empleados(conn)
            if empleados:
                nominas = calcular_nominas(empleados, quincena)
                total_nomina_quincena = sum(nomina["resumen"]["neto"] for nomina in nominas if nomina["resumen"])
            else:
                total_nomina_quincena = 0
        except Exception:
            total_nomina_quincena = 0
        
        # Total facturación del mes actual
        mes_actual = f"{hoy.year}-{hoy.month:02d}"
        cursor.execute("SELECT SUM(monto) FROM cuadre_caja WHERE fecha LIKE ?", (f"{mes_actual}%",))
        total_facturacion_mes = cursor.fetchone()[0] or 0
        
        # Total gastos del mes actual
        cursor.execute("SELECT SUM(valor) FROM gastos WHERE fecha LIKE ?", (f"{mes_actual}%",))
        total_gastos_mes = cursor.fetchone()[0] or 0
        
        conn.close()
        
        return {
            "total_empleados": total_empleados,
            "empleados_fijos": empleados_fijos,
            "empleados_temporales": empleados_temporales,
            "total_nomina_quincena": total_nomina_quincena,
            "total_facturacion_mes": total_facturacion_mes,
            "total_gastos_mes": total_gastos_mes
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener estadísticas: {str(e)}")

@app.get("/api/configuracion")
def obtener_configuracion_api():
    """Obtener configuración del sistema."""
    try:
        from utils import cargar_configuracion
        config = cargar_configuracion()
        return config
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener configuración: {str(e)}")

@app.post("/api/configuracion")
def actualizar_configuracion_api(config_data: dict):
    """Actualizar configuración del sistema."""
    try:
        # Aquí podrías implementar la lógica para guardar la configuración
        # Por ahora solo retornamos éxito
        return {"success": True, "message": "Configuración actualizada correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al actualizar configuración: {str(e)}")

@app.post("/generar-nomina")
def generar_nomina_api(payload: dict):
    """Generar nómina para un período específico."""
    try:
        fecha_inicio = payload.get("fecha_inicio")
        fecha_fin = payload.get("fecha_fin")
        
        if not fecha_inicio or not fecha_fin:
            raise HTTPException(status_code=400, detail="Fechas de inicio y fin son requeridas")
        
        # Obtener empleados de la base de datos
        conn = get_db()
        empleados = obtener_empleados(conn)
        conn.close()
        
        if not empleados:
            raise HTTPException(status_code=404, detail="No hay empleados registrados")
        
        # Calcular nómina para el período especificado
        # Convertir fechas a formato de quincena
        from datetime import datetime
        fecha_inicio_dt = datetime.strptime(fecha_inicio, "%Y-%m-%d")
        fecha_fin_dt = datetime.strptime(fecha_fin, "%Y-%m-%d")
        
        # Crear nombre de quincena basado en las fechas
        if fecha_inicio_dt.day <= 15:
            quincena = f"15_{fecha_inicio_dt.month:02d}_{fecha_inicio_dt.year}"
        else:
            quincena = f"31_{fecha_inicio_dt.month:02d}_{fecha_inicio_dt.year}"
        
        # Calcular nóminas usando la función existente
        nominas = calcular_nominas(empleados, quincena)
        
        if not nominas:
            raise HTTPException(status_code=404, detail="No se encontraron datos de nómina para el período especificado")
        
        # Generar archivo Excel con la nómina
        from utils import exportar_nomina_plantilla
        filepath = exportar_nomina_plantilla(quincena, "general")
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=500, detail="Error al generar archivo de nómina")
        
        # Retornar éxito con información del archivo
        return {
            "success": True, 
            "message": f"Nómina generada correctamente para {len(nominas)} empleados",
            "archivo_url": f"/descargar-nomina/{os.path.basename(filepath)}",
            "empleados_procesados": len(nominas),
            "quincena": quincena
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar nómina: {str(e)}")

@app.post("/generar-reporte-general")
def generar_reporte_general_api(payload: dict):
    """Generar reporte general del sistema."""
    try:
        fecha_inicio = payload.get("fecha_inicio")
        fecha_fin = payload.get("fecha_fin")
        
        if not fecha_inicio or not fecha_fin:
            raise HTTPException(status_code=400, detail="Fechas de inicio y fin son requeridas")
        
        # Generar el reporte usando la función de utils
        from utils import generar_reporte_general
        filepath = generar_reporte_general(fecha_inicio, fecha_fin)
        
        # Retornar la ruta del archivo para descargar
        return {
            "success": True, 
            "message": "Reporte general generado correctamente",
            "archivo_url": f"/descargar-reporte/{os.path.basename(filepath)}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar reporte: {str(e)}")

@app.post("/generar-comprobante-empleado")
def generar_comprobante_empleado_api(payload: dict):
    """Generar comprobante de pago para un empleado específico."""
    try:
        empleado_id = payload.get("empleado_id")
        fecha_inicio = payload.get("fecha_inicio")
        fecha_fin = payload.get("fecha_fin")
        
        if not empleado_id:
            raise HTTPException(status_code=400, detail="ID de empleado es requerido")
        
        if not fecha_inicio or not fecha_fin:
            raise HTTPException(status_code=400, detail="Fechas de inicio y fin son requeridas")
        
        # Obtener información del empleado
        conn = get_db()
        cursor = conn.cursor()
        
        cursor.execute("SELECT nombre, cedula, tipo, salario FROM empleados WHERE id = ?", (empleado_id,))
        empleado = cursor.fetchone()
        
        if not empleado:
            conn.close()
            raise HTTPException(status_code=404, detail="Empleado no encontrado")
        
        nombre, cedula, tipo_contrato, salario = empleado
        
        # Convertir fechas a formato de quincena
        from datetime import datetime
        fecha_inicio_dt = datetime.strptime(fecha_inicio, "%Y-%m-%d")
        fecha_fin_dt = datetime.strptime(fecha_fin, "%Y-%m-%d")
        
        # Crear nombre de quincena basado en las fechas
        if fecha_inicio_dt.day <= 15:
            quincena = f"15_{fecha_inicio_dt.month:02d}_{fecha_inicio_dt.year}"
        else:
            quincena = f"31_{fecha_inicio_dt.month:02d}_{fecha_inicio_dt.year}"
        
        # Obtener horas trabajadas del empleado
        cursor.execute("""
            SELECT horas_ordinarias, recargo_nocturno, recargo_diurno_dominical,
                   recargo_nocturno_dominical, hora_extra_diurna, hora_extra_nocturna,
                   hora_diurna_dominical_o_festivo, hora_extra_diurna_dominical_o_festivo,
                   hora_nocturna_dominical_o_festivo, hora_extra_nocturna_dominical_o_festivo,
                   motivo_deuda, valor_deuda
            FROM horas_trabajadas 
            WHERE empleado_id = ? AND quincena = ?
        """, (empleado_id, quincena))
        
        horas = cursor.fetchone()
        conn.close()
        
        if not horas:
            raise HTTPException(status_code=404, detail="No se encontraron datos de horas para el empleado en la quincena especificada")
        
        # Calcular nómina del empleado
        from utils import calcular_nominas
        empleados_data = [{"id": empleado_id, "nombre": nombre, "cedula": cedula, "tipo": tipo_contrato, "salario": salario}]
        nominas = calcular_nominas(empleados_data, quincena)
        
        if not nominas:
            raise HTTPException(status_code=500, detail="Error al calcular nómina del empleado")
        
        nomina = nominas[0]  # Solo un empleado
        
        # Generar comprobante PDF
        from utils import generar_comprobante_pdf
        pdf_path = generar_comprobante_pdf(
            empleado_id,  # Solo necesitamos el ID del empleado
            quincena
        )
        
        if not pdf_path or not os.path.exists(pdf_path):
            raise HTTPException(status_code=500, detail="Error al generar comprobante PDF")
        
        # Retornar éxito con información del archivo
        return {
            "success": True, 
            "message": f"Comprobante generado correctamente para {nombre}",
            "archivo_url": f"/pdfs/{os.path.basename(pdf_path)}",
            "nombre_archivo": f"COMPROBANTE_{nombre.replace(' ', '_')}_{cedula}_{quincena}.pdf",
            "empleado": nombre,
            "quincena": quincena
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al generar comprobante: {str(e)}")

@app.post("/generar-comprobantes")
def generar_comprobantes_api(payload: dict):
    """Generar comprobantes de pago para un período específico."""
    try:
        fecha_inicio = payload.get("fecha_inicio")
        fecha_fin = payload.get("fecha_fin")
        
        if not fecha_inicio or not fecha_fin:
            raise HTTPException(status_code=400, detail="Fechas de inicio y fin son requeridas")
        
        # Obtener empleados de la base de datos
        conn = get_db()
        empleados = obtener_empleados(conn)
        conn.close()
        
        if not empleados:
            raise HTTPException(status_code=404, detail="No hay empleados registrados")
        
        # Convertir fechas a formato de quincena
        from datetime import datetime
        fecha_inicio_dt = datetime.strptime(fecha_inicio, "%Y-%m-%d")
        fecha_fin_dt = datetime.strptime(fecha_fin, "%Y-%m-%d")
        
        # Crear nombre de quincena basado en las fechas
        if fecha_inicio_dt.day <= 15:
            quincena = f"15_{fecha_inicio_dt.month:02d}_{fecha_inicio_dt.year}"
        else:
            quincena = f"31_{fecha_inicio_dt.month:02d}_{fecha_inicio_dt.year}"
        
        # Calcular nóminas para generar comprobantes
        # Convertir empleados para usar la clave 'tipo' en lugar de 'tipo_contrato'
        empleados_para_nomina = []
        for emp in empleados:
            # Mapear el tipo del frontend al tipo de la base de datos
            tipo_db = "FIJO" if emp["tipo_contrato"] == "Fijo" else "TEMPORAL"
            empleado_nomina = {
                "id": emp["id"],
                "nombre": emp["nombre"],
                "cedula": emp["cedula"],
                "tipo": tipo_db,  # Usar el tipo de la base de datos (FIJO/TEMPORAL)
                "salario": emp["salario"]
            }
            empleados_para_nomina.append(empleado_nomina)
        
        nominas = calcular_nominas(empleados_para_nomina, quincena)
        
        if not nominas:
            raise HTTPException(status_code=404, detail="No se encontraron datos de nómina para el período especificado")
        
        # Generar comprobantes PDF para cada empleado
        archivos_generados = []
        from utils import generar_comprobante_pdf
        
        for nomina in nominas:
            empleado = next((e for e in empleados if e["id"] == nomina["empleado_id"]), None)
            if empleado:
                try:
                    # Generar comprobante PDF
                    pdf_path = generar_comprobante_pdf(
                        empleado["id"],  # Solo necesitamos el ID del empleado
                        quincena
                    )
                    
                    if pdf_path and os.path.exists(pdf_path):
                        archivos_generados.append({
                            "empleado": empleado["nombre"],
                            "archivo": os.path.basename(pdf_path),
                            "url": f"/pdfs/{os.path.basename(pdf_path)}"
                        })
                except Exception as e:
                    print(f"Error generando comprobante para {empleado['nombre']}: {str(e)}")
                    continue
        
        if not archivos_generados:
            raise HTTPException(status_code=500, detail="No se pudieron generar comprobantes")
        
        # Retornar éxito con información de los archivos generados
        return {
            "success": True, 
            "message": f"Comprobantes generados correctamente para {len(archivos_generados)} empleados",
            "archivos_generados": archivos_generados,
            "total_empleados": len(archivos_generados),
            "quincena": quincena
        }
        
    except Exception as e:
        print(f"Error en generar_comprobantes_api: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al generar comprobantes: {str(e)}")

@app.post("/guardar-horas-detalladas")
def guardar_horas_detalladas_api(
    empleado_id: int = Form(...),
    fecha: str = Form(...),
    quincena: str = Form(...),
    horas_ordinarias: str = Form("0"),
    recargo_nocturno: str = Form("0"),
    recargo_diurno_dominical: str = Form("0"),
    recargo_nocturno_dominical: str = Form("0"),
    hora_extra_diurna: str = Form("0"),
    hora_extra_nocturna: str = Form("0"),
    hora_extra_diurna_dominical: str = Form("0"),
    hora_extra_nocturna_dominical: str = Form("0"),
    hora_diurna_dominical_o_festivo: str = Form("0"),
    hora_nocturna_dominical_o_festivo: str = Form("0"),
    hora_extra_diurna_dominical_o_festivo: str = Form("0"),
    hora_extra_nocturna_dominical_o_festivo: str = Form("0"),
    motivo_deuda: str = Form(""),
    valor_deuda: str = Form("0"),
    descuento_inasistencia: str = Form("0"),
    otros_descuentos: str = Form(""),
    valor_otros_descuentos: str = Form("0")
):
    """Guardar horas detalladas de un empleado."""
    try:
        # Convertir strings a float, manejando valores vacíos como 0.0
        def safe_float(value: str) -> float:
            if not value or value.strip() == "":
                return 0.0
            try:
                return float(value)
            except (ValueError, TypeError):
                return 0.0
        
        guardar_horas_trabajadas(
            empleado_id,
            quincena,
            safe_float(horas_ordinarias),
            safe_float(recargo_nocturno),
            safe_float(recargo_diurno_dominical),
            safe_float(recargo_nocturno_dominical),
            safe_float(hora_extra_diurna),
            safe_float(hora_extra_nocturna),
            safe_float(hora_diurna_dominical_o_festivo),
            safe_float(hora_extra_diurna_dominical_o_festivo),
            safe_float(hora_nocturna_dominical_o_festivo),
            safe_float(hora_extra_nocturna_dominical_o_festivo),
            motivo_deuda,
            safe_float(valor_deuda),
            safe_float(descuento_inasistencia),
            otros_descuentos,
            safe_float(valor_otros_descuentos)
        )
        return {"success": True, "message": "Horas detalladas guardadas correctamente"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al guardar horas: {str(e)}")

@app.get("/api/resumen-dia")
async def obtener_resumen_dia(fecha: str | None = None):
    """Obtener resumen del día para cuadre de caja."""
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Si no se proporciona fecha, usar la fecha actual en Colombia
        if not fecha:
            import pytz
            from datetime import datetime
            colombia_tz = pytz.timezone('America/Bogota')
            fecha_actual = datetime.now(colombia_tz)
            fecha = fecha_actual.strftime("%Y-%m-%d")
        else:
            # La fecha ya debe estar en formato YYYY-MM-DD
            # Si viene en formato DD-MM-YYYY, convertirla
            if '-' in fecha and len(fecha.split('-')[0]) == 2:
                try:
                    from datetime import datetime
                    fecha_obj = datetime.strptime(fecha, "%d-%m-%Y")
                    fecha = fecha_obj.strftime("%Y-%m-%d")
                except ValueError:
                    # Si falla el parsing, usar la fecha tal como viene
                    pass
        
        # Consultando resumen para fecha
        
        # Obtener ventas del día
        cursor.execute("""
            SELECT id, numero_factura, area, monto, metodo_pago, encargado
            FROM cuadre_caja 
            WHERE fecha = ?
            ORDER BY numero_factura
        """, (fecha,))
        ventas = cursor.fetchall()
        
        # Obtener gastos del día
        cursor.execute("""
            SELECT id, concepto, valor, fecha
            FROM gastos 
            WHERE fecha = ?
            ORDER BY concepto
        """, (fecha,))
        gastos = cursor.fetchall()
        
        # Calcular totales por método de pago
        cursor.execute("""
            SELECT metodo_pago, SUM(monto) as total
            FROM cuadre_caja 
            WHERE fecha = ?
            GROUP BY metodo_pago
        """, (fecha,))
        totales_por_metodo = cursor.fetchall()
        
        # Inicializar totales
        resumen = {
            "efectivo": 0,
            "transferencia": 0,
            "datafono": 0,
            "qr": 0,
            "cxc": 0,
            "gastos": 0,
            "ventas": [],
            "gastos": []
        }
        
        # Llenar totales por método de pago
        for metodo, total in totales_por_metodo:
            if metodo:
                metodo_lower = metodo.lower()
                if "efectivo" in metodo_lower:
                    resumen["efectivo"] = total
                elif "transferencia" in metodo_lower:
                    resumen["transferencia"] = total
                elif "datafono" in metodo_lower or "tarjeta" in metodo_lower:
                    resumen["datafono"] = total
                elif "qr" in metodo_lower:
                    resumen["qr"] = total
                elif "cxc" in metodo_lower or "cuenta" in metodo_lower:
                    resumen["cxc"] = total
                else:
                    # Si no coincide con ningún método conocido, sumar a efectivo
                    resumen["efectivo"] += total
        
        # Calcular total de gastos
        total_gastos = sum(gasto[2] for gasto in gastos)
        resumen["gastos"] = total_gastos
        
        # Convertir ventas a formato de diccionario
        resumen["ventas"] = [
            {
                "id": venta[0],
                "numero_factura": venta[1],
                "area": venta[2],
                "monto": venta[3],
                "metodo_pago": venta[4],
                "encargado": venta[5]
            }
            for venta in ventas
        ]
        
        # Convertir gastos a formato de diccionario
        resumen["gastos_lista"] = [
            {
                "id": gasto[0],
                "concepto": gasto[1],
                "valor": gasto[2],
                "fecha": gasto[3]
            }
            for gasto in gastos
        ]
        
        # Resumen generado
        return resumen
        
    except Exception as e:
        # Error en obtener_resumen_dia
        raise HTTPException(status_code=500, detail=f"Error al obtener resumen del día: {str(e)}")
    finally:
        if conn:
            conn.close()


@app.post("/limpiar-resumen-dia")
def limpiar_resumen_dia(payload: dict):
    """Limpiar resumen del día para una fecha específica."""
    conn = None
    try:
        fecha = payload.get("fecha")
        if not fecha:
            raise HTTPException(status_code=400, detail="Fecha requerida")
        
        # La fecha ya debe estar en formato YYYY-MM-DD para la base de datos
        fecha_db = fecha
        
        conn = get_db()
        cursor = conn.cursor()
        
        # Eliminar ventas del día
        cursor.execute("DELETE FROM cuadre_caja WHERE fecha = ?", (fecha_db,))
        ventas_eliminadas = cursor.rowcount
        
        # Eliminar gastos del día
        cursor.execute("DELETE FROM gastos WHERE fecha = ?", (fecha_db,))
        gastos_eliminados = cursor.rowcount
        
        conn.commit()
        
        return {
            "success": True,
            "message": f"Resumen del día {fecha} limpiado correctamente. Se eliminaron {ventas_eliminadas} ventas y {gastos_eliminados} gastos."
        }
        
    except Exception as e:
        # Error al limpiar resumen del día
        raise HTTPException(status_code=500, detail=f"Error al limpiar resumen: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.post("/limpiar-todos-resumenes")
def limpiar_todos_resumenes():
    """Limpiar todos los resúmenes de todos los días."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Eliminar todas las ventas
        cursor.execute("DELETE FROM cuadre_caja")
        ventas_eliminadas = cursor.rowcount
        
        # Eliminar todos los gastos
        cursor.execute("DELETE FROM gastos")
        gastos_eliminados = cursor.rowcount
        
        conn.commit()
        
        return {
            "success": True,
            "message": f"Todos los resúmenes han sido limpiados correctamente. Se eliminaron {ventas_eliminadas} ventas y {gastos_eliminados} gastos."
        }
        
    except Exception as e:
        # Error al limpiar todos los resúmenes
        raise HTTPException(status_code=500, detail=f"Error al limpiar todos los resúmenes: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.get("/exportar-cuadre")
def exportar_cuadre_route(fecha: str | None = None):
    """Exportar cuadre de caja para una fecha específica."""
    # === FUNCIÓN ELIMINADA: exportar_cuadre_caja ===
    # Esta función ha sido reemplazada por exportar_cuadre_caja_plantilla
    # que usa archivos de plantilla existentes para mayor eficiencia
    raise HTTPException(status_code=501, detail="Función no implementada. Use /exportar-cuadre-plantilla en su lugar.")

@app.post("/exportar-cuadre-plantilla")
def exportar_cuadre_plantilla_route(payload: PayloadCuadre):
    """Exportar cuadre de caja usando plantilla existente."""
    try:
        filepath = exportar_cuadre_caja_plantilla(payload.fecha)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Archivo no encontrado")
        
        # Extraer nombre del archivo de la ruta
        filename = os.path.basename(filepath)
        
        return FileResponse(filepath, filename=filename)
    except Exception as e:
        # Error al exportar cuadre con plantilla
        raise HTTPException(status_code=500, detail=f"Error al exportar: {str(e)}")

@app.post("/exportar-nomina-plantilla")
def exportar_nomina_plantilla_route(payload: dict):
    """Exportar nómina usando plantilla existente."""
    try:
        quincena = payload.get("quincena")
        tipo_nomina = payload.get("tipo_nomina", "general")
        
        if not quincena:
            raise HTTPException(status_code=400, detail="Quincena es requerida")
        
        # Generar fecha de exportación actual
        from datetime import datetime
        fecha_exportacion = datetime.now().strftime("%d-%m-%Y")
        
        # Llamar a la función de utils con los parámetros correctos
        from utils import exportar_nomina_plantilla
        filepath = exportar_nomina_plantilla(quincena=quincena, tipo_nomina=tipo_nomina)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Archivo no encontrado")
        
        # Extraer nombre del archivo de la ruta
        filename = os.path.basename(filepath)
        
        return FileResponse(filepath, filename=filename)
    except Exception as e:
        # Error al exportar nómina con plantilla
        print(f"Error en exportar_nomina_plantilla_route: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al exportar: {str(e)}")


@app.get("/descargar-nomina/{filename}")
def descargar_nomina(filename: str):
    """Descargar archivo de nómina generado."""
    try:
        # Buscar el archivo en el directorio de excels
        filepath = os.path.join(EXCEL_DIR, filename)
        
        if not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Archivo de nómina no encontrado")
        
        return FileResponse(filepath, filename=filename)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al descargar nómina: {str(e)}")

@app.post("/subir-nomina-drive")
def subir_nomina_drive(payload: dict):
    """Subir archivo de nómina a Google Drive."""
    try:
        try:
            from .google_drive import upload_nomina_to_drive
            from .export_functions import exportar_nomina_excel
        except ImportError:
            from google_drive import upload_nomina_to_drive
            from export_functions import exportar_nomina_excel
        
        # Obtener parámetros del payload
        quincena = payload.get("quincena")
        tipo_nomina = payload.get("tipo_nomina", "general")
        
        if not quincena:
            raise HTTPException(status_code=400, detail="Quincena es requerida")
        
        # Exportar nómina a Excel
        filepath = exportar_nomina_excel(quincena, tipo_nomina)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Archivo de nómina no encontrado")
        
        # Subir a Google Drive
        result = upload_nomina_to_drive(filepath)
        
        if result:
            return {
                "success": True, 
                "message": "Archivo subido exitosamente a Google Drive",
                "file_id": result['id'],
                "file_name": result['name'],
                "web_link": result['webViewLink']
            }
        else:
            raise HTTPException(status_code=500, detail="Error al subir archivo a Google Drive")
            
    except Exception as e:
        # Error al subir nómina
        raise HTTPException(status_code=500, detail=f"Error al subir nómina: {str(e)}")


@app.post("/subir-cuadre-drive")
def subir_cuadre_drive(fecha: str = Form(None)):
    """Subir archivo de cuadre de caja a Google Drive para una fecha específica."""
    try:
        try:
            from .google_drive import upload_cuadre_to_drive
            from .export_functions import exportar_cuadre_caja_excel
        except ImportError:
            from google_drive import upload_cuadre_to_drive
            from export_functions import exportar_cuadre_caja_excel
        
        if not fecha:
            raise HTTPException(status_code=400, detail="Fecha es requerida")
        
        # Exportar cuadre de caja a Excel
        filepath = exportar_cuadre_caja_excel(fecha)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="Archivo de cuadre no encontrado")
        
        # Subir a Google Drive
        result = upload_cuadre_to_drive(filepath)
        
        if result:
            return {
                "success": True, 
                "message": "Archivo subido exitosamente a Google Drive",
                "file_id": result['id'],
                "file_name": result['name'],
                "web_link": result['webViewLink']
            }
        else:
            raise HTTPException(status_code=500, detail="Error al subir archivo a Google Drive")
            
    except Exception as e:
        # Error al subir cuadre
        raise HTTPException(status_code=500, detail=f"Error al subir cuadre: {str(e)}")


# ========================================
# RUTAS DE EXPORTACIÓN ADICIONALES
# ========================================

@app.post("/exportar-empleados")
def exportar_empleados_route(filtros: dict = None):
    """Exportar empleados a Excel con filtros opcionales."""
    try:
        try:
            from .export_functions import exportar_empleados_excel
        except ImportError:
            from export_functions import exportar_empleados_excel
        
        filepath = exportar_empleados_excel(filtros)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="No se encontraron empleados para exportar")
        
        filename = os.path.basename(filepath)
        return FileResponse(filepath, filename=filename)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar empleados: {str(e)}")

@app.post("/exportar-horas")
def exportar_horas_route(periodo: str, empleado_id: int = None):
    """Exportar horas trabajadas a Excel."""
    try:
        try:
            from .export_functions import exportar_horas_excel
        except ImportError:
            from export_functions import exportar_horas_excel
        
        filepath = exportar_horas_excel(periodo, empleado_id)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="No se encontraron horas para exportar")
        
        filename = os.path.basename(filepath)
        return FileResponse(filepath, filename=filename)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar horas: {str(e)}")

@app.post("/exportar-inventario")
def exportar_inventario_route(filtros: dict = None):
    """Exportar inventario a Excel con filtros opcionales."""
    try:
        try:
            from .export_functions import exportar_inventario_excel
        except ImportError:
            from export_functions import exportar_inventario_excel
        
        filepath = exportar_inventario_excel(filtros)
        
        if not filepath or not os.path.exists(filepath):
            raise HTTPException(status_code=404, detail="No se encontraron productos para exportar")
        
        filename = os.path.basename(filepath)
        return FileResponse(filepath, filename=filename)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al exportar inventario: {str(e)}")

@app.get("/google-drive-status")
def google_drive_status():
    """Verificar estado de configuración de Google Drive."""
    try:
        try:
            from .google_drive import check_google_drive_setup
        except ImportError:
            from google_drive import check_google_drive_setup
        
        status = check_google_drive_setup()
        return status
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error verificando Google Drive: {str(e)}")

@app.get("/google-drive-files")
def google_drive_files(folder_name: str = None):
    """Obtener lista de archivos de Google Drive."""
    try:
        try:
            from .google_drive import get_drive_files
        except ImportError:
            from google_drive import get_drive_files
        
        files = get_drive_files(folder_name)
        return {"files": files}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo archivos de Drive: {str(e)}")

@app.delete("/google-drive-file/{file_id}")
def delete_google_drive_file(file_id: str):
    """Eliminar archivo de Google Drive."""
    try:
        try:
            from .google_drive import delete_drive_file
        except ImportError:
            from google_drive import delete_drive_file
        
        success = delete_drive_file(file_id)
        
        if success:
            return {"success": True, "message": "Archivo eliminado exitosamente"}
        else:
            raise HTTPException(status_code=500, detail="Error al eliminar archivo")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error eliminando archivo: {str(e)}")

@app.delete("/eliminar-factura/{factura_id}")
async def eliminar_factura(factura_id: int):
    """Eliminar una factura específica de la base de datos."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Verificar que la factura existe
        cursor.execute("SELECT * FROM cuadre_caja WHERE id = ?", (factura_id,))
        factura = cursor.fetchone()
        
        if not factura:
            raise HTTPException(status_code=404, detail="Factura no encontrada")
        
        # Eliminar la factura
        cursor.execute("DELETE FROM cuadre_caja WHERE id = ?", (factura_id,))
        conn.commit()
        
        return {"success": True, "message": "Factura eliminada correctamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        # Error al eliminar factura
        raise HTTPException(status_code=500, detail=f"Error al eliminar factura: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.put("/editar-factura/{factura_id}")
async def editar_factura(
    factura_id: int,
    fecha: str = Form(...),
    numero_factura: str = Form(...),
    area: str = Form(...),
    monto: float = Form(...),
    metodo_pago: str = Form(...),
    encargado: str = Form(default="")
):
    """Editar una factura existente en la base de datos."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Verificar que la factura existe
        cursor.execute("SELECT * FROM cuadre_caja WHERE id = ?", (factura_id,))
        factura = cursor.fetchone()
        
        if not factura:
            raise HTTPException(status_code=404, detail="Factura no encontrada")
        
        # Asegurar que la fecha esté en formato YYYY-MM-DD para la base de datos
        fecha_db = fecha
        if fecha and '-' in fecha:
            # Si la fecha viene en formato DD-MM-YYYY, convertir a YYYY-MM-DD
            if len(fecha.split('-')[0]) == 2:
                try:
                    from datetime import datetime
                    fecha_obj = datetime.strptime(fecha, "%d-%m-%Y")
                    fecha_db = fecha_obj.strftime("%Y-%m-%d")
                except ValueError:
                    # Si falla el parsing, usar la fecha tal como viene
                    fecha_db = fecha
        
        # Actualizar la factura
        cursor.execute("""
            UPDATE cuadre_caja 
            SET fecha = ?, numero_factura = ?, area = ?, monto = ?, metodo_pago = ?, encargado = ?
            WHERE id = ?
        """, (fecha_db, numero_factura, area, monto, metodo_pago, encargado, factura_id))
        
        conn.commit()
        
        return {"success": True, "message": "Factura actualizada correctamente"}
        
    except HTTPException as he:
        raise he
    except Exception as e:
        # Error al editar factura
        raise HTTPException(status_code=500, detail=f"Error al editar factura: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.delete("/eliminar-gasto/{gasto_id}")
async def eliminar_gasto(gasto_id: int):
    """Eliminar un gasto específico de la base de datos."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Verificar que el gasto existe
        cursor.execute("SELECT id FROM gastos WHERE id = ?", (gasto_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Gasto no encontrado")
        
        # Eliminar el gasto
        cursor.execute("DELETE FROM gastos WHERE id = ?", (gasto_id,))
        conn.commit()
        
        return {"success": True, "message": "Gasto eliminado correctamente"}
        
    except HTTPException:
        raise
    except Exception as e:
        # Error al eliminar gasto
        raise HTTPException(status_code=500, detail=f"Error al eliminar gasto: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.post("/limpiar-nomina-total")
async def limpiar_nomina_total():
    """Limpiar todos los datos de nómina de la base de datos."""
    conn = None
    try:
        conn = get_db()
        cursor = conn.cursor()
        
        # Limpiar tabla de horas trabajadas
        cursor.execute("DELETE FROM horas_trabajadas")
        
        # Limpiar tabla de empleados (opcional, comentado por seguridad)
        # cursor.execute("DELETE FROM empleados")
        
        conn.commit()
        
        return {"success": True, "message": "Nómina total limpiada correctamente"}
        
    except Exception as e:
        # Error al limpiar nómina total
        raise HTTPException(status_code=500, detail=f"Error al limpiar nómina total: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.post("/limpiar-excel-nomina")
async def limpiar_excel_nomina():
    """Limpiar el archivo Excel de nómina generado."""
    try:
        import os
        import glob
        
        # Buscar archivos de nómina generados
        excel_dir = os.path.join(os.path.dirname(__file__), "..", "plantillas")
        nomina_files = glob.glob(os.path.join(excel_dir, "NOMINA_GENERADA*.xlsx"))
        
        deleted_count = 0
        for file_path in nomina_files:
            try:
                os.remove(file_path)
                deleted_count += 1
                # Archivo eliminado
            except Exception as e:
                # Error al eliminar archivo
                pass
        
        if deleted_count > 0:
            return {"success": True, "message": f"Se eliminaron {deleted_count} archivos de nómina generados"}
        else:
            return {"success": True, "message": "No se encontraron archivos de nómina generados para eliminar"}
        
    except Exception as e:
        # Error al limpiar Excel de nómina
        raise HTTPException(status_code=500, detail=f"Error al limpiar Excel de nómina: {str(e)}")

# === RUTAS DEPRECADAS ===

@app.get("/descargar-reporte/{filename}")
async def descargar_reporte(filename: str):
    """Descargar archivo de reporte generado."""
    try:
        import os
        from fastapi.responses import FileResponse
        
        # Construir la ruta del archivo
        file_path = os.path.join(os.path.dirname(__file__), "..", "plantillas", filename)
        
        # Verificar que el archivo existe
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail="Archivo no encontrado")
        
        # Retornar el archivo para descargar
        return FileResponse(
            path=file_path,
            filename=filename,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al descargar archivo: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)