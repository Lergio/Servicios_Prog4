import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2, AlertTriangle, Inbox } from "lucide-react";

const RequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [usuarioId, setUsuarioId] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      const profileResponse = await axios.get("http://181.199.159.26:8000/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const usuarioId = profileResponse.data.id;
      setUsuarioId(usuarioId);

      // Obtener todos los servicios
      const serviciosResponse = await axios.get("http://181.199.159.26:8000/api/servicios/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtrar los servicios que el usuario ha publicado
      const serviciosPublicados = serviciosResponse.data.filter(servicio => servicio.id_oferente === usuarioId);
      const idsServiciosPublicados = serviciosPublicados.map(servicio => servicio.id);

      // Obtener todas las solicitudes
      const solicitudesResponse = await axios.get("http://181.199.159.26:8000/api/solicitudes/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtrar las solicitudes en dos tipos:
      const solicitudesRecibidas = solicitudesResponse.data.filter(solicitud =>
        idsServiciosPublicados.includes(solicitud.id_servicio) // Recibidas: el usuario ofrece el servicio
      );

      const solicitudesRealizadas = solicitudesResponse.data.filter(solicitud =>
        solicitud.id_busqueda === usuarioId // Realizadas: el usuario es el que hace la solicitud
      );

      // Enriquecer las solicitudes con el nombre de usuario y el título del servicio
      const enrichedRequestsRecibidas = await Promise.all(
        solicitudesRecibidas.map(async (request) => {
          const [username, serviceTitle] = await Promise.all([
            fetchUsername(request.id_busqueda, token),
            fetchServiceTitle(request.id_servicio, token),
          ]);

          return {
            ...request,
            username,
            serviceTitle,
          };
        })
      );

      const enrichedRequestsRealizadas = await Promise.all(
        solicitudesRealizadas.map(async (request) => {
          const [username, serviceTitle] = await Promise.all([
            fetchUsername(request.id_busqueda, token),
            fetchServiceTitle(request.id_servicio, token),
          ]);

          return {
            ...request,
            username,
            serviceTitle,
          };
        })
      );

      // Guardar las solicitudes separadas en el estado
      setRequests({ recibidas: enrichedRequestsRecibidas, realizadas: enrichedRequestsRealizadas });

    } catch (error) {
      console.error("Error al obtener las solicitudes:", error);
      setError("Ocurrió un error al cargar las solicitudes.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsername = async (userId, token) => {
    try {
      if (userId === usuarioId) {
        const profileResponse = await axios.get("http://181.199.159.26:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return profileResponse.data.username || "Desconocido";
      }

      // Hacer la solicitud al endpoint para obtener el username de otro usuario
      const userResponse = await axios.get(`http://181.199.159.26:8000/api/auth/profile/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return userResponse.data.username || "Desconocido"; // Retornar el username o un valor por defecto
    } catch (error) {
      console.error(`Error al obtener el username del usuario ${userId}:`, error);
      return "Desconocido"; // Valor por defecto en caso de error
    }
  };


  const fetchServiceTitle = async (serviceId, token) => {
    try {
      const response = await axios.get(
        `http://181.199.159.26:8000/api/servicios/${serviceId}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data.titulo;
    } catch (error) {
      console.error(`Error al obtener el título del servicio ${serviceId}:`, error);
      return "Servicio desconocido";
    }
  };

  const updateRequestStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No se encontró el token de autenticación");
        return;
      }

      await axios.patch(
        `http://181.199.159.26:8000/api/solicitudes/${id}/`,
        { estado: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(`La solicitud ha sido ${newStatus}`);
      fetchRequests();
    } catch (error) {
      console.error(`Error al actualizar la solicitud ${id}:`, error);
      // alert("Ocurrió un error al actualizar la solicitud.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <nav className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate("/profile")}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Perfil
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Inicio
          </button>
          <button
            onClick={() => navigate("/login")}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition duration-200"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="flex-grow p-6 bg-transparent-100">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-700">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            <p className="mt-2 text-lg font-semibold">Cargando solicitudes...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-10 text-red-500">
            <AlertTriangle className="w-10 h-10" />
            <p className="mt-2 text-lg font-semibold">Ocurrió un error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : (
          <>
            {/* Solicitudes Recibidas */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-white">Solicitudes Recibidas</h2>
              {requests.recibidas.length === 0 ? (
                <p className="text-gray-300 mt-4">Aquí aparecerán cuando alguien solicite tus servicios.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {requests.recibidas.map((request) => (
                    <div key={request.id} className="bg-white p-6 rounded-lg shadow-lg">
                      <h3 className="text-lg font-bold text-gray-800">{request.serviceTitle}</h3>
                      <p className="text-gray-700 mb-4">Solicitado por: {request.username}</p>
                      <p className="text-gray-500 text-sm">{request.comentario}</p>

                      {/* Mostrar botones de Aceptar y Rechazar solo si la solicitud está pendiente */}
                      {request.estado === "pendiente" && (
                        <div className="mt-4 flex space-x-4">
                          <button
                            onClick={() => updateRequestStatus(request.id, "aceptada")}
                            className="bg-green-500 text-white py-2 px-4 rounded"
                          >
                            Aceptar
                          </button>
                          <button
                            onClick={() => updateRequestStatus(request.id, "rechazada")}
                            className="bg-red-500 text-white py-2 px-4 rounded"
                          >
                            Rechazar
                          </button>
                        </div>
                      )}

                      {/* Si la solicitud fue aceptada, mostrar mensaje de calificación pendiente */}
                      {request.estado === "aceptada" && !request.calificacion && (
                        <div className="mt-4 text-gray-600">
                          <p><strong>Este servicio ha sido aceptado, pero aún {request.username} no calificó tu trabajo.</strong></p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
            {/* Solicitudes Realizadas */}
            <section>
              <h2 className="text-2xl font-semibold text-white">Solicitudes Realizadas</h2>
              {requests.realizadas.length === 0 ? (
                <p className="text-gray-300 mt-4">Aquí aparecerán cuando solicites un servicio.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {requests.realizadas.map((request) => (
                    <div key={request.id} className="bg-white p-6 rounded-lg shadow-lg">
                      <h3 className="text-lg font-bold text-gray-800">{request.serviceTitle}</h3>
                      <p className="text-gray-700 mb-4">Solicitado a: {request.username}</p>
                      <p className="text-gray-500 text-sm">{request.comentario}</p>
                      <p className="text-sm text-gray-500 mt-4">Estado: {request.estado}</p>

                      {/* Mostrar botón para calificar si el servicio ha sido aceptado */}
                      {request.estado === "aceptada" && !request.calificacion && (
                        <div className="mt-4">
                          <button
                            onClick={() => navigate("/ratings", { state: { id_servicio: request.id_servicio } })} // Pasamos el id_servicio en el estado
                            className="bg-yellow-500 text-white py-2 px-4 rounded"
                          >
                            Calificar Trabajo
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default RequestsPage;