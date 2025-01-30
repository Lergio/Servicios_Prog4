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

      const serviciosResponse = await axios.get("http://181.199.159.26:8000/api/servicios/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const serviciosPublicados = serviciosResponse.data.filter(servicio => servicio.id_oferente === usuarioId);
      const idsServiciosPublicados = serviciosPublicados.map(servicio => servicio.id);

      const solicitudesResponse = await axios.get("http://181.199.159.26:8000/api/solicitudes/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const solicitudesFiltradas = solicitudesResponse.data.filter(solicitud =>
        idsServiciosPublicados.includes(solicitud.id_servicio)
      );

      const enrichedRequests = await Promise.all(
        solicitudesFiltradas.map(async (request) => {
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

      setRequests(enrichedRequests);
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
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-gray-700">
            <Inbox className="w-10 h-10 text-gray-400" />
            <p className="mt-2 text-lg font-semibold">No hay solicitudes pendientes</p>
            <p className="text-sm text-gray-500">Aquí aparecerán cuando alguien solicite tus servicios.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {requests.map((request) => (
              <section
                key={request.id}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out"
              >
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                  <p className="text-gray-700 mb-2">
                    <strong>{request.serviceTitle}</strong>
                  </p>
                </h2>
                <p className="text-gray-700 mb-2">
                  <strong>Comentario:</strong> {request.comentario}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Estado:</strong> {request.estado}
                </p>
                <p className="text-gray-700 mb-2">
                  <strong>Solicitante:</strong> {request.username}
                </p>
                <div className="flex justify-end mt-4 space-x-2">
                  {request.estado === "pendiente" ? (
                    <>
                      <button
                        onClick={() => updateRequestStatus(request.id, "aceptada")}
                        className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition duration-200"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => updateRequestStatus(request.id, "rechazada")}
                        className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition duration-200"
                      >
                        Rechazar
                      </button>
                    </>
                  ) : (
                    <span className="italic text-gray-500">Solicitud {request.estado}</span>
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default RequestsPage;
