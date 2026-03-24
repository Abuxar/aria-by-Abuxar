import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function Shop() {
  const { category, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [taxonomy, setTaxonomy] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let url = `${API_URL}/products`;
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (subcategory) params.append('subcategory', subcategory);

        if (params.toString()) url += `?${params.toString()}`;
        
        const [prodRes, taxRes] = await Promise.all([
           axios.get(url),
           axios.get(`${API_URL}/categories`)
        ]);
        
        setProducts(prodRes.data);
        setTaxonomy(taxRes.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [API_URL, category, subcategory]);

  return (
    <div className="pt-32 min-h-screen bg-dark text-white px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-24">
      <div className="text-center mb-16 border-b border-gray-900 pb-16">
        <h1 className="text-4xl md:text-5xl font-sans font-bold tracking-[0.3em] mb-4 uppercase">{subcategory || category ? (subcategory || category).replace(/-/g, ' ') : 'SHOP ALL'}</h1>
        <p className="font-mono text-gray-400 text-xs tracking-[0.2em] uppercase">{category && subcategory ? `Explore ${category} > ${subcategory}` : 'The Definitive Aria Collection'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 pb-8 md:pb-0 md:pr-8">
            <h3 className="font-sans tracking-widest uppercase font-bold text-gray-400 mb-8 text-xs border-b border-gray-900 pb-4">Categories</h3>
            <ul className="space-y-6">
              <li>
                 <Link to="/shop" className={`font-bold uppercase tracking-[0.2em] text-sm hover:text-white transition-colors block mb-3 ${!category ? 'text-white' : 'text-gray-400'}`}>All Products</Link>
              </li>
              {taxonomy.map(cat => (
                <li key={cat._id}>
                   <Link to={`/${cat.slug}`} className={`font-bold uppercase tracking-[0.2em] text-sm transition-colors block mb-3 ${category === cat.slug && !subcategory ? 'text-white' : 'text-gray-400 hover:text-gray-300'}`}>{cat.name}</Link>
                   {cat.subcategories && cat.subcategories.length > 0 && (
                      <ul className="pl-4 space-y-3 border-l border-gray-800 ml-2">
                         {cat.subcategories.map(sub => (
                           <li key={sub._id}>
                             <Link to={`/${cat.slug}/${sub.slug}`} className={`uppercase font-mono text-[10px] tracking-widest block transition-colors ${subcategory === sub.slug ? 'text-white font-bold' : 'text-gray-500 hover:text-gray-400'}`}>{sub.name}</Link>
                           </li>
                         ))}
                      </ul>
                   )}
                </li>
              ))}
            </ul>
        </aside>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          {loading ? (
            <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-3 flex flex-col items-center justify-center py-20 text-center text-gray-500 font-mono">
                  <span className="block mb-2 text-xl font-bold tracking-widest">NO PRODUCTS FOUND.</span>
                  <p>Try adjusting your category filters.</p>
                </div>
              ) : (
                products.map((product) => (
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
                        <h3 className="text-sm font-semibold tracking-wider mb-1 text-gray-200 group-hover:text-white transition-colors">{product.title}</h3>
                        <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{product.categories?.[0] || product.category}</p>
                      </div>
                      <p className="text-sm font-bold tracking-wider">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
