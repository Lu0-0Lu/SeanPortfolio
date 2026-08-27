import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProject, setFeaturedProject] = useState(null);

  useEffect(() => {
    // Fetch Projects so we can display the Featured Project in the hero card
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const featured = data.find((p) => p.is_featured) || data[0];
        if (featured) setFeaturedProject(featured);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-24 pb-20 pt-16 sm:pt-24">
            
            {/* --- 1. ORIGINAL HERO SECTION --- */}
            <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                  Portfolio / Developer / Technologist
                </p>
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
                  Building practical digital solutions with a focus on real-world impact.
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                  I’m Sean Brandon F. Reyes, a technology-focused professional interested in web applications,
                  systems support, embedded work, and meaningful digital transformation.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button 
                    onClick={() => navigate('/projects')}
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-[#121212]"
                  >
                    View Projects
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-100"
                  >
                    Contact Me
                  </button>
                </div>
              </div>

              {/* Featured Project Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-slate-700">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-300">
                  Featured work
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-2 w-16 rounded-full bg-slate-900 dark:bg-white" />
                  
                  {featuredProject ? (
                    <>
                      <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                        {featuredProject.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {featuredProject.description}
                      </p>

                      {featuredProject.images && featuredProject.images.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 h-40 shadow-sm dark:border-slate-700">
                          <img 
                            src={featuredProject.images[0]} 
                            alt="Featured preview" 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-slate-500">Loading featured project...</p>
                  )}
                </div>
              </div>
            </section>

            {/* --- 2. TERMINAL AESTHETIC / HI I'M SEAN SECTION --- */}
            <section className="border-t border-slate-200 pt-20 dark:border-slate-800">
              <div className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
                <div className="space-y-8">
                  <h2 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl dark:text-white">
                    Hi — I'm Sean
                  </h2>
                  
                  <p className="font-mono text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                    I bring hardware and software together to create accessible, user-friendly systems. 
                    With a background spanning project management, full-stack web development, and 
                    embedded systems (Arduino, Raspberry Pi), I oversee builds from the circuit board 
                    to the server. I love engineering practical, automated solutions that make a real-world impact.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button 
                      onClick={() => navigate('/about')}
                      className="rounded-none border-2 border-slate-900 bg-slate-900 px-6 py-3 font-mono text-sm font-bold text-white transition hover:bg-transparent hover:text-slate-900 dark:border-white dark:bg-white dark:text-[#121212] dark:hover:bg-transparent dark:hover:text-white"
                    >
                      Read Full Background
                    </button>
                  </div>
                </div>

                {/* Profile Image Area */}
                <div className="relative mx-auto w-full max-w-sm">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 dark:bg-[#1a1a1c] border border-slate-200 dark:border-slate-800">
                    {/* Add your cutout image here */}
                    <img 
                      src="https://via.placeholder.com/600x800" 
                      alt="Sean Brandon F. Reyes" 
                      className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* --- 3. GATEWAY / SHORTCUT CARDS --- */}
            <section className="border-t border-slate-200 pt-16 dark:border-slate-800">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                
                <div 
                  onClick={() => navigate('/projects')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-500 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-blue-500"
                >
                  <h3 className="mb-2 font-mono text-xl font-bold dark:text-white">Projects</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">View my hardware and software builds.</p>
                </div>

                <div 
                  onClick={() => navigate('/articles')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-emerald-500 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-emerald-500"
                >
                  <h3 className="mb-2 font-mono text-xl font-bold dark:text-white">Articles</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Technical insights and tutorials.</p>
                </div>

                <div 
                  onClick={() => navigate('/books')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-amber-500 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-amber-500"
                >
                  <h3 className="mb-2 font-mono text-xl font-bold dark:text-white">Library</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Reviews of literature and philosophy.</p>
                </div>

                <div 
                  onClick={() => navigate('/poetry')}
                  className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-purple-500 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-purple-500"
                >
                  <h3 className="mb-2 font-mono text-xl font-bold dark:text-white">Poetry</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Creative writing and reflections.</p>
                </div>

              </div>
            </section>

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}