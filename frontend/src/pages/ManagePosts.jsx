import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ManagePosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  
  // Form State
  const [postType, setPostType] = useState('book_review'); // 'book_review' or 'poetry'
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');

  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  const fetchPosts = async () => {
    const res = await fetch('http://localhost:5000/api/posts');
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleAddPost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');

    try {
      await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          post_type: postType, 
          title, 
          content, 
          author: postType === 'book_review' ? author : null, 
          rating: postType === 'book_review' ? rating : null 
        })
      });

      setTitle('');
      setContent('');
      setAuthor('');
      setRating('');
      fetchPosts();
      showNotification('Post added successfully! ✍️');
    } catch (err) {
      showNotification('Failed to add post.', 'error');
    }
  };

  const handleMove = async (index, direction) => {
    const newPosts = [...posts];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (targetIndex < 0 || targetIndex >= newPosts.length) return;

    const temp = newPosts[index];
    newPosts[index] = newPosts[targetIndex];
    newPosts[targetIndex] = temp;
    setPosts(newPosts);

    const token = localStorage.getItem('adminToken');
    for (let i = 0; i < newPosts.length; i++) {
      await fetch(`http://localhost:5000/api/posts/${newPosts[i].id}`, {
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
    if (!window.confirm('Delete this post?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`http://localhost:5000/api/posts/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchPosts();
    showNotification('Post deleted.', 'error');
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
            <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Manage Posts (Books & Poetry)</h1>
          </div>
        </div>

        {/* Add Form */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
          <h2 className="mb-4 text-xl font-bold">Add New Post</h2>
          <form onSubmit={handleAddPost} className="space-y-4">
            
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Content Type</label>
              <select 
                value={postType} 
                onChange={(e) => setPostType(e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800 dark:text-white"
              >
                <option value="book_review">Book Review</option>
                <option value="poetry">Poetry / Creative Writing</option>
              </select>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder={postType === 'book_review' ? "Book Title" : "Poem / Piece Title"} required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              
              {postType === 'book_review' ? (
                <input type="text" placeholder="Author (e.g., Fyodor Dostoevsky)" required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              ) : (
                <input type="text" placeholder="Rating (Optional, e.g., 5/5)" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
              )}
            </div>

            {postType === 'book_review' && (
              <input type="text" placeholder="Rating (e.g., 5/5)" required value={rating} onChange={(e) => setRating(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800" />
            )}

            <textarea placeholder={postType === 'book_review' ? "Key Takeaway / Review summary..." : "Write your poem or reflection here..."} required rows="4" value={content} onChange={(e) => setContent(e.target.value)} className="w-full rounded-lg border border-slate-300 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800"></textarea>

            <button type="submit" className="rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">
              Save Post
            </button>
          </form>
        </div>

        {/* Current List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Current Posts & Arrangement</h2>
          {posts.map((post, index) => (
            <div key={post.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold">{post.title}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${post.post_type === 'book_review' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'}`}>
                    {post.post_type === 'book_review' ? '📖 Book Review' : '✍️ Poetry'}
                  </span>
                </div>
                <p className="text-sm text-slate-500">{post.author ? `By ${post.author}` : 'Personal piece'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => handleMove(index, 'up')} disabled={index === 0} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↑ Up
                </button>
                <button onClick={() => handleMove(index, 'down')} disabled={index === posts.length - 1} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-40 dark:bg-slate-800 dark:text-slate-300">
                  ↓ Down
                </button>
                <button onClick={() => handleDelete(post.id)} className="rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400">
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