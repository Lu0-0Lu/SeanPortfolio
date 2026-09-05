import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function ArticleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State for the guaranteed slide-up animation
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/articles/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Article not found');
        return res.json();
      })
      .then((data) => {
        setArticle(data);
        setLoading(false);
        // Trigger the animation shortly after the data renders into the DOM
        setTimeout(() => setIsLoaded(true), 50);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100 font-sans">
        <Navbar />

        <MainLayout>
          <main className="pb-20 pt-12 sm:pt-20">
            <button 
              onClick={() => navigate('/articles')}
              className="mb-10 text-sm font-bold text-slate-500 hover:text-slate-900 transition dark:text-slate-400 dark:hover:text-white"
            >
              ← Back to Articles
            </button>

            {loading ? (
              <div className="text-slate-500 font-mono animate-pulse">Loading article...</div>
            ) : !article ? (
              <div className="text-red-500 font-bold text-xl">Article not found.</div>
            ) : (
              <article 
                className={`mx-auto max-w-3xl transition-all duration-[800ms] ease-out ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                }`}
              >
                
                <header className="mb-12 border-b border-slate-200 pb-10 dark:border-slate-800">
                  {article.is_featured && (
                    <div className="mb-6 inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-900/50 dark:bg-[#1a1a1c] dark:text-amber-400">
                      ⭐ Featured Read
                    </div>
                  )}
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl dark:text-white break-words leading-tight">
                    {article.title}
                  </h1>
                  <div className="mt-8 flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <p>{article.date}</p>
                    <span className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                    <p>By Sean Brandon F. Reyes</p>
                  </div>
                </header>

                <div className="prose prose-slate prose-lg max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
                  {article.content.split('\n').map((paragraph, idx) => (
                    paragraph.trim() && <p key={idx} className="mb-6 leading-relaxed break-words">{paragraph}</p>
                  ))}
                </div>

                {article.sources && (
                  <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                    <h5 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                      Sources & References
                    </h5>
                    <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600 dark:text-slate-400 break-words">
                      {article.sources}
                    </p>
                  </div>
                )}
                
              </article>
            )}
          </main>
        </MainLayout>
        
        <Footer />
      </div>
    </ThemeProvider>
  );
}