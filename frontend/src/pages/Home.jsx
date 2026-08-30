import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';
import profileImage from '../assets/sean-profile.png';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProject, setFeaturedProject] = useState(null);

  // 3 Loops / Variations
  const phrases = [
    "I'm Sean",
    "I'm a Developer",
    "I'm an IT Professional"
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(phrases[0]); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const featured = data.find((p) => p.is_featured) || data[0];
        if (featured) setFeaturedProject(featured);
      })
      .catch((err) => console.error(err));
  }, []);

  // Looping typing effect logic
  useEffect(() => {
    const fullText = phrases[currentPhraseIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        // Typing forward
        const nextLength = displayedText.length + 1;
        setDisplayedText(fullText.substring(0, nextLength));

        if (displayedText === fullText) {
          // Pause long when phrase is fully complete
          setTimeout(() => setIsDeleting(true), 2500);
          setTypingSpeed(150);
          return;
        }
        setTypingSpeed(150);
      } else {
        // Deleting backward
        const nextLength = displayedText.length - 1;
        setDisplayedText(fullText.substring(0, nextLength));

        if (displayedText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(150);
          return;
        }
        setTypingSpeed(80); // Speed up deletion
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentPhraseIndex, typingSpeed]);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-24 pb-20 pt-16 sm:pt-16">
            
              {/* --- 1. HERO SECTION --- */}
                {/* Added 'isolate' to keep the -z-10 glow from hiding behind the main background */}
                <section className="relative isolate grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
                  
                 {/* --- FAST CSS BACKGROUND ANIMATION --- */}
                <div className="absolute inset-0 -z-10 flex justify-center overflow-visible pointer-events-none">
                  <div className="absolute -top-[20%] h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-900/5 to-transparent blur-3xl dark:from-blue-600/20 dark:via-blue-900/5"></div>
                </div>

                  {/* --- ORIGINAL CONTENT --- */}
                  <div className="space-y-6">
                    <p className="text-sm font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Project Management / Developer / Technologist
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl leading-[1.15] dark:text-white">
                      Building technologies and delivering IT solutions that streamline operations.
                    </h1>
                    <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg dark:text-slate-300">
                      I’m Sean Brandon Reyes, a technology-focused professional interested in web applications, 
                      backend development, SQL databases, IT and systems support, embedded technologies, and meaningful digital transformation.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-2">
                      <button 
                        onClick={() => navigate('/projects')}
                        className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-[#121212]"
                      >
                        View Projects
                      </button>
                      <button 
                        onClick={() => navigate('/contact')}
                        className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-100"
                      >
                        Contact Me
                      </button>
                    </div>
                  </div>

              {/* Featured Work Card */}
              <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]">
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-3 dark:border-slate-800 dark:bg-[#121212]">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                    <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-400">Featured Work</span>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  {featuredProject ? (
                    <>
                      <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white font-mono">
                        {featuredProject.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                        {featuredProject.description}
                      </p>

                      {/* Video Link Prioritization */}
                      {featuredProject.video_url || featuredProject.videoUrl || featuredProject.video ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 aspect-video w-full shadow-sm dark:border-slate-700 mt-6 bg-black flex items-center justify-center">
                          <iframe 
                            src={featuredProject.video_url || featuredProject.videoUrl || featuredProject.video} 
                            title={featuredProject.title}
                            className="h-full w-full object-cover"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : featuredProject.images && featuredProject.images.length > 0 ? (
                        <div className="overflow-hidden rounded-2xl border border-slate-200 aspect-video w-full shadow-sm dark:border-slate-700 mt-6">
                          <img 
                            src={featuredProject.images[0]} 
                            alt="Featured preview" 
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" 
                          />
                        </div>
                      ) : null}
                    </>
                  ) : (
                    <p className="text-sm text-slate-500 font-mono">Loading featured project...</p>
                  )}
                </div>
              </div>
            </section>

            {/* --- 2. TERMINAL AESTHETIC / HI I'M SEAN SECTION --- */}
            <section className="border-t border-slate-200 pt-12 sm:pt-16 dark:border-slate-800">
              <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
                
                <div className="space-y-6 sm:space-y-8">
                  {/* 
                    NATURAL DYNAMIC HEADER: 
                    No invisible hacks, no min-heights. The browser naturally handles the spacing.
                    Added a subtle blue tint to the typed text to make it pop!
                  */}
                  <h2 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl dark:text-white">
                    Hi — <span className="text-blue-600 dark:text-blue-400">{displayedText}</span><span className="terminal-cursor text-slate-900 dark:text-white"></span>
                  </h2>
                  
                  <p className="font-mono text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                    I thrive in dynamic environments where adaptability is key, seamlessly transitioning between developing accessible web applications and architecting backend software. Combining this versatile skill set with a strong foundation in project management and IT and system support, I guide technical builds from initial planning through to deployment and ongoing maintenance. Beyond full-stack development, my expertise extends to embedded systems, utilizing microcontrollers like Arduino and Raspberry Pi to bridge the gap between digital servers and physical hardware. I specialize in engineering practical, automated technologies that deliver tangible, real-world impact.
                  </p>
                  
                  <div className="flex flex-wrap gap-4 pt-2">
                    <button 
                      onClick={() => navigate('/about')}
                      className="rounded-none border-2 border-slate-900 bg-slate-900 px-6 py-3 font-mono text-sm font-bold text-white transition hover:bg-transparent hover:text-slate-900 dark:border-white dark:bg-white dark:text-[#121212] dark:hover:bg-transparent dark:hover:text-white"
                    >
                      Read Full Background
                    </button>
                  </div>
                </div>

                {/* Profile Image Area */}
                <div className="relative mx-auto w-full max-w-md flex justify-center py-6 group -mt-10 lg:-mt-28">
                  
                  {/* Subtle ambient backlight */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl transition-all duration-500 pointer-events-none group-hover:bg-blue-500/25"></div>

                  {/* Silhouette drop-shadow */}
                  <div className="animate-float profile-pop relative w-full max-w-[380px] lg:max-w-[420px] cursor-pointer drop-shadow-xl">
                    {/* Pushed the fade start to 88% so only the bottom edge gracefully melts away */}
                    <img 
                      src={profileImage} 
                      alt="Sean Brandon F. Reyes" 
                      className="h-auto w-full object-contain transition-transform duration-700 hover:scale-105 [-webkit-mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)] [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
                    />
                  </div>
                  
                </div>

              </div>
            </section>

            {/* --- 3. GATEWAY / SHORTCUT CARDS --- */}
              <section className="border-t border-slate-200 pt-16 dark:border-slate-800">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  
                  {/* Projects Card */}
                  <div 
                    onClick={() => navigate('/projects')}
                    className="uiverse-card group relative flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]"
                  >
                    <div className="uiverse-icon mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 group-hover:-translate-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white transition-transform duration-500 group-hover:-translate-y-1">Projects</h3>
                    <p className="uiverse-text absolute bottom-6 px-6 text-xs font-light tracking-wider text-slate-600 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:text-slate-300">
                      View my hardware and software builds.
                    </p>
                  </div>

                  {/* Articles Card */}
                  <div 
                    onClick={() => navigate('/articles')}
                    className="uiverse-card group relative flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]"
                  >
                    <div className="uiverse-icon mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 group-hover:-translate-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white transition-transform duration-500 group-hover:-translate-y-1">Articles</h3>
                    <p className="uiverse-text absolute bottom-6 px-6 text-xs font-light tracking-wider text-slate-600 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:text-slate-300">
                      Technical insights and tutorials.
                    </p>
                  </div>

                  {/* Library Card */}
                  <div 
                    onClick={() => navigate('/books')}
                    className="uiverse-card group relative flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]"
                  >
                    <div className="uiverse-icon mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 group-hover:-translate-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white transition-transform duration-500 group-hover:-translate-y-1">Library</h3>
                    <p className="uiverse-text absolute bottom-6 px-6 text-xs font-light tracking-wider text-slate-600 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:text-slate-300">
                      Reviews of literature and philosophy.
                    </p>
                  </div>

                  {/* Poetry Card */}
                  <div 
                    onClick={() => navigate('/poetry')}
                    className="uiverse-card group relative flex h-[250px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c]"
                  >
                    <div className="uiverse-icon mb-4 flex h-20 w-20 items-center justify-center rounded-full transition-all duration-500 group-hover:-translate-y-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-700 dark:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </div>
                    <h3 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white transition-transform duration-500 group-hover:-translate-y-1">Poetry</h3>
                    <p className="uiverse-text absolute bottom-6 px-6 text-xs font-light tracking-wider text-slate-600 opacity-0 transition-all duration-500 group-hover:opacity-100 dark:text-slate-300">
                      Creative writing and reflections.
                    </p>
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