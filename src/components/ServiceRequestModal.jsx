import React from 'react';

const ServiceRequestModal = ({
  serviceToRequest,
  requestComment,
  setRequestComment,
  confirmRequest,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Crear Solicitud</h2>
        <textarea
          value={requestComment}
          onChange={(e) => setRequestComment(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          placeholder="Escribe un comentario para tu solicitud..."
          rows="4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={confirmRequest}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestModal;
