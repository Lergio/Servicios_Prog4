import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceDelete = ({ serviceId, onClose, onServiceDeleted }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    duracion_estimada: '',
    disponibilidad_horaria: '',
    id_oferente: null,
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
          `http://181.199.159.26:8010/api/servicios/${serviceId}/`,
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
          id_oferente: response.data.id_oferente,
        });
      } catch (error) {
        console.error('Error al cargar el servicio:', error);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('Token de autenticación no encontrado');
        return;
      }

      await axios.delete(`http://181.199.159.26:8010/api/servicios/${serviceId}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onServiceDeleted(); // Notificar que el servicio ha sido eliminado
      onClose(); // Cerrar la ventana
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Eliminar Servicio</h2>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Título</label>
        <input
          type="text"
          value={formData.titulo}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Descripción</label>
        <textarea
          value={formData.descripcion}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Categoría</label>
        <input
          type="text"
          value={formData.categoria}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Duración Estimada</label>
        <input
          type="text"
          value={formData.duracion_estimada}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-semibold">Disponibilidad Horaria</label>
        <input
          type="text"
          value={formData.disponibilidad_horaria}
          disabled
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div className="mb-6 text-center font-semibold text-red-500">
        ¿Desea borrar este servicio?
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
          type="button"
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Confirmar
        </button>
      </div>
    </div>
  );
};

export default ServiceDelete;
