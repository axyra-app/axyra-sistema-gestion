/**
 * AXYRA - Generador de Reportes Avanzados
 * Sistema completo para generar reportes PDF y Excel del sistema de nómina
 */

class AXYRAReportsGenerator {
    constructor() {
        this.jsPDF = window.jsPDF;
        this.festivos2025 = this.getFestivos2025();
    }

    /**
     * Genera reporte completo de nómina por período
     */
    async generarReporteNominaPeriodo(fechaInicio, fechaFin, empleados) {
        const doc = new this.jsPDF();
        
        // Configuración del documento
        doc.setFont('helvetica');
        doc.setFontSize(20);
        
        // Encabezado
        doc.setTextColor(59, 130, 246);
        doc.text('AXYRA - REPORTE DE NÓMINA', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99);
        doc.text(`Período: ${this.formatearFecha(fechaInicio)} - ${this.formatearFecha(fechaFin)}`, 105, 35, { align: 'center' });
        doc.text(`Generado: ${this.formatearFecha(new Date())}`, 105, 45, { align: 'center' });
        
        // Información del empleado
        let yPosition = 70;
        
        empleados.forEach((empleado, index) => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.setFontSize(14);
            doc.setTextColor(17, 24, 39);
            doc.text(`${empleado.nombre} - ${empleado.cargo}`, 20, yPosition);
            
            doc.setFontSize(10);
            doc.setTextColor(75, 85, 99);
            yPosition += 8;
            doc.text(`Departamento: ${empleado.departamento}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Salario Base: $${this.formatearMoneda(empleado.salario)}`, 20, yPosition);
            yPosition += 6;
            
            // Calcular horas trabajadas en el período
            const horasTrabajadas = this.calcularHorasTrabajadasPeriodo(empleado.id, fechaInicio, fechaFin);
            doc.text(`Horas Trabajadas: ${horasTrabajadas}`, 20, yPosition);
            yPosition += 6;
            
            // Calcular salario neto
            const salarioNeto = this.calcularSalarioNeto(empleado.salario, horasTrabajadas);
            doc.text(`Salario Neto: $${this.formatearMoneda(salarioNeto)}`, 20, yPosition);
            
            yPosition += 20;
        });
        
        // Resumen del período
        const totalSalarios = empleados.reduce((total, emp) => {
            const horas = this.calcularHorasTrabajadasPeriodo(emp.id, fechaInicio, fechaFin);
            return total + this.calcularSalarioNeto(emp.salario, horas);
        }, 0);
        
        const totalHoras = empleados.reduce((total, emp) => {
            return total + this.calcularHorasTrabajadasPeriodo(emp.id, fechaInicio, fechaFin);
        }, 0);
        
        doc.addPage();
        doc.setFontSize(16);
        doc.setTextColor(59, 130, 246);
        doc.text('RESUMEN DEL PERÍODO', 20, 20);
        
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99);
        doc.text(`Total Empleados: ${empleados.length}`, 20, 40);
        doc.text(`Total Horas Trabajadas: ${totalHoras}`, 20, 55);
        doc.text(`Total Salarios: $${this.formatearMoneda(totalSalarios)}`, 20, 70);
        
        // Descargar el PDF
        doc.save(`reporte_nomina_${fechaInicio}_${fechaFin}.pdf`);
        
        return {
            success: true,
            message: 'Reporte de nómina generado correctamente',
            filename: `reporte_nomina_${fechaInicio}_${fechaFin}.pdf`
        };
    }

    /**
     * Genera reporte detallado de horas por empleado
     */
    async generarReporteHorasEmpleado(empleadoId, fechaInicio, fechaFin) {
        const empleado = this.obtenerEmpleado(empleadoId);
        if (!empleado) {
            throw new Error('Empleado no encontrado');
        }
        
        const doc = new this.jsPDF();
        
        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246);
        doc.text('REPORTE DETALLADO DE HORAS', 105, 20, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setTextColor(75, 85, 99);
        doc.text(`Empleado: ${empleado.nombre}`, 20, 35);
        doc.text(`Cargo: ${empleado.cargo}`, 20, 45);
        doc.text(`Departamento: ${empleado.departamento}`, 20, 55);
        doc.text(`Período: ${this.formatearFecha(fechaInicio)} - ${this.formatearFecha(fechaFin)}`, 20, 65);
        
        // Obtener registros de horas del período
        const registrosHoras = this.obtenerRegistrosHorasPeriodo(empleadoId, fechaInicio, fechaFin);
        
        let yPosition = 85;
        
        // Tabla de horas
        doc.setFontSize(10);
        doc.setTextColor(17, 24, 39);
        
        // Encabezados de tabla
        doc.setFillColor(243, 244, 246);
        doc.rect(20, yPosition - 5, 170, 8, 'F');
        doc.text('Fecha', 25, yPosition);
        doc.text('Ordinarias', 60, yPosition);
        doc.text('Nocturnas', 90, yPosition);
        doc.text('Extras', 120, yPosition);
        doc.text('Dominicales', 150, yPosition);
        doc.text('Total', 180, yPosition);
        
        yPosition += 15;
        
        let totalOrdinarias = 0;
        let totalNocturnas = 0;
        let totalExtras = 0;
        let totalDominicales = 0;
        
        registrosHoras.forEach(registro => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            doc.text(this.formatearFecha(registro.fecha), 25, yPosition);
            doc.text(registro.horasOrdinarias || '0', 60, yPosition);
            doc.text(registro.horasNocturnas || '0', 90, yPosition);
            doc.text(registro.horasExtras || '0', 120, yPosition);
            doc.text(registro.horasDominicales || '0', 150, yPosition);
            
            const totalDia = (registro.horasOrdinarias || 0) + (registro.horasNocturnas || 0) + 
                            (registro.horasExtras || 0) + (registro.horasDominicales || 0);
            doc.text(totalDia.toString(), 180, yPosition);
            
            totalOrdinarias += registro.horasOrdinarias || 0;
            totalNocturnas += registro.horasNocturnas || 0;
            totalExtras += registro.horasExtras || 0;
            totalDominicales += registro.horasDominicales || 0;
            
            yPosition += 8;
        });
        
        // Totales
        yPosition += 10;
        doc.setFontSize(12);
        doc.setTextColor(59, 130, 246);
        doc.text('TOTALES DEL PERÍODO:', 20, yPosition);
        
        yPosition += 15;
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Horas Ordinarias: ${totalOrdinarias}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Horas Nocturnas: ${totalNocturnas}`, 20, yPosition);
        yPosition += 8;
        doc.text(`Horas Extras: ${totalExtras}`, yPosition);
        yPosition += 8;
        doc.text(`Horas Dominicales: ${totalDominicales}`, 20, yPosition);
        yPosition += 8;
        
        const totalGeneral = totalOrdinarias + totalNocturnas + totalExtras + totalDominicales;
        doc.setFontSize(12);
        doc.setTextColor(17, 24, 39);
        doc.text(`TOTAL GENERAL: ${totalGeneral} horas`, 20, yPosition);
        
        // Descargar el PDF
        doc.save(`reporte_horas_${empleado.nombre}_${fechaInicio}_${fechaFin}.pdf`);
        
        return {
            success: true,
            message: 'Reporte de horas generado correctamente',
            filename: `reporte_horas_${empleado.nombre}_${fechaInicio}_${fechaFin}.pdf`
        };
    }

    /**
     * Genera reporte de departamentos con estadísticas
     */
    async generarReporteDepartamentos() {
        const departamentos = this.obtenerDepartamentos();
        const empleados = this.obtenerEmpleados();
        
        const doc = new this.jsPDF();
        
        // Encabezado
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246);
        doc.text('REPORTE DE DEPARTAMENTOS', 105, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.setTextColor(75, 85, 99);
        doc.text(`Generado: ${this.formatearFecha(new Date())}`, 105, 35, { align: 'center' });
        
        let yPosition = 50;
        
        departamentos.forEach(departamento => {
            if (yPosition > 250) {
                doc.addPage();
                yPosition = 20;
            }
            
            const empleadosDepto = empleados.filter(emp => emp.departamento === departamento.nombre);
            const totalSalarios = empleadosDepto.reduce((total, emp) => total + (emp.salario || 0), 0);
            const promedioSalario = empleadosDepto.length > 0 ? totalSalarios / empleadosDepto.length : 0;
            
            doc.setFontSize(14);
            doc.setTextColor(17, 24, 39);
            doc.text(departamento.nombre, 20, yPosition);
            
            yPosition += 8;
            doc.setFontSize(10);
            doc.setTextColor(75, 85, 99);
            doc.text(`Empleados: ${empleadosDepto.length}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Total Salarios: $${this.formatearMoneda(totalSalarios)}`, 20, yPosition);
            yPosition += 6;
            doc.text(`Promedio Salario: $${this.formatearMoneda(promedioSalario)}`, 20, yPosition);
            
            yPosition += 15;
        });
        
        // Descargar el PDF
        doc.save(`reporte_departamentos_${new Date().toISOString().split('T')[0]}.pdf`);
        
        return {
            success: true,
            message: 'Reporte de departamentos generado correctamente',
            filename: `reporte_departamentos_${new Date().toISOString().split('T')[0]}.pdf`
        };
    }

    /**
     * Genera reporte Excel de nómina
     */
    generarReporteExcelNomina(fechaInicio, fechaFin, empleados) {
        let csv = 'Empleado,Cargo,Departamento,Salario Base,Horas Ordinarias,Horas Nocturnas,Horas Extras,Horas Dominicales,Total Horas,Salario Neto\n';
        
        empleados.forEach(empleado => {
            const horasTrabajadas = this.calcularHorasTrabajadasPeriodo(empleado.id, fechaInicio, fechaFin);
            const salarioNeto = this.calcularSalarioNeto(empleado.salario, horasTrabajadas);
            
            // Obtener desglose de horas
            const desgloseHoras = this.obtenerDesgloseHoras(empleado.id, fechaInicio, fechaFin);
            
            csv += `"${empleado.nombre}","${empleado.cargo}","${empleado.departamento}",${empleado.salario},${desgloseHoras.ordinarias},${desgloseHoras.nocturnas},${desgloseHoras.extras},${desgloseHoras.dominicales},${horasTrabajadas},${salarioNeto}\n`;
        });
        
        // Agregar totales
        const totales = empleados.reduce((acc, emp) => {
            const horas = this.calcularHorasTrabajadasPeriodo(emp.id, fechaInicio, fechaFin);
            const salarioNeto = this.calcularSalarioNeto(emp.salario, horas);
            acc.totalHoras += horas;
            acc.totalSalarios += salarioNeto;
            return acc;
        }, { totalHoras: 0, totalSalarios: 0 });
        
        csv += `\nTOTALES,,,${empleados.length},,,,${totales.totalHoras},${totales.totalSalarios}`;
        
        // Descargar CSV
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte_nomina_excel_${fechaInicio}_${fechaFin}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return {
            success: true,
            message: 'Reporte Excel generado correctamente',
            filename: `reporte_nomina_excel_${fechaInicio}_${fechaFin}.csv`
        };
    }

    // Métodos auxiliares
    formatearFecha(fecha) {
        if (typeof fecha === 'string') {
            fecha = new Date(fecha);
        }
        return fecha.toLocaleDateString('es-CO');
    }

    formatearMoneda(valor) {
        return parseFloat(valor).toLocaleString('es-CO');
    }

    obtenerEmpleado(empleadoId) {
        const empleados = JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
        return empleados.find(emp => emp.id === empleadoId);
    }

    obtenerEmpleados() {
        return JSON.parse(localStorage.getItem('axyra_empleados') || '[]');
    }

    obtenerDepartamentos() {
        return JSON.parse(localStorage.getItem('axyra_departamentos') || '[]');
    }

    obtenerRegistrosHorasPeriodo(empleadoId, fechaInicio, fechaFin) {
        const registros = JSON.parse(localStorage.getItem('axyra_horas') || '[]');
        return registros.filter(registro => 
            registro.empleadoId === empleadoId &&
            new Date(registro.fecha) >= new Date(fechaInicio) &&
            new Date(registro.fecha) <= new Date(fechaFin)
        );
    }

    calcularHorasTrabajadasPeriodo(empleadoId, fechaInicio, fechaFin) {
        const registros = this.obtenerRegistrosHorasPeriodo(empleadoId, fechaInicio, fechaFin);
        return registros.reduce((total, registro) => {
            return total + (registro.horasOrdinarias || 0) + (registro.horasNocturnas || 0) + 
                   (registro.horasExtras || 0) + (registro.horasDominicales || 0);
        }, 0);
    }

    calcularSalarioNeto(salarioBase, horasTrabajadas) {
        // Cálculo simplificado - se puede expandir según necesidades
        const valorHora = salarioBase / 220; // 220 horas mensuales estándar
        return valorHora * horasTrabajadas;
    }

    obtenerDesgloseHoras(empleadoId, fechaInicio, fechaFin) {
        const registros = this.obtenerRegistrosHorasPeriodo(empleadoId, fechaInicio, fechaFin);
        return registros.reduce((acc, registro) => {
            acc.ordinarias += registro.horasOrdinarias || 0;
            acc.nocturnas += registro.horasNocturnas || 0;
            acc.extras += registro.horasExtras || 0;
            acc.dominicales += registro.horasDominicales || 0;
            return acc;
        }, { ordinarias: 0, nocturnas: 0, extras: 0, dominicales: 0 });
    }

    getFestivos2025() {
        return [
            '2025-01-01', // Año Nuevo
            '2025-01-06', // Día de los Reyes Magos
            '2025-03-24', // Lunes Santo
            '2025-03-25', // Martes Santo
            '2025-03-26', // Miércoles Santo
            '2025-03-27', // Jueves Santo
            '2025-03-28', // Viernes Santo
            '2025-03-30', // Domingo de Resurrección
            '2025-05-01', // Día del Trabajo
            '2025-05-12', // Día de la Ascensión
            '2025-06-23', // Corpus Christi
            '2025-06-30', // Sagrado Corazón
            '2025-07-20', // Día de la Independencia
            '2025-08-07', // Batalla de Boyacá
            '2025-08-18', // Asunción de la Virgen
            '2025-10-13', // Día de la Raza
            '2025-11-03', // Todos los Santos
            '2025-11-17', // Independencia de Cartagena
            '2025-12-08', // Día de la Inmaculada Concepción
            '2025-12-25'  // Navidad
        ];
    }
}

// Exportar para uso global
window.AXYRAReportsGenerator = AXYRAReportsGenerator;
