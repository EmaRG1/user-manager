import { useState, useEffect } from 'react';

// Constantes reutilizables
const TEXT_REGEX = /^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]*$/;
const ADDRESS_REGEX = /^[A-Za-z0-9áéíóúÁÉÍÓÚüÜñÑ\s,.#]+$/;
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
  'name', 'city', 'state', 'country', 
  'institution', 'title', 'fieldOfStudy', 'degree'
];

/**
 * Hook para validación de formularios
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

  // Resetear formulario cuando cambian las dependencias externas
  useEffect(() => {
    setFormData(initialValues);
    setErrors({});
  }, [JSON.stringify(externalValues), JSON.stringify(initialValues)]);

  /**
   * Valida un campo específico
   */
  function validateField(name, value) {
    if (!validationRules[name]) return '';

    // Requerido
    if (validationRules[name].required && (!value || (typeof value === 'string' && !value.trim()))) {
      return validationRules[name].required;
    }
    
    // Validación de nombres (solo letras)
    if (name === 'name' && !TEXT_REGEX.test(value)) {
      return 'El nombre solo puede contener letras y espacios';
    }
    
    // Validación de direcciones (letras, números y caracteres especiales)
    if (name === 'street' && !ADDRESS_REGEX.test(value)) {
      return 'La dirección contiene caracteres no permitidos';
    }
    
    // Código postal
    if (name === 'zipCode' && !ZIPCODE_REGEX.test(value)) {
      return 'El código postal solo puede contener letras y números';
    }
    
    // Validación por patrón (email, etc)
    if (validationRules[name].pattern && !validationRules[name].pattern.regex.test(value)) {
      return validationRules[name].pattern.message;
    }
    
    // Longitud mínima
    if (validationRules[name].minLength && value.length < validationRules[name].minLength.value) {
      return validationRules[name].minLength.message;
    }
    
    // Validación personalizada
    if (validationRules[name].custom && typeof validationRules[name].custom === 'function') {
      return validationRules[name].custom(value, formData) || '';
    }
    
    return '';
  }

  /**
   * Maneja cambios en los campos del formulario
   */
  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;
    
    // Procesar campos de texto para capitalizar
    if (TEXT_FIELDS_TO_CAPITALIZE.includes(name) && typeof value === 'string') {
      if (value && value.length > 0) {
        fieldValue = value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
    
    // Procesar campo de código postal
    if (name === 'zipCode' && typeof value === 'string') {
      fieldValue = value.toUpperCase();
    }
    
    // Aplicar límite de caracteres
    if (FIELD_MAX_LENGTHS[name] && typeof fieldValue === 'string' && 
        fieldValue.length > FIELD_MAX_LENGTHS[name]) {
      fieldValue = fieldValue.slice(0, FIELD_MAX_LENGTHS[name]);
    }
    
    // Actualizar estado
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
    
    // Limpiar error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }

  /**
   * Valida todos los campos
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
   * Maneja el blur
   */
  function handleBlur(e) {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }

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