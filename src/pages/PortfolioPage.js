import React, { useEffect, useState, useRef, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getUserTrades, updateTradeTP_SL, closeTrade as closeTradeAPI } from '../utils/api';
import './PortfolioPage.css';

// Same profit simulation function as DashboardPage
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
        setTrades(res.data);
        if (activeTab === 'open') {
          const init = {};
          res.data.forEach(t => init[t._id] = 0);
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
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [activeTab, trades]);

  const handleCloseTrade = async (id) => {
    try {
      const response = await closeTradeAPI(id);
      if (response.data.newBalance !== undefined) {
        updateUser({ balance: response.data.newBalance });
      }
      const res = await getUserTrades('open');
      setTrades(res.data);
      setProfits(prev => { const { [id]: _, ...rest } = prev; return rest; });
    } catch (err) { alert('Failed to close trade'); }
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
    } catch (err) { alert('Failed to update trade'); }
  };

  const totalClosedPL = activeTab === 'closed' ? trades.reduce((sum, t) => sum + (t.profitLoss || 0), 0) : 0;

  return (
    <div className="portfolio-page">
      <h2>My Portfolio</h2>
      <div className="tabs">
        <button className={`tab ${activeTab==='open'?'active':''}`} onClick={()=>setActiveTab('open')}>Open Trades</button>
        <button className={`tab ${activeTab==='closed'?'active':''}`} onClick={()=>setActiveTab('closed')}>Closed Trades</button>
      </div>
      <div className="tab-content">
        {activeTab === 'closed' && trades.length > 0 && (
          <div className="total-profit-line">
            <strong>Total Profit: ${totalClosedPL.toFixed(2)}</strong>
          </div>
        )}
        {trades.length===0 ? (
          <p>{activeTab==='open'?'No open positions.':'No closed trades yet.'}</p>
        ) : (
          <table className="trades-table small-text">
            <thead>
              <tr>
                <th>Pair</th><th>Type</th><th>Order</th><th>Lots</th>
                {activeTab==='open' && <th>Profit/Loss</th>}
                <th>TP</th><th>SL</th>
                {activeTab==='closed' && <th>P/L</th>}
                {activeTab==='closed' && <th>Date</th>}
                {activeTab==='open' && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {trades.map(trade => (
                <tr key={trade._id}>
                  <td>{trade.pair}</td>
                  <td className={trade.type==='buy'?'text-green':'text-red'}>{trade.type.toUpperCase()}</td>
                  <td>{trade.orderType.replace('_',' ')}</td>
                  <td>{trade.lots}</td>
                  {activeTab==='open' && <td className="text-green">${(profits[trade._id]||0).toFixed(2)}</td>}
                  <td>{trade.takeProfit||'-'}</td>
                  <td>{trade.stopLoss||'-'}</td>
                  {activeTab==='closed' && <td className="text-green">${trade.profitLoss.toFixed(2)}</td>}
                  {activeTab==='closed' && <td>{new Date(trade.closedAt).toLocaleDateString()}</td>}
                  {activeTab==='open' && (
                    <td className="action-buttons-cell">
                      <button className="icon-btn edit" onClick={()=>handleEditClick(trade)}>✏️</button>
                      <button className="icon-btn close" onClick={()=>handleCloseTrade(trade._id)}>❌</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {editingTrade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h4>Edit TP/SL</h4>
            <div className="edit-row">
              <label>Take Profit</label>
              <input type="number" value={editTP} onChange={e=>setEditTP(e.target.value)} />
            </div>
            <div className="edit-row">
              <label>Stop Loss</label>
              <input type="number" value={editSL} onChange={e=>setEditSL(e.target.value)} />
            </div>
            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={()=>setEditingTrade(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;