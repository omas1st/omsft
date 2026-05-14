import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, verifyResetCode, resetPassword } from '../utils/api';
import './ForgotPasswordPage.css';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setStep(2);
      setMessage('A 6-digit code has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Email not found');
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      await verifyResetCode(email, code);
      setStep(3);
    } catch (err) {
      setError('Invalid code');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await resetPassword(email, code, newPassword);
      navigate('/login');
    } catch (err) {
      setError('Reset failed');
    }
  };

  return (
    <div className="forgot-password-page">
      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <h2>Forgot Password</h2>
          <label>Enter your registered email address</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button type="submit">Send Code</button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={handleCodeSubmit}>
          <p>{message}</p>
          <label>Enter the 6-digit code</label>
          <input type="text" maxLength="6" value={code} onChange={e => setCode(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button type="submit">Verify Code</button>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={handlePasswordSubmit}>
          <h2>Set New Password</h2>
          <label>New Password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
          <label>Confirm New Password</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          {error && <div className="error">{error}</div>}
          <button type="submit">Reset Password</button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;