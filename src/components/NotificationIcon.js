import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getNotifications } from '../utils/api';
import './NotificationIcon.css';

const NotificationIcon = () => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (user) {
      getNotifications().then(res => setNotifications(res.data)).catch(() => {});
    }
  }, [user]);

  return (
    <div className="notification-icon">
      <button onClick={() => setShow(!show)} className="notif-btn">
        🔔 {notifications.length > 0 && <span className="badge">{notifications.length}</span>}
      </button>
      {show && (
        <div className="notif-dropdown">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n, i) => (
              <div key={i} className="notif-item">{n.message}</div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationIcon;