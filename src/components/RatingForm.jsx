import React, { useState } from 'react';
import axios from 'axios';

const RatingForm = ({ rating, onSubmit }) => {
  const [formData, setFormData] = useState(rating || {
    calificacion: '',
    comentario: '',
    id_servicio: '',
    id_busqueda: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/calificaciones', formData);
      onSubmit(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Rating</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select name="calificacion" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Rating</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <textarea name="comentario" placeholder="Comment" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"></textarea>
          <input type="number" name="id_servicio" placeholder="Service ID" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="number" name="id_busqueda" placeholder="Seeker ID" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;