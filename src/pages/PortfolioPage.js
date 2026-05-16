import React, { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserTrades, updateTradeTP_SL, closeTrade as closeTradeAPI } from '../utils/api';
import './PortfolioPage.css';

const getSecondIncrement = (lots) => {
  let perMinuteRange;
  if (lots <= 0.09) perMinuteRange = 0.9;
  else if (lots <= 0.9) perMinuteRange = 10;
  else if (lots <= 10) perMinuteRange = 100;
  else perMinuteRange = 1000;
  const min = perMinuteRange * 0.2;
  const max = perMinuteRange;
  const perMinute = min + Math.random() * (max - min);
  return perMinute / 60;
};

const PortfolioPage = () => {
  const { updateUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('open');
  const [trades, setTrades] = useState([]);
  const [profits, setProfits] = useState({});
  const [editingTrade, setEditingTrade] = useState(null);
  const [editTP, setEditTP] = useState('');
  const [editSL, setEditSL] = useState('');
  const intervalRef = useRef(null);

  useEffect(() => {
    getUserTrades(activeTab)
      .then(res => {
        let tradeData = res.data;
        // Sort closed trades by closedAt descending
        if (activeTab === 'closed') {
          tradeData = tradeData.sort(
            (a, b) => new Date(b.closedAt) - new Date(a.closedAt)
          );
        }
        setTrades(tradeData);
        if (activeTab === 'open') {
          const init = {};
          tradeData.forEach(t => (init[t._id] = 0));
          setProfits(init);
        }
      })
      .catch(() => setTrades([]));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'open' && trades.length > 0) {
      intervalRef.current = setInterval(() => {
        setProfits(prev => {
          const next = { ...prev };
          trades.forEach(trade => {
            const inc = getSecondIncrement(trade.lots);
            next[trade._id] = (next[trade._id] || 0) + inc;
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

  const handleCloseTrade = async (id) => {
    try {
      const response = await closeTradeAPI(id);
      if (response.data.newBalance !== undefined) {
        updateUser({ balance: response.data.newBalance });
      }
      const res = await getUserTrades('open');
      setTrades(res.data);
      setProfits(prev => {
        const { [id]: _, ...rest } = prev;
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
      const res = await getUserTrades('open');
      setTrades(res.data);
    } catch (err) {
      alert('Failed to update trade');
    }
  };

  const totalClosedPL =
    activeTab === 'closed'
      ? trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0)
      : 0;

  return (
    <div className="portfolio-page">
      <h2>My Portfolio</h2>

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
        {activeTab === 'closed' && trades.length > 0 && (
          <div className="total-profit-line">
            <strong>Total Profit: ${totalClosedPL.toFixed(2)}</strong>
          </div>
        )}

        {trades.length === 0 ? (
          <p className="empty-msg">
            {activeTab === 'open' ? 'No open positions.' : 'No closed trades yet.'}
          </p>
        ) : (
          <div className="trade-cards">
            {trades.map(trade => (
              <div key={trade._id} className="trade-card">
                {activeTab === 'closed' && trade.closedAt && (
                  <div className="trade-card-date">
                    {new Date(trade.closedAt).toLocaleDateString()}
                  </div>
                )}

                <div className="trade-card-body">
                  <div className="trade-card-main">
                    <span className="trade-pair">{trade.pair}</span>
                    <span
                      className={`trade-type ${
                        trade.type === 'buy' ? 'text-green' : 'text-red'
                      }`}
                    >
                      {trade.type.toUpperCase()}
                    </span>
                    <span className="trade-order">
                      {trade.orderType.replace('_', ' ')}
                    </span>
                    <span className="trade-lots">{trade.lots} lots</span>
                  </div>

                  <div className="trade-card-details">
                    <div className="detail-item">
                      <label>TP</label>
                      <span>{trade.takeProfit || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <label>SL</label>
                      <span>{trade.stopLoss || '-'}</span>
                    </div>

                    {activeTab === 'open' && (
                      <div className="detail-item profit">
                        <label>Live P/L</label>
                        <span className="text-green">
                          ${(profits[trade._id] || 0).toFixed(2)}
                        </span>
                      </div>
                    )}

                    {activeTab === 'closed' && (
                      <div className="detail-item profit">
                        <label>P/L</label>
                        <span className="text-green">
                          ${trade.profitLoss.toFixed(2)}
                        </span>
                      </div>
                    )}
                  </div>

                  {activeTab === 'open' && (
                    <div className="trade-card-actions">
                      <button
                        className="icon-btn edit"
                        title="Edit TP/SL"
                        onClick={() => handleEditClick(trade)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn close"
                        title="Close Trade"
                        onClick={() => handleCloseTrade(trade._id)}
                      >
                        ❌
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editingTrade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Edit TP/SL</h4>
            <div className="edit-row">
              <label>Take Profit</label>
              <input
                type="number"
                value={editTP}
                onChange={e => setEditTP(e.target.value)}
              />
            </div>
            <div className="edit-row">
              <label>Stop Loss</label>
              <input
                type="number"
                value={editSL}
                onChange={e => setEditSL(e.target.value)}
              />
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={() => setEditingTrade(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;