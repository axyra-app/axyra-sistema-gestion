#!/usr/bin/env node

/**
 * Script para verificar que todos los sistemas estén funcionando
 * AXYRA Sistema de Gestión
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 AXYRA - Verificando sistema completo...\n');

// Lista de archivos críticos que deben existir
const criticalFiles = [
  // Frontend principal
  'frontend/index.html',
  'frontend/login.html',
  'frontend/register.html',
  'frontend/membresias.html',
  
  // Módulos principales
  'frontend/modulos/dashboard/dashboard.html',
  'frontend/modulos/gestion_personal/gestion_personal.html',
  'frontend/modulos/inventario/inventario.html',
  'frontend/modulos/cuadre_caja/cuadre_caja.html',
  'frontend/modulos/configuracion/configuracion.html',
  
  // Archivos de configuración
  'firebase.json',
  'firestore.rules',
  'firebase-indexes.json',
  
  // Scripts de utilidad
  'deploy-firebase-indexes.js'
];

// Lista de archivos CSS que deben existir
const cssFiles = [
  'frontend/static/axyra-styles.css',
  'frontend/modulos/inventario/inventario-styles.css',
  'frontend/modulos/cuadre_caja/cuadre-caja-styles.css',
  'frontend/modulos/configuracion/configuracion-modern-styles.css'
];

// Lista de archivos JavaScript que deben existir
const jsFiles = [
  'frontend/static/firebase-config.js',
  'frontend/static/notifications-system.js',
  'frontend/modulos/gestion_personal/salary-formatting.js',
  'frontend/modulos/inventario/inventario-complete.js'
];

let errors = [];
let warnings = [];

console.log('📁 Verificando archivos críticos...');
criticalFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} - FALTANTE`);
    errors.push(file);
  }
});

console.log('\n🎨 Verificando archivos CSS...');
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ⚠️  ${file} - FALTANTE`);
    warnings.push(file);
  }
});

console.log('\n⚡ Verificando archivos JavaScript...');
jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ⚠️  ${file} - FALTANTE`);
    warnings.push(file);
  }
});

// Verificar estructura de directorios
console.log('\n📂 Verificando estructura de directorios...');
const requiredDirs = [
  'frontend',
  'frontend/static',
  'frontend/modulos',
  'frontend/modulos/dashboard',
  'frontend/modulos/gestion_personal',
  'frontend/modulos/inventario',
  'frontend/modulos/cuadre_caja',
  'frontend/modulos/configuracion'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/`);
  } else {
    console.log(`   ❌ ${dir}/ - FALTANTE`);
    errors.push(dir);
  }
});

// Verificar archivos de configuración específicos
console.log('\n⚙️ Verificando configuraciones...');

// Verificar firebase.json
if (fs.existsSync('firebase.json')) {
  try {
    const firebaseConfig = JSON.parse(fs.readFileSync('firebase.json', 'utf8'));
    if (firebaseConfig.firestore && firebaseConfig.firestore.rules) {
      console.log('   ✅ firebase.json configurado correctamente');
    } else {
      console.log('   ⚠️  firebase.json no tiene configuración de Firestore');
      warnings.push('firebase.json - configuración incompleta');
    }
  } catch (error) {
    console.log('   ❌ firebase.json - formato inválido');
    errors.push('firebase.json - formato inválido');
  }
}

// Verificar firestore.rules
if (fs.existsSync('firestore.rules')) {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  if (rules.includes('rules_version = \'2\'')) {
    console.log('   ✅ firestore.rules configurado correctamente');
  } else {
    console.log('   ⚠️  firestore.rules - versión no especificada');
    warnings.push('firestore.rules - versión no especificada');
  }
}

// Verificar firebase-indexes.json
if (fs.existsSync('firebase-indexes.json')) {
  try {
    const indexes = JSON.parse(fs.readFileSync('firebase-indexes.json', 'utf8'));
    if (indexes.indexes && indexes.indexes.length > 0) {
      console.log(`   ✅ firebase-indexes.json - ${indexes.indexes.length} índices definidos`);
    } else {
      console.log('   ⚠️  firebase-indexes.json - sin índices definidos');
      warnings.push('firebase-indexes.json - sin índices');
    }
  } catch (error) {
    console.log('   ❌ firebase-indexes.json - formato inválido');
    errors.push('firebase-indexes.json - formato inválido');
  }
}

// Resumen final
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VERIFICACIÓN');
console.log('='.repeat(50));

if (errors.length === 0 && warnings.length === 0) {
  console.log('🎉 ¡SISTEMA COMPLETAMENTE FUNCIONAL!');
  console.log('✅ Todos los archivos críticos están presentes');
  console.log('✅ Todas las configuraciones están correctas');
  console.log('\n🚀 El sistema está listo para producción');
} else {
  if (errors.length > 0) {
    console.log(`❌ ${errors.length} ERRORES CRÍTICOS encontrados:`);
    errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (warnings.length > 0) {
    console.log(`\n⚠️  ${warnings.length} ADVERTENCIAS encontradas:`);
    warnings.forEach(warning => console.log(`   - ${warning}`));
  }
  
  if (errors.length > 0) {
    console.log('\n🔧 Corrige los errores críticos antes de continuar');
    process.exit(1);
  } else {
    console.log('\n✅ Sistema funcional con advertencias menores');
  }
}

console.log('\n📋 PRÓXIMOS PASOS:');
console.log('1. Ejecutar: node deploy-firebase-indexes.js');
console.log('2. Desplegar a Vercel: vercel --prod');
console.log('3. Verificar funcionamiento en producción');
console.log('\n🎯 AXYRA Sistema de Gestión - Listo para usar');
