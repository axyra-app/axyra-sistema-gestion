#!/usr/bin/env node

/**
 * Script para desplegar índices de Firebase Firestore
 * AXYRA Sistema de Gestión
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 AXYRA - Desplegando índices de Firebase...\n');

// Verificar que firebase CLI esté instalado
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI detectado');
} catch (error) {
  console.error('❌ Firebase CLI no está instalado. Instálalo con:');
  console.error('npm install -g firebase-tools');
  process.exit(1);
}

// Verificar que el archivo de índices existe
const indexPath = path.join(__dirname, 'firebase-indexes.json');
if (!fs.existsSync(indexPath)) {
  console.error('❌ Archivo firebase-indexes.json no encontrado');
  process.exit(1);
}

console.log('📁 Archivo de índices encontrado');

// Verificar que estamos en el directorio correcto
if (!fs.existsSync(path.join(__dirname, 'firebase.json'))) {
  console.error('❌ firebase.json no encontrado. Asegúrate de estar en el directorio raíz del proyecto');
  process.exit(1);
}

console.log('📁 Proyecto Firebase detectado');

try {
  console.log('\n🚀 Desplegando índices...');
  
  // Desplegar índices
  execSync('firebase deploy --only firestore:indexes', { 
    stdio: 'inherit',
    cwd: __dirname
  });
  
  console.log('\n✅ Índices desplegados exitosamente');
  console.log('\n📊 Índices creados:');
  
  // Mostrar resumen de índices
  const indexes = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  console.log(`   - ${indexes.indexes.length} índices compuestos`);
  console.log(`   - ${indexes.fieldOverrides.length} overrides de campos`);
  
  console.log('\n🎉 Despliegue completado');
  
} catch (error) {
  console.error('\n❌ Error desplegando índices:', error.message);
  process.exit(1);
}
