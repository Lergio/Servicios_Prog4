import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtén el token del localStorage
        const token = localStorage.getItem('accessToken');

        if (!token) {
          console.error('No se encontró el token de autenticación');
          return;
        }

        // Realiza la solicitud GET con el token en los headers
        const response = await axios.get('http://192.168.100.52:8000/api/servicios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Actualiza el estado con los datos obtenidos
        setServices(response.data);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Últimos Servicios</h2>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service.id} className="border-b pb-2">
                <h3 className="font-semibold">{service.titulo}</h3>
                <p>{service.descripcion}</p>
                <span className="text-sm text-gray-500">{service.categoria}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
