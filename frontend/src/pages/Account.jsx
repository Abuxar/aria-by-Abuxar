import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Account() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      const fetchOrders = async () => {
        try {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const { data } = await axios.get(`${API_URL}/orders/myorders`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setOrders(data);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        } finally {
          setLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [user, navigate]);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="pt-24 min-h-screen bg-dark text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-sans font-bold tracking-widest mb-10 pt-4">MY ACCOUNT</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-1 bg-gray-900 border border-gray-800 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold font-sans tracking-wider mb-4 border-b border-gray-800 pb-2">Profile Details</h2>
          <div className="space-y-4 font-mono text-sm text-gray-300">
            <div>
              <p className="text-gray-500 uppercase tracking-widest text-xs mb-1">Name</p>
              <p>{user.name}</p>
            </div>
            <div>
              <p className="text-gray-500 uppercase tracking-widest text-xs mb-1">Email</p>
              <p>{user.email}</p>
            </div>
            
            <button 
              onClick={handleLogout}
              className="mt-6 w-full py-3 border border-red-900/50 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors uppercase tracking-widest text-xs font-bold rounded"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold font-sans tracking-wider mb-6 border-b border-gray-800 pb-2">Order History</h2>
          
          {loadingOrders ? (
            <div className="animate-pulse bg-gray-900 border border-gray-800 rounded-lg p-16"></div>
          ) : orders.length === 0 ? (
            <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-16 text-center">
              <p className="text-gray-500 font-mono mb-6">You haven't placed any orders yet.</p>
              <Link to="/" className="px-8 py-3 bg-white text-black font-semibold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors inline-block">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="bg-gray-900 border border-gray-800 rounded-lg p-6 flex justify-between items-center">
                  <div>
                    <p className="font-mono text-gray-400 text-xs mb-1">Order # {order.trackingId}</p>
                    <p className="font-bold">${order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="px-3 py-1 bg-gray-800 text-xs uppercase tracking-wider rounded text-gray-300">{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
