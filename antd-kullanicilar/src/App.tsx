import React from 'react';
import 'antd/dist/reset.css';
import { BrowserRouter } from 'react-router-dom';

import SidebarLayout from './layout/SidebarLayout';
import { AuthProvider, useAuth } from './features/auth';
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import './features/auth/auth.css';
import { FavoritesProvider } from './features/products/favorites'; // ✅

function Gate() {
  const { view } = useAuth();
  if (view === 'login') return <LoginPage />;
  if (view === 'register') return <RegisterPage />;
  return <SidebarLayout />;
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>{/* ✅ */}
        <BrowserRouter>
          <Gate />
        </BrowserRouter>
      </FavoritesProvider>
    </AuthProvider>
  );
}
