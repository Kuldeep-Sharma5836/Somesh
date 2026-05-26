import { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Spinner from '../../components/common/Spinner';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({ products: 0, categories: 0, users: 0, orders: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories, users, orders] = await Promise.all([
          axiosClient.get('/products'),
          axiosClient.get('/categories'),
          axiosClient.get('/users'),
          axiosClient.get('/orders'),
        ]);

        setStats({
          products: products.data.length,
          categories: categories.data.length,
          users: users.data.length,
          orders: orders.data.length,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const cards = [
    { title: 'Products', value: stats.products },
    { title: 'Categories', value: stats.categories },
    { title: 'Users', value: stats.users },
    { title: 'Orders', value: stats.orders },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-semibold text-maroon">Dashboard Overview</h1>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.title} className="rounded-xl border border-gold/25 bg-beige/40 p-4">
            <p className="text-sm text-maroon/70">{card.title}</p>
            <p className="mt-2 font-display text-4xl font-semibold text-saffron">{card.value}</p>
          </article>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
