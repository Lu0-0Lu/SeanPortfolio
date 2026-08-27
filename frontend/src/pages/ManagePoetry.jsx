import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePoetry() {
  const navigate = useNavigate();
  const [poetry, setPoetry] = useState([]);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [bgImage, setBgImage] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchPoetry = async () => {
    const res = await fetch('http://localhost:5000/api/poetry');
    const data = await res.json();
    setPoetry(data);
  };

  useEffect(() => {
    fetchPoetry();
  }, []);

  // Populate form when Edit is clicked
  const handleEdit = (poem) => {
    setEditingId(poem.id);
    setTitle(poem.title);
    setContent(poem.content);
    setBgImage(poem.bg_image_url || '');
    setIsFeatured(poem.is_featured);
    
    // Smooth scroll to the top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setBgImage('');
    setIsFeatured(false);
  };

  const handleSavePoetry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId 
        ? `http://localhost:5000/api/poetry/${editingId}` 
        : 'http://localhost:5000/api/poetry';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          title, 
          content, 
          bg_image_url: bgImage, 
          is_featured: isFeatured 
        })
      });

      const contentType = res.headers.get("content-type");
      let errorMsg = 'Failed to save poem';

      if (!res.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
           const errData = await res.json();
           errorMsg = errData.error || errorMsg;
        } else {
           errorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const successMsg = editingId ? 'Poem successfully updated! ✏️' : 'Poem published! ✒️';
      
      resetForm();
      fetchPoetry();
      showNotification(successMsg);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newItems = [...poetry];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    setPoetry(newItems);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newItems.length; i++) {
      await fetch(`http://localhost:5000/api/poetry/${newItems[i].id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ order_index: i })
      });
    }
    showNotification('Order updated!');
  };

  const handleToggleFeature = async (id) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/poetry/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ is_featured: true })
    });
    fetchPoetry();
    showNotification('Featured poetry updated! ⭐');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this poem?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/poetry/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (editingId === id) resetForm();

    fetchPoetry();
    showNotification('Poem deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-[#121212] dark:text-slate-100 sm:p-10 font-sans">
      
      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>

      <div className="mx-auto max-w-4xl space-y-10">
        
        {/* Header Area */}
        <div>
          <button 
            onClick={() => navigate('/admin')} 
            className="text-sm font-medium text-slate-500 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white"
          >
            ← Back to Dashboard
          </button>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Manage Poetry
          </h1>
        </div>

        {/* Add / Edit Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Poem' : 'Publish New Poem'}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Editing Mode Active
              </span>
            )}
          </div>

          <form onSubmit={handleSavePoetry} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input 
                type="text" 
                placeholder="Title of the Poem" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
              <input 
                type="text" 
                placeholder="Background Image URL (Optional)" 
                value={bgImage} 
                onChange={(e) => setBgImage(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
            </div>
            
            <textarea 
              placeholder="Write your poem here... (Line breaks will be preserved)" 
              required 
              rows="8" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
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
                Set as Featured Poem (Shows on Homepage)
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button 
                type="submit" 
                className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200"
              >
                {editingId ? 'Update Poem' : 'Publish Poem'}
              </button>
              
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="rounded-full border border-slate-300 bg-transparent px-8 py-3 text-sm font-bold text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:text-slate-300 dark:hover:border-slate-500"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Current List */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Poetry & Arrangement</h2>
          
          <div className="space-y-4">
            {poetry.map((item, index) => (
              <div 
                key={item.id} 
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]"
              >
                {/* LEFT SIDE: Text Content */}
                <div className="flex-1 min-w-0 sm:pr-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </h3>
                    {item.is_featured && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  {item.bg_image_url && (
                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      Has Custom Background
                    </p>
                  )}
                </div>

                {/* RIGHT SIDE: Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                  >
                    Edit
                  </button>

                  {!item.is_featured && (
                    <button 
                      onClick={() => handleToggleFeature(item.id)} 
                      className="rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-700 transition hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:hover:bg-amber-900/40"
                    >
                      Make Featured
                    </button>
                  )}
                  
                  <button 
                    onClick={() => handleMove(index, 'up')} 
                    disabled={index === 0} 
                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↑ Up
                  </button>
                  
                  <button 
                    onClick={() => handleMove(index, 'down')} 
                    disabled={index === poetry.length - 1} 
                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↓ Down
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}