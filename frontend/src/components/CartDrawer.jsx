import React, { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { isDrawerOpen, toggleDrawer, items, removeFromCart, updateQuantity, getCartTotal } = useCartStore();

  // Prevent background scrolling globally while viewport maintains cart context focus
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <>
      {/* Dimmed Background Restricting Base Viewport Interactions natively */}
      <div 
         className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity"
         onClick={() => toggleDrawer(false)}
      />

      {/* Main Drawer Overlay Hooking onto right layout pane */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-dark text-white shadow-2xl z-50 transform transition-transform duration-300 translate-x-0 flex flex-col border-l border-gray-900">
        
        {/* Header Ribbon */}
        <div className="flex justify-between items-center p-6 border-b border-gray-900">
          <h2 className="text-xl tracking-[0.2em] font-bold uppercase font-sans">Your Cart</h2>
          <button onClick={() => toggleDrawer(false)} className="text-gray-500 hover:text-white transition-colors group">
            <svg className="w-6 h-6 transform group-hover:rotate-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Dynamic Scrollable Content Injector */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 font-mono space-y-4">
               <span className="text-sm uppercase tracking-widest text-gray-400">Your cart is empty.</span>
               <button onClick={() => toggleDrawer(false)} className="text-white border border-gray-700 px-6 py-3 mt-4 rounded hover:bg-white hover:text-black transition-colors uppercase tracking-widest text-xs font-bold shadow-lg">Continue Shopping</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-4 bg-black/30 p-4 rounded border border-gray-800 relative group overflow-hidden">
                <img src={item.product.images[0]} alt={item.product.title} className="w-20 h-24 object-cover rounded bg-gray-900" />
                
                <div className="flex-1 flex flex-col justify-between ml-2">
                  <div className="pr-6">
                    <h3 className="font-bold text-sm tracking-wider text-gray-200 uppercase font-sans">{item.product.title}</h3>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mt-1">${item.product.price.toFixed(2)}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-700 rounded bg-black overflow-hidden shadow">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)} className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">-</button>
                      <span className="px-3 py-1 text-xs font-mono border-x border-gray-800 bg-gray-900/50">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)} className="px-3 py-1 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-20 disabled:hover:bg-transparent" disabled={item.quantity >= item.product.stock}>+</button>
                    </div>
                    {item.quantity >= item.product.stock && <span className="text-[9px] text-red-500/80 font-bold uppercase tracking-widest font-mono">Max Stock</span>}
                  </div>
                </div>

                {/* Destructive Deletion Node */}
                <button onClick={() => removeFromCart(item.product._id)} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors opacity-50 group-hover:opacity-100 bg-black/80 rounded-full p-1 border border-transparent group-hover:border-red-900/50" title="Remove">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Anchored Persistent Subtotal Base */}
        <div className="p-6 border-t border-gray-900 bg-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
           <div className="flex justify-between items-end mb-6">
              <span className="text-gray-400 font-mono text-xs uppercase tracking-widest">Subtotal</span>
              <span className="text-2xl tracking-wider font-bold text-white shadow-sm">${getCartTotal().toFixed(2)}</span>
           </div>
           
           {items.length > 0 ? (
             <Link to="/checkout" onClick={() => toggleDrawer(false)} className="w-full block text-center bg-white text-black font-bold uppercase tracking-[0.2em] text-sm py-4 rounded hover:bg-gray-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]">
               Proceed to Checkout
             </Link>
           ) : (
             <button disabled className="w-full block text-center bg-gray-900 border border-gray-800 text-gray-600 font-bold uppercase tracking-[0.2em] text-sm py-4 rounded cursor-not-allowed group relative transition-colors opacity-80 hover:opacity-100">
               Proceed to Checkout
               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-max px-3 py-1.5 bg-gray-800 text-white font-mono text-[10px] tracking-widest uppercase border border-gray-700 shadow-xl rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">Cart is empty</span>
               {/* Tiny css triangle connecting the tooltip down to the disabled button space */}
               <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 border-4 border-transparent border-t-gray-800 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity"></span>
             </button>
           )}
        </div>

      </div>
    </>
  );
}
