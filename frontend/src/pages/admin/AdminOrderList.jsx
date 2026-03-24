import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function AdminOrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const { data } = await axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch global order metrics structure inherently from DB nodes');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user.token]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-sans font-bold tracking-[0.2em] uppercase text-white animate-in slide-in-from-left-4">Admin Orders</h1>
      </div>

      {error && <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-xs font-mono uppercase tracking-widest mb-6">{error}</div>}

      {loading ? (
        <div className="space-y-4 animate-pulse">
           {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-900 rounded border border-gray-800"></div>)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 p-8 rounded text-center">
          <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">No active transaction payloads detected inside system parameters yet.</p>
        </div>
      ) : (
        <div className="bg-black border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans whitespace-nowrap">
              <thead>
                <tr className="bg-gray-900 border-b border-gray-800 text-xs uppercase tracking-widest text-gray-500 font-mono">
                  <th className="p-4">ID Hash</th>
                  <th className="p-4">Identity Node</th>
                  <th className="p-4">Initiated</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Paid</th>
                  <th className="p-4">Fulfilled</th>
                  <th className="p-4 text-right">Execute</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-900/50 transition-colors group">
                    <td className="p-4 font-mono text-xs text-gray-400 group-hover:text-white transition-colors">{order.trackingId}</td>
                    <td className="p-4 text-xs font-bold">{order.user ? order.user.name : <span className="italic text-gray-500 font-normal">Guest Array</span>}</td>
                    <td className="p-4 font-mono text-xs text-gray-400">{new Date(order.createdAt).toISOString().substring(0,10)}</td>
                    <td className="p-4 font-bold">${order.totalPrice ? order.totalPrice.toFixed(2) : '0.00'}</td>
                    <td className="p-4">
                      {order.isPaid ? (
                        <span className="bg-[#00c569]/20 text-[#00c569] border border-[#00c569]/50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Yes</span>
                      ) : (
                        <span className="bg-red-900/40 text-red-500 border border-red-900 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Pending</span>
                      )}
                    </td>
                    <td className="p-4">
                      {order.isDelivered ? (
                        <span className="bg-[#00c569]/20 text-[#00c569] border border-[#00c569]/50 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Delivered</span>
                      ) : order.isDispatched ? (
                        <span className="bg-blue-900/40 text-blue-400 border border-blue-900 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Dispatched</span>
                      ) : (
                        <span className="bg-yellow-900/40 text-yellow-500 border border-yellow-900 px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider">Queued</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <Link to={`/admin/orders/${order._id}`} className="text-[10px] uppercase tracking-widest font-bold border border-gray-600 hover:bg-white hover:text-black py-2 px-4 rounded transition-colors inline-block">
                        Audit Node
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
