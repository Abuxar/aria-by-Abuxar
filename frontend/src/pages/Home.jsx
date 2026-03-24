import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [carousels, setCarousels] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, carRes] = await Promise.all([
           axios.get(`${API_URL}/products`),
           axios.get(`${API_URL}/carousels`)
        ]);
        setProducts(prodRes.data.slice(0, 4));
        setCarousels(carRes.data);
      } catch (error) {
        console.error('Failed to load home data', error);
      }
    };
    fetchData();
  }, [API_URL]);

  return (
    <div className="bg-dark text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        {carousels.length > 0 ? (
          <Swiper
            modules={[Autoplay, EffectFade, Pagination]}
            effect="fade"
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            className="w-full h-full z-0"
          >
            {carousels.map((slide) => (
              <SwiperSlide key={slide._id}>
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 bg-black">
                     <img src={slide.image} alt={slide.title} className="w-full h-full object-cover opacity-60" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center justify-center"></div>
                  <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
                    <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-[0.2em] mb-6 drop-shadow-2xl">{slide.title}</h1>
                    <p className="font-mono text-gray-300 text-sm md:text-base tracking-widest mb-10 max-w-2xl mx-auto leading-relaxed uppercase">
                      {slide.subtitle}
                    </p>
                    <Link to={slide.link} className="bg-white text-black px-10 py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-gray-200 transition-all duration-300 rounded shadow-xl hover:shadow-2xl inline-block">
                      Explore Collection
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="relative w-full h-full flex items-center justify-center">
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618220179428-22790b461013?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40"></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex items-center justify-center"></div>
             <div className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
               <h1 className="text-5xl md:text-7xl font-sans font-bold tracking-[0.2em] mb-6 drop-shadow-2xl">ARIA</h1>
               <p className="font-mono text-gray-300 text-sm md:text-base tracking-widest mb-10 max-w-2xl mx-auto leading-relaxed uppercase">
                 REDEFINING MINIMALIST LUXURY.<br />CURATED ESSENTIALS FOR THE MODERN AESTHETIC.
               </p>
               <Link to="/shop" className="bg-white text-black px-10 py-4 font-bold tracking-[0.2em] text-xs uppercase hover:bg-gray-200 transition-all duration-300 rounded shadow-xl hover:shadow-2xl inline-block">
                 Explore Collection
               </Link>
             </div>
          </div>
        )}
      </section>

      {/* Highlights Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-gray-900 pb-4">
          <h2 className="text-2xl font-sans font-bold tracking-widest uppercase text-white shadow-sm">Collection Highlights</h2>
          <Link to="/shop" className="text-xs font-mono text-gray-400 hover:text-white uppercase tracking-widest transition-colors mb-1 group flex items-center gap-2">
            View Shop <span className="group-hover:translate-x-1 outline-none transition-transform">&rarr;</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.length === 0 ? (
            <div className="col-span-4 flex flex-col items-center justify-center py-20 text-center text-gray-500 font-mono">
              <span className="block mb-2 text-xl block mb-2 font-bold tracking-widest">NO PRODUCTS YET.</span>
              <p>Add products in the Admin panel for them to appear here!</p>
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
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">{product.category}</p>
                  </div>
                  <p className="text-sm font-bold tracking-wider">${product.price.toFixed(2)}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
