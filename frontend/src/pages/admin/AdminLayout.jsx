import React, { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="pt-20 min-h-screen bg-black flex">
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-white font-bold tracking-widest">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 font-mono text-sm">
          <Link to="/admin/products" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded">Products</Link>
          <Link to="/admin/orders" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded">Orders</Link>
          <Link to="/admin/carousels" className="block px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded">Carousels</Link>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
