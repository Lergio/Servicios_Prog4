import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [ratings, setRatings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesResponse = await axios.get('/api/servicios');
        setServices(servicesResponse.data);

        const requestsResponse = await axios.get('/api/solicitudes');
        setRequests(requestsResponse.data);

        const ratingsResponse = await axios.get('/api/calificaciones');
        setRatings(ratingsResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Services</h2>
          <ul className="space-y-2">
            {services.map(service => (
              <li key={service.id} className="border-b pb-2">{service.titulo}</li>
            ))}
          </ul>
        </section>
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Requests</h2>
          <ul className="space-y-2">
            {requests.map(request => (
              <li key={request.id} className="border-b pb-2">{request.comentario}</li>
            ))}
          </ul>
        </section>
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Ratings</h2>
          <ul className="space-y-2">
            {ratings.map(rating => (
              <li key={rating.id} className="border-b pb-2">{rating.comentario}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;