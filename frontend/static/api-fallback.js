/**
 * 🔄 SISTEMA DE FALLBACK API AXYRA
 * Manejo de APIs cuando no están disponibles
 */

class AxyraAPIFallback {
    constructor() {
        this.fallbackData = {
            userPlan: {
                plan: 'free',
                status: 'active',
                endDate: null,
                hasAccess: false
            }
        };
        this.init();
    }

    init() {
        console.log('🔄 Sistema de Fallback API AXYRA inicializado');
    }

    // Fallback para checkUserPlan
    async checkUserPlan(userId) {
        try {
            // Intentar con la API real primero
            const response = await fetch(`/api/check-user-plan?userId=${userId}`);
            
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn('⚠️ API no disponible, usando datos de fallback:', error.message);
            
            // Usar datos de fallback
            return this.fallbackData.userPlan;
        }
    }

    // Fallback para otras APIs
    async makeAPICall(endpoint, options = {}) {
        try {
            const response = await fetch(endpoint, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error(`API Error: ${response.status}`);
            }
        } catch (error) {
            console.warn(`⚠️ API ${endpoint} no disponible:`, error.message);
            
            // Retornar datos de fallback según el endpoint
            return this.getFallbackData(endpoint);
        }
    }

    getFallbackData(endpoint) {
        const fallbackMap = {
            '/api/check-user-plan': this.fallbackData.userPlan,
            '/api/employees': { employees: [], total: 0 },
            '/api/payments': { payments: [], total: 0 },
            '/api/payroll': { payroll: [], total: 0 }
        };

        return fallbackMap[endpoint] || { error: 'API no disponible' };
    }

    // Método para configurar datos de fallback
    setFallbackData(key, data) {
        this.fallbackData[key] = data;
        console.log(`📝 Datos de fallback actualizados para ${key}`);
    }

    // Método para verificar conectividad
    async checkConnectivity() {
        try {
            const response = await fetch('/api/health', { 
                method: 'HEAD',
                timeout: 5000 
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Inicializar el sistema de fallback
window.axyraAPIFallback = new AxyraAPIFallback();

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AxyraAPIFallback;
}
