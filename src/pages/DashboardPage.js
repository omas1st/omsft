// src/pages/DashboardPage.js
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchDashboard, getReferralCode } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '../components/NotificationIcon';
import TradingViewWidget from '../components/TradingViewWidget';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [activeTab, setActiveTab] = useState('open');

  useEffect(() => {
    fetchDashboard()
      .then(res => setDashboard(res.data))
      .catch(() => {});
  }, []);

  const handleReferral = async () => {
    try {
      const res = await getReferralCode();
      setReferralCode(res.data.code);
      setShowReferral(true);
    } catch (err) {
      alert('Failed to get referral code');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Full‑screen centered loading
  if (!dashboard) {
    return (
      <div className="dashboard-loader">
        <div className="loader-ring"></div>
      </div>
    );
  }

  const { account, balance } = dashboard;
  const hasDeposit = balance > 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <NotificationIcon />
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          🚪 Logout
        </button>
      </div>
      <h1>Welcome, {user.email}</h1>
      <div className="account-info">
        <div>Standard MT5 Account: #{account.number}</div>
        <div>Real, MT5 Standard</div>
        <div className="balance">
          Balance: {showBalance ? `$${balance.toFixed(2)}` : '****'}
          <button onClick={() => setShowBalance(!showBalance)}>
            {showBalance ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="action-buttons">
        <button onClick={() => navigate('/manage-account')}>Manage</button>
        <button onClick={() => navigate('/deposit')}>Deposit</button>
        <button onClick={() => navigate('/withdraw')}>Withdraw</button>
        <button onClick={() => navigate('/transfer')}>Transfer</button>
        <button onClick={handleReferral}>Refer a Friend</button>
        <button onClick={() => navigate('/metatrader-details')}>
          Metatrader Login Details
        </button>
      </div>

      {showReferral && (
        <div className="referral-popup">
          <p>
            Your unique referral code: <strong>{referralCode}</strong>
          </p>
          <p>Earn $20 when your referral makes their first deposit.</p>
          <button onClick={() => setShowReferral(false)}>Close</button>
        </div>
      )}

      <div className="portfolio">
        <h3>My Portfolio</h3>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'open' ? 'active' : ''}`}
            onClick={() => setActiveTab('open')}
          >
            Open Trades
          </button>
          <button
            className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending Trades
          </button>
          <button
            className={`tab ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed Trades
          </button>
        </div>
        <div className="tab-content">
          {activeTab === 'open' &&
            (hasDeposit ? (
              <p>Start trading now.</p>
            ) : (
              <p>No open positions. Deposit and start earning now.</p>
            ))}
          {activeTab === 'pending' && <p>No pending orders at the moment.</p>}
          {activeTab === 'closed' && <p>Your closed positions will appear here.</p>}
        </div>
      </div>

      <div className="market-section">
        <h3>Market</h3>
        <TradingViewWidget />
      </div>
    </div>
  );
};

export default DashboardPage;