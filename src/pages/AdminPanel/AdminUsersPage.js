import React, { useEffect, useState } from 'react';
import { adminGetUsers, adminDeleteUser, adminUpdateUser } from '../../utils/api';
import './AdminUsersPage.css';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editBalance, setEditBalance] = useState('');
  const [editMessage, setEditMessage] = useState('');

  const fetchUsers = () => {
    adminGetUsers().then(res => setUsers(res.data)).catch(() => {});
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this user permanently?')) {
      await adminDeleteUser(id);
      fetchUsers();
    }
  };

  const handleEdit = (user) => {
    setEditUserId(user._id);
    setEditBalance(user.balance);
    setEditMessage('');
  };

  const handleUpdate = async () => {
    await adminUpdateUser(editUserId, { balance: editBalance, message: editMessage });
    setEditUserId(null);
    fetchUsers();
  };

  return (
    <div className="admin-users">
      <h2>Users</h2>
      <table>
        <thead><tr><th>Email</th><th>Balance</th><th>Actions</th></tr></thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>${u.balance.toFixed(2)}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editUserId && (
        <div className="edit-modal">
          <h3>Edit User</h3>
          <label>Balance:</label>
          <input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} />
          <label>Message to user:</label>
          <textarea value={editMessage} onChange={e => setEditMessage(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setEditUserId(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;