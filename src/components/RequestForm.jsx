import React, { useState } from 'react';
import axios from 'axios';

const RequestForm = ({ request, onSubmit }) => {
  const [formData, setFormData] = useState(request || {
    comentario: '',
    estado: '',
    id_servicio: '',
    id_busqueda: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/solicitudes', formData);
      onSubmit(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea name="comentario" placeholder="Comment" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded"></textarea>
          <select name="estado" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select State</option>
            <option value="state1">State 1</option>
            <option value="state2">State 2</option>
            <option value="state3">State 3</option>
          </select>
          <input type="number" name="id_servicio" placeholder="Service ID" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="number" name="id_busqueda" placeholder="Seeker ID" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;