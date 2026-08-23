import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Filter out the featured article so we don't list it twice
  const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-16 pb-16 pt-10 sm:pt-16">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-10 dark:border-slate-800">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Insights & Tutorials
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Tech Articles
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Deep dives into hardware integration, web frameworks, and digital transformation.
              </p>
            </div>

            {loading ? (
              <div className="text-slate-500">Loading articles...</div>
            ) : (
              <>
                {/* Featured Article Section */}
                {featuredArticle && (
                  <section className="space-y-6">
                    <div className="inline-flex rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-amber-700 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
                      ⭐ Featured Read
                    </div>
                    
                    <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                      <header className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">{featuredArticle.title}</h2>
                        <p className="mt-3 text-sm font-medium text-slate-500">{featuredArticle.date}</p>
                      </header>
                      
                      <div className="prose prose-slate max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
                        {featuredArticle.content.split('\n').map((paragraph, idx) => (
                          paragraph.trim() && <p key={idx} className="mb-4 leading-relaxed text-lg">{paragraph}</p>
                        ))}
                      </div>

                      {featuredArticle.sources && (
                        <div className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800">
                          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Sources & References</h5>
                          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-500">{featuredArticle.sources}</p>
                        </div>
                      )}
                    </article>
                  </section>
                )}

                {/* Regular Articles Feed */}
                {regularArticles.length > 0 && (
                  <section className="space-y-8 pt-10">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">More Articles</h3>
                    
                    <div className="grid gap-8 sm:grid-cols-2">
                      {regularArticles.map((article) => (
                        <article key={article.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
                          <p className="mb-3 text-sm font-medium text-slate-500">{article.date}</p>
                          <h4 className="mb-4 text-xl font-bold text-slate-900 dark:text-white">{article.title}</h4>
                          
                          {/* Show a preview snippet (first 150 chars) of the article */}
                          <p className="mb-6 line-clamp-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">
                            {article.content}
                          </p>

                          <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800">
                            <button className="text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                              Read Full Article →
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}