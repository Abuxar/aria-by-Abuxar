import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function ProductEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  const { user } = useAuthStore();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setTitle(data.title);
        setPrice(data.price);
        setImages(data.images || []);
        setCategory(data.category);
        setStock(data.stock);
        setDescription(data.description);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Append new image URL to the images array
      setImages(prevImages => [...prevImages, data.url]);
      setUploading(false);
    } catch (error) {
      console.error('Image upload error', error);
      setUploading(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/products/${id}`,
        { title, price, images, category, stock, description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <Link to="/admin/products" className="text-gray-400 hover:text-white uppercase tracking-widest text-xs font-bold mb-6 inline-block">
        &larr; Back to Products
      </Link>
      <h1 className="text-3xl font-bold text-white tracking-widest mb-8 font-sans">EDIT PRODUCT</h1>

      <form onSubmit={submitHandler} className="bg-gray-900 border border-gray-800 p-8 rounded-lg space-y-6 shadow-2xl">
        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Title</label>
          <input type="text" className="w-full bg-black border border-gray-700 text-white p-3 rounded" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Price ($)</label>
            <input type="number" className="w-full bg-black border border-gray-700 text-white p-3 rounded" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
          </div>
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Stock</label>
            <input type="number" className="w-full bg-black border border-gray-700 text-white p-3 rounded" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
          </div>
        </div>

        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Category</label>
          <input type="text" className="w-full bg-black border border-gray-700 text-white p-3 rounded" value={category} onChange={(e) => setCategory(e.target.value)} required />
        </div>

        <div>
           <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Product Text Description</label>
           <textarea rows="6" className="w-full bg-black border border-gray-700 text-white p-3 rounded font-sans leading-relaxed" value={description} onChange={(e) => setDescription(e.target.value)} required placeholder="Enter main product description..."></textarea>
        </div>

        <div className="border border-gray-800 rounded p-6 bg-black/50">
          <label className="block text-white text-sm uppercase tracking-wider mb-2 font-bold border-b border-gray-800 pb-2">Product Images & Slides</label>
          <p className="text-xs text-gray-500 font-mono mb-6 leading-relaxed">
            Upload multiple images. The <strong>first image</strong> acts as the main cover thumbnail. <br/>
            All <strong>subsequent images</strong> form the rich structural "Description Slides" below the main product page.
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {images.map((img, index) => (
              <div key={index} className="relative group aspect-[3/4] border border-gray-700 rounded overflow-hidden">
                <img src={img} alt={`Slide ${index}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <button type="button" onClick={() => removeImage(index)} className="text-red-400 font-bold tracking-widest text-xs uppercase hover:text-red-300">Remove</button>
                </div>
                {index === 0 && <div className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded shadow">Main Cover</div>}
                {index > 0 && <div className="absolute top-2 left-2 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-widest rounded shadow opacity-80">Slide {index}</div>}
              </div>
            ))}
            {images.length === 0 && (
               <div className="aspect-[3/4] border border-gray-800 border-dashed rounded flex items-center justify-center text-gray-600 font-mono text-xs uppercase">No Images</div>
            )}
          </div>

          <div className="flex items-center gap-4">
             <input disabled={uploading} type="file" onChange={uploadFileHandler} className="text-sm border border-gray-700 w-full md:w-auto p-2 rounded text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200 transition-colors cursor-pointer" />
             {uploading && <span className="text-xs text-blue-400 animate-pulse font-mono block">Uploading to Cloudinary...</span>}
          </div>
        </div>

        <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded hover:bg-gray-200 transition-colors mt-8 shadow-xl">
          Update Product & Save Slides
        </button>
      </form>
    </div>
  );
}
