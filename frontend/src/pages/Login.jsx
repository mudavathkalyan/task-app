// src/pages/Login.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login }                   = useAuth();
  const [form, setForm]             = useState({ email: '', password: '' });
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    try {
      setLoading(true);
      await login(form.email, form.password);
      // Navigation happens inside AuthContext
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className='z-10 top-100'>
              <h2>Track everything here..</h2>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">⬡</div>
          <h1>Welcome back</h1>
          <p>Sign in to your TaskFlow account</p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register" className="link">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
