import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Service Platform</h1>
        <p className="text-gray-600 mb-6">Please register or login to continue.</p>
        <a href="/register" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mr-2">Register</a>
        <a href="/login" className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Login</a>
      </div>
    </div>
  );
};

export default Home;