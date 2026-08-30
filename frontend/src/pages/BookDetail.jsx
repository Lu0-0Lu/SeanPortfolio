import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both the specific book and the tags dictionary simultaneously
    const fetchData = async () => {
      try {
        const [bookRes, tagsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/books/${id}`),
          fetch('http://localhost:5000/api/book-tags')
        ]);

        if (bookRes.ok) setBook(await bookRes.json());
        if (tagsRes.ok) setTagsList(await tagsRes.json());
        
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch book details:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100 font-sans">
        <Navbar />

        <MainLayout>
          <main className="mx-auto max-w-6xl pb-20 pt-24 sm:pt-24">
            
            {/* Back Navigation */}
            <button 
              onClick={() => navigate('/books')}
              className="group mb-12 flex items-center gap-2 text-sm font-bold tracking-wider text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white uppercase"
            >
              <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span> Back to Library
            </button>

            {loading ? (
              <p className="font-mono text-slate-500 animate-pulse">Retrieving archives...</p>
            ) : !book ? (
              <p className="font-mono text-slate-500">Book not found.</p>
            ) : (
              <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
                
                {/* LEFT COLUMN: Sticky Book Cover & Metadata */}
                <div className="lg:w-5/12 shrink-0">
                  <div className="sticky top-32 flex flex-col gap-6">
                    
                    {/* The Physical Book Container */}
                    <div className="relative flex h-[450px] w-full items-center justify-center overflow-hidden rounded-3xl bg-slate-100 p-8 shadow-inner dark:bg-[#1a1a1c] border border-slate-200 dark:border-slate-800">
                      {/* Blurred Background */}
                      {book.cover_image_url && (
                        <div 
                          className="absolute inset-0 opacity-40 blur-3xl dark:opacity-20"
                          style={{ backgroundImage: `url(${book.cover_image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                        ></div>
                      )}
                      {/* Physical Book Floating */}
                      {book.cover_image_url && (
                        <img 
                          src={book.cover_image_url} 
                          alt={book.title} 
                          className="relative z-10 h-full w-auto object-contain drop-shadow-2xl" 
                        />
                      )}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Category</p>
                        <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-200">{book.category || 'General'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Rating</p>
                        <p className="mt-1 flex items-center gap-1 text-sm font-bold text-amber-500">⭐ {book.rating} / 5</p>
                      </div>
                    </div>

                    {/* INJECTED: Book Tags Section */}
                    {book.tag_ids && book.tag_ids.length > 0 && tagsList.length > 0 && (
                      <div className="border-t border-slate-200 pt-4 dark:border-slate-800">
                        <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">Related Topics</p>
                        <div className="flex flex-wrap gap-2">
                          {book.tag_ids.map(tagId => {
                            const matchedTag = tagsList.find(t => t.id === tagId);
                            return matchedTag ? (
                              <span 
                                key={tagId} 
                                className="inline-flex rounded-md bg-slate-200/50 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              >
                                #{matchedTag.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                  </div>
                </div>

                {/* RIGHT COLUMN: Scrolling Content */}
                <div className="lg:w-7/12 pt-2 lg:pt-0">
                  
                  {/* Title & Author Header */}
                    <div className="mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white leading-[1.1]">
                        {book.title}
                    </h1>
                    <p className="mt-4 text-xl font-medium text-slate-500 dark:text-slate-400">
                        By {book.author}
                    </p>
                    </div>

                  {/* Content Blocks */}
                    <div className="space-y-10">
                    
                    {/* Synopsis Block */}
                    <section>
                        <span className="mb-4 flex w-full border-b border-slate-200 pb-2 font-mono text-xs font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800">
                        [ Synopsis ]
                        </span>
                        <p className="text-lg leading-relaxed italic text-slate-600 dark:text-slate-400">
                        "{book.synopsis}"
                        </p>
                    </section>

                    {/* Review Block */}
                    <section>
                        <span className="mb-4 flex w-full border-b border-slate-200 pb-2 font-mono text-xs font-bold uppercase tracking-widest text-slate-400 dark:border-slate-800">
                        [ Reflection ]
                        </span>
                        <div className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line space-y-6">
                        {book.review.split('\n').map((paragraph, idx) => (
                            paragraph.trim() && <p key={idx}>{paragraph}</p>
                        ))}
                        </div>
                    </section>
                    </div>

                </div>
              </div>
            )}

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}