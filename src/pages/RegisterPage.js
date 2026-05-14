import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../utils/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CountryDropdown from '../components/CountryDropdown'; // you'll create a dropdown with all countries
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

  const passwordStrength = () => {
    if (password.length < 6) return 'Weak';
    if (password.length < 10) return 'Medium';
    return 'Strong';
  };

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
          <label>Email (case insensitive)</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          </div>
          <span className={`password-strength ${passwordStrength().toLowerCase()}`}>{passwordStrength()}</span>
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