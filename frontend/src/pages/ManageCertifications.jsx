import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageCertifications() {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [verificationLink, setVerificationLink] = useState('');

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchCertifications = async () => {
    const res = await fetch('http://localhost:5000/api/certifications');
    const data = await res.json();
    setCertifications(data);
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  const handleAddCertification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await fetch('http://localhost:5000/api/certifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, 
          issuer, 
          date_issued: dateIssued, 
          verification_link: verificationLink || '#' 
        })
      });

      setTitle('');
      setIssuer('');
      setDateIssued('');
      setVerificationLink('');
      fetchCertifications();
      showNotification('Certification added successfully! 🏆');
    } catch (err) {
      showNotification('Failed to add certification.', 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newCerts = [...certifications];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newCerts.length) return;

    const temp = newCerts[index];
    newCerts[index] = newCerts[targetIndex];
    newCerts[targetIndex] = temp;
    setCertifications(newCerts);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newCerts.length; i++) {
      await fetch(`http://localhost:5000/api/certifications/${newCerts[i].id}`, {
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
    if (!window.confirm('Delete this certification?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/certifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchCertifications();
    showNotification('Certification deleted.', 'error');
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
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Manage Certifications</h1>
          </div>
        </div>

        {/* Add Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold">Add New Certification</h2>
          <form onSubmit={handleAddCertification} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Certification Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Issuing Organization" required value={issuer} onChange={(e) => setIssuer(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Date Issued (e.g., 2026)" required value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              <input type="text" placeholder="Verification Link URL (Optional)" value={verificationLink} onChange={(e) => setVerificationLink(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            </div>

            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">
              Save Certification
            </button>
          </form>
        </div>

        {/* Current List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Certifications & Arrangement</h2>
          {certifications.map((cert, index) => (
            <div key={cert.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <h3 className="font-bold">{cert.title}</h3>
                <p className="text-sm text-slate-500">{cert.issuer} • {cert.date_issued}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↑ Up
                </button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === certifications.length - 1} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↓ Down
                </button>
                <button onClick={() => handleDelete(cert.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
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