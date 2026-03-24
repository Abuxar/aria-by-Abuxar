import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      // UI Actions
      toggleDrawer: (isOpen) => set({ isDrawerOpen: isOpen !== undefined ? isOpen : !get().isDrawerOpen }),

      // Cart Actions
      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find((item) => item.product._id === product._id);

        if (existingItem) {
          // Increment quantity, rigorously capped by active product stock metrics
          const newQuantity = Math.min(existingItem.quantity + quantity, product.stock);
          set({
            items: items.map((item) =>
              item.product._id === product._id ? { ...item, quantity: newQuantity } : item
            ),
            isDrawerOpen: true, // Spring sequence to reveal payload context
          });
        } else {
          set({ 
            items: [...items, { product, quantity: Math.min(quantity, product.stock) }],
            isDrawerOpen: true 
          });
        }
      },

      removeFromCart: (productId) => {
        set({ items: get().items.filter((item) => item.product._id !== productId) });
      },

      updateQuantity: (productId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.product._id === productId 
              ? { ...item, quantity: Math.max(1, Math.min(quantity, item.product.stock)) } 
              : item
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      // Immutable Derived Selectors preventing mathematical drifting globally 
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.product.price * item.quantity, 0);
      },
      
      getCartCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },

      // Rehydration & Native Integrity Validation
      rehydrateCart: async () => {
        const { items } = get();
        if (items.length === 0) return;

        try {
          // Sync against core MongoDB payloads natively ignoring local staleness
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const { data: allProducts } = await axios.get(`${API_URL}/products`);
          
          const validItems = items.reduce((acc, item) => {
             const freshProduct = allProducts.find(p => p._id === item.product._id);
             // Ensure it exists, is active (not deactivated by admin), and possesses non-zero stock
             if (freshProduct && freshProduct.isActive !== false && freshProduct.stock > 0) {
                // Update product data to freshest, and cap quantity strictly by current stock
                acc.push({
                   ...item,
                   product: freshProduct,
                   quantity: Math.min(item.quantity, freshProduct.stock)
                });
             }
             return acc;
          }, []);

          set({ items: validItems });
        } catch (error) {
          console.error("Failed to rehydrate cart structurally:", error);
        }
      }
    }),
    {
      name: 'aria-cart-storage', // Identifies native local storage hash 
      partialize: (state) => ({ items: state.items }), // Persist ONLY items array, discard active UI drawer states safely
    }
  )
);
