import React, { useState, useEffect } from 'react';
import { adminGetSettings, adminUpdateBitcoinAddress } from '../../utils/api';
import './AdminSettingsPage.css';

const AdminSettingsPage = () => {
  const [bitcoinAddress, setBitcoinAddress] = useState('');

  useEffect(() => {
    adminGetSettings().then(res => setBitcoinAddress(res.data.bitcoinAddress)).catch(() => {});
  }, []);

  const handleSave = async () => {
    await adminUpdateBitcoinAddress(bitcoinAddress);
    alert('Bitcoin address updated');
  };

  return (
    <div className="admin-settings">
      <h2>Settings</h2>
      <label>Bitcoin Wallet Address:</label>
      <input type="text" value={bitcoinAddress} onChange={e => setBitcoinAddress(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default AdminSettingsPage;