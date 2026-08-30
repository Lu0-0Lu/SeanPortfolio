import { Mail, ArrowUp, FolderGit2 } from 'lucide-react';

export default function Footer() {
  const scrollToTop = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer id="contact" className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-[#121212]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        
        {/* Left: Branding */}
        <div className="flex flex-col gap-1">
          <p className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">Sean Brandon Reyes</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">© 2026 All rights reserved. Built for impact.</p>
        </div>
        
        {/* Right: Social Links & Back to Top */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
          
          {/* Email */}
          <a 
            href="mailto:reyesseanbrandon@gmail.com" 
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold transition-all hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-slate-600 dark:hover:text-white"
          >
            <Mail className="h-3.5 w-3.5" /> Email
          </a>

          {/* GitHub */}
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold transition-all hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-slate-600 dark:hover:text-white"
          >
            <FolderGit2 className="h-3.5 w-3.5" /> GitHub
          </a>

          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/seanbrandonreyes/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold transition-all hover:border-slate-400 hover:text-slate-900 dark:border-slate-800 dark:bg-[#1a1a1c] dark:hover:border-slate-600 dark:hover:text-white"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg> 
            LinkedIn
          </a>

          {/* Back to Top Button with Smooth Scroll */}
          <button 
            onClick={scrollToTop}
            className="ml-auto flex cursor-pointer items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-bold text-white transition-all hover:opacity-90 dark:bg-white dark:text-[#121212] lg:ml-6"
          >
            Back to top <ArrowUp className="h-3 w-3" />
          </button>

        </div>
      </div>
    </footer>
  );
}