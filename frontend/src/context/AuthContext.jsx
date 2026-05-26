import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('divineaura_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axiosClient.get('/auth/me');
        setUser(data);
      } catch (error) {
        localStorage.removeItem('divineaura_token');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (payload) => {
    const { data } = await axiosClient.post('/auth/login', payload);
    localStorage.setItem('divineaura_token', data.token);
    setUser(data);
    toast.success(`Welcome back, ${data.name}`);
    return data;
  };

  const loginAdmin = async (payload) => {
    const { data } = await axiosClient.post('/auth/admin/login', payload);
    localStorage.setItem('divineaura_token', data.token);
    setUser(data);
    toast.success(`Welcome back, ${data.name}`);
    return data;
  };

  const signup = async (payload) => {
    const { data } = await axiosClient.post('/auth/register', payload);
    localStorage.setItem('divineaura_token', data.token);
    setUser(data);
    toast.success('Account created successfully');
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const { data } = await axiosClient.post('/auth/google', { credential });
    localStorage.setItem('divineaura_token', data.token);
    setUser(data);
    toast.success(`Welcome, ${data.name}`);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('divineaura_token');
    setUser(null);
    toast.success('Logged out');
  };

  const refreshProfile = async () => {
    const { data } = await axiosClient.get('/users/profile');
    setUser(data);
    return data;
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      login,
      loginAdmin,
      signup,
      loginWithGoogle,
      logout,
      refreshProfile,
      setUser,
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
