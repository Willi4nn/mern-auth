import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import EmailVerify from './components/auth/EmailVerify';
import ForgotPassword from './components/auth/ForgotPassword';
import Login from './components/auth/Login';
import PasswordReset from './components/auth/PasswordReset';
import Register from './components/auth/Register';
import AuthProvider from './contexts/AuthProvider';
import ProtectedRoute from './contexts/ProtectedRoute';
import './index.css';
import ProtectedPage from './pages/protectedPage';

export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path='/protected-page' element={<ProtectedRoute />}>
            <Route path="/protected-page" element={<ProtectedPage />} />
          </Route>
          <Route path="/users/:id/verify/:token" element={<EmailVerify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/password-reset/:id/:token" element={<PasswordReset />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter >
  );
}
