import React, { useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const tracking = searchParams.get('tracking');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center font-sans pb-24">
      <div className="max-w-xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        <div className="w-24 h-24 bg-white ml-auto mr-auto rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.2)]">
           <svg className="w-12 h-12 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-[0.2em] uppercase mb-4 text-white">Order Secured</h1>
          <p className="text-gray-400 font-mono tracking-widest text-sm uppercase">Transaction authorized and recorded natively.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 p-8 rounded-lg text-left shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-5">
              <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15l-5-5 1.41-1.41L11 14.17l7.59-7.59L20 8l-9 9z"/></svg>
           </div>
           
           <div className="relative z-10">
             <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">Internal Mongo Hash</p>
             <p className="text-[10px] sm:text-xs font-mono text-gray-300 break-all bg-black p-3 rounded border border-gray-800 mb-6 select-all">{id}</p>

             <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">Public Tracking ID</p>
             <div className="flex items-center gap-4 bg-black p-4 rounded border border-gray-800 mb-2">
                 <p className="text-2xl sm:text-3xl font-bold tracking-widest text-white">{tracking || 'PENDING'}</p>
             </div>
             <p className="text-[10px] text-gray-500 font-mono uppercase tracking-widest leading-relaxed mt-4">Retain this alphanumeric sequence block to monitor localized fulfillment routing and shipping logic dynamically.</p>
           </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center relative z-20">
          <Link to="/shop" className="px-8 py-4 bg-white text-black font-bold uppercase tracking-[0.2em] text-xs hover:bg-gray-200 transition-colors rounded shadow-lg">
            Return to Catalog
          </Link>
          <Link to="/account" className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold uppercase tracking-[0.2em] text-xs hover:border-white transition-colors rounded">
            View My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}
