import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dynamic Bento-grid function
  const renderImageCollage = (imagesArray) => {
    if (!imagesArray || imagesArray.length === 0) return null;

    if (imagesArray.length === 1) {
      return <img src={imagesArray[0]} className="aspect-video w-full rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project" />;
    }
    
    if (imagesArray.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <img src={imagesArray[0]} className="h-48 w-full md:h-64 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 1" />
          <img src={imagesArray[1]} className="h-48 w-full md:h-64 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 2" />
        </div>
      );
    }
    
    if (imagesArray.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <img src={imagesArray[0]} className="h-full w-full row-span-2 rounded-xl object-cover border border-slate-200 dark:border-slate-700 min-h-[300px]" alt="Project 1" />
          <img src={imagesArray[1]} className="h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 2" />
          <img src={imagesArray[2]} className="h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 3" />
        </div>
      );
    }
    
    if (imagesArray.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {imagesArray.map((img, i) => (
            <img key={i} src={img} className="h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt={`Project ${i+1}`} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-6 gap-3">
        <img src={imagesArray[0]} className="col-span-3 h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 1" />
        <img src={imagesArray[1]} className="col-span-3 h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 2" />
        <img src={imagesArray[2]} className="col-span-2 h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 3" />
        <img src={imagesArray[3]} className="col-span-2 h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 4" />
        <img src={imagesArray[4]} className="col-span-2 h-36 w-full md:h-48 rounded-xl object-cover border border-slate-200 dark:border-slate-700" alt="Project 5" />
      </div>
    );
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        const sortedData = data.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        setProjects(sortedData);
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
          <main className="mx-auto max-w-6xl space-y-16 pb-20 pt-16 sm:pt-15">
            
                {/* Enhanced Page Header */}
                <div className="relative pb-2">
                  {/* Ambient background glow */}
                  <div className="absolute -left-10 -top-10 -z-10 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10"></div>
                  
                  <div className="mb-4 flex items-center gap-3">
                    {/* Animated pulsing dot */}
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                    </span>
                    <p className="text-sm font-bold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
                      Portfolio & Builds
                    </p>
                  </div>
                  
                  {/* Gradient Text Heading */}
                  <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                      Projects
                    </h1>
                  
                  <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
                    Hardware builds, full-stack applications, and embedded system experiments.
                  </p>

                  {/* Fading Gradient Divider */}
                  <div className="mt-10 h-px w-full bg-gradient-to-r from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800"></div>
                </div>

            {loading ? (
              <p className="font-mono text-slate-500">Loading projects...</p>
            ) : (
              <div className="space-y-16">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <article 
                      key={project.id} 
                      className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-800 dark:bg-[#1a1a1c] flex flex-col ${
                        project.is_featured ? 'ring-1 ring-blue-500/20 shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] dark:shadow-[0_0_30px_-10px_rgba(59,130,246,0.1)]' : ''
                      }`}
                    >
                      {/* macOS Window Title Bar Header */}
                      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-5 py-3 dark:border-slate-800 dark:bg-[#121212]">
                        <div className="flex items-center space-x-2">
                          <div className="h-3 w-3 rounded-full bg-red-500"></div>
                          <div className="h-3 w-3 rounded-full bg-amber-400"></div>
                          <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        </div>
                        <span className={`font-mono text-xs uppercase tracking-widest ${project.is_featured ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-slate-400'}`}>
                          {project.is_featured ? 'Featured Work' : 'Project'}
                        </span>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-10 p-6 sm:p-10">
                        
                        {/* Left Side: Text Content */}
                        <div className="flex flex-col lg:w-5/12 space-y-3">
                          
                          {/* THE SYMMETRY FIX: Added the matching Overview tag */}
                          <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex w-full">
                            [ Overview ]
                          </span>
                          
                          <div className="pt-2">
                            <h2 className={`font-bold leading-tight text-slate-900 dark:text-white font-mono mb-4 sm:mb-6 ${
                              project.is_featured ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
                            }`}>
                              {project.title}
                            </h2>
                            
                            <div className={`text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line ${
                              project.is_featured ? 'text-base sm:text-lg' : 'text-sm sm:text-base'
                            }`}>
                              {project.description.split('\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4 last:mb-0">
                                  {paragraph}
                                </p>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Right Side: Media Content */}
                        <div className="flex flex-col gap-8 lg:w-7/12">
                          
                          {/* Video */}
                          {project.video_url || project.videoUrl || project.video ? (
                            <div className="space-y-3">
                              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex w-full">
                                [ Demo ]
                              </span>
                              <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700 bg-black flex items-center justify-center">
                                <iframe 
                                  className="aspect-video w-full" 
                                  src={project.video_url || project.videoUrl || project.video} 
                                  title={project.title} 
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                ></iframe>
                              </div>
                            </div>
                          ) : null}

                          {/* Gallery */}
                          {project.images && project.images.length > 0 && (
                            <div className="space-y-3">
                              <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex w-full">
                                [ Gallery ]
                              </span>
                              {renderImageCollage(project.images)}
                            </div>
                          )}

                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500 font-mono col-span-full">No projects to display yet.</p>
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