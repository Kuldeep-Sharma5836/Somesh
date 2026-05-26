import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const itemStyle = ({ isActive }) =>
  `block rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? 'bg-saffron text-white' : 'text-maroon/80 hover:bg-gold/20'
  }`;

const AdminLayout = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-cream/80">
      <div className="container-pad grid gap-6 py-6 md:grid-cols-[240px_1fr]">
        <aside className="card h-fit">
          <Link to="/admin/dashboard" className="font-display text-2xl font-semibold text-maroon">
            DivineAura Admin
          </Link>
          <nav className="mt-6 space-y-2">
            <NavLink to="/admin/dashboard" className={itemStyle}>
              Dashboard
            </NavLink>
            <NavLink to="/admin/products" className={itemStyle}>
              Products
            </NavLink>
            <NavLink to="/admin/categories" className={itemStyle}>
              Categories
            </NavLink>
            <NavLink to="/admin/users" className={itemStyle}>
              Users
            </NavLink>
            <NavLink to="/admin/orders" className={itemStyle}>
              Orders
            </NavLink>
          </nav>
          <button type="button" className="btn-secondary mt-6 w-full" onClick={logout}>
            Logout
          </button>
        </aside>
        <section className="card min-h-[70vh]">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;
