import React, { useState, useEffect } from "react";
import axios from "axios";

const RatingsPage = ({ isModalOpen, closeModal, request }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState("");
  const [loading, setLoading] = useState(false);
  const [usuarioId, setUsuarioId] = useState(null);
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (token) {
      const fetchUserProfile = async () => {
        try {
          const profileResponse = await axios.get("http://181.199.159.26:8010/api/auth/profile/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUsuarioId(profileResponse.data.id); 
        } catch (error) {
          console.error("Error al obtener el perfil del usuario:", error);
        }
      };
      
      fetchUserProfile();
    } else {
      console.error("No se encontró el token de autenticación.");
    }
  }, [token]);

  const handleStarClick = (rating) => {
    setCalificacion(rating);
  };

  const handleSubmit = async () => {
    if (!calificacion || !comentario) {
      alert("Por favor, califica y agrega un comentario.");
      return;
    }

    setLoading(true);

    try {
      if (usuarioId) {
        await axios.post(
          "http://181.199.159.26:8010/api/calificaciones/",
          {
            calificacion,
            comentario,
            id_servicio: request.id_servicio,  // Usamos el id_servicio pasado desde el request
            id_busqueda: usuarioId,  // El usuarioId sigue siendo relevante
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Calificación enviada con éxito!");
        closeModal();  // Cerrar el modal después de enviar la calificación
      } else {
        console.error("No se ha podido obtener el id del usuario.");
      }
    } catch (error) {
      console.error("Error al calificar:", error);
      alert("Ocurrió un error al enviar la calificación.");
    } finally {
      setLoading(false);
    }
  };

  if (!isModalOpen) return null; // No renderizamos el modal si está cerrado

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="p-6 bg-white rounded shadow-md">
        <h2 className="text-xl font-bold">Calificar Trabajo Realizado</h2>

        <div className="mt-4">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`cursor-pointer ${index < calificacion ? "text-yellow-500" : "text-gray-400"}`}
              onClick={() => handleStarClick(index + 1)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          className="w-full mt-4 p-2 border border-gray-300 rounded"
          placeholder="Deja tu comentario"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        ></textarea>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleSubmit}
            className="bg-green-500 text-white py-2 px-4 rounded"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Confirmar"}
          </button>
          <button
            onClick={closeModal}
            className="bg-gray-500 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default RatingsPage;