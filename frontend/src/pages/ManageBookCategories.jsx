import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageBookCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  // Form states
  const [categoryEditingId, setCategoryEditingId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  
  const [tagName, setTagName] = useState('');

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    try {
      const catRes = await fetch('http://localhost:5000/api/book-categories');
      const catData = await catRes.json();
      setCategories(catData);

      const tagRes = await fetch('http://localhost:5000/api/book-tags');
      const tagData = await tagRes.json();
      setTags(tagData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const url = categoryEditingId ? `http://localhost:5000/api/book-categories/${categoryEditingId}` : 'http://localhost:5000/api/book-categories';
    const method = categoryEditingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: categoryName })
    });

    if (res.ok) {
      setCategoryName('');
      setCategoryEditingId(null);
      fetchData();
      showNotification(categoryEditingId ? 'Category updated!' : 'Category added!');
    } else {
      const err = await res.json();
      showNotification(err.error || 'Failed to save category', 'error');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/book-categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
    showNotification('Category deleted.', 'error');
  };

  const handleAddTag = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const res = await fetch('http://localhost:5000/api/book-tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: tagName })
    });

    if (res.ok) {
      setTagName('');
      fetchData();
      showNotification('Tag added successfully!');
    } else {
      const err = await res.json();
      showNotification(err.error || 'Failed to add tag', 'error');
    }
  };

  const handleDeleteTag = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/book-tags/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
    showNotification('Tag deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#121212] dark:text-slate-100 sm:p-10 font-sans">
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>
      <div className="mx-auto max-w-3xl space-y-12">
        <div>
          <button onClick={() => navigate('/admin')} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">← Back to Dashboard</button>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Manage Book Categories & Tags</h1>
        </div>

        {/* Categories Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book Categories</h2>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
            <form onSubmit={handleSaveCategory} className="flex gap-4">
              <input type="text" placeholder="Category Name (e.g., Sci-Fi, Philosophy)" required value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="flex-1 rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
              <button type="submit" className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white dark:bg-white dark:text-[#121212]">{categoryEditingId ? 'Update' : 'Add'}</button>
            </form>
          </div>
          <div className="space-y-3">
            {categories.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#1a1a1c]">
                <span className="font-bold">{item.name}</span>
                <div className="flex gap-2">
                  <button onClick={() => { setCategoryEditingId(item.id); setCategoryName(item.name); }} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">Edit</button>
                  <button onClick={() => handleDeleteCategory(item.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 dark:bg-red-900/20 dark:text-red-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags Section */}
        <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Book Tags</h2>
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
            <form onSubmit={handleAddTag} className="flex gap-4">
              <input type="text" placeholder="Tag Name (e.g., Dystopian, Classic)" required value={tagName} onChange={(e) => setTagName(e.target.value)} className="flex-1 rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm dark:border-slate-700 dark:text-white" />
              <button type="submit" className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white dark:bg-white dark:text-[#121212]">Add Tag</button>
            </form>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag.id} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {tag.name}
                <button type="button" onClick={() => handleDeleteTag(tag.id)} className="text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}