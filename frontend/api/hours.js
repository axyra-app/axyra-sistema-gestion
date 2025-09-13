/**
 * API de Horas - Vercel Functions
 * Maneja registro de horas con Firebase
 */

import { initializeApp } from 'firebase/app';
import { addDoc, collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        return await registerHours(req, res);
      case 'GET':
        return await getHours(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error en API de horas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Registrar horas
async function registerHours(req, res) {
  try {
    const { employeeId, date, hours, description, userId } = req.body;

    // Validar datos requeridos
    if (!employeeId || !date || !hours || !userId) {
      return res.status(400).json({
        success: false,
        error: 'employeeId, date, hours y userId son requeridos',
      });
    }

    // Validar horas
    if (hours <= 0 || hours > 24) {
      return res.status(400).json({
        success: false,
        error: 'Las horas deben estar entre 1 y 24',
      });
    }

    // Datos de las horas
    const hoursData = {
      employeeId,
      date,
      hours: parseFloat(hours),
      description: description || '',
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'hours'), hoursData);

    res.status(201).json({
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
}

// Obtener horas
async function getHours(req, res) {
  try {
    const { userId, employeeId, startDate, endDate } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
    }

    // Construir query
    let q = query(collection(db, 'hours'), where('userId', '==', userId), orderBy('date', 'desc'));

    // Agregar filtros si existen
    if (employeeId) {
      q = query(q, where('employeeId', '==', employeeId));
    }

    if (startDate) {
      q = query(q, where('date', '>=', startDate));
    }

    if (endDate) {
      q = query(q, where('date', '<=', endDate));
    }

    // Consultar horas
    const querySnapshot = await getDocs(q);
    const hours = [];

    querySnapshot.forEach((doc) => {
      hours.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    // Calcular total de horas
    const totalHours = hours.reduce((sum, hour) => sum + hour.hours, 0);

    res.status(200).json({
      success: true,
      hours,
      totalHours,
      count: hours.length,
    });
  } catch (error) {
    console.error('Error obteniendo horas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo horas',
    });
  }
}

