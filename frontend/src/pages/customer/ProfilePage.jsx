import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/common/Spinner';
import { useAuth } from '../../context/AuthContext';
import formatCurrency from '../../utils/formatCurrency';

const ProfilePage = () => {
  const { user, refreshProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          axiosClient.get('/users/profile'),
          axiosClient.get('/orders/mine'),
        ]);
        setProfile(profileRes.data);
        setOrders(ordersRes.data);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.put('/users/profile', profile);
      await refreshProfile();
      toast.success('Profile updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not update profile');
    }
  };

  if (loading) return <Spinner label="Loading profile..." />;

  return (
    <section className="grid gap-6 lg:grid-cols-[380px_1fr]">
      <form className="card h-fit space-y-3" onSubmit={saveProfile}>
        <h1 className="font-display text-3xl font-semibold text-maroon">My Profile</h1>
        <input
          value={profile.name}
          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
        />
        <input
          value={profile.email}
          disabled
          className="w-full rounded-lg border border-gold/30 bg-gray-100 px-3 py-2 text-sm"
        />
        <textarea
          value={profile.addresses?.[0]?.street || ''}
          onChange={(e) =>
            setProfile({
              ...profile,
              addresses: [
                {
                  ...(profile.addresses?.[0] || {}),
                  street: e.target.value,
                  fullName: profile.name,
                  city: profile.addresses?.[0]?.city || 'Varanasi',
                  state: profile.addresses?.[0]?.state || 'UP',
                  postalCode: profile.addresses?.[0]?.postalCode || '221001',
                  country: 'India',
                  phone: profile.addresses?.[0]?.phone || '9999999999',
                },
              ],
            })
          }
          placeholder="Address"
          className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
        />
        <button type="submit" className="btn-primary w-full">
          Save Profile
        </button>
      </form>

      <section className="card">
        <h2 className="font-display text-3xl font-semibold text-maroon">Order History</h2>
        <div className="mt-4 space-y-3">
          {orders.length === 0 ? (
            <p className="text-sm text-maroon/70">No orders yet.</p>
          ) : (
            orders.map((order) => (
              <article key={order._id} className="rounded-xl border border-gold/20 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-maroon">Order #{order._id.slice(-6).toUpperCase()}</p>
                  <span className="rounded-full bg-beige px-3 py-1 text-xs font-semibold uppercase text-maroon">
                    {order.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-maroon/70">
                  Items: {order.orderItems.length} | Total: {formatCurrency(order.totalPrice)}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </section>
  );
};

export default ProfilePage;
