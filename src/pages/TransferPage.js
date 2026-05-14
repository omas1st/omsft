import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { requestTransfer } from '../utils/api';
import './TransferPage.css';

const TransferPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    if (amount < 20 || amount > 500000) {
      setError('Amount must be between $20 and $500,000');
      return;
    }
    if (user.balance < amount) {
      setError('Insufficient balance. Please deposit first.');
      return;
    }
    try {
      await requestTransfer({ amount, recipientEmail });
      alert('Transfer successful! Click OK to return to dashboard.');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Transfer failed');
    }
  };

  return (
    <div className="transfer-page">
      <h2>Transfer Funds</h2>
      <div className="form-group">
        <label>Amount (USD) - Min $20, Max $500,000</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      <div className="form-group">
        <label>Recipient Email</label>
        <input type="email" value={recipientEmail} onChange={e => setRecipientEmail(e.target.value)} />
      </div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleTransfer}>Transfer</button>
    </div>
  );
};

export default TransferPage;