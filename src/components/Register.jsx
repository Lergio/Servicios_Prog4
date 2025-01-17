import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://181.199.159.26:8080/api/auth/register/', formData);
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      console.log(response.data);

      // Redirigir al login después del registro exitoso
      navigate('/login');
    } catch (error) {
      console.error('Error al registrar usuario:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-white text-gray-800 p-4 flex justify-center z-10">
        <Link to="/" className="text-xl font-bold hover:underline">
          Inicio
        </Link>
      </nav>

      {/* Register Form */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md mt-24">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Crear Cuenta</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Correo Electrónico"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="first_name"
              placeholder="Nombre"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="last_name"
              placeholder="Apellido"
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          {/* Registro */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Registrarme
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
