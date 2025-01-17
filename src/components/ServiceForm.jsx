import React, { useState } from 'react';
import axios from 'axios';

const ServiceForm = ({ onServiceAdded, onClose }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: '',
    duracion_estimada: '',
    disponibilidad_horaria: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem('user'));
    const userid = user.id;
    try {
      const token = localStorage.getItem('accessToken');
      const id_oferente = userid; // Supongamos que lo guardas al iniciar sesión.

      if (!token || !id_oferente) {
        console.error('Token o ID del oferente no disponible');
        return;
      }

      const response = await axios.post(
        'http://181.199.159.26:8080/api/servicios/',
        { ...formData, id_oferente },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onServiceAdded(response.data);
      onClose(); // Cerrar el formulario después de agregar el servicio
    } catch (error) {
      console.error('Error al agregar el servicio:', error);
    }
  };

  const handleCancel = () => {
    // Si necesitas hacer algo adicional antes de cerrar el formulario, lo puedes hacer aquí
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: '',
      duracion_estimada: '',
      disponibilidad_horaria: '',
    });

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md mb-8">
      <h2 className="text-2xl font-bold mb-4">Ofrecer Servicio</h2>
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
          onClick={handleCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Guardar Servicio
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
