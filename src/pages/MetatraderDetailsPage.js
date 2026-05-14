import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getMt5Details, setMt5Password } from '../utils/api';
import './MetatraderDetailsPage.css';

const MetatraderDetailsPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user.balance === 0) {
      alert('Please make a deposit to access your MT5 login details.');
      navigate('/deposit');
    } else {
      getMt5Details().then(res => setDetails(res.data)).catch(() => alert('Error'));
    }
  }, [user.balance, navigate]);

  const handlePasswordSave = async () => {
    try {
      await setMt5Password(password);
      setDetails({ ...details, password });
      alert('Password saved');
    } catch (err) {
      alert('Failed to save password');
    }
  };

  if (!details) return <div>Loading...</div>;

  return (
    <div className="metatrader-details">
      <h2>Metatrader Login Details</h2>
      <p>Server: oms-mt5Real</p>
      <p>MT5 Login: #{details.login}</p>
      <div>
        <label>Password:</label>
        <input type="text" value={password} onChange={e => setPassword(e.target.value)} placeholder="Set your MT5 password" />
        <button onClick={handlePasswordSave}>Save</button>
      </div>
      <p>Balance: ${user.balance.toFixed(2)}</p>
    </div>
  );
};

export default MetatraderDetailsPage;