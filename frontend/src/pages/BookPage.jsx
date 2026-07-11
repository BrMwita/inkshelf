import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

function BookPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCheckout, setShowCheckout] = useState(false);
  const [mpesaCode, setMpesaCode] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.get(`/books/${id}`);
        if (mounted) setBook(response.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  async function handlePurchase(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/orders', { bookId: id, mpesaTransactionCode: mpesaCode });
      alert('Payment pending! Admin will confirm shortly.');
      setMpesaCode('');
      setShowCheckout(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Purchase failed');
    }
  }

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!book) return <div className="text-center py-20">Book not found</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <img src={book.coverImage || 'https://via.placeholder.com/400x600/1A1A1A/D96C2B?text=Book+Cover'} 
            alt={book.title} className="w-full max-w-md mx-auto rounded-xl shadow-xl" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-bold mb-2">{book.title}</h1>
          <p className="text-lg text-ink-700 mb-4">by {book.authorName || 'Unknown'}</p>
          <div className="mb-6">
            <span className="inline-block bg-ink-200 text-ink-800 px-3 py-1 rounded-full text-sm">{book.genre}</span>
          </div>
          <p className="text-ink-700 mb-6 leading-relaxed">{book.description}</p>
          <div className="text-3xl font-bold text-amber-500 mb-6">Ksh. {book.price}</div>
          <button onClick={() => setShowCheckout(true)} 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition">
            Buy Now
          </button>
        </div>
      </div>
      {showCheckout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8">
            <h2 className="font-display text-2xl font-bold mb-4">Complete Purchase</h2>
            <div className="bg-ink-100 p-4 rounded-lg mb-4">
              <p className="text-sm text-ink-600">Paybill: <span className="font-bold">123456</span></p>
              <p className="text-sm text-ink-600">Account: <span className="font-bold">BOOK-{book.id}</span></p>
              <p className="text-sm text-ink-600">Amount: <span className="font-bold">Ksh. {book.price}</span></p>
            </div>
            <form onSubmit={handlePurchase}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-ink-700 mb-1">M-Pesa Transaction Code</label>
                <input type="text" value={mpesaCode} onChange={(e) => setMpesaCode(e.target.value)}
                  placeholder="e.g. QWERTY123" className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" required />
              </div>
              {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCheckout(false)} 
                  className="flex-1 border border-ink-200 hover:bg-ink-100 py-2 rounded-lg transition">Cancel</button>
                <button type="submit" className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-2 rounded-lg transition">Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookPage;