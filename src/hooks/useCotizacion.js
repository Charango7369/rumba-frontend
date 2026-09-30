import { useState } from 'react';
import { validarFormularioCotizacion } from '../utils/validaciones';
import { generarCotizacion } from '../services/api';

export const useCotizacion = () => {
  const [formData, setFormData] = useState({
    nombre: '', telefono: '', ciudad: '', fecha: '',
    tipo_evento: '', invitados: 100, paquete: 'premium', extras: []
  });

  const [erroresValidacion, setErroresValidacion] = useState({});
  const [estadoCotizacion, setEstadoCotizacion] = useState({
    cargando: false, resultado: null, errorServidor: null
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
    if (erroresValidacion[name]) {
      setErroresValidacion(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const nuevosExtras = checked
        ? [...prev.extras, value]
        : prev.extras.filter(extra => extra !== value);
      return { ...prev, extras: nuevosExtras };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errores = validarFormularioCotizacion(formData);
    if (Object.keys(errores).length > 0) {
      setErroresValidacion(errores);
      return;
    }

    setEstadoCotizacion({ cargando: true, resultado: null, errorServidor: null });
    try {
      const data = await generarCotizacion(formData);
      setEstadoCotizacion({ cargando: false, resultado: data, errorServidor: null });
    } catch (err) {
      setEstadoCotizacion({ cargando: false, resultado: null, errorServidor: err.message });
    }
  };

  const resetFormulario = () => {
    setEstadoCotizacion({ cargando: false, resultado: null, errorServidor: null });
  };

  return {
    formData, erroresValidacion, estadoCotizacion,
    handleChange, handleCheckboxChange, handleSubmit, resetFormulario
  };
};