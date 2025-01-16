import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    contraseña: '',
    rol: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/user'); // Assuming you have an endpoint to get the current user's data
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/user', formData); // Assuming you have an endpoint to update the user's data
      setUser(response.data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handlePartialUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch('/api/user', formData); // Assuming you have an endpoint to partially update the user's data
      setUser(response.data);
      alert('Profile partially updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('/api/user'); // Assuming you have an endpoint to delete the user's account
      alert('Account deleted successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <form className="space-y-4">
          <input type="text" name="nombre" placeholder="Name" value={formData.nombre} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="password" name="contraseña" placeholder="Password" value={formData.contraseña} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <select name="rol" value={formData.rol} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Role</option>
            <option value="role1">Provider</option>
            <option value="role2">Seeker</option>
            <option value="role3">Both</option>
          </select>
          <div className="flex space-x-2">
            <button type="button" onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update</button>
            <button type="button" onClick={handlePartialUpdate} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Partial Update</button>
          </div>
          <button type="button" onClick={handleDelete} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete Account</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;