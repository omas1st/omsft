import React, { useState, useEffect } from 'react';
import { executeTrade } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES, PAIRS } from '../utils/pairs';
import './TradeSection.css';

const ORDER_TYPES = [
  { value: 'instant', label: 'Instant Execution' },
  { value: 'buy_limit', label: 'Buy Limit' },
  { value: 'sell_limit', label: 'Sell Limit' },
  { value: 'buy_stop', label: 'Buy Stop' },
  { value: 'sell_stop', label: 'Sell Stop' },
];

const TradeSection = ({ balance }) => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('forex');
  const [selectedPair, setSelectedPair] = useState(PAIRS.forex[0]);
  const [orderType, setOrderType] = useState('instant');
  const [lotSize, setLotSize] = useState(0.01);
  const [takeProfit, setTakeProfit] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [pendingPrice, setPendingPrice] = useState(''); // for pending orders
  const [trend, setTrend] = useState('up');
  const [message, setMessage] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [trading, setTrading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrend(Math.random() < 0.5 ? 'up' : 'down');
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pairsInCategory = PAIRS[activeCategory];
    if (pairsInCategory && pairsInCategory.length > 0) {
      setSelectedPair(pairsInCategory[0]);
    }
  }, [activeCategory]);

  const isPendingOrder = orderType !== 'instant';

  const handleBuySell = async (type) => {
    if (balance <= 0) {
      setShowDepositModal(true);
      return;
    }
    // Pending orders require a price
    if (isPendingOrder && !pendingPrice) {
      setMessage('Please enter a price for pending order.');
      return;
    }

    const currentPrice = isPendingOrder ? parseFloat(pendingPrice) : 1.0; // dummy for instant
    setTrading(true);
    try {
      await executeTrade({
        pair: selectedPair,
        type,
        lots: lotSize,
        orderType,
        takeProfit: takeProfit || undefined,
        stopLoss: stopLoss || undefined,
        currentPrice,
      });
      const orderText = isPendingOrder ? 'Pending order placed' : 'Order executed';
      setMessage(`${type.toUpperCase()} ${orderText} successfully!`);
      setTakeProfit('');
      setStopLoss('');
      setPendingPrice('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Trade failed');
    } finally {
      setTrading(false);
    }
  };

  return (
    <div className="trade-section">
      <h3>Trade</h3>
      <div className="trade-panel">
        <div className="trade-row">
          <label>Order Type</label>
          <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
            {ORDER_TYPES.map(ot => (
              <option key={ot.value} value={ot.value}>{ot.label}</option>
            ))}
          </select>
        </div>

        <div className="category-tabs">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              className={`cat-tab ${activeCategory === key ? 'active' : ''}`}
              onClick={() => setActiveCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="trade-row">
          <label>Pair</label>
          <div className="pair-select-wrapper">
            <select value={selectedPair} onChange={(e) => setSelectedPair(e.target.value)}>
              {PAIRS[activeCategory].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span className={`trend-indicator ${trend === 'up' ? 'up' : 'down'}`}>
              {trend === 'up' ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Price input for pending orders */}
        {isPendingOrder && (
          <div className="trade-row">
            <label>Price</label>
            <input
              type="number"
              step="0.00001"
              placeholder="Enter price"
              value={pendingPrice}
              onChange={(e) => setPendingPrice(e.target.value)}
            />
          </div>
        )}

        <div className="trade-row">
          <label>Lot Size</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={lotSize}
            onChange={(e) => setLotSize(parseFloat(e.target.value) || 0.01)}
          />
        </div>

        <div className="trade-row">
          <label>Take Profit</label>
          <input
            type="number"
            placeholder="0.0"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
          />
        </div>

        <div className="trade-row">
          <label>Stop Loss</label>
          <input
            type="number"
            placeholder="0.0"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
          />
        </div>

        <div className="trade-actions">
          <button className="buy-btn" disabled={trading} onClick={() => handleBuySell('buy')}>
            {isPendingOrder ? 'PLACE BUY' : 'BUY'}
          </button>
          <button className="sell-btn" disabled={trading} onClick={() => handleBuySell('sell')}>
            {isPendingOrder ? 'PLACE SELL' : 'SELL'}
          </button>
        </div>

        {message && <p className="trade-message">{message}</p>}
      </div>

      {showDepositModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>You have no funds in your account. Please deposit first.</p>
            <button onClick={() => { setShowDepositModal(false); navigate('/deposit'); }}>
              Deposit Now
            </button>
            <button className="cancel" onClick={() => setShowDepositModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TradeSection;