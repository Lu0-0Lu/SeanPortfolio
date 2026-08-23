import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

const skills = ['PHP', 'JavaScript', 'Python', 'SQL', 'Hardware Integration (ESP32/Raspberry Pi)'];

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [featuredProject, setFeaturedProject] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  
  // NEW CONTENT STATES
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [books, setBooks] = useState([]);
  const [featuredPoetry, setFeaturedPoetry] = useState(null);

  const renderImageCollage = (imagesArray) => {
    if (!imagesArray || imagesArray.length === 0) return null;

    if (imagesArray.length === 1) {
      return <img src={imagesArray[0]} className="aspect-video w-full rounded-2xl object-cover shadow-sm" alt="Project" />;
    }
    
    if (imagesArray.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <img src={imagesArray[0]} className="h-48 w-full md:h-64 rounded-2xl object-cover shadow-sm" alt="Project 1" />
          <img src={imagesArray[1]} className="h-48 w-full md:h-64 rounded-2xl object-cover shadow-sm" alt="Project 2" />
        </div>
      );
    }
    
    if (imagesArray.length === 3) {
      return (
        <div className="grid grid-cols-2 gap-3">
          <img src={imagesArray[0]} className="h-full w-full row-span-2 rounded-2xl object-cover shadow-sm min-h-[300px]" alt="Project 1" />
          <img src={imagesArray[1]} className="h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 2" />
          <img src={imagesArray[2]} className="h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 3" />
        </div>
      );
    }
    
    if (imagesArray.length === 4) {
      return (
        <div className="grid grid-cols-2 gap-3">
          {imagesArray.map((img, i) => (
            <img key={i} src={img} className="h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt={`Project ${i+1}`} />
          ))}
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-6 gap-3">
        <img src={imagesArray[0]} className="col-span-3 h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 1" />
        <img src={imagesArray[1]} className="col-span-3 h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 2" />
        <img src={imagesArray[2]} className="col-span-2 h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 3" />
        <img src={imagesArray[3]} className="col-span-2 h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 4" />
        <img src={imagesArray[4]} className="col-span-2 h-36 w-full md:h-48 rounded-2xl object-cover shadow-sm" alt="Project 5" />
      </div>
    );
  };

  useEffect(() => {
    // 1. Fetch Projects
    fetch('http://localhost:5000/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        const featured = data.find((p) => p.is_featured) || data[0];
        if (featured) setFeaturedProject(featured);
      })
      .catch((err) => console.error(err));

    // 2. Fetch Experiences
    fetch('http://localhost:5000/api/experiences')
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error(err));

    // 3. Fetch Certifications
    fetch('http://localhost:5000/api/certifications')
      .then((res) => res.json())
      .then((data) => setCertifications(data))
      .catch((err) => console.error(err));

    // 4. Fetch Articles
    fetch('http://localhost:5000/api/articles')
      .then((res) => res.json())
      .then((data) => {
        setArticles(data);
        const featured = data.find((a) => a.is_featured) || data[0];
        if (featured) setFeaturedArticle(featured);
      })
      .catch((err) => console.error(err));

    // 5. Fetch Books
    fetch('http://localhost:5000/api/books')
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch((err) => console.error(err));

    // 6. Fetch Poetry
    fetch('http://localhost:5000/api/poetry')
      .then((res) => res.json())
      .then((data) => {
        const featured = data.find((p) => p.is_featured) || data[0];
        if (featured) setFeaturedPoetry(featured);
      })
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navbar />

        <MainLayout>
          <main className="space-y-16 pb-16 pt-10 sm:pt-16">
            
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
                  <a href="#projects" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900">
                    View Projects
                  </a>
                  <a href="#contact" className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-100">
                    Contact Me
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Featured work
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-2 w-16 rounded-full bg-slate-900 dark:bg-white" />
                  
                  {featuredProject ? (
                    <>
                      <h2 className="text-2xl font-bold leading-tight text-slate-900 dark:text-white">
                        {featuredProject.title}
                      </h2>
                      <p className="line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
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
                    <p className="text-sm text-slate-500">Loading...</p>
                  )}
                </div>
              </div>
            </section>

            <section id="projects" className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Projects</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Selected work</h3>
              </div>
            
              <div className="grid gap-8">
                {projects.length > 0 ? (
                  projects.map((project, index) => (
                    <article key={project.id} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="max-w-2xl">
                          {index === 0 && (
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Latest Project</p>
                          )}
                          <h4 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{project.title}</h4>
                        </div>
                      </div>
                      
                      <p className="mt-6 text-base leading-7 text-slate-600 dark:text-slate-300">{project.description}</p>
                      
                      <div className="mt-8 flex flex-col gap-8">
                        {project.images && project.images.length > 0 && (
                          <div className="space-y-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              📷 Project Gallery
                            </span>
                            {renderImageCollage(project.images)}
                          </div>
                        )}

                        {project.video_url && (
                          <div className="space-y-3">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                              ▶ Video Demo
                            </span>
                            <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
                              <iframe className="aspect-video w-full" src={project.video_url} title="Video" allowFullScreen></iframe>
                            </div>
                          </div>
                        )}
                      </div>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500">No projects to display yet.</p>
                )}
              </div>
            </section>

            <section id="experience" className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Experience</p>
              <div className="space-y-5">
                {experiences.map((item) => (
                  <article key={item.id} className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="pr-0 md:pr-4">
                        <h4 className="text-xl font-semibold text-slate-900 dark:text-white">{item.role}</h4>
                        <p className="font-medium text-slate-700 dark:text-slate-300">{item.company}</p>
                      </div>
                      <div className="shrink-0 text-left md:text-right">
                        <span className="block text-sm font-medium text-slate-500 dark:text-slate-400">{item.period}</span>
                        <span className="block text-sm text-slate-500 dark:text-slate-400">{item.location}</span>
                      </div>
                    </div>
                    <ul className="mt-5 list-inside list-disc space-y-2 text-sm leading-7 text-slate-600 marker:text-slate-400 dark:text-slate-300 dark:marker:text-slate-600">
                      {item.bullets.map((bullet, i) => (
                        <li key={i} className="pl-2"><span className="-ml-2">{bullet}</span></li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>

            <section id="skills" className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Skills</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">{skill}</span>
                ))}
              </div>
            </section>

            <section id="certifications" className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Certifications</p>
              <div className="grid gap-4 sm:grid-cols-2">
                {certifications.map((cert) => (
                  <a key={cert.id} href={cert.verification_link} target="_blank" rel="noopener noreferrer" className="block rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-slate-400 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500">
                    <h4 className="font-semibold text-slate-900 dark:text-white">{cert.title}</h4>
                    <div className="mt-3 flex items-center justify-between text-sm text-slate-600 dark:text-slate-400">
                      <span>{cert.issuer}</span>
                      <span>{cert.date_issued}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>

            {/* --- FEATURED ARTICLE SECTION --- */}
            {featuredArticle && (
              <section id="articles" className="space-y-6 pt-10">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Written Thoughts</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Featured Article</h3>
                </div>
                
                <article className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                  <header className="mb-8">
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{featuredArticle.title}</h4>
                    <p className="mt-2 text-sm font-medium text-slate-500">{featuredArticle.date}</p>
                  </header>
                  
                  <div className="prose prose-slate max-w-none text-slate-700 dark:prose-invert dark:text-slate-300">
                    {featuredArticle.content.split('\n').map((paragraph, idx) => (
                      paragraph.trim() && <p key={idx} className="mb-4 leading-relaxed">{paragraph}</p>
                    ))}
                  </div>

                  {featuredArticle.sources && (
                    <div className="mt-10 border-t border-slate-100 pt-6 dark:border-slate-800">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Sources & References</h5>
                      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-500">{featuredArticle.sources}</p>
                    </div>
                  )}
                </article>
              </section>
            )}

            {/* --- BOOK REVIEWS SECTION --- */}
            {books.length > 0 && (
              <section id="books" className="space-y-6 pt-10">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Library</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Book Reviews</h3>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2">
                  {books.map((book) => (
                    <article key={book.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">{book.title}</h4>
                          <p className="text-sm text-slate-500">By {book.author}</p>
                        </div>
                        <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-800 dark:bg-slate-800 dark:text-slate-200">
                          {book.rating}
                        </span>
                      </div>
                      <div className="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                        <p className="text-sm font-medium italic text-slate-600 dark:text-slate-400">"{book.synopsis}"</p>
                        <p className="mt-4 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{book.review}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {/* --- FEATURED POETRY SECTION --- */}
            {featuredPoetry && (
              <section id="poetry" className="space-y-6 pt-10">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Creative Writing</p>
                  <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Featured Poetry</h3>
                </div>
                
                <div 
                  className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft dark:border-slate-700 dark:bg-slate-900"
                  style={featuredPoetry.bg_image_url ? {
                    backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.95)), url(${featuredPoetry.bg_image_url})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: 'white'
                  } : {}}
                >
                  <div className={`p-8 sm:p-12 ${featuredPoetry.bg_image_url ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    <h4 className="mb-8 text-center font-serif text-2xl font-bold italic tracking-wide sm:text-3xl">
                      {featuredPoetry.title}
                    </h4>
                    <p className={`whitespace-pre-line text-center font-serif text-base leading-loose sm:text-lg ${featuredPoetry.bg_image_url ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                      {featuredPoetry.content}
                    </p>
                  </div>
                </div>
              </section>
            )}

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}