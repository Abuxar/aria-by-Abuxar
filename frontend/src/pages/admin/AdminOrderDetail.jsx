import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deliverLoading, setDeliverLoading] = useState(false);
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const { user } = useAuthStore();

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://aria-backend-7040.onrender.com/api' : 'http://localhost:5000/api');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/orders/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch detailed order parameters inherently from DB.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user.token, API_URL]);

  const handleDeliver = async () => {
    setDeliverLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/orders/${id}/deliver`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrder(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Delivery mutation failure');
    } finally {
      setDeliverLoading(false);
    }
  };

  const handleDispatch = async () => {
    setDispatchLoading(true);
    try {
      const { data } = await axios.put(`${API_URL}/orders/${id}/dispatch`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOrder(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Dispatch mutation failure');
    } finally {
      setDispatchLoading(false);
    }
  };

  if (loading) return <div className="text-white font-mono animate-pulse">Loading Transaction Data...</div>;
  if (error) return <div className="text-red-500 font-mono tracking-widest uppercase">{error}</div>;
  if (!order) return <div className="text-gray-500 font-mono tracking-widest uppercase">Null pointer exception resolving order hash.</div>;

  return (
    <div className="max-w-5xl text-white">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-sans font-bold tracking-[0.2em] uppercase mb-2">Order Audit</h1>
          <p className="font-mono text-gray-500 text-xs">Tracking Hash: {order.trackingId}</p>
        </div>
        <Link to="/admin/orders" className="px-6 py-2 border border-gray-700 hover:border-white transition-colors text-xs font-mono uppercase tracking-widest hover:bg-white hover:text-black rounded">
          Back to Matrix
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Node */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded relative overflow-hidden">
            <h2 className="text-lg font-bold font-sans tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Shipping Vector</h2>
            <div className="font-mono text-sm text-gray-300 space-y-1">
              <p><span className="text-gray-500 mr-2">Ident:</span> {order.user ? order.user.name : order.shippingAddress.firstName + ' ' + order.shippingAddress.lastName} ({order.shippingAddress.email})</p>
              <p><span className="text-gray-500 mr-2">Route:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.zip}</p>
              <p><span className="text-gray-500 mr-2">Locale:</span> {order.shippingAddress.state ? order.shippingAddress.state + ', ' : ''}{order.shippingAddress.country}</p>
            </div>
            <div className="mt-4">
               {order.isDelivered ? (
                  <div className="bg-[#00c569]/20 text-[#00c569] border border-[#00c569]/50 p-3 rounded font-mono text-xs uppercase tracking-widest">
                     Delivered successfully on {new Date(order.deliveredAt).toLocaleString()}
                  </div>
               ) : order.isDispatched ? (
                  <div className="bg-blue-900/40 text-blue-400 border border-blue-900 p-3 rounded font-mono text-xs uppercase tracking-widest">
                     Dispatched to carrier on {new Date(order.dispatchedAt).toLocaleString()}
                  </div>
               ) : (
                  <div className="bg-yellow-900/40 text-yellow-500 border border-yellow-900 p-3 rounded font-mono text-xs uppercase tracking-widest">
                     Fulfillment Queued / Pending Dispatch
                  </div>
               )}
            </div>
          </div>

          {/* Payment Node */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded">
            <h2 className="text-lg font-bold font-sans tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Financial Hash</h2>
            <div className="font-mono text-sm text-gray-300 mb-4">
              <p><span className="text-gray-500 mr-2">Method:</span> {order.paymentMethod.toUpperCase()}</p>
            </div>
            {order.isPaid ? (
               <div className="bg-[#00c569]/20 text-[#00c569] border border-[#00c569]/50 p-3 rounded font-mono text-xs uppercase tracking-widest">
                  Authorized on {new Date(order.paidAt).toLocaleString()}
               </div>
            ) : (
               <div className="bg-red-900/40 text-red-500 border border-red-900 p-3 rounded font-mono text-xs uppercase tracking-widest">
                  Transaction Pending Authorization
               </div>
            )}
          </div>

          {/* Items */}
          <div className="bg-gray-900 border border-gray-800 p-6 rounded">
            <h2 className="text-lg font-bold font-sans tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Payload Array</h2>
            <div className="space-y-4">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-black p-4 rounded border border-gray-800">
                  <div className="w-16 h-16 bg-gray-900 object-cover flex-shrink-0">
                     {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale opacity-80" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/admin/products/${item.product}/edit`} className="font-bold text-sm uppercase tracking-wide truncate hover:underline">{item.name}</Link>
                    <p className="text-xs text-gray-500 font-mono mt-1">Hash: {item.product}</p>
                  </div>
                  <div className="text-right font-mono text-sm">
                    <p className="text-gray-400">{item.quantity} x ${item.price.toFixed(2)}</p>
                    <p className="font-bold text-white mt-1">${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded sticky top-8">
            <h2 className="text-lg font-bold font-sans tracking-widest uppercase mb-4 border-b border-gray-800 pb-2">Execution Console</h2>
            
            <div className="space-y-2 font-mono text-sm text-gray-400 mb-6 border-b border-gray-800 pb-4">
              <div className="flex justify-between"><p>Gross Items</p><p>${order.itemsPrice.toFixed(2)}</p></div>
              <div className="flex justify-between"><p>Shipping</p><p>${order.shippingPrice.toFixed(2)}</p></div>
              <div className="flex justify-between"><p>Tax / Tariffs</p><p>${order.taxPrice.toFixed(2)}</p></div>
              <div className="flex justify-between text-white font-bold text-lg mt-2 pt-2 border-t border-gray-800">
                 <p>Total Payload</p><p>${order.totalPrice.toFixed(2)}</p>
              </div>
            </div>

            {!order.isDispatched && (
              <button 
                onClick={handleDispatch}
                disabled={dispatchLoading}
                className="w-full py-4 bg-blue-600 text-white font-bold flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs hover:bg-blue-500 transition-all rounded disabled:opacity-50 mb-4"
              >
                {dispatchLoading ? 'Mutating Database...' : 'Register Dispatch (Shipped)'}
              </button>
            )}

            {order.isDispatched && !order.isDelivered && (
              <button 
                onClick={handleDeliver}
                disabled={deliverLoading}
                className="w-full py-4 bg-white text-black font-bold flex items-center justify-center gap-2 uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-all rounded disabled:opacity-50"
              >
                {deliverLoading ? 'Mutating Database...' : 'Register Final Delivery'}
              </button>
            )}
            
            {order.isDelivered && (
               <div className="w-full py-4 border border-gray-700 bg-black text-gray-400 font-mono flex items-center justify-center uppercase tracking-widest text-xs rounded opacity-50 cursor-not-allowed">
                  Transaction Cycle Closed
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
