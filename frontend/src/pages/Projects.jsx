import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';
import { FolderGit2 } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reusing your excellent dynamic Bento-grid function
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
        setProjects(data);
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
          <main className="space-y-16 pb-20 pt-16 sm:pt-24">
            
            {/* Header */}
            <div className="border-b border-slate-200 pb-10 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <FolderGit2 className="h-8 w-8 text-blue-600 dark:text-blue-500" />
                <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl dark:text-white">
                  Projects
                </h1>
              </div>
              <p className="mt-4 max-w-2xl font-mono text-lg text-slate-600 dark:text-slate-400">
                Hardware builds, full-stack applications, and embedded system experiments.
              </p>
            </div>

            {loading ? (
              <p className="font-mono text-slate-500">Loading projects...</p>
            ) : (
              <div className="grid gap-12">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <article key={project.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-sm transition-all dark:border-slate-800 dark:bg-[#1a1a1c]">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-3xl">
                          <div className="flex items-center gap-3">
                            <h2 className="font-mono text-3xl font-bold text-slate-900 dark:text-white">{project.title}</h2>
                            {project.is_featured && (
                              <span className="inline-flex rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border dark:border-amber-900/50">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="mt-4 font-mono text-base leading-relaxed text-slate-700 dark:text-slate-300">
                            {project.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-10 flex flex-col gap-8">
                        {project.images && project.images.length > 0 && (
                          <div className="space-y-4">
                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex w-full">
                              [ Gallery ]
                            </span>
                            {renderImageCollage(project.images)}
                          </div>
                        )}

                        {project.video_url && (
                          <div className="space-y-4">
                            <span className="font-mono text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 pb-2 flex w-full">
                              [ Video Demo ]
                            </span>
                            <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
                              <iframe className="aspect-video w-full" src={project.video_url} title="Video" allowFullScreen></iframe>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500 font-mono">No projects to display yet.</p>
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