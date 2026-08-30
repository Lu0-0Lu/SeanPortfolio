import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both books and the tags dictionary simultaneously
    const fetchData = async () => {
      try {
        const [booksRes, tagsRes] = await Promise.all([
          fetch('http://localhost:5000/api/books'),
          fetch('http://localhost:5000/api/book-tags')
        ]);

        if (booksRes.ok) setBooks(await booksRes.json());
        if (tagsRes.ok) setTagsList(await tagsRes.json());
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch library data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100 font-sans">
        <Navbar />

        <MainLayout>
          <main className="mx-auto max-w-6xl space-y-12 pb-20 pt-16 sm:pt-15">
            
            {/* Page Header */}
            <div className="border-b border-slate-200 pb-6 dark:border-slate-800">
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Literature & Philosophy
              </p>
              <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Library
              </h1>
              <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                Reflections, takeaways, and thoughts on the literature that shapes my perspective.
              </p>
            </div>

            {loading ? (
              <p className="font-mono text-slate-500 animate-pulse">Loading library...</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {books.length > 0 ? (
                  books.map((book) => (
                    <article 
                      key={book.id} 
                      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]"
                    >
                      {/* Physical Book Cover Area */}
                      <div className="relative flex h-72 w-full items-center justify-center overflow-hidden bg-slate-100 p-6 dark:bg-[#121212] border-b border-slate-200 dark:border-slate-800">
                        
                        {/* Blurred background */}
                        {book.cover_image_url && (
                          <div 
                            className="absolute inset-0 opacity-40 blur-2xl transition-opacity duration-700 group-hover:opacity-60 dark:opacity-20 dark:group-hover:opacity-40"
                            style={{ backgroundImage: `url(${book.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                          ></div>
                        )}

                        {/* Physical book floating */}
                        {book.cover_image_url && (
                          <img 
                            src={book.cover_image_url} 
                            alt={book.title} 
                            className="relative z-10 h-full w-auto object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-105" 
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                      </div>

                      {/* Card Content Area */}
                      <div className="flex flex-1 flex-col p-6">
                        
                        {/* Meta Tags */}
                        <div className="mb-4 flex items-center justify-between">
                          <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                            {book.category || 'General'}
                          </span>
                          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/50 dark:text-amber-400">
                            ⭐ {book.rating}
                          </span>
                        </div>

                        {/* Title & Author */}
                        <h2 className="mb-1 text-2xl font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                          {book.title}
                        </h2>
                        <p className="mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                          By {book.author}
                        </p>

                        {/* Truncated Synopsis */}
                        <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                          {book.synopsis}
                        </p>

                        {/* Translated Book Tags Mapping */}
                        {book.tag_ids && book.tag_ids.length > 0 && tagsList.length > 0 && (
                          <div className="mb-6 flex flex-wrap gap-2">
                            {book.tag_ids.map(tagId => {
                              const matchedTag = tagsList.find(t => t.id === tagId);
                              return matchedTag ? (
                                <span 
                                  key={tagId} 
                                  className="inline-flex rounded-md bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                                >
                                  #{matchedTag.name}
                                </span>
                              ) : null;
                            })}
                          </div>
                        )}

                        {/* Link to Dedicated Detail Page */}
                        <div className="mt-auto border-t border-slate-100 pt-4 dark:border-slate-800">
                          <Link 
                            to={`/books/${book.id}`} 
                            className="text-sm font-bold text-blue-600 transition hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Read Reflection →
                          </Link>
                        </div>

                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500 font-mono col-span-full">No books in library yet.</p>
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