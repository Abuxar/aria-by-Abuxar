import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, API_URL]);

  if (loading) return <div className="pt-32 min-h-screen bg-dark text-center text-gray-500 font-mono tracking-widest uppercase text-sm">Loading curation details...</div>;
  if (!product) return <div className="pt-32 min-h-screen bg-dark text-center text-red-500 font-mono tracking-widest uppercase text-sm">Curation not found.</div>;

  return (
    <div className="pt-24 min-h-screen bg-dark text-white pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 pt-4">
           <Link to="/shop" className="text-gray-500 hover:text-white font-mono uppercase tracking-widest text-xs transition-colors">&larr; Return to Shop</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          <div className="relative aspect-[3/4] bg-gray-900 border border-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            {product.images?.[0] ? (
               <img 
                 src={product.images[0]} 
                 alt={product.title} 
                 className="object-cover w-full h-full"
               />
            ) : (
               <div className="text-gray-600 font-mono uppercase tracking-widest text-xs">Aesthetic placeholder</div>
            )}
            
            {product.discountPercent > 0 && (
              <div className="absolute top-6 left-6 bg-white text-black px-4 py-2 text-xs font-bold tracking-widest uppercase">
                {product.discountPercent}% OFF
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center font-sans py-10 md:py-0 text-left">
            <p className="text-gray-500 font-mono uppercase tracking-widest text-xs mb-4">{product.category}</p>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-widest mb-6 leading-tight">{product.title}</h1>
            <p className="text-2xl font-bold tracking-widest mb-8">${product.price.toFixed(2)}</p>

            <div className="w-full h-px bg-gray-800 mb-8 rounded"></div>

            <p className="text-gray-400 font-mono text-[13px] leading-[1.8] mb-12 max-w-lg">
              {product.description}
            </p>

            <div className="space-y-4 max-w-sm">
               {product.stock > 0 ? (
                 <button className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors rounded shadow-lg">
                   Add to Cart — ${product.price.toFixed(2)}
                 </button>
               ) : (
                 <button disabled className="w-full py-4 bg-gray-900 text-gray-500 font-bold uppercase tracking-widest text-xs border border-gray-800 cursor-not-allowed rounded">
                   Sold Out
                 </button>
               )}
            </div>

            <div className="mt-12 space-y-4 text-xs font-mono text-gray-500 uppercase tracking-widest max-w-sm">
              <p className="flex justify-between border-b border-gray-900 pb-2"><span>Availability</span> <span className={product.stock > 0 ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span></p>
              <p className="flex justify-between border-b border-gray-900 pb-2"><span>Shipping</span> <span className="text-white">Complimentary</span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
