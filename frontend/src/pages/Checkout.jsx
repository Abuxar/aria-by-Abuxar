import React, { useState } from 'react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const COUNTRY_LIST = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
  "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
  "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guyana",
  "Haiti", "Honduras", "Hungary",
  "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Ivory Coast",
  "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan",
  "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg",
  "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
  "Oman",
  "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
  "Qatar",
  "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu",
  "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
  "Vanuatu", "Vatican City", "Venezuela", "Vietnam",
  "Yemen",
  "Zambia", "Zimbabwe"
];

export default function Checkout() {
  const { items, getCartTotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: user ? user.email : '',
    firstName: user ? user.name.split(' ')[0] : '',
    lastName: user ? user.name.split(' ').slice(1).join(' ') : '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cryptoType, setCryptoType] = useState('ethereum');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const CRYPTO_ADDRESSES = {
     bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
     ethereum: "0x71C24D386c9A4eF4b0Aa35b8...",
     solana: "HN7cABqLq46Es1jh92dQQisAq662Smx...",
     usdt: "0x71C24D386c9A4eF4b0Aa35b8... (ERC-20)"
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const orderPayload = {
        orderItems: items.map(item => ({
          name: item.product.title,
          quantity: item.quantity,
          image: item.product.images && item.product.images.length > 0 ? (typeof item.product.images[0] === 'string' ? item.product.images[0] : item.product.images[0].url || '') : '',
          price: item.product.price,
          product: item.product._id
        })),
        shippingAddress: formData,
        paymentMethod: paymentMethod === 'crypto' ? cryptoType : paymentMethod,
        itemsPrice: getCartTotal(),
        taxPrice: 0,
        shippingPrice: 0,
        totalPrice: getCartTotal()
      };

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      
      const config = user ? {
        headers: { Authorization: `Bearer ${user.token}` }
      } : {};

      const { data } = await axios.post(`${API_URL}/orders`, orderPayload, config);
      
      clearCart();
      window.scrollTo(0, 0);
      navigate(`/order-success/${data._id}?tracking=${data.trackingId}`);

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Transaction failed. Please try again or attempt a different processor.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-dark flex flex-col items-center justify-center text-white px-4 text-center">
        <h1 className="text-3xl font-bold font-sans tracking-[0.2em] mb-4 uppercase">Checkout Blocked</h1>
        <p className="text-gray-400 font-mono text-xs uppercase tracking-widest mb-8">Your cart payload is empty.</p>
        <Link to="/shop" className="bg-white text-black font-bold px-8 py-4 uppercase tracking-widest text-xs hover:bg-gray-200 transition-colors shadow-2xl rounded">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 min-h-screen bg-dark text-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Gateway Forms */}
        <div className="lg:col-span-7 xl:col-span-8">
          <Link to="/shop" className="text-gray-500 font-mono text-[10px] tracking-widest uppercase hover:text-white transition-colors block mb-8 flex items-center">&larr; Return to Shopping</Link>
          <h1 className="text-3xl sm:text-4xl font-bold font-sans tracking-[0.2em] mb-8 uppercase text-white shadow-sm">Secure Checkout</h1>
          
          {step === 1 ? (
             <form onSubmit={handleProceedToPayment} className="space-y-10">
               
               {/* Contact Block */}
               <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-lg">
                 <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                    <span className="bg-white text-black w-6 h-6 flex items-center justify-center rounded-full text-[10px]">1</span> 
                    Identity Interface
                 </h2>
                 
                 {!user && (
                    <p className="text-gray-500 text-xs mb-6 font-mono uppercase tracking-widest">
                       Existing account? <Link to="/login?redirect=checkout" className="text-white hover:underline">Authenticate Here</Link>
                    </p>
                 )}
                 
                 <input 
                    type="email" name="email" value={formData.email} onChange={handleChange} required 
                    placeholder="Email Address" 
                    disabled={user}
                    className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
                 />
                 {user && <span className="text-gray-500 text-[10px] font-mono tracking-widest uppercase block mt-2">Email linked exclusively to active profile.</span>}
               </div>

               {/* Address Block */}
               <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-lg mt-8">
                 <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                    <span className="bg-white text-black w-6 h-6 flex items-center justify-center rounded-full text-[10px]">2</span> 
                    Shipping Matrix
                 </h2>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                   <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First Name" className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors" />
                   <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last Name" className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors" />
                 </div>
                 <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Street Address" className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors mb-4" />
                 
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                   <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="City" className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors sm:col-span-1" />
                   <input type="text" name="state" value={formData.state} onChange={handleChange} required placeholder="State / Province" className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors sm:col-span-1" />
                   <input type="text" name="zip" value={formData.zip} onChange={handleChange} required placeholder="ZIP / Postal Code" className="w-full bg-black border border-gray-700 text-white p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors sm:col-span-1" />
                 </div>
                 
                 <select name="country" value={formData.country} onChange={handleChange} required className="w-full bg-black border border-gray-700 text-gray-300 p-4 font-sans text-sm focus:outline-none focus:border-gray-500 rounded transition-colors appearance-none">
                    {COUNTRY_LIST.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                 </select>
               </div>

               <button type="submit" className="w-full py-5 bg-white text-black font-bold uppercase tracking-[0.2em] text-sm hover:bg-gray-200 transition-all rounded shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] mt-8 relative overflow-hidden group">
                 <span className="relative z-10 transition-transform transform group-active:scale-95 block">Continue to Payment</span>
                 <div className="absolute inset-0 bg-gray-300 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom ease-out"></div>
               </button>
             </form>
          ) : (
             <form onSubmit={handlePlaceOrder} className="space-y-10">
                {/* Locked Shipping Summary */}
                <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg flex justify-between items-center shadow-lg">
                   <div>
                      <p className="text-gray-400 text-xs font-mono uppercase tracking-widest mb-1 flex items-center gap-2">
                         <svg className="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                         Shipping To
                      </p>
                      <p className="text-white text-sm font-sans tracking-wide">
                         <span className="font-bold mr-2">{formData.firstName} {formData.lastName}</span>
                         &mdash; {formData.address}, {formData.city}, {formData.zip}
                      </p>
                   </div>
                   <button type="button" onClick={() => setStep(1)} className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-700 hover:text-white hover:border-white transition-colors">Edit</button>
                </div>

                {/* Simulated Payment Methods */}
                <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-lg mt-8 shadow-xl">
                  <h2 className="text-sm font-bold tracking-widest uppercase text-gray-400 mb-6 flex items-center gap-2 border-b border-gray-800 pb-4">
                     <span className="bg-white text-black w-6 h-6 flex items-center justify-center rounded-full text-[10px]">3</span> 
                     Payment Gateway
                  </h2>

                  <div className="space-y-4">
                     
                     {/* Standard Cards */}
                     <label className={`block border ${paymentMethod === 'card' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors max-w-full relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-white w-4 h-4" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-white tracking-[0.1em]">
                              <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><path d="M20 4H4C2.89 4 2 4.89 2 6V18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"/></svg>
                              Credit & Debit
                           </span>
                           <div className="ml-auto flex gap-2">
                              <span className="text-[9px] font-mono bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-300 uppercase shadow-inner">Visa</span>
                              <span className="text-[9px] font-mono bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-300 uppercase hidden sm:inline shadow-inner">Mastercard</span>
                              <span className="text-[9px] font-mono bg-gray-800 border border-gray-700 px-2 py-1 rounded text-gray-300 uppercase shadow-inner">UnionPay</span>
                           </div>
                        </div>
                        {paymentMethod === 'card' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-5 grid grid-cols-2 gap-4 relative z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              <input type="text" placeholder="Card Number" required className="col-span-2 w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-white transition-colors rounded shadow-inner" />
                              <input type="text" placeholder="MM/YY" required className="w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-white transition-colors rounded shadow-inner" />
                              <input type="text" placeholder="CVC" required className="w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-white transition-colors rounded shadow-inner" />
                              <input type="text" placeholder="Name on Card" required className="col-span-2 w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-white transition-colors rounded shadow-inner" />
                           </div>
                        )}
                     </label>

                     {/* PayPak Wrapper */}
                     <label className={`block border ${paymentMethod === 'paypak' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors max-w-full relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="paypak" checked={paymentMethod === 'paypak'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-[#01a752] w-4 h-4" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-[#01a752]">
                              <span className="bg-[#01a752] text-black text-[10px] font-black px-1.5 py-0.5 rounded tracking-tighter">PAYPAK</span>
                              PayPak Domestic
                           </span>
                        </div>
                        {paymentMethod === 'paypak' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-5 relative z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              <input type="text" placeholder="PayPak Card Number" required className="w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-[#01a752] rounded mb-4 shadow-inner transition-colors" />
                              <input type="password" placeholder="PIN / CVV" required className="w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-[#01a752] rounded shadow-inner transition-colors" />
                           </div>
                        )}
                     </label>

                     {/* Easypaisa */}
                     <label className={`block border ${paymentMethod === 'easypaisa' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="easypaisa" checked={paymentMethod === 'easypaisa'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-[#00c569]" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-[#00c569]">
                              <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><path d="M21 18V19C21 20.1 20.1 21 19 21H5C3.89 21 3 20.1 3 19V5C3 3.9 3.89 3 5 3H19C20.1 3 21 3.9 21 5V6H12C10.89 6 10 6.9 10 8V16C10 17.1 10.89 18 12 18H21ZM12 16H22V8H12V16ZM16 13.5C15.17 13.5 14.5 12.83 14.5 12C14.5 11.17 15.17 10.5 16 10.5C16.83 10.5 17.5 11.17 17.5 12C17.5 12.83 16.83 13.5 16 13.5Z"/></svg>
                              Easypaisa
                           </span>
                        </div>
                        {paymentMethod === 'easypaisa' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-5 relative z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              <p className="text-xs text-gray-500 font-mono mb-4 tracking-widest leading-relaxed uppercase">Please ensure your Easypaisa account is active and you have your mobile device nearby to authorize the prompt.</p>
                              <div className="flex border border-gray-700 rounded overflow-hidden focus-within:border-[#00c569] transition-colors shadow-inner">
                                 <div className="bg-gray-800 text-gray-400 font-mono text-sm p-3 border-r border-gray-700 flex items-center">+92</div>
                                 <input type="text" placeholder="3XXXXXXXXX" required className="w-full bg-black text-white p-3 font-mono text-sm focus:outline-none" />
                              </div>
                           </div>
                        )}
                     </label>

                     {/* JazzCash */}
                     <label className={`block border ${paymentMethod === 'jazzcash' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-[#ed1c24]" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-[#ed1c24]">
                              <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><path d="M17 1H7C5.9 1 5 1.9 5 3V21C5 22.1 5.9 23 7 23H17C18.1 23 19 22.1 19 21V3C19 1.9 18.1 1 17 1ZM17 18H7V4H17V18ZM14 20H10V21H14V20Z"/></svg>
                              JazzCash Mobile
                           </span>
                        </div>
                        {paymentMethod === 'jazzcash' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-5 relative z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              <p className="text-xs text-gray-500 font-mono mb-4 tracking-widest leading-relaxed uppercase">Enter your JazzCash number to initiate the remote USSD authorization push notification.</p>
                              <div className="flex border border-gray-700 rounded overflow-hidden focus-within:border-[#ed1c24] transition-colors mb-4 shadow-inner">
                                 <div className="bg-gray-800 text-gray-400 font-mono text-sm p-3 border-r border-gray-700 flex items-center">+92</div>
                                 <input type="text" placeholder="3XXXXXXXXX" required className="w-full bg-black text-white p-3 font-mono text-sm focus:outline-none" />
                              </div>
                              <input type="text" placeholder="Last 6 Digits of CNIC (If prompted)" className="w-full bg-black border border-gray-700 text-white p-3 font-mono text-xs focus:outline-none focus:border-[#ed1c24] transition-colors rounded shadow-inner" />
                           </div>
                        )}
                     </label>

                     {/* Apple Pay */}
                     <label className={`block border ${paymentMethod === 'applepay' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors max-w-full relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="applepay" checked={paymentMethod === 'applepay'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-white w-4 h-4" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-white tracking-[0.1em]">
                              <svg viewBox="0 0 384 512" width="16" height="16" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-1.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9z"/></svg> 
                              Apple Pay
                           </span>
                        </div>
                        {paymentMethod === 'applepay' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-5 relative z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              <p className="text-xs text-gray-500 font-mono tracking-widest leading-relaxed uppercase">Biometric authorization prompt will mount securely via OS-level interface natively over the viewport during execution.</p>
                           </div>
                        )}
                     </label>

                     {/* Google Pay */}
                     <label className={`block border ${paymentMethod === 'googlepay' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors max-w-full relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="googlepay" checked={paymentMethod === 'googlepay'} onChange={(e) => setPaymentMethod(e.target.value)} className="accent-white w-4 h-4" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-widest text-white tracking-[0.1em]">
                              <svg viewBox="0 0 48 48" width="18" height="18"><path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.9c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.13-10.36 7.13-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-1.11-3.26-1.11-6.81 0-10.07l-7.98-6.19C-1.55 18.06-1.55 30.06 2.56 35.81l7.97-6.22z"/><path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                              G Pay
                           </span>
                        </div>
                        {paymentMethod === 'googlepay' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-5 relative z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              <p className="text-xs text-gray-500 font-mono tracking-widest leading-relaxed uppercase">Google Pay secure modal will initialize natively linking straight to your default registered Android cards.</p>
                           </div>
                        )}
                     </label>

                     {/* Cryptocurrency */}
                     <label className={`block border ${paymentMethod === 'crypto' ? 'border-white bg-black' : 'border-gray-800 bg-black/50'} p-4 rounded cursor-pointer transition-colors relative overflow-hidden group`}>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-black opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                        <div className="flex items-center gap-3 relative z-10">
                           <input type="radio" name="paymentMethod" value="crypto" checked={paymentMethod === 'crypto'} onChange={(e) => setPaymentMethod(e.target.value)} className="w-4 h-4 accent-white" />
                           <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-white">
                              <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18"><path d="M13 8H9V6H11V4H9V2H7V4H5V6H7V18H5V20H7V22H9V20H11V22H13V20H14.5C16.43 20 18 18.43 18 16.5C18 14.93 16.97 13.6 15.54 13.15C16.32 12.8 16.7 11.97 16.7 11.5C16.7 9.57 15.13 8 13.2 8H14.5ZM13 18H9V14H13C14.1 14 15 14.9 15 16C15 17.1 14.1 18 13 18ZM13 12H9V8H13C14.1 8 15 8.9 15 10C15 11.1 14.1 12 13 12Z"/></svg>
                              Cryptocurrency (DeFi)
                           </span>
                        </div>
                        {paymentMethod === 'crypto' && (
                           <div className="mt-5 mb-2 border-t border-gray-800 pt-6 relative z-10 text-center pb-4 transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
                              
                              {/* Asset Class Selector */}
                              <div className="flex flex-wrap gap-2 justify-center mb-8 bg-black p-2 border border-gray-800 rounded mx-auto max-w-sm">
                                {Object.keys(CRYPTO_ADDRESSES).map(coin => (
                                  <button type="button" key={coin} onClick={(e) => { e.preventDefault(); setCryptoType(coin); }} className={`px-4 py-2 text-[10px] font-mono tracking-widest uppercase rounded transition-all ${cryptoType === coin ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105' : 'bg-transparent text-gray-500 hover:text-white border border-gray-800'}`}>
                                     {coin}
                                  </button>
                                ))}
                              </div>

                              <div className="w-40 h-40 bg-white mx-auto mb-4 rounded-lg flex items-center justify-center p-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all">
                                 {/* Dynamic Google API QR generator mapped specifically to chosen coin */}
                                 <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${CRYPTO_ADDRESSES[cryptoType]}`} alt={`${cryptoType} QR`} className="opacity-95 transition-opacity" />
                              </div>
                              <p className="text-[10px] text-gray-400 font-mono mb-2 uppercase tracking-widest mt-6">Awaiting {cryptoType.toUpperCase()} transaction parsing on-chain. Send payload natively to:</p>
                              <div className="bg-black border border-gray-700 rounded p-1 flex justify-between items-center max-w-sm mx-auto shadow-inner">
                                 <span className="text-[10px] text-gray-400 font-mono truncate px-4">{CRYPTO_ADDRESSES[cryptoType]}</span>
                                 <button type="button" className="bg-white text-black text-[10px] uppercase tracking-widest font-bold py-2 px-6 rounded hover:bg-gray-300 transition-colors">Copy Link</button>
                              </div>
                           </div>
                        )}
                     </label>

                  </div>
                </div>
                
                {error && <div className="p-4 bg-red-900/50 border border-red-500 rounded text-red-200 text-xs font-mono uppercase tracking-widest text-center shadow-lg">{error}</div>}

                <button type="submit" disabled={isProcessing} className="w-full py-5 bg-white text-black font-bold flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-sm hover:bg-gray-200 transition-all rounded shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] mt-8 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="relative z-10 transition-transform transform group-active:scale-95 flex items-center gap-3">
                     {isProcessing ? (
                        <span className="animate-spin inline-block w-5 h-5 border-[3px] border-black border-t-transparent rounded-full"></span>
                     ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                     )}
                     {isProcessing ? 'Verifying Transaction Sequence...' : `Process ${paymentMethod.toUpperCase()} Execution`}
                  </span>
                  <div className="absolute inset-0 bg-gray-300 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom ease-out"></div>
                </button>
             </form>
          )}
        </div>

        {/* Right Column: Dynamic Live Total Array Block */}
        <div className="lg:col-span-5 xl:col-span-4 mt-8 lg:mt-0">
           <div className="bg-gray-900 border border-gray-800 p-6 sm:p-8 rounded-lg sticky top-28 shadow-2xl">
              <h2 className="text-lg font-bold tracking-[0.2em] uppercase font-sans mb-6 text-white border-b border-gray-800 pb-4">Payload Summary</h2>
              
              <div className="space-y-4 mb-8 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                 {items.map((item) => (
                    <div key={item.product._id} className="flex items-center gap-4 bg-black p-4 rounded border border-gray-800">
                       <div className="relative">
                          <img src={item.product.images[0]} alt={item.product.title} className="w-16 h-20 object-cover rounded bg-gray-900" />
                          <span className="absolute -top-2 -right-2 bg-gray-700 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-mono shadow-xl border border-black">{item.quantity}</span>
                       </div>
                       <div className="flex-1">
                          <h3 className="text-xs font-bold text-gray-200 uppercase tracking-widest break-words leading-relaxed">{item.product.title}</h3>
                          <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-widest">{item.product.category || item.product.categories?.[0]}</p>
                       </div>
                       <p className="text-sm font-bold font-mono tracking-widest text-white">${(item.product.price * item.quantity).toFixed(2)}</p>
                    </div>
                 ))}
              </div>

              <div className="space-y-4 text-xs font-mono tracking-widest text-gray-400 border-t border-gray-800 pt-8 uppercase">
                 <div className="flex justify-between">
                    <span>Cart Subtotal</span>
                    <span className="text-white">${getCartTotal().toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span>Shipping Execution</span>
                    <span className="text-white">Complimentary</span>
                 </div>
                 <div className="flex justify-between pt-6 border-t border-gray-800 text-xl font-sans tracking-[0.2em]">
                    <span className="uppercase font-bold text-white">Final Total</span>
                    <span className="font-bold text-white">${getCartTotal().toFixed(2)}</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
