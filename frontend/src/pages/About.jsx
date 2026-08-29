import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';

import { GraduationCap, Award, BadgeCheck, Briefcase, Star, Trophy } from 'lucide-react';

// Hardcoded skills based on your resume
const skills = [
  'PHP', 'JavaScript', 'Python', 'SQL', 'C#', 'Java',
  'CodeIgniter 4', 'Laravel', 'React', 'Node.js', 
  'Hardware Integration (ESP32/Raspberry Pi)', 'Computer Vision (YOLO/OpenCV)',
  'MySQL', 'MariaDB', 'System Troubleshooting', 'Linux'
];

export default function About() {
  const [experiences, setExperiences] = useState([]);
  const [certifications, setCertifications] = useState([]);
  
  // New state for the collapsible About section
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);

  useEffect(() => {
    // Fetch Experiences
    fetch('http://localhost:5000/api/experiences')
      .then((res) => res.json())
      .then((data) => setExperiences(data))
      .catch((err) => console.error(err));

    // Fetch Certifications
    fetch('http://localhost:5000/api/certifications')
      .then((res) => res.json())
      .then((data) => setCertifications(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-all duration-300 dark:bg-[#121212] dark:text-slate-100">
        <Navbar />

        <MainLayout>
          {/* Notice we put max-w-4xl mx-auto on the MAIN tag now */}
<main className="max-w-4xl mx-auto space-y-20 pb-20 pt-16 sm:pt-24">
  
  {/* --- 1. INTRODUCTION (Collapsible) --- */}
  <section>
    <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl dark:text-white mb-8">
                About Me
              </h1>
              
              <div className="space-y-6 text-base leading-relaxed text-slate-700 sm:text-lg dark:text-slate-300">
                {/* Always Visible 2-Paragraph Intro */}
                <p>
                  My journey in Information Technology began as a kid tinkering with my phone, fascinated by how much I could customize it. That curiosity drove me to pursue computer studies. Despite the challenges of being a working student, I graduated <em className="font-medium">cum laude</em> with a Bachelor of Science in Information Technology from Quezon City University, and subsequently earned my Career Service Professional eligibility. Throughout my academic and professional career, I’ve taken on dynamic roles—often handling project management while remaining deeply immersed in the actual programming and development.
                </p>
                <p>
                  I don't just write code; I look at the entire operational ecosystem. From scalable web backends to embedded hardware, my goal is to deliver end-to-end systems that hit strategic objectives and solve practical, real-world problems.
                </p>

                {/* Toggle Button */}
                <button 
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="group flex items-center gap-2 font-mono text-sm font-bold text-blue-600 transition-colors hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span className="border-b border-transparent transition-colors group-hover:border-current">
                    {isAboutExpanded ? "Hide Full Background" : "Read Full Background"}
                  </span>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-transform duration-300 ${isAboutExpanded ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Collapsible Content */}
                <div 
                  className={`grid transition-all duration-500 ease-in-out ${
                    isAboutExpanded ? 'grid-rows-[1fr] opacity-100 mt-8' : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className="overflow-hidden space-y-10">
                    
                    <p className="italic text-slate-600 dark:text-slate-400">
                      Here is a deeper look at the core pillars of my experience:
                    </p>

                    {/* Pillar 1 */}
                    <div className="space-y-3">
                      <h3 className="font-mono text-xl font-bold text-slate-900 dark:text-white">Software & Web Architecture</h3>
                      <p>
                        My development approach is highly adaptable and practical. I started by building academic requirements—inventory systems, e-commerce platforms, POS, and barangay management systems—which exposed me to a diverse stack including JavaScript, PHP, Java, Python, C#, C++, and SQL. Professionally, I engineered a comprehensive pharmacy inventory system using CodeIgniter 4 during my corporate tenure at Mansfield International Inc.. Whether utilizing Laravel or CodeIgniter, my focus remains on scalable backends, intuitive user interfaces, and robust relational databases (MySQL, MariaDB, SQLite).
                      </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="space-y-3">
                      <h3 className="font-mono text-xl font-bold text-slate-900 dark:text-white">Embedded Systems & Hardware Integration</h3>
                      <p>
                        Where I truly thrive is bringing digital logic into physical spaces. I have extensive experience designing and deploying automated, sensor-driven systems from scratch. A defining example is Trashure, an automated recycling system I developed that integrates a Raspberry Pi 5, load cells, and proximity sensors with computer vision (TensorFlow Lite, OpenCV) to verify recyclable materials and sync directly with a web dashboard. I have also engineered automated environmental tools, such as an Arduino UNO R4 WiFi flood monitoring device, proving that embedded systems can solve critical, real-time challenges.
                      </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="space-y-3">
                      <h3 className="font-mono text-xl font-bold text-slate-900 dark:text-white">IT Support & Operational Logistics</h3>
                      <p>
                        Technology is only as valuable as its reliability. My background in IT support and operations—ranging from corporate hardware maintenance and Jira ticketing workflows to active video surveillance and network troubleshooting as a CCTV Operator for Barangay Tandang Sora—has trained me to anticipate system failures before they happen. I understand the logistical realities of deploying technology in the real world, coordinating with end-users, and resolving critical issues on the fly.
                      </p>
                    </div>

                    {/* Outro */}
                    <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
                      <p>
                        When I am not wiring a breadboard, training an object detection model, or optimizing backend schemas, I apply that same focus and discipline to distance running and studying philosophy. I am always looking for the next complex problem to solve, from the circuit board up to the cloud.
                      </p>
                    </div>

                  </div>
                </div>
              </div>
            </section>

            {/* --- 2. WORK EXPERIENCE --- */}
              <section>
                <div className="mb-12 flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                  <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                  <h2 className="font-mono text-2xl font-bold dark:text-white">Work Experience</h2>
                </div>
                
                {/* Timeline Container */}
                <div className="relative ml-4 space-y-12 border-l-2 border-slate-200 dark:border-slate-800 sm:ml-6">
                  {experiences.length > 0 ? (
                    experiences.map((item, index) => (
                      <div key={item.id} className="relative pl-8 sm:pl-12">
                        
                        {/* Timeline Node (Your Teardrop Icon anchored to the line) */}
                        <div className="absolute -left-[25px] top-0 flex h-12 w-12 items-center justify-center rounded-full rounded-tl-none bg-blue-600 shadow-sm ring-4 ring-slate-50 dark:bg-blue-500 dark:ring-[#121212]">
                          <Briefcase className="h-5 w-5 text-white" />
                        </div>

                        {/* The Card */}
                        <article 
                          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-gradient-to-tl dark:from-[#131315] dark:to-[#1a1a1c] dark:hover:border-slate-700 dark:hover:from-[#16161a] dark:hover:to-[#202024]"
                        >
                          <div className="p-6 sm:p-8">
                            
                            {/* Header Information */}
                            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                              <div>
                                <h3 className="font-mono text-xl font-bold uppercase text-slate-900 dark:text-white">
                                  {item.role}
                                </h3>
                                <div className="mt-1 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-blue-400/80">
                                  {item.company}
                                </div>
                              </div>
                              <div className="mt-2 text-left md:mt-0 md:text-right">
                                <p className="font-mono text-sm font-bold text-slate-700 dark:text-slate-300">{item.period}</p>
                                <p className="mt-1 text-xs text-slate-500">{item.location}</p>
                              </div>
                            </div>

                            {/* Enhanced Bullets */}
                            <ul className="space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                              {item.bullets.map((bullet, i) => (
                                <li key={i} className="relative pl-5 transition-colors duration-300 hover:text-slate-900 dark:hover:text-slate-200">
                                  {/* Custom dash bullet */}
                                  <span className="absolute left-0 top-2 h-[2px] w-3 bg-blue-500/50 transition-all duration-300 group-hover:bg-blue-500 dark:bg-blue-400/50"></span>
                                  {bullet}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Uiverse Animated Bottom Glow Effects */}
                          <div className="absolute bottom-0 left-0 m-auto h-1.5 w-full rounded bg-gradient-to-l via-blue-500 transition-all blur-2xl group-hover:blur-xl"></div>
                          <div className="absolute bottom-0 left-1/2 m-auto h-[2px] w-[70%] -translate-x-1/2 rounded bg-gradient-to-l via-blue-200 transition-all group-hover:w-full group-hover:via-blue-500 dark:via-blue-900 dark:group-hover:via-blue-500"></div>
                        </article>

                      </div>
                    ))
                  ) : (
                    <p className="pl-8 font-mono text-slate-500">Loading experiences...</p>
                  )}
                </div>
              </section>

            {/* --- 3. EDUCATION & CERTIFICATIONS (Side-by-side on large screens) --- */}
                <section className="grid gap-8 lg:grid-cols-2">
                  
                  {/* Education */}
                  <div>
                    <div className="mb-8 flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                      <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                      <h2 className="font-mono text-2xl font-bold dark:text-white">Education</h2>
                    </div>
                    
                    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-gradient-to-tl dark:from-[#131315] dark:to-[#1a1a1c] dark:hover:border-slate-700 dark:hover:from-[#16161a] dark:hover:to-[#202024]">
                      <h3 className="font-mono text-xl font-bold uppercase text-slate-900 dark:text-white">
                        Bachelor of Science in Information Technology
                      </h3>
                      <div className="mt-1 text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-blue-400/80">
                        Quezon City University
                      </div>
                      <p className="mt-2 font-mono text-sm font-bold text-slate-700 dark:text-slate-300">
                        Graduated June 2026
                      </p>

                      {/* Badges */}
                        <div className="mt-5 flex flex-wrap gap-3">
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:border dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Cum Laude
                          </span>
                          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:border dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300">
                            <Trophy className="h-3.5 w-3.5" />
                            2nd Place IT Quiz Bee
                          </span>
                        </div>

                      {/* Education Bullets */}
                      <ul className="mt-6 space-y-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        <li className="relative pl-5 transition-colors duration-300 hover:text-slate-900 dark:hover:text-slate-200">
                          <span className="absolute left-0 top-2 h-[2px] w-3 bg-blue-500/50 transition-all duration-300 group-hover:bg-blue-500 dark:bg-blue-400/50"></span>
                          Served as a Content Writer for the QCU CSS Likha Production student organization, drafting meeting minutes, event captions, and original poetry.
                        </li>
                        <li className="relative pl-5 transition-colors duration-300 hover:text-slate-900 dark:hover:text-slate-200">
                          <span className="absolute left-0 top-2 h-[2px] w-3 bg-blue-500/50 transition-all duration-300 group-hover:bg-blue-500 dark:bg-blue-400/50"></span>
                          Earned recognition as Outstanding Creative of the Year for consistent contributions to the organization's media and communications.
                        </li>
                      </ul>

                      {/* Animated Bottom Glow Effect */}
                      <div className="absolute bottom-0 left-0 m-auto h-1.5 w-full rounded bg-gradient-to-l via-blue-500 transition-all blur-2xl group-hover:blur-xl"></div>
                      <div className="absolute bottom-0 left-1/2 m-auto h-[2px] w-[70%] -translate-x-1/2 rounded bg-gradient-to-l via-blue-200 transition-all group-hover:w-full group-hover:via-blue-500 dark:via-blue-900 dark:group-hover:via-blue-500"></div>
                    </article>
                  </div>

                  {/* Certifications */}
                  <div>
                    <div className="mb-8 flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-800">
                      <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                      <h2 className="font-mono text-2xl font-bold dark:text-white">Certifications</h2>
                    </div>
                    
                    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl dark:border-slate-800 dark:bg-gradient-to-tl dark:from-[#131315] dark:to-[#1a1a1c] dark:hover:border-slate-700 dark:hover:from-[#16161a] dark:hover:to-[#202024]">
                      <ul className="space-y-6 relative z-10">
                        {certifications.length > 0 ? (
                          certifications.map((cert) => (
                            <li key={cert.id} className="flex items-start gap-4 transition-transform duration-300 hover:translate-x-1">
                              <BadgeCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-500" />
                              <div>
                                <a 
                                  href={cert.verification_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="font-mono text-base font-bold text-slate-900 transition hover:text-emerald-600 dark:text-white dark:hover:text-emerald-400"
                                >
                                  {cert.title}
                                </a>
                                <div className="mt-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                                  <span>{cert.issuer}</span>
                                  <span className="text-slate-300 dark:text-slate-700">•</span>
                                  <span>{cert.date_issued}</span>
                                </div>
                              </div>
                            </li>
                          ))
                        ) : (
                          <p className="font-mono text-sm text-slate-500">Loading certifications...</p>
                        )}
                      </ul>

                      {/* Animated Bottom Glow Effect (Emerald variant for Certs) */}
                      <div className="absolute bottom-0 left-0 m-auto h-1.5 w-full rounded bg-gradient-to-l via-emerald-500 transition-all blur-2xl group-hover:blur-xl"></div>
                      <div className="absolute bottom-0 left-1/2 m-auto h-[2px] w-[70%] -translate-x-1/2 rounded bg-gradient-to-l via-emerald-200 transition-all group-hover:w-full group-hover:via-emerald-500 dark:via-emerald-900 dark:group-hover:via-emerald-500"></div>
                    </article>
                  </div>

                </section>

            {/* --- 4. SKILLS --- */}
            <section>
              <div className="mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
                <h2 className="font-mono text-2xl font-bold dark:text-white">Technical Skills</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c] dark:text-slate-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

          </main>
        </MainLayout>
        <Footer />
      </div>
    </ThemeProvider>
  );
}