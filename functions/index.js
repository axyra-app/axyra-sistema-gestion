/**
 * AXYRA Backend - Firebase Functions
 * APIs para sistema de pagos, autenticación y gestión empresarial
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const express = require('express');
const axios = require('axios');

// Inicializar Firebase Admin
admin.initializeApp();

// Configuración de APIs de pago
const WOMPI_CONFIG = {
  publicKey: functions.config().wompi?.public_key || 'pub_test_xxx',
  privateKey: functions.config().wompi?.private_key || 'prv_test_xxx',
  environment: functions.config().wompi?.environment || 'sandbox',
  baseUrl:
    functions.config().wompi?.environment === 'production'
      ? 'https://production.wompi.co/v1'
      : 'https://sandbox.wompi.co/v1',
};

const PAYU_CONFIG = {
  merchantId: functions.config().payu?.merchant_id || 'xxx',
  apiKey: functions.config().payu?.api_key || 'xxx',
  apiLogin: functions.config().payu?.api_login || 'xxx',
  environment: functions.config().payu?.environment || 'sandbox',
  baseUrl:
    functions.config().payu?.environment === 'production'
      ? 'https://api.payulatam.com'
      : 'https://sandbox.api.payulatam.com',
};

// Crear app Express
const app = express();
app.use(cors);
app.use(express.json());

// Middleware de autenticación
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autorización requerido' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error de autenticación:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ===== APIS DE PAGOS =====

// Crear transacción en Wompi
app.post('/api/payments/wompi/create', authenticateUser, async (req, res) => {
  try {
    const { amount, currency, reference, customerEmail, paymentMethod } = req.body;

    const wompiData = {
      amount_in_cents: amount * 100, // Convertir a centavos
      currency: currency || 'COP',
      customer_email: customerEmail,
      payment_method: {
        type: paymentMethod.type, // CARD, PSE, NEQUI
        installments: paymentMethod.installments || 1,
      },
      reference: reference,
      customer_data: {
        email: customerEmail,
        full_name: req.body.customerName || 'Cliente AXYRA',
      },
    };

    const response = await axios.post(`${WOMPI_CONFIG.baseUrl}/transactions`, wompiData, {
      headers: {
        Authorization: `Bearer ${WOMPI_CONFIG.privateKey}`,
        'Content-Type': 'application/json',
      },
    });

    // Guardar transacción en Firestore
    await admin
      .firestore()
      .collection('transactions')
      .add({
        ...wompiData,
        wompiId: response.data.data.id,
        status: response.data.data.status,
        userId: req.user.uid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    res.json({
      success: true,
      transaction: response.data.data,
      message: 'Transacción creada exitosamente',
    });
  } catch (error) {
    console.error('Error creando transacción Wompi:', error);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || 'Error procesando pago',
    });
  }
});

// Verificar estado de transacción
app.get('/api/payments/wompi/status/:transactionId', authenticateUser, async (req, res) => {
  try {
    const { transactionId } = req.params;

    const response = await axios.get(`${WOMPI_CONFIG.baseUrl}/transactions/${transactionId}`, {
      headers: {
        Authorization: `Bearer ${WOMPI_CONFIG.privateKey}`,
      },
    });

    // Actualizar estado en Firestore
    const transactionRef = admin
      .firestore()
      .collection('transactions')
      .where('wompiId', '==', transactionId)
      .where('userId', '==', req.user.uid);

    const snapshot = await transactionRef.get();
    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      await doc.ref.update({
        status: response.data.data.status,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    res.json({
      success: true,
      transaction: response.data.data,
    });
  } catch (error) {
    console.error('Error verificando transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error verificando estado de transacción',
    });
  }
});

// ===== APIS DE SUSCRIPCIONES =====

// Crear suscripción
app.post('/api/subscriptions', authenticateUser, async (req, res) => {
  try {
    const { planId, paymentMethod, startDate } = req.body;

    const subscription = {
      userId: req.user.uid,
      planId,
      paymentMethod,
      status: 'active',
      startDate: startDate || new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore().collection('subscriptions').add(subscription);

    res.json({
      success: true,
      subscription: {
        id: docRef.id,
        ...subscription,
      },
      message: 'Suscripción creada exitosamente',
    });
  } catch (error) {
    console.error('Error creando suscripción:', error);
    res.status(500).json({
      success: false,
      error: 'Error creando suscripción',
    });
  }
});

// Obtener suscripciones del usuario
app.get('/api/subscriptions', authenticateUser, async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection('subscriptions')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const subscriptions = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      subscriptions,
    });
  } catch (error) {
    console.error('Error obteniendo suscripciones:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo suscripciones',
    });
  }
});

// ===== APIS DE EMPRESAS =====

// Crear/Actualizar empresa
app.post('/api/company', authenticateUser, async (req, res) => {
  try {
    const companyData = {
      ...req.body,
      userId: req.user.uid,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Verificar si ya existe
    const existingCompany = await admin.firestore().collection('companies').where('userId', '==', req.user.uid).get();

    let companyRef;
    if (existingCompany.empty) {
      companyData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      companyRef = await admin.firestore().collection('companies').add(companyData);
    } else {
      companyRef = existingCompany.docs[0].ref;
      await companyRef.update(companyData);
    }

    res.json({
      success: true,
      company: {
        id: companyRef.id,
        ...companyData,
      },
      message: 'Empresa guardada exitosamente',
    });
  } catch (error) {
    console.error('Error guardando empresa:', error);
    res.status(500).json({
      success: false,
      error: 'Error guardando empresa',
    });
  }
});

// Obtener empresa del usuario
app.get('/api/company', authenticateUser, async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('companies').where('userId', '==', req.user.uid).get();

    if (snapshot.empty) {
      return res.json({
        success: true,
        company: null,
        message: 'No se encontró empresa',
      });
    }

    const company = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    };

    res.json({
      success: true,
      company,
    });
  } catch (error) {
    console.error('Error obteniendo empresa:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo empresa',
    });
  }
});

// ===== APIS DE EMPLEADOS =====

// Crear empleado
app.post('/api/employees', authenticateUser, async (req, res) => {
  try {
    const employeeData = {
      ...req.body,
      userId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore().collection('employees').add(employeeData);

    res.json({
      success: true,
      employee: {
        id: docRef.id,
        ...employeeData,
      },
      message: 'Empleado creado exitosamente',
    });
  } catch (error) {
    console.error('Error creando empleado:', error);
    res.status(500).json({
      success: false,
      error: 'Error creando empleado',
    });
  }
});

// Obtener empleados
app.get('/api/employees', authenticateUser, async (req, res) => {
  try {
    const snapshot = await admin
      .firestore()
      .collection('employees')
      .where('userId', '==', req.user.uid)
      .orderBy('createdAt', 'desc')
      .get();

    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      employees,
    });
  } catch (error) {
    console.error('Error obteniendo empleados:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo empleados',
    });
  }
});

// ===== APIS DE HORAS =====

// Registrar horas
app.post('/api/hours', authenticateUser, async (req, res) => {
  try {
    const hoursData = {
      ...req.body,
      userId: req.user.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore().collection('hours').add(hoursData);

    res.json({
      success: true,
      hours: {
        id: docRef.id,
        ...hoursData,
      },
      message: 'Horas registradas exitosamente',
    });
  } catch (error) {
    console.error('Error registrando horas:', error);
    res.status(500).json({
      success: false,
      error: 'Error registrando horas',
    });
  }
});

// Obtener horas
app.get('/api/hours', authenticateUser, async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;

    let query = admin.firestore().collection('hours').where('userId', '==', req.user.uid);

    if (employeeId) {
      query = query.where('employeeId', '==', employeeId);
    }

    if (startDate) {
      query = query.where('date', '>=', startDate);
    }

    if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const snapshot = await query.orderBy('date', 'desc').get();

    const hours = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      hours,
    });
  } catch (error) {
    console.error('Error obteniendo horas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo horas',
    });
  }
});

// ===== APIS DE NÓMINA =====

// Generar nómina
app.post('/api/payroll/generate', authenticateUser, async (req, res) => {
  try {
    const { period, employees } = req.body;

    // Calcular nómina para cada empleado
    const payrollData = employees.map((employee) => {
      const totalHours = employee.hours || 0;
      const hourlyRate = employee.hourlyRate || 0;
      const grossSalary = totalHours * hourlyRate;

      // Cálculos básicos (aquí puedes agregar más lógica)
      const healthInsurance = grossSalary * 0.04; // 4%
      const pension = grossSalary * 0.04; // 4%
      const netSalary = grossSalary - healthInsurance - pension;

      return {
        employeeId: employee.id,
        employeeName: employee.name,
        totalHours,
        hourlyRate,
        grossSalary,
        healthInsurance,
        pension,
        netSalary,
        period,
      };
    });

    const payroll = {
      userId: req.user.uid,
      period,
      employees: payrollData,
      totalGross: payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0),
      totalNet: payrollData.reduce((sum, emp) => sum + emp.netSalary, 0),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await admin.firestore().collection('payrolls').add(payroll);

    res.json({
      success: true,
      payroll: {
        id: docRef.id,
        ...payroll,
      },
      message: 'Nómina generada exitosamente',
    });
  } catch (error) {
    console.error('Error generando nómina:', error);
    res.status(500).json({
      success: false,
      error: 'Error generando nómina',
    });
  }
});

// ===== APIS DE REPORTES =====

// Obtener estadísticas
app.get('/api/analytics/stats', authenticateUser, async (req, res) => {
  try {
    const userId = req.user.uid;

    // Obtener conteos
    const [employeesSnapshot, hoursSnapshot, payrollsSnapshot] = await Promise.all([
      admin.firestore().collection('employees').where('userId', '==', userId).get(),
      admin.firestore().collection('hours').where('userId', '==', userId).get(),
      admin.firestore().collection('payrolls').where('userId', '==', userId).get(),
    ]);

    const stats = {
      totalEmployees: employeesSnapshot.size,
      totalHours: hoursSnapshot.size,
      totalPayrolls: payrollsSnapshot.size,
      lastUpdated: new Date().toISOString(),
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo estadísticas',
    });
  }
});

// ===== CONFIGURAR FUNCIONES =====

// Exportar todas las rutas como función de Vercel
exports.api = functions.https.onRequest(app);

// Función para procesar pagos webhook
exports.processPaymentWebhook = functions.https.onRequest(async (req, res) => {
  try {
    const { data } = req.body;

    if (data.event === 'transaction.updated') {
      const transaction = data.transaction;

      // Actualizar transacción en Firestore
      const transactionRef = admin.firestore().collection('transactions').where('wompiId', '==', transaction.id);

      const snapshot = await transactionRef.get();
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        await doc.ref.update({
          status: transaction.status,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    res.status(500).json({ error: 'Error procesando webhook' });
  }
});

// Función para limpiar datos antiguos
exports.cleanupOldData = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Limpiar transacciones antiguas
    const oldTransactions = await admin
      .firestore()
      .collection('transactions')
      .where('createdAt', '<', thirtyDaysAgo)
      .where('status', 'in', ['DECLINED', 'VOIDED'])
      .get();

    const batch = admin.firestore().batch();
    oldTransactions.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();

    console.log(`Limpieza completada: ${oldTransactions.size} transacciones eliminadas`);
  } catch (error) {
    console.error('Error en limpieza:', error);
  }
});
