# backend/database.py
"""
Gestión de base de datos SQLite para el sistema de nómina Villa Venecia
"""

import sqlite3
import os

# === Configuración de rutas ===
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "nomina.db")

def get_db():
    """Obtener conexión a la base de datos."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Inicializar la base de datos con las tablas necesarias."""
    conn = get_db()
    cursor = conn.cursor()
    
    # Tabla de empleados
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS empleados (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            cedula TEXT NOT NULL UNIQUE,
            tipo TEXT NOT NULL CHECK(tipo IN ('FIJO', 'TEMPORAL')),
            salario REAL NOT NULL,
            comentario TEXT,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Verificar si existe la columna tipo_empleado, si no, agregarla
    cursor.execute("PRAGMA table_info(empleados)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'tipo_empleado' not in columns:
        cursor.execute("ALTER TABLE empleados ADD COLUMN tipo_empleado TEXT DEFAULT 'FIJO'")
        print("Columna tipo_empleado agregada a la tabla empleados")
    
    # Tabla de horas trabajadas (una fila por empleado-quincena)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS horas_trabajadas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            empleado_id INTEGER,
            quincena TEXT NOT NULL,
            horas_ordinarias REAL DEFAULT 0,
            recargo_nocturno REAL DEFAULT 0,
            recargo_diurno_dominical REAL DEFAULT 0,
            recargo_nocturno_dominical REAL DEFAULT 0,
            hora_extra_diurna REAL DEFAULT 0,
            hora_extra_nocturna REAL DEFAULT 0,
            hora_diurna_dominical_o_festivo REAL DEFAULT 0,
            hora_extra_diurna_dominical_o_festivo REAL DEFAULT 0,
            hora_nocturna_dominical_o_festivo REAL DEFAULT 0,
            hora_extra_nocturna_dominical_o_festivo REAL DEFAULT 0,
            motivo_deuda TEXT DEFAULT '',
            valor_deuda REAL DEFAULT 0,
            descuento_inasistencia REAL DEFAULT 0,
            otros_descuentos TEXT DEFAULT '',
            valor_otros_descuentos REAL DEFAULT 0,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (empleado_id) REFERENCES empleados (id),
            UNIQUE(empleado_id, quincena)
        )
    """)
    
    # Verificar si existen las nuevas columnas de descuentos, si no, agregarlas
    cursor.execute("PRAGMA table_info(horas_trabajadas)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'descuento_inasistencia' not in columns:
        cursor.execute("ALTER TABLE horas_trabajadas ADD COLUMN descuento_inasistencia REAL DEFAULT 0")
        print("Columna descuento_inasistencia agregada a la tabla horas_trabajadas")
    
    if 'otros_descuentos' not in columns:
        cursor.execute("ALTER TABLE horas_trabajadas ADD COLUMN otros_descuentos TEXT DEFAULT ''")
        print("Columna otros_descuentos agregada a la tabla horas_trabajadas")
    
    if 'valor_otros_descuentos' not in columns:
        cursor.execute("ALTER TABLE horas_trabajadas ADD COLUMN valor_otros_descuentos REAL DEFAULT 0")
        print("Columna valor_otros_descuentos agregada a la tabla horas_trabajadas")
    
    # Tabla de cuadre de caja (una fila por factura)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS cuadre_caja (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            numero_factura TEXT NOT NULL,
            area TEXT NOT NULL,
            monto REAL NOT NULL,
            metodo_pago TEXT NOT NULL,
            encargado TEXT DEFAULT '',
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Verificar si existe la columna encargado, si no, agregarla
    cursor.execute("PRAGMA table_info(cuadre_caja)")
    columns = [column[1] for column in cursor.fetchall()]
    
    if 'encargado' not in columns:
        cursor.execute("ALTER TABLE cuadre_caja ADD COLUMN encargado TEXT DEFAULT ''")
        print("Columna encargado agregada a la tabla cuadre_caja")
    
    # Tabla de gastos (una fila por gasto)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS gastos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fecha TEXT NOT NULL,
            proveedor TEXT NOT NULL,
            concepto TEXT NOT NULL,
            valor REAL NOT NULL,
            fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    conn.commit()
    conn.close()
    print("Base de datos inicializada correctamente.")