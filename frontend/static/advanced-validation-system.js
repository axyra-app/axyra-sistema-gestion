// ========================================
// SISTEMA AVANZADO DE VALIDACIONES AXYRA
// ========================================

class AxyraValidationSystem {
  constructor() {
    this.rules = {};
    this.customValidators = {};
    this.isInitialized = false;
    this.init();
  }

  init() {
    try {
      console.log('🔍 Inicializando Sistema de Validaciones AXYRA...');

      this.setupDefaultRules();
      this.setupCustomValidators();
      this.setupGlobalValidation();

      this.isInitialized = true;
      console.log('✅ Sistema de Validaciones inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando validaciones:', error);
    }
  }

  // ========================================
  // REGLAS DE VALIDACIÓN POR DEFECTO
  // ========================================

  setupDefaultRules() {
    this.rules = {
      // Validaciones de empleados
      empleado: {
        nombre: {
          required: true,
          minLength: 2,
          maxLength: 100,
          pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
          message: 'El nombre debe contener solo letras y espacios (2-100 caracteres)',
        },
        cedula: {
          required: true,
          pattern: /^[0-9]{6,12}$/,
          message: 'La cédula debe contener entre 6 y 12 dígitos',
        },
        email: {
          required: false,
          pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: 'El email debe tener un formato válido',
        },
        telefono: {
          required: false,
          pattern: /^[0-9+\-\s()]{7,15}$/,
          message: 'El teléfono debe tener entre 7 y 15 caracteres',
        },
        salario: {
          required: true,
          min: 0,
          max: 10000000,
          message: 'El salario debe estar entre $0 y $10,000,000',
        },
      },

      // Validaciones de productos
      producto: {
        codigo: {
          required: true,
          minLength: 3,
          maxLength: 20,
          pattern: /^[A-Z0-9_-]+$/,
          message: 'El código debe contener solo letras mayúsculas, números, guiones y guiones bajos (3-20 caracteres)',
        },
        nombre: {
          required: true,
          minLength: 2,
          maxLength: 100,
          message: 'El nombre debe tener entre 2 y 100 caracteres',
        },
        stock: {
          required: true,
          min: 0,
          max: 999999,
          message: 'El stock debe estar entre 0 y 999,999',
        },
        precioCompra: {
          required: true,
          min: 0,
          max: 10000000,
          message: 'El precio de compra debe estar entre $0 y $10,000,000',
        },
        precioVenta: {
          required: true,
          min: 0,
          max: 10000000,
          message: 'El precio de venta debe estar entre $0 y $10,000,000',
        },
      },

      // Validaciones de facturas
      factura: {
        numero: {
          required: true,
          minLength: 3,
          maxLength: 20,
          pattern: /^[A-Z0-9_-]+$/,
          message:
            'El número de factura debe contener solo letras mayúsculas, números, guiones y guiones bajos (3-20 caracteres)',
        },
        valor: {
          required: true,
          min: 1,
          max: 10000000,
          message: 'El valor debe estar entre $1 y $10,000,000',
        },
        fecha: {
          required: true,
          message: 'La fecha es obligatoria',
        },
      },

      // Validaciones de horas
      horas: {
        fecha: {
          required: true,
          message: 'La fecha es obligatoria',
        },
        empleado: {
          required: true,
          message: 'El empleado es obligatorio',
        },
        horasNormales: {
          min: 0,
          max: 24,
          message: 'Las horas normales deben estar entre 0 y 24',
        },
        horasExtras: {
          min: 0,
          max: 12,
          message: 'Las horas extras deben estar entre 0 y 12',
        },
      },
    };
  }

  // ========================================
  // VALIDADORES PERSONALIZADOS
  // ========================================

  setupCustomValidators() {
    this.customValidators = {
      // Validar cédula colombiana
      cedulaColombiana: (value) => {
        if (!value) return { valid: false, message: 'La cédula es obligatoria' };

        const cedula = value.replace(/\D/g, '');
        if (cedula.length < 6 || cedula.length > 12) {
          return { valid: false, message: 'La cédula debe tener entre 6 y 12 dígitos' };
        }

        // Algoritmo de validación de cédula colombiana
        let suma = 0;
        const multiplicadores = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

        for (let i = 0; i < cedula.length - 1; i++) {
          suma += parseInt(cedula[i]) * multiplicadores[i];
        }

        const residuo = suma % 11;
        const digitoVerificador = residuo < 2 ? residuo : 11 - residuo;

        if (parseInt(cedula[cedula.length - 1]) !== digitoVerificador) {
          return { valid: false, message: 'La cédula no es válida' };
        }

        return { valid: true };
      },

      // Validar código único
      codigoUnico: (value, context, existingItems) => {
        if (!value) return { valid: false, message: 'El código es obligatorio' };

        const existe = existingItems.some((item) => item.codigo && item.codigo.toLowerCase() === value.toLowerCase());

        if (existe) {
          return { valid: false, message: 'Este código ya existe' };
        }

        return { valid: true };
      },

      // Validar rango de fechas
      rangoFechas: (fechaInicio, fechaFin) => {
        if (!fechaInicio || !fechaFin) {
          return { valid: false, message: 'Ambas fechas son obligatorias' };
        }

        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);

        if (inicio > fin) {
          return { valid: false, message: 'La fecha de inicio debe ser anterior a la fecha de fin' };
        }

        const diferenciaDias = (fin - inicio) / (1000 * 60 * 60 * 24);
        if (diferenciaDias > 365) {
          return { valid: false, message: 'El rango de fechas no puede ser mayor a 1 año' };
        }

        return { valid: true };
      },

      // Validar stock mínimo
      stockMinimo: (stock, stockMinimo) => {
        if (stock < 0) {
          return { valid: false, message: 'El stock no puede ser negativo' };
        }

        if (stockMinimo < 0) {
          return { valid: false, message: 'El stock mínimo no puede ser negativo' };
        }

        if (stock < stockMinimo) {
          return { valid: false, message: 'El stock actual está por debajo del mínimo' };
        }

        return { valid: true };
      },

      // Validar precios
      preciosValidos: (precioCompra, precioVenta) => {
        if (precioCompra <= 0) {
          return { valid: false, message: 'El precio de compra debe ser mayor a 0' };
        }

        if (precioVenta <= 0) {
          return { valid: false, message: 'El precio de venta debe ser mayor a 0' };
        }

        if (precioVenta < precioCompra) {
          return { valid: false, message: 'El precio de venta debe ser mayor o igual al precio de compra' };
        }

        return { valid: true };
      },

      // Validar horas laborales
      horasLaborales: (horasNormales, horasExtras) => {
        const totalHoras = (horasNormales || 0) + (horasExtras || 0);

        if (totalHoras > 24) {
          return { valid: false, message: 'El total de horas no puede ser mayor a 24' };
        }

        if (horasNormales < 0 || horasExtras < 0) {
          return { valid: false, message: 'Las horas no pueden ser negativas' };
        }

        if (horasExtras > 12) {
          return { valid: false, message: 'Las horas extras no pueden ser mayores a 12' };
        }

        return { valid: true };
      },
    };
  }

  // ========================================
  // CONFIGURACIÓN GLOBAL
  // ========================================

  setupGlobalValidation() {
    // Validación automática en formularios
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.validateField(e.target);
      }
    });

    // Validación en envío de formularios
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.matches('form')) {
        const isValid = this.validateForm(form);
        if (!isValid) {
          e.preventDefault();
        }
      }
    });
  }

  // ========================================
  // MÉTODOS DE VALIDACIÓN
  // ========================================

  validateField(field) {
    const fieldName = field.name || field.id;
    const fieldType = this.getFieldType(field);
    const value = field.value;

    // Obtener reglas para el campo
    const rules = this.getFieldRules(fieldName, fieldType);
    if (!rules) return { valid: true };

    // Aplicar validaciones
    const result = this.applyValidationRules(value, rules, field);

    // Mostrar resultado
    this.showFieldValidation(field, result);

    return result.valid;
  }

  validateForm(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    let isFormValid = true;

    fields.forEach((field) => {
      const fieldValid = this.validateField(field);
      if (!fieldValid) {
        isFormValid = false;
      }
    });

    return isFormValid;
  }

  getFieldType(field) {
    if (field.type === 'email') return 'email';
    if (field.type === 'tel') return 'telefono';
    if (field.type === 'number') return 'numero';
    if (field.type === 'date') return 'fecha';
    if (field.name && field.name.includes('cedula')) return 'cedula';
    if (field.name && field.name.includes('codigo')) return 'codigo';
    return 'texto';
  }

  getFieldRules(fieldName, fieldType) {
    // Buscar reglas específicas por nombre de campo
    for (const [entity, entityRules] of Object.entries(this.rules)) {
      if (entityRules[fieldName]) {
        return entityRules[fieldName];
      }
    }

    // Reglas por tipo de campo
    const typeRules = {
      email: this.rules.empleado.email,
      telefono: this.rules.empleado.telefono,
      cedula: this.rules.empleado.cedula,
      numero: { min: 0, message: 'El valor debe ser mayor o igual a 0' },
      fecha: { required: true, message: 'La fecha es obligatoria' },
    };

    return typeRules[fieldType];
  }

  applyValidationRules(value, rules, field) {
    // Validación requerida
    if (rules.required && (!value || value.trim() === '')) {
      return { valid: false, message: rules.message || 'Este campo es obligatorio' };
    }

    // Si no es requerido y está vacío, es válido
    if (!rules.required && (!value || value.trim() === '')) {
      return { valid: true };
    }

    // Validación de longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      return { valid: false, message: rules.message || `Debe tener al menos ${rules.minLength} caracteres` };
    }

    // Validación de longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      return { valid: false, message: rules.message || `No puede tener más de ${rules.maxLength} caracteres` };
    }

    // Validación de patrón
    if (rules.pattern && !rules.pattern.test(value)) {
      return { valid: false, message: rules.message || 'El formato no es válido' };
    }

    // Validación de valor mínimo
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      return { valid: false, message: rules.message || `El valor debe ser mayor o igual a ${rules.min}` };
    }

    // Validación de valor máximo
    if (rules.max !== undefined && parseFloat(value) > rules.max) {
      return { valid: false, message: rules.message || `El valor debe ser menor o igual a ${rules.max}` };
    }

    return { valid: true };
  }

  showFieldValidation(field, result) {
    // Remover validación anterior
    this.clearFieldValidation(field);

    if (!result.valid) {
      // Agregar clase de error
      field.classList.add('axyra-field-error');

      // Crear mensaje de error
      const errorDiv = document.createElement('div');
      errorDiv.className = 'axyra-field-error-message';
      errorDiv.textContent = result.message;

      // Insertar después del campo
      field.parentNode.insertBefore(errorDiv, field.nextSibling);
    } else {
      // Agregar clase de éxito
      field.classList.add('axyra-field-success');
    }
  }

  clearFieldValidation(field) {
    field.classList.remove('axyra-field-error', 'axyra-field-success');

    const errorMessage = field.parentNode.querySelector('.axyra-field-error-message');
    if (errorMessage) {
      errorMessage.remove();
    }
  }

  // ========================================
  // VALIDADORES PERSONALIZADOS
  // ========================================

  validateCustom(validatorName, ...args) {
    const validator = this.customValidators[validatorName];
    if (!validator) {
      console.error(`Validador personalizado '${validatorName}' no encontrado`);
      return { valid: false, message: 'Error de validación' };
    }

    return validator(...args);
  }

  // ========================================
  // VALIDACIONES ESPECÍFICAS POR MÓDULO
  // ========================================

  validateEmpleado(empleadoData) {
    const errors = [];

    // Validar nombre
    const nombreResult = this.validateCustom('cedulaColombiana', empleadoData.cedula);
    if (!nombreResult.valid) {
      errors.push(nombreResult.message);
    }

    // Validar cédula
    const cedulaResult = this.validateCustom('cedulaColombiana', empleadoData.cedula);
    if (!cedulaResult.valid) {
      errors.push(cedulaResult.message);
    }

    // Validar salario
    if (empleadoData.salario < 0 || empleadoData.salario > 10000000) {
      errors.push('El salario debe estar entre $0 y $10,000,000');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  validateProducto(productoData, existingProductos = []) {
    const errors = [];

    // Validar código único
    const codigoResult = this.validateCustom('codigoUnico', productoData.codigo, 'producto', existingProductos);
    if (!codigoResult.valid) {
      errors.push(codigoResult.message);
    }

    // Validar precios
    const preciosResult = this.validateCustom('preciosValidos', productoData.precioCompra, productoData.precioVenta);
    if (!preciosResult.valid) {
      errors.push(preciosResult.message);
    }

    // Validar stock
    const stockResult = this.validateCustom('stockMinimo', productoData.stock, productoData.stockMinimo);
    if (!stockResult.valid) {
      errors.push(stockResult.message);
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  validateFactura(facturaData, existingFacturas = []) {
    const errors = [];

    // Validar número único
    const numeroResult = this.validateCustom('codigoUnico', facturaData.numero, 'factura', existingFacturas);
    if (!numeroResult.valid) {
      errors.push(numeroResult.message);
    }

    // Validar valor
    if (facturaData.valor <= 0) {
      errors.push('El valor de la factura debe ser mayor a 0');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  validateHoras(horasData) {
    const errors = [];

    // Validar horas laborales
    const horasResult = this.validateCustom('horasLaborales', horasData.horasNormales, horasData.horasExtras);
    if (!horasResult.valid) {
      errors.push(horasResult.message);
    }

    // Validar empleado
    if (!horasData.empleadoId) {
      errors.push('El empleado es obligatorio');
    }

    // Validar fecha
    if (!horasData.fecha) {
      errors.push('La fecha es obligatoria');
    }

    return {
      valid: errors.length === 0,
      errors: errors,
    };
  }

  // ========================================
  // UTILIDADES
  // ========================================

  showValidationErrors(errors) {
    if (errors.length === 0) return;

    const errorMessage = errors.join('\n');
    this.showNotification(errorMessage, 'error');
  }

  showNotification(message, type = 'info') {
    // Usar sistema de notificaciones existente si está disponible
    if (window.axyraNotifications) {
      window.axyraNotifications.show(message, type);
      return;
    }

    // Fallback a alert
    if (type === 'error') {
      alert('❌ ' + message);
    } else if (type === 'warning') {
      alert('⚠️ ' + message);
    } else if (type === 'success') {
      alert('✅ ' + message);
    } else {
      alert('ℹ️ ' + message);
    }
  }

  // ========================================
  // API PÚBLICA
  // ========================================

  // Validar un campo específico
  validateField(field) {
    return this.validateField(field);
  }

  // Validar un formulario completo
  validateForm(form) {
    return this.validateForm(form);
  }

  // Validar datos de empleado
  validateEmpleado(empleadoData) {
    return this.validateEmpleado(empleadoData);
  }

  // Validar datos de producto
  validateProducto(productoData, existingProductos) {
    return this.validateProducto(productoData, existingProductos);
  }

  // Validar datos de factura
  validateFactura(facturaData, existingFacturas) {
    return this.validateFactura(facturaData, existingFacturas);
  }

  // Validar datos de horas
  validateHoras(horasData) {
    return this.validateHoras(horasData);
  }

  // Agregar validador personalizado
  addCustomValidator(name, validator) {
    this.customValidators[name] = validator;
  }

  // Agregar reglas personalizadas
  addRules(entity, field, rules) {
    if (!this.rules[entity]) {
      this.rules[entity] = {};
    }
    this.rules[entity][field] = rules;
  }
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Crear instancia global
window.axyraValidation = new AxyraValidationSystem();

// Exportar para uso en módulos
window.AxyraValidationSystem = AxyraValidationSystem;

console.log('🔍 Sistema de Validaciones AXYRA cargado');

