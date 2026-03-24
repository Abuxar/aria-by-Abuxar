import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products`);
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  return (
    <div className="pt-32 min-h-screen bg-dark text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <div className="text-center mb-16 border-b border-gray-900 pb-16">
        <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-[0.3em] mb-4">SHOP ALL</h1>
        <p className="font-mono text-gray-400 text-xs tracking-[0.2em] uppercase">The Definitive Aria Collection</p>
      </div>

      {loading ? (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1,2,3,4,5,6].map(i => <div key={i} className="aspect-[3/4] bg-gray-900 border border-gray-800 rounded animate-pulse"></div>)}
         </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-14">
          {products.map((product) => (
            <Link to={`/product/${product._id}`} key={product._id} className="group block">
              <div className="relative aspect-[3/4] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden mb-5">
                <img 
                  src={product.images[0] || 'https://via.placeholder.com/400x500?text=No+Image'} 
                  alt={product.title} 
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] opacity-90 group-hover:opacity-100"
                />
                 {product.stock <= 0 && (
                    <div className="absolute top-4 right-4 bg-black/90 px-3 py-1 text-[10px] font-bold tracking-widest text-white uppercase backdrop-blur-sm rounded">
                      Sold Out
                    </div>
                  )}
              </div>
              <div className="flex justify-between items-start font-sans px-1">
                <div>
                  <h3 className="text-base font-semibold tracking-wider mb-1 text-gray-200 group-hover:text-white transition-colors">{product.title}</h3>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{product.category}</p>
                </div>
                <p className="text-base font-bold tracking-wider">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
          {products.length === 0 && (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center text-gray-400 font-mono mt-12 mb-20 uppercase tracking-widest text-sm">
              The shop is currently empty. More curations arriving soon.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
