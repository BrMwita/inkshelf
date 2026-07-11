import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

function Browse() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // fetchBooks was removed because an inline fetch is used in useEffect

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const response = await api.get('/books');
        if (mounted) setBooks(response.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, []);

  const filteredBooks = books.filter(book =>
    book.title?.toLowerCase().includes(search.toLowerCase()) ||
    book.authorName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Browse Books</h1>
        <input type="text" placeholder="Search books..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 border border-ink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-64" />
      </div>
      {loading ? <div className="text-center py-12">Loading...</div> : filteredBooks.length === 0 ? (
        <div className="text-center py-12 text-ink-700">{search ? 'No books found' : 'No books available'}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredBooks.map((book) => (
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
  );
}

export default Browse;