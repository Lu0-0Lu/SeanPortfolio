import { useState, useEffect } from 'react';
import ThemeProvider from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import MainLayout from '../components/MainLayout';
import Footer from '../components/Footer';
import { GraduationCap, Award, BadgeCheck, Briefcase } from 'lucide-react';

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
          <main className="space-y-20 pb-20 pt-16 sm:pt-24">
            
            {/* --- 1. INTRODUCTION --- */}
            <section className="max-w-3xl">
              <h1 className="font-mono text-4xl font-bold tracking-tight sm:text-5xl dark:text-white mb-8">
                About Me
              </h1>
              <div className="space-y-6 font-mono text-lg leading-relaxed text-slate-700 dark:text-slate-300">
                <p>
                  I am a highly adaptable Information Technology graduate with a proven track record in enterprise technical support, hardware deployment, and continuous systems monitoring.
                </p>
                <p>
                  With hands-on experience ranging from automating inventory systems to deploying custom AI computer vision models on Raspberry Pi hardware, I thrive in fast-paced operational environments. My goal is to leverage technical troubleshooting and system development skills to streamline IT workflows and support robust enterprise infrastructure.
                </p>
              </div>
            </section>

            {/* --- 2. WORK EXPERIENCE --- */}
            <section>
              <div className="flex items-center gap-3 mb-8 border-b border-slate-200 pb-4 dark:border-slate-800">
                <Briefcase className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                <h2 className="font-mono text-2xl font-bold dark:text-white">Work Experience</h2>
              </div>
              
              <div className="space-y-6">
                {experiences.length > 0 ? (
                  experiences.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition-all hover:border-slate-300 dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-slate-700">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-4">
                        <div>
                          <h3 className="font-mono text-xl font-bold text-slate-900 dark:text-white">{item.role}</h3>
                          <p className="font-medium text-slate-600 dark:text-slate-400">{item.company}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <span className="block text-sm font-medium text-slate-500">{item.period}</span>
                          <span className="block text-sm text-slate-500">{item.location}</span>
                        </div>
                      </div>
                      <ul className="list-inside list-disc space-y-2 text-sm leading-relaxed text-slate-700 marker:text-slate-400 dark:text-slate-300 dark:marker:text-slate-600">
                        {item.bullets.map((bullet, i) => (
                          <li key={i} className="pl-2"><span className="-ml-2">{bullet}</span></li>
                        ))}
                      </ul>
                    </article>
                  ))
                ) : (
                  <p className="text-slate-500 font-mono">Loading experiences...</p>
                )}
              </div>
            </section>

            {/* --- 3. EDUCATION & CERTIFICATIONS (Side-by-side on large screens) --- */}
            <section className="grid gap-8 lg:grid-cols-2">
              
              {/* Education */}
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
                  <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                  <h2 className="font-mono text-2xl font-bold dark:text-white">Education</h2>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">Bachelor of Science in Information Technology</h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">Quezon City University • Graduated June 2026</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 dark:border dark:border-amber-900/50">
                      ⭐ Cum Laude
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 dark:border dark:border-slate-700">
                      🏆 2nd Place IT Quiz Bee
                    </span>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              <div>
                <div className="flex items-center gap-3 mb-6 border-b border-slate-200 pb-4 dark:border-slate-800">
                  <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-500" />
                  <h2 className="font-mono text-2xl font-bold dark:text-white">Certifications</h2>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#1a1a1c]">
                  <ul className="space-y-5">
                    {certifications.length > 0 ? (
                      certifications.map((cert) => (
                        <li key={cert.id} className="flex items-start gap-3">
                          <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                          <div>
                            <a 
                              href={cert.verification_link} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="font-bold text-slate-900 transition hover:text-blue-600 dark:text-white dark:hover:text-blue-400 text-sm"
                            >
                              {cert.title}
                            </a>
                            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                              <span>{cert.issuer}</span>
                              <span>•</span>
                              <span>{cert.date_issued}</span>
                            </div>
                          </div>
                        </li>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500 font-mono">Loading certifications...</p>
                    )}
                  </ul>
                </div>
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