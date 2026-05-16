import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import TradeSection from '../components/TradeSection';
import { useNavigate } from 'react-router-dom';
import './TradePage.css';

const TradePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // If no user (should be protected), redirect
  if (!user) {
    navigate('/login');
    return null;
  }

  // Balance is available via user object from AuthContext (updated after dashboard fetch)
  const balance = user?.balance || 0;

  return (
    <div className="trade-page">
      <h2>Trading Dashboard</h2>
      <TradeSection balance={balance} />
    </div>
  );
};

export default TradePage;