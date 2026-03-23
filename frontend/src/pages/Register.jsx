import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', phone: '' });
  const { register, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(formData.name, formData.email, formData.password, formData.phone);
    if (!useAuthStore.getState().error && useAuthStore.getState().user) {
      navigate('/');
    }
  };

  return (
    <div className="pt-20 min-h-screen flex items-center justify-center bg-dark py-12">
      <div className="max-w-md w-full p-8 bg-gray-900 border border-gray-800 rounded-lg">
        <h2 className="text-3xl font-bold font-sans tracking-widest text-white mb-6 text-center">REGISTER</h2>
        {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Full Name</label>
            <input type="text" name="name" required className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500" value={formData.name} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Email</label>
            <input type="email" name="email" required className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Phone <span className="text-gray-600">(Optional)</span></label>
            <input type="tel" name="phone" className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500" value={formData.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-1">Password</label>
            <input type="password" name="password" required className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500" value={formData.password} onChange={handleChange} />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-white text-black font-bold py-3 mt-4 hover:bg-gray-200 transition-colors disabled:opacity-50 tracking-widest uppercase">
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="text-white hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}
