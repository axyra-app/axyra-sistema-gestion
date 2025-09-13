/**
 * API de Empleados - Vercel Functions
 * Maneja CRUD de empleados con Firebase
 */

import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';

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
        return await createEmployee(req, res);
      case 'GET':
        return await getEmployees(req, res);
      case 'PUT':
        return await updateEmployee(req, res);
      case 'DELETE':
        return await deleteEmployee(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error en API de empleados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}

// Crear empleado
async function createEmployee(req, res) {
  try {
    const { name, email, position, department, salary, userId } = req.body;

    // Validar datos requeridos
    if (!name || !email || !userId) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, email y userId son requeridos',
      });
    }

    // Datos del empleado
    const employeeData = {
      name,
      email,
      position: position || '',
      department: department || '',
      salary: salary || 0,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardar en Firestore
    const docRef = await addDoc(collection(db, 'employees'), employeeData);

    res.status(201).json({
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
}

// Obtener empleados
async function getEmployees(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'userId es requerido',
      });
    }

    // Consultar empleados del usuario
    const q = query(collection(db, 'employees'), where('userId', '==', userId), orderBy('createdAt', 'desc'));

    const querySnapshot = await getDocs(q);
    const employees = [];

    querySnapshot.forEach((doc) => {
      employees.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    res.status(200).json({
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
}

// Actualizar empleado
async function updateEmployee(req, res) {
  try {
    const { id, name, email, position, department, salary, userId } = req.body;

    if (!id || !userId) {
      return res.status(400).json({
        success: false,
        error: 'ID del empleado y userId son requeridos',
      });
    }

    // Datos a actualizar
    const updateData = {
      updatedAt: new Date().toISOString(),
    };

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (position) updateData.position = position;
    if (department) updateData.department = department;
    if (salary !== undefined) updateData.salary = salary;

    // Actualizar en Firestore
    await updateDoc(doc(db, 'employees', id), updateData);

    res.status(200).json({
      success: true,
      message: 'Empleado actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error actualizando empleado:', error);
    res.status(500).json({
      success: false,
      error: 'Error actualizando empleado',
    });
  }
}

// Eliminar empleado
async function deleteEmployee(req, res) {
  try {
    const { id, userId } = req.query;

    if (!id || !userId) {
      return res.status(400).json({
        success: false,
        error: 'ID del empleado y userId son requeridos',
      });
    }

    // Eliminar de Firestore
    await deleteDoc(doc(db, 'employees', id));

    res.status(200).json({
      success: true,
      message: 'Empleado eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error eliminando empleado:', error);
    res.status(500).json({
      success: false,
      error: 'Error eliminando empleado',
    });
  }
}
