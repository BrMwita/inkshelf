import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    let mounted = true;

    async function loadBooks() {
      try {
        const response = await api.get('/books');
        if (!mounted) return;
        setBooks(response.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadBooks();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="text-center py-20">
        <h1 className="font-display text-6xl font-bold text-ink-900 mb-4">
          African Stories,<br />
          <span className="text-amber-500">Global Readers</span>
        </h1>
        <p className="text-xl text-ink-700 max-w-2xl mx-auto">
          Publish, sell, and read eBooks. Built for Kenyan authors and readers.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/browse">
            <button className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-lg transition">
              Start Reading
            </button>
          </Link>
          <Link to="/publish">
            <button className="border-2 border-ink-900 hover:bg-ink-900 hover:text-white font-semibold px-8 py-3 rounded-lg transition">
              Publish a Book
            </button>
          </Link>
        </div>
      </div>
      <div className="mt-12">
        <h2 className="font-display text-3xl font-bold mb-6">Featured Books</h2>
        {loading ? <div className="text-center py-12">Loading...</div> : books.length === 0 ? (
          <div className="text-center py-12 text-ink-700">No books yet. Be the first to publish!</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {books.slice(0, 5).map((book) => (
              <Link to={`/book/${book.id}`} key={book.id}>
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
                  <img src={book.coverImage || 'https://via.placeholder.com/400x600/1A1A1A/D96C2B?text=Book+Cover'} 
                    alt={book.title} className="w-full h-56 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-ink-900 truncate">{book.title}</h3>
                    <p className="text-sm text-ink-600">{book.authorName || 'Unknown'}</p>
                    <p className="text-amber-500 font-bold mt-1">Ksh. {book.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;