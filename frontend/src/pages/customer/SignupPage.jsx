import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import PhonePromptModal from '../../components/common/PhonePromptModal';

const SignupPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPhonePrompt, setShowPhonePrompt] = useState(false);
  const [phone, setPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const { signup, loginWithGoogle, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const submit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed');
    }
  };

  const savePhone = async () => {
    try {
      setSavingPhone(true);
      await axiosClient.put('/users/profile', { phone });
      await refreshProfile();
      setShowPhonePrompt(false);
      navigate('/profile');
      toast.success('Phone saved');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save phone');
    } finally {
      setSavingPhone(false);
    }
  };

  return (
    <section className="mx-auto max-w-md card">
      <h1 className="font-display text-3xl font-semibold text-maroon">Create Account</h1>
      <form className="mt-5 space-y-3" onSubmit={submit}>
        <input
          required
          placeholder="Full Name"
          className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="tel"
          required
          placeholder="Phone"
          className="w-full rounded-lg border border-gold/30 px-3 py-2 text-sm"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          Signup
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
                navigate('/profile');
              } catch (error) {
                toast.error(error.response?.data?.message || 'Google signup failed');
              }
            }}
            onError={() => toast.error('Google signup failed')}
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
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-saffron">
          Login
        </Link>
      </p>
    </section>
  );
};

export default SignupPage;
