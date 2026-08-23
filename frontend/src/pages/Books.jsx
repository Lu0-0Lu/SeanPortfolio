import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-16 pb-16 pt-10 sm:pt-16">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-10 dark:border-slate-800">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Library
              </p>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Book Reviews
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Reflections, takeaways, and thoughts on the literature that shapes my perspective.
              </p>
            </div>

            {loading ? (
              <div className="text-slate-500">Loading library...</div>
            ) : (
              <div className="grid gap-8 lg:grid-cols-2">
                {books.length > 0 ? (
                  books.map((book) => (
                    <article key={book.id} className="flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition-all hover:-translate-y-1 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900">
                      
                      {/* Optional Cover Image */}
                      {book.cover_image && (
                        <div className="h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800 sm:h-64">
                          <img src={book.cover_image} alt={book.title} className="h-full w-full object-cover" />
                        </div>
                      )}
                      
                      <div className="flex flex-1 flex-col p-6 sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{book.title}</h2>
                            <p className="mt-1 font-medium text-slate-500">By {book.author}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                            {book.rating}
                          </span>
                        </div>
                        
                        <div className="mt-6 border-t border-slate-100 pt-6 dark:border-slate-800">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Synopsis</h3>
                          <p className="mt-2 text-sm font-medium italic leading-relaxed text-slate-600 dark:text-slate-400">
                            "{book.synopsis}"
                          </p>
                        </div>
                        
                        <div className="mt-6">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">My Thoughts</h3>
                          {/* whitespace-pre-line ensures if you typed paragraphs in your review, they render correctly */}
                          <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-slate-700 dark:text-slate-300">
                            {book.review}
                          </p>
                        </div>
                      </div>

                    </article>
                  ))
                ) : (
                  <p className="text-slate-500">No book reviews published yet.</p>
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