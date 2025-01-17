import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate(); // Hook para redirigir
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://181.199.159.26:8080/api/auth/login/', formData);
      const { access, refresh, user } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user)); // Guarda el objeto `user` como string
      
      console.log(response.data);

      // Redirigir al dashboard si el login es exitoso
      navigate('/dashboard');
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
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

      {/* Login Form */}
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm mt-24">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">Hola de nuevo!</h2> 
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
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ease-in-out"
            />
          </div>
          {/* Registro */}
          <p className="text-sm text-center text-gray-600">
            Si no tienes cuenta, puedes{' '}
            <Link to="/register" className="text-blue-600 font-bold hover:underline">
              registrarte aquí
            </Link>.
          </p>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
