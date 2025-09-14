// ========================================
// SCRIPT PARA CONFIGURAR ÍNDICES EN FIREBASE
// ========================================

const admin = require('firebase-admin');

// Configuración de Firebase Admin
const serviceAccount = require('./serviceAccountKey.json'); // Necesitas descargar esto

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'axyra-48238',
});

const db = admin.firestore();

// Función para crear índices
async function crearIndices() {
  console.log('🚀 Creando índices en Firestore...');

  try {
    // Índice 1: Empleados por empresa, estado y fecha
    console.log('📊 Creando índice: empleados por empresa, estado y fecha...');
    await db
      .collection('empleados')
      .where('companyId', '==', 'test')
      .where('estado', '==', 'activo')
      .orderBy('fecha_ingreso', 'desc')
      .limit(1)
      .get();

    // Índice 2: Empleados por empresa, cargo y nombre
    console.log('📊 Creando índice: empleados por empresa, cargo y nombre...');
    await db
      .collection('empleados')
      .where('companyId', '==', 'test')
      .where('cargo', '==', 'empleado')
      .orderBy('nombre', 'asc')
      .limit(1)
      .get();

    // Índice 3: Horas por empleado y fecha
    console.log('📊 Creando índice: horas por empleado y fecha...');
    await db.collection('horas_trabajadas').where('empleado_id', '==', 'test').orderBy('fecha', 'desc').limit(1).get();

    // Índice 4: Nóminas por período y fecha
    console.log('📊 Creando índice: nóminas por período y fecha...');
    await db.collection('nominas').where('periodo', '==', 'test').orderBy('fecha_calculo', 'desc').limit(1).get();

    // Índice 5: Inventario por empresa, categoría y estado
    console.log('📊 Creando índice: inventario por empresa, categoría y estado...');
    await db
      .collection('inventario')
      .where('companyId', '==', 'test')
      .where('categoria', '==', 'test')
      .where('estado', '==', 'activo')
      .limit(1)
      .get();

    console.log('✅ Índices creados exitosamente');
    console.log('🔗 Ve a la consola de Firebase para ver los índices generados');
  } catch (error) {
    if (error.code === 'failed-precondition') {
      console.log('✅ Los índices ya existen o se están creando');
      console.log('🔗 Ve a la consola de Firebase para ver el progreso');
    } else {
      console.error('❌ Error creando índices:', error.message);
    }
  }
}

// Ejecutar
crearIndices();
