/**
 * 🚀 AXYRA Wompi Webhook Handler
 * Maneja las notificaciones de pago de Wompi
 */

const crypto = require('crypto');

module.exports = async (req, res) => {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📨 Webhook de Wompi recibido:', req.body);

    const { data, event, signature } = req.body;

    // Verificar la firma del webhook
    if (!verifyWompiSignature(req.body, signature)) {
      console.error('❌ Firma de webhook inválida');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Procesar el evento
    await processWompiEvent(event, data);

    res.status(200).json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    console.error('❌ Error procesando webhook de Wompi:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function verifyWompiSignature(payload, signature) {
  const secret = process.env.WOMPI_EVENTS_SECRET || 'prod_events_4ob12JL0RXAolocztVa9GThpUrGfy8Dn';

  const expectedSignature = crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');

  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
}

async function processWompiEvent(event, data) {
  console.log(`🔄 Procesando evento: ${event}`);

  switch (event) {
    case 'transaction.updated':
      await handleTransactionUpdate(data);
      break;

    case 'transaction.created':
      await handleTransactionCreated(data);
      break;

    case 'transaction.approved':
      await handleTransactionApproved(data);
      break;

    case 'transaction.declined':
      await handleTransactionDeclined(data);
      break;

    default:
      console.log(`⚠️ Evento no manejado: ${event}`);
  }
}

async function handleTransactionUpdate(transaction) {
  console.log('📊 Transacción actualizada:', transaction.id);

  // Aquí puedes actualizar el estado en tu base de datos
  // Por ejemplo, actualizar Firestore con el estado de la transacción
}

async function handleTransactionCreated(transaction) {
  console.log('🆕 Nueva transacción creada:', transaction.id);

  // Registrar la nueva transacción
  // Puedes guardar esto en Firestore para tracking
}

async function handleTransactionApproved(transaction) {
  console.log('✅ Transacción aprobada:', transaction.id);

  try {
    // Determinar el plan basado en el monto
    const plan = getPlanFromAmount(transaction.amount_in_cents / 100);

    if (plan) {
      // Actualizar membresía del usuario
      await updateUserMembership(transaction.reference, plan);

      // Enviar notificación de éxito
      await sendPaymentSuccessNotification(transaction.reference, plan);
    }
  } catch (error) {
    console.error('❌ Error procesando transacción aprobada:', error);
  }
}

async function handleTransactionDeclined(transaction) {
  console.log('❌ Transacción declinada:', transaction.id);

  // Enviar notificación de error
  await sendPaymentErrorNotification(transaction.reference);
}

function getPlanFromAmount(amount) {
  const plans = {
    29900: 'basic',
    49900: 'professional',
    99900: 'enterprise',
  };

  return plans[amount] || null;
}

async function updateUserMembership(userId, plan) {
  // Aquí implementarías la lógica para actualizar la membresía del usuario
  // Por ejemplo, actualizar Firestore

  console.log(`✅ Membresía actualizada para usuario ${userId}: ${plan}`);

  // Ejemplo de actualización en Firestore (necesitarías Firebase Admin SDK)
  /*
  const admin = require('firebase-admin');
  const db = admin.firestore();
  
  await db.collection('users').doc(userId).update({
    membership: plan,
    membershipStatus: 'active',
    membershipStartDate: new Date(),
    membershipEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  });
  */
}

async function sendPaymentSuccessNotification(userId, plan) {
  console.log(`📧 Enviando notificación de pago exitoso a ${userId} para plan ${plan}`);

  // Aquí implementarías el envío de email/notificación
  // Por ejemplo, usando EmailJS o un servicio de email
}

async function sendPaymentErrorNotification(userId) {
  console.log(`📧 Enviando notificación de error de pago a ${userId}`);

  // Aquí implementarías el envío de notificación de error
}


