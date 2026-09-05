import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManageProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);

  // Form State
  const [editingId, setEditingId] = useState(null);
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
    const res = await fetch('/api/projects');
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

  // Populate form when Edit is clicked
  const handleEdit = (project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setVideoUrl(project.video_url || '');
    setImages(project.images && project.images.length > 0 ? project.images : ['']);
    setIsFeatured(project.is_featured);
    
    // Smooth scroll to the top of the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setImages(['']);
    setIsFeatured(false);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken'); // Changed back to adminToken
    const finalVideoUrl = formatYouTubeUrl(videoUrl);
    const validImages = images.filter(url => url.trim() !== '');

    try {
      const url = editingId 
        ? `/api/projects/${editingId}` 
        : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          title, description, video_url: finalVideoUrl, images: validImages, is_featured: isFeatured 
        })
      });

      // Safely check if the response is actually JSON before parsing
      const contentType = res.headers.get("content-type");
      let errorMsg = 'Failed to save project';

      if (!res.ok) {
        if (contentType && contentType.indexOf("application/json") !== -1) {
           const errData = await res.json();
           errorMsg = errData.error || errorMsg;
        } else {
           errorMsg = `Server Error: ${res.status} ${res.statusText}`;
        }
        throw new Error(errorMsg);
      }

      const successMsg = editingId ? 'Project successfully updated! ✏️' : 'Project successfully added! 🎉';
      
      resetForm();
      fetchProjects();
      showNotification(successMsg);
    } catch (err) {
      showNotification(`Error: ${err.message}`, 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newProjects = [...projects];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newProjects.length) return;

    const temp = newProjects[index];
    newProjects[index] = newProjects[targetIndex];
    newProjects[targetIndex] = temp;

    setProjects(newProjects);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newProjects.length; i++) {
      await fetch(`/api/projects/${newProjects[i].id}`, {
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

  const handleToggleFeature = async (id) => {
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/projects/${id}`, {
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
    await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (editingId === id) resetForm(); // Clear form if the deleted item was being edited
    
    fetchProjects();
    showNotification('Project deleted.', 'error');
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
            Manage Projects
          </h1>
        </div>

        {/* Add / Edit Project Form Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Project' : 'Add New Project'}
            </h2>
            {editingId && (
              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                Editing Mode Active
              </span>
            )}
          </div>
          
          <form onSubmit={handleSaveProject} className="space-y-5">
            <input 
              type="text" 
              placeholder="Project Title" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
            />
            
            <textarea 
              placeholder="Description" 
              required 
              rows="4" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400"
            ></textarea>

            <div className="space-y-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Project Images (Up to 5)</label>
              {images.map((img, index) => (
                <input 
                  key={index} 
                  type="text" 
                  placeholder={`Image URL ${index + 1}`} 
                  value={img} 
                  onChange={(e) => {
                    const newImages = [...images];
                    newImages[index] = e.target.value;
                    setImages(newImages);
                  }} 
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
                />
              ))}
              {images.length < 5 && (
                <button 
                  type="button" 
                  onClick={() => setImages([...images, ''])} 
                  className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  + Add another image
                </button>
              )}
            </div>

            <input 
              type="text" 
              placeholder="YouTube URL (Optional)" 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 dark:border-slate-700 dark:text-white dark:focus:border-slate-400 dark:focus:ring-slate-400" 
            />

            <div className="flex items-center gap-3 pt-2 pb-4">
              <input 
                type="checkbox" 
                id="featured" 
                checked={isFeatured} 
                onChange={(e) => setIsFeatured(e.target.checked)} 
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-white" 
              />
              <label htmlFor="featured" className="text-sm font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                Set as Featured Project (Hero Showcase)
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button 
                type="submit" 
                className="rounded-full bg-slate-900 px-8 py-3 text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-[#121212] dark:hover:bg-slate-200"
              >
                {editingId ? 'Update Project' : 'Save Project'}
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

        {/* Projects List with Reordering */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Current Projects & Arrangement</h2>
          
          <div className="space-y-4">
            {projects.map((project, index) => (
              <div 
                key={project.id} 
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]"
              >
                {/* LEFT SIDE: Text Content (Added flex-1, min-w-0, and right padding) */}
                <div className="flex-1 min-w-0 sm:pr-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                      {project.title}
                    </h3>
                    {project.is_featured && (
                      <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Position index: {index + 1}
                  </p>
                </div>

                {/* RIGHT SIDE: Buttons (Added shrink-0 so they never get squished) */}
                <div className="flex flex-wrap items-center gap-2 shrink-0 sm:justify-end">
                  <button 
                    onClick={() => handleEdit(project)} 
                    className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                  >
                    Edit
                  </button>
                  
                  {!project.is_featured && (
                    <button 
                      onClick={() => handleToggleFeature(project.id)} 
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
                    disabled={index === projects.length - 1} 
                    className="rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    ↓ Down
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(project.id)} 
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