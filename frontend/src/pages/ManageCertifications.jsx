import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageCertifications() {
  const navigate = useNavigate();
  const [certifications, setCertifications] = useState([]);
  
  // Form State
  const [editingId, setEditingId] = useState(null);
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
    const res = await fetch('/api/certifications');
    const data = await res.json();
    setCertifications(data);
  };

  useEffect(() => {
    fetchCertifications();
  }, []);

  // Populate form when Edit is clicked
  const handleEdit = (cert) => {
    setEditingId(cert.id);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setDateIssued(cert.date_issued);
    setVerificationLink(cert.verification_link === '#' ? '' : cert.verification_link);
    
    // Smooth scroll to the top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setIssuer('');
    setDateIssued('');
    setVerificationLink('');
  };

  const handleSaveCertification = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      const url = editingId 
        ? `/api/certifications/${editingId}` 
        : '/api/certifications';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
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

      const contentType = res.headers.get("content-type");
      let errorMsg = 'Failed to save certification';

      if (!res.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
           const errData = await res.json();
           errorMsg = errData.error || errorMsg;
        } else {
           errorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const successMsg = editingId ? 'Certification successfully updated! ✏️' : 'Certification added successfully! 🏆';
      
      resetForm();
      fetchCertifications();
      showNotification(successMsg);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
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
      await fetch(`/api/certifications/${newCerts[i].id}`, {
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
    await fetch(`/api/certifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (editingId === id) resetForm();

    fetchCertifications();
    showNotification('Certification deleted.', 'error');
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
            Manage Certifications
          </h1>
        </div>

        {/* Add / Edit Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Certification' : 'Add New Certification'}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Editing Mode Active
              </span>
            )}
          </div>

          <form onSubmit={handleSaveCertification} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <input 
                type="text" 
                placeholder="Certification Title" 
                required 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
              <input 
                type="text" 
                placeholder="Issuing Organization" 
                required 
                value={issuer} 
                onChange={(e) => setIssuer(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <input 
                type="text" 
                placeholder="Date Issued (e.g., 2026)" 
                required 
                value={dateIssued} 
                onChange={(e) => setDateIssued(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
              <input 
                type="text" 
                placeholder="Verification Link URL (Optional)" 
                value={verificationLink} 
                onChange={(e) => setVerificationLink(e.target.value)} 
                className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button 
                type="submit" 
                className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200"
              >
                {editingId ? 'Update Certification' : 'Save Certification'}
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
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Certifications & Arrangement</h2>
          
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div 
                key={cert.id} 
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]"
              >
                {/* LEFT SIDE: Text Content */}
                <div className="flex-1 min-w-0 sm:pr-4">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                    {cert.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    {cert.issuer} • {cert.date_issued}
                  </p>
                </div>

                {/* RIGHT SIDE: Buttons */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                  <button 
                    onClick={() => handleEdit(cert)} 
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
                    disabled={index === certifications.length - 1} 
                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↓ Down
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(cert.id)} 
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