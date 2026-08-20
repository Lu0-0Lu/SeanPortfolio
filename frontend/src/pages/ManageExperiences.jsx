import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageExperiences() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  
  // Form State
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [period, setPeriod] = useState('');
  const [bullets, setBullets] = useState(['']); // Starts with 1 empty bullet input

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

  const handleAddExperience = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const validBullets = bullets.filter(b => b.trim() !== '');

    try {
      await fetch('http://localhost:5000/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role, company, location, period, bullets: validBullets })
      });

      setRole('');
      setCompany('');
      setLocation('');
      setPeriod('');
      setBullets(['']);
      fetchExperiences();
      showNotification('Experience added successfully! 🎉');
    } catch (err) {
      showNotification('Failed to add experience.', 'error');
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
    fetchExperiences();
    showNotification('Experience deleted.', 'error');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950 dark:text-slate-100 sm:p-10">
      <div className={`fixed bottom-6 right-6 z-50 rounded-lg px-6 py-3 text-sm font-bold text-white shadow-xl transition-all duration-300 ${popup.show ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'} ${popup.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'}`}>
        {popup.message}
      </div>

      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <button onClick={() => navigate('/admin')} className="text-sm font-medium text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
              ← Back to Dashboard
            </button>
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Manage Experiences</h1>
          </div>
        </div>

        {/* Add Experience Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold">Add New Work Experience</h2>
          <form onSubmit={handleAddExperience} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Role / Job Title" required value={role} onChange={(e) => setRole(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Company / Organization" required value={company} onChange={(e) => setCompany(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Location (e.g., Quezon City)" required value={location} onChange={(e) => setLocation(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Period (e.g., Aug 2024 – Present)" required value={period} onChange={(e) => setPeriod(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>

            {/* Dynamic Bullet Points */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Key Responsibilities / Bullet Points</label>
              {bullets.map((bullet, index) => (
                <input 
                  key={index} 
                  type="text" 
                  placeholder={`Bullet point ${index + 1}`} 
                  value={bullet} 
                  onChange={(e) => {
                    const newBullets = [...bullets];
                    newBullets[index] = e.target.value;
                    setBullets(newBullets);
                  }} 
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" 
                />
              ))}
              <button type="button" onClick={() => setBullets([...bullets, ''])} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                + Add another bullet point
              </button>
            </div>

            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">
              Save Experience
            </button>
          </form>
        </div>

        {/* Current Experiences List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Experiences & Arrangement</h2>
          {experiences.map((item, index) => (
            <div key={item.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <h3 className="font-bold">{item.role} <span className="font-normal text-slate-500">at {item.company}</span></h3>
                <p className="text-sm text-slate-500">{item.period}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↑ Up
                </button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === experiences.length - 1} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↓ Down
                </button>
                <button onClick={() => handleDelete(item.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}