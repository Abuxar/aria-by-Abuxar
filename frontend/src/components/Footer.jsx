import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-dark border-t border-gray-800 text-gray-400 py-12 text-sm font-sans mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-white text-lg font-bold tracking-widest mb-4">ARIA</h2>
          <p className="mb-4">E-Commerce Blueprint<br/>Design System Alpha</p>
          <div className="flex space-x-4">
            <span className="cursor-pointer hover:text-white transition-colors">Instagram</span>
            <span className="cursor-pointer hover:text-white transition-colors">Twitter</span>
          </div>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Products</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Information</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-semibold mb-4 uppercase text-xs tracking-wider">Newsletter</h3>
          <p className="mb-4 text-xs">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <div className="flex">
            <input type="email" placeholder="Email address" className="bg-gray-900 border border-gray-700 text-white px-4 py-2 w-full focus:outline-none focus:border-gray-500 rounded-l-md" />
            <button className="bg-white text-black px-4 py-2 font-bold hover:bg-gray-200 transition-colors rounded-r-md">SUBSCRIBE</button>
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-xs">
        <p>&copy; {new Date().getFullYear()} Aria E-Commerce. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
