import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  async function fetchData() {
    try {
      const [booksRes, ordersRes, usersRes, statsRes] = await Promise.all([
        api.get('/admin/pending-books'),
        api.get('/orders/admin/all'),
        api.get('/admin/users'),
        api.get('/admin/stats')
      ]);
      setBooks(booksRes.data || []);
      setOrders(ordersRes.data || []);
      setUsers(usersRes.data || []);
      setStats(statsRes.data || {});
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
    // avoid calling setState synchronously inside the effect body
    // schedule fetchData on the microtask queue
    Promise.resolve().then(fetchData);
  }, [user, navigate]);

  async function approveBook(id) { try { await api.put(`/admin/books/${id}/approve`); fetchData(); } catch { alert('Failed'); } }
  async function rejectBook(id) { try { await api.put(`/admin/books/${id}/reject`); fetchData(); } catch { alert('Failed'); } }
  async function confirmOrder(id) { try { await api.put(`/orders/${id}/confirm`); fetchData(); } catch { alert('Failed'); } }
  async function updateUserRole(id, role) { try { await api.put(`/admin/users/${id}`, { role }); fetchData(); } catch { alert('Failed'); } }

  if (loading) return <div className="text-center py-20">Loading admin panel...</div>;

  const pendingBooks = books.filter(b => b.status === 'pending');
  const pendingOrders = orders.filter(o => o.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Admin Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Total Books</p><p className="text-3xl font-bold text-ink-900">{stats.totalBooks || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Total Users</p><p className="text-3xl font-bold text-ink-900">{stats.totalUsers || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Total Orders</p><p className="text-3xl font-bold text-ink-900">{stats.totalOrders || 0}</p></div>
        <div className="bg-white p-6 rounded-xl shadow"><p className="text-sm text-ink-600">Pending Books</p><p className="text-3xl font-bold text-yellow-600">{stats.pendingBooks || 0}</p></div>
      </div>
      <div className="flex gap-4 mb-6 border-b border-ink-200">
        <button onClick={() => setActiveTab('pending')} className={`pb-2 px-4 font-semibold ${activeTab === 'pending' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-ink-600'}`}>Pending Books ({pendingBooks.length})</button>
        <button onClick={() => setActiveTab('orders')} className={`pb-2 px-4 font-semibold ${activeTab === 'orders' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-ink-600'}`}>Pending Payments ({pendingOrders.length})</button>
        <button onClick={() => setActiveTab('users')} className={`pb-2 px-4 font-semibold ${activeTab === 'users' ? 'border-b-2 border-amber-500 text-amber-500' : 'text-ink-600'}`}>Users</button>
      </div>
      {activeTab === 'pending' && pendingBooks.map((book) => (
        <div key={book.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center mb-4">
          <div><h3 className="font-semibold">{book.title}</h3><p className="text-sm text-ink-600">By: {book.authorName} | Price: Ksh. {book.price}</p></div>
          <div className="flex gap-2">
            <button onClick={() => approveBook(book.id)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">Approve</button>
            <button onClick={() => rejectBook(book.id)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">Reject</button>
          </div>
        </div>
      ))}
      {activeTab === 'orders' && pendingOrders.map((order) => (
        <div key={order.id} className="bg-white p-6 rounded-xl shadow flex justify-between items-center mb-4">
          <div><h3 className="font-semibold">{order.bookTitle}</h3><p className="text-sm text-ink-600">Buyer: {order.userName} | Amount: Ksh. {order.amount}</p></div>
          <button onClick={() => confirmOrder(order.id)} className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg">Confirm Payment</button>
        </div>
      ))}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-ink-100"><tr><th className="px-6 py-3 text-left text-sm font-semibold">Name</th><th className="px-6 py-3 text-left text-sm font-semibold">Email</th><th className="px-6 py-3 text-left text-sm font-semibold">Role</th><th className="px-6 py-3 text-left text-sm font-semibold">Action</th></tr></thead>
            <tbody className="divide-y divide-ink-100">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 font-medium">{u.name}</td>
                  <td className="px-6 py-4 text-sm">{u.email}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : u.role === 'author' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                  <td className="px-6 py-4">
                    <select onChange={(e) => updateUserRole(u.id, e.target.value)} defaultValue={u.role} className="text-sm border border-ink-200 rounded px-2 py-1">
                      <option value="reader">Reader</option>
                      <option value="author">Author</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;