// ========================================
// API ENDPOINT PAYPAL PAYMENTS - AXYRA
// ========================================
// Endpoint para procesar pagos de PayPal

const admin = require('firebase-admin');

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ========================================
// CONFIGURACIÓN PAYPAL
// ========================================
const PAYPAL_CONFIG = {
  clientId: process.env.PAYPAL_CLIENT_ID || 'AfphhCNx415bpleyT1g5iPIN9IQLCGFGq4a21YpqZHO7zw',
  clientSecret: process.env.PAYPAL_CLIENT_SECRET || 'EJnMmqSp2ahikoG2xlUwqd-dtYPtaan3LeuWyE0eF0fkhj;',
  environment: process.env.PAYPAL_ENVIRONMENT || 'sandbox',
  baseUrl: process.env.PAYPAL_BASE_URL || 'https://api.sandbox.paypal.com',
};

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Obtiene token de acceso de PayPal
 */
async function getPayPalAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CONFIG.clientId}:${PAYPAL_CONFIG.clientSecret}`).toString('base64');

  const response = await fetch(`${PAYPAL_CONFIG.baseUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    throw new Error('Error obteniendo token de PayPal');
  }

  const data = await response.json();
  return data.access_token;
}

/**
 * Verifica el estado de una orden en PayPal
 */
async function verifyPayPalOrder(orderId) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(`${PAYPAL_CONFIG.baseUrl}/v2/checkout/orders/${orderId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error verificando orden en PayPal');
  }

  return await response.json();
}

/**
 * Actualiza el plan del usuario
 */
async function updateUserPlan(userId, planType, paymentData) {
  try {
    const userRef = db.collection('users').doc(userId);

    // Actualizar plan del usuario
    await userRef.update({
      plan: planType,
      planStatus: 'active',
      planStartDate: admin.firestore.FieldValue.serverTimestamp(),
      planEndDate: admin.firestore.Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // 30 días
      lastPayment: {
        orderId: paymentData.orderId,
        amount: paymentData.amount,
        currency: paymentData.currency,
        status: paymentData.status,
        date: admin.firestore.FieldValue.serverTimestamp(),
      },
    });

    // Registrar transacción de pago
    await db.collection('payments').add({
      userId: userId,
      orderId: paymentData.orderId,
      amount: paymentData.amount,
      currency: paymentData.currency,
      status: paymentData.status,
      planType: planType,
      paymentMethod: 'paypal',
      payer: paymentData.payer,
      createTime: paymentData.createTime,
      updateTime: paymentData.updateTime,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    return true;
  } catch (error) {
    console.error('Error actualizando plan del usuario:', error);
    throw error;
  }
}

// ========================================
// ENDPOINT PRINCIPAL
// ========================================
module.exports = async (req, res) => {
  // Configurar CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).send('');
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido' });
    return;
  }

  try {
    const { orderId, userId, planType } = req.body;

    if (!orderId || !userId || !planType) {
      res.status(400).json({
        error: 'Faltan parámetros requeridos: orderId, userId, planType',
      });
      return;
    }

    // Verificar orden en PayPal
    const order = await verifyPayPalOrder(orderId);

    if (order.status !== 'COMPLETED') {
      res.status(400).json({
        error: 'La orden no está completada en PayPal',
        status: order.status,
      });
      return;
    }

    // Extraer datos del pago
    const paymentData = {
      orderId: order.id,
      amount: order.purchase_units[0].amount.value,
      currency: order.purchase_units[0].amount.currency_code,
      status: order.status,
      payer: order.payer,
      createTime: order.create_time,
      updateTime: order.update_time,
    };

    // Actualizar plan del usuario
    await updateUserPlan(userId, planType, paymentData);

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Pago procesado exitosamente',
      planType: planType,
      orderId: orderId,
    });
  } catch (error) {
    console.error('Error procesando pago PayPal:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
    });
  }
});
