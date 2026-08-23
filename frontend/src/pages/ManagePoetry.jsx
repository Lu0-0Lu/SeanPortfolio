import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePoetry() {
  const navigate = useNavigate();
  const [poetry, setPoetry] = useState([]);
  
  // Form State
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

  const handleAddPoetry = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await fetch('http://localhost:5000/api/poetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          title, 
          content, 
          bg_image_url: bgImage, 
          is_featured: isFeatured 
        })
      });

      setTitle(''); setContent(''); setBgImage(''); setIsFeatured(false);
      fetchPoetry();
      showNotification('Poem published! ✒️');
    } catch (err) {
      showNotification('Failed to add poetry.', 'error');
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
    fetchPoetry();
    showNotification('Poem deleted.', 'error');
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
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Manage Poetry</h1>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <form onSubmit={handleAddPoetry} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Title of the Poem" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Background Image URL (Optional)" value={bgImage} onChange={(e) => setBgImage(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>
            
            <textarea placeholder="Write your poem here... (Line breaks will be preserved)" required rows="8" value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800"></textarea>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300">Set as Featured Poem (Shows on Homepage)</label>
            </div>

            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">Publish Poem</button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Poetry</h2>
          {poetry.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{item.title}</h3>
                  {item.is_featured && <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">⭐ Featured</span>}
                </div>
                {item.bg_image_url && <p className="text-xs text-slate-500">Has Custom Background</p>}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!item.is_featured && <button onClick={() => handleToggleFeature(item.id)} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">Make Featured</button>}
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">↑</button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === poetry.length - 1} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">↓</button>
                <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}