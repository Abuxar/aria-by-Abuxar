import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function ProductEdit() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
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
        setImage(data.images && data.images.length > 0 ? data.images[0] : '');
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
      setImage(data.url);
      setUploading(false);
    } catch (error) {
      console.error('Image upload error', error);
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/products/${id}`,
        { title, price, image, category, stock, description, images: [image] },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      navigate('/admin/products');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
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
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Image URL / Upload</label>
          <input type="text" className="w-full bg-black border border-gray-700 text-white p-3 rounded mb-4" value={image} onChange={(e) => setImage(e.target.value)} placeholder="Enter image URL or upload below" />
          <input type="file" onChange={uploadFileHandler} className="text-sm border border-gray-700 w-full p-2 rounded text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:uppercase file:tracking-widest file:bg-white file:text-black hover:file:bg-gray-200 transition-colors cursor-pointer" />
          {uploading && <span className="text-xs text-blue-400 block mt-2 animate-pulse font-mono block">Uploading to Cloudinary...</span>}
          {image && <img src={image} alt="Preview" className="mt-6 h-40 object-cover rounded border border-gray-700 shadow-xl" />}
        </div>

        <div>
          <label className="block text-gray-400 text-xs uppercase tracking-wider mb-2 font-bold">Description</label>
          <textarea rows="4" className="w-full bg-black border border-gray-700 text-white p-3 rounded" value={description} onChange={(e) => setDescription(e.target.value)} required></textarea>
        </div>

        <button type="submit" className="w-full bg-white text-black font-bold uppercase tracking-widest text-sm py-4 rounded hover:bg-gray-200 transition-colors mt-8">
          Update Product
        </button>
      </form>
    </div>
  );
}
