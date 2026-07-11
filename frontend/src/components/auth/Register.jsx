import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('reader');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-ink-900">InkShelf</h1>
          <p className="text-ink-700 mt-2">Start your journey</p>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink-700 mb-1">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} 
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="Grace Wanjiru" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink-700 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="you@example.com" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-ink-700 mb-1">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" 
              placeholder="Min 6 characters" required minLength={6} />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-ink-700 mb-1">I want to...</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} 
              className="w-full px-4 py-3 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
              <option value="reader">Read Books</option>
              <option value="author">Publish Books</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition">
            Create Account
          </button>
        </form>
        <p className="text-center text-sm text-ink-600 mt-6">
          Already have an account? <Link to="/login" className="text-amber-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
