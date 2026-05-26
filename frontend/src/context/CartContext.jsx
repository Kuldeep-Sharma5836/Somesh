import { createContext, useContext, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import resolveAssetUrl from '../utils/resolveAssetUrl';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const data = localStorage.getItem('dhruvglobaltradingcompany_cart');
    return data ? JSON.parse(data) : [];
  });

  const persist = (items) => {
    setCartItems(items);
    localStorage.setItem('dhruvglobaltradingcompany_cart', JSON.stringify(items));
  };

  const addToCart = (product, qty = 1) => {
    const existing = cartItems.find((item) => item._id === product._id);
    const fallbackImage = 'https://via.placeholder.com/150x150?text=Dhruv+Global+Trading+Company';

    if (existing) {
      const updated = cartItems.map((item) =>
        item._id === product._id ? { ...item, qty: item.qty + qty } : item
      );
      persist(updated);
    } else {
      persist([
        ...cartItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: resolveAssetUrl(product.images?.[0]) || fallbackImage,
          countInStock: product.countInStock,
          qty,
        },
      ]);
    }

    toast.success('Added to cart');
  };

  const updateQty = (_id, qty) => {
    const updated = cartItems.map((item) =>
      item._id === _id ? { ...item, qty: Number(qty) } : item
    );
    persist(updated);
  };

  const removeFromCart = (_id) => {
    persist(cartItems.filter((item) => item._id !== _id));
    toast.success('Removed from cart');
  };

  const clearCart = () => persist([]);

  const totals = useMemo(() => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shipping = subtotal > 999 ? 0 : 79;
    const tax = subtotal * 0.05;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  }, [cartItems]);

  const value = useMemo(
    () => ({ cartItems, addToCart, updateQty, removeFromCart, clearCart, totals }),
    [cartItems, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
