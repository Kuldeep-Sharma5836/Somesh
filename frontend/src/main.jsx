import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const AuthWrapper = ({ children }) =>
  googleClientId ? (
    <GoogleOAuthProvider clientId={googleClientId}>{children}</GoogleOAuthProvider>
  ) : (
    children
  );

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthWrapper>
        <AuthProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </AuthWrapper>
    </BrowserRouter>
  </StrictMode>,
);
