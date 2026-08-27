import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageExperiences() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [bullets, setBullets] = useState(['']);

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchExperiences = async () => {
    const res = await fetch('http://localhost:5000/api/experiences');
    const data = await res.json();
    setExperiences(data);
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  // Populate form when Edit is clicked
  const handleEdit = (exp) => {
    setEditingId(exp.id);
    setRole(exp.role);
    setCompany(exp.company);
    setLocation(exp.location);
    setPeriod(exp.period);
    setBullets(exp.bullets && exp.bullets.length > 0 ? exp.bullets : ['']);
    
    // Smooth scroll to the top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setRole('');
    setCompany('');
    setLocation('');
    setPeriod('');
    setBullets(['']);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const validBullets = bullets.filter(b => b.trim() !== '');

    try {
      const url = editingId 
        ? `http://localhost:5000/api/experiences/${editingId}` 
        : 'http://localhost:5000/api/experiences';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role, company, location, period, bullets: validBullets })
      });

      // Safely check if the response is actually JSON before parsing
      const contentType = res.headers.get("content-type");
      let errorMsg = 'Failed to save experience';

      if (!res.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
           const errData = await res.json();
           errorMsg = errData.error || errorMsg;
        } else {
           errorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const successMsg = editingId ? 'Experience successfully updated! ✏️' : 'Experience successfully added! 🎉';
      
      resetForm();
      fetchExperiences();
      showNotification(successMsg);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newExps = [...experiences];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newExps.length) return;

    const temp = newExps[index];
    newExps[index] = newExps[targetIndex];
    newExps[targetIndex] = temp;
    setExperiences(newExps);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newExps.length; i++) {
      await fetch(`http://localhost:5000/api/experiences/${newExps[i].id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ order_index: i })
      });
    }
    showNotification('Order updated successfully!');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this experience item?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/experiences/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (editingId === id) resetForm(); // Clear form if the deleted item was being edited

    fetchExperiences();
    showNotification('Experience deleted.', 'error');
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
            Manage Experiences
          </h1>
        </div>

        {/* Add / Edit Experience Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Work Experience' : 'Add New Work Experience'}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Editing Mode Active
              </span>
            )}
          </div>

          <form onSubmit={handleSaveExperience} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input 
                type="text" 
                placeholder="Role / Job Title" 
                required 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
              <input 
                type="text" 
                placeholder="Company / Organization" 
                required 
                value={company} 
                onChange={(e) => setCompany(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input 
                type="text" 
                placeholder="Location (e.g., Quezon City)" 
                required 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
              <input 
                type="text" 
                placeholder="Period (e.g., Aug 2024 – Present)" 
                required 
                value={period} 
                onChange={(e) => setPeriod(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
            </div>

            {/* Dynamic Bullet Points */}
            <div className="space-y-3 pt-2">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Key Responsibilities / Bullet Points</label>
              {bullets.map((bullet, index) => (
                <div key={index} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder={`Bullet point ${index + 1}`} 
                    value={bullet} 
                    onChange={(e) => {
                      const newBullets = [...bullets];
                      newBullets[index] = e.target.value;
                      setBullets(newBullets);
                    }} 
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
                  />
                  {bullets.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => setBullets(bullets.filter((_, i) => i !== index))}
                      className="shrink-0 rounded-xl px-4 text-slate-400 hover:bg-red-50 hover:text-red-600 transition dark:hover:bg-red-900/30 dark:hover:text-red-400"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => setBullets([...bullets, ''])} 
                className="mt-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition dark:text-emerald-400 dark:hover:text-emerald-300"
              >
                + Add another bullet point
              </button>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit" 
                className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200"
              >
                {editingId ? 'Update Experience' : 'Save Experience'}
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

        {/* Current Experiences List */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Experiences & Arrangement</h2>
          
          <div className="space-y-4">
            {experiences.map((item, index) => (
              <div 
                key={item.id} 
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]"
              >
                {/* LEFT SIDE: Text Content (Flex-1 and min-w-0 for wrapping) */}
                <div className="flex-1 min-w-0 sm:pr-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {item.role} <span className="font-normal text-slate-500 dark:text-slate-400">at {item.company}</span>
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {item.period} • {item.location}
                  </p>
                </div>

                {/* RIGHT SIDE: Buttons (Shrink-0 to prevent squishing) */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                  >
                    Edit
                  </button>
                  
                  <button 
                    onClick={() => handleMove(index, 'up')} 
                    disabled={index === 0} 
                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↑ Up
                  </button>
                  
                  <button 
                    onClick={() => handleMove(index, 'down')} 
                    disabled={index === experiences.length - 1} 
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