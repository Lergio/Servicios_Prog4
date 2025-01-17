import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    rol: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('accessToken');

        if (!token) {
          console.error('Authentication token not found');
          navigate('/login');
          return;
        }
        const response = await axios.get('http://181.199.159.26:8080/api/auth/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error getting profile data:', error);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.patch('http://181.199.159.26:8080/api/auth/profile/', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setProfile(response.data);
      setIsEditing(false);
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete('http://181.199.159.26:8080/api/auth/profile/', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Account deleted successfully');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile);
  };

  const handleDeleteConfirmation = () => {
    setIsDeleting(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleting(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Perfil {profile.username}</h2>
        {isDeleting ? (
          <div className="text-center mb-6">
            <p>¿Estás seguro de que quieres eliminar tu cuenta?</p>
            <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded hover:bg-red-600 mr-2">Yes</button>
            <button onClick={handleDeleteCancel} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">No</button>
          </div>
        ) : (
          <>
            {isEditing ? (
              <form className="space-y-4">
                <input type="text" name="username" placeholder="Nombre Usuario" value={formData.username} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" name="first_name" placeholder="Nombre" value={formData.first_name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                <input type="text" name="last_name" placeholder="Apellido" value={formData.last_name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
                <input type="hidden" name="rol" value={formData.rol} onChange={handleChange} placeholder='Role' required className="w-full p-2 border border-gray-300 rounded"/>
                <div className="flex justify-between">
                  <button type="button" onClick={handleUpdate} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update</button>
                  <button type="button" onClick={handleCancel} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <p><strong>Nombre de Usuario:</strong> {profile.username}</p>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>Nombre:</strong> {profile.first_name}</p>
                <p><strong>Apellido:</strong> {profile.last_name}</p>
                <p hidden><strong>Role:</strong> {profile.rol}</p>
                <div className="flex justify-between">
                  <button onClick={handleEdit} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={handleDeleteConfirmation} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete Account</button>
                </div>
              </div>
            )}
            <button onClick={() => navigate('/dashboard')} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-4">Go to Dashboard</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;