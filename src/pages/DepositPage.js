// src/pages/DepositPage.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { requestDeposit, uploadProof, getBitcoinAddress } from '../utils/api';
import './DepositPage.css';

const DepositPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('bitcoin');
  const [file, setFile] = useState(null);
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '' });
  const [error, setError] = useState('');

  // Bitcoin address fetched from backend
  const [bitcoinAddress, setBitcoinAddress] = useState('');

  useEffect(() => {
    getBitcoinAddress()
      .then(res => setBitcoinAddress(res.data.bitcoinAddress))
      .catch(() => setBitcoinAddress('gsjgsjhgjsyyeg')); // fallback
  }, []);

  const handleContinue = () => {
    const min = 100;
    const max = 500000;
    if (amount < min || amount > max) {
      setError(`Amount must be between $${min} and $${max}`);
      return;
    }
    setError('');
    setStep(2);
  };

  const handleDepositSubmit = async () => {
    if (method === 'bitcoin') {
      if (!file) {
        setError('Please upload proof of payment');
        return;
      }
      const formData = new FormData();
      formData.append('proof', file);
      formData.append('amount', amount);
      try {
        await uploadProof(formData); // creates deposit request
        setStep(3);
      } catch (err) {
        setError('Upload failed');
      }
    } else if (method === 'card') {
      try {
        await requestDeposit({ amount, method: 'card', cardDetails });
        setStep(3);
      } catch (err) {
        setError('Deposit request failed');
      }
    }
  };

  // Copy to clipboard handler
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(bitcoinAddress)
      .then(() => alert('Address copied!'))
      .catch(() => alert('Failed to copy'));
  };

  if (step === 3) {
    return (
      <div className="deposit-processing">
        <p>
          Your deposit of ${amount} is being processed. Your account will be
          credited shortly.
        </p>
        <button onClick={() => navigate('/dashboard')}>OK</button>
      </div>
    );
  }

  return (
    <div className="deposit-page">
      <h2>Deposit</h2>
      {step === 1 && (
        <div>
          <label>Your MT5 Account: #{user?.accountNumber || 'N/A'}</label>
          <div className="form-group">
            <label>Amount (USD) - Min $100, Max $500,000</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              min="100"
              max="500000"
              required
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button onClick={handleContinue}>Continue</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <p>Amount: ${amount}</p>
          <label>Payment Method:</label>
          <div>
            <label>
              <input
                type="radio"
                value="bitcoin"
                checked={method === 'bitcoin'}
                onChange={() => setMethod('bitcoin')}
              />{' '}
              Bitcoin
            </label>
            {user.country === 'USA' && (
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={method === 'card'}
                  onChange={() => setMethod('card')}
                />{' '}
                Credit Card
              </label>
            )}
          </div>

          {method === 'bitcoin' && (
            <div>
              <p>
                Bitcoin Wallet Address:{' '}
                <span className="btc-address">{bitcoinAddress}</span>
                <button className="copy-btn" onClick={handleCopyAddress}>
                  Copy
                </button>
              </p>
              <label>Upload Proof of Payment:</label>
              <input
                type="file"
                onChange={e => setFile(e.target.files[0])}
                accept="image/*"
                required
              />
              <p>Processing time: 1 minute to 30 minutes.</p>
            </div>
          )}

          {method === 'card' && (
            <div>
              <input
                type="text"
                placeholder="Card Number"
                value={cardDetails.number}
                onChange={e =>
                  setCardDetails({ ...cardDetails, number: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Expiry (MM/YY)"
                value={cardDetails.expiry}
                onChange={e =>
                  setCardDetails({ ...cardDetails, expiry: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="CVV"
                value={cardDetails.cvv}
                onChange={e =>
                  setCardDetails({ ...cardDetails, cvv: e.target.value })
                }
              />
            </div>
          )}

          {error && <div className="error">{error}</div>}
          <button onClick={handleDepositSubmit}>Submit Deposit</button>
        </div>
      )}
    </div>
  );
};

export default DepositPage;