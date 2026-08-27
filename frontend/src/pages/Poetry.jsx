import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Poetry() {
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/poetry')
      .then((res) => res.json())
      .then((data) => {
        setPoetry(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-16 pb-16 pt-10 sm:pt-16">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-10 text-center dark:border-slate-800">
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                Creative Writing
              </p>
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                Poetry & Reflections
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                Explorations of existentialism, philosophy, and personal introspection.
              </p>
            </div>

            {loading ? (
              <div className="text-center text-slate-500 font-mono">Loading poetry...</div>
            ) : (
              <div className="mx-auto max-w-3xl space-y-12">
                {poetry.length > 0 ? (
                  poetry.map((poem) => (
                    <article 
                      key={poem.id} 
                      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition-all hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]"
                      style={poem.bg_image_url ? {
                        // Notice the rgb colors are updated to match the deep #121212 aesthetic!
                        backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0.98)), url(${poem.bg_image_url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: 'white' 
                      } : {}}
                    >
                      <div className={`p-8 sm:p-16 ${poem.bg_image_url ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        <h2 className="mb-10 text-center font-serif text-3xl font-bold italic tracking-wide sm:text-4xl">
                          {poem.title}
                        </h2>
                        
                        <p className={`whitespace-pre-line text-center font-serif text-lg leading-loose sm:text-xl ${poem.bg_image_url ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                          {poem.content}
                        </p>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-center text-slate-500 font-mono">No poetry published yet.</p>
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