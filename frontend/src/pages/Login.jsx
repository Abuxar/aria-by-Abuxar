import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    if (!useAuthStore.getState().error && useAuthStore.getState().user) {
      navigate('/');
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-dark">
      <div className="max-w-md w-full p-8 bg-gray-900 border border-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold font-sans tracking-widest text-white mb-6 text-center">LOGIN</h2>
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Email</label>
            <input 
              type="email" 
              required
              className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500"
              value={email} onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div>
            <div className="flex justify-between w-full">
              <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Password</label>
              <a href="#" className="text-gray-500 text-xs hover:text-white transition-colors">Forgot?</a>
            </div>
            <input 
              type="password" 
              required
              className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500"
              value={password} onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-3 mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50 tracking-widest uppercase"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/register" className="text-white hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
