// Datos de ejemplo para Gestión de Personal AXYRA
const datosEjemplo = {
    empleados: [
        {
            id: '1',
            nombre: 'Juan Fernando Urán',
            cedula: '104666450',
            cargo: 'Desarrollador Senior',
            departamento: 'Tecnología',
            salario: 3500000,
            tipoContrato: 'Indefinido',
            fechaContratacion: '2023-01-15',
            estado: 'activo'
        },
        {
            id: '2',
            nombre: 'Melida Yaneth Muñoz',
            cedula: '12345678',
            cargo: 'Analista de Recursos Humanos',
            departamento: 'Recursos Humanos',
            salario: 2800000,
            tipoContrato: 'Indefinido',
            fechaContratacion: '2023-03-20',
            estado: 'activo'
        }
    ],
    departamentos: [
        {
            id: '1',
            nombre: 'Tecnología',
            descripcion: 'Desarrollo de software y sistemas',
            color: '#4F81BD'
        },
        {
            id: '2',
            nombre: 'Recursos Humanos',
            descripcion: 'Gestión del talento humano',
            color: '#10b981'
        }
    ],
    horas: []
};

// Función para cargar datos de ejemplo
function cargarDatosEjemplo() {
    try {
        // Cargar empleados
        if (!localStorage.getItem('empleados')) {
            localStorage.setItem('empleados', JSON.stringify(datosEjemplo.empleados));
        }
        
        // Cargar departamentos
        if (!localStorage.getItem('departamentos')) {
            localStorage.setItem('departamentos', JSON.stringify(datosEjemplo.departamentos));
        }
        
        // Cargar horas (vacío por defecto)
        if (!localStorage.getItem('horas')) {
            localStorage.setItem('horas', JSON.stringify(datosEjemplo.horas));
        }
        
        console.log('✅ Datos de ejemplo cargados correctamente');
    } catch (error) {
        console.error('❌ Error al cargar datos de ejemplo:', error);
    }
}

// Cargar datos cuando se incluya este archivo
if (typeof window !== 'undefined') {
    window.cargarDatosEjemplo = cargarDatosEjemplo;
}

