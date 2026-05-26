import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      await loginAdmin(form);
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <section className="container-pad py-10">
      <div className="mx-auto max-w-md card">
        <h1 className="font-display text-3xl font-semibold text-maroon">Admin Login</h1>
        <p className="mt-2 text-sm text-maroon/70">Use your admin credentials to access dashboard.</p>
        <form className="mt-5 space-y-3" onSubmit={submit}>
          <input
            type="email"
            required
            placeholder="Admin email"
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            required
            placeholder="Password"
            className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="btn-primary w-full">
            Enter Dashboard
          </button>
        </form>
      </div>
    </section>
  );
};

export default AdminLoginPage;
