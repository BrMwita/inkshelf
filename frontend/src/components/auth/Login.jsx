import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-ink-900">InkShelf</h1>
          <p className="text-ink-700 mt-2">Welcome back</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="you@example.com" required />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-ink-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="••••••••" required minLength={6} />
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition">
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-ink-600 mt-6">
          Don't have an account? <Link to="/register" className="text-amber-500 font-semibold hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
