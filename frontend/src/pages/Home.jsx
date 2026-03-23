import React from 'react';

export default function Home() {
  return (
    <div className="pt-20">
      {/* Hero Section Placeholder */}
      <section className="relative h-[80vh] flex items-center justify-center bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-sans font-bold text-white mb-6 tracking-tight">
            Elevate Your Everyday
          </h1>
          <p className="text-lg md:text-xl font-mono text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Discover our latest collection of premium minimalist essentials tailored for the modern lifestyle.
          </p>
          <button className="px-8 py-4 bg-white text-black font-semibold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors">
            Shop the Collection
          </button>
        </div>
      </section>

      {/* Featured Categories Placeholder */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-3xl font-bold text-white font-sans tracking-tight">Featured Categories</h2>
          <a href="#" className="text-gray-400 hover:text-white font-mono text-sm border-b border-gray-700 pb-1">View All</a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="group relative aspect-[4/5] bg-gray-900 overflow-hidden cursor-pointer">
              <div className="absolute inset-0 bg-gray-800 transition-transform duration-700 group-hover:scale-105"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
              <div className="absolute bottom-8 left-8 z-20">
                <h3 className="text-white text-xl font-bold tracking-wider mb-2">Category {item}</h3>
                <span className="text-gray-400 text-sm font-mono uppercase group-hover:text-white transition-colors">Explore &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
