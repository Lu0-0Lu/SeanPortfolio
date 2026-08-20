import ThemeProvider from './components/ThemeProvider';
import Navbar from './components/Navbar';
import MainLayout from './components/MainLayout';
import Footer from './components/Footer';

const featuredProject = {
  title: 'Trashure: Automated Recyclable Waste Verification System',
  description:
    'A smart recycling verification platform designed to support waste sorting and tracking through automated checks, real-time feedback, and a cleaner user experience for sustainable operations.',
};

const experience = [
  {
    role: 'Mansfield International OJT',
    period: '2024',
    text: 'Supported institutional technology systems, documentation tasks, and process improvements in a business environment.',
  },
  {
    role: 'CCTV Operator at Local Government Unit, Tandang Sora',
    period: '2023',
    text: 'Monitored live surveillance systems, documented incidents, and supported reporting workflows for operational awareness.',
  },
  {
    role: 'Faculty Intern at San Isidro Labrador Catholic School',
    period: '2022',
    text: 'Assisted with digital learning support and classroom operations to improve student engagement and technology exposure.',
  },
];

const skills = ['PHP', 'JavaScript', 'Python', 'SQL', 'Hardware Integration (ESP32/Raspberry Pi)'];

export default function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
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
                  <a
                    href="#projects"
                    className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 dark:bg-white dark:text-slate-900"
                  >
                    View Projects
                  </a>
                  <a
                    href="#contact"
                    className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-500 dark:border-slate-700 dark:text-slate-100"
                  >
                    Contact Me
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  Featured work
                </div>
                <div className="mt-6 space-y-4">
                  <div className="h-2 w-16 rounded-full bg-slate-900 dark:bg-white" />
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{featuredProject.title}</h2>
                  <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{featuredProject.description}</p>
                </div>
              </div>
            </section>

            <section id="about" className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">About</p>
                <h3 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">A clean, human-centered approach to technology.</h3>
                <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
                  I enjoy working across interfaces, systems, and support workflows to create useful, organized, and reliable digital experiences.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft dark:border-slate-700 dark:bg-slate-900">
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Focus</p>
                <ul className="mt-4 space-y-3 text-base text-slate-900 dark:text-slate-100">
                  <li>• Frontend web development</li>
                  <li>• System and operations support</li>
                  <li>• Embedded and hardware workflows</li>
                  <li>• Process-driven problem solving</li>
                </ul>
              </div>
            </section>

            <section id="projects" className="space-y-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Projects</p>
                <h3 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Selected work</h3>
              </div>

              <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Capstone project</p>
                    <h4 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">{featuredProject.title}</h4>
                  </div>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:border-slate-700 dark:text-slate-300">
                    Active concept
                  </span>
                </div>
                <p className="mt-6 max-w-3xl text-base leading-7 text-slate-600 dark:text-slate-300">
                  {featuredProject.description}
                </p>
              </article>
            </section>

            <section id="experience" className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Experience</p>

              <div className="space-y-5">
                {experience.map((item) => (
                  <article
                    key={item.role}
                    className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-500"
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h4 className="text-xl font-semibold text-slate-900 dark:text-white">{item.role}</h4>
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.period}</span>
                    </div>
                    <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">{item.text}</p>
                  </article>
                ))}
              </div>
            </section>

            <section id="skills" className="space-y-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Skills</p>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
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