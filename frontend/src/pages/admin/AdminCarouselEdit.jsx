import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function AdminCarouselEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://aria-backend-7040.onrender.com/api' : 'http://localhost:5000/api');

  useEffect(() => {
    const fetchCarousel = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/carousels`, {
            headers: { Authorization: `Bearer ${user.token}` }
        });
        const item = data.find(c => c._id === id);
        if (item) {
          setTitle(item.title);
          setSubtitle(item.subtitle);
          setLink(item.link);
          setImage(item.image);
          setIsActive(item.isActive);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchCarousel();
  }, [id, API_URL, user.token]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` }
      });
      setImage(data.url);
      setUploading(false);
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/carousels/${id}`,
        { title, subtitle, link, image, isActive },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/admin/carousels');
    } catch (error) {
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <Link to="/admin/carousels" className="text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold mb-6 inline-block transition-colors">
        &larr; Back to Carousels
      </Link>
      <h1 className="text-3xl font-bold text-white tracking-widest mb-8 font-sans">EDIT HERO SLIDE</h1>

      <form onSubmit={submitHandler} className="bg-gray-900 border border-gray-800 p-8 rounded-lg space-y-6 shadow-2xl">
        <label className="flex items-center space-x-3 cursor-pointer mb-6 border-b border-gray-800 pb-6">
           <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="form-checkbox h-5 w-5 text-gray-600 bg-black border-gray-700 rounded focus:ring-0 focus:ring-offset-0 transition duration-150 ease-in-out cursor-pointer" />
           <span className="text-white text-sm uppercase tracking-widest font-bold">Set as Active (Visible to public)</span>
        </label>
      
        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Hero Title (Main Large Text)</label>
          <input type="text" className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500 font-sans tracking-[0.2em]" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        
        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Hero Subtitle</label>
          <input type="text" className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500 font-mono text-sm tracking-widest uppercase" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} required />
        </div>

        <div>
           <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Action Button URL Target</label>
           <input type="text" className="w-full bg-black border border-gray-700 text-white p-3 rounded focus:outline-none focus:border-gray-500 font-mono text-sm" value={link} onChange={(e) => setLink(e.target.value)} required />
        </div>

        <div className="border border-gray-800 rounded p-6 bg-black/50">
          <label className="block text-white text-sm uppercase tracking-wider mb-4 font-bold border-b border-gray-800 pb-2">Cinematic Background Image</label>
          
          <div className="mb-4">
             {image ? (
               <div className="relative aspect-video border border-gray-700 rounded overflow-hidden shadow-2xl">
                 <img src={image} alt="Hero" className="w-full h-full object-cover opacity-80" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex items-center justify-center pointer-events-none">
                     <div className="text-center px-4">
                        <h2 className="text-3xl md:text-5xl font-bold font-sans tracking-[0.2em] mb-4 drop-shadow-lg text-white">{title}</h2>
                        <p className="text-gray-300 font-mono text-xs uppercase tracking-widest drop-shadow-lg">{subtitle}</p>
                     </div>
                 </div>
               </div>
             ) : (
                <div className="aspect-video border border-gray-800 border-dashed rounded flex flex-col items-center justify-center text-gray-600 font-mono text-xs uppercase bg-black">
                  <span>No Background Detected</span>
                </div>
             )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-800">
             <input disabled={uploading} type="file" onChange={uploadFileHandler} className="text-sm border border-gray-700 w-full md:w-auto p-2 rounded text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200 transition-colors cursor-pointer focus:outline-none" />
             {uploading && <span className="text-xs text-blue-400 animate-pulse font-mono block">Syncing to Cloudinary...</span>}
          </div>
        </div>

        <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded hover:bg-gray-200 transition-colors mt-8 shadow-xl">
          Publish Changes
        </button>
      </form>
    </div>
  );
}
