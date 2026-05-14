import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { requestWithdrawal } from '../utils/api';
import './WithdrawPage.css';

const WithdrawPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [bitcoinAddress, setBitcoinAddress] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    if (!amount || amount < 50 || amount > 500000) {
      setError('Amount must be between $50 and $500,000');
      return;
    }
    if (user.balance < amount) {
      setError('Insufficient balance. Minimum required is $50.');
      return;
    }
    if (!bitcoinAddress) {
      setError('Please enter a Bitcoin wallet address');
      return;
    }
    try {
      await requestWithdrawal({ amount, bitcoinAddress });
      alert(`Withdrawal of $${amount} is under process.`);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Withdrawal request failed');
    }
  };

  return (
    <div className="withdraw-page">
      <h2>Withdraw</h2>
      <div className="form-group">
        <label>Amount (USD) - Min $50, Max $500,000</label>
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
      </div>
      {user.balance < 50 && <p className="error">Your balance is below $50. Deposit first.</p>}
      <div className="form-group">
        <label>Bitcoin Wallet Address</label>
        <input type="text" value={bitcoinAddress} onChange={e => setBitcoinAddress(e.target.value)} />
      </div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleWithdraw}>Confirm Withdrawal</button>
    </div>
  );
};

export default WithdrawPage;