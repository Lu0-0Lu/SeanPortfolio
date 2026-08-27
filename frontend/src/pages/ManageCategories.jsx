import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      showNotification('Failed to fetch categories', 'error');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleEdit = (category) => {
    setEditingId(category.id);
    setName(category.name);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditingId(null);
    setName('');
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId 
        ? `http://localhost:5000/api/categories/${editingId}` 
        : 'http://localhost:5000/api/categories';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ name: name.trim() })
      });

      const contentType = res.headers.get("content-type");
      let errorMsg = 'Failed to save category';

      if (!res.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
           const errData = await res.json();
           errorMsg = errData.error || errorMsg;
        } else {
           errorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const successMsg = editingId ? 'Category updated! ✏️' : 'Category created! 📁';
      
      resetForm();
      fetchCategories();
      showNotification(successMsg);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newItems = [...categories];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setCategories(newItems);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newItems.length; i++) {
      await fetch(`http://localhost:5000/api/categories/${newItems[i].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ order_index: i })
      });
    }
    showNotification('Category order updated!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Articles in this category will not be deleted, but will lose their category.')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/categories/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (editingId === id) resetForm();

    fetchCategories();
    showNotification('Category deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#121212] dark:text-slate-100 sm:p-10 font-sans">
      
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>

      <div className="mx-auto max-w-3xl space-y-10">
        
        <div>
          <button onClick={() => navigate('/admin')} className="text-sm font-medium text-slate-500 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white">
            ← Back to Dashboard
          </button>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage Categories
          </h1>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Editing Mode Active
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCategory} className="flex flex-col sm:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Category Name (e.g., Web Development)" 
              required 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="flex-1 rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
            />
            
            <div className="flex items-center gap-2 shrink-0">
              <button type="submit" className="rounded-xl bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200 w-full sm:w-auto">
                {editingId ? 'Update' : 'Add Category'}
              </button>
              
              {editingId && (
                <button type="button" onClick={resetForm} className="rounded-xl border border-slate-300 bg-transparent px-6 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Categories</h2>
          
          <div className="space-y-3">
            {categories.map((item, index) => (
              <div key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                <div className="flex-1 min-w-0 sm:pr-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight break-words">
                    {item.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                  <button onClick={() => handleEdit(item)} className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40">Edit</button>
                  <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">↑ Up</button>
                  <button onClick={() => handleMove(index, 'down')} disabled={index === categories.length - 1} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">↓ Down</button>
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