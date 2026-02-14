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
    // Dynamically pick the URL based on the environment
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    try {
      const res = await axios.post(`${API_URL}/api/login`, { email, password });
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4 rounded-xl bg-gray-800 p-8 shadow-2xl">
        <h2 className="text-center text-3xl font-bold text-white">Welcome Back</h2>
        <input type="email" placeholder="Email" className="w-full rounded bg-gray-700 p-3 text-white outline-none" 
          onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="w-full rounded bg-gray-700 p-3 text-white outline-none" 
          onChange={e => setPassword(e.target.value)} required />
        <button className="w-full rounded bg-green-600 p-3 font-bold text-white hover:bg-green-500 transition text-lg">Login</button>
        <p className="text-center text-gray-400">New? <Link to="/signup" className="text-blue-400 font-medium">Create account</Link></p>
      </form>
    </div>
  );
}