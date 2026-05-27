import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import formatCurrency from '../../utils/formatCurrency';

const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  const orderStats = orders.reduce(
    (acc, order) => {
      acc.total += 1;
      acc.byStatus[order.status] = (acc.byStatus[order.status] || 0) + 1;
      if (order.isDelivered || order.status === 'delivered') {
        acc.delivered += 1;
      }
      return acc;
    },
    { total: 0, delivered: 0, byStatus: {} }
  );

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

  const deleteOrder = async (order) => {
    if (!window.confirm(`Delete order #${order._id.slice(-6).toUpperCase()}?`)) return;

    try {
      await axiosClient.delete(`/orders/${order._id}`);
      toast.success('Order deleted');
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Delete failed');
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((order) => order.status === statusFilter);

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon">Manage Orders</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-xl border border-gold/25 bg-beige/40 p-4">
          <p className="text-sm text-maroon/70">Total Orders</p>
          <p className="mt-2 font-display text-4xl font-semibold text-saffron">{orderStats.total}</p>
        </article>
        <article className="rounded-xl border border-gold/25 bg-beige/40 p-4">
          <p className="text-sm text-maroon/70">Delivered</p>
          <p className="mt-2 font-display text-4xl font-semibold text-saffron">{orderStats.delivered}</p>
        </article>
        <article className="rounded-xl border border-gold/25 bg-beige/40 p-4">
          <p className="text-sm text-maroon/70">Pending</p>
          <p className="mt-2 font-display text-4xl font-semibold text-saffron">{orderStats.byStatus.pending || 0}</p>
        </article>
        <article className="rounded-xl border border-gold/25 bg-beige/40 p-4">
          <p className="text-sm text-maroon/70">Cancelled</p>
          <p className="mt-2 font-display text-4xl font-semibold text-saffron">{orderStats.byStatus.cancelled || 0}</p>
        </article>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={
            statusFilter === 'all'
              ? 'rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'
              : 'rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon'
          }
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('pending')}
          className={
            statusFilter === 'pending'
              ? 'rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'
              : 'rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon'
          }
        >
          New
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('processing')}
          className={
            statusFilter === 'processing'
              ? 'rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'
              : 'rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon'
          }
        >
          Processing
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('shipped')}
          className={
            statusFilter === 'shipped'
              ? 'rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'
              : 'rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon'
          }
        >
          Shipped
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('delivered')}
          className={
            statusFilter === 'delivered'
              ? 'rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'
              : 'rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon'
          }
        >
          Delivered
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('cancelled')}
          className={
            statusFilter === 'cancelled'
              ? 'rounded-full bg-maroon px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white'
              : 'rounded-full border border-maroon/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon'
          }
        >
          Cancelled
        </button>
      </div>
      <div className="mt-5 space-y-3">
        {filteredOrders.map((order) => (
          <article key={order._id} className="rounded-xl border border-gold/20 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-maroon">Order #{order._id.slice(-6).toUpperCase()}</p>
                <p className="text-xs text-maroon/70">
                  {order.user?.name} • {order.user?.email}
                  {order.user?.phone ? ` • ${order.user.phone}` : ' • Not updated'}
                </p>
                <p className="text-xs text-maroon/70">Total: {formatCurrency(order.totalPrice)}</p>
                {order.shippingAddress ? (
                  <div className="mt-2 text-xs text-maroon/70">
                    <p className="font-semibold text-maroon">Delivery Address</p>
                    <p>{order.shippingAddress.fullName} • {order.shippingAddress.phone}</p>
                    <p>
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.postalCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                ) : null}
              </div>
              <div className="flex flex-col gap-3">
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
                {(order.isDelivered || order.status === 'delivered') && (
                  <button
                    type="button"
                    className="rounded-lg border border-maroon/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-maroon"
                    onClick={() => deleteOrder(order)}
                  >
                    Delete Order
                  </button>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersPage;
