/**
 * Sistema de Membresías y Suscripciones AXYRA
 * Versión: 1.0.0
 */

class AxyraMembresias {
    constructor() {
        this.planes = {
            basico: {
                nombre: 'Básico',
                precio: 29900,
                caracteristicas: [
                    'Hasta 5 empleados',
                    'Gestión básica de nómina',
                    'Inventario simple',
                    'Reportes básicos',
                    'Soporte por email',
                    '5GB de almacenamiento'
                ]
            },
            profesional: {
                nombre: 'Profesional',
                precio: 59900,
                caracteristicas: [
                    'Hasta 25 empleados',
                    'Gestión completa de nómina',
                    'Inventario avanzado',
                    'Cuadre de caja',
                    'Reportes avanzados',
                    'Chat de IA incluido',
                    'Soporte prioritario',
                    '50GB de almacenamiento',
                    'Integración con bancos'
                ]
            },
            empresarial: {
                nombre: 'Empresarial',
                precio: 99900,
                caracteristicas: [
                    'Empleados ilimitados',
                    'Todas las funciones',
                    'Múltiples sucursales',
                    'API personalizada',
                    'Reportes personalizados',
                    'Soporte 24/7',
                    'Almacenamiento ilimitado',
                    'Integraciones avanzadas',
                    'Capacitación incluida'
                ]
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('💳 Inicializando Sistema de Membresías AXYRA...');
        this.configurarEventos();
        this.cargarPlanActual();
        this.configurarAnimaciones();
        console.log('✅ Sistema de Membresías AXYRA inicializado');
    }
    
    configurarEventos() {
        // Eventos para botones de planes
        document.querySelectorAll('.plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = e.target.closest('.plan-card').classList[1].replace('plan-', '');
                this.seleccionarPlan(plan);
            });
        });
        
        // Eventos para FAQ
        document.querySelectorAll('.faq-pregunta').forEach(pregunta => {
            pregunta.addEventListener('click', () => {
                this.toggleFAQ(pregunta);
            });
        });
        
        // Evento para botón de contacto
        const contactoBtn = document.querySelector('.contacto-btn');
        if (contactoBtn) {
            contactoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.contactarVentas();
            });
        }
    }
    
    configurarAnimaciones() {
        // Animación de entrada para las tarjetas
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        });
        
        document.querySelectorAll('.plan-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            observer.observe(card);
        });
    }
    
    cargarPlanActual() {
        try {
            const planActual = localStorage.getItem('axyra_plan_actual');
            if (planActual) {
                console.log('📋 Plan actual cargado:', planActual);
                this.mostrarPlanActual(planActual);
            }
        } catch (error) {
            console.error('❌ Error cargando plan actual:', error);
        }
    }
    
    mostrarPlanActual(plan) {
        // Agregar indicador visual del plan actual
        const planCards = document.querySelectorAll('.plan-card');
        planCards.forEach(card => {
            card.classList.remove('plan-actual');
        });
        
        const planActual = document.querySelector(`.plan-${plan}`);
        if (planActual) {
            planActual.classList.add('plan-actual');
            
            // Agregar badge de plan actual
            const badge = document.createElement('div');
            badge.className = 'plan-actual-badge';
            badge.innerHTML = '<i class="fas fa-check-circle"></i> Plan Actual';
            badge.style.cssText = `
                position: absolute;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 8px 15px;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            `;
            planActual.appendChild(badge);
        }
    }
    
    seleccionarPlan(plan) {
        console.log('💳 Plan seleccionado:', plan);
        
        // Mostrar modal de confirmación
        this.mostrarModalConfirmacion(plan);
    }
    
    mostrarModalConfirmacion(plan) {
        const planData = this.planes[plan];
        if (!planData) return;
        
        const modal = document.createElement('div');
        modal.className = 'membresias-modal-overlay';
        modal.innerHTML = `
            <div class="membresias-modal-container">
                <div class="membresias-modal-header">
                    <h3><i class="fas fa-credit-card"></i> Confirmar Suscripción</h3>
                    <button class="membresias-modal-close">&times;</button>
                </div>
                <div class="membresias-modal-body">
                    <div class="plan-resumen">
                        <h4>Plan ${planData.nombre}</h4>
                        <div class="plan-precio-modal">$${planData.precio.toLocaleString()}/mes</div>
                        <ul class="plan-caracteristicas-modal">
                            ${planData.caracteristicas.map(caracteristica => 
                                `<li><i class="fas fa-check"></i> ${caracteristica}</li>`
                            ).join('')}
                        </ul>
                    </div>
                    <div class="modal-acciones">
                        <button class="btn-cancelar">Cancelar</button>
                        <button class="btn-confirmar">Confirmar Suscripción</button>
                    </div>
                </div>
            </div>
        `;
        
        // Agregar estilos del modal
        const style = document.createElement('style');
        style.textContent = `
            .membresias-modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
                backdrop-filter: blur(8px);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .membresias-modal-overlay.show {
                opacity: 1;
                visibility: visible;
            }
            
            .membresias-modal-container {
                background: white;
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                transform: scale(0.9);
                transition: all 0.3s ease;
            }
            
            .membresias-modal-overlay.show .membresias-modal-container {
                transform: scale(1);
            }
            
            .membresias-modal-header {
                background: linear-gradient(135deg, #4f81bd 0%, #2c5aa0 100%);
                color: white;
                padding: 20px;
                border-radius: 20px 20px 0 0;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .membresias-modal-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .membresias-modal-body {
                padding: 30px;
            }
            
            .plan-resumen h4 {
                font-size: 1.5rem;
                color: #1f2937;
                margin-bottom: 10px;
            }
            
            .plan-precio-modal {
                font-size: 2rem;
                color: #4f81bd;
                font-weight: 700;
                margin-bottom: 20px;
            }
            
            .plan-caracteristicas-modal {
                list-style: none;
                padding: 0;
                margin-bottom: 30px;
            }
            
            .plan-caracteristicas-modal li {
                padding: 8px 0;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .plan-caracteristicas-modal i {
                color: #10b981;
            }
            
            .modal-acciones {
                display: flex;
                gap: 15px;
                justify-content: flex-end;
            }
            
            .btn-cancelar, .btn-confirmar {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-cancelar {
                background: #6b7280;
                color: white;
            }
            
            .btn-cancelar:hover {
                background: #4b5563;
            }
            
            .btn-confirmar {
                background: #4f81bd;
                color: white;
            }
            
            .btn-confirmar:hover {
                background: #2c5aa0;
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(modal);
        
        // Animar entrada
        requestAnimationFrame(() => {
            modal.classList.add('show');
        });
        
        // Eventos del modal
        modal.querySelector('.membresias-modal-close').addEventListener('click', () => {
            this.cerrarModal(modal);
        });
        
        modal.querySelector('.btn-cancelar').addEventListener('click', () => {
            this.cerrarModal(modal);
        });
        
        modal.querySelector('.btn-confirmar').addEventListener('click', () => {
            this.procesarSuscripcion(plan);
            this.cerrarModal(modal);
        });
        
        // Cerrar con clic en overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.cerrarModal(modal);
            }
        });
    }
    
    cerrarModal(modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    procesarSuscripcion(plan) {
        console.log('🔄 Procesando suscripción para plan:', plan);
        
        // Simular procesamiento
        if (window.axyraNotifications) {
            window.axyraNotifications.show(
                'Procesando suscripción...',
                'info'
            );
        }
        
        // Simular redirección a pasarela de pago
        setTimeout(() => {
            this.simularProcesoPago(plan);
        }, 2000);
    }
    
    simularProcesoPago(plan) {
        // En una implementación real, aquí se integraría con la pasarela de pago
        console.log('💳 Simulando proceso de pago para plan:', plan);
        
        // Simular éxito del pago
        const exito = Math.random() > 0.3; // 70% de éxito
        
        if (exito) {
            // Guardar plan en localStorage
            localStorage.setItem('axyra_plan_actual', plan);
            localStorage.setItem('axyra_plan_fecha', new Date().toISOString());
            
            if (window.axyraNotifications) {
                window.axyraNotifications.show(
                    `¡Suscripción al plan ${this.planes[plan].nombre} activada exitosamente!`,
                    'success'
                );
            }
            
            // Recargar página para mostrar cambios
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } else {
            if (window.axyraNotifications) {
                window.axyraNotifications.show(
                    'Error procesando el pago. Por favor intenta nuevamente.',
                    'error'
                );
            }
        }
    }
    
    toggleFAQ(element) {
        const faqItem = element.parentElement;
        faqItem.classList.toggle('active');
        
        const icon = element.querySelector('i');
        if (faqItem.classList.contains('active')) {
            icon.classList.remove('fa-chevron-down');
            icon.classList.add('fa-chevron-up');
        } else {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        }
    }
    
    contactarVentas() {
        console.log('📞 Contactando ventas...');
        
        if (window.axyraNotifications) {
            window.axyraNotifications.show(
                'Redirigiendo a ventas...',
                'info'
            );
        }
        
        // Simular redirección a contacto
        setTimeout(() => {
            window.open('mailto:ventas@axyra.com?subject=Consulta sobre planes AXYRA', '_blank');
        }, 1000);
    }
    
    // Método para obtener estadísticas de suscripciones
    obtenerEstadisticas() {
        return {
            planActual: localStorage.getItem('axyra_plan_actual'),
            fechaSuscripcion: localStorage.getItem('axyra_plan_fecha'),
            planesDisponibles: Object.keys(this.planes)
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.axyraMembresias = new AxyraMembresias();
});

// Funciones globales para compatibilidad
window.seleccionarPlan = function(plan) {
    if (window.axyraMembresias) {
        window.axyraMembresias.seleccionarPlan(plan);
    }
};

window.toggleFAQ = function(element) {
    if (window.axyraMembresias) {
        window.axyraMembresias.toggleFAQ(element);
    }
};

console.log('✅ Sistema de Membresías AXYRA cargado');
