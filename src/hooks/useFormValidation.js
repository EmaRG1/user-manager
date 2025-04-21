import { useState, useEffect } from 'react';

// Constantes reutilizables
const TEXT_REGEX = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]*$/;
const ZIPCODE_REGEX = /^[A-Za-z0-9]*$/;
const FIELD_MAX_LENGTHS = {
  name: 50,         // Nombres y apellidos
  street: 100,      // Direcciones
  city: 50,         // Ciudades
  state: 50,        // Estados/Provincias
  country: 50,      // Países
  zipCode: 10,      // Códigos postales
  email: 100,       // Correos electrónicos
  institution: 100, // Instituciones educativas
  title: 100,       // Títulos
  degree: 50,       // Grados académicos
  fieldOfStudy: 50, // Campos de estudio
  description: 500, // Descripciones
  password: 50      // Contraseñas
};

const TEXT_FIELDS_TO_CAPITALIZE = [
  'name', 'street', 'city', 'state', 'country', 
  'institution', 'title', 'fieldOfStudy', 'degree'
];

/**
 * Hook personalizado para validación de formularios
 * @param {Object} initialValues - Valores iniciales del formulario
 * @param {Object} validationRules - Reglas de validación
 * @param {Function} onSubmit - Función a ejecutar al enviar el formulario
 * @param {Object} externalValues - Valores externos que resetean el formulario cuando cambian
 * @returns {Object} - Estado y métodos para manejar el formulario
 */
export default function useFormValidation(
  initialValues, 
  validationRules, 
  onSubmit, 
  externalValues = {}
) {
  // Estados del formulario
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dependencias externas para resetear el formulario
  const externalDeps = createExternalDependenciesString(externalValues);

  // Resetear formulario cuando cambian las dependencias externas
  useEffect(() => {
    resetForm();
  }, [externalDeps]);

  // Actualizar formulario cuando cambian los valores iniciales
  useEffect(() => {
    setFormData(initialValues);
  }, [JSON.stringify(initialValues)]);

  /**
   * Crea un string de dependencias a partir de valores externos
   * @param {Object} values - Valores externos
   * @returns {String} - String de dependencias
   */
  function createExternalDependenciesString(values) {
    return Object.keys(values)
      .map(key => `${key}:${values[key]}`)
      .join('|');
  }

  /**
   * Resetea el formulario a sus valores iniciales
   */
  function resetForm() {
    setFormData(initialValues);
    setErrors({});
  }

  /**
   * Valida un campo específico
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   * @returns {String|null} - Mensaje de error o null si no hay error
   */
  function validateField(name, value) {
    if (!validationRules[name]) return '';

    // Validar si es requerido
    if (isEmptyField(name, value)) {
      return validationRules[name].required;
    }
    
    // Validación especial para campos 'name'
    if (name === 'name' && !TEXT_REGEX.test(value)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    
    // Validación especial para código postal
    if (name === 'zipCode' && !ZIPCODE_REGEX.test(value)) {
      return 'El código postal solo puede contener letras y números';
    }
    
    // Validar patrón
    if (hasPatternError(name, value)) {
      return validationRules[name].pattern.message;
    }
    
    // Validar longitud mínima
    if (hasMinLengthError(name, value)) {
      return validationRules[name].minLength.message;
    }
    
    // Validación personalizada
    const customError = getCustomValidationError(name, value);
    if (customError) return customError;
    
    return '';
  }

  /**
   * Verifica si un campo requerido está vacío
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   * @returns {Boolean}
   */
  function isEmptyField(name, value) {
    return validationRules[name].required && 
           (!value || (typeof value === 'string' && !value.trim()));
  }

  /**
   * Verifica si hay error de patrón en un campo
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   * @returns {Boolean}
   */
  function hasPatternError(name, value) {
    return validationRules[name].pattern && 
           !validationRules[name].pattern.regex.test(value);
  }

  /**
   * Verifica si hay error de longitud mínima en un campo
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   * @returns {Boolean}
   */
  function hasMinLengthError(name, value) {
    return validationRules[name].minLength && 
           value.length < validationRules[name].minLength.value;
  }

  /**
   * Obtiene error de validación personalizada si existe
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   * @returns {String|null}
   */
  function getCustomValidationError(name, value) {
    if (validationRules[name].custom && 
        typeof validationRules[name].custom === 'function') {
      return validationRules[name].custom(value, formData) || null;
    }
    return null;
  }

  /**
   * Maneja cambios en los campos del formulario
   * @param {Event} e - Evento de cambio
   */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;
    
    // Procesar campos de texto
    if (TEXT_FIELDS_TO_CAPITALIZE.includes(name)) {
      fieldValue = processTextField(name, value);
    }
    
    // Procesar campo de código postal
    if (name === 'zipCode') {
      fieldValue = processZipCodeField(value);
    }
    
    // Aplicar límite de caracteres
    fieldValue = applyCharacterLimit(name, fieldValue);
    
    // Actualizar estado del formulario
    updateFormData(name, fieldValue);
    
    // Limpiar error si existe
    clearFieldError(name);
  }

  /**
   * Procesa un campo de texto para validar y capitalizar
   * @param {String} name - Nombre del campo
   * @param {String} value - Valor del campo
   * @returns {String} - Valor procesado
   */
  function processTextField(name, value) {
    // Verificar si contiene solo texto válido
    if (TEXT_REGEX.test(value)) {
      // Capitalizar la primera letra
      return capitalizeFirstLetter(value);
    } else {
      // Eliminar el último carácter no válido
      return value.slice(0, -1);
    }
  }

  /**
   * Procesa un campo de código postal, permitiendo solo letras y números
   * @param {String} value - Valor del campo
   * @returns {String} - Valor procesado
   */
  function processZipCodeField(value) {
    // Verificar si contiene solo letras y números
    if (ZIPCODE_REGEX.test(value)) {
      return value.toUpperCase(); // Códigos postales normalmente en mayúsculas
    } else {
      // Eliminar el último carácter no válido
      return value.slice(0, -1);
    }
  }

  /**
   * Capitaliza la primera letra de un texto
   * @param {String} text - Texto a capitalizar
   * @returns {String} - Texto con primera letra mayúscula
   */
  function capitalizeFirstLetter(text) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Aplica límite de caracteres a un campo
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   * @returns {*} - Valor con límite aplicado
   */
  function applyCharacterLimit(name, value) {
    if (FIELD_MAX_LENGTHS[name] && typeof value === 'string' && 
        value.length > FIELD_MAX_LENGTHS[name]) {
      return value.slice(0, FIELD_MAX_LENGTHS[name]);
    }
    return value;
  }

  /**
   * Actualiza los datos del formulario
   * @param {String} name - Nombre del campo
   * @param {*} value - Valor del campo
   */
  function updateFormData(name, value) {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  /**
   * Limpia el error de un campo
   * @param {String} name - Nombre del campo
   */
  function clearFieldError(name) {
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  /**
   * Valida todos los campos del formulario
   * @returns {Boolean} - True si no hay errores
   */
  function validateAllFields() {
    const newErrors = {};
    
    Object.keys(formData).forEach(field => {
      if (validationRules[field]) {
        const error = validateField(field, formData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío
   */
  function handleSubmit(e) {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    if (validateAllFields()) {
      onSubmit(formData);
    } else {
      setIsSubmitting(false);
    }
  }

  /**
   * Maneja la pérdida de foco de un campo
   * @param {Event} e - Evento blur
   */
  function handleBlur(e) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }

  // API pública del hook
  return {
    formData,
    errors,
    isSubmitting,
    setFormData,
    setErrors,
    setIsSubmitting,
    handleChange,
    handleSubmit,
    handleBlur,
    validateField,
    validateAllFields
  };
} 