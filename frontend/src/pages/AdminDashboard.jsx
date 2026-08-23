import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const modules = [
    { name: 'Projects', path: 'projects', icon: '🚀', desc: 'Manage your Bento grid and featured work.', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    { name: 'Experiences', path: 'experiences', icon: '💼', desc: 'Update your chronological work history.', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
    { name: 'Certifications', path: 'certifications', icon: '🏆', desc: 'Add new credentials and valid links.', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
    { name: 'Articles', path: 'articles', icon: '📰', desc: 'Publish tech articles and feature them.', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    { name: 'Books', path: 'books', icon: '📚', desc: 'Post book reviews, ratings, and synopses.', color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' },
    { name: 'Poetry', path: 'poetry', icon: '✒️', desc: 'Share creative writing and custom poems.', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 transition-all duration-300 dark:bg-slate-950 dark:text-slate-100 sm:p-10">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Control Panel</p>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          </div>
          <button onClick={handleLogout} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none">
            Sign Out
          </button>
        </div>
        
        {/* Management Grid - Now 3 columns wide so cards aren't massive */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
          {modules.map((item) => (
            <div key={item.name} className="group flex cursor-pointer flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500" onClick={() => navigate(`/admin/${item.path}`)}>
              <div>
                <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl text-xl ${item.color}`}>
                  {item.icon}
                </div>
                <h2 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">{item.name}</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}