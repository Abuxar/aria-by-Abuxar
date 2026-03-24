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
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import AdminCarouselList from './pages/admin/AdminCarouselList';
import AdminCarouselEdit from './pages/admin/AdminCarouselEdit';
import AdminCategoryManager from './pages/admin/AdminCategoryManager';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import CartDrawer from './components/CartDrawer';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import { useCartStore } from './store/cartStore';

function App() {
  const { rehydrateCart } = useCartStore();

  React.useEffect(() => {
    rehydrateCart();
  }, [rehydrateCart]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-dark flex flex-col font-sans antialiased text-light selection:bg-gray-700 selection:text-white">
        <Navbar />
        <CartDrawer />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Account />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
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
            <Route path="/admin/categories" element={
              <AdminLayout>
                <AdminCategoryManager />
              </AdminLayout>
            } />
            <Route path="/admin/orders" element={
              <AdminLayout>
                <AdminOrderList />
              </AdminLayout>
            } />
            <Route path="/admin/orders/:id" element={
              <AdminLayout>
                <AdminOrderDetail />
              </AdminLayout>
            } />
          </Routes>
          <Routes>
            <Route path="/:category" element={<Shop />} />
            <Route path="/:category/:subcategory" element={<Shop />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
