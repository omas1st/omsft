import React, { useEffect, useState } from 'react';
import { adminGetDeposits, adminApproveDeposit, adminRejectDeposit, adminGetWithdrawals, adminApproveWithdrawal, adminRejectWithdrawal } from '../../utils/api';
import './AdminDepositWithdrawalPage.css';

const AdminDepositWithdrawalPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [rejectReason, setRejectReason] = useState({});

  const fetchData = () => {
    adminGetDeposits().then(res => setDeposits(res.data));
    adminGetWithdrawals().then(res => setWithdrawals(res.data));
  };

  useEffect(() => { fetchData(); }, []);

  const handleApproveDeposit = async (id) => {
    await adminApproveDeposit(id);
    fetchData();
  };
  const handleRejectDeposit = async (id) => {
    const reason = rejectReason[id] || '';
    await adminRejectDeposit(id, reason);
    fetchData();
  };
  const handleApproveWithdrawal = async (id) => {
    await adminApproveWithdrawal(id);
    fetchData();
  };
  const handleRejectWithdrawal = async (id) => {
    const reason = rejectReason[id] || '';
    await adminRejectWithdrawal(id, reason);
    fetchData();
  };

  return (
    <div className="admin-deposits">
      <h2>Deposit Requests</h2>
      <table>
        <thead><tr><th>Email</th><th>Balance</th><th>Amount</th><th>Proof</th><th>Action</th></tr></thead>
        <tbody>
          {deposits.map(d => (
            <tr key={d._id}>
              <td>{d.user?.email}</td>
              <td>${d.user?.balance?.toFixed(2)}</td>
              <td>${d.amount}</td>
              <td><a href={d.proofUrl} target="_blank" rel="noreferrer">View</a></td>
              <td>
                <button onClick={() => handleApproveDeposit(d._id)}>Approve</button>
                <input type="text" placeholder="Rejection reason" onChange={e => setRejectReason(prev => ({...prev, [d._id]: e.target.value}))} />
                <button onClick={() => handleRejectDeposit(d._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Withdrawal Requests</h2>
      <table>
        <thead><tr><th>Email</th><th>Balance</th><th>Amount</th><th>Wallet</th><th>Action</th></tr></thead>
        <tbody>
          {withdrawals.map(w => (
            <tr key={w._id}>
              <td>{w.user?.email}</td>
              <td>${w.user?.balance?.toFixed(2)}</td>
              <td>${w.amount}</td>
              <td>{w.bitcoinAddress}</td>
              <td>
                <button onClick={() => handleApproveWithdrawal(w._id)}>Approve</button>
                <input type="text" placeholder="Rejection reason" onChange={e => setRejectReason(prev => ({...prev, [w._id]: e.target.value}))} />
                <button onClick={() => handleRejectWithdrawal(w._id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDepositWithdrawalPage;