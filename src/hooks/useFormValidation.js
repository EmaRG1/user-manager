import { useState, useEffect } from 'react';

export default function useFormValidation(initialValues, validationRules, onSubmit, externalValues = {}) {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const externalDeps = Object.keys(externalValues).map(key => `${key}:${externalValues[key]}`).join('|');

  useEffect(() => {
    setFormData(initialValues);
    setErrors({});
  }, [externalDeps]);

  useEffect(() => {
    setFormData(initialValues);
  }, [JSON.stringify(initialValues)]);

  const validateField = (name, value) => {
    let errorMessage = '';
    
    if (validationRules[name]) {
      if (validationRules[name].required && (!value || (typeof value === 'string' && !value.trim()))) {
        return validationRules[name].required;
      }
      
      // Validación especial para campos 'nombre'
      if (name === 'name' && !/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
        return 'El nombre solo puede contener letras y espacios';
      }
      
      if (validationRules[name].pattern && !validationRules[name].pattern.regex.test(value)) {
        return validationRules[name].pattern.message;
      }
      
      if (validationRules[name].minLength && value.length < validationRules[name].minLength.value) {
        return validationRules[name].minLength.message;
      }
      
      if (validationRules[name].custom && typeof validationRules[name].custom === 'function') {
        const customError = validationRules[name].custom(value, formData);
        if (customError) {
          return customError;
        }
      }
    }
    
    return errorMessage;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let fieldValue = type === 'checkbox' ? checked : value;
    
    // Validación para campos 'nombre': solo texto y primera letra de cada palabra en mayúscula
    if (name === 'name') {
      // Verificar si el valor tiene solo texto (letras y espacios)
      if (/^[A-Za-záéíóúÁÉÍÓÚüÜñÑ\s]*$/.test(value)) {
        // Capitalizar la primera letra de cada palabra
        fieldValue = value.replace(/\b\w/g, (char) => char.toUpperCase());
      } else {
        // Si contiene caracteres no permitidos, mantener el valor anterior sin el último caracter
        fieldValue = value.slice(0, -1);
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: fieldValue
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateAllFields = () => {
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
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    setIsSubmitting(true);
    
    if (validateAllFields()) {
      onSubmit(formData);
    } else {
      setIsSubmitting(false);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

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