import React from 'react';
import { User, Lock, DollarSign } from 'lucide-react'; // Importar los íconos de lucide-react

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-2xl w-full max-w-lg text-center">
        <h1 className="text-4xl font-extrabold mb-6 text-gray-800">Bienvenido a la Plataforma de Servicios!</h1>
        <p className="text-lg text-gray-600 mb-8">Por favor, Ingresa o Registrate para continuar.</p>
        <div className="flex justify-center space-x-4">
          <a href="/register" className="flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out transform hover:scale-105">
            <User className="mr-2" /> Registrarme
          </a>
          <a href="/login" className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-200 ease-in-out transform hover:scale-105">
            <Lock className="mr-2" /> Ingresar
          </a>
        </div>
      </div>
    </div>
  );
};

export default Home;
