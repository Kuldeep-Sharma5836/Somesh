import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import formatCurrency from '../../utils/formatCurrency';

const loadScript = (src) =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const CartPage = () => {
  const { cartItems, updateQty, removeFromCart, totals, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const checkout = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }

    try {
      const fallbackImage = 'https://via.placeholder.com/150x150?text=Dhruv+Global+Trading+Company';
      const orderPayload = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image || fallbackImage,
          qty: item.qty,
          price: item.price,
        })),
        shippingAddress: {
          fullName: 'Default User',
          phone: '9999999999',
          street: 'Temple Street',
          city: 'Varanasi',
          state: 'UP',
          postalCode: '221001',
          country: 'India',
        },
      };

      if (paymentMethod === 'RAZORPAY') {
        const loaded = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
        if (!loaded) {
          toast.error('Razorpay SDK failed to load');
          return;
        }

        const { data: orderData } = await axiosClient.post('/payments/razorpay/order', orderPayload);

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          order_id: orderData.orderId,
          name: 'Dhruv Global Trading Company',
          description: 'Order payment',
          handler: async (response) => {
            try {
              await axiosClient.post('/payments/razorpay/verify', {
                ...orderPayload,
                payment: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                },
              });
              toast.success('Payment successful');
              clearCart();
              navigate('/profile');
            } catch (error) {
              toast.error(error.response?.data?.message || 'Payment verification failed');
            }
          },
          theme: { color: '#9D174D' },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
        return;
      }

      await axiosClient.post('/orders', { ...orderPayload, paymentMethod: 'COD' });

      toast.success('Order placed successfully');
      clearCart();
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Checkout failed');
    }
  };

  return (
    <section>
      <h1 className="font-display text-3xl font-semibold text-maroon">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div className="mt-6 card text-center">
          <p className="text-sm text-maroon/70">Your cart is empty.</p>
          <Link to="/products" className="btn-primary mt-4 inline-block">
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-3">
            {cartItems.map((item) => (
              <article key={item._id} className="card flex flex-col gap-3 sm:flex-row sm:items-center">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-semibold text-maroon">{item.name}</p>
                  <p className="text-sm text-saffron">{formatCurrency(item.price)}</p>
                </div>
                <input
                  type="number"
                  min={1}
                  max={item.countInStock}
                  value={item.qty}
                  onChange={(e) => updateQty(item._id, e.target.value)}
                  className="w-20 rounded-lg border border-gold/30 px-2 py-1 text-sm"
                />
                <button type="button" className="text-sm font-semibold text-maroon" onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </article>
            ))}
          </div>

          <aside className="card h-fit space-y-2">
            <h2 className="font-display text-2xl font-semibold text-maroon">Order Summary</h2>
            <p className="text-sm">Subtotal: {formatCurrency(totals.subtotal)}</p>
            <p className="text-sm">Shipping: {formatCurrency(totals.shipping)}</p>
            <p className="text-sm">Tax: {formatCurrency(totals.tax)}</p>
            <p className="pt-2 text-lg font-semibold text-saffron">Total: {formatCurrency(totals.total)}</p>
            <label className="mt-2 block text-sm font-semibold text-maroon">
              Payment Method
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
              >
                <option value="COD">Cash on Delivery</option>
                <option value="RAZORPAY">Razorpay (UPI/Card/Netbanking)</option>
              </select>
            </label>
            <button type="button" className="btn-primary mt-3 w-full" onClick={checkout}>
              {paymentMethod === 'RAZORPAY' ? 'Pay Now' : 'Checkout'}
            </button>
          </aside>
        </div>
      )}
    </section>
  );
};

export default CartPage;
