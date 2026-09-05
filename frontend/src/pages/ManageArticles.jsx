import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageArticles() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]); // NEW: Holds the relational categories
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState(''); // NEW: Holds category_id instead of a string
  const [content, setContent] = useState('');
  const [sources, setSources] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [originalDate, setOriginalDate] = useState('');
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchArticles = async () => {
    const res = await fetch('/api/articles');
    const data = await res.json();
    setArticles(data);
  };

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategoriesList(data);
    
    // Set a default selection if there are categories available
    if (data.length > 0 && !categoryId) {
      setCategoryId(data[0].id);
    }
  };

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, []);

  const handleEdit = (article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setCategoryId(article.category_id || (categoriesList[0]?.id || 1));
    setContent(article.content);
    setSources(article.sources || '');
    setIsFeatured(article.is_featured);
    setOriginalDate(article.date);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategoryId(categoriesList[0]?.id || '');
    setContent('');
    setSources('');
    setIsFeatured(false);
    setOriginalDate('');
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateToSave = editingId ? originalDate : new Date().toLocaleDateString('en-US', dateOptions);

    try {
      const url = editingId 
        ? `/api/articles/${editingId}` 
        : '/api/articles';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        // IMPORTANT: Sending category_id to the backend
        body: JSON.stringify({ 
          title, 
          category_id: categoryId, 
          date: dateToSave, 
          content, 
          sources, 
          is_featured: isFeatured 
        })
      });

      const contentType = res.headers.get("content-type");
      let errorMsg = 'Failed to save article';

      if (!res.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
           const errData = await res.json();
           errorMsg = errData.error || errorMsg;
        } else {
           errorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const successMsg = editingId ? 'Article successfully updated! ✏️' : 'Article published! 📰';
      
      resetForm();
      fetchArticles();
      showNotification(successMsg);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newItems = [...articles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setArticles(newItems);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newItems.length; i++) {
      await fetch(`/api/articles/${newItems[i].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ order_index: i })
      });
    }
    showNotification('Order updated!');
  };

  const handleToggleFeature = async (id) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ is_featured: true })
    });
    fetchArticles();
    showNotification('Featured article updated! ⭐');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (editingId === id) resetForm();

    fetchArticles();
    showNotification('Article deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#121212] dark:text-slate-100 sm:p-10 font-sans">
      
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        
        <div>
          <button onClick={() => navigate('/admin')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white">
            ← Back to Dashboard
          </button>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage Articles
          </h1>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Article' : 'Publish New Article'}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Editing Mode Active
              </span>
            )}
          </div>

          <form onSubmit={handleSaveArticle} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input 
                type="text" 
                placeholder="Article Title" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
              
              {/* REAL RELATIONAL DROPDOWN */}
              <select 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)} 
                required
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:bg-[#1a1a1c] dark:focus:border-slate-400 dark:focus:ring-slate-400 cursor-pointer"
              >
                <option value="" disabled>Select a Category...</option>
                {categoriesList.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            
            <textarea 
              placeholder="Article Content (Paragraphs...)" 
              required 
              rows="8" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400"
            ></textarea>
            
            <textarea 
              placeholder="Sources / Links (Optional)" 
              rows="3" 
              value={sources} 
              onChange={(e) => setSources(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400"
            ></textarea>

            <div className="flex items-center gap-3 pt-2 pb-4">
              <input 
                type="checkbox" 
                id="featured" 
                checked={isFeatured} 
                onChange={(e) => setIsFeatured(e.target.checked)} 
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-white" 
              />
              <label htmlFor="featured" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Set as Featured Article (Hero Section)
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button type="submit" className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200">
                {editingId ? 'Update Article' : 'Publish Article'}
              </button>
              
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-full border border-slate-300 bg-transparent px-8 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500">
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Articles & Arrangement</h2>
          
          <div className="space-y-4">
            {articles.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                <div className="flex-1 min-w-0 sm:pr-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight break-words">
                      {item.title}
                    </h3>
                    <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {item.category || 'General'}
                    </span>
                    {item.is_featured && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.date} • Position index: {index + 1}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                  <button onClick={() => handleEdit(item)} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">Edit</button>
                  {!item.is_featured && (
                    <button onClick={() => handleToggleFeature(item.id)} className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40">Make Featured</button>
                  )}
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">↑ Up</button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === articles.length - 1} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">↓ Down</button>
                  <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}