import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceUpdate = ({ serviceId, onClose, onServiceUpdated }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    duracion_estimada: '',
    disponibilidad_horaria: '',
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('Token de autenticación no encontrado');
          return;
        }

        const response = await axios.get(
          `http://181.199.159.26:8080/api/servicios/${serviceId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setFormData({
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          categoria: response.data.categoria,
          duracion_estimada: response.data.duracion_estimada,
          disponibilidad_horaria: response.data.disponibilidad_horaria,
        });
      } catch (error) {
        console.error('Error al cargar el servicio:', error);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Token de autenticación no encontrado');
        return;
      }

      const response = await axios.put(
        `http://181.199.159.26:8080/api/servicios/${serviceId}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onServiceUpdated(response.data); // Notificar que el servicio ha sido actualizado
      onClose(); // Cerrar la ventana
    } catch (error) {
      console.error('Error al actualizar el servicio:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Actualizar Servicio</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Título</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={handleChange}
          required
          maxLength="255"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Descripción</label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Categoría</label>
        <select
          name="categoria"
          value={formData.categoria}
          onChange={handleChange}
          required
          className="w-full p-2 border rounded"
        >
          <option value="">Selecciona una categoría</option>
          <option value="tecnologia">Tecnología</option>
          <option value="gastronomia">Gastronomía</option>
          <option value="mantenimiento">Mantenimiento</option>
          <option value="salud">Salud</option>
          <option value="maestranza">Maestranza</option>
          <option value="ocio">Ocio</option>
          <option value="gerontologia">Gerontología</option>
          <option value="venta">Venta</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Duración Estimada</label>
        <input
          type="text"
          name="duracion_estimada"
          value={formData.duracion_estimada}
          onChange={handleChange}
          required
          maxLength="50"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Disponibilidad Horaria</label>
        <input
          type="text"
          name="disponibilidad_horaria"
          value={formData.disponibilidad_horaria}
          onChange={handleChange}
          required
          maxLength="255"
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );
};

export default ServiceUpdate;
