import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Add Link here
import axios from 'axios';
import '../styles/main.css';
import VideoBackground from '../components/VideoBackground';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3080/api/signin', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/shop');
    } catch (err) {
      setError(err.response?.data.msg || 'Sign in failed');
    }
  };

  return (
    <>
      <VideoBackground /> {/* Add video background */}
      <div className="auth-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSignIn} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>
        {error && <p className="error">{error}</p>}
        <p>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </>
  );
};

export default SignIn;