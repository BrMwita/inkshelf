import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function Publish() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', price: '', genre: 'Fiction', coverImage: '', pdfUrl: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!user || user.role !== 'author') {
      setError('You must be an author to publish books');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/books', { ...formData, price: Number(formData.price) });
      setSuccess('Book published! Waiting for admin approval.');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish');
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.role !== 'author') {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-3xl font-bold mb-4">Author Access Required</h1>
        <p className="text-ink-600 mb-6">Register as an author to publish books.</p>
        <button onClick={() => navigate('/register')} 
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition">
          Register as Author
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Publish Your Book</h1>
      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">{success}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-ink-700 mb-1">Book Title *</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange}
            className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-ink-700 mb-1">Description *</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="5"
            className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Price (Ksh) *</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange}
              className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required min="0" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1">Genre *</label>
            <select name="genre" value={formData.genre} onChange={handleChange}
              className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required>
              <option value="Fiction">Fiction</option>
              <option value="Non-Fiction">Non-Fiction</option>
              <option value="Romance">Romance</option>
              <option value="Sci-Fi">Sci-Fi</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Mystery">Mystery</option>
              <option value="Biography">Biography</option>
              <option value="Self-Help">Self-Help</option>
              <option value="Business">Business</option>
              <option value="Poetry">Poetry</option>
              <option value="Children">Children</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-ink-700 mb-1">Cover Image URL</label>
          <input type="url" name="coverImage" value={formData.coverImage} onChange={handleChange}
            placeholder="https://example.com/cover.jpg" className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-ink-700 mb-1">PDF URL</label>
          <input type="url" name="pdfUrl" value={formData.pdfUrl} onChange={handleChange}
            placeholder="https://example.com/book.pdf" className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50">
          {loading ? 'Publishing...' : 'Publish Book'}
        </button>
      </form>
    </div>
  );
}

export default Publish;