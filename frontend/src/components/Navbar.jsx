import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Group */}
          <div className="flex shrink-0 items-center">
            <Link to="/" className="text-2xl font-sans font-bold text-white tracking-[0.2em] select-none cursor-pointer">
              ARIA
            </Link>
          </div>
          
          {/* Center Navigation */}
          <div className="hidden md:flex space-x-10 absolute left-1/2 transform -translate-x-1/2">
            <Link to="#" className="text-gray-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-[0.1em]">Products</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-[0.1em]">Explore</Link>
            <Link to="#" className="text-gray-400 hover:text-white transition-colors text-xs font-mono uppercase tracking-[0.1em]">Information</Link>
          </div>
          
          {/* Right Action Group */}
          <div className="flex items-center space-x-6 text-white text-sm font-sans relative">
             <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
            
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)} 
                  className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="hidden md:block uppercase tracking-wider text-xs">{user.name.split(' ')[0]}</span>
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-4 w-48 bg-gray-900 border border-gray-800 rounded shadow-xl py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-800 mb-2">
                      <p className="text-xs text-gray-500 uppercase tracking-widest leading-tight">Signed in as</p>
                      <p className="font-bold truncate" title={user.email}>{user.email}</p>
                    </div>
                    <Link to="/account" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">Account Dashboard</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors mt-1">Sign Out</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <span className="hidden md:block uppercase tracking-wider text-xs">Login</span>
              </Link>
            )}

            <button className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
              <span className="font-mono text-xs">(0)</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
}
