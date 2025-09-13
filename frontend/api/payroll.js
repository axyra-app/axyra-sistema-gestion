/**
 * API de Nómina - Vercel Functions
 * Genera nóminas con Firebase
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
        return await generatePayroll(req, res);
      case 'GET':
        return await getPayrolls(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error en API de nómina:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Generar nómina
async function generatePayroll(req, res) {
  try {
    const { period, employees, userId } = req.body;

    // Validar datos requeridos
    if (!period || !employees || !userId) {
      return res.status(400).json({
        success: false,
        error: 'period, employees y userId son requeridos',
      });
    }

    // Calcular nómina para cada empleado
    const payrollData = employees.map((employee) => {
      const totalHours = employee.hours || 0;
      const hourlyRate = employee.salary || 0;
      const grossSalary = totalHours * hourlyRate;

      // Cálculos básicos (Colombia)
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

    // Calcular totales
    const totalGross = payrollData.reduce((sum, emp) => sum + emp.grossSalary, 0);
    const totalNet = payrollData.reduce((sum, emp) => sum + emp.netSalary, 0);
    const totalDeductions = totalGross - totalNet;

    // Datos de la nómina
    const payroll = {
      userId,
      period,
      employees: payrollData,
      totalGross,
      totalNet,
      totalDeductions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'payrolls'), payroll);

    res.status(201).json({
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
}

// Obtener nóminas
async function getPayrolls(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
    }

    // Consultar nóminas del usuario
    const q = query(collection(db, 'payrolls'), where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const payrolls = [];

    querySnapshot.forEach((doc) => {
      payrolls.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
      success: true,
      payrolls,
    });
  } catch (error) {
    console.error('Error obteniendo nóminas:', error);
    res.status(500).json({
      success: false,
      error: 'Error obteniendo nóminas',
    });
  }
}

