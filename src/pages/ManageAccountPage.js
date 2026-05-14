import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { fetchManageAccount, updateLeverage, updateAccountName, updateMt5Password, getMt5Details, setMt5Password } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import './ManageAccountPage.css';

const ManageAccountPage = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('funds');
  const [fundsData, setFundsData] = useState(null);
  const [leverage, setLeverage] = useState('1000:1');
  const [accountName, setAccountName] = useState('');
  const [mt5Password, setMt5PasswordState] = useState('');
  const [loginDetails, setLoginDetails] = useState(null);
  const [showLoginDetails, setShowLoginDetails] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchManageAccount().then(res => {
      setFundsData(res.data);
      setLeverage(res.data.leverage);
      setAccountName(res.data.accountName || '');
    }).catch(() => {});
  }, []);

  const handleLeverageChange = async () => {
    try {
      await updateLeverage(leverage);
      alert('Leverage updated');
      fetchManageAccount().then(res => setFundsData(res.data));
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleNameChange = async () => {
    try {
      await updateAccountName(accountName);
      alert('Account name updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleMt5Password = async () => {
    if (user.balance === 0) {
      alert('You must make a deposit before changing MT5 password.');
      return;
    }
    try {
      await updateMt5Password(mt5Password);
      alert('MT5 password updated');
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleViewLoginDetails = async () => {
    if (user.balance === 0) {
      alert('Please make a deposit to access your MT5 login details.');
      navigate('/deposit');
      return;
    }
    try {
      const res = await getMt5Details();
      setLoginDetails(res.data);
      setShowLoginDetails(true);
    } catch (err) {
      alert('Error fetching details');
    }
  };

  return (
    <div className="manage-account">
      <h2>Manage Account</h2>
      <div className="tabs">
        <button onClick={() => setActiveTab('funds')} className={activeTab==='funds'?'active':''}>Funds</button>
        <button onClick={() => setActiveTab('settings')} className={activeTab==='settings'?'active':''}>Settings</button>
      </div>

      {activeTab === 'funds' && fundsData && (
        <div className="funds-info">
          <p>Balance: ${fundsData.balance.toFixed(2)}</p>
          <p>Equity: ${fundsData.equity.toFixed(2)}</p>
          <p>Floating P/L: ${fundsData.floatingPL.toFixed(2)}</p>
          <p>Margin: ${fundsData.margin.toFixed(2)}</p>
          <p>Free Margin: ${fundsData.freeMargin.toFixed(2)}</p>
          <p>Margin Level: {fundsData.marginLevel}%</p>
          <p>Credit: ${fundsData.credit.toFixed(2)}</p>
          <p>Leverage: {fundsData.leverage}</p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="settings">
          <div className="setting-item">
            <label>Change Leverage:</label>
            <select value={leverage} onChange={e => setLeverage(e.target.value)}>
              {['1000:1','500:1','200:1','100:1','50:1','25:1','15:1','10:1','5:1','3:1','2:1','1:1'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <button onClick={handleLeverageChange}>Update Leverage</button>
          </div>
          <div className="setting-item">
            <label>Change Account Name:</label>
            <input type="text" value={accountName} onChange={e => setAccountName(e.target.value)} />
            <button onClick={handleNameChange}>Update Name</button>
          </div>
          {user.balance > 0 && (
            <div className="setting-item">
              <label>Change Metatrader Password:</label>
              <input type="password" value={mt5Password} onChange={e => setMt5PasswordState(e.target.value)} />
              <button onClick={handleMt5Password}>Update MT5 Password</button>
            </div>
          )}
          <div className="setting-item">
            <button onClick={handleViewLoginDetails}>Metatrader Login Details</button>
          </div>

          {showLoginDetails && loginDetails && (
            <div className="mt5-details-popup">
              <p>Server: {loginDetails.server}</p>
              <p>MT5 Login: {loginDetails.login}</p>
              <div>
                <label>Password:</label>
                <input type="text" value={loginDetails.password} onChange={async (e) => {
                  await setMt5Password(e.target.value);
                  setLoginDetails({...loginDetails, password: e.target.value});
                }} />
              </div>
              <button onClick={() => setShowLoginDetails(false)}>Close</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAccountPage;