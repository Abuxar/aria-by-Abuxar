import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AdminLayout from './pages/admin/AdminLayout';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark flex flex-col font-sans antialiased text-light selection:bg-gray-700 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<ProductList />} />
              <Route path="products/:id/edit" element={<ProductEdit />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
