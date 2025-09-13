/**
 * API de Pagos - Vercel Functions
 * Maneja pagos con Wompi
 */

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        return await handlePayment(req, res);
      case 'GET':
        return await handleGetPayment(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error en API de pagos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Crear transacción en Wompi
async function handlePayment(req, res) {
  try {
    const { amount, currency, reference, customerEmail, paymentMethod } = req.body;

    // Validar datos requeridos
    if (!amount || !currency || !reference || !customerEmail) {
      return res.status(400).json({
        success: false,
        error: 'Faltan datos requeridos',
      });
    }

    // Configuración de Wompi
    const wompiConfig = {
      publicKey: process.env.WOMPI_PUBLIC_KEY,
      privateKey: process.env.WOMPI_PRIVATE_KEY,
      environment: process.env.WOMPI_ENVIRONMENT || 'sandbox',
      baseUrl:
        process.env.WOMPI_ENVIRONMENT === 'production'
          ? 'https://production.wompi.co/v1'
          : 'https://sandbox.wompi.co/v1',
    };

    // Datos para Wompi
    const wompiData = {
      amount_in_cents: Math.round(amount * 100), // Convertir a centavos
      currency: currency || 'COP',
      customer_email: customerEmail,
      payment_method: {
        type: paymentMethod?.type || 'CARD',
        installments: paymentMethod?.installments || 1,
      },
      reference: reference,
      customer_data: {
        email: customerEmail,
        full_name: req.body.customerName || 'Cliente AXYRA',
      },
    };

    // Crear transacción en Wompi
    const response = await fetch(`${wompiConfig.baseUrl}/transactions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${wompiConfig.privateKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(wompiData),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: result.message || 'Error procesando pago',
      });
    }

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      transaction: result.data,
      message: 'Transacción creada exitosamente',
    });
  } catch (error) {
    console.error('Error creando transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error procesando pago',
    });
  }
}

// Obtener estado de transacción
async function handleGetPayment(req, res) {
  try {
    const { transactionId } = req.query;

    if (!transactionId) {
      return res.status(400).json({
        success: false,
        error: 'ID de transacción requerido',
      });
    }

    // Configuración de Wompi
    const wompiConfig = {
      privateKey: process.env.WOMPI_PRIVATE_KEY,
      environment: process.env.WOMPI_ENVIRONMENT || 'sandbox',
      baseUrl:
        process.env.WOMPI_ENVIRONMENT === 'production'
          ? 'https://production.wompi.co/v1'
          : 'https://sandbox.wompi.co/v1',
    };

    // Consultar transacción en Wompi
    const response = await fetch(`${wompiConfig.baseUrl}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${wompiConfig.privateKey}`,
      },
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        success: false,
        error: result.message || 'Error consultando transacción',
      });
    }

    res.status(200).json({
      success: true,
      transaction: result.data,
    });
  } catch (error) {
    console.error('Error consultando transacción:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando transacción',
    });
  }
}

