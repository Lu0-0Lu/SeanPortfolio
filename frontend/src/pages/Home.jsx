import { useNavigate } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Home() {
  const navigate = useNavigate();

  return (
    <ThemeProvider>
      {/* Notice the dark:bg-[#121212] applying your new requested color! */}
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-24 pb-20 pt-16 sm:pt-24">
            
            {/* --- NEW TERMINAL HERO SECTION --- */}
            <section className="grid items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
              <div className="space-y-8">
                <h1 className="font-mono text-5xl font-bold tracking-tight sm:text-6xl dark:text-white">
                  Hi — I'm Sean
                </h1>
                
                {/* Monospace typewriter feel based on your mockup */}
                <p className="font-mono text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                  I bring hardware and software together to create accessible, user-friendly systems. 
                  With a background spanning project management, full-stack web development, and 
                  embedded systems (Arduino, Raspberry Pi), I oversee builds from the circuit board 
                  to the server. I love engineering practical, automated solutions that make a real-world impact.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => navigate('/projects')}
                    className="rounded-none border-2 border-slate-900 bg-slate-900 px-6 py-3 font-mono text-sm font-bold text-white transition hover:bg-transparent hover:text-slate-900 dark:border-white dark:bg-white dark:text-[#121212] dark:hover:bg-transparent dark:hover:text-white"
                  >
                    View Projects
                  </button>
                  <button 
                    onClick={() => navigate('/about')}
                    className="rounded-none border-2 border-slate-300 bg-transparent px-6 py-3 font-mono text-sm font-bold text-slate-900 transition hover:border-slate-900 dark:border-slate-700 dark:text-white dark:hover:border-white"
                  >
                    More About Me
                  </button>
                </div>
              </div>

              {/* Profile Image Area */}
              <div className="relative mx-auto w-full max-w-sm">
                <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-slate-200 dark:bg-slate-800">
                  {/* Replace this src with your actual profile cutout image later */}
                  <img 
                    src="https://via.placeholder.com/600x800" 
                    alt="Sean Brandon F. Reyes" 
                    className="h-full w-full object-cover grayscale transition duration-500 hover:grayscale-0"
                  />
                </div>
              </div>
            </section>

            {/* --- GATEWAY / SHORTCUT CARDS --- */}
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