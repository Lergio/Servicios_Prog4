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
  const [calificaciones, setCalificaciones] = useState([]);
//nuevo
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [calificacion, setCalificacion] = useState(1);
  const [comentario, setComentario] = useState("");
//
  // Obtener el id del usuario logeado desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const usuario_id = user.id;
  const usuario_name = user.username;
  //console.log(usuario_name)
  
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
  
      const profileResponse = await axios.get("http://181.199.159.26:8010/api/auth/profile/", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      const usuarioId = profileResponse.data.id;
      setUsuarioId(usuarioId);
  
      // Obtener todos los servicios
      const serviciosResponse = await axios.get("http://181.199.159.26:8010/api/servicios/", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      // Filtrar los servicios que el usuario ha publicado
      const serviciosPublicados = serviciosResponse.data.filter(servicio => servicio.id_oferente === usuarioId);
      const idsServiciosPublicados = serviciosPublicados.map(servicio => servicio.id);
  
      // Obtener todas las solicitudes
      const solicitudesResponse = await axios.get("http://181.199.159.26:8010/api/solicitudes/", {
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
		const [username, serviceTitle, calificaciones] = await Promise.all([
		  fetchUsername(request.id_busqueda, token),
		  fetchServiceTitle(request.id_servicio, token),
		  fetchCalificaciones(request.id_servicio, request.id_busqueda, token), // Obtener calificaciones
		]);

		return {
		  ...request,
		  username,
		  serviceTitle,
		  calificaciones, // Agregar calificaciones a la solicitud
		};
	  })
	);

	const enrichedRequestsRealizadas = await Promise.all(
	  solicitudesRealizadas.map(async (request) => {
		const service = await fetchService(request.id_servicio, token);
		
		if (service) {
		  const [username, serviceTitle, calificaciones] = await Promise.all([
			fetchUsername(service.id_oferente, token),
			fetchServiceTitle(request.id_servicio, token),
			fetchCalificaciones(request.id_servicio, request.id_busqueda, token), // Obtener calificaciones
		  ]);

		  return {
			...request,
			username,
			serviceTitle,
			calificaciones, // Agregar calificaciones a la solicitud
		  };
		}

		return request;
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

//nevo
  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCalificacion(1);
    setComentario("");
  };

  const handleSubmitCalificacion = async (e) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const newCalificacion = {
      calificacion,
      comentario,
      id_servicio: selectedRequest.id_servicio,
      id_busqueda: usuarioId,
    };

    try {
      const token = localStorage.getItem("accessToken");
      await axios.post("http://181.199.159.26:8010/api/calificaciones/", newCalificacion, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Calificación enviada con éxito");
      handleCloseModal();
      fetchRequests(); // Refrescar las solicitudes
    } catch (error) {
      console.error("Error al enviar la calificación:", error);
      alert("Ocurrió un error al enviar la calificación.");
    }
  };
//
	const fetchCalificaciones = async (idServicio, idBusqueda, token) => {
	  try {
		const response = await axios.get(
		  `http://181.199.159.26:8010/api/calificaciones/?id_servicio=${idServicio}&id_busqueda=${idBusqueda}`,
		  { headers: { Authorization: `Bearer ${token}` } }
		);
		return response.data; // Retorna las calificaciones
	  } catch (error) {
		console.error(`Error al obtener calificaciones para el servicio ${idServicio} y búsqueda ${idBusqueda}:`, error);
		return []; // Retorna un array vacío en caso de error
	  }
	};

	// Nueva función para obtener el servicio
	const fetchService = async (serviceId, token) => {
	  try {
		const response = await axios.get(
		  `http://181.199.159.26:8010/api/servicios/${serviceId}/`,
		  { headers: { Authorization: `Bearer ${token}` } }
		);
		return response.data; // Retorna el objeto del servicio completo
	  } catch (error) {
		console.error(`Error al obtener el servicio ${serviceId}:`, error);
		return null; // Manejo de error
	  }
	};

  const fetchUsername = async (userId, token) => {
    try {
      if (userId === usuarioId) {
        const profileResponse = await axios.get("http://181.199.159.26:8010/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        return profileResponse.data.username || "Desconocido";
      }
  
      // Hacer la solicitud al endpoint para obtener el username de otro usuario
      const userResponse = await axios.get(`http://181.199.159.26:8010/api/auth/profile/${userId}/`, {
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
        `http://181.199.159.26:8010/api/servicios/${serviceId}/`,
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
        `http://181.199.159.26:8010/api/solicitudes/${id}/`,
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
        <h1 className="text-2xl font-bold">Dashboard. Hola { usuario_name }</h1>
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
                      {request.estado !== "rechazada" && request.calificaciones.length > 0 ? (
					  <div className="mt-4">
						<h4 className="font-semibold">Calificaciones:</h4>
						{request.calificaciones.map(calificacion => (
						  <p key={calificacion.id} className="text-gray-600">
							{calificacion.calificacion} - {calificacion.comentario}
						  </p>
						))}
					  </div>
					) : (
					  <p className="text-gray-500">No hay calificaciones para este servicio.</p>
					)}
                      <div className="mt-4 flex space-x-4">
                        {request.estado === "pendiente" ? (
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.id, "aceptada")}
                              className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                            >
                              Aceptar
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, "rechazada")}
                              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            >
                              Rechazar
                            </button>
                          </>
                        ) : (
                          <span className="italic text-gray-500">Solicitud {request.estado}</span>
                        )}
                      </div>
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
                          {/* Mostrar calificaciones solo si la solicitud no ha sido rechazada */}
						{request.estado !== "rechazada" && request.calificaciones.length > 0 ? (
						  <div className="mt-4">
							<h4 className="font-semibold">Calificaciones:</h4>
							{request.calificaciones.map(calificacion => (
							  <p key={calificacion.id} className="text-gray-600">
								{calificacion.calificacion} - {calificacion.comentario}
							  </p>
							))}
						  </div>
						) : (
						  request.estado === "rechazada" && (
							<p className="text-gray-500">La solicitud ha sido rechazada, no hay calificaciones disponibles.</p>
						  )
						)}
                      <p className="text-sm text-gray-500 mt-4">Estado: {request.estado}</p>
                                          {/* Botón para abrir la modal de calificación */}
                    {request.estado !== "pendiente" && request.estado !== "rechazada" && request.calificaciones.length === 0 && (
                      <button
                        onClick={() => handleOpenModal(request)}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
                      >
                        Calificar
                      </button>
                    )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
       {/* Modal para calificar */}
    {modalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">Calificar Servicio</h2>
          <form onSubmit={handleSubmitCalificacion}>
            <div className="mb-4">
              <label className="block text-gray-700">Calificación:</label>
              <select
                value={calificacion}
                onChange={(e) => setCalificacion(Number(e.target.value))}
                className="border rounded w-full py-2 px-3"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Comentario:</label>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="border rounded w-full py-2 px-3"
                rows="3"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCloseModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-4 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
              >
                Enviar
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default RequestsPage;