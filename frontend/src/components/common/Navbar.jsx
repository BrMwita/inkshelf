import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-ink-900 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="font-display text-2xl font-bold text-amber-500">
          InkShelf
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/browse" className="hover:text-amber-400 transition">Browse</Link>
          {user && user.role === 'author' && <Link to="/publish" className="hover:text-amber-400 transition">Publish</Link>}
          {user && user.role === 'admin' && <Link to="/admin" className="hover:text-amber-400 transition">Admin</Link>}
          {user ? (
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="hover:text-amber-400 transition">Dashboard</Link>
              <button onClick={handleLogout} className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg text-sm font-semibold transition">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/login" className="hover:text-amber-400 transition">Login</Link>
              <Link to="/register" className="bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg text-sm font-semibold transition">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
