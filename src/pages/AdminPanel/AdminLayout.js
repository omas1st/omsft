import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="admin-layout">
      <nav className="admin-navbar">
        <h2>Admin Panel</h2>
        <div className="nav-links">
          <Link to="/admin/users" className={isActive('/admin/users')}>
            Users
          </Link>
          <Link to="/admin/deposits-withdrawals" className={isActive('/admin/deposits-withdrawals')}>
            Deposits &amp; Withdrawals
          </Link>
          <Link to="/admin/settings" className={isActive('/admin/settings')}>
            Settings
          </Link>
        </div>
      </nav>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;