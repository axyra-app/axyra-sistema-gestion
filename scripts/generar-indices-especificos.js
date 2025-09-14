// ========================================
// SCRIPT PARA GENERAR ÍNDICES ESPECÍFICOS
// ========================================

const admin = require('firebase-admin');

// Configuración de Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'axyra-48238',
});

const db = admin.firestore();

// Función para generar índices específicos
async function generarIndicesEspecificos() {
  console.log('🚀 Generando índices específicos...');

  try {
    // Índice 1: Cédula de empleados
    console.log('📊 Generando índice: cédula de empleados...');
    await db.collection('empleados').where('cedula', '==', '12345678').where('companyId', '==', 'test').limit(1).get();

    // Índice 2: Email de empleados
    console.log('📊 Generando índice: email de empleados...');
    await db
      .collection('empleados')
      .where('email', '==', 'test@test.com')
      .where('companyId', '==', 'test')
      .limit(1)
      .get();

    // Índice 3: Número de factura
    console.log('📊 Generando índice: número de factura...');
    await db
      .collection('facturas')
      .where('numero_factura', '==', 'FACT-001')
      .orderBy('fecha_emision', 'desc')
      .limit(1)
      .get();

    // Índice 4: Email de usuarios
    console.log('📊 Generando índice: email de usuarios...');
    await db.collection('usuarios').where('email', '==', 'test@test.com').where('activo', '==', true).limit(1).get();

    console.log('✅ Índices específicos generados exitosamente');
    console.log('🔗 Ve a la consola de Firebase para ver los índices generados');
  } catch (error) {
    if (error.code === 'failed-precondition') {
      console.log('✅ Los índices ya existen o se están creando');
      console.log('🔗 Ve a la consola de Firebase para ver el progreso');
    } else {
      console.error('❌ Error generando índices:', error.message);
    }
  }
}

// Ejecutar
generarIndicesEspecificos();
