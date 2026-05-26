import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const navStyle = ({ isActive }) =>
  `text-sm font-semibold transition ${isActive ? 'text-maroon' : 'text-maroon/75 hover:text-maroon'}`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/products?search=${encodeURIComponent(search)}`);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gold/20 bg-cream/95 backdrop-blur">
      <div className="container-pad flex flex-wrap items-center justify-between gap-4 py-4">
        <Link to="/" className="font-display text-3xl font-bold text-maroon">
          Dhruv Global Trading Company
        </Link>

        <form onSubmit={submitSearch} className="hidden items-center md:flex">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search spiritual products"
            className="w-56 rounded-full border border-gold/30 bg-white px-3 py-2 text-xs"
          />
        </form>

        <nav className="flex items-center gap-4 md:gap-6">
          <NavLink to="/" className={navStyle}>
            Home
          </NavLink>
          <NavLink to="/products" className={navStyle}>
            Products
          </NavLink>
          <NavLink to="/cart" className={navStyle}>
            Cart ({cartItems.length})
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={navStyle}>
                {user.name}
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin/dashboard" className={navStyle}>
                  Admin
                </NavLink>
              )}
              <button type="button" className="text-sm font-semibold text-maroon/75" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navStyle}>
                Login
              </NavLink>
              <NavLink to="/signup" className="btn-primary">
                Signup
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
