import { useState } from 'react';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLocation, useNavigate } from 'react-router-dom';

const links = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact', href: '/contact' },
  { label: 'Articles', href: '/articles' },
  { label: 'Library', href: '/books' },
  { label: 'Poetry', href: '/poetry' },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    navigate(href);
    window.scrollTo(0, 0); // Always scroll to top when changing pages
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/75 backdrop-blur-xl dark:border-slate-800 dark:bg-[#121212]/75">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a 
          href="/" 
          onClick={(e) => handleNavigation(e, '/')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white"
        >
          Sean Brandon Reyes
        </a>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden items-center gap-5 md:flex">
            {links.map((link) => {
              // Exact match for Home, startsWith for others to keep active state on detail pages
              const isActive = link.href === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(link.href);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`text-sm font-medium transition-colors ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 font-bold' 
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-400 dark:border-slate-700 dark:bg-[#121212] dark:text-slate-300 dark:hover:border-slate-500"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition md:hidden dark:border-slate-700 dark:bg-[#121212] dark:text-slate-300"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden dark:border-slate-800 dark:bg-[#121212]">
          <div className="flex flex-col gap-2">
            {links.map((link) => {
              const isActive = link.href === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(link.href);

              return (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavigation(e, link.href)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-bold'
                      : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}