import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]); 
  const [tagsList, setTagsList] = useState([]); 
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState(''); 
  const [selectedTagIds, setSelectedTagIds] = useState([]); 
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [rating, setRating] = useState('5');
  const [review, setReview] = useState('');

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    try {
      const booksRes = await fetch('http://localhost:5000/api/books');
      if (booksRes.ok) setBooks(await booksRes.json());

      const catRes = await fetch('http://localhost:5000/api/book-categories');
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategoriesList(catData);
        if (catData.length > 0 && !categoryId) setCategoryId(catData[0].id);
      }

      const tagRes = await fetch('http://localhost:5000/api/book-tags');
      if (tagRes.ok) {
        setTagsList(await tagRes.json());
      }
    } catch (err) {
      console.error('Failed to fetch data:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleTagToggle = (tagId) => {
    setSelectedTagIds(prev => 
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleEdit = (book) => {
    setEditingId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setCategoryId(book.book_category_id || (categoriesList[0]?.id || ''));
    setSelectedTagIds(book.tag_ids || []);
    setCoverImageUrl(book.cover_image_url || '');
    setSynopsis(book.synopsis || '');
    setRating(book.rating || '5');
    setReview(book.review || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setAuthor('');
    setCategoryId(categoriesList[0]?.id || '');
    setSelectedTagIds([]);
    setCoverImageUrl('');
    setSynopsis('');
    setRating('5');
    setReview('');
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId ? `http://localhost:5000/api/books/${editingId}` : 'http://localhost:5000/api/books';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title, 
          author, 
          category_id: categoryId, 
          tag_ids: selectedTagIds, 
          cover_image_url: coverImageUrl, 
          synopsis, 
          rating, 
          review 
        })
      });

      if (!res.ok) throw new Error('Failed to save book');

      resetForm();
      fetchData();
      showNotification(editingId ? 'Book successfully updated! 📚' : 'Book review published! 📖');
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
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
    fetchData();
    showNotification('Book deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#121212] dark:text-slate-100 sm:p-10 font-sans">
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        <div>
          <button onClick={() => navigate('/admin')} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">← Back to Dashboard</button>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Manage Books</h1>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <h2 className="mb-6 text-xl font-bold text-slate-900 dark:text-white">{editingId ? 'Edit Book Review' : 'Add New Book'}</h2>
          
          <form onSubmit={handleSaveBook} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input type="text" placeholder="Book Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
              <input type="text" placeholder="Author Name" required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white dark:bg-[#1a1a1c]">
                <option value="" disabled>Select a Book Category...</option>
                {categoriesList.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>

              <select value={rating} onChange={(e) => setRating(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white dark:bg-[#1a1a1c]">
                <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4">⭐⭐⭐⭐ (4/5)</option>
                <option value="3">⭐⭐⭐ (3/5)</option>
                <option value="2">⭐⭐ (2/5)</option>
                <option value="1">⭐ (1/5)</option>
              </select>
            </div>

            {/* Tag Selection Checkboxes */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Book Tags</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 min-h-[50px] items-center">
                {tagsList.length === 0 ? (
                  <span className="text-xs text-slate-400 italic">No tags created yet. Add some in 'Manage Book Categories & Tags'!</span>
                ) : (
                  tagsList.map(tag => {
                    const isSelected = selectedTagIds.includes(tag.id);
                    return (
                      <button
                        type="button"
                        key={tag.id}
                        onClick={() => handleTagToggle(tag.id)}
                        className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${isSelected ? 'bg-slate-900 text-white dark:bg-white dark:text-[#121212]' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}
                      >
                        {tag.name} {isSelected && '✓'}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <input type="text" placeholder="Cover Image URL (Optional)" value={coverImageUrl} onChange={(e) => setCoverImageUrl(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
            <textarea placeholder="Book Synopsis..." rows="4" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white"></textarea>
            <textarea placeholder="Your Personal Review / Thoughts..." rows="6" value={review} onChange={(e) => setReview(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white"></textarea>

            <div className="flex items-center gap-4 pt-2">
              <button type="submit" className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white dark:bg-white dark:text-[#121212]">{editingId ? 'Update Book' : 'Publish Book Review'}</button>
              {editingId && <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 px-8 py-3 text-sm font-bold text-slate-700 dark:border-slate-700 dark:text-slate-300">Cancel Edit</button>}
            </div>
          </form>
        </div>

        {/* Current Books List (Restored) */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Books & Arrangement</h2>
          
          <div className="space-y-4">
            {books.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No book reviews published yet.</p>
            ) : (
              books.map((item, index) => (
                <div key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                  <div className="flex-1 min-w-0 sm:pr-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight break-words">
                        {item.title}
                      </h3>
                      <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {item.category || 'General'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      By {item.author} • Rating: {item.rating}/5
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                    <button onClick={() => handleEdit(item)} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">Edit</button>
                    <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">↑ Up</button>
                    <button onClick={() => handleMove(index, 'down')} disabled={index === books.length - 1} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">↓ Down</button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">Delete</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}