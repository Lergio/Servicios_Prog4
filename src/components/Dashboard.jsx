import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ServiceForm from './ServiceForm';
import ServiceUpdate from './ServiceUpdate';

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [usernames, setUsernames] = useState({});
  const [editingService, setEditingService] = useState(null); // Estado para el servicio en edición
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [serviceToRequest, setServiceToRequest] = useState(null);
  const [requestComment, setRequestComment] = useState('');
  const [filterTitle, setFilterTitle] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const navigate = useNavigate();

  const categories = [
    '',
    'tecnologia',
    'gastronomia',
    'mantenimiento',
    'salud',
    'maestranza',
    'ocio',
    'gerontologia',
    'venta',
  ];


  // Obtener el id del usuario logeado desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const usuario_id = user.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No se encontró el token de autenticación');
          navigate('/login');
          return;
        }
  
        // Obtener los servicios
        const response = await axios.get('http://181.199.159.26:8000/api/servicios/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: { titulo: filterTitle, categoria: filterCategory },
        });
        
        setServices(response.data);
  
        // Obtener los usuarios que publicaron los servicios
        const usersIds = response.data.map((service) => service.id_oferente);
        const userPromises = usersIds.map((userId) =>
          axios.get(`http://181.199.159.26:8000/api/auth/profile/${userId}/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
        );
  
        // Esperar a que todas las respuestas estén disponibles
        const usersResponses = await Promise.all(userPromises);
        const usersData = usersResponses.reduce((acc, userProfile) => {
          acc[userProfile.data.id] = userProfile.data.username;
          return acc;
        }, {});
  
        setUsernames(usersData);
  
      } catch (error) {
        console.error('Error al obtener los servicios o los perfiles de usuario:', error);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      }
    };
  
    fetchData();
  }, [navigate, filterTitle, filterCategory]);
  
  const handleProfile = () => {
    navigate('/profile');
  };

  const handleRequestPage = () => {
    navigate('/requests');
  };

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

  const handleDelete = (serviceId) => {
    setServiceToDelete(serviceId);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
      await axios.delete(`http://181.199.159.26:8000/api/servicios/${serviceToDelete}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices((prevServices) =>
        prevServices.filter((service) => service.id !== serviceToDelete)
      );
      console.log('Servicio eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar el servicio:', error);
    } finally {
      setServiceToDelete(null);
    }
  };

  const handleRequest = (serviceId) => {
    setServiceToRequest(serviceId);
  };

  const confirmRequest = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }

      const requestBody = {
        comentario: requestComment,
        estado: 'pendiente',
        id_servicio: serviceToRequest,
        id_busqueda: usuario_id,
      };

      console.log(requestBody)

      await axios.post('http://181.199.159.26:8000/api/solicitudes/', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Solicitud enviada con éxito.');
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
    } finally {
      setServiceToRequest(null);
      setRequestComment('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <nav className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={handleProfile}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Perfil
          </button>
          <button
            onClick={handleRequestPage}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
          >  
            Mis Solicitudes
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Salir
          </button>
        </div>
      </nav>

      <div className="p-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">Bienvenido al Dashboard</h1>
        <div className="mb-4 flex space-x-4">
          <input type="text" value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} placeholder="Buscar por título" className="p-2 border rounded w-full" />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="p-2 border rounded">
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat || 'Todas las categorías'}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded mb-8 transition duration-200"
        >
          Ofrecer Servicio
        </button>

        {showForm && (
          <ServiceForm
            onServiceAdded={handleServiceAdded}
            onClose={() => setShowForm(false)}
          />
        )}

        {editingService && (
          <ServiceUpdate
            serviceId={editingService.id}
            onClose={() => setEditingService(null)}
            onServiceUpdated={handleServiceUpdated}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <section
              key={service.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
            >
              <h2 className="text-xl font-bold mb-4 text-gray-800">{service.titulo}</h2>
              <p className="text-gray-700 mb-2">
                <strong>Descripción:</strong> {service.descripcion}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Duración estimada:</strong> {service.duracion_estimada}
              </p>
              <p className="text-gray-700 mb-2">
                <strong>Disponibilidad horaria:</strong> {service.disponibilidad_horaria}
              </p>
              <p className="text-gray-700 mb-2">
               <strong>Publicado por:</strong> {usernames[service.id_oferente] || 'Cargando...'}
              </p>
              <span className="text-sm text-gray-500 block mt-2">
                <strong>Categoría:</strong> {service.categoria}
              </span>
              <div className="flex justify-end mt-4 space-x-2">
                {service.id_oferente === usuario_id ? (
                  <>
                    <button
                      onClick={() => handleEdit(service)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded transition duration-200"
                    >
                      Actualizar
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200"
                    >
                      Borrar
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleRequest(service.id)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded transition duration-200"
                  >
                    Solicitar
                  </button>
                )}
              </div>
            </section>
          ))}
        </div>
      </div>

      {serviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirmar eliminación</h2>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar este servicio?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setServiceToDelete(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

{serviceToRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Crear Solicitud</h2>
            <p className="text-gray-700 mb-4">Por favor, agrega un comentario para esta solicitud:</p>
            <textarea
              value={requestComment}
              onChange={(e) => setRequestComment(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded mb-4"
              placeholder="Escribe un comentario..."
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setServiceToRequest(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
              >
                Cancelar
              </button>
              <button
                onClick={confirmRequest}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
