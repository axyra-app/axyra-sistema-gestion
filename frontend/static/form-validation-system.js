// ========================================
// SISTEMA DE VALIDACIÓN DE FORMULARIOS AXYRA
// ========================================

class AxyraFormValidationSystem {
  constructor() {
    this.rules = {
      required: (value) => value !== null && value !== undefined && value.toString().trim() !== '',
      email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      minLength: (value, min) => value && value.length >= min,
      maxLength: (value, max) => value && value.length <= max,
      numeric: (value) => !isNaN(parseFloat(value)) && isFinite(value),
      positive: (value) => parseFloat(value) > 0,
      phone: (value) => /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
      cedula: (value) => /^[0-9]{6,12}$/.test(value),
      nit: (value) => /^[0-9]{9,10}$/.test(value),
      date: (value) => !isNaN(Date.parse(value)),
      futureDate: (value) => new Date(value) > new Date(),
      pastDate: (value) => new Date(value) < new Date(),
      url: (value) => /^https?:\/\/.+/.test(value),
      password: (value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value),
    };
    
    this.messages = {
      required: 'Este campo es obligatorio',
      email: 'Ingresa un email válido',
      minLength: 'Debe tener al menos {min} caracteres',
      maxLength: 'No puede tener más de {max} caracteres',
      numeric: 'Debe ser un número válido',
      positive: 'Debe ser un número positivo',
      phone: 'Ingresa un teléfono válido',
      cedula: 'Ingresa una cédula válida (6-12 dígitos)',
      nit: 'Ingresa un NIT válido (9-10 dígitos)',
      date: 'Ingresa una fecha válida',
      futureDate: 'La fecha debe ser futura',
      pastDate: 'La fecha debe ser pasada',
      url: 'Ingresa una URL válida',
      password: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos',
    };
    
    this.validatedForms = new Set();
    this.init();
  }

  init() {
    console.log('✅ Inicializando sistema de validación de formularios...');
    this.setupFormListeners();
    this.setupRealTimeValidation();
  }

  // Configurar listeners de formularios
  setupFormListeners() {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.tagName === 'FORM' && form.dataset.validate !== 'false') {
        e.preventDefault();
        this.validateForm(form);
      }
    });

    // Validación en tiempo real
    document.addEventListener('input', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.validateField(e.target);
      }
    });

    // Validación al perder foco
    document.addEventListener('blur', (e) => {
      if (e.target.matches('input, select, textarea')) {
        this.validateField(e.target);
      }
    }, true);
  }

  // Configurar validación en tiempo real
  setupRealTimeValidation() {
    const forms = document.querySelectorAll('form[data-validate="realtime"]');
    forms.forEach(form => {
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        input.addEventListener('input', () => this.validateField(input));
        input.addEventListener('blur', () => this.validateField(input));
      });
    });
  }

  // Validar formulario completo
  validateForm(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;
    const errors = [];

    inputs.forEach(input => {
      const fieldValid = this.validateField(input);
      if (!fieldValid) {
        isValid = false;
        errors.push({
          field: input.name || input.id,
          message: input.dataset.errorMessage || 'Campo inválido'
        });
      }
    });

    if (isValid) {
      this.showFormSuccess(form);
      this.validatedForms.add(form);
      
      // Ejecutar callback de éxito si existe
      const successCallback = form.dataset.onSuccess;
      if (successCallback && window[successCallback]) {
        window[successCallback](form);
      }
    } else {
      this.showFormErrors(form, errors);
    }

    return isValid;
  }

  // Validar campo individual
  validateField(field) {
    const rules = this.getFieldRules(field);
    const value = field.value;
    let isValid = true;
    let errorMessage = '';

    for (const rule of rules) {
      const result = this.applyRule(rule, value, field);
      if (!result.valid) {
        isValid = false;
        errorMessage = result.message;
        break;
      }
    }

    this.updateFieldStatus(field, isValid, errorMessage);
    return isValid;
  }

  // Obtener reglas del campo
  getFieldRules(field) {
    const rules = [];
    const validationRules = field.dataset.validate;

    if (validationRules) {
      const ruleList = validationRules.split('|');
      
      ruleList.forEach(rule => {
        const [ruleName, ...params] = rule.split(':');
        rules.push({
          name: ruleName,
          params: params,
          message: field.dataset[`${ruleName}Message`] || this.messages[ruleName]
        });
      });
    }

    // Reglas por tipo de campo
    if (field.type === 'email') {
      rules.push({ name: 'email', params: [], message: this.messages.email });
    }

    if (field.required) {
      rules.push({ name: 'required', params: [], message: this.messages.required });
    }

    return rules;
  }

  // Aplicar regla de validación
  applyRule(rule, value, field) {
    const ruleFunction = this.rules[rule.name];
    
    if (!ruleFunction) {
      return { valid: true, message: '' };
    }

    let isValid;
    try {
      isValid = ruleFunction(value, ...rule.params);
    } catch (error) {
      console.error('Error en validación:', error);
      isValid = false;
    }

    let message = '';
    if (!isValid) {
      message = this.formatMessage(rule.message, rule.params);
    }

    return { valid: isValid, message };
  }

  // Formatear mensaje de error
  formatMessage(message, params) {
    let formattedMessage = message;
    
    params.forEach((param, index) => {
      const placeholder = `{${index === 0 ? 'min' : index === 1 ? 'max' : `param${index}`}}`;
      formattedMessage = formattedMessage.replace(placeholder, param);
    });

    return formattedMessage;
  }

  // Actualizar estado visual del campo
  updateFieldStatus(field, isValid, errorMessage) {
    const fieldContainer = field.closest('.form-group') || field.parentElement;
    
    // Remover clases anteriores
    field.classList.remove('is-valid', 'is-invalid');
    fieldContainer.classList.remove('has-error', 'has-success');
    
    // Remover mensaje de error anterior
    const existingError = fieldContainer.querySelector('.error-message');
    if (existingError) {
      existingError.remove();
    }

    if (isValid) {
      field.classList.add('is-valid');
      fieldContainer.classList.add('has-success');
    } else {
      field.classList.add('is-invalid');
      fieldContainer.classList.add('has-error');
      
      // Agregar mensaje de error
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.textContent = errorMessage;
      errorElement.style.color = '#dc3545';
      errorElement.style.fontSize = '0.875rem';
      errorElement.style.marginTop = '0.25rem';
      
      fieldContainer.appendChild(errorElement);
    }
  }

  // Mostrar errores del formulario
  showFormErrors(form, errors) {
    const errorContainer = form.querySelector('.form-errors') || this.createErrorContainer(form);
    
    errorContainer.innerHTML = '';
    errorContainer.style.display = 'block';
    
    errors.forEach(error => {
      const errorElement = document.createElement('div');
      errorElement.className = 'form-error';
      errorElement.textContent = error.message;
      errorElement.style.color = '#dc3545';
      errorElement.style.marginBottom = '0.5rem';
      errorElement.style.padding = '0.5rem';
      errorElement.style.backgroundColor = '#f8d7da';
      errorElement.style.border = '1px solid #f5c6cb';
      errorElement.style.borderRadius = '0.25rem';
      
      errorContainer.appendChild(errorElement);
    });

    // Scroll al primer error
    const firstError = errorContainer.querySelector('.form-error');
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  // Mostrar éxito del formulario
  showFormSuccess(form) {
    const errorContainer = form.querySelector('.form-errors');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }

    // Mostrar mensaje de éxito
    const successMessage = form.querySelector('.form-success') || this.createSuccessMessage(form);
    successMessage.style.display = 'block';
    successMessage.textContent = 'Formulario enviado correctamente';
  }

  // Crear contenedor de errores
  createErrorContainer(form) {
    const errorContainer = document.createElement('div');
    errorContainer.className = 'form-errors';
    errorContainer.style.marginBottom = '1rem';
    form.insertBefore(errorContainer, form.firstChild);
    return errorContainer;
  }

  // Crear mensaje de éxito
  createSuccessMessage(form) {
    const successMessage = document.createElement('div');
    successMessage.className = 'form-success';
    successMessage.style.color = '#28a745';
    successMessage.style.marginBottom = '1rem';
    successMessage.style.padding = '0.5rem';
    successMessage.style.backgroundColor = '#d4edda';
    successMessage.style.border = '1px solid #c3e6cb';
    successMessage.style.borderRadius = '0.25rem';
    successMessage.style.display = 'none';
    
    form.insertBefore(successMessage, form.firstChild);
    return successMessage;
  }

  // Validar formulario específico por ID
  validateFormById(formId) {
    const form = document.getElementById(formId);
    if (form) {
      return this.validateForm(form);
    }
    return false;
  }

  // Limpiar validaciones de formulario
  clearFormValidation(form) {
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.classList.remove('is-valid', 'is-invalid');
      const fieldContainer = input.closest('.form-group') || input.parentElement;
      fieldContainer.classList.remove('has-error', 'has-success');
      
      const errorMessage = fieldContainer.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.remove();
      }
    });

    const errorContainer = form.querySelector('.form-errors');
    if (errorContainer) {
      errorContainer.style.display = 'none';
    }

    const successMessage = form.querySelector('.form-success');
    if (successMessage) {
      successMessage.style.display = 'none';
    }
  }

  // Agregar regla personalizada
  addCustomRule(name, ruleFunction, message) {
    this.rules[name] = ruleFunction;
    this.messages[name] = message;
  }

  // Obtener estadísticas de validación
  getValidationStats() {
    const forms = document.querySelectorAll('form');
    const totalForms = forms.length;
    const validatedForms = this.validatedForms.size;
    const invalidFields = document.querySelectorAll('.is-invalid').length;
    const validFields = document.querySelectorAll('.is-valid').length;

    return {
      totalForms,
      validatedForms,
      invalidFields,
      validFields,
      validationRate: totalForms > 0 ? (validatedForms / totalForms) * 100 : 0
    };
  }
}

// Inicializar sistema de validación
document.addEventListener('DOMContentLoaded', () => {
  window.axyraFormValidation = new AxyraFormValidationSystem();
});

// Exportar para uso global
window.AxyraFormValidationSystem = AxyraFormValidationSystem;
