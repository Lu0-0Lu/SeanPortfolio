import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Shred the VIP pass and kick them to the login screen
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-all duration-300 dark:bg-slate-950 dark:text-slate-100 sm:p-10">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Control Panel</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          
          <button 
            onClick={handleLogout}
            className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none"
          >
            Sign Out
          </button>
        </div>
        
        {/* Management Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {['Projects', 'Experiences', 'Certifications', 'Posts'].map((item) => (
            <div key={item} className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{item}</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add, edit, or remove {item.toLowerCase()}.</p>
              
              <button 
                onClick={() => navigate(`/admin/${item.toLowerCase()}`)}
                className="mt-6 w-full rounded-full bg-slate-100 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
                >
                Manage {item}
                </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}