import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';
import profileImage from '../assets/sean-profile.png';

export default function Home() {
  const navigate = useNavigate();
  const [featuredProject, setFeaturedProject] = useState(null);

  // Animation Refs & State for Multiple Sections
  const aboutRef = useRef(null);
  const cardsRef = useRef(null);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [isCardsVisible, setIsCardsVisible] = useState(false);

  // 3 Loops / Variations
  const phrases = [
    "I'm Sean Brandon.",
    "I'm a Developer.",
    "I'm an IT Professional."
  ];

  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(phrases[0]); 
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  // Fetch Featured Project
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const featured = data.find((p) => p.is_featured) || data[0];
        if (featured) setFeaturedProject(featured);
      })
      .catch((err) => console.error(err));
  }, []);

  // Multi-Target Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (entry.target === aboutRef.current) setIsAboutVisible(true);
            if (entry.target === cardsRef.current) setIsCardsVisible(true);
            
            // Unobserve after revealing to prevent re-animating
            observer.unobserve(entry.target);
          }
        });
      },
      { 
        root: null,
        rootMargin: "0px 0px -100px 0px", // Triggers slightly before full view
        threshold: 0.1 
      }
    );

    if (aboutRef.current) observer.observe(aboutRef.current);
    if (cardsRef.current) observer.observe(cardsRef.current);

    return () => observer.disconnect();
  }, []);

  // Looping typing effect logic
  useEffect(() => {
    const fullText = phrases[currentPhraseIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        const nextLength = displayedText.length + 1;
        setDisplayedText(fullText.substring(0, nextLength));

        if (displayedText === fullText) {
          setTimeout(() => setIsDeleting(true), 2500);
          setTypingSpeed(150);
          return;
        }
        setTypingSpeed(150);
      } else {
        const nextLength = displayedText.length - 1;
        setDisplayedText(fullText.substring(0, nextLength));

        if (displayedText === "") {
          setIsDeleting(false);
          setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
          setTypingSpeed(150);
          return;
        }
        setTypingSpeed(80);
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
          <main className="space-y-24 pb-20 pt-12 sm:pt-16">
            
            {/* --- 1. HERO SECTION --- */}
            <section className="relative isolate grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
              
              <div className="absolute inset-0 -z-10 flex justify-center overflow-visible pointer-events-none">
                <div className="absolute -top-[20%] h-[500px] w-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-blue-900/5 to-transparent blur-3xl dark:from-blue-600/20 dark:via-blue-900/5"></div>
              </div>

              <div className="relative flex flex-col items-start space-y-6 pt-4">
                
                <div className="space-y-2 min-h-[140px] sm:min-h-[120px]">
                  <p className="font-mono text-xs font-medium uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                    Project Management / Developer / Technologist
                  </p>

                  <h1 className="min-h-[90px] sm:min-h-[0px] text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.5rem] dark:text-white leading-[1.15]">
                    Hello —{" "}
                    <span className="text-blue-600 dark:text-blue-400">{displayedText}</span><span className="terminal-cursor text-slate-900 dark:text-white"></span>
                  </h1>
                </div>

                <p className="max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                  A technology-focused professional interested in web applications, backend development, SQL databases, IT and systems support, embedded technologies, and meaningful digital transformation.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <button 
                    onClick={() => navigate('/projects')}
                    className="rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-[#121212]"
                  >
                    View Projects
                  </button>
                  <button 
                    onClick={() => navigate('/contact')}
                    className="rounded-full border border-slate-300 px-7 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-100"
                  >
                    Contact Me
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: Featured Work Card */}
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

            {/* --- 2. ABOUT PROFILE SECTION --- */}
            <section ref={aboutRef} className="border-t border-slate-200 pt-16 dark:border-slate-800">
              <div 
                className={`grid items-center gap-12 lg:grid-cols-[1fr_0.8fr] transition-all duration-1000 ease-out ${
                  isAboutVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
              >
                
                <div className="space-y-6">
                  <h2 className="font-mono text-3xl font-bold tracking-tight sm:text-4xl dark:text-white">
                    Engineering reliable software & physical systems
                  </h2>
                  <p className="text-base leading-relaxed text-slate-600 sm:text-lg dark:text-slate-300">
                    I thrive in dynamic environments where adaptability is key, seamlessly transitioning between developing accessible web applications and architecting backend software. Combining this versatile skill set with a strong foundation in project management and IT and system support, I guide technical builds from initial planning through to deployment and ongoing maintenance. Beyond full-stack development, my expertise extends to embedded systems, utilizing microcontrollers like Arduino and Raspberry Pi to bridge the gap between digital servers and physical hardware. I specialize in engineering practical, automated technologies that deliver tangible, real-world impact.
                  </p>
                  <div className="pt-2">
                    <button 
  onClick={() => navigate('/about')}
  className="rounded-full bg-white px-7 py-3 text-sm font-semibold text-slate-900 border border-slate-200 shadow-sm transition-all duration-300 hover:bg-slate-900 hover:text-white hover:border-slate-900 dark:bg-slate-100 dark:text-[#121212] dark:border-transparent dark:hover:bg-[#1a1a1c] dark:hover:text-white dark:hover:border-slate-700"
>
  More About Me
</button>
                  </div>
                </div>

                {/* Profile Image Area */}
                <div className="relative mx-auto w-full max-w-md flex justify-center py-6 group">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl transition-all duration-500 pointer-events-none group-hover:bg-blue-500/25"></div>
                  <div className="animate-float profile-pop relative w-full max-w-[340px] lg:max-w-[380px] cursor-pointer drop-shadow-xl">
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
            <section ref={cardsRef} className="border-t border-slate-200 pt-16 dark:border-slate-800">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                
                {/* Projects Card (0ms delay) */}
                <div className={`transition-all duration-700 ease-out ${isCardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: '0ms' }}>
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
                </div>

                {/* Articles Card (100ms delay) */}
                <div className={`transition-all duration-700 ease-out ${isCardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: '100ms' }}>
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
                </div>

                {/* Library Card (200ms delay) */}
                <div className={`transition-all duration-700 ease-out ${isCardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: '200ms' }}>
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
                </div>

                {/* Poetry Card (300ms delay) */}
                <div className={`transition-all duration-700 ease-out ${isCardsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`} style={{ transitionDelay: '300ms' }}>
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

              </div>
            </section>

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}