import React, { useState } from 'react';
import './Login.css'; // Make sure this matches the actual CSS filename and path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    // Placeholder: replace with real login logic
    console.log('Logging in with:', email, password);
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div style={{ position: 'relative' }}>
          <div className="password-group">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

        </div>

        <button type="submit" className="login-button">Login</button>

        <div className="register-link">
          <span>Don't have an account? <a href="/register">Register</a></span>
        </div>
      </form>
    </div>
  );
};

export default Login;
