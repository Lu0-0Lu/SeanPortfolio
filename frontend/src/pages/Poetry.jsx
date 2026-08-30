import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Poetry() {
  const [poetry, setPoetry] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null); 

  useEffect(() => {
    fetch('http://localhost:5000/api/poetry')
      .then((res) => res.json())
      .then((data) => {
        setPoetry(data);
        if (data.length > 0) setExpandedId(data[0].id);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const togglePoem = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="mx-auto max-w-6xl space-y-16 pb-20 pt-16 sm:pt-24">
            
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
              <p className="text-center text-slate-500 font-mono animate-pulse">Loading anthology...</p>
            ) : (
              <div className="mx-auto max-w-3xl space-y-6 px-4">
                {poetry.length > 0 ? (
                  poetry.map((poem) => {
                    const isExpanded = expandedId === poem.id;

                    return (
                      <article 
                        key={poem.id} 
                        onClick={() => togglePoem(poem.id)}
                        className={`group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200 shadow-soft transition-all duration-700 ease-in-out dark:border-slate-800 dark:bg-[#1a1a1c] ${
                          isExpanded ? 'bg-white hover:shadow-xl' : 'bg-slate-50 hover:-translate-y-1 hover:shadow-md'
                        }`}
                        style={poem.bg_image_url ? {
                          backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.75), rgba(18, 18, 18, 0.98)), url(${poem.bg_image_url})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        } : {}}
                      >
                        <div className={`relative flex items-center justify-center p-6 sm:px-10 ${isExpanded ? 'pt-12 pb-6' : 'py-8 sm:py-10'}`}>
                          <h2 className={`text-center font-serif font-bold italic tracking-wide transition-all duration-500 ${
                            isExpanded ? 'text-3xl sm:text-4xl text-white' : 'text-2xl sm:text-3xl text-slate-300 group-hover:text-white'
                          }`}>
                            {poem.title}
                          </h2>
                          
                          {/* Replaced Text Arrow with SVG Chevron */}
                          <div className={`absolute right-6 sm:right-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                            isExpanded 
                              ? 'rotate-180 bg-white text-black border-transparent shadow-md' 
                              : 'border-slate-500/50 text-slate-400 group-hover:border-slate-300 group-hover:text-white'
                          }`}>
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-5 w-5" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor" 
                              strokeWidth={2.5}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        
                        <div 
                          className={`transition-all duration-700 ease-in-out ${
                            isExpanded ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <div className="px-6 pb-12 sm:px-10 sm:pb-16 text-center">
                            <p className="whitespace-pre-line font-serif text-lg leading-loose sm:text-xl text-slate-300">
                              {poem.content}
                            </p>
                          </div>
                        </div>
                      </article>
                    );
                  })
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