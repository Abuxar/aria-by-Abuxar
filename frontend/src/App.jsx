import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import AdminLayout from '../layouts/AdminLayout';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import AdminCarouselList from './pages/admin/AdminCarouselList';
import AdminCarouselEdit from './pages/admin/AdminCarouselEdit';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-dark flex flex-col font-sans antialiased text-light selection:bg-gray-700 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="products" element={<ProductList />} />
            </Route>
            <Route path="/admin/products/:id/edit" element={
              <AdminLayout>
                <ProductEdit />
              </AdminLayout>
            } />
            <Route path="/admin/carousels" element={
              <AdminLayout>
                <AdminCarouselList />
              </AdminLayout>
            } />
            <Route path="/admin/carousels/:id/edit" element={
              <AdminLayout>
                <AdminCarouselEdit />
              </AdminLayout>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
