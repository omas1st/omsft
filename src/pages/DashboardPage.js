import React, { useContext, useEffect, useState, useRef } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchDashboard, getReferralCode, getUserTrades, updateTradeTP_SL, closeTrade as closeTradeAPI } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import NotificationIcon from '../components/NotificationIcon';
import GmailContactIcon from '../components/GmailContactIcon';
import TradingViewWidget from '../components/TradingViewWidget';
import TradeSection from '../components/TradeSection';
import './DashboardPage.css';

// Get a random profit addition for one second based on lot size,
// derived from the per-minute ranges.
const getSecondIncrement = (lots) => {
  let perMinuteRange;
  if (lots <= 0.09) {
    perMinuteRange = 0.9;       // $0.2–0.9 per minute, use max
  } else if (lots <= 0.9) {
    perMinuteRange = 10;       // $1–10 per minute
  } else if (lots <= 10) {
    perMinuteRange = 100;     // $10–100 per minute
  } else {
    perMinuteRange = 1000;    // $100–1000 per minute
  }
  // Random between 0.2 and the max per minute, then divide by 60
  const min = perMinuteRange * 0.2;
  const max = perMinuteRange;
  const perMinute = min + Math.random() * (max - min);
  return perMinute / 60;
};

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState(null);
  const [showBalance, setShowBalance] = useState(true);
  const [showReferral, setShowReferral] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [activeTab, setActiveTab] = useState('open');
  const [trades, setTrades] = useState([]);
  const [profits, setProfits] = useState({});          // { tradeId: accumulatedProfit }
  const [editingTrade, setEditingTrade] = useState(null);
  const [editTP, setEditTP] = useState('');
  const [editSL, setEditSL] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchDashboard()
      .then(res => setDashboard(res.data))
      .catch(() => {});
  }, []);

  // Fetch trades whenever tab or dashboard changes
  useEffect(() => {
    if (dashboard) {
      getUserTrades(activeTab)
        .then(res => {
          setTrades(res.data);
          if (activeTab === 'open') {
            const initial = {};
            res.data.forEach(trade => {
              initial[trade._id] = 0;
            });
            setProfits(initial);
          }
        })
        .catch(() => setTrades([]));
    }
  }, [activeTab, dashboard]);

  // Live profit simulation (always increasing)
  useEffect(() => {
    if (activeTab === 'open' && trades.length > 0) {
      intervalRef.current = setInterval(() => {
        setProfits(prev => {
          const next = { ...prev };
          trades.forEach(trade => {
            const increment = getSecondIncrement(trade.lots);
            next[trade._id] = (next[trade._id] || 0) + increment;
          });
          return next;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeTab, trades]);

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

  const handleCloseTrade = async (tradeId) => {
    try {
      const response = await closeTradeAPI(tradeId);
      // Immediately update balance from the server response
      if (response.data.newBalance !== undefined && dashboard) {
        setDashboard(prev => ({
          ...prev,
          balance: response.data.newBalance
        }));
      }
      // Refresh trades to remove closed one
      const tradesRes = await getUserTrades('open');
      setTrades(tradesRes.data);
      // Also refetch full dashboard to be safe
      const dashRes = await fetchDashboard();
      setDashboard(dashRes.data);
      setProfits(prev => {
        const { [tradeId]: _, ...rest } = prev;
        return rest;
      });
    } catch (err) {
      alert('Failed to close trade');
    }
  };

  const handleEditClick = (trade) => {
    setEditingTrade(trade._id);
    setEditTP(trade.takeProfit || '');
    setEditSL(trade.stopLoss || '');
  };

  const handleSaveEdit = async () => {
    if (!editingTrade) return;
    try {
      await updateTradeTP_SL(editingTrade, parseFloat(editTP) || null, parseFloat(editSL) || null);
      setEditingTrade(null);
      const updatedTrades = await getUserTrades('open');
      setTrades(updatedTrades.data);
    } catch (err) {
      alert('Failed to update trade');
    }
  };

  if (!dashboard) {
    return (
      <div className="dashboard-loader">
        <div className="loader-ring"></div>
      </div>
    );
  }

  const { account, balance } = dashboard;

  // Calculate total closed P/L when on closed tab
  const totalClosedPL = activeTab === 'closed'
    ? trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
    : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-left-group">
          <GmailContactIcon />
          <NotificationIcon />
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          🚪 Logout
        </button>
      </div>

      <h1>Welcome, {user.email}</h1>

      <div className="account-details-card">
        <div className="account-type">Real, MT5 Standard</div>
        <div className="account-number">#{account.number}</div>
      </div>

      <div className="balance-card">
        <div className="balance-label">Total Balance</div>
        <div className="balance-amount">
          {showBalance ? `$${balance.toFixed(2)}` : '****'}
        </div>
        <button className="balance-toggle" onClick={() => setShowBalance(!showBalance)}>
          {showBalance ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="action-buttons">
        <button onClick={() => navigate('/manage-account')}>Manage</button>
        <button onClick={() => navigate('/deposit')}>Deposit</button>
        <button onClick={() => navigate('/withdraw')}>Withdraw</button>
        <button onClick={() => navigate('/transfer')}>Transfer</button>
        <button onClick={handleReferral}>Refer a Friend</button>
        <button onClick={() => navigate('/metatrader-details')}>Metatrader Login Details</button>
        <button onClick={() => navigate('/trade')}>Full Trade Page</button>
        <button onClick={() => navigate('/portfolio')}>My Portfolio</button>
      </div>

      {showReferral && (
        <div className="referral-popup">
          <p>Your unique referral code: <strong>{referralCode}</strong></p>
          <p>Earn $20 when your referral makes their first deposit.</p>
          <button onClick={() => setShowReferral(false)}>Close</button>
        </div>
      )}

      <TradeSection balance={balance} />

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
            className={`tab ${activeTab === 'closed' ? 'active' : ''}`}
            onClick={() => setActiveTab('closed')}
          >
            Closed Trades
          </button>
        </div>
        <div className="tab-content">
          {/* Show total profit for closed trades */}
          {activeTab === 'closed' && trades.length > 0 && (
            <div className="total-profit-line">
              <strong>Total Profit: ${totalClosedPL.toFixed(2)}</strong>
            </div>
          )}
          {trades.length === 0 ? (
            <p>{activeTab === 'open' ? 'No open positions.' : 'No closed trades yet.'}</p>
          ) : (
            <table className="trades-table small-text">
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Type</th>
                  <th>Order</th>
                  <th>Lots</th>
                  {activeTab === 'open' && <th>Profit/Loss</th>}
                  <th>TP</th>
                  <th>SL</th>
                  {activeTab === 'closed' && <th>P/L</th>}
                  {activeTab === 'closed' && <th>Date</th>}
                  {activeTab === 'open' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {trades.map(trade => (
                  <tr key={trade._id}>
                    <td>{trade.pair}</td>
                    <td className={trade.type === 'buy' ? 'text-green' : 'text-red'}>
                      {trade.type.toUpperCase()}
                    </td>
                    <td>{trade.orderType.replace('_', ' ')}</td>
                    <td>{trade.lots}</td>
                    {activeTab === 'open' && (
                      <td className="text-green">
                        ${(profits[trade._id] || 0).toFixed(2)}
                      </td>
                    )}
                    <td>{trade.takeProfit || '-'}</td>
                    <td>{trade.stopLoss || '-'}</td>
                    {activeTab === 'closed' && (
                      <td className="text-green">${trade.profitLoss.toFixed(2)}</td>
                    )}
                    {activeTab === 'closed' && (
                      <td>{new Date(trade.closedAt).toLocaleDateString()}</td>
                    )}
                    {activeTab === 'open' && (
                      <td className="action-buttons-cell">
                        <button className="icon-btn edit" title="Edit TP/SL"
                          onClick={() => handleEditClick(trade)}>✏️</button>
                        <button className="icon-btn close" title="Close Trade"
                          onClick={() => handleCloseTrade(trade._id)}>❌</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit TP/SL Modal */}
      {editingTrade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Edit TP/SL</h4>
            <div className="edit-row">
              <label>Take Profit</label>
              <input type="number" value={editTP} onChange={e => setEditTP(e.target.value)} />
            </div>
            <div className="edit-row">
              <label>Stop Loss</label>
              <input type="number" value={editSL} onChange={e => setEditSL(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={() => setEditingTrade(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="market-section">
        <h3>Market</h3>
        <TradingViewWidget />
      </div>
    </div>
  );
};

export default DashboardPage;