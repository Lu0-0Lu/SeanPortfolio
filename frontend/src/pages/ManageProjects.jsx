import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [images, setImages] = useState(['']);
  const [isFeatured, setIsFeatured] = useState(false);
  
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchProjects = async () => {
    const res = await fetch('http://localhost:5000/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const formatYouTubeUrl = (url) => {
    if (!url) return null;
    let formatted = url;
    if (formatted.includes('watch?v=')) {
      formatted = formatted.replace('watch?v=', 'embed/');
      formatted = formatted.split('&')[0]; 
    } else if (formatted.includes('youtu.be/')) {
      formatted = formatted.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return formatted;
  };

  const handleAddProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const finalVideoUrl = formatYouTubeUrl(videoUrl);
    const validImages = images.filter(url => url.trim() !== '');

    try {
      await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, description, video_url: finalVideoUrl, images: validImages, is_featured: isFeatured 
        })
      });

      setTitle('');
      setDescription('');
      setVideoUrl('');
      setImages(['']);
      setIsFeatured(false);
      fetchProjects();
      showNotification('Project successfully added! 🎉');
    } catch (err) {
      showNotification('Failed to add project.', 'error');
    }
  };

  // Handle reordering (Moving up or down)
  const handleMove = async (index, direction) => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    // Swap positions in array
    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);

    // Save new order indexes to database
    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newProjects.length; i++) {
      await fetch(`http://localhost:5000/api/projects/${newProjects[i].id}`, {
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

  // Handle setting a featured project
  const handleToggleFeature = async (id) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ is_featured: true })
    });
    fetchProjects();
    showNotification('Featured project updated! ⭐');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchProjects();
    showNotification('Project deleted.', 'error');
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
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Manage Projects</h1>
          </div>
        </div>

        {/* Add Project Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold">Add New Project</h2>
          <form onSubmit={handleAddProject} className="space-y-4">
            <input type="text" placeholder="Project Title" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            <textarea placeholder="Description" required rows="3" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800"></textarea>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Project Images (Up to 5)</label>
              {images.map((img, index) => (
                <input key={index} type="text" placeholder={`Image URL ${index + 1}`} value={img} onChange={(e) => {
                  const newImages = [...images];
                  newImages[index] = e.target.value;
                  setImages(newImages);
                }} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              ))}
              {images.length < 5 && (
                <button type="button" onClick={() => setImages([...images, ''])} className="text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400">
                  + Add another image
                </button>
              )}
            </div>

            <input type="text" placeholder="YouTube URL (Optional)" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            
            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="featured" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-500" />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700 dark:text-slate-300">Set as Featured Project (Hero Showcase)</label>
            </div>

            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">
              Save Project
            </button>
          </form>
        </div>

        {/* Projects List with Reordering */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Projects & Arrangement</h2>
          {projects.map((project, index) => (
            <div key={project.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{project.title}</h3>
                  {project.is_featured && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      ⭐ Featured
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500">Position index: {index + 1}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {!project.is_featured && (
                  <button onClick={() => handleToggleFeature(project.id)} className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-100 dark:bg-amber-900/20 dark:text-amber-400">
                    Make Featured
                  </button>
                )}
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↑ Up
                </button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === projects.length - 1} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↓ Down
                </button>
                <button onClick={() => handleDelete(project.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
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