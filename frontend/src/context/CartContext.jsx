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

  const getSizeQty = (product, size) => {
    const entry = product?.sizes?.find((item) => item.size === size);
    if (entry) return entry.qty;
    return product?.countInStock || 0;
  };

  const addToCart = (product, qty = 1, size = 'M') => {
    const existing = cartItems.find((item) => item._id === product._id && item.size === size);
    const fallbackImage = 'https://via.placeholder.com/150x150?text=Dhruv+Global+Trading+Company';
    const sizeQty = getSizeQty(product, size);

    if (sizeQty <= 0) {
      toast.error('Selected size is out of stock');
      return;
    }

    if (existing) {
      const updated = cartItems.map((item) => {
        if (item._id !== product._id || item.size !== size) return item;
        const nextQty = Math.min(item.qty + qty, sizeQty);
        return { ...item, qty: nextQty, sizeQty };
      });
      persist(updated);
    } else {
      const initialQty = Math.min(qty, sizeQty);
      persist([
        ...cartItems,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: resolveAssetUrl(product.images?.[0]) || fallbackImage,
          countInStock: product.countInStock,
          size,
          sizeQty,
          qty: initialQty,
        },
      ]);
    }

    toast.success('Added to cart');
  };

  const updateQty = (_id, size, qty) => {
    const updated = cartItems.map((item) => {
      if (item._id !== _id || item.size !== size) return item;
      const maxQty = item.sizeQty || item.countInStock || 0;
      const nextQty = Math.min(Math.max(Number(qty), 1), maxQty || 1);
      return { ...item, qty: nextQty };
    });
    persist(updated);
  };

  const removeFromCart = (_id, size) => {
    persist(cartItems.filter((item) => item._id !== _id || item.size !== size));
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
