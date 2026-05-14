import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage from './pages/DashboardPage';
import ManageAccountPage from './pages/ManageAccountPage';
import DepositPage from './pages/DepositPage';
import WithdrawPage from './pages/WithdrawPage';
import TransferPage from './pages/TransferPage';
import MetatraderDetailsPage from './pages/MetatraderDetailsPage';

// Admin pages
import AdminLayout from './pages/AdminPanel/AdminLayout';
import AdminUsersPage from './pages/AdminPanel/AdminUsersPage';
import AdminDepositWithdrawalPage from './pages/AdminPanel/AdminDepositWithdrawalPage';
import AdminSettingsPage from './pages/AdminPanel/AdminSettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* User routes */}
          <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/manage-account" element={<PrivateRoute><ManageAccountPage /></PrivateRoute>} />
          <Route path="/deposit" element={<PrivateRoute><DepositPage /></PrivateRoute>} />
          <Route path="/withdraw" element={<PrivateRoute><WithdrawPage /></PrivateRoute>} />
          <Route path="/transfer" element={<PrivateRoute><TransferPage /></PrivateRoute>} />
          <Route path="/metatrader-details" element={<PrivateRoute><MetatraderDetailsPage /></PrivateRoute>} />

          {/* Admin routes – nested layout */}
          <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminLayout /></PrivateRoute>}>
            <Route index element={<AdminUsersPage />} />  {/* default when /admin is hit */}
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="deposits-withdrawals" element={<AdminDepositWithdrawalPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;