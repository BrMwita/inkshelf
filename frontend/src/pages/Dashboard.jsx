import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
// import { Link } from 'react-router-dom'; // Removed unused import

function Dashboard() {
  const { user } = useAuth();
  // books state is not needed here; we only derive stats from fetched data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalBooks: 0, totalSales: 0, totalRevenue: 0, walletBalance: 0 });

  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (!user) return;
      try {
        if (user.role === 'author') {
          const response = await api.get(`/books/author/${user.id}`);
          const booksData = response.data || [];
          const sales = booksData.reduce((acc, book) => acc + (book.totalSales || 0), 0);
          const revenue = booksData.reduce((acc, book) => acc + (book.totalRevenue || 0), 0);
          if (isMounted) setStats({ totalBooks: booksData.length, totalSales: sales, totalRevenue: revenue, walletBalance: user.walletBalance || 0 });
        }

        const ordersResp = await api.get('/orders');
        if (isMounted) setOrders(ordersResp.data || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => { isMounted = false; };
  }, [user]);

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Dashboard</h1>
      {user?.role === 'author' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Books Published</p><p className="text-3xl font-bold text-ink-900">{stats.totalBooks}</p></div>
          <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Total Sales</p><p className="text-3xl font-bold text-ink-900">{stats.totalSales}</p></div>
          <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Revenue</p><p className="text-3xl font-bold text-amber-500">Ksh. {stats.totalRevenue}</p></div>
          <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Wallet Balance</p><p className="text-3xl font-bold text-green-600">Ksh. {stats.walletBalance}</p></div>
        </div>
      )}
      <div>
        <h2 className="font-display text-2xl font-bold mb-4">My Purchases</h2>
        {orders.length === 0 ? <p className="text-ink-600">No purchases yet.</p> : (
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-ink-100"><tr><th className="px-6 py-3 text-left text-sm font-semibold">Book</th><th className="px-6 py-3 text-left text-sm font-semibold">Amount</th><th className="px-6 py-3 text-left text-sm font-semibold">Status</th><th className="px-6 py-3 text-left text-sm font-semibold">Date</th></tr></thead>
              <tbody className="divide-y divide-ink-100">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">{order.title || 'Unknown'}</td>
                    <td className="px-6 py-4 font-semibold">Ksh. {order.amount}</td>
                    <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${order.status === 'paid' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{order.status}</span></td>
                    <td className="px-6 py-4 text-sm">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;