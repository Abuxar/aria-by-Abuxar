import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

export default function AdminCarouselList() {
  const [carousels, setCarousels] = useState([]);
  const { user } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://aria-backend-7040.onrender.com/api' : 'http://localhost:5000/api');

  const fetchCarousels = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/carousels`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setCarousels(data);
    } catch (error) {
      console.error(error);
    }
  }, [user.token, API_URL]);

  useEffect(() => {
    fetchCarousels();
  }, [fetchCarousels]);

  const deleteHandler = async (id) => {
    if (window.confirm('Delete this slide permanently?')) {
      try {
        await axios.delete(`${API_URL}/carousels/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchCarousels();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const createHandler = async () => {
    try {
      await axios.post(`${API_URL}/carousels`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchCarousels();
    } catch (error) {
      console.error(error);
    }
  };

  const [draggedItemIndex, setDraggedItemIndex] = useState(null);

  const handleDragStart = (index) => setDraggedItemIndex(index);
  const handleDragOver = (e) => e.preventDefault();
  
  const handleDrop = async (index) => {
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Optimistic Swap
    const newCarousels = [...carousels];
    const draggedItem = newCarousels[draggedItemIndex];
    newCarousels.splice(draggedItemIndex, 1);
    newCarousels.splice(index, 0, draggedItem);
    setCarousels(newCarousels);

    const orderedIds = newCarousels.map(c => c._id);
    try {
       await axios.put(`${API_URL}/carousels/reorder`, { orderedIds }, {
         headers: { Authorization: `Bearer ${user.token}` }
       });
    } catch(err) {
       console.error('Failed to reorder', err);
       alert('Failed to save order sequence.');
       fetchCarousels(); 
    }
  };

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold font-sans tracking-widest text-white">HOME CAROUSELS</h1>
        <button onClick={createHandler} className="bg-white text-black px-6 py-3 text-xs font-bold font-mono tracking-widest uppercase rounded hover:bg-gray-200 transition-colors shadow-lg">
          + Add Slide
        </button>
      </div>
      
      <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-6 border border-gray-800 p-4 rounded bg-black/50 border-dashed">
        ✨ <strong>Tip:</strong> You can drag and drop slides below to instantly reorder their arrangement on the live Homepage.
      </p>

      <div className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-black/50 text-gray-400 uppercase font-mono tracking-widest text-[10px] border-b border-gray-800">
            <tr>
              <th className="px-6 py-4 font-bold">Preview</th>
              <th className="px-6 py-4 font-bold">Text Overlay</th>
              <th className="px-6 py-4 font-bold">Visibility</th>
              <th className="px-6 py-4 font-bold text-right">Settings</th>
            </tr>
          </thead>
          <tbody>
            {carousels.map((carousel, index) => (
              <tr 
                key={carousel._id} 
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
                className="border-b border-gray-800 hover:bg-gray-800/80 transition-colors cursor-move active:bg-gray-800"
              >
                <td className="px-6 py-4">
                  <div className="h-16 w-32 bg-black rounded overflow-hidden border border-gray-700 shadow-inner">
                     <img src={carousel.image} alt={carousel.title} className="h-full w-full object-cover pointer-events-none opacity-80" />
                  </div>
                </td>
                <td className="px-6 py-4 font-sans font-semibold tracking-wider text-sm flex flex-col justify-center gap-1">
                  <span className="text-white text-base font-bold tracking-[0.1em]">{carousel.title}</span>
                  <span className="text-gray-500 font-mono text-[10px] uppercase tracking-widest">{carousel.subtitle}</span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded ${carousel.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900/50 text-gray-400 border border-red-900/50'}`}>
                    {carousel.isActive ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-4">
                  <Link to={`/admin/carousels/${carousel._id}/edit`} className="text-blue-400 hover:text-blue-300 font-mono uppercase tracking-widest text-[10px] font-bold">
                    Edit
                  </Link>
                  <button onClick={() => deleteHandler(carousel._id)} className="text-red-400 hover:text-red-300 font-mono uppercase tracking-widest text-[10px] font-bold">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {carousels.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center font-mono text-gray-500 uppercase tracking-widest text-xs">No hero slides found. Your homepage hero area is empty.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
