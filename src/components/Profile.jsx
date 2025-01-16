import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    username:'',
    email:'',
    first_name:'',
    last_name:'',
    password:'',
    rol:''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the localStorage token
        const token = localStorage.getItem('accessToken');

        if (!token) {
          console.error('Authentication token not found');
          navigate('/login'); // Redirect if there is no token
          return;
        }

        // Make the GET request with the token in the headers
        const response = await axios.get('http://181.199.159.26:8080/api/auth/profile/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Update the state with the data obtained
        setUser(response.data);
        setFormData(response.data);
      } catch (error) {
        console.error('Error getting user data:', error);

        // If the token is invalid or expired, redirect to the login
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
      const response = await axios.put('http://192.168.100.52:8000/api/user', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.delete('http://192.168.100.52:8000/api/user', {
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Profile</h2>
        <p className="text-center mb-6">Welcome, {user.rol}</p>
        <form className="space-y-4">
          <input type="text" name="username" placeholder="Name" value={formData.nombre} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="text" name="first_name" placeholder="First_name" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="text" name="last_name" placeholder="Last_name" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="password" name="password" placeholder="Password" value={formData.email} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <select name="rol" value={user.rol} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Role</option>
            <option value="role1">Provider</option>
            <option value="role2">Seeker</option>
            <option value="role3">Both</option>
          </select>
          <button type="button" onClick={handleUpdate} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Update</button>
          <button type="button" onClick={handleDelete} className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete Account</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;