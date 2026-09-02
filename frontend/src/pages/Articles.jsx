import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animation States
  const [visibleArticles, setVisibleArticles] = useState(new Set());
  const featuredRef = useRef(null);
  const [isFeaturedVisible, setIsFeaturedVisible] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        const featured = data.find((a) => a.is_featured) || data[0];
        if (featured) setFeaturedArticle(featured);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Intersection Observer for Animations
  useEffect(() => {
    if (loading) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target === featuredRef.current) setIsFeaturedVisible(true);
          
          if (entry.target.hasAttribute('data-article-id')) {
            const id = entry.target.getAttribute('data-article-id');
            setVisibleArticles(prev => new Set(prev).add(id));
          }
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -50px 0px", threshold: 0.1 });

    if (featuredRef.current) observer.observe(featuredRef.current);
    
    const nodes = document.querySelectorAll('.article-card');
    nodes.forEach(node => observer.observe(node));

    return () => observer.disconnect();
  }, [articles, loading]);

  // 1. Filter out the featured article
  const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);

  // 2. Dynamically group the remaining articles by their Category
  const groupedArticles = regularArticles.reduce((groups, article) => {
    const category = article.category || 'General';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(article);
    return groups;
  }, {});

  // 3. Extract the category names so we can loop through them
  const categories = Object.keys(groupedArticles);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100 font-sans">
        <Navbar />

        <MainLayout>
          <main className="mx-auto max-w-6xl space-y-16 pb-20 pt-16 sm:pt-15">
            
            {/* Page Header (Animated) */}
            <div className="border-b border-slate-200 pb-6 dark:border-slate-800 animate-fade-in-up">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Insights & Tutorials
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Tech Articles
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Deep dives into hardware integration, web frameworks, and digital transformation.
              </p>
            </div>

            {loading ? (
              <p className="font-mono text-slate-500 animate-pulse">Loading articles...</p>
            ) : (
              <div className="space-y-16">
                
                {/* --- HERO SECTION: Featured Article --- */}
                {featuredArticle && (
                  <section ref={featuredRef} className={`space-y-6 transition-all duration-1000 ease-out ${isFeaturedVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-900/50 dark:bg-[#1a1a1c] dark:text-amber-400">
                      ⭐ Featured Read
                    </div>
                    
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] ring-1 ring-amber-500/10 dark:ring-amber-500/5">
                      <header className="mb-6">
                        <div className="mb-4 inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          {featuredArticle.category || 'General'}
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl break-words leading-tight">
                          {featuredArticle.title}
                        </h2>
                        <p className="mt-3 text-sm font-medium text-slate-500 dark:text-slate-400">
                          {featuredArticle.date} • By Sean Brandon F. Reyes
                        </p>
                      </header>
                      
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base line-clamp-4">
                        {featuredArticle.content.split('\n').map((paragraph, idx) => (
                          paragraph.trim() && <p key={idx} className="mb-4 last:mb-0 break-words">{paragraph}</p>
                        ))}
                      </div>

                      <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800">
                        <Link 
                          to={`/articles/${featuredArticle.id}`} 
                          className="inline-flex items-center rounded-full bg-slate-900 px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-white dark:text-[#121212]"
                        >
                          Read Full Article →
                        </Link>
                      </div>
                    </article>
                  </section>
                )}

                {/* --- DYNAMIC CATEGORIES SECTION --- */}
                {categories.length > 0 && (
                  <div className="space-y-16 pt-4">
                    {categories.map((category) => (
                      <section key={category} className="space-y-8">
                        
                        {/* Category Header */}
                        <div className="flex items-center gap-4">
                          <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {category}
                          </h3>
                          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                        </div>
                        
                        {/* Category Articles Grid */}
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                          {groupedArticles[category].map((article, index) => {
                            const isVisible = visibleArticles.has(String(article.id));
                            return (
                            <article 
                              key={article.id} 
                              data-article-id={article.id}
                              className={`article-card flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-[700ms] hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] ease-out ${
                                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                              }`}
                              style={{ transitionDelay: `${index * 100}ms` }}
                            >
                              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                {article.date}
                              </p>
                              
                              <h4 className="mb-3 text-xl font-bold tracking-tight text-slate-900 dark:text-white break-words leading-snug">
                                {article.title}
                              </h4>
                              
                              <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300 break-words flex-1">
                                {article.content}
                              </p>

                              <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800 flex items-center justify-between">
                                <Link 
                                  to={`/articles/${article.id}`} 
                                  className="text-sm font-bold text-blue-600 hover:text-blue-700 transition dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                  Read Article →
                                </Link>
                              </div>
                            </article>
                          )})}
                        </div>

                      </section>
                    ))}
                  </div>
                )}
              </div>
            )}

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}