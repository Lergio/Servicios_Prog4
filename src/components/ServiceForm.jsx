import React, { useState } from 'react';
import axios from 'axios';

const ServiceForm = ({ service, onSubmit }) => {
  const [formData, setFormData] = useState(service || {
    titulo: '',
    descripcion: '',
    categoria: '',
    duracion_estimada: '',
    disponibilidad_horaria: '',
    id_oferente: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/servicios', formData);
      onSubmit(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="titulo" placeholder="Title" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <textarea name="descripcion" placeholder="Description" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"></textarea>
          <select name="categoria" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Category</option>
            <option value="category1">Category 1</option>
            <option value="category2">Category 2</option>
            {/* Add more categories as needed */}
          </select>
          <input type="text" name="duracion_estimada" placeholder="Estimated Duration" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="text" name="disponibilidad_horaria" placeholder="Availability" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;