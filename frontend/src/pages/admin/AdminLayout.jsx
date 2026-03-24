import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminLayout({ children }) {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-mono">Access Denied</div>;
  }

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:flex flex-col shadow-2xl z-10">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-white font-bold tracking-widest text-sm uppercase">ADMIN PANEL</h2>
        </div>
        <nav className="flex-1 px-4 py-6">
          <Link to="/admin" className={`flex items-center gap-3 px-4 py-3 rounded transition-colors mb-2 ${location.pathname === '/admin' ? 'text-white bg-gray-800 border-l-2 border-white' : 'text-gray-400 hover:text-white hover:bg-gray-800 border-l-2 border-transparent hover:border-gray-500'}`}>
             <span className="font-mono text-xs tracking-widest uppercase">Dashboard</span>
          </Link>
          <Link to="/admin/products" className={`flex items-center gap-3 px-4 py-3 rounded transition-colors mb-2 ${location.pathname.includes('/admin/products') ? 'text-white bg-gray-800 border-l-2 border-white' : 'text-gray-400 hover:text-white hover:bg-gray-800 border-l-2 border-transparent hover:border-gray-500'}`}>
            <span className="font-mono text-xs tracking-widest uppercase">Products</span>
          </Link>
          <Link to="/admin/carousels" className={`flex items-center gap-3 px-4 py-3 rounded transition-colors mb-2 ${location.pathname.includes('/admin/carousels') ? 'text-white bg-gray-800 border-l-2 border-white' : 'text-gray-400 hover:text-white hover:bg-gray-800 border-l-2 border-transparent hover:border-gray-500'}`}>
            <span className="font-mono text-xs tracking-widest uppercase">Carousels</span>
          </Link>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {children || <Outlet />}
      </main>
    </div>
  );
}
