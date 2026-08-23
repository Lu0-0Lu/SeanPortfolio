import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState('');

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchBooks = async () => {
    const res = await fetch('http://localhost:5000/api/books');
    const data = await res.json();
    setBooks(data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title, 
          author, 
          cover_image: coverImage, 
          synopsis, 
          review, 
          rating 
        })
      });

      setTitle(''); setAuthor(''); setCoverImage(''); setSynopsis(''); setReview(''); setRating('');
      fetchBooks();
      showNotification('Book review published! 📚');
    } catch (err) {
      showNotification('Failed to add book.', 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newItems = [...books];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setBooks(newItems);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newItems.length; i++) {
      await fetch(`http://localhost:5000/api/books/${newItems[i].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ order_index: i })
      });
    }
    showNotification('Order updated!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book review?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/books/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchBooks();
    showNotification('Book review deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950 dark:text-slate-100 sm:p-10">
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/admin')} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">← Back to Dashboard</button>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Manage Books</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <form onSubmit={handleAddBook} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Book Title (e.g., Crime and Punishment)" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Author (e.g., Fyodor Dostoevsky)" required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Rating (e.g., 5/5 or ⭐⭐⭐⭐⭐)" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Cover Image URL (Optional)" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>
            
            <textarea placeholder="Short Synopsis (What is the book about?)" required rows="2" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800"></textarea>
            
            <textarea placeholder="Your Review / Takeaways..." required rows="4" value={review} onChange={(e) => setReview(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800"></textarea>

            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">Save Book Review</button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Library</h2>
          {books.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{item.title}</h3>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">{item.rating}</span>
                </div>
                <p className="text-sm text-slate-500">By {item.author}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">↑ Up</button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === books.length - 1} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">↓ Down</button>
                <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}