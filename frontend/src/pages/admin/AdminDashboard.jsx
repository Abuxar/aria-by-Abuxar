import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ totalRevenue: 0, pendingCount: 0, dispatchedCount: 0, deliveredCount: 0, activeCount: 0 });
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const { data } = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        let revenue = 0;
        let pending = 0;
        let dispatched = 0;
        let delivered = 0;
        let active = data.length;

        data.forEach(order => {
           revenue += order.totalPrice || 0;
           if (order.isDelivered) delivered++;
           else if (order.isDispatched) dispatched++;
           else pending++;
        });

        setMetrics({ totalRevenue: revenue, pendingCount: pending, dispatchedCount: dispatched, deliveredCount: delivered, activeCount: active });
        setOrders(data.slice(0, 5)); // Keep only quickest 5
      } catch (err) {
        console.error("Dashboard Analytics Failure:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.token]);

  if (loading) return <div className="text-white font-mono animate-pulse">Compiling Global Analytics...</div>;

  return (
    <div className="text-white max-w-7xl mx-auto">
      <h1 className="text-3xl font-sans font-bold tracking-[0.2em] uppercase mb-8">System Analytics</h1>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
           </div>
           <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-2 relative z-10">Gross Revenue</p>
           <p className="text-3xl font-bold tracking-wider relative z-10">${metrics.totalRevenue.toFixed(2)}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>
           </div>
           <p className="text-gray-500 font-mono text-xs uppercase tracking-widest mb-2 relative z-10">Total Transactions</p>
           <p className="text-3xl font-bold tracking-wider relative z-10">{metrics.activeCount}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-yellow-500">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22M12 6l7.5 13h-15M11 10v4h2v-4M11 16v2h2v-2"/></svg>
           </div>
           <p className="text-yellow-500/80 font-mono text-xs uppercase tracking-widest mb-2 relative z-10">Pending Action</p>
           <p className="text-3xl font-bold text-yellow-500 tracking-wider relative z-10">{metrics.pendingCount}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity text-blue-500">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
           </div>
           <p className="text-blue-500/80 font-mono text-xs uppercase tracking-widest mb-2 relative z-10">Dispatched Active</p>
           <p className="text-3xl font-bold text-blue-500 tracking-wider relative z-10">{metrics.dispatchedCount}</p>
        </div>
      </div>

      {/* Recents Node */}
      <h2 className="text-xl font-sans font-bold tracking-widest uppercase mb-6 border-b border-gray-800 pb-2">Recent Trajectory</h2>
      <div className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
         <div className="overflow-x-auto">
         <table className="w-full text-left font-sans whitespace-nowrap">
            <thead>
               <tr className="bg-gray-900 border-b border-gray-800 text-xs uppercase tracking-widest text-gray-500 font-mono">
               <th className="p-4">ID Hash</th>
               <th className="p-4">Total</th>
               <th className="p-4">Status</th>
               <th className="p-4 text-right">Audit Route</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
               {orders.map((order) => (
               <tr key={order._id} className="hover:bg-gray-900/50 transition-colors group text-sm">
                  <td className="p-4 font-mono text-gray-400 group-hover:text-white transition-colors">{order.trackingId}</td>
                  <td className="p-4 font-bold">${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                  <td className="p-4">
                     {order.isDelivered ? (
                        <span className="text-[#00c569] font-mono text-xs uppercase tracking-widest">Delivered</span>
                     ) : order.isDispatched ? (
                        <span className="text-blue-400 font-mono text-xs uppercase tracking-widest">Dispatched</span>
                     ) : (
                        <span className="text-yellow-500 font-mono text-xs uppercase tracking-widest">Pending</span>
                     )}
                  </td>
                  <td className="p-4 text-right">
                     <Link to={`/admin/orders/${order._id}`} className="text-white hover:text-gray-400 font-bold uppercase tracking-widest text-xs underline underline-offset-4">
                     Open Node
                     </Link>
                  </td>
               </tr>
               ))}
               {orders.length === 0 && (
                  <tr><td colSpan="4" className="p-6 text-center text-gray-500 font-mono tracking-widest">Awaiting active payloads.</td></tr>
               )}
            </tbody>
         </table>
         </div>
      </div>
    </div>
  );
}
