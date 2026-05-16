import React, { useEffect, useState } from 'react';
import {
  adminGetClosedTrades,
  adminUpdateClosedTrade,
  adminCreateClosedTrade,
  adminGetUsers,
  adminDeleteClosedTrade   // NEW import
} from '../../utils/api';
import './AdminClosedTradesPage.css';

const AdminClosedTradesPage = () => {
  const [trades, setTrades] = useState([]);
  const [users, setUsers] = useState([]);
  const [editTrade, setEditTrade] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [createForm, setCreateForm] = useState({
    userId: '', pair: '', type: 'buy', orderType: 'instant', lots: 0.01,
    openPrice: 0, closePrice: 0, profitLoss: 0, takeProfit: '', stopLoss: '', closedAt: ''
  });

  useEffect(() => {
    fetchTrades();
    adminGetUsers().then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const fetchTrades = () => {
    adminGetClosedTrades().then(res => setTrades(res.data)).catch(() => {});
  };

  const handleEdit = (trade) => {
    setEditTrade(trade._id);
    setEditForm({
      pair: trade.pair,
      type: trade.type,
      orderType: trade.orderType,
      lots: trade.lots,
      takeProfit: trade.takeProfit || '',
      stopLoss: trade.stopLoss || '',
      profitLoss: trade.profitLoss,
      closePrice: trade.closePrice || '',
      closedAt: trade.closedAt ? new Date(trade.closedAt).toISOString().slice(0,16) : ''
    });
  };

  const handleSaveEdit = async () => {
    try {
      await adminUpdateClosedTrade(editTrade, editForm);
      setEditTrade(null);
      fetchTrades();
    } catch (err) { alert('Update failed'); }
  };

  const handleCreate = async () => {
    try {
      if (!createForm.userId) return alert('Select a user');
      await adminCreateClosedTrade(createForm);
      setShowCreate(false);
      fetchTrades();
    } catch (err) { alert('Creation failed'); }
  };

  // ----- NEW: Delete handler -----
  const handleDelete = async (tradeId) => {
    if (!window.confirm('Delete this closed trade permanently? This will adjust the user balance.')) return;
    try {
      await adminDeleteClosedTrade(tradeId);
      fetchTrades();
    } catch (err) {
      alert('Deletion failed');
    }
  };

  return (
    <div className="admin-closed-trades">
      <h2>Closed Trades</h2>
      <button className="create-btn" onClick={() => setShowCreate(true)}>+ Create Closed Trade</button>
      <table>
        <thead>
          <tr>
            <th>User</th><th>Pair</th><th>Type</th><th>Order</th><th>Lots</th>
            <th>TP</th><th>SL</th><th>P/L</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade._id}>
              <td>{trade.user?.email || 'Unknown'}</td>
              <td>{trade.pair}</td>
              <td>{trade.type}</td>
              <td>{trade.orderType.replace('_',' ')}</td>
              <td>{trade.lots}</td>
              <td>{trade.takeProfit||'-'}</td>
              <td>{trade.stopLoss||'-'}</td>
              <td>${trade.profitLoss.toFixed(2)}</td>
              <td>{new Date(trade.closedAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(trade)}>Edit</button>
                <button onClick={() => handleDelete(trade._id)} className="delete-btn">Delete</button>  {/* NEW */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal – unchanged */}
      {editTrade && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Closed Trade</h3>
            <label>Pair:</label>
            <input value={editForm.pair} onChange={e => setEditForm({...editForm, pair: e.target.value})} />
            <label>Type:</label>
            <select value={editForm.type} onChange={e => setEditForm({...editForm, type: e.target.value})}>
              <option value="buy">Buy</option><option value="sell">Sell</option>
            </select>
            <label>Order Type:</label>
            <select value={editForm.orderType} onChange={e => setEditForm({...editForm, orderType: e.target.value})}>
              <option value="instant">Instant</option>
              <option value="buy_limit">Buy Limit</option>
              <option value="sell_limit">Sell Limit</option>
              <option value="buy_stop">Buy Stop</option>
              <option value="sell_stop">Sell Stop</option>
            </select>
            <label>Lots:</label>
            <input type="number" step="0.01" value={editForm.lots} onChange={e => setEditForm({...editForm, lots: parseFloat(e.target.value)})} />
            <label>TP:</label>
            <input type="number" value={editForm.takeProfit} onChange={e => setEditForm({...editForm, takeProfit: e.target.value})} />
            <label>SL:</label>
            <input type="number" value={editForm.stopLoss} onChange={e => setEditForm({...editForm, stopLoss: e.target.value})} />
            <label>P/L:</label>
            <input type="number" value={editForm.profitLoss} onChange={e => setEditForm({...editForm, profitLoss: parseFloat(e.target.value)})} />
            <label>Close Price:</label>
            <input type="number" value={editForm.closePrice} onChange={e => setEditForm({...editForm, closePrice: parseFloat(e.target.value)})} />
            <label>Closed Date:</label>
            <input type="datetime-local" value={editForm.closedAt} onChange={e => setEditForm({...editForm, closedAt: e.target.value})} />
            <div className="modal-actions">
              <button onClick={handleSaveEdit}>Save</button>
              <button className="cancel" onClick={() => setEditTrade(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Modal – unchanged */}
      {showCreate && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create Closed Trade</h3>
            <label>User:</label>
            <select value={createForm.userId} onChange={e => setCreateForm({...createForm, userId: e.target.value})}>
              <option value="">--Select--</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.email}</option>)}
            </select>
            <label>Pair:</label>
            <input value={createForm.pair} onChange={e => setCreateForm({...createForm, pair: e.target.value})} />
            <label>Type:</label>
            <select value={createForm.type} onChange={e => setCreateForm({...createForm, type: e.target.value})}>
              <option value="buy">Buy</option><option value="sell">Sell</option>
            </select>
            <label>Order Type:</label>
            <select value={createForm.orderType} onChange={e => setCreateForm({...createForm, orderType: e.target.value})}>
              <option value="instant">Instant</option>
              <option value="buy_limit">Buy Limit</option>
              <option value="sell_limit">Sell Limit</option>
              <option value="buy_stop">Buy Stop</option>
              <option value="sell_stop">Sell Stop</option>
            </select>
            <label>Lots:</label>
            <input type="number" step="0.01" value={createForm.lots} onChange={e => setCreateForm({...createForm, lots: parseFloat(e.target.value)})} />
            <label>Open Price:</label>
            <input type="number" value={createForm.openPrice} onChange={e => setCreateForm({...createForm, openPrice: parseFloat(e.target.value)})} />
            <label>Close Price:</label>
            <input type="number" value={createForm.closePrice} onChange={e => setCreateForm({...createForm, closePrice: parseFloat(e.target.value)})} />
            <label>P/L:</label>
            <input type="number" value={createForm.profitLoss} onChange={e => setCreateForm({...createForm, profitLoss: parseFloat(e.target.value)})} />
            <label>TP:</label>
            <input type="number" value={createForm.takeProfit} onChange={e => setCreateForm({...createForm, takeProfit: e.target.value})} />
            <label>SL:</label>
            <input type="number" value={createForm.stopLoss} onChange={e => setCreateForm({...createForm, stopLoss: e.target.value})} />
            <label>Closed Date:</label>
            <input type="datetime-local" value={createForm.closedAt} onChange={e => setCreateForm({...createForm, closedAt: e.target.value})} />
            <div className="modal-actions">
              <button onClick={handleCreate}>Create</button>
              <button className="cancel" onClick={() => setShowCreate(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClosedTradesPage;