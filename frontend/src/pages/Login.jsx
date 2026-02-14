import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Get the base URL and fix potential trailing slash issues
    let API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    if (API_URL.endsWith('/')) {
      API_URL = API_URL.slice(0, -1);
    }

    console.log("Attempting to connect to:", `${API_URL}/api/login`);

    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      
      // If successful, save user and move to dashboard
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error("Login Error details:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Login failed. Check console for details.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-gray-800 p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
        <p className="text-center text-gray-400 pb-2">Enter your credentials to access your account</p>
        
        <input 
          type="email" 
          placeholder="Email Address" 
          className="w-full rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition" 
          onChange={e => setEmail(e.target.value)} 
          required 
        />
        
        <input 
          type="password" 
          placeholder="Password" 
          className="w-full rounded bg-gray-700 p-3 text-white outline-none focus:ring-2 focus:ring-green-500 transition" 
          onChange={e => setPassword(e.target.value)} 
          required 
        />
        
        <button 
          type="submit" 
          className="w-full rounded bg-green-600 p-3 font-bold text-white hover:bg-green-500 transition text-lg shadow-lg"
        >
          Login
        </button>
        
        <p className="text-center text-gray-400">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline font-medium">Create account</Link>
        </p>
      </form>
    </div>
  );
}