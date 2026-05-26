import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import PhonePromptModal from '../../components/common/PhonePromptModal';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phone, setPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const { login, loginWithGoogle, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const from = location.state?.from?.pathname || '/profile';

  const submit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(form);
      navigate(user.role === 'admin' ? '/admin/dashboard' : from);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  const savePhone = async () => {
    try {
      setSavingPhone(true);
      await axiosClient.put('/users/profile', { phone });
      await refreshProfile();
      setShowPhonePrompt(false);
      navigate(from);
      toast.success('Phone saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save phone');
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <section className="mx-auto max-w-md card">
      <h1 className="font-display text-3xl font-semibold text-maroon">Login</h1>
      <form className="mt-5 space-y-3" onSubmit={submit}>
        <input
          type="email"
          required
          placeholder="Email"
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
          Login
        </button>
      </form>
      {googleClientId && (
        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                const user = await loginWithGoogle(credentialResponse.credential);
                if (!user.phone) {
                  setShowPhonePrompt(true);
                  return;
                }
                navigate(user.role === 'admin' ? '/admin/dashboard' : from);
              } catch (error) {
                toast.error(error.response?.data?.message || 'Google login failed');
              }
            }}
            onError={() => toast.error('Google login failed')}
            useOneTap
          />
        </div>
      )}
      <PhonePromptModal
        open={showPhonePrompt}
        phone={phone}
        onChange={setPhone}
        onSave={savePhone}
        loading={savingPhone}
      />
      <p className="mt-4 text-sm text-maroon/70">
        New user?{' '}
        <Link to="/signup" className="font-semibold text-saffron">
          Create account
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;
