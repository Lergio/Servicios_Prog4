import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '' ,
    email: '',
    first_name: '',
    last_name: '',
    password:''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://181.199.159.26:8080/api/auth/register/', formData);
      console.log(response.data);
      navigate('/profile');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="username" placeholder="Name" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="text" name="first_name" placeholder="First_name" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          <input type="text" name="last_name" placeholder="Last_name" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded" />
          {/* <select name="rol" onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded">
            <option value="">Select Role</option>
            <option value="role1">Provider</option>
            <option value="role2">Seeker</option>
            <option value="role3">Both</option>
          </select> */}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;