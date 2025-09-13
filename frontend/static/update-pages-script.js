/* ========================================
   AXYRA UPDATE PAGES SCRIPT
   Script para actualizar todas las páginas del sistema
   ======================================== */

// Lista de páginas que necesitan actualización
const pagesToUpdate = [
  {
    path: 'modulos/configuracion/configuracion.html',
    name: 'Configuración',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/cuadre_caja/cuadre_caja.html',
    name: 'Cuadre de Caja',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/empleados/empleados.html',
    name: 'Empleados',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/gestion_personal/gestion_personal.html',
    name: 'Gestión Personal',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/horas/gestionar_horas.html',
    name: 'Gestión de Horas',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/inventario/inventario.html',
    name: 'Inventario',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/membresias/membresias.html',
    name: 'Membresías',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/nomina/gestionar_nomina.html',
    name: 'Nómina',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  },
  {
    path: 'modulos/reportes/reportes-avanzados.html',
    name: 'Reportes',
    issues: ['Agregar chat de IA', 'Corregir header', 'Verificar estilos']
  }
];

// Función para generar el HTML del chat de IA
function generateAIChatHTML() {
  return `
    <!-- Chat de IA AXYRA - Cargar al final -->
    <script src="../../static/axyra-ai-global.js"></script>
  `;
}

// Función para generar el HTML del header corregido
function generateHeaderHTML() {
  return `
    <!-- Header corregido -->
    <link rel="stylesheet" href="../../static/header-fixes.css" />
  `;
}

// Función para generar el HTML de estilos base
function generateBaseStylesHTML() {
  return `
    <!-- Estilos base AXYRA -->
    <link rel="stylesheet" href="../../static/axyra-design-system.css" />
    <link rel="stylesheet" href="../../static/axyra-styles.css" />
    <link rel="stylesheet" href="../../static/modal-fixes.css" />
    <link rel="stylesheet" href="../../static/modal-positioning-fix.css" />
    <link rel="stylesheet" href="../../static/modal-emergency-fix.css" />
  `;
}

// Función para actualizar una página específica
function updatePage(pageInfo) {
  console.log(`🔄 Actualizando página: ${pageInfo.name}`);
  
  // Aquí se implementaría la lógica para actualizar cada página
  // Por ahora, solo registramos que necesita actualización
  return {
    page: pageInfo.path,
    name: pageInfo.name,
    needsUpdate: true,
    issues: pageInfo.issues,
    fixes: [
      'Agregar chat de IA global',
      'Incluir correcciones del header',
      'Aplicar estilos base consistentes',
      'Verificar fondo blanco',
      'Implementar modales centrados'
    ]
  };
}

// Función para revisar el estado de todas las páginas
function reviewAllPages() {
  console.log('🔍 Revisando todas las páginas del sistema AXYRA...');
  
  const results = pagesToUpdate.map(page => updatePage(page));
  
  console.log('📊 RESUMEN DE REVISIÓN:');
  console.log('========================');
  
  results.forEach(result => {
    console.log(`\n📄 ${result.name} (${result.page})`);
    console.log(`   Estado: ${result.needsUpdate ? '❌ Necesita actualización' : '✅ OK'}`);
    console.log(`   Problemas: ${result.issues.join(', ')}`);
    console.log(`   Soluciones: ${result.fixes.join(', ')}`);
  });
  
  return results;
}

// Función para generar el código de actualización
function generateUpdateCode() {
  const updateCode = `
// ========================================
// AXYRA PAGES UPDATE CODE
// Código para actualizar todas las páginas
// ========================================

// 1. Agregar al <head> de cada página:
${generateBaseStylesHTML()}
${generateHeaderHTML()}

// 2. Agregar antes del </body> de cada página:
${generateAIChatHTML()}

// 3. Verificar que cada página tenga:
// - Fondo blanco
// - Header bien posicionado
// - Chat de IA funcionando
// - Modales centrados
// - Estilos consistentes
  `;
  
  return updateCode;
}

// Ejecutar revisión
const reviewResults = reviewAllPages();

// Exportar para uso en consola
window.axyraPageUpdater = {
  reviewAllPages,
  generateUpdateCode,
  results: reviewResults
};

console.log('\n🎯 PÁGINAS QUE NECESITAN ACTUALIZACIÓN:');
console.log('==========================================');
reviewResults
  .filter(r => r.needsUpdate)
  .forEach(r => console.log(`- ${r.name}: ${r.page}`));

console.log('\n💡 CÓDIGO DE ACTUALIZACIÓN:');
console.log('============================');
console.log(generateUpdateCode());

console.log('\n🚀 PRÓXIMOS PASOS:');
console.log('==================');
console.log('1. Aplicar correcciones a cada página');
console.log('2. Verificar que el chat de IA funcione');
console.log('3. Asegurar headers consistentes');
console.log('4. Verificar estilos en todas las páginas');
console.log('5. Probar modales en cada módulo');
