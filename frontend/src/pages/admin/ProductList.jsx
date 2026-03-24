import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const { user } = useAuthStore();
  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://aria-backend-7040.onrender.com/api' : 'http://localhost:5000/api');

  const fetchProducts = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/products`);
      setProducts(data);
    } catch (error) {
      console.error(error);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createSampleProduct = async () => {
    try {
      await axios.post(`${API_URL}/products`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${API_URL}/products/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        fetchProducts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-white tracking-wider">PRODUCTS</h1>
        <button onClick={createSampleProduct} className="bg-white text-black px-4 py-2 text-xs font-bold tracking-widest hover:bg-gray-200 uppercase rounded">
          + Add Product
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden text-sm font-mono shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-800/50 text-gray-400">
            <tr>
              <th className="p-4 uppercase tracking-wider font-semibold">Title</th>
              <th className="p-4 uppercase tracking-wider font-semibold">Price</th>
              <th className="p-4 uppercase tracking-wider font-semibold">Category</th>
              <th className="p-4 uppercase tracking-wider font-semibold">Stock</th>
              <th className="p-4 uppercase tracking-wider font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {products.map(p => (
              <tr key={p._id} className="hover:bg-gray-800/40 transition-colors">
                <td className="p-4 text-white">
                  <div className="text-xs text-gray-500 mb-1">{p._id}</div>
                  {p.title}
                </td>
                <td className="p-4">${p.price}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">
                  {p.stock}
                  {p.stock < 5 && (
                    <span className="ml-3 px-2 py-1 bg-red-900/40 text-red-500 border border-red-900 text-[10px] uppercase font-bold tracking-wider rounded">Low Stock</span>
                  )}
                </td>
                <td className="p-4 text-right space-x-4">
                  <Link to={`/admin/products/${p._id}/edit`} className="text-gray-400 hover:text-white transition-colors">Edit</Link>
                  <button onClick={() => deleteProduct(p._id)} className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">No products found in catalog.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
