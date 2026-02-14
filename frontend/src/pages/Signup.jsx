import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Get the base URL and fix potential trailing slash issues
    let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (API_URL.endsWith('/')) {
      API_URL = API_URL.slice(0, -1);
    }

    try {
      // 2. This will now always result in a clean /api/signup path
      await axios.post(`${API_URL}/api/signup`, formData);
      alert("Account created! You can now login.");
      navigate('/login');
    } catch (err) {
      console.error("Signup Error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating account");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-gray-800 p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-white">Create Account</h2>
        <p className="text-center text-gray-400 pb-2">Join us to manage your profile</p>
        
        <input type="text" placeholder="Full Name" className="w-full rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={e => setFormData({...formData, name: e.target.value})} required />
        
        <input type="email" placeholder="Email" className="w-full rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={e => setFormData({...formData, email: e.target.value})} required />
        
        <input type="password" placeholder="Password" className="w-full rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-blue-500" 
          onChange={e => setFormData({...formData, password: e.target.value})} required />
        
        <select className="w-full rounded bg-gray-700 p-3 text-white outline-none cursor-pointer focus:ring-2 focus:ring-blue-500" 
          onChange={e => setFormData({...formData, role: e.target.value})}>
          <option value="user">Standard User</option>
          <option value="admin">Administrator</option>
        </select>
        
        <button className="w-full rounded bg-blue-600 p-3 font-bold text-white hover:bg-blue-500 transition text-lg shadow-lg">
          Register
        </button>
        
        <p className="text-center text-gray-400">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline font-medium">Login</Link>
        </p>
      </form>
    </div>
  );
}