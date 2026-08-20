import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const links = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      id="top"
      className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-950/75"
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          Sean Brandon F. Reyes
        </a>

        <div className="flex items-center gap-6">
          <div className="hidden items-center gap-5 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-100"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            type="button"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-slate-500"
          >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </nav>
    </header>
  );
}