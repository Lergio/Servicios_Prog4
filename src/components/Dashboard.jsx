import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceForm from './ServiceForm';
import ServiceUpdate from './ServiceUpdate';

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null); // Estado para el servicio en edición
  const navigate = useNavigate();

  // Obtener el id del usuario logeado desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const loggedInUserId = user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          console.error('No se encontró el token de autenticación');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://181.199.159.26:8080/api/servicios', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setServices(response.data);
      } catch (error) {
        console.error('Error al obtener los servicios:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      }
    };

    fetchData();
  }, [navigate]);

  const handleProfile = () => {
    navigate('/profile');
  }

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleServiceAdded = (newService) => {
    setServices((prevServices) => [newService, ...prevServices]);
    setShowForm(false);
  };

  const handleServiceUpdated = (updatedService) => {
    setServices((prevServices) =>
      prevServices.map((service) =>
        service.id === updatedService.id ? updatedService : service
      )
    );
    setEditingService(null);
  };

  const handleEdit = (service) => {
    setEditingService(service);
  };

  const handleRequest = (serviceId) => {
    // Aquí iría la lógica para solicitar un servicio.
    console.log(`Solicitando servicio con ID: ${serviceId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>
        <button
          onClick={handleProfile}
          className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Profile
        </button>
      </nav>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Bienvenido al Dashboard</h1>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-8"
        >
          Ofrecer Servicio
        </button>

        {showForm && <ServiceForm onServiceAdded={handleServiceAdded} />}

        {editingService && (
          <ServiceUpdate
            serviceId={editingService.id}
            onClose={() => setEditingService(null)}
            onServiceUpdated={handleServiceUpdated}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <section key={service.id} className="bg-white p-6 rounded shadow-md">
              <h2 className="text-xl font-bold mb-4">{service.titulo}</h2>
              <p>{service.descripcion}</p>
              <span className="text-sm text-gray-500">{service.categoria}</span>
              <div className="flex justify-end mt-4 space-x-2">
                {service.id_oferente === loggedInUserId ? (
                  <>
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => console.log(`Borrar servicio con ID: ${service.id}`)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    >
                      Borrar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRequest(service.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded"
                  >
                    Solicitar
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
