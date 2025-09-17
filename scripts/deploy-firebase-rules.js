#!/usr/bin/env node

/**
 * Script para desplegar reglas e índices de Firebase
 * Uso: node scripts/deploy-firebase-rules.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando despliegue de reglas e índices de Firebase...\n');

// Verificar que Firebase CLI esté instalado
try {
  execSync('firebase --version', { stdio: 'pipe' });
  console.log('✅ Firebase CLI detectado');
} catch (error) {
  console.error('❌ Firebase CLI no está instalado. Instálalo con: npm install -g firebase-tools');
  process.exit(1);
}

// Verificar que estemos en el directorio correcto
if (!fs.existsSync('firebase.json')) {
  console.error('❌ No se encontró firebase.json. Ejecuta este script desde la raíz del proyecto.');
  process.exit(1);
}

// Verificar que los archivos de reglas existan
const requiredFiles = [
  'firestore.rules',
  'firestore.indexes.json',
  'storage.rules'
];

for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ No se encontró ${file}`);
    process.exit(1);
  }
}

console.log('✅ Archivos de reglas encontrados');

try {
  // Desplegar reglas de Firestore
  console.log('\n📋 Desplegando reglas de Firestore...');
  execSync('firebase deploy --only firestore:rules', { stdio: 'inherit' });
  console.log('✅ Reglas de Firestore desplegadas');

  // Desplegar índices de Firestore
  console.log('\n📊 Desplegando índices de Firestore...');
  execSync('firebase deploy --only firestore:indexes', { stdio: 'inherit' });
  console.log('✅ Índices de Firestore desplegados');

  // Desplegar reglas de Storage
  console.log('\n💾 Desplegando reglas de Storage...');
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
  console.log('✅ Reglas de Storage desplegadas');

  console.log('\n🎉 ¡Despliegue completado exitosamente!');
  console.log('\n📝 Resumen:');
  console.log('   • Reglas de Firestore ✅');
  console.log('   • Índices de Firestore ✅');
  console.log('   • Reglas de Storage ✅');
  
  console.log('\n🔗 Verifica el estado en: https://console.firebase.google.com/');
  
} catch (error) {
  console.error('\n❌ Error durante el despliegue:', error.message);
  process.exit(1);
}
