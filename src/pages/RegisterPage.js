import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CountryDropdown from '../components/CountryDropdown';
import './RegisterPage.css';

const RegisterPage = () => {
  const [country, setCountry] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [partnerCode, setPartnerCode] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Password requirement checks
  const passwordChecks = {
    minLength: password.length >= 8,
    hasLower: /[a-z]/.test(password),
    hasUpper: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };

  const strength = (() => {
    const score = Object.values(passwordChecks).filter(Boolean).length;
    if (password.length < 8) return { label: 'Weak', strength: 25, color: '#e74c3c' };
    if (score <= 2) return { label: 'Weak', strength: 25, color: '#e74c3c' };
    if (score <= 4) return { label: 'Medium', strength: 60, color: '#f39c12' };
    return { label: 'Strong', strength: 100, color: '#27ae60' };
  })();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accepted) {
      setError('You must accept the Terms and Conditions');
      return;
    }
    try {
      const res = await registerUser({ country, email: email.toLowerCase(), password, partnerCode });
      login(res.data.token, res.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Country of Residence</label>
          <CountryDropdown value={country} onChange={setCountry} />
        </div>
        <div className="form-group">
          <label>Email </label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-visibility">
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {/* Strength bar */}
          <div className="password-strength-container">
            <div className="password-strength-bar-bg">
              <div
                className="password-strength-bar-fill"
                style={{
                  width: `${strength.strength}%`,
                  backgroundColor: strength.color
                }}
              ></div>
            </div>
            <span className="password-strength-label" style={{ color: strength.color }}>
              {strength.label}
            </span>
          </div>

          {/* Requirement signals */}
          <div className="password-signals">
            <div className={`signal ${passwordChecks.minLength ? 'valid' : 'invalid'}`}>
              <span className="signal-icon">{passwordChecks.minLength ? '✔' : '✘'}</span>
              <span className="signal-text">At least 8 characters</span>
            </div>
            <div className={`signal ${passwordChecks.hasLower ? 'valid' : 'invalid'}`}>
              <span className="signal-icon">{passwordChecks.hasLower ? '✔' : '✘'}</span>
              <span className="signal-text">Lowercase letter (a–z)</span>
            </div>
            <div className={`signal ${passwordChecks.hasUpper ? 'valid' : 'invalid'}`}>
              <span className="signal-icon">{passwordChecks.hasUpper ? '✔' : '✘'}</span>
              <span className="signal-text">Uppercase letter (A–Z)</span>
            </div>
            <div className={`signal ${passwordChecks.hasNumber ? 'valid' : 'invalid'}`}>
              <span className="signal-icon">{passwordChecks.hasNumber ? '✔' : '✘'}</span>
              <span className="signal-text">Number (0–9)</span>
            </div>
            <div className={`signal ${passwordChecks.hasSymbol ? 'valid' : 'invalid'}`}>
              <span className="signal-icon">{passwordChecks.hasSymbol ? '✔' : '✘'}</span>
              <span className="signal-text">Symbol (!@#$%^&*)</span>
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Partner Code (optional)</label>
          <input type="text" value={partnerCode} onChange={e => setPartnerCode(e.target.value)} />
        </div>
        <div className="form-group checkbox">
          <label>
            <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} />
            By registering, I declare that I have carefully read, understood and accepted the entire text of the Terms and Conditions.
          </label>
        </div>
        {error && <div className="error">{error}</div>}
        <button type="submit">Register</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
};

export default RegisterPage;