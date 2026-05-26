import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import formatCurrency from '../../utils/formatCurrency';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const { data } = await axiosClient.get('/orders');
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosClient.put(`/orders/${id}/status`, { status });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon">Manage Orders</h1>
      <div className="mt-5 space-y-3">
        {orders.map((order) => (
          <article key={order._id} className="rounded-xl border border-gold/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-maroon">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-maroon/70">{order.user?.name} • {order.user?.email}</p>
                <p className="text-xs text-maroon/70">Total: {formatCurrency(order.totalPrice)}</p>
              </div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon/70">
                Status
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="mt-2 w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
